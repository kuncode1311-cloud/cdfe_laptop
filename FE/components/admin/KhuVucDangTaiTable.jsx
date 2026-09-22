'use client';
import React, { useState, useEffect } from 'react';

/**
 * Component Hiệu Ứng Loading Hiện Đại Cho Từng Bảng / Section Quản Trị
 * - Giữ nguyên kích thước và cấu trúc bảng để chống giật layout (zero CLS)
 * - Spinner xoay 2 vòng đảo chiều mượt mà kèm tâm nhịp đập
 * - Hiệu ứng chuyển động mượt mà (Fade-in khi xuất hiện / Fade-out mượt khi dữ liệu xong)
 * - Responsive hoàn hảo cho mobile, tablet, desktop
 * - 100% Tiếng Việt thân thiện, đồng bộ tông màu Indigo / Blue sang trọng
 */
export default function KhuVucDangTaiTable({
    dangTai = false,
    tieuDe = 'Đang đồng bộ dữ liệu...',
    moTa = 'Hệ thống đang kết nối dữ liệu thời gian thực',
    chieuCaoToiThieu = 'min-h-[380px]',
    className = '',
    children
}) {
    const [hienThi, setHienThi] = useState(dangTai);
    const [dangFadeOut, setDangFadeOut] = useState(false);

    useEffect(() => {
        if (dangTai) {
            setHienThi(true);
            setDangFadeOut(false);
        } else if (hienThi) {
            // Kích hoạt animation fade-out êm ái trước khi unmount khỏi DOM
            setDangFadeOut(true);
            const timer = setTimeout(() => {
                setHienThi(false);
                setDangFadeOut(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [dangTai, hienThi]);

    const renderOverlayContent = () => (
        <div
            className={`absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/80 dark:bg-[#0d1527]/85 backdrop-blur-[3px] rounded-[inherit] transition-all duration-300 ${
                dangFadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-in fade-in duration-200'
            } ${className}`}
        >
            <div className="relative flex items-center justify-center">
                {/* Vòng ngoài xoay xuôi kim đồng hồ */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-[3px] border-blue-600/20 border-t-blue-600 animate-spin" />
                {/* Vòng trong xoay ngược chiều kim đồng hồ */}
                <div className="absolute w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-indigo-500/25 border-b-indigo-500 animate-spin [animation-direction:reverse] [animation-duration:1.1s]" />
                {/* Chấm tâm phát sáng */}
                <div className="absolute w-2.5 h-2.5 rounded-full bg-blue-600 shadow-md shadow-blue-500/50 animate-pulse" />
            </div>

            <div className="mt-3 text-center px-4 max-w-xs sm:max-w-sm">
                <div className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                    <span>{tieuDe}</span>
                </div>
                {moTa && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1 line-clamp-2">
                        {moTa}
                    </p>
                )}
            </div>
        </div>
    );

    // Dạng Overlay độc lập
    if (!children) {
        if (!hienThi) return null;
        return renderOverlayContent();
    }

    // Dạng Wrapper bọc children
    return (
        <div className={`relative ${chieuCaoToiThieu} ${className}`}>
            <div className={`w-full transition-opacity duration-300 ${dangTai ? 'opacity-25 pointer-events-none' : 'opacity-100 animate-in fade-in duration-300'}`}>
                {children}
            </div>
            {hienThi && renderOverlayContent()}
        </div>
    );
}
