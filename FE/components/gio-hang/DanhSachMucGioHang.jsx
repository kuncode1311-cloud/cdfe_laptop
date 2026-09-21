'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, Gift } from 'lucide-react';
import { useCart, useGioHang } from '@/contexts/CartContext';
import { formatCurrency, dinhDangTienVND } from '@/utils/formatCurrency';
import { slugSanPham } from '@/utils/taoSlug';
export default function DanhSachMucGioHang() {
    const { gio_hang, capNhatSoLuong, xoaKhoiGioHang } = useGioHang();
    return (<div className="space-y-4">
      {gio_hang.danh_sach_muc.map((muc) => (<div key={muc.id_muc} className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200 dark:border-slate-800">
          {/* 1. Ảnh & Thông Tin Sản Phẩm */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Link href={`/san-pham/${slugSanPham(muc.san_pham)}`} className="relative w-20 h-20 rounded-xl bg-slate-50 dark:bg-slate-800 overflow-hidden shrink-0 block">
              <Image src={muc.san_pham.hinh_anh_chinh} alt={muc.san_pham.ten_san_pham} fill className="object-contain p-1.5"/>
            </Link>

            <div className="space-y-1 min-w-0">
              <span className="text-[10px] font-bold uppercase text-sky-600 dark:text-cyan-400">
                {muc.san_pham.hang_san_xuat}
              </span>
              <Link href={`/san-pham/${slugSanPham(muc.san_pham)}`}>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-sky-600 dark:hover:text-cyan-400 transition-colors">
                  {muc.san_pham.ten_san_pham}
                </h3>
              </Link>
              {muc.tuy_chon_chon && (<div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Cấu hình: {muc.tuy_chon_chon.ten_tuy_chon}
                </div>)}
              {muc.san_pham.qua_tang.length > 0 && (<div className="flex items-center gap-1 text-[10.5px] text-emerald-600 dark:text-emerald-400">
                  <Gift className="w-3 h-3"/>
                  <span className="truncate">Tặng: {muc.san_pham.qua_tang[0].ten_qua_tang}</span>
                </div>)}
            </div>
          </div>

          {/* 2. Giá Đơn Vị & Tăng Giảm Số Lượng */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
            <div className="text-left sm:text-right">
              <div className="text-sm sm:text-base font-extrabold text-red-600 dark:text-rose-400">
                {dinhDangTienVND(muc.tong_tien_muc)}
              </div>
              <div className="text-[11px] text-slate-400">
                Đơn giá: {dinhDangTienVND(muc.gia_hien_tai)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Bộ Tăng Giảm Số Lượng */}
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                <button onClick={() => capNhatSoLuong(muc.id_muc, muc.so_luong - 1)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer" title="Giảm số lượng">
                  <Minus className="w-3.5 h-3.5"/>
                </button>
                <span className="px-3 text-xs font-bold text-slate-900 dark:text-white">
                  {muc.so_luong}
                </span>
                <button onClick={() => capNhatSoLuong(muc.id_muc, muc.so_luong + 1)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer" title="Tăng số lượng">
                  <Plus className="w-3.5 h-3.5"/>
                </button>
              </div>

              {/* Nút Xóa Khỏi Giỏ */}
              <button onClick={() => xoaKhoiGioHang(muc.id_muc)} className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer" title="Xóa khỏi giỏ hàng">
                <Trash2 className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>))}
    </div>);
}
