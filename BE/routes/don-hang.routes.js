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
const { gioiHanRequest } = require('../middleware/gioi-han-request.middleware');

// Tra cứu đơn công khai: tối đa 30 lần / 10 phút / IP, vượt quá trả 429 → chống dò mã đơn hàng loạt
const gioiHanTraCuuDonHang = gioiHanRequest({
    windowMs: 10 * 60 * 1000,
    max: 30,
    message: 'Bạn tra cứu quá nhiều lần. Vui lòng thử lại sau ít phút.'
});

// Tuyến đường Đơn hàng: Tự động nhận diện tài khoản để cách ly dữ liệu
router.get('/', xacThucToken, layDanhSachDonHang);
router.get('/:id', gioiHanTraCuuDonHang, nhanDienNguoiDungTuyChon, layDonHangTheoIdHoacMa);
router.post('/', xacThucToken, taoDonHangMoi);

// Tuyến đường Bảo vệ: Cập nhật đơn hàng (Admin hoặc chính chủ đơn đã xác thực)
router.put('/:id', xacThucToken, capNhatTrangThaiDonHang);
// Xóa đơn hàng (Chỉ Admin mới có quyền xóa)
router.delete('/:id', xacThucToken, chiAdmin, xoaDonHang);

module.exports = router;
