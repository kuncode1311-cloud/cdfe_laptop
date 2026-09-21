const jwt = require('jsonwebtoken');
const NguoiDung = require('../models/nguoi-dung.model');

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

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('❌ Chưa cấu hình JWT_SECRET trong file .env');
            return res.status(500).json({ thong_diep: 'Lỗi cấu hình xác thực máy chủ' });
        }

        // Giải mã và kiểm tra hạn sử dụng của Token
        const decoded = jwt.verify(token, secret);

        // Tìm người dùng trong MongoDB - hỗ trợ cả custom id (string) và MongoDB _id (ObjectId)
        const orConditions = [{ id: decoded.userId }, { email: decoded.email }];
        if (decoded.userId && /^[0-9a-fA-F]{24}$/.test(decoded.userId)) {
            orConditions.push({ _id: decoded.userId });
        }
        const nguoiDung = await NguoiDung.findOne({ $or: orConditions });

        if (!nguoiDung) {
            return res.status(401).json({
                thong_diep: 'Tài khoản không tồn tại hoặc đã bị khóa!'
            });
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

module.exports = {
    xacThucToken,
    chiAdmin
};
