'use client';

import { useState, useMemo, useEffect, useRef } from 'react';

/**
 * Hook quản lý logic phân trang dùng chung cho bảng/danh sách Admin
 * 
 * @param {Array} danhSach - Danh sách dữ liệu gốc (sau khi đã tìm kiếm / lọc)
 * @param {number} soMucMacDinh - Số lượng bản ghi mặc định trên một trang (mặc định 10)
 * @param {Array} cacGiaTriPhuThuocReset - Danh sách giá trị phụ thuộc (ví dụ [tuKhoa, boLoc, sapXep]), khi đổi sẽ tự reset về trang 1
 * @returns {Object} Các giá trị và hàm điều khiển phân trang
 */
export function usePhanTrang(danhSach = [], soMucMacDinh = 10, cacGiaTriPhuThuocReset = []) {
    const [soMucMoiTrang, setSoMucMoiTrangState] = useState(soMucMacDinh);
    const [trangHienTai, setTrangHienTai] = useState(1);

    const tongSoMuc = Array.isArray(danhSach) ? danhSach.length : 0;
    const tongSoTrang = Math.max(1, Math.ceil(tongSoMuc / soMucMoiTrang));

    // Đổi số mục mỗi trang: tự động quay về trang 1
    const setSoMucMoiTrang = (soMoi) => {
        const soMoiNumber = Number(soMoi) || soMucMacDinh;
        setSoMucMoiTrangState(soMoiNumber);
        setTrangHienTai(1);
    };

    // Theo dõi dependencies bộ lọc để tự động reset về trang 1 khi người dùng lọc/tìm kiếm
    const khoiTaoRef = useRef(true);
    useEffect(() => {
        if (khoiTaoRef.current) {
            khoiTaoRef.current = false;
            return;
        }
        setTrangHienTai(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, cacGiaTriPhuThuocReset);

    // Đảm bảo trang hiện tại không vượt quá tổng số trang khi danh sách bị co lại (ví dụ xóa bớt mục)
    useEffect(() => {
        if (trangHienTai > tongSoTrang) {
            setTrangHienTai(tongSoTrang);
        }
    }, [tongSoTrang, trangHienTai]);

    // Lát cắt dữ liệu hiển thị trên trang hiện tại
    const danhSachTrenTrang = useMemo(() => {
        if (!Array.isArray(danhSach) || danhSach.length === 0) return [];
        const batDau = (trangHienTai - 1) * soMucMoiTrang;
        return danhSach.slice(batDau, batDau + soMucMoiTrang);
    }, [danhSach, trangHienTai, soMucMoiTrang]);

    const viTriBatDau = (trangHienTai - 1) * soMucMoiTrang;
    const viTriKetThuc = Math.min(trangHienTai * soMucMoiTrang, tongSoMuc);

    return {
        trangHienTai,
        setTrangHienTai,
        soMucMoiTrang,
        setSoMucMoiTrang,
        tongSoTrang,
        tongSoMuc,
        viTriBatDau,
        viTriKetThuc,
        danhSachTrenTrang
    };
}

export default usePhanTrang;
