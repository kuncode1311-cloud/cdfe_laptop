const express = require('express');
const router = express.Router();
const {
    layDanhGiaTheoSanPham,
    themDanhGiaMoi,
    tangLuotThich,
    layDanhGiaChoAdmin,
    anHienDanhGia,
    xoaDanhGia
} = require('../controllers/danh-gia.controller');
const { xacThucToken, chiAdmin } = require('../middleware/xac-thuc.middleware');
const { gioiHanRequest } = require('../middleware/gioi-han-request.middleware');

const gioiHanGuiDanhGia = gioiHanRequest({
    windowMs: 60 * 60 * 1000,
    max: 8,
    message: 'Bạn gửi đánh giá quá nhiều lần. Vui lòng thử lại sau.'
});
const gioiHanThichDanhGia = gioiHanRequest({ windowMs: 60 * 1000, max: 30 });

// Định tuyến API Đánh giá & Bình luận
router.get('/', layDanhGiaTheoSanPham);
// Đặt route tĩnh '/quan-tri/tat-ca' TRƯỚC route động '/:productId' để không bị nuốt mất
router.get('/quan-tri/tat-ca', xacThucToken, chiAdmin, layDanhGiaChoAdmin);
router.get('/:productId', layDanhGiaTheoSanPham);
router.post('/', xacThucToken, gioiHanGuiDanhGia, themDanhGiaMoi);
router.patch('/:id/thich', gioiHanThichDanhGia, tangLuotThich);
router.patch('/:id/an-hien', xacThucToken, chiAdmin, anHienDanhGia);
router.delete('/:id', xacThucToken, chiAdmin, xoaDanhGia);

module.exports = router;
