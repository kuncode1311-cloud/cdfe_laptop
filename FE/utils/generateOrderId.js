/**
 * Tạo mã đơn hàng ngẫu nhiên duy nhất theo định dạng LPN-YYMMDD-XXXX
 * @returns {string} Mã đơn hàng
 */
export function generateOrderId() {
    const ngay = new Date();
    const nam = ngay.getFullYear().toString().slice(-2);
    const thang = String(ngay.getMonth() + 1).padStart(2, '0');
    const ngayTrongThang = String(ngay.getDate()).padStart(2, '0');
    const soNgauNhien = Math.floor(1000 + Math.random() * 9000);
    return `LPN-${nam}${thang}${ngayTrongThang}-${soNgauNhien}`;
}

export function getCurrentDateTimeFormatted() {
    const now = new Date();
    return now.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Aliases tiếng Việt tương thích
export const taoMaDonHang = generateOrderId;
export const layNgayGioHienTai = getCurrentDateTimeFormatted;
export default generateOrderId;
