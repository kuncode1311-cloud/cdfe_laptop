'use client';
import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight, Heart, ArrowRight } from 'lucide-react';
import { useWishlist, useYeuThich } from '@/contexts/WishlistContext';
import TheSanPham from '@/components/san-pham/TheSanPham';
export default function TrangYeuThich() {
    const { danh_sach_yeu_thich } = useYeuThich();
    return (<div className="space-y-8">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
          <Home className="w-3.5 h-3.5"/>
          <span>Trang Chủ</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5"/>
        <span className="font-semibold text-slate-900 dark:text-white">Laptop Yêu Thích Của Bạn</span>
      </nav>

      {/* 2. Tiêu đề */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500"/>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              DANH SÁCH LAPTOP ĐÃ LƯU
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Đang lưu <strong className="text-slate-900 dark:text-white font-bold">{danh_sach_yeu_thich.length}</strong> mẫu laptop yêu thích
          </p>
        </div>

        <Link href="/san-pham" className="text-xs font-bold text-sky-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
          <span>Khám phá thêm</span>
          <ArrowRight className="w-4 h-4"/>
        </Link>
      </div>

      {/* 3. Lưới Sản Phẩm Yêu Thích */}
      {danh_sach_yeu_thich.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {danh_sach_yeu_thich.map((sp) => (<TheSanPham key={sp.id} sanPham={sp} cheDoHienThi="luoi"/>))}
        </div>) : (<div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8"/>
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Bạn chưa lưu sản phẩm nào vào mục Yêu thích
          </h3>
          <p className="text-xs text-slate-400">
            Nhấn vào biểu tượng trái tim ❤️ ở bất kỳ sản phẩm nào để lưu lại và theo dõi biến động giá bạn nhé.
          </p>
          <Link href="/san-pham" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 dark:bg-cyan-500 text-white dark:text-slate-950 text-xs font-bold">
            <span>Khám Phá Laptop Ngay</span>
            <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>)}
    </div>);
}
