/**
 * Script đồng bộ Voucher và Sản phẩm khuyến mãi giảm sâu chuẩn 100% theo ảnh mẫu TNTP
 * Nạp trực tiếp vào MongoDB Atlas
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });
const MaGiamGia = require('../models/ma-giam-gia.model');
const SanPham = require('../models/san-pham.model');

// Danh sách Voucher khớp 100% với giao diện ảnh mẫu
const DANH_SACH_VOUCHER = [
    // 4 Voucher hiển thị chính ở tab "Tất cả" và các tab con
    {
        id: 'vc-tntp-3tr',
        ma_code: 'TNTP3TR',
        tieu_de: 'Giảm 3.000.000đ',
        mo_ta: 'Cho laptop Gaming RTX',
        loai_giam: 'tien_mat',
        gia_tri_giam: 3000000,
        giam_toi_da: 3000000,
        don_hang_toi_thieu: 20000000,
        ngay_het_han: 'Còn 12 ngày',
        chuyen_muc: 'laptop',
        badge: 'GAMING RTX',
        hot_deal: true,
        mau_sac: 'red',
        phan_tram_da_dung: 78,
        so_luong_con_lai: 22,
        so_luong_phat_hanh: 100,
        kich_hoat: true
    },
    {
        id: 'vc-tntp-2tr',
        ma_code: 'TNTP2TR',
        tieu_de: 'Giảm 2.000.000đ',
        mo_ta: 'Cho laptop văn phòng',
        loai_giam: 'tien_mat',
        gia_tri_giam: 2000000,
        giam_toi_da: 2000000,
        don_hang_toi_thieu: 15000000,
        ngay_het_han: 'Còn 20 ngày',
        chuyen_muc: 'laptop',
        badge: 'VĂN PHÒNG',
        hot_deal: true,
        mau_sac: 'blue',
        phan_tram_da_dung: 65,
        so_luong_con_lai: 35,
        so_luong_phat_hanh: 100,
        kich_hoat: true
    },
    {
        id: 'vc-tntp-500k',
        ma_code: 'TNTP500K',
        tieu_de: 'Giảm 500.000đ',
        mo_ta: 'Cho phụ kiện & linh kiện',
        loai_giam: 'tien_mat',
        gia_tri_giam: 500000,
        giam_toi_da: 500000,
        don_hang_toi_thieu: 2000000,
        ngay_het_han: 'Còn 15 ngày',
        chuyen_muc: 'phu_kien',
        badge: 'PHỤ KIỆN',
        hot_deal: true,
        mau_sac: 'orange',
        phan_tram_da_dung: 82,
        so_luong_con_lai: 18,
        so_luong_phat_hanh: 100,
        kich_hoat: true
    },
    {
        id: 'vc-tntp-sv',
        ma_code: 'TNTPSV',
        tieu_de: 'Giảm 15%',
        mo_ta: 'Dành riêng cho sinh viên',
        loai_giam: 'phan_tram',
        gia_tri_giam: 15,
        giam_toi_da: 1500000,
        don_hang_toi_thieu: 5000000,
        ngay_het_han: 'Còn 30 ngày',
        chuyen_muc: 'sinh_vien',
        badge: 'SINH VIÊN',
        hot_deal: true,
        mau_sac: 'purple',
        phan_tram_da_dung: 45,
        so_luong_con_lai: 55,
        so_luong_phat_hanh: 100,
        kich_hoat: true
    },

    // Tab Thương hiệu
    {
        id: 'vc-asus-1tr',
        ma_code: 'ASUSVIP1TR',
        tieu_de: 'Giảm 1.000.000đ',
        mo_ta: 'Cho laptop ASUS ROG & Vivobook',
        loai_giam: 'tien_mat',
        gia_tri_giam: 1000000,
        giam_toi_da: 1000000,
        don_hang_toi_thieu: 18000000,
        ngay_het_han: 'Còn 25 ngày',
        chuyen_muc: 'thuong_hieu',
        badge: 'ASUS OFFICIAL',
        hot_deal: false,
        mau_sac: 'blue',
        phan_tram_da_dung: 50,
        so_luong_con_lai: 50,
        so_luong_phat_hanh: 100,
        kich_hoat: true
    },
    {
        id: 'vc-lenovo-2tr',
        ma_code: 'LENOVO2TR',
        tieu_de: 'Giảm 2.000.000đ',
        mo_ta: 'Cho Lenovo Legion & LOQ Series',
        loai_giam: 'tien_mat',
        gia_tri_giam: 2000000,
        giam_toi_da: 2000000,
        don_hang_toi_thieu: 22000000,
        ngay_het_han: 'Còn 18 ngày',
        chuyen_muc: 'thuong_hieu',
        badge: 'LENOVO LEGION',
        hot_deal: false,
        mau_sac: 'red',
        phan_tram_da_dung: 60,
        so_luong_con_lai: 40,
        so_luong_phat_hanh: 100,
        kich_hoat: true
    },
    {
        id: 'vc-apple-500k',
        ma_code: 'APPLE500K',
        tieu_de: 'Giảm 500.000đ',
        mo_ta: 'Dành cho MacBook Air & MacBook Pro',
        loai_giam: 'tien_mat',
        gia_tri_giam: 500000,
        giam_toi_da: 500000,
        don_hang_toi_thieu: 19000000,
        ngay_het_han: 'Còn 14 ngày',
        chuyen_muc: 'thuong_hieu',
        badge: 'APPLE AUTHORIZED',
        hot_deal: false,
        mau_sac: 'purple',
        phan_tram_da_dung: 70,
        so_luong_con_lai: 30,
        so_luong_phat_hanh: 100,
        kich_hoat: true
    },
    {
        id: 'vc-dell-1tr',
        ma_code: 'DELL1TR',
        tieu_de: 'Giảm 1.000.000đ',
        mo_ta: 'Cho laptop Dell XPS & Inspiron',
        loai_giam: 'tien_mat',
        gia_tri_giam: 1000000,
        giam_toi_da: 1000000,
        don_hang_toi_thieu: 16000000,
        ngay_het_han: 'Còn 22 ngày',
        chuyen_muc: 'thuong_hieu',
        badge: 'DELL VIỆT NAM',
        hot_deal: false,
        mau_sac: 'orange',
        phan_tram_da_dung: 40,
        so_luong_con_lai: 60,
        so_luong_phat_hanh: 100,
        kich_hoat: true
    },

    // Tab Laptop bổ sung
    {
        id: 'vc-aipc-700k',
        ma_code: 'AIPC700K',
        tieu_de: 'Giảm 700.000đ',
        mo_ta: 'Trợ giá Copilot+ AI PC Thế Hệ Mới',
        loai_giam: 'tien_mat',
        gia_tri_giam: 700000,
        giam_toi_da: 700000,
        don_hang_toi_thieu: 16000000,
        ngay_het_han: 'Còn 16 ngày',
        chuyen_muc: 'laptop',
        badge: 'AI PC 2026',
        hot_deal: false,
        mau_sac: 'blue',
        phan_tram_da_dung: 55,
        so_luong_con_lai: 45,
        so_luong_phat_hanh: 100,
        kich_hoat: true
    },
    {
        id: 'vc-gaming-pro-15tr',
        ma_code: 'GAMINGPRO',
        tieu_de: 'Giảm 1.500.000đ',
        mo_ta: 'Đại tiệc Gaming RTX 40 Series',
        loai_giam: 'tien_mat',
        gia_tri_giam: 1500000,
        giam_toi_da: 1500000,
        don_hang_toi_thieu: 25000000,
        ngay_het_han: 'Còn 14 ngày',
        chuyen_muc: 'laptop',
        badge: 'GAMING PRO',
        hot_deal: false,
        mau_sac: 'red',
        phan_tram_da_dung: 80,
        so_luong_con_lai: 20,
        so_luong_phat_hanh: 100,
        kich_hoat: true
    },

    // Tab Phụ kiện bổ sung
    {
        id: 'vc-gear-30',
        ma_code: 'GEAR30',
        tieu_de: 'Giảm 30%',
        mo_ta: 'Chuột, Bàn phím cơ & Tai nghe Gaming',
        loai_giam: 'phan_tram',
        gia_tri_giam: 30,
        giam_toi_da: 300000,
        don_hang_toi_thieu: 500000,
        ngay_het_han: 'Còn 10 ngày',
        chuyen_muc: 'phu_kien',
        badge: 'GEAR GAMING',
        hot_deal: false,
        mau_sac: 'orange',
        phan_tram_da_dung: 65,
        so_luong_con_lai: 35,
        so_luong_phat_hanh: 100,
        kich_hoat: true
    },
    {
        id: 'vc-balo-200k',
        ma_code: 'BALO200K',
        tieu_de: 'Giảm 200.000đ',
        mo_ta: 'Balo laptop gaming & Túi chống sốc',
        loai_giam: 'tien_mat',
        gia_tri_giam: 200000,
        giam_toi_da: 200000,
        don_hang_toi_thieu: 800000,
        ngay_het_han: 'Còn 15 ngày',
        chuyen_muc: 'phu_kien',
        badge: 'PHỤ KIỆN XỊN',
        hot_deal: false,
        mau_sac: 'blue',
        phan_tram_da_dung: 45,
        so_luong_con_lai: 55,
        so_luong_phat_hanh: 100,
        kich_hoat: true
    },

    // Tab Sinh viên bổ sung
    {
        id: 'vc-tan-sv',
        ma_code: 'TANSINHVIEN',
        tieu_de: 'Giảm 10%',
        mo_ta: 'Hỗ trợ tân sinh viên tựu trường',
        loai_giam: 'phan_tram',
        gia_tri_giam: 10,
        giam_toi_da: 1000000,
        don_hang_toi_thieu: 8000000,
        ngay_het_han: 'Còn 30 ngày',
        chuyen_muc: 'sinh_vien',
        badge: 'TÂN SINH VIÊN',
        hot_deal: false,
        mau_sac: 'purple',
        phan_tram_da_dung: 50,
        so_luong_con_lai: 50,
        so_luong_phat_hanh: 100,
        kich_hoat: true
    },
    {
        id: 'vc-sv-combo',
        ma_code: 'SVOFFICE',
        tieu_de: 'Giảm 800.000đ',
        mo_ta: 'Combo Laptop + Chuột Văn Phòng',
        loai_giam: 'tien_mat',
        gia_tri_giam: 800000,
        giam_toi_da: 800000,
        don_hang_toi_thieu: 10000000,
        ngay_het_han: 'Còn 28 ngày',
        chuyen_muc: 'sinh_vien',
        badge: 'COMBO SV',
        hot_deal: false,
        mau_sac: 'red',
        phan_tram_da_dung: 70,
        so_luong_con_lai: 30,
        so_luong_phat_hanh: 100,
        kich_hoat: true
    }
];

// 5 Sản phẩm Laptop Giảm Sâu khớp 100% ảnh mẫu
const SAN_PHAM_GIAM_SAU = [
    {
        id: 'lenovo-legion-5-2024',
        ma_san_pham: 'LEGION-5-2024',
        ten_san_pham: 'Lenovo Legion 5 2024',
        hang_san_xuat: 'lenovo',
        danh_muc: ['laptop-gaming', 'gaming-do-hoa'],
        gia_goc: 34990000,
        gia_khuyen_mai: 24990000,
        phan_tram_giam_gia: 28,
        hinh_anh_chinh: '/images/sp/lenovo_legion_pro7.jpg',
        thu_vien_hinh_anh: ['/images/sp/lenovo_legion_pro7.jpg'],
        thong_so: {
            cpu: 'i7-14650HX',
            card_do_hoa: 'RTX 4060',
            ram: '16GB',
            o_cung: '512GB SSD',
            man_hinh: '16 inch WQXGA 165Hz'
        },
        la_flash_sale: true,
        la_noi_bat: true,
        la_ban_chay: true,
        so_luong_ton_kho: 25,
        con_hang: true
    },
    {
        id: 'asus-vivobook-14',
        ma_san_pham: 'ASUS-VIVO-14',
        ten_san_pham: 'ASUS Vivobook 14',
        hang_san_xuat: 'asus',
        danh_muc: ['van-phong-mong-nhe', 'sinh-vien-van-phong'],
        gia_goc: 17290000,
        gia_khuyen_mai: 12990000,
        phan_tram_giam_gia: 25,
        hinh_anh_chinh: '/images/sp/zenbook_oled.jpg',
        thu_vien_hinh_anh: ['/images/sp/zenbook_oled.jpg'],
        thong_so: {
            cpu: 'i5-12450H',
            card_do_hoa: 'Intel UHD Graphics',
            ram: '16GB',
            o_cung: '512GB SSD',
            man_hinh: '14.0 inch FHD IPS'
        },
        la_flash_sale: true,
        la_noi_bat: true,
        la_ban_chay: true,
        so_luong_ton_kho: 40,
        con_hang: true
    },
    {
        id: 'acer-nitro-5',
        ma_san_pham: 'ACER-NITRO-5',
        ten_san_pham: 'Acer Nitro 5',
        hang_san_xuat: 'acer',
        danh_muc: ['laptop-gaming'],
        gia_goc: 25990000,
        gia_khuyen_mai: 17490000,
        phan_tram_giam_gia: 32,
        hinh_anh_chinh: '/images/sp/predator_helios.jpg',
        thu_vien_hinh_anh: ['/images/sp/predator_helios.jpg'],
        thong_so: {
            cpu: 'i5-13420H',
            card_do_hoa: 'RTX 4050',
            ram: '16GB',
            o_cung: '512GB SSD',
            man_hinh: '15.6 inch FHD 144Hz'
        },
        la_flash_sale: true,
        la_noi_bat: true,
        la_ban_chay: true,
        so_luong_ton_kho: 18,
        con_hang: true
    },
    {
        id: 'macbook-air-m2-13',
        ma_san_pham: 'MBA-M2-13',
        ten_san_pham: 'MacBook Air M2 13"',
        hang_san_xuat: 'apple',
        danh_muc: ['van-phong-mong-nhe', 'do-hoa-sang-tao'],
        gia_goc: 24990000,
        gia_khuyen_mai: 19990000,
        phan_tram_giam_gia: 20,
        hinh_anh_chinh: '/images/sp/macbook_pro_m3.jpg',
        thu_vien_hinh_anh: ['/images/sp/macbook_pro_m3.jpg'],
        thong_so: {
            cpu: 'Apple M2 8-Core',
            card_do_hoa: '8-Core GPU',
            ram: '8GB',
            o_cung: '256GB SSD',
            man_hinh: '13.6 inch Liquid Retina'
        },
        la_flash_sale: true,
        la_noi_bat: true,
        la_ban_chay: true,
        so_luong_ton_kho: 30,
        con_hang: true
    },
    {
        id: 'dell-inspiron-14-5440',
        ma_san_pham: 'DELL-INS-5440',
        ten_san_pham: 'Dell Inspiron 14 5440',
        hang_san_xuat: 'dell',
        danh_muc: ['van-phong-mong-nhe', 'sinh-vien-van-phong'],
        gia_goc: 20490000,
        gia_khuyen_mai: 14990000,
        phan_tram_giam_gia: 27,
        hinh_anh_chinh: '/images/sp/dell_xps_16.jpg',
        thu_vien_hinh_anh: ['/images/sp/dell_xps_16.jpg'],
        thong_so: {
            cpu: 'i5-1335U',
            card_do_hoa: 'Intel Iris Xe',
            ram: '16GB',
            o_cung: '512GB SSD',
            man_hinh: '14.0 inch FHD+ WVA'
        },
        la_flash_sale: true,
        la_noi_bat: true,
        la_ban_chay: true,
        so_luong_ton_kho: 22,
        con_hang: true
    }
];

async function dongBoKhuyenMai() {
    try {
        console.log('⏳ Đang kết nối MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Đã kết nối MongoDB Atlas thành công!');

        // 1. Đồng bộ Voucher
        console.log('🎟️ Đang đồng bộ danh sách Voucher TNTP...');
        await MaGiamGia.deleteMany({});
        const resVouchers = await MaGiamGia.insertMany(DANH_SACH_VOUCHER);
        console.log(`✅ Đã nạp thành công ${resVouchers.length} mã voucher vào MongoDB!`);

        // 2. Đồng bộ 5 Sản phẩm Giảm Sâu (Upsert theo id)
        console.log('💻 Đang đồng bộ 5 Sản phẩm Laptop Giảm Sâu...');
        for (const sp of SAN_PHAM_GIAM_SAU) {
            await SanPham.findOneAndUpdate(
                { id: sp.id },
                { $set: sp },
                { upsert: true, new: true }
            );
        }
        console.log(`✅ Đã cập nhật 5 sản phẩm laptop giảm sâu vào MongoDB!`);

        // 3. Cập nhật vào FE/du-lieu/danh-sach-ma-giam-gia.js để đảm bảo tính đồng bộ
        const feVoucherFilePath = path.join(__dirname, '../../FE/du-lieu/danh-sach-ma-giam-gia.js');
        const codeContent = `/**
 * Danh sách mã giảm giá TNTP dự phòng (Khớp 100% với MongoDB Atlas)
 */
export const DANH_SACH_MA_GIAM_GIA = ${JSON.stringify(DANH_SACH_VOUCHER, null, 4)};

export default DANH_SACH_MA_GIAM_GIA;
`;
        fs.writeFileSync(feVoucherFilePath, codeContent, 'utf8');
        console.log('✅ Đã đồng bộ FE/du-lieu/danh-sach-ma-giam-gia.js');

        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi đồng bộ:', error);
        process.exit(1);
    }
}

dongBoKhuyenMai();
