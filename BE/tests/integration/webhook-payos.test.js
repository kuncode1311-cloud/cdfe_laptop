/**
 * Kiểm thử tích hợp: Webhook PayOS (/api/thanh-toan/webhook).
 * Đây là API nhạy cảm nhất: nếu tin nhầm webhook giả, kẻ gian có thể biến đơn
 * hàng thành "đã thanh toán" mà không trả tiền.
 */

// Thay dịch vụ email và Telegram bằng hàm giả: test không gửi tin nhắn thật
jest.mock('../../services/email.service', () => ({
    guiMailXacNhanDonHang: jest.fn().mockResolvedValue({ thanhCong: true })
}));
jest.mock('../../services/telegram-bot.service', () => ({
    guiThongBaoDonHangTelegram: jest.fn().mockResolvedValue(true)
}));

const request = require('supertest');
const app = require('../../app');
const DonHang = require('../../models/don-hang.model');
const { taoChuKyPayOS } = require('../../controllers/thanh-toan.controller');
const { guiThongBaoDonHangTelegram } = require('../../services/telegram-bot.service');
const { moKetNoi, xoaDuLieu, dongKetNoi } = require('../helpers/co-so-du-lieu');

beforeAll(moKetNoi);
afterEach(xoaDuLieu);
afterAll(dongKetNoi);

const MA_PAYOS = 20263573;
const SO_TIEN = 25990000;

// Tạo webhook giống PayOS gửi: dữ liệu giao dịch + chữ ký bằng checksum key
const taoWebhook = (data, chuKy) => ({
    code: '00',
    data,
    signature: chuKy ?? taoChuKyPayOS(data, process.env.PAYOS_CHECKSUM_KEY)
});

const taoDonChoThanhToan = () =>
    DonHang.create({
        id: 'dh_test_1',
        ma_don_hang: 'LPN-2026-TEST',
        ngay_tao: '02/10/2026',
        thong_tin_giao_hang: { so_dien_thoai: '0912345678', email: 'khach@gmail.com' },
        tam_tinh: SO_TIEN,
        tong_tien_thanh_toan: SO_TIEN,
        hinh_thuc_thanh_toan: 'chuyen_khoan_vietqr',
        trang_thai_thanh_toan: 'cho_thanh_toan',
        payos_order_code: MA_PAYOS
    });

describe('POST /api/thanh-toan/webhook', () => {
    beforeEach(() => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    test('thiếu chữ ký → 400', async () => {
        const res = await request(app)
            .post('/api/thanh-toan/webhook')
            .send({ data: { orderCode: 1 } });

        expect(res.status).toBe(400);
    });

    test('chữ ký giả mạo → 400, đơn hàng KHÔNG đổi trạng thái', async () => {
        await taoDonChoThanhToan();
        const res = await request(app)
            .post('/api/thanh-toan/webhook')
            .send(taoWebhook({ orderCode: MA_PAYOS, amount: SO_TIEN, code: '00' }, 'chu-ky-gia-mao'));

        expect(res.status).toBe(400);
        const don = await DonHang.findOne({ payos_order_code: MA_PAYOS });
        expect(don.da_thanh_toan).toBe(false);
    });

    test('chữ ký đúng nhưng số tiền sai → 400', async () => {
        await taoDonChoThanhToan();
        const res = await request(app)
            .post('/api/thanh-toan/webhook')
            .send(taoWebhook({ orderCode: MA_PAYOS, amount: 1000, code: '00' }));

        expect(res.status).toBe(400);
    });

    test('webhook thử của PayOS (không có đơn tương ứng) → vẫn 200', async () => {
        const res = await request(app)
            .post('/api/thanh-toan/webhook')
            .send(taoWebhook({ orderCode: 123, amount: 3000, code: '00' }));

        expect(res.status).toBe(200);
    });

    test('webhook hợp lệ → 200, đơn chuyển "đã thanh toán" và báo Telegram', async () => {
        await taoDonChoThanhToan();
        const res = await request(app)
            .post('/api/thanh-toan/webhook')
            .send(taoWebhook({ orderCode: MA_PAYOS, amount: SO_TIEN, code: '00' }));

        expect(res.status).toBe(200);
        const don = await DonHang.findOne({ payos_order_code: MA_PAYOS });
        expect(don.da_thanh_toan).toBe(true);
        expect(don.trang_thai_thanh_toan).toBe('da_thanh_toan');
        expect(guiThongBaoDonHangTelegram).toHaveBeenCalled();
    });

    test('PayOS gửi lại webhook lần 2 → 200 nhưng không xử lý lặp (idempotent)', async () => {
        await taoDonChoThanhToan();
        const webhook = taoWebhook({ orderCode: MA_PAYOS, amount: SO_TIEN, code: '00' });

        await request(app).post('/api/thanh-toan/webhook').send(webhook);
        guiThongBaoDonHangTelegram.mockClear();

        const lan2 = await request(app).post('/api/thanh-toan/webhook').send(webhook);

        expect(lan2.status).toBe(200);
        expect(lan2.body.message).toContain('trước đó');
        expect(guiThongBaoDonHangTelegram).not.toHaveBeenCalled();
    });
});

describe('GET /api/thanh-toan/kiem-tra/:orderCode', () => {
    afterEach(() => jest.restoreAllMocks());

    test('PayOS báo PAID đúng tiền → DB đã lưu trước khi trả kết quả', async () => {
        const maPayOS = MA_PAYOS + 10;
        await taoDonChoThanhToan().then((don) => DonHang.updateOne({ _id: don._id }, { payos_order_code: maPayOS }));
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: async () => ({ code: '00', data: { status: 'PAID', amountPaid: SO_TIEN, amount: SO_TIEN } })
        });
        const res = await request(app).get(`/api/thanh-toan/kiem-tra/${maPayOS}`);
        expect(res.status).toBe(200);
        expect(res.body.da_thanh_toan).toBe(true);
        const don = await DonHang.findOne({ payos_order_code: maPayOS });
        expect(don.da_thanh_toan).toBe(true);
        expect(don.trang_thai_thanh_toan).toBe('da_thanh_toan');
    });

    test('PayOS báo PAID nhưng thiếu tiền → không đánh dấu đơn đã thanh toán', async () => {
        const maPayOS = MA_PAYOS + 1;
        await taoDonChoThanhToan().then((don) => DonHang.updateOne({ _id: don._id }, { payos_order_code: maPayOS }));
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: async () => ({ code: '00', data: { status: 'PAID', amountPaid: SO_TIEN - 1000, amount: SO_TIEN } })
        });
        const res = await request(app).get(`/api/thanh-toan/kiem-tra/${maPayOS}`);
        expect(res.status).toBe(200);
        expect(res.body.da_thanh_toan).toBe(false);
        expect((await DonHang.findOne({ payos_order_code: maPayOS })).da_thanh_toan).toBe(false);
    });
});
