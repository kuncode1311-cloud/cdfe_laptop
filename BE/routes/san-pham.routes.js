const express = require('express');
const router = express.Router();
const {
    layTatCaSanPham,
    laySanPhamTheoId,
    themSanPham,
    capNhatSanPham,
    xoaSanPham
} = require('../controllers/san-pham.controller');
const { xacThucToken, chiAdmin } = require('../middleware/xac-thuc.middleware');

// Tuyến đường Công khai (Public): Khách xem sản phẩm
router.get('/', layTatCaSanPham);
router.get('/:id', laySanPhamTheoId);

// Tuyến đường Bảo vệ (Chỉ Admin): Thêm, Sửa, Xóa sản phẩm
router.post('/', xacThucToken, chiAdmin, themSanPham);
router.put('/:id', xacThucToken, chiAdmin, capNhatSanPham);
router.delete('/:id', xacThucToken, chiAdmin, xoaSanPham);

module.exports = router;
