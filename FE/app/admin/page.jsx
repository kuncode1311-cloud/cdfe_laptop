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
    Heart,
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
import { taoSlug, slugTinTuc } from '@/utils/taoSlug';
import { inHoaDonBanHang } from '@/utils/inHoaDon';
import TheSanPham from '@/components/san-pham/TheSanPham';
import BangThongSoKyThuat from '@/components/san-pham/BangThongSoKyThuat';
import ThuVienAnhSanPham from '@/components/san-pham/ThuVienAnhSanPham';
import KhoHangChiNhanh from '@/components/san-pham/KhoHangChiNhanh';
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
import { LienHeService } from '@/services/lien-he.service';
import { taoHandlerXoa, taoHandlerToggleTruong } from '@/hooks/admin/useXuLyAdmin';
import { toast } from 'sonner';

// Helper an toàn tránh runtime ReferenceError khi format tiền tệ
const dinhDangVND = (so) => dinhDangTienVND(Number(so) || 0);

// Component thanh tiêu đề nhóm thông số kỹ thuật hỗ trợ nút Sửa Tiêu Đề trực tiếp & inline edit
function ThanhTieuDeNhom({
    icon: IconComponent,
    value,
    defaultValue,
    onChange,
    mauBg = 'bg-blue-50 dark:bg-blue-950/60',
    mauBorder = 'border-blue-200 dark:border-blue-800',
    mauText = 'text-blue-900 dark:text-blue-300',
    mauIconBg = 'bg-blue-600',
    mauBadge = 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
}) {
    const [dangSua, setDangSua] = useState(false);
    const tieuDeHienThi = value !== undefined && value !== '' ? value : defaultValue;
    const daTuyChinh = Boolean(value && value !== defaultValue);

    return (
        <div className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${mauBg} ${mauBorder}`}>
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <span className={`w-6 h-6 rounded-lg text-white flex items-center justify-center text-xs shadow-xs shrink-0 ${mauIconBg}`}>
                    {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
                </span>
                {dangSua ? (
                    <input
                        type="text"
                        autoFocus
                        value={tieuDeHienThi}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={() => setDangSua(false)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                setDangSua(false);
                            }
                        }}
                        placeholder="Nhập tên tiêu đề nhóm mới..."
                        className="bg-white dark:bg-slate-800 border-2 border-blue-500 dark:border-blue-400 rounded-lg px-2.5 py-1 text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider focus:outline-none w-full shadow-xs"
                    />
                ) : (
                    <div className="flex items-center gap-2 truncate">
                        <span
                            onClick={() => setDangSua(true)}
                            className={`font-black text-xs uppercase tracking-wider truncate cursor-pointer hover:underline ${mauText}`}
                            title="Bấm vào đây hoặc nút 'Sửa tiêu đề' bên phải để đổi tên"
                        >
                            {tieuDeHienThi}
                        </span>
                        {daTuyChinh && (
                            <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-black shrink-0 border border-amber-300 dark:border-amber-700">
                                Đã sửa
                            </span>
                        )}
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={() => setDangSua(!dangSua)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 hover:scale-105 active:scale-95 ${
                    dangSua
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : `${mauBadge} hover:opacity-90`
                }`}
                title={dangSua ? "Xong (Enter)" : "Bấm để đổi tên tiêu đề nhóm"}
            >
                <Edit3 className="w-3 h-3" />
                <span>{dangSua ? 'Xong' : 'Sửa tiêu đề'}</span>
            </button>
        </div>
    );
}

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
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (ev.target?.result) {
                setFormTinTuc(prev => ({ ...prev, hinh_anh: ev.target.result }));
                hienThongBao('Đã tải hình ảnh bài viết từ máy tính lên thành công!');
            }
        };
        reader.readAsDataURL(file);
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
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (ev.target?.result) {
                setFormDm(prev => ({ ...prev, logo: ev.target.result }));
                hienThongBao('Đã tải logo thương hiệu từ máy tính lên thành công!');
            }
        };
        reader.readAsDataURL(file);
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

        let daDoc = 0;
        const ketQua = [];
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    ketQua.push(ev.target.result);
                }
                daDoc++;
                if (daDoc === validFiles.length) {
                    setFormSp(prev => ({
                        ...prev,
                        thu_vien_hinh_anh: [...(prev.thu_vien_hinh_anh || []), ...ketQua]
                    }));
                    hienThongBao(`Đã thêm thành công ${ketQua.length} ảnh vào thư viện sản phẩm!`);
                }
            };
            reader.readAsDataURL(file);
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
        setDangXuLyDonHangId(id);
        try {
            await DonHangService.capNhatDonHang(id, {
                trang_thai: trangThaiMoi,
                da_thanh_toan: trangThaiMoi === 'da_giao' ? true : undefined
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

    // Props truyền cho Tab "Mã Khuyến Mãi & Voucher" (component tách riêng để giảm phình file admin/page.jsx)
    const thongSoQuanLyVoucher = { danhSachVoucher, voucherHienThi, tuKhoaVoucher, setTuKhoaVoucher, locTrangThaiVoucher, setLocTrangThaiVoucher, moModalThemVoucher, dangTai, dangLocVoucher, dangXuLyVoucherId, xuLyToggleVoucher, moModalSuaVoucher, xuLyXoaVoucher };

    // Props truyền cho Tab "Tin Tức & Bài Viết" (component tách riêng để giảm phình file admin/page.jsx)
    const thongSoQuanLyTinTuc = { danhSachTinTuc, thongKe, tuKhoaTinTuc, setTuKhoaTinTuc, locChuyenMucTinTuc, setLocChuyenMucTinTuc, locTrangThaiTinTuc, setLocTrangThaiTinTuc, moModalThemTinTuc, tinTucHienThi, dangTai, dangLocTinTuc, dangXuLyTinTucId, xuLyToggleTieuDiemTinTuc, xuLyToggleXuatBanTinTuc, moModalSuaTinTuc, xuLyXoaTinTuc };

    // Props truyền cho Tab "Quản Lý Đơn Hàng" (component tách riêng để giảm phình file admin/page.jsx)
    const thongSoQuanLyDonHang = { danhSachDonHang, donHangHienThi, locTrangThaiDonHang, setLocTrangThaiDonHang, locThanhToanDonHang, setLocThanhToanDonHang, locThoiGianDonHang, setLocThoiGianDonHang, locNgayCuThe, setLocNgayCuThe, sapXepDonHang, setSapXepDonHang, moModalTaoDonHang, xuatExcelDonHang, dangTai, dangLocDonHang, dangXuLyDonHangId, setDonHangChiTiet, xuLyDoiTrangThaiThanhToan, xuLyDoiTrangThaiDonHang, moModalSuaDonHang, xuLyXoaDonHang };

    // Props truyền cho Tab "Kho Sản Phẩm" (component tách riêng để giảm phình file admin/page.jsx)
    const thongSoQuanLySanPham = { locNganhHang, setLocNganhHang, locHangSanPham, setLocHangSanPham, danhSachSanPham, thongKe, sanPhamHienThi, tuKhoaSanPham, setTuKhoaSanPham, moModalThemSp, locTonKhoSanPham, setLocTonKhoSanPham, sapXepSanPham, setSapXepSanPham, danhSachHangThucTe, dangTai, dangLocSanPham, layThongSoNhanhAdmin, dangXuLySpId, dangLuuSp, setModalXemAnh, xuLyToggleConHang, xuLyToggleFlashSale, moModalSuaSp, xuLyXoaSanPham };

    // Props truyền cho Tab "Quản Lý Khách Hàng" (component tách riêng để giảm phình file admin/page.jsx)
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
                                    <span className="truncate">4. Ảnh & Bộ Sưu Tập</span>
                                </button>
                            </div>
                        </div>

                        {/* Form Body Cuộn Độc Lập - Nền Slate-100 Đậm Hơn Giúp Tôn Card Trắng & Đệm Đáy Thoải Mái */}
                        <form onSubmit={xuLyLuuSanPham} className="flex flex-col flex-1 min-h-0">
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs bg-slate-100/70 dark:bg-slate-950/80 pb-28">
                                
                                {/* TAB 1: THÔNG TIN CƠ BẢN & GIÁ BÁN */}
                                {tabModalSp === 'thong_tin' && (
                                    <div className="space-y-4 animate-in fade-in duration-150">
                                        {/* KHỐI 1: ĐỊNH DANH & ẢNH ĐẠI DIỆN SẢN PHẨM */}
                                        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
                                            {/* Header Khối 1 */}
                                            <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                                                <div className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                        <Tag className="w-3.5 h-3.5" />
                                                    </span>
                                                    <span>1. Định Danh & Ảnh Đại Diện Sản Phẩm</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                                                    Bắt buộc
                                                </span>
                                            </div>

                                            <div className="p-4 space-y-3.5">
                                                {/* Hàng 1: Khung Ảnh Thumbnail + Thông Tin Phân Loại SKU/Hãng/Ngành hàng */}
                                                <div className="flex flex-col sm:flex-row gap-4 items-start">
                                                    {/* KHUNG ẢNH ĐẠI DIỆN TRỰC QUAN CÓ UPLOAD FILE TỪ MÁY */}
                                                    <div className="w-full sm:w-auto shrink-0 flex sm:flex-col items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 flex items-center justify-center relative overflow-hidden group shadow-2xs">
                                                            {(formSp.hinh_anh_chinh || formSp.hinh_anh) ? (
                                                                <img
                                                                    src={formSp.hinh_anh_chinh || formSp.hinh_anh}
                                                                    alt=""
                                                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                                                    onError={(e) => { e.currentTarget.src = '/images/sp/asus_rog_scar18.jpg'; }}
                                                                />
                                                            ) : (
                                                                <div className="text-center p-1 text-slate-400">
                                                                    <ImageIcon className="w-6 h-6 mx-auto mb-0.5 opacity-60" />
                                                                    <span className="text-[10px] block font-medium">Chưa có ảnh</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 sm:w-24 flex flex-col gap-1.5">
                                                            {/* Nút upload ảnh từ máy */}
                                                            <label className="w-full px-2 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer shadow-2xs transition-all active:scale-95 text-center">
                                                                <Upload className="w-3 h-3 shrink-0" />
                                                                <span className="truncate">Tải ảnh máy</span>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    onChange={xuLyUploadAnhChinh}
                                                                />
                                                            </label>
                                                            {/* Nút dán link */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setHienOUrlAnhChinh(!hienOUrlAnhChinh)}
                                                                className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                                                            >
                                                                <Link2 className="w-2.5 h-2.5" />
                                                                <span>{hienOUrlAnhChinh ? 'Ẩn link' : 'Dán link'}</span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Lưới 3 trường SKU, Hãng, Ngành Hàng */}
                                                    <div className="flex-1 w-full space-y-3">
                                                        {hienOUrlAnhChinh && (
                                                            <div className="space-y-1">
                                                                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                                    <Link2 className="w-3 h-3 text-blue-500" />
                                                                    <span>Đường dẫn link ảnh online:</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="https://... hoặc /images/sp/..."
                                                                    value={formSp.hinh_anh_chinh || formSp.hinh_anh || ''}
                                                                    onChange={(e) => {
                                                                        setFormSp({ ...formSp, hinh_anh_chinh: e.target.value, hinh_anh: e.target.value });
                                                                    }}
                                                                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
                                                                />
                                                            </div>
                                                        )}

                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                            {/* Mã SKU */}
                                                            <div className="space-y-1">
                                                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between text-xs">
                                                                    <span className="flex items-center gap-1">
                                                                        <Barcode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                                        <span>Mã SKU / Mã SP *</span>
                                                                    </span>
                                                                    <NhanDaSua fieldName="ma_san_pham" />
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    required
                                                                    value={formSp.ma_san_pham}
                                                                    onChange={(e) => setFormSp({ ...formSp, ma_san_pham: e.target.value })}
                                                                    placeholder="VD: G834JYR-R9054W"
                                                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:outline-none transition-all"
                                                                />
                                                            </div>

                                                            {/* Hãng Sản Xuất */}
                                                            <div className="space-y-1">
                                                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 text-xs">
                                                                    <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                                    <span>Hãng Sản Xuất *</span>
                                                                </label>
                                                                <select
                                                                    value={formSp.hang_san_xuat}
                                                                    onChange={(e) => setFormSp({ ...formSp, hang_san_xuat: e.target.value })}
                                                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold capitalize text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
                                                                >
                                                                    {danhSachHangThucTe.map(h => (
                                                                        <option key={h.ma} value={h.ma}>{h.ten}</option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            {/* Nhóm Ngành Hàng */}
                                                            <div className="space-y-1">
                                                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 text-xs">
                                                                    <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                                    <span>Nhóm Ngành Hàng *</span>
                                                                </label>
                                                                <select
                                                                    value={loaiFormSanPham}
                                                                    onChange={(e) => setLoaiFormSanPham(e.target.value)}
                                                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
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
                                                        </div>

                                                        {/* Tên Đầy Đủ Của Sản Phẩm */}
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between text-xs">
                                                                <span className="flex items-center gap-1">
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
                                                                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:outline-none transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* KHỐI 2: THIẾT LẬP GIÁ BÁN & TỒN KHO THỰC TẾ (Sạch sẽ, Tinh Tế, Gọn Gàng) */}
                                        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
                                            {/* Header Khối 2 */}
                                            <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                                                <div className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                        <DollarSign className="w-3.5 h-3.5" />
                                                    </span>
                                                    <span>2. Thiết Lập Giá Bán & Tồn Kho Thực Tế</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                                    Tiền tệ: VNĐ
                                                </span>
                                            </div>

                                            <div className="p-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                                    {/* CỘT 1: GIÁ NIÊM YẾT GỐC */}
                                                    <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                                                        <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between text-xs">
                                                            <span className="flex items-center gap-1">
                                                                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                                                                <span>Giá Niêm Yết Gốc</span>
                                                            </span>
                                                            <NhanDaSua fieldName="gia_goc" />
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={formSp.gia_goc}
                                                            onChange={(e) => setFormSp({ ...formSp, gia_goc: e.target.value })}
                                                            placeholder="VD: 120000000"
                                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-200 text-xs focus:border-blue-500 focus:outline-none"
                                                        />
                                                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-bold flex items-center justify-between px-1">
                                                            <span>Gốc:</span>
                                                            <span className="text-slate-700 dark:text-slate-300">{dinhDangTienVND(formSp.gia_goc)}</span>
                                                        </div>
                                                    </div>

                                                    {/* CỘT 2: GIÁ KHUYẾN MÃI THỰC THU (Tone Rose Điểm Nhấn) */}
                                                    <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-1.5">
                                                        <label className="font-bold text-rose-800 dark:text-rose-300 flex items-center justify-between text-xs">
                                                            <span className="flex items-center gap-1">
                                                                <Flame className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                                                <span>Giá Bán (Thực Thu) *</span>
                                                            </span>
                                                            <NhanDaSua fieldName="gia_khuyen_mai" />
                                                        </label>
                                                        <input
                                                            type="number"
                                                            required
                                                            value={formSp.gia_khuyen_mai}
                                                            onChange={(e) => setFormSp({ ...formSp, gia_khuyen_mai: e.target.value })}
                                                            placeholder="VD: 109990000"
                                                            className="w-full px-3 py-2 rounded-lg border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900 font-black text-rose-600 dark:text-rose-400 text-xs focus:border-rose-500 focus:outline-none"
                                                        />
                                                        <div className="text-[11px] font-bold flex items-center justify-between px-1">
                                                            <span className="text-rose-600 dark:text-rose-400 font-black">{dinhDangTienVND(formSp.gia_khuyen_mai)}</span>
                                                            {Number(formSp.gia_goc) > Number(formSp.gia_khuyen_mai) && (
                                                                <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-black text-[10px]">
                                                                    -{Math.round(((Number(formSp.gia_goc) - Number(formSp.gia_khuyen_mai)) / Number(formSp.gia_goc)) * 100)}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* CỘT 3: TỒN KHO THỰC TẾ (Tone Emerald Điểm Nhấn) */}
                                                    <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
                                                        <label className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-xs">
                                                            <span className="flex items-center gap-1">
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
                                                            className="w-full px-3 py-2 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 font-black text-emerald-700 dark:text-emerald-300 text-xs focus:border-emerald-500 focus:outline-none"
                                                        />
                                                        <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-between px-1">
                                                            <span className="flex items-center gap-1">
                                                                <span className={`w-2 h-2 rounded-full ${Number(formSp.so_luong_ton_kho) > 5 ? 'bg-emerald-500' : Number(formSp.so_luong_ton_kho) > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                                                                <span>{Number(formSp.so_luong_ton_kho) > 5 ? 'Sẵn sàng giao' : Number(formSp.so_luong_ton_kho) > 0 ? 'Sắp hết hàng' : 'Hết hàng'}</span>
                                                            </span>
                                                            <span className="font-black">{formSp.so_luong_ton_kho || 0} máy</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* KHỐI 3: BẢO HÀNH & TRẠNG THÁI KINH DOANH */}
                                        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
                                            {/* Header Khối 3 */}
                                            <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                                                <div className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                        <ShieldCheck className="w-3.5 h-3.5" />
                                                    </span>
                                                    <span>3. Bảo Hành & Trạng Thái Kinh Doanh</span>
                                                </div>
                                                <NhanDaSua fieldName="che_do_bao_hanh" />
                                            </div>

                                            <div className="p-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
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
                                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none transition-all"
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
                                                                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                                                                    formSp.la_flash_sale
                                                                        ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
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
                                                                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                                                                    formSp.la_ban_chay
                                                                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
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
                                                                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                                                                    formSp.con_hang
                                                                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
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
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Cpu}
                                                        value={formSp.tieu_de_nhom_cpu}
                                                        defaultValue="1. Bộ Xử Lý & Hiệu Năng (CPU)"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_cpu: val })}
                                                        mauBg="bg-blue-50 dark:bg-blue-950/60"
                                                        mauBorder="border-blue-200 dark:border-blue-800"
                                                        mauText="text-blue-900 dark:text-blue-300"
                                                        mauIconBg="bg-blue-600"
                                                        mauBadge="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300"
                                                    />
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
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Zap}
                                                        value={formSp.tieu_de_nhom_gpu}
                                                        defaultValue="2. Đồ Họa & Xử Lý Hình Ảnh (GPU)"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_gpu: val })}
                                                        mauBg="bg-purple-50 dark:bg-purple-950/60"
                                                        mauBorder="border-purple-200 dark:border-purple-800"
                                                        mauText="text-purple-900 dark:text-purple-300"
                                                        mauIconBg="bg-purple-600"
                                                        mauBadge="bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300"
                                                    />
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
                                                    <ThanhTieuDeNhom
                                                        icon={HardDrive}
                                                        value={formSp.tieu_de_nhom_ram}
                                                        defaultValue="3. Bộ Nhớ RAM & Ổ Cứng Lưu Trữ (SSD)"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_ram: val })}
                                                        mauBg="bg-emerald-50 dark:bg-emerald-950/60"
                                                        mauBorder="border-emerald-200 dark:border-emerald-800"
                                                        mauText="text-emerald-900 dark:text-emerald-300"
                                                        mauIconBg="bg-emerald-600"
                                                        mauBadge="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300"
                                                    />
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
                                                    <ThanhTieuDeNhom
                                                        icon={Monitor}
                                                        value={formSp.tieu_de_nhom_man_hinh}
                                                        defaultValue="4. Màn Hình & Công Nghệ Hiển Thị"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_man_hinh: val })}
                                                        mauBg="bg-sky-50 dark:bg-sky-950/60"
                                                        mauBorder="border-sky-200 dark:border-sky-800"
                                                        mauText="text-sky-900 dark:text-sky-300"
                                                        mauIconBg="bg-sky-600"
                                                        mauBadge="bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300"
                                                    />
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
                                                    <ThanhTieuDeNhom
                                                        icon={BatteryCharging}
                                                        value={formSp.tieu_de_nhom_pin}
                                                        defaultValue="5. Kích Thước, Pin & Hệ Thống Tản Nhiệt"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_pin: val })}
                                                        mauBg="bg-amber-50 dark:bg-amber-950/60"
                                                        mauBorder="border-amber-200 dark:border-amber-800"
                                                        mauText="text-amber-900 dark:text-amber-300"
                                                        mauIconBg="bg-amber-500"
                                                        mauBadge="bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300"
                                                    />
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
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Radio}
                                                        value={formSp.tieu_de_nhom_thiet_ke}
                                                        defaultValue="6. Cổng Kết Nối, Hệ Điều Hành & Khác"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_thiet_ke: val })}
                                                        mauBg="bg-indigo-50 dark:bg-indigo-950/60"
                                                        mauBorder="border-indigo-200 dark:border-indigo-800"
                                                        mauText="text-indigo-900 dark:text-indigo-300"
                                                        mauIconBg="bg-indigo-600"
                                                        mauBadge="bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300"
                                                    />
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
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Keyboard}
                                                        value={formSp.tieu_de_nhom_phim_switch}
                                                        defaultValue="1. Switch & Cảm Giác Gõ Phím"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_phim_switch: val })}
                                                        mauBg="bg-indigo-50 dark:bg-indigo-950/60"
                                                        mauBorder="border-indigo-200 dark:border-indigo-800"
                                                        mauText="text-indigo-900 dark:text-indigo-300"
                                                        mauIconBg="bg-indigo-600"
                                                        mauBadge="bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300"
                                                    />
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

                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Layers}
                                                        value={formSp.tieu_de_nhom_phim_layout}
                                                        defaultValue="2. Layout, Keycap & Khung Vỏ"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_phim_layout: val })}
                                                        mauBg="bg-purple-50 dark:bg-purple-950/60"
                                                        mauBorder="border-purple-200 dark:border-purple-800"
                                                        mauText="text-purple-900 dark:text-purple-300"
                                                        mauIconBg="bg-purple-600"
                                                        mauBadge="bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300"
                                                    />
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
                                                    <ThanhTieuDeNhom
                                                        icon={Wifi}
                                                        value={formSp.tieu_de_nhom_phim_ket_noi}
                                                        defaultValue="3. Kết Nối, Đèn LED & Pin"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_phim_ket_noi: val })}
                                                        mauBg="bg-emerald-50 dark:bg-emerald-950/60"
                                                        mauBorder="border-emerald-200 dark:border-emerald-800"
                                                        mauText="text-emerald-900 dark:text-emerald-300"
                                                        mauIconBg="bg-emerald-600"
                                                        mauBadge="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300"
                                                    />
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
                                                    <ThanhTieuDeNhom
                                                        icon={Mouse}
                                                        value={formSp.tieu_de_nhom_chuot_cam_bien}
                                                        defaultValue="1. Cảm Biến, DPI & Độ Chính Xác"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_chuot_cam_bien: val })}
                                                        mauBg="bg-violet-50 dark:bg-violet-950/60"
                                                        mauBorder="border-violet-200 dark:border-violet-800"
                                                        mauText="text-violet-900 dark:text-violet-300"
                                                        mauIconBg="bg-violet-600"
                                                        mauBadge="bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300"
                                                    />
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
                                                    <ThanhTieuDeNhom
                                                        icon={BatteryCharging}
                                                        value={formSp.tieu_de_nhom_chuot_ket_noi}
                                                        defaultValue="2. Kết Nối, Kích Thước & Thời Lượng Pin"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_chuot_ket_noi: val })}
                                                        mauBg="bg-emerald-50 dark:bg-emerald-950/60"
                                                        mauBorder="border-emerald-200 dark:border-emerald-800"
                                                        mauText="text-emerald-900 dark:text-emerald-300"
                                                        mauIconBg="bg-emerald-600"
                                                        mauBadge="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300"
                                                    />
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
                                                    <ThanhTieuDeNhom
                                                        icon={Briefcase}
                                                        value={formSp.tieu_de_nhom_balo_ngan_chua}
                                                        defaultValue="1. Ngăn Chứa & Kích Thước Máy"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_balo_ngan_chua: val })}
                                                        mauBg="bg-amber-50 dark:bg-amber-950/60"
                                                        mauBorder="border-amber-200 dark:border-amber-800"
                                                        mauText="text-amber-900 dark:text-amber-300"
                                                        mauIconBg="bg-amber-500"
                                                        mauBadge="bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300"
                                                    />
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
                                                    <ThanhTieuDeNhom
                                                        icon={Layers}
                                                        value={formSp.tieu_de_nhom_balo_chat_lieu}
                                                        defaultValue="2. Chất Liệu & Khả Năng Kháng Nước"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_balo_chat_lieu: val })}
                                                        mauBg="bg-emerald-50 dark:bg-emerald-950/60"
                                                        mauBorder="border-emerald-200 dark:border-emerald-800"
                                                        mauText="text-emerald-900 dark:text-emerald-300"
                                                        mauIconBg="bg-emerald-600"
                                                        mauBadge="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300"
                                                    />
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
                                                    <ThanhTieuDeNhom
                                                        icon={Headphones}
                                                        value={formSp.tieu_de_nhom_tai_nghe_am_thanh}
                                                        defaultValue="1. Màng Loa, Âm Thanh & Chống Ồn ANC"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_tai_nghe_am_thanh: val })}
                                                        mauBg="bg-rose-50 dark:bg-rose-950/60"
                                                        mauBorder="border-rose-200 dark:border-rose-800"
                                                        mauText="text-rose-900 dark:text-rose-300"
                                                        mauIconBg="bg-rose-600"
                                                        mauBadge="bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300"
                                                    />
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
                                                    <ThanhTieuDeNhom
                                                        icon={BatteryCharging}
                                                        value={formSp.tieu_de_nhom_tai_nghe_ket_noi}
                                                        defaultValue="2. Kết Nối, Micro & Thời Lượng Pin"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_tai_nghe_ket_noi: val })}
                                                        mauBg="bg-emerald-50 dark:bg-emerald-950/60"
                                                        mauBorder="border-emerald-200 dark:border-emerald-800"
                                                        mauText="text-emerald-900 dark:text-emerald-300"
                                                        mauIconBg="bg-emerald-600"
                                                        mauBadge="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300"
                                                    />
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
                                                    <ThanhTieuDeNhom
                                                        icon={Zap}
                                                        value={formSp.tieu_de_nhom_sac_cong_suat}
                                                        defaultValue="1. Công Suất & Công Nghệ Sạc Nhanh GaN"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_sac_cong_suat: val })}
                                                        mauBg="bg-orange-50 dark:bg-orange-950/60"
                                                        mauBorder="border-orange-200 dark:border-orange-800"
                                                        mauText="text-orange-900 dark:text-orange-300"
                                                        mauIconBg="bg-orange-600"
                                                        mauBadge="bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300"
                                                    />
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

                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Usb}
                                                        value={formSp.tieu_de_nhom_sac_cong_ket_noi}
                                                        defaultValue="2. Cổng Kết Nối & Băng Thông Truyền Tải"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_sac_cong_ket_noi: val })}
                                                        mauBg="bg-blue-50 dark:bg-blue-950/60"
                                                        mauBorder="border-blue-200 dark:border-blue-800"
                                                        mauText="text-blue-900 dark:text-blue-300"
                                                        mauIconBg="bg-blue-600"
                                                        mauBadge="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300"
                                                    />
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
                                                    <ThanhTieuDeNhom
                                                        icon={HardDrive}
                                                        value={formSp.tieu_de_nhom_linh_kien_hieu_nang}
                                                        defaultValue="1. Hiệu Năng & Tốc Độ Truyền Tải"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_linh_kien_hieu_nang: val })}
                                                        mauBg="bg-teal-50 dark:bg-teal-950/60"
                                                        mauBorder="border-teal-200 dark:border-teal-800"
                                                        mauText="text-teal-900 dark:text-teal-300"
                                                        mauIconBg="bg-teal-600"
                                                        mauBadge="bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300"
                                                    />
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
                                                    <ThanhTieuDeNhom
                                                        icon={Zap}
                                                        value={formSp.tieu_de_nhom_linh_kien_chuan}
                                                        defaultValue="2. Chuẩn Giao Tiếp & Độ Bền"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_linh_kien_chuan: val })}
                                                        mauBg="bg-cyan-50 dark:bg-cyan-950/60"
                                                        mauBorder="border-cyan-200 dark:border-cyan-800"
                                                        mauText="text-cyan-900 dark:text-cyan-300"
                                                        mauIconBg="bg-cyan-600"
                                                        mauBadge="bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300"
                                                    />
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
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
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
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                                        {/* KHỐI 1: ẢNH ĐẠI DIỆN CHÍNH */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                                                <div className="font-black text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
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
                                                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer shadow-2xs"
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
                                                    className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-2 flex items-center justify-center shrink-0 cursor-zoom-in relative group overflow-hidden shadow-xs"
                                                >
                                                    {(formSp.hinh_anh_chinh || formSp.hinh_anh) ? (
                                                        <>
                                                            <img
                                                                src={formSp.hinh_anh_chinh || formSp.hinh_anh}
                                                                alt=""
                                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                                                onError={(e) => { e.currentTarget.src = '/images/sp/asus_rog_scar18.jpg'; }}
                                                            />
                                                            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-xs gap-1.5">
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

                                                {/* Upload Action Center */}
                                                <div className="flex-1 w-full space-y-3">
                                                    <div>
                                                        <span className="font-bold text-slate-900 dark:text-white text-xs block">
                                                            Tải ảnh đại diện từ máy tính hoặc chọn mẫu nhanh:
                                                        </span>
                                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                                            Chọn tệp ảnh từ máy (JPG, PNG, WebP) - tự động nén tối ưu hiển thị siêu nét.
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2.5">
                                                        {/* Nút chính: Tải file trực tiếp từ máy tính */}
                                                        <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all active:scale-95">
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
                                                            className="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
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
                                                                className="px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
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
                                                                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Chọn nhanh ảnh mẫu laptop chuẩn */}
                                                    <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                                                        <span className="text-slate-400 font-bold">Mẫu nhanh:</span>
                                                        {[
                                                            { ten: '🎮 ROG Strix', src: '/images/sp/asus_rog_scar18.jpg' },
                                                            { ten: '🍎 MacBook Pro', src: '/images/sp/macbook_pro_m3.jpg' },
                                                            { ten: '⚡ Legion Pro', src: '/images/sp/lenovo_legion_pro7.jpg' },
                                                            { ten: '💼 Dell XPS', src: '/images/sp/dell_xps_16.jpg' }
                                                        ].map(m => (
                                                            <button
                                                                key={m.src}
                                                                type="button"
                                                                onClick={() => setFormSp({ ...formSp, hinh_anh_chinh: m.src, hinh_anh: m.src })}
                                                                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer transition-colors"
                                                            >
                                                                {m.ten}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* KHỐI 2: THƯ VIỆN GALLERY SẢN PHẨM (UPLOAD NHIỀU ẢNH TỪ MÁY) */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 gap-2">
                                                <div>
                                                    <div className="font-black text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <ImageIcon className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Thư Viện Ảnh Gallery (Nhiều Góc Chụp)</span>
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-black">
                                                            {(formSp.thu_vien_hinh_anh || []).length} ảnh
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                                        Tải lên nhiều ảnh từ máy tính (góc nghiêng, bàn phím, tản nhiệt, mặt lưng) để khách xem ngoài web.
                                                    </p>
                                                </div>

                                                <label className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all shrink-0 self-start sm:self-auto">
                                                    <Upload className="w-3.5 h-3.5" />
                                                    <span>Tải nhiều ảnh từ máy</span>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={xuLyUploadAnhGallerySp}
                                                    />
                                                </label>
                                            </div>

                                            {/* Grid hiển thị danh sách ảnh Gallery đã tải lên */}
                                            {(!formSp.thu_vien_hinh_anh || formSp.thu_vien_hinh_anh.length === 0) ? (
                                                <div className="text-center py-6 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                                                    <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                        Chưa có ảnh trong thư viện Gallery. Bấm nút "Tải nhiều ảnh từ máy" phía trên để bổ sung.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                                    {formSp.thu_vien_hinh_anh.map((imgUrl, idx) => (
                                                        <div key={idx} className="relative group aspect-square rounded-xl border border-slate-200 dark:border-slate-700 p-1.5 bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden shadow-2xs">
                                                            <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const updated = formSp.thu_vien_hinh_anh.filter((_, i) => i !== idx);
                                                                    setFormSp({ ...formSp, thu_vien_hinh_anh: updated });
                                                                }}
                                                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
                                                                title="Gỡ ảnh này khỏi Gallery"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* KHỐI 3: MÔ TẢ NGẮN & MÔ TẢ CHI TIẾT */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
                                            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
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
                                                    <div className="flex items-center justify-between">
                                                        <label className="font-extrabold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                                                            <span>Bài Viết Giới Thiệu Chuyên Sâu (Hỗ trợ định dạng văn bản chi tiết)</span>
                                                        </label>
                                                        <NhanDaSua fieldName="mo_ta_chi_tiet" />
                                                    </div>
                                                    <textarea
                                                        rows="5"
                                                        placeholder="Viết bài đánh giá chi tiết về thiết kế, màn hình, tản nhiệt, trải nghiệm thực tế..."
                                                        value={formSp.mo_ta_chi_tiet}
                                                        onChange={(e) => setFormSp({ ...formSp, mo_ta_chi_tiet: e.target.value })}
                                                        className={layClassInput('mo_ta_chi_tiet')}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* KHỐI 4: ĐẶC ĐIỂM NỔI BẬT ĐÁNG CHÚ Ý */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 gap-2">
                                                <div>
                                                    <span className="font-black text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                        <span className="w-6 h-6 rounded-lg bg-cyan-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <Sparkles className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Đặc Điểm Nổi Bật Đáng Chú Ý</span>
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-black">
                                                            {formSp.dac_diem_noi_bat?.length || 0} điểm
                                                        </span>
                                                    </span>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                                        💡 Các dòng gạch đầu dòng nổi bật hiển thị ngay cạnh ảnh sản phẩm ở trang chi tiết.
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
                                                <div className="text-center py-6 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                                                    <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                        Chưa thiết lập đặc điểm nổi bật. Bấm nút phía trên để thêm mới.
                                                    </p>
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
                                                                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:border-cyan-500 focus:outline-none transition-all"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg border border-orange-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
                        {/* Header Cam Ấm Áp & Hiện Đại */}
                        <div className="shrink-0 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-5 sm:p-6 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner border border-white/30">
                                    📦
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30">
                                            {donHangDangSua ? 'Cập Nhật' : 'Tạo Đơn'}
                                        </span>
                                        {donHangDangSua && (
                                            <span className="text-[11px] text-orange-100 font-mono font-bold">
                                                {donHangDangSua.ma_don_hang}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-base sm:text-lg font-black !text-white leading-snug">
                                        {donHangDangSua ? 'Cập Nhật Đơn Hàng' : 'Tạo Đơn Hàng Mới'}
                                    </h3>
                                    <p className="text-xs text-orange-100 font-medium">Nhập thông tin giao nhận và sản phẩm xuất kho</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => !dangLuuDonHang && setDangMoModalDonHang(false)}
                                className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white cursor-pointer transition-colors"
                                title="Đóng cửa sổ"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={xuLyLuuDonHang} className="flex flex-col flex-1 min-h-0 bg-slate-50/60 dark:bg-slate-950/70">
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
                                
                                {/* KHỐI 1: THÔNG TIN KHÁCH HÀNG */}
                                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <User className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                                                <span>Khách Hàng / Người Nhận *</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Nguyễn Văn An..."
                                                value={formDonHang.ho_ten}
                                                onChange={(e) => setFormDonHang({ ...formDonHang, ho_ten: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <Phone className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                                                <span>Số Điện Thoại Nhận Hàng *</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="0912345678"
                                                value={formDonHang.so_dien_thoai}
                                                onChange={(e) => setFormDonHang({ ...formDonHang, so_dien_thoai: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold font-mono text-xs focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                            <MapPin className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                                            <span>Địa Chỉ Nhận Hàng Chi Tiết *</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Số nhà, đường phố, phường/xã, quận/huyện..."
                                            value={formDonHang.dia_chi_chi_tiet}
                                            onChange={(e) => setFormDonHang({ ...formDonHang, dia_chi_chi_tiet: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* KHỐI 2: CHỌN SẢN PHẨM & THANH TOÁN */}
                                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                                    {donHangDangSua ? (
                                        // SỬA ĐƠN HÀNG: Danh sách sản phẩm CHỈ HIỂN THỊ (read-only) để đảm bảo an toàn dữ liệu,
                                        // không cho phép thay đổi sản phẩm/số lượng của đơn hàng đã phát sinh tồn kho/thanh toán.
                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <Package className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                                                <span>Sản Phẩm Trong Đơn (Không thể sửa)</span>
                                            </label>
                                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 divide-y divide-slate-200 dark:divide-slate-700">
                                                {(formDonHang.cac_san_pham || []).map((dong, idx) => {
                                                    const sp = danhSachSanPham.find(s => (s.id || s._id) === dong.san_pham_id);
                                                    return (
                                                        <div key={idx} className="px-3 py-2 flex items-center justify-between gap-2 text-xs">
                                                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                                                                {sp?.ten_san_pham || 'Sản phẩm'}
                                                            </span>
                                                            <span className="font-mono font-black text-slate-500 dark:text-slate-400 shrink-0">
                                                                SL: {dong.so_luong}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                                                Để thay đổi sản phẩm của đơn hàng, vui lòng hủy đơn và tạo đơn mới.
                                            </p>
                                        </div>
                                    ) : (
                                        // TẠO ĐƠN HÀNG MỚI: cho phép thêm nhiều dòng sản phẩm trong 1 đơn
                                        <div className="space-y-2.5">
                                            <div className="flex items-center justify-between">
                                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                    <Package className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                                                    <span>Sản Phẩm Đặt Mua *</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={themDongSanPhamDonHang}
                                                    className="px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 text-[11px] font-black flex items-center gap-1 hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-all cursor-pointer"
                                                >
                                                    <PlusCircle className="w-3.5 h-3.5" />
                                                    <span>Thêm Sản Phẩm</span>
                                                </button>
                                            </div>

                                            {(formDonHang.cac_san_pham || []).map((dong, idx) => (
                                                <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 items-center">
                                                    <select
                                                        value={dong.san_pham_id}
                                                        onChange={(e) => capNhatDongSanPhamDonHang(idx, 'san_pham_id', e.target.value)}
                                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-orange-500 focus:outline-none transition-all cursor-pointer"
                                                    >
                                                        <option value="">-- Chọn sản phẩm --</option>
                                                        {danhSachSanPham.map(sp => (
                                                            <option key={sp.id || sp._id} value={sp.id || sp._id}>
                                                                {sp.ten_san_pham} ({dinhDangTienVND(sp.gia_khuyen_mai)})
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={dong.so_luong}
                                                        onChange={(e) => capNhatDongSanPhamDonHang(idx, 'so_luong', e.target.value)}
                                                        className="w-full sm:w-20 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-center text-xs focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                                                        title="Số lượng"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => xoaDongSanPhamDonHang(idx)}
                                                        disabled={(formDonHang.cac_san_pham || []).length <= 1}
                                                        className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer justify-self-start sm:justify-self-auto"
                                                        title="Xóa dòng sản phẩm này"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <CreditCard className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                                                <span>Hình Thức Thanh Toán</span>
                                            </label>
                                            <select
                                                value={formDonHang.hinh_thuc_thanh_toan}
                                                onChange={(e) => setFormDonHang({ ...formDonHang, hinh_thuc_thanh_toan: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-orange-500 focus:outline-none transition-all cursor-pointer"
                                            >
                                                <option value="chuyen_khoan_vietqr">VietQR Chuyển Khoản Ngân Hàng</option>
                                                <option value="thanh_toan_khi_nhan_hang_cod">COD (Thanh toán khi nhận hàng)</option>
                                            </select>
                                        </div>
                                        {!donHangDangSua && (
                                            <div className="space-y-1.5">
                                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                    <Ticket className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                                                    <span>Mã Voucher Giảm Giá</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="VD: SALE2026 / TRIKUN500K..."
                                                    value={formDonHang.ma_giam_gia}
                                                    onChange={(e) => setFormDonHang({ ...formDonHang, ma_giam_gia: e.target.value.toUpperCase() })}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-orange-600 dark:text-orange-400 font-mono font-black text-xs uppercase focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Pinned Footer */}
                            <div className="shrink-0 p-4 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 shadow-md">
                                <button
                                    type="button"
                                    disabled={dangLuuDonHang}
                                    onClick={() => setDangMoModalDonHang(false)}
                                    className={`px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all ${dangLuuDonHang ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    Hủy Bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={dangLuuDonHang}
                                    className={`px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center gap-2 shadow-md shadow-orange-500/25 transition-all ${dangLuuDonHang ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
                                >
                                    {dangLuuDonHang ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    <span>{dangLuuDonHang ? 'Đang lưu đơn hàng...' : (donHangDangSua ? 'Lưu Thay Đổi' : 'Tạo Đơn Hàng')}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL 3: THÊM / SỬA THƯƠNG HIỆU (VỚI QUICK EMOJI PICKER & TẢI LOGO TỪ MÁY) */}
            {/* ========================================================================= */}
            {dangMoModalDanhMuc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md border border-purple-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
                        {/* Header Tím Neon Sang Trọng */}
                        <div className="shrink-0 bg-gradient-to-r from-purple-700 via-fuchsia-700 to-pink-700 text-white p-5 sm:p-6 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner border border-white/30">
                                    <span>🏷️</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30">
                                            {dmDangSua ? 'Cập Nhật' : 'Thêm Mới'}
                                        </span>
                                        <span className="text-[11px] text-purple-100 font-mono font-bold">
                                            {formDm.ma_danh_muc || 'brand-code'}
                                        </span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-black !text-white leading-snug">
                                        {dmDangSua ? 'Chỉnh Sửa' : 'Thêm Mới'} {formDm.loai === 'loai_san_pham' ? 'Loại Sản Phẩm' : formDm.loai === 'nhu_cau' ? 'Nhu Cầu' : 'Thương Hiệu'}
                                    </h3>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => !dangLuuDanhMuc && setDangMoModalDanhMuc(false)}
                                className="p-2 rounded-full bg-white/15 hover:bg-white/30 cursor-pointer transition-colors text-white"
                                title="Đóng cửa sổ"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={xuLyLuuDanhMuc} className="flex flex-col flex-1 min-h-0 bg-slate-50/60 dark:bg-slate-950/70">
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
                                
                                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200/80 dark:border-slate-800 shadow-xs space-y-3.5">
                                    <div className="space-y-1.5">
                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                            <Building2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                            <span>Tên *</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Ví dụ: ASUS, Dell, Lenovo, Apple, MSI, Razer..."
                                            value={formDm.ten_danh_muc}
                                            onChange={(e) => {
                                                const ten = e.target.value;
                                                // Thêm mới: tự sinh mã từ tên (bỏ dấu, thay khoảng trắng bằng dấu gạch)
                                                const ma = ten.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                                                setFormDm({ ...formDm, ten_danh_muc: ten, ...(dmDangSua ? {} : { ma_danh_muc: ma }) });
                                            }}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-purple-500 focus:outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                            <Hash className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                            <span>Mã (tự điền theo tên)</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            readOnly={!!dmDangSua}
                                            placeholder="asus / logitech / ban-phim-co"
                                            value={formDm.ma_danh_muc}
                                            onChange={(e) => setFormDm({ ...formDm, ma_danh_muc: e.target.value.toLowerCase().replace(/s+/g, '-') })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-purple-600 dark:text-purple-400 font-mono font-bold text-xs focus:bg-white focus:border-purple-500 focus:outline-none transition-all read-only:opacity-60"
                                        />
                                        {dmDangSua && <p className="text-[11px] text-slate-500">Không đổi mã khi sửa vì sản phẩm đang dùng mã này.</p>}
                                    </div>

                                </div>
                            </div>

                            {/* Pinned Footer */}
                            <div className="shrink-0 p-4 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 shadow-md">
                                <button
                                    type="button"
                                    disabled={dangLuuDanhMuc}
                                    onClick={() => setDangMoModalDanhMuc(false)}
                                    className={`px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all ${dangLuuDanhMuc ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    Hủy Bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={dangLuuDanhMuc}
                                    className={`px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-2 shadow-md shadow-purple-500/25 transition-all ${dangLuuDanhMuc ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
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
            {/* MODAL 4: THÊM / SỬA KHÁCH HÀNG (VỚI AVATAR PREVIEW & PHÂN QUYỀN SANG TRỌNG) */}
            {/* ========================================================================= */}
            {dangMoModalUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md border border-emerald-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
                        {/* Header Xanh Emerald Thanh Lịch */}
                        <div className="shrink-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 sm:p-6 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner border border-white/30">
                                    👤
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30">
                                            {userDangSua ? 'Cập Nhật' : 'Thêm Mới'}
                                        </span>
                                        <span className="text-[11px] text-emerald-100 font-mono font-bold">
                                            {formUser.vaiTro === 'admin' ? '👑 Admin' : 'Khách hàng'}
                                        </span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-black !text-white leading-snug">
                                        {userDangSua ? 'Cập Nhật Tài Khoản' : 'Thêm Thành Viên Mới'}
                                    </h3>
                                    <p className="text-xs text-emerald-100 font-medium">Thiết lập thông tin người dùng và phân quyền hệ thống</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => !dangLuuUser && setDangMoModalUser(false)}
                                className="p-2 rounded-full bg-white/15 hover:bg-white/30 cursor-pointer transition-colors text-white"
                                title="Đóng cửa sổ"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={xuLyLuuUser} className="flex flex-col flex-1 min-h-0 bg-slate-50/60 dark:bg-slate-950/70">
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
                                
                                {/* AVATAR & THÔNG TIN TÓM TẮT TRỰC QUAN */}
                                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
                                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-lg font-black shrink-0 shadow-md">
                                        {(formUser.hoTen || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="font-black text-slate-900 dark:text-white text-sm truncate">
                                            {formUser.hoTen || 'Người dùng mới'}
                                        </div>
                                        <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px] truncate">
                                            {formUser.email || 'user@example.com'}
                                        </div>
                                        <div className="mt-1 flex items-center gap-1.5">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                formUser.vaiTro === 'admin'
                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                            }`}>
                                                {formUser.vaiTro === 'admin' ? '👑 Quản Trị Viên' : '👤 Khách Hàng'}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                (formUser.trangThai === 'bi_khoa' || formUser.biKhoa)
                                                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                            }`}>
                                                {(formUser.trangThai === 'bi_khoa' || formUser.biKhoa) ? '🔒 Tạm khóa' : '🟢 Hoạt động'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                                    <div className="space-y-1.5">
                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                            <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                            <span>Họ Và Tên *</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Nguyễn Văn An..."
                                            value={formUser.hoTen}
                                            onChange={(e) => setFormUser({ ...formUser, hoTen: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                            <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                            <span>Địa Chỉ Email *</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="user@example.com"
                                            value={formUser.email}
                                            onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-xs focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                            <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                            <span>Số Điện Thoại</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="0912345678"
                                            value={formUser.soDienThoai}
                                            onChange={(e) => setFormUser({ ...formUser, soDienThoai: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold font-mono text-xs focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                                <span>Phân Quyền Vai Trò</span>
                                            </label>
                                            <select
                                                value={formUser.vaiTro}
                                                onChange={(e) => setFormUser({ ...formUser, vaiTro: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-xs focus:bg-white focus:border-emerald-500 focus:outline-none transition-all cursor-pointer"
                                            >
                                                <option value="khach_hang">👤 Khách Hàng</option>
                                                <option value="admin">👑 Quản Trị Viên (Admin)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                                <span>Trạng Thái Tài Khoản</span>
                                            </label>
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
                                                className={`w-full px-3.5 py-2.5 rounded-xl border font-bold text-xs focus:outline-none transition-all cursor-pointer ${
                                                    (formUser.trangThai === 'bi_khoa' || formUser.biKhoa)
                                                        ? 'border-red-400 bg-red-50/60 dark:bg-red-950/30 text-red-700 dark:text-red-300'
                                                        : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:border-emerald-500'
                                                }`}
                                            >
                                                <option value="hoat_dong">🟢 Đang Hoạt Động</option>
                                                <option value="bi_khoa">🔒 Tạm Khóa</option>
                                                <option value="cho_kich_hoat">⏳ Chờ Kích Hoạt OTP</option>
                                            </select>
                                        </div>
                                    </div>

                                    {(formUser.trangThai === 'bi_khoa' || formUser.biKhoa) && (
                                        <div className="space-y-1.5 animate-in fade-in pt-1">
                                            <label className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 text-xs">
                                                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                                                <span>Lý Do Khóa Tài Khoản</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formUser.lyDoKhoa || ''}
                                                onChange={(e) => setFormUser({ ...formUser, lyDoKhoa: e.target.value })}
                                                placeholder="Ví dụ: Vi phạm chính sách / Nghi ngờ spam..."
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-rose-300 dark:border-rose-700 bg-rose-50/30 dark:bg-red-950/20 text-rose-900 dark:text-rose-200 font-medium text-xs focus:outline-none"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pinned Footer */}
                            <div className="shrink-0 p-4 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 shadow-md">
                                <button
                                    type="button"
                                    disabled={dangLuuUser}
                                    onClick={() => setDangMoModalUser(false)}
                                    className={`px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all ${dangLuuUser ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    Hủy Bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={dangLuuUser}
                                    className={`px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-md shadow-emerald-500/25 transition-all ${dangLuuUser ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
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
            {/* MODAL 5: THÊM / SỬA VOUCHER (2 KHỐI SECTION TÁCH NỀN RÕ RÀNG & ICONS ĐẦY ĐỦ) */}
            {/* ========================================================================= */}
            {dangMoModalVoucher && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg border border-rose-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
                        {/* Header Đỏ Rose Sang Trọng */}
                        <div className="shrink-0 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white p-5 sm:p-6 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner border border-white/30">
                                    🎟️
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30">
                                            {voucherDangSua ? 'Cập Nhật' : 'Tạo Mới'}
                                        </span>
                                        <span className="text-[11px] text-rose-100 font-mono font-bold uppercase">
                                            {formVoucher.ma_code || 'VOUCHER-CODE'}
                                        </span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-black !text-white leading-snug">
                                        {voucherDangSua ? 'Sửa Mã Khuyến Mãi' : 'Tạo Voucher Khuyến Mãi Mới'}
                                    </h3>
                                    <p className="text-xs text-rose-100 font-medium">Thiết lập mức giảm giá, giới hạn số lượng và thời hạn</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => !dangLuuVoucher && setDangMoModalVoucher(false)}
                                className="p-2 rounded-full bg-white/15 hover:bg-white/30 cursor-pointer transition-colors text-white"
                                title="Đóng cửa sổ"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={xuLyLuuVoucher} className="flex flex-col flex-1 min-h-0 bg-slate-50/60 dark:bg-slate-950/70">
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
                                
                                {/* KHỐI 1: THÔNG TIN MÃ & MỨC GIẢM GIÁ */}
                                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-xs space-y-3.5">
                                    <div className="flex items-center justify-between pb-2 border-b border-rose-100 dark:border-rose-950">
                                        <span className="font-black text-rose-900 dark:text-rose-300 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                                            <Ticket className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                            <span>1. Mã Voucher & Mức Giảm</span>
                                        </span>
                                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                                            Bắt buộc
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <Ticket className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                                <span>Mã CODE Khuyến Mãi *</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="SALE2026 / TRIKUN500K..."
                                                value={formVoucher.ma_code}
                                                onChange={(e) => setFormVoucher({ ...formVoucher, ma_code: e.target.value.toUpperCase() })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 font-mono font-black text-rose-600 uppercase text-xs focus:bg-white focus:border-rose-500 focus:outline-none transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <BadgePercent className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                                <span>Hình Thức Giảm Giá *</span>
                                            </label>
                                            <select
                                                value={formVoucher.loai_giam}
                                                onChange={(e) => setFormVoucher({ ...formVoucher, loai_giam: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-rose-500 focus:outline-none transition-all cursor-pointer"
                                            >
                                                <option value="tien_mat">💵 Giảm Tiền Mặt (VNĐ)</option>
                                                <option value="phan_tram">📊 Giảm Theo Phần Trăm (%)</option>
                                                <option value="freeship">🚚 Miễn Phí Vận Chuyển</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                            <Gift className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                            <span>Tên / Tiêu Đề Voucher *</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Ưu đãi sinh viên / Tri ân khách hàng thân thiết..."
                                            value={formVoucher.tieu_de}
                                            onChange={(e) => setFormVoucher({ ...formVoucher, tieu_de: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-rose-500 focus:outline-none transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <CircleDollarSign className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                                <span>{formVoucher.loai_giam === 'phan_tram' ? 'Phần Trăm Giảm (%) *' : 'Số Tiền Giảm (VNĐ) *'}</span>
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                placeholder={formVoucher.loai_giam === 'phan_tram' ? 'VD: 15' : 'VD: 500000'}
                                                value={formVoucher.gia_tri_giam}
                                                onChange={(e) => setFormVoucher({ ...formVoucher, gia_tri_giam: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20 font-black text-rose-600 dark:text-rose-400 text-xs focus:bg-white focus:border-rose-500 focus:outline-none transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <ShoppingBag className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                                                <span>Đơn Hàng Tối Thiểu (VNĐ)</span>
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="VD: 10000000"
                                                value={formVoucher.don_hang_toi_thieu}
                                                onChange={(e) => setFormVoucher({ ...formVoucher, don_hang_toi_thieu: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-rose-500 focus:outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* KHỐI 2: ĐIỀU KIỆN ÁP DỤNG & GIAO DIỆN THẺ */}
                                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                        <span className="font-black text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                                            <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                            <span>2. Điều Kiện & Giao Diện Thẻ</span>
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                                <span>Số Lượng Phát Hành</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={formVoucher.so_luong_phat_hanh || 20}
                                                onChange={(e) => setFormVoucher({ ...formVoucher, so_luong_phat_hanh: Number(e.target.value) })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 font-black text-emerald-600 dark:text-emerald-400 text-xs focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                <span>Ngày Hết Hạn Voucher</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={formVoucher.ngay_het_han || '2026-12-31'}
                                                onChange={(e) => setFormVoucher({ ...formVoucher, ngay_het_han: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <Tag className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                                <span>Chuyên Mục Áp Dụng</span>
                                            </label>
                                            <select
                                                value={formVoucher.chuyen_muc || 'toan_san'}
                                                onChange={(e) => setFormVoucher({ ...formVoucher, chuyen_muc: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-purple-500 focus:outline-none transition-all cursor-pointer"
                                            >
                                                <option value="toan_san">🌐 Toàn Sàn</option>
                                                <option value="laptop">💻 Laptop Thường</option>
                                                <option value="gaming">🎮 Laptop Gaming</option>
                                                <option value="sinh_vien">🎓 Sinh Viên / VP</option>
                                                <option value="phu_kien">🎧 Phụ Kiện / Gear</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <Palette className="w-3.5 h-3.5 text-amber-500" />
                                                <span>Tone Màu Thẻ</span>
                                            </label>
                                            <select
                                                value={formVoucher.mau_sac || 'rose'}
                                                onChange={(e) => setFormVoucher({ ...formVoucher, mau_sac: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-amber-500 focus:outline-none transition-all cursor-pointer"
                                            >
                                                <option value="rose">🔴 Đỏ Thắm (Rose)</option>
                                                <option value="blue">🔵 Xanh Dương (Blue)</option>
                                                <option value="orange">🟠 Cam Cháy (Orange)</option>
                                                <option value="purple">🟣 Tím Neon (Purple)</option>
                                                <option value="emerald">🟢 Xanh Lục (Emerald)</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <Flame className="w-3.5 h-3.5 text-rose-500" />
                                                <span>Nhãn Badge Nổi Bật</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="HOT DEAL / GIẢM SỐC..."
                                                value={formVoucher.badge || ''}
                                                onChange={(e) => setFormVoucher({ ...formVoucher, badge: e.target.value.toUpperCase() })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs uppercase focus:bg-white focus:border-rose-500 focus:outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                            <FileText className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                                            <span>Mô Tả Chi Tiết Điều Kiện Áp Dụng</span>
                                        </label>
                                        <textarea
                                            rows="2"
                                            value={formVoucher.mo_ta}
                                            onChange={(e) => setFormVoucher({ ...formVoucher, mo_ta: e.target.value })}
                                            placeholder="Áp dụng cho khách hàng mua laptop gaming hoặc phụ kiện trên 20 triệu..."
                                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:bg-white focus:border-rose-500 focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pinned Footer */}
                            <div className="shrink-0 p-4 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 shadow-md">
                                <button
                                    type="button"
                                    disabled={dangLuuVoucher}
                                    onClick={() => setDangMoModalVoucher(false)}
                                    className={`px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all ${dangLuuVoucher ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    Hủy Bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={dangLuuVoucher}
                                    className={`px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-2 shadow-md shadow-rose-500/25 transition-all ${dangLuuVoucher ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
                                >
                                    {dangLuuVoucher ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    <span>{dangLuuVoucher ? 'Đang lưu voucher...' : (voucherDangSua ? 'Lưu Thay Đổi' : 'Tạo Voucher')}</span>
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
                                onClick={() => {
                                    const dh = donHangChiTiet;
                                    setDonHangChiTiet(null);
                                    moModalSuaDonHang(dh);
                                }}
                                className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 !text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-amber-500/25 transition-all cursor-pointer hover:scale-102"
                            >
                                <Edit3 className="w-4 h-4 !text-white" />
                                <span className="!text-white">Sửa Đơn Hàng</span>
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
            {/* MODAL 7: THÊM / SỬA BÀI VIẾT TIN TỨC (TOÀN DIỆN VỚI TẢI ẢNH & CHỌN MẪU NHANH) */}
            {/* ========================================================================= */}
            {dangMoModalTinTuc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl border border-teal-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
                        {/* Header Xanh Teal Đậm Đà, Sang Trọng */}
                        <div className="shrink-0 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white p-5 sm:p-6 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner border border-white/30">
                                    📰
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30">
                                            {tinTucDangSua ? 'Cập Nhật' : 'Tạo Mới'}
                                        </span>
                                        <span className="text-[11px] text-teal-100 font-mono font-bold">
                                            {formTinTuc.id || 'NEWS-ID'}
                                        </span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-black !text-white leading-snug">
                                        {tinTucDangSua ? 'Chỉnh Sửa Bài Viết Tin Tức' : 'Soạn Thảo Bài Viết Mới'}
                                    </h3>
                                    <p className="text-xs text-teal-100 font-medium hidden sm:block">Đánh giá công nghệ, tư vấn chọn mua laptop và cẩm nang thủ thuật</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => !dangLuuTinTuc && setDangMoModalTinTuc(false)}
                                className="p-2 rounded-full bg-white/15 hover:bg-white/30 cursor-pointer transition-colors text-white"
                                title="Đóng cửa sổ"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={xuLyLuuTinTuc} className="flex flex-col flex-1 min-h-0 bg-slate-50/60 dark:bg-slate-950/70">
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
                                
                                {/* KHỐI 1: TIÊU ĐỀ & ĐỊNH DANH */}
                                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                                    <div className="space-y-1.5">
                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                            <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                            <span>Tiêu Đề Bài Viết *</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Top 5 Laptop Gaming RTX 40 Series Đáng Mua Nhất..."
                                            value={formTinTuc.tieu_de}
                                            onChange={(e) => setFormTinTuc({ ...formTinTuc, tieu_de: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <FolderPlus className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                                <span>Chuyên Mục Bài Viết *</span>
                                            </label>
                                            <select
                                                value={formTinTuc.chuyen_muc}
                                                onChange={(e) => setFormTinTuc({ ...formTinTuc, chuyen_muc: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-teal-500 focus:outline-none transition-all cursor-pointer"
                                            >
                                                <option value="Tư Vấn Mua Sắm">🛒 Tư Vấn Mua Sắm</option>
                                                <option value="Xu Hướng Công Nghệ">🚀 Xu Hướng Công Nghệ</option>
                                                <option value="Đánh Giá & So Sánh">⚖️ Đánh Giá & So Sánh</option>
                                                <option value="Tin Tức Công Nghệ">⚡ Tin Tức Công Nghệ</option>
                                                <option value="Chia Sẻ Kinh Nghiệm">💡 Chia Sẻ Kinh Nghiệm</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <Hash className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                <span>Mã Slug / ID Bài Viết</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="tin-1 / top-5-laptop-2026"
                                                value={formTinTuc.id}
                                                onChange={(e) => setFormTinTuc({ ...formTinTuc, id: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-blue-600 dark:text-blue-400 font-mono font-bold text-xs focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* KHỐI 2: HÌNH ẢNH BÌA - CÓ TẢI FILE TỪ MÁY & CHỌN MẪU NHANH */}
                                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 shadow-xs space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                            <ImageIcon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                            <span>Hình Ảnh Bìa Bài Viết *</span>
                                        </label>
                                        <span className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold">Tải từ máy hoặc chọn mẫu</span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        {/* Ảnh Xem Trước Trực Quan Tỷ Lệ 16:9 */}
                                        <div className="w-full sm:w-44 h-28 rounded-2xl bg-slate-950 overflow-hidden relative shrink-0 border-2 border-teal-300 dark:border-teal-800 shadow-sm group">
                                            <Image
                                                src={formTinTuc.hinh_anh || 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'}
                                                alt="Preview"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-bold transition-opacity">
                                                <span>Ảnh bìa</span>
                                            </div>
                                        </div>

                                        {/* Trung Tâm Thao Tác Tải Ảnh */}
                                        <div className="flex-1 w-full space-y-2.5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {/* Nút Upload trực tiếp từ máy tính */}
                                                <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-teal-500/25 cursor-pointer transition-all active:scale-95 shrink-0">
                                                    <Upload className="w-3.5 h-3.5" />
                                                    <span>Tải ảnh từ máy tính</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={xuLyUploadAnhTinTuc}
                                                    />
                                                </label>

                                                {/* Nút xóa ảnh đưa về mặc định */}
                                                {formTinTuc.hinh_anh && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormTinTuc({ ...formTinTuc, hinh_anh: '/images/tin_gaming_rtx40.jpg' })}
                                                        className="px-3 py-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer"
                                                        title="Đưa về ảnh mặc định"
                                                    >
                                                        Mặc định
                                                    </button>
                                                )}
                                            </div>

                                            {/* Ô nhập đường dẫn link URL trực tiếp */}
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                    <Link2 className="w-3.5 h-3.5" />
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Hoặc dán URL ảnh (https://... hoặc /images/...)"
                                                    value={formTinTuc.hinh_anh}
                                                    onChange={(e) => setFormTinTuc({ ...formTinTuc, hinh_anh: e.target.value })}
                                                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px] focus:bg-white focus:border-teal-500 focus:outline-none transition-all truncate"
                                                />
                                            </div>

                                            {/* Bộ Ảnh Mẫu Công Nghệ Chọn Nhanh 1-Click */}
                                            <div className="pt-1">
                                                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                                                    <Sparkles className="w-3 h-3 text-amber-500" />
                                                    <span>Ảnh mẫu công nghệ chọn nhanh:</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormTinTuc({ ...formTinTuc, hinh_anh: '/images/tin_gaming_rtx40.jpg' })}
                                                        className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[10.5px] font-bold cursor-pointer transition-colors"
                                                    >
                                                        🎮 Laptop Gaming RTX
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormTinTuc({ ...formTinTuc, hinh_anh: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' })}
                                                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10.5px] font-bold cursor-pointer transition-colors"
                                                    >
                                                        🍎 MacBook & VP
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormTinTuc({ ...formTinTuc, hinh_anh: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80' })}
                                                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10.5px] font-bold cursor-pointer transition-colors"
                                                    >
                                                        ⚡ Chip AI Mới
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormTinTuc({ ...formTinTuc, hinh_anh: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80' })}
                                                        className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[10.5px] font-bold cursor-pointer transition-colors"
                                                    >
                                                        ⌨️ Phím Cơ & Gear
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* KHỐI 3: TÁC GIẢ & THỜI LƯỢNG ĐỌC */}
                                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                                <span>Tác Giả Viết Bài *</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formTinTuc.tac_gia}
                                                onChange={(e) => setFormTinTuc({ ...formTinTuc, tac_gia: e.target.value })}
                                                placeholder="Chuyên Gia Công Nghệ TNTP Laptop"
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-teal-500 focus:outline-none transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                                <span>Thời Gian Đọc Ước Tính</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="5 phút đọc..."
                                                value={formTinTuc.thoi_gian_doc}
                                                onChange={(e) => setFormTinTuc({ ...formTinTuc, thoi_gian_doc: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-teal-500 focus:outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* KHỐI 4: TÓM TẮT & NỘI DUNG CHI TIẾT */}
                                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                                    <div className="space-y-1.5">
                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                            <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                            <span>Tóm Tắt Ngắn (Hiển thị thẻ bài viết ngoài trang chủ) *</span>
                                        </label>
                                        <textarea
                                            rows="2"
                                            required
                                            value={formTinTuc.tom_tat}
                                            onChange={(e) => setFormTinTuc({ ...formTinTuc, tom_tat: e.target.value })}
                                            placeholder="Đoạn văn ngắn 1-2 câu tóm lược nội dung bài viết..."
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-slate-900 dark:text-white font-medium text-xs leading-relaxed focus:bg-white focus:border-teal-500 focus:outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between text-xs">
                                            <span className="flex items-center gap-1.5">
                                                <Edit3 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                                <span>Nội Dung Chi Tiết Bài Viết</span>
                                            </span>
                                            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">Dùng ### cho tiêu đề mục</span>
                                        </label>
                                        <textarea
                                            rows="7"
                                            value={formTinTuc.noi_dung}
                                            onChange={(e) => setFormTinTuc({ ...formTinTuc, noi_dung: e.target.value })}
                                            placeholder="Soạn thảo nội dung chi tiết bài viết..."
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-slate-900 dark:text-white font-medium text-xs leading-relaxed focus:bg-white focus:border-teal-500 focus:outline-none transition-all font-mono"
                                        />
                                    </div>

                                    {/* Cài đặt trạng thái xuất bản & tiêu điểm */}
                                    <div className="flex flex-wrap items-center gap-3 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setFormTinTuc({ ...formTinTuc, la_tieu_diem: !formTinTuc.la_tieu_diem })}
                                            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                                                formTinTuc.la_tieu_diem
                                                    ? 'bg-rose-600 text-white border-rose-700 shadow-md shadow-rose-500/25'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                                            }`}
                                        >
                                            <Flame className="w-4 h-4 fill-current" />
                                            <span>🔥 Bài Viết Tiêu Điểm Hot</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormTinTuc({ ...formTinTuc, xuat_ban: !formTinTuc.xuat_ban })}
                                            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                                                formTinTuc.xuat_ban
                                                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-500/25'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                                            }`}
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>🟢 Xuất Bản Ngay (Công Khai)</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Pinned Footer */}
                            <div className="shrink-0 p-4 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 shadow-md">
                                <button
                                    type="button"
                                    disabled={dangLuuTinTuc}
                                    onClick={() => setDangMoModalTinTuc(false)}
                                    className={`px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all ${dangLuuTinTuc ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    Hủy Bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={dangLuuTinTuc}
                                    className={`px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-2 shadow-md shadow-teal-500/25 transition-all ${dangLuuTinTuc ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
                                >
                                    {dangLuuTinTuc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    <span>{dangLuuTinTuc ? 'Đang lưu bài viết...' : (tinTucDangSua ? 'Lưu Thay Đổi' : 'Lưu & Xuất Bản')}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
