# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tổng quan

Đồ án web bán laptop (TNTP Laptop, chạy tại trikun.site). Hai ứng dụng độc lập trong cùng repo, không dùng workspace:

- `BE/` — Express 5 + Mongoose 9 (CommonJS), MongoDB Atlas, JWT.
- `FE/` — Next.js 16 (App Router) + React 19 + Tailwind v4, JavaScript (không TypeScript dù có `typescript` trong devDependencies).

Mã nguồn dùng **tên biến/hàm/file và comment bằng tiếng Việt** (không dấu cho định danh, có dấu cho comment) và theo mô hình MVC ở BE. Giữ phong cách này, ưu tiên tái sử dụng hàm/component có sẵn trước khi viết mới.

`FE/AGENTS.md` cảnh báo Next.js bản này có breaking changes: đọc `FE/node_modules/next/dist/docs/` trước khi dùng API Next mà bạn không chắc.

## Lệnh thường dùng

Chạy cả hai cùng lúc (thư mục gốc): `npm run dev` (BE cổng 5000, FE cổng 3000; script gọi `concurrently` từ `FE/node_modules` nên phải `npm install` trong `FE` trước).

Backend (`cd BE`):

```bash
npm run dev               # nodemon server.js
npm test                  # jest --runInBand (toàn bộ)
npm run test:unit         # chỉ tests/unit
npx jest tests/integration/san-pham.test.js            # một file
npx jest tests/unit/tao-slug.test.js -t "tên ca test"  # một ca
npm run test:coverage     # CI chạy lệnh này
npm run lint && npm run format:check   # CI chạy cả hai; Prettier: 4 space, nháy đơn, printWidth 120, không dấu phẩy cuối
```

Frontend (`cd FE`):

```bash
npm run dev
npm run lint
npm run build             # CI chạy lint rồi build; không có unit test ở FE, không có Prettier
npx playwright test tests-e2e/san-pham.spec.js   # e2e (npm run test:e2e chạy tất cả), tự bật dev server ở :3000
```

E2E cần `FE/.env.e2e.local` (không commit) với `E2E_ADMIN_EMAIL`, `E2E_ADMIN_MATKHAU`, `E2E_KHACH_EMAIL`, `E2E_KHACH_MATKHAU`; helper đăng nhập ở `FE/tests-e2e/_fixtures.js`. Playwright chạy tuần tự (1 worker) trên dữ liệu thật của database mà BE đang trỏ tới.

Biến môi trường: mẫu ở `BE/.env.example` (JWT_SECRET, MONGODB_URI, PayOS, Brevo, Telegram, Gemini/9router…) và `FE/.env.example` (`NEXT_PUBLIC_API_URL`, Google client id, API địa giới hành chính).

## Kiến trúc backend

- `app.js` chỉ tạo và export `app` (không kết nối DB, không `listen`); `server.js` mới nạp dotenv, kết nối Mongo, listen và khởi động Telegram bot. Tách như vậy để Supertest nạp `app` trực tiếp.
- Luồng chuẩn: `routes/*.routes.js` → `controllers/*.controller.js` → `models/*.model.js`. Logic dùng lại/ngoại vi nằm ở `services/` (email Brevo, Telegram bot, trợ lý AI Gemini xoay key + 9router, tìm kiếm sản phẩm bằng AI, `kho-hang.service.js` trừ/hoàn tồn kho) và `utils/` (bảo mật, slug, mã giảm giá).
- Tất cả API dưới `/api/*` (đăng nhập là `/api/auth`, không phải `/api/xac-thuc`). Middleware toàn cục theo thứ tự: CORS whitelist (`CLIENT_URL`, nhiều origin ngăn bởi dấu phẩy; origin đầu tiên là trang quay về sau PayOS) → `datHeaderBaoMat` → `chongNoSqlInjection` → rate limit 300 req/phút → che `chi_tiet` lỗi ở production. Swagger tại `/api-docs`, đặc tả viết tay ở `docs/openapi.js`.
- Sản phẩm: `thong_so` là `Mixed` không có schema. Laptop dùng các khóa như `cpu, ram, o_cung, man_hinh, tan_so_quet…`; phụ kiện/linh kiện đang **mượn chính các khóa đó** để chứa thông tin khác (đế tản nhiệt có `cpu: "Sò lạnh…"`). Vì vậy mọi logic lọc theo cấu hình phải giới hạn trong laptop (`laLaptop` ở `FE/utils/bo-loc.js`). Tồn kho có nhiều nguồn dễ lệch nhau (`ton_kho[]` theo chi nhánh, `so_luong_ton_kho`, `con_hang`); đánh giá cũng có cả `danh_gia[]` nhúng lẫn collection `danh-gia`.
- Thanh toán PayOS/VietQR có webhook (`thanh-toan`), có test riêng `webhook-payos.test.js` với chữ ký giả lập.

### Kiểm thử BE

Jest + Supertest; integration test dùng `mongodb-memory-server` nên không cần DB thật hay key. Biến môi trường giả được đặt ở `tests/setup/bien-moi-truong.js` (chạy trước khi nạp module), dữ liệu mẫu/hàm khởi tạo DB ở `tests/helpers/`. Lần đầu chạy phải tải binary MongoDB (timeout 60s). Độ phủ chỉ đo `controllers/ middleware/ utils/ app.js`.

### scripts-local (nguy hiểm)

`BE/scripts-local/*.js` là script chạy tay, **kết nối thẳng database trong `BE/.env`** và phần lớn **xóa rồi nạp lại dữ liệu** (xem `scripts-local/README.md`). Nếu `.env` trỏ production thì chạy là ghi/xóa dữ liệu thật. Chỉ chạy khi `MONGODB_URI` là DB thử nghiệm. `BE/backup_db/*.json` là bản backup/seed, có thể đã cũ so với DB thật.

## Kiến trúc frontend

- Mọi lời gọi API đi qua `services/api-client.js` (`apiFetch`): ghép `NEXT_PUBLIC_API_URL`, tự gắn JWT từ localStorage (`tnt_laptop_token`), timeout 20s, và gọi hàm đăng xuất đã đăng ký khi gặp 401 ngoài luồng `/auth/*`. Mỗi miền nghiệp vụ có một `services/*.service.js`.
- `services/san-pham.service.js` giữ cache sản phẩm trong RAM và là nơi lọc phía client (`locSanPham`). **Lọc là client-side trên toàn bộ danh sách**, không phải query backend.
- **Đồng bộ thời gian thực không dùng websocket**: `services/dong-bo.service.js` hỏi `GET /api/dong-bo` mỗi vài giây (chữ ký từng bảng: số bản ghi + `updatedAt` lớn nhất); bảng nào đổi thì component dùng `useDuLieuMoi('san_pham')` nạp lại, đưa `phienBan` vào deps của `useEffect`. Admin sau khi ghi gọi `thongBaoThayDoi(bang)` để các tab khác làm mới ngay (BroadcastChannel). Thêm bảng mới phải khai báo cả ở `BE/controllers/dong-bo.controller.js`.
- Bộ lọc sản phẩm: **một nơi định nghĩa duy nhất** là `utils/bo-loc.js` (nhóm lọc cấu hình, công tắc, khoảng giá, luật `khop`, `taoBoLocMacDinh`). Thanh lọc nhanh (`ThanhBoLocTinhGon`), drawer (`BoLocSanPham`, vẽ qua portal để nằm trên chat widget), hook đếm theo bộ lọc đang chọn (`useThongKeBoLoc`) và `SanPhamService.locSanPham` đều đọc từ đó. Thêm nhóm lọc = thêm một phần tử vào `NHOM_LOC_MAY`. Class màu Tailwind phải viết đủ chuỗi trong `ThanhPhanBoLoc.jsx` (không ghép chuỗi động).
- Trang quản trị `app/admin/page.jsx` là file khổng lồ (~4.5k dòng) chứa gần như toàn bộ state/handler của admin; giao diện từng tab tách ra `components/admin/*` (ví dụ `ModalSanPham.jsx` ~3k dòng nhận hàng chục props từ page). Form thêm sản phẩm luôn bắt đầu rỗng qua `lamTrongFormSp`. Ảnh sản phẩm lưu **base64 ngay trong MongoDB** sau khi nén WebP phía client (`utils/anh-san-pham.js`), hoặc là link `https://`/`/images/...`.
- Context chung (`contexts/`): Auth, Cart, Compare, Theme, gom ở `AppProviders.jsx`. Ảnh dùng `next/image` với `remotePatterns` cho mọi host https.

## Triển khai

Hai service riêng trên Railway (BE và FE), domain `trikun.site` (FE) và `api.trikun.site` (BE) qua Cloudflare. Railway tự build khi push `main`; CI (`.github/workflows/ci.yml`) **không** triển khai, chỉ chạy BE (lint + prettier + jest coverage), FE (lint + build với `NEXT_PUBLIC_API_URL=https://api.trikun.site/api`) và smoke test production sau khi push `main`. Railpack chạy `npm install` rồi `npm run build` trong thư mục `FE`: **file mới phải được `git add`**, nếu không build trên Railway lỗi "Module not found" dù chạy local bình thường (phân biệt hoa/thường cũng khác giữa Windows và Linux).

Postman collection nằm ở `_tai_lieu_bao_cao/postman/` (bộ chính + bộ bổ sung); thư mục `_tai_lieu_bao_cao/` còn chứa báo cáo/slide, không phải mã nguồn.
