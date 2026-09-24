'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Home,
    ChevronRight,
    MapPin,
    Phone,
    Clock,
    Send,
    MessageSquare,
    CheckCircle2,
    Navigation,
    Headphones,
    ShieldCheck,
    Sparkles,
    RotateCcw,
    ExternalLink,
    LocateFixed,
    Loader2,
    Car
} from 'lucide-react';
import { toast } from 'sonner';
import { LienHeService } from '@/services/lien-he.service';
import { CaiDatService } from '@/services/cai-dat.service';

// Danh sách các chủ đề tư vấn thông dụng để khách chọn nhanh
const DANH_SACH_CHU_DE = [
    { id: 'gaming_ai', ten: 'Laptop Gaming & AI PC' },
    { id: 'tra_gop', ten: 'Báo giá Trả góp 0%' },
    { id: 'creator_oled', ten: 'Đồ Họa & Màn OLED' },
    { id: 'bao_hanh', ten: 'Bảo Hành & Kỹ Thuật' },
    { id: 'doanh_nghiep', ten: 'Khách Hàng Doanh Nghiệp' }
];

export default function TrangLienHe() {
    // 1. Quản lý danh sách showroom & tọa độ GPS động từ Admin
    const [danhSachShowroom, setDanhSachShowroom] = useState([]);
    const [showroomHienTai, setShowroomHienTai] = useState(null);

    useEffect(() => {
        // Tải danh sách showroom từ Backend hoặc LocalStorage
        CaiDatService.layDanhSachShowroomAsync().then((ds) => {
            if (Array.isArray(ds) && ds.length > 0) {
                setDanhSachShowroom(ds);
                setShowroomHienTai(ds[0]);
            }
        });

        // Lắng nghe sự kiện cập nhật showroom từ Admin
        const xuLyCapNhatShowroom = (e) => {
            if (e.detail && Array.isArray(e.detail) && e.detail.length > 0) {
                setDanhSachShowroom(e.detail);
                setShowroomHienTai((prev) => e.detail.find((s) => s.id === prev?.id) || e.detail[0]);
            }
        };

        window.addEventListener('tntp_showroom_cap_nhat', xuLyCapNhatShowroom);
        return () => window.removeEventListener('tntp_showroom_cap_nhat', xuLyCapNhatShowroom);
    }, []);

    // 2. Quản lý vị trí GPS của người dùng & chế độ chỉ đường Google Maps
    const [viTriNguoiDung, setViTriNguoiDung] = useState(null); // { vi_do, kinh_do }
    const [dangLayViTri, setDangLayViTri] = useState(false);
    const [cheDoBanDo, setCheDoBanDo] = useState('vi_tri'); // 'vi_tri' | 'chi_duong'
    const [khoangCachKm, setKhoangCachKm] = useState(null); // Khoảng cách đường bộ xe chạy thực tế
    const [khoangCachChimBay, setKhoangCachChimBay] = useState(null); // Khoảng cách đường chim bay
    const [thoiGianDiChuyenText, setThoiGianDiChuyenText] = useState('');
    const [dangTinhLoTrinh, setDangTinhLoTrinh] = useState(false);

    // Tính khoảng cách đường chim bay giữa 2 tọa độ GPS (Công thức Haversine theo km)
    const tinhKhoangCachChimBay = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Bán kính Trái Đất (km)
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1);
    };

    // Tọa độ GPS hiện tại của showroom
    const viDo = showroomHienTai?.vi_do || 10.760086;
    const kinhDo = showroomHienTai?.kinh_do || 106.663185;

    // Ước tính thời gian di chuyển thông minh theo khoảng cách km
    const tinhThoiGianUocTinh = (kmSo) => {
        const km = Number(kmSo);
        if (!km || isNaN(km)) return '';
        if (km <= 25) {
            const phut = Math.max(3, Math.round(km * 2.2));
            return `ước tính ~${phut} phút đi xe máy`;
        }
        if (km <= 80) {
            const phut = Math.round(km * 1.5);
            const gio = Math.floor(phut / 60);
            const phutLe = phut % 60;
            return `ước tính ~${gio > 0 ? `${gio}h ` : ''}${phutLe > 0 ? `${phutLe}p` : ''} đi ô tô/xe máy`;
        }
        const gioOTo = Math.round(km / 65);
        return `ước tính ~${gioOTo} giờ đi ô tô / ~2 giờ bay`;
    };

    // Tính toán lộ trình đường bộ xe lăn bánh thực tế qua routing engine OSRM (100% miễn phí & chính xác từng con đường)
    const tinhLoTrinhThucTe = async (userLat, userLng, destLat, destLng) => {
        const chimBay = tinhKhoangCachChimBay(userLat, userLng, destLat, destLng);
        setKhoangCachChimBay(chimBay);

        setDangTinhLoTrinh(true);
        try {
            const url = `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${destLng},${destLat}?overview=false`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4500);
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                    const route = data.routes[0];
                    const kmReal = (route.distance / 1000).toFixed(1);
                    const seconds = route.duration;
                    setKhoangCachKm(kmReal);

                    if (seconds < 3600) {
                        const mins = Math.max(3, Math.round(seconds / 60));
                        setThoiGianDiChuyenText(`ước tính ~${mins} phút đi xe`);
                    } else {
                        const hours = Math.floor(seconds / 3600);
                        const mins = Math.round((seconds % 3600) / 60);
                        setThoiGianDiChuyenText(`ước tính ~${hours} giờ ${mins > 0 ? `${mins} phút` : ''}`);
                    }
                    return;
                }
            }
        } catch (e) {
            console.warn('[Routing] Dùng ước tính đường bộ:', e);
        } finally {
            setDangTinhLoTrinh(false);
        }

        // Dự phòng: Nếu mạng yếu, tính đường bộ = chim bay * 1.3 (hệ số uốn cong đường bộ VN)
        const kmUocTinh = (Number(chimBay) * 1.3).toFixed(1);
        setKhoangCachKm(kmUocTinh);
        setThoiGianDiChuyenText(tinhThoiGianUocTinh(kmUocTinh));
    };

    // Tự động tính lại khoảng cách đường bộ khi đổi showroom hoặc khi có vị trí GPS
    useEffect(() => {
        if (viTriNguoiDung && viDo && kinhDo) {
            tinhLoTrinhThucTe(
                viTriNguoiDung.vi_do,
                viTriNguoiDung.kinh_do,
                viDo,
                kinhDo
            );
        }
    }, [showroomHienTai, viTriNguoiDung, viDo, kinhDo]);

    // Tìm chi nhánh gần nhất với vị trí GPS hiện tại của khách
    const showroomGanNhat = useMemo(() => {
        if (!viTriNguoiDung || !danhSachShowroom?.length) return null;
        let minKm = Infinity;
        let ganNhat = null;
        danhSachShowroom.forEach((sr) => {
            const d = Number(tinhKhoangCachChimBay(viTriNguoiDung.vi_do, viTriNguoiDung.kinh_do, sr.vi_do, sr.kinh_do));
            if (d < minKm) {
                minKm = d;
                ganNhat = { ...sr, khoangCachKm: d };
            }
        });
        return ganNhat;
    }, [viTriNguoiDung, danhSachShowroom]);

    // Rút gọn tên showroom hiển thị trên Tab nút bấm (siêu gọn gàng, không bao giờ bị cuộn ngang)
    const rutGonTenShowroomTab = (ten) => {
        if (!ten) return '';
        if (ten.includes('Tân Phú') || ten.includes('ITC')) return 'Tân Phú - ITC';
        if (ten.includes('Quận 10')) return 'Quận 10 (Trụ sở)';
        if (ten.includes('Cầu Giấy') || ten.includes('Hà Nội')) return 'Cầu Giấy, HN';
        return ten.replace(/^Showroom\s+/i, '').split('(')[0].trim();
    };

    // Xử lý bật/tắt chế độ chỉ đường từ vị trí GPS hiện tại (Chuẩn HTML5 Geolocation, miễn phí 100%)
    const xuLyChiDuongTuViTriHienTai = () => {
        if (typeof window === 'undefined' || !navigator.geolocation) {
            toast.error('Trình duyệt của bạn không hỗ trợ định vị GPS');
            return;
        }

        // Nếu đang ở chế độ chỉ đường rồi thì bấm lại để quay về xem showroom
        if (cheDoBanDo === 'chi_duong') {
            setCheDoBanDo('vi_tri');
            toast.info('Đã chuyển về chế độ xem vị trí Showroom');
            return;
        }

        // Nếu đã có tọa độ từ lần trước thì chuyển ngay lập tức
        if (viTriNguoiDung) {
            setCheDoBanDo('chi_duong');
            tinhLoTrinhThucTe(viTriNguoiDung.vi_do, viTriNguoiDung.kinh_do, viDo, kinhDo);
            toast.success('Đang vẽ lộ trình đường bộ đến Showroom');
            return;
        }

        setDangLayViTri(true);
        navigator.geolocation.getCurrentPosition(
            (viTri) => {
                const userLat = viTri.coords.latitude;
                const userLng = viTri.coords.longitude;
                setViTriNguoiDung({ vi_do: userLat, kinh_do: userLng });
                setCheDoBanDo('chi_duong');
                tinhLoTrinhThucTe(userLat, userLng, viDo, kinhDo);
                toast.success('Đã xác định vị trí của bạn và vẽ tuyến đường');
                setDangLayViTri(false);
            },
            (loi) => {
                setDangLayViTri(false);
                if (loi.code === 1) {
                    toast.error('Vui lòng cho phép quyền vị trí trên trình duyệt để vẽ đường đi');
                } else if (loi.code === 2) {
                    toast.error('Không thể xác định vị trí hiện tại. Vui lòng bật định vị GPS thiết bị');
                } else {
                    toast.error('Lỗi định vị vị trí. Vui lòng thử lại sau');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    };

    // 3. State quản lý form tư vấn
    const [hoTen, setHoTen] = useState('');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [email, setEmail] = useState('');
    const [chuDeDaChon, setChuDeDaChon] = useState(DANH_SACH_CHU_DE[0].ten);
    const [noiDung, setNoiDung] = useState('');

    const [dangGui, setDangGui] = useState(false);
    const [ketQuaGui, setKetQuaGui] = useState(null);

    // 4. Xử lý gửi yêu cầu tư vấn thật vào Backend MongoDB
    const xuLyGuiYeuCau = async (e) => {
        e.preventDefault();

        if (!hoTen.trim()) {
            toast.error('Vui lòng nhập họ và tên của bạn');
            return;
        }

        const sdtChuan = soDienThoai.trim().replace(/\s+/g, '');
        const regexSDT = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
        if (!regexSDT.test(sdtChuan)) {
            toast.error('Số điện thoại không hợp lệ (cần đủ 10 số)');
            return;
        }

        if (!noiDung.trim()) {
            toast.error('Vui lòng nhập nội dung cần tư vấn');
            return;
        }

        setDangGui(true);
        try {
            const duLieuGui = {
                ho_ten: hoTen.trim(),
                so_dien_thoai: sdtChuan,
                email: email.trim(),
                chu_de: chuDeDaChon,
                noi_dung: noiDung.trim()
            };

            const phanHoi = await LienHeService.guiYeuCauLienHeAsync(duLieuGui);

            if (phanHoi?.thanh_cong) {
                toast.success('TNTP LAPTOP đã tiếp nhận thông tin!');
                setKetQuaGui(phanHoi.du_lieu || {
                    ma_yeu_cau: `LH-${Date.now().toString().slice(-6)}`,
                    ho_ten: hoTen,
                    so_dien_thoai: sdtChuan,
                    chu_de: chuDeDaChon,
                    ngay_tao: new Date().toISOString()
                });

                setHoTen('');
                setSoDienThoai('');
                setEmail('');
                setNoiDung('');
            } else {
                toast.error(phanHoi?.thong_diep || 'Không thể gửi yêu cầu');
            }
        } catch (loi) {
            toast.error('Đã xảy ra sự cố kết nối. Vui lòng gọi Hotline 1900.8946');
        } finally {
            setDangGui(false);
        }
    };

    // Đường dẫn bản đồ Google Maps: Nếu đang bật chỉ đường thì vẽ lộ trình từ saddr đến daddr
    const dangChiDuong = cheDoBanDo === 'chi_duong' && viTriNguoiDung;
    const urlGoogleMapsNhung = dangChiDuong
        ? `https://maps.google.com/maps?saddr=${viTriNguoiDung.vi_do},${viTriNguoiDung.kinh_do}&daddr=${viDo},${kinhDo}&hl=vi&output=embed`
        : `https://maps.google.com/maps?q=${viDo},${kinhDo}&hl=vi&z=16&output=embed`;

    const urlChiDuongTrucTiep = dangChiDuong
        ? `https://www.google.com/maps/dir/?api=1&origin=${viTriNguoiDung.vi_do},${viTriNguoiDung.kinh_do}&destination=${viDo},${kinhDo}`
        : `https://www.google.com/maps/dir/?api=1&destination=${viDo},${kinhDo}`;

    return (
        <div className="space-y-4 max-w-7xl mx-auto pb-6">
            {/* 1. Breadcrumb tinh gọn */}
            <nav className="flex items-center gap-2 text-xs text-slate-500">
                <Link href="/" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
                    <Home className="w-3.5 h-3.5" />
                    <span>Trang Chủ</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-800">Liên Hệ & Showroom TNTP</span>
            </nav>

            {/* 2. Banner Nhỏ Gọn & Thanh Lịch (Không chiếm quá nhiều diện tích) */}
            <div className="bg-gradient-to-r from-[#0052cc] via-blue-700 to-indigo-800 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-black uppercase tracking-wider text-amber-300">
                            TNTP LAPTOP OFFICIAL
                        </span>
                        <span className="text-xs text-blue-200">Trí • Nhất • Tài • Phú</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
                        LIÊN HỆ & TRẢI NGHIỆM SHOWROOM
                    </h1>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-start sm:self-center bg-white/10 px-3.5 py-2 rounded-xl border border-white/20">
                    <Headphones className="w-4 h-4 text-amber-400" />
                    <div>
                        <div className="text-[10px] text-blue-200 font-bold uppercase">Tổng đài tư vấn miễn phí</div>
                        <a href="tel:19008946" className="font-mono font-black text-lg text-white hover:text-amber-300 transition-colors">
                            1900.8946
                        </a>
                    </div>
                </div>
            </div>

            {/* 3. Bố Cục Chính 2 Cột Cân Đối: Cột Trái (Bản Đồ & Showroom) - Cột Phải (Form Tư Vấn) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* CỘT TRÁI (7 CỘT): TÍCH HỢP BẢN ĐỒ GOOGLE MAPS & CHỌN CỬA HÀNG GỌN GÀNG */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-300 shadow-sm space-y-3.5">
                    {/* Header Cột Trái & Tabs chọn Showroom */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-xs font-black text-blue-700 uppercase tracking-wide">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                <span>Vị Trí Showroom & Bản Đồ Trực Quan</span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium">Bấm chọn chi nhánh</span>
                        </div>

                        {/* Thanh Tab chọn Showroom siêu gọn, dàn đều 3 cột, 100% KHÔNG CUỘN NGANG */}
                        <div className="grid grid-cols-3 gap-2">
                            {danhSachShowroom.map((sr) => {
                                const dangChon = showroomHienTai?.id === sr.id;
                                const tenNgan = rutGonTenShowroomTab(sr.ten);
                                return (
                                    <button
                                        key={sr.id}
                                        type="button"
                                        onClick={() => setShowroomHienTai(sr)}
                                        className={`py-2 px-1.5 sm:px-2.5 rounded-xl font-black text-[11px] sm:text-xs transition-all cursor-pointer text-center active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5 border-2 ${
                                            dangChon
                                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                                        }`}
                                        title={sr.ten}
                                    >
                                        <MapPin className={`w-3.5 h-3.5 shrink-0 ${dangChon ? 'text-white' : 'text-blue-600'}`} />
                                        <span className="truncate">{tenNgan}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Khung Thông Tin Tinh Gọn Của Showroom Đang Chọn (Ít chữ, đúng trọng tâm) */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                        <div className="space-y-1 min-w-0">
                            <div className="font-black text-slate-900 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-600" />
                                <span className="truncate">{showroomHienTai?.ten}</span>
                            </div>
                            <p className="text-slate-600 truncate font-medium">
                                📍 {showroomHienTai?.dia_chi}
                            </p>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500">
                                <span>🕒 {showroomHienTai?.gio_mo_cua || '08:30 - 21:30'}</span>
                                <span className="font-mono text-slate-400">GPS: {Number(viDo).toFixed(4)}, {Number(kinhDo).toFixed(4)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                            <a
                                href={`tel:${showroomHienTai?.hotline_di_dong || showroomHienTai?.hotline || '19008946'}`}
                                className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-black text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                            >
                                <Phone className="w-3.5 h-3.5 text-red-600" />
                                <span>Gọi {showroomHienTai?.hotline_di_dong || 'Hotline'}</span>
                            </a>
                        </div>
                    </div>

                    {/* Thanh Điều Khiển Bản Đồ & Chỉ Đường GPS Thông Minh */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={xuLyChiDuongTuViTriHienTai}
                                disabled={dangLayViTri}
                                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 border ${
                                    dangChiDuong
                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-blue-700'
                                }`}
                                title="Chỉ đường từ vị trí GPS hiện tại của bạn"
                            >
                                {dangLayViTri ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Đang lấy GPS...</span>
                                    </>
                                ) : dangChiDuong ? (
                                    <>
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Đang chỉ đường ({khoangCachKm} km) • Bấm để tắt</span>
                                    </>
                                ) : (
                                    <>
                                        <LocateFixed className="w-3.5 h-3.5" />
                                        <span>🧭 Chỉ đường từ vị trí của tôi</span>
                                    </>
                                )}
                            </button>

                            {dangChiDuong && (
                                <button
                                    type="button"
                                    onClick={() => setCheDoBanDo('vi_tri')}
                                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer border border-slate-200"
                                    title="Quay lại vị trí cửa hàng"
                                >
                                    Xem Showroom
                                </button>
                            )}
                        </div>

                        {/* Link mở app Google Maps trực tiếp */}
                        <a
                            href={urlChiDuongTrucTiep}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-blue-700 text-xs font-bold transition-colors flex items-center gap-1 border border-slate-200 hover:border-blue-300"
                            title="Mở trên ứng dụng Google Maps"
                        >
                            <Navigation className="w-3.5 h-3.5 text-blue-600" />
                            <span>Mở app chỉ đường</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                    </div>

                    {/* Dải thông tin khoảng cách & thời gian di chuyển nếu đang chỉ đường */}
                    {dangChiDuong && (
                        <div className="space-y-1.5 animate-in fade-in">
                            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                                <div className="flex items-center gap-1.5 font-bold">
                                    <Car className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>
                                        Đường bộ xe chạy: ~<b className="font-black text-emerald-700 text-sm">{khoangCachKm || '...'} km</b> ({thoiGianDiChuyenText || tinhThoiGianUocTinh(khoangCachKm)})
                                    </span>
                                </div>
                                {khoangCachChimBay && (
                                    <span className="text-[11px] text-emerald-700 font-medium shrink-0">
                                        (Đường chim bay: ~{khoangCachChimBay} km)
                                    </span>
                                )}
                            </div>

                            {/* Gợi ý chi nhánh gần nhất nếu đang xem chi nhánh liên tỉnh quá xa */}
                            {showroomGanNhat && showroomGanNhat.id !== showroomHienTai?.id && Number(khoangCachKm) > 40 && (
                                <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between gap-2">
                                    <span className="font-medium truncate">
                                        💡 Chi nhánh gần bạn nhất: <b className="font-black">{showroomGanNhat.ten}</b> (~{showroomGanNhat.khoangCachKm} km)
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setShowroomHienTai(danhSachShowroom.find(s => s.id === showroomGanNhat.id) || showroomGanNhat)}
                                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] shrink-0 transition-colors cursor-pointer"
                                    >
                                        Chuyển sang chi nhánh này
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* KHUNG BẢN ĐỒ GOOGLE MAPS TÍCH HỢP TRỰC TIẾP VÀO TRANG */}
                    <div className="relative w-full h-[320px] sm:h-[360px] rounded-2xl overflow-hidden border-2 border-slate-300 shadow-inner bg-slate-100">
                        <iframe
                            key={urlGoogleMapsNhung}
                            title={`Bản đồ ${dangChiDuong ? 'chỉ đường' : 'định vị'} ${showroomHienTai?.ten}`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={urlGoogleMapsNhung}
                            className="w-full h-full"
                        />
                    </div>
                </div>

                {/* CỘT PHẢI (5 CỘT): FORM GỬI YÊU CẦU TƯ VẤN (THẬT 100% VÀO MONGODB) */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-6 border-2 border-slate-300 shadow-sm space-y-4">
                    {ketQuaGui ? (
                        /* Màn hình tiếp nhận thành công */
                        <div className="space-y-3.5 py-3 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
                                <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-base font-black text-slate-900">
                                    TIẾP NHẬN YÊU CẦU THÀNH CÔNG!
                                </h3>
                                <p className="text-xs text-slate-600">
                                    Hệ thống TNTP đã lưu phiếu tư vấn của bạn vào cơ sở dữ liệu.
                                </p>
                            </div>

                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-left space-y-1.5 text-xs">
                                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                                    <span className="text-slate-500 font-medium">Mã phiếu tư vấn:</span>
                                    <span className="font-mono font-black text-blue-700 text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                        #{ketQuaGui.ma_yeu_cau}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 font-medium">Khách hàng:</span>
                                    <strong className="text-slate-900 font-black">{ketQuaGui.ho_ten}</strong>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 font-medium">Số điện thoại:</span>
                                    <span className="font-mono font-bold text-slate-900">{ketQuaGui.so_dien_thoai}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 font-medium">Chủ đề:</span>
                                    <span className="text-amber-700 font-bold">{ketQuaGui.chu_de}</span>
                                </div>
                            </div>

                            <p className="text-[11.5px] text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-left font-medium leading-relaxed">
                                📞 Chuyên viên tư vấn TNTP sẽ gọi lại vào số <strong>{ketQuaGui.so_dien_thoai}</strong> trong 10 - 15 phút để báo giá và giải đáp chi tiết.
                            </p>

                            <div className="flex items-center gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setKetQuaGui(null)}
                                    className="flex-1 py-2 rounded-xl border-2 border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Gửi thêm yêu cầu</span>
                                </button>
                                <a
                                    href="tel:19008946"
                                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/25 active:scale-95"
                                >
                                    <Phone className="w-3.5 h-3.5" />
                                    <span>Gọi 1900.8946</span>
                                </a>
                            </div>
                        </div>
                    ) : (
                        /* Form tư vấn nhập liệu tinh gọn */
                        <>
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-xs font-black text-blue-600 uppercase tracking-wide">
                                    <MessageSquare className="w-4 h-4" />
                                    <span>GỬI YÊU CẦU TƯ VẤN NHANH</span>
                                </div>
                                <h3 className="text-base font-black text-slate-900">
                                    Nhận Báo Giá Ưu Đãi & Quà Tặng
                                </h3>
                            </div>

                            {/* Chọn nhanh chủ đề quan tâm */}
                            <div className="space-y-1.5">
                                <label className="text-[11.5px] font-bold text-slate-700 block">
                                    Chủ đề bạn quan tâm:
                                </label>
                                <div className="flex flex-wrap gap-1">
                                    {DANH_SACH_CHU_DE.map((cd) => {
                                        const dangChon = chuDeDaChon === cd.ten;
                                        return (
                                            <button
                                                key={cd.id}
                                                type="button"
                                                onClick={() => setChuDeDaChon(cd.ten)}
                                                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer select-none active:scale-95 border ${
                                                    dangChon
                                                        ? 'bg-blue-600 text-white border-blue-700 shadow-2xs font-black'
                                                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-white'
                                                }`}
                                            >
                                                {cd.ten}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Các trường nhập liệu */}
                            <form onSubmit={xuLyGuiYeuCau} className="space-y-3 text-xs">
                                <div>
                                    <label className="font-bold text-slate-800 block mb-1">
                                        Họ và tên của bạn <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={hoTen}
                                        onChange={(e) => setHoTen(e.target.value)}
                                        placeholder="Ví dụ: Lê Minh Trí"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="font-bold text-slate-800 block mb-1">
                                        Số điện thoại liên hệ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={soDienThoai}
                                        onChange={(e) => setSoDienThoai(e.target.value)}
                                        placeholder="Ví dụ: 0948.37.79.79"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono"
                                    />
                                </div>

                                <div>
                                    <label className="font-bold text-slate-800 block mb-1">
                                        Nội dung yêu cầu tư vấn <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={noiDung}
                                        onChange={(e) => setNoiDung(e.target.value)}
                                        placeholder="Ví dụ: Tôi cần tư vấn laptop gaming tầm 25 - 30 triệu..."
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={dangGui}
                                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/25 cursor-pointer transition-all active:scale-95 disabled:opacity-60"
                                >
                                    {dangGui ? (
                                        <>
                                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>ĐANG GỬI VÀO HỆ THỐNG...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-3.5 h-3.5" />
                                            <span>GỬI YÊU CẦU TƯ VẤN NGAY</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
