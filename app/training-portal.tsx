"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { customerInsights, industries, industryForProduct, products, scenarios, takiSteps, type CustomerInsight, type Industry, type Product, type Scenario } from "./data";

type Identity = { id: string; email?: string; name?: string };
type Profile = { id: string; email: string; displayName: string; team: string; role: "sale" | "admin" };
type Feedback = { score: number; issue: string; corrected: string; process: string };
type Message = { id: string; role: "customer" | "sale"; text: string; feedback?: Feedback };
type SavedSession = {
  id: string;
  displayName?: string;
  email?: string;
  team?: string;
  productId: string;
  scenarioId: string;
  score: number;
  turns: number;
  metrics: Record<string, number>;
  transcript: Message[];
  createdAt: string;
};

const nonsense = /^(ok|ừ|uh|uk|haha|hihi|không biết|chịu|asdf|test|abc|123|gì vậy|linh tinh)[.!?\s]*$/i;
const questionWords = /(ạ|không|chưa|nào|bao nhiêu|vì sao|điều gì|khi nào|ai |chị có|chị đang|chị muốn)/i;
const empathyWords = /(em hiểu|em ghi nhận|em đồng ý|đúng là|chị đang lo|chị băn khoăn|tiếc là|cảm ơn chị)/i;
const evidenceWords = /(ví dụ|case|kết quả|số liệu|cam kết|lộ trình|thực tế|đã áp dụng|đo lường)/i;
const nextStepWords = /(hẹn|gọi|demo|đăng ký|xác nhận|giữ chỗ|bước tiếp|thời gian nào|ngày nào)/i;

const uid = () => crypto.randomUUID();
const productName = (id: string) => products.find((item) => item.id === id)?.name ?? id;
const industryName = (productId: string) => industryForProduct(productId).name;
const scenarioName = (id: string) => scenarios.find((item) => item.id === id)?.name ?? id;
const formatDate = (value: string) => new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

export function openingFor(industry: Industry, scenario: Scenario, product: Product, customer: CustomerInsight) {
  const openings: Record<Scenario["objection"], string> = {
    time: `Chị đang tranh thủ có mấy phút thôi. ${customer.need.charAt(0).toUpperCase()}${customer.need.slice(1)}. Em hỏi nhanh giúp chị nhé.`,
    price: `${customer.budget.charAt(0).toUpperCase()}${customer.budget.slice(1)}. Nhưng ${lowerFirst(industry.priceChallenge)}`,
    trust: `${customer.past.charAt(0).toUpperCase()}${customer.past.slice(1)} nên giờ chị khá ngại nghe cam kết. ${industry.proofChallenge}`,
    authority: `${customer.decision.charAt(0).toUpperCase()}${customer.decision.slice(1)}. Nếu muốn chị mang thông tin về bàn tiếp thì em sẽ đưa cho chị những gì?`,
    fit: `${customer.situation.charAt(0).toUpperCase()}${customer.situation.slice(1)}. Chị chưa chắc ${product.name} có hợp với mình đâu, em cần biết thêm gì?`,
    competition: `Chị đang xem thêm hai bên khác nữa. ${industry.comparisonChallenge}`,
  };
  return openings[scenario.objection];
}

function correctionFor(text: string, scenario: Scenario, product: Product, industry: Industry, lastCustomer: string): Feedback {
  const clean = text.trim();
  const tooShort = clean.length < 24;
  const isNonsense = !clean || nonsense.test(clean);
  const asks = questionWords.test(clean) || clean.includes("?");
  const empathizes = empathyWords.test(clean);
  const hasEvidence = evidenceWords.test(clean);
  const hasNextStep = nextStepWords.test(clean);
  const mentionsNeed = /(mục tiêu|hiện tại|khó|vướng|ưu tiên|doanh thu|quy trình|đội ngũ|thời gian|ngân sách|kết quả|nhu cầu|rủi ro|phù hợp)/i.test(clean);
  const grounded = industry.keywords.some((keyword) => clean.toLowerCase().includes(keyword));
  const customerTerms = lastCustomer.toLowerCase().split(/[^a-zà-ỹ0-9]+/i).filter((word) => word.length >= 5);
  const connected = customerTerms.some((word) => clean.toLowerCase().includes(word));

  let score = isNonsense ? 4 : 18;
  if (!tooShort) score += 12;
  if (empathizes) score += 18;
  if (asks) score += 20;
  if (mentionsNeed) score += 16;
  if (hasEvidence) score += 10;
  if (grounded) score += 10;
  if (connected) score += 8;
  if (hasNextStep) score += scenario.step >= 7 ? 14 : 5;
  if (clean.length > 360) score -= 12;
  if (!grounded && !connected) score -= 12;
  score = Math.max(0, Math.min(100, score));

  let issue = "Câu trả lời chưa cho thấy bạn đã hiểu đúng nỗi lo và chưa có câu hỏi khai thác cụ thể.";
  if (isNonsense) issue = "Câu trả lời không liên quan đến lời khách; không đủ dữ kiện để tư vấn và không được tính điểm quy trình.";
  else if (!connected && !grounded) issue = `Bạn chưa trả lời trọng tâm khách vừa hỏi và chưa dùng dữ kiện đặc thù ngành ${industry.name.toLowerCase()}.`;
  else if (!empathizes) issue = "Bạn đi thẳng vào giải pháp trước khi xác nhận nỗi lo của khách.";
  else if (!asks) issue = "Bạn đã ghi nhận nhưng chưa hỏi một câu giúp làm rõ tình trạng thực tế.";
  else if (clean.length > 360) issue = "Câu trả lời quá dài; khách khó tính sẽ cảm thấy bị thuyết trình thay vì được lắng nghe.";
  else if (scenario.step >= 7 && !hasNextStep) issue = "Lập luận đã khá hơn nhưng chưa chốt một hành động hoặc mốc thời gian rõ ràng.";
  else if (score >= 75) issue = "Câu trả lời bám tình huống; có thể sắc hơn bằng một dữ kiện đo lường hoặc bước tiếp cụ thể.";

  const suggestions: Record<Scenario["objection"], string> = {
    time: `Dạ em hiểu chị cần câu trả lời ngắn và đúng trọng tâm. ${industry.diagnosticQuestion} Khi có dữ kiện đó, em sẽ nói thẳng ${product.name} có phù hợp hay không.`,
    price: `Dạ, so sánh giá là hợp lý. Với nhóm ${industry.name.toLowerCase()}, chị đang ưu tiên ${industry.decisionCriteria}? Em xin làm rõ tiêu chí quan trọng nhất rồi mới phân tích phần chênh của ${product.name}.`,
    trust: `Em hiểu chị cần bằng chứng chứ không cần lời hứa. Em sẽ cung cấp ${industry.proofDemand}. Trước hết, ${industry.diagnosticQuestion.toLowerCase()}`,
    authority: `Dạ, mình chưa cần quyết ngay. Người cùng quyết định với chị quan tâm nhất đến ${industry.decisionCriteria}? Em sẽ chuẩn bị đúng dữ kiện và mình hẹn một bước trao đổi cụ thể với đủ người liên quan.`,
    fit: `Dạ, em chưa thể kết luận phù hợp khi thiếu dữ kiện. ${industry.diagnosticQuestion} Sau đó em sẽ đối chiếu rõ phần ${product.name} đáp ứng được và phần không đáp ứng được.`,
    competition: `Dạ, chị nên so sánh trên cùng tiêu chí. Mình dùng ${industry.decisionCriteria}; em sẽ chỉ ra điểm khác biệt kiểm chứng được của ${product.name} và trường hợp bên khác phù hợp hơn.`,
  };

  return { score, issue, corrected: suggestions[scenario.objection], process: `Bước ${scenario.step} · ${takiSteps[scenario.step - 1]}` };
}

function askedFacts(answer: string, customer: CustomerInsight) {
  const clean = answer.toLowerCase();
  const facts: string[] = [];
  if (/(mục tiêu|mong muốn|ưu tiên|nhu cầu)/i.test(clean)) facts.push(customer.need);
  if (/(khi nào|bao giờ|thời gian|rảnh|gấp|ngày|tuần|tháng)/i.test(clean)) facts.push(customer.timing);
  if (/(từng|trước đây|đã dùng|đã mua|đã học|kinh nghiệm|lần trước)/i.test(clean)) facts.push(customer.past);
  if (/(giá|ngân sách|chi phí|đầu tư|học phí|mức tiền)/i.test(clean)) facts.push(customer.budget);
  if (/(ai quyết|người quyết|chồng|vợ|gia đình|sếp|phê duyệt)/i.test(clean)) facts.push(customer.decision);
  if (/(lo|ngại|sợ|rủi ro|băn khoăn)/i.test(clean)) facts.push(customer.fear);
  const unique = [...new Set(facts)];
  return unique.length ? unique.slice(0, 3).map((fact) => fact.charAt(0).toUpperCase() + fact.slice(1)).join(". ") : customer.situation;
}

function pickFresh(candidates: string[], previousCustomer: string[], turn: number) {
  const fresh = candidates.filter((item) => !previousCustomer.some((message) => message.includes(item)));
  const pool = fresh.length ? fresh : candidates;
  return pool[turn % pool.length];
}

export function customerReply(answer: string, scenario: Scenario, product: Product, industry: Industry, customer: CustomerInsight, turn: number, previousCustomer: string[]): string {
  if (!answer.trim() || nonsense.test(answer.trim())) {
    return [
      "Chị chưa thấy câu đó liên quan đến điều chị vừa hỏi. Em có thể trả lời thẳng vào vấn đề được không?",
      "Nếu em chưa hiểu ý chị thì hỏi lại cho rõ, đừng trả lời cho có nhé.",
      "Câu vừa rồi chưa giúp chị có thêm dữ kiện nào để quyết định cả.",
    ][turn % 3];
  }

  const clean = answer.toLowerCase();
  const asked = clean.includes("?") || questionWords.test(clean);
  const mentionsWarranty = /(bảo hành|đổi trả|hậu mãi|hỗ trợ sau)/i.test(clean);
  const mentionsPrice = /(giảm|khuyến mãi|giá|chi phí|rẻ|ngân sách)/i.test(clean);
  const mentionsProof = /(cam kết|bằng chứng|chứng nhận|case|số liệu|hồ sơ)/i.test(clean);
  const mentionsComparison = /(so sánh|đối thủ|bên khác|phương án khác)/i.test(clean);

  const bank: Record<Scenario["objection"], string[]> = {
    time: [
      "Chị chỉ cần biết điểm nào thật sự liên quan đến trường hợp của mình thôi, em đừng giới thiệu hết nhé.",
      industry.challenges[0], industry.afterSalesChallenge, industry.challenges[1], industry.challenges[2],
    ],
    price: [
      `Nếu chọn ${product.name} thì phần nào đáng để chị trả thêm tiền nhất?`, industry.priceChallenge, industry.challenges[3], industry.afterSalesChallenge, industry.comparisonChallenge,
    ],
    trust: [
      industry.proofChallenge, industry.challenges[1], industry.challenges[2], industry.afterSalesChallenge, `Nói thật giúp chị: ${product.name} có điểm gì bên em không thể cam kết?`,
    ],
    authority: [
      "Người cùng quyết định với chị sẽ không nghe lời quảng cáo đâu. Em có gì đủ rõ để chị gửi họ xem?", industry.proofChallenge, industry.priceChallenge, "Chị chưa muốn đặt cọc hay thanh toán ngay. Có bước nào để kiểm tra trước không?", industry.afterSalesChallenge,
    ],
    fit: [
      industry.challenges[0], industry.challenges[2], industry.challenges[4], `Với trường hợp của chị, có lý do nào để không nên chọn ${product.name} không?`, `Em dựa vào đâu để biết ${product.name} thực sự hợp với nhu cầu này?`,
    ],
    competition: [
      industry.comparisonChallenge, industry.proofChallenge, industry.priceChallenge, `Có trường hợp nào chị nên chọn bên khác thay vì ${product.name} không?`, "Em nói ngắn gọn ba điểm để chị tự so được không?",
    ],
  };
  const reactive = [
    ...(mentionsWarranty ? [industry.afterSalesChallenge] : []),
    ...(mentionsPrice ? [industry.priceChallenge] : []),
    ...(mentionsProof ? [industry.proofChallenge] : []),
    ...(mentionsComparison ? [industry.comparisonChallenge] : []),
    ...bank[scenario.objection],
  ];
  const challenge = pickFresh(reactive, previousCustomer, turn);
  if (!asked) return challenge;

  const fact = askedFacts(answer, customer);
  const bridges: Record<CustomerInsight["voice"], string[]> = {
    direct: ["Còn một điểm chị muốn hỏi rõ.", "Nhưng chị cần em nói thẳng chỗ này.", "Được, vậy còn chuyện này."],
    cautious: ["Chị hiểu. Nhưng chị vẫn hơi lo một việc.", "Ừ, đúng tình trạng của chị. Chị hỏi thêm nhé.", "Vậy thì em làm rõ giúp chị một việc."],
    impatient: ["Ừ, nhưng đi thẳng vào ý này giúp chị.", "Được rồi, còn điểm này.", "Chị hiểu. Giờ trả lời nhanh giúp chị."],
    skeptical: ["Nhưng nói thật nhé, chị vẫn chưa yên tâm.", "Ừ, chị nghe rồi. Còn việc này thì sao?", "Chị cần kiểm tra thêm một điểm."],
  };
  const bridge = bridges[customer.voice][turn % bridges[customer.voice].length];
  return `${fact.charAt(0).toUpperCase()}${fact.slice(1)}. ${bridge} ${challenge}`;
}

export default function TrainingPortal({ identity, isAdmin }: { identity: Identity; isAdmin: boolean }) {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [tab, setTab] = useState<"train" | "history" | "admin">("train");
  const [industryId, setIndustryId] = useState(industries[0].id);
  const [productId, setProductId] = useState(products[0].id);
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [customerIndex, setCustomerIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [adminSessions, setAdminSessions] = useState<SavedSession[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);

  const industry = useMemo(() => industries.find((item) => item.id === industryId) ?? industries[0], [industryId]);
  const availableProducts = useMemo(() => products.filter((item) => item.industryId === industry.id), [industry]);
  const product = useMemo(() => products.find((item) => item.id === productId) ?? availableProducts[0] ?? products[0], [productId, availableProducts]);
  const scenario = useMemo(() => scenarios.find((item) => item.id === scenarioId) ?? scenarios[0], [scenarioId]);
  const customerOptions = customerInsights[industry.id] ?? [];
  const customer = customerOptions[customerIndex] ?? customerOptions[0];
  const saleMessages = messages.filter((message) => message.role === "sale");
  const score = saleMessages.length ? Math.round(saleMessages.reduce((sum, item) => sum + (item.feedback?.score ?? 0), 0) / saleMessages.length) : 0;

  useEffect(() => {
    fetch("/api/me").then((res) => res.json()).then((data) => setProfile(data.profile ?? null)).catch(() => setProfile(null));
  }, []);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function startTraining() {
    setMessages([{ id: uid(), role: "customer", text: openingFor(industry, scenario, product, customer) }]);
    setSaved(false);
    setTab("train");
  }

  function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || saved) return;
    const lastCustomer = [...messages].reverse().find((message) => message.role === "customer")?.text ?? "";
    const feedback = correctionFor(text, scenario, product, industry, lastCustomer);
    const turn = saleMessages.length;
    setMessages((current) => [
      ...current,
      { id: uid(), role: "sale", text, feedback },
      { id: uid(), role: "customer", text: customerReply(text, scenario, product, industry, customer, turn, messages.filter((message) => message.role === "customer").map((message) => message.text)) },
    ]);
    setDraft("");
  }

  async function finishSession() {
    if (!saleMessages.length || busy) return;
    setBusy(true);
    const metrics = {
      "Bám sát lời khách": Math.round(saleMessages.reduce((sum, item) => sum + Math.min(100, (item.feedback?.score ?? 0) + 5), 0) / saleMessages.length),
      "Đúng quy trình": score,
      "Câu hỏi khai thác": Math.round((saleMessages.filter((item) => questionWords.test(item.text) || item.text.includes("?")).length / saleMessages.length) * 100),
      "Xử lý tự nhiên": Math.round((saleMessages.filter((item) => empathyWords.test(item.text)).length / saleMessages.length) * 100),
    };
    const response = await fetch("/api/sessions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productId, scenarioId, score, turns: saleMessages.length, metrics, transcript: messages }) });
    setBusy(false);
    if (response.ok) setSaved(true);
  }

  async function loadHistory(target: "history" | "admin") {
    setTab(target);
    const response = await fetch(target === "admin" ? "/api/admin/sessions" : "/api/sessions");
    const data = await response.json();
    if (target === "admin") setAdminSessions(data.sessions ?? []);
    else setSessions(data.sessions ?? []);
  }

  if (profile === undefined) return <main className="center-screen"><div className="loader" /><p>Đang tải tài khoản…</p></main>;

  if (!profile) return <Registration identity={identity} onComplete={setProfile} />;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark small">S</span><div><strong>Sales Lab Đa Ngành</strong><small>Khách hàng AI khó tính · TAKI</small></div></div>
        <nav className="tabs" aria-label="Điều hướng">
          <button className={tab === "train" ? "active" : ""} onClick={() => setTab("train")}>Luyện tập</button>
          <button className={tab === "history" ? "active" : ""} onClick={() => loadHistory("history")}>Lịch sử của tôi</button>
          {isAdmin && <button className={tab === "admin" ? "active" : ""} onClick={() => loadHistory("admin")}>Quản trị</button>}
        </nav>
        <div className="profile-chip"><span>{profile.displayName.slice(0, 1).toUpperCase()}</span><div><strong>{profile.displayName}</strong><small>{profile.team}{isAdmin ? " · Admin" : ""}</small></div></div>
      </header>

      {tab === "train" && (
        <section className="workspace">
          <aside className="control-panel card">
            <p className="eyebrow">THIẾT LẬP PHIÊN LUYỆN</p>
            <label>Ngành hàng<select value={industryId} onChange={(e) => { const next = e.target.value; setIndustryId(next); setProductId(products.find((item) => item.industryId === next)?.id ?? products[0].id); setCustomerIndex(0); setMessages([]); setSaved(false); }}>{industries.map((item) => <option key={item.id} value={item.id}>{item.icon} {item.name}</option>)}</select></label>
            <label>Sản phẩm / dịch vụ<select value={product.id} onChange={(e) => { setProductId(e.target.value); setMessages([]); setSaved(false); }}>{availableProducts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label>Tình huống<select value={scenarioId} onChange={(e) => { setScenarioId(e.target.value); setMessages([]); setSaved(false); }}>{scenarios.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label>Chân dung khách<select value={customerIndex} onChange={(e) => { setCustomerIndex(Number(e.target.value)); setMessages([]); setSaved(false); }}>{customerOptions.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}</select></label>
            <div className="industry-badge"><span>{industry.icon}</span><div><strong>{customer.label}</strong><small>{industry.persona}</small></div></div>
            <div className="context-box"><strong>{product.name}</strong><span>{product.promise}</span><small>{product.category} · {product.price}</small></div>
            <div className="context-box challenge"><strong>Khách sẽ soi kỹ</strong><span>{industry.decisionCriteria}</span><small>Bối cảnh: {industry.context}</small></div>
            <div className="context-box amber"><strong>Mục tiêu huấn luyện</strong><span>{scenario.goal}</span><small>Bám {takiSteps[scenario.step - 1]}</small></div>
            <button className="primary-button" onClick={startTraining}>{messages.length ? "Bắt đầu phiên mới" : "Bắt đầu luyện"}</button>
            {messages.length > 0 && <button className="secondary-button" disabled={!saleMessages.length || busy} onClick={finishSession}>{saved ? "Đã lưu phiên" : busy ? "Đang lưu…" : "Kết thúc & lưu điểm"}</button>}
          </aside>

          <section className="chat-card card">
            <div className="chat-head"><div><p className="eyebrow">{industry.name.toUpperCase()} · KHÁCH HÀNG AI KHÓ TÍNH</p><h1>{scenario.name}</h1></div><div className="live-score"><span>Điểm hiện tại</span><strong>{score}</strong></div></div>
            <div className="chat-stream">
              {!messages.length && <div className="empty-state"><span>{industry.icon}</span><h2>{customer.label}</h2><p>Khách có hoàn cảnh, ngân sách, trải nghiệm và nỗi lo riêng. AI sẽ trả lời đúng điều sale hỏi rồi mới phản biện tiếp, không nhắc lại máy móc.</p></div>}
              {messages.map((message) => <ChatMessage key={message.id} message={message} />)}
              <div ref={chatEnd} />
            </div>
            {messages.length > 0 && !saved && <form className="composer" onSubmit={sendMessage}><textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Nhập câu trả lời của sale…" rows={2} /><button className="send-button" aria-label="Gửi">Gửi</button></form>}
            {saved && <div className="saved-banner"><strong>Đã lưu phiên · {score}/100</strong><span>Admin có thể xem đầy đủ hội thoại và phần chữa bài này.</span></div>}
          </section>
        </section>
      )}

      {tab === "history" && <SessionList title="Lịch sử luyện tập của tôi" sessions={sessions} expanded={expanded} setExpanded={setExpanded} />}
      {tab === "admin" && isAdmin && <AdminDashboard sessions={adminSessions} expanded={expanded} setExpanded={setExpanded} />}
    </main>
  );
}

function Registration({ identity, onComplete }: { identity: Identity; onComplete: (profile: Profile) => void }) {
  const [displayName, setDisplayName] = useState(identity.name ?? "");
  const [team, setTeam] = useState("Sales");
  const [busy, setBusy] = useState(false);

  async function register(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    const response = await fetch("/api/me", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ displayName, team }) });
    const data = await response.json();
    setBusy(false);
    if (response.ok) onComplete(data.profile);
  }

  return <main className="login-shell"><form className="login-card registration" onSubmit={register}><div className="brand-mark">S</div><p className="eyebrow">HOÀN TẤT ĐĂNG KÝ</p><h1>Chào mừng đến Sales Lab Đa Ngành</h1><p className="login-copy">Nhập thông tin ngắn gọn để điểm và lịch sử được ghi đúng theo từng thành viên.</p><label>Họ và tên<input value={displayName} onChange={(e) => setDisplayName(e.target.value)} minLength={2} maxLength={80} required /></label><label>Đội / phòng ban<input value={team} onChange={(e) => setTeam(e.target.value)} minLength={2} maxLength={80} required /></label><button className="primary-button" disabled={busy}>{busy ? "Đang tạo tài khoản…" : "Bắt đầu luyện"}</button></form></main>;
}

function ChatMessage({ message }: { message: Message }) {
  return <div className={`message-row ${message.role}`}><div className="message-bubble">{message.text}</div>{message.feedback && <div className={`feedback-card ${message.feedback.score < 50 ? "danger" : message.feedback.score < 75 ? "warn" : "good"}`}><div className="feedback-top"><strong>Chữa câu trả lời</strong><span>{message.feedback.score}/100</span></div><p><b>Cần sửa:</b> {message.feedback.issue}</p><p><b>Câu gợi ý:</b> {message.feedback.corrected}</p><small>{message.feedback.process}</small></div>}</div>;
}

function SessionList({ title, sessions, expanded, setExpanded }: { title: string; sessions: SavedSession[]; expanded: string | null; setExpanded: (id: string | null) => void }) {
  return <section className="page-section"><div className="section-head"><p className="eyebrow">BÁO CÁO CÁ NHÂN</p><h1>{title}</h1></div>{!sessions.length ? <div className="card empty-list">Chưa có phiên luyện nào được lưu.</div> : <div className="session-list">{sessions.map((session) => <SessionCard key={session.id} session={session} open={expanded === session.id} onToggle={() => setExpanded(expanded === session.id ? null : session.id)} />)}</div>}</section>;
}

function SessionCard({ session, open, onToggle, admin = false }: { session: SavedSession; open: boolean; onToggle: () => void; admin?: boolean }) {
  return <article className="session-card card"><button className="session-summary" onClick={onToggle}><div><strong>{admin ? `${session.displayName} · ${session.team}` : scenarioName(session.scenarioId)}</strong><span>{industryName(session.productId)} · {productName(session.productId)} · {formatDate(session.createdAt)}</span></div><div className={`score-pill ${session.score < 50 ? "low" : ""}`}>{session.score}/100</div></button>{open && <div className="session-detail"><div className="metric-grid">{Object.entries(session.metrics).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}/100</strong></div>)}</div><div className="transcript-review">{session.transcript.map((message) => <ChatMessage key={message.id} message={message} />)}</div></div>}</article>;
}

function AdminDashboard({ sessions, expanded, setExpanded }: { sessions: SavedSession[]; expanded: string | null; setExpanded: (id: string | null) => void }) {
  const people = new Set(sessions.map((item) => item.email)).size;
  const average = sessions.length ? Math.round(sessions.reduce((sum, item) => sum + item.score, 0) / sessions.length) : 0;
  return <section className="page-section"><div className="section-head"><p className="eyebrow">ADMIN DASHBOARD</p><h1>Điểm số & lịch sử toàn đội</h1><p>Chỉ tài khoản chủ sở hữu được đọc dữ liệu này; quyền được kiểm tra ở máy chủ.</p></div><div className="stats-grid"><div className="stat-card"><span>Thành viên đã luyện</span><strong>{people}</strong></div><div className="stat-card"><span>Tổng phiên</span><strong>{sessions.length}</strong></div><div className="stat-card"><span>Điểm trung bình</span><strong>{average}</strong></div></div>{!sessions.length ? <div className="card empty-list">Chưa có dữ liệu của đội.</div> : <div className="session-list">{sessions.map((session) => <SessionCard key={session.id} session={session} open={expanded === session.id} onToggle={() => setExpanded(expanded === session.id ? null : session.id)} admin />)}</div>}</section>;
}
