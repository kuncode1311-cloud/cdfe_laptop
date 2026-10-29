const { test, expect } = require('@playwright/test');
const { dangNhapAdmin, dangNhapKhachHang } = require('../support/_fixtures');

test('admin đăng nhập vào được /admin', async ({ page }) => {
    await dangNhapAdmin(page);
    await expect(page).toHaveURL(/\/admin/);
});

test('khách hàng đăng nhập vào được /tai-khoan', async ({ page }) => {
    await dangNhapKhachHang(page);
    await page.goto('/tai-khoan');
    await expect(page).toHaveURL(/\/tai-khoan/);
});
