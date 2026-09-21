const DanhMuc = require('../models/danh-muc.model');
const taoSlug = require('../utils/tao-slug');

// Danh sách thương hiệu và danh mục nhu cầu mặc định ban đầu nếu CSDL trống
const DANH_MUC_MAC_DINH = [
    // 1. Thương hiệu
    { id: 'brand-asus', ma_danh_muc: 'asus', ten_danh_muc: 'ASUS', loai: 'thuong_hieu', logo: '💻', mo_ta: 'Laptop Gaming ROG & Zenbook cao cấp', xuat_xu: 'Đài Loan', kich_hoat: true, thu_tu_hien_thi: 1 },
    { id: 'brand-lenovo', ma_danh_muc: 'lenovo', ten_danh_muc: 'Lenovo', loai: 'thuong_hieu', logo: '💻', mo_ta: 'Laptop Legion Gaming & ThinkPad huyền thoại', xuat_xu: 'Trung Quốc / Mỹ', kich_hoat: true, thu_tu_hien_thi: 2 },
    { id: 'brand-acer', ma_danh_muc: 'acer', ten_danh_muc: 'Acer', loai: 'thuong_hieu', logo: '💻', mo_ta: 'Laptop Predator & Nitro Gaming quốc dân', xuat_xu: 'Đài Loan', kich_hoat: true, thu_tu_hien_thi: 3 },
    { id: 'brand-msi', ma_danh_muc: 'msi', ten_danh_muc: 'MSI', loai: 'thuong_hieu', logo: '💻', mo_ta: 'Rồng đỏ Gaming MSI Titan & Raider hiệu năng khủng', xuat_xu: 'Đài Loan', kich_hoat: true, thu_tu_hien_thi: 4 },
    { id: 'brand-apple', ma_danh_muc: 'apple', ten_danh_muc: 'Apple', loai: 'thuong_hieu', logo: '🍎', mo_ta: 'MacBook Pro & Air chip Apple Silicon M3/M4 Max', xuat_xu: 'Mỹ (USA)', kich_hoat: true, thu_tu_hien_thi: 5 },
    { id: 'brand-dell', ma_danh_muc: 'dell', ten_danh_muc: 'Dell', loai: 'thuong_hieu', logo: '💻', mo_ta: 'Alienware ngoài hành tinh & XPS sang trọng', xuat_xu: 'Mỹ (USA)', kich_hoat: true, thu_tu_hien_thi: 6 },
    { id: 'brand-hp', ma_danh_muc: 'hp', ten_danh_muc: 'HP', loai: 'thuong_hieu', logo: '💻', mo_ta: 'HP Omen Gaming & Spectre x360 cao cấp', xuat_xu: 'Mỹ (USA)', kich_hoat: true, thu_tu_hien_thi: 7 },
    
    // 2. Danh mục nhu cầu / phân khúc
    { id: 'cat-gaming', ma_danh_muc: 'gaming', ten_danh_muc: 'Laptop Gaming Cực Đỉnh', loai: 'nhu_cau', logo: '🎮', mo_ta: 'Tần số quét cao 240Hz-360Hz, Card RTX 40 Series, Tản nhiệt buồng hơi', xuat_xu: 'Chính Hãng', kich_hoat: true, thu_tu_hien_thi: 8 },
    { id: 'cat-ai-pc', ma_danh_muc: 'ai-pc', ten_danh_muc: 'AI PC Siêu Trí Tuệ 2026', loai: 'nhu_cau', logo: '🧠', mo_ta: 'Tích hợp NPU AI cục bộ, tăng tốc tác vụ đồ họa và Copilot', xuat_xu: 'Chính Hãng', kich_hoat: true, thu_tu_hien_thi: 9 },
    { id: 'cat-do-hoa', ma_danh_muc: 'do-hoa-sang-tao', ten_danh_muc: 'Đồ Họa & Sáng Tạo Studio', loai: 'nhu_cau', logo: '🎨', mo_ta: 'Màn hình OLED 100% DCI-P3, màu chuẩn điện ảnh', xuat_xu: 'Chính Hãng', kich_hoat: true, thu_tu_hien_thi: 10 },
    { id: 'cat-mong-nhe', ma_danh_muc: 'van-phong-mong-nhe', ten_danh_muc: 'Mỏng Nhẹ & Sang Trọng', loai: 'nhu_cau', logo: '🪶', mo_ta: 'Trọng lượng 1.1kg - 1.3kg, pin 15-20 giờ, vỏ nhôm nguyên khối', xuat_xu: 'Chính Hãng', kich_hoat: true, thu_tu_hien_thi: 11 },
    { id: 'cat-doanh-nhan', ma_danh_muc: 'doanh-nhan', ten_danh_muc: 'Laptop Doanh Nhân Cao Cấp', loai: 'nhu_cau', logo: '💼', mo_ta: 'Bảo mật vân tay, chuẩn quân đội MIL-STD-810H', xuat_xu: 'Chính Hãng', kich_hoat: true, thu_tu_hien_thi: 12 },
    { id: 'cat-sinh-vien', ma_danh_muc: 'sinh-vien', ten_danh_muc: 'Học Tập & Sinh Viên Giá Tốt', loai: 'nhu_cau', logo: '🎓', mo_ta: 'Cấu hình cân đối, bàn phím êm ái, bảo hành chính hãng', xuat_xu: 'Chính Hãng', kich_hoat: true, thu_tu_hien_thi: 13 }
];

// 1. Lấy danh sách thương hiệu / danh mục (Tự động nạp mẫu nếu chưa có, hỗ trợ lọc theo loai)
const layDanhSachDanhMuc = async (req, res) => {
    try {
        const { loai } = req.query;
        const filter = {};
        if (loai) {
            filter.loai = loai;
        }

        let danhSach = await DanhMuc.find(filter).sort({ thu_tu_hien_thi: 1 });

        if (danhSach.length === 0 && !loai) {
            await DanhMuc.insertMany(DANH_MUC_MAC_DINH);
            danhSach = await DanhMuc.find().sort({ thu_tu_hien_thi: 1 });
        }

        return res.status(200).json(danhSach);
    } catch (loi) {
        console.error('Lỗi lấy danh mục:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ', chi_tiet: loi.message });
    }
};

// 2. Tạo danh mục / thương hiệu mới (Admin)
const taoDanhMucMoi = async (req, res) => {
    try {
        const duLieu = req.body;
        if (!duLieu.ma_danh_muc || !duLieu.ten_danh_muc) {
            return res.status(400).json({ thong_diep: 'Vui lòng cung cấp mã và tên danh mục!' });
        }

        const maSlug = duLieu.ma_danh_muc.toLowerCase().trim();
        const tonTai = await DanhMuc.findOne({ ma_danh_muc: maSlug });
        if (tonTai) {
            return res.status(400).json({ thong_diep: `Mã danh mục "${maSlug}" đã tồn tại trên hệ thống!` });
        }

        if (!duLieu.id) {
            duLieu.id = 'brand-' + maSlug;
        }
        duLieu.ma_danh_muc = maSlug;
        duLieu.slug = duLieu.slug ? taoSlug(duLieu.slug) : taoSlug(duLieu.ten_danh_muc);

        const dm = new DanhMuc(duLieu);
        const ketQua = await dm.save();
        return res.status(201).json(ketQua);
    } catch (loi) {
        console.error('Lỗi tạo danh mục:', loi);
        return res.status(400).json({ thong_diep: 'Không thể tạo danh mục', chi_tiet: loi.message });
    }
};

// 3. Cập nhật danh mục / thương hiệu (Admin)
const capNhatDanhMuc = async (req, res) => {
    try {
        const { id } = req.params;
        const duLieu = req.body;
        if (duLieu.ten_danh_muc && !duLieu.slug) {
            duLieu.slug = taoSlug(duLieu.ten_danh_muc);
        }

        let dm = await DanhMuc.findOneAndUpdate(
            { $or: [{ slug: id }, { id: id }, { ma_danh_muc: id.toLowerCase() }] },
            { $set: duLieu },
            { new: true }
        );

        if (!dm && id.match(/^[0-9a-fA-F]{24}$/)) {
            dm = await DanhMuc.findByIdAndUpdate(id, { $set: duLieu }, { new: true });
        }

        if (!dm) {
            return res.status(404).json({ thong_diep: `Không tìm thấy danh mục: ${id}` });
        }

        return res.status(200).json(dm);
    } catch (loi) {
        console.error('Lỗi cập nhật danh mục:', loi);
        return res.status(400).json({ thong_diep: 'Không thể cập nhật danh mục', chi_tiet: loi.message });
    }
};

// 4. Xóa danh mục / thương hiệu (Admin)
const xoaDanhMuc = async (req, res) => {
    try {
        const { id } = req.params;

        let dm = await DanhMuc.findOneAndDelete({
            $or: [{ id: id }, { ma_danh_muc: id.toLowerCase() }]
        });

        if (!dm && id.match(/^[0-9a-fA-F]{24}$/)) {
            dm = await DanhMuc.findByIdAndDelete(id);
        }

        if (!dm) {
            return res.status(404).json({ thong_diep: `Không tìm thấy danh mục để xóa: ${id}` });
        }

        return res.status(200).json({ thong_diep: 'Đã xóa danh mục thành công', id: dm.id });
    } catch (loi) {
        console.error('Lỗi xóa danh mục:', loi);
        return res.status(500).json({ thong_diep: 'Không thể xóa danh mục', chi_tiet: loi.message });
    }
};

module.exports = {
    layDanhSachDanhMuc,
    taoDanhMucMoi,
    capNhatDanhMuc,
    xoaDanhMuc
};
