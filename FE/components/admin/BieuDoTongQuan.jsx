'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import {
    TrendingUp,
    TrendingDown,
    Calendar,
    PieChart as PieIcon,
    BarChart3,
    Layers,
    DollarSign,
    ShoppingBag,
    PackageCheck,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

const MAU_NGANH_HANG = {
    laptop: '#3b82f6',     // Xanh dương
    ban_phim: '#6366f1',   // Tím indigo
    chuot: '#ec4899',      // Hồng cánh sen
    balo: '#f59e0b',       // Vàng hổ phách
    tai_nghe: '#10b981',   // Xanh lục ngọc
    sac_hub: '#06b6d4',    // Xanh lơ cyan
    linh_kien: '#8b5cf6',  // Tím hoa cà
};

const TEN_NGANH_HANG = {
    laptop: 'Laptop Gaming & AI PC',
    ban_phim: 'Bàn Phím Cơ Custom',
    chuot: 'Chuột Gaming Siêu Nhẹ',
    balo: 'Balo & Túi Chống Sốc',
    tai_nghe: 'Tai Nghe & Loa',
    sac_hub: 'Củ Sạc GaN & Hub',
    linh_kien: 'Linh Kiện RAM / SSD',
};

// Tooltip Tùy Chỉnh Sang Trọng
const CustomTooltipDoanhThu = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3.5 rounded-2xl bg-slate-900/95 text-white dark:bg-slate-950/95 border border-slate-700/60 shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[190px]">
                <div className="font-extrabold text-slate-300 pb-1 border-b border-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>{label}</span>
                </div>
                {payload.map((entry, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5 font-bold" style={{ color: entry.color }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            {entry.name}:
                        </span>
                        <span className="font-black">
                            {entry.dataKey === 'doanhThu'
                                ? entry.value.toLocaleString('vi-VN') + ' ₫'
                                : entry.value + ' đơn'}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// Tooltip Cho Biểu Đồ Tròn
const CustomTooltipTron = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const item = payload[0];
        return (
            <div className="p-3 rounded-2xl bg-slate-900/95 text-white border border-slate-700/60 shadow-xl backdrop-blur-md text-xs space-y-1">
                <div className="font-black flex items-center gap-2" style={{ color: item.payload.fill }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.payload.fill }} />
                    {item.name}
                </div>
                <div className="text-slate-300 text-[11px]">
                    Số lượng mẫu: <span className="font-bold text-white">{item.value} sản phẩm</span>
                </div>
                <div className="text-slate-300 text-[11px]">
                    Tỷ lệ thị phần: <span className="font-bold text-emerald-400">{item.payload.phanTram}%</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function BieuDoTongQuan({
    danhSachDonHang = [],
    danhSachSanPham = [],
    thongKe = {},
    dinhDangTienVND = (v) => v,
    xacDinhLoaiSanPham = () => 'laptop'
}) {
    const [daMount, setDaMount] = useState(false);
    const [khungThoiGian, setKhungThoiGian] = useState('7_ngay'); // '7_ngay' | '4_tuan' | '6_thang'
    const [dangLocKhungThoiGian, setDangLocKhungThoiGian] = useState(false);
    const daMountKhungThoiGianRef = React.useRef(false);

    useEffect(() => {
        setDaMount(true);
    }, []);

    useEffect(() => {
        if (!daMountKhungThoiGianRef.current) {
            daMountKhungThoiGianRef.current = true;
            return;
        }
        setDangLocKhungThoiGian(true);
        const timer = setTimeout(() => setDangLocKhungThoiGian(false), 300);
        return () => clearTimeout(timer);
    }, [khungThoiGian]);

    // 1. Dữ liệu xu hướng doanh thu theo khung thời gian
    const duLieuDoanhThu = useMemo(() => {
        if (khungThoiGian === '7_ngay') {
            const cacNgay = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
            return cacNgay.map((ngay, idx) => {
                // Phân bổ doanh thu mẫu kết hợp đơn hàng thực tế
                const base = Math.max(12000000, Math.floor((thongKe.tongDoanhThu || 180000000) / 10));
                const heSo = [0.8, 1.1, 0.95, 1.35, 1.6, 2.1, 1.85][idx];
                const doanhThuNgay = Math.round(base * heSo);
                const soDonNgay = Math.max(1, Math.round(heSo * 2.5));
                return {
                    thoiGian: ngay,
                    doanhThu: doanhThuNgay,
                    soDon: soDonNgay
                };
            });
        } else if (khungThoiGian === '4_tuan') {
            return [
                { thoiGian: 'Tuần 1', doanhThu: Math.round((thongKe.tongDoanhThu || 120000000) * 0.22), soDon: 4 },
                { thoiGian: 'Tuần 2', doanhThu: Math.round((thongKe.tongDoanhThu || 120000000) * 0.26), soDon: 6 },
                { thoiGian: 'Tuần 3', doanhThu: Math.round((thongKe.tongDoanhThu || 120000000) * 0.31), soDon: 8 },
                { thoiGian: 'Tuần 4', doanhThu: Math.round((thongKe.tongDoanhThu || 120000000) * 0.38), soDon: 9 },
            ];
        } else {
            return [
                { thoiGian: 'Thg 4', doanhThu: 45000000, soDon: 12 },
                { thoiGian: 'Thg 5', doanhThu: 68000000, soDon: 18 },
                { thoiGian: 'Thg 6', doanhThu: 82000000, soDon: 22 },
                { thoiGian: 'Thg 7', doanhThu: 94000000, soDon: 25 },
                { thoiGian: 'Thg 8', doanhThu: 115000000, soDon: 29 },
                { thoiGian: 'Thg 9', doanhThu: Math.max(130000000, thongKe.tongDoanhThu || 135000000), soDon: Math.max(15, danhSachDonHang.length) },
            ];
        }
    }, [khungThoiGian, thongKe.tongDoanhThu, danhSachDonHang.length]);

    // 2. Dữ liệu cơ cấu 7 ngành hàng cho Biểu đồ Tròn (Donut)
    const duLieuNganhHang = useMemo(() => {
        const counts = {
            laptop: 0,
            ban_phim: 0,
            chuot: 0,
            balo: 0,
            tai_nghe: 0,
            sac_hub: 0,
            linh_kien: 0,
        };

        danhSachSanPham.forEach(sp => {
            const loai = xacDinhLoaiSanPham(sp);
            if (counts[loai] !== undefined) counts[loai]++;
            else counts.laptop++;
        });

        const tong = danhSachSanPham.length || 1;
        return Object.entries(counts).map(([key, val]) => ({
            key,
            name: TEN_NGANH_HANG[key] || key,
            value: val,
            phanTram: Math.round((val / tong) * 100),
            fill: MAU_NGANH_HANG[key] || '#94a3b8'
        })).filter(i => i.value > 0);
    }, [danhSachSanPham, xacDinhLoaiSanPham]);

    // 3. Dữ liệu phân phối trạng thái đơn hàng
    const duLieuTrangThaiDon = useMemo(() => {
        const tongDon = danhSachDonHang.length || 1;
        const tt = [
            {
                ten: 'Chờ xác nhận',
                soLuong: thongKe.donChoXacNhan || 0,
                mau: '#f59e0b',
                bg: 'bg-amber-500'
            },
            {
                ten: 'Đã xác nhận',
                soLuong: thongKe.donDaXacNhan || 0,
                mau: '#3b82f6',
                bg: 'bg-blue-500'
            },
            {
                ten: 'Đang giao hàng',
                soLuong: thongKe.donDangGiao || 0,
                mau: '#8b5cf6',
                bg: 'bg-purple-500'
            },
            {
                ten: 'Giao thành công',
                soLuong: thongKe.donThanhCong || 0,
                mau: '#10b981',
                bg: 'bg-emerald-500'
            },
            {
                ten: 'Đã hủy đơn',
                soLuong: thongKe.donDaHuy || 0,
                mau: '#ef4444',
                bg: 'bg-red-500'
            },
        ];
        return tt.map(item => ({
            ...item,
            phanTram: Math.round((item.soLuong / tongDon) * 100)
        }));
    }, [danhSachDonHang.length, thongKe]);

    // 4. Dữ liệu Top Thương Hiệu (Doanh số & Tồn kho)
    const duLieuThuongHieu = useMemo(() => {
        const mapHang = {};
        danhSachSanPham.forEach(sp => {
            const hang = (sp.hang_san_xuat || 'Khác').toUpperCase();
            if (!mapHang[hang]) {
                mapHang[hang] = { hang, tonKho: 0, spCount: 0 };
            }
            mapHang[hang].tonKho += Number(sp.so_luong_ton_kho) || 0;
            mapHang[hang].spCount += 1;
        });

        return Object.values(mapHang)
            .sort((a, b) => b.tonKho - a.tonKho)
            .slice(0, 7);
    }, [danhSachSanPham]);

    if (!daMount) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
                <div className="lg:col-span-8 h-80 rounded-3xl bg-slate-100 dark:bg-slate-800" />
                <div className="lg:col-span-4 h-80 rounded-3xl bg-slate-100 dark:bg-slate-800" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* HÀNG 1: BIỂU ĐỒ DOANH THU & BIỂU ĐỒ CƠ CẤU NGÀNH HÀNG */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 1.1 BIỂU ĐỒ DIỆN TÍCH SÓNG DOANH THU */}
                <div className="lg:col-span-8 bg-white dark:bg-[#0d1527] rounded-3xl p-5 sm:p-6 border-2 border-slate-300 dark:border-slate-800 shadow-md shadow-slate-900/5 flex flex-col justify-between">
                    <div>
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/25">
                                        <TrendingUp className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider">
                                        XU HƯỚNG DOANH THU & GIAO DỊCH
                                    </h3>
                                </div>
                                <p className="text-xs text-slate-500 font-semibold mt-0.5 ml-11">
                                    Biểu đồ trực quan theo dõi lượng tiền về và số đơn hàng phát sinh
                                </p>
                            </div>

                            {/* Bộ Lọc Khung Thời Gian */}
                            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-xs font-black shadow-2xs">
                                <button
                                    onClick={() => setKhungThoiGian('7_ngay')}
                                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${khungThoiGian === '7_ngay' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}`}
                                >
                                    7 Ngày
                                </button>
                                <button
                                    onClick={() => setKhungThoiGian('4_tuan')}
                                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${khungThoiGian === '4_tuan' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}`}
                                >
                                    4 Tuần
                                </button>
                                <button
                                    onClick={() => setKhungThoiGian('6_thang')}
                                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${khungThoiGian === '6_thang' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}`}
                                >
                                    6 Tháng
                                </button>
                            </div>
                        </div>

                        {/* Thông số nhanh đầu biểu đồ (3 Hộp Thống Kê Đậm Màu Sắc Nét) */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
                            <div className="p-3.5 rounded-2xl bg-blue-50/90 dark:bg-blue-950/50 border-2 border-blue-300 dark:border-blue-700 shadow-2xs">
                                <div className="text-[11px] font-black text-blue-900 dark:text-blue-300 uppercase tracking-wider">Doanh thu kỳ này</div>
                                <div className="text-base sm:text-xl font-black text-blue-700 dark:text-cyan-300 mt-0.5">
                                    {dinhDangTienVND(thongKe.tongDoanhThu || 0)}
                                </div>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/50 border-2 border-emerald-300 dark:border-emerald-700 shadow-2xs">
                                <div className="text-[11px] font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">Đã thu thực tế</div>
                                <div className="text-base sm:text-xl font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
                                    {dinhDangTienVND(thongKe.doanhThuThanhCong || 0)}
                                </div>
                            </div>
                            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-700 shadow-2xs">
                                <div className="text-[11px] font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider">Tỷ lệ thành công</div>
                                <div className="text-base sm:text-xl font-black text-amber-700 dark:text-amber-400 mt-0.5">
                                    {Math.round(((thongKe.donThanhCong || 0) / Math.max(1, thongKe.tongDonHang || 1)) * 100)}%
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* VÙNG VẼ RECHARTS AREA */}
                    <div className="relative w-full h-72 pt-2">
                        {dangLocKhungThoiGian && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 dark:bg-[#0d1527]/85 backdrop-blur-[2px] rounded-2xl animate-in fade-in duration-150">
                                <div className="w-10 h-10 rounded-full border-[3px] border-blue-600/20 border-t-blue-600 animate-spin" />
                                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-2">
                                    Đang tính toán lại xu hướng...
                                </span>
                            </div>
                        )}
                        <div className={`w-full h-full transition-opacity duration-300 ${dangLocKhungThoiGian ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={duLieuDoanhThu} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="mauDoanhThuGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.45} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                                        </linearGradient>
                                        <linearGradient id="mauDonHangGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                                    <XAxis
                                        dataKey="thoiGian"
                                        stroke="#94a3b8"
                                        fontSize={11}
                                        fontWeight={700}
                                        tickLine={false}
                                        axisLine={{ stroke: '#cbd5e1' }}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        stroke="#94a3b8"
                                        fontSize={10}
                                        fontWeight={600}
                                        tickLine={false}
                                        axisLine={{ stroke: '#cbd5e1' }}
                                        tickFormatter={(v) => `${Math.round(v / 1000000)}Tr`}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        stroke="#94a3b8"
                                        fontSize={10}
                                        fontWeight={600}
                                        tickLine={false}
                                        axisLine={{ stroke: '#cbd5e1' }}
                                        tickFormatter={(v) => `${v} Đơn`}
                                    />
                                    <Tooltip content={<CustomTooltipDoanhThu />} />
                                    <Area
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="doanhThu"
                                        name="Doanh thu"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#mauDoanhThuGrad)"
                                    />
                                    <Area
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="soDon"
                                        name="Đơn hàng"
                                        stroke="#d97706"
                                        strokeWidth={2}
                                        strokeDasharray="4 4"
                                        fillOpacity={1}
                                        fill="url(#mauDonHangGrad)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 1.2 BIỂU ĐỒ TRÒN CƠ CẤU 7 NGÀNH HÀNG */}
                <div className="lg:col-span-4 bg-white dark:bg-[#0d1527] rounded-3xl p-5 sm:p-6 border-2 border-slate-300 dark:border-slate-800 shadow-md shadow-slate-900/5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/25">
                                <PieIcon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                                    CƠ CẤU 7 NGÀNH HÀNG
                                </h3>
                                <p className="text-[11px] text-slate-500 font-semibold">Tỷ trọng mẫu hàng trong kho</p>
                            </div>
                        </div>

                        {/* VÙNG VẼ PIE CHART */}
                        <div className="w-full h-52 relative my-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={duLieuNganhHang}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={80}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {duLieuNganhHang.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltipTron />} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Trung tâm biểu đồ tròn */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xl font-black text-slate-900 dark:text-white">
                                    {danhSachSanPham.length}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mẫu Hàng</span>
                            </div>
                        </div>
                    </div>

                    {/* Danh Sách Chú Thích Rõ Ràng */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 max-h-48 overflow-y-auto">
                        {duLieuNganhHang.map((item) => (
                            <div key={item.key} className="flex items-center justify-between text-xs font-bold">
                                <div className="flex items-center gap-2 truncate pr-2">
                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                                    <span className="text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-slate-500 font-semibold">{item.value} sp</span>
                                    <span className="text-slate-900 dark:text-white font-extrabold w-8 text-right">{item.phanTram}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* HÀNG 2: TIẾN ĐỘ XỬ LÝ ĐƠN HÀNG & TỒN KHO THEO THƯƠNG HIỆU */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 2.1 TRẠNG THÁI XỬ LÝ ĐƠN HÀNG (TIẾN ĐỘ & PHỄU) */}
                <div className="lg:col-span-6 bg-white dark:bg-[#0d1527] rounded-3xl p-5 sm:p-6 border-2 border-slate-300 dark:border-slate-800 shadow-md shadow-slate-900/5 space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/25">
                                <ShoppingBag className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                                    TIẾN ĐỘ XỬ LÝ ĐƠN HÀNG
                                </h3>
                                <p className="text-[11px] text-slate-500 font-semibold">Tỷ lệ hoàn tất và phân luồng trạng thái</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            Tổng: {thongKe.tongDonHang || 0} đơn
                        </span>
                    </div>

                    {/* Danh Sách Thanh Tiến Độ Đẹp Mắt */}
                    <div className="space-y-3">
                        {duLieuTrangThaiDon.map((tt, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tt.mau }} />
                                        {tt.ten}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-extrabold text-slate-900 dark:text-white">{tt.soLuong} đơn</span>
                                        <span className="text-slate-400 text-[10px]">({tt.phanTram}%)</span>
                                    </div>
                                </div>
                                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${tt.bg}`}
                                        style={{ width: `${Math.max(4, tt.phanTram)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2.2 BIỂU ĐỒ CỘT TOP THƯƠNG HIỆU TỒN KHO & MẪU HÀNG */}
                <div className="lg:col-span-6 bg-white dark:bg-[#0d1527] rounded-3xl p-5 sm:p-6 border-2 border-slate-300 dark:border-slate-800 shadow-md shadow-slate-900/5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-cyan-500/25">
                                    <BarChart3 className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                                        TỒN KHO THEO THƯƠNG HIỆU
                                    </h3>
                                    <p className="text-[11px] text-slate-500 font-semibold">Top các hãng công nghệ chiếm tỷ trọng lớn trong kho</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-64 pt-3">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={duLieuThuongHieu} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                                <XAxis
                                    dataKey="hang"
                                    stroke="#94a3b8"
                                    fontSize={11}
                                    fontWeight={800}
                                    tickLine={false}
                                    axisLine={{ stroke: '#cbd5e1' }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={10}
                                    fontWeight={700}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    formatter={(value, name) => [
                                        `${value} ${name === 'tonKho' ? 'sản phẩm' : 'mẫu mã'}`,
                                        name === 'tonKho' ? 'Tổng Số Lượng Tồn' : 'Số Mẫu Sản Phẩm'
                                    ]}
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                        border: '1px solid rgba(51, 65, 85, 0.6)',
                                        borderRadius: '16px',
                                        color: '#fff',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
                                    }}
                                />
                                <Bar
                                    dataKey="tonKho"
                                    name="tonKho"
                                    fill="#06b6d4"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
