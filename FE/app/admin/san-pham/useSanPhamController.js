'use client';
import { useMemo } from 'react';

import { SanPhamService } from '@/services/san-pham.service';

import { loiLinkAnh } from '@/utils/anh-san-pham';

import { TU_DIEN_THONG_SO_ADMIN } from '@/app/admin/constants/tu-dien-thong-so';

// Xử lý nghiệp vụ SanPham; dữ liệu dùng chung được truyền từ controller chính.
export default function useSanPhamController(dependencies) {
    const { canhBao, chuyenKeySangSlug, danhSachDanhMuc, formSp, hienThongBao, lamTrongFormSp, layTenHienThiKey, loaiFormSanPham, setDangLuuSp, setDangMoModalSp, setDanhSachSanPham, setFormSp, setFormSpGoc, setLoaiFormSanPham, setSpDangSua, setTabModalSp, setThongSoTuyChinh, setThongSoTuyChinhGoc, spDangSua, taiDuLieuToanBo, thongSoTuyChinh, TU_DIEN_THONG_SO_ADMIN, tuyChonXemTruoc, xacDinhLoaiSanPham } = dependencies;
    const { danhSachSanPham, tuKhoaGlobal, tuKhoaSanPham, locNganhHang, locHangSanPham, locTonKhoSanPham, sapXepSanPham } = dependencies;
    // Mở form thêm sản phẩm mới và xóa dữ liệu mẫu trong form.
    const moModalThemSp = () => {
        setSpDangSua(null);
        setFormSpGoc(null);
        setThongSoTuyChinhGoc([]);
        setTabModalSp('thong_tin');
        setLoaiFormSanPham('laptop');
        setThongSoTuyChinh([]);
        // Form thêm mới không tự gắn nhãn Hàng Mới; admin chủ động bật khi cần.
        setFormSp(lamTrongFormSp(formSp));
        setDangMoModalSp(true);
    };

    // Đưa dữ liệu sản phẩm đang chọn vào form chỉnh sửa.
    const moModalSuaSp = (sp, tabMacDinh = 'thong_tin') => {
        setSpDangSua(sp);
        setTabModalSp(tabMacDinh);
        const loaiForm = xacDinhLoaiSanPham(sp);
        setLoaiFormSanPham(loaiForm);

        const specs = sp.thong_so || {};
        const dinhDangChuoiHoacMang = (val) => {
            if (Array.isArray(val)) return val.join(', ');
            if (val === undefined || val === null) return '';
            return String(val);
        };

        const standardKeys = [
            'cpu', 'so_nhan_luong', 'xung_nhip_toi_da', 'bo_nho_dem_cache', 'chip_ai_npu', 'hieu_nang_ai_tops',
            'card_do_hoa', 'dung_luong_vram', 'cong_suat_tgp', 'ho_tro_ray_tracing',
            'ram', 'loai_ram', 'toc_do_bus', 'nang_cap_ram_toi_da', 'o_cung', 'khe_cam_mo_rong',
            'man_hinh', 'do_phan_giai', 'tan_so_quet', 'tam_nen', 'do_phu_mau', 'do_sang_nits', 'cong_nghe_man_hinh',
            'pin', 'dung_luong_pin', 'thoi_luong_su_dung_uoc_tinh', 'cong_suat_sac', 'bo_sac_cong_suat',
            'he_thong_tan_nhiet', 'chi_tiet_tan_nhiet', 'trong_luong', 'kich_thuoc', 'chat_lieu_vo',
            'cong_ket_noi', 'chuan_wifi_bluetooth', 'ban_phim', 'am_thanh', 'he_dieu_hanh', 'che_do_bao_hanh',
            'switch', 'loai_switch', 'tinh_nang_dac_biet', 'cau_truc_mount', 'layout', 'layout_ban_phim',
            'keycap', 'keycap_chat_lieu', 'chat_lieu_case', 'kieu_ket_noi', 'ket_noi', 'led_rgb', 'den_led',
            'hot_swap', 'tuong_thich', 'cam_bien', 'mat_doc_cam_bien', 'do_phan_giai_dpi', 'toc_do_ips_gia_toc',
            'switch_chuot', 'polling_rate', 'loai_lot_chuot', 'chat_lieu_be_mat', 'chat_lieu_de', 'che_do_led',
            'thoi_luong_pin', 'nguon_dien', 'chat_lieu_feet', 'kich_co_laptop_phu_hop', 'dung_tich', 'so_ngan_chua',
            'chat_lieu_vai', 'chat_lieu_chinh', 'lop_lot_bao_ve', 'khoa_keo', 'khang_nuoc', 'kha_nang_khang_nuoc',
            'dem_lung_thoang_khi', 'cong_tinh_nang', 'mang_loa_driver', 'cong_nghe_am_thanh', 'dai_tan_so',
            'tan_so_dap_ung', 'tro_khang_do_nhay', 'chong_on_anc', 'micro', 'dem_tai', 'bo_dieu_khien',
            'cong_suat_tong', 'cong_suat_toi_da', 'cong_nghe_sac', 'giao_thuc_ho_tro', 'man_hinh_hien_thi',
            'tinh_nang_an_toan', 'so_cong_sac', 'so_cong_dau_ra', 'bang_thong_truyen_du_lieu',
            'cong_suat_sac_pass_through', 'xuat_hinh_anh', 'chieu_dai_cap', 'kich_thuoc_trong_luong',
            'loai_linh_kien', 'dung_luong', 'toc_do', 'toc_do_doc_ghi', 'do_tre_cl', 'cong_suat_tdp',
            'ho_tro_ram', 'toc_do_quat', 'hieu_qua_giam_nhiet', 'do_dan_nhiet', 'chuan_giao_tiep',
            'do_ben_tbw', 'do_ben_chong_chiu'
        ];

        const customItems = [];
        Object.entries(specs).forEach(([k, v]) => {
            if (!standardKeys.includes(k) && !k.startsWith('tieu_de_nhom_') && v !== undefined && v !== null && String(v).trim()) {
                const tenTiengViet = TU_DIEN_THONG_SO_ADMIN[k] || layTenHienThiKey(k);
                customItems.push({ key: tenTiengViet, value: String(v).trim() });
            }
        });
        setThongSoTuyChinh(customItems);
        setThongSoTuyChinhGoc(JSON.parse(JSON.stringify(customItems)));

        const formSuaMoi = {
            ma_san_pham: sp.ma_san_pham || '',
            ten_san_pham: sp.ten_san_pham || '',
            hang_san_xuat: sp.hang_san_xuat || '',
            danh_muc: Array.isArray(sp.danh_muc) ? sp.danh_muc : [],
            gia_goc: sp.gia_goc || 0,
            gia_khuyen_mai: sp.gia_khuyen_mai || 0,
            phan_tram_giam_gia: sp.phan_tram_giam_gia || 0,
            hinh_anh_chinh: sp.hinh_anh_chinh || '',
            so_luong_ton_kho: sp.so_luong_ton_kho !== undefined ? sp.so_luong_ton_kho : 10,
            con_hang: sp.con_hang !== false,
            la_flash_sale: !!sp.la_flash_sale,
            la_ban_chay: !!sp.la_ban_chay,
            la_san_pham_moi: !!sp.la_san_pham_moi,
            mo_ta_chi_tiet: sp.mo_ta_chi_tiet || '',
            mo_ta_ngan: sp.mo_ta_ngan || specs.mo_ta_ngan || '',
            dac_diem_noi_bat: Array.isArray(sp.dac_diem_noi_bat) ? [...sp.dac_diem_noi_bat] : [],
            qua_tang: Array.isArray(sp.qua_tang) ? JSON.parse(JSON.stringify(sp.qua_tang)) : [],
            tuy_chon_phien_ban: Array.isArray(sp.tuy_chon_phien_ban) ? JSON.parse(JSON.stringify(sp.tuy_chon_phien_ban)) : [],
            thu_vien_hinh_anh: Array.isArray(sp.thu_vien_hinh_anh) ? [...sp.thu_vien_hinh_anh] : [],

            // Tiêu đề phân nhóm cấu hình kỹ thuật tùy biến (đọc từ MongoDB nếu đã sửa)
            tieu_de_nhom_cpu: specs.tieu_de_nhom_cpu || '1. Bộ Xử Lý & Hiệu Năng (CPU)',
            tieu_de_nhom_gpu: specs.tieu_de_nhom_gpu || '2. Đồ Họa & Xử Lý Hình Ảnh (GPU)',
            tieu_de_nhom_ram: specs.tieu_de_nhom_ram || '3. Bộ Nhớ RAM & Ổ Cứng Lưu Trữ',
            tieu_de_nhom_man_hinh: specs.tieu_de_nhom_man_hinh || '4. Màn Hình & Không Gian Hiển Thị',
            tieu_de_nhom_pin: specs.tieu_de_nhom_pin || '5. Hệ Thống Tản Nhiệt & Thời Lượng Pin',
            tieu_de_nhom_thiet_ke: specs.tieu_de_nhom_thiet_ke || '6. Thiết Kế Khung Vỏ, Bàn Phím & Cổng Giao Tiếp',
            tieu_de_nhom_linh_kien_hieu_nang: specs.tieu_de_nhom_linh_kien_hieu_nang || '1. Hiệu Năng & Tốc Độ Truyền Tải',
            tieu_de_nhom_linh_kien_chuan: specs.tieu_de_nhom_linh_kien_chuan || '2. Chuẩn Giao Tiếp & Độ Bền',
            tieu_de_nhom_balo_ngan_chua: specs.tieu_de_nhom_balo_ngan_chua || '1. Ngăn Chứa & Kích Thước Máy',
            tieu_de_nhom_balo_chat_lieu: specs.tieu_de_nhom_balo_chat_lieu || '2. Chất Liệu & Khả Năng Kháng Nước',
            tieu_de_nhom_balo_tien_ich: specs.tieu_de_nhom_balo_tien_ich || '3. Tiện Ích, Tính Năng & Bảo Hành',
            tieu_de_nhom_phim_switch: specs.tieu_de_nhom_phim_switch || '1. Switch & Cảm Giác Gõ Phím',
            tieu_de_nhom_phim_layout: specs.tieu_de_nhom_phim_layout || '2. Layout, Keycap & Khung Vỏ',
            tieu_de_nhom_phim_ket_noi: specs.tieu_de_nhom_phim_ket_noi || '3. Kết Nối, Đèn LED & Pin',
            tieu_de_nhom_chuot_cam_bien: specs.tieu_de_nhom_chuot_cam_bien || '1. Cảm Biến, DPI & Độ Chính Xác',
            tieu_de_nhom_chuot_ket_noi: specs.tieu_de_nhom_chuot_ket_noi || '2. Kết Nối, Kích Thước & Thời Lượng Pin',
            tieu_de_nhom_tai_nghe_am_thanh: specs.tieu_de_nhom_tai_nghe_am_thanh || '1. Màng Loa, Âm Thanh & Chống Ồn ANC',
            tieu_de_nhom_tai_nghe_ket_noi: specs.tieu_de_nhom_tai_nghe_ket_noi || '2. Kết Nối, Micro & Thời Lượng Pin',
            tieu_de_nhom_tai_nghe_thiet_ke: specs.tieu_de_nhom_tai_nghe_thiet_ke || '3. Thiết Kế, Đệm Tai & Kháng Nước',
            tieu_de_nhom_sac_cong_suat: specs.tieu_de_nhom_sac_cong_suat || '1. Công Suất & Công Nghệ Sạc Nhanh GaN',
            tieu_de_nhom_sac_cong_ket_noi: specs.tieu_de_nhom_sac_cong_ket_noi || '2. Cổng Kết Nối & Băng Thông Truyền Tải',
            tieu_de_nhom_sac_thiet_ke: specs.tieu_de_nhom_sac_thiet_ke || '3. Thiết Kế, Dây Cáp & Độ Bền',

            // 1. Cấu hình chi tiết Laptop
            cpu: specs.cpu || '',
            so_nhan_luong: specs.so_nhan_luong || '',
            xung_nhip_toi_da: specs.xung_nhip_toi_da || '',
            bo_nho_dem_cache: specs.bo_nho_dem_cache || '',
            chip_ai_npu: specs.chip_ai_npu || '',
            hieu_nang_ai_tops: specs.hieu_nang_ai_tops !== undefined ? String(specs.hieu_nang_ai_tops) : '',
            card_do_hoa: specs.card_do_hoa || '',
            dung_luong_vram: specs.dung_luong_vram || '',
            cong_suat_tgp: specs.cong_suat_tgp !== undefined ? String(specs.cong_suat_tgp) : '',
            ho_tro_ray_tracing: specs.ho_tro_ray_tracing !== undefined ? Boolean(specs.ho_tro_ray_tracing) : true,
            ram: specs.ram || '',
            loai_ram: specs.loai_ram || '',
            toc_do_bus: specs.toc_do_bus !== undefined ? String(specs.toc_do_bus) : '',
            nang_cap_ram_toi_da: specs.nang_cap_ram_toi_da || '',
            o_cung: specs.o_cung || '',
            khe_cam_mo_rong: specs.khe_cam_mo_rong || '',
            man_hinh: specs.man_hinh || '',
            do_phan_giai: specs.do_phan_giai || '',
            tan_so_quet: specs.tan_so_quet !== undefined ? String(specs.tan_so_quet) : '',
            tam_nen: specs.tam_nen || '',
            do_phu_mau: specs.do_phu_mau || '',
            do_sang_nits: specs.do_sang_nits !== undefined ? String(specs.do_sang_nits) : '',
            cong_nghe_man_hinh: dinhDangChuoiHoacMang(specs.cong_nghe_man_hinh),
            pin: specs.dung_luong_pin || specs.pin || '90Wh',
            dung_luong_pin: specs.dung_luong_pin || specs.pin || '90Wh',
            thoi_luong_su_dung_uoc_tinh: specs.thoi_luong_su_dung_uoc_tinh || '',
            cong_suat_sac: specs.cong_suat_sac || specs.bo_sac_cong_suat || '',
            he_thong_tan_nhiet: specs.he_thong_tan_nhiet || specs.chi_tiet_tan_nhiet || '',
            chi_tiet_tan_nhiet: specs.chi_tiet_tan_nhiet || specs.he_thong_tan_nhiet || '',
            trong_luong: typeof specs.trong_luong === 'number' ? `${specs.trong_luong} kg` : (specs.trong_luong || ''),
            kich_thuoc: specs.kich_thuoc || '',
            chat_lieu_vo: specs.chat_lieu_vo || '',
            cong_ket_noi: dinhDangChuoiHoacMang(specs.cong_ket_noi),
            chuan_wifi_bluetooth: specs.chuan_wifi_bluetooth || '',
            ban_phim: specs.ban_phim || '',
            am_thanh: specs.am_thanh || '',
            he_dieu_hanh: specs.he_dieu_hanh || '',

            // 2. Bàn phím cơ
            loai_switch: specs.switch || specs.switch_cam_bien || specs.loai_switch || '',
            tinh_nang_dac_biet: specs.tinh_nang_dac_biet || '',
            cau_truc_mount: specs.cau_truc_mount || '',
            layout_ban_phim: specs.layout || specs.layout_ban_phim || '75% Gasket Mount',
            keycap_chat_lieu: specs.keycap || specs.keycap_chat_lieu || 'PBT Double-shot',
            chat_lieu_case: specs.chat_lieu_case || '',
            kieu_ket_noi_gear: specs.kieu_ket_noi || specs.ket_noi || 'Type-C, Wireless 2.4GHz, Bluetooth 5.1',
            led_rgb_gear: specs.led_rgb || specs.den_led || 'RGB South-facing 16.8 triệu màu',
            dung_luong_pin_gear: specs.dung_luong_pin || specs.thoi_luong_pin || '4000 mAh (300 giờ)',
            hot_swap: specs.hot_swap || 'Hot-swap 3-pin / 5-pin mạch xuôi',
            tuong_thich_gear: specs.tuong_thich || '',
            trong_luong_gear: typeof specs.trong_luong === 'number' ? `${specs.trong_luong} kg` : (specs.trong_luong || ''),

            // 3. Chuột & Lót chuột
            cam_bien_chuot: specs.cam_bien || specs.cam_bien_quang_hoc || specs.mat_doc_cam_bien || 'PixArt PAW3395 đỉnh cao',
            do_phan_giai_dpi: specs.do_phan_giai_dpi || '26.000 DPI (6 nấc)',
            toc_do_ips_gia_toc: specs.toc_do_ips_gia_toc || '',
            switch_chuot: specs.switch_chuot || 'Optical Huano 100 triệu lượt nhấn',
            polling_rate: specs.polling_rate || '',
            loai_lot_chuot: specs.loai_lot_chuot || '',
            chat_lieu_be_mat: specs.chat_lieu_be_mat || '',
            chat_lieu_de: specs.chat_lieu_de || '',
            kieu_ket_noi_chuot: specs.kieu_ket_noi || specs.ket_noi || 'Wireless 2.4GHz + Bluetooth + Type-C',
            che_do_led: specs.che_do_led || '',
            thoi_luong_pin_chuot: specs.thoi_luong_pin || specs.dung_luong_pin || 'Lên tới 200 giờ',
            chat_lieu_feet: specs.chat_lieu_feet || '',
            kich_thuoc_chuot: specs.kich_thuoc || '',
            trong_luong_chuot: typeof specs.trong_luong === 'number' ? `${specs.trong_luong}g` : (specs.trong_luong || '49g siêu nhẹ'),

            // 4. Balo & Túi chống sốc
            kich_co_laptop_phu_hop: specs.kich_co_laptop_phu_hop || specs.ngan_chua_laptop || 'Phù hợp laptop 15.6 - 18 inch',
            dung_tich_balo: specs.dung_tich || '36 Lít',
            so_ngan_chua: specs.so_ngan_chua || '1 ngăn chính chống sốc + 6 ngăn phụ',
            kich_thuoc_balo: specs.kich_thuoc || '510 x 340 x 200 mm',
            trong_luong_tui: typeof specs.trong_luong === 'number' ? `${specs.trong_luong} kg` : (specs.trong_luong || '1.4 kg'),
            chat_lieu_chinh: specs.chat_lieu_chinh || specs.chat_lieu_vai || specs.chat_lieu || 'Polyester 1680D kháng nước',
            lop_lot_bao_ve: specs.lop_lot_bao_ve || '',
            khoa_keo: specs.khoa_keo || '',
            kha_nang_khang_nuoc: specs.kha_nang_khang_nuoc || specs.khang_nuoc || 'Trượt nước IPX4 kèm áo mưa trùm',
            dem_lung_thoang_khi: specs.dem_lung_thoang_khi || 'Đệm lưng 3D EVA thoáng khí công thái học',
            cong_tinh_nang: dinhDangChuoiHoacMang(specs.cong_tinh_nang),

            // 5. Tai nghe & Loa
            mang_loa_driver: specs.mang_loa_driver || 'Graphene 50mm Hi-Res Audio',
            cong_nghe_am_thanh: specs.cong_nghe_am_thanh || '',
            tan_so_dap_ung: specs.tan_so_dap_ung || specs.dai_tan_so || '20Hz - 40.000Hz',
            tro_khang_do_nhay: specs.tro_khang_do_nhay || '',
            chong_on_anc: specs.chong_on_anc || '',
            micro_dam_thoai: specs.micro || 'Micro lọc ồn công nghệ AI rời',
            kieu_ket_noi_tai_nghe: specs.chuan_ket_noi || specs.kieu_ket_noi || specs.ket_noi || 'Lightspeed 2.4GHz + Bluetooth + 3.5mm',
            thoi_luong_pin_tai_nghe: specs.thoi_luong_pin || specs.dung_luong_pin || 'Lên tới 50 giờ chơi liên tục',
            khang_nuoc_tai_nghe: specs.khang_nuoc || '',
            dem_tai: specs.dem_tai || '',
            bo_dieu_khien: specs.bo_dieu_khien || '',
            kich_thuoc_tai_nghe: specs.kich_thuoc || '',
            trong_luong_tai_nghe: typeof specs.trong_luong === 'number' ? `${specs.trong_luong}g` : (specs.trong_luong || ''),

            // 6. Củ sạc & Hub chuyển đổi
            cong_suat_tong: specs.cong_suat_tong || specs.cong_suat_toi_da || '140W GaN Prime',
            cong_nghe_sac: specs.cong_nghe_sac || 'PD 3.1, QC 4.0+, PPS, GaN III',
            giao_thuc_ho_tro: specs.giao_thuc_ho_tro || '',
            dung_luong_pin_sac: specs.dung_luong_pin || '',
            man_hinh_hien_thi: specs.man_hinh_hien_thi || '',
            tinh_nang_an_toan: specs.tinh_nang_an_toan || '',
            so_cong_sac: dinhDangChuoiHoacMang(specs.so_cong_sac || specs.so_cong_dau_ra || specs.so_cong_ket_noi) || '2 x Type-C (140W max), 1 x USB-A',
            bang_thong_truyen_du_lieu: specs.bang_thong_truyen_du_lieu || '',
            cong_suat_sac_pass_through: specs.cong_suat_sac_pass_through || '',
            xuat_hinh_anh: specs.xuat_hinh_anh || '',
            chieu_dai_cap: specs.chieu_dai_cap || '',
            chat_lieu_vo_sac: specs.chat_lieu_vo || '',
            tuong_thich_sac: specs.tuong_thich || 'Laptop Gaming, MacBook, iPad, Điện thoại',
            kich_thuoc_trong_luong_sac: specs.kich_thuoc_trong_luong || '215g - Nhỏ gọn tiện du lịch',
            kich_thuoc_sac: specs.kich_thuoc || '',
            trong_luong_sac: typeof specs.trong_luong === 'number' ? `${specs.trong_luong}g` : (specs.trong_luong || ''),

            // 7. Linh kiện & Tản nhiệt
            loai_linh_kien: specs.loai_linh_kien || '',
            dung_luong_linh_kien: specs.dung_luong || specs.dung_luong_bo_nho || '2TB / 32GB',
            toc_do_doc_ghi: specs.toc_do_doc_ghi || specs.toc_do || specs.toc_do_doc_ghi_bus || 'Đọc 7.450 MB/s - Ghi 6.900 MB/s',
            toc_do_bus_linh_kien: specs.toc_do_bus || '',
            do_tre_cl: specs.do_tre_cl || '',
            so_nhan_luong_linh_kien: specs.so_nhan_luong || '',
            xung_nhip_toi_da_linh_kien: specs.xung_nhip_toi_da || '',
            bo_nho_dem_cache_linh_kien: specs.bo_nho_dem_cache || '',
            cong_suat_tdp: specs.cong_suat_tdp || '',
            ho_tro_ram: specs.ho_tro_ram || '',
            toc_do_quat: specs.toc_do_quat || '',
            hieu_qua_giam_nhiet: specs.hieu_qua_giam_nhiet || '',
            do_dan_nhiet: specs.do_dan_nhiet || '',
            chuan_giao_tiep: specs.chuan_giao_tiep || specs.chuan_ket_noi || 'PCIe Gen 4.0 x4 M.2 NVMe',
            do_ben_tbw: specs.do_ben_tbw || specs.do_ben_chong_chiu || '',
            tinh_nang_dac_biet_linh_kien: specs.tinh_nang_dac_biet || '',
            he_thong_tan_nhiet: specs.he_thong_tan_nhiet || 'Heatsink Nhôm Hàng Không',
            tuong_thich_linh_kien: specs.tuong_thich || 'Laptop Gaming, PC Desktop, PS5',
            kich_co_laptop_linh_kien: specs.kich_co_laptop_phu_hop || '',
            trong_luong_linh_kien: typeof specs.trong_luong === 'number' ? `${specs.trong_luong}g` : (specs.trong_luong || ''),

            che_do_bao_hanh: specs.che_do_bao_hanh || '24 tháng chính hãng',
            thoi_han_bao_hanh_thang: specs.thoi_han_bao_hanh_thang || Number(String(specs.che_do_bao_hanh || '').match(/(\d+)\s*tháng/i)?.[1]) || 24
        };
        setFormSp(formSuaMoi);
        setFormSpGoc(JSON.parse(JSON.stringify(formSuaMoi)));
        setDangMoModalSp(true);
    };

    // ==========================================
    // HÀM CHUNG: Xây object thông số kỹ thuật (thong_so) theo từng loại sản phẩm (7 nhóm)
    // Dùng CHUNG cho cả "Xem trước sản phẩm" (sanPhamXemTruoc) và "Lưu sản phẩm" (xuLyLuuSanPham)
    // để tránh lặp code gần giống nhau 2 lần.
    // - chuanHoa = false (mặc định, dùng cho Xem trước): giữ nguyên giá trị thô từ formSp, không ép kiểu,
    //   không tách chuỗi thành mảng -> đúng hành vi xem trước tạm thời trước đây.
    // - chuanHoa = true (dùng khi Lưu): có fallback rỗng '', ép kiểu Number/Boolean cho các trường số/cờ,
    //   và tách chuỗi (phân tách bởi dấu phẩy / • / xuống dòng) thành mảng cho các trường danh sách
    //   -> đúng hành vi chuẩn hóa dữ liệu trước khi gửi lên MongoDB trước đây.
    // ==========================================
    const xayThongSoTheoLoai = (formSp, loaiFormSanPham, { chuanHoa = false } = {}) => {
        const tachChuoiThanhMang = (val) => {
            if (Array.isArray(val)) return val;
            if (!val || typeof val !== 'string') return [];
            return val.split(/[,•\n]/).map(s => s.trim()).filter(Boolean);
        };
        const layChuoi = (val) => (chuanHoa ? (val || '') : val);
        const laySo = (val) => {
            if (!chuanHoa) return val;
            if (!val) return '';
            return isNaN(Number(val)) ? val : Number(val);
        };
        const layMang = (val) => (chuanHoa ? tachChuoiThanhMang(val) : val);
        const layBool = (val) => (chuanHoa ? Boolean(val) : val);
        const macDinhBaoHanh = chuanHoa ? (formSp.che_do_bao_hanh || '24 tháng chính hãng') : formSp.che_do_bao_hanh;

        if (loaiFormSanPham === 'laptop') {
            return {
                cpu: layChuoi(formSp.cpu),
                so_nhan_luong: layChuoi(formSp.so_nhan_luong),
                xung_nhip_toi_da: layChuoi(formSp.xung_nhip_toi_da),
                bo_nho_dem_cache: layChuoi(formSp.bo_nho_dem_cache),
                chip_ai_npu: layChuoi(formSp.chip_ai_npu),
                hieu_nang_ai_tops: laySo(formSp.hieu_nang_ai_tops),
                card_do_hoa: layChuoi(formSp.card_do_hoa),
                dung_luong_vram: layChuoi(formSp.dung_luong_vram),
                cong_suat_tgp: laySo(formSp.cong_suat_tgp),
                ho_tro_ray_tracing: layBool(formSp.ho_tro_ray_tracing),
                ram: layChuoi(formSp.ram),
                loai_ram: layChuoi(formSp.loai_ram),
                toc_do_bus: laySo(formSp.toc_do_bus),
                nang_cap_ram_toi_da: layChuoi(formSp.nang_cap_ram_toi_da),
                o_cung: layChuoi(formSp.o_cung),
                khe_cam_mo_rong: layChuoi(formSp.khe_cam_mo_rong),
                man_hinh: layChuoi(formSp.man_hinh),
                do_phan_giai: layChuoi(formSp.do_phan_giai),
                tan_so_quet: laySo(formSp.tan_so_quet),
                tam_nen: layChuoi(formSp.tam_nen),
                do_phu_mau: layChuoi(formSp.do_phu_mau),
                do_sang_nits: laySo(formSp.do_sang_nits),
                cong_nghe_man_hinh: layMang(formSp.cong_nghe_man_hinh),
                pin: layChuoi(formSp.pin),
                dung_luong_pin: layChuoi(formSp.pin),
                thoi_luong_su_dung_uoc_tinh: layChuoi(formSp.thoi_luong_su_dung_uoc_tinh),
                cong_suat_sac: layChuoi(formSp.cong_suat_sac),
                he_thong_tan_nhiet: layChuoi(formSp.he_thong_tan_nhiet),
                chi_tiet_tan_nhiet: layChuoi(formSp.chi_tiet_tan_nhiet || formSp.he_thong_tan_nhiet),
                trong_luong: layChuoi(formSp.trong_luong),
                kich_thuoc: layChuoi(formSp.kich_thuoc),
                chat_lieu_vo: layChuoi(formSp.chat_lieu_vo),
                cong_ket_noi: layMang(formSp.cong_ket_noi),
                chuan_wifi_bluetooth: layChuoi(formSp.chuan_wifi_bluetooth),
                ban_phim: layChuoi(formSp.ban_phim),
                am_thanh: layChuoi(formSp.am_thanh),
                he_dieu_hanh: layChuoi(formSp.he_dieu_hanh),
                che_do_bao_hanh: macDinhBaoHanh
            };
        } else if (loaiFormSanPham === 'ban_phim') {
            return {
                switch: layChuoi(formSp.loai_switch),
                loai_switch: layChuoi(formSp.loai_switch),
                tinh_nang_dac_biet: layChuoi(formSp.tinh_nang_dac_biet),
                cau_truc_mount: layChuoi(formSp.cau_truc_mount),
                layout: layChuoi(formSp.layout_ban_phim),
                layout_ban_phim: layChuoi(formSp.layout_ban_phim),
                keycap: layChuoi(formSp.keycap_chat_lieu),
                keycap_chat_lieu: layChuoi(formSp.keycap_chat_lieu),
                chat_lieu_case: layChuoi(formSp.chat_lieu_case),
                kieu_ket_noi: layChuoi(formSp.kieu_ket_noi_gear),
                ket_noi: layChuoi(formSp.kieu_ket_noi_gear),
                led_rgb: layChuoi(formSp.led_rgb_gear),
                den_led: layChuoi(formSp.led_rgb_gear),
                dung_luong_pin: layChuoi(formSp.dung_luong_pin_gear),
                hot_swap: layChuoi(formSp.hot_swap),
                tuong_thich: layChuoi(formSp.tuong_thich_gear),
                trong_luong: layChuoi(formSp.trong_luong_gear),
                che_do_bao_hanh: macDinhBaoHanh
            };
        } else if (loaiFormSanPham === 'chuot') {
            return {
                cam_bien: layChuoi(formSp.cam_bien_chuot),
                mat_doc_cam_bien: layChuoi(formSp.cam_bien_chuot),
                do_phan_giai_dpi: layChuoi(formSp.do_phan_giai_dpi),
                toc_do_ips_gia_toc: layChuoi(formSp.toc_do_ips_gia_toc),
                switch_chuot: layChuoi(formSp.switch_chuot),
                polling_rate: layChuoi(formSp.polling_rate),
                loai_lot_chuot: layChuoi(formSp.loai_lot_chuot),
                chat_lieu_be_mat: layChuoi(formSp.chat_lieu_be_mat),
                chat_lieu_de: layChuoi(formSp.chat_lieu_de),
                trong_luong: layChuoi(formSp.trong_luong_chuot),
                kieu_ket_noi: layChuoi(formSp.kieu_ket_noi_chuot),
                ket_noi: layChuoi(formSp.kieu_ket_noi_chuot),
                che_do_led: layChuoi(formSp.che_do_led),
                thoi_luong_pin: layChuoi(formSp.thoi_luong_pin_chuot),
                dung_luong_pin: layChuoi(formSp.thoi_luong_pin_chuot),
                chat_lieu_feet: layChuoi(formSp.chat_lieu_feet),
                kich_thuoc: layChuoi(formSp.kich_thuoc_chuot),
                che_do_bao_hanh: macDinhBaoHanh
            };
        } else if (loaiFormSanPham === 'balo') {
            return {
                kich_co_laptop_phu_hop: layChuoi(formSp.kich_co_laptop_phu_hop),
                dung_tich: layChuoi(formSp.dung_tich_balo),
                so_ngan_chua: layChuoi(formSp.so_ngan_chua),
                kich_thuoc: layChuoi(formSp.kich_thuoc_balo),
                trong_luong: layChuoi(formSp.trong_luong_tui),
                chat_lieu_chinh: layChuoi(formSp.chat_lieu_chinh),
                chat_lieu_vai: layChuoi(formSp.chat_lieu_chinh),
                lop_lot_bao_ve: layChuoi(formSp.lop_lot_bao_ve),
                khoa_keo: layChuoi(formSp.khoa_keo),
                khang_nuoc: layChuoi(formSp.kha_nang_khang_nuoc),
                kha_nang_khang_nuoc: layChuoi(formSp.kha_nang_khang_nuoc),
                dem_lung_thoang_khi: layChuoi(formSp.dem_lung_thoang_khi),
                cong_tinh_nang: layMang(formSp.cong_tinh_nang),
                che_do_bao_hanh: macDinhBaoHanh
            };
        } else if (loaiFormSanPham === 'tai_nghe') {
            return {
                mang_loa_driver: layChuoi(formSp.mang_loa_driver),
                cong_nghe_am_thanh: layChuoi(formSp.cong_nghe_am_thanh),
                tan_so_dap_ung: layChuoi(formSp.tan_so_dap_ung),
                dai_tan_so: layChuoi(formSp.tan_so_dap_ung),
                tro_khang_do_nhay: layChuoi(formSp.tro_khang_do_nhay),
                chong_on_anc: layChuoi(formSp.chong_on_anc),
                chuan_ket_noi: layChuoi(formSp.kieu_ket_noi_tai_nghe),
                kieu_ket_noi: layChuoi(formSp.kieu_ket_noi_tai_nghe),
                ket_noi: layChuoi(formSp.kieu_ket_noi_tai_nghe),
                thoi_luong_pin: layChuoi(formSp.thoi_luong_pin_tai_nghe),
                dung_luong_pin: layChuoi(formSp.thoi_luong_pin_tai_nghe),
                khang_nuoc: layChuoi(formSp.khang_nuoc_tai_nghe),
                dem_tai: layChuoi(formSp.dem_tai),
                bo_dieu_khien: layChuoi(formSp.bo_dieu_khien),
                kich_thuoc: layChuoi(formSp.kich_thuoc_tai_nghe),
                trong_luong: layChuoi(formSp.trong_luong_tai_nghe),
                micro: layChuoi(formSp.micro_dam_thoai),
                che_do_bao_hanh: macDinhBaoHanh
            };
        } else if (loaiFormSanPham === 'sac_hub') {
            return {
                cong_suat_tong: layChuoi(formSp.cong_suat_tong),
                cong_suat_toi_da: layChuoi(formSp.cong_suat_tong),
                cong_nghe_sac: layChuoi(formSp.cong_nghe_sac),
                giao_thuc_ho_tro: layChuoi(formSp.giao_thuc_ho_tro),
                dung_luong_pin: layChuoi(formSp.dung_luong_pin_sac),
                man_hinh_hien_thi: layChuoi(formSp.man_hinh_hien_thi),
                tinh_nang_an_toan: layChuoi(formSp.tinh_nang_an_toan),
                so_cong_sac: layChuoi(formSp.so_cong_sac),
                so_cong_dau_ra: layMang(formSp.so_cong_sac),
                bang_thong_truyen_du_lieu: layChuoi(formSp.bang_thong_truyen_du_lieu),
                cong_suat_sac_pass_through: layChuoi(formSp.cong_suat_sac_pass_through),
                xuat_hinh_anh: layChuoi(formSp.xuat_hinh_anh),
                chieu_dai_cap: layChuoi(formSp.chieu_dai_cap),
                chat_lieu_vo: layChuoi(formSp.chat_lieu_vo_sac),
                tuong_thich: layChuoi(formSp.tuong_thich_sac),
                kich_thuoc_trong_luong: layChuoi(formSp.kich_thuoc_trong_luong_sac),
                kich_thuoc: layChuoi(formSp.kich_thuoc_sac),
                trong_luong: layChuoi(formSp.trong_luong_sac),
                che_do_bao_hanh: macDinhBaoHanh
            };
        }

        // linh_kien (mặc định / else)
        return {
            loai_linh_kien: layChuoi(formSp.loai_linh_kien),
            chuan_giao_tiep: layChuoi(formSp.chuan_giao_tiep),
            dung_luong: layChuoi(formSp.dung_luong_linh_kien),
            toc_do: layChuoi(formSp.toc_do_doc_ghi),
            toc_do_doc_ghi: layChuoi(formSp.toc_do_doc_ghi),
            toc_do_bus: layChuoi(formSp.toc_do_bus_linh_kien),
            do_tre_cl: layChuoi(formSp.do_tre_cl),
            so_nhan_luong: layChuoi(formSp.so_nhan_luong_linh_kien),
            xung_nhip_toi_da: layChuoi(formSp.xung_nhip_toi_da_linh_kien),
            bo_nho_dem_cache: layChuoi(formSp.bo_nho_dem_cache_linh_kien),
            cong_suat_tdp: layChuoi(formSp.cong_suat_tdp),
            ho_tro_ram: layChuoi(formSp.ho_tro_ram),
            toc_do_quat: layChuoi(formSp.toc_do_quat),
            hieu_qua_giam_nhiet: layChuoi(formSp.hieu_qua_giam_nhiet),
            do_dan_nhiet: layChuoi(formSp.do_dan_nhiet),
            do_ben_tbw: layChuoi(formSp.do_ben_tbw),
            tinh_nang_dac_biet: layChuoi(formSp.tinh_nang_dac_biet_linh_kien),
            he_thong_tan_nhiet: layChuoi(formSp.he_thong_tan_nhiet),
            tuong_thich: layChuoi(formSp.tuong_thich_linh_kien),
            kich_co_laptop_phu_hop: layChuoi(formSp.kich_co_laptop_linh_kien),
            trong_luong: layChuoi(formSp.trong_luong_linh_kien),
            che_do_bao_hanh: macDinhBaoHanh
        };
    };

    // Chuẩn bị dữ liệu hiển thị card sản phẩm xem trước tức thì
    const sanPhamXemTruoc = useMemo(() => {
        const thongSoGoc = (spDangSua && spDangSua.thong_so && typeof spDangSua.thong_so === 'object')
            ? { ...spDangSua.thong_so }
            : {};
        let thongSoForm = { ...thongSoGoc };

        thongSoForm = {
            ...thongSoForm,
            ...xayThongSoTheoLoai(formSp, loaiFormSanPham, { chuanHoa: false })
        };

        Object.keys(formSp).forEach(k => {
            if (k.startsWith('tieu_de_nhom_') && formSp[k]) {
                thongSoForm[k] = formSp[k];
            }
        });

        if (Array.isArray(thongSoTuyChinh)) {
            thongSoTuyChinh.forEach(item => {
                if (item.key?.trim() && item.value?.trim()) {
                    const slugKey = chuyenKeySangSlug(item.key);
                    thongSoForm[slugKey] = item.value.trim();
                }
            });
        }

        return {
            _id: spDangSua?._id || 'xem_truoc_card',
            id: spDangSua?._id || 'xem_truoc_card',
            ma_san_pham: formSp.ma_san_pham || '',
            ten_san_pham: formSp.ten_san_pham || '',
            hang_san_xuat: formSp.hang_san_xuat || '',
            danh_muc: Array.isArray(formSp.danh_muc) ? formSp.danh_muc : [],
            gia_goc: Number(formSp.gia_goc) || 0,
            gia_khuyen_mai: Number(formSp.gia_khuyen_mai) || 0,
            phan_tram_giam_gia: Number(formSp.phan_tram_giam_gia) || 0,
            hinh_anh_chinh: formSp.hinh_anh_chinh || '',
            hinh_anh_phu: formSp.thu_vien_hinh_anh || [],
            thu_vien_hinh_anh: formSp.thu_vien_hinh_anh && formSp.thu_vien_hinh_anh.length > 0
                ? formSp.thu_vien_hinh_anh
                : (spDangSua?.thu_vien_hinh_anh && spDangSua.thu_vien_hinh_anh.length > 0
                    ? spDangSua.thu_vien_hinh_anh
                    : (formSp.hinh_anh_chinh ? [formSp.hinh_anh_chinh] : [])),
            video_demo: formSp.video_demo || spDangSua?.video_demo || '',
            dac_diem_noi_bat: Array.isArray(formSp.dac_diem_noi_bat) && formSp.dac_diem_noi_bat.length > 0
                ? formSp.dac_diem_noi_bat
                : (Array.isArray(spDangSua?.dac_diem_noi_bat) ? spDangSua.dac_diem_noi_bat : []),
            qua_tang: Array.isArray(formSp.qua_tang) && formSp.qua_tang.length > 0
                ? formSp.qua_tang
                : (Array.isArray(spDangSua?.qua_tang) ? spDangSua.qua_tang : []),
            ton_kho: Array.isArray(spDangSua?.ton_kho) && spDangSua.ton_kho.length > 0
                ? spDangSua.ton_kho
                : [],
            so_luong_ton_kho: Number(formSp.so_luong_ton_kho) || 0,
            con_hang: formSp.con_hang !== false,
            la_flash_sale: !!formSp.la_flash_sale,
            so_luong_flash_sale: Number(formSp.so_luong_flash_sale) || 0,
            da_ban_flash_sale: Number(formSp.da_ban_flash_sale) || 0,
            tuy_chon_phien_ban: formSp.tuy_chon_phien_ban && formSp.tuy_chon_phien_ban.length > 0
                ? formSp.tuy_chon_phien_ban
                : (spDangSua?.tuy_chon_phien_ban || []),
            thong_so: thongSoForm,
            mo_ta_chi_tiet: formSp.mo_ta_chi_tiet || spDangSua?.mo_ta_chi_tiet || '',
            rating: spDangSua?.rating ?? spDangSua?.diem_danh_gia_tb ?? 0,
            diem_danh_gia_tb: spDangSua?.diem_danh_gia_tb ?? spDangSua?.rating ?? 0,
            so_danh_gia: spDangSua?.so_danh_gia ?? spDangSua?.so_luong_danh_gia ?? 0,
            so_luong_danh_gia: spDangSua?.so_luong_danh_gia ?? spDangSua?.so_danh_gia ?? 0,
            so_luong_da_ban: spDangSua?.so_luong_da_ban ?? 0,
            danh_gia: Array.isArray(spDangSua?.danh_gia) ? spDangSua.danh_gia : []
        };
    }, [spDangSua, formSp, loaiFormSanPham, thongSoTuyChinh]);

    // Dữ liệu hỗ trợ xem trước trang chi tiết sản phẩm 1:1 chuẩn trang bán lẻ
    const dacDiemNoiBatXemTruoc = useMemo(() => {
        if (Array.isArray(sanPhamXemTruoc.dac_diem_noi_bat) && sanPhamXemTruoc.dac_diem_noi_bat.length > 0) {
            return sanPhamXemTruoc.dac_diem_noi_bat;
        }
        const ts = sanPhamXemTruoc.thong_so || {};
        const ds = [];
        if (ts.cpu && ts.card_do_hoa) ds.push(`Bộ đôi tối thượng ${ts.cpu} và ${ts.card_do_hoa}`);
        else if (ts.cpu) ds.push(`Vi xử lý mạnh mẽ ${ts.cpu}`);
        else if (ts.card_do_hoa) ds.push(`Card đồ họa thế hệ mới ${ts.card_do_hoa}`);
        if (ts.ram && ts.o_cung) ds.push(`Bộ nhớ ${ts.ram} tốc độ cao, lưu trữ ${ts.o_cung} chuẩn NVMe tốc độ vượt trội`);
        else if (ts.ram) ds.push(`Bộ nhớ RAM ${ts.ram} đa nhiệm mượt mà`);
        if (ts.man_hinh) ds.push(`Màn hình sắc nét đỉnh cao: ${ts.man_hinh}`);
        if (ts.switch || ts.loai_switch) ds.push(`Trang bị switch cơ học ${ts.switch || ts.loai_switch} siêu bền`);
        if (ts.cam_bien) ds.push(`Cảm biến quang học cao cấp ${ts.cam_bien}`);
        if (ts.dung_luong_pin || ts.pin) ds.push(`Thời lượng pin ấn tượng: ${ts.dung_luong_pin || ts.pin}`);
        if (ts.che_do_bao_hanh) ds.push(`Chế độ bảo hành: ${ts.che_do_bao_hanh}`);
        return ds.slice(0, 5);
    }, [sanPhamXemTruoc]);

    // Tìm phiên bản sản phẩm đang được chọn.
    const tuyChonHienTaiXemTruoc = useMemo(() => {
        if (tuyChonXemTruoc) return tuyChonXemTruoc;
        if (sanPhamXemTruoc.tuy_chon_phien_ban && sanPhamXemTruoc.tuy_chon_phien_ban.length > 0) {
            return sanPhamXemTruoc.tuy_chon_phien_ban[0];
        }
        return null;
    }, [tuyChonXemTruoc, sanPhamXemTruoc]);

    // Tính giá bán gồm giá sản phẩm và phần chênh lệch của phiên bản.
    const giaHienTaiXemTruoc = (sanPhamXemTruoc.gia_khuyen_mai || sanPhamXemTruoc.gia_goc || 0) + (tuyChonHienTaiXemTruoc ? Number(tuyChonHienTaiXemTruoc.chenh_lech_gia || 0) : 0);
    // Tính giá gốc gồm giá sản phẩm và phần chênh lệch của phiên bản.
    const giaGocHienTaiXemTruoc = (sanPhamXemTruoc.gia_goc || sanPhamXemTruoc.gia_khuyen_mai || 0) + (tuyChonHienTaiXemTruoc ? Number(tuyChonHienTaiXemTruoc.chenh_lech_gia || 0) : 0);
    // Tính số tiền khách tiết kiệm được theo giá xem trước.
    const tienTietKiemXemTruoc = giaGocHienTaiXemTruoc > giaHienTaiXemTruoc ? (giaGocHienTaiXemTruoc - giaHienTaiXemTruoc) : 0;

    // Kiểm tra dữ liệu form rồi gọi API thêm hoặc cập nhật sản phẩm.
    const xuLyLuuSanPham = async (e) => {
        e.preventDefault();
        // Kiểm tra hợp lệ giá bán (không được để trống, 0đ, hoặc < 1.000 đ)
        const giaBanSo = Number(formSp.gia_khuyen_mai);
        if (formSp.gia_khuyen_mai === undefined || formSp.gia_khuyen_mai === null || formSp.gia_khuyen_mai === '' || isNaN(giaBanSo) || giaBanSo < 1000) {
            canhBao({
                tieuDe: 'Giá Bán Không Hợp Lệ',
                noiDung: 'Giá khuyến mãi (giá bán thực tế) không được để trống hoặc bằng 0 đ, và phải từ 1.000 đ trở lên để đáp ứng quy định thanh toán!',
                loai: 'danger'
            });
            return;
        }

        const giaGocSo = Number(formSp.gia_goc);
        if (giaGocSo > 0 && giaGocSo < giaBanSo) {
            canhBao({
                tieuDe: 'Giá Niêm Yết Không Hợp Lệ',
                noiDung: `Giá niêm yết gốc (${giaGocSo.toLocaleString('vi-VN')} đ) phải lớn hơn hoặc bằng giá khuyến mãi (${giaBanSo.toLocaleString('vi-VN')} đ). Hãy để 0 nếu không có giá niêm yết cũ!`,
                loai: 'danger'
            });
            return;
        }

        // Các ô bắt buộc: báo đúng ô còn thiếu để admin biết cần điền gì
        const oBatBuocThieu = [
            [formSp.ten_san_pham, 'Tên sản phẩm'],
            [formSp.ma_san_pham, 'Mã SKU'],
            [formSp.hang_san_xuat, 'Hãng sản xuất']
        ].find(([giaTri]) => !String(giaTri || '').trim());
        if (oBatBuocThieu) {
            canhBao({ tieuDe: 'Thiếu Thông Tin Bắt Buộc', noiDung: `Vui lòng nhập: ${oBatBuocThieu[1]}.`, loai: 'danger' });
            return;
        }

        const maNhuCauDangHoatDong = danhSachDanhMuc
            .filter((dm) => dm.loai === 'nhu_cau' && dm.kich_hoat !== false)
            .map((dm) => dm.ma_danh_muc);
        const nhuCauHopLe = new Set(maNhuCauDangHoatDong.length
            ? maNhuCauDangHoatDong
            : ['gaming', 'ai-pc', 'van-phong-mong-nhe', 'do-hoa-sang-tao', 'doanh-nhan', 'sinh-vien']);
        if (loaiFormSanPham === 'laptop' && !(Array.isArray(formSp.danh_muc) && formSp.danh_muc.some((ma) => nhuCauHopLe.has(ma)))) {
            canhBao({
                tieuDe: 'Thiếu Nhu Cầu Sử Dụng',
                noiDung: 'Hãy chọn ít nhất một nhu cầu laptop đang hoạt động để sản phẩm được phân loại chính xác.',
                loai: 'danger'
            });
            return;
        }

        // Link ảnh đại diện phải đúng định dạng (https://..., /images/... hoặc ảnh tải từ máy)
        const loiAnh = !formSp.hinh_anh_chinh?.trim() ? 'Sản phẩm cần có ảnh đại diện. Hãy dán link ảnh hoặc tải ảnh từ máy.' : loiLinkAnh(formSp.hinh_anh_chinh);
        if (loiAnh) {
            canhBao({ tieuDe: 'Ảnh Đại Diện Chưa Hợp Lệ', noiDung: loiAnh, loai: 'danger' });
            return;
        }

        setDangLuuSp(true);
        try {
            // Bảo toàn tuyệt đối mọi thông số kỹ thuật gốc có trong DB (không bị ghi đè mất các trường sâu)
            const thongSoGoc = (spDangSua && spDangSua.thong_so && typeof spDangSua.thong_so === 'object')
                ? { ...spDangSua.thong_so }
                : {};
            let thongSoPayload = {
                ...thongSoGoc,
                ...xayThongSoTheoLoai(formSp, loaiFormSanPham, { chuanHoa: true }),
                thoi_han_bao_hanh_thang: Math.max(1, Number(formSp.thoi_han_bao_hanh_thang) || 24)
            };

            // Đính kèm các tiêu đề nhóm tùy chỉnh vào payload MongoDB
            if (formSp.tieu_de_nhom_cpu) thongSoPayload.tieu_de_nhom_cpu = formSp.tieu_de_nhom_cpu;
            if (formSp.tieu_de_nhom_gpu) thongSoPayload.tieu_de_nhom_gpu = formSp.tieu_de_nhom_gpu;
            if (formSp.tieu_de_nhom_ram) thongSoPayload.tieu_de_nhom_ram = formSp.tieu_de_nhom_ram;
            if (formSp.tieu_de_nhom_man_hinh) thongSoPayload.tieu_de_nhom_man_hinh = formSp.tieu_de_nhom_man_hinh;
            if (formSp.tieu_de_nhom_pin) thongSoPayload.tieu_de_nhom_pin = formSp.tieu_de_nhom_pin;
            if (formSp.tieu_de_nhom_thiet_ke) thongSoPayload.tieu_de_nhom_thiet_ke = formSp.tieu_de_nhom_thiet_ke;
            if (formSp.tieu_de_nhom_linh_kien_hieu_nang) thongSoPayload.tieu_de_nhom_linh_kien_hieu_nang = formSp.tieu_de_nhom_linh_kien_hieu_nang;
            if (formSp.tieu_de_nhom_linh_kien_chuan) thongSoPayload.tieu_de_nhom_linh_kien_chuan = formSp.tieu_de_nhom_linh_kien_chuan;
            if (formSp.tieu_de_nhom_balo_ngan_chua) thongSoPayload.tieu_de_nhom_balo_ngan_chua = formSp.tieu_de_nhom_balo_ngan_chua;
            if (formSp.tieu_de_nhom_balo_chat_lieu) thongSoPayload.tieu_de_nhom_balo_chat_lieu = formSp.tieu_de_nhom_balo_chat_lieu;
            if (formSp.tieu_de_nhom_balo_tien_ich) thongSoPayload.tieu_de_nhom_balo_tien_ich = formSp.tieu_de_nhom_balo_tien_ich;
            if (formSp.tieu_de_nhom_phim_switch) thongSoPayload.tieu_de_nhom_phim_switch = formSp.tieu_de_nhom_phim_switch;
            if (formSp.tieu_de_nhom_phim_layout) thongSoPayload.tieu_de_nhom_phim_layout = formSp.tieu_de_nhom_phim_layout;
            if (formSp.tieu_de_nhom_phim_ket_noi) thongSoPayload.tieu_de_nhom_phim_ket_noi = formSp.tieu_de_nhom_phim_ket_noi;
            if (formSp.tieu_de_nhom_chuot_cam_bien) thongSoPayload.tieu_de_nhom_chuot_cam_bien = formSp.tieu_de_nhom_chuot_cam_bien;
            if (formSp.tieu_de_nhom_chuot_ket_noi) thongSoPayload.tieu_de_nhom_chuot_ket_noi = formSp.tieu_de_nhom_chuot_ket_noi;
            if (formSp.tieu_de_nhom_tai_nghe_am_thanh) thongSoPayload.tieu_de_nhom_tai_nghe_am_thanh = formSp.tieu_de_nhom_tai_nghe_am_thanh;
            if (formSp.tieu_de_nhom_tai_nghe_ket_noi) thongSoPayload.tieu_de_nhom_tai_nghe_ket_noi = formSp.tieu_de_nhom_tai_nghe_ket_noi;
            if (formSp.tieu_de_nhom_tai_nghe_thiet_ke) thongSoPayload.tieu_de_nhom_tai_nghe_thiet_ke = formSp.tieu_de_nhom_tai_nghe_thiet_ke;
            if (formSp.tieu_de_nhom_sac_cong_suat) thongSoPayload.tieu_de_nhom_sac_cong_suat = formSp.tieu_de_nhom_sac_cong_suat;
            if (formSp.tieu_de_nhom_sac_cong_ket_noi) thongSoPayload.tieu_de_nhom_sac_cong_ket_noi = formSp.tieu_de_nhom_sac_cong_ket_noi;
            if (formSp.tieu_de_nhom_sac_thiet_ke) thongSoPayload.tieu_de_nhom_sac_thiet_ke = formSp.tieu_de_nhom_sac_thiet_ke;

            thongSoTuyChinh.forEach(item => {
                if (item.key.trim() && item.value.trim()) {
                    const slugKey = chuyenKeySangSlug(item.key);
                    thongSoPayload[slugKey] = item.value.trim();
                }
            });

            // Gán danh mục chuẩn tương ứng theo nhóm mặt hàng
            let danhMucChuan = Array.isArray(formSp.danh_muc) ? [...formSp.danh_muc] : [];
            if (loaiFormSanPham === 'balo') {
                danhMucChuan = ['balo-tui-chong-soc', 'phu-kien-gear'];
            } else if (loaiFormSanPham === 'ban_phim') {
                danhMucChuan = ['ban-phim-co', 'phu-kien-gear'];
            } else if (loaiFormSanPham === 'chuot') {
                danhMucChuan = ['chuot-lot-chuot', 'phu-kien-gear'];
            } else if (loaiFormSanPham === 'tai_nghe') {
                danhMucChuan = ['tai-nghe-loa', 'phu-kien-gear'];
            } else if (loaiFormSanPham === 'sac_hub') {
                danhMucChuan = ['sac-cap-hub', 'phu-kien-gear'];
            } else if (loaiFormSanPham === 'linh_kien') {
                danhMucChuan = ['linh-kien-nang-cap', 'linh-kien'];
            } else if (loaiFormSanPham === 'laptop') {
                danhMucChuan = danhMucChuan.filter((ma) => nhuCauHopLe.has(ma));
            }

            // Chuẩn hóa danh sách biến thể / màu sắc phụ
            const danhSachBienTheChuan = (formSp.tuy_chon_phien_ban || []).map((opt, i) => ({
                ma_tuy_chon: opt.ma_tuy_chon?.trim() || `opt-${i + 1}`,
                ten_tuy_chon: opt.ten_tuy_chon?.trim() || `Tùy chọn ${i + 1}`,
                chenh_lech_gia: Number(opt.chenh_lech_gia) || 0,
                hinh_anh: opt.hinh_anh?.trim() || formSp.hinh_anh_chinh?.trim() || ''
            }));

            const payload = {
                ma_san_pham: formSp.ma_san_pham.toUpperCase().trim(),
                ten_san_pham: formSp.ten_san_pham.trim(),
                loai_san_pham: loaiFormSanPham,
                hang_san_xuat: formSp.hang_san_xuat.toLowerCase().trim(),
                danh_muc: danhMucChuan,
                gia_goc: Number(formSp.gia_goc) || 0,
                gia_khuyen_mai: Number(formSp.gia_khuyen_mai) || 0,
                phan_tram_giam_gia: Number(formSp.phan_tram_giam_gia) || 0,
                hinh_anh_chinh: formSp.hinh_anh_chinh.trim(),
                so_luong_ton_kho: Number(formSp.so_luong_ton_kho) || 0,
                con_hang: Boolean(formSp.con_hang),
                la_flash_sale: Boolean(formSp.la_flash_sale),
                la_ban_chay: Boolean(formSp.la_ban_chay),
                la_san_pham_moi: Boolean(formSp.la_san_pham_moi),
                mo_ta_chi_tiet: formSp.mo_ta_chi_tiet || '',
                mo_ta_ngan: formSp.mo_ta_ngan || '',
                dac_diem_noi_bat: (formSp.dac_diem_noi_bat || []).map(s => String(s).trim()).filter(Boolean),
                qua_tang: (formSp.qua_tang || []).filter(q => q && q.ten_qua_tang && q.ten_qua_tang.trim()).map(q => ({
                    ten_qua_tang: q.ten_qua_tang.trim(),
                    gia_tri: Number(q.gia_tri) || 0
                })),
                thong_so: { ...thongSoPayload, mo_ta_ngan: formSp.mo_ta_ngan || '' },
                tuy_chon_phien_ban: danhSachBienTheChuan,
                thu_vien_hinh_anh: formSp.thu_vien_hinh_anh || []
            };

            if (spDangSua) {
                const sanPhamDaLuu = await SanPhamService.capNhatSanPham(spDangSua.id || spDangSua._id, payload);
                setDanhSachSanPham((cu) => cu.map((sp) =>
                    (sp.id || sp._id) === (spDangSua.id || spDangSua._id) ? sanPhamDaLuu : sp
                ));
                hienThongBao(`Đã cập nhật "${payload.ten_san_pham}" thành công!`);
            } else {
                payload.id = formSp.ten_san_pham
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

                const sanPhamDaLuu = await SanPhamService.themSanPham(payload);
                setDanhSachSanPham((cu) => [sanPhamDaLuu, ...cu]);
                hienThongBao(`Đã thêm mới "${payload.ten_san_pham}" vào kho!`);
            }

            setDangMoModalSp(false);
            setSpDangSua(null);
            taiDuLieuToanBo();
        } catch (err) {
            canhBao({ tieuDe: 'Không Thể Lưu Sản Phẩm', noiDung: err.message, loai: 'danger' });
        } finally {
            setDangLuuSp(false);
        }
    };
    // Lọc và sắp xếp riêng danh sách cho bảng quản lý sản phẩm.
    const sanPhamHienThi = useMemo(() => {
        let list = danhSachSanPham.filter(sp => {
            const tuKhoa = (tuKhoaSanPham || tuKhoaGlobal).toLowerCase().trim();
            const matchTuKhoa = !tuKhoa ||
                sp.ten_san_pham?.toLowerCase().includes(tuKhoa) ||
                sp.ma_san_pham?.toLowerCase().includes(tuKhoa) ||
                sp.hang_san_xuat?.toLowerCase().includes(tuKhoa) ||
                (Array.isArray(sp.tuy_chon_phien_ban) && sp.tuy_chon_phien_ban.some(opt => opt.ten_tuy_chon?.toLowerCase().includes(tuKhoa))) ||
                JSON.stringify(sp.thong_so || {}).toLowerCase().includes(tuKhoa);

            let matchNganhHang = true;
            if (locNganhHang === 'laptop') {
                matchNganhHang = xacDinhLoaiSanPham(sp) === 'laptop';
            } else if (locNganhHang !== 'tat_ca' && locNganhHang !== 'laptop') {
                const danhMuc = Array.isArray(sp.danh_muc) ? sp.danh_muc : [sp.danh_muc].filter(Boolean);
                matchNganhHang = danhMuc.includes(locNganhHang);
            }

            const matchHang = locHangSanPham === 'tat_ca' || sp.hang_san_xuat?.toLowerCase() === locHangSanPham.toLowerCase();

            let matchTonKho = true;
            if (locTonKhoSanPham === 'con_hang') {
                matchTonKho = (sp.so_luong_ton_kho > 0) && (sp.con_hang !== false);
            } else if (locTonKhoSanPham === 'sap_het') {
                matchTonKho = (sp.so_luong_ton_kho <= 5 && sp.so_luong_ton_kho > 0);
            } else if (locTonKhoSanPham === 'tam_an') {
                matchTonKho = (sp.so_luong_ton_kho <= 0) || (sp.con_hang === false);
            } else if (locTonKhoSanPham === 'flash_sale') {
                matchTonKho = Boolean(sp.la_flash_sale);
            }

            return matchTuKhoa && matchNganhHang && matchHang && matchTonKho;
        });

        const layThoiDiemCapNhatSanPham = (sp) => {
            const giaTri = sp.updatedAt || sp.ngay_cap_nhat || sp.createdAt || sp.ngay_tao || sp.ngayTao;
            const thoiDiem = new Date(giaTri || 0).getTime();
            return Number.isFinite(thoiDiem) ? thoiDiem : 0;
        };

        if (sapXepSanPham === 'moi_nhat') {
            list.sort((a, b) => layThoiDiemCapNhatSanPham(b) - layThoiDiemCapNhatSanPham(a));
        } else if (sapXepSanPham === 'gia_giam') {
            list.sort((a, b) => (b.gia_khuyen_mai || 0) - (a.gia_khuyen_mai || 0));
        } else if (sapXepSanPham === 'gia_tang') {
            list.sort((a, b) => (a.gia_khuyen_mai || 0) - (b.gia_khuyen_mai || 0));
        } else if (sapXepSanPham === 'ban_chay') {
            list.sort((a, b) => (b.so_luong_da_ban || 0) - (a.so_luong_da_ban || 0));
        } else if (sapXepSanPham === 'ton_kho') {
            list.sort((a, b) => (b.so_luong_ton_kho || 0) - (a.so_luong_ton_kho || 0));
        }

        return list;
    }, [danhSachSanPham, tuKhoaGlobal, tuKhoaSanPham, locNganhHang, locHangSanPham, locTonKhoSanPham, sapXepSanPham, xacDinhLoaiSanPham]);

    // Chuẩn bị danh sách hãng và loại hàng cho bộ lọc của trang sản phẩm.
    const danhSachHangThucTe = useMemo(() => {
        const hangSet = new Map();
        // Chỉ lấy dòng là hãng, không trộn loại sản phẩm / nhu cầu vào ô "Hãng"
        danhSachDanhMuc.forEach(dm => {
            if (dm.loai && dm.loai !== 'thuong_hieu') return;
            hangSet.set(dm.ma_danh_muc.toLowerCase(), dm.ten_danh_muc);
        });
        danhSachSanPham.forEach(sp => {
            if (sp.hang_san_xuat) {
                const key = sp.hang_san_xuat.toLowerCase();
                if (!hangSet.has(key)) {
                    hangSet.set(key, sp.hang_san_xuat.toUpperCase());
                }
            }
        });
        return Array.from(hangSet.entries()).map(([ma, ten]) => ({ ma, ten }));
    }, [danhSachDanhMuc, danhSachSanPham]);

    // Bộ lọc ngành hàng lấy tên và mã từ danh mục đang hoạt động trong DB.
    const danhSachLoaiSanPham = useMemo(() => danhSachDanhMuc
        .filter((dm) => dm.loai === 'loai_san_pham' && dm.kich_hoat !== false)
        .sort((a, b) => (a.thu_tu_hien_thi || 0) - (b.thu_tu_hien_thi || 0))
        .map((dm) => ({ ma: dm.ma_danh_muc, ten: dm.ten_danh_muc, logo: dm.logo || '📦' })), [danhSachDanhMuc]);

    return { danhSachHangThucTe, danhSachLoaiSanPham, sanPhamHienThi, moModalThemSp, moModalSuaSp, xayThongSoTheoLoai, sanPhamXemTruoc, dacDiemNoiBatXemTruoc, tuyChonHienTaiXemTruoc, giaHienTaiXemTruoc, giaGocHienTaiXemTruoc, tienTietKiemXemTruoc, xuLyLuuSanPham };
}
