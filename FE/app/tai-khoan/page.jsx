'use client';

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
    Compass,
    Home,
    FileText,
    Crown,
    Printer,
    Filter,
    RotateCcw,
    Package,
    QrCode
} from 'lucide-react';
import { useNguoiDung } from '@/contexts/AuthContext';
import { useGioHang } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { DonHangService } from '@/services/don-hang.service';
import { 
    DiaGioiHanhChinhService, 
    khopTuKhoaDiaChi, 
    DANH_SACH_34_TINH_THANH_SAU_SAP_NHAP,
    DANH_SACH_63_TINH_THANH_CHUAN,
    TRA_CUU_SAP_NHAP_V2
} from '@/services/dia-gioi-hanh-chinh.service';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import ModalThanhToanQR from '@/components/thanh-toan/ModalThanhToanQR';

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

// Preset Avatar Công Nghệ Đẹp & Chuẩn Quốc Tế
const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
];

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

// Component Bộ Chọn Địa Giới Hành Chính Có Tìm Kiếm Nhanh Realtime (Searchable Combobox)
function BoChonDiaGioi({
    label,
    icon: Icon,
    danhSach = [],
    giaTri = '',
    onChon,
    placeholder = 'Chọn...',
    disabled = false
}) {
    const [dangMo, setDangMo] = useState(false);
    const [tuKhoa, setTuKhoa] = useState('');
    const refContainer = React.useRef(null);
    const refInput = React.useRef(null);

    // Tự động focus vào ô tìm kiếm khi mở combobox
    useEffect(() => {
        if (dangMo) {
            const timer = setTimeout(() => {
                refInput.current?.focus();
            }, 30);
            return () => clearTimeout(timer);
        } else {
            setTuKhoa('');
        }
    }, [dangMo]);

    useEffect(() => {
        const xuLyClickNgoai = (e) => {
            if (refContainer.current && !refContainer.current.contains(e.target)) {
                setDangMo(false);
            }
        };
        document.addEventListener('mousedown', xuLyClickNgoai);
        return () => document.removeEventListener('mousedown', xuLyClickNgoai);
    }, []);

    // Lọc realtime chuẩn xác từng ký tự và từ viết tắt
    const danhSachLoc = useMemo(() => {
        if (!tuKhoa.trim()) return danhSach;
        return danhSach.filter(item => khopTuKhoaDiaChi(item, tuKhoa));
    }, [danhSach, tuKhoa]);

    return (
        <div className="relative" ref={refContainer}>
            <label className="block text-[11px] font-black text-slate-700 mb-1 flex items-center gap-1.5">
                {Icon && <Icon className="w-3.5 h-3.5 text-emerald-600" />}
                <span>{label}</span>
            </label>

            <button
                type="button"
                disabled={disabled}
                onClick={() => setDangMo(!dangMo)}
                className={`w-full px-3.5 py-2.5 rounded-2xl border-2 text-left flex items-center justify-between text-xs font-bold transition-all ${
                    disabled
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                        : dangMo
                        ? 'bg-white border-emerald-500 ring-2 ring-emerald-100 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 cursor-pointer'
                }`}
            >
                <span className={`truncate ${!giaTri ? 'text-slate-400 font-medium' : 'text-slate-900 font-bold'}`}>
                    {giaTri || placeholder}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 ml-2 transition-transform ${dangMo ? 'rotate-180 text-emerald-600' : ''}`} />
            </button>

            {dangMo && !disabled && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl border-2 border-emerald-400 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="p-2.5 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/70 to-teal-50/40">
                        <div className="relative flex items-center">
                            <Search className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 pointer-events-none" />
                            <input
                                ref={refInput}
                                type="text"
                                value={tuKhoa}
                                onChange={(e) => setTuKhoa(e.target.value)}
                                onInput={(e) => setTuKhoa(e.target.value)}
                                placeholder={`Tìm nhanh ${label.toLowerCase()}...`}
                                className="w-full pl-8 pr-16 py-1.5 rounded-xl border border-emerald-200 bg-white text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-slate-800"
                            />
                            <div className="absolute right-2 flex items-center gap-1">
                                {tuKhoa && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTuKhoa('');
                                            refInput.current?.focus();
                                        }}
                                        className="w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-[10px] cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                )}
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded-md">
                                    {danhSachLoc.length}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 text-xs">
                        {danhSachLoc.length === 0 ? (
                            <div className="p-4 text-center text-slate-400 text-[11px] font-medium space-y-1">
                                <p className="font-bold text-slate-600">Không tìm thấy kết quả phù hợp</p>
                                <p className="text-[10px] text-slate-400">Thử gõ từ khóa không dấu hoặc viết tắt (vd: hn, hcm, vl...)</p>
                            </div>
                        ) : (
                            danhSachLoc.map((item) => {
                                const ten = item.name || item.ten;
                                const isSelected = giaTri === ten;
                                return (
                                    <button
                                        key={item.code ? `cd-${item.code}` : ten}
                                        type="button"
                                        onClick={() => {
                                            onChon(item);
                                            setDangMo(false);
                                            setTuKhoa('');
                                        }}
                                        className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between font-semibold transition-colors cursor-pointer ${
                                            isSelected
                                                ? 'bg-emerald-50 text-emerald-800 font-black'
                                                : 'hover:bg-slate-50 text-slate-700 hover:text-emerald-700'
                                        }`}
                                    >
                                        <div className="flex flex-col min-w-0 pr-2">
                                            <span className="truncate">{ten}</span>
                                            {item.phuDe && (
                                                <span className="text-[10px] text-amber-700 font-medium truncate">
                                                    📌 {item.phuDe}
                                                </span>
                                            )}
                                        </div>
                                        {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-1.5 stroke-[2.5]" />}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

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
    const laDangXuLy = !laDaGiao && !laDangGiao;

    const lichTrinh = Array.isArray(dh.lich_trinh_giao_hang) ? dh.lich_trinh_giao_hang : [];
    const tgDatHang = lichTrinh[0]?.thoi_gian || layThoiGianDonHang(dh) || 'Đã ghi nhận';
    const tgDongGoi = lichTrinh[1]?.thoi_gian || (laDangXuLy ? 'Đang xử lý' : 'Đã niêm phong');
    const tgVanChuyen = lichTrinh[2]?.thoi_gian || (laDangGiao ? 'Đang giao máy' : laDaGiao ? 'Đã vận chuyển' : 'Chờ xuất kho');
    const tgHoanThanh = lichTrinh[3]?.thoi_gian || (laDaGiao ? 'Đã nhận máy' : 'Dự kiến 1-2 ngày');

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
            setAvatarChon(nguoiDung.avatar || AVATAR_PRESETS[0]);
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
            setDangTaiDonHang(true);
            try {
                const tatCa = await DonHangService.layTatCaDonHangAsync();
                const laAdmin = nguoiDung?.vaiTro === 'admin' || nguoiDung?.role === 'admin' || nguoiDung?.email === 'admin@laptopnew.vn';
                if (laAdmin) {
                    // Admin xem tất cả các đơn để quản lý và kiểm tra realtime
                    setDanhSachDonHang(tatCa);
                } else if (nguoiDung) {
                    const donCuaToi = tatCa.filter((dh) => {
                        if (dh.id_nguoi_dung && (dh.id_nguoi_dung === nguoiDung.id || dh.id_nguoi_dung === nguoiDung._id)) return true;
                        if (nguoiDung.email && dh.thong_tin_giao_hang?.email === nguoiDung.email) return true;
                        if (nguoiDung.soDienThoai && dh.thong_tin_giao_hang?.so_dien_thoai === nguoiDung.soDienThoai) return true;
                        return false;
                    });
                    setDanhSachDonHang(donCuaToi);
                } else {
                    setDanhSachDonHang(tatCa.slice(0, 3));
                }
            } catch (e) {
                console.error('Lỗi tải đơn hàng:', e);
            } finally {
                setDangTaiDonHang(false);
            }
        };
        taiDonHang();
    }, [nguoiDung]);

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
    }, [danhSachVoucher, nguoiDung?.viVoucher]);

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

    const [cheDoDiaGioi, setCheDoDiaGioi] = useState('v2'); // 'v2' (API v2 - 34 Tỉnh sau sáp nhập) hoặc 'v1' (63 Tỉnh truyền thống)
    const [danhSachTinh, setDanhSachTinh] = useState(DANH_SACH_34_TINH_THANH_SAU_SAP_NHAP);
    const [danhSachQuan, setDanhSachQuan] = useState([]);
    const [danhSachXa, setDanhSachXa] = useState([]);

    // 1. Tải danh sách tỉnh thành theo chuẩn đang chọn (mặc định V2 - 34 Tỉnh/TP sau sáp nhập)
    useEffect(() => {
        let isMounted = true;
        if (cheDoDiaGioi === 'v2') {
            DiaGioiHanhChinhService.layDanhSachTinhThanhV2Async().then(res => {
                if (isMounted && Array.isArray(res) && res.length > 0) {
                    setDanhSachTinh(res);
                }
            });
        } else {
            DiaGioiHanhChinhService.layDanhSachTinhThanhAsync().then(res => {
                if (isMounted && Array.isArray(res) && res.length > 0) {
                    setDanhSachTinh(res);
                }
            });
        }
        return () => { isMounted = false; };
    }, [cheDoDiaGioi]);

    // Chuyển đổi giữa 2 chuẩn địa giới (v2 34 tỉnh vs v1 63 tỉnh)
    const doiCheDoDiaGioi = async (cheDoMoi) => {
        if (cheDoMoi === cheDoDiaGioi) return;
        setCheDoDiaGioi(cheDoMoi);
        setFormDiaChi(prev => ({ ...prev, tinhThanh: '', quanHuyen: '', phuongXa: '' }));
        setDanhSachQuan([]);
        setDanhSachXa([]);
        if (cheDoMoi === 'v2') {
            const dsV2 = await DiaGioiHanhChinhService.layDanhSachTinhThanhV2Async();
            setDanhSachTinh(dsV2 || DANH_SACH_34_TINH_THANH_SAU_SAP_NHAP);
        } else {
            const dsV1 = await DiaGioiHanhChinhService.layDanhSachTinhThanhAsync();
            setDanhSachTinh(dsV1 || DANH_SACH_63_TINH_THANH_CHUAN);
        }
    };

    useEffect(() => {
        if (nguoiDung?.danhSachDiaChi && nguoiDung.danhSachDiaChi.length > 0) {
            setDanhSachDiaChi(nguoiDung.danhSachDiaChi);
        } else if (nguoiDung) {
            setDanhSachDiaChi([
                {
                    id: 'dc_1',
                    hoTen: nguoiDung.hoTen || 'Lê Trí',
                    soDienThoai: nguoiDung.soDienThoai || '0912 345 678',
                    diaChiChiTiet: '123 Nguyễn Thị Minh Khai',
                    phuongXa: 'Phường Bến Thành',
                    quanHuyen: 'Quận 1',
                    tinhThanh: 'Thành phố Hồ Chí Minh',
                    macDinh: true,
                    loaiDiaChi: 'nha_rieng'
                }
            ]);
        }
    }, [nguoiDung]);

    const chonTinhThanh = async (tinh) => {
        setFormDiaChi(prev => ({ ...prev, tinhThanh: tinh.name, quanHuyen: '', phuongXa: '' }));
        setDanhSachQuan([]);
        setDanhSachXa([]);

        if (cheDoDiaGioi === 'v2') {
            if (tinh.code) {
                const dsXa = await DiaGioiHanhChinhService.layDanhSachPhuongXaTheoTinhAsync(tinh.code);
                setDanhSachXa(dsXa || []);
            }
        } else {
            if (tinh.code) {
                const dsQuan = await DiaGioiHanhChinhService.layDanhSachQuanHuyenAsync(tinh.code);
                setDanhSachQuan(dsQuan || []);
            }
        }
    };

    const chonQuanHuyen = async (quan) => {
        setFormDiaChi(prev => ({ ...prev, quanHuyen: quan.name, phuongXa: '' }));
        setDanhSachXa([]);
        if (quan.code) {
            const dsXa = await DiaGioiHanhChinhService.layDanhSachPhuongXaAsync(quan.code);
            setDanhSachXa(dsXa || []);
        }
    };

    const chonPhuongXa = (xa) => {
        setFormDiaChi(prev => ({ ...prev, phuongXa: xa.name }));
    };

    const batDauThemDiaChi = () => {
        setIdDiaChiSua(null);
        setDaChamDiaChi({ hoTen: false, soDienThoai: false, diaChiChiTiet: false });
        setCheDoDiaGioi('v2');
        setFormDiaChi({
            hoTen: hoTen || '',
            soDienThoai: soDienThoai || '',
            diaChiChiTiet: '',
            phuongXa: '',
            quanHuyen: '',
            tinhThanh: '',
            macDinh: danhSachDiaChi.length === 0,
            loaiDiaChi: 'nha_rieng'
        });
        setDanhSachQuan([]);
        setDanhSachXa([]);
        setDangMoFormDiaChi(true);
    };

    const batDauSuaDiaChi = async (dc) => {
        setIdDiaChiSua(dc.id);
        setDaChamDiaChi({ hoTen: false, soDienThoai: false, diaChiChiTiet: false });
        const laV1 = Boolean(dc.quanHuyen && dc.quanHuyen.trim());
        const cheDo = laV1 ? 'v1' : 'v2';
        setCheDoDiaGioi(cheDo);

        setFormDiaChi({
            hoTen: dc.hoTen,
            soDienThoai: dc.soDienThoai,
            diaChiChiTiet: dc.diaChiChiTiet,
            phuongXa: dc.phuongXa,
            quanHuyen: dc.quanHuyen || '',
            tinhThanh: dc.tinhThanh,
            macDinh: dc.macDinh,
            loaiDiaChi: dc.loaiDiaChi || 'nha_rieng'
        });
        setDangMoFormDiaChi(true);

        if (cheDo === 'v2') {
            const listTinhV2 = await DiaGioiHanhChinhService.layDanhSachTinhThanhV2Async();
            setDanhSachTinh(listTinhV2);
            if (dc.tinhThanh) {
                const foundTinh = listTinhV2.find(t => khopTuKhoaDiaChi(t, dc.tinhThanh));
                if (foundTinh) {
                    const dsXa = await DiaGioiHanhChinhService.layDanhSachPhuongXaTheoTinhAsync(foundTinh.code);
                    setDanhSachXa(dsXa || []);
                }
            }
        } else {
            const listTinhV1 = await DiaGioiHanhChinhService.layDanhSachTinhThanhAsync();
            setDanhSachTinh(listTinhV1);
            if (dc.tinhThanh) {
                const foundTinh = listTinhV1.find(t => khopTuKhoaDiaChi(t, dc.tinhThanh));
                if (foundTinh) {
                    const dsQuan = await DiaGioiHanhChinhService.layDanhSachQuanHuyenAsync(foundTinh.code);
                    setDanhSachQuan(dsQuan || []);
                    if (dc.quanHuyen) {
                        const foundQuan = (dsQuan || []).find(q => khopTuKhoaDiaChi(q, dc.quanHuyen));
                        if (foundQuan) {
                            const dsXa = await DiaGioiHanhChinhService.layDanhSachPhuongXaAsync(foundQuan.code);
                            setDanhSachXa(dsXa || []);
                        }
                    }
                }
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
            setThongBao({ loai: 'loi', noiDung: 'Vui lòng chọn Tỉnh/Thành phố!' });
            return;
        }

        if (cheDoDiaGioi === 'v1' && !formDiaChi.quanHuyen) {
            setThongBao({ loai: 'loi', noiDung: 'Vui lòng chọn Quận/Huyện!' });
            return;
        }

        if (!formDiaChi.phuongXa) {
            setThongBao({ loai: 'loi', noiDung: 'Vui lòng chọn Phường/Xã!' });
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
    const [xacNhanMatKhauMoi, setXacNhanMatKhauMoi] = useState('');
    const [hienMatKhauCu, setHienMatKhauCu] = useState(false);
    const [hienMatKhauMoi, setHienMatKhauMoi] = useState(false);
    const [hienXacNhanMatKhau, setHienXacNhanMatKhau] = useState(false);
    const [dangDoiPass, setDangDoiPass] = useState(false);
    const [daChamMatKhauMoi, setDaChamMatKhauMoi] = useState(false);
    const [daChamXacNhan, setDaChamXacNhan] = useState(false);

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
            doDai: matKhauMoi.length >= 6,
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
        if (canNhapMatKhauCu && !matKhauCu) {
            setThongBao({ loai: 'loi', noiDung: 'Vui lòng nhập mật khẩu hiện tại đang dùng!' });
            return;
        }
        if (matKhauMoi.length < 6) {
            setThongBao({ loai: 'loi', noiDung: 'Mật khẩu mới phải có tối thiểu 6 ký tự!' });
            return;
        }
        if (matKhauMoi !== xacNhanMatKhauMoi) {
            setThongBao({ loai: 'loi', noiDung: 'Mật khẩu xác nhận không trùng khớp với mật khẩu mới!' });
            return;
        }

        setDangDoiPass(true);
        try {
            await doiMatKhau(matKhauCu, matKhauMoi);
            setThongBao({
                loai: 'thanh_cong',
                noiDung: 'Thiết lập mật khẩu thành công! Bạn có thể sử dụng mật khẩu này để đăng nhập trực tiếp.'
            });
            setMatKhauCu('');
            setMatKhauMoi('');
            setXacNhanMatKhauMoi('');
        } catch (err) {
            setThongBao({ loai: 'loi', noiDung: err.message || 'Mật khẩu hiện tại không chính xác!' });
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

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
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
                    {tabHienTai === 'ho-so' && 'Hồ Sơ Cá Nhân & VIP'}
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
                                <div className="w-13 h-13 rounded-2xl ring-2 ring-blue-500/40 overflow-hidden bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md relative">
                                    {!avatarLoi && avatarChon ? (
                                        <img
                                            src={avatarChon}
                                            alt=""
                                            referrerPolicy="no-referrer"
                                            onError={() => setAvatarLoi(true)}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : null}
                                    <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-white -z-10 select-none">
                                        {hoTen?.charAt(0)?.toUpperCase() || 'T'}
                                    </span>
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
                                <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-black shadow-2xs">
                                    <Sparkles className="w-3 h-3 fill-amber-500 text-amber-600" />
                                    <span>{nguoiDung?.hangThanhVien || 'Thành Viên VIP'}</span>
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
                                            Thông tin & Thẻ VIP
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
                <div className="lg:col-span-8">
                    {/* ========================================================================= */}
                    {/* TAB 1: HỒ SƠ CÁ NHÂN & THẺ HỘI VIÊN VIP SANG TRỌNG HOÀNG GIA              */}
                    {/* ========================================================================= */}
                    {tabHienTai === 'ho-so' && (
                        <div className="rounded-3xl bg-white border-2 border-blue-300 shadow-xl overflow-hidden space-y-0">
                            {/* Dải Banner Header Rực Rỡ Gradient Đa Sắc */}
                            <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-md shrink-0">
                                        <User className="w-6 h-6 stroke-[2.5]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                                            <span>Hồ Sơ Cá Nhân & Đặc Quyền VIP</span>
                                        </h2>
                                        <p className="text-xs text-blue-100 font-medium mt-0.5">
                                            Cập nhật thông tin chính xác để nhận bảo hành chính hãng và đặc quyền VIP
                                        </p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black self-start sm:self-auto flex items-center gap-1.5 shadow-xs">
                                    <Crown className="w-3.5 h-3.5 fill-slate-950" />
                                    <span>Hội Viên VIP Club</span>
                                </span>
                            </div>

                            <div className="p-5 sm:p-7 space-y-6 bg-gradient-to-b from-slate-50/40 to-white">

                            {/* THẺ HỘI VIÊN VIP TONE SÁNG CAO CẤP: ĐỒNG ĐIỆU GIAO DIỆN, SANG TRỌNG, GỌN GÀNG */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-sky-50/70 to-indigo-50 border-2 border-blue-300/90 shadow-sm relative overflow-hidden space-y-3.5">
                                <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-blue-200/25 blur-xl pointer-events-none" />
                                <div className="absolute right-4 top-2 text-blue-200/50 pointer-events-none">
                                    <Crown className="w-24 h-24 stroke-[1.2]" />
                                </div>

                                {/* Dòng 1: Huy hiệu VIP */}
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-xs tracking-wider shadow-xs flex items-center gap-1">
                                            <Crown className="w-3.5 h-3.5 fill-slate-950" />
                                            <span>TNTP VIP CLUB</span>
                                        </span>
                                        <span className="text-[11px] font-black text-blue-800 font-mono tracking-widest px-2.5 py-0.5 rounded-lg bg-white border border-blue-200 shadow-2xs">
                                            PLATINUM MEMBER
                                        </span>
                                    </div>
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black shadow-2xs">
                                        <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                                        <span>{nguoiDung?.hangThanhVien || 'Thành Viên VIP'}</span>
                                    </span>
                                </div>

                                {/* Dòng 2: Chủ sở hữu & Mã KH */}
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 relative z-10">
                                    <div>
                                        <div className="text-[10px] uppercase font-black text-blue-800/80 tracking-wider">Chủ sở hữu thẻ</div>
                                        <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide">{hoTen || 'Thành Viên TNTP'}</div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs self-start sm:self-auto">
                                        <span>Mã KH: {nguoiDung?.id || nguoiDung?._id || 'usr_vip_2026'}</span>
                                        <button
                                            type="button"
                                            onClick={() => saoChepMaId(nguoiDung?.id || nguoiDung?._id || 'usr_vip_2026')}
                                            className="p-0.5 text-blue-600 hover:text-blue-800 transition-transform active:scale-90 cursor-pointer"
                                            title="Sao chép mã"
                                        >
                                            {daCopyId ? <Check className="w-3.5 h-3.5 text-emerald-600 font-black" /> : <Copy className="w-3.5 h-3.5" />}
                                        </button>
                                        {daCopyId && <span className="text-[10px] text-emerald-600 font-black">Đã chép!</span>}
                                    </div>
                                </div>

                                {/* Dòng 3: 2 Ô đặc quyền VIP cao cấp (Đã loại bỏ điểm thưởng thừa) */}
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-200/80 text-xs relative z-10">
                                    <div className="bg-white border-2 border-blue-300 p-2.5 rounded-xl text-center shadow-2xs">
                                        <span className="text-blue-900 text-[10px] block font-black uppercase tracking-wider">Chiết khấu VIP</span>
                                        <b className="text-blue-600 font-black text-base sm:text-lg">Giảm thêm 5%</b>
                                    </div>
                                    <div className="bg-white border-2 border-emerald-300 p-2.5 rounded-xl text-center shadow-2xs">
                                        <span className="text-emerald-900 text-[10px] block font-black uppercase tracking-wider">Vận chuyển hỏa tốc</span>
                                        <b className="text-emerald-600 font-black text-base sm:text-lg">Freeship 100%</b>
                                    </div>
                                </div>
                            </div>

                            {/* CÁC PHẦN FORM ĐƯỢC TÁCH BIỆT BẰNG VIỀN ĐẬM RÕ RÀNG */}
                            <form onSubmit={xuLyLuuHoSo} className="space-y-5">
                                {/* SECTION 1: TÀI KHOẢN & EMAIL (VIỀN XANH DƯƠNG ĐẬM) */}
                                <div className="p-4 sm:p-5 rounded-2xl border-2 border-blue-300 bg-blue-50/80 space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-black text-blue-900 uppercase tracking-wide">
                                        <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                                            <Mail className="w-3.5 h-3.5" />
                                        </div>
                                        <span>Tài Khoản & Email Xác Thực</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            disabled
                                            value={nguoiDung?.email || ''}
                                            className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-slate-800 text-xs sm:text-sm font-bold cursor-not-allowed shadow-2xs"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-black border border-emerald-300">
                                            ✓ Đã xác thực OTP
                                        </span>
                                    </div>
                                </div>

                                {/* SECTION 2: THÔNG TIN GIAO NHẬN (VIỀN CHÀM INDIGO ĐẬM) */}
                                <div className="p-4 sm:p-5 rounded-2xl border-2 border-indigo-300 bg-indigo-50/70 space-y-4">
                                    <div className="flex items-center gap-2 text-xs font-black text-indigo-950 uppercase tracking-wide">
                                        <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                                            <User className="w-3.5 h-3.5" />
                                        </div>
                                        <span>Thông Tin Người Nhận Hàng</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-800 flex items-center justify-between">
                                                <span className="flex items-center gap-1">
                                                    <span>Họ và Tên</span>
                                                    <span className="text-rose-500">*</span>
                                                </span>
                                                {daChamHoTen && !loiHoTen && hoTen.trim() && (
                                                    <span className="text-[10.5px] text-emerald-600 font-extrabold flex items-center gap-0.5">
                                                        <Check className="w-3 h-3" /> Hợp lệ
                                                    </span>
                                                )}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    required
                                                    value={hoTen}
                                                    onChange={(e) => {
                                                        setHoTen(e.target.value);
                                                        setDaChamHoTen(true);
                                                    }}
                                                    onBlur={() => setDaChamHoTen(true)}
                                                    placeholder="Nhập họ và tên..."
                                                    className={`w-full px-4 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold focus:outline-none transition-all shadow-xs ${
                                                        daChamHoTen && loiHoTen
                                                            ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600 focus:ring-2 focus:ring-rose-200'
                                                            : daChamHoTen && !loiHoTen && hoTen.trim()
                                                            ? 'border-emerald-500 bg-emerald-50/20 text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
                                                            : 'border-slate-300 bg-white text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
                                                    }`}
                                                />
                                                {daChamHoTen && loiHoTen && (
                                                    <AlertCircle className="w-4 h-4 text-rose-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                )}
                                                {daChamHoTen && !loiHoTen && hoTen.trim() && (
                                                    <Check className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                )}
                                            </div>
                                            {daChamHoTen && loiHoTen && (
                                                <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1">
                                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                    <span>{loiHoTen}</span>
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-800 flex items-center justify-between">
                                                <span className="flex items-center gap-1">
                                                    <span>Số Điện Thoại Nhận Máy</span>
                                                    <span className="text-rose-500">*</span>
                                                </span>
                                                {daChamSoDienThoai && !loiSoDienThoai && soDienThoai.trim() && (
                                                    <span className="text-[10.5px] text-emerald-600 font-extrabold flex items-center gap-0.5">
                                                        <Check className="w-3 h-3" /> Chuẩn 10 số
                                                    </span>
                                                )}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    value={soDienThoai}
                                                    onChange={(e) => {
                                                        setSoDienThoai(e.target.value);
                                                        setDaChamSoDienThoai(true);
                                                    }}
                                                    onBlur={() => setDaChamSoDienThoai(true)}
                                                    placeholder="0912 345 678"
                                                    className={`w-full px-4 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold focus:outline-none transition-all shadow-xs ${
                                                        daChamSoDienThoai && loiSoDienThoai
                                                            ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600 focus:ring-2 focus:ring-rose-200'
                                                            : daChamSoDienThoai && !loiSoDienThoai && soDienThoai.trim()
                                                            ? 'border-emerald-500 bg-emerald-50/20 text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
                                                            : 'border-slate-300 bg-white text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
                                                    }`}
                                                />
                                                {daChamSoDienThoai && loiSoDienThoai && (
                                                    <AlertCircle className="w-4 h-4 text-rose-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                )}
                                                {daChamSoDienThoai && !loiSoDienThoai && soDienThoai.trim() && (
                                                    <Check className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                )}
                                            </div>
                                            {daChamSoDienThoai && loiSoDienThoai && (
                                                <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1">
                                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                    <span>{loiSoDienThoai}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-800">
                                                Giới Tính
                                            </label>
                                            <div className="flex items-center gap-2 pt-0.5">
                                                {[
                                                    { id: 'nam', label: 'Nam' },
                                                    { id: 'nu', label: 'Nữ' },
                                                    { id: 'khac', label: 'Khác' }
                                                ].map((gt) => (
                                                    <button
                                                        key={gt.id}
                                                        type="button"
                                                        onClick={() => setGioiTinh(gt.id)}
                                                        className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                                                            gioiTinh === gt.id
                                                                ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                                                                : 'border-slate-300 bg-white text-slate-700 hover:border-indigo-300'
                                                        }`}
                                                    >
                                                        {gt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-800 flex items-center justify-between">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                                                    <span>Ngày Sinh</span>
                                                </span>
                                                {daChamNgaySinh && !loiNgaySinh && ngaySinh && (
                                                    <span className="text-[10.5px] text-emerald-600 font-extrabold flex items-center gap-0.5">
                                                        <Check className="w-3 h-3" /> Hợp lệ
                                                    </span>
                                                )}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={ngaySinh}
                                                    onChange={(e) => {
                                                        setNgaySinh(e.target.value);
                                                        setDaChamNgaySinh(true);
                                                    }}
                                                    onBlur={() => setDaChamNgaySinh(true)}
                                                    className={`w-full px-4 py-2 rounded-xl border-2 text-xs sm:text-sm font-bold focus:outline-none transition-all shadow-xs ${
                                                        daChamNgaySinh && loiNgaySinh
                                                            ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600 focus:ring-2 focus:ring-rose-200'
                                                            : daChamNgaySinh && !loiNgaySinh && ngaySinh
                                                            ? 'border-emerald-500 bg-emerald-50/20 text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
                                                            : 'border-slate-300 bg-white text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
                                                    }`}
                                                />
                                                {daChamNgaySinh && loiNgaySinh && (
                                                    <AlertCircle className="w-4 h-4 text-rose-500 absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                )}
                                                {daChamNgaySinh && !loiNgaySinh && ngaySinh && (
                                                    <Check className="w-4 h-4 text-emerald-600 absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                )}
                                            </div>
                                            {daChamNgaySinh && loiNgaySinh && (
                                                <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1">
                                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                    <span>{loiNgaySinh}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={dangLuuHoSo || (daChamHoTen && !!loiHoTen) || (daChamSoDienThoai && !!loiSoDienThoai) || (daChamNgaySinh && !!loiNgaySinh)}
                                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-500/25 active:scale-98 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {dangLuuHoSo ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                <span>Đang lưu thông tin...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Lưu Thông Tin Hồ Sơ</span>
                                                <Check className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                    {/* ========================================================================= */}
                    {/* TAB 2: ĐƠN HÀNG CỦA TÔI & TIMELINE REALTIME TONE SÁNG                      */}
                    {/* ========================================================================= */}
                    {tabHienTai === 'don-hang' && (
                        <div className="rounded-3xl bg-white border-2 border-amber-300 shadow-xl overflow-hidden">
                            {/* Ribbon Header Đơn Hàng Sặc Sỡ & Nổi Bật (Tinh gọn 1 màn hình) */}
                            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-amber-500 shadow-md">
                                <div>
                                    <h2 className="text-lg sm:text-xl font-black flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center shrink-0 shadow-inner">
                                            <PackageCheck className="w-5 h-5 text-amber-100" />
                                        </div>
                                        <span>Đơn Hàng Của Tôi & Lộ Trình Realtime</span>
                                    </h2>
                                    <p className="text-xs text-amber-100 mt-1 font-semibold">
                                        Cập nhật thời gian thực từng khâu đóng gói niêm phong và bàn giao hỏa tốc.
                                    </p>
                                </div>

                                <Link
                                    href="/don-hang"
                                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 text-amber-800 text-xs font-black shadow-sm hover:shadow-md transition-all self-start sm:self-auto"
                                >
                                    <Search className="w-3.5 h-3.5 text-orange-600" />
                                    <span>Tra cứu mã khác</span>
                                </Link>
                            </div>

                            <div className="p-4 sm:p-5 space-y-4">
                                {/* Thanh Tab Bộ Lọc Trạng Thái Đơn Hàng: Gọn gàng 1 hàng vừa khít, không bao giờ cuộn */}
                                <div className="bg-slate-100 p-1 sm:p-1.5 rounded-xl border border-slate-300 shadow-2xs">
                                    <div className="grid grid-cols-6 gap-1 sm:gap-1.5 w-full">
                                        {CAC_TAB_TRANG_THAI_DON.map((tab) => {
                                            const isActive = boLocTrangThaiDon === tab.id;
                                            const count = soLuongTheoTrangThai[tab.id] || 0;
                                            return (
                                                <button
                                                    key={tab.id}
                                                    type="button"
                                                    onClick={() => setBoLocTrangThaiDon(tab.id)}
                                                    className={`py-2 px-1 sm:px-2 rounded-lg font-black text-[11px] sm:text-xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-1 select-none active:scale-95 text-center min-w-0 ${
                                                        isActive
                                                            ? 'bg-amber-500 text-white shadow-sm font-black'
                                                            : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
                                                    }`}
                                                >
                                                    <span className="truncate">{tab.label}</span>
                                                    {count > 0 && (
                                                        <span
                                                            className={`min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-full text-[10.5px] font-mono font-black shrink-0 ${
                                                                isActive
                                                                    ? 'bg-white text-amber-800 shadow-xs'
                                                                    : tab.id === 'chua_thanh_toan'
                                                                    ? 'bg-rose-500 text-white'
                                                                    : 'bg-slate-700 text-white'
                                                            }`}
                                                        >
                                                            {count}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Danh sách đơn hàng */}
                                {dangTaiDonHang ? (
                                    <div className="py-12 text-center text-slate-400">
                                        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-500 mb-2" />
                                        <p className="text-xs font-bold">Đang tải lịch sử đơn hàng realtime...</p>
                                    </div>
                                ) : donHangDaLoc.length === 0 ? (
                                    <div className="py-12 text-center space-y-3 border-2 border-dashed border-slate-200 rounded-3xl p-6">
                                        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                                            <ShoppingBag className="w-8 h-8" />
                                        </div>
                                        <div className="text-sm font-black text-slate-800">
                                            Chưa có đơn hàng nào trong trạng thái &quot;{CAC_TAB_TRANG_THAI_DON.find(t => t.id === boLocTrangThaiDon)?.label || 'này'}&quot;
                                        </div>
                                        <div className="flex items-center justify-center gap-3 flex-wrap pt-1">
                                            {boLocTrangThaiDon !== 'tat_ca' && (
                                                <button
                                                    type="button"
                                                    onClick={() => setBoLocTrangThaiDon('tat_ca')}
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                                                >
                                                    <span>Xem tất cả ({danhSachDonHang.length} đơn)</span>
                                                </button>
                                            )}
                                            <Link
                                                href="/san-pham"
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md shadow-amber-500/30 transition-all"
                                            >
                                                <span>Khám phá Laptop Gaming & AI PC</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {donHangDaLoc.map((dh) => {
                                            const ttInfo = layChiTietTrangThaiDon(dh.trang_thai);

                                            return (
                                                <div
                                                    key={dh.id || dh.ma_don_hang}
                                                    className="rounded-2xl border-2 border-slate-400 hover:border-amber-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                                                >
                                                    {/* Header Đơn Hàng: Màu sắc đậm đà, tách biệt rõ ràng với phần thân */}
                                                    <div className="bg-slate-200 px-4 py-2.5 sm:py-3 border-b-2 border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                                        <div className="flex items-center gap-2.5 flex-wrap">
                                                            <span className="font-mono font-black text-blue-950 bg-blue-100 px-3 py-1 rounded-lg border-2 border-blue-400 text-xs sm:text-sm tracking-wide shadow-xs flex items-center gap-1.5">
                                                                <Package className="w-3.5 h-3.5 text-blue-700" />
                                                                <span>#{dh.ma_don_hang}</span>
                                                            </span>
                                                            <span className="text-slate-400 font-bold">•</span>
                                                            <span className="text-xs text-slate-800 font-black flex items-center gap-1.5">
                                                                <Calendar className="w-3.5 h-3.5 text-slate-600" />
                                                                <span>{layThoiGianDonHang(dh) || dh.ngay_tao}</span>
                                                            </span>
                                                        </div>

                                                        {/* Badge trạng thái đơn hàng: Duy nhất 1 badge rõ ràng, không mâu thuẫn */}
                                                        <div className="flex items-center gap-2 self-start sm:self-auto">
                                                            {kiemTraChuaThanhToan(dh) ? (
                                                                <div className="px-3 py-1 rounded-full text-xs font-black border-2 bg-rose-100 text-rose-950 border-rose-400 flex items-center gap-1.5 shadow-xs select-none">
                                                                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                                                                    <span>Chờ thanh toán (VietQR)</span>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className={`px-3 py-1 rounded-full text-xs font-black border-2 ${ttInfo.badgeBg} flex items-center gap-1.5 shadow-xs select-none`}
                                                                >
                                                                    <span className={`w-2 h-2 rounded-full ${ttInfo.dotClass}`} />
                                                                    <span>{ttInfo.ten}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                {/* Body Đơn Hàng: Nền xám nhạt làm nổi bật các khung sản phẩm nền trắng */}
                                                <div className="bg-slate-100/70 p-3 sm:p-4 space-y-3">
                                                    {/* 1. Danh sách máy trong đơn (Click vào máy xem chi tiết & hỗ trợ Mua lại ngay) */}
                                                    <div className="space-y-2.5">
                                                        {dh.danh_sach_san_pham?.map((sp, idx) => {
                                                            const duongDanSP = layDuongDanSanPham(sp);
                                                            const giaTongMuc = layGiaSanPhamDonHang(sp);
                                                            const donGia = layDonGiaSanPham(sp);

                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className="group/item flex items-center gap-3 text-xs bg-white hover:bg-amber-50/50 p-3 rounded-xl border-2 border-slate-300 hover:border-amber-500 shadow-sm transition-all duration-150"
                                                                >
                                                                    {/* Ảnh sản phẩm: Click chuyển sang trang chi tiết */}
                                                                    <Link
                                                                        href={duongDanSP}
                                                                        className="w-13 h-13 rounded-lg bg-white overflow-hidden shrink-0 border-2 border-slate-300 p-1 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-2xs"
                                                                        title="Bấm để xem chi tiết sản phẩm"
                                                                    >
                                                                        <img
                                                                            src={layHinhAnhSanPhamDonHang(sp)}
                                                                            alt={sp.san_pham?.ten_san_pham || sp.ten_san_pham || 'Laptop'}
                                                                            onError={(e) => {
                                                                                e.currentTarget.onerror = null;
                                                                                e.currentTarget.src = '/images/sp/lenovo_legion_pro7.jpg';
                                                                            }}
                                                                            className="w-full h-full object-contain"
                                                                        />
                                                                    </Link>

                                                                    {/* Tên & cấu hình sản phẩm: Click chuyển sang trang chi tiết */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <Link
                                                                            href={duongDanSP}
                                                                            className="font-black text-slate-900 group-hover/item:text-blue-600 transition-colors text-xs sm:text-sm truncate block cursor-pointer"
                                                                            title="Bấm để xem chi tiết sản phẩm và mua lại"
                                                                        >
                                                                            {sp.san_pham?.ten_san_pham || sp.ten_san_pham || 'Laptop Chính Hãng'}
                                                                        </Link>
                                                                        <div className="text-[11px] text-slate-600 font-bold mt-1 flex items-center gap-2 flex-wrap">
                                                                            <span>Số lượng: <b className="text-slate-900 font-black">{sp.so_luong || 1}</b></span>
                                                                            {sp.tuy_chon_chon?.ten_tuy_chon && (
                                                                                <span className="text-blue-900 font-black bg-blue-100/90 px-2 py-0.5 rounded-md border border-blue-300 text-[10.5px]">
                                                                                    {sp.tuy_chon_chon.ten_tuy_chon}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Giá tiền chuẩn xác */}
                                                                    <div className="text-right shrink-0">
                                                                        <div className="font-black text-rose-600 text-xs sm:text-sm font-mono whitespace-nowrap">
                                                                            {dinhDangTienVND(giaTongMuc)}
                                                                        </div>
                                                                        {(sp.so_luong || 1) > 1 && donGia > 0 && (
                                                                            <div className="text-[10px] text-slate-600 font-bold whitespace-nowrap">
                                                                                {dinhDangTienVND(donGia)}/máy
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* 2. TIMELINE STEPPER: BUNG TỪ TỪ ÊM ÁI BÊN DƯỚI CÁC SẢN PHẨM */}
                                                    <div
                                                        className={`grid transition-all duration-300 ease-in-out ${
                                                            danhSachMoTimeline[dh.id || dh.ma_don_hang]
                                                                ? 'grid-rows-[1fr] opacity-100 pt-2'
                                                                : 'grid-rows-[0fr] opacity-0 pt-0 pointer-events-none'
                                                        }`}
                                                    >
                                                        <div className="overflow-hidden">
                                                            <div className="rounded-2xl bg-gradient-to-br from-blue-50/95 via-sky-50/80 to-indigo-50/95 border-2 border-blue-300 p-3.5 sm:p-4.5 space-y-3.5 shadow-sm">
                                                                {/* 1. Thanh trạng thái & Mã vận đơn Viettel Post */}
                                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b-2 border-blue-200/80">
                                                                    <div className="flex items-center gap-3 min-w-0">
                                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
                                                                            {dh.trang_thai === 'da_giao' ? (
                                                                                <CheckCircle2 className="w-5 h-5" />
                                                                            ) : dh.trang_thai === 'dang_giao' ? (
                                                                                <Truck className="w-5 h-5 animate-pulse" />
                                                                            ) : (
                                                                                <PackageCheck className="w-5 h-5" />
                                                                            )}
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <div className="text-xs sm:text-sm font-black text-slate-900 truncate">
                                                                                {dh.trang_thai === 'da_giao'
                                                                                    ? 'Chặng 4/4: Giao hàng thành công trọn vẹn'
                                                                                    : dh.trang_thai === 'dang_giao'
                                                                                    ? 'Chặng 3/4: Đang vận chuyển hỏa tốc'
                                                                                    : dh.trang_thai === 'cho_xac_nhan'
                                                                                    ? 'Chặng 1/4: Hệ thống tiếp nhận đơn hàng'
                                                                                    : 'Chặng 2/4: Đang đóng gói & chuẩn bị xuất kho'}
                                                                            </div>
                                                                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 font-bold flex-wrap">
                                                                                <span>Viettel Post Express:</span>
                                                                                <span className="font-mono font-black text-blue-800 bg-white px-2 py-0.5 rounded-md border border-blue-300 shadow-2xs text-[11px]">
                                                                                    {dh.ma_van_don || `VTP-${dh.ma_don_hang?.replace(/\D/g, '') || '260922'}`}
                                                                                </span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => saoChepMaVanDon(dh.ma_van_don || `VTP-${dh.ma_don_hang?.replace(/\D/g, '') || '260922'}`)}
                                                                                    className="text-blue-600 hover:text-blue-800 font-black hover:underline cursor-pointer flex items-center gap-1 text-[11px] ml-0.5"
                                                                                    title="Sao chép mã vận đơn"
                                                                                >
                                                                                    {daSaoChepVanDon ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                                                                                    <span>{daSaoChepVanDon ? 'Đã chép' : 'Sao chép'}</span>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Tiến độ % badge */}
                                                                    <div className="self-start sm:self-auto shrink-0 flex items-center gap-2">
                                                                        <span className={`px-3 py-1 rounded-full text-xs font-black border-2 flex items-center gap-1.5 shadow-2xs ${
                                                                            dh.trang_thai === 'da_giao'
                                                                                ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                                                                                : 'bg-blue-100 text-blue-950 border-blue-400'
                                                                        }`}>
                                                                            <span className={`w-2 h-2 rounded-full ${dh.trang_thai === 'da_giao' ? 'bg-emerald-600' : 'bg-blue-600 animate-pulse'}`} />
                                                                            <span>{dh.trang_thai === 'da_giao' ? 'Tiến độ: 100%' : dh.trang_thai === 'dang_giao' ? 'Tiến độ: 75%' : 'Tiến độ: 50%'}</span>
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* 2. Stepper Trục Lộ Trình 4 Chặng với Icon riêng biệt */}
                                                                <div className="relative pt-2 pb-2">
                                                                    {/* Thanh ray nối tâm */}
                                                                    <div className="absolute top-6 sm:top-7 left-[12.5%] right-[12.5%] h-2 -translate-y-1/2 bg-slate-200 rounded-full z-0 overflow-hidden border border-slate-300">
                                                                        <div
                                                                            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-600 transition-all duration-700 ease-out rounded-full"
                                                                            style={{
                                                                                width: `${dh.trang_thai === 'da_giao' ? 100 : dh.trang_thai === 'dang_giao' ? 66.6 : 33.3}%`
                                                                            }}
                                                                        />
                                                                    </div>

                                                                    {/* 4 Trạm Mốc */}
                                                                    <div className="grid grid-cols-4 relative z-10">
                                                                        {layCacBuocDonHang(dh).map((st, i) => {
                                                                            const IconComponent = st.icon || PackageCheck;
                                                                            return (
                                                                                <div key={i} className="flex flex-col items-center text-center px-0.5 sm:px-1">
                                                                                    {/* Icon Box */}
                                                                                    <div
                                                                                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ring-4 ring-white ${
                                                                                            st.xong
                                                                                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 border-2 border-emerald-600'
                                                                                                : st.hienTai
                                                                                                ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50 border-2 border-blue-700 ring-4 ring-blue-300/60 ring-offset-2 ring-offset-white animate-pulse'
                                                                                                : 'bg-white text-slate-400 border-2 border-slate-300 shadow-2xs'
                                                                                        }`}
                                                                                    >
                                                                                        {st.xong ? (
                                                                                            <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                                                                                        ) : (
                                                                                            <IconComponent className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                                                                                        )}
                                                                                    </div>

                                                                                    {/* Status Pill Tag */}
                                                                                    <div className="mt-2">
                                                                                        <span
                                                                                            className={`inline-block px-1.5 sm:px-2 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-black border tracking-tight ${
                                                                                                st.xong
                                                                                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-2xs'
                                                                                                    : st.hienTai
                                                                                                    ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                                                                                                    : 'bg-slate-100 text-slate-500 border-slate-200'
                                                                                            }`}
                                                                                        >
                                                                                            {st.xong ? '✓ Đã xong' : st.hienTai ? '● Đang xử lý' : 'Chờ chặng tới'}
                                                                                        </span>
                                                                                    </div>

                                                                                    {/* Tên bước */}
                                                                                    <div
                                                                                        className={`text-xs sm:text-[13px] font-black mt-1 truncate max-w-full ${
                                                                                            st.hienTai ? 'text-blue-700' : st.xong ? 'text-slate-900' : 'text-slate-400'
                                                                                        }`}
                                                                                    >
                                                                                        {st.ten}
                                                                                    </div>

                                                                                    {/* Mô tả bước */}
                                                                                    <div className="text-[10px] text-slate-500 font-bold hidden sm:block truncate max-w-full mt-0.5">
                                                                                        {st.moTa || ''}
                                                                                    </div>

                                                                                    {/* Thời gian */}
                                                                                    <div
                                                                                        className={`text-[9.5px] sm:text-[11px] font-extrabold mt-0.5 truncate max-w-full ${
                                                                                            st.hienTai ? 'text-blue-600 font-black' : st.xong ? 'text-slate-600' : 'text-slate-400'
                                                                                        }`}
                                                                                    >
                                                                                        {st.thoiGian}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>

                                                                {/* 3. Footer Cam Kết An Toàn & Hotline Hỗ Trợ */}
                                                                <div className="pt-2.5 border-t-2 border-blue-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-600">
                                                                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                                                                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                                                        <span>Đồng kiểm ngoại quan & phụ kiện khi nhận máy • Bảo hành điện tử kích hoạt tự động theo IMEI/Serial</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1 text-slate-500 font-bold shrink-0">
                                                                        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                                        <span>Hotline giao nhận: <b className="text-blue-700 font-black font-mono">1800.6922</b> (Miễn phí)</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Footer Đơn Hàng: Tối ưu thông thoáng, chỉ đúng 2 nút bấm thông minh theo ngữ cảnh */}
                                                <div className="bg-slate-200/90 px-4 py-3 border-t-2 border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                                    {/* Cột trái: Người nhận & Tổng tiền không bao giờ bị cắt chữ */}
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 min-w-0">
                                                        <div className="text-slate-800 text-[11.5px] sm:text-xs font-bold">
                                                            <span className="text-slate-600 font-semibold">Người nhận:</span>{' '}
                                                            <strong className="text-slate-900 font-black">{dh.thong_tin_giao_hang?.ho_ten || dh.thong_tin_giao_hang?.ho_va_ten || 'Khách hàng'}</strong>
                                                            {dh.thong_tin_giao_hang?.so_dien_thoai && (
                                                                <span className="text-slate-600 ml-1 font-semibold font-mono">({dh.thong_tin_giao_hang.so_dien_thoai})</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                                                            <span className="text-slate-700 font-black text-[11px] uppercase tracking-wide">Tổng:</span>
                                                            <span className="text-sm sm:text-base font-black text-rose-600 font-mono">
                                                                {dinhDangTienVND(dh.tong_tien_thanh_toan)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Cột phải: Chỉ đúng 2 nút bấm theo đúng ngữ cảnh thực tế */}
                                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                                        {/* Nút 1: Luôn có nút Chi tiết đơn */}
                                                        <button
                                                            type="button"
                                                            onClick={() => setDonHangDangXemChiTiet(dh)}
                                                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-black border-2 border-slate-300 shadow-2xs hover:border-slate-400 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                                                        >
                                                            <Eye className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                                            <span>Chi tiết</span>
                                                        </button>

                                                        {/* Nút 2: Nút hành động chính chuẩn xác */}
                                                        {kiemTraChuaThanhToan(dh) ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => setDonHangThanhToanQR(dh)}
                                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs shadow-md shadow-orange-500/30 transition-all cursor-pointer whitespace-nowrap active:scale-95 border-2 border-amber-600"
                                                                title="Mở mã QR KienlongBank để quét và hoàn tất thanh toán"
                                                            >
                                                                <QrCode className="w-3.5 h-3.5 shrink-0" />
                                                                <span>Thanh toán ngay</span>
                                                            </button>
                                                        ) : dh.trang_thai === 'da_giao' ? (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => xuLyMuaLaiToanBoDon(e, dh)}
                                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-amber-400 hover:border-amber-600 bg-amber-100/90 hover:bg-amber-200 text-amber-950 font-black text-xs shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
                                                                title="Thêm tất cả sản phẩm trong đơn này vào giỏ hàng để mua lại"
                                                            >
                                                                <RotateCcw className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                                                                <span>Mua lại</span>
                                                            </button>
                                                        ) : dh.trang_thai === 'da_huy' ? (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => xuLyMuaLaiToanBoDon(e, dh)}
                                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-100 text-slate-800 font-black text-xs shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
                                                                title="Đặt lại các sản phẩm trong đơn đã hủy"
                                                            >
                                                                <RotateCcw className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                                                <span>Đặt lại</span>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleTimeline(dh.id || dh.ma_don_hang)}
                                                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 font-black text-xs transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                                                                    danhSachMoTimeline[dh.id || dh.ma_don_hang]
                                                                        ? 'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-600/25'
                                                                        : 'bg-white hover:bg-blue-50 text-blue-800 border-blue-400 shadow-2xs'
                                                                }`}
                                                                title="Bấm để xem hoặc thu gọn tiến độ giao hàng"
                                                            >
                                                                <Truck className="w-3.5 h-3.5 shrink-0" />
                                                                <span>{danhSachMoTimeline[dh.id || dh.ma_don_hang] ? 'Đóng tiến độ' : 'Xem tiến độ'}</span>
                                                                <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${danhSachMoTimeline[dh.id || dh.ma_don_hang] ? 'rotate-180' : ''}`} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 3: KHO VOUCHER & ƯU ĐÃI ĐÃ SĂN TONE SÁNG                              */}
                    {/* ========================================================================= */}
                    {tabHienTai === 'voucher' && (
                        <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-slate-300 shadow-md space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3.5 border-b-2 border-slate-200">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                            <Ticket className="w-4.5 h-4.5" />
                                        </div>
                                        <span>Ví Voucher & Mã Ưu Đãi Đã Săn</span>
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-1 font-medium">
                                        Mã giảm giá đã lưu vào ví sẽ tự động gợi ý tại bước thanh toán để tối ưu chi phí.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCheDoXemVoucher('vi_cua_toi')}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border-2 ${
                                            cheDoXemVoucher === 'vi_cua_toi'
                                                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                                : 'bg-white border-slate-300 text-slate-800 hover:border-purple-400'
                                        }`}
                                    >
                                        Ví của tôi ({soLuongVoucherVi})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCheDoXemVoucher('kho_voucher')}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border-2 ${
                                            cheDoXemVoucher === 'kho_voucher'
                                                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                                : 'bg-white border-slate-300 text-slate-800 hover:border-purple-400'
                                        }`}
                                    >
                                        <span className="flex items-center gap-1.5">
                                            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                            <span>Săn thêm ({danhSachVoucher.length})</span>
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Bộ Lọc Danh Mục Voucher: Tinh gọn, flex-wrap chống cuộn ngang */}
                            {cheDoXemVoucher === 'kho_voucher' && (
                                <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                                    {[
                                        { id: 'tat_ca', label: 'Tất cả mã' },
                                        { id: 'laptop-gaming', label: 'Gaming' },
                                        { id: 'laptop-van-phong', label: 'Văn phòng' },
                                        { id: 'phu-kien', label: 'Phụ kiện' },
                                        { id: 'sinh-vien', label: 'Sinh viên' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setBoLocVoucher(tab.id)}
                                            className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                                                boLocVoucher === tab.id
                                                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {dangTaiVoucher ? (
                                <div className="py-12 text-center text-slate-400">
                                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-500 mb-2" />
                                    <p className="text-xs font-bold">Đang tải ví voucher của bạn...</p>
                                </div>
                            ) : cheDoXemVoucher === 'vi_cua_toi' && danhSachVoucherTrongVi.length === 0 ? (
                                <div className="py-12 px-6 text-center rounded-3xl border-2 border-dashed border-purple-200 bg-purple-50/40 space-y-4">
                                    <div className="w-16 h-16 rounded-3xl bg-white text-purple-600 mx-auto flex items-center justify-center border-2 border-purple-100 shadow-sm">
                                        <Ticket className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-slate-800">Ví voucher của bạn hiện đang trống</h3>
                                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                                            Bạn chưa lưu mã giảm giá nào vào ví riêng. Hãy mở Kho ưu đãi để săn ngay các mã giảm tới 3.000.000đ khi đặt laptop!
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setCheDoXemVoucher('kho_voucher')}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md shadow-purple-500/25 transition-all cursor-pointer hover:scale-102"
                                    >
                                        <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                                        <span>Khám Phá & Săn Mã Ngay</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ) : danhSachVoucherHienThi.length === 0 ? (
                                <div className="py-12 text-center space-y-3 border-2 border-dashed border-slate-200 rounded-3xl p-6">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                                        <Ticket className="w-7 h-7" />
                                    </div>
                                    <div className="text-xs font-black text-slate-700">
                                        Chưa có voucher nào trong bộ lọc này
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setBoLocVoucher('tat_ca')}
                                        className="text-xs font-bold text-purple-600 hover:underline cursor-pointer"
                                    >
                                        Xem tất cả mã
                                    </button>
                                </div>
                            ) : (
                                /* LƯỚI VOUCHER 3 CỘT TRÊN LAPTOP / DESKTOP (GỌN GÀNG, TỈ LỆ CHUẨN ĐẸP) */
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                                    {danhSachVoucherHienThi.map((vc) => {
                                        const mau = layMauSacVoucher(vc);
                                        const daLuuTrongVi = nguoiDung?.viVoucher?.includes(vc.ma_code);
                                        const dangLuu = dangLuuVoucher[vc.ma_code];

                                        return (
                                            <div
                                                key={vc.id || vc.ma_code}
                                                className="rounded-2xl shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-2 border-slate-200/90 flex flex-col justify-between bg-white relative group overflow-hidden"
                                            >
                                                {/* Mép đục lỗ răng cưa vé voucher (Scallop holes) bên trái */}
                                                <div className="absolute -left-[5px] top-3 bottom-3 flex flex-col justify-between z-20 pointer-events-none">
                                                    {[...Array(7)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className="w-2.5 h-2.5 rounded-full bg-[#dfe6f0]"
                                                        />
                                                    ))}
                                                </div>

                                                {/* Nửa trên: Gradient màu sắc chủ đạo + Badge ngày + Giá trị + Icon watermark */}
                                                <div className={`${mau.dauCard} p-3.5 text-white relative flex flex-col justify-between min-h-[110px]`}>
                                                    <div className="flex items-center justify-between z-10">
                                                        <span className="text-[11px] font-black text-white/95 uppercase tracking-wider">
                                                            Ưu Đãi
                                                        </span>
                                                        <span className="text-[10px] font-bold bg-white/20 backdrop-blur-xs border border-white/30 px-2 py-0.5 rounded-full text-white shadow-2xs">
                                                            {vc.ngay_het_han || 'Còn 15 ngày'}
                                                        </span>
                                                    </div>

                                                    {/* Icon mờ lớn ở góc phải */}
                                                    <div className="absolute right-2.5 top-6 pointer-events-none opacity-80 scale-90">
                                                        {layIconVoucher(vc)}
                                                    </div>

                                                    <div className="z-10 mt-1">
                                                        <div className="text-xl sm:text-2xl font-black tracking-tight leading-none text-white my-0.5">
                                                            {vc.loai_giam_gia === 'phan_tram' || vc.loai_giam === 'phan_tram' ? `${vc.gia_tri_giam}%` : dinhDangTienVND(vc.gia_tri_giam)}
                                                        </div>
                                                        <div className="text-[11px] font-bold text-white/95 mt-1 leading-snug line-clamp-1">
                                                            {vc.tieu_de || vc.mo_ta || 'Áp dụng cho đơn laptop chính hãng'}
                                                        </div>
                                                        <div className="text-[10px] text-white/80 mt-0.5 font-medium">
                                                            Đơn từ {dinhDangTienVND(vc.gia_tri_don_hang_toi_thieu || vc.don_hang_toi_thieu || 0)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Nửa dưới: Hộp mã code + nút Copy + Nút hành động */}
                                                <div className="p-3 bg-white space-y-2">
                                                    <div className={`rounded-xl px-2.5 py-1.5 flex items-center justify-between border-2 ${mau.pillBorder} ${mau.pillBg} transition-colors`}>
                                                        <span className={`font-mono font-black tracking-wider text-xs ${mau.mauCode}`}>
                                                            {vc.ma_code}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => saoChepMaVoucher(vc.ma_code)}
                                                            className="p-1 text-slate-400 hover:text-slate-700 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                                                            title="Sao chép mã"
                                                        >
                                                            {daSaoChepMa === vc.ma_code ? (
                                                                <span className="flex items-center gap-1 text-[10.5px] font-black text-emerald-600">
                                                                    <Check className="w-3 h-3" />
                                                                    <span>Đã chép</span>
                                                                </span>
                                                            ) : (
                                                                <Copy className="w-3.5 h-3.5" />
                                                            )}
                                                        </button>
                                                    </div>

                                                    {daLuuTrongVi ? (
                                                        <Link
                                                            href="/san-pham"
                                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2 rounded-xl shadow-xs flex items-center justify-center gap-1.5 text-xs transition-all hover:-translate-y-0.5 active:scale-98"
                                                        >
                                                            <CheckCheck className="w-3.5 h-3.5" />
                                                            <span>Đã trong ví • Dùng ngay</span>
                                                        </Link>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => xuLyLuuVoucher(vc.ma_code)}
                                                            disabled={dangLuu}
                                                            className={`w-full ${mau.nutBam} text-white font-black py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-all hover:-translate-y-0.5 active:scale-98 cursor-pointer disabled:opacity-75`}
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                            <span>{dangLuu ? 'Đang lưu...' : 'Lưu voucher vào ví'}</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 4: SỔ ĐỊA CHỈ NHẬN HÀNG TONE SÁNG CAO CẤP - PHÂN VÙNG MÀU CHỨC NĂNG  */}
                    {/* ========================================================================= */}
                    {tabHienTai === 'dia-chi' && (
                        <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-slate-300 shadow-md space-y-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b-2 border-slate-200">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
                                            <MapPin className="w-4.5 h-4.5" />
                                        </div>
                                        <span>Sổ Địa Chỉ Nhận Hàng</span>
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                                            {danhSachDiaChi.length} địa chỉ
                                        </span>
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                                        Dữ liệu 63 tỉnh thành chuẩn quốc gia. Hỗ trợ tìm kiếm nhanh và đặt hàng hỏa tốc trong 1 click.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={batDauThemDiaChi}
                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all cursor-pointer self-start sm:self-auto active:scale-95"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Thêm Địa Chỉ Mới</span>
                                </button>
                            </div>

                            {/* Form Thêm/Sửa địa chỉ: Phân vùng màu sắc trực quan theo chức năng */}
                            {dangMoFormDiaChi && (
                                <form onSubmit={xuLyLuuDiaChi} className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-emerald-400 space-y-4 animate-in fade-in duration-200 shadow-md">
                                    <div className="flex items-center justify-between pb-2.5 border-b border-emerald-100">
                                        <div className="flex items-center gap-2 font-black text-sm text-slate-900">
                                            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                                <MapPin className="w-3.5 h-3.5" />
                                            </div>
                                            <span>{idDiaChiSua ? 'Cập Nhật Địa Chỉ Nhận Hàng' : 'Thiết Lập Địa Chỉ Nhận Hàng Mới'}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setDangMoFormDiaChi(false)}
                                            className="w-7 h-7 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* PHÂN VÙNG 1: THÔNG TIN NGƯỜI NHẬN (TONE BLUE) */}
                                    <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-2.5">
                                        <div className="text-[11px] font-black text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5 text-blue-600" />
                                            <span>1. Người Nhận Hàng</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                                    Họ và tên người nhận *
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Ví dụ: Lê Trí"
                                                        value={formDiaChi.hoTen}
                                                        onChange={(e) => {
                                                            setFormDiaChi({ ...formDiaChi, hoTen: e.target.value });
                                                            setDaChamDiaChi(prev => ({ ...prev, hoTen: true }));
                                                        }}
                                                        onBlur={() => setDaChamDiaChi(prev => ({ ...prev, hoTen: true }))}
                                                        className={`w-full pl-9 pr-8 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                                                            daChamDiaChi.hoTen && loiDiaChiHoTen
                                                                ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600 focus:ring-2 focus:ring-rose-200'
                                                                : daChamDiaChi.hoTen && !loiDiaChiHoTen && formDiaChi.hoTen.trim()
                                                                ? 'border-emerald-500 bg-emerald-50/20 text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
                                                                : 'border-blue-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500'
                                                        }`}
                                                    />
                                                    <User className="w-3.5 h-3.5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                                    {daChamDiaChi.hoTen && loiDiaChiHoTen && (
                                                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
                                                    )}
                                                    {daChamDiaChi.hoTen && !loiDiaChiHoTen && formDiaChi.hoTen.trim() && (
                                                        <Check className="w-3.5 h-3.5 text-emerald-600 absolute right-2.5 top-1/2 -translate-y-1/2" />
                                                    )}
                                                </div>
                                                {daChamDiaChi.hoTen && loiDiaChiHoTen && (
                                                    <p className="text-[10.5px] font-bold text-rose-600 flex items-center gap-1 mt-1">
                                                        <AlertCircle className="w-3 h-3 shrink-0" />
                                                        <span>{loiDiaChiHoTen}</span>
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                                    Số điện thoại liên hệ *
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="tel"
                                                        required
                                                        placeholder="Ví dụ: 0912 345 678"
                                                        value={formDiaChi.soDienThoai}
                                                        onChange={(e) => {
                                                            setFormDiaChi({ ...formDiaChi, soDienThoai: e.target.value });
                                                            setDaChamDiaChi(prev => ({ ...prev, soDienThoai: true }));
                                                        }}
                                                        onBlur={() => setDaChamDiaChi(prev => ({ ...prev, soDienThoai: true }))}
                                                        className={`w-full pl-9 pr-8 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                                                            daChamDiaChi.soDienThoai && loiDiaChiSoDienThoai
                                                                ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600 focus:ring-2 focus:ring-rose-200'
                                                                : daChamDiaChi.soDienThoai && !loiDiaChiSoDienThoai && formDiaChi.soDienThoai.trim()
                                                                ? 'border-emerald-500 bg-emerald-50/20 text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
                                                                : 'border-blue-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500'
                                                        }`}
                                                    />
                                                    <Phone className="w-3.5 h-3.5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                                    {daChamDiaChi.soDienThoai && loiDiaChiSoDienThoai && (
                                                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
                                                    )}
                                                    {daChamDiaChi.soDienThoai && !loiDiaChiSoDienThoai && formDiaChi.soDienThoai.trim() && (
                                                        <Check className="w-3.5 h-3.5 text-emerald-600 absolute right-2.5 top-1/2 -translate-y-1/2" />
                                                    )}
                                                </div>
                                                {daChamDiaChi.soDienThoai && loiDiaChiSoDienThoai && (
                                                    <p className="text-[10.5px] font-bold text-rose-600 flex items-center gap-1 mt-1">
                                                        <AlertCircle className="w-3 h-3 shrink-0" />
                                                        <span>{loiDiaChiSoDienThoai}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* PHÂN VÙNG 2: ĐỊA GIỚI HÀNH CHÍNH (TONE EMERALD/TEAL) - CHUẨN API V2 VÀ V1 */}
                                    <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-2.5">
                                        <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-emerald-200/60">
                                            <div className="text-[11px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                                                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                                                <span>2. Địa Giới Hành Chính</span>
                                            </div>

                                            {/* Tab chuyển đổi chuẩn địa giới: Chuẩn Mới 34 Tỉnh/TP vs Chuẩn 63 Tỉnh/TP */}
                                            <div className="flex items-center gap-1 p-0.5 bg-emerald-100/80 rounded-xl border border-emerald-300">
                                                <button
                                                    type="button"
                                                    onClick={() => doiCheDoDiaGioi('v2')}
                                                    className={`px-2.5 py-1 rounded-lg text-[10.5px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                                                        cheDoDiaGioi === 'v2'
                                                            ? 'bg-emerald-700 text-white shadow-xs'
                                                            : 'text-emerald-900 hover:bg-emerald-200/60'
                                                    }`}
                                                    title="Chuẩn API v2 sau sáp nhập - 34 Tỉnh/Thành phố trực thuộc Trung ương"
                                                >
                                                    <Zap className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                                    <span>API v2 (34 Tỉnh/TP Mới)</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => doiCheDoDiaGioi('v1')}
                                                    className={`px-2.5 py-1 rounded-lg text-[10.5px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                                                        cheDoDiaGioi === 'v1'
                                                            ? 'bg-blue-700 text-white shadow-xs'
                                                            : 'text-emerald-900 hover:bg-emerald-200/60'
                                                    }`}
                                                    title="Chuẩn hành chính 63 Tỉnh/Thành phố truyền thống (Có Tỉnh Bến Tre, Tiền Giang, Long An...)"
                                                >
                                                    <span>63 Tỉnh/TP (Truyền Thống)</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Ghi chú chỉ dẫn sáp nhập thông minh khi ở chế độ V2 */}
                                        {cheDoDiaGioi === 'v2' ? (
                                            <>
                                                <div className="p-2 rounded-lg bg-emerald-100/60 border border-emerald-300/80 text-[10.5px] text-emerald-900 flex items-start gap-1.5 leading-relaxed">
                                                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                                    <div>
                                                        <span className="font-black">Lưu ý chuẩn API v2: </span>
                                                        <span>
                                                            Theo cấu trúc mới, 63 tỉnh cũ được sáp nhập thành 34 tỉnh/TP. 
                                                            Khu vực <strong>Bến Tre, Trà Vinh</strong> thuộc <strong>Tỉnh Vĩnh Long</strong>; 
                                                            <strong> Tiền Giang</strong> thuộc <strong>Tỉnh Đồng Tháp</strong>; 
                                                            <strong> Bình Dương</strong> thuộc <strong>TP. Hồ Chí Minh</strong>; 
                                                            <strong> Long An</strong> thuộc <strong>Tây Ninh</strong>.
                                                            (Hoặc bấm tab <strong>63 Tỉnh/TP (Truyền Thống)</strong> ở trên nếu muốn chọn riêng Tỉnh Bến Tre).
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <BoChonDiaGioi
                                                        label="Tỉnh / Thành phố (34 Tỉnh/TP Sau Sáp Nhập) *"
                                                        icon={Building2}
                                                        danhSach={danhSachTinh}
                                                        giaTri={formDiaChi.tinhThanh}
                                                        onChon={chonTinhThanh}
                                                        placeholder="Gõ tìm Tỉnh/TP (VD: Vĩnh Long, Hà Nội, HCM...)"
                                                    />

                                                    <BoChonDiaGioi
                                                        label="Phường / Xã (Chuẩn hành chính mới) *"
                                                        icon={Home}
                                                        danhSach={danhSachXa}
                                                        giaTri={formDiaChi.phuongXa}
                                                        onChon={chonPhuongXa}
                                                        placeholder={formDiaChi.tinhThanh ? `Chọn Phường / Xã (${danhSachXa.length} nơi)...` : "Vui lòng chọn Tỉnh / TP trước"}
                                                        disabled={!formDiaChi.tinhThanh}
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-[10.5px] text-blue-900 flex items-center gap-1.5 leading-tight">
                                                    <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                    <span>
                                                        Chuẩn 63 Tỉnh/Thành phố truyền thống (3 cấp: Tỉnh ➔ Quận/Huyện ➔ Phường/Xã đầy đủ như Tỉnh Bến Tre, Tiền Giang, Long An...).
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    <BoChonDiaGioi
                                                        label="Tỉnh / Thành phố (63 Tỉnh) *"
                                                        icon={Building2}
                                                        danhSach={danhSachTinh}
                                                        giaTri={formDiaChi.tinhThanh}
                                                        onChon={chonTinhThanh}
                                                        placeholder="Chọn Tỉnh / TP..."
                                                    />

                                                    <BoChonDiaGioi
                                                        label="Quận / Huyện *"
                                                        icon={Compass}
                                                        danhSach={danhSachQuan}
                                                        giaTri={formDiaChi.quanHuyen}
                                                        onChon={chonQuanHuyen}
                                                        placeholder={formDiaChi.tinhThanh ? `Chọn Quận / Huyện (${danhSachQuan.length})...` : "Chọn Tỉnh trước"}
                                                        disabled={!formDiaChi.tinhThanh}
                                                    />

                                                    <BoChonDiaGioi
                                                        label="Phường / Xã *"
                                                        icon={Home}
                                                        danhSach={danhSachXa}
                                                        giaTri={formDiaChi.phuongXa}
                                                        onChon={chonPhuongXa}
                                                        placeholder={formDiaChi.quanHuyen ? `Chọn Phường / Xã (${danhSachXa.length})...` : "Chọn Huyện trước"}
                                                        disabled={!formDiaChi.quanHuyen}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* PHÂN VÙNG 3: ĐỊA CHỈ CHI TIẾT (TONE PURPLE) */}
                                    <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200/80 space-y-2">
                                        <label className="block text-[11px] font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-purple-600" />
                                            <span>3. Số Nhà, Tên Đường, Tòa Nhà Chi Tiết *</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                placeholder="Ví dụ: 123 Nguyễn Thị Minh Khai, Tòa nhà Bitexco tầng 12..."
                                                value={formDiaChi.diaChiChiTiet}
                                                onChange={(e) => {
                                                    setFormDiaChi({ ...formDiaChi, diaChiChiTiet: e.target.value });
                                                    setDaChamDiaChi(prev => ({ ...prev, diaChiChiTiet: true }));
                                                }}
                                                onBlur={() => setDaChamDiaChi(prev => ({ ...prev, diaChiChiTiet: true }))}
                                                className={`w-full pl-9 pr-8 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                                                    daChamDiaChi.diaChiChiTiet && loiDiaChiChiTiet
                                                        ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600 focus:ring-2 focus:ring-rose-200'
                                                        : daChamDiaChi.diaChiChiTiet && !loiDiaChiChiTiet && formDiaChi.diaChiChiTiet.trim()
                                                        ? 'border-emerald-500 bg-emerald-50/20 text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
                                                        : 'border-purple-200 bg-white text-slate-900 focus:outline-none focus:border-purple-500'
                                                }`}
                                            />
                                            <MapPin className="w-3.5 h-3.5 text-purple-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                            {daChamDiaChi.diaChiChiTiet && loiDiaChiChiTiet && (
                                                <AlertCircle className="w-3.5 h-3.5 text-rose-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
                                            )}
                                            {daChamDiaChi.diaChiChiTiet && !loiDiaChiChiTiet && formDiaChi.diaChiChiTiet.trim() && (
                                                <Check className="w-3.5 h-3.5 text-emerald-600 absolute right-2.5 top-1/2 -translate-y-1/2" />
                                            )}
                                        </div>
                                        {daChamDiaChi.diaChiChiTiet && loiDiaChiChiTiet && (
                                            <p className="text-[10.5px] font-bold text-rose-600 flex items-center gap-1 mt-1">
                                                <AlertCircle className="w-3 h-3 shrink-0" />
                                                <span>{loiDiaChiChiTiet}</span>
                                            </p>
                                        )}
                                    </div>

                                    {/* PHÂN VÙNG 4: PHÂN LOẠI & THIẾT LẬP MẶC ĐỊNH */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                        <div className="flex items-center gap-3 text-xs font-bold">
                                            <button
                                                type="button"
                                                onClick={() => setFormDiaChi({ ...formDiaChi, loaiDiaChi: 'nha_rieng' })}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                                    formDiaChi.loaiDiaChi === 'nha_rieng'
                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                            >
                                                <Home className="w-3.5 h-3.5" />
                                                <span>Nhà riêng</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setFormDiaChi({ ...formDiaChi, loaiDiaChi: 'van_phong' })}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                                    formDiaChi.loaiDiaChi === 'van_phong'
                                                        ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                            >
                                                <Building2 className="w-3.5 h-3.5" />
                                                <span>Văn phòng</span>
                                            </button>

                                            <label className="flex items-center gap-1.5 cursor-pointer ml-1 select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={formDiaChi.macDinh}
                                                    onChange={(e) => setFormDiaChi({ ...formDiaChi, macDinh: e.target.checked })}
                                                    className="rounded text-emerald-600 accent-emerald-600 w-4 h-4 cursor-pointer"
                                                />
                                                <span className="text-slate-800 text-xs font-bold">Đặt làm địa chỉ mặc định</span>
                                            </label>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setDangMoFormDiaChi(false)}
                                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors"
                                            >
                                                Hủy bỏ
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-sm transition-all cursor-pointer active:scale-95"
                                            >
                                                {idDiaChiSua ? 'Cập Nhật' : 'Lưu Địa Chỉ'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {/* Danh sách các địa chỉ đã lưu với thẻ Card sang trọng, phân màu rõ ràng */}
                            <div className="space-y-3">
                                {danhSachDiaChi.length === 0 ? (
                                    <div className="py-10 text-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 p-6 space-y-3">
                                        <div className="w-14 h-14 rounded-2xl bg-white text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-100 shadow-sm">
                                            <MapPin className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-800">Bạn chưa lưu địa chỉ nhận hàng nào</h4>
                                            <p className="text-xs text-slate-500 mt-1">Thêm địa chỉ nhà riêng hoặc văn phòng để đặt hàng hỏa tốc trong 1 click.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={batDauThemDiaChi}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm transition-all cursor-pointer hover:scale-102"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span>Thêm địa chỉ ngay</span>
                                        </button>
                                    </div>
                                ) : (
                                    danhSachDiaChi.map((dc) => (
                                        <div
                                            key={dc.id}
                                            className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                                                dc.macDinh
                                                    ? 'border-emerald-500 bg-gradient-to-r from-emerald-50/80 via-teal-50/30 to-white shadow-md shadow-emerald-500/10'
                                                    : 'border-2 border-slate-300 bg-white hover:border-emerald-400 shadow-sm'
                                            }`}
                                        >
                                            <div className="space-y-2 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-black text-slate-900 text-sm flex items-center gap-1.5 bg-white px-2.5 py-0.5 rounded-lg border-2 border-slate-300 shadow-2xs">
                                                        <User className="w-3.5 h-3.5 text-blue-600" />
                                                        <span>{dc.hoTen}</span>
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-lg border-2 border-slate-300 flex items-center gap-1 font-mono shadow-2xs">
                                                        <Phone className="w-3 h-3 text-emerald-600" />
                                                        <span>{dc.soDienThoai}</span>
                                                    </span>
                                                    {dc.macDinh && (
                                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10.5px] font-black shadow-xs flex items-center gap-1">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            <span>Mặc định</span>
                                                        </span>
                                                    )}
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-black border flex items-center gap-1 shadow-2xs ${
                                                        dc.loaiDiaChi === 'van_phong'
                                                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                            : 'bg-blue-50 text-blue-700 border-blue-200'
                                                    }`}>
                                                        {dc.loaiDiaChi === 'van_phong' ? <Building2 className="w-2.5 h-2.5" /> : <Home className="w-2.5 h-2.5" />}
                                                        <span>{dc.loaiDiaChi === 'van_phong' ? 'Văn phòng' : 'Nhà riêng'}</span>
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-600 font-medium flex items-start gap-2 pt-0.5">
                                                    <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                                                        <MapPin className="w-3 h-3" />
                                                    </div>
                                                    <span className="text-slate-800 font-bold leading-relaxed">
                                                        {[dc.diaChiChiTiet, dc.phuongXa, dc.quanHuyen, dc.tinhThanh].filter(Boolean).join(', ')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                                {!dc.macDinh && (
                                                    <button
                                                        type="button"
                                                        onClick={() => datLamMacDinh(dc.id)}
                                                        className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-xs text-emerald-700 font-bold cursor-pointer shadow-2xs transition-all active:scale-95"
                                                    >
                                                        Đặt mặc định
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIdDiaChiSua(dc.id);
                                                        setFormDiaChi(dc);
                                                        setDangMoFormDiaChi(true);
                                                    }}
                                                    className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 bg-white cursor-pointer transition-all shadow-2xs active:scale-95"
                                                    title="Sửa địa chỉ"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => xoaDiaChi(dc.id)}
                                                    className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 bg-white cursor-pointer transition-all shadow-2xs active:scale-95"
                                                    title="Xóa địa chỉ"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 5: ĐỔI MẬT KHẨU & BẢO MẬT RỰC RỠ, ĐẬM MÀU (TONE MOS & MODERN GAMIFIED) */}
                    {/* ========================================================================= */}
                    {tabHienTai === 'bao-mat' && (
                        <div className="rounded-3xl bg-white border-2 border-indigo-300 shadow-xl overflow-hidden space-y-0">
                            {/* Dải Banner Header Rực Rỡ Gradient Đa Sắc */}
                            <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-md shrink-0">
                                        <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                                            <span>Đổi Mật Khẩu & Bảo Mật Tài Khoản</span>
                                        </h2>
                                        <p className="text-xs text-blue-100 font-medium mt-0.5">
                                            Quản lý mật khẩu đăng nhập, bảo vệ thông tin đơn hàng và tài sản voucher an toàn 100%
                                        </p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-emerald-400/25 border border-emerald-300/40 text-emerald-200 text-xs font-black self-start sm:self-auto flex items-center gap-1.5 shadow-2xs">
                                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                                    <span>Bảo Mật 256-Bit</span>
                                </span>
                            </div>

                            <div className="p-5 sm:p-7 space-y-6 bg-gradient-to-b from-slate-50/50 to-white">
                                {/* Centered Container for Security Form & Google Status Card */}
                                <div className="max-w-[490px] mx-auto space-y-5">
                                    {/* Banner Trạng Thái Tài Khoản Google (Tone Rực Rỡ, Căn Giữa Gọn Gàng) */}
                                    {laTaiKhoanGoogle && (
                                        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/70 to-sky-50 border-2 border-blue-400/80 flex items-start gap-3.5 shadow-md shadow-blue-500/10">
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center shrink-0 p-2 border-2 border-blue-200">
                                                <svg className="w-full h-full" viewBox="0 0 24 24">
                                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0 text-xs">
                                                <div className="font-black text-slate-900 flex items-center justify-between gap-2">
                                                    <span className="text-sm font-black">Tài Khoản Google OAuth 2.0</span>
                                                    <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-[10.5px] shadow-xs">
                                                        ✓ Bảo vệ 2 lớp
                                                    </span>
                                                </div>
                                                <p className="text-slate-700 mt-1 leading-relaxed text-[11.5px] font-semibold">
                                                    Đã liên kết an toàn với email <b className="text-blue-700 underline font-black">{nguoiDung?.email}</b>. Bạn có thể thiết lập thêm mật khẩu độc lập để đăng nhập linh hoạt mọi lúc.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Form Đổi Mật Khẩu (Căn Giữa, Tinh Tế, Viền Đậm, Đậm Màu) */}
                                    <form onSubmit={xuLyDoiMatKhau} className="rounded-2xl border-2 border-indigo-400/90 bg-white shadow-xl shadow-indigo-500/10 overflow-hidden">
                                        {/* Form Card Header Ribbon */}
                                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between shadow-xs">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs border border-white/30 text-white flex items-center justify-center shadow-xs">
                                                    <KeyRound className="w-4.5 h-4.5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-black text-white">
                                                        {canNhapMatKhauCu ? 'Đổi Mật Khẩu Đăng Nhập' : 'Thiết Lập Mật Khẩu Mới'}
                                                    </h3>
                                                    <p className="text-[11px] text-blue-100 font-medium">
                                                        {canNhapMatKhauCu ? 'Bảo vệ tài khoản với mật khẩu bảo mật cao' : 'Tạo mật khẩu để đăng nhập bằng Email & Mật khẩu'}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10.5px] shadow-xs">
                                                Bảo mật cao
                                            </span>
                                        </div>

                                        <div className="p-5 sm:p-6 space-y-4.5 bg-gradient-to-b from-white to-indigo-50/20">
                                            {/* Mật khẩu cũ nếu có */}
                                            {canNhapMatKhauCu && (
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-black text-slate-800 flex items-center gap-2">
                                                        <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-300 shadow-2xs">
                                                            <Lock className="w-3 h-3 stroke-[2.5]" />
                                                        </span>
                                                        <span>Mật Khẩu Hiện Tại</span>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={hienMatKhauCu ? 'text' : 'password'}
                                                            required
                                                            value={matKhauCu}
                                                            onChange={(e) => setMatKhauCu(e.target.value)}
                                                            placeholder="Nhập mật khẩu đang dùng của bạn..."
                                                            className="w-full px-3.5 pr-11 py-2.5 rounded-xl border-2 border-amber-300 hover:border-amber-400 bg-white text-slate-900 text-xs sm:text-sm font-bold focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all shadow-xs"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setHienMatKhauCu(!hienMatKhauCu)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 cursor-pointer p-1"
                                                        >
                                                            {hienMatKhauCu ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Mật khẩu mới */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-slate-800 flex items-center gap-2">
                                                    <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-300 shadow-2xs">
                                                        <KeyRound className="w-3 h-3 stroke-[2.5]" />
                                                    </span>
                                                    <span>{canNhapMatKhauCu ? 'Mật Khẩu Mới' : 'Mật Khẩu Mới Cần Thiết Lập'}</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={hienMatKhauMoi ? 'text' : 'password'}
                                                        required
                                                        value={matKhauMoi}
                                                        onChange={(e) => setMatKhauMoi(e.target.value)}
                                                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..."
                                                        className="w-full px-3.5 pr-11 py-2.5 rounded-xl border-2 border-blue-300 hover:border-blue-400 bg-white text-slate-900 text-xs sm:text-sm font-bold focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-xs"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setHienMatKhauMoi(!hienMatKhauMoi)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 cursor-pointer p-1"
                                                    >
                                                        {hienMatKhauMoi ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>

                                                {/* Visual Meter Đo Độ Mạnh Mật Khẩu (Rực Rỡ, Đậm Màu) */}
                                                {matKhauMoi && (
                                                    <div className="space-y-2.5 p-3.5 rounded-xl bg-gradient-to-r from-slate-50 via-blue-50/60 to-indigo-50/60 border-2 border-indigo-200 mt-2 shadow-xs">
                                                        <div className="flex items-center justify-between text-xs font-black">
                                                            <span className="text-slate-600">Độ an toàn:</span>
                                                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                                                                diemDoManh <= 35
                                                                    ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                                                    : diemDoManh <= 70
                                                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                            }`}>
                                                                {diemDoManh <= 35 ? '⚠️ Yếu (Cần thêm)' : diemDoManh <= 70 ? '⚡ Khá tốt' : '🛡️ Rất mạnh & Chuẩn'}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-1.5 h-2">
                                                            <div className={`rounded-full transition-all duration-300 ${diemDoManh >= 35 ? (diemDoManh > 70 ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : diemDoManh > 35 ? 'bg-amber-500 shadow-xs shadow-amber-500/50' : 'bg-rose-500 shadow-xs shadow-rose-500/50') : 'bg-slate-200'}`} />
                                                            <div className={`rounded-full transition-all duration-300 ${diemDoManh >= 70 ? (diemDoManh > 70 ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-amber-500 shadow-xs shadow-amber-500/50') : 'bg-slate-200'}`} />
                                                            <div className={`rounded-full transition-all duration-300 ${diemDoManh >= 100 ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-slate-200'}`} />
                                                        </div>

                                                        <div className="grid grid-cols-3 gap-1.5 pt-0.5 text-[11px] font-black text-center">
                                                            <span className={`px-2 py-1 rounded-lg border flex items-center justify-center gap-1 transition-all ${tieuChiMatKhau.doDai ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs' : 'bg-white text-slate-400 border-slate-200'}`}>
                                                                {tieuChiMatKhau.doDai ? '✓' : '•'} ≥ 6 Ký tự
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-lg border flex items-center justify-center gap-1 transition-all ${tieuChiMatKhau.chuHoaThuong ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs' : 'bg-white text-slate-400 border-slate-200'}`}>
                                                                {tieuChiMatKhau.chuHoaThuong ? '✓' : '•'} Hoa & Thường
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-lg border flex items-center justify-center gap-1 transition-all ${tieuChiMatKhau.chuSoHoacKyTu ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs' : 'bg-white text-slate-400 border-slate-200'}`}>
                                                                {tieuChiMatKhau.chuSoHoacKyTu ? '✓' : '•'} Số / Ký tự
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Xác nhận mật khẩu mới */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-slate-800 flex items-center justify-between">
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center border border-purple-300 shadow-2xs">
                                                            <Shield className="w-3 h-3 stroke-[2.5]" />
                                                        </span>
                                                        <span>Xác Nhận Lại Mật Khẩu</span>
                                                    </span>
                                                    {daChamXacNhan && !loiXacNhanMatKhau && xacNhanMatKhauMoi && xacNhanMatKhauMoi === matKhauMoi && (
                                                        <span className="text-xs text-emerald-600 font-black flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                                                            <Check className="w-3.5 h-3.5 stroke-[3]" /> Trùng khớp 100%
                                                        </span>
                                                    )}
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={hienXacNhanMatKhau ? 'text' : 'password'}
                                                        required
                                                        value={xacNhanMatKhauMoi}
                                                        onChange={(e) => {
                                                            setXacNhanMatKhauMoi(e.target.value);
                                                            setDaChamXacNhan(true);
                                                        }}
                                                        onBlur={() => setDaChamXacNhan(true)}
                                                        placeholder="Nhập lại chính xác mật khẩu..."
                                                        className={`w-full px-3.5 pr-11 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold focus:outline-none transition-all shadow-xs ${
                                                            daChamXacNhan && loiXacNhanMatKhau
                                                                ? 'border-rose-500 bg-rose-50/50 text-rose-900 focus:border-rose-600 focus:ring-4 focus:ring-rose-500/20'
                                                                : daChamXacNhan && !loiXacNhanMatKhau && xacNhanMatKhauMoi && xacNhanMatKhauMoi === matKhauMoi
                                                                ? 'border-emerald-500 bg-emerald-50/30 text-slate-900 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/20'
                                                                : 'border-purple-300 hover:border-purple-400 bg-white text-slate-900 focus:border-purple-600 focus:ring-4 focus:ring-purple-500/20'
                                                        }`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setHienXacNhanMatKhau(!hienXacNhanMatKhau)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 cursor-pointer p-1"
                                                    >
                                                        {hienXacNhanMatKhau ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                                {daChamXacNhan && loiXacNhanMatKhau && (
                                                    <p className="text-[11px] font-black text-rose-600 flex items-center gap-1.5 mt-1 bg-rose-50 p-2 rounded-lg border border-rose-300">
                                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                                        <span>{loiXacNhanMatKhau}</span>
                                                    </p>
                                                )}
                                            </div>

                                            {/* Nút Submit Rực Rỡ, Đậm Màu, Không Bị Tệp Màu */}
                                            <div className="pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={dangDoiPass || (daChamXacNhan && !!loiXacNhanMatKhau) || matKhauMoi.length < 6}
                                                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-black text-xs sm:text-sm shadow-xl shadow-indigo-500/30 border-2 border-indigo-400/60 active:scale-[0.98] transition-all cursor-pointer disabled:from-indigo-400 disabled:via-blue-400 disabled:to-purple-400 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    {dangDoiPass ? (
                                                        <>
                                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                                            <span>Đang xử lý bảo mật...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                                                            <span>{canNhapMatKhauCu ? 'Cập Nhật Mật Khẩu Mới' : 'Thiết Lập Mật Khẩu Ngay'}</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ========================================================================= */}
            {/* MODAL XEM CHI TIẾT ĐƠN HÀNG TOÀN DIỆN                                     */}
            {/* ========================================================================= */}
            {/* ========================================================================= */}
            {/* MODAL XEM CHI TIẾT ĐƠN HÀNG TOÀN DIỆN QUA PORTAL (100% HIỂN THỊ CHUẨN)   */}
            {/* ========================================================================= */}
            {daGanKetDOM && typeof document !== 'undefined' && donHangDangXemChiTiet && createPortal(
                <div
                    className="fixed inset-0 z-[999999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150"
                    onClick={() => setDonHangDangXemChiTiet(null)}
                >
                    <div
                        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-2xl border-2 border-slate-300 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-slate-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 1. Modal Header Tinh Gọn (Gọn gàng, không choán diện tích màn hình) */}
                        <div className="shrink-0 px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white border-b border-blue-800/60 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/30 text-amber-400 flex items-center justify-center shrink-0">
                                    <FileText className="w-4 h-4 text-amber-400" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap leading-tight">
                                        <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wide">Chi Tiết Đơn Hàng</span>
                                        <span className={`px-2 py-0.2 rounded-full text-[10px] font-black border ${
                                            donHangDangXemChiTiet.trang_thai === 'da_giao'
                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                                                : donHangDangXemChiTiet.trang_thai === 'dang_giao'
                                                ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                                                : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                                        }`}>
                                            {donHangDangXemChiTiet.trang_thai === 'da_giao' ? 'Giao Thành Công' : donHangDangXemChiTiet.trang_thai === 'dang_giao' ? 'Đang Vận Chuyển' : 'Đang Đóng Gói'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5 text-xs">
                                        <span className="font-mono font-black text-amber-300">#{donHangDangXemChiTiet.ma_don_hang}</span>
                                        <span className="text-white/40">•</span>
                                        <span className="text-slate-300 text-[11px] flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-amber-400" />
                                            <span>{layThoiGianDonHang(donHangDangXemChiTiet) || 'Theo hệ thống'}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDonHangDangXemChiTiet(null)}
                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                                title="Đóng"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* 2. Modal Body Cuộn Trơn Tru (Không bao giờ bị che nội dung) */}
                        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
                            {/* Thanh Thông Tin Vận Chuyển Tinh Gọn 1 Dòng */}
                            <div className="px-3 py-2 rounded-xl bg-blue-50/80 border border-blue-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0">
                                        <Truck className="w-3 h-3" />
                                    </div>
                                    <span className="font-bold text-slate-800">Viettel Post Express:</span>
                                    <span className="font-mono font-bold text-blue-700 bg-white px-1.5 py-0.2 rounded border border-blue-200 text-[11px]">
                                        {donHangDangXemChiTiet.ma_van_don || `VTP-${donHangDangXemChiTiet.ma_don_hang?.replace(/\D/g, '') || '20269108'}`}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => saoChepMaVanDon(donHangDangXemChiTiet.ma_van_don || `VTP-${donHangDangXemChiTiet.ma_don_hang?.replace(/\D/g, '') || '20269108'}`)}
                                        className="text-[10.5px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-0.5"
                                    >
                                        {daSaoChepVanDon ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                        <span>{daSaoChepVanDon ? 'Đã chép' : 'Chép'}</span>
                                    </button>
                                </div>
                                <span className="text-[11px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-300">
                                    {donHangDangXemChiTiet.trang_thai === 'da_giao' ? 'Tiến độ: 100% (Hoàn thành)' : donHangDangXemChiTiet.trang_thai === 'dang_giao' ? 'Tiến độ: 75% (Đang giao)' : 'Tiến độ: 50% (Đang đóng gói)'}
                                </span>
                            </div>

                            {/* Lưới 2 Cột: Người Nhận & Thanh Toán */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {/* Cột 1: Người nhận */}
                                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                                    <div className="font-black text-blue-800 text-[11.5px] flex items-center gap-1.5 uppercase tracking-wide">
                                        <User className="w-3.5 h-3.5 text-blue-600" />
                                        <span>Người Nhận Hàng</span>
                                    </div>
                                    <div className="space-y-1 text-slate-700">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 text-[11px]">Họ tên:</span>
                                            <strong className="text-slate-900 font-bold">
                                                {donHangDangXemChiTiet.thong_tin_giao_hang?.ho_ten || donHangDangXemChiTiet.thong_tin_giao_hang?.ho_va_ten || 'Khách Hàng TNTP'}
                                            </strong>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 text-[11px]">Điện thoại:</span>
                                            <strong className="text-slate-900 font-mono font-bold">
                                                {donHangDangXemChiTiet.thong_tin_giao_hang?.so_dien_thoai || '0988666555'}
                                            </strong>
                                        </div>
                                        <div className="flex items-start gap-1 pt-1 border-t border-slate-200 text-[11px]">
                                            <MapPin className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                                            <span className="text-slate-800 leading-snug line-clamp-2">
                                                {[
                                                    donHangDangXemChiTiet.thong_tin_giao_hang?.dia_chi_chi_tiet ||
                                                    donHangDangXemChiTiet.thong_tin_giao_hang?.dia_chi_cu_the ||
                                                    donHangDangXemChiTiet.thong_tin_giao_hang?.dia_chi,
                                                    donHangDangXemChiTiet.thong_tin_giao_hang?.phuong_xa,
                                                    donHangDangXemChiTiet.thong_tin_giao_hang?.quan_huyen,
                                                    donHangDangXemChiTiet.thong_tin_giao_hang?.tinh_thanh
                                                ].filter(Boolean).join(', ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Cột 2: Thanh toán */}
                                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                                    <div className="font-black text-indigo-800 text-[11.5px] flex items-center gap-1.5 uppercase tracking-wide">
                                        <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                                        <span>Thanh Toán & Chứng Từ</span>
                                    </div>
                                    <div className="space-y-1 text-slate-700">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 text-[11px]">Phương thức:</span>
                                            <strong className="text-slate-900 font-bold text-[11.5px]">
                                                {(donHangDangXemChiTiet.hinh_thuc_thanh_toan === 'vnpay' || donHangDangXemChiTiet.phuong_thuc_thanh_toan === 'vnpay')
                                                    ? 'Cổng VNPAY QR'
                                                    : (donHangDangXemChiTiet.hinh_thuc_thanh_toan === 'chuyen_khoan_vietqr')
                                                    ? 'Chuyển khoản VietQR'
                                                    : 'Tiền mặt (COD)'}
                                            </strong>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 text-[11px]">Trạng thái:</span>
                                            {donHangDangXemChiTiet.da_thanh_toan ? (
                                                <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10.5px] border border-emerald-300">
                                                    Đã thanh toán đủ
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold text-[10.5px] border border-amber-300">
                                                    Thu tiền khi nhận máy
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 pt-1 border-t border-slate-200 text-[10.5px] text-emerald-700 font-bold">
                                            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                                            <span>Hóa đơn điện tử VAT hợp lệ 100%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Danh Sách Sản Phẩm (Gọn gàng) */}
                            <div className="space-y-1.5">
                                <div className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                                    <span className="flex items-center gap-1.5">
                                        <PackageCheck className="w-3.5 h-3.5 text-blue-600" />
                                        <span>Sản phẩm trong đơn ({donHangDangXemChiTiet.danh_sach_san_pham?.length || 0})</span>
                                    </span>
                                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200 font-bold">
                                        Bảo hành 24-36T
                                    </span>
                                </div>
                                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                                    {donHangDangXemChiTiet.danh_sach_san_pham?.map((sp, idx) => {
                                        const duongDanSP = layDuongDanSanPham(sp);
                                        const giaTongMuc = layGiaSanPhamDonHang(sp);
                                        const donGia = layDonGiaSanPham(sp);

                                        return (
                                            <div key={idx} className="p-2 sm:p-2.5 flex items-center gap-3 text-xs hover:bg-slate-50/70 transition-colors">
                                                <Link
                                                    href={duongDanSP}
                                                    className="w-11 h-11 rounded-lg bg-white overflow-hidden shrink-0 border border-slate-200 p-0.5 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                                                    title="Bấm để xem sản phẩm"
                                                >
                                                    <img
                                                        src={layHinhAnhSanPhamDonHang(sp)}
                                                        alt=""
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = '/images/sp/lenovo_legion_pro7.jpg';
                                                        }}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </Link>
                                                <div className="flex-1 min-w-0">
                                                    <Link
                                                        href={duongDanSP}
                                                        className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-xs line-clamp-1 block cursor-pointer"
                                                        title="Bấm để xem chi tiết sản phẩm và mua lại"
                                                    >
                                                        {sp.san_pham?.ten_san_pham || sp.ten_san_pham || 'Laptop TNTP Gaming'}
                                                    </Link>
                                                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                                                        <span className="text-slate-700 font-bold">SL: {sp.so_luong || 1}</span>
                                                        {sp.tuy_chon_chon?.ten_tuy_chon && (
                                                            <span className="text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100 text-[10px]">
                                                                {sp.tuy_chon_chon?.ten_tuy_chon}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <div className="text-right">
                                                        <div className="font-black text-rose-600 text-xs sm:text-sm font-mono whitespace-nowrap">
                                                            {dinhDangTienVND(giaTongMuc)}
                                                        </div>
                                                        {(sp.so_luong || 1) > 1 && donGia > 0 && (
                                                            <div className="text-[10px] text-slate-400 font-bold whitespace-nowrap">
                                                                {dinhDangTienVND(donGia)}/máy
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => xuLyMuaLai(e, sp)}
                                                        className="p-1 sm:px-2 sm:py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                                                        title="Thêm máy này vào giỏ hàng"
                                                    >
                                                        <RotateCcw className="w-3 h-3 text-amber-600" />
                                                        <span className="hidden sm:inline">Mua lại</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Bảng Kê Chi Phí & Tổng Thanh Toán (Luôn hiện rõ, không bị che) */}
                            <div className="p-2.5 sm:p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-1">
                                <div className="flex items-center justify-between text-slate-600">
                                    <span>Tạm tính tiền hàng:</span>
                                    <span className="font-mono font-bold text-slate-800">
                                        {dinhDangTienVND(donHangDangXemChiTiet.tam_tinh || donHangDangXemChiTiet.tong_tien || 0)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-slate-600">
                                    <span>Phí giao hàng:</span>
                                    <span className="font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded text-[10.5px]">
                                        Miễn phí giao hàng hỏa tốc (0₫)
                                    </span>
                                </div>
                                {(donHangDangXemChiTiet.tien_giam_gia > 0 || donHangDangXemChiTiet.giam_gia_voucher > 0) && (
                                    <div className="flex items-center justify-between text-slate-600">
                                        <span className="flex items-center gap-1">
                                            <Ticket className="w-3 h-3 text-rose-500" />
                                            <span>Giảm giá Voucher:</span>
                                            {donHangDangXemChiTiet.ma_giam_gia && (
                                                <span className="font-mono font-black text-rose-600 bg-rose-50 px-1 py-0.2 rounded border border-rose-200 text-[10px]">
                                                    {donHangDangXemChiTiet.ma_giam_gia}
                                                </span>
                                            )}
                                        </span>
                                        <span className="font-bold text-rose-600 font-mono">
                                            -{dinhDangTienVND(donHangDangXemChiTiet.tien_giam_gia || donHangDangXemChiTiet.giam_gia_voucher || 0)}
                                        </span>
                                    </div>
                                )}
                                <div className="pt-1.5 border-t border-amber-200/90 flex items-center justify-between">
                                    <span className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                                        Tổng Tiền Thanh Toán:
                                    </span>
                                    <span className="text-base sm:text-lg font-black text-rose-600 font-mono">
                                        {dinhDangTienVND(donHangDangXemChiTiet.tong_tien_thanh_toan || donHangDangXemChiTiet.tong_tien || 0)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 3. Modal Footer Cố Định (Gọn gàng, không đè lên nội dung) */}
                        <div className="shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                            <div className="flex items-center gap-2 flex-wrap">
                                {kiemTraChuaThanhToan(donHangDangXemChiTiet) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const dh = donHangDangXemChiTiet;
                                            setDonHangDangXemChiTiet(null);
                                            setDonHangThanhToanQR(dh);
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-black transition-all cursor-pointer shadow-sm animate-pulse border border-amber-600"
                                        title="Mở mã QR KienlongBank để thanh toán ngay"
                                    >
                                        <QrCode className="w-3.5 h-3.5 shrink-0" />
                                        <span>Tiếp tục thanh toán</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                                    title="In hóa đơn"
                                >
                                    <Printer className="w-3.5 h-3.5 text-blue-600" />
                                    <span>In Hóa Đơn</span>
                                </button>
                                <Link
                                    href={`/don-hang?ma_don=${donHangDangXemChiTiet.ma_don_hang}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 hover:border-blue-400 text-blue-700 text-xs font-bold transition-all"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>Tra cứu</span>
                                </Link>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDonHangDangXemChiTiet(null)}
                                className="px-5 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 text-center"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* MODAL CHỌN AVATAR PRESET CÔNG NGHỆ QUA PORTAL */}
            {daGanKetDOM && typeof document !== 'undefined' && moModalChonAvatar && createPortal(
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in"
                    onClick={() => setMoModalChonAvatar(false)}
                >
                    <div
                        className="bg-white rounded-[28px] p-6 max-w-md w-full border-2 border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 text-slate-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
                                    <Sparkles className="w-4.5 h-4.5 text-amber-500" />
                                    <span>Chọn Ảnh Đại Diện TNTP</span>
                                </h4>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                    Bấm vào ảnh bạn thích để cập nhật ngay lập tức
                                </p>
                            </div>
                            <button
                                onClick={() => setMoModalChonAvatar(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3 pt-2">
                            {AVATAR_PRESETS.map((img, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => xuLyChonNhanhAvatar(img)}
                                    className={`relative aspect-square rounded-2xl overflow-hidden ring-2 transition-all hover:scale-105 cursor-pointer shadow-sm ${
                                        avatarChon === img ? 'ring-blue-600 scale-105 shadow-md shadow-blue-500/40' : 'ring-transparent hover:ring-slate-300'
                                    }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-slate-400">Avatar tự động đồng bộ lên tài khoản</span>
                            <button
                                type="button"
                                onClick={() => setMoModalChonAvatar(false)}
                                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* MODAL QUÉT MÃ QR TIẾP TỤC THANH TOÁN CHO ĐƠN VIETQR CHƯA THANH TOÁN */}
            {donHangThanhToanQR && (
                <ModalThanhToanQR
                    donHang={donHangThanhToanQR}
                    onThanhToanThanhCong={async () => {
                        try {
                            const donId = donHangThanhToanQR.id || donHangThanhToanQR._id || donHangThanhToanQR.ma_don_hang;
                            await DonHangService.capNhatDonHang(donId, {
                                da_thanh_toan: true,
                                trang_thai_thanh_toan: 'da_thanh_toan'
                            });
                            toast.success(`🎉 Đã xác nhận thanh toán thành công đơn #${donHangThanhToanQR.ma_don_hang}!`);
                            setDonHangThanhToanQR(null);
                            // Cập nhật lại danh sách đơn hàng
                            const tatCaMoi = await DonHangService.layTatCaDonHangAsync();
                            const laAdmin = nguoiDung?.vaiTro === 'admin' || nguoiDung?.role === 'admin' || nguoiDung?.email === 'admin@laptopnew.vn';
                            if (laAdmin) {
                                setDanhSachDonHang(tatCaMoi);
                            } else if (nguoiDung) {
                                const donCuaToi = tatCaMoi.filter((dh) => {
                                    if (dh.id_nguoi_dung && (dh.id_nguoi_dung === nguoiDung.id || dh.id_nguoi_dung === nguoiDung._id)) return true;
                                    if (nguoiDung.email && dh.thong_tin_giao_hang?.email === nguoiDung.email) return true;
                                    if (nguoiDung.soDienThoai && dh.thong_tin_giao_hang?.so_dien_thoai === nguoiDung.soDienThoai) return true;
                                    return false;
                                });
                                setDanhSachDonHang(donCuaToi);
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
