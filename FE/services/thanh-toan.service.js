import { API_BASE_URL } from './api-client';

const PAYMENT_BANK_BIN = '970452'; // KienlongBank BIN
const PAYMENT_BANK_ACCOUNT_NO = '0345151438';
const PAYMENT_BANK_ACCOUNT_NAME = 'LE MINH TRI';

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
            const res = await fetch(`${API_BASE_URL}/thanh-toan/tao-link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(thongTinDon),
                signal: AbortSignal.timeout(3000)
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    return data;
                }
            }
        } catch (err) {
            console.warn('⚠️ Backend PayOS phản hồi chậm (>3s), lập tức kích hoạt VietQR tức thì:', err.message);
        }

        // Dự phòng tự tạo VietQR trực tiếp siêu tốc 0ms nếu Backend chưa kịp phản hồi
        const amount = Math.max(1000, Math.round(Number(thongTinDon.tong_tien) || 0));
        const codeSuffix = thongTinDon.ma_don_hang ? thongTinDon.ma_don_hang.slice(-6) : Math.floor(100000 + Math.random() * 900000);
        const noiDung = `TRIKUN ${codeSuffix}`.slice(0, 25);
        const qrUrl = `https://img.vietqr.io/image/${PAYMENT_BANK_BIN}-${PAYMENT_BANK_ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(noiDung)}&accountName=${encodeURIComponent(PAYMENT_BANK_ACCOUNT_NAME)}`;

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
            const res = await fetch(`${API_BASE_URL}/thanh-toan/kiem-tra/${encodeURIComponent(orderCode)}`, {
                signal: AbortSignal.timeout(2500)
            });
            if (res.ok) {
                return await res.json();
            }
        } catch (err) {
            // Im lặng bỏ qua timeout để polling tiếp tục chu kỳ sau mượt mà
        }
        return { success: false, da_thanh_toan: false };
    }
};
