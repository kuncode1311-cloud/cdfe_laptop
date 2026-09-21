'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, GitCompare, Heart, Star, Gift, ShieldCheck, Flame, Plus, Check } from 'lucide-react';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import { slugSanPham } from '@/utils/taoSlug';
import { useGioHang } from '@/contexts/CartContext';
import { useSoSanh, coTheSoSanh } from '@/contexts/CompareContext';
import { useYeuThich } from '@/contexts/WishlistContext';

/**
 * Trích xuất 3-4 thông số kỹ thuật cốt lõi chuẩn e-commerce
 * Chuẩn 100% theo dữ liệu MongoDB Atlas, thích ứng linh hoạt theo từng dòng sản phẩm
 */
function layThongSoNhanh(sanPham) {
    const thongSo = sanPham.thong_so || {};
    const danhMuc = sanPham.danh_muc || [];
    const laLinhKien = danhMuc.includes('linh-kien') || danhMuc.includes('phu-kien-gear');

    // Phụ kiện chuột, bàn phím, linh kiện, balo, củ sạc, tản nhiệt, tai nghe
    if (laLinhKien) {
        const ketQua = [];
        const tenSp = (sanPham.ten_san_pham || '').toLowerCase();

        // 1. Lót chuột & Bàn di chuột
        if (tenSp.includes('lót chuột') || tenSp.includes('mousepad') || tenSp.includes('deskmat') || tenSp.includes('bàn di chuột')) {
            ketQua.push(thongSo.kich_thuoc || '900x400mm');
            ketQua.push(thongSo.chat_lieu_be_mat || 'Vải Micro-weave');
            ketQua.push(thongSo.che_do_led || 'Chống trượt');
        }
        // 2. Giá đỡ & Đế tản nhiệt laptop
        else if (tenSp.includes('giá đỡ') || tenSp.includes('tản nhiệt') || tenSp.includes('sò lạnh') || tenSp.includes('gt500')) {
            ketQua.push(thongSo.loai_linh_kien ? thongSo.loai_linh_kien.split(' ')[0] + ' ' + (thongSo.loai_linh_kien.split(' ')[1] || '') : 'Đế tản nhiệt');
            if (thongSo.toc_do_quat) ketQua.push(thongSo.toc_do_quat.match(/\d+\s*RPM/i)?.[0] || thongSo.toc_do_quat);
            else if (thongSo.chat_lieu) ketQua.push('Nhôm CNC');
            ketQua.push(thongSo.hieu_qua_giam_nhiet || thongSo.tinh_nang_dac_biet || 'Làm mát cực nhanh');
        }
        // 3. Hub & Cáp Type-C / Thunderbolt
        else if (tenSp.includes('hub') || tenSp.includes('dock') || tenSp.includes('cáp chuyển') || tenSp.includes('thunderbolt')) {
            ketQua.push(thongSo.bang_thong_truyen_du_lieu ? thongSo.bang_thong_truyen_du_lieu.match(/\d+Gbps/i)?.[0] || 'Tốc độ cao' : '40Gbps');
            ketQua.push(Array.isArray(thongSo.so_cong_dau_ra) ? `${thongSo.so_cong_dau_ra.length} Cổng` : (thongSo.so_cong_dau_ra?.match(/\d+\s*cổng/i)?.[0] || 'Đa cổng'));
            ketQua.push(thongSo.cong_suat_sac_pass_through ? thongSo.cong_suat_sac_pass_through.match(/\d+W/i)?.[0] || 'PD 100W' : 'Sạc PD');
        }
        // 4. Balo & Túi chống sốc
        else if (tenSp.includes('túi chống sốc') || tenSp.includes('balo') || tenSp.includes('backpack') || tenSp.includes('tomtoc') || tenSp.includes('sling')) {
            ketQua.push(thongSo.kich_co_laptop_phu_hop ? (thongSo.kich_co_laptop_phu_hop.match(/\d+[\.\d]*\s*(inch|\")/i)?.[0] || 'Vừa laptop') : 'Laptop');
            ketQua.push(thongSo.dung_tich ? (thongSo.dung_tich.match(/\d+\s*Lít/i)?.[0] || 'Dung tích lớn') : 'Chống sốc');
            ketQua.push(thongSo.khang_nuoc ? 'Kháng nước' : 'Chống sốc');
        }
        // 5. Củ sạc & Pin sạc dự phòng
        else if (tenSp.includes('sạc') || tenSp.includes('gan') || tenSp.includes('charger') || tenSp.includes('powerbank')) {
            ketQua.push(thongSo.cong_suat_toi_da ? thongSo.cong_suat_toi_da.match(/\d+W/i)?.[0] || 'GaN' : 'GaN Fast');
            ketQua.push(thongSo.dung_luong_pin ? (thongSo.dung_luong_pin.match(/\d+[\.,\d]*\s*mAh/i)?.[0] || 'Pin sạc') : 'PD 3.1');
            ketQua.push(Array.isArray(thongSo.so_cong_dau_ra) ? `${thongSo.so_cong_dau_ra.length} Cổng` : (thongSo.so_cong_dau_ra?.match(/\d+\s*cổng/i)?.[0] || 'Đa cổng'));
        }
        // 6. Tai nghe & Loa
        else if (tenSp.includes('tai nghe') || tenSp.includes('headphone') || tenSp.includes('headset') || tenSp.includes('loa') || tenSp.includes('speaker')) {
            ketQua.push(thongSo.mang_loa_driver ? thongSo.mang_loa_driver.match(/\d+mm/i)?.[0] || 'Hi-Res Audio' : 'Âm vòm');
            ketQua.push(thongSo.chong_on_anc ? 'Chống ồn ANC' : (thongSo.cong_nghe_am_thanh?.includes('7.1') ? 'Âm vòm 7.1' : 'Spatial Audio'));
            ketQua.push(thongSo.dung_luong_pin ? (thongSo.dung_luong_pin.match(/\d+\s*(giờ|h)/i)?.[0] || 'Pin trâu') : 'Bluetooth 5.3');
        }
        // 7. Chuột Gaming & Chuột văn phòng
        else if (tenSp.includes('chuột') || tenSp.includes('mouse')) {
            if (thongSo.trong_luong) ketQua.push(`Siêu nhẹ ${thongSo.trong_luong < 1 ? Math.round(thongSo.trong_luong * 1000) : thongSo.trong_luong}g`);
            else if (tenSp.includes('54g')) ketQua.push('Siêu nhẹ 54g');
            else if (tenSp.includes('63g')) ketQua.push('Siêu nhẹ 63g');

            if (thongSo.do_phan_giai_dpi) {
                const dpiMatch = thongSo.do_phan_giai_dpi.match(/[\d.]+\s*DPI/i);
                if (dpiMatch) ketQua.push(dpiMatch[0]);
            } else if (thongSo.mat_doc_cam_bien) {
                ketQua.push('PAW3395');
            }

            if (thongSo.polling_rate) {
                const prMatch = thongSo.polling_rate.match(/\d+Hz/i);
                if (prMatch) ketQua.push(prMatch[0]);
            } else if (thongSo.dung_luong_pin) {
                const pinMatch = thongSo.dung_luong_pin.match(/\d+\s*(giờ|h|ngày)/i);
                if (pinMatch) ketQua.push(`Pin ${pinMatch[0]}`);
            }
        }
        // 8. Bàn phím cơ
        else if (tenSp.includes('bàn phím') || tenSp.includes('keyboard')) {
            ketQua.push(thongSo.layout ? thongSo.layout.split(' ')[0] || '75%' : 'Layout 75%');
            if (thongSo.tinh_nang_dac_biet?.includes('Rapid Trigger') || thongSo.loai_switch?.includes('từ tính')) {
                ketQua.push('Rapid Trigger');
            } else if (thongSo.cau_truc_mount?.includes('Gasket')) {
                ketQua.push('Gasket Mount');
            } else {
                ketQua.push('Hot-swap');
            }
            ketQua.push(thongSo.ket_noi?.includes('Không dây') || thongSo.ket_noi?.includes('3 Mode') ? '3 Chế Độ' : 'RGB Per-Key');
        }
        // 9. Linh kiện nâng cấp (SSD, RAM, CPU)
        else {
            if (thongSo.dung_luong) ketQua.push(thongSo.dung_luong);
            if (thongSo.toc_do) ketQua.push(thongSo.toc_do.match(/\d+[\.,\d]*\s*MB\/s/i)?.[0] || thongSo.toc_do.substring(0, 15));
            else if (thongSo.toc_do_bus) ketQua.push(thongSo.toc_do_bus);
            else if (thongSo.do_dan_nhiet) ketQua.push(thongSo.do_dan_nhiet);
            else if (thongSo.xung_nhip_toi_da) ketQua.push(thongSo.xung_nhip_toi_da.match(/\d+[\.,\d]*\s*GHz/i)?.[0] || '6.2 GHz');
            if (thongSo.chuan_giao_tiep) ketQua.push(thongSo.chuan_giao_tiep.includes('M.2') ? 'M.2 NVMe' : 'DDR5');
            else if (thongSo.che_do_bao_hanh) ketQua.push('BH Chính Hãng');
        }

        if (ketQua.length > 0) return ketQua.filter(Boolean).slice(0, 3);

        const muc1 = thongSo.loai_linh_kien || 'Chính hãng';
        const muc2 = thongSo.dung_luong || thongSo.toc_do || 'Cao cấp';
        const muc3 = thongSo.che_do_bao_hanh ? thongSo.che_do_bao_hanh.split('(')[0].trim() : 'BH 24-36T';
        return [muc1, muc2, muc3].filter(Boolean).slice(0, 3);
    }

    // Laptop: CPU - Card đồ họa / Màn hình - RAM - Ổ cứng
    const ketQua = [];

    // 1. CPU
    if (thongSo.cpu) {
        let cpu = thongSo.cpu.split('(')[0]
            .replace('Intel® Core™', '')
            .replace('Intel Core', '')
            .replace('AMD Ryzen™', 'Ryzen')
            .replace('AMD Ryzen', 'Ryzen')
            .replace('Apple', '')
            .trim();
        if (cpu.length > 15) cpu = cpu.substring(0, 15);
        ketQua.push(cpu);
    }

    // 2. RAM
    if (thongSo.ram) {
        let ram = thongSo.ram.split('(')[0].replace('MHz', '').trim();
        if (ram.length > 10) ram = ram.split(' ')[0];
        ketQua.push(ram.includes('RAM') ? ram : `${ram} RAM`);
    }

    // 3. Ổ cứng SSD
    if (thongSo.o_cung) {
        let oc = thongSo.o_cung.split('(')[0].replace('SSD', '').replace('PCIe', '').trim();
        if (oc.length > 10) oc = oc.split(' ')[0];
        ketQua.push(oc.includes('SSD') ? oc : `${oc} SSD`);
    }

    // 4. Màn hình / GPU
    if (thongSo.tam_nen) {
        ketQua.push(thongSo.tam_nen);
    } else if (thongSo.card_do_hoa) {
        let gpu = thongSo.card_do_hoa.split('(')[0]
            .replace('NVIDIA® GeForce', '')
            .replace('NVIDIA GeForce', '')
            .replace('Laptop GPU', '')
            .replace('Graphics', '')
            .trim();
        if (gpu.length > 14) gpu = gpu.substring(0, 14);
        ketQua.push(gpu);
    } else if (thongSo.tan_so_quet) {
        ketQua.push(`${thongSo.tan_so_quet}Hz`);
    }

    return ketQua.filter(Boolean).slice(0, 4);
}

/**
 * Component Thẻ Sản Phẩm (TheSanPham) - Redesign Chuẩn Reference E-Commerce Cao Cấp
 * - Hierarchy rõ ràng: Ảnh -> Meta Row (Brand + Flash Sale + Rating) -> Tên -> Giá -> Specs -> Stock Progress -> Thêm Giỏ
 * - Visual cao cấp, sạch sẽ, khoảng cách và padding đồng đều
 * - Giữ nguyên 100% chức năng giỏ hàng, so sánh, yêu thích, routing và dữ liệu MongoDB
 */
export default function TheSanPham({ sanPham, cheDoHienThi = 'luoi', hienThiThanhFlashSale = false }) {
    const { themVaoGioHang } = useGioHang();
    const { themVaoSoSanh, kiemTraDaCoTrongSoSanh } = useSoSanh();
    const { chuyenDoiYeuThich, kiemTraDaThich } = useYeuThich();

    if (!sanPham) return null;

    const daTrongSoSanh = kiemTraDaCoTrongSoSanh(sanPham.id || sanPham._id);
    const daYeuThich = kiemTraDaThich(sanPham.id || sanPham._id);
    const hoTroSoSanh = coTheSoSanh(sanPham);
    const cacThongSo = layThongSoNhanh(sanPham);

    // Xác định tag trạng thái phụ
    const tagTrangThai = sanPham.la_flash_sale
        ? { text: '⚡ Flash Sale', mau: 'text-[#F3123C] bg-red-50 dark:bg-red-950/40 border-red-200/60' }
        : sanPham.la_ban_chay
        ? { text: '🔥 Bán Chạy', mau: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200/60' }
        : sanPham.la_san_pham_moi
        ? { text: '✨ Mới', mau: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200/60' }
        : null;

    // =========================================================================
    // 1. CHẾ ĐỘ DANH SÁCH (List View)
    // =========================================================================
    if (cheDoHienThi === 'danh_sach') {
        return (
            <div className="group bg-white dark:bg-slate-900 rounded-[20px] p-3.5 sm:p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-4 relative transition-all duration-300 hover:shadow-lg hover:border-[#0052cc]">
                <Link
                    href={`/san-pham/${slugSanPham(sanPham)}`}
                    className="relative w-full sm:w-52 aspect-[16/9] sm:h-32 shrink-0 block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden"
                >
                    <Image
                        src={sanPham.hinh_anh_chinh}
                        alt={sanPham.ten_san_pham}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, 200px"
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    {sanPham.phan_tram_giam_gia > 0 && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-[#F3123C] text-white font-bold text-[10px]">
                            -{sanPham.phan_tram_giam_gia}%
                        </span>
                    )}
                </Link>

                <div className="flex-1 min-w-0 space-y-1.5 w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-[#0F172A] text-white text-[9.5px] font-black uppercase tracking-wider">
                            {sanPham.hang_san_xuat}
                        </span>
                        {tagTrangThai && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${tagTrangThai.mau}`}>
                                {tagTrangThai.text}
                            </span>
                        )}
                        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 text-xs ml-auto font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{sanPham.diem_danh_gia_tb ? sanPham.diem_danh_gia_tb.toFixed(1) : '5.0'}</span>
                            <span className="text-slate-400 font-normal">
                                ({sanPham.so_luong_danh_gia || sanPham.so_luong_da_ban || 114})
                            </span>
                        </div>
                    </div>

                    <Link href={`/san-pham/${slugSanPham(sanPham)}`} className="block">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-[#0052cc] transition-colors">
                            {sanPham.ten_san_pham}
                        </h3>
                    </Link>

                    <div className="flex flex-wrap gap-1 text-[11px]">
                        {cacThongSo.map((ts, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                {ts}
                            </span>
                        ))}
                    </div>

                    {sanPham.qua_tang && sanPham.qua_tang.length > 0 ? (
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-400 truncate flex items-center gap-1 font-medium">
                            <Gift className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{sanPham.qua_tang[0].ten_qua_tang}</span>
                        </div>
                    ) : (
                        <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate">{sanPham.thong_so?.che_do_bao_hanh || 'Bảo hành chính hãng'}</span>
                        </div>
                    )}
                </div>

                <div className="w-full sm:w-44 shrink-0 flex sm:flex-col justify-between items-end sm:items-stretch gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <div>
                        <div className="text-lg font-black text-[#F3123C]">
                            {dinhDangTienVND(sanPham.gia_khuyen_mai)}
                        </div>
                        {sanPham.gia_goc > sanPham.gia_khuyen_mai && (
                            <div className="text-xs text-slate-400 line-through font-normal">
                                {dinhDangTienVND(sanPham.gia_goc)}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => themVaoGioHang(sanPham)}
                            className="flex-1 py-2 px-3 rounded-xl bg-[#0052cc] hover:bg-[#003da5] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                        >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Thêm vào giỏ</span>
                        </button>
                        {hoTroSoSanh && (
                            <button
                                onClick={() => themVaoSoSanh(sanPham)}
                                className={`py-2 px-2.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold ${
                                    daTrongSoSanh
                                        ? 'bg-blue-50 border-blue-500 text-[#0052cc] dark:bg-slate-800 dark:text-cyan-400'
                                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:border-[#0052cc]'
                                }`}
                                title={daTrongSoSanh ? 'Bỏ so sánh' : 'So sánh sản phẩm'}
                            >
                                <GitCompare className="w-3.5 h-3.5" />
                                <span>{daTrongSoSanh ? 'Đã chọn' : 'So sánh'}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================================
    // 2. CHẾ ĐỘ LƯỚI (Grid View) - FULL WIDTH IMAGE, GỌN GÀNG, VIỀN XỊN
    // =========================================================================
    return (
        <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 hover:border-blue-400 dark:border-slate-800 dark:hover:border-cyan-400 shadow-sm hover:shadow-[0_16px_36px_-10px_rgba(0,82,204,0.2)] hover:-translate-y-1 flex flex-col justify-between overflow-hidden transition-all duration-300 h-full relative">
            {/* 1. PRODUCT IMAGE SHOWCASE (Chuẩn e-commerce cao cấp, GIÃN FULL CARD 100%, TỶ LỆ 16:9 CHUẨN XỊN) */}
            <div className="relative w-full aspect-[16/9] bg-white dark:bg-slate-900 flex items-center justify-center border-b border-slate-100 dark:border-slate-800/80 overflow-hidden">
                <Link href={`/san-pham/${slugSanPham(sanPham)}`} className="relative w-full h-full block">
                    <Image
                        src={sanPham.hinh_anh_chinh}
                        alt={sanPham.ten_san_pham}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover w-full h-full group-hover:scale-106 transition-transform duration-500 ease-out"
                    />
                </Link>

                {/* Badge giảm giá góc trên trái (Gradient lửa đỏ hồng bo góc mềm) */}
                {sanPham.phan_tram_giam_gia > 0 && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-gradient-to-r from-[#EA1E2C] to-rose-600 text-white font-black text-[10.5px] shadow-sm select-none leading-tight tracking-tight flex items-center gap-0.5">
                        <span>-{sanPham.phan_tram_giam_gia}%</span>
                    </span>
                )}

                {/* Nút yêu thích góc trên phải (Heart icon viên kính tròn gọn) */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        chuyenDoiYeuThich(sanPham);
                    }}
                    className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/95 dark:bg-slate-800/90 backdrop-blur-md flex items-center justify-center shadow-sm border border-slate-200/80 dark:border-slate-700 transition-all hover:scale-110 active:scale-95 cursor-pointer ${
                        daYeuThich
                            ? 'text-[#EA1E2C]'
                            : 'text-slate-400 hover:text-[#EA1E2C]'
                    }`}
                    title={daYeuThich ? 'Đã thích' : 'Yêu thích'}
                >
                    <Heart className={`w-3.5 h-3.5 transition-transform ${daYeuThich ? 'fill-current text-[#EA1E2C]' : ''}`} />
                </button>
            </div>

            {/* 2. BODY KHU VỰC THÔNG TIN (Ngay hàng thẳng lối 100%, đồng bộ tuyệt đối) */}
            <div className="p-3 flex flex-col flex-1 justify-between gap-1.5">
                {/* META ROW: [BRAND] [⚡ Flash Sale] ... ⭐ 4.9 (46) - Cố định h-[20px] */}
                <div className="h-[20px] flex items-center justify-between gap-1 text-[11px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Brand Badge: dark navy 9.5px bold */}
                        <span className="px-1.5 py-0.5 rounded bg-[#0F172A] text-white text-[9.5px] font-black uppercase tracking-wider">
                            {sanPham.hang_san_xuat}
                        </span>

                        {/* Flash Sale Badge: pale red */}
                        {sanPham.la_flash_sale ? (
                            <span className="px-1.5 py-0.5 rounded bg-red-50 text-[#EA1E2C] border border-red-200/60 text-[9.5px] font-bold flex items-center gap-0.5">
                                ⚡ Flash Sale
                            </span>
                        ) : tagTrangThai ? (
                            <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold border ${tagTrangThai.mau}`}>
                                {tagTrangThai.text}
                            </span>
                        ) : null}
                    </div>

                    {/* Rating: 11px semibold */}
                    <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold text-[10.5px] sm:text-[11px] shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-bold">{sanPham.diem_danh_gia_tb ? sanPham.diem_danh_gia_tb.toFixed(1) : '5.0'}</span>
                        <span className="text-slate-400 font-normal">
                            ({sanPham.so_luong_danh_gia || sanPham.so_luong_da_ban || 114})
                        </span>
                    </div>
                </div>

                {/* 3. PRODUCT NAME (13-13.5px, weight 700 - Cố định h-[38px] đúng 2 dòng) */}
                <Link href={`/san-pham/${slugSanPham(sanPham)}`} className="h-[38px] block overflow-hidden">
                    <h4
                        className="text-[13px] sm:text-[13.5px] font-bold text-[#0F172A] dark:text-white line-clamp-2 leading-[19px] group-hover:text-[#0052cc] dark:group-hover:text-cyan-400 transition-colors"
                        title={sanPham.ten_san_pham}
                    >
                        {sanPham.ten_san_pham}
                    </h4>
                </Link>

                {/* 4. PRICE (Giá sale đỏ đậm 18-19.5px + Giá cũ - Cố định h-[24px]) */}
                <div className="h-[24px] flex items-baseline gap-2 overflow-hidden">
                    <span className="text-[18px] sm:text-[19.5px] font-black text-[#EA1E2C] tracking-tight leading-none">
                        {dinhDangTienVND(sanPham.gia_khuyen_mai)}
                    </span>
                    {sanPham.gia_goc > sanPham.gia_khuyen_mai && (
                        <span className="text-[11px] sm:text-[11.5px] text-slate-400 line-through font-normal">
                            {dinhDangTienVND(sanPham.gia_goc)}
                        </span>
                    )}
                </div>

                {/* 5. SPECS (Cố định h-[22px], chip đa sắc thanh lịch không đơn điệu) */}
                <div className="h-[22px] flex items-center gap-1 overflow-hidden whitespace-nowrap text-[10px]">
                    {cacThongSo.slice(0, 3).map((ts, idx) => {
                        const mauChip = [
                            'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-cyan-300 border-blue-200/60 dark:border-blue-900/50',
                            'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/50',
                            'bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200/60 dark:border-purple-900/50'
                        ][idx % 3];

                        return (
                            <span
                                key={idx}
                                className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border shrink-0 truncate max-w-[115px] ${mauChip}`}
                            >
                                {ts}
                            </span>
                        );
                    })}
                </div>

                {/* 6. GIFT / WARRANTY (Cố định h-[20px] trên 100% tất cả các card) */}
                <div className="h-[20px] flex items-center text-[10px] overflow-hidden">
                    {sanPham.qua_tang && sanPham.qua_tang.length > 0 ? (
                        <div className="text-emerald-700 dark:text-emerald-400 truncate flex items-center gap-1 font-medium" title={sanPham.qua_tang[0].ten_qua_tang}>
                            <Gift className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{sanPham.qua_tang[0].ten_qua_tang}</span>
                        </div>
                    ) : (
                        <div className="text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 font-normal">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate">{sanPham.thong_so?.che_do_bao_hanh || 'Bảo hành chính hãng 24-36 tháng'}</span>
                        </div>
                    )}
                </div>

                {/* 7. FLASH SALE STOCK PROGRESS BAR CHUẨN TGDD CÓ HIỆU ỨNG CHẠY CHẠY LIÊN TỤC */}
                {hienThiThanhFlashSale && (() => {
                    const daBan = sanPham.so_luong_da_ban || 114;
                    const tonKho = sanPham.so_luong_ton_kho !== undefined ? sanPham.so_luong_ton_kho : 25;
                    const tongSo = sanPham.tong_so_luong || (daBan + tonKho) || 200;
                    const phanTram = Math.min(100, Math.max(18, Math.round((daBan / (tongSo || 1)) * 100)));

                    return (
                        <div className="pt-0.5">
                            <div className="relative w-full h-[24px] bg-[#FFEADA] dark:bg-slate-800 rounded-full overflow-hidden flex items-center shadow-inner border border-orange-200/60 dark:border-slate-700/60">
                                {/* Dải tiến trình gradient lửa đỏ cam */}
                                <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FF7A00] via-[#FF3B00] to-[#E11D48] rounded-full transition-all duration-500 shadow-sm overflow-hidden"
                                    style={{ width: `${phanTram}%` }}
                                >
                                    {/* 1. HIỆU ỨNG SỌC CHÉO CHẠY CUỘN LIÊN TỤC (Barber-pole stripes) */}
                                    <div className="absolute inset-0 flash-sale-stripes opacity-75" />

                                    {/* 2. ĐẦU MÚT PHÁT SÁNG BEACON (Bốc cháy ở mép tiến trình) */}
                                    <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-r from-transparent via-white/80 to-amber-200 rounded-r-full blur-[0.5px]" />
                                    <div className="absolute right-0.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white animate-ping opacity-75" />
                                </div>

                                {/* 3. VỆT SÁNG SHIMMER LƯỚT QUA TOÀN BỘ THANH TIẾN TRÌNH */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                                    <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] flash-sale-shimmer" />
                                </div>

                                {/* 4. NỘI DUNG CHỮ TRÊN THANH TIẾN TRÌNH */}
                                <div className="relative z-10 w-full px-2.5 flex items-center justify-between text-[11px] font-bold select-none">
                                    <span className="flex items-center gap-1 tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                        <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-flame-wiggle shrink-0" />
                                        <span className="font-extrabold">Còn {tonKho}/{tongSo} suất</span>
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded-full bg-black/25 backdrop-blur-[2px] text-white/95 font-extrabold text-[9.5px] border border-white/20 shadow-xs tracking-tight">
                                        Đã bán {daBan}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* 8. BOTTOM CTA (mt-auto sát đáy, nút cao 38px, nằm ngang hàng trên toàn bộ card) */}
                <div className="pt-1.5 mt-auto border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                    <button
                        onClick={() => themVaoGioHang(sanPham)}
                        className="flex-1 h-9 px-3 rounded-xl bg-[#0052cc] hover:bg-[#003da5] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                    >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Thêm vào giỏ</span>
                    </button>
                    {hoTroSoSanh && (
                        <button
                            onClick={() => themVaoSoSanh(sanPham)}
                            className={`h-9 px-2.5 rounded-xl border transition-all cursor-pointer shrink-0 flex items-center gap-1 text-xs font-bold ${
                                daTrongSoSanh
                                    ? 'bg-blue-50 border-blue-500 text-[#0052cc] dark:bg-slate-800 dark:text-cyan-400 shadow-xs'
                                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#0052cc] hover:border-[#0052cc] hover:bg-blue-50/50'
                            }`}
                            title={daTrongSoSanh ? 'Bỏ so sánh' : 'So sánh sản phẩm'}
                        >
                            <GitCompare className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold">{daTrongSoSanh ? 'Đã chọn' : 'So sánh'}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
