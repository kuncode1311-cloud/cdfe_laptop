'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import ThanhDieuHuong from '@/components/dieu-huong/ThanhDieuHuong';
import MenuDanhMuc from '@/components/dieu-huong/MenuDanhMuc';
import ChanTrang from '@/components/dieu-huong/ChanTrang';
import NutLienHeNoi from '@/components/dieu-huong/NutLienHeNoi';
import ThanhSoSanhNoi from '@/components/so-sanh/ThanhSoSanhNoi';
import HopChatAI from '@/components/chat-ai/HopChatAI';
import MenuMobileDrawer from '@/components/dieu-huong/MenuMobileDrawer';
import ThanhDieuHuongDayMobile from '@/components/dieu-huong/ThanhDieuHuongDayMobile';

/**
 * Bộ khung điều phối giao diện:
 * - Nếu đang ở trang Quản trị (/admin): Ẩn toàn bộ Header, Menu, Footer và Nút liên hệ của Khách.
 * - Nếu đang ở trang Cửa hàng: Hiển thị đầy đủ giao diện người mua hàng.
 */
export default function BoKhungGiaoDien({ children }) {
    const pathname = usePathname();
    const laTrangAdmin = pathname?.startsWith('/admin');
    const [dangMoMenuMobile, setDangMoMenuMobile] = useState(false);

    if (laTrangAdmin) {
        return (
            <div className="h-screen w-full overflow-hidden bg-slate-950 text-slate-100 flex flex-col">
                {children}
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen relative">
            {/* 🌌 Nền Vũ Trụ Hạt Bay Tone Sáng (Light Theme Particle Sky từ MOS) */}
            <div className="stars-bg-container" aria-hidden="true">
                <div id="stars"></div>
                <div id="stars2"></div>
                <div id="stars3"></div>
            </div>

            <div className="site-sticky-nav sticky top-0 z-[100] w-full">
                <div className="site-nav-shell">
                    <ThanhDieuHuong onMoMenuMobile={() => setDangMoMenuMobile(true)} />
                    <MenuDanhMuc />
                </div>
            </div>

            {/* Menu Drawer trượt chuyển trang trên điện thoại */}
            <MenuMobileDrawer
                dangMo={dangMoMenuMobile}
                onDong={() => setDangMoMenuMobile(false)}
            />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28 sm:pb-24 lg:pb-8 space-y-12 relative z-10">
                {children}
            </main>
            <div className="relative z-10 pb-20 lg:pb-0">
                <ChanTrang />
            </div>
            <ThanhSoSanhNoi />
            <NutLienHeNoi />
            <HopChatAI />

            {/* Thanh điều hướng đáy chuyển trang cố định cho điện thoại */}
            <ThanhDieuHuongDayMobile onMoMenu={() => setDangMoMenuMobile(true)} />
        </div>
    );
}

