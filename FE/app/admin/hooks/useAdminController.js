'use client';
import useTinTucController from '@/app/admin/tin-tuc/useTinTucController';
import useVoucherController from '@/app/admin/voucher/useVoucherController';
import useKhachHangController from '@/app/admin/khach-hang/useKhachHangController';
import useDanhMucController from '@/app/admin/danh-muc/useDanhMucController';
import useDonHangController from '@/app/admin/don-hang/useDonHangController';
import useKhuyenMaiController from '@/app/admin/khuyen-mai/useKhuyenMaiController';
import useSanPhamController from '@/app/admin/san-pham/useSanPhamController';
import React, { useState, useEffect, useMemo, useRef } from 'react';

import { useNguoiDung } from '@/contexts/AuthContext';
import { useGiaoDien } from '@/contexts/ThemeContext';
import { SanPhamService } from '@/services/san-pham.service';
import { DonHangService } from '@/services/don-hang.service';
import { MaGiamGiaService } from '@/services/ma-giam-gia.service';
import { DanhMucService } from '@/services/danh-muc.service';
import { NguoiDungService } from '@/services/nguoi-dung.service';
import { TinTucService } from '@/services/tin-tuc.service';
import { CaiDatService } from '@/services/cai-dat.service';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import { docAnhDaNen } from '@/utils/anh-san-pham';
import { taoSlug } from '@/utils/taoSlug';
import { inHoaDonBanHang } from '@/utils/inHoaDon';

import { LienHeService } from '@/services/lien-he.service';
import { taoHandlerXoa, taoHandlerToggleTruong } from '@/app/admin/hooks/useXuLyAdmin';
import { toast } from 'sonner';

import { TU_DIEN_REVERSE_SLUG, TU_DIEN_THONG_SO_ADMIN } from '@/app/admin/constants/tu-dien-thong-so';

import { usePathname, useRouter } from 'next/navigation';
import { layTabTheoDuongDan, layDuongDanAdmin } from '@/app/admin/constants/admin-routes';

// Helper an toàn tránh runtime ReferenceError khi format tiền tệ
const dinhDangVND = (so) => dinhDangTienVND(Number(so) || 0);

// TU_DIEN_REVERSE_SLUG — đã tách sang @/app/admin/constants/tu-dien-thong-so.js

const chuyenKeySangSlug = (rawKey) => {
    if (!rawKey) return '';
    const clean = rawKey.trim().toLowerCase();
    if (TU_DIEN_REVERSE_SLUG[clean]) return TU_DIEN_REVERSE_SLUG[clean];
    if (/^[a-z0-9_]+$/.test(clean)) return clean;
    return taoSlug(rawKey).replace(/-/g, '_');
};

// Làm trống form thêm sản phẩm, chỉ giữ trạng thái còn hàng và tiêu đề nhóm thông số.
const KHOA_GIU_MAC_DINH = { con_hang: true };
const lamTrongFormSp = (mau) =>
    Object.fromEntries(
        Object.entries(mau).map(([khoa, giaTri]) => {
            if (khoa.startsWith('tieu_de_nhom_')) return [khoa, giaTri];
            if (khoa in KHOA_GIU_MAC_DINH) return [khoa, KHOA_GIU_MAC_DINH[khoa]];
            if (Array.isArray(giaTri)) return [khoa, []];
            if (typeof giaTri === 'boolean') return [khoa, false];
            if (typeof giaTri === 'string' || typeof giaTri === 'number') return [khoa, ''];
            return [khoa, giaTri];
        })
    );

// Điều phối dữ liệu và thao tác dùng chung giữa các trang quản trị.
export default function useAdminController() {

    const { nguoiDung, laAdmin, dangXuat } = useNguoiDung();
    const { chu_de, chuyenDoiChuDe } = useGiaoDien();

    // URL là nguồn xác định trang hiện tại; Next.js xử lý Back/Forward.
    const pathname = usePathname();
    const router = useRouter();
    const tabHienTai = layTabTheoDuongDan(pathname);
    const setTabHienTai = (tab) => router.push(layDuongDanAdmin(tab));

    const khungNoiDungChinhRef = useRef(null);

    // Tự động cuộn khung nội dung chính lên đầu khi chuyển tab
    useEffect(() => {
        if (khungNoiDungChinhRef.current) {
            khungNoiDungChinhRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [tabHienTai]);

    const [sidebarThuGon, setSidebarThuGon] = useState(false);
    const [sidebarMoMobile, setSidebarMoMobile] = useState(false);

    // State Dữ liệu thực từ hệ thống
    const [danhSachSanPham, setDanhSachSanPham] = useState([]);
    const [danhSachDonHang, setDanhSachDonHang] = useState([]);
    const [danhSachVoucher, setDanhSachVoucher] = useState([]);
    const [danhSachDanhMuc, setDanhSachDanhMuc] = useState([]);
    const [danhSachNguoiDung, setDanhSachNguoiDung] = useState([]);
    const [danhSachTinTuc, setDanhSachTinTuc] = useState([]);
    const [dangTai, setDangTai] = useState(false);

    // State Bộ lọc & Tìm kiếm thông minh
    const [tuKhoaGlobal, setTuKhoaGlobal] = useState('');
    const [locTrangThaiDonHang, setLocTrangThaiDonHang] = useState('tat_ca');
    const [locThanhToanDonHang, setLocThanhToanDonHang] = useState('tat_ca');
    const [sapXepDonHang, setSapXepDonHang] = useState('moi_nhat'); // 'moi_nhat' | 'cu_nhat' | 'gia_cao' | 'gia_thap'
    const [locThoiGianDonHang, setLocThoiGianDonHang] = useState('tat_ca'); // 'tat_ca' | 'hom_nay' | '7_ngay' | '30_ngay' | 'thang_8_2026' | 'nam_2026'
    const [locNgayCuThe, setLocNgayCuThe] = useState('');

    // Bộ lọc sản phẩm đa chiều
    const [locNganhHang, setLocNganhHang] = useState('tat_ca');
    const [locHangSanPham, setLocHangSanPham] = useState('tat_ca');
    const [locTonKhoSanPham, setLocTonKhoSanPham] = useState('tat_ca');
    const [sapXepSanPham, setSapXepSanPham] = useState('moi_nhat');

    // Bộ lọc khách hàng & voucher
    const [tuKhoaKhachHang, setTuKhoaKhachHang] = useState('');
    const [locKhachHang, setLocKhachHang] = useState('tat_ca');
    const [sapXepKhachHang, setSapXepKhachHang] = useState('doanh_thu_giam');

    // Bộ lọc Voucher riêng biệt
    const [tuKhoaVoucher, setTuKhoaVoucher] = useState('');
    const [locTrangThaiVoucher, setLocTrangThaiVoucher] = useState('tat_ca');

    // Bộ lọc Danh Mục & Phân Khúc
    const [tuKhoaDanhMuc, setTuKhoaDanhMuc] = useState('');
    const [locLoaiDanhMuc, setLocLoaiDanhMuc] = useState('thuong_hieu'); // 'thuong_hieu' | 'loai_san_pham' | 'nhu_cau'

    // Bộ lọc Tin Tức
    const [tuKhoaTinTuc, setTuKhoaTinTuc] = useState('');
    const [locChuyenMucTinTuc, setLocChuyenMucTinTuc] = useState('tat_ca');
    const [locTrangThaiTinTuc, setLocTrangThaiTinTuc] = useState('tat_ca');

    // Cấu hình Banner & Chiến Dịch Khuyến Mãi (Dữ liệu động 100%)
    const [caiDatKm, setCaiDatKm] = useState(() => CaiDatService.layCaiDatKhuyenMai());
    const [formCaiDatKm, setFormCaiDatKm] = useState(() => CaiDatService.layCaiDatKhuyenMai());
    const [thoiGianHienTaiKm, setThoiGianHienTaiKm] = useState(0);

    useEffect(() => {
        setThoiGianHienTaiKm(Date.now());
        const timer = setInterval(() => setThoiGianHienTaiKm(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Tính toán thời gian đếm ngược còn lại (chuẩn pure React useMemo)
    const conLaiKm = useMemo(() => {
        if (!formCaiDatKm?.thoi_gian_ket_thuc || !thoiGianHienTaiKm) {
            return { hetHan: false, chuoi: 'Chưa đặt', d: 0, h: 0, m: 0, s: 0 };
        }
        const target = new Date(formCaiDatKm.thoi_gian_ket_thuc).getTime();
        const diff = target - thoiGianHienTaiKm;
        if (diff <= 0) return { hetHan: true, chuoi: 'Đã hết hạn', d: 0, h: 0, m: 0, s: 0 };
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        const chuoi = d > 0 ? `${d} ngày ${h} giờ ${m} phút ${s} giây` : `${h} giờ ${m} phút ${s} giây`;
        return { hetHan: false, chuoi, d, h, m, s };
    }, [formCaiDatKm?.thoi_gian_ket_thuc, thoiGianHienTaiKm]);

    // Cấu hình Hệ Thống Showroom & Tọa Độ GPS Bản Đồ (Dữ liệu động 100%)
    const [danhSachShowroomAdmin, setDanhSachShowroomAdmin] = useState([]);
    const [dangLuuShowroom, setDangLuuShowroom] = useState(false);
    const [showroomDangXemTruoc, setShowroomDangXemTruoc] = useState(0);
    const [soLuongChuaXuLyLienHe, setSoLuongChuaXuLyLienHe] = useState(0);

    // Đồng bộ số lượng yêu cầu tư vấn mới theo thời gian thực (Real-time) cho Admin Menu Badge
    useEffect(() => {
        const kiemTraSoLuong = async () => {
            try {
                const res = await LienHeService.layDanhSachLienHeAsync({ trang: 1, gioi_han: 1 });
                if (res?.thong_ke?.chua_xu_ly !== undefined) {
                    setSoLuongChuaXuLyLienHe(res.thong_ke.chua_xu_ly);
                }
            } catch (e) {}
        };

        kiemTraSoLuong();

        const huyLangNghe = LienHeService.langNgheRealtime(() => {
            kiemTraSoLuong();
        });

        const intervalId = setInterval(kiemTraSoLuong, 8000);

        return () => {
            huyLangNghe();
            clearInterval(intervalId);
        };
    }, []);

    // Tải danh sách showroom khi khởi tạo
    useEffect(() => {
        CaiDatService.layDanhSachShowroomAsync().then(ds => {
            if (Array.isArray(ds) && ds.length > 0) {
                setDanhSachShowroomAdmin(ds);
            }
        });
    }, []);

    const xuLyThayDoiShowroom = (index, truong, giaTri) => {
        setDanhSachShowroomAdmin(prev => {
            const moi = [...prev];
            moi[index] = { ...moi[index], [truong]: giaTri };
            return moi;
        });
    };

    // Đảm bảo trong cấu hình luôn có duy nhất một showroom mặc định.
    const xuLyDatLamMacDinh = (index) => {
        setDanhSachShowroomAdmin(prev => prev.map((showroom, viTri) => ({
            ...showroom,
            la_mac_dinh: viTri === index
        })));
    };

    const xuLyThemShowroomMoi = () => {
        const idMoi = `showroom-${Date.now()}`;
        const srMoi = {
            id: idMoi,
            ten: `Showroom Chi Nhánh ${danhSachShowroomAdmin.length + 1}`,
            dia_chi: '',
            hotline: '1900.8946',
            hotline_di_dong: '0948.37.79.79',
            gio_mo_cua: '08:30 - 21:30 (Mở cả tuần)',
            vi_do: 10.760086,
            kinh_do: 106.663185,
            la_mac_dinh: false
        };
        setDanhSachShowroomAdmin(prev => [...prev, srMoi]);
        setShowroomDangXemTruoc(danhSachShowroomAdmin.length);
        toast.info('Đã thêm dòng showroom mới. Hãy điền địa chỉ & tọa độ GPS!');
    };

    const xuLyXoaShowroom = async (index) => {
        if (danhSachShowroomAdmin.length <= 1) {
            toast.error('Hệ thống phải có ít nhất 1 showroom!');
            return;
        }
        const dongY = await xacNhan({
            tieuDe: 'Xóa Showroom',
            noiDung: 'Bạn có chắc chắn muốn xóa showroom này khỏi danh sách cấu hình?'
        });
        if (!dongY) return;
        setDanhSachShowroomAdmin(prev => prev.filter((_, idx) => idx !== index));
        setShowroomDangXemTruoc(0);
        toast.success('Đã xóa showroom khỏi danh sách cấu hình!');
    };

    const xuLyLuuShowroom = async () => {
        setDangLuuShowroom(true);
        try {
            await CaiDatService.luuDanhSachShowroomAsync(danhSachShowroomAdmin);
            toast.success('Đã lưu cấu hình danh sách Showroom & Tọa độ GPS thành công!');
        } catch (e) {
            toast.error('Lỗi khi lưu cấu hình showroom');
        } finally {
            setDangLuuShowroom(false);
        }
    };

    // ==========================================
    // CÁC MODAL QUẢN TRỊ & TRẠNG THÁI LOADING / DISABLE
    // ==========================================
    const [dangLuuSp, setDangLuuSp] = useState(false);
    const [dangXuLySpId, setDangXuLySpId] = useState(null);
    const [dangLuuDonHang, setDangLuuDonHang] = useState(false);
    const [dangXuLyDonHangId, setDangXuLyDonHangId] = useState(null);
    const [dangLuuDanhMuc, setDangLuuDanhMuc] = useState(false);
    const [dangXuLyDmId, setDangXuLyDmId] = useState(null);
    const [dangLuuUser, setDangLuuUser] = useState(false);
    const [dangXuLyUserId, setDangXuLyUserId] = useState(null);
    const [dangLuuVoucher, setDangLuuVoucher] = useState(false);
    const [dangXuLyVoucherId, setDangXuLyVoucherId] = useState(null);
    const [dangLuuTinTuc, setDangLuuTinTuc] = useState(false);
    const [dangXuLyTinTucId, setDangXuLyTinTucId] = useState(null);
    const [dangLuuKm, setDangLuuKm] = useState(false);

    const [dangMoModalSp, setDangMoModalSp] = useState(false);
    const [spDangSua, setSpDangSua] = useState(null);
    const [loaiFormSanPham, setLoaiFormSanPham] = useState('laptop'); // 'laptop' | 'ban_phim' | 'chuot' | 'balo' | 'tai_nghe' | 'sac_hub' | 'linh_kien'
    const [tabModalSp, setTabModalSp] = useState('thong_tin'); // 'thong_tin' | 'thong_so' | 'bien_the' | 'hinh_anh'
    const [modalXemAnh, setModalXemAnh] = useState(null); // { url, ten, gia, sku, hang, variants }
    const [tuKhoaSanPham, setTuKhoaSanPham] = useState('');
    const [thongSoTuyChinh, setThongSoTuyChinh] = useState([]);
    const [thongSoTuyChinhGoc, setThongSoTuyChinhGoc] = useState([]);
    const [dangXemTruocCard, setDangXemTruocCard] = useState(false);
    const [kieuXemTruoc, setKieuXemTruoc] = useState('chi_tiet'); // 'card' | 'chi_tiet'
    const [anhXemTruocChiTiet, setAnhXemTruocChiTiet] = useState('');
    const [tuyChonXemTruoc, setTuyChonXemTruoc] = useState(null);
    const [tabChiTietXemTruoc, setTabChiTietXemTruoc] = useState('tong_quan'); // 'tong_quan' | 'thong_so' | 'danh_gia'
    const [daSoSanhXemTruoc, setDaSoSanhXemTruoc] = useState(false);
    const [formSpGoc, setFormSpGoc] = useState(null);
    const [hienOUrlAnhChinh, setHienOUrlAnhChinh] = useState(false);

    // ==========================================
    // TRẠNG THÁI LOADING CỤC BỘ KHI ĐỔI BỘ LỌC TỪNG BẢNG (FILTER LOADING STATES)
    // ==========================================
    const [dangLocDonHang, setDangLocDonHang] = useState(false);
    const [dangLocSanPham, setDangLocSanPham] = useState(false);
    const [dangLocDanhMuc, setDangLocDanhMuc] = useState(false);
    const [dangLocKhachHang, setDangLocKhachHang] = useState(false);
    const [dangLocVoucher, setDangLocVoucher] = useState(false);
    const [dangLocTinTuc, setDangLocTinTuc] = useState(false);

    // Kích hoạt hiệu ứng loading khi thay đổi bất kỳ tiêu chí lọc nào
    const daMountDonHangRef = React.useRef(false);
    useEffect(() => {
        if (!daMountDonHangRef.current) {
            daMountDonHangRef.current = true;
            return;
        }
        setDangLocDonHang(true);
        const timer = setTimeout(() => setDangLocDonHang(false), 380);
        return () => clearTimeout(timer);
    }, [locTrangThaiDonHang, locThanhToanDonHang, locThoiGianDonHang, locNgayCuThe, sapXepDonHang, tuKhoaGlobal]);

    const daMountSanPhamRef = React.useRef(false);
    useEffect(() => {
        if (!daMountSanPhamRef.current) {
            daMountSanPhamRef.current = true;
            return;
        }
        setDangLocSanPham(true);
        const timer = setTimeout(() => setDangLocSanPham(false), 380);
        return () => clearTimeout(timer);
    }, [tuKhoaSanPham, locNganhHang, locHangSanPham, locTonKhoSanPham, sapXepSanPham, tuKhoaGlobal]);

    const daMountDanhMucRef = React.useRef(false);
    useEffect(() => {
        if (!daMountDanhMucRef.current) {
            daMountDanhMucRef.current = true;
            return;
        }
        setDangLocDanhMuc(true);
        const timer = setTimeout(() => setDangLocDanhMuc(false), 380);
        return () => clearTimeout(timer);
    }, [tuKhoaDanhMuc, locLoaiDanhMuc, tuKhoaGlobal]);

    const daMountKhachHangRef = React.useRef(false);
    useEffect(() => {
        if (!daMountKhachHangRef.current) {
            daMountKhachHangRef.current = true;
            return;
        }
        setDangLocKhachHang(true);
        const timer = setTimeout(() => setDangLocKhachHang(false), 380);
        return () => clearTimeout(timer);
    }, [tuKhoaKhachHang, locKhachHang, sapXepKhachHang, tuKhoaGlobal]);

    const daMountVoucherRef = React.useRef(false);
    useEffect(() => {
        if (!daMountVoucherRef.current) {
            daMountVoucherRef.current = true;
            return;
        }
        setDangLocVoucher(true);
        const timer = setTimeout(() => setDangLocVoucher(false), 380);
        return () => clearTimeout(timer);
    }, [tuKhoaVoucher, locTrangThaiVoucher, tuKhoaGlobal]);

    const daMountTinTucRef = React.useRef(false);
    useEffect(() => {
        if (!daMountTinTucRef.current) {
            daMountTinTucRef.current = true;
            return;
        }
        setDangLocTinTuc(true);
        const timer = setTimeout(() => setDangLocTinTuc(false), 380);
        return () => clearTimeout(timer);
    }, [tuKhoaTinTuc, locChuyenMucTinTuc, locTrangThaiTinTuc, tuKhoaGlobal]);

    // Kiểm tra xem ô/trường này có bị sửa đổi so với ban đầu hay không
    const kiemTraDaSua = (key) => {
        if (!formSpGoc || !spDangSua) return false;
        const goc = formSpGoc[key];
        const hienTai = formSp[key];
        if ((goc === undefined || goc === '' || goc === null) && (hienTai === '' || hienTai === 0 || hienTai === null || hienTai === false)) return false;
        return JSON.stringify(goc) !== JSON.stringify(hienTai);
    };

    // Đếm tổng số trường đã chỉnh sửa (bao gồm form chính và thông số tùy chỉnh)
    const demSoMucDaSua = () => {
        if (!formSpGoc || !spDangSua) return 0;
        let count = 0;
        Object.keys(formSpGoc).forEach(k => {
            if (kiemTraDaSua(k)) count++;
        });
        // Kiểm tra thay đổi trong bảng thông số tùy biến
        if (Array.isArray(thongSoTuyChinh) && Array.isArray(thongSoTuyChinhGoc)) {
            thongSoTuyChinh.forEach((item, idx) => {
                const goc = thongSoTuyChinhGoc[idx];
                if (!goc || goc.key !== item.key || goc.value !== item.value) {
                    count++;
                }
            });
            if (thongSoTuyChinh.length < thongSoTuyChinhGoc.length) {
                count += (thongSoTuyChinhGoc.length - thongSoTuyChinh.length);
            }
        }
        return count;
    };

    // Style ô input: Khi SỬA ĐỔI sẽ tô màu vàng cam hổ phách nổi bật; Khi CLICK/FOCUS sẽ sáng bừng viền xanh rõ nét
    const layClassInput = (fieldName, extra = '') => {
        const daSua = kiemTraDaSua(fieldName);
        if (daSua) {
            return `w-full px-3.5 py-2.5 rounded-xl border-2 border-amber-500 dark:border-amber-400 bg-amber-50 dark:bg-amber-950/50 text-amber-950 dark:text-amber-100 font-bold text-xs ring-2 ring-amber-400/30 focus:border-amber-600 focus:bg-amber-100/90 dark:focus:bg-amber-900/60 focus:outline-none transition-all shadow-xs cursor-text pointer-events-auto ${extra}`;
        }
        return `w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-blue-50/60 dark:focus:bg-slate-800/80 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all cursor-text pointer-events-auto ${extra}`;
    };

    // Style cho ô thông số tùy biến (Key - Value)
    const layClassInputTuyChinh = (idx, field, extra = '') => {
        if (!spDangSua || !thongSoTuyChinhGoc) {
            return `px-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-blue-50/60 dark:focus:bg-slate-800/80 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all cursor-text pointer-events-auto ${extra}`;
        }
        const goc = thongSoTuyChinhGoc[idx];
        const hienTai = thongSoTuyChinh[idx];
        const daSua = !goc || (field === 'key' ? goc.key !== hienTai?.key : goc.value !== hienTai?.value);
        if (daSua) {
            return `px-3.5 py-2.5 rounded-xl border-2 border-amber-500 dark:border-amber-400 bg-amber-50 dark:bg-amber-950/50 text-amber-950 dark:text-amber-100 font-bold text-xs ring-2 ring-amber-400/30 focus:border-amber-600 focus:bg-amber-100/90 dark:focus:bg-amber-900/60 focus:outline-none transition-all shadow-xs ${extra}`;
        }
        return `px-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-blue-50/60 dark:focus:bg-slate-800/80 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all cursor-text pointer-events-auto ${extra}`;
    };

    // Từ điển giải nghĩa slug / mã thông số sang Tiếng Việt có dấu chuẩn đẹp cho admin và khách xem
    const TU_DIEN_THONG_SO_ADMIN = {
        'toc_do_bus': 'Tốc độ Bus RAM',
        'nang_cap_ram_toi_da': 'Khả năng nâng cấp RAM',
        'khe_cam_mo_rong': 'Khe cắm mở rộng SSD/M.2',
        'do_phan_giai': 'Độ phân giải chuẩn',
        'tam_nen': 'Công nghệ tấm nền',
        'do_phu_mau': 'Độ phủ gam màu',
        'chi_tiet_tan_nhiet': 'Hệ thống tản nhiệt',
        'tan_so_quet': 'Tần số quét màn hình',
        'do_sang_nits': 'Độ sáng cực đại',
        'cong_suat_tgp': 'Công suất card đồ họa TGP',
        'bo_sac_cong_suat': 'Công suất bộ sạc đi kèm',
        'chat_lieu_vo': 'Chất liệu vỏ máy',
        'chuan_wifi_bluetooth': 'Chuẩn Wi-Fi & Bluetooth',
        'cong_ket_noi': 'Cổng kết nối ngoại vi',
        'he_dieu_hanh': 'Hệ điều hành tích hợp',
        'che_do_bao_hanh': 'Chế độ bảo hành chính hãng',
        'ban_phim': 'Bàn phím & Đèn nền',
        'am_thanh': 'Công nghệ âm thanh'
    };

    const layTenHienThiKey = (rawKey) => {
        if (!rawKey) return '';
        const k = rawKey.trim();
        if (TU_DIEN_THONG_SO_ADMIN[k]) return TU_DIEN_THONG_SO_ADMIN[k];
        if (/[À-ỹ\sA-Z]/.test(k)) return k;
        return k
            .split('_')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    };

    // Huy hiệu nhỏ thông báo ô này đã được chỉnh sửa
    const NhanDaSua = ({ fieldName }) => {
        if (!kiemTraDaSua(fieldName)) return null;
        return (
            <span className="text-[10px] font-black text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/70 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-600 inline-flex items-center gap-1 shadow-xs animate-in fade-in duration-150">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Đã sửa
            </span>
        );
    };

    // Hộp thoại xác nhận / cảnh báo tùy biến cao cấp (Thay thế window.confirm và alert mặc định xấu xí của trình duyệt)
    const [hopThoai, setHopThoai] = useState({
        hien: false,
        kieu: 'confirm', // 'confirm' | 'alert'
        loai: 'danger',  // 'danger' | 'warning' | 'info' | 'success'
        tieuDe: '',
        noiDung: '',
        nutXacNhan: 'Xác Nhận',
        nutHuy: 'Hủy Bỏ',
        onXacNhan: () => {},
        onHuy: () => {}
    });

    const xacNhan = ({
        tieuDe = 'Xác Nhận Thao Tác',
        noiDung = 'Bạn có chắc chắn muốn thực hiện thao tác này?',
        loai = 'danger',
        nutXacNhan = 'Xác Nhận',
        nutHuy = 'Hủy Bỏ'
    }) => {
        return new Promise((resolve) => {
            setHopThoai({
                hien: true,
                kieu: 'confirm',
                loai,
                tieuDe,
                noiDung,
                nutXacNhan,
                nutHuy,
                onXacNhan: () => {
                    setHopThoai(prev => ({ ...prev, hien: false }));
                    resolve(true);
                },
                onHuy: () => {
                    setHopThoai(prev => ({ ...prev, hien: false }));
                    resolve(false);
                }
            });
        });
    };

    const canhBao = ({
        tieuDe = 'Thông Báo Hệ Thống',
        noiDung = '',
        loai = 'warning',
        nutDong = 'Đã Hiểu'
    }) => {
        return new Promise((resolve) => {
            setHopThoai({
                hien: true,
                kieu: 'alert',
                loai,
                tieuDe,
                noiDung,
                nutXacNhan: nutDong,
                nutHuy: '',
                onXacNhan: () => {
                    setHopThoai(prev => ({ ...prev, hien: false }));
                    resolve(true);
                },
                onHuy: () => {
                    setHopThoai(prev => ({ ...prev, hien: false }));
                    resolve(true);
                }
            });
        });
    };

    // Đóng modal an toàn: Nếu đang sửa mà chưa lưu thì hiển thị hộp thoại xác nhận cao cấp
    const dongModalSpAnToan = async () => {
        const soMucSua = demSoMucDaSua();
        if (spDangSua && soMucSua > 0) {
            const dongY = await xacNhan({
                tieuDe: 'Hủy Bỏ Thay Đổi Chưa Lưu?',
                noiDung: `Bạn đang có ${soMucSua} mục thông tin đã chỉnh sửa nhưng CHƯA ĐƯỢC LƯU.\n\nNếu thoát bây giờ, các thay đổi này sẽ bị hủy bỏ hoàn toàn. Bạn có chắc muốn thoát không?`,
                loai: 'warning',
                nutXacNhan: 'Thoát & Hủy Bỏ',
                nutHuy: 'Ở Lại Chỉnh Sửa'
            });
            if (!dongY) return;
        }
        setDangMoModalSp(false);
    };

    const [formSp, setFormSp] = useState({
        ma_san_pham: '',
        ten_san_pham: '',
        hang_san_xuat: '',
        danh_muc: [],
        gia_goc: '',
        gia_khuyen_mai: '',
        phan_tram_giam_gia: '',
        hinh_anh_chinh: '',
        so_luong_ton_kho: '',
        con_hang: true,
        la_flash_sale: false,
        la_ban_chay: false,
        la_san_pham_moi: false,
        mo_ta_chi_tiet: '',
        mo_ta_ngan: '',
        dac_diem_noi_bat: [],
        qua_tang: [],
        tuy_chon_phien_ban: [],
        thu_vien_hinh_anh: [],

        // 1. Cấu hình chi tiết Laptop
        cpu: '',
        so_nhan_luong: '',
        xung_nhip_toi_da: '',
        bo_nho_dem_cache: '',
        chip_ai_npu: '',
        hieu_nang_ai_tops: '',
        card_do_hoa: '',
        dung_luong_vram: '',
        cong_suat_tgp: '',
        ho_tro_ray_tracing: false,
        ram: '',
        loai_ram: '',
        toc_do_bus: '',
        nang_cap_ram_toi_da: '',
        o_cung: '',
        khe_cam_mo_rong: '',
        man_hinh: '',
        do_phan_giai: '',
        tan_so_quet: '',
        tam_nen: '',
        do_phu_mau: '',
        do_sang_nits: '',
        cong_nghe_man_hinh: '',
        pin: '',
        dung_luong_pin: '',
        thoi_luong_su_dung_uoc_tinh: '',
        cong_suat_sac: '',
        he_thong_tan_nhiet: '',
        chi_tiet_tan_nhiet: '',
        trong_luong: '',
        kich_thuoc: '',
        chat_lieu_vo: '',
        cong_ket_noi: '',
        chuan_wifi_bluetooth: '',
        ban_phim: '',
        am_thanh: '',
        he_dieu_hanh: '',

        // Tiêu đề phân nhóm cấu hình kỹ thuật tùy biến (hỗ trợ đổi tên 100%)
        tieu_de_nhom_cpu: '1. Bộ Xử Lý & Hiệu Năng (CPU)',
        tieu_de_nhom_gpu: '2. Đồ Họa & Xử Lý Hình Ảnh (GPU)',
        tieu_de_nhom_ram: '3. Bộ Nhớ RAM & Ổ Cứng Lưu Trữ',
        tieu_de_nhom_man_hinh: '4. Màn Hình & Không Gian Hiển Thị',
        tieu_de_nhom_pin: '5. Hệ Thống Tản Nhiệt & Thời Lượng Pin',
        tieu_de_nhom_thiet_ke: '6. Thiết Kế Khung Vỏ, Bàn Phím & Cổng Giao Tiếp',
        tieu_de_nhom_linh_kien_hieu_nang: '1. Hiệu Năng & Tốc Độ Truyền Tải',
        tieu_de_nhom_linh_kien_chuan: '2. Chuẩn Giao Tiếp & Độ Bền',
        tieu_de_nhom_balo_ngan_chua: '1. Ngăn Chứa & Kích Thước Máy',
        tieu_de_nhom_balo_chat_lieu: '2. Chất Liệu & Khả Năng Kháng Nước',
        tieu_de_nhom_balo_tien_ich: '3. Tiện Ích, Tính Năng & Bảo Hành',
        tieu_de_nhom_phim_switch: '1. Switch & Cảm Giác Gõ Phím',
        tieu_de_nhom_phim_layout: '2. Layout, Keycap & Khung Vỏ',
        tieu_de_nhom_phim_ket_noi: '3. Kết Nối, Đèn LED & Pin',
        tieu_de_nhom_chuot_cam_bien: '1. Cảm Biến, DPI & Độ Chính Xác',
        tieu_de_nhom_chuot_ket_noi: '2. Kết Nối, Kích Thước & Thời Lượng Pin',
        tieu_de_nhom_tai_nghe_am_thanh: '1. Màng Loa, Âm Thanh & Chống Ồn ANC',
        tieu_de_nhom_tai_nghe_ket_noi: '2. Kết Nối, Micro & Thời Lượng Pin',
        tieu_de_nhom_tai_nghe_thiet_ke: '3. Thiết Kế, Đệm Tai & Kháng Nước',
        tieu_de_nhom_sac_cong_suat: '1. Công Suất & Công Nghệ Sạc Nhanh GaN',
        tieu_de_nhom_sac_cong_ket_noi: '2. Cổng Kết Nối & Băng Thông Truyền Tải',
        tieu_de_nhom_sac_thiet_ke: '3. Thiết Kế, Dây Cáp & Độ Bền',

        // 2. Bàn phím cơ
        loai_switch: '',
        tinh_nang_dac_biet: '',
        cau_truc_mount: '',
        layout_ban_phim: '',
        keycap_chat_lieu: '',
        chat_lieu_case: '',
        kieu_ket_noi_gear: '',
        led_rgb_gear: '',
        dung_luong_pin_gear: '',
        hot_swap: '',
        tuong_thich_gear: '',
        trong_luong_gear: '',

        // 3. Chuột & Lót chuột
        cam_bien_chuot: '',
        do_phan_giai_dpi: '',
        toc_do_ips_gia_toc: '',
        switch_chuot: '',
        polling_rate: '',
        loai_lot_chuot: '',
        chat_lieu_be_mat: '',
        chat_lieu_de: '',
        kieu_ket_noi_chuot: '',
        che_do_led: '',
        thoi_luong_pin_chuot: '',
        chat_lieu_feet: '',
        kich_thuoc_chuot: '',
        trong_luong_chuot: '',

        // 4. Balo & Túi chống sốc
        kich_co_laptop_phu_hop: '',
        dung_tich_balo: '',
        so_ngan_chua: '',
        kich_thuoc_balo: '',
        trong_luong_tui: '',
        chat_lieu_chinh: '',
        lop_lot_bao_ve: '',
        khoa_keo: '',
        kha_nang_khang_nuoc: '',
        dem_lung_thoang_khi: '',
        cong_tinh_nang: '',

        // 5. Tai nghe & Loa
        mang_loa_driver: '',
        cong_nghe_am_thanh: '',
        tan_so_dap_ung: '',
        tro_khang_do_nhay: '',
        chong_on_anc: '',
        micro_dam_thoai: '',
        kieu_ket_noi_tai_nghe: '',
        thoi_luong_pin_tai_nghe: '',
        khang_nuoc_tai_nghe: '',
        dem_tai: '',
        bo_dieu_khien: '',
        kich_thuoc_tai_nghe: '',
        trong_luong_tai_nghe: '',

        // 6. Củ sạc & Hub chuyển đổi
        cong_suat_tong: '',
        cong_nghe_sac: '',
        giao_thuc_ho_tro: '',
        dung_luong_pin_sac: '',
        man_hinh_hien_thi: '',
        tinh_nang_an_toan: '',
        so_cong_sac: '',
        bang_thong_truyen_du_lieu: '',
        cong_suat_sac_pass_through: '',
        xuat_hinh_anh: '',
        chieu_dai_cap: '',
        chat_lieu_vo_sac: '',
        tuong_thich_sac: '',
        kich_thuoc_trong_luong_sac: '',
        kich_thuoc_sac: '',
        trong_luong_sac: '',

        // 7. Linh kiện & Tản nhiệt
        loai_linh_kien: '',
        dung_luong_linh_kien: '',
        toc_do_doc_ghi: '',
        toc_do_bus_linh_kien: '',
        do_tre_cl: '',
        so_nhan_luong_linh_kien: '',
        xung_nhip_toi_da_linh_kien: '',
        bo_nho_dem_cache_linh_kien: '',
        cong_suat_tdp: '',
        ho_tro_ram: '',
        toc_do_quat: '',
        hieu_qua_giam_nhiet: '',
        do_dan_nhiet: '',
        chuan_giao_tiep: '',
        do_ben_tbw: '',
        tinh_nang_dac_biet_linh_kien: '',
        he_thong_tan_nhiet: '',
        tuong_thich_linh_kien: '',
        kich_co_laptop_linh_kien: '',
        trong_luong_linh_kien: '',

        che_do_bao_hanh: '',
        thoi_han_bao_hanh_thang: ''
    });

    const [dangMoModalDonHang, setDangMoModalDonHang] = useState(false);
    const [donHangDangSua, setDonHangDangSua] = useState(null);
    const [formDonHang, setFormDonHang] = useState({
        ho_ten: '',
        so_dien_thoai: '',
        email: '',
        tinh_thanh: '',
        phuong_xa: '',
        dia_chi_chi_tiet: '',
        ghi_chu: 'Khách mua trực tiếp tại quầy',
        cac_san_pham: [{ san_pham_id: '', so_luong: 1 }],
        hinh_thuc_thanh_toan: 'chuyen_khoan_vietqr',
        da_thanh_toan: true,
        trang_thai: 'da_xac_nhan',
        ma_giam_gia: ''
    });

    const [dangMoModalDanhMuc, setDangMoModalDanhMuc] = useState(false);
    const [dmDangSua, setDmDangSua] = useState(null);
    const [formDm, setFormDm] = useState({
        ma_danh_muc: '',
        ten_danh_muc: '',
        loai: 'thuong_hieu',
        logo: '💻',
        xuat_xu: 'Chính Hãng',
        mo_ta: '',
        kich_hoat: true,
        thu_tu_hien_thi: 1
    });

    const [dangMoModalUser, setDangMoModalUser] = useState(false);
    const [userDangSua, setUserDangSua] = useState(null);
    const [formUser, setFormUser] = useState({
        hoTen: '',
        email: '',
        matKhau: '',
        soDienThoai: '',
        vaiTro: 'khach_hang',
        trangThai: 'hoat_dong',
        biKhoa: false,
        lyDoKhoa: ''
    });

    const [dangMoModalVoucher, setDangMoModalVoucher] = useState(false);
    const [voucherDangSua, setVoucherDangSua] = useState(null);
    const [formVoucher, setFormVoucher] = useState({
        ma_code: '',
        tieu_de: '',
        mo_ta: '',
        loai_giam: 'tien_mat',
        gia_tri_giam: 500000,
        giam_toi_da: 0,
        don_hang_toi_thieu: 20000000,
        so_luong_phat_hanh: 20,
        ngay_bat_dau: '2026-08-01',
        ngay_het_han: '2026-12-31',
        chuyen_muc: 'toan_san',
        mau_sac: 'rose',
        badge: 'HOT DEAL',
        kich_hoat: true
    });

    // Modal Tin Tức & Bài Viết
    const [dangMoModalTinTuc, setDangMoModalTinTuc] = useState(false);
    const [tinTucDangSua, setTinTucDangSua] = useState(null);
    const [formTinTuc, setFormTinTuc] = useState({
        id: '',
        tieu_de: '',
        tom_tat: '',
        noi_dung: '',
        hinh_anh: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
        chuyen_muc: 'Tư Vấn Mua Sắm',
        tac_gia: 'Chuyên Gia Công Nghệ TNTP Laptop',
        thoi_gian_doc: '5 phút đọc',
        la_tieu_diem: false,
        xuat_ban: true
    });

    const [donHangChiTiet, setDonHangChiTiet] = useState(null);

    const rutGonTen = (str, maxLen = 45) => {
        if (!str) return '';
        return str.length > maxLen ? str.slice(0, maxLen).trim() + '...' : str;
    };

    // Hệ thống thông báo đồng bộ toàn sàn (Sonner Toaster tại góc dưới bên phải)
    const hienThongBao = (msg, type = 'success', title = '') => {
        let noiDung = msg;
        if (typeof msg === 'string' && (msg.includes('Failed to fetch') || msg.includes('NetworkError'))) {
            noiDung = 'Không thể kết nối máy chủ API (Backend chưa chạy hoặc đang khởi động)';
        }

        let tieuDeChinh = noiDung;
        let moTaPhu = undefined;

        if (title && title !== 'Thành Công' && title !== 'Thông Báo') {
            tieuDeChinh = title;
            moTaPhu = noiDung;
        }

        const options = moTaPhu ? { description: moTaPhu } : {};

        if (type === 'danger' || type === 'error') {
            toast.error(tieuDeChinh, options);
        } else if (type === 'warning') {
            toast.warning(tieuDeChinh, options);
        } else if (type === 'info') {
            toast.info(tieuDeChinh, options);
        } else if (type === 'deal') {
            toast.success(tieuDeChinh, { description: moTaPhu || '⚡ Flash Sale Cửa Hàng' });
        } else {
            toast.success(tieuDeChinh, options);
        }
    };

    // Đọc + nén ảnh; lỗi thì báo cho admin và trả về null
    const docAnhHoacBaoLoi = (file, tuyChon) =>
        docAnhDaNen(file, tuyChon).catch((loi) => {
            canhBao({ tieuDe: 'Không Đọc Được Ảnh', noiDung: loi.message, loai: 'warning' });
            return null;
        });

    // Xử lý upload ảnh chính sản phẩm trực tiếp từ máy tính
    const xuLyUploadAnhChinh = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            canhBao({
                tieuDe: 'Định Dạng Tệp Không Hợp Lệ',
                noiDung: 'Vui lòng chọn đúng file hình ảnh hợp lệ (JPG, PNG, WebP, GIF...).',
                loai: 'warning'
            });
            return;
        }
        docAnhHoacBaoLoi(file).then((duLieuAnh) => {
        if (duLieuAnh) {
                setFormSp(prev => ({
                    ...prev,
                    hinh_anh_chinh: duLieuAnh,
                    hinh_anh: duLieuAnh
                }));
                hienThongBao('Đã tải ảnh đại diện từ máy tính lên thành công!');
        }
    });
        e.target.value = '';
    };

    // Xử lý upload ảnh cho từng biến thể / màu sắc trực tiếp từ máy tính
    const xuLyUploadAnhBienThe = (bIdx, e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            canhBao({
                tieuDe: 'Định Dạng Tệp Không Hợp Lệ',
                noiDung: 'Vui lòng chọn đúng file hình ảnh hợp lệ (JPG, PNG, WebP, GIF...).',
                loai: 'warning'
            });
            return;
        }
        docAnhHoacBaoLoi(file).then((duLieuAnh) => {
        if (duLieuAnh) {
                const updated = [...(formSp.tuy_chon_phien_ban || [])];
                updated[bIdx] = { ...updated[bIdx], hinh_anh: duLieuAnh };
                setFormSp(prev => ({ ...prev, tuy_chon_phien_ban: updated }));
                hienThongBao(`Đã tải ảnh cho biến thể #${bIdx + 1} từ máy tính thành công!`);
        }
    });
        e.target.value = '';
    };

    // Xử lý tải ảnh bài viết tin tức trực tiếp từ máy tính
    const xuLyUploadAnhTinTuc = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            canhBao({
                tieuDe: 'Định Dạng Tệp Không Hợp Lệ',
                noiDung: 'Vui lòng chọn đúng file hình ảnh hợp lệ (JPG, PNG, WebP...).',
                loai: 'warning'
            });
            return;
        }
        docAnhHoacBaoLoi(file).then((duLieuAnh) => {
        if (duLieuAnh) {
                setFormTinTuc(prev => ({ ...prev, hinh_anh: duLieuAnh }));
                hienThongBao('Đã tải hình ảnh bài viết từ máy tính lên thành công!');
        }
    });
        e.target.value = '';
    };

    // Xử lý tải logo thương hiệu trực tiếp từ máy tính
    const xuLyUploadLogoDanhMuc = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            canhBao({
                tieuDe: 'Định Dạng Tệp Không Hợp Lệ',
                noiDung: 'Vui lòng chọn file hình ảnh hợp lệ (PNG, JPG, SVG, WebP...).',
                loai: 'warning'
            });
            return;
        }
        docAnhHoacBaoLoi(file, { canhToiDa: 600 }).then((duLieuAnh) => {
        if (duLieuAnh) {
                setFormDm(prev => ({ ...prev, logo: duLieuAnh }));
                hienThongBao('Đã tải logo thương hiệu từ máy tính lên thành công!');
        }
    });
        e.target.value = '';
    };

    // Xử lý thêm nhiều ảnh vào thư viện Gallery sản phẩm
    const xuLyUploadAnhGallerySp = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        const validFiles = files.filter(f => f.type.startsWith('image/'));
        if (validFiles.length === 0) {
            canhBao({
                tieuDe: 'Định Dạng Tệp Không Hợp Lệ',
                noiDung: 'Vui lòng chọn đúng tệp hình ảnh hợp lệ (JPG, PNG, WebP...).',
                loai: 'warning'
            });
            return;
        }

        // Nén từng ảnh rồi thêm cả loạt vào thư viện một lần
        Promise.all(validFiles.map((file) => docAnhHoacBaoLoi(file))).then((ketQuaDoc) => {
            const ketQua = ketQuaDoc.filter(Boolean);
            if (ketQua.length === 0) return;
            setFormSp(prev => ({
                ...prev,
                thu_vien_hinh_anh: [...(prev.thu_vien_hinh_anh || []), ...ketQua]
            }));
            hienThongBao(`Đã thêm thành công ${ketQua.length} ảnh vào thư viện sản phẩm!`);
        });
        e.target.value = '';
    };

    const taiDuLieuToanBo = async () => {
        setDangTai(true);
        try {
            const results = await Promise.allSettled([
                SanPhamService.layTatCaSanPhamAsync(),
                DonHangService.layTatCaDonHangAsync(),
                MaGiamGiaService.layDanhSachMaGiamGiaAsync(true),
                DanhMucService.layDanhSachDanhMucAsync(),
                NguoiDungService.layDanhSachNguoiDungAsync(),
                TinTucService.layDanhSachTinTucAsync({ tat_ca: true })
            ]);

            const sps = results[0].status === 'fulfilled' && Array.isArray(results[0].value) ? results[0].value : [];
            const dhs = results[1].status === 'fulfilled' && Array.isArray(results[1].value) ? results[1].value : [];
            const vcs = results[2].status === 'fulfilled' && Array.isArray(results[2].value) ? results[2].value : [];
            const dms = results[3].status === 'fulfilled' && Array.isArray(results[3].value) ? results[3].value : [];
            const us = results[4].status === 'fulfilled' && Array.isArray(results[4].value) ? results[4].value : [];
            const tts = results[5].status === 'fulfilled' && Array.isArray(results[5].value) ? results[5].value : [];

            setDanhSachSanPham(sps);
            setDanhSachDonHang(dhs);
            setDanhSachVoucher(vcs);
            setDanhSachDanhMuc(dms);
            setDanhSachNguoiDung(us);
            setDanhSachTinTuc(tts);

            const kmConfig = CaiDatService.layCaiDatKhuyenMai();
            setCaiDatKm(kmConfig);
            setFormCaiDatKm(kmConfig);
        } catch (e) {
            console.error('Lỗi nạp dữ liệu Admin:', e);
        } finally {
            setDangTai(false);
        }
    };

    useEffect(() => {
        if (laAdmin) {
            taiDuLieuToanBo();
        }
    }, [laAdmin]);

    // Tự làm mới đơn hàng mỗi 8 giây (khi tab đang mở): khách chuyển khoản xong, webhook PayOS đổi trạng thái
    // trong DB thì Admin thấy ngay mà không cần bấm làm mới. Chỉ cập nhật state khi dữ liệu thật sự đổi.
    useEffect(() => {
        if (!laAdmin) return undefined;
        const dauVet = (ds) => ds.map((d) => `${d.id || d._id}:${d.trang_thai}:${d.trang_thai_thanh_toan}:${d.da_thanh_toan}`).join('|');
        const lamMoiNgam = async () => {
            if (document.visibilityState !== 'visible') return;
            try {
                const ds = await DonHangService.layTatCaDonHangAsync();
                if (!Array.isArray(ds) || ds.length === 0) return;
                setDanhSachDonHang((cu) => (dauVet(cu) === dauVet(ds) ? cu : ds));
            } catch { /* bỏ qua, lần sau thử lại */ }
        };
        const timer = setInterval(lamMoiNgam, 8000);
        return () => clearInterval(timer);
    }, [laAdmin]);

    // Phím tắt Ctrl+B để thu gọn / mở rộng nhanh thanh bên
    useEffect(() => {
        const xuLyPhimTat = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                setSidebarThuGon(prev => !prev);
            }
        };
        window.addEventListener('keydown', xuLyPhimTat);
        return () => window.removeEventListener('keydown', xuLyPhimTat);
    }, []);

    // ==========================================
    // HÀM NHẬN DIỆN THÔNG MINH & XỬ LÝ SẢN PHẨM
    // ==========================================
    const xacDinhLoaiSanPham = (sp) => {
        if (!sp) return 'laptop';
        const dm = Array.isArray(sp.danh_muc) ? sp.danh_muc : (sp.danh_muc ? [sp.danh_muc] : []);
        const ten = (sp.ten_san_pham || '').toLowerCase();
        const id = (sp.id || sp._id || '').toLowerCase();

        if (dm.some(d => ['balo-tui-chong-soc', 'balo', 'tui-chong-soc'].includes(d)) ||
            ten.includes('balo') || ten.includes('túi') || ten.includes('cặp') || id.includes('balo') || id.includes('tui-')) {
            return 'balo';
        }
        if (dm.includes('ban-phim-co') || ten.includes('bàn phím') || ten.includes('keyboard') || ten.includes('phím cơ') || id.includes('ban-phim')) {
            return 'ban_phim';
        }
        if (dm.includes('chuot-lot-chuot') || ten.includes('chuột') || ten.includes('mouse') || ten.includes('lót chuột') || id.includes('chuot') || id.includes('lot-chuot')) {
            return 'chuot';
        }
        if (dm.some(d => ['tai-nghe-loa', 'tai-nghe', 'loa'].includes(d)) || ten.includes('tai nghe') || ten.includes('headphone') || ten.includes('earphone') || ten.includes('loa') || id.includes('tai-nghe') || id.includes('loa-')) {
            return 'tai_nghe';
        }
        if (dm.includes('sac-cap-hub') || ten.includes('sạc') || ten.includes('charger') || ten.includes('cáp') || ten.includes('cable') || ten.includes('hub') || ten.includes('dock') || id.includes('sac-') || id.includes('hub-') || id.includes('cap-')) {
            return 'sac_hub';
        }
        if (dm.some(d => ['linh-kien-nang-cap', 'linh-kien', 'de-tan-gia-do'].includes(d)) || ten.includes('ssd') || ten.includes('ram') || ten.includes('đế tản nhiệt') || ten.includes('giá đỡ') || id.includes('ssd-') || id.includes('ram-') || id.includes('de-tan-') || id.includes('gia-do-')) {
            return 'linh_kien';
        }
        return 'laptop';
    };

    const layThongSoNhanhAdmin = (sp) => {
        if (!sp) return { icon: '💻', text: 'Chưa có thông số' };
        const ts = sp.thong_so || {};
        const loai = xacDinhLoaiSanPham(sp);

        if (loai === 'balo') {
            const ngan = ts.kich_co_laptop_phu_hop || ts.ngan_chua_laptop || '';
            const dt = ts.dung_tich ? `${ts.dung_tich}` : '';
            const cl = ts.chat_lieu_chinh || ts.chat_lieu || '';
            const parts = [ngan, dt, cl].filter(Boolean);
            return { icon: '🎒', text: parts.join(' • ') || 'Balo laptop cao cấp chống sốc' };
        }
        if (loai === 'ban_phim') {
            const sw = ts.switch || ts.switch_cam_bien || ts.loai_switch || '';
            const layout = ts.layout || ts.layout_ban_phim || '';
            const kn = ts.kieu_ket_noi || ts.ket_noi || '';
            const parts = [sw, layout, kn].filter(Boolean);
            return { icon: '⌨️', text: parts.join(' • ') || 'Bàn phím cơ Custom HIFI' };
        }
        if (loai === 'chuot') {
            const dpi = ts.do_phan_giai_dpi ? `${ts.do_phan_giai_dpi}` : '';
            const cb = ts.cam_bien || ts.cam_bien_quang_hoc || '';
            const tl = ts.trong_luong ? `${ts.trong_luong}` : '';
            const parts = [cb, dpi, tl].filter(Boolean);
            return { icon: '🖱️', text: parts.join(' • ') || 'Chuột Gaming siêu nhẹ' };
        }
        if (loai === 'tai_nghe') {
            const driver = ts.mang_loa_driver || '';
            const pin = ts.thoi_luong_pin || '';
            const kn = ts.chuan_ket_noi || ts.kieu_ket_noi || '';
            const parts = [driver, pin, kn].filter(Boolean);
            return { icon: '🎧', text: parts.join(' • ') || 'Tai nghe gaming Hi-Res âm thanh vòm' };
        }
        if (loai === 'sac_hub') {
            const cs = ts.cong_suat_tong || ts.cong_suat_toi_da || '';
            const cong = ts.so_cong_sac || ts.so_cong_ket_noi || '';
            const cn = ts.cong_nghe_sac || '';
            const parts = [cs, cong, cn].filter(Boolean);
            return { icon: '⚡', text: parts.join(' • ') || 'Củ sạc GaN nhanh & Hub đa năng' };
        }
        if (loai === 'linh_kien') {
            const dl = ts.dung_luong || ts.dung_luong_bo_nho || '';
            const bus = ts.toc_do_doc_ghi || ts.toc_do_doc_ghi_bus || '';
            const parts = [dl, bus].filter(Boolean);
            return { icon: '💾', text: parts.join(' • ') || 'Linh kiện phần cứng chính hãng' };
        }
        // Laptop
        const cpu = ts.cpu || '';
        const gpu = ts.card_do_hoa || '';
        const ram = ts.ram || '';
        const parts = [cpu, gpu, ram].filter(Boolean);
        return { icon: '💻', text: parts.join(' • ') || 'Laptop chính hãng' };
    };

    // Thống kê Dashboard
    const thongKe = useMemo(() => {
        const tongDoanhThu = danhSachDonHang
            .filter(d => d.trang_thai !== 'da_huy')
            .reduce((sum, d) => sum + (Number(d.tong_tien_thanh_toan) || 0), 0);

        const doanhThuThanhCong = danhSachDonHang
            .filter(d => d.trang_thai === 'da_giao')
            .reduce((sum, d) => sum + (Number(d.tong_tien_thanh_toan) || 0), 0);

        const donChoXacNhan = danhSachDonHang.filter(d => d.trang_thai === 'cho_xac_nhan').length;
        const donDaXacNhan = danhSachDonHang.filter(d => d.trang_thai === 'da_xac_nhan').length;
        const donDangGiao = danhSachDonHang.filter(d => d.trang_thai === 'dang_giao').length;
        const donThanhCong = danhSachDonHang.filter(d => d.trang_thai === 'da_giao').length;
        const donDaHuy = danhSachDonHang.filter(d => d.trang_thai === 'da_huy').length;
        const tongDon = danhSachDonHang.length;

        const tongTonKho = danhSachSanPham.reduce((sum, s) => sum + (Number(s.so_luong_ton_kho) || 0), 0);
        const tongDaBan = danhSachSanPham.reduce((sum, s) => sum + (Number(s.so_luong_da_ban) || 0), 0);
        const spSapHetHang = danhSachSanPham.filter(s => (Number(s.so_luong_ton_kho) || 0) <= 5);

        const soLuongLaptop = danhSachSanPham.filter(s => xacDinhLoaiSanPham(s) === 'laptop').length;
        const soLuongLinhKien = danhSachSanPham.filter(s => xacDinhLoaiSanPham(s) === 'linh_kien').length;
        const soLuongGear = danhSachSanPham.filter(s => !['laptop', 'linh_kien'].includes(xacDinhLoaiSanPham(s))).length;
        const soLuongBalo = danhSachSanPham.filter(s => xacDinhLoaiSanPham(s) === 'balo').length;
        const soLuongBanPhim = danhSachSanPham.filter(s => xacDinhLoaiSanPham(s) === 'ban_phim').length;
        const soLuongChuot = danhSachSanPham.filter(s => xacDinhLoaiSanPham(s) === 'chuot').length;
        const soLuongTaiNghe = danhSachSanPham.filter(s => xacDinhLoaiSanPham(s) === 'tai_nghe').length;
        const soLuongSacHub = danhSachSanPham.filter(s => xacDinhLoaiSanPham(s) === 'sac_hub').length;

        const tongLuotXemTin = danhSachTinTuc.reduce((sum, t) => sum + (t.luot_xem || 0), 0);

        return {
            tongDoanhThu,
            doanhThuThanhCong,
            tongDonHang: tongDon,
            donChoXacNhan,
            donDaXacNhan,
            donDangGiao,
            donThanhCong,
            donDaHuy,
            tongSanPham: danhSachSanPham.length,
            soLuongLaptop,
            soLuongLinhKien,
            soLuongGear,
            soLuongBalo,
            soLuongBanPhim,
            soLuongChuot,
            soLuongTaiNghe,
            soLuongSacHub,
            tongTonKho,
            tongDaBan,
            spSapHetHang,
            tongKhachHang: danhSachNguoiDung.length,
            tongDanhMuc: danhSachDanhMuc.length,
            tongTinTuc: danhSachTinTuc.length,
            tongLuotXemTin
        };
    }, [danhSachDonHang, danhSachSanPham, danhSachNguoiDung, danhSachDanhMuc, danhSachTinTuc]);

    const topSanPhamBanChay = useMemo(() => {
        return [...danhSachSanPham]
            .sort((a, b) => (b.so_luong_da_ban || 0) - (a.so_luong_da_ban || 0))
            .slice(0, 5);
    }, [danhSachSanPham]);

    const xuatExcelDonHang = () => {
        const danhSachXuat = donHangHienThi.length > 0 ? donHangHienThi : danhSachDonHang;
        if (danhSachXuat.length === 0) {
            canhBao({
                tieuDe: 'Không Có Dữ Liệu Đơn Hàng',
                noiDung: 'Hiện không có đơn hàng nào trong danh sách hiện tại để xuất file Excel.',
                loai: 'info'
            });
            return;
        }

        // Helper format tiền tệ VNĐ chuẩn kế toán Việt Nam (Ví dụ: 74.990.000 ₫)
        const fmtVND = (num) => {
            const val = Number(num) || 0;
            return val.toLocaleString('vi-VN') + ' ₫';
        };

        // 1. Tính toán số liệu thống kê kế toán tổng hợp
        const tongSoDon = danhSachXuat.length;
        const soDonGiaoThanhCong = danhSachXuat.filter(d => d.trang_thai === 'da_giao').length;
        const soDonDangGiao = danhSachXuat.filter(d => d.trang_thai === 'dang_giao').length;
        const soDonDangXuLy = danhSachXuat.filter(d => d.trang_thai === 'cho_xac_nhan' || d.trang_thai === 'da_xac_nhan').length;
        const soDonDaHuy = danhSachXuat.filter(d => d.trang_thai === 'da_huy').length;
        const soDonDaThanhToan = danhSachXuat.filter(d => d.da_thanh_toan).length;
        const soDonChuaThanhToan = danhSachXuat.filter(d => !d.da_thanh_toan).length;

        const tongDoanhThuThucThu = danhSachXuat.reduce((sum, d) => sum + (Number(d.tong_tien_thanh_toan) || Number(d.tong_tien) || 0), 0);
        const tongTienGiamGia = danhSachXuat.reduce((sum, d) => sum + (Number(d.tien_giam_gia) || 0), 0);
        const tongTienHang = danhSachXuat.reduce((sum, d) => sum + (Number(d.tong_tien) || (Number(d.tong_tien_thanh_toan) + (Number(d.tien_giam_gia) || 0)) || 0), 0);
        const tongTienDaThu = danhSachXuat.filter(d => d.da_thanh_toan).reduce((sum, d) => sum + (Number(d.tong_tien_thanh_toan) || Number(d.tong_tien) || 0), 0);
        const tongTienConPhaiThuCOD = danhSachXuat.filter(d => !d.da_thanh_toan).reduce((sum, d) => sum + (Number(d.tong_tien_thanh_toan) || Number(d.tong_tien) || 0), 0);

        const now = new Date();
        const thoiGianXuat = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} - Ngày ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

        // Helper format ngày tháng
        const formatNgay = (val) => {
            if (!val) return '23/08/2026';
            if (typeof val === 'string' && val.includes('/') && !val.includes('T')) return val;
            const d = new Date(val);
            if (!isNaN(d.getTime())) {
                const hh = String(d.getHours()).padStart(2, '0');
                const mm = String(d.getMinutes()).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                const MM = String(d.getMonth() + 1).padStart(2, '0');
                const yyyy = d.getFullYear();
                return `${hh}:${mm} ${dd}/${MM}/${yyyy}`;
            }
            return String(val);
        };

        // 2. Tạo nội dung các dòng dữ liệu với viền sắc nét 1pt và font Segoe UI / Arial chuẩn
        const fontFamilyInline = "font-family: 'Segoe UI', Calibri, Arial, sans-serif;";
        const borderDark = "border: 1pt solid #000000;";

        const rowsHtml = danhSachXuat.map((dh, idx) => {
            const bgRow = idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
            const maHienThi = dh.ma_don_hang || `LPN-${String(idx + 1).padStart(4, '0')}`;
            const ngayTao = formatNgay(dh.ngay_tao || dh.createdAt);
            const hoTen = dh.thong_tin_giao_hang?.ho_ten || dh.thong_tin_giao_hang?.ho_va_ten || 'Khách vãng lai';
            const sdt = dh.thong_tin_giao_hang?.so_dien_thoai || 'Chưa cập nhật';
            const email = dh.thong_tin_giao_hang?.email || 'Chưa có email';
            const diaChi = dh.thong_tin_giao_hang?.dia_chi_chi_tiet || 'Nhận trực tiếp tại showroom';

            // Chi tiết mặt hàng
            const danhSachSpText = (dh.danh_sach_san_pham && dh.danh_sach_san_pham.length > 0)
                ? dh.danh_sach_san_pham.map(p => `${p.ten_san_pham || 'Laptop'} (SL: ${p.so_luong || 1})`).join('; ')
                : 'Laptop Gaming & Phụ kiện';
            const tongSlSp = dh.danh_sach_san_pham?.reduce((acc, p) => acc + (Number(p.so_luong) || 1), 0) || 1;

            // Số tiền định dạng chuẩn kế toán Việt Nam
            const tienHang = Number(dh.tong_tien) || (Number(dh.tong_tien_thanh_toan) + (Number(dh.tien_giam_gia) || 0)) || 0;
            const tienGiam = Number(dh.tien_giam_gia) || 0;
            const thucThu = Number(dh.tong_tien_thanh_toan) || Number(dh.tong_tien) || 0;

            // Hình thức thanh toán
            const hinhThucTT = dh.hinh_thuc_thanh_toan === 'chuyen_khoan_vietqr' ? 'Chuyển khoản VietQR Pro' : 'Tiền mặt khi nhận (COD)';

            // Tình trạng thanh toán với màu nền nổi bật và viền rõ
            const tinhTrangTTHtml = dh.da_thanh_toan
                ? `<td style="background-color:#DCFCE7; color:#15803D; font-weight:bold; text-align:center; ${borderDark} ${fontFamilyInline} font-size:9.5pt; white-space:nowrap;">ĐÃ THANH TOÁN</td>`
                : `<td style="background-color:#FFEDD5; color:#C2410C; font-weight:bold; text-align:center; ${borderDark} ${fontFamilyInline} font-size:9.5pt; white-space:nowrap;">THU TIỀN KHI GIAO (COD)</td>`;

            // Trạng thái vận chuyển với màu nền nổi bật và viền rõ
            let trangThaiHtml = '';
            if (dh.trang_thai === 'da_giao') {
                trangThaiHtml = `<td style="background-color:#DCFCE7; color:#15803D; font-weight:bold; text-align:center; ${borderDark} ${fontFamilyInline} font-size:9.5pt; white-space:nowrap;">Giao thành công</td>`;
            } else if (dh.trang_thai === 'dang_giao') {
                trangThaiHtml = `<td style="background-color:#E0F2FE; color:#0369A1; font-weight:bold; text-align:center; ${borderDark} ${fontFamilyInline} font-size:9.5pt; white-space:nowrap;">Đang giao hàng</td>`;
            } else if (dh.trang_thai === 'da_xac_nhan') {
                trangThaiHtml = `<td style="background-color:#DBEAFE; color:#1D4ED8; font-weight:bold; text-align:center; ${borderDark} ${fontFamilyInline} font-size:9.5pt; white-space:nowrap;">Đã xác nhận đơn</td>`;
            } else if (dh.trang_thai === 'da_huy') {
                trangThaiHtml = `<td style="background-color:#FEE2E2; color:#DC2626; font-weight:bold; text-align:center; ${borderDark} ${fontFamilyInline} font-size:9.5pt; white-space:nowrap;">Đã hủy đơn</td>`;
            } else {
                trangThaiHtml = `<td style="background-color:#FEF3C7; color:#B45309; font-weight:bold; text-align:center; ${borderDark} ${fontFamilyInline} font-size:9.5pt; white-space:nowrap;">Chờ xác nhận</td>`;
            }

            const ghiChu = dh.thong_tin_giao_hang?.ghi_chu || '-';

            return `
                <tr style="background-color: ${bgRow};">
                    <td style="${borderDark} text-align:center; ${fontFamilyInline} font-size:9.5pt;">${idx + 1}</td>
                    <td style="${borderDark} text-align:center; font-weight:bold; color:#1D4ED8; ${fontFamilyInline} font-size:9.5pt; white-space:nowrap;">${maHienThi}</td>
                    <td style="${borderDark} text-align:center; ${fontFamilyInline} font-size:9.5pt; white-space:nowrap;">${ngayTao}</td>
                    <td style="${borderDark} font-weight:bold; color:#0F172A; ${fontFamilyInline} font-size:9.5pt; white-space:nowrap;">${hoTen}</td>
                    <td style="${borderDark} text-align:center; color:#047857; font-weight:bold; ${fontFamilyInline} font-size:9.5pt; white-space:nowrap; mso-number-format:'\\@';">${sdt}</td>
                    <td style="${borderDark} color:#475569; ${fontFamilyInline} font-size:9.5pt; white-space:nowrap;">${email}</td>
                    <td style="${borderDark} ${fontFamilyInline} font-size:9.5pt;">${diaChi}</td>
                    <td style="${borderDark} text-align:center; font-weight:bold; ${fontFamilyInline} font-size:9.5pt;">${tongSlSp}</td>
                    <td style="${borderDark} ${fontFamilyInline} font-size:9.5pt;">${danhSachSpText}</td>
                    <td style="${borderDark} text-align:right; font-weight:bold; color:#0F172A; ${fontFamilyInline} font-size:9.5pt; white-space:nowrap;">${fmtVND(tienHang)}</td>
                    <td style="${borderDark} text-align:right; font-weight:bold; color:#15803D; ${fontFamilyInline} font-size:9.5pt; white-space:nowrap;">${fmtVND(tienGiam)}</td>
                    <td style="${borderDark} text-align:right; font-weight:bold; color:#DC2626; font-size:10.5pt; ${fontFamilyInline} white-space:nowrap;">${fmtVND(thucThu)}</td>
                    <td style="${borderDark} text-align:center; font-weight:600; ${fontFamilyInline} font-size:9.5pt; white-space:nowrap;">${hinhThucTT}</td>
                    ${tinhTrangTTHtml}
                    ${trangThaiHtml}
                    <td style="${borderDark} font-style:italic; color:#64748B; ${fontFamilyInline} font-size:9pt;">${ghiChu}</td>
                </tr>
            `;
        }).join('');

        // 3. Xây dựng tài liệu Excel hoàn chỉnh với font Segoe UI / Calibri / Arial, viền đen sắc nét
        const excelTemplate = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                <!--[if gte mso 9]>
                <xml>
                    <x:ExcelWorkbook>
                        <x:ExcelWorksheets>
                            <x:ExcelWorksheet>
                                <x:Name>Báo Cáo Kế Toán Đơn Hàng</x:Name>
                                <x:WorksheetOptions>
                                    <x:DisplayGridlines/>
                                    <x:Selected/>
                                </x:WorksheetOptions>
                            </x:ExcelWorksheet>
                        </x:ExcelWorksheets>
                    </x:ExcelWorkbook>
                </xml>
                <![endif]-->
                <style>
                    body, table, td, th, div, span, p {
                        font-family: 'Segoe UI', Calibri, Arial, sans-serif;
                        color: #0F172A;
                    }
                    table {
                        border-collapse: collapse;
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                    }
                    .th-header {
                        background-color: #1E3A8A;
                        color: #FFFFFF;
                        font-weight: bold;
                        text-align: center;
                        vertical-align: middle;
                        border: 1pt solid #000000;
                        padding: 10px 6px;
                        font-size: 10pt;
                        font-family: 'Segoe UI', Calibri, Arial, sans-serif;
                    }
                    .kpi-th-blue {
                        background-color: #1E3A8A;
                        color: #FFFFFF;
                        font-weight: bold;
                        font-size: 10pt;
                        text-align: center;
                        padding: 8px;
                        border: 1pt solid #000000;
                        font-family: 'Segoe UI', Calibri, Arial, sans-serif;
                    }
                    .kpi-th-green {
                        background-color: #065F46;
                        color: #FFFFFF;
                        font-weight: bold;
                        font-size: 10pt;
                        text-align: center;
                        padding: 8px;
                        border: 1pt solid #000000;
                        font-family: 'Segoe UI', Calibri, Arial, sans-serif;
                    }
                    .kpi-td-label {
                        background-color: #F8FAFC;
                        font-weight: 600;
                        padding: 7px 10px;
                        border: 1pt solid #000000;
                        font-size: 9.5pt;
                        color: #1E293B;
                        font-family: 'Segoe UI', Calibri, Arial, sans-serif;
                    }
                    .kpi-td-val {
                        font-weight: bold;
                        text-align: right;
                        padding: 7px 10px;
                        border: 1pt solid #000000;
                        font-size: 10pt;
                        font-family: 'Segoe UI', Calibri, Arial, sans-serif;
                        white-space: nowrap;
                    }
                </style>
            </head>
            <body style="font-family: 'Segoe UI', Calibri, Arial, sans-serif;">
                <table border="1" bordercolor="#000000" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%; border: 1.5pt solid #000000; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">
                    <!-- PHẦN 1: THÔNG TIN DOANH NGHIỆP / CÔNG TY (LETTERHEAD) -->
                    <tr>
                        <td colspan="16" style="font-size: 14pt; font-weight: bold; color: #1E3A8A; padding: 6px 0; border: none; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">
                            CÔNG TY CỔ PHẦN CÔNG NGHỆ & BÁN LẺ TNTP LAPTOP VIỆT NAM
                        </td>
                    </tr>
                    <tr>
                        <td colspan="16" style="font-size: 9.5pt; color: #475569; border: none; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">
                            Trụ sở chính: Số 85 Đại Lộ Hòa Bình, P.Tân An, Q.Ninh Kiều, TP. Cần Thơ &nbsp;|&nbsp; Hotline kinh doanh: 0976.543.210
                        </td>
                    </tr>
                    <tr>
                        <td colspan="16" style="font-size: 9.5pt; color: #475569; border: none; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">
                            Mã Số Thuế (MST): 0108923456 &nbsp;|&nbsp; Website: https://laptopnew.vn &nbsp;|&nbsp; Bộ phận: Phòng Kế Toán & Quản Trị Đơn Hàng
                        </td>
                    </tr>
                    <tr><td colspan="16" style="height: 8px; border: none;"></td></tr>

                    <!-- PHẦN 2: BANNER TIÊU ĐỀ BÁO CÁO KẾ TOÁN (NỀN XANH SANG TRỌNG) -->
                    <tr>
                        <td colspan="16" style="font-size: 16pt; font-weight: bold; color: #FFFFFF; text-align: center; background-color: #1E3A8A; padding: 14px; border: 1.5pt solid #000000; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">
                            BẢNG BÁO CÁO KẾ TOÁN CHI TIẾT ĐƠN HÀNG & DOANH THU KINH DOANH
                        </td>
                    </tr>
                    <tr>
                        <td colspan="16" style="font-size: 9.5pt; font-style: italic; color: #334155; text-align: center; background-color: #F1F5F9; padding: 6px; border: 1pt solid #000000; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">
                            Kỳ báo cáo: Năm 2026 &nbsp;|&nbsp; Thời gian kết xuất: ${thoiGianXuat} &nbsp;|&nbsp; Người lập biểu: Quản Trị Viên Hệ Thống (admin@laptopnew.vn)
                        </td>
                    </tr>
                    <tr><td colspan="16" style="height: 12px; border: none;"></td></tr>

                    <!-- PHẦN 3: BẢNG TỔNG HỢP CHỈ TIÊU KẾ TOÁN (16 CỘT KHÉP KÍN, VIỀN ĐEN RÕ NÉT) -->
                    <tr>
                        <td colspan="5" class="kpi-th-blue">CHỈ TIÊU VẬN HÀNH & ĐƠN HÀNG</td>
                        <td colspan="3" class="kpi-th-blue">SỐ LƯỢNG</td>
                        <td colspan="5" class="kpi-th-green">CHỈ TIÊU TÀI CHÍNH & DOANH THU</td>
                        <td colspan="3" class="kpi-th-green">SỐ TIỀN THỰC TẾ (VNĐ)</td>
                    </tr>
                    <tr>
                        <td colspan="5" class="kpi-td-label">Tổng số lượng đơn hàng theo bộ lọc:</td>
                        <td colspan="3" class="kpi-td-val" style="color:#1D4ED8;">${tongSoDon} đơn</td>
                        <td colspan="5" class="kpi-td-label">Tổng giá trị tiền hàng niêm yết:</td>
                        <td colspan="3" class="kpi-td-val" style="color:#0F172A;">${fmtVND(tongTienHang)}</td>
                    </tr>
                    <tr>
                        <td colspan="5" class="kpi-td-label">Đơn hàng đã giao thành công:</td>
                        <td colspan="3" class="kpi-td-val" style="color:#15803D;">${soDonGiaoThanhCong} đơn</td>
                        <td colspan="5" class="kpi-td-label">Tổng tiền chiết khấu / voucher khuyến mãi:</td>
                        <td colspan="3" class="kpi-td-val" style="color:#15803D;">${fmtVND(tongTienGiamGia)}</td>
                    </tr>
                    <tr>
                        <td colspan="5" class="kpi-td-label">Đơn hàng đang vận chuyển & xử lý:</td>
                        <td colspan="3" class="kpi-td-val" style="color:#D97706;">${soDonDangGiao + soDonDangXuLy} đơn</td>
                        <td colspan="5" class="kpi-td-label" style="background-color:#FEF08A; font-weight:bold; color:#854D0E;">TỔNG DOANH SỐ THỰC THU:</td>
                        <td colspan="3" class="kpi-td-val" style="background-color:#FEF08A; color:#DC2626; font-size:11pt; font-weight:bold;">${fmtVND(tongDoanhThuThucThu)}</td>
                    </tr>
                    <tr>
                        <td colspan="5" class="kpi-td-label">Số đơn đã hoàn tất thanh toán:</td>
                        <td colspan="3" class="kpi-td-val" style="color:#059669;">${soDonDaThanhToan} đơn</td>
                        <td colspan="5" class="kpi-td-label">Tiền đã thực thu (VietQR / Chuyển khoản):</td>
                        <td colspan="3" class="kpi-td-val" style="color:#047857;">${fmtVND(tongTienDaThu)}</td>
                    </tr>
                    <tr>
                        <td colspan="5" class="kpi-td-label">Số đơn chưa thu tiền (COD tiền mặt):</td>
                        <td colspan="3" class="kpi-td-val" style="color:#DC2626;">${soDonChuaThanhToan} đơn</td>
                        <td colspan="5" class="kpi-td-label">Tiền còn phải thu khi giao hàng (Thu hộ COD):</td>
                        <td colspan="3" class="kpi-td-val" style="color:#DC2626;">${fmtVND(tongTienConPhaiThuCOD)}</td>
                    </tr>
                    <tr><td colspan="16" style="height: 14px; border: none;"></td></tr>

                    <!-- PHẦN 4: TIÊU ĐỀ CÁC CỘT CHI TIẾT BẢNG BÁO CÁO (NỀN XANH NAVY ĐẬM, VIỀN RÕ) -->
                    <tr>
                        <th class="th-header" style="width: 45px;">STT</th>
                        <th class="th-header" style="width: 130px;">MÃ ĐƠN HÀNG</th>
                        <th class="th-header" style="width: 140px;">NGÀY TẠO ĐƠN</th>
                        <th class="th-header" style="width: 180px;">TÊN KHÁCH HÀNG</th>
                        <th class="th-header" style="width: 125px;">SỐ ĐIỆN THOẠI</th>
                        <th class="th-header" style="width: 190px;">EMAIL LIÊN HỆ</th>
                        <th class="th-header" style="width: 260px;">ĐỊA CHỈ NHẬN HÀNG</th>
                        <th class="th-header" style="width: 70px;">SL SP</th>
                        <th class="th-header" style="width: 280px;">CHI TIẾT SẢN PHẨM</th>
                        <th class="th-header" style="width: 145px;">TỔNG TIỀN HÀNG</th>
                        <th class="th-header" style="width: 130px;">GIẢM GIÁ (VNĐ)</th>
                        <th class="th-header" style="width: 150px;">THỰC THU (VNĐ)</th>
                        <th class="th-header" style="width: 150px;">HÌNH THỨC TT</th>
                        <th class="th-header" style="width: 160px;">TÌNH TRẠNG TT</th>
                        <th class="th-header" style="width: 160px;">TRẠNG THÁI GIAO</th>
                        <th class="th-header" style="width: 160px;">GHI CHÚ ĐƠN</th>
                    </tr>

                    <!-- PHẦN 5: DỮ LIỆU CÁC DÒNG ĐƠN HÀNG (VIỀN ĐEN SẮC NÉT, ĐỊNH DẠNG TIỀN VNĐ CHUẨN) -->
                    ${rowsHtml}

                    <!-- PHẦN 6: DÒNG TỔNG CỘNG DOANH THU KẾ TOÁN (NỀN VÀNG KIM SANG TRỌNG, VIỀN ĐẬM) -->
                    <tr style="background-color: #FEF08A;">
                        <td colspan="9" style="background-color: #FEF08A; font-weight: bold; text-align: right; padding: 12px 8px; font-size: 11pt; border: 1.5pt solid #000000; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">
                            TỔNG CỘNG DOANH THU TOÀN BỘ ĐƠN HÀNG (${tongSoDon} ĐƠN):
                        </td>
                        <td style="background-color: #FEF08A; font-weight: bold; text-align: right; color: #0F172A; font-size: 11pt; border: 1.5pt solid #000000; font-family: 'Segoe UI', Calibri, Arial, sans-serif; white-space: nowrap;">
                            ${fmtVND(tongTienHang)}
                        </td>
                        <td style="background-color: #FEF08A; font-weight: bold; text-align: right; color: #15803D; font-size: 11pt; border: 1.5pt solid #000000; font-family: 'Segoe UI', Calibri, Arial, sans-serif; white-space: nowrap;">
                            ${fmtVND(tongTienGiamGia)}
                        </td>
                        <td style="background-color: #FEF08A; font-weight: bold; text-align: right; color: #DC2626; font-size: 12pt; border: 1.5pt solid #000000; font-family: 'Segoe UI', Calibri, Arial, sans-serif; white-space: nowrap;">
                            ${fmtVND(tongDoanhThuThucThu)}
                        </td>
                        <td colspan="4" style="background-color: #FEF08A; font-weight: bold; text-align: center; font-size: 10pt; border: 1.5pt solid #000000; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">
                            Đã thanh toán: ${soDonDaThanhToan} đơn &nbsp;|&nbsp; Thu COD: ${soDonChuaThanhToan} đơn
                        </td>
                    </tr>
                    <tr><td colspan="16" style="height: 25px; border: none;"></td></tr>

                    <!-- PHẦN 7: KHỐI CHỮ KÝ BÁO CÁO KẾ TOÁN -->
                    <tr>
                        <td colspan="5" style="font-weight: bold; text-align: center; font-size: 10pt; color: #0F172A; border: none; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">
                            NGƯỜI LẬP BÁO CÁO
                        </td>
                        <td colspan="6" style="font-weight: bold; text-align: center; font-size: 10pt; color: #0F172A; border: none; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">
                            KẾ TOÁN TRƯỞNG
                        </td>
                        <td colspan="5" style="font-weight: bold; text-align: center; font-size: 10pt; color: #0F172A; border: none; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">
                            GIÁM ĐỐC / ĐẠI DIỆN PHÁP LUẬT
                        </td>
                    </tr>
                    <tr>
                        <td colspan="5" style="font-style: italic; text-align: center; font-size: 9pt; color: #64748B; border: none; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">
                            (Ký, ghi rõ họ tên)
                        </td>
                        <td colspan="6" style="font-style: italic; text-align: center; font-size: 9pt; color: #64748B; border: none; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">
                            (Ký, ghi rõ họ tên)
                        </td>
                        <td colspan="5" style="font-style: italic; text-align: center; font-size: 9pt; color: #64748B; border: none; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">
                            (Ký, đóng dấu công ty)
                        </td>
                    </tr>
                    <tr><td colspan="16" style="height: 60px; border: none;"></td></tr>
                    <tr>
                        <td colspan="5" style="text-align: center; font-weight: bold; color: #1E3A8A; font-size: 10pt; border: none; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">
                            Quản Trị Viên Hệ Thống
                        </td>
                        <td colspan="6" style="text-align: center; font-weight: bold; color: #1E3A8A; font-size: 10pt; border: none; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">
                            Phòng Kế Toán Tài Chính
                        </td>
                        <td colspan="5" style="text-align: center; font-weight: bold; color: #1E3A8A; font-size: 10pt; border: none; font-family: 'Segoe UI', Calibri, Arial, sans-serif;">
                            Ban Giám Đốc TNTP Laptop
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        // 4. Xuất file với định dạng chuẩn Microsoft Excel (.xls)
        const blob = new Blob(['\uFEFF' + excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const tenFile = `Bao_Cao_Ke_Toan_Don_Hang_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${now.getTime().toString().slice(-4)}.xls`;
        link.download = tenFile;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        hienThongBao(`Đã kết xuất thành công bảng báo cáo kế toán Excel (${danhSachXuat.length} đơn hàng)!`);
    };

    const { danhSachHangThucTe, danhSachLoaiSanPham, sanPhamHienThi, moModalThemSp, moModalSuaSp, xayThongSoTheoLoai, sanPhamXemTruoc, dacDiemNoiBatXemTruoc, tuyChonHienTaiXemTruoc, giaHienTaiXemTruoc, giaGocHienTaiXemTruoc, tienTietKiemXemTruoc, xuLyLuuSanPham } = useSanPhamController({
        setSpDangSua,
        setFormSpGoc,
        setThongSoTuyChinhGoc,
        setTabModalSp,
        setLoaiFormSanPham,
        setThongSoTuyChinh,
        setFormSp,
        lamTrongFormSp,
        setDangMoModalSp,
        xacDinhLoaiSanPham,
        TU_DIEN_THONG_SO_ADMIN,
        layTenHienThiKey,
        spDangSua,
        formSp,
        loaiFormSanPham,
        thongSoTuyChinh,
        chuyenKeySangSlug,
        tuyChonXemTruoc,
        danhSachSanPham, tuKhoaGlobal, tuKhoaSanPham, locNganhHang, locHangSanPham, locTonKhoSanPham, sapXepSanPham,
        canhBao,
        danhSachDanhMuc,
        setDangLuuSp,
        hienThongBao,
        taiDuLieuToanBo
    });

    // Handler dùng chung cho các hàm "Xóa" và "Toggle trường boolean" của trang Admin
    // (gộp logic lặp lại — xem @/app/admin/hooks/useXuLyAdmin.js)
    const thucHienXoaAdmin = taoHandlerXoa({ xacNhan, canhBao, hienThongBao, taiLaiDuLieu: taiDuLieuToanBo });
    const thucHienToggleAdmin = taoHandlerToggleTruong({ hienThongBao });

    const xuLyXoaSanPham = (id, ten) => thucHienXoaAdmin({
        id,
        tieuDeXacNhan: 'Xóa Sản Phẩm Khỏi Hệ Thống?',
        noiDungXacNhan: `Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm:\n"${ten}"?\n\nThao tác này không thể hoàn tác.`,
        xoaApi: () => SanPhamService.xoaSanPham(id),
        thongBaoThanhCong: `Đã xóa sản phẩm "${ten}" thành công!`,
        tieuDeLoi: 'Không Thể Xóa Sản Phẩm',
        setDangXuLy: setDangXuLySpId
    });

    const xuLyToggleConHang = (sp) => thucHienToggleAdmin({
        item: sp,
        truong: 'con_hang',
        giaTriHienTai: sp.con_hang !== false,
        setDanhSach: setDanhSachSanPham,
        apiCapNhat: (id, patch) => SanPhamService.capNhatSanPham(id, patch),
        thongBaoBat: `Đã mở bán: "${rutGonTen(sp.ten_san_pham, 48)}"`,
        thongBaoTat: `Đã tạm ẩn: "${rutGonTen(sp.ten_san_pham, 48)}"`,
        nhom: 'Trạng Thái Sản Phẩm'
    });

    const xuLyToggleFlashSale = (sp) => thucHienToggleAdmin({
        item: sp,
        truong: 'la_flash_sale',
        giaTriHienTai: Boolean(sp.la_flash_sale),
        setDanhSach: setDanhSachSanPham,
        apiCapNhat: (id, patch) => SanPhamService.capNhatSanPham(id, patch),
        thongBaoBat: `Đã kích hoạt Flash Sale: "${rutGonTen(sp.ten_san_pham, 48)}"`,
        thongBaoTat: `Đã tắt Flash Sale: "${rutGonTen(sp.ten_san_pham, 48)}"`,
        nhom: 'Flash Sale & Hot Deal',
        loaiBat: 'deal'
    });

    const { xuLyLuuCaiDatKm, xuLyKhoiPhucCaiDatKm, chonNhanhHanKetThuc, chonCuoiTuan, chonCuoiThang } = useKhuyenMaiController({
        setDangLuuKm,
        formCaiDatKm,
        setCaiDatKm,
        setFormCaiDatKm,
        hienThongBao,
        canhBao,
        xacNhan
    });

    // ==========================================
    // HÀM XỬ LÝ ĐƠN HÀNG
    // ==========================================
    const { donHangHienThi, moModalTaoDonHang, moModalSuaDonHang, themDongSanPhamDonHang, xoaDongSanPhamDonHang, capNhatDongSanPhamDonHang, xuLyLuuDonHang, xuLyDoiTrangThaiDonHang, xuLyDoiTrangThaiThanhToan, xuLyXoaDonHang } = useDonHangController({
        danhSachDonHang, tuKhoaGlobal, locTrangThaiDonHang, locThanhToanDonHang, locThoiGianDonHang, locNgayCuThe, sapXepDonHang,
        setDonHangDangSua,
        setFormDonHang,
        danhSachSanPham,
        setDangMoModalDonHang,
        setDangLuuDonHang,
        donHangDangSua,
        formDonHang,
        hienThongBao,
        danhSachVoucher,
        taiDuLieuToanBo,
        canhBao,
        setDangXuLyDonHangId,
        thucHienXoaAdmin
    });

    // ==========================================
    // HÀM XỬ LÝ HÃNG & THƯƠNG HIỆU
    // ==========================================
    const { danhMucHienThi, moModalThemDanhMuc, moModalSuaDanhMuc, xuLyLuuDanhMuc, xuLyToggleDanhMuc, xuLyXoaDanhMuc } = useDanhMucController({
        setDmDangSua,
        setFormDm,
        locLoaiDanhMuc,
        danhSachDanhMuc,
        setDangMoModalDanhMuc,
        setDangLuuDanhMuc,
        formDm,
        dmDangSua,
        hienThongBao,
        taiDuLieuToanBo,
        canhBao,
        thucHienToggleAdmin,
        setDanhSachDanhMuc,
        thucHienXoaAdmin,
        setDangXuLyDmId
    });

    // ==========================================
    // HÀM XỬ LÝ KHÁCH HÀNG & THÀNH VIÊN (NGÀY GIỜ CHUẨN VIỆT NAM)
    // ==========================================
    const { danhSachKhachHangKemDoanhThu, khachHangHienThi, layChiTietThoiGianKhachHang, layNgayTaoKhachHang, moModalThemUser, taoMatKhauNgauNhien, moModalSuaUser, xuLyLuuUser, xuLyKhoaNguoiDung, xuLyXoaUser, xuLyDoiVaiTroNguoiDung } = useKhachHangController({
        danhSachNguoiDung, danhSachDonHang, tuKhoaKhachHang, locKhachHang, sapXepKhachHang,
        setUserDangSua,
        setFormUser,
        setDangMoModalUser,
        setDangLuuUser,
        formUser,
        userDangSua,
        hienThongBao,
        setDanhSachNguoiDung,
        canhBao,
        xacNhan,
        setDangXuLyUserId
    });

    // ==========================================
    // HÀM XỬ LÝ VOUCHER
    // ==========================================
    const { voucherHienThi, moModalThemVoucher, moModalSuaVoucher, xuLyLuuVoucher, xuLyToggleVoucher, xuLyXoaVoucher } = useVoucherController({
        danhSachVoucher, tuKhoaVoucher, locTrangThaiVoucher,
        setVoucherDangSua,
        setFormVoucher,
        setDangMoModalVoucher,
        setDangLuuVoucher,
        formVoucher,
        voucherDangSua,
        hienThongBao,
        taiDuLieuToanBo,
        canhBao,
        thucHienToggleAdmin,
        setDanhSachVoucher,
        thucHienXoaAdmin,
        setDangXuLyVoucherId
    });

    // ==========================================
    // HÀM XỬ LÝ TIN TỨC & BÀI VIẾT
    // ==========================================
    const { tinTucHienThi, moModalThemTinTuc, moModalSuaTinTuc, moModalSuaTin, xuLyLuuTinTuc, xuLyToggleXuatBanTinTuc, xuLyToggleTieuDiemTinTuc, xuLyXoaTinTuc } = useTinTucController({
        danhSachTinTuc, tuKhoaTinTuc, locChuyenMucTinTuc, locTrangThaiTinTuc,
        setTinTucDangSua,
        setFormTinTuc,
        setDangMoModalTinTuc,
        setDangLuuTinTuc,
        formTinTuc,
        tinTucDangSua,
        hienThongBao,
        taiDuLieuToanBo,
        canhBao,
        thucHienToggleAdmin,
        setDanhSachTinTuc,
        rutGonTen,
        thucHienXoaAdmin,
        setDangXuLyTinTucId
    });

    // ==========================================
    // GIAO DIỆN CHÍNH ADMIN (7 TABS HOÀN THIỆN)
    // (Cổng xác thực quyền truy cập Admin đã được xử lý tại app/admin/layout.jsx -
    //  layout chặn & redirect trước khi component này được render, nên các khối
    //  kiểm tra đăng nhập/quyền admin trước đây tại đây không bao giờ thực thi và đã được dọn bỏ)
    // ==========================================

    // Props truyền cho Tab "Tổng Quan" (component tách riêng để giảm phình file admin/page.jsx)
    const thongSoTongQuanTab = { nguoiDung, moModalThemSp, moModalTaoDonHang, moModalThemTinTuc, moModalThemVoucher, setTabHienTai, thongKe, dangTai, danhSachDonHang, danhSachSanPham, dinhDangTienVND, xacDinhLoaiSanPham, setDonHangChiTiet, topSanPhamBanChay };

    // Props truyền cho Tab "Cấu Hình Banner & Khuyến Mãi" (component tách riêng để giảm phình file admin/page.jsx)
    const thongSoCauHinhKhuyenMai = { xuLyKhoiPhucCaiDatKm, xuLyLuuCaiDatKm, formCaiDatKm, setFormCaiDatKm, conLaiKm, chonNhanhHanKetThuc, chonCuoiTuan, chonCuoiThang, dangLuuKm };

    // Props truyền cho Tab "Cấu Hình Showroom & Tọa Độ GPS Bản Đồ" (component tách riêng để giảm phình file admin/page.jsx)
    const thongSoCauHinhShowroom = { xuLyThemShowroomMoi, dangLuuShowroom, xuLyLuuShowroom, danhSachShowroomAdmin, showroomDangXemTruoc, setShowroomDangXemTruoc, xuLyXoaShowroom, xuLyDatLamMacDinh, xuLyThayDoiShowroom };

    // Props truyền cho Tab "Danh Mục / Thương Hiệu" (component tách riêng để giảm phình file admin/page.jsx)
    const thongSoQuanLyDanhMuc = { danhMucHienThi, locLoaiDanhMuc, setLocLoaiDanhMuc, danhSachDanhMuc, danhSachSanPham, tuKhoaDanhMuc, setTuKhoaDanhMuc, moModalThemDanhMuc, dangTai, dangLocDanhMuc, dangXuLyDmId, dangLuuDanhMuc, xuLyToggleDanhMuc, moModalSuaDanhMuc, xuLyXoaDanhMuc };

    const thongSoModalThuongHieu = { dangMoModalDanhMuc, setDangMoModalDanhMuc, dmDangSua, formDm, setFormDm, xuLyLuuDanhMuc, dangLuuDanhMuc };

    // Props truyền cho Tab "Mã Khuyến Mãi & Voucher" (component tách riêng để giảm phình file admin/page.jsx)
    const thongSoQuanLyVoucher = { danhSachVoucher, voucherHienThi, tuKhoaVoucher, setTuKhoaVoucher, locTrangThaiVoucher, setLocTrangThaiVoucher, moModalThemVoucher, dangTai, dangLocVoucher, dangXuLyVoucherId, xuLyToggleVoucher, moModalSuaVoucher, xuLyXoaVoucher };

    const thongSoModalVoucher = { dangMoModalVoucher, setDangMoModalVoucher, voucherDangSua, formVoucher, setFormVoucher, xuLyLuuVoucher, dangLuuVoucher };

    // Props truyền cho Tab "Tin Tức & Bài Viết" (component tách riêng để giảm phình file admin/page.jsx)
    const thongSoModalTinTuc = { dangMoModalTinTuc, setDangMoModalTinTuc, tinTucDangSua, formTinTuc, setFormTinTuc, xuLyLuuTinTuc, dangLuuTinTuc, xuLyUploadAnhTinTuc };

    const thongSoQuanLyTinTuc = { danhSachTinTuc, thongKe, tuKhoaTinTuc, setTuKhoaTinTuc, locChuyenMucTinTuc, setLocChuyenMucTinTuc, locTrangThaiTinTuc, setLocTrangThaiTinTuc, moModalThemTinTuc, tinTucHienThi, dangTai, dangLocTinTuc, dangXuLyTinTucId, xuLyToggleTieuDiemTinTuc, xuLyToggleXuatBanTinTuc, moModalSuaTinTuc, xuLyXoaTinTuc };

    // Props truyền cho Tab "Quản Lý Đơn Hàng" (component tách riêng để giảm phình file admin/page.jsx)
    const thongSoModalDonHang = { dangMoModalDonHang, setDangMoModalDonHang, donHangDangSua, formDonHang, setFormDonHang, xuLyLuuDonHang, dangLuuDonHang, danhSachSanPham, dinhDangTienVND, themDongSanPhamDonHang, capNhatDongSanPhamDonHang, xoaDongSanPhamDonHang };

    const thongSoModalChiTietDonHang = { donHangChiTiet, setDonHangChiTiet, inHoaDonBanHang, danhSachSanPham, dinhDangTienVND, xuLyDoiTrangThaiThanhToan, moModalSuaDonHang };

    const thongSoQuanLyDonHang = { danhSachDonHang, donHangHienThi, locTrangThaiDonHang, setLocTrangThaiDonHang, locThanhToanDonHang, setLocThanhToanDonHang, locThoiGianDonHang, setLocThoiGianDonHang, locNgayCuThe, setLocNgayCuThe, sapXepDonHang, setSapXepDonHang, moModalTaoDonHang, xuatExcelDonHang, dangTai, dangLocDonHang, dangXuLyDonHangId, setDonHangChiTiet, xuLyDoiTrangThaiThanhToan, xuLyDoiTrangThaiDonHang, moModalSuaDonHang, xuLyXoaDonHang };

    // Props truyền cho Tab "Kho Sản Phẩm" (component tách riêng để giảm phình file admin/page.jsx)
    const thongSoModalSanPham = { NhanDaSua,dangLuuSp,dangMoModalSp,danhSachHangThucTe,danhSachNhuCauLaptop: danhSachDanhMuc.filter(dm => dm.loai === 'nhu_cau' && dm.kich_hoat !== false).map(dm => ({ ma: dm.ma_danh_muc, ten: dm.ten_danh_muc })),demSoMucDaSua,dongModalSpAnToan,formSp,formSpGoc,hienOUrlAnhChinh,hienThongBao,layClassInput,layClassInputTuyChinh,loaiFormSanPham,setDangXemTruocCard,setFormSp,setHienOUrlAnhChinh,setLoaiFormSanPham,setModalXemAnh,setTabModalSp,setThongSoTuyChinh,spDangSua,tabModalSp,thongSoTuyChinh,xacNhan,xuLyLuuSanPham,xuLyUploadAnhBienThe,xuLyUploadAnhChinh,xuLyUploadAnhGallerySp };

    const thongSoOverlayXemSanPham = { daSoSanhXemTruoc,dacDiemNoiBatXemTruoc,dangXemTruocCard,giaGocHienTaiXemTruoc,giaHienTaiXemTruoc,kieuXemTruoc,modalXemAnh,sanPhamXemTruoc,setDaSoSanhXemTruoc,setDangXemTruocCard,setKieuXemTruoc,setModalXemAnh,setTabChiTietXemTruoc,setTuyChonXemTruoc,tabChiTietXemTruoc,tienTietKiemXemTruoc,tuyChonHienTaiXemTruoc };

    const thongSoQuanLySanPham = { locNganhHang, setLocNganhHang, locHangSanPham, setLocHangSanPham, danhSachSanPham, danhSachLoaiSanPham, thongKe, sanPhamHienThi, tuKhoaSanPham, setTuKhoaSanPham, moModalThemSp, locTonKhoSanPham, setLocTonKhoSanPham, sapXepSanPham, setSapXepSanPham, danhSachHangThucTe, dangTai, dangLocSanPham, layThongSoNhanhAdmin, dangXuLySpId, dangLuuSp, setModalXemAnh, xuLyToggleConHang, xuLyToggleFlashSale, moModalSuaSp, xuLyXoaSanPham };

    // Props truyền cho Tab "Quản Lý Khách Hàng" (component tách riêng để giảm phình file admin/page.jsx)
    const thongSoModalKhachHang = { dangMoModalUser, setDangMoModalUser, userDangSua, formUser, setFormUser, xuLyLuuUser, dangLuuUser };

    const thongSoQuanLyKhachHang = { danhSachNguoiDung, danhSachKhachHangKemDoanhThu, tuKhoaKhachHang, setTuKhoaKhachHang, locKhachHang, setLocKhachHang, sapXepKhachHang, setSapXepKhachHang, moModalThemUser, khachHangHienThi, dangTai, dangLocKhachHang, dangXuLyUserId, layChiTietThoiGianKhachHang, xuLyKhoaNguoiDung, xuLyDoiVaiTroNguoiDung, moModalSuaUser, xuLyXoaUser };


    return { nguoiDung, dangXuat, chu_de, chuyenDoiChuDe, khungNoiDungChinhRef, sidebarThuGon, setSidebarThuGon, sidebarMoMobile, setSidebarMoMobile, danhSachSanPham, danhSachDonHang, danhSachVoucher, danhSachDanhMuc, danhSachNguoiDung, danhSachTinTuc, dangTai, tuKhoaGlobal, setTuKhoaGlobal, danhSachShowroomAdmin, soLuongChuaXuLyLienHe, setSoLuongChuaXuLyLienHe, hopThoai, xacNhan, taiDuLieuToanBo, thongKe, thongSoTongQuanTab, thongSoCauHinhKhuyenMai, thongSoCauHinhShowroom, thongSoQuanLyDanhMuc, thongSoModalThuongHieu, thongSoQuanLyVoucher, thongSoModalVoucher, thongSoModalTinTuc, thongSoQuanLyTinTuc, thongSoModalDonHang, thongSoModalChiTietDonHang, thongSoQuanLyDonHang, thongSoModalSanPham, thongSoOverlayXemSanPham, thongSoQuanLySanPham, thongSoModalKhachHang, thongSoQuanLyKhachHang, tabHienTai, setTabHienTai };
}
