import { createServer } from "vite";

const server = await createServer({ configFile: false, root: process.cwd(), server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
const { runAdaptiveTurn, similarity } = await server.ssrLoadModule("/lib/training-engine.ts");
const { industries, products, scenarios, customerInsights } = await server.ssrLoadModule("/app/data.ts");

let checks = 0;
const failures = [];
const assert = (condition, label, detail = "") => {
  checks += 1;
  if (!condition) failures.push({ label, detail });
};

for (const industry of industries) {
  const product = products.find((item) => item.industryId === industry.id);
  const scenario = scenarios.find((item) => item.id === "fit");
  const customer = customerInsights[industry.id][0];
  const opening = { role: "customer", text: `${customer.situation}. ${customer.need}.` };

  const grounded = runAdaptiveTurn({
    answer: "Dạ em hiểu điều chị đang cần. Chị dự kiến ngân sách khoảng bao nhiêu và cần trước thời điểm nào ạ?",
    industry,
    product,
    scenario,
    customer,
    transcript: [opening],
  });
  assert(grounded.diagnostics.answeredFacts.includes("budget"), `${industry.id}: trả lời ngân sách`, grounded.customerMessage);
  assert(grounded.diagnostics.answeredFacts.includes("timing"), `${industry.id}: trả lời thời gian`, grounded.customerMessage);
  assert(grounded.customerMessage.length < 650, `${industry.id}: câu khách không quá dài`, grounded.customerMessage);

  const nonsense = runAdaptiveTurn({ answer: "abc", industry, product, scenario, customer, transcript: [opening] });
  assert(nonsense.feedback.score <= 2, `${industry.id}: vô nghĩa điểm rất thấp`, String(nonsense.feedback.score));

  const vague = runAdaptiveTurn({ answer: "Chị xem mẫu 1 ok không ạ?", industry, product, scenario, customer, transcript: [opening] });
  assert(vague.feedback.score <= 18, `${industry.id}: lựa chọn mơ hồ bị giới hạn điểm`, `${vague.feedback.score}: ${vague.customerMessage}`);
  assert(/mẫu nào|lựa chọn nào|cụ thể/i.test(vague.customerMessage), `${industry.id}: khách yêu cầu làm rõ mẫu`, vague.customerMessage);

  const mismatchText = industry.id === "technology"
    ? "Chị cao và nặng bao nhiêu để em chọn laptop cho phù hợp ạ?"
    : "Máy này dùng chip gì và có bao nhiêu RAM để em chọn sản phẩm cho chị?";
  const mismatch = runAdaptiveTurn({ answer: mismatchText, industry, product, scenario, customer, transcript: [opening] });
  assert(mismatch.feedback.score <= 10, `${industry.id}: lệch ngành bị chặn điểm`, `${mismatch.feedback.score}: ${mismatch.customerMessage}`);

  const verbose = runAdaptiveTurn({
    answer: "Dạ em hiểu chị. Bên em có rất nhiều lựa chọn. Sản phẩm tốt và được nhiều khách tin dùng. Giá đang ưu đãi. Chính sách cũng tốt. Bảo hành đầy đủ. Đội ngũ hỗ trợ nhiệt tình. Chị cứ yên tâm. Em sẽ gửi thêm nhiều thông tin. Ngoài ra bên em còn có nhiều chương trình khác và rất nhiều quyền lợi khác dành cho chị trong tháng này.",
    industry,
    product,
    scenario,
    customer,
    transcript: [opening],
  });
  assert(verbose.feedback.score <= 55, `${industry.id}: dài dòng bị giới hạn điểm`, String(verbose.feedback.score));

  const repeated = runAdaptiveTurn({
    answer: "Ngân sách chị dự kiến khoảng bao nhiêu ạ?",
    industry,
    product,
    scenario,
    customer,
    transcript: [opening, { role: "customer", text: customer.budget }],
  });
  assert(/vừa nói rồi/i.test(repeated.customerMessage), `${industry.id}: không hỏi lại dữ kiện cũ`, repeated.customerMessage);
}

{
  const industry = industries.find((item) => item.id === "accessories");
  const product = products.find((item) => item.id === "silver-jewelry");
  const scenario = scenarios.find((item) => item.id === "trust");
  const customer = customerInsights.accessories[0];
  const transcript = [{ role: "customer", text: `${customer.situation}. ${customer.need}.` }];
  const replies = [];
  for (let index = 0; index < 10; index += 1) {
    const result = runAdaptiveTurn({
      answer: "Dạ em hiểu chị đang cân nhắc kỹ. Sản phẩm bên em có chính sách bảo hành và có thông tin kiểm chứng rõ ạ.",
      industry,
      product,
      scenario,
      customer,
      transcript,
    });
    replies.push(result.customerMessage);
    transcript.push({ role: "sale", text: "Tư vấn" }, { role: "customer", text: result.customerMessage });
  }
  assert(new Set(replies).size >= 8, "chống lặp: tối thiểu 8/10 câu khác nhau", replies.join(" | "));
  const worstSimilarity = replies.flatMap((left, index) => replies.slice(index + 1).map((right) => similarity(left, right))).reduce((max, value) => Math.max(max, value), 0);
  assert(worstSimilarity < 0.9, "chống lặp: không có câu gần như sao chép", String(worstSimilarity));
}

await server.close();

if (failures.length) {
  console.error(JSON.stringify({ checks, passed: checks - failures.length, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ checks, passed: checks, industries: industries.length, status: "ok" }, null, 2));
