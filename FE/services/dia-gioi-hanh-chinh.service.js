/**
 * Dịch vụ Địa giới hành chính Việt Nam (63 Tỉnh Thành, Quận Huyện, Phường Xã)
 * Hỗ trợ tra cứu Realtime, bộ đệm thông minh chống tải lặp (Anti-race & Anti-duplicate)
 * Tích hợp Fallback 63 tỉnh thành đầy đủ chuẩn quốc gia.
 */

// Danh mục 63 Tỉnh / Thành phố Việt Nam (Fallback 0ms phòng khi mất kết nối API)
export const DANH_SACH_63_TINH_THANH_CHUAN = [
    { code: 1, name: 'Thành phố Hà Nội', codename: 'thanh_pho_ha_noi' },
    { code: 2, name: 'Tỉnh Hà Giang', codename: 'tinh_ha_giang' },
    { code: 4, name: 'Tỉnh Cao Bằng', codename: 'tinh_cao_bang' },
    { code: 6, name: 'Tỉnh Bắc Kạn', codename: 'tinh_bac_kan' },
    { code: 8, name: 'Tỉnh Tuyên Quang', codename: 'tinh_tuyen_quang' },
    { code: 10, name: 'Tỉnh Lào Cai', codename: 'tinh_lao_cai' },
    { code: 11, name: 'Tỉnh Điện Biên', codename: 'tinh_dien_bien' },
    { code: 12, name: 'Tỉnh Lai Châu', codename: 'tinh_lai_chau' },
    { code: 14, name: 'Tỉnh Sơn La', codename: 'tinh_son_la' },
    { code: 15, name: 'Tỉnh Yên Bái', codename: 'tinh_yen_bai' },
    { code: 17, name: 'Tỉnh Hoà Bình', codename: 'tinh_hoa_binh' },
    { code: 19, name: 'Tỉnh Thái Nguyên', codename: 'tinh_thai_nguyen' },
    { code: 20, name: 'Tỉnh Lạng Sơn', codename: 'tinh_lang_son' },
    { code: 22, name: 'Tỉnh Quảng Ninh', codename: 'tinh_quang_ninh' },
    { code: 24, name: 'Tỉnh Bắc Giang', codename: 'tinh_bac_giang' },
    { code: 25, name: 'Tỉnh Phú Thọ', codename: 'tinh_phu_tho' },
    { code: 26, name: 'Tỉnh Vĩnh Phúc', codename: 'tinh_vinh_phuc' },
    { code: 27, name: 'Tỉnh Bắc Ninh', codename: 'tinh_bac_ninh' },
    { code: 30, name: 'Tỉnh Hải Dương', codename: 'tinh_hai_duong' },
    { code: 31, name: 'Thành phố Hải Phòng', codename: 'thanh_pho_hai_phong' },
    { code: 33, name: 'Tỉnh Hưng Yên', codename: 'tinh_hung_yen' },
    { code: 34, name: 'Tỉnh Thái Bình', codename: 'tinh_thai_binh' },
    { code: 35, name: 'Tỉnh Hà Nam', codename: 'tinh_ha_nam' },
    { code: 36, name: 'Tỉnh Nam Định', codename: 'tinh_nam_dinh' },
    { code: 37, name: 'Tỉnh Ninh Bình', codename: 'tinh_ninh_binh' },
    { code: 38, name: 'Tỉnh Thanh Hóa', codename: 'tinh_thanh_hoa' },
    { code: 40, name: 'Tỉnh Nghệ An', codename: 'tinh_nghe_an' },
    { code: 42, name: 'Tỉnh Hà Tĩnh', codename: 'tinh_ha_tinh' },
    { code: 44, name: 'Tỉnh Quảng Bình', codename: 'tinh_quang_binh' },
    { code: 45, name: 'Tỉnh Quảng Trị', codename: 'tinh_quang_tri' },
    { code: 46, name: 'Thành phố Huế', codename: 'thanh_pho_hue' },
    { code: 48, name: 'Thành phố Đà Nẵng', codename: 'thanh_pho_da_nang' },
    { code: 49, name: 'Tỉnh Quảng Nam', codename: 'tinh_quang_nam' },
    { code: 51, name: 'Tỉnh Quảng Ngãi', codename: 'tinh_quang_ngai' },
    { code: 52, name: 'Tỉnh Bình Định', codename: 'tinh_binh_dinh' },
    { code: 54, name: 'Tỉnh Phú Yên', codename: 'tinh_phu_yen' },
    { code: 56, name: 'Tỉnh Khánh Hòa', codename: 'tinh_khanh_hoa' },
    { code: 58, name: 'Tỉnh Ninh Thuận', codename: 'tinh_ninh_thuan' },
    { code: 60, name: 'Tỉnh Bình Thuận', codename: 'tinh_binh_thuan' },
    { code: 62, name: 'Tỉnh Kon Tum', codename: 'tinh_kon_tum' },
    { code: 64, name: 'Tỉnh Gia Lai', codename: 'tinh_gia_lai' },
    { code: 66, name: 'Tỉnh Đắk Lắk', codename: 'tinh_dak_lak' },
    { code: 67, name: 'Tỉnh Đắk Nông', codename: 'tinh_dak_nong' },
    { code: 68, name: 'Tỉnh Lâm Đồng', codename: 'tinh_lam_dong' },
    { code: 70, name: 'Tỉnh Bình Phước', codename: 'tinh_binh_phuoc' },
    { code: 72, name: 'Tỉnh Tây Ninh', codename: 'tinh_tay_ninh' },
    { code: 74, name: 'Tỉnh Bình Dương', codename: 'tinh_binh_duong' },
    { code: 75, name: 'Tỉnh Đồng Nai', codename: 'tinh_dong_nai' },
    { code: 77, name: 'Tỉnh Bà Rịa - Vũng Tàu', codename: 'tinh_ba_ria_vung_tau' },
    { code: 79, name: 'Thành phố Hồ Chí Minh', codename: 'thanh_pho_ho_chi_minh' },
    { code: 80, name: 'Tỉnh Long An', codename: 'tinh_long_an' },
    { code: 82, name: 'Tỉnh Tiền Giang', codename: 'tinh_tien_giang' },
    { code: 83, name: 'Tỉnh Bến Tre', codename: 'tinh_ben_tre' },
    { code: 84, name: 'Tỉnh Trà Vinh', codename: 'tinh_tra_vinh' },
    { code: 86, name: 'Tỉnh Vĩnh Long', codename: 'tinh_vinh_long' },
    { code: 87, name: 'Tỉnh Đồng Tháp', codename: 'tinh_dong_thap' },
    { code: 89, name: 'Tỉnh An Giang', codename: 'tinh_an_giang' },
    { code: 91, name: 'Tỉnh Kiên Giang', codename: 'tinh_kien_giang' },
    { code: 92, name: 'Thành phố Cần Thơ', codename: 'thanh_pho_can_tho' },
    { code: 93, name: 'Tỉnh Hậu Giang', codename: 'tinh_hau_giang' },
    { code: 94, name: 'Tỉnh Sóc Trăng', codename: 'tinh_soc_trang' },
    { code: 95, name: 'Tỉnh Bạc Liêu', codename: 'tinh_bac_lieu' },
    { code: 96, name: 'Tỉnh Cà Mau', codename: 'tinh_ca_mau' }
];

// Danh mục 34 Tỉnh / Thành phố Việt Nam Chuẩn API v2 (Sau sáp nhập hành chính)
// API endpoint nguồn chính thức: https://provinces.open-api.vn/api/v2/
export const DANH_SACH_34_TINH_THANH_SAU_SAP_NHAP = [
    { code: 1, name: 'Thành phố Hà Nội', codename: 'ha_noi', division_type: 'thành phố trung ương' },
    { code: 4, name: 'Tỉnh Cao Bằng', codename: 'cao_bang', division_type: 'tỉnh' },
    { code: 8, name: 'Tỉnh Tuyên Quang', codename: 'tuyen_quang', division_type: 'tỉnh', phuDe: 'Bao gồm Hà Giang cũ' },
    { code: 11, name: 'Tỉnh Điện Biên', codename: 'dien_bien', division_type: 'tỉnh' },
    { code: 12, name: 'Tỉnh Lai Châu', codename: 'lai_chau', division_type: 'tỉnh' },
    { code: 14, name: 'Tỉnh Sơn La', codename: 'son_la', division_type: 'tỉnh' },
    { code: 15, name: 'Tỉnh Lào Cai', codename: 'lao_cai', division_type: 'tỉnh', phuDe: 'Bao gồm Yên Bái cũ' },
    { code: 19, name: 'Tỉnh Thái Nguyên', codename: 'thai_nguyen', division_type: 'tỉnh', phuDe: 'Bao gồm Bắc Kạn cũ' },
    { code: 20, name: 'Tỉnh Lạng Sơn', codename: 'lang_son', division_type: 'tỉnh' },
    { code: 22, name: 'Thành phố Quảng Ninh', codename: 'quang_ninh', division_type: 'thành phố trung ương' },
    { code: 24, name: 'Thành phố Bắc Ninh', codename: 'bac_ninh', division_type: 'thành phố trung ương', phuDe: 'Bao gồm Bắc Giang cũ' },
    { code: 25, name: 'Tỉnh Phú Thọ', codename: 'phu_tho', division_type: 'tỉnh', phuDe: 'Bao gồm Hòa Bình, Vĩnh Phúc cũ' },
    { code: 31, name: 'Thành phố Hải Phòng', codename: 'hai_phong', division_type: 'thành phố trung ương', phuDe: 'Bao gồm Hải Dương cũ' },
    { code: 33, name: 'Tỉnh Hưng Yên', codename: 'hung_yen', division_type: 'tỉnh', phuDe: 'Bao gồm Thái Bình cũ' },
    { code: 37, name: 'Tỉnh Ninh Bình', codename: 'ninh_binh', division_type: 'tỉnh', phuDe: 'Bao gồm Hà Nam, Nam Định cũ' },
    { code: 38, name: 'Tỉnh Thanh Hóa', codename: 'thanh_hoa', division_type: 'tỉnh' },
    { code: 40, name: 'Tỉnh Nghệ An', codename: 'nghe_an', division_type: 'tỉnh' },
    { code: 42, name: 'Tỉnh Hà Tĩnh', codename: 'ha_tinh', division_type: 'tỉnh' },
    { code: 44, name: 'Tỉnh Quảng Trị', codename: 'quang_tri', division_type: 'tỉnh', phuDe: 'Bao gồm Quảng Bình cũ' },
    { code: 46, name: 'Thành phố Huế', codename: 'hue', division_type: 'thành phố trung ương' },
    { code: 48, name: 'Thành phố Đà Nẵng', codename: 'da_nang', division_type: 'thành phố trung ương', phuDe: 'Bao gồm Quảng Nam cũ' },
    { code: 51, name: 'Tỉnh Quảng Ngãi', codename: 'quang_ngai', division_type: 'tỉnh', phuDe: 'Bao gồm Bình Định, Phú Yên cũ' },
    { code: 52, name: 'Tỉnh Gia Lai', codename: 'gia_lai', division_type: 'tỉnh', phuDe: 'Bao gồm Kon Tum cũ' },
    { code: 56, name: 'Tỉnh Khánh Hòa', codename: 'khanh_hoa', division_type: 'tỉnh', phuDe: 'Bao gồm Ninh Thuận, Bình Thuận cũ' },
    { code: 66, name: 'Tỉnh Đắk Lắk', codename: 'dak_lak', division_type: 'tỉnh', phuDe: 'Bao gồm Đắk Nông cũ' },
    { code: 68, name: 'Tỉnh Lâm Đồng', codename: 'lam_dong', division_type: 'tỉnh' },
    { code: 75, name: 'Thành phố Đồng Nai', codename: 'dong_nai', division_type: 'thành phố trung ương', phuDe: 'Bao gồm Bà Rịa - Vũng Tàu, Bình Phước cũ' },
    { code: 79, name: 'Thành phố Hồ Chí Minh', codename: 'ho_chi_minh', division_type: 'thành phố trung ương', phuDe: 'Bao gồm Bình Dương cũ' },
    { code: 80, name: 'Tỉnh Tây Ninh', codename: 'tay_ninh', division_type: 'tỉnh', phuDe: 'Bao gồm Long An cũ' },
    { code: 82, name: 'Tỉnh Đồng Tháp', codename: 'dong_thap', division_type: 'tỉnh', phuDe: 'Bao gồm Tiền Giang cũ' },
    { code: 86, name: 'Tỉnh Vĩnh Long', codename: 'vinh_long', division_type: 'tỉnh', phuDe: 'Bao gồm Bến Tre, Trà Vinh cũ' },
    { code: 91, name: 'Tỉnh An Giang', codename: 'an_giang', division_type: 'tỉnh', phuDe: 'Bao gồm Kiên Giang cũ' },
    { code: 92, name: 'Thành phố Cần Thơ', codename: 'can_tho', division_type: 'thành phố trung ương', phuDe: 'Bao gồm Hậu Giang cũ' },
    { code: 96, name: 'Tỉnh Cà Mau', codename: 'ca_mau', division_type: 'tỉnh', phuDe: 'Bao gồm Sóc Trăng, Bạc Liêu cũ' }
];

// Bản đồ tra cứu nhanh địa giới cũ sang tỉnh mới theo chuẩn API v2
export const TRA_CUU_SAP_NHAP_V2 = {
    'ben_tre': { tenMoi: 'Tỉnh Vĩnh Long', codeMoi: 86, ghiChu: 'Bến Tre sáp nhập vào Tỉnh Vĩnh Long (gồm Phường Bến Tre, Xã Mỏ Cày, Xã Ba Tri...)' },
    'tra_vinh': { tenMoi: 'Tỉnh Vĩnh Long', codeMoi: 86, ghiChu: 'Trà Vinh sáp nhập vào Tỉnh Vĩnh Long' },
    'tien_giang': { tenMoi: 'Tỉnh Đồng Tháp', codeMoi: 82, ghiChu: 'Tiền Giang sáp nhập vào Tỉnh Đồng Tháp (gồm Phường Mỹ Tho, Gò Công...)' },
    'long_an': { tenMoi: 'Tỉnh Tây Ninh', codeMoi: 80, ghiChu: 'Long An sáp nhập vào Tỉnh Tây Ninh (gồm Phường Tân An, Xã Bến Lức...)' },
    'binh_duong': { tenMoi: 'Thành phố Hồ Chí Minh', codeMoi: 79, ghiChu: 'Bình Dương sáp nhập vào TP. Hồ Chí Minh (gồm Phường Thủ Dầu Một...)' },
    'ba_ria_vung_tau': { tenMoi: 'Thành phố Đồng Nai', codeMoi: 75, ghiChu: 'Bà Rịa - Vũng Tàu sáp nhập vào TP. Đồng Nai' },
    'binh_phuoc': { tenMoi: 'Thành phố Đồng Nai', codeMoi: 75, ghiChu: 'Bình Phước sáp nhập vào TP. Đồng Nai' },
    'soc_trang': { tenMoi: 'Tỉnh Cà Mau', codeMoi: 96, ghiChu: 'Sóc Trăng sáp nhập vào Tỉnh Cà Mau' },
    'bac_lieu': { tenMoi: 'Tỉnh Cà Mau', codeMoi: 96, ghiChu: 'Bạc Liêu sáp nhập vào Tỉnh Cà Mau' },
    'hau_giang': { tenMoi: 'Thành phố Cần Thơ', codeMoi: 92, ghiChu: 'Hậu Giang sáp nhập vào TP. Cần Thơ' },
    'kien_giang': { tenMoi: 'Tỉnh An Giang', codeMoi: 91, ghiChu: 'Kiên Giang sáp nhập vào Tỉnh An Giang' }
};

// Helper xóa dấu tiếng Việt chuẩn quốc tế
export const xoaDauTiengViet = (str = '') => {
    return String(str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .trim();
};

// Từ khóa viết tắt địa danh phổ biến của người dùng Việt
const TU_KHOA_VIET_TAT = {
    hcm: 'ho chi minh',
    sg: 'ho chi minh',
    tphcm: 'ho chi minh',
    hn: 'ha noi',
    dn: 'da nang',
    ct: 'can tho',
    hp: 'hai phong',
    bt: 'ben tre',
    bd: 'binh duong',
    vt: 'vung tau',
    vl: 'vinh long',
    qn: 'quang ninh',
    bn: 'bac ninh'
};

// Hàm lọc tìm kiếm Realtime thông minh (khớp chính xác, không dấu, từng từ, viết tắt, phụ đề sáp nhập)
export const khopTuKhoaDiaChi = (item, tuKhoa = '') => {
    if (!tuKhoa || !tuKhoa.trim()) return true;
    const ten = typeof item === 'string' ? item : (item?.name || item?.ten || '');
    const phuDe = typeof item === 'object' ? (item?.phuDe || item?.ghiChu || '') : '';
    const chuoiTongHop = `${ten} ${phuDe}`;
    const tenKhongDau = xoaDauTiengViet(chuoiTongHop);
    const tuKhoaRaw = xoaDauTiengViet(tuKhoa);

    if (!tuKhoaRaw) return true;

    // 1. Khớp từ viết tắt
    const tuKhoaMoRong = TU_KHOA_VIET_TAT[tuKhoaRaw] || tuKhoaRaw;
    if (tenKhongDau.includes(tuKhoaRaw) || tenKhongDau.includes(tuKhoaMoRong)) {
        return true;
    }

    // 2. Khớp từng từ tách biệt (Ví dụ "ben tre" -> ["ben", "tre"] đều xuất hiện trong "tinh vinh long bao gom ben tre")
    const cacTu = tuKhoaRaw.split(/\s+/).filter(Boolean);
    if (cacTu.length > 0 && cacTu.every(tu => tenKhongDau.includes(tu))) {
        return true;
    }

    return false;
};

// Bộ nhớ đệm tĩnh chống race condition và duplicate items
let cacheTinhThanhData = null;
let cacheTinhThanhPromise = null;
let cacheTinhThanhV2Data = null;
let cacheTinhThanhV2Promise = null;
const cacheQuanHuyenMap = new Map();
const cachePhuongXaMap = new Map();
const cachePhuongXaV2Map = new Map();

// Hàm loại bỏ phần tử trùng lặp theo `code` hoặc `name`
const khuTrungLap = (danhSach = []) => {
    if (!Array.isArray(danhSach)) return [];
    const banDo = new Map();
    danhSach.forEach(item => {
        const khoa = item?.code ? `code_${item.code}` : `name_${item?.name || item?.ten || ''}`;
        if (!banDo.has(khoa)) {
            banDo.set(khoa, item);
        }
    });
    return Array.from(banDo.values());
};

export const DiaGioiHanhChinhService = {
    /**
     * Lấy danh sách 63 Tỉnh/Thành phố Việt Nam (API v1 - Chuẩn truyền thống 3 cấp)
     */
    async layDanhSachTinhThanhAsync() {
        if (cacheTinhThanhData && cacheTinhThanhData.length > 0) {
            return cacheTinhThanhData;
        }

        if (cacheTinhThanhPromise) {
            return cacheTinhThanhPromise;
        }

        cacheTinhThanhPromise = (async () => {
            try {
                const res = await fetch('https://provinces.open-api.vn/api/?depth=1', { cache: 'force-cache' });
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        cacheTinhThanhData = khuTrungLap(data);
                        return cacheTinhThanhData;
                    }
                }
            } catch (err) {
                console.warn('Sử dụng bộ 63 tỉnh thành chuẩn quốc gia dự phòng:', err.message);
            }

            cacheTinhThanhData = khuTrungLap(DANH_SACH_63_TINH_THANH_CHUAN);
            return cacheTinhThanhData;
        })();

        try {
            return await cacheTinhThanhPromise;
        } finally {
            cacheTinhThanhPromise = null;
        }
    },

    /**
     * Lấy danh sách 34 Tỉnh/Thành phố Việt Nam Chuẩn API v2 (Sau sáp nhập hành chính)
     */
    async layDanhSachTinhThanhV2Async() {
        if (cacheTinhThanhV2Data && cacheTinhThanhV2Data.length > 0) {
            return cacheTinhThanhV2Data;
        }

        if (cacheTinhThanhV2Promise) {
            return cacheTinhThanhV2Promise;
        }

        cacheTinhThanhV2Promise = (async () => {
            try {
                const res = await fetch('https://provinces.open-api.vn/api/v2/', { cache: 'force-cache' });
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        const dataV2 = data.map(tinh => {
                            const found = DANH_SACH_34_TINH_THANH_SAU_SAP_NHAP.find(s => s.code === tinh.code);
                            return {
                                ...tinh,
                                phuDe: found?.phuDe || ''
                            };
                        });
                        cacheTinhThanhV2Data = khuTrungLap(dataV2);
                        return cacheTinhThanhV2Data;
                    }
                }
            } catch (err) {
                console.warn('Sử dụng bộ 34 tỉnh thành chuẩn API v2 dự phòng:', err.message);
            }

            cacheTinhThanhV2Data = khuTrungLap(DANH_SACH_34_TINH_THANH_SAU_SAP_NHAP);
            return cacheTinhThanhV2Data;
        })();

        try {
            return await cacheTinhThanhV2Promise;
        } finally {
            cacheTinhThanhV2Promise = null;
        }
    },

    /**
     * Lấy danh sách Phường/Xã trực tiếp theo mã Tỉnh (API v2 - Mô hình 2 Cấp Hành Chính)
     * Ví dụ: Mã 86 (Tỉnh Vĩnh Long) sẽ trả về toàn bộ Phường/Xã gồm cả Phường Bến Tre, Xã Mỏ Cày, Xã Ba Tri...
     */
    async layDanhSachPhuongXaTheoTinhAsync(maTinh) {
        if (!maTinh) return [];
        const key = `v2_p_${maTinh}`;
        if (cachePhuongXaV2Map.has(key)) {
            return cachePhuongXaV2Map.get(key);
        }

        try {
            const res = await fetch(`https://provinces.open-api.vn/api/v2/p/${maTinh}?depth=2`);
            if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data.wards)) {
                    const danhSach = khuTrungLap(data.wards);
                    cachePhuongXaV2Map.set(key, danhSach);
                    return danhSach;
                }
            }
        } catch (err) {
            console.warn(`Lỗi nạp Phường/Xã API v2 của tỉnh ${maTinh}:`, err.message);
        }

        return [];
    },

    /**
     * Lấy danh sách Quận / Huyện theo mã Tỉnh (API v1)
     */
    async layDanhSachQuanHuyenAsync(maTinh) {
        if (!maTinh) return [];
        const key = String(maTinh);
        if (cacheQuanHuyenMap.has(key)) {
            return cacheQuanHuyenMap.get(key);
        }

        try {
            const res = await fetch(`https://provinces.open-api.vn/api/p/${maTinh}?depth=2`);
            if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data.districts)) {
                    const danhSach = khuTrungLap(data.districts);
                    cacheQuanHuyenMap.set(key, danhSach);
                    return danhSach;
                }
            }
        } catch (err) {
            console.warn(`Lỗi nạp Quận/Huyện của tỉnh ${maTinh}:`, err.message);
        }

        return [];
    },

    /**
     * Lấy danh sách Phường / Xã theo mã Quận (API v1)
     */
    async layDanhSachPhuongXaAsync(maQuan) {
        if (!maQuan) return [];
        const key = String(maQuan);
        if (cachePhuongXaMap.has(key)) {
            return cachePhuongXaMap.get(key);
        }

        try {
            const res = await fetch(`https://provinces.open-api.vn/api/d/${maQuan}?depth=2`);
            if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data.wards)) {
                    const danhSach = khuTrungLap(data.wards);
                    cachePhuongXaMap.set(key, danhSach);
                    return danhSach;
                }
            }
        } catch (err) {
            console.warn(`Lỗi nạp Phường/Xã của quận ${maQuan}:`, err.message);
        }

        return [];
    }
};

