const express = require('express');
const router = express.Router();
const {
    layDanhSachDanhMuc,
    taoDanhMucMoi,
    capNhatDanhMuc,
    xoaDanhMuc
} = require('../controllers/danh-muc.controller');
const { xacThucToken, chiAdmin } = require('../middleware/xac-thuc.middleware');

// Tuyến đường REST API Danh Mục & Hãng
router.get('/', layDanhSachDanhMuc);
router.post('/', xacThucToken, chiAdmin, taoDanhMucMoi);
router.put('/:id', xacThucToken, chiAdmin, capNhatDanhMuc);
router.delete('/:id', xacThucToken, chiAdmin, xoaDanhMuc);

module.exports = router;
