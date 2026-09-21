'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const CompareContext = createContext(undefined);
const COMPARE_STORAGE_KEY = 'laptopnew_so_sanh_data';

/**
 * Xác định phân loại sản phẩm (Laptop, Chuột, Bàn phím, Tai nghe, hoặc Không hỗ trợ so sánh)
 */
export function layLoaiSanPham(sp) {
    if (!sp) return 'khong_ho_tro';
    const danhMuc = Array.isArray(sp.danh_muc) ? sp.danh_muc : [];
    const ten = (sp.ten_san_pham || '').toLowerCase();

    // 1. Phụ kiện KHÔNG hỗ trợ so sánh: Balo, Túi chống sốc, Lót chuột, Dây cáp, Củ sạc, v.v.
    if (
        danhMuc.includes('balo-tui-chong-soc') ||
        danhMuc.includes('phu-kien-gear') && !danhMuc.includes('chuot-lot-chuot') && !danhMuc.includes('ban-phim-co') && !danhMuc.includes('tai-nghe-loa') ||
        ten.includes('túi chống sốc') ||
        ten.includes('túi đựng') ||
        ten.includes('balo') ||
        ten.includes('cặp') ||
        ten.includes('tomtoc') ||
        ten.includes('lót chuột') ||
        ten.includes('mousepad') ||
        ten.includes('dây cáp') ||
        ten.includes('củ sạc') ||
        ten.includes('giá đỡ')
    ) {
        return 'khong_ho_tro';
    }

    // 2. Chuột gaming
    if (danhMuc.includes('chuot-lot-chuot') || ten.includes('chuột') || ten.includes('mouse')) {
        return 'chuot';
    }

    // 3. Bàn phím cơ
    if (danhMuc.includes('ban-phim-co') || ten.includes('bàn phím') || ten.includes('keyboard')) {
        return 'ban_phim';
    }

    // 4. Tai nghe / Loa
    if (danhMuc.some(d => ['tai-nghe-loa', 'tai-nghe', 'loa'].includes(d)) || ten.includes('tai nghe') || ten.includes('headphone')) {
        return 'tai_nghe';
    }

    // 5. Laptop chính hãng (Gaming, AI PC, Đồ họa, Mỏng nhẹ, MacBook...)
    return 'laptop';
}

export function coTheSoSanh(sp) {
    if (!sp) return false;
    const loai = layLoaiSanPham(sp);
    return loai === 'laptop' || loai === 'chuot' || loai === 'ban_phim' || loai === 'tai_nghe';
}

export function layTenLoaiSanPham(loai) {
    switch (loai) {
        case 'chuot': return 'Chuột Gaming';
        case 'ban_phim': return 'Bàn Phím Cơ';
        case 'tai_nghe': return 'Tai Nghe / Loa';
        case 'khong_ho_tro': return 'Phụ kiện';
        default: return 'Laptop';
    }
}

export function CompareProvider({ children }) {
    const [danhSachSoSanh, setDanhSachSoSanh] = useState([]);
    const [daKhoiTao, setDaKhoiTao] = useState(false);
    const [thanhSoSanhMoRong, setThanhSoSanhMoRong] = useState(true);
    const [moModalChonThem, setMoModalChonThem] = useState(false);

    useEffect(() => {
        try {
            const duLieu = localStorage.getItem(COMPARE_STORAGE_KEY);
            if (duLieu) {
                const parsed = JSON.parse(duLieu);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Tự động làm sạch dữ liệu cũ: Loại bỏ balo/túi chống sốc và chỉ giữ các sản phẩm CÙNG LOẠI
                    const danhSachHopLe = parsed.filter(sp => coTheSoSanh(sp));
                    if (danhSachHopLe.length > 0) {
                        const loaiDauTien = layLoaiSanPham(danhSachHopLe[0]);
                        const danhSachChuan = danhSachHopLe.filter(sp => layLoaiSanPham(sp) === loaiDauTien);
                        setDanhSachSoSanh(danhSachChuan);
                    } else {
                        setDanhSachSoSanh([]);
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
        setDaKhoiTao(true);
    }, []);

    useEffect(() => {
        if (!daKhoiTao) return;
        try {
            localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(danhSachSoSanh));
        } catch (e) {
            console.error(e);
        }
    }, [danhSachSoSanh, daKhoiTao]);

    const themVaoSoSanh = (sanPham) => {
        if (!sanPham) return;

        // Phụ kiện, túi chống sốc, balo KHÔNG hỗ trợ so sánh
        if (!coTheSoSanh(sanPham)) {
            toast.warning('Sản phẩm này (phụ kiện/túi chống sốc) không có cấu hình để so sánh!');
            return;
        }

        const daCo = danhSachSoSanh.some((sp) => sp.id === sanPham.id);
        if (daCo) {
            // Nếu đã có trong danh sách -> Click lại để gỡ bỏ (Toggle tiện lợi)
            setDanhSachSoSanh((ds) => ds.filter((sp) => sp.id !== sanPham.id));
            toast.info(`Đã gỡ "${sanPham.ten_san_pham.substring(0, 25)}..." khỏi so sánh.`);
            return;
        }

        // BẮT BUỘC CÙNG LOẠI: Không cho phép so sánh Chuột với Laptop!
        if (danhSachSoSanh.length > 0) {
            const loaiHienTai = layLoaiSanPham(danhSachSoSanh[0]);
            const loaiMoi = layLoaiSanPham(sanPham);
            if (loaiHienTai !== loaiMoi) {
                toast.error(
                    `Không thể so sánh ${layTenLoaiSanPham(loaiMoi)} với ${layTenLoaiSanPham(loaiHienTai)}! Bạn chỉ có thể so sánh các sản phẩm cùng loại với nhau.`,
                    { duration: 4000 }
                );
                return;
            }
        }

        if (danhSachSoSanh.length >= 3) {
            toast.warning('Bạn chỉ có thể so sánh tối đa 3 sản phẩm cùng lúc!');
            setThanhSoSanhMoRong(true);
            return;
        }
        setDanhSachSoSanh((ds) => [...ds, sanPham]);
        setThanhSoSanhMoRong(true);
        toast.success(`Đã thêm vào so sánh! (${danhSachSoSanh.length + 1}/3 sản phẩm)`);
    };

    const toggleSoSanh = themVaoSoSanh;

    const xoaKhoiSoSanh = (idSanPham) => {
        setDanhSachSoSanh((ds) => ds.filter((sp) => sp.id !== idSanPham));
        toast.info('Đã xóa sản phẩm khỏi danh sách so sánh.');
    };

    const xoaTatCaSoSanh = () => {
        setDanhSachSoSanh([]);
        toast.info('Đã xóa toàn bộ sản phẩm khỏi bảng so sánh.');
    };

    const kiemTraDaCoTrongSoSanh = (idSanPham) => {
        return danhSachSoSanh.some((sp) => sp.id === idSanPham);
    };

    return (
        <CompareContext.Provider
            value={{
                danh_sach_so_sanh: danhSachSoSanh,
                compareList: danhSachSoSanh,
                themVaoSoSanh,
                toggleSoSanh,
                addToCompare: themVaoSoSanh,
                xoaKhoiSoSanh,
                removeFromCompare: xoaKhoiSoSanh,
                xoaTatCaSoSanh,
                clearCompare: xoaTatCaSoSanh,
                kiemTraDaCoTrongSoSanh,
                isInCompare: kiemTraDaCoTrongSoSanh,
                thanhSoSanhMoRong,
                setThanhSoSanhMoRong,
                moModalChonThem,
                setMoModalChonThem
            }}
        >
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
}

// Alias tương thích
export const useSoSanh = useCompare;
export const NhaCungCapSoSanh = CompareProvider;
export const NguCanhSoSanh = CompareContext;
