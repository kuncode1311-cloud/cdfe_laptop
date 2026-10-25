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
    ArrowRight,
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
    GitCompare,
    Play,
    Radio,
    Wifi,
    Usb,
    Barcode,
    Building2,
    CircleDollarSign,
    Shield,
    Globe,
    Smile
} from 'lucide-react';
import { useAuth, useNguoiDung } from '@/contexts/AuthContext';
import { useTheme, useGiaoDien } from '@/contexts/ThemeContext';
import { SanPhamService } from '@/services/san-pham.service';
import { DonHangService } from '@/services/don-hang.service';
import { MaGiamGiaService } from '@/services/ma-giam-gia.service';
import { DanhMucService } from '@/services/danh-muc.service';
import { NguoiDungService } from '@/services/nguoi-dung.service';
import { TinTucService } from '@/services/tin-tuc.service';
import { CaiDatService } from '@/services/cai-dat.service';
import { formatCurrency, dinhDangTienVND } from '@/utils/formatCurrency';
import { docAnhDaNen, loiLinkAnh } from '@/utils/anh-san-pham';
import { taoSlug, slugTinTuc } from '@/utils/taoSlug';
import { inHoaDonBanHang } from '@/utils/inHoaDon';
import BieuDoTongQuan from '@/components/admin/BieuDoTongQuan';
import KhuVucDangTaiTable from '@/components/admin/KhuVucDangTaiTable';
import QuanLyLienHeTuVan from '@/components/admin/QuanLyLienHeTuVan';
import QuanLyDanhGia from '@/components/admin/QuanLyDanhGia';
import QuanLyBaoHanh from '@/components/admin/QuanLyBaoHanh';
import TongQuanTab from '@/components/admin/TongQuanTab';
import CauHinhKhuyenMai from '@/components/admin/CauHinhKhuyenMai';
import CauHinhShowroom from '@/components/admin/CauHinhShowroom';
import QuanLyDanhMuc from '@/components/admin/QuanLyDanhMuc';
import QuanLyVoucher from '@/components/admin/QuanLyVoucher';
import QuanLyTinTuc from '@/components/admin/QuanLyTinTuc';
import QuanLyDonHang from '@/components/admin/QuanLyDonHang';
import QuanLySanPham from '@/components/admin/QuanLySanPham';
import QuanLyKhachHang from '@/components/admin/QuanLyKhachHang';
import ModalThuongHieu from '@/components/admin/ModalThuongHieu';
import ModalVoucher from '@/components/admin/ModalVoucher';
import ModalKhachHang from '@/components/admin/ModalKhachHang';
import ModalTinTuc from '@/components/admin/ModalTinTuc';
import ModalDonHang from '@/components/admin/ModalDonHang';
import ModalChiTietDonHang from '@/components/admin/ModalChiTietDonHang';
import ModalSanPham from '@/components/admin/ModalSanPham';
import OverlayXemSanPham from '@/components/admin/OverlayXemSanPham';
import { LienHeService } from '@/services/lien-he.service';
import { taoHandlerXoa, taoHandlerToggleTruong } from '@/hooks/admin/useXuLyAdmin';
import { toast } from 'sonner';

// Helper an toàn tránh runtime ReferenceError khi format tiền tệ
const dinhDangVND = (so) => dinhDangTienVND(Number(so) || 0);

export default function TrangQuanTriCuaHang() {
    const { nguoiDung, laAdmin, dangXuat } = useNguoiDung();
    const { chu_de, chuyenDoiChuDe } = useGiaoDien();

    // Điều hướng Tab: 9 Tabs Quản Trị Toàn Diện (Tự động ghi nhớ vị trí khi F5 reload)
    const [tabHienTai, setTabHienTai] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const tabUrl = urlParams.get('tab');
                const tabStorage = localStorage.getItem('admin_active_tab');
                const validTabs = ['tong_quan', 'don_hang', 'san_pham', 'danh_muc', 'khach_hang', 'voucher', 'tin_tuc', 'khuyen_mai', 'showroom', 'lien_he', 'danh_gia', 'bao_hanh'];
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
            const validTabs = ['tong_quan', 'don_hang', 'san_pham', 'danh_muc', 'khach_hang', 'voucher', 'tin_tuc', 'khuyen_mai', 'showroom', 'lien_he', 'danh_gia', 'bao_hanh'];

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

    const xuLyThemShowroomMoi = () => {
        // eslint-disable-next-line react-hooks/purity -- chạy trong handler click, không phải lúc render
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

    const danhSachHangThucTe = useMemo(() => {
        const hangSet = new Map();
        // Chỉ lấy dòng là hãng, không trộn loại sản phẩm / nhu cầu vào ô "Hãng"
        danhSachDanhMuc.forEach(dm => {
            if (dm.loai && dm.loai !== 'thuong_hieu') return;
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

            return {
                ...user,
                tongChiTieu,
                soDonHang,
                laTiemNang
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
            } else if (locKhachHang === 'da_mua') {
                matchLoai = u.soDonHang > 0;
            } else if (locKhachHang === 'chua_mua') {
                matchLoai = !u.soDonHang || u.soDonHang === 0;
            } else if (locKhachHang === 'admin') {
                matchLoai = u.vaiTro === 'admin';
            } else if (locKhachHang === 'bi_khoa') {
                matchLoai = Boolean(u.biKhoa || u.trangThai === 'bi_khoa');
            } else if (locKhachHang === 'cho_kich_hoat') {
                matchLoai = u.daKichHoat === false || u.trangThai === 'cho_kich_hoat';
            } else if (locKhachHang === 'hoat_dong') {
                matchLoai = !u.biKhoa && u.trangThai !== 'bi_khoa' && u.daKichHoat !== false && u.trangThai !== 'cho_kich_hoat';
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

            const matchLoai = locLoaiDanhMuc === 'thuong_hieu'
                ? (dm.loai === 'thuong_hieu' || !dm.loai)
                : dm.loai === locLoaiDanhMuc;

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
        // eslint-disable-next-line react-hooks/purity -- chạy trong handler click xuất file, không phải lúc render
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
            // eslint-disable-next-line react-hooks/purity -- chạy trong handler click mở form thêm sản phẩm, không phải lúc render
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
            qua_tang: [],
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

            // Tiêu đề phân nhóm cấu hình kỹ thuật tùy biến
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
            if (!standardKeys.includes(k) && !k.startsWith('tieu_de_nhom_') && v !== undefined && v !== null && String(v).trim()) {
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

            // Tiêu đề phân nhóm cấu hình kỹ thuật tùy biến (đọc từ MongoDB nếu đã sửa)
            tieu_de_nhom_cpu: specs.tieu_de_nhom_cpu || '1. Bộ Xử Lý & Hiệu Năng (CPU)',
            tieu_de_nhom_gpu: specs.tieu_de_nhom_gpu || '2. Đồ Họa & Xử Lý Hình Ảnh (GPU)',
            tieu_de_nhom_ram: specs.tieu_de_nhom_ram || '3. Bộ Nhớ RAM & Ổ Cứng Lưu Trữ',
            tieu_de_nhom_man_hinh: specs.tieu_de_nhom_man_hinh || '4. Màn Hình & Không Gian Hiển Thị',
            tieu_de_nhom_pin: specs.tieu_de_nhom_pin || '5. Hệ Thống Tản Nhiệt & Thời Lượng Pin',
            tieu_de_nhom_thiet_ke: specs.tieu_de_nhom_thiet_ke || '6. Thiết Kế Khung Vỏ, Bàn Phím & Cổng Giao Tiếp',
            tieu_de_nhom_linh_kien_hieu_nang: specs.tieu_de_nhom_linh_kien_hieu_nang || '1. Hiệu Năng & Tốc Độ Truyền Tải',
            tieu_de_nhom_linh_kien_chuan: specs.tieu_de_nhom_linh_kien_chuan || '2. Chuẩn Giao Tiếp & Độ Bền',
            tieu_de_nhom_balo_ngan_chua: specs.tieu_de_nhom_balo_ngan_chua || '1. Ngăn Chứa & Kích Thước Máy',
            tieu_de_nhom_balo_chat_lieu: specs.tieu_de_nhom_balo_chat_lieu || '2. Chất Liệu & Khả Năng Kháng Nước',
            tieu_de_nhom_balo_tien_ich: specs.tieu_de_nhom_balo_tien_ich || '3. Tiện Ích, Tính Năng & Bảo Hành',
            tieu_de_nhom_phim_switch: specs.tieu_de_nhom_phim_switch || '1. Switch & Cảm Giác Gõ Phím',
            tieu_de_nhom_phim_layout: specs.tieu_de_nhom_phim_layout || '2. Layout, Keycap & Khung Vỏ',
            tieu_de_nhom_phim_ket_noi: specs.tieu_de_nhom_phim_ket_noi || '3. Kết Nối, Đèn LED & Pin',
            tieu_de_nhom_chuot_cam_bien: specs.tieu_de_nhom_chuot_cam_bien || '1. Cảm Biến, DPI & Độ Chính Xác',
            tieu_de_nhom_chuot_ket_noi: specs.tieu_de_nhom_chuot_ket_noi || '2. Kết Nối, Kích Thước & Thời Lượng Pin',
            tieu_de_nhom_tai_nghe_am_thanh: specs.tieu_de_nhom_tai_nghe_am_thanh || '1. Màng Loa, Âm Thanh & Chống Ồn ANC',
            tieu_de_nhom_tai_nghe_ket_noi: specs.tieu_de_nhom_tai_nghe_ket_noi || '2. Kết Nối, Micro & Thời Lượng Pin',
            tieu_de_nhom_tai_nghe_thiet_ke: specs.tieu_de_nhom_tai_nghe_thiet_ke || '3. Thiết Kế, Đệm Tai & Kháng Nước',
            tieu_de_nhom_sac_cong_suat: specs.tieu_de_nhom_sac_cong_suat || '1. Công Suất & Công Nghệ Sạc Nhanh GaN',
            tieu_de_nhom_sac_cong_ket_noi: specs.tieu_de_nhom_sac_cong_ket_noi || '2. Cổng Kết Nối & Băng Thông Truyền Tải',
            tieu_de_nhom_sac_thiet_ke: specs.tieu_de_nhom_sac_thiet_ke || '3. Thiết Kế, Dây Cáp & Độ Bền',

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

    // ==========================================
    // HÀM CHUNG: Xây object thông số kỹ thuật (thong_so) theo từng loại sản phẩm (7 nhóm)
    // Dùng CHUNG cho cả "Xem trước sản phẩm" (sanPhamXemTruoc) và "Lưu sản phẩm" (xuLyLuuSanPham)
    // để tránh lặp code gần giống nhau 2 lần.
    // - chuanHoa = false (mặc định, dùng cho Xem trước): giữ nguyên giá trị thô từ formSp, không ép kiểu,
    //   không tách chuỗi thành mảng -> đúng hành vi xem trước tạm thời trước đây.
    // - chuanHoa = true (dùng khi Lưu): có fallback rỗng '', ép kiểu Number/Boolean cho các trường số/cờ,
    //   và tách chuỗi (phân tách bởi dấu phẩy / • / xuống dòng) thành mảng cho các trường danh sách
    //   -> đúng hành vi chuẩn hóa dữ liệu trước khi gửi lên MongoDB trước đây.
    // ==========================================
    const xayThongSoTheoLoai = (formSp, loaiFormSanPham, { chuanHoa = false } = {}) => {
        const tachChuoiThanhMang = (val) => {
            if (Array.isArray(val)) return val;
            if (!val || typeof val !== 'string') return [];
            return val.split(/[,•\n]/).map(s => s.trim()).filter(Boolean);
        };
        const layChuoi = (val) => (chuanHoa ? (val || '') : val);
        const laySo = (val) => {
            if (!chuanHoa) return val;
            if (!val) return '';
            return isNaN(Number(val)) ? val : Number(val);
        };
        const layMang = (val) => (chuanHoa ? tachChuoiThanhMang(val) : val);
        const layBool = (val) => (chuanHoa ? Boolean(val) : val);
        const macDinhBaoHanh = chuanHoa ? (formSp.che_do_bao_hanh || '24 tháng chính hãng') : formSp.che_do_bao_hanh;

        if (loaiFormSanPham === 'laptop') {
            return {
                cpu: layChuoi(formSp.cpu),
                so_nhan_luong: layChuoi(formSp.so_nhan_luong),
                xung_nhip_toi_da: layChuoi(formSp.xung_nhip_toi_da),
                bo_nho_dem_cache: layChuoi(formSp.bo_nho_dem_cache),
                chip_ai_npu: layChuoi(formSp.chip_ai_npu),
                hieu_nang_ai_tops: laySo(formSp.hieu_nang_ai_tops),
                card_do_hoa: layChuoi(formSp.card_do_hoa),
                dung_luong_vram: layChuoi(formSp.dung_luong_vram),
                cong_suat_tgp: laySo(formSp.cong_suat_tgp),
                ho_tro_ray_tracing: layBool(formSp.ho_tro_ray_tracing),
                ram: layChuoi(formSp.ram),
                loai_ram: layChuoi(formSp.loai_ram),
                toc_do_bus: laySo(formSp.toc_do_bus),
                nang_cap_ram_toi_da: layChuoi(formSp.nang_cap_ram_toi_da),
                o_cung: layChuoi(formSp.o_cung),
                khe_cam_mo_rong: layChuoi(formSp.khe_cam_mo_rong),
                man_hinh: layChuoi(formSp.man_hinh),
                do_phan_giai: layChuoi(formSp.do_phan_giai),
                tan_so_quet: laySo(formSp.tan_so_quet),
                tam_nen: layChuoi(formSp.tam_nen),
                do_phu_mau: layChuoi(formSp.do_phu_mau),
                do_sang_nits: laySo(formSp.do_sang_nits),
                cong_nghe_man_hinh: layMang(formSp.cong_nghe_man_hinh),
                pin: layChuoi(formSp.pin),
                dung_luong_pin: layChuoi(formSp.pin),
                thoi_luong_su_dung_uoc_tinh: layChuoi(formSp.thoi_luong_su_dung_uoc_tinh),
                cong_suat_sac: layChuoi(formSp.cong_suat_sac),
                he_thong_tan_nhiet: layChuoi(formSp.he_thong_tan_nhiet),
                chi_tiet_tan_nhiet: layChuoi(formSp.chi_tiet_tan_nhiet || formSp.he_thong_tan_nhiet),
                trong_luong: layChuoi(formSp.trong_luong),
                kich_thuoc: layChuoi(formSp.kich_thuoc),
                chat_lieu_vo: layChuoi(formSp.chat_lieu_vo),
                cong_ket_noi: layMang(formSp.cong_ket_noi),
                chuan_wifi_bluetooth: layChuoi(formSp.chuan_wifi_bluetooth),
                ban_phim: layChuoi(formSp.ban_phim),
                am_thanh: layChuoi(formSp.am_thanh),
                he_dieu_hanh: layChuoi(formSp.he_dieu_hanh),
                che_do_bao_hanh: macDinhBaoHanh
            };
        } else if (loaiFormSanPham === 'ban_phim') {
            return {
                switch: layChuoi(formSp.loai_switch),
                loai_switch: layChuoi(formSp.loai_switch),
                tinh_nang_dac_biet: layChuoi(formSp.tinh_nang_dac_biet),
                cau_truc_mount: layChuoi(formSp.cau_truc_mount),
                layout: layChuoi(formSp.layout_ban_phim),
                layout_ban_phim: layChuoi(formSp.layout_ban_phim),
                keycap: layChuoi(formSp.keycap_chat_lieu),
                keycap_chat_lieu: layChuoi(formSp.keycap_chat_lieu),
                chat_lieu_case: layChuoi(formSp.chat_lieu_case),
                kieu_ket_noi: layChuoi(formSp.kieu_ket_noi_gear),
                ket_noi: layChuoi(formSp.kieu_ket_noi_gear),
                led_rgb: layChuoi(formSp.led_rgb_gear),
                den_led: layChuoi(formSp.led_rgb_gear),
                dung_luong_pin: layChuoi(formSp.dung_luong_pin_gear),
                hot_swap: layChuoi(formSp.hot_swap),
                tuong_thich: layChuoi(formSp.tuong_thich_gear),
                trong_luong: layChuoi(formSp.trong_luong_gear),
                che_do_bao_hanh: macDinhBaoHanh
            };
        } else if (loaiFormSanPham === 'chuot') {
            return {
                cam_bien: layChuoi(formSp.cam_bien_chuot),
                mat_doc_cam_bien: layChuoi(formSp.cam_bien_chuot),
                do_phan_giai_dpi: layChuoi(formSp.do_phan_giai_dpi),
                toc_do_ips_gia_toc: layChuoi(formSp.toc_do_ips_gia_toc),
                switch_chuot: layChuoi(formSp.switch_chuot),
                polling_rate: layChuoi(formSp.polling_rate),
                loai_lot_chuot: layChuoi(formSp.loai_lot_chuot),
                chat_lieu_be_mat: layChuoi(formSp.chat_lieu_be_mat),
                chat_lieu_de: layChuoi(formSp.chat_lieu_de),
                trong_luong: layChuoi(formSp.trong_luong_chuot),
                kieu_ket_noi: layChuoi(formSp.kieu_ket_noi_chuot),
                ket_noi: layChuoi(formSp.kieu_ket_noi_chuot),
                che_do_led: layChuoi(formSp.che_do_led),
                thoi_luong_pin: layChuoi(formSp.thoi_luong_pin_chuot),
                dung_luong_pin: layChuoi(formSp.thoi_luong_pin_chuot),
                chat_lieu_feet: layChuoi(formSp.chat_lieu_feet),
                kich_thuoc: layChuoi(formSp.kich_thuoc_chuot),
                che_do_bao_hanh: macDinhBaoHanh
            };
        } else if (loaiFormSanPham === 'balo') {
            return {
                kich_co_laptop_phu_hop: layChuoi(formSp.kich_co_laptop_phu_hop),
                dung_tich: layChuoi(formSp.dung_tich_balo),
                so_ngan_chua: layChuoi(formSp.so_ngan_chua),
                kich_thuoc: layChuoi(formSp.kich_thuoc_balo),
                trong_luong: layChuoi(formSp.trong_luong_tui),
                chat_lieu_chinh: layChuoi(formSp.chat_lieu_chinh),
                chat_lieu_vai: layChuoi(formSp.chat_lieu_chinh),
                lop_lot_bao_ve: layChuoi(formSp.lop_lot_bao_ve),
                khoa_keo: layChuoi(formSp.khoa_keo),
                khang_nuoc: layChuoi(formSp.kha_nang_khang_nuoc),
                kha_nang_khang_nuoc: layChuoi(formSp.kha_nang_khang_nuoc),
                dem_lung_thoang_khi: layChuoi(formSp.dem_lung_thoang_khi),
                cong_tinh_nang: layMang(formSp.cong_tinh_nang),
                che_do_bao_hanh: macDinhBaoHanh
            };
        } else if (loaiFormSanPham === 'tai_nghe') {
            return {
                mang_loa_driver: layChuoi(formSp.mang_loa_driver),
                cong_nghe_am_thanh: layChuoi(formSp.cong_nghe_am_thanh),
                tan_so_dap_ung: layChuoi(formSp.tan_so_dap_ung),
                dai_tan_so: layChuoi(formSp.tan_so_dap_ung),
                tro_khang_do_nhay: layChuoi(formSp.tro_khang_do_nhay),
                chong_on_anc: layChuoi(formSp.chong_on_anc),
                chuan_ket_noi: layChuoi(formSp.kieu_ket_noi_tai_nghe),
                kieu_ket_noi: layChuoi(formSp.kieu_ket_noi_tai_nghe),
                ket_noi: layChuoi(formSp.kieu_ket_noi_tai_nghe),
                thoi_luong_pin: layChuoi(formSp.thoi_luong_pin_tai_nghe),
                dung_luong_pin: layChuoi(formSp.thoi_luong_pin_tai_nghe),
                khang_nuoc: layChuoi(formSp.khang_nuoc_tai_nghe),
                dem_tai: layChuoi(formSp.dem_tai),
                bo_dieu_khien: layChuoi(formSp.bo_dieu_khien),
                kich_thuoc: layChuoi(formSp.kich_thuoc_tai_nghe),
                trong_luong: layChuoi(formSp.trong_luong_tai_nghe),
                micro: layChuoi(formSp.micro_dam_thoai),
                che_do_bao_hanh: macDinhBaoHanh
            };
        } else if (loaiFormSanPham === 'sac_hub') {
            return {
                cong_suat_tong: layChuoi(formSp.cong_suat_tong),
                cong_suat_toi_da: layChuoi(formSp.cong_suat_tong),
                cong_nghe_sac: layChuoi(formSp.cong_nghe_sac),
                giao_thuc_ho_tro: layChuoi(formSp.giao_thuc_ho_tro),
                dung_luong_pin: layChuoi(formSp.dung_luong_pin_sac),
                man_hinh_hien_thi: layChuoi(formSp.man_hinh_hien_thi),
                tinh_nang_an_toan: layChuoi(formSp.tinh_nang_an_toan),
                so_cong_sac: layChuoi(formSp.so_cong_sac),
                so_cong_dau_ra: layMang(formSp.so_cong_sac),
                bang_thong_truyen_du_lieu: layChuoi(formSp.bang_thong_truyen_du_lieu),
                cong_suat_sac_pass_through: layChuoi(formSp.cong_suat_sac_pass_through),
                xuat_hinh_anh: layChuoi(formSp.xuat_hinh_anh),
                chieu_dai_cap: layChuoi(formSp.chieu_dai_cap),
                chat_lieu_vo: layChuoi(formSp.chat_lieu_vo_sac),
                tuong_thich: layChuoi(formSp.tuong_thich_sac),
                kich_thuoc_trong_luong: layChuoi(formSp.kich_thuoc_trong_luong_sac),
                kich_thuoc: layChuoi(formSp.kich_thuoc_sac),
                trong_luong: layChuoi(formSp.trong_luong_sac),
                che_do_bao_hanh: macDinhBaoHanh
            };
        }

        // linh_kien (mặc định / else)
        return {
            loai_linh_kien: layChuoi(formSp.loai_linh_kien),
            chuan_giao_tiep: layChuoi(formSp.chuan_giao_tiep),
            dung_luong: layChuoi(formSp.dung_luong_linh_kien),
            toc_do: layChuoi(formSp.toc_do_doc_ghi),
            toc_do_doc_ghi: layChuoi(formSp.toc_do_doc_ghi),
            toc_do_bus: layChuoi(formSp.toc_do_bus_linh_kien),
            do_tre_cl: layChuoi(formSp.do_tre_cl),
            so_nhan_luong: layChuoi(formSp.so_nhan_luong_linh_kien),
            xung_nhip_toi_da: layChuoi(formSp.xung_nhip_toi_da_linh_kien),
            bo_nho_dem_cache: layChuoi(formSp.bo_nho_dem_cache_linh_kien),
            cong_suat_tdp: layChuoi(formSp.cong_suat_tdp),
            ho_tro_ram: layChuoi(formSp.ho_tro_ram),
            toc_do_quat: layChuoi(formSp.toc_do_quat),
            hieu_qua_giam_nhiet: layChuoi(formSp.hieu_qua_giam_nhiet),
            do_dan_nhiet: layChuoi(formSp.do_dan_nhiet),
            do_ben_tbw: layChuoi(formSp.do_ben_tbw),
            tinh_nang_dac_biet: layChuoi(formSp.tinh_nang_dac_biet_linh_kien),
            he_thong_tan_nhiet: layChuoi(formSp.he_thong_tan_nhiet),
            tuong_thich: layChuoi(formSp.tuong_thich_linh_kien),
            kich_co_laptop_phu_hop: layChuoi(formSp.kich_co_laptop_linh_kien),
            trong_luong: layChuoi(formSp.trong_luong_linh_kien),
            che_do_bao_hanh: macDinhBaoHanh
        };
    };

    // Chuẩn bị dữ liệu hiển thị card sản phẩm xem trước tức thì
    const sanPhamXemTruoc = useMemo(() => {
        const thongSoGoc = (spDangSua && spDangSua.thong_so && typeof spDangSua.thong_so === 'object')
            ? { ...spDangSua.thong_so }
            : {};
        let thongSoForm = { ...thongSoGoc };

        thongSoForm = {
            ...thongSoForm,
            ...xayThongSoTheoLoai(formSp, loaiFormSanPham, { chuanHoa: false })
        };

        Object.keys(formSp).forEach(k => {
            if (k.startsWith('tieu_de_nhom_') && formSp[k]) {
                thongSoForm[k] = formSp[k];
            }
        });

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
        // Kiểm tra hợp lệ giá bán (không được để trống, 0đ, hoặc < 1.000 đ)
        const giaBanSo = Number(formSp.gia_khuyen_mai);
        if (formSp.gia_khuyen_mai === undefined || formSp.gia_khuyen_mai === null || formSp.gia_khuyen_mai === '' || isNaN(giaBanSo) || giaBanSo < 1000) {
            canhBao({
                tieuDe: 'Giá Bán Không Hợp Lệ',
                noiDung: 'Giá khuyến mãi (giá bán thực tế) không được để trống hoặc bằng 0 đ, và phải từ 1.000 đ trở lên để đáp ứng quy định thanh toán!',
                loai: 'danger'
            });
            return;
        }

        const giaGocSo = Number(formSp.gia_goc);
        if (giaGocSo > 0 && giaGocSo < giaBanSo) {
            canhBao({
                tieuDe: 'Giá Niêm Yết Không Hợp Lệ',
                noiDung: `Giá niêm yết gốc (${giaGocSo.toLocaleString('vi-VN')} đ) phải lớn hơn hoặc bằng giá khuyến mãi (${giaBanSo.toLocaleString('vi-VN')} đ). Hãy để 0 nếu không có giá niêm yết cũ!`,
                loai: 'danger'
            });
            return;
        }

        // Link ảnh đại diện phải đúng định dạng (https://..., /images/... hoặc ảnh tải từ máy)
        const loiAnh = !formSp.hinh_anh_chinh?.trim() ? 'Sản phẩm cần có ảnh đại diện. Hãy dán link ảnh hoặc tải ảnh từ máy.' : loiLinkAnh(formSp.hinh_anh_chinh);
        if (loiAnh) {
            canhBao({ tieuDe: 'Ảnh Đại Diện Chưa Hợp Lệ', noiDung: loiAnh, loai: 'danger' });
            return;
        }

        setDangLuuSp(true);
        try {
            // Bảo toàn tuyệt đối mọi thông số kỹ thuật gốc có trong DB (không bị ghi đè mất các trường sâu)
            const thongSoGoc = (spDangSua && spDangSua.thong_so && typeof spDangSua.thong_so === 'object')
                ? { ...spDangSua.thong_so }
                : {};
            let thongSoPayload = {
                ...thongSoGoc,
                ...xayThongSoTheoLoai(formSp, loaiFormSanPham, { chuanHoa: true })
            };

            // Đính kèm các tiêu đề nhóm tùy chỉnh vào payload MongoDB
            if (formSp.tieu_de_nhom_cpu) thongSoPayload.tieu_de_nhom_cpu = formSp.tieu_de_nhom_cpu;
            if (formSp.tieu_de_nhom_gpu) thongSoPayload.tieu_de_nhom_gpu = formSp.tieu_de_nhom_gpu;
            if (formSp.tieu_de_nhom_ram) thongSoPayload.tieu_de_nhom_ram = formSp.tieu_de_nhom_ram;
            if (formSp.tieu_de_nhom_man_hinh) thongSoPayload.tieu_de_nhom_man_hinh = formSp.tieu_de_nhom_man_hinh;
            if (formSp.tieu_de_nhom_pin) thongSoPayload.tieu_de_nhom_pin = formSp.tieu_de_nhom_pin;
            if (formSp.tieu_de_nhom_thiet_ke) thongSoPayload.tieu_de_nhom_thiet_ke = formSp.tieu_de_nhom_thiet_ke;
            if (formSp.tieu_de_nhom_linh_kien_hieu_nang) thongSoPayload.tieu_de_nhom_linh_kien_hieu_nang = formSp.tieu_de_nhom_linh_kien_hieu_nang;
            if (formSp.tieu_de_nhom_linh_kien_chuan) thongSoPayload.tieu_de_nhom_linh_kien_chuan = formSp.tieu_de_nhom_linh_kien_chuan;
            if (formSp.tieu_de_nhom_balo_ngan_chua) thongSoPayload.tieu_de_nhom_balo_ngan_chua = formSp.tieu_de_nhom_balo_ngan_chua;
            if (formSp.tieu_de_nhom_balo_chat_lieu) thongSoPayload.tieu_de_nhom_balo_chat_lieu = formSp.tieu_de_nhom_balo_chat_lieu;
            if (formSp.tieu_de_nhom_balo_tien_ich) thongSoPayload.tieu_de_nhom_balo_tien_ich = formSp.tieu_de_nhom_balo_tien_ich;
            if (formSp.tieu_de_nhom_phim_switch) thongSoPayload.tieu_de_nhom_phim_switch = formSp.tieu_de_nhom_phim_switch;
            if (formSp.tieu_de_nhom_phim_layout) thongSoPayload.tieu_de_nhom_phim_layout = formSp.tieu_de_nhom_phim_layout;
            if (formSp.tieu_de_nhom_phim_ket_noi) thongSoPayload.tieu_de_nhom_phim_ket_noi = formSp.tieu_de_nhom_phim_ket_noi;
            if (formSp.tieu_de_nhom_chuot_cam_bien) thongSoPayload.tieu_de_nhom_chuot_cam_bien = formSp.tieu_de_nhom_chuot_cam_bien;
            if (formSp.tieu_de_nhom_chuot_ket_noi) thongSoPayload.tieu_de_nhom_chuot_ket_noi = formSp.tieu_de_nhom_chuot_ket_noi;
            if (formSp.tieu_de_nhom_tai_nghe_am_thanh) thongSoPayload.tieu_de_nhom_tai_nghe_am_thanh = formSp.tieu_de_nhom_tai_nghe_am_thanh;
            if (formSp.tieu_de_nhom_tai_nghe_ket_noi) thongSoPayload.tieu_de_nhom_tai_nghe_ket_noi = formSp.tieu_de_nhom_tai_nghe_ket_noi;
            if (formSp.tieu_de_nhom_tai_nghe_thiet_ke) thongSoPayload.tieu_de_nhom_tai_nghe_thiet_ke = formSp.tieu_de_nhom_tai_nghe_thiet_ke;
            if (formSp.tieu_de_nhom_sac_cong_suat) thongSoPayload.tieu_de_nhom_sac_cong_suat = formSp.tieu_de_nhom_sac_cong_suat;
            if (formSp.tieu_de_nhom_sac_cong_ket_noi) thongSoPayload.tieu_de_nhom_sac_cong_ket_noi = formSp.tieu_de_nhom_sac_cong_ket_noi;
            if (formSp.tieu_de_nhom_sac_thiet_ke) thongSoPayload.tieu_de_nhom_sac_thiet_ke = formSp.tieu_de_nhom_sac_thiet_ke;

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
            canhBao({ tieuDe: 'Không Thể Lưu Sản Phẩm', noiDung: err.message, loai: 'danger' });
        } finally {
            setDangLuuSp(false);
        }
    };

    // Handler dùng chung cho các hàm "Xóa" và "Toggle trường boolean" của trang Admin
    // (gộp logic lặp lại — xem hooks/admin/useXuLyAdmin.js)
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

    const xuLyLuuCaiDatKm = (e) => {
        if (e) e.preventDefault();
        setDangLuuKm(true);
        try {
            const daLuu = CaiDatService.luuCaiDatKhuyenMai(formCaiDatKm);
            setCaiDatKm(daLuu);
            setFormCaiDatKm(daLuu);
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

    // Hàm chọn nhanh mốc thời gian kết thúc khuyến mãi (1 click tiện lợi)
    const chonNhanhHanKetThuc = (soNgay) => {
        const d = new Date();
        d.setDate(d.getDate() + soNgay);
        d.setHours(23, 59, 0, 0);
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
        setFormCaiDatKm((prev) => ({ ...prev, thoi_gian_ket_thuc: localISOTime }));
    };

    const chonCuoiTuan = () => {
        const d = new Date();
        const day = d.getDay(); // 0: Chủ Nhật
        const soNgayDenChuNhat = day === 0 ? 7 : (7 - day);
        d.setDate(d.getDate() + soNgayDenChuNhat);
        d.setHours(23, 59, 0, 0);
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
        setFormCaiDatKm((prev) => ({ ...prev, thoi_gian_ket_thuc: localISOTime }));
    };

    const chonCuoiThang = () => {
        const d = new Date();
        const ngayCuoiThang = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 0, 0);
        const tzOffset = ngayCuoiThang.getTimezoneOffset() * 60000;
        const localISOTime = new Date(ngayCuoiThang.getTime() - tzOffset).toISOString().slice(0, 16);
        setFormCaiDatKm((prev) => ({ ...prev, thoi_gian_ket_thuc: localISOTime }));
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
            cac_san_pham: [{ san_pham_id: danhSachSanPham[0]?.id || '', so_luong: 1 }],
            hinh_thuc_thanh_toan: 'chuyen_khoan_vietqr',
            da_thanh_toan: true,
            trang_thai: 'da_xac_nhan',
            ma_giam_gia: ''
        });
        setDangMoModalDonHang(true);
    };

    // Mở modal SỬA đơn hàng đã có (chỉ cho sửa thông tin giao hàng + trạng thái/thanh toán/ghi chú
    // để đảm bảo AN TOÀN dữ liệu: KHÔNG động vào danh sách sản phẩm/tồn kho/tiền đã phát sinh của đơn cũ)
    const moModalSuaDonHang = (dh) => {
        setDonHangDangSua(dh);
        setFormDonHang({
            ho_ten: dh.thong_tin_giao_hang?.ho_ten || '',
            so_dien_thoai: dh.thong_tin_giao_hang?.so_dien_thoai || '',
            email: dh.thong_tin_giao_hang?.email || '',
            dia_chi_chi_tiet: dh.thong_tin_giao_hang?.dia_chi_chi_tiet || '',
            ghi_chu: dh.thong_tin_giao_hang?.ghi_chu || '',
            cac_san_pham: Array.isArray(dh.danh_sach_san_pham) && dh.danh_sach_san_pham.length > 0
                ? dh.danh_sach_san_pham.map(sp => ({ san_pham_id: sp.san_pham_id, so_luong: sp.so_luong }))
                : [{ san_pham_id: danhSachSanPham[0]?.id || '', so_luong: 1 }],
            hinh_thuc_thanh_toan: dh.hinh_thuc_thanh_toan || 'chuyen_khoan_vietqr',
            da_thanh_toan: Boolean(dh.da_thanh_toan),
            trang_thai: dh.trang_thai || 'da_xac_nhan',
            ma_giam_gia: dh.ma_giam_gia || ''
        });
        setDangMoModalDonHang(true);
    };

    // Thêm 1 dòng sản phẩm mới vào đơn hàng đang tạo (chỉ áp dụng khi TẠO đơn mới)
    const themDongSanPhamDonHang = () => {
        setFormDonHang(prev => ({
            ...prev,
            cac_san_pham: [...prev.cac_san_pham, { san_pham_id: danhSachSanPham[0]?.id || '', so_luong: 1 }]
        }));
    };

    // Xóa 1 dòng sản phẩm khỏi đơn hàng đang tạo
    const xoaDongSanPhamDonHang = (index) => {
        setFormDonHang(prev => ({
            ...prev,
            cac_san_pham: prev.cac_san_pham.length > 1
                ? prev.cac_san_pham.filter((_, i) => i !== index)
                : prev.cac_san_pham
        }));
    };

    // Cập nhật giá trị 1 dòng sản phẩm (san_pham_id hoặc so_luong) trong đơn hàng đang tạo
    const capNhatDongSanPhamDonHang = (index, key, value) => {
        setFormDonHang(prev => ({
            ...prev,
            cac_san_pham: prev.cac_san_pham.map((dong, i) => (i === index ? { ...dong, [key]: value } : dong))
        }));
    };

    const xuLyLuuDonHang = async (e) => {
        e.preventDefault();
        setDangLuuDonHang(true);
        try {
            if (donHangDangSua) {
                // SỬA ĐƠN HÀNG ĐÃ CÓ: Vì lý do AN TOÀN dữ liệu (đơn cũ có thể đã trừ tồn kho, phát sinh
                // bảo hành, lịch sử thanh toán...), CHỈ cho phép cập nhật thông tin giao hàng + trạng thái
                // đơn hàng + hình thức/trạng thái thanh toán + ghi chú. KHÔNG động vào danh sách sản phẩm,
                // tạm tính, giảm giá, tổng tiền đã có của đơn hàng gốc để tránh làm sai lệch dữ liệu đã phát sinh.
                const payloadCapNhat = {
                    thong_tin_giao_hang: {
                        ho_ten: formDonHang.ho_ten,
                        so_dien_thoai: formDonHang.so_dien_thoai,
                        email: formDonHang.email,
                        dia_chi_chi_tiet: formDonHang.dia_chi_chi_tiet,
                        ghi_chu: formDonHang.ghi_chu
                    },
                    hinh_thuc_thanh_toan: formDonHang.hinh_thuc_thanh_toan,
                    da_thanh_toan: Boolean(formDonHang.da_thanh_toan),
                    trang_thai: formDonHang.trang_thai
                };

                await DonHangService.capNhatDonHang(donHangDangSua.id || donHangDangSua._id, payloadCapNhat);
                hienThongBao(`Đã cập nhật đơn hàng ${donHangDangSua.ma_don_hang}!`);
            } else {
                // TẠO ĐƠN HÀNG MỚI TẠI QUẦY: cho phép chọn nhiều sản phẩm (nhiều dòng) trong 1 đơn
                const dongHopLe = (formDonHang.cac_san_pham || []).filter(d => d.san_pham_id);
                if (dongHopLe.length === 0) {
                    throw new Error('Vui lòng chọn ít nhất 1 sản phẩm cho đơn hàng!');
                }

                const danhSachSpPayload = dongHopLe.map(dong => {
                    const spChon = danhSachSanPham.find(s => s.id === dong.san_pham_id || s._id === dong.san_pham_id);
                    const donGia = spChon ? spChon.gia_khuyen_mai : 20000000;
                    return {
                        san_pham_id: spChon ? spChon.id : dong.san_pham_id,
                        ten_san_pham: spChon ? spChon.ten_san_pham : 'Sản Phẩm TNTP Store',
                        hinh_anh: spChon ? spChon.hinh_anh_chinh : '/images/asus_rog_scar18.jpg',
                        gia_tai_thoi_diem_them: donGia,
                        so_luong: Math.max(1, Number(dong.so_luong) || 1)
                    };
                });

                const tamTinh = danhSachSpPayload.reduce((tong, sp) => tong + sp.gia_tai_thoi_diem_them * sp.so_luong, 0);

                let tienGiam = 0;
                if (formDonHang.ma_giam_gia) {
                    const vc = danhSachVoucher.find(v => v.ma_code === formDonHang.ma_giam_gia.toUpperCase().trim());
                    if (vc && vc.kich_hoat) {
                        tienGiam = vc.loai_giam === 'tien_mat' ? vc.gia_tri_giam : (tamTinh * vc.gia_tri_giam) / 100;
                    }
                }
                const tongTien = Math.max(0, tamTinh - tienGiam);

                const payloadDonHang = {
                    id: `dh_admin_${Date.now()}`,
                    ma_don_hang: `LPN-${Date.now().toString().slice(-4)}`,
                    id_nguoi_dung: 'admin_root',
                    thong_tin_giao_hang: {
                        ho_ten: formDonHang.ho_ten,
                        so_dien_thoai: formDonHang.so_dien_thoai,
                        email: formDonHang.email,
                        dia_chi_chi_tiet: formDonHang.dia_chi_chi_tiet,
                        ghi_chu: formDonHang.ghi_chu
                    },
                    danh_sach_san_pham: danhSachSpPayload,
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
                            mo_ta: 'Đơn hàng được tạo bởi Quản Trị Viên'
                        }
                    ]
                };

                await DonHangService.taoDonHang(payloadDonHang);
                hienThongBao(`Đã tạo đơn hàng mới ${payloadDonHang.ma_don_hang}!`);
            }

            setDangMoModalDonHang(false);
            setDonHangDangSua(null);
            taiDuLieuToanBo();
        } catch (err) {
            canhBao({ tieuDe: 'Không Thể Lưu Đơn Hàng', noiDung: err.message, loai: 'danger' });
        } finally {
            setDangLuuDonHang(false);
        }
    };

    const xuLyDoiTrangThaiDonHang = async (id, trangThaiMoi) => {
        let lyDoHuy;
        if (trangThaiMoi === 'da_huy') {
            // Bắt buộc xác nhận qua prompt để tránh hủy nhầm khi chọn lố trong dropdown;
            // bấm Cancel (trả về null) sẽ hủy bỏ thao tác, không gọi API.
            lyDoHuy = window.prompt('Hủy đơn hàng này? Nhập lý do hủy (có thể để trống), bấm Cancel để không hủy:', '');
            if (lyDoHuy === null) return;
        }
        setDangXuLyDonHangId(id);
        try {
            await DonHangService.capNhatDonHang(id, {
                trang_thai: trangThaiMoi,
                da_thanh_toan: trangThaiMoi === 'da_giao' ? true : undefined,
                ...(trangThaiMoi === 'da_huy' ? { ly_do_huy: lyDoHuy, nguoi_huy: 'admin' } : {})
            });
            const thongBaoText = trangThaiMoi === 'da_giao'
                ? 'Giao hàng thành công! Đơn hàng đã hoàn tất.'
                : trangThaiMoi === 'da_huy'
                    ? 'Đã hủy đơn hàng! Tồn kho sản phẩm đã được hoàn trả.'
                    : 'Đã cập nhật trạng thái đơn hàng thành công!';
            const kieuThongBao = trangThaiMoi === 'da_giao' ? 'success' : trangThaiMoi === 'da_huy' ? 'warning' : 'info';
            hienThongBao(thongBaoText, kieuThongBao, 'Kho & Đơn Hàng');
            taiDuLieuToanBo();
        } catch (err) {
            canhBao({ tieuDe: 'Không Thể Đổi Trạng Thái Đơn Hàng', noiDung: err.message, loai: 'danger' });
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
            canhBao({ tieuDe: 'Không Thể Cập Nhật Thanh Toán', noiDung: err.message, loai: 'danger' });
        } finally {
            setDangXuLyDonHangId(null);
        }
    };

    const xuLyXoaDonHang = (id, maDon) => thucHienXoaAdmin({
        id,
        tieuDeXacNhan: 'Xóa Đơn Hàng Này?',
        noiDungXacNhan: `Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng: "${maDon}"?`,
        nutXacNhan: 'Xóa Đơn Hàng',
        xoaApi: () => DonHangService.xoaDonHang(id),
        thongBaoThanhCong: `Đã xóa đơn hàng ${maDon}!`,
        tieuDeLoi: 'Không Thể Xóa Đơn Hàng',
        setDangXuLy: setDangXuLyDonHangId
    });

    // ==========================================
    // HÀM XỬ LÝ HÃNG & THƯƠNG HIỆU
    // ==========================================
    const moModalThemDanhMuc = () => {
        setDmDangSua(null);
        setFormDm({
            ma_danh_muc: '',
            ten_danh_muc: '',
            loai: locLoaiDanhMuc,
            nhom_hang: 'phu_kien',
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
            canhBao({ tieuDe: 'Không Thể Lưu Danh Mục', noiDung: err.message, loai: 'danger' });
        } finally {
            setDangLuuDanhMuc(false);
        }
    };

    const xuLyToggleDanhMuc = (dm) => thucHienToggleAdmin({
        item: dm,
        layId: (x) => x.id || x._id || x.ma_danh_muc,
        truong: 'kich_hoat',
        giaTriHienTai: dm.kich_hoat !== false,
        setDanhSach: setDanhSachDanhMuc,
        apiCapNhat: (id, patch) => DanhMucService.capNhatDanhMuc(id, patch),
        thongBaoBat: `Đã kích hoạt: "${dm.ten_danh_muc}"`,
        thongBaoTat: `Đã tạm ngưng: "${dm.ten_danh_muc}"`,
        nhom: 'Hãng & Phân Khúc'
    });

    const xuLyXoaDanhMuc = (dm) => thucHienXoaAdmin({
        id: dm.id || dm._id || dm.ma_danh_muc,
        tieuDeXacNhan: 'Xóa Thương Hiệu / Danh Mục?',
        noiDungXacNhan: `Bạn có chắc chắn muốn xóa thương hiệu "${dm.ten_danh_muc}" khỏi hệ thống?`,
        nutXacNhan: 'Xóa Thương Hiệu',
        xoaApi: () => DanhMucService.xoaDanhMuc(dm.id || dm._id || dm.ma_danh_muc),
        thongBaoThanhCong: `Đã xóa thương hiệu "${dm.ten_danh_muc}"!`,
        tieuDeLoi: 'Không Thể Xóa Thương Hiệu',
        setDangXuLy: setDangXuLyDmId
    });

    // ==========================================
    // HÀM XỬ LÝ KHÁCH HÀNG & THÀNH VIÊN (NGÀY GIỜ CHUẨN VIỆT NAM)
    // ==========================================
    const layChiTietThoiGianKhachHang = (user) => {
        if (!user) return { gio: '--:--', ngay: '--/--/----', full: 'Chưa rõ' };

        let d = null;

        // 1. Kiểm tra trường createdAt chuẩn của MongoDB / Mongoose
        if (user.createdAt) {
            const parsed = new Date(user.createdAt);
            if (!isNaN(parsed.getTime())) d = parsed;
        }

        // 2. Kiểm tra ID timestamp dạng usr_17... hoặc gg_17...
        if (!d && typeof user.id === 'string') {
            const cleanId = user.id.replace('usr_', '').replace('gg_', '');
            const ts = parseInt(cleanId, 10);
            if (!isNaN(ts) && ts > 1600000000000) {
                const parsed = new Date(ts);
                if (!isNaN(parsed.getTime())) d = parsed;
            }
        }

        // 3. Xử lý nếu có chuỗi ngayTao sẵn
        if (!d && user.ngayTao && typeof user.ngayTao === 'string') {
            const timeMatch = user.ngayTao.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
            const dateMatch = user.ngayTao.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
            if (dateMatch) {
                const ngay = dateMatch[1].padStart(2, '0');
                const thang = dateMatch[2].padStart(2, '0');
                const nam = dateMatch[3];
                if (timeMatch) {
                    const gio = timeMatch[1].padStart(2, '0');
                    const phut = timeMatch[2].padStart(2, '0');
                    const giay = timeMatch[3] ? timeMatch[3].padStart(2, '0') : '00';
                    return {
                        gio: `${gio}:${phut}:${giay}`,
                        gioNgan: `${gio}:${phut}`,
                        ngay: `${ngay}/${thang}/${nam}`,
                        full: `${gio}:${phut}:${giay} - ${ngay}/${thang}/${nam}`
                    };
                }
                // Nếu chỉ có ngày mà chưa có giờ, tính giờ giả định ổn định
                const hashGio = (Math.abs((user.email || user.hoTen || 'khach').charCodeAt(0) * 7) % 14) + 8;
                const hashPhut = (Math.abs((user.email || user.hoTen || 'hang').charCodeAt(1 || 0) * 11) % 60);
                const gioStr = String(hashGio).padStart(2, '0');
                const phutStr = String(hashPhut).padStart(2, '0');
                return {
                    gio: `${gioStr}:${phutStr}:00`,
                    gioNgan: `${gioStr}:${phutStr}`,
                    ngay: `${ngay}/${thang}/${nam}`,
                    full: `${gioStr}:${phutStr} - ${ngay}/${thang}/${nam}`
                };
            }
        }

        // 4. Fallback mặc định nếu không có bất kỳ mốc thời gian nào
        if (!d) {
            d = new Date('2026-08-15T08:30:00.000Z');
        }

        const gio = String(d.getHours()).padStart(2, '0');
        const phut = String(d.getMinutes()).padStart(2, '0');
        const giay = String(d.getSeconds()).padStart(2, '0');
        const ngay = String(d.getDate()).padStart(2, '0');
        const thang = String(d.getMonth() + 1).padStart(2, '0');
        const nam = d.getFullYear();

        return {
            gio: `${gio}:${phut}:${giay}`,
            gioNgan: `${gio}:${phut}`,
            ngay: `${ngay}/${thang}/${nam}`,
            full: `${gio}:${phut}:${giay} - ${ngay}/${thang}/${nam}`
        };
    };

    const layNgayTaoKhachHang = (user) => {
        const tg = layChiTietThoiGianKhachHang(user);
        return tg.full;
    };

    const moModalThemUser = () => {
        setUserDangSua(null);
        setFormUser({
            hoTen: '',
            email: '',
            matKhau: '',
            soDienThoai: '',
            vaiTro: 'khach_hang',
            trangThai: 'hoat_dong',
            biKhoa: false,
            lyDoKhoa: ''
        });
        setDangMoModalUser(true);
    };

    // Sinh mật khẩu ngẫu nhiên (đủ ngẫu nhiên, dễ đọc) dùng khi Admin tạo tài khoản mới,
    // thay cho mật khẩu mặc định cố định "123456" trước đây (rủi ro an ninh)
    const taoMatKhauNgauNhien = () => Math.random().toString(36).slice(-6) + Math.random().toString(36).slice(-4).toUpperCase();

    const moModalSuaUser = (u) => {
        setUserDangSua(u);
        setFormUser({
            hoTen: u.hoTen || '',
            email: u.email || '',
            matKhau: '',
            soDienThoai: u.soDienThoai || '',
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
                vaiTro: formUser.vaiTro,
                trangThai: formUser.trangThai || (formUser.biKhoa ? 'bi_khoa' : 'hoat_dong'),
                biKhoa: Boolean(formUser.biKhoa || formUser.trangThai === 'bi_khoa'),
                lyDoKhoa: formUser.lyDoKhoa || ''
            };

            if (formUser.matKhau) {
                payload.matKhau = formUser.matKhau;
            }

            if (userDangSua) {
                const suaId = userDangSua.id || userDangSua._id;
                await NguoiDungService.capNhatNguoiDung(suaId, payload);
                hienThongBao(`Đã cập nhật tài khoản ${payload.email}!`);
                setDanhSachNguoiDung(prev => prev.map(u => {
                    const uId = u.id || u._id;
                    if (uId === suaId) {
                        return { ...u, ...payload };
                    }
                    return u;
                }));
            } else {
                // Tạo mới: sinh mật khẩu ngẫu nhiên (không còn dùng mật khẩu mặc định cố định "123456")
                const matKhauMoiTao = payload.matKhau || taoMatKhauNgauNhien();
                payload.matKhau = matKhauMoiTao;
                payload.id = 'usr_' + Date.now();
                payload.createdAt = new Date().toISOString();
                payload.ngayTao = layNgayTaoKhachHang({ createdAt: new Date() });
                const resThem = await NguoiDungService.themNguoiDung(payload);
                setDanhSachNguoiDung(prev => [resThem?.id || resThem?._id ? resThem : payload, ...prev]);
                await canhBao({
                    tieuDe: 'Đã Tạo Tài Khoản Thành Công',
                    noiDung: `Tài khoản "${payload.email}" đã được tạo với mật khẩu ngẫu nhiên: ${matKhauMoiTao}\n\nVui lòng gửi lại mật khẩu này cho khách hàng (khách nên đổi mật khẩu sau khi đăng nhập lần đầu).`,
                    loai: 'success'
                });
            }

            setDangMoModalUser(false);
            setUserDangSua(null);
        } catch (err) {
            canhBao({ tieuDe: 'Không Thể Lưu Người Dùng', noiDung: err.message, loai: 'danger' });
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

        const capNhat = dangKhoa
            ? { biKhoa: false, trangThai: 'hoat_dong', lyDoKhoa: '' }
            : { biKhoa: true, trangThai: 'bi_khoa', lyDoKhoa: 'Quản trị viên tạm khóa tài khoản' };

        // ⚡ Cập nhật Realtime tại chỗ trên row ngay lập tức (không reload giật lag cả table)
        setDanhSachNguoiDung(prev => prev.map(u => {
            const uId = u.id || u._id;
            if (uId === id) {
                return { ...u, ...capNhat };
            }
            return u;
        }));

        setDangXuLyUserId(id);
        try {
            await NguoiDungService.capNhatNguoiDung(id, capNhat);
            hienThongBao(dangKhoa ? `Đã mở khóa tài khoản ${user.email}!` : `Đã tạm khóa tài khoản ${user.email}!`);
        } catch (err) {
            // Hoàn nguyên trạng thái cũ nếu API báo lỗi
            setDanhSachNguoiDung(prev => prev.map(u => {
                const uId = u.id || u._id;
                if (uId === id) {
                    return user;
                }
                return u;
            }));
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

        // ⚡ Xóa tại chỗ trên row ngay lập tức
        setDanhSachNguoiDung(prev => prev.filter(item => (item.id || item._id) !== id));
        setDangXuLyUserId(id);
        try {
            await NguoiDungService.xoaNguoiDung(id);
            hienThongBao(`Đã xóa tài khoản ${u.email}!`);
        } catch (err) {
            setDanhSachNguoiDung(prev => [u, ...prev]);
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

        // ⚡ Cập nhật vai trò tại chỗ trên row ngay lập tức
        setDanhSachNguoiDung(prev => prev.map(u => {
            const uId = u.id || u._id;
            if (uId === id) return { ...u, vaiTro: vaiTroMoi };
            return u;
        }));

        setDangXuLyUserId(id);
        try {
            await NguoiDungService.capNhatNguoiDung(id, { vaiTro: vaiTroMoi });
            hienThongBao(`Đã cập nhật quyền tài khoản ${user.email}!`);
        } catch (err) {
            setDanhSachNguoiDung(prev => prev.map(u => {
                const uId = u.id || u._id;
                if (uId === id) return user;
                return u;
            }));
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
            ngay_bat_dau: vc.ngay_bat_dau || '',
            ngay_het_han: vc.ngay_het_han_chuan || '',
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
            canhBao({ tieuDe: 'Không Thể Lưu Mã Giảm Giá', noiDung: err.message, loai: 'danger' });
        } finally {
            setDangLuuVoucher(false);
        }
    };

    const xuLyToggleVoucher = (voucher) => thucHienToggleAdmin({
        item: voucher,
        layId: (x) => x.id || x.ma_code || x._id,
        truong: 'kich_hoat',
        giaTriHienTai: voucher.kich_hoat !== false,
        setDanhSach: setDanhSachVoucher,
        apiCapNhat: (id, patch) => MaGiamGiaService.capNhatMaGiamGia(id, patch),
        thongBaoBat: `Đã kích hoạt mã: "${voucher.ma_code}"`,
        thongBaoTat: `Đã tạm ẩn mã: "${voucher.ma_code}"`,
        nhom: 'Mã Khuyến Mãi'
    });

    const xuLyXoaVoucher = (voucher) => thucHienXoaAdmin({
        id: voucher.id || voucher.ma_code || voucher._id,
        tieuDeXacNhan: 'Xóa Mã Giảm Giá?',
        noiDungXacNhan: `Bạn có chắc muốn xóa mã voucher: "${voucher.ma_code}"?`,
        nutXacNhan: 'Xóa Voucher',
        xoaApi: () => MaGiamGiaService.xoaMaGiamGia(voucher.id || voucher.ma_code || voucher._id),
        thongBaoThanhCong: `Đã xóa voucher "${voucher.ma_code}"!`,
        tieuDeLoi: 'Không Thể Xóa Voucher',
        setDangXuLy: setDangXuLyVoucherId
    });

    // ==========================================
    // HÀM XỬ LÝ TIN TỨC & BÀI VIẾT
    // ==========================================
    const moModalThemTinTuc = () => {
        setTinTucDangSua(null);
        setFormTinTuc({
            // eslint-disable-next-line react-hooks/purity -- chạy trong handler click mở modal thêm tin tức, không phải lúc render
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
    const moModalSuaTin = moModalSuaTinTuc;

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
            canhBao({ tieuDe: 'Không Thể Lưu Bài Viết', noiDung: err.message, loai: 'danger' });
        } finally {
            setDangLuuTinTuc(false);
        }
    };

    const xuLyToggleXuatBanTinTuc = (tin) => thucHienToggleAdmin({
        item: tin,
        truong: 'xuat_ban',
        giaTriHienTai: tin.xuat_ban !== false,
        setDanhSach: setDanhSachTinTuc,
        apiCapNhat: (id, patch) => TinTucService.capNhatTinTuc(id, patch),
        thongBaoBat: `Đã xuất bản: "${rutGonTen(tin.tieu_de, 26)}"`,
        thongBaoTat: `Đã chuyển về bản nháp: "${rutGonTen(tin.tieu_de, 26)}"`,
        nhom: 'Tin Tức & Bài Viết'
    });

    const xuLyToggleTieuDiemTinTuc = (tin) => thucHienToggleAdmin({
        item: tin,
        truong: 'la_tieu_diem',
        giaTriHienTai: Boolean(tin.la_tieu_diem),
        setDanhSach: setDanhSachTinTuc,
        apiCapNhat: (id, patch) => TinTucService.capNhatTinTuc(id, patch),
        thongBaoBat: `Đã ghim Tiêu Điểm: "${rutGonTen(tin.tieu_de, 26)}"`,
        thongBaoTat: `Đã bỏ ghim Tiêu Điểm: "${rutGonTen(tin.tieu_de, 26)}"`,
        nhom: 'Tin Tiêu Điểm Hot',
        loaiBat: 'deal'
    });

    const xuLyXoaTinTuc = (tin, tieuDeThamKhao) => {
        const id = typeof tin === 'object' && tin !== null ? (tin.id || tin._id) : tin;
        const tieuDe = (typeof tin === 'object' && tin !== null ? tin.tieu_de : tieuDeThamKhao) || 'Bài viết';
        return thucHienXoaAdmin({
            id,
            tieuDeXacNhan: 'Xóa Bài Viết Tin Tức?',
            noiDungXacNhan: `Bạn có chắc muốn xóa bài viết: "${tieuDe}"?`,
            nutXacNhan: 'Xóa Bài Viết',
            xoaApi: () => TinTucService.xoaTinTuc(id),
            thongBaoThanhCong: `Đã xóa bài viết "${tieuDe}"!`,
            tieuDeLoi: 'Không Thể Xóa Bài Viết',
            setDangXuLy: setDangXuLyTinTucId
        });
    };

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
    const thongSoCauHinhShowroom = { xuLyThemShowroomMoi, dangLuuShowroom, xuLyLuuShowroom, danhSachShowroomAdmin, showroomDangXemTruoc, setShowroomDangXemTruoc, xuLyXoaShowroom, xuLyThayDoiShowroom };

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
    const thongSoModalSanPham = { NhanDaSua,dangLuuSp,dangMoModalSp,danhSachHangThucTe,demSoMucDaSua,dongModalSpAnToan,formSp,formSpGoc,hienOUrlAnhChinh,hienThongBao,layClassInput,layClassInputTuyChinh,loaiFormSanPham,setDangXemTruocCard,setFormSp,setHienOUrlAnhChinh,setLoaiFormSanPham,setModalXemAnh,setTabModalSp,setThongSoTuyChinh,spDangSua,tabModalSp,thongSoTuyChinh,xacNhan,xuLyLuuSanPham,xuLyUploadAnhBienThe,xuLyUploadAnhChinh,xuLyUploadAnhGallerySp };

    const thongSoOverlayXemSanPham = { daSoSanhXemTruoc,dacDiemNoiBatXemTruoc,dangXemTruocCard,giaGocHienTaiXemTruoc,giaHienTaiXemTruoc,kieuXemTruoc,modalXemAnh,sanPhamXemTruoc,setDaSoSanhXemTruoc,setDangXemTruocCard,setKieuXemTruoc,setModalXemAnh,setTabChiTietXemTruoc,setTuyChonXemTruoc,tabChiTietXemTruoc,tienTietKiemXemTruoc,tuyChonHienTaiXemTruoc };

    const thongSoQuanLySanPham = { locNganhHang, setLocNganhHang, locHangSanPham, setLocHangSanPham, danhSachSanPham, thongKe, sanPhamHienThi, tuKhoaSanPham, setTuKhoaSanPham, moModalThemSp, locTonKhoSanPham, setLocTonKhoSanPham, sapXepSanPham, setSapXepSanPham, danhSachHangThucTe, dangTai, dangLocSanPham, layThongSoNhanhAdmin, dangXuLySpId, dangLuuSp, setModalXemAnh, xuLyToggleConHang, xuLyToggleFlashSale, moModalSuaSp, xuLyXoaSanPham };

    // Props truyền cho Tab "Quản Lý Khách Hàng" (component tách riêng để giảm phình file admin/page.jsx)
    const thongSoModalKhachHang = { dangMoModalUser, setDangMoModalUser, userDangSua, formUser, setFormUser, xuLyLuuUser, dangLuuUser };

    const thongSoQuanLyKhachHang = { danhSachNguoiDung, danhSachKhachHangKemDoanhThu, tuKhoaKhachHang, setTuKhoaKhachHang, locKhachHang, setLocKhachHang, sapXepKhachHang, setSapXepKhachHang, moModalThemUser, khachHangHienThi, dangTai, dangLocKhachHang, dangXuLyUserId, layChiTietThoiGianKhachHang, xuLyKhoaNguoiDung, xuLyDoiVaiTroNguoiDung, moModalSuaUser, xuLyXoaUser };

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

                            {/* 10. Yêu Cầu Tư Vấn & CSKH */}
                            <button
                                onClick={() => { setTabHienTai('lien_he'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'lien_he'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-blue-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Yêu Cầu Tư Vấn & CSKH"
                            >
                                <div className="relative flex items-center gap-3">
                                    <Headphones className="w-5 h-5 shrink-0" />
                                    {soLuongChuaXuLyLienHe > 0 && sidebarThuGon && (
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900 animate-ping"></span>
                                    )}
                                    {!sidebarThuGon && <span>Yêu Cầu Tư Vấn</span>}
                                </div>
                                {!sidebarThuGon && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                                        soLuongChuaXuLyLienHe > 0
                                            ? 'bg-amber-500 text-white animate-pulse'
                                            : tabHienTai === 'lien_he'
                                            ? 'bg-white/20 text-white'
                                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                    }`}>
                                        {soLuongChuaXuLyLienHe > 0 ? `${soLuongChuaXuLyLienHe} mới` : 'CSKH'}
                                    </span>
                                )}
                            </button>

                            {/* 11. Quản Lý Đánh Giá Sản Phẩm */}
                            <button
                                onClick={() => { setTabHienTai('danh_gia'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'danh_gia'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-amber-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Quản Lý Đánh Giá Sản Phẩm"
                            >
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Đánh Giá</span>}
                                </div>
                            </button>

                            {/* 12. Quản Lý Bảo Hành */}
                            <button
                                onClick={() => { setTabHienTai('bao_hanh'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'bao_hanh'
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-emerald-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Quản Lý Bảo Hành"
                            >
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Bảo Hành</span>}
                                </div>
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
                                                                tabHienTai === 'lien_he' ? 'Quản Lý Yêu Cầu Tư Vấn & CSKH' :
                                                                    tabHienTai === 'danh_gia' ? 'Quản Lý Đánh Giá Sản Phẩm' :
                                                                        tabHienTai === 'bao_hanh' ? 'Quản Lý Bảo Hành' :
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
                        <TongQuanTab {...thongSoTongQuanTab} />
                    )}

                    {/* ========================================= */}
                    {/* TAB 2: QUẢN LÝ ĐƠN HÀNG */}
                    {/* ========================================= */}
                    {tabHienTai === 'don_hang' && (
                        <QuanLyDonHang {...thongSoQuanLyDonHang} />
                    )}

                    {/* ========================================= */}
                    {/* TAB 3: KHO SẢN PHẨM */}
                    {/* ========================================= */}
                    {tabHienTai === 'san_pham' && (
                        <QuanLySanPham {...thongSoQuanLySanPham} />
                    )}

                    {/* ========================================= */}
                    {/* TAB 4: HÃNG & THƯƠNG HIỆU */}
                    {/* ========================================= */}
                    {tabHienTai === 'danh_muc' && (
                        <QuanLyDanhMuc {...thongSoQuanLyDanhMuc} />
                    )}

                    {/* ========================================= */}
                    {/* TAB 5: KHÁCH HÀNG (CRM DOANH THU & TIỀM NĂNG) */}
                    {/* ========================================= */}
                    {tabHienTai === 'khach_hang' && (
                        <QuanLyKhachHang {...thongSoQuanLyKhachHang} />
                    )}

                    {/* ========================================= */}
                    {/* TAB 6: MÃ KHUYẾN MÃI (BẢNG ĐẲNG CẤP CHUẨN MẪU) */}
                    {/* ========================================= */}
                    {tabHienTai === 'voucher' && (
                        <QuanLyVoucher {...thongSoQuanLyVoucher} />
                    )}

                    {/* ========================================= */}
                    {/* TAB 7: TIN TỨC & BÀI VIẾT (QUẢN TRỊ TOÀN DIỆN) */}
                    {/* ========================================= */}
                    {tabHienTai === 'tin_tuc' && (
                        <QuanLyTinTuc {...thongSoQuanLyTinTuc} />
                    )}

                    {/* ========================================= */}
                    {/* TAB 8: CẤU HÌNH BANNER & CHIẾN DỊCH KHUYẾN MÃI (DỮ LIỆU ĐỘNG) */}
                    {/* ========================================= */}
                    {tabHienTai === 'khuyen_mai' && (
                        <CauHinhKhuyenMai {...thongSoCauHinhKhuyenMai} />
                    )}

                    {/* ========================================================= */}
                    {/* TAB 9: QUẢN LÝ SHOWROOM & TỌA ĐỘ GPS BẢN ĐỒ (100% REALTIME) */}
                    {/* ========================================================= */}
                    {tabHienTai === 'showroom' && (
                        <CauHinhShowroom {...thongSoCauHinhShowroom} />
                    )}

                    {/* TAB 10: QUẢN LÝ YÊU CẦU TƯ VẤN & CSKH (MONGODB + EXPRESS REALTIME) */}
                    {/* ========================================================= */}
                    {tabHienTai === 'lien_he' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <QuanLyLienHeTuVan onCapNhatSoLuongChuaXuLy={setSoLuongChuaXuLyLienHe} xacNhan={xacNhan} />
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* TAB 11: QUẢN LÝ ĐÁNH GIÁ SẢN PHẨM */}
                    {/* ========================================================= */}
                    {tabHienTai === 'danh_gia' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <QuanLyDanhGia xacNhan={xacNhan} />
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* TAB 12: QUẢN LÝ BẢO HÀNH */}
                    {/* ========================================================= */}
                    {tabHienTai === 'bao_hanh' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <QuanLyBaoHanh xacNhan={xacNhan} />
                        </div>
                    )}
                </main>
            </div>

            <ModalSanPham {...thongSoModalSanPham} />

            <OverlayXemSanPham {...thongSoOverlayXemSanPham} />


            <ModalDonHang {...thongSoModalDonHang} />

            <ModalThuongHieu {...thongSoModalThuongHieu} />

            <ModalKhachHang {...thongSoModalKhachHang} />

            <ModalVoucher {...thongSoModalVoucher} />

            <ModalChiTietDonHang {...thongSoModalChiTietDonHang} />


            <ModalTinTuc {...thongSoModalTinTuc} />
        </div>
    );
}
