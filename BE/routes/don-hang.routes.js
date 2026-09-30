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

const bucketTraCuuDonHang = new Map();
const gioiHanTraCuuDonHang = (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 10 * 60 * 1000;
    const maxRequests = 30;
    const current = bucketTraCuuDonHang.get(ip) || { count: 0, resetAt: now + windowMs };

    if (now > current.resetAt) {
        current.count = 0;
        current.resetAt = now + windowMs;
    }

    current.count += 1;
    bucketTraCuuDonHang.set(ip, current);

    if (current.count > maxRequests) {
        return res.status(429).json({
            thong_diep: 'Bạn tra cứu quá nhiều lần. Vui lòng thử lại sau ít phút.'
        });
    }

    next();
};

// Tuyến đường Đơn hàng: Tự động nhận diện tài khoản để cách ly dữ liệu
router.get('/', nhanDienNguoiDungTuyChon, layDanhSachDonHang);
router.get('/:id', gioiHanTraCuuDonHang, nhanDienNguoiDungTuyChon, layDonHangTheoIdHoacMa);
router.post('/', nhanDienNguoiDungTuyChon, taoDonHangMoi);

// Tuyến đường Bảo vệ: Cập nhật đơn hàng (Admin hoặc chính chủ đơn đã xác thực)
router.put('/:id', xacThucToken, capNhatTrangThaiDonHang);
// Xóa đơn hàng (Chỉ Admin mới có quyền xóa)
router.delete('/:id', xacThucToken, chiAdmin, xoaDonHang);

module.exports = router;
