/**
 * Hàm tạo dữ liệu mẫu (test fixtures) dùng chung cho kiểm thử tích hợp.
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NguoiDung = require('../../models/nguoi-dung.model');
const SanPham = require('../../models/san-pham.model');

const MAT_KHAU_MAU = 'MatKhau123';

// Tạo tài khoản đã kích hoạt; ghi đè trường bất kỳ qua `tuyChon` (vd: vaiTro, biKhoa)
const taoNguoiDung = async (tuyChon = {}) => {
    const soNgauNhien = Math.floor(Math.random() * 1e9);
    return NguoiDung.create({
        id: `usr_test_${soNgauNhien}`,
        hoTen: 'Người Dùng Test',
        email: `test${soNgauNhien}@gmail.com`,
        soDienThoai: '0912345678',
        matKhau: await bcrypt.hash(MAT_KHAU_MAU, 4), // 4 vòng salt cho test chạy nhanh
        vaiTro: 'khach_hang',
        ...tuyChon
    });
};

// Ký JWT giống hệt cách controller đăng nhập tạo token
const taoTokenCho = (nguoiDung) =>
    jwt.sign(
        {
            userId: nguoiDung.id,
            email: nguoiDung.email,
            vaiTro: nguoiDung.vaiTro,
            tokenVersion: Number(nguoiDung.tokenVersion || 0)
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

// Tạo một sản phẩm laptop đủ các trường bắt buộc của schema
const taoSanPham = async (tuyChon = {}) =>
    SanPham.create({
        id: 'asus-zenbook-14-test',
        slug: 'asus-zenbook-14-test',
        ma_san_pham: 'UX3405-TEST',
        ten_san_pham: 'ASUS Zenbook 14 OLED Test',
        hang_san_xuat: 'asus',
        gia_khuyen_mai: 25990000,
        hinh_anh_chinh: '/images/sp/zenbook.jpg',
        ...tuyChon
    });

module.exports = { MAT_KHAU_MAU, taoNguoiDung, taoTokenCho, taoSanPham };
