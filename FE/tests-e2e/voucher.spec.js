const { test, expect } = require('@playwright/test');
const { dangNhapAdmin } = require('./_fixtures');

// Smoke test cho Modal Thêm/Sửa voucher (app/admin/voucher/components/ModalVoucher.jsx)
test('admin tạo, sửa rồi xoá được một voucher', async ({ page }) => {
    const maCode = `E2E${Date.now()}`;

    await dangNhapAdmin(page);
    await page.getByTitle('Mã Khuyến Mãi').click();

    // Tạo mới
    await page.getByRole('button', { name: /Tạo Mã Voucher Mới/i }).click();
    await expect(page.getByText('Tạo Voucher Khuyến Mãi Mới')).toBeVisible();
    await page.getByPlaceholder('SALE2026 / TRIKUN500K...').fill(maCode);
    await page.getByPlaceholder('Ưu đãi sinh viên / Tri ân khách hàng thân thiết...').fill('E2E Test Voucher');
    await page.getByPlaceholder('VD: 500000').fill('100000');
    await page.getByRole('button', { name: 'Tạo Voucher' }).click();
    await expect(page.getByText('Tạo Voucher Khuyến Mãi Mới')).toBeHidden();

    const hang = (ma) => page.locator('tr').filter({ hasText: ma });
    await expect(hang(maCode)).toBeVisible();

    // Sửa
    await hang(maCode).getByTitle('Sửa voucher').click();
    await expect(page.getByText('Sửa Mã Khuyến Mãi')).toBeVisible();
    await page.getByPlaceholder('VD: 500000').fill('200000');
    await page.getByRole('button', { name: 'Lưu Thay Đổi' }).click();
    await expect(page.getByText('Sửa Mã Khuyến Mãi')).toBeHidden();
    await expect(hang(maCode)).toContainText('200K');

    // Xoá để dọn dữ liệu test
    await hang(maCode).getByTitle('Xóa voucher').click();
    await page.getByRole('button', { name: 'Xóa Voucher', exact: true }).click();
    await expect(hang(maCode)).toBeHidden({ timeout: 10000 });
});
