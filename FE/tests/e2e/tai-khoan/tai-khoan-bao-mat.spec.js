const { test, expect } = require('@playwright/test');
const { dangNhapKhachHang } = require('../support/_fixtures');

// Smoke test cho tab Bảo Mật & Mật Khẩu (components/tai-khoan/BaoMatTaiKhoan.jsx)
// CHỈ kiểm tra UI/validate phía client -- KHÔNG submit đổi mật khẩu thật để tránh khoá
// tài khoản test dùng chung cho các spec khác (không có cách revert an toàn vì đổi mật
// khẩu yêu cầu xác thực OTP qua email thật).
test('khách hàng thấy form đổi mật khẩu và validate xác nhận không khớp', async ({ page }) => {
    await dangNhapKhachHang(page);
    await page.goto('/tai-khoan');
    await page.getByRole('button', { name: /Bảo Mật & Mật Khẩu/ }).first().click();

    await expect(page.getByText('Đổi Mật Khẩu & Bảo Mật Tài Khoản')).toBeVisible();

    const oMatKhauMoi = page.getByPlaceholder(/Nhập mật khẩu mới/);
    const oXacNhan = page.getByPlaceholder('Nhập lại chính xác mật khẩu...');

    await oMatKhauMoi.fill('TestMatKhau123');
    await oXacNhan.fill('KhacHoanToan456');
    await oXacNhan.blur();

    await expect(page.getByText(/không khớp|trùng khớp|xác nhận/i).first()).toBeVisible();

    // Không bấm nút submit -- chỉ xác nhận form hiển thị và validate đúng sau khi tách component
    await expect(page.getByRole('button', { name: /Gửi Mã OTP|Cập Nhật Mật Khẩu/ })).toBeVisible();
});
