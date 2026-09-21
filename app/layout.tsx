import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sales Lab Đa Ngành · TAKI",
  description: "Hệ thống luyện sales đa ngành với khách hàng AI khó tính và chữa bài theo quy trình TAKI.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
