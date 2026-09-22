'use client';
import React from 'react';
import { MapPin, Phone, CheckCircle } from 'lucide-react';
const SHOWROOM_MAC_DINH = [
    {
        ten_chi_nhanh: 'TNTP Flagship Store - Thái Hà, Đống Đa, Hà Nội',
        dia_chi: 'Số 158 Phố Thái Hà, P. Trung Liệt, Q. Đống Đa, Hà Nội',
        so_dien_thoai: '0968.123.456',
        so_luong_con: 5
    },
    {
        ten_chi_nhanh: 'TNTP Premium Center - Q.10, TP. Hồ Chí Minh',
        dia_chi: 'Số 284 Cao Thắng, Phường 12, Quận 10, TP. Hồ Chí Minh',
        so_dien_thoai: '0978.888.999',
        so_luong_con: 6
    },
    {
        ten_chi_nhanh: 'TNTP Hub Đà Nẵng - Q. Hải Châu, Đà Nẵng',
        dia_chi: 'Số 79 Nguyễn Văn Linh, P. Phước Ninh, Q. Hải Châu, Đà Nẵng',
        so_dien_thoai: '0981.555.666',
        so_luong_con: 3
    }
];

export default function KhoHangChiNhanh({ danhSachKho }) {
    const danhSach = Array.isArray(danhSachKho) && danhSachKho.length > 0 ? danhSachKho : SHOWROOM_MAC_DINH;

    return (
        <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-300/80 dark:border-slate-700 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Tình Trạng Hàng Tại Showroom ({danhSach.length} điểm có sẵn):
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Có hàng trải nghiệm</span>
                </span>
            </div>

            <div className="space-y-2">
                {danhSach.map((kho, idx) => {
                    const sdt = kho.so_dien_thoai || '1900.8946';
                    return (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300/80 dark:border-slate-700 gap-2 shadow-2xs">
                            <div className="space-y-0.5 min-w-0 flex-1">
                                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate">
                                    <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                                    <span className="truncate">{kho.ten_chi_nhanh}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-5 truncate">
                                    {kho.dia_chi}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 pl-5 sm:pl-0 shrink-0">
                                <a href={`tel:${sdt.replace(/\./g, '')}`} className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    <span>{sdt}</span>
                                </a>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                                    Còn {kho.so_luong_con || 3} máy
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
