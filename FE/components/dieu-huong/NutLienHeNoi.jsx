'use client';

import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, X, ChevronDown, Headphones, PhoneCall } from 'lucide-react';

/**
 * Cụm nút liên hệ nổi thông minh (Speed-Dial Floating Widget)
 * - Có nút Thu gọn (Collapse) / Mở rộng (Expand) trực quan.
 * - Trên điện thoại: Khi thu gọn chỉ còn 1 icon nhỏ gọn nép ở mép dưới, không che mất sản phẩm.
 * - Khi mở: Bung ra 3 kênh liên hệ (Zalo, Hotline, Messenger) với hiệu ứng animation mượt mà.
 */
export default function NutLienHeNoi() {
    // Mặc định: Mở trên desktop, nhưng cho phép thu gọn bất kỳ lúc nào; trên mobile người dùng có thể đóng mở mượt mà
    const [dangMo, setDangMo] = useState(true);
    const [daKhoiTao, setDaKhoiTao] = useState(false);

    useEffect(() => {
        // Tự động thu gọn trên mobile khi vừa tải trang để không che khuất sản phẩm
        if (typeof window !== 'undefined') {
            if (window.innerWidth < 768) {
                setDangMo(false);
            }
            setDaKhoiTao(true);
        }
    }, []);

    return (
        <aside
            className="fixed left-3 sm:left-4 bottom-5 sm:bottom-6 z-40 flex flex-col items-start select-none"
            aria-label="Kênh liên hệ hỗ trợ nhanh"
        >
            {/* 1. DANH SÁCH CÁC NÚT LIÊN HỆ KHI MỞ RỘNG */}
            <div
                className={`flex flex-col gap-2.5 transition-all duration-300 ease-out origin-bottom ${
                    dangMo
                        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                        : 'opacity-0 translate-y-6 scale-90 pointer-events-none h-0 overflow-hidden'
                }`}
            >
                {/* Zalo Button */}
                <a
                    href="https://zalo.me/0948377979"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2.5 cursor-pointer"
                    title="Chat Zalo hỗ trợ kỹ thuật & báo giá"
                >
                    <div className="w-11 h-11 rounded-2xl bg-[#0068ff] text-white flex items-center justify-center font-black text-xs shadow-lg shadow-blue-600/30 group-hover:scale-110 active:scale-95 transition-all duration-200">
                        <span className="font-extrabold text-sm tracking-tight">Zalo</span>
                    </div>
                    <span className="hidden sm:inline-block px-2.5 py-1 text-xs font-bold text-slate-800 bg-white/95 dark:bg-slate-900/95 dark:text-slate-100 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 dark:border-slate-700/80 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 pointer-events-none whitespace-nowrap">
                        Chat Zalo tư vấn
                    </span>
                </a>

                {/* Hotline Call Button */}
                <a
                    href="tel:0948377979"
                    className="group flex items-center gap-2.5 cursor-pointer"
                    title="Gọi điện Hotline 0948.377.979"
                >
                    <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-red-600/35 group-hover:scale-110 active:scale-95 transition-all duration-200 animate-pulse">
                        <span className="absolute inset-0 rounded-2xl bg-red-500 opacity-40 animate-ping pointer-events-none" />
                        <Phone className="w-5 h-5 fill-white text-white relative z-10" />
                    </div>
                    <span className="hidden sm:inline-block px-2.5 py-1 text-xs font-bold text-red-600 bg-white/95 dark:bg-slate-900/95 dark:text-red-400 backdrop-blur-md rounded-xl shadow-md border border-red-200/80 dark:border-red-900/80 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 pointer-events-none whitespace-nowrap">
                        Hotline: 0948.377.979
                    </span>
                </a>

                {/* Messenger Button */}
                <a
                    href="https://m.me/laptopnew.vn"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2.5 cursor-pointer"
                    title="Chat Facebook Messenger"
                >
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00b2fe] to-[#006aff] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 active:scale-95 transition-all duration-200">
                        <MessageCircle className="w-5 h-5 fill-white text-white" />
                    </div>
                    <span className="hidden sm:inline-block px-2.5 py-1 text-xs font-bold text-slate-800 bg-white/95 dark:bg-slate-900/95 dark:text-slate-100 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 dark:border-slate-700/80 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 pointer-events-none whitespace-nowrap">
                        Facebook Messenger
                    </span>
                </a>
            </div>

            {/* 2. NÚT TOGGLE COLLAPSE / EXPAND THAO TÁC */}
            <div className="mt-2.5 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setDangMo(!dangMo)}
                    className={`relative w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 cursor-pointer ${
                        dangMo
                            ? 'bg-slate-900/90 hover:bg-slate-950 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md hover:scale-105 active:scale-95'
                            : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-blue-600/35 hover:scale-110 active:scale-95 animate-bounce-subtle'
                    }`}
                    title={dangMo ? "Thu gọn liên hệ (đỡ vướng màn hình)" : "Mở liên hệ (Zalo, Hotline, Messenger)"}
                    aria-label={dangMo ? "Thu gọn nút liên hệ" : "Mở menu liên hệ"}
                    aria-expanded={dangMo}
                >
                    {dangMo ? (
                        <>
                            <X className="w-5 h-5 transition-transform duration-200" />
                            <span className="sr-only">Thu gọn</span>
                        </>
                    ) : (
                        <>
                            <span className="absolute inset-0 rounded-2xl bg-cyan-400 opacity-25 animate-ping pointer-events-none" />
                            <PhoneCall className="w-5 h-5 transition-transform duration-200 relative z-10" />
                            {/* Chấm tròn báo trạng thái online */}
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-xs" />
                        </>
                    )}
                </button>

                {/* Nhãn hướng dẫn khi đã thu gọn trên màn hình lớn */}
                {!dangMo && (
                    <button
                        type="button"
                        onClick={() => setDangMo(true)}
                        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200 dark:border-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                        <span>Hỗ trợ 24/7</span>
                    </button>
                )}
            </div>
        </aside>
    );
}
