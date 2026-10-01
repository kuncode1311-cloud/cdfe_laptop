/**
 * Middleware bảo mật toàn cục: HTTP security headers và lọc NoSQL Injection.
 */

// 1. Security headers (tương đương các header cơ bản của thư viện Helmet)
const datHeaderBaoMat = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');           // Chặn trình duyệt đoán sai kiểu nội dung
    res.setHeader('X-Frame-Options', 'DENY');                     // Chống Clickjacking (nhúng API vào iframe)
    res.setHeader('Referrer-Policy', 'no-referrer');              // Không rò rỉ URL khi chuyển trang
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains'); // Bắt buộc HTTPS
    }
    next();
};

// 2. Lọc NoSQL Injection: xóa mọi khóa bắt đầu bằng "$" hoặc chứa "." trong body/params.
//    Ví dụ tấn công bị chặn: { "email": "admin@laptopnew.vn", "matKhau": { "$ne": null } }
const DO_SAU_TOI_DA = 10;
const locKhoaNguyHiem = (giaTri, doSau = 0) => {
    if (doSau > DO_SAU_TOI_DA || giaTri === null || typeof giaTri !== 'object') return 0;
    let soKhoaDaXoa = 0;
    for (const khoa of Object.keys(giaTri)) {
        if (khoa.startsWith('$') || khoa.includes('.') || khoa === '__proto__' || khoa === 'constructor' || khoa === 'prototype') {
            delete giaTri[khoa];
            soKhoaDaXoa += 1;
        } else {
            soKhoaDaXoa += locKhoaNguyHiem(giaTri[khoa], doSau + 1);
        }
    }
    return soKhoaDaXoa;
};

const chongNoSqlInjection = (req, res, next) => {
    const soKhoa = locKhoaNguyHiem(req.body) + locKhoaNguyHiem(req.params);
    if (soKhoa > 0) {
        console.warn(`🛡️ [Bảo mật] Đã loại ${soKhoa} khóa nguy hiểm ($ / .) khỏi request ${req.method} ${req.path}`);
    }
    next();
};

module.exports = {
    datHeaderBaoMat,
    chongNoSqlInjection
};
