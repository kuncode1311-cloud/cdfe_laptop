/**
 * Kiểm thử tích hợp: cấu hình Banner / Flash Sale (/api/cai-dat/khuyen-mai).
 * Cấu hình do Admin đặt và lưu trên server để mọi khách đều thấy (không lưu ở trình duyệt Admin).
 */
const request = require('supertest');
const app = require('../../app');
const { moKetNoi, xoaDuLieu, dongKetNoi } = require('../helpers/co-so-du-lieu');
const { taoNguoiDung, taoTokenCho } = require('../helpers/du-lieu-mau');

beforeAll(moKetNoi);
afterEach(xoaDuLieu);
afterAll(dongKetNoi);

const cauHinhMau = { tieu_de_banner: 'Siêu sale cuối tuần', giam_toi_da: 30 };

describe('Cấu hình khuyến mãi', () => {
    test('chưa đặt → khách đọc được đối tượng rỗng', async () => {
        const res = await request(app).get('/api/cai-dat/khuyen-mai');

        expect(res.status).toBe(200);
        expect(res.body.du_lieu).toEqual({});
        expect(res.headers['cache-control']).toBe('no-store');
    });

    test('khách / chưa đăng nhập không được ghi (401 / 403)', async () => {
        const khach = await taoNguoiDung();
        const chuaDangNhap = await request(app).put('/api/cai-dat/khuyen-mai').send({ khuyen_mai: cauHinhMau });
        const khachThuong = await request(app)
            .put('/api/cai-dat/khuyen-mai')
            .set('Authorization', `Bearer ${taoTokenCho(khach)}`)
            .send({ khuyen_mai: cauHinhMau });

        expect(chuaDangNhap.status).toBe(401);
        expect(khachThuong.status).toBe(403);
    });

    test('Admin lưu → khách đọc lại được đúng nội dung (không cần cùng trình duyệt)', async () => {
        const admin = await taoNguoiDung({ vaiTro: 'admin' });
        const luu = await request(app)
            .put('/api/cai-dat/khuyen-mai')
            .set('Authorization', `Bearer ${taoTokenCho(admin)}`)
            .send({ khuyen_mai: cauHinhMau });
        const doc = await request(app).get('/api/cai-dat/khuyen-mai');

        expect(luu.status).toBe(200);
        expect(doc.body.du_lieu).toEqual(cauHinhMau);
    });

    test.each([
        ['mảng', { khuyen_mai: [1, 2] }],
        ['chuỗi', { khuyen_mai: 'abc' }],
        ['thiếu trường', {}],
        ['quá lớn', { khuyen_mai: { noi_dung: 'x'.repeat(25000) } }]
    ])('Admin gửi dữ liệu không hợp lệ (%s) → 400', async (_ten, duLieu) => {
        const admin = await taoNguoiDung({ vaiTro: 'admin' });
        const res = await request(app)
            .put('/api/cai-dat/khuyen-mai')
            .set('Authorization', `Bearer ${taoTokenCho(admin)}`)
            .send(duLieu);

        expect(res.status).toBe(400);
    });

    test('lưu cấu hình → chữ ký cai_dat trong /api/dong-bo đổi ngay (khách được báo để nạp lại)', async () => {
        const admin = await taoNguoiDung({ vaiTro: 'admin' });
        const truoc = (await request(app).get('/api/dong-bo')).body.phien_ban.cai_dat;
        await request(app)
            .put('/api/cai-dat/khuyen-mai')
            .set('Authorization', `Bearer ${taoTokenCho(admin)}`)
            .send({ khuyen_mai: cauHinhMau });
        const sau = (await request(app).get('/api/dong-bo')).body.phien_ban.cai_dat;

        expect(sau).not.toBe(truoc);
    });
});
