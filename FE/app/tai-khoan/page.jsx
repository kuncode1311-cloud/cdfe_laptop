'use client';
import { thoiHanVoucher } from '@/utils/voucherDate';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    User,
    PackageCheck,
    Ticket,
    MapPin,
    Shield,
    Sparkles,
    CheckCircle2,
    Clock,
    Truck,
    AlertCircle,
    ChevronRight,
    Eye,
    EyeOff,
    Edit3,
    Plus,
    Trash2,
    Copy,
    Check,
    ArrowRight,
    Search,
    ShoppingBag,
    Phone,
    Mail,
    Calendar,
    Award,
    RefreshCw,
    X,
    Lock,
    KeyRound,
    ShieldCheck,
    CreditCard,
    Flame,
    CheckCheck,
    ExternalLink,
    Zap,
    BadgePercent,
    Gamepad2,
    Headphones,
    GraduationCap,
    Laptop,
    ShoppingCart,
    ChevronDown,
    ChevronUp,
    Building2,
    Home,
    FileText,
    Crown,
    Printer,
    Filter,
    RotateCcw,
    Package,
    QrCode
} from 'lucide-react';
import { useNguoiDung, locDiaChiHopLe } from '@/contexts/AuthContext';
import { useGioHang } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { DonHangService } from '@/services/don-hang.service';
import { MaGiamGiaService } from '@/services/ma-giam-gia.service';
import { 
    DiaGioiHanhChinhService, 
    khopTuKhoaDiaChi,
    timTinhV2TheoTen,
    DANH_SACH_34_TINH_THANH_SAU_SAP_NHAP
} from '@/services/dia-gioi-hanh-chinh.service';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import ModalThanhToanQR from '@/components/thanh-toan/ModalThanhToanQR';
import ViVoucher from '@/components/tai-khoan/ViVoucher';
import SoDiaChi from '@/components/tai-khoan/SoDiaChi';
import HoSoCaNhan from '@/components/tai-khoan/HoSoCaNhan';
import ModalChonAvatar from '@/components/tai-khoan/ModalChonAvatar';
import LichSuDonHang from '@/components/tai-khoan/LichSuDonHang';
import ModalChiTietDonHangKhachHang from '@/components/tai-khoan/ModalChiTietDonHangKhachHang';
import ModalXacNhanHuyDon from '@/components/tai-khoan/ModalXacNhanHuyDon';
import BaoMatTaiKhoan from '@/components/tai-khoan/BaoMatTaiKhoan';

// Helper lấy ảnh sản phẩm đơn hàng sắc nét 100% (Không bao giờ bị xám)
const layHinhAnhSanPhamDonHang = (sp) => {
    if (sp?.san_pham?.hinh_anh_chinh) return sp.san_pham.hinh_anh_chinh;
    if (sp?.san_pham?.hinh_anh) return sp.san_pham.hinh_anh;
    if (sp?.hinh_anh) return sp.hinh_anh;
    if (sp?.hinh_anh_chinh) return sp.hinh_anh_chinh;
    const ten = (sp?.ten_san_pham || sp?.san_pham?.ten_san_pham || '').toLowerCase();
    if (ten.includes('legion') || ten.includes('lenovo')) return '/images/sp/lenovo_legion_pro7.jpg';
    if (ten.includes('macbook') || ten.includes('apple')) return '/images/sp/macbook_pro_m3.jpg';
    if (ten.includes('zenbook') || ten.includes('asus')) return '/images/sp/asus_zenbook_oled.jpg';
    if (ten.includes('predator') || ten.includes('acer')) return '/images/sp/acer_predator_helios.jpg';
    if (ten.includes('omen') || ten.includes('hp')) return '/images/sp/hp_omen_14.jpg';
    if (ten.includes('xps') || ten.includes('dell')) return '/images/sp/dell_xps_16.jpg';
    return '/images/sp/lenovo_legion_pro7.jpg';
};

// Helper lấy giá tổng tiền sản phẩm đơn hàng chính xác 100% (không bao giờ ra 0đ)
const layGiaSanPhamDonHang = (sp) => {
    if (sp?.tong_tien_muc && sp.tong_tien_muc > 0) return sp.tong_tien_muc;
    const soLuong = sp?.so_luong || 1;
    if (sp?.gia_hien_tai && sp.gia_hien_tai > 0) return sp.gia_hien_tai * soLuong;
    if (sp?.gia_tai_thoi_diem_them && sp.gia_tai_thoi_diem_them > 0) return sp.gia_tai_thoi_diem_them * soLuong;
    if (sp?.gia && sp.gia > 0) return sp.gia * soLuong;
    if (sp?.gia_ban && sp.gia_ban > 0) return sp.gia_ban * soLuong;
    if (sp?.san_pham) {
        const giaSP = sp.san_pham.gia_khuyen_mai || sp.san_pham.gia_ban || sp.san_pham.gia_goc || sp.san_pham.gia || 0;
        const chenhLech = sp.tuy_chon_chon?.chenh_lech_gia || 0;
        if (giaSP > 0) return (giaSP + chenhLech) * soLuong;
    }
    return 0;
};

// Helper lấy đơn giá 1 chiếc máy trong đơn
const layDonGiaSanPham = (sp) => {
    if (sp?.gia_hien_tai && sp.gia_hien_tai > 0) return sp.gia_hien_tai;
    if (sp?.gia_tai_thoi_diem_them && sp.gia_tai_thoi_diem_them > 0) return sp.gia_tai_thoi_diem_them;
    if (sp?.san_pham) {
        const giaSP = sp.san_pham.gia_khuyen_mai || sp.san_pham.gia_ban || sp.san_pham.gia_goc || sp.san_pham.gia || 0;
        const chenhLech = sp.tuy_chon_chon?.chenh_lech_gia || 0;
        return giaSP + chenhLech;
    }
    if (sp?.tong_tien_muc && sp?.so_luong) return Math.round(sp.tong_tien_muc / sp.so_luong);
    return 0;
};

// Helper lấy đường dẫn chi tiết sản phẩm chuẩn để click xem & mua lại
const layDuongDanSanPham = (sp) => {
    const id = sp?.san_pham?.id || sp?.san_pham?._id || sp?.san_pham_id || sp?.id_san_pham || sp?.id;
    if (id) return `/san-pham/${id}`;
    if (sp?.san_pham?.ma_san_pham) return `/san-pham/${encodeURIComponent(sp.san_pham.ma_san_pham)}`;
    return '/san-pham';
};

// Helper icon đại diện cho từng loại Voucher chuẩn trang Khuyến Mãi
const layIconVoucher = (vc) => {
    const maCode = vc?.ma_code?.toUpperCase() || '';
    const chuyenMuc = vc?.chuyen_muc || '';
    if (vc?.mau_sac === 'red' || vc?.mau_sac === 'rose' || maCode.includes('GAMING') || maCode === 'TNTP3TR' || chuyenMuc === 'laptop-gaming') {
        return <Gamepad2 className="w-12 h-12 text-white/35" />;
    }
    if (vc?.mau_sac === 'orange' || vc?.mau_sac === 'amber' || maCode.includes('PHUKIEN') || maCode === 'TNTP500K' || chuyenMuc === 'phu_kien') {
        return <Headphones className="w-12 h-12 text-white/35" />;
    }
    if (vc?.mau_sac === 'purple' || vc?.mau_sac === 'violet' || maCode.includes('SV') || maCode === 'TNTPSV' || chuyenMuc === 'sinh_vien') {
        return <GraduationCap className="w-12 h-12 text-white/35" />;
    }
    return <Laptop className="w-12 h-12 text-white/35" />;
};

// Helper màu sắc Card Voucher Rực Rỡ Chuẩn 100% Khuyến Mãi (Tone Sáng High-Contrast)
const layMauSacVoucher = (vc) => {
    const maCode = vc?.ma_code?.toUpperCase() || '';
    const chuyenMuc = vc?.chuyen_muc || '';
    const mauSac = vc?.mau_sac || '';

    if (mauSac === 'red' || mauSac === 'rose' || maCode.includes('GAMING') || maCode === 'TNTP3TR' || chuyenMuc === 'laptop-gaming') {
        return {
            dauCard: 'bg-gradient-to-r from-[#DE1B45] via-[#E82C54] to-[#F43F5E]',
            mauCode: 'text-[#DE1B45]',
            pillBg: 'bg-[#FFF1F2]',
            pillBorder: 'border-[#FECDD3]',
            nutBam: 'bg-[#DE1B45] hover:bg-[#BD1236] shadow-[0_4px_14px_rgba(222,27,69,0.3)]'
        };
    }
    if (mauSac === 'orange' || mauSac === 'amber' || maCode.includes('PHUKIEN') || maCode === 'TNTP500K' || chuyenMuc === 'phu_kien') {
        return {
            dauCard: 'bg-gradient-to-r from-[#F57400] via-[#FA8200] to-[#FF9800]',
            mauCode: 'text-[#F57400]',
            pillBg: 'bg-[#FFF7ED]',
            pillBorder: 'border-[#FED7AA]',
            nutBam: 'bg-[#F57400] hover:bg-[#D96600] shadow-[0_4px_14px_rgba(245,116,0,0.3)]'
        };
    }
    if (mauSac === 'purple' || mauSac === 'violet' || maCode.includes('SV') || maCode === 'TNTPSV' || chuyenMuc === 'sinh_vien') {
        return {
            dauCard: 'bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7]',
            mauCode: 'text-[#7C3AED]',
            pillBg: 'bg-[#F5F3FF]',
            pillBorder: 'border-[#DDD6FE]',
            nutBam: 'bg-[#7C3AED] hover:bg-[#6D28D9] shadow-[0_4px_14px_rgba(124,58,237,0.3)]'
        };
    }
    return {
        dauCard: 'bg-gradient-to-r from-[#0060E6] via-[#0074F0] to-[#008CFF]',
        mauCode: 'text-[#0060E6]',
        pillBg: 'bg-[#EFF6FF]',
        pillBorder: 'border-[#BFDBFE]',
        nutBam: 'bg-[#0060E6] hover:bg-[#0051C2] shadow-[0_4px_14px_rgba(0,96,230,0.3)]'
    };
};

// Helper xóa dấu tiếng Việt phục vụ tìm kiếm thông minh nhanh chóng
const xoaDauTiengViet = (str = '') => {
    return (str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .trim();
};

// Helper lấy thời gian đơn hàng chuẩn 100% từ Database (ngay_tao hoặc createdAt), tuyệt đối không bịa cứng
const layThoiGianDonHang = (dh) => {
    if (!dh) return '';
    if (dh.ngay_tao) return dh.ngay_tao;
    if (dh.createdAt) {
        try {
            const d = new Date(dh.createdAt);
            if (!isNaN(d.getTime())) {
                const gio = String(d.getHours()).padStart(2, '0');
                const phut = String(d.getMinutes()).padStart(2, '0');
                const ngay = String(d.getDate()).padStart(2, '0');
                const thang = String(d.getMonth() + 1).padStart(2, '0');
                const nam = d.getFullYear();
                return `${gio}:${phut} ${ngay}/${thang}/${nam}`;
            }
        } catch (e) {
            return String(dh.createdAt);
        }
    }
    return '';
};

// Helper phân tích và sinh 4 bước Stepper có mốc thời gian thực từ dữ liệu đơn hàng trong DB
const layCacBuocDonHang = (dh) => {
    if (!dh) return [];
    const laDaGiao = dh.trang_thai === 'da_giao';
    const laDangGiao = dh.trang_thai === 'dang_giao';
    const laDaHuy = dh.trang_thai === 'da_huy';
    const laDangXuLy = !laDaGiao && !laDangGiao && !laDaHuy;

    const lichTrinh = Array.isArray(dh.lich_trinh_giao_hang) ? dh.lich_trinh_giao_hang : [];
    const tgDatHang = lichTrinh[0]?.thoi_gian || layThoiGianDonHang(dh) || 'Đã ghi nhận';
    const tgDongGoi = lichTrinh[1]?.thoi_gian || (laDangXuLy ? 'Đang xử lý' : 'Đã niêm phong');
    const tgVanChuyen = lichTrinh[2]?.thoi_gian || (laDangGiao ? 'Đang giao máy' : laDaGiao ? 'Đã vận chuyển' : 'Chờ xuất kho');
    const tgHoanThanh = lichTrinh[3]?.thoi_gian || (laDaGiao ? 'Đã nhận máy' : 'Dự kiến 1-2 ngày');

    if (laDaHuy) {
        return [
            {
                buoc: 1,
                ten: 'Đặt Hàng',
                moTa: 'Hệ thống tiếp nhận đơn',
                icon: ShoppingBag,
                xong: true,
                hienTai: false,
                thoiGian: tgDatHang
            },
            {
                buoc: 2,
                ten: 'Đã Hủy Đơn',
                moTa: 'Đơn hàng không được tiếp tục xử lý',
                icon: AlertCircle,
                xong: false,
                hienTai: true,
                huy: true,
                thoiGian: lichTrinh[1]?.thoi_gian || layThoiGianDonHang(dh) || 'Đã hủy'
            }
        ];
    }

    return [
        {
            buoc: 1,
            ten: 'Đặt Hàng',
            moTa: 'Hệ thống tiếp nhận đơn',
            icon: ShoppingBag,
            xong: true,
            hienTai: false,
            thoiGian: tgDatHang
        },
        {
            buoc: 2,
            ten: 'Đóng Gói',
            moTa: 'Kiểm định seal & chống sốc',
            icon: PackageCheck,
            xong: laDangGiao || laDaGiao,
            hienTai: laDangXuLy,
            thoiGian: tgDongGoi
        },
        {
            buoc: 3,
            ten: 'Vận Chuyển',
            moTa: 'Viettel Post giao hỏa tốc',
            icon: Truck,
            xong: laDaGiao,
            hienTai: laDangGiao,
            thoiGian: tgVanChuyen
        },
        {
            buoc: 4,
            ten: 'Hoàn Thành',
            moTa: 'Đồng kiểm & kích hoạt BH',
            icon: CheckCircle2,
            xong: laDaGiao,
            hienTai: false,
            thoiGian: tgHoanThanh
        }
    ];
};

// Helper tính % tiến độ giao hàng DUY NHẤT, dùng chung cho badge và thanh progress để luôn khớp nhau
const tinhTienDoPhanTramDonHang = (dh) => {
    if (!dh) return 0;
    if (dh.trang_thai === 'da_giao') return 100;
    if (dh.trang_thai === 'dang_giao') return 75;
    if (dh.trang_thai === 'da_xac_nhan' || dh.trang_thai === 'dang_dong_goi' || dh.trang_thai === 'dang_xu_ly') return 50;
    return 25;
};

// Cấu hình các tab trạng thái đơn hàng & bộ lọc tinh gọn 6 tab chuẩn
const CAC_TAB_TRANG_THAI_DON = [
    { id: 'tat_ca', label: 'Tất cả' },
    { id: 'chua_thanh_toan', label: 'Chưa thanh toán' },
    { id: 'dang_xu_ly', label: 'Đang xử lý' },
    { id: 'dang_giao', label: 'Đang giao' },
    { id: 'da_giao', label: 'Hoàn thành' },
    { id: 'da_huy', label: 'Đã hủy' }
];

// Helper kiểm tra đơn hàng chưa thanh toán (đặc biệt là VietQR hoặc có trạng thái chờ thanh toán)
export const kiemTraChuaThanhToan = (dh) => {
    if (!dh) return false;
    if (dh.trang_thai === 'da_huy') return false;
    if (dh.da_thanh_toan) return false;
    return (
        dh.hinh_thuc_thanh_toan === 'chuyen_khoan_vietqr' ||
        dh.trang_thai === 'cho_thanh_toan' ||
        dh.trang_thai_thanh_toan === 'cho_thanh_toan'
    );
};

// Helper phân tích trạng thái đơn hàng để render badge, màu sắc và lọc click tức thì
const layChiTietTrangThaiDon = (trangThai) => {
    switch (trangThai) {
        case 'cho_thanh_toan':
            return {
                id: 'chua_thanh_toan',
                ten: 'Chờ Thanh Toán',
                pillText: 'Chưa thanh toán',
                badgeBg: 'bg-rose-100 text-rose-950 border-2 border-rose-400',
                dotClass: 'bg-rose-500 animate-pulse',
                activeTabClass: 'bg-rose-600 text-white border-rose-600',
            };
        case 'cho_xac_nhan':
        case 'cho_duyet':
            return {
                id: 'dang_xu_ly',
                ten: 'Chờ Duyệt Kho',
                pillText: 'Chờ duyệt',
                badgeBg: 'bg-amber-100 text-amber-950 border-2 border-amber-400',
                dotClass: 'bg-amber-500 animate-pulse',
                activeTabClass: 'bg-amber-500 text-white border-amber-500',
            };
        case 'da_xac_nhan':
        case 'dang_dong_goi':
        case 'dang_xu_ly':
            return {
                id: 'dang_xu_ly',
                ten: 'Đang Đóng Gói',
                pillText: 'Đang đóng gói',
                badgeBg: 'bg-indigo-100 text-indigo-950 border-2 border-indigo-400',
                dotClass: 'bg-indigo-500 animate-pulse',
                activeTabClass: 'bg-indigo-600 text-white border-indigo-600',
            };
        case 'dang_giao':
        case 'dang_van_chuyen':
            return {
                id: 'dang_giao',
                ten: 'Đang Giao Hàng',
                pillText: 'Đang giao',
                badgeBg: 'bg-sky-100 text-sky-950 border-2 border-sky-400',
                dotClass: 'bg-sky-500 animate-pulse',
                activeTabClass: 'bg-sky-600 text-white border-sky-600',
            };
        case 'da_giao':
        case 'giao_thanh_cong':
            return {
                id: 'da_giao',
                ten: 'Giao Thành Công',
                pillText: 'Hoàn thành',
                badgeBg: 'bg-emerald-100 text-emerald-950 border-2 border-emerald-400',
                dotClass: 'bg-emerald-500',
                activeTabClass: 'bg-emerald-600 text-white border-emerald-600',
            };
        case 'da_huy':
            return {
                id: 'da_huy',
                ten: 'Đã Hủy Đơn',
                pillText: 'Đã hủy',
                badgeBg: 'bg-rose-100 text-rose-950 border-2 border-rose-400',
                dotClass: 'bg-rose-500',
                activeTabClass: 'bg-rose-600 text-white border-rose-600',
            };
        default:
            return {
                id: 'dang_xu_ly',
                ten: 'Đang Xử Lý & Đóng Gói',
                pillText: 'Đang xử lý',
                badgeBg: 'bg-amber-100 text-amber-950 border-2 border-amber-400',
                dotClass: 'bg-amber-500 animate-pulse',
                activeTabClass: 'bg-amber-600 text-white border-amber-600',
            };
    }
};

function NoiDungTrangTaiKhoan() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab') || 'ho-so';

    const {
        nguoiDung,
        daDangNhap,
        moModalDangNhap,
        capNhatHoSo,
        doiMatKhau,
        guiOtpDoiMatKhau,
        dangXuat,
        capNhatViVoucher
    } = useNguoiDung();
    const { themVaoGioHang } = useGioHang();

    const [tabHienTai, setTabHienTai] = useState(tabParam);
    const [thongBao, setThongBao] = useState({ loai: '', noiDung: '' });
    const [avatarLoi, setAvatarLoi] = useState(false);
    const [daCopyId, setDaCopyId] = useState(false);
    const [daGanKetDOM, setDaGanKetDOM] = useState(false);

    useEffect(() => {
        setDaGanKetDOM(true);
    }, []);

    // Đồng bộ URL query param với tab
    useEffect(() => {
        if (tabParam) setTabHienTai(tabParam);
    }, [tabParam]);

    // Hỗ trợ phím Escape để đóng nhanh các modal
    useEffect(() => {
        const xuLyNhanPhim = (e) => {
            if (e.key === 'Escape') {
                setDonHangDangXemChiTiet(null);
                setMoModalChonAvatar(false);
                setDangMoFormDiaChi(false);
            }
        };
        window.addEventListener('keydown', xuLyNhanPhim);
        return () => window.removeEventListener('keydown', xuLyNhanPhim);
    }, []);

    const chuyenTab = (tab) => {
        setTabHienTai(tab);
        router.push(`/tai-khoan?tab=${tab}`, { scroll: false });
        setThongBao({ loai: '', noiDung: '' });
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            setTimeout(() => {
                const el = document.getElementById('khu-vuc-noi-dung-tab');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 60);
        }
    };

    // Tự đóng thông báo sau 4 giây
    useEffect(() => {
        if (thongBao.noiDung) {
            const timer = setTimeout(() => setThongBao({ loai: '', noiDung: '' }), 4000);
            return () => clearTimeout(timer);
        }
    }, [thongBao]);

    // ==========================================
    // 1. STATE & XỬ LÝ HỒ SƠ
    // ==========================================
    const [hoTen, setHoTen] = useState('');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [gioiTinh, setGioiTinh] = useState('nam');
    const [ngaySinh, setNgaySinh] = useState('');
    const [avatarChon, setAvatarChon] = useState('');
    const [dangLuuHoSo, setDangLuuHoSo] = useState(false);
    const [moModalChonAvatar, setMoModalChonAvatar] = useState(false);
    const [daChamHoTen, setDaChamHoTen] = useState(false);
    const [daChamSoDienThoai, setDaChamSoDienThoai] = useState(false);
    const [daChamNgaySinh, setDaChamNgaySinh] = useState(false);

    // Validation realtime cho các trường hồ sơ
    const loiHoTen = useMemo(() => {
        if (!daChamHoTen && !hoTen) return '';
        if (!hoTen || !hoTen.trim()) return 'Họ và tên không được để trống';
        if (hoTen.trim().length < 2) return 'Họ và tên phải có ít nhất 2 ký tự';
        return '';
    }, [hoTen, daChamHoTen]);

    const loiSoDienThoai = useMemo(() => {
        if (!daChamSoDienThoai && !soDienThoai) return '';
        if (soDienThoai.trim()) {
            const regexSDT = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
            if (!regexSDT.test(soDienThoai.trim())) {
                return 'Số điện thoại không hợp lệ (cần 10 số, bắt đầu bằng 03, 05, 07, 08, 09)';
            }
        }
        return '';
    }, [soDienThoai, daChamSoDienThoai]);

    const loiNgaySinh = useMemo(() => {
        if (!daChamNgaySinh && !ngaySinh) return '';
        if (ngaySinh) {
            const d = new Date(ngaySinh);
            const now = new Date();
            if (d > now) return 'Ngày sinh không được ở tương lai';
            if (now.getFullYear() - d.getFullYear() < 10) return 'Bạn phải từ 10 tuổi trở lên để sử dụng';
        }
        return '';
    }, [ngaySinh, daChamNgaySinh]);

    const formHoSoHopLe = !loiHoTen && !loiSoDienThoai && !loiNgaySinh && hoTen.trim().length >= 2;

    useEffect(() => {
        if (nguoiDung) {
            setHoTen(nguoiDung.hoTen || '');
            setSoDienThoai(nguoiDung.soDienThoai || '');
            setGioiTinh(nguoiDung.gioiTinh || 'nam');
            setNgaySinh(nguoiDung.ngaySinh || '');
            // Nếu người dùng chưa chọn avatar hoặc là link ảnh mẫu unsplash cũ thì để trống (hiển thị icon mặc định)
            const avatarHopLe = (nguoiDung.avatar && !nguoiDung.avatar.includes('photo-1534528741775-53994a69daeb')) 
                ? nguoiDung.avatar 
                : '';
            setAvatarChon(avatarHopLe);
            setAvatarLoi(false);
        }
    }, [nguoiDung]);

    const xuLyLuuHoSo = async (e) => {
        e.preventDefault();
        setDaChamHoTen(true);
        setDaChamSoDienThoai(true);
        setDaChamNgaySinh(true);

        if (!hoTen.trim() || hoTen.trim().length < 2) {
            setThongBao({ loai: 'loi', noiDung: 'Vui lòng nhập họ và tên hợp lệ (tối thiểu 2 ký tự)!' });
            return;
        }

        if (loiSoDienThoai) {
            setThongBao({ loai: 'loi', noiDung: loiSoDienThoai });
            return;
        }

        if (loiNgaySinh) {
            setThongBao({ loai: 'loi', noiDung: loiNgaySinh });
            return;
        }

        setDangLuuHoSo(true);
        try {
            await capNhatHoSo({
                hoTen: hoTen.trim(),
                soDienThoai: soDienThoai.trim(),
                gioiTinh,
                ngaySinh,
                avatar: avatarChon
            });
            setThongBao({ loai: 'thanh_cong', noiDung: 'Cập nhật thông tin hồ sơ thành công!' });
        } catch (err) {
            setThongBao({ loai: 'loi', noiDung: err.message || 'Không thể lưu hồ sơ, vui lòng thử lại!' });
        } finally {
            setDangLuuHoSo(false);
        }
    };

    const xuLyChonNhanhAvatar = async (imgUrl) => {
        setAvatarChon(imgUrl);
        setAvatarLoi(false);
        setMoModalChonAvatar(false);
        try {
            await capNhatHoSo({ avatar: imgUrl });
            setThongBao({ loai: 'thanh_cong', noiDung: 'Đã đổi ảnh đại diện mới thành công!' });
        } catch (err) {
            console.error('Lỗi đổi avatar:', err);
        }
    };

    const xuLyXoaAvatar = async () => {
        setAvatarChon('');
        setAvatarLoi(false);
        setMoModalChonAvatar(false);
        try {
            await capNhatHoSo({ avatar: '' });
            setThongBao({ loai: 'thanh_cong', noiDung: 'Đã đặt lại ảnh đại diện về icon mặc định!' });
        } catch (err) {
            console.error('Lỗi xóa avatar:', err);
        }
    };

    const saoChepMaId = (id) => {
        navigator.clipboard.writeText(id);
        setDaCopyId(true);
        setTimeout(() => setDaCopyId(false), 2000);
    };

    // ==========================================
    // 2. STATE & XỬ LÝ ĐƠN HÀNG (TIMELINE REALTIME)
    // ==========================================
    const [danhSachDonHang, setDanhSachDonHang] = useState([]);
    const [dangTaiDonHang, setDangTaiDonHang] = useState(true);
    const [boLocTrangThaiDon, setBoLocTrangThaiDon] = useState('tat_ca');
    const [donHangDangXemChiTiet, setDonHangDangXemChiTiet] = useState(null);
    const [danhSachMoTimeline, setDanhSachMoTimeline] = useState({});
    const [donHangThanhToanQR, setDonHangThanhToanQR] = useState(null);

    const toggleTimeline = (idDonHang) => {
        setDanhSachMoTimeline(prev => ({
            ...prev,
            [idDonHang]: !prev[idDonHang]
        }));
    };

    const [daSaoChepVanDon, setDaSaoChepVanDon] = useState(false);
    const saoChepMaVanDon = (ma) => {
        if (navigator?.clipboard && ma) {
            navigator.clipboard.writeText(ma);
            setDaSaoChepVanDon(true);
            setTimeout(() => setDaSaoChepVanDon(false), 2000);
        }
    };

    // Xử lý mua lại 1 sản phẩm cụ thể trong đơn hàng
    const xuLyMuaLai = (e, sp) => {
        e.stopPropagation();
        const sanPhamGoc = sp.san_pham || sp;
        const idSP = sp.san_pham_id || sp.id_san_pham || sanPhamGoc.id || sanPhamGoc._id || sp.id;
        const donGia = layDonGiaSanPham(sp) || sanPhamGoc.gia_khuyen_mai || sanPhamGoc.gia_goc || 0;
        const sanPhamChuan = {
            ...sanPhamGoc,
            id: idSP,
            ten_san_pham: sp.ten_san_pham || sanPhamGoc.ten_san_pham || 'Laptop Chính Hãng',
            gia_khuyen_mai: donGia,
            gia_goc: sanPhamGoc.gia_goc || donGia,
            hinh_anh_chinh: layHinhAnhSanPhamDonHang(sp)
        };
        themVaoGioHang(sanPhamChuan, sp.tuy_chon_chon, sp.so_luong || 1);
        toast.success(`Đã thêm "${sanPhamChuan.ten_san_pham.slice(0, 32)}..." vào giỏ hàng!`);
    };

    // Khách tự hủy đơn khi Admin chưa xác nhận (đặt nhầm); Server tự hoàn lại tồn kho
    const [donDangHuy, setDonDangHuy] = useState(null);
    const [donCanXacNhanHuy, setDonCanXacNhanHuy] = useState(null);
    const [lyDoHuyChon, setLyDoHuyChon] = useState('');
    const [lyDoHuyKhac, setLyDoHuyKhac] = useState('');
    const CAC_LY_DO_HUY = [
        'Đặt nhầm sản phẩm / cấu hình',
        'Muốn thay đổi địa chỉ hoặc thông tin nhận hàng',
        'Muốn đổi sang sản phẩm khác',
        'Tìm được nơi bán giá tốt hơn',
        'Không còn nhu cầu mua nữa',
        'Khác'
    ];
    const xuLyKhachHuyDon = (e, dh) => {
        e.stopPropagation();
        if (donDangHuy) return;
        setLyDoHuyChon('');
        setLyDoHuyKhac('');
        setDonCanXacNhanHuy(dh);
    };
    const thucHienHuyDon = async () => {
        const dh = donCanXacNhanHuy;
        if (!dh || donDangHuy) return;
        const idDon = dh.id || dh.ma_don_hang;
        const lyDo = lyDoHuyChon === 'Khác' ? (lyDoHuyKhac.trim() ? `Khác: ${lyDoHuyKhac.trim()}` : 'Khác') : lyDoHuyChon;
        setDonDangHuy(idDon);
        try {
            const donMoi = await DonHangService.huyDonHang(idDon, lyDo);
            setDanhSachDonHang((ds) => ds.map((d) => ((d.id || d.ma_don_hang) === idDon ? { ...d, ...(donMoi || {}), trang_thai: 'da_huy' } : d)));
            toast.success(`Đã hủy đơn #${dh.ma_don_hang}`);
        } catch (loi) {
            toast.error(loi?.message || 'Không thể hủy đơn, đơn có thể đã được xác nhận. Vui lòng tải lại trang.');
        } finally {
            setDonDangHuy(null);
            setDonCanXacNhanHuy(null);
        }
    };

    // Xử lý mua lại toàn bộ sản phẩm của đơn hàng
    const xuLyMuaLaiToanBoDon = (e, dh) => {
        e.stopPropagation();
        if (!dh.danh_sach_san_pham || dh.danh_sach_san_pham.length === 0) return;
        dh.danh_sach_san_pham.forEach((sp) => {
            const sanPhamGoc = sp.san_pham || sp;
            const idSP = sp.san_pham_id || sp.id_san_pham || sanPhamGoc.id || sanPhamGoc._id || sp.id;
            const donGia = layDonGiaSanPham(sp) || sanPhamGoc.gia_khuyen_mai || sanPhamGoc.gia_goc || 0;
            const sanPhamChuan = {
                ...sanPhamGoc,
                id: idSP,
                ten_san_pham: sp.ten_san_pham || sanPhamGoc.ten_san_pham || 'Laptop Chính Hãng',
                gia_khuyen_mai: donGia,
                gia_goc: sanPhamGoc.gia_goc || donGia,
                hinh_anh_chinh: layHinhAnhSanPhamDonHang(sp)
            };
            themVaoGioHang(sanPhamChuan, sp.tuy_chon_chon, sp.so_luong || 1);
        });
        toast.success(`Đã thêm toàn bộ ${dh.danh_sach_san_pham.length} sản phẩm của đơn #${dh.ma_don_hang} vào giỏ hàng!`);
    };

    useEffect(() => {
        const taiDonHang = async () => {
            if (!nguoiDung) {
                setDanhSachDonHang([]);
                return;
            }

            setDangTaiDonHang(true);
            try {
                const laAdmin = nguoiDung?.vaiTro === 'admin' || nguoiDung?.role === 'admin';
                if (laAdmin) {
                    // Admin xem tất cả các đơn để quản lý và kiểm tra realtime
                    const tatCa = await DonHangService.layTatCaDonHangAsync();
                    setDanhSachDonHang(tatCa || []);
                } else {
                    const idUsr = nguoiDung.id || nguoiDung._id || '';
                    const emailUsr = (nguoiDung.email || '').trim().toLowerCase();
                    const sdtUsr = (nguoiDung.soDienThoai || nguoiDung.so_dien_thoai || '').trim();

                    const donCuaToi = await DonHangService.layDonHangTheoNguoiDungAsync(idUsr, emailUsr, sdtUsr);
                    setDanhSachDonHang(donCuaToi || []);
                }
            } catch (e) {
                console.error('Lỗi tải đơn hàng:', e);
                setDanhSachDonHang([]);
            } finally {
                setDangTaiDonHang(false);
            }
        };
        taiDonHang();
    }, [nguoiDung]);

    // Xóa sạch trạng thái đơn hàng khi người dùng bấm đăng xuất
    useEffect(() => {
        const xuLyDangXuat = () => {
            setDanhSachDonHang([]);
            setDonHangDangXemChiTiet(null);
            setDonHangThanhToanQR(null);
        };
        if (typeof window !== 'undefined') {
            window.addEventListener('auth:logout', xuLyDangXuat);
            return () => window.removeEventListener('auth:logout', xuLyDangXuat);
        }
    }, []);

    // Đếm số lượng đơn hàng theo từng trạng thái chuẩn xác cho các tab filter
    const soLuongTheoTrangThai = useMemo(() => {
        const counts = {
            tat_ca: danhSachDonHang.length,
            chua_thanh_toan: 0,
            dang_xu_ly: 0,
            dang_giao: 0,
            da_giao: 0,
            da_huy: 0
        };
        danhSachDonHang.forEach(dh => {
            if (kiemTraChuaThanhToan(dh)) {
                counts.chua_thanh_toan++;
            } else {
                const info = layChiTietTrangThaiDon(dh.trang_thai);
                if (counts[info.id] !== undefined) {
                    counts[info.id]++;
                }
            }
        });
        return counts;
    }, [danhSachDonHang]);

    const donHangDaLoc = useMemo(() => {
        if (boLocTrangThaiDon === 'tat_ca') return danhSachDonHang;
        if (boLocTrangThaiDon === 'chua_thanh_toan') {
            return danhSachDonHang.filter(dh => kiemTraChuaThanhToan(dh));
        }
        return danhSachDonHang.filter(dh => {
            if (kiemTraChuaThanhToan(dh)) return false;
            const info = layChiTietTrangThaiDon(dh.trang_thai);
            return info.id === boLocTrangThaiDon;
        });
    }, [danhSachDonHang, boLocTrangThaiDon]);

    // ==========================================
    // 3. STATE & XỬ LÝ VOUCHER (VÍ CỦA TÔI & KHO)
    // ==========================================
    const [danhSachVoucher, setDanhSachVoucher] = useState([]);
    const [dangTaiVoucher, setDangTaiVoucher] = useState(true);
    const [daSaoChepMa, setDaSaoChepMa] = useState('');
    const [cheDoXemVoucher, setCheDoXemVoucher] = useState('vi_cua_toi'); // 'vi_cua_toi' | 'kho_voucher'
    const [boLocVoucher, setBoLocVoucher] = useState('tat_ca');
    const [dangLuuVoucher, setDangLuuVoucher] = useState({});

    useEffect(() => {
        const taiVoucher = async () => {
            setDangTaiVoucher(true);
            try {
                const v = await MaGiamGiaService.layDanhSachMaGiamGiaAsync();
                setDanhSachVoucher(v);
            } catch (e) {
                console.error('Lỗi tải voucher:', e);
            } finally {
                setDangTaiVoucher(false);
            }
        };
        taiVoucher();
    }, []);

    // Danh sách voucher người dùng đã lưu vào ví cá nhân
    const danhSachVoucherTrongVi = useMemo(() => {
        const viCodes = Array.isArray(nguoiDung?.viVoucher) ? nguoiDung.viVoucher : [];
        return danhSachVoucher.filter(vc => viCodes.includes(vc.ma_code));
    }, [danhSachVoucher, nguoiDung]);

    const soLuongVoucherVi = Array.isArray(nguoiDung?.viVoucher) ? nguoiDung.viVoucher.length : 0;

    // Danh sách hiển thị theo chế độ (Ví của tôi hoặc Kho toàn sàn) và theo danh mục lọc
    const danhSachVoucherHienThi = useMemo(() => {
        const danhSachGoc = cheDoXemVoucher === 'vi_cua_toi' ? danhSachVoucherTrongVi : danhSachVoucher;
        if (boLocVoucher === 'tat_ca') return danhSachGoc;
        return danhSachGoc.filter(vc => {
            const ma = vc?.ma_code?.toUpperCase() || '';
            const cm = vc?.chuyen_muc || '';
            if (boLocVoucher === 'laptop-gaming') return cm === 'laptop-gaming' || ma.includes('GAMING') || ma === 'TNTP3TR';
            if (boLocVoucher === 'laptop-van-phong') return cm === 'laptop-van-phong' || ma === 'TNTP2TR' || ma === 'LENOVO2TR';
            if (boLocVoucher === 'phu-kien') return cm === 'phu_kien' || ma.includes('PHUKIEN') || ma === 'TNTP500K';
            if (boLocVoucher === 'sinh-vien') return cm === 'sinh_vien' || ma.includes('SV') || ma === 'TNTPSV';
            return true;
        });
    }, [cheDoXemVoucher, danhSachVoucherTrongVi, danhSachVoucher, boLocVoucher]);

    const saoChepMaVoucher = (code) => {
        navigator.clipboard.writeText(code);
        setDaSaoChepMa(code);
        setTimeout(() => setDaSaoChepMa(''), 2500);
    };

    const xuLyLuuVoucher = async (maCode) => {
        if (!nguoiDung) {
            moModalDangNhap();
            return;
        }
        setDangLuuVoucher(prev => ({ ...prev, [maCode]: true }));
        try {
            const idNguoiDung = nguoiDung.id || nguoiDung._id || nguoiDung.email;
            const res = await MaGiamGiaService.luuMaVoucherVaoViAsync(maCode, idNguoiDung);
            const viHienTai = Array.isArray(nguoiDung?.viVoucher) ? [...nguoiDung.viVoucher] : [];
            if (!viHienTai.includes(maCode)) {
                viHienTai.push(maCode);
                if (typeof capNhatViVoucher === 'function') {
                    capNhatViVoucher(viHienTai);
                } else {
                    nguoiDung.viVoucher = viHienTai;
                }
            }
            setThongBao({ loai: 'thanh_cong', noiDung: `Đã lưu mã ${maCode} thành công vào ví của bạn!` });
        } catch (e) {
            setThongBao({ loai: 'loi', noiDung: 'Lỗi khi lưu mã vào ví, vui lòng thử lại!' });
        } finally {
            setDangLuuVoucher(prev => ({ ...prev, [maCode]: false }));
        }
    };

    // ==========================================
    // 4. STATE & XỬ LÝ SỔ ĐỊA CHỈ (CASCADING API PROVINCES)
    // ==========================================
    const [danhSachDiaChi, setDanhSachDiaChi] = useState([]);
    const [dangMoFormDiaChi, setDangMoFormDiaChi] = useState(false);
    const [idDiaChiSua, setIdDiaChiSua] = useState(null);
    const [daChamDiaChi, setDaChamDiaChi] = useState({ hoTen: false, soDienThoai: false, diaChiChiTiet: false });
    const [formDiaChi, setFormDiaChi] = useState({
        hoTen: '',
        soDienThoai: '',
        diaChiChiTiet: '',
        phuongXa: '',
        quanHuyen: '',
        tinhThanh: '',
        macDinh: false,
        loaiDiaChi: 'nha_rieng'
    });

    const loiDiaChiHoTen = useMemo(() => {
        if (!daChamDiaChi.hoTen && !formDiaChi.hoTen) return '';
        if (!formDiaChi.hoTen || !formDiaChi.hoTen.trim()) return 'Vui lòng nhập họ và tên người nhận';
        if (formDiaChi.hoTen.trim().length < 2) return 'Họ và tên phải có ít nhất 2 ký tự';
        return '';
    }, [formDiaChi.hoTen, daChamDiaChi.hoTen]);

    const loiDiaChiSoDienThoai = useMemo(() => {
        if (!daChamDiaChi.soDienThoai && !formDiaChi.soDienThoai) return '';
        if (!formDiaChi.soDienThoai || !formDiaChi.soDienThoai.trim()) return 'Vui lòng nhập số điện thoại người nhận';
        const regexSDT = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
        if (!regexSDT.test(formDiaChi.soDienThoai.trim())) {
            return 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03, 05, 07, 08, 09)';
        }
        return '';
    }, [formDiaChi.soDienThoai, daChamDiaChi.soDienThoai]);

    const loiDiaChiChiTiet = useMemo(() => {
        if (!daChamDiaChi.diaChiChiTiet && !formDiaChi.diaChiChiTiet) return '';
        if (!formDiaChi.diaChiChiTiet || !formDiaChi.diaChiChiTiet.trim()) return 'Vui lòng nhập số nhà, tên đường chi tiết';
        if (formDiaChi.diaChiChiTiet.trim().length < 3) return 'Địa chỉ chi tiết cần tối thiểu 3 ký tự';
        return '';
    }, [formDiaChi.diaChiChiTiet, daChamDiaChi.diaChiChiTiet]);

    const [danhSachTinh, setDanhSachTinh] = useState(DANH_SACH_34_TINH_THANH_SAU_SAP_NHAP);
    const [danhSachXa, setDanhSachXa] = useState([]);

    // Tải danh sách 34 tỉnh thành sau sáp nhập 2025 (API v2: Tỉnh → Phường/Xã)
    useEffect(() => {
        let isMounted = true;
        DiaGioiHanhChinhService.layDanhSachTinhThanhV2Async().then(res => {
            if (isMounted && Array.isArray(res) && res.length > 0) {
                setDanhSachTinh(res);
            }
        });
        return () => { isMounted = false; };
    }, []);

    // Đồng bộ sổ địa chỉ của người dùng (Loại bỏ triệt để và vĩnh viễn mọi dữ liệu mẫu mock address)
    useEffect(() => {
        if (nguoiDung) {
            const dsHopLe = locDiaChiHopLe(nguoiDung.danhSachDiaChi);
            setDanhSachDiaChi(dsHopLe);
            // Nếu phát hiện dữ liệu người dùng còn chứa địa chỉ mẫu, lập tức đồng bộ làm sạch cả AuthContext & Database
            if (Array.isArray(nguoiDung.danhSachDiaChi) && nguoiDung.danhSachDiaChi.length !== dsHopLe.length) {
                capNhatHoSo({ danhSachDiaChi: dsHopLe }).catch(() => {});
            }
        } else {
            setDanhSachDiaChi([]);
        }
    }, [nguoiDung]);

    // Chọn tỉnh → tải thẳng Phường/Xã của tỉnh (mô hình 2 cấp sau sáp nhập, không còn Quận/Huyện)
    const chonTinhThanh = async (tinh) => {
        setFormDiaChi(prev => ({ ...prev, tinhThanh: tinh.name, quanHuyen: '', phuongXa: '' }));
        setDanhSachXa([]);
        if (tinh.code) {
            const dsXa = await DiaGioiHanhChinhService.layDanhSachPhuongXaTheoTinhAsync(tinh.code);
            setDanhSachXa(dsXa || []);
        }
    };

    const chonPhuongXa = (xa) => {
        setFormDiaChi(prev => ({ ...prev, phuongXa: xa.name }));
    };

    const batDauThemDiaChi = () => {
        setIdDiaChiSua(null);
        setDaChamDiaChi({ hoTen: false, soDienThoai: false, diaChiChiTiet: false });
        setFormDiaChi({
            hoTen: hoTen || nguoiDung?.hoTen || '',
            soDienThoai: soDienThoai || nguoiDung?.soDienThoai || '',
            diaChiChiTiet: '',
            phuongXa: '',
            quanHuyen: '',
            tinhThanh: '',
            macDinh: danhSachDiaChi.length === 0,
            loaiDiaChi: 'nha_rieng'
        });
        setDanhSachXa([]);
        setDangMoFormDiaChi(true);
    };

    const batDauSuaDiaChi = async (dc) => {
        setIdDiaChiSua(dc.id);
        setDaChamDiaChi({ hoTen: false, soDienThoai: false, diaChiChiTiet: false });
        setFormDiaChi({
            hoTen: dc.hoTen || '',
            soDienThoai: dc.soDienThoai || '',
            diaChiChiTiet: dc.diaChiChiTiet || '',
            phuongXa: dc.phuongXa || '',
            quanHuyen: dc.quanHuyen || '',
            tinhThanh: dc.tinhThanh || '',
            macDinh: Boolean(dc.macDinh),
            loaiDiaChi: dc.loaiDiaChi || 'nha_rieng'
        });
        setDangMoFormDiaChi(true);

        const listTinh = await DiaGioiHanhChinhService.layDanhSachTinhThanhV2Async();
        setDanhSachTinh(listTinh);
        if (dc.tinhThanh) {
            // Địa chỉ cũ lưu theo 63 tỉnh được quy đổi sang tỉnh mới để nạp đúng danh sách Phường/Xã
            const foundTinh = timTinhV2TheoTen(dc.tinhThanh, listTinh);
            if (foundTinh) {
                const dsXa = await DiaGioiHanhChinhService.layDanhSachPhuongXaTheoTinhAsync(foundTinh.code);
                setDanhSachXa(dsXa || []);
            }
        }
    };

    const xuLyLuuDiaChi = async (e) => {
        e.preventDefault();
        setDaChamDiaChi({ hoTen: true, soDienThoai: true, diaChiChiTiet: true });

        if (!formDiaChi.hoTen || formDiaChi.hoTen.trim().length < 2) {
            setThongBao({ loai: 'loi', noiDung: 'Vui lòng nhập họ và tên người nhận hợp lệ (tối thiểu 2 ký tự)!' });
            return;
        }

        const regexSDT = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
        if (!formDiaChi.soDienThoai || !regexSDT.test(formDiaChi.soDienThoai.trim())) {
            setThongBao({ loai: 'loi', noiDung: 'Số điện thoại nhận hàng không hợp lệ (cần 10 số, bắt đầu bằng 03, 05, 07, 08, 09)!' });
            return;
        }

        if (!formDiaChi.tinhThanh) {
            setThongBao({ loai: 'loi', noiDung: 'Vui lòng chọn Tỉnh / Thành phố!' });
            return;
        }

        if (!formDiaChi.phuongXa) {
            setThongBao({ loai: 'loi', noiDung: 'Vui lòng chọn Phường / Xã!' });
            return;
        }

        if (!formDiaChi.diaChiChiTiet || formDiaChi.diaChiChiTiet.trim().length < 3) {
            setThongBao({ loai: 'loi', noiDung: 'Vui lòng nhập số nhà, tên đường chi tiết (tối thiểu 3 ký tự)!' });
            return;
        }

        let danhSachMoi;
        if (idDiaChiSua) {
            danhSachMoi = danhSachDiaChi.map(dc => {
                if (dc.id === idDiaChiSua) return { ...dc, ...formDiaChi };
                return formDiaChi.macDinh ? { ...dc, macDinh: false } : dc;
            });
        } else {
            const diaChiMoi = {
                id: 'dc_' + Date.now(),
                ...formDiaChi
            };
            if (formDiaChi.macDinh) {
                danhSachMoi = [diaChiMoi, ...danhSachDiaChi.map(dc => ({ ...dc, macDinh: false }))];
            } else {
                danhSachMoi = [...danhSachDiaChi, diaChiMoi];
            }
        }
        setDanhSachDiaChi(danhSachMoi);
        setDangMoFormDiaChi(false);
        setIdDiaChiSua(null);
        try {
            await capNhatHoSo({ danhSachDiaChi: danhSachMoi });
            setThongBao({ loai: 'thanh_cong', noiDung: 'Đã lưu sổ địa chỉ thành công!' });
        } catch (err) {
            console.error(err);
        }
    };

    const datLamMacDinh = async (id) => {
        const danhSachMoi = danhSachDiaChi.map(dc => ({
            ...dc,
            macDinh: dc.id === id
        }));
        setDanhSachDiaChi(danhSachMoi);
        try {
            await capNhatHoSo({ danhSachDiaChi: danhSachMoi });
            setThongBao({ loai: 'thanh_cong', noiDung: 'Đã thay đổi địa chỉ nhận hàng mặc định!' });
        } catch (err) {
            console.error(err);
        }
    };

    const xoaDiaChi = async (id) => {
        const danhSachMoi = danhSachDiaChi.filter(dc => dc.id !== id);
        setDanhSachDiaChi(danhSachMoi);
        try {
            await capNhatHoSo({ danhSachDiaChi: danhSachMoi });
            setThongBao({ loai: 'thanh_cong', noiDung: 'Đã xóa địa chỉ thành công!' });
        } catch (err) {
            console.error(err);
        }
    };

    // ==========================================
    // 5. STATE & XỬ LÝ ĐỔI MẬT KHẨU / BẢO MẬT
    // ==========================================
    const laTaiKhoanGoogle = nguoiDung?.authProvider === 'google' || Boolean(nguoiDung?.googleId);
    const canNhapMatKhauCu = !laTaiKhoanGoogle || nguoiDung?.coMatKhau;

    const [matKhauCu, setMatKhauCu] = useState('');
    const [matKhauMoi, setMatKhauMoi] = useState('');
    const [otpDoiMatKhau, setOtpDoiMatKhau] = useState('');
    const [daGuiOtpDoiMatKhau, setDaGuiOtpDoiMatKhau] = useState(false);
    const [xacNhanMatKhauMoi, setXacNhanMatKhauMoi] = useState('');
    const [hienMatKhauCu, setHienMatKhauCu] = useState(false);
    const [hienMatKhauMoi, setHienMatKhauMoi] = useState(false);
    const [hienXacNhanMatKhau, setHienXacNhanMatKhau] = useState(false);
    const [dangDoiPass, setDangDoiPass] = useState(false);
    const [daChamMatKhauMoi, setDaChamMatKhauMoi] = useState(false);
    const [daChamXacNhan, setDaChamXacNhan] = useState(false);
    const [loiMatKhauCu, setLoiMatKhauCu] = useState('');
    const [loiMatKhauMoi, setLoiMatKhauMoi] = useState('');
    const [loiChungDoiPass, setLoiChungDoiPass] = useState('');
    const [demNguocDoiPass, setDemNguocDoiPass] = useState(0);

    // Đếm ngược gửi lại OTP đổi mật khẩu
    useEffect(() => {
        let timer;
        if (demNguocDoiPass > 0) {
            timer = setInterval(() => {
                setDemNguocDoiPass((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [demNguocDoiPass]);

    const loiXacNhanMatKhau = useMemo(() => {
        if (!daChamXacNhan && !xacNhanMatKhauMoi) return '';
        if (matKhauMoi && xacNhanMatKhauMoi && matKhauMoi !== xacNhanMatKhauMoi) {
            return 'Mật khẩu xác nhận không trùng khớp';
        }
        return '';
    }, [matKhauMoi, xacNhanMatKhauMoi, daChamXacNhan]);

    // Đo độ mạnh mật khẩu chuẩn quốc tế
    const tieuChiMatKhau = useMemo(() => {
        return {
            doDai: matKhauMoi.length >= 8,
            chuHoaThuong: /[A-Z]/.test(matKhauMoi) && /[a-z]/.test(matKhauMoi),
            chuSoHoacKyTu: /[0-9]/.test(matKhauMoi) || /[^A-Za-z0-9]/.test(matKhauMoi)
        };
    }, [matKhauMoi]);

    const diemDoManh = useMemo(() => {
        if (!matKhauMoi) return 0;
        let d = 0;
        if (tieuChiMatKhau.doDai) d += 35;
        if (tieuChiMatKhau.chuHoaThuong) d += 35;
        if (tieuChiMatKhau.chuSoHoacKyTu) d += 30;
        return d;
    }, [matKhauMoi, tieuChiMatKhau]);

    const xuLyDoiMatKhau = async (e) => {
        e.preventDefault();
        setLoiMatKhauCu('');
        setLoiMatKhauMoi('');
        setLoiChungDoiPass('');

        if (canNhapMatKhauCu && !matKhauCu.trim()) {
            setLoiMatKhauCu('Vui lòng nhập mật khẩu hiện tại đang dùng!');
            return;
        }
        if (matKhauMoi.length < 8 || !/[A-Za-zÀ-ỹ]/.test(matKhauMoi) || !/\d/.test(matKhauMoi)) {
            setLoiMatKhauMoi('Mật khẩu phải có tối thiểu 8 ký tự, gồm cả chữ và số!');
            return;
        }
        if (matKhauMoi !== xacNhanMatKhauMoi) {
            setLoiMatKhauMoi('Mật khẩu xác nhận không trùng khớp!');
            return;
        }

        setDangDoiPass(true);
        try {
            if (!daGuiOtpDoiMatKhau) {
                const res = await guiOtpDoiMatKhau(matKhauCu);
                setDaGuiOtpDoiMatKhau(true);
                setDemNguocDoiPass(60);
                setLoiChungDoiPass('');
                toast.success(res?.thong_diep || `Mã xác thực OTP đã được gửi về email ${nguoiDung?.email || ''}!`);
                return;
            }
            if (otpDoiMatKhau.length !== 6) {
                setLoiChungDoiPass('Vui lòng nhập đủ 6 chữ số mã OTP xác thực.');
                return;
            }
            const res = await doiMatKhau(matKhauMoi, otpDoiMatKhau, matKhauCu);
            toast.success(res?.thong_diep || 'Thiết lập mật khẩu thành công! Giờ đây bạn có thể dùng mật khẩu này để đăng nhập.');
            setMatKhauCu('');
            setMatKhauMoi('');
            setOtpDoiMatKhau('');
            setDaGuiOtpDoiMatKhau(false);
            setXacNhanMatKhauMoi('');
            setLoiChungDoiPass('');
            setDemNguocDoiPass(0);
        } catch (err) {
            const msg = err.message || 'Có lỗi xảy ra, vui lòng thử lại!';
            if (msg.toLowerCase().includes('hiện tại') || msg.toLowerCase().includes('không chính xác')) {
                setLoiMatKhauCu(msg);
                toast.error(msg);
            } else {
                setLoiChungDoiPass(msg);
                toast.error(msg);
            }
        } finally {
            setDangDoiPass(false);
        }
    };

    const xuLyGuiLaiOtpDoiPass = async () => {
        if (dangDoiPass || demNguocDoiPass > 0) return;
        setDangDoiPass(true);
        setLoiChungDoiPass('');
        try {
            const res = await guiOtpDoiMatKhau(matKhauCu);
            setDemNguocDoiPass(60);
            toast.success(res?.thong_diep || `Đã gửi lại mã OTP tới ${nguoiDung?.email}!`);
        } catch (err) {
            const msg = err.message || 'Không thể gửi lại mã OTP.';
            setLoiChungDoiPass(msg);
            toast.error(msg);
        } finally {
            setDangDoiPass(false);
        }
    };

    // Màn hình khi chưa đăng nhập
    if (!daDangNhap) {
        return (
            <div className="max-w-md mx-auto py-20 px-4 text-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white mx-auto flex items-center justify-center mb-6 shadow-xl shadow-blue-500/30 animate-pulse">
                    <User className="w-10 h-10" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">
                    Trung Tâm Tài Khoản TNTP
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mb-8 leading-relaxed">
                    Vui lòng đăng nhập để xem thông tin cá nhân, theo dõi hành trình đơn hàng và quản lý ví voucher độc quyền.
                </p>
                <button
                    onClick={moModalDangNhap}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-blue-500/30 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                    <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
                    <span>Đăng Nhập Tài Khoản Ngay</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        );
    }

    const thongSoViVoucher = { cheDoXemVoucher, setCheDoXemVoucher, soLuongVoucherVi, danhSachVoucher, boLocVoucher, setBoLocVoucher, dangTaiVoucher, danhSachVoucherTrongVi, danhSachVoucherHienThi, layMauSacVoucher, nguoiDung, dangLuuVoucher, layIconVoucher, saoChepMaVoucher, daSaoChepMa, xuLyLuuVoucher };

    const thongSoSoDiaChi = { danhSachDiaChi, batDauThemDiaChi, dangMoFormDiaChi, xuLyLuuDiaChi, idDiaChiSua, setDangMoFormDiaChi, formDiaChi, setFormDiaChi, daChamDiaChi, setDaChamDiaChi, loiDiaChiHoTen, loiDiaChiSoDienThoai, loiDiaChiChiTiet, danhSachTinh, chonTinhThanh, danhSachXa, chonPhuongXa, datLamMacDinh, batDauSuaDiaChi, xoaDiaChi };

    const thongSoHoSoCaNhan = { nguoiDung, hoTen, daCopyId, saoChepMaId, xuLyLuuHoSo, daChamHoTen, loiHoTen, setHoTen, setDaChamHoTen, daChamSoDienThoai, loiSoDienThoai, soDienThoai, setSoDienThoai, setDaChamSoDienThoai, gioiTinh, setGioiTinh, daChamNgaySinh, loiNgaySinh, ngaySinh, setNgaySinh, setDaChamNgaySinh, dangLuuHoSo };

    const thongSoModalChonAvatar = { daGanKetDOM, moModalChonAvatar, setMoModalChonAvatar, xuLyXoaAvatar, avatarChon, xuLyChonNhanhAvatar };

    const thongSoLichSuDonHang = { CAC_TAB_TRANG_THAI_DON, boLocTrangThaiDon, setBoLocTrangThaiDon, soLuongTheoTrangThai, dangTaiDonHang, donHangDaLoc, danhSachDonHang, layChiTietTrangThaiDon, layDuongDanSanPham, layGiaSanPhamDonHang, layDonGiaSanPham, layHinhAnhSanPhamDonHang, danhSachMoTimeline, saoChepMaVanDon, daSaoChepVanDon, tinhTienDoPhanTramDonHang, layCacBuocDonHang, setDonHangDangXemChiTiet, xuLyKhachHuyDon, donDangHuy, kiemTraChuaThanhToan, setDonHangThanhToanQR, xuLyMuaLaiToanBoDon, toggleTimeline, layThoiGianDonHang };

    const thongSoModalChiTietDonHangKhachHang = { daGanKetDOM, donHangDangXemChiTiet, setDonHangDangXemChiTiet, layThoiGianDonHang, saoChepMaVanDon, daSaoChepVanDon, tinhTienDoPhanTramDonHang, layDuongDanSanPham, layGiaSanPhamDonHang, layDonGiaSanPham, layHinhAnhSanPhamDonHang, xuLyMuaLai, kiemTraChuaThanhToan, setDonHangThanhToanQR };

    const thongSoModalXacNhanHuyDon = { daGanKetDOM, donCanXacNhanHuy, setDonCanXacNhanHuy, donDangHuy, CAC_LY_DO_HUY, lyDoHuyChon, setLyDoHuyChon, lyDoHuyKhac, setLyDoHuyKhac, thucHienHuyDon };

    const thongSoBaoMatTaiKhoan = { laTaiKhoanGoogle, nguoiDung, xuLyDoiMatKhau, canNhapMatKhauCu, hienMatKhauCu, matKhauCu, setMatKhauCu, setLoiMatKhauCu, loiMatKhauCu, setHienMatKhauCu, hienMatKhauMoi, matKhauMoi, setMatKhauMoi, setLoiMatKhauMoi, loiMatKhauMoi, setHienMatKhauMoi, diemDoManh, tieuChiMatKhau, daChamXacNhan, loiXacNhanMatKhau, xacNhanMatKhauMoi, hienXacNhanMatKhau, daGuiOtpDoiMatKhau, setXacNhanMatKhauMoi, setDaChamXacNhan, setHienXacNhanMatKhau, demNguocDoiPass, dangDoiPass, xuLyGuiLaiOtpDoiPass, otpDoiMatKhau, setOtpDoiMatKhau, loiChungDoiPass, setDaGuiOtpDoiMatKhau };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-28 sm:pb-20 lg:pb-12 animate-in fade-in duration-300">
            {/* 1. Breadcrumb Tinh Tế & Hiện Đại */}
            <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Link href="/" className="hover:text-blue-600 transition-colors">
                    Trang Chủ
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-700">
                    Tài Khoản
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-extrabold text-blue-600">
                    {tabHienTai === 'ho-so' && 'Hồ Sơ Cá Nhân'}
                    {tabHienTai === 'don-hang' && 'Lịch Sử Đơn Hàng & Lộ Trình'}
                    {tabHienTai === 'voucher' && 'Ví Mã Giảm Giá Đã Săn'}
                    {tabHienTai === 'dia-chi' && 'Sổ Địa Chỉ Giao Hàng'}
                    {tabHienTai === 'bao-mat' && 'Bảo Mật & Mật Khẩu'}
                </span>
            </nav>

            {/* Toast Thông Báo Nổi Bật */}
            {thongBao.noiDung && (
                <div className={`p-4 rounded-2xl border-2 text-xs font-bold flex items-center gap-3 animate-in slide-in-from-top-2 shadow-xl ${
                    thongBao.loai === 'thanh_cong'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                        : 'bg-rose-50 border-rose-400 text-rose-800'
                }`}>
                    {thongBao.loai === 'thanh_cong' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                    <span className="flex-1 font-extrabold">{thongBao.noiDung}</span>
                    <button onClick={() => setThongBao({ loai: '', noiDung: '' })} className="cursor-pointer text-slate-400 hover:text-slate-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Layout 2 Cột: Cuộn Trơn Tru Đồng Bộ (Không đóng băng, không giật lag) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* ========================================================================= */}
                {/* CỘT TRÁI: SIDEBAR ĐỒNG BỘ (BỎ STICKY ĐỂ CUỘN MƯỢT MÀ KHÔNG BỊ ĐỨNG IM)    */}
                {/* ========================================================================= */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-slate-300 shadow-md space-y-4">
                        {/* 1. Header Hồ Sơ Người Dùng */}
                        <div className="flex items-center gap-3 pb-3.5 border-b-2 border-slate-200">
                            <div className="relative w-13 h-13 shrink-0">
                                <div className={`w-13 h-13 rounded-2xl ring-2 ${avatarChon && !avatarLoi ? 'ring-blue-500/40 bg-slate-900' : 'ring-slate-200 bg-slate-100'} overflow-hidden flex items-center justify-center shadow-md relative`}>
                                    {!avatarLoi && avatarChon ? (
                                        <img
                                            src={avatarChon}
                                            alt={hoTen || 'Avatar'}
                                            referrerPolicy="no-referrer"
                                            onError={() => setAvatarLoi(true)}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-6 h-6 text-slate-400" />
                                    )}
                                </div>
                                <button
                                    onClick={() => setMoModalChonAvatar(true)}
                                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-md border-2 border-white cursor-pointer transition-transform hover:scale-110"
                                    title="Đổi ảnh đại diện"
                                >
                                    <Edit3 className="w-3 h-3" />
                                </button>
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm truncate">
                                    <span className="truncate">{hoTen || 'Thành Viên TNTP'}</span>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                </div>
                                <div className="text-[11px] text-slate-500 truncate mt-0.5 font-bold">
                                    {nguoiDung?.email}
                                </div>
                                <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-200 text-blue-900 text-[10px] font-black shadow-2xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                    <span>{nguoiDung?.vaiTro === 'admin' ? '👑 Quản Trị Viên' : 'Tài Khoản Khách Hàng'}</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Thống Kê Nhanh 2 Chỉ Số Thực Tế (Sặc Sỡ, Rực Rỡ & Đậm Màu) */}
                        <div className="grid grid-cols-2 gap-2.5 text-center">
                            <button
                                onClick={() => chuyenTab('don-hang')}
                                className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white border-2 border-amber-300 shadow-md shadow-amber-500/25 hover:scale-102 hover:shadow-lg transition-all cursor-pointer group flex flex-col items-center justify-center"
                            >
                                <div className="flex items-center gap-1.5 text-base sm:text-lg font-black text-white group-hover:scale-105 transition-transform">
                                    <PackageCheck className="w-4.5 h-4.5 text-amber-100" />
                                    <span>{danhSachDonHang.length}</span>
                                </div>
                                <div className="text-[11px] font-black text-amber-100 mt-0.5 tracking-wide">Đơn hàng</div>
                            </button>

                            <button
                                onClick={() => chuyenTab('voucher')}
                                className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-violet-600 text-white border-2 border-purple-300 shadow-md shadow-purple-500/25 hover:scale-102 hover:shadow-lg transition-all cursor-pointer group flex flex-col items-center justify-center"
                            >
                                <div className="flex items-center gap-1.5 text-base sm:text-lg font-black text-white group-hover:scale-105 transition-transform">
                                    <Ticket className="w-4.5 h-4.5 text-purple-100" />
                                    <span>{soLuongVoucherVi}</span>
                                </div>
                                <div className="text-[11px] font-black text-purple-100 mt-0.5 tracking-wide">Kho Voucher</div>
                            </button>
                        </div>

                        {/* 3. MENU 5 TAB TÁCH BIỆT MÀU SẮC & VIỀN ĐẬM NÉT RỰC RỠ */}
                        <div className="space-y-2 pt-1">
                            {/* Tab 1: Hồ Sơ Cá Nhân */}
                            <button
                                onClick={() => chuyenTab('ho-so')}
                                className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl text-xs font-black transition-all cursor-pointer border-2 ${
                                    tabHienTai === 'ho-so'
                                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white border-blue-400 shadow-lg shadow-blue-500/30'
                                        : 'bg-white border-blue-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/70 shadow-xs'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                                        tabHienTai === 'ho-so' ? 'bg-white/20 text-white border border-white/30' : 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-blue-500/20'
                                    }`}>
                                        <User className="w-4.5 h-4.5 stroke-[2.5]" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs sm:text-sm">Hồ Sơ Cá Nhân</div>
                                        <div className={`text-[10px] font-bold ${tabHienTai === 'ho-so' ? 'text-blue-100' : 'text-slate-400'}`}>
                                            Thông tin & Thẻ Thành Viên
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-80" />
                            </button>

                            {/* Tab 2: Đơn Hàng & Lộ Trình Realtime */}
                            <button
                                onClick={() => chuyenTab('don-hang')}
                                className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl text-xs font-black transition-all cursor-pointer border-2 ${
                                    tabHienTai === 'don-hang'
                                        ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white border-amber-400 shadow-lg shadow-orange-500/30'
                                        : 'bg-white border-amber-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/70 shadow-xs'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                                        tabHienTai === 'don-hang' ? 'bg-white/20 text-white border border-white/30' : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-amber-500/20'
                                    }`}>
                                        <PackageCheck className="w-4.5 h-4.5 stroke-[2.5]" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs sm:text-sm">Đơn Hàng Của Tôi</div>
                                        <div className={`text-[10px] font-bold ${tabHienTai === 'don-hang' ? 'text-amber-100' : 'text-slate-400'}`}>
                                            Tiến độ Realtime
                                        </div>
                                    </div>
                                </div>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                    <ChevronRight className="w-4 h-4 opacity-80" />
                                </span>
                            </button>

                            {/* Tab 3: Kho Voucher & Mã Giảm Giá */}
                            <button
                                onClick={() => chuyenTab('voucher')}
                                className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl text-xs font-black transition-all cursor-pointer border-2 ${
                                    tabHienTai === 'voucher'
                                        ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white border-purple-400 shadow-lg shadow-purple-500/30'
                                        : 'bg-white border-purple-200 text-slate-800 hover:border-purple-400 hover:bg-purple-50/70 shadow-xs'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                                        tabHienTai === 'voucher' ? 'bg-white/20 text-white border border-white/30' : 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-purple-500/20'
                                    }`}>
                                        <Ticket className="w-4.5 h-4.5 stroke-[2.5]" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs sm:text-sm">Kho Voucher & Ưu Đãi</div>
                                        <div className={`text-[10px] font-bold ${tabHienTai === 'voucher' ? 'text-purple-100' : 'text-slate-400'}`}>
                                            Mã giảm giá đã săn
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-black shadow-xs ${
                                    tabHienTai === 'voucher' ? 'bg-white/20 text-white border border-white/30' : 'bg-purple-500 text-white'
                                }`}>
                                    {soLuongVoucherVi} mã
                                </span>
                            </button>

                            {/* Tab 4: Sổ Địa Chỉ Giao Hàng */}
                            <button
                                onClick={() => chuyenTab('dia-chi')}
                                className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl text-xs font-black transition-all cursor-pointer border-2 ${
                                    tabHienTai === 'dia-chi'
                                        ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white border-emerald-400 shadow-lg shadow-emerald-500/30'
                                        : 'bg-white border-emerald-200 text-slate-800 hover:border-emerald-400 hover:bg-emerald-50/70 shadow-xs'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                                        tabHienTai === 'dia-chi' ? 'bg-white/20 text-white border border-white/30' : 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-emerald-500/20'
                                    }`}>
                                        <MapPin className="w-4.5 h-4.5 stroke-[2.5]" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs sm:text-sm">Sổ Địa Chỉ Giao Hàng</div>
                                        <div className={`text-[10px] font-bold ${tabHienTai === 'dia-chi' ? 'text-emerald-100' : 'text-slate-400'}`}>
                                            Nơi nhận hàng mặc định
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-black shadow-xs ${
                                    tabHienTai === 'dia-chi' ? 'bg-white/20 text-white border border-white/30' : 'bg-emerald-500 text-white'
                                }`}>
                                    {danhSachDiaChi.length} nơi
                                </span>
                            </button>

                            {/* Tab 5: Đổi Mật Khẩu & Bảo Mật */}
                            <button
                                onClick={() => chuyenTab('bao-mat')}
                                className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl text-xs font-black transition-all cursor-pointer border-2 ${
                                    tabHienTai === 'bao-mat'
                                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/30'
                                        : 'bg-white border-indigo-200 text-slate-800 hover:border-indigo-400 hover:bg-indigo-50/70 shadow-xs'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                                        tabHienTai === 'bao-mat' ? 'bg-white/20 text-white border border-white/30' : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-indigo-500/20'
                                    }`}>
                                        <ShieldCheck className="w-4.5 h-4.5 stroke-[2.5]" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs sm:text-sm">Bảo Mật & Mật Khẩu</div>
                                        <div className={`text-[10px] font-bold ${tabHienTai === 'bao-mat' ? 'text-indigo-100' : 'text-slate-400'}`}>
                                            Đổi pass & an toàn 100%
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-80" />
                            </button>
                        </div>

                        {/* Nút Đăng Xuất An Toàn (Đậm Màu Sặc Sỡ) */}
                        <div className="pt-2 border-t-2 border-slate-200">
                            <button
                                onClick={dangXuat}
                                className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl text-xs font-black border-2 border-rose-400 bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 shadow-md shadow-rose-500/25 transition-all cursor-pointer hover:scale-[1.01]"
                            >
                                <X className="w-4 h-4 stroke-[3]" />
                                <span>Đăng Xuất Tài Khoản</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* CỘT PHẢI: KHU VỰC NỘI DUNG TỪNG TAB - NỀN RÕ RÀNG, VIỀN NÉT 2PX           */}
                {/* ========================================================================= */}
                <div id="khu-vuc-noi-dung-tab" className="lg:col-span-8 scroll-mt-20">
                    {tabHienTai === 'ho-so' && <HoSoCaNhan {...thongSoHoSoCaNhan} />}


                    {tabHienTai === 'don-hang' && <LichSuDonHang {...thongSoLichSuDonHang} />}


                    {/* ========================================================================= */}
                    {/* TAB 3: KHO VOUCHER & ƯU ĐÃI ĐÃ SĂN TONE SÁNG                              */}
                    {/* ========================================================================= */}
                    {tabHienTai === 'voucher' && <ViVoucher {...thongSoViVoucher} />}

                    {tabHienTai === 'dia-chi' && <SoDiaChi {...thongSoSoDiaChi} />}


                    {tabHienTai === 'bao-mat' && <BaoMatTaiKhoan {...thongSoBaoMatTaiKhoan} />}

                </div>
            </div>

            <ModalChiTietDonHangKhachHang {...thongSoModalChiTietDonHangKhachHang} />


            <ModalChonAvatar {...thongSoModalChonAvatar} />


            <ModalXacNhanHuyDon {...thongSoModalXacNhanHuyDon} />


            {/* MODAL QUÉT MÃ QR TIẾP TỤC THANH TOÁN CHO ĐƠN VIETQR CHƯA THANH TOÁN */}
            {donHangThanhToanQR && (
                <ModalThanhToanQR
                    donHang={donHangThanhToanQR}
                    onThanhToanThanhCong={async () => {
                        try {
                            toast.success(`🎉 Đã xác nhận thanh toán thành công đơn #${donHangThanhToanQR.ma_don_hang}!`);
                            setDonHangThanhToanQR(null);
                            // Cập nhật lại danh sách đơn hàng đúng tài khoản từ MongoDB
                            const laAdmin = nguoiDung?.vaiTro === 'admin' || nguoiDung?.role === 'admin';
                            if (laAdmin) {
                                const tatCaMoi = await DonHangService.layTatCaDonHangAsync();
                                setDanhSachDonHang(tatCaMoi || []);
                            } else if (nguoiDung) {
                                const idUsr = nguoiDung.id || nguoiDung._id || '';
                                const emailUsr = (nguoiDung.email || '').trim().toLowerCase();
                                const sdtUsr = (nguoiDung.soDienThoai || nguoiDung.so_dien_thoai || '').trim();
                                const donCuaToi = await DonHangService.layDonHangTheoNguoiDungAsync(idUsr, emailUsr, sdtUsr);
                                setDanhSachDonHang(donCuaToi || []);
                            }
                        } catch (e) {
                            console.error('Lỗi sau khi thanh toán QR:', e);
                        }
                    }}
                    onDong={() => setDonHangThanhToanQR(null)}
                />
            )}
        </div>
    );
}

export default function TrangTaiKhoan() {
    return (
        <Suspense fallback={
            <div className="max-w-7xl mx-auto py-20 text-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-2" />
                <p className="text-xs font-bold">Đang tải trung tâm tài khoản TNTP...</p>
            </div>
        }>
            <NoiDungTrangTaiKhoan />
        </Suspense>
    );
}
