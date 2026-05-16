# TDD Research Document

## MindX Engineer Onboarding - Week 1

**Author:** Lưu Đình Luyện
**Date:** 19-05-2026
**Mentor:** Trịnh Văn Thuận

---

## 1. Core Principles của TDD (Test-Driven Development)

### 1.1 TDD là gì?

**Định nghĩa:**
Phát triển hướng kiểm thử (Test-Driven Development -TDD) là một phương pháp luận trong phát triển phần mềm tập trung vào chu kỳ phát triển lặp đi lặp lại, trong đó trọng tâm được đặt vào việc viết các trường hợp kiểm thử trước khi viết tính năng hoặc chức năng thực tế. TDD sử dụng sự lặp lại của các chu kỳ phát triển ngắn. Nó kết hợp việc xây dựng và kiểm thử. Quá trình này không chỉ giúp đảm bảo tính đúng đắn của mã mà còn giúp phát triển thiết kế và kiến trúc của dự án đang thực hiện.


### 1.2 Red-Green-Refactor Cycle
TDD thường tuân thủ theo chu trình "Red-Green-Refactor", dưới đây là vòng lặp cốt lõi của phương pháp TDD trong Software Engineering.

```
┌─────────────────────────────────────────────────────────┐
│                    TDD CYCLE                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│    ┌─────────┐                                          │
│    │   RED   │  ←     Viết Test mới và để nó fail       │
│    └────┬────┘                                          │
│         ↓                                               │
│    ┌─────────┐                                          | 
│    │  GREEN  │  ←     Viết Code tối thiểu và để nó pass │
│    └────┬────┘                                          │
│         ↓                                               │
│    ┌──────────┐                                         │
│    │ REFACTOR │  ←    Tối ưu code nhưng vẫn pass test   │
│    └────┬─────┘                                         │
│         ↓                                               │
│     (Repeat)                                            │
└─────────────────────────────────────────────────────────┘
```

**RED:**

- Viết test trước khi implement code.
- Test phải fail vì chức năng chưa tồn tại hoặc chưa đúng.
- Giúp developer tập trung vào behavior/API design thay vì implementation
- Đảm bảo test thực có giá trị.
- Ép suy nghĩ từ góc nhìn người sử dụng code.
- Thường bắt đầu bằng các test đơn giản hoặc case quan trọng nhất.

**Ví dụ:**

```Java
    @Test
    void shouldReturnMaxNumber() {
        assertEquals(10, calculator.max(10, 5));
    }
```
-> Method max() chưa tồn tại => test fail(RED)

**GREEN:**

- Viết lượng code ít nhất để test pass.
- Chỉ tập trung giải quyết requirement hiện tại.
- Không tối ưu quá sớm.
- Không thêm logic "có thể tương lai sẽ cần".
- Mục tiêu duy nhất chuyển test từ đổ -> xanh.

**Ví dụ:**

```Java
    public int max(int a, int b) {
        return 10;
    }

    //Sau đó mới cải thiện dần sang 

    public int max(int a, int b) {
        return Math.max(a, b);
    }
```
**REFACTOR:**

- Tái cấu trúc code sau khi đã test đã pass.
- Clean code nhưng không làm thay đổi behavior.
- Remove duplicate code.
- Đổi tên biến/method dễ hiểu hơn.
- Tách class/method hợp lý.
- Có thể refactor cả unit test.

Mục tiêu của nó làm code dễ maintain, dễ mở rộng, dễ đọc và tuân theo các nguyên lý như DRY, SOLID, KISS.

Quan trọng:
- sau refactor phải chạy lại toàn bộ test.
- Nếu test vẫn xanh => refactor an toàn.

### 1.3 Tại sao TDD quan trọng với AI-Generated Code?

Trong thời đại AI coding assistant như OpenAi ChatGPT, Anthropic Claude hay Github Copilot có thể generate code chỉ trong vài giây, vấn đề lớn nhất không còn là "viết code nhanh" - mà là: 
| Làm sao để biết AI sing ra thực hiện đúng, an toàn và đáng tin?
Đây là lý do TDD trở nên quan trọng hơn bao giờ hết. 


1. AI viết code rất nhanh - nhưng không đảm bảo đúng.

AI thường:
- Sinh code "trông rất chi là hợp lý".
- Syntax đẹp.
- Clean.
- Compile được.
- Thậm trí pass vài happy-case đơn giản.

Nhưng:
- Logic có thể sai.
- Thiếu edge case.
- Có secutiry holes.
- Xử lý nghiệp vụ không đầy đủ.
- Hallucinate API hoặc behavior.

Nguy hiểm ở chỗ:
| Code AI-generated thường "có vẻ đúng".
Điều này tạo ra false confidence rất lớn.


2. TDD biến test thành specification cho AI.

Trong TDD, developer viết test trước:

**RED:**
- Định ngĩa behavior.
- Định nghĩa input/output.
- Định nghĩa edge cases.
- Định nghĩa security requirements,

**Ví dụ:**

```Java
    @Test
    void shouldRejectNegativeAmount() {
        assertThrows(
            IllegalArgumentException.class,
            () -> paymentService.transfer(-100)
        );
    }

```

Lúc này:
- AI không còn "đoán requirement".
- AI phải satisfy specificaiton đã được mô tả bằng test.

Tức là:
| Test trở thành contract giữa con người và AI.


3. TDD giúp chống hallucination của AI

AI có thể:
- Gọi sai method.
- Dùng sai comparsion (!= thay vì .equals())
- Validate thiếu.
- Xử lý null sai.
- Tạo logic security không an toàn.

Kho có TDD:
```
    AI generate code
            ↓
    Run tests
            ↓
    Fail immediately

```
Developer phát hiện lỗi sớm trước khi lên production.

4. TDD tạo "checks and balances" cho workflow AI

AI mạnh nhưng không đáng tin cậy tuyệt đối.
Vì vậy workflow hiệu quả nhât là:
```
    Human defines behavior
            ↓
    AI generates implementation
            ↓
    Tests verify output
            ↓
    Human reviews/refactors

```
Đây chính là:
- Human-in-the-loop.
- Kiểm soát AI bằng verification.
- Thay vì trust mù quáng.

Kent Beck gọi đây là:
| checks and balances to avoid hallucinations.

5. TDD giúp developer giữ quyền kiểm soát thiết kế hệ thống

Nếu chỉ prompt AI:
- Architecture dễ lộn xộn.
- Couping cao.
- Duplicate logic.
- Code smell nhiều.

Khi dùng TDD:
- Developer phải nghĩ về API trước.
- Nghĩ về behaivor trước.
- Nghĩ về business rules trước.

AI chỉ implement theo spec.

Điều này giữ cho:
- Design clean hơn.
- Maintainable hơn.
- Dễ refactor hơn.


6. Refactor AI-generated code an toàn hơn.

AI thường generate:
- Verbose code.
- Naming chưa tốt.
- Duplicated logic.
- Implementation "works but ugly".

Kho có test converage mạnh:
```
    Refactor
        ↓
    Run tests
        ↓
    Still green = safe

```

Developer có thể:
- Tối ưu code.
- Clean architecture.
- Tách service.
- Đổi naming.
- Improve readability.
mà không sợ phá behavior.


7. CI/CD + TDD = lớp bảo vệ cuối cùng

Một vấn đề nguy hiểm khi dùng AI là:
| Automation bias.

Con người dễ:
- Tin AI quá mức.
- Coppy paste nhanh.
- Bỏ qua verification vì deadline.

TDD kết hợp với CI/CD tạo "người gác đền" tự động:
```
    Developer → AI → Commit → CI Pipeline
                                    ↓
                                Tests fail → Block PR

```
Pipeline không quan tâm:
- Code viết tay hay AI viết.
- Deadline gấp hay không.

Nó chỉ quan tâm:
| Test có pass không?


8. TDD có đặc biệt quan trọng trong hệ thống rủi ro cao

**Ví dụ:**

```
- Banking.
- Fintech.
- Healthcare.
- Trading system.
- Payment gateway.

```

Một bug logic AI-generated có thể gây:
- Mất tiền.
- Sai dữ liệu.
- Lỗi pháp lý.
- Downtime production.

Chi phí sửa lỗi production thường rất lớn hơn rất nhiều thời gian tiết kiệm được khi generate code nhah.


**Kết luận**
TDD quan trọng với AI-generated code vì nó:
- Biến test thành specification rõ ràng.
- Kiểm soát hallucation của AI.
- verify behavior tự động.
- Giảm automation bias.
- Giúp refactor an toàn.
- Giữ chất luọng hệ thống ổn đinh hơn.
- Tạo "safety net" trước khi deploy.

AI giúp viết code nhanh hơn.

TDD giúp đảm bảo code có thể đáng tin hơn.

Hai thứ này không đối lập - mà bổ trợ cho nhau rất mạnh trong Software Engineering hiện đại.


---
