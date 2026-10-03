/**
 * Kiểm thử đơn vị: các middleware bảo mật và giới hạn tần suất.
 * Gọi middleware trực tiếp với req/res giả, không cần khởi động server.
 */
const { datHeaderBaoMat, chongNoSqlInjection } = require('../../middleware/bao-mat.middleware');
const { gioiHanRequest } = require('../../middleware/gioi-han-request.middleware');
const { chiAdmin } = require('../../middleware/xac-thuc.middleware');

// Tạo đối tượng response giả: ghi lại header, status và body để kiểm tra
const taoResGia = () => {
    const res = { headers: {}, statusCode: 200, body: null };
    res.setHeader = (ten, giaTri) => {
        res.headers[ten] = giaTri;
    };
    res.status = (ma) => {
        res.statusCode = ma;
        return res;
    };
    res.json = (duLieu) => {
        res.body = duLieu;
        return res;
    };
    return res;
};

describe('chongNoSqlInjection', () => {
    test('xóa khóa bắt đầu bằng "$" trong body, kể cả lồng nhiều cấp', () => {
        const req = {
            body: { email: 'a@gmail.com', matKhau: { $ne: null }, loc: { gia: { $gt: 0 } } },
            params: {}
        };
        const next = jest.fn();
        jest.spyOn(console, 'warn').mockImplementation(() => {});

        chongNoSqlInjection(req, taoResGia(), next);

        expect(req.body.matKhau).toEqual({});
        expect(req.body.loc.gia).toEqual({});
        expect(req.body.email).toBe('a@gmail.com'); // dữ liệu hợp lệ giữ nguyên
        expect(next).toHaveBeenCalled();
    });

    test('xóa khóa chứa dấu "." và __proto__ (Prototype Pollution)', () => {
        const body = JSON.parse('{"a.b": 1, "__proto__": {"laAdmin": true}, "ten": "x"}');
        const req = { body, params: {} };

        chongNoSqlInjection(req, taoResGia(), jest.fn());

        expect(Object.keys(req.body)).toEqual(['ten']);
        expect({}.laAdmin).toBeUndefined();
    });
});

describe('datHeaderBaoMat', () => {
    test('gắn các security header cơ bản', () => {
        const res = taoResGia();
        datHeaderBaoMat({}, res, jest.fn());

        expect(res.headers['X-Content-Type-Options']).toBe('nosniff');
        expect(res.headers['X-Frame-Options']).toBe('DENY');
        expect(res.headers['Content-Security-Policy']).toContain("default-src 'none'");
    });
});

describe('gioiHanRequest — Rate Limiting theo IP', () => {
    test('cho qua đủ "max" request, request kế tiếp bị chặn 429', () => {
        const boGioiHan = gioiHanRequest({ windowMs: 60_000, max: 3 });
        const req = { ip: '10.0.0.1' };
        const next = jest.fn();

        for (let i = 0; i < 3; i += 1) boGioiHan(req, taoResGia(), next);
        const res = taoResGia();
        boGioiHan(req, res, next);

        expect(next).toHaveBeenCalledTimes(3);
        expect(res.statusCode).toBe(429);
        expect(res.headers['Retry-After']).toBeGreaterThan(0);
    });

    test('mỗi IP có bộ đếm riêng', () => {
        const boGioiHan = gioiHanRequest({ windowMs: 60_000, max: 1 });
        const next = jest.fn();

        boGioiHan({ ip: '10.0.0.2' }, taoResGia(), next);
        boGioiHan({ ip: '10.0.0.3' }, taoResGia(), next);

        expect(next).toHaveBeenCalledTimes(2);
    });
});

describe('chiAdmin — phân quyền RBAC', () => {
    test('khách hàng bị từ chối 403', () => {
        const res = taoResGia();
        const next = jest.fn();
        chiAdmin({ user: { vaiTro: 'khach_hang' } }, res, next);

        expect(res.statusCode).toBe(403);
        expect(next).not.toHaveBeenCalled();
    });

    test('admin được đi tiếp', () => {
        const next = jest.fn();
        chiAdmin({ user: { vaiTro: 'admin' } }, taoResGia(), next);
        expect(next).toHaveBeenCalled();
    });
});
