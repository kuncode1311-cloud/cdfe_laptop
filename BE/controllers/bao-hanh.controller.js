const DonHang = require('../models/don-hang.model');
const SanPham = require('../models/san-pham.model');

/**
 * Tra cứu thời hạn bảo hành điện tử theo:
 * - Số Serial / IMEI máy
 * - Mã sản phẩm (SKU)
 * - Mã hoá đơn / Mã đơn hàng (ví dụ: LPN-2026-8899)
 * - Số điện thoại mua hàng (ví dụ: 0912345678)
 */
const traCuuBaoHanh = async (req, res) => {
    try {
        const tuKhoa = (req.query.tu_khoa || req.query.q || '').trim();
        
        // 1. Kiểm tra tính hợp lệ: Tối thiểu 3 ký tự
        if (!tuKhoa || tuKhoa.length < 3) {
            return res.status(200).json({
                hop_le: false,
                thong_diep: `Từ khóa "${tuKhoa}" quá ngắn. Quý khách vui lòng nhập chính xác Số Serial/IMEI thiết bị, Mã hoá đơn (LPN-...) hoặc Số điện thoại mua hàng.`,
                danh_sach: []
            });
        }

        // Tạo biểu thức so khớp CHÍNH XÁC toàn bộ chuỗi (^...$), KHÔNG tìm theo chuỗi con (substring)
        const escaped = tuKhoa.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const exactRegex = new RegExp(`^${escaped}$`, 'i');

        // 2. Tìm kiếm CHÍNH XÁC trong danh sách Đơn hàng thực tế trong DB
        // Chỉ khớp khi BẰNG ĐÚNG: Mã đơn hàng, ID đơn, Số điện thoại mua hàng, hoặc Serial/Mã SKU sản phẩm đã mua
        const donHangKhop = await DonHang.find({
            $or: [
                { ma_don_hang: exactRegex },
                { id: exactRegex },
                { 'thong_tin_giao_hang.so_dien_thoai': exactRegex },
                { 'danh_sach_san_pham.so_serial': exactRegex },
                { 'danh_sach_san_pham.san_pham.ma_san_pham': exactRegex }
            ]
        }).sort({ createdAt: -1 });

        if (donHangKhop && donHangKhop.length > 0) {
            const danhSachKetQua = [];

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

                for (const item of (dh.danh_sach_san_pham || [])) {
                    const sp = item.san_pham || {};
                    const thoiGianBHThang = 24; // Mặc định 24 tháng cho Laptop chính hãng
                    const ngayHetHan = new Date(ngayMua);
                    ngayHetHan.setMonth(ngayHetHan.getMonth() + thoiGianBHThang);

                    const now = new Date();
                    const conHieuLuc = now <= ngayHetHan;
                    const diffTime = ngayHetHan.getTime() - now.getTime();
                    const soThangConLai = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)));

                    const serialMay = item.so_serial || `${sp.ma_san_pham || 'LPN'}-${dh.ma_don_hang?.replace('LPN-', '') || '8899'}`;

                    danhSachKetQua.push({
                        hop_le: true,
                        loai_tra_cuu: 'don_hang',
                        ma_don_hang: dh.ma_don_hang,
                        id_don_hang: dh.id,
                        so_serial: serialMay,
                        ma_san_pham: sp.ma_san_pham || 'CHÍNH HÃNG',
                        ten_san_pham: sp.ten_san_pham,
                        hinh_anh: sp.hinh_anh_chinh || '/images/asus_rog_scar18.jpg',
                        hang_san_xuat: (sp.hang_san_xuat || 'TNTP').toUpperCase(),
                        khach_hang: hoTen,
                        so_dien_thoai: sdtMasked,
                        ngay_kich_hoat: ngayMua.toLocaleDateString('vi-VN'),
                        ngay_het_han: ngayHetHan.toLocaleDateString('vi-VN'),
                        thoi_gian_bao_hanh: `${thoiGianBHThang} Tháng Chính Hãng`,
                        con_hieu_luc: conHieuLuc,
                        so_thang_con_lai: soThangConLai,
                        trang_thai: conHieuLuc
                            ? `Còn hiệu lực bảo hành chính hãng (${soThangConLai} tháng còn lại)`
                            : 'Đã hết thời hạn bảo hành chính hãng',
                        goi_dich_vu: 'Bảo hành vàng VIP On-site tận nơi 24 tháng chính hãng tại hệ thống TNTP Laptop',
                        trung_tam_bao_hanh: [
                            'Chi nhánh 1: 29 Tân Phước, P.8, Q.10, TP.HCM (Hotline: 0948.37.79.79)',
                            'Chi nhánh 2: 399 Xô Viết Nghệ Tĩnh, P.24, Q.Bình Thạnh, TP.HCM'
                        ]
                    });
                }
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

module.exports = {
    traCuuBaoHanh
};
