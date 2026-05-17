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

## 2. Testing Levels Comparison

### 2.1 Unit Tests

**Định nghĩa:**
Unit Testing là level đầu tiên của quá trình testing. Cái mình cần test ở đây là những thành phần nhỏ nhất của ứng dụng - tưởng tượng như test một hàm riêng lẻ, một method đơn lẻ. Mục đích chính là đảm bảo mỗi "mảnh" code hoạt động đúng trước khi ghép chúng lại với nhau.

Điểm hay của unit test là nó chạy rất nhanh, thường chỉ vài miliseconds thôi. Nhờ vậy mà trong quá trình code, mình có thể chạy test liên tục để biết ngay nếu có gì đó sai.

**Khi nào nên dùng:**
- Khi muốn test một function cụ thể, không muốn phụ thuộc vào các phần khác.
- Khi cần feedback nhanh trong quá trình phát triển.
- Khi muốn xác minh logic core của ứng dụng hoạt động đúng.
- Khi cần debug dễ dàng, biết chính xác chỗ nào fail.

**Ví dụ code:**
```Java với JUnit
    @Test
    public void testAddNumbers() {
        Calculator calc = new Calculator();
        int result = calc.add(2, 3);
        assertEquals(5, result);
    }

```

### 2.2 Integration Tests

**Định nghĩa:**
Sau khi đã test từng phần riêng lẻ xong rồi, bước tiếp theo là Integration Testing. Cái mình test ở đây là xem các modules có "nói chuyện" được với nhau không. Ví dụ module A gọi module B, truyền data qua lại - thì nó có hoạt động trơn tru không?

Thực ra thì nhiều khi các phần riêng lẻ đều chạy đúng, nhưng khi ghép lại thì lại có vấn đề. Có thể là data format không match, có thể là timing issue, có thể là interface không tương thích, Integration test giúp mình phát hiện những thứ đó.

**Khi nào nên dùng:**
- Khi đã test xong unit tests và muốn xác nhận modules giao tiếp đúng.
- Khi cần test API calls, database operations, file I/O.
- Khi muốn verify data flow giữa các services.
- Khi cần test những thứ mà unit test không thể mock được.

**Ví dụ code:**

```javascript
    // Test database integration
    describe('UserRepository Integration', () => {
    it('tạo user mới thì có thể query lại được', async () => {
        const repo = new UserRepository();
        const newUser = { name: 'Minh', email: 'minh@test.com' };
        
        const created = await repo.create(newUser);
        const found = await repo.findById(created.id);
        
        expect(found).not.toBeNull();
        expect(found?.name).toBe('Minh');
        expect(found?.email).toBe('minh@test.com');
    });
    it('user có tickets thì query user thì thấy tickets', async () => {
        const userRepo = new UserRepository();
        const ticketRepo = new TicketRepository();
        
        const user = await userRepo.create({ name: 'Lan', email: 'lan@test.com' });
        await ticketRepo.create({ userId: user.id, title: 'Bug #1' });
        await ticketRepo.create({ userId: user.id, title: 'Bug #2' });
        
        const userWithTickets = await userRepo.findWithTickets(user.id);
        
        expect(userWithTickets?.tickets).toHaveLength(2);
    });
    });
    // Test API integration
    describe('AuthService Integration', () => {
    it('đăng nhập thành công thì trả về token', async () => {
        const authService = new AuthService();
        
        const result = await authService.login('minh@test.com', 'password123');
        
        expect(result.token).toBeDefined();
        expect(result.user.email).toBe('minh@test.com');
    });
    });
```

### 2.3 End-to-End (E2E) Tests

**Định nghĩa:**
Đây là level cuối cùng, test toàn bộ hệ thống như người dùng thật sự sử dụng. Mình không test riêng từng module nữa, mà mô phỏng toàn bộ user flow từ đầu đến cuối. Ví dụ: user đăng nhập -> tạo ticket -> gửi phản hồi -> đóng ticket. Toàn bộ flow đó phải hoạt động trơn tru.

E2E test chạy chậm nhất và tốn resource nhất, nhưng nó cho mình confidence cao nhất là ứng dụng hoạt động đúng trong thực tế.

**Khi nào nên dùng:**
- Khi cần xác định toàn bộ user flow hoạt động.
- Khi cần test những scenarios quan trọng (login, checkout, payment).
- khi muốn đảm bảo khong có regression ở high-level.
- Trước khi release, staging verification.

**Ví dụ code:**

```typescript
    // E2E với Playwright
    import { test, expect } from '@playwright/test';
    test('user có thể tạo và đóng ticket', async ({ page }) => {
    // 1. Đăng nhập
    await page.goto('/login');
    await page.fill('[name="email"]', 'minh@test.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // 2. Đợi redirect về dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // 3. Tạo ticket mới
    await page.click('text=Tạo Ticket');
    await page.fill('[name="title"]', 'Bug không load được trang');
    await page.fill('[name="description"]', 'Chi tiết lỗi...');
    await page.click('button:has-text("Gửi")');
    
    // 4. Verify ticket được tạo
    await expect(page.locator('.ticket-item')).toHaveCount(1);
    
    // 5. Đóng ticket
    await page.click('.ticket-item >> text=Đóng');
    await expect(page.locator('.ticket-item >> text=Closed')).toBeVisible();
    });
```

### 2.4 Comparison Table

| Aspect             | Unit Tests                    | Integration Tests           | E2E Tests               |
| ------------------ | ----------------------------- | --------------------------- | ----------------------- |
| **Scope**          | Một Function/method đơn lẻ    | Nhiều modules tương tác     | Toàn bộ hệ thống        |
| **Speed**          | Rất nhanh (ms)                | Trung bình (vài giây)       | Chậm (phút)             |
| **Reliability**    | Cao, stable                   | Trung bình, có thể flaky    | Thấp, dễ flaky          |
| **Debugging**      | Dễ, biết chính xác chỗ fail   | Khó hơn, cần trace nhiều    | Khó nhất                |
| **Use for AI?**    | Rất cần, verify từng hàm      | Cần, verify interactions    | Cần cho critical flows  |
| **Suggested Ratio**| 70%                           | 20%                         | 10%                     |

### 2.5 Tỷ lệ đề xuất và giải thích

**Đề xuất:**
Đề xuất tỷ lệ 70/20/10 - tức 70% unit test, 20% integration tests, và 10% E2E tests.

**Lý do:**
- Unit tests chiếm 70%: Vì chúng chạy nhanh, dễ viết, dễ debug. Đây là "hàng não đầu tiên" để bắt bugs. Với AI-generated code, mình cần nhiều unit tests nhất đề veriry từng hàm nhỏ.
- Integration tests chiếm 20%: Đủ đề xác nhận các modules giao tiếp đúng nhau, nhưng không quá nhiều dến nỗi chạy chậm.
- E2E tests chiếm 10%: Chỉ tập trung vào những critical flows thực sự quan trọng. Nếu có giá nhiều E2E test thì CI/CD sẽ rất lâu và dễ fail không đáng có.

---
