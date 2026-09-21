const express = require('express');
const router = express.Router();
const {
    layDanhSachNguoiDung,
    taoNguoiDungMoi,
    capNhatNguoiDung,
    xoaNguoiDung
} = require('../controllers/nguoi-dung.controller');
const { xacThucToken, chiAdmin } = require('../middleware/xac-thuc.middleware');

// Định tuyến API Người dùng
router.get('/', layDanhSachNguoiDung);
router.post('/', taoNguoiDungMoi);
router.put('/:id', xacThucToken, chiAdmin, capNhatNguoiDung);
router.delete('/:id', xacThucToken, chiAdmin, xoaNguoiDung);

module.exports = router;
