'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Laptop, Flame, ShoppingCart, Menu } from 'lucide-react';
import { useGioHang } from '@/contexts/CartContext';

/**
 * Thanh điều hướng đáy cố định dành riêng cho điện thoại (Bottom Navigation Bar)
 * Giúp người dùng chuyển trang tức thì chỉ với 1 chạm ngón tay cái.
 */
export default function ThanhDieuHuongDayMobile({ onMoMenu }) {
    const pathname = usePathname();
    const { gio_hang } = useGioHang();

    const cacMuc = [
        {
            href: '/',
            nhan: 'Trang Chủ',
            icon: Home,
            active: pathname === '/'
        },
        {
            href: '/san-pham',
            nhan: 'Sản Phẩm',
            icon: Laptop,
            active: pathname.startsWith('/san-pham')
        },
        {
            href: '/khuyen-mai',
            nhan: 'Ưu Đãi',
            icon: Flame,
            active: pathname === '/khuyen-mai'
        },
        {
            href: '/gio-hang',
            nhan: 'Giỏ Hàng',
            icon: ShoppingCart,
            active: pathname === '/gio-hang',
            badge: gio_hang?.tong_so_luong || 0
        }
    ];

    return (
        <nav
            className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-1 px-2 select-none"
            aria-label="Thanh chuyển trang di động"
        >
            <div className="flex items-center justify-around max-w-md mx-auto">
                {cacMuc.map((m) => {
                    const IconComponent = m.icon;
                    return (
                        <Link
                            key={m.href}
                            href={m.href}
                            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 active:scale-90 relative ${
                                m.active
                                    ? 'text-blue-600 dark:text-cyan-400 font-extrabold'
                                    : 'text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-800'
                            }`}
                        >
                            <div className="relative">
                                <IconComponent className={`w-5 h-5 ${m.active ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                                {typeof m.badge === 'number' && m.badge > 0 && (
                                    <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                                        {m.badge}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] mt-0.5 tracking-tight leading-none">
                                {m.nhan}
                            </span>
                        </Link>
                    );
                })}

                {/* Nút Hamburger Mở Toàn Bộ Danh Mục Chuyển Trang */}
                <button
                    type="button"
                    onClick={onMoMenu}
                    className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-500 dark:text-slate-400 font-semibold hover:text-blue-600 dark:hover:text-cyan-400 active:scale-90 transition-all cursor-pointer"
                    aria-label="Mở tất cả danh mục chuyển trang"
                >
                    <Menu className="w-5 h-5 stroke-[2]" />
                    <span className="text-[10px] mt-0.5 tracking-tight leading-none">
                        Menu
                    </span>
                </button>
            </div>
        </nav>
    );
}
