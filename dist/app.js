const { products, process, scenarios } = window.TAKI_DATA;

let state = { view: 'home', scenario: null, productId: 'all', messages: [], turn: 0, feedback: [], busy: false };
const app = document.querySelector('#app');
const toast = document.querySelector('#toast');

function getHistory() { return JSON.parse(localStorage.getItem('taki-sales-history') || '[]'); }
function saveHistory(item) { const list = getHistory(); list.unshift(item); localStorage.setItem('taki-sales-history', JSON.stringify(list.slice(0, 20))); updateCount(); }
function updateCount() { document.querySelector('#historyCount').textContent = getHistory().length; }
function showToast(text) { toast.textContent = text; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); }
function esc(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
function money(product) { return product.price ? new Intl.NumberFormat('vi-VN').format(product.price) + 'đ' : product.priceLabel; }
function productById(id) { return products.find(p => p.id === id); }

function renderHome() {
  state.view = 'home';
  const filtered = state.productId === 'all' ? scenarios : scenarios.filter(s => s.productIds.includes(state.productId));
  app.innerHTML = `
    <section class="dashboard-head">
      <div><div class="eyebrow">Kịch bản bán hàng TAKI 2026</div><h1>Luyện theo đúng sản phẩm<br>và quy trình thực tế.</h1><p class="muted">Chọn sản phẩm, sau đó xử lý một tình huống như cuộc gọi thật.</p></div>
      <div class="progress-card"><small>Tiến độ tuần này</small><div class="progress-row"><strong>${getHistory().length} phiên</strong><span>Mục tiêu 5</span></div><div class="bar"><span style="width:${Math.min(getHistory().length / 5 * 100, 100)}%"></span></div></div>
    </section>
    <section class="process-panel"><div class="section-heading"><div><div class="eyebrow">Chuẩn thực hành</div><h2>Quy trình 7 bước</h2></div><button class="text-button" data-action="toggle-process">Xem chi tiết</button></div><div class="process-rail">${process.slice(1).map(p => `<div class="process-step"><b>${p.no}</b><span>${p.name}</span></div>`).join('')}</div><div id="processDetail" class="process-detail" hidden>${process.map(p => `<div><b>Bước ${p.no}: ${p.name}</b><span>${p.focus}</span></div>`).join('')}</div></section>
    <div class="section-heading catalog-heading"><div><div class="eyebrow">Danh mục cập nhật</div><h2>Chọn sản phẩm</h2></div><span class="muted">${products.length} sản phẩm & dịch vụ</span></div>
    <div class="product-strip" role="group" aria-label="Lọc theo sản phẩm"><button class="product-pill ${state.productId === 'all' ? 'active' : ''}" data-product="all"><strong>Tất cả</strong><small>${scenarios.length} bài luyện</small></button>${products.map(p => `<button class="product-pill ${state.productId === p.id ? 'active' : ''}" data-product="${p.id}"><strong>${p.name}</strong><small>${money(p)} · ${p.type}</small></button>`).join('')}</div>
    ${state.productId !== 'all' ? renderProductCard(productById(state.productId)) : ''}
    <div class="section-heading scenario-heading"><div><div class="eyebrow">Bài luyện phù hợp</div><h2>${filtered.length} tình huống</h2></div></div>
    <section class="scenario-grid" aria-label="Danh sách bài luyện">
      ${filtered.map((s, i) => `<button class="scenario" style="--accent:${s.accent}" data-scenario="${s.id}"><div class="scenario-top"><span class="badge">${s.stage}</span><span class="difficulty">${s.difficulty}</span></div><h3>${s.title}</h3><p>${s.mission}</p><div class="scenario-foot"><span>${state.productId === 'all' ? s.productIds.length + ' sản phẩm phù hợp' : productById(state.productId).name}</span><b>→</b></div></button>`).join('')}
    </section>`;
}

function renderProductCard(p) {
  return `<article class="product-card"><div><span class="badge">${p.type}</span><h3>${p.name}</h3><p>${p.description}</p></div><div class="product-meta"><strong>${money(p)}</strong><a href="${p.link}" target="_blank" rel="noreferrer">Xem thông tin sản phẩm</a></div></article>`;
}

function startScenario(id) {
  const scenario = scenarios.find(s => s.id === id);
  const productId = state.productId === 'all' ? scenario.productIds[0] : state.productId;
  state = { view: 'chat', scenario, productId, messages: [{ role: 'customer', text: scenario.customer }], turn: 0, feedback: [], busy: false };
  renderChat();
}

function renderChat() {
  const s = state.scenario;
  app.innerHTML = `<section class="workspace">
    <div class="chat-card">
      <div class="chat-head"><div><div class="eyebrow">${s.stage} · ${s.difficulty} · ${productById(state.productId).name}</div><h2>${s.title}</h2></div><span class="turns">Lượt ${state.turn}/6</span></div>
      <div id="chatLog" class="chat-log" aria-live="polite">${state.messages.map(m => `<div class="message ${m.role === 'seller' ? 'user' : ''}"><div class="bubble">${esc(m.text)}</div></div>`).join('')}${state.busy ? '<div class="typing">Khách đang nhập…</div>' : ''}</div>
      <form id="composer" class="composer"><textarea id="messageInput" aria-label="Tin nhắn cho khách" placeholder="Nhắn cho khách… (Enter để gửi)" ${state.busy ? 'disabled' : ''}></textarea><button class="primary" ${state.busy ? 'disabled' : ''}>Gửi</button></form>
    </div>
    <aside class="coach-card"><div class="coach-title"><span>AI</span><div><div class="eyebrow">Huấn luyện viên</div><h2>Gợi ý theo lượt</h2></div></div><div class="mission"><strong>Mục tiêu:</strong><br>${s.mission}</div><div class="product-mini"><strong>${productById(state.productId).name}</strong><span>${money(productById(state.productId))}</span><small>${productById(state.productId).description}</small></div><div class="feedback">${state.feedback.length ? state.feedback.map(f => `<div class="feedback-item ${f.good ? 'good' : ''}"><strong>${f.good ? '✓ Làm tốt' : '△ Cần sửa'}</strong><br>${f.text}</div>`).join('') : '<div class="feedback-empty">Góp ý sẽ xuất hiện sau mỗi lượt nhắn.</div>'}</div><button class="end-button" data-action="finish">Kết thúc & chấm điểm</button></aside>
  </section>`;
  const log = document.querySelector('#chatLog'); log.scrollTop = log.scrollHeight;
}

function evaluate(text) {
  const lower = text.toLowerCase();
  const questions = (text.match(/\?/g) || []).length;
  const empathetic = /dạ|hiểu|chia sẻ|yên tâm|cảm ơn/.test(lower);
  const matched = state.scenario.coachKeys.filter(k => lower.includes(k)).length;
  if (questions === 0) return { good: false, text: 'Hãy kết thúc bằng một câu hỏi mở để khách dễ tiếp tục chia sẻ.' };
  if (empathetic && matched >= 2) return { good: true, text: `Đúng hướng ${state.scenario.stage}: đã có đồng cảm và chạm ${matched} điểm quan trọng của kịch bản.` };
  if (!empathetic) return { good: false, text: 'Nên xác nhận hoặc đồng cảm với điều khách vừa nói trước khi hỏi tiếp.' };
  return { good: false, text: `Câu hỏi đã mở được hội thoại, nhưng cần bám thêm: ${state.scenario.coachKeys.filter(k => !lower.includes(k)).slice(0,3).join(', ')}.` };
}

function sendMessage(text) {
  if (!text.trim() || state.busy) return;
  state.messages.push({ role: 'seller', text: text.trim() }); state.feedback.unshift(evaluate(text)); state.busy = true; renderChat();
  setTimeout(() => {
    const replies = state.scenario.replies;
    state.messages.push({ role: 'customer', text: replies[Math.min(state.turn, replies.length - 1)] });
    state.turn += 1; state.busy = false; renderChat();
  }, 850);
}

function finishSession() {
  const seller = state.messages.filter(m => m.role === 'seller').map(m => m.text).join(' ').toLowerCase();
  const metrics = [
    { name: 'Tạo thiện cảm và kiểm soát', score: /dạ|cảm ơn|hiểu|chia sẻ|tên/.test(seller) ? 88 : 56 },
    { name: 'Khai thác đúng quy trình', score: Math.min(96, 42 + (seller.match(/\?/g) || []).length * 10 + state.scenario.coachKeys.filter(k => seller.includes(k)).length * 7) },
    { name: 'Nối sản phẩm vào điểm đau', score: state.turn >= 2 && seller.includes(productById(state.productId).name.toLowerCase().split(' ')[0]) ? 86 : state.turn >= 2 ? 72 : 48 },
    { name: 'Xử lý từ chối theo CETAA', score: /em hiểu|đồng ý|chia sẻ/.test(seller) && /đúng không|được không|ạ\?/.test(seller) ? 84 : 55 },
    { name: 'Chốt bước tiếp theo', score: /đăng ký|lịch|gửi|hẹn|giữ chỗ|gọi lại|thanh toán/.test(seller) ? 86 : 48 }
  ];
  const score = Math.round(metrics.reduce((a, m) => a + m.score, 0) / metrics.length);
  const result = { id: Date.now(), title: state.scenario.title, product: productById(state.productId).name, score, turns: state.turn, date: new Date().toLocaleDateString('vi-VN'), metrics };
  saveHistory(result); state = { ...state, view: 'score', result }; renderScore();
}

function renderScore() {
  const r = state.result;
  app.innerHTML = `<div class="eyebrow">Kết quả phiên luyện</div><h1>${r.score >= 80 ? 'Tư vấn tốt' : 'Cần luyện thêm'}</h1><section class="score-layout">
    <aside class="score-hero"><div class="score-ring" style="--score:${r.score}"><strong>${r.score}</strong></div><p class="muted">Điểm tổng trên 100 · ${r.turns} lượt hội thoại</p><div class="score-actions"><button class="primary" style="min-height:48px" data-action="retry">Luyện lại tình huống</button><button class="end-button" data-action="home">Chọn bài khác</button></div></aside>
    <div class="report"><div class="priority"><strong>Việc cần sửa ở phiên sau</strong><br>Bám đúng mục tiêu của ${state.scenario.stage}: ${state.scenario.mission}</div><h3>Điểm theo quy trình TAKI</h3>${r.metrics.map(m => `<div class="metric"><div class="metric-head"><span>${m.name}</span><span>${m.score}/100</span></div><div class="bar"><span style="width:${m.score}%"></span></div></div>`).join('')}<div class="feedback-item good"><strong>✓ Nguyên tắc cần giữ</strong><br>Tư vấn theo điểm đau và kết quả khách cần. Không sa đà kể công cụ khi chưa khai thác đủ thông tin.</div></div>
  </section>`;
}

function renderHistory() {
  state.view = 'history'; const list = getHistory();
  app.innerHTML = `<div class="eyebrow">Tiến bộ cá nhân</div><h1>Lịch sử luyện tập</h1><p class="muted">Các phiên được lưu trên thiết bị này.</p><section class="history-list">${list.length ? list.map(i => `<article class="history-item"><div><strong>${esc(i.title)}</strong><span class="muted">${i.product} · ${i.turns} lượt · ${i.date}</span></div><div class="history-score">${i.score}</div></article>`).join('') : '<div class="empty-state">Chưa có phiên luyện nào. Hãy chọn một tình huống để bắt đầu.</div>'}</section>`;
}

document.addEventListener('click', e => {
  const scenario = e.target.closest('[data-scenario]'); if (scenario) startScenario(scenario.dataset.scenario);
  const product = e.target.closest('[data-product]'); if (product) { state.productId = product.dataset.product; renderHome(); }
  const action = e.target.closest('[data-action]')?.dataset.action;
  if (action === 'home') renderHome();
  if (action === 'history') renderHistory();
  if (action === 'toggle-process') { const panel = document.querySelector('#processDetail'); panel.hidden = !panel.hidden; e.target.textContent = panel.hidden ? 'Xem chi tiết' : 'Thu gọn'; }
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
