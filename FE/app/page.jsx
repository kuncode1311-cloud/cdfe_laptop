import React from "react";
import BannerDong3D from "@/components/trang-chu/BannerDong3D";
import FlashSaleDemNguoc from "@/components/trang-chu/FlashSaleDemNguoc";
import SectionSanPhamBanChay from "@/components/trang-chu/SectionSanPhamBanChay";
import SectionLinhKienPhuKien from "@/components/trang-chu/SectionLinhKienPhuKien";
import ThuongHieuDoiTac from "@/components/trang-chu/ThuongHieuDoiTac";
import DanhGiaKhachHang from "@/components/trang-chu/DanhGiaKhachHang";
import TinTucCongNghe from "@/components/trang-chu/TinTucCongNghe";
import HoiDapThuongGap from "@/components/trang-chu/HoiDapThuongGap";

export default function TrangChu() {
    return (
        <div className="space-y-8 sm:space-y-12">
            <div>
                {/* 1. Hero Banner Cinematic nối liền */}
                <BannerDong3D />

                {/* 2. Flash Sale Đếm Ngược Nổi Bật */}
                <div className="relative z-30 -mt-8 sm:-mt-10">
                    <FlashSaleDemNguoc />
                </div>
            </div>

            {/* 3. Băng Chuyền Logo Đối Tác Ủy Quyền Chạy Ngang Màn Hình */}
            <ThuongHieuDoiTac />

            {/* 4. Trung Tâm Laptop Bán Chạy & Bộ Lọc Nhu Cầu */}
            <SectionSanPhamBanChay />

            {/* 5. Linh Kiện Nâng Cấp & Phụ Kiện Gaming Gear Chính Hãng */}
            <SectionLinhKienPhuKien />

            {/* 6. Đánh Giá Khách Hàng Thực Tế (4 Thẻ Đa Sắc) */}
            <DanhGiaKhachHang />

            {/* 7. Tin Tức & Cẩm Nang Công Nghệ */}
            <TinTucCongNghe />

            {/* 8. Câu Hỏi Thường Gặp (FAQ) Khi Mua Laptop */}
            <HoiDapThuongGap />
        </div>
    );
}

