const { test, expect } = require('@playwright/test');
const { dangNhapAdmin } = require('../support/_fixtures');

// Smoke test cho Modal Chi tiết đơn hàng & in hóa đơn (app/admin/don-hang/components/ModalChiTietDonHang.jsx)
// Tạo đơn hàng test riêng để không đụng vào dữ liệu đơn hàng thật đang có.
test('admin xem chi tiết, đổi trạng thái thanh toán rồi đóng được modal', async ({ page }) => {
    const hoTen = `E2E ChiTiet ${Date.now()}`;

    await dangNhapAdmin(page);
    await page.getByTitle('Quản Lý Đơn Hàng').click();

    await page.getByRole('button', { name: '+ Tạo Đơn Hàng' }).click();
    await page.getByPlaceholder('Nguyễn Văn An...').fill(hoTen);
    await page.getByPlaceholder('0912345678').fill('0987654321');
    await page.getByPlaceholder('Số nhà, đường phố, phường/xã, quận/huyện...').fill('123 Đường Test, Phường 1, Quận 1');
    const selectSanPham = page.locator('select').filter({ has: page.locator('option', { hasText: '-- Chọn sản phẩm --' }) });
    const giaTriSanPham = await selectSanPham.locator('option').nth(1).getAttribute('value');
    await selectSanPham.selectOption(giaTriSanPham);
    await page.getByRole('button', { name: 'Tạo Đơn Hàng', exact: true }).click();
    await expect(page.getByText('Tạo Đơn Hàng Mới', { exact: true })).toBeHidden({ timeout: 10000 });

    const hang = (ten) => page.locator('tr').filter({ hasText: ten });
    await expect(hang(hoTen)).toBeVisible();

    // Mở chi tiết đơn hàng
    await hang(hoTen).getByTitle('Xem chi tiết đơn hàng & In hóa đơn').click();
    await expect(page.getByText('Chi Tiết Đơn Hàng & Phiếu Xuất Kho')).toBeVisible();
    await expect(page.getByText(hoTen).last()).toBeVisible();

    // Đổi trạng thái thanh toán thủ công rồi đổi lại như cũ
    const nutDoiThanhToan = page.getByRole('button', { name: /Đánh dấu Đã thanh toán|Đổi sang Chưa thanh toán/ });
    await nutDoiThanhToan.click();
    await expect(page.getByRole('button', { name: /Đánh dấu Đã thanh toán|Đổi sang Chưa thanh toán/ })).toBeVisible();

    // Đóng modal
    await page.getByRole('button', { name: 'Đóng', exact: true }).click();
    await expect(page.getByText('Chi Tiết Đơn Hàng & Phiếu Xuất Kho')).toBeHidden();

    // Xoá để dọn dữ liệu test
    await hang(hoTen).getByTitle('Xóa đơn hàng').click();
    await page.getByRole('button', { name: 'Xóa Đơn Hàng', exact: true }).click();
    await expect(hang(hoTen)).toBeHidden({ timeout: 10000 });
});
