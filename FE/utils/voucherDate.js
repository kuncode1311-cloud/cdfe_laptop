// API trả về thời điểm cố định; tính lại khi render để bộ nhớ đệm không giữ nhãn "Còn N ngày".
export function thoiHanVoucher(voucher, now = Date.now()) {
    let expiry = voucher.het_han_luc ? new Date(voucher.het_han_luc) : null;
    const old = String(voucher.ngay_het_han || '').match(/^Còn\s+(\d+)\s+ngày$/iu);
    if (!expiry && old && voucher.ngay_bat_dau) {
        const start = new Date(`${voucher.ngay_bat_dau}T00:00:00+07:00`);
        expiry = new Date(start.getTime() + Number(old[1]) * 86400000 + 86399999);
    }
    if (!expiry || Number.isNaN(expiry.getTime())) return voucher.thoi_han_hien_thi || 'Chưa xác định thời hạn';
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
