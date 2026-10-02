/**
 * Kiểm thử đơn vị: hàm tạo slug URL từ tên tiếng Việt (utils/tao-slug.js)
 */
const taoSlug = require('../../utils/tao-slug');

describe('taoSlug', () => {
    test('bỏ dấu tiếng Việt và chuyển chữ "đ" thành "d"', () => {
        expect(taoSlug('Laptop Đồ Họa Cao Cấp')).toBe('laptop-do-hoa-cao-cap');
    });

    test('gộp ký tự đặc biệt thành một dấu gạch ngang', () => {
        expect(taoSlug('ASUS ROG Strix (2026) | i9 / RTX 4090')).toBe('asus-rog-strix-2026-i9-rtx-4090');
    });

    test('không có dấu gạch ngang ở đầu và cuối', () => {
        expect(taoSlug('  --Dell XPS--  ')).toBe('dell-xps');
    });

    test('giá trị rỗng trả về chuỗi rỗng', () => {
        expect(taoSlug()).toBe('');
    });
});
