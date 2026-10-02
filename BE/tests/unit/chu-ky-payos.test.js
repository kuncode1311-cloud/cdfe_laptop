/**
 * Kiểm thử đơn vị: tạo chữ ký HMAC-SHA256 theo chuẩn PayOS.
 * Chữ ký đúng là điều kiện để server tin một webhook "đã thanh toán".
 */
const crypto = require('crypto');
const { taoChuKyPayOS } = require('../../controllers/thanh-toan.controller');

const KHOA = 'checksum-key-gia';

describe('taoChuKyPayOS', () => {
    test('ký trên chuỗi key=value đã sắp xếp theo bảng chữ cái', () => {
        const data = { orderCode: 123, amount: 1000, description: 'TRIKUN 123' };
        // Thứ tự đúng: amount → description → orderCode
        const kyVong = crypto.createHmac('sha256', KHOA)
            .update('amount=1000&description=TRIKUN 123&orderCode=123')
            .digest('hex');
        expect(taoChuKyPayOS(data, KHOA)).toBe(kyVong);
    });

    test('thứ tự khóa trong object không làm đổi chữ ký', () => {
        const a = taoChuKyPayOS({ amount: 1000, orderCode: 1 }, KHOA);
        const b = taoChuKyPayOS({ orderCode: 1, amount: 1000 }, KHOA);
        expect(a).toBe(b);
    });

    test('sửa số tiền → chữ ký thay đổi (chống giả mạo)', () => {
        const goc = taoChuKyPayOS({ orderCode: 1, amount: 1000 }, KHOA);
        const biSua = taoChuKyPayOS({ orderCode: 1, amount: 1 }, KHOA);
        expect(biSua).not.toBe(goc);
    });

    test('khác checksum key → khác chữ ký', () => {
        const data = { orderCode: 1, amount: 1000 };
        expect(taoChuKyPayOS(data, KHOA)).not.toBe(taoChuKyPayOS(data, 'khoa-cua-ke-gian'));
    });
});
