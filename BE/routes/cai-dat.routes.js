const express = require('express');
const router = express.Router();
const caiDatController = require('../controllers/cai-dat.controller');

// 1. Lấy danh sách showroom & tọa độ GPS (Public)
router.get('/showroom', caiDatController.layCaiDatShowroom);

// 2. Cập nhật danh sách showroom & tọa độ GPS (Admin)
router.put('/showroom', caiDatController.capNhatCaiDatShowroom);

// 3. Khôi phục danh sách showroom mặc định
router.post('/showroom/khoi-phuc', caiDatController.khoiPhucShowroomMacDinh);

module.exports = router;
