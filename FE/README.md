# 💻 Laptop New - Frontend (Next.js)

Giao diện người dùng cho hệ thống thương mại điện tử **Laptop New**, được xây dựng bằng **Next.js (App Router)** và **Tailwind CSS v4**.

> 💡 Xem tài liệu toàn diện của cả dự án (gồm cả Backend & MongoDB) tại file: [`../README.md`](../README.md)

---

## 🚀 Cách chạy Frontend

```bash
# 1. Cài đặt thư viện (nếu chưa có node_modules)
npm install

# 2. Khởi chạy server phát triển
npm run dev
```

Truy cập trang web tại: **[http://localhost:3000](http://localhost:3000)**

---

## ⚙️ Cấu hình biến môi trường (`.env.local`)

Đảm bảo file `.env.local` đã trỏ về đúng cổng Backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📁 Cấu trúc thư mục Frontend

- `app/`: Các trang giao diện (Trang chủ, Sản phẩm, Giỏ hàng, So sánh, Đơn hàng, Tin tức, Admin...)
- `components/`: Các UI component chia theo tính năng
- `contexts/`: Quản lý trạng thái giỏ hàng, người dùng, so sánh
- `services/`: Hàm gọi API giao tiếp với Backend Express
- `public/`: Hình ảnh, icons, tài nguyên tĩnh
