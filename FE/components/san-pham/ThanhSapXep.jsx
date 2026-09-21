'use client';
import React from 'react';
import { LayoutGrid, ListFilter, ArrowUpDown, Flame, Sparkles } from 'lucide-react';

export default function ThanhSapXep({
    tongSoLuong,
    sapXepHienTai,
    onThayDoiSapXep,
    cheDoHienThi,
    onThayDoiCheDoHienThi
}) {
    const cacTuyChon = [
        { ma: 'moi_nhat', nhan: 'Mới Nhất' },
        { ma: 'ban_chay_nhat', nhan: 'Bán Chạy' },
        { ma: 'gia_tang_dan', nhan: 'Giá Tăng Dần ↗' },
        { ma: 'gia_giam_dan', nhan: 'Giá Giảm Dần ↘' },
        { ma: 'giam_gia_nhieu_nhat', nhan: '% Giảm Sốc' },
        { ma: 'danh_gia_cao', nhan: 'Đánh Giá 5★' }
    ];

    return (
        <div className="w-full bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            {/* 1. Số lượng sản phẩm dạng Pill Badge gọn gàng không bị rớt dòng */}
            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-cyan-300 font-extrabold text-xs flex items-center gap-1.5 border border-blue-100 dark:border-blue-900/60 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                    <span>Tìm thấy <strong className="text-sm font-black text-[#0052cc] dark:text-cyan-300">{tongSoLuong}</strong> sản phẩm</span>
                </span>
            </div>

            {/* 2. Nhóm Sắp Xếp & Chuyển Chế Độ Xem */}
            <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end overflow-hidden">
                {/* Nút Chọn Kiểu Sắp Xếp Trực Quan */}
                <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none max-w-full">
                    <span className="text-xs text-slate-400 font-bold shrink-0 hidden lg:inline mr-1 flex items-center gap-1">
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        Sắp xếp:
                    </span>
                    {cacTuyChon.map((tc) => {
                        const laDangChon = sapXepHienTai === tc.ma;
                        return (
                            <button
                                key={tc.ma}
                                onClick={() => onThayDoiSapXep(tc.ma)}
                                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                                    laDangChon
                                        ? 'bg-[#0052cc] text-white shadow-sm shadow-blue-500/25 scale-[1.02]'
                                        : 'bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-transparent'
                                }`}
                            >
                                {tc.nhan}
                            </button>
                        );
                    })}
                </div>

                {/* Nút Grid / List View */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0 border border-slate-200/60 dark:border-slate-700/60">
                    <button
                        onClick={() => onThayDoiCheDoHienThi('luoi')}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            cheDoHienThi === 'luoi'
                                ? 'bg-white dark:bg-slate-900 text-[#0052cc] dark:text-cyan-400 shadow-xs'
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                        title="Chế độ xem lưới"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onThayDoiCheDoHienThi('danh_sach')}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            cheDoHienThi === 'danh_sach'
                                ? 'bg-white dark:bg-slate-900 text-[#0052cc] dark:text-cyan-400 shadow-xs'
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                        title="Chế độ xem danh sách"
                    >
                        <ListFilter className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
