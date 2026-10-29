/**
 * =====================================================
 * TỪ ĐIỂN THÔNG SỐ KỸ THUẬT SẢN PHẨM
 * =====================================================
 * Ánh xạ giữa slug/key tiếng Anh ↔ Tiếng Việt có dấu chuẩn đẹp.
 * Dùng chung cho Admin, trang chi tiết sản phẩm, và xuất báo cáo.
 */

// Ánh xạ thông số sản phẩm từ nhãn tiếng Việt về khóa chuẩn lưu trong database.
export const TU_DIEN_REVERSE_SLUG = {
    'chất liệu vỏ máy': 'chat_lieu_vo',
    'chất liệu vỏ': 'chat_lieu_vo',
    'bàn phím & đèn nền': 'ban_phim',
    'bàn phím': 'ban_phim',
    'chuẩn wi-fi & bluetooth': 'chuan_wifi_bluetooth',
    'chuẩn wifi & bluetooth': 'chuan_wifi_bluetooth',
    'chuẩn wi-fi': 'chuan_wifi_bluetooth',
    'chuẩn wifi': 'chuan_wifi_bluetooth',
    'công nghệ âm thanh': 'am_thanh',
    'âm thanh': 'am_thanh',
    'hệ điều hành tích hợp': 'he_dieu_hanh',
    'hệ điều hành': 'he_dieu_hanh',
    'cổng kết nối ngoại vi': 'cong_ket_noi',
    'cổng kết nối': 'cong_ket_noi',
    'tốc độ bus ram': 'toc_do_bus',
    'tốc độ bus': 'toc_do_bus',
    'khả năng nâng cấp ram': 'nang_cap_ram_toi_da',
    'nâng cấp ram': 'nang_cap_ram_toi_da',
    'khe cắm mở rộng ssd/m.2': 'khe_cam_mo_rong',
    'khe cắm mở rộng': 'khe_cam_mo_rong',
    'độ phân giải chuẩn': 'do_phan_giai',
    'độ phân giải': 'do_phan_giai',
    'công nghệ tấm nền': 'tam_nen',
    'tấm nền': 'tam_nen',
    'độ phủ gam màu': 'do_phu_mau',
    'độ phủ màu': 'do_phu_mau',
    'hệ thống tản nhiệt': 'chi_tiet_tan_nhiet',
    'tản nhiệt': 'chi_tiet_tan_nhiet',
    'tần số quét màn hình': 'tan_so_quet',
    'tần số quét': 'tan_so_quet',
    'độ sáng cực đại': 'do_sang_nits',
    'độ sáng': 'do_sang_nits',
    'công suất card đồ họa tgp': 'cong_suat_tgp',
    'công suất tgp': 'cong_suat_tgp',
    'công suất bộ sạc đi kèm': 'bo_sac_cong_suat',
    'công suất bộ sạc': 'bo_sac_cong_suat',
    'chế độ bảo hành chính hãng': 'che_do_bao_hanh',
    'chế độ bảo hành': 'che_do_bao_hanh',
    'bảo hành': 'che_do_bao_hanh'
};

// Từ điển giải nghĩa slug / mã thông số sang Tiếng Việt có dấu chuẩn đẹp cho admin và khách xem
export const TU_DIEN_THONG_SO_ADMIN = {
    'toc_do_bus': 'Tốc độ Bus RAM',
    'nang_cap_ram_toi_da': 'Khả năng nâng cấp RAM',
    'khe_cam_mo_rong': 'Khe cắm mở rộng SSD/M.2',
    'do_phan_giai': 'Độ phân giải chuẩn',
    'tam_nen': 'Công nghệ tấm nền',
    'do_phu_mau': 'Độ phủ gam màu',
    'chi_tiet_tan_nhiet': 'Hệ thống tản nhiệt',
    'tan_so_quet': 'Tần số quét màn hình',
    'do_sang_nits': 'Độ sáng cực đại',
    'cong_suat_tgp': 'Công suất card đồ họa TGP',
    'bo_sac_cong_suat': 'Công suất bộ sạc đi kèm',
    'chat_lieu_vo': 'Chất liệu vỏ máy',
    'chuan_wifi_bluetooth': 'Chuẩn Wi-Fi & Bluetooth',
    'cong_ket_noi': 'Cổng kết nối ngoại vi',
    'he_dieu_hanh': 'Hệ điều hành tích hợp',
    'che_do_bao_hanh': 'Chế độ bảo hành chính hãng',
    'ban_phim': 'Bàn phím & Đèn nền',
    'am_thanh': 'Công nghệ âm thanh'
};
