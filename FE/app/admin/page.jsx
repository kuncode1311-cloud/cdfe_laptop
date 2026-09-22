'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    LayoutDashboard,
    ShoppingBag,
    ShoppingCart,
    Star,
    Laptop,
    Layers,
    Users,
    Ticket,
    Newspaper,
    Search,
    Bell,
    Moon,
    Sun,
    Menu,
    ChevronRight,
    ChevronLeft,
    ArrowUpRight,
    TrendingUp,
    DollarSign,
    Package,
    CheckCircle2,
    Clock,
    Truck,
    XCircle,
    MessageSquare,
    Eye,
    Edit3,
    Trash2,
    Plus,
    X,
    Save,
    RotateCcw,
    SlidersHorizontal,
    FileSpreadsheet,
    MapPin,
    CreditCard,
    Sparkles,
    Check,
    ExternalLink,
    Lock,
    Unlock,
    Printer,
    AlertTriangle,
    ShieldCheck,
    Tag,
    ZoomIn,
    Palette,
    Maximize2,
    UserPlus,
    FolderPlus,
    BadgePercent,
    Flame,
    KeyRound,
    Cpu,
    HardDrive,
    Monitor,
    BatteryCharging,
    Weight,
    Percent,
    ImageIcon,
    Phone,
    Mail,
    User,
    CheckSquare,
    Square,
    Keyboard,
    Mouse,
    Headphones,
    Disc,
    Settings2,
    Sliders,
    ArrowUpDown,
    Filter,
    PlusCircle,
    MinusCircle,
    ChevronDown,
    Activity,
    ArrowDownRight,
    Boxes,
    Store,
    Calendar,
    BookOpen,
    Loader2,
    Briefcase,
    Zap,
    QrCode,
    Banknote,
    PackageCheck,
    Hash,
    FileText,
    Upload,
    Link2,
    Info,
    Gift,
    Heart,
    GitCompare,
    Play,
    Radio,
    Wifi,
    Usb,
    Barcode,
    Building2,
    CircleDollarSign,
    Shield
} from 'lucide-react';
import { useAuth, useNguoiDung } from '@/contexts/AuthContext';
import { useTheme, useGiaoDien } from '@/contexts/ThemeContext';
import { SanPhamService } from '@/services/san-pham.service';
import { DonHangService } from '@/services/don-hang.service';
import { MaGiamGiaService } from '@/services/ma-giam-gia.service';
import { DanhMucService } from '@/services/danh-muc.service';
import { NguoiDungService } from '@/services/nguoi-dung.service';
import { TinTucService } from '@/services/tin-tuc.service';
import { CaiDatService, CAI_DAT_KHUYEN_MAI_MAC_DINH, DANH_SACH_SHOWROOM_MAC_DINH } from '@/services/cai-dat.service';
import { formatCurrency, dinhDangTienVND } from '@/utils/formatCurrency';
import { taoSlug, slugTinTuc } from '@/utils/taoSlug';
import { inHoaDonBanHang } from '@/utils/inHoaDon';
import TheSanPham from '@/components/san-pham/TheSanPham';
import BangThongSoKyThuat from '@/components/san-pham/BangThongSoKyThuat';
import ThuVienAnhSanPham from '@/components/san-pham/ThuVienAnhSanPham';
import KhoHangChiNhanh from '@/components/san-pham/KhoHangChiNhanh';
import BieuDoTongQuan from '@/components/admin/BieuDoTongQuan';
import KhuVucDangTaiTable from '@/components/admin/KhuVucDangTaiTable';
import { toast } from 'sonner';

// Helper an toàn tránh runtime ReferenceError khi format tiền tệ
const dinhDangVND = (so) => dinhDangTienVND(Number(so) || 0);


export default function TrangQuanTriCuaHang() {
    const { nguoiDung, daDangNhap, laAdmin, dangNhap, dangXuat, dangKiemTraPhien } = useNguoiDung();
    const { chu_de, chuyenDoiChuDe } = useGiaoDien();

    // Điều hướng Tab: 9 Tabs Quản Trị Toàn Diện (Tự động ghi nhớ vị trí khi F5 reload)
    const [tabHienTai, setTabHienTai] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const tabUrl = urlParams.get('tab');
                const tabStorage = localStorage.getItem('admin_active_tab');
                const validTabs = ['tong_quan', 'don_hang', 'san_pham', 'danh_muc', 'khach_hang', 'voucher', 'tin_tuc', 'khuyen_mai', 'showroom'];
                if (validTabs.includes(tabUrl)) return tabUrl;
                if (validTabs.includes(tabStorage)) return tabStorage;
            } catch (e) {
                // Ignore
            }
        }
        return 'tong_quan';
    });

    // Đồng bộ Tab hiện tại với URL query params và LocalStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const tabUrl = urlParams.get('tab');
            const tabStorage = localStorage.getItem('admin_active_tab');
            const validTabs = ['tong_quan', 'don_hang', 'san_pham', 'danh_muc', 'khach_hang', 'voucher', 'tin_tuc', 'khuyen_mai', 'showroom'];

            const tabTarget = validTabs.includes(tabUrl)
                ? tabUrl
                : validTabs.includes(tabStorage)
                ? tabStorage
                : 'tong_quan';

            if (tabTarget && tabTarget !== tabHienTai) {
                setTabHienTai(tabTarget);
            }

            const handlePopState = () => {
                const params = new URLSearchParams(window.location.search);
                const t = params.get('tab');
                if (validTabs.includes(t)) {
                    setTabHienTai(t);
                }
            };
            window.addEventListener('popstate', handlePopState);
            return () => window.removeEventListener('popstate', handlePopState);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && tabHienTai) {
            localStorage.setItem('admin_active_tab', tabHienTai);
            const url = new URL(window.location.href);
            if (url.searchParams.get('tab') !== tabHienTai) {
                url.searchParams.set('tab', tabHienTai);
                window.history.replaceState({}, '', url.toString());
            }
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
    const [locLoaiDanhMuc, setLocLoaiDanhMuc] = useState('tat_ca'); // 'tat_ca' | 'thuong_hieu' | 'nhu_cau'

    // Bộ lọc Tin Tức
    const [tuKhoaTinTuc, setTuKhoaTinTuc] = useState('');
    const [locChuyenMucTinTuc, setLocChuyenMucTinTuc] = useState('tat_ca');
    const [locTrangThaiTinTuc, setLocTrangThaiTinTuc] = useState('tat_ca');

    // Cấu hình Banner & Chiến Dịch Khuyến Mãi (Dữ liệu động 100%)
    const [caiDatKm, setCaiDatKm] = useState(() => CaiDatService.layCaiDatKhuyenMai());
    const [formCaiDatKm, setFormCaiDatKm] = useState(() => CaiDatService.layCaiDatKhuyenMai());

    // Cấu hình Hệ Thống Showroom & Tọa Độ GPS Bản Đồ (Dữ liệu động 100%)
    const [danhSachShowroomAdmin, setDanhSachShowroomAdmin] = useState(DANH_SACH_SHOWROOM_MAC_DINH);
    const [dangLuuShowroom, setDangLuuShowroom] = useState(false);
    const [showroomDangXemTruoc, setShowroomDangXemTruoc] = useState(0);

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
    const [daThichXemTruoc, setDaThichXemTruoc] = useState(false);
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
            return `w-full px-3.5 py-2.5 rounded-xl border-2 border-amber-500 dark:border-amber-400 bg-amber-50 dark:bg-amber-950/50 text-amber-950 dark:text-amber-100 font-bold text-xs ring-2 ring-amber-400/30 focus:border-amber-600 focus:bg-amber-100/90 dark:focus:bg-amber-900/60 focus:outline-none transition-all shadow-xs ${extra}`;
        }
        return `w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-blue-50/60 dark:focus:bg-slate-800/80 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all ${extra}`;
    };

    // Style cho ô thông số tùy biến (Key - Value)
    const layClassInputTuyChinh = (idx, field, extra = '') => {
        if (!spDangSua || !thongSoTuyChinhGoc) {
            return `px-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-blue-50/60 dark:focus:bg-slate-800/80 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all ${extra}`;
        }
        const goc = thongSoTuyChinhGoc[idx];
        const hienTai = thongSoTuyChinh[idx];
        const daSua = !goc || (field === 'key' ? goc.key !== hienTai?.key : goc.value !== hienTai?.value);
        if (daSua) {
            return `px-3.5 py-2.5 rounded-xl border-2 border-amber-500 dark:border-amber-400 bg-amber-50 dark:bg-amber-950/50 text-amber-950 dark:text-amber-100 font-bold text-xs ring-2 ring-amber-400/30 focus:border-amber-600 focus:bg-amber-100/90 dark:focus:bg-amber-900/60 focus:outline-none transition-all shadow-xs ${extra}`;
        }
        return `px-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-blue-50/60 dark:focus:bg-slate-800/80 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all ${extra}`;
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

    // Ánh xạ ngược từ Tiếng Việt (có dấu hoặc không dấu) sang slug chuẩn lưu MongoDB
    const TU_DIEN_REVERSE_SLUG = {
        'chất liệu vỏ máy': 'chat_lieu_vo',
        'chất liệu vỏ': 'chat_lieu_vo',
        'bàn phím & đèn nền': 'ban_phim',
        'bàn phím': 'ban_phim',
        'chuẩn wi-fi & bluetooth': 'chuan_wifi_bluetooth',
        'chuẩn wifi & bluetooth': 'chuan_wifi_bluetooth',
        'chuẩn wi-fi': 'chuan_wifi_bluetooth',
        'chuẩn wifi': 'chuan_wifi_bluetooth',
        'công nghệ âm thanh': 'am_thanh',
        'âm thanh': 'am_thanh',
        'hệ điều hành tích hợp': 'he_dieu_hanh',
        'hệ điều hành': 'he_dieu_hanh',
        'cổng kết nối ngoại vi': 'cong_ket_noi',
        'cổng kết nối': 'cong_ket_noi',
        'tốc độ bus ram': 'toc_do_bus',
        'tốc độ bus': 'toc_do_bus',
        'khả năng nâng cấp ram': 'nang_cap_ram_toi_da',
        'nâng cấp ram': 'nang_cap_ram_toi_da',
        'khe cắm mở rộng ssd/m.2': 'khe_cam_mo_rong',
        'khe cắm mở rộng': 'khe_cam_mo_rong',
        'độ phân giải chuẩn': 'do_phan_giai',
        'độ phân giải': 'do_phan_giai',
        'công nghệ tấm nền': 'tam_nen',
        'tấm nền': 'tam_nen',
        'độ phủ gam màu': 'do_phu_mau',
        'độ phủ màu': 'do_phu_mau',
        'hệ thống tản nhiệt': 'chi_tiet_tan_nhiet',
        'tản nhiệt': 'chi_tiet_tan_nhiet',
        'tần số quét màn hình': 'tan_so_quet',
        'tần số quét': 'tan_so_quet',
        'độ sáng cực đại': 'do_sang_nits',
        'độ sáng': 'do_sang_nits',
        'công suất card đồ họa tgp': 'cong_suat_tgp',
        'công suất tgp': 'cong_suat_tgp',
        'công suất bộ sạc đi kèm': 'bo_sac_cong_suat',
        'công suất bộ sạc': 'bo_sac_cong_suat',
        'chế độ bảo hành chính hãng': 'che_do_bao_hanh',
        'chế độ bảo hành': 'che_do_bao_hanh',
        'bảo hành': 'che_do_bao_hanh'
    };

    const chuyenKeySangSlug = (rawKey) => {
        if (!rawKey) return '';
        const clean = rawKey.trim().toLowerCase();
        if (TU_DIEN_REVERSE_SLUG[clean]) {
            return TU_DIEN_REVERSE_SLUG[clean];
        }
        if (/^[a-z0-9_]+$/.test(clean)) {
            return clean;
        }
        return taoSlug(rawKey).replace(/-/g, '_');
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
        hang_san_xuat: 'asus',
        danh_muc: ['gaming'],
        gia_goc: 30000000,
        gia_khuyen_mai: 27990000,
        phan_tram_giam_gia: 10,
        hinh_anh_chinh: '/images/asus_rog_scar18.jpg',
        so_luong_ton_kho: 15,
        con_hang: true,
        la_flash_sale: false,
        la_ban_chay: false,
        la_san_pham_moi: true,
        mo_ta_chi_tiet: '',
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
        ho_tro_ray_tracing: true,
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

        che_do_bao_hanh: '24 tháng chính hãng'
    });

    const [dangMoModalDonHang, setDangMoModalDonHang] = useState(false);
    const [donHangDangSua, setDonHangDangSua] = useState(null);
    const [formDonHang, setFormDonHang] = useState({
        ho_ten: '',
        so_dien_thoai: '',
        email: '',
        dia_chi_chi_tiet: '',
        ghi_chu: 'Khách mua trực tiếp tại quầy',
        san_pham_id: '',
        so_luong: 1,
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
        matKhau: '123456',
        soDienThoai: '',
        hangThanhVien: 'Đồng',
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

    // Form Đăng nhập Admin
    const [emailAdmin, setEmailAdmin] = useState('');
    const [matKhauAdmin, setMatKhauAdmin] = useState('');
    const [loiLogin, setLoiLogin] = useState('');
    const [dangXuLyLogin, setDangXuLyLogin] = useState(false);

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
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (ev.target?.result) {
                setFormSp(prev => ({
                    ...prev,
                    hinh_anh_chinh: ev.target.result,
                    hinh_anh: ev.target.result
                }));
                hienThongBao('Đã tải ảnh đại diện từ máy tính lên thành công!');
            }
        };
        reader.readAsDataURL(file);
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
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (ev.target?.result) {
                const updated = [...(formSp.tuy_chon_phien_ban || [])];
                updated[bIdx] = { ...updated[bIdx], hinh_anh: ev.target.result };
                setFormSp(prev => ({ ...prev, tuy_chon_phien_ban: updated }));
                hienThongBao(`Đã tải ảnh cho biến thể #${bIdx + 1} từ máy tính thành công!`);
            }
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const taiDuLieuToanBo = async () => {
        setDangTai(true);
        try {
            const [sps, dhs, vcs, dms, us, tts] = await Promise.all([
                SanPhamService.layTatCaSanPhamAsync(),
                DonHangService.layTatCaDonHangAsync(),
                MaGiamGiaService.layDanhSachMaGiamGiaAsync(true),
                DanhMucService.layDanhSachDanhMucAsync(),
                NguoiDungService.layDanhSachNguoiDungAsync(),
                TinTucService.layDanhSachTinTucAsync({ tat_ca: true })
            ]);

            setDanhSachSanPham(sps || []);
            setDanhSachDonHang(dhs || []);
            setDanhSachVoucher(vcs || []);
            setDanhSachDanhMuc(dms || []);
            setDanhSachNguoiDung(us || []);
            setDanhSachTinTuc(tts || []);

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

    const xuLyDangNhapAdmin = async (e) => {
        e.preventDefault();
        setLoiLogin('');
        setDangXuLyLogin(true);
        try {
            const user = await dangNhap(emailAdmin, matKhauAdmin);
            if (user?.vaiTro !== 'admin') {
                setLoiLogin('Tài khoản này không có quyền Quản trị viên!');
            } else {
                hienThongBao('Xin chào Quản Trị Viên! Đăng nhập thành công.');
            }
        } catch (err) {
            setLoiLogin(err.message || 'Tài khoản hoặc mật khẩu không chính xác!');
        } finally {
            setDangXuLyLogin(false);
        }
    };

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

    const danhSachHangThucTe = useMemo(() => {
        const hangSet = new Map();
        danhSachDanhMuc.forEach(dm => {
            hangSet.set(dm.ma_danh_muc.toLowerCase(), dm.ten_danh_muc);
        });
        danhSachSanPham.forEach(sp => {
            if (sp.hang_san_xuat) {
                const key = sp.hang_san_xuat.toLowerCase();
                if (!hangSet.has(key)) {
                    hangSet.set(key, sp.hang_san_xuat.toUpperCase());
                }
            }
        });
        return Array.from(hangSet.entries()).map(([ma, ten]) => ({ ma, ten }));
    }, [danhSachDanhMuc, danhSachSanPham]);

    // Helper trích xuất timestamp chuẩn xác từ mọi dạng ngày tháng của đơn hàng (kể cả vi-VN "HH:mm DD/MM/YYYY")
    const layTimestampDonHang = (dh) => {
        if (!dh) return 0;
        const val = dh.ngay_tao || dh.createdAt || dh.ngayTao;
        if (!val) return 0;
        if (typeof val === 'number') return val;
        if (val instanceof Date) return val.getTime();
        if (typeof val === 'string') {
            const dateMatch = val.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            if (dateMatch) {
                const day = parseInt(dateMatch[1], 10);
                const month = parseInt(dateMatch[2], 10) - 1;
                const year = parseInt(dateMatch[3], 10);
                const timeMatch = val.match(/(\d{1,2}):(\d{1,2})/);
                const hour = timeMatch ? parseInt(timeMatch[1], 10) : 0;
                const minute = timeMatch ? parseInt(timeMatch[2], 10) : 0;
                const d = new Date(year, month, day, hour, minute);
                if (!isNaN(d.getTime())) return d.getTime();
            }
            const parsed = new Date(val);
            if (!isNaN(parsed.getTime())) return parsed.getTime();
        }
        return 0;
    };

    const layDateDonHang = (dh) => {
        const ts = layTimestampDonHang(dh);
        return ts > 0 ? new Date(ts) : null;
    };

    const donHangHienThi = useMemo(() => {
        let list = danhSachDonHang.filter(dh => {
            const matchTuKhoa = !tuKhoaGlobal.trim() ||
                dh.ma_don_hang?.toLowerCase().includes(tuKhoaGlobal.toLowerCase()) ||
                dh.thong_tin_giao_hang?.ho_ten?.toLowerCase().includes(tuKhoaGlobal.toLowerCase()) ||
                dh.thong_tin_giao_hang?.so_dien_thoai?.includes(tuKhoaGlobal) ||
                dh.thong_tin_giao_hang?.dia_chi_chi_tiet?.toLowerCase().includes(tuKhoaGlobal.toLowerCase());

            const matchTrangThai = locTrangThaiDonHang === 'tat_ca' || dh.trang_thai === locTrangThaiDonHang;
            const matchThanhToan = locThanhToanDonHang === 'tat_ca' ||
                (locThanhToanDonHang === 'da_thanh_toan' ? dh.da_thanh_toan : !dh.da_thanh_toan);

            // 1. Lọc theo ngày cụ thể nếu người dùng chọn ngày qua DatePicker (YYYY-MM-DD)
            let matchNgayCuThe = true;
            if (locNgayCuThe) {
                const d = layDateDonHang(dh);
                if (d) {
                    const yyyy = d.getFullYear();
                    const mm = String(d.getMonth() + 1).padStart(2, '0');
                    const dd = String(d.getDate()).padStart(2, '0');
                    matchNgayCuThe = `${yyyy}-${mm}-${dd}` === locNgayCuThe;
                } else {
                    matchNgayCuThe = false;
                }
            }

            // 2. Lọc theo mốc thời gian (Hôm nay / Tuần này / Tháng này / Tháng 8 / Năm 2026)
            let matchThoiGian = true;
            if (locThoiGianDonHang !== 'tat_ca') {
                const ts = layTimestampDonHang(dh);
                const d = layDateDonHang(dh);
                const now = new Date();

                if (locThoiGianDonHang === 'hom_nay') {
                    if (d) {
                        matchThoiGian = d.getDate() === now.getDate() &&
                                        d.getMonth() === now.getMonth() &&
                                        d.getFullYear() === now.getFullYear();
                    } else {
                        matchThoiGian = false;
                    }
                } else if (locThoiGianDonHang === '7_ngay') {
                    const bayNgayMs = 7 * 24 * 60 * 60 * 1000;
                    matchThoiGian = ts > 0 && (now.getTime() - ts <= bayNgayMs) && (ts <= now.getTime() + 60000);
                } else if (locThoiGianDonHang === '30_ngay') {
                    const baMuoiNgayMs = 30 * 24 * 60 * 60 * 1000;
                    matchThoiGian = ts > 0 && (now.getTime() - ts <= baMuoiNgayMs) && (ts <= now.getTime() + 60000);
                } else if (locThoiGianDonHang === 'thang_8_2026') {
                    if (d) {
                        matchThoiGian = d.getMonth() === 7 && d.getFullYear() === 2026;
                    } else {
                        matchThoiGian = false;
                    }
                } else if (locThoiGianDonHang === 'nam_2026') {
                    if (d) {
                        matchThoiGian = d.getFullYear() === 2026;
                    } else {
                        matchThoiGian = false;
                    }
                }
            }

            return matchTuKhoa && matchTrangThai && matchThanhToan && matchNgayCuThe && matchThoiGian;
        });

        // 3. Sắp xếp đơn hàng (Mới nhất, Cũ nhất, Giá cao nhất, Giá thấp nhất)
        return list.sort((a, b) => {
            if (sapXepDonHang === 'moi_nhat') {
                return layTimestampDonHang(b) - layTimestampDonHang(a);
            }
            if (sapXepDonHang === 'cu_nhat') {
                return layTimestampDonHang(a) - layTimestampDonHang(b);
            }
            if (sapXepDonHang === 'gia_cao') {
                const giaA = a.tong_tien_thanh_toan ?? a.tong_tien ?? 0;
                const giaB = b.tong_tien_thanh_toan ?? b.tong_tien ?? 0;
                return giaB - giaA;
            }
            if (sapXepDonHang === 'gia_thap') {
                const giaA = a.tong_tien_thanh_toan ?? a.tong_tien ?? 0;
                const giaB = b.tong_tien_thanh_toan ?? b.tong_tien ?? 0;
                return giaA - giaB;
            }
            return 0;
        });
    }, [danhSachDonHang, tuKhoaGlobal, locTrangThaiDonHang, locThanhToanDonHang, locThoiGianDonHang, locNgayCuThe, sapXepDonHang]);

    const sanPhamHienThi = useMemo(() => {
        let list = danhSachSanPham.filter(sp => {
            const tuKhoa = (tuKhoaSanPham || tuKhoaGlobal).toLowerCase().trim();
            const matchTuKhoa = !tuKhoa ||
                sp.ten_san_pham?.toLowerCase().includes(tuKhoa) ||
                sp.ma_san_pham?.toLowerCase().includes(tuKhoa) ||
                sp.hang_san_xuat?.toLowerCase().includes(tuKhoa) ||
                (Array.isArray(sp.tuy_chon_phien_ban) && sp.tuy_chon_phien_ban.some(opt => opt.ten_tuy_chon?.toLowerCase().includes(tuKhoa))) ||
                JSON.stringify(sp.thong_so || {}).toLowerCase().includes(tuKhoa);

            let matchNganhHang = true;
            const loai = xacDinhLoaiSanPham(sp);
            if (locNganhHang === 'laptop') {
                matchNganhHang = loai === 'laptop';
            } else if (locNganhHang === 'linh-kien' || locNganhHang === 'linh_kien') {
                matchNganhHang = loai === 'linh_kien';
            } else if (locNganhHang === 'ban_phim') {
                matchNganhHang = loai === 'ban_phim';
            } else if (locNganhHang === 'chuot') {
                matchNganhHang = loai === 'chuot';
            } else if (locNganhHang === 'balo') {
                matchNganhHang = loai === 'balo';
            } else if (locNganhHang === 'tai_nghe') {
                matchNganhHang = loai === 'tai_nghe';
            } else if (locNganhHang === 'sac_hub') {
                matchNganhHang = loai === 'sac_hub';
            } else if (locNganhHang === 'phu-kien-gear') {
                matchNganhHang = loai !== 'laptop' && loai !== 'linh_kien';
            }

            const matchHang = locHangSanPham === 'tat_ca' || sp.hang_san_xuat?.toLowerCase() === locHangSanPham.toLowerCase();

            let matchTonKho = true;
            if (locTonKhoSanPham === 'con_hang') {
                matchTonKho = (sp.so_luong_ton_kho > 0) && (sp.con_hang !== false);
            } else if (locTonKhoSanPham === 'sap_het') {
                matchTonKho = (sp.so_luong_ton_kho <= 5 && sp.so_luong_ton_kho > 0);
            } else if (locTonKhoSanPham === 'tam_an') {
                matchTonKho = (sp.so_luong_ton_kho <= 0) || (sp.con_hang === false);
            } else if (locTonKhoSanPham === 'flash_sale') {
                matchTonKho = Boolean(sp.la_flash_sale);
            }

            return matchTuKhoa && matchNganhHang && matchHang && matchTonKho;
        });

        if (sapXepSanPham === 'gia_giam') {
            list.sort((a, b) => (b.gia_khuyen_mai || 0) - (a.gia_khuyen_mai || 0));
        } else if (sapXepSanPham === 'gia_tang') {
            list.sort((a, b) => (a.gia_khuyen_mai || 0) - (b.gia_khuyen_mai || 0));
        } else if (sapXepSanPham === 'ban_chay') {
            list.sort((a, b) => (b.so_luong_da_ban || 0) - (a.so_luong_da_ban || 0));
        } else if (sapXepSanPham === 'ton_kho') {
            list.sort((a, b) => (b.so_luong_ton_kho || 0) - (a.so_luong_ton_kho || 0));
        }

        return list;
    }, [danhSachSanPham, tuKhoaGlobal, tuKhoaSanPham, locNganhHang, locHangSanPham, locTonKhoSanPham, sapXepSanPham]);

    // Khách hàng kèm doanh thu
    const danhSachKhachHangKemDoanhThu = useMemo(() => {
        return danhSachNguoiDung.map(user => {
            const emailKh = user.email?.toLowerCase().trim();
            const sdtKh = user.soDienThoai?.trim();

            const cacDonKhach = danhSachDonHang.filter(dh => {
                if (dh.trang_thai === 'da_huy') return false;
                const dhEmail = dh.thong_tin_giao_hang?.email?.toLowerCase().trim();
                const dhSdt = dh.thong_tin_giao_hang?.so_dien_thoai?.trim();
                return (emailKh && dhEmail === emailKh) || (sdtKh && dhSdt === sdtKh);
            });

            const tongChiTieu = cacDonKhach.reduce((sum, dh) => sum + (Number(dh.tong_tien_thanh_toan) || 0), 0);
            const soDonHang = cacDonKhach.length;

            const laTiemNang = tongChiTieu >= 20000000 || soDonHang >= 2;
            const laVip = tongChiTieu >= 50000000 || ['Vàng', 'Kim Cương', 'VIP Gold', 'VIP Platinum'].includes(user.hangThanhVien);

            return {
                ...user,
                tongChiTieu,
                soDonHang,
                laTiemNang,
                laVip
            };
        });
    }, [danhSachNguoiDung, danhSachDonHang]);

    const khachHangHienThi = useMemo(() => {
        let list = danhSachKhachHangKemDoanhThu.filter(u => {
            const key = tuKhoaKhachHang.toLowerCase().trim();
            const matchTuKhoa = !key ||
                u.hoTen?.toLowerCase().includes(key) ||
                u.email?.toLowerCase().includes(key) ||
                u.soDienThoai?.includes(key);

            let matchLoai = true;
            if (locKhachHang === 'tiem_nang') {
                matchLoai = u.laTiemNang || u.tongChiTieu > 0;
            } else if (locKhachHang === 'vip') {
                matchLoai = u.laVip;
            } else if (locKhachHang === 'admin') {
                matchLoai = u.vaiTro === 'admin';
            } else if (locKhachHang === 'bi_khoa') {
                matchLoai = Boolean(u.biKhoa || u.trangThai === 'bi_khoa');
            } else if (locKhachHang === 'hoat_dong') {
                matchLoai = !u.biKhoa && u.trangThai !== 'bi_khoa';
            }

            return matchTuKhoa && matchLoai;
        });

        if (sapXepKhachHang === 'ngay_tao_moi') {
            list.sort((a, b) => {
                const da = new Date(a.createdAt || 0).getTime() || (typeof a.id === 'string' && a.id.startsWith('usr_') ? parseInt(a.id.replace('usr_', '').replace('gg_', ''), 10) : 0);
                const db = new Date(b.createdAt || 0).getTime() || (typeof b.id === 'string' && b.id.startsWith('usr_') ? parseInt(b.id.replace('usr_', '').replace('gg_', ''), 10) : 0);
                return db - da;
            });
        } else if (sapXepKhachHang === 'doanh_thu_giam') {
            list.sort((a, b) => (b.tongChiTieu || 0) - (a.tongChiTieu || 0));
        } else if (sapXepKhachHang === 'diem_giam') {
            list.sort((a, b) => (b.soDonHang || 0) - (a.soDonHang || 0));
        } else if (sapXepKhachHang === 'ten_az') {
            list.sort((a, b) => (a.hoTen || '').localeCompare(b.hoTen || ''));
        }

        return list;
    }, [danhSachKhachHangKemDoanhThu, tuKhoaKhachHang, locKhachHang, sapXepKhachHang]);

    const danhMucHienThi = useMemo(() => {
        return danhSachDanhMuc.filter(dm => {
            const key = tuKhoaDanhMuc.toLowerCase().trim();
            const matchTuKhoa = !key ||
                dm.ten_danh_muc?.toLowerCase().includes(key) ||
                dm.ma_danh_muc?.toLowerCase().includes(key) ||
                dm.xuat_xu?.toLowerCase().includes(key);

            let matchLoai = true;
            if (locLoaiDanhMuc === 'thuong_hieu') {
                matchLoai = dm.loai === 'thuong_hieu' || !dm.loai;
            } else if (locLoaiDanhMuc === 'nhu_cau') {
                matchLoai = dm.loai === 'nhu_cau';
            }

            return matchTuKhoa && matchLoai;
        });
    }, [danhSachDanhMuc, tuKhoaDanhMuc, locLoaiDanhMuc]);

    // Voucher hiển thị kèm bộ lọc tìm kiếm & trạng thái
    const voucherHienThi = useMemo(() => {
        return danhSachVoucher.filter(vc => {
            const key = (tuKhoaVoucher || '').toLowerCase().trim();
            const matchTuKhoa = !key ||
                vc.ma_code?.toLowerCase().includes(key) ||
                vc.tieu_de?.toLowerCase().includes(key) ||
                vc.mo_ta?.toLowerCase().includes(key);

            let matchTrangThai = true;
            if (locTrangThaiVoucher === 'kich_hoat') {
                matchTrangThai = vc.kich_hoat !== false;
            } else if (locTrangThaiVoucher === 'tam_an') {
                matchTrangThai = vc.kich_hoat === false;
            }

            return matchTuKhoa && matchTrangThai;
        });
    }, [danhSachVoucher, tuKhoaVoucher, locTrangThaiVoucher]);

    // Tin tức hiển thị trong Admin
    const tinTucHienThi = useMemo(() => {
        return danhSachTinTuc.filter(t => {
            const key = tuKhoaTinTuc.toLowerCase().trim();
            const matchTuKhoa = !key ||
                t.tieu_de?.toLowerCase().includes(key) ||
                t.tom_tat?.toLowerCase().includes(key) ||
                t.tac_gia?.toLowerCase().includes(key);

            const matchChuyenMuc = locChuyenMucTinTuc === 'tat_ca' ||
                t.chuyen_muc?.toLowerCase().trim() === locChuyenMucTinTuc.toLowerCase().trim();

            const matchTrangThai = locTrangThaiTinTuc === 'tat_ca' ||
                (locTrangThaiTinTuc === 'xuat_ban' ? t.xuat_ban !== false : t.xuat_ban === false);

            return matchTuKhoa && matchChuyenMuc && matchTrangThai;
        });
    }, [danhSachTinTuc, tuKhoaTinTuc, locChuyenMucTinTuc, locTrangThaiTinTuc]);

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
        const tenFile = `Bao_Cao_Ke_Toan_Don_Hang_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${Date.now().toString().slice(-4)}.xls`;
        link.download = tenFile;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        hienThongBao(`Đã kết xuất thành công bảng báo cáo kế toán Excel (${danhSachXuat.length} đơn hàng)!`);
    };


    const moModalThemSp = () => {
        setSpDangSua(null);
        setFormSpGoc(null);
        setThongSoTuyChinhGoc([]);
        setTabModalSp('thong_tin');
        setLoaiFormSanPham('laptop');
        setThongSoTuyChinh([]);
        setFormSp({
            ma_san_pham: `SKU-${Date.now().toString().slice(-5)}`,
            ten_san_pham: '',
            hang_san_xuat: 'asus',
            danh_muc: ['gaming'],
            gia_goc: 30000000,
            gia_khuyen_mai: 27990000,
            phan_tram_giam_gia: 10,
            hinh_anh_chinh: '/images/sp/asus_rog_scar18.jpg',
            so_luong_ton_kho: 15,
            con_hang: true,
            la_flash_sale: false,
            la_ban_chay: false,
            la_san_pham_moi: true,
            mo_ta_chi_tiet: '',
            dac_diem_noi_bat: [
                'Bộ đôi vi xử lý thế hệ mới cực mạnh kết hợp card đồ họa kiến trúc tân tiến',
                'Màn hình chuẩn màu đồ họa tần số quét cao siêu mượt, độ phân giải sắc nét',
                'Hệ thống tản nhiệt thông minh tối ưu luồng gió mát lạnh êm ái',
                'Bộ nhớ tốc độ cao và khả năng nâng cấp linh hoạt trong tương lai'
            ],
            qua_tang: [
                { ten_qua_tang: 'Balo laptop cao cấp chống sốc', gia_tri: 990000 },
                { ten_qua_tang: 'Chuột không dây công thái học', gia_tri: 450000 }
            ],
            tuy_chon_phien_ban: [],
            thu_vien_hinh_anh: [],

            // 1. Cấu hình chi tiết Laptop
            cpu: 'Intel Core i9-14900HX (24 Nhân 32 Luồng, Max 5.8GHz, 36MB Cache)',
            so_nhan_luong: '24 Nhân (8 P-Core + 16 E-Core), 32 Luồng',
            xung_nhip_toi_da: '5.8 GHz Turbo Boost',
            bo_nho_dem_cache: '36MB Intel Smart Cache',
            chip_ai_npu: 'Intel AI Boost NPU tích hợp',
            hieu_nang_ai_tops: '45',
            card_do_hoa: 'NVIDIA GeForce RTX 4090 Laptop GPU 16GB GDDR6 (175W TGP)',
            dung_luong_vram: '16GB GDDR6',
            cong_suat_tgp: '175',
            ho_tro_ray_tracing: true,
            ram: '64GB DDR5 5600MHz (2x32GB)',
            loai_ram: 'DDR5 5600MHz',
            toc_do_bus: '5600',
            nang_cap_ram_toi_da: 'Lên tới 64GB (2 khe SODIMM)',
            o_cung: '2TB PCIe 4.0 NVMe M.2 Performance SSD (Raid 0)',
            khe_cam_mo_rong: '2 khe M.2 PCIe Gen 4',
            man_hinh: '18.0 inch QHD+ (2560 x 1600) ROG Nebula HDR Mini-LED 240Hz 3ms',
            do_phan_giai: '2.5K QHD+ (2560 x 1600), tỷ lệ 16:10',
            tan_so_quet: '240',
            tam_nen: 'Mini-LED, ROG Nebula HDR Display',
            do_phu_mau: '100% DCI-P3, Chuẩn màu Pantone Validated',
            do_sang_nits: '1100',
            cong_nghe_man_hinh: 'G-Sync, Dolby Vision HDR, Chống chói Anti-Glare',
            pin: '90WHrs, 4-cell Li-ion',
            dung_luong_pin: '90WHrs, 4-cell Li-ion',
            thoi_luong_su_dung_uoc_tinh: 'Khoảng 6 - 8 tiếng sử dụng cơ bản',
            cong_suat_sac: '330W AC Adapter, hỗ trợ sạc nhanh Type-C PD 100W',
            he_thong_tan_nhiet: 'Hệ thống ROG Intelligent Cooling, buồng hơi Vapor Chamber, kim loại lỏng',
            chi_tiet_tan_nhiet: 'Hệ thống ROG Intelligent Cooling, buồng hơi Vapor Chamber, kim loại lỏng',
            trong_luong: '3.1 kg',
            kich_thuoc: '39.9 x 29.4 x 2.31 ~ 3.08 cm',
            chat_lieu_vo: 'Hợp kim Nhôm - Magie cao cấp phay xước viền LED Aura Sync',
            cong_ket_noi: '1x Thunderbolt 4, 1x USB 3.2 Gen 2 Type-C, 2x USB 3.2 Gen 2 Type-A, 1x HDMI 2.1, 1x LAN RJ45 2.5G, 1x Jack 3.5mm',
            chuan_wifi_bluetooth: 'Wi-Fi 7 (802.11be) 3 băng tần + Bluetooth 5.4',
            ban_phim: 'Bàn phím Chiclet Per-Key RGB Aura Sync, hành trình phím 2.0mm sâu',
            am_thanh: 'Hệ thống 4 loa công nghệ Dolby Atmos, Smart Amp, Khử ồn AI hai chiều',
            he_dieu_hanh: 'Windows 11 Home bản quyền vĩnh viễn',

            // 2. Bàn phím cơ
            loai_switch: 'ROG NX Snow Switch (Linear, 45g)',
            tinh_nang_dac_biet: 'Hot-swap 3-pin / 5-pin mạch xuôi',
            cau_truc_mount: 'Gasket Mount kèm lót Foam Poron tiêu âm',
            layout_ban_phim: '75% (81 phím) + Màn hình OLED mini',
            keycap_chat_lieu: 'PBT Doubleshot siêu bền',
            chat_lieu_case: 'Nhôm CNC Anodized nguyên khối',
            kieu_ket_noi_gear: '3 Chế độ: Type-C, SpeedNova 2.4GHz, Bluetooth 5.1',
            led_rgb_gear: 'RGB Per-key Aura Sync 16.8 triệu màu',
            dung_luong_pin_gear: '4000 mAh (Lên tới 2000 giờ)',
            hot_swap: 'Hot-swap 5-pin hỗ trợ mọi loại switch',
            tuong_thich_gear: 'Windows, macOS, Linux, iOS, Android',
            trong_luong_gear: '1.2 kg',

            // 3. Chuột & Lót chuột
            cam_bien_chuot: 'ROG AimPoint Pro 42.000 DPI đỉnh cao',
            do_phan_giai_dpi: '42.000 DPI (50G gia tốc, 750 IPS)',
            toc_do_ips_gia_toc: '750 IPS / 50G',
            switch_chuot: 'ROG Optical Micro Switch 100 triệu lần nhấn',
            polling_rate: '1000Hz - 8000Hz Polling Rate',
            loai_lot_chuot: 'Speed & Control cân bằng',
            chat_lieu_be_mat: 'Vải dệt Cordura chống nước',
            chat_lieu_de: 'Cao su tự nhiên Poron chống trượt',
            kieu_ket_noi_chuot: 'SpeedNova Wireless 2.4GHz + Bluetooth + Type-C (Polling rate 8000Hz)',
            che_do_led: 'RGB Aura Sync',
            thoi_luong_pin_chuot: 'Lên tới 90 giờ chơi liên tục',
            chat_lieu_feet: '100% Virgin PTFE bo góc mượt mà',
            kich_thuoc_chuot: '120 x 65 x 37.8 mm',
            trong_luong_chuot: '54g Siêu nhẹ',

            // 4. Balo & Túi chống sốc
            kich_co_laptop_phu_hop: 'Vừa vặn mọi laptop từ 15.6 đến 18 inch',
            dung_tich_balo: '28 Lít',
            so_ngan_chua: 'Ngăn laptop chống sốc riêng + 5 ngăn phụ',
            kich_thuoc_balo: '540 x 350 x 220 mm',
            trong_luong_tui: '1.2 kg',
            chat_lieu_chinh: 'Vải Cordura 1000D chống xước cao cấp',
            lop_lot_bao_ve: 'Đệm bọt khí EVA mật độ cao 3 lớp',
            khoa_keo: 'YKK chống kẹt nước chuẩn Nhật Bản',
            kha_nang_khang_nuoc: 'Kháng nước chuẩn IPX4 + khóa kéo chống nước',
            dem_lung_thoang_khi: 'Đệm khí 3D tổ ong công thái học',
            cong_tinh_nang: 'Tích hợp cổng sạc USB ngoài, ngăn chống trộm RFID',

            // 5. Tai nghe & Loa
            mang_loa_driver: 'Graphene 50mm Hi-Res Audio',
            cong_nghe_am_thanh: 'Âm thanh vòm 7.1 DTS Headphone:X 2.0',
            tan_so_dap_ung: '20Hz - 40.000Hz',
            tro_khang_do_nhay: '32 Ohm / 100 dB SPL @ 1kHz',
            chong_on_anc: 'Chống ồn chủ động ANC Hybrid đa cấp',
            micro_dam_thoai: 'Micro Blue VO!CE lọc ồn AI rời',
            kieu_ket_noi_tai_nghe: 'Lightspeed 2.4GHz + Bluetooth + Jack 3.5mm',
            thoi_luong_pin_tai_nghe: 'Lên tới 50 giờ chơi liên tục',
            khang_nuoc_tai_nghe: 'IPX4 kháng mồ hôi',
            dem_tai: 'Bọt biển Memory Foam bọc da protein êm ái',
            bo_dieu_khien: 'Nút cuộn âm lượng, tắt mic trên củ tai',
            kich_thuoc_tai_nghe: '190 x 180 x 85 mm',
            trong_luong_tai_nghe: '320g',

            // 6. Củ sạc & Hub chuyển đổi
            cong_suat_tong: '140W GaN Prime thế hệ mới',
            cong_nghe_sac: 'PD 3.1, QC 4.0+, PPS, GaN III',
            giao_thuc_ho_tro: 'Power Delivery 3.1, Quick Charge 4.0, Apple 2.4A',
            dung_luong_pin_sac: '24.000 mAh 86.4Wh',
            man_hinh_hien_thi: 'Màn hình TFT màu hiển thị công suất thời gian thực',
            tinh_nang_an_toan: 'ActiveShield 2.0 kiểm soát nhiệt 3 triệu lần/ngày',
            so_cong_sac: '2 x Type-C (140W max), 1 x USB-A (22.5W)',
            bang_thong_truyen_du_lieu: '10Gbps USB 3.2 Gen 2 / 40Gbps USB4',
            cong_suat_sac_pass_through: '100W Power Delivery',
            xuat_hinh_anh: 'HDMI 2.1 4K@120Hz / 8K@60Hz',
            chieu_dai_cap: '1.8 mét bọc dù chống đứt',
            chat_lieu_vo_sac: 'Hợp kim nhôm tản nhiệt nguyên khối',
            tuong_thich_sac: 'Laptop Gaming, MacBook Pro 16, Dell XPS, iPhone',
            kich_thuoc_trong_luong_sac: '215g - Nhỏ hơn 40% củ sạc gốc',
            kich_thuoc_sac: '85 x 50 x 30 mm',
            trong_luong_sac: '215g',

            // 7. Linh kiện & Tản nhiệt
            loai_linh_kien: 'Ổ cứng SSD M.2 NVMe PCIe 4.0',
            dung_luong_linh_kien: '2TB (2048GB)',
            toc_do_doc_ghi: 'Đọc 7.450 MB/s - Ghi 6.900 MB/s',
            toc_do_bus_linh_kien: '5600 MHz CL46',
            do_tre_cl: 'CL30 / CL40',
            so_nhan_luong_linh_kien: '24 Nhân 32 Luồng',
            xung_nhip_toi_da_linh_kien: '5.8 GHz',
            bo_nho_dem_cache_linh_kien: '36MB Intel Smart Cache',
            cong_suat_tdp: '125W - 253W',
            ho_tro_ram: 'DDR5 5600MHz / DDR4 3200MHz',
            toc_do_quat: '2800 RPM điều tốc tự động',
            hieu_qua_giam_nhiet: 'Giảm ngay từ 15°C - 25°C cho CPU/GPU',
            do_dan_nhiet: '14.2 W/m-K',
            chuan_giao_tiep: 'PCIe Gen 4.0 x4 M.2 NVMe',
            do_ben_tbw: '1.200 TBW - 1.5 triệu giờ MTBF',
            tinh_nang_dac_biet_linh_kien: 'Heatsink Nhôm Hàng Không tản nhiệt thụ động',
            he_thong_tan_nhiet: 'Heatsink Nhôm Hàng Không tản nhiệt thụ động',
            tuong_thich_linh_kien: 'Laptop Gaming, PC Desktop, PlayStation 5',
            kich_co_laptop_linh_kien: 'Laptop 14 inch - 18 inch',
            trong_luong_linh_kien: '80g',

            che_do_bao_hanh: '24 tháng chính hãng'
        });
        setDangMoModalSp(true);
    };

    const moModalSuaSp = (sp, tabMacDinh = 'thong_tin') => {
        setSpDangSua(sp);
        setTabModalSp(tabMacDinh);
        const loaiForm = xacDinhLoaiSanPham(sp);
        setLoaiFormSanPham(loaiForm);

        const specs = sp.thong_so || {};
        const dinhDangChuoiHoacMang = (val) => {
            if (Array.isArray(val)) return val.join(', ');
            if (val === undefined || val === null) return '';
            return String(val);
        };

        const standardKeys = [
            'cpu', 'so_nhan_luong', 'xung_nhip_toi_da', 'bo_nho_dem_cache', 'chip_ai_npu', 'hieu_nang_ai_tops',
            'card_do_hoa', 'dung_luong_vram', 'cong_suat_tgp', 'ho_tro_ray_tracing',
            'ram', 'loai_ram', 'toc_do_bus', 'nang_cap_ram_toi_da', 'o_cung', 'khe_cam_mo_rong',
            'man_hinh', 'do_phan_giai', 'tan_so_quet', 'tam_nen', 'do_phu_mau', 'do_sang_nits', 'cong_nghe_man_hinh',
            'pin', 'dung_luong_pin', 'thoi_luong_su_dung_uoc_tinh', 'cong_suat_sac', 'bo_sac_cong_suat',
            'he_thong_tan_nhiet', 'chi_tiet_tan_nhiet', 'trong_luong', 'kich_thuoc', 'chat_lieu_vo',
            'cong_ket_noi', 'chuan_wifi_bluetooth', 'ban_phim', 'am_thanh', 'he_dieu_hanh', 'che_do_bao_hanh',
            'switch', 'loai_switch', 'tinh_nang_dac_biet', 'cau_truc_mount', 'layout', 'layout_ban_phim',
            'keycap', 'keycap_chat_lieu', 'chat_lieu_case', 'kieu_ket_noi', 'ket_noi', 'led_rgb', 'den_led',
            'hot_swap', 'tuong_thich', 'cam_bien', 'mat_doc_cam_bien', 'do_phan_giai_dpi', 'toc_do_ips_gia_toc',
            'switch_chuot', 'polling_rate', 'loai_lot_chuot', 'chat_lieu_be_mat', 'chat_lieu_de', 'che_do_led',
            'thoi_luong_pin', 'nguon_dien', 'chat_lieu_feet', 'kich_co_laptop_phu_hop', 'dung_tich', 'so_ngan_chua',
            'chat_lieu_vai', 'chat_lieu_chinh', 'lop_lot_bao_ve', 'khoa_keo', 'khang_nuoc', 'kha_nang_khang_nuoc',
            'dem_lung_thoang_khi', 'cong_tinh_nang', 'mang_loa_driver', 'cong_nghe_am_thanh', 'dai_tan_so',
            'tan_so_dap_ung', 'tro_khang_do_nhay', 'chong_on_anc', 'micro', 'dem_tai', 'bo_dieu_khien',
            'cong_suat_tong', 'cong_suat_toi_da', 'cong_nghe_sac', 'giao_thuc_ho_tro', 'man_hinh_hien_thi',
            'tinh_nang_an_toan', 'so_cong_sac', 'so_cong_dau_ra', 'bang_thong_truyen_du_lieu',
            'cong_suat_sac_pass_through', 'xuat_hinh_anh', 'chieu_dai_cap', 'kich_thuoc_trong_luong',
            'loai_linh_kien', 'dung_luong', 'toc_do', 'toc_do_doc_ghi', 'do_tre_cl', 'cong_suat_tdp',
            'ho_tro_ram', 'toc_do_quat', 'hieu_qua_giam_nhiet', 'do_dan_nhiet', 'chuan_giao_tiep',
            'do_ben_tbw', 'do_ben_chong_chiu'
        ];

        const customItems = [];
        Object.entries(specs).forEach(([k, v]) => {
            if (!standardKeys.includes(k) && v !== undefined && v !== null && String(v).trim()) {
                const tenTiengViet = TU_DIEN_THONG_SO_ADMIN[k] || layTenHienThiKey(k);
                customItems.push({ key: tenTiengViet, value: String(v).trim() });
            }
        });
        setThongSoTuyChinh(customItems);
        setThongSoTuyChinhGoc(JSON.parse(JSON.stringify(customItems)));

        const formSuaMoi = {
            ma_san_pham: sp.ma_san_pham || '',
            ten_san_pham: sp.ten_san_pham || '',
            hang_san_xuat: sp.hang_san_xuat || 'asus',
            danh_muc: sp.danh_muc || ['gaming'],
            gia_goc: sp.gia_goc || 0,
            gia_khuyen_mai: sp.gia_khuyen_mai || 0,
            phan_tram_giam_gia: sp.phan_tram_giam_gia || 0,
            hinh_anh_chinh: sp.hinh_anh_chinh || '/images/sp/asus_rog_scar18.jpg',
            so_luong_ton_kho: sp.so_luong_ton_kho !== undefined ? sp.so_luong_ton_kho : 10,
            con_hang: sp.con_hang !== false,
            la_flash_sale: !!sp.la_flash_sale,
            la_ban_chay: !!sp.la_ban_chay,
            la_san_pham_moi: !!sp.la_san_pham_moi,
            mo_ta_chi_tiet: sp.mo_ta_chi_tiet || '',
            dac_diem_noi_bat: Array.isArray(sp.dac_diem_noi_bat) ? [...sp.dac_diem_noi_bat] : [],
            qua_tang: Array.isArray(sp.qua_tang) ? JSON.parse(JSON.stringify(sp.qua_tang)) : [],
            tuy_chon_phien_ban: Array.isArray(sp.tuy_chon_phien_ban) ? JSON.parse(JSON.stringify(sp.tuy_chon_phien_ban)) : [],
            thu_vien_hinh_anh: Array.isArray(sp.thu_vien_hinh_anh) ? [...sp.thu_vien_hinh_anh] : [],

            // 1. Cấu hình chi tiết Laptop
            cpu: specs.cpu || '',
            so_nhan_luong: specs.so_nhan_luong || '',
            xung_nhip_toi_da: specs.xung_nhip_toi_da || '',
            bo_nho_dem_cache: specs.bo_nho_dem_cache || '',
            chip_ai_npu: specs.chip_ai_npu || '',
            hieu_nang_ai_tops: specs.hieu_nang_ai_tops !== undefined ? String(specs.hieu_nang_ai_tops) : '',
            card_do_hoa: specs.card_do_hoa || '',
            dung_luong_vram: specs.dung_luong_vram || '',
            cong_suat_tgp: specs.cong_suat_tgp !== undefined ? String(specs.cong_suat_tgp) : '',
            ho_tro_ray_tracing: specs.ho_tro_ray_tracing !== undefined ? Boolean(specs.ho_tro_ray_tracing) : true,
            ram: specs.ram || '',
            loai_ram: specs.loai_ram || '',
            toc_do_bus: specs.toc_do_bus !== undefined ? String(specs.toc_do_bus) : '',
            nang_cap_ram_toi_da: specs.nang_cap_ram_toi_da || '',
            o_cung: specs.o_cung || '',
            khe_cam_mo_rong: specs.khe_cam_mo_rong || '',
            man_hinh: specs.man_hinh || '',
            do_phan_giai: specs.do_phan_giai || '',
            tan_so_quet: specs.tan_so_quet !== undefined ? String(specs.tan_so_quet) : '',
            tam_nen: specs.tam_nen || '',
            do_phu_mau: specs.do_phu_mau || '',
            do_sang_nits: specs.do_sang_nits !== undefined ? String(specs.do_sang_nits) : '',
            cong_nghe_man_hinh: dinhDangChuoiHoacMang(specs.cong_nghe_man_hinh),
            pin: specs.dung_luong_pin || specs.pin || '90Wh',
            dung_luong_pin: specs.dung_luong_pin || specs.pin || '90Wh',
            thoi_luong_su_dung_uoc_tinh: specs.thoi_luong_su_dung_uoc_tinh || '',
            cong_suat_sac: specs.cong_suat_sac || specs.bo_sac_cong_suat || '',
            he_thong_tan_nhiet: specs.he_thong_tan_nhiet || specs.chi_tiet_tan_nhiet || '',
            chi_tiet_tan_nhiet: specs.chi_tiet_tan_nhiet || specs.he_thong_tan_nhiet || '',
            trong_luong: typeof specs.trong_luong === 'number' ? `${specs.trong_luong} kg` : (specs.trong_luong || ''),
            kich_thuoc: specs.kich_thuoc || '',
            chat_lieu_vo: specs.chat_lieu_vo || '',
            cong_ket_noi: dinhDangChuoiHoacMang(specs.cong_ket_noi),
            chuan_wifi_bluetooth: specs.chuan_wifi_bluetooth || '',
            ban_phim: specs.ban_phim || '',
            am_thanh: specs.am_thanh || '',
            he_dieu_hanh: specs.he_dieu_hanh || '',

            // 2. Bàn phím cơ
            loai_switch: specs.switch || specs.switch_cam_bien || specs.loai_switch || '',
            tinh_nang_dac_biet: specs.tinh_nang_dac_biet || '',
            cau_truc_mount: specs.cau_truc_mount || '',
            layout_ban_phim: specs.layout || specs.layout_ban_phim || '75% Gasket Mount',
            keycap_chat_lieu: specs.keycap || specs.keycap_chat_lieu || 'PBT Double-shot',
            chat_lieu_case: specs.chat_lieu_case || '',
            kieu_ket_noi_gear: specs.kieu_ket_noi || specs.ket_noi || 'Type-C, Wireless 2.4GHz, Bluetooth 5.1',
            led_rgb_gear: specs.led_rgb || specs.den_led || 'RGB South-facing 16.8 triệu màu',
            dung_luong_pin_gear: specs.dung_luong_pin || specs.thoi_luong_pin || '4000 mAh (300 giờ)',
            hot_swap: specs.hot_swap || 'Hot-swap 3-pin / 5-pin mạch xuôi',
            tuong_thich_gear: specs.tuong_thich || '',
            trong_luong_gear: typeof specs.trong_luong === 'number' ? `${specs.trong_luong} kg` : (specs.trong_luong || ''),

            // 3. Chuột & Lót chuột
            cam_bien_chuot: specs.cam_bien || specs.cam_bien_quang_hoc || specs.mat_doc_cam_bien || 'PixArt PAW3395 đỉnh cao',
            do_phan_giai_dpi: specs.do_phan_giai_dpi || '26.000 DPI (6 nấc)',
            toc_do_ips_gia_toc: specs.toc_do_ips_gia_toc || '',
            switch_chuot: specs.switch_chuot || 'Optical Huano 100 triệu lượt nhấn',
            polling_rate: specs.polling_rate || '',
            loai_lot_chuot: specs.loai_lot_chuot || '',
            chat_lieu_be_mat: specs.chat_lieu_be_mat || '',
            chat_lieu_de: specs.chat_lieu_de || '',
            kieu_ket_noi_chuot: specs.kieu_ket_noi || specs.ket_noi || 'Wireless 2.4GHz + Bluetooth + Type-C',
            che_do_led: specs.che_do_led || '',
            thoi_luong_pin_chuot: specs.thoi_luong_pin || specs.dung_luong_pin || 'Lên tới 200 giờ',
            chat_lieu_feet: specs.chat_lieu_feet || '',
            kich_thuoc_chuot: specs.kich_thuoc || '',
            trong_luong_chuot: typeof specs.trong_luong === 'number' ? `${specs.trong_luong}g` : (specs.trong_luong || '49g siêu nhẹ'),

            // 4. Balo & Túi chống sốc
            kich_co_laptop_phu_hop: specs.kich_co_laptop_phu_hop || specs.ngan_chua_laptop || 'Phù hợp laptop 15.6 - 18 inch',
            dung_tich_balo: specs.dung_tich || '36 Lít',
            so_ngan_chua: specs.so_ngan_chua || '1 ngăn chính chống sốc + 6 ngăn phụ',
            kich_thuoc_balo: specs.kich_thuoc || '510 x 340 x 200 mm',
            trong_luong_tui: typeof specs.trong_luong === 'number' ? `${specs.trong_luong} kg` : (specs.trong_luong || '1.4 kg'),
            chat_lieu_chinh: specs.chat_lieu_chinh || specs.chat_lieu_vai || specs.chat_lieu || 'Polyester 1680D kháng nước',
            lop_lot_bao_ve: specs.lop_lot_bao_ve || '',
            khoa_keo: specs.khoa_keo || '',
            kha_nang_khang_nuoc: specs.kha_nang_khang_nuoc || specs.khang_nuoc || 'Trượt nước IPX4 kèm áo mưa trùm',
            dem_lung_thoang_khi: specs.dem_lung_thoang_khi || 'Đệm lưng 3D EVA thoáng khí công thái học',
            cong_tinh_nang: dinhDangChuoiHoacMang(specs.cong_tinh_nang),

            // 5. Tai nghe & Loa
            mang_loa_driver: specs.mang_loa_driver || 'Graphene 50mm Hi-Res Audio',
            cong_nghe_am_thanh: specs.cong_nghe_am_thanh || '',
            tan_so_dap_ung: specs.tan_so_dap_ung || specs.dai_tan_so || '20Hz - 40.000Hz',
            tro_khang_do_nhay: specs.tro_khang_do_nhay || '',
            chong_on_anc: specs.chong_on_anc || '',
            micro_dam_thoai: specs.micro || 'Micro lọc ồn công nghệ AI rời',
            kieu_ket_noi_tai_nghe: specs.chuan_ket_noi || specs.kieu_ket_noi || specs.ket_noi || 'Lightspeed 2.4GHz + Bluetooth + 3.5mm',
            thoi_luong_pin_tai_nghe: specs.thoi_luong_pin || specs.dung_luong_pin || 'Lên tới 50 giờ chơi liên tục',
            khang_nuoc_tai_nghe: specs.khang_nuoc || '',
            dem_tai: specs.dem_tai || '',
            bo_dieu_khien: specs.bo_dieu_khien || '',
            kich_thuoc_tai_nghe: specs.kich_thuoc || '',
            trong_luong_tai_nghe: typeof specs.trong_luong === 'number' ? `${specs.trong_luong}g` : (specs.trong_luong || ''),

            // 6. Củ sạc & Hub chuyển đổi
            cong_suat_tong: specs.cong_suat_tong || specs.cong_suat_toi_da || '140W GaN Prime',
            cong_nghe_sac: specs.cong_nghe_sac || 'PD 3.1, QC 4.0+, PPS, GaN III',
            giao_thuc_ho_tro: specs.giao_thuc_ho_tro || '',
            dung_luong_pin_sac: specs.dung_luong_pin || '',
            man_hinh_hien_thi: specs.man_hinh_hien_thi || '',
            tinh_nang_an_toan: specs.tinh_nang_an_toan || '',
            so_cong_sac: dinhDangChuoiHoacMang(specs.so_cong_sac || specs.so_cong_dau_ra || specs.so_cong_ket_noi) || '2 x Type-C (140W max), 1 x USB-A',
            bang_thong_truyen_du_lieu: specs.bang_thong_truyen_du_lieu || '',
            cong_suat_sac_pass_through: specs.cong_suat_sac_pass_through || '',
            xuat_hinh_anh: specs.xuat_hinh_anh || '',
            chieu_dai_cap: specs.chieu_dai_cap || '',
            chat_lieu_vo_sac: specs.chat_lieu_vo || '',
            tuong_thich_sac: specs.tuong_thich || 'Laptop Gaming, MacBook, iPad, Điện thoại',
            kich_thuoc_trong_luong_sac: specs.kich_thuoc_trong_luong || '215g - Nhỏ gọn tiện du lịch',
            kich_thuoc_sac: specs.kich_thuoc || '',
            trong_luong_sac: typeof specs.trong_luong === 'number' ? `${specs.trong_luong}g` : (specs.trong_luong || ''),

            // 7. Linh kiện & Tản nhiệt
            loai_linh_kien: specs.loai_linh_kien || '',
            dung_luong_linh_kien: specs.dung_luong || specs.dung_luong_bo_nho || '2TB / 32GB',
            toc_do_doc_ghi: specs.toc_do_doc_ghi || specs.toc_do || specs.toc_do_doc_ghi_bus || 'Đọc 7.450 MB/s - Ghi 6.900 MB/s',
            toc_do_bus_linh_kien: specs.toc_do_bus || '',
            do_tre_cl: specs.do_tre_cl || '',
            so_nhan_luong_linh_kien: specs.so_nhan_luong || '',
            xung_nhip_toi_da_linh_kien: specs.xung_nhip_toi_da || '',
            bo_nho_dem_cache_linh_kien: specs.bo_nho_dem_cache || '',
            cong_suat_tdp: specs.cong_suat_tdp || '',
            ho_tro_ram: specs.ho_tro_ram || '',
            toc_do_quat: specs.toc_do_quat || '',
            hieu_qua_giam_nhiet: specs.hieu_qua_giam_nhiet || '',
            do_dan_nhiet: specs.do_dan_nhiet || '',
            chuan_giao_tiep: specs.chuan_giao_tiep || specs.chuan_ket_noi || 'PCIe Gen 4.0 x4 M.2 NVMe',
            do_ben_tbw: specs.do_ben_tbw || specs.do_ben_chong_chiu || '',
            tinh_nang_dac_biet_linh_kien: specs.tinh_nang_dac_biet || '',
            he_thong_tan_nhiet: specs.he_thong_tan_nhiet || 'Heatsink Nhôm Hàng Không',
            tuong_thich_linh_kien: specs.tuong_thich || 'Laptop Gaming, PC Desktop, PS5',
            kich_co_laptop_linh_kien: specs.kich_co_laptop_phu_hop || '',
            trong_luong_linh_kien: typeof specs.trong_luong === 'number' ? `${specs.trong_luong}g` : (specs.trong_luong || ''),

            che_do_bao_hanh: specs.che_do_bao_hanh || '24 tháng chính hãng'
        };
        setFormSp(formSuaMoi);
        setFormSpGoc(JSON.parse(JSON.stringify(formSuaMoi)));
        setDangMoModalSp(true);
    };

    // Chuẩn bị dữ liệu hiển thị card sản phẩm xem trước tức thì
    const sanPhamXemTruoc = useMemo(() => {
        const thongSoGoc = (spDangSua && spDangSua.thong_so && typeof spDangSua.thong_so === 'object')
            ? { ...spDangSua.thong_so }
            : {};
        let thongSoForm = { ...thongSoGoc };

        if (loaiFormSanPham === 'laptop') {
            thongSoForm = {
                ...thongSoForm,
                cpu: formSp.cpu,
                so_nhan_luong: formSp.so_nhan_luong,
                xung_nhip_toi_da: formSp.xung_nhip_toi_da,
                bo_nho_dem_cache: formSp.bo_nho_dem_cache,
                chip_ai_npu: formSp.chip_ai_npu,
                hieu_nang_ai_tops: formSp.hieu_nang_ai_tops,
                card_do_hoa: formSp.card_do_hoa,
                dung_luong_vram: formSp.dung_luong_vram,
                cong_suat_tgp: formSp.cong_suat_tgp,
                ho_tro_ray_tracing: formSp.ho_tro_ray_tracing,
                ram: formSp.ram,
                loai_ram: formSp.loai_ram,
                toc_do_bus: formSp.toc_do_bus,
                nang_cap_ram_toi_da: formSp.nang_cap_ram_toi_da,
                o_cung: formSp.o_cung,
                khe_cam_mo_rong: formSp.khe_cam_mo_rong,
                man_hinh: formSp.man_hinh,
                do_phan_giai: formSp.do_phan_giai,
                tan_so_quet: formSp.tan_so_quet,
                tam_nen: formSp.tam_nen,
                do_phu_mau: formSp.do_phu_mau,
                do_sang_nits: formSp.do_sang_nits,
                cong_nghe_man_hinh: formSp.cong_nghe_man_hinh,
                dung_luong_pin: formSp.pin,
                pin: formSp.pin,
                thoi_luong_su_dung_uoc_tinh: formSp.thoi_luong_su_dung_uoc_tinh,
                cong_suat_sac: formSp.cong_suat_sac,
                he_thong_tan_nhiet: formSp.he_thong_tan_nhiet,
                chi_tiet_tan_nhiet: formSp.chi_tiet_tan_nhiet || formSp.he_thong_tan_nhiet,
                trong_luong: formSp.trong_luong,
                kich_thuoc: formSp.kich_thuoc,
                chat_lieu_vo: formSp.chat_lieu_vo,
                cong_ket_noi: formSp.cong_ket_noi,
                chuan_wifi_bluetooth: formSp.chuan_wifi_bluetooth,
                ban_phim: formSp.ban_phim,
                am_thanh: formSp.am_thanh,
                he_dieu_hanh: formSp.he_dieu_hanh,
                che_do_bao_hanh: formSp.che_do_bao_hanh
            };
        } else if (loaiFormSanPham === 'ban_phim') {
            thongSoForm = {
                ...thongSoForm,
                switch: formSp.loai_switch,
                loai_switch: formSp.loai_switch,
                tinh_nang_dac_biet: formSp.tinh_nang_dac_biet,
                cau_truc_mount: formSp.cau_truc_mount,
                layout: formSp.layout_ban_phim,
                layout_ban_phim: formSp.layout_ban_phim,
                keycap: formSp.keycap_chat_lieu,
                keycap_chat_lieu: formSp.keycap_chat_lieu,
                chat_lieu_case: formSp.chat_lieu_case,
                kieu_ket_noi: formSp.kieu_ket_noi_gear,
                ket_noi: formSp.kieu_ket_noi_gear,
                led_rgb: formSp.led_rgb_gear,
                den_led: formSp.led_rgb_gear,
                dung_luong_pin: formSp.dung_luong_pin_gear,
                hot_swap: formSp.hot_swap,
                tuong_thich: formSp.tuong_thich_gear,
                trong_luong: formSp.trong_luong_gear,
                che_do_bao_hanh: formSp.che_do_bao_hanh
            };
        } else if (loaiFormSanPham === 'chuot') {
            thongSoForm = {
                ...thongSoForm,
                cam_bien: formSp.cam_bien_chuot,
                mat_doc_cam_bien: formSp.cam_bien_chuot,
                do_phan_giai_dpi: formSp.do_phan_giai_dpi,
                toc_do_ips_gia_toc: formSp.toc_do_ips_gia_toc,
                switch_chuot: formSp.switch_chuot,
                polling_rate: formSp.polling_rate,
                loai_lot_chuot: formSp.loai_lot_chuot,
                chat_lieu_be_mat: formSp.chat_lieu_be_mat,
                chat_lieu_de: formSp.chat_lieu_de,
                trong_luong: formSp.trong_luong_chuot,
                kieu_ket_noi: formSp.kieu_ket_noi_chuot,
                ket_noi: formSp.kieu_ket_noi_chuot,
                che_do_led: formSp.che_do_led,
                thoi_luong_pin: formSp.thoi_luong_pin_chuot,
                dung_luong_pin: formSp.thoi_luong_pin_chuot,
                chat_lieu_feet: formSp.chat_lieu_feet,
                kich_thuoc: formSp.kich_thuoc_chuot,
                che_do_bao_hanh: formSp.che_do_bao_hanh
            };
        } else if (loaiFormSanPham === 'balo') {
            thongSoForm = {
                ...thongSoForm,
                kich_co_laptop_phu_hop: formSp.kich_co_laptop_phu_hop,
                dung_tich: formSp.dung_tich_balo,
                so_ngan_chua: formSp.so_ngan_chua,
                kich_thuoc: formSp.kich_thuoc_balo,
                trong_luong: formSp.trong_luong_tui,
                chat_lieu_chinh: formSp.chat_lieu_chinh,
                chat_lieu_vai: formSp.chat_lieu_chinh,
                lop_lot_bao_ve: formSp.lop_lot_bao_ve,
                khoa_keo: formSp.khoa_keo,
                khang_nuoc: formSp.kha_nang_khang_nuoc,
                kha_nang_khang_nuoc: formSp.kha_nang_khang_nuoc,
                dem_lung_thoang_khi: formSp.dem_lung_thoang_khi,
                cong_tinh_nang: formSp.cong_tinh_nang,
                che_do_bao_hanh: formSp.che_do_bao_hanh
            };
        } else if (loaiFormSanPham === 'tai_nghe') {
            thongSoForm = {
                ...thongSoForm,
                mang_loa_driver: formSp.mang_loa_driver,
                cong_nghe_am_thanh: formSp.cong_nghe_am_thanh,
                tan_so_dap_ung: formSp.tan_so_dap_ung,
                dai_tan_so: formSp.tan_so_dap_ung,
                tro_khang_do_nhay: formSp.tro_khang_do_nhay,
                chong_on_anc: formSp.chong_on_anc,
                chuan_ket_noi: formSp.kieu_ket_noi_tai_nghe,
                kieu_ket_noi: formSp.kieu_ket_noi_tai_nghe,
                ket_noi: formSp.kieu_ket_noi_tai_nghe,
                thoi_luong_pin: formSp.thoi_luong_pin_tai_nghe,
                dung_luong_pin: formSp.thoi_luong_pin_tai_nghe,
                khang_nuoc: formSp.khang_nuoc_tai_nghe,
                dem_tai: formSp.dem_tai,
                bo_dieu_khien: formSp.bo_dieu_khien,
                kich_thuoc: formSp.kich_thuoc_tai_nghe,
                trong_luong: formSp.trong_luong_tai_nghe,
                micro: formSp.micro_dam_thoai,
                che_do_bao_hanh: formSp.che_do_bao_hanh
            };
        } else if (loaiFormSanPham === 'sac_hub') {
            thongSoForm = {
                ...thongSoForm,
                cong_suat_tong: formSp.cong_suat_tong,
                cong_suat_toi_da: formSp.cong_suat_tong,
                cong_nghe_sac: formSp.cong_nghe_sac,
                giao_thuc_ho_tro: formSp.giao_thuc_ho_tro,
                dung_luong_pin: formSp.dung_luong_pin_sac,
                man_hinh_hien_thi: formSp.man_hinh_hien_thi,
                tinh_nang_an_toan: formSp.tinh_nang_an_toan,
                so_cong_sac: formSp.so_cong_sac,
                so_cong_dau_ra: formSp.so_cong_sac,
                bang_thong_truyen_du_lieu: formSp.bang_thong_truyen_du_lieu,
                cong_suat_sac_pass_through: formSp.cong_suat_sac_pass_through,
                xuat_hinh_anh: formSp.xuat_hinh_anh,
                chieu_dai_cap: formSp.chieu_dai_cap,
                chat_lieu_vo: formSp.chat_lieu_vo_sac,
                tuong_thich: formSp.tuong_thich_sac,
                kich_thuoc_trong_luong: formSp.kich_thuoc_trong_luong_sac,
                kich_thuoc: formSp.kich_thuoc_sac,
                trong_luong: formSp.trong_luong_sac,
                che_do_bao_hanh: formSp.che_do_bao_hanh
            };
        } else {
            thongSoForm = {
                ...thongSoForm,
                loai_linh_kien: formSp.loai_linh_kien,
                chuan_giao_tiep: formSp.chuan_giao_tiep,
                dung_luong: formSp.dung_luong_linh_kien,
                toc_do: formSp.toc_do_doc_ghi,
                toc_do_doc_ghi: formSp.toc_do_doc_ghi,
                toc_do_bus: formSp.toc_do_bus_linh_kien,
                do_tre_cl: formSp.do_tre_cl,
                so_nhan_luong: formSp.so_nhan_luong_linh_kien,
                xung_nhip_toi_da: formSp.xung_nhip_toi_da_linh_kien,
                bo_nho_dem_cache: formSp.bo_nho_dem_cache_linh_kien,
                cong_suat_tdp: formSp.cong_suat_tdp,
                ho_tro_ram: formSp.ho_tro_ram,
                toc_do_quat: formSp.toc_do_quat,
                hieu_qua_giam_nhiet: formSp.hieu_qua_giam_nhiet,
                do_dan_nhiet: formSp.do_dan_nhiet,
                do_ben_tbw: formSp.do_ben_tbw,
                tinh_nang_dac_biet: formSp.tinh_nang_dac_biet_linh_kien,
                he_thong_tan_nhiet: formSp.he_thong_tan_nhiet,
                tuong_thich: formSp.tuong_thich_linh_kien,
                kich_co_laptop_phu_hop: formSp.kich_co_laptop_linh_kien,
                trong_luong: formSp.trong_luong_linh_kien,
                che_do_bao_hanh: formSp.che_do_bao_hanh
            };
        }

        if (Array.isArray(thongSoTuyChinh)) {
            thongSoTuyChinh.forEach(item => {
                if (item.key?.trim() && item.value?.trim()) {
                    const slugKey = chuyenKeySangSlug(item.key);
                    thongSoForm[slugKey] = item.value.trim();
                }
            });
        }

        return {
            _id: spDangSua?._id || 'xem_truoc_card',
            id: spDangSua?._id || 'xem_truoc_card',
            ma_san_pham: formSp.ma_san_pham || 'SKU-SAMPLE',
            ten_san_pham: formSp.ten_san_pham || 'Tên Sản Phẩm Mẫu',
            hang_san_xuat: formSp.hang_san_xuat || 'asus',
            danh_muc: Array.isArray(formSp.danh_muc) && formSp.danh_muc.length > 0 ? formSp.danh_muc : ['gaming'],
            gia_goc: Number(formSp.gia_goc) || 0,
            gia_khuyen_mai: Number(formSp.gia_khuyen_mai) || 0,
            phan_tram_giam_gia: Number(formSp.phan_tram_giam_gia) || 0,
            hinh_anh_chinh: formSp.hinh_anh_chinh || '/images/sp/asus_rog_scar18.jpg',
            hinh_anh_phu: formSp.thu_vien_hinh_anh || [],
            thu_vien_hinh_anh: formSp.thu_vien_hinh_anh && formSp.thu_vien_hinh_anh.length > 0
                ? formSp.thu_vien_hinh_anh
                : (spDangSua?.thu_vien_hinh_anh && spDangSua.thu_vien_hinh_anh.length > 0
                    ? spDangSua.thu_vien_hinh_anh
                    : [formSp.hinh_anh_chinh || '/images/sp/asus_rog_scar18.jpg']),
            video_demo: formSp.video_demo || spDangSua?.video_demo || '/videos/1-2_1080p_202608242249.mp4',
            dac_diem_noi_bat: Array.isArray(formSp.dac_diem_noi_bat) && formSp.dac_diem_noi_bat.length > 0
                ? formSp.dac_diem_noi_bat
                : (Array.isArray(spDangSua?.dac_diem_noi_bat) ? spDangSua.dac_diem_noi_bat : []),
            qua_tang: Array.isArray(formSp.qua_tang) && formSp.qua_tang.length > 0
                ? formSp.qua_tang
                : (Array.isArray(spDangSua?.qua_tang) ? spDangSua.qua_tang : []),
            ton_kho: Array.isArray(spDangSua?.ton_kho) && spDangSua.ton_kho.length > 0
                ? spDangSua.ton_kho
                : [],
            so_luong_ton_kho: Number(formSp.so_luong_ton_kho) || 10,
            con_hang: formSp.con_hang !== false,
            la_flash_sale: !!formSp.la_flash_sale,
            so_luong_flash_sale: Number(formSp.so_luong_flash_sale) || 0,
            da_ban_flash_sale: Number(formSp.da_ban_flash_sale) || 0,
            tuy_chon_phien_ban: formSp.tuy_chon_phien_ban && formSp.tuy_chon_phien_ban.length > 0
                ? formSp.tuy_chon_phien_ban
                : (spDangSua?.tuy_chon_phien_ban || []),
            thong_so: thongSoForm,
            mo_ta_chi_tiet: formSp.mo_ta_chi_tiet || spDangSua?.mo_ta_chi_tiet || '',
            rating: spDangSua?.rating || spDangSua?.diem_danh_gia_tb || 5,
            diem_danh_gia_tb: spDangSua?.diem_danh_gia_tb || spDangSua?.rating || 5,
            so_danh_gia: spDangSua?.so_danh_gia || spDangSua?.so_luong_danh_gia || 16,
            so_luong_danh_gia: spDangSua?.so_luong_danh_gia || spDangSua?.so_danh_gia || 16,
            so_luong_da_ban: spDangSua?.so_luong_da_ban || 18,
            danh_gia: Array.isArray(spDangSua?.danh_gia) && spDangSua.danh_gia.length > 0
                ? spDangSua.danh_gia
                : [
                    {
                        id: 'dg-1',
                        ten_nguoi_dung: 'Hoàng Long (Gamer Pro)',
                        so_sao: 5,
                        tieu_de: 'Cỗ máy quái vật đích thực!',
                        noi_dung: 'Màn hình hiển thị sắc nét đỉnh cao, hiệu năng đồ họa cực khủng mượt mà không giật lag. Tản nhiệt êm ái.',
                        ngay_danh_gia: '12/09/2026',
                        da_mua_hang: true
                    },
                    {
                        id: 'dg-2',
                        ten_nguoi_dung: 'Minh Trí (Creator)',
                        so_sao: 5,
                        tieu_de: 'Rất đáng tiền',
                        noi_dung: 'Xử lý các tác vụ render nặng siêu tốc độ, cấu hình quá ngon trong tầm giá.',
                        ngay_danh_gia: '08/09/2026',
                        da_mua_hang: true
                    }
                ]
        };
    }, [spDangSua, formSp, loaiFormSanPham, thongSoTuyChinh]);

    // Dữ liệu hỗ trợ xem trước trang chi tiết sản phẩm 1:1 chuẩn trang bán lẻ
    const dacDiemNoiBatXemTruoc = useMemo(() => {
        if (Array.isArray(sanPhamXemTruoc.dac_diem_noi_bat) && sanPhamXemTruoc.dac_diem_noi_bat.length > 0) {
            return sanPhamXemTruoc.dac_diem_noi_bat;
        }
        const ts = sanPhamXemTruoc.thong_so || {};
        const ds = [];
        if (ts.cpu && ts.card_do_hoa) ds.push(`Bộ đôi tối thượng ${ts.cpu} và ${ts.card_do_hoa}`);
        else if (ts.cpu) ds.push(`Vi xử lý mạnh mẽ ${ts.cpu}`);
        else if (ts.card_do_hoa) ds.push(`Card đồ họa thế hệ mới ${ts.card_do_hoa}`);
        if (ts.ram && ts.o_cung) ds.push(`Bộ nhớ ${ts.ram} tốc độ cao, lưu trữ ${ts.o_cung} chuẩn NVMe tốc độ vượt trội`);
        else if (ts.ram) ds.push(`Bộ nhớ RAM ${ts.ram} đa nhiệm mượt mà`);
        if (ts.man_hinh) ds.push(`Màn hình sắc nét đỉnh cao: ${ts.man_hinh}`);
        if (ts.switch || ts.loai_switch) ds.push(`Trang bị switch cơ học ${ts.switch || ts.loai_switch} siêu bền`);
        if (ts.cam_bien) ds.push(`Cảm biến quang học cao cấp ${ts.cam_bien}`);
        if (ts.dung_luong_pin || ts.pin) ds.push(`Thời lượng pin ấn tượng: ${ts.dung_luong_pin || ts.pin}`);
        if (ts.che_do_bao_hanh) ds.push(`Chế độ bảo hành: ${ts.che_do_bao_hanh}`);
        if (ds.length === 0) ds.push('Thiết kế cao cấp, chất liệu bền bỉ chuẩn công nghệ mới');
        return ds.slice(0, 5);
    }, [sanPhamXemTruoc]);

    const tuyChonHienTaiXemTruoc = useMemo(() => {
        if (tuyChonXemTruoc) return tuyChonXemTruoc;
        if (sanPhamXemTruoc.tuy_chon_phien_ban && sanPhamXemTruoc.tuy_chon_phien_ban.length > 0) {
            return sanPhamXemTruoc.tuy_chon_phien_ban[0];
        }
        return null;
    }, [tuyChonXemTruoc, sanPhamXemTruoc]);

    const giaHienTaiXemTruoc = (sanPhamXemTruoc.gia_khuyen_mai || sanPhamXemTruoc.gia_goc || 0) + (tuyChonHienTaiXemTruoc ? Number(tuyChonHienTaiXemTruoc.chenh_lech_gia || 0) : 0);
    const giaGocHienTaiXemTruoc = (sanPhamXemTruoc.gia_goc || sanPhamXemTruoc.gia_khuyen_mai || 0) + (tuyChonHienTaiXemTruoc ? Number(tuyChonHienTaiXemTruoc.chenh_lech_gia || 0) : 0);
    const tienTietKiemXemTruoc = giaGocHienTaiXemTruoc > giaHienTaiXemTruoc ? (giaGocHienTaiXemTruoc - giaHienTaiXemTruoc) : 0;

    const xuLyLuuSanPham = async (e) => {
        e.preventDefault();
        setDangLuuSp(true);
        try {
            // Bảo toàn tuyệt đối mọi thông số kỹ thuật gốc có trong DB (không bị ghi đè mất các trường sâu)
            const thongSoGoc = (spDangSua && spDangSua.thong_so && typeof spDangSua.thong_so === 'object')
                ? { ...spDangSua.thong_so }
                : {};
            let thongSoPayload = { ...thongSoGoc };

            const tachChuoiThanhMang = (val) => {
                if (Array.isArray(val)) return val;
                if (!val || typeof val !== 'string') return [];
                return val.split(/[,•\n]/).map(s => s.trim()).filter(Boolean);
            };

            if (loaiFormSanPham === 'laptop') {
                thongSoPayload = {
                    ...thongSoPayload,
                    // Nhóm 1: CPU
                    cpu: formSp.cpu || '',
                    so_nhan_luong: formSp.so_nhan_luong || '',
                    xung_nhip_toi_da: formSp.xung_nhip_toi_da || '',
                    bo_nho_dem_cache: formSp.bo_nho_dem_cache || '',
                    chip_ai_npu: formSp.chip_ai_npu || '',
                    hieu_nang_ai_tops: formSp.hieu_nang_ai_tops ? (isNaN(Number(formSp.hieu_nang_ai_tops)) ? formSp.hieu_nang_ai_tops : Number(formSp.hieu_nang_ai_tops)) : '',

                    // Nhóm 2: GPU
                    card_do_hoa: formSp.card_do_hoa || '',
                    dung_luong_vram: formSp.dung_luong_vram || '',
                    cong_suat_tgp: formSp.cong_suat_tgp ? (isNaN(Number(formSp.cong_suat_tgp)) ? formSp.cong_suat_tgp : Number(formSp.cong_suat_tgp)) : '',
                    ho_tro_ray_tracing: Boolean(formSp.ho_tro_ray_tracing),

                    // Nhóm 3: RAM & SSD
                    ram: formSp.ram || '',
                    loai_ram: formSp.loai_ram || '',
                    toc_do_bus: formSp.toc_do_bus ? (isNaN(Number(formSp.toc_do_bus)) ? formSp.toc_do_bus : Number(formSp.toc_do_bus)) : '',
                    nang_cap_ram_toi_da: formSp.nang_cap_ram_toi_da || '',
                    o_cung: formSp.o_cung || '',
                    khe_cam_mo_rong: formSp.khe_cam_mo_rong || '',

                    // Nhóm 4: Màn Hình
                    man_hinh: formSp.man_hinh || '',
                    do_phan_giai: formSp.do_phan_giai || '',
                    tan_so_quet: formSp.tan_so_quet ? (isNaN(Number(formSp.tan_so_quet)) ? formSp.tan_so_quet : Number(formSp.tan_so_quet)) : '',
                    tam_nen: formSp.tam_nen || '',
                    do_phu_mau: formSp.do_phu_mau || '',
                    do_sang_nits: formSp.do_sang_nits ? (isNaN(Number(formSp.do_sang_nits)) ? formSp.do_sang_nits : Number(formSp.do_sang_nits)) : '',
                    cong_nghe_man_hinh: tachChuoiThanhMang(formSp.cong_nghe_man_hinh),

                    // Nhóm 5: Pin, Tản Nhiệt & Khối Lượng
                    pin: formSp.pin || '',
                    dung_luong_pin: formSp.pin || '',
                    thoi_luong_su_dung_uoc_tinh: formSp.thoi_luong_su_dung_uoc_tinh || '',
                    cong_suat_sac: formSp.cong_suat_sac || '',
                    he_thong_tan_nhiet: formSp.he_thong_tan_nhiet || '',
                    chi_tiet_tan_nhiet: formSp.chi_tiet_tan_nhiet || formSp.he_thong_tan_nhiet || '',
                    trong_luong: formSp.trong_luong || '',
                    kich_thuoc: formSp.kich_thuoc || '',
                    chat_lieu_vo: formSp.chat_lieu_vo || '',

                    // Nhóm 6: Cổng Kết Nối & HĐH
                    cong_ket_noi: tachChuoiThanhMang(formSp.cong_ket_noi),
                    chuan_wifi_bluetooth: formSp.chuan_wifi_bluetooth || '',
                    ban_phim: formSp.ban_phim || '',
                    am_thanh: formSp.am_thanh || '',
                    he_dieu_hanh: formSp.he_dieu_hanh || '',
                    che_do_bao_hanh: formSp.che_do_bao_hanh || '24 tháng chính hãng'
                };
            } else if (loaiFormSanPham === 'ban_phim') {
                thongSoPayload = {
                    ...thongSoPayload,
                    switch: formSp.loai_switch || '',
                    loai_switch: formSp.loai_switch || '',
                    tinh_nang_dac_biet: formSp.tinh_nang_dac_biet || '',
                    cau_truc_mount: formSp.cau_truc_mount || '',
                    layout: formSp.layout_ban_phim || '',
                    layout_ban_phim: formSp.layout_ban_phim || '',
                    keycap: formSp.keycap_chat_lieu || '',
                    keycap_chat_lieu: formSp.keycap_chat_lieu || '',
                    chat_lieu_case: formSp.chat_lieu_case || '',
                    kieu_ket_noi: formSp.kieu_ket_noi_gear || '',
                    ket_noi: formSp.kieu_ket_noi_gear || '',
                    led_rgb: formSp.led_rgb_gear || '',
                    den_led: formSp.led_rgb_gear || '',
                    dung_luong_pin: formSp.dung_luong_pin_gear || '',
                    hot_swap: formSp.hot_swap || '',
                    tuong_thich: formSp.tuong_thich_gear || '',
                    trong_luong: formSp.trong_luong_gear || '',
                    che_do_bao_hanh: formSp.che_do_bao_hanh || '24 tháng chính hãng'
                };
            } else if (loaiFormSanPham === 'chuot') {
                thongSoPayload = {
                    ...thongSoPayload,
                    cam_bien: formSp.cam_bien_chuot || '',
                    mat_doc_cam_bien: formSp.cam_bien_chuot || '',
                    do_phan_giai_dpi: formSp.do_phan_giai_dpi || '',
                    toc_do_ips_gia_toc: formSp.toc_do_ips_gia_toc || '',
                    switch_chuot: formSp.switch_chuot || '',
                    polling_rate: formSp.polling_rate || '',
                    loai_lot_chuot: formSp.loai_lot_chuot || '',
                    chat_lieu_be_mat: formSp.chat_lieu_be_mat || '',
                    chat_lieu_de: formSp.chat_lieu_de || '',
                    trong_luong: formSp.trong_luong_chuot || '',
                    kieu_ket_noi: formSp.kieu_ket_noi_chuot || '',
                    ket_noi: formSp.kieu_ket_noi_chuot || '',
                    che_do_led: formSp.che_do_led || '',
                    thoi_luong_pin: formSp.thoi_luong_pin_chuot || '',
                    dung_luong_pin: formSp.thoi_luong_pin_chuot || '',
                    chat_lieu_feet: formSp.chat_lieu_feet || '',
                    kich_thuoc: formSp.kich_thuoc_chuot || '',
                    che_do_bao_hanh: formSp.che_do_bao_hanh || '24 tháng chính hãng'
                };
            } else if (loaiFormSanPham === 'balo') {
                thongSoPayload = {
                    ...thongSoPayload,
                    kich_co_laptop_phu_hop: formSp.kich_co_laptop_phu_hop || '',
                    dung_tich: formSp.dung_tich_balo || '',
                    so_ngan_chua: formSp.so_ngan_chua || '',
                    kich_thuoc: formSp.kich_thuoc_balo || '',
                    trong_luong: formSp.trong_luong_tui || '',
                    chat_lieu_chinh: formSp.chat_lieu_chinh || '',
                    chat_lieu_vai: formSp.chat_lieu_chinh || '',
                    lop_lot_bao_ve: formSp.lop_lot_bao_ve || '',
                    khoa_keo: formSp.khoa_keo || '',
                    khang_nuoc: formSp.kha_nang_khang_nuoc || '',
                    kha_nang_khang_nuoc: formSp.kha_nang_khang_nuoc || '',
                    dem_lung_thoang_khi: formSp.dem_lung_thoang_khi || '',
                    cong_tinh_nang: tachChuoiThanhMang(formSp.cong_tinh_nang),
                    che_do_bao_hanh: formSp.che_do_bao_hanh || '24 tháng chính hãng'
                };
            } else if (loaiFormSanPham === 'tai_nghe') {
                thongSoPayload = {
                    ...thongSoPayload,
                    mang_loa_driver: formSp.mang_loa_driver || '',
                    cong_nghe_am_thanh: formSp.cong_nghe_am_thanh || '',
                    tan_so_dap_ung: formSp.tan_so_dap_ung || '',
                    dai_tan_so: formSp.tan_so_dap_ung || '',
                    tro_khang_do_nhay: formSp.tro_khang_do_nhay || '',
                    chong_on_anc: formSp.chong_on_anc || '',
                    chuan_ket_noi: formSp.kieu_ket_noi_tai_nghe || '',
                    kieu_ket_noi: formSp.kieu_ket_noi_tai_nghe || '',
                    ket_noi: formSp.kieu_ket_noi_tai_nghe || '',
                    thoi_luong_pin: formSp.thoi_luong_pin_tai_nghe || '',
                    dung_luong_pin: formSp.thoi_luong_pin_tai_nghe || '',
                    khang_nuoc: formSp.khang_nuoc_tai_nghe || '',
                    dem_tai: formSp.dem_tai || '',
                    bo_dieu_khien: formSp.bo_dieu_khien || '',
                    kich_thuoc: formSp.kich_thuoc_tai_nghe || '',
                    trong_luong: formSp.trong_luong_tai_nghe || '',
                    micro: formSp.micro_dam_thoai || '',
                    che_do_bao_hanh: formSp.che_do_bao_hanh || '24 tháng chính hãng'
                };
            } else if (loaiFormSanPham === 'sac_hub') {
                thongSoPayload = {
                    ...thongSoPayload,
                    cong_suat_tong: formSp.cong_suat_tong || '',
                    cong_suat_toi_da: formSp.cong_suat_tong || '',
                    cong_nghe_sac: formSp.cong_nghe_sac || '',
                    giao_thuc_ho_tro: formSp.giao_thuc_ho_tro || '',
                    dung_luong_pin: formSp.dung_luong_pin_sac || '',
                    man_hinh_hien_thi: formSp.man_hinh_hien_thi || '',
                    tinh_nang_an_toan: formSp.tinh_nang_an_toan || '',
                    so_cong_sac: formSp.so_cong_sac || '',
                    so_cong_dau_ra: tachChuoiThanhMang(formSp.so_cong_sac),
                    bang_thong_truyen_du_lieu: formSp.bang_thong_truyen_du_lieu || '',
                    cong_suat_sac_pass_through: formSp.cong_suat_sac_pass_through || '',
                    xuat_hinh_anh: formSp.xuat_hinh_anh || '',
                    chieu_dai_cap: formSp.chieu_dai_cap || '',
                    chat_lieu_vo: formSp.chat_lieu_vo_sac || '',
                    tuong_thich: formSp.tuong_thich_sac || '',
                    kich_thuoc_trong_luong: formSp.kich_thuoc_trong_luong_sac || '',
                    kich_thuoc: formSp.kich_thuoc_sac || '',
                    trong_luong: formSp.trong_luong_sac || '',
                    che_do_bao_hanh: formSp.che_do_bao_hanh || '24 tháng chính hãng'
                };
            } else if (loaiFormSanPham === 'linh_kien') {
                thongSoPayload = {
                    ...thongSoPayload,
                    loai_linh_kien: formSp.loai_linh_kien || '',
                    chuan_giao_tiep: formSp.chuan_giao_tiep || '',
                    dung_luong: formSp.dung_luong_linh_kien || '',
                    toc_do: formSp.toc_do_doc_ghi || '',
                    toc_do_doc_ghi: formSp.toc_do_doc_ghi || '',
                    toc_do_bus: formSp.toc_do_bus_linh_kien || '',
                    do_tre_cl: formSp.do_tre_cl || '',
                    so_nhan_luong: formSp.so_nhan_luong_linh_kien || '',
                    xung_nhip_toi_da: formSp.xung_nhip_toi_da_linh_kien || '',
                    bo_nho_dem_cache: formSp.bo_nho_dem_cache_linh_kien || '',
                    cong_suat_tdp: formSp.cong_suat_tdp || '',
                    ho_tro_ram: formSp.ho_tro_ram || '',
                    toc_do_quat: formSp.toc_do_quat || '',
                    hieu_qua_giam_nhiet: formSp.hieu_qua_giam_nhiet || '',
                    do_dan_nhiet: formSp.do_dan_nhiet || '',
                    do_ben_tbw: formSp.do_ben_tbw || '',
                    tinh_nang_dac_biet: formSp.tinh_nang_dac_biet_linh_kien || '',
                    he_thong_tan_nhiet: formSp.he_thong_tan_nhiet || '',
                    tuong_thich: formSp.tuong_thich_linh_kien || '',
                    kich_co_laptop_phu_hop: formSp.kich_co_laptop_linh_kien || '',
                    trong_luong: formSp.trong_luong_linh_kien || '',
                    che_do_bao_hanh: formSp.che_do_bao_hanh || '24 tháng chính hãng'
                };
            }

            thongSoTuyChinh.forEach(item => {
                if (item.key.trim() && item.value.trim()) {
                    const slugKey = chuyenKeySangSlug(item.key);
                    thongSoPayload[slugKey] = item.value.trim();
                }
            });

            // Gán danh mục chuẩn tương ứng theo nhóm mặt hàng
            let danhMucChuan = Array.isArray(formSp.danh_muc) ? [...formSp.danh_muc] : [];
            if (loaiFormSanPham === 'balo') {
                danhMucChuan = ['balo-tui-chong-soc', 'phu-kien-gear'];
            } else if (loaiFormSanPham === 'ban_phim') {
                danhMucChuan = ['ban-phim-co', 'phu-kien-gear'];
            } else if (loaiFormSanPham === 'chuot') {
                danhMucChuan = ['chuot-lot-chuot', 'phu-kien-gear'];
            } else if (loaiFormSanPham === 'tai_nghe') {
                danhMucChuan = ['tai-nghe-loa', 'phu-kien-gear'];
            } else if (loaiFormSanPham === 'sac_hub') {
                danhMucChuan = ['sac-cap-hub', 'phu-kien-gear'];
            } else if (loaiFormSanPham === 'linh_kien') {
                danhMucChuan = ['linh-kien-nang-cap', 'linh-kien'];
            } else if (danhMucChuan.length === 0) {
                danhMucChuan = ['gaming'];
            }

            // Chuẩn hóa danh sách biến thể / màu sắc phụ
            const danhSachBienTheChuan = (formSp.tuy_chon_phien_ban || []).map((opt, i) => ({
                ma_tuy_chon: opt.ma_tuy_chon?.trim() || `opt-${i + 1}`,
                ten_tuy_chon: opt.ten_tuy_chon?.trim() || `Tùy chọn ${i + 1}`,
                chenh_lech_gia: Number(opt.chenh_lech_gia) || 0,
                hinh_anh: opt.hinh_anh?.trim() || formSp.hinh_anh_chinh?.trim() || '/images/sp/asus_rog_scar18.jpg'
            }));

            const payload = {
                ma_san_pham: formSp.ma_san_pham.toUpperCase().trim(),
                ten_san_pham: formSp.ten_san_pham.trim(),
                hang_san_xuat: formSp.hang_san_xuat.toLowerCase().trim(),
                danh_muc: danhMucChuan,
                gia_goc: Number(formSp.gia_goc) || 0,
                gia_khuyen_mai: Number(formSp.gia_khuyen_mai) || 0,
                phan_tram_giam_gia: Number(formSp.phan_tram_giam_gia) || 0,
                hinh_anh_chinh: formSp.hinh_anh_chinh.trim(),
                so_luong_ton_kho: Number(formSp.so_luong_ton_kho) || 0,
                con_hang: Boolean(formSp.con_hang),
                la_flash_sale: Boolean(formSp.la_flash_sale),
                la_ban_chay: Boolean(formSp.la_ban_chay),
                la_san_pham_moi: Boolean(formSp.la_san_pham_moi),
                mo_ta_chi_tiet: formSp.mo_ta_chi_tiet || '',
                dac_diem_noi_bat: (formSp.dac_diem_noi_bat || []).map(s => String(s).trim()).filter(Boolean),
                qua_tang: (formSp.qua_tang || []).filter(q => q && q.ten_qua_tang && q.ten_qua_tang.trim()).map(q => ({
                    ten_qua_tang: q.ten_qua_tang.trim(),
                    gia_tri: Number(q.gia_tri) || 0
                })),
                thong_so: thongSoPayload,
                tuy_chon_phien_ban: danhSachBienTheChuan,
                thu_vien_hinh_anh: formSp.thu_vien_hinh_anh || []
            };

            if (spDangSua) {
                await SanPhamService.capNhatSanPham(spDangSua.id || spDangSua._id, payload);
                hienThongBao(`Đã cập nhật "${payload.ten_san_pham}" thành công!`);
            } else {
                payload.id = formSp.ten_san_pham
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

                await SanPhamService.themSanPham(payload);
                hienThongBao(`Đã thêm mới "${payload.ten_san_pham}" vào kho!`);
            }

            setDangMoModalSp(false);
            setSpDangSua(null);
            taiDuLieuToanBo();
        } catch (err) {
            alert(`Lỗi: ${err.message}`);
        } finally {
            setDangLuuSp(false);
        }
    };

    const xuLyXoaSanPham = async (id, ten) => {
        const dongY = await xacNhan({
            tieuDe: 'Xóa Sản Phẩm Khỏi Hệ Thống?',
            noiDung: `Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm:\n"${ten}"?\n\nThao tác này không thể hoàn tác.`,
            loai: 'danger',
            nutXacNhan: 'Xóa Vĩnh Viễn',
            nutHuy: 'Hủy Bỏ'
        });
        if (!dongY) return;
        setDangXuLySpId(id);
        try {
            await SanPhamService.xoaSanPham(id);
            hienThongBao(`Đã xóa sản phẩm "${ten}" thành công!`);
            taiDuLieuToanBo();
        } catch (err) {
            canhBao({
                tieuDe: 'Không Thể Xóa Sản Phẩm',
                noiDung: err.message,
                loai: 'danger'
            });
        } finally {
            setDangXuLySpId(null);
        }
    };

    const xuLyToggleConHang = async (sp) => {
        const id = sp.id || sp._id;
        const dangBanHienTai = sp.con_hang !== false;
        const trangThaiMoi = !dangBanHienTai;

        // 1. Cập nhật state ngay lập tức (Realtime tức thì 0ms, không chờ API)
        setDanhSachSanPham(prev => prev.map(item => {
            const itemId = item.id || item._id;
            return itemId === id ? { ...item, con_hang: trangThaiMoi } : item;
        }));

        // 2. Thông báo Toast gọn gàng, chuẩn form hệ thống
        const tenNgan = rutGonTen(sp.ten_san_pham, 48);
        hienThongBao(
            trangThaiMoi ? `Đã mở bán: "${tenNgan}"` : `Đã tạm ẩn: "${tenNgan}"`,
            trangThaiMoi ? 'success' : 'info',
            'Trạng Thái Sản Phẩm'
        );

        // 3. Đồng bộ API ngầm trong nền
        try {
            await SanPhamService.capNhatSanPham(id, {
                con_hang: trangThaiMoi
            });
        } catch (err) {
            // Hoàn tác nếu có lỗi
            setDanhSachSanPham(prev => prev.map(item => {
                const itemId = item.id || item._id;
                return itemId === id ? { ...item, con_hang: dangBanHienTai } : item;
            }));
            hienThongBao(`Lỗi lưu trạng thái: ${err.message}`, 'danger', 'Lỗi Cập Nhật');
        }
    };

    const xuLyToggleFlashSale = async (sp) => {
        const id = sp.id || sp._id;
        const flashSaleHienTai = Boolean(sp.la_flash_sale);
        const trangThaiMoi = !flashSaleHienTai;

        // 1. Cập nhật state ngay lập tức (Realtime tức thì 0ms)
        setDanhSachSanPham(prev => prev.map(item => {
            const itemId = item.id || item._id;
            return itemId === id ? { ...item, la_flash_sale: trangThaiMoi } : item;
        }));

        // 2. Thông báo Toast gọn gàng chuẩn phong cách Flash Sale
        const tenNgan = rutGonTen(sp.ten_san_pham, 48);
        hienThongBao(
            trangThaiMoi ? `Đã kích hoạt Flash Sale: "${tenNgan}"` : `Đã tắt Flash Sale: "${tenNgan}"`,
            trangThaiMoi ? 'deal' : 'info',
            'Flash Sale & Hot Deal'
        );

        // 3. Đồng bộ API ngầm trong nền
        try {
            await SanPhamService.capNhatSanPham(id, {
                la_flash_sale: trangThaiMoi
            });
        } catch (err) {
            // Hoàn tác nếu có lỗi
            setDanhSachSanPham(prev => prev.map(item => {
                const itemId = item.id || item._id;
                return itemId === id ? { ...item, la_flash_sale: flashSaleHienTai } : item;
            }));
            hienThongBao(`Lỗi lưu Flash Sale: ${err.message}`, 'danger', 'Lỗi Cập Nhật');
        }
    };

    const xuLyLuuCaiDatKm = (e) => {
        if (e) e.preventDefault();
        setDangLuuKm(true);
        try {
            const daLuu = CaiDatService.luuCaiDatKhuyenMai(formCaiDatKm);
            setCaiDatKm(daLuu);
            hienThongBao('Đã lưu và áp dụng cấu hình Banner Khuyến Mãi thành công!');
        } catch (err) {
            canhBao({
                tieuDe: 'Lỗi Lưu Cấu Hình',
                noiDung: err.message,
                loai: 'danger'
            });
        } finally {
            setDangLuuKm(false);
        }
    };

    const xuLyKhoiPhucCaiDatKm = async () => {
        const dongY = await xacNhan({
            tieuDe: 'Khôi Phục Cài Đặt Khuyến Mãi?',
            noiDung: 'Bạn có chắc muốn khôi phục cấu hình khuyến mãi về mặc định ban đầu không?',
            loai: 'warning',
            nutXacNhan: 'Khôi Phục Mặc Định',
            nutHuy: 'Hủy Bỏ'
        });
        if (!dongY) return;
        const macDinh = CaiDatService.khoiPhucMacDinh();
        setCaiDatKm(macDinh);
        setFormCaiDatKm(macDinh);
        hienThongBao('Đã khôi phục cấu hình khuyến mãi về mặc định!');
    };

    // ==========================================
    // HÀM XỬ LÝ ĐƠN HÀNG
    // ==========================================
    const moModalTaoDonHang = () => {
        setDonHangDangSua(null);
        setFormDonHang({
            ho_ten: '',
            so_dien_thoai: '',
            email: '',
            dia_chi_chi_tiet: '',
            ghi_chu: 'Khách mua trực tiếp tại quầy',
            san_pham_id: danhSachSanPham[0]?.id || '',
            so_luong: 1,
            hinh_thuc_thanh_toan: 'chuyen_khoan_vietqr',
            da_thanh_toan: true,
            trang_thai: 'da_xac_nhan',
            ma_giam_gia: ''
        });
        setDangMoModalDonHang(true);
    };

    const xuLyLuuDonHang = async (e) => {
        e.preventDefault();
        setDangLuuDonHang(true);
        try {
            const spChon = danhSachSanPham.find(s => s.id === formDonHang.san_pham_id || s._id === formDonHang.san_pham_id) || danhSachSanPham[0];
            const donGia = spChon ? spChon.gia_khuyen_mai : 20000000;
            const tamTinh = donGia * Number(formDonHang.so_luong);

            let tienGiam = 0;
            if (formDonHang.ma_giam_gia) {
                const vc = danhSachVoucher.find(v => v.ma_code === formDonHang.ma_giam_gia.toUpperCase().trim());
                if (vc && vc.kich_hoat) {
                    tienGiam = vc.loai_giam === 'tien_mat' ? vc.gia_tri_giam : (tamTinh * vc.gia_tri_giam) / 100;
                }
            }
            const tongTien = Math.max(0, tamTinh - tienGiam);

            const payloadDonHang = {
                id: donHangDangSua ? (donHangDangSua.id || donHangDangSua._id) : `dh_admin_${Date.now()}`,
                ma_don_hang: donHangDangSua ? donHangDangSua.ma_don_hang : `LPN-${Date.now().toString().slice(-4)}`,
                id_nguoi_dung: donHangDangSua?.id_nguoi_dung || 'admin_root',
                thong_tin_giao_hang: {
                    ho_ten: formDonHang.ho_ten,
                    so_dien_thoai: formDonHang.so_dien_thoai,
                    email: formDonHang.email,
                    dia_chi_chi_tiet: formDonHang.dia_chi_chi_tiet,
                    ghi_chu: formDonHang.ghi_chu
                },
                danh_sach_san_pham: [
                    {
                        san_pham_id: spChon ? spChon.id : 'sp_1',
                        ten_san_pham: spChon ? spChon.ten_san_pham : 'Sản Phẩm TNTP Store',
                        hinh_anh: spChon ? spChon.hinh_anh_chinh : '/images/asus_rog_scar18.jpg',
                        gia_tai_thoi_diem_them: donGia,
                        so_luong: Number(formDonHang.so_luong)
                    }
                ],
                tam_tinh: tamTinh,
                tien_giam_gia: tienGiam,
                ma_giam_gia: formDonHang.ma_giam_gia || '',
                phi_van_chuyen: 0,
                tong_tien_thanh_toan: tongTien,
                hinh_thuc_thanh_toan: formDonHang.hinh_thuc_thanh_toan,
                da_thanh_toan: Boolean(formDonHang.da_thanh_toan),
                trang_thai: formDonHang.trang_thai,
                lich_trinh_giao_hang: [
                    {
                        thoi_gian: new Date().toISOString(),
                        mo_ta: donHangDangSua ? 'Cập nhật thông tin đơn hàng' : 'Đơn hàng được tạo bởi Quản Trị Viên'
                    }
                ]
            };

            if (donHangDangSua) {
                await DonHangService.capNhatDonHang(donHangDangSua.id || donHangDangSua._id, payloadDonHang);
                hienThongBao(`Đã cập nhật đơn hàng ${payloadDonHang.ma_don_hang}!`);
            } else {
                await DonHangService.taoDonHang(payloadDonHang);
                hienThongBao(`Đã tạo đơn hàng mới ${payloadDonHang.ma_don_hang}!`);
            }

            setDangMoModalDonHang(false);
            setDonHangDangSua(null);
            taiDuLieuToanBo();
        } catch (err) {
            alert(`Lỗi lưu đơn hàng: ${err.message}`);
        } finally {
            setDangLuuDonHang(false);
        }
    };

    const xuLyDoiTrangThaiDonHang = async (id, trangThaiMoi) => {
        setDangXuLyDonHangId(id);
        try {
            await DonHangService.capNhatDonHang(id, {
                trang_thai: trangThaiMoi,
                da_thanh_toan: trangThaiMoi === 'da_giao' ? true : undefined
            });
            const thongBaoText = trangThaiMoi === 'da_giao'
                ? 'Giao hàng thành công! Đã tự động trừ tồn kho & tăng số lượng đã bán.'
                : trangThaiMoi === 'da_huy'
                    ? 'Đã hủy đơn hàng! Đã hoàn trả tồn kho & điều chỉnh lại số lượng.'
                    : 'Đã cập nhật trạng thái đơn hàng thành công!';
            const kieuThongBao = trangThaiMoi === 'da_giao' ? 'success' : trangThaiMoi === 'da_huy' ? 'warning' : 'info';
            hienThongBao(thongBaoText, kieuThongBao, 'Kho & Đơn Hàng');
            taiDuLieuToanBo();
        } catch (err) {
            alert(`Lỗi: ${err.message}`);
        } finally {
            setDangXuLyDonHangId(null);
        }
    };

    const xuLyDoiTrangThaiThanhToan = async (id, daThanhToanMoi, hinhThuc) => {
        setDangXuLyDonHangId(id);
        try {
            const trangThaiThanhToan = daThanhToanMoi
                ? 'da_thanh_toan'
                : hinhThuc === 'tien_mat_cod'
                ? 'thanh_toan_khi_nhan_hang'
                : 'cho_thanh_toan';

            await DonHangService.capNhatDonHang(id, {
                da_thanh_toan: daThanhToanMoi,
                trang_thai_thanh_toan: trangThaiThanhToan
            });

            const thongBaoText = daThanhToanMoi
                ? 'Đã xác nhận thanh toán thành công (Thủ công)!'
                : 'Đã chuyển đơn về trạng thái chưa thanh toán!';
            hienThongBao(thongBaoText, daThanhToanMoi ? 'success' : 'warning', 'Thanh Toán');
            taiDuLieuToanBo();
        } catch (err) {
            alert(`Lỗi cập nhật thanh toán: ${err.message}`);
        } finally {
            setDangXuLyDonHangId(null);
        }
    };

    const xuLyXoaDonHang = async (id, maDon) => {
        const dongY = await xacNhan({
            tieuDe: 'Xóa Đơn Hàng Này?',
            noiDung: `Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng: "${maDon}"?`,
            loai: 'danger',
            nutXacNhan: 'Xóa Đơn Hàng',
            nutHuy: 'Hủy Bỏ'
        });
        if (!dongY) return;
        setDangXuLyDonHangId(id);
        try {
            await DonHangService.xoaDonHang(id);
            hienThongBao(`Đã xóa đơn hàng ${maDon}!`);
            taiDuLieuToanBo();
        } catch (err) {
            canhBao({
                tieuDe: 'Không Thể Xóa Đơn Hàng',
                noiDung: err.message,
                loai: 'danger'
            });
        } finally {
            setDangXuLyDonHangId(null);
        }
    };

    // ==========================================
    // HÀM XỬ LÝ HÃNG & THƯƠNG HIỆU
    // ==========================================
    const moModalThemDanhMuc = () => {
        setDmDangSua(null);
        setFormDm({
            ma_danh_muc: '',
            ten_danh_muc: '',
            loai: 'thuong_hieu',
            logo: '💻',
            xuat_xu: 'Chính Hãng',
            mo_ta: '',
            kich_hoat: true,
            thu_tu_hien_thi: danhSachDanhMuc.length + 1
        });
        setDangMoModalDanhMuc(true);
    };

    const moModalSuaDanhMuc = (dm) => {
        setDmDangSua(dm);
        setFormDm({
            ma_danh_muc: dm.ma_danh_muc || '',
            ten_danh_muc: dm.ten_danh_muc || '',
            loai: dm.loai || 'thuong_hieu',
            logo: dm.logo || '💻',
            xuat_xu: dm.xuat_xu || 'Chính Hãng',
            mo_ta: dm.mo_ta || '',
            kich_hoat: dm.kich_hoat !== false,
            thu_tu_hien_thi: dm.thu_tu_hien_thi || 1
        });
        setDangMoModalDanhMuc(true);
    };

    const xuLyLuuDanhMuc = async (e) => {
        e.preventDefault();
        setDangLuuDanhMuc(true);
        try {
            const payload = {
                ...formDm,
                ma_danh_muc: formDm.ma_danh_muc.toLowerCase().trim(),
                ten_danh_muc: formDm.ten_danh_muc.trim(),
                thu_tu_hien_thi: Number(formDm.thu_tu_hien_thi) || 1
            };

            if (dmDangSua) {
                await DanhMucService.capNhatDanhMuc(dmDangSua.id || dmDangSua._id || dmDangSua.ma_danh_muc, payload);
                hienThongBao(`Đã cập nhật thương hiệu "${payload.ten_danh_muc}"!`);
            } else {
                payload.id = 'brand-' + payload.ma_danh_muc;
                await DanhMucService.themDanhMuc(payload);
                hienThongBao(`Đã thêm thương hiệu "${payload.ten_danh_muc}" vào hệ thống!`);
            }

            setDangMoModalDanhMuc(false);
            setDmDangSua(null);
            taiDuLieuToanBo();
        } catch (err) {
            alert(`Lỗi lưu danh mục: ${err.message}`);
        } finally {
            setDangLuuDanhMuc(false);
        }
    };

    const xuLyToggleDanhMuc = async (dm) => {
        const id = dm.id || dm._id || dm.ma_danh_muc;
        const kichHoatHienTai = dm.kich_hoat !== false;
        const trangThaiMoi = !kichHoatHienTai;

        // 1. Cập nhật state tức thì (Realtime 0ms)
        setDanhSachDanhMuc(prev => prev.map(item => {
            const itemId = item.id || item._id || item.ma_danh_muc;
            return itemId === id ? { ...item, kich_hoat: trangThaiMoi } : item;
        }));

        // 2. Toast đồng bộ gọn gàng
        hienThongBao(
            trangThaiMoi ? `Đã kích hoạt: "${dm.ten_danh_muc}"` : `Đã tạm ngưng: "${dm.ten_danh_muc}"`,
            trangThaiMoi ? 'success' : 'info',
            'Hãng & Phân Khúc'
        );

        // 3. Gọi API nền
        try {
            await DanhMucService.capNhatDanhMuc(id, {
                kich_hoat: trangThaiMoi
            });
        } catch (err) {
            setDanhSachDanhMuc(prev => prev.map(item => {
                const itemId = item.id || item._id || item.ma_danh_muc;
                return itemId === id ? { ...item, kich_hoat: kichHoatHienTai } : item;
            }));
            hienThongBao(`Lỗi: ${err.message}`, 'danger', 'Lỗi Cập Nhật');
        }
    };

    const xuLyXoaDanhMuc = async (dm) => {
        const dongY = await xacNhan({
            tieuDe: 'Xóa Thương Hiệu / Danh Mục?',
            noiDung: `Bạn có chắc chắn muốn xóa thương hiệu "${dm.ten_danh_muc}" khỏi hệ thống?`,
            loai: 'danger',
            nutXacNhan: 'Xóa Thương Hiệu',
            nutHuy: 'Hủy Bỏ'
        });
        if (!dongY) return;
        const id = dm.id || dm._id || dm.ma_danh_muc;
        setDangXuLyDmId(id);
        try {
            await DanhMucService.xoaDanhMuc(id);
            hienThongBao(`Đã xóa thương hiệu "${dm.ten_danh_muc}"!`);
            taiDuLieuToanBo();
        } catch (err) {
            canhBao({
                tieuDe: 'Không Thể Xóa Thương Hiệu',
                noiDung: err.message,
                loai: 'danger'
            });
        } finally {
            setDangXuLyDmId(null);
        }
    };

    // ==========================================
    // HÀM XỬ LÝ KHÁCH HÀNG & THÀNH VIÊN
    // ==========================================
    const layNgayTaoKhachHang = (user) => {
        if (!user) return 'Chưa rõ';
        if (user.ngayTao) return user.ngayTao;
        if (user.createdAt) {
            try {
                const d = new Date(user.createdAt);
                if (!isNaN(d.getTime())) {
                    const ngay = String(d.getDate()).padStart(2, '0');
                    const thang = String(d.getMonth() + 1).padStart(2, '0');
                    const nam = d.getFullYear();
                    return `${ngay}/${thang}/${nam}`;
                }
            } catch (_) {}
        }
        if (typeof user.id === 'string' && user.id.startsWith('usr_')) {
            const ts = parseInt(user.id.replace('usr_', '').replace('gg_', ''), 10);
            if (!isNaN(ts) && ts > 1600000000000) {
                const d = new Date(ts);
                const ngay = String(d.getDate()).padStart(2, '0');
                const thang = String(d.getMonth() + 1).padStart(2, '0');
                const nam = d.getFullYear();
                return `${ngay}/${thang}/${nam}`;
            }
        }
        return '15/08/2026';
    };

    const moModalThemUser = () => {
        setUserDangSua(null);
        setFormUser({
            hoTen: '',
            email: '',
            matKhau: '123456',
            soDienThoai: '',
            hangThanhVien: 'Đồng',
            vaiTro: 'khach_hang',
            trangThai: 'hoat_dong',
            biKhoa: false,
            lyDoKhoa: ''
        });
        setDangMoModalUser(true);
    };

    const moModalSuaUser = (u) => {
        setUserDangSua(u);
        setFormUser({
            hoTen: u.hoTen || '',
            email: u.email || '',
            matKhau: '',
            soDienThoai: u.soDienThoai || '',
            hangThanhVien: u.hangThanhVien || 'Đồng',
            vaiTro: u.vaiTro || 'khach_hang',
            trangThai: u.trangThai || (u.biKhoa ? 'bi_khoa' : 'hoat_dong'),
            biKhoa: Boolean(u.biKhoa || u.trangThai === 'bi_khoa'),
            lyDoKhoa: u.lyDoKhoa || ''
        });
        setDangMoModalUser(true);
    };

    const xuLyLuuUser = async (e) => {
        e.preventDefault();
        setDangLuuUser(true);
        try {
            const payload = {
                hoTen: formUser.hoTen.trim(),
                email: formUser.email.trim().toLowerCase(),
                soDienThoai: formUser.soDienThoai.trim(),
                hangThanhVien: formUser.hangThanhVien,
                vaiTro: formUser.vaiTro,
                trangThai: formUser.trangThai || (formUser.biKhoa ? 'bi_khoa' : 'hoat_dong'),
                biKhoa: Boolean(formUser.biKhoa || formUser.trangThai === 'bi_khoa'),
                lyDoKhoa: formUser.lyDoKhoa || ''
            };

            if (formUser.matKhau) {
                payload.matKhau = formUser.matKhau;
            }

            if (userDangSua) {
                await NguoiDungService.capNhatNguoiDung(userDangSua.id || userDangSua._id, payload);
                hienThongBao(`Đã cập nhật tài khoản ${payload.email}!`);
            } else {
                payload.id = 'usr_' + Date.now();
                payload.ngayTao = layNgayTaoKhachHang({ createdAt: new Date() });
                await NguoiDungService.themNguoiDung(payload);
                hienThongBao(`Đã thêm tài khoản mới ${payload.email}!`);
            }

            setDangMoModalUser(false);
            setUserDangSua(null);
            taiDuLieuToanBo();
        } catch (err) {
            alert(`Lỗi lưu người dùng: ${err.message}`);
        } finally {
            setDangLuuUser(false);
        }
    };

    const xuLyKhoaNguoiDung = async (user) => {
        const dangKhoa = Boolean(user.biKhoa || user.trangThai === 'bi_khoa');
        const id = user.id || user._id;

        if (user.vaiTro === 'admin' && !dangKhoa) {
            const dongYAdmin = await xacNhan({
                tieuDe: 'Khóa Tài Khoản Quản Trị Viên?',
                noiDung: `CẢNH BÁO: "${user.hoTen}" là tài khoản Quản Trị Viên (Admin). Bạn có chắc chắn muốn tạm khóa tài khoản này không?`,
                loai: 'danger',
                nutXacNhan: 'Vẫn Khóa Admin',
                nutHuy: 'Hủy Bỏ'
            });
            if (!dongYAdmin) return;
        } else {
            const dongY = await xacNhan({
                tieuDe: dangKhoa ? 'Mở Khóa Tài Khoản Khách Hàng?' : 'Tạm Khóa Tài Khoản Khách Hàng?',
                noiDung: dangKhoa
                    ? `Bạn có muốn mở khóa cho tài khoản "${user.email}"? Khách hàng sẽ có thể đăng nhập và mua sắm lại bình thường.`
                    : `Bạn có chắc muốn tạm thời khóa tài khoản "${user.email}"? Tài khoản này sẽ bị chặn đăng nhập trên toàn hệ thống.`,
                loai: dangKhoa ? 'info' : 'danger',
                nutXacNhan: dangKhoa ? 'Mở Khóa Ngay' : 'Khóa Tạm Thời',
                nutHuy: 'Hủy Bỏ'
            });
            if (!dongY) return;
        }

        setDangXuLyUserId(id);
        try {
            const capNhat = dangKhoa
                ? { biKhoa: false, trangThai: 'hoat_dong', lyDoKhoa: '' }
                : { biKhoa: true, trangThai: 'bi_khoa', lyDoKhoa: 'Quản trị viên tạm khóa tài khoản' };

            await NguoiDungService.capNhatNguoiDung(id, capNhat);
            hienThongBao(dangKhoa ? `Đã mở khóa tài khoản ${user.email}!` : `Đã tạm khóa tài khoản ${user.email}!`);
            taiDuLieuToanBo();
        } catch (err) {
            canhBao({
                tieuDe: 'Không Thể Thay Đổi Trạng Thái',
                noiDung: err.message,
                loai: 'danger'
            });
        } finally {
            setDangXuLyUserId(null);
        }
    };

    const xuLyXoaUser = async (u) => {
        const dongY = await xacNhan({
            tieuDe: 'Xóa Tài Khoản Người Dùng?',
            noiDung: `Bạn có chắc muốn xóa vĩnh viễn tài khoản "${u.email}"?`,
            loai: 'danger',
            nutXacNhan: 'Xóa Tài Khoản',
            nutHuy: 'Hủy Bỏ'
        });
        if (!dongY) return;
        const id = u.id || u._id;
        setDangXuLyUserId(id);
        try {
            await NguoiDungService.xoaNguoiDung(id);
            hienThongBao(`Đã xóa tài khoản ${u.email}!`);
            taiDuLieuToanBo();
        } catch (err) {
            canhBao({
                tieuDe: 'Không Thể Xóa Tài Khoản',
                noiDung: err.message,
                loai: 'danger'
            });
        } finally {
            setDangXuLyUserId(null);
        }
    };

    const xuLyDoiVaiTroNguoiDung = async (user) => {
        const vaiTroMoi = user.vaiTro === 'admin' ? 'khach_hang' : 'admin';
        const dongY = await xacNhan({
            tieuDe: 'Thay Đổi Quyền Hạn Tài Khoản?',
            noiDung: `Bạn có muốn đổi quyền của "${user.hoTen}" thành [${vaiTroMoi === 'admin' ? 'QUẢN TRỊ VIÊN' : 'KHÁCH HÀNG'}]?`,
            loai: 'warning',
            nutXacNhan: 'Đổi Quyền',
            nutHuy: 'Hủy Bỏ'
        });
        if (!dongY) return;

        const id = user.id || user._id;
        setDangXuLyUserId(id);
        try {
            await NguoiDungService.capNhatNguoiDung(id, { vaiTro: vaiTroMoi });
            hienThongBao(`Đã cập nhật quyền tài khoản ${user.email}!`);
            taiDuLieuToanBo();
        } catch (err) {
            canhBao({
                tieuDe: 'Lỗi Cập Nhật Quyền',
                noiDung: err.message,
                loai: 'danger'
            });
        } finally {
            setDangXuLyUserId(null);
        }
    };

    // ==========================================
    // HÀM XỬ LÝ VOUCHER
    // ==========================================
    const moModalThemVoucher = () => {
        setVoucherDangSua(null);
        setFormVoucher({
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
        setDangMoModalVoucher(true);
    };

    const moModalSuaVoucher = (vc) => {
        setVoucherDangSua(vc);
        setFormVoucher({
            ma_code: vc.ma_code || '',
            tieu_de: vc.tieu_de || '',
            mo_ta: vc.mo_ta || '',
            loai_giam: vc.loai_giam || 'tien_mat',
            gia_tri_giam: vc.gia_tri_giam || 0,
            giam_toi_da: vc.giam_toi_da || 0,
            don_hang_toi_thieu: vc.don_hang_toi_thieu || 0,
            so_luong_phat_hanh: vc.so_luong_phat_hanh || 20,
            ngay_bat_dau: vc.ngay_bat_dau || '2026-08-01',
            ngay_het_han: vc.ngay_het_han || '2026-12-31',
            chuyen_muc: vc.chuyen_muc || 'toan_san',
            mau_sac: vc.mau_sac || 'rose',
            badge: vc.badge || 'HOT DEAL',
            kich_hoat: vc.kich_hoat !== false
        });
        setDangMoModalVoucher(true);
    };

    const xuLyLuuVoucher = async (e) => {
        e.preventDefault();
        setDangLuuVoucher(true);
        try {
            const payload = {
                ...formVoucher,
                ma_code: formVoucher.ma_code.toUpperCase().trim(),
                gia_tri_giam: Number(formVoucher.gia_tri_giam),
                don_hang_toi_thieu: Number(formVoucher.don_hang_toi_thieu),
                giam_toi_da: Number(formVoucher.giam_toi_da),
                so_luong_phat_hanh: Number(formVoucher.so_luong_phat_hanh) || 20,
                chuyen_muc: formVoucher.chuyen_muc || 'toan_san',
                mau_sac: formVoucher.mau_sac || 'rose',
                badge: formVoucher.badge || 'HOT DEAL'
            };

            if (voucherDangSua) {
                await MaGiamGiaService.capNhatMaGiamGia(voucherDangSua.id || voucherDangSua.ma_code || voucherDangSua._id, payload);
                hienThongBao(`Đã cập nhật mã giảm giá "${payload.ma_code}"!`);
            } else {
                await MaGiamGiaService.themMaGiamGia(payload);
                hienThongBao(`Đã tạo mã giảm giá "${payload.ma_code}" thành công!`);
            }

            setDangMoModalVoucher(false);
            setVoucherDangSua(null);
            taiDuLieuToanBo();
        } catch (err) {
            alert(`Lỗi: ${err.message}`);
        } finally {
            setDangLuuVoucher(false);
        }
    };

    const xuLyToggleVoucher = async (voucher) => {
        const id = voucher.id || voucher.ma_code || voucher._id;
        const kichHoatHienTai = voucher.kich_hoat !== false;
        const trangThaiMoi = !kichHoatHienTai;

        // 1. Cập nhật state tức thì (Realtime 0ms)
        setDanhSachVoucher(prev => prev.map(item => {
            const itemId = item.id || item.ma_code || item._id;
            return itemId === id ? { ...item, kich_hoat: trangThaiMoi } : item;
        }));

        // 2. Toast đồng bộ gọn gàng
        hienThongBao(
            trangThaiMoi ? `Đã kích hoạt mã: "${voucher.ma_code}"` : `Đã tạm ẩn mã: "${voucher.ma_code}"`,
            trangThaiMoi ? 'success' : 'info',
            'Mã Khuyến Mãi'
        );

        // 3. Gọi API nền
        try {
            await MaGiamGiaService.capNhatMaGiamGia(id, {
                kich_hoat: trangThaiMoi
            });
        } catch (err) {
            setDanhSachVoucher(prev => prev.map(item => {
                const itemId = item.id || item.ma_code || item._id;
                return itemId === id ? { ...item, kich_hoat: kichHoatHienTai } : item;
            }));
            hienThongBao(`Lỗi: ${err.message}`, 'danger', 'Lỗi Cập Nhật');
        }
    };

    const xuLyXoaVoucher = async (voucher) => {
        const dongY = await xacNhan({
            tieuDe: 'Xóa Mã Giảm Giá?',
            noiDung: `Bạn có chắc muốn xóa mã voucher: "${voucher.ma_code}"?`,
            loai: 'danger',
            nutXacNhan: 'Xóa Voucher',
            nutHuy: 'Hủy Bỏ'
        });
        if (!dongY) return;
        const id = voucher.id || voucher.ma_code || voucher._id;
        setDangXuLyVoucherId(id);
        try {
            await MaGiamGiaService.xoaMaGiamGia(id);
            hienThongBao(`Đã xóa voucher "${voucher.ma_code}"!`);
            taiDuLieuToanBo();
        } catch (err) {
            canhBao({
                tieuDe: 'Không Thể Xóa Voucher',
                noiDung: err.message,
                loai: 'danger'
            });
        } finally {
            setDangXuLyVoucherId(null);
        }
    };

    // ==========================================
    // HÀM XỬ LÝ TIN TỨC & BÀI VIẾT
    // ==========================================
    const moModalThemTinTuc = () => {
        setTinTucDangSua(null);
        setFormTinTuc({
            id: `tin-${Date.now().toString().slice(-6)}`,
            tieu_de: '',
            tom_tat: '',
            noi_dung: `### 1. Giới thiệu tổng quan\n\nNội dung chi tiết phân tích chuyên sâu...\n\n### 2. Đánh giá hiệu năng thực tế\n\nChi tiết kiểm nghiệm nhiệt độ và benchmark...\n\n> 💡 **Lời khuyên từ chuyên gia TNTP Laptop:**\n> Hãy chọn cấu hình phù hợp với nhu cầu công việc và ngân sách của bạn.`,
            hinh_anh: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
            chuyen_muc: 'Tư Vấn Mua Sắm',
            tac_gia: 'Chuyên Gia Công Nghệ TNTP Laptop',
            thoi_gian_doc: '5 phút đọc',
            la_tieu_diem: false,
            xuat_ban: true
        });
        setDangMoModalTinTuc(true);
    };

    const moModalSuaTinTuc = (tin) => {
        setTinTucDangSua(tin);
        setFormTinTuc({
            id: tin.id || '',
            tieu_de: tin.tieu_de || '',
            tom_tat: tin.tom_tat || '',
            noi_dung: tin.noi_dung || '',
            hinh_anh: tin.hinh_anh || 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
            chuyen_muc: tin.chuyen_muc || 'Tư Vấn Mua Sắm',
            tac_gia: tin.tac_gia || 'Ban Biên Tập',
            thoi_gian_doc: tin.thoi_gian_doc || '5 phút đọc',
            la_tieu_diem: Boolean(tin.la_tieu_diem),
            xuat_ban: tin.xuat_ban !== false
        });
        setDangMoModalTinTuc(true);
    };

    const xuLyLuuTinTuc = async (e) => {
        e.preventDefault();
        setDangLuuTinTuc(true);
        try {
            const payload = {
                ...formTinTuc,
                tieu_de: formTinTuc.tieu_de.trim(),
                tom_tat: formTinTuc.tom_tat.trim(),
                noi_dung: formTinTuc.noi_dung.trim(),
                hinh_anh: formTinTuc.hinh_anh.trim(),
                tac_gia: formTinTuc.tac_gia.trim()
            };

            if (tinTucDangSua) {
                await TinTucService.capNhatTinTuc(tinTucDangSua.id || tinTucDangSua._id, payload);
                hienThongBao(`Đã cập nhật bài viết "${payload.tieu_de}"!`);
            } else {
                await TinTucService.themTinTuc(payload);
                hienThongBao(`Đã xuất bản bài viết mới "${payload.tieu_de}"!`);
            }

            setDangMoModalTinTuc(false);
            setTinTucDangSua(null);
            taiDuLieuToanBo();
        } catch (err) {
            alert(`Lỗi: ${err.message}`);
        } finally {
            setDangLuuTinTuc(false);
        }
    };

    const xuLyToggleXuatBanTinTuc = async (tin) => {
        const id = tin.id || tin._id;
        const xuatBanHienTai = tin.xuat_ban !== false;
        const trangThaiMoi = !xuatBanHienTai;

        // 1. Cập nhật state tức thì (Realtime 0ms)
        setDanhSachTinTuc(prev => prev.map(item => {
            const itemId = item.id || item._id;
            return itemId === id ? { ...item, xuat_ban: trangThaiMoi } : item;
        }));

        // 2. Toast đồng bộ gọn gàng
        const tieuDeNgan = rutGonTen(tin.tieu_de, 26);
        hienThongBao(
            trangThaiMoi ? `Đã xuất bản: "${tieuDeNgan}"` : `Đã chuyển về bản nháp: "${tieuDeNgan}"`,
            trangThaiMoi ? 'success' : 'info',
            'Tin Tức & Bài Viết'
        );

        // 3. Gọi API nền
        try {
            await TinTucService.capNhatTinTuc(id, {
                xuat_ban: trangThaiMoi
            });
        } catch (err) {
            setDanhSachTinTuc(prev => prev.map(item => {
                const itemId = item.id || item._id;
                return itemId === id ? { ...item, xuat_ban: xuatBanHienTai } : item;
            }));
            hienThongBao(`Lỗi: ${err.message}`, 'danger', 'Lỗi Cập Nhật');
        }
    };

    const xuLyToggleTieuDiemTinTuc = async (tin) => {
        const id = tin.id || tin._id;
        const tieuDiemHienTai = Boolean(tin.la_tieu_diem);
        const trangThaiMoi = !tieuDiemHienTai;

        // 1. Cập nhật state tức thì (Realtime 0ms)
        setDanhSachTinTuc(prev => prev.map(item => {
            const itemId = item.id || item._id;
            return itemId === id ? { ...item, la_tieu_diem: trangThaiMoi } : item;
        }));

        // 2. Toast đồng bộ
        const tieuDeNgan = rutGonTen(tin.tieu_de, 26);
        hienThongBao(
            trangThaiMoi ? `Đã ghim Tiêu Điểm: "${tieuDeNgan}"` : `Đã bỏ ghim Tiêu Điểm: "${tieuDeNgan}"`,
            trangThaiMoi ? 'deal' : 'info',
            'Tin Tiêu Điểm Hot'
        );

        // 3. Gọi API nền
        try {
            await TinTucService.capNhatTinTuc(id, {
                la_tieu_diem: trangThaiMoi
            });
        } catch (err) {
            setDanhSachTinTuc(prev => prev.map(item => {
                const itemId = item.id || item._id;
                return itemId === id ? { ...item, la_tieu_diem: tieuDiemHienTai } : item;
            }));
            hienThongBao(`Lỗi: ${err.message}`, 'danger', 'Lỗi Cập Nhật');
        }
    };

    const xuLyXoaTinTuc = async (tin) => {
        const dongY = await xacNhan({
            tieuDe: 'Xóa Bài Viết Tin Tức?',
            noiDung: `Bạn có chắc muốn xóa bài viết: "${tin.tieu_de}"?`,
            loai: 'danger',
            nutXacNhan: 'Xóa Bài Viết',
            nutHuy: 'Hủy Bỏ'
        });
        if (!dongY) return;
        const id = tin.id || tin._id;
        setDangXuLyTinTucId(id);
        try {
            await TinTucService.xoaTinTuc(id);
            hienThongBao(`Đã xóa bài viết "${tin.tieu_de}"!`);
            taiDuLieuToanBo();
        } catch (err) {
            canhBao({
                tieuDe: 'Không Thể Xóa Bài Viết',
                noiDung: err.message,
                loai: 'danger'
            });
        } finally {
            setDangXuLyTinTucId(null);
        }
    };

    // ==========================================
    // CỔNG XÁC THỰC QUYỀN TRUY CẬP ADMIN
    // ==========================================
    // 1. Đang kiểm tra phiên đăng nhập từ LocalStorage / Token: Hiển thị loading nhẹ, KHÔNG BAO GIỜ hiện form đăng nhập chớp giật
    if (dangKiemTraPhien) {
        return (
            <div className="min-h-screen bg-[#f1f5f9] dark:bg-[#070b14] text-slate-900 dark:text-white flex flex-col items-center justify-center p-4">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Đang đồng bộ quyền quản trị...</p>
                </div>
            </div>
        );
    }

    // 2. Nếu đã đăng nhập nhưng tài khoản không có quyền Admin (vaiTro !== 'admin')
    if (daDangNhap && !laAdmin) {
        return (
            <div className="min-h-screen bg-[#f1f5f9] dark:bg-[#070b14] text-slate-900 dark:text-white flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-red-200 dark:border-red-900/50 p-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto text-3xl">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Từ Chối Truy Cập</h2>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Tài khoản <b>{nguoiDung?.email || 'hiện tại của bạn'}</b> không có quyền Quản trị viên để truy cập trang quản lý này.
                    </p>
                    <div className="pt-2 flex flex-col gap-2">
                        <button
                            onClick={dangXuat}
                            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer transition-all shadow-md"
                        >
                            Đăng Xuất Tài Khoản Này
                        </button>
                        <Link
                            href="/"
                            className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition-all text-center"
                        >
                            Quay Lại Cửa Hàng
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Nếu chưa đăng nhập: Hiển thị cổng đăng nhập quản trị
    if (!daDangNhap) {
        return (
            <div className="min-h-screen bg-[#f1f5f9] dark:bg-[#070b14] text-slate-900 dark:text-white flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-8 text-center bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-600 text-white">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 text-3xl shadow-inner">
                            💻
                        </div>
                        <h2 className="text-2xl font-black tracking-tight">TNTP LAPTOP ADMIN</h2>
                        <p className="text-xs text-blue-100 mt-1 uppercase tracking-wider font-bold">
                            Hệ Thống Quản Trị Cửa Hàng
                        </p>
                    </div>

                    <form onSubmit={xuLyDangNhapAdmin} className="p-8 space-y-4">
                        {loiLogin && (
                            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span>{loiLogin}</span>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <User className="w-4 h-4 text-blue-600" />
                                <span>Tài Khoản / Email Quản Trị</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={emailAdmin}
                                onChange={(e) => setEmailAdmin(e.target.value)}
                                placeholder="Nhập tài khoản quản trị"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <Lock className="w-4 h-4 text-blue-600" />
                                <span>Mật Khẩu Quản Trị</span>
                            </label>
                            <input
                                type="password"
                                required
                                value={matKhauAdmin}
                                onChange={(e) => setMatKhauAdmin(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={dangXuLyLogin}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25 active:scale-98 cursor-pointer disabled:opacity-50"
                        >
                            {dangXuLyLogin ? 'Đang xác thực...' : 'Đăng Nhập Quản Trị'}
                        </button>

                        <div className="text-center pt-2 flex items-center justify-between text-xs font-bold text-blue-600">
                            <Link href="/" className="hover:underline">
                                ← Quay lại Cửa hàng
                            </Link>
                            <Link href="/dang-nhap" className="hover:underline">
                                Cổng Đăng Nhập Website →
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // ==========================================
    // GIAO DIỆN CHÍNH ADMIN (7 TABS HOÀN THIỆN)
    // ==========================================
    return (
        <div className="h-screen w-screen overflow-hidden bg-[#e8ecf4] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex font-sans antialiased">
            {/* Custom Dialog Box (Hộp thoại xác nhận & cảnh báo thay thế alert / confirm trình duyệt) */}
            {hopThoai.hien && (
                <div 
                    className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-150"
                    onClick={(e) => {
                        if (e.target === e.currentTarget && hopThoai.kieu === 'alert') {
                            hopThoai.onHuy();
                        }
                    }}
                >
                    <div 
                        className={`bg-white dark:bg-[#0f172a] rounded-3xl w-full max-w-md border-2 shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-200 transition-all ${
                            hopThoai.loai === 'danger'
                                ? 'border-rose-400/80 dark:border-rose-700/80 shadow-rose-950/20'
                                : hopThoai.loai === 'warning'
                                    ? 'border-amber-400/80 dark:border-amber-600/80 shadow-amber-950/20'
                                    : hopThoai.loai === 'success'
                                        ? 'border-emerald-400/80 dark:border-emerald-600/80 shadow-emerald-950/20'
                                        : 'border-blue-400/80 dark:border-blue-600/80 shadow-blue-950/20'
                        }`}
                    >
                        {/* Header icon + text */}
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                                hopThoai.loai === 'danger'
                                    ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 ring-4 ring-rose-500/10'
                                    : hopThoai.loai === 'warning'
                                        ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800 ring-4 ring-amber-500/10'
                                        : hopThoai.loai === 'success'
                                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 ring-4 ring-emerald-500/10'
                                            : 'bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-800 ring-4 ring-blue-500/10'
                            }`}>
                                {hopThoai.loai === 'danger' && <Trash2 className="w-6 h-6" />}
                                {hopThoai.loai === 'warning' && <AlertTriangle className="w-6 h-6" />}
                                {hopThoai.loai === 'success' && <CheckCircle2 className="w-6 h-6" />}
                                {(!hopThoai.loai || hopThoai.loai === 'info') && <Info className="w-6 h-6" />}
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                                <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg leading-tight">
                                    {hopThoai.tieuDe}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed whitespace-pre-line font-medium">
                                    {hopThoai.noiDung}
                                </p>
                            </div>
                        </div>

                        {/* Button Actions */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                            {hopThoai.kieu === 'confirm' && (
                                <button
                                    type="button"
                                    onClick={hopThoai.onHuy}
                                    className="px-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
                                >
                                    {hopThoai.nutHuy || 'Hủy bỏ'}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={hopThoai.onXacNhan}
                                autoFocus
                                className={`px-5 py-2.5 rounded-xl text-white font-black text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2 active:scale-95 ${
                                    hopThoai.loai === 'danger'
                                        ? 'bg-gradient-to-r from-rose-600 via-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 shadow-rose-500/30'
                                        : hopThoai.loai === 'warning'
                                            ? 'bg-gradient-to-r from-amber-500 via-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/30'
                                            : hopThoai.loai === 'success'
                                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/30'
                                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30'
                                }`}
                            >
                                {hopThoai.kieu === 'confirm' && hopThoai.loai === 'danger' && <Trash2 className="w-4 h-4" />}
                                <span>{hopThoai.nutXacNhan || 'Xác Nhận'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SIDEBAR RỰC RỠ 7 TABS ĐẲNG CẤP (PINNED 100VH - KHÔNG BỊ TRỐNG HOẶC RỚT NÚT XUỐNG ĐÁY) */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-[#0d1527] border-r-2 border-slate-300 dark:border-slate-800 flex flex-col h-screen md:h-full justify-between transition-all duration-300 md:static shrink-0 ${sidebarMoMobile ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full md:translate-x-0'
                    } ${sidebarThuGon ? 'md:w-20' : 'md:w-64'}`}
            >
                {/* 1. Header & Logo với nút thu gọn trực tiếp */}
                <div className="p-4 pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    {!sidebarThuGon ? (
                        <div className="flex items-center justify-between">
                            <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                                    💻
                                </div>
                                <div className="truncate">
                                    <div className="font-black text-base text-slate-950 dark:text-white tracking-tight">TNTP LAPTOP</div>
                                    <div className="text-[10px] font-extrabold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">Hệ Thống Quản Trị</div>
                                </div>
                            </Link>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setSidebarThuGon(true)}
                                    className="hidden md:flex p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                                    title="Thu gọn menu thanh bên"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setSidebarMoMobile(false)}
                                    className="md:hidden p-1.5 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <Link href="/admin" title="TNTP LAPTOP Quản Trị">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                                    💻
                                </div>
                            </Link>
                            <button
                                onClick={() => setSidebarThuGon(false)}
                                className="hidden md:flex p-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-slate-800 dark:text-cyan-400 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                title="Mở rộng menu thanh bên"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* 2. Menu Điều Hướng Cuộn Độc Lập & Nhóm Rõ Ràng */}
                <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-4">
                    {/* Nhóm 1: Quản lý Cửa Hàng & Kho */}
                    <div className="space-y-1">
                        {!sidebarThuGon && (
                            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2.5 pb-1">
                                KHO & KINH DOANH
                            </div>
                        )}
                        <nav className="space-y-1 text-sm font-bold">
                            {/* 1. Tổng quan */}
                            <button
                                onClick={() => { setTabHienTai('tong_quan'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'tong_quan'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-blue-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Tổng Quan"
                            >
                                <LayoutDashboard className="w-5 h-5 shrink-0" />
                                {!sidebarThuGon && <span>Tổng Quan</span>}
                            </button>

                            {/* 2. Đơn hàng */}
                            <button
                                onClick={() => { setTabHienTai('don_hang'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'don_hang'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-orange-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Quản Lý Đơn Hàng"
                            >
                                <div className="flex items-center gap-3">
                                    <ShoppingBag className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Quản Lý Đơn Hàng</span>}
                                </div>
                                {!sidebarThuGon && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${tabHienTai === 'don_hang' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-950 dark:bg-orange-950 dark:text-orange-300'}`}>
                                        {danhSachDonHang.length}
                                    </span>
                                )}
                            </button>

                            {/* 3. Sản phẩm */}
                            <button
                                onClick={() => { setTabHienTai('san_pham'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'san_pham'
                                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-cyan-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Kho Hàng & Danh Sách Sản Phẩm"
                            >
                                <div className="flex items-center gap-3">
                                    <Laptop className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Kho Sản Phẩm</span>}
                                </div>
                                {!sidebarThuGon && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${tabHienTai === 'san_pham' ? 'bg-white/20 text-white' : 'bg-cyan-100 text-cyan-950 dark:bg-cyan-950 dark:text-cyan-300'}`}>
                                        {danhSachSanPham.length}
                                    </span>
                                )}
                            </button>

                            {/* 4. Hãng & Thương hiệu */}
                            <button
                                onClick={() => { setTabHienTai('danh_muc'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'danh_muc'
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-purple-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Hãng & Danh Mục"
                            >
                                <div className="flex items-center gap-3">
                                    <Layers className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Hãng & Danh Mục</span>}
                                </div>
                                {!sidebarThuGon && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${tabHienTai === 'danh_muc' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-950 dark:bg-purple-950 dark:text-purple-300'}`}>
                                        {danhSachDanhMuc.length}
                                    </span>
                                )}
                            </button>
                        </nav>
                    </div>

                    {/* Nhóm 2: Vận Hành & Nội Dung */}
                    <div className="space-y-1">
                        {!sidebarThuGon && (
                            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2.5 pb-1">
                                VẬN HÀNH & NỘI DUNG
                            </div>
                        )}
                        <nav className="space-y-1 text-sm font-bold">
                            {/* 5. Khách hàng */}
                            <button
                                onClick={() => { setTabHienTai('khach_hang'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'khach_hang'
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-emerald-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Tài Khoản Khách Hàng"
                            >
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Khách Hàng</span>}
                                </div>
                                {!sidebarThuGon && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${tabHienTai === 'khach_hang' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                                        {danhSachNguoiDung.length}
                                    </span>
                                )}
                            </button>

                            {/* 6. Mã giảm giá */}
                            <button
                                onClick={() => { setTabHienTai('voucher'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'voucher'
                                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-rose-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Mã Khuyến Mãi"
                            >
                                <div className="flex items-center gap-3">
                                    <Ticket className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Mã Khuyến Mãi</span>}
                                </div>
                                {!sidebarThuGon && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${tabHienTai === 'voucher' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-300'}`}>
                                        {danhSachVoucher.length}
                                    </span>
                                )}
                            </button>

                            {/* 7. Tin Tức & Bài Viết */}
                            <button
                                onClick={() => { setTabHienTai('tin_tuc'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'tin_tuc'
                                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-teal-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Quản Lý Tin Tức & Bài Viết"
                            >
                                <div className="flex items-center gap-3">
                                    <Newspaper className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Tin Tức & Bài Viết</span>}
                                </div>
                                {!sidebarThuGon && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${tabHienTai === 'tin_tuc' ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-950 dark:bg-teal-950 dark:text-teal-300'}`}>
                                        {danhSachTinTuc.length}
                                    </span>
                                )}
                            </button>

                            {/* 8. Banner & Khuyến Mãi */}
                            <button
                                onClick={() => { setTabHienTai('khuyen_mai'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'khuyen_mai'
                                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-pink-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Banner & Khuyến Mãi"
                            >
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Banner & Khuyến Mãi</span>}
                                </div>
                                {!sidebarThuGon && (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-black bg-pink-100 text-pink-950 dark:bg-pink-950 dark:text-pink-300">
                                        LIVE
                                    </span>
                                )}
                            </button>

                            {/* 9. Hệ Thống Showroom & Bản Đồ */}
                            <button
                                onClick={() => { setTabHienTai('showroom'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'showroom'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-blue-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Hệ Thống Showroom & Tọa Độ Bản Đồ"
                            >
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Showroom & Bản Đồ</span>}
                                </div>
                                {!sidebarThuGon && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${tabHienTai === 'showroom' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-950 dark:bg-blue-950 dark:text-blue-300'}`}>
                                        {danhSachShowroomAdmin.length}
                                    </span>
                                )}
                            </button>
                        </nav>
                    </div>

                    {/* Widget Trạng Thái Hệ Thống (Lấp đầy không gian, cực kỳ chuyên nghiệp) */}
                    {!sidebarThuGon && (
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800/60 dark:to-blue-950/20 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Hệ Thống Online
                                </span>
                                <span className="text-[10px] font-black text-blue-600 dark:text-cyan-400">Port 5000</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                                <div>
                                    <div className="text-[10px] text-slate-400 font-semibold">Tồn kho:</div>
                                    <div className="font-black text-slate-800 dark:text-slate-200">{thongKe.tongTonKho} máy</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-400 font-semibold">Đơn chờ:</div>
                                    <div className="font-black text-amber-600 dark:text-amber-400">{thongKe.donChoXacNhan} đơn</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Bottom Footer Links & Nút Thu Gọn Sidebar */}
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2 shrink-0 bg-white dark:bg-[#0d1527]">
                    <Link
                        href="/khuyen-mai"
                        target="_blank"
                        className={`w-full flex items-center gap-2 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold text-xs transition-colors border border-rose-200 dark:border-rose-800 ${sidebarThuGon ? 'justify-center px-0' : 'px-3'}`}
                        title="Xem Trang Khuyến Mãi"
                    >
                        <Tag className="w-4 h-4 shrink-0 text-rose-600" />
                        {!sidebarThuGon && <span>Xem Trang Khuyến Mãi</span>}
                    </Link>
                    <Link
                        href="/tin-tuc"
                        target="_blank"
                        className={`w-full flex items-center gap-2 py-2 rounded-2xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 font-bold text-xs transition-colors border border-teal-200 dark:border-teal-800 ${sidebarThuGon ? 'justify-center px-0' : 'px-3'}`}
                        title="Xem Trang Tin Tức"
                    >
                        <Newspaper className="w-4 h-4 shrink-0 text-teal-600" />
                        {!sidebarThuGon && <span>Xem Trang Tin Tức</span>}
                    </Link>
                    <Link
                        href="/lien-he"
                        target="_blank"
                        className={`w-full flex items-center gap-2 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 font-bold text-xs transition-colors border border-indigo-200 dark:border-indigo-800 ${sidebarThuGon ? 'justify-center px-0' : 'px-3'}`}
                        title="Xem Trang Liên Hệ & Bản Đồ"
                    >
                        <MapPin className="w-4 h-4 shrink-0 text-indigo-600" />
                        {!sidebarThuGon && <span>Xem Trang Liên Hệ</span>}
                    </Link>
                    <Link
                        href="/"
                        target="_blank"
                        className={`w-full flex items-center gap-2 py-2 rounded-2xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200 dark:border-slate-700 ${sidebarThuGon ? 'justify-center px-0' : 'px-3'}`}
                        title="Xem Cửa Hàng Bán Lẻ"
                    >
                        <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
                        {!sidebarThuGon && <span>Xem Cửa Hàng Bán Lẻ</span>}
                    </Link>

                    {/* Nút Thu Gọn / Mở Rộng Chân Sidebar */}
                    <button
                        onClick={() => setSidebarThuGon(!sidebarThuGon)}
                        className={`w-full hidden md:flex items-center gap-2.5 py-2 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-cyan-400 font-bold text-xs transition-colors cursor-pointer ${
                            sidebarThuGon ? 'justify-center px-0' : 'px-3 border border-dashed border-slate-200 dark:border-slate-700'
                        }`}
                        title={sidebarThuGon ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
                    >
                        {sidebarThuGon ? (
                            <ChevronRight className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                        ) : (
                            <>
                                <ChevronLeft className="w-4 h-4 text-slate-500 shrink-0" />
                                <span>Thu gọn thanh bên</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA (PINNED HEADER & SCROLLABLE BODY) */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* TOPBAR RỰC RỠ & SANG TRỌNG (LUÔN GHIM CỐ ĐỊNH Ở ĐỈNH) */}
                <header className="h-16 bg-white dark:bg-[#0d1527] border-b-2 border-slate-300 dark:border-slate-700 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-sm z-30">
                    <div className="flex items-center gap-3.5">
                        <button
                            onClick={() => {
                                if (window.innerWidth < 768) setSidebarMoMobile(true);
                                else setSidebarThuGon(!sidebarThuGon);
                            }}
                            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            title={sidebarThuGon ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
                        >
                            <Menu className="w-4 h-4" />
                        </button>

                        <div>
                            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                HỆ THỐNG CỬA HÀNG //
                            </div>
                            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                                {tabHienTai === 'tong_quan' ? 'Bảng Thống Kê Tổng Quan' :
                                    tabHienTai === 'don_hang' ? 'Quản Lý Đơn Hàng' :
                                        tabHienTai === 'san_pham' ? 'Kho Hàng & Danh Sách Sản Phẩm' :
                                            tabHienTai === 'danh_muc' ? 'Hãng Sản Xuất & Danh Mục Phân Khúc' :
                                                tabHienTai === 'khach_hang' ? 'Danh Sách Tài Khoản Khách Hàng' :
                                                    tabHienTai === 'voucher' ? 'Mã Giảm Giá & Voucher' :
                                                        tabHienTai === 'khuyen_mai' ? 'Cấu Hình Banner & Khuyến Mãi' :
                                                            tabHienTai === 'showroom' ? 'Hệ Thống Showroom & Tọa Độ Bản Đồ' :
                                                                'Quản Lý Tin Tức & Cẩm Nang Công Nghệ'}
                            </h1>
                        </div>
                    </div>

                    {/* Right Tools */}
                    <div className="flex items-center gap-3">
                        {/* Search Input */}
                        <div className="relative hidden md:block w-64 lg:w-72">
                            <input
                                type="text"
                                value={tuKhoaGlobal}
                                onChange={(e) => setTuKhoaGlobal(e.target.value)}
                                placeholder="Tìm kiếm tên, SKU, hãng, bài viết..."
                                className="w-full pl-4 pr-9 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                            />
                            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        </div>

                        {/* Reload */}
                        <button
                            onClick={taiDuLieuToanBo}
                            disabled={dangTai}
                            className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                            title="Tải lại dữ liệu"
                        >
                            <RotateCcw className={`w-4 h-4 ${dangTai ? 'animate-spin text-blue-600' : ''}`} />
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={chuyenDoiChuDe}
                            className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                        >
                            {chu_de === 'sang' ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
                        </button>

                        {/* Admin Badge Pill */}
                        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-800">
                            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                                👑
                            </div>
                            <div className="hidden lg:block text-left">
                                <div className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
                                    {nguoiDung?.hoTen || 'Quản Trị Viên Hệ Thống'}
                                </div>
                                <div className="text-[10px] text-slate-500 font-semibold">
                                    {nguoiDung?.email || 'admin@laptopnew.vn'}
                                </div>
                            </div>
                            <button
                                onClick={dangXuat}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                                title="Đăng xuất"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE VIEWPORT */}
                <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 pb-24 space-y-6 bg-[#e8ecf4] dark:bg-[#060a14]">
                    {/* ========================================= */}
                    {/* TAB 1: TỔNG QUAN */}
                    {/* ========================================= */}
                    {tabHienTai === 'tong_quan' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            {/* Quick Action Bar: Thẻ Trắng Sáng Sang Trọng (Không Dùng Tone Tối) */}
                            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0d1527] border-2 border-slate-300 dark:border-slate-800 shadow-md shadow-slate-900/5 flex flex-wrap items-center justify-between gap-5">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                        <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                            Xin chào, {nguoiDung?.hoTen || 'Quản Trị Viên Hệ Thống'} 👋
                                        </h2>
                                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-cyan-300 text-xs font-black uppercase tracking-wider border border-blue-300 dark:border-blue-800">
                                            Admin Control Center
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">
                                        Báo cáo toàn cảnh hoạt động kinh doanh, biến động kho hàng & tương tác thời gian thực
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5">
                                    <button
                                        onClick={moModalThemSp}
                                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 !text-white font-black text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4 !text-white" />
                                        <span className="!text-white">+ Thêm Sản Phẩm</span>
                                    </button>

                                    <button
                                        onClick={moModalTaoDonHang}
                                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 !text-white font-black text-xs flex items-center gap-2 shadow-md shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                    >
                                        <ShoppingBag className="w-4 h-4 !text-white" />
                                        <span className="!text-white">+ Tạo Đơn Hàng</span>
                                    </button>

                                    <button
                                        onClick={moModalThemTinTuc}
                                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 !text-white font-black text-xs flex items-center gap-2 shadow-md shadow-teal-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                    >
                                        <Newspaper className="w-4 h-4 !text-white" />
                                        <span className="!text-white">+ Viết Bài Tin Tức</span>
                                    </button>

                                    <button
                                        onClick={moModalThemVoucher}
                                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 !text-white font-black text-xs flex items-center gap-2 shadow-md shadow-rose-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                    >
                                        <Ticket className="w-4 h-4 !text-white" />
                                        <span className="!text-white">+ Tạo Voucher</span>
                                    </button>

                                    <button
                                        onClick={() => setTabHienTai('khuyen_mai')}
                                        className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 font-black text-xs flex items-center gap-2 shadow-xs border border-slate-300 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                    >
                                        <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                                        <span>⚙️ Banner Khuyến Mãi</span>
                                    </button>
                                </div>
                            </div>

                            {/* 4 Cards Thống Kê Nổi Bật Đậm Tone Sang & Trực Quan */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Card 1: Doanh Thu (Sapphire Tech) */}
                                <div className="relative overflow-hidden p-5 rounded-3xl bg-white dark:bg-[#0d1527] border-2 border-blue-300 dark:border-blue-800/80 shadow-md shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 hover:border-blue-500 hover:-translate-y-1 transition-all space-y-2 group">
                                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                                            <DollarSign className="w-4 h-4 text-blue-600" />
                                            DOANH THU
                                        </span>
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-lg shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
                                            💰
                                        </div>
                                    </div>
                                    <div className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                                        {dinhDangTienVND(thongKe.tongDoanhThu)}
                                    </div>
                                    <div className="text-xs font-semibold flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                                        <span className="text-slate-600 font-bold">Đã thực thu:</span>
                                        <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 font-black text-xs border border-emerald-300 dark:border-emerald-800">
                                            {dinhDangTienVND(thongKe.doanhThuThanhCong)}
                                        </span>
                                    </div>
                                </div>

                                {/* Card 2: Đơn Hàng (Amber Flame) */}
                                <div className="relative overflow-hidden p-5 rounded-3xl bg-white dark:bg-[#0d1527] border-2 border-amber-300 dark:border-amber-800/80 shadow-md shadow-amber-500/10 hover:shadow-xl hover:shadow-amber-500/20 hover:border-amber-500 hover:-translate-y-1 transition-all space-y-2 group">
                                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                                            <ShoppingBag className="w-4 h-4 text-amber-600" />
                                            ĐƠN HÀNG
                                        </span>
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center text-lg shadow-md shadow-orange-500/30 group-hover:scale-110 transition-transform">
                                            🛍️
                                        </div>
                                    </div>
                                    <div className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                                        {thongKe.tongDonHang} Đơn
                                    </div>
                                    <div className="text-xs font-semibold flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                                        <span className="text-slate-600 font-bold">Cần xử lý:</span>
                                        <span className="px-2.5 py-1 rounded-xl bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-300 font-black text-xs border border-orange-300 dark:border-orange-800">
                                            {thongKe.donChoXacNhan} đơn chờ xác nhận
                                        </span>
                                    </div>
                                </div>

                                {/* Card 3: Khách Hàng (Royal Amethyst) */}
                                <div className="relative overflow-hidden p-5 rounded-3xl bg-white dark:bg-[#0d1527] border-2 border-purple-300 dark:border-purple-800/80 shadow-md shadow-purple-500/10 hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500 hover:-translate-y-1 transition-all space-y-2 group">
                                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                                            <Users className="w-4 h-4 text-purple-600" />
                                            KHÁCH HÀNG
                                        </span>
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white flex items-center justify-center text-lg shadow-md shadow-purple-500/30 group-hover:scale-110 transition-transform">
                                            👥
                                        </div>
                                    </div>
                                    <div className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                                        {thongKe.tongKhachHang} Tài Khoản
                                    </div>
                                    <div className="text-xs font-semibold flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                                        <span className="text-slate-600 font-bold">Phân loại:</span>
                                        <span className="px-2.5 py-1 rounded-xl bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 font-black text-xs border border-purple-300 dark:border-purple-800">
                                            Thành viên đã kích hoạt
                                        </span>
                                    </div>
                                </div>

                                {/* Card 4: Kho Hàng (Emerald Vault) */}
                                <div className="relative overflow-hidden p-5 rounded-3xl bg-white dark:bg-[#0d1527] border-2 border-teal-300 dark:border-teal-800/80 shadow-md shadow-teal-500/10 hover:shadow-xl hover:shadow-teal-500/20 hover:border-teal-500 hover:-translate-y-1 transition-all space-y-2 group">
                                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                                            <Package className="w-4 h-4 text-teal-600" />
                                            KHO HÀNG
                                        </span>
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white flex items-center justify-center text-lg shadow-md shadow-teal-500/30 group-hover:scale-110 transition-transform">
                                            📦
                                        </div>
                                    </div>
                                    <div className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                                        {thongKe.tongSanPham} Mặt Hàng
                                    </div>
                                    <div className="text-xs font-semibold flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                                        <span className="text-slate-600 font-bold">Tồn kho khả dụng:</span>
                                        <span className="px-2.5 py-1 rounded-xl bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300 font-black text-xs border border-teal-300 dark:border-teal-800">
                                            {thongKe.tongTonKho} chiếc sẵn sàng
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* HỆ THỐNG BIỂU ĐỒ TRỰC QUAN ĐA CHIỀU (RECHARTS) */}
                            <div className="relative min-h-[360px]">
                                <KhuVucDangTaiTable
                                    dangTai={dangTai}
                                    tieuDe="Đang tải dữ liệu biểu đồ phân tích..."
                                    moTa="Tính toán doanh thu, cơ cấu ngành hàng và phân phối đơn hàng"
                                />
                                <div className={`transition-opacity duration-300 ${dangTai ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                                    <BieuDoTongQuan
                                        danhSachDonHang={danhSachDonHang}
                                        danhSachSanPham={danhSachSanPham}
                                        thongKe={thongKe}
                                        dinhDangTienVND={dinhDangTienVND}
                                        xacDinhLoaiSanPham={xacDinhLoaiSanPham}
                                    />
                                </div>
                            </div>

                            {/* Bảng Đơn Mới & Top Bán Chạy */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                {/* Đơn Hàng Mới Nhất */}
                                <div className="lg:col-span-7 bg-white dark:bg-[#0d1527] rounded-3xl p-5 sm:p-6 border-2 border-slate-300 dark:border-slate-800 shadow-md shadow-slate-900/5 space-y-4">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                        <h3 className="font-black text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-xs" />
                                            ĐƠN HÀNG MỚI NHẤT
                                        </h3>
                                        <button
                                            onClick={() => setTabHienTai('don_hang')}
                                            className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                            <span>Xem tất cả ({danhSachDonHang.length})</span>
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <div className="relative overflow-x-auto rounded-2xl border-2 border-slate-300 dark:border-slate-700 min-h-[200px]">
                                        <KhuVucDangTaiTable
                                            dangTai={dangTai}
                                            tieuDe="Đang tải đơn hàng mới nhất..."
                                            moTa="Cập nhật nhanh 5 đơn hàng vừa phát sinh"
                                        />
                                        <table className={`w-full min-w-[540px] text-left text-xs border-collapse transition-opacity duration-300 ${dangTai ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                                            <thead>
                                                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black uppercase text-[11px] tracking-wider">
                                                    <th className="py-2.5 px-3 border-b-2 border-r border-slate-300 dark:border-slate-700">Mã Đơn</th>
                                                    <th className="py-2.5 px-3 border-b-2 border-r border-slate-300 dark:border-slate-700">Khách Hàng</th>
                                                    <th className="py-2.5 px-3 border-b-2 border-r border-slate-300 dark:border-slate-700">Tổng Tiền</th>
                                                    <th className="py-2.5 px-3 border-b-2 border-r border-slate-300 dark:border-slate-700">Trạng Thái</th>
                                                    <th className="py-2.5 px-3 text-center border-b-2 border-slate-300 dark:border-slate-700">Xem</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {danhSachDonHang.slice(0, 5).map((dh) => (
                                                    <tr key={dh.id || dh._id} className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-[#0d1527] dark:even:bg-[#090f1d] hover:!bg-blue-50/80 dark:hover:!bg-blue-950/50 transition-colors">
                                                        <td className="py-2.5 px-3 font-mono font-black text-blue-600 dark:text-cyan-400 border-b border-r border-slate-200 dark:border-slate-800">
                                                             {dh.ma_don_hang}
                                                        </td>
                                                        <td className="py-2.5 px-3 border-b border-r border-slate-200 dark:border-slate-800">
                                                            <div className="font-bold text-slate-900 dark:text-white text-xs">{dh.thong_tin_giao_hang?.ho_ten}</div>
                                                            <div className="text-[11px] text-slate-500 font-mono">{dh.thong_tin_giao_hang?.so_dien_thoai}</div>
                                                        </td>
                                                        <td className="py-2.5 px-3 font-black text-xs text-red-600 dark:text-red-400 border-b border-r border-slate-200 dark:border-slate-800">
                                                            {dinhDangTienVND(dh.tong_tien_thanh_toan)}
                                                        </td>
                                                        <td className="py-2.5 px-3 border-b border-r border-slate-200 dark:border-slate-800">
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${dh.trang_thai === 'da_giao' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300/80' :
                                                                dh.trang_thai === 'dang_giao' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300/80' :
                                                                    dh.trang_thai === 'da_huy' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300/80' :
                                                                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300/80'
                                                                }`}>
                                                                {dh.trang_thai === 'da_giao' ? 'Thành công' :
                                                                    dh.trang_thai === 'dang_giao' ? 'Đang giao' :
                                                                        dh.trang_thai === 'da_huy' ? 'Đã hủy' : 'Chờ duyệt'}
                                                            </span>
                                                        </td>
                                                        <td className="py-2.5 px-3 text-center border-b border-slate-200 dark:border-slate-800">
                                                            <button
                                                                onClick={() => setDonHangChiTiet(dh)}
                                                                className="p-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 dark:bg-slate-800 dark:hover:bg-blue-600 transition-colors cursor-pointer shadow-2xs"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Top Bán Chạy */}
                                <div className="lg:col-span-5 bg-white dark:bg-[#0d1527] rounded-3xl p-5 sm:p-6 border-2 border-slate-300 dark:border-slate-800 shadow-md shadow-slate-900/5 space-y-4">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                        <h3 className="font-black text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
                                            TOP BÁN CHẠY
                                        </h3>
                                        <button
                                            onClick={() => setTabHienTai('san_pham')}
                                            className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                            <span>Xem kho máy</span>
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <div className="relative space-y-3 min-h-[200px]">
                                        <KhuVucDangTaiTable
                                            dangTai={dangTai}
                                            tieuDe="Đang tải top sản phẩm bán chạy..."
                                            moTa="Xếp hạng theo sản lượng tiêu thụ"
                                        />
                                        <div className={`space-y-3 transition-opacity duration-300 ${dangTai ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                                            {topSanPhamBanChay.map((sp, idx) => (
                                                <div key={sp.id || sp._id} className="flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/60 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 hover:shadow-sm transition-all">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <span className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${idx === 0 ? 'bg-amber-400 text-slate-950 shadow-xs' : idx === 1 ? 'bg-slate-300 text-slate-900' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                                            {idx + 1}
                                                        </span>
                                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 p-0.5 relative border border-slate-200 dark:border-slate-700 shrink-0">
                                                            <Image src={sp.hinh_anh_chinh} alt={sp.ten_san_pham} fill className="object-contain p-0.5" />
                                                        </div>
                                                        <div className="min-w-0 truncate">
                                                            <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{sp.ten_san_pham}</div>
                                                            <div className="text-xs text-red-600 dark:text-red-400 font-extrabold">{dinhDangTienVND(sp.gia_khuyen_mai)}</div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right shrink-0 pl-2">
                                                        <div className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
                                                            {sp.so_luong_da_ban || 0} đã bán
                                                        </div>
                                                        <div className="text-[11px] text-slate-500 font-semibold">
                                                            Còn: {sp.so_luong_ton_kho || 0}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================= */}
                    {/* TAB 2: QUẢN LÝ ĐƠN HÀNG */}
                    {/* ========================================= */}
                    {tabHienTai === 'don_hang' && (
                        <div className="space-y-4 animate-in fade-in duration-200">
                            {/* 1. Thống Kê Nhanh Đơn Hàng (4 KPI Cards: SỐ HIỂN THỊ CỰC TO, RÕ NÉT & DỄ NHÌN) */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                {/* KPI 1: TỔNG ĐƠN HÀNG (Màu Xanh Dương Blue) */}
                                <div
                                    onClick={() => setLocTrangThaiDonHang('tat_ca')}
                                    className={`p-3.5 sm:p-4 rounded-3xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50/80 dark:from-blue-950/70 dark:via-blue-900/40 dark:to-indigo-950/60 border-2 transition-all cursor-pointer hover:shadow-lg hover:scale-[1.01] ${locTrangThaiDonHang === 'tat_ca' ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md shadow-blue-500/15' : 'border-blue-200 dark:border-blue-800 shadow-sm shadow-blue-500/5'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] sm:text-xs font-black text-blue-900 dark:text-blue-200 uppercase tracking-wider">Tổng Đơn Hàng</span>
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30">
                                            <ShoppingBag className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-blue-700 dark:text-blue-300 drop-shadow-xs">
                                            {danhSachDonHang.length}
                                        </span>
                                        <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300">kiện hàng</span>
                                    </div>
                                    <div className="mt-1.5 flex items-center">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black bg-blue-600/15 text-blue-800 dark:text-blue-200">
                                            📋 Bấm xem tất cả
                                        </span>
                                    </div>
                                </div>

                                {/* KPI 2: CẦN XỬ LÝ & GIAO (Màu Cam / Hổ Phách Amber) */}
                                <div
                                    onClick={() => setLocTrangThaiDonHang('da_xac_nhan')}
                                    className={`p-3.5 sm:p-4 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50/80 dark:from-amber-950/70 dark:via-orange-900/40 dark:to-amber-950/60 border-2 transition-all cursor-pointer hover:shadow-lg hover:scale-[1.01] ${locTrangThaiDonHang === 'da_xac_nhan' || locTrangThaiDonHang === 'cho_xac_nhan' ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md shadow-amber-500/15' : 'border-amber-300 dark:border-amber-700 shadow-sm shadow-amber-500/5'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] sm:text-xs font-black text-amber-950 dark:text-amber-200 uppercase tracking-wider">Cần Xử Lý & Giao</span>
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
                                            <Clock className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-amber-600 dark:text-amber-400 drop-shadow-xs">
                                            {danhSachDonHang.filter(d => d.trang_thai === 'cho_xac_nhan' || d.trang_thai === 'da_xac_nhan' || d.trang_thai === 'dang_giao').length}
                                        </span>
                                        <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300">chờ xử lý</span>
                                    </div>
                                    <div className="mt-1.5 flex items-center">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black bg-amber-500/20 text-amber-900 dark:text-amber-100">
                                            ⚡ Bấm lọc đơn cần giao
                                        </span>
                                    </div>
                                </div>

                                {/* KPI 3: GIAO THÀNH CÔNG (Màu Xanh Lá / Lục Bảo Emerald) */}
                                <div
                                    onClick={() => setLocTrangThaiDonHang('da_giao')}
                                    className={`p-3.5 sm:p-4 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50/80 dark:from-emerald-950/70 dark:via-emerald-900/40 dark:to-teal-950/60 border-2 transition-all cursor-pointer hover:shadow-lg hover:scale-[1.01] ${locTrangThaiDonHang === 'da_giao' ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md shadow-emerald-500/15' : 'border-emerald-300 dark:border-emerald-700 shadow-sm shadow-emerald-500/5'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] sm:text-xs font-black text-emerald-950 dark:text-emerald-200 uppercase tracking-wider">Giao Thành Công</span>
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400 drop-shadow-xs">
                                            {danhSachDonHang.filter(d => d.trang_thai === 'da_giao').length}
                                        </span>
                                        <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300">hoàn tất</span>
                                    </div>
                                    <div className="mt-1.5 flex items-center">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black bg-emerald-600/20 text-emerald-900 dark:text-emerald-100">
                                            ✅ Bấm lọc đơn hoàn tất
                                        </span>
                                    </div>
                                </div>

                                {/* KPI 4: DOANH SỐ ĐƠN HÀNG (Màu Tím Thạch Anh Sáng Đẹp Đồng Bộ) */}
                                <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50/80 dark:from-purple-950/70 dark:via-fuchsia-900/40 dark:to-purple-950/60 border-2 border-purple-300 dark:border-purple-700 shadow-sm shadow-purple-500/5 transition-all cursor-pointer hover:shadow-lg hover:scale-[1.01]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] sm:text-xs font-black text-purple-950 dark:text-purple-200 uppercase tracking-wider">Doanh Số Đơn Hàng</span>
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30">
                                            <DollarSign className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-baseline gap-1">
                                        <span className="text-xl sm:text-2xl lg:text-3xl font-black font-mono tracking-tight text-purple-700 dark:text-purple-300 drop-shadow-xs truncate">
                                            {dinhDangTienVND(danhSachDonHang.reduce((sum, d) => sum + (Number(d.tong_tien_thanh_toan) || Number(d.tong_tien) || 0), 0))}
                                        </span>
                                    </div>
                                    <div className="mt-1.5 flex items-center">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black bg-purple-600/15 text-purple-900 dark:text-purple-100 flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400"></span>
                                            <span>{danhSachDonHang.filter(d => d.da_thanh_toan).length} đơn đã thanh toán</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 2. SECTION BỘ LỌC & THAO TÁC (Màu Cam / Hổ Phách Nổi Bật - Trung tâm điều khiển) */}
                            <div className="bg-gradient-to-br from-orange-50/90 via-amber-50/60 to-orange-100/70 dark:from-[#19140c] dark:via-[#16121f] dark:to-[#0f172a] rounded-3xl border-2 border-orange-300/80 dark:border-orange-800/80 shadow-md shadow-orange-500/5 p-3.5 sm:p-4 space-y-2.5">
                                {/* Tầng 1: Tiêu đề & Cụm nút hành động chính */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2.5 border-b border-orange-200/80 dark:border-orange-900/60">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black shadow-md shadow-orange-500/30 shrink-0">
                                            <SlidersHorizontal className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-sm sm:text-base font-black text-orange-950 dark:text-orange-100 tracking-tight">
                                                    Bộ Lọc & Quản Lý Đơn Hàng
                                                </h2>
                                                <span className="px-2.5 py-0.5 rounded-full bg-orange-600 text-white font-black text-[11px] shadow-xs">
                                                    {donHangHienThi.length} / {danhSachDonHang.length} đơn
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-orange-800/80 dark:text-orange-300/80 font-semibold mt-0.5 hidden sm:block">
                                                Lọc đa chiều theo trạng thái, thanh toán, ngày tháng và sắp xếp giá trị
                                            </p>
                                        </div>
                                    </div>

                                    {/* Nút hành động */}
                                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                                        <button
                                            onClick={moModalTaoDonHang}
                                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 !text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-orange-600/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <Plus className="w-3.5 h-3.5 !text-white stroke-[2.5]" />
                                            <span className="!text-white">+ Tạo Đơn Hàng</span>
                                        </button>

                                        <button
                                            onClick={xuatExcelDonHang}
                                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 !text-white text-xs font-black flex items-center gap-1.5 cursor-pointer transition-colors shadow-md shadow-emerald-600/25"
                                            title="Xuất file Excel danh sách đơn hàng đã lọc"
                                        >
                                            <FileSpreadsheet className="w-3.5 h-3.5 !text-white" />
                                            <span className="!text-white">Xuất Excel</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Tầng 2: Thanh Ribbon Bộ Lọc Màu Sắc Trực Quan (Nhìn màu biết ngay chức năng) */}
                                <div className="flex flex-wrap items-center justify-between gap-2 bg-white/95 dark:bg-[#0c1222]/95 p-2.5 rounded-2xl border-2 border-orange-300/70 dark:border-orange-900/60 shadow-xs backdrop-blur-md">
                                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto flex-1">
                                        {/* 1. Lọc Trạng Thái (Màu Xanh Dương Blue - Tiến độ vận hành) */}
                                        <div className="relative min-w-[150px] flex-1 sm:flex-initial">
                                            <select
                                                value={locTrangThaiDonHang}
                                                onChange={(e) => setLocTrangThaiDonHang(e.target.value)}
                                                className="w-full appearance-none pl-7 pr-6 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border-2 border-blue-300 dark:border-blue-700 text-xs font-black text-blue-950 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer shadow-2xs"
                                                title="Lọc theo trạng thái đơn hàng"
                                            >
                                                <option value="tat_ca">📋 Tất cả trạng thái</option>
                                                <option value="cho_xac_nhan">⏳ Chờ xác nhận</option>
                                                <option value="da_xac_nhan">📦 Đã xác nhận</option>
                                                <option value="dang_giao">🚚 Đang giao hàng</option>
                                                <option value="da_giao">✅ Đã giao thành công</option>
                                                <option value="da_huy">❌ Đã hủy đơn</option>
                                            </select>
                                            <Filter className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400 pointer-events-none" />
                                            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400 pointer-events-none" />
                                        </div>

                                        {/* 2. Lọc Thanh Toán (Màu Tím Purple/Violet - Tài chính) */}
                                        <div className="relative min-w-[145px] flex-1 sm:flex-initial">
                                            <select
                                                value={locThanhToanDonHang}
                                                onChange={(e) => setLocThanhToanDonHang(e.target.value)}
                                                className="w-full appearance-none pl-7 pr-6 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border-2 border-purple-300 dark:border-purple-700 text-xs font-black text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer shadow-2xs"
                                                title="Lọc theo tình trạng thanh toán"
                                            >
                                                <option value="tat_ca">💳 Tất cả thanh toán</option>
                                                <option value="da_thanh_toan">✅ Đã thanh toán</option>
                                                <option value="chua_thanh_toan">⏳ Chưa thanh toán</option>
                                            </select>
                                            <CreditCard className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400 pointer-events-none" />
                                            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400 pointer-events-none" />
                                        </div>

                                        {/* 3. Lọc Khoảng Thời Gian (Màu Xanh Lơ Cyan - Lịch trình) */}
                                        <div className="relative min-w-[150px] flex-1 sm:flex-initial">
                                            <select
                                                value={locThoiGianDonHang}
                                                onChange={(e) => {
                                                    setLocThoiGianDonHang(e.target.value);
                                                    if (e.target.value !== 'tat_ca') setLocNgayCuThe('');
                                                }}
                                                className="w-full appearance-none pl-7 pr-6 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border-2 border-cyan-300 dark:border-cyan-700 text-xs font-black text-cyan-950 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer shadow-2xs"
                                                title="Lọc thời gian đơn hàng"
                                            >
                                                <option value="tat_ca">📅 Tất cả thời gian</option>
                                                <option value="hom_nay">⚡ Hôm nay (24h)</option>
                                                <option value="7_ngay">📆 Tuần này (7 ngày)</option>
                                                <option value="30_ngay">🗓️ Tháng này (30 ngày)</option>
                                                <option value="thang_8_2026">📦 Tháng 8/2026</option>
                                                <option value="nam_2026">📅 Năm nay (2026)</option>
                                            </select>
                                            <Calendar className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-cyan-600 dark:text-cyan-400 pointer-events-none" />
                                            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-cyan-600 dark:text-cyan-400 pointer-events-none" />
                                        </div>

                                        {/* 4. Chọn Ngày Cụ Thể (Màu Xanh Lơ Cyan DatePicker) */}
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border-2 border-cyan-300 dark:border-cyan-700 text-xs shadow-2xs">
                                            <Calendar className="w-3 h-3 text-cyan-600 dark:text-cyan-400 shrink-0" />
                                            <input
                                                type="date"
                                                value={locNgayCuThe}
                                                onChange={(e) => {
                                                    setLocNgayCuThe(e.target.value);
                                                    if (e.target.value) setLocThoiGianDonHang('tat_ca');
                                                }}
                                                className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                                                title="Chọn ngày cụ thể để lọc đơn"
                                            />
                                            {locNgayCuThe && (
                                                <button
                                                    onClick={() => setLocNgayCuThe('')}
                                                    className="text-slate-400 hover:text-rose-600 p-0.5 rounded-full cursor-pointer"
                                                    title="Xóa chọn ngày"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Cụm Bên Phải: Sắp Xếp & Nút Đặt Lại */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {/* 5. Sắp Xếp (Màu Vàng Cam Amber - Ưu tiên) */}
                                        <div className="relative">
                                            <select
                                                value={sapXepDonHang}
                                                onChange={(e) => setSapXepDonHang(e.target.value)}
                                                className="appearance-none pl-7 pr-6 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 border-2 border-amber-400 dark:border-amber-600 text-xs font-black text-amber-950 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
                                                title="Sắp xếp danh sách đơn hàng"
                                            >
                                                <option value="moi_nhat">✨ Mới nhất trước</option>
                                                <option value="cu_nhat">⏳ Cũ nhất trước</option>
                                                <option value="gia_cao">💰 Giá trị cao nhất</option>
                                                <option value="gia_thap">💵 Giá trị thấp nhất</option>
                                            </select>
                                            <ArrowUpDown className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-amber-700 dark:text-amber-300 pointer-events-none" />
                                            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-amber-700 dark:text-amber-300 pointer-events-none" />
                                        </div>

                                        {/* 6. Nút Đặt Lại Bộ Lọc (Màu Đỏ Hồng Rose) */}
                                        {(locTrangThaiDonHang !== 'tat_ca' || locThanhToanDonHang !== 'tat_ca' || sapXepDonHang !== 'moi_nhat' || locThoiGianDonHang !== 'tat_ca' || locNgayCuThe) && (
                                            <button
                                                onClick={() => {
                                                    setLocTrangThaiDonHang('tat_ca');
                                                    setLocThanhToanDonHang('tat_ca');
                                                    setSapXepDonHang('moi_nhat');
                                                    setLocThoiGianDonHang('tat_ca');
                                                    setLocNgayCuThe('');
                                                }}
                                                className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 !text-white text-xs font-black flex items-center gap-1 shadow-md shadow-rose-600/25 cursor-pointer transition-all hover:scale-105 active:scale-95 shrink-0"
                                                title="Đặt lại toàn bộ bộ lọc về mặc định"
                                            >
                                                <RotateCcw className="w-3 h-3 !text-white" />
                                                <span className="!text-white">Đặt lại</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 3. SECTION BẢNG DỮ LIỆU ĐƠN HÀNG (Excel-Style Grid Sắc Nét) */}
                            <div className="relative bg-white dark:bg-[#0d1527] rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-md shadow-slate-900/5 overflow-hidden min-h-[380px]">
                                {/* Banner Tiêu Đề Bảng */}
                                <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                                    <div className="flex items-center gap-2">
                                        <PackageCheck className="w-4 h-4 text-blue-200" />
                                        <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                                            Danh Sách Chi Tiết Đơn Hàng
                                        </h3>
                                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black">
                                            {donHangHienThi.length} kết quả
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-blue-100 font-bold flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span>Thời gian thực</span>
                                    </div>
                                </div>

                                <KhuVucDangTaiTable
                                    dangTai={dangTai || dangLocDonHang}
                                    tieuDe={dangLocDonHang ? "Đang áp dụng bộ lọc đơn hàng..." : "Đang tải danh sách đơn hàng toàn hệ thống..."}
                                    moTa={dangLocDonHang ? `Tìm thấy ${donHangHienThi.length} đơn hàng phù hợp` : "Đồng bộ hóa đơn, thông tin thanh toán và trạng thái giao hàng"}
                                />

                                <div className={`overflow-x-auto transition-opacity duration-300 ${dangTai || dangLocDonHang ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black uppercase text-[11px] tracking-wider whitespace-nowrap">
                                                <th className="py-2.5 px-2 w-20 text-center whitespace-nowrap border-b-2 border-r border-slate-300 dark:border-slate-700">
                                                    # MÃ ĐƠN
                                                </th>
                                                <th className="py-2.5 px-2.5 min-w-[130px] whitespace-nowrap border-b-2 border-r border-slate-300 dark:border-slate-700">
                                                    KHÁCH HÀNG
                                                </th>
                                                <th className="py-2.5 px-2.5 min-w-[140px] border-b-2 border-r border-slate-300 dark:border-slate-700">
                                                    ĐỊA CHỈ & KIỆN HÀNG
                                                </th>
                                                <th className="py-2.5 px-2 w-28 whitespace-nowrap border-b-2 border-r border-slate-300 dark:border-slate-700">
                                                    TỔNG TIỀN
                                                </th>
                                                <th className="py-2.5 px-2 w-36 whitespace-nowrap border-b-2 border-r border-slate-300 dark:border-slate-700">
                                                    THANH TOÁN
                                                </th>
                                                <th className="py-2.5 px-2 w-36 whitespace-nowrap border-b-2 border-r border-slate-300 dark:border-slate-700">
                                                    TRẠNG THÁI
                                                </th>
                                                <th className="py-2.5 px-1.5 w-16 text-center whitespace-nowrap border-b-2 border-slate-300 dark:border-slate-700">
                                                    THAO TÁC
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {donHangHienThi.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="py-10 text-center border-b border-slate-200 dark:border-slate-800">
                                                        <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                                                            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                                <Package className="w-5 h-5" />
                                                            </div>
                                                            <div className="font-bold text-sm text-slate-700 dark:text-slate-300">Không tìm thấy đơn hàng nào</div>
                                                            <div className="text-xs">Vui lòng thay đổi điều kiện lọc hoặc tạo đơn hàng mới</div>
                                                            {(locTrangThaiDonHang !== 'tat_ca' || locThanhToanDonHang !== 'tat_ca' || sapXepDonHang !== 'moi_nhat' || locThoiGianDonHang !== 'tat_ca' || locNgayCuThe) && (
                                                                <button
                                                                    onClick={() => {
                                                                        setLocTrangThaiDonHang('tat_ca');
                                                                        setLocThanhToanDonHang('tat_ca');
                                                                        setSapXepDonHang('moi_nhat');
                                                                        setLocThoiGianDonHang('tat_ca');
                                                                        setLocNgayCuThe('');
                                                                    }}
                                                                    className="mt-2 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-sm cursor-pointer transition-all"
                                                                >
                                                                    Đặt lại bộ lọc
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                donHangHienThi.map((dh, idx) => {
                                                    const donHangId = dh.id || dh._id;
                                                    const dangXuLy = dangXuLyDonHangId === donHangId;
                                                    const tenKhach = dh.thong_tin_giao_hang?.ho_ten || dh.thong_tin_giao_hang?.ho_va_ten || 'Khách vãng lai';
                                                    const initials = tenKhach.split(' ').filter(Boolean).slice(-2).map(w => w[0]).join('').toUpperCase() || 'KH';

                                                    const gradientAvatars = [
                                                        'from-blue-600 to-indigo-600',
                                                        'from-violet-600 to-purple-600',
                                                        'from-emerald-600 to-teal-600',
                                                        'from-rose-600 to-pink-600',
                                                        'from-amber-600 to-orange-600'
                                                    ];
                                                    const avatarBg = gradientAvatars[idx % gradientAvatars.length];
                                                    const maHienThi = dh.ma_don_hang || `LPN-${String(idx + 1).padStart(4, '0')}`;
                                                    const soLuongSp = dh.danh_sach_san_pham?.length || 1;

                                                    // Format ngày tháng chống Invalid Date triệt để
                                                    const dinhDangThoiGianDonHang = (val) => {
                                                        if (!val) return '23/08/2026';
                                                        if (typeof val === 'string') {
                                                            if (val.includes('/') && !val.includes('T')) return val;
                                                            const d = new Date(val);
                                                            if (!isNaN(d.getTime())) {
                                                                const hh = String(d.getHours()).padStart(2, '0');
                                                                const mm = String(d.getMinutes()).padStart(2, '0');
                                                                const dd = String(d.getDate()).padStart(2, '0');
                                                                const MM = String(d.getMonth() + 1).padStart(2, '0');
                                                                const yyyy = d.getFullYear();
                                                                return `${hh}:${mm} ${dd}/${MM}/${yyyy}`;
                                                            }
                                                            return val;
                                                        }
                                                        return '23/08/2026';
                                                    };
                                                    const thoiGianTao = dinhDangThoiGianDonHang(dh.ngay_tao || dh.createdAt);

                                                    return (
                                                        <tr key={donHangId} className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-[#0d1527] dark:even:bg-[#090f1d] hover:!bg-blue-50/80 dark:hover:!bg-blue-950/50 transition-colors group">
                                                            {/* Cột 1: Mã & Thứ tự */}
                                                            <td className="py-2.5 px-2 text-center whitespace-nowrap border-b border-r border-slate-200 dark:border-slate-800">
                                                                <div className="flex flex-col items-center justify-center">
                                                                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono font-black text-[10px] shadow-2xs">
                                                                        #{idx + 1}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => setDonHangChiTiet(dh)}
                                                                        className="text-[11px] font-mono font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline block mt-1 tracking-tight cursor-pointer whitespace-nowrap"
                                                                        title="Bấm để xem chi tiết đơn hàng"
                                                                    >
                                                                        {maHienThi}
                                                                    </button>
                                                                </div>
                                                            </td>

                                                            {/* Cột 2: Khách hàng */}
                                                            <td className="py-2.5 px-3 whitespace-nowrap border-b border-r border-slate-200 dark:border-slate-800">
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${avatarBg} text-white font-black text-[11px] flex items-center justify-center shrink-0 shadow-2xs`}>
                                                                        {initials}
                                                                    </div>
                                                                    <div className="min-w-0 max-w-[125px]">
                                                                        <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate" title={tenKhach}>
                                                                            {tenKhach}
                                                                        </div>
                                                                        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                                                            <Phone className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                                                                            <a href={`tel:${dh.thong_tin_giao_hang?.so_dien_thoai}`} className="hover:text-blue-600 font-semibold truncate">
                                                                                {dh.thong_tin_giao_hang?.so_dien_thoai || 'Chưa có SĐT'}
                                                                            </a>
                                                                        </div>
                                                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                                                            <Clock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                                                                            <span className="truncate">{thoiGianTao}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* Cột 3: Địa chỉ & Kiện hàng */}
                                                            <td className="py-2.5 px-3 border-b border-r border-slate-200 dark:border-slate-800">
                                                                <div className="flex items-start gap-1 text-slate-700 dark:text-slate-300 font-medium text-xs leading-snug">
                                                                    <MapPin className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                                                                    <div className="line-clamp-2" title={dh.thong_tin_giao_hang?.dia_chi_chi_tiet}>
                                                                        {dh.thong_tin_giao_hang?.dia_chi_chi_tiet || 'Nhận trực tiếp tại showroom'}
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                                                    <button
                                                                        onClick={() => setDonHangChiTiet(dh)}
                                                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 text-[10px] font-extrabold transition-all cursor-pointer whitespace-nowrap"
                                                                    >
                                                                        <Package className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                                                        <span>{soLuongSp} kiện</span>
                                                                        <ArrowUpRight className="w-2.5 h-2.5 text-blue-500" />
                                                                    </button>

                                                                    {dh.thong_tin_giao_hang?.ghi_chu && (
                                                                        <span 
                                                                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[9px] font-bold whitespace-nowrap"
                                                                            title={`Ghi chú: ${dh.thong_tin_giao_hang.ghi_chu}`}
                                                                        >
                                                                            <MessageSquare className="w-2.5 h-2.5 text-amber-600" />
                                                                            <span>Ghi chú</span>
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>

                                                            {/* Cột 4: Tổng tiền */}
                                                            <td className="py-2.5 px-3 whitespace-nowrap border-b border-r border-slate-200 dark:border-slate-800">
                                                                <div className="font-mono font-black text-xs sm:text-sm text-red-600 dark:text-red-400">
                                                                    {dinhDangTienVND(dh.tong_tien_thanh_toan)}
                                                                </div>
                                                                {dh.tien_giam_gia > 0 ? (
                                                                    <div className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                                                        <Tag className="w-2.5 h-2.5 text-emerald-500" />
                                                                        <span>Giảm {dinhDangTienVND(dh.tien_giam_gia)}</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold whitespace-nowrap">
                                                                        Freeship 0 đ
                                                                    </div>
                                                                )}
                                                            </td>

                                                            {/* Cột 5: Thanh toán */}
                                                            <td className="py-2 px-2 whitespace-nowrap border-b border-r border-slate-200 dark:border-slate-800">
                                                                <div className="space-y-1.5">
                                                                    <div className="flex items-center justify-between gap-1">
                                                                        {dh.hinh_thuc_thanh_toan === 'chuyen_khoan_vietqr' ? (
                                                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-violet-50 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 whitespace-nowrap">
                                                                                <QrCode className="w-3 h-3 text-violet-600 dark:text-violet-400" />
                                                                                <span>VietQR Pro</span>
                                                                            </span>
                                                                        ) : (
                                                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 whitespace-nowrap">
                                                                                <Banknote className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                                                                <span>COD Tiền Mặt</span>
                                                                            </span>
                                                                        )}
                                                                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">
                                                                            {dh.da_thanh_toan ? 'Đã thu' : 'Chưa thu'}
                                                                        </span>
                                                                    </div>

                                                                    {/* Dropdown chỉnh sửa trạng thái thanh toán thủ công (dành cho Admin khi webhook lỗi) */}
                                                                    <div className="relative inline-block w-full">
                                                                        <select
                                                                            disabled={dangXuLyDonHangId === donHangId}
                                                                            value={dh.da_thanh_toan ? 'da_thanh_toan' : 'chua_thanh_toan'}
                                                                            onChange={(e) => xuLyDoiTrangThaiThanhToan(donHangId, e.target.value === 'da_thanh_toan', dh.hinh_thuc_thanh_toan)}
                                                                            className={`w-full appearance-none pl-6 pr-6 py-1.5 rounded-xl border text-[10.5px] font-black tracking-tight transition-all ${
                                                                                dangXuLyDonHangId === donHangId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer shadow-2xs hover:shadow-xs'
                                                                            } ${
                                                                                dh.da_thanh_toan
                                                                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                                                                                    : dh.hinh_thuc_thanh_toan === 'chuyen_khoan_vietqr'
                                                                                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                                                                                    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700'
                                                                            }`}
                                                                        >
                                                                            <option value="chua_thanh_toan">
                                                                                {dh.hinh_thuc_thanh_toan === 'chuyen_khoan_vietqr' ? '⏳ Chờ chuyển khoản' : '💵 Thu tiền COD'}
                                                                            </option>
                                                                            <option value="da_thanh_toan">
                                                                                ✅ Đã thanh toán
                                                                            </option>
                                                                        </select>

                                                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                                                            {dangXuLyDonHangId === donHangId ? (
                                                                                <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
                                                                            ) : dh.da_thanh_toan ? (
                                                                                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                                                            ) : (
                                                                                <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                                                            )}
                                                                        </div>

                                                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                                                            <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* Cột 6: Trạng thái */}
                                                            <td className="py-2 px-2 whitespace-nowrap border-b border-r border-slate-200 dark:border-slate-800">
                                                                <div className="relative inline-block w-full">
                                                                    <select
                                                                        disabled={dangXuLy}
                                                                        value={dh.trang_thai}
                                                                        onChange={(e) => xuLyDoiTrangThaiDonHang(donHangId, e.target.value)}
                                                                        className={`w-full appearance-none pl-7 pr-6 py-1.5 rounded-xl border text-[11px] font-black tracking-tight transition-all ${
                                                                            dangXuLy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer shadow-2xs hover:shadow-xs'
                                                                        } ${
                                                                            dh.trang_thai === 'da_giao'
                                                                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                                                                                : dh.trang_thai === 'dang_giao'
                                                                                ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200 border-sky-300 dark:border-sky-700'
                                                                                : dh.trang_thai === 'da_xac_nhan'
                                                                                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700'
                                                                                : dh.trang_thai === 'da_huy'
                                                                                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700'
                                                                                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                                                                        }`}
                                                                    >
                                                                        <option value="cho_xac_nhan">Chờ xác nhận</option>
                                                                        <option value="da_xac_nhan">Đã xác nhận</option>
                                                                        <option value="dang_giao">Đang giao hàng</option>
                                                                        <option value="da_giao">Giao thành công</option>
                                                                        <option value="da_huy">Đã hủy đơn</option>
                                                                    </select>

                                                                    {/* Left Status Icon */}
                                                                    <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                                                        {dangXuLy ? (
                                                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
                                                                        ) : dh.trang_thai === 'da_giao' ? (
                                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                                                        ) : dh.trang_thai === 'dang_giao' ? (
                                                                            <Truck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                                                                        ) : dh.trang_thai === 'da_xac_nhan' ? (
                                                                            <PackageCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                                        ) : dh.trang_thai === 'da_huy' ? (
                                                                            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                                                        ) : (
                                                                            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                                                        )}
                                                                    </div>

                                                                    {/* Right Chevron Down Arrow */}
                                                                    <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 opacity-70" />
                                                                </div>
                                                            </td>

                                                            {/* Cột 7: Thao tác */}
                                                            <td className="py-2.5 px-2 text-center whitespace-nowrap border-b border-slate-200 dark:border-slate-800">
                                                                <div className="flex items-center justify-center gap-1.5">
                                                                    <button
                                                                        onClick={() => setDonHangChiTiet(dh)}
                                                                        className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-600 text-blue-600 hover:text-white dark:bg-blue-950/60 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-2xs hover:shadow-md cursor-pointer"
                                                                        title="Xem chi tiết đơn hàng & In hóa đơn"
                                                                    >
                                                                        <Eye className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => xuLyXoaDonHang(donHangId, dh.ma_don_hang)}
                                                                        disabled={dangXuLy}
                                                                        className={`p-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-600 hover:text-white dark:bg-rose-950/60 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white transition-all shadow-2xs hover:shadow-md ${
                                                                            dangXuLy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                                                        }`}
                                                                        title="Xóa đơn hàng"
                                                                    >
                                                                        {dangXuLy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================= */}
                    {/* TAB 3: KHO SẢN PHẨM */}
                    {/* ========================================= */}
                    {tabHienTai === 'san_pham' && (
                        <div className="space-y-4 animate-in fade-in duration-200">
                            {/* Toolbar & Filter Controls */}
                            <div className="bg-white dark:bg-[#0d1527] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <span className="w-2.5 h-6 bg-cyan-600 rounded-full" />
                                        <h2 className="text-base font-black text-slate-900 dark:text-white">Kho Sản Phẩm ({sanPhamHienThi.length} mẫu)</h2>
                                        {sanPhamHienThi.filter(s => s.tuy_chon_phien_ban?.length > 0).length > 0 && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80">
                                                🎨 {sanPhamHienThi.filter(s => s.tuy_chon_phien_ban?.length > 0).length} mẫu có biến thể màu
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2.5 w-full md:w-auto">
                                        {/* Ô tìm kiếm nhanh trực tiếp trong kho */}
                                        <div className="relative flex-1 md:w-64">
                                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                placeholder="Tìm tên, SKU, màu sắc..."
                                                value={tuKhoaSanPham}
                                                onChange={(e) => setTuKhoaSanPham(e.target.value)}
                                                className="w-full pl-9 pr-8 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {tuKhoaSanPham && (
                                                <button
                                                    onClick={() => setTuKhoaSanPham('')}
                                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>

                                        <button
                                            onClick={moModalThemSp}
                                            className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 !text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 cursor-pointer shrink-0 transition-all hover:scale-102 active:scale-98"
                                        >
                                            <Plus className="w-4 h-4 !text-white" />
                                            <span className="!text-white">Thêm Sản Phẩm Mới</span>
                                        </button>
                                    </div>
                                </div>

                                {/* 4 Filter Dropdowns */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                                    <select
                                        value={locNganhHang}
                                        onChange={(e) => setLocNganhHang(e.target.value)}
                                        className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                    >
                                        <option value="tat_ca">📦 Tất cả ngành hàng ({danhSachSanPham.length})</option>
                                        <option value="laptop">💻 Laptop Gaming & AI PC ({thongKe.soLuongLaptop})</option>
                                        <option value="ban_phim">⌨️ Bàn Phím Cơ Custom ({thongKe.soLuongBanPhim})</option>
                                        <option value="chuot">🖱️ Chuột Gaming Siêu Nhẹ ({thongKe.soLuongChuot})</option>
                                        <option value="balo">🎒 Balo & Túi Chống Sốc ({thongKe.soLuongBalo})</option>
                                        <option value="tai_nghe">🎧 Tai Nghe & Loa ({thongKe.soLuongTaiNghe})</option>
                                        <option value="sac_hub">⚡ Củ Sạc GaN & Hub ({thongKe.soLuongSacHub})</option>
                                        <option value="linh-kien">💾 Linh kiện RAM/SSD ({thongKe.soLuongLinhKien})</option>
                                        <option value="phu-kien-gear">🎮 Gom toàn bộ Gear & Phụ Kiện ({thongKe.soLuongGear})</option>
                                    </select>

                                    <select
                                        value={locHangSanPham}
                                        onChange={(e) => setLocHangSanPham(e.target.value)}
                                        className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                    >
                                        <option value="tat_ca">🏷️ Tất cả thương hiệu ({danhSachHangThucTe.length})</option>
                                        {danhSachHangThucTe.map(h => (
                                            <option key={h.ma} value={h.ma}>{h.ten}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={locTonKhoSanPham}
                                        onChange={(e) => setLocTonKhoSanPham(e.target.value)}
                                        className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                    >
                                        <option value="tat_ca">📊 Tình trạng tồn kho</option>
                                        <option value="con_hang">✅ Đang bán (Còn hàng)</option>
                                        <option value="sap_het">⚠️ Sắp hết hàng (≤ 5)</option>
                                        <option value="tam_an">🛑 Tạm ẩn / Hết kho</option>
                                        <option value="flash_sale">🔥 Chỉ xem Flash Sale</option>
                                    </select>

                                    <select
                                        value={sapXepSanPham}
                                        onChange={(e) => setSapXepSanPham(e.target.value)}
                                        className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                    >
                                        <option value="moi_nhat">✨ Mới cập nhật</option>
                                        <option value="ban_chay">🔥 Bán chạy nhất</option>
                                        <option value="gia_giam">💰 Giá cao → thấp</option>
                                        <option value="gia_tang">💵 Giá thấp → cao</option>
                                    </select>
                                </div>
                            </div>

                            {/* Bảng Danh Sách Sản Phẩm (Excel-Style Grid Sắc Nét) */}
                            <div className="relative bg-white dark:bg-[#0d1527] rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-md shadow-slate-900/5 overflow-hidden min-h-[380px]">
                                {/* Banner Tiêu Đề Bảng Đồng Bộ Chuẩn Đơn Hàng */}
                                <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                                    <div className="flex items-center gap-2">
                                        <Boxes className="w-4 h-4 text-blue-200" />
                                        <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                                            Kho Hàng & Danh Sách Sản Phẩm
                                        </h3>
                                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black">
                                            {sanPhamHienThi.length} sản phẩm
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-blue-100 font-bold flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span>Đồng bộ kho thực tế</span>
                                    </div>
                                </div>

                                <KhuVucDangTaiTable
                                    dangTai={dangTai || dangLocSanPham}
                                    tieuDe={dangLocSanPham ? "Đang áp dụng bộ lọc kho máy..." : "Đang đồng bộ kho sản phẩm..."}
                                    moTa={dangLocSanPham ? `Tìm thấy ${sanPhamHienThi.length} sản phẩm phù hợp` : "Hệ thống đang tải số lượng tồn kho, giá bán và cấu hình máy"}
                                />

                                <div className={`overflow-x-auto transition-opacity duration-300 ${dangTai || dangLocSanPham ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black uppercase text-[11px] tracking-wider whitespace-nowrap">
                                                <th className="py-2.5 px-2 w-10 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">#</th>
                                                <th className="py-2.5 px-2 w-14 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">ẢNH</th>
                                                <th className="py-2.5 px-3 min-w-[200px] max-w-[300px] xl:max-w-[360px] border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">TÊN SẢN PHẨM & CẤU HÌNH</th>
                                                <th className="py-2.5 px-2 w-20 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">HÃNG</th>
                                                <th className="py-2.5 px-2 w-28 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">GIÁ BÁN</th>
                                                <th className="py-2.5 px-2 w-16 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">KHO</th>
                                                <th className="py-2.5 px-2 w-24 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">FLASH SALE</th>
                                                <th className="py-2.5 px-2 w-24 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">TRẠNG THÁI</th>
                                                <th className="py-2.5 px-3 w-36 min-w-[135px] text-center border-b-2 border-l border-slate-300 dark:border-slate-700 whitespace-nowrap sticky right-0 bg-slate-100 dark:bg-slate-800 z-20 shadow-[-6px_0_12px_rgba(0,0,0,0.08)]">THAO TÁC</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sanPhamHienThi.length === 0 ? (
                                                <tr>
                                                    <td colSpan={9} className="py-12 text-center text-slate-400 border-b border-slate-200 dark:border-slate-800">
                                                        <div className="flex flex-col items-center justify-center gap-2">
                                                            <Package className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                                            <div className="font-bold text-sm text-slate-700 dark:text-slate-300">Không tìm thấy sản phẩm nào</div>
                                                            <div className="text-xs">Vui lòng thử đổi bộ lọc hoặc từ khóa tìm kiếm</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                sanPhamHienThi.map((sp, idx) => {
                                                    const thongTin = layThongSoNhanhAdmin(sp);
                                                    const idSp = sp.id || sp._id;
                                                    const dangXuLyItem = dangXuLySpId === idSp;
                                                    const dangXuLyChung = dangXuLySpId !== null || dangLuuSp;

                                                    return (
                                                        <tr key={idSp} className="group odd:bg-white even:bg-slate-50/70 dark:odd:bg-[#0d1527] dark:even:bg-[#090f1d] hover:!bg-blue-50/80 dark:hover:!bg-blue-950/50 transition-colors">
                                                            <td className="py-2 px-3 text-center font-bold text-slate-400 border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                #{idx + 1}
                                                            </td>
                                                            <td className="py-2 px-3 text-center border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <div
                                                                    onClick={() => setModalXemAnh({
                                                                        url: sp.hinh_anh_chinh,
                                                                        ten: sp.ten_san_pham,
                                                                        gia: sp.gia_khuyen_mai,
                                                                        gia_goc: sp.gia_goc,
                                                                        sku: sp.ma_san_pham,
                                                                        hang: sp.hang_san_xuat,
                                                                        variants: sp.tuy_chon_phien_ban || [],
                                                                        activeVariantIndex: 0
                                                                    })}
                                                                    className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 p-1 mx-auto relative border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs cursor-pointer group hover:border-blue-500 transition-all hover:scale-105"
                                                                    title="Bấm để phóng to xem ảnh sắc nét"
                                                                >
                                                                    <Image src={sp.hinh_anh_chinh} alt={sp.ten_san_pham} fill className="object-contain p-0.5" />
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-3 border-b border-r border-slate-200 dark:border-slate-800 max-w-[260px] md:max-w-[300px] xl:max-w-[360px] overflow-hidden">
                                                                <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate hover:text-blue-600 transition-colors" title={sp.ten_san_pham}>
                                                                    {sp.ten_san_pham}
                                                                </div>
                                                                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate mt-0.5 flex items-center gap-1.5" title={thongTin.text}>
                                                                    <span className="shrink-0">{thongTin.icon}</span>
                                                                    <span className="truncate">{thongTin.text}</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-2 border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <span className="inline-block px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-black uppercase text-xs border border-indigo-100 dark:border-indigo-900 whitespace-nowrap">
                                                                    {sp.hang_san_xuat}
                                                                </span>
                                                            </td>
                                                            <td className="py-2 px-2 border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                                    <span className="font-black text-xs text-red-600 dark:text-red-400">
                                                                        {dinhDangTienVND(sp.gia_khuyen_mai)}
                                                                    </span>
                                                                    {sp.gia_goc > sp.gia_khuyen_mai && (
                                                                        <span className="text-[10px] text-slate-400 line-through font-semibold">
                                                                            {dinhDangTienVND(sp.gia_goc)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-2 text-center border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black whitespace-nowrap ${sp.so_luong_ton_kho > 5 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : sp.so_luong_ton_kho > 0 ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'}`}>
                                                                    {sp.so_luong_ton_kho || 0}
                                                                </span>
                                                            </td>
                                                            <td className="py-2 px-2 text-center border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => xuLyToggleFlashSale(sp)}
                                                                    className={`px-2.5 py-0.5 rounded-full text-xs font-black inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-all cursor-pointer shadow-2xs active:scale-95 ${
                                                                        sp.la_flash_sale
                                                                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800 ring-1 ring-rose-500/20 hover:bg-rose-100'
                                                                            : 'bg-slate-100 text-slate-500 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                                                                    }`}
                                                                    title={sp.la_flash_sale ? 'Đang bật Flash Sale - Bấm để tắt' : 'Bấm để bật Flash Sale'}
                                                                >
                                                                    <Flame className={`w-3 h-3 ${sp.la_flash_sale ? 'text-rose-600 fill-rose-600 animate-pulse' : 'text-slate-400'}`} />
                                                                    <span className="whitespace-nowrap">{sp.la_flash_sale ? 'Bật Deal' : 'Tắt Deal'}</span>
                                                                </button>
                                                            </td>
                                                            <td className="py-2 px-2 text-center border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => xuLyToggleConHang(sp)}
                                                                    className={`px-2.5 py-0.5 rounded-full text-xs font-black inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-all cursor-pointer shadow-2xs active:scale-95 ${
                                                                        sp.con_hang !== false
                                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-500/20 hover:bg-emerald-100'
                                                                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                                                                    }`}
                                                                    title={sp.con_hang !== false ? 'Đang mở bán - Bấm để tạm ẩn ngay' : 'Đang tạm ẩn - Bấm để mở bán ngay'}
                                                                >
                                                                    <span className={`w-2 h-2 rounded-full shrink-0 ${sp.con_hang !== false ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                                                                    <span className="whitespace-nowrap">{sp.con_hang !== false ? 'Đang bán' : 'Tạm ẩn'}</span>
                                                                </button>
                                                            </td>
                                                            <td className="py-2 px-2 text-center border-b border-l border-slate-200 dark:border-slate-800 whitespace-nowrap sticky right-0 z-10 bg-white group-odd:bg-white group-even:bg-slate-50/70 dark:bg-[#0d1527] dark:group-odd:bg-[#0d1527] dark:group-even:bg-[#090f1d] group-hover:!bg-blue-50/90 dark:group-hover:!bg-blue-950/90 shadow-[-6px_0_12px_rgba(0,0,0,0.08)]">
                                                                <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                                                                    <Link
                                                                        href={`/san-pham/${sp.id || sp.slug || sp._id}`}
                                                                        target="_blank"
                                                                        className="p-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60 transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center shadow-2xs"
                                                                        title="Xem ngoài website khách hàng"
                                                                    >
                                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                                    </Link>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => moModalSuaSp(sp)}
                                                                        disabled={dangXuLyChung}
                                                                        className={`px-2 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs inline-flex items-center gap-1 shadow-xs transition-all hover:scale-105 active:scale-95 ${dangXuLyChung ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                        title="Chỉnh sửa sản phẩm"
                                                                    >
                                                                        <Edit3 className="w-3.5 h-3.5" />
                                                                        <span>Sửa</span>
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => xuLyXoaSanPham(idSp, sp.ten_san_pham)}
                                                                        disabled={dangXuLyChung}
                                                                        className={`px-2 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-xs transition-all hover:scale-105 active:scale-95 ${dangXuLyChung ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                        title="Xóa vĩnh viễn sản phẩm"
                                                                    >
                                                                        {dangXuLyItem ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                                        <span>Xóa</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================= */}
                    {/* TAB 4: HÃNG & THƯƠNG HIỆU */}
                    {/* ========================================= */}
                    {tabHienTai === 'danh_muc' && (
                        <div className="space-y-4 animate-in fade-in duration-200">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-[#0d1527] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-2.5 h-6 bg-purple-600 rounded-full" />
                                    <div>
                                        <h2 className="text-base font-black text-slate-900 dark:text-white">Thương Hiệu & Hãng Sản Xuất ({danhMucHienThi.length})</h2>
                                        <p className="text-xs text-slate-500 font-semibold">Quản lý danh sách thương hiệu đối tác trên website</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <div className="relative w-full sm:w-64">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={tuKhoaDanhMuc}
                                            onChange={(e) => setTuKhoaDanhMuc(e.target.value)}
                                            placeholder="Tìm kiếm thương hiệu..."
                                            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                                        />
                                    </div>

                                    <button
                                        onClick={moModalThemDanhMuc}
                                        className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 !text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-purple-500/25 cursor-pointer whitespace-nowrap shrink-0"
                                    >
                                        <Plus className="w-4 h-4 !text-white" />
                                        <span className="!text-white">Thêm Thương Hiệu</span>
                                    </button>
                                </div>
                            </div>

                            {/* Bảng Danh Mục / Thương Hiệu (Excel-Style Grid Sắc Nét) */}
                            <div className="relative bg-white dark:bg-[#0d1527] rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-md shadow-slate-900/5 overflow-hidden min-h-[380px]">
                                {/* Banner Tiêu Đề Bảng Đồng Bộ Chuẩn Đơn Hàng */}
                                <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-blue-200" />
                                        <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                                            Danh Sách Thương Hiệu & Hãng Sản Xuất
                                        </h3>
                                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black">
                                            {danhMucHienThi.length} thương hiệu
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-blue-100 font-bold flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span>Cập nhật trực tiếp</span>
                                    </div>
                                </div>

                                <KhuVucDangTaiTable
                                    dangTai={dangTai || dangLocDanhMuc}
                                    tieuDe={dangLocDanhMuc ? "Đang lọc thương hiệu..." : "Đang tải danh sách thương hiệu..."}
                                    moTa={dangLocDanhMuc ? `Tìm thấy ${danhMucHienThi.length} thương hiệu phù hợp` : "Đồng bộ danh sách thương hiệu đối tác trên hệ thống"}
                                />

                                <div className={`overflow-x-auto transition-opacity duration-300 ${dangTai || dangLocDanhMuc ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black uppercase text-[11px] tracking-wider whitespace-nowrap">
                                                <th className="py-2.5 px-2 w-10 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">#</th>
                                                <th className="py-2.5 px-2.5 min-w-[130px] border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">THƯƠNG HIỆU</th>
                                                <th className="py-2.5 px-2 w-20 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">MÃ CODE</th>
                                                <th className="py-2.5 px-2 w-28 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">XUẤT XỨ</th>
                                                <th className="py-2.5 px-2.5 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">MÔ TẢ CHI TIẾT</th>
                                                <th className="py-2.5 px-2 w-24 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">SỐ LƯỢNG</th>
                                                <th className="py-2.5 px-2 w-28 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">TRẠNG THÁI</th>
                                                <th className="py-2.5 px-1.5 w-16 text-center border-b-2 border-slate-300 dark:border-slate-700 whitespace-nowrap">THAO TÁC</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {danhMucHienThi.length === 0 ? (
                                                <tr>
                                                    <td colSpan={8} className="py-12 text-center text-slate-400 border-b border-slate-200 dark:border-slate-800">
                                                        <div className="flex flex-col items-center justify-center gap-2">
                                                            <Tag className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                                            <div className="font-bold text-sm text-slate-700 dark:text-slate-300">Không tìm thấy thương hiệu nào</div>
                                                            <div className="text-xs">Vui lòng thử tìm kiếm với từ khóa khác</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                danhMucHienThi.map((dm, idx) => {
                                                    const soMauCuaHang = danhSachSanPham.filter(s => s.hang_san_xuat?.toLowerCase() === dm.ma_danh_muc?.toLowerCase() || s.danh_muc?.includes(dm.ma_danh_muc)).length;
                                                    const laNhuCau = dm.loai === 'nhu_cau';
                                                    const dmId = dm.id || dm._id || dm.ma_danh_muc;
                                                    const dangXuLyItem = dangXuLyDmId === dmId;
                                                    const dangXuLyChung = dangXuLyDmId !== null || dangLuuDanhMuc;

                                                    return (
                                                        <tr key={dmId} className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-[#0d1527] dark:even:bg-[#090f1d] hover:!bg-blue-50/80 dark:hover:!bg-blue-950/50 transition-colors">
                                                            <td className="py-2 px-2 text-center font-bold text-slate-400 border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                #{idx + 1}
                                                            </td>
                                                            <td className="py-2 px-2.5 border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-6 h-6 rounded-md bg-purple-50 dark:bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                                                                        {dm.logo || '💻'}
                                                                    </div>
                                                                    <span className="font-black text-xs text-slate-900 dark:text-white whitespace-nowrap">{dm.ten_danh_muc}</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-2 font-mono font-black text-blue-600 dark:text-cyan-400 text-xs border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                @{dm.ma_danh_muc}
                                                            </td>
                                                            <td className="py-2 px-2 border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] whitespace-nowrap">
                                                                    {dm.xuat_xu || 'Chính Hãng'}
                                                                </span>
                                                            </td>
                                                            <td className="py-2 px-2.5 border-b border-r border-slate-200 dark:border-slate-800" title={dm.mo_ta}>
                                                                <div className="truncate max-w-[130px] lg:max-w-[190px] xl:max-w-[280px] text-slate-600 dark:text-slate-400 font-medium text-xs">
                                                                    {dm.mo_ta || '—'}
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-2 text-center border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <span className="inline-block px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-black text-xs whitespace-nowrap">
                                                                    {soMauCuaHang} sản phẩm
                                                                </span>
                                                            </td>
                                                            <td className="py-2 px-2 text-center border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <button
                                                                    onClick={() => xuLyToggleDanhMuc(dm)}
                                                                    disabled={dangXuLyChung}
                                                                    className={`px-2.5 py-0.5 rounded-full text-xs font-black inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${dangXuLyChung ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-xs'} ${dm.kich_hoat !== false ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
                                                                >
                                                                    {dangXuLyItem ? (
                                                                        <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                                                                    ) : (
                                                                        <span className={`w-2 h-2 rounded-full shrink-0 ${dm.kich_hoat !== false ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                                                    )}
                                                                    <span className="whitespace-nowrap">{dm.kich_hoat !== false ? 'Kinh doanh' : 'Tạm ngưng'}</span>
                                                                </button>
                                                            </td>
                                                            <td className="py-2 px-1.5 text-center border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                                                                    <button
                                                                        onClick={() => moModalSuaDanhMuc(dm)}
                                                                        disabled={dangXuLyChung}
                                                                        className={`p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 transition-colors ${dangXuLyChung ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                        title="Sửa thương hiệu"
                                                                    >
                                                                        <Edit3 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => xuLyXoaDanhMuc(dm)}
                                                                        disabled={dangXuLyChung}
                                                                        className={`p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 transition-colors ${dangXuLyChung ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                        title="Xóa thương hiệu"
                                                                    >
                                                                        {dangXuLyItem ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================= */}
                    {/* TAB 5: KHÁCH HÀNG (CRM DOANH THU & TIỀM NĂNG) */}
                    {/* ========================================= */}
                    {tabHienTai === 'khach_hang' && (
                        <div className="space-y-4 animate-in fade-in duration-200">
                            {/* Insight Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-5 rounded-3xl bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Tổng Khách Hàng</div>
                                        <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{danhSachNguoiDung.length} Thành Viên</div>
                                    </div>
                                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center text-lg">
                                        👥
                                    </div>
                                </div>

                                <div className="p-5 rounded-3xl bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Khách Tiềm Năng</div>
                                        <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
                                            {danhSachKhachHangKemDoanhThu.filter(u => u.laTiemNang).length} Khách VIP
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 flex items-center justify-center text-lg">
                                        🔥
                                    </div>
                                </div>

                                <div className="p-5 rounded-3xl bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Doanh Thu Từ Khách</div>
                                        <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                                            {dinhDangTienVND(danhSachKhachHangKemDoanhThu.reduce((s, u) => s + (u.tongChiTieu || 0), 0))}
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center text-lg">
                                        💰
                                    </div>
                                </div>
                            </div>

                            {/* Toolbar & Filter */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-[#0d1527] p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                                    <div className="relative w-full sm:w-64">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={tuKhoaKhachHang}
                                            onChange={(e) => setTuKhoaKhachHang(e.target.value)}
                                            placeholder="Tìm theo tên, email, sđt..."
                                            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                                        />
                                    </div>

                                    <select
                                        value={locKhachHang}
                                        onChange={(e) => setLocKhachHang(e.target.value)}
                                        className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                                    >
                                        <option value="tat_ca">Tất cả khách hàng</option>
                                        <option value="hoat_dong">🟢 Đang Hoạt Động</option>
                                        <option value="bi_khoa">🔒 Tài Khoản Đang Khóa</option>
                                        <option value="tiem_nang">🔥 Khách Tiềm Năng (Đã mua)</option>
                                        <option value="vip">⭐ Khách VIP & Platinum</option>
                                        <option value="admin">👑 Quản Trị Viên</option>
                                    </select>

                                    <select
                                        value={sapXepKhachHang}
                                        onChange={(e) => setSapXepKhachHang(e.target.value)}
                                        className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                                    >
                                        <option value="ngay_tao_moi">📅 Mới đăng ký gần đây</option>
                                        <option value="doanh_thu_giam">💰 Doanh thu cao → thấp</option>
                                        <option value="diem_giam">⭐ Điểm tích lũy cao</option>
                                        <option value="ten_az">🔤 Tên A - Z</option>
                                    </select>
                                </div>

                                <button
                                    onClick={moModalThemUser}
                                    className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 !text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/25 cursor-pointer whitespace-nowrap transition-all"
                                >
                                    <UserPlus className="w-4 h-4 !text-white" />
                                    <span className="!text-white">+ Thêm Tài Khoản Mới</span>
                                </button>
                            </div>

                            {/* Bảng Khách Hàng (Excel-Style Grid Sắc Nét) */}
                            <div className="relative bg-white dark:bg-[#0d1527] rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-md shadow-slate-900/5 overflow-hidden min-h-[380px]">
                                {/* Banner Tiêu Đề Bảng Đồng Bộ Chuẩn Đơn Hàng */}
                                <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-blue-200" />
                                        <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                                            Danh Sách Khách Hàng & Thành Viên VIP
                                        </h3>
                                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black">
                                            {khachHangHienThi.length} tài khoản
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-blue-100 font-bold flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span>Dữ liệu thời gian thực</span>
                                    </div>
                                </div>

                                <KhuVucDangTaiTable
                                    dangTai={dangTai || dangLocKhachHang}
                                    tieuDe={dangLocKhachHang ? "Đang lọc danh sách khách hàng..." : "Đang nạp danh sách khách hàng & thành viên..."}
                                    moTa={dangLocKhachHang ? `Tìm thấy ${khachHangHienThi.length} tài khoản phù hợp` : "Đồng bộ số liệu chi tiêu, đơn hàng và quyền hạn tài khoản"}
                                />

                                <div className={`overflow-x-auto transition-opacity duration-300 ${dangTai || dangLocKhachHang ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black uppercase text-[11px] tracking-wider whitespace-nowrap">
                                                <th className="py-2.5 px-2 w-10 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">#</th>
                                                <th className="py-2.5 px-2.5 min-w-[130px] border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">KHÁCH HÀNG</th>
                                                <th className="py-2.5 px-2.5 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">EMAIL ĐĂNG KÝ</th>
                                                <th className="py-2.5 px-2 w-28 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">SỐ ĐIỆN THOẠI</th>
                                                <th className="py-2.5 px-2 w-28 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">NGÀY TẠO</th>
                                                <th className="py-2.5 px-2 w-28 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">HẠNG THÀNH VIÊN</th>
                                                <th className="py-2.5 px-2 w-36 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">DOANH THU / CHI TIÊU</th>
                                                <th className="py-2.5 px-2 w-28 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">TRẠNG THÁI</th>
                                                <th className="py-2.5 px-2 w-28 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">PHÂN QUYỀN</th>
                                                <th className="py-2.5 px-1.5 w-24 text-center border-b-2 border-slate-300 dark:border-slate-700 whitespace-nowrap">THAO TÁC</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {khachHangHienThi.length === 0 ? (
                                                <tr>
                                                    <td colSpan={10} className="py-12 text-center text-slate-400 border-b border-slate-200 dark:border-slate-800">
                                                        <div className="flex flex-col items-center justify-center gap-2">
                                                            <Users className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                                            <div className="font-bold text-sm text-slate-700 dark:text-slate-300">Không tìm thấy khách hàng nào</div>
                                                            <div className="text-xs">Vui lòng thử tìm kiếm với từ khóa khác</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                khachHangHienThi.map((user, idx) => {
                                                    const uId = user.id || user._id;
                                                    const dangXuLy = dangXuLyUserId === uId;
                                                    const daBiKhoa = Boolean(user.biKhoa || user.trangThai === 'bi_khoa');
                                                    return (
                                                        <tr key={uId} className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-[#0d1527] dark:even:bg-[#090f1d] hover:!bg-blue-50/80 dark:hover:!bg-blue-950/50 transition-colors">
                                                            <td className="py-2 px-2 text-center font-bold text-slate-400 border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                #{idx + 1}
                                                            </td>
                                                            <td className="py-2 px-2.5 border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <div className="flex items-center gap-2 whitespace-nowrap">
                                                                    <div className={`w-6 h-6 rounded-md text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs ${
                                                                        daBiKhoa ? 'bg-gradient-to-tr from-slate-500 to-slate-400' : 'bg-gradient-to-tr from-emerald-600 to-teal-500'
                                                                    }`}>
                                                                        {user.hoTen?.charAt(0) || 'U'}
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                                        <span className={`font-extrabold text-xs whitespace-nowrap ${daBiKhoa ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                                                                            {user.hoTen}
                                                                        </span>
                                                                        {user.laTiemNang && (
                                                                            <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-black text-[9px] uppercase tracking-wider whitespace-nowrap">
                                                                                🔥 VIP
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-2.5 font-mono font-bold text-slate-900 dark:text-slate-200 text-xs border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <div className="truncate max-w-[150px] lg:max-w-[200px]" title={user.email}>
                                                                    {user.email}
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-2 text-slate-600 dark:text-slate-400 font-bold font-mono text-xs border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                {user.soDienThoai || 'Chưa cập nhật'}
                                                            </td>
                                                            <td className="py-2 px-2 text-center border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <div className="flex items-center justify-center gap-1 font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                                                                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                                    <span>{layNgayTaoKhachHang(user)}</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-2 border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <span className={`px-2 py-0.5 rounded-full font-black text-xs inline-block whitespace-nowrap ${user.hangThanhVien?.includes('Platinum') || user.hangThanhVien?.includes('Kim Cương') ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                                                                    user.hangThanhVien?.includes('Gold') || user.hangThanhVien?.includes('Vàng') ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                                                                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                                                    }`}>
                                                                    {user.hangThanhVien || 'Thành Viên Mới'}
                                                                </span>
                                                            </td>
                                                            <td className="py-2 px-2 border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                                    <span className="font-black text-xs text-red-600 dark:text-red-400">
                                                                        {dinhDangTienVND(user.tongChiTieu || 0)}
                                                                    </span>
                                                                    <span className="text-[11px] text-slate-400 font-semibold">
                                                                        ({user.soDonHang > 0 ? `${user.soDonHang} đơn` : '0 đơn'})
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-2 text-center border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <button
                                                                    onClick={() => xuLyKhoaNguoiDung(user)}
                                                                    disabled={dangXuLy}
                                                                    className={`px-2.5 py-1 rounded-full text-xs font-black inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-all shadow-2xs ${
                                                                        dangXuLy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                                                    } ${
                                                                        daBiKhoa
                                                                            ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-950 dark:text-red-300'
                                                                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                                                                    }`}
                                                                    title={daBiKhoa ? 'Tài khoản đang bị khóa tạm thời. Bấm để mở khóa!' : 'Tài khoản đang hoạt động bình thường. Bấm để tạm khóa!'}
                                                                >
                                                                    {daBiKhoa ? (
                                                                        <>
                                                                            <Lock className="w-3 h-3 text-red-600 dark:text-red-400 shrink-0" />
                                                                            <span>Tạm Khóa</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                                            <span>Hoạt Động</span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </td>
                                                            <td className="py-2 px-2 text-center border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <button
                                                                    onClick={() => xuLyDoiVaiTroNguoiDung(user)}
                                                                    disabled={dangXuLy}
                                                                    className={`px-2 py-0.5 rounded-full text-xs font-black inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${dangXuLy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${user.vaiTro === 'admin' ? 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-950 dark:text-purple-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`}
                                                                    title="Bấm để đổi quyền quản trị"
                                                                >
                                                                    {dangXuLy && <Loader2 className="w-3 h-3 animate-spin shrink-0" />}
                                                                    <span className="whitespace-nowrap">{user.vaiTro === 'admin' ? '👑 Quản Trị' : 'Khách Hàng'}</span>
                                                                </button>
                                                            </td>
                                                            <td className="py-2 px-1.5 text-center border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                                                                    {/* Nút Khóa / Mở Khóa Nhanh */}
                                                                    <button
                                                                        onClick={() => xuLyKhoaNguoiDung(user)}
                                                                        disabled={dangXuLy}
                                                                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                                                            daBiKhoa
                                                                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400'
                                                                                : 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400'
                                                                        }`}
                                                                        title={daBiKhoa ? 'Mở khóa tài khoản' : 'Khóa tài khoản tạm thời'}
                                                                    >
                                                                        {daBiKhoa ? (
                                                                            <Unlock className="w-3.5 h-3.5" />
                                                                        ) : (
                                                                            <Lock className="w-3.5 h-3.5" />
                                                                        )}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => moModalSuaUser(user)}
                                                                        disabled={dangXuLy}
                                                                        className={`p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 transition-colors ${dangXuLy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                        title="Sửa tài khoản"
                                                                    >
                                                                        <Edit3 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => xuLyXoaUser(user)}
                                                                        disabled={dangXuLy}
                                                                        className={`p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 transition-colors ${dangXuLy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                        title="Xóa tài khoản"
                                                                    >
                                                                        {dangXuLy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================= */}
                    {/* TAB 6: MÃ KHUYẾN MÃI (BẢNG ĐẲNG CẤP CHUẨN MẪU) */}
                    {/* ========================================= */}
                    {tabHienTai === 'voucher' && (
                        <div className="space-y-4 animate-in fade-in duration-200">
                            {/* Toolbar & Filter Bar */}
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-[#0d1527] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <span className="w-2.5 h-6 bg-rose-600 rounded-full" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-base font-black text-slate-900 dark:text-white">Mã Khuyến Mãi & Voucher</h2>
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
                                                {voucherHienThi.length} / {danhSachVoucher.length} mã
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-semibold">Quản lý mã giảm giá, mức giảm, thời hạn và số lượng phát hành</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                    {/* Tìm kiếm voucher */}
                                    <div className="relative min-w-[200px] flex-1 md:flex-initial">
                                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={tuKhoaVoucher}
                                            onChange={(e) => setTuKhoaVoucher(e.target.value)}
                                            placeholder="Tìm mã, tên voucher..."
                                            className="w-full pl-9 pr-8 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
                                        />
                                        {tuKhoaVoucher && (
                                            <button
                                                onClick={() => setTuKhoaVoucher('')}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>

                                    {/* Lọc trạng thái */}
                                    <select
                                        value={locTrangThaiVoucher}
                                        onChange={(e) => setLocTrangThaiVoucher(e.target.value)}
                                        className="px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:border-rose-500"
                                    >
                                        <option value="tat_ca">Tất cả trạng thái</option>
                                        <option value="kich_hoat">🟢 Đang hoạt động ({danhSachVoucher.filter(v => v.kich_hoat !== false).length})</option>
                                        <option value="tam_an">⚪ Đã tạm ẩn ({danhSachVoucher.filter(v => v.kich_hoat === false).length})</option>
                                    </select>

                                    <button
                                        onClick={moModalThemVoucher}
                                        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 !text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-rose-500/25 transition-all cursor-pointer whitespace-nowrap"
                                    >
                                        <Plus className="w-4 h-4 !text-white" />
                                        <span className="!text-white">+ Tạo Mã Voucher Mới</span>
                                    </button>
                                </div>
                            </div>

                            {/* Bảng Danh Sách Voucher Chuẩn Mẫu Siêu Đẹp (Excel-Style Grid Sắc Nét) */}
                            <div className="relative bg-white dark:bg-[#0d1527] rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-md shadow-slate-900/5 overflow-hidden min-h-[380px]">
                                {/* Banner Tiêu Đề Bảng Đồng Bộ Chuẩn Đơn Hàng */}
                                <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                                    <div className="flex items-center gap-2">
                                        <Ticket className="w-4 h-4 text-blue-200" />
                                        <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                                            Kho Mã Giảm Giá & Voucher Khuyến Mãi
                                        </h3>
                                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black">
                                            {voucherHienThi.length} voucher
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-blue-100 font-bold flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span>Đang phát hành</span>
                                    </div>
                                </div>

                                <KhuVucDangTaiTable
                                    dangTai={dangTai || dangLocVoucher}
                                    tieuDe={dangLocVoucher ? "Đang lọc kho mã khuyến mãi..." : "Đang nạp kho mã voucher khuyến mãi..."}
                                    moTa={dangLocVoucher ? `Tìm thấy ${voucherHienThi.length} mã voucher phù hợp` : "Đồng bộ danh sách mã giảm giá và số lượng phát hành"}
                                />

                                <div className={`overflow-x-auto transition-opacity duration-300 ${dangTai || dangLocVoucher ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black uppercase text-[11px] tracking-wider whitespace-nowrap">
                                                <th className="py-2.5 px-2 w-10 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">
                                                    <input type="checkbox" className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer" />
                                                </th>
                                                <th className="py-2.5 px-2 w-28 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">MÃ CODE</th>
                                                <th className="py-2.5 px-2.5 min-w-[130px] border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">TÊN VOUCHER</th>
                                                <th className="py-2.5 px-2 w-20 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">LOẠI</th>
                                                <th className="py-2.5 px-2 w-24 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">GIÁ TRỊ</th>
                                                <th className="py-2.5 px-2 w-24 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">ĐƠN TỐI THIỂU</th>
                                                <th className="py-2.5 px-2 w-28 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">ĐÃ SĂN / TỔNG</th>
                                                <th className="py-2.5 px-2 w-28 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">THỜI HẠN</th>
                                                <th className="py-2.5 px-2 w-24 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">TRẠNG THÁI</th>
                                                <th className="py-2.5 px-1.5 w-16 text-center border-b-2 border-slate-300 dark:border-slate-700 whitespace-nowrap">THAO TÁC</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {voucherHienThi.length === 0 ? (
                                                <tr>
                                                    <td colSpan={10} className="py-12 text-center text-slate-400 border-b border-slate-200 dark:border-slate-800">
                                                        <Ticket className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                                                        <p className="font-bold text-sm text-slate-700 dark:text-slate-300">Không tìm thấy voucher nào phù hợp</p>
                                                        <p className="text-xs text-slate-400 mt-0.5">Thử đổi từ khóa hoặc chọn "Tất cả trạng thái"</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                voucherHienThi.map((vc, idx) => {
                                                    const tongPhatHanh = vc.so_luong_phat_hanh || 20;
                                                    const daSuDung = vc.so_luong_da_dung || Math.min(2 + idx, tongPhatHanh);
                                                    const conLai = Math.max(0, tongPhatHanh - daSuDung);
                                                    const phanTramDaDung = Math.round((daSuDung / tongPhatHanh) * 100);

                                                    const isFreeship = vc.loai_giam === 'freeship' || vc.ma_code?.toLowerCase().includes('freeship');
                                                    const isPercent = vc.loai_giam === 'phan_tram' || String(vc.gia_tri_giam).includes('%');

                                                    return (
                                                        <tr key={vc.id || vc.ma_code || vc._id} className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-[#0d1527] dark:even:bg-[#090f1d] hover:!bg-blue-50/80 dark:hover:!bg-blue-950/50 transition-colors">
                                                            <td className="py-2 px-2 text-center border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <input type="checkbox" className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer" />
                                                            </td>
                                                            <td className="py-2 px-2 border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                                    <span className="w-1.5 h-5 bg-rose-600 rounded-full shrink-0" />
                                                                    <span className="font-mono font-black text-xs text-red-600 dark:text-red-400 tracking-wider">
                                                                        {vc.ma_code}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-2.5 border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                                    <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate max-w-[150px] lg:max-w-[200px]" title={vc.tieu_de}>{vc.tieu_de}</span>
                                                                    {vc.badge && (
                                                                        <span className="px-1 py-0.5 rounded text-[9px] font-black uppercase bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 shrink-0">
                                                                            {vc.badge}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {vc.chuyen_muc && vc.chuyen_muc !== 'toan_san' && (
                                                                    <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 mt-0.5">
                                                                        🏷️ {vc.chuyen_muc === 'gaming' ? 'Gaming' : vc.chuyen_muc === 'sinh_vien' ? 'VP' : vc.chuyen_muc}
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="py-2 px-2 text-center border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <span className={`px-2 py-0.5 rounded-full font-black text-[11px] whitespace-nowrap ${isFreeship ? 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                                                                    isPercent ? 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                                                                        'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                                    }`}>
                                                                    {isFreeship ? 'Freeship' : isPercent ? 'Giảm %' : 'Tiền mặt'}
                                                                </span>
                                                            </td>
                                                            <td className="py-2 px-2 border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <div className="font-black text-xs text-slate-900 dark:text-white whitespace-nowrap">
                                                                    {isFreeship ? 'Free' : isPercent ? `${vc.gia_tri_giam}%` : `${Math.round(vc.gia_tri_giam / 1000)}K`}
                                                                </div>
                                                                <div className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">
                                                                    {isFreeship ? 'Miễn ship' : isPercent ? `Tối đa ${dinhDangTienVND(vc.giam_toi_da || 1500000)}` : dinhDangTienVND(vc.gia_tri_giam)}
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-2 font-bold text-slate-700 dark:text-slate-300 text-xs border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                {vc.don_hang_toi_thieu > 0 ? dinhDangTienVND(vc.don_hang_toi_thieu) : '0đ'}
                                                            </td>
                                                            <td className="py-2 px-2 border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <div className="flex items-center justify-between text-[11px] font-black text-slate-700 dark:text-slate-300 mb-0.5">
                                                                    <span>{daSuDung}/{tongPhatHanh}</span>
                                                                </div>
                                                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="bg-emerald-500 h-full rounded-full transition-all"
                                                                        style={{ width: `${Math.min(100, phanTramDaDung)}%` }}
                                                                    />
                                                                </div>
                                                                <div className="text-[10px] text-slate-400 font-semibold mt-0.5 whitespace-nowrap">
                                                                    Dùng {daSuDung} • Còn {conLai}
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-2 border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <div className="text-slate-700 dark:text-slate-300 font-bold text-[11px] flex items-center gap-1 whitespace-nowrap">
                                                                    <Calendar className="w-3 h-3 text-slate-400" />
                                                                    <span>{vc.ngay_bat_dau || '19/08/2026'}</span>
                                                                </div>
                                                                <div className="text-[10px] text-slate-400 pl-4 font-semibold whitespace-nowrap">
                                                                    → {vc.ngay_het_han || '31/12/2026'}
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-2 text-center border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                {(() => {
                                                                    const vId = vc.id || vc.ma_code || vc._id;
                                                                    const dangXuLy = dangXuLyVoucherId === vId;
                                                                    return (
                                                                        <div className="flex flex-col items-center">
                                                                            <button
                                                                                type="button"
                                                                                disabled={dangXuLy}
                                                                                onClick={() => xuLyToggleVoucher(vc)}
                                                                                className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${dangXuLy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${vc.kich_hoat !== false ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                                                                                title={vc.kich_hoat !== false ? 'Đang bật - Bấm để ẩn' : 'Đã ẩn - Bấm để bật'}
                                                                            >
                                                                                <span
                                                                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${vc.kich_hoat !== false ? 'translate-x-4' : 'translate-x-0'}`}
                                                                                />
                                                                            </button>
                                                                            <div className="text-[10px] font-black mt-0.5 whitespace-nowrap">
                                                                                {dangXuLy ? (
                                                                                    <span className="text-slate-400 flex items-center gap-1"><Loader2 className="w-2 h-2 animate-spin" /> Lưu...</span>
                                                                                ) : vc.kich_hoat !== false ? (
                                                                                    <span className="text-emerald-600 dark:text-emerald-400">• Đang bật</span>
                                                                                ) : (
                                                                                    <span className="text-slate-400">• Đã ẩn</span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })()}
                                                            </td>
                                                            <td className="py-2 px-1.5 text-center border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                {(() => {
                                                                    const vId = vc.id || vc.ma_code || vc._id;
                                                                    const dangXuLy = dangXuLyVoucherId === vId;
                                                                    return (
                                                                        <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                                                                            <button
                                                                                onClick={() => moModalSuaVoucher(vc)}
                                                                                disabled={dangXuLy}
                                                                                className={`p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900 transition-colors ${dangXuLy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                                title="Sửa voucher"
                                                                            >
                                                                                <Edit3 className="w-3.5 h-3.5" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => xuLyXoaVoucher(vc)}
                                                                                disabled={dangXuLy}
                                                                                className={`p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900 transition-colors ${dangXuLy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                                title="Xóa voucher"
                                                                            >
                                                                                {dangXuLy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                                            </button>
                                                                        </div>
                                                                    );
                                                                })()}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================= */}
                    {/* TAB 7: TIN TỨC & BÀI VIẾT (QUẢN TRỊ TOÀN DIỆN) */}
                    {/* ========================================= */}
                    {tabHienTai === 'tin_tuc' && (
                        <div className="space-y-4 animate-in fade-in duration-200">
                            {/* Insight Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-5 rounded-3xl bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Tổng Bài Viết</div>
                                        <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{danhSachTinTuc.length} Bài Đăng</div>
                                    </div>
                                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400 flex items-center justify-center text-lg">
                                        📰
                                    </div>
                                </div>

                                <div className="p-5 rounded-3xl bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Bài Tiêu Điểm 2026</div>
                                        <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
                                            {danhSachTinTuc.filter(t => t.la_tieu_diem).length} Bài Hot
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 flex items-center justify-center text-lg">
                                        🔥
                                    </div>
                                </div>

                                <div className="p-5 rounded-3xl bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Tổng Lượt Xem Đọc</div>
                                        <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                                            {thongKe.tongLuotXemTin.toLocaleString('vi-VN')} Lượt
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center text-lg">
                                        👁️
                                    </div>
                                </div>
                            </div>

                            {/* Toolbar & Filter */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-[#0d1527] p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                                    <div className="relative w-full sm:w-64">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={tuKhoaTinTuc}
                                            onChange={(e) => setTuKhoaTinTuc(e.target.value)}
                                            placeholder="Tìm theo tiêu đề, tác giả..."
                                            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                                        />
                                    </div>

                                    <select
                                        value={locChuyenMucTinTuc}
                                        onChange={(e) => setLocChuyenMucTinTuc(e.target.value)}
                                        className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                                    >
                                        <option value="tat_ca">Tất cả chuyên mục</option>
                                        <option value="Tư Vấn Mua Sắm">Tư Vấn Mua Sắm</option>
                                        <option value="Xu Hướng Công Nghệ">Xu Hướng Công Nghệ</option>
                                        <option value="Đánh Giá & So Sánh">Đánh Giá & So Sánh</option>
                                        <option value="Tin Tức Công Nghệ">Tin Tức Công Nghệ</option>
                                        <option value="Chia Sẻ Kinh Nghiệm">Chia Sẻ Kinh Nghiệm</option>
                                    </select>

                                    <select
                                        value={locTrangThaiTinTuc}
                                        onChange={(e) => setLocTrangThaiTinTuc(e.target.value)}
                                        className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                                    >
                                        <option value="tat_ca">Tất cả trạng thái</option>
                                        <option value="xuat_ban">🟢 Đã xuất bản</option>
                                        <option value="ban_nhap">⚪ Bản nháp / Tạm ẩn</option>
                                    </select>
                                </div>

                                <button
                                    onClick={moModalThemTinTuc}
                                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 !text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-teal-500/25 transition-all cursor-pointer whitespace-nowrap"
                                >
                                    <Plus className="w-4 h-4 !text-white" />
                                    <span className="!text-white">+ Viết Bài Tin Tức Mới</span>
                                </button>
                            </div>

                            {/* Bảng Danh Sách Bài Viết Chuẩn Magazine (Excel-Style Grid Sắc Nét) */}
                            <div className="relative bg-white dark:bg-[#0d1527] rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-md shadow-slate-900/5 overflow-hidden min-h-[380px]">
                                {/* Banner Tiêu Đề Bảng Đồng Bộ Chuẩn Đơn Hàng */}
                                <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                                    <div className="flex items-center gap-2">
                                        <Newspaper className="w-4 h-4 text-blue-200" />
                                        <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                                            Danh Sách Bài Viết & Tin Tức Công Nghệ
                                        </h3>
                                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black">
                                            {tinTucHienThi.length} bài viết
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-blue-100 font-bold flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span>Xuất bản trực tiếp</span>
                                    </div>
                                </div>

                                <KhuVucDangTaiTable
                                    dangTai={dangTai || dangLocTinTuc}
                                    tieuDe={dangLocTinTuc ? "Đang lọc danh sách bài viết..." : "Đang tải danh sách bài viết & tin tức..."}
                                    moTa={dangLocTinTuc ? `Tìm thấy ${tinTucHienThi.length} bài viết phù hợp` : "Đồng bộ nội dung công nghệ, lượt xem và bài viết tiêu điểm"}
                                />

                                <div className={`overflow-x-auto transition-opacity duration-300 ${dangTai || dangLocTinTuc ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black uppercase text-[11px] tracking-wider whitespace-nowrap">
                                                <th className="py-2.5 px-2 w-10 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">#</th>
                                                <th className="py-2.5 px-2 w-14 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">ẢNH</th>
                                                <th className="py-2.5 px-2.5 min-w-[150px] border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">TIÊU ĐỀ & TÓM TẮT BÀI VIẾT</th>
                                                <th className="py-2.5 px-2 w-28 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">CHUYÊN MỤC</th>
                                                <th className="py-2.5 px-2 w-32 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">TÁC GIẢ & NGÀY</th>
                                                <th className="py-2.5 px-2 w-16 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">LƯỢT XEM</th>
                                                <th className="py-2.5 px-2 w-24 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">TIÊU ĐIỂM</th>
                                                <th className="py-2.5 px-2 w-24 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">TRẠNG THÁI</th>
                                                <th className="py-2.5 px-1.5 w-16 text-center border-b-2 border-slate-300 dark:border-slate-700 whitespace-nowrap">THAO TÁC</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tinTucHienThi.length === 0 ? (
                                                <tr>
                                                    <td colSpan={9} className="py-12 text-center text-slate-400 border-b border-slate-200 dark:border-slate-800">
                                                        <div className="flex flex-col items-center justify-center gap-2">
                                                            <Newspaper className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                                            <div className="font-bold text-sm text-slate-700 dark:text-slate-300">Không tìm thấy bài viết nào</div>
                                                            <div className="text-xs">Vui lòng thử tìm kiếm với từ khóa khác</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                tinTucHienThi.map((tin, idx) => {
                                                    const tinId = tin.id || tin._id;
                                                    const dangXuLy = dangXuLyTinTucId === tinId;
                                                    return (
                                                        <tr key={tinId} className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-[#0d1527] dark:even:bg-[#090f1d] hover:!bg-blue-50/80 dark:hover:!bg-blue-950/50 transition-colors">
                                                            <td className="py-2 px-2 text-center font-bold text-slate-400 border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                #{idx + 1}
                                                            </td>
                                                            <td className="py-2 px-2 text-center border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <div className="w-10 h-7 rounded-lg bg-slate-950 overflow-hidden relative mx-auto border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs">
                                                                    <Image src={tin.hinh_anh} alt={tin.tieu_de} fill className="object-cover" />
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-2.5 max-w-sm border-b border-r border-slate-200 dark:border-slate-800">
                                                                <div className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1" title={tin.tieu_de}>
                                                                    {tin.tieu_de}
                                                                </div>
                                                                <div className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5" title={tin.tom_tat}>
                                                                    {tin.tom_tat}
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-2 border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <span className="inline-block px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-black text-xs whitespace-nowrap">
                                                                    {tin.chuyen_muc}
                                                                </span>
                                                            </td>
                                                            <td className="py-2 px-2 border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{tin.tac_gia}</span>
                                                                    <span className="text-[11px] text-slate-400 font-semibold">({tin.ngay_dang || '24/08/2026'})</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-2 text-center border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <span className="font-black text-xs text-emerald-600 dark:text-emerald-400">
                                                                    {tin.luot_xem || 120}
                                                                </span>
                                                            </td>
                                                            <td className="py-2 px-2 text-center border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => xuLyToggleTieuDiemTinTuc(tin)}
                                                                    className={`px-2.5 py-0.5 rounded-full text-xs font-black inline-flex items-center justify-center gap-1 whitespace-nowrap transition-all cursor-pointer shadow-2xs active:scale-95 ${
                                                                        tin.la_tieu_diem
                                                                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800 ring-1 ring-rose-500/20 hover:bg-rose-100'
                                                                            : 'bg-slate-100 text-slate-500 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                                                                    }`}
                                                                    title={tin.la_tieu_diem ? 'Đang là tin tiêu điểm - Bấm để bỏ ghim' : 'Bấm để ghim tin tiêu điểm'}
                                                                >
                                                                    <Flame className={`w-3 h-3 ${tin.la_tieu_diem ? 'text-rose-600 fill-rose-600 animate-pulse' : 'text-slate-400'}`} />
                                                                    <span className="whitespace-nowrap">{tin.la_tieu_diem ? 'Tiêu điểm' : 'Thường'}</span>
                                                                </button>
                                                            </td>
                                                            <td className="py-2 px-2 text-center border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => xuLyToggleXuatBanTinTuc(tin)}
                                                                    className={`px-2.5 py-0.5 rounded-full text-xs font-black inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-all cursor-pointer shadow-2xs active:scale-95 ${
                                                                        tin.xuat_ban !== false
                                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-500/20 hover:bg-emerald-100'
                                                                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                                                                    }`}
                                                                    title={tin.xuat_ban !== false ? 'Đang xuất bản - Bấm để chuyển về bản nháp' : 'Bản nháp - Bấm để xuất bản ngay'}
                                                                >
                                                                    <span className={`w-2 h-2 rounded-full shrink-0 ${tin.xuat_ban !== false ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                                                                    <span className="whitespace-nowrap">{tin.xuat_ban !== false ? 'Xuất bản' : 'Bản nháp'}</span>
                                                                </button>
                                                            </td>
                                                            <td className="py-2 px-1.5 text-center border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                                <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                                                                    <Link
                                                                        href={`/tin-tuc/${slugTinTuc(tin)}`}
                                                                        target="_blank"
                                                                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 cursor-pointer transition-colors"
                                                                        title="Xem bài viết ngoài trang chủ"
                                                                    >
                                                                        <Eye className="w-3.5 h-3.5" />
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => moModalSuaTin(tin)}
                                                                        disabled={dangXuLy}
                                                                        className={`p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 transition-colors ${dangXuLy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                        title="Chỉnh sửa bài viết"
                                                                    >
                                                                        <Edit3 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => xuLyXoaTinTuc(tinId, tin.tieu_de)}
                                                                        disabled={dangXuLy}
                                                                        className={`p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 transition-colors ${dangXuLy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                        title="Xóa bài viết"
                                                                    >
                                                                        {dangXuLy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================= */}
                    {/* TAB 8: CẤU HÌNH BANNER & CHIẾN DỊCH KHUYẾN MÃI (DỮ LIỆU ĐỘNG) */}
                    {/* ========================================= */}
                    {tabHienTai === 'khuyen_mai' && (
                        <div className="space-y-5 animate-in fade-in duration-200">
                            {/* Toolbar Header */}
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-[#0d1527] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-base font-black text-slate-900 dark:text-white">Cấu Hình Banner & Khuyến Mãi</h2>
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Live Sync
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-semibold">Tùy biến tiêu đề hero, ảnh nền 3D, mức giảm, đồng hồ đếm ngược và thông báo chạy thời gian thực</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5">
                                    <button
                                        type="button"
                                        onClick={xuLyKhoiPhucCaiDatKm}
                                        className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                                        title="Khôi phục về cấu hình mẫu ban đầu"
                                    >
                                        <RotateCcw className="w-4 h-4 text-slate-400" />
                                        <span>Khôi Phục Mặc Định</span>
                                    </button>

                                    <Link
                                        href="/khuyen-mai"
                                        target="_blank"
                                        className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                                        title="Mở trang khuyến mãi xem trực tiếp"
                                    >
                                        <ExternalLink className="w-4 h-4 text-slate-500" />
                                        <span>Xem Trang Live ↗</span>
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={xuLyLuuCaiDatKm}
                                        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/25 cursor-pointer transition-all hover:scale-[1.02]"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Lưu & Áp Dụng Ngay</span>
                                    </button>
                                </div>
                            </div>

                            {/* Live Interactive Hero Preview */}
                            <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl bg-gradient-to-b from-[#0b0f19] to-[#040711] text-white p-6 md:p-8">
                                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] font-bold text-slate-300">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                    <span>Bản xem trước trực tiếp (Live Hero Preview)</span>
                                </div>

                                <div className="relative z-10 max-w-2xl space-y-3">
                                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-black text-xs uppercase tracking-wider shadow-md">
                                        <Flame className="w-3.5 h-3.5" />
                                        <span>{formCaiDatKm.badge_noi_bat || 'SIÊU KHUYẾN MÃI'}</span>
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-300 leading-tight">
                                        {formCaiDatKm.tieu_de_chinh || 'TIÊU ĐỀ CHIẾN DỊCH KHUYẾN MÃI'}
                                    </h3>

                                    <p className="text-xs md:text-sm text-slate-300 font-medium line-clamp-2">
                                        {formCaiDatKm.phu_de || 'Phụ đề giới thiệu ưu đãi hấp dẫn dành cho khách hàng.'}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-3 pt-2">
                                        <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs">
                                            {formCaiDatKm.muc_giam_toi_da || 'GIẢM ĐẾN 35%'}
                                        </span>
                                        <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-black text-xs shadow-md">
                                            {formCaiDatKm.nut_hanh_dong_text || 'Khám Phá Deal Hot Ngay'}
                                        </span>
                                        <span className="text-[11px] text-slate-400 font-semibold">
                                            ⏳ Kết thúc: {new Date(formCaiDatKm.thoi_gian_ket_thuc || '2026-09-30T23:59:59').toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                </div>

                                {/* Background Overlay Preview */}
                                <div
                                    className="absolute inset-0 opacity-25 bg-cover bg-center mix-blend-screen pointer-events-none transition-all duration-500"
                                    style={{ backgroundImage: `url(${formCaiDatKm.hinh_anh_banner || '/images/hero_banner_3d.jpg'})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent pointer-events-none" />
                            </div>

                            {/* Two-Column Form for Configuration */}
                            <form onSubmit={xuLyLuuCaiDatKm} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                {/* Cột 1: Thông Tin Chiến Dịch */}
                                <div className="bg-white dark:bg-[#0d1527] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                                        <Tag className="w-4 h-4 text-rose-600" />
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white">1. Nội Dung & Thông Điệp Chiến Dịch</h3>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300 text-xs">Tiêu Đề Chính Banner Hero *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formCaiDatKm.tieu_de_chinh || ''}
                                            onChange={(e) => setFormCaiDatKm({ ...formCaiDatKm, tieu_de_chinh: e.target.value })}
                                            placeholder="ĐẠI TIỆC LAPTOP GAMING & AI PC 2026..."
                                            className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-black text-xs text-slate-900 dark:text-white focus:border-rose-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300 text-xs">Phụ Đề / Mô Tả Ngắn Nổi Bật</label>
                                        <textarea
                                            rows="2"
                                            value={formCaiDatKm.phu_de || ''}
                                            onChange={(e) => setFormCaiDatKm({ ...formCaiDatKm, phu_de: e.target.value })}
                                            placeholder="Săn Deal Khủng Đến 35% - Tặng Balo ROG, Chuột Gaming & Voucher 3 Triệu..."
                                            className="w-full px-3.5 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium text-xs text-slate-900 dark:text-white focus:border-rose-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3.5">
                                        <div className="space-y-1">
                                            <label className="font-bold text-slate-700 dark:text-slate-300 text-xs">Badge Nhãn Đỏ Trên Cùng</label>
                                            <input
                                                type="text"
                                                value={formCaiDatKm.badge_noi_bat || ''}
                                                onChange={(e) => setFormCaiDatKm({ ...formCaiDatKm, badge_noi_bat: e.target.value.toUpperCase() })}
                                                placeholder="SIÊU KHUYẾN MÃI MÙA TỰU TRƯỜNG..."
                                                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-black text-xs text-red-600 focus:border-rose-500 focus:outline-none uppercase"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-slate-700 dark:text-slate-300 text-xs">Mức Giảm Tối Đa Hiển Thị</label>
                                            <input
                                                type="text"
                                                value={formCaiDatKm.muc_giam_toi_da || ''}
                                                onChange={(e) => setFormCaiDatKm({ ...formCaiDatKm, muc_giam_toi_da: e.target.value })}
                                                placeholder="GIẢM ĐẾN 35%"
                                                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-black text-xs text-amber-600 focus:border-rose-500 focus:outline-none uppercase"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-rose-500" />
                                            <span>Thời Gian Kết Thúc Đếm Ngược (Countdown)</span>
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={formCaiDatKm.thoi_gian_ket_thuc ? formCaiDatKm.thoi_gian_ket_thuc.substring(0, 16) : '2026-09-30T23:59'}
                                            onChange={(e) => setFormCaiDatKm({ ...formCaiDatKm, thoi_gian_ket_thuc: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-xs text-slate-900 dark:text-white focus:border-rose-500 focus:outline-none"
                                        />
                                        <p className="text-[11px] text-slate-400">Đồng hồ đếm ngược giờ:phút:giây trên trang Khuyến Mãi sẽ tự động căn cứ theo mốc thời gian này.</p>
                                    </div>
                                </div>

                                {/* Cột 2: Giao Diện & Hình Ảnh */}
                                <div className="bg-white dark:bg-[#0d1527] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                                        <ImageIcon className="w-4 h-4 text-blue-600" />
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white">2. Giao Diện & Tương Tác Nút Bấm</h3>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300 text-xs">URL Hình Ảnh Nền Hero (Background 3D)</label>
                                        <input
                                            type="text"
                                            value={formCaiDatKm.hinh_anh_banner || ''}
                                            onChange={(e) => setFormCaiDatKm({ ...formCaiDatKm, hinh_anh_banner: e.target.value })}
                                            placeholder="/images/hero_banner_3d.jpg"
                                            className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-xs text-blue-600 dark:text-blue-400 focus:border-rose-500 focus:outline-none"
                                        />
                                        {/* Preset Buttons */}
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            <span className="text-[11px] text-slate-400 font-bold self-center mr-1">Chọn nhanh:</span>
                                            <button
                                                type="button"
                                                onClick={() => setFormCaiDatKm({ ...formCaiDatKm, hinh_anh_banner: '/images/hero_banner_3d.jpg' })}
                                                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                                            >
                                                ⚡ 3D Laptop Concept
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormCaiDatKm({ ...formCaiDatKm, hinh_anh_banner: '/images/hero_legion_rog_gift.jpg' })}
                                                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                                            >
                                                🎮 ROG & Legion Gaming
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormCaiDatKm({ ...formCaiDatKm, hinh_anh_banner: '/images/deal_office_bg.jpg' })}
                                                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                                            >
                                                💼 Văn Phòng AI Slim
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3.5">
                                        <div className="space-y-1">
                                            <label className="font-bold text-slate-700 dark:text-slate-300 text-xs">Text Nút Kêu Gọi Hành Động</label>
                                            <input
                                                type="text"
                                                value={formCaiDatKm.nut_hanh_dong_text || ''}
                                                onChange={(e) => setFormCaiDatKm({ ...formCaiDatKm, nut_hanh_dong_text: e.target.value })}
                                                placeholder="Khám Phá Deal Hot Ngay"
                                                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-xs text-slate-900 dark:text-white focus:border-rose-500 focus:outline-none"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-slate-700 dark:text-slate-300 text-xs">Link Nút Hành Động</label>
                                            <input
                                                type="text"
                                                value={formCaiDatKm.nut_hanh_dong_link || ''}
                                                onChange={(e) => setFormCaiDatKm({ ...formCaiDatKm, nut_hanh_dong_link: e.target.value })}
                                                placeholder="#san-pham-giam-sau hoặc /san-pham"
                                                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-xs text-slate-900 dark:text-white focus:border-rose-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1.5">
                                            <Activity className="w-3.5 h-3.5 text-amber-500" />
                                            <span>Thanh Thông Báo Chạy Marquee Đầu Trang</span>
                                        </label>
                                        <textarea
                                            rows="2"
                                            value={formCaiDatKm.thong_bao_chay || ''}
                                            onChange={(e) => setFormCaiDatKm({ ...formCaiDatKm, thong_bao_chay: e.target.value })}
                                            placeholder="⚡ BÙNG NỔ ƯU ĐÃI: Giảm ngay 3.000.000đ khi mua laptop hôm nay..."
                                            className="w-full px-3.5 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium text-xs text-slate-900 dark:text-white focus:border-rose-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="pt-2 flex items-center justify-end gap-3">
                                        <button
                                            type="submit"
                                            disabled={dangLuuKm}
                                            className={`w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 transition-all ${dangLuuKm ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            {dangLuuKm ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            <span>{dangLuuKm ? 'Đang lưu cấu hình...' : 'Lưu Thiết Lập Khuyến Mãi Ngay'}</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* TAB 9: QUẢN LÝ SHOWROOM & TỌA ĐỘ GPS BẢN ĐỒ (100% REALTIME) */}
                    {/* ========================================================= */}
                    {tabHienTai === 'showroom' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            {/* Header Toolbar Gọn Gàng */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                                                Cấu Hình Showroom & Tọa Độ Bản Đồ
                                            </h2>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Cập nhật địa chỉ, hotline và tọa độ GPS (Vĩ độ, Kinh độ) để Google Maps hiển thị chính xác 100%.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2.5 shrink-0">
                                    <button
                                        type="button"
                                        onClick={xuLyKhoiPhucShowroom}
                                        disabled={dangLuuShowroom}
                                        className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                                        title="Khôi phục về 3 showroom mặc định"
                                    >
                                        <RotateCcw className="w-4 h-4 text-slate-500" />
                                        <span>Khôi phục gốc</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={xuLyThemShowroomMoi}
                                        disabled={dangLuuShowroom}
                                        className="px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Thêm Cửa Hàng</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={xuLyLuuShowroom}
                                        disabled={dangLuuShowroom}
                                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                                    >
                                        {dangLuuShowroom ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        <span>{dangLuuShowroom ? 'Đang lưu...' : 'Lưu Cấu Hình'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Bố Cục 2 Cột: Cột Trái Danh Sách Cửa Hàng - Cột Phải Live Preview Google Maps */}
                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                                {/* Cột Trái: Danh Sách Showroom (7 Cột) */}
                                <div className="xl:col-span-7 space-y-4">
                                    {danhSachShowroomAdmin.map((sr, idx) => {
                                        const dangChon = showroomDangXemTruoc === idx;
                                        return (
                                            <div
                                                key={sr.id || idx}
                                                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                                                    dangChon
                                                        ? 'bg-white dark:bg-slate-800 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                                                        : 'bg-white/90 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                                                }`}
                                            >
                                                {/* Header Card Chi Nhánh */}
                                                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-700/60">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                                                            {idx + 1}
                                                        </span>
                                                        <span className="font-black text-sm text-slate-900 dark:text-white">
                                                            {sr.ten || `Cửa hàng #${idx + 1}`}
                                                        </span>
                                                        {sr.la_mac_dinh && (
                                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                                                                Trụ sở chính
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowroomDangXemTruoc(idx)}
                                                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                                                dangChon
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                                                            }`}
                                                        >
                                                            {dangChon ? '✓ Đang xem trên Map' : 'Xem trên Map'}
                                                        </button>

                                                        {danhSachShowroomAdmin.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => xuLyXoaShowroom(idx)}
                                                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                                                                title="Xóa showroom này"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Form Fields Tinh Gọn */}
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                                            Tên Showroom / Chi Nhánh *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={sr.ten || ''}
                                                            onChange={(e) => xuLyThayDoiShowroom(idx, 'ten', e.target.value)}
                                                            placeholder="VD: Showroom Quận 10 (Trụ Sở Chính)"
                                                            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                                            Địa Chỉ Chi Tiết *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={sr.dia_chi || ''}
                                                            onChange={(e) => xuLyThayDoiShowroom(idx, 'dia_chi', e.target.value)}
                                                            placeholder="VD: Số 29 Tân Phước, Phường 8, Quận 10, TP. Hồ Chí Minh"
                                                            className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                                                Hotline Liên Hệ
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={sr.hotline || ''}
                                                                onChange={(e) => xuLyThayDoiShowroom(idx, 'hotline', e.target.value)}
                                                                placeholder="1900.8946 hoặc 0948.37.79.79"
                                                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                                                Giờ Mở Cửa
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={sr.gio_mo_cua || ''}
                                                                onChange={(e) => xuLyThayDoiShowroom(idx, 'gio_mo_cua', e.target.value)}
                                                                placeholder="08:30 - 21:30 (Mở cả tuần)"
                                                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Khu vực tọa độ GPS - Cực kỳ quan trọng & nổi bật */}
                                                    <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[11px] font-black text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                                                                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                                                                Tọa Độ GPS Google Maps (Định Vị Chính Xác)
                                                            </span>
                                                            <span className="text-[10px] text-slate-500">
                                                                Chuẩn số thực
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                                                                    Vĩ độ (Latitude) *
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="any"
                                                                    value={sr.vi_do ?? ''}
                                                                    onChange={(e) => xuLyThayDoiShowroom(idx, 'vi_do', e.target.value)}
                                                                    placeholder="VD: 10.760086"
                                                                    className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                                                                    Kinh độ (Longitude) *
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="any"
                                                                    value={sr.kinh_do ?? ''}
                                                                    onChange={(e) => xuLyThayDoiShowroom(idx, 'kinh_do', e.target.value)}
                                                                    placeholder="VD: 106.663185"
                                                                    className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                                                />
                                                            </div>
                                                        </div>
                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                                            💡 <i>Mẹo: Mở Google Maps, click chuột phải vào vị trí bất kỳ rồi bấm chọn dòng số đầu tiên để copy Vĩ độ, Kinh độ.</i>
                                                        </p>
                                                    </div>

                                                    {/* Đặt làm mặc định */}
                                                    <div className="pt-1 flex items-center justify-between text-xs">
                                                        <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300 font-semibold">
                                                            <input
                                                                type="radio"
                                                                name="sr_mac_dinh"
                                                                checked={!!sr.la_mac_dinh}
                                                                onChange={() => xuLyDatLamMacDinh(idx)}
                                                                className="w-4 h-4 text-blue-600"
                                                            />
                                                            <span>Đặt làm Showroom chính (Mặc định khi mở trang)</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div className="pt-2">
                                        <button
                                            type="button"
                                            onClick={xuLyLuuShowroom}
                                            disabled={dangLuuShowroom}
                                            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                                        >
                                            {dangLuuShowroom ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                            <span>{dangLuuShowroom ? 'Đang lưu hệ thống...' : 'Lưu Tất Cả Showroom & Tọa Độ'}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Cột Phải: Live Preview Bản Đồ (5 Cột, Sticky) */}
                                <div className="xl:col-span-5 sticky top-20 space-y-4">
                                    <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                                                <h3 className="font-black text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                                    Xem Trước Google Maps Trực Quan
                                                </h3>
                                            </div>
                                            {danhSachShowroomAdmin[showroomDangXemTruoc] && (
                                                <a
                                                    href={`https://www.google.com/maps?q=${danhSachShowroomAdmin[showroomDangXemTruoc].vi_do},${danhSachShowroomAdmin[showroomDangXemTruoc].kinh_do}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline"
                                                >
                                                    <span>Mở map ngoài</span>
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>

                                        {/* Chi tiết showroom đang preview */}
                                        {danhSachShowroomAdmin[showroomDangXemTruoc] ? (
                                            <div className="space-y-2">
                                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                                                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                                                        {danhSachShowroomAdmin[showroomDangXemTruoc].ten}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                                                        📍 {danhSachShowroomAdmin[showroomDangXemTruoc].dia_chi}
                                                    </div>
                                                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                                                        <span>Vĩ độ: <b>{danhSachShowroomAdmin[showroomDangXemTruoc].vi_do}</b></span>
                                                        <span>Kinh độ: <b>{danhSachShowroomAdmin[showroomDangXemTruoc].kinh_do}</b></span>
                                                    </div>
                                                </div>

                                                {/* Khung iframe bản đồ */}
                                                <div className="relative w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner bg-slate-100 dark:bg-slate-900">
                                                    <iframe
                                                        title="Google Maps Showroom Preview"
                                                        src={`https://maps.google.com/maps?q=${danhSachShowroomAdmin[showroomDangXemTruoc].vi_do || 10.760086},${danhSachShowroomAdmin[showroomDangXemTruoc].kinh_do || 106.663185}&hl=vi&z=16&output=embed`}
                                                        className="w-full h-full border-0"
                                                        loading="lazy"
                                                        allowFullScreen
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
                                                Chưa chọn showroom để xem trước
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* ========================================================================= */}
            {/* MODAL 1: CHỈNH SỬA / THÊM SẢN PHẨM ĐA NĂNG (RỘNG RÃI, 4 TABS THÔNG MINH) */}
            {/* ========================================================================= */}
            {dangMoModalSp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl w-full max-w-5xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
                        {/* Header Sang Trọng, Tinh Tế, Đồng Bộ Tone Với Thân Modal */}
                        <div className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 px-5 sm:px-6 py-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-center text-xl shrink-0 shadow-xs">
                                    {loaiFormSanPham === 'ban_phim' ? '⌨️' :
                                     loaiFormSanPham === 'chuot' ? '🖱️' :
                                     loaiFormSanPham === 'balo' ? '🎒' :
                                     loaiFormSanPham === 'tai_nghe' ? '🎧' :
                                     loaiFormSanPham === 'sac_hub' ? '⚡' :
                                     loaiFormSanPham === 'linh_kien' ? '💾' : '💻'}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                                            spDangSua
                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800'
                                                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800'
                                        }`}>
                                            {spDangSua ? 'Chỉnh Sửa' : 'Thêm Mới'}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-mono font-bold tracking-wide">
                                            SKU: {formSp.ma_san_pham || 'NEW-SKU'}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-bold">
                                            Hãng: {formSp.hang_san_xuat?.toUpperCase()}
                                        </span>
                                        {formSp.tuy_chon_phien_ban && formSp.tuy_chon_phien_ban.length > 0 && (
                                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 text-[11px] font-semibold">
                                                {formSp.tuy_chon_phien_ban.length} biến thể
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug truncate" title={formSp.ten_san_pham}>
                                        {formSp.ten_san_pham || (spDangSua ? 'Sản Phẩm Chưa Có Tên' : 'Nhập Tên Sản Phẩm Mới')}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setDangXemTruocCard(true)}
                                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                                    title="Xem trước sản phẩm hiển thị ngoài web"
                                >
                                    <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    <span className="hidden sm:inline">Xem Trước</span>
                                </button>
                                <button
                                    type="button"
                                    disabled={dangLuuSp}
                                    onClick={dongModalSpAnToan}
                                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer transition-colors shrink-0"
                                    title="Đóng cửa sổ"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Thanh 4 Tabs Chức Năng Rõ Ràng - Bố Cục Lưới Cân Đối & Phân Màu Đa Sắc Trực Quan */}
                        <div className="shrink-0 px-4 sm:px-6 py-2.5 bg-slate-50/80 dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 bg-slate-200/70 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                                {/* Tab 1: Xanh Dương (Thông Tin & Giá) */}
                                <button
                                    type="button"
                                    onClick={() => setTabModalSp('thong_tin')}
                                    className={`py-2 px-2.5 sm:px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                        tabModalSp === 'thong_tin'
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-600 font-extrabold'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/80 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <Tag className={`w-4 h-4 shrink-0 ${tabModalSp === 'thong_tin' ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                                    <span className="truncate">1. Thông Tin & Giá</span>
                                </button>

                                {/* Tab 2: Tím Indigo (Cấu Hình Chi Tiết) */}
                                <button
                                    type="button"
                                    onClick={() => setTabModalSp('thong_so')}
                                    className={`py-2 px-2.5 sm:px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                        tabModalSp === 'thong_so'
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 border border-indigo-600 font-extrabold'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/80 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <SlidersHorizontal className={`w-4 h-4 shrink-0 ${tabModalSp === 'thong_so' ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
                                    <span className="truncate">2. Cấu Hình Chi Tiết</span>
                                </button>

                                {/* Tab 3: Hồng Fuchsia (Biến Thể Màu) */}
                                <button
                                    type="button"
                                    onClick={() => setTabModalSp('bien_the')}
                                    className={`py-2 px-2.5 sm:px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                        tabModalSp === 'bien_the'
                                            ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/25 border border-fuchsia-600 font-extrabold'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 hover:bg-white/80 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <Palette className={`w-4 h-4 shrink-0 ${tabModalSp === 'bien_the' ? 'text-white' : 'text-fuchsia-600 dark:text-fuchsia-400'}`} />
                                    <span className="truncate">3. Biến Thể Màu</span>
                                    {formSp.tuy_chon_phien_ban && formSp.tuy_chon_phien_ban.length > 0 && (
                                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                                            tabModalSp === 'bien_the'
                                                ? 'bg-white/30 text-white'
                                                : 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300'
                                        }`}>
                                            {formSp.tuy_chon_phien_ban.length}
                                        </span>
                                    )}
                                </button>

                                {/* Tab 4: Vàng Hổ Phách (Ảnh & Quà Tặng) */}
                                <button
                                    type="button"
                                    onClick={() => setTabModalSp('hinh_anh')}
                                    className={`py-2 px-2.5 sm:px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                        tabModalSp === 'hinh_anh'
                                            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 border border-amber-500 font-extrabold'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white/80 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <Sparkles className={`w-4 h-4 shrink-0 ${tabModalSp === 'hinh_anh' ? 'text-white' : 'text-amber-500 dark:text-amber-400'}`} />
                                    <span className="truncate">4. Ảnh & Quà Tặng</span>
                                </button>
                            </div>
                        </div>

                        {/* Form Body Cuộn Độc Lập - Nền Slate-100 Đậm Hơn Giúp Tôn Card Trắng & Đệm Đáy Thoải Mái */}
                        <form onSubmit={xuLyLuuSanPham} className="flex flex-col flex-1 min-h-0">
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs bg-slate-100/70 dark:bg-slate-950/80 pb-28">
                                
                                {/* TAB 1: THÔNG TIN CƠ BẢN & GIÁ BÁN */}
                                {tabModalSp === 'thong_tin' && (
                                    <div className="space-y-5 animate-in fade-in duration-150">
                                        {/* KHỐI 1: ĐỊNH DANH & PHÂN LOẠI (Theme: Xanh Dương / Royal Blue) */}
                                        <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-900/60 shadow-xs overflow-hidden">
                                            {/* Header Khối 1 có dải gradient xanh sang trọng */}
                                            <div className="p-3.5 sm:p-4 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border-b border-blue-100 dark:border-blue-900/50 flex items-center justify-between">
                                                <div className="font-black text-xs uppercase tracking-wider text-blue-950 dark:text-blue-200 flex items-center gap-2.5">
                                                    <span className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                                                        <Tag className="w-4 h-4" />
                                                    </span>
                                                    <span>1. Định Danh & Phân Loại Sản Phẩm</span>
                                                </div>
                                                <span className="text-[10px] font-black text-blue-700 bg-blue-100 dark:bg-blue-950 dark:text-blue-300 px-3 py-1 rounded-full border border-blue-300 dark:border-blue-800 uppercase tracking-wider">
                                                    Bắt buộc
                                                </span>
                                            </div>

                                            <div className="p-4 sm:p-5 space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                                    {/* Mã SKU */}
                                                    <div className="space-y-1.5">
                                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                            <Barcode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                            <span>Mã SKU / Định Danh *</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={formSp.ma_san_pham}
                                                            onChange={(e) => setFormSp({ ...formSp, ma_san_pham: e.target.value })}
                                                            placeholder="VD: G834JYR-R9054W..."
                                                            className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 dark:border-slate-700 bg-blue-50/25 dark:bg-slate-800/70 text-slate-900 dark:text-white font-mono font-bold text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                                                        />
                                                    </div>

                                                    {/* Hãng Sản Xuất */}
                                                    <div className="space-y-1.5">
                                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                            <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                            <span>Hãng Sản Xuất *</span>
                                                        </label>
                                                        <select
                                                            value={formSp.hang_san_xuat}
                                                            onChange={(e) => setFormSp({ ...formSp, hang_san_xuat: e.target.value })}
                                                            className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 dark:border-slate-700 bg-blue-50/25 dark:bg-slate-800/70 text-slate-900 dark:text-white font-bold capitalize text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all cursor-pointer"
                                                        >
                                                            {danhSachHangThucTe.map(h => (
                                                                <option key={h.ma} value={h.ma}>{h.ten}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* Nhóm Ngành Hàng */}
                                                    <div className="space-y-1.5">
                                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                            <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                            <span>Nhóm Ngành Hàng *</span>
                                                        </label>
                                                        <select
                                                            value={loaiFormSanPham}
                                                            onChange={(e) => setLoaiFormSanPham(e.target.value)}
                                                            className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 dark:border-slate-700 bg-blue-50/25 dark:bg-slate-800/70 text-slate-900 dark:text-white font-bold text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all cursor-pointer"
                                                        >
                                                            <option value="laptop">💻 Laptop Gaming & Văn Phòng</option>
                                                            <option value="ban_phim">⌨️ Bàn Phím Cơ Custom</option>
                                                            <option value="chuot">🖱️ Chuột Gaming Siêu Nhẹ</option>
                                                            <option value="balo">🎒 Balo & Túi Chống Sốc</option>
                                                            <option value="tai_nghe">🎧 Tai Nghe & Loa Âm Thanh</option>
                                                            <option value="sac_hub">⚡ Củ Sạc GaN & Hub Đa Năng</option>
                                                            <option value="linh_kien">💾 Linh Kiện RAM / SSD</option>
                                                        </select>
                                                    </div>

                                                    {/* Tên Đầy Đủ Của Sản Phẩm */}
                                                    <div className="sm:col-span-3 space-y-1.5">
                                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between text-xs">
                                                            <span className="flex items-center gap-1.5">
                                                                <Laptop className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                                <span>Tên Đầy Đủ Của Sản Phẩm *</span>
                                                            </span>
                                                            <NhanDaSua fieldName="ten_san_pham" />
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={formSp.ten_san_pham}
                                                            onChange={(e) => setFormSp({ ...formSp, ten_san_pham: e.target.value })}
                                                            placeholder="Nhập tên sản phẩm đầy đủ và chi tiết..."
                                                            className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 dark:border-slate-700 bg-blue-50/15 dark:bg-slate-800/70 text-slate-900 dark:text-white font-bold text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* KHỐI 2: THIẾT LẬP GIÁ BÁN & TỒN KHO THỰC TẾ (Theme: Tài Chính - Emerald & Rose & Slate) */}
                                        <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-emerald-900/60 shadow-xs overflow-hidden">
                                            {/* Header Khối 2 có dải gradient Emerald */}
                                            <div className="p-3.5 sm:p-4 bg-gradient-to-r from-emerald-500/10 via-rose-500/5 to-transparent border-b border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between">
                                                <div className="font-black text-xs uppercase tracking-wider text-emerald-950 dark:text-emerald-200 flex items-center gap-2.5">
                                                    <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                                                        <DollarSign className="w-4 h-4" />
                                                    </span>
                                                    <span>2. Thiết Lập Giá Bán & Tồn Kho Thực Tế</span>
                                                </div>
                                                <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 uppercase tracking-wider">
                                                    Tiền tệ: VNĐ
                                                </span>
                                            </div>

                                            <div className="p-4 sm:p-5">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    {/* CỘT 1: GIÁ NIÊM YẾT GỐC (Theme Slate Cool) */}
                                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                                                        <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between text-xs">
                                                            <span className="flex items-center gap-1.5">
                                                                <CircleDollarSign className="w-3.5 h-3.5 text-slate-500" />
                                                                <span>Giá Niêm Yết Gốc</span>
                                                            </span>
                                                            <NhanDaSua fieldName="gia_goc" />
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={formSp.gia_goc}
                                                            onChange={(e) => setFormSp({ ...formSp, gia_goc: e.target.value })}
                                                            placeholder="VD: 125000000"
                                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-slate-400 focus:outline-none"
                                                        />
                                                        <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold text-[11px] border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-2xs">
                                                            <span>Hiển thị:</span>
                                                            <span className="font-black text-slate-900 dark:text-white">{dinhDangTienVND(formSp.gia_goc)}</span>
                                                        </div>
                                                    </div>

                                                    {/* CỘT 2: GIÁ KHUYẾN MÃI THỰC THU (Theme Rose Sôi Động) */}
                                                    <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border-2 border-rose-300 dark:border-rose-800 space-y-2.5">
                                                        <label className="font-bold text-rose-800 dark:text-rose-300 flex items-center justify-between text-xs">
                                                            <span className="flex items-center gap-1.5">
                                                                <Flame className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                                                <span>Giá Khuyến Mãi (Thực Thu) *</span>
                                                            </span>
                                                            <NhanDaSua fieldName="gia_khuyen_mai" />
                                                        </label>
                                                        <input
                                                            type="number"
                                                            required
                                                            value={formSp.gia_khuyen_mai}
                                                            onChange={(e) => setFormSp({ ...formSp, gia_khuyen_mai: e.target.value })}
                                                            placeholder="VD: 109990000"
                                                            className="w-full px-3.5 py-2.5 rounded-xl border-2 border-rose-400 dark:border-rose-700 bg-white dark:bg-slate-900 font-black text-rose-600 dark:text-rose-400 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                                                        />
                                                        <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-300 font-bold text-[11px] border border-rose-200 dark:border-rose-800 flex items-center justify-between shadow-2xs">
                                                            <span className="flex items-center gap-1">
                                                                <span>Thực thu:</span>
                                                                <b className="text-rose-600 dark:text-rose-400 font-black">{dinhDangTienVND(formSp.gia_khuyen_mai)}</b>
                                                            </span>
                                                            {Number(formSp.gia_goc) > Number(formSp.gia_khuyen_mai) && (
                                                                <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-black text-[10.5px] shadow-xs">
                                                                    -{Math.round(((Number(formSp.gia_goc) - Number(formSp.gia_khuyen_mai)) / Number(formSp.gia_goc)) * 100)}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* CỘT 3: TỒN KHO THỰC TẾ (Theme Emerald) */}
                                                    <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border-2 border-emerald-300 dark:border-emerald-800 space-y-2.5">
                                                        <label className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-xs">
                                                            <span className="flex items-center gap-1.5">
                                                                <Boxes className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                                                <span>Số Lượng Tồn Kho</span>
                                                            </span>
                                                            <NhanDaSua fieldName="so_luong_ton_kho" />
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={formSp.so_luong_ton_kho}
                                                            onChange={(e) => setFormSp({ ...formSp, so_luong_ton_kho: e.target.value })}
                                                            placeholder="VD: 7"
                                                            className="w-full px-3.5 py-2.5 rounded-xl border-2 border-emerald-400 dark:border-emerald-700 bg-white dark:bg-slate-900 font-black text-emerald-700 dark:text-emerald-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                                        />
                                                        <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] border border-emerald-200 dark:border-emerald-800 flex items-center justify-between shadow-2xs">
                                                            <span className="flex items-center gap-1.5">
                                                                <span className={`w-2 h-2 rounded-full ${Number(formSp.so_luong_ton_kho) > 5 ? 'bg-emerald-500' : Number(formSp.so_luong_ton_kho) > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                                                                <span>{Number(formSp.so_luong_ton_kho) > 5 ? 'Sẵn sàng giao' : Number(formSp.so_luong_ton_kho) > 0 ? 'Sắp hết hàng' : 'Hết hàng'}</span>
                                                            </span>
                                                            <span className="font-black text-emerald-700 dark:text-emerald-300">{formSp.so_luong_ton_kho || 0} máy</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* KHỐI 3: BẢO HÀNH & TRẠNG THÁI HIỂN THỊ (Theme: Indigo & Amber) */}
                                        <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-xs overflow-hidden">
                                            {/* Header Khối 3 có dải gradient Indigo */}
                                            <div className="p-3.5 sm:p-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border-b border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
                                                <div className="font-black text-xs uppercase tracking-wider text-indigo-950 dark:text-indigo-200 flex items-center gap-2.5">
                                                    <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                                                        <ShieldCheck className="w-4 h-4" />
                                                    </span>
                                                    <span>3. Bảo Hành & Trạng Thái Kinh Doanh</span>
                                                </div>
                                                <NhanDaSua fieldName="che_do_bao_hanh" />
                                            </div>

                                            <div className="p-4 sm:p-5">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                                                    {/* Chính Sách Bảo Hành */}
                                                    <div className="space-y-1.5">
                                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                            <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                                            <span>Chính Sách Bảo Hành Chính Hãng</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Ví dụ: 24 tháng chính hãng tại TNTP Laptop..."
                                                            value={formSp.che_do_bao_hanh}
                                                            onChange={(e) => setFormSp({ ...formSp, che_do_bao_hanh: e.target.value })}
                                                            className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 dark:border-slate-700 bg-indigo-50/20 dark:bg-slate-800/70 text-slate-900 dark:text-white font-medium text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                                                        />
                                                    </div>

                                                    {/* 3 Nút Huy Hiệu Trực Quan Ngoài Website */}
                                                    <div className="space-y-1.5">
                                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                                            <span>Huy Hiệu Trực Quan Ngoài Website</span>
                                                        </label>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            {/* Flash Sale Toggle */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormSp({ ...formSp, la_flash_sale: !formSp.la_flash_sale })}
                                                                className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
                                                                    formSp.la_flash_sale
                                                                        ? 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/30'
                                                                        : 'bg-rose-50 dark:bg-slate-800 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/50 hover:bg-rose-100'
                                                                }`}
                                                            >
                                                                <Flame className="w-3.5 h-3.5 fill-current text-inherit" />
                                                                <span>⚡ Flash Sale</span>
                                                            </button>

                                                            {/* Bán Chạy Toggle */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormSp({ ...formSp, la_ban_chay: !formSp.la_ban_chay })}
                                                                className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
                                                                    formSp.la_ban_chay
                                                                        ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/30'
                                                                        : 'bg-amber-50 dark:bg-slate-800 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50 hover:bg-amber-100'
                                                                }`}
                                                            >
                                                                <Sparkles className="w-3.5 h-3.5 fill-current text-inherit" />
                                                                <span>🔥 Bán Chạy</span>
                                                            </button>

                                                            {/* Đang Mở Bán Toggle */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormSp({ ...formSp, con_hang: !formSp.con_hang })}
                                                                className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
                                                                    formSp.con_hang
                                                                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-500/30'
                                                                        : 'bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-100'
                                                                }`}
                                                            >
                                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                                <span>✅ Đang Mở Bán</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 2: CẤU HÌNH & THÔNG SỐ KỸ THUẬT (CHUYÊN BIỆT CHO MẶT HÀNG ĐANG CHỌN) */}
                                {tabModalSp === 'thong_so' && (
                                    <div className="space-y-4 animate-in fade-in duration-150">
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-400 dark:border-indigo-600 shadow-md shadow-indigo-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm shadow-xs shrink-0">
                                                    <SlidersHorizontal className="w-4 h-4" />
                                                </span>
                                                <div>
                                                    <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs block">
                                                        2. Thông Số Kỹ Thuật {loaiFormSanPham === 'laptop' ? 'Laptop Gaming & Văn Phòng' : loaiFormSanPham === 'ban_phim' ? 'Bàn Phím Cơ Custom' : loaiFormSanPham === 'chuot' ? 'Chuột Gaming Siêu Nhẹ' : loaiFormSanPham === 'balo' ? 'Balo & Túi Chống Sốc' : loaiFormSanPham === 'tai_nghe' ? 'Tai Nghe & Loa' : loaiFormSanPham === 'sac_hub' ? 'Củ Sạc GaN & Hub' : 'Linh Kiện RAM / SSD'}
                                                    </span>
                                                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                                        Cấu hình kỹ thuật chuyên biệt cho nhóm hàng này
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Selector chuyển nhanh loại thông số nếu cần */}
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-slate-500 font-bold hidden sm:inline">Đổi mẫu:</span>
                                                <select
                                                    value={loaiFormSanPham}
                                                    onChange={(e) => setLoaiFormSanPham(e.target.value)}
                                                    className="px-3 py-2 rounded-xl bg-indigo-50 dark:bg-slate-800 border-2 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 text-xs font-black focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                >
                                                    <option value="laptop">💻 Laptop</option>
                                                    <option value="ban_phim">⌨️ Bàn Phím Cơ</option>
                                                    <option value="chuot">🖱️ Chuột Gaming</option>
                                                    <option value="balo">🎒 Balo & Túi</option>
                                                    <option value="tai_nghe">🎧 Tai Nghe / Loa</option>
                                                    <option value="sac_hub">⚡ Củ Sạc / Hub</option>
                                                    <option value="linh_kien">💾 Linh Kiện</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* 1. CẤU HÌNH KỸ THUẬT LAPTOP */}
                                        {loaiFormSanPham === 'laptop' && (
                                            <div className="space-y-4">
                                                {/* Nhóm 1: Vi Xử Lý & Hiệu Năng (CPU) */}
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-400 dark:border-blue-600 shadow-md shadow-blue-500/5 space-y-3.5">
                                                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center gap-2 font-black text-xs uppercase tracking-wider text-blue-900 dark:text-blue-300">
                                                        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <Cpu className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>1. Bộ Xử Lý & Hiệu Năng (CPU)</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Nghệ CPU (Tên Vi Xử Lý Chi Tiết)</span>
                                                                <NhanDaSua fieldName="cpu" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Intel® Core™ i9-14900HX (24 nhân 32 luồng, Turbo 5.8GHz, 36MB Cache)..."
                                                                value={formSp.cpu}
                                                                onChange={(e) => setFormSp({ ...formSp, cpu: e.target.value })}
                                                                className={layClassInput('cpu')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Số Nhân & Số Luồng</span>
                                                                <NhanDaSua fieldName="so_nhan_luong" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="24 Nhân (8 P-Core + 16 E-Core), 32 Luồng..."
                                                                value={formSp.so_nhan_luong}
                                                                onChange={(e) => setFormSp({ ...formSp, so_nhan_luong: e.target.value })}
                                                                className={layClassInput('so_nhan_luong')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tốc Độ Xung Nhịp Tối Đa</span>
                                                                <NhanDaSua fieldName="xung_nhip_toi_da" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="5.8 GHz Turbo Boost..."
                                                                value={formSp.xung_nhip_toi_da}
                                                                onChange={(e) => setFormSp({ ...formSp, xung_nhip_toi_da: e.target.value })}
                                                                className={layClassInput('xung_nhip_toi_da')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Bộ Nhớ Đệm (Cache)</span>
                                                                <NhanDaSua fieldName="bo_nho_dem_cache" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="36MB Intel Smart Cache..."
                                                                value={formSp.bo_nho_dem_cache}
                                                                onChange={(e) => setFormSp({ ...formSp, bo_nho_dem_cache: e.target.value })}
                                                                className={layClassInput('bo_nho_dem_cache')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chip AI NPU & Hiệu Năng TOPS</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="chip_ai_npu" />
                                                                    <NhanDaSua fieldName="hieu_nang_ai_tops" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Intel AI Boost NPU..."
                                                                    value={formSp.chip_ai_npu}
                                                                    onChange={(e) => setFormSp({ ...formSp, chip_ai_npu: e.target.value })}
                                                                    className={layClassInput('chip_ai_npu')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="45 TOPS..."
                                                                    value={formSp.hieu_nang_ai_tops}
                                                                    onChange={(e) => setFormSp({ ...formSp, hieu_nang_ai_tops: e.target.value })}
                                                                    className={layClassInput('hieu_nang_ai_tops')}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Nhóm 2: Đồ Họa & Xử Lý Hình Ảnh (GPU) */}
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-purple-400 dark:border-purple-600 shadow-md shadow-purple-500/5 space-y-3.5">
                                                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center gap-2 font-black text-xs uppercase tracking-wider text-purple-900 dark:text-purple-300">
                                                        <span className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <Zap className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>2. Đồ Họa & Xử Lý Hình Ảnh (GPU)</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Card Đồ Họa (GPU)</span>
                                                                <NhanDaSua fieldName="card_do_hoa" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="NVIDIA® GeForce RTX™ 4090 Laptop GPU 16GB GDDR6 (175W TGP)..."
                                                                value={formSp.card_do_hoa}
                                                                onChange={(e) => setFormSp({ ...formSp, card_do_hoa: e.target.value })}
                                                                className={layClassInput('card_do_hoa')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Bộ Nhớ Đồ Họa (VRAM)</span>
                                                                <NhanDaSua fieldName="dung_luong_vram" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="16GB GDDR6 / 8GB GDDR6..."
                                                                value={formSp.dung_luong_vram}
                                                                onChange={(e) => setFormSp({ ...formSp, dung_luong_vram: e.target.value })}
                                                                className={layClassInput('dung_luong_vram')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Suất TGP Tối Đa (W) & Ray Tracing</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="cong_suat_tgp" />
                                                                    <NhanDaSua fieldName="ho_tro_ray_tracing" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="175 (Watt)..."
                                                                    value={formSp.cong_suat_tgp}
                                                                    onChange={(e) => setFormSp({ ...formSp, cong_suat_tgp: e.target.value })}
                                                                    className={layClassInput('cong_suat_tgp')}
                                                                />
                                                                <select
                                                                    value={formSp.ho_tro_ray_tracing ? 'true' : 'false'}
                                                                    onChange={(e) => setFormSp({ ...formSp, ho_tro_ray_tracing: e.target.value === 'true' })}
                                                                    className={layClassInput('ho_tro_ray_tracing')}
                                                                >
                                                                    <option value="true">✅ Có Ray Tracing & DLSS</option>
                                                                    <option value="false">❌ Không hỗ trợ</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Nhóm 3: Bộ Nhớ RAM & Ổ Cứng Lưu Trữ */}
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 shadow-md shadow-emerald-500/5 space-y-3.5">
                                                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 font-black text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                                                        <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <HardDrive className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>3. Bộ Nhớ RAM & Ổ Cứng Lưu Trữ (SSD)</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Dung Lượng RAM</span>
                                                                <NhanDaSua fieldName="ram" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="64GB DDR5-5600MHz (2x32GB)..."
                                                                value={formSp.ram}
                                                                onChange={(e) => setFormSp({ ...formSp, ram: e.target.value })}
                                                                className={layClassInput('ram')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Loại RAM & Tốc Độ Bus</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="loai_ram" />
                                                                    <NhanDaSua fieldName="toc_do_bus" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="DDR5..."
                                                                    value={formSp.loai_ram}
                                                                    onChange={(e) => setFormSp({ ...formSp, loai_ram: e.target.value })}
                                                                    className={layClassInput('loai_ram')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="5600 (MHz)..."
                                                                    value={formSp.toc_do_bus}
                                                                    onChange={(e) => setFormSp({ ...formSp, toc_do_bus: e.target.value })}
                                                                    className={layClassInput('toc_do_bus')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Khả Năng Nâng Cấp RAM</span>
                                                                <NhanDaSua fieldName="nang_cap_ram_toi_da" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Lên tới 64GB (2 khe SODIMM)..."
                                                                value={formSp.nang_cap_ram_toi_da}
                                                                onChange={(e) => setFormSp({ ...formSp, nang_cap_ram_toi_da: e.target.value })}
                                                                className={layClassInput('nang_cap_ram_toi_da')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Dung Lượng Ổ Cứng SSD</span>
                                                                <NhanDaSua fieldName="o_cung" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="2TB PCIe® 4.0 NVMe™ M.2 SSD (Raid 0)..."
                                                                value={formSp.o_cung}
                                                                onChange={(e) => setFormSp({ ...formSp, o_cung: e.target.value })}
                                                                className={layClassInput('o_cung')}
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Khe Cắm Mở Rộng SSD/M.2</span>
                                                                <NhanDaSua fieldName="khe_cam_mo_rong" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="2 khe M.2 PCIe Gen 4 (Đã cắm 1, còn trống 1 khe)..."
                                                                value={formSp.khe_cam_mo_rong}
                                                                onChange={(e) => setFormSp({ ...formSp, khe_cam_mo_rong: e.target.value })}
                                                                className={layClassInput('khe_cam_mo_rong')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Nhóm 4: Màn Hình & Công Nghệ Hiển Thị */}
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-sky-400 dark:border-sky-600 shadow-md shadow-sky-500/5 space-y-3.5">
                                                    <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center gap-2 font-black text-xs uppercase tracking-wider text-sky-900 dark:text-sky-300">
                                                        <span className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <Monitor className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>4. Màn Hình & Công Nghệ Hiển Thị</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Kích Thước & Tên Màn Hình</span>
                                                                <NhanDaSua fieldName="man_hinh" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="18.0 inch QHD+ (2560 x 1600) ROG Nebula HDR Mini-LED 240Hz 3ms..."
                                                                value={formSp.man_hinh}
                                                                onChange={(e) => setFormSp({ ...formSp, man_hinh: e.target.value })}
                                                                className={layClassInput('man_hinh')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Độ Phân Giải Chuẩn</span>
                                                                <NhanDaSua fieldName="do_phan_giai" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="2.5K QHD+ (2560 x 1600), tỷ lệ 16:10..."
                                                                value={formSp.do_phan_giai}
                                                                onChange={(e) => setFormSp({ ...formSp, do_phan_giai: e.target.value })}
                                                                className={layClassInput('do_phan_giai')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tần Số Quét (Hz) & Độ Sáng (nits)</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="tan_so_quet" />
                                                                    <NhanDaSua fieldName="do_sang_nits" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="240 (Hz)..."
                                                                    value={formSp.tan_so_quet}
                                                                    onChange={(e) => setFormSp({ ...formSp, tan_so_quet: e.target.value })}
                                                                    className={layClassInput('tan_so_quet')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="1100 (nits)..."
                                                                    value={formSp.do_sang_nits}
                                                                    onChange={(e) => setFormSp({ ...formSp, do_sang_nits: e.target.value })}
                                                                    className={layClassInput('do_sang_nits')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Nghệ Tấm Nền</span>
                                                                <NhanDaSua fieldName="tam_nen" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Mini-LED, ROG Nebula HDR Display, IPS-level..."
                                                                value={formSp.tam_nen}
                                                                onChange={(e) => setFormSp({ ...formSp, tam_nen: e.target.value })}
                                                                className={layClassInput('tam_nen')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Độ Phủ Gam Màu</span>
                                                                <NhanDaSua fieldName="do_phu_mau" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="100% DCI-P3, Chuẩn màu Pantone Validated..."
                                                                value={formSp.do_phu_mau}
                                                                onChange={(e) => setFormSp({ ...formSp, do_phu_mau: e.target.value })}
                                                                className={layClassInput('do_phu_mau')}
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Nghệ Màn Hình Hỗ Trợ (phân tách bởi dấu phẩy)</span>
                                                                <NhanDaSua fieldName="cong_nghe_man_hinh" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="G-Sync, Dolby Vision HDR, Chống chói Anti-Glare..."
                                                                value={formSp.cong_nghe_man_hinh}
                                                                onChange={(e) => setFormSp({ ...formSp, cong_nghe_man_hinh: e.target.value })}
                                                                className={layClassInput('cong_nghe_man_hinh')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Nhóm 5: Kích Thước, Pin & Tản Nhiệt */}
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-600 shadow-md shadow-amber-500/5 space-y-3.5">
                                                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center gap-2 font-black text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300">
                                                        <span className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <BatteryCharging className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>5. Kích Thước, Pin & Hệ Thống Tản Nhiệt</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Dung Lượng Pin</span>
                                                                <NhanDaSua fieldName="pin" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="90WHrs, 4-cell Li-ion..."
                                                                value={formSp.pin}
                                                                onChange={(e) => setFormSp({ ...formSp, pin: e.target.value })}
                                                                className={layClassInput('pin')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Thời Lượng Pin Ước Tính</span>
                                                                <NhanDaSua fieldName="thoi_luong_su_dung_uoc_tinh" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Khoảng 6 - 8 tiếng sử dụng cơ bản..."
                                                                value={formSp.thoi_luong_su_dung_uoc_tinh}
                                                                onChange={(e) => setFormSp({ ...formSp, thoi_luong_su_dung_uoc_tinh: e.target.value })}
                                                                className={layClassInput('thoi_luong_su_dung_uoc_tinh')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Suất Bộ Sạc Đi Kèm</span>
                                                                <NhanDaSua fieldName="cong_suat_sac" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="330W AC Adapter, sạc nhanh Type-C PD 100W..."
                                                                value={formSp.cong_suat_sac}
                                                                onChange={(e) => setFormSp({ ...formSp, cong_suat_sac: e.target.value })}
                                                                className={layClassInput('cong_suat_sac')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Khối Lượng Thiết Bị (kg)</span>
                                                                <NhanDaSua fieldName="trong_luong" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="3.1 kg..."
                                                                value={formSp.trong_luong}
                                                                onChange={(e) => setFormSp({ ...formSp, trong_luong: e.target.value })}
                                                                className={layClassInput('trong_luong')}
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Hệ Thống Tản Nhiệt</span>
                                                                <NhanDaSua fieldName="he_thong_tan_nhiet" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Hệ thống ROG Intelligent Cooling, buồng hơi Vapor Chamber, kim loại lỏng Conductonaut Extreme..."
                                                                value={formSp.he_thong_tan_nhiet}
                                                                onChange={(e) => setFormSp({ ...formSp, he_thong_tan_nhiet: e.target.value })}
                                                                className={layClassInput('he_thong_tan_nhiet')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Kích Thước (Dài x Rộng x Dày)</span>
                                                                <NhanDaSua fieldName="kich_thuoc" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="39.9 x 29.4 x 2.31 ~ 3.08 cm..."
                                                                value={formSp.kich_thuoc}
                                                                onChange={(e) => setFormSp({ ...formSp, kich_thuoc: e.target.value })}
                                                                className={layClassInput('kich_thuoc')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chất Liệu Thân Vỏ Máy</span>
                                                                <NhanDaSua fieldName="chat_lieu_vo" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Hợp kim Nhôm - Magie cao cấp phay xước viền LED Aura Sync..."
                                                                value={formSp.chat_lieu_vo}
                                                                onChange={(e) => setFormSp({ ...formSp, chat_lieu_vo: e.target.value })}
                                                                className={layClassInput('chat_lieu_vo')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Nhóm 6: Cổng Kết Nối & Hệ Điều Hành */}
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-400 dark:border-indigo-600 shadow-md shadow-indigo-500/5 space-y-3.5">
                                                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center gap-2 font-black text-xs uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                                                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <Radio className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>6. Cổng Kết Nối, Hệ Điều Hành & Khác</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Cổng Kết Nối Ngoại Vi (phân tách bởi dấu phẩy)</span>
                                                                <NhanDaSua fieldName="cong_ket_noi" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="1x Thunderbolt 4, 1x USB 3.2 Gen 2 Type-C, 2x USB 3.2 Gen 2 Type-A, 1x HDMI 2.1, 1x LAN 2.5G, 1x Jack 3.5mm..."
                                                                value={formSp.cong_ket_noi}
                                                                onChange={(e) => setFormSp({ ...formSp, cong_ket_noi: e.target.value })}
                                                                className={layClassInput('cong_ket_noi')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chuẩn Wi-Fi & Bluetooth</span>
                                                                <NhanDaSua fieldName="chuan_wifi_bluetooth" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Wi-Fi 7 (802.11be) 3 băng tần + Bluetooth 5.4..."
                                                                value={formSp.chuan_wifi_bluetooth}
                                                                onChange={(e) => setFormSp({ ...formSp, chuan_wifi_bluetooth: e.target.value })}
                                                                className={layClassInput('chuan_wifi_bluetooth')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Bàn Phím & Đèn Nền</span>
                                                                <NhanDaSua fieldName="ban_phim" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Bàn phím Chiclet Per-Key RGB Aura Sync, hành trình 2.0mm..."
                                                                value={formSp.ban_phim}
                                                                onChange={(e) => setFormSp({ ...formSp, ban_phim: e.target.value })}
                                                                className={layClassInput('ban_phim')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Nghệ Âm Thanh</span>
                                                                <NhanDaSua fieldName="am_thanh" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Hệ thống 4 loa công nghệ Dolby Atmos, Smart Amp, Khử ồn AI..."
                                                                value={formSp.am_thanh}
                                                                onChange={(e) => setFormSp({ ...formSp, am_thanh: e.target.value })}
                                                                className={layClassInput('am_thanh')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Hệ Điều Hành Tích Hợp</span>
                                                                <NhanDaSua fieldName="he_dieu_hanh" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Windows 11 Home bản quyền vĩnh viễn..."
                                                                value={formSp.he_dieu_hanh}
                                                                onChange={(e) => setFormSp({ ...formSp, he_dieu_hanh: e.target.value })}
                                                                className={layClassInput('he_dieu_hanh')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 2. BÀN PHÍM CƠ */}
                                        {loaiFormSanPham === 'ban_phim' && (
                                            <div className="space-y-4">
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-400 dark:border-indigo-600 shadow-md shadow-indigo-500/5 space-y-3.5">
                                                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center gap-2 font-black text-xs uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                                                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <Keyboard className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Switch & Cảm Giác Gõ Phím</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Loại Switch Cơ Học</span>
                                                                <NhanDaSua fieldName="loai_switch" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Gateron Jupiter Brown HIFI..."
                                                                value={formSp.loai_switch}
                                                                onChange={(e) => setFormSp({ ...formSp, loai_switch: e.target.value })}
                                                                className={layClassInput('loai_switch')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tính Năng Đặc Biệt & Hot-Swap</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="tinh_nang_dac_biet" />
                                                                    <NhanDaSua fieldName="hot_swap" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Tính năng nổi bật..."
                                                                    value={formSp.tinh_nang_dac_biet}
                                                                    onChange={(e) => setFormSp({ ...formSp, tinh_nang_dac_biet: e.target.value })}
                                                                    className={layClassInput('tinh_nang_dac_biet')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Hot-swap 5-pin..."
                                                                    value={formSp.hot_swap}
                                                                    onChange={(e) => setFormSp({ ...formSp, hot_swap: e.target.value })}
                                                                    className={layClassInput('hot_swap')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Cấu Trúc Giảm Chấn (Mount)</span>
                                                                <NhanDaSua fieldName="cau_truc_mount" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Gasket Mount kèm lót Foam Poron tiêu âm..."
                                                                value={formSp.cau_truc_mount}
                                                                onChange={(e) => setFormSp({ ...formSp, cau_truc_mount: e.target.value })}
                                                                className={layClassInput('cau_truc_mount')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-purple-400 dark:border-purple-600 shadow-md shadow-purple-500/5 space-y-3.5">
                                                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center gap-2 font-black text-xs uppercase tracking-wider text-purple-900 dark:text-purple-300">
                                                        <span className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <Layers className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Layout, Keycap & Khung Vỏ</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Layout Bàn Phím</span>
                                                                <NhanDaSua fieldName="layout_ban_phim" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="75% Gasket Mount (82 Phím)..."
                                                                value={formSp.layout_ban_phim}
                                                                onChange={(e) => setFormSp({ ...formSp, layout_ban_phim: e.target.value })}
                                                                className={layClassInput('layout_ban_phim')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chất Liệu Keycap</span>
                                                                <NhanDaSua fieldName="keycap_chat_lieu" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="PBT Double-shot OSA Profile..."
                                                                value={formSp.keycap_chat_lieu}
                                                                onChange={(e) => setFormSp({ ...formSp, keycap_chat_lieu: e.target.value })}
                                                                className={layClassInput('keycap_chat_lieu')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chất Liệu Thân Vỏ (Case)</span>
                                                                <NhanDaSua fieldName="chat_lieu_case" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Nhôm CNC Anodized nguyên khối..."
                                                                value={formSp.chat_lieu_case}
                                                                onChange={(e) => setFormSp({ ...formSp, chat_lieu_case: e.target.value })}
                                                                className={layClassInput('chat_lieu_case')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Khối Lượng Thiết Bị</span>
                                                                <NhanDaSua fieldName="trong_luong_gear" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="1.2 kg..."
                                                                value={formSp.trong_luong_gear}
                                                                onChange={(e) => setFormSp({ ...formSp, trong_luong_gear: e.target.value })}
                                                                className={layClassInput('trong_luong_gear')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 shadow-md shadow-emerald-500/5 space-y-3.5">
                                                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 font-black text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                                                        <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <Wifi className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Kết Nối, Đèn LED & Pin</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Phương Thức Kết Nối</span>
                                                                <NhanDaSua fieldName="kieu_ket_noi_gear" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Type-C, Wireless 2.4GHz, Bluetooth 5.1..."
                                                                value={formSp.kieu_ket_noi_gear}
                                                                onChange={(e) => setFormSp({ ...formSp, kieu_ket_noi_gear: e.target.value })}
                                                                className={layClassInput('kieu_ket_noi_gear')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Hệ Thống Đèn LED</span>
                                                                <NhanDaSua fieldName="led_rgb_gear" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="RGB South-facing 16.8 triệu màu..."
                                                                value={formSp.led_rgb_gear}
                                                                onChange={(e) => setFormSp({ ...formSp, led_rgb_gear: e.target.value })}
                                                                className={layClassInput('led_rgb_gear')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Dung Lượng Pin (mAh) / Nguồn</span>
                                                                <NhanDaSua fieldName="dung_luong_pin_gear" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="4000 mAh (Lên tới 300 giờ)..."
                                                                value={formSp.dung_luong_pin_gear}
                                                                onChange={(e) => setFormSp({ ...formSp, dung_luong_pin_gear: e.target.value })}
                                                                className={layClassInput('dung_luong_pin_gear')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Khả Năng Tương Thích</span>
                                                                <NhanDaSua fieldName="tuong_thich_gear" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Windows, macOS, Linux, Android..."
                                                                value={formSp.tuong_thich_gear}
                                                                onChange={(e) => setFormSp({ ...formSp, tuong_thich_gear: e.target.value })}
                                                                className={layClassInput('tuong_thich_gear')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 3. CHUỘT & LÓT CHUỘT */}
                                        {loaiFormSanPham === 'chuot' && (
                                            <div className="space-y-4">
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-violet-400 dark:border-violet-600 shadow-md shadow-violet-500/5 space-y-3.5">
                                                    <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 flex items-center gap-2 font-black text-xs uppercase tracking-wider text-violet-900 dark:text-violet-300">
                                                        <span className="w-6 h-6 rounded-lg bg-violet-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <Mouse className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Cảm Biến, DPI & Độ Chính Xác</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Mắt Đọc Cảm Biến</span>
                                                                <NhanDaSua fieldName="cam_bien_chuot" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="PixArt PAW3395 đỉnh cao..."
                                                                value={formSp.cam_bien_chuot}
                                                                onChange={(e) => setFormSp({ ...formSp, cam_bien_chuot: e.target.value })}
                                                                className={layClassInput('cam_bien_chuot')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Độ Phân Giải Tối Đa (DPI)</span>
                                                                <NhanDaSua fieldName="do_phan_giai_dpi" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="26.000 DPI (6 nấc tùy chỉnh)..."
                                                                value={formSp.do_phan_giai_dpi}
                                                                onChange={(e) => setFormSp({ ...formSp, do_phan_giai_dpi: e.target.value })}
                                                                className={layClassInput('do_phan_giai_dpi')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tốc Độ Theo Dõi & Gia Tốc</span>
                                                                <NhanDaSua fieldName="toc_do_ips_gia_toc" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="650 IPS / 50G..."
                                                                value={formSp.toc_do_ips_gia_toc}
                                                                onChange={(e) => setFormSp({ ...formSp, toc_do_ips_gia_toc: e.target.value })}
                                                                className={layClassInput('toc_do_ips_gia_toc')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Switch Chuột & Polling Rate</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="switch_chuot" />
                                                                    <NhanDaSua fieldName="polling_rate" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Optical Huano 100M..."
                                                                    value={formSp.switch_chuot}
                                                                    onChange={(e) => setFormSp({ ...formSp, switch_chuot: e.target.value })}
                                                                    className={layClassInput('switch_chuot')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="1000Hz - 4000Hz..."
                                                                    value={formSp.polling_rate}
                                                                    onChange={(e) => setFormSp({ ...formSp, polling_rate: e.target.value })}
                                                                    className={layClassInput('polling_rate')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Loại Lót Chuột & Bề Mặt</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="loai_lot_chuot" />
                                                                    <NhanDaSua fieldName="chat_lieu_be_mat" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Speed & Control..."
                                                                    value={formSp.loai_lot_chuot}
                                                                    onChange={(e) => setFormSp({ ...formSp, loai_lot_chuot: e.target.value })}
                                                                    className={layClassInput('loai_lot_chuot')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Vải Cordura..."
                                                                    value={formSp.chat_lieu_be_mat}
                                                                    onChange={(e) => setFormSp({ ...formSp, chat_lieu_be_mat: e.target.value })}
                                                                    className={layClassInput('chat_lieu_be_mat')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Đế Lót Chuột Chống Trượt</span>
                                                                <NhanDaSua fieldName="chat_lieu_de" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Cao su Poron tự nhiên..."
                                                                value={formSp.chat_lieu_de}
                                                                onChange={(e) => setFormSp({ ...formSp, chat_lieu_de: e.target.value })}
                                                                className={layClassInput('chat_lieu_de')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 shadow-md shadow-emerald-500/5 space-y-3.5">
                                                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 font-black text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                                                        <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <BatteryCharging className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Kết Nối, Kích Thước & Thời Lượng Pin</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Phương Thức Kết Nối</span>
                                                                <NhanDaSua fieldName="kieu_ket_noi_chuot" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Wireless 2.4GHz + Bluetooth + Type-C..."
                                                                value={formSp.kieu_ket_noi_chuot}
                                                                onChange={(e) => setFormSp({ ...formSp, kieu_ket_noi_chuot: e.target.value })}
                                                                className={layClassInput('kieu_ket_noi_chuot')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Thời Lượng Pin & LED</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="thoi_luong_pin_chuot" />
                                                                    <NhanDaSua fieldName="che_do_led" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Lên tới 200 giờ..."
                                                                    value={formSp.thoi_luong_pin_chuot}
                                                                    onChange={(e) => setFormSp({ ...formSp, thoi_luong_pin_chuot: e.target.value })}
                                                                    className={layClassInput('thoi_luong_pin_chuot')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="LED RGB..."
                                                                    value={formSp.che_do_led}
                                                                    onChange={(e) => setFormSp({ ...formSp, che_do_led: e.target.value })}
                                                                    className={layClassInput('che_do_led')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Đế Chuột (Feet PTFE)</span>
                                                                <NhanDaSua fieldName="chat_lieu_feet" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="100% Virgin PTFE bo cong..."
                                                                value={formSp.chat_lieu_feet}
                                                                onChange={(e) => setFormSp({ ...formSp, chat_lieu_feet: e.target.value })}
                                                                className={layClassInput('chat_lieu_feet')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Trọng Lượng & Kích Thước</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="trong_luong_chuot" />
                                                                    <NhanDaSua fieldName="kich_thuoc_chuot" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="49g..."
                                                                    value={formSp.trong_luong_chuot}
                                                                    onChange={(e) => setFormSp({ ...formSp, trong_luong_chuot: e.target.value })}
                                                                    className={layClassInput('trong_luong_chuot')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="120 x 65 x 37.8 mm..."
                                                                    value={formSp.kich_thuoc_chuot}
                                                                    onChange={(e) => setFormSp({ ...formSp, kich_thuoc_chuot: e.target.value })}
                                                                    className={layClassInput('kich_thuoc_chuot')}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 4. BALO & TÚI CHỐNG SỐC */}
                                        {loaiFormSanPham === 'balo' && (
                                            <div className="space-y-4">
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-600 shadow-md shadow-amber-500/5 space-y-3.5">
                                                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center gap-2 font-black text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300">
                                                        <span className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <Briefcase className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Ngăn Chứa & Kích Thước Máy</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Kích Cỡ Laptop Phù Hợp</span>
                                                                <NhanDaSua fieldName="kich_co_laptop_phu_hop" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Phù hợp laptop 15.6 - 18 inch..."
                                                                value={formSp.kich_co_laptop_phu_hop}
                                                                onChange={(e) => setFormSp({ ...formSp, kich_co_laptop_phu_hop: e.target.value })}
                                                                className={layClassInput('kich_co_laptop_phu_hop')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Dung Tích & Số Ngăn Chứa</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="dung_tich_balo" />
                                                                    <NhanDaSua fieldName="so_ngan_chua" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="36 Lít..."
                                                                    value={formSp.dung_tich_balo}
                                                                    onChange={(e) => setFormSp({ ...formSp, dung_tich_balo: e.target.value })}
                                                                    className={layClassInput('dung_tich_balo')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="1 chính + 6 phụ..."
                                                                    value={formSp.so_ngan_chua}
                                                                    onChange={(e) => setFormSp({ ...formSp, so_ngan_chua: e.target.value })}
                                                                    className={layClassInput('so_ngan_chua')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Kích Thước Bên Ngoài</span>
                                                                <NhanDaSua fieldName="kich_thuoc_balo" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="510 x 340 x 200 mm..."
                                                                value={formSp.kich_thuoc_balo}
                                                                onChange={(e) => setFormSp({ ...formSp, kich_thuoc_balo: e.target.value })}
                                                                className={layClassInput('kich_thuoc_balo')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Khối Lượng Thiết Bị (kg)</span>
                                                                <NhanDaSua fieldName="trong_luong_tui" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="1.4 kg..."
                                                                value={formSp.trong_luong_tui}
                                                                onChange={(e) => setFormSp({ ...formSp, trong_luong_tui: e.target.value })}
                                                                className={layClassInput('trong_luong_tui')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 shadow-md shadow-emerald-500/5 space-y-3.5">
                                                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 font-black text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                                                        <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <Layers className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Chất Liệu, Kháng Nước & Tính Năng</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chất Liệu Vải Chính</span>
                                                                <NhanDaSua fieldName="chat_lieu_chinh" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Polyester 1680D kháng nước..."
                                                                value={formSp.chat_lieu_chinh}
                                                                onChange={(e) => setFormSp({ ...formSp, chat_lieu_chinh: e.target.value })}
                                                                className={layClassInput('chat_lieu_chinh')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Lớp Lót Bảo Vệ & Khóa Kéo</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="lop_lot_bao_ve" />
                                                                    <NhanDaSua fieldName="khoa_keo" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Lót bọt khí EVA..."
                                                                    value={formSp.lop_lot_bao_ve}
                                                                    onChange={(e) => setFormSp({ ...formSp, lop_lot_bao_ve: e.target.value })}
                                                                    className={layClassInput('lop_lot_bao_ve')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Khóa YKK..."
                                                                    value={formSp.khoa_keo}
                                                                    onChange={(e) => setFormSp({ ...formSp, khoa_keo: e.target.value })}
                                                                    className={layClassInput('khoa_keo')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tiêu Chuẩn Kháng Nước</span>
                                                                <NhanDaSua fieldName="kha_nang_khang_nuoc" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Trượt nước IPX4 kèm áo mưa trùm..."
                                                                value={formSp.kha_nang_khang_nuoc}
                                                                onChange={(e) => setFormSp({ ...formSp, kha_nang_khang_nuoc: e.target.value })}
                                                                className={layClassInput('kha_nang_khang_nuoc')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Đệm Lưng Thoáng Khí</span>
                                                                <NhanDaSua fieldName="dem_lung_thoang_khi" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Đệm lưng 3D EVA thoáng khí..."
                                                                value={formSp.dem_lung_thoang_khi}
                                                                onChange={(e) => setFormSp({ ...formSp, dem_lung_thoang_khi: e.target.value })}
                                                                className={layClassInput('dem_lung_thoang_khi')}
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tính Năng Nổi Bật (phân tách bởi dấu phẩy)</span>
                                                                <NhanDaSua fieldName="cong_tinh_nang" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Cổng sạc USB ngoài, ngăn ẩn chống trộm RFID, đai vali..."
                                                                value={formSp.cong_tinh_nang}
                                                                onChange={(e) => setFormSp({ ...formSp, cong_tinh_nang: e.target.value })}
                                                                className={layClassInput('cong_tinh_nang')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 5. TAI NGHE & THIẾT BỊ ÂM THANH */}
                                        {loaiFormSanPham === 'tai_nghe' && (
                                            <div className="space-y-4">
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-rose-400 dark:border-rose-600 shadow-md shadow-rose-500/5 space-y-3.5">
                                                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center gap-2 font-black text-xs uppercase tracking-wider text-rose-900 dark:text-rose-300">
                                                        <span className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <Headphones className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Màng Loa & Công Nghệ Âm Thanh</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Màng Loa / Củ Loa Driver</span>
                                                                <NhanDaSua fieldName="mang_loa_driver" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Graphene 50mm Hi-Res Audio..."
                                                                value={formSp.mang_loa_driver}
                                                                onChange={(e) => setFormSp({ ...formSp, mang_loa_driver: e.target.value })}
                                                                className={layClassInput('mang_loa_driver')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Nghệ Âm Thanh</span>
                                                                <NhanDaSua fieldName="cong_nghe_am_thanh" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Âm thanh vòm 7.1 DTS Headphone:X 2.0..."
                                                                value={formSp.cong_nghe_am_thanh}
                                                                onChange={(e) => setFormSp({ ...formSp, cong_nghe_am_thanh: e.target.value })}
                                                                className={layClassInput('cong_nghe_am_thanh')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Dải Tần Số Đáp Ứng</span>
                                                                <NhanDaSua fieldName="tan_so_dap_ung" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="20Hz - 40.000Hz..."
                                                                value={formSp.tan_so_dap_ung}
                                                                onChange={(e) => setFormSp({ ...formSp, tan_so_dap_ung: e.target.value })}
                                                                className={layClassInput('tan_so_dap_ung')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Trở Kháng & Độ Nhạy</span>
                                                                <NhanDaSua fieldName="tro_khang_do_nhay" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="32 Ohm / 100 dB SPL @ 1kHz..."
                                                                value={formSp.tro_khang_do_nhay}
                                                                onChange={(e) => setFormSp({ ...formSp, tro_khang_do_nhay: e.target.value })}
                                                                className={layClassInput('tro_khang_do_nhay')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Nghệ Chống Ồn ANC</span>
                                                                <NhanDaSua fieldName="chong_on_anc" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Chống ồn chủ động ANC Hybrid đa cấp..."
                                                                value={formSp.chong_on_anc}
                                                                onChange={(e) => setFormSp({ ...formSp, chong_on_anc: e.target.value })}
                                                                className={layClassInput('chong_on_anc')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Microphone Đàm Thoại</span>
                                                                <NhanDaSua fieldName="micro_dam_thoai" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Micro Blue VO!CE lọc ồn AI rời..."
                                                                value={formSp.micro_dam_thoai}
                                                                onChange={(e) => setFormSp({ ...formSp, micro_dam_thoai: e.target.value })}
                                                                className={layClassInput('micro_dam_thoai')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 shadow-md shadow-emerald-500/5 space-y-3.5">
                                                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 font-black text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                                                        <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <BatteryCharging className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Kết Nối, Pin & Thiết Kế</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chuẩn Kết Nối</span>
                                                                <NhanDaSua fieldName="kieu_ket_noi_tai_nghe" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Lightspeed 2.4GHz + Bluetooth + Jack 3.5mm..."
                                                                value={formSp.kieu_ket_noi_tai_nghe}
                                                                onChange={(e) => setFormSp({ ...formSp, kieu_ket_noi_tai_nghe: e.target.value })}
                                                                className={layClassInput('kieu_ket_noi_tai_nghe')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Thời Lượng Pin & Kháng Nước</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="thoi_luong_pin_tai_nghe" />
                                                                    <NhanDaSua fieldName="khang_nuoc_tai_nghe" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Lên tới 50 giờ..."
                                                                    value={formSp.thoi_luong_pin_tai_nghe}
                                                                    onChange={(e) => setFormSp({ ...formSp, thoi_luong_pin_tai_nghe: e.target.value })}
                                                                    className={layClassInput('thoi_luong_pin_tai_nghe')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="IPX4..."
                                                                    value={formSp.khang_nuoc_tai_nghe}
                                                                    onChange={(e) => setFormSp({ ...formSp, khang_nuoc_tai_nghe: e.target.value })}
                                                                    className={layClassInput('khang_nuoc_tai_nghe')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chất Liệu Đệm Tai & Điều Khiển</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="dem_tai" />
                                                                    <NhanDaSua fieldName="bo_dieu_khien" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Memory Foam bọc da..."
                                                                    value={formSp.dem_tai}
                                                                    onChange={(e) => setFormSp({ ...formSp, dem_tai: e.target.value })}
                                                                    className={layClassInput('dem_tai')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Nút bấm trên củ tai..."
                                                                    value={formSp.bo_dieu_khien}
                                                                    onChange={(e) => setFormSp({ ...formSp, bo_dieu_khien: e.target.value })}
                                                                    className={layClassInput('bo_dieu_khien')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Trọng Lượng & Kích Thước</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="trong_luong_tai_nghe" />
                                                                    <NhanDaSua fieldName="kich_thuoc_tai_nghe" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="320g..."
                                                                    value={formSp.trong_luong_tai_nghe}
                                                                    onChange={(e) => setFormSp({ ...formSp, trong_luong_tai_nghe: e.target.value })}
                                                                    className={layClassInput('trong_luong_tai_nghe')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="190 x 180 x 85 mm..."
                                                                    value={formSp.kich_thuoc_tai_nghe}
                                                                    onChange={(e) => setFormSp({ ...formSp, kich_thuoc_tai_nghe: e.target.value })}
                                                                    className={layClassInput('kich_thuoc_tai_nghe')}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 6. CỦ SẠC & HUB CHUYỂN ĐỔI */}
                                        {loaiFormSanPham === 'sac_hub' && (
                                            <div className="space-y-4">
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-orange-400 dark:border-orange-600 shadow-md shadow-orange-500/5 space-y-3.5">
                                                    <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 flex items-center gap-2 font-black text-xs uppercase tracking-wider text-orange-900 dark:text-orange-300">
                                                        <span className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <Zap className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Công Suất & Công Nghệ Sạc Nhanh</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Suất Sạc Tối Đa (Watt)</span>
                                                                <NhanDaSua fieldName="cong_suat_tong" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="140W GaN Fast Charger..."
                                                                value={formSp.cong_suat_tong}
                                                                onChange={(e) => setFormSp({ ...formSp, cong_suat_tong: e.target.value })}
                                                                className={layClassInput('cong_suat_tong')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Nghệ Sạc Nhanh</span>
                                                                <NhanDaSua fieldName="cong_nghe_sac" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="PD 3.1, QC 4.0+, PPS, GaN III..."
                                                                value={formSp.cong_nghe_sac}
                                                                onChange={(e) => setFormSp({ ...formSp, cong_nghe_sac: e.target.value })}
                                                                className={layClassInput('cong_nghe_sac')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Giao Thức Sạc Hỗ Trợ</span>
                                                                <NhanDaSua fieldName="giao_thuc_ho_tro" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Power Delivery 3.1, Quick Charge 4.0..."
                                                                value={formSp.giao_thuc_ho_tro}
                                                                onChange={(e) => setFormSp({ ...formSp, giao_thuc_ho_tro: e.target.value })}
                                                                className={layClassInput('giao_thuc_ho_tro')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Dung Lượng Pin (nếu là sạc dự phòng)</span>
                                                                <NhanDaSua fieldName="dung_luong_pin_sac" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="24.000 mAh 86.4Wh..."
                                                                value={formSp.dung_luong_pin_sac}
                                                                onChange={(e) => setFormSp({ ...formSp, dung_luong_pin_sac: e.target.value })}
                                                                className={layClassInput('dung_luong_pin_sac')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Màn Hình Hiển Thị</span>
                                                                <NhanDaSua fieldName="man_hinh_hien_thi" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Màn hình TFT màu hiển thị công suất thực..."
                                                                value={formSp.man_hinh_hien_thi}
                                                                onChange={(e) => setFormSp({ ...formSp, man_hinh_hien_thi: e.target.value })}
                                                                className={layClassInput('man_hinh_hien_thi')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tính Năng An Toàn</span>
                                                                <NhanDaSua fieldName="tinh_nang_an_toan" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="ActiveShield 2.0 kiểm soát nhiệt..."
                                                                value={formSp.tinh_nang_an_toan}
                                                                onChange={(e) => setFormSp({ ...formSp, tinh_nang_an_toan: e.target.value })}
                                                                className={layClassInput('tinh_nang_an_toan')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-400 dark:border-blue-600 shadow-md shadow-blue-500/5 space-y-3.5">
                                                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center gap-2 font-black text-xs uppercase tracking-wider text-blue-900 dark:text-blue-300">
                                                        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <Usb className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Cổng Kết Nối & Băng Thông Truyền Tải</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Số Lượng & Loại Cổng Ra (phân tách bởi dấu phẩy)</span>
                                                                <NhanDaSua fieldName="so_cong_sac" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="2 x Type-C (140W max), 1 x USB-A (22.5W)..."
                                                                value={formSp.so_cong_sac}
                                                                onChange={(e) => setFormSp({ ...formSp, so_cong_sac: e.target.value })}
                                                                className={layClassInput('so_cong_sac')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Băng Thông Truyền Dữ Liệu</span>
                                                                <NhanDaSua fieldName="bang_thong_truyen_du_lieu" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="10Gbps USB 3.2 Gen 2 / 40Gbps USB4..."
                                                                value={formSp.bang_thong_truyen_du_lieu}
                                                                onChange={(e) => setFormSp({ ...formSp, bang_thong_truyen_du_lieu: e.target.value })}
                                                                className={layClassInput('bang_thong_truyen_du_lieu')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Sạc Pass-through & Xuất Hình</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="cong_suat_sac_pass_through" />
                                                                    <NhanDaSua fieldName="xuat_hinh_anh" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="100W PD..."
                                                                    value={formSp.cong_suat_sac_pass_through}
                                                                    onChange={(e) => setFormSp({ ...formSp, cong_suat_sac_pass_through: e.target.value })}
                                                                    className={layClassInput('cong_suat_sac_pass_through')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="HDMI 2.1 4K@120Hz..."
                                                                    value={formSp.xuat_hinh_anh}
                                                                    onChange={(e) => setFormSp({ ...formSp, xuat_hinh_anh: e.target.value })}
                                                                    className={layClassInput('xuat_hinh_anh')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chiều Dài Cáp & Vỏ Máy</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="chieu_dai_cap" />
                                                                    <NhanDaSua fieldName="chat_lieu_vo_sac" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="1.8 mét bọc dù..."
                                                                    value={formSp.chieu_dai_cap}
                                                                    onChange={(e) => setFormSp({ ...formSp, chieu_dai_cap: e.target.value })}
                                                                    className={layClassInput('chieu_dai_cap')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Nhôm tản nhiệt..."
                                                                    value={formSp.chat_lieu_vo_sac}
                                                                    onChange={(e) => setFormSp({ ...formSp, chat_lieu_vo_sac: e.target.value })}
                                                                    className={layClassInput('chat_lieu_vo_sac')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tương Thích Thiết Bị</span>
                                                                <NhanDaSua fieldName="tuong_thich_sac" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Laptop Gaming, MacBook Pro 16, Dell XPS, iPhone..."
                                                                value={formSp.tuong_thich_sac}
                                                                onChange={(e) => setFormSp({ ...formSp, tuong_thich_sac: e.target.value })}
                                                                className={layClassInput('tuong_thich_sac')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 7. LINH KIỆN & TẢN NHIỆT */}
                                        {loaiFormSanPham === 'linh_kien' && (
                                            <div className="space-y-4">
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-teal-400 dark:border-teal-600 shadow-md shadow-teal-500/5 space-y-3.5">
                                                    <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center gap-2 font-black text-xs uppercase tracking-wider text-teal-900 dark:text-teal-300">
                                                        <span className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <HardDrive className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Hiệu Năng & Tốc Độ Truyền Tải</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Loại Linh Kiện / Thiết Bị</span>
                                                                <NhanDaSua fieldName="loai_linh_kien" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Ổ cứng SSD / RAM / Đế tản nhiệt / Keo tản nhiệt..."
                                                                value={formSp.loai_linh_kien}
                                                                onChange={(e) => setFormSp({ ...formSp, loai_linh_kien: e.target.value })}
                                                                className={layClassInput('loai_linh_kien')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Dung Lượng Bộ Nhớ / Lưu Trữ</span>
                                                                <NhanDaSua fieldName="dung_luong_linh_kien" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="2TB (2048GB) / 32GB RAM..."
                                                                value={formSp.dung_luong_linh_kien}
                                                                onChange={(e) => setFormSp({ ...formSp, dung_luong_linh_kien: e.target.value })}
                                                                className={layClassInput('dung_luong_linh_kien')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tốc Độ Đọc / Ghi Tuần Tự</span>
                                                                <NhanDaSua fieldName="toc_do_doc_ghi" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Đọc 7.450 MB/s - Ghi 6.900 MB/s..."
                                                                value={formSp.toc_do_doc_ghi}
                                                                onChange={(e) => setFormSp({ ...formSp, toc_do_doc_ghi: e.target.value })}
                                                                className={layClassInput('toc_do_doc_ghi')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tốc Độ Bus RAM & CAS Latency</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="toc_do_bus_linh_kien" />
                                                                    <NhanDaSua fieldName="do_tre_cl" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="5600 MHz..."
                                                                    value={formSp.toc_do_bus_linh_kien}
                                                                    onChange={(e) => setFormSp({ ...formSp, toc_do_bus_linh_kien: e.target.value })}
                                                                    className={layClassInput('toc_do_bus_linh_kien')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="CL46..."
                                                                    value={formSp.do_tre_cl}
                                                                    onChange={(e) => setFormSp({ ...formSp, do_tre_cl: e.target.value })}
                                                                    className={layClassInput('do_tre_cl')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Hiệu Quả Giảm Nhiệt & Quạt</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="hieu_qua_giam_nhiet" />
                                                                    <NhanDaSua fieldName="toc_do_quat" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Giảm 15°C - 25°C..."
                                                                    value={formSp.hieu_qua_giam_nhiet}
                                                                    onChange={(e) => setFormSp({ ...formSp, hieu_qua_giam_nhiet: e.target.value })}
                                                                    className={layClassInput('hieu_qua_giam_nhiet')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="2800 RPM..."
                                                                    value={formSp.toc_do_quat}
                                                                    onChange={(e) => setFormSp({ ...formSp, toc_do_quat: e.target.value })}
                                                                    className={layClassInput('toc_do_quat')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Độ Dẫn Nhiệt (W/m-K)</span>
                                                                <NhanDaSua fieldName="do_dan_nhiet" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="14.2 W/m-K (keo tản nhiệt)..."
                                                                value={formSp.do_dan_nhiet}
                                                                onChange={(e) => setFormSp({ ...formSp, do_dan_nhiet: e.target.value })}
                                                                className={layClassInput('do_dan_nhiet')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-cyan-400 dark:border-cyan-600 shadow-md shadow-cyan-500/5 space-y-3.5">
                                                    <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center gap-2 font-black text-xs uppercase tracking-wider text-cyan-900 dark:text-cyan-300">
                                                        <span className="w-6 h-6 rounded-lg bg-cyan-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <Zap className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Chuẩn Giao Tiếp & Độ Bền</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chuẩn Giao Tiếp / Khe Cắm</span>
                                                                <NhanDaSua fieldName="chuan_giao_tiep" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="PCIe Gen 4.0 x4 M.2 2280 NVMe / DDR5 SODIMM..."
                                                                value={formSp.chuan_giao_tiep}
                                                                onChange={(e) => setFormSp({ ...formSp, chuan_giao_tiep: e.target.value })}
                                                                className={layClassInput('chuan_giao_tiep')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Độ Bền Ghi Xóa (TBW / MTBF)</span>
                                                                <NhanDaSua fieldName="do_ben_tbw" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="1.200 TBW - 1.5 triệu giờ MTBF..."
                                                                value={formSp.do_ben_tbw}
                                                                onChange={(e) => setFormSp({ ...formSp, do_ben_tbw: e.target.value })}
                                                                className={layClassInput('do_ben_tbw')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tản Nhiệt Đi Kèm</span>
                                                                <NhanDaSua fieldName="he_thong_tan_nhiet" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Heatsink Nhôm Hàng Không tản nhiệt thụ động..."
                                                                value={formSp.he_thong_tan_nhiet}
                                                                onChange={(e) => setFormSp({ ...formSp, he_thong_tan_nhiet: e.target.value })}
                                                                className={layClassInput('he_thong_tan_nhiet')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Khả Năng Tương Thích</span>
                                                                <NhanDaSua fieldName="tuong_thich_linh_kien" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Laptop Gaming, PC Desktop, PS5..."
                                                                value={formSp.tuong_thich_linh_kien}
                                                                onChange={(e) => setFormSp({ ...formSp, tuong_thich_linh_kien: e.target.value })}
                                                                className={layClassInput('tuong_thich_linh_kien')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Chế Độ Bảo Hành Dùng Chung */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 shadow-md shadow-emerald-500/5 space-y-3">
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                                                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                                                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                        <ShieldCheck className="w-3.5 h-3.5" />
                                                    </span>
                                                    <span>Chế Độ Bảo Hành Chính Hãng Cho Dòng Máy Này</span>
                                                </div>
                                                <NhanDaSua fieldName="che_do_bao_hanh" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="24 tháng chính hãng tại TNTP Store..."
                                                value={formSp.che_do_bao_hanh}
                                                onChange={(e) => setFormSp({ ...formSp, che_do_bao_hanh: e.target.value })}
                                                className={layClassInput('che_do_bao_hanh')}
                                            />
                                        </div>

                                        {/* Thông số tùy chỉnh động */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-400 dark:border-indigo-600 shadow-md shadow-indigo-500/5 space-y-3.5">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 gap-2">
                                                <div>
                                                    <span className="font-black text-xs uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                                                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <SlidersHorizontal className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Thông Số Kỹ Thuật Bổ Sung</span>
                                                    </span>
                                                    <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-0.5 font-medium">
                                                        💡 Bạn có thể thêm bất kỳ thông số nào bằng Tiếng Việt (ví dụ: Khe cắm mở rộng, Chuẩn Wi-Fi, Bàn phím cơ...).
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setThongSoTuyChinh([...thongSoTuyChinh, { key: '', value: '' }])}
                                                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black flex items-center gap-1.5 cursor-pointer text-xs shadow-xs transition-all shrink-0 self-start sm:self-auto"
                                                >
                                                    <PlusCircle className="w-3.5 h-3.5" />
                                                    <span>+ Thêm thông số</span>
                                                </button>
                                            </div>

                                            {thongSoTuyChinh.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Tên thông số (vd: Khe cắm mở rộng, Chuẩn Wi-Fi)..."
                                                        value={item.key}
                                                        onChange={(e) => {
                                                            const updated = [...thongSoTuyChinh];
                                                            updated[idx].key = e.target.value;
                                                            setThongSoTuyChinh(updated);
                                                        }}
                                                        className={`w-1/3 ${layClassInputTuyChinh(idx, 'key')}`}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Giá trị (vd: 2 khe M.2 PCIe Gen 4)..."
                                                        value={item.value}
                                                        onChange={(e) => {
                                                            const updated = [...thongSoTuyChinh];
                                                            updated[idx].value = e.target.value;
                                                            setThongSoTuyChinh(updated);
                                                        }}
                                                        className={`flex-1 ${layClassInputTuyChinh(idx, 'value')}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={async () => {
                                                            const tenTs = item.key?.trim() ? `"${item.key}"` : `thông số dòng #${idx + 1}`;
                                                            const dongY = await xacNhan({
                                                                tieuDe: 'Xóa Thông Số Kỹ Thuật?',
                                                                noiDung: `Bạn có chắc chắn muốn xóa thông số ${tenTs} khỏi cấu hình sản phẩm này không?`,
                                                                loai: 'danger',
                                                                nutXacNhan: 'Xóa Thông Số',
                                                                nutHuy: 'Hủy Bỏ'
                                                            });
                                                            if (!dongY) return;
                                                            setThongSoTuyChinh(thongSoTuyChinh.filter((_, i) => i !== idx));
                                                        }}
                                                        className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl cursor-pointer transition-colors shrink-0"
                                                        title="Xóa thông số này"
                                                    >
                                                        <MinusCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* TAB 3: MÀU SẮC & CÁC SẢN PHẨM PHỤ / BIẾN THỂ */}
                                {tabModalSp === 'bien_the' && (
                                    <div className="space-y-4 animate-in fade-in duration-150">
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-purple-400 dark:border-purple-600 shadow-md shadow-purple-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <span className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center text-sm shadow-xs shrink-0">
                                                    <Palette className="w-5 h-5" />
                                                </span>
                                                <div>
                                                    <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-xs uppercase tracking-wider">
                                                        <span>3. Màu Sắc & Tùy Chọn Phiên Bản (Không Bắt Buộc)</span>
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black">
                                                            {formSp.tuy_chon_phien_ban?.length || 0} mục
                                                        </span>
                                                    </h4>
                                                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                                                        Chỉ cần thiết lập nếu sản phẩm này có nhiều màu (Đen, Bạc, Trắng...) hoặc cấu hình RAM/SSD riêng cho khách chọn.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                                {formSp.tuy_chon_phien_ban && formSp.tuy_chon_phien_ban.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={async () => {
                                                            const dongY = await xacNhan({
                                                                tieuDe: 'Xóa Toàn Bộ Biến Thể Màu Sắc?',
                                                                noiDung: 'Bạn có chắc chắn muốn xóa tất cả biến thể màu sắc để đưa sản phẩm về phiên bản chuẩn duy nhất không?',
                                                                loai: 'danger',
                                                                nutXacNhan: 'Xóa Hết Biến Thể',
                                                                nutHuy: 'Hủy Bỏ'
                                                            });
                                                            if (!dongY) return;
                                                            setFormSp({ ...formSp, tuy_chon_phien_ban: [] });
                                                        }}
                                                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all border border-slate-300 dark:border-slate-700 cursor-pointer"
                                                        title="Bỏ các biến thể để dùng 1 màu chuẩn duy nhất ở Tab 1"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                                        <span>Xóa Hết (Dùng 1 Màu Chuẩn)</span>
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const count = (formSp.tuy_chon_phien_ban?.length || 0) + 1;
                                                        const newVar = {
                                                            ma_tuy_chon: `VAR_${count}_${Date.now().toString().slice(-4)}`,
                                                            ten_tuy_chon: `Màu mới #${count}`,
                                                            ram: formSp.ram || '',
                                                            o_cung: formSp.o_cung || '',
                                                            chenh_lech_gia: 0,
                                                            hinh_anh: formSp.hinh_anh || ''
                                                        };
                                                        setFormSp({
                                                            ...formSp,
                                                            tuy_chon_phien_ban: [...(formSp.tuy_chon_phien_ban || []), newVar]
                                                        });
                                                    }}
                                                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/25 transition-all cursor-pointer"
                                                >
                                                    <PlusCircle className="w-4 h-4" />
                                                    <span>+ Thêm Màu / Biến Thể</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Danh sách biến thể */}
                                        {(!formSp.tuy_chon_phien_ban || formSp.tuy_chon_phien_ban.length === 0) ? (
                                            <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-3">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center mx-auto text-xl shadow-xs">
                                                    👌
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800 dark:text-slate-200 text-sm">
                                                        Sản phẩm đang áp dụng 1 phiên bản chuẩn (Không bắt buộc thêm màu)
                                                    </p>
                                                    <p className="text-slate-500 dark:text-slate-400 text-xs max-w-lg mx-auto mt-1 leading-relaxed">
                                                        Đa số sản phẩm (như chuột, sạc, balo, hay laptop chỉ có 1 màu) <b>không cần thêm biến thể ở đây</b>. Website sẽ tự động hiển thị theo ảnh và cấu hình mặc định tại <b>Tab 1</b> và <b>Tab 4</b>.
                                                    </p>
                                                </div>
                                                <div className="pt-1 flex items-center justify-center gap-2">
                                                    <span className="text-slate-400 text-xs italic">
                                                        Chỉ bấm nút <b>"+ Thêm Màu / Biến Thể"</b> nếu sản phẩm này có nhiều màu cho khách lựa chọn khi đặt hàng.
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {formSp.tuy_chon_phien_ban.map((bt, bIdx) => {
                                                    const giaGocSp = Number(formSp.gia_khuyen_mai || formSp.gia_chinh_thuc || 0);
                                                    const giaBienThe = giaGocSp + Number(bt.chenh_lech_gia || 0);
                                                    const btGoc = formSpGoc?.tuy_chon_phien_ban?.[bIdx];
                                                    const daSuaTenBt = spDangSua && (!btGoc || btGoc.ten_tuy_chon !== bt.ten_tuy_chon);
                                                    const daSuaGiaBt = spDangSua && (!btGoc || Number(btGoc.chenh_lech_gia) !== Number(bt.chenh_lech_gia));
                                                    return (
                                                        <div
                                                            key={bt.ma_tuy_chon || bIdx}
                                                            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-purple-400/90 dark:border-purple-600 shadow-md shadow-purple-500/5 space-y-4 transition-all hover:border-purple-500"
                                                        >
                                                            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                                                                        #{bIdx + 1}
                                                                    </span>
                                                                    <span className="font-black text-purple-950 dark:text-purple-200 text-xs">
                                                                        {bt.ten_tuy_chon || `Biến thể #${bIdx + 1}`}
                                                                    </span>
                                                                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black border border-purple-200 dark:border-purple-800">
                                                                        {bt.ma_tuy_chon}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-purple-200 dark:border-purple-800">
                                                                        Giá bán web: <span className="font-black text-purple-600 dark:text-purple-400">{dinhDangTienVND(giaBienThe)}</span>
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={async () => {
                                                                            const tenBt = bt.ten_tuy_chon || `Biến thể #${bIdx + 1}`;
                                                                            const dongY = await xacNhan({
                                                                                tieuDe: 'Xóa Biến Thể Sản Phẩm?',
                                                                                noiDung: `Bạn có chắc muốn xóa biến thể "${tenBt}" không? Cấu hình giá riêng và hình ảnh của biến thể này sẽ bị gỡ bỏ.`,
                                                                                loai: 'danger',
                                                                                nutXacNhan: 'Xóa Biến Thể',
                                                                                nutHuy: 'Hủy Bỏ'
                                                                            });
                                                                            if (!dongY) return;
                                                                            const updated = formSp.tuy_chon_phien_ban.filter((_, idx) => idx !== bIdx);
                                                                            setFormSp({ ...formSp, tuy_chon_phien_ban: updated });
                                                                        }}
                                                                        className="p-1.5 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/60 rounded-xl transition-colors cursor-pointer"
                                                                        title="Xóa biến thể này"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center">
                                                                {/* 1. Tên màu sắc / Tùy chọn */}
                                                                <div className="sm:col-span-5 space-y-1">
                                                                    <label className="font-extrabold text-slate-800 dark:text-slate-200 text-xs flex items-center justify-between">
                                                                        <span>Tên màu sắc / Phiên bản *</span>
                                                                        {daSuaTenBt && (
                                                                            <span className="text-[10px] font-black text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/70 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-600">
                                                                                Đã sửa
                                                                            </span>
                                                                        )}
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        required
                                                                        placeholder="vd: Đen Titan, Xám Không Gian, Trắng..."
                                                                        value={bt.ten_tuy_chon || ''}
                                                                        onChange={(e) => {
                                                                            const updated = [...formSp.tuy_chon_phien_ban];
                                                                            updated[bIdx] = { ...updated[bIdx], ten_tuy_chon: e.target.value };
                                                                            setFormSp({ ...formSp, tuy_chon_phien_ban: updated });
                                                                        }}
                                                                        className={daSuaTenBt
                                                                            ? "w-full px-3.5 py-2.5 rounded-xl border-2 border-amber-500 dark:border-amber-400 bg-amber-50 dark:bg-amber-950/50 text-amber-950 dark:text-amber-100 font-bold text-xs ring-2 ring-amber-400/30 focus:outline-none transition-all"
                                                                            : "w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-blue-50/60 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all"}
                                                                    />
                                                                </div>

                                                                {/* 2. Giá bán phiên bản này (nhập trực tiếp, tự quy đổi chênh lệch) */}
                                                                <div className="sm:col-span-3 space-y-1">
                                                                    <label className="font-extrabold text-slate-800 dark:text-slate-200 text-xs flex items-center justify-between">
                                                                        <span>Giá bán web bản này (VNĐ)</span>
                                                                        {daSuaGiaBt && (
                                                                            <span className="text-[10px] font-black text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/70 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-600">
                                                                                Đã sửa
                                                                            </span>
                                                                        )}
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="50000"
                                                                        placeholder="Nhập giá bán..."
                                                                        value={giaBienThe}
                                                                        onChange={(e) => {
                                                                            const giaNhap = Number(e.target.value) || 0;
                                                                            const chenhLech = giaNhap - giaGocSp;
                                                                            const updated = [...formSp.tuy_chon_phien_ban];
                                                                            updated[bIdx] = { ...updated[bIdx], chenh_lech_gia: chenhLech };
                                                                            setFormSp({ ...formSp, tuy_chon_phien_ban: updated });
                                                                        }}
                                                                        className={daSuaGiaBt
                                                                            ? "w-full px-3 py-2.5 rounded-xl border-2 border-amber-500 dark:border-amber-400 bg-amber-50 dark:bg-amber-950/50 text-amber-950 dark:text-amber-100 font-black text-xs ring-2 ring-amber-400/30 focus:outline-none transition-all"
                                                                            : "w-full px-3 py-2.5 rounded-xl border-2 border-purple-300 dark:border-purple-700 bg-purple-50/60 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-black text-xs focus:bg-white focus:border-purple-500 focus:outline-none transition-all"}
                                                                    />
                                                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold truncate">
                                                                        {Number(bt.chenh_lech_gia) > 0 ? `+${dinhDangTienVND(bt.chenh_lech_gia)} so với bản gốc` : Number(bt.chenh_lech_gia) < 0 ? `-${dinhDangTienVND(Math.abs(bt.chenh_lech_gia))} so với bản gốc` : 'Bằng giá bản gốc'}
                                                                    </div>
                                                                </div>

                                                                {/* 3. Ảnh màu này - Trực quan có nút tải từ máy tính */}
                                                                <div className="sm:col-span-4 space-y-1">
                                                                    <label className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                                                                        Ảnh riêng cho màu này
                                                                    </label>
                                                                    <div className="flex items-center gap-2">
                                                                        {/* Thumbnail Preview */}
                                                                        <div
                                                                            onClick={() => bt.hinh_anh && setModalXemAnh({
                                                                                url: bt.hinh_anh,
                                                                                ten: `${formSp.ten_san_pham} - ${bt.ten_tuy_chon}`,
                                                                                gia: giaBienThe,
                                                                                sku: bt.ma_tuy_chon || formSp.ma_san_pham,
                                                                                hang: formSp.hang_san_xuat
                                                                            })}
                                                                            className={`w-11 h-11 rounded-xl border-2 overflow-hidden flex items-center justify-center shrink-0 shadow-xs relative group ${bt.hinh_anh ? 'border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-slate-800 cursor-zoom-in' : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                                                                            title={bt.hinh_anh ? 'Bấm phóng to ảnh này' : 'Chưa có ảnh'}
                                                                        >
                                                                            {bt.hinh_anh ? (
                                                                                <>
                                                                                    <img src={bt.hinh_anh} alt="" className="w-full h-full object-contain" />
                                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                                                                        <ZoomIn className="w-3.5 h-3.5" />
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <ImageIcon className="w-5 h-5 text-slate-400" />
                                                                            )}
                                                                        </div>

                                                                        {/* Nút Upload trực tiếp từ máy tính */}
                                                                        <label className="px-3 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-950 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 font-black text-xs flex items-center gap-1.5 cursor-pointer border border-purple-300 dark:border-purple-800 transition-all shrink-0">
                                                                            <Upload className="w-3.5 h-3.5" />
                                                                            <span>Tải ảnh</span>
                                                                            <input
                                                                                type="file"
                                                                                accept="image/*"
                                                                                className="hidden"
                                                                                onChange={(e) => xuLyUploadAnhBienThe(bIdx, e)}
                                                                            />
                                                                        </label>

                                                                        {/* Ô nhập link phụ nếu có URL */}
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Hoặc dán URL..."
                                                                            value={bt.hinh_anh || ''}
                                                                            onChange={(e) => {
                                                                                const updated = [...formSp.tuy_chon_phien_ban];
                                                                                updated[bIdx] = { ...updated[bIdx], hinh_anh: e.target.value };
                                                                                setFormSp({ ...formSp, tuy_chon_phien_ban: updated });
                                                                            }}
                                                                            className="flex-1 min-w-0 px-2.5 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px] focus:bg-white focus:border-purple-500 focus:outline-none transition-all truncate"
                                                                            title={bt.hinh_anh}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TAB 4: HÌNH ẢNH & MÔ TẢ CHI TIẾT */}
                                {tabModalSp === 'hinh_anh' && (
                                    <div className="space-y-4 animate-in fade-in duration-150">
                                        {/* Ảnh đại diện chính */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400/90 dark:border-emerald-600 shadow-md shadow-emerald-500/5 space-y-4">
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                                                <div className="font-black text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                        <ImageIcon className="w-3.5 h-3.5" />
                                                    </span>
                                                    <span>Ảnh Đại Diện Chính Sản Phẩm</span>
                                                </div>
                                                {(formSp.hinh_anh_chinh || formSp.hinh_anh) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setModalXemAnh({
                                                            url: formSp.hinh_anh_chinh || formSp.hinh_anh,
                                                            ten: formSp.ten_san_pham,
                                                            gia: formSp.gia_khuyen_mai || formSp.gia_chinh_thuc,
                                                            sku: formSp.ma_san_pham,
                                                            hang: formSp.hang_san_xuat,
                                                            variants: formSp.tuy_chon_phien_ban
                                                        })}
                                                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border-2 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-black text-xs flex items-center gap-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer shadow-xs"
                                                    >
                                                        <Maximize2 className="w-3.5 h-3.5" />
                                                        <span>Phóng to xem thử</span>
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-5 items-center">
                                                {/* Visual Preview Box */}
                                                <div
                                                    onClick={() => (formSp.hinh_anh_chinh || formSp.hinh_anh) && setModalXemAnh({
                                                        url: formSp.hinh_anh_chinh || formSp.hinh_anh,
                                                        ten: formSp.ten_san_pham,
                                                        gia: formSp.gia_khuyen_mai || formSp.gia_chinh_thuc,
                                                        sku: formSp.ma_san_pham,
                                                        hang: formSp.hang_san_xuat,
                                                        variants: formSp.tuy_chon_phien_ban
                                                    })}
                                                    className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50/40 dark:bg-slate-800 p-2 flex items-center justify-center shrink-0 cursor-zoom-in relative group overflow-hidden shadow-xs"
                                                >
                                                    {(formSp.hinh_anh_chinh || formSp.hinh_anh) ? (
                                                        <>
                                                            <img
                                                                src={formSp.hinh_anh_chinh || formSp.hinh_anh}
                                                                alt=""
                                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                                                onError={(e) => { e.currentTarget.src = '/images/sp/asus_rog_scar18.jpg'; }}
                                                            />
                                                            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-black text-xs gap-1.5">
                                                                <ZoomIn className="w-4 h-4" />
                                                                <span>Xem To</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="text-center p-2">
                                                            <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                                                            <span className="text-slate-400 font-bold text-xs mt-1 block">Chưa có ảnh</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Upload Action Center - Tối giản, trực quan, không rườm rà */}
                                                <div className="flex-1 w-full space-y-3">
                                                    <div>
                                                        <span className="font-extrabold text-slate-900 dark:text-white text-xs block">
                                                            Ảnh đại diện sản phẩm
                                                        </span>
                                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                                            Bấm nút bên dưới để chọn ảnh trực tiếp từ máy tính của bạn (hỗ trợ JPG, PNG, WebP).
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2.5">
                                                        {/* Nút chính: Tải file trực tiếp từ máy tính */}
                                                        <label className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-emerald-500/25 cursor-pointer transition-all active:scale-95">
                                                            <Upload className="w-4 h-4" />
                                                            <span>Tải ảnh từ máy tính</span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={xuLyUploadAnhChinh}
                                                            />
                                                        </label>

                                                        {/* Nút phụ: Dán link nếu có URL mạng */}
                                                        <button
                                                            type="button"
                                                            onClick={() => setHienOUrlAnhChinh(!hienOUrlAnhChinh)}
                                                            className="px-3.5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                                                        >
                                                            <Link2 className="w-3.5 h-3.5" />
                                                            <span>{hienOUrlAnhChinh ? 'Ẩn ô dán link' : 'Hoặc dán link URL'}</span>
                                                        </button>

                                                        {/* Nút xóa ảnh */}
                                                        {(formSp.hinh_anh_chinh || formSp.hinh_anh) && (
                                                            <button
                                                                type="button"
                                                                onClick={async () => {
                                                                    const dongY = await xacNhan({
                                                                        tieuDe: 'Gỡ Ảnh Đại Diện Chính?',
                                                                        noiDung: 'Bạn có chắc chắn muốn xóa hình ảnh đại diện chính của sản phẩm này không?',
                                                                        loai: 'danger',
                                                                        nutXacNhan: 'Gỡ Ảnh',
                                                                        nutHuy: 'Giữ Lại'
                                                                    });
                                                                    if (!dongY) return;
                                                                    setFormSp({ ...formSp, hinh_anh_chinh: '', hinh_anh: '' });
                                                                    hienThongBao('Đã xóa ảnh đại diện!');
                                                                }}
                                                                className="px-3 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                <span>Xóa ảnh</span>
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Ô nhập URL thu gọn (chỉ hiện khi click) */}
                                                    {hienOUrlAnhChinh && (
                                                        <div className="pt-1 animate-in fade-in duration-150">
                                                            <input
                                                                type="text"
                                                                placeholder="Dán link ảnh online (vd: https://... hoặc /images/sp/...)"
                                                                value={formSp.hinh_anh_chinh || formSp.hinh_anh || ''}
                                                                onChange={(e) => {
                                                                    setFormSp({ ...formSp, hinh_anh_chinh: e.target.value, hinh_anh: e.target.value });
                                                                }}
                                                                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mô tả ngắn & Mô tả chi tiết trong card riêng */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-400/90 dark:border-blue-600 shadow-md shadow-blue-500/5 space-y-4">
                                            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-blue-900 dark:text-blue-300 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800">
                                                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                    <FileText className="w-3.5 h-3.5" />
                                                </span>
                                                <span>Nội Dung Giới Thiệu & Mô Tả Chi Tiết</span>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="space-y-1">
                                                    <label className="font-extrabold text-slate-800 dark:text-slate-200 text-xs flex items-center justify-between">
                                                        <span>Mô Tả Ngắn Tóm Tắt (Xuất hiện dưới tên sản phẩm ngoài web)</span>
                                                        <NhanDaSua fieldName="mo_ta_ngan" />
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Vd: Cỗ máy gaming đỉnh cao 2026 với Core i9 thế hệ 14 và RTX 4090..."
                                                        value={formSp.mo_ta_ngan}
                                                        onChange={(e) => setFormSp({ ...formSp, mo_ta_ngan: e.target.value })}
                                                        className={layClassInput('mo_ta_ngan')}
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="font-extrabold text-slate-800 dark:text-slate-200 text-xs flex items-center justify-between">
                                                        <span>Bài Viết Đánh Giá Chi Tiết (Nội dung bài viết trang sản phẩm)</span>
                                                        <NhanDaSua fieldName="mo_ta_chi_tiet" />
                                                    </label>
                                                    <textarea
                                                        rows={6}
                                                        placeholder="Nhập nội dung bài đánh giá, điểm nổi bật, thiết kế, màn hình, hiệu năng tản nhiệt..."
                                                        value={formSp.mo_ta_chi_tiet}
                                                        onChange={(e) => setFormSp({ ...formSp, mo_ta_chi_tiet: e.target.value })}
                                                        className={layClassInput('mo_ta_chi_tiet', 'leading-relaxed font-normal')}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Khung 3: ĐẶC ĐIỂM NỔI BẬT ĐÁNG CHÚ Ý (DƯỚI ẢNH NGOÀI WEB) */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-cyan-400/90 dark:border-cyan-600 shadow-md shadow-cyan-500/5 space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 gap-2">
                                                <div>
                                                    <span className="font-black text-xs uppercase tracking-wider text-cyan-900 dark:text-cyan-300 flex items-center gap-2">
                                                        <span className="w-6 h-6 rounded-lg bg-cyan-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <Sparkles className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Đặc Điểm Nổi Bật Đáng Chú Ý</span>
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-200/70 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 font-black">
                                                            {(formSp.dac_diem_noi_bat || []).length} mục
                                                        </span>
                                                    </span>
                                                    <p className="text-[11px] text-cyan-800/80 dark:text-cyan-300/80 mt-0.5 font-medium">
                                                        💡 Hiển thị thành các gạch đầu dòng công nghệ ấn tượng ngay dưới ảnh sản phẩm ở trang chi tiết.
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const current = Array.isArray(formSp.dac_diem_noi_bat) ? formSp.dac_diem_noi_bat : [];
                                                        setFormSp({ ...formSp, dac_diem_noi_bat: [...current, ''] });
                                                    }}
                                                    className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-black flex items-center gap-1.5 cursor-pointer text-xs shadow-xs transition-all shrink-0 self-start sm:self-auto active:scale-95"
                                                >
                                                    <PlusCircle className="w-3.5 h-3.5" />
                                                    <span>+ Thêm đặc điểm</span>
                                                </button>
                                            </div>

                                            {(!formSp.dac_diem_noi_bat || formSp.dac_diem_noi_bat.length === 0) ? (
                                                <div className="text-center py-6 px-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                                                    <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                        Chưa có gạch đầu dòng đặc điểm nổi bật nào.
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFormSp({
                                                                ...formSp,
                                                                dac_diem_noi_bat: [
                                                                    'Bộ đôi vi xử lý thế hệ mới cực mạnh kết hợp card đồ họa kiến trúc tân tiến',
                                                                    'Màn hình chuẩn màu đồ họa tần số quét cao siêu mượt, độ phân giải sắc nét',
                                                                    'Hệ thống tản nhiệt thông minh tối ưu luồng gió mát lạnh êm ái'
                                                                ]
                                                            });
                                                        }}
                                                        className="px-3.5 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700 text-xs font-bold hover:bg-cyan-100 transition-colors cursor-pointer"
                                                    >
                                                        + Thêm mẫu mặc định
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-2.5">
                                                    {formSp.dac_diem_noi_bat.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 flex items-center justify-center text-xs font-black shrink-0">
                                                                {idx + 1}
                                                            </div>
                                                            <input
                                                                type="text"
                                                                placeholder={`Đặc điểm nổi bật #${idx + 1} (vd: Màn hình 18-inch Mini-LED 2.5K 240Hz Nebula HDR...)`}
                                                                value={item}
                                                                onChange={(e) => {
                                                                    const updated = [...formSp.dac_diem_noi_bat];
                                                                    updated[idx] = e.target.value;
                                                                    setFormSp({ ...formSp, dac_diem_noi_bat: updated });
                                                                }}
                                                                className="flex-1 px-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={async () => {
                                                                    const dongY = await xacNhan({
                                                                        tieuDe: 'Xóa Đặc Điểm Nổi Bật?',
                                                                        noiDung: `Bạn có chắc chắn muốn xóa đặc điểm dòng #${idx + 1} này không?`,
                                                                        loai: 'danger',
                                                                        nutXacNhan: 'Xóa Dòng',
                                                                        nutHuy: 'Hủy Bỏ'
                                                                    });
                                                                    if (!dongY) return;
                                                                    const updated = formSp.dac_diem_noi_bat.filter((_, i) => i !== idx);
                                                                    setFormSp({ ...formSp, dac_diem_noi_bat: updated });
                                                                }}
                                                                className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl cursor-pointer transition-colors shrink-0"
                                                                title="Xóa dòng đặc điểm này"
                                                            >
                                                                <MinusCircle className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Khung 4: ĐẶC QUYỀN QUÀ TẶNG TNTP (HỘP QUÀ MUA HÀNG NGOÀI WEB) */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-400/90 dark:border-amber-600 shadow-md shadow-amber-500/5 space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 gap-2">
                                                <div>
                                                    <span className="font-black text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-2">
                                                        <span className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <Gift className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Đặc Quyền Quà Tặng TNTP Kèm Theo</span>
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-200/70 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-black">
                                                            Tổng: {dinhDangTienVND((formSp.qua_tang || []).reduce((t, q) => t + (Number(q.gia_tri) || 0), 0))}
                                                        </span>
                                                    </span>
                                                    <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5 font-medium">
                                                        💡 Hiển thị trong khung viền cam đặc quyền quà tặng bên phải nút Mua Ngay ở trang chi tiết sản phẩm.
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const current = Array.isArray(formSp.qua_tang) ? formSp.qua_tang : [];
                                                        setFormSp({ ...formSp, qua_tang: [...current, { ten_qua_tang: '', gia_tri: 500000 }] });
                                                    }}
                                                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black flex items-center gap-1.5 cursor-pointer text-xs shadow-xs transition-all shrink-0 self-start sm:self-auto active:scale-95"
                                                >
                                                    <PlusCircle className="w-3.5 h-3.5" />
                                                    <span>+ Thêm quà tặng</span>
                                                </button>
                                            </div>

                                            {(!formSp.qua_tang || formSp.qua_tang.length === 0) ? (
                                                <div className="text-center py-6 px-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                                                    <Gift className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                        Chưa thiết lập quà tặng kèm cho sản phẩm này.
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFormSp({
                                                                ...formSp,
                                                                qua_tang: [
                                                                    { ten_qua_tang: 'Balo ROG Ranger BP2701 Gaming trị giá 2.500.000đ', gia_tri: 2500000 },
                                                                    { ten_qua_tang: 'Chuột ROG Gladius III Wireless AimPoint trị giá 2.190.000đ', gia_tri: 2190000 },
                                                                    { ten_qua_tang: 'Tai nghe ROG Fusion II 500 7.1 Surround trị giá 3.990.000đ', gia_tri: 3990000 },
                                                                    { ten_qua_tang: 'Gói bảo hành vàng ASUS ROG Premium Care tận nhà 2 năm', gia_tri: 4500000 }
                                                                ]
                                                            });
                                                        }}
                                                        className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                                                    >
                                                        + Thêm bộ quà ROG mặc định
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-2.5">
                                                    {formSp.qua_tang.map((q, idx) => (
                                                        <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60">
                                                            <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-black shrink-0 self-center">
                                                                🎁
                                                            </div>
                                                            <input
                                                                type="text"
                                                                placeholder="Tên quà tặng (vd: Balo Gaming cao cấp trị giá 2.500.000đ)..."
                                                                value={q.ten_qua_tang || ''}
                                                                onChange={(e) => {
                                                                    const updated = [...formSp.qua_tang];
                                                                    updated[idx] = { ...updated[idx], ten_qua_tang: e.target.value };
                                                                    setFormSp({ ...formSp, qua_tang: updated });
                                                                }}
                                                                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                                            />
                                                            <div className="flex items-center gap-2">
                                                                <div className="relative w-36">
                                                                    <input
                                                                        type="number"
                                                                        placeholder="Trị giá (VNĐ)"
                                                                        value={q.gia_tri !== undefined ? q.gia_tri : ''}
                                                                        onChange={(e) => {
                                                                            const updated = [...formSp.qua_tang];
                                                                            updated[idx] = { ...updated[idx], gia_tri: Number(e.target.value) || 0 };
                                                                            setFormSp({ ...formSp, qua_tang: updated });
                                                                        }}
                                                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none pr-7"
                                                                    />
                                                                    <span className="absolute right-2.5 top-2 text-[11px] text-slate-400 font-bold">đ</span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={async () => {
                                                                        const dongY = await xacNhan({
                                                                            tieuDe: 'Xóa Quà Tặng Này?',
                                                                            noiDung: `Bạn có chắc chắn muốn gỡ quà tặng "${q.ten_qua_tang || `Món quà #${idx + 1}`}" không?`,
                                                                            loai: 'danger',
                                                                            nutXacNhan: 'Xóa Quà',
                                                                            nutHuy: 'Hủy Bỏ'
                                                                        });
                                                                        if (!dongY) return;
                                                                        const updated = formSp.qua_tang.filter((_, i) => i !== idx);
                                                                        setFormSp({ ...formSp, qua_tang: updated });
                                                                    }}
                                                                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg cursor-pointer transition-colors shrink-0"
                                                                    title="Xóa quà này"
                                                                >
                                                                    <MinusCircle className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Cố Định - Thiết Kế Hiện Đại, Nút Bấm Rõ Ràng */}
                            <div className="shrink-0 p-3.5 sm:p-4 px-6 bg-white dark:bg-slate-900 border-t border-slate-200/90 dark:border-slate-800 flex items-center justify-between gap-3 shadow-md z-10">
                                <div className="text-xs text-slate-600 dark:text-slate-400 hidden sm:flex items-center gap-2 font-medium">
                                    {spDangSua && demSoMucDaSua() > 0 ? (
                                        <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                            <span>Đang sửa <b>{demSoMucDaSua()}</b> mục thông tin</span>
                                        </span>
                                    ) : (
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            <span>Nhấn "Lưu Sản Phẩm" để cập nhật vào kho hàng</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2.5 ml-auto">
                                    <button
                                        type="button"
                                        disabled={dangLuuSp}
                                        onClick={dongModalSpAnToan}
                                        className={`px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors shadow-xs ${dangLuuSp ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                    >
                                        Hủy Bỏ
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={dangLuuSp}
                                        className={`px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all ${dangLuuSp ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        {dangLuuSp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        <span>{dangLuuSp ? 'Đang lưu vào kho...' : 'Lưu Sản Phẩm'}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Xem Trước: Hỗ Trợ Cả Chế Độ Thẻ Card & Trang Chi Tiết Sản Phẩm 1:1 */}
            {dangXemTruocCard && (
                <div
                    className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
                    onClick={() => setDangXemTruocCard(false)}
                >
                    <div
                        className={`relative bg-white dark:bg-slate-900 rounded-3xl border-2 border-indigo-500/30 dark:border-indigo-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all duration-300 animate-in zoom-in-95 ${
                            kieuXemTruoc === 'chi_tiet' ? 'w-full max-w-6xl' : 'w-full max-w-sm sm:max-w-md'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 1. Header Modal Xem Trước: Hiện Đại, Rõ Nét, Chuẩn Web Bán Lẻ */}
                        <div className="w-full p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center text-lg shadow-md shrink-0">
                                    <Eye className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                                            {kieuXemTruoc === 'card' ? 'Xem Thẻ Card Sản Phẩm' : 'Xem Trang Chi Tiết Sản Phẩm'}
                                        </h4>
                                        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-black bg-blue-100 dark:bg-blue-950 text-[#0052cc] dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
                                            {kieuXemTruoc === 'card' ? 'Thẻ ngoài danh mục' : 'Trang chi tiết đầy đủ'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Giao diện khách hàng nhìn thấy thực tế ngoài website bán lẻ
                                    </p>
                                </div>
                            </div>

                            {/* Bộ chuyển đổi 2 chế độ xem trước */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700">
                                    <button
                                        type="button"
                                        onClick={() => setKieuXemTruoc('card')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                                            kieuXemTruoc === 'card'
                                                ? 'bg-white dark:bg-slate-900 text-[#0052cc] dark:text-cyan-400 shadow-xs border border-blue-200 dark:border-blue-800 scale-[1.02]'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <Layers className="w-3.5 h-3.5" />
                                        <span>1. Thẻ Card</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setKieuXemTruoc('chi_tiet')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                                            kieuXemTruoc === 'chi_tiet'
                                                ? 'bg-white dark:bg-slate-900 text-[#0052cc] dark:text-cyan-400 shadow-xs border border-blue-200 dark:border-blue-800 scale-[1.02]'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <FileText className="w-3.5 h-3.5" />
                                        <span>2. Trang Chi Tiết</span>
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setDangXemTruocCard(false)}
                                    className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
                                    title="Đóng xem trước"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* 2. Nội Dung Xem Trước (Cuộn Độc Lập) */}
                        <div className="flex-1 overflow-y-auto min-h-0 bg-slate-100/70 dark:bg-slate-950/70 p-4 sm:p-6 space-y-6">
                            {kieuXemTruoc === 'card' ? (
                                /* CHẾ ĐỘ 1: XEM THẺ CARD SẢN PHẨM NGOÀI DANH MỤC */
                                <div className="py-8 flex flex-col items-center justify-center">
                                    <div className="relative max-w-[310px] sm:max-w-[330px] w-full">
                                        <TheSanPham sanPham={sanPhamXemTruoc} />
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-5 text-center max-w-md">
                                        💡 Đây là thẻ sản phẩm hiển thị trên Trang Chủ, Trang Danh Mục và Tìm Kiếm.
                                    </p>
                                </div>
                            ) : (
                                /* CHẾ ĐỘ 2: XEM TRANG CHI TIẾT SẢN PHẨM TOÀN DIỆN (1:1 VỚI BÁN LẺ) */
                                <div className="space-y-6">
                                    {/* Breadcrumb Điều Hướng */}
                                    <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap pb-1">
                                        <span className="flex items-center gap-1 font-medium">
                                            <Laptop className="w-3.5 h-3.5" />
                                            <span>Trang Chủ</span>
                                        </span>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                                        <span>Sản Phẩm</span>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                                        <span className="uppercase font-bold text-[#0052cc] dark:text-cyan-400">
                                            {sanPhamXemTruoc.hang_san_xuat}
                                        </span>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                                        <span className="font-semibold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                                            {sanPhamXemTruoc.ten_san_pham}
                                        </span>
                                    </nav>

                                    {/* Khung Chi Tiết 2 Cột: Chuẩn Tỉ Lệ 5 - 7 */}
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                                        {/* CỘT TRÁI (5 Cột): Thư viện ảnh, 3 Cam kết vàng & Đặc điểm nổi bật */}
                                        <div className="lg:col-span-5 space-y-4">
                                            <ThuVienAnhSanPham
                                                danhSachAnh={sanPhamXemTruoc.thu_vien_hinh_anh}
                                                tenSanPham={sanPhamXemTruoc.ten_san_pham}
                                                videoDemo={sanPhamXemTruoc.video_demo}
                                                anhDaiDienTuyChon={tuyChonHienTaiXemTruoc?.hinh_anh}
                                            />

                                            {/* Cam kết Vàng Dưới Gallery */}
                                            <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[11px] text-slate-600 dark:text-slate-400">
                                                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                                                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                                                    <span className="font-bold text-slate-800 dark:text-slate-200">Chính Hãng 100%</span>
                                                </div>
                                                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                                                    <RotateCcw className="w-4 h-4 text-blue-600 dark:text-cyan-400 mx-auto mb-1" />
                                                    <span className="font-bold text-slate-800 dark:text-slate-200">1 Đổi 1 Trong 30N</span>
                                                </div>
                                                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                                                    <Truck className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                                                    <span className="font-bold text-slate-800 dark:text-slate-200">Giao Hỏa Tốc 2H</span>
                                                </div>
                                            </div>

                                            {/* Đặc Điểm Nổi Bật Nằm Dưới Ảnh */}
                                            {dacDiemNoiBatXemTruoc.length > 0 && (
                                                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 space-y-3 shadow-2xs">
                                                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                                                        <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#0052cc] dark:text-cyan-400">
                                                            <Sparkles className="w-3.5 h-3.5" />
                                                        </div>
                                                        <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                                            Đặc Điểm Nổi Bật Đáng Chú Ý
                                                        </h3>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {dacDiemNoiBatXemTruoc.map((dd, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-200 leading-relaxed hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                                                            >
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#0052cc] dark:bg-cyan-400 mt-1.5 shrink-0" />
                                                                <span className="font-medium">{dd}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* CỘT PHẢI (7 Cột): Thông tin mua hàng, Giá, Cấu hình, Quà tặng, Chi nhánh */}
                                        <div className="lg:col-span-7 space-y-4">
                                            {/* Tên & Mã Sản Phẩm */}
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="px-2.5 py-1 rounded-lg bg-[#0052cc] text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                                                        {sanPhamXemTruoc.hang_san_xuat}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-xs font-bold border border-slate-200 dark:border-slate-700">
                                                        SKU: {sanPhamXemTruoc.ma_san_pham || 'CHÍNH HÃNG'}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 ml-auto text-xs">
                                                        <div className="flex items-center gap-0.5 text-amber-500">
                                                            <Star className="w-4 h-4 fill-amber-400" />
                                                            <span className="font-black text-slate-800 dark:text-slate-100">{sanPhamXemTruoc.diem_danh_gia_tb || 5}</span>
                                                        </div>
                                                        <span className="text-slate-400">({sanPhamXemTruoc.so_luong_danh_gia || 16} đánh giá)</span>
                                                        <span className="text-slate-300 dark:text-slate-700">•</span>
                                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                                            {sanPhamXemTruoc.con_hang ? 'Còn hàng trong kho' : 'Hết hàng'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-snug tracking-tight">
                                                    {sanPhamXemTruoc.ten_san_pham}
                                                </h1>
                                            </div>

                                            {/* Hộp Giá Bán & Tiết Kiệm */}
                                            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-red-50/60 via-slate-50/40 to-transparent dark:from-red-950/20 dark:via-slate-900/40 dark:to-transparent border border-red-200/80 dark:border-red-900/30 flex flex-wrap items-center justify-between gap-3">
                                                <div className="flex flex-wrap items-baseline gap-3">
                                                    <div className="text-2xl sm:text-3xl font-black text-[#dc2626] dark:text-[#f87171] tracking-tight">
                                                        {dinhDangTienVND(giaHienTaiXemTruoc)}
                                                    </div>

                                                    {giaGocHienTaiXemTruoc > giaHienTaiXemTruoc && (
                                                        <>
                                                            <div className="text-sm text-slate-400 line-through font-normal">
                                                                {dinhDangTienVND(giaGocHienTaiXemTruoc)}
                                                            </div>
                                                            <span className="px-2 py-0.5 rounded-lg bg-red-600 text-white font-black text-xs shadow-xs">
                                                                -{sanPhamXemTruoc.phan_tram_giam_gia || Math.round((1 - (giaHienTaiXemTruoc / giaGocHienTaiXemTruoc)) * 100)}%
                                                            </span>
                                                        </>
                                                    )}
                                                </div>

                                                {tienTietKiemXemTruoc > 0 && (
                                                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                                        Tiết kiệm {dinhDangTienVND(tienTietKiemXemTruoc)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Chọn Phiên Bản Cấu Hình / Màu Sắc (Tương tác cập nhật giá trực tiếp) */}
                                            {sanPhamXemTruoc.tuy_chon_phien_ban && sanPhamXemTruoc.tuy_chon_phien_ban.length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                                                        <span>TÙY CHỌN PHIÊN BẢN & CẤU HÌNH:</span>
                                                        <span className="text-[11px] font-normal text-slate-400 lowercase">{sanPhamXemTruoc.tuy_chon_phien_ban.length} lựa chọn</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                        {sanPhamXemTruoc.tuy_chon_phien_ban.map((opt, oIdx) => {
                                                            const laChon = tuyChonHienTaiXemTruoc?.ma_tuy_chon
                                                                ? tuyChonHienTaiXemTruoc.ma_tuy_chon === opt.ma_tuy_chon
                                                                : (tuyChonHienTaiXemTruoc?.ten_tuy_chon === opt.ten_tuy_chon || oIdx === 0);
                                                            return (
                                                                <button
                                                                    key={opt.ma_tuy_chon || oIdx}
                                                                    type="button"
                                                                    onClick={() => setTuyChonXemTruoc(opt)}
                                                                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                                                        laChon
                                                                            ? 'border-[#0052cc] bg-blue-50/60 dark:bg-blue-950/40 text-[#0052cc] ring-2 ring-blue-500/20 shadow-xs'
                                                                            : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 bg-white dark:bg-slate-900/60'
                                                                    }`}
                                                                >
                                                                    <div className="font-bold text-xs flex items-center justify-between gap-2">
                                                                        <span className={laChon ? 'text-[#0052cc] dark:text-cyan-400' : 'text-slate-900 dark:text-white'}>
                                                                            {opt.ten_tuy_chon}
                                                                        </span>
                                                                        {laChon && <Check className="w-4 h-4 text-[#0052cc] dark:text-cyan-400 shrink-0" />}
                                                                    </div>
                                                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                                                        {Number(opt.chenh_lech_gia) === 0
                                                                            ? 'Giá niêm yết chuẩn'
                                                                            : Number(opt.chenh_lech_gia) > 0
                                                                            ? `+${dinhDangTienVND(opt.chenh_lech_gia)}`
                                                                            : `${dinhDangTienVND(opt.chenh_lech_gia)}`}
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Quà Tặng Kèm Giá Trị */}
                                            {sanPhamXemTruoc.qua_tang && sanPhamXemTruoc.qua_tang.length > 0 && (
                                                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 dark:border-amber-800/60 space-y-2">
                                                    <div className="flex items-center gap-2 text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                                                        <Gift className="w-4 h-4 text-amber-500 shrink-0" />
                                                        <span>ĐẶC QUYỀN QUÀ TẶNG TNTP (TRỊ GIÁ ĐẾN {dinhDangTienVND(sanPhamXemTruoc.qua_tang.reduce((t, q) => t + (Number(q.gia_tri) || 0), 0))}):</span>
                                                    </div>
                                                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                                                        {sanPhamXemTruoc.qua_tang.map((q, idx) => (
                                                            <li key={idx} className="flex items-start gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                                                <span className="font-medium">{q.ten_qua_tang}</span>
                                                                {Number(q.gia_tri) > 0 && (
                                                                    <span className="text-[10.5px] font-bold text-amber-700 dark:text-amber-400 ml-auto shrink-0">
                                                                        ({dinhDangTienVND(q.gia_tri)})
                                                                    </span>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Các Nút Mua Hàng Nhanh */}
                                            <div className="space-y-2.5 pt-1">
                                                {/* Nút MUA NGAY */}
                                                <div className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#dc2626] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 select-none cursor-default">
                                                    <span>MUA NGAY - GIAO HỎA TỐC 2H</span>
                                                </div>

                                                {/* Cặp Nút: Thêm Giỏ Hàng & Trả Góp 0% */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                    <div className="py-2.5 px-4 rounded-xl bg-[#0052cc] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm select-none cursor-default">
                                                        <ShoppingCart className="w-4 h-4" />
                                                        <span>THÊM VÀO GIỎ HÀNG</span>
                                                    </div>

                                                    <div className="py-2.5 px-4 rounded-xl bg-slate-900 text-white border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 text-center select-none cursor-default">
                                                        <CreditCard className="w-4 h-4 text-amber-400" />
                                                        <span>MUA TRẢ GÓP 0% LÃI SUẤT</span>
                                                    </div>
                                                </div>

                                                {/* Nút So Sánh & Yêu Thích Nhanh */}
                                                <div className="flex items-center gap-2.5 pt-0.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setDaSoSanhXemTruoc(!daSoSanhXemTruoc)}
                                                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                                                            daSoSanhXemTruoc
                                                                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-[#0052cc] dark:text-cyan-400'
                                                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <GitCompare className="w-3.5 h-3.5 text-[#0052cc] dark:text-cyan-400" />
                                                        <span>{daSoSanhXemTruoc ? 'Đã Trong So Sánh' : 'So Sánh Sản Phẩm'}</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setDaThichXemTruoc(!daThichXemTruoc)}
                                                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                                                            daThichXemTruoc
                                                                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-600 dark:text-rose-400'
                                                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <Heart className={`w-3.5 h-3.5 text-rose-500 ${daThichXemTruoc ? 'fill-current' : ''}`} />
                                                        <span>{daThichXemTruoc ? 'Đã Lưu Yêu Thích' : 'Lưu Vào Yêu Thích'}</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Tình Trạng Hàng Tại Showroom */}
                                            <KhoHangChiNhanh danhSachKho={sanPhamXemTruoc.ton_kho} />
                                        </div>
                                    </div>

                                    {/* Tabs Dưới: Mô tả | Thông số kỹ thuật | Đánh giá */}
                                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                                        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                                            <button
                                                type="button"
                                                onClick={() => setTabChiTietXemTruoc('tong_quan')}
                                                className={`px-5 py-2.5 rounded-xl text-xs sm:text-[13.5px] font-bold border transition-all cursor-pointer whitespace-nowrap ${
                                                    tabChiTietXemTruoc === 'tong_quan'
                                                        ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-400 dark:border-cyan-400 text-[#0052cc] dark:text-cyan-400 shadow-2xs'
                                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                Mô tả
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setTabChiTietXemTruoc('thong_so')}
                                                className={`px-5 py-2.5 rounded-xl text-xs sm:text-[13.5px] font-bold border transition-all cursor-pointer whitespace-nowrap ${
                                                    tabChiTietXemTruoc === 'thong_so'
                                                        ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-400 dark:border-cyan-400 text-[#0052cc] dark:text-cyan-400 shadow-2xs'
                                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                Thông số kỹ thuật
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setTabChiTietXemTruoc('danh_gia')}
                                                className={`px-5 py-2.5 rounded-xl text-xs sm:text-[13.5px] font-bold border transition-all cursor-pointer whitespace-nowrap ${
                                                    tabChiTietXemTruoc === 'danh_gia'
                                                        ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-400 dark:border-cyan-400 text-[#0052cc] dark:text-cyan-400 shadow-2xs'
                                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                Đánh giá ({sanPhamXemTruoc.so_luong_danh_gia || 16})
                                            </button>
                                        </div>

                                        {tabChiTietXemTruoc === 'tong_quan' && (
                                            <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                                                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-[#0052cc] dark:text-cyan-400" />
                                                    <span>Trải Nghiệm & Đánh Giá Chuyên Sâu Từ TNTP LAPTOP</span>
                                                </h3>
                                                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-line">
                                                    {sanPhamXemTruoc.mo_ta_chi_tiet || 'Sản phẩm chính hãng với cấu hình mạnh mẽ, hiệu năng xuất sắc và độ bền bỉ cao đáp ứng trọn vẹn mọi nhu cầu làm việc và giải trí.'}
                                                </p>
                                                <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200 space-y-1.5">
                                                    <p className="font-bold">✦ Đặc quyền cam kết chất lượng dịch vụ TNTP:</p>
                                                    <p>
                                                        Toàn bộ thiết bị đều trải qua quy trình kiểm định 18 bước tiêu chuẩn trước khi tới tay khách hàng. Đổi mới 1-1 trong 30 ngày nếu phát sinh lỗi phần cứng, bảo hành chính hãng 24 tháng kèm dịch vụ bảo dưỡng, vệ sinh trọn đời trên toàn quốc.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {tabChiTietXemTruoc === 'thong_so' && (
                                            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-2 sm:p-4 bg-white dark:bg-slate-900 shadow-2xs">
                                                <BangThongSoKyThuat thongSo={sanPhamXemTruoc.thong_so} sanPham={sanPhamXemTruoc} />
                                            </div>
                                        )}

                                        {tabChiTietXemTruoc === 'danh_gia' && (
                                            <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                                    <h4 className="font-black text-sm text-slate-900 dark:text-white uppercase">
                                                        Đánh Giá Thực Tế Từ Khách Hàng ({sanPhamXemTruoc.danh_gia?.length || 2})
                                                    </h4>
                                                    <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                                                        <Star className="w-4 h-4 fill-amber-400" />
                                                        <span>{sanPhamXemTruoc.diem_danh_gia_tb || 5} / 5</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    {(sanPhamXemTruoc.danh_gia || []).map((dg, idx) => (
                                                        <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-bold text-slate-900 dark:text-slate-100">{dg.ten_nguoi_dung}</span>
                                                                <span className="text-[11px] text-slate-400">{dg.ngay_danh_gia || 'Gần đây'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-amber-400">
                                                                {[...Array(dg.so_sao || 5)].map((_, i) => (
                                                                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                                                                ))}
                                                            </div>
                                                            <p className="font-bold text-slate-800 dark:text-slate-200">{dg.tieu_de}</p>
                                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{dg.noi_dung}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. Footer Modal Xem Trước */}
                        <div className="w-full px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 dark:bg-slate-900 shrink-0">
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Giao diện đang phản ánh chính xác các thông tin và thông số bạn vừa cập nhật</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setDangXemTruocCard(false)}
                                    className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-black text-slate-700 dark:text-slate-300 cursor-pointer transition-all active:scale-95"
                                >
                                    Quay Lại Chỉnh Sửa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL PHÓNG TO ẢNH SẢN PHẨM & XEM MÀU SẮC BIẾN THỂ (LIGHTBOX ZOOM) */}
            {/* ========================================================================= */}
            {modalXemAnh && (
                <div
                    className="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
                    onClick={() => setModalXemAnh(null)}
                >
                    <div
                        className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase">
                                        {modalXemAnh.hang || 'Sản Phẩm'}
                                    </span>
                                    <span className="font-mono text-xs font-bold text-slate-400">
                                        {modalXemAnh.sku}
                                    </span>
                                </div>
                                <h3 className="font-black text-sm text-slate-900 dark:text-white truncate mt-0.5">
                                    {modalXemAnh.ten}
                                </h3>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                {modalXemAnh.gia > 0 && (
                                    <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                                        {dinhDangTienVND(modalXemAnh.gia)}
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setModalXemAnh(null)}
                                    className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Image Preview Container with high-res viewport */}
                        <div className="relative flex-1 bg-gradient-to-b from-slate-100 to-white dark:from-slate-950 dark:to-slate-900 p-6 flex items-center justify-center min-h-[320px] max-h-[500px] overflow-hidden">
                            <img
                                src={modalXemAnh.url}
                                alt={modalXemAnh.ten}
                                className="max-h-full max-w-full object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-105"
                                onError={(e) => { e.currentTarget.src = '/images/sp/asus_rog_scar18.jpg'; }}
                            />
                        </div>

                        {/* Variant Switcher if product has colors/variants */}
                        {modalXemAnh.variants && modalXemAnh.variants.length > 0 && (
                            <div className="p-3.5 px-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800">
                                <div className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                                    <Palette className="w-3.5 h-3.5 text-purple-600" />
                                    <span>Chọn màu sắc / biến thể để xem ảnh riêng ({modalXemAnh.variants.length} màu):</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {modalXemAnh.variants.map((v, i) => (
                                        <button
                                            key={v.ma_tuy_chon || i}
                                            type="button"
                                            onClick={() => {
                                                if (v.hinh_anh) {
                                                    setModalXemAnh({ ...modalXemAnh, url: v.hinh_anh, tenBienThe: v.ten_tuy_chon });
                                                }
                                            }}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                                                modalXemAnh.url === v.hinh_anh
                                                    ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-purple-400'
                                            }`}
                                        >
                                            {v.hinh_anh && (
                                                <img src={v.hinh_anh} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" />
                                            )}
                                            <span>{v.ten_tuy_chon}</span>
                                            {v.chenh_lech_gia !== 0 && (
                                                <span className="text-[10px] opacity-80">
                                                    ({v.chenh_lech_gia > 0 ? '+' : ''}{dinhDangTienVND(v.chenh_lech_gia)})
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer Controls */}
                        <div className="p-3 px-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium">
                                Phóng to chi tiết ảnh sản phẩm
                            </span>
                            <div className="flex items-center gap-2">
                                <a
                                    href={modalXemAnh.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-1.5 transition-colors"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>Mở ảnh gốc</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setModalXemAnh(null)}
                                    className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-opacity"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL 2: TẠO / SỬA ĐƠN HÀNG */}
            {/* ========================================================================= */}
            {dangMoModalDonHang && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
                        <div className="shrink-0 bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-black !text-white">{donHangDangSua ? 'Cập Nhật Đơn Hàng' : 'Tạo Đơn Hàng Mới'}</h3>
                                <p className="text-xs text-orange-100 font-semibold">Nhập thông tin khách hàng và chọn sản phẩm</p>
                            </div>
                            <button
                                onClick={() => !dangLuuDonHang && setDangMoModalDonHang(false)}
                                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={xuLyLuuDonHang} className="flex flex-col flex-1 min-h-0">
                            <div className="flex-1 overflow-y-auto p-6 space-y-3.5 text-xs">
                                <div className="grid grid-cols-2 gap-3.5">
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Khách Hàng *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formDonHang.ho_ten}
                                            onChange={(e) => setFormDonHang({ ...formDonHang, ho_ten: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Số Điện Thoại *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formDonHang.so_dien_thoai}
                                            onChange={(e) => setFormDonHang({ ...formDonHang, so_dien_thoai: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700 dark:text-slate-300">Địa Chỉ Nhận Hàng *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formDonHang.dia_chi_chi_tiet}
                                        onChange={(e) => setFormDonHang({ ...formDonHang, dia_chi_chi_tiet: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-3.5 pt-1">
                                    <div className="col-span-2 space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Chọn Sản Phẩm *</label>
                                        <select
                                            value={formDonHang.san_pham_id}
                                            onChange={(e) => setFormDonHang({ ...formDonHang, san_pham_id: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                                        >
                                            {danhSachSanPham.map(sp => (
                                                <option key={sp.id || sp._id} value={sp.id || sp._id}>
                                                    {sp.ten_san_pham} ({dinhDangTienVND(sp.gia_khuyen_mai)})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Số Lượng</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formDonHang.so_luong}
                                            onChange={(e) => setFormDonHang({ ...formDonHang, so_luong: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black text-center"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3.5">
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Thanh Toán</label>
                                        <select
                                            value={formDonHang.hinh_thuc_thanh_toan}
                                            onChange={(e) => setFormDonHang({ ...formDonHang, hinh_thuc_thanh_toan: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                                        >
                                            <option value="chuyen_khoan_vietqr">VietQR Chuyển Khoản</option>
                                            <option value="thanh_toan_khi_nhan_hang_cod">COD (Khi nhận hàng)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Mã Voucher</label>
                                        <input
                                            type="text"
                                            placeholder="Mã giảm giá..."
                                            value={formDonHang.ma_giam_gia}
                                            onChange={(e) => setFormDonHang({ ...formDonHang, ma_giam_gia: e.target.value.toUpperCase() })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-black"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pinned Footer */}
                            <div className="shrink-0 p-4 px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    disabled={dangLuuDonHang}
                                    onClick={() => setDangMoModalDonHang(false)}
                                    className={`px-5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all ${dangLuuDonHang ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={dangLuuDonHang}
                                    className={`px-6 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center gap-2 shadow-md shadow-orange-500/25 transition-all ${dangLuuDonHang ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    {dangLuuDonHang ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    <span>{dangLuuDonHang ? 'Đang lưu đơn hàng...' : 'Lưu Đơn Hàng'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL 3: THÊM / SỬA THƯƠNG HIỆU */}
            {/* ========================================================================= */}
            {dangMoModalDanhMuc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
                        <div className="shrink-0 bg-gradient-to-r from-purple-700 to-pink-700 text-white p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-black !text-white">{dmDangSua ? 'Chỉnh Sửa Thương Hiệu' : 'Thêm Thương Hiệu Mới'}</h3>
                                <p className="text-xs text-purple-100 font-medium">Cấu hình thông tin hãng sản xuất trên hệ thống</p>
                            </div>
                            <button
                                onClick={() => !dangLuuDanhMuc && setDangMoModalDanhMuc(false)}
                                className="p-2 rounded-full bg-white/20 hover:bg-white/30 cursor-pointer transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={xuLyLuuDanhMuc} className="flex flex-col flex-1 min-h-0">
                            <div className="flex-1 overflow-y-auto p-6 space-y-3.5 text-xs">
                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700 dark:text-slate-300">Tên Thương Hiệu *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ví dụ: ASUS, Dell, Lenovo, Apple, MSI..."
                                        value={formDm.ten_danh_muc}
                                        onChange={(e) => setFormDm({ ...formDm, ten_danh_muc: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3.5">
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Mã Slug / Code *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="asus"
                                            value={formDm.ma_danh_muc}
                                            onChange={(e) => setFormDm({ ...formDm, ma_danh_muc: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Biểu Tượng (Icon / Emoji)</label>
                                        <input
                                            type="text"
                                            placeholder="💻 / 🎮 / ⚡"
                                            value={formDm.logo || '💻'}
                                            onChange={(e) => setFormDm({ ...formDm, logo: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-center text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700 dark:text-slate-300">Xuất Xứ / Ghi Chú</label>
                                    <input
                                        type="text"
                                        placeholder="Mỹ, Đài Loan, Chính Hãng..."
                                        value={formDm.xuat_xu}
                                        onChange={(e) => setFormDm({ ...formDm, xuat_xu: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700 dark:text-slate-300">Mô Tả Giới Thiệu</label>
                                    <textarea
                                        rows="2"
                                        value={formDm.mo_ta}
                                        onChange={(e) => setFormDm({ ...formDm, mo_ta: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs"
                                    />
                                </div>
                            </div>

                            {/* Pinned Footer */}
                            <div className="shrink-0 p-4 px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    disabled={dangLuuDanhMuc}
                                    onClick={() => setDangMoModalDanhMuc(false)}
                                    className={`px-5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all ${dangLuuDanhMuc ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={dangLuuDanhMuc}
                                    className={`px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-2 shadow-md shadow-purple-500/25 transition-all ${dangLuuDanhMuc ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    {dangLuuDanhMuc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    <span>{dangLuuDanhMuc ? 'Đang lưu...' : (dmDangSua ? 'Lưu Thay Đổi' : 'Thêm Mới')}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL 4: THÊM / SỬA KHÁCH HÀNG */}
            {/* ========================================================================= */}
            {dangMoModalUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
                        <div className="shrink-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-black !text-white">{userDangSua ? 'Cập Nhật Tài Khoản' : 'Thêm Tài Khoản Mới'}</h3>
                                <p className="text-xs text-emerald-100 font-medium">Thiết lập thông tin thành viên và phân quyền hệ thống</p>
                            </div>
                            <button
                                onClick={() => !dangLuuUser && setDangMoModalUser(false)}
                                className="p-2 rounded-full bg-white/20 hover:bg-white/30 cursor-pointer transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={xuLyLuuUser} className="flex flex-col flex-1 min-h-0">
                            <div className="flex-1 overflow-y-auto p-6 space-y-3.5 text-xs">
                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700 dark:text-slate-300">Họ Và Tên *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formUser.hoTen}
                                        onChange={(e) => setFormUser({ ...formUser, hoTen: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700 dark:text-slate-300">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formUser.email}
                                        onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700 dark:text-slate-300">Số Điện Thoại</label>
                                    <input
                                        type="text"
                                        value={formUser.soDienThoai}
                                        onChange={(e) => setFormUser({ ...formUser, soDienThoai: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold font-mono"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3.5">
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Hạng Thành Viên</label>
                                        <select
                                            value={formUser.hangThanhVien}
                                            onChange={(e) => setFormUser({ ...formUser, hangThanhVien: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                                        >
                                            <option value="Đồng">Đồng</option>
                                            <option value="Bạc">Bạc</option>
                                            <option value="Vàng">Vàng</option>
                                            <option value="Bạch Kim">Bạch Kim</option>
                                            <option value="Kim Cương">Kim Cương</option>
                                            <option value="VIP Gold">VIP Gold</option>
                                            <option value="VIP Platinum">VIP Platinum</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Vai Trò</label>
                                        <select
                                            value={formUser.vaiTro}
                                            onChange={(e) => setFormUser({ ...formUser, vaiTro: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black"
                                        >
                                            <option value="khach_hang">Khách Hàng</option>
                                            <option value="admin">👑 Quản Trị</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700 dark:text-slate-300">Trạng Thái Tài Khoản</label>
                                    <select
                                        value={formUser.trangThai || (formUser.biKhoa ? 'bi_khoa' : 'hoat_dong')}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setFormUser({
                                                ...formUser,
                                                trangThai: val,
                                                biKhoa: val === 'bi_khoa',
                                                lyDoKhoa: val === 'bi_khoa' ? (formUser.lyDoKhoa || 'Quản trị viên tạm khóa tài khoản') : ''
                                            });
                                        }}
                                        className={`w-full px-3.5 py-2.5 rounded-xl border font-bold ${
                                            (formUser.trangThai === 'bi_khoa' || formUser.biKhoa)
                                                ? 'border-red-400 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-300'
                                                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
                                        }`}
                                    >
                                        <option value="hoat_dong">🟢 Đang Hoạt Động (Bình Thường)</option>
                                        <option value="bi_khoa">🔒 Khóa Tạm Thời (Chặn Đăng Nhập)</option>
                                    </select>
                                </div>

                                {(formUser.trangThai === 'bi_khoa' || formUser.biKhoa) && (
                                    <div className="space-y-1 animate-in fade-in">
                                        <label className="font-bold text-red-600 dark:text-red-400">Lý Do Khóa Tài Khoản</label>
                                        <input
                                            type="text"
                                            value={formUser.lyDoKhoa || ''}
                                            onChange={(e) => setFormUser({ ...formUser, lyDoKhoa: e.target.value })}
                                            placeholder="Ví dụ: Vi phạm chính sách / Nghi ngờ spam..."
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-950/20 text-red-900 dark:text-red-200 font-medium"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Pinned Footer */}
                            <div className="shrink-0 p-4 px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    disabled={dangLuuUser}
                                    onClick={() => setDangMoModalUser(false)}
                                    className={`px-5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all ${dangLuuUser ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={dangLuuUser}
                                    className={`px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-md shadow-emerald-500/25 transition-all ${dangLuuUser ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    {dangLuuUser ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    <span>{dangLuuUser ? 'Đang lưu tài khoản...' : (userDangSua ? 'Lưu Thay Đổi' : 'Thêm Tài Khoản')}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL 5: THÊM / SỬA VOUCHER */}
            {/* ========================================================================= */}
            {dangMoModalVoucher && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
                        <div className="shrink-0 bg-gradient-to-r from-rose-600 to-red-600 text-white p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-black !text-white">{voucherDangSua ? 'Sửa Mã Khuyến Mãi' : 'Tạo Voucher Khuyến Mãi Mới'}</h3>
                                <p className="text-xs text-rose-100 font-semibold">Thiết lập mã giảm giá, giới hạn số lượng và thời hạn áp dụng</p>
                            </div>
                            <button
                                onClick={() => !dangLuuVoucher && setDangMoModalVoucher(false)}
                                className="p-2 rounded-full bg-white/20 hover:bg-white/30 cursor-pointer transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={xuLyLuuVoucher} className="flex flex-col flex-1 min-h-0">
                            <div className="flex-1 overflow-y-auto p-6 space-y-3.5 text-xs">
                                <div className="grid grid-cols-2 gap-3.5">
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Mã CODE Khuyến Mãi *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="SALE2026 / TRIKUNVIP..."
                                            value={formVoucher.ma_code}
                                            onChange={(e) => setFormVoucher({ ...formVoucher, ma_code: e.target.value.toUpperCase() })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-black text-rose-600 uppercase text-xs"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Hình Thức Giảm Giá</label>
                                        <select
                                            value={formVoucher.loai_giam}
                                            onChange={(e) => setFormVoucher({ ...formVoucher, loai_giam: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
                                        >
                                            <option value="tien_mat">💵 Giảm tiền mặt (VNĐ)</option>
                                            <option value="phan_tram">📊 Giảm theo phần trăm (%)</option>
                                            <option value="freeship">🚚 Freeship (Miễn phí ship)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700 dark:text-slate-300">Tên / Tiêu Đề Voucher *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ưu đãi sinh viên / Tri ân khách hàng..."
                                        value={formVoucher.tieu_de}
                                        onChange={(e) => setFormVoucher({ ...formVoucher, tieu_de: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3.5">
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">
                                            {formVoucher.loai_giam === 'phan_tram' ? 'Phần Trăm Giảm (%) *' : 'Số Tiền Giảm (VNĐ) *'}
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={formVoucher.gia_tri_giam}
                                            onChange={(e) => setFormVoucher({ ...formVoucher, gia_tri_giam: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-black text-red-600 text-xs"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Đơn Hàng Tối Thiểu (VNĐ)</label>
                                        <input
                                            type="number"
                                            value={formVoucher.don_hang_toi_thieu}
                                            onChange={(e) => setFormVoucher({ ...formVoucher, don_hang_toi_thieu: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3.5">
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Số Lượng Phát Hành</label>
                                        <input
                                            type="number"
                                            value={formVoucher.so_luong_phat_hanh || 20}
                                            onChange={(e) => setFormVoucher({ ...formVoucher, so_luong_phat_hanh: Number(e.target.value) })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-black text-emerald-600 text-xs"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Ngày Hết Hạn</label>
                                        <input
                                            type="date"
                                            value={formVoucher.ngay_het_han || '2026-12-31'}
                                            onChange={(e) => setFormVoucher({ ...formVoucher, ngay_het_han: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3.5">
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Chuyên Mục Áp Dụng</label>
                                        <select
                                            value={formVoucher.chuyen_muc || 'toan_san'}
                                            onChange={(e) => setFormVoucher({ ...formVoucher, chuyen_muc: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
                                        >
                                            <option value="toan_san">🌐 Toàn Sàn</option>
                                            <option value="laptop">💻 Laptop Thường</option>
                                            <option value="gaming">🎮 Laptop Gaming</option>
                                            <option value="sinh_vien">🎓 Sinh Viên / VP</option>
                                            <option value="phu_kien">🎧 Phụ Kiện / Gear</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Tone Màu Thẻ</label>
                                        <select
                                            value={formVoucher.mau_sac || 'rose'}
                                            onChange={(e) => setFormVoucher({ ...formVoucher, mau_sac: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
                                        >
                                            <option value="rose">🔴 Đỏ Thắm (Rose)</option>
                                            <option value="blue">🔵 Xanh Dương (Blue)</option>
                                            <option value="orange">🟠 Cam Cháy (Orange)</option>
                                            <option value="purple">🟣 Tím Neon (Purple)</option>
                                            <option value="emerald">🟢 Xanh Lục (Emerald)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Nhãn Badge Nổi Bật</label>
                                        <input
                                            type="text"
                                            placeholder="HOT DEAL / VIP..."
                                            value={formVoucher.badge || ''}
                                            onChange={(e) => setFormVoucher({ ...formVoucher, badge: e.target.value.toUpperCase() })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs uppercase"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700 dark:text-slate-300">Mô Tả Chi Tiết Điều Kiện Áp Dụng</label>
                                    <textarea
                                        rows="2"
                                        value={formVoucher.mo_ta}
                                        onChange={(e) => setFormVoucher({ ...formVoucher, mo_ta: e.target.value })}
                                        placeholder="Áp dụng cho khách hàng mua laptop..."
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs"
                                    />
                                </div>
                            </div>

                            {/* Pinned Footer */}
                            <div className="shrink-0 p-4 px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    disabled={dangLuuVoucher}
                                    onClick={() => setDangMoModalVoucher(false)}
                                    className={`px-5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all ${dangLuuVoucher ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={dangLuuVoucher}
                                    className={`px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-2 shadow-md shadow-rose-500/25 transition-all ${dangLuuVoucher ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    {dangLuuVoucher ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    <span>{dangLuuVoucher ? 'Đang lưu voucher...' : (voucherDangSua ? 'Lưu Thay Đổi' : 'Lưu Voucher')}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL 6: CHI TIẾT & IN HÓA ĐƠN */}
            {/* ========================================================================= */}
            {/* MODAL 6: CHI TIẾT ĐƠN HÀNG & PHIẾU SOẠN XUẤT KHO TOÀN DIỆN */}
            {/* ========================================================================= */}
            {donHangChiTiet && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
                        {/* 1. Header Đơn Hàng (Tone Sáng Tinh Tế & Dễ Đọc Chữ) */}
                        <div className="shrink-0 bg-gradient-to-r from-sky-50 via-slate-50 to-indigo-50/80 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 p-4 sm:p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 border border-blue-200/80 dark:border-blue-800">
                                        <Package className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                        Chi Tiết Đơn Hàng & Phiếu Xuất Kho
                                    </span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-mono font-black mt-1 text-slate-900 dark:text-white flex items-center gap-2">
                                    <span>{donHangChiTiet.ma_don_hang}</span>
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => inHoaDonBanHang(donHangChiTiet, danhSachSanPham)}
                                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 !text-white cursor-pointer transition-all shadow-xs hover:shadow-md flex items-center gap-1.5 text-xs font-black"
                                    title="In hóa đơn bán hàng chuẩn xịn"
                                >
                                    <Printer className="w-4 h-4 !text-white" />
                                    <span className="hidden sm:inline !text-white">In Phiếu Hóa Đơn</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDonHangChiTiet(null)}
                                    className="p-2 rounded-xl bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 cursor-pointer transition-colors"
                                    title="Đóng modal"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* 2. Scrollable Body */}
                        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
                            {/* Thanh Meta 3 Thẻ: Thời gian - Trạng thái giao - Chỉ dẫn thu tiền COD */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                        Thời Gian Đặt Hàng
                                    </span>
                                    <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white font-mono">
                                        {donHangChiTiet.ngay_tao || (donHangChiTiet.createdAt ? new Date(donHangChiTiet.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : '23/08/2026')}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                        <Truck className="w-3.5 h-3.5 text-amber-600" />
                                        Trạng Thái Giao Hàng
                                    </span>
                                    <div>
                                        <span className={`px-2.5 py-1 rounded-xl text-xs font-black inline-flex items-center gap-1.5 border ${
                                            donHangChiTiet.trang_thai === 'da_giao'
                                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                                                : donHangChiTiet.trang_thai === 'dang_giao'
                                                ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800'
                                                : donHangChiTiet.trang_thai === 'da_xac_nhan'
                                                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                                                : donHangChiTiet.trang_thai === 'da_huy'
                                                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                                                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                                        }`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                            {donHangChiTiet.trang_thai === 'da_giao' ? 'Giao thành công' :
                                             donHangChiTiet.trang_thai === 'dang_giao' ? 'Đang giao hàng' :
                                             donHangChiTiet.trang_thai === 'da_xac_nhan' ? 'Đã xác nhận đơn' :
                                             donHangChiTiet.trang_thai === 'da_huy' ? 'Đã hủy đơn' : 'Chờ xác nhận'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                        <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                                        Chỉ Dẫn Thu Tiền (Shipper)
                                    </span>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {donHangChiTiet.da_thanh_toan ? (
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                                <span>✓ ĐÃ THANH TOÁN (KHÔNG THU TIỀN)</span>
                                            </div>
                                        ) : donHangChiTiet.hinh_thuc_thanh_toan === 'chuyen_khoan_vietqr' ? (
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                                                <span>⏳ CHỜ CHUYỂN KHOẢN: {dinhDangTienVND(donHangChiTiet.tong_tien_thanh_toan)}</span>
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-800">
                                                <span>⚠️ CẦN THU COD: {dinhDangTienVND(donHangChiTiet.tong_tien_thanh_toan)}</span>
                                            </div>
                                        )}

                                        {/* Nút Admin chuyển đổi trạng thái thanh toán thủ công */}
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                const donId = donHangChiTiet.id || donHangChiTiet._id || donHangChiTiet.ma_don_hang;
                                                const newStatus = !donHangChiTiet.da_thanh_toan;
                                                await xuLyDoiTrangThaiThanhToan(donId, newStatus, donHangChiTiet.hinh_thuc_thanh_toan);
                                                setDonHangChiTiet(prev => prev ? ({ ...prev, da_thanh_toan: newStatus }) : null);
                                            }}
                                            className="px-2.5 py-1 rounded-xl text-[11px] font-black border transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-amber-500 hover:text-amber-600"
                                        >
                                            {donHangChiTiet.da_thanh_toan ? '↩️ Đổi sang Chưa thanh toán' : '✅ Đánh dấu Đã thanh toán (Thủ công)'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Thông Tin Khách Hàng & Giao Hàng */}
                            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                                <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-slate-200/80 dark:border-slate-700">
                                    <MapPin className="w-4 h-4 text-rose-600" />
                                    Thông Tin Giao Nhận Khách Hàng
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-indigo-600 shrink-0" />
                                            <span className="text-slate-500 dark:text-slate-400 font-bold">Người nhận:</span>
                                            <span className="font-black text-slate-900 dark:text-white text-sm">
                                                {donHangChiTiet.thong_tin_giao_hang?.ho_ten || donHangChiTiet.thong_tin_giao_hang?.ho_va_ten || 'Khách hàng vãng lai'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span className="text-slate-500 dark:text-slate-400 font-bold">Điện thoại:</span>
                                            <a href={`tel:${donHangChiTiet.thong_tin_giao_hang?.so_dien_thoai}`} className="font-mono font-black text-blue-600 dark:text-blue-400 hover:underline text-sm">
                                                {donHangChiTiet.thong_tin_giao_hang?.so_dien_thoai || 'Chưa cập nhật'}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                                            <span className="text-slate-500 dark:text-slate-400 font-bold">Email:</span>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                                {donHangChiTiet.thong_tin_giao_hang?.email || 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                            <div>
                                                <span className="text-slate-500 dark:text-slate-400 font-bold block">Địa chỉ giao:</span>
                                                <span className="font-extrabold text-slate-900 dark:text-white leading-relaxed block text-xs sm:text-sm">
                                                    {donHangChiTiet.thong_tin_giao_hang?.dia_chi_chi_tiet || 'Nhận trực tiếp tại showroom'}
                                                </span>
                                                {donHangChiTiet.thong_tin_giao_hang?.tinh_thanh && (
                                                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mt-0.5">
                                                        Khu vực: {donHangChiTiet.thong_tin_giao_hang?.quan_huyen ? `${donHangChiTiet.thong_tin_giao_hang.quan_huyen}, ` : ''}{donHangChiTiet.thong_tin_giao_hang?.tinh_thanh}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Ghi chú soạn hàng của khách */}
                                {donHangChiTiet.thong_tin_giao_hang?.ghi_chu && (
                                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 dark:border-amber-600 rounded-r-xl flex items-start gap-2.5 text-xs">
                                        <MessageSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-black text-amber-900 dark:text-amber-200">Ghi chú từ khách hàng: </span>
                                            <span className="font-bold text-amber-800 dark:text-amber-300">"{donHangChiTiet.thong_tin_giao_hang.ghi_chu}"</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Danh Sách Mặt Hàng Xuất Kho */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                                        <Boxes className="w-4 h-4 text-blue-600" />
                                        Danh Sách Mặt Hàng Chuẩn Bị Xuất Kho
                                    </h4>
                                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-black text-xs">
                                        {donHangChiTiet.danh_sach_san_pham?.length || 0} sản phẩm
                                    </span>
                                </div>

                                <div className="space-y-2.5">
                                    {donHangChiTiet.danh_sach_san_pham?.map((item, idx) => {
                                        const spGoc = danhSachSanPham.find(p =>
                                            p.id === (item.san_pham_id || item.id_san_pham) ||
                                            p._id === (item.san_pham_id || item.id_san_pham) ||
                                            p.ma_san_pham === (item.san_pham_id || item.id_san_pham) ||
                                            p.ten_san_pham === item.ten_san_pham
                                        ) || item.san_pham || {};

                                        const hinhAnh = item.hinh_anh || spGoc.hinh_anh_chinh || spGoc.hinh_anh || '/images/sp/dell_xps_16.jpg';
                                        const donGia = item.gia_tai_thoi_diem_them || item.don_gia || spGoc.gia_khuyen_mai || 0;
                                        const thanhTien = donGia * (item.so_luong || 1);

                                        return (
                                            <div key={idx} className="flex items-start justify-between gap-3.5 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs hover:border-blue-300 transition-colors">
                                                <div className="flex items-start gap-3.5 min-w-0">
                                                    {/* Ảnh sản phẩm */}
                                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700 shrink-0 relative flex items-center justify-center overflow-hidden shadow-inner">
                                                        <Image
                                                            src={hinhAnh}
                                                            alt={item.ten_san_pham || 'Sản phẩm'}
                                                            fill
                                                            className="object-contain p-1"
                                                            unoptimized
                                                        />
                                                    </div>

                                                    {/* Thông tin chuẩn bị hàng */}
                                                    <div className="min-w-0 space-y-1">
                                                        <div className="font-black text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                                                            {item.ten_san_pham || spGoc.ten_san_pham}
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-1.5">
                                                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono font-bold text-[10px]">
                                                                SKU: {spGoc.ma_san_pham || item.san_pham_id || 'SKU-STORE'}
                                                            </span>
                                                            {spGoc.hang_san_xuat && (
                                                                <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-black text-[10px] uppercase">
                                                                    {spGoc.hang_san_xuat}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Thông số cấu hình tóm tắt để lấy đúng mã */}
                                                        {spGoc.thong_so && (
                                                            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold line-clamp-1">
                                                                ⚙️ {spGoc.thong_so.cpu ? `${spGoc.thong_so.cpu} • ` : ''}
                                                                {spGoc.thong_so.ram ? `${spGoc.thong_so.ram} • ` : ''}
                                                                {spGoc.thong_so.o_cung ? `${spGoc.thong_so.o_cung} • ` : ''}
                                                                {spGoc.thong_so.switch ? `${spGoc.thong_so.switch} • ` : ''}
                                                                {spGoc.thong_so.cam_bien || spGoc.thong_so.cong_suat_tong || ''}
                                                            </div>
                                                        )}

                                                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                                                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                                            <span>Bảo hành: {spGoc.thong_so?.che_do_bao_hanh || '24 tháng chính hãng'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Số lượng & Đơn giá */}
                                                <div className="text-right shrink-0 space-y-1">
                                                    <div className="px-3 py-1 rounded-xl bg-blue-600 text-white font-black text-xs sm:text-sm shadow-xs inline-block">
                                                        x{item.so_luong || 1} cái
                                                    </div>
                                                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                                        {dinhDangTienVND(donGia)} / cái
                                                    </div>
                                                    <div className="font-black text-sm sm:text-base text-red-600 dark:text-red-400">
                                                        {dinhDangTienVND(thanhTien)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Bảng Tính Tiền & Thanh Toán */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                                    <span>Tạm tính tiền hàng:</span>
                                    <span className="font-mono text-slate-900 dark:text-white font-black">{dinhDangTienVND(donHangChiTiet.tam_tinh || donHangChiTiet.tong_tien_thanh_toan)}</span>
                                </div>

                                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                                    <span>Phí giao hàng:</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-black">0 đ (Miễn phí vận chuyển)</span>
                                </div>

                                {donHangChiTiet.tien_giam_gia > 0 && (
                                    <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400">
                                        <span>Giảm giá Voucher {donHangChiTiet.ma_giam_gia ? `(${donHangChiTiet.ma_giam_gia})` : ''}:</span>
                                        <span className="font-mono font-black">-{dinhDangTienVND(donHangChiTiet.tien_giam_gia)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-sm sm:text-base text-red-600 dark:text-red-400 pt-2.5 border-t border-slate-200 dark:border-slate-700 font-black">
                                    <span>TỔNG THANH TOÁN:</span>
                                    <span className="text-lg sm:text-xl font-mono">{dinhDangTienVND(donHangChiTiet.tong_tien_thanh_toan)}</span>
                                </div>

                                <div className={`flex justify-between items-center p-2.5 rounded-xl font-black text-xs sm:text-sm mt-2 border ${
                                    donHangChiTiet.da_thanh_toan
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                                }`}>
                                    <span>{donHangChiTiet.da_thanh_toan ? '✓ Trạng thái thanh toán:' : '⚠️ Tiền mặt bưu tá cần thu (COD):'}</span>
                                    <span className="font-mono text-sm sm:text-base">
                                        {donHangChiTiet.da_thanh_toan ? '0 đ (Đã thanh toán 100%)' : dinhDangTienVND(donHangChiTiet.tong_tien_thanh_toan)}
                                    </span>
                                </div>
                            </div>

                            {/* Lịch trình tiến độ đơn hàng - Gọn gàng, thẩm mỹ, trực quan */}
                            {(() => {
                                const trangThai = donHangChiTiet.trang_thai || 'da_giao';
                                const logs = donHangChiTiet.lich_trinh_giao_hang || [];

                                const logDatHang = logs.find(l => l.tieu_de?.toLowerCase().includes('đặt hàng')) || logs[0];
                                const logXacNhan = logs.find(l => l.tieu_de?.toLowerCase().includes('xác nhận') || l.tieu_de?.toLowerCase().includes('đóng gói'));
                                const logVanChuyen = logs.find(l => l.tieu_de?.toLowerCase().includes('vận chuyển') || l.tieu_de?.toLowerCase().includes('bàn giao'));
                                const logGiaoHang = logs.find(l => l.tieu_de?.toLowerCase().includes('giao hàng') || l.tieu_de?.toLowerCase().includes('thành công')) || (logs.length > 1 ? logs[logs.length - 1] : null);

                                const rutGonThoiGian = (str) => {
                                    if (!str) return '';
                                    try {
                                        if (str.includes('T') || (str.includes('-') && str.length >= 10)) {
                                            const d = new Date(str);
                                            if (!isNaN(d.getTime())) {
                                                const hh = String(d.getHours()).padStart(2, '0');
                                                const mm = String(d.getMinutes()).padStart(2, '0');
                                                const dd = String(d.getDate()).padStart(2, '0');
                                                const MM = String(d.getMonth() + 1).padStart(2, '0');
                                                return `${hh}:${mm} ${dd}/${MM}`;
                                            }
                                        }
                                    } catch {}
                                    return str.replace(/\/202\d/, '').trim();
                                };

                                const thoiGianDat = rutGonThoiGian(logDatHang?.thoi_gian || donHangChiTiet.ngay_tao);
                                const thoiGianGiao = rutGonThoiGian(logGiaoHang?.thoi_gian || (trangThai === 'da_giao' ? '15:20 23/08' : null));

                                const buocHienTai = 
                                    trangThai === 'da_giao' ? 4 :
                                    trangThai === 'dang_giao' ? 3 :
                                    trangThai === 'da_xac_nhan' ? 2 : 
                                    trangThai === 'da_huy' ? 0 : 1;

                                const cacBuocTienTrinh = [
                                    {
                                        buoc: 1,
                                        tieu_de: 'Đặt đơn',
                                        thoi_gian: thoiGianDat || 'Thành công',
                                    },
                                    {
                                        buoc: 2,
                                        tieu_de: 'Duyệt & Gói',
                                        thoi_gian: rutGonThoiGian(logXacNhan?.thoi_gian) || (buocHienTai >= 2 ? 'Đã đóng gói' : 'Chờ duyệt'),
                                    },
                                    {
                                        buoc: 3,
                                        tieu_de: 'Vận chuyển',
                                        thoi_gian: rutGonThoiGian(logVanChuyen?.thoi_gian) || (buocHienTai >= 3 ? (trangThai === 'da_giao' ? 'Đã xuất kho' : 'Đang chuyển') : 'Chờ bưu tá'),
                                    },
                                    {
                                        buoc: 4,
                                        tieu_de: 'Đã nhận hàng',
                                        thoi_gian: thoiGianGiao || (buocHienTai === 4 ? 'Đã ký nhận' : 'Dự kiến'),
                                    }
                                ];

                                return (
                                    <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3">
                                        {/* Header thanh lịch, nhỏ gọn */}
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                                    <Truck className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                                                    Lộ Trình Đơn Hàng
                                                </span>
                                            </div>

                                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                                trangThai === 'da_giao'
                                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                                    : trangThai === 'dang_giao'
                                                    ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                                                    : trangThai === 'da_xac_nhan'
                                                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                                    : trangThai === 'da_huy'
                                                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                            }`}>
                                                {trangThai === 'da_giao' ? '✓ Đã giao thành công' :
                                                 trangThai === 'dang_giao' ? '🚚 Đang giao hàng' :
                                                 trangThai === 'da_xac_nhan' ? '📦 Đã duyệt đơn' :
                                                 trangThai === 'da_huy' ? '✕ Đã hủy đơn' : '⏳ Chờ xác nhận'}
                                            </span>
                                        </div>

                                        {/* Stepper Timeline Nhẹ Nhàng & Trực Quan */}
                                        {trangThai === 'da_huy' ? (
                                            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 font-bold">
                                                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                                <span>Đơn hàng đã hủy. Tiến trình vận chuyển đã ngừng.</span>
                                            </div>
                                        ) : (
                                            <div className="relative pt-1 pb-1">
                                                {/* Ray tiến trình nối ngang */}
                                                <div className="absolute top-4 left-[12.5%] right-[12.5%] h-1 bg-slate-100 dark:bg-slate-700/80 rounded-full z-0">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                                                        style={{ 
                                                            width: buocHienTai === 4 ? '100%' : buocHienTai === 3 ? '66.6%' : buocHienTai === 2 ? '33.3%' : '0%' 
                                                        }}
                                                    />
                                                </div>

                                                {/* 4 Nút Mốc Tiến Trình Tinh Gọn */}
                                                <div className="grid grid-cols-4 gap-1 relative z-10">
                                                    {cacBuocTienTrinh.map((b) => {
                                                        const laHoanThanh = buocHienTai >= b.buoc;
                                                        const laDangXuLy = buocHienTai === b.buoc - 1 && buocHienTai > 0;

                                                        return (
                                                            <div key={b.buoc} className="flex flex-col items-center text-center">
                                                                {/* Nút icon tròn nhỏ gọn */}
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                                                    laHoanThanh
                                                                        ? 'bg-emerald-500 text-white shadow-xs ring-4 ring-emerald-50 dark:ring-emerald-950/70'
                                                                        : laDangXuLy
                                                                        ? 'bg-blue-600 text-white shadow-xs ring-4 ring-blue-50 dark:ring-blue-950/70 animate-pulse'
                                                                        : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                                                                }`}>
                                                                    {laHoanThanh ? (
                                                                        <Check className="w-4 h-4 stroke-[2.5]" />
                                                                    ) : (
                                                                        <span className="text-xs font-bold font-mono">{b.buoc}</span>
                                                                    )}
                                                                </div>

                                                                {/* Tiêu đề & Thời gian ngắn gọn */}
                                                                <div className="mt-1.5 w-full px-1">
                                                                    <div className={`text-xs font-bold truncate ${
                                                                        laHoanThanh 
                                                                            ? 'text-slate-800 dark:text-slate-100' 
                                                                            : laDangXuLy
                                                                            ? 'text-blue-600 dark:text-blue-400'
                                                                            : 'text-slate-400 dark:text-slate-500'
                                                                    }`}>
                                                                        {b.tieu_de}
                                                                    </div>
                                                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5">
                                                                        {b.thoi_gian}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* 3. Footer Cố Định */}
                        <div className="shrink-0 p-4 px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDonHangChiTiet(null)}
                                className="px-5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-extrabold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs"
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                onClick={() => inHoaDonBanHang(donHangChiTiet, danhSachSanPham)}
                                className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 !text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer hover:scale-102"
                            >
                                <Printer className="w-4 h-4 !text-white" />
                                <span className="!text-white">In Hóa Đơn & Phiếu Xuất Kho</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL 7: THÊM / SỬA BÀI VIẾT TIN TỨC (TOÀN DIỆN) */}
            {/* ========================================================================= */}
            {dangMoModalTinTuc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
                        <div className="shrink-0 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white p-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
                                    📰
                                </div>
                                <div>
                                    <h3 className="text-base font-black !text-white">
                                        {tinTucDangSua ? 'Chỉnh Sửa Bài Viết Tin Tức' : 'Tạo Bài Viết Mới'}
                                    </h3>
                                    <p className="text-xs text-teal-100 font-semibold">Soạn thảo bài viết đánh giá công nghệ và cẩm nang người dùng</p>
                                </div>
                            </div>
                            <button
                                onClick={() => !dangLuuTinTuc && setDangMoModalTinTuc(false)}
                                className="p-2 rounded-full bg-white/20 hover:bg-white/30 cursor-pointer transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={xuLyLuuTinTuc} className="flex flex-col flex-1 min-h-0">
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700 dark:text-slate-300">Tiêu Đề Bài Viết *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Top 5 Laptop Gaming RTX 40 Series..."
                                        value={formTinTuc.tieu_de}
                                        onChange={(e) => setFormTinTuc({ ...formTinTuc, tieu_de: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Chuyên Mục Bài Viết *</label>
                                        <select
                                            value={formTinTuc.chuyen_muc}
                                            onChange={(e) => setFormTinTuc({ ...formTinTuc, chuyen_muc: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
                                        >
                                            <option value="Tư Vấn Mua Sắm">Tư Vấn Mua Sắm</option>
                                            <option value="Xu Hướng Công Nghệ">Xu Hướng Công Nghệ</option>
                                            <option value="Đánh Giá & So Sánh">Đánh Giá & So Sánh</option>
                                            <option value="Tin Tức Công Nghệ">Tin Tức Công Nghệ</option>
                                            <option value="Chia Sẻ Kinh Nghiệm">Chia Sẻ Kinh Nghiệm</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Mã Slug / ID</label>
                                        <input
                                            type="text"
                                            placeholder="tin-1 / top-5-laptop-2026"
                                            value={formTinTuc.id}
                                            onChange={(e) => setFormTinTuc({ ...formTinTuc, id: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-xs text-blue-600"
                                        />
                                    </div>
                                </div>

                                {/* Ảnh Thumbnail & Live Preview */}
                                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                    <div className="w-20 h-14 rounded-2xl bg-slate-950 overflow-hidden relative shrink-0 border border-slate-300 dark:border-slate-700">
                                        <Image src={formTinTuc.hinh_anh || 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'} alt="Preview" fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Đường Dẫn Hình Ảnh Bìa *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formTinTuc.hinh_anh}
                                            onChange={(e) => setFormTinTuc({ ...formTinTuc, hinh_anh: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Tác Giả *</label>
                                        <input
                                            type="text"
                                            value={formTinTuc.tac_gia}
                                            onChange={(e) => setFormTinTuc({ ...formTinTuc, tac_gia: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-700 dark:text-slate-300">Thời Gian Đọc Ước Tính</label>
                                        <input
                                            type="text"
                                            placeholder="5 phút đọc..."
                                            value={formTinTuc.thoi_gian_doc}
                                            onChange={(e) => setFormTinTuc({ ...formTinTuc, thoi_gian_doc: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700 dark:text-slate-300">Tóm Tắt Ngắn (Hiển thị ngoài danh sách) *</label>
                                    <textarea
                                        rows="2"
                                        required
                                        value={formTinTuc.tom_tat}
                                        onChange={(e) => setFormTinTuc({ ...formTinTuc, tom_tat: e.target.value })}
                                        placeholder="Đoạn văn ngắn tóm tắt bài viết..."
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs leading-relaxed"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                                        <span>Nội Dung Chi Tiết Bài Viết (Hỗ trợ đề mục ###, đoạn văn, lời khuyên...)</span>
                                        <span className="text-[10px] text-teal-600 font-normal">Sử dụng ### cho tiêu đề con</span>
                                    </label>
                                    <textarea
                                        rows="6"
                                        value={formTinTuc.noi_dung}
                                        onChange={(e) => setFormTinTuc({ ...formTinTuc, noi_dung: e.target.value })}
                                        placeholder="Soạn thảo nội dung..."
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs leading-relaxed"
                                    />
                                </div>

                                {/* Checkbox Options */}
                                <div className="flex flex-wrap items-center gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setFormTinTuc({ ...formTinTuc, la_tieu_diem: !formTinTuc.la_tieu_diem })}
                                        className={`px-4 py-2 rounded-2xl font-bold flex items-center gap-2 border transition-all cursor-pointer ${formTinTuc.la_tieu_diem ? 'bg-red-600 text-white border-red-700 shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                                    >
                                        <Flame className="w-4 h-4" />
                                        <span>🔥 Đặt làm bài viết Tiêu Điểm</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormTinTuc({ ...formTinTuc, xuat_ban: !formTinTuc.xuat_ban })}
                                        className={`px-4 py-2 rounded-2xl font-bold flex items-center gap-2 border transition-all cursor-pointer ${formTinTuc.xuat_ban ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>🟢 Xuất bản ngay</span>
                                    </button>
                                </div>
                            </div>

                            {/* Pinned Footer */}
                            <div className="shrink-0 p-4 px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    disabled={dangLuuTinTuc}
                                    onClick={() => setDangMoModalTinTuc(false)}
                                    className={`px-5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all ${dangLuuTinTuc ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={dangLuuTinTuc}
                                    className={`px-6 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-2 shadow-md shadow-teal-500/25 transition-all ${dangLuuTinTuc ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    {dangLuuTinTuc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    <span>{dangLuuTinTuc ? 'Đang lưu bài viết...' : (tinTucDangSua ? 'Lưu Thay Đổi' : 'Lưu Bài Viết')}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
