const { test, expect } = require('@playwright/test');
const { dangNhapAdmin } = require('./_fixtures');

// Smoke test cho Modal Thêm/Sửa khách hàng (app/admin/khach-hang/components/ModalKhachHang.jsx)
test('admin thêm, sửa rồi xoá được một khách hàng', async ({ page }) => {
    const email = `e2e.khachhang.${Date.now()}@laptopnew.vn`;

    await dangNhapAdmin(page);
    await page.getByTitle('Tài Khoản Khách Hàng').click();

    // Thêm mới
    await page.getByRole('button', { name: '+ Thêm Tài Khoản' }).click();
    await expect(page.getByText('Thêm Thành Viên Mới')).toBeVisible();
    await page.getByPlaceholder('Nguyễn Văn An...').fill('E2E Khach Hang');
    await page.getByPlaceholder('user@example.com').fill(email);
    await page.getByRole('button', { name: 'Thêm Tài Khoản', exact: true }).click();
    await page.getByRole('button', { name: 'Đã Hiểu' }).click();
    await expect(page.getByText('Thêm Thành Viên Mới')).toBeHidden();

    const hang = (ten) => page.locator('tr').filter({ hasText: ten });
    await expect(hang(email)).toBeVisible();

    // Sửa (khoá tài khoản)
    await hang(email).getByTitle('Sửa tài khoản').click();
    await expect(page.getByText('Cập Nhật Tài Khoản')).toBeVisible();
    await page.getByRole('combobox').filter({ hasText: /Đang Hoạt Động|Tạm Khóa/ }).last().selectOption('bi_khoa');
    await page.getByRole('button', { name: 'Lưu Thay Đổi' }).click();
    await expect(page.getByText('Cập Nhật Tài Khoản')).toBeHidden();

    // Xoá để dọn dữ liệu test
    await hang(email).getByTitle('Xóa tài khoản').click();
    await page.getByRole('button', { name: 'Xóa Tài Khoản', exact: true }).click();
    await expect(hang(email)).toBeHidden({ timeout: 10000 });
});
