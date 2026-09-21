const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ketNoiCoSoDuLieu = require('./config/db');

// 1. Nạp biến môi trường từ .env
// Reloaded: 2026-09-15 19:22
dotenv.config();

// 2. Khởi tạo ứng dụng Express
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Kết nối Cơ sở dữ liệu MongoDB Atlas
ketNoiCoSoDuLieu();

// 4. Middlewares
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log request đơn giản
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
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

// 6. Gắn các Tuyến đường REST API chuẩn (/api/...)
app.use('/api/auth', xacThucRoutes);
app.use('/api/xac-thuc', xacThucRoutes);
app.use('/api/san-pham', sanPhamRoutes);
app.use('/api/don-hang', donHangRoutes);
app.use('/api/ma-giam-gia', maGiamGiaRoutes);
app.use('/api/danh-gia', danhGiaRoutes);
app.use('/api/nguoi-dung', nguoiDungRoutes);
app.use('/api/danh-muc', danhMucRoutes);
app.use('/api/tin-tuc', tinTucRoutes);
app.use('/api/bao-hanh', baoHanhRoutes);

// 7. Gắn các Tuyến đường tương thích ngược (/api/san_pham, /san_pham,...)
app.use('/auth', xacThucRoutes);
app.use('/api/san_pham', sanPhamRoutes);
app.use('/api/don_hang', donHangRoutes);
app.use('/api/ma_giam_gia', maGiamGiaRoutes);
app.use('/api/danh_gia', danhGiaRoutes);
app.use('/api/nguoi_dung', nguoiDungRoutes);
app.use('/api/tin_tuc', tinTucRoutes);

app.use('/san_pham', sanPhamRoutes);
app.use('/don_hang', donHangRoutes);
app.use('/ma_giam_gia', maGiamGiaRoutes);
app.use('/danh_gia', danhGiaRoutes);
app.use('/nguoi_dung', nguoiDungRoutes);
app.use('/tin_tuc', tinTucRoutes);
app.use('/tin-tuc', tinTucRoutes);

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
    console.error('❌ Lỗi máy chủ chưa được bắt:', err.stack);
    res.status(500).json({
        thong_diep: 'Đã xảy ra lỗi nội bộ trên máy chủ!',
        chi_tiet: err.message
    });
});

// 11. Khởi chạy Server
app.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`🚀 Backend Express Server đang chạy tại:`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`👉 API Docs: http://localhost:${PORT}/`);
    console.log(`=============================================`);
});
