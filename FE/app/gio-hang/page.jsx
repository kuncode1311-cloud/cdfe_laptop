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
    return (<div className="space-y-8">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
          <Home className="w-3.5 h-3.5"/>
          <span>Trang Chủ</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5"/>
        <span className="font-semibold text-slate-900 dark:text-white">Giỏ Hàng Của Bạn</span>
      </nav>

      {/* 2. Tiêu đề */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            GIỎ HÀNG CỦA BẠN
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Đang có <strong className="text-slate-900 dark:text-white font-bold">{gio_hang.tong_so_luong}</strong> sản phẩm trong giỏ
          </p>
        </div>

        <Link href="/san-pham" className="text-xs font-bold text-sky-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4"/>
          <span>Tiếp tục chọn thêm máy</span>
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
