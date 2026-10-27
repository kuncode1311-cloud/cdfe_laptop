const { taoBoLoc, thucThiCongCu } = require('../../services/cong-cu-ai.service');
test('lọc không diễn giải đầu vào thành Mongo operator hoặc regex', () => {
    expect(() => taoBoLoc({ hang: { $ne: null } })).toThrow();
    const filter = taoBoLoc({ tu_khoa: ['a.*'], gia_max: 1000000 });
    expect(filter.$and[0].$or[0].ten_san_pham.test('abc')).toBe(false);
    expect(filter.$and[0].$or[0].ten_san_pham.test('a.*')).toBe(true);
    expect(filter.gia_khuyen_mai).toEqual({ $lte: 1000000 });
});
test('từ chối giá không hợp lệ và hàm ngoài danh sách', async () => {
    expect(() => taoBoLoc({ gia_min: -1 })).toThrow();
    expect(() => taoBoLoc({ ids: '$ne' })).toThrow();
    await expect(thucThiCongCu('xoa_san_pham', {})).rejects.toThrow('không được hỗ trợ');
});
