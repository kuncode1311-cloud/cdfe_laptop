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

describe('Sản phẩm tạm ẩn (con_hang = false)', () => {
    const taoSanPhamAn = () =>
        taoSanPham({
            id: 'an-di',
            slug: 'an-di',
            ma_san_pham: 'AN-01',
            ten_san_pham: 'Laptop Tạm Ẩn',
            con_hang: false
        });

    test('khách không thấy sản phẩm ẩn trong danh sách', async () => {
        await taoSanPham();
        await taoSanPhamAn();
        const res = await request(app).get('/api/san-pham');

        expect(res.body.map((sp) => sp.id)).toEqual(['asus-zenbook-14-test']);
    });

    test('sản phẩm BÁN HẾT (tồn kho 0, con_hang = false) vẫn hiện cho khách, khác với sản phẩm Admin chủ động ẩn', async () => {
        await taoSanPham({
            id: 'het-hang',
            slug: 'het-hang',
            ma_san_pham: 'HET-01',
            so_luong_ton_kho: 0,
            con_hang: false
        });
        await taoSanPhamAn();
        const ds = await request(app).get('/api/san-pham');
        const ct = await request(app).get('/api/san-pham/het-hang');

        expect(ds.body.map((sp) => sp.id)).toEqual(['het-hang']);
        expect(ct.status).toBe(200);
    });

    test('khách mở chi tiết sản phẩm ẩn → 404', async () => {
        await taoSanPhamAn();
        const res = await request(app).get('/api/san-pham/an-di');

        expect(res.status).toBe(404);
    });

    test('Admin vẫn thấy sản phẩm ẩn (danh sách và chi tiết), phản hồi không cache dùng chung', async () => {
        const admin = await taoNguoiDung({ vaiTro: 'admin' });
        await taoSanPham();
        await taoSanPhamAn();
        const auth = { Authorization: `Bearer ${taoTokenCho(admin)}` };

        const ds = await request(app).get('/api/san-pham').set(auth);
        const ct = await request(app).get('/api/san-pham/an-di').set(auth);

        expect(ds.body).toHaveLength(2);
        expect(ct.status).toBe(200);
        expect(ds.headers['cache-control']).toContain('no-store');
    });

    test('token khách hàng thường không xem được sản phẩm ẩn', async () => {
        const khach = await taoNguoiDung();
        await taoSanPhamAn();
        const res = await request(app)
            .get('/api/san-pham/an-di')
            .set('Authorization', `Bearer ${taoTokenCho(khach)}`);

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

describe('Giá sản phẩm (Admin sửa giá)', () => {
    const dangNhapAdmin = async () => ({
        Authorization: `Bearer ${taoTokenCho(await taoNguoiDung({ vaiTro: 'admin' }))}`
    });

    test('giá niêm yết gốc THẤP HƠN giá bán → 400, kèm hướng dẫn sửa ô "Giá Khuyến Mãi"', async () => {
        await taoSanPham({ gia_goc: 30000000, gia_khuyen_mai: 25990000 });
        const res = await request(app)
            .put('/api/san-pham/asus-zenbook-14-test')
            .set(await dangNhapAdmin())
            .send({ gia_goc: 1000, gia_khuyen_mai: 25990000 });

        expect(res.status).toBe(400);
        expect(res.body.thong_diep).toContain('Giá Khuyến Mãi');
        expect((await SanPham.findOne({ id: 'asus-zenbook-14-test' })).gia_goc).toBe(30000000); // không bị ghi đè
    });

    test('sửa giá bán hợp lệ → phần trăm giảm do server tính lại, không tin số client gửi', async () => {
        await taoSanPham({ gia_goc: 125000000, gia_khuyen_mai: 109990000, phan_tram_giam_gia: 12 });
        const res = await request(app)
            .put('/api/san-pham/asus-zenbook-14-test')
            .set(await dangNhapAdmin())
            .send({ gia_goc: 125000000, gia_khuyen_mai: 100000000, phan_tram_giam_gia: 99 });

        expect(res.status).toBe(200);
        expect(res.body.gia_khuyen_mai).toBe(100000000);
        expect(res.body.phan_tram_giam_gia).toBe(20); // (125tr - 100tr) / 125tr
    });

    test('giá gốc = 0 (không có giá cũ) → hợp lệ, phần trăm giảm = 0', async () => {
        await taoSanPham();
        const res = await request(app)
            .put('/api/san-pham/asus-zenbook-14-test')
            .set(await dangNhapAdmin())
            .send({ gia_goc: 0, gia_khuyen_mai: 25990000 });

        expect(res.status).toBe(200);
        expect(res.body.phan_tram_giam_gia).toBe(0);
    });

    test('đổi trạng thái ẩn / hiện (không gửi giá) vẫn được và không bị kiểm tra giá', async () => {
        await taoSanPham({ gia_goc: 1000, gia_khuyen_mai: 25990000 }); // dữ liệu cũ có giá lệch
        const res = await request(app)
            .put('/api/san-pham/asus-zenbook-14-test')
            .set(await dangNhapAdmin())
            .send({ con_hang: false });

        expect(res.status).toBe(200);
        expect(res.body.con_hang).toBe(false);
    });

    test('thêm sản phẩm với giá gốc thấp hơn giá bán → 400', async () => {
        const res = await request(app)
            .post('/api/san-pham')
            .set(await dangNhapAdmin())
            .send({
                ma_san_pham: 'GIA-01',
                ten_san_pham: 'Laptop Sai Giá',
                hang_san_xuat: 'asus',
                gia_goc: 5000000,
                gia_khuyen_mai: 9000000
            });

        expect(res.status).toBe(400);
        expect(await SanPham.countDocuments()).toBe(0);
    });
});
