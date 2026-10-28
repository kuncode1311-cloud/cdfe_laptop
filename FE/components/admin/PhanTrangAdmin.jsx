'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
export { usePhanTrang } from '@/hooks/usePhanTrang';

function taoDanhSachTrangHienThi(trangHienTai, tongSoTrang) {
    if (tongSoTrang <= 7) return Array.from({ length: tongSoTrang }, (_, i) => i + 1);
    if (trangHienTai <= 4) return [1, 2, 3, 4, 5, '...', tongSoTrang];
    if (trangHienTai >= tongSoTrang - 3) return [1, '...', tongSoTrang - 4, tongSoTrang - 3, tongSoTrang - 2, tongSoTrang - 1, tongSoTrang];
    return [1, '...', trangHienTai - 1, trangHienTai, trangHienTai + 1, '...', tongSoTrang];
}

export default function PhanTrangAdmin({
    trangHienTai = 1,
    tongSoTrang = 1,
    tongSoMuc = 0,
    soMucMoiTrang = 10,
    onDoiTrang,
    nhanLoaiMuc = 'bản ghi',
    className = ''
}) {
    if (tongSoMuc === 0) return null;

    const viTriBatDau = (trangHienTai - 1) * soMucMoiTrang + 1;
    const viTriKetThuc = Math.min(trangHienTai * soMucMoiTrang, tongSoMuc);
    const danhSachTrang = taoDanhSachTrangHienThi(trangHienTai, tongSoTrang);

    return (
        <div className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-t border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-slate-900/60 select-none ${className}`}>

            {/* Trái: thông tin nhỏ gọn */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>
                    <span className="font-black text-slate-700 dark:text-slate-200">{viTriBatDau}–{viTriKetThuc}</span>
                    {' / '}
                    <span className="font-black text-indigo-600 dark:text-indigo-400">{tongSoMuc}</span>
                    {' '}{nhanLoaiMuc}
                </span>

            </div>

            {/* Phải: nút điều hướng */}
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => onDoiTrang?.(Math.max(1, trangHienTai - 1))}
                    disabled={trangHienTai === 1}
                    className="h-7 px-2 flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-[11px] font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                >
                    <ChevronLeft className="w-3 h-3" />
                    <span className="hidden sm:inline">Trước</span>
                </button>

                {danhSachTrang.map((trang, idx) =>
                    trang === '...' ? (
                        <span key={`e-${idx}`} className="h-7 w-6 flex items-center justify-center text-slate-400 text-xs font-bold">…</span>
                    ) : (
                        <button
                            key={`p-${trang}`}
                            type="button"
                            onClick={() => onDoiTrang?.(trang)}
                            className={`h-7 min-w-[28px] px-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                trang === trangHienTai
                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm shadow-indigo-400/40 scale-105'
                                    : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30'
                            }`}
                        >
                            {trang}
                        </button>
                    )
                )}

                <button
                    type="button"
                    onClick={() => onDoiTrang?.(Math.min(tongSoTrang, trangHienTai + 1))}
                    disabled={trangHienTai === tongSoTrang}
                    className="h-7 px-2 flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-[11px] font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                >
                    <span className="hidden sm:inline">Sau</span>
                    <ChevronRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}
