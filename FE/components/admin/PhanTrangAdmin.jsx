'use client';

import React from 'react';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ListFilter
} from 'lucide-react';
export { usePhanTrang } from '@/hooks/usePhanTrang';

/**
 * Tính danh sách số trang thông minh có dấu '...' rút gọn
 */
function taoDanhSachTrangHienThi(trangHienTai, tongSoTrang) {
    if (tongSoTrang <= 7) {
        return Array.from({ length: tongSoTrang }, (_, i) => i + 1);
    }
    if (trangHienTai <= 4) {
        return [1, 2, 3, 4, 5, '...', tongSoTrang];
    }
    if (trangHienTai >= tongSoTrang - 3) {
        return [1, '...', tongSoTrang - 4, tongSoTrang - 3, tongSoTrang - 2, tongSoTrang - 1, tongSoTrang];
    }
    return [1, '...', trangHienTai - 1, trangHienTai, trangHienTai + 1, '...', tongSoTrang];
}

/**
 * Component Phân Trang Chuẩn — Giao Diện Xịn Đẹp Màu Sắc
 */
export default function PhanTrangAdmin({
    trangHienTai = 1,
    tongSoTrang = 1,
    tongSoMuc = 0,
    soMucMoiTrang = 10,
    onDoiTrang,
    onDoiSoMucMoiTrang,
    nhanLoaiMuc = 'bản ghi',
    tuyChonSoMuc = [10, 20, 50, 100],
    anKiemSoatSoMuc = false,
    className = ''
}) {
    if (tongSoMuc === 0) return null;

    const viTriBatDau = (trangHienTai - 1) * soMucMoiTrang + 1;
    const viTriKetThuc = Math.min(trangHienTai * soMucMoiTrang, tongSoMuc);
    const danhSachTrang = taoDanhSachTrangHienThi(trangHienTai, tongSoTrang);
    const phanTramTien = Math.round((viTriKetThuc / tongSoMuc) * 100);

    return (
        <div className={`select-none ${className}`}>
            {/* Progress bar mỏng trên cùng */}
            <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
                <div
                    className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 rounded-full"
                    style={{ width: `${phanTramTien}%` }}
                />
            </div>

            {/* Main pagination bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-slate-50 via-white to-indigo-50/40 dark:from-[#0d1527] dark:via-slate-900 dark:to-[#111c35] border-t-0">

                {/* ===== TRÁI: thông tin + chọn số mục ===== */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Badge thông tin range */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/40 border-2 border-indigo-100 dark:border-indigo-900/60">
                        <span className="text-[10px] font-black text-indigo-400 dark:text-indigo-500 uppercase tracking-wider">Hiển thị</span>
                        <span className="font-black font-mono text-indigo-700 dark:text-indigo-300 text-xs">
                            {viTriBatDau}–{viTriKetThuc}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">/</span>
                        <span className="font-black font-mono text-purple-700 dark:text-purple-300 text-xs">{tongSoMuc}</span>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[80px]">{nhanLoaiMuc}</span>
                    </div>

                    {/* Trang hiện tại badge */}
                    <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/30 border-2 border-emerald-100 dark:border-emerald-900/50">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">Trang</span>
                        <span className="font-black font-mono text-emerald-700 dark:text-emerald-300 text-xs">{trangHienTai}</span>
                        <span className="text-[10px] text-slate-400 font-bold">/</span>
                        <span className="font-bold font-mono text-slate-500 dark:text-slate-400 text-xs">{tongSoTrang}</span>
                    </div>

                    {/* Select số mục/trang */}
                    {onDoiSoMucMoiTrang && !anKiemSoatSoMuc && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border-2 border-amber-100 dark:border-amber-900/50">
                            <ListFilter className="w-3 h-3 text-amber-500" />
                            <select
                                value={soMucMoiTrang}
                                onChange={(e) => onDoiSoMucMoiTrang(Number(e.target.value))}
                                className="bg-transparent text-amber-700 dark:text-amber-300 font-black text-[11px] cursor-pointer focus:outline-none border-0 pr-1"
                                title="Số bản ghi mỗi trang"
                            >
                                {tuyChonSoMuc.map((muc) => (
                                    <option key={muc} value={muc} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                        {muc} / trang
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* ===== PHẢI: các nút chuyển trang ===== */}
                <div className="flex items-center gap-1.5">
                    {/* Về đầu */}
                    <button
                        type="button"
                        onClick={() => onDoiTrang?.(1)}
                        disabled={trangHienTai === 1}
                        title="Trang đầu"
                        className="h-8 w-8 inline-flex items-center justify-center rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                    >
                        <ChevronsLeft className="w-3.5 h-3.5" />
                    </button>

                    {/* Trang trước */}
                    <button
                        type="button"
                        onClick={() => onDoiTrang?.(Math.max(1, trangHienTai - 1))}
                        disabled={trangHienTai === 1}
                        title="Trang trước"
                        className="h-8 px-3 inline-flex items-center gap-1 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all text-[11px]"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Trước</span>
                    </button>

                    {/* Số trang */}
                    <div className="flex items-center gap-1">
                        {danhSachTrang.map((trang, idx) => {
                            if (trang === '...') {
                                return (
                                    <span
                                        key={`cham-${idx}`}
                                        className="h-8 w-7 flex items-center justify-center text-slate-400 dark:text-slate-500 font-black text-xs"
                                    >
                                        …
                                    </span>
                                );
                            }

                            const laTrangHienTai = trang === trangHienTai;
                            return (
                                <button
                                    key={`trang-${trang}`}
                                    type="button"
                                    onClick={() => onDoiTrang?.(trang)}
                                    title={`Trang ${trang}`}
                                    className={`h-8 min-w-[32px] px-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                        laTrangHienTai
                                            ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 text-white shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400/30 scale-110'
                                            : 'border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40'
                                    }`}
                                >
                                    {trang}
                                </button>
                            );
                        })}
                    </div>

                    {/* Trang sau */}
                    <button
                        type="button"
                        onClick={() => onDoiTrang?.(Math.min(tongSoTrang, trangHienTai + 1))}
                        disabled={trangHienTai === tongSoTrang}
                        title="Trang sau"
                        className="h-8 px-3 inline-flex items-center gap-1 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all text-[11px]"
                    >
                        <span className="hidden sm:inline">Sau</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Trang cuối */}
                    <button
                        type="button"
                        onClick={() => onDoiTrang?.(tongSoTrang)}
                        disabled={trangHienTai === tongSoTrang}
                        title="Trang cuối"
                        className="h-8 w-8 inline-flex items-center justify-center rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                    >
                        <ChevronsRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
