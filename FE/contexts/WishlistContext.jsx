'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { YeuThichService } from '@/services/yeu-thich.service';
import { useNguoiDung } from './AuthContext';
import { toast } from 'sonner';

export const WishlistContext = createContext(undefined);
const WISHLIST_STORAGE_KEY = 'laptopnew_yeu_thich_data';

export function WishlistProvider({ children }) {
    const { nguoiDung } = useNguoiDung();
    const idNguoiDung = nguoiDung?.id || nguoiDung?._id || null;
    const [danhSachYeuThich, setDanhSachYeuThich] = useState([]);
    const [daKhoiTao, setDaKhoiTao] = useState(false);
    // Ghi nhớ id người dùng của lần render trước, để biết lúc nào vừa đăng nhập / vừa đăng xuất
    const idNguoiDungTruocRef = useRef(null);

    // Khách vãng lai: đọc danh sách yêu thích đã lưu trong trình duyệt khi khởi động
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

    // Khách vãng lai: tự động lưu lại vào LocalStorage mỗi khi danh sách thay đổi.
    // Khi đã đăng nhập, server là nguồn thật duy nhất nên không ghi vào LocalStorage nữa.
    useEffect(() => {
        if (!daKhoiTao || idNguoiDung) return;
        try {
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(danhSachYeuThich));
        } catch (e) {
            console.error(e);
        }
    }, [danhSachYeuThich, daKhoiTao, idNguoiDung]);

    /**
     * ĐỒNG BỘ YÊU THÍCH THEO TÀI KHOẢN (chỉ khi đã đăng nhập).
     *  - Vừa đăng nhập: hợp nhất các sản phẩm yêu thích đã lưu cục bộ (lúc còn là khách vãng lai, nếu có)
     *    lên server (bỏ qua món server đã có), rồi lấy danh sách đầy đủ cuối cùng từ server làm chuẩn.
     *  - Vừa đăng xuất: quay lại đọc từ LocalStorage như một khách vãng lai bình thường.
     */
    useEffect(() => {
        if (!daKhoiTao) return;

        const idTruoc = idNguoiDungTruocRef.current;
        idNguoiDungTruocRef.current = idNguoiDung;

        if (!idNguoiDung) {
            if (idTruoc) {
                // Vừa đăng xuất: không còn dùng server nữa, quay lại danh sách lưu trong trình duyệt
                try {
                    const duLieu = localStorage.getItem(WISHLIST_STORAGE_KEY);
                    setDanhSachYeuThich(duLieu ? JSON.parse(duLieu) : []);
                } catch (e) {
                    setDanhSachYeuThich([]);
                }
            }
            return;
        }

        if (idTruoc === idNguoiDung) return; // tài khoản không đổi, không cần đồng bộ lại

        let daHuy = false;
        (async () => {
            let duLieuCucBo = [];
            try {
                const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
                const parsed = raw ? JSON.parse(raw) : [];
                duLieuCucBo = Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                duLieuCucBo = [];
            }

            const tuServer = await YeuThichService.layYeuThichAsync();
            if (daHuy) return;

            const idTrenServer = new Set(tuServer.map((sp) => sp.id));
            const canThem = duLieuCucBo.filter((sp) => sp && sp.id !== undefined && !idTrenServer.has(sp.id));

            if (canThem.length > 0) {
                await Promise.all(
                    canThem.map((sp) => YeuThichService.themYeuThichAsync(sp.id).catch(() => {}))
                );
                if (daHuy) return;
                const tuServerCuoi = await YeuThichService.layYeuThichAsync();
                if (daHuy) return;
                setDanhSachYeuThich(tuServerCuoi);
            } else {
                setDanhSachYeuThich(tuServer);
            }

            try {
                localStorage.removeItem(WISHLIST_STORAGE_KEY);
            } catch (e) {}
        })();

        return () => {
            daHuy = true;
        };
    }, [idNguoiDung, daKhoiTao]);

    const chuyenDoiYeuThich = (sanPham) => {
        const daCo = danhSachYeuThich.some((sp) => sp.id === sanPham.id);

        if (daCo) {
            xoaKhoiYeuThich(sanPham.id);
            return;
        }

        setDanhSachYeuThich((ds) => [...ds, sanPham]);
        toast.success(`Đã thêm vào danh sách Yêu thích ❤️`);

        if (idNguoiDung) {
            YeuThichService.themYeuThichAsync(sanPham.id).catch((loi) => {
                console.warn('[Yêu thích] Lỗi thêm:', loi.message);
                setDanhSachYeuThich((ds) => ds.filter((sp) => sp.id !== sanPham.id));
                toast.error('Không thể thêm vào danh sách yêu thích, vui lòng thử lại.');
            });
        }
    };

    const xoaKhoiYeuThich = (idSanPham) => {
        const spDaXoa = danhSachYeuThich.find((sp) => sp.id === idSanPham);
        setDanhSachYeuThich((ds) => ds.filter((sp) => sp.id !== idSanPham));
        toast.info('Đã xóa khỏi danh sách yêu thích.');

        if (idNguoiDung) {
            YeuThichService.xoaYeuThichAsync(idSanPham).catch((loi) => {
                console.warn('[Yêu thích] Lỗi xóa:', loi.message);
                if (spDaXoa) {
                    setDanhSachYeuThich((ds) => (ds.some((sp) => sp.id === idSanPham) ? ds : [...ds, spDaXoa]));
                }
                toast.error('Không thể xóa khỏi danh sách yêu thích, vui lòng thử lại.');
            });
        }
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
