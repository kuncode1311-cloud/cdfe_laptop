'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
    RotateCcw, X, SlidersHorizontal, Laptop, Cpu,
    Tag, DollarSign, ShieldCheck, Layers, Search
} from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function BoLocSanPhamComponent({
    mo = false,
    onDong = () => { },
    boLocHienTai,
    onThayDoiBoLoc,
    onDatLaiBoLoc,
    tatCaSanPham = [],
    tongKetQua = 0
}) {
    // Tìm kiếm nhanh hãng trong bảng lọc
    const [tuKhoaHang, setTuKhoaHang] = useState('');

    // Đóng khi nhấn phím ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && mo) {
                onDong();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mo, onDong]);

    // Khóa cuộn trang khi drawer đang mở
    useEffect(() => {
        if (mo) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mo]);

    // Tính toán số lượng sản phẩm theo từng tiêu chí
    const thongKe = useMemo(() => {
        const dem = {
            hang: {},
            danh_muc: {},
            gpu: {},
            cpu: {}
        };

        (tatCaSanPham || []).forEach(sp => {
            // Đếm hãng
            if (sp.hang_san_xuat) {
                const h = sp.hang_san_xuat.toLowerCase();
                dem.hang[h] = (dem.hang[h] || 0) + 1;
            }
            // Đếm danh mục
            (sp.danh_muc || []).forEach(dm => {
                dem.danh_muc[dm] = (dem.danh_muc[dm] || 0) + 1;
            });
            // Đếm GPU
            const gpuStr = (sp.thong_so?.card_do_hoa || '').toLowerCase();
            if (gpuStr.includes('4090')) dem.gpu['rtx_4090'] = (dem.gpu['rtx_4090'] || 0) + 1;
            else if (gpuStr.includes('4080')) dem.gpu['rtx_4080'] = (dem.gpu['rtx_4080'] || 0) + 1;
            else if (gpuStr.includes('4070')) dem.gpu['rtx_4070'] = (dem.gpu['rtx_4070'] || 0) + 1;
            else if (gpuStr.includes('4060')) dem.gpu['rtx_4060'] = (dem.gpu['rtx_4060'] || 0) + 1;
            else if (gpuStr.includes('4050')) dem.gpu['rtx_4050'] = (dem.gpu['rtx_4050'] || 0) + 1;
            else if (gpuStr.includes('arc') || gpuStr.includes('intel') || gpuStr.includes('gpu')) {
                dem.gpu['card_onboard'] = (dem.gpu['card_onboard'] || 0) + 1;
            }
            // Đếm CPU
            const cpuStr = (sp.thong_so?.cpu || '').toLowerCase();
            if (cpuStr.includes('ultra')) dem.cpu['core_ultra'] = (dem.cpu['core_ultra'] || 0) + 1;
            else if (cpuStr.includes('i9')) dem.cpu['core_i9'] = (dem.cpu['core_i9'] || 0) + 1;
            else if (cpuStr.includes('i7')) dem.cpu['core_i7'] = (dem.cpu['core_i7'] || 0) + 1;
            else if (cpuStr.includes('i5')) dem.cpu['core_i5'] = (dem.cpu['core_i5'] || 0) + 1;
            else if (cpuStr.includes('ryzen') || cpuStr.includes('amd')) dem.cpu['ryzen'] = (dem.cpu['ryzen'] || 0) + 1;
            else if (cpuStr.includes('apple') || cpuStr.includes('m3') || cpuStr.includes('m2') || cpuStr.includes('m1')) {
                dem.cpu['apple_m'] = (dem.cpu['apple_m'] || 0) + 1;
            }
        });

        return dem;
    }, [tatCaSanPham]);

    // Danh sách các hãng máy tính & phụ kiện
    const danhSachHang = useMemo(() => {
        const tenGoi = {
            asus: 'ASUS / ROG',
            apple: 'Apple MacBook',
            dell: 'Dell / Alienware',
            hp: 'HP OMEN / Pavilion',
            lenovo: 'Lenovo Legion',
            acer: 'Acer Predator',
            msi: 'MSI Gaming',
            gigabyte: 'GIGABYTE AORUS',
            logitech: 'Logitech G',
            razer: 'Razer Blade/Gear',
            keychron: 'Keychron Custom',
            anker: 'Anker Prime',
            samsung: 'Samsung PRO',
            kingston: 'Kingston FURY',
            tomtoc: 'Tomtoc',
            moft: 'MOFT Ergo',
            deepcool: 'Deepcool ICE'
        };

        const list = Object.keys(thongKe.hang).map(k => ({
            ma: k,
            ten: tenGoi[k] || k.toUpperCase(),
            soLuong: thongKe.hang[k] || 0
        }));

        if (tuKhoaHang.trim()) {
            const kw = tuKhoaHang.toLowerCase().trim();
            return list.filter(item => item.ten.toLowerCase().includes(kw) || item.ma.includes(kw));
        }

        return list;
    }, [thongKe.hang, tuKhoaHang]);

    // Helper toggle mảng
    const togglePhanTu = (khoa, giaTri) => {
        const hienTai = boLocHienTai[khoa] || [];
        const moi = hienTai.includes(giaTri)
            ? hienTai.filter(v => v !== giaTri)
            : [...hienTai, giaTri];
        onThayDoiBoLoc({ ...boLocHienTai, [khoa]: moi });
    };

    // Chọn giá
    const chonGia = (min, max) => {
        if (boLocHienTai.muc_gia_toi_thieu === min && boLocHienTai.muc_gia_toi_da === max) {
            onThayDoiBoLoc({ ...boLocHienTai, muc_gia_toi_thieu: undefined, muc_gia_toi_da: undefined });
        } else {
            onThayDoiBoLoc({ ...boLocHienTai, muc_gia_toi_thieu: min, muc_gia_toi_da: max });
        }
    };

    if (!mo) return null;

    return (
        <div className="fixed inset-0 z-[999] flex justify-end animate-in fade-in duration-200">
            {/* Backdrop làm mờ */}
            <div
                onClick={onDong}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            />

            {/* Khung Drawer Trượt Phải */}
            <div className="relative w-full max-w-xl h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-10 border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
                {/* 1. Header Drawer */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
                            <SlidersHorizontal className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wide">
                                Tất Cả Bộ Lọc
                            </h2>
                            <p className="text-xs text-slate-400">
                                Tìm kiếm chuẩn xác theo cấu hình &amp; nhu cầu
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onDong}
                        className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Đóng bộ lọc"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* 2. Body Cuộn Chứa Toàn Bộ Tiêu Chí Lọc */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
                    {/* Mục 1: Mức Giá Phù Hợp */}
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                            <DollarSign className="w-4 h-4 text-amber-500" />
                            <span>Mức Giá Phù Hợp</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[
                                { nhan: 'Tất cả giá', min: undefined, max: undefined },
                                { nhan: 'Dưới 15 Triệu', min: 0, max: 15000000 },
                                { nhan: '15 - 25 Triệu', min: 15000000, max: 25000000 },
                                { nhan: '25 - 50 Triệu', min: 25000000, max: 50000000 },
                                { nhan: '50 - 80 Triệu', min: 50000000, max: 80000000 },
                                { nhan: 'Trên 80 Triệu', min: 80000000, max: undefined }
                            ].map((g, idx) => {
                                const laChon = boLocHienTai.muc_gia_toi_thieu === g.min && boLocHienTai.muc_gia_toi_da === g.max;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => chonGia(g.min, g.max)}
                                        className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer truncate ${
                                            laChon
                                                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-400 shadow-2xs'
                                                : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-amber-300'
                                        }`}
                                    >
                                        {g.nhan}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mục 2: Thương Hiệu Có Logo Nhận Diện */}
                    <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                <Tag className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                                <span>Thương Hiệu Sản Phẩm ({danhSachHang.length})</span>
                            </div>
                            {boLocHienTai.hang_san_xuat?.length > 0 && (
                                <span className="text-[11px] font-bold text-blue-600">
                                    Đã chọn ({boLocHienTai.hang_san_xuat.length})
                                </span>
                            )}
                        </div>

                        {/* Ô tìm hãng */}
                        <div className="relative">
                            <input
                                type="text"
                                value={tuKhoaHang}
                                onChange={(e) => setTuKhoaHang(e.target.value)}
                                placeholder="Tìm nhanh thương hiệu..."
                                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500"
                            />
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            {tuKhoaHang && (
                                <X
                                    className="w-3.5 h-3.5 text-slate-400 hover:text-red-500 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                                    onClick={() => setTuKhoaHang('')}
                                />
                            )}
                        </div>

                        {/* Lưới các hãng kèm logo */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                            {danhSachHang.map((th) => {
                                const dangChon = boLocHienTai.hang_san_xuat?.includes(th.ma);
                                return (
                                    <button
                                        key={th.ma}
                                        onClick={() => togglePhanTu('hang_san_xuat', th.ma)}
                                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                                            dangChon
                                                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-cyan-300 shadow-2xs'
                                                : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-blue-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <BrandLogo brand={th.ma} className="h-3.5 w-auto shrink-0" active={dangChon} />
                                            <span className="truncate text-[11px]">{th.ten.split('/')[0].trim()}</span>
                                        </div>
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ml-1 shrink-0 ${
                                            dangChon ? 'bg-blue-600 text-white' : 'text-slate-400'
                                        }`}>
                                            {th.soLuong}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mục 3: Dòng Laptop Nhu Cầu & Linh Kiện */}
                    <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                            <Laptop className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span>Dòng Sản Phẩm &amp; Nhu Cầu</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                            {[
                                { ma: 'ai-pc', nhan: '⚡ Laptop AI 2026', count: thongKe.danh_muc['ai-pc'] || 0 },
                                { ma: 'gaming', nhan: '🎮 Laptop Gaming RTX', count: thongKe.danh_muc['gaming'] || 0 },
                                { ma: 'van-phong-mong-nhe', nhan: '✨ Mỏng Nhẹ - Doanh Nhân', count: thongKe.danh_muc['van-phong-mong-nhe'] || 0 },
                                { ma: 'do-hoa-sang-tao', nhan: '🎨 Đồ Họa 3D & Sáng Tạo', count: thongKe.danh_muc['do-hoa-sang-tao'] || 0 },
                                { ma: 'balo-tui-chong-soc', nhan: '🎒 Balo & Túi Chống Sốc', count: thongKe.danh_muc['balo-tui-chong-soc'] || 0 },
                                { ma: 'tai-nghe-loa', nhan: '🎧 Tai Nghe & Âm Thanh', count: thongKe.danh_muc['tai-nghe-loa'] || 0 },
                                { ma: 'chuot-lot-chuot', nhan: '🖱️ Chuột & Lót Chuột', count: thongKe.danh_muc['chuot-lot-chuot'] || 0 },
                                { ma: 'ban-phim-co', nhan: '⌨️ Bàn Phím Cơ Custom', count: thongKe.danh_muc['ban-phim-co'] || 0 },
                                { ma: 'sac-cap-hub', nhan: '⚡ Sạc GaN & Hub Chuyển', count: thongKe.danh_muc['sac-cap-hub'] || 0 },
                                { ma: 'linh-kien-nang-cap', nhan: '💾 Linh Kiện SSD / RAM', count: thongKe.danh_muc['linh-kien-nang-cap'] || 0 }
                            ].map((dm) => {
                                const dangChon = boLocHienTai.danh_muc?.includes(dm.ma);
                                return (
                                    <button
                                        key={dm.ma}
                                        onClick={() => togglePhanTu('danh_muc', dm.ma)}
                                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                                            dangChon
                                                ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-600 text-purple-700 dark:text-purple-300 shadow-2xs'
                                                : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-purple-300'
                                        }`}
                                    >
                                        <span className="truncate text-[11px]">{dm.nhan}</span>
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ml-1 shrink-0 ${
                                            dangChon ? 'bg-purple-600 text-white' : 'text-slate-400'
                                        }`}>
                                            {dm.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mục 4: Vi Xử Lý (CPU) */}
                    <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                            <Cpu className="w-4 h-4 text-indigo-500" />
                            <span>Dòng Vi Xử Lý (CPU)</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[
                                { ma: 'core_ultra', nhan: 'Intel Core Ultra', count: thongKe.cpu['core_ultra'] || 0 },
                                { ma: 'core_i9', nhan: 'Intel Core i9', count: thongKe.cpu['core_i9'] || 0 },
                                { ma: 'core_i7', nhan: 'Intel Core i7', count: thongKe.cpu['core_i7'] || 0 },
                                { ma: 'core_i5', nhan: 'Intel Core i5', count: thongKe.cpu['core_i5'] || 0 },
                                { ma: 'ryzen', nhan: 'AMD Ryzen', count: thongKe.cpu['ryzen'] || 0 },
                                { ma: 'apple_m', nhan: 'Apple M-Series', count: thongKe.cpu['apple_m'] || 0 }
                            ].map((cpu) => {
                                const dangChon = boLocHienTai.cpu_dong?.includes(cpu.ma);
                                return (
                                    <button
                                        key={cpu.ma}
                                        onClick={() => togglePhanTu('cpu_dong', cpu.ma)}
                                        className={`py-2 px-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                                            dangChon
                                                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                                                : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        <div className="text-[11px] truncate">{cpu.nhan}</div>
                                        {cpu.count > 0 && <span className="text-[9.5px] text-slate-400">({cpu.count})</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mục 5: Card Đồ Họa (GPU) */}
                    <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                            <Layers className="w-4 h-4 text-emerald-500" />
                            <span>Card Đồ Họa (GPU)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { ma: 'rtx_4090', nhan: 'RTX 4090', count: thongKe.gpu['rtx_4090'] || 0 },
                                { ma: 'rtx_4080', nhan: 'RTX 4080', count: thongKe.gpu['rtx_4080'] || 0 },
                                { ma: 'rtx_4070', nhan: 'RTX 4070', count: thongKe.gpu['rtx_4070'] || 0 },
                                { ma: 'rtx_4060', nhan: 'RTX 4060', count: thongKe.gpu['rtx_4060'] || 0 },
                                { ma: 'rtx_4050', nhan: 'RTX 4050', count: thongKe.gpu['rtx_4050'] || 0 },
                                { ma: 'card_onboard', nhan: 'Onboard/Iris', count: thongKe.gpu['card_onboard'] || 0 }
                            ].map((gpu) => {
                                const dangChon = boLocHienTai.card_do_hoa?.includes(gpu.ma);
                                return (
                                    <button
                                        key={gpu.ma}
                                        onClick={() => togglePhanTu('card_do_hoa', gpu.ma)}
                                        className={`py-2 px-1 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                                            dangChon
                                                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                                                : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        <div className="text-[11px] truncate">{gpu.nhan}</div>
                                        {gpu.count > 0 && <span className="text-[9.5px] text-slate-400">({gpu.count})</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mục 6: Dung lượng RAM */}
                    <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                            <span>Dung Lượng RAM</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { ma: '16gb', nhan: '16 GB' },
                                { ma: '32gb', nhan: '32 GB - 48 GB' },
                                { ma: '64gb', nhan: '64 GB - 128 GB' }
                            ].map((r) => {
                                const dangChon = boLocHienTai.ram_dung_luong?.includes(r.ma);
                                return (
                                    <button
                                        key={r.ma}
                                        onClick={() => togglePhanTu('ram_dung_luong', r.ma)}
                                        className={`py-2 px-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                                            dangChon
                                                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-cyan-300'
                                                : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        {r.nhan}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mục 7: Tiện ích & Ưu đãi */}
                    <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer select-none">
                            <span className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span>Ưu tiên sản phẩm hỗ trợ Trả Góp 0%</span>
                            </span>
                            <input
                                type="checkbox"
                                checked={!!boLocHienTai.ho_tro_tra_gop_0}
                                onChange={(e) => onThayDoiBoLoc({ ...boLocHienTai, ho_tro_tra_gop_0: e.target.checked })}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                        </label>
                    </div>
                </div>

                {/* 3. Footer Sticky: Đặt lại + Xem kết quả */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 flex items-center gap-3 shrink-0">
                    <button
                        onClick={onDatLaiBoLoc}
                        className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Thiết lập lại</span>
                    </button>

                    <button
                        onClick={onDong}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-[#0052cc] hover:bg-[#003da5] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                    >
                        <span>Xem {tongKetQua} sản phẩm</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
