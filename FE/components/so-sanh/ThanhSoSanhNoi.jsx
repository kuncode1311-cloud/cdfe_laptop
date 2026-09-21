'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X, Plus, GitCompare, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useSoSanh } from '@/contexts/CompareContext';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import ModalChonSanPhamSoSanh from './ModalChonSanPhamSoSanh';

export default function ThanhSoSanhNoi() {
    const pathname = usePathname();
    const {
        danh_sach_so_sanh,
        xoaKhoiSoSanh,
        xoaTatCaSoSanh,
        thanhSoSanhMoRong,
        setThanhSoSanhMoRong,
        moModalChonThem,
        setMoModalChonThem
    } = useSoSanh();

    // Ẩn thanh nổi khi đang ở trang chi tiết so sánh (/so-sanh) hoặc trang admin
    const laTrangSoSanh = pathname === '/so-sanh';
    const laTrangAdmin = pathname?.startsWith('/admin');

    if (laTrangSoSanh || laTrangAdmin || !danh_sach_so_sanh || danh_sach_so_sanh.length === 0) {
        return (
            <ModalChonSanPhamSoSanh
                isOpen={moModalChonThem}
                onClose={() => setMoModalChonThem(false)}
            />
        );
    }

    const soLuongTrong = Math.max(0, 3 - danh_sach_so_sanh.length);

    return (
        <>
            <ModalChonSanPhamSoSanh
                isOpen={moModalChonThem}
                onClose={() => setMoModalChonThem(false)}
            />

            {/* Khi thu gọn: Hiển thị thanh mini pill ghim góc dưới phải */}
            {!thanhSoSanhMoRong ? (
                <div className="fixed bottom-4 right-4 z-[990] animate-in slide-in-from-bottom-3 duration-200">
                    <button
                        type="button"
                        onClick={() => setThanhSoSanhMoRong(true)}
                        className="px-3.5 py-2 rounded-full bg-[#0052cc] hover:bg-[#003da5] text-white font-bold text-xs flex items-center gap-2 shadow-2xl hover:shadow-blue-500/30 cursor-pointer border border-white/25 transition-transform active:scale-95"
                    >
                        <GitCompare className="w-3.5 h-3.5 text-cyan-300" />
                        <span>So sánh ({danh_sach_so_sanh.length})</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                </div>
            ) : (
                /* Khi mở rộng: Thanh nổi siêu gọn nhẹ (Chiều cao chỉ ~72px chuẩn TGDD) */
                <div className="fixed bottom-0 left-0 right-0 z-[990] animate-in slide-in-from-bottom-4 duration-200">
                    <div className="max-w-4xl mx-auto px-2 sm:px-4">
                        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-t-2xl border-t border-x border-slate-200 dark:border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] overflow-hidden">
                            {/* Thanh nội dung 1 dòng duy nhất siêu tinh gọn */}
                            <div className="px-3 py-2 flex items-center justify-between gap-2 sm:gap-3">
                                {/* Danh Sách 3 Ô Sản Phẩm Nằm Ngang */}
                                <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-none py-0.5">
                                    {/* Sản phẩm đã chọn */}
                                    {danh_sach_so_sanh.map((sp) => (
                                        <div
                                            key={sp.id}
                                            className="relative h-13 px-2 py-1 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 flex items-center gap-2 min-w-[150px] sm:min-w-[170px] max-w-[200px] shrink-0 group"
                                        >
                                            {/* Nút Xóa Khỏi So Sánh */}
                                            <button
                                                type="button"
                                                onClick={() => xoaKhoiSoSanh(sp.id)}
                                                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 hover:bg-red-500 hover:text-white text-slate-600 dark:text-slate-300 flex items-center justify-center text-[9px] cursor-pointer shadow-xs transition-colors z-10"
                                                title="Xóa máy này"
                                            >
                                                <X className="w-2.5 h-2.5" />
                                            </button>

                                            {/* Ảnh thumbnail */}
                                            <div className="relative w-10 h-10 rounded-lg bg-white dark:bg-slate-900 p-0.5 shrink-0 overflow-hidden border border-slate-100 dark:border-slate-800">
                                                <Image
                                                    src={sp.hinh_anh_chinh}
                                                    alt={sp.ten_san_pham}
                                                    fill
                                                    className="object-contain"
                                                    unoptimized
                                                />
                                            </div>

                                            {/* Tên & Giá */}
                                            <div className="min-w-0 flex-1">
                                                <h5 className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate" title={sp.ten_san_pham}>
                                                    {sp.ten_san_pham}
                                                </h5>
                                                <span className="text-[10.5px] font-black text-[#EA1E2C] block">
                                                    {dinhDangTienVND(sp.gia_khuyen_mai)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Các ô còn trống */}
                                    {Array.from({ length: soLuongTrong }).map((_, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setMoModalChonThem(true)}
                                            className="h-13 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0052cc] text-slate-400 hover:text-[#0052cc] flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer text-[11px] font-bold"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span>Thêm máy</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Cụm Nút So Sánh & Thu Gọn Gọn Gàng Bên Phải */}
                                <div className="flex items-center gap-2 shrink-0 pl-2 border-l border-slate-200 dark:border-slate-800">
                                    <div className="flex flex-col items-center">
                                        <Link
                                            href="/so-sanh"
                                            className="h-9 px-3.5 rounded-xl bg-[#0052cc] hover:bg-[#003da5] text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95"
                                        >
                                            <span>So sánh ngay</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={xoaTatCaSoSanh}
                                            className="text-[10px] text-slate-400 hover:text-red-500 cursor-pointer transition-colors mt-0.5"
                                        >
                                            Xóa hết
                                        </button>
                                    </div>

                                    {/* Nút Thu Gọn */}
                                    <button
                                        type="button"
                                        onClick={() => setThanhSoSanhMoRong(false)}
                                        className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
                                        title="Thu gọn thanh so sánh"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
