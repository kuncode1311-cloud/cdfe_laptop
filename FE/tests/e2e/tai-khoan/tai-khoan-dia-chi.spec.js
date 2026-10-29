const { test, expect } = require('@playwright/test');
const { dangNhapKhachHang } = require('../support/_fixtures');

// Smoke test cho tab Sổ Địa Chỉ (components/tai-khoan/SoDiaChi.jsx + BoChonDiaGioi.jsx)
test('khách hàng thêm, sửa rồi xoá được một địa chỉ nhận hàng', async ({ page }) => {
    const hoTen = `E2E Nguoi Nhan ${Date.now()}`;

    await dangNhapKhachHang(page);
    await page.goto('/tai-khoan');
    await page.getByRole('button', { name: /Sổ Địa Chỉ Giao Hàng/ }).click();
    await expect(page.getByText('Sổ Địa Chỉ Nhận Hàng')).toBeVisible();

    // Thêm địa chỉ mới
    await page.getByRole('button', { name: 'Thêm Địa Chỉ Mới' }).click();
    await page.getByPlaceholder('Ví dụ: Nguyễn Văn A').fill(hoTen);
    await page.getByPlaceholder('Ví dụ: 0912 345 678').fill('0987654321');

    await page.getByRole('button', { name: 'Chọn Tỉnh / Thành phố...' }).click();
    await page.getByPlaceholder(/Tìm nhanh/).fill('Ha Noi');
    await page.getByText('Thành phố Hà Nội', { exact: true }).first().click();

    await page.getByRole('button', { name: /Chọn Phường \/ Xã/ }).click();
    // Chọn phường/xã đầu tiên trong danh sách gợi ý (không phụ thuộc tên cụ thể)
    await page.locator('.max-h-56 button').first().click();

    await page.getByPlaceholder('Ví dụ: Số 25, Đường Lê Lợi, Phường Bến Nghé').fill('123 Pho Test');
    await page.getByRole('button', { name: 'Lưu Địa Chỉ' }).click();

    const the = page.locator('div').filter({ hasText: hoTen }).filter({ has: page.getByTitle('Chỉnh sửa địa chỉ') }).last();
    await expect(the).toBeVisible({ timeout: 10000 });

    // Sửa
    await the.getByTitle('Chỉnh sửa địa chỉ').click();
    await expect(page.getByText('Cập Nhật Địa Chỉ Nhận Hàng')).toBeVisible();
    await page.getByPlaceholder('Ví dụ: Số 25, Đường Lê Lợi, Phường Bến Nghé').fill('456 Pho Test Moi');
    await page.getByRole('button', { name: 'Cập Nhật' }).click();
    await expect(page.getByText('Cập Nhật Địa Chỉ Nhận Hàng')).toBeHidden();
    await expect(page.getByText('456 Pho Test Moi')).toBeVisible();

    // Xoá để dọn dữ liệu test
    const theSua = page.locator('div').filter({ hasText: hoTen }).filter({ has: page.getByTitle('Xóa địa chỉ') }).last();
    await theSua.getByTitle('Xóa địa chỉ').click();
    await expect(page.getByText(hoTen)).toBeHidden({ timeout: 10000 });
});
