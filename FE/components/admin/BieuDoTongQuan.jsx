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
    ResponsiveContainer
} from 'recharts';
import {
    TrendingUp,
    Calendar,
    PieChart as PieIcon,
    BarChart3,
    ShoppingBag,
    Info,
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

// Helper chuẩn hóa timestamp từ đơn hàng (hỗ trợ ISO, chuỗi DD/MM/YYYY, HH:mm DD/MM/YYYY, HH:mm:ss DD/M/YYYY...)
export const layTimestampDonHang = (dh) => {
    if (!dh) return 0;
    const val = dh.createdAt || dh.ngay_tao || dh.ngayTao || dh.updatedAt;
    if (!val) return 0;
    if (typeof val === 'number') return val;
    if (val instanceof Date) return isNaN(val.getTime()) ? 0 : val.getTime();
    if (typeof val === 'string') {
        const parsedIso = new Date(val);
        if (!isNaN(parsedIso.getTime()) && val.includes('-')) {
            return parsedIso.getTime();
        }
        const dateMatch = val.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (dateMatch) {
            const day = parseInt(dateMatch[1], 10);
            const month = parseInt(dateMatch[2], 10) - 1;
            const year = parseInt(dateMatch[3], 10);
            const timeMatch = val.match(/(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/);
            const hour = timeMatch ? parseInt(timeMatch[1], 10) : 0;
            const minute = timeMatch ? parseInt(timeMatch[2], 10) : 0;
            const second = timeMatch && timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;
            const d = new Date(year, month, day, hour, minute, second);
            if (!isNaN(d.getTime())) return d.getTime();
        }
        if (!isNaN(parsedIso.getTime())) return parsedIso.getTime();
    }
    return 0;
};

// Tooltip Tùy Chỉnh Cho Biểu Đồ Doanh Thu & Đơn Hàng
const CustomTooltipDoanhThu = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const itemInfo = payload[0]?.payload;
        return (
            <div className="p-3.5 rounded-2xl bg-slate-900/95 text-white dark:bg-slate-950/95 border border-slate-700/60 shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[200px]">
                <div className="font-extrabold text-slate-300 pb-1 border-b border-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>{itemInfo?.ngayHienThi || label}</span>
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

// Tooltip Cho Biểu Đồ Tròn (Hỗ trợ cả chế độ Mẫu hàng & Doanh số theo kỳ)
const CustomTooltipTron = ({ active, payload, kieuXem = 'kho' }) => {
    if (active && payload && payload.length) {
        const item = payload[0];
        return (
            <div className="p-3 rounded-2xl bg-slate-900/95 text-white border border-slate-700/60 shadow-xl backdrop-blur-md text-xs space-y-1">
                <div className="font-black flex items-center gap-2" style={{ color: item.payload.fill }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.payload.fill }} />
                    {item.name}
                </div>
                <div className="text-slate-300 text-[11px]">
                    {kieuXem === 'doanh_thu' ? (
                        <>Doanh thu: <span className="font-bold text-white">{Number(item.value || 0).toLocaleString('vi-VN')} ₫</span></>
                    ) : (
                        <>Số lượng mẫu: <span className="font-bold text-white">{item.value} sản phẩm</span></>
                    )}
                </div>
                <div className="text-slate-300 text-[11px]">
                    Tỷ lệ: <span className="font-bold text-emerald-400">{item.payload.phanTram}%</span>
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
    xacDinhLoaiSanPham = () => 'laptop',
    khungThoiGian: propKhungThoiGian,
    setKhungThoiGian: propSetKhungThoiGian
}) {
    const [daMount, setDaMount] = useState(false);
    const [khungThoiGianLocal, setKhungThoiGianLocal] = useState('7_ngay'); // '7_ngay' | '4_tuan' | '6_thang' | 'tat_ca'
    const [kieuXemNganhHang, setKieuXemNganhHang] = useState('kho'); // 'kho' | 'doanh_thu'
    const [dangLocKhungThoiGian, setDangLocKhungThoiGian] = useState(false);
    const daMountKhungThoiGianRef = React.useRef(false);

    // Đồng bộ khung thời gian từ props nếu có hoặc dùng local state
    const khungThoiGian = propKhungThoiGian !== undefined ? propKhungThoiGian : khungThoiGianLocal;
    const thayDoiKhungThoiGian = (gt) => {
        if (propSetKhungThoiGian) propSetKhungThoiGian(gt);
        else setKhungThoiGianLocal(gt);
    };

    useEffect(() => {
        setDaMount(true);
    }, []);

    useEffect(() => {
        if (!daMountKhungThoiGianRef.current) {
            daMountKhungThoiGianRef.current = true;
            return;
        }
        setDangLocKhungThoiGian(true);
        const timer = setTimeout(() => setDangLocKhungThoiGian(false), 250);
        return () => clearTimeout(timer);
    }, [khungThoiGian]);

    // Nhãn hiển thị của khung thời gian
    const tenKhungThoiGian = useMemo(() => {
        switch (khungThoiGian) {
            case '7_ngay':
                return '7 Ngày';
            case '4_tuan':
                return '4 Tuần';
            case '6_thang':
                return '6 Tháng';
            case 'tat_ca':
                return 'Tất Cả';
            default:
                return 'Kỳ này';
        }
    }, [khungThoiGian]);

    // Mốc thời gian chính xác theo khung được chọn
    const khoangThoiGian = useMemo(() => {
        const homNay = new Date();
        const mocKetThuc = new Date(homNay.getFullYear(), homNay.getMonth(), homNay.getDate(), 23, 59, 59, 999);

        if (khungThoiGian === '7_ngay') {
            const mocBatDau = new Date(homNay.getFullYear(), homNay.getMonth(), homNay.getDate() - 6, 0, 0, 0, 0);
            return { mocBatDau, mocKetThuc };
        }

        if (khungThoiGian === '4_tuan') {
            const mocBatDau = new Date(homNay.getFullYear(), homNay.getMonth(), homNay.getDate() - 27, 0, 0, 0, 0);
            return { mocBatDau, mocKetThuc };
        }

        if (khungThoiGian === '6_thang') {
            const mocBatDau = new Date(homNay.getFullYear(), homNay.getMonth() - 5, 1, 0, 0, 0, 0);
            return { mocBatDau, mocKetThuc };
        }

        // 'tat_ca': Toàn bộ lịch sử
        return { mocBatDau: new Date(0), mocKetThuc: new Date(3000, 0, 1) };
    }, [khungThoiGian]);

    // 1. Thống kê realtime toàn bộ số liệu theo đúng kỳ lọc (Doanh thu kỳ này, Đã thực thu, Tỷ lệ thành công, v.v.)
    const thongKeKyNay = useMemo(() => {
        const { mocBatDau, mocKetThuc } = khoangThoiGian;
        const batDauTs = mocBatDau.getTime();
        const ketThucTs = mocKetThuc.getTime();

        const donTrongKy = (danhSachDonHang || []).filter((dh) => {
            if (khungThoiGian === 'tat_ca') return true;
            const ts = layTimestampDonHang(dh);
            return ts >= batDauTs && ts <= ketThucTs;
        });

        const donHopLe = donTrongKy.filter(dh => dh.trang_thai !== 'da_huy');
        const tongDoanhThu = donHopLe.reduce((sum, dh) => sum + (Number(dh.tong_tien_thanh_toan) || 0), 0);

        const donThanhCong = donTrongKy.filter(dh => dh.trang_thai === 'da_giao');
        const doanhThuThanhCong = donThanhCong.reduce((sum, dh) => sum + (Number(dh.tong_tien_thanh_toan) || 0), 0);

        const tongDon = donTrongKy.length;
        const soDonThanhCong = donThanhCong.length;
        const tyLeThanhCong = tongDon > 0 ? Math.round((soDonThanhCong / tongDon) * 100) : 0;

        const donChoXacNhan = donTrongKy.filter(dh => dh.trang_thai === 'cho_xac_nhan').length;
        const donDaXacNhan = donTrongKy.filter(dh => dh.trang_thai === 'da_xac_nhan').length;
        const donDangGiao = donTrongKy.filter(dh => dh.trang_thai === 'dang_giao').length;
        const donDaHuy = donTrongKy.filter(dh => dh.trang_thai === 'da_huy').length;

        return {
            donTrongKy,
            tongDon,
            tongDoanhThu,
            doanhThuThanhCong,
            soDonThanhCong,
            tyLeThanhCong,
            donChoXacNhan,
            donDaXacNhan,
            donDangGiao,
            donDaHuy
        };
    }, [danhSachDonHang, khoangThoiGian, khungThoiGian]);

    // 2. Dữ liệu các điểm vẽ trên biểu đồ sóng theo khung thời gian
    const duLieuDoanhThu = useMemo(() => {
        const donHopLe = (danhSachDonHang || []).filter((dh) => dh.trang_thai !== 'da_huy');
        const layTongTien = (dh) => Number(dh.tong_tien_thanh_toan) || 0;
        const homNay = new Date();

        if (khungThoiGian === '7_ngay') {
            const ketQua = [];
            for (let i = 6; i >= 0; i--) {
                const ngayDau = new Date(homNay.getFullYear(), homNay.getMonth(), homNay.getDate() - i, 0, 0, 0, 0);
                const ngayCuoi = new Date(homNay.getFullYear(), homNay.getMonth(), homNay.getDate() - i, 23, 59, 59, 999);
                const donTrongNgay = donHopLe.filter((dh) => {
                    const t = layTimestampDonHang(dh);
                    return t >= ngayDau.getTime() && t <= ngayCuoi.getTime();
                });
                const thu = ngayDau.toLocaleDateString('vi-VN', { weekday: 'short' });
                const ngayThang = `${String(ngayDau.getDate()).padStart(2, '0')}/${String(ngayDau.getMonth() + 1).padStart(2, '0')}`;
                ketQua.push({
                    thoiGian: ngayThang,
                    ngayHienThi: `${thu}, ${ngayThang}/${ngayDau.getFullYear()}`,
                    doanhThu: donTrongNgay.reduce((tong, dh) => tong + layTongTien(dh), 0),
                    soDon: donTrongNgay.length
                });
            }
            return ketQua;
        }

        if (khungThoiGian === '4_tuan') {
            const ketQua = [];
            for (let i = 3; i >= 0; i--) {
                const tuanDau = new Date(homNay.getFullYear(), homNay.getMonth(), homNay.getDate() - i * 7 - 6, 0, 0, 0, 0);
                const tuanCuoi = new Date(homNay.getFullYear(), homNay.getMonth(), homNay.getDate() - i * 7, 23, 59, 59, 999);
                const donTrongTuan = donHopLe.filter((dh) => {
                    const t = layTimestampDonHang(dh);
                    return t >= tuanDau.getTime() && t <= tuanCuoi.getTime();
                });
                const nhanDau = `${String(tuanDau.getDate()).padStart(2, '0')}/${String(tuanDau.getMonth() + 1).padStart(2, '0')}`;
                const nhanCuoi = `${String(tuanCuoi.getDate()).padStart(2, '0')}/${String(tuanCuoi.getMonth() + 1).padStart(2, '0')}`;
                ketQua.push({
                    thoiGian: `Tuần ${4 - i}`,
                    ngayHienThi: `Tuần ${4 - i} (${nhanDau} - ${nhanCuoi})`,
                    doanhThu: donTrongTuan.reduce((tong, dh) => tong + layTongTien(dh), 0),
                    soDon: donTrongTuan.length
                });
            }
            return ketQua;
        }

        if (khungThoiGian === '6_thang') {
            const ketQua = [];
            for (let i = 5; i >= 0; i--) {
                const thangDau = new Date(homNay.getFullYear(), homNay.getMonth() - i, 1, 0, 0, 0, 0);
                const thangCuoi = new Date(homNay.getFullYear(), homNay.getMonth() - i + 1, 0, 23, 59, 59, 999);
                const donTrongThang = donHopLe.filter((dh) => {
                    const t = layTimestampDonHang(dh);
                    return t >= thangDau.getTime() && t <= thangCuoi.getTime();
                });
                ketQua.push({
                    thoiGian: `Thg ${thangDau.getMonth() + 1}`,
                    ngayHienThi: `Tháng ${thangDau.getMonth() + 1}/${thangDau.getFullYear()}`,
                    doanhThu: donTrongThang.reduce((tong, dh) => tong + layTongTien(dh), 0),
                    soDon: donTrongThang.length
                });
            }
            return ketQua;
        }

        // 'tat_ca': Lịch sử từ đơn đầu tiên đến nay theo tháng
        let minTs = homNay.getTime();
        donHopLe.forEach(dh => {
            const t = layTimestampDonHang(dh);
            if (t > 0 && t < minTs) minTs = t;
        });
        const minDate = new Date(minTs);
        const batDauThang = new Date(minDate.getFullYear(), minDate.getMonth(), 1, 0, 0, 0, 0);
        const ketQua = [];
        let cur = new Date(batDauThang);
        while (cur <= homNay) {
            const thangDau = new Date(cur.getFullYear(), cur.getMonth(), 1, 0, 0, 0, 0);
            const thangCuoi = new Date(cur.getFullYear(), cur.getMonth() + 1, 0, 23, 59, 59, 999);
            const donTrongThang = donHopLe.filter((dh) => {
                const t = layTimestampDonHang(dh);
                return t >= thangDau.getTime() && t <= thangCuoi.getTime();
            });
            ketQua.push({
                thoiGian: `T${thangDau.getMonth() + 1}/${String(thangDau.getFullYear()).slice(-2)}`,
                ngayHienThi: `Tháng ${thangDau.getMonth() + 1}/${thangDau.getFullYear()}`,
                doanhThu: donTrongThang.reduce((tong, dh) => tong + layTongTien(dh), 0),
                soDon: donTrongThang.length
            });
            cur.setMonth(cur.getMonth() + 1);
        }
        return ketQua.length > 0 ? ketQua : [{
            thoiGian: 'Hiện tại',
            ngayHienThi: 'Toàn thời gian',
            doanhThu: 0,
            soDon: 0
        }];
    }, [khungThoiGian, danhSachDonHang]);

    // 3. Dữ liệu cơ cấu 7 ngành hàng: hỗ trợ cả xem theo Mẫu hàng trong kho HOẶC Doanh số theo kỳ lọc
    const duLieuNganhHang = useMemo(() => {
        if (kieuXemNganhHang === 'doanh_thu') {
            const doanhThuTheoNganh = {
                laptop: 0,
                ban_phim: 0,
                chuot: 0,
                balo: 0,
                tai_nghe: 0,
                sac_hub: 0,
                linh_kien: 0,
            };

            const donHopLe = (thongKeKyNay.donTrongKy || []).filter(dh => dh.trang_thai !== 'da_huy');
            donHopLe.forEach(dh => {
                (dh.danh_sach_san_pham || []).forEach(item => {
                    const sp = item.san_pham || (danhSachSanPham || []).find(s => (s.id || s._id) === (item.san_pham_id || item.id_muc)) || {};
                    const loai = xacDinhLoaiSanPham(sp);
                    const gia = Number(item.tong_tien_muc || (item.gia || item.gia_hien_tai || 0) * (item.so_luong || 1)) || 0;
                    if (doanhThuTheoNganh[loai] !== undefined) {
                        doanhThuTheoNganh[loai] += gia;
                    } else {
                        doanhThuTheoNganh.laptop += gia;
                    }
                });
            });

            const tongDoanhThuNganh = Object.values(doanhThuTheoNganh).reduce((a, b) => a + b, 0) || 1;
            const items = Object.entries(doanhThuTheoNganh).map(([key, val]) => ({
                key,
                name: TEN_NGANH_HANG[key] || key,
                value: val,
                phanTram: Math.round((val / tongDoanhThuNganh) * 100),
                fill: MAU_NGANH_HANG[key] || '#94a3b8'
            })).filter(i => i.value > 0);

            return items.length > 0 ? items : [{
                key: 'chua_co',
                name: 'Chưa có doanh thu',
                value: 1,
                phanTram: 100,
                fill: '#94a3b8'
            }];
        }

        // Mặc định: cơ cấu mẫu sản phẩm trong kho
        const counts = {
            laptop: 0,
            ban_phim: 0,
            chuot: 0,
            balo: 0,
            tai_nghe: 0,
            sac_hub: 0,
            linh_kien: 0,
        };

        (danhSachSanPham || []).forEach(sp => {
            const loai = xacDinhLoaiSanPham(sp);
            if (counts[loai] !== undefined) counts[loai]++;
            else counts.laptop++;
        });

        const tong = (danhSachSanPham || []).length || 1;
        return Object.entries(counts).map(([key, val]) => ({
            key,
            name: TEN_NGANH_HANG[key] || key,
            value: val,
            phanTram: Math.round((val / tong) * 100),
            fill: MAU_NGANH_HANG[key] || '#94a3b8'
        })).filter(i => i.value > 0);
    }, [kieuXemNganhHang, danhSachSanPham, thongKeKyNay.donTrongKy, xacDinhLoaiSanPham]);

    // 4. Dữ liệu phân phối trạng thái đơn hàng (tính chuẩn xác theo kỳ lọc hiện tại)
    const duLieuTrangThaiDon = useMemo(() => {
        const tongDon = thongKeKyNay.tongDon || 1;
        const tt = [
            {
                ten: 'Chờ xác nhận',
                soLuong: thongKeKyNay.donChoXacNhan || 0,
                mau: '#f59e0b',
                bg: 'bg-amber-500'
            },
            {
                ten: 'Đã xác nhận',
                soLuong: thongKeKyNay.donDaXacNhan || 0,
                mau: '#3b82f6',
                bg: 'bg-blue-500'
            },
            {
                ten: 'Đang giao hàng',
                soLuong: thongKeKyNay.donDangGiao || 0,
                mau: '#8b5cf6',
                bg: 'bg-purple-500'
            },
            {
                ten: 'Giao thành công',
                soLuong: thongKeKyNay.soDonThanhCong || 0,
                mau: '#10b981',
                bg: 'bg-emerald-500'
            },
            {
                ten: 'Đã hủy đơn',
                soLuong: thongKeKyNay.donDaHuy || 0,
                mau: '#ef4444',
                bg: 'bg-red-500'
            },
        ];
        return tt.map(item => ({
            ...item,
            phanTram: thongKeKyNay.tongDon > 0 ? Math.round((item.soLuong / tongDon) * 100) : 0
        }));
    }, [thongKeKyNay]);

    // 5. Dữ liệu Top Thương Hiệu (Doanh số & Tồn kho)
    const duLieuThuongHieu = useMemo(() => {
        const mapHang = {};
        (danhSachSanPham || []).forEach(sp => {
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
                                    Theo dõi thời gian thực dòng tiền và số lượng đơn hàng phát sinh
                                </p>
                            </div>

                            {/* Bộ Lọc Khung Thời Gian Realtime */}
                            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-xs font-black shadow-2xs">
                                <button
                                    onClick={() => thayDoiKhungThoiGian('7_ngay')}
                                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${khungThoiGian === '7_ngay' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}`}
                                >
                                    7 Ngày
                                </button>
                                <button
                                    onClick={() => thayDoiKhungThoiGian('4_tuan')}
                                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${khungThoiGian === '4_tuan' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}`}
                                >
                                    4 Tuần
                                </button>
                                <button
                                    onClick={() => thayDoiKhungThoiGian('6_thang')}
                                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${khungThoiGian === '6_thang' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}`}
                                >
                                    6 Tháng
                                </button>
                                <button
                                    onClick={() => thayDoiKhungThoiGian('tat_ca')}
                                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${khungThoiGian === 'tat_ca' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}`}
                                >
                                    Tất Cả
                                </button>
                            </div>
                        </div>

                        {/* Thông số nhanh đầu biểu đồ (3 Hộp Thống Kê Realtime Đậm Màu Sắc Nét theo đúng Bộ Lọc) */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
                            <div className="p-3.5 rounded-2xl bg-blue-50/90 dark:bg-blue-950/50 border-2 border-blue-300 dark:border-blue-700 shadow-2xs">
                                <div className="flex items-center justify-between">
                                    <div className="text-[11px] font-black text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                                        Doanh thu kỳ này
                                    </div>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-200/80 dark:bg-blue-900 text-blue-900 dark:text-blue-200 font-black">
                                        {tenKhungThoiGian}
                                    </span>
                                </div>
                                <div className="text-base sm:text-xl font-black text-blue-700 dark:text-cyan-300 mt-1">
                                    {dinhDangTienVND(thongKeKyNay.tongDoanhThu)}
                                </div>
                                <div className="text-[11px] text-blue-900/80 dark:text-cyan-400 font-semibold mt-1">
                                    {thongKeKyNay.tongDon} đơn hàng phát sinh
                                </div>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/50 border-2 border-emerald-300 dark:border-emerald-700 shadow-2xs">
                                <div className="flex items-center justify-between">
                                    <div className="text-[11px] font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                                        Đã thu thực tế
                                    </div>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-black">
                                        {tenKhungThoiGian}
                                    </span>
                                </div>
                                <div className="text-base sm:text-xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                                    {dinhDangTienVND(thongKeKyNay.doanhThuThanhCong)}
                                </div>
                                <div className="text-[11px] text-emerald-900/80 dark:text-emerald-400 font-semibold mt-1">
                                    {thongKeKyNay.soDonThanhCong} đơn giao thành công
                                </div>
                            </div>

                            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-700 shadow-2xs">
                                <div className="flex items-center justify-between">
                                    <div className="text-[11px] font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                                        Tỷ lệ thành công
                                    </div>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-black">
                                        {tenKhungThoiGian}
                                    </span>
                                </div>
                                <div className="text-base sm:text-xl font-black text-amber-700 dark:text-amber-400 mt-1">
                                    {thongKeKyNay.tyLeThanhCong}%
                                </div>
                                <div className="text-[11px] text-amber-900/80 dark:text-amber-400 font-semibold mt-1">
                                    {thongKeKyNay.soDonThanhCong}/{thongKeKyNay.tongDon || 0} đơn hoàn tất
                                </div>
                            </div>
                        </div>

                        {/* Ghi chú trực quan khi kỳ lọc hiện tại chưa phát sinh đơn mới */}
                        {thongKeKyNay.tongDon === 0 && (
                            <div className="mb-2 p-2.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-300">
                                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                                <span>Chưa có đơn hàng trong <strong>{tenKhungThoiGian}</strong> gần nhất. Hãy chọn <strong>4 Tuần</strong>, <strong>6 Tháng</strong> hoặc <strong>Tất Cả</strong> để đối chiếu dữ liệu giao dịch.</span>
                            </div>
                        )}
                    </div>

                    {/* VÙNG VẼ RECHARTS AREA */}
                    <div className="relative w-full h-72 pt-2">
                        {dangLocKhungThoiGian && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 dark:bg-[#0d1527]/85 backdrop-blur-[2px] rounded-2xl animate-in fade-in duration-150">
                                <div className="w-10 h-10 rounded-full border-[3px] border-blue-600/20 border-t-blue-600 animate-spin" />
                                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-2">
                                    Đang tính toán lại xu hướng ({tenKhungThoiGian})...
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
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/25">
                                    <PieIcon className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                                        CƠ CẤU 7 NGÀNH HÀNG
                                    </h3>
                                    <p className="text-[11px] text-slate-500 font-semibold">
                                        {kieuXemNganhHang === 'kho' ? 'Tỷ trọng mẫu hàng trong kho' : `Doanh số theo kỳ (${tenKhungThoiGian})`}
                                    </p>
                                </div>
                            </div>

                            {/* Tab chuyển đổi xem Mẫu kho vs Doanh số kỳ này */}
                            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-black">
                                <button
                                    onClick={() => setKieuXemNganhHang('kho')}
                                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${kieuXemNganhHang === 'kho' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'}`}
                                    title="Xem tỷ trọng số lượng mẫu hàng"
                                >
                                    Kho
                                </button>
                                <button
                                    onClick={() => setKieuXemNganhHang('doanh_thu')}
                                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${kieuXemNganhHang === 'doanh_thu' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'}`}
                                    title="Xem doanh thu theo ngành hàng trong kỳ lọc"
                                >
                                    Doanh Số
                                </button>
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
                                    <Tooltip content={<CustomTooltipTron kieuXem={kieuXemNganhHang} />} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Trung tâm biểu đồ tròn */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
                                <span className="text-lg font-black text-slate-900 dark:text-white truncate max-w-[120px]">
                                    {kieuXemNganhHang === 'kho'
                                        ? (danhSachSanPham || []).length
                                        : `${Math.round(thongKeKyNay.tongDoanhThu / 1000000)}Tr`}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    {kieuXemNganhHang === 'kho' ? 'Mẫu Hàng' : 'Doanh Thu Kỳ'}
                                </span>
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
                                    <span className="text-slate-500 font-semibold">
                                        {kieuXemNganhHang === 'doanh_thu'
                                            ? dinhDangTienVND(item.value)
                                            : `${item.value} sp`}
                                    </span>
                                    <span className="text-slate-900 dark:text-white font-extrabold w-8 text-right">{item.phanTram}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* HÀNG 2: TIẾN ĐỘ XỬ LÝ ĐƠN HÀNG & TỒN KHO THEO THƯƠNG HIỆU */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 2.1 TRẠNG THÁI XỬ LÝ ĐƠN HÀNG (TIẾN ĐỘ & PHỄU CẬP NHẬT REALTIME THEO KỲ) */}
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
                                <p className="text-[11px] text-slate-500 font-semibold">
                                    Phân luồng trạng thái đơn hàng trong kỳ ({tenKhungThoiGian})
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-cyan-300 text-xs font-black border border-blue-200 dark:border-blue-800">
                                Kỳ này: {thongKeKyNay.tongDon} đơn
                            </span>
                            <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                                (Toàn sàn: {thongKe.tongDonHang || 0})
                            </span>
                        </div>
                    </div>

                    {/* Danh Sách Thanh Tiến Độ Đẹp Mắt Cập Nhật Theo Kỳ Lọc */}
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
                                        style={{ width: `${Math.max(tt.soLuong > 0 ? 6 : 0, tt.phanTram)}%` }}
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
