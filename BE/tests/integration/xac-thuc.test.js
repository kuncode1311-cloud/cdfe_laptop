/**
 * Kiểm thử tích hợp: luồng xác thực JWT (/api/auth).
 * Bao phủ: kiểm tra đầu vào, đăng nhập, chống NoSQL Injection, khóa tài khoản khi
 * nhập sai nhiều lần, ẩn trường nhạy cảm và thu hồi token khi đăng xuất.
 */
const request = require('supertest');
const app = require('../../app');
const NguoiDung = require('../../models/nguoi-dung.model');
const { moKetNoi, xoaDuLieu, dongKetNoi } = require('../helpers/co-so-du-lieu');
const { MAT_KHAU_MAU, taoNguoiDung, taoTokenCho } = require('../helpers/du-lieu-mau');

beforeAll(moKetNoi);
// Ẩn log cảnh báo bảo mật (vd: "Đã loại khóa nguy hiểm") cho kết quả test gọn
beforeEach(() => jest.spyOn(console, 'warn').mockImplementation(() => {}));
afterEach(xoaDuLieu);
afterAll(dongKetNoi);

describe('POST /api/auth/dang-nhap', () => {
    test('thiếu email hoặc mật khẩu → 400', async () => {
        const res = await request(app).post('/api/auth/dang-nhap').send({ email: 'a@gmail.com' });

        expect(res.status).toBe(400);
    });

    test('sai mật khẩu → 401, thông báo chung không tiết lộ email có tồn tại hay không', async () => {
        const user = await taoNguoiDung();
        const res = await request(app)
            .post('/api/auth/dang-nhap')
            .send({ email: user.email, matKhau: 'SaiMatKhau999' });

        expect(res.status).toBe(401);
        expect(res.body.thong_diep).toBe('Tài khoản hoặc Mật khẩu không chính xác!');
    });

    test('đúng thông tin → 200, trả JWT và KHÔNG trả mật khẩu băm', async () => {
        const user = await taoNguoiDung();
        const res = await request(app).post('/api/auth/dang-nhap').send({ email: user.email, matKhau: MAT_KHAU_MAU });

        expect(res.status).toBe(200);
        expect(res.body.token.split('.')).toHaveLength(3); // header.payload.signature
        expect(res.body.nguoiDung.matKhau).toBeUndefined();
        expect(res.body.nguoiDung.tokenVersion).toBeUndefined();
    });

    test('tấn công NoSQL Injection { "$ne": null } bị chặn', async () => {
        const user = await taoNguoiDung();
        const res = await request(app)
            .post('/api/auth/dang-nhap')
            .send({ email: user.email, matKhau: { $ne: null } });

        expect(res.status).toBe(400);
        expect(res.body.token).toBeUndefined();
    });

    test('sai mật khẩu 5 lần → tạm khóa 429, kể cả nhập đúng sau đó', async () => {
        const user = await taoNguoiDung();
        const dangNhap = (matKhau) => request(app).post('/api/auth/dang-nhap').send({ email: user.email, matKhau });

        for (let i = 0; i < 4; i += 1) {
            expect((await dangNhap('SaiMatKhau999')).status).toBe(401);
        }
        expect((await dangNhap('SaiMatKhau999')).status).toBe(429); // lần thứ 5
        expect((await dangNhap(MAT_KHAU_MAU)).status).toBe(429); // vẫn đang bị khóa
    });

    test('tài khoản bị Admin khóa → 403', async () => {
        const user = await taoNguoiDung({ biKhoa: true, trangThai: 'bi_khoa' });
        const res = await request(app).post('/api/auth/dang-nhap').send({ email: user.email, matKhau: MAT_KHAU_MAU });

        expect(res.status).toBe(403);
    });
});

describe('POST /api/auth/dang-ky — kiểm tra dữ liệu đầu vào', () => {
    test.each([
        [{ hoTen: 'A', email: 'a@gmail.com', soDienThoai: '0912345678', matKhau: 'MatKhau123' }, 'họ tên quá ngắn'],
        [
            { hoTen: 'Trí Kun', email: 'khong-phai-email', soDienThoai: '0912345678', matKhau: 'MatKhau123' },
            'email sai định dạng'
        ],
        [{ hoTen: 'Trí Kun', email: 'a@gmail.com', soDienThoai: '12345', matKhau: 'MatKhau123' }, 'SĐT sai định dạng'],
        [{ hoTen: 'Trí Kun', email: 'a@gmail.com', soDienThoai: '0912345678', matKhau: '123' }, 'mật khẩu yếu']
    ])('từ chối 400 khi %#: %s', async (duLieu) => {
        const res = await request(app).post('/api/auth/dang-ky').send(duLieu);

        expect(res.status).toBe(400);
    });
});

describe('GET /api/auth/toi — API cần đăng nhập', () => {
    test('không gửi token → 401', async () => {
        const res = await request(app).get('/api/auth/toi');

        expect(res.status).toBe(401);
    });

    test('token giả mạo (sai chữ ký) → 401', async () => {
        const res = await request(app)
            .get('/api/auth/toi')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJ4In0.chu-ky-gia');

        expect(res.status).toBe(401);
    });

    test('token hợp lệ → 200 và trả đúng hồ sơ', async () => {
        const user = await taoNguoiDung();
        const res = await request(app)
            .get('/api/auth/toi')
            .set('Authorization', `Bearer ${taoTokenCho(user)}`);

        expect(res.status).toBe(200);
        expect(res.body.nguoiDung.email).toBe(user.email);
    });
});

describe('POST /api/auth/dang-xuat — thu hồi phiên', () => {
    test('sau khi đăng xuất, token cũ không dùng được nữa (tokenVersion tăng)', async () => {
        const user = await taoNguoiDung();
        const token = taoTokenCho(user);

        const dangXuat = await request(app).post('/api/auth/dang-xuat').set('Authorization', `Bearer ${token}`);
        expect(dangXuat.status).toBe(200);

        const goiLai = await request(app).get('/api/auth/toi').set('Authorization', `Bearer ${token}`);
        expect(goiLai.status).toBe(401);

        const trongDb = await NguoiDung.findById(user._id).select('+tokenVersion');
        expect(trongDb.tokenVersion).toBe(1);
    });
});
