const express = require('express');
const {
    layDanhSachTinTuc,
    layTinTucTheoIdHoacSlug,
    themTinTuc,
    capNhatTinTuc,
    xoaTinTuc
} = require('../controllers/tin-tuc.controller');

const router = express.Router();

router.get('/', layDanhSachTinTuc);
router.get('/:id', layTinTucTheoIdHoacSlug);
router.post('/', themTinTuc);
router.put('/:id', capNhatTinTuc);
router.delete('/:id', xoaTinTuc);

module.exports = router;
