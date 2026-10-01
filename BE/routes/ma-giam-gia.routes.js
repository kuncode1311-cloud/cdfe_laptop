const express = require('express');
const router = express.Router();
const {
    layDanhSachMaGiamGia,
    kiemTraMaGiamGia,
    themMaGiamGia,
    capNhatMaGiamGia,
    xoaMaGiamGia,
    luuMaVoucherVaoVi,
    layViVoucherNguoiDung
} = require('../controllers/ma-giam-gia.controller');
const { xacThucToken, chiAdmin } = require('../middleware/xac-thuc.middleware');
const { gioiHanRequest } = require('../middleware/gioi-han-request.middleware');

const gioiHanKiemTraVoucher = gioiHanRequest({ windowMs: 10 * 60 * 1000, max: 40 });

// Tuyến đường Công khai: Khách xem và áp dụng voucher
router.get('/', layDanhSachMaGiamGia);
router.post('/kiem-tra', gioiHanKiemTraVoucher, kiemTraMaGiamGia);

// Tuyến đường Người dùng đã đăng nhập: Săn mã vào ví & Xem ví voucher
router.post('/luu-ma', xacThucToken, luuMaVoucherVaoVi);
router.get('/vi-cua-toi', xacThucToken, layViVoucherNguoiDung);

// Tuyến đường Bảo vệ: Chỉ Admin mới được Thêm, Sửa, Xóa Voucher
router.post('/', xacThucToken, chiAdmin, themMaGiamGia);
router.put('/:id', xacThucToken, chiAdmin, capNhatMaGiamGia);
router.delete('/:id', xacThucToken, chiAdmin, xoaMaGiamGia);

module.exports = router;
