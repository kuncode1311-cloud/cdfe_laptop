/**
 * Biến môi trường dùng riêng cho kiểm thử.
 * Toàn bộ là giá trị GIẢ: test không bao giờ đọc file .env và không chạm
 * vào MongoDB Atlas, PayOS, Brevo hay Telegram thật.
 */
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'khoa-bi-mat-chi-dung-cho-kiem-thu';
process.env.JWT_EXPIRES_IN = '1h';
process.env.CLIENT_URL = 'https://trikun.site,http://localhost:3000';

// Cấu hình PayOS giả để kiểm thử chữ ký webhook
process.env.PAYOS_CLIENT_ID = 'client-id-gia';
process.env.PAYOS_API_KEY = 'api-key-gia';
process.env.PAYOS_CHECKSUM_KEY = 'checksum-key-gia';

// Xóa token bot để chắc chắn test không gửi tin nhắn Telegram thật
delete process.env.TELEGRAM_BOT_TOKEN;
delete process.env.BREVO_API_KEY;
