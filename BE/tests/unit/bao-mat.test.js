/**
 * Kiểm thử đơn vị: các hàm tiện ích bảo mật trong utils/bao-mat.js
 */
const {
    escapeRegex,
    chuoiAnToan,
    taoMaOtp,
    bamOtp,
    soSanhOtp,
    kiemTraMatKhauManh,
    laUrlAnhHopLe
} = require('../../utils/bao-mat');

describe('escapeRegex — chống Regex Injection / ReDoS', () => {
    test('escape toàn bộ ký tự đặc biệt của RegExp', () => {
        expect(escapeRegex('(a+)+$')).toBe('\\(a\\+\\)\\+\\$');
    });

    test('chuỗi sau khi escape chỉ khớp đúng nghĩa đen', () => {
        const regex = new RegExp(escapeRegex('i7.13700H'));
        expect(regex.test('i7.13700H')).toBe(true);
        expect(regex.test('i7X13700H')).toBe(false); // dấu "." không còn là "ký tự bất kỳ"
    });
});

describe('chuoiAnToan — ép dữ liệu đầu vào về chuỗi', () => {
    test('chặn object kiểu { "$ne": null } (NoSQL Injection)', () => {
        expect(chuoiAnToan({ $ne: null })).toBe('');
    });

    test('cắt khoảng trắng và giới hạn độ dài', () => {
        expect(chuoiAnToan('  abc  ')).toBe('abc');
        expect(chuoiAnToan('x'.repeat(500), 10)).toHaveLength(10);
    });

    test('undefined / null trả về chuỗi rỗng', () => {
        expect(chuoiAnToan(undefined)).toBe('');
        expect(chuoiAnToan(null)).toBe('');
    });
});

describe('OTP — sinh, băm và so sánh', () => {
    test('taoMaOtp luôn sinh đúng 6 chữ số', () => {
        for (let i = 0; i < 50; i += 1) {
            expect(taoMaOtp()).toMatch(/^\d{6}$/);
        }
    });

    test('bamOtp không lưu OTP dạng thô và luôn cho cùng kết quả', () => {
        const banBam = bamOtp('123456');
        expect(banBam).not.toContain('123456');
        expect(banBam).toHaveLength(64); // HMAC-SHA256 dạng hex
        expect(bamOtp('123456')).toBe(banBam);
    });

    test('soSanhOtp chấp nhận đúng mã, từ chối sai mã', () => {
        const daLuu = bamOtp('654321');
        expect(soSanhOtp(daLuu, '654321')).toBe(true);
        expect(soSanhOtp(daLuu, '000000')).toBe(false);
    });

    test('soSanhOtp từ chối dữ liệu không phải 6 chữ số', () => {
        const daLuu = bamOtp('654321');
        expect(soSanhOtp(daLuu, 'abcdef')).toBe(false);
        expect(soSanhOtp(daLuu, '')).toBe(false);
        expect(soSanhOtp(null, '654321')).toBe(false);
    });
});

describe('kiemTraMatKhauManh — chính sách mật khẩu', () => {
    test.each([
        ['123', 'quá ngắn'],
        ['abcdefgh', 'thiếu chữ số'],
        ['12345678', 'thiếu chữ cái']
    ])('từ chối "%s" (%s)', (matKhau) => {
        expect(kiemTraMatKhauManh(matKhau)).not.toBeNull();
    });

    test('chấp nhận mật khẩu ≥ 8 ký tự có cả chữ và số', () => {
        expect(kiemTraMatKhauManh('MatKhau123')).toBeNull();
    });
});

describe('laUrlAnhHopLe — chỉ nhận đường dẫn ảnh an toàn', () => {
    test('chấp nhận http(s) và đường dẫn nội bộ', () => {
        expect(laUrlAnhHopLe('https://cdn.trikun.site/a.jpg')).toBe(true);
        expect(laUrlAnhHopLe('/images/sp/a.jpg')).toBe(true);
    });

    test('chặn javascript: và data: (chống XSS)', () => {
        expect(laUrlAnhHopLe('javascript:alert(1)')).toBe(false);
        expect(laUrlAnhHopLe('data:image/png;base64,AAAA')).toBe(false);
    });
});
