const voucherConHieuLuc = (voucher) => {
    if (!voucher) return false;
    const chuoiNgay = String(voucher.ngay_het_han || '').trim();
    if (!chuoiNgay) return true;

    let ngayHetHan = null;
    const khopDdMmYyyy = chuoiNgay.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (khopDdMmYyyy) {
        const [, dd, mm, yyyy] = khopDdMmYyyy;
        ngayHetHan = new Date(Number(yyyy), Number(mm) - 1, Number(dd), 23, 59, 59, 999);
    } else {
        const thuParse = new Date(chuoiNgay);
        if (!Number.isNaN(thuParse.getTime())) {
            ngayHetHan = thuParse;
            if (/^\d{4}-\d{2}-\d{2}$/.test(chuoiNgay)) {
                ngayHetHan.setHours(23, 59, 59, 999);
            }
        }
    }

    if (!ngayHetHan || Number.isNaN(ngayHetHan.getTime())) {
        return true;
    }

    return Date.now() <= ngayHetHan.getTime();
};

module.exports = { voucherConHieuLuc };
