'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, Gift, Cpu, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useGioHang } from '@/contexts/CartContext';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import { slugSanPham } from '@/utils/taoSlug';

export default function DanhSachMucGioHang() {
    const { gio_hang, capNhatSoLuong, xoaKhoiGioHang } = useGioHang();

    return (
        <div className="space-y-4">
            {gio_hang.danh_sach_muc.map((muc) => {
                const cauHinh = muc.tuy_chon_chon?.ten_tuy_chon || muc.tuy_chon_chon?.ram || muc.san_pham?.ram;
                const coQuaTang = muc.san_pham?.qua_tang && muc.san_pham.qua_tang.length > 0;

                return (
                    <div
                        key={muc.id_muc}
                        className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 overflow-hidden"
                    >
                        {/* Thanh Dải Màu Gradient Nổi Bật Trên Đỉnh Card */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-[#0052cc] via-indigo-600 to-cyan-400" />

                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            {/* 1. Ảnh & Thông Tin Laptop */}
                            <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                                {/* Khung ảnh máy bo tròn, viền gradient nhẹ */}
                                <Link
                                    href={`/san-pham/${slugSanPham(muc.san_pham)}`}
                                    className="relative w-22 h-22 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-800/60 border-2 border-slate-200 dark:border-slate-700 p-2 shrink-0 block overflow-hidden group shadow-2xs"
                                >
                                    <Image
                                        src={muc.san_pham.hinh_anh_chinh || '/placeholder.png'}
                                        alt={muc.san_pham.ten_san_pham}
                                        fill
                                        unoptimized
                                        className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                                    />
                                </Link>

                                {/* Chi tiết thông tin cấu hình & tên */}
                                <div className="space-y-2 min-w-0 flex-1">
                                    {/* Hãng & SKU phong cách thể thao công nghệ */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="px-3 py-0.5 rounded-lg bg-gradient-to-r from-[#0052cc] to-blue-700 text-white text-[11px] font-black uppercase tracking-wider shadow-sm shadow-blue-600/20">
                                            {muc.san_pham.hang_san_xuat}
                                        </span>
                                        {muc.san_pham.ma_san_pham && (
                                            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                                SKU: {muc.san_pham.ma_san_pham}
                                            </span>
                                        )}
                                        <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                                            <Check className="w-3 h-3 stroke-[3]" />
                                            <span>Sẵn Hàng</span>
                                        </span>
                                    </div>

                                    {/* Tên laptop chữ to đậm rõ nét */}
                                    <Link href={`/san-pham/${slugSanPham(muc.san_pham)}`} className="block">
                                        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white line-clamp-2 hover:text-[#0052cc] dark:hover:text-cyan-400 transition-colors leading-snug">
                                            {muc.san_pham.ten_san_pham}
                                        </h3>
                                    </Link>

                                    {/* Tag cấu hình & Quà tặng đậm đà, màu sắc rực rỡ */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        {cauHinh && (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/60 dark:to-indigo-950/60 border border-blue-200 dark:border-blue-800 text-[#0052cc] dark:text-cyan-300 text-xs font-extrabold shadow-2xs">
                                                <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                                                <span>Cấu hình: {cauHinh}</span>
                                            </div>
                                        )}

                                        {coQuaTang && (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/60 dark:to-orange-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-extrabold truncate max-w-xs shadow-2xs">
                                                <Gift className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                                <span className="truncate">Tặng: {muc.san_pham.qua_tang[0].ten_qua_tang}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 2. Cột Giá & Bộ Tăng Giảm Số Lượng Sang Xịn Tone Đậm */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
                                {/* Hộp giá tiền nổi khối rực rỡ */}
                                <div className="text-left sm:text-right bg-gradient-to-br from-rose-50 to-red-50/60 dark:from-rose-950/40 dark:to-slate-900 border-2 border-red-200 dark:border-rose-900/60 px-3.5 py-1.5 rounded-xl">
                                    <div className="text-base sm:text-xl font-black text-red-600 dark:text-rose-400 tracking-tight font-mono">
                                        {dinhDangTienVND(muc.tong_tien_muc)}
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                                        Đơn giá: {dinhDangTienVND(muc.gia_hien_tai)}
                                    </div>
                                </div>

                                {/* Bộ Tăng Giảm Số Lượng Tone Sáng Hiện Đại (Không bị tối) */}
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl p-1 shadow-2xs">
                                        <button
                                            type="button"
                                            onClick={() => capNhatSoLuong(muc.id_muc, muc.so_luong - 1)}
                                            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-black hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 border border-slate-200 dark:border-slate-600 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-2xs"
                                            title="Giảm số lượng"
                                        >
                                            <Minus className="w-4 h-4 stroke-[2.5]" />
                                        </button>

                                        <span className="w-10 text-center font-mono font-black text-sm text-slate-900 dark:text-white select-none">
                                            {muc.so_luong}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => capNhatSoLuong(muc.id_muc, muc.so_luong + 1)}
                                            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-black hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 border border-slate-200 dark:border-slate-600 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-2xs"
                                            title="Tăng số lượng"
                                        >
                                            <Plus className="w-4 h-4 stroke-[2.5]" />
                                        </button>
                                    </div>

                                    {/* Nút Xóa Thùng Rác Gradient Đỏ Nổi Khối */}
                                    <button
                                        type="button"
                                        onClick={() => xoaKhoiGioHang(muc.id_muc)}
                                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-md shadow-rose-500/20 transition-all flex items-center justify-center cursor-pointer active:scale-90"
                                        title="Xóa sản phẩm này khỏi giỏ hàng"
                                    >
                                        <Trash2 className="w-4 h-4 stroke-[2.5]" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
