const DonHang = require('../models/don-hang.model');
const BaoHanhGhiDe = require('../models/bao-hanh-ghi-de.model');
require('../models/san-pham.model'); // chỉ để đăng ký model SanPham với Mongoose

// Định dạng ngày chuẩn Việt Nam dd/mm/yyyy an toàn
const dinhDangNgayVN = (d) => {
    if (!d) return '--/--/----';
    const date = new Date(d);
    if (isNaN(date.getTime())) return '--/--/----';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * Hàm nội bộ dùng chung: tính toán thông tin bảo hành của 1 sản phẩm trong 1 đơn hàng
 * (áp dụng ghi đè Serial / số tháng bảo hành của Admin nếu có trong banDoGhiDe).
 */
const tinhMotMucBaoHanh = (dh, item, ngayMua, sdtMasked, hoTen, banDoGhiDe) => {
    const sp = item.san_pham || {};
    const ghiDe = banDoGhiDe.get(`${dh.ma_don_hang}::${item.id_muc || ''}`);
    const thoiHanTuMoTa = Number(String(sp.thong_so?.che_do_bao_hanh || '').match(/(\d+)\s*tháng/i)?.[1]);
    const thoiHanTheoSanPham = Number(sp.thong_so?.thoi_han_bao_hanh_thang) || thoiHanTuMoTa || 24;
    const thoiGianBHThang =
        Number(ghiDe?.thoi_han_bao_hanh_thang) > 0 ? Number(ghiDe.thoi_han_bao_hanh_thang) : thoiHanTheoSanPham;
    const ngayMuaChuan = ngayMua && !isNaN(new Date(ngayMua).getTime()) ? new Date(ngayMua) : new Date();
    const ngayHetHan = new Date(ngayMuaChuan);
    ngayHetHan.setMonth(ngayHetHan.getMonth() + thoiGianBHThang);

    const now = new Date();
    const conHieuLuc = now <= ngayHetHan;
    const diffTime = ngayHetHan.getTime() - now.getTime();
    const soThangConLai = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)));

    const serialMay =
        ghiDe?.so_serial ||
        item.so_serial ||
        `${sp.ma_san_pham || 'LPN'}-${dh.ma_don_hang?.replace('LPN-', '') || '8899'}`;

    return {
        hop_le: true,
        loai_tra_cuu: 'don_hang',
        ma_don_hang: dh.ma_don_hang,
        id_don_hang: dh.id,
        id_muc: item.id_muc || '',
        so_serial: serialMay,
        ma_san_pham: sp.ma_san_pham || 'CHÍNH HÃNG',
        ten_san_pham: item.ten_san_pham || sp.ten_san_pham || 'Laptop Chính Hãng',
        hinh_anh:
            item.hinh_anh ||
            sp.hinh_anh_chinh ||
            (Array.isArray(sp.hinh_anh) ? sp.hinh_anh[0] : '/images/asus_rog_scar18.jpg'),
        hang_san_xuat: (sp.hang_san_xuat || 'TNTP').toUpperCase(),
        khach_hang: hoTen,
        so_dien_thoai: sdtMasked,
        ngay_kich_hoat: dinhDangNgayVN(ngayMuaChuan),
        ngay_het_han: dinhDangNgayVN(ngayHetHan),
        thoi_gian_bao_hanh: `${thoiGianBHThang} Tháng Chính Hãng`,
        con_hieu_luc: conHieuLuc,
        so_thang_con_lai: soThangConLai,
        trang_thai: conHieuLuc
            ? `Còn hiệu lực bảo hành chính hãng (${soThangConLai} tháng còn lại)`
            : 'Đã hết thời hạn bảo hành chính hãng',
        goi_dich_vu: 'Bảo hành vàng On-site tận nơi 24 tháng chính hãng tại hệ thống TNTP Laptop',
        trung_tam_bao_hanh: [
            'Chi nhánh 1: 29 Tân Phước, P.8, Q.10, TP.HCM (Hotline: 0948.37.79.79)',
            'Chi nhánh 2: 12 Trịnh Đình Thảo, P. Hòa Thạnh, Q. Tân Phú, TP.HCM (Trường ITC)'
        ]
    };
};

/**
 * Tra cứu thời hạn bảo hành điện tử theo:
 * - Số Serial / IMEI máy
 * - Mã sản phẩm (SKU)
 * - Mã hoá đơn / Mã đơn hàng (ví dụ: LPN-2026-8899)
 * - Số điện thoại mua hàng (ví dụ: 0912345678)
 */
const traCuuBaoHanh = async (req, res) => {
    try {
        const tuKhoaRaw = (req.query.tu_khoa || req.query.q || '').trim();
        // Bỏ ký hiệu # nếu người dùng copy từ bảng Admin (ví dụ #LPN-...)
        const tuKhoa = tuKhoaRaw.replace(/^#/, '').trim();
        const maDonXacMinh = String(req.query.ma_don_hang || req.query.maDonHang || '')
            .replace(/^#/, '')
            .trim();

        // 1. Kiểm tra tính hợp lệ: Tối thiểu 3 ký tự
        if (!tuKhoa || tuKhoa.length < 3) {
            return res.status(200).json({
                hop_le: false,
                thong_diep: `Từ khóa "${tuKhoa}" quá ngắn. Quý khách vui lòng nhập chính xác Số Serial/IMEI thiết bị, Mã hoá đơn (LPN-...) hoặc Số điện thoại mua hàng.`,
                danh_sach: []
            });
        }

        // Tạo biểu thức so khớp CHÍNH XÁC toàn bộ chuỗi (^...$), KHÔNG tìm theo chuỗi con (substring)
        const laSoDienThoai = /^(0|\+84)[0-9]{9}$/.test(tuKhoa.replace(/\s+/g, ''));
        const tuKhoaChuanHoa = laSoDienThoai ? tuKhoa.replace(/\s+/g, '') : tuKhoa;
        const escaped = tuKhoaChuanHoa.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const exactRegex = new RegExp(`^${escaped}$`, 'i');

        if (laSoDienThoai && !maDonXacMinh) {
            return res.status(403).json({
                hop_le: false,
                thong_diep: 'Để bảo vệ thông tin khách hàng, tra cứu bằng số điện thoại cần nhập kèm mã đơn hàng.',
                yeu_cau_ma_don_hang: true,
                danh_sach: []
            });
        }

        // 1.1 Tìm bản ghi ghi đè Serial trong BaoHanhGhiDe (Admin nhập tay)
        const dsGhiDeKhop = await BaoHanhGhiDe.find({ so_serial: exactRegex }).lean();
        const maDonTuGhiDe = dsGhiDeKhop.map((g) => g.ma_don_hang).filter(Boolean);

        // 1.2 Hỗ trợ tra cứu bằng Serial tự sinh (ví dụ UX3405MA-PP152W-2026-0497388999)
        // hoặc mã đơn hàng người dùng gõ thiếu tiền tố LPN-
        const cacMaDonKhaThi = new Set();
        if (!tuKhoa.toUpperCase().startsWith('LPN-')) {
            cacMaDonKhaThi.add(`LPN-${tuKhoa.toUpperCase()}`);
        }
        const cacPhan = tuKhoa.split('-');
        for (let i = 1; i < cacPhan.length; i++) {
            const phanDuoi = cacPhan.slice(i).join('-').toUpperCase();
            cacMaDonKhaThi.add(`LPN-${phanDuoi}`);
            cacMaDonKhaThi.add(phanDuoi);
        }

        const dieuKienTraCuu = [
            { ma_don_hang: exactRegex },
            { id: exactRegex },
            { 'danh_sach_san_pham.so_serial': exactRegex },
            { 'danh_sach_san_pham.san_pham.ma_san_pham': exactRegex }
        ];

        if (maDonTuGhiDe.length > 0) {
            dieuKienTraCuu.push({ ma_don_hang: { $in: maDonTuGhiDe } });
        }

        if (cacMaDonKhaThi.size > 0) {
            dieuKienTraCuu.push({ ma_don_hang: { $in: Array.from(cacMaDonKhaThi) } });
        }

        if (laSoDienThoai) {
            const escapedMaDon = maDonXacMinh.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            dieuKienTraCuu.push({
                'thong_tin_giao_hang.so_dien_thoai': exactRegex,
                ma_don_hang: new RegExp(`^${escapedMaDon}$`, 'i')
            });
        }

        // 2. Tìm kiếm trong danh sách Đơn hàng thực tế trong DB
        const donHangKhop = await DonHang.find({
            $or: dieuKienTraCuu
        }).sort({ createdAt: -1 });

        if (donHangKhop && donHangKhop.length > 0) {
            let danhSachKetQua = [];

            // Lấy toàn bộ ghi đè Serial/số tháng bảo hành (do Admin nhập tay) liên quan các đơn hàng khớp
            const maDonHangLienQuan = donHangKhop.map((dh) => dh.ma_don_hang).filter(Boolean);
            const dsGhiDe = maDonHangLienQuan.length
                ? await BaoHanhGhiDe.find({ ma_don_hang: { $in: maDonHangLienQuan } }).lean()
                : [];
            const banDoGhiDe = new Map(dsGhiDe.map((gd) => [`${gd.ma_don_hang}::${gd.id_muc}`, gd]));

            for (const dh of donHangKhop) {
                // Parse ngày mua hàng
                let ngayMua = new Date(dh.createdAt || Date.now());
                if (dh.ngay_tao && dh.ngay_tao.includes('/')) {
                    const parts = dh.ngay_tao.split(' ').pop().split('/');
                    if (parts.length === 3) {
                        ngayMua = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                    }
                }

                // Bảo mật SĐT: 0912***678
                let sdtMasked = dh.thong_tin_giao_hang?.so_dien_thoai || '0912***678';
                if (sdtMasked.length >= 7) {
                    sdtMasked = sdtMasked.substring(0, 4) + '***' + sdtMasked.substring(sdtMasked.length - 3);
                }

                const hoTen = dh.thong_tin_giao_hang?.ho_ten || dh.thong_tin_giao_hang?.ho_va_ten || 'Khách Hàng';

                for (const item of dh.danh_sach_san_pham || []) {
                    danhSachKetQua.push(tinhMotMucBaoHanh(dh, item, ngayMua, sdtMasked, hoTen, banDoGhiDe));
                }
            }

            // Nếu người dùng tra cứu đúng theo Số Serial máy, ưu tiên lọc trả về đúng sản phẩm đó
            const tuKhoaLower = tuKhoa.toLowerCase();
            const mucKhopSerial = danhSachKetQua.filter((m) => m.so_serial?.toLowerCase() === tuKhoaLower);
            if (mucKhopSerial.length > 0) {
                danhSachKetQua = mucKhopSerial;
            }

            if (danhSachKetQua.length > 0) {
                return res.status(200).json({
                    hop_le: true,
                    tong_so: danhSachKetQua.length,
                    danh_sach: danhSachKetQua
                });
            }
        }

        // 3. KHÔNG TÌM THẤY TRONG ĐƠN HÀNG THỰC TẾ -> BÁO KHÔNG TỒN TẠI
        return res.status(200).json({
            hop_le: false,
            thong_diep: `Không tìm thấy thông tin bảo hành cho mã "${tuKhoa}". Quý khách vui lòng kiểm tra lại Số Serial trên máy, Mã đơn hàng hoặc Số điện thoại mua hàng.`,
            danh_sach: []
        });
    } catch (loi) {
        console.error('Lỗi tra cứu bảo hành:', loi);
        return res.status(500).json({
            hop_le: false,
            thong_diep: 'Lỗi hệ thống khi tra cứu dữ liệu bảo hành',
            chi_tiet: loi.message
        });
    }
};

// [Admin] Lấy danh sách bảo hành của toàn bộ đơn hàng đã giao (phục vụ trang quản trị)
const layDanhSachBaoHanhAdmin = async (req, res) => {
    try {
        const gioiHan = Math.min(500, Math.max(1, Number(req.query.gioi_han) || 300));
        const donHangDaGiao = await DonHang.find({ trang_thai: 'da_giao' }).sort({ createdAt: -1 }).limit(gioiHan);

        const maDonHangLienQuan = donHangDaGiao.map((dh) => dh.ma_don_hang).filter(Boolean);
        const dsGhiDe = maDonHangLienQuan.length
            ? await BaoHanhGhiDe.find({ ma_don_hang: { $in: maDonHangLienQuan } }).lean()
            : [];
        const banDoGhiDe = new Map(dsGhiDe.map((gd) => [`${gd.ma_don_hang}::${gd.id_muc}`, gd]));

        const danhSach = [];
        for (const dh of donHangDaGiao) {
            const ngayMua = dh.createdAt || dh.ngay_tao || Date.now();
            const sdtMasked = dh.thong_tin_giao_hang?.so_dien_thoai || '';
            const hoTen = dh.thong_tin_giao_hang?.ho_ten || dh.thong_tin_giao_hang?.ho_va_ten || 'Khách Hàng';
            for (const item of dh.danh_sach_san_pham || []) {
                danhSach.push(tinhMotMucBaoHanh(dh, item, ngayMua, sdtMasked, hoTen, banDoGhiDe));
            }
        }

        return res.status(200).json({ tong_so: danhSach.length, danh_sach: danhSach });
    } catch (loi) {
        console.error('Lỗi lấy danh sách bảo hành cho admin:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi lấy danh sách bảo hành', chi_tiet: loi.message });
    }
};

// [Admin] Ghi đè Serial / số tháng bảo hành cho 1 sản phẩm trong 1 đơn hàng
const capNhatGhiDeBaoHanh = async (req, res) => {
    try {
        const ma_don_hang = String(req.body.ma_don_hang || '').trim();
        const id_muc = String(req.body.id_muc || '').trim();
        if (!ma_don_hang || !id_muc) {
            return res.status(400).json({ thong_diep: 'Thiếu mã đơn hàng hoặc mã mục sản phẩm.' });
        }
        const donHangTonTai = await DonHang.exists({ ma_don_hang });
        if (!donHangTonTai) {
            return res.status(404).json({ thong_diep: `Không tìm thấy đơn hàng ${ma_don_hang}` });
        }
        const soSerial = typeof req.body.so_serial === 'string' ? req.body.so_serial.trim().slice(0, 100) : '';
        const thoiHan = Number(req.body.thoi_han_bao_hanh_thang);

        const ghiDe = await BaoHanhGhiDe.findOneAndUpdate(
            { ma_don_hang, id_muc },
            {
                $set: {
                    so_serial: soSerial,
                    thoi_han_bao_hanh_thang: Number.isFinite(thoiHan) && thoiHan > 0 ? thoiHan : null
                }
            },
            { upsert: true, returnDocument: 'after' }
        );

        return res.status(200).json({ thong_diep: 'Đã lưu thông tin bảo hành', ghi_de: ghiDe });
    } catch (loi) {
        console.error('Lỗi ghi đè thông tin bảo hành:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi lưu thông tin bảo hành', chi_tiet: loi.message });
    }
};

module.exports = {
    traCuuBaoHanh,
    layDanhSachBaoHanhAdmin,
    capNhatGhiDeBaoHanh
};
