const express = require('express');
const router = express.Router();
const lienHeController = require('../controllers/lien-he.controller');

// 1. Tuyến đường gửi yêu cầu tư vấn & liên hệ từ khách hàng (Public)
router.post('/', lienHeController.guiYeuCauLienHe);

// 2. Tuyến đường xem danh sách phiếu liên hệ
router.get('/', lienHeController.layDanhSachLienHe);

module.exports = router;
