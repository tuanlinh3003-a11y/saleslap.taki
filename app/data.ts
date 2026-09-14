export type Product = {
  id: string;
  name: string;
  category: string;
  promise: string;
  price: string;
};

export type Scenario = {
  id: string;
  name: string;
  step: number;
  goal: string;
  opening: string;
  objection: "time" | "price" | "trust" | "authority" | "fit" | "competition";
};

export const products: Product[] = [
  { id: "ai-business-system", name: "AI Business System", category: "Vận hành & tăng trưởng", promise: "Chuẩn hóa quy trình, CRM và hệ thống kinh doanh có thể đo lường", price: "Liên hệ tư vấn" },
  { id: "ai-super-traffic", name: "AI Super Traffic", category: "Marketing", promise: "Xây hệ thống nội dung và nguồn khách hàng bằng AI", price: "499.000đ" },
  { id: "ai-super-sale", name: "AI Super Sale", category: "Kinh doanh", promise: "Nâng năng lực tư vấn, xử lý từ chối và chốt sales", price: "Liên hệ tư vấn" },
  { id: "ai-master", name: "AI Master", category: "AI thực chiến", promise: "Ứng dụng AI vào công việc theo lộ trình có người hướng dẫn", price: "Liên hệ tư vấn" },
  { id: "ai-leadership", name: "AI Leadership", category: "Quản trị", promise: "Ứng dụng AI trong quản trị đội ngũ và ra quyết định", price: "Liên hệ tư vấn" },
  { id: "ai-content", name: "AI Content Mastery", category: "Nội dung", promise: "Tạo hệ thống nội dung nhất quán, nhanh và bám mục tiêu bán hàng", price: "Liên hệ tư vấn" },
  { id: "ai-automation", name: "AI Automation", category: "Tự động hóa", promise: "Tự động hóa tác vụ lặp lại và luồng dữ liệu nội bộ", price: "Liên hệ tư vấn" },
  { id: "personal-brand", name: "Xây dựng thương hiệu cá nhân", category: "Thương hiệu", promise: "Định vị chuyên môn và xây kênh thu hút khách hàng", price: "Liên hệ tư vấn" },
];

export const scenarios: Scenario[] = [
  { id: "cold", name: "Khách lạnh, trả lời ngắn", step: 2, goal: "Tạo thiện cảm và xin phép khai thác", opening: "Chị đang bận, em nói nhanh giúp chị nhé.", objection: "time" },
  { id: "no-time", name: "Khách chưa có thời gian", step: 6, goal: "Làm rõ rào cản thời gian thật", opening: "Chị từng mua khóa học rồi nhưng bận quá nên toàn bỏ dở.", objection: "time" },
  { id: "price", name: "Khách phản đối giá", step: 7, goal: "Tách giá khỏi giá trị và làm rõ chi phí không hành động", opening: "Giá bên em cao hơn mấy khóa chị đang xem. Vì sao chị phải chọn bên em?", objection: "price" },
  { id: "trust", name: "Khách mất niềm tin", step: 4, goal: "Dùng bằng chứng phù hợp, không hứa quá", opening: "Bên nào cũng nói hay. Chị cần biết học xong có áp dụng được thật không.", objection: "trust" },
  { id: "fit", name: "Khách nghi ngờ phù hợp", step: 5, goal: "Nối giải pháp vào đúng điểm đau", opening: "Doanh nghiệp chị nhỏ, liệu chương trình này có quá tầm không?", objection: "fit" },
  { id: "authority", name: "Khách chưa tự quyết", step: 8, goal: "Xác định người quyết định và thống nhất bước tiếp", opening: "Chị phải hỏi thêm chồng và cộng sự, chưa thể quyết ngay.", objection: "authority" },
  { id: "competition", name: "Khách đang so sánh", step: 7, goal: "Làm rõ tiêu chí quyết định thay vì nói xấu đối thủ", opening: "Chị đang so bên em với hai đơn vị khác. Điểm khác biệt thực sự là gì?", objection: "competition" },
  { id: "messy", name: "Khách khó tính, quy trình rối", step: 3, goal: "Chẩn đoán có thứ tự và lượng hóa hậu quả", opening: "CRM và quy trình bên chị đang rời rạc, nhưng chị không biết nên sửa từ đâu trước.", objection: "fit" },
];

export const takiSteps = [
  "Mở đầu và xin phép",
  "Tạo thiện cảm, kiểm soát cuộc trò chuyện",
  "Khai thác hiện trạng và mục tiêu",
  "Đào sâu điểm đau, hậu quả",
  "Nối giải pháp đúng nhu cầu",
  "Trình bày bằng chứng phù hợp",
  "Xử lý từ chối theo CETAA",
  "Chốt bước tiếp theo cụ thể",
];
