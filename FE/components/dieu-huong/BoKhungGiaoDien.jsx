'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import ThanhDieuHuong from '@/components/dieu-huong/ThanhDieuHuong';
import MenuDanhMuc from '@/components/dieu-huong/MenuDanhMuc';
import ChanTrang from '@/components/dieu-huong/ChanTrang';
import NutLienHeNoi from '@/components/dieu-huong/NutLienHeNoi';
import ThanhSoSanhNoi from '@/components/so-sanh/ThanhSoSanhNoi';

/**
 * Bộ khung điều phối giao diện:
 * - Nếu đang ở trang Quản trị (/admin): Ẩn toàn bộ Header, Menu, Footer và Nút liên hệ của Khách.
 * - Nếu đang ở trang Cửa hàng: Hiển thị đầy đủ giao diện người mua hàng.
 */
export default function BoKhungGiaoDien({ children }) {
    const pathname = usePathname();
    const laTrangAdmin = pathname?.startsWith('/admin');

    if (laTrangAdmin) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
                {children}
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="site-sticky-nav sticky top-0 z-[100] w-full">
                <div className="site-nav-shell">
                    <ThanhDieuHuong />
                    <MenuDanhMuc />
                </div>
            </div>
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">
                {children}
            </main>
            <ChanTrang />
            <ThanhSoSanhNoi />
            <NutLienHeNoi />
        </div>
    );
}
