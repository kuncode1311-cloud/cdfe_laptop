// API trả về thời điểm cố định; tính lại khi render để bộ nhớ đệm không giữ nhãn "Còn N ngày".
export function thoiHanVoucher(voucher, now = Date.now()) {
    if (!voucher.het_han_luc) return voucher.thoi_han_hien_thi || 'Chưa xác định thời hạn';
    const expiry = new Date(voucher.het_han_luc);
    if (now > expiry.getTime()) return 'Đã hết hạn';
    const ngayVN = (value) => new Date(new Date(value).getTime() + 7 * 3600000).toISOString().slice(0, 10);
    const days = Math.round((Date.parse(ngayVN(expiry)) - Date.parse(ngayVN(now))) / 86400000);
    return days === 0 ? 'Hết hạn hôm nay' : `Còn ${days} ngày`;
}

export function voucherConHan(voucher) {
    return voucher.con_hieu_luc !== false && (!voucher.het_han_luc || Date.now() <= Date.parse(voucher.het_han_luc));
}

export function ngayVoucher(value) {
    if (!value) return 'Chưa xác định';
    return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value.split('-').reverse().join('/') : value;
}
