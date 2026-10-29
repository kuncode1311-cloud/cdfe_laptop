const { test, expect } = require('@playwright/test');

test('admin vẫn hiển thị khi API trả về danh mục', async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('tnt_laptop_token', 'test-token');
        localStorage.setItem('tnt_laptop_user', JSON.stringify({ id: 'admin-test', vaiTro: 'admin' }));
    });

    await page.route('**/api/**', async (route) => {
        const path = new URL(route.request().url()).pathname;
        const data = path.endsWith('/auth/toi')
            ? { nguoiDung: { id: 'admin-test', vaiTro: 'admin' } }
            : path.endsWith('/danh-muc')
                ? [{ id: 'brand-test', ma_danh_muc: 'brand-test', ten_danh_muc: 'E2E Brand', loai: 'thuong_hieu', kich_hoat: true }]
                : [];
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });
    });

    await page.goto('/admin/danh-muc');
    await expect(page.getByText('E2E Brand', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Đã Xảy Ra Lỗi Không Mong Muốn!')).toHaveCount(0);
});
