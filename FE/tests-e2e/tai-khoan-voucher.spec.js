const { test, expect } = require('@playwright/test');
const { dangNhapKhachHang } = require('./_fixtures');

// Smoke test cho tab Ví Voucher (components/tai-khoan/ViVoucher.jsx)
test('khách hàng mở được tab ví voucher và thấy trạng thái ví trống', async ({ page }) => {
    await dangNhapKhachHang(page);
    await page.goto('/tai-khoan');
    await page.getByRole('button', { name: /Kho Voucher & Ưu Đãi/ }).click();

    await expect(page.getByText('Ví Voucher & Mã Ưu Đãi Đã Săn')).toBeVisible();
    // Tài khoản test mới tạo chưa lưu voucher nào vào ví riêng
    await expect(page.getByText('Ví voucher của bạn hiện đang trống')).toBeVisible();

    // Chuyển sang Kho ưu đãi để xem danh sách mã có sẵn của hệ thống (không lưu mã nào, chỉ xem)
    await page.getByRole('button', { name: /Săn thêm/ }).click();
    await expect(page.getByText('Ví voucher của bạn hiện đang trống')).toBeHidden();
});
