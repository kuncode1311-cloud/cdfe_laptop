const crypto = require('crypto');

/**
 * Các hàm tiện ích bảo mật dùng chung cho toàn bộ Back-End.
 */

// Escape ký tự đặc biệt trước khi đưa chuỗi người dùng nhập vào RegExp / $regex
// → chống Regex Injection và ReDoS (biểu thức chạy vô hạn làm treo server).
const escapeRegex = (chuoi = '') => String(chuoi).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Ép giá trị về chuỗi an toàn (chống gửi object kiểu { "$ne": null } vào truy vấn) và cắt độ dài.
const chuoiAnToan = (giaTri, doDaiToiDa = 200) => {
    if (giaTri === undefined || giaTri === null) return '';
    if (typeof giaTri === 'object') return '';
    return String(giaTri).trim().slice(0, doDaiToiDa);
};

// Sinh OTP 6 số bằng bộ sinh số ngẫu nhiên an toàn mật mã (thay cho Math.random có thể đoán được).
const taoMaOtp = () => crypto.randomInt(100000, 1000000).toString();

// OTP chỉ lưu dạng băm HMAC-SHA256 trong DB: lộ DB cũng không đọc được mã đang hiệu lực.
const bamOtp = (otp) => crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'otp')
    .update(String(otp))
    .digest('hex');

// So sánh OTP người dùng nhập với giá trị đã lưu, thời gian so sánh không đổi (chống timing attack).
const soSanhOtp = (giaTriDaLuu, otpNhap) => {
    if (!giaTriDaLuu || !otpNhap) return false;
    const nhap = String(otpNhap).trim();
    if (!/^\d{6}$/.test(nhap)) return false;
    const luu = String(giaTriDaLuu);
    // Tương thích dữ liệu cũ còn lưu OTP dạng thô 6 số
    const kyVong = luu.length === 6 ? nhap : bamOtp(nhap);
    const a = Buffer.from(luu);
    const b = Buffer.from(kyVong);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
};

// Chính sách mật khẩu: tối thiểu 8 ký tự, có cả chữ và số.
const kiemTraMatKhauManh = (matKhau) => {
    const mk = typeof matKhau === 'string' ? matKhau : '';
    if (mk.length < 8 || mk.length > 72) {
        return 'Mật khẩu phải dài từ 8 đến 72 ký tự!';
    }
    if (!/[A-Za-zÀ-ỹ]/.test(mk) || !/\d/.test(mk)) {
        return 'Mật khẩu phải chứa cả chữ cái và chữ số!';
    }
    return null;
};

// Chỉ nhận đường dẫn ảnh http(s) hoặc đường dẫn nội bộ "/..." (chặn javascript:, data: ...).
const laUrlAnhHopLe = (url) => typeof url === 'string'
    && url.length <= 500
    && (/^https?:\/\//i.test(url) || /^\/[^/]/.test(url));

module.exports = {
    escapeRegex,
    chuoiAnToan,
    taoMaOtp,
    bamOtp,
    soSanhOtp,
    kiemTraMatKhauManh,
    laUrlAnhHopLe
};
