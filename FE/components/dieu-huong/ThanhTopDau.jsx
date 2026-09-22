'use client';
import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, ShieldCheck, Sparkles, Truck } from 'lucide-react';

export default function ThanhTopDau() {
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

        {/* Right Side: Hotline, Showrooms */}
        <div className="flex items-center gap-5">
          <a href="tel:0948377979" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Phone className="w-3.5 h-3.5 text-red-400 animate-pulse"/>
            <span>Hotline: <strong className="text-white">0948.37.79.79</strong></span>
          </a>

          <Link href="/don-hang" className="hidden sm:flex items-center gap-1 hover:text-white transition-colors">
            <MapPin className="w-3.5 h-3.5 text-sky-400"/>
            <span>Tra Cứu Đơn Hàng</span>
          </Link>
        </div>
      </div>
    </div>);
}
