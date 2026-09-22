import { apiFetch } from './api-client';
import { taoSlug } from '@/utils/taoSlug';

// Bộ nhớ tạm chứa danh sách sản phẩm nạp từ MongoDB Atlas qua API
let boNhoDemSanPham = [];

// Khi chạy trên trình duyệt, tự động gọi backend lấy danh sách từ MongoDB Atlas
if (typeof window !== 'undefined') {
    apiFetch('/san-pham', { cache: 'default' })
        .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
                boNhoDemSanPham = data;
            }
        })
        .catch(() => { });
}

/**
 * Dịch vụ xử lý dữ liệu và truy vấn sản phẩm laptop kết nối Express API & MongoDB Atlas
 */
export const SanPhamService = {
    /**
     * Lấy toàn bộ danh sách laptop từ Express API (Async) có hỗ trợ bộ lọc
     * @param {Object} [boLoc] - Tham số lọc (tu_khoa, hang_san_xuat, danh_muc, gia_min, gia_max, flash_sale, ban_chay, sap_xep)
     * @returns {Promise<Array>}
     */
    async layTatCaSanPhamAsync(boLoc = {}) {
        let endpoint = '/san-pham';
        const params = new URLSearchParams();
        if (boLoc.tu_khoa) params.append('tu_khoa', boLoc.tu_khoa);
        if (boLoc.hang_san_xuat && boLoc.hang_san_xuat.length > 0) {
            params.append('hang_san_xuat', Array.isArray(boLoc.hang_san_xuat) ? boLoc.hang_san_xuat.join(',') : boLoc.hang_san_xuat);
        }
        if (boLoc.danh_muc && boLoc.danh_muc.length > 0) {
            params.append('danh_muc', Array.isArray(boLoc.danh_muc) ? boLoc.danh_muc.join(',') : boLoc.danh_muc);
        }
        if (boLoc.muc_gia_toi_thieu !== undefined) params.append('gia_min', boLoc.muc_gia_toi_thieu);
        if (boLoc.gia_min !== undefined) params.append('gia_min', boLoc.gia_min);
        if (boLoc.muc_gia_toi_da !== undefined) params.append('gia_max', boLoc.muc_gia_toi_da);
        if (boLoc.gia_max !== undefined) params.append('gia_max', boLoc.gia_max);
        if (boLoc.flash_sale) params.append('flash_sale', 'true');
        if (boLoc.ban_chay) params.append('ban_chay', 'true');
        if (boLoc.sap_xep) params.append('sap_xep', boLoc.sap_xep);
        if (boLoc.limit) params.append('limit', boLoc.limit);

        const queryString = params.toString();
        if (queryString) {
            endpoint += `?${queryString}`;
        }

        const data = await apiFetch(endpoint, { cache: 'no-store' });
        if (Array.isArray(data) && data.length > 0 && !queryString) {
            boNhoDemSanPham = data;
        }
        return Array.isArray(data) ? data : boNhoDemSanPham;
    },

    /**
     * Lấy toàn bộ danh sách laptop (Đồng bộ từ bộ nhớ đệm / Express API)
     */
    layTatCaSanPham() {
        // Lấy dữ liệu đang có trong bộ nhớ, không tạo request mới.
        return boNhoDemSanPham;
    },

    /**
     * Lấy thông tin chi tiết một laptop theo ID hoặc Mã SKU từ Express API (Async)
     */
    async laySanPhamTheoIdAsync(idHoacSku) {
        if (!idHoacSku) return null;
        const decoded = decodeURIComponent(String(idHoacSku)).trim();
        const slugKey = taoSlug(decoded);

        try {
            // 1. Thử gọi API với mã gốc / decoded
            let sp = await apiFetch(`/san-pham/${encodeURIComponent(decoded)}`, { cache: 'no-store' }).catch(() => null);

            // 2. Nếu chưa có, thử gọi bằng slug chuẩn hóa
            if (!sp && slugKey && slugKey !== decoded) {
                sp = await apiFetch(`/san-pham/${encodeURIComponent(slugKey)}`, { cache: 'no-store' }).catch(() => null);
            }

            if (sp && (sp.id || sp._id)) {
                const idx = boNhoDemSanPham.findIndex(item => item.id === sp.id || (item.ma_san_pham && item.ma_san_pham === sp.ma_san_pham));
                if (idx >= 0) {
                    boNhoDemSanPham[idx] = sp;
                } else {
                    boNhoDemSanPham.unshift(sp);
                }
                return sp;
            }
        } catch (err) {
            console.warn('[SanPhamService] Lỗi gọi API chi tiết sản phẩm:', err.message);
        }
        return this.laySanPhamTheoId(idHoacSku);
    },

    /**
     * Lấy thông tin chi tiết một laptop theo ID, Slug hoặc Mã SKU (Đồng bộ)
     */
    laySanPhamTheoId(idHoacSku) {
        if (!idHoacSku) return null;
        const rawKey = String(idHoacSku).trim();
        const decodedKey = decodeURIComponent(rawKey).trim();
        const slugKey = taoSlug(decodedKey);
        const lowerKey = decodedKey.toLowerCase();

        return boNhoDemSanPham.find((sp) => {
            if (!sp) return false;
            // 1. Khớp id hoặc _id
            if (sp.id === rawKey || sp.id === decodedKey || sp.id === slugKey) return true;
            if (sp._id === rawKey || sp._id === decodedKey) return true;
            // 2. Khớp slug
            if (sp.slug && (sp.slug === rawKey || sp.slug === decodedKey || sp.slug === slugKey)) return true;
            // 3. Khớp mã SKU
            if (sp.ma_san_pham && (sp.ma_san_pham.toLowerCase() === lowerKey || sp.ma_san_pham.toLowerCase() === rawKey.toLowerCase())) return true;
            // 4. Khớp theo slug tạo từ tên sản phẩm hoặc id
            if (sp.id && taoSlug(sp.id) === slugKey) return true;
            if (sp.ten_san_pham && taoSlug(sp.ten_san_pham) === slugKey) return true;
            // 5. Khớp gần đúng: nếu tất cả từ khóa trong query đều nằm trong tên sản phẩm
            const tuKhoas = lowerKey.split(/[\s-]+/).filter(w => w.length > 1);
            if (tuKhoas.length >= 2 && sp.ten_san_pham) {
                const tenLower = sp.ten_san_pham.toLowerCase();
                if (tuKhoas.every(tk => tenLower.includes(tk))) return true;
            }
            return false;
        });
    },

    /**
     * Lấy danh sách laptop thuộc Flash Sale giá sốc
     */
    layDanhSachFlashSale() {
        return boNhoDemSanPham.filter((sp) => sp.la_flash_sale);
    },

    /**
     * Lấy danh sách laptop Bán chạy nhất
     */
    layDanhSachBanChay(gioiHan = 8) {
        return boNhoDemSanPham
            .filter((sp) => sp.la_ban_chay)
            .sort((a, b) => (b.so_luong_da_ban || 0) - (a.so_luong_da_ban || 0))
            .slice(0, gioiHan);
    },

    /**
     * Lấy danh sách laptop Gaming hiệu năng cao
     */
    layDanhSachLaptopGaming(gioiHan = 8) {
        return boNhoDemSanPham.filter((sp) => (sp.danh_muc || []).includes('gaming')).slice(0, gioiHan);
    },

    /**
     * Lấy danh sách laptop Mỏng nhẹ / Doanh nhân / Văn phòng
     */
    layDanhSachLaptopVanPhong(gioiHan = 8) {
        return boNhoDemSanPham
            .filter((sp) => (sp.danh_muc || []).includes('van-phong-mong-nhe') || (sp.danh_muc || []).includes('doanh-nhan'))
            .slice(0, gioiHan);
    },

    /**
     * Lấy danh sách laptop theo danh mục nhu cầu
     */
    layDanhSachTheoDanhMuc(danhMuc, gioiHan = 12) {
        return boNhoDemSanPham.filter((sp) => (sp.danh_muc || []).includes(danhMuc)).slice(0, gioiHan);
    },

    /**
     * Lấy danh sách laptop AI PC (tích hợp NPU)
     */
    layDanhSachAIPC(gioiHan = 8) {
        return boNhoDemSanPham.filter((sp) => (sp.danh_muc || []).includes('ai-pc')).slice(0, gioiHan);
    },

    /**
     * Lấy danh sách sản phẩm tương tự / cùng phân khúc hoặc cùng hãng
     */
    laySanPhamTuongTu(idHienTai, gioiHan = 4) {
        const spHienTai = this.laySanPhamTheoId(idHienTai);
        if (!spHienTai)
            return boNhoDemSanPham.slice(0, gioiHan);
        return boNhoDemSanPham
            .filter((sp) => sp.id !== idHienTai &&
                (sp.hang_san_xuat === spHienTai.hang_san_xuat ||
                    ((sp.danh_muc || []).some((dm) => (spHienTai.danh_muc || []).includes(dm)))))
            .slice(0, gioiHan);
    },

    /**
     * Tìm kiếm gợi ý nhanh theo từ khóa
     */
    timKiemGoiYNhanh(tuKhoa, gioiHan = 6) {
        if (!tuKhoa || !tuKhoa.trim())
            return [];
        const key = tuKhoa.toLowerCase().trim();
        return boNhoDemSanPham
            .filter((sp) => (sp.ten_san_pham && sp.ten_san_pham.toLowerCase().includes(key)) ||
                (sp.ma_san_pham && sp.ma_san_pham.toLowerCase().includes(key)) ||
                (sp.hang_san_xuat && sp.hang_san_xuat.toLowerCase().includes(key)) ||
                (sp.thong_so?.cpu && sp.thong_so.cpu.toLowerCase().includes(key)) ||
                (sp.thong_so?.card_do_hoa && sp.thong_so.card_do_hoa.toLowerCase().includes(key)))
            .slice(0, gioiHan);
    },

    /**
     * Bộ lọc đa tiêu chí linh hoạt và sắp xếp
     */
    locSanPham(boLoc, danhSach = null) {
        let ketQua = [...(Array.isArray(danhSach) && danhSach.length > 0 ? danhSach : boNhoDemSanPham)];
        // 1. Lọc theo từ khóa tìm kiếm (An toàn tuyệt đối, không crash với phụ kiện hay linh kiện)
        if (boLoc.tu_khoa && boLoc.tu_khoa.trim()) {
            const key = boLoc.tu_khoa.toLowerCase().trim();
            ketQua = ketQua.filter((sp) => {
                if (!sp) return false;
                const ten = (sp.ten_san_pham || '').toLowerCase();
                const ma = (sp.ma_san_pham || '').toLowerCase();
                const hang = (sp.hang_san_xuat || '').toLowerCase();
                const ts = sp.thong_so || {};
                const cpu = (ts.cpu || '').toLowerCase();
                const vga = (ts.card_do_hoa || '').toLowerCase();
                const ram = (ts.ram || '').toLowerCase();
                const loaiLk = (ts.loai_linh_kien || '').toLowerCase();
                const dungLuong = (ts.dung_luong || '').toLowerCase();
                const switchKey = (ts.loai_switch || '').toLowerCase();
                const moTa = (sp.moTa || sp.mo_ta_chi_tiet || '').toLowerCase();
                return ten.includes(key) || ma.includes(key) || hang.includes(key) ||
                    cpu.includes(key) || vga.includes(key) || ram.includes(key) ||
                    loaiLk.includes(key) || dungLuong.includes(key) || switchKey.includes(key) || moTa.includes(key);
            });
        }
        // 2. Lọc theo hãng sản xuất
        if (boLoc.hang_san_xuat && boLoc.hang_san_xuat.length > 0) {
            ketQua = ketQua.filter((sp) => sp.hang_san_xuat && boLoc.hang_san_xuat.includes(sp.hang_san_xuat));
        }
        // 3. Lọc theo danh mục nhu cầu (Hỗ trợ alias linh hoạt giữa linh-kien và linh-kien-nang-cap, phu-kien-gear và tat-ca-phu-kien)
        if (boLoc.danh_muc && boLoc.danh_muc.length > 0) {
            const danhMucYeuCau = boLoc.danh_muc.flatMap(dm => {
                if (dm === 'linh-kien') return ['linh-kien', 'linh-kien-nang-cap'];
                if (dm === 'linh-kien-nang-cap') return ['linh-kien-nang-cap', 'linh-kien'];
                if (dm === 'phu-kien-gear' || dm === 'tat-ca-phu-kien') {
                    return ['phu-kien-gear', 'tat-ca-phu-kien', 'balo-tui-chong-soc', 'ban-phim-co', 'chuot-lot-chuot', 'tai-nghe-loa', 'sac-cap-hub', 'linh-kien-nang-cap', 'linh-kien', 'de-tan-gia-do'];
                }
                if (dm === 'tat-ca-laptop') {
                    return ['ai-pc', 'gaming', 'van-phong-mong-nhe', 'do-hoa-sang-tao', 'doanh-nhan', 'sinh-vien'];
                }
                return [dm];
            });
            ketQua = ketQua.filter((sp) => {
                const spCategories = Array.isArray(sp.danh_muc) ? sp.danh_muc : [];
                return spCategories.some((dm) => danhMucYeuCau.includes(dm));
            });
        }
        // 4. Lọc theo khoảng giá
        if (boLoc.muc_gia_toi_thieu !== undefined) {
            ketQua = ketQua.filter((sp) => sp.gia_khuyen_mai >= boLoc.muc_gia_toi_thieu);
        }
        if (boLoc.muc_gia_toi_da !== undefined) {
            ketQua = ketQua.filter((sp) => sp.gia_khuyen_mai <= boLoc.muc_gia_toi_da);
        }
        // 5. Lọc theo Card đồ họa
        if (boLoc.card_do_hoa && boLoc.card_do_hoa.length > 0) {
            ketQua = ketQua.filter((sp) => {
                const gpuStr = (sp.thong_so?.card_do_hoa || '').toLowerCase();
                return boLoc.card_do_hoa.some((gpu) => {
                    if (gpu === 'rtx_4090')
                        return gpuStr.includes('4090');
                    if (gpu === 'rtx_4080')
                        return gpuStr.includes('4080');
                    if (gpu === 'rtx_4070')
                        return gpuStr.includes('4070');
                    if (gpu === 'rtx_4060')
                        return gpuStr.includes('4060');
                    if (gpu === 'rtx_4050')
                        return gpuStr.includes('4050');
                    if (gpu === 'card_onboard')
                        return gpuStr.includes('arc') || gpuStr.includes('intel') || gpuStr.includes('gpu');
                    return true;
                });
            });
        }
        // 6. Lọc theo CPU
        if (boLoc.cpu_dong && boLoc.cpu_dong.length > 0) {
            ketQua = ketQua.filter((sp) => {
                const cpuStr = (sp.thong_so?.cpu || '').toLowerCase();
                return boLoc.cpu_dong.some((c) => {
                    if (c === 'core_ultra') return cpuStr.includes('ultra');
                    if (c === 'core_i9') return cpuStr.includes('i9');
                    if (c === 'core_i7') return cpuStr.includes('i7');
                    if (c === 'core_i5') return cpuStr.includes('i5');
                    if (c === 'ryzen') return cpuStr.includes('ryzen') || cpuStr.includes('amd');
                    if (c === 'apple_m') return cpuStr.includes('apple') || cpuStr.includes('m3') || cpuStr.includes('m2') || cpuStr.includes('m1');
                    return true;
                });
            });
        }
        // 7. Lọc theo RAM
        if (boLoc.ram_dung_luong && boLoc.ram_dung_luong.length > 0) {
            ketQua = ketQua.filter((sp) => {
                const ramStr = (sp.thong_so?.ram || '').toLowerCase();
                return boLoc.ram_dung_luong.some((r) => {
                    if (r === '16gb')
                        return ramStr.includes('16gb');
                    if (r === '32gb')
                        return ramStr.includes('32gb') || ramStr.includes('48gb');
                    if (r === '64gb')
                        return ramStr.includes('64gb') || ramStr.includes('128gb');
                    return true;
                });
            });
        }
        // 8. Lọc theo Tấm nền
        if (boLoc.tam_nen && boLoc.tam_nen.length > 0) {
            ketQua = ketQua.filter((sp) => sp.thong_so?.tam_nen && boLoc.tam_nen.includes(sp.thong_so.tam_nen));
        }
        // 9. Lọc theo Tần số quét
        if (boLoc.tan_so_quet && boLoc.tan_so_quet.length > 0) {
            ketQua = ketQua.filter((sp) => boLoc.tan_so_quet.includes(sp.thong_so?.tan_so_quet));
        }
        // 10. Lọc Trả góp 0%
        if (boLoc.ho_tro_tra_gop_0) {
            ketQua = ketQua.filter((sp) => sp.ho_tro_tra_gop_0_phan_tram);
        }
        // 11. Lọc Còn hàng
        if (boLoc.con_hang_san) {
            ketQua = ketQua.filter((sp) => sp.con_hang && sp.so_luong_ton_kho > 0);
        }
        // 11. Sắp xếp kết quả
        if (boLoc.sap_xep) {
            switch (boLoc.sap_xep) {
                case 'gia_tang_dan':
                    ketQua.sort((a, b) => a.gia_khuyen_mai - b.gia_khuyen_mai);
                    break;
                case 'gia_giam_dan':
                    ketQua.sort((a, b) => b.gia_khuyen_mai - a.gia_khuyen_mai);
                    break;
                case 'ban_chay_nhat':
                    ketQua.sort((a, b) => (b.so_luong_da_ban || 0) - (a.so_luong_da_ban || 0));
                    break;
                case 'giam_gia_nhieu_nhat':
                    ketQua.sort((a, b) => b.phan_tram_giam_gia - a.phan_tram_giam_gia);
                    break;
                case 'danh_gia_cao':
                    ketQua.sort((a, b) => b.diem_danh_gia_tb - a.diem_danh_gia_tb);
                    break;
                case 'moi_nhat':
                default:
                    ketQua.sort((a, b) => (b.la_san_pham_moi ? 1 : 0) - (a.la_san_pham_moi ? 1 : 0));
                    break;
            }
        }
        return ketQua;
    },

    /**
     * Thêm sản phẩm mới (Dành cho Admin)
     */
    async themSanPham(duLieuMoi) {
        const res = await apiFetch('/san-pham', {
            method: 'POST',
            body: JSON.stringify(duLieuMoi)
        });
        await this.layTatCaSanPhamAsync(); // Cập nhật lại bộ nhớ đệm
        return res;
    },

    /**
     * Cập nhật thông tin sản phẩm (Dành cho Admin)
     */
    async capNhatSanPham(id, duLieuCapNhat) {
        const res = await apiFetch(`/san-pham/${id}`, {
            method: 'PUT',
            body: JSON.stringify(duLieuCapNhat)
        });
        await this.layTatCaSanPhamAsync(); // Cập nhật lại bộ nhớ đệm
        return res;
    },

    /**
     * Xóa sản phẩm (Dành cho Admin)
     */
    async xoaSanPham(id) {
        const res = await apiFetch(`/san-pham/${id}`, {
            method: 'DELETE'
        });
        await this.layTatCaSanPhamAsync(); // Cập nhật lại bộ nhớ đệm
        return res;
    }
};
