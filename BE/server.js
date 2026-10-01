const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ketNoiCoSoDuLieu = require('./config/db');
const { datHeaderBaoMat, chongNoSqlInjection } = require('./middleware/bao-mat.middleware');
const { gioiHanRequest } = require('./middleware/gioi-han-request.middleware');

// 1. Nạp biến môi trường từ .env
// Reloaded: 2026-09-15 19:22
dotenv.config();

// 2. Khởi tạo ứng dụng Express
const app = express();
const PORT = process.env.PORT || 5000;

// Railway/production đặt ứng dụng sau một reverse proxy; cấu hình này giúp req.ip
// phản ánh đúng IP khách mà không tin tùy tiện toàn bộ chuỗi X-Forwarded-For.
if (process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// 3. Kết nối Cơ sở dữ liệu MongoDB Atlas
ketNoiCoSoDuLieu();

// 4. Middlewares
const corsOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
    .split(',')
    .map(url => url.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        // Cho phép Postman/server-to-server (không có Origin) và frontend đã khai báo.
        if (!origin || corsOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS không cho phép origin: ${origin}`));
    },
    credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Bảo mật toàn cục: ẩn công nghệ server, thêm security headers, lọc NoSQL Injection
app.disable('x-powered-by');
app.use(datHeaderBaoMat);
app.use(chongNoSqlInjection);
// Giới hạn tần suất toàn cục: tối đa 300 request / phút / IP cho mọi API (chống spam, DoS mức ứng dụng)
app.use('/api', gioiHanRequest({ windowMs: 60 * 1000, max: 300, message: 'Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.' }));

// Không trả stack/thông báo lỗi từ database hoặc SDK ra ngoài ở production.
app.use((req, res, next) => {
    const jsonGoc = res.json.bind(res);
    res.json = (payload) => {
        if (process.env.NODE_ENV === 'production' && res.statusCode >= 400 && payload && typeof payload === 'object') {
            const payloadAnToan = { ...payload };
            delete payloadAnToan.chi_tiet;
            return jsonGoc(payloadAnToan);
        }
        return jsonGoc(payload);
    };
    next();
});

// Log request đơn giản
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
    next();
});

// 5. Import các Tuyến đường (Routes)
const xacThucRoutes = require('./routes/xac-thuc.routes');
const sanPhamRoutes = require('./routes/san-pham.routes');
const donHangRoutes = require('./routes/don-hang.routes');
const maGiamGiaRoutes = require('./routes/ma-giam-gia.routes');
const danhGiaRoutes = require('./routes/danh-gia.routes');
const nguoiDungRoutes = require('./routes/nguoi-dung.routes');
const danhMucRoutes = require('./routes/danh-muc.routes');
const tinTucRoutes = require('./routes/tin-tuc.routes');
const baoHanhRoutes = require('./routes/bao-hanh.routes');
const thanhToanRoutes = require('./routes/thanh-toan.routes');
const lienHeRoutes = require('./routes/lien-he.routes');
const caiDatRoutes = require('./routes/cai-dat.routes');
const troLyAiRoutes = require('./routes/tro-ly-ai.routes');
const { khoiTaoTelegramBot } = require('./services/telegram-bot.service');

// 6. Gắn các Tuyến đường REST API chuẩn (/api/...)
app.use('/api/auth', xacThucRoutes);
app.use('/api/san-pham', sanPhamRoutes);
app.use('/api/don-hang', donHangRoutes);
app.use('/api/ma-giam-gia', maGiamGiaRoutes);
app.use('/api/danh-gia', danhGiaRoutes);
app.use('/api/nguoi-dung', nguoiDungRoutes);
app.use('/api/danh-muc', danhMucRoutes);
app.use('/api/tin-tuc', tinTucRoutes);
app.use('/api/bao-hanh', baoHanhRoutes);
app.use('/api/thanh-toan', thanhToanRoutes);
app.use('/api/lien-he', lienHeRoutes);
app.use('/api/cai-dat', caiDatRoutes);
app.use('/api/tro-ly-ai', troLyAiRoutes);

// 8. Tuyến đường kiểm tra máy chủ
app.get('/', (req, res) => {
    res.status(200).json({
        thong_diep: '🚀 LaptopNew Express API Server (Bảo mật JWT + RBAC) đang hoạt động!',
        phien_ban: '1.1.0',
        mo_hinh: 'MVC (Model - Controller - Route - Middleware)',
        co_so_du_lieu: 'MongoDB Atlas',
        cac_endpoint_chinh: [
            '/api/auth/dang-nhap',
            '/api/auth/dang-ky',
            '/api/auth/toi',
            '/api/san-pham',
            '/api/don-hang',
            '/api/ma-giam-gia',
            '/api/danh-gia'
        ]
    });
});

// Tuyến đường kiểm tra sức khỏe hệ thống
app.get('/api/health', (req, res) => {
    res.status(200).json({ trang_thai: 'OK', thoi_gian: new Date().toISOString() });
});

// 9. Xử lý lỗi 404 cho các route không tồn tại
app.use((req, res) => {
    res.status(404).json({
        thong_diep: `Đường dẫn không tồn tại: ${req.originalUrl}`
    });
});

// 10. Xử lý lỗi hệ thống tổng quát (500)
app.use((err, req, res, next) => {
    // Lỗi do client gửi sai: JSON hỏng, body quá lớn, origin không được phép → không phải lỗi 500
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ thong_diep: 'Dữ liệu JSON gửi lên không hợp lệ!' });
    }
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ thong_diep: 'Dữ liệu gửi lên vượt quá giới hạn 1MB!' });
    }
    if (String(err.message || '').startsWith('CORS')) {
        return res.status(403).json({ thong_diep: 'Origin không được phép truy cập API này.' });
    }

    console.error('❌ Lỗi máy chủ chưa được bắt:', err.stack);
    const payload = {
        thong_diep: 'Đã xảy ra lỗi nội bộ trên máy chủ!'
    };
    if (process.env.NODE_ENV !== 'production') {
        payload.chi_tiet = err.message;
    }
    res.status(500).json(payload);
});

// 11. Khởi chạy Server
app.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`🚀 Backend Express Server đang chạy tại:`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`👉 API Docs: http://localhost:${PORT}/`);
    console.log(`=============================================`);

    // Khởi động dịch vụ Telegram Bot quản lý đơn hàng
    khoiTaoTelegramBot();
});
