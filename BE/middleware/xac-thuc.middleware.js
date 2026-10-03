const jwt = require('jsonwebtoken');
const NguoiDung = require('../models/nguoi-dung.model');

const layJwtSecret = () => process.env.JWT_SECRET;

/**
 * Middleware xác thực JSON Web Token (JWT)
 */
const xacThucToken = async (req, res, next) => {
    try {
        let token = null;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                thong_diep: 'Vui lòng đăng nhập để thực hiện chức năng này (Thiếu Token xác thực)!'
            });
        }

        const secret = layJwtSecret();
        if (!secret) {
            return res.status(500).json({
                thong_diep: 'Máy chủ chưa cấu hình JWT_SECRET. Vui lòng kiểm tra biến môi trường.'
            });
        }

        // Giải mã và kiểm tra hạn sử dụng của Token
        const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }); // Chỉ chấp nhận HS256, chặn tấn công đổi thuật toán (alg: none)

        // Tìm người dùng trong MongoDB - hỗ trợ cả custom id (string) và MongoDB _id (ObjectId)
        const orConditions = [{ id: decoded.userId }, { email: decoded.email }];
        if (decoded.userId && /^[0-9a-fA-F]{24}$/.test(decoded.userId)) {
            orConditions.push({ _id: decoded.userId });
        }
        const nguoiDung = await NguoiDung.findOne({ $or: orConditions }).select('+tokenVersion');

        if (!nguoiDung) {
            return res.status(401).json({
                thong_diep: 'Tài khoản không tồn tại hoặc đã bị khóa!'
            });
        }

        if (nguoiDung.biKhoa || nguoiDung.trangThai === 'bi_khoa' || nguoiDung.daKichHoat === false) {
            return res.status(403).json({
                thong_diep: 'Tài khoản chưa kích hoạt hoặc đã bị khóa.'
            });
        }
        if (Number(decoded.tokenVersion || 0) !== Number(nguoiDung.tokenVersion || 0)) {
            return res.status(401).json({ thong_diep: 'Phiên đăng nhập đã bị thu hồi. Vui lòng đăng nhập lại.' });
        }

        // Gắn thông tin người dùng vào request để các Controller tiếp theo sử dụng
        req.user = nguoiDung;
        next();
    } catch (loi) {
        if (loi.name === 'TokenExpiredError') {
            return res.status(401).json({
                thong_diep: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!'
            });
        }
        return res.status(401).json({
            thong_diep: 'Token xác thực không hợp lệ hoặc đã bị thay đổi!'
        });
    }
};

/**
 * Middleware kiểm tra quyền Quản trị viên (Admin)
 */
const chiAdmin = (req, res, next) => {
    if (!req.user || req.user.vaiTro !== 'admin') {
        return res.status(403).json({
            thong_diep: 'Truy cập bị từ chối: Bạn không có quyền Quản trị viên (Admin) để thực hiện thao tác này!'
        });
    }
    next();
};

/**
 * Middleware nhận diện người dùng tùy chọn (Optional Auth)
 * Nếu có token hợp lệ thì gắn req.user, nếu không có token hoặc token không hợp lệ thì gán req.user = null
 */
const nhanDienNguoiDungTuyChon = async (req, res, next) => {
    try {
        let token = null;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            req.user = null;
            return next();
        }

        const secret = layJwtSecret();
        if (!secret) {
            return res.status(500).json({
                thong_diep: 'Máy chủ chưa cấu hình JWT_SECRET. Vui lòng kiểm tra biến môi trường.'
            });
        }
        const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }); // Chỉ chấp nhận HS256, chặn tấn công đổi thuật toán (alg: none)

        const orConditions = [{ id: decoded.userId }, { email: decoded.email }];
        if (decoded.userId && /^[0-9a-fA-F]{24}$/.test(decoded.userId)) {
            orConditions.push({ _id: decoded.userId });
        }
        const nguoiDung = await NguoiDung.findOne({ $or: orConditions }).select('+tokenVersion');

        if (!nguoiDung) {
            return res.status(401).json({ thong_diep: 'Token không còn thuộc tài khoản hợp lệ.' });
        }
        if (nguoiDung.biKhoa || nguoiDung.trangThai === 'bi_khoa' || nguoiDung.daKichHoat === false) {
            return res.status(403).json({ thong_diep: 'Tài khoản chưa kích hoạt hoặc đã bị khóa.' });
        }
        if (Number(decoded.tokenVersion || 0) !== Number(nguoiDung.tokenVersion || 0)) {
            return res.status(401).json({ thong_diep: 'Phiên đăng nhập đã bị thu hồi. Vui lòng đăng nhập lại.' });
        }

        req.user = nguoiDung;
        next();
    } catch (loi) {
        return res.status(401).json({ thong_diep: 'Token xác thực không hợp lệ hoặc đã hết hạn.' });
    }
};

/**
 * Middleware nhận diện "mềm": dùng cho API công khai (vd: tin tức).
 * Có token hợp lệ thì gắn req.user để biết có phải Admin không; token lỗi/hết hạn
 * cũng KHÔNG chặn request (khách vẫn xem được trang công khai), chỉ coi như khách.
 */
const nhanDienNguoiDungMem = async (req, res, next) => {
    req.user = null;
    try {
        const header = req.headers.authorization || '';
        const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
        const secret = layJwtSecret();
        if (!token || !secret) return next();

        const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
        const nguoiDung = await NguoiDung.findOne({ $or: [{ id: decoded.userId }, { email: decoded.email }] });
        if (
            nguoiDung &&
            !nguoiDung.biKhoa &&
            nguoiDung.trangThai !== 'bi_khoa' &&
            Number(decoded.tokenVersion || 0) === Number(nguoiDung.tokenVersion || 0)
        ) {
            req.user = nguoiDung;
        }
    } catch (loi) {
        req.user = null;
    }
    next();
};

module.exports = {
    xacThucToken,
    chiAdmin,
    nhanDienNguoiDungTuyChon,
    nhanDienNguoiDungMem
};
