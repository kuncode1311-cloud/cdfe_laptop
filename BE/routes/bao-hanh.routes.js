const express = require('express');
const router = express.Router();
const { traCuuBaoHanh, layDanhSachBaoHanhAdmin, capNhatGhiDeBaoHanh } = require('../controllers/bao-hanh.controller');
const { xacThucToken, chiAdmin } = require('../middleware/xac-thuc.middleware');
const { gioiHanRequest } = require('../middleware/gioi-han-request.middleware');

const gioiHanTraCuuBaoHanh = gioiHanRequest({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: 'Bạn tra cứu quá nhiều lần. Vui lòng thử lại sau.'
});

// [Admin] Quản lý bảo hành: đặt TRƯỚC các route công khai cho rõ ràng thứ tự khớp route
router.get('/quan-tri/tat-ca', xacThucToken, chiAdmin, layDanhSachBaoHanhAdmin);
router.patch('/ghi-de', xacThucToken, chiAdmin, capNhatGhiDeBaoHanh);

// GET /api/bao-hanh?tu_khoa=... hoặc /api/bao-hanh/tra-cuu?tu_khoa=...
router.get('/', gioiHanTraCuuBaoHanh, traCuuBaoHanh);
router.get('/tra-cuu', gioiHanTraCuuBaoHanh, traCuuBaoHanh);

module.exports = router;
