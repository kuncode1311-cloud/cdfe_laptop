'use client';
import { useEffect, useMemo, useState } from 'react';
import { DanhMucService } from '@/services/danh-muc.service';
import { SanPhamService } from '@/services/san-pham.service';
import { useDuLieuMoi } from '@/services/dong-bo.service';
import { NHOM_LOC_MAY, TOGGLE_LOC, KHOANG_GIA } from '@/utils/bo-loc';

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

        // Nhóm lọc cấu hình máy: đếm từng tuỳ chọn, tuỳ chọn hết hàng tự ẩn, nhóm rỗng không hiện
        const nhomMay = NHOM_LOC_MAY
            .map((nhom) => ({
                ...nhom,
                tuyChon: nhom.tuyChon
                    .map((x) => ({ ...x, soLuong: dem({ [nhom.khoa]: [x.ma] }) }))
                    .filter((x) => x.soLuong > 0 || (boLoc[nhom.khoa] || []).includes(x.ma))
            }))
            .filter((nhom) => nhom.tuyChon.length > 0);

        // Công tắc (trả góp, giảm giá, còn hàng): kèm số sản phẩm sẽ thấy khi bật
        const congTac = TOGGLE_LOC
            .map((t) => ({ ...t, soLuong: dem({ [t.khoa]: true }), dangBat: !!boLoc[t.khoa] }))
            .filter((t) => t.soLuong > 0 || t.dangBat);

        // Mức giá: kèm số sản phẩm, mức không còn sản phẩm thì ẩn (trừ "Tất cả" và mức đang chọn)
        const khoangGia = KHOANG_GIA
            .map((k) => ({ ...k, soLuong: dem({ muc_gia_toi_thieu: k.min, muc_gia_toi_da: k.max }) }))
            .filter((k) => k.nhanNgan === null || k.soLuong > 0 || (k.min === boLoc.muc_gia_toi_thieu && k.max === boLoc.muc_gia_toi_da));

        return {
            tenHang: (ma) => tenHangDb[ma] || String(ma).toUpperCase(),
            danhSachHang,
            nhuCau: taoNhom('nhu_cau'),
            loaiSanPham: taoNhom('loai_san_pham'),
            khoangGia,
            nhomMay,
            congTac,
            coLaptop: nhomMay.length > 0
        };
    }, [boLoc, tatCaSanPham, danhMucDb]);
}
