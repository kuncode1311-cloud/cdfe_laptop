import fs from 'fs';
import path from 'path';

const spDir = path.join(process.cwd(), 'public', 'images', 'sp');
if (!fs.existsSync(spDir)) {
    fs.mkdirSync(spDir, { recursive: true });
}

// 40 ảnh sản phẩm (10 laptop + 30 phụ kiện) chuẩn tỉ lệ 16:9 (1376 x 768 px)
const danhSachAnh = [
    // === 10 LAPTOP MỚI ===
    {
        name: 'asus_zephyrus_g16.jpg',
        url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'lenovo_legion_9i.jpg',
        url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'dell_alienware_m18.jpg',
        url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'macbook_pro_16_m3.jpg',
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'macbook_air_15_m3.jpg',
        url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'hp_spectre_16.jpg',
        url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'thinkpad_x1_carbon.jpg',
        url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'predator_helios_neo.jpg',
        url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'asus_tuf_a15.jpg',
        url: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'msi_stealth_16.jpg',
        url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },

    // === 5 BALO & TÚI CHỐNG SỐC ===
    {
        name: 'balo_predator_utility.jpg',
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'tui_chong_soc_tomtoc_a13.jpg',
        url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'balo_targus_strike.jpg',
        url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'balo_dell_pursuit.jpg',
        url: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'tui_deo_cheo_tomtoc_edc.jpg',
        url: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },

    // === 5 BÀN PHÍM CƠ ===
    {
        name: 'ban_phim_rog_azoth.jpg',
        url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'ban_phim_keychron_q1.jpg',
        url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'ban_phim_logitech_g915.jpg',
        url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'ban_phim_razer_blackwidow.jpg',
        url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'ban_phim_akko_mod007.jpg',
        url: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },

    // === 5 CHUỘT & PAD ===
    {
        name: 'chuot_logitech_mx_master3s.jpg',
        url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'chuot_razer_deathadder_v3.jpg',
        url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'chuot_pulsar_x2v2.jpg',
        url: 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'lot_chuot_artisan_fx.jpg',
        url: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'lot_chuot_corsair_mm700.jpg',
        url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },

    // === 5 TAI NGHE & LOA ===
    {
        name: 'tai_nghe_sony_wh1000xm5.jpg',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'tai_nghe_hyperx_cloud3.jpg',
        url: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'tai_nghe_steelseries_arctis.jpg',
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'loa_marshall_emberton2.jpg',
        url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'loa_jbl_charge5.jpg',
        url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },

    // === 5 SẠC & CÁP & HUB ===
    {
        name: 'cu_sac_ugreen_100w.jpg',
        url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'cap_belkin_thunderbolt4.jpg',
        url: 'https://images.unsplash.com/photo-1609703418786-a9bb56f08fb7?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'tram_sac_anker_prime_200w.jpg',
        url: 'https://images.unsplash.com/photo-1609592424346-608b8b9cb0a8?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'hub_caldigit_ts4.jpg',
        url: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'pin_sac_shargeek_storm2.jpg',
        url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },

    // === 5 LINH KIỆN NÂNG CẤP ===
    {
        name: 'ssd_wd_black_sn850x.jpg',
        url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'ram_kingston_fury_impact.jpg',
        url: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'keo_tan_nhiet_kryonaut.jpg',
        url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'de_tan_nhiet_iets_gt500.jpg',
        url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1376&h=768&fit=crop&crop=entropy&q=88'
    },
    {
        name: 'ssd_sandisk_extreme_pro.jpg',
        url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=1376&h=768&fit=crop&crop=entropy&q=88'
    }
];

async function taiToanBoAnh() {
    console.log(`🚀 Bắt đầu tải ${danhSachAnh.length} hình ảnh sản phẩm chuẩn 16:9 (1376x768)...`);
    let demThanhCong = 0;

    for (let i = 0; i < danhSachAnh.length; i++) {
        const item = danhSachAnh[i];
        const destPath = path.join(spDir, item.name);

        try {
            console.log(`[${i + 1}/${danhSachAnh.length}] Đang tải: ${item.name}...`);
            const res = await fetch(item.url);
            if (!res.ok) {
                console.warn(`⚠️ HTTP ${res.status} khi tải ${item.name}`);
                continue;
            }
            const buffer = Buffer.from(await res.arrayBuffer());
            fs.writeFileSync(destPath, buffer);
            demThanhCong++;
        } catch (err) {
            console.error(`❌ Lỗi tải ${item.name}:`, err.message);
        }
    }

    console.log(`\n🎉 HOÀN TẤT TẢI ẢNH: ${demThanhCong}/${danhSachAnh.length} ảnh đã sẵn sàng trong ${spDir}`);
}

taiToanBoAnh();
