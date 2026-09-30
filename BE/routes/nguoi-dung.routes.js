const express = require('express');
const router = express.Router();
const {
    layDanhSachNguoiDung,
    taoNguoiDungMoi,
    capNhatNguoiDung,
    xoaNguoiDung
} = require('../controllers/nguoi-dung.controller');
const { xacThucToken, chiAdmin } = require('../middleware/xac-thuc.middleware');

// Định tuyến API Người dùng — toàn bộ chỉ dành cho Admin quản trị tài khoản
router.get('/', xacThucToken, chiAdmin, layDanhSachNguoiDung);
router.post('/', xacThucToken, chiAdmin, taoNguoiDungMoi);
router.put('/:id', xacThucToken, chiAdmin, capNhatNguoiDung);
router.delete('/:id', xacThucToken, chiAdmin, xoaNguoiDung);

module.exports = router;
