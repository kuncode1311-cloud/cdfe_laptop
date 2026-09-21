'use client';
import React, { useMemo } from 'react';
import Image from 'next/image';
import { Sparkles, ShieldCheck, Laptop } from 'lucide-react';

/**
 * Thông tin chi tiết của từng danh mục mặt hàng
 */
const THONG_TIN_DANH_MUC = {
    'all': {
        ten: 'TẤT CẢ SẢN PHẨM LAPTOP & PHỤ KIỆN CHÍNH HÃNG',
        moTa: 'Kho sản phẩm công nghệ hàng đầu với đầy đủ phân khúc từ văn phòng đến gaming cao cấp',
        hinhAnh: '/images/sp/hero-3d-laptop.jpg',
        badge: 'Toàn Bộ Sản Phẩm'
    },
    'tat-ca-laptop': {
        ten: 'TẤT CẢ CÁC DÒNG LAPTOP CHÍNH HÃNG 2026',
        moTa: 'Trọn bộ máy tính xách tay thế hệ mới: Laptop AI NPU, Gaming RTX 40-Series, Mỏng nhẹ cao cấp và Đồ họa 3D',
        hinhAnh: '/images/sp/asus_zenbook_oled.jpg',
        badge: 'Hệ Sinh Thái Laptop'
    },
    'tat-ca-phu-kien': {
        ten: 'TẤT CẢ PHỤ KIỆN CÔNG NGHỆ & GAMING GEAR',
        moTa: 'Balo chống sốc, bàn phím cơ custom, chuột siêu nhẹ, tai nghe âm thanh vòm, sạc nhanh GaN và linh kiện nâng cấp',
        hinhAnh: '/images/sp/gaming_keyboard_rgb.jpg',
        badge: 'Phụ Kiện Gaming Pro'
    },
    'ai-pc': {
        ten: 'LAPTOP AI 2026 - KỶ NGUYÊN NPU THÔNG MINH',
        moTa: 'Tích hợp NPU Intel Core Ultra & AMD Ryzen AI, tăng tốc xử lý tác vụ trí tuệ nhân tạo mượt mà',
        hinhAnh: '/images/sp/asus_zenbook_oled.jpg',
        badge: 'NPU AI Boost'
    },
    'gaming': {
        ten: 'LAPTOP GAMING HIỆU NĂNG CAO (RTX 40-SERIES)',
        moTa: 'Chiến mượt mọi tựa game AAA, Ray Tracing siêu thực với GPU NVIDIA RTX 40-Series và tản nhiệt buồng hơi',
        hinhAnh: '/images/sp/asus_rog_scar18.jpg',
        badge: '175W TGP Max'
    },
    'van-phong-mong-nhe': {
        ten: 'LAPTOP MỎNG NHẸ - DOANH NHÂN & VĂN PHÒNG',
        moTa: 'Khung nhôm kim loại unibody siêu nhẹ từ 1.1kg, màn hình OLED rực rỡ và thời lượng pin cả ngày dài',
        hinhAnh: '/images/sp/zenbook_oled.jpg',
        badge: 'Siêu Nhẹ 1.2kg'
    },
    'do-hoa-sang-tao': {
        ten: 'LAPTOP ĐỒ HỌA, KỸ THUẬT & SÁNG TẠO 3D',
        moTa: 'Màn hình chuẩn màu 100% DCI-P3, Pantone Validated, vi xử lý đa nhân dựng hình 3D và render 4K',
        hinhAnh: '/images/sp/dell_xps_16.jpg',
        badge: '100% DCI-P3'
    },
    'balo-tui-chong-soc': {
        ten: 'BALO & TÚI CHỐNG SỐC BẢO VỆ LAPTOP',
        moTa: 'Chống sốc CornerArmor 360 độ, vải trượt nước cao cấp, bảo vệ an toàn tuyệt đối cho thiết bị',
        hinhAnh: '/images/sp/balo_gaming_rog.jpg',
        badge: 'Chống Sốc 5 Lớp'
    },
    'ban-phim-co': {
        ten: 'BÀN PHÍM CƠ CUSTOM & GAMING GEAR',
        moTa: 'Switch hotswap cao cấp, keycap PBT doubleshot, kết nối 3 mode không dây và LED RGB rực rỡ',
        hinhAnh: '/images/sp/gaming_keyboard_rgb.jpg',
        badge: 'Hotswap RGB'
    },
    'chuot-lot-chuot': {
        ten: 'CHUỘT GAMING & LÓT CHUỘT SPEED',
        moTa: 'Cảm biến quang học chính xác 26.000 DPI, trọng lượng siêu nhẹ 49g và pad chuột nano mượt mà',
        hinhAnh: '/images/sp/gaming_mouse_wireless.jpg',
        badge: 'Wireless 49g'
    },
    'tai-nghe-loa': {
        ten: 'TAI NGHE & ÂM THANH GAMING PRO',
        moTa: 'Âm thanh vòm 7.1 định hướng bước chân, mic lọc tạp âm AI và đệm tai êm ái thoáng khí',
        hinhAnh: '/images/sp/tai_nghe_gaming_pro.jpg',
        badge: 'Hi-Res Audio 7.1'
    },
    'sac-cap-hub': {
        ten: 'CỦ SẠC GaN & CÁP HUB DOCKING TYPE-C',
        moTa: 'Công nghệ bán dẫn GaN sạc nhanh 140W PD, hub mở rộng xuất hình ảnh 4K 60Hz sắc nét',
        hinhAnh: '/images/sp/cu_sac_gan_140w.jpg',
        badge: 'Sạc Nhanh GaN 140W'
    },
    'linh-kien-nang-cap': {
        ten: 'LINH KIỆN NÂNG CẤP (SSD NVMe & RAM DDR5)',
        moTa: 'SSD PCIe Gen 4 tốc độ đọc ghi 7.450 MB/s và RAM bus cao tăng tốc độ phản hồi tức thì',
        hinhAnh: '/images/sp/samsung_990_ssd.jpg',
        badge: 'Gen 4.0 Siêu Tốc'
    }
};

/**
 * Component BannerDanhMucManh - Tiêu đề danh mục mảnh mai, sang xịn
 * Thay thế hoàn toàn khối 11 thẻ to tướng, tiết kiệm diện tích tối đa!
 */
export default function BannerDanhMucManh({
    danhMucHienTai = [],
    tongSoLuong = 0
}) {
    const key = useMemo(() => {
        if (!danhMucHienTai || danhMucHienTai.length === 0) return 'all';
        if (danhMucHienTai.length === 1) return danhMucHienTai[0];
        if (danhMucHienTai.includes('ai-pc') && danhMucHienTai.includes('gaming')) return 'tat-ca-laptop';
        if (danhMucHienTai.includes('balo-tui-chong-soc') && danhMucHienTai.includes('ban-phim-co')) return 'tat-ca-phu-kien';
        return danhMucHienTai[0] || 'all';
    }, [danhMucHienTai]);
    const info = THONG_TIN_DANH_MUC[key] || THONG_TIN_DANH_MUC['all'];

    return (
        <div className="w-full bg-gradient-to-r from-blue-50/90 via-sky-50/50 to-white dark:from-slate-900 dark:via-blue-950/30 dark:to-slate-900 rounded-2xl border-2 border-blue-200/90 dark:border-blue-900/60 p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-all">
            {/* Cụm Trái: Ảnh đại diện to rõ + Tiêu đề danh mục đậm nét + Mô tả & Ưu đãi */}
            <div className="flex items-center gap-3.5 sm:gap-4">
                {/* Ảnh đại diện danh mục to rõ (60x60px) */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-blue-500/40 shadow-md bg-white shrink-0 ring-4 ring-blue-500/10">
                    <Image
                        src={info.hinhAnh}
                        alt={info.ten}
                        fill
                        sizes="64px"
                        className="object-cover"
                    />
                </div>

                <div className="space-y-1">
                    {/* Hàng Tiêu đề & Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            {info.ten}
                        </h2>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-black text-[11px] shadow-xs">
                            <Sparkles className="w-3 h-3 text-yellow-300" />
                            {info.badge}
                        </span>
                    </div>

                    {/* Dòng mô tả đặc tính danh mục */}
                    <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 font-medium line-clamp-2 max-w-2xl">
                        {info.moTa}
                    </p>

                    {/* Cam kết ngắn gọn */}
                    <div className="hidden sm:flex items-center gap-3 text-[11px] text-blue-700 dark:text-cyan-400 font-bold pt-0.5">
                        <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                            Bảo hành 12-36 tháng
                        </span>
                        <span>•</span>
                        <span>Trả góp 0% lãi suất</span>
                        <span>•</span>
                        <span>Giao nhanh 2H tận nơi</span>
                    </div>
                </div>
            </div>

            {/* Cụm Phải: Thẻ số lượng sản phẩm sẵn có */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-blue-300/80 dark:border-blue-900 shadow-xs flex flex-col items-center sm:items-end">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Sẵn Hàng
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-[#0052cc] dark:text-cyan-400">
                            {tongSoLuong}
                        </span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                            sản phẩm
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
