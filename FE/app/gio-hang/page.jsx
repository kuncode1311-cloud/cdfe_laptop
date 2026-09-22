'use client';
import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart, useGioHang } from '@/contexts/CartContext';
import DanhSachMucGioHang from '@/components/gio-hang/DanhSachMucGioHang';
import NhapMaGiamGia from '@/components/gio-hang/NhapMaGiamGia';
import TomTatThanhToan from '@/components/gio-hang/TomTatThanhToan';
export default function TrangGioHang() {
    const { gio_hang } = useGioHang();
    return (
        <div className="space-y-6 pt-2 sm:pt-4 pb-12 max-w-7xl mx-auto">
            {/* 1. Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Link href="/" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors">
                    <Home className="w-3.5 h-3.5" />
                    <span>Trang Chủ</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-900 dark:text-white">Giỏ Hàng Của Bạn</span>
            </nav>

            {/* 2. Tiêu đề nổi bật trong Card Sạch Sẽ Tách Biệt Với Nền */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex flex-wrap items-center gap-2.5">
                        <span>GIỎ HÀNG CỦA BẠN</span>
                        <span className="text-xs px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0052cc] dark:text-cyan-300 font-extrabold border border-blue-300 dark:border-blue-800 shadow-2xs">
                            Đang có {gio_hang.tong_so_luong} máy
                        </span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Kiểm tra laptop nguyên seal, bảo hành chính hãng và các quà tặng đi kèm
                    </p>
                </div>

                <Link 
                    href="/san-pham" 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#0052cc] dark:text-cyan-400 font-black text-xs border border-blue-200 dark:border-blue-800 transition-all shadow-2xs self-start sm:self-center shrink-0"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Tiếp tục chọn thêm máy khác</span>
                </Link>
            </div>

      {/* 3. Nội dung giỏ hàng */}
      {gio_hang.danh_sach_muc.length > 0 ? (<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cột Trái (8 Cột): Danh Sách Món Hàng & Voucher */}
          <div className="lg:col-span-8 space-y-6">
            <DanhSachMucGioHang />
            <NhapMaGiamGia />
          </div>

          {/* Cột Phải (4 Cột): Tóm Tắt Thanh Toán */}
          <div className="lg:col-span-4">
            <TomTatThanhToan />
          </div>
        </div>) : (
        /* Trạng Thái Giỏ Hàng Trống */
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-sky-500/10 text-sky-500 mx-auto flex items-center justify-center">
            <ShoppingBag className="w-10 h-10"/>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Giỏ hàng của bạn đang trống
            </h3>
            <p className="text-xs text-slate-400">
              Hãy dạo một vòng để khám phá những mẫu laptop đỉnh cao với ưu đãi giảm giá tốt nhất hôm nay nhé!
            </p>
          </div>

          <Link href="/san-pham" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-sky-500/20 hover:scale-105 transition-all">
            <span>Khám Phá Laptop Ngay</span>
            <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>)}
    </div>);
}
