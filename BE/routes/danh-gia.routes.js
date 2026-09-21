const express = require('express');
const router = express.Router();
const {
    layDanhGiaTheoSanPham,
    themDanhGiaMoi,
    tangLuotThich
} = require('../controllers/danh-gia.controller');

// Định tuyến API Đánh giá & Bình luận
router.get('/', layDanhGiaTheoSanPham);
router.get('/:productId', layDanhGiaTheoSanPham);
router.post('/', themDanhGiaMoi);
router.patch('/:id/thich', tangLuotThich);

module.exports = router;
