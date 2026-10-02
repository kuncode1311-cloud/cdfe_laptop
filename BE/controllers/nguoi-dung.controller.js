const NguoiDung = require('../models/nguoi-dung.model');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { chuoiAnToan, kiemTraMatKhauManh } = require('../utils/bao-mat');

/**
 * Controller xử lý Người dùng / Tài khoản (chỉ Admin — routes đã gắn xacThucToken + chiAdmin)
 */

// Admin chỉ được thay đổi đúng các trường này (chống Mass Assignment:
// không thể ghi đè tokenVersion, OTP, googleId, bộ đếm bảo mật... qua body).
const TRUONG_ADMIN_DUOC_SUA = ['hoTen', 'soDienThoai', 'avatar', 'vaiTro', 'hangThanhVien', 'trangThai', 'biKhoa', 'lyDoKhoa', 'gioiTinh', 'ngaySinh'];

const locDuLieuChoPhep = (duLieu = {}) => {
    const ketQua = {};
    for (const truong of TRUONG_ADMIN_DUOC_SUA) {
        if (duLieu[truong] === undefined) continue;
        const giaTri = duLieu[truong];
        ketQua[truong] = typeof giaTri === 'boolean' ? giaTri : chuoiAnToan(giaTri, 255);
    }
    return ketQua;
};

const laChinhMinh = (req, user) => user && (
    String(user._id) === String(req.user._id) || String(user.id) === String(req.user.id)
);

const timNguoiDung = async (id) => {
    const dinhDanh = String(id || '').slice(0, 254);
    const dieuKien = [{ id: dinhDanh }, { email: dinhDanh.toLowerCase() }];
    if (/^[0-9a-fA-F]{24}$/.test(dinhDanh)) dieuKien.push({ _id: dinhDanh });
    return NguoiDung.findOne({ $or: dieuKien });
};

// 1. Lấy danh sách hoặc tìm người dùng theo query (email)
const layDanhSachNguoiDung = async (req, res) => {
    try {
        const email = chuoiAnToan(req.query.email, 254).toLowerCase();
        const filter = email ? { email } : {};

        const danhSach = await NguoiDung.find(filter).sort({ ngayTao: -1 });
        return res.status(200).json(danhSach);
    } catch (loi) {
        console.error('Lỗi lấy thông tin người dùng:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ', chi_tiet: loi.message });
    }
};

// 2. Admin tạo tài khoản người dùng mới
const taoNguoiDungMoi = async (req, res) => {
    try {
        const email = chuoiAnToan(req.body.email, 254).toLowerCase();
        const hoTen = chuoiAnToan(req.body.hoTen, 100);
        const matKhau = typeof req.body.matKhau === 'string' ? req.body.matKhau : '';

        if (!email || !hoTen || !matKhau) {
            return res.status(400).json({ thong_diep: 'Vui lòng nhập đầy đủ Họ tên, Email và Mật khẩu!' });
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            return res.status(400).json({ thong_diep: 'Email không đúng định dạng!' });
        }
        const loiMatKhau = kiemTraMatKhauManh(matKhau);
        if (loiMatKhau) {
            return res.status(400).json({ thong_diep: loiMatKhau });
        }

        const daTonTai = await NguoiDung.findOne({ email });
        if (daTonTai) {
            return res.status(400).json({ thong_diep: 'Email này đã được đăng ký tài khoản!' });
        }

        // Chỉ nhận các trường cho phép; mật khẩu luôn được băm bcrypt trước khi lưu
        const nguoiDungMoi = new NguoiDung({
            ...locDuLieuChoPhep(req.body),
            id: `usr_${Date.now()}_${crypto.randomInt(100, 1000)}`,
            hoTen,
            email,
            matKhau: await bcrypt.hash(matKhau, await bcrypt.genSalt(10)),
            daKichHoat: true
        });
        const ketQua = await nguoiDungMoi.save();
        return res.status(201).json(ketQua);
    } catch (loi) {
        console.error('Lỗi tạo người dùng:', loi);
        return res.status(400).json({ thong_diep: 'Không thể tạo tài khoản', chi_tiet: loi.message });
    }
};

// 3. Cập nhật thông tin người dùng (khóa / mở khóa, đổi vai trò...)
const capNhatNguoiDung = async (req, res) => {
    try {
        const user = await timNguoiDung(req.params.id);
        if (!user) {
            return res.status(404).json({ thong_diep: `Không tìm thấy người dùng: ${req.params.id}` });
        }

        const duLieuCapNhat = locDuLieuChoPhep(req.body);

        // Admin không được tự khóa hoặc tự hạ quyền chính mình (tránh mất quyền quản trị hệ thống)
        if (laChinhMinh(req, user)) {
            if (duLieuCapNhat.biKhoa === true || duLieuCapNhat.trangThai === 'bi_khoa'
                || (duLieuCapNhat.vaiTro && duLieuCapNhat.vaiTro !== 'admin')) {
                return res.status(400).json({ thong_diep: 'Bạn không thể tự khóa hoặc tự hạ quyền tài khoản Admin của chính mình!' });
            }
        }

        // Đặt lại mật khẩu bởi Admin: phải đạt chính sách mật khẩu mạnh và luôn được băm
        if (typeof req.body.matKhau === 'string' && req.body.matKhau) {
            const loiMatKhau = kiemTraMatKhauManh(req.body.matKhau);
            if (loiMatKhau) return res.status(400).json({ thong_diep: loiMatKhau });
            duLieuCapNhat.matKhau = await bcrypt.hash(req.body.matKhau, await bcrypt.genSalt(10));
        }

        // Khóa tài khoản / đổi vai trò / đổi mật khẩu → thu hồi ngay mọi token đang dùng
        const canThuHoiPhien = duLieuCapNhat.biKhoa === true || duLieuCapNhat.trangThai === 'bi_khoa'
            || (duLieuCapNhat.vaiTro && duLieuCapNhat.vaiTro !== user.vaiTro) || duLieuCapNhat.matKhau;

        const capNhat = { $set: duLieuCapNhat };
        if (canThuHoiPhien) capNhat.$inc = { tokenVersion: 1 };

        const ketQua = await NguoiDung.findByIdAndUpdate(user._id, capNhat, { returnDocument: 'after', runValidators: true });
        return res.status(200).json(ketQua);
    } catch (loi) {
        console.error('Lỗi cập nhật người dùng:', loi);
        return res.status(400).json({ thong_diep: 'Không thể cập nhật người dùng', chi_tiet: loi.message });
    }
};

// 4. Xóa người dùng (cho Admin)
const xoaNguoiDung = async (req, res) => {
    try {
        const user = await timNguoiDung(req.params.id);
        if (!user) {
            return res.status(404).json({ thong_diep: `Không tìm thấy người dùng để xóa: ${req.params.id}` });
        }
        if (laChinhMinh(req, user)) {
            return res.status(400).json({ thong_diep: 'Bạn không thể tự xóa tài khoản Admin đang đăng nhập!' });
        }

        await NguoiDung.findByIdAndDelete(user._id);
        return res.status(200).json({ thong_diep: 'Đã xóa người dùng thành công', email: user.email });
    } catch (loi) {
        console.error('Lỗi xóa người dùng:', loi);
        return res.status(500).json({ thong_diep: 'Không thể xóa người dùng', chi_tiet: loi.message });
    }
};

module.exports = {
    layDanhSachNguoiDung,
    taoNguoiDungMoi,
    capNhatNguoiDung,
    xoaNguoiDung
};
