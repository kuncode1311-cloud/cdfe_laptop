const express = require('express');
const router = express.Router();
const { layGioHang, luuGioHang } = require('../controllers/gio-hang.controller');
const { xacThucToken } = require('../middleware/xac-thuc.middleware');
const { gioiHanRequest } = require('../middleware/gioi-han-request.middleware');

// Giới hạn 120 lần ghi / phút / IP: Front-End lưu giỏ sau mỗi lần khách đổi (đã gộp 0,6 giây), đủ dùng bình thường
const gioiHanLuuGio = gioiHanRequest({ windowMs: 60 * 1000, max: 120, message: 'Bạn thao tác giỏ hàng quá nhanh.' });

// Giỏ hàng chỉ dành cho người đã đăng nhập
router.get('/', xacThucToken, layGioHang);
router.put('/', xacThucToken, gioiHanLuuGio, luuGioHang);

module.exports = router;
