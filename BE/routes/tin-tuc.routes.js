const express = require('express');
const router = express.Router();
const {
    layDanhSachTinTuc,
    layTinTucTheoIdHoacSlug,
    themTinTuc,
    capNhatTinTuc,
    xoaTinTuc
} = require('../controllers/tin-tuc.controller');
const { xacThucToken, chiAdmin, nhanDienNguoiDungMem } = require('../middleware/xac-thuc.middleware');

// Công khai: khách chỉ thấy bài đã xuất bản; Admin (có token) thấy cả bản nháp
router.get('/', nhanDienNguoiDungMem, layDanhSachTinTuc);
router.get('/:id', nhanDienNguoiDungMem, layTinTucTheoIdHoacSlug);

// Chỉ Admin: thêm, sửa, xóa bài viết
router.post('/', xacThucToken, chiAdmin, themTinTuc);
router.put('/:id', xacThucToken, chiAdmin, capNhatTinTuc);
router.delete('/:id', xacThucToken, chiAdmin, xoaTinTuc);

module.exports = router;
