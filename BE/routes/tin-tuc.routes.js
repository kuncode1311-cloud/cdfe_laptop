const express = require('express');
const {
    layDanhSachTinTuc,
    layTinTucTheoIdHoacSlug,
    themTinTuc,
    capNhatTinTuc,
    xoaTinTuc
} = require('../controllers/tin-tuc.controller');
const { xacThucToken, chiAdmin } = require('../middleware/xac-thuc.middleware');

const router = express.Router();

// Công khai: đọc tin tức
router.get('/', layDanhSachTinTuc);
router.get('/:id', layTinTucTheoIdHoacSlug);

// Chỉ Admin: soạn, sửa, xóa bài viết
router.post('/', xacThucToken, chiAdmin, themTinTuc);
router.put('/:id', xacThucToken, chiAdmin, capNhatTinTuc);
router.delete('/:id', xacThucToken, chiAdmin, xoaTinTuc);

module.exports = router;
