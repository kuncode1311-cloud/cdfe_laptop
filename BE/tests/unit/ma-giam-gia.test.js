const { voucherConHieuLuc, layHanVoucher, thongTinHanVoucher } = require('../../utils/ma-giam-gia.util');
const MaGiamGia = require('../../models/ma-giam-gia.model');

describe('Thời hạn voucher theo ngày Việt Nam', () => {
    const now = Date.parse('2026-10-22T13:34:00+07:00');
    test('tính ngày còn lại từ ngày hết hạn thực tế', () => {
        expect(thongTinHanVoucher({ ngay_het_han: '31/10/2026' }, now).thoi_han_hien_thi).toBe('Còn 9 ngày');
    });
    test('hết hạn cuối ngày Việt Nam', () => {
        const voucher = { ngay_het_han: '2026-10-22' };
        expect(voucherConHieuLuc(voucher, Date.parse('2026-10-22T16:59:59.999Z'))).toBe(true);
        expect(voucherConHieuLuc(voucher, Date.parse('2026-10-22T17:00:00Z'))).toBe(false);
        expect(thongTinHanVoucher(voucher, now).thoi_han_hien_thi).toBe('Hết hạn hôm nay');
    });
    test('chuỗi cũ neo vào ngày tạo, không gia hạn mỗi lần đọc', () => {
        const voucher = { ngay_het_han: 'Còn 14 ngày', createdAt: '2026-08-19T00:00:00Z' };
        expect(layHanVoucher(voucher).ngay).toBe('2026-09-02');
        expect(thongTinHanVoucher(voucher, now).thoi_han_hien_thi).toBe('Đã hết hạn');
        expect(voucherConHieuLuc(voucher, now)).toBe(false);
    });
    test('ngày bắt đầu, qua năm và Hôm nay', () => {
        expect(layHanVoucher({ ngay_het_han: 'Còn 3 ngày', ngay_bat_dau: '30/12/2026' }).ngay).toBe('2027-01-02');
        expect(layHanVoucher({ ngay_het_han: 'Hôm nay', createdAt: '2026-10-21T18:00:00Z' }).ngay).toBe('2026-10-22');
    });
    test.each(['31/02/2026', 'ngày sai', 'Còn 14 ngày'])('không cho qua ngày không xác định: %s', (value) => {
        expect(voucherConHieuLuc({ ngay_het_han: value }, now)).toBe(false);
    });
    test('không khai báo ngày là không giới hạn', () => {
        expect(voucherConHieuLuc({ ngay_het_han: '' }, now)).toBe(true);
    });
    test('API trả ngày chuẩn cho form sửa và thời điểm hết hạn', () => {
        const data = new MaGiamGia({ ngay_het_han: 'Còn 14 ngày', createdAt: '2026-08-19T00:00:00Z' }).toJSON();
        expect(data.ngay_het_han_chuan).toBe('2026-09-02');
        expect(data.het_han_luc).toBe('2026-09-02T16:59:59.999Z');
    });
});
