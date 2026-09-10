const scenarios = [
  { id: 'discovery', stage: 'Khai thác', title: 'Chưa biết chọn khóa học nào', difficulty: 'Dễ', accent: '#16a36a', customer: 'Chị đang kinh doanh online nhưng chưa biết khóa nào phù hợp?', mission: 'Làm rõ mô hình kinh doanh, mục tiêu, khó khăn hiện tại và mức độ sử dụng AI.', product: 'AI Business System' },
  { id: 'price', stage: 'Xử lý giá', title: 'Khách thấy học phí cao', difficulty: 'Trung bình', accent: '#f7a928', customer: '12 triệu hơi cao em ạ, chị thấy nhiều chỗ dạy rẻ hơn.', mission: 'Không giảm giá ngay. Làm rõ giá trị, kết quả kỳ vọng và chi phí của việc chưa thay đổi.', product: 'AI Business System' },
  { id: 'apply', stage: 'Xử lý lo ngại', title: 'Sợ học xong không áp dụng được', difficulty: 'Khó', accent: '#eb3349', customer: 'Anh không rành công nghệ, sợ đăng ký rồi lại không làm được.', mission: 'Thể hiện đồng cảm, tìm nguyên nhân lo ngại và giải thích cách học thực hành.', product: 'Siêu Trợ Lý Nhân Hiệu' },
  { id: 'delay', stage: 'Chốt', title: 'Khách muốn suy nghĩ thêm', difficulty: 'Khó', accent: '#8c4ae4', customer: 'Để chị suy nghĩ thêm rồi chị liên hệ lại nhé.', mission: 'Hỏi ra vướng mắc thật và đề xuất một bước tiếp theo cụ thể, không gây áp lực.', product: 'Scale Camp' }
];

const customerReplies = {
  discovery: ['Chị bán mỹ phẩm online, chủ yếu trên Facebook.', 'Chị muốn có thêm khách nhưng quảng cáo dạo này đắt quá.', 'AI thì chị mới dùng ChatGPT để viết vài bài thôi.'],
  price: ['Chị thấy có khóa chỉ 2–3 triệu thôi.', 'Nếu học mà tăng được doanh thu thì tốt, nhưng chị chưa chắc áp dụng được.', 'Bên em có hỗ trợ sau khóa học không?'],
  apply: ['Anh bận và dùng máy tính cũng chỉ ở mức cơ bản.', 'Anh muốn làm nội dung nhanh hơn và quản lý đội sale tốt hơn.', 'Nếu có người cầm tay chỉ việc thì anh cân nhắc.'],
  delay: ['Chị vẫn hơi ngại về thời gian học.', 'Chị còn phải trao đổi với chồng nữa.', 'Nếu được xem lịch học cụ thể thì gửi chị nhé.']
};

let state = { view: 'home', scenario: null, messages: [], turn: 0, feedback: [], busy: false };
const app = document.querySelector('#app');
const toast = document.querySelector('#toast');

function getHistory() { return JSON.parse(localStorage.getItem('taki-sales-history') || '[]'); }
function saveHistory(item) { const list = getHistory(); list.unshift(item); localStorage.setItem('taki-sales-history', JSON.stringify(list.slice(0, 20))); updateCount(); }
function updateCount() { document.querySelector('#historyCount').textContent = getHistory().length; }
function showToast(text) { toast.textContent = text; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); }
function esc(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }

function renderHome() {
  state.view = 'home';
  app.innerHTML = `
    <section class="dashboard-head">
      <div><div class="eyebrow">Không gian luyện tập</div><h1>Luyện đúng tình huống.<br>Tư vấn chắc tay hơn.</h1><p class="muted">Chọn một khách hàng mô phỏng và xử lý như cuộc trò chuyện thật.</p></div>
      <div class="progress-card"><small>Tiến độ tuần này</small><div class="progress-row"><strong>${getHistory().length} phiên</strong><span>Mục tiêu 5</span></div><div class="bar"><span style="width:${Math.min(getHistory().length / 5 * 100, 100)}%"></span></div></div>
    </section>
    <div class="filter-row" role="group" aria-label="Lọc tình huống"><button class="chip active">Tất cả</button><button class="chip">Tư vấn khóa học</button><button class="chip">Xử lý từ chối</button><button class="chip">Chốt đăng ký</button></div>
    <section class="scenario-grid" aria-label="Danh sách bài luyện">
      ${scenarios.map((s, i) => `<button class="scenario" style="--accent:${s.accent}" data-scenario="${s.id}"><div class="scenario-top"><span class="badge">${i+1}. ${s.stage}</span><span class="difficulty">${s.difficulty}</span></div><h3>${s.title}</h3><p>${s.mission}</p><div class="scenario-foot"><span>${s.product}</span><b>→</b></div></button>`).join('')}
    </section>`;
}

function startScenario(id) {
  const scenario = scenarios.find(s => s.id === id);
  state = { view: 'chat', scenario, messages: [{ role: 'customer', text: scenario.customer }], turn: 0, feedback: [], busy: false };
  renderChat();
}

function renderChat() {
  const s = state.scenario;
  app.innerHTML = `<section class="workspace">
    <div class="chat-card">
      <div class="chat-head"><div><div class="eyebrow">${s.stage} · ${s.difficulty}</div><h2>${s.title}</h2></div><span class="turns">Lượt ${state.turn}/6</span></div>
      <div id="chatLog" class="chat-log" aria-live="polite">${state.messages.map(m => `<div class="message ${m.role === 'seller' ? 'user' : ''}"><div class="bubble">${esc(m.text)}</div></div>`).join('')}${state.busy ? '<div class="typing">Khách đang nhập…</div>' : ''}</div>
      <form id="composer" class="composer"><textarea id="messageInput" aria-label="Tin nhắn cho khách" placeholder="Nhắn cho khách… (Enter để gửi)" ${state.busy ? 'disabled' : ''}></textarea><button class="primary" ${state.busy ? 'disabled' : ''}>Gửi</button></form>
    </div>
    <aside class="coach-card"><div class="coach-title"><span>AI</span><div><div class="eyebrow">Huấn luyện viên</div><h2>Gợi ý theo lượt</h2></div></div><div class="mission"><strong>Mục tiêu:</strong><br>${s.mission}</div><div class="feedback">${state.feedback.length ? state.feedback.map(f => `<div class="feedback-item ${f.good ? 'good' : ''}"><strong>${f.good ? '✓ Làm tốt' : '△ Cần sửa'}</strong><br>${f.text}</div>`).join('') : '<div class="feedback-empty">Góp ý sẽ xuất hiện sau mỗi lượt nhắn.</div>'}</div><button class="end-button" data-action="finish">Kết thúc & chấm điểm</button></aside>
  </section>`;
  const log = document.querySelector('#chatLog'); log.scrollTop = log.scrollHeight;
}

function evaluate(text) {
  const lower = text.toLowerCase();
  const questions = (text.match(/\?/g) || []).length;
  const empathetic = /dạ|hiểu|chia sẻ|yên tâm|cảm ơn/.test(lower);
  const discovery = /mục tiêu|kinh doanh|khó khăn|mong muốn|thời gian|đang dùng|ngân sách|lĩnh vực/.test(lower);
  if (questions === 0) return { good: false, text: 'Hãy kết thúc bằng một câu hỏi mở để khách dễ tiếp tục chia sẻ.' };
  if (empathetic && discovery) return { good: true, text: 'Giọng điệu thân thiện và câu hỏi đã hướng vào nhu cầu thật của khách.' };
  if (!empathetic) return { good: false, text: 'Nên xác nhận hoặc đồng cảm với điều khách vừa nói trước khi hỏi tiếp.' };
  return { good: false, text: 'Câu hỏi tốt, nhưng cần khai thác rõ hơn mục tiêu, khó khăn hoặc thời gian kỳ vọng.' };
}

function sendMessage(text) {
  if (!text.trim() || state.busy) return;
  state.messages.push({ role: 'seller', text: text.trim() }); state.feedback.unshift(evaluate(text)); state.busy = true; renderChat();
  setTimeout(() => {
    const replies = customerReplies[state.scenario.id];
    state.messages.push({ role: 'customer', text: replies[Math.min(state.turn, replies.length - 1)] });
    state.turn += 1; state.busy = false; renderChat();
  }, 850);
}

function finishSession() {
  const seller = state.messages.filter(m => m.role === 'seller').map(m => m.text).join(' ').toLowerCase();
  const metrics = [
    { name: 'Tạo thiện cảm', score: /dạ|cảm ơn|hiểu|chia sẻ/.test(seller) ? 88 : 58 },
    { name: 'Khai thác nhu cầu', score: Math.min(96, 45 + (seller.match(/\?/g) || []).length * 13 + (/mục tiêu|khó khăn|mong muốn|thời gian|lĩnh vực/.test(seller) ? 18 : 0)) },
    { name: 'Tư vấn đúng trọng tâm', score: state.turn >= 2 ? 78 : 52 },
    { name: 'Chốt bước tiếp theo', score: /đăng ký|lịch|gửi|hẹn|giữ chỗ|tư vấn/.test(seller) ? 82 : 48 }
  ];
  const score = Math.round(metrics.reduce((a, m) => a + m.score, 0) / metrics.length);
  const result = { id: Date.now(), title: state.scenario.title, product: state.scenario.product, score, turns: state.turn, date: new Date().toLocaleDateString('vi-VN'), metrics };
  saveHistory(result); state = { ...state, view: 'score', result }; renderScore();
}

function renderScore() {
  const r = state.result;
  app.innerHTML = `<div class="eyebrow">Kết quả phiên luyện</div><h1>${r.score >= 80 ? 'Tư vấn tốt' : 'Cần luyện thêm'}</h1><section class="score-layout">
    <aside class="score-hero"><div class="score-ring" style="--score:${r.score}"><strong>${r.score}</strong></div><p class="muted">Điểm tổng trên 100 · ${r.turns} lượt hội thoại</p><div class="score-actions"><button class="primary" style="min-height:48px" data-action="retry">Luyện lại tình huống</button><button class="end-button" data-action="home">Chọn bài khác</button></div></aside>
    <div class="report"><div class="priority"><strong>Việc cần sửa ở phiên sau</strong><br>Hỏi sâu thêm trước khi giới thiệu khóa học và luôn kết thúc bằng một bước tiếp theo cụ thể.</div><h3>Điểm từng tiêu chí</h3>${r.metrics.map(m => `<div class="metric"><div class="metric-head"><span>${m.name}</span><span>${m.score}/100</span></div><div class="bar"><span style="width:${m.score}%"></span></div></div>`).join('')}<div class="feedback-item good"><strong>✓ Làm tốt</strong><br>Giữ giọng điệu lịch sự, đặt câu hỏi tự nhiên và không tạo áp lực cho khách.</div></div>
  </section>`;
}

function renderHistory() {
  state.view = 'history'; const list = getHistory();
  app.innerHTML = `<div class="eyebrow">Tiến bộ cá nhân</div><h1>Lịch sử luyện tập</h1><p class="muted">Các phiên được lưu trên thiết bị này.</p><section class="history-list">${list.length ? list.map(i => `<article class="history-item"><div><strong>${esc(i.title)}</strong><span class="muted">${i.product} · ${i.turns} lượt · ${i.date}</span></div><div class="history-score">${i.score}</div></article>`).join('') : '<div class="empty-state">Chưa có phiên luyện nào. Hãy chọn một tình huống để bắt đầu.</div>'}</section>`;
}

document.addEventListener('click', e => {
  const scenario = e.target.closest('[data-scenario]'); if (scenario) startScenario(scenario.dataset.scenario);
  const action = e.target.closest('[data-action]')?.dataset.action;
  if (action === 'home') renderHome();
  if (action === 'history') renderHistory();
  if (action === 'finish') { if (!state.messages.some(m => m.role === 'seller')) return showToast('Hãy gửi ít nhất một tin nhắn trước khi chấm điểm.'); finishSession(); }
  if (action === 'retry') startScenario(state.scenario.id);
});
document.addEventListener('submit', e => { if (e.target.id === 'composer') { e.preventDefault(); sendMessage(document.querySelector('#messageInput').value); } });
document.addEventListener('keydown', e => { if (e.target.id === 'messageInput' && e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e.target.value); } });

updateCount(); renderHome();

function registerAgentTools() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const schema = { type: 'object', properties: { scenarioId: { type: 'string', enum: scenarios.map(s => s.id) } }, required: ['scenarioId'], additionalProperties: false };
  Promise.resolve(context.registerTool({
    name: 'start_sales_practice',
    title: 'Bắt đầu bài luyện bán hàng',
    description: 'Mở một tình huống luyện tư vấn Taki theo mã đã chọn.',
    inputSchema: schema,
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      if (!input || !scenarios.some(s => s.id === input.scenarioId)) throw new Error('Tình huống không hợp lệ.');
      startScenario(input.scenarioId);
      return { status: 'started', scenarioId: input.scenarioId, title: state.scenario.title };
    }
  })).catch(() => {});
  Promise.resolve(context.registerTool({
    name: 'read_practice_progress',
    title: 'Xem tiến độ luyện tập',
    description: 'Đọc số phiên đã luyện và điểm gần nhất trên thiết bị hiện tại.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute() {
      const history = getHistory();
      return { sessions: history.length, latestScore: history[0]?.score ?? null, latestScenario: history[0]?.title ?? null };
    }
  })).catch(() => {});
}

registerAgentTools();
