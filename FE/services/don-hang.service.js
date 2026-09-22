import { generateOrderId, taoMaDonHang, getCurrentDateTimeFormatted, layNgayGioHienTai } from '@/utils/generateOrderId';
import { apiFetch, API_BASE_URL } from './api-client';

const KHOA_LUU_TRU_DON_HANG = 'laptopnew_danh_sach_don_hang';

export const DonHangService = {
    /**
     * Tạo một đơn hàng mới, lưu vào MongoDB qua Express API và đồng bộ cục bộ
     */
    /**
     * Tạo một đơn hàng mới, lưu vào MongoDB qua Express API và đồng bộ cục bộ
     */
    async taoDonHang(thongTinHoacPayload, danhSachSanPham, tamTinh, tienGiamGia, maGiamGia, hinhThucThanhToan) {
        let donHangMoi;

        // Nếu truyền vào 1 object đơn hàng hoàn chỉnh (dành cho Admin)
        if (thongTinHoacPayload && typeof thongTinHoacPayload === 'object' && thongTinHoacPayload.thong_tin_giao_hang) {
            donHangMoi = {
                ...thongTinHoacPayload,
                id: thongTinHoacPayload.id || `dh-${Date.now()}`,
                ma_don_hang: thongTinHoacPayload.ma_don_hang || taoMaDonHang(),
                ngay_tao: thongTinHoacPayload.ngay_tao || layNgayGioHienTai(),
                tong_tien_thanh_toan: thongTinHoacPayload.tong_tien_thanh_toan !== undefined
                    ? thongTinHoacPayload.tong_tien_thanh_toan
                    : Math.max(0, (thongTinHoacPayload.tam_tinh || 0) - (thongTinHoacPayload.tien_giam_gia || 0))
            };
        } else {
            // Khi gọi từ trang Checkout phía khách hàng (6 tham số)
            const maDon = taoMaDonHang();
            const thoiGian = layNgayGioHienTai();
            const tongTien = Math.max(0, (tamTinh || 0) - (tienGiamGia || 0));

            const thongTinChuan = {
                ...thongTinHoacPayload,
                ho_ten: thongTinHoacPayload?.ho_ten || thongTinHoacPayload?.ho_va_ten || '',
                ho_va_ten: thongTinHoacPayload?.ho_va_ten || thongTinHoacPayload?.ho_ten || ''
            };

            // Chuẩn hóa danh sách sản phẩm đầy đủ đơn giá, thành tiền và ID chi tiết
            const danhSachChuanHoa = (danhSachSanPham || []).map((item) => {
                const sp = item.san_pham || {};
                const giaSP = item.gia_hien_tai || item.gia_tai_thoi_diem_them || sp.gia_khuyen_mai || sp.gia_goc || sp.gia || 0;
                const qty = item.so_luong || 1;
                const chenhLech = item.tuy_chon_chon?.chenh_lech_gia || 0;
                const donGia = giaSP + chenhLech;
                const tongTienMuc = item.tong_tien_muc || (donGia * qty);
                return {
                    ...item,
                    san_pham_id: item.san_pham_id || sp.id || sp._id || item.id || '',
                    ten_san_pham: item.ten_san_pham || sp.ten_san_pham || 'Laptop Chính Hãng',
                    hinh_anh: item.hinh_anh || sp.hinh_anh_chinh || sp.hinh_anh || '',
                    gia_tai_thoi_diem_them: donGia,
                    gia_hien_tai: donGia,
                    tong_tien_muc: tongTienMuc
                };
            });

            // Lấy ID người dùng đăng nhập nếu có
            let idNguoiDung = thongTinHoacPayload?.id_nguoi_dung || '';
            if (!idNguoiDung && typeof window !== 'undefined') {
                try {
                    const rawUser = localStorage.getItem('tnt_laptop_user') || localStorage.getItem('laptopnew_user') || localStorage.getItem('nguoi_dung') || localStorage.getItem('user');
                    if (rawUser) {
                        const parsed = JSON.parse(rawUser);
                        idNguoiDung = parsed.id || parsed._id || '';
                    }
                } catch {}
            }

            if (!idNguoiDung) {
                throw new Error('Quý khách vui lòng đăng nhập tài khoản trước khi đặt hàng!');
            }

            donHangMoi = {
                id: `dh-${Date.now()}`,
                ma_don_hang: maDon,
                id_nguoi_dung: idNguoiDung,
                ngay_tao: thoiGian,
                trang_thai: 'cho_xac_nhan',
                thong_tin_giao_hang: thongTinChuan,
                danh_sach_san_pham: danhSachChuanHoa,
                tam_tinh: tamTinh || 0,
                tien_giam_gia: tienGiamGia || 0,
                ma_giam_gia: maGiamGia || '',
                phi_van_chuyen: 0,
                tong_tien_thanh_toan: tongTien,
                hinh_thuc_thanh_toan: hinhThucThanhToan || 'chuyen_khoan_vietqr',
                da_thanh_toan: false,
                trang_thai_thanh_toan: hinhThucThanhToan === 'tien_mat_cod' ? 'thanh_toan_khi_nhan_hang' : 'cho_thanh_toan',
                lich_trinh_giao_hang: [
                    {
                        thoi_gian: thoiGian,
                        tieu_de: 'Đặt hàng thành công',
                        mo_ta_chi_tiet: 'Hệ thống đã tiếp nhận đơn hàng của quý khách.',
                        hoan_thanh: true
                    },
                    {
                        thoi_gian: 'Chờ xử lý',
                        tieu_de: 'Chờ xác nhận đơn hàng',
                        mo_ta_chi_tiet: 'Nhân viên kỹ thuật LaptopNew sẽ kiểm tra và xác nhận đơn hàng trong vòng 15 phút.',
                        hoan_thanh: false
                    },
                    {
                        thoi_gian: 'Dự kiến trong ngày',
                        tieu_de: 'Bàn giao đơn vị vận chuyển',
                        mo_ta_chi_tiet: 'Bàn giao đơn vị chuyển phát hỏa tốc Viettel Post / Giao hàng nhanh.',
                        hoan_thanh: false
                    },
                    {
                        thoi_gian: 'Dự kiến 1-2 ngày',
                        tieu_de: 'Giao hàng thành công',
                        mo_ta_chi_tiet: 'Quý khách kiểm tra máy trước khi thanh toán và nhận máy.',
                        hoan_thanh: false
                    }
                ]
            };
        }

        // 1. Lưu đồng bộ vào MongoDB qua apiFetch có gắn token
        try {
            const ketQuaServer = await apiFetch('/don-hang', {
                method: 'POST',
                body: JSON.stringify(donHangMoi)
            });
            if (ketQuaServer && ketQuaServer.ma_don_hang) {
                donHangMoi = ketQuaServer;
            }
        } catch (err) {
            if (err.status === 400 || err.status === 401 || err.status === 403) {
                throw err;
            }
            console.warn('⚠️ Lỗi kết nối Express API khi tạo đơn hàng, lưu an toàn vào LocalStorage:', err.message);
        }

        // 2. Lưu đồng thời vào LocalStorage để truy xuất tức thời
        if (typeof window !== 'undefined') {
            try {
                const danhSachHienTai = this.layTatCaDonHang();
                const idx = danhSachHienTai.findIndex(d => d.id === donHangMoi.id || d.ma_don_hang === donHangMoi.ma_don_hang);
                if (idx >= 0) {
                    danhSachHienTai[idx] = donHangMoi;
                } else {
                    danhSachHienTai.unshift(donHangMoi);
                }
                localStorage.setItem(KHOA_LUU_TRU_DON_HANG, JSON.stringify(danhSachHienTai));
            } catch (err) {
                console.error('Lỗi khi lưu đơn hàng LocalStorage:', err);
            }
        }
        return donHangMoi;
    },

    /**
     * Lấy danh sách tất cả các đơn hàng đã đặt (từ Express API Async)
     */
    async layTatCaDonHangAsync() {
        const local = this.layTatCaDonHang();
        try {
            const serverOrders = await apiFetch('/don-hang', { cache: 'no-store' }, local);
            if (Array.isArray(serverOrders) && serverOrders.length > 0) {
                if (typeof window !== 'undefined') {
                    try {
                        localStorage.setItem(KHOA_LUU_TRU_DON_HANG, JSON.stringify(serverOrders));
                    } catch {}
                }
                return serverOrders;
            }
            return local;
        } catch {
            return local;
        }
    },

    /**
     * Lấy danh sách đơn hàng của một người dùng cụ thể từ Server API (Async)
     */
    async layDonHangTheoNguoiDungAsync(idNguoiDung, email, sdt) {
        if (!idNguoiDung && !email && !sdt) return [];
        const params = new URLSearchParams();
        if (idNguoiDung) params.append('id_nguoi_dung', idNguoiDung);
        if (email) params.append('email', email.trim().toLowerCase());
        if (sdt) params.append('sdt', sdt.trim());

        try {
            const serverOrders = await apiFetch(`/don-hang?${params.toString()}`, { cache: 'no-store' });
            if (Array.isArray(serverOrders)) {
                return serverOrders;
            }
        } catch (err) {
            console.warn('[DonHangService] Lỗi lấy đơn hàng người dùng:', err.message);
        }

        // Fallback kiểm tra chặt chẽ nếu offline
        const local = this.layTatCaDonHang();
        const emailLower = email ? email.trim().toLowerCase() : '';
        const sdtTrim = sdt ? sdt.trim() : '';

        return local.filter(dh => {
            if (idNguoiDung && dh.id_nguoi_dung === idNguoiDung) return true;
            if (emailLower && dh.thong_tin_giao_hang?.email && dh.thong_tin_giao_hang.email.toLowerCase() === emailLower) return true;
            if (sdtTrim && dh.thong_tin_giao_hang?.so_dien_thoai && dh.thong_tin_giao_hang.so_dien_thoai === sdtTrim) return true;
            return false;
        });
    },

    /**
     * Lấy danh sách tất cả các đơn hàng đã đặt (Đồng bộ)
     */
    layTatCaDonHang() {
        if (typeof window === 'undefined')
            return [];
        try {
            const duLieu = localStorage.getItem(KHOA_LUU_TRU_DON_HANG);
            if (duLieu) {
                return JSON.parse(duLieu);
            }
        } catch (err) {
            console.error('Lỗi khi đọc đơn hàng:', err);
        }
        return [];
    },

    /**
     * Tra cứu đơn hàng theo Mã Đơn Hàng hoặc Số Điện Thoại
     */
    traCuuDonHang(maHoacSdt) {
        if (!maHoacSdt.trim())
            return [];
        const key = maHoacSdt.trim().toLowerCase();
        const tatCa = this.layTatCaDonHang();
        return tatCa.filter((dh) => dh.ma_don_hang.toLowerCase() === key ||
            dh.thong_tin_giao_hang.so_dien_thoai.includes(key));
    },

    /**
     * Cập nhật trạng thái / lịch trình đơn hàng (Dành cho Admin)
     */
    async capNhatDonHang(id, duLieuCapNhat) {
        let serverRes = null;
        try {
            serverRes = await apiFetch(`/don-hang/${id}`, {
                method: 'PUT',
                body: JSON.stringify(duLieuCapNhat)
            });
        } catch (err) {
            console.warn('[DonHangService] Lỗi kết nối Express API khi cập nhật đơn hàng:', err.message);
        }

        if (typeof window !== 'undefined') {
            try {
                const danhSachHienTai = this.layTatCaDonHang();
                const idx = danhSachHienTai.findIndex(d => d.id === id || d.ma_don_hang === id || d._id === id);
                if (idx >= 0) {
                    const donHangCu = danhSachHienTai[idx];
                    const donHangMoi = serverRes || { ...donHangCu, ...duLieuCapNhat };
                    danhSachHienTai[idx] = donHangMoi;
                    localStorage.setItem(KHOA_LUU_TRU_DON_HANG, JSON.stringify(danhSachHienTai));
                    return donHangMoi;
                }
            } catch (err) {
                console.error('Lỗi khi cập nhật đơn hàng LocalStorage:', err);
            }
        }

        return serverRes;
    },

    /**
     * Xóa đơn hàng (Dành cho Admin)
     */
    async xoaDonHang(id) {
        let serverRes = null;
        try {
            serverRes = await apiFetch(`/don-hang/${id}`, {
                method: 'DELETE'
            });
        } catch (err) {
            console.warn('[DonHangService] Lỗi kết nối Express API khi xóa đơn hàng:', err.message);
        }

        if (typeof window !== 'undefined') {
            try {
                const danhSachHienTai = this.layTatCaDonHang();
                const danhSachMoi = danhSachHienTai.filter(d => d.id !== id && d.ma_don_hang !== id && d._id !== id);
                localStorage.setItem(KHOA_LUU_TRU_DON_HANG, JSON.stringify(danhSachMoi));
            } catch (err) {
                console.error('Lỗi khi xóa đơn hàng LocalStorage:', err);
            }
        }

        return serverRes;
    }
};
