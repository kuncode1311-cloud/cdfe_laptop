const crypto = require('crypto');
const DonHang = require('../models/don-hang.model');

// Thông tin cấu hình PayOS & MBBank
const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID || '8bfb42f3-2194-4060-bd73-2a7324c5e8f2';
const PAYOS_API_KEY = process.env.PAYOS_API_KEY || 'b1a6aa76-06c1-41a7-b845-286a0503f9e7';
const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY || '5dbb3c6a481e5300eaca7bc99ba73bb2a652759e9ae6de73dcc0f3f6b7cad860';
const PAYOS_ENDPOINT = process.env.PAYOS_ENDPOINT || 'https://api-merchant.payos.vn';

const PAYMENT_BANK_BIN = process.env.PAYMENT_BANK_BIN || '970452'; // KienlongBank BIN
const PAYMENT_BANK_ACCOUNT_NO = process.env.PAYMENT_BANK_ACCOUNT_NO || '0345151438';
const PAYMENT_BANK_ACCOUNT_NAME = process.env.PAYMENT_BANK_ACCOUNT_NAME || 'LE MINH TRI';

/**
 * Tạo chữ ký HMAC SHA256 cho dữ liệu PayOS
 */
const taoChuKyPayOS = (data, checksumKey) => {
    const keys = Object.keys(data).sort();
    const parts = [];
    for (const key of keys) {
        const val = data[key];
        if (val !== undefined && val !== null && typeof val !== 'object') {
            parts.push(`${key}=${val}`);
        }
    }
    const chuoiKy = parts.join('&');
    return crypto.createHmac('sha256', checksumKey).update(chuoiKy).digest('hex');
};

/**
 * Sinh link ảnh VietQR có sẵn số tiền và nội dung chuyển khoản
 */
const taoUrlVietQR = (bin, stk, tenTk, soTien, noiDung) => {
    const bankBin = bin || PAYMENT_BANK_BIN;
    const accountNo = stk || PAYMENT_BANK_ACCOUNT_NO;
    const accountName = tenTk || PAYMENT_BANK_ACCOUNT_NAME;
    const amount = Math.max(0, Math.round(Number(soTien) || 0));
    const addInfo = encodeURIComponent(String(noiDung || 'LPN THANH TOAN').slice(0, 25));
    const accName = encodeURIComponent(String(accountName).toUpperCase());

    return `https://img.vietqr.io/image/${bankBin}-${accountNo}-compact2.png?amount=${amount}&addInfo=${addInfo}&accountName=${accName}`;
};

/**
 * Tạo yêu cầu thanh toán PayOS hoặc sinh thông tin chuyển khoản chuẩn
 */
const taoYeuCauThanhToanPayOS = async (req, res) => {
    try {
        const { ma_don_hang, id_don_hang, tong_tien, ten_khach_hang } = req.body;

        const tongTienSo = Math.max(1000, Math.round(Number(tong_tien) || 0));
        
        // Tạo orderCode dạng số nguyên dương duy nhất cho PayOS
        let numericCode = 0;
        if (ma_don_hang) {
            const digits = String(ma_don_hang).replace(/\D/g, '');
            if (digits.length >= 4) {
                numericCode = Number(digits.slice(-9));
            }
        }
        if (!numericCode || numericCode <= 0) {
            numericCode = Number(Date.now().toString().slice(-8));
        }

        // Nội dung thanh toán ngắn gọn tối đa 25 ký tự theo quy định PayOS
        const noiDungChuyenKhoan = (ma_don_hang ? `TRIKUN ${ma_don_hang.slice(-6)}` : `TRIKUN ${numericCode}`).slice(0, 25);

        // Chuẩn bị payload gửi PayOS
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
        const payloadPayOS = {
            orderCode: numericCode,
            amount: tongTienSo,
            description: noiDungChuyenKhoan,
            returnUrl: `${clientUrl}/thanh-toan?status=PAID&orderCode=${numericCode}`,
            cancelUrl: `${clientUrl}/thanh-toan?status=CANCELLED&orderCode=${numericCode}`
        };

        payloadPayOS.signature = taoChuKyPayOS(payloadPayOS, PAYOS_CHECKSUM_KEY);

        let ketQuaPayOS = null;
        let qrImageUrl = '';
        let checkoutUrl = '';
        let qrCode = '';

        try {
            const phanHoi = await fetch(`${PAYOS_ENDPOINT}/v2/payment-requests`, {
                method: 'POST',
                headers: {
                    'x-client-id': PAYOS_CLIENT_ID,
                    'x-api-key': PAYOS_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payloadPayOS)
            });

            const duLieu = await phanHoi.json();
            if (duLieu && duLieu.code === '00' && duLieu.data) {
                ketQuaPayOS = duLieu.data;
                checkoutUrl = duLieu.data.checkoutUrl || '';
                qrCode = duLieu.data.qrCode || '';
                
                qrImageUrl = taoUrlVietQR(
                    duLieu.data.bin || PAYMENT_BANK_BIN,
                    duLieu.data.accountNumber || PAYMENT_BANK_ACCOUNT_NO,
                    duLieu.data.accountName || PAYMENT_BANK_ACCOUNT_NAME,
                    duLieu.data.amount || tongTienSo,
                    duLieu.data.description || noiDungChuyenKhoan
                );
            } else {
                console.warn('⚠️ [PayOS] Phản hồi từ cổng PayOS:', duLieu?.desc || duLieu?.message || 'Không xác định');
            }
        } catch (apiErr) {
            console.error('❌ [PayOS] Lỗi kết nối cổng PayOS API:', apiErr.message);
        }

        // Dự phòng: Nếu PayOS chưa tạo được link trực tiếp, luôn sinh QR chuẩn VietQR 24/7
        if (!qrImageUrl) {
            qrImageUrl = taoUrlVietQR(
                PAYMENT_BANK_BIN,
                PAYMENT_BANK_ACCOUNT_NO,
                PAYMENT_BANK_ACCOUNT_NAME,
                tongTienSo,
                noiDungChuyenKhoan
            );
        }

        // Lưu thông tin orderCode vào đơn hàng nếu có id_don_hang
        if (id_don_hang || ma_don_hang) {
            try {
                await DonHang.findOneAndUpdate(
                    { $or: [{ id: id_don_hang }, { ma_don_hang: ma_don_hang }] },
                    { 
                        $set: { 
                            payos_order_code: numericCode,
                            noi_dung_chuyen_khoan: noiDungChuyenKhoan
                        } 
                    }
                );
            } catch (dbErr) {
                console.warn('⚠️ Không cập nhật được payos_order_code vào DB:', dbErr.message);
            }
        }

        return res.status(200).json({
            success: true,
            orderCode: numericCode,
            amount: tongTienSo,
            description: noiDungChuyenKhoan,
            qrImageUrl: qrImageUrl,
            checkoutUrl: checkoutUrl,
            qrCode: qrCode,
            thongTinNganHang: {
                nganHang: 'KienlongBank (Ngân Hàng Kiên Long)',
                bin: PAYMENT_BANK_BIN,
                soTaiKhoan: PAYMENT_BANK_ACCOUNT_NO,
                tenChuTaiKhoan: PAYMENT_BANK_ACCOUNT_NAME,
                soTien: tongTienSo,
                noiDung: noiDungChuyenKhoan
            },
            payosData: ketQuaPayOS
        });
    } catch (error) {
        console.error('❌ [PayOS Controller] Lỗi tạo yêu cầu thanh toán:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi tạo thông tin thanh toán: ' + error.message
        });
    }
};

/**
 * Kiểm tra trạng thái thanh toán từ PayOS và Database
 */
const kiemTraTrangThaiPayOS = async (req, res) => {
    try {
        const { orderCode } = req.params;
        if (!orderCode) {
            return res.status(400).json({ success: false, message: 'Thiếu mã orderCode' });
        }

        let daThanhToan = false;
        let payosStatus = 'PENDING';
        let amountPaid = 0;

        // 1. Kiểm tra trạng thái trong DB trước
        const donHangDB = await DonHang.findOne({
            $or: [
                { payos_order_code: Number(orderCode) || 0 },
                { ma_don_hang: String(orderCode) },
                { id: String(orderCode) }
            ]
        });

        if (donHangDB && (donHangDB.da_thanh_toan || donHangDB.trang_thai_thanh_toan === 'da_thanh_toan')) {
            return res.status(200).json({
                success: true,
                da_thanh_toan: true,
                status: 'PAID',
                donHang: donHangDB
            });
        }

        // 2. Truy vấn trực tiếp API PayOS
        try {
            const resPayOS = await fetch(`${PAYOS_ENDPOINT}/v2/payment-requests/${encodeURIComponent(orderCode)}`, {
                method: 'GET',
                headers: {
                    'x-client-id': PAYOS_CLIENT_ID,
                    'x-api-key': PAYOS_API_KEY,
                    'Content-Type': 'application/json'
                }
            });

            const dataPayOS = await resPayOS.json();
            if (dataPayOS && dataPayOS.code === '00' && dataPayOS.data) {
                payosStatus = String(dataPayOS.data.status || '').toUpperCase();
                amountPaid = Number(dataPayOS.data.amountPaid) || 0;

                if (payosStatus === 'PAID' || (amountPaid > 0 && amountPaid >= (dataPayOS.data.amount || 0))) {
                    daThanhToan = true;
                }
            }
        } catch (apiErr) {
            console.warn('⚠️ Lỗi kiểm tra PayOS API:', apiErr.message);
        }

        // 3. Nếu PayOS xác nhận đã thanh toán -> cập nhật DB ngay lập tức
        if (daThanhToan && donHangDB) {
            donHangDB.da_thanh_toan = true;
            donHangDB.trang_thai_thanh_toan = 'da_thanh_toan';
            if (donHangDB.trang_thai === 'cho_xac_nhan') {
                donHangDB.trang_thai = 'da_xac_nhan';
            }
            await donHangDB.save();
            console.log(`✅ [PayOS] Đơn hàng #${donHangDB.ma_don_hang} ĐÃ THANH TOÁN THÀNH CÔNG!`);
        }

        return res.status(200).json({
            success: true,
            da_thanh_toan: daThanhToan,
            status: payosStatus,
            amountPaid: amountPaid,
            ma_don_hang: donHangDB?.ma_don_hang || orderCode
        });
    } catch (error) {
        console.error('❌ [PayOS Controller] Lỗi kiểm tra thanh toán:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi kiểm tra trạng thái thanh toán: ' + error.message
        });
    }
};

/**
 * Xử lý Webhook gửi từ PayOS
 */
const xuLyWebhookPayOS = async (req, res) => {
    try {
        const payload = req.body;
        if (!payload || !payload.data || !payload.signature) {
            return res.status(400).json({ success: false, message: 'Thiếu dữ liệu Webhook' });
        }

        // Xác minh chữ ký PayOS
        const chuKyTinh = taoChuKyPayOS(payload.data, PAYOS_CHECKSUM_KEY);
        if (chuKyTinh !== payload.signature) {
            console.warn('⚠️ [PayOS Webhook] Chữ ký không hợp lệ!');
            return res.status(400).json({ success: false, message: 'Chữ ký không hợp lệ' });
        }

        const data = payload.data;
        const orderCode = data.orderCode;
        const amount = Number(data.amount) || 0;

        console.log(`🔔 [PayOS Webhook] Nhận thông báo giao dịch thành công cho mã đơn: ${orderCode}, Số tiền: ${amount}`);

        // Tìm và cập nhật đơn hàng trong DB
        const donHang = await DonHang.findOne({
            $or: [
                { payos_order_code: Number(orderCode) },
                { ma_don_hang: String(orderCode) }
            ]
        });

        if (donHang) {
            donHang.da_thanh_toan = true;
            donHang.trang_thai_thanh_toan = 'da_thanh_toan';
            if (donHang.trang_thai === 'cho_xac_nhan') {
                donHang.trang_thai = 'da_xac_nhan';
            }
            await donHang.save();
            console.log(`✅ [PayOS Webhook] Cập nhật thành công đơn hàng #${donHang.ma_don_hang}`);
        }

        return res.status(200).json({
            success: true,
            message: 'Webhook processed successfully'
        });
    } catch (error) {
        console.error('❌ [PayOS Webhook] Lỗi xử lý webhook:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    taoYeuCauThanhToanPayOS,
    kiemTraTrangThaiPayOS,
    xuLyWebhookPayOS,
    taoUrlVietQR
};
