'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const WishlistContext = createContext(undefined);
const WISHLIST_STORAGE_KEY = 'laptopnew_yeu_thich_data';

export function WishlistProvider({ children }) {
    const [danhSachYeuThich, setDanhSachYeuThich] = useState([]);
    const [daKhoiTao, setDaKhoiTao] = useState(false);

    useEffect(() => {
        try {
            const duLieu = localStorage.getItem(WISHLIST_STORAGE_KEY);
            if (duLieu) {
                setDanhSachYeuThich(JSON.parse(duLieu));
            }
        } catch (e) {
            console.error(e);
        }
        setDaKhoiTao(true);
    }, []);

    useEffect(() => {
        if (!daKhoiTao) return;
        try {
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(danhSachYeuThich));
        } catch (e) {
            console.error(e);
        }
    }, [danhSachYeuThich, daKhoiTao]);

    const chuyenDoiYeuThich = (sanPham) => {
        const daCo = danhSachYeuThich.some((sp) => sp.id === sanPham.id);
        if (daCo) {
            setDanhSachYeuThich((ds) => ds.filter((sp) => sp.id !== sanPham.id));
            toast.info(`Đã bỏ lưu "${sanPham.ten_san_pham.substring(0, 30)}..."`);
        } else {
            setDanhSachYeuThich((ds) => [...ds, sanPham]);
            toast.success(`Đã thêm vào danh sách Yêu thích ❤️`);
        }
    };

    const xoaKhoiYeuThich = (idSanPham) => {
        setDanhSachYeuThich((ds) => ds.filter((sp) => sp.id !== idSanPham));
        toast.info('Đã xóa khỏi danh sách yêu thích.');
    };

    const kiemTraDaThich = (idSanPham) => {
        return danhSachYeuThich.some((sp) => sp.id === idSanPham);
    };

    return (
        <WishlistContext.Provider
            value={{
                danh_sach_yeu_thich: danhSachYeuThich,
                wishlist: danhSachYeuThich,
                chuyenDoiYeuThich,
                toggleWishlist: chuyenDoiYeuThich,
                xoaKhoiYeuThich,
                removeFromWishlist: xoaKhoiYeuThich,
                kiemTraDaThich,
                isInWishlist: kiemTraDaThich
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}

// Alias tương thích
export const useYeuThich = useWishlist;
export const NhaCungCapYeuThich = WishlistProvider;
export const NguCanhYeuThich = WishlistContext;
