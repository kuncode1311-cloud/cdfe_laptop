const express = require('express');
const router = express.Router();
const {
    layDanhSachDonHang,
    layDonHangTheoIdHoacMa,
    taoDonHangMoi,
    capNhatTrangThaiDonHang,
    xoaDonHang
} = require('../controllers/don-hang.controller');
const { xacThucToken, chiAdmin } = require('../middleware/xac-thuc.middleware');

// Tuyến đường Công khai: Khách xem và tạo đơn hàng
router.get('/', layDanhSachDonHang);
router.get('/:id', layDonHangTheoIdHoacMa);
router.post('/', taoDonHangMoi);

// Tuyến đường Bảo vệ: Chỉ Admin mới được cập nhật trạng thái đơn hoặc xóa đơn
router.put('/:id', xacThucToken, chiAdmin, capNhatTrangThaiDonHang);
router.delete('/:id', xacThucToken, chiAdmin, xoaDonHang);

module.exports = router;
