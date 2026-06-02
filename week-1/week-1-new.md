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