const express = require('express');
const router = express.Router();
const {
    taoYeuCauThanhToanPayOS,
    kiemTraTrangThaiPayOS,
    xuLyWebhookPayOS
} = require('../controllers/thanh-toan.controller');

// 1. Tạo liên kết / QR thanh toán PayOS
router.post('/tao-link', taoYeuCauThanhToanPayOS);
router.post('/tao_link', taoYeuCauThanhToanPayOS);

// 2. Kiểm tra trạng thái thanh toán theo orderCode
router.get('/kiem-tra/:orderCode', kiemTraTrangThaiPayOS);
router.get('/kiem_tra/:orderCode', kiemTraTrangThaiPayOS);

// 3. Webhook nhận phản hồi tự động từ PayOS
router.post('/webhook', xuLyWebhookPayOS);
router.post('/payos-webhook', xuLyWebhookPayOS);

module.exports = router;
