'use client';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    SlidersHorizontal, Check, ShieldCheck, DollarSign,
    Cpu, Layers, ArrowUpDown, X, RotateCcw, LayoutGrid,
    ListFilter, ChevronDown, Tag
} from 'lucide-react';
import { useThongKeBoLoc } from './useThongKeBoLoc';

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

    // Thống kê lấy từ DB, đếm theo bộ lọc đang chọn, mục hết hàng tự ẩn
    const thongKe = useThongKeBoLoc(boLocHienTai, tatCaSanPham);
    const danhSachHang = thongKe.danhSachHang;
    const cacDongCPU = thongKe.cpu;
    const cacDongGPU = thongKe.gpu;

    // Các khoảng giá
    const cacKhoangGia = [
        { nhan: 'Tất cả mức giá', min: undefined, max: undefined },
        { nhan: 'Dưới 15 Triệu', min: 0, max: 15000000 },
        { nhan: 'Từ 15 - 25 Triệu', min: 15000000, max: 25000000 },
        { nhan: 'Từ 25 - 50 Triệu', min: 25000000, max: 50000000 },
        { nhan: 'Trên 50 Triệu', min: 50000000, max: undefined }
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
                                    ? `Hãng: ${boLocHienTai.hang_san_xuat.map(h => thongKe.tenHang(h)).join(', ')}`
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
                                                <span className="truncate text-[12px]">{th.ten}</span>
                                                <span className="text-[10px] text-slate-400 ml-1 shrink-0">{dangChon ? <Check className="w-3 h-3 text-blue-600 stroke-[3]" /> : th.soLuong}</span>
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
                    {cacDongCPU.length > 0 && (
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
                                                <span className="text-[10px] opacity-80">({cpu.soLuong})</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* SELECT 4: CARD ĐỒ HỌA GPU (Ẩn khi xem phụ kiện) */}
                    {cacDongGPU.length > 0 && (
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
                                                <span className="text-[10px] opacity-80">({gpu.soLuong})</span>
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
                        <span key={h} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-black text-[11px] border border-blue-200">
                            {thongKe.tenHang(h)}
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
