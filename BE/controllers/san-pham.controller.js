const SanPham = require('../models/san-pham.model');
const taoSlug = require('../utils/tao-slug');
const { escapeRegex, chuoiAnToan } = require('../utils/bao-mat');

/**
 * Controller xử lý nghiệp vụ cho Sản phẩm Laptop
 */

// Khách chỉ thấy sản phẩm đang bán được. Sản phẩm bị ẨN khỏi khách khi:
//  - Admin chủ động tạm ẩn (con_hang = false), hoặc
//  - đã HẾT HÀNG (tồn kho <= 0; khi tồn về 0 hệ thống cũng tự đặt con_hang = false).
// Nhờ vậy khách không bấm nhầm vào món không mua được; Admin vẫn thấy tất cả để nhập thêm hàng / mở bán lại.
const laAdmin = (req) => req.user?.vaiTro === 'admin';
const daBiAn = (sanPham) => sanPham.con_hang === false || Number(sanPham.so_luong_ton_kho) <= 0;

// Phản hồi dành cho Admin (có thể chứa sản phẩm ẩn) không được cache dùng chung;
// phản hồi công khai cache ngắn để giảm tải cho server.
const datCacheTheoVaiTro = (req, res, cachePublic) => {
    res.vary('Authorization');
    res.set('Cache-Control', laAdmin(req) ? 'private, no-store' : cachePublic);
};

/**
 * LUỒNG 6: Truy vấn & Quản lý Danh mục Sản phẩm Laptop
 * - Hỗ trợ lọc đa tiêu chí: Hãng, phân khúc giá, nhu cầu, tình trạng Flash Sale, Bán chạy.
 * - Cơ chế Caching thông minh: Phân biệt quyền Khách (Public Cache 60s) vs Admin (No-store để cập nhật tức thì).
 * - Phòng chống ReDoS (Regular Expression Denial of Service) khi khách gõ từ khóa tìm kiếm.
 * - Cơ chế tự động ẩn sản phẩm hết hàng hoặc bị tạm ẩn khỏi người mua thường.
 */
const layTatCaSanPham = async (req, res) => {
    // HTTP Caching cho khách (60s); Admin luôn lấy dữ liệu mới nhất
    datCacheTheoVaiTro(req, res, 'public, max-age=60, stale-while-revalidate=120');

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
            limit,
            page
        } = req.query;

        // Xây dựng câu truy vấn MongoDB
        const filter = {};

        // Khách không thấy sản phẩm đã bị ẩn hoặc hết hàng
        if (!laAdmin(req)) filter.$nor = [{ con_hang: false }, { so_luong_ton_kho: { $lte: 0 } }];

        // Tìm kiếm theo từ khóa
        // Escape từ khóa: người dùng gõ ký tự đặc biệt như '(a+)+$' không làm treo server (ReDoS)
        const keyword = escapeRegex(chuoiAnToan(tu_khoa || q, 100));
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
            const brands = String(hang_san_xuat)
                .split(',')
                .slice(0, 20)
                .map((b) => b.trim().toLowerCase());
            filter.hang_san_xuat = { $in: brands };
        }

        // Lọc theo danh mục
        if (danh_muc) {
            const cats = String(danh_muc)
                .split(',')
                .slice(0, 20)
                .map((c) => c.trim().toLowerCase());
            filter.danh_muc = { $in: cats };
        }

        // Lọc theo khoảng giá
        if (gia_min !== undefined || gia_max !== undefined) {
            filter.gia_khuyen_mai = {};
            if (gia_min !== undefined && Number.isFinite(Number(gia_min))) filter.gia_khuyen_mai.$gte = Number(gia_min);
            if (gia_max !== undefined && Number.isFinite(Number(gia_max))) filter.gia_khuyen_mai.$lte = Number(gia_max);
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

        const coPhanTrang = page !== undefined || limit !== undefined;
        const soTrang = Math.max(1, Math.floor(Number(page)) || 1);
        const soLuong = Math.min(Math.max(1, Math.floor(Number(limit)) || 24), 200);
        let query = SanPham.find(filter).sort(sortOption);
        if (coPhanTrang) query = query.skip((soTrang - 1) * soLuong).limit(soLuong);

        const danhSachSanPham = await query;
        return res.status(200).json(danhSachSanPham);
    } catch (loi) {
        console.error('Lỗi lấy danh sách sản phẩm từ MongoDB:', loi.message);
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ khi lấy danh sách sản phẩm', chi_tiet: loi.message });
    }
};

// 2. Lấy thông tin chi tiết một sản phẩm theo ID hoặc Mã SKU
const laySanPhamTheoId = async (req, res) => {
    // Cache chi tiết sản phẩm 120s cho khách; Admin luôn lấy dữ liệu mới nhất
    datCacheTheoVaiTro(req, res, 'public, max-age=120, stale-while-revalidate=300');

    try {
        const { id } = req.params;
        let decodedId = String(id).slice(0, 200).trim();
        try {
            decodedId = decodeURIComponent(decodedId).trim();
        } catch (e) {
            /* giữ nguyên nếu URI hỏng */
        }
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
                { ma_san_pham: { $regex: `^${escapeRegex(decodedId)}$`, $options: 'i' } }
            ]
        });

        // Nếu chưa tìm thấy và id đúng định dạng ObjectId
        if (!sanPham && id.match(/^[0-9a-fA-F]{24}$/)) {
            sanPham = await SanPham.findById(id);
        }

        // Tìm kiếm gần đúng theo các từ khóa trong tên sản phẩm nếu chưa thấy
        if (!sanPham) {
            const words = decodedId.split(/[\s-]+/).filter((w) => w.length > 1);
            if (words.length >= 2) {
                const regexPattern = words
                    .slice(0, 8)
                    .map((w) => `(?=.*${escapeRegex(w)})`)
                    .join('');
                sanPham = await SanPham.findOne({
                    ten_san_pham: { $regex: regexPattern, $options: 'i' }
                });
            }
        }

        // Sản phẩm đã tạm ẩn thì khách nhận 404 như thể không tồn tại (không lộ việc có sản phẩm ẩn)
        if (!sanPham || (daBiAn(sanPham) && !laAdmin(req))) {
            return res.status(404).json({ thong_diep: `Không tìm thấy sản phẩm với mã/id: ${id}` });
        }

        return res.status(200).json(sanPham);
    } catch (loi) {
        console.error('Lỗi lấy chi tiết sản phẩm từ MongoDB:', loi.message);
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ khi lấy chi tiết sản phẩm', chi_tiet: loi.message });
    }
};

// Kiểm tra cặp giá và tính phần trăm giảm.
//  - "Giá niêm yết gốc" chỉ để hiện giá gạch ngang so sánh: phải bằng 0 (không có giá cũ) hoặc >= giá bán.
//    Nếu cho nhập thấp hơn giá bán thì giá gạch ngang biến mất và Admin tưởng "lưu không đổi giá".
//  - Giá bán thật là "Giá khuyến mãi" (gia_khuyen_mai).
//  - Phần trăm giảm do server tính từ hai giá, không tin số client gửi, để nhãn "-x%" luôn khớp giá thật.
const dinhDangVnd = (so) => `${Number(so).toLocaleString('vi-VN')} đ`;

const kiemTraVaTinhGia = (duLieu, hienTai = {}) => {
    const giaGoc = Number(duLieu.gia_goc ?? hienTai.gia_goc ?? 0);
    const giaBan = Number(duLieu.gia_khuyen_mai ?? hienTai.gia_khuyen_mai ?? 0);
    if (!Number.isFinite(giaGoc) || !Number.isFinite(giaBan) || giaGoc < 0 || giaBan < 0) {
        return { loi: 'Giá sản phẩm không hợp lệ.' };
    }
    if (giaBan < 1000) {
        return {
            loi: 'Giá khuyến mãi (giá bán thực tế) không được bằng 0 và phải từ 1.000 đ trở lên để đáp ứng quy định thanh toán.'
        };
    }
    if (giaGoc > 0 && giaGoc < giaBan) {
        return {
            loi:
                `Giá niêm yết gốc (${dinhDangVnd(giaGoc)}) phải lớn hơn hoặc bằng giá khuyến mãi (${dinhDangVnd(giaBan)}). ` +
                'Muốn đổi giá bán, hãy sửa ô "Giá Khuyến Mãi (Thực Thu)"; để giá gốc bằng 0 nếu không có giá cũ.'
        };
    }
    return { phanTramGiamGia: giaGoc > giaBan ? Math.round(((giaGoc - giaBan) / giaGoc) * 100) : 0 };
};

// 3. Thêm sản phẩm mới (dành cho Admin)
const themSanPham = async (req, res) => {
    const duLieuMoi = { ...req.body };
    try {
        const ketQuaGia = kiemTraVaTinhGia(duLieuMoi);
        if (ketQuaGia.loi) return res.status(400).json({ thong_diep: ketQuaGia.loi });
        duLieuMoi.phan_tram_giam_gia = ketQuaGia.phanTramGiamGia;
        if (!duLieuMoi.id && duLieuMoi.ten_san_pham) {
            duLieuMoi.id = 'sp-' + Date.now();
        }
        if (!duLieuMoi.slug && duLieuMoi.ten_san_pham) {
            duLieuMoi.slug = taoSlug(duLieuMoi.ten_san_pham);
        }
        if (!duLieuMoi.hinh_anh_chinh) {
            duLieuMoi.hinh_anh_chinh = '/images/khong-co-anh.svg';
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

        // Chỉ kiểm tra giá khi lần sửa này có đụng tới giá (đổi trạng thái ẩn / flash sale thì bỏ qua)
        if (duLieuCapNhat.gia_goc !== undefined || duLieuCapNhat.gia_khuyen_mai !== undefined) {
            const hienTai =
                (await SanPham.findOne({ $or: [{ slug: id }, { id }, { ma_san_pham: id }] })
                    .select('gia_goc gia_khuyen_mai')
                    .lean()) || {};
            const ketQuaGia = kiemTraVaTinhGia(duLieuCapNhat, hienTai);
            if (ketQuaGia.loi) return res.status(400).json({ thong_diep: ketQuaGia.loi });
            duLieuCapNhat.phan_tram_giam_gia = ketQuaGia.phanTramGiamGia;
        }

        let sanPham = await SanPham.findOneAndUpdate(
            { $or: [{ slug: id }, { id }, { ma_san_pham: id }] },
            { $set: duLieuCapNhat },
            { returnDocument: 'after', runValidators: true }
        );
        if (!sanPham && id.match(/^[0-9a-fA-F]{24}$/)) {
            sanPham = await SanPham.findByIdAndUpdate(
                id,
                { $set: duLieuCapNhat },
                { returnDocument: 'after', runValidators: true }
            );
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
