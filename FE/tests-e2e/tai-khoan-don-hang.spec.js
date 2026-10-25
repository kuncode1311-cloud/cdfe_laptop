const { test, expect } = require('@playwright/test');
const { dangNhapKhachHang } = require('./_fixtures');

// Smoke test cho tab Đơn Hàng Của Tôi (components/tai-khoan/LichSuDonHang.jsx)
test('khách hàng mở được tab đơn hàng và thấy trạng thái chưa có đơn', async ({ page }) => {
    await dangNhapKhachHang(page);
    await page.goto('/tai-khoan');
    await page.getByRole('button', { name: /Đơn Hàng Của Tôi/ }).first().click();

    await expect(page.getByText('Đơn Hàng Của Tôi & Tiến Độ Giao Hàng')).toBeVisible();
    // Tài khoản test mới tạo chưa có đơn hàng nào
    await expect(page.getByText(/Chưa có đơn hàng nào/)).toBeVisible();

    // Lọc theo trạng thái khác vẫn hoạt động, không lỗi
    await page.getByRole('button', { name: 'Đã hủy' }).click();
    await expect(page.getByText(/Chưa có đơn hàng nào/)).toBeVisible();
});
