const express = require('express');
const router = express.Router();
const {
    layDanhGiaTheoSanPham,
    themDanhGiaMoi,
    tangLuotThich
} = require('../controllers/danh-gia.controller');
const { xacThucToken } = require('../middleware/xac-thuc.middleware');
const { gioiHanRequest } = require('../middleware/gioi-han-request.middleware');

const gioiHanGuiDanhGia = gioiHanRequest({ windowMs: 60 * 60 * 1000, max: 8, message: 'Bạn gửi đánh giá quá nhiều lần. Vui lòng thử lại sau.' });
const gioiHanThichDanhGia = gioiHanRequest({ windowMs: 60 * 1000, max: 30 });

// Định tuyến API Đánh giá & Bình luận
router.get('/', layDanhGiaTheoSanPham);
router.get('/:productId', layDanhGiaTheoSanPham);
router.post('/', xacThucToken, gioiHanGuiDanhGia, themDanhGiaMoi);
router.patch('/:id/thich', gioiHanThichDanhGia, tangLuotThich);

module.exports = router;
