const express = require('express');
const router = express.Router();
const { traCuuBaoHanh } = require('../controllers/bao-hanh.controller');
const { gioiHanRequest } = require('../middleware/gioi-han-request.middleware');

const gioiHanTraCuuBaoHanh = gioiHanRequest({ windowMs: 15 * 60 * 1000, max: 30, message: 'Bạn tra cứu quá nhiều lần. Vui lòng thử lại sau.' });

// GET /api/bao-hanh?tu_khoa=... hoặc /api/bao-hanh/tra-cuu?tu_khoa=...
router.get('/', gioiHanTraCuuBaoHanh, traCuuBaoHanh);
router.get('/tra-cuu', gioiHanTraCuuBaoHanh, traCuuBaoHanh);

module.exports = router;
