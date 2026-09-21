'use client';
import React, { useState, useMemo } from 'react';
import {
    ChevronDown,
    ChevronUp,
    Cpu,
    Zap,
    HardDrive,
    Monitor,
    Radio,
    BatteryCharging,
    ShieldCheck,
    Headphones,
    Volume2,
    Wifi,
    Mic,
    Mouse,
    Keyboard,
    Sparkles,
    Check,
    Briefcase,
    Layers,
    Sliders,
    Power,
    Usb,
    Wind,
    Thermometer
} from 'lucide-react';

const TU_DIEN_THONG_SO_LABEL = {
    toc_do_bus: 'Tốc độ Bus RAM:',
    nang_cap_ram_toi_da: 'Khả năng nâng cấp RAM:',
    khe_cam_mo_rong: 'Khe cắm mở rộng SSD/M.2:',
    do_phan_giai: 'Độ phân giải chuẩn:',
    tam_nen: 'Công nghệ tấm nền:',
    do_phu_mau: 'Độ phủ gam màu:',
    chi_tiet_tan_nhiet: 'Hệ thống tản nhiệt:',
    tan_so_quet: 'Tần số quét màn hình:',
    do_sang_nits: 'Độ sáng cực đại (nits):',
    cong_suat_tgp: 'Công suất card đồ họa TGP:',
    bo_sac_cong_suat: 'Công suất bộ sạc đi kèm:',
    chat_lieu_vo: 'Chất liệu vỏ máy:',
    he_dieu_hanh: 'Hệ điều hành tích hợp:',
    che_do_bao_hanh: 'Chế độ bảo hành chính hãng:'
};

export default function BangThongSoKyThuat({ thongSo = {}, sanPham = {} }) {
    const ts = thongSo || {};

    const formatGiaTri = (val) => {
        if (Array.isArray(val)) return val.join(' • ');
        if (val === undefined || val === null || val === '') return null;
        return String(val);
    };

    // Nhận diện chính xác loại sản phẩm dựa trên danh mục & tên sản phẩm
    const danhMucList = Array.isArray(sanPham?.danh_muc) ? sanPham.danh_muc : (sanPham?.danh_muc ? [sanPham.danh_muc] : []);
    const tenSp = (sanPham?.ten_san_pham || '').toLowerCase();
    const idSp = (sanPham?.id || '').toLowerCase();

    const laBalo = danhMucList.some(d => ['balo-tui-chong-soc', 'balo', 'tui-chong-soc'].includes(d)) ||
        tenSp.includes('balo') || tenSp.includes('túi chống sốc') || tenSp.includes('túi đeo chéo') || tenSp.includes('cặp') ||
        idSp.includes('balo') || idSp.includes('tui-');

    const laBanPhim = danhMucList.includes('ban-phim-co') ||
        tenSp.includes('bàn phím') || tenSp.includes('keyboard') || tenSp.includes('phím cơ') ||
        idSp.includes('ban-phim');

    const laChuot = danhMucList.includes('chuot-lot-chuot') ||
        tenSp.includes('chuột') || tenSp.includes('mouse') || tenSp.includes('lót chuột') || tenSp.includes('bàn di chuột') ||
        idSp.includes('chuot') || idSp.includes('lot-chuot') || idSp.includes('ban-di-chuot');

    const laTaiNgheLoa = danhMucList.some(d => ['tai-nghe-loa', 'tai-nghe', 'loa'].includes(d)) ||
        tenSp.includes('tai nghe') || tenSp.includes('headphone') || tenSp.includes('earphone') || tenSp.includes('loa') ||
        idSp.includes('tai-nghe') || idSp.includes('loa-');

    const laSacHub = danhMucList.includes('sac-cap-hub') ||
        tenSp.includes('sạc') || tenSp.includes('charger') || tenSp.includes('cáp') || tenSp.includes('cable') ||
        tenSp.includes('hub') || tenSp.includes('dock') || tenSp.includes('pin sạc') || tenSp.includes('powerbank') ||
        idSp.includes('sac-') || idSp.includes('hub-') || idSp.includes('cap-') || idSp.includes('tram-sac');

    const laLinhKien = danhMucList.some(d => ['linh-kien-nang-cap', 'linh-kien', 'de-tan-gia-do'].includes(d)) ||
        tenSp.includes('ssd') || tenSp.includes('ram') || tenSp.includes('keo tản nhiệt') ||
        tenSp.includes('đế tản nhiệt') || tenSp.includes('quạt tản nhiệt') || tenSp.includes('giá đỡ') ||
        idSp.includes('ssd-') || idSp.includes('ram-') || idSp.includes('de-tan-') || idSp.includes('gia-do-') || idSp.includes('keo-tan-') || idSp.includes('cpu-');

    // Cấu trúc phân nhóm thông số chuẩn xác từng danh mục sản phẩm
    const cacNhomThongSo = useMemo(() => {
        // =========================================================================
        // 1. DÀNH CHO BALO & TÚI CHỐNG SỐC
        // =========================================================================
        if (laBalo) {
            return [
                {
                    id: 'balo_ngan_chua',
                    tenNhom: 'Ngăn Chứa & Kích Thước Máy',
                    icon: Briefcase,
                    mauSac: {
                        border: 'border-l-blue-600',
                        badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-cyan-300 border-blue-200 dark:border-blue-900',
                        iconBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-cyan-400'
                    },
                    danhSach: [
                        { nhan: 'Kích cỡ laptop tương thích:', giaTri: formatGiaTri(ts.kich_co_laptop_phu_hop), noiBat: true },
                        { nhan: 'Dung tích chứa đồ:', giaTri: formatGiaTri(ts.dung_tich) },
                        { nhan: 'Số lượng ngăn chứa:', giaTri: formatGiaTri(ts.so_ngan_chua) },
                        { nhan: 'Kích thước bên ngoài:', giaTri: formatGiaTri(ts.kich_thuoc) },
                        { nhan: 'Khối lượng thiết bị:', giaTri: ts.trong_luong ? `${ts.trong_luong} kg` : null, noiBat: true }
                    ]
                },
                {
                    id: 'balo_chat_lieu',
                    tenNhom: 'Chất Liệu & Khả Năng Kháng Nước',
                    icon: Layers,
                    mauSac: {
                        border: 'border-l-emerald-600',
                        badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
                        iconBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400'
                    },
                    danhSach: [
                        { nhan: 'Chất liệu vải chính:', giaTri: formatGiaTri(ts.chat_lieu_vai), noiBat: true },
                        { nhan: 'Lớp lót chống sốc / trầy xước:', giaTri: formatGiaTri(ts.lop_lot_bao_ve) },
                        { nhan: 'Thương hiệu khóa kéo:', giaTri: formatGiaTri(ts.khoa_keo) },
                        { nhan: 'Tiêu chuẩn kháng nước:', giaTri: formatGiaTri(ts.khang_nuoc), noiBat: true }
                    ]
                },
                {
                    id: 'balo_tien_ich',
                    tenNhom: 'Tiện Ích, Tính Năng & Bảo Hành',
                    icon: ShieldCheck,
                    mauSac: {
                        border: 'border-l-purple-600',
                        badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-900',
                        iconBg: 'bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400'
                    },
                    danhSach: [
                        { nhan: 'Tính năng nổi bật:', giaTri: formatGiaTri(ts.cong_tinh_nang), noiBat: true },
                        { nhan: 'Chính sách bảo hành:', giaTri: formatGiaTri(ts.che_do_bao_hanh) }
                    ]
                }
            ];
        }

        // =========================================================================
        // 2. DÀNH CHO BÀN PHÍM CƠ
        // =========================================================================
        if (laBanPhim) {
            return [
                {
                    id: 'keyboard_switch',
                    tenNhom: 'Switch & Cảm Giác Gõ Phím',
                    icon: Keyboard,
                    mauSac: {
                        border: 'border-l-blue-600',
                        badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-cyan-300 border-blue-200 dark:border-blue-900',
                        iconBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-cyan-400'
                    },
                    danhSach: [
                        { nhan: 'Loại Switch cơ học:', giaTri: formatGiaTri(ts.loai_switch), noiBat: true },
                        { nhan: 'Tính năng đặc biệt:', giaTri: formatGiaTri(ts.tinh_nang_dac_biet), noiBat: true },
                        { nhan: 'Cấu trúc giảm chấn (Mount):', giaTri: formatGiaTri(ts.cau_truc_mount) }
                    ]
                },
                {
                    id: 'keyboard_design',
                    tenNhom: 'Layout, Keycap & Khung Vỏ',
                    icon: Layers,
                    mauSac: {
                        border: 'border-l-purple-600',
                        badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-900',
                        iconBg: 'bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400'
                    },
                    danhSach: [
                        { nhan: 'Layout bàn phím:', giaTri: formatGiaTri(ts.layout), noiBat: true },
                        { nhan: 'Chất liệu Keycap:', giaTri: formatGiaTri(ts.keycap) },
                        { nhan: 'Chất liệu thân vỏ (Case):', giaTri: formatGiaTri(ts.chat_lieu_case) },
                        { nhan: 'Khối lượng thiết bị:', giaTri: ts.trong_luong ? `${ts.trong_luong} kg` : null }
                    ]
                },
                {
                    id: 'keyboard_connect',
                    tenNhom: 'Kết Nối, Đèn LED & Pin',
                    icon: Wifi,
                    mauSac: {
                        border: 'border-l-emerald-600',
                        badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
                        iconBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400'
                    },
                    danhSach: [
                        { nhan: 'Phương thức kết nối:', giaTri: formatGiaTri(ts.ket_noi), noiBat: true },
                        { nhan: 'Hệ thống đèn LED:', giaTri: formatGiaTri(ts.den_led), noiBat: true },
                        { nhan: 'Dung lượng Pin / Nguồn điện:', giaTri: formatGiaTri(ts.dung_luong_pin) },
                        { nhan: 'Khả năng tương thích:', giaTri: formatGiaTri(ts.tuong_thich) },
                        { nhan: 'Chính sách bảo hành:', giaTri: formatGiaTri(ts.che_do_bao_hanh) }
                    ]
                }
            ];
        }

        // =========================================================================
        // 3. DÀNH CHO CHUỘT & LÓT CHUỘT
        // =========================================================================
        if (laChuot) {
            return [
                {
                    id: 'mouse_sensor',
                    tenNhom: 'Cảm Biến, DPI & Độ Chính Xác',
                    icon: Mouse,
                    mauSac: {
                        border: 'border-l-blue-600',
                        badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-cyan-300 border-blue-200 dark:border-blue-900',
                        iconBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-cyan-400'
                    },
                    danhSach: [
                        { nhan: 'Mắt đọc cảm biến:', giaTri: formatGiaTri(ts.mat_doc_cam_bien), noiBat: true },
                        { nhan: 'Độ phân giải tối đa (DPI):', giaTri: formatGiaTri(ts.do_phan_giai_dpi), noiBat: true },
                        { nhan: 'Tốc độ theo dõi & Gia tốc:', giaTri: formatGiaTri(ts.toc_do_ips_gia_toc) },
                        { nhan: 'Switch chuột:', giaTri: formatGiaTri(ts.switch_chuot) },
                        { nhan: 'Tần số phản hồi (Polling Rate):', giaTri: formatGiaTri(ts.polling_rate) },
                        { nhan: 'Loại lót chuột:', giaTri: formatGiaTri(ts.loai_lot_chuot), noiBat: true },
                        { nhan: 'Bề mặt lót chuột:', giaTri: formatGiaTri(ts.chat_lieu_be_mat) },
                        { nhan: 'Đế lót chuột:', giaTri: formatGiaTri(ts.chat_lieu_de) || formatGiaTri(ts.do_cung_de) }
                    ]
                },
                {
                    id: 'mouse_connect',
                    tenNhom: 'Kết Nối, Kích Thước & Thời Lượng Pin',
                    icon: BatteryCharging,
                    mauSac: {
                        border: 'border-l-emerald-600',
                        badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
                        iconBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400'
                    },
                    danhSach: [
                        { nhan: 'Phương thức kết nối:', giaTri: formatGiaTri(ts.ket_noi), noiBat: true },
                        { nhan: 'Đèn LED viền:', giaTri: formatGiaTri(ts.che_do_led) },
                        { nhan: 'Thời lượng Pin / Nguồn điện:', giaTri: formatGiaTri(ts.dung_luong_pin) || formatGiaTri(ts.nguon_dien) },
                        { nhan: 'Đế chuột (Feet):', giaTri: formatGiaTri(ts.chat_lieu_feet) },
                        { nhan: 'Kích thước:', giaTri: formatGiaTri(ts.kich_thuoc) },
                        { nhan: 'Khối lượng thiết bị:', giaTri: ts.trong_luong ? `${ts.trong_luong < 1 ? Math.round(ts.trong_luong * 1000) + ' gram' : ts.trong_luong + ' kg'}` : null, noiBat: true },
                        { nhan: 'Chính sách bảo hành:', giaTri: formatGiaTri(ts.che_do_bao_hanh) }
                    ]
                }
            ];
        }

        // =========================================================================
        // 4. DÀNH CHO TAI NGHE & LOA
        // =========================================================================
        if (laTaiNgheLoa) {
            return [
                {
                    id: 'audio_driver',
                    tenNhom: 'Màng Loa & Công Nghệ Âm Thanh',
                    icon: Headphones,
                    mauSac: {
                        border: 'border-l-blue-600',
                        badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-cyan-300 border-blue-200 dark:border-blue-900',
                        iconBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-cyan-400'
                    },
                    danhSach: [
                        { nhan: 'Màng loa / Củ loa Driver:', giaTri: formatGiaTri(ts.mang_loa_driver), noiBat: true },
                        { nhan: 'Công nghệ âm thanh:', giaTri: formatGiaTri(ts.cong_nghe_am_thanh), noiBat: true },
                        { nhan: 'Dải tần số đáp ứng:', giaTri: formatGiaTri(ts.dai_tan_so) },
                        { nhan: 'Trở kháng & Độ nhạy:', giaTri: formatGiaTri(ts.tro_khang_do_nhay) },
                        { nhan: 'Công nghệ chống ồn ANC:', giaTri: formatGiaTri(ts.chong_on_anc) },
                        { nhan: 'Micro đàm thoại:', giaTri: formatGiaTri(ts.micro) }
                    ]
                },
                {
                    id: 'audio_connect',
                    tenNhom: 'Kết Nối, Pin & Thiết Kế',
                    icon: BatteryCharging,
                    mauSac: {
                        border: 'border-l-emerald-600',
                        badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
                        iconBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400'
                    },
                    danhSach: [
                        { nhan: 'Chuẩn kết nối:', giaTri: formatGiaTri(ts.ket_noi), noiBat: true },
                        { nhan: 'Thời lượng Pin:', giaTri: formatGiaTri(ts.dung_luong_pin), noiBat: true },
                        { nhan: 'Tiêu chuẩn kháng nước:', giaTri: formatGiaTri(ts.khang_nuoc) },
                        { nhan: 'Chất liệu đệm tai:', giaTri: formatGiaTri(ts.dem_tai) },
                        { nhan: 'Bộ điều khiển:', giaTri: formatGiaTri(ts.bo_dieu_khien) },
                        { nhan: 'Kích thước:', giaTri: formatGiaTri(ts.kich_thuoc) },
                        { nhan: 'Khối lượng thiết bị:', giaTri: ts.trong_luong ? `${ts.trong_luong < 1 ? Math.round(ts.trong_luong * 1000) + ' gram' : ts.trong_luong + ' kg'}` : null },
                        { nhan: 'Chính sách bảo hành:', giaTri: formatGiaTri(ts.che_do_bao_hanh) }
                    ]
                }
            ];
        }

        // =========================================================================
        // 5. DÀNH CHO CỦ SẠC, CÁP, PIN DỰ PHÒNG & HUB MỞ RỘNG
        // =========================================================================
        if (laSacHub) {
            return [
                {
                    id: 'power_specs',
                    tenNhom: 'Công Suất & Công Nghệ Sạc Nhanh',
                    icon: Zap,
                    mauSac: {
                        border: 'border-l-amber-500',
                        badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-900',
                        iconBg: 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400'
                    },
                    danhSach: [
                        { nhan: 'Công suất sạc tối đa:', giaTri: formatGiaTri(ts.cong_suat_toi_da), noiBat: true },
                        { nhan: 'Công nghệ sạc nhanh:', giaTri: formatGiaTri(ts.cong_nghe_sac), noiBat: true },
                        { nhan: 'Giao thức sạc hỗ trợ:', giaTri: formatGiaTri(ts.giao_thuc_ho_tro) },
                        { nhan: 'Dung lượng pin sạc dự phòng:', giaTri: formatGiaTri(ts.dung_luong_pin) },
                        { nhan: 'Màn hình hiển thị:', giaTri: formatGiaTri(ts.man_hinh_hien_thi) },
                        { nhan: 'Tính năng bảo vệ an toàn:', giaTri: formatGiaTri(ts.tinh_nang_an_toan) }
                    ]
                },
                {
                    id: 'hub_ports',
                    tenNhom: 'Cổng Kết Nối & Băng Thông Truyền Tải',
                    icon: Usb,
                    mauSac: {
                        border: 'border-l-blue-600',
                        badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-cyan-300 border-blue-200 dark:border-blue-900',
                        iconBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-cyan-400'
                    },
                    danhSach: [
                        { nhan: 'Số lượng & loại cổng kết nối:', giaTri: Array.isArray(ts.so_cong_dau_ra) ? ts.so_cong_dau_ra.join(' • ') : formatGiaTri(ts.so_cong_dau_ra), noiBat: true },
                        { nhan: 'Băng thông truyền dữ liệu:', giaTri: formatGiaTri(ts.bang_thong_truyen_du_lieu) },
                        { nhan: 'Sạc chuyển tiếp (Pass-through):', giaTri: formatGiaTri(ts.cong_suat_sac_pass_through) },
                        { nhan: 'Khả năng xuất hình ảnh:', giaTri: formatGiaTri(ts.xuat_hinh_anh) },
                        { nhan: 'Chiều dài dây cáp:', giaTri: formatGiaTri(ts.chieu_dai_cap) },
                        { nhan: 'Chất liệu thân vỏ:', giaTri: formatGiaTri(ts.chat_lieu_vo) },
                        { nhan: 'Kích thước:', giaTri: formatGiaTri(ts.kich_thuoc) },
                        { nhan: 'Khối lượng thiết bị:', giaTri: ts.trong_luong ? `${ts.trong_luong < 1 ? Math.round(ts.trong_luong * 1000) + ' gram' : ts.trong_luong + ' kg'}` : null },
                        { nhan: 'Khả năng tương thích:', giaTri: formatGiaTri(ts.tuong_thich) },
                        { nhan: 'Chính sách bảo hành:', giaTri: formatGiaTri(ts.che_do_bao_hanh) }
                    ]
                }
            ];
        }

        // =========================================================================
        // 6. DÀNH CHO LINH KIỆN NÂNG CẤP (RAM, SSD, TẢN NHIỆT, CPU RỜI)
        // =========================================================================
        if (laLinhKien) {
            return [
                {
                    id: 'hardware_perf',
                    tenNhom: 'Hiệu Năng & Tốc Độ Truyền Tải',
                    icon: HardDrive,
                    mauSac: {
                        border: 'border-l-emerald-600',
                        badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
                        iconBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400'
                    },
                    danhSach: [
                        { nhan: 'Loại linh kiện / Thiết bị:', giaTri: formatGiaTri(ts.loai_linh_kien), noiBat: true },
                        { nhan: 'Dung lượng bộ nhớ / Lưu trữ:', giaTri: formatGiaTri(ts.dung_luong), noiBat: true },
                        { nhan: 'Tốc độ đọc / ghi tuần tự:', giaTri: formatGiaTri(ts.toc_do) },
                        { nhan: 'Tốc độ Bus RAM:', giaTri: formatGiaTri(ts.toc_do_bus) },
                        { nhan: 'Độ trễ CAS Latency:', giaTri: formatGiaTri(ts.do_tre_cl) },
                        { nhan: 'Tốc độ quạt tản nhiệt:', giaTri: formatGiaTri(ts.toc_do_quat) },
                        { nhan: 'Hiệu quả hạ nhiệt độ:', giaTri: formatGiaTri(ts.hieu_qua_giam_nhiet), noiBat: true },
                        { nhan: 'Độ dẫn nhiệt:', giaTri: formatGiaTri(ts.do_dan_nhiet), noiBat: true },
                        { nhan: 'Số nhân & Luồng xử lý:', giaTri: formatGiaTri(ts.so_nhan_luong) },
                        { nhan: 'Xung nhịp tối đa:', giaTri: formatGiaTri(ts.xung_nhip_toi_da) }
                    ]
                },
                {
                    id: 'hardware_specs',
                    tenNhom: 'Chuẩn Giao Tiếp & Độ Bền',
                    icon: Zap,
                    mauSac: {
                        border: 'border-l-blue-600',
                        badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-cyan-300 border-blue-200 dark:border-blue-900',
                        iconBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-cyan-400'
                    },
                    danhSach: [
                        { nhan: 'Chuẩn chân cắm / Giao tiếp:', giaTri: formatGiaTri(ts.chuan_giao_tiep), noiBat: true },
                        { nhan: 'Độ bền ghi xóa (TBW / MTBF):', giaTri: formatGiaTri(ts.do_ben_tbw) || formatGiaTri(ts.do_ben_chong_chiu) },
                        { nhan: 'Tính năng đặc biệt:', giaTri: formatGiaTri(ts.tinh_nang_dac_biet) },
                        { nhan: 'Tương thích laptop:', giaTri: formatGiaTri(ts.kich_co_laptop_phu_hop) },
                        { nhan: 'Khối lượng thiết bị:', giaTri: ts.trong_luong ? `${ts.trong_luong < 1 ? Math.round(ts.trong_luong * 1000) + ' gram' : ts.trong_luong + ' kg'}` : null },
                        { nhan: 'Chính sách bảo hành:', giaTri: formatGiaTri(ts.che_do_bao_hanh) }
                    ]
                }
            ];
        }

        // =========================================================================
        // 7. CẤU TRÚC CHUẨN DÀNH CHO LAPTOP & MÁY TÍNH
        // =========================================================================
        return [
            {
                id: 'cpu',
                tenNhom: 'Bộ Xử Lý & Hiệu Năng (CPU)',
                icon: Cpu,
                mauSac: {
                    border: 'border-l-blue-600',
                    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-cyan-300 border-blue-200 dark:border-blue-900',
                    iconBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-cyan-400'
                },
                danhSach: [
                    { nhan: 'Công nghệ CPU:', giaTri: formatGiaTri(ts.cpu), noiBat: true },
                    { nhan: 'Số nhân & Luồng:', giaTri: formatGiaTri(ts.so_nhan_luong) },
                    { nhan: 'Tốc độ xung nhịp:', giaTri: formatGiaTri(ts.xung_nhip_toi_da) },
                    { nhan: 'Bộ nhớ đệm (Cache):', giaTri: formatGiaTri(ts.bo_nho_dem_cache) },
                    { nhan: 'Chip AI NPU:', giaTri: formatGiaTri(ts.chip_ai_npu) },
                    { nhan: 'Hiệu năng AI (TOPS):', giaTri: ts.hieu_nang_ai_tops ? `${ts.hieu_nang_ai_tops} TOPS` : null }
                ]
            },
            {
                id: 'gpu',
                tenNhom: 'Đồ Họa & Xử Lý Hình Ảnh (GPU)',
                icon: Zap,
                mauSac: {
                    border: 'border-l-purple-600',
                    badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-900',
                    iconBg: 'bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400'
                },
                danhSach: [
                    { nhan: 'Card đồ họa:', giaTri: formatGiaTri(ts.card_do_hoa), noiBat: true },
                    { nhan: 'Bộ nhớ đồ họa (VRAM):', giaTri: formatGiaTri(ts.dung_luong_vram) },
                    { nhan: 'Công suất TGP tối đa:', giaTri: ts.cong_suat_tgp ? `${ts.cong_suat_tgp}W Dynamic Boost` : null },
                    { nhan: 'Hỗ trợ Ray Tracing:', giaTri: ts.ho_tro_ray_tracing ? 'Có hỗ trợ Ray Tracing & DLSS 3.5' : null }
                ]
            },
            {
                id: 'ram_ssd',
                tenNhom: 'Bộ Nhớ RAM & Ổ Cứng Lưu Trữ',
                icon: HardDrive,
                mauSac: {
                    border: 'border-l-emerald-600',
                    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
                    iconBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400'
                },
                danhSach: [
                    { nhan: 'Dung lượng RAM:', giaTri: formatGiaTri(ts.ram), noiBat: true },
                    { nhan: 'Loại RAM & Tốc độ Bus:', giaTri: formatGiaTri(ts.loai_ram) || (ts.toc_do_bus ? `${ts.toc_do_bus} MHz` : null) },
                    { nhan: 'Khả năng nâng cấp RAM:', giaTri: formatGiaTri(ts.nang_cap_ram_toi_da) },
                    { nhan: 'Dung lượng ổ cứng:', giaTri: formatGiaTri(ts.o_cung), noiBat: true },
                    { nhan: 'Khe cắm mở rộng:', giaTri: formatGiaTri(ts.khe_cam_mo_rong) }
                ]
            },
            {
                id: 'man_hinh',
                tenNhom: 'Màn Hình & Công Nghệ Hiển Thị',
                icon: Monitor,
                mauSac: {
                    border: 'border-l-sky-600',
                    badge: 'bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 border-sky-200 dark:border-sky-900',
                    iconBg: 'bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-400'
                },
                danhSach: [
                    { nhan: 'Kích thước màn hình:', giaTri: formatGiaTri(ts.man_hinh), noiBat: true },
                    { nhan: 'Độ phân giải chuẩn:', giaTri: formatGiaTri(ts.do_phan_giai), noiBat: true },
                    { nhan: 'Tần số quét màn hình:', giaTri: ts.tan_so_quet && ts.tan_so_quet > 0 ? `${ts.tan_so_quet} Hz` : null, noiBat: true },
                    { nhan: 'Công nghệ tấm nền:', giaTri: formatGiaTri(ts.tam_nen) },
                    { nhan: 'Độ phủ gam màu:', giaTri: formatGiaTri(ts.do_phu_mau) },
                    { nhan: 'Độ sáng cực đại:', giaTri: ts.do_sang_nits ? `${ts.do_sang_nits} nits` : null },
                    { nhan: 'Công nghệ màn hình:', giaTri: Array.isArray(ts.cong_nghe_man_hinh) ? ts.cong_nghe_man_hinh.join(', ') : formatGiaTri(ts.cong_nghe_man_hinh) }
                ]
            },
            {
                id: 'pin_tan_nhiet',
                tenNhom: 'Kích Thước, Pin & Tản Nhiệt',
                icon: BatteryCharging,
                mauSac: {
                    border: 'border-l-amber-500',
                    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-900',
                    iconBg: 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400'
                },
                danhSach: [
                    { nhan: 'Khối lượng thiết bị:', giaTri: ts.trong_luong ? `${ts.trong_luong} kg` : null, noiBat: true },
                    { nhan: 'Kích thước (Dài x Rộng x Dày):', giaTri: formatGiaTri(ts.kich_thuoc) },
                    { nhan: 'Dung lượng Pin:', giaTri: formatGiaTri(ts.dung_luong_pin), noiBat: true },
                    { nhan: 'Thời lượng pin ước tính:', giaTri: formatGiaTri(ts.thoi_luong_su_dung_uoc_tinh) },
                    { nhan: 'Công suất sạc nhanh:', giaTri: formatGiaTri(ts.cong_suat_sac) },
                    { nhan: 'Hệ thống tản nhiệt:', giaTri: formatGiaTri(ts.he_thong_tan_nhiet) || formatGiaTri(ts.chi_tiet_tan_nhiet) },
                    { nhan: 'Chất liệu thân vỏ:', giaTri: formatGiaTri(ts.chat_lieu_vo) }
                ]
            },
            {
                id: 'ket_noi_os',
                tenNhom: 'Cổng Kết Nối, Hệ Điều Hành & Bảo Hành',
                icon: Radio,
                mauSac: {
                    border: 'border-l-indigo-600',
                    badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900',
                    iconBg: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400'
                },
                danhSach: [
                    { nhan: 'Cổng giao tiếp ngoại vi:', giaTri: Array.isArray(ts.cong_ket_noi) ? ts.cong_ket_noi.join(' • ') : formatGiaTri(ts.cong_ket_noi) },
                    { nhan: 'Chuẩn Wi-Fi & Bluetooth:', giaTri: formatGiaTri(ts.chuan_wifi_bluetooth) },
                    { nhan: 'Bàn phím & Đèn nền:', giaTri: formatGiaTri(ts.ban_phim) },
                    { nhan: 'Công nghệ âm thanh:', giaTri: formatGiaTri(ts.am_thanh) },
                    { nhan: 'Hệ điều hành tích hợp:', giaTri: formatGiaTri(ts.he_dieu_hanh), noiBat: true },
                    { nhan: 'Chính sách bảo hành:', giaTri: formatGiaTri(ts.che_do_bao_hanh) || 'Bảo hành chính hãng 24 tháng tại TNTP LAPTOP' }
                ]
            }
        ];

        // Tự động gom mọi thông số tùy biến do Admin bổ sung để hiển thị trọn vẹn ra website
        const daCoKey = new Set([
            'cpu', 'so_nhan_luong', 'xung_nhip_toi_da', 'bo_nho_dem_cache', 'chip_ai_npu', 'hieu_nang_ai_tops',
            'card_do_hoa', 'dung_luong_vram', 'cong_suat_tgp', 'ho_tro_ray_tracing',
            'ram', 'loai_ram', 'toc_do_bus', 'nang_cap_ram_toi_da', 'o_cung', 'khe_cam_mo_rong',
            'man_hinh', 'do_phan_giai', 'tan_so_quet', 'tam_nen', 'do_phu_mau', 'do_sang_nits', 'cong_nghe_man_hinh',
            'pin', 'dung_luong_pin', 'bo_sac_cong_suat', 'kich_thuoc', 'trong_luong', 'chat_lieu_vo', 'chi_tiet_tan_nhiet',
            'cong_ket_noi', 'chuan_wifi_bluetooth', 'ban_phim', 'am_thanh', 'he_dieu_hanh', 'che_do_bao_hanh',
            'kich_co_laptop_phu_hop', 'dung_tich', 'so_ngan_chua', 'chat_lieu_vai', 'lop_lot_bao_ve', 'khoa_keo', 'khang_nuoc', 'cong_tinh_nang',
            'switch', 'loai_switch', 'layout', 'keycap', 'kieu_ket_noi', 'led_rgb', 'hot_swap',
            'cam_bien', 'do_phan_giai_dpi', 'switch_chuot', 'thoi_luong_pin',
            'mang_loa_driver', 'tan_so_dap_ung', 'chuan_ket_noi', 'micro',
            'cong_suat_tong', 'so_cong_sac', 'cong_nghe_sac', 'tuong_thich', 'kich_thuoc_trong_luong',
            'chuan_giao_tiep', 'dung_luong', 'toc_do_doc_ghi', 'he_thong_tan_nhiet'
        ]);

        const thongSoConLai = Object.entries(ts).filter(([k, v]) => !daCoKey.has(k) && v !== undefined && v !== null && v !== '');
        if (thongSoConLai.length > 0) {
            nhomThongSoChuan.push({
                id: 'thong_so_bo_sung_mo_rong',
                tenNhom: 'Thông Số Bổ Sung & Tính Năng Mở Rộng',
                icon: Sliders,
                mauSac: {
                    border: 'border-l-amber-500',
                    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-900',
                    iconBg: 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400'
                },
                danhSach: thongSoConLai.map(([k, v]) => {
                    const nhanFormatted = TU_DIEN_THONG_SO_LABEL[k] || (/[À-ỹ\sA-Z]/.test(k) ? (k.endsWith(':') ? k : `${k}:`) : (k.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ':'));
                    return {
                        nhan: nhanFormatted,
                        giaTri: formatGiaTri(v),
                        noiBat: true
                    };
                })
            });
        }

        return nhomThongSoChuan;
    }, [laBalo, laBanPhim, laChuot, laTaiNgheLoa, laSacHub, laLinhKien, ts]);

    // Lọc nhóm hợp lệ có ít nhất 1 thông số (loại bỏ các mục null/undefined)
    const danhSachHopLe = useMemo(() => {
        return cacNhomThongSo
            .map(nhom => ({
                ...nhom,
                danhSach: nhom.danhSach.filter(d => d.giaTri !== null && d.giaTri !== undefined && d.giaTri !== '')
            }))
            .filter(nhom => nhom.danhSach.length > 0);
    }, [cacNhomThongSo]);

    // Mặc định mở tất cả các nhóm
    const [nhomDangMo, setNhomDangMo] = useState(() => {
        const khoiTao = {};
        danhSachHopLe.forEach(n => {
            khoiTao[n.id] = true;
        });
        return khoiTao;
    });

    const toggleNhom = (id) => {
        setNhomDangMo(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (danhSachHopLe.length === 0) {
        return (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="font-bold text-sm">Thông số kỹ thuật đang được cập nhật từ nhà sản xuất.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {danhSachHopLe.map((nhom) => {
                const IconComponent = nhom.icon;
                const dangMo = nhomDangMo[nhom.id] !== false;

                return (
                    <div
                        key={nhom.id}
                        className={`rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs transition-all border-l-4 ${nhom.mauSac.border}`}
                    >
                        {/* Header của nhóm */}
                        <button
                            type="button"
                            onClick={() => toggleNhom(nhom.id)}
                            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${nhom.mauSac.iconBg}`}>
                                    <IconComponent className="w-4 h-4" />
                                </div>
                                <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-tight">
                                    {nhom.tenNhom}
                                </span>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${nhom.mauSac.badge}`}>
                                    {nhom.danhSach.length} mục
                                </span>
                                {dangMo ? (
                                    <ChevronUp className="w-4 h-4 text-slate-400" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                )}
                            </div>
                        </button>

                        {/* Bảng chi tiết các thông số trong nhóm */}
                        {dangMo && (
                            <div className="border-t border-slate-100 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800/60">
                                {nhom.danhSach.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`grid grid-cols-1 sm:grid-cols-12 p-3 sm:p-3.5 text-xs transition-colors hover:bg-blue-50/30 dark:hover:bg-blue-950/20 ${
                                            item.noiBat
                                                ? 'bg-slate-50/50 dark:bg-slate-800/20'
                                                : ''
                                        }`}
                                    >
                                        <div className="sm:col-span-5 font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 pb-1 sm:pb-0">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                                            <span>{item.nhan}</span>
                                        </div>

                                        <div className="sm:col-span-7 font-extrabold text-slate-900 dark:text-slate-100 flex items-center">
                                            {item.noiBat ? (
                                                <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/80 text-[#0052cc] dark:text-cyan-400 border border-blue-200 dark:border-blue-900 font-black">
                                                    {item.giaTri}
                                                </span>
                                            ) : (
                                                <span className="leading-relaxed font-semibold text-slate-800 dark:text-slate-200">
                                                    {item.giaTri}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
