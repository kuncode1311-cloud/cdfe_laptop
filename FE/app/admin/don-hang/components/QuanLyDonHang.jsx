'use client';
import {
    ShoppingBag,
    Clock,
    CheckCircle2,
    DollarSign,
    SlidersHorizontal,
    Plus,
    FileSpreadsheet,
    Filter,
    ChevronDown,
    CreditCard,
    Calendar,
    X,
    ArrowUpDown,
    RotateCcw,
    PackageCheck,
    Package,
    Phone,
    MapPin,
    ArrowUpRight,
    MessageSquare,
    Tag,
    QrCode,
    Banknote,
    Loader2,
    Truck,
    XCircle,
    Eye,
    Edit3,
    Trash2,
    Search
} from 'lucide-react';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import KhuVucDangTaiTable from '@/components/dieu-huong/KhuVucDangTaiTable';
import PhanTrangAdmin, { usePhanTrang } from '@/app/admin/components/shared/PhanTrangAdmin';

// Component Tab "Quản Lý Đơn Hàng" của trang quản trị: tách từ app/admin/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function QuanLyDonHang({
    danhSachDonHang,
    donHangHienThi,
    tuKhoaDonHang,
    setTuKhoaDonHang,
    locTrangThaiDonHang,
    setLocTrangThaiDonHang,
    locThanhToanDonHang,
    setLocThanhToanDonHang,
    locThoiGianDonHang,
    setLocThoiGianDonHang,
    locNgayCuThe,
    setLocNgayCuThe,
    sapXepDonHang,
    setSapXepDonHang,
    moModalTaoDonHang,
    xuatExcelDonHang,
    dangTai,
    dangLocDonHang,
    dangXuLyDonHangId,
    setDonHangChiTiet,
    xuLyDoiTrangThaiThanhToan,
    xuLyDoiTrangThaiDonHang,
    moModalSuaDonHang,
    xuLyXoaDonHang
}) {
    const donHangThongKe = donHangHienThi;

    const {
        trangHienTai,
        setTrangHienTai,
        soMucMoiTrang,
        setSoMucMoiTrang,
        tongSoTrang,
        tongSoMuc,
        viTriBatDau,
        danhSachTrenTrang
    } = usePhanTrang(donHangHienThi, 10, [
        locTrangThaiDonHang,
        locThanhToanDonHang,
        locThoiGianDonHang,
        locNgayCuThe,
        sapXepDonHang
    ]);

    return (
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
                            {donHangThongKe.length}
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
                            {donHangThongKe.filter(d => d.trang_thai === 'cho_xac_nhan' || d.trang_thai === 'da_xac_nhan' || d.trang_thai === 'dang_giao').length}
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
                            {donHangThongKe.filter(d => d.trang_thai === 'da_giao').length}
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
                            {dinhDangTienVND(donHangThongKe.reduce((sum, d) => sum + (Number(d.tong_tien_thanh_toan) || Number(d.tong_tien) || 0), 0))}
                        </span>
                    </div>
                    <div className="mt-1.5 flex items-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black bg-purple-600/15 text-purple-900 dark:text-purple-100 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400"></span>
                            <span>{donHangThongKe.filter(d => d.da_thanh_toan).length} đơn đã thanh toán</span>
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
                        {/* 0. Ô tìm kiếm nhanh theo mã đơn, tên khách, SĐT, địa chỉ */}
                        <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Tìm mã đơn, tên khách, SĐT..."
                                value={tuKhoaDonHang}
                                onChange={(e) => setTuKhoaDonHang(e.target.value)}
                                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            {tuKhoaDonHang && (
                                <button
                                    onClick={() => setTuKhoaDonHang('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

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
                        {(tuKhoaDonHang || locTrangThaiDonHang !== 'tat_ca' || locThanhToanDonHang !== 'tat_ca' || sapXepDonHang !== 'moi_nhat' || locThoiGianDonHang !== 'tat_ca' || locNgayCuThe) && (
                            <button
                                onClick={() => {
                                    setTuKhoaDonHang('');
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
                    <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black uppercase text-[11px] tracking-wider whitespace-nowrap">
                                <th className="py-2.5 px-2.5 w-36 sm:w-40 text-center whitespace-nowrap border-b-2 border-r border-slate-300 dark:border-slate-700">
                                    # MÃ ĐƠN
                                </th>
                                <th className="py-2.5 px-3 w-48 sm:w-56 whitespace-nowrap border-b-2 border-r border-slate-300 dark:border-slate-700">
                                    KHÁCH HÀNG
                                </th>
                                <th className="py-2.5 px-3 min-w-[180px] max-w-[260px] border-b-2 border-r border-slate-300 dark:border-slate-700">
                                    ĐỊA CHỈ & KIỆN HÀNG
                                </th>
                                <th className="py-2.5 px-2 w-32 whitespace-nowrap border-b-2 border-r border-slate-300 dark:border-slate-700">
                                    TỔNG TIỀN
                                </th>
                                <th className="py-2.5 px-2 w-40 whitespace-nowrap border-b-2 border-r border-slate-300 dark:border-slate-700">
                                    THANH TOÁN
                                </th>
                                <th className="py-2.5 px-2 w-40 whitespace-nowrap border-b-2 border-r border-slate-300 dark:border-slate-700">
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
                                danhSachTrenTrang.map((dh, idx) => {
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
                                    const soThuTu = viTriBatDau + idx + 1;
                                    const maHienThi = dh.ma_don_hang || `LPN-${String(soThuTu).padStart(4, '0')}`;
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
                                    const daHuy = dh.trang_thai_don_hang === 'da_huy' || dh.trangThai === 'da_huy';

                                    return (
                                        <tr
                                            key={donHangId}
                                            className={`transition-colors group ${
                                                daHuy
                                                    ? '!bg-rose-100/90 dark:!bg-rose-950/60 hover:!bg-rose-200/90 dark:hover:!bg-rose-900/70 border-l-4 border-l-rose-600 shadow-xs'
                                                    : 'odd:bg-white even:bg-slate-50/70 dark:odd:bg-[#0d1527] dark:even:bg-[#090f1d] hover:!bg-blue-50/80 dark:hover:!bg-blue-950/50'
                                            }`}
                                        >
                                            {/* Cột 1: Mã & Thứ tự */}
                                            <td className={`py-2.5 px-2.5 text-center whitespace-nowrap border-b border-r ${daHuy ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="flex items-center gap-1">
                                                        <span className={`px-1.5 py-0.5 rounded font-mono font-black text-[10px] shadow-2xs ${daHuy ? 'bg-rose-200 text-rose-900 border border-rose-300' : 'bg-slate-100 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>
                                                            #{soThuTu}
                                                        </span>
                                                        {daHuy && (
                                                            <span className="px-1 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-2xs">
                                                                ĐÃ HỦY
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => setDonHangChiTiet(dh)}
                                                        className={`text-[11px] font-mono font-bold hover:underline block mt-1 tracking-tight cursor-pointer whitespace-nowrap ${daHuy ? 'text-rose-800 dark:text-rose-300' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700'}`}
                                                        title="Bấm để xem chi tiết đơn hàng"
                                                    >
                                                        {maHienThi}
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Cột 2: Khách hàng */}
                                            <td className="py-2.5 px-3 border-b border-r border-slate-200 dark:border-slate-800">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${avatarBg} text-white font-black text-[11px] flex items-center justify-center shrink-0 shadow-2xs`}>
                                                        {initials}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate" title={tenKhach}>
                                                            {tenKhach}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                                            <Phone className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                                                            <a href={`tel:${dh.thong_tin_giao_hang?.so_dien_thoai}`} className="hover:text-blue-600 font-semibold truncate" title={dh.thong_tin_giao_hang?.so_dien_thoai}>
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
                                                <div className="min-w-0 max-w-[260px] space-y-1">
                                                    <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium text-xs leading-snug">
                                                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                                        <span className="truncate block" title={dh.thong_tin_giao_hang?.dia_chi_chi_tiet || 'Nhận trực tiếp tại showroom'}>
                                                            {dh.thong_tin_giao_hang?.dia_chi_chi_tiet || 'Nhận trực tiếp tại showroom'}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-1.5">
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
                                                {dh.trang_thai === 'da_huy' && dh.ly_do_huy && (
                                                    <div className="mt-1 text-[10px] font-semibold text-rose-700 dark:text-rose-300 leading-tight line-clamp-2" title={dh.ly_do_huy}>
                                                        {dh.nguoi_huy === 'khach' ? 'Khách hủy: ' : 'Lý do: '}{dh.ly_do_huy}
                                                    </div>
                                                )}
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
                                                        onClick={() => moModalSuaDonHang(dh)}
                                                        className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-600 text-amber-600 hover:text-white dark:bg-amber-950/60 dark:text-amber-400 dark:hover:bg-amber-600 dark:hover:text-white transition-all shadow-2xs hover:shadow-md cursor-pointer"
                                                        title="Sửa thông tin đơn hàng"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
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

                {/* Thanh Phân Trang Chuẩn */}
                <PhanTrangAdmin
                    trangHienTai={trangHienTai}
                    tongSoTrang={tongSoTrang}
                    tongSoMuc={tongSoMuc}
                    soMucMoiTrang={soMucMoiTrang}
                    onDoiTrang={setTrangHienTai}
                    onDoiSoMucMoiTrang={setSoMucMoiTrang}
                    nhanLoaiMuc="đơn hàng"
                />
            </div>
        </div>
    );
}
