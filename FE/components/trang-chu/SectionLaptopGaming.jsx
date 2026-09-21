'use client';
import React from 'react';
import Link from 'next/link';
import { Gamepad2, ArrowRight } from 'lucide-react';
import TheSanPham from '@/components/san-pham/TheSanPham';
import { SanPhamService } from '@/services/san-pham.service';
export default function SectionLaptopGaming({ danhSachGaming }) {
    const danhSach = danhSachGaming || SanPhamService.layDanhSachTheoDanhMuc('gaming');
    return (<section className="w-full space-y-6">
      {/* Header Phân Khu Gaming */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 dark:border-cyan-500/30 text-white shadow-xl relative overflow-hidden">
        {/* Glow FX background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"/>

        <div className="flex items-center gap-3.5 z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 shrink-0">
            <Gamepad2 className="w-6 h-6"/>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                LAPTOP GAMING // CHIẾN GAME ĐỈNH CAO
              </h2>
              <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10.5px] font-extrabold border border-cyan-500/30">
                RTX 40 SERIES 175W
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Màn hình 240Hz-360Hz Nebula HDR, Tản nhiệt kim loại lỏng Conductonaut Extreme
            </p>
          </div>
        </div>

        <Link href="/san-pham?danh_muc=gaming" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all z-10 shrink-0">
          <span>Xem Tất Cả Gaming</span>
          <ArrowRight className="w-4 h-4"/>
        </Link>
      </div>

      {/* Lưới Laptop Gaming */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {danhSach.slice(0, 4).map((sp) => (<TheSanPham key={sp.id} sanPham={sp} cheDoHienThi="luoi"/>))}
      </div>
    </section>);
}
