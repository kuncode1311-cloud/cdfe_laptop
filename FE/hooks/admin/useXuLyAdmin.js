// ==========================================================================
// HOOK DÙNG CHUNG CHO TRANG ADMIN (gộp logic trùng lặp)
// ==========================================================================
// Đây KHÔNG phải React hook thật (không gọi useState/useEffect/...) mà chỉ là
// 2 hàm factory JS thuần tạo closure, dùng để gom logic lặp lại của các hàm
// "xóa" và "toggle trường boolean" trong app/admin/page.jsx.
// Đặt tên "taoHandlerXxx" để không gây nhầm lẫn với quy tắc của React Hooks.
// ==========================================================================

/**
 * Tạo 1 handler xóa dùng chung cho các entity trong trang Admin.
 * Khung chung: xacNhan -> (nếu đồng ý) setDangXuLy(id) -> gọi API xóa ->
 * hienThongBao thành công -> taiLaiDuLieu -> catch: canhBao lỗi -> finally: setDangXuLy(null)
 */
export function taoHandlerXoa({ xacNhan, canhBao, hienThongBao, taiLaiDuLieu }) {
    return async ({ id, tieuDeXacNhan, noiDungXacNhan, nutXacNhan = 'Xóa Vĩnh Viễn', xoaApi, thongBaoThanhCong, tieuDeLoi, setDangXuLy }) => {
        const dongY = await xacNhan({
            tieuDe: tieuDeXacNhan,
            noiDung: noiDungXacNhan,
            loai: 'danger',
            nutXacNhan,
            nutHuy: 'Hủy Bỏ'
        });
        if (!dongY) return;
        setDangXuLy?.(id);
        try {
            await xoaApi();
            hienThongBao(thongBaoThanhCong);
            taiLaiDuLieu();
        } catch (err) {
            canhBao({ tieuDe: tieuDeLoi, noiDung: err.message, loai: 'danger' });
        } finally {
            setDangXuLy?.(null);
        }
    };
}

/**
 * Tạo 1 handler toggle 1 trường boolean dùng chung cho các entity trong trang Admin.
 * Khung chung: tính id -> tính giá trị mới -> cập nhật lạc quan ngay (setDanhSach) ->
 * hienThongBao -> gọi API cập nhật trường -> catch: rollback lại giá trị cũ + báo lỗi.
 */
export function taoHandlerToggleTruong({ hienThongBao }) {
    return async ({
        item,
        layId = (x) => x.id || x._id,
        truong,
        giaTriHienTai,
        setDanhSach,
        apiCapNhat,
        thongBaoBat,
        thongBaoTat,
        nhom = 'Cập Nhật',
        loaiBat = 'success',
        loaiTat = 'info'
    }) => {
        const id = layId(item);
        const trangThaiMoi = !giaTriHienTai;

        setDanhSach((prev) => prev.map((it) => (layId(it) === id ? { ...it, [truong]: trangThaiMoi } : it)));
        hienThongBao(trangThaiMoi ? thongBaoBat : thongBaoTat, trangThaiMoi ? loaiBat : loaiTat, nhom);

        try {
            await apiCapNhat(id, { [truong]: trangThaiMoi });
        } catch (err) {
            setDanhSach((prev) => prev.map((it) => (layId(it) === id ? { ...it, [truong]: giaTriHienTai } : it)));
            hienThongBao(`Lỗi: ${err.message}`, 'danger', 'Lỗi Cập Nhật');
        }
    };
}
