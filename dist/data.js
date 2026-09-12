window.TAKI_DATA = {
  products: [
    { id: 'super-traffic', name: 'AI Super Traffic', type: 'Đào tạo online', price: 499000, link: 'https://aisupertraffic.nguyentatkiem.com.vn/?utm_source=gg&utm_campaign=seo&utm_id=google', description: 'Tạo nội dung viral, kéo traffic tự động, tăng tương tác và chuyển đổi bằng AI.' },
    { id: 'affiliate', name: 'Affiliate Systems', type: 'Đào tạo online', price: 2686000, link: 'https://affiliate.nguyentatkiem.com/?utm_source=gg&utm_campaign=seo&utm_id=google', description: 'Xây hệ thống làm Affiliate bằng AI, tư duy đúng và quy trình kiếm tiền rõ ràng.' },
    { id: 'super-builder', name: 'AI Super Builder', type: 'Đào tạo online', price: 3950000, link: 'https://aisuperbuilder.nguyentatkiem.com.vn/?utm_source=gg&utm_campaign=seo&utm_id=google', description: 'Xây hệ thống marketing, kéo khách hàng và nâng hiệu suất công việc bằng AI.' },
    { id: 'personality', name: 'AI Personality Master', type: 'Đào tạo online', price: 686000, link: 'https://aipersonalitymaster.nguyentatkiem.com.vn/?utm_source=gg&utm_campaign=seo&utm_id=google', description: 'Xây dựng thương hiệu cá nhân trong kỷ nguyên AI.' },
    { id: 'brandup', name: 'BrandUP', type: 'Đào tạo offline', price: 10000000, link: 'https://brandup.taki.vn/', description: 'Xây thương hiệu cá nhân đa nền tảng bằng AI, thực hành và mang hệ thống về nhà.' },
    { id: 'abs', name: 'AI Business System', type: 'Đào tạo offline', price: 10000000, link: 'https://aibusiness.nguyentatkiem.com/aiagent', description: 'Ứng dụng AI vào chiến lược, marketing, sales và vận hành doanh nghiệp.' },
    { id: 'ultimate-sales', name: 'Ultimate Sales', type: 'Đào tạo offline', price: 5000000, link: 'https://ultimatesales.taki.vn/', description: 'Xây cỗ máy bán hàng, tạo khách liên tục, chốt bằng quy trình và nhân bản người giỏi bằng AI.' },
    { id: 'scale-up', name: 'AI Scale Up Coaching', type: 'Coaching và offline', price: 100000000, link: 'https://aiscaleupcoaching.taki.vn/', description: 'Tái cấu trúc marketing, sales và vận hành bằng AI để tăng trưởng mà không tăng bộ máy.' },
    { id: 'autovis', name: 'Autovis AI', type: 'Tool', priceLabel: 'Dùng thử', link: 'https://autovis.ai/ref?ref_code=QXQVyMPPpO', description: 'Tạo người mẫu AI và thử trang phục trên hình ảnh.' },
    { id: 'remin', name: 'Remin AI', type: 'Máy ghi âm AI', priceLabel: 'Liên hệ', link: 'https://mayghiamai.remin.ai/', description: 'Ghi âm, tóm tắt, tạo tài liệu, mindmap và việc cần làm từ cuộc họp hoặc bài học.' }
  ],
  process: [
    { no: 0, name: 'Chuẩn bị', focus: 'Tìm hiểu ngành nghề, lịch sử khách, sản phẩm và điểm đau trước cuộc gọi.' },
    { no: 1, name: 'Tạo hình ảnh chuyên gia', focus: 'Gọi đúng tên khách và tạo thiện cảm trong những giây đầu.' },
    { no: 2, name: 'Giới thiệu thu hút', focus: 'Nêu danh tính, lý do gọi và xin 3–5 phút trao đổi.' },
    { no: 3, name: 'Thiết lập quan hệ', focus: 'Kết nối theo cá nhân, tổ chức, mục tiêu hoặc trở ngại.' },
    { no: 4, name: 'Khảo sát nhu cầu', focus: 'Khai thác ngành, doanh thu/lợi nhuận, khó khăn và hỗ trợ mong muốn.' },
    { no: 5, name: 'Trình bày giải pháp', focus: 'Tóm tắt nhu cầu rồi nối đúng lợi ích sản phẩm vào điểm đau.' },
    { no: 6, name: 'Xử lý từ chối', focus: 'Đồng cảm, thay đổi nhận thức, làm rõ và đặt câu hỏi chốt.' },
    { no: 7, name: 'Lên đơn', focus: 'Xác nhận lựa chọn, thông tin và bước thanh toán/triển khai.' }
  ],
  scenarios: [
    { id:'opening', productIds:['abs','brandup','ultimate-sales','scale-up'], stage:'Bước 1–2', title:'Mở đầu cuộc gọi với khách bận', difficulty:'Dễ', accent:'#16a36a', customer:'Alo, chị đang chuẩn bị vào họp, em nói nhanh giúp chị nhé.', mission:'Gọi đúng tên khách, giới thiệu rõ vai trò và xin một khoảng thời gian cụ thể hoặc chốt lịch gọi lại.', coachKeys:['tên','em là','phút','gọi lại'], replies:['Chị chỉ có khoảng 2 phút thôi.', 'Ừ, em nói giúp chị chương trình này dành cho ai?', 'Chiều 3 giờ em gọi lại nhé.'] },
    { id:'discovery', productIds:['abs','brandup','super-builder','super-traffic','affiliate'], stage:'Bước 3–4', title:'Tìm điểm đau kinh doanh', difficulty:'Trung bình', accent:'#1261d8', customer:'Chị có tìm hiểu AI nhưng chưa biết nó giúp gì cho việc kinh doanh của chị.', mission:'Khai thác đủ ngành nghề, quy mô, doanh thu/lợi nhuận, marketing, sales, vận hành và hỗ trợ khách mong muốn.', coachKeys:['kinh doanh','quy mô','doanh thu','khó khăn','mong muốn'], replies:['Chị bán mỹ phẩm, đội có 6 người.', 'Doanh thu khoảng 500 triệu nhưng quảng cáo tăng mà đơn không đều.', 'Chị đang phải tự kiểm tra cả marketing lẫn đội sale.'] },
    { id:'solution', productIds:['abs','brandup','ultimate-sales','scale-up'], stage:'Bước 5', title:'Nối giải pháp vào điểm đau', difficulty:'Trung bình', accent:'#4b7bec', customer:'Bên chị tốn nhiều tiền marketing mà vẫn phụ thuộc vào vài bạn sale cứng.', mission:'Tóm tắt đúng vấn đề khách vừa nói, xin xác nhận rồi mới giới thiệu lợi ích phù hợp. Tránh kể hàng loạt công cụ.', coachKeys:['đúng không','hệ thống','marketing','sale','hiệu suất'], replies:['Đúng, sale nghỉ là doanh thu bị ảnh hưởng ngay.', 'Cụ thể chương trình giúp chị xây hệ thống thế nào?', 'Có phần nào áp dụng ngay cho đội hiện tại không?'] },
    { id:'price', productIds:['abs','brandup','ultimate-sales','scale-up','super-builder'], stage:'Bước 6', title:'Khách nói giá cao', difficulty:'Khó', accent:'#f7a928', customer:'Giá chương trình cao quá em ạ, chị thấy bên khác rẻ hơn nhiều.', mission:'Đồng cảm, làm rõ tiêu chí so sánh, đối chiếu chi phí hiện tại và giá trị kỳ vọng; không giảm giá ngay.', coachKeys:['em hiểu','tiêu chí','chi phí','hiệu suất','giá trị'], replies:['Chị đang so với một khóa online khoảng 3 triệu.', 'Marketing bên chị mỗi tháng tốn khoảng 40 triệu.', 'Nếu áp dụng được ngay và có hỗ trợ thì chị mới cân nhắc.'] },
    { id:'time', productIds:['abs','brandup','ultimate-sales','scale-up','super-traffic','affiliate','super-builder','personality'], stage:'Bước 6', title:'Khách chưa có thời gian', difficulty:'Trung bình', accent:'#ef7f32', customer:'Chị bận lắm, trước mua nhiều khóa video rồi cũng để đó thôi.', mission:'Đồng cảm với lịch bận, tìm nguyên nhân chưa học được và kết nối việc xây hệ thống với mục tiêu giải phóng thời gian.', coachKeys:['em hiểu','bận','thời gian','hệ thống','hỗ trợ'], replies:['Chị vừa vận hành vừa tự làm nội dung nên không có thời gian.', 'Khóa này học theo lịch thế nào?', 'Có ai hỗ trợ khi chị triển khai không?'] },
    { id:'beginner', productIds:['abs','brandup','super-builder','super-traffic','affiliate','personality','autovis','remin'], stage:'Bước 6', title:'Khách chưa rành AI', difficulty:'Dễ', accent:'#26a69a', customer:'Anh chưa biết gì về AI và dùng máy tính cũng chỉ ở mức cơ bản.', mission:'Giảm nỗi sợ kỹ thuật, giải thích theo bài toán kinh doanh và kiểm tra mức độ sẵn sàng học/áp dụng.', coachKeys:['không cần','bài toán','từng bước','hỗ trợ','mục tiêu'], replies:['Anh chủ yếu muốn làm nội dung nhanh hơn.', 'Có cần biết lập trình không em?', 'Nếu có hướng dẫn từng bước thì anh học được.'] },
    { id:'failed-before', productIds:['abs','brandup','ultimate-sales','scale-up'], stage:'Bước 6', title:'Từng học nhưng không hiệu quả', difficulty:'Khó', accent:'#eb3349', customer:'Anh học nhiều khóa rồi nhưng về không áp dụng được nên giờ khá ngại.', mission:'Công nhận trải nghiệm của khách, tìm nguyên nhân cũ và làm rõ điểm khác biệt về hệ thống, thực hành và hỗ trợ.', coachKeys:['em hiểu','vì sao','áp dụng','hệ thống','hỗ trợ'], replies:['Khóa trước chủ yếu nghe lý thuyết rồi tự làm.', 'Anh không có người theo sát nên bỏ giữa chừng.', 'Bên em hỗ trợ cụ thể đến đâu?'] },
    { id:'partner', productIds:['abs','brandup','ultimate-sales','scale-up'], stage:'Bước 6–7', title:'Cần hỏi người nhà hoặc đối tác', difficulty:'Khó', accent:'#8c4ae4', customer:'Chị cần trao đổi thêm với chồng và đối tác trước khi quyết định.', mission:'Tôn trọng người cùng quyết định, làm rõ tiêu chí họ quan tâm và chốt bước tiếp theo có thời gian cụ thể.', coachKeys:['đồng ý','quan tâm','tiêu chí','gửi','gọi lại'], replies:['Chồng chị sẽ hỏi về hiệu quả và thời gian học.', 'Em gửi chị nội dung và lịch học cụ thể nhé.', 'Sáng mai 10 giờ em gọi lại được.'] }
  ]
};

// Ngân hàng phản biện dùng bởi bộ máy khách hàng thích ứng. Nội dung được chia
// theo ý định để mỗi câu trả lời của sale mở ra một nhánh gây khó khác nhau.
window.TAKI_CHALLENGE_DATA = {
  maxTurns: 30,
  banks: {
    clarify: [
      'Em đang nói khá chung. Cụ thể {product} giải quyết phần nào trước, trong bao lâu?',
      'Cho chị một ví dụ sát với doanh nghiệp của chị, đừng nói theo lý thuyết nhé.',
      'Nếu chỉ được chọn một kết quả đo được sau chương trình, em cam kết đội chị cải thiện chỉ số nào?',
      'Điểm nào trong giải pháp này thực sự khác với việc chị tự tìm hiểu trên mạng?',
      'Em nói “xây hệ thống”, vậy đầu vào, đầu ra và người chịu trách nhiệm từng phần là gì?',
      'Chị cần con số hoặc tiêu chí kiểm chứng, không cần thêm khẩu hiệu. Em làm rõ được không?',
      'Nếu áp dụng vào tình hình hiện tại của chị, tuần đầu tiên đội chị phải làm chính xác việc gì?',
      'Em vừa đưa ra nhiều lợi ích. Lợi ích nào liên quan trực tiếp nhất đến vấn đề chị đã nói?'
    ],
    discovery: [
      'Tại sao em hỏi thông tin đó, nó ảnh hưởng thế nào đến giải pháp em đề xuất?',
      'Chị có marketing, sale và vận hành đều đang có vấn đề. Em muốn đào sâu phần nào trước?',
      'Nếu chị không muốn chia sẻ doanh thu thì em còn cách nào đánh giá quy mô nhu cầu không?',
      'Đội chị đã thử nhiều công cụ rồi. Em cần biết thêm điều gì để không tư vấn sai lần nữa?',
      'Em chưa hỏi mục tiêu của chị trong 3 tháng tới mà đã nói giải pháp, có hơi sớm không?',
      'Theo em, vấn đề chị vừa kể là nguyên nhân hay chỉ là biểu hiện?',
      'Nếu đội sale yếu nhưng lượng khách cũng chưa đủ, em ưu tiên xử lý bên nào trước?',
      'Chị muốn tăng doanh thu nhưng không muốn tăng người. Em cần hỏi thêm gì để đánh giá tính khả thi?'
    ],
    price: [
      'Mức {price} cao hơn ngân sách chị dự kiến. Giá trị nào đủ để bù phần chênh lệch đó?',
      'Nếu kết quả không như kỳ vọng thì chi phí cơ hội của chị được xử lý thế nào?',
      'Bên khác rẻ hơn một nửa. Em so sánh giúp chị trên cùng ba tiêu chí cụ thể được không?',
      'Ngoài học phí còn chi phí công cụ, nhân sự hay quảng cáo nào chị phải chuẩn bị?',
      'Bao lâu thì chị có thể nhìn thấy một chỉ số đủ rõ để biết khoản đầu tư này đúng?',
      'Nếu chị chỉ duyệt được một nửa ngân sách, em sẽ khuyên chị làm gì trước?',
      'Em đang nói về giá trị, nhưng chị cần cách tính hoàn vốn phù hợp với doanh nghiệp chị.',
      'Tại sao chị nên mua lúc này thay vì chờ thêm ba tháng để tự thử?'
    ],
    proof: [
      'Có trường hợp nào giống quy mô của chị đã làm được chưa, và họ bắt đầu từ đâu?',
      'Chị không muốn nghe case thành công đẹp nhất. Một học viên bình thường thường đạt được gì?',
      'Dữ liệu nào chứng minh phương pháp này hiệu quả chứ không chỉ do người triển khai giỏi?',
      'Nếu em không được phép dùng lời chứng thực, em sẽ chứng minh giá trị chương trình thế nào?',
      'Điều kiện nào phải có thì kết quả mới xảy ra? Chị muốn nghe cả phần khó.',
      'Có trường hợp triển khai không thành công không, và nguyên nhân thường nằm ở đâu?',
      'Kết quả phụ thuộc bao nhiêu vào giảng viên và bao nhiêu vào năng lực đội của chị?',
      'Chị cần một tiêu chuẩn nghiệm thu. Em đề xuất đo trước và sau chương trình ra sao?'
    ],
    implementation: [
      'Ai trong đội chị nên tham gia và mỗi tuần phải dành bao nhiêu giờ?',
      'Đội chị ngại thay đổi quy trình. Bên em xử lý kháng cự nội bộ như thế nào?',
      'Sau buổi học, ai kiểm tra việc áp dụng và trong thời gian bao lâu?',
      'Nếu nhân sự của chị không biết AI thì lộ trình triển khai có thay đổi không?',
      'Chị đang dùng CRM khác. Giải pháp này có bắt chị thay toàn bộ hệ thống không?',
      'Nếu người sale giỏi nhất không hợp tác thì chương trình còn triển khai được không?',
      'Phần nào đội chị tự làm, phần nào TAKI hướng dẫn và phần nào cần thuê ngoài?',
      'Trong 30 ngày đầu, rủi ro lớn nhất khi áp dụng là gì?'
    ],
    time: [
      'Lịch của chị thay đổi liên tục. Nếu bỏ lỡ một buổi thì có theo kịp không?',
      'Chị đã mua khóa học trước nhưng không có thời gian làm bài. Lần này khác ở cơ chế nào?',
      'Nếu chỉ có hai giờ mỗi tuần, em có dám khuyên chị tham gia không?',
      'Đội chị đang chạy chiến dịch lớn. Vì sao đây vẫn là thời điểm phù hợp?',
      'Chị cần thấy kế hoạch học và kế hoạch áp dụng tách riêng, em mô tả được không?',
      'Nếu phải chọn giữa xử lý công việc hiện tại và học, chương trình giúp chị ưu tiên thế nào?',
      'Có phần nào bắt buộc làm trực tiếp, phần nào có thể xem hoặc thực hành sau?',
      'Em nói chương trình giúp tiết kiệm thời gian, nhưng giai đoạn đầu sẽ tốn thêm bao nhiêu thời gian?'
    ],
    authority: [
      'Chị không phải người duyệt cuối. Em cần cung cấp gì để đối tác của chị đánh giá?',
      'Chồng chị sẽ hỏi rủi ro tài chính đầu tiên. Em muốn chị trả lời anh ấy thế nào?',
      'Nếu đối tác phản đối vì đội chưa sẵn sàng, bước tiếp theo của em là gì?',
      'Em có sẵn sàng trình bày lại với cả ba người ra quyết định không?',
      'Mỗi người trong ban lãnh đạo quan tâm một chỉ số khác nhau. Em sẽ chốt theo tiêu chí nào?',
      'Nếu chị nói cần suy nghĩ thêm mà không hẹn thời gian, em sẽ làm gì?',
      'Tại sao chị nên cho em gặp người quyết định thay vì chỉ chuyển tài liệu?',
      'Nếu người duyệt chỉ cho em năm phút, ba ý quan trọng nhất em sẽ nói là gì?'
    ],
    trust: [
      'Em đang né đúng điều chị lo. Em trả lời thẳng rủi ro lớn nhất giúp chị.',
      'Câu trả lời của em giống kịch bản bán hàng. Em có thể nói thực tế hơn không?',
      'Chị cảm giác em chưa nghe kỹ điều chị vừa nói. Em nhắc lại đúng vấn đề của chị xem.',
      'Nếu sản phẩm này không phù hợp với chị, dấu hiệu nào khiến em khuyên chị không mua?',
      'Em đang cố chốt hơi nhanh. Còn thông tin nào em chưa biết mà vẫn muốn chị quyết định?',
      'Chị cần một câu trả lời có cả ưu và nhược điểm, không chỉ lợi ích.',
      'Điều gì trong câu trả lời vừa rồi của em dựa trên tình hình của chị?',
      'Chị chưa bị thuyết phục. Em thử đặt một câu hỏi khó hơn để hiểu đúng vấn đề đi.'
    ],
    closing: [
      'Chị vẫn chưa thấy lý do phải quyết định hôm nay. Có gì thay đổi nếu chị trì hoãn?',
      'Nếu đồng ý tìm hiểu tiếp, bước nhỏ nhất không ràng buộc mà chị có thể làm là gì?',
      'Em muốn chị chốt, nhưng em đã kiểm tra đủ điều kiện triển khai chưa?',
      'Chị cần văn bản tóm tắt mục tiêu, phạm vi hỗ trợ và tiêu chí kết quả trước khi quyết định.',
      'Nếu chị nói “để chị suy nghĩ”, em sẽ hỏi gì tiếp mà không gây áp lực?',
      'Điều kiện nào em cần chị xác nhận ngay để giữ tiến độ triển khai?',
      'Nếu hôm nay chưa thanh toán, em đề xuất mốc theo dõi cụ thể nào?',
      'Chị đồng ý về giá trị nhưng chưa chắc đội sẽ làm. Em chốt rủi ro đó thế nào?'
    ]
  },
  productChallenges: {
    'super-traffic': ['Traffic tăng mà không ra đơn thì có ý nghĩa gì?', 'Nội dung AI có làm thương hiệu của chị bị giống người khác không?', 'Nền tảng đổi thuật toán thì hệ thống còn hoạt động không?'],
    affiliate: ['Chị chưa có cộng đồng thì lấy đâu ra người mua?', 'Thu nhập Affiliate có ổn định hay chỉ là ví dụ đẹp?', 'Bao lâu mới có đơn đầu tiên và cần thêm ngân sách gì?'],
    'super-builder': ['Hệ thống nào được xây trước và ai vận hành sau khóa học?', 'Có tích hợp được với quy trình hiện tại hay phải làm lại?', 'Nếu công cụ AI thay đổi thì tài liệu có được cập nhật không?'],
    personality: ['Xây thương hiệu cá nhân nhưng chị không muốn xuất hiện nhiều thì sao?', 'Làm sao đo thương hiệu cá nhân chuyển thành doanh thu?', 'Nội dung AI có giữ được giọng nói riêng của chị không?'],
    brandup: ['Sau chương trình chị thực sự mang về những tài sản nào?', 'Học offline xong ai theo sát lúc đội chị triển khai?', 'BrandUP khác gì thuê một agency xây thương hiệu?'],
    abs: ['Cụ thể 100 trợ lý AI làm được việc gì trong doanh nghiệp chị?', 'Dữ liệu nội bộ đưa vào AI có an toàn không?', 'CRM và quy trình của chị đang rời rạc, phần nào phải chuẩn hóa trước?'],
    'ultimate-sales': ['Làm sao nhân bản sale giỏi mà không biến cả đội thành máy đọc kịch bản?', 'Chương trình xử lý vấn đề thiếu lead hay chỉ tăng tỷ lệ chốt?', 'Kết quả phụ thuộc vào trưởng nhóm sale đến mức nào?'],
    'scale-up': ['Mức đầu tư 100 triệu cần tạo thêm bao nhiêu lợi nhuận mới hợp lý?', 'Coaching can thiệp sâu đến đâu vào số liệu và nhân sự thật?', 'Nếu tái cấu trúc ảnh hưởng doanh thu ngắn hạn thì ai chịu trách nhiệm?'],
    autovis: ['Ảnh tạo ra có dùng thương mại được không?', 'Nếu hình trang phục sai chất liệu hoặc phom dáng thì xử lý thế nào?', 'Dùng thử giới hạn bao nhiêu ảnh và chi phí sau đó ra sao?'],
    remin: ['Ghi âm cuộc họp có bảo mật và xin phép người tham gia không?', 'Tiếng Việt nhiều giọng vùng miền thì độ chính xác thế nào?', 'Dữ liệu ghi âm được lưu ở đâu và có xóa hoàn toàn được không?']
  }
};
