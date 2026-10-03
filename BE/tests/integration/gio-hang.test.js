/**
 * Kiểm thử tích hợp: giỏ hàng lưu theo tài khoản (/api/gio-hang).
 * Giỏ đi theo tài khoản giữa các thiết bị; giá luôn lấy mới nhất từ bảng sản phẩm, không lưu / không tin giá của client.
 */
const request = require('supertest');
const app = require('../../app');
const SanPham = require('../../models/san-pham.model');
const { moKetNoi, xoaDuLieu, dongKetNoi } = require('../helpers/co-so-du-lieu');
const { taoNguoiDung, taoTokenCho, taoSanPham } = require('../helpers/du-lieu-mau');

beforeAll(moKetNoi);
afterEach(xoaDuLieu);
afterAll(dongKetNoi);

const xacThuc = (nguoiDung) => ({ Authorization: `Bearer ${taoTokenCho(nguoiDung)}` });
const luu = (nguoiDung, danhSachMuc) =>
    request(app).put('/api/gio-hang').set(xacThuc(nguoiDung)).send({ danh_sach_muc: danhSachMuc });
const doc = (nguoiDung) => request(app).get('/api/gio-hang').set(xacThuc(nguoiDung));

describe('Giỏ hàng theo tài khoản', () => {
    test('chưa đăng nhập → 401 (cả đọc lẫn ghi)', async () => {
        expect((await request(app).get('/api/gio-hang')).status).toBe(401);
        expect((await request(app).put('/api/gio-hang').send({ danh_sach_muc: [] })).status).toBe(401);
    });

    test('lưu rồi đọc lại → đúng món và số lượng, kèm thông tin sản phẩm hiện tại', async () => {
        const nguoiDung = await taoNguoiDung();
        await taoSanPham({ gia_goc: 0, gia_khuyen_mai: 20000000 });
        await luu(nguoiDung, [{ san_pham_id: 'asus-zenbook-14-test', so_luong: 2 }]);
        const res = await doc(nguoiDung);

        expect(res.status).toBe(200);
        expect(res.body.danh_sach_muc).toHaveLength(1);
        expect(res.body.danh_sach_muc[0]).toMatchObject({ san_pham_id: 'asus-zenbook-14-test', so_luong: 2 });
        expect(res.body.danh_sach_muc[0].san_pham.gia_khuyen_mai).toBe(20000000);
        expect(res.headers['cache-control']).toBe('no-store');
    });

    test('giỏ đi theo tài khoản: lưu ở máy này, đọc được ở máy khác (cùng tài khoản), người khác không thấy', async () => {
        const chuGio = await taoNguoiDung();
        const nguoiKhac = await taoNguoiDung();
        await taoSanPham();
        await luu(chuGio, [{ san_pham_id: 'asus-zenbook-14-test', so_luong: 1 }]);

        const mayKhac = await doc(chuGio); // token mới = máy khác của cùng tài khoản
        const nguoiLa = await doc(nguoiKhac);

        expect(mayKhac.body.danh_sach_muc).toHaveLength(1);
        expect(nguoiLa.body.danh_sach_muc).toHaveLength(0);
    });

    test('Admin đổi giá → lần đọc sau thấy giá mới (server không lưu giá cũ)', async () => {
        const nguoiDung = await taoNguoiDung();
        await taoSanPham({ gia_goc: 0, gia_khuyen_mai: 20000000 });
        await luu(nguoiDung, [{ san_pham_id: 'asus-zenbook-14-test', so_luong: 1 }]);
        await SanPham.updateOne({ id: 'asus-zenbook-14-test' }, { $set: { gia_khuyen_mai: 15000000 } });
        const res = await doc(nguoiDung);

        expect(res.body.danh_sach_muc[0].san_pham.gia_khuyen_mai).toBe(15000000);
    });

    test('client gửi kèm giá giả → bị bỏ qua, server không lưu', async () => {
        const nguoiDung = await taoNguoiDung();
        await taoSanPham({ gia_goc: 0, gia_khuyen_mai: 20000000 });
        await luu(nguoiDung, [{ san_pham_id: 'asus-zenbook-14-test', so_luong: 1, gia: 1, gia_hien_tai: 1 }]);
        const res = await doc(nguoiDung);

        expect(res.body.danh_sach_muc[0].san_pham.gia_khuyen_mai).toBe(20000000);
        expect(res.body.danh_sach_muc[0].gia).toBeUndefined();
    });

    test('món bị Admin ẩn hoặc hết hàng → tự gỡ khỏi giỏ và báo trong da_go', async () => {
        const nguoiDung = await taoNguoiDung();
        await taoSanPham();
        await taoSanPham({ id: 'sp-an', slug: 'sp-an', ma_san_pham: 'AN-01', ten_san_pham: 'Laptop Sẽ Bị Ẩn' });
        await luu(nguoiDung, [
            { san_pham_id: 'asus-zenbook-14-test', so_luong: 1 },
            { san_pham_id: 'sp-an', so_luong: 1 }
        ]);
        await SanPham.updateOne({ id: 'sp-an' }, { $set: { con_hang: false } });
        const res = await doc(nguoiDung);

        expect(res.body.danh_sach_muc.map((m) => m.san_pham_id)).toEqual(['asus-zenbook-14-test']);
        expect(res.body.da_go).toEqual(['Laptop Sẽ Bị Ẩn']);
        // đã dọn luôn trong database
        expect((await doc(nguoiDung)).body.da_go).toEqual([]);
    });

    test('số lượng vượt tồn kho → hạ về đúng tồn kho', async () => {
        const nguoiDung = await taoNguoiDung();
        await taoSanPham({ so_luong_ton_kho: 3 });
        await luu(nguoiDung, [{ san_pham_id: 'asus-zenbook-14-test', so_luong: 8 }]);
        const res = await doc(nguoiDung);

        expect(res.body.danh_sach_muc[0].so_luong).toBe(3);
    });

    test('chuẩn hóa: gộp dòng trùng, giới hạn số lượng 1–10, bỏ dòng thiếu mã', async () => {
        const nguoiDung = await taoNguoiDung();
        await taoSanPham({ so_luong_ton_kho: 50 });
        await luu(nguoiDung, [
            { san_pham_id: 'asus-zenbook-14-test', so_luong: 6 },
            { san_pham_id: 'asus-zenbook-14-test', so_luong: 7 },
            { so_luong: 2 },
            { san_pham_id: 'khac', so_luong: -5 }
        ]);
        const luuTru = await require('../../models/gio-hang.model').findOne().lean();

        expect(luuTru.danh_sach_muc).toEqual([
            { san_pham_id: 'asus-zenbook-14-test', ma_tuy_chon: '', so_luong: 10 },
            { san_pham_id: 'khac', ma_tuy_chon: '', so_luong: 1 }
        ]);
    });

    test.each([
        ['không phải mảng', { danh_sach_muc: 'abc' }],
        ['thiếu trường', {}],
        [
            'quá 50 dòng',
            { danh_sach_muc: Array.from({ length: 51 }, (_, i) => ({ san_pham_id: `sp${i}`, so_luong: 1 })) }
        ]
    ])('dữ liệu giỏ không hợp lệ (%s) → 400', async (_ten, duLieu) => {
        const nguoiDung = await taoNguoiDung();
        const res = await request(app).put('/api/gio-hang').set(xacThuc(nguoiDung)).send(duLieu);

        expect(res.status).toBe(400);
    });

    test('lưu mảng rỗng → xóa sạch giỏ', async () => {
        const nguoiDung = await taoNguoiDung();
        await taoSanPham();
        await luu(nguoiDung, [{ san_pham_id: 'asus-zenbook-14-test', so_luong: 1 }]);
        await luu(nguoiDung, []);

        expect((await doc(nguoiDung)).body.danh_sach_muc).toEqual([]);
    });
});
