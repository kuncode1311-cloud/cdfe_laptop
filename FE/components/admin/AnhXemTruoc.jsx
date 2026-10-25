'use client';
import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * Ảnh xem trước cho form admin. Khác với ảnh thường: nếu link không tải được thì báo rõ
 * "Không tải được ảnh" (thay vì lén hiện ảnh khác khiến admin tưởng link đúng).
 */
export default function AnhXemTruoc({ src, className = 'w-full h-full object-contain' }) {
    // Ghi nhớ link nào đã lỗi: đổi sang link khác thì tự thử lại, không cần reset state
    const [linkLoi, setLinkLoi] = useState(null);
    const biLoi = !src || linkLoi === src;

    if (biLoi) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-1 text-red-500">
                <ImageOff className="w-6 h-6 mb-0.5" />
                <span className="text-[10px] font-bold leading-tight">Không tải được ảnh</span>
            </div>
        );
    }

    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className={className} onError={() => setLinkLoi(src)} />;
}

// Dòng báo lỗi nhỏ đặt dưới ô nhập link ảnh
export function LoiLinkAnh({ loi }) {
    if (!loi) return null;
    return <p className="text-[11px] font-semibold text-red-500 mt-1">{loi}</p>;
}
