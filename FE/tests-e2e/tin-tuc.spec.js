const { test, expect } = require('@playwright/test');
const { dangNhapAdmin } = require('./_fixtures');

// Smoke test cho Modal Thêm/Sửa tin tức (components/admin/ModalTinTuc.jsx)
test('admin viết, sửa rồi xoá được một bài tin tức', async ({ page }) => {
    const tieuDe = `E2E Bai Viet ${Date.now()}`;

    await dangNhapAdmin(page);
    await page.getByTitle('Quản Lý Tin Tức & Bài Viết').click();

    // Viết bài mới
    await page.getByRole('button', { name: /Viết Bài Tin Tức Mới/i }).click();
    await expect(page.getByText('Soạn Thảo Bài Viết Mới')).toBeVisible();
    await page.getByPlaceholder('Top 5 Laptop Gaming RTX 40 Series Đáng Mua Nhất...').fill(tieuDe);
    await page.getByPlaceholder('Đoạn văn ngắn 1-2 câu tóm lược nội dung bài viết...').fill('Tóm tắt test tự động.');
    await page.getByRole('button', { name: 'Lưu & Xuất Bản' }).click();
    await expect(page.getByText('Soạn Thảo Bài Viết Mới')).toBeHidden();

    const hang = (ten) => page.locator('tr').filter({ hasText: ten });
    await expect(hang(tieuDe)).toBeVisible();

    // Sửa
    await hang(tieuDe).getByTitle('Chỉnh sửa bài viết').click();
    await expect(page.getByText('Chỉnh Sửa Bài Viết Tin Tức')).toBeVisible();
    await page.getByPlaceholder('5 phút đọc...').fill('3 phút đọc');
    await page.getByRole('button', { name: 'Lưu Thay Đổi' }).click();
    await expect(page.getByText('Chỉnh Sửa Bài Viết Tin Tức')).toBeHidden();

    // Xoá để dọn dữ liệu test
    await hang(tieuDe).getByTitle('Xóa bài viết').click();
    await page.getByRole('button', { name: 'Xóa Bài Viết', exact: true }).click();
    await expect(hang(tieuDe)).toBeHidden({ timeout: 10000 });
});
