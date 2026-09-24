const SanPham = require('../models/san-pham.model');
const taoSlug = require('../utils/tao-slug');

/**
 * Controller xử lý nghiệp vụ cho Sản phẩm Laptop
 */

// 1. Lấy tất cả sản phẩm (kèm tìm kiếm, lọc đa tiêu chí và sắp xếp)
const layTatCaSanPham = async (req, res) => {
    // Thiết lập HTTP Caching tối ưu cho Server Railway & Trình duyệt khách (cache 60s)
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');

    try {
        const {
            tu_khoa,
            q,
            hang_san_xuat,
            danh_muc,
            gia_min,
            gia_max,
            flash_sale,
            ban_chay,
            moi_nhat,
            sap_xep,
            limit
        } = req.query;

        // Xây dựng câu truy vấn MongoDB
        const filter = {};

        // Tìm kiếm theo từ khóa
        const keyword = tu_khoa || q;
        if (keyword) {
            filter.$or = [
                { ten_san_pham: { $regex: keyword, $options: 'i' } },
                { ma_san_pham: { $regex: keyword, $options: 'i' } },
                { hang_san_xuat: { $regex: keyword, $options: 'i' } },
                { 'thong_so.cpu': { $regex: keyword, $options: 'i' } },
                { 'thong_so.card_do_hoa': { $regex: keyword, $options: 'i' } }
            ];
        }

        // Lọc theo hãng sản xuất
        if (hang_san_xuat) {
            const brands = hang_san_xuat.split(',').map(b => b.trim().toLowerCase());
            filter.hang_san_xuat = { $in: brands };
        }

        // Lọc theo danh mục
        if (danh_muc) {
            const cats = danh_muc.split(',').map(c => c.trim().toLowerCase());
            filter.danh_muc = { $in: cats };
        }

        // Lọc theo khoảng giá
        if (gia_min !== undefined || gia_max !== undefined) {
            filter.gia_khuyen_mai = {};
            if (gia_min !== undefined) filter.gia_khuyen_mai.$gte = Number(gia_min);
            if (gia_max !== undefined) filter.gia_khuyen_mai.$lte = Number(gia_max);
        }

        // Lọc đặc biệt
        if (flash_sale === 'true' || flash_sale === '1') filter.la_flash_sale = true;
        if (ban_chay === 'true' || ban_chay === '1') filter.la_ban_chay = true;
        if (moi_nhat === 'true' || moi_nhat === '1') filter.la_san_pham_moi = true;

        // Xử lý sắp xếp
        let sortOption = {};
        if (sap_xep === 'gia_tang_dan') {
            sortOption = { gia_khuyen_mai: 1 };
        } else if (sap_xep === 'gia_giam_dan') {
            sortOption = { gia_khuyen_mai: -1 };
        } else if (sap_xep === 'ban_chay_nhat') {
            sortOption = { so_luong_da_ban: -1 };
        } else if (sap_xep === 'danh_gia_cao') {
            sortOption = { diem_danh_gia_tb: -1 };
        } else if (sap_xep === 'moi_nhat') {
            sortOption = { la_san_pham_moi: -1, createdAt: -1 };
        } else if (ban_chay === 'true' || ban_chay === '1') {
            sortOption = { so_luong_da_ban: -1 };
        }

        let query = SanPham.find(filter).sort(sortOption);

        // Giới hạn số lượng
        if (limit) {
            query = query.limit(Number(limit));
        }

        const danhSachSanPham = await query;
        return res.status(200).json(danhSachSanPham);
    } catch (loi) {
        console.error('Lỗi lấy danh sách sản phẩm từ MongoDB:', loi.message);
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ khi lấy danh sách sản phẩm', chi_tiet: loi.message });
    }
};

// 2. Lấy thông tin chi tiết một sản phẩm theo ID hoặc Mã SKU
const laySanPhamTheoId = async (req, res) => {
    // Cache chi tiết sản phẩm 120s
    res.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');

    try {
        const { id } = req.params;
        const decodedId = decodeURIComponent(id).trim();
        const slugId = decodedId
            .toLowerCase()
            .replace(/đ/g, 'd')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        // Ưu tiên slug SEO, id, SKU hoặc slug chuẩn hóa
        let sanPham = await SanPham.findOne({
            $or: [
                { slug: decodedId },
                { slug: slugId },
                { id: decodedId },
                { id: slugId },
                { ma_san_pham: { $regex: `^${decodedId}$`, $options: 'i' } },
                { ma_san_pham: { $regex: `^${id}$`, $options: 'i' } }
            ]
        });

        // Nếu chưa tìm thấy và id đúng định dạng ObjectId
        if (!sanPham && id.match(/^[0-9a-fA-F]{24}$/)) {
            sanPham = await SanPham.findById(id);
        }

        // Tìm kiếm gần đúng theo các từ khóa trong tên sản phẩm nếu chưa thấy
        if (!sanPham) {
            const words = decodedId.split(/[\s-]+/).filter(w => w.length > 1);
            if (words.length >= 2) {
                const regexPattern = words.map(w => `(?=.*${w})`).join('');
                sanPham = await SanPham.findOne({
                    ten_san_pham: { $regex: regexPattern, $options: 'i' }
                });
            }
        }

        if (!sanPham) {
            return res.status(404).json({ thong_diep: `Không tìm thấy sản phẩm với mã/id: ${id}` });
        }

        return res.status(200).json(sanPham);
    } catch (loi) {
        console.error('Lỗi lấy chi tiết sản phẩm từ MongoDB:', loi.message);
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ khi lấy chi tiết sản phẩm', chi_tiet: loi.message });
    }
};

// 3. Thêm sản phẩm mới (dành cho Admin)
const themSanPham = async (req, res) => {
    const duLieuMoi = { ...req.body };
    try {
        if (!duLieuMoi.id && duLieuMoi.ten_san_pham) {
            duLieuMoi.id = 'sp-' + Date.now();
        }
        if (!duLieuMoi.slug && duLieuMoi.ten_san_pham) {
            duLieuMoi.slug = taoSlug(duLieuMoi.ten_san_pham);
        }
        if (!duLieuMoi.hinh_anh_chinh) {
            duLieuMoi.hinh_anh_chinh = '/images/sp/asus_rog_scar18.jpg';
        }

        const sanPhamDaCo = await SanPham.findOne({
            $or: [{ id: duLieuMoi.id }, { slug: duLieuMoi.slug }, { ma_san_pham: duLieuMoi.ma_san_pham }]
        });
        if (sanPhamDaCo) {
            return res.status(409).json({ thong_diep: 'Sản phẩm đã tồn tại' });
        }
        const sanPhamMoi = await SanPham.create(duLieuMoi);
        return res.status(201).json(sanPhamMoi);
    } catch (loi) {
        console.error('Lỗi thêm sản phẩm:', loi);
        return res.status(500).json({ thong_diep: 'Không thể thêm sản phẩm', chi_tiet: loi.message });
    }
};

// 4. Cập nhật thông tin sản phẩm
const capNhatSanPham = async (req, res) => {
    const { id } = req.params;
    const duLieuCapNhat = { ...req.body };
    try {
        if (duLieuCapNhat.ten_san_pham && !duLieuCapNhat.slug) {
            duLieuCapNhat.slug = taoSlug(duLieuCapNhat.ten_san_pham);
        }

        let sanPham = await SanPham.findOneAndUpdate(
            { $or: [{ slug: id }, { id }, { ma_san_pham: id }] },
            { $set: duLieuCapNhat },
            { new: true, runValidators: true }
        );
        if (!sanPham && id.match(/^[0-9a-fA-F]{24}$/)) {
            sanPham = await SanPham.findByIdAndUpdate(id, { $set: duLieuCapNhat }, { new: true, runValidators: true });
        }
        if (!sanPham) return res.status(404).json({ thong_diep: 'Không tìm thấy sản phẩm' });
        return res.status(200).json(sanPham);
    } catch (loi) {
        console.error('Lỗi cập nhật sản phẩm:', loi);
        return res.status(500).json({ thong_diep: 'Không thể cập nhật sản phẩm', chi_tiet: loi.message });
    }
};

// 5. Xóa sản phẩm
const xoaSanPham = async (req, res) => {
    const { id } = req.params;
    try {
        let sanPham = await SanPham.findOneAndDelete({
            $or: [{ slug: id }, { id }, { ma_san_pham: id }]
        });
        if (!sanPham && id.match(/^[0-9a-fA-F]{24}$/)) {
            sanPham = await SanPham.findByIdAndDelete(id);
        }
        if (!sanPham) return res.status(404).json({ thong_diep: 'Không tìm thấy sản phẩm' });
        return res.status(200).json({ thong_diep: 'Đã xóa sản phẩm thành công', id });
    } catch (loi) {
        console.error('Lỗi xóa sản phẩm:', loi);
        return res.status(500).json({ thong_diep: 'Không thể xóa sản phẩm', chi_tiet: loi.message });
    }
};

module.exports = {
    layTatCaSanPham,
    laySanPhamTheoId,
    themSanPham,
    capNhatSanPham,
    xoaSanPham
};
