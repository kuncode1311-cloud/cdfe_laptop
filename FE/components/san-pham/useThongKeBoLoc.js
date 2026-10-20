'use client';
import { useEffect, useMemo, useState } from 'react';
import { DanhMucService } from '@/services/danh-muc.service';
import { SanPhamService } from '@/services/san-pham.service';
import { useDuLieuMoi } from '@/services/dong-bo.service';

// Khai báo CPU / GPU dùng chung cho thanh lọc nhanh và drawer (mã khớp với SanPhamService.locSanPham)
export const DONG_CPU = [
    { ma: 'core_ultra', nhan: 'Intel Core Ultra' },
    { ma: 'core_i9', nhan: 'Intel Core i9' },
    { ma: 'core_i7', nhan: 'Intel Core i7' },
    { ma: 'core_i5', nhan: 'Intel Core i5' },
    { ma: 'ryzen', nhan: 'AMD Ryzen' },
    { ma: 'apple_m', nhan: 'Apple Silicon (M)' }
];

export const DONG_GPU = [
    { ma: 'rtx_4090', nhan: 'RTX 4090' },
    { ma: 'rtx_4080', nhan: 'RTX 4080' },
    { ma: 'rtx_4070', nhan: 'RTX 4070' },
    { ma: 'rtx_4060', nhan: 'RTX 4060' },
    { ma: 'rtx_4050', nhan: 'RTX 4050' },
    { ma: 'card_onboard', nhan: 'Onboard / Iris' }
];

/**
 * Thống kê cho các bộ lọc, dùng chung cho thanh lọc nhanh và drawer "Tất cả bộ lọc".
 * - Tên hãng / loại sản phẩm / nhu cầu lấy từ DB (collection danh-muc), không ghi cứng.
 * - Số đếm tính theo các bộ lọc khác đang chọn (faceted): con số hiện ra = số sản phẩm sẽ thấy khi bấm,
 *   mục không còn sản phẩm nào thì ẩn (trừ mục đang được chọn) nên không còn "Xem 0 sản phẩm".
 */
export function useThongKeBoLoc(boLoc, tatCaSanPham) {
    const [danhMucDb, setDanhMucDb] = useState([]);
    const phienBan = useDuLieuMoi('danh_muc');

    useEffect(() => {
        let daHuy = false;
        DanhMucService.layDanhSachDanhMucAsync().then((ds) => {
            if (!daHuy && Array.isArray(ds)) setDanhMucDb(ds.filter((d) => d.kich_hoat !== false));
        });
        return () => { daHuy = true; };
    }, [phienBan]);

    return useMemo(() => {
        const dsSp = Array.isArray(tatCaSanPham) ? tatCaSanPham : [];
        const dem = (patch) => (dsSp.length ? SanPhamService.locSanPham({ ...boLoc, ...patch }, dsSp).length : 0);

        const theoLoai = (loai) => danhMucDb.filter((d) => d.loai === loai);
        const tenHangDb = Object.fromEntries(theoLoai('thuong_hieu').map((d) => [d.ma_danh_muc, d.ten_danh_muc]));

        // Mỗi mục có ma, ten, dem(): giữ mục còn sản phẩm hoặc đang được chọn
        const gom = (muc, daChon) => muc
            .map(({ dem: demMuc, ...x }) => ({ ...x, soLuong: demMuc() }))
            .filter((x) => x.soLuong > 0 || daChon.includes(x.ma));

        // Hãng: lấy từ chính sản phẩm đang bán, tên đẹp lấy từ DB
        const maHangCoSp = [...new Set(dsSp.map((sp) => (sp.hang_san_xuat || '').toLowerCase()).filter(Boolean))];
        const danhSachHang = gom(
            maHangCoSp.map((ma) => ({ ma, ten: tenHangDb[ma] || ma.toUpperCase(), dem: () => dem({ hang_san_xuat: [ma] }) })),
            boLoc.hang_san_xuat || []
        ).sort((a, b) => b.soLuong - a.soLuong || a.ten.localeCompare(b.ten));

        const taoNhom = (loai) => gom(
            theoLoai(loai).map((d) => ({ ma: d.ma_danh_muc, ten: d.ten_danh_muc, dem: () => dem({ danh_muc: [d.ma_danh_muc] }) })),
            boLoc.danh_muc || []
        );

        const taoDemMay = (dong, truong) => dong
            .map((x) => ({ ...x, soLuong: dem({ [truong]: [x.ma] }) }))
            .filter((x) => x.soLuong > 0 || (boLoc[truong] || []).includes(x.ma));

        const cpu = taoDemMay(DONG_CPU, 'cpu_dong');
        const gpu = taoDemMay(DONG_GPU, 'card_do_hoa');

        return {
            tenHang: (ma) => tenHangDb[ma] || String(ma).toUpperCase(),
            danhSachHang,
            nhuCau: taoNhom('nhu_cau'),
            loaiSanPham: taoNhom('loai_san_pham'),
            cpu,
            gpu,
            coLaptop: cpu.length > 0 || gpu.length > 0
        };
    }, [boLoc, tatCaSanPham, danhMucDb]);
}
