'use client';

import React from 'react';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from 'lucide-react';
export { usePhanTrang } from '@/hooks/usePhanTrang';

/**
 * Tính toán danh sách số trang thông minh có dấu '...' rút gọn
 * Đảm bảo không bao giờ tràn giao diện dù tổng số trang lớn đến đâu.
 */
function taoDanhSachTrangHienThi(trangHienTai, tongSoTrang) {
    if (tongSoTrang <= 7) {
        return Array.from({ length: tongSoTrang }, (_, i) => i + 1);
    }
    // Gần đầu
    if (trangHienTai <= 4) {
        return [1, 2, 3, 4, 5, '...', tongSoTrang];
    }
    // Gần cuối
    if (trangHienTai >= tongSoTrang - 3) {
        return [1, '...', tongSoTrang - 4, tongSoTrang - 3, tongSoTrang - 2, tongSoTrang - 1, tongSoTrang];
    }
    // Ở giữa
    return [1, '...', trangHienTai - 1, trangHienTai, trangHienTai + 1, '...', tongSoTrang];
}

/**
 * Component Phân Trang Chuẩn Dùng Chung Toàn Bộ Tab Admin
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

    return (
        <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/80 px-4 py-3 select-none text-xs transition-colors ${className}`}
        >
            {/* Vùng Thông Tin Hiển Thị & Chọn Số Bản Ghi Mỗi Trang */}
            <div className="flex flex-wrap items-center gap-2.5 text-slate-600 dark:text-slate-400">
                <span className="font-medium">
                    Hiển thị <span className="font-mono font-bold text-slate-900 dark:text-white">{viTriBatDau}-{viTriKetThuc}</span> trong tổng{' '}
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{tongSoMuc}</span> {nhanLoaiMuc}
                </span>

                {onDoiSoMucMoiTrang && !anKiemSoatSoMuc && (
                    <div className="flex items-center gap-1.5 ml-1 border-l border-slate-300 dark:border-slate-700 pl-2.5">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Xem</span>
                        <select
                            value={soMucMoiTrang}
                            onChange={(e) => onDoiSoMucMoiTrang(Number(e.target.value))}
                            className="h-7 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-[11px] cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-blue-500 shadow-2xs"
                            title="Chọn số lượng bản ghi hiển thị trên mỗi trang"
                        >
                            {tuyChonSoMuc.map((muc) => (
                                <option key={muc} value={muc}>
                                    {muc} / trang
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Vùng Các Nút Bấm Chuyển Trang */}
            <div className="flex items-center gap-1 max-w-full overflow-x-auto py-0.5">
                {/* Nút Về Trang Đầu */}
                <button
                    type="button"
                    onClick={() => onDoiTrang?.(1)}
                    disabled={trangHienTai === 1}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Về trang đầu tiên"
                >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                </button>

                {/* Nút Trang Trước */}
                <button
                    type="button"
                    onClick={() => onDoiTrang?.(Math.max(1, trangHienTai - 1))}
                    disabled={trangHienTai === 1}
                    className="h-8 px-2.5 inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Trang trước"
                >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Trước</span>
                </button>

                {/* Các Nút Số Trang và Dấu '...' */}
                <div className="flex items-center gap-1 px-1">
                    {danhSachTrang.map((trang, idx) => {
                        if (trang === '...') {
                            return (
                                <span
                                    key={`cham-${idx}`}
                                    className="h-8 min-w-7 px-1 flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold select-none text-xs"
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
                                className={`h-8 min-w-8 px-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                    laTrangHienTai
                                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 ring-2 ring-blue-500/20'
                                        : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-700/60'
                                }`}
                                title={`Đến trang ${trang}`}
                            >
                                {trang}
                            </button>
                        );
                    })}
                </div>

                {/* Nút Trang Sau */}
                <button
                    type="button"
                    onClick={() => onDoiTrang?.(Math.min(tongSoTrang, trangHienTai + 1))}
                    disabled={trangHienTai === tongSoTrang}
                    className="h-8 px-2.5 inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Trang sau"
                >
                    <span className="hidden sm:inline text-[11px]">Sau</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* Nút Đến Trang Cuối */}
                <button
                    type="button"
                    onClick={() => onDoiTrang?.(tongSoTrang)}
                    disabled={trangHienTai === tongSoTrang}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Đến trang cuối cùng"
                >
                    <ChevronsRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
