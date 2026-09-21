const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NguoiDung = require('../models/nguoi-dung.model');

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
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        }
    );
};

const { guiMailOTPQuenMatKhau, guiMailKichHoatTaiKhoan } = require('../services/email.service');

// 1. Đăng ký tài khoản người dùng mới (Bắt buộc xác thực Email qua OTP)
const dangKy = async (req, res) => {
    try {
        const { hoTen, email, soDienThoai, matKhau } = req.body;

        // Kiểm tra thông tin bắt buộc
        if (!hoTen || !email || !matKhau) {
            return res.status(400).json({
                thong_diep: 'Vui lòng cung cấp đầy đủ Họ tên, Email và Mật khẩu!'
            });
        }

        if (matKhau.length < 6) {
            return res.status(400).json({
                thong_diep: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự!'
            });
        }

        const emailChuan = email.trim().toLowerCase();

        // Kiểm tra email đã tồn tại chưa
        const taiKhoanTonTai = await NguoiDung.findOne({ email: emailChuan });
        if (taiKhoanTonTai) {
            if (taiKhoanTonTai.daKichHoat) {
                return res.status(400).json({
                    thong_diep: 'Địa chỉ Email này đã được đăng ký tài khoản. Vui lòng Đăng nhập hoặc dùng chức năng Quên mật khẩu!'
                });
            }

            // Nếu tài khoản đã đăng ký nhưng CHƯA kích hoạt, cho phép cập nhật thông tin và gửi lại mã OTP mới
            const maOtpMoi = Math.floor(100000 + Math.random() * 900000).toString();
            const hanOtpMoi = new Date(Date.now() + 10 * 60 * 1000);
            const salt = await bcrypt.genSalt(10);
            taiKhoanTonTai.matKhau = await bcrypt.hash(matKhau, salt);
            taiKhoanTonTai.hoTen = hoTen.trim();
            taiKhoanTonTai.soDienThoai = soDienThoai ? soDienThoai.trim() : '';
            taiKhoanTonTai.maOtp = maOtpMoi;
            taiKhoanTonTai.hanOtp = hanOtpMoi;
            taiKhoanTonTai.loaiOtp = 'kich_hoat';
            await taiKhoanTonTai.save();

            console.log(`✉️ [Đăng Ký - Gửi Lại OTP] Email: ${emailChuan} | OTP: ${maOtpMoi}`);
            await guiMailKichHoatTaiKhoan(emailChuan, taiKhoanTonTai.hoTen, maOtpMoi);

            return res.status(200).json({
                yeuCauOtp: true,
                email: emailChuan,
                thong_diep: `Mã xác thực kích hoạt tài khoản đã được gửi đến email ${emailChuan}. Vui lòng kiểm tra hộp thư!`
            });
        }

        // Mã hóa mật khẩu với bcrypt (10 vòng salt)
        const salt = await bcrypt.genSalt(10);
        const matKhauHash = await bcrypt.hash(matKhau, salt);

        // Sinh mã OTP 6 số ngẫu nhiên
        const maOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const hanOtp = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

        // Tạo tài khoản mới với trạng thái daKichHoat = false (chờ OTP)
        const nguoiDungMoi = new NguoiDung({
            id: 'usr_' + Date.now(),
            hoTen: hoTen.trim(),
            email: emailChuan,
            soDienThoai: soDienThoai ? soDienThoai.trim() : '',
            matKhau: matKhauHash,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            vaiTro: 'khach_hang',
            hangThanhVien: 'Thành Viên Mới',
            diemTichLuy: 100,
            daKichHoat: false,
            maOtp: maOtp,
            hanOtp: hanOtp,
            loaiOtp: 'kich_hoat'
        });

        await nguoiDungMoi.save();

        console.log(`✉️ [Đăng Ký Mới - Gửi OTP] Email: ${emailChuan} | OTP: ${maOtp}`);
        await guiMailKichHoatTaiKhoan(emailChuan, hoTen.trim(), maOtp);

        return res.status(200).json({
            yeuCauOtp: true,
            email: emailChuan,
            thong_diep: `Mã xác thực kích hoạt tài khoản đã được gửi đến email ${emailChuan}. Vui lòng kiểm tra hộp thư!`
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
        const user = await NguoiDung.findOne({ email: emailChuan });

        if (!user) {
            return res.status(404).json({ thong_diep: 'Không tìm thấy thông tin đăng ký cho Email này!' });
        }

        if (user.daKichHoat) {
            return res.status(400).json({ thong_diep: 'Tài khoản này đã được kích hoạt từ trước rồi!' });
        }

        if (!user.maOtp || user.maOtp !== otp.trim()) {
            return res.status(400).json({ thong_diep: 'Mã OTP không chính xác, vui lòng kiểm tra lại email!' });
        }

        if (new Date() > new Date(user.hanOtp)) {
            return res.status(400).json({ thong_diep: 'Mã OTP đã hết hạn! Vui lòng yêu cầu gửi lại mã mới.' });
        }

        // Kích hoạt tài khoản
        user.daKichHoat = true;
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
                hangThanhVien: 'Kim Cương',
                diemTichLuy: 9999
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
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const dangNhapGoogle = async (req, res) => {
    try {
        const { credential, email, hoTen, avatar, googleId } = req.body;

        let googleEmail, googleHoTen, googleAvatar, googleSub;

        // ===== CÁCH 1: Verify ID Token chuẩn Google Sign-In (credential) =====
        if (credential) {
            try {
                const ticket = await googleClient.verifyIdToken({
                    idToken: credential,
                    audience: process.env.GOOGLE_CLIENT_ID
                });
                const payload = ticket.getPayload();

                googleEmail   = payload.email;
                googleHoTen   = payload.name || payload.given_name || 'Google User';
                googleAvatar  = payload.picture || '';
                googleSub     = payload.sub; // Google unique user ID

                console.log(`✅ Xác minh Google Token thành công: ${googleEmail}`);
            } catch (verifyErr) {
                console.error('❌ Google Token không hợp lệ:', verifyErr.message);
                return res.status(401).json({
                    thong_diep: 'Google ID Token không hợp lệ hoặc đã hết hạn!'
                });
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
                diemTichLuy: 200,
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
            return res.status(400).json({
                thong_diep: 'Tài khoản này chưa được kích hoạt xác thực email! Vui lòng kích hoạt tài khoản trước.'
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

        // Gửi qua Nodemailer
        const ketQua = await guiMailOTPQuenMatKhau(emailChuan, user.hoTen, maOtp);

        return res.status(200).json({
            thong_diep: ketQua.thanhCong 
                ? `Mã OTP đã được gửi đến email ${emailChuan}! Vui lòng kiểm tra hộp thư (cả mục Spam/Thư rác).`
                : `Không thể gửi email lúc này, vui lòng thử lại sau!`,
            email: emailChuan,
            daGuiEmail: ketQua.thanhCong
        });
    } catch (loi) {
        console.error('Lỗi yêu cầu quên mật khẩu:', loi);
        return res.status(500).json({
            thong_diep: 'Lỗi máy chủ khi xử lý yêu cầu quên mật khẩu',
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

module.exports = {
    dangKy,
    kichHoatTaiKhoan,
    dangNhap,
    layThongTinCaNhan,
    dangNhapGoogle,
    yeuCauQuenMatKhau,
    xacNhanOtp,
    datLaiMatKhau
};
