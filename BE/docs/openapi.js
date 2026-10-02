/**
 * Đặc tả OpenAPI 3.0 của LaptopNew Backend API (hiển thị bằng Swagger UI tại /api-docs).
 * Viết tay theo đúng route/controller/model thực tế. Khi sửa route nhớ cập nhật file này.
 */

// ---------------------------------------------------------------- Helpers
const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const json = (schema, example) => ({ 'application/json': { schema, ...(example !== undefined ? { example } : {}) } });
const body = (schema, example, mota) => ({ required: true, ...(mota ? { description: mota } : {}), content: json(schema, example) });
const ok = (description, schema, example) => ({ description, ...(schema ? { content: json(schema, example) } : {}) });
const TEN_LOI = { 400: 'YeuCauKhongHopLe', 401: 'KhongXacThuc', 403: 'KhongDuQuyen', 404: 'KhongTimThay', 409: 'XungDot', 429: 'QuaNhieuYeuCau', 500: 'LoiMayChu' };
const loi = (code) => ({ $ref: `#/components/responses/${TEN_LOI[code] || code}` });
const pathId = (name = 'id', description = 'Mã định danh', example) => ({
    name, in: 'path', required: true, description, schema: { type: 'string' }, ...(example ? { example } : {})
});
const query = (name, description, schema = { type: 'string' }, example) => ({
    name, in: 'query', required: false, description, schema, ...(example !== undefined ? { example } : {})
});

const AUTH = {
    none: undefined,
    user: [{ bearerAuth: [] }],
    admin: [{ bearerAuth: [] }],
    optional: [{}, { bearerAuth: [] }]
};

/** Dựng 1 operation; tự thêm các response lỗi chung theo quyền truy cập và giới hạn tần suất. */
function op({ tag, summary, description = '', auth = 'none', rate, params, requestBody, responses = {}, deprecated }) {
    const quyen = {
        none: '',
        user: '\n\n🔐 **Yêu cầu đăng nhập** (JWT).',
        admin: '\n\n🛡️ **Chỉ Admin** (JWT với `vaiTro = admin`).',
        optional: '\n\n🔓 Đăng nhập là **tùy chọn**: có token thì được xem đầy đủ, không có thì dữ liệu nhạy cảm bị che.'
    }[auth];
    const gioiHan = rate ? `\n\n⏱️ **Giới hạn tần suất:** ${rate}. Vượt quá trả \`429\`.` : '';
    const res = { ...responses };
    if (auth === 'user' || auth === 'admin') { res[401] = res[401] || loi('KhongXacThuc'); }
    if (auth === 'admin') { res[403] = res[403] || loi('KhongDuQuyen'); }
    if (rate) { res[429] = res[429] || loi('QuaNhieuYeuCau'); }
    res[500] = res[500] || loi('LoiMayChu');
    return {
        tags: [tag],
        summary,
        description: (description + quyen + gioiHan).trim(),
        ...(params && params.length ? { parameters: params } : {}),
        ...(AUTH[auth] ? { security: AUTH[auth] } : {}),
        ...(requestBody ? { requestBody } : {}),
        responses: res,
        ...(deprecated ? { deprecated: true } : {})
    };
}

// ---------------------------------------------------------------- Ví dụ dùng lại
const vdNguoiDung = {
    id: 'usr_1759300000000_482', hoTen: 'Nguyễn Văn An', email: 'an.nguyen@gmail.com', soDienThoai: '0901234567',
    avatar: '', vaiTro: 'khach_hang', hangThanhVien: 'Thành Viên Mới', viVoucher: ['TNTP3TR'], gioiTinh: 'nam',
    ngaySinh: '2002-05-20', danhSachDiaChi: [], authProvider: 'local', daKichHoat: true, trangThai: 'hoat_dong',
    biKhoa: false, ngayTao: '01/10/2026'
};
const vdToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfMTc1OTMwMDAwMDAwMF80ODIiLCJ2YWlUcm8iOiJraGFjaF9oYW5nIiwidG9rZW5WZXJzaW9uIjowLCJpYXQiOjE3NTkzMDAwMDAsImV4cCI6MTc1OTkwNDgwMH0.signature';
const vdSanPham = {
    id: 'sp-asus-rog-strix-g16', slug: 'laptop-asus-rog-strix-g16-2026', ma_san_pham: 'G614JV-N4156W',
    ten_san_pham: 'Laptop ASUS ROG Strix G16 (2026)', hang_san_xuat: 'asus', danh_muc: ['gaming'],
    gia_goc: 42990000, gia_khuyen_mai: 38990000, phan_tram_giam_gia: 9, hinh_anh_chinh: '/images/sp/asus_rog_strix_g16.jpg',
    thu_vien_hinh_anh: [], thong_so: { cpu: 'Intel Core i7-13650HX', ram: '16GB DDR5', o_cung: '1TB SSD', card_do_hoa: 'RTX 4060 8GB', man_hinh: '16" QHD+ 240Hz' },
    tuy_chon_phien_ban: [{ ma_tuy_chon: 'ram32', ten_tuy_chon: '32GB / 1TB', ram: '32GB', o_cung: '1TB', chenh_lech_gia: 2500000 }],
    qua_tang: [{ ten_qua_tang: 'Chuột gaming ROG', gia_tri: 990000 }],
    con_hang: true, so_luong_ton_kho: 12, so_luong_da_ban: 48, diem_danh_gia_tb: 4.8, so_luong_danh_gia: 21,
    la_flash_sale: false, la_ban_chay: true, la_san_pham_moi: false, ho_tro_tra_gop_0_phan_tram: true
};
const vdDonHang = {
    id: 'dh-1759300000000-4821', ma_don_hang: 'LPN-2026-0123454821', id_nguoi_dung: 'usr_1759300000000_482',
    ngay_tao: '01/10/2026, 20:15:30', trang_thai: 'cho_xac_nhan',
    thong_tin_giao_hang: { ho_ten: 'Nguyễn Văn An', so_dien_thoai: '0901234567', email: 'an.nguyen@gmail.com', dia_chi_chi_tiet: '12 Trịnh Đình Thảo', phuong_xa: 'Hòa Thạnh', quan_huyen: 'Tân Phú', tinh_thanh: 'TP. Hồ Chí Minh', ghi_chu: 'Giao giờ hành chính' },
    danh_sach_san_pham: [{ san_pham_id: 'sp-asus-rog-strix-g16', ten_san_pham: 'Laptop ASUS ROG Strix G16 (2026)', so_luong: 1, gia: 38990000, tong_tien_muc: 38990000 }],
    tam_tinh: 38990000, tien_giam_gia: 3000000, ma_giam_gia: 'TNTP3TR', phi_van_chuyen: 0, tong_tien_thanh_toan: 35990000,
    hinh_thuc_thanh_toan: 'chuyen_khoan_vietqr', da_thanh_toan: false, trang_thai_thanh_toan: 'chua_thanh_toan', da_tru_ton_kho: false
};

// ---------------------------------------------------------------- Schemas
const schemas = {
    Loi: {
        type: 'object', description: 'Định dạng lỗi chuẩn của hầu hết API.',
        properties: {
            thong_diep: { type: 'string', example: 'Mô tả lỗi bằng tiếng Việt' },
            chi_tiet: { type: 'string', description: 'Chi tiết kỹ thuật. **Chỉ có khi chạy dev**; ẩn hoàn toàn ở production.' }
        },
        required: ['thong_diep']
    },
    LoiThanhToan: {
        type: 'object', description: 'Định dạng lỗi của nhóm /api/thanh-toan.',
        properties: { success: { type: 'boolean', example: false }, message: { type: 'string', example: 'Không tìm thấy đơn hàng cần thanh toán.' } }
    },
    LoiThanhCong: {
        type: 'object', description: 'Định dạng lỗi của nhóm lien-he / cai-dat / tro-ly-ai.',
        properties: { thanh_cong: { type: 'boolean', example: false }, thong_diep: { type: 'string' } }
    },
    LoiTinTuc: {
        type: 'object', description: 'Định dạng lỗi của nhóm /api/tin-tuc.',
        properties: { thanhCong: { type: 'boolean', example: false }, thongBao: { type: 'string', example: 'Không tìm thấy bài viết!' } }
    },
    XoaThanhCong: {
        type: 'object', properties: { thong_diep: { type: 'string', example: 'Đã xóa thành công' } }
    },

    // ---- Người dùng
    DiaChi: {
        type: 'object',
        properties: {
            id: { type: 'string', example: 'dc_1759300000000' }, hoTen: { type: 'string', example: 'Nguyễn Văn An' },
            soDienThoai: { type: 'string', example: '0901234567' }, diaChiChiTiet: { type: 'string', example: '12 Trịnh Đình Thảo' },
            tinhThanh: { type: 'string', example: 'TP. Hồ Chí Minh' }, quanHuyen: { type: 'string', example: 'Tân Phú' },
            phuongXa: { type: 'string', example: 'Hòa Thạnh' }, macDinh: { type: 'boolean', example: true },
            loaiDiaChi: { type: 'string', enum: ['nha_rieng', 'van_phong'], example: 'nha_rieng' }
        }
    },
    NguoiDung: {
        type: 'object',
        description: 'Hồ sơ người dùng. **Không bao giờ** chứa mật khẩu băm, OTP hay các bộ đếm bảo mật (`matKhau`, `maOtp`, `tokenVersion`...).',
        properties: {
            id: { type: 'string' }, hoTen: { type: 'string' }, email: { type: 'string', format: 'email' },
            soDienThoai: { type: 'string' }, avatar: { type: 'string' },
            vaiTro: { type: 'string', enum: ['khach_hang', 'admin'] }, hangThanhVien: { type: 'string' },
            viVoucher: { type: 'array', items: { type: 'string' }, description: 'Mã voucher đã lưu vào ví' },
            gioiTinh: { type: 'string', enum: ['nam', 'nu', 'khac'] }, ngaySinh: { type: 'string' },
            danhSachDiaChi: { type: 'array', items: ref('DiaChi') },
            authProvider: { type: 'string', enum: ['local', 'google'] }, googleId: { type: 'string' },
            daKichHoat: { type: 'boolean' }, trangThai: { type: 'string', enum: ['hoat_dong', 'bi_khoa'] },
            biKhoa: { type: 'boolean' }, lyDoKhoa: { type: 'string' }, ngayTao: { type: 'string', example: '01/10/2026' }
        },
        example: vdNguoiDung
    },
    PhienDangNhap: {
        type: 'object', required: ['token', 'nguoiDung'],
        properties: {
            thong_diep: { type: 'string', example: 'Đăng nhập thành công! Xin chào Nguyễn Văn An.' },
            token: { type: 'string', description: 'JWT, mặc định hết hạn sau 7 ngày. Gửi kèm header `Authorization: Bearer <token>`.' },
            nguoiDung: ref('NguoiDung')
        }
    },
    DangKyInput: {
        type: 'object', required: ['hoTen', 'email', 'soDienThoai', 'matKhau'],
        properties: {
            hoTen: { type: 'string', minLength: 2, example: 'Nguyễn Văn An' },
            email: { type: 'string', format: 'email', example: 'an.nguyen@gmail.com' },
            soDienThoai: { type: 'string', pattern: '^0\\d{9}$', description: 'Số điện thoại Việt Nam 10 số', example: '0901234567' },
            matKhau: { type: 'string', format: 'password', minLength: 8, maxLength: 72, description: 'Từ 8 đến 72 ký tự, phải chứa cả chữ cái và chữ số.', example: 'MatKhau@2026' }
        }
    },
    DiaChiInput: {
        type: 'object',
        properties: {
            id: { type: 'string' }, hoTen: { type: 'string' }, soDienThoai: { type: 'string' }, diaChiChiTiet: { type: 'string' },
            tinhThanh: { type: 'string' }, quanHuyen: { type: 'string' }, phuongXa: { type: 'string' },
            macDinh: { type: 'boolean' }, loaiDiaChi: { type: 'string', enum: ['nha_rieng', 'van_phong'] }
        }
    },

    // ---- Sản phẩm
    TuyChonPhienBan: {
        type: 'object',
        properties: {
            ma_tuy_chon: { type: 'string', example: 'ram32' }, ten_tuy_chon: { type: 'string', example: '32GB / 1TB' },
            ram: { type: 'string' }, o_cung: { type: 'string' }, chenh_lech_gia: { type: 'number', example: 2500000 }, hinh_anh: { type: 'string' }
        }
    },
    SanPham: {
        type: 'object',
        properties: {
            id: { type: 'string', description: 'Mã định danh nghiệp vụ (không phải `_id` của MongoDB)' },
            slug: { type: 'string', description: 'Đường dẫn thân thiện, tự sinh từ tên sản phẩm' },
            ma_san_pham: { type: 'string', description: 'SKU' }, ten_san_pham: { type: 'string' },
            hang_san_xuat: { type: 'string', description: 'Thương hiệu, viết thường (asus, msi, lenovo...)' },
            danh_muc: { type: 'array', items: { type: 'string' } },
            gia_goc: { type: 'number' }, gia_khuyen_mai: { type: 'number', description: 'Giá bán hiện tại (VNĐ)' },
            phan_tram_giam_gia: { type: 'number' }, hinh_anh_chinh: { type: 'string' },
            thu_vien_hinh_anh: { type: 'array', items: { type: 'string' } }, video_demo: { type: 'string' },
            thong_so: { type: 'object', additionalProperties: true, description: 'Thông số kỹ thuật tự do: cpu, ram, o_cung, card_do_hoa, man_hinh...' },
            tuy_chon_phien_ban: { type: 'array', items: ref('TuyChonPhienBan') },
            qua_tang: { type: 'array', items: { type: 'object', properties: { ten_qua_tang: { type: 'string' }, gia_tri: { type: 'number' } } } },
            ton_kho: { type: 'array', description: 'Tồn kho theo chi nhánh', items: { type: 'object', properties: { ten_chi_nhanh: { type: 'string' }, dia_chi: { type: 'string' }, so_dien_thoai: { type: 'string' }, so_luong_con: { type: 'integer' } } } },
            dac_diem_noi_bat: { type: 'array', items: { type: 'string' } }, mo_ta_chi_tiet: { type: 'string' },
            con_hang: { type: 'boolean' }, so_luong_ton_kho: { type: 'integer' }, so_luong_da_ban: { type: 'integer' },
            diem_danh_gia_tb: { type: 'number', minimum: 0, maximum: 5 }, so_luong_danh_gia: { type: 'integer' },
            la_flash_sale: { type: 'boolean' }, la_ban_chay: { type: 'boolean' }, la_san_pham_moi: { type: 'boolean' },
            ho_tro_tra_gop_0_phan_tram: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }, updatedAt: { type: 'string', format: 'date-time' }
        },
        example: vdSanPham
    },
    SanPhamInput: {
        type: 'object', required: ['id', 'ma_san_pham', 'ten_san_pham', 'hang_san_xuat', 'gia_khuyen_mai', 'hinh_anh_chinh'],
        description: 'Các trường còn lại của `SanPham` đều tùy chọn và có giá trị mặc định.',
        properties: {
            id: { type: 'string', example: 'sp-asus-rog-strix-g16' }, ma_san_pham: { type: 'string', example: 'G614JV-N4156W' },
            ten_san_pham: { type: 'string', example: 'Laptop ASUS ROG Strix G16 (2026)' }, hang_san_xuat: { type: 'string', example: 'asus' },
            danh_muc: { type: 'array', items: { type: 'string' }, example: ['gaming'] },
            gia_goc: { type: 'number', example: 42990000 }, gia_khuyen_mai: { type: 'number', example: 38990000 },
            hinh_anh_chinh: { type: 'string', example: '/images/sp/asus_rog_strix_g16.jpg' },
            thong_so: { type: 'object', additionalProperties: true, example: { cpu: 'Intel Core i7-13650HX', ram: '16GB DDR5', o_cung: '1TB SSD' } },
            so_luong_ton_kho: { type: 'integer', example: 12 }, la_flash_sale: { type: 'boolean' }, la_ban_chay: { type: 'boolean' }, la_san_pham_moi: { type: 'boolean' }
        },
        additionalProperties: true
    },
    DanhMuc: {
        type: 'object',
        properties: {
            id: { type: 'string', example: 'dm-asus' }, slug: { type: 'string', example: 'asus' }, ma_danh_muc: { type: 'string', example: 'asus' },
            ten_danh_muc: { type: 'string', example: 'ASUS' }, loai: { type: 'string', enum: ['thuong_hieu', 'nhu_cau', 'phan_khuc'] },
            logo: { type: 'string' }, mo_ta: { type: 'string' }, xuat_xu: { type: 'string', example: 'Chính Hãng' },
            kich_hoat: { type: 'boolean' }, thu_tu_hien_thi: { type: 'integer' }
        }
    },

    // ---- Đơn hàng
    ThongTinGiaoHang: {
        type: 'object', required: ['ho_ten', 'so_dien_thoai'],
        properties: {
            ho_ten: { type: 'string', example: 'Nguyễn Văn An' },
            so_dien_thoai: { type: 'string', pattern: '^(0|\\+84)[0-9]{9}$', example: '0901234567' },
            email: { type: 'string', format: 'email', description: 'Bỏ trống thì lấy email tài khoản' },
            dia_chi_chi_tiet: { type: 'string', example: '12 Trịnh Đình Thảo' }, phuong_xa: { type: 'string', example: 'Hòa Thạnh' },
            quan_huyen: { type: 'string', example: 'Tân Phú' }, tinh_thanh: { type: 'string', example: 'TP. Hồ Chí Minh' },
            ghi_chu: { type: 'string', maxLength: 500 }
        }
    },
    MucDonHang: {
        type: 'object', required: ['san_pham_id', 'so_luong'],
        description: 'Một dòng hàng trong đơn. **Giá được máy chủ tính lại từ database**, giá client gửi lên chỉ để tham khảo.',
        properties: {
            san_pham_id: { type: 'string', description: '`id` của sản phẩm', example: 'sp-asus-rog-strix-g16' },
            ten_san_pham: { type: 'string' }, hinh_anh: { type: 'string' },
            so_luong: { type: 'integer', minimum: 1, example: 1 },
            gia: { type: 'number' }, tong_tien_muc: { type: 'number' },
            tuy_chon_chon: { type: 'object', additionalProperties: true, description: 'Phiên bản cấu hình khách chọn (phải khớp `tuy_chon_phien_ban`)' }
        }
    },
    DonHangInput: {
        type: 'object', required: ['thong_tin_giao_hang', 'danh_sach_san_pham'],
        properties: {
            thong_tin_giao_hang: ref('ThongTinGiaoHang'),
            danh_sach_san_pham: { type: 'array', minItems: 1, items: ref('MucDonHang') },
            ma_giam_gia: { type: 'string', example: 'TNTP3TR', description: 'Máy chủ kiểm tra lại mã và tính tiền giảm' },
            hinh_thuc_thanh_toan: { type: 'string', enum: ['tien_mat_cod', 'chuyen_khoan_vietqr'], example: 'chuyen_khoan_vietqr' },
            phi_van_chuyen: { type: 'number', example: 0 }
        }
    },
    DonHang: {
        type: 'object',
        properties: {
            id: { type: 'string' }, ma_don_hang: { type: 'string', description: 'Mã tra cứu, dạng LPN-YYYY-xxxxxxxxxx' },
            id_nguoi_dung: { type: 'string' }, ngay_tao: { type: 'string' },
            trang_thai: { type: 'string', enum: ['cho_xac_nhan', 'da_xac_nhan', 'dang_giao', 'da_giao', 'da_huy'] },
            thong_tin_giao_hang: ref('ThongTinGiaoHang'),
            danh_sach_san_pham: { type: 'array', items: ref('MucDonHang') },
            tam_tinh: { type: 'number' }, tien_giam_gia: { type: 'number' }, ma_giam_gia: { type: 'string' },
            phi_van_chuyen: { type: 'number' }, tong_tien_thanh_toan: { type: 'number' },
            hinh_thuc_thanh_toan: { type: 'string' }, da_thanh_toan: { type: 'boolean' },
            trang_thai_thanh_toan: { type: 'string', enum: ['chua_thanh_toan', 'cho_thanh_toan', 'da_thanh_toan', 'that_bai', 'thanh_toan_khi_nhan_hang'] },
            payos_order_code: { type: 'integer', nullable: true }, noi_dung_chuyen_khoan: { type: 'string' },
            da_tru_ton_kho: { type: 'boolean', description: 'Tồn kho chỉ bị trừ khi đơn sang `da_giao`' },
            lich_trinh_giao_hang: { type: 'array', items: { type: 'object', properties: { thoi_gian: { type: 'string' }, tieu_de: { type: 'string' }, mo_ta_chi_tiet: { type: 'string' }, hoan_thanh: { type: 'boolean' } } } },
            createdAt: { type: 'string', format: 'date-time' }, updatedAt: { type: 'string', format: 'date-time' }
        },
        example: vdDonHang
    },
    DonHangCapNhat: {
        type: 'object',
        description: '**Khách hàng (chủ đơn):** chỉ được gửi `{"trang_thai":"da_huy"}` khi đơn còn `cho_xac_nhan`. **Admin:** được đổi trạng thái đơn / thanh toán.',
        properties: {
            trang_thai: { type: 'string', enum: ['cho_xac_nhan', 'da_xac_nhan', 'dang_giao', 'da_giao', 'da_huy'] },
            trang_thai_thanh_toan: { type: 'string', enum: ['chua_thanh_toan', 'cho_thanh_toan', 'da_thanh_toan', 'that_bai', 'thanh_toan_khi_nhan_hang'] },
            da_thanh_toan: { type: 'boolean' }
        }
    },

    // ---- Thanh toán
    ThanhToanLinkInput: {
        type: 'object', description: 'Cần ít nhất một trong hai trường.',
        properties: {
            ma_don_hang: { type: 'string', example: 'LPN-2026-0123454821' },
            id_don_hang: { type: 'string', example: 'dh-1759300000000-4821' }
        }
    },
    ThanhToanLink: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true }, orderCode: { type: 'integer', example: 1759300123456 },
            amount: { type: 'number', example: 35990000 }, description: { type: 'string', example: 'LPN20260123454821' },
            qrImageUrl: { type: 'string', format: 'uri', description: 'Ảnh QR VietQR để hiển thị' },
            checkoutUrl: { type: 'string', format: 'uri', description: 'Trang thanh toán PayOS' }, qrCode: { type: 'string' },
            thongTinNganHang: { type: 'object', properties: { nganHang: { type: 'string' }, bin: { type: 'string' }, soTaiKhoan: { type: 'string' }, tenChuTaiKhoan: { type: 'string' }, soTien: { type: 'number' }, noiDung: { type: 'string' } } },
            payosData: { type: 'object', additionalProperties: true }
        }
    },
    TrangThaiThanhToan: {
        type: 'object',
        properties: {
            success: { type: 'boolean' }, da_thanh_toan: { type: 'boolean' },
            status: { type: 'string', example: 'PAID', description: 'Trạng thái PayOS: PENDING, PAID, CANCELLED...' },
            amountPaid: { type: 'number' }, ma_don_hang: { type: 'string' }, fromCache: { type: 'boolean', description: 'Có khi kết quả lấy từ cache ngắn hạn' }
        }
    },
    PayosWebhook: {
        type: 'object', required: ['data', 'signature'],
        properties: {
            code: { type: 'string', example: '00' }, desc: { type: 'string', example: 'success' }, success: { type: 'boolean' },
            data: {
                type: 'object', additionalProperties: true,
                properties: { orderCode: { type: 'integer', example: 1759300123456 }, amount: { type: 'number', example: 35990000 }, code: { type: 'string', example: '00', description: '`00` = giao dịch thành công' } }
            },
            signature: { type: 'string', description: 'Chữ ký HMAC-SHA256 do PayOS tạo. Sai chữ ký trả 400.' }
        }
    },

    // ---- Mã giảm giá
    MaGiamGia: {
        type: 'object',
        properties: {
            id: { type: 'string' }, ma_code: { type: 'string', description: 'Tự động viết hoa', example: 'TNTP3TR' },
            tieu_de: { type: 'string', example: 'Giảm 3 triệu cho đơn từ 20 triệu' }, mo_ta: { type: 'string' },
            loai_giam: { type: 'string', enum: ['tien_mat', 'phan_tram'] }, gia_tri_giam: { type: 'number', example: 3000000 },
            giam_toi_da: { type: 'number', description: 'Trần giảm khi `loai_giam = phan_tram` (0 = không giới hạn)' },
            don_hang_toi_thieu: { type: 'number', example: 20000000 }, ngay_het_han: { type: 'string', example: '31/12/2026' },
            kich_hoat: { type: 'boolean' }, chuyen_muc: { type: 'string' }, so_luong_con_lai: { type: 'integer' },
            so_luong_phat_hanh: { type: 'integer' }, phan_tram_da_dung: { type: 'number' }, khung_gio_san: { type: 'string' },
            badge: { type: 'string' }, hot_deal: { type: 'boolean' }, mau_sac: { type: 'string' }
        }
    },
    MaGiamGiaInput: {
        type: 'object', required: ['ma_code', 'tieu_de', 'gia_tri_giam'],
        properties: {
            ma_code: { type: 'string', example: 'TNTP3TR' }, tieu_de: { type: 'string', example: 'Giảm 3 triệu cho đơn từ 20 triệu' },
            mo_ta: { type: 'string' }, loai_giam: { type: 'string', enum: ['tien_mat', 'phan_tram'], default: 'tien_mat' },
            gia_tri_giam: { type: 'number', example: 3000000 }, giam_toi_da: { type: 'number' },
            don_hang_toi_thieu: { type: 'number', example: 20000000 }, ngay_het_han: { type: 'string', example: '31/12/2026' },
            kich_hoat: { type: 'boolean', default: true }, so_luong_phat_hanh: { type: 'integer' }, so_luong_con_lai: { type: 'integer' }
        },
        additionalProperties: true
    },
    KiemTraMaInput: {
        type: 'object', required: ['ma_code', 'tong_tien_tam_tinh'],
        properties: { ma_code: { type: 'string', example: 'TNTP3TR' }, tong_tien_tam_tinh: { type: 'number', example: 25000000, description: 'Tổng tiền hàng trước giảm giá' } }
    },
    KetQuaKiemTraMa: {
        type: 'object',
        properties: {
            hop_le: { type: 'boolean' }, thong_diep: { type: 'string', example: 'Áp dụng thành công mã "TNTP3TR"! Giảm 3.000.000đ.' },
            so_tien_giam: { type: 'number', example: 3000000 }, ma_ap_dung: ref('MaGiamGia')
        }
    },

    // ---- Đánh giá
    DanhGia: {
        type: 'object',
        properties: {
            id: { type: 'string', example: 'dg-1759300000000' }, id_san_pham: { type: 'string' }, id_nguoi_dung: { type: 'string' },
            ho_ten: { type: 'string' }, ten_nguoi_dung: { type: 'string' }, avatar: { type: 'string' },
            so_sao: { type: 'integer', minimum: 1, maximum: 5 }, tieu_de: { type: 'string' }, noi_dung: { type: 'string' },
            hinh_anh_dinh_kem: { type: 'array', items: { type: 'string' } }, luot_thich: { type: 'integer' },
            ngay_danh_gia: { type: 'string' }, da_mua_hang: { type: 'boolean' }, thoi_gian_dung: { type: 'string' },
            ten_san_pham: { type: 'string' }, hinh_anh_san_pham: { type: 'string' }
        }
    },
    DanhGiaInput: {
        type: 'object', required: ['id_san_pham', 'so_sao', 'noi_dung'],
        properties: {
            id_san_pham: { type: 'string', example: 'sp-asus-rog-strix-g16' },
            so_sao: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            tieu_de: { type: 'string', maxLength: 120, example: 'Máy chạy mượt' },
            noi_dung: { type: 'string', maxLength: 1000, example: 'Chơi game ổn định, pin trâu, đáng tiền.' },
            hinh_anh_dinh_kem: { type: 'array', maxItems: 5, items: { type: 'string', format: 'uri' } },
            thoi_gian_dung: { type: 'string', maxLength: 80, example: 'Đã dùng 2 tuần' }
        }
    },

    // ---- Tin tức / liên hệ / cài đặt / bảo hành / AI
    TinTuc: {
        type: 'object',
        properties: {
            id: { type: 'string', example: 'tin-top-laptop-2026' }, slug: { type: 'string' }, tieu_de: { type: 'string' },
            tom_tat: { type: 'string' }, noi_dung: { type: 'string', description: 'HTML' }, hinh_anh: { type: 'string' },
            ngay_dang: { type: 'string' }, tac_gia: { type: 'string' }, chuyen_muc: { type: 'string' }, thoi_gian_doc: { type: 'string' },
            luot_xem: { type: 'integer' }, la_tieu_diem: { type: 'boolean' }, xuat_ban: { type: 'boolean', description: 'Bản nháp (`false`) chỉ Admin xem được' },
            tags: { type: 'array', items: { type: 'string' } }
        }
    },
    TinTucInput: {
        type: 'object', required: ['id', 'tieu_de', 'tom_tat'],
        properties: {
            id: { type: 'string', example: 'tin-top-laptop-2026' }, tieu_de: { type: 'string', example: 'Top laptop đáng mua 2026' },
            tom_tat: { type: 'string', example: 'Tổng hợp các mẫu laptop đáng mua nhất năm nay.' },
            noi_dung: { type: 'string', example: '<p>Nội dung bài viết...</p>' }, hinh_anh: { type: 'string' },
            chuyen_muc: { type: 'string', example: 'Tư Vấn Mua Sắm' }, tac_gia: { type: 'string' },
            la_tieu_diem: { type: 'boolean' }, xuat_ban: { type: 'boolean', default: true }, tags: { type: 'array', items: { type: 'string' } }
        }
    },
    LienHeInput: {
        type: 'object', required: ['ho_ten', 'so_dien_thoai', 'noi_dung'],
        properties: {
            ho_ten: { type: 'string', example: 'Nguyễn Văn An' },
            so_dien_thoai: { type: 'string', description: '10 số, đầu số 03/05/07/08/09', example: '0901234567' },
            email: { type: 'string', format: 'email', example: 'an.nguyen@gmail.com' },
            chu_de: { type: 'string', example: 'Tư vấn laptop đồ họa' },
            noi_dung: { type: 'string', example: 'Mình cần laptop dựng video dưới 30 triệu, nhờ tư vấn giúp.' }
        }
    },
    LienHe: {
        type: 'object',
        properties: {
            ma_yeu_cau: { type: 'string', example: 'LH-20261001-0001' }, ho_ten: { type: 'string' }, so_dien_thoai: { type: 'string' },
            email: { type: 'string' }, chu_de: { type: 'string' }, noi_dung: { type: 'string' },
            trang_thai: { type: 'string', enum: ['chua_xu_ly', 'dang_xu_ly', 'da_hoan_thanh', 'da_huy'] },
            ghi_chu_noi_bo: { type: 'string' }, nguon_tiep_nhan: { type: 'string' },
            ngay_tao: { type: 'string', format: 'date-time' }, ngay_cap_nhat: { type: 'string', format: 'date-time' }
        }
    },
    Showroom: {
        type: 'object', required: ['id', 'ten', 'dia_chi', 'vi_do', 'kinh_do'],
        properties: {
            id: { type: 'string', example: 'sr-tan-phu' }, ten: { type: 'string', example: 'TNTP Laptop Tân Phú' },
            dia_chi: { type: 'string', example: '12 Trịnh Đình Thảo, Hòa Thạnh, Tân Phú, TP.HCM' },
            hotline: { type: 'string', example: '1900.8946' }, hotline_di_dong: { type: 'string' }, gio_mo_cua: { type: 'string', example: '08:00 - 21:00' },
            vi_do: { type: 'number', example: 10.7769 }, kinh_do: { type: 'number', example: 106.6309 }, la_mac_dinh: { type: 'boolean' }
        }
    },
    KetQuaBaoHanh: {
        type: 'object',
        properties: {
            hop_le: { type: 'boolean' }, tong_so: { type: 'integer' },
            danh_sach: {
                type: 'array', items: {
                    type: 'object', properties: {
                        loai_tra_cuu: { type: 'string', example: 'don_hang' }, ma_don_hang: { type: 'string' }, so_serial: { type: 'string' },
                        ten_san_pham: { type: 'string' }, hang_san_xuat: { type: 'string' }, khach_hang: { type: 'string' },
                        so_dien_thoai: { type: 'string', description: 'Đã che bớt số' }, ngay_kich_hoat: { type: 'string' }, ngay_het_han: { type: 'string' },
                        thoi_gian_bao_hanh: { type: 'string', example: '24 Tháng Chính Hãng' }, con_hieu_luc: { type: 'boolean' },
                        so_thang_con_lai: { type: 'integer' }, trang_thai: { type: 'string' }
                    }
                }
            },
            thong_diep: { type: 'string' }
        }
    },
    AiChatInput: {
        type: 'object', required: ['tin_nhan'],
        properties: {
            tin_nhan: { type: 'string', example: 'Tư vấn laptop đồ họa dưới 25 triệu' },
            lich_su_chat: { type: 'array', description: 'Các lượt hội thoại trước đó (giữ ngữ cảnh)', items: { type: 'object', properties: { role: { type: 'string', enum: ['user', 'assistant'] }, content: { type: 'string' } } } }
        }
    },
    AiChatKetQua: {
        type: 'object',
        properties: {
            thanh_cong: { type: 'boolean', example: true },
            tra_loi: { type: 'string', description: 'Câu trả lời của trợ lý AI' },
            san_pham_goi_y: { type: 'array', description: 'Sản phẩm gợi ý kèm theo (nếu có)', items: ref('SanPham') }
        },
        additionalProperties: true
    }
};

// ---------------------------------------------------------------- Responses dùng chung
const responses = {
    YeuCauKhongHopLe: { description: '**400** – Dữ liệu gửi lên thiếu hoặc không hợp lệ.', content: json(ref('Loi'), { thong_diep: 'Vui lòng nhập đầy đủ Email và Mật khẩu!' }) },
    KhongXacThuc: { description: '**401** – Thiếu token, token sai/hết hạn, hoặc phiên đã bị thu hồi (đăng xuất / đổi mật khẩu / bị khóa).', content: json(ref('Loi'), { thong_diep: 'Vui lòng đăng nhập để thực hiện chức năng này (Thiếu Token xác thực)!' }) },
    KhongDuQuyen: { description: '**403** – Đã đăng nhập nhưng không đủ quyền (không phải Admin, hoặc không phải chủ sở hữu).', content: json(ref('Loi'), { thong_diep: 'Truy cập bị từ chối: Bạn không có quyền Quản trị viên (Admin) để thực hiện thao tác này!' }) },
    KhongTimThay: { description: '**404** – Không tìm thấy tài nguyên.', content: json(ref('Loi'), { thong_diep: 'Không tìm thấy sản phẩm với mã/id: abc' }) },
    XungDot: { description: '**409** – Dữ liệu đã tồn tại / xung đột.', content: json(ref('Loi'), { thong_diep: 'Sản phẩm đã tồn tại' }) },
    QuaNhieuYeuCau: { description: '**429** – Vượt giới hạn tần suất (rate limit). Header `Retry-After` cho biết thời gian chờ.', content: json(ref('Loi'), { thong_diep: 'Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.' }) },
    LoiMayChu: { description: '**500** – Lỗi nội bộ. Ở production không lộ chi tiết kỹ thuật.', content: json(ref('Loi'), { thong_diep: 'Đã xảy ra lỗi nội bộ trên máy chủ!' }) }
};

// ---------------------------------------------------------------- Tags
const tags = [
    { name: 'Xác thực & Tài khoản', description: 'Đăng ký (OTP email), đăng nhập, Google, quên / đổi mật khẩu, hồ sơ cá nhân. Token JWT lấy từ đây.' },
    { name: 'Sản phẩm', description: 'Danh sách / tìm kiếm / lọc laptop (công khai); thêm, sửa, xóa (Admin).' },
    { name: 'Danh mục', description: 'Thương hiệu, nhu cầu, phân khúc.' },
    { name: 'Đơn hàng', description: 'Đặt hàng, lịch sử, tra cứu, hủy đơn, quản trị trạng thái. Tồn kho được trừ/hoàn tự động theo trạng thái.' },
    { name: 'Thanh toán', description: 'PayOS / VietQR: tạo mã QR, kiểm tra trạng thái, nhận webhook.' },
    { name: 'Mã giảm giá', description: 'Kiểm tra voucher, ví voucher cá nhân, quản trị voucher.' },
    { name: 'Đánh giá', description: 'Đánh giá sản phẩm (chỉ người đã mua và nhận hàng mới được gửi).' },
    { name: 'Người dùng', description: 'Quản trị tài khoản (Admin): xem, tạo, khóa/mở khóa, xóa.' },
    { name: 'Tin tức', description: 'Bài viết công nghệ. Bản nháp chỉ Admin thấy.' },
    { name: 'Bảo hành', description: 'Tra cứu bảo hành điện tử theo serial / mã đơn.' },
    { name: 'Liên hệ', description: 'Phiếu yêu cầu tư vấn từ khách; Admin xử lý.' },
    { name: 'Cài đặt', description: 'Cấu hình hệ thống showroom.' },
    { name: 'Trợ lý AI', description: 'Chatbot tư vấn laptop (Gemini / 9Router) có dự phòng nhiều tầng.' },
    { name: 'Hệ thống', description: 'Kiểm tra sức khỏe máy chủ.' }
];

// ---------------------------------------------------------------- Paths
const T = {
    auth: 'Xác thực & Tài khoản', sp: 'Sản phẩm', dm: 'Danh mục', dh: 'Đơn hàng', tt: 'Thanh toán', mgg: 'Mã giảm giá',
    dg: 'Đánh giá', nd: 'Người dùng', tin: 'Tin tức', bh: 'Bảo hành', lh: 'Liên hệ', cd: 'Cài đặt', ai: 'Trợ lý AI', ht: 'Hệ thống'
};
const phanHoiOtp = (vd) => ok('Đã gửi mã OTP tới email', { type: 'object', properties: { thong_diep: { type: 'string' }, email: { type: 'string' } } }, vd);

const paths = {
    // ============================================================ HỆ THỐNG
    '/': {
        get: op({
            tag: T.ht, summary: 'Thông tin máy chủ', description: 'Trả về tên, phiên bản và danh sách endpoint chính.',
            responses: { 200: ok('Máy chủ đang hoạt động', { type: 'object', properties: { thong_diep: { type: 'string' }, phien_ban: { type: 'string' }, mo_hinh: { type: 'string' }, co_so_du_lieu: { type: 'string' }, cac_endpoint_chinh: { type: 'array', items: { type: 'string' } } } }, { thong_diep: '🚀 LaptopNew Express API Server (Bảo mật JWT + RBAC) đang hoạt động!', phien_ban: '1.1.0', co_so_du_lieu: 'MongoDB Atlas', cac_endpoint_chinh: ['/api/auth/dang-nhap', '/api/san-pham'] }) }
        })
    },
    '/api/health': {
        get: op({
            tag: T.ht, summary: 'Health check', description: 'Dùng cho giám sát / load balancer.',
            responses: { 200: ok('Máy chủ khỏe', { type: 'object', properties: { trang_thai: { type: 'string', example: 'OK' }, thoi_gian: { type: 'string', format: 'date-time' } } }, { trang_thai: 'OK', thoi_gian: '2026-10-01T13:00:00.000Z' }) }
        })
    },

    // ============================================================ AUTH
    '/api/auth/dang-ky': {
        post: op({
            tag: T.auth, summary: 'Đăng ký tài khoản (gửi OTP)', rate: '30 lần / 15 phút / IP',
            description: 'Tạo bản ghi **tạm** và gửi mã OTP 6 số về email (hết hạn sau 10 phút). Tài khoản chỉ được tạo thật sau khi gọi `POST /api/auth/kich-hoat`. Mật khẩu và OTP được **băm** trước khi lưu.',
            requestBody: body(ref('DangKyInput')),
            responses: {
                200: ok('Đã gửi OTP kích hoạt', { type: 'object', properties: { yeuCauOtp: { type: 'boolean', example: true }, email: { type: 'string' }, thong_diep: { type: 'string' } } }, { yeuCauOtp: true, email: 'an.nguyen@gmail.com', thong_diep: 'Mã xác thực kích hoạt tài khoản đã được gửi đến email an.nguyen@gmail.com. Vui lòng kiểm tra hộp thư!' }),
                400: ok('Thiếu trường, email/SĐT sai định dạng, mật khẩu yếu hoặc email đã đăng ký', ref('Loi')),
                502: ok('Không gửi được email OTP', ref('Loi'))
            }
        })
    },
    '/api/auth/kich-hoat': {
        post: op({
            tag: T.auth, summary: 'Kích hoạt tài khoản bằng OTP', rate: '30 lần / 15 phút / IP',
            description: 'Xác thực OTP nhận qua email. Nhập sai **5 lần** thì mã bị hủy, phải đăng ký lại. Thành công trả luôn JWT (tự đăng nhập).',
            requestBody: body({ type: 'object', required: ['email', 'otp'], properties: { email: { type: 'string', format: 'email' }, otp: { type: 'string', example: '482913' } } }, { email: 'an.nguyen@gmail.com', otp: '482913' }),
            responses: {
                200: ok('Kích hoạt thành công', ref('PhienDangNhap')),
                400: ok('OTP sai (kèm số lần còn lại) / hết hạn / đã kích hoạt', ref('Loi'), { thong_diep: 'Mã OTP không chính xác! Bạn còn 4 lần thử.' }),
                404: ok('Không có đăng ký nào cho email này', ref('Loi'))
            }
        })
    },
    '/api/auth/gui-otp': {
        post: op({
            tag: T.auth, summary: 'Gửi lại OTP', rate: '6 lần / 15 phút / IP',
            description: 'Gửi lại mã OTP (kích hoạt hoặc quên mật khẩu). Luôn trả thông báo trung tính, **không tiết lộ** email có tồn tại hay không.',
            requestBody: body({ type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email' } } }, { email: 'an.nguyen@gmail.com' }),
            responses: { 200: phanHoiOtp({ thong_diep: 'Nếu email tồn tại trong hệ thống, mã xác thực sẽ được gửi đến hộp thư.' }), 400: loi(400) }
        })
    },
    '/api/auth/dang-nhap': {
        post: op({
            tag: T.auth, summary: 'Đăng nhập bằng email / mật khẩu', rate: '30 lần / 15 phút / IP',
            description: 'Trả về JWT. **Chống dò mật khẩu:** sai 5 lần liên tiếp thì tài khoản bị khóa đăng nhập tạm 15 phút (`429`). Thông báo sai tài khoản và sai mật khẩu **giống hệt nhau** để chống dò email.\n\nSau khi đăng nhập, bấm **Authorize** và dán `token`.',
            requestBody: body({ type: 'object', required: ['email', 'matKhau'], properties: { email: { type: 'string', format: 'email' }, matKhau: { type: 'string', format: 'password' } } }, { email: 'an.nguyen@gmail.com', matKhau: 'MatKhau@2026' }),
            responses: {
                200: ok('Đăng nhập thành công', ref('PhienDangNhap'), { thong_diep: 'Đăng nhập thành công! Xin chào Nguyễn Văn An.', token: vdToken, nguoiDung: vdNguoiDung }),
                400: ok('Thiếu email hoặc mật khẩu', ref('Loi')),
                401: ok('Sai tài khoản hoặc mật khẩu', ref('Loi'), { thong_diep: 'Tài khoản hoặc Mật khẩu không chính xác!' }),
                403: ok('Tài khoản bị khóa hoặc chưa kích hoạt', ref('Loi')),
                429: ok('Bị tạm khóa do sai mật khẩu nhiều lần, hoặc vượt rate limit', ref('Loi'), { thong_diep: 'Bạn đã nhập sai mật khẩu 5 lần. Tài khoản tạm khóa đăng nhập 15 phút để bảo vệ.' })
            }
        })
    },
    '/api/auth/google': {
        post: op({
            tag: T.auth, summary: 'Đăng nhập bằng Google', rate: '30 lần / 15 phút / IP',
            description: 'Gửi **một trong hai**: `credential` (Google ID Token) hoặc `accessToken`. Backend **tự xác minh với Google** (chữ ký, audience, email đã xác minh) trước khi cấp JWT; không tin dữ liệu client gửi lên. Lần đầu sẽ tự tạo tài khoản.',
            requestBody: body({ type: 'object', properties: { credential: { type: 'string', description: 'Google ID Token (JWT)' }, accessToken: { type: 'string', description: 'Google OAuth Access Token' } } }, { credential: 'eyJhbGciOiJSUzI1NiIs...' }),
            responses: { 200: ok('Đăng nhập Google thành công', ref('PhienDangNhap')), 400: ok('Thiếu credential', ref('Loi')), 401: ok('Token Google không hợp lệ / email chưa xác minh', ref('Loi')), 403: ok('Tài khoản bị khóa', ref('Loi')) }
        })
    },
    '/api/auth/dang-xuat': {
        post: op({
            tag: T.auth, summary: 'Đăng xuất (thu hồi phiên)', auth: 'user',
            description: 'Tăng `tokenVersion` phía server → **mọi token cũ của tài khoản này lập tức vô hiệu** (kể cả token chưa hết hạn).',
            responses: { 200: ok('Đã thu hồi phiên', { type: 'object', properties: { thanh_cong: { type: 'boolean' }, thong_diep: { type: 'string' } } }, { thanh_cong: true, thong_diep: 'Đăng xuất và thu hồi phiên thành công!' }) }
        })
    },
    '/api/auth/toi': {
        get: op({
            tag: T.auth, summary: 'Xem hồ sơ của tôi', auth: 'user',
            responses: { 200: ok('Thông tin tài khoản đang đăng nhập', { type: 'object', properties: { thong_diep: { type: 'string' }, nguoiDung: ref('NguoiDung') } }) }
        })
    },
    '/api/auth/cap-nhat-ho-so': {
        put: op({
            tag: T.auth, summary: 'Cập nhật hồ sơ cá nhân', auth: 'user',
            description: 'Chỉ nhận các trường: `hoTen`, `soDienThoai`, `avatar`, `gioiTinh`, `ngaySinh`, `danhSachDiaChi` (tối đa 10). **Mọi trường khác bị bỏ qua** – gửi `vaiTro: "admin"` không nâng được quyền (chống Mass Assignment).',
            requestBody: body({
                type: 'object', properties: {
                    hoTen: { type: 'string', minLength: 2 }, soDienThoai: { type: 'string' }, avatar: { type: 'string', format: 'uri' },
                    gioiTinh: { type: 'string', enum: ['nam', 'nu', 'khac'] }, ngaySinh: { type: 'string', example: '2002-05-20' },
                    danhSachDiaChi: { type: 'array', maxItems: 10, items: ref('DiaChiInput') }
                }
            }, { hoTen: 'Nguyễn Văn An', soDienThoai: '0901234567', gioiTinh: 'nam', ngaySinh: '2002-05-20' }),
            responses: { 200: ok('Đã cập nhật', { type: 'object', properties: { thong_diep: { type: 'string' }, nguoiDung: ref('NguoiDung') } }), 400: loi(400), 404: loi(404) }
        })
    },
    '/api/auth/quen-mat-khau': {
        post: op({
            tag: T.auth, summary: 'Quên mật khẩu – gửi OTP', rate: '6 lần / 15 phút / IP',
            description: 'Gửi OTP đặt lại mật khẩu. Luồng: `quen-mat-khau` → `xac-nhan-otp` → `dat-lai-mat-khau`.',
            requestBody: body({ type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email' } } }, { email: 'an.nguyen@gmail.com' }),
            responses: { 200: phanHoiOtp({ thong_diep: 'Mã OTP đã được gửi đến email an.nguyen@gmail.com!' }), 400: loi(400), 502: ok('Không gửi được email', ref('Loi')) }
        })
    },
    '/api/auth/xac-nhan-otp': {
        post: op({
            tag: T.auth, summary: 'Xác nhận OTP quên mật khẩu', rate: '30 lần / 15 phút / IP',
            description: 'Kiểm tra OTP còn hợp lệ trước khi cho đặt mật khẩu mới. Sai 5 lần → mã bị hủy.',
            requestBody: body({ type: 'object', required: ['email', 'otp'], properties: { email: { type: 'string', format: 'email' }, otp: { type: 'string' } } }, { email: 'an.nguyen@gmail.com', otp: '482913' }),
            responses: { 200: ok('OTP hợp lệ', { type: 'object', properties: { hopLe: { type: 'boolean' }, thong_diep: { type: 'string' } } }, { hopLe: true, thong_diep: 'Xác thực mã OTP thành công! Mời bạn đặt mật khẩu mới.' }), 400: ok('OTP sai / hết hạn', ref('Loi')) }
        })
    },
    '/api/auth/dat-lai-mat-khau': {
        post: op({
            tag: T.auth, summary: 'Đặt lại mật khẩu bằng OTP', rate: '30 lần / 15 phút / IP',
            description: 'Đặt mật khẩu mới (8–72 ký tự, gồm chữ và số). Thành công sẽ **thu hồi mọi phiên đăng nhập cũ**.',
            requestBody: body({ type: 'object', required: ['email', 'otp', 'matKhauMoi'], properties: { email: { type: 'string', format: 'email' }, otp: { type: 'string' }, matKhauMoi: { type: 'string', format: 'password' } } }, { email: 'an.nguyen@gmail.com', otp: '482913', matKhauMoi: 'MatKhauMoi@2026' }),
            responses: { 200: ok('Đã đặt lại mật khẩu', { type: 'object', properties: { thong_diep: { type: 'string' } } }), 400: ok('OTP sai / hết hạn / mật khẩu yếu', ref('Loi')) }
        })
    },
    '/api/auth/doi-mat-khau/gui-otp': {
        post: op({
            tag: T.auth, summary: 'Đổi mật khẩu – bước 1: gửi OTP', auth: 'user', rate: '6 lần / 15 phút / IP',
            description: 'Tài khoản đã có mật khẩu phải nhập `matKhauCu` đúng mới được gửi OTP. Tài khoản Google (chưa có mật khẩu) bỏ trống.',
            requestBody: body({ type: 'object', properties: { matKhauCu: { type: 'string', format: 'password' } } }, { matKhauCu: 'MatKhau@2026' }),
            responses: { 200: ok('Đã gửi OTP', { type: 'object', properties: { thanhCong: { type: 'boolean' }, thong_diep: { type: 'string' }, email: { type: 'string' } } }), 400: ok('Mật khẩu cũ sai', ref('Loi')), 404: loi(404), 502: ok('Không gửi được email', ref('Loi')) }
        })
    },
    '/api/auth/doi-mat-khau': {
        put: op({
            tag: T.auth, summary: 'Đổi mật khẩu – bước 2: xác nhận', auth: 'user',
            description: 'Gửi OTP nhận được cùng mật khẩu mới. Thành công trả **token mới** (các token cũ bị thu hồi).',
            requestBody: body({ type: 'object', required: ['matKhauMoi', 'otp'], properties: { matKhauMoi: { type: 'string', format: 'password' }, otp: { type: 'string' }, matKhauCu: { type: 'string', format: 'password' } } }, { matKhauMoi: 'MatKhauMoi@2026', otp: '482913', matKhauCu: 'MatKhau@2026' }),
            responses: { 200: ok('Đã đổi mật khẩu', { type: 'object', properties: { thanhCong: { type: 'boolean' }, token: { type: 'string' }, thong_diep: { type: 'string' } } }), 400: ok('OTP sai / mật khẩu yếu / mật khẩu cũ sai', ref('Loi')), 404: loi(404) }
        })
    },

    // ============================================================ SẢN PHẨM
    '/api/san-pham': {
        get: op({
            tag: T.sp, summary: 'Danh sách / tìm kiếm / lọc sản phẩm',
            description: 'Công khai, có `Cache-Control` 60 giây. Trả về **mảng** sản phẩm (tối đa 200 bản ghi mỗi lần). Từ khóa tìm kiếm được escape để chống ReDoS.',
            params: [
                query('tu_khoa', 'Tìm theo tên, mã, hãng, CPU, card đồ họa (hỗ trợ cả `q`)', { type: 'string' }, 'rtx'),
                query('hang_san_xuat', 'Lọc theo hãng, nhiều hãng cách nhau dấu phẩy', { type: 'string' }, 'asus,msi'),
                query('danh_muc', 'Lọc theo danh mục, nhiều giá trị cách nhau dấu phẩy', { type: 'string' }, 'gaming'),
                query('gia_min', 'Giá khuyến mãi tối thiểu (VNĐ)', { type: 'number' }, 15000000),
                query('gia_max', 'Giá khuyến mãi tối đa (VNĐ)', { type: 'number' }, 30000000),
                query('flash_sale', 'Chỉ lấy sản phẩm Flash Sale', { type: 'boolean' }),
                query('ban_chay', 'Chỉ lấy sản phẩm bán chạy', { type: 'boolean' }),
                query('moi_nhat', 'Chỉ lấy sản phẩm mới', { type: 'boolean' }),
                query('sap_xep', 'Cách sắp xếp', { type: 'string', enum: ['gia_tang_dan', 'gia_giam_dan', 'ban_chay_nhat', 'danh_gia_cao', 'moi_nhat'] }),
                query('limit', 'Số bản ghi tối đa (1–200)', { type: 'integer', minimum: 1, maximum: 200 }, 8)
            ],
            responses: { 200: ok('Danh sách sản phẩm', { type: 'array', items: ref('SanPham') }, [vdSanPham]) }
        }),
        post: op({
            tag: T.sp, summary: 'Thêm sản phẩm', auth: 'admin',
            requestBody: body(ref('SanPhamInput'), { id: 'sp-asus-rog-strix-g16', ma_san_pham: 'G614JV-N4156W', ten_san_pham: 'Laptop ASUS ROG Strix G16 (2026)', hang_san_xuat: 'asus', danh_muc: ['gaming'], gia_goc: 42990000, gia_khuyen_mai: 38990000, hinh_anh_chinh: '/images/sp/asus_rog_strix_g16.jpg', thong_so: { cpu: 'Intel Core i7-13650HX', ram: '16GB DDR5', o_cung: '1TB SSD' }, so_luong_ton_kho: 12 }),
            responses: { 201: ok('Đã tạo sản phẩm', ref('SanPham')), 400: loi(400), 409: loi('XungDot') }
        })
    },
    '/api/san-pham/{id}': {
        get: op({
            tag: T.sp, summary: 'Chi tiết sản phẩm',
            description: 'Tra theo `id`, `slug` hoặc `_id` (hoặc khớp tên).',
            params: [pathId('id', 'id / slug của sản phẩm', 'sp-asus-rog-strix-g16')],
            responses: { 200: ok('Chi tiết sản phẩm', ref('SanPham')), 404: loi(404) }
        }),
        put: op({
            tag: T.sp, summary: 'Cập nhật sản phẩm', auth: 'admin',
            params: [pathId('id', 'id của sản phẩm', 'sp-asus-rog-strix-g16')],
            requestBody: body({ type: 'object', additionalProperties: true, description: 'Các trường cần đổi (một phần của `SanPham`)' }, { gia_khuyen_mai: 37990000, so_luong_ton_kho: 10 }),
            responses: { 200: ok('Sản phẩm sau khi cập nhật', ref('SanPham')), 404: loi(404) }
        }),
        delete: op({
            tag: T.sp, summary: 'Xóa sản phẩm', auth: 'admin',
            params: [pathId('id', 'id của sản phẩm', 'sp-asus-rog-strix-g16')],
            responses: { 200: ok('Đã xóa', { type: 'object', properties: { thong_diep: { type: 'string' }, id: { type: 'string' } } }, { thong_diep: 'Đã xóa sản phẩm thành công', id: 'sp-asus-rog-strix-g16' }), 404: loi(404) }
        })
    },

    // ============================================================ DANH MỤC
    '/api/danh-muc': {
        get: op({
            tag: T.dm, summary: 'Danh sách danh mục / thương hiệu',
            params: [query('loai', 'Lọc theo loại', { type: 'string', enum: ['thuong_hieu', 'nhu_cau', 'phan_khuc'] }, 'thuong_hieu')],
            responses: { 200: ok('Danh sách (sắp theo `thu_tu_hien_thi`)', { type: 'array', items: ref('DanhMuc') }) }
        }),
        post: op({
            tag: T.dm, summary: 'Thêm danh mục', auth: 'admin',
            requestBody: body({ type: 'object', required: ['ma_danh_muc', 'ten_danh_muc'], properties: { id: { type: 'string' }, ma_danh_muc: { type: 'string' }, ten_danh_muc: { type: 'string' }, loai: { type: 'string', enum: ['thuong_hieu', 'nhu_cau', 'phan_khuc'] }, logo: { type: 'string' }, mo_ta: { type: 'string' }, thu_tu_hien_thi: { type: 'integer' } } }, { ma_danh_muc: 'acer', ten_danh_muc: 'Acer', loai: 'thuong_hieu', thu_tu_hien_thi: 5 }),
            responses: { 201: ok('Đã tạo', ref('DanhMuc')), 400: loi(400), 409: loi('XungDot') }
        })
    },
    '/api/danh-muc/{id}': {
        put: op({
            tag: T.dm, summary: 'Sửa danh mục', auth: 'admin', params: [pathId('id', 'id danh mục', 'dm-acer')],
            requestBody: body({ type: 'object', additionalProperties: true }, { ten_danh_muc: 'Acer Việt Nam', kich_hoat: true }),
            responses: { 200: ok('Danh mục sau khi sửa', ref('DanhMuc')), 400: loi(400), 404: loi(404) }
        }),
        delete: op({
            tag: T.dm, summary: 'Xóa danh mục', auth: 'admin', params: [pathId('id', 'id danh mục', 'dm-acer')],
            responses: { 200: ok('Đã xóa', { type: 'object', properties: { thong_diep: { type: 'string' }, id: { type: 'string' } } }), 404: loi(404) }
        })
    },

    // ============================================================ ĐƠN HÀNG
    '/api/don-hang': {
        get: op({
            tag: T.dh, summary: 'Danh sách đơn hàng', auth: 'user',
            description: '**Khách hàng:** chỉ thấy đơn của chính mình (cách ly dữ liệu theo token). **Admin:** thấy tất cả, có thể lọc theo tài khoản.',
            params: [
                query('trang_thai', 'Lọc theo trạng thái (`tat_ca` = bỏ lọc)', { type: 'string', enum: ['tat_ca', 'cho_xac_nhan', 'da_xac_nhan', 'dang_giao', 'da_giao', 'da_huy'] }),
                query('id_nguoi_dung', '*(Admin)* Lọc theo tài khoản'), query('email', '*(Admin)* Lọc theo email nhận hàng'), query('sdt', '*(Admin)* Lọc theo SĐT nhận hàng')
            ],
            responses: { 200: ok('Danh sách đơn, mới nhất trước', { type: 'array', items: ref('DonHang') }, [vdDonHang]) }
        }),
        post: op({
            tag: T.dh, summary: 'Tạo đơn hàng', auth: 'user',
            description: 'Máy chủ **tự tính lại toàn bộ tiền** từ giá trong database (không tin giá client), kiểm tra tồn kho, tùy chọn cấu hình và mã giảm giá. Tồn kho **chưa bị trừ** lúc này; chỉ trừ khi Admin chuyển đơn sang `da_giao`. Sau khi tạo: gửi email xác nhận và thông báo Telegram cho Admin duyệt.\n\nNếu chọn `chuyen_khoan_vietqr`, gọi tiếp `POST /api/thanh-toan/tao-link` để lấy mã QR.',
            requestBody: body(ref('DonHangInput'), { thong_tin_giao_hang: { ho_ten: 'Nguyễn Văn An', so_dien_thoai: '0901234567', email: 'an.nguyen@gmail.com', dia_chi_chi_tiet: '12 Trịnh Đình Thảo', phuong_xa: 'Hòa Thạnh', quan_huyen: 'Tân Phú', tinh_thanh: 'TP. Hồ Chí Minh', ghi_chu: 'Giao giờ hành chính' }, danh_sach_san_pham: [{ san_pham_id: 'sp-asus-rog-strix-g16', so_luong: 1 }], ma_giam_gia: 'TNTP3TR', hinh_thuc_thanh_toan: 'chuyen_khoan_vietqr' }),
            responses: { 201: ok('Đã tạo đơn', ref('DonHang')), 400: ok('SĐT sai, sản phẩm hết hàng / không đủ tồn kho, mã giảm giá không hợp lệ...', ref('Loi'), { thong_diep: 'Sản phẩm "Laptop ASUS ROG Strix G16" không đủ tồn kho.' }) }
        })
    },
    '/api/don-hang/{id}': {
        get: op({
            tag: T.dh, summary: 'Tra cứu đơn theo mã', auth: 'optional', rate: '30 lần / 10 phút / IP',
            description: 'Tra theo `ma_don_hang`, `id`, `payos_order_code` hoặc `_id`.\n\n- **Chủ đơn / Admin** (có token): xem đầy đủ.\n- **Khách vãng lai:** bắt buộc kèm `sdt` **đúng** số đặt hàng, và dữ liệu cá nhân bị **che** (chống IDOR / dò mã đơn).\n- Token của người khác → `403`.',
            params: [pathId('id', 'Mã đơn hàng hoặc id', 'LPN-2026-0123454821'), query('sdt', 'SĐT đặt hàng (bắt buộc với khách chưa đăng nhập)', { type: 'string' }, '0901234567')],
            responses: { 200: ok('Chi tiết đơn (đầy đủ hoặc đã che tùy người xem)', ref('DonHang')), 403: ok('Thiếu / sai SĐT xác minh, hoặc không phải đơn của bạn', ref('Loi'), { thong_diep: 'Vui lòng nhập đúng số điện thoại đặt hàng để tra cứu đơn này.' }), 404: loi(404) }
        }),
        put: op({
            tag: T.dh, summary: 'Cập nhật trạng thái đơn / hủy đơn', auth: 'user',
            description: '**Khách (chủ đơn):** chỉ được gửi `trang_thai = da_huy` khi đơn đang `cho_xac_nhan`. Tự đánh dấu "đã thanh toán" bị `403`.\n\n**Admin:** chuyển trạng thái `da_xac_nhan` → `dang_giao` → `da_giao`. Tồn kho **tự động trừ** khi sang `da_giao` (tăng `so_luong_da_ban`) và **hoàn lại** khi hủy đơn đã trừ kho.',
            params: [pathId('id', 'Mã đơn hàng hoặc id', 'LPN-2026-0123454821')],
            requestBody: body(ref('DonHangCapNhat'), { trang_thai: 'da_xac_nhan' }),
            responses: { 200: ok('Đơn sau khi cập nhật', ref('DonHang')), 400: loi(400), 403: ok('Không phải chủ đơn / khách cố đổi trạng thái không được phép', ref('Loi')), 404: loi(404) }
        }),
        delete: op({
            tag: T.dh, summary: 'Xóa đơn hàng', auth: 'admin', description: 'Nếu đơn đã trừ kho thì **hoàn kho** trước khi xóa.',
            params: [pathId('id', 'Mã đơn hàng hoặc id', 'LPN-2026-0123454821')],
            responses: { 200: ok('Đã xóa', { type: 'object', properties: { thong_diep: { type: 'string' }, ma_don_hang: { type: 'string' } } }), 404: loi(404) }
        })
    },

    // ============================================================ THANH TOÁN
    '/api/thanh-toan/tao-link': {
        post: op({
            tag: T.tt, summary: 'Tạo mã QR / link thanh toán PayOS', auth: 'user', rate: '20 lần / 15 phút / IP',
            description: 'Tạo yêu cầu thanh toán cho đơn của **chính bạn**. Trả về ảnh QR VietQR, link PayOS và thông tin chuyển khoản. Số tiền lấy từ đơn trong database. Alias: `/api/thanh-toan/tao_link`.',
            requestBody: body(ref('ThanhToanLinkInput'), { ma_don_hang: 'LPN-2026-0123454821' }),
            responses: { 200: ok('Đã tạo link thanh toán', ref('ThanhToanLink')), 400: ok('Thiếu mã đơn, đơn đã hủy, số tiền không hợp lệ', ref('LoiThanhToan')), 403: ok('Không phải đơn của bạn', ref('LoiThanhToan')), 404: ok('Không tìm thấy đơn', ref('LoiThanhToan')), 409: ok('Đơn đã được thanh toán', ref('LoiThanhToan'), { success: false, message: 'Đơn hàng này đã được thanh toán.' }), 500: ok('Lỗi máy chủ / PayOS', ref('LoiThanhToan')) }
        })
    },
    '/api/thanh-toan/kiem-tra/{orderCode}': {
        get: op({
            tag: T.tt, summary: 'Kiểm tra trạng thái thanh toán', rate: '60 lần / phút / IP',
            description: 'Front-end gọi định kỳ (polling) sau khi hiện QR. Nếu PayOS báo đã thanh toán, đơn **tự chuyển** sang `da_xac_nhan` + `da_thanh_toan`. Có cache ngắn hạn để giảm tải. Alias: `/api/thanh-toan/kiem_tra/{orderCode}`.',
            params: [pathId('orderCode', 'Mã giao dịch PayOS (`orderCode` từ tao-link)', '1759300123456')],
            responses: { 200: ok('Trạng thái thanh toán', ref('TrangThaiThanhToan'), { success: true, da_thanh_toan: true, status: 'PAID', amountPaid: 35990000, ma_don_hang: 'LPN-2026-0123454821' }), 400: ok('Thiếu orderCode', ref('LoiThanhToan')), 500: ok('Lỗi kiểm tra', ref('LoiThanhToan')) }
        })
    },
    '/api/thanh-toan/webhook': {
        post: op({
            tag: T.tt, summary: 'Webhook PayOS (máy chủ PayOS gọi)',
            description: 'Endpoint dành cho **PayOS gọi vào**, không dùng từ giao diện. Chữ ký `signature` (HMAC-SHA256) được kiểm tra bằng `PAYOS_CHECKSUM_KEY`; sai chữ ký → `400`. Số tiền phải khớp đơn. Xử lý idempotent (gọi lặp không gây lỗi). Mã đơn không tồn tại (ví dụ webhook thử khi lưu URL trên PayOS) vẫn trả `200` để PayOS chấp nhận URL. Alias: `/api/thanh-toan/payos-webhook`.',
            requestBody: body(ref('PayosWebhook'), { code: '00', desc: 'success', success: true, data: { orderCode: 1759300123456, amount: 35990000, code: '00' }, signature: 'chu-ky-gia-se-bi-tu-choi' }),
            responses: { 200: ok('Đã nhận / đã xử lý', { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' } } }, { success: true, message: 'Webhook processed successfully' }), 400: ok('Thiếu dữ liệu / chữ ký sai / giao dịch không thành công / sai số tiền', ref('LoiThanhToan'), { success: false, message: 'Chữ ký không hợp lệ' }), 500: ok('Lỗi xử lý', ref('LoiThanhToan')) }
        })
    },

    // ============================================================ MÃ GIẢM GIÁ
    '/api/ma-giam-gia': {
        get: op({
            tag: T.mgg, summary: 'Danh sách mã giảm giá',
            params: [query('kich_hoat', 'Chỉ lấy mã đang bật', { type: 'boolean' }, true)],
            responses: { 200: ok('Danh sách voucher', { type: 'array', items: ref('MaGiamGia') }) }
        }),
        post: op({
            tag: T.mgg, summary: 'Thêm mã giảm giá', auth: 'admin',
            requestBody: body(ref('MaGiamGiaInput'), { ma_code: 'TNTP3TR', tieu_de: 'Giảm 3 triệu cho đơn từ 20 triệu', loai_giam: 'tien_mat', gia_tri_giam: 3000000, don_hang_toi_thieu: 20000000, ngay_het_han: '31/12/2026', so_luong_phat_hanh: 500 }),
            responses: { 201: ok('Đã tạo', ref('MaGiamGia')), 400: ok('Mã đã tồn tại / dữ liệu sai', ref('Loi')) }
        })
    },
    '/api/ma-giam-gia/kiem-tra': {
        post: op({
            tag: T.mgg, summary: 'Kiểm tra & tính tiền giảm của mã', rate: '40 lần / 10 phút / IP',
            description: 'Dùng ở giỏ hàng. **Luôn** trả `hop_le` + `so_tien_giam`; khi mã sai vẫn có body để hiển thị thông báo.',
            requestBody: body(ref('KiemTraMaInput'), { ma_code: 'TNTP3TR', tong_tien_tam_tinh: 25000000 }),
            responses: {
                200: ok('Mã hợp lệ', ref('KetQuaKiemTraMa')),
                400: ok('Mã rỗng hoặc đơn chưa đạt giá trị tối thiểu', ref('KetQuaKiemTraMa'), { hop_le: false, thong_diep: 'Đơn hàng tối thiểu phải từ 20.000.000đ để áp dụng mã này.', so_tien_giam: 0 }),
                404: ok('Mã không tồn tại / hết hạn', ref('KetQuaKiemTraMa'), { hop_le: false, thong_diep: 'Mã giảm giá không tồn tại hoặc đã hết hạn sử dụng.', so_tien_giam: 0 })
            }
        })
    },
    '/api/ma-giam-gia/luu-ma': {
        post: op({
            tag: T.mgg, summary: 'Lưu voucher vào ví', auth: 'user',
            description: 'Lưu mã vào `viVoucher` của tài khoản và giảm `so_luong_con_lai` (thao tác nguyên tử, tránh vượt số lượng phát hành).',
            requestBody: body({ type: 'object', required: ['ma_code'], properties: { ma_code: { type: 'string', example: 'TNTP3TR' } } }, { ma_code: 'TNTP3TR' }),
            responses: { 200: ok('Đã lưu (hoặc đã có sẵn trong ví)', { type: 'object', properties: { thanhCong: { type: 'boolean' }, da_luu: { type: 'boolean' }, thong_diep: { type: 'string' }, ma_code: { type: 'string' }, viVoucher: { type: 'array', items: { type: 'string' } }, voucher: ref('MaGiamGia') } }), 400: ok('Thiếu mã', ref('LoiThanhCong')), 404: ok('Mã không tồn tại / hết hạn', ref('LoiThanhCong')), 409: ok('Mã đã hết lượt lưu', ref('LoiThanhCong')) }
        })
    },
    '/api/ma-giam-gia/vi-cua-toi': {
        get: op({
            tag: T.mgg, summary: 'Ví voucher của tôi', auth: 'user',
            responses: { 200: ok('Các voucher đã lưu', { type: 'object', properties: { thanhCong: { type: 'boolean' }, danhSachMa: { type: 'array', items: { type: 'string' } }, vouchers: { type: 'array', items: ref('MaGiamGia') } } }), 404: ok('Không tìm thấy tài khoản', ref('LoiThanhCong')) }
        })
    },
    '/api/ma-giam-gia/{id}': {
        put: op({
            tag: T.mgg, summary: 'Cập nhật / tắt mã giảm giá', auth: 'admin', params: [pathId('id', 'id hoặc `ma_code` của voucher', 'TNTP3TR')],
            requestBody: body({ type: 'object', additionalProperties: true }, { kich_hoat: false }),
            responses: { 200: ok('Voucher sau cập nhật', ref('MaGiamGia')), 400: loi(400), 404: loi(404) }
        }),
        delete: op({
            tag: T.mgg, summary: 'Xóa mã giảm giá', auth: 'admin', params: [pathId('id', 'id hoặc `ma_code` của voucher', 'TNTP3TR')],
            responses: { 200: ok('Đã xóa', { type: 'object', properties: { thong_diep: { type: 'string' }, ma_code: { type: 'string' } } }), 404: loi(404) }
        })
    },

    // ============================================================ ĐÁNH GIÁ
    '/api/danh-gia': {
        get: op({
            tag: T.dg, summary: 'Đánh giá theo sản phẩm (query)',
            description: 'Tương đương `GET /api/danh-gia/{productId}`; truyền `id_san_pham` qua query.',
            params: [query('id_san_pham', 'id của sản phẩm', { type: 'string' }, 'sp-asus-rog-strix-g16')],
            responses: { 200: ok('Danh sách đánh giá', { type: 'array', items: ref('DanhGia') }) }
        }),
        post: op({
            tag: T.dg, summary: 'Gửi đánh giá mới', auth: 'user', rate: '8 lần / giờ / IP',
            description: 'Chỉ tài khoản **đã mua và nhận hàng** (`da_giao`) sản phẩm đó mới được đánh giá, mỗi người **một lần** cho mỗi sản phẩm. Sau khi gửi, điểm trung bình và số lượt đánh giá của sản phẩm được tính lại.',
            requestBody: body(ref('DanhGiaInput'), { id_san_pham: 'sp-asus-rog-strix-g16', so_sao: 5, tieu_de: 'Máy chạy mượt', noi_dung: 'Chơi game ổn định, pin trâu, đáng tiền.' }),
            responses: { 201: ok('Đã gửi đánh giá', ref('DanhGia')), 400: ok('Thiếu sản phẩm / nội dung hoặc số sao ngoài 1–5', ref('Loi')), 403: ok('Chưa mua / chưa nhận sản phẩm', ref('Loi'), { thong_diep: 'Chỉ tài khoản đã mua và nhận sản phẩm này mới được gửi đánh giá.' }), 409: ok('Đã đánh giá rồi', ref('Loi')) }
        })
    },
    '/api/danh-gia/{productId}': {
        get: op({
            tag: T.dg, summary: 'Đánh giá của một sản phẩm',
            params: [pathId('productId', 'id của sản phẩm', 'sp-asus-rog-strix-g16')],
            responses: { 200: ok('Danh sách đánh giá', { type: 'array', items: ref('DanhGia') }) }
        })
    },
    '/api/danh-gia/{id}/thich': {
        patch: op({
            tag: T.dg, summary: 'Thích một đánh giá', rate: '30 lần / phút / IP',
            description: 'Tăng `luot_thich` thêm 1. Không cần đăng nhập.',
            params: [pathId('id', 'id của đánh giá', 'dg-1759300000000')],
            responses: { 200: ok('Đánh giá sau khi cập nhật', ref('DanhGia')), 404: loi(404) }
        })
    },

    // ============================================================ NGƯỜI DÙNG (ADMIN)
    '/api/nguoi-dung': {
        get: op({
            tag: T.nd, summary: 'Danh sách người dùng', auth: 'admin',
            params: [query('email', 'Tìm theo email', { type: 'string', format: 'email' })],
            responses: { 200: ok('Danh sách (đã loại mật khẩu / OTP)', { type: 'array', items: ref('NguoiDung') }) }
        }),
        post: op({
            tag: T.nd, summary: 'Tạo tài khoản', auth: 'admin',
            description: 'Mật khẩu được **băm bcrypt** trước khi lưu và phải đủ mạnh.',
            requestBody: body({ type: 'object', required: ['hoTen', 'email', 'matKhau'], properties: { hoTen: { type: 'string' }, email: { type: 'string', format: 'email' }, matKhau: { type: 'string', format: 'password' }, soDienThoai: { type: 'string' }, vaiTro: { type: 'string', enum: ['khach_hang', 'admin'] } } }, { hoTen: 'Trần Thị Bình', email: 'binh.tran@gmail.com', matKhau: 'MatKhau@2026', soDienThoai: '0912345678', vaiTro: 'khach_hang' }),
            responses: { 201: ok('Đã tạo', ref('NguoiDung')), 400: ok('Thiếu trường / email sai / mật khẩu yếu / email trùng', ref('Loi')) }
        })
    },
    '/api/nguoi-dung/{id}': {
        put: op({
            tag: T.nd, summary: 'Cập nhật / khóa / mở khóa tài khoản', auth: 'admin',
            description: 'Khóa tài khoản bằng `biKhoa: true` (kèm `lyDoKhoa`) → token hiện có của người đó **bị thu hồi ngay**. Admin không thể tự khóa hoặc tự hạ quyền chính mình.',
            params: [pathId('id', 'id hoặc email của người dùng', 'usr_1759300000000_482')],
            requestBody: body({ type: 'object', additionalProperties: true, properties: { hoTen: { type: 'string' }, soDienThoai: { type: 'string' }, vaiTro: { type: 'string', enum: ['khach_hang', 'admin'] }, biKhoa: { type: 'boolean' }, lyDoKhoa: { type: 'string' }, matKhau: { type: 'string', format: 'password' } } }, { biKhoa: true, lyDoKhoa: 'Vi phạm điều khoản sử dụng' }),
            responses: { 200: ok('Tài khoản sau cập nhật', ref('NguoiDung')), 400: ok('Dữ liệu sai / tự khóa mình / mật khẩu yếu', ref('Loi')), 404: loi(404) }
        }),
        delete: op({
            tag: T.nd, summary: 'Xóa tài khoản', auth: 'admin', params: [pathId('id', 'id hoặc email của người dùng', 'usr_1759300000000_482')],
            responses: { 200: ok('Đã xóa', { type: 'object', properties: { thong_diep: { type: 'string' }, email: { type: 'string' } } }), 400: ok('Không thể tự xóa chính mình', ref('Loi')), 404: loi(404) }
        })
    },

    // ============================================================ TIN TỨC
    '/api/tin-tuc': {
        get: op({
            tag: T.tin, summary: 'Danh sách tin tức', auth: 'optional',
            description: 'Khách chỉ thấy bài đã xuất bản. Admin thêm `tat_ca=true` để xem cả bản nháp.',
            params: [query('chuyen_muc', 'Lọc theo chuyên mục'), query('q', 'Tìm theo tiêu đề / tóm tắt', { type: 'string' }, 'laptop'), query('la_tieu_diem', 'Chỉ bài tiêu điểm', { type: 'boolean' }), query('tat_ca', '*(Admin)* gồm cả bản nháp', { type: 'boolean' })],
            responses: { 200: ok('Danh sách bài viết', { type: 'object', properties: { thanhCong: { type: 'boolean' }, duLieu: { type: 'array', items: ref('TinTuc') } } }), 500: ok('Lỗi máy chủ', ref('LoiTinTuc')) }
        }),
        post: op({
            tag: T.tin, summary: 'Thêm bài viết', auth: 'admin',
            requestBody: body(ref('TinTucInput'), { id: 'tin-top-laptop-2026', tieu_de: 'Top laptop đáng mua 2026', tom_tat: 'Tổng hợp các mẫu laptop đáng mua nhất năm nay.', noi_dung: '<p>Nội dung bài viết...</p>', chuyen_muc: 'Tư Vấn Mua Sắm' }),
            responses: { 201: ok('Đã tạo', { type: 'object', properties: { thanhCong: { type: 'boolean' }, thongBao: { type: 'string' }, duLieu: ref('TinTuc') } }), 500: ok('Lỗi / dữ liệu sai', ref('LoiTinTuc')) }
        })
    },
    '/api/tin-tuc/{id}': {
        get: op({
            tag: T.tin, summary: 'Chi tiết bài viết', auth: 'optional', description: 'Tra theo `id` hoặc `slug`.',
            params: [pathId('id', 'id hoặc slug của bài viết', 'tin-top-laptop-2026')],
            responses: { 200: ok('Chi tiết bài viết', { type: 'object', properties: { thanhCong: { type: 'boolean' }, duLieu: ref('TinTuc') } }), 404: ok('Không tìm thấy (hoặc là bản nháp)', ref('LoiTinTuc')) }
        }),
        put: op({
            tag: T.tin, summary: 'Sửa bài viết', auth: 'admin', params: [pathId('id', 'id hoặc slug', 'tin-top-laptop-2026')],
            requestBody: body(ref('TinTucInput'), { tieu_de: 'Top laptop đáng mua 2026 (cập nhật)', xuat_ban: true }),
            responses: { 200: ok('Đã cập nhật', { type: 'object', properties: { thanhCong: { type: 'boolean' }, thongBao: { type: 'string' }, duLieu: ref('TinTuc') } }), 404: ok('Không tìm thấy', ref('LoiTinTuc')) }
        }),
        delete: op({
            tag: T.tin, summary: 'Xóa bài viết', auth: 'admin', params: [pathId('id', 'id hoặc slug', 'tin-top-laptop-2026')],
            responses: { 200: ok('Đã xóa', { type: 'object', properties: { thanhCong: { type: 'boolean' }, thongBao: { type: 'string' } } }), 404: ok('Không tìm thấy', ref('LoiTinTuc')) }
        })
    },

    // ============================================================ BẢO HÀNH
    '/api/bao-hanh/tra-cuu': {
        get: op({
            tag: T.bh, summary: 'Tra cứu bảo hành điện tử', rate: '30 lần / 15 phút / IP',
            description: 'Tra theo **số serial**, **mã đơn hàng** (`LPN-...`) hoặc **số điện thoại**. Tra bằng SĐT bắt buộc kèm `ma_don_hang` (bảo vệ thông tin khách). Từ khóa phải từ 3 ký tự. Số điện thoại trong kết quả được che bớt. Alias: `GET /api/bao-hanh`.',
            params: [query('tu_khoa', 'Serial / mã đơn / SĐT (hỗ trợ cả `q`)', { type: 'string', minLength: 3 }, 'LPN-2026-0123454821'), query('ma_don_hang', 'Mã đơn hàng xác minh (bắt buộc khi tra bằng SĐT)')],
            responses: { 200: ok('Kết quả (kể cả khi không tìm thấy: `hop_le = false`, `danh_sach = []`)', ref('KetQuaBaoHanh')), 403: ok('Tra bằng SĐT mà thiếu mã đơn hàng', ref('KetQuaBaoHanh'), { hop_le: false, thong_diep: 'Để bảo vệ thông tin khách hàng, tra cứu bằng số điện thoại cần nhập kèm mã đơn hàng.', yeu_cau_ma_don_hang: true, danh_sach: [] }) }
        })
    },

    // ============================================================ LIÊN HỆ
    '/api/lien-he': {
        post: op({
            tag: T.lh, summary: 'Gửi yêu cầu tư vấn', rate: '5 lần / giờ / IP',
            description: 'Khách để lại thông tin, hệ thống sinh `ma_yeu_cau` và lưu phiếu để nhân viên gọi lại.',
            requestBody: body(ref('LienHeInput'), { ho_ten: 'Nguyễn Văn An', so_dien_thoai: '0901234567', email: 'an.nguyen@gmail.com', chu_de: 'Tư vấn laptop đồ họa', noi_dung: 'Mình cần laptop dựng video dưới 30 triệu, nhờ tư vấn giúp.' }),
            responses: { 201: ok('Đã tiếp nhận', { type: 'object', properties: { thanh_cong: { type: 'boolean' }, thong_diep: { type: 'string' }, du_lieu: { type: 'object', properties: { ma_yeu_cau: { type: 'string' }, ho_ten: { type: 'string' }, so_dien_thoai: { type: 'string' }, chu_de: { type: 'string' }, ngay_tao: { type: 'string', format: 'date-time' } } } } }), 400: ok('Thiếu trường / SĐT hoặc email sai định dạng', ref('LoiThanhCong')), 500: ok('Lỗi lưu phiếu', ref('LoiThanhCong')) }
        }),
        get: op({
            tag: T.lh, summary: 'Danh sách phiếu liên hệ', auth: 'admin',
            params: [query('trang', 'Trang (bắt đầu từ 1)', { type: 'integer', default: 1 }), query('gioi_han', 'Số phiếu mỗi trang', { type: 'integer', default: 50 }), query('trang_thai', 'Lọc trạng thái', { type: 'string', enum: ['chua_xu_ly', 'dang_xu_ly', 'da_hoan_thanh', 'da_huy'] }), query('chu_de', 'Lọc theo chủ đề'), query('tu_khoa', 'Tìm theo tên / SĐT / nội dung')],
            responses: { 200: ok('Danh sách phân trang kèm thống kê', { type: 'object', properties: { thanh_cong: { type: 'boolean' }, du_lieu: { type: 'array', items: ref('LienHe') }, thong_ke: { type: 'object', properties: { tong_so: { type: 'integer' }, chua_xu_ly: { type: 'integer' }, dang_xu_ly: { type: 'integer' }, da_hoan_thanh: { type: 'integer' } } }, phan_trang: { type: 'object', properties: { tong_so: { type: 'integer' }, trang_hien_tai: { type: 'integer' }, tong_so_trang: { type: 'integer' } } } } }) }
        })
    },
    '/api/lien-he/{id}': {
        patch: op({
            tag: T.lh, summary: 'Cập nhật trạng thái phiếu', auth: 'admin', description: 'Cũng hỗ trợ `PUT` cùng ý nghĩa.',
            params: [pathId('id', '`_id` (MongoDB ObjectId) của phiếu', '66f1a2b3c4d5e6f708192a3b')],
            requestBody: body({ type: 'object', properties: { trang_thai: { type: 'string', enum: ['chua_xu_ly', 'dang_xu_ly', 'da_hoan_thanh', 'da_huy'] }, ghi_chu_noi_bo: { type: 'string' } } }, { trang_thai: 'dang_xu_ly', ghi_chu_noi_bo: 'Đã gọi lần 1, hẹn gọi lại chiều nay' }),
            responses: { 200: ok('Đã cập nhật', { type: 'object', properties: { thanh_cong: { type: 'boolean' }, thong_diep: { type: 'string' }, du_lieu: ref('LienHe') } }), 404: ok('Không tìm thấy phiếu', ref('LoiThanhCong')) }
        }),
        delete: op({
            tag: T.lh, summary: 'Xóa phiếu liên hệ', auth: 'admin', params: [pathId('id', '`_id` (MongoDB ObjectId) của phiếu', '66f1a2b3c4d5e6f708192a3b')],
            responses: { 200: ok('Đã xóa', { type: 'object', properties: { thanh_cong: { type: 'boolean' }, thong_diep: { type: 'string' } } }), 404: ok('Không tìm thấy phiếu', ref('LoiThanhCong')) }
        })
    },

    // ============================================================ CÀI ĐẶT
    '/api/cai-dat/showroom': {
        get: op({
            tag: T.cd, summary: 'Danh sách showroom',
            responses: { 200: ok('Danh sách showroom (dùng cho trang liên hệ / bản đồ)', { type: 'object', properties: { thanh_cong: { type: 'boolean' }, du_lieu: { type: 'array', items: ref('Showroom') } } }) }
        }),
        put: op({
            tag: T.cd, summary: 'Cập nhật danh sách showroom', auth: 'admin', description: 'Ghi đè toàn bộ danh sách showroom.',
            requestBody: body({ type: 'object', required: ['danh_sach_showroom'], properties: { danh_sach_showroom: { type: 'array', minItems: 1, items: ref('Showroom') } } }, { danh_sach_showroom: [{ id: 'sr-tan-phu', ten: 'TNTP Laptop Tân Phú', dia_chi: '12 Trịnh Đình Thảo, Hòa Thạnh, Tân Phú, TP.HCM', hotline: '1900.8946', gio_mo_cua: '08:00 - 21:00', vi_do: 10.7769, kinh_do: 106.6309, la_mac_dinh: true }] }),
            responses: { 200: ok('Đã lưu', { type: 'object', properties: { thanh_cong: { type: 'boolean' }, du_lieu: { type: 'array', items: ref('Showroom') } } }), 400: ok('Danh sách rỗng / không hợp lệ', ref('LoiThanhCong')) }
        })
    },
    '/api/cai-dat/showroom/khoi-phuc': {
        post: op({
            tag: T.cd, summary: 'Khôi phục showroom mặc định (đã ngừng)', auth: 'admin', deprecated: true,
            description: 'Không còn hoạt động: dữ liệu showroom do MongoDB quản lý, không có dữ liệu mẫu để khôi phục. Luôn trả `410 Gone`.',
            responses: { 410: ok('Đã ngừng hỗ trợ', ref('LoiThanhCong'), { thanh_cong: false, thong_diep: 'Dữ liệu showroom được quản lý trong MongoDB; không có dữ liệu mẫu để khôi phục.' }) }
        })
    },

    // ============================================================ TRỢ LÝ AI
    '/api/tro-ly-ai/chat': {
        post: op({
            tag: T.ai, summary: 'Chat với trợ lý AI (trả về một lần)', rate: '12 lần / phút / IP',
            description: 'Tư vấn laptop dựa trên **dữ liệu sản phẩm thật** trong kho. Có cơ chế dự phòng nhiều tầng (9Router → nhiều khóa Gemini) khi nhà cung cấp lỗi hoặc hết hạn mức. Gửi kèm `lich_su_chat` để AI nhớ ngữ cảnh. Alias: `POST /api/tro-ly-ai`.\n\n⚠️ Mỗi lần bấm *Try it out* sẽ gọi dịch vụ AI thật.',
            requestBody: body(ref('AiChatInput'), { tin_nhan: 'Tư vấn laptop đồ họa dưới 25 triệu', lich_su_chat: [] }),
            responses: { 200: ok('Câu trả lời của AI', ref('AiChatKetQua')), 400: ok('Tin nhắn rỗng', ref('LoiThanhCong')), 500: ok('Không kết nối được AI', ref('LoiThanhCong')) }
        })
    },
    '/api/tro-ly-ai/chat/stream': {
        post: op({
            tag: T.ai, summary: 'Chat với trợ lý AI (streaming NDJSON)', rate: '12 lần / phút / IP',
            description: 'Giống `/chat` nhưng trả về **luồng NDJSON** (mỗi dòng một JSON) để giao diện hiển thị chữ chạy dần:\n\n```\n{"type":"text","text":"Với ngân sách 25 triệu..."}\n{"type":"text","text":" bạn nên xem..."}\n{"type":"done","result":{"thanh_cong":true,...}}\n```\nLỗi giữa chừng: `{"type":"error","message":"..."}`.\n\n*Swagger UI không hiển thị tốt dạng stream; dùng Postman/curl để thử.*',
            requestBody: body(ref('AiChatInput'), { tin_nhan: 'Laptop gaming dưới 30 triệu', lich_su_chat: [] }),
            responses: { 200: { description: 'Luồng NDJSON', content: { 'application/x-ndjson': { schema: { type: 'string' }, example: '{"type":"text","text":"Với ngân sách 30 triệu..."}\n{"type":"done","result":{"thanh_cong":true}}' } } }, 400: ok('Tin nhắn rỗng', ref('LoiThanhCong')) }
        })
    },
    '/api/tro-ly-ai/trang-thai': {
        get: op({
            tag: T.ai, summary: 'Trạng thái dịch vụ AI', rate: '30 lần / phút / IP',
            description: 'Cho biết nhà cung cấp AI nào đang được cấu hình (9Router / Gemini). Không lộ khóa API.',
            responses: { 200: ok('Trạng thái', { type: 'object', properties: { thanh_cong: { type: 'boolean' }, du_lieu: { type: 'object', additionalProperties: true, properties: { nhaCungCapUuTien: { type: 'string', example: '9Router' }, nineRouter: { type: 'object', properties: { daCauHinh: { type: 'boolean' }, model: { type: 'string' } } }, gemini: { type: 'object', additionalProperties: true } } } } }) }
        })
    }
};

// ---------------------------------------------------------------- Spec
module.exports = {
    openapi: '3.0.3',
    info: {
        title: 'LaptopNew Backend API',
        version: '1.1.0',
        description: [
            'API Back-End cho website thương mại điện tử bán laptop **LaptopNew** — Node.js, Express 5, MongoDB Atlas (Mongoose), JWT.',
            '',
            '## Bắt đầu nhanh',
            '1. Gọi `POST /api/auth/dang-nhap` để lấy `token`.',
            '2. Bấm nút **Authorize** ở góc phải, dán token (không cần gõ chữ `Bearer`).',
            '3. Các API có biểu tượng 🔒 sẽ tự gửi kèm token.',
            '',
            '## Quy ước chung',
            '| Nội dung | Quy ước |',
            '|---|---|',
            '| Định dạng | JSON (`Content-Type: application/json`), tối đa **1MB** / request |',
            '| Xác thực | `Authorization: Bearer <JWT>`, hạn mặc định 7 ngày; đăng xuất / đổi mật khẩu / bị khóa sẽ **thu hồi** token ngay |',
            '| Phân quyền | `khach_hang` và `admin` (RBAC). Dữ liệu cá nhân (đơn hàng...) được cách ly theo chủ sở hữu |',
            '| Lỗi | `{ "thong_diep": "..." }` kèm mã HTTP chuẩn: 400, 401, 403, 404, 409, 429, 500 |',
            '| Giới hạn tần suất | Toàn cục **300 request / phút / IP**, thêm hạn mức riêng cho từng API nhạy cảm (ghi trong mô tả) |',
            '',
            '## Bảo mật',
            'Bám theo OWASP API Security Top 10 (2023): băm mật khẩu bcrypt, OTP băm HMAC-SHA256 và giới hạn số lần nhập, khóa đăng nhập khi dò mật khẩu, chống NoSQL Injection / ReDoS / Mass Assignment / IDOR, kiểm tra chữ ký webhook, HTTP security headers.',
            '',
            '> ⚠️ Các API gửi email (OTP), thanh toán PayOS và AI sẽ gọi **dịch vụ thật** khi bấm *Try it out*.'
        ].join('\n'),
        contact: { name: 'Nhóm sinh viên LaptopNew – Chuyên đề Back-End' }
    },
    servers: [{ url: '/', description: 'Máy chủ hiện tại — production: https://api.trikun.site (Railway + Cloudflare)' }],
    tags,
    paths,
    components: {
        securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'JWT nhận từ `POST /api/auth/dang-nhap` (hoặc `/kich-hoat`, `/google`).' }
        },
        schemas,
        responses
    }
};
