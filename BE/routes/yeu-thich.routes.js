const express = require('express');
const router = express.Router();
const { layYeuThichCuaToi, themYeuThich, xoaYeuThich } = require('../controllers/yeu-thich.controller');
const { xacThucToken } = require('../middleware/xac-thuc.middleware');
const { gioiHanRequest } = require('../middleware/gioi-han-request.middleware');

const gioiHanGhiYeuThich = gioiHanRequest({ windowMs: 60 * 1000, max: 60, message: 'Bạn thao tác yêu thích quá nhanh.' });

// Yêu thích chỉ dành cho người đã đăng nhập
router.get('/', xacThucToken, layYeuThichCuaToi);
router.post('/', xacThucToken, gioiHanGhiYeuThich, themYeuThich);
router.delete('/:idSanPham', xacThucToken, gioiHanGhiYeuThich, xoaYeuThich);

module.exports = router;
