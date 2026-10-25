'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { khopTuKhoaDiaChi } from '@/services/dia-gioi-hanh-chinh.service';

// Bộ Chọn Địa Giới Hành Chính Có Tìm Kiếm Nhanh Realtime (Searchable Combobox): tách từ app/tai-khoan/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function BoChonDiaGioi({
    label,
    icon: Icon,
    danhSach = [],
    giaTri = '',
    onChon,
    placeholder = 'Chọn...',
    disabled = false
}) {
    const [dangMo, setDangMo] = useState(false);
    const [tuKhoa, setTuKhoa] = useState('');
    const refContainer = React.useRef(null);
    const refInput = React.useRef(null);

    // Tự động focus vào ô tìm kiếm khi mở combobox
    useEffect(() => {
        if (dangMo) {
            const timer = setTimeout(() => {
                refInput.current?.focus();
            }, 30);
            return () => clearTimeout(timer);
        } else {
            setTuKhoa('');
        }
    }, [dangMo]);

    useEffect(() => {
        const xuLyClickNgoai = (e) => {
            if (refContainer.current && !refContainer.current.contains(e.target)) {
                setDangMo(false);
            }
        };
        document.addEventListener('mousedown', xuLyClickNgoai);
        return () => document.removeEventListener('mousedown', xuLyClickNgoai);
    }, []);

    // Lọc realtime chuẩn xác từng ký tự và từ viết tắt
    const danhSachLoc = useMemo(() => {
        if (!tuKhoa.trim()) return danhSach;
        return danhSach.filter(item => khopTuKhoaDiaChi(item, tuKhoa));
    }, [danhSach, tuKhoa]);

    return (
        <div className="relative" ref={refContainer}>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                {Icon && <Icon className="w-3.5 h-3.5 text-slate-500" />}
                <span>{label}</span>
            </label>

            <button
                type="button"
                disabled={disabled}
                onClick={() => setDangMo(!dangMo)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between text-xs font-semibold transition-all ${
                    disabled
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                        : dangMo
                        ? 'bg-white border-emerald-500 ring-2 ring-emerald-100 shadow-sm'
                        : 'border-slate-300 bg-white hover:border-slate-400 text-slate-800 cursor-pointer'
                }`}
            >
                <span className={`truncate ${!giaTri ? 'text-slate-400 font-medium' : 'text-slate-900 font-bold'}`}>
                    {giaTri || placeholder}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 ml-2 transition-transform ${dangMo ? 'rotate-180 text-emerald-600' : ''}`} />
            </button>

            {dangMo && !disabled && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl border-2 border-emerald-400 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="p-2.5 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/70 to-teal-50/40">
                        <div className="relative flex items-center">
                            <Search className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 pointer-events-none" />
                            <input
                                ref={refInput}
                                type="text"
                                value={tuKhoa}
                                onChange={(e) => setTuKhoa(e.target.value)}
                                onInput={(e) => setTuKhoa(e.target.value)}
                                placeholder={`Tìm nhanh ${label.toLowerCase()}...`}
                                className="w-full pl-8 pr-16 py-1.5 rounded-xl border border-emerald-200 bg-white text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-slate-800"
                            />
                            <div className="absolute right-2 flex items-center gap-1">
                                {tuKhoa && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTuKhoa('');
                                            refInput.current?.focus();
                                        }}
                                        className="w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-[10px] cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                )}
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded-md">
                                    {danhSachLoc.length}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 text-xs">
                        {danhSachLoc.length === 0 ? (
                            <div className="p-4 text-center text-slate-400 text-[11px] font-medium space-y-1">
                                <p className="font-bold text-slate-600">Không tìm thấy kết quả phù hợp</p>
                                <p className="text-[10px] text-slate-400">Thử gõ từ khóa không dấu hoặc viết tắt (vd: hn, hcm, vl...)</p>
                            </div>
                        ) : (
                            danhSachLoc.map((item) => {
                                const ten = item.name || item.ten;
                                const isSelected = giaTri === ten;
                                return (
                                    <button
                                        key={item.code ? `cd-${item.code}` : ten}
                                        type="button"
                                        onClick={() => {
                                            onChon(item);
                                            setDangMo(false);
                                            setTuKhoa('');
                                        }}
                                        className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between font-semibold transition-colors cursor-pointer ${
                                            isSelected
                                                ? 'bg-emerald-50 text-emerald-800 font-black'
                                                : 'hover:bg-slate-50 text-slate-700 hover:text-emerald-700'
                                        }`}
                                    >
                                        <div className="flex flex-col min-w-0 pr-2">
                                            <span className="truncate">{ten}</span>
                                            {item.phuDe && (
                                                <span className="text-[10px] text-amber-700 font-medium truncate">
                                                    📌 {item.phuDe}
                                                </span>
                                            )}
                                        </div>
                                        {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-1.5 stroke-[2.5]" />}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
