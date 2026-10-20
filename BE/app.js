/**
 * Cấu hình ứng dụng Express: middleware, routes và xử lý lỗi.
 *
 * File này CHỈ tạo và export `app`, KHÔNG kết nối database và KHÔNG gọi listen().
 * Nhờ tách riêng như vậy, bộ kiểm thử (Jest + Supertest) có thể nạp `app` và gửi
 * request trực tiếp vào bộ nhớ mà không cần mở cổng mạng hay dùng database thật.
 * Việc khởi động server thật nằm ở server.js.
 */
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./docs/openapi');
const { datHeaderBaoMat, chongNoSqlInjection } = require('./middleware/bao-mat.middleware');
const { gioiHanRequest } = require('./middleware/gioi-han-request.middleware');

// 1. Khởi tạo ứng dụng Express
const app = express();

// Railway/production đặt ứng dụng sau một reverse proxy; cấu hình này giúp req.ip
// phản ánh đúng IP khách mà không tin tùy tiện toàn bộ chuỗi X-Forwarded-For.
if (process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// 2. Middlewares

// [TỰ TẠO] Danh sách trắng (Whitelist) các domain được phép truy cập API
// Mặc định lấy từ biến môi trường CLIENT_URL (file .env), nếu không có thì dùng 'http://localhost:3000' của Frontend
const corsOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);

// [TỰ VIẾT] Hàm kiểm tra xem người gọi có cùng tên miền với Backend hay không
// Ví dụ: Khi bấm nút test API trên trang tài liệu Swagger UI (http://localhost:5000/api-docs)
const laCungTenMien = (origin, req) => {
    try {
        return new URL(origin).host === req.get('host');
    } catch {
        return false;
    }
};

// [CÓ SẴN - THƯ VIỆN CORS] Trạm kiểm soát bảo mật CORS
// Mọi request từ trình duyệt đều phải chạy qua đây trước khi vào các API bên trong
app.use(
    cors((req, callback) => {
        // [CÓ SẴN - EXPRESS] Lấy tên miền của website đang gọi API (ví dụ: http://localhost:3000)
        const origin = req.get('origin');

        // KIỂM TRA ĐIỀU KIỆN CHO PHÉP (Chỉ cần thỏa mãn 1 trong 3 điều kiện sau là được qua):
        // 1. !origin : Không có origin (khi test bằng Postman hoặc app mobile không chạy trên trình duyệt web)
        // 2. corsOrigins.includes(origin) : Domain nằm trong danh sách trắng (Frontend của bạn)
        // 3. laCungTenMien(origin, req)   : Cùng tên miền với Backend (chính trang Swagger UI)
        if (!origin || corsOrigins.includes(origin) || laCungTenMien(origin, req)) {
            return callback(null, { 
                origin: true,        // Đồng ý cho phép domain này kết nối
                credentials: true,   // Cho phép gửi kèm token JWT / cookie xác thực
                maxAge: 600          // Trình duyệt nhớ quyền này trong 10 phút (600s), không cần hỏi lại liên tục
            });
        }

        // NẾU LÀ TRANG WEB LẠ / ĐỘC HẠI -> Chặn đứng ngay lập tức và báo lỗi
        return callback(new Error(`CORS không cho phép origin: ${origin}`));
    })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Tài liệu API (Swagger UI) tại /api-docs. Gắn TRƯỚC datHeaderBaoMat vì CSP toàn cục
// (default-src 'none') sẽ chặn giao diện Swagger; trang này dùng CSP nới lỏng riêng.
app.use(
    '/api-docs',
    (req, res, next) => {
        res.setHeader(
            'Content-Security-Policy',
            "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'"
        );
        res.setHeader('X-Content-Type-Options', 'nosniff');
        // Không cho Cloudflare/trình duyệt cache: sửa đặc tả là trang tài liệu cập nhật ngay
        // (swaggerUi.serve dùng express.static tự ghi đè Cache-Control cho swagger-ui-init.js,
        // nên chặn mọi lần ghi đè sau đó để file JS cũng không bị cache)
        res.setHeader('Cache-Control', 'no-store');
        const setHeaderGoc = res.setHeader.bind(res);
        res.setHeader = (ten, giaTri) =>
            String(ten).toLowerCase() === 'cache-control' ? res : setHeaderGoc(ten, giaTri);
        next();
    },
    swaggerUi.serve,
    swaggerUi.setup(openapiSpec, {
        customSiteTitle: 'LaptopNew API Docs',
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'none',
            deepLinking: true,
            displayRequestDuration: true
        }
    })
);
app.get('/api-docs.json', (req, res) => res.set('Cache-Control', 'no-store').json(openapiSpec));

// =========================================================================
// [BẢO MẬT TOÀN CỤC] 4 Lớp bảo vệ hệ thống trước khi vào các API
// =========================================================================
app.disable('x-powered-by');   // Lớp 1: Ẩn thông tin công nghệ Express (chống quét lỗi tự động)
app.use(datHeaderBaoMat);      // Lớp 2: Gắn Security Headers (chống XSS, Clickjacking, MIME Sniffing)
app.use(chongNoSqlInjection);  // Lớp 3: Lọc bỏ ký tự độc hại $ne, $gt (chống NoSQL Injection)

// Lớp 4: Giới hạn tần suất gọi API (Rate Limiting) - Tối đa 300 req / phút / IP (chống spam, DoS)
app.use(
    '/api',
    gioiHanRequest({
        windowMs: 60 * 1000,
        max: 300,
        message: 'Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.'
    })
);

// Lớp 5: Che giấu mã lỗi nội bộ và stack trace khi chạy trên môi trường Production
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

// Ghi log đường dẫn mỗi khi có request tới (tắt khi chạy test tự động để màn hình gọn)
if (process.env.NODE_ENV !== 'test') {
    app.use((req, res, next) => {
        console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
        next();
    });
}

// =========================================================================
// 3. IMPORT CÁC TUYẾN ĐƯỜNG ROUTER (MVC ROUTES)
// =========================================================================
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
const dongBoRoutes = require('./routes/dong-bo.routes');
const gioHangRoutes = require('./routes/gio-hang.routes');
const yeuThichRoutes = require('./routes/yeu-thich.routes');
const { xoaBoNhoDemPhienBan } = require('./controllers/dong-bo.controller');

// Tự động xóa bộ nhớ đệm phiên bản sau mỗi thao tác ghi (POST/PUT/DELETE) thành công
// để GET /api/dong-bo lập tức báo cho Front-End biết có dữ liệu mới từ Admin
app.use('/api', (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'OPTIONS') {
        res.on('finish', () => {
            if (res.statusCode < 400) xoaBoNhoDemPhienBan();
        });
    }
    next();
});

// =========================================================================
// 4. GẮN CÁC TUYẾN ĐƯỜNG RESTful API CHUẨN (/api/...)
// Nguyên tắc RESTful & CRUD:
//   - GET    = Đọc dữ liệu (Read)
//   - POST   = Tạo mới (Create)
//   - PUT    = Cập nhật/Sửa dữ liệu (Update)
//   - DELETE = Xóa dữ liệu (Delete)
// =========================================================================

// [LUỒNG 1: XÁC THỰC] Đăng ký OTP, Đăng nhập JWT, Quên MK, Đổi MK, Lấy thông tin cá nhân
app.use('/api/auth', xacThucRoutes);

// [LUỒNG 2: SẢN PHẨM - CRUD] Khách xem & lọc laptop | Admin Thêm, Sửa, Ẩn/Xóa sản phẩm
app.use('/api/san-pham', sanPhamRoutes);

// [LUỒNG 3: ĐƠN HÀNG - CRUD] Khách đặt & tra cứu đơn | Admin xem, duyệt & hủy đơn hàng
app.use('/api/don-hang', donHangRoutes);

// [LUỒNG 4: MÃ GIẢM GIÁ - CRUD] Khách kiểm tra áp dụng voucher | Admin tạo & quản lý mã
app.use('/api/ma-giam-gia', maGiamGiaRoutes);

// [LUỒNG 5: ĐÁNH GIÁ - CRUD] Khách gửi đánh giá & bình luận sao | Admin duyệt/ẩn nhận xét
app.use('/api/danh-gia', danhGiaRoutes);

// [LUỒNG 6: NGƯỜI DÙNG - CRUD] Quản trị Admin: Xem danh sách thành viên, khóa/mở tài khoản
app.use('/api/nguoi-dung', nguoiDungRoutes);

// [LUỒNG 7: DANH MỤC - CRUD] Khách xem danh mục | Admin quản lý danh mục máy & phụ kiện
app.use('/api/danh-muc', danhMucRoutes);

// [LUỒNG 8: TIN TỨC - CRUD] Khách đọc tin công nghệ | Admin đăng bài, sửa & xóa bài viết
app.use('/api/tin-tuc', tinTucRoutes);

// [LUỒNG 9: BẢO HÀNH - CRUD] Khách tra cứu bảo hành (Serial/SĐT) | Admin quản lý sổ bảo hành
app.use('/api/bao-hanh', baoHanhRoutes);

// [LUỒNG 10: THANH TOÁN] Tạo link thanh toán VietQR / PayOS, nhận Webhook ngân hàng tự động
app.use('/api/thanh-toan', thanhToanRoutes);

// [LUỒNG 11: LIÊN HỆ - CRUD] Khách gửi form tư vấn | Admin xem & xử lý phiếu hỗ trợ khách hàng
app.use('/api/lien-he', lienHeRoutes);

// [LUỒNG 12: CÀI ĐẶT] Quản lý thông tin chuỗi showroom chi nhánh và banner khuyến mãi
app.use('/api/cai-dat', caiDatRoutes);

// [LUỒNG 13: TRỢ LÝ AI] Chatbot tư vấn cấu hình, tìm kiếm laptop RAG & Stream gõ chữ trực tiếp
app.use('/api/tro-ly-ai', troLyAiRoutes);

// [LUỒNG 14: ĐỒNG BỘ REALTIME] Cập nhật phiên bản dữ liệu ngầm tức thì giữa Admin và Khách
app.use('/api/dong-bo', dongBoRoutes);

// [LUỒNG 15: GIỎ HÀNG - CRUD] Thêm món, tăng giảm số lượng, xóa giỏ hàng (Đồng bộ MongoDB)
app.use('/api/gio-hang', gioHangRoutes);

// [LUỒNG 16: YÊU THÍCH - CRUD] Thêm/bỏ sản phẩm vào danh sách yêu thích (Wishlist) theo User
app.use('/api/yeu-thich', yeuThichRoutes);

// 5. Tuyến đường kiểm tra máy chủ
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

// 6. Xử lý lỗi 404 cho các route không tồn tại
app.use((req, res) => {
    res.status(404).json({
        thong_diep: `Đường dẫn không tồn tại: ${req.originalUrl}`
    });
});

// 7. Xử lý lỗi hệ thống tổng quát (500)
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

module.exports = app;
