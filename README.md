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
npm ci
npm run build
npm run dev
```

Đăng nhập mô phỏng tại `/signin-with-chatgpt?return_to=/`. Khi chạy với D1, áp dụng migration trong thư mục `drizzle/` bằng Wrangler theo môi trường triển khai.

## Cấu hình triển khai

- D1 binding: `DB`
- Biến môi trường: `TAKI_ADMIN_EMAIL` — email ChatGPT được cấp quyền admin
- Không commit `.env`, token hoặc thông tin đăng nhập vào repository

## Công nghệ

Next.js/Vinext, React, TypeScript, Cloudflare Workers, D1, Drizzle ORM và OpenAI Sites SIWC.
