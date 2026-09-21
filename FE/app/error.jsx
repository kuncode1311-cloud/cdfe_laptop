'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Ghi log lỗi runtime nếu cần
    console.error('Lỗi ứng dụng:', error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-red-500/10 text-red-600 dark:text-rose-400 flex items-center justify-center border border-red-500/20 shadow-xl shadow-red-500/10">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          Đã Xảy Ra Lỗi Không Mong Muốn!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Hệ thống đang gặp sự cố tạm thời khi tải nội dung này. Bạn có thể thử tải lại trang hoặc quay về trang chủ.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-red-500/20 transition-all hover:scale-105"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Thử Tải Lại</span>
        </button>

        <Link
          href="/san-pham"
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
        >
          <span>Xem Danh Sách Sản Phẩm</span>
        </Link>

        <Link
          href="/"
          className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Về Trang Chủ</span>
        </Link>
      </div>
    </div>
  );
}
