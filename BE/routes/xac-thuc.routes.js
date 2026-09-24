const express = require('express');
const router = express.Router();
const {
    dangKy,
    kichHoatTaiKhoan,
    dangNhap,
    layThongTinCaNhan,
    dangNhapGoogle,
    yeuCauQuenMatKhau,
    guiLaiOtp,
    xacNhanOtp,
    datLaiMatKhau,
    capNhatHoSo,
    guiOtpDoiMatKhau,
    doiMatKhau,
    dangXuat
} = require('../controllers/xac-thuc.controller');
const { xacThucToken } = require('../middleware/xac-thuc.middleware');

// Tuyến đường Đăng ký & Đăng nhập (Công khai)
router.post('/dang-ky', dangKy);
router.post('/kich-hoat', kichHoatTaiKhoan);
router.post('/dang-nhap', dangNhap);
router.post('/dang-xuat', dangXuat);
router.post('/google', dangNhapGoogle);

// Tuyến đường Quên Mật Khẩu & OTP Email
router.post('/quen-mat-khau', yeuCauQuenMatKhau);
router.post('/gui-otp', guiLaiOtp);
router.post('/xac-nhan-otp', xacNhanOtp);
router.post('/dat-lai-mat-khau', datLaiMatKhau);

// Tuyến đường Quản lý hồ sơ cá nhân & Đổi mật khẩu (Yêu cầu Token)
router.get('/toi', xacThucToken, layThongTinCaNhan);
router.put('/cap-nhat-ho-so', xacThucToken, capNhatHoSo);
router.post('/doi-mat-khau/gui-otp', xacThucToken, guiOtpDoiMatKhau);
router.put('/doi-mat-khau', xacThucToken, doiMatKhau);

module.exports = router;
