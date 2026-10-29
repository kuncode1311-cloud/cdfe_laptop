const { test, expect } = require('@playwright/test');
const { dangNhapAdmin } = require('./_fixtures');

// Smoke test cho Modal Thêm/Sửa thương hiệu-danh mục (app/admin/danh-muc/components/ModalThuongHieu.jsx)
test('admin thêm, sửa rồi xoá được một thương hiệu', async ({ page }) => {
    const tenGoc = `E2E Brand ${Date.now()}`;
    const tenSua = `${tenGoc} Sua`;

    await dangNhapAdmin(page);
    await page.getByTitle('Hãng & Danh Mục').click();

    // Thêm mới
    await page.getByRole('button', { name: /Thêm thương hiệu/i }).click();
    await expect(page.getByText('Thêm Mới Thương Hiệu')).toBeVisible();
    await page.getByPlaceholder('Ví dụ: ASUS, Dell, Lenovo, Apple, MSI, Razer...').fill(tenGoc);
    await page.getByRole('button', { name: 'Thêm Mới' }).click();
    await expect(page.getByText('Thêm Mới Thương Hiệu')).toBeHidden();

    const theCard = (ten) => page.locator('div').filter({ hasText: ten }).filter({ has: page.getByTitle('Sửa') }).last();
    await expect(theCard(tenGoc)).toBeVisible();

    // Sửa
    await theCard(tenGoc).getByTitle('Sửa').click();
    await expect(page.getByText('Chỉnh Sửa Thương Hiệu')).toBeVisible();
    const oTenInput = page.getByPlaceholder('Ví dụ: ASUS, Dell, Lenovo, Apple, MSI, Razer...');
    await oTenInput.fill(tenSua);
    await page.getByRole('button', { name: 'Lưu Thay Đổi' }).click();
    await expect(page.getByText('Chỉnh Sửa Thương Hiệu')).toBeHidden();
    await expect(theCard(tenSua)).toBeVisible();

    // Xoá để dọn dữ liệu test
    await theCard(tenSua).getByTitle('Xóa').click();
    await page.getByRole('button', { name: 'Xóa Thương Hiệu' }).click();
    await expect(page.getByText(tenSua, { exact: true })).toBeHidden({ timeout: 10000 });
});
