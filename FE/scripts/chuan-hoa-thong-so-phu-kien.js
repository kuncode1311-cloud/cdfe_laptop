import fs from 'fs';
import path from 'path';

const duLieuPath = path.join(process.cwd(), 'du-lieu', 'san-pham-bo-sung.js');
let content = fs.readFileSync(duLieuPath, 'utf-8');

console.log('Bắt đầu làm sạch thông số phụ kiện trong san-pham-bo-sung.js...');

// Thay thế các trường thông số bị nhầm thành trường chuẩn đúng nghĩa
// 1. Bàn phím cơ
content = content.replace(
    /id: "ban-phim-co-akko-mod007-pc"[\s\S]*?che_do_bao_hanh: "Bảo hành 12 tháng"\s*}/,
    `id: "ban-phim-co-akko-mod007-pc",
        ma_san_pham: "KB-AKKO-MOD007",
        ten_san_pham: "Bàn Phím Cơ Không Dây AKKO MOD007 PC 7th Anniversary - Magnetic Switch Hall Effect Rapid Trigger",
        hang_san_xuat: "akko",
        danh_muc: ["ban-phim-co", "phu-kien-gear"],
        gia_goc: 3490000,
        gia_khuyen_mai: 2890000,
        phan_tram_giam_gia: 17,
        hinh_anh_chinh: "/images/sp/ban_phim_akko_mod007.jpg",
        thu_vien_hinh_anh: ["/images/sp/ban_phim_akko_mod007.jpg"],
        thong_so: {
            loai_switch: "Magnetic Switch Hall Effect (Công tắc từ tính siêu nhạy)",
            tinh_nang_dac_biet: "Rapid Trigger nhận lệnh tức thì từ 0.1mm đến 4.0mm cho Valorant/CS2",
            layout: "75% nhỏ gọn 82 phím thanh lịch",
            keycap: "PBT Dye-sub cao cấp chống mòn bóng",
            cau_truc: "Gasket Mount đệm Poron tiêu âm trầm ấm",
            led_rgb: "RGB 16.8 triệu màu đa chế độ nháy",
            chuan_wifi_bluetooth: "3 Mode: Bluetooth 5.0, 2.4GHz & Type-C tháo rời",
            dung_luong_pin: "3000mAh dùng nhiều tuần",
            trong_luong: 1.05,
            che_do_bao_hanh: "Bảo hành chính hãng 12 tháng"
        }`
);

// 2. Bàn phím ROG Azoth
content = content.replace(
    /id: "ban-phim-co-asus-rog-azoth"[\s\S]*?che_do_bao_hanh: "Bảo hành 24 tháng chính hãng"\s*}/,
    `id: "ban-phim-co-asus-rog-azoth",
        ma_san_pham: "KB-ROG-AZOTH",
        ten_san_pham: "Bàn Phím Cơ ASUS ROG Azoth 75% Màn Hình OLED | 3 Mode Kết Nối | Switch ROG NX Lube Sẵn | Gasket Mount",
        hang_san_xuat: "asus",
        danh_muc: ["ban-phim-co", "phu-kien-gear"],
        gia_goc: 6590000,
        gia_khuyen_mai: 5690000,
        phan_tram_giam_gia: 14,
        hinh_anh_chinh: "/images/sp/ban_phim_rog_azoth.jpg",
        thu_vien_hinh_anh: ["/images/sp/ban_phim_rog_azoth.jpg"],
        thong_so: {
            loai_switch: "Switch cơ học ROG NX Red/Blue/Brown (Pre-lubed từ nhà máy)",
            tinh_nang_dac_biet: "Màn hình OLED 2 inch hiển thị thông số PC, ảnh GIF & núm gạt 3 hướng",
            layout: "75% custom chuyên nghiệp, hỗ trợ Hot-swap thay switch nhanh",
            keycap: "PBT Doubleshot ROG siêu bền",
            cau_truc: "Gasket Mount 3 lớp đệm silicone tiêu âm",
            chuan_wifi_bluetooth: "ROG SpeedNova 2.4GHz, Bluetooth 5.1 & Dây Type-C",
            dung_luong_pin: "Lên tới 2.000 giờ sử dụng",
            trong_luong: 1.18,
            che_do_bao_hanh: "Bảo hành 24 tháng chính hãng ASUS"
        }`
);

// 3. Bàn phím Keychron Q1 Pro
content = content.replace(
    /id: "ban-phim-co-keychron-q1-pro"[\s\S]*?che_do_bao_hanh: "Bảo hành 12 tháng"\s*}/,
    `id: "ban-phim-co-keychron-q1-pro",
        ma_san_pham: "KB-KEY-Q1PRO",
        ten_san_pham: "Bàn Phím Cơ Custom Keychron Q1 Pro Full Nhôm CNC | Bluetooth 5.1 & Type-C | QMK/VIA | Switch Keychron K Pro",
        hang_san_xuat: "keychron",
        danh_muc: ["ban-phim-co", "phu-kien-gear"],
        gia_goc: 5290000,
        gia_khuyen_mai: 4690000,
        phan_tram_giam_gia: 11,
        hinh_anh_chinh: "/images/sp/ban_phim_keychron_q1.jpg",
        thu_vien_hinh_anh: ["/images/sp/ban_phim_keychron_q1.jpg"],
        thong_so: {
            loai_switch: "Keychron K Pro Switch (Red/Brown/Banana) Hot-swap",
            tinh_nang_dac_biet: "Hỗ trợ lập trình phím tự do qua QMK/VIA",
            layout: "75% khung nhôm nguyên khối cắt CNC anodized sang trọng",
            keycap: "KSA Profile PBT Double-shot",
            cau_truc: "Double Gasket Mount siêu đầm và êm",
            chuan_wifi_bluetooth: "Bluetooth 5.1 & Type-C có dây",
            dung_luong_pin: "4000mAh lên tới 300 giờ dùng",
            trong_luong: 1.73,
            che_do_bao_hanh: "Bảo hành chính hãng 12 tháng"
        }`
);

// 4. Bàn phím Logitech G915 TKL
content = content.replace(
    /id: "ban-phim-co-logitech-g915-tkl"[\s\S]*?che_do_bao_hanh: "Bảo hành 24 tháng chính hãng"\s*}/,
    `id: "ban-phim-co-logitech-g915-tkl",
        ma_san_pham: "KB-LOGI-G915TKL",
        ten_san_pham: "Bàn Phím Cơ Siêu Mỏng Không Dây Logitech G915 TKL Lightspeed RGB GL Tactile Switch",
        hang_san_xuat: "logitech",
        danh_muc: ["ban-phim-co", "phu-kien-gear"],
        gia_goc: 4690000,
        gia_khuyen_mai: 3890000,
        phan_tram_giam_gia: 17,
        hinh_anh_chinh: "/images/sp/ban_phim_logitech_g915.jpg",
        thu_vien_hinh_anh: ["/images/sp/ban_phim_logitech_g915.jpg"],
        thong_so: {
            loai_switch: "GL Tactile Low-profile cơ học siêu mỏng",
            tinh_nang_dac_biet: "Con lăn âm lượng bằng kim loại chuyên dụng",
            layout: "Tenkeyless (TKL) không phím số nhỏ gọn",
            chat_lieu_vo: "Mặt nhôm xước Aircraft-grade 5052 cao cấp",
            chuan_wifi_bluetooth: "Không dây Lightspeed 1ms & Bluetooth",
            dung_luong_pin: "40 giờ sáng đèn RGB liên tục",
            trong_luong: 0.81,
            che_do_bao_hanh: "Bảo hành 24 tháng chính hãng"
        }`
);

// 5. Bàn phím Razer BlackWidow V4 Pro
content = content.replace(
    /id: "ban-phim-co-razer-blackwidow-v4-pro"[\s\S]*?che_do_bao_hanh: "Bảo hành 24 tháng"\s*}/,
    `id: "ban-phim-co-razer-blackwidow-v4-pro",
        ma_san_pham: "KB-RAZER-BW4PRO",
        ten_san_pham: "Bàn Phím Cơ Gaming Razer BlackWidow V4 Pro - Núm Xoay Command Dial & Đèn LED Underglow 3 Vùng",
        hang_san_xuat: "razer",
        danh_muc: ["ban-phim-co", "phu-kien-gear"],
        gia_goc: 5990000,
        gia_khuyen_mai: 4990000,
        phan_tram_giam_gia: 17,
        hinh_anh_chinh: "/images/sp/ban_phim_razer_blackwidow.jpg",
        thu_vien_hinh_anh: ["/images/sp/ban_phim_razer_blackwidow.jpg"],
        thong_so: {
            loai_switch: "Razer Green/Yellow Mechanical Switch tuổi thọ 100 triệu lần bấm",
            tinh_nang_dac_biet: "Núm xoay Razer Command Dial & 8 phím Macro chuyên dụng",
            layout: "Fullsize 104 phím đầy đủ",
            led_rgb: "Razer Chroma RGB từng phím kèm dải sáng Underglow 3 cạnh",
            trong_luong: 1.12,
            che_do_bao_hanh: "Bảo hành 24 tháng chính hãng"
        }`
);

// 6. Balo Predator Utility
content = content.replace(
    /id: "balo-predator-gaming-utility"[\s\S]*?che_do_bao_hanh: "Bảo hành 24 tháng chính hãng"\s*}/,
    `id: "balo-predator-gaming-utility",
        ma_san_pham: "BP-PRED-UTILITY",
        ten_san_pham: "Balo Acer Predator Gaming Utility 17.3 inch Kháng Nước Chuẩn Quân Đội - Đệm Lưng Thoáng Khí",
        hang_san_xuat: "acer",
        danh_muc: ["balo-tui-chong-soc", "phu-kien-gear"],
        gia_goc: 1990000,
        gia_khuyen_mai: 1490000,
        phan_tram_giam_gia: 25,
        hinh_anh_chinh: "/images/sp/balo_predator_utility.jpg",
        thu_vien_hinh_anh: ["/images/sp/balo_predator_utility.jpg"],
        thong_so: {
            ngan_chua_laptop: "Laptop gaming màn hình lớn tới 17.3 inch",
            dung_tich: "32 Lít chịu tải trọng lên tới 100 kg",
            chat_lieu_vai: "Vải Polyester 1680D phủ PU kháng nước tuyệt đối",
            khang_nuoc: "Kháng mưa chuẩn IPX4, chống rạch chống bám bẩn",
            trong_luong: 1.1,
            che_do_bao_hanh: "Bảo hành 24 tháng chính hãng"
        }`
);

// 7. Túi chống sốc Tomtoc A13
content = content.replace(
    /id: "tui-chong-soc-tomtoc-defender-macbook"[\s\S]*?che_do_bao_hanh: "Bảo hành khóa kéo 12 tháng"\s*}/,
    `id: "tui-chong-soc-tomtoc-defender-macbook",
        ma_san_pham: "TT-A13-MB16",
        ten_san_pham: "Túi Chống Sốc Tomtoc Defender A13 Bảo Vệ 360° Cho MacBook & Laptop 14-16 inch Chống Rơi Vỡ CornerArmor",
        hang_san_xuat: "tomtoc",
        danh_muc: ["balo-tui-chong-soc", "phu-kien-gear"],
        gia_goc: 950000,
        gia_khuyen_mai: 750000,
        phan_tram_giam_gia: 21,
        hinh_anh_chinh: "/images/sp/tui_chong_soc_tomtoc_a13.jpg",
        thu_vien_hinh_anh: ["/images/sp/tui_chong_soc_tomtoc_a13.jpg"],
        thong_so: {
            ngan_chua_laptop: "MacBook Pro 14/16 inch & laptop mỏng nhẹ 13 - 16 inch",
            chat_lieu_vai: "Vải tái chế Cordura chống thấm nước bền bỉ",
            cong_nghe_bao_ve: "Công nghệ CornerArmor 4 góc chống sốc chuẩn quân đội Mỹ",
            khang_nuoc: "Kháng nước chống giọt bắn nhẹ",
            trong_luong: 0.35,
            che_do_bao_hanh: "Bảo hành khóa kéo YKK 12 tháng"
        }`
);

fs.writeFileSync(duLieuPath, content, 'utf-8');
console.log('✅ Đã cập nhật xong san-pham-bo-sung.js');
