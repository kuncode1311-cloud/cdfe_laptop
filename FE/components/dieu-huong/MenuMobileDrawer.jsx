'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    X, Search, Home, Laptop, Flame, Newspaper, Info, Phone,
    ShieldCheck, Scale, ChevronDown, ChevronRight, Gamepad2,
    Cpu, Feather, HardDrive, Keyboard, Mouse, Headphones,
    User, LogOut, PackageCheck, LayoutDashboard, Ticket, ArrowRight
} from 'lucide-react';
import { useAuth, useNguoiDung } from '@/contexts/AuthContext';

const THUONG_HIEU_HOT = [
    { ma: 'asus', ten: 'ASUS / ROG' },
    { ma: 'lenovo', ten: 'Lenovo Legion' },
    { ma: 'dell', ten: 'Dell Alienware' },
    { ma: 'apple', ten: 'Apple MacBook' },
    { ma: 'msi', ten: 'MSI Gaming' },
    { ma: 'acer', ten: 'Acer Predator' },
    { ma: 'hp', ten: 'HP OMEN' }
];

const NHU_CAU_HOT = [
    { href: '/san-pham?danh_muc=gaming', ten: 'Laptop Gaming RTX 40-Series', icon: Gamepad2, color: 'text-purple-600' },
    { href: '/san-pham?danh_muc=ai-pc', ten: 'Laptop AI PC 2026', icon: Cpu, color: 'text-cyan-600' },
    { href: '/san-pham?danh_muc=van-phong-mong-nhe', ten: 'Mỏng Nhẹ Cao Cấp OLED', icon: Feather, color: 'text-emerald-600' },
    { href: '/san-pham?danh_muc=linh-kien-nang-cap', ten: 'Linh Kiện RAM / SSD', icon: HardDrive, color: 'text-blue-600' },
    { href: '/san-pham?danh_muc=ban-phim-co', ten: 'Bàn Phím Cơ Gaming', icon: Keyboard, color: 'text-indigo-600' },
    { href: '/san-pham?danh_muc=chuot-lot-chuot', ten: 'Chuột Gaming Siêu Nhẹ 8K', icon: Mouse, color: 'text-rose-600' },
    { href: '/san-pham?danh_muc=tai-nghe-loa', ten: 'Tai Nghe & Phụ Kiện', icon: Headphones, color: 'text-amber-600' }
];

export default function MenuMobileDrawer({ dangMo, onDong }) {
    const router = useRouter();
    const { nguoiDung, daDangNhap, moModalDangNhap, dangXuat } = useNguoiDung();
    const [tuKhoa, setTuKhoa] = useState('');
    const [moNhomSanPham, setMoNhomSanPham] = useState(false);
    const [moNhomThuongHieu, setMoNhomThuongHieu] = useState(false);

    if (!dangMo) return null;

    const xuLyTimKiem = (e) => {
        e.preventDefault();
        if (tuKhoa.trim()) {
            onDong();
            router.push(`/san-pham?tu_khoa=${encodeURIComponent(tuKhoa.trim())}`);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] lg:hidden select-none animate-in fade-in duration-200" aria-label="Menu chuyển trang trên điện thoại">
            {/* Lớp nền mờ Backdrop */}
            <div
                className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
                onClick={onDong}
            />

            {/* Khung Drawer trượt ra từ bên trái */}
            <aside className="relative w-[86vw] max-w-[340px] h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-left duration-300">
                {/* 1. Header Drawer: Logo & Nút Đóng */}
                <div className="p-4 bg-gradient-to-r from-[#0755c9] to-[#0040a8] text-white flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-white text-[#0052cc] flex items-center justify-center font-black shadow-xs">
                            <span className="text-xs">TNTP</span>
                        </div>
                        <div>
                            <span className="font-black text-sm tracking-tight uppercase">
                                TNTP <span className="text-cyan-300">LAPTOP</span>
                            </span>
                            <div className="text-[9px] text-white/80 font-bold uppercase tracking-wider">
                                Menu Chuyển Trang
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onDong}
                        className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 active:scale-90 flex items-center justify-center transition-all cursor-pointer"
                        aria-label="Đóng menu"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* 2. Ô Tìm Kiếm Nhanh Trong Drawer */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                    <form onSubmit={xuLyTimKiem} className="relative flex items-center">
                        <input
                            type="text"
                            value={tuKhoa}
                            onChange={(e) => setTuKhoa(e.target.value)}
                            placeholder="Tìm laptop, phụ kiện, chip..."
                            className="w-full pl-3 pr-10 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-inner"
                        />
                        <button
                            type="submit"
                            className="absolute right-1 p-1.5 text-blue-600 dark:text-cyan-400 cursor-pointer"
                            title="Tìm kiếm"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </form>
                </div>

                {/* 3. Vùng Thông Tin Tài Khoản / Đăng Nhập */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    {daDangNhap && nguoiDung ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
                                    {nguoiDung.avatar ? (
                                        <img src={nguoiDung.avatar} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-4 h-4 text-white" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-xs truncate text-slate-900 dark:text-white">
                                        {nguoiDung.hoTen}
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate">
                                        {nguoiDung.email}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1 text-[11px] font-bold">
                                {nguoiDung.vaiTro === 'admin' && (
                                    <Link
                                        href="/admin"
                                        onClick={onDong}
                                        className="flex-1 py-1.5 px-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 flex items-center justify-center gap-1 text-center"
                                    >
                                        <LayoutDashboard className="w-3.5 h-3.5" />
                                        <span>Quản Trị</span>
                                    </Link>
                                )}
                                <Link
                                    href="/tai-khoan"
                                    onClick={onDong}
                                    className="flex-1 py-1.5 px-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-cyan-300 flex items-center justify-center gap-1 text-center"
                                >
                                    <User className="w-3.5 h-3.5" />
                                    <span>Tài khoản</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        dangXuat();
                                        onDong();
                                    }}
                                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                                    title="Đăng xuất"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                onDong();
                                moModalDangNhap();
                            }}
                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
                        >
                            <User className="w-4 h-4" />
                            <span>Đăng Nhập / Đăng Ký Tài Khoản</span>
                        </button>
                    )}
                </div>

                {/* 4. Danh Sách Các Mục Chuyển Trang Chính (Cuộn Mượt) */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-bold scrollbar-thin">
                    <div className="text-[10px] font-extrabold uppercase text-slate-400 px-3 py-1 tracking-wider">
                        Danh Mục Chuyển Trang
                    </div>

                    {/* Trang Chủ */}
                    <Link
                        href="/"
                        onClick={onDong}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors"
                    >
                        <Home className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                        <span>Trang Chủ</span>
                    </Link>

                    {/* Nhóm Tất Cả Sản Phẩm (Accordion xổ xuống) */}
                    <div>
                        <button
                            type="button"
                            onClick={() => setMoNhomSanPham(!moNhomSanPham)}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <Laptop className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                <span>Sản Phẩm & Danh Mục</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${moNhomSanPham ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                        </button>

                        {/* Danh sách con khi bấm mở */}
                        {moNhomSanPham && (
                            <div className="pl-6 pr-2 py-1 space-y-1 animate-in fade-in slide-in-from-top-1">
                                <Link
                                    href="/san-pham"
                                    onClick={onDong}
                                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-blue-50/80 dark:bg-slate-800/80 text-blue-700 dark:text-cyan-300 font-extrabold text-[11px]"
                                >
                                    <span>👉 Xem Toàn Bộ Sản Phẩm</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>

                                {NHU_CAU_HOT.map((nc) => {
                                    const IconComponent = nc.icon;
                                    return (
                                        <Link
                                            key={nc.href}
                                            href={nc.href}
                                            onClick={onDong}
                                            className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                                        >
                                            <IconComponent className={`w-3.5 h-3.5 ${nc.color}`} />
                                            <span>{nc.ten}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Nhóm Thương Hiệu (Accordion) */}
                    <div>
                        <button
                            type="button"
                            onClick={() => setMoNhomThuongHieu(!moNhomThuongHieu)}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                <span>Thương Hiệu Laptop</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${moNhomThuongHieu ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                        </button>

                        {moNhomThuongHieu && (
                            <div className="pl-6 pr-2 py-1 grid grid-cols-2 gap-1 animate-in fade-in">
                                {THUONG_HIEU_HOT.map((th) => (
                                    <Link
                                        key={th.ma}
                                        href={`/san-pham?hang=${th.ma}`}
                                        onClick={onDong}
                                        className="py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-cyan-400" />
                                        <span>{th.ten}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Khuyến Mãi & Flash Sale */}
                    <Link
                        href="/khuyen-mai"
                        onClick={onDong}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-600 dark:text-amber-400 transition-colors"
                    >
                        <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span>Khuyến Mãi & Flash Sale</span>
                    </Link>

                    {/* Tin Tức Công Nghệ */}
                    <Link
                        href="/tin-tuc"
                        onClick={onDong}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors"
                    >
                        <Newspaper className="w-4 h-4 text-emerald-600" />
                        <span>Tin Tức & Cẩm Nang</span>
                    </Link>

                    {/* So Sánh Sản Phẩm */}
                    <Link
                        href="/so-sanh"
                        onClick={onDong}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors"
                    >
                        <Scale className="w-4 h-4 text-purple-600" />
                        <span>So Sánh Laptop</span>
                    </Link>

                    {/* Tra Cứu Bảo Hành */}
                    <Link
                        href="/bao-hanh"
                        onClick={onDong}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 transition-colors"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Tra Cứu Bảo Hành</span>
                    </Link>

                    {/* Giới Thiệu Showroom */}
                    <Link
                        href="/gioi-thieu"
                        onClick={onDong}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors"
                    >
                        <Info className="w-4 h-4 text-blue-600" />
                        <span>Giới Thiệu Showroom</span>
                    </Link>

                    {/* Liên Hệ & Showroom */}
                    <Link
                        href="/lien-he"
                        onClick={onDong}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors"
                    >
                        <Phone className="w-4 h-4 text-cyan-600" />
                        <span>Liên Hệ & Hỗ Trợ</span>
                    </Link>
                </div>

                {/* 5. Chân Drawer: Hotline 24/7 Nhanh */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-center">
                    <a
                        href="tel:0948377979"
                        className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-600 text-white font-black text-xs shadow-md shadow-red-600/20 active:scale-95 transition-all"
                    >
                        <Phone className="w-3.5 h-3.5 fill-white" />
                        <span>Hotline 24/7: 0948.377.979</span>
                    </a>
                </div>
            </aside>
        </div>
    );
}
