# 💻 LAPTOP NEW - HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ BÁN LAPTOP

Dự án website bán laptop trực tuyến full-stack, được xây dựng với **Next.js** (Frontend) và **Express.js + MongoDB Atlas** (Backend).

---

## 📌 Mục lục

- [Giới thiệu tổng quan](#-giới-thiệu-tổng-quan)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Hướng dẫn cài đặt & Khởi chạy](#-hướng-dẫn-cài-đặt--khởi-chạy)
    - [1. Khởi chạy Backend (BE)](#1-khởi-chạy-backend-be)
    - [2. Khởi chạy Frontend (FE)](#2-khởi-chạy-frontend-fe)
- [Danh sách tính năng chính](#-danh-sách-tính-năng-chính)
- [Hệ thống API Backend](#-hệ-thống-api-backend)
- [Tài khoản & Phân quyền](#-tài-khoản--phân-quyền)

---

## 🌟 Giới thiệu tổng quan

**Laptop New** là đồ án chuyên đề xây dựng website bán hàng trực tuyến chuyên về các dòng laptop (văn phòng, gaming, đồ họa, mỏng nhẹ...). Website cung cấp trải nghiệm mua sắm hiện đại, mượt mà với giao diện chuẩn UI/UX, hỗ trợ so sánh thông số kỹ thuật, quản lý giỏ hàng, áp mã giảm giá và trang quản trị (Admin).

---

## 🛠 Công nghệ sử dụng

### 1. Frontend (`/FE`)

- **Framework:** Next.js (App Router), React 19
- **Styling:** Tailwind CSS v4, Lucide React (Icons)
- **Hiệu ứng & Animation:** Framer Motion, GSAP, Three.js, Canvas Confetti
- **Thông báo (Toast):** Sonner

### 2. Backend (`/BE`)

- **Nền tảng:** Node.js, Express.js
- **Cơ sở dữ liệu:** MongoDB Atlas qua thư viện ODM **Mongoose**
- **Xác thực & Bảo mật:** JSON Web Token (JWT), bcryptjs (mã hóa mật khẩu), CORS
- **Công cụ dev:** Nodemon, Dotenv

---

## 📂 Cấu trúc thư mục

```text
LAPTOP_NEW/
├── README.md               # File tài liệu dự án (File này)
├── BE/                     # Backend Source Code (Express.js)
│   ├── config/             # Cấu hình kết nối DB (db.config.js)
│   ├── controllers/        # Logic xử lý nghiệp vụ (Sản phẩm, Đơn hàng, Auth...)
│   ├── middleware/         # Middleware xác thực JWT, phân quyền
│   ├── models/             # Schema Mongoose (Người dùng, Laptop, Tin tức...)
│   ├── routes/             # Định tuyến API (/api/...)
│   ├── scripts/            # Script nạp dữ liệu mẫu (nap-du-lieu.js)
│   ├── .env                # Biến môi trường (PORT, MONGODB_URI, JWT_SECRET)
│   ├── server.js           # Entry point của Backend
│   └── package.json
│
└── FE/                     # Frontend Source Code (Next.js)
    ├── app/                # Next.js App Router (Các trang giao diện)
    │   ├── admin/          # Trang quản trị
    │   ├── san-pham/       # Danh sách & chi tiết sản phẩm
    │   ├── gio-hang/       # Giỏ hàng
    │   ├── thanh-toan/     # Đặt hàng & thanh toán
    │   ├── so-sanh/        # So sánh 2-3 mẫu laptop
    │   ├── yeu-thich/      # Sản phẩm đã lưu
    │   ├── don-hang/       # Tra cứu lịch sử đơn hàng
    │   ├── tin-tuc/        # Blog công nghệ
    │   └── ...             # Các trang giới thiệu, bảo hành, liên hệ...
    ├── components/         # Các UI component tái sử dụng
    ├── contexts/           # React Context (Giỏ hàng, Auth, So sánh...)
    ├── services/           # Gọi API từ Backend
    ├── .env.local          # Cấu hình biến môi trường (NEXT_PUBLIC_API_URL)
    └── package.json
```

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

> **Yêu cầu môi trường:** Đã cài đặt [Node.js](https://nodejs.org/).

### Cách 1: Chạy cả 2 cùng lúc bằng 1 lệnh duy nhất (Khuyên dùng) ⚡

Tại thư mục gốc của đồ án (`LAPTOP_NEW`), bạn chỉ cần mở **1 cửa sổ Terminal duy nhất** và gõ:

```bash
npm run dev
```

_(Hoặc click đúp chuột vào file `chay.bat` trong thư mục)_

Lệnh này sẽ tự động bật đồng thời cả **Backend (port 5000)** và **Frontend (port 3000)** trong cùng 1 màn hình terminal.

---

### Cách 2: Chạy riêng 2 Terminal độc lập (Nếu muốn kiểm tra log từng bên)

#### 1. Khởi chạy Backend (BE)

Mở Terminal 1:

```bash
cd BE
npm run dev
```

- **URL Backend:** `http://localhost:5000`
- _(Tùy chọn)_ Nếu muốn nạp lại dữ liệu mẫu vào MongoDB: `npm run seed`

#### 2. Khởi chạy Frontend (FE)

Mở Terminal 2:

```bash
cd FE
npm run dev
```

- **URL Frontend:** **[http://localhost:3000](http://localhost:3000)**

---

## 🎯 Danh sách tính năng chính

### Khách hàng (User / Client)

1. **Trang chủ:** Banner động, danh mục nổi bật, laptop gaming, laptop văn phòng, sản phẩm bán chạy.
2. **Bộ lọc & Tìm kiếm:** Lọc theo hãng, mức giá, nhu cầu, CPU, RAM, card đồ họa.
3. **Chi tiết sản phẩm:** Thông số kỹ thuật chi tiết, hình ảnh thực tế, đánh giá và nhận xét.
4. **So sánh cấu hình:** Cho phép chọn và đối chiếu chi tiết thông số giữa các sản phẩm.
5. **Yêu thích & Giỏ hàng:** Lưu sản phẩm yêu thích, quản lý số lượng giỏ hàng theo thời gian thực (LocalStorage + State).
6. **Mã giảm giá (Coupon):** Nhập mã voucher và tự động tính toán chiết khấu đơn hàng.
7. **Đặt hàng & Tra cứu:** Điền thông tin giao hàng, chọn hình thức thanh toán và tra cứu tình trạng đơn hàng.
8. **Tin tức công nghệ:** Xem bài viết, mẹo thủ thuật và tin tức laptop mới nhất.

### Quản trị viên (Admin)

- Quản lý danh mục & sản phẩm (Thêm, sửa, xóa, cập nhật tồn kho/giá bán).
- Quản lý đơn đặt hàng của khách hàng (Cập nhật trạng thái: Chờ xử lý, Đang giao, Đã giao, Hủy).
- Quản lý mã khuyến mãi, voucher giảm giá.
- Quản lý tin tức & tài khoản người dùng.

---

## 📡 Hệ thống API Backend (`/api/...`)

| Endpoint           |         Method         | Chức năng                                      |
| :----------------- | :--------------------: | :--------------------------------------------- |
| `/api/san-pham`    | GET, POST, PUT, DELETE | Quản lý & lấy danh sách, chi tiết laptop       |
| `/api/danh-muc`    | GET, POST, PUT, DELETE | Danh mục thương hiệu & phân khúc               |
| `/api/don-hang`    |     GET, POST, PUT     | Tạo đơn hàng, xem lịch sử, cập nhật trạng thái |
| `/api/ma-giam-gia` | GET, POST, PUT, DELETE | Quản lý mã giảm giá, kiểm tra voucher          |
| `/api/xac-thuc`    |          POST          | Đăng ký, đăng nhập (Cấp Token JWT)             |
| `/api/nguoi-dung`  |        GET, PUT        | Thông tin cá nhân & quản lý tài khoản          |
| `/api/danh-gia`    |       GET, POST        | Đánh giá & bình luận sản phẩm                  |
| `/api/tin-tuc`     | GET, POST, PUT, DELETE | Bài viết & tin tức công nghệ                   |

---

## ⚙️ Biến môi trường quan trọng

- **BE (`BE/.env`):**
    - `PORT=5000`
    - `MONGODB_URI`: Đường dẫn kết nối MongoDB Atlas
    - `CLIENT_URL=http://localhost:3000`
    - `JWT_SECRET`: Khóa bí mật mã hóa token JWT

- **FE (`FE/.env.local`):**
    - `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
