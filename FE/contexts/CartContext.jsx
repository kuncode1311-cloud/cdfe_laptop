'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { MaGiamGiaService } from '@/services/ma-giam-gia.service';
import { SanPhamService } from '@/services/san-pham.service';
import { useDuLieuMoi } from '@/services/dong-bo.service';
import { GioHangService } from '@/services/gio-hang.service';
import { useNguoiDung } from './AuthContext';
import { toast } from 'sonner';

export const CartContext = createContext(undefined);
const CART_STORAGE_KEY = 'laptopnew_gio_hang_data';
// Ghi nhớ giỏ trong trình duyệt này đã được đồng bộ với tài khoản nào (để phân biệt "giỏ khách vãng lai" với "bản sao của giỏ trên server")
const KHOA_NGUOI_DA_DONG_BO = 'laptopnew_gio_hang_nguoi_dong_bo';

// Dạng gọn gửi lên server: không gồm giá, server luôn tự lấy giá thật
const rutGonMuc = (muc) => ({
    san_pham_id: muc.san_pham?.id,
    ma_tuy_chon: muc.tuy_chon_chon?.ma_tuy_chon || '',
    so_luong: muc.so_luong
});

// Đổi một dòng của server (kèm sản phẩm mới nhất) sang dạng dòng giỏ hàng dùng trên giao diện
const mucTuServer = (muc) => {
    const sp = muc.san_pham;
    const tuyChon = muc.ma_tuy_chon ? (sp.tuy_chon_phien_ban || []).find((x) => x.ma_tuy_chon === muc.ma_tuy_chon) : null;
    const gia = Number(sp.gia_khuyen_mai || sp.gia_goc || 0) + Number(tuyChon?.chenh_lech_gia || 0);
    return {
        id_muc: `${sp.id}_${muc.ma_tuy_chon || 'mac_dinh'}`,
        san_pham: sp,
        tuy_chon_chon: tuyChon || undefined,
        so_luong: muc.so_luong,
        gia_hien_tai: gia,
        tong_tien_muc: gia * muc.so_luong
    };
};

// Hợp nhất giỏ khách vãng lai vào giỏ trên server: món trùng lấy số lượng lớn hơn (không cộng dồn để F5 không nhân đôi)
const hopNhatGio = (tuServer, tuMayNay) => {
    const theoId = new Map(tuServer.map((m) => [m.id_muc, m]));
    for (const muc of tuMayNay) {
        const cu = theoId.get(muc.id_muc);
        if (!cu) theoId.set(muc.id_muc, muc);
        else if (muc.so_luong > cu.so_luong) {
            theoId.set(muc.id_muc, { ...cu, so_luong: muc.so_luong, tong_tien_muc: cu.gia_hien_tai * muc.so_luong });
        }
    }
    return [...theoId.values()];
};

export function CartProvider({ children }) {
    const { nguoiDung } = useNguoiDung();
    const idNguoiDung = nguoiDung?.id || null;
    const [danhSachMuc, setDanhSachMuc] = useState([]);
    const [maGiamGiaDaDung, setMaGiamGiaDaDung] = useState(undefined);
    const [tienGiamGia, setTienGiamGia] = useState(0);
    const [daKhoiTao, setDaKhoiTao] = useState(false);
    const daDongBoRef = useRef(null); // id người dùng đã đồng bộ giỏ với server (null = chưa / không đồng bộ)
    const lanDayCuoiRef = useRef('[]'); // nội dung giỏ gần nhất đã biết là khớp với server, để khỏi gửi lại thừa

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
            daDongBoRef.current = null; // phải ngắt trước, kẻo giỏ rỗng bị đẩy lên server và xóa mất giỏ của tài khoản
            setDanhSachMuc([]);
            setMaGiamGiaDaDung(undefined);
            setTienGiamGia(0);
            try {
                localStorage.removeItem(CART_STORAGE_KEY);
                localStorage.removeItem(KHOA_NGUOI_DA_DONG_BO);
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

    /**
     * ĐỒNG BỘ GIỎ THEO TÀI KHOẢN (chỉ khi đã đăng nhập; khách vãng lai vẫn dùng giỏ trong trình duyệt như cũ).
     *  - Khi đăng nhập / mở trang: kéo giỏ từ server. Nếu giỏ trong trình duyệt là giỏ khách vãng lai thì hợp nhất vào giỏ tài khoản;
     *    nếu nó đã là bản sao của giỏ tài khoản này thì lấy theo server (phản ánh thay đổi từ máy khác).
     *  - Sau đó mỗi thay đổi của giỏ được đẩy lên server (gộp 0,6 giây).
     *  - Quay lại tab hoặc đổi máy: kéo lại để luôn thấy giỏ mới nhất.
     */
    const keoGioTuServer = (idNguoi, laLanDau, daBiHuy) => {
        return GioHangService.layGioHangAsync().then(({ danh_sach_muc: tuServerTho, da_go: daGo }) => {
            if (daBiHuy()) return; // đã đăng xuất / đổi tài khoản / rời trang trong lúc chờ → bỏ kết quả
            if (!laLanDau && daDongBoRef.current !== idNguoi) return;
            const tuServer = tuServerTho.map(mucTuServer);
            const daTungDongBo = localStorage.getItem(KHOA_NGUOI_DA_DONG_BO) === idNguoi;
            setDanhSachMuc((cu) => {
                const moi = daTungDongBo ? tuServer : hopNhatGio(tuServer, cu);
                // Nếu bản mới không khác server thì không cần đẩy lại
                lanDayCuoiRef.current = JSON.stringify(tuServer.map(rutGonMuc));
                return moi;
            });
            localStorage.setItem(KHOA_NGUOI_DA_DONG_BO, idNguoi);
            daDongBoRef.current = idNguoi;
            if (daGo.length > 0) {
                toast.warning(`${daGo.length} sản phẩm trong giỏ đã hết hàng hoặc ngừng bán nên được gỡ: ${daGo.join(', ')}`);
            }
        });
    };

    useEffect(() => {
        if (!daKhoiTao || !idNguoiDung) {
            daDongBoRef.current = null;
            return;
        }
        let daHuy = false;
        keoGioTuServer(idNguoiDung, true, () => daHuy).catch(() => {
            /* server tạm thời lỗi: vẫn dùng giỏ trong trình duyệt, lần sau đồng bộ lại */
        });

        // Quay lại tab (hoặc mở lại trình duyệt) thì kéo lại giỏ để thấy thay đổi từ máy khác
        const khiHienLai = () => {
            if (!daHuy && document.visibilityState === 'visible' && daDongBoRef.current === idNguoiDung) {
                keoGioTuServer(idNguoiDung, false, () => daHuy).catch(() => {});
            }
        };
        document.addEventListener('visibilitychange', khiHienLai);
        return () => {
            daHuy = true;
            document.removeEventListener('visibilitychange', khiHienLai);
        };
    }, [daKhoiTao, idNguoiDung]);

    // Đẩy thay đổi của giỏ lên server (chỉ khi đã đồng bộ lần đầu cho đúng tài khoản này)
    useEffect(() => {
        if (!daKhoiTao || !idNguoiDung || daDongBoRef.current !== idNguoiDung) return;
        const noiDung = JSON.stringify(danhSachMuc.map(rutGonMuc));
        if (noiDung === lanDayCuoiRef.current) return;
        const hen = setTimeout(() => {
            GioHangService.luuGioHangAsync(danhSachMuc.map(rutGonMuc))
                .then(() => {
                    lanDayCuoiRef.current = noiDung;
                })
                .catch((loi) => console.warn('[Giỏ hàng] Chưa lưu được lên server:', loi.message));
        }, 600);
        return () => clearTimeout(hen);
    }, [danhSachMuc, daKhoiTao, idNguoiDung]);

    /**
     * Đồng bộ giỏ hàng với dữ liệu thật trên server.
     * Giỏ chỉ lưu trong trình duyệt khách (localStorage) kèm giá lúc bỏ vào giỏ, nên nếu Admin đổi giá
     * hoặc sản phẩm hết hàng thì giỏ phải tự cập nhật, khách khỏi thấy giá cũ rồi lúc thanh toán lại ra giá khác.
     * Chạy khi mở trang và mỗi khi bảng sản phẩm thay đổi (nhờ cơ chế tự làm mới dữ liệu).
     */
    const phienBanSanPham = useDuLieuMoi('san_pham');
    const danhSachMucMoiNhat = useRef(danhSachMuc);
    const maGiamGiaMoiNhat = useRef(maGiamGiaDaDung);
    useEffect(() => {
        // Giữ bản mới nhất để hàm bất đồng bộ bên dưới đọc đúng dữ liệu lúc nhận được phản hồi
        danhSachMucMoiNhat.current = danhSachMuc;
        maGiamGiaMoiNhat.current = maGiamGiaDaDung;
    });

    useEffect(() => {
        if (!daKhoiTao || danhSachMucMoiNhat.current.length === 0) return;
        let daHuy = false;

        SanPhamService.layTatCaSanPhamAsync()
            .then(async (tatCa) => {
                // Không có danh sách thật (lỗi mạng / rỗng) thì giữ nguyên giỏ, tránh xóa oan
                if (daHuy || !Array.isArray(tatCa) || tatCa.length === 0) return;
                const theoId = new Map(tatCa.map((sp) => [sp.id, sp]));
                const ten = (sp) => `"${String(sp?.ten_san_pham || '').substring(0, 35)}..."`;
                const tienVnd = (n) => `${Number(n).toLocaleString('vi-VN')} ₫`;

                const quyetDinh = new Map(); // id_muc → { xoa } hoặc { muc mới }
                const thongBao = [];
                for (const muc of danhSachMucMoiNhat.current) {
                    const sp = theoId.get(muc.san_pham?.id);
                    const khongBanDuoc = !sp || sp.con_hang === false || Number(sp.so_luong_ton_kho) <= 0;
                    if (khongBanDuoc) {
                        quyetDinh.set(muc.id_muc, { xoa: true });
                        thongBao.push(['warning', `${ten(muc.san_pham)} đã hết hàng hoặc ngừng bán nên được gỡ khỏi giỏ.`]);
                        continue;
                    }
                    const giaMoi = Number(sp.gia_khuyen_mai || sp.gia_goc || 0) + Number(muc.tuy_chon_chon?.chenh_lech_gia || 0);
                    const tonKho = Number(sp.so_luong_ton_kho);
                    const soLuongMoi = Number.isFinite(tonKho) ? Math.min(muc.so_luong, tonKho) : muc.so_luong;
                    if (giaMoi !== muc.gia_hien_tai) {
                        thongBao.push(['info', `Giá ${ten(sp)} đã thay đổi: ${tienVnd(muc.gia_hien_tai)} → ${tienVnd(giaMoi)}.`]);
                    }
                    if (soLuongMoi !== muc.so_luong) {
                        thongBao.push(['warning', `${ten(sp)} chỉ còn ${soLuongMoi} sản phẩm, số lượng trong giỏ đã được điều chỉnh.`]);
                    }
                    if (giaMoi !== muc.gia_hien_tai || soLuongMoi !== muc.so_luong || sp.ten_san_pham !== muc.san_pham?.ten_san_pham) {
                        quyetDinh.set(muc.id_muc, {
                            muc: { ...muc, san_pham: sp, gia_hien_tai: giaMoi, so_luong: soLuongMoi, tong_tien_muc: giaMoi * soLuongMoi }
                        });
                    }
                }
                if (quyetDinh.size === 0) return;

                // Áp dụng theo id_muc để không ghi đè nếu khách vừa thêm / sửa món khác trong lúc chờ
                setDanhSachMuc((cu) =>
                    cu
                        .filter((m) => !quyetDinh.get(m.id_muc)?.xoa)
                        .map((m) => quyetDinh.get(m.id_muc)?.muc || m)
                );
                thongBao.forEach(([loai, noiDung]) => toast[loai](noiDung));

                // Giá đổi thì số tiền giảm của mã giảm giá cũng phải tính lại theo tạm tính mới
                const maDangDung = maGiamGiaMoiNhat.current;
                if (maDangDung) {
                    const tamTinhMoi = danhSachMucMoiNhat.current.reduce((tong, m) => {
                        const q = quyetDinh.get(m.id_muc);
                        if (q?.xoa) return tong;
                        return tong + (q?.muc || m).tong_tien_muc;
                    }, 0);
                    const ketQua = await MaGiamGiaService.kiemTraMaGiamGiaAsync(maDangDung, tamTinhMoi);
                    if (daHuy) return;
                    if (ketQua.hop_le) {
                        setTienGiamGia(ketQua.so_tien_giam);
                    } else {
                        setMaGiamGiaDaDung(undefined);
                        setTienGiamGia(0);
                        toast.warning(`Mã giảm giá ${maDangDung} không còn áp dụng cho giỏ hàng mới: ${ketQua.thong_diep}`);
                    }
                }
            })
            .catch(() => {
                /* mất mạng: giữ nguyên giỏ, lúc thanh toán server vẫn kiểm tra lại */
            });

        return () => {
            daHuy = true;
        };
    }, [daKhoiTao, phienBanSanPham]);

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
        // Hết hàng hoặc đang tạm ẩn: không cho thêm (server cũng từ chối lúc tạo đơn)
        if (sanPham.con_hang === false || Number(sanPham.so_luong_ton_kho) <= 0) {
            toast.error(`"${sanPham.ten_san_pham.substring(0, 35)}..." hiện đã hết hàng, bạn vui lòng chọn sản phẩm khác.`);
            return;
        }
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
