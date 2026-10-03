/**
 * Kiểm thử tích hợp: API phiên bản dữ liệu (/api/dong-bo).
 * Front-End dựa vào chữ ký này để biết khi nào Admin đã thêm / sửa / xóa dữ liệu.
 */
const request = require('supertest');
const app = require('../../app');
const SanPham = require('../../models/san-pham.model');
const { xoaBoNhoDemPhienBan } = require('../../controllers/dong-bo.controller');
const { moKetNoi, xoaDuLieu, dongKetNoi } = require('../helpers/co-so-du-lieu');
const { taoSanPham } = require('../helpers/du-lieu-mau');

beforeAll(moKetNoi);
afterEach(xoaDuLieu);
afterAll(dongKetNoi);

const layChuKy = async () => {
    xoaBoNhoDemPhienBan(); // bỏ bộ nhớ đệm 2 giây để thấy thay đổi ngay
    const res = await request(app).get('/api/dong-bo');
    return res;
};

describe('GET /api/dong-bo', () => {
    test('công khai, không cache, trả chữ ký của các bảng', async () => {
        const res = await layChuKy();

        expect(res.status).toBe(200);
        expect(res.headers['cache-control']).toBe('no-store');
        expect(Object.keys(res.body.phien_ban)).toEqual(
            expect.arrayContaining(['san_pham', 'danh_muc', 'ma_giam_gia', 'tin_tuc', 'danh_gia', 'cai_dat'])
        );
    });

    test('thêm sản phẩm → chữ ký san_pham đổi, các bảng khác giữ nguyên', async () => {
        const truoc = (await layChuKy()).body.phien_ban;
        await taoSanPham();
        const sau = (await layChuKy()).body.phien_ban;

        expect(sau.san_pham).not.toBe(truoc.san_pham);
        expect(sau.ma_giam_gia).toBe(truoc.ma_giam_gia);
    });

    test('sửa sản phẩm (ẩn / hiện) → chữ ký đổi', async () => {
        await taoSanPham();
        const truoc = (await layChuKy()).body.phien_ban.san_pham;
        await new Promise((r) => setTimeout(r, 15)); // đảm bảo updatedAt khác mốc cũ
        await SanPham.updateOne({ id: 'asus-zenbook-14-test' }, { $set: { con_hang: false } });
        const sau = (await layChuKy()).body.phien_ban.san_pham;

        expect(sau).not.toBe(truoc);
    });

    test('xóa sản phẩm → chữ ký đổi', async () => {
        await taoSanPham();
        const truoc = (await layChuKy()).body.phien_ban.san_pham;
        await SanPham.deleteOne({ id: 'asus-zenbook-14-test' });
        const sau = (await layChuKy()).body.phien_ban.san_pham;

        expect(sau).not.toBe(truoc);
    });

    test('không có thay đổi → chữ ký giữ nguyên (Front-End không nạp lại thừa)', async () => {
        await taoSanPham();
        const a = (await layChuKy()).body.phien_ban;
        const b = (await layChuKy()).body.phien_ban;

        expect(b).toEqual(a);
    });
});
