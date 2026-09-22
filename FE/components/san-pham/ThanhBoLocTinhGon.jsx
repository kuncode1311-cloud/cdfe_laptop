'use client';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    SlidersHorizontal, Check, ShieldCheck, DollarSign,
    Cpu, Layers, ArrowUpDown, X, RotateCcw, LayoutGrid,
    ListFilter, ChevronDown, Tag
} from 'lucide-react';
import BrandLogo from './BrandLogo';

/**
 * Thanh Bộ Lọc Tinh Gọn 1 Dòng (Single Row Smart Filter Bar)
 * - Không bị trùng lặp danh mục
 * - Tự động lọc thương hiệu phù hợp (Laptop hoặc Phụ kiện)
 * - Đầy đủ các bộ lọc Dropdown nhanh: Hãng, Giá, CPU, GPU, Trả góp 0%, Sắp xếp
 */
export default function ThanhBoLocTinhGon({
    boLocHienTai,
    onThayDoiBoLoc,
    onMoBoLocToanDien,
    soLuongDangLoc = 0,
    tatCaSanPham = [],
    tongKetQua = 0,
    cheDoHienThi = 'luoi',
    onThayDoiCheDoHienThi = () => { },
    onDatLaiBoLoc = () => { }
}) {
    const [dropdownMo, setDropdownMo] = useState(null);
    const dropdownRef = useRef(null);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownMo(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Thống kê số lượng
    const thongKe = useMemo(() => {
        const demHang = {};
        const demCpu = {};
        const demGpu = {};

        (tatCaSanPham || []).forEach(sp => {
            if (!sp) return;
            if (sp.hang_san_xuat) {
                const h = sp.hang_san_xuat.toLowerCase();
                demHang[h] = (demHang[h] || 0) + 1;
            }
            const cpuStr = (sp.thong_so?.cpu || '').toLowerCase();
            if (cpuStr.includes('ultra')) demCpu['core_ultra'] = (demCpu['core_ultra'] || 0) + 1;
            else if (cpuStr.includes('i9')) demCpu['core_i9'] = (demCpu['core_i9'] || 0) + 1;
            else if (cpuStr.includes('i7')) demCpu['core_i7'] = (demCpu['core_i7'] || 0) + 1;
            else if (cpuStr.includes('i5')) demCpu['core_i5'] = (demCpu['core_i5'] || 0) + 1;
            else if (cpuStr.includes('ryzen') || cpuStr.includes('amd')) demCpu['ryzen'] = (demCpu['ryzen'] || 0) + 1;
            else if (cpuStr.includes('apple') || cpuStr.includes('m3') || cpuStr.includes('m2') || cpuStr.includes('m1')) {
                demCpu['apple_m'] = (demCpu['apple_m'] || 0) + 1;
            }

            const gpuStr = (sp.thong_so?.card_do_hoa || '').toLowerCase();
            if (gpuStr.includes('4090')) demGpu['rtx_4090'] = (demGpu['rtx_4090'] || 0) + 1;
            else if (gpuStr.includes('4080')) demGpu['rtx_4080'] = (demGpu['rtx_4080'] || 0) + 1;
            else if (gpuStr.includes('4070')) demGpu['rtx_4070'] = (demGpu['rtx_4070'] || 0) + 1;
            else if (gpuStr.includes('4060')) demGpu['rtx_4060'] = (demGpu['rtx_4060'] || 0) + 1;
            else if (gpuStr.includes('4050')) demGpu['rtx_4050'] = (demGpu['rtx_4050'] || 0) + 1;
            else if (gpuStr.includes('arc') || gpuStr.includes('intel') || gpuStr.includes('gpu')) {
                demGpu['card_onboard'] = (demGpu['card_onboard'] || 0) + 1;
            }
        });

        return { demHang, demCpu, demGpu };
    }, [tatCaSanPham]);

    // Nhận diện đang xem Phụ kiện hay Laptop
    const laDangXemPhuKien = boLocHienTai.danh_muc?.some(d =>
        ['balo-tui-chong-soc', 'ban-phim-co', 'chuot-lot-chuot', 'tai-nghe-loa', 'sac-cap-hub', 'linh-kien-nang-cap'].includes(d)
    );

    // Danh sách Hãng tương ứng
    const danhSachHang = useMemo(() => {
        if (laDangXemPhuKien) {
            return [
                { ma: 'logitech', ten: 'Logitech', count: thongKe.demHang['logitech'] || 0 },
                { ma: 'razer', ten: 'Razer', count: thongKe.demHang['razer'] || 0 },
                { ma: 'keychron', ten: 'Keychron', count: thongKe.demHang['keychron'] || 0 },
                { ma: 'anker', ten: 'Anker', count: thongKe.demHang['anker'] || 0 },
                { ma: 'samsung', ten: 'Samsung', count: thongKe.demHang['samsung'] || 0 },
                { ma: 'kingston', ten: 'Kingston', count: thongKe.demHang['kingston'] || 0 },
                { ma: 'tomtoc', ten: 'Tomtoc', count: thongKe.demHang['tomtoc'] || 0 }
            ];
        }
        return [
            { ma: 'asus', ten: 'ASUS', count: thongKe.demHang['asus'] || 0 },
            { ma: 'apple', ten: 'MacBook', count: thongKe.demHang['apple'] || 0 },
            { ma: 'hp', ten: 'HP', count: thongKe.demHang['hp'] || 0 },
            { ma: 'dell', ten: 'DELL', count: thongKe.demHang['dell'] || 0 },
            { ma: 'lenovo', ten: 'Lenovo', count: thongKe.demHang['lenovo'] || 0 },
            { ma: 'acer', ten: 'Acer', count: thongKe.demHang['acer'] || 0 },
            { ma: 'msi', ten: 'MSI', count: thongKe.demHang['msi'] || 0 },
            { ma: 'gigabyte', ten: 'GIGABYTE', count: thongKe.demHang['gigabyte'] || 0 }
        ];
    }, [laDangXemPhuKien, thongKe.demHang]);

    // Các khoảng giá
    const cacKhoangGia = [
        { nhan: 'Tất cả mức giá', min: undefined, max: undefined },
        { nhan: 'Dưới 15 Triệu', min: 0, max: 15000000 },
        { nhan: 'Từ 15 - 25 Triệu', min: 15000000, max: 25000000 },
        { nhan: 'Từ 25 - 50 Triệu', min: 25000000, max: 50000000 },
        { nhan: 'Trên 50 Triệu', min: 50000000, max: undefined }
    ];

    // CPU & GPU
    const cacDongCPU = [
        { ma: 'core_ultra', nhan: 'Intel Core Ultra', count: thongKe.demCpu['core_ultra'] || 0 },
        { ma: 'core_i9', nhan: 'Intel Core i9', count: thongKe.demCpu['core_i9'] || 0 },
        { ma: 'core_i7', nhan: 'Intel Core i7', count: thongKe.demCpu['core_i7'] || 0 },
        { ma: 'core_i5', nhan: 'Intel Core i5', count: thongKe.demCpu['core_i5'] || 0 },
        { ma: 'ryzen', nhan: 'AMD Ryzen', count: thongKe.demCpu['ryzen'] || 0 },
        { ma: 'apple_m', nhan: 'Apple Silicon (M)', count: thongKe.demCpu['apple_m'] || 0 }
    ];

    const cacDongGPU = [
        { ma: 'rtx_4090', nhan: 'NVIDIA RTX 4090', count: thongKe.demGpu['rtx_4090'] || 0 },
        { ma: 'rtx_4080', nhan: 'NVIDIA RTX 4080', count: thongKe.demGpu['rtx_4080'] || 0 },
        { ma: 'rtx_4070', nhan: 'NVIDIA RTX 4070', count: thongKe.demGpu['rtx_4070'] || 0 },
        { ma: 'rtx_4060', nhan: 'NVIDIA RTX 4060', count: thongKe.demGpu['rtx_4060'] || 0 },
        { ma: 'rtx_4050', nhan: 'NVIDIA RTX 4050', count: thongKe.demGpu['rtx_4050'] || 0 },
        { ma: 'card_onboard', nhan: 'Card Onboard/Iris', count: thongKe.demGpu['card_onboard'] || 0 }
    ];

    // Toggle Hãng
    const toggleHang = (maHang) => {
        const ds = boLocHienTai.hang_san_xuat || [];
        const moi = ds.includes(maHang) ? ds.filter(h => h !== maHang) : [...ds, maHang];
        onThayDoiBoLoc({ ...boLocHienTai, hang_san_xuat: moi });
    };

    // Chọn Giá
    const chonGia = (min, max) => {
        onThayDoiBoLoc({
            ...boLocHienTai,
            muc_gia_toi_thieu: min,
            muc_gia_toi_da: max
        });
        setDropdownMo(null);
    };

    // Toggle CPU & GPU
    const toggleCPU = (maCpu) => {
        const ds = boLocHienTai.cpu_dong || [];
        const moi = ds.includes(maCpu) ? ds.filter(c => c !== maCpu) : [...ds, maCpu];
        onThayDoiBoLoc({ ...boLocHienTai, cpu_dong: moi });
    };

    const toggleGPU = (maGpu) => {
        const ds = boLocHienTai.card_do_hoa || [];
        const moi = ds.includes(maGpu) ? ds.filter(g => g !== maGpu) : [...ds, maGpu];
        onThayDoiBoLoc({ ...boLocHienTai, card_do_hoa: moi });
    };

    // Nhãn giá
    const nhanGiaHienTai = useMemo(() => {
        const min = boLocHienTai.muc_gia_toi_thieu;
        const max = boLocHienTai.muc_gia_toi_da;
        if (min === undefined && max === undefined) return null;
        if (min === 0 && max === 15000000) return '< 15 Triệu';
        if (min === 15000000 && max === 25000000) return '15 - 25 Triệu';
        if (min === 25000000 && max === 50000000) return '25 - 50 Triệu';
        if (min === 50000000 && max === undefined) return '> 50 Triệu';
        return `${min ? min / 1000000 + 'Tr' : '0'} - ${max ? max / 1000000 + 'Tr' : '∞'}`;
    }, [boLocHienTai.muc_gia_toi_thieu, boLocHienTai.muc_gia_toi_da]);

    return (
        <div ref={dropdownRef} className="w-full bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200/90 dark:border-slate-800 p-3 shadow-xs space-y-2.5">
            {/* HÀNG BỘ LỌC CHÍNH 1 DÒNG DUY NHẤT */}
            <div className="flex flex-wrap items-center justify-between gap-2 relative">
                <div className="flex flex-wrap items-center gap-2">
                    {/* Nút Drawer Tất Cả Bộ Lọc */}
                    <button
                        onClick={onMoBoLocToanDien}
                        className={`h-9 px-3.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border-2 ${
                            soLuongDangLoc > 0
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-slate-900 text-white dark:bg-slate-800 border-slate-900 dark:border-slate-700 hover:bg-blue-600 hover:border-blue-600'
                        }`}
                        title="Mở toàn bộ bộ lọc chuyên sâu"
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Bộ lọc</span>
                        {soLuongDangLoc > 0 && (
                            <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                                {soLuongDangLoc}
                            </span>
                        )}
                    </button>

                    {/* SELECT 1: THƯƠNG HIỆU */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownMo(dropdownMo === 'hang' ? null : 'hang')}
                            className={`h-9 px-3 rounded-xl text-xs font-bold border-2 flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                                boLocHienTai.hang_san_xuat?.length > 0
                                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-cyan-300 font-black'
                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 hover:border-blue-400'
                            }`}
                        >
                            <Tag className="w-3.5 h-3.5 text-blue-600" />
                            <span>
                                {boLocHienTai.hang_san_xuat?.length > 0
                                    ? `Hãng: ${boLocHienTai.hang_san_xuat.map(h => h.toUpperCase()).join(', ')}`
                                    : 'Thương hiệu'}
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownMo === 'hang' ? 'rotate-180' : ''}`} />
                        </button>

                        {dropdownMo === 'hang' && (
                            <div className="absolute left-0 top-11 z-30 w-72 p-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl space-y-2 animate-in fade-in zoom-in-95 duration-150">
                                <div className="flex items-center justify-between text-xs font-black text-slate-800 dark:text-white pb-1 border-b border-slate-100 dark:border-slate-800">
                                    <span>Chọn thương hiệu ({danhSachHang.length})</span>
                                    {boLocHienTai.hang_san_xuat?.length > 0 && (
                                        <button
                                            onClick={() => onThayDoiBoLoc({ ...boLocHienTai, hang_san_xuat: [] })}
                                            className="text-[11px] text-red-500 font-bold hover:underline cursor-pointer"
                                        >
                                            Bỏ chọn
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                                    {danhSachHang.map((th) => {
                                        const dangChon = boLocHienTai.hang_san_xuat?.includes(th.ma);
                                        return (
                                            <button
                                                key={th.ma}
                                                onClick={() => toggleHang(th.ma)}
                                                className={`p-2 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                                                    dangChon
                                                        ? 'bg-blue-50 border-blue-600 text-blue-700 dark:bg-blue-950 dark:text-cyan-300'
                                                        : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-1.5 truncate">
                                                    <BrandLogo brand={th.ma} className="h-3.5 w-auto" active={dangChon} />
                                                    <span className="truncate text-[11px]">{th.ten}</span>
                                                </div>
                                                {dangChon && <Check className="w-3 h-3 text-blue-600 stroke-[3]" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SELECT 2: KHOẢNG GIÁ */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownMo(dropdownMo === 'gia' ? null : 'gia')}
                            className={`h-9 px-3 rounded-xl text-xs font-bold border-2 flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                                nhanGiaHienTai
                                    ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 font-black'
                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 hover:border-amber-400'
                            }`}
                        >
                            <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                            <span>{nhanGiaHienTai ? `Giá: ${nhanGiaHienTai}` : 'Khoảng giá'}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownMo === 'gia' ? 'rotate-180' : ''}`} />
                        </button>

                        {dropdownMo === 'gia' && (
                            <div className="absolute left-0 top-11 z-30 w-56 p-2 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl space-y-1 animate-in fade-in zoom-in-95 duration-150">
                                {cacKhoangGia.map((kg, idx) => {
                                    const laChon = boLocHienTai.muc_gia_toi_thieu === kg.min && boLocHienTai.muc_gia_toi_da === kg.max;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => chonGia(kg.min, kg.max)}
                                            className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                                                laChon
                                                    ? 'bg-amber-500 text-white font-black'
                                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            <span>{kg.nhan}</span>
                                            {laChon && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* SELECT 3: DÒNG CPU (Ẩn khi xem phụ kiện) */}
                    {!laDangXemPhuKien && (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownMo(dropdownMo === 'cpu' ? null : 'cpu')}
                                className={`h-9 px-3 rounded-xl text-xs font-bold border-2 flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                                    boLocHienTai.cpu_dong?.length > 0
                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 font-black'
                                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 hover:border-indigo-400'
                                }`}
                            >
                                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                                <span>
                                    {boLocHienTai.cpu_dong?.length > 0
                                        ? `CPU (${boLocHienTai.cpu_dong.length})`
                                        : 'Vi xử lý CPU'}
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownMo === 'cpu' ? 'rotate-180' : ''}`} />
                            </button>

                            {dropdownMo === 'cpu' && (
                                <div className="absolute left-0 top-11 z-30 w-64 p-2 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl space-y-1 animate-in fade-in zoom-in-95 duration-150">
                                    {cacDongCPU.map((cpu) => {
                                        const dangChon = boLocHienTai.cpu_dong?.includes(cpu.ma);
                                        return (
                                            <button
                                                key={cpu.ma}
                                                onClick={() => toggleCPU(cpu.ma)}
                                                className={`w-full py-1.5 px-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                                                    dangChon
                                                        ? 'bg-indigo-500 text-white font-black'
                                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                                }`}
                                            >
                                                <span>{cpu.nhan}</span>
                                                <span className="text-[10px] opacity-80">({cpu.count})</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* SELECT 4: CARD ĐỒ HỌA GPU (Ẩn khi xem phụ kiện) */}
                    {!laDangXemPhuKien && (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownMo(dropdownMo === 'gpu' ? null : 'gpu')}
                                className={`h-9 px-3 rounded-xl text-xs font-bold border-2 flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                                    boLocHienTai.card_do_hoa?.length > 0
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 font-black'
                                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 hover:border-emerald-400'
                                }`}
                            >
                                <Layers className="w-3.5 h-3.5 text-emerald-500" />
                                <span>
                                    {boLocHienTai.card_do_hoa?.length > 0
                                        ? `GPU (${boLocHienTai.card_do_hoa.length})`
                                        : 'Card đồ họa'}
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownMo === 'gpu' ? 'rotate-180' : ''}`} />
                            </button>

                            {dropdownMo === 'gpu' && (
                                <div className="absolute left-0 top-11 z-30 w-64 p-2 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl space-y-1 animate-in fade-in zoom-in-95 duration-150">
                                    {cacDongGPU.map((gpu) => {
                                        const dangChon = boLocHienTai.card_do_hoa?.includes(gpu.ma);
                                        return (
                                            <button
                                                key={gpu.ma}
                                                onClick={() => toggleGPU(gpu.ma)}
                                                className={`w-full py-1.5 px-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                                                    dangChon
                                                        ? 'bg-emerald-500 text-white font-black'
                                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                                }`}
                                            >
                                                <span>{gpu.nhan}</span>
                                                <span className="text-[10px] opacity-80">({gpu.count})</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Toggle Trả Góp 0% */}
                    <button
                        onClick={() => onThayDoiBoLoc({ ...boLocHienTai, ho_tro_tra_gop_0: !boLocHienTai.ho_tro_tra_gop_0 })}
                        className={`h-9 px-3 rounded-xl font-black text-xs border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                            boLocHienTai.ho_tro_tra_gop_0
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                        }`}
                    >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Trả góp 0%</span>
                        {boLocHienTai.ho_tro_tra_gop_0 && <Check className="w-3 h-3 stroke-[3.5]" />}
                    </button>
                </div>

                {/* Cụm Bên Phải: Sắp xếp & Chế độ xem */}
                <div className="flex items-center gap-2 ml-auto">
                    <div className="flex items-center gap-1">
                        <span className="text-slate-400 font-bold text-xs hidden lg:inline flex items-center gap-1">
                            <ArrowUpDown className="w-3 h-3" />
                        </span>
                        <select
                            value={boLocHienTai.sap_xep || 'moi_nhat'}
                            onChange={(e) => onThayDoiBoLoc({ ...boLocHienTai, sap_xep: e.target.value })}
                            className="h-8.5 pl-2.5 pr-6 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                            <option value="moi_nhat">Mới nhất</option>
                            <option value="ban_chay_nhat">Bán chạy nhất</option>
                            <option value="gia_tang_dan">Giá: Thấp đến Cao</option>
                            <option value="gia_giam_dan">Giá: Cao đến Thấp</option>
                            <option value="giam_gia_nhieu_nhat">% Giảm sốc</option>
                            <option value="danh_gia_cao">Đánh giá 5★</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-0.5 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => onThayDoiCheDoHienThi('luoi')}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                cheDoHienThi === 'luoi'
                                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                            title="Chế độ xem lưới"
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => onThayDoiCheDoHienThi('danh_sach')}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                cheDoHienThi === 'danh_sach'
                                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                            title="Chế độ xem danh sách"
                        >
                            <ListFilter className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* DẢI TAGS ĐANG LỌC */}
            {soLuongDangLoc > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-slate-500 font-bold text-[11px] mr-1">Đang lọc:</span>

                    {boLocHienTai.tu_khoa && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 font-bold text-[11px] border border-blue-200">
                            &quot;{boLocHienTai.tu_khoa}&quot;
                            <X className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => onThayDoiBoLoc({ ...boLocHienTai, tu_khoa: '' })} />
                        </span>
                    )}

                    {boLocHienTai.hang_san_xuat?.map(h => (
                        <span key={h} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-black uppercase text-[11px] border border-blue-200">
                            {h}
                            <X className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => toggleHang(h)} />
                        </span>
                    ))}

                    {nhanGiaHienTai && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-700 font-black text-[11px] border border-amber-200">
                            Giá: {nhanGiaHienTai}
                            <X className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => onThayDoiBoLoc({ ...boLocHienTai, muc_gia_toi_thieu: undefined, muc_gia_toi_da: undefined })} />
                        </span>
                    )}

                    {boLocHienTai.cpu_dong?.map(c => (
                        <span key={c} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-black text-[11px] border border-indigo-200">
                            CPU: {c.replace('_', ' ')}
                            <X className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => toggleCPU(c)} />
                        </span>
                    ))}

                    {boLocHienTai.card_do_hoa?.map(g => (
                        <span key={g} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-black text-[11px] border border-emerald-200">
                            GPU: {g.replace('_', ' ')}
                            <X className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => toggleGPU(g)} />
                        </span>
                    ))}

                    {boLocHienTai.ho_tro_tra_gop_0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-black text-[11px] border border-emerald-200">
                            Trả góp 0%
                            <X className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => onThayDoiBoLoc({ ...boLocHienTai, ho_tro_tra_gop_0: false })} />
                        </span>
                    )}

                    <button
                        onClick={onDatLaiBoLoc}
                        className="text-[11px] font-bold text-red-600 hover:text-red-700 cursor-pointer flex items-center gap-1 ml-auto transition-colors"
                    >
                        <RotateCcw className="w-3 h-3" />
                        <span>Xóa lọc ({soLuongDangLoc})</span>
                    </button>
                </div>
            )}
        </div>
    );
}
