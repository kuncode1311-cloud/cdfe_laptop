/**
 * Kiểm thử tích hợp: API sản phẩm (/api/san-pham).
 * Bao phủ: xem công khai, tìm kiếm an toàn, 404 và phân quyền Admin khi thêm/xóa.
 */
const request = require('supertest');
const app = require('../../app');
const SanPham = require('../../models/san-pham.model');
const { moKetNoi, xoaDuLieu, dongKetNoi } = require('../helpers/co-so-du-lieu');
const { taoNguoiDung, taoTokenCho, taoSanPham } = require('../helpers/du-lieu-mau');

beforeAll(moKetNoi);
afterEach(xoaDuLieu);
afterAll(dongKetNoi);

describe('Xem sản phẩm (công khai)', () => {
    test('GET /api/san-pham → 200, trả danh sách', async () => {
        await taoSanPham();
        const res = await request(app).get('/api/san-pham');

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].ten_san_pham).toContain('Zenbook');
    });

    test('tìm kiếm theo từ khóa và lọc theo hãng', async () => {
        await taoSanPham();
        await taoSanPham({
            id: 'dell-xps',
            slug: 'dell-xps',
            ma_san_pham: 'XPS',
            ten_san_pham: 'Dell XPS 13',
            hang_san_xuat: 'dell'
        });

        const theoTuKhoa = await request(app).get('/api/san-pham').query({ tu_khoa: 'xps' });
        const theoHang = await request(app).get('/api/san-pham').query({ hang_san_xuat: 'asus' });

        expect(theoTuKhoa.body.map((sp) => sp.id)).toEqual(['dell-xps']);
        expect(theoHang.body.map((sp) => sp.id)).toEqual(['asus-zenbook-14-test']);
    });

    test('từ khóa chứa biểu thức ReDoS không làm lỗi server', async () => {
        const res = await request(app).get('/api/san-pham').query({ tu_khoa: '(a+)+$' });

        expect(res.status).toBe(200);
    });

    test('GET /api/san-pham/:slug → 200 với sản phẩm có thật', async () => {
        await taoSanPham();
        const res = await request(app).get('/api/san-pham/asus-zenbook-14-test');

        expect(res.status).toBe(200);
        expect(res.body.ma_san_pham).toBe('UX3405-TEST');
    });

    test('sản phẩm không tồn tại → 404', async () => {
        const res = await request(app).get('/api/san-pham/khong-co-that');

        expect(res.status).toBe(404);
    });
});

describe('Quản lý sản phẩm (chỉ Admin)', () => {
    const sanPhamMoi = {
        ma_san_pham: 'NEW-01',
        ten_san_pham: 'Lenovo Legion Test',
        hang_san_xuat: 'lenovo',
        gia_khuyen_mai: 30000000
    };

    test('chưa đăng nhập → 401', async () => {
        const res = await request(app).post('/api/san-pham').send(sanPhamMoi);

        expect(res.status).toBe(401);
    });

    test('khách hàng thêm sản phẩm → 403', async () => {
        const khach = await taoNguoiDung();
        const res = await request(app)
            .post('/api/san-pham')
            .set('Authorization', `Bearer ${taoTokenCho(khach)}`)
            .send(sanPhamMoi);

        expect(res.status).toBe(403);
        expect(await SanPham.countDocuments()).toBe(0);
    });

    test('Admin thêm sản phẩm → 201, tự sinh slug từ tên', async () => {
        const admin = await taoNguoiDung({ vaiTro: 'admin' });
        const res = await request(app)
            .post('/api/san-pham')
            .set('Authorization', `Bearer ${taoTokenCho(admin)}`)
            .send(sanPhamMoi);

        expect(res.status).toBe(201);
        expect(res.body.slug).toBe('lenovo-legion-test');
    });

    test('Admin xóa sản phẩm → 200, sản phẩm biến mất khỏi DB', async () => {
        const admin = await taoNguoiDung({ vaiTro: 'admin' });
        await taoSanPham();
        const res = await request(app)
            .delete('/api/san-pham/asus-zenbook-14-test')
            .set('Authorization', `Bearer ${taoTokenCho(admin)}`);

        expect(res.status).toBe(200);
        expect(await SanPham.countDocuments()).toBe(0);
    });
});
