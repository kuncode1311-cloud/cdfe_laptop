/**
 * Định dạng số thành chuỗi tiền tệ VNĐ (vd: 25.000.000₫)
 * @param {number} soTien - Giá trị số tiền
 * @returns {string} Chuỗi tiền tệ đã định dạng
 */
export function formatCurrency(soTien) {
    if (soTien === undefined || soTien === null || isNaN(soTien)) {
        return '0₫';
    }
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(soTien);
}

/**
 * Tính số tiền tiết kiệm được giữa giá gốc và giá khuyến mãi
 * @param {number} giaGoc
 * @param {number} giaKhuyenMai
 * @returns {number} Số tiền tiết kiệm
 */
export function calculateSavings(giaGoc, giaKhuyenMai) {
    if (!giaGoc || !giaKhuyenMai || giaGoc <= giaKhuyenMai) return 0;
    return giaGoc - giaKhuyenMai;
}

// Aliases tiếng Việt tương thích
export const dinhDangTienVND = formatCurrency;
export const tinhTienTietKiem = calculateSavings;
export default formatCurrency;
