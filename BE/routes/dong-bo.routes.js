const express = require('express');
const router = express.Router();
const { layPhienBanDuLieu } = require('../controllers/dong-bo.controller');

// Công khai: chỉ trả chữ ký phiên bản của các bảng, không chứa dữ liệu
router.get('/', layPhienBanDuLieu);

module.exports = router;
