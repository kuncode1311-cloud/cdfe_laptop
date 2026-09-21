'use client';
import React from 'react';
import Link from 'next/link';
import { Feather, ArrowRight } from 'lucide-react';
import TheSanPham from '@/components/san-pham/TheSanPham';
import { SanPhamService } from '@/services/san-pham.service';
export default function SectionLaptopVanPhong({ danhSachVanPhong }) {
    const danhSach = danhSachVanPhong || SanPhamService.layDanhSachTheoDanhMuc('van-phong-mong-nhe');
    return (<section className="w-full space-y-6">
      {/* Header Phân Khu Mỏng Nhẹ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-sky-500/20 shrink-0">
            <Feather className="w-6 h-6"/>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                MỎNG NHẸ // DOANH NHÂN & SÁNG TẠO
              </h2>
              <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10.5px] font-extrabold border border-emerald-500/30">
                CHỈ TỪ 1.2KG
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Màn hình OLED 3K/4K sắc nét 100% DCI-P3, Thời lượng pin 15-22 tiếng bền bỉ
            </p>
          </div>
        </div>

        <Link href="/san-pham?danh_muc=van-phong-mong-nhe" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0">
          <span>Xem Tất Cả Mỏng Nhẹ</span>
          <ArrowRight className="w-4 h-4"/>
        </Link>
      </div>

      {/* Lưới Laptop Mỏng Nhẹ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {danhSach.slice(0, 4).map((sp) => (<TheSanPham key={sp.id} sanPham={sp} cheDoHienThi="luoi"/>))}
      </div>
    </section>);
}
