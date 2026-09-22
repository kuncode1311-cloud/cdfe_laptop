const express = require('express');
const router = express.Router();
const lienHeController = require('../controllers/lien-he.controller');

// 1. Tuyến đường gửi yêu cầu tư vấn & liên hệ từ khách hàng (Public)
router.post('/', lienHeController.guiYeuCauLienHe);

// 2. Tuyến đường xem danh sách phiếu liên hệ (Admin)
router.get('/', lienHeController.layDanhSachLienHe);

// 3. Cập nhật trạng thái và ghi chú nội bộ CSKH (Admin)
router.patch('/:id', lienHeController.capNhatLienHe);
router.put('/:id', lienHeController.capNhatLienHe);

// 4. Xóa phiếu liên hệ (Admin)
router.delete('/:id', lienHeController.xoaLienHe);

module.exports = router;
