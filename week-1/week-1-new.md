# TDD Research Document

## MindX Engineer Onboarding - Week 1

---

## 1. Core Principles của TDD (Test-Driven Development)

### 1.1 TDD là gì?

TDD là viết tắt của Test Driven Development là yêu cầu người viết code phải thực hiện viết các test trước khi viết các code chính, thay vì kiểm tra các code viết xong thì nó sẽ yêu cầu các lập trình viên viết các bài test ra trước. Việc viết test trước giúp lập trình viên hiểu hơn được cách triển khai và code hoạt động, đồng thời sẽ giúp khắc phục được lỗi ngay từ đầu.

### 1.2 Ưu nhược điểm của TDD

**Ưu điểm:**

- Cải thiện chất lượng mã nguồn và giảm thiếu lỗi: TDD giúp mình dễ phát hiện lỗi sớm hơn trong quá trình phát triển vì code viết sẽ được kiểm tra luôn khi mình viết ra, việc phát hiện lỗi sớm sẽ giúp mình đảm bảo tiết kiệm được chi phí và thời gian.
- Thiết kế mã nguồn rõ ràng và dễ bảo trì:khuyến khích lập trình viên chia nhỏ vấn đề ra các unit test, có thể kiểm thử độc lập, mỗi unit test như tài liệu kĩ thuật giúp lập trình viên hiểu rõ hơn chức năng của từng phần code.
- Hỗ trợ việc refactor code mà đảm bảo không lỗi: giúp lập trình viên tự tin hơn trong việc refactor code vì có một bộ test tự động đảm bảo thay đổi không ảnh hưởng đến hệ thống.

**Nhược điểm:**

- Không có giải pháp nào thần kỳ: TDD giúp tìm ra lỗi nhưng nó sẽ không giúp mình tìm ra lỗi khi lỗi mình tự tạo ra trong kiểm thử và triển khai mã, nếu mình chưa hiểu vấn đề thì nó sẽ không giúp ích đưc gì cho mình cả.
- Quá trình chậm chạp: Nó làm mình rât mất nhiều thời gian cho việc triển khai đơn giản, nó bắt mình phải suy nghĩ về giao diện, viết mã kiểm thử và chạy các bài kiểm thử trước khi thực bắt đầu viết mã.
- Tât cả thành viên trong nhóm đều phải làm điều đó: Vì nó ảnh hưởng đến kế hoạch viết mã nên tất cả thành viên trong nhóm đều sử dụng hoặc không ai sử dụng cả.
- Các bài kiểm thử sẽ yêu cầu duy trì khi được yêu cầu thay đổi: khi thay đổi bạn cần thay đổi mã nguồn và kiểm thử, nhưng mà làm việc với TDD thì bạn các thay đổi các mã kiểm thử trước để nó vượt qua, vì thế nó sẽ tốn rất nhiêu thời gian.

### 1.3 Khi nào nên dùng TDD và khi nào không nên dùng

- TDD không nên áp dụng máy móc cho toàn bộ dự án, ưu tiên áp dụng cho các module có business logic rủi ro cao như payment, authencation,order processing. Với các phần CRUD đơn giản hoặc POC cần triển khai nhanh thì mình nên code trước rồi viết test sau để đảm bảo tiến độ.
- TDD giúp nâng cao chât lượng sản phẩm nhưng cần được sử dụng đúng nơi để đảm bảo chất lượng và tốc độ phát triển.
- Trước khi TDD xuất hiện thì người ta thường code trước rồi mới viết test. TDD không phải là điều kiện bắt buộc nhưng mà giá trị lớn nhât của nó mang lại là buộc developer suy nghĩ và yêu càu thiết kế code trước theo hướng kiểm thử ngya từ đầu.

### 1.4 Red-Green-Refactor Cycle

Nó là chu trình code lõi trong phát triển hướng kiểm thử, red là suy nghĩ về những gì mình muốn viết, green là suy nghĩ sao cho có cách vượt qua bài kiểm tra và refactor là suy cách cải thiện triển khai code của mình.

**RED:**

Giai đoạn này là điểm khởi đầu mục đích của nó là viết các bài kiểm thử để đánh giá viẹc triển khai một tính năng, bài kiểm tra thành công khi đáp ứng được yêu cầu của nó.

**GREEN:**

Giai đoạn này là viết code để bài kiểm tra thành công, mục tiêu của bước này là tìm ra giải pháp chức không cần tối ưu quá sớm trong quá trình viết mã, khi kết thúc giai đoạn này là bắt đầu giai đoạn an toàn và có thể bắt đầu bước tối ưu nó.

**REFACTOR:**

Trong giai đoạn tái cấu trúc thì mình vẫn đang ở trong vùng an toàn thì lúc này mình sẽ suy nghĩ về cách triển khai tối ưu và hiệu quả hơn, trả về kết quả đầu ra nhưng hiệu quả hơn, giúp dễ bảo trì và mở rộng.

### 1.5 Tại sao TDD quan trọng với AI-Generated Code?

Vì AI-generated code rất nhanh nhưng không đảm bảo mình đúng nghiệp vụ hoặc xử lý đầy đủ các edge cases, Vì thế áp dụng TDD, các test đóng vai trò như đặc tả nên dù là developer hay AI nó cũng phải vượt qua được yêu cầu bài test đã, trong thời đại này lập trình viên không cần gõ code nhanh mà là viết đúng yêu cầu, test đúng và đánh giá được chất lượng code do AI sinh ra.

---

## 2. Testing Levels Comparison

### 2.1 Unit Tests

**Định nghĩa:**

Unit tests là loại kiểm thử dùng để xác minh một đơn vị nhỏ nhất trong chương trình, thường là method hoặc class hoạt động đúng như yêu cầu. Nó hoạt động độc lập với hệ thống bên ngoài như database, message queue hoặc API,... mục tiêu là phát hiện được lỗi sớm để refactor code an toàn và đảm bảo logic của nó hoạt động chính xác.

**Khi nào nên dùng:**

Thường ưu tiên cho các phần có business logic phức tạp như tính toán, xử lý nghiệp vụ payment, order hoặc các utility dùng nhiều nơi. Áp dụng cho cấu trúc dự án lớn, nhiều người làm việc cùng nhau hoặc khi tái cấu trúc code vẫn đảm bảo hệ thống.

**Không nên dùng:**

Với các thành phần đơn giản như DTO, entity hoặc CRUD chỉ gọi repository mà không có logic đáng kể thì không nên áp dụng unit tests mà tập trung vào integration test để tối ưu chi phí bảo trì tests.

### 2.2 Integration Tests

**Định nghĩa:**
là tích hợp 1 nhóm các module riêng lẻ với nhau cùng với các unit test riêng lẻ trong từng module, nó nhằm xác minh hệ thống hoạt động đúng khi kết hợp với nhau, nó sử dụng các thành phần thật như database để kiểm tra luồng xử lý thực tế từ controller đến service rồi đến repostiory.


**Khi nào nên dùng:**

Hệ thống có nhiều module phụ thuộc nhau, tương tác giữa các thành phần hệ thống như controller, service, repository, database, gọi API nội bộ hoặc bên ngoài hoặc muốn kiểm tra luồng nghiệp vụ quan trọng.

**Không nên dùng:**

Khi hệ thống không cần đến database hoặc spring context, không cần tương tác giữa các component thì không nen dùng, unit test nhanh đơn giản và hiệu quả hơn.

### 2.3 End-to-End (E2E) Tests

**Định nghĩa:**

Là kiểm thử mô phỏng hành vi của người dùng từ đầu đến cuối, khác với 2 cái trên thì nó xác minh toàn bộ hệ thống từ fe, ba, database và các dịch vụ liên quan hoạt động đúng cùng nhau.

**Khi nào nên dùng:**

Nên dùng khi các luồng nghiệp vụ quan trọng như đăng nhập, đăng ký, đặt hàng thanh toán, ... những luồng cần xác nhận toàn bộ hệ thống khi tích hợp với nhau.

**Không nên dùng:**

Không sử dụng E2E cho các logic nhỏ, utility hoặc tất cả API vì chi phí thực thi và bảo trì cao, với các trường hợp đó 2 cái trên ổn và nhanh hơn.

### 2.4 Tỷ lệ đề xuất và giải thích

**Đề xuất:**
Đề xuất tỷ lệ 70/20/10 - tức 70% unit test, 20% integration tests, và 10% E2E tests.

**Lý do:**

Ý tưởng là phần lớn test là unit test nhanh và chi phí thấp, một phần nhỏ là integration test là tương tác giữa các thành phần và số lượng E2E thấp nhất vì chi phí thực thi và bảo trì cao, tỉ lệ có thể thay đổi tuỳ theo đặc thù dự án.

---

## 3. CLI Testing Examples

### 3.1 Commands Testing

Là kiểm thử các lệnh CLI để đảm bảo commands nhận tham số đúng thực thi đúng logic và trả về kết quả phù hợp.

**Khi nào nên dùng:**

Thường áp dụng cho các command line, batch jobs hoặc các công cụ tự động hoá.

**Không nên dùng:**

Với các commands đơn giản hoặc logic kiểm thử đầy đủ ở tầng service rồi thì chỉ càn kiểm tra luồng command thay vì viết nhiều test trùng lặp.

### 3.2 Validation Testing

Là hoạt động kiểm thử nhằm xác minh dữ liệu đầu vào hoặc kết quả tuân thủ các quy tắc rằng buộc đẫ được định nghĩa. Mục tiêu của nó là ngăn dữ liệu không hợp lệ vào hệ thống và đảm bảo tính toàn vẹn dữ liệu.

**Những thứ hay gặp:**

Thường áp dụng Validation Testing cho API request, form nhập liệu, dữ liệu import và các business rule như giới hạn độ dài, định dạng email hoặc điều kiện nghiệp vụ như số dư tài khoản phải đủ trước khi thực hiện giao dịch,...

### 3.3 File Storage Testing

Là hoạt động kiểm thử với các chức năng liên quan đến file như upload, download, cập nhập và xoá file. cần kiểm thử quan trọng như định dạng file, kích thước, quyền truy cập, xử lý file đúng cách. Mục tiêu là đảm bảo tính toàn vẹn, khả năng truy cập và bảo mật của file trong hệ thống.

### 3.4 Error Handling Testing

Là hoạt động kiểm thử các tình huống lỗi và ngoại lệ để đảm bảo hệ thống phản hồi cho mình đúng cách, không crash và không cung cấp thông tin phù hợp cho người dùng thấy.

**Ưu điểm:**

Giúp phát hiện sớm các tình huống bâts thường, tăng ổn định, trải nghiệm cho người dùng và giảm rủi ro.

**Nhược điểm:**

Số lượng test cases tăng nhanh, chi phí bảo trì cao và khó bao phủ toàn bộ các lỗi có thể xảy ra vì thế nên ưu tiên các chức năng rủi ro cao như thanh toán, chuyển tiền,... hoặc tích hợp hệ thống bên ngoài.

---

## 4. AI Validation Strategy

### 4.1 How Tests Help Verify AI Code

AI có thể tạo code rất nhanh nhưng nó cũng sẽ không đảm bảo code đúng với yêu cầu nghiệp vụ hoặc xử lý đầy đủ các trường hợp biên. Các loại test như Unit test, Integration test và E2E giúp xác minh hành vi code 1 cách có độc lập.
Test đóng vai trò cơ chế đảm bảo code được sinh ra không chỉ compile mà còn hoạt động đúng theo yêu cầu hệ thống
AI có thể viét code nhưng test mới chứng minh code nó đúng.

### 4.2 Guardrails for AI-Generated Code

- Là cơ chế đảm bảo code được sinh ra đáp ứng đủ chất lượng trước khi đưa vào hệ thống.
- AI có thể tăng tốc đọ phát triển phần mèm nhưng guardrails là yếu tố đảm bảo tính đúng đắn, bảo mật và khả năng duy trì code.
- AI giúp code nhanh hơn còn guardrails giúp đảm bảo code có đủ an toàn và đúng để đưa vào production.

### 4.3 AI Validation Checklist

Khi đánh giá AI-generated code, thường sử dụng check list gồm: xác minh code có đáp ứng được yêu cầu nghiệp vụ hay không, kiểm tra unit tests và integration test, xem xét các edge cases và error handling, đánh giá rủi ro bảo mật, đảm bảo hiệu năng và code tuân thủ kiến trúc của dự án.
AI có thể tạo code nhanh nhưng trách nhiệm xác nhận tính đúng đắn là viẹc của kỹ sư phần mềm.

---

## 5. Common Mistakes

### 5.1 Over-Testing

Là việc viết quá nhiều test cho các phần ít rủi ro hoặc ít giá trị, dẫn đến chi phí bảo trì cao hơn lợi ích nhận được.

**Tác hại:**

Làm tăng chi phí bảo trì, kéo dài thời gian chạy CI/CD, làm chậm tốc đọ phat triển, refactor trở nên khó khăn hơn. ngoài ra tập trung vào test ít giá trị có thể tạo cảm giác an toàn giả về chất lượng phần mềm.

**Cách tránh:**

Ưu tiên kiểm thử các business logic quan trọng, tập trung vào hành vi của hệ thống thay vì triển khai và áp dụng test pymamid để cân bằng giữa unit test, integration test và E2E tests.

### 5.2 Weak Assertions

Là các assertion không xác minh được những kết quả quan trọng của hệ thống, ví dụ như kiểu chỉ kiểm tra http status mà không kiểm tra dữ liệu thực tế. Những assertion này có thể khiến test pass dù business logic bị lỗi tạo cảm giác an toàn giả về chât lượng phần mềm.

**Tác hại:**

Tạo cảm giác an toàn giả vì test vẫn pass dù business logic có thể đã sai.

**Cách tránh:**

Thường assert vào business outcome, kiểm tra dữ liệu cụ thể, các field quan trọng, đảm bảo business rule bị phá vỡ thì test sẽ fail ngay.

### 5.3 Testing Implementation Details

Làm test trở nên mong manh vì phụ thuộc vào cách triển khai bên trong thay vì bên ngoài của hệ thống. Khi rafactor code mà business logic không thay đổi, các test vẫn có thể fail, làm tăng chi phí bảo trì và cản trở cải tiến mã nguồn.

**Tác hại:**

Khiến test dễ fail khi rafactor code, làm tăng chi phí bảo trì và caản trở việc cải tiến mã nguồn.

**Cách tránh:**

Đê tránh vấn đề này ưu tiên kiểm tra business outcome và behavior của hệ thống qua assertions thay vì xác minh chi tiết nội bộ được gọi.

### 5.4 Blindly Trusting AI

Là việc sử dụng code hoặc giải pháp do AI đề ra mà không thực hiện review, kiểm thử và xác minh lại. Điều này có thể dẫn đến bug nghiệp vụ, lỗ hổng bảo mật, vấn đề hiệu năng và vi phạm kiến trúc hệ thống.

**Tác hại:**

Tác hại lớn nhất là tạo cảm giác an toàn giả, code có thẻe compile và chạy nhưng vẫn sai business logic hoặc tồn tại các vấn đề bảo mật và hiệu năng.

**Cách tránh:**

Đê tránh đièu đó không đánh giá code có chạy được hay không mà dựa trên nó có đáp ứng requirement hay không. Mọi output từ AI cần được review và test trước khi cho vào production.

---

## 6. Evidence: 3 Workflows Applied

### 6.1 Layered Questioning

là kỹ thuật đặt câu hỏi nhiều tầng để hiểu sau về thông tin thay vì chấp nhận câu trả lời đầu tiên. Khi làm việc với AI thường tiếp tục hỏi nguyên nhân, cách hoạt động, ưu nhược điểm, các trường hợp ngoại lệ và điều kiện áp dụng.
Cách này giúp mình tránh hiểu sai vấn đề và đánh giá chính xác chất lượng câu trả lời do AI tạo ra.

Research -> Brief -> Example -> Validation

**Khi nào sử dụng:**

Khi cần đào sâu vào một vấn đề kỹ thuật, phân tích yêu cầu nghiệp vụ hoặc đánh giá code do AI tạo ra. Kỹ thuật này giúp đảm bảo làm rõ nguyên nhân, cách hoạt động, điều kiện áp dụng và tuỏnbgwf hợp ngoại lệ, nếu không áp dụng sẽ hiểu cách hời hợt và bỏ sót edge cases quan trọng.

**Hạn chế:**

Tránh lạm dụng vì việc đặt quá nhiều vấn đề cho câu hỏi đơn giản có thể làm chậm tiến độ phát triển.

### 6.2 Solution Exploration

**Testing Levels:**

Là cấp độ kiểm thử khác nhau trong quá trình phát triển phần mềm. Gồm unit test để kiểm tra class và method riêng lẻ, integration test để kiểm tra sự tương tác qua lại, E2E test mô phỏng luồng nghiệp vuk người dùng.

**Testing framework:**

Là tập hợp các công cụ và thư viện để hỗ trợ việc viết, thực thi và quản lý test. Ví dụ như là Junit 5 để viết test, Mockito để mock dependecy, AssertJ để viết assertion dễ đọc hơn,...

**Mocking strategy:**

Là cách xác định xem những dependecy nào cần được giả lập trong quá trình kiểm thử. Ví dụ như Unit test, thường mock dependecy bên ngoài như repository, External API,...

### 6.3 Iterative Refinement

Là phương pháp cải tiến qua nhiều vòng lặp nhỏ. Thay vì cố gắng tạo ra giải pháp ngay từ đầu, thường xây dựng một phiên bản đơn giản hoạt động trước sau đó tiếp tục đánh giá, kiểm thử và cải thiện dựa trên phản hồi yêu cầu mới.

### 6.4 Key Learnings

AI giúp tăng tốc độ phát triển phần mềm nhưng nó cũng không đảm bảo tính đúng đắn của nghiệp vụ. Vì thế nên phải code review, testing, validation checklist để kiếm trước lại kết quả.
Đặt câu hỏi nhiều lớp và cải tiến dần qua nhiều vòng lặp thường mang lại kết quả tốt hơn thay vì chấp nhận kết quả đầu tiên.