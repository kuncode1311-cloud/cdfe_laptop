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
const { gioiHanRequest } = require('../middleware/gioi-han-request.middleware');

const gioiHanAuth = gioiHanRequest({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: 'Bạn thao tác xác thực quá nhanh. Vui lòng thử lại sau.'
});
const gioiHanOtp = gioiHanRequest({
    windowMs: 15 * 60 * 1000,
    max: 6,
    message: 'Bạn yêu cầu OTP quá nhiều lần. Vui lòng thử lại sau 15 phút.'
});

// Tuyến đường Đăng ký & Đăng nhập (Công khai)
router.post('/dang-ky', gioiHanAuth, dangKy);
router.post('/kich-hoat', gioiHanAuth, kichHoatTaiKhoan);
router.post('/dang-nhap', gioiHanAuth, dangNhap);
router.post('/dang-xuat', xacThucToken, dangXuat);
router.post('/google', gioiHanAuth, dangNhapGoogle);

// Tuyến đường Quên Mật Khẩu & OTP Email
router.post('/quen-mat-khau', gioiHanOtp, yeuCauQuenMatKhau);
router.post('/gui-otp', gioiHanOtp, guiLaiOtp);
router.post('/xac-nhan-otp', gioiHanAuth, xacNhanOtp);
router.post('/dat-lai-mat-khau', gioiHanAuth, datLaiMatKhau);

// Tuyến đường Quản lý hồ sơ cá nhân & Đổi mật khẩu (Yêu cầu Token)
router.get('/toi', xacThucToken, layThongTinCaNhan);
router.put('/cap-nhat-ho-so', xacThucToken, capNhatHoSo);
router.post('/doi-mat-khau/gui-otp', xacThucToken, gioiHanOtp, guiOtpDoiMatKhau);
router.put('/doi-mat-khau', xacThucToken, doiMatKhau);

module.exports = router;
