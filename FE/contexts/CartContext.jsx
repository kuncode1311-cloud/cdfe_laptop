'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { MaGiamGiaService } from '@/services/ma-giam-gia.service';
import { toast } from 'sonner';

export const CartContext = createContext(undefined);
const CART_STORAGE_KEY = 'laptopnew_gio_hang_data';

export function CartProvider({ children }) {
    const [danhSachMuc, setDanhSachMuc] = useState([]);
    const [maGiamGiaDaDung, setMaGiamGiaDaDung] = useState(undefined);
    const [tienGiamGia, setTienGiamGia] = useState(0);
    const [daKhoiTao, setDaKhoiTao] = useState(false);

    // Đọc giỏ hàng từ LocalStorage khi khởi động
    useEffect(() => {
        try {
            const duLieu = localStorage.getItem(CART_STORAGE_KEY);
            if (duLieu) {
                const parsed = JSON.parse(duLieu);
                if (Array.isArray(parsed.danhSachMuc)) {
                    setDanhSachMuc(parsed.danhSachMuc);
                }
                if (parsed.maGiamGiaDaDung) {
                    setMaGiamGiaDaDung(parsed.maGiamGiaDaDung);
                    setTienGiamGia(parsed.tienGiamGia || 0);
                }
            }
        } catch (e) {
            console.error(e);
        }
        setDaKhoiTao(true);
    }, []);

    // Lắng nghe sự kiện đăng xuất để xóa sạch giỏ hàng của phiên cũ
    useEffect(() => {
        const xuLyDangXuat = () => {
            setDanhSachMuc([]);
            setMaGiamGiaDaDung(undefined);
            setTienGiamGia(0);
            try {
                localStorage.removeItem(CART_STORAGE_KEY);
            } catch (e) {}
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('auth:logout', xuLyDangXuat);
            return () => window.removeEventListener('auth:logout', xuLyDangXuat);
        }
    }, []);

    // Tự động lưu vào LocalStorage mỗi khi giỏ hàng thay đổi
    useEffect(() => {
        if (!daKhoiTao) return;
        try {
            localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify({ danhSachMuc, maGiamGiaDaDung, tienGiamGia })
            );
        } catch (e) {
            console.error(e);
        }
    }, [danhSachMuc, maGiamGiaDaDung, tienGiamGia, daKhoiTao]);

    // Tính toán các tổng số
    const tongSoLuong = danhSachMuc.reduce((tong, muc) => tong + muc.so_luong, 0);
    const tamTinh = danhSachMuc.reduce((tong, muc) => tong + muc.tong_tien_muc, 0);
    const phiVanChuyen = 0; // Miễn phí vận chuyển toàn quốc
    const tongThanhToan = Math.max(0, tamTinh - tienGiamGia + phiVanChuyen);

    const gioHang = {
        danh_sach_muc: danhSachMuc,
        tong_so_luong: tongSoLuong,
        tam_tinh: tamTinh,
        tien_giam_gia: tienGiamGia,
        ma_giam_gia_da_dung: maGiamGiaDaDung,
        phi_van_chuyen: phiVanChuyen,
        tong_thanh_toan: tongThanhToan
    };

    const themVaoGioHang = (sanPham, tuyChon, soLuong = 1) => {
        const idTuyChon = tuyChon ? tuyChon.ma_tuy_chon : 'mac_dinh';
        const idMuc = `${sanPham.id}_${idTuyChon}`;
        const chenhLech = tuyChon ? tuyChon.chenh_lech_gia : 0;
        const giaHienTai = sanPham.gia_khuyen_mai + chenhLech;

        setDanhSachMuc((danhSachCu) => {
            const tonTai = danhSachCu.find((m) => m.id_muc === idMuc);
            if (tonTai) {
                return danhSachCu.map((m) =>
                    m.id_muc === idMuc
                        ? {
                            ...m,
                            so_luong: m.so_luong + soLuong,
                            tong_tien_muc: (m.so_luong + soLuong) * m.gia_hien_tai
                        }
                        : m
                );
            } else {
                const mucMoi = {
                    id_muc: idMuc,
                    san_pham: sanPham,
                    tuy_chon_chon: tuyChon,
                    so_luong: soLuong,
                    gia_hien_tai: giaHienTai,
                    tong_tien_muc: giaHienTai * soLuong
                };
                return [...danhSachCu, mucMoi];
            }
        });
        toast.success(`Đã thêm "${sanPham.ten_san_pham.substring(0, 35)}..." vào giỏ hàng!`);
    };

    const xoaKhoiGioHang = (idMuc) => {
        setDanhSachMuc((danhSachCu) => danhSachCu.filter((m) => m.id_muc !== idMuc));
        toast.info('Đã xóa sản phẩm khỏi giỏ hàng.');
    };

    const capNhatSoLuong = (idMuc, soLuong) => {
        if (soLuong <= 0) {
            xoaKhoiGioHang(idMuc);
            return;
        }
        setDanhSachMuc((danhSachCu) =>
            danhSachCu.map((m) =>
                m.id_muc === idMuc
                    ? {
                        ...m,
                        so_luong: soLuong,
                        tong_tien_muc: soLuong * m.gia_hien_tai
                    }
                    : m
            )
        );
    };

    const xoaSachGioHang = () => {
        setDanhSachMuc([]);
        setMaGiamGiaDaDung(undefined);
        setTienGiamGia(0);
    };

    const apDungVoucher = async (maCode) => {
        const ketQua = await MaGiamGiaService.kiemTraMaGiamGiaAsync(maCode, tamTinh);
        if (ketQua.hop_le) {
            setMaGiamGiaDaDung(ketQua.ma_ap_dung?.ma_code || maCode.trim().toUpperCase());
            setTienGiamGia(ketQua.so_tien_giam);
            toast.success(ketQua.thong_diep);
            return { thanhCong: true, thongDiep: ketQua.thong_diep };
        } else {
            toast.error(ketQua.thong_diep);
            return { thanhCong: false, thongDiep: ketQua.thong_diep };
        }
    };

    const huyVoucher = () => {
        setMaGiamGiaDaDung(undefined);
        setTienGiamGia(0);
        toast.info('Đã hủy áp dụng mã giảm giá.');
    };

    return (
        <CartContext.Provider
            value={{
                gio_hang: gioHang,
                cart: gioHang,
                themVaoGioHang,
                addToCart: themVaoGioHang,
                xoaKhoiGioHang,
                removeFromCart: xoaKhoiGioHang,
                capNhatSoLuong,
                updateQuantity: capNhatSoLuong,
                xoaSachGioHang,
                clearCart: xoaSachGioHang,
                apDungVoucher,
                applyVoucher: apDungVoucher,
                huyVoucher,
                removeVoucher: huyVoucher
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

// Alias tương thích
export const useGioHang = useCart;
export const NhaCungCapGioHang = CartProvider;
export const NguCanhGioHang = CartContext;
