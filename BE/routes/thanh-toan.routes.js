const express = require('express');
const router = express.Router();
const {
    taoYeuCauThanhToanPayOS,
    kiemTraTrangThaiPayOS,
    xuLyWebhookPayOS
} = require('../controllers/thanh-toan.controller');
const { xacThucToken } = require('../middleware/xac-thuc.middleware');
const { gioiHanRequest } = require('../middleware/gioi-han-request.middleware');

const gioiHanTaoThanhToan = gioiHanRequest({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Bạn tạo yêu cầu thanh toán quá nhiều lần. Vui lòng thử lại sau.'
});
const gioiHanKiemTraThanhToan = gioiHanRequest({ windowMs: 60 * 1000, max: 60 });

// 1. Tạo liên kết / QR thanh toán PayOS
router.post('/tao-link', xacThucToken, gioiHanTaoThanhToan, taoYeuCauThanhToanPayOS);
router.post('/tao_link', xacThucToken, gioiHanTaoThanhToan, taoYeuCauThanhToanPayOS);

// 2. Kiểm tra trạng thái thanh toán theo orderCode
router.get('/kiem-tra/:orderCode', gioiHanKiemTraThanhToan, kiemTraTrangThaiPayOS);
router.get('/kiem_tra/:orderCode', gioiHanKiemTraThanhToan, kiemTraTrangThaiPayOS);

// 3. Webhook nhận phản hồi tự động từ PayOS
router.post('/webhook', xuLyWebhookPayOS);
router.post('/payos-webhook', xuLyWebhookPayOS);

module.exports = router;
