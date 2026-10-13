const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const NguoiDung = require('../models/nguoi-dung.model');
const { chuoiAnToan, taoMaOtp, bamOtp, soSanhOtp, kiemTraMatKhauManh, laUrlAnhHopLe } = require('../utils/bao-mat');

const SO_LAN_SAI_OTP_TOI_DA = 5;
const SO_LAN_SAI_MAT_KHAU_TOI_DA = 5;
const THOI_GIAN_KHOA_DANG_NHAP_MS = 15 * 60 * 1000;
// Hash giả để vẫn chạy bcrypt khi email không tồn tại → thời gian phản hồi như nhau, không dò được email
const HASH_GIA = '$2b$10$Gw5l.mAWUO.QOC8XxlGBauOYQgNg2xW1vSAurXo1nCxBrGMUrVuE2';

// Ghi nhận một lần nhập sai OTP; quá 5 lần thì hủy mã để chống dò 1.000.000 tổ hợp
const ghiNhanNhapSaiOtp = async (user) => {
    user.soLanNhapSaiOtp = Number(user.soLanNhapSaiOtp || 0) + 1;
    if (user.soLanNhapSaiOtp >= SO_LAN_SAI_OTP_TOI_DA) {
        user.maOtp = null;
        user.hanOtp = null;
        user.loaiOtp = null;
        user.soLanNhapSaiOtp = 0;
        await user.save();
        return 'Bạn đã nhập sai OTP quá 5 lần. Mã đã bị hủy, vui lòng yêu cầu mã mới!';
    }
    await user.save();
    return `Mã OTP không chính xác! Bạn còn ${SO_LAN_SAI_OTP_TOI_DA - user.soLanNhapSaiOtp} lần thử.`;
};

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET chưa được cấu hình trong biến môi trường.');
}

/**
 * Hàm trợ giúp tạo JSON Web Token (JWT)
 */
const taoToken = (nguoiDung) => {
    return jwt.sign(
        {
            userId: nguoiDung.id,
            email: nguoiDung.email,
            vaiTro: nguoiDung.vaiTro,
            tokenVersion: Number(nguoiDung.tokenVersion || 0)
        },
        JWT_SECRET,
        {
            expiresIn: JWT_EXPIRES_IN
        }
    );
};

const { guiMailOTPQuenMatKhau, guiMailOTPDoiMatKhau, guiMailKichHoatTaiKhoan } = require('../services/email.service');

/**
 * LUỒNG 5: Xác thực & Bảo mật Tài khoản (Authentication & Authorization)
 * - Sử dụng JSON Web Token (JWT) cho các yêu cầu có xác thực (Stateless Session).
 * - Mật khẩu được mã hóa an toàn bằng thuật toán Bcrypt với Salt 10 vòng.
 * - Quy trình Đăng ký 2 bước (Two-Factor Registration) qua OTP Email.
 * - Phòng chống các cuộc tấn công Brute-force & Dò Email (Email Enumeration Timing Attack).
 */
const dangKy = async (req, res) => {
    try {
        const { hoTen, email, soDienThoai, matKhau } = req.body;

        const hoTenClean = chuoiAnToan(hoTen, 100);
        const emailClean = chuoiAnToan(email, 254).toLowerCase();
        const sdtClean = chuoiAnToan(soDienThoai, 20).replace(/\s+/g, '');
        const mkClean = typeof matKhau === 'string' ? matKhau : '';

        // 1. Kiểm tra thông tin bắt buộc
        if (!hoTenClean || !emailClean || !sdtClean || !mkClean) {
            return res.status(400).json({
                thong_diep: 'Vui lòng cung cấp đầy đủ Họ tên, Email, Số điện thoại và Mật khẩu!'
            });
        }

        // 2. Validate Họ tên
        if (hoTenClean.length < 2) {
            return res.status(400).json({
                thong_diep: 'Họ và tên phải có tối thiểu 2 ký tự!'
            });
        }

        // 3. Validate Email chuẩn
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regexEmail.test(emailClean)) {
            return res.status(400).json({
                thong_diep: 'Địa chỉ Email không đúng định dạng (VD: example@gmail.com)!'
            });
        }

        // 4. Validate Số điện thoại chuẩn Việt Nam (10 chữ số)
        const regexSdt = /^(0|\+84)[0-9]{9}$/;
        if (!regexSdt.test(sdtClean)) {
            return res.status(400).json({
                thong_diep:
                    'Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại Việt Nam gồm 10 chữ số (VD: 0912345678).'
            });
        }

        // 5. Validate Mật khẩu theo chính sách mật khẩu mạnh (≥ 8 ký tự, có chữ và số)
        const loiMatKhau = kiemTraMatKhauManh(mkClean);
        if (loiMatKhau) {
            return res.status(400).json({ thong_diep: loiMatKhau });
        }

        // 6. Kiểm tra email đã tồn tại chưa trong bảng người dùng chính thức
        const taiKhoanTonTai = await NguoiDung.findOne({ email: emailClean });
        if (taiKhoanTonTai && taiKhoanTonTai.daKichHoat !== false) {
            return res.status(400).json({
                thong_diep: `Địa chỉ Email "${emailClean}" đã được đăng ký tài khoản trước đó! Vui lòng chuyển sang tab Đăng Nhập hoặc dùng chức năng Quên Mật Khẩu.`
            });
        }

        // Mã hóa mật khẩu với bcrypt (10 vòng salt)
        const salt = await bcrypt.genSalt(10);
        const matKhauHash = await bcrypt.hash(mkClean, salt);

        // Sinh mã OTP 6 số bằng crypto.randomInt (an toàn mật mã)
        const maOtp = taoMaOtp();
        const hanOtp = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

        // LƯU VÀO BẢNG TẠM: TUYỆT ĐỐI KHÔNG LƯU VÀO NguoiDung KHI CHƯA XÁC THỰC OTP
        // 1. Tự động dọn dẹp các bản ghi tạm hết hạn (> 10 phút) để tránh phình rác Database
        await mongoose.connection
            .collection('dang_ky_tam')
            .deleteMany({ hanOtp: { $lt: new Date() } })
            .catch(() => {});
        // 2. Thiết lập TTL Index trên MongoDB để tự động tiêu hủy document khi tới hạn hanOtp
        mongoose.connection
            .collection('dang_ky_tam')
            .createIndex({ hanOtp: 1 }, { expireAfterSeconds: 0 })
            .catch(() => {});

        await mongoose.connection.collection('dang_ky_tam').updateOne(
            { email: emailClean },
            {
                $set: {
                    hoTen: hoTenClean,
                    email: emailClean,
                    soDienThoai: sdtClean,
                    matKhau: matKhauHash,
                    maOtp: bamOtp(maOtp), // Chỉ lưu bản băm của OTP
                    hanOtp,
                    loaiOtp: 'kich_hoat',
                    soLanNhapSaiOtp: 0,
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );

        console.log(`✉️ [Đăng Ký] Đã tạo yêu cầu gửi OTP cho ${emailClean}`);
        const ketQuaGuiMail = await guiMailKichHoatTaiKhoan(emailClean, hoTenClean, maOtp);
        if (!ketQuaGuiMail.thanhCong) {
            return res.status(502).json({
                yeuCauOtp: true,
                email: emailClean,
                daGuiEmail: false,
                thong_diep: 'Không thể gửi email OTP. Vui lòng thử gửi lại sau.',
                chi_tiet: ketQuaGuiMail.loi
            });
        }

        return res.status(200).json({
            yeuCauOtp: true,
            email: emailClean,
            thong_diep: `Mã xác thực kích hoạt tài khoản đã được gửi đến email ${emailClean}. Vui lòng kiểm tra hộp thư!`
        });
    } catch (loi) {
        console.error('Lỗi đăng ký tài khoản:', loi);
        return res.status(500).json({
            thong_diep: 'Đã xảy ra lỗi máy chủ khi đăng ký',
            chi_tiet: loi.message
        });
    }
};

// 1.1. Kích hoạt tài khoản bằng mã OTP
const kichHoatTaiKhoan = async (req, res) => {
    try {
        const emailChuan = chuoiAnToan(req.body.email, 254).toLowerCase();
        const otpClean = chuoiAnToan(req.body.otp, 10);
        if (!emailChuan || !otpClean) {
            return res.status(400).json({ thong_diep: 'Vui lòng cung cấp Email và mã OTP!' });
        }

        // 1. Kiểm tra trong bảng tạm dang_ky_tam trước
        const bangTam = mongoose.connection.collection('dang_ky_tam');
        const tempUser = await bangTam.findOne({ email: emailChuan });
        if (tempUser) {
            if (!soSanhOtp(tempUser.maOtp, otpClean)) {
                // Đếm số lần sai; sai quá 5 lần thì xóa đăng ký tạm, buộc đăng ký lại
                const soLanSai = Number(tempUser.soLanNhapSaiOtp || 0) + 1;
                if (soLanSai >= SO_LAN_SAI_OTP_TOI_DA) {
                    await bangTam.deleteMany({ email: emailChuan });
                    return res
                        .status(400)
                        .json({ thong_diep: 'Bạn đã nhập sai OTP quá 5 lần. Vui lòng đăng ký lại để nhận mã mới!' });
                }
                await bangTam.updateOne({ _id: tempUser._id }, { $set: { soLanNhapSaiOtp: soLanSai } });
                return res.status(400).json({
                    thong_diep: `Mã OTP không chính xác! Bạn còn ${SO_LAN_SAI_OTP_TOI_DA - soLanSai} lần thử.`
                });
            }

            if (tempUser.hanOtp && new Date() > new Date(tempUser.hanOtp)) {
                return res.status(400).json({ thong_diep: 'Mã OTP đã hết hạn! Vui lòng yêu cầu gửi lại mã mới.' });
            }

            // Kiểm tra xem đã có tài khoản chính thức chưa
            const daCo = await NguoiDung.findOne({ email: emailChuan });
            if (daCo && daCo.daKichHoat !== false) {
                await mongoose.connection.collection('dang_ky_tam').deleteMany({ email: emailChuan });
                return res
                    .status(400)
                    .json({ thong_diep: 'Tài khoản này đã được kích hoạt từ trước rồi! Vui lòng đăng nhập.' });
            }

            // Tạo tài khoản chính thức trong NguoiDung
            const nguoiDungMoi = new NguoiDung({
                id: 'usr_' + Date.now(),
                hoTen: tempUser.hoTen,
                email: tempUser.email,
                soDienThoai: tempUser.soDienThoai,
                matKhau: tempUser.matKhau,
                avatar: '',
                vaiTro: 'khach_hang',
                hangThanhVien: 'Thành Viên Mới',
                daKichHoat: true,
                trangThai: 'hoat_dong',
                diemTichLuy: 200,
                viVoucher: []
            });
            await nguoiDungMoi.save();

            // Xóa bản ghi tạm
            await mongoose.connection.collection('dang_ky_tam').deleteMany({ email: emailChuan });

            console.log(`🎉 [Kích Hoạt Tài Khoản Thành Công Từ Bảng Tạm] Email: ${emailChuan}`);
            const token = taoToken(nguoiDungMoi);
            return res.status(200).json({
                thong_diep: 'Kích hoạt tài khoản thành công! Chào mừng bạn gia nhập TNTP Laptop Store.',
                token,
                nguoiDung: nguoiDungMoi
            });
        }

        // Fallback: Kiểm tra trong NguoiDung nếu có tài khoản cũ chưa kích hoạt
        const user = await NguoiDung.findOne({ email: emailChuan });
        if (!user) {
            return res
                .status(404)
                .json({ thong_diep: 'Không tìm thấy thông tin đăng ký cho Email này! Vui lòng đăng ký lại.' });
        }

        if (user.daKichHoat) {
            return res.status(400).json({ thong_diep: 'Tài khoản này đã được kích hoạt từ trước rồi!' });
        }

        if (user.loaiOtp !== 'kich_hoat' || !soSanhOtp(user.maOtp, otpClean)) {
            return res.status(400).json({ thong_diep: await ghiNhanNhapSaiOtp(user) });
        }

        if (new Date() > new Date(user.hanOtp)) {
            return res.status(400).json({ thong_diep: 'Mã OTP đã hết hạn! Vui lòng yêu cầu gửi lại mã mới.' });
        }

        // Kích hoạt tài khoản
        user.daKichHoat = true;
        user.trangThai = 'hoat_dong';
        user.maOtp = null;
        user.hanOtp = null;
        user.loaiOtp = null;
        user.soLanNhapSaiOtp = 0;
        user.tokenVersion = Number(user.tokenVersion || 0) + 1;
        await user.save();

        console.log(`🎉 [Kích Hoạt Tài Khoản Thành Công] Email: ${emailChuan}`);

        // Cấp JWT token và tự động đăng nhập
        const token = taoToken(user);

        return res.status(200).json({
            thong_diep: 'Kích hoạt tài khoản thành công! Chào mừng bạn gia nhập TNTP Laptop Store.',
            token,
            nguoiDung: user
        });
    } catch (loi) {
        console.error('Lỗi kích hoạt tài khoản:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ khi kích hoạt tài khoản', chi_tiet: loi.message });
    }
};

/**
 * [BƯỚC CHÍNH 2]: Đăng nhập tài khoản người dùng
 * Endpoint: POST /api/auth/dang-nhap
 * Cơ chế bảo vệ đa lớp:
 *   Bước 1: Chống NoSQL Injection bằng cách làm sạch chuỗi `chuoiAnToan(email)`.
 *   Bước 2: Chống Timing Attack dò Email: Nếu email không tồn tại trong hệ thống, server vẫn
 *           thực thi `bcrypt.compare(matKhau, HASH_GIA)` để thời gian phản hồi đồng nhất (không đoán được email có thật hay không).
 *   Bước 3: Chống Brute-force mật khẩu: Sau 5 lần nhập sai liên tiếp, khóa đăng nhập tài khoản 15 phút.
 *   Bước 4: Kiểm tra trạng thái kích hoạt tài khoản qua OTP.
 *   Bước 5: Ký và cấp chuỗi mã JSON Web Token (JWT) cho phiên làm việc của người dùng.
 */
const dangNhap = async (req, res) => {
    try {
        // Ép kiểu chuỗi: chặn payload kiểu { "matKhau": { "$ne": null } }
        const emailChuan = chuoiAnToan(req.body.email, 254).toLowerCase();
        const matKhau = typeof req.body.matKhau === 'string' ? req.body.matKhau : '';

        if (!emailChuan || !matKhau) {
            return res.status(400).json({
                thong_diep: 'Vui lòng nhập đầy đủ Email và Mật khẩu!'
            });
        }

        const nguoiDung = await NguoiDung.findOne({ email: emailChuan });

        if (!nguoiDung) {
            // Vẫn chạy bcrypt với hash giả để thời gian phản hồi giống trường hợp sai mật khẩu
            await bcrypt.compare(matKhau, HASH_GIA);
            return res.status(401).json({
                thong_diep: 'Tài khoản hoặc Mật khẩu không chính xác!'
            });
        }

        // Tài khoản đang bị tạm khóa do nhập sai mật khẩu nhiều lần
        if (nguoiDung.khoaDangNhapDen && nguoiDung.khoaDangNhapDen > new Date()) {
            const soPhut = Math.ceil((nguoiDung.khoaDangNhapDen - Date.now()) / 60000);
            res.setHeader('Retry-After', soPhut * 60);
            return res.status(429).json({
                thong_diep: `Tài khoản tạm khóa đăng nhập do nhập sai mật khẩu nhiều lần. Vui lòng thử lại sau ${soPhut} phút.`
            });
        }

        // Kiểm tra mật khẩu băm với bcrypt.
        // Tài khoản Google cũ từng dùng mật khẩu dạng "GoogleOAuth_<sub>" (đoán được) → luôn từ chối dạng này.
        const matKhauDung = !matKhau.startsWith('GoogleOAuth_') && (await nguoiDung.soSanhMatKhau(matKhau));
        if (!matKhauDung) {
            nguoiDung.soLanDangNhapSai = Number(nguoiDung.soLanDangNhapSai || 0) + 1;
            if (nguoiDung.soLanDangNhapSai >= SO_LAN_SAI_MAT_KHAU_TOI_DA) {
                nguoiDung.khoaDangNhapDen = new Date(Date.now() + THOI_GIAN_KHOA_DANG_NHAP_MS);
                nguoiDung.soLanDangNhapSai = 0;
                await nguoiDung.save();
                return res.status(429).json({
                    thong_diep: 'Bạn đã nhập sai mật khẩu 5 lần. Tài khoản tạm khóa đăng nhập 15 phút để bảo vệ.'
                });
            }
            await nguoiDung.save();
            return res.status(401).json({
                thong_diep: 'Tài khoản hoặc Mật khẩu không chính xác!'
            });
        }

        // Kiểm tra tài khoản có đang bị khóa tạm thời không
        if (nguoiDung.biKhoa || nguoiDung.trangThai === 'bi_khoa') {
            return res.status(403).json({
                thong_diep: nguoiDung.lyDoKhoa
                    ? `Tài khoản của bạn đã bị tạm khóa! Lý do: ${nguoiDung.lyDoKhoa}. Vui lòng liên hệ CSKH để được hỗ trợ.`
                    : 'Tài khoản của bạn hiện đang bị tạm khóa. Vui lòng liên hệ quản trị viên để được mở khóa!'
            });
        }

        if (nguoiDung.daKichHoat === false) {
            return res.status(403).json({
                thong_diep: 'Tài khoản chưa được kích hoạt. Vui lòng xác thực email bằng mã OTP!'
            });
        }

        // Đăng nhập đúng → xóa bộ đếm sai
        if (nguoiDung.soLanDangNhapSai || nguoiDung.khoaDangNhapDen) {
            nguoiDung.soLanDangNhapSai = 0;
            nguoiDung.khoaDangNhapDen = null;
            await nguoiDung.save();
        }

        // Tạo JWT Token
        const token = taoToken(nguoiDung);

        return res.status(200).json({
            thong_diep: `Đăng nhập thành công! Xin chào ${nguoiDung.hoTen}.`,
            token,
            nguoiDung
        });
    } catch (loi) {
        console.error('Lỗi đăng nhập:', loi);
        return res.status(500).json({
            thong_diep: 'Đã xảy ra lỗi máy chủ khi đăng nhập',
            chi_tiet: loi.message
        });
    }
};

// 3. Lấy thông tin cá nhân người dùng hiện tại (Yêu cầu JWT Token)
const layThongTinCaNhan = async (req, res) => {
    try {
        // req.user đã được gán bởi middleware xacThucToken
        const userMoiNhat = (await NguoiDung.findOne({ id: req.user.id || req.user.userId })) || req.user;
        return res.status(200).json({
            thong_diep: 'Lấy thông tin tài khoản thành công',
            nguoiDung: userMoiNhat
        });
    } catch (loi) {
        console.error('Lỗi lấy thông tin cá nhân:', loi);
        return res.status(500).json({
            thong_diep: 'Lỗi máy chủ',
            chi_tiet: loi.message
        });
    }
};

// 4. Đăng nhập / Đăng ký qua Google – xác minh ID Token chuẩn OAuth 2.0
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const dangNhapGoogle = async (req, res) => {
    try {
        // Chấp nhận 1 trong 2 bằng chứng do GOOGLE cấp (không bao giờ tin email do client tự khai):
        //  - credential: ID Token (Google Sign-In) → xác minh chữ ký + audience
        //  - accessToken: Access Token (OAuth2 popup) → hỏi lại Google để lấy email thật + kiểm tra audience
        const credential = chuoiAnToan(req.body.credential, 4096);
        const accessToken = chuoiAnToan(req.body.accessToken, 4096);

        if (!credential && !accessToken) {
            return res.status(400).json({ thong_diep: 'Vui lòng cung cấp Google credential hợp lệ!' });
        }

        let googleEmail, googleHoTen, googleAvatar, googleSub;

        try {
            if (credential) {
                const ticket = await googleClient.verifyIdToken({
                    idToken: credential,
                    audience: GOOGLE_CLIENT_ID
                });
                const payload = ticket.getPayload();

                // Chỉ chấp nhận email đã được Google xác minh
                if (!payload.email || payload.email_verified === false) {
                    return res.status(401).json({ thong_diep: 'Email Google chưa được xác minh!' });
                }

                googleEmail = payload.email;
                googleHoTen = payload.name || payload.given_name || 'Google User';
                googleAvatar = payload.picture || '';
                googleSub = payload.sub; // Google unique user ID
            } else {
                // Access Token: kiểm tra token được cấp cho ĐÚNG ứng dụng này (chống dùng token của app khác)
                const thongTinToken = await googleClient.getTokenInfo(accessToken);
                if (!GOOGLE_CLIENT_ID || thongTinToken.aud !== GOOGLE_CLIENT_ID) {
                    return res.status(401).json({ thong_diep: 'Google Access Token không thuộc ứng dụng này!' });
                }
                const phanHoi = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    signal: AbortSignal.timeout(8000)
                });
                if (!phanHoi.ok) throw new Error(`userinfo ${phanHoi.status}`);
                const thongTin = await phanHoi.json();

                if (!thongTin.email || thongTin.email_verified === false || thongTin.sub !== thongTinToken.sub) {
                    return res.status(401).json({ thong_diep: 'Email Google chưa được xác minh!' });
                }

                googleEmail = thongTin.email;
                googleHoTen = thongTin.name || thongTin.given_name || 'Google User';
                googleAvatar = thongTin.picture || '';
                googleSub = thongTin.sub;
            }

            console.log(`✅ Xác minh Google thành công: ${googleEmail}`);
        } catch (verifyErr) {
            console.warn('⚠️ Xác minh Google thất bại:', verifyErr.message);
            return res.status(401).json({
                thong_diep: 'Phiên đăng nhập Google không hợp lệ hoặc đã hết hạn!'
            });
        }

        const emailChuan = googleEmail.trim().toLowerCase();

        // Tìm user trong MongoDB theo email HOẶC googleId
        let nguoiDung = await NguoiDung.findOne({
            $or: [{ email: emailChuan }, { googleId: googleSub }]
        });

        if (!nguoiDung) {
            // Tạo tài khoản mới từ Google
            // Mật khẩu ngẫu nhiên 32 byte (không đoán được) cho tài khoản tạo từ Google
            const salt = await bcrypt.genSalt(10);
            const matKhauHash = await bcrypt.hash(require('crypto').randomBytes(32).toString('hex'), salt);
            nguoiDung = new NguoiDung({
                id: 'usr_gg_' + Date.now(),
                hoTen: googleHoTen,
                email: emailChuan,
                soDienThoai: '',
                matKhau: matKhauHash,
                avatar: googleAvatar || '',
                vaiTro: 'khach_hang',
                hangThanhVien: 'Thành Viên',
                viVoucher: [],
                googleId: googleSub,
                authProvider: 'google'
            });
            await nguoiDung.save();
            console.log(`🆕 Đã tạo tài khoản Google mới: ${emailChuan}`);
        } else {
            // Cập nhật thông tin nếu thay đổi
            let coThayDoi = false;
            if (googleAvatar && googleAvatar !== nguoiDung.avatar) {
                nguoiDung.avatar = googleAvatar;
                coThayDoi = true;
            }
            if (googleSub && !nguoiDung.googleId) {
                nguoiDung.googleId = googleSub;
                coThayDoi = true;
            }
            if (!nguoiDung.authProvider) {
                nguoiDung.authProvider = 'google';
                coThayDoi = true;
            }
            if (coThayDoi) {
                await nguoiDung.save();
            }
        }

        // Kiểm tra tài khoản có đang bị khóa tạm thời không
        if (nguoiDung.biKhoa || nguoiDung.trangThai === 'bi_khoa') {
            return res.status(403).json({
                thong_diep: nguoiDung.lyDoKhoa
                    ? `Tài khoản của bạn đã bị tạm khóa! Lý do: ${nguoiDung.lyDoKhoa}. Vui lòng liên hệ CSKH để được hỗ trợ.`
                    : 'Tài khoản của bạn hiện đang bị tạm khóa. Vui lòng liên hệ quản trị viên để được mở khóa!'
            });
        }

        // Tạo JWT hệ thống
        const token = taoToken(nguoiDung);

        console.log(`🔑 Google Login thành công: ${emailChuan} | Vai trò: ${nguoiDung.vaiTro}`);

        return res.status(200).json({
            thong_diep: `Đăng nhập Google thành công! Xin chào ${nguoiDung.hoTen}.`,
            token,
            nguoiDung
        });
    } catch (loi) {
        console.error('Lỗi đăng nhập Google:', loi);
        return res.status(500).json({
            thong_diep: 'Lỗi máy chủ khi đăng nhập Google',
            chi_tiet: loi.message
        });
    }
};

// 5. Yêu cầu Quên Mật Khẩu (Gửi OTP qua Email)
const yeuCauQuenMatKhau = async (req, res) => {
    try {
        const emailChuan = chuoiAnToan(req.body.email, 254).toLowerCase();
        if (!emailChuan) {
            return res.status(400).json({ thong_diep: 'Vui lòng nhập địa chỉ Email!' });
        }
        const user = await NguoiDung.findOne({ email: emailChuan });

        if (!user) {
            return res.status(200).json({
                thong_diep: 'Nếu email tồn tại trong hệ thống, mã xác thực sẽ được gửi đến hộp thư.',
                daGuiEmail: true
            });
        }

        if (user.daKichHoat === false) {
            const maOtp = taoMaOtp();
            const hanOtp = new Date(Date.now() + 10 * 60 * 1000);
            user.maOtp = bamOtp(maOtp);
            user.soLanNhapSaiOtp = 0;
            user.hanOtp = hanOtp;
            user.loaiOtp = 'kich_hoat';
            await user.save();
            const ketQuaGuiMail = await guiMailKichHoatTaiKhoan(emailChuan, user.hoTen, maOtp);
            if (!ketQuaGuiMail.thanhCong) {
                return res
                    .status(502)
                    .json({ thong_diep: 'Không thể gửi email OTP. Vui lòng thử lại.', daGuiEmail: false });
            }
            return res.status(200).json({
                thong_diep: `Tài khoản chưa được kích hoạt! Đã gửi lại mã OTP kích hoạt mới tới email ${emailChuan}.`,
                email: emailChuan,
                daGuiEmail: true
            });
        }

        // Sinh mã OTP 6 số ngẫu nhiên
        const maOtp = taoMaOtp();
        const hanOtp = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

        user.maOtp = bamOtp(maOtp);
        user.soLanNhapSaiOtp = 0;
        user.hanOtp = hanOtp;
        user.loaiOtp = 'quen_mat_khau';
        await user.save();

        console.log(`🔑 [Quên Mật Khẩu] Đã tạo yêu cầu gửi OTP cho ${emailChuan}`);

        const ketQuaGuiMail = await guiMailOTPQuenMatKhau(emailChuan, user.hoTen, maOtp);
        if (!ketQuaGuiMail.thanhCong) {
            return res
                .status(502)
                .json({ thong_diep: 'Không thể gửi email OTP. Vui lòng thử lại.', daGuiEmail: false });
        }

        return res.status(200).json({
            thong_diep: `Mã OTP đã được gửi đến email ${emailChuan}! Vui lòng kiểm tra hộp thư (cả mục Spam/Thư rác).`,
            email: emailChuan,
            daGuiEmail: true
        });
    } catch (loi) {
        console.error('Lỗi yêu cầu quên mật khẩu:', loi);
        return res.status(500).json({
            thong_diep: 'Lỗi máy chủ khi xử lý yêu cầu quên mật khẩu',
            chi_tiet: loi.message
        });
    }
};

// 5.1. Gửi lại mã OTP (Hỗ trợ cả kích hoạt tài khoản và quên mật khẩu)
const guiLaiOtp = async (req, res) => {
    try {
        const emailChuan = chuoiAnToan(req.body.email, 254).toLowerCase();
        if (!emailChuan) {
            return res.status(400).json({ thong_diep: 'Vui lòng cung cấp Email!' });
        }

        // 1. Kiểm tra trong bảng tạm dang_ky_tam trước (trường hợp khách đang đăng ký và bấm gửi lại OTP)
        const tempUser = await mongoose.connection.collection('dang_ky_tam').findOne({ email: emailChuan });
        if (tempUser) {
            const maOtp = taoMaOtp();
            const hanOtp = new Date(Date.now() + 10 * 60 * 1000);
            await mongoose.connection
                .collection('dang_ky_tam')
                .updateOne(
                    { _id: tempUser._id },
                    { $set: { maOtp: bamOtp(maOtp), hanOtp, soLanNhapSaiOtp: 0, updatedAt: new Date() } }
                );
            guiMailKichHoatTaiKhoan(emailChuan, tempUser.hoTen, maOtp).catch((e) =>
                console.warn('Lỗi gửi mail:', e.message)
            );
            return res.status(200).json({
                thong_diep: `Mã OTP kích hoạt mới đã được gửi tới email ${emailChuan}! Vui lòng kiểm tra hộp thư.`,
                email: emailChuan,
                daGuiEmail: true
            });
        }

        // 2. Kiểm tra trong bảng chính thức NguoiDung (cho Quên mật khẩu hoặc tài khoản cũ)
        const user = await NguoiDung.findOne({ email: emailChuan });

        if (!user) {
            return res.status(200).json({
                thong_diep: 'Nếu email tồn tại trong hệ thống, mã xác thực sẽ được gửi đến hộp thư.',
                daGuiEmail: true
            });
        }

        // Sinh mã OTP 6 số ngẫu nhiên mới
        const maOtp = taoMaOtp();
        const hanOtp = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

        if (user.daKichHoat === false) {
            user.maOtp = bamOtp(maOtp);
            user.soLanNhapSaiOtp = 0;
            user.hanOtp = hanOtp;
            user.loaiOtp = 'kich_hoat';
            await user.save();

            console.log(`✉️ [Gửi Lại OTP Kích Hoạt] Đã tạo yêu cầu cho ${emailChuan}`);
            guiMailKichHoatTaiKhoan(emailChuan, user.hoTen, maOtp).catch((e) =>
                console.warn('Lỗi gửi mail:', e.message)
            );

            return res.status(200).json({
                thong_diep: `Mã OTP kích hoạt mới đã được gửi tới email ${emailChuan}! Vui lòng kiểm tra hộp thư.`,
                email: emailChuan,
                daGuiEmail: true
            });
        }

        user.maOtp = bamOtp(maOtp);
        user.soLanNhapSaiOtp = 0;
        user.hanOtp = hanOtp;
        user.loaiOtp = 'quen_mat_khau';
        await user.save();

        console.log(`🔑 [Gửi Lại OTP Quên Mật Khẩu] Đã tạo yêu cầu cho ${emailChuan}`);
        guiMailOTPQuenMatKhau(emailChuan, user.hoTen, maOtp).catch((e) => console.warn('Lỗi gửi mail:', e.message));

        return res.status(200).json({
            thong_diep: `Mã OTP xác thực mới đã được gửi tới email ${emailChuan}! Vui lòng kiểm tra hộp thư.`,
            email: emailChuan,
            daGuiEmail: true
        });
    } catch (loi) {
        console.error('Lỗi gửi lại mã OTP:', loi);
        return res.status(500).json({
            thong_diep: 'Lỗi máy chủ khi gửi lại mã OTP',
            chi_tiet: loi.message
        });
    }
};

// 6. Xác nhận mã OTP
const xacNhanOtp = async (req, res) => {
    try {
        const emailChuan = chuoiAnToan(req.body.email, 254).toLowerCase();
        const otp = chuoiAnToan(req.body.otp, 10);
        if (!emailChuan || !otp) {
            return res.status(400).json({ thong_diep: 'Vui lòng cung cấp Email và mã OTP!' });
        }

        const user = await NguoiDung.findOne({ email: emailChuan });

        if (!user || user.loaiOtp !== 'quen_mat_khau' || !user.maOtp) {
            return res.status(400).json({ thong_diep: 'Mã OTP không chính xác hoặc đã hết hạn!' });
        }

        // OTP chỉ dùng đúng mục đích "quên mật khẩu"; sai thì đếm lần, quá 5 lần hủy mã
        if (!soSanhOtp(user.maOtp, otp)) {
            return res.status(400).json({ thong_diep: await ghiNhanNhapSaiOtp(user) });
        }

        if (new Date() > new Date(user.hanOtp)) {
            return res.status(400).json({ thong_diep: 'Mã OTP đã hết hạn! Vui lòng yêu cầu gửi lại mã mới.' });
        }

        return res.status(200).json({
            hopLe: true,
            thong_diep: 'Xác thực mã OTP thành công! Mời bạn đặt mật khẩu mới.'
        });
    } catch (loi) {
        console.error('Lỗi xác thực OTP:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ khi xác thực OTP' });
    }
};

// 7. Đặt lại mật khẩu mới với OTP
const datLaiMatKhau = async (req, res) => {
    try {
        const emailChuan = chuoiAnToan(req.body.email, 254).toLowerCase();
        const otp = chuoiAnToan(req.body.otp, 10);
        const matKhauMoi = typeof req.body.matKhauMoi === 'string' ? req.body.matKhauMoi : '';
        if (!emailChuan || !otp || !matKhauMoi) {
            return res.status(400).json({ thong_diep: 'Vui lòng cung cấp đầy đủ thông tin!' });
        }

        const loiMatKhau = kiemTraMatKhauManh(matKhauMoi);
        if (loiMatKhau) {
            return res.status(400).json({ thong_diep: loiMatKhau });
        }

        const user = await NguoiDung.findOne({ email: emailChuan });

        if (!user || user.loaiOtp !== 'quen_mat_khau' || !user.maOtp) {
            return res.status(400).json({ thong_diep: 'Mã OTP không hợp lệ hoặc đã hết hạn!' });
        }

        if (!soSanhOtp(user.maOtp, otp)) {
            return res.status(400).json({ thong_diep: await ghiNhanNhapSaiOtp(user) });
        }

        if (new Date() > new Date(user.hanOtp)) {
            return res.status(400).json({ thong_diep: 'Mã OTP đã hết hạn! Vui lòng yêu cầu lại.' });
        }

        // Băm mật khẩu mới với bcrypt
        const salt = await bcrypt.genSalt(10);
        user.matKhau = await bcrypt.hash(matKhauMoi, salt);
        user.maOtp = null;
        user.hanOtp = null;
        user.loaiOtp = null;
        user.soLanNhapSaiOtp = 0;
        user.soLanDangNhapSai = 0;
        user.khoaDangNhapDen = null;
        user.tokenVersion = Number(user.tokenVersion || 0) + 1; // Thu hồi mọi phiên đăng nhập cũ
        await user.save();

        console.log(`✅ [Đổi Mật Khẩu Thành Công] User: ${emailChuan}`);

        // Tự động cấp Token đăng nhập luôn
        const token = taoToken(user);

        return res.status(200).json({
            thong_diep: 'Đặt lại mật khẩu thành công! Bạn đã có thể đăng nhập bằng mật khẩu mới.',
            token,
            nguoiDung: user
        });
    } catch (loi) {
        console.error('Lỗi đặt lại mật khẩu:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ khi đặt lại mật khẩu' });
    }
};

// 9. Cập nhật hồ sơ cá nhân (Họ tên, SĐT, avatar, giới tính, ngày sinh, sổ địa chỉ)
const capNhatHoSo = async (req, res) => {
    try {
        const userId = req.user.id || req.user.userId;
        const duLieu = req.body;

        const user = await NguoiDung.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ thong_diep: 'Không tìm thấy người dùng!' });
        }

        // Chỉ nhận đúng các trường hồ sơ cho phép (chống Mass Assignment: không thể tự đổi vaiTro, email...)
        const hoTenMoi = chuoiAnToan(duLieu.hoTen, 100);
        if (hoTenMoi) {
            if (hoTenMoi.length < 2)
                return res.status(400).json({ thong_diep: 'Họ và tên phải có tối thiểu 2 ký tự!' });
            user.hoTen = hoTenMoi;
        }
        if (duLieu.soDienThoai !== undefined) {
            const sdtMoi = chuoiAnToan(duLieu.soDienThoai, 20).replace(/\s+/g, '');
            if (sdtMoi && !/^(0|\+84)[0-9]{9}$/.test(sdtMoi)) {
                return res.status(400).json({ thong_diep: 'Số điện thoại không hợp lệ!' });
            }
            user.soDienThoai = sdtMoi;
        }
        if (duLieu.avatar !== undefined) {
            const avatarMoi = chuoiAnToan(duLieu.avatar, 500);
            if (avatarMoi && !laUrlAnhHopLe(avatarMoi)) {
                return res.status(400).json({ thong_diep: 'Đường dẫn ảnh đại diện không hợp lệ!' });
            }
            user.avatar = avatarMoi;
        }
        if (['nam', 'nu', 'khac'].includes(duLieu.gioiTinh)) user.gioiTinh = duLieu.gioiTinh;
        if (duLieu.ngaySinh !== undefined) user.ngaySinh = chuoiAnToan(duLieu.ngaySinh, 20);
        if (Array.isArray(duLieu.danhSachDiaChi)) {
            user.danhSachDiaChi = duLieu.danhSachDiaChi.slice(0, 10).map((dc = {}) => ({
                ...(dc.id ? { id: chuoiAnToan(dc.id, 50) } : {}),
                hoTen: chuoiAnToan(dc.hoTen, 100),
                soDienThoai: chuoiAnToan(dc.soDienThoai, 20),
                diaChiChiTiet: chuoiAnToan(dc.diaChiChiTiet, 255),
                tinhThanh: chuoiAnToan(dc.tinhThanh, 100),
                quanHuyen: chuoiAnToan(dc.quanHuyen, 100),
                phuongXa: chuoiAnToan(dc.phuongXa, 100),
                macDinh: dc.macDinh === true,
                loaiDiaChi: dc.loaiDiaChi === 'van_phong' ? 'van_phong' : 'nha_rieng'
            }));
        }

        await user.save();

        console.log(`✅ [Cập Nhật Hồ Sơ Thành Công] User: ${user.email}`);

        return res.status(200).json({
            thong_diep: 'Cập nhật hồ sơ tài khoản thành công!',
            nguoiDung: user
        });
    } catch (loi) {
        console.error('Lỗi cập nhật hồ sơ:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ khi cập nhật hồ sơ', chi_tiet: loi.message });
    }
};

const guiOtpDoiMatKhau = async (req, res) => {
    try {
        const userId = req.user.id || req.user.userId || req.user._id;
        const conditions = [{ id: userId }, { email: req.user?.email }];
        if (mongoose.isValidObjectId(userId)) conditions.push({ _id: userId });
        const user = await NguoiDung.findOne({ $or: conditions });
        if (!user) return res.status(404).json({ thong_diep: 'Không tìm thấy tài khoản.' });

        // Bắt buộc kiểm tra mật khẩu hiện tại nếu tài khoản có mật khẩu
        const { matKhauCu } = req.body || {};
        if (user.matKhau && user.authProvider !== 'google') {
            if (typeof matKhauCu !== 'string' || !matKhauCu.trim()) {
                return res.status(400).json({ thong_diep: 'Vui lòng nhập mật khẩu hiện tại đang dùng!' });
            }
            const hopLe = await bcrypt.compare(matKhauCu, user.matKhau);
            if (!hopLe) {
                return res.status(400).json({ thong_diep: 'Mật khẩu hiện tại không chính xác!' });
            }
        }

        const maOtp = taoMaOtp();
        user.maOtp = bamOtp(maOtp);
        user.hanOtp = new Date(Date.now() + 10 * 60 * 1000);
        user.loaiOtp = 'doi_mat_khau';
        user.soLanNhapSaiOtp = 0;
        await user.save();

        const ketQua = await guiMailOTPDoiMatKhau(user.email, user.hoTen, maOtp);
        if (!ketQua.thanhCong) {
            console.error('⚠️ [BE] Lỗi gửi email OTP:', ketQua.loi);
            return res.status(502).json({ thong_diep: 'Không thể gửi mã OTP qua email. Vui lòng thử lại sau.' });
        }
        return res.json({ thanhCong: true, thong_diep: `Mã xác thực đã gửi tới ${user.email}.`, email: user.email });
    } catch (loi) {
        console.error('❌ [BE] Lỗi trong guiOtpDoiMatKhau:', loi);
        return res.status(500).json({ thong_diep: 'Không thể gửi mã OTP.', chi_tiet: loi.message });
    }
};

// Đổi mật khẩu sau khi xác thực OTP email.
const doiMatKhau = async (req, res) => {
    try {
        const userId = req.user.id || req.user.userId || req.user._id;
        const { matKhauMoi, otp, matKhauCu } = req.body || {};

        const loiMatKhau = kiemTraMatKhauManh(matKhauMoi);
        if (loiMatKhau) {
            return res.status(400).json({ thong_diep: loiMatKhau });
        }

        const dieuKienTimUser = [{ id: userId }, { email: req.user?.email }];
        if (mongoose.isValidObjectId(userId)) dieuKienTimUser.push({ _id: userId });
        const user = await NguoiDung.findOne({ $or: dieuKienTimUser });

        if (!user) {
            return res.status(404).json({ thong_diep: 'Không tìm thấy tài khoản người dùng!' });
        }

        // Bắt buộc kiểm tra mật khẩu cũ nếu tài khoản có mật khẩu
        if (user.matKhau && user.authProvider !== 'google') {
            if (typeof matKhauCu !== 'string' || !matKhauCu.trim()) {
                return res.status(400).json({ thong_diep: 'Vui lòng nhập mật khẩu hiện tại đang dùng!' });
            }
            const hopLe = await bcrypt.compare(matKhauCu, user.matKhau);
            if (!hopLe) {
                return res.status(400).json({ thong_diep: 'Mật khẩu hiện tại không chính xác!' });
            }
        }

        if (!otp || user.loaiOtp !== 'doi_mat_khau' || !user.hanOtp || user.hanOtp < new Date()) {
            return res.status(400).json({ thong_diep: 'Mã xác thực không đúng hoặc đã hết hạn.' });
        }
        if (!soSanhOtp(user.maOtp, chuoiAnToan(otp, 10))) {
            return res.status(400).json({ thong_diep: await ghiNhanNhapSaiOtp(user) });
        }

        // Băm mật khẩu mới với bcrypt
        const salt = await bcrypt.genSalt(10);
        user.matKhau = await bcrypt.hash(matKhauMoi, salt);
        user.coMatKhau = true;
        user.maOtp = null;
        user.hanOtp = null;
        user.loaiOtp = null;
        user.soLanNhapSaiOtp = 0;
        user.tokenVersion = Number(user.tokenVersion || 0) + 1;
        await user.save();

        console.log(`🔒 [Thiết Lập / Đổi Mật Khẩu Thành Công] User: ${user.email}`);

        const token = taoToken(user);

        return res.status(200).json({
            thanhCong: true,
            token,
            thong_diep: 'Thiết lập mật khẩu thành công! Giờ đây bạn có thể dùng mật khẩu này để đăng nhập.'
        });
    } catch (loi) {
        console.error('Lỗi đổi mật khẩu:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ khi đổi mật khẩu', chi_tiet: loi.message });
    }
};

// 10. Đăng xuất tài khoản và thu hồi phiên trên Database
const dangXuat = async (req, res) => {
    try {
        await NguoiDung.updateOne({ _id: req.user._id }, { $inc: { tokenVersion: 1 } });
        return res.status(200).json({ thanh_cong: true, thong_diep: 'Đăng xuất và thu hồi phiên thành công!' });
    } catch (loi) {
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ khi đăng xuất', chi_tiet: loi.message });
    }
};

module.exports = {
    dangKy,
    kichHoatTaiKhoan,
    dangNhap,
    layThongTinCaNhan,
    dangNhapGoogle,
    yeuCauQuenMatKhau,
    guiLaiOtp,
    xacNhanOtp,
    datLaiMatKhau,
    capNhatHoSo,
    guiOtpDoiMatKhau,
    doiMatKhau,
    dangXuat
};
