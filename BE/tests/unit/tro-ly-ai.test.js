jest.mock('../../services/nine-router.service', () => ({
    goiNineRouter: jest.fn(),
    layCauHinhNineRouter: () => ({ apiKey: 'test', model: 'test' })
}));
jest.mock('../../services/gemini-xoay-key.service', () => ({ goiGeminiXoayKey: jest.fn() }));
jest.mock('../../services/cong-cu-ai.service', () => ({ moTaCongCu: [], thucThiCongCu: jest.fn() }));
const { goiNineRouter } = require('../../services/nine-router.service');
const { goiGeminiXoayKey } = require('../../services/gemini-xoay-key.service');
const { thucThiCongCu } = require('../../services/cong-cu-ai.service');
const { xuLyTroLyChat } = require('../../services/tro-ly-ai.service');
const reply = (value) => JSON.stringify(value);
beforeEach(() => jest.resetAllMocks());
test('AI chọn hàm và tham số, dữ liệu thật được gửi lại để trả lời; loại ID bịa', async () => {
    goiNineRouter
        .mockResolvedValueOnce(reply({ cong_cu: 'tim_san_pham', tham_so: { sap_xep: 'gia_giam', gioi_han: 1 } }))
        .mockResolvedValueOnce(reply({ cau_tra_loi: 'Mẫu A giá 30 triệu.', id_san_pham_phu_hop: ['fake', 'a', 'a'] }));
    thucThiCongCu.mockResolvedValue([{ id: 'a', ten_san_pham: 'A', gia_khuyen_mai: 30000000 }]);
    const result = await xuLyTroLyChat({
        tinNhan: 'món nào đắc nhất',
        lichSuChat: [{ role: 'user', content: 'tìm phụ kiện' }]
    });
    expect(thucThiCongCu).toHaveBeenCalledWith('tim_san_pham', { sap_xep: 'gia_giam', gioi_han: 1 });
    expect(JSON.parse(goiNineRouter.mock.calls[1][0].userPrompt).ket_qua_cong_cu[0].du_lieu[0].id).toBe('a');
    expect(goiNineRouter.mock.calls[0][0].lichSuChat[0].content).toBe('tìm phụ kiện');
    expect(result.san_pham_goi_y.map((p) => p.id)).toEqual(['a']);
});
test('xã giao không bị ép tra cứu hay tự gắn sản phẩm', async () => {
    goiNineRouter.mockResolvedValue(reply({ cau_tra_loi: 'Chào bạn!', id_san_pham_phu_hop: ['fake'] }));
    const result = await xuLyTroLyChat({ tinNhan: 'chào' });
    expect(thucThiCongCu).not.toHaveBeenCalled();
    expect(result.san_pham_goi_y).toEqual([]);
});
test('câu hỏi đếm danh mục khớp rõ lấy tổng trực tiếp từ cơ sở dữ liệu', async () => {
    thucThiCongCu
        .mockResolvedValueOnce([
            { loai: 'nhu_cau', ma_danh_muc: 'gaming', ten_danh_muc: 'Laptop Gaming Cực Đỉnh' },
            { loai: 'nhu_cau', ma_danh_muc: 'van-phong-mong-nhe', ten_danh_muc: 'Mỏng Nhẹ & Sang Trọng' }
        ])
        .mockResolvedValueOnce({ tong_san_pham: 12 });

    const result = await xuLyTroLyChat({ tinNhan: 'Gaming RTX đang có bao nhiêu sản phẩm?' });

    expect(thucThiCongCu).toHaveBeenNthCalledWith(1, 'danh_muc', {});
    expect(thucThiCongCu).toHaveBeenNthCalledWith(2, 'thong_ke_san_pham', { danh_muc: ['gaming'] });
    expect(result.cau_tra_loi).toContain('12 sản phẩm');
    expect(result.thong_tin_ket_noi.provider).toBe('MongoDB');
    expect(goiNineRouter).not.toHaveBeenCalled();
});
test('đếm laptop dùng hợp các danh mục nhu cầu để không đếm lặp sản phẩm', async () => {
    thucThiCongCu
        .mockResolvedValueOnce([
            { loai: 'nhu_cau', ma_danh_muc: 'gaming', ten_danh_muc: 'Laptop Gaming Cực Đỉnh' },
            { loai: 'nhu_cau', ma_danh_muc: 'sinh-vien', ten_danh_muc: 'Học Tập & Sinh Viên Giá Tốt' },
            { loai: 'loai_san_pham', ma_danh_muc: 'chuot-lot-chuot', ten_danh_muc: 'Chuột & Pad' }
        ])
        .mockResolvedValueOnce({ tong_san_pham: 18 });

    const result = await xuLyTroLyChat({ tinNhan: 'có bao nhiêu laptop' });

    expect(thucThiCongCu).toHaveBeenNthCalledWith(1, 'danh_muc', {});
    expect(thucThiCongCu).toHaveBeenNthCalledWith(2, 'thong_ke_san_pham', { danh_muc: ['gaming', 'sinh-vien'] });
    expect(result.cau_tra_loi).toContain('18 sản phẩm');
    expect(result.thong_tin_ket_noi.provider).toBe('MongoDB');
    expect(goiNineRouter).not.toHaveBeenCalled();
});
test('lỗi tra cứu được đưa lại cho AI, không biến thành kết quả rỗng', async () => {
    goiNineRouter
        .mockResolvedValueOnce(reply({ cong_cu: 'showroom', tham_so: {} }))
        .mockResolvedValueOnce(reply({ cau_tra_loi: 'Chưa tra cứu được địa chỉ.' }));
    thucThiCongCu.mockRejectedValue(new Error('DB offline'));
    await xuLyTroLyChat({ tinNhan: 'địa chỉ ở đâu' });
    expect(JSON.parse(goiNineRouter.mock.calls[1][0].userPrompt).ket_qua_cong_cu[0]).toEqual({
        cong_cu: 'showroom',
        loi: 'DB offline'
    });
});
test('9Router lỗi dùng Gemini cùng giao thức', async () => {
    goiNineRouter.mockRejectedValue(new Error('offline'));
    goiGeminiXoayKey.mockResolvedValue(reply({ cau_tra_loi: 'Xin chào.' }));
    expect((await xuLyTroLyChat({ tinNhan: 'hi' })).thong_tin_ket_noi.provider).toBe('Gemini');
});
