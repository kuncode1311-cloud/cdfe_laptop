require('dotenv').config();
const nodemailer = require('nodemailer');

/**
 * Cấu hình Transporter gửi email qua Gmail SMTP
 */
function taoTransporter() {
    const user = process.env.EMAIL_USER || 'kun.code.1311@gmail.com';
    const pass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // SSL
        auth: {
            user: user,
            pass: pass
        },
        tls: {
            rejectUnauthorized: false
        }
    });
}

/**
 * Gửi email mã OTP Quên Mật Khẩu
 */
async function guiMailOTPQuenMatKhau(emailNhan, hoTen, maOtp) {
    const transporter = taoTransporter();

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
        const info = await transporter.sendMail({
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
        // Trả về false kèm thông báo lỗi để xử lý fallback
        return { thanhCong: false, loi: err.message };
    }
}

/**
 * Gửi email kích hoạt tài khoản
 */
async function guiMailKichHoatTaiKhoan(emailNhan, hoTen, maOtp) {
    const transporter = taoTransporter();

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
        const info = await transporter.sendMail({
            from: `"TNTP Laptop Store" <${process.env.EMAIL_USER || 'kun.code.1311@gmail.com'}>`,
            to: emailNhan,
            subject: `[TNTP Laptop] Mã OTP kích hoạt tài khoản của bạn: ${maOtp}`,
            text: `Mã kích hoạt tài khoản của bạn là: ${maOtp}`,
            html: htmlContent
        });
        return { thanhCong: true, messageId: info.messageId };
    } catch (err) {
        console.error(`❌ [Nodemailer] Lỗi gửi email kích hoạt:`, err.message);
        return { thanhCong: false, loi: err.message };
    }
}

module.exports = {
    guiMailOTPQuenMatKhau,
    guiMailKichHoatTaiKhoan
};
