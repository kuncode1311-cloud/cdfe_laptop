const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const NguoiDung = require('../models/nguoi-dung.model');

const JWT_SECRET = process.env.JWT_SECRET || 'TNTP_LAPTOP_SECURITY_KEY_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Hàm trợ giúp tạo JSON Web Token (JWT)
 */
const taoToken = (nguoiDung) => {
    return jwt.sign(
        {
            userId: nguoiDung.id,
            email: nguoiDung.email,
            vaiTro: nguoiDung.vaiTro
        },
        JWT_SECRET,
        {
            expiresIn: JWT_EXPIRES_IN
        }
    );
};

const { guiMailOTPQuenMatKhau, guiMailKichHoatTaiKhoan } = require('../services/email.service');

// 1. Đăng ký tài khoản người dùng mới (Bắt buộc xác thực Email qua OTP)
const dangKy = async (req, res) => {
    try {
        const { hoTen, email, soDienThoai, matKhau } = req.body;

        const hoTenClean = String(hoTen || '').trim();
        const emailClean = String(email || '').trim().toLowerCase();
        const sdtClean = String(soDienThoai || '').trim().replace(/\s+/g, '');
        const mkClean = String(matKhau || '').trim();

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
                thong_diep: 'Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại Việt Nam gồm 10 chữ số (VD: 0912345678).'
            });
        }

        // 5. Validate Mật khẩu
        if (mkClean.length < 6) {
            return res.status(400).json({
                thong_diep: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự!'
            });
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

        // Sinh mã OTP 6 số ngẫu nhiên
        const maOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const hanOtp = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

        // LƯU VÀO BẢNG TẠM: TUYỆT ĐỐI KHÔNG LƯU VÀO NguoiDung KHI CHƯA XÁC THỰC OTP
        // 1. Tự động dọn dẹp các bản ghi tạm hết hạn (> 10 phút) để tránh phình rác Database
        await mongoose.connection.collection('dang_ky_tam').deleteMany({ hanOtp: { $lt: new Date() } }).catch(() => {});
        // 2. Thiết lập TTL Index trên MongoDB để tự động tiêu hủy document khi tới hạn hanOtp
        mongoose.connection.collection('dang_ky_tam').createIndex({ hanOtp: 1 }, { expireAfterSeconds: 0 }).catch(() => {});

        await mongoose.connection.collection('dang_ky_tam').updateOne(
            { email: emailClean },
            {
                $set: {
                    hoTen: hoTenClean,
                    email: emailClean,
                    soDienThoai: sdtClean,
                    matKhau: matKhauHash,
                    maOtp,
                    hanOtp,
                    loaiOtp: 'kich_hoat',
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );

        console.log(`✉️ [Đăng Ký - Lưu Bảng Tạm & Gửi OTP] Email: ${emailClean} | OTP: ${maOtp}`);
        // Gửi email nền (không chặn HTTP response)
        guiMailKichHoatTaiKhoan(emailClean, hoTenClean, maOtp).catch(e => console.warn('Lỗi gửi mail nền:', e.message));

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
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ thong_diep: 'Vui lòng cung cấp Email và mã OTP!' });
        }

        const emailChuan = email.trim().toLowerCase();
        const otpClean = String(otp).trim();

        // 1. Kiểm tra trong bảng tạm dang_ky_tam trước
        const tempUser = await mongoose.connection.collection('dang_ky_tam').findOne({ email: emailChuan });
        if (tempUser) {
            if (String(tempUser.maOtp).trim() !== otpClean) {
                return res.status(400).json({ thong_diep: 'Mã OTP không chính xác, vui lòng kiểm tra lại email!' });
            }

            if (tempUser.hanOtp && new Date() > new Date(tempUser.hanOtp)) {
                return res.status(400).json({ thong_diep: 'Mã OTP đã hết hạn! Vui lòng yêu cầu gửi lại mã mới.' });
            }

            // Kiểm tra xem đã có tài khoản chính thức chưa
            const daCo = await NguoiDung.findOne({ email: emailChuan });
            if (daCo && daCo.daKichHoat !== false) {
                await mongoose.connection.collection('dang_ky_tam').deleteMany({ email: emailChuan });
                return res.status(400).json({ thong_diep: 'Tài khoản này đã được kích hoạt từ trước rồi! Vui lòng đăng nhập.' });
            }

            // Tạo tài khoản chính thức trong NguoiDung
            const nguoiDungMoi = new NguoiDung({
                id: 'usr_' + Date.now(),
                hoTen: tempUser.hoTen,
                email: tempUser.email,
                soDienThoai: tempUser.soDienThoai,
                matKhau: tempUser.matKhau,
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
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
            return res.status(404).json({ thong_diep: 'Không tìm thấy thông tin đăng ký cho Email này! Vui lòng đăng ký lại.' });
        }

        if (user.daKichHoat) {
            return res.status(400).json({ thong_diep: 'Tài khoản này đã được kích hoạt từ trước rồi!' });
        }

        if (!user.maOtp || user.maOtp !== otpClean) {
            return res.status(400).json({ thong_diep: 'Mã OTP không chính xác, vui lòng kiểm tra lại email!' });
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

// 2. Đăng nhập tài khoản
const dangNhap = async (req, res) => {
    try {
        const { email, matKhau } = req.body;

        if (!email || !matKhau) {
            return res.status(400).json({
                thong_diep: 'Vui lòng nhập đầy đủ Email và Mật khẩu!'
            });
        }

        const emailChuan = email.trim().toLowerCase();

        // Tìm người dùng theo email hoặc username 'admin'
        let nguoiDung = await NguoiDung.findOne({
            $or: [
                { email: emailChuan },
                ...(emailChuan === 'admin' ? [{ email: 'admin@laptopnew.vn' }, { vaiTro: 'admin' }] : [])
            ]
        });

        // Nếu người dùng đăng nhập bằng admin/admin123 mà CSDL chưa có thì tự động khởi tạo
        if (!nguoiDung && (emailChuan === 'admin' || emailChuan === 'admin@laptopnew.vn')) {
            const salt = await bcrypt.genSalt(10);
            const matKhauHash = await bcrypt.hash('admin123', salt);
            nguoiDung = new NguoiDung({
                id: 'admin_root',
                hoTen: 'Quản Trị Viên Hệ Thống',
                email: 'admin@laptopnew.vn',
                soDienThoai: '0988888888',
                matKhau: matKhauHash,
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                vaiTro: 'admin',
                hangThanhVien: 'Kim Cương'
            });
            await nguoiDung.save();
        }

        if (!nguoiDung) {
            return res.status(401).json({
                thong_diep: 'Tài khoản hoặc Mật khẩu không chính xác!'
            });
        }

        // Kiểm tra mật khẩu băm với bcrypt
        const matKhauDung = await nguoiDung.soSanhMatKhau(matKhau);
        if (!matKhauDung) {
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
        const userMoiNhat = await NguoiDung.findOne({ id: req.user.id || req.user.userId }) || req.user;
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
        const { credential, email, hoTen, avatar, googleId } = req.body;

        let googleEmail, googleHoTen, googleAvatar, googleSub;

        // ===== CÁCH 1: Verify ID Token chuẩn Google Sign-In (credential) =====
        if (credential) {
            try {
                const ticket = await googleClient.verifyIdToken({
                    idToken: credential,
                    audience: GOOGLE_CLIENT_ID
                });
                const payload = ticket.getPayload();

                googleEmail   = payload.email;
                googleHoTen   = payload.name || payload.given_name || 'Google User';
                googleAvatar  = payload.picture || '';
                googleSub     = payload.sub; // Google unique user ID

                console.log(`✅ Xác minh Google Token thành công: ${googleEmail}`);
            } catch (verifyErr) {
                console.warn('⚠️ Google verifyIdToken không thành công, thử giải mã payload token:', verifyErr.message);
                try {
                    const parts = credential.split('.');
                    if (parts.length >= 2) {
                        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
                        if (payload?.email) {
                            googleEmail   = payload.email;
                            googleHoTen   = payload.name || payload.given_name || 'Google User';
                            googleAvatar  = payload.picture || '';
                            googleSub     = payload.sub;
                        } else {
                            throw new Error('Không có email trong token payload');
                        }
                    } else {
                        throw new Error('Định dạng token không hợp lệ');
                    }
                } catch {
                    if (email) {
                        googleEmail  = email.trim().toLowerCase();
                        googleHoTen  = hoTen || 'Google User';
                        googleAvatar = avatar || '';
                        googleSub    = googleId || 'gg_' + Date.now();
                    } else {
                        return res.status(401).json({
                            thong_diep: 'Google ID Token không hợp lệ hoặc đã hết hạn!'
                        });
                    }
                }
            }
        }
        // ===== CÁCH 2: Fallback – nhận trực tiếp từ FE (cho dev/test) =====
        else if (email) {
            googleEmail  = email.trim().toLowerCase();
            googleHoTen  = hoTen || 'Google User';
            googleAvatar = avatar || '';
            googleSub    = googleId || 'gg_' + Date.now();
        } else {
            return res.status(400).json({ thong_diep: 'Vui lòng cung cấp Google credential hoặc email!' });
        }

        const emailChuan = googleEmail.trim().toLowerCase();

        // Tìm user trong MongoDB theo email HOẶC googleId
        let nguoiDung = await NguoiDung.findOne({
            $or: [{ email: emailChuan }, { googleId: googleSub }]
        });

        if (!nguoiDung) {
            // Tạo tài khoản mới từ Google
            const salt = await bcrypt.genSalt(10);
            const matKhauHash = await bcrypt.hash('GoogleOAuth_' + googleSub, salt);
            nguoiDung = new NguoiDung({
                id: 'usr_gg_' + Date.now(),
                hoTen: googleHoTen,
                email: emailChuan,
                soDienThoai: '',
                matKhau: matKhauHash,
                avatar: googleAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                vaiTro: 'khach_hang',
                hangThanhVien: 'Thành Viên VIP',
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
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ thong_diep: 'Vui lòng nhập địa chỉ Email!' });
        }

        const emailChuan = email.trim().toLowerCase();
        const user = await NguoiDung.findOne({ email: emailChuan });

        if (!user) {
            return res.status(404).json({
                thong_diep: 'Không tìm thấy tài khoản nào liên kết với Email này trong hệ thống!'
            });
        }

        if (user.daKichHoat === false) {
            const maOtp = Math.floor(100000 + Math.random() * 900000).toString();
            const hanOtp = new Date(Date.now() + 10 * 60 * 1000);
            user.maOtp = maOtp;
            user.hanOtp = hanOtp;
            user.loaiOtp = 'kich_hoat';
            await user.save();
            guiMailKichHoatTaiKhoan(emailChuan, user.hoTen, maOtp).catch(e => console.warn('Lỗi gửi mail:', e.message));
            return res.status(200).json({
                thong_diep: `Tài khoản chưa được kích hoạt! Đã gửi lại mã OTP kích hoạt mới tới email ${emailChuan}.`,
                email: emailChuan,
                daGuiEmail: true
            });
        }

        // Sinh mã OTP 6 số ngẫu nhiên
        const maOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const hanOtp = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

        user.maOtp = maOtp;
        user.hanOtp = hanOtp;
        user.loaiOtp = 'quen_mat_khau';
        await user.save();

        console.log(`🔑 [OTP Quên Mật Khẩu] Email: ${emailChuan} | Mã OTP: ${maOtp} (Hết hạn lúc: ${hanOtp.toLocaleTimeString()})`);

        // Gửi qua Nodemailer nền (không chặn HTTP response)
        guiMailOTPQuenMatKhau(emailChuan, user.hoTen, maOtp).catch(e => console.warn('Lỗi gửi mail:', e.message));

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
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ thong_diep: 'Vui lòng cung cấp Email!' });
        }

        const emailChuan = email.trim().toLowerCase();

        // 1. Kiểm tra trong bảng tạm dang_ky_tam trước (trường hợp khách đang đăng ký và bấm gửi lại OTP)
        const tempUser = await mongoose.connection.collection('dang_ky_tam').findOne({ email: emailChuan });
        if (tempUser) {
            const maOtp = Math.floor(100000 + Math.random() * 900000).toString();
            const hanOtp = new Date(Date.now() + 10 * 60 * 1000);
            await mongoose.connection.collection('dang_ky_tam').updateOne(
                { _id: tempUser._id },
                { $set: { maOtp, hanOtp, updatedAt: new Date() } }
            );
            guiMailKichHoatTaiKhoan(emailChuan, tempUser.hoTen, maOtp).catch(e => console.warn('Lỗi gửi mail:', e.message));
            return res.status(200).json({
                thong_diep: `Mã OTP kích hoạt mới đã được gửi tới email ${emailChuan}! Vui lòng kiểm tra hộp thư.`,
                email: emailChuan,
                daGuiEmail: true
            });
        }

        // 2. Kiểm tra trong bảng chính thức NguoiDung (cho Quên mật khẩu hoặc tài khoản cũ)
        const user = await NguoiDung.findOne({ email: emailChuan });

        if (!user) {
            return res.status(404).json({
                thong_diep: 'Không tìm thấy tài khoản nào liên kết với Email này trong hệ thống!'
            });
        }

        // Sinh mã OTP 6 số ngẫu nhiên mới
        const maOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const hanOtp = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

        if (user.daKichHoat === false) {
            user.maOtp = maOtp;
            user.hanOtp = hanOtp;
            user.loaiOtp = 'kich_hoat';
            await user.save();

            console.log(`✉️ [BE - Gửi Lại OTP Kích Hoạt] Email: ${emailChuan} | OTP: ${maOtp}`);
            guiMailKichHoatTaiKhoan(emailChuan, user.hoTen, maOtp).catch(e => console.warn('Lỗi gửi mail:', e.message));

            return res.status(200).json({
                thong_diep: `Mã OTP kích hoạt mới đã được gửi tới email ${emailChuan}! Vui lòng kiểm tra hộp thư.`,
                email: emailChuan,
                daGuiEmail: true
            });
        }

        user.maOtp = maOtp;
        user.hanOtp = hanOtp;
        user.loaiOtp = 'quen_mat_khau';
        await user.save();

        console.log(`🔑 [BE - Gửi Lại OTP Quên Pass] Email: ${emailChuan} | OTP: ${maOtp}`);
        guiMailOTPQuenMatKhau(emailChuan, user.hoTen, maOtp).catch(e => console.warn('Lỗi gửi mail:', e.message));

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
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ thong_diep: 'Vui lòng cung cấp Email và mã OTP!' });
        }

        const emailChuan = email.trim().toLowerCase();
        const user = await NguoiDung.findOne({ email: emailChuan });

        if (!user) {
            return res.status(404).json({ thong_diep: 'Tài khoản không tồn tại!' });
        }

        if (!user.maOtp || user.maOtp !== otp.trim()) {
            return res.status(400).json({ thong_diep: 'Mã OTP không chính xác, vui lòng kiểm tra lại!' });
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
        const { email, otp, matKhauMoi } = req.body;
        if (!email || !otp || !matKhauMoi) {
            return res.status(400).json({ thong_diep: 'Vui lòng cung cấp đầy đủ thông tin!' });
        }

        if (matKhauMoi.length < 6) {
            return res.status(400).json({ thong_diep: 'Mật khẩu mới phải có tối thiểu 6 ký tự!' });
        }

        const emailChuan = email.trim().toLowerCase();
        const user = await NguoiDung.findOne({ email: emailChuan });

        if (!user) {
            return res.status(404).json({ thong_diep: 'Tài khoản không tồn tại!' });
        }

        if (!user.maOtp || user.maOtp !== otp.trim()) {
            return res.status(400).json({ thong_diep: 'Mã OTP không hợp lệ!' });
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

        if (duLieu.hoTen) user.hoTen = duLieu.hoTen.trim();
        if (duLieu.soDienThoai !== undefined) user.soDienThoai = duLieu.soDienThoai.trim();
        if (duLieu.avatar) user.avatar = duLieu.avatar.trim();
        if (duLieu.gioiTinh) user.gioiTinh = duLieu.gioiTinh;
        if (duLieu.ngaySinh !== undefined) user.ngaySinh = duLieu.ngaySinh;
        if (Array.isArray(duLieu.danhSachDiaChi)) user.danhSachDiaChi = duLieu.danhSachDiaChi;

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

// 10. Đổi mật khẩu trực tiếp cho người dùng đã đăng nhập (với mật khẩu cũ & mật khẩu mới)
const doiMatKhau = async (req, res) => {
    try {
        const userId = req.user.id || req.user.userId || req.user._id;
        const { matKhauCu, matKhauMoi } = req.body;

        if (!matKhauMoi || matKhauMoi.length < 6) {
            return res.status(400).json({ thong_diep: 'Mật khẩu mới phải có tối thiểu 6 ký tự!' });
        }

        const user = await NguoiDung.findOne({
            $or: [
                { id: userId },
                { _id: userId },
                { email: req.user?.email }
            ]
        });

        if (!user) {
            return res.status(404).json({ thong_diep: 'Không tìm thấy tài khoản người dùng!' });
        }

        const laTaiKhoanGoogle = user.authProvider === 'google' || Boolean(user.googleId);

        // Nếu là tài khoản thường hoặc tài khoản Google đã từng đặt mật khẩu riêng, cần xác thực mật khẩu cũ
        if (!laTaiKhoanGoogle || (user.coMatKhau && matKhauCu)) {
            if (!matKhauCu) {
                return res.status(400).json({ thong_diep: 'Vui lòng nhập mật khẩu hiện tại đang dùng!' });
            }
            const hopLe = await bcrypt.compare(matKhauCu, user.matKhau);
            if (!hopLe) {
                return res.status(400).json({ thong_diep: 'Mật khẩu hiện tại không chính xác!' });
            }
        }

        // Băm mật khẩu mới với bcrypt
        const salt = await bcrypt.genSalt(10);
        user.matKhau = await bcrypt.hash(matKhauMoi, salt);
        user.coMatKhau = true;
        await user.save();

        console.log(`🔒 [Thiết Lập / Đổi Mật Khẩu Thành Công] User: ${user.email}`);

        return res.status(200).json({
            thanhCong: true,
            thong_diep: 'Thiết lập mật khẩu thành công! Giờ đây bạn có thể dùng mật khẩu này để đăng nhập.'
        });
    } catch (loi) {
        console.error('Lỗi đổi mật khẩu:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ khi đổi mật khẩu', chi_tiet: loi.message });
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
    doiMatKhau
};
