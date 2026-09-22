const express = require('express');
const router = express.Router();
const {
    layDanhSachDonHang,
    layDonHangTheoIdHoacMa,
    taoDonHangMoi,
    capNhatTrangThaiDonHang,
    xoaDonHang
} = require('../controllers/don-hang.controller');
const { xacThucToken, chiAdmin, nhanDienNguoiDungTuyChon } = require('../middleware/xac-thuc.middleware');

// Tuyến đường Đơn hàng: Tự động nhận diện tài khoản để cách ly dữ liệu
router.get('/', nhanDienNguoiDungTuyChon, layDanhSachDonHang);
router.get('/:id', nhanDienNguoiDungTuyChon, layDonHangTheoIdHoacMa);
router.post('/', nhanDienNguoiDungTuyChon, taoDonHangMoi);

// Tuyến đường Bảo vệ: Cập nhật đơn hàng (Admin hoặc chính chủ đơn đã xác thực)
router.put('/:id', xacThucToken, capNhatTrangThaiDonHang);
// Xóa đơn hàng (Chỉ Admin mới có quyền xóa)
router.delete('/:id', xacThucToken, chiAdmin, xoaDonHang);

module.exports = router;
