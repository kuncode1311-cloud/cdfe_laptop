import { apiFetch } from './api-client';

const PAYMENT_BANK_BIN = process.env.NEXT_PUBLIC_PAYMENT_BANK_BIN;
const PAYMENT_BANK_ACCOUNT_NO = process.env.NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT_NO;
const PAYMENT_BANK_ACCOUNT_NAME = process.env.NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT_NAME;

export function taoVietQrTuEnv(amount, noiDung) {
    if (!PAYMENT_BANK_BIN || !PAYMENT_BANK_ACCOUNT_NO || !PAYMENT_BANK_ACCOUNT_NAME) return null;
    return `https://img.vietqr.io/image/${PAYMENT_BANK_BIN}-${PAYMENT_BANK_ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(noiDung)}&accountName=${encodeURIComponent(PAYMENT_BANK_ACCOUNT_NAME)}`;
}

/**
 * Service xử lý thanh toán PayOS & QR Chuyển Khoản Ngân Hàng
 */
export const ThanhToanService = {
    /**
     * Tạo yêu cầu thanh toán PayOS và mã QR chuyển khoản
     * @param {Object} thongTinDon - { ma_don_hang, id_don_hang, tong_tien, ten_khach_hang }
     */
    async taoYeuCauThanhToan(thongTinDon) {
        try {
            const data = await apiFetch('/thanh-toan/tao-link', {
                method: 'POST',
                body: JSON.stringify(thongTinDon),
                timeoutMs: 3000
            });
            if (data.success) return data;
        } catch (err) {
            console.warn('⚠️ Backend PayOS phản hồi chậm (>3s), lập tức kích hoạt VietQR tức thì:', err.message);
        }

        if (!PAYMENT_BANK_BIN || !PAYMENT_BANK_ACCOUNT_NO || !PAYMENT_BANK_ACCOUNT_NAME) {
            throw new Error('Backend thanh toán không phản hồi và chưa cấu hình VietQR trên môi trường.');
        }

        // Dự phòng VietQR lấy từ biến môi trường, không chứa thông tin ngân hàng trong source.
        const amount = Math.max(1000, Math.round(Number(thongTinDon.tong_tien) || 0));
        const codeSuffix = thongTinDon.ma_don_hang ? thongTinDon.ma_don_hang.slice(-6) : Math.floor(100000 + Math.random() * 900000);
        const noiDung = `TRIKUN ${codeSuffix}`.slice(0, 25);
        const qrUrl = taoVietQrTuEnv(amount, noiDung);

        return {
            success: true,
            orderCode: codeSuffix,
            amount: amount,
            description: noiDung,
            qrImageUrl: qrUrl,
            checkoutUrl: '',
            thongTinNganHang: {
                nganHang: 'KienlongBank (Ngân Hàng Kiên Long)',
                bin: PAYMENT_BANK_BIN,
                soTaiKhoan: PAYMENT_BANK_ACCOUNT_NO,
                tenChuTaiKhoan: PAYMENT_BANK_ACCOUNT_NAME,
                soTien: amount,
                noiDung: noiDung
            }
        };
    },

    /**
     * Kiểm tra trạng thái thanh toán từ PayOS & Backend
     * @param {number|string} orderCode 
     */
    async kiemTraTrangThai(orderCode) {
        try {
            return await apiFetch(`/thanh-toan/kiem-tra/${encodeURIComponent(orderCode)}`, { timeoutMs: 2500 });
        } catch (err) {
            // Im lặng bỏ qua timeout để polling tiếp tục chu kỳ sau mượt mà
        }
        return { success: false, da_thanh_toan: false };
    }
};
