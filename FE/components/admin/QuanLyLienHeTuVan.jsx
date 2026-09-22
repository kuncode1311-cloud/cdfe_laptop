'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    Headphones,
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
    FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { LienHeService } from '@/services/lien-he.service';

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

export default function QuanLyLienHeTuVan({ onCapNhatSoLuongChuaXuLy }) {
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

    // Real-time State
    const [tuDongDongBo, setTuDongDongBo] = useState(true);
    const [thoiGianDongBoCuoi, setThoiGianDongBoCuoi] = useState('');
    const [maPhieuMoiNhan, setMaPhieuMoiNhan] = useState(null);

    // Quản lý Modal Xem Chi Tiết & Ghi Chú CSKH
    const [phieuDangXem, setPhieuDangXem] = useState(null);
    const [ghiChuTam, setGhiChuTam] = useState('');
    const [trangThaiTam, setTrangThaiTam] = useState('');
    const [dangLuuGhiChu, setDangLuuGhiChu] = useState(false);
    const [daCopyMa, setDaCopyMa] = useState('');

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
        if (!window.confirm(`Bạn có chắc chắn muốn xóa phiếu yêu cầu #${maPhieu}?`)) return;
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

    // Style badge theo trạng thái
    const renderBadgeTrangThai = (trangThai) => {
        switch (trangThai) {
            case 'chua_xu_ly':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        Chưa Tư Vấn
                    </span>
                );
            case 'dang_xu_ly':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                        <Clock className="w-3 h-3 text-blue-600" />
                        Đang Liên Hệ
                    </span>
                );
            case 'da_hoan_thanh':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Đã Hoàn Tất
                    </span>
                );
            case 'da_huy':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
                        <UserX className="w-3 h-3 text-rose-600" />
                        Đã Hủy / Sai Số
                    </span>
                );
            default:
                return <span className="text-xs text-slate-500">{trangThai}</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* 1. Header & Thống Kê Nhanh (Top Metric Cards) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Thẻ 1: Tổng số */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Tổng Phiếu Yêu Cầu</span>
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                            <Headphones className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                        {thongKe.tong_so}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Từ trang Liên Hệ & Hỗ Trợ</div>
                </div>

                {/* Thẻ 2: Chưa tư vấn (Nổi bật cần xử lý gấp) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-amber-950/40 dark:to-slate-800 border-2 border-amber-300/80 dark:border-amber-700/80 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                            Chưa Tư Vấn
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-amber-200/80 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold">
                            ⚡
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-900 dark:text-amber-200 mt-2">
                        {thongKe.chua_xu_ly}
                    </div>
                    <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-1">Cần gọi điện tư vấn ngay</div>
                </div>

                {/* Thẻ 3: Đang liên hệ */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Đang Chăm Sóc</span>
                        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                        {thongKe.dang_xu_ly}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Đang gọi điện / Báo giá Zalo</div>
                </div>

                {/* Thẻ 4: Đã chốt xong */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Đã Hoàn Tất</span>
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                        {thongKe.da_hoan_thanh}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Đã tư vấn & chốt máy thành công</div>
                </div>
            </div>

            {/* 2. Thanh Công Cụ Lọc & Tìm Kiếm */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Ô tìm kiếm từ khóa */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={tuKhoa}
                            onChange={(e) => setTuKhoa(e.target.value)}
                            placeholder="Tìm theo tên khách, SĐT, mã LH, nội dung..."
                            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                        />
                        {tuKhoa && (
                            <button
                                onClick={() => setTuKhoa('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Live Indicator & Nút Refresh Làm Mới */}
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setTuDongDongBo(!tuDongDongBo)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                                tuDongDongBo
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700'
                                    : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                            title="Tự động đồng bộ thời gian thực mỗi 5 giây & khi khách gửi phiếu mới"
                        >
                            <span className="relative flex h-2.5 w-2.5">
                                {tuDongDongBo && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${tuDongDongBo ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                            </span>
                            <span>{tuDongDongBo ? 'Realtime: Đang Bật' : 'Realtime: Đang Tắt'}</span>
                            {thoiGianDongBoCuoi && (
                                <span className="text-[10px] opacity-75 font-mono hidden sm:inline">
                                    • {thoiGianDongBoCuoi}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => taiDuLieu(true)}
                            disabled={dangTai}
                            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                        >
                            <RotateCcw className={`w-3.5 h-3.5 ${dangTai ? 'animate-spin' : ''}`} />
                            <span>Làm mới</span>
                        </button>
                    </div>
                </div>

                {/* Các Tab lọc trạng thái */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                        Trạng thái:
                    </span>
                    {DANH_SACH_TRANG_THAI.map((tab) => {
                        const dangChon = locTrangThai === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setLocTrangThai(tab.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    dangChon
                                        ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/25'
                                        : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                            >
                                {tab.ten}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 3. Bảng Danh Sách Phiếu Tư Vấn & CSKH */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-slate-200/80 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 font-extrabold uppercase tracking-wider text-[11px]">
                                <th className="p-3.5 sm:p-4">Mã Phiếu & Thời Gian</th>
                                <th className="p-3.5 sm:p-4">Khách Hàng</th>
                                <th className="p-3.5 sm:p-4">Chủ Đề & Nhu Cầu</th>
                                <th className="p-3.5 sm:p-4 min-w-[220px]">Nội Dung Yêu Cầu</th>
                                <th className="p-3.5 sm:p-4 text-center">Trạng Thái CSKH</th>
                                <th className="p-3.5 sm:p-4 text-right">Thao Tác Nhanh</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                            {dangTai ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                            <span>Đang tải danh sách yêu cầu tư vấn...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : danhSach.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Headphones className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                                            <span className="font-bold text-slate-600 dark:text-slate-300">Chưa có yêu cầu tư vấn nào</span>
                                            <span className="text-xs text-slate-400">Khi khách điền form tại trang Liên Hệ, thông tin sẽ xuất hiện ngay tại đây</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                danhSach.map((phieu) => {
                                    const phieuId = phieu._id || phieu.id;
                                    const sdtKhach = phieu.so_dien_thoai || '';
                                    const sdtSoOnly = sdtKhach.replace(/\D/g, '');
                                    const laMoiNhan = maPhieuMoiNhan === phieu.ma_yeu_cau;
                                    const daHuy = phieu.trang_thai === 'da_huy';

                                    return (
                                        <tr
                                            key={phieuId}
                                            className={`transition-all duration-500 group ${
                                                daHuy
                                                    ? '!bg-rose-100/90 dark:!bg-rose-950/60 hover:!bg-rose-200/90 dark:hover:!bg-rose-900/70 border-l-4 border-l-rose-600 shadow-xs'
                                                    : laMoiNhan
                                                    ? 'bg-amber-100/70 dark:bg-amber-950/60 ring-2 ring-amber-400 shadow-md animate-pulse'
                                                    : 'hover:bg-blue-50/40 dark:hover:bg-slate-750/40'
                                            }`}
                                        >
                                            {/* Cột 1: Mã phiếu & ngày gửi */}
                                            <td className="p-3.5 sm:p-4 align-top">
                                                <div className="space-y-1">
                                                    <div className="inline-flex items-center gap-1.5 font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                                                        <span>#{phieu.ma_yeu_cau}</span>
                                                        {laMoiNhan && (
                                                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-rose-500 text-white animate-bounce">
                                                                MỚI
                                                            </span>
                                                        )}
                                                        <button
                                                            onClick={() => xuLyCopyMa(phieu.ma_yeu_cau)}
                                                            className="text-slate-400 hover:text-blue-600 ml-0.5"
                                                            title="Sao chép mã"
                                                        >
                                                            {daCopyMa === phieu.ma_yeu_cau ? (
                                                                <Check className="w-3 h-3 text-emerald-500" />
                                                            ) : (
                                                                <Copy className="w-3 h-3" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{dinhDangNgay(phieu.ngay_tao || phieu.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Cột 2: Thông tin khách hàng */}
                                            <td className="p-3.5 sm:p-4 align-top">
                                                <div className="space-y-1">
                                                    <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-[13px]">
                                                        {phieu.ho_ten}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono font-semibold">
                                                        <Phone className="w-3 h-3 text-emerald-500" />
                                                        <span>{sdtKhach}</span>
                                                    </div>
                                                    {phieu.email && (
                                                        <div className="text-[11px] text-slate-400 truncate max-w-[170px]" title={phieu.email}>
                                                            {phieu.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Cột 3: Chủ đề tư vấn */}
                                            <td className="p-3.5 sm:p-4 align-top">
                                                <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                                    {phieu.chu_de || 'Tư vấn mua Laptop'}
                                                </span>
                                            </td>

                                            {/* Cột 4: Nội dung yêu cầu */}
                                            <td className="p-3.5 sm:p-4 align-top">
                                                <div className="space-y-1.5">
                                                    <p className="text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                                                        "{phieu.noi_dung}"
                                                    </p>
                                                    {phieu.ghi_chu_noi_bo && (
                                                        <div className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                                                            <span className="font-bold">📝 Note CSKH:</span> {phieu.ghi_chu_noi_bo}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Cột 5: Trạng thái & Dropdown chuyển đổi */}
                                            <td className="p-3.5 sm:p-4 align-top text-center">
                                                <div className="flex flex-col items-center gap-1.5">
                                                    {renderBadgeTrangThai(phieu.trang_thai)}
                                                    {/* Dropdown đổi nhanh */}
                                                    <select
                                                        value={phieu.trang_thai || 'chua_xu_ly'}
                                                        onChange={(e) => xuLyDoiTrangThaiNhanh(phieuId, e.target.value)}
                                                        className="text-[10.5px] font-bold py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option value="chua_xu_ly">Chưa tư vấn</option>
                                                        <option value="dang_xu_ly">Đang liên hệ</option>
                                                        <option value="da_hoan_thanh">Đã hoàn tất</option>
                                                        <option value="da_huy">Đã hủy / Sai số</option>
                                                    </select>
                                                </div>
                                            </td>

                                            {/* Cột 6: Thao tác gọi điện, Zalo, chi tiết, xóa */}
                                            <td className="p-3.5 sm:p-4 align-top text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* Nút Gọi Ngay */}
                                                    <a
                                                        href={`tel:${sdtSoOnly}`}
                                                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all flex items-center gap-1 text-[11px] font-bold shadow-2xs"
                                                        title={`Gọi điện ngay cho ${phieu.ho_ten} (${sdtKhach})`}
                                                    >
                                                        <Phone className="w-3.5 h-3.5 fill-emerald-500" />
                                                        <span className="hidden xl:inline">Gọi Ngay</span>
                                                    </a>

                                                    {/* Nút Chat Zalo */}
                                                    <a
                                                        href={`https://zalo.me/${sdtSoOnly}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all flex items-center gap-1 text-[11px] font-bold shadow-2xs"
                                                        title={`Nhắn Zalo tới số ${sdtKhach}`}
                                                    >
                                                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                                                        <span className="hidden xl:inline">Zalo</span>
                                                    </a>

                                                    {/* Nút Xem chi tiết & Ghi chú */}
                                                    <button
                                                        onClick={() => moModalChiTiet(phieu)}
                                                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 transition-colors"
                                                        title="Xem chi tiết & thêm ghi chú nội bộ"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </button>

                                                    {/* Nút Xóa */}
                                                    <button
                                                        onClick={() => xuLyXoaPhieu(phieuId, phieu.ma_yeu_cau)}
                                                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                                                        title="Xóa phiếu"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
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

            {/* 4. Modal Xem Chi Tiết & Ghi Chú CSKH Chuyên Nghiệp */}
            {phieuDangXem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden space-y-0 animate-in zoom-in-95 duration-200">
                        {/* Header Modal */}
                        <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
                                    <Headphones className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-black text-sm sm:text-base">
                                        Chi Tiết Phiếu Tư Vấn #{phieuDangXem.ma_yeu_cau}
                                    </div>
                                    <div className="text-[11px] text-blue-100">
                                        Tiếp nhận lúc: {dinhDangNgay(phieuDangXem.ngay_tao || phieuDangXem.createdAt)}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setPhieuDangXem(null)}
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Nội dung chi tiết */}
                        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            {/* Thông tin khách */}
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div>
                                    <div className="text-slate-400 text-[11px]">Họ và tên:</div>
                                    <div className="font-bold text-slate-900 dark:text-white text-sm">{phieuDangXem.ho_ten}</div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-[11px]">Số điện thoại:</div>
                                    <div className="font-bold text-emerald-600 text-sm font-mono flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5" />
                                        <span>{phieuDangXem.so_dien_thoai}</span>
                                    </div>
                                </div>
                                {phieuDangXem.email && (
                                    <div className="sm:col-span-2">
                                        <div className="text-slate-400 text-[11px]">Email liên hệ:</div>
                                        <div className="font-medium text-slate-700 dark:text-slate-300">{phieuDangXem.email}</div>
                                    </div>
                                )}
                                <div className="sm:col-span-2">
                                    <div className="text-slate-400 text-[11px]">Chủ đề quan tâm:</div>
                                    <div className="font-bold text-indigo-600 dark:text-indigo-400">{phieuDangXem.chu_de}</div>
                                </div>
                            </div>

                            {/* Lời nhắn của khách */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Nội Dung Yêu Cầu Của Khách Hàng:
                                </label>
                                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                                    "{phieuDangXem.noi_dung}"
                                </div>
                            </div>

                            {/* Cập nhật trạng thái */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Trạng Thái Xử Lý:
                                </label>
                                <select
                                    value={trangThaiTam}
                                    onChange={(e) => setTrangThaiTam(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                                >
                                    <option value="chua_xu_ly">Chưa Tư Vấn (Mới tiếp nhận)</option>
                                    <option value="dang_xu_ly">Đang Liên Hệ (Đã gọi / nhắn Zalo cho khách)</option>
                                    <option value="da_hoan_thanh">Đã Hoàn Tất (Khách đã chốt đơn hoặc được giải đáp)</option>
                                    <option value="da_huy">Đã Hủy (Khách không bắt máy / nhầm số)</option>
                                </select>
                            </div>

                            {/* Ghi chú nội bộ CSKH */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Ghi Chú Nội Bộ CSKH (Khách hàng không thấy):
                                </label>
                                <textarea
                                    value={ghiChuTam}
                                    onChange={(e) => setGhiChuTam(e.target.value)}
                                    rows={3}
                                    placeholder="VD: Đã gọi lúc 10h15, khách quan tâm Legion 5 Pro tầm 28tr, hẹn chiều ghé Showroom Q10 xem máy..."
                                    className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all resize-none"
                                />
                            </div>

                            {/* Nút gọi điện & Zalo nhanh trong modal */}
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <a
                                    href={`tel:${(phieuDangXem.so_dien_thoai || '').replace(/\D/g, '')}`}
                                    className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm shadow-emerald-500/20"
                                >
                                    <Phone className="w-4 h-4 fill-white" />
                                    <span>Gọi Khách Ngay</span>
                                </a>
                                <a
                                    href={`https://zalo.me/${(phieuDangXem.so_dien_thoai || '').replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm shadow-blue-500/20"
                                >
                                    <MessageSquare className="w-4 h-4 fill-white" />
                                    <span>Mở Chat Zalo</span>
                                </a>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-2.5">
                            <button
                                type="button"
                                onClick={() => setPhieuDangXem(null)}
                                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                onClick={xuLyLuuModal}
                                disabled={dangLuuGhiChu}
                                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-blue-500/25 cursor-pointer disabled:opacity-60"
                            >
                                {dangLuuGhiChu ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 stroke-[3]" />}
                                <span>Lưu Thay Đổi</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
