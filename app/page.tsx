import { env } from "cloudflare:workers";
import { chatGPTSignInPath, getChatGPTUser } from "./chatgpt-auth";
import TrainingPortal from "./training-portal";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getChatGPTUser();

  if (!user) {
    return (
      <main className="login-shell">
        <section className="login-card">
          <div className="brand-mark">T</div>
          <p className="eyebrow">TAKI SALES LAB</p>
          <h1>Luyện tư vấn với khách hàng AI khó tính</h1>
          <p className="login-copy">
            Đăng nhập để lưu điểm, lịch sử hội thoại và nhận chữa bài ngay sau từng câu trả lời.
          </p>
          <a className="primary-button login-button" href={chatGPTSignInPath("/")} target="_top">
            Đăng nhập bằng ChatGPT
          </a>
          <p className="login-note">Không cần tạo thêm mật khẩu. Lần đầu bạn chỉ cần nhập tên và đội nhóm.</p>
        </section>
      </main>
    );
  }

  const runtimeEnv = env as unknown as Record<string, unknown>;
  const adminEmail = String(runtimeEnv.TAKI_ADMIN_EMAIL ?? "").trim().toLowerCase();

  return (
    <TrainingPortal
      identity={{ id: user.userId, email: user.email, name: user.displayName }}
      isAdmin={Boolean(user.email && user.email.toLowerCase() === adminEmail)}
    />
  );
}
