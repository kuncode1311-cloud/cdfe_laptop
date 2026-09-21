import React from 'react';

/**
 * Component CategoryIcon - Render Icon Vector chi tiết & sắc nét cho từng loại mặt hàng
 * Giúp người dùng nhìn vào là nhận diện được ngay món hàng (Laptop AI, Gaming, Balo, Phím, Chuột...)
 */
export default function CategoryIcon({ name, className = "w-4 h-4", active = false }) {
    const c = (name || '').toLowerCase().trim();

    switch (c) {
        // 1. Tất cả sản phẩm
        case 'all':
        case 'tat-ca':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
            );

        // 2. Laptop AI 2026 (Laptop với chip AI NPU tia chớp)
        case 'ai-pc':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="12" rx="2" />
                    <path d="M2 20h20" />
                    <path d="M12 7l-2 3.5h4L12 14" fill={active ? "currentColor" : "#F59E0B"} stroke={active ? "currentColor" : "#F59E0B"} strokeWidth="1.5" />
                </svg>
            );

        // 3. Laptop Gaming (Laptop hầm hố có viền LED)
        case 'gaming':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="12" rx="2" />
                    <path d="M2 20h20" />
                    <line x1="7" y1="10" x2="9" y2="10" stroke="#EF4444" strokeWidth="2" />
                    <line x1="8" y1="9" x2="8" y2="11" stroke="#EF4444" strokeWidth="2" />
                    <circle cx="16" cy="10" r="1" fill="#EF4444" />
                    <circle cx="14" cy="11" r="1" fill="#EF4444" />
                </svg>
            );

        // 4. Mỏng Nhẹ - Văn Phòng (Laptop siêu mỏng tinh tế)
        case 'van-phong-mong-nhe':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="5" width="16" height="11" rx="1.5" />
                    <path d="M1 19h22" strokeWidth="2.5" />
                    <circle cx="12" cy="7.5" r="0.75" fill="currentColor" />
                </svg>
            );

        // 5. Đồ Họa 3D (Bảng vẽ / Đồ họa sáng tạo)
        case 'do-hoa-sang-tao':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
                    <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
                    <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
                    <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                </svg>
            );

        // 6. Balo & Túi Chống Sốc (Hình balo quai đeo khóa kéo)
        case 'balo-tui-chong-soc':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10z" />
                    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                    <path d="M8 14h8" />
                    <path d="M8 18h8" />
                    <line x1="12" y1="10" x2="12" y2="14" />
                </svg>
            );

        // 7. Bàn Phím Cơ Custom (Bàn phím với các nút switch nổi)
        case 'ban-phim-co':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="3" />
                    <line x1="6" y1="9" x2="6" y2="9.01" strokeWidth="3" />
                    <line x1="10" y1="9" x2="10" y2="9.01" strokeWidth="3" />
                    <line x1="14" y1="9" x2="14" y2="9.01" strokeWidth="3" />
                    <line x1="18" y1="9" x2="18" y2="9.01" strokeWidth="3" />
                    <line x1="6" y1="13" x2="6" y2="13.01" strokeWidth="3" />
                    <line x1="9" y1="14.5" x2="15" y2="14.5" strokeWidth="2.5" />
                    <line x1="18" y1="13" x2="18" y2="13.01" strokeWidth="3" />
                </svg>
            );

        // 8. Chuột Gaming & Pad (Chuột công thái học có con lăn)
        case 'chuot-lot-chuot':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="3" width="12" height="18" rx="6" />
                    <line x1="12" y1="7" x2="12" y2="10" strokeWidth="2.5" />
                    <line x1="6" y1="11" x2="18" y2="11" strokeWidth="1.5" />
                </svg>
            );

        // 9. Tai Nghe & Âm Thanh (Headphone chụp tai)
        case 'tai-nghe-loa':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
                </svg>
            );

        // 10. Sạc GaN & Hub Chuyển (Củ sạc có 2 chân cắm điện)
        case 'sac-cap-hub':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
            );

        // 11. Linh Kiện Nâng Cấp (Thanh RAM / SSD M.2)
        case 'linh-kien-nang-cap':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <line x1="6" y1="18" x2="6" y2="15" strokeWidth="2" />
                    <line x1="10" y1="18" x2="10" y2="15" strokeWidth="2" />
                    <line x1="14" y1="18" x2="14" y2="15" strokeWidth="2" />
                    <line x1="18" y1="18" x2="18" y2="15" strokeWidth="2" />
                    <rect x="6" y="9" width="3" height="3" fill="currentColor" />
                    <rect x="11" y="9" width="3" height="3" fill="currentColor" />
                    <rect x="16" y="9" width="3" height="3" fill="currentColor" />
                </svg>
            );

        default:
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="12" rx="2" />
                    <path d="M2 20h20" />
                </svg>
            );
    }
}
