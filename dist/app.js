const { products, process, scenarios } = window.TAKI_DATA;
const { maxTurns, banks, productChallenges } = window.TAKI_CHALLENGE_DATA;

let state = { view: 'home', scenario: null, productId: 'all', messages: [], turn: 0, feedback: [], busy: false, usedReplies: [], turnScores: [] };
const app = document.querySelector('#app');
const toast = document.querySelector('#toast');

function getHistory() { return JSON.parse(localStorage.getItem('taki-sales-history') || '[]'); }
function saveHistory(item) { const list = getHistory(); list.unshift(item); localStorage.setItem('taki-sales-history', JSON.stringify(list.slice(0, 20))); updateCount(); }
function updateCount() { document.querySelector('#historyCount').textContent = getHistory().length; }
function showToast(text) { toast.textContent = text; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); }
function esc(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
function money(product) { return product.price ? new Intl.NumberFormat('vi-VN').format(product.price) + 'đ' : product.priceLabel; }
function productById(id) { return products.find(p => p.id === id); }
function normalize(text) { return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
function has(text, pattern) { return pattern.test(normalize(text)); }
function sellerMessages() { return state.messages.filter(m => m.role === 'seller').map(m => m.text); }
function lastCustomerMessage() { return [...state.messages].reverse().find(m => m.role === 'customer')?.text || ''; }
function fillTemplate(text) { const p = productById(state.productId); return text.replaceAll('{product}', p.name).replaceAll('{price}', money(p)); }

const topicPatterns = {
  price: /gia|chi phi|ngan sach|dau tu|hoc phi|hoan von|roi|trieu|tien/,
  proof: /chung minh|du lieu|case|vi du|can cu|cam ket|do duoc|chi so|ket qua|bao lau|x\d/,
  risk: /rui ro|that bai|khong thanh cong|nhuoc diem|mat|anh huong|trach nhiem/,
  implementation: /trien khai|ap dung|quy trinh|buoc|tuan dau|doi ngu|nhan su|crm|cong cu|ho tro/,
  time: /thoi gian|lich|ban|gio|tuan|thang|buoi|kip/,
  authority: /doi tac|chong|vo|sep|lanh dao|quyet dinh|duyet/,
  discovery: /doanh thu|loi nhuan|quy mo|kho khan|muc tieu|mong muon|marketing|sale|van hanh/,
  closing: /dang ky|thanh toan|giu cho|chot|hen|goi lai|buoc tiep/
};
function topicsOf(text) { const n = normalize(text); return Object.entries(topicPatterns).filter(([, pattern]) => pattern.test(n)).map(([topic]) => topic); }
function significantWords(text) { const stop = new Set('chi em anh la va co cua cho nay do duoc mot nhung khong thi voi nhu ve da dang se gi nao sao a oi trong ben phan dieu'.split(' ')); return normalize(text).replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !stop.has(w)); }
function quote(text, max = 58) { const clean = text.trim().replace(/\s+/g, ' '); return clean.length > max ? clean.slice(0, max).trim() + '…' : clean; }

function assessTurn(text) {
  const customer = lastCustomerMessage();
  const n = normalize(text.trim());
  const customerTopics = topicsOf(customer);
  const saleTopics = topicsOf(text);
  const saleWords = significantWords(text);
  const overlap = significantWords(customer).filter(w => saleWords.includes(w));
  const gibberish = text.trim().length < 12 || /^(abc|asdf|test|linh tinh|khong biet|tuy|ok|uh|u|o)[.!?\s]*$/.test(n) || /(.)\1{5,}/.test(n);
  const hostile = /chi noi gi|khong hieu|ke chi|tuy chi|khong mua thi thoi|chi khong lam|loi cua chi/.test(n);
  const unsupported = /x\s*\d|gap \d|cam ket|chac chan|100%|duy nhat|khong co rui ro|doanh thu tang/.test(n) && !/vi|dua tren|can cu|neu|tuy|phu thuoc|du lieu/.test(n);
  const relevant = customerTopics.length ? customerTopics.some(t => saleTopics.includes(t)) || overlap.length >= 1 : overlap.length >= 1 || saleTopics.length > 0;
  const empathy = /dạ|em hiểu|em đồng ý|chia sẻ|cảm ơn|yên tâm/i.test(text);
  const question = /\?/.test(text);
  const specific = /\d|bước|ví dụ|cụ thể|đầu tiên|sau đó|đo bằng|phụ thuộc|dựa trên/i.test(text);
  const productFit = significantWords(productById(state.productId).name).some(w => saleWords.includes(w)) || significantWords(productById(state.productId).description).filter(w => w.length > 5).some(w => saleWords.includes(w));
  const previous = sellerMessages().slice(0, -1).map(normalize);
  const repeated = previous.some(p => n.length > 18 && (p.includes(n.slice(0, 26)) || n.includes(p.slice(0, 26))));
  let score = 5;
  if (text.trim().length >= 35) score += 10;
  if (relevant) score += 25;
  if (empathy) score += 10;
  if (question) score += 15;
  if (specific) score += 15;
  if (productFit) score += 15;
  score += Math.min(10, state.scenario.coachKeys.filter(k => n.includes(normalize(k))).length * 3);
  if (gibberish) score = Math.min(score, 8);
  if (!relevant) score -= 25;
  if (hostile) score -= 35;
  if (unsupported) score -= 25;
  if (repeated) score -= 20;
  return { score: Math.max(0, Math.min(100, score)), customer, relevant, empathy, question, specific, productFit, repeated, gibberish, hostile, unsupported };
}

function analyzeSeller(text) {
  const all = sellerMessages().join(' ');
  const n = normalize(text);
  const intents = [];
  if (/gia|chi phi|ngan sach|dau tu|hoan von|roi/.test(n)) intents.push('price');
  if (/thoi gian|lich|ban|gio|tuan|thang/.test(n)) intents.push('time');
  if (/doi tac|chong|vo|sep|lanh dao|quyet dinh/.test(n)) intents.push('authority');
  if (/trien khai|ap dung|quy trinh|buoc|doi ngu|nhan su|crm|ho tro/.test(n)) intents.push('implementation');
  if (/case|chung minh|ket qua|du lieu|vi du|cam ket/.test(n)) intents.push('proof');
  if (/dang kinh doanh|doanh thu|loi nhuan|quy mo|kho khan|muc tieu|mong muon/.test(n)) intents.push('discovery');
  if (/dang ky|thanh toan|giu cho|chot|hen|goi lai|buoc tiep/.test(n)) intents.push('closing');
  const questions = (text.match(/\?/g) || []).length;
  const empathy = /dạ|em hiểu|chia sẻ|cảm ơn|yên tâm|đồng ý/i.test(text);
  const productTokens = normalize(productById(state.productId).name).split(' ').filter(x => x.length > 2);
  const productFit = productTokens.some(token => n.includes(token)) || normalize(productById(state.productId).description).split(' ').filter(x => x.length > 5).some(token => n.includes(token));
  const vague = text.trim().length < 55 || /giup|hieu qua|toi uu|he thong|rat tot|phu hop/.test(n) && !/\d/.test(n);
  const previous = sellerMessages().slice(0, -1).map(normalize);
  const repeated = previous.some(p => p.length > 20 && (p.includes(n.slice(0, 28)) || n.includes(p.slice(0, 28))));
  return { intents, questions, empathy, productFit, vague, repeated, all };
}

function scenarioPriority() {
  const id = state.scenario.id;
  if (id === 'price') return ['price','proof','implementation','trust','closing'];
  if (id === 'time') return ['time','implementation','proof','trust','closing'];
  if (id === 'partner') return ['authority','proof','price','closing','trust'];
  if (id === 'discovery') return ['discovery','trust','implementation','price','proof'];
  if (id === 'solution') return ['clarify','implementation','proof','price','trust'];
  if (id === 'opening') return ['time','trust','discovery','clarify','closing'];
  if (id === 'failed-before') return ['trust','proof','implementation','price','closing'];
  return ['clarify','implementation','trust','proof','price'];
}

function chooseAdaptiveReply(text) {
  const quality = assessTurn(text);
  const sale = quote(text);
  const customer = quote(quality.customer, 72);
  let direct;
  if (quality.gibberish) direct = `Chị đang hỏi “${customer}”. Câu vừa rồi không có nội dung để chị đánh giá. Em trả lời thẳng câu đó giúp chị.`;
  else if (/chi noi gi|khong hieu/.test(normalize(text))) direct = `Chị vừa hỏi về “${quote(quality.customer, 48)}”. Nếu em chưa rõ, hãy nhắc lại điều em hiểu và hỏi đúng một ý cần chị làm rõ; đừng chuyển sang chủ đề khác.`;
  else if (quality.hostile) direct = `Cách em nói “${sale}” đang đẩy trách nhiệm sang khách hàng. Chị cần em trả lời chuyên nghiệp: rủi ro thực tế là gì và TAKI giảm rủi ro đó ra sao?`;
  else if (!quality.relevant) direct = `Câu “${sale}” chưa trả lời điều chị vừa hỏi: “${customer}”. Em trả lời đúng trọng tâm trước, rồi hãy hỏi thêm chị.`;
  else if (quality.unsupported && /x\s*\d|gap \d|doanh thu tang/.test(normalize(text))) direct = `Em vừa nói “${sale}”. Căn cứ nào để nói mức tăng đó, điều kiện áp dụng là gì và nếu không đạt thì đánh giá ra sao?`;
  else if (quality.unsupported) direct = `Khẳng định “${sale}” nghe quá tuyệt đối. Em nói rõ điều kiện, giới hạn và rủi ro thực tế thay vì cam kết chung được không?`;
  else if (!quality.specific) direct = `Em vừa nói “${sale}”, nhưng chị chưa hình dung được cách làm. Cho chị một bước triển khai cụ thể gắn với tình trạng hiện tại.`;
  else if (!quality.question) direct = `Chị hiểu ý “${sale}”. Nhưng em chưa kiểm tra xem điều đó có đúng với doanh nghiệp chị không; em cần hỏi chị dữ kiện nào trước?`;
  if (direct && !state.usedReplies.includes(direct)) { state.usedReplies.push(direct); return direct; }

  const a = analyzeSeller(text);
  let categories = [];
  if (a.repeated) categories.push('trust');
  if (!a.empathy && state.turn > 0) categories.push('trust');
  if (!a.questions) categories.push('clarify');
  if (a.vague) categories.push('clarify','proof');
  categories.push(...a.intents, ...scenarioPriority());
  categories = [...new Set(categories)];

  const candidates = [];
  if ((a.productFit || state.turn >= 2) && productChallenges[state.productId]) candidates.push(...productChallenges[state.productId]);
  categories.forEach(category => (banks[category] || []).forEach(reply => candidates.push(reply)));
  Object.values(banks).forEach(pool => pool.forEach(reply => candidates.push(reply)));
  const unused = [...new Set(candidates.map(fillTemplate))].filter(reply => !state.usedReplies.includes(reply));
  if (!unused.length) return 'Chị vẫn chưa bị thuyết phục. Em tóm tắt lại đúng ba điều chị quan tâm rồi đặt một câu hỏi mới nhé?';
  const seed = [...normalize(text + customer)].reduce((sum, char) => sum + char.charCodeAt(0), state.turn * 17);
  const reply = unused[seed % Math.min(unused.length, 7)];
  state.usedReplies.push(reply);
  return reply;
}

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
  state = { view: 'chat', scenario, productId, messages: [{ role: 'customer', text: scenario.customer }], turn: 0, feedback: [], busy: false, usedReplies: [scenario.customer], turnScores: [] };
  renderChat();
}

function renderChat() {
  const s = state.scenario;
  app.innerHTML = `<section class="workspace">
    <div class="chat-card">
      <div class="chat-head"><div><div class="eyebrow">${s.stage} · Khách khó tính · ${productById(state.productId).name}</div><h2>${s.title}</h2></div><span class="turns">Lượt ${state.turn}/${maxTurns}</span></div>
      <div id="chatLog" class="chat-log" aria-live="polite">${state.messages.map(m => `<div class="message ${m.role === 'seller' ? 'user' : ''}"><div class="bubble">${esc(m.text)}</div></div>`).join('')}${state.busy ? '<div class="typing">Khách đang nhập…</div>' : ''}</div>
      <form id="composer" class="composer"><textarea id="messageInput" aria-label="Tin nhắn cho khách" placeholder="Nhắn cho khách… (Enter để gửi)" ${state.busy ? 'disabled' : ''}></textarea><button class="primary" ${state.busy ? 'disabled' : ''}>Gửi</button></form>
    </div>
    <aside class="coach-card"><div class="coach-title"><span>AI</span><div><div class="eyebrow">Huấn luyện viên</div><h2>Phân tích theo lượt</h2></div></div><div class="mission"><strong>Mục tiêu:</strong><br>${s.mission}</div><div class="challenge-status"><strong>Mức gây khó ${Math.min(100, 35 + state.turn * 5)}%</strong><span>Khách ghi nhớ toàn bộ cuộc chat và không lặp câu đã hỏi.</span></div><div class="product-mini"><strong>${productById(state.productId).name}</strong><span>${money(productById(state.productId))}</span><small>${productById(state.productId).description}</small></div><div class="feedback">${state.feedback.length ? state.feedback.map(f => `<div class="feedback-item ${f.good ? 'good' : ''}"><strong>${f.good ? '✓ Làm tốt' : '△ Cần sửa'}</strong><br>${f.text}</div>`).join('') : '<div class="feedback-empty">AI sẽ phân tích quy trình, sản phẩm và câu trả lời của bạn sau mỗi lượt.</div>'}</div><button class="end-button" data-action="finish">Kết thúc & chấm điểm</button></aside>
  </section>`;
  const log = document.querySelector('#chatLog'); log.scrollTop = log.scrollHeight;
}

function evaluate(text) {
  const a = assessTurn(text);
  const matched = state.scenario.coachKeys.filter(k => normalize(text).includes(normalize(k)));
  const gaps = [];
  if (a.gibberish) return { good: false, score: a.score, text: 'Câu trả lời không có nội dung bán hàng hoặc quá ngắn để đánh giá.' };
  if (a.hostile) gaps.push('cách trả lời thiếu chuyên nghiệp và đẩy trách nhiệm sang khách');
  if (!a.relevant) gaps.push('không trả lời đúng câu khách vừa hỏi');
  if (a.unsupported) gaps.push('đưa ra cam kết tuyệt đối nhưng không có căn cứ hay điều kiện');
  if (!a.empathy) gaps.push('chưa xác nhận/đồng cảm với ý khách vừa nói');
  if (!a.question) gaps.push('chưa có câu hỏi mở để kiểm soát cuộc trò chuyện');
  if (!a.specific) gaps.push('lợi ích còn chung, thiếu bước làm hoặc tiêu chí đo');
  if (!a.productFit && state.turn > 1) gaps.push(`chưa nối rõ với ${productById(state.productId).name}`);
  if (a.repeated) gaps.push('ý trả lời đang lặp lại nội dung sale đã dùng trước đó');
  if (a.score >= 70) return { good: true, score: a.score, text: `${a.score}/100: trả lời đúng trọng tâm, có cấu trúc và bám ${matched.length || 1} điểm của kịch bản.` };
  return { good: false, score: a.score, text: `${a.score}/100: ${gaps.slice(0, 3).join('; ')}. Hãy trả lời trực tiếp ý khách trước khi chuyển sang câu hỏi mới.` };
}

function sendMessage(text) {
  if (!text.trim() || state.busy) return;
  state.messages.push({ role: 'seller', text: text.trim() }); const result = evaluate(text); state.feedback.unshift(result); state.turnScores.push(result.score); state.busy = true; renderChat();
  setTimeout(() => {
    state.messages.push({ role: 'customer', text: chooseAdaptiveReply(text) });
    state.turn += 1; state.busy = false; renderChat();
  }, 850);
}

function finishSession() {
  const sellerTurns = state.messages.filter(m => m.role === 'seller').map(m => m.text);
  const seller = sellerTurns.join(' ').toLowerCase();
  const avg = state.turnScores.length ? Math.round(state.turnScores.reduce((a, b) => a + b, 0) / state.turnScores.length) : 0;
  const badTurns = state.turnScores.filter(s => s < 30).length;
  const severePenalty = badTurns ? Math.min(35, badTurns * 12) : 0;
  const empathyRate = sellerTurns.filter(t => /dạ|em hiểu|chia sẻ|cảm ơn/i.test(t)).length / Math.max(1, sellerTurns.length);
  const questionRate = sellerTurns.filter(t => /\?/.test(t)).length / Math.max(1, sellerTurns.length);
  const relevanceBase = Math.max(0, avg - severePenalty);
  const metrics = [
    { name: 'Trả lời đúng trọng tâm', score: relevanceBase },
    { name: 'Tạo thiện cảm và kiểm soát', score: Math.max(0, Math.min(relevanceBase, Math.round(empathyRate * 45 + questionRate * 45 + 10) - severePenalty)) },
    { name: 'Khai thác đúng quy trình', score: Math.max(0, Math.min(relevanceBase + 5, Math.round(questionRate * 55 + state.scenario.coachKeys.filter(k => normalize(seller).includes(normalize(k))).length * 7) - severePenalty)) },
    { name: 'Nối sản phẩm vào điểm đau', score: Math.max(0, Math.min(relevanceBase + 5, state.turnScores.filter(s => s >= 70).length * 18 + (normalize(seller).includes(normalize(productById(state.productId).name)) ? 20 : 0))) },
    { name: 'Xử lý từ chối và chốt', score: Math.max(0, Math.min(relevanceBase, (/đăng ký|lịch|gửi|hẹn|giữ chỗ|gọi lại|thanh toán/.test(seller) ? 65 : 25) + Math.round(empathyRate * 20) - severePenalty)) }
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
