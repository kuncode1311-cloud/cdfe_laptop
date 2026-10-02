/**
 * Điểm khởi động server (entry point) — `npm start` chạy file này.
 *
 * Thứ tự quan trọng:
 *  1. Nạp biến môi trường (.env) TRƯỚC khi require app, vì các controller đọc
 *     JWT_SECRET, CLIENT_URL... ngay lúc được nạp.
 *  2. Kết nối MongoDB Atlas.
 *  3. Mở cổng HTTP và khởi động Telegram Bot.
 */
require('dotenv').config();

const app = require('./app');
const ketNoiCoSoDuLieu = require('./config/db');
const { khoiTaoTelegramBot } = require('./services/telegram-bot.service');

const PORT = process.env.PORT || 5000;

ketNoiCoSoDuLieu();

app.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`🚀 Backend Express Server đang chạy tại:`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`👉 API Docs (Swagger): http://localhost:${PORT}/api-docs`);
    console.log(`=============================================`);

    // Khởi động dịch vụ Telegram Bot quản lý đơn hàng
    khoiTaoTelegramBot();
});
