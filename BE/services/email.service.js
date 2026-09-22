const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config();
const nodemailer = require('nodemailer');

const DEFAULT_EMAIL_USER = 'kun.code.1311@gmail.com';
const DEFAULT_EMAIL_PASS = 'wqdonpjwpjzmntsl';

function layThongTinEmail() {
    const user = process.env.EMAIL_USER || DEFAULT_EMAIL_USER;
    const pass = (process.env.EMAIL_PASS || DEFAULT_EMAIL_PASS).replace(/\s+/g, '');
    return { user, pass };
}

/**
 * Cấu hình Transporter gửi email qua Gmail SMTP với Fallback 2 tầng
 */
async function guiMailBangTransporter(mailOptions) {
    // Ưu tiên 1: Brevo API (Gửi được cho MỌI EMAIL bất kỳ, 300 email/ngày)
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (brevoApiKey) {
        try {
            const brevoSender = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER;
            const danhSachTo = (Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to]).map(e => ({ email: String(e).trim() }));
            const resBrevo = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'api-key': brevoApiKey,
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    sender: {
                        name: 'TNTP Laptop Store',
                        email: brevoSender
                    },
                    to: danhSachTo,
                    subject: mailOptions.subject,
                    htmlContent: mailOptions.html,
                    textContent: mailOptions.text
                })
            });
            const dataBrevo = await resBrevo.json();
            if (!resBrevo.ok) {
                throw new Error(dataBrevo?.message || `Brevo error ${resBrevo.status}`);
            }
            console.log('✅ [BE Email] Gửi thành công qua Brevo API, messageId:', dataBrevo.messageId);
            return { messageId: dataBrevo.messageId };
        } catch (errBrevo) {
            console.warn('⚠️ [BE Email] Brevo API không gửi được:', errBrevo.message);
        }
    }

    // Ưu tiên 2: Google Apps Script Web App
    const gasUrl = process.env.GAS_EMAIL_URL;
    if (gasUrl) {
        try {
            const resGas = await fetch(gasUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: Array.isArray(mailOptions.to) ? mailOptions.to.join(',') : mailOptions.to,
                    subject: mailOptions.subject,
                    html: mailOptions.html,
                    text: mailOptions.text
                }),
                redirect: 'follow'
            });
            console.log('✅ [BE Email] Gửi thành công qua Google Apps Script Web App');
            return { messageId: 'gas_' + Date.now() };
        } catch (errGas) {
            console.warn('⚠️ [BE Email] Gửi qua Google Apps Script thất bại:', errGas.message);
        }
    }

    // Ưu tiên 2: Resend API (HTTP - hoạt động trên cloud)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
        try {
            const resendFrom = process.env.RESEND_FROM || 'TNTP Laptop Store <onboarding@resend.dev>';
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: resendFrom,
                    to: Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to],
                    subject: mailOptions.subject,
                    html: mailOptions.html,
                    text: mailOptions.text
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || `Resend API error ${res.status}`);
            console.log('✅ [BE Email] Gửi thành công qua Resend API, id:', data.id);
            return { messageId: data.id };
        } catch (errResend) {
            console.warn('⚠️ [BE Email] Resend API không gửi được:', errResend.message);
            if (errResend.message.includes('own email address') || errResend.message.includes('not verified')) {
                throw new Error(`Resend Free chưa có Domain riêng, chỉ gửi được tới email chủ (kun.code.1311@gmail.com).`);
            }
        }
    }

    // Nếu chạy trên cloud hosting (Railway / Vercel): Chặn SMTP để tránh timeout
    const isCloudHost = !!(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_STATIC_URL || process.env.VERCEL);
    if (isCloudHost) {
        throw new Error('Máy chủ Cloud chặn cổng SMTP. Vui lòng cấu hình GAS_EMAIL_URL hoặc xác thực tên miền Resend.');
    }

    const { user, pass } = layThongTinEmail();

    // Fallback: SMTP trên localhost dev
    try {
        const transporter465 = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: { user, pass },
            tls: { rejectUnauthorized: false },
            connectionTimeout: 8000,
            greetingTimeout: 4000,
            socketTimeout: 10000
        });
        return await transporter465.sendMail(mailOptions);
    } catch (err1) {
        console.warn('⚠️ [BE Email] Port 465 thất bại, thử port 587...', err1.message);
        const transporter587 = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: { user, pass },
            tls: { rejectUnauthorized: false },
            connectionTimeout: 8000,
            greetingTimeout: 4000,
            socketTimeout: 10000
        });
        return await transporter587.sendMail(mailOptions);
    }
}

/**
 * Gửi email mã OTP Quên Mật Khẩu
 */
async function guiMailOTPQuenMatKhau(emailNhan, hoTen, maOtp) {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
            .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #0052cc 0%, #1d4ed8 100%); padding: 28px 24px; text-align: center; color: #ffffff; }
            .logo-badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 8px; font-weight: 900; font-size: 13px; letter-spacing: 1px; margin-bottom: 8px; }
            .title { font-size: 20px; font-weight: 800; margin: 0; }
            .body-content { padding: 32px 28px; }
            .greeting { font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
            .desc { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 24px; }
            .otp-box { background: #f8fafc; border: 2px dashed #0052cc; border-radius: 14px; padding: 18px; text-align: center; margin: 20px 0; }
            .otp-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
            .otp-code { font-size: 32px; font-weight: 900; color: #0052cc; letter-spacing: 8px; font-family: monospace; }
            .warning { font-size: 12px; color: #ef4444; margin-top: 14px; line-height: 1.5; }
            .footer { background: #f8fafc; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-badge">TNTP LAPTOP</div>
                <h1 class="title">Yêu Cầu Đặt Lại Mật Khẩu</h1>
            </div>
            <div class="body-content">
                <div class="greeting">Xin chào ${hoTen || 'Quý khách'},</div>
                <div class="desc">
                    Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản <strong>${emailNhan}</strong> tại hệ thống <strong>TNTP Laptop Store</strong>.
                    <br><br>
                    Vui lòng sử dụng mã OTP dưới đây để hoàn tất việc xác thực và đặt lại mật khẩu mới:
                </div>
                
                <div class="otp-box">
                    <div class="otp-label">MÃ XÁC THỰC OTP (Hết hạn trong 10 phút)</div>
                    <div class="otp-code">${maOtp}</div>
                </div>

                <div class="warning">
                    ⚠️ <strong>Lưu ý quan trọng:</strong> Tuyệt đối không chia sẻ mã này cho bất kỳ ai, kể cả nhân viên chăm sóc khách hàng. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.
                </div>
            </div>
            <div class="footer">
                TNTP Laptop Store // Hệ thống Laptop Gaming, AI PC & Đồ Họa hàng đầu 2026<br>
                Hotline hỗ trợ: 1900.8946 • Email: support@tntplaptop.vn
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const info = await guiMailBangTransporter({
            from: `"TNTP Laptop Store" <${process.env.EMAIL_USER || 'kun.code.1311@gmail.com'}>`,
            to: emailNhan,
            subject: `[TNTP Laptop] Mã OTP đặt lại mật khẩu của bạn là: ${maOtp}`,
            text: `Mã xác thực OTP của bạn là: ${maOtp}. Mã có hiệu lực trong 10 phút. Tuyệt đối không chia sẻ mã này cho ai.`,
            html: htmlContent
        });

        console.log(`✅ [Nodemailer] Đã gửi mã OTP đến ${emailNhan} - MessageId: ${info.messageId}`);
        return { thanhCong: true, messageId: info.messageId };
    } catch (err) {
        console.error(`❌ [Nodemailer] Lỗi khi gửi email đến ${emailNhan}:`, err.message);
        return { thanhCong: false, loi: err.message };
    }
}

/**
 * Gửi email kích hoạt tài khoản
 */
async function guiMailKichHoatTaiKhoan(emailNhan, hoTen, maOtp) {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
            .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 28px 24px; text-align: center; color: #ffffff; }
            .logo-badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 8px; font-weight: 900; font-size: 13px; letter-spacing: 1px; margin-bottom: 8px; }
            .title { font-size: 20px; font-weight: 800; margin: 0; }
            .body-content { padding: 32px 28px; }
            .greeting { font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
            .desc { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 24px; }
            .otp-box { background: #f0fdf4; border: 2px dashed #10b981; border-radius: 14px; padding: 18px; text-align: center; margin: 20px 0; }
            .otp-label { font-size: 12px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
            .otp-code { font-size: 32px; font-weight: 900; color: #059669; letter-spacing: 8px; font-family: monospace; }
            .footer { background: #f8fafc; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-badge">TNTP LAPTOP</div>
                <h1 class="title">Xác Thực & Kích Hoạt Tài Khoản</h1>
            </div>
            <div class="body-content">
                <div class="greeting">Chào mừng ${hoTen || 'bạn'} gia nhập TNTP Laptop! 🎉</div>
                <div class="desc">
                    Cảm ơn bạn đã đăng ký tài khoản thành viên. Hãy nhập mã OTP bên dưới để kích hoạt tài khoản và nhận ngay ưu đãi <strong>Voucher 200K</strong> cho đơn hàng đầu tiên:
                </div>
                
                <div class="otp-box">
                    <div class="otp-label">MÃ KÍCH HOẠT OTP (Hết hạn trong 10 phút)</div>
                    <div class="otp-code">${maOtp}</div>
                </div>
            </div>
            <div class="footer">
                TNTP Laptop Store // Hệ thống Laptop Gaming, AI PC & Đồ Họa hàng đầu 2026
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const info = await guiMailBangTransporter({
            from: `"TNTP Laptop Store" <${process.env.EMAIL_USER || 'kun.code.1311@gmail.com'}>`,
            to: emailNhan,
            subject: `[TNTP Laptop] Mã OTP kích hoạt tài khoản của bạn: ${maOtp}`,
            text: `Mã kích hoạt tài khoản của bạn là: ${maOtp}`,
            html: htmlContent
        });
        console.log(`✅ [Nodemailer] Đã gửi mã kích hoạt đến ${emailNhan} - MessageId: ${info.messageId}`);
        return { thanhCong: true, messageId: info.messageId };
    } catch (err) {
        console.error(`❌ [Nodemailer] Lỗi gửi email kích hoạt:`, err.message);
        return { thanhCong: false, loi: err.message };
    }
}

/**
 * Gửi email xác nhận đơn hàng khi khách đặt hàng thành công
 */
async function guiMailXacNhanDonHang(donHang) {
    const emailNhan = donHang?.thong_tin_giao_hang?.email || donHang?.email;
    if (!emailNhan || !String(emailNhan).includes('@')) return { thanhCong: false, lyDo: 'Không có email' };
    const tenKhach = donHang?.thong_tin_giao_hang?.ho_ten || donHang?.thong_tin_giao_hang?.ho_va_ten || 'Quý khách';
    const maDon = donHang?.ma_don_hang || donHang?.id || 'LPN-ORDER';
    const tongTien = Number(donHang?.tong_tien_thanh_toan || 0).toLocaleString('vi-VN') + ' đ';
    const hinhThucTT = donHang?.hinh_thuc_thanh_toan === 'chuyen_khoan_vietqr' ? 'Chuyển khoản Ngân hàng (VietQR Pro)' : 'Thanh toán tiền mặt khi nhận hàng (COD)';
    const trangThaiTT = donHang?.da_thanh_toan ? 'ĐÃ THANH TOÁN THÀNH CÔNG' : (donHang?.hinh_thuc_thanh_toan === 'chuyen_khoan_vietqr' ? 'Chờ chuyển khoản VietQR' : 'Thanh toán khi nhận hàng');

    const danhSachItemHtml = (donHang?.danh_sach_san_pham || []).map(sp => {
        const ten = sp.ten_san_pham || 'Laptop';
        const sl = sp.so_luong || 1;
        const gia = Number(sp.gia_hien_tai || sp.gia_tai_thoi_diem_them || sp.gia || 0).toLocaleString('vi-VN') + ' đ';
        const tongMuc = Number(sp.tong_tien_muc || (sp.gia_hien_tai || 0) * sl).toLocaleString('vi-VN') + ' đ';
        return `
            <tr>
                <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #1e293b;">${ten}</td>
                <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0; text-align: center; font-size: 13px; color: #64748b;">${sl}</td>
                <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-size: 13px; font-weight: 700; color: #0052cc;">${tongMuc}</td>
            </tr>
        `;
    }).join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
            .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #0052cc 0%, #1d4ed8 100%); padding: 28px 24px; text-align: center; color: #ffffff; }
            .logo-badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 8px; font-weight: 900; font-size: 13px; letter-spacing: 1px; margin-bottom: 8px; }
            .title { font-size: 20px; font-weight: 800; margin: 0; }
            .body-content { padding: 28px 24px; }
            .greeting { font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 10px; }
            .order-badge { display: inline-block; background: #eff6ff; color: #0052cc; border: 1px solid #bfdbfe; padding: 6px 12px; border-radius: 10px; font-family: monospace; font-weight: 900; font-size: 14px; margin: 8px 0; }
            .table-wrap { width: 100%; border-collapse: collapse; margin: 16px 0; }
            .total-box { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 14px; margin-top: 14px; }
            .total-amount { font-size: 20px; font-weight: 900; color: #dc2626; font-family: monospace; }
            .footer { background: #f8fafc; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-badge">TNTP LAPTOP</div>
                <h1 class="title">Xác Nhận Đơn Hàng #${maDon}</h1>
            </div>
            <div class="body-content">
                <div class="greeting">Kính gửi ${tenKhach},</div>
                <p style="font-size: 13.5px; color: #64748b; line-height: 1.5; margin: 6px 0 14px;">
                    Cảm ơn quý khách đã tin tưởng mua sắm tại <strong>TNTP Laptop Store</strong>. Đơn hàng của quý khách đã được ghi nhận thành công và đang được chuẩn bị đóng gói niêm phong.
                </p>

                <div style="background: #f8fafc; padding: 14px; border-radius: 12px; margin-bottom: 16px; font-size: 12.5px; line-height: 1.6; border: 1px solid #e2e8f0;">
                    <div><strong>Mã đơn hàng:</strong> <span class="order-badge">${maDon}</span></div>
                    <div><strong>Thời gian đặt:</strong> ${donHang?.ngay_tao || new Date().toLocaleString('vi-VN')}</div>
                    <div><strong>Người nhận:</strong> ${tenKhach} (${donHang?.thong_tin_giao_hang?.so_dien_thoai || ''})</div>
                    <div><strong>Địa chỉ:</strong> ${[donHang?.thong_tin_giao_hang?.dia_chi_chi_tiet, donHang?.thong_tin_giao_hang?.phuong_xa, donHang?.thong_tin_giao_hang?.quan_huyen, donHang?.thong_tin_giao_hang?.tinh_thanh].filter(Boolean).join(', ')}</div>
                    <div><strong>Hình thức:</strong> ${hinhThucTT}</div>
                    <div><strong>Trạng thái thanh toán:</strong> <span style="font-weight: 800; color: #0052cc;">${trangThaiTT}</span></div>
                </div>

                <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 12px 0 8px;">Chi tiết kiện hàng:</h3>
                <table class="table-wrap">
                    <thead>
                        <tr style="background: #f1f5f9; text-align: left;">
                            <th style="padding: 8px; font-size: 11px; text-transform: uppercase; color: #475569;">Sản phẩm</th>
                            <th style="padding: 8px; font-size: 11px; text-transform: uppercase; color: #475569; text-align: center;">SL</th>
                            <th style="padding: 8px; font-size: 11px; text-transform: uppercase; color: #475569; text-align: right;">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${danhSachItemHtml}
                    </tbody>
                </table>

                <div class="total-box">
                    <table style="width: 100%;">
                        <tr>
                            <td style="font-size: 14px; font-weight: 800; color: #0f172a;">TỔNG CỘNG:</td>
                            <td style="text-align: right;"><span class="total-amount">${tongTien}</span></td>
                        </tr>
                    </table>
                </div>

                <p style="font-size: 12px; color: #10b981; font-weight: 700; margin-top: 14px;">
                    🛡️ Cam kết: 100% Sản phẩm chính hãng nguyên seal • Mở hộp test máy trước khi thanh toán • Bảo hành 12-24 tháng.
                </p>
            </div>
            <div class="footer">
                TNTP Laptop Store // Hệ thống Laptop Gaming, AI PC & Đồ Họa hàng đầu 2026<br>
                Hotline hỗ trợ: 1900.8946 • Email: support@tntplaptop.vn
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const info = await guiMailBangTransporter({
            from: `"TNTP Laptop Store" <${process.env.EMAIL_USER || 'kun.code.1311@gmail.com'}>`,
            to: emailNhan,
            subject: `[TNTP Laptop] Xác nhận đơn hàng #${maDon} thành công - ${tenKhach}`,
            html: htmlContent
        });
        console.log(`✉️ [Nodemailer] Đã gửi email xác nhận đơn #${maDon} đến ${emailNhan} - MsgId: ${info.messageId}`);
        return { thanhCong: true, messageId: info.messageId };
    } catch (err) {
        console.warn(`⚠️ [Nodemailer] Không thể gửi email xác nhận đơn #${maDon}:`, err.message);
        return { thanhCong: false, loi: err.message };
    }
}

module.exports = {
    guiMailOTPQuenMatKhau,
    guiMailKichHoatTaiKhoan,
    guiMailXacNhanDonHang
};
