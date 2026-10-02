/**
 * Kiểm thử tích hợp: hành vi chung của server (health check, 404, lỗi đầu vào,
 * CORS, security headers, tài liệu Swagger). Các ca này không cần database.
 */
const request = require('supertest');
const app = require('../../app');

describe('Hệ thống', () => {
    test('GET /api/health → 200 và trạng thái OK', async () => {
        const res = await request(app).get('/api/health');

        expect(res.status).toBe(200);
        expect(res.body.trang_thai).toBe('OK');
    });

    test('đường dẫn không tồn tại → 404 kèm thông điệp tiếng Việt', async () => {
        const res = await request(app).get('/api/khong-ton-tai');

        expect(res.status).toBe(404);
        expect(res.body.thong_diep).toContain('/api/khong-ton-tai');
    });

    test('JSON hỏng → 400 chứ không phải lỗi 500', async () => {
        const res = await request(app)
            .post('/api/auth/dang-nhap')
            .set('Content-Type', 'application/json')
            .send('{"email": ');

        expect(res.status).toBe(400);
    });

    test('mọi response đều có security headers và ẩn X-Powered-By', async () => {
        const res = await request(app).get('/api/health');

        expect(res.headers['x-content-type-options']).toBe('nosniff');
        expect(res.headers['x-frame-options']).toBe('DENY');
        expect(res.headers['x-powered-by']).toBeUndefined();
    });
});

describe('CORS', () => {
    test('origin đã khai báo (trikun.site) được phép', async () => {
        const res = await request(app).get('/api/health').set('Origin', 'https://trikun.site');

        expect(res.status).toBe(200);
        expect(res.headers['access-control-allow-origin']).toBe('https://trikun.site');
    });

    test('origin lạ bị chặn 403', async () => {
        const res = await request(app).get('/api/health').set('Origin', 'https://web-gia-mao.com');

        expect(res.status).toBe(403);
    });
});

describe('Tài liệu API (Swagger)', () => {
    test('GET /api-docs.json trả đặc tả OpenAPI 3 hợp lệ', async () => {
        const res = await request(app).get('/api-docs.json');

        expect(res.status).toBe(200);
        expect(res.body.openapi).toMatch(/^3\./);
        expect(Object.keys(res.body.paths).length).toBeGreaterThan(30);
        expect(res.headers['cache-control']).toBe('no-store');
    });
});
