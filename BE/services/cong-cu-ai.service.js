const mongoose = require('mongoose');
const SanPham = require('../models/san-pham.model');
const DanhMuc = require('../models/danh-muc.model');
const CaiDat = require('../models/cai-dat.model');
const TinTuc = require('../models/tin-tuc.model');

// Chỉ các hàm đọc dữ liệu công khai được phép gọi; không nhận truy vấn MongoDB từ mô hình.
const moTaCongCu = [
    { ten: 'danh_muc', mo_ta: 'Đọc danh mục, thương hiệu thực tế để biết mã lọc.', tham_so: {} },
    {
        ten: 'tim_san_pham',
        mo_ta: 'Tìm hoặc so sánh sản phẩm, giá, cấu hình, tồn kho. Không truyền tiêu chí khách không yêu cầu.',
        tham_so: {
            tu_khoa: 'string[] (các từ phải cùng xuất hiện trong tên hoặc thông số)',
            hang: 'string',
            danh_muc: 'string[]',
            ids: 'string[]',
            gia_min: 'number VND',
            gia_max: 'number VND',
            sap_xep: 'gia_tang | gia_giam | ban_chay | moi_nhat',
            gioi_han: 'integer 1..10'
        }
    },
    {
        ten: 'thong_ke_san_pham',
        mo_ta: 'Đếm toàn bộ sản phẩm đang bán; thống kê theo hãng, danh mục, giá và tồn kho. Có thể lọc hãng hoặc danh mục.',
        tham_so: { hang: 'string', danh_muc: 'string[]' }
    },
    { ten: 'showroom', mo_ta: 'Đọc địa chỉ, hotline và giờ mở cửa showroom.', tham_so: {} },
    {
        ten: 'bai_viet',
        mo_ta: 'Tìm bài viết đã xuất bản theo từ khóa, gồm hướng dẫn và chính sách nếu có.',
        tham_so: { tu_khoa: 'string' }
    }
];
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function chuoi(value) {
    if (typeof value !== 'string' || value.length > 120) throw new Error('Tham số chuỗi không hợp lệ');
    return value.trim();
}
function mang(value) {
    if (!Array.isArray(value) || value.length > 10) throw new Error('Tham số danh sách không hợp lệ');
    return value.map(chuoi).filter(Boolean);
}
function taoBoLoc(args = {}) {
    const filter = { $nor: [{ con_hang: false }, { so_luong_ton_kho: { $lte: 0 } }] };
    if (args.hang) filter.hang_san_xuat = new RegExp('^' + escapeRegex(chuoi(args.hang)) + '$', 'i');
    if (args.danh_muc) filter.danh_muc = { $in: mang(args.danh_muc) };
    if (args.ids) {
        const ids = mang(args.ids);
        filter.$or = [{ id: { $in: ids } }, { slug: { $in: ids } }];
    }
    const gia = {};
    for (const [key, operator] of [
        ['gia_min', '$gte'],
        ['gia_max', '$lte']
    ]) {
        if (args[key] !== undefined) {
            if (typeof args[key] !== 'number' || !Number.isFinite(args[key]) || args[key] < 0)
                throw new Error('Giá không hợp lệ');
            gia[operator] = args[key];
        }
    }
    if (Object.keys(gia).length) filter.gia_khuyen_mai = gia;
    if (args.tu_khoa) {
        filter.$and = mang(args.tu_khoa).map((word) => ({
            $or: ['ten_san_pham', 'thong_so.cpu', 'thong_so.ram', 'thong_so.card_do_hoa', 'thong_so.o_cung'].map(
                (field) => ({ [field]: new RegExp(escapeRegex(word), 'i') })
            )
        }));
        if (!filter.$and.length) delete filter.$and;
    }
    return filter;
}
async function thucThiCongCu(ten, args = {}) {
    if (!moTaCongCu.some((tool) => tool.ten === ten)) throw new Error('Công cụ không được hỗ trợ');
    if (!args || typeof args !== 'object' || Array.isArray(args)) throw new Error('Tham số không hợp lệ');
    if (mongoose.connection.readyState !== 1) throw new Error('Chưa kết nối được cơ sở dữ liệu');
    if (ten === 'danh_muc')
        return DanhMuc.find({ kich_hoat: { $ne: false } })
            .select('ma_danh_muc ten_danh_muc loai nhom_hang')
            .limit(100)
            .maxTimeMS(5000)
            .lean()
            .exec();
    if (ten === 'showroom')
        return CaiDat.findOne({ khoa: 'he_thong' }).select('danh_sach_showroom -_id').maxTimeMS(5000).lean().exec();
    if (ten === 'thong_ke_san_pham') {
        const filter = taoBoLoc(args);
        const [tong, theoHang, theoDanhMuc, gia] = await Promise.all([
            SanPham.countDocuments(filter).maxTimeMS(5000).exec(),
            SanPham.aggregate([
                { $match: filter },
                { $group: { _id: '$hang_san_xuat', so_luong: { $sum: 1 } } },
                { $sort: { so_luong: -1, _id: 1 } },
                { $limit: 50 }
            ]).option({ maxTimeMS: 5000 }),
            SanPham.aggregate([
                { $match: filter },
                { $unwind: '$danh_muc' },
                { $group: { _id: '$danh_muc', so_luong: { $sum: 1 } } },
                { $sort: { so_luong: -1, _id: 1 } },
                { $limit: 100 }
            ]).option({ maxTimeMS: 5000 }),
            SanPham.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: null,
                        gia_thap_nhat: { $min: '$gia_khuyen_mai' },
                        gia_cao_nhat: { $max: '$gia_khuyen_mai' },
                        ton_kho: { $sum: '$so_luong_ton_kho' }
                    }
                }
            ]).option({ maxTimeMS: 5000 })
        ]);
        return { tong_san_pham: tong, theo_hang: theoHang, theo_danh_muc: theoDanhMuc, gia_va_ton_kho: gia[0] || null };
    }
    if (ten === 'bai_viet') {
        const regex = new RegExp(escapeRegex(chuoi(args.tu_khoa || '')), 'i');
        return TinTuc.find({ xuat_ban: true, $or: [{ tieu_de: regex }, { tom_tat: regex }] })
            .select('id slug tieu_de tom_tat noi_dung')
            .limit(3)
            .maxTimeMS(5000)
            .lean()
            .exec();
    }
    const sort = {
        gia_tang: { gia_khuyen_mai: 1, id: 1 },
        gia_giam: { gia_khuyen_mai: -1, id: 1 },
        ban_chay: { so_luong_da_ban: -1, id: 1 },
        moi_nhat: { createdAt: -1, id: 1 }
    };
    if (args.sap_xep && !sort[args.sap_xep]) throw new Error('Cách sắp xếp không hợp lệ');
    const limit = args.gioi_han === undefined ? 5 : args.gioi_han;
    if (!Number.isInteger(limit) || limit < 1 || limit > 10) throw new Error('Giới hạn phải từ 1 đến 10');
    return SanPham.find(taoBoLoc(args))
        .select('-danh_gia -thu_vien_hinh_anh -video_demo')
        .sort(sort[args.sap_xep] || sort.ban_chay)
        .limit(limit)
        .maxTimeMS(5000)
        .lean()
        .exec();
}
module.exports = { moTaCongCu, thucThiCongCu, taoBoLoc };
