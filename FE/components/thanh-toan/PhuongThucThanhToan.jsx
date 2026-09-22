'use client';
import React from 'react';
import { QrCode, Banknote, Check, Zap } from 'lucide-react';

export default function PhuongThucThanhToanComponent({ phuongThucChon, onThayDoi }) {
    return (
        <div className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0052cc] dark:text-cyan-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 shadow-2xs">
                    <Zap className="w-4 h-4" />
                </div>
                <div>
                    <h3 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                        2. CHỌN HÌNH THỨC THANH TOÁN
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Chọn 1 trong 2 hình thức thanh toán an toàn bên dưới
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {/* 1. Chuyển Khoản Ngân Hàng 24/7 (Quét Mã QR) */}
                <div
                    onClick={() => onThayDoi('chuyen_khoan_vietqr')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        phuongThucChon === 'chuyen_khoan_vietqr'
                            ? 'border-[#0052cc] bg-blue-50/70 dark:bg-slate-800/90 shadow-sm ring-2 ring-blue-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
                    }`}
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0052cc] to-blue-700 text-white flex items-center justify-center font-bold shrink-0 shadow-md shadow-blue-600/20">
                                <QrCode className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                                        Chuyển Khoản Ngân Hàng 24/7 (Quét Mã QR)
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10.5px] font-extrabold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                                        <Zap className="w-3 h-3 text-emerald-600" />
                                        Khuyên Dùng • Tự Động
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                                    Quét mã QR qua ứng dụng ngân hàng MBBank/VietQR, hệ thống kích hoạt đơn tức thì.
                                </p>
                            </div>
                        </div>

                        {/* Radio Checkbox */}
                        <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                phuongThucChon === 'chuyen_khoan_vietqr'
                                    ? 'border-[#0052cc] bg-[#0052cc] text-white shadow-sm'
                                    : 'border-slate-300 dark:border-slate-700'
                            }`}
                        >
                            {phuongThucChon === 'chuyen_khoan_vietqr' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                    </div>
                </div>

                {/* 2. Thanh Toán Khi Nhận Hàng (COD) (Gọn gàng) */}
                <div
                    onClick={() => onThayDoi('tien_mat_cod')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        phuongThucChon === 'tien_mat_cod'
                            ? 'border-[#0052cc] bg-blue-50/70 dark:bg-slate-800/90 shadow-sm ring-2 ring-blue-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
                    }`}
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md shadow-amber-500/20">
                                <Banknote className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                                        Thanh Toán Tiền Mặt Khi Nhận Hàng (COD)
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10.5px] font-extrabold border border-amber-300 dark:border-amber-800">
                                        Đồng Kiểm & Mở Hộp
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                                    Kiểm tra laptop nguyên seal, mở hộp test thử máy trước khi thanh toán cho nhân viên giao hàng.
                                </p>
                            </div>
                        </div>

                        {/* Radio Checkbox */}
                        <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                phuongThucChon === 'tien_mat_cod'
                                    ? 'border-[#0052cc] bg-[#0052cc] text-white shadow-sm'
                                    : 'border-slate-300 dark:border-slate-700'
                            }`}
                        >
                            {phuongThucChon === 'tien_mat_cod' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
