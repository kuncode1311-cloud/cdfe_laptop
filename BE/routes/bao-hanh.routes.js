const express = require('express');
const router = express.Router();
const { traCuuBaoHanh } = require('../controllers/bao-hanh.controller');

// GET /api/bao-hanh?tu_khoa=... hoặc /api/bao-hanh/tra-cuu?tu_khoa=...
router.get('/', traCuuBaoHanh);
router.get('/tra-cuu', traCuuBaoHanh);

module.exports = router;
