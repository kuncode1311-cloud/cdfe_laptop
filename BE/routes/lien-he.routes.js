const express = require('express');
const router = express.Router();
const lienHeController = require('../controllers/lien-he.controller');
const { xacThucToken, chiAdmin } = require('../middleware/xac-thuc.middleware');

// 1. Tuyến đường gửi yêu cầu tư vấn & liên hệ từ khách hàng (Public)
router.post('/', lienHeController.guiYeuCauLienHe);

// 2. Tuyến đường xem danh sách phiếu liên hệ (Chỉ Admin)
router.get('/', xacThucToken, chiAdmin, lienHeController.layDanhSachLienHe);

// 3. Cập nhật trạng thái và ghi chú nội bộ CSKH (Chỉ Admin)
router.patch('/:id', xacThucToken, chiAdmin, lienHeController.capNhatLienHe);
router.put('/:id', xacThucToken, chiAdmin, lienHeController.capNhatLienHe);

// 4. Xóa phiếu liên hệ (Chỉ Admin)
router.delete('/:id', xacThucToken, chiAdmin, lienHeController.xoaLienHe);

module.exports = router;
