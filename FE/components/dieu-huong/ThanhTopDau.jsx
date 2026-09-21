'use client';
import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, ShieldCheck, Sun, Moon, Sparkles, Truck } from 'lucide-react';
import { useTheme, useGiaoDien } from '@/contexts/ThemeContext';
export default function ThanhTopDau() {
    const { chu_de, chuyenDoiChuDe } = useGiaoDien();
    return (<div className="w-full bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Policy & Slogan */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4"/>
            <span>Hệ Thống Laptop Chính Hãng Hàng Đầu Việt Nam</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-slate-400">
            <Truck className="w-4 h-4 text-sky-400"/>
            <span>Giao Hàng Hỏa Tốc Toàn Quốc 2H</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 text-amber-400">
            <Sparkles className="w-4 h-4"/>
            <span>Trả Góp 0% Lãi Suất - Duyệt Nhanh 5 Phút</span>
          </div>
        </div>

        {/* Right Side: Hotline, Showrooms, Theme Toggle */}
        <div className="flex items-center gap-5">
          <a href="tel:0948377979" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Phone className="w-3.5 h-3.5 text-red-400 animate-pulse"/>
            <span>Hotline: <strong className="text-white">0948.37.79.79</strong></span>
          </a>

          <Link href="/don-hang" className="hidden sm:flex items-center gap-1 hover:text-white transition-colors">
            <MapPin className="w-3.5 h-3.5 text-sky-400"/>
            <span>Tra Cứu Đơn Hàng</span>
          </Link>

          {/* Theme Switcher Button */}
          <button onClick={chuyenDoiChuDe} className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer" title="Chuyển đổi giao diện Sáng / Tối Neon">
            {chu_de === 'sang' ? (<>
                <Moon className="w-3.5 h-3.5 text-indigo-400"/>
                <span className="font-semibold text-[11px] text-indigo-300">Tone Tối Neon</span>
              </>) : (<>
                <Sun className="w-3.5 h-3.5 text-amber-400"/>
                <span className="font-semibold text-[11px] text-amber-300">Tone Sáng Chuẩn</span>
              </>)}
          </button>
        </div>
      </div>
    </div>);
}
