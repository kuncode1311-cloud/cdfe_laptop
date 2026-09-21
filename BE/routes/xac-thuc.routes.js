const express = require('express');
const router = express.Router();
const {
    dangKy,
    kichHoatTaiKhoan,
    dangNhap,
    layThongTinCaNhan,
    dangNhapGoogle,
    yeuCauQuenMatKhau,
    xacNhanOtp,
    datLaiMatKhau
} = require('../controllers/xac-thuc.controller');
const { xacThucToken } = require('../middleware/xac-thuc.middleware');

// Tuyến đường Đăng ký & Đăng nhập (Công khai)
router.post('/dang-ky', dangKy);
router.post('/kich-hoat', kichHoatTaiKhoan);
router.post('/dang-nhap', dangNhap);
router.post('/google', dangNhapGoogle);

// Tuyến đường Quên Mật Khẩu & OTP Email
router.post('/quen-mat-khau', yeuCauQuenMatKhau);
router.post('/xac-nhan-otp', xacNhanOtp);
router.post('/dat-lai-mat-khau', datLaiMatKhau);

// Tuyến đường Lấy thông tin tài khoản hiện tại (Yêu cầu Token)
router.get('/toi', xacThucToken, layThongTinCaNhan);

module.exports = router;
