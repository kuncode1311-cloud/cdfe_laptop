'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { Eye, ShoppingCart } from 'lucide-react';

/**
 * Thẻ Sản Phẩm siêu gọn (Ultra-Compact Horizontal Strip)
 * Cao chỉ ~52px, phân định rõ ràng 2 thao tác:
 * - [Xem]: Xem chi tiết sản phẩm (/san-pham/[slug])
 * - [+ Giỏ]: Thêm vào giỏ hàng tại chỗ (Chỉ 1 toast duy nhất, không đá sang trang thanh toán ép đăng nhập)
 */
export default function TheSanPhamGoiY({ sanPham, onDongHopChat }) {
    const router = useRouter();
    const { themVaoGioHang } = useCart();

    if (!sanPham) return null;

    const giaKM = (sanPham.gia_khuyen_mai || 0).toLocaleString('vi-VN');
    const giaGoc = sanPham.gia_goc ? sanPham.gia_goc.toLocaleString('vi-VN') : null;
    const phanTramGiam = sanPham.phan_tram_giam_gia || 0;
    const hinhAnh = sanPham.hinh_anh_chinh || '/images/sp/macbook_pro_16_m3max.jpg';

    // Thêm vào giỏ hàng tại chỗ: CartContext tự hiển thị 1 toast duy nhất, KHÔNG chuyển trang
    const xuLyThemGio = (e) => {
        e.stopPropagation();
        themVaoGioHang(sanPham, sanPham.tuy_chon_phien_ban?.[0], 1);
    };

    // Chuyển tới trang chi tiết khi bấm vào "Xem" hoặc click vào thân thẻ
    const xuLyXemChiTiet = (e) => {
        if (e) e.stopPropagation();
        if (onDongHopChat) onDongHopChat();
        router.push(`/san-pham/${sanPham.slug || sanPham.id}`);
    };

    return (
        <div 
            onClick={xuLyXemChiTiet}
            className="group relative flex items-center gap-2.5 bg-white hover:bg-blue-50/40 border border-slate-300 hover:border-blue-500 rounded-xl p-2.5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-left overflow-hidden"
            title="Bấm để xem chi tiết sản phẩm"
        >
            {/* Ảnh đại diện sản phẩm nhỏ gọn vuông vắn */}
            <div className="relative w-11 h-11 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center p-0.5">
                <img
                    src={hinhAnh}
                    alt={sanPham.ten_san_pham}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                        e.currentTarget.src = '/images/sp/macbook_pro_16_m3max.jpg';
                    }}
                />
            </div>

            {/* Thông tin ở giữa: Tên + Hãng + Giá */}
            <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-extrabold uppercase px-1 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-300 flex-shrink-0">
                        {sanPham.hang_san_xuat || 'SP'}
                    </span>
                    <h4 className="text-[12px] font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors leading-tight">
                        {sanPham.ten_san_pham}
                    </h4>
                </div>

                {/* Hàng giá + % giảm */}
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs font-black text-red-600 tracking-tight">
                        {giaKM}đ
                    </span>
                    {phanTramGiam > 0 && (
                        <span className="text-[9px] font-extrabold text-red-700 bg-red-100 border border-red-300 px-1 rounded">
                            -{phanTramGiam}%
                        </span>
                    )}
                    {giaGoc && giaGoc !== giaKM && (
                        <span className="text-[10px] text-slate-500 line-through hidden sm:inline">
                            {giaGoc}đ
                        </span>
                    )}
                </div>
            </div>

            {/* 2 Nút hành động rõ ràng bên phải: [Xem] và [+ Giỏ] */}
            <div className="flex-shrink-0 flex items-center gap-1.5">
                {/* Nút Xem chi tiết */}
                <button
                    type="button"
                    onClick={xuLyXemChiTiet}
                    className="text-[11px] font-bold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-100 px-2 py-1.5 rounded-lg border border-slate-300 transition-all flex items-center gap-0.5 cursor-pointer"
                    title="Xem chi tiết sản phẩm"
                >
                    <Eye className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-600" />
                    <span className="hidden sm:inline">Xem</span>
                </button>

                {/* Nút Thêm vào giỏ hàng (Không chuyển trang, không popup đăng nhập) */}
                <button
                    type="button"
                    onClick={xuLyThemGio}
                    className="text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 px-2.5 py-1.5 rounded-lg shadow-sm shadow-blue-600/20 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    title="Thêm vào giỏ hàng ngay"
                >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>+ Giỏ</span>
                </button>
            </div>
        </div>
    );
}
