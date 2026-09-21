import React from 'react';

/**
 * Component BrandLogo - Hiển thị Logo Vector chuẩn nhận diện thương hiệu
 * Tối ưu hiển thị trung tâm, sắc nét, không bị trùng lặp chữ.
 */
export default function BrandLogo({ brand, className = "h-5 w-auto", active = false }) {
    const b = (brand || '').toLowerCase().trim();

    switch (b) {
        case 'apple':
        case 'macbook':
            return (
                <div className="flex items-center gap-1.5 font-bold">
                    <svg viewBox="0 0 170 170" className="h-4 w-auto fill-current" aria-hidden="true">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.7-7.9-12-14.57-6.06-9.33-10.74-20.04-14.04-32.13-3.3-12.08-4.95-23.27-4.95-33.56 0-14.42 3.8-26.47 11.4-36.14 7.6-9.68 17.2-14.62 28.8-14.83 5.4 0 11.2 1.4 17.4 4.2 6.2 2.8 10.2 4.3 12 4.3 1.5 0 5.6-1.5 12.3-4.5 6.7-3 12.4-4.3 17.1-3.9 13 .8 23.4 5.7 31.2 14.7-11.4 6.9-17 16.3-16.8 28.2.2 9.5 3.9 17.5 11.1 24 7.2 6.5 15.6 10.2 25.2 11.1-2.2 6.6-4.9 13.5-8.1 20.7zM119.22 31.05c0-7.3 2.6-14 7.8-20.1 5.2-6.1 11.7-9.9 19.5-11.4.2 1.1.3 2 .3 2.7 0 7.3-2.7 14.1-8.1 20.4-5.4 6.3-12 10.1-19.5 11.4v-3z" />
                    </svg>
                    <span className="text-xs font-black tracking-tight">MacBook</span>
                </div>
            );

        case 'asus':
            return (
                <svg viewBox="0 0 180 40" className={className} fill="currentColor" aria-label="ASUS">
                    <text x="0" y="32" fontFamily="Arial Black, Impact, sans-serif" fontSize="33" fontWeight="900" letterSpacing="1.5">
                        ASUS
                    </text>
                    <line x1="2" y1="18" x2="178" y2="18" stroke="currentColor" strokeWidth="2.8" />
                </svg>
            );

        case 'dell':
            return (
                <div className="flex items-center gap-1.5 font-black">
                    <svg viewBox="0 0 44 44" className="h-4.5 w-auto" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                        <circle cx="22" cy="22" r="20" strokeWidth="2.5" />
                        <text x="22" y="30" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="Arial Black, sans-serif" fontSize="17" fontWeight="900">
                            DELL
                        </text>
                    </svg>
                    <span className="text-xs font-black tracking-wider uppercase">DELL</span>
                </div>
            );

        case 'hp':
            return (
                <div className="flex items-center gap-1.5 font-bold">
                    <svg viewBox="0 0 44 44" className="h-4.5 w-auto" fill="currentColor" aria-hidden="true">
                        <circle cx="22" cy="22" r="21" fill={active ? "#0052cc" : "#0096d6"} />
                        <path d="M17 7L11 37H15.5L21.5 7H17ZM25 7L19 37H23.5L29.5 7H25ZM12 21H32V24H12V21Z" fill="white" />
                    </svg>
                    <span className="text-xs font-black tracking-wider uppercase">HP</span>
                </div>
            );

        case 'lenovo':
            return (
                <svg viewBox="0 0 100 28" className={className} aria-label="Lenovo">
                    <rect width="100" height="28" rx="4" fill="#E2231A" />
                    <text x="50" y="19.5" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif" fontSize="15" fontWeight="900" letterSpacing="0.5">
                        Lenovo
                    </text>
                </svg>
            );

        case 'acer':
            return (
                <svg viewBox="0 0 90 28" className={className} fill={active ? "currentColor" : "#83B81A"} aria-label="Acer">
                    <text x="2" y="21" fontFamily="sans-serif" fontSize="26" fontWeight="900" letterSpacing="-1">
                        acer
                    </text>
                </svg>
            );

        case 'msi':
            return (
                <svg viewBox="0 0 80 26" className={className} fill={active ? "currentColor" : "#ED1C24"} aria-label="MSI">
                    <text x="0" y="21" fontFamily="Arial Black, sans-serif" fontSize="23" fontStyle="italic" fontWeight="900" letterSpacing="1.5">
                        msi
                    </text>
                </svg>
            );

        case 'gigabyte':
            return (
                <svg viewBox="0 0 110 26" className={className} fill="currentColor" aria-label="GIGABYTE">
                    <text x="0" y="21" fontFamily="Impact, Arial Black, sans-serif" fontSize="19" fontWeight="900" letterSpacing="1.2">
                        GIGABYTE
                    </text>
                </svg>
            );

        case 'logitech':
            return (
                <div className="flex items-center gap-1 font-bold">
                    <svg viewBox="0 0 40 40" className="h-4 w-auto" fill="currentColor">
                        <circle cx="20" cy="20" r="16" fill={active ? "currentColor" : "#00B8FC"} />
                    </svg>
                    <span className="text-xs font-black">logi</span>
                </div>
            );

        case 'razer':
            return (
                <span className="text-xs font-black tracking-widest text-emerald-500 uppercase">
                    RAZER
                </span>
            );

        case 'keychron':
            return (
                <span className="text-xs font-black tracking-tight uppercase">
                    Keychron
                </span>
            );

        case 'anker':
            return (
                <span className="text-xs font-black italic text-cyan-600 uppercase">
                    ANKER
                </span>
            );

        case 'samsung':
            return (
                <span className="text-xs font-black tracking-wider text-blue-700 uppercase">
                    SAMSUNG
                </span>
            );

        case 'kingston':
            return (
                <span className="text-xs font-black text-red-600 uppercase">
                    Kingston
                </span>
            );

        default:
            return (
                <span className="text-xs font-black uppercase tracking-wider">
                    {brand}
                </span>
            );
    }
}
