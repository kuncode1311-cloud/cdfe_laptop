const express = require('express');
const router = express.Router();
const caiDatController = require('../controllers/cai-dat.controller');
const { xacThucToken, chiAdmin } = require('../middleware/xac-thuc.middleware');

// 1. Lấy danh sách showroom & tọa độ GPS (Public)
router.get('/showroom', caiDatController.layCaiDatShowroom);

// 2. Cập nhật danh sách showroom & tọa độ GPS (Chỉ Admin)
router.put('/showroom', xacThucToken, chiAdmin, caiDatController.capNhatCaiDatShowroom);

// 3. Khôi phục danh sách showroom mặc định (Chỉ Admin — hiện đã ngừng hỗ trợ, trả 410)
router.post('/showroom/khoi-phuc', xacThucToken, chiAdmin, caiDatController.khoiPhucShowroomMacDinh);

module.exports = router;
