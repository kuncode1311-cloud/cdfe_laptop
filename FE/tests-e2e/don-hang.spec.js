const { test, expect } = require('@playwright/test');
const { dangNhapAdmin } = require('./_fixtures');

// Smoke test cho Modal Tạo/Sửa đơn hàng (app/admin/don-hang/components/ModalDonHang.jsx)
test('admin tạo, sửa rồi xoá được một đơn hàng', async ({ page }) => {
    const hoTen = `E2E Khach ${Date.now()}`;

    await dangNhapAdmin(page);
    await page.getByTitle('Quản Lý Đơn Hàng').click();

    // Tạo đơn hàng mới
    await page.getByRole('button', { name: '+ Tạo Đơn Hàng' }).click();
    await expect(page.getByText('Tạo Đơn Hàng Mới')).toBeVisible();
    await page.getByPlaceholder('Nguyễn Văn An...').fill(hoTen);
    await page.getByPlaceholder('0912345678').fill('0987654321');
    await page.getByPlaceholder('Số nhà, đường phố, phường/xã, quận/huyện...').fill('123 Đường Test, Phường 1, Quận 1');
    // Chọn sản phẩm đầu tiên có sẵn trong danh sách
    const selectSanPham = page.locator('select').filter({ has: page.locator('option', { hasText: '-- Chọn sản phẩm --' }) });
    const giaTriSanPham = await selectSanPham.locator('option').nth(1).getAttribute('value');
    await selectSanPham.selectOption(giaTriSanPham);
    await page.getByRole('button', { name: 'Tạo Đơn Hàng', exact: true }).click();
    await expect(page.getByText('Tạo Đơn Hàng Mới', { exact: true })).toBeHidden({ timeout: 10000 });

    const hang = (ten) => page.locator('tr').filter({ hasText: ten });
    await expect(hang(hoTen)).toBeVisible();

    // Sửa
    await hang(hoTen).getByTitle('Sửa thông tin đơn hàng').click();
    await expect(page.getByText('Cập Nhật Đơn Hàng')).toBeVisible();
    await page.getByPlaceholder('Số nhà, đường phố, phường/xã, quận/huyện...').fill('456 Đường Test Moi, Phường 2, Quận 2');
    await page.getByRole('button', { name: 'Lưu Thay Đổi' }).click();
    await expect(page.getByText('Cập Nhật Đơn Hàng', { exact: true })).toBeHidden();

    // Xoá để dọn dữ liệu test (BE sẽ tự hoàn trả tồn kho)
    await hang(hoTen).getByTitle('Xóa đơn hàng').click();
    await page.getByRole('button', { name: 'Xóa Đơn Hàng', exact: true }).click();
    await expect(hang(hoTen)).toBeHidden({ timeout: 10000 });
});
