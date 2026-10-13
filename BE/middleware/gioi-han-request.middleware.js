const boDemTheoIp = new Map();
let soThuTuBoGioiHan = 0;
const SO_LUONG_TOI_DA = 50_000;

const layIp = (req) => {
    return req.ip || req.socket?.remoteAddress || 'unknown';
};

/**
 * Tạo middleware giới hạn tần suất (Rate Limiting) theo IP.
 * Mỗi bộ giới hạn có bộ đếm riêng và đếm theo IP (không theo từng đường dẫn),
 * nên kẻ tấn công không thể lách bằng cách đổi tham số trên URL (vd: /kiem-tra/1, /kiem-tra/2...).
 */
const gioiHanRequest = ({ windowMs = 60_000, max = 60, message } = {}) => {
    soThuTuBoGioiHan += 1;
    const tenBoGioiHan = `bo-${soThuTuBoGioiHan}`;

    return (req, res, next) => {
        const key = `${tenBoGioiHan}:${layIp(req)}`;
        const bayGio = Date.now();
        if (boDemTheoIp.size >= SO_LUONG_TOI_DA) {
            boDemTheoIp.clear();
        }
        const hienTai = boDemTheoIp.get(key);

        if (!hienTai || bayGio > hienTai.resetAt) {
            boDemTheoIp.set(key, { count: 1, resetAt: bayGio + windowMs });
            res.setHeader('RateLimit-Limit', max);
            res.setHeader('RateLimit-Remaining', max - 1);
            return next();
        }

        hienTai.count += 1;
        res.setHeader('RateLimit-Limit', max);
        res.setHeader('RateLimit-Remaining', Math.max(0, max - hienTai.count));
        if (hienTai.count > max) {
            res.setHeader('Retry-After', Math.ceil((hienTai.resetAt - bayGio) / 1000));
            return res.status(429).json({
                thong_diep: message || 'Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.'
            });
        }

        return next();
    };
};

setInterval(() => {
    const bayGio = Date.now();
    for (const [key, value] of boDemTheoIp.entries()) {
        if (bayGio > value.resetAt) boDemTheoIp.delete(key);
    }
}, 60_000).unref();

module.exports = {
    gioiHanRequest
};
