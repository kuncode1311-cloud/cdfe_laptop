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
