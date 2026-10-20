// =========================================================================
// [CÓ SẴN TRONG JAVASCRIPT] `new Map()` là cấu trúc dữ liệu lưu trữ dạng Key - Value
// (Khóa - Giá trị) trực tiếp trên bộ nhớ RAM, giúp tìm kiếm và ghi dữ liệu siêu nhanh (O(1)).
// Ở đây dùng để lưu: Key là "Địa chỉ IP của khách" -> Value là "{ Số lần gọi (count), Hạn reset (resetAt) }"
// =========================================================================
const boDemTheoIp = new Map();
let soThuTuBoGioiHan = 0;
const SO_LUONG_TOI_DA = 50_000; // Giới hạn tối đa 50.000 IP trong RAM để chống tràn bộ nhớ

// Hàm lấy địa chỉ IP thực của người gửi request
const layIp = (req) => {
    return req.ip || req.socket?.remoteAddress || 'unknown';
};

/**
 * [TỰ VIẾT 100%] Hàm tạo Middleware giới hạn tần suất gọi API (Rate Limiting)
 * @param {number} windowMs - Khung thời gian giới hạn (Ví dụ: 60.000 ms = 1 phút)
 * @param {number} max      - Số lần gọi tối đa được phép trong khung thời gian đó
 * @param {string} message  - Câu thông báo trả về khi người dùng bị chặn
 */
const gioiHanRequest = ({ windowMs = 60_000, max = 60, message } = {}) => {
    soThuTuBoGioiHan += 1;
    const tenBoGioiHan = `bo-${soThuTuBoGioiHan}`;

    return (req, res, next) => {
        // Tạo khóa định danh riêng cho từng IP trong bộ giới hạn này (VD: "bo-1:192.168.1.1")
        const key = `${tenBoGioiHan}:${layIp(req)}`;
        const bayGio = Date.now();

        // Nếu RAM lưu quá 50.000 IP thì xóa sạch để làm mới, bảo vệ server không bị sập RAM
        if (boDemTheoIp.size >= SO_LUONG_TOI_DA) {
            boDemTheoIp.clear();
        }

        // map.get(key): Lấy dữ liệu đếm của IP này ra xem
        const hienTai = boDemTheoIp.get(key);

        // TRƯỜNG HỢP 1: Khách mới gọi lần đầu hoặc đã hết thời gian phạt cũ
        if (!hienTai || bayGio > hienTai.resetAt) {
            // map.set(key, value): Bắt đầu tính lần thứ 1 và lưu thời điểm hết hạn
            boDemTheoIp.set(key, { count: 1, resetAt: bayGio + windowMs });
            res.setHeader('RateLimit-Limit', max);
            res.setHeader('RateLimit-Remaining', max - 1);
            return next(); // Cho phép đi tiếp vào Controller
        }

        // TRƯỜNG HỢP 2: Khách đang gọi tiếp trong khung thời gian -> Tăng biến đếm lên 1
        hienTai.count += 1;
        res.setHeader('RateLimit-Limit', max);
        res.setHeader('RateLimit-Remaining', Math.max(0, max - hienTai.count));

        // NẾU GỌI QUÁ SỐ LẦN CHO PHÉP (Ví dụ quá 30 lần) -> CHẶN ĐỨNG NGAY!
        if (hienTai.count > max) {
            res.setHeader('Retry-After', Math.ceil((hienTai.resetAt - bayGio) / 1000));
            return res.status(429).json({ // 429 = Too Many Requests (Quá nhiều yêu cầu)
                thong_diep: message || 'Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.'
            });
        }

        return next(); // Chưa vượt quá giới hạn thì cho phép đi tiếp
    };
};

// [BỘ QUÉT RÁC TỰ ĐỘNG]: Cứ mỗi 60 giây (1 phút) tự động chạy ngầm một lần
// Kiểm tra IP nào đã hết thời gian phạt thì xóa khỏi Map (boDemTheoIp.delete) để giải phóng RAM
setInterval(() => {
    const bayGio = Date.now();
    for (const [key, value] of boDemTheoIp.entries()) {
        if (bayGio > value.resetAt) boDemTheoIp.delete(key);
    }
}, 60_000).unref();

module.exports = {
    gioiHanRequest
};
