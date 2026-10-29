const { test, expect } = require('@playwright/test');
const { dangNhapKhachHang } = require('../support/_fixtures');

// Smoke test cho tab Hồ Sơ Cá Nhân (components/tai-khoan/HoSoCaNhan.jsx)
// và Modal Chọn Avatar (components/tai-khoan/ModalChonAvatar.jsx)
test('khách hàng cập nhật được hồ sơ cá nhân và avatar', async ({ page }) => {
    await dangNhapKhachHang(page);
    await page.goto('/tai-khoan');
    await page.getByRole('button', { name: /Hồ Sơ Cá Nhân/ }).first().click();
    await expect(page.getByText('Hồ Sơ Cá Nhân & Thẻ Thành Viên')).toBeVisible();

    // Sửa họ tên (giữ nguyên nội dung, chỉ bấm Lưu) để xác nhận form submit nối đúng tới xuLyLuuHoSo
    // sau khi tách component -- không assert giá trị round-trip vì AuthContext tự đồng bộ lại
    // form từ nguoiDung sau khi lưu (hành vi gốc, ngoài phạm vi refactor cấu trúc này).
    await page.getByRole('button', { name: 'Lưu Thông Tin Hồ Sơ' }).click();
    await expect(page.getByText('Đang lưu thông tin...')).toBeHidden({ timeout: 10000 });
    await expect(page.getByText('Hồ Sơ Cá Nhân & Thẻ Thành Viên')).toBeVisible();

    // Modal chọn avatar: mở, chọn 1 ảnh preset (áp dụng ngay), rồi mở lại và đặt về icon mặc định (dọn dữ liệu test)
    await page.getByTitle('Đổi ảnh đại diện').click();
    await expect(page.getByText('Chọn Ảnh Đại Diện TNTP')).toBeVisible();
    await page.locator('.grid.grid-cols-3 button').nth(1).click();
    await expect(page.getByText('Chọn Ảnh Đại Diện TNTP')).toBeHidden();

    await page.getByTitle('Đổi ảnh đại diện').click();
    await expect(page.getByText('Chọn Ảnh Đại Diện TNTP')).toBeVisible();
    await page.getByRole('button', { name: 'Icon Mặc Định' }).click();
    await expect(page.getByText('Chọn Ảnh Đại Diện TNTP')).toBeHidden();
});
