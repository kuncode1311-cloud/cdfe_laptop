/**
 * Cấu hình bộ lọc sản phẩm dùng chung.
 * - Mỗi nhóm lọc khai báo MỘT lần: nhãn, các tuỳ chọn hiển thị và hàm `khop` (luật lọc).
 * - Thanh lọc nhanh, drawer "Tất cả bộ lọc" và SanPhamService.locSanPham đều đọc từ đây,
 *   nên thêm một nhóm lọc mới chỉ cần thêm một phần tử vào NHOM_LOC_MAY.
 */

// Mã danh mục của laptop. Phụ kiện/linh kiện đang dùng chung các ô thông số (cpu, ram, o_cung...) để ghi
// thông tin khác, nên các nhóm lọc cấu hình máy chỉ áp dụng cho laptop, tránh đếm nhầm phụ kiện.
export const DANH_MUC_LAPTOP = ['gaming', 'ai-pc', 'van-phong-mong-nhe', 'do-hoa-sang-tao', 'doanh-nhan', 'sinh-vien'];
export const laLaptop = (sp) => (Array.isArray(sp?.danh_muc) ? sp.danh_muc : []).some((dm) => DANH_MUC_LAPTOP.includes(dm));

const thongSoCua = (sp) => sp?.thong_so || {};
const chuoiThongSo = (sp, truong) => String(thongSoCua(sp)[truong] ?? '').toLowerCase();

// Lấy số đầu tiên khớp biểu thức, ví dụ "32GB DDR5 (2x16GB)" -> 32 (không nhầm sang 16 của "2x16GB")
const docSo = (chuoi, bieuThuc) => {
    const ketQua = String(chuoi ?? '').match(bieuThuc);
    return ketQua ? parseFloat(ketQua[1]) : null;
};

export const docRamGb = (sp) => docSo(thongSoCua(sp).ram, /(\d+(?:\.\d+)?)\s*gb/i);

// Ổ cứng quy về GB: "2TB ..." -> 2000, "512GB ..." -> 512
export const docOCungGb = (sp) => {
    const ketQua = String(thongSoCua(sp).o_cung ?? '').match(/(\d+(?:\.\d+)?)\s*(tb|gb)/i);
    if (!ketQua) return null;
    return parseFloat(ketQua[1]) * (ketQua[2].toLowerCase() === 'tb' ? 1000 : 1);
};

// Cỡ màn hình (inch): "16.3\" 4K+" hoặc "18.0 inch QHD+" -> 16.3 / 18
export const docInchManHinh = (sp) =>
    docSo(thongSoCua(sp).man_hinh, /(\d{2}(?:\.\d+)?)\s*(?:inch|in\b|"|”|″)/i) ??
    docSo(thongSoCua(sp).man_hinh, /^\s*(\d{2}(?:\.\d+)?)/);

// Tần số quét (Hz): ưu tiên trường tan_so_quet, không có thì đọc từ mô tả màn hình ("... 240Hz ...")
export const docTanSoQuet = (sp) => {
    const tuTruong = parseInt(String(thongSoCua(sp).tan_so_quet ?? '').replace(/\D/g, ''), 10);
    if (Number.isFinite(tuTruong) && tuTruong > 0) return tuTruong;
    return docSo(thongSoCua(sp).man_hinh, /(\d{2,3})\s*hz/i);
};

export const DONG_CPU = [
    { ma: 'core_ultra', nhan: 'Intel Core Ultra' },
    { ma: 'core_i9', nhan: 'Intel Core i9' },
    { ma: 'core_i7', nhan: 'Intel Core i7' },
    { ma: 'core_i5', nhan: 'Intel Core i5' },
    { ma: 'ryzen', nhan: 'AMD Ryzen' },
    { ma: 'apple_m', nhan: 'Apple Silicon (M)' }
];

export const DONG_GPU = [
    { ma: 'rtx_4090', nhan: 'RTX 4090' },
    { ma: 'rtx_4080', nhan: 'RTX 4080' },
    { ma: 'rtx_4070', nhan: 'RTX 4070' },
    { ma: 'rtx_4060', nhan: 'RTX 4060' },
    { ma: 'rtx_4050', nhan: 'RTX 4050' },
    { ma: 'card_onboard', nhan: 'Onboard / Iris' }
];

const khopCpu = (sp, ma) => {
    const cpu = chuoiThongSo(sp, 'cpu');
    switch (ma) {
        case 'core_ultra': return cpu.includes('ultra');
        case 'core_i9': return cpu.includes('i9');
        case 'core_i7': return cpu.includes('i7');
        case 'core_i5': return cpu.includes('i5');
        case 'ryzen': return cpu.includes('ryzen') || cpu.includes('amd');
        case 'apple_m': return cpu.includes('apple') || /\bm[1-9]\b/.test(cpu);
        default: return false;
    }
};

const khopGpu = (sp, ma) => {
    const gpu = chuoiThongSo(sp, 'card_do_hoa');
    if (ma === 'card_onboard') {
        // Onboard = có thông tin card nhưng không phải card rời NVIDIA/AMD
        return gpu !== '' && !/rtx|gtx|geforce|radeon rx/.test(gpu);
    }
    const soHieu = ma.replace('rtx_', '');
    return gpu.includes(soHieu);
};

const khopRam = (sp, ma) => {
    const gb = docRamGb(sp);
    if (gb === null) return false;
    switch (ma) {
        case '8gb': return gb <= 8;
        case '16gb': return gb > 8 && gb <= 16;
        case '32gb': return gb > 16 && gb < 64;
        case '64gb': return gb >= 64;
        default: return false;
    }
};

const khopOCung = (sp, ma) => {
    const gb = docOCungGb(sp);
    if (gb === null) return false;
    switch (ma) {
        case '512gb': return gb < 1000;
        case '1tb': return gb >= 1000 && gb < 2000;
        case '2tb': return gb >= 2000;
        default: return false;
    }
};

const khopManHinh = (sp, ma) => {
    const inch = docInchManHinh(sp);
    if (inch === null) return false;
    switch (ma) {
        case 'duoi_14': return inch < 14;
        case '14_16': return inch >= 14 && inch < 16;
        case 'tu_16': return inch >= 16;
        default: return false;
    }
};

const khopTanSoQuet = (sp, ma) => {
    const hz = docTanSoQuet(sp);
    if (hz === null) return false;
    switch (ma) {
        case '60': return hz <= 60;
        case '120': return hz > 60 && hz <= 120;
        case '144_165': return hz > 120 && hz < 240;
        case '240': return hz >= 240;
        default: return false;
    }
};

const khopTamNen = (sp, ma) => chuoiThongSo(sp, 'tam_nen').replace(/[\s_]/g, '-').includes(ma.toLowerCase());

/**
 * Các nhóm lọc theo cấu hình máy (chỉ hiện khi còn sản phẩm phù hợp).
 * - khoa: tên trường trong state bộ lọc (mảng mã đã chọn)
 * - nhanh: true thì hiện ngay trên thanh lọc nhanh, false thì chỉ nằm trong drawer
 * - bieuTuong / mau: khoá tra trong ThanhPhanBoLoc.jsx
 */
export const NHOM_LOC_MAY = [
    { khoa: 'cpu_dong', nhan: 'Vi xử lý CPU', nhanNgan: 'CPU', bieuTuong: 'cpu', mau: 'indigo', nhanh: true, tuyChon: DONG_CPU, khop: khopCpu },
    {
        khoa: 'ram_dung_luong', nhan: 'Dung lượng RAM', nhanNgan: 'RAM', bieuTuong: 'ram', mau: 'sky', nhanh: true, khop: khopRam,
        tuyChon: [
            { ma: '8gb', nhan: '8 GB trở xuống' },
            { ma: '16gb', nhan: '16 GB' },
            { ma: '32gb', nhan: '32 GB - 48 GB' },
            { ma: '64gb', nhan: '64 GB trở lên' }
        ]
    },
    {
        khoa: 'o_cung_dung_luong', nhan: 'Ổ cứng SSD', nhanNgan: 'Ổ cứng', bieuTuong: 'oCung', mau: 'cyan', nhanh: true, khop: khopOCung,
        tuyChon: [
            { ma: '512gb', nhan: 'Dưới 1 TB' },
            { ma: '1tb', nhan: '1 TB' },
            { ma: '2tb', nhan: '2 TB trở lên' }
        ]
    },
    { khoa: 'card_do_hoa', nhan: 'Card đồ họa', nhanNgan: 'GPU', bieuTuong: 'gpu', mau: 'emerald', nhanh: true, tuyChon: DONG_GPU, khop: khopGpu },
    {
        khoa: 'kich_thuoc_man_hinh', nhan: 'Cỡ màn hình', nhanNgan: 'Màn hình', bieuTuong: 'manHinh', mau: 'violet', nhanh: false, khop: khopManHinh,
        tuyChon: [
            { ma: 'duoi_14', nhan: 'Dưới 14 inch' },
            { ma: '14_16', nhan: '14 - 15.9 inch' },
            { ma: 'tu_16', nhan: '16 inch trở lên' }
        ]
    },
    {
        khoa: 'tan_so_quet', nhan: 'Tần số quét', nhanNgan: 'Tần số quét', bieuTuong: 'tanSoQuet', mau: 'rose', nhanh: false, khop: khopTanSoQuet,
        tuyChon: [
            { ma: '60', nhan: '60 Hz' },
            { ma: '120', nhan: '120 Hz' },
            { ma: '144_165', nhan: '144 - 165 Hz' },
            { ma: '240', nhan: '240 Hz trở lên' }
        ]
    },
    {
        khoa: 'tam_nen', nhan: 'Tấm nền màn hình', nhanNgan: 'Tấm nền', bieuTuong: 'tamNen', mau: 'amber', nhanh: false, khop: khopTamNen,
        tuyChon: [
            { ma: 'IPS', nhan: 'IPS' },
            { ma: 'OLED', nhan: 'OLED' },
            { ma: 'Mini-LED', nhan: 'Mini-LED' }
        ]
    }
];

/**
 * Các công tắc bật/tắt (đúng/sai). nhanh: true thì có nút ngay trên thanh lọc nhanh.
 */
export const TOGGLE_LOC = [
    { khoa: 'ho_tro_tra_gop_0', nhan: 'Trả góp 0%', nhanDai: 'Hỗ trợ trả góp 0%', nhanh: true, khop: (sp) => !!sp.ho_tro_tra_gop_0_phan_tram },
    { khoa: 'dang_giam_gia', nhan: 'Đang giảm giá', nhanDai: 'Đang giảm giá / Flash Sale', nhanh: true, khop: (sp) => sp.phan_tram_giam_gia > 0 || !!sp.la_flash_sale },
    { khoa: 'con_hang_san', nhan: 'Còn hàng', nhanDai: 'Chỉ hiện sản phẩm còn hàng', nhanh: false, khop: (sp) => !!sp.con_hang && sp.so_luong_ton_kho > 0 }
];

// Tạo state bộ lọc rỗng; `rieng` ghi đè các giá trị cần giữ (ví dụ từ khoá, hãng lấy từ URL)
export const taoBoLocMacDinh = (rieng = {}) => ({
    tu_khoa: '',
    hang_san_xuat: [],
    danh_muc: [],
    ...Object.fromEntries(NHOM_LOC_MAY.map((nhom) => [nhom.khoa, []])),
    ...Object.fromEntries(TOGGLE_LOC.map((t) => [t.khoa, false])),
    muc_gia_toi_thieu: undefined,
    muc_gia_toi_da: undefined,
    sap_xep: 'moi_nhat',
    ...rieng
});

// Sản phẩm có thoả mọi nhóm lọc cấu hình + công tắc đang bật không
export const khopBoLocThongSo = (sp, boLoc) =>
    NHOM_LOC_MAY.every((nhom) => {
        const daChon = boLoc[nhom.khoa];
        return !daChon?.length || (laLaptop(sp) && daChon.some((ma) => nhom.khop(sp, ma)));
    }) && TOGGLE_LOC.every((t) => !boLoc[t.khoa] || t.khop(sp));

// Số tiêu chí đang áp dụng (hiện trên nút "Bộ lọc")
export const demSoTieuChi = (boLoc) =>
    (boLoc.hang_san_xuat?.length || 0) +
    NHOM_LOC_MAY.reduce((tong, nhom) => tong + (boLoc[nhom.khoa]?.length || 0), 0) +
    TOGGLE_LOC.filter((t) => boLoc[t.khoa]).length +
    (boLoc.muc_gia_toi_thieu !== undefined || boLoc.muc_gia_toi_da !== undefined ? 1 : 0) +
    (boLoc.tu_khoa?.trim() ? 1 : 0);

// Các mức giá chọn nhanh (dùng chung thanh lọc nhanh và drawer); mức đầu tiên là "không lọc giá"
export const KHOANG_GIA = [
    { nhan: 'Tất cả mức giá', nhanNgan: null, min: undefined, max: undefined },
    { nhan: 'Dưới 15 triệu', nhanNgan: '< 15 triệu', min: 0, max: 15000000 },
    { nhan: '15 - 25 triệu', nhanNgan: '15 - 25 triệu', min: 15000000, max: 25000000 },
    { nhan: '25 - 50 triệu', nhanNgan: '25 - 50 triệu', min: 25000000, max: 50000000 },
    { nhan: '50 - 80 triệu', nhanNgan: '50 - 80 triệu', min: 50000000, max: 80000000 },
    { nhan: 'Trên 80 triệu', nhanNgan: '> 80 triệu', min: 80000000, max: undefined }
];

// Nhãn ngắn của mức giá đang chọn, null nếu chưa lọc giá
export const nhanGiaDangChon = (boLoc) => {
    const { muc_gia_toi_thieu: min, muc_gia_toi_da: max } = boLoc;
    if (min === undefined && max === undefined) return null;
    const mucCoSan = KHOANG_GIA.find((k) => k.min === min && k.max === max);
    if (mucCoSan) return mucCoSan.nhanNgan;
    return `${min ? min / 1000000 + ' tr' : '0'} - ${max ? max / 1000000 + ' tr' : '∞'}`;
};
