# TAKI Sales Lab

Hệ thống luyện tư vấn đa ngành cho đội ngũ sales TAKI với khách hàng mô phỏng khó tính, chấm điểm từng câu và lưu lịch sử huấn luyện.

## Tính năng

- Đăng nhập an toàn bằng ChatGPT, không tự lưu mật khẩu.
- Đăng ký hồ sơ nội bộ đơn giản: họ tên và đội nhóm.
- 13 ngành: thời trang, phụ kiện, mỹ phẩm, F&B, gia dụng, công nghệ, giáo dục, du lịch, bất động sản, y tế, spa, nội thất và vật liệu xây dựng.
- 26 sản phẩm/dịch vụ mẫu cùng nhiều tình huống và bước bán hàng TAKI.
- Khách hàng mô phỏng phản hồi dựa trên câu sale vừa trả lời, bối cảnh và tiêu chí mua riêng của từng ngành.
- Chữa bài ngay sau từng câu: điểm, lỗi, câu gợi ý và bước quy trình.
- Lịch sử cá nhân và dashboard admin xem toàn bộ điểm, transcript.
- Dữ liệu lưu trên Cloudflare D1 khi triển khai bằng OpenAI Sites.

## Chạy cục bộ

Yêu cầu Node.js `>=22.13.0`.

```bash
git clone https://github.com/tuanlinh3003-a11y/saleslap.taki.git
cd saleslap.taki
npm ci
npm run test:dialogue
npm run build
npm run dev
```

Mở địa chỉ được in ra trong terminal. Bộ kiểm thử chuẩn của phiên bản này phải báo `147/147` trước khi triển khai.

Đăng nhập mô phỏng tại `/signin-with-chatgpt?return_to=/`. Khi chạy với D1, áp dụng migration trong thư mục `drizzle/` bằng Wrangler theo môi trường triển khai.

## Cấu hình triển khai

- D1 binding: `DB`
- Biến môi trường: `TAKI_ADMIN_EMAIL` — email ChatGPT được cấp quyền admin
- Để hành vi AI giống hệt bản đang chạy, không cấu hình `OPENAI_API_KEY`. Khi không có khóa này, hệ thống dùng bộ máy hội thoại thích ứng đã được kiểm thử và đóng gói trong repository.
- Không commit `.env`, token hoặc thông tin đăng nhập vào repository

## Cam kết giữ nguyên giao diện và quy trình

Repository này là mã nguồn đầy đủ của TAKI Sales Lab phiên bản 14, gồm giao diện, dữ liệu 13 ngành, sản phẩm, chân dung khách, quy trình TAKI, bộ chấm điểm, chữa từng câu và logic chống lặp.

Để bản cài đặt giữ nguyên như hệ thống mẫu:

1. Dùng đúng Node.js `>=22.13.0` và chạy `npm ci`; không thay bằng `npm update`.
2. Giữ nguyên `package-lock.json`, `app/data.ts`, `app/globals.css`, `app/training-portal.tsx` và `lib/training-engine.ts`.
3. Chạy `npm run test:dialogue`; chỉ triển khai khi toàn bộ 147 kiểm thử đều đạt.
4. Khi triển khai trên OpenAI Sites, khai báo D1 binding `DB`, chạy migration trong `drizzle/` và đặt `TAKI_ADMIN_EMAIL` cho tài khoản quản trị.
5. Không đặt `OPENAI_API_KEY` nếu cần câu hỏi, cách chấm và chữa bài giống chính xác phiên bản đã bàn giao.

Nếu thay model, prompt, dữ liệu ngành hoặc các tệp nêu trên, nội dung khách AI và kết quả chữa bài có thể thay đổi.

## Công nghệ

Next.js/Vinext, React, TypeScript, Cloudflare Workers, D1, Drizzle ORM và OpenAI Sites SIWC.
