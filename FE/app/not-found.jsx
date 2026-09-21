'use client';
import React from 'react';
import Link from 'next/link';
import { Home, Search, Laptop, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      {/* 404 Visual Icon */}
      <div className="relative">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 flex items-center justify-center text-blue-600 dark:text-cyan-400">
          <Laptop className="w-14 h-14 sm:w-20 sm:h-20 animate-bounce" />
        </div>
        <span className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs sm:text-sm shadow-lg">
          404
        </span>
      </div>

      {/* Message */}
      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          Không Tìm Thấy Trang
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Trang hoặc sản phẩm bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc đường dẫn không còn khả dụng.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="px-5 py-3 rounded-2xl bg-[#0052cc] hover:bg-[#003da5] dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
        >
          <Home className="w-4 h-4" />
          <span>Về Trang Chủ</span>
        </Link>

        <Link
          href="/san-pham"
          className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors"
        >
          <Search className="w-4 h-4 text-blue-500" />
          <span>Khám Phá Sản Phẩm</span>
        </Link>
      </div>
    </div>
  );
}
