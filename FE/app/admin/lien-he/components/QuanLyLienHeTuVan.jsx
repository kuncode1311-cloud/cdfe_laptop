'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    Headphones,
    Zap,
    Search,
    Filter,
    RotateCcw,
    Phone,
    Mail,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    Trash2,
    MessageSquare,
    Copy,
    Check,
    ExternalLink,
    Send,
    Edit3,
    X,
    Loader2,
    Sparkles,
    UserCheck,
    UserX,
    FileText,
    ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import { LienHeService } from '@/services/lien-he.service';
import PhanTrangAdmin, { usePhanTrang } from '@/app/admin/components/shared/PhanTrangAdmin';

const DANH_SACH_TRANG_THAI = [
    { id: 'tat_ca', ten: 'Tất Cả Phiếu', mauText: 'text-slate-700 dark:text-slate-300', mauBg: 'bg-slate-100 dark:bg-slate-800' },
    { id: 'chua_xu_ly', ten: 'Chưa Tư Vấn', mauText: 'text-amber-700 dark:text-amber-300', mauBg: 'bg-amber-100/80 dark:bg-amber-950/60', mauBorder: 'border-amber-300' },
    { id: 'dang_xu_ly', ten: 'Đang Liên Hệ', mauText: 'text-blue-700 dark:text-blue-300', mauBg: 'bg-blue-100/80 dark:bg-blue-950/60', mauBorder: 'border-blue-300' },
    { id: 'da_hoan_thanh', ten: 'Đã Hoàn Tất', mauText: 'text-emerald-700 dark:text-emerald-300', mauBg: 'bg-emerald-100/80 dark:bg-emerald-950/60', mauBorder: 'border-emerald-300' },
    { id: 'da_huy', ten: 'Đã Hủy / Sai Số', mauText: 'text-rose-700 dark:text-rose-300', mauBg: 'bg-rose-100/80 dark:bg-rose-950/60', mauBorder: 'border-rose-300' }
];

// Hàm phát chuông thông báo Realtime tinh tế khi có khách gửi yêu cầu tư vấn mới
const phatAmThanhThongBao = () => {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
    } catch (e) {
        // Trình duyệt hạn chế autoplay âm thanh trước khi có click
    }
};

export default function QuanLyLienHeTuVan({ onCapNhatSoLuongChuaXuLy, xacNhan }) {
    const [danhSach, setDanhSach] = useState([]);
    const [thongKe, setThongKe] = useState({
        tong_so: 0,
        chua_xu_ly: 0,
        dang_xu_ly: 0,
        da_hoan_thanh: 0
    });
    const [dangTai, setDangTai] = useState(true);
    const [tuKhoa, setTuKhoa] = useState('');
    const [locTrangThai, setLocTrangThai] = useState('tat_ca');
    const [locChuDe, setLocChuDe] = useState('tat_ca');
    const [locTuNgay, setLocTuNgay] = useState('');
    const [locDenNgay, setLocDenNgay] = useState('');
    const [locThoiGian, setLocThoiGian] = useState('tat_ca');

    // Real-time State
    const [tuDongDongBo, setTuDongDongBo] = useState(true);
    const [thoiGianDongBoCuoi, setThoiGianDongBoCuoi] = useState('');
    const [maPhieuMoiNhan, setMaPhieuMoiNhan] = useState(null);

    // Quản lý Modal Xem Chi Tiết & Ghi Chú CSKH
    const [phieuDangXem, setPhieuDangXem] = useState(null);
    const [phieuDangPhanHoi, setPhieuDangPhanHoi] = useState(null);
    const [ghiChuTam, setGhiChuTam] = useState('');
    const [trangThaiTam, setTrangThaiTam] = useState('');
    const [dangLuuGhiChu, setDangLuuGhiChu] = useState(false);
    const [daCopyMa, setDaCopyMa] = useState('');
    const [noiDungPhanHoi, setNoiDungPhanHoi] = useState('');
    const [dangGuiPhanHoi, setDangGuiPhanHoi] = useState(false);

    const danhSachSauLocNgay = useMemo(() => {
        const fmt = (x) => x.toISOString().slice(0, 10);
        let tuNgayStr = locTuNgay;
        let denNgayStr = locDenNgay;

        // Tính range từ preset nhanh
        if (locThoiGian !== 'tat_ca') {
            const now = new Date();
            if (locThoiGian === 'hom_nay') {
                tuNgayStr = fmt(now); denNgayStr = fmt(now);
            } else if (locThoiGian === 'hom_qua') {
                const hq = new Date(now); hq.setDate(now.getDate() - 1);
                tuNgayStr = fmt(hq); denNgayStr = fmt(hq);
            } else if (locThoiGian === '7_ngay') {
                const tu = new Date(now); tu.setDate(now.getDate() - 6);
                tuNgayStr = fmt(tu); denNgayStr = fmt(now);
            } else if (locThoiGian === 'tuan_nay') {
                const thu = now.getDay() === 0 ? 6 : now.getDay() - 1;
                const tu = new Date(now); tu.setDate(now.getDate() - thu);
                const den = new Date(tu); den.setDate(tu.getDate() + 6);
                tuNgayStr = fmt(tu); denNgayStr = fmt(den);
            } else if (locThoiGian === 'thang_nay') {
                const tu = new Date(now.getFullYear(), now.getMonth(), 1);
                const den = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                tuNgayStr = fmt(tu); denNgayStr = fmt(den);
            }
        }

        if (!tuNgayStr && !denNgayStr) return danhSach;
        const tuNgay = tuNgayStr ? new Date(tuNgayStr + 'T00:00:00') : null;
        const denNgay = denNgayStr ? new Date(denNgayStr + 'T23:59:59') : null;
        return danhSach.filter((phieu) => {
            const ngay = new Date(phieu.ngay_tao || phieu.createdAt);
            if (isNaN(ngay)) return true;
            if (tuNgay && ngay < tuNgay) return false;
            if (denNgay && ngay > denNgay) return false;
            return true;
        });
    }, [danhSach, locTuNgay, locDenNgay, locThoiGian]);

    const {
        trangHienTai,
        setTrangHienTai,
        soMucMoiTrang,
        setSoMucMoiTrang,
        tongSoTrang,
        tongSoMuc,
        danhSachTrenTrang
    } = usePhanTrang(danhSachSauLocNgay, 10, [
        locTrangThai,
        locChuDe,
        tuKhoa,
        locTuNgay,
        locDenNgay,
        locThoiGian
    ]);

    // Tải dữ liệu từ Backend
    const taiDuLieu = async (hienThiLoading = true) => {
        if (hienThiLoading) setDangTai(true);
        try {
            const res = await LienHeService.layDanhSachLienHeAsync({
                trang: 1,
                gioi_han: 100,
                trang_thai: locTrangThai !== 'tat_ca' ? locTrangThai : undefined,
                chu_de: locChuDe !== 'tat_ca' ? locChuDe : undefined,
                tu_khoa: tuKhoa.trim() || undefined
            });

            if (res?.thanh_cong) {
                setDanhSach(res.du_lieu || []);
                if (res.thong_ke) {
                    setThongKe(res.thong_ke);
                    if (typeof onCapNhatSoLuongChuaXuLy === 'function') {
                        onCapNhatSoLuongChuaXuLy(res.thong_ke.chua_xu_ly || 0);
                    }
                }
                const now = new Date();
                setThoiGianDongBoCuoi(now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            } else {
                setDanhSach([]);
            }
        } catch (e) {
            console.error('[QuanLyLienHeTuVan] Lỗi tải phiếu tư vấn:', e);
            if (hienThiLoading) {
                toast.error('Không thể kết nối đến máy chủ lấy danh sách liên hệ');
            }
        } finally {
            if (hienThiLoading) setDangTai(false);
        }
    };

    // Tải lần đầu và khi đổi bộ lọc tìm kiếm
    useEffect(() => {
        const timer = setTimeout(() => {
            taiDuLieu(true);
        }, 250);
        return () => clearTimeout(timer);
    }, [locTrangThai, locChuDe, tuKhoa]);

    // Lắng nghe sự kiện Realtime & Auto-polling ngầm
    useEffect(() => {
        // 1. Đăng ký lắng nghe sự kiện tức thời (BroadcastChannel & LocalStorage event)
        const huyLangNghe = LienHeService.langNgheRealtime((suKien) => {
            if (suKien?.loai === 'YEU_CAU_MOI') {
                phatAmThanhThongBao();
                const khach = suKien.du_lieu;
                toast.info('⚡ Có yêu cầu tư vấn mới từ khách hàng!', {
                    description: `${khach?.ho_ten || 'Khách'} (${khach?.so_dien_thoai || ''}) - ${khach?.chu_de || 'Tư vấn Laptop'}`,
                    duration: 7000
                });
                if (khach?.ma_yeu_cau) {
                    setMaPhieuMoiNhan(khach.ma_yeu_cau);
                    setTimeout(() => setMaPhieuMoiNhan(null), 10000);
                }
            }
            // Tự động tải lại ngầm tức thì mà không giật màn hình
            taiDuLieu(false);
        });

        // 2. Polling chu kỳ ngầm mỗi 5 giây phòng trường hợp khách gửi từ thiết bị/máy khác
        let intervalId = null;
        if (tuDongDongBo) {
            intervalId = setInterval(() => {
                taiDuLieu(false);
            }, 5000);
        }

        return () => {
            huyLangNghe();
            if (intervalId) clearInterval(intervalId);
        };
    }, [tuDongDongBo, locTrangThai, locChuDe, tuKhoa]);

    // Xử lý đổi trạng thái nhanh trực tiếp trên bảng
    const xuLyDoiTrangThaiNhanh = async (id, trangThaiMoi) => {
        try {
            await LienHeService.capNhatLienHeAsync(id, { trang_thai: trangThaiMoi });
            setDanhSach(prev => prev.map(item => (item._id === id || item.id === id) ? { ...item, trang_thai: trangThaiMoi } : item));
            toast.success('Đã cập nhật trạng thái phiếu tư vấn!');
            LienHeService.phatTinHieuRealtime('CAP_NHAT_TRANG_THAI', { id, trang_thai: trangThaiMoi });
            taiDuLieu(false);
        } catch (e) {
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    // Xử lý Xóa phiếu
    const xuLyXoaPhieu = async (id, maPhieu) => {
        const dongY = await xacNhan({
            tieuDe: 'Xóa Phiếu Yêu Cầu',
            noiDung: `Bạn có chắc chắn muốn xóa phiếu yêu cầu #${maPhieu}?`
        });
        if (!dongY) return;
        try {
            await LienHeService.xoaLienHeAsync(id);
            setDanhSach(prev => prev.filter(item => item._id !== id && item.id !== id));
            toast.success(`Đã xóa phiếu #${maPhieu}`);
            LienHeService.phatTinHieuRealtime('XOA_PHIEU', { id, ma_yeu_cau: maPhieu });
            taiDuLieu(false);
        } catch (e) {
            toast.error('Không thể xóa phiếu');
        }
    };

    // Mở modal chi tiết
    const moModalChiTiet = (phieu) => {
        setPhieuDangXem(phieu);
        setGhiChuTam(phieu.ghi_chu_noi_bo || '');
        setTrangThaiTam(phieu.trang_thai || 'chua_xu_ly');
    };

    const moModalPhanHoi = (phieu) => {
        if (!phieu.email) {
            toast.error('Phiếu này chưa có email khách hàng');
            return;
        }
        setPhieuDangPhanHoi(phieu);
        setNoiDungPhanHoi('');
    };

    const xuLyGuiPhanHoi = async () => {
        if (!phieuDangPhanHoi?.email) {
            toast.error('Phiếu này chưa có email khách hàng');
            return;
        }
        if (!noiDungPhanHoi.trim()) {
            toast.error('Vui lòng nhập nội dung phản hồi');
            return;
        }
        setDangGuiPhanHoi(true);
        try {
            const phieuId = phieuDangPhanHoi._id || phieuDangPhanHoi.id;
            const res = await LienHeService.guiPhanHoiLienHeAsync(phieuId, noiDungPhanHoi.trim());
            if (!res?.thanh_cong) throw new Error(res?.thong_diep);
            toast.success(res.thong_diep || 'Đã gửi phản hồi qua email');
            setDanhSach(prev => prev.map(item => (item._id === phieuId || item.id === phieuId)
                ? { ...item, trang_thai: 'da_hoan_thanh' }
                : item));
            setNoiDungPhanHoi('');
            setPhieuDangPhanHoi(null);
            LienHeService.phatTinHieuRealtime('GUI_PHAN_HOI', { id: phieuId, trang_thai: 'da_hoan_thanh' });
            taiDuLieu(false);
        } catch (e) {
            toast.error(e.message || 'Không thể gửi email phản hồi');
        } finally {
            setDangGuiPhanHoi(false);
        }
    };

    // Lưu ghi chú & trạng thái từ Modal
    const xuLyLuuModal = async () => {
        if (!phieuDangXem) return;
        setDangLuuGhiChu(true);
        const phieuId = phieuDangXem._id || phieuDangXem.id;
        try {
            const res = await LienHeService.capNhatLienHeAsync(phieuId, {
                trang_thai: trangThaiTam,
                ghi_chu_noi_bo: ghiChuTam
            });
            if (res?.thanh_cong) {
                setDanhSach(prev => prev.map(item => (item._id === phieuId || item.id === phieuId) ? { ...item, trang_thai: trangThaiTam, ghi_chu_noi_bo: ghiChuTam } : item));
                toast.success('Đã lưu thông tin ghi chú CSKH thành công!');
                setPhieuDangXem(null);
                LienHeService.phatTinHieuRealtime('CAP_NHAT_GHI_CHU', { id: phieuId, trang_thai: trangThaiTam });
                taiDuLieu(false);
            }
        } catch (e) {
            toast.error('Lỗi khi lưu thông tin');
        } finally {
            setDangLuuGhiChu(false);
        }
    };

    // Copy mã phiếu
    const xuLyCopyMa = (ma) => {
        navigator.clipboard.writeText(ma);
        setDaCopyMa(ma);
        toast.success(`Đã sao chép mã phiếu: ${ma}`);
        setTimeout(() => setDaCopyMa(''), 2500);
    };

    // Helper format thời gian
    const dinhDangNgay = (isoString) => {
        if (!isoString) return '--:--';
        try {
            const d = new Date(isoString);
            return d.toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (e) {
            return isoString;
        }
    };

    // Style badge theo trạng thái (Glowing Capsule Pills chuẩn hiện đại)
    const renderBadgeTrangThai = (trangThai) => {
        switch (trangThai) {
            case 'chua_xu_ly':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-md shadow-orange-500/25 whitespace-nowrap">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                        Chưa Tư Vấn
                    </span>
                );
            case 'dang_xu_ly':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25 whitespace-nowrap">
                        <Clock className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                        Đang Liên Hệ
                    </span>
                );
            case 'da_hoan_thanh':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white shadow-md shadow-emerald-500/25 whitespace-nowrap">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                        Đã Hoàn Tất
                    </span>
                );
            case 'da_huy':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/25 whitespace-nowrap">
                        <UserX className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                        Đã Hủy / Sai Số
                    </span>
                );
            default:
                return <span className="text-xs text-slate-500 font-bold whitespace-nowrap">{trangThai}</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* 1. Header & Thống Kê Nhanh (4 KPI Cards Gradient 3D Glow Theo Chuẩn Thiết Kế Hiện Đại) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {/* Thẻ 1: Tổng số phiếu (Tone Tím / Lam Violet Hiện Đại) */}
                <div
                    onClick={() => setLocTrangThai('tat_ca')}
                    className={`p-5 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-white dark:from-[#0d1527] dark:via-purple-950/20 dark:to-[#0a0f1d] border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 ${
                        locTrangThai === 'tat_ca'
                            ? 'border-indigo-500 ring-4 ring-indigo-500/15 shadow-xl shadow-indigo-500/15'
                            : 'border-indigo-100 dark:border-indigo-900/50 shadow-md shadow-indigo-500/5 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/15'
                    }`}
                >
                    {/* Watermark mờ chìm nghệ thuật tạo chiều sâu */}
                    <Headphones className="absolute -right-3 -bottom-3 w-28 h-28 text-indigo-500/10 dark:text-purple-400/5 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" />

                    <div className="flex items-center justify-between relative z-10">
                        {/* 3D Floating Icon Box với Gradient & Đổ Bóng Glow */}
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/35 ring-4 ring-white/80 dark:ring-purple-900/40 group-hover:scale-110 transition-transform duration-300">
                            <Headphones className="w-6 h-6 stroke-[2.2]" />
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                Hệ Thống
                            </span>
                            <div className="w-7 h-7 rounded-full bg-indigo-100/80 text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-300 flex items-center justify-center text-xs font-black group-hover:translate-x-0.5 transition-transform">
                                →
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 relative z-10">
                        <div className="text-xs font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                            Tổng Phiếu Yêu Cầu
                        </div>
                        <div className="text-3xl sm:text-4xl font-black font-mono text-indigo-950 dark:text-white mt-1 tracking-tight">
                            {thongKe.tong_so}
                        </div>
                        <div className="text-[11px] font-bold text-indigo-600/80 dark:text-indigo-400 mt-1 flex items-center gap-1">
                            <span>Từ trang Liên Hệ & Hỗ Trợ Web</span>
                        </div>
                    </div>
                </div>

                {/* Thẻ 2: Chưa tư vấn (Tone Cam / Hổ Phách Nổi Bật - Cần Xử Lý Gấp) */}
                <div
                    onClick={() => setLocTrangThai('chua_xu_ly')}
                    className={`p-5 rounded-3xl bg-gradient-to-br from-amber-50/95 via-orange-50/60 to-rose-50/40 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-[#0d1527] border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 ${
                        locTrangThai === 'chua_xu_ly'
                            ? 'border-orange-500 ring-4 ring-orange-500/15 shadow-xl shadow-orange-500/20'
                            : 'border-amber-300 dark:border-amber-700/80 shadow-md shadow-orange-500/10 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-500/20'
                    }`}
                >
                    <Zap className="absolute -right-3 -bottom-3 w-28 h-28 text-amber-500/10 dark:text-amber-400/5 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" />

                    <div className="flex items-center justify-between relative z-10">
                        {/* 3D Floating Icon Box Tone Cam Đỏ */}
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/40 ring-4 ring-white/80 dark:ring-amber-900/40 group-hover:scale-110 transition-transform duration-300">
                            <Zap className="w-6 h-6 stroke-[2.2] fill-amber-200" />
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-500 text-white animate-pulse shadow-sm shadow-red-500/30">
                                Cần Gọi Ngay
                            </span>
                            <div className="w-7 h-7 rounded-full bg-orange-100/90 text-orange-600 dark:bg-orange-900/60 dark:text-orange-300 flex items-center justify-center text-xs font-black group-hover:translate-x-0.5 transition-transform">
                                →
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 relative z-10">
                        <div className="text-xs font-black text-amber-950 dark:text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                            Chưa Tư Vấn
                        </div>
                        <div className="text-3xl sm:text-4xl font-black font-mono text-orange-950 dark:text-amber-100 mt-1 tracking-tight">
                            {thongKe.chua_xu_ly}
                        </div>
                        <div className="text-[11px] font-black text-amber-700 dark:text-amber-400 mt-1 flex items-center gap-1">
                            <span>Khách đang chờ điện thoại tư vấn</span>
                        </div>
                    </div>
                </div>

                {/* Thẻ 3: Đang liên hệ / chăm sóc (Tone Xanh Dương Sky Blue) */}
                <div
                    onClick={() => setLocTrangThai('dang_xu_ly')}
                    className={`p-5 rounded-3xl bg-gradient-to-br from-sky-50/95 via-blue-50/50 to-indigo-50/30 dark:from-[#0a1526] dark:via-sky-950/30 dark:to-[#0b1120] border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 ${
                        locTrangThai === 'dang_xu_ly'
                            ? 'border-blue-500 ring-4 ring-blue-500/15 shadow-xl shadow-blue-500/15'
                            : 'border-sky-200 dark:border-sky-800/60 shadow-md shadow-sky-500/5 hover:border-sky-400 hover:shadow-xl hover:shadow-sky-500/15'
                    }`}
                >
                    <Clock className="absolute -right-3 -bottom-3 w-28 h-28 text-sky-500/10 dark:text-sky-400/5 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" />

                    <div className="flex items-center justify-between relative z-10">
                        {/* 3D Floating Icon Box Tone Xanh Dương */}
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/35 ring-4 ring-white/80 dark:ring-sky-900/40 group-hover:scale-110 transition-transform duration-300">
                            <Clock className="w-6 h-6 stroke-[2.2]" />
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                                Đang Chăm Sóc
                            </span>
                            <div className="w-7 h-7 rounded-full bg-sky-100/80 text-sky-600 dark:bg-sky-900/60 dark:text-sky-300 flex items-center justify-center text-xs font-black group-hover:translate-x-0.5 transition-transform">
                                →
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 relative z-10">
                        <div className="text-xs font-black text-sky-900 dark:text-sky-200 uppercase tracking-wider">
                            Đang Chăm Sóc
                        </div>
                        <div className="text-3xl sm:text-4xl font-black font-mono text-sky-950 dark:text-sky-100 mt-1 tracking-tight">
                            {thongKe.dang_xu_ly}
                        </div>
                        <div className="text-[11px] font-bold text-sky-700 dark:text-sky-400 mt-1 flex items-center gap-1">
                            <span>Đang gọi điện / Báo giá Zalo</span>
                        </div>
                    </div>
                </div>

                {/* Thẻ 4: Đã chốt xong (Tone Xanh Lá Emerald Tươi Sáng) */}
                <div
                    onClick={() => setLocTrangThai('da_hoan_thanh')}
                    className={`p-5 rounded-3xl bg-gradient-to-br from-emerald-50/95 via-teal-50/50 to-green-50/30 dark:from-[#061c16] dark:via-emerald-950/30 dark:to-[#0b1120] border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 ${
                        locTrangThai === 'da_hoan_thanh'
                            ? 'border-emerald-500 ring-4 ring-emerald-500/15 shadow-xl shadow-emerald-500/15'
                            : 'border-emerald-200 dark:border-emerald-800/60 shadow-md shadow-emerald-500/5 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/15'
                    }`}
                >
                    <CheckCircle2 className="absolute -right-3 -bottom-3 w-28 h-28 text-emerald-500/10 dark:text-emerald-400/5 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" />

                    <div className="flex items-center justify-between relative z-10">
                        {/* 3D Floating Icon Box Tone Xanh Lục */}
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-green-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/35 ring-4 ring-white/80 dark:ring-emerald-900/40 group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                Hoàn Tất
                            </span>
                            <div className="w-7 h-7 rounded-full bg-emerald-100/80 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center justify-center text-xs font-black group-hover:translate-x-0.5 transition-transform">
                                →
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 relative z-10">
                        <div className="text-xs font-black text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                            Đã Hoàn Tất
                        </div>
                        <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-950 dark:text-emerald-100 mt-1 tracking-tight">
                            {thongKe.da_hoan_thanh}
                        </div>
                        <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1">
                            <span>Đã tư vấn & chốt máy thành công</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Thanh Công Cụ Lọc & Tìm Kiếm (Section Riêng Biệt Nền Gradient Tinh Tế, Border & Shadow Cao Cấp) */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-50/90 via-white to-indigo-50/40 dark:from-[#0d1527] dark:via-slate-900 dark:to-[#111c35] border-2 border-indigo-100/90 dark:border-slate-800 shadow-md shadow-indigo-500/5 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    {/* Ô tìm kiếm từ khóa hiện đại */}
                    <div className="relative flex-1 max-w-lg">
                        <Search className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={tuKhoa}
                            onChange={(e) => setTuKhoa(e.target.value)}
                            placeholder="Tìm theo tên khách, SĐT, mã LH, nội dung..."
                            className="w-full pl-9 pr-8 py-2.5 text-xs font-bold rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-2xs"
                        />
                        {tuKhoa && (
                            <button
                                type="button"
                                onClick={() => setTuKhoa('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Live Indicator & Nút Refresh Làm Mới */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() => setTuDongDongBo(!tuDongDongBo)}
                            className={`px-3.5 py-2 rounded-2xl text-xs font-black border-2 transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                                tuDongDongBo
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-emerald-500/25'
                                    : 'bg-white text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 shadow-2xs'
                            }`}
                            title="Tự động đồng bộ thời gian thực mỗi 5 giây & khi khách gửi phiếu mới"
                        >
                            <span className="relative flex h-2.5 w-2.5">
                                {tuDongDongBo && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>}
                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${tuDongDongBo ? 'bg-white' : 'bg-slate-400'}`}></span>
                            </span>
                            <span>{tuDongDongBo ? 'Realtime: Đang Bật' : 'Realtime: Đang Tắt'}</span>
                            {thoiGianDongBoCuoi && (
                                <span className="text-[10px] opacity-90 font-mono hidden sm:inline">
                                    • {thoiGianDongBoCuoi}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => taiDuLieu(true)}
                            disabled={dangTai}
                            className="px-4 py-2 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60 shadow-2xs hover:shadow-indigo-500/10 hover:border-indigo-300"
                        >
                            <RotateCcw className={`w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 ${dangTai ? 'animate-spin' : ''}`} />
                            <span>Làm mới</span>
                        </button>
                    </div>
                </div>

                {/* Lọc theo thời gian — Select gọn */}
                <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t-2 border-slate-200/70 dark:border-slate-700/70">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        Thời gian:
                    </span>
                    <div className="relative">
                        <select
                            value={locThoiGian}
                            onChange={(e) => {
                                setLocThoiGian(e.target.value);
                                if (e.target.value !== 'tuy_chinh') {
                                    setLocTuNgay('');
                                    setLocDenNgay('');
                                }
                            }}
                            className="appearance-none pl-3.5 pr-8 py-2 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-black text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-2xs cursor-pointer"
                        >
                            <option value="tat_ca">📅 Tất cả thời gian</option>
                            <option value="hom_nay">🔴 Hôm nay</option>
                            <option value="hom_qua">🟡 Hôm qua</option>
                            <option value="7_ngay">📆 7 ngày qua</option>
                            <option value="tuan_nay">📅 Tuần này</option>
                            <option value="thang_nay">🗓️ Tháng này</option>
                            <option value="tuy_chinh">✏️ Tùy chỉnh ngày...</option>
                        </select>
                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </div>

                    {/* Chỉ hiện input ngày khi chọn "Tùy chỉnh" */}
                    {locThoiGian === 'tuy_chinh' && (
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5">
                                <label className="text-[11px] font-bold text-slate-500 whitespace-nowrap">Từ</label>
                                <input
                                    type="date"
                                    value={locTuNgay}
                                    onChange={(e) => setLocTuNgay(e.target.value)}
                                    className="text-xs font-bold px-2.5 py-1.5 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                                />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <label className="text-[11px] font-bold text-slate-500 whitespace-nowrap">Đến</label>
                                <input
                                    type="date"
                                    value={locDenNgay}
                                    onChange={(e) => setLocDenNgay(e.target.value)}
                                    min={locTuNgay || undefined}
                                    className="text-xs font-bold px-2.5 py-1.5 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                                />
                            </div>
                        </div>
                    )}

                    {locThoiGian !== 'tat_ca' && (
                        <button
                            type="button"
                            onClick={() => { setLocThoiGian('tat_ca'); setLocTuNgay(''); setLocDenNgay(''); }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-black bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-2 border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all cursor-pointer whitespace-nowrap"
                        >
                            <X className="w-3 h-3" />
                            Xóa
                        </button>
                    )}
                </div>

                {/* Các Tab lọc trạng thái đa sắc màu Vibrant Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t-2 border-slate-200/70 dark:border-slate-700/70">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1">
                        Trạng thái:
                    </span>
                    {DANH_SACH_TRANG_THAI.map((tab) => {
                        const dangChon = locTrangThai === tab.id;
                        let activeGradient = 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25 border-indigo-500';
                        if (tab.id === 'chua_xu_ly') activeGradient = 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-md shadow-orange-500/25 border-orange-500';
                        if (tab.id === 'dang_xu_ly') activeGradient = 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25 border-blue-500';
                        if (tab.id === 'da_hoan_thanh') activeGradient = 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white shadow-md shadow-emerald-500/25 border-emerald-500';
                        if (tab.id === 'da_huy') activeGradient = 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/25 border-rose-500';

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setLocTrangThai(tab.id)}
                                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                                    dangChon
                                        ? `${activeGradient} border-2 scale-105`
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-600 shadow-2xs'
                                }`}
                            >
                                {tab.ten}
                            </button>
                        );
                    })}
                </div>
            </div>

{/* 3. Bảng Danh Sách Phiếu Tư Vấn & CSKH (Excel-Style Grid Sắc Nét, Banner Đồng Bộ, Responsive Chuẩn Không Xuống Dòng) */}
            <div className="relative bg-white dark:bg-[#0d1527] rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-md shadow-slate-900/5 overflow-hidden">
                {/* Banner Tiêu Đề Bảng Đồng Bộ Chuẩn Đơn Hàng / Sản Phẩm */}
                <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-white shrink-0">
                            <Headphones className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                                Danh Sách Phiếu Yêu Cầu Tư Vấn & CSKH
                            </h3>
                            <div className="text-[11px] text-blue-100 font-medium">
                                Đồng bộ tức thời từ khách hàng qua Web & Zalo
                            </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black">
                            {danhSach.length} phiếu
                        </span>
                    </div>

                    <div className="text-[11px] text-blue-100 font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Realtime CSKH Active</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black uppercase text-[11px] tracking-wider whitespace-nowrap">
                                <th className="py-3 px-3.5 w-48 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">
                                    MÃ PHIẾU & THỜI GIAN
                                </th>
                                <th className="py-3 px-3.5 w-56 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">
                                    KHÁCH HÀNG
                                </th>
                                <th className="py-3 px-3.5 w-44 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">
                                    CHỦ ĐỀ & NHU CẦU
                                </th>
                                <th className="py-3 px-3.5 min-w-[260px] border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">
                                    NỘI DUNG YÊU CẦU
                                </th>
                                <th className="py-3 px-3.5 w-40 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">
                                    TRẠNG THÁI CSKH
                                </th>
                                <th className="py-3 px-3.5 w-52 text-right border-b-2 border-slate-300 dark:border-slate-700 whitespace-nowrap">
                                    THAO TÁC NHANH
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {dangTai ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                            <span className="font-bold">Đang tải danh sách yêu cầu tư vấn...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : danhSach.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Headphones className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                                            <span className="font-bold text-slate-700 dark:text-slate-300">Chưa có yêu cầu tư vấn nào</span>
                                            <span className="text-xs text-slate-400">Khi khách điền form tại trang Liên Hệ, thông tin sẽ xuất hiện ngay tại đây</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                danhSachTrenTrang.map((phieu) => {
                                    const phieuId = phieu._id || phieu.id;
                                    const sdtKhach = phieu.so_dien_thoai || '';
                                    const sdtSoOnly = sdtKhach.replace(/\D/g, '');
                                    const laMoiNhan = maPhieuMoiNhan === phieu.ma_yeu_cau;
                                    const daHuy = phieu.trang_thai === 'da_huy';

                                    return (
                                        <tr
                                            key={phieuId}
                                            className={`transition-colors duration-150 ${
                                                daHuy
                                                    ? '!bg-rose-50/90 dark:!bg-rose-950/40 hover:!bg-rose-100/90 dark:hover:!bg-rose-900/50 border-l-4 border-l-rose-500'
                                                    : laMoiNhan
                                                    ? 'bg-amber-100/90 dark:bg-amber-950/70 ring-2 ring-amber-400 shadow-md animate-pulse'
                                                    : 'odd:bg-white even:bg-slate-50/70 dark:odd:bg-[#0d1527] dark:even:bg-[#090f1d] hover:!bg-blue-50/80 dark:hover:!bg-blue-950/50'
                                            }`}
                                        >
                                            {/* Cột 1: Mã phiếu & ngày gửi (Không vỡ dòng) */}
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle whitespace-nowrap">
                                                <div className="space-y-1.5">
                                                    <div className="inline-flex items-center gap-1.5 font-mono font-black text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800 whitespace-nowrap shadow-2xs">
                                                        <span className="tracking-tight whitespace-nowrap">#{phieu.ma_yeu_cau}</span>
                                                        {laMoiNhan && (
                                                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-500 text-white animate-bounce whitespace-nowrap">
                                                                MỚI
                                                            </span>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => xuLyCopyMa(phieu.ma_yeu_cau)}
                                                            className="text-slate-400 hover:text-blue-600 transition-colors ml-0.5 cursor-pointer"
                                                            title="Sao chép mã phiếu"
                                                        >
                                                            {daCopyMa === phieu.ma_yeu_cau ? (
                                                                <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                                                            ) : (
                                                                <Copy className="w-3.5 h-3.5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium whitespace-nowrap">
                                                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                                                        <span className="whitespace-nowrap">{dinhDangNgay(phieu.ngay_tao || phieu.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Cột 2: Thông tin khách hàng */}
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle">
                                                <div className="space-y-1">
                                                    <div className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-[13px] leading-tight">
                                                        {phieu.ho_ten}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-xs whitespace-nowrap">
                                                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                                                        <span className="whitespace-nowrap">{sdtKhach}</span>
                                                    </div>
                                                    {phieu.email && (
                                                        <div className="text-[11px] text-slate-400 truncate max-w-[180px] font-medium" title={phieu.email}>
                                                            {phieu.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Cột 3: Chủ đề tư vấn */}
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle whitespace-nowrap">
                                                <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 whitespace-nowrap shadow-2xs">
                                                    {phieu.chu_de || 'Tư vấn mua Laptop'}
                                                </span>
                                            </td>

                                            {/* Cột 4: Nội dung yêu cầu */}
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle min-w-[260px]">
                                                <div className="space-y-2">
                                                    <p className="text-slate-800 dark:text-slate-200 text-xs italic font-medium leading-relaxed">
                                                        "{phieu.noi_dung}"
                                                    </p>
                                                    {phieu.ghi_chu_noi_bo && (
                                                        <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-[11px] text-amber-900 dark:text-amber-200 font-medium">
                                                            <span className="font-extrabold">📝 Note CSKH:</span> {phieu.ghi_chu_noi_bo}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Cột 5: Trạng thái CSKH - 1 Dropdown Pill đổi màu trực tiếp, không bị trùng lặp */}
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle text-center whitespace-nowrap">
                                                <div className="inline-flex items-center relative">
                                                    <select
                                                        value={phieu.trang_thai || 'chua_xu_ly'}
                                                        onChange={(e) => xuLyDoiTrangThaiNhanh(phieuId, e.target.value)}
                                                        className={`appearance-none text-[11px] font-black pl-3 pr-6 py-1.5 rounded-full cursor-pointer transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 whitespace-nowrap ${
                                                            phieu.trang_thai === 'chua_xu_ly'
                                                                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-orange-500/25 focus:ring-orange-400'
                                                                : phieu.trang_thai === 'dang_xu_ly'
                                                                ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 text-white shadow-blue-500/25 focus:ring-blue-400'
                                                                : phieu.trang_thai === 'da_hoan_thanh'
                                                                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white shadow-emerald-500/25 focus:ring-emerald-400'
                                                                : 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-500/25 focus:ring-rose-400'
                                                        }`}
                                                        title="Bấm để đổi nhanh trạng thái xử lý"
                                                    >
                                                        <option value="chua_xu_ly" className="bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 font-bold">● Chưa Tư Vấn</option>
                                                        <option value="dang_xu_ly" className="bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 font-bold">● Đang Liên Hệ</option>
                                                        <option value="da_hoan_thanh" className="bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 font-bold">● Đã Hoàn Tất</option>
                                                        <option value="da_huy" className="bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 font-bold">● Đã Hủy / Sai Số</option>
                                                    </select>
                                                    <ChevronDown className="w-3.5 h-3.5 text-white pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 stroke-[2.5]" />
                                                </div>
                                            </td>

                                            {/* Cột 6: Thao tác gọi điện, Zalo, chi tiết, xóa (Nằm ngang chuẩn không vỡ nút) */}
                                            <td className="py-3 px-3.5 border-b border-slate-200 dark:border-slate-800 align-middle text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                                                    {/* Nút Gọi Ngay - Gradient Emerald Nổi Bật */}
                                                    <a
                                                        href={`tel:${sdtSoOnly}`}
                                                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white transition-all flex items-center gap-1.5 text-[11px] font-black shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.03] active:scale-95 whitespace-nowrap"
                                                        title={`Gọi điện ngay cho ${phieu.ho_ten} (${sdtKhach})`}
                                                    >
                                                        <Phone className="w-3.5 h-3.5 fill-white text-white shrink-0" />
                                                        <span className="whitespace-nowrap">Gọi Ngay</span>
                                                    </a>

                                                    {/* Nút Chat Zalo - Gradient Blue Nổi Bật */}
                                                    <a
                                                        href={`https://zalo.me/${sdtSoOnly}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white transition-all flex items-center gap-1.5 text-[11px] font-black shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 hover:scale-[1.03] active:scale-95 whitespace-nowrap"
                                                        title={`Nhắn Zalo tới số ${sdtKhach}`}
                                                    >
                                                        <MessageSquare className="w-3.5 h-3.5 text-white shrink-0 fill-white/20" />
                                                        <span className="whitespace-nowrap">Zalo</span>
                                                    </a>

                                                    {/* Nút phản hồi email riêng */}
                                                    <button
                                                        type="button"
                                                        onClick={() => moModalPhanHoi(phieu)}
                                                        disabled={!phieu.email}
                                                        className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-violet-200 dark:border-violet-800 hover:border-violet-500 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/50 transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                                                        title={phieu.email ? `Gửi email phản hồi tới ${phieu.email}` : 'Khách chưa cung cấp email'}
                                                    >
                                                        <Mail className="w-4 h-4" />
                                                    </button>

                                                    {/* Nút Xem chi tiết & Ghi chú */}
                                                    <button
                                                        type="button"
                                                        onClick={() => moModalChiTiet(phieu)}
                                                        className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                                                        title="Sửa trạng thái và ghi chú nội bộ"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>

                                                    {/* Nút Xóa */}
                                                    <button
                                                        type="button"
                                                        onClick={() => xuLyXoaPhieu(phieuId, phieu.ma_yeu_cau)}
                                                        className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-rose-200 dark:border-rose-900/60 hover:border-rose-500 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                                                        title="Xóa phiếu"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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

                {/* Thanh Phân Trang Chuẩn */}
                <PhanTrangAdmin
                    trangHienTai={trangHienTai}
                    tongSoTrang={tongSoTrang}
                    tongSoMuc={tongSoMuc}
                    soMucMoiTrang={soMucMoiTrang}
                    onDoiTrang={setTrangHienTai}
                    onDoiSoMucMoiTrang={setSoMucMoiTrang}
                    nhanLoaiMuc="yêu cầu tư vấn"
                />
            </div>

            {/* 4. Modal Chi Tiết & CSKH: Giao diện Split-View 2 Phân Vùng Tone Sáng Tinh Tế, Border Đẹp */}
            {phieuDangXem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="bg-white dark:bg-[#0d1527] w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">

                        {/* ── TOP HEADER CHUNG (Tone Sáng Tinh Tế & Đồng Bộ) ── */}
                        <div className="shrink-0 px-5 py-3.5 bg-gradient-to-r from-blue-50/90 via-slate-50 to-indigo-50/70 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800/90 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800 shadow-2xs">
                                    <Headphones className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-black text-sm text-blue-700 dark:text-blue-300">
                                            #{phieuDangXem.ma_yeu_cau}
                                        </span>
                                        <span className="text-slate-300 dark:text-slate-600">•</span>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                            Tiếp nhận: {dinhDangNgay(phieuDangXem.ngay_tao || phieuDangXem.createdAt)}
                                        </span>
                                    </div>
                                    <div className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight mt-0.5">
                                        Chi Tiết Phiếu Tư Vấn & CSKH
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setPhieuDangXem(null)}
                                className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
                                title="Đóng"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* ── SPLIT VIEW 2 CỘT: TRÁI (THÔNG TIN) & PHẢI (THAO TÁC) ── */}
                        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">

                            {/* ════════ CỘT TRÁI: THÔNG TIN KHÁCH HÀNG & LỜI NHẮN (READ-ONLY) ════════ */}
                            <div className="md:col-span-5 p-5 bg-slate-50/60 dark:bg-slate-900/30 space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-1 rounded-lg bg-blue-100/80 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 border border-blue-200 dark:border-blue-900">
                                        <UserCheck className="w-3.5 h-3.5" />
                                        Thông Tin Khách Hàng
                                    </span>
                                </div>

                                {/* Card Profile Khách Hàng */}
                                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 shadow-2xs space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-base flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
                                            {(phieuDangXem.ho_ten || 'K').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-extrabold text-slate-900 dark:text-white text-sm truncate">
                                                {phieuDangXem.ho_ten}
                                            </div>
                                            <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1 mt-0.5">
                                                <Phone className="w-3 h-3 shrink-0" />
                                                <span>{phieuDangXem.so_dien_thoai}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nút hành động nhanh Gọi / Zalo */}
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                                        <a
                                            href={`tel:${(phieuDangXem.so_dien_thoai || '').replace(/\D/g, '')}`}
                                            className="h-7.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-xs"
                                        >
                                            <Phone className="w-3 h-3 fill-white" />
                                            <span>Gọi Điện</span>
                                        </a>
                                        <a
                                            href={`https://zalo.me/${(phieuDangXem.so_dien_thoai || '').replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="h-7.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-xs"
                                        >
                                            <MessageSquare className="w-3 h-3 fill-white" />
                                            <span>Chat Zalo</span>
                                        </a>
                                    </div>

                                    {/* Email & Chủ đề */}
                                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                                        {phieuDangXem.email && (
                                            <div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase">Email liên hệ:</div>
                                                <div className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 truncate mt-0.5">
                                                    <Mail className="w-3.5 h-3.5 shrink-0" />
                                                    <span className="truncate">{phieuDangXem.email}</span>
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">Chủ đề quan tâm:</div>
                                            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] border border-indigo-100 dark:border-indigo-900/50">
                                                {phieuDangXem.chu_de}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Lời nhắn từ khách hàng (Dạng tin nhắn) */}
                                <div className="space-y-1.5">
                                    <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <MessageSquare className="w-3 h-3 text-indigo-500" />
                                        Lời Nhắn Từ Khách Hàng:
                                    </div>
                                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium shadow-2xs italic">
                                        &ldquo;{phieuDangXem.noi_dung}&rdquo;
                                    </div>
                                </div>
                            </div>

                            {/* ════════ CỘT PHẢI: BÀN LÀM VIỆC & THAO TÁC CSKH (INTERACTIVE) ════════ */}
                            <div className="md:col-span-7 p-5 bg-white dark:bg-[#0d1527] space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-1 rounded-lg bg-purple-100/80 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 border border-purple-200 dark:border-purple-900">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        Khu Vực Xử Lý & Thao Tác CSKH
                                    </span>
                                </div>

                                {/* 1. Cập nhật trạng thái phiếu (Dropdown Select Gọn Đẹp, Tự Đổi Màu) */}
                                <div className="space-y-1.5">
                                    <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        1. Trạng Thái Phiếu CSKH:
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={trangThaiTam}
                                            onChange={(e) => setTrangThaiTam(e.target.value)}
                                            className={`w-full appearance-none h-10 pl-3.5 pr-8 rounded-xl border-2 text-xs font-bold cursor-pointer transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                                trangThaiTam === 'chua_xu_ly'
                                                    ? 'border-amber-300 bg-amber-50/80 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300 focus:ring-amber-300'
                                                    : trangThaiTam === 'dang_xu_ly'
                                                    ? 'border-blue-300 bg-blue-50/80 text-blue-800 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-300 focus:ring-blue-300'
                                                    : trangThaiTam === 'da_hoan_thanh'
                                                    ? 'border-emerald-300 bg-emerald-50/80 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 focus:ring-emerald-300'
                                                    : 'border-rose-300 bg-rose-50/80 text-rose-800 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-300 focus:ring-rose-300'
                                            }`}
                                        >
                                            <option value="chua_xu_ly">⚡ Chưa Tư Vấn (Mới tiếp nhận, cần liên hệ)</option>
                                            <option value="dang_xu_ly">📞 Đang Liên Hệ (Đã gọi / gửi báo giá Zalo)</option>
                                            <option value="da_hoan_thanh">✅ Đã Hoàn Tất (Khách đã chốt đơn / được giải đáp)</option>
                                            <option value="da_huy">❌ Đã Hủy / Sai Số (Khách không nghe máy / nhầm số)</option>
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-slate-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                {/* 2. Ghi chú nội bộ CSKH */}
                                <div className="space-y-1.5">
                                    <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        2. Ghi Chú Nội Bộ (Chỉ nhân viên thấy):
                                    </label>
                                    <textarea
                                        value={ghiChuTam}
                                        onChange={(e) => setGhiChuTam(e.target.value)}
                                        rows={3}
                                        placeholder="Nhập ghi chú xử lý (VD: Đã gọi khách lúc 10h, khách hẹn tối nay qua showroom...)"
                                        className="w-full p-2.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none shadow-2xs"
                                    />
                                </div>

                            </div>
                        </div>

                        {/* ── FOOTER CHUNG ── */}
                        <div className="shrink-0 px-5 py-3 bg-slate-50/90 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400 hidden sm:inline">
                                Nhớ bấm <strong className="text-slate-600 dark:text-slate-300">Lưu Thay Đổi</strong> sau khi cập nhật trạng thái/ghi chú.
                            </span>

                            <div className="flex items-center gap-2.5 ml-auto">
                                <button
                                    type="button"
                                    onClick={() => setPhieuDangXem(null)}
                                    className="h-8 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="button"
                                    onClick={xuLyLuuModal}
                                    disabled={dangLuuGhiChu}
                                    className="h-8 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black inline-flex items-center gap-1.5 shadow-md shadow-indigo-500/25 cursor-pointer disabled:opacity-50 transition-all"
                                >
                                    {dangLuuGhiChu ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-4 h-4 stroke-[3]" />}
                                    <span>Lưu Thay Đổi</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal phản hồi email độc lập với form sửa phiếu */}
            {phieuDangPhanHoi && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-violet-200 dark:border-violet-900 bg-white dark:bg-[#0d1527] shadow-2xl animate-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/40 dark:to-indigo-950/40">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-500/25">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white">Gửi Phản Hồi Khách Hàng</h3>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        Phiếu #{phieuDangPhanHoi.ma_yeu_cau}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPhieuDangPhanHoi(null)}
                                disabled={dangGuiPhanHoi}
                                className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-white dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50"
                                title="Đóng"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-3 text-xs">
                                <div className="font-bold text-slate-900 dark:text-white">{phieuDangPhanHoi.ho_ten}</div>
                                <div className="mt-1 text-violet-600 dark:text-violet-400 font-semibold">{phieuDangPhanHoi.email}</div>
                            </div>
                            <div>
                                <label className="block mb-1.5 text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Nội dung phản hồi
                                </label>
                                <textarea
                                    value={noiDungPhanHoi}
                                    onChange={(e) => setNoiDungPhanHoi(e.target.value)}
                                    rows={7}
                                    autoFocus
                                    placeholder="Nhập nội dung tư vấn gửi tới email khách hàng..."
                                    className="w-full p-3 text-sm rounded-xl border border-violet-200 dark:border-violet-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
                                />
                                <p className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                                    Gửi thành công sẽ tự chuyển phiếu sang “Đã Hoàn Tất”.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2.5 px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60">
                            <button
                                type="button"
                                onClick={() => setPhieuDangPhanHoi(null)}
                                disabled={dangGuiPhanHoi}
                                className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={xuLyGuiPhanHoi}
                                disabled={dangGuiPhanHoi || !noiDungPhanHoi.trim()}
                                className="h-9 px-5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-black inline-flex items-center gap-2 shadow-md shadow-violet-500/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {dangGuiPhanHoi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                <span>{dangGuiPhanHoi ? 'Đang gửi...' : 'Gửi Email & Hoàn Tất'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
