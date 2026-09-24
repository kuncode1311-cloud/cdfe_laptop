'use client';

import React from 'react';
import { MapPin, Phone, CheckCircle } from 'lucide-react';

export default function KhoHangChiNhanh({ danhSachKho }) {
    const danhSach = Array.isArray(danhSachKho) ? danhSachKho : [];

    if (danhSach.length === 0) {
        return <p className="p-4 text-xs text-slate-500">Chưa có dữ liệu tồn kho showroom.</p>;
    }

    return (
        <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-300/80 dark:border-slate-700 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Tình trạng hàng tại showroom ({danhSach.length} điểm có sẵn):</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />Có hàng trải nghiệm</span>
            </div>
            <div className="space-y-2">
                {danhSach.map((kho) => (
                    <div key={kho.id || kho._id || kho.ten_chi_nhanh} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300/80 dark:border-slate-700 gap-2 shadow-2xs">
                        <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate"><MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" /><span className="truncate">{kho.ten_chi_nhanh}</span></div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-5 truncate">{kho.dia_chi}</p>
                        </div>
                        <div className="flex items-center gap-3 pl-5 sm:pl-0 shrink-0">
                            {kho.so_dien_thoai && <a href={`tel:${kho.so_dien_thoai.replace(/\./g, '')}`} className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"><Phone className="w-3 h-3" /><span>{kho.so_dien_thoai}</span></a>}
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">Còn {kho.so_luong_con ?? 0} máy</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
