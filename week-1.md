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
describe("UserRepository Integration", () => {
  it("tạo user mới thì có thể query lại được", async () => {
    const repo = new UserRepository();
    const newUser = { name: "Minh", email: "minh@test.com" };

    const created = await repo.create(newUser);
    const found = await repo.findById(created.id);

    expect(found).not.toBeNull();
    expect(found?.name).toBe("Minh");
    expect(found?.email).toBe("minh@test.com");
  });
  it("user có tickets thì query user thì thấy tickets", async () => {
    const userRepo = new UserRepository();
    const ticketRepo = new TicketRepository();

    const user = await userRepo.create({ name: "Lan", email: "lan@test.com" });
    await ticketRepo.create({ userId: user.id, title: "Bug #1" });
    await ticketRepo.create({ userId: user.id, title: "Bug #2" });

    const userWithTickets = await userRepo.findWithTickets(user.id);

    expect(userWithTickets?.tickets).toHaveLength(2);
  });
});
// Test API integration
describe("AuthService Integration", () => {
  it("đăng nhập thành công thì trả về token", async () => {
    const authService = new AuthService();

    const result = await authService.login("minh@test.com", "password123");

    expect(result.token).toBeDefined();
    expect(result.user.email).toBe("minh@test.com");
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
import { test, expect } from "@playwright/test";
test("user có thể tạo và đóng ticket", async ({ page }) => {
  // 1. Đăng nhập
  await page.goto("/login");
  await page.fill('[name="email"]', "minh@test.com");
  await page.fill('[name="password"]', "password123");
  await page.click('button[type="submit"]');

  // 2. Đợi redirect về dashboard
  await expect(page).toHaveURL("/dashboard");
  await expect(page.locator("h1")).toContainText("Dashboard");

  // 3. Tạo ticket mới
  await page.click("text=Tạo Ticket");
  await page.fill('[name="title"]', "Bug không load được trang");
  await page.fill('[name="description"]', "Chi tiết lỗi...");
  await page.click('button:has-text("Gửi")');

  // 4. Verify ticket được tạo
  await expect(page.locator(".ticket-item")).toHaveCount(1);

  // 5. Đóng ticket
  await page.click(".ticket-item >> text=Đóng");
  await expect(page.locator(".ticket-item >> text=Closed")).toBeVisible();
});
```

### 2.4 Comparison Table

| Aspect              | Unit Tests                  | Integration Tests        | E2E Tests              |
| ------------------- | --------------------------- | ------------------------ | ---------------------- |
| **Scope**           | Một Function/method đơn lẻ  | Nhiều modules tương tác  | Toàn bộ hệ thống       |
| **Speed**           | Rất nhanh (ms)              | Trung bình (vài giây)    | Chậm (phút)            |
| **Reliability**     | Cao, stable                 | Trung bình, có thể flaky | Thấp, dễ flaky         |
| **Debugging**       | Dễ, biết chính xác chỗ fail | Khó hơn, cần trace nhiều | Khó nhất               |
| **Use for AI?**     | Rất cần, verify từng hàm    | Cần, verify interactions | Cần cho critical flows |
| **Suggested Ratio** | 70%                         | 20%                      | 10%                    |

### 2.5 Tỷ lệ đề xuất và giải thích

**Đề xuất:**
Đề xuất tỷ lệ 70/20/10 - tức 70% unit test, 20% integration tests, và 10% E2E tests.

**Lý do:**

- Unit tests chiếm 70%: Vì chúng chạy nhanh, dễ viết, dễ debug. Đây là "hàng não đầu tiên" để bắt bugs. Với AI-generated code, mình cần nhiều unit tests nhất đề veriry từng hàm nhỏ.
- Integration tests chiếm 20%: Đủ đề xác nhận các modules giao tiếp đúng nhau, nhưng không quá nhiều dến nỗi chạy chậm.
- E2E tests chiếm 10%: Chỉ tập trung vào những critical flows thực sự quan trọng. Nếu có giá nhiều E2E test thì CI/CD sẽ rất lâu và dễ fail không đáng có.

---

## 3. CLI Testing Examples

### 3.1 Commands Testing

CLI(Command Line Interface) là cách người dùng tương tác với các ứng dụng qua terminal. Test CLI commands là đảm bảo rằng khi gõ lệnh, chương trình hiểu đúng và trả về két quả như mong đợi.

Điểm khác với unit test thông thường là CLI test thường cầ simulate việc truyền argumants, parge flags, và capture output từ stdout/stderr.

Khi nào cần test CLI:

- Khi ứng dụng có nhiều commands như app create, app list, app delete.
- Khi cần xử lý arguments và options khác nhau.
- Khi muốn verify help messages, erroe messages được in ra đúng.
- Khi cần test exit codes (0 = thành công, khác 0 = lỗi).

**Ví dụ code:**

```java
    import org.junit.jupiter.api.Test;
    import org.junit.jupiter.api.io.TempDir;
    import java.io.ByteArrayOutputStream;
    import java.io.PrintStream;
    import java.nio.file.Path;
    import static org.junit.jupiter.api.Assertions.*;
    class CLICommandsTest {
        @Test
        void testCreateTicketCommand_success(@TempDir Path tempDir) {
            // Setup: capture stdout
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            System.setOut(new PrintStream(output));
            // Execute: chạy command tạo ticket
            String[] args = {"create", "--title", "Bug login", "--description", "Cannot login"};
            int exitCode = CLI.main(args);
            // Verify: exit code phải là 0 (thành công)
            assertEquals(0, exitCode);
            // Verify: output phải chứa thông báo tạo thành công
            assertTrue(output.toString().contains("Ticket created successfully"));
            assertTrue(output.toString().contains("ID:"));
        }
        @Test
        void testListCommand_withNoTickets() {
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            System.setOut(new PrintStream(output));
            String[] args = {"list"};
            int exitCode = CLI.main(args);
            assertEquals(0, exitCode);
            assertTrue(output.toString().contains("No tickets found"));
        }
        @Test
        void testHelpCommand_showsUsage() {
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            System.setErr(new PrintStream(output));
            String[] args = {"--help"};
            int exitCode = CLI.main(args);
            assertEquals(0, exitCode);
            assertTrue(output.toString().contains("Usage:"));
            assertTrue(output.toString().contains("create"));
            assertTrue(output.toString().contains("list"));
            assertTrue(output.toString().contains("delete"));
        }
        @Test
        void testUnknownCommand_returnsError() {
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            System.setErr(new PrintStream(output));
            String[] args = {"invalid-command"};
            int exitCode = CLI.main(args);
            // Exit code khác 0 = lỗi
            assertNotEquals(0, exitCode);
            assertTrue(output.toString().contains("Unknown command"));
            assertTrue(output.toString().contains("Try --help"));
        }
        @Test
        void testDeleteCommand_withConfirmation() {
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            System.setOut(new PrintStream(output));
            // Tạo ticket trước
            CLI.main(new String[]{"create", "--title", "Temp ticket"});

            // Clear output
            output.reset();
            // Delete với force flag
            String[] args = {"delete", "--id", "1", "--force"};
            int exitCode = CLI.main(args);
            assertEquals(0, exitCode);
            assertTrue(output.toString().contains("Ticket deleted"));
        }
    }
```

### 3.2 Validation Testing

Validation là kiểm tra dữ liệu đầu vào có hợp lệ hay không. Ví dụ:email có đúng fomat không, số điện thoại có đủ chữ số khôngh, required fields có được điền không.

Validation testing là test cái logic kiểm tra này. Nó thường nằm ở boundary cases - những trường hợp edge như input rỗng, input quá dài, input có ký tự đặc biệt.

Những thứ cần validate thường gặp:

- Emai format.
- Required fields không được trống.
- String length limits.
- Number ranges ( Ví dụ tuổi phải > 0).
- Date formats.
- Special characters, SQL injection attempts.

**Ví dụ code:**

```java
    class ValidationTest {

        @Test
        void testEmailValidation_validEmails() {
            Validator validator = new EmailValidator();

            assertTrue(validator.isValid("minh@example.com"));
            assertTrue(validator.isValid("user.name@company.co.uk"));
            assertTrue(validator.isValid("test+filter@gmail.com"));
        }

        @Test
        void testEmailValidation_invalidEmails() {
            Validator validator = new EmailValidator();

            assertFalse(validator.isValid("")); // empty
            assertFalse(validator.isValid("notanemail")); // không có @
            assertFalse(validator.isValid("@example.com")); // không có prefix
            assertFalse(validator.isValid("user@")); // không có domain
            assertFalse(validator.isValid("user@.com")); // domain bắt đầu bằng dấu chấm
            assertFalse(validator.isValid("user name@example.com")); // có space
        }

        @Test
        void testTitleValidation_length() {
            TicketValidator validator = new TicketValidator();

            // Title không được rỗng
            ValidationResult result1 = validator.validateTitle("");
            assertFalse(result1.isValid());
            assertTrue(result1.getError().contains("Title is required"));

            // Title quá ngắn (< 3 ký tự)
            ValidationResult result2 = validator.validateTitle("AB");
            assertFalse(result2.isValid());

            // Title quá dài (> 200 ký tự)
            String longTitle = "A".repeat(201);
            ValidationResult result3 = validator.validateTitle(longTitle);
            assertFalse(result3.isValid());
            assertTrue(result3.getError().contains("maximum 200 characters"));

            // Title hợp lệ
            ValidationResult result4 = validator.validateTitle("Bug in login page");
            assertTrue(result4.isValid());
        }

        @Test
        void testTitleValidation_specialCharacters() {
            TicketValidator validator = new TicketValidator();

            // Title với special characters nên được accept (thường thì nên)
            ValidationResult result = validator.validateTitle("Bug: <script>alert('xss')</script>");
            // Tùy requirement, có thể allow hoặc reject
            assertNotNull(result);
        }

        @Test
        void testTicketCreation_allFieldsValid() {
            TicketValidator validator = new TicketValidator();

            TicketInput input = new TicketInput();
            input.setTitle("Lỗi đăng nhập");
            input.setDescription("Không thể login vào hệ thống");
            input.setPriority("high");

            ValidationResult result = validator.validate(input);

            assertTrue(result.isValid());
            assertTrue(result.getErrors().isEmpty());
        }

        @Test
        void testTicketCreation_multipleErrors() {
            TicketValidator validator = new TicketValidator();

            TicketInput input = new TicketInput();
            // Set invalid data
            input.setTitle(""); // rỗng
            input.setPriority("invalid-priority"); // không hợp lệ

            ValidationResult result = validator.validate(input);

            assertFalse(result.isValid());
            assertTrue(result.getErrors().size() >= 2);
            // Kiểm tra error messages
            assertTrue(result.getErrorMessages().stream()
                .anyMatch(e -> e.contains("Title")));
            assertTrue(result.getErrorMessages().stream()
                .anyMatch(e -> e.contains("Priority")));
        }

        @Test
        void testPriorityValidation_enumValues() {
            TicketValidator validator = new TicketValidator();

            // Valid priorities
            assertTrue(validator.validatePriority("low").isValid());
            assertTrue(validator.validatePriority("medium").isValid());
            assertTrue(validator.validatePriority("high").isValid());

            // Invalid priorities
            assertFalse(validator.validatePriority("critical").isValid());
            assertFalse(validator.validatePriority("urgent").isValid());
            assertFalse(validator.validatePriority("").isValid());
            assertFalse(validator.validatePriority("HIGH").isValid()); // case sensitive
        }

        @Test
        void testSQLInjectionPrevention() {
            TicketValidator validator = new TicketValidator();

            // Test các input có thể là SQL injection
            String maliciousInput = "'; DROP TABLE tickets; --";
            ValidationResult result = validator.validateTitle(maliciousInput);

            // Validator nên accept input nhưng hệ thống phải sanitize khi query
            assertTrue(result.isValid()); // title được accept
            // Tuy nhiên khi lưu vào DB phải dùng parameterized queries
        }
    }
```

### 3.3 File Storage Testing

File storage là phần xử lý đọc/ghi dữ liệu vào file. Test phần này cần đảm bảo:

- File được tạo đúng vị trí.
- Data được lưu đúng format.
- File có thể đọkc lại chính xác.
- Xử lý đúng khi gặp lỗi (File không tồn tại, không có quyền truy cập, disk full, ...).

Điểm quan trọng là dùng @TempDir của JUnit để tạo temporary diretory cho mỗi test, không ảnh hưởng đến production data.

Những Scenario cần test:

- Lưu file thành công.
- Đọc file tồn tại.
- Đọc file không tồn tại (Phải xử lý lỗi).
- Overwrite file đã có.
- Tên file với special characters.
- Path traversal prevention (bảo mật).

**Ví dụ code:**

```java
    import org.junit.jupiter.api.Test;
    import org.junit.jupiter.api.io.TempDir;
    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.util.List;
    import com.fasterxml.jackson.databind.ObjectMapper;
    import static org.junit.jupiter.api.Assertions.*;

    class FileStorageTest {

        @TempDir
        Path tempDir;

        private ObjectMapper mapper = new ObjectMapper();

        @Test
        void testSaveTicket_toFile() throws IOException {
            // Setup
            FileStorage storage = new FileStorage(tempDir);
            Ticket ticket = new Ticket("1", "Bug login", "Cannot login", "open");

            // Execute
            Path savedPath = storage.saveTicket(ticket);

            // Verify
            assertTrue(Files.exists(savedPath));
            assertTrue(savedPath.getFileName().toString().startsWith("ticket_"));
            assertTrue(savedPath.getFileName().toString().endsWith(".json"));
        }

        @Test
        void testReadTicket_fromFile() throws IOException {
            // Setup: tạo file trước
            Ticket ticket = new Ticket("1", "Bug login", "Cannot login", "open");
            Path filePath = tempDir.resolve("ticket_1.json");
            mapper.writeValue(filePath.toFile(), ticket);

            FileStorage storage = new FileStorage(tempDir);

            // Execute
            Ticket readTicket = storage.readTicket("1");

            // Verify
            assertEquals("Bug login", readTicket.getTitle());
            assertEquals("Cannot login", readTicket.getDescription());
            assertEquals("open", readTicket.getStatus());
        }

        @Test
        void testReadTicket_notFound() {
            FileStorage storage = new FileStorage(tempDir);

            // Execute & Verify
            assertThrows(FileNotFoundException.class, () -> {
                storage.readTicket("nonexistent");
            });
        }

        @Test
        void testDeleteTicket() throws IOException {
            // Setup: tạo file trước
            Ticket ticket = new Ticket("1", "Temp ticket", "Will be deleted", "open");
            Path filePath = tempDir.resolve("ticket_1.json");
            mapper.writeValue(filePath.toFile(), ticket);

            FileStorage storage = new FileStorage(tempDir);

            // Execute
            storage.deleteTicket("1");

            // Verify
            assertFalse(Files.exists(filePath));
        }

        @Test
        void testListAllTickets() throws IOException {
            // Setup: tạo nhiều tickets
            FileStorage storage = new FileStorage(tempDir);

            storage.saveTicket(new Ticket("1", "Bug 1", "Desc 1", "open"));
            storage.saveTicket(new Ticket("2", "Bug 2", "Desc 2", "closed"));
            storage.saveTicket(new Ticket("3", "Bug 3", "Desc 3", "open"));

            // Execute
            List<Ticket> tickets = storage.listAllTickets();

            // Verify
            assertEquals(3, tickets.size());
        }

        @Test
        void testSaveTicket_withSpecialCharactersInTitle() throws IOException {
            FileStorage storage = new FileStorage(tempDir);

            // Title với emoji, tiếng Việt, special chars
            Ticket ticket = new Ticket("1", "Bug 🚀 Tiếng Việt:café", "Desc <script>", "open");

            Path savedPath = storage.saveTicket(ticket);
            Ticket readTicket = storage.readTicket("1");

            assertEquals("Bug 🚀 Tiếng Việt:café", readTicket.getTitle());
        }

        @Test
        void testSaveTicket_pathTraversalPrevention() {
            FileStorage storage = new FileStorage(tempDir);

            // Attempt path traversal attack
            Ticket maliciousTicket = new Ticket();
            maliciousTicket.setId("../../../etc/passwd");
            maliciousTicket.setTitle("Hacked!");

            // Nên throw exception hoặc sanitize
            assertThrows(InvalidFileNameException.class, () -> {
                storage.saveTicket(maliciousTicket);
            });
        }

        @Test
        void testBackupAndRestore() throws IOException {
            FileStorage storage = new FileStorage(tempDir);

            // Create original ticket
            Ticket ticket = new Ticket("1", "Original", "Desc", "open");
            storage.saveTicket(ticket);

            // Backup
            Path backupPath = storage.backup("1");
            assertTrue(Files.exists(backupPath));

            // Modify original
            Ticket modified = new Ticket("1", "Modified", "New desc", "closed");
            storage.saveTicket(modified);

            // Restore from backup
            storage.restoreFromBackup("1", backupPath);
            Ticket restored = storage.readTicket("1");

            assertEquals("Original", restored.getTitle());
        }
    }
```

### 3.4 Error Handling Testing

Erroe handling là phần quan trọng nhưng hay bị bỏ qua nhất. Test error handling đảm bảo ứng dụng không crash khi gặp lỗi, mà thay vào đó là thông báo rõ ràng cho người dùng.

Một số nguyên tắc test error handling:

1. Test happy path trước - đảm bảo case hoạt động bình thường.
2. Test edge cases - input rỗng, null, giá trị max/min.
3. Test exception cases - network failure, disk full, timeout.
4. Verify error messages - phải hữu ích, không lộ thông tin nhạy cảm.
5. Verify graceful degradation - ứng dụng không crash.

Những erro cases phổ biến cần test:

- Input null hoặc underfined.
- Network timout/disconnect.
- Database connection failure.
- File permission denied.
- Disk full.
- Invalid JSON format.
- Concurrent access conflicts.
- Memory exhaustion.

**Ví dụ code:**

```java
    class ErrorHandlingTest {

        @Test
        void testNetworkFailure_gracefulDegradation() {
            NetworkClient client = new NetworkClient();

            // Mock network failure
            when(httpClient.execute(any())).thenThrow(new ConnectException("Connection refused"));

            // Execute
            Result result = client.fetchData("https://api.example.com/data");

            // Verify: không throw exception, trả về error result
            assertFalse(result.isSuccess());
            assertEquals("NETWORK_ERROR", result.getErrorCode());
            assertTrue(result.getMessage().contains("Unable to connect"));

            // Verify: không lộ sensitive info
            assertFalse(result.getMessage().contains("Connection refused"));
        }

        @Test
        void testDatabaseFailure_doesNotCrash() {
            DatabaseService db = new DatabaseService();

            // Setup: mock DB connection failure
            when(connection.connect()).thenThrow(new SQLException("Connection refused"));

            // Execute & Verify
            assertDoesNotThrow(() -> {
                Result result = db.query("SELECT * FROM users");
                assertFalse(result.isSuccess());
                assertEquals("DB_CONNECTION_FAILED", result.getErrorCode());
            });
        }

        @Test
        void testNullPointerException_prevention() {
            TicketService service = new TicketService();

            // Test với null input
            Result result = service.createTicket(null);

            assertFalse(result.isSuccess());
            assertEquals("INVALID_INPUT", result.getErrorCode());
            assertTrue(result.getMessage().contains("Ticket data is required"));
        }

        @Test
        void testFileNotFound_returnsUserFriendlyMessage() {
            FileStorage storage = new FileStorage(Paths.get("/tmp"));

            Result result = storage.loadTicket("nonexistent-id");

            assertFalse(result.isSuccess());
            assertEquals("FILE_NOT_FOUND", result.getErrorCode());
            // Message phải hữu ích cho user
            assertTrue(result.getMessage().contains("Ticket not found"));
            assertTrue(result.getMessage().contains("nonexistent-id"));
        }

        @Test
        void testDiskFull_errorHandling() {
            FileStorage storage = new FileStorage(Paths.get("/full-disk"));

            // Mock disk full
            when(fileWriter.write(any())).thenThrow(new IOException("No space left on device"));

            Ticket ticket = new Ticket("1", "Test", "Desc", "open");
            Result result = storage.saveTicket(ticket);

            assertFalse(result.isSuccess());
            assertEquals("STORAGE_FULL", result.getErrorCode());
            // Message phải gợi ý giải pháp
            assertTrue(result.getMessage().toLowerCase().contains("disk") ||
                    result.getMessage().toLowerCase().contains("space"));
        }

        @Test
        void testInvalidJSON_returnsParseError() {
            String invalidJson = "{ invalid json content }";

            Result result = JSONParser.parse(invalidJson);

            assertFalse(result.isSuccess());
            assertEquals("PARSE_ERROR", result.getErrorCode());
            // Nên include line/column number nếu có thể
            assertTrue(result.getMessage().contains("JSON"));
        }

        @Test
        void testConcurrentModification_handled() {
            TicketService service = new TicketService();
            Ticket ticket = service.createTicket("Test", "Desc");

            // Giả lập concurrent modification
            // Thread 1 đọc ticket
            Ticket t1 = service.getTicket(ticket.getId());
            // Thread 2 sửa ticket
            service.updateTicket(ticket.getId(), "Updated by T2");
            // Thread 1 cố ghi lại
            Result result = service.updateTicket(ticket.getId(), "Updated by T1", t1.getVersion());

            // Nên detect conflict
            assertFalse(result.isSuccess());
            assertEquals("CONFLICT_DETECTED", result.getErrorCode());
            assertTrue(result.getMessage().contains("conflict") ||
                    result.getMessage().contains("modified"));
        }

        @Test
        void testTimeout_returnsTimeoutError() {
            NetworkClient client = new NetworkClient();
            client.setTimeout(100); // 100ms

            // Mock slow response
            when(httpClient.execute(any())).thenAnswer(invocation -> {
                Thread.sleep(200);
                return new Response("data");
            });

            Result result = client.fetchData("https://slow-api.example.com");

            assertFalse(result.isSuccess());
            assertEquals("TIMEOUT", result.getErrorCode());
            assertTrue(result.getMessage().toLowerCase().contains("timeout"));
        }

        @Test
        void testValidationError_aggregatesAllErrors() {
            TicketValidator validator = new TicketValidator();

            TicketInput input = new TicketInput();
            input.setTitle(""); // rỗng
            input.setPriority("invalid");
            input.setAssigneeEmail("not-an-email");

            ValidationResult result = validator.validate(input);

            assertFalse(result.isValid());
            // Nên collect tất cả errors, không chỉ error đầu tiên
            assertTrue(result.getErrorMessages().size() >= 3);
        }

        @Test
        void testStackTrace_notExposedToUser() {
            try {
                service.processData("trigger error");
            } catch (Exception e) {
                Result result = ErrorHandler.handle(e);

                // Verify: user-facing message không chứa stack trace
                assertFalse(result.getMessage().contains("at com.company"));
                assertFalse(result.getMessage().contains("java.lang.NullPointerException"));
                assertFalse(result.getMessage().contains("at line"));

                // Stack trace chỉ nên log ở phía server
                verify(logger).error(eq("Processing failed"), eq(e));
            }
        }

        @Test
        void testRecovery_mechanism() {
            NetworkClient client = new NetworkClient();
            client.setMaxRetries(3);

            // Mock: fail 2 lần, success lần 3
            when(httpClient.execute(any()))
                .thenThrow(new ConnectException("Fail 1"))
                .thenThrow(new ConnectException("Fail 2"))
                .thenReturn(new Response("Success"));

            Result result = client.fetchWithRetry("https://unstable-api.com");

            assertTrue(result.isSuccess());
            assertEquals("Success", result.getData());
            verify(httpClient, times(3)).execute(any());
        }
    }
```

---

## 4. AI Validation Strategy

### 4.1 How Tests Help Verify AI Code

Khi dùng AI viết code, có một điều mình cần nhớ : AI code thường có nhiều vấn đề hơn code người viết thường xuyên. Cụ thể là theon ghiên cứu, AI code chứa trung bình 10.83 issues per PR, so với 6.45 của code người viết. Và quan trọng hơn, AI code có tới 75% nhiều logic errors hơn.

Tests giúp mình xá minh AI code theo mất cách:

1. Phát hiện lõi logic sai AI có thể hiểu sai requirements và viết code sai logic. Tests là cách để mình verify xem code có làm đúng thứ mình muốn không. Nếu test pass mà mình nghi ngờ, có thể test chưa đủ cover hết cases.
2. Tìm edge cases bị bỏ sót Ai thường code cho happy path - tức là chạy đúng khi mọi thứ ideal. Nhưng thực tế thì input có thể là null, empty, giá trị max, giá trị âm... Tests giúp mình cover những trường hợp này.
3. Verify security AI đôi khi viết code có lỗ hổng bảo mật mà người viết có kinh nghiệm sẽ tránh. Ví dụ như SQL Injection, XSS, Security tests giúp phát hiện những thứ này.
4. Đảm bảo regression khi mình yêu cầu AI sửa một bug, tests cũ giữ vai trò regression suite - đảm bảo AI không làm hỏng thứ gì khác trong quá trình sửa.
5. Giúp hiểu code hơn khi viết tests, mình buộc phải đọc kỹ code AI viết. Nhiều khi nhờ vậy mà phát hiện code không hợp lý hoặc không match với requirement.

### 4.2 Guardrails for AI-Generated Code

| #   | Guardrail                                        | Implementation                                                                                                                                                                                                            |
| --- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Static Analysis trên mọi commit                  | Chạy Eslint, SonarQube, hoặc Semgrep tự động. AI code thường có style issues và potential bugs mà tools này bắt được. Mình nên setup pre-commit hook để không commit code chưa qua scan.                                  |
| 2   | Unit tests viết trước khi AI viết implementation | Áp dụng TDD approach - viết test trước, rồi mới nhờ AI generate code để pass test đó. Cách này đảm bảo AI hiểu đúng requirements thay vì tự động nghĩ ra specification riêng.                                             |
| 3   | Code review bắt buộc cho business logic          | AI có thể viết code chạy đúng nhưng không đúng với business rules. Cần người có domain knowledge review phần này trước khi merge. Đặc biệt là các validation rules, calculation logic.                                    |
| 4   | Security scanning chuyên sâu                     | Dùng SAST tools như Snyk, Checkmarx để scan AI code. AI thường có tỷ lệ security issues cao hơn, đặc biệt là insecure deserialization (2.74x more common), XSS vulnerabilities.                                           |
| 5   | Mutation Testing                                 | Không chỉ đo coverage, mà dùng mutation testing để verify tests thực sự catch được bugs. Line coverage 85-90% cho AI code (so với 70-80% cho human code). Teams dùng mutation testing thấy scores improve từ 70% lên 78%. |
| 6   | Architectural Drift Detection                    | Verify AI code không vi phạm architecture decisions hiện tại. AI đôi khi suggest cách giải quyết không align với hệ thống. Dùng tools hoặc code review để check.                                                          |
| 7   | Dependency Risk Assessment                       | AI có thể suggest dùng packages không cần thiết hoặc có known vulnerabilities. Scan dependencies trước khi add vào project.                                                                                               |
| 8   | "Comprehension Debt" Awareness                   | Code có thể pass all tests nhưng không ai trong team thực sự hiểu nó làm gì. Đây là production risk nghiêm trọng. Cần đảm bảo có documentation và ít nhất một người trong team hiểu rõ AI-generated code.                 |

### 4.3 AI Validation Checklist

Trước khi merge AI-generated code, mình cần check:

```
- AI code đã được chạy qua static analysis tool (EsLint, SonarQube) chưa?
- Có unit tests cho mọi functions/methods không?
- Tests đã cover happy  path và edge cases chưa?
- Đã verify logic đúng với requirements chưa?
- Business rules được implement đúng chưa?
- Security đẫ scan đã pass chưa? (XSS, SQL Injection, authentication)
- Dependecies mới có known vulnerbilities không?
- Error handling có đầy đủ không? (null checks, exception handling)
- AI code có align với existing architecture không?
- Có documentation cho logic phức tạp không?
- Đã có người hiểu code này trong team chưa?
- Code không có "comprehension debt" - tức ai cũng hiểu được?
- Performance implications đã được xem xét chưa?
- Concurrency issues đã được test chưa?
- Regression tests pass với code mới chưa?
```

---

## 5. Common Mistakes

### 5.1 Over-Testing

**Mô tả:**
Over-testing là tình trạng viết quá nhiều tests mà không mang lại giá trị thực tế. Đây là mistake phổ biến, dặc biệt khi teams bị áp lực khi đạt 100% converage.

Vấn đề là khi mình chỉ tập trung vào con số coverage, mình sẽ viết tests chỉ để "pass converage" thay vì để thực sự bắt bugs. Những tests như vậy thường rất brittle - tức là break khi code được refactor dù behavior vẫn đúng.

Một dấu hiệu của over-testing là: mỗi khi sửa code, phải sửa rất nhiều tests không liên quan.

**Ví dụ sai:**

```typescript
// [ ] Over-testing: test quá chi tiết, không cần thiết
describe("UserService", () => {
  it("should call userRepository.findById once", () => {
    // Sao phải test cái này? Ai quan tâm nó gọi mấy lần?
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
  });
  it("should call userRepository.findById with correct id", () => {
    // Sao phải test internal call?
    expect(userRepository.findById).toHaveBeenCalledWith(1);
  });
  it("should call userRepository.findById before calling mapper.toDTO", () => {
    // Test thứ tự internal calls là quá specification
    const mapCall = jest.spyOn(mapper, "toDTO");
    service.getUser(1);
    expect(mapCall).toHaveBeenCalledAfter(userRepository.findById);
  });
  it("should call logger.info when finding user", () => {
    // Test logging là implementation detail, không phải behavior
    expect(logger.info).toHaveBeenCalled();
  });
});
// [ ] Over-testing: test không cần thiết
it("should return empty string when input is empty string", () => {
  expect(reverseString("")).toBe("");
});
it('should return "a" when input is "a"', () => {
  expect(reverseString("a")).toBe("a");
});
it('should return "ab" when input is "ba"', () => {
  expect(reverseString("ba")).toBe("ab");
});
// Mấy test này test cùng một behavior (reverse string)
// Không cần viết nhiều như vậy
```

**Cách tránh:**

- Viết tests dựa trên requirements, không phải dựa trên coverage target.
- Mỗi test nên test một behavior, không phải một dòng code.
- Coverage là metric, không phải mục tiêu. Mục tiêu là confidence vào code.
- Nếu test break khi refactor mà behavior không đổi = test đang test implementation.

### 5.2 Weak Assertions

**Mô tả:**
Weak assertions là những assertions không đủ mạnh để catch bugs thực sự. Test có thể pass nhưng code có vấn đề.

Vấn đề này hay xảy ra khi mình dùng những assertions quá generic, hoặc dùng loose equality. Test pass nhưng thực ra không verify được gì nhiều.

Một cách để phát hiện weak assertions: thử change giá trị excepted sang giá trị sai, xem test có fail hay không. Nếu test vấn đang pass = weak assertion.

**Ví dụ sai:**

```typescript
// [ ] Weak assertions: dùng toBeTruthy() thay vì verify cụ thể
it("should create user successfully", () => {
  const result = userService.createUser({
    name: "Minh",
    email: "minh@test.com",
  });
  // toBeTruthy() pass với BẤT KỲ giá trị truthy nào
  // Nếu result trả về {} thì test vẫn pass
  expect(result).toBeTruthy();
});

// [ ] Weak: không verify structure của result
it("should return user data", () => {
  const result = userService.getUser(1);
  // Test pass nhưng không verify gì cả
  expect(result).toBeDefined();
  expect(result).not.toBeNull();
});

// [ ] Weak: loose equality
it("should return correct count", () => {
  const result = service.getCount();
  // == thay vì ===, có thể pass nhầm
  // "5" == 5 sẽ pass
  expect(result == 5).toBe(true);
});

// [ ] Weak: assert array length nhưng không check contents
it("should return users", () => {
  const result = service.getUsers();
  // Chỉ check có users, không check user có đúng không
  expect(result.length).toBeGreaterThan(0);
});

// [ ] Weak: substring match thay vì exact match
it("should have error message", () => {
  const error = service.validate(input);
  // 'error' có thể match bất cứ thứ gì chứa 'error'
  expect(error.message).toContain("error");
});
```

**Cách tránh:**

```typescript
// [x] Strong assertions: verify cụ thể những gì cần thiết
it("should create user with correct data", () => {
  const result = userService.createUser({
    name: "Minh",
    email: "minh@test.com",
  });

  // Verify structure đầy đủ
  expect(result).toEqual({
    id: expect.any(String),
    name: "Minh",
    email: "minh@test.com",
    createdAt: expect.any(Date),
  });
});

// [x] Strong: dùng strict equality
it("should return correct count", () => {
  const result = service.getCount();
  expect(result).toBe(5); // === thay vì ==
});

// [x] Strong: verify array contents với matcher cụ thể
it("should return users with correct roles", () => {
  const result = service.getUsers();
  expect(result).toHaveLength(3);
  expect(result[0]).toMatchObject({ name: "Minh", role: "admin" });
  expect(result[1]).toMatchObject({ name: "Lan", role: "user" });
});

// [x] Strong: exact match khi cần
it("should return specific error code", () => {
  const error = service.validate(invalidInput);
  expect(error.code).toBe("VALIDATION_ERROR");
  expect(error.message).toBe("Email is required");
});
```

### 5.3 Testing Implementation Details

**Mô tả:**
Đây là mistake cơ bản và quan trọng nhất. Testing implementation details nghĩa là test cách code implement, thay vì test behavior của code.

Khi mình test implementation details:

- Tests sẽ break khi refactor dù behavior không đổi.
- Tests không thực sự verify code hoạt động đúng.
- Code trở nên khó thay đổi vì sợ break tests.

Điều mình nên test: Observable behavior - tức là những gì user/caller thấy được. Input gì, output gì, side effects gì (Như database được update, email được gửi)

Điều mình không nên test: Internal details - tức là internal fiunction calls, private methods, thứ tự operations, caching...

**Ví dụ sai:**

```typescript
// [ ] Test implementation: kiểm tra internal calls
class OrderService {
  calculateDiscount(order: Order): number {
    const discountRepo = new DiscountRepository();
    const discount = discountRepo.findDiscount(order.customerId);
    return order.amount * discount;
  }
}

// Test này test IMPLEMENTATION, không phải BEHAVIOR
it("should call discountRepository", () => {
  const discountRepo = new DiscountRepository();
  const service = new OrderService(discountRepo);

  service.calculateDiscount(mockOrder);

  // Sao phải quan tâm nó gọi discountRepo?
  // Ai dùng service này quan tâm điều này không?
  expect(discountRepo.findDiscount).toHaveBeenCalled();
});

// [ ] Test implementation: kiểm tra internal caching
it("should cache results", () => {
  const result1 = service.getUser(1);
  const result2 = service.getUser(1);

  // Test cache là test implementation
  // Nếu ta bỏ cache đi, behavior vẫn đúng (cùng kết quả)
  // Nhưng test này sẽ fail
  expect(discountRepo.findDiscount).toHaveBeenCalledTimes(1);
});

// [ ] Test implementation: kiểm tra internal helper method
describe("processPayment", () => {
  it("should call validateCard first", () => {
    // Test thứ tự internal calls - không cần thiết
  });

  it("should call chargeCard after validateCard", () => {
    // Test implementation details
  });
});
```

**Cách tránh:**

```typescript
    // [x] Test BEHAVIOR: chỉ quan tâm input -> output
    describe('OrderService', () => {
    it('should apply discount based on customer tier', () => {
        const order = { amount: 100, customerId: 'customer-123' };

        const result = service.calculateDiscount(order);

        // Chỉ verify kết quả cuối cùng
        // Không quan tâm bên trong gọi gì
        expect(result).toBe(10); // 10% discount cho premium customer
    });

    it('should return full amount when no discount', () => {
        const order = { amount: 100, customerId: 'new-customer' };

        const result = service.calculateDiscount(order);

        expect(result).toBe(0);
    });
    });

    // [x] Test observable side effects
    it('should send email when order is placed', async () => {
    const emailService = { send: jest.fn() };
    const service = new OrderService(emailService);

    await service.placeOrder({ items: [...], customerEmail: 'test@example.com' });

    // Verify side effect mà caller quan tâm
    // "Khi order được tạo, email được gửi"
    expect(emailService.send).toHaveBeenCalledWith(
        expect.objectContaining({
        to: 'test@example.com',
        subject: expect.stringContaining('Order Confirmation')
        })
    );
    });

    // [x] Test public API, không test private methods
    describe('Calculator', () => {
    it('should return correct sum', () => {
        expect(calculator.add(2, 3)).toBe(5);
        expect(calculator.subtract(5, 2)).toBe(3);
    });
    // Không test internal methods như validateInput, formatResult
    });
```

### 5.4 Blindly Trusting AI

**Mô tả:**
Đây là mistake ngày càng phổ biến khi AI coding assistants trở nên phổ biến. Blindly trusting AI nghĩa là copy-paste code từ AI mà không verify, hiểu, hay test kỹ.

Một số vấn đề khi blindly trusting AI:

1. AI hallucinate - AI có thể bịa code mà không có thật.
2. AI không hiểu context - AI không biết business rules, existing architecture, team conventions.
3. AI code đúng synstax nhưng sai logic - Code chạy được nhưng không làm đúng thứ mình muốn.
4. AI suggest outdated practices - AI có thể suggest cách cũ, không theo best practices mới.

Đặc biệt với AI, mình cần nhớ: AI code chứa nhiều issues hơn himan code (10.83 với 6.45 issues per PR), và có tới 70% nhiều logic errors hơn.

**Ví dụ sai:**

```
    [ ] User: "Viết cho tôi function check prime number"
    AI: viết code
    User: copy-paste vào production

    Không test, không verify, không hiểu code làm gì

    [ ] User: "Sửa lỗi này giúp tôi" (copy error message)
    AI: suggest fix
    User: apply fix, thấy tests pass, done

    Không hiểu tại sao lỗi xảy ra, không biết fix có đúng root cause không

    [ ] User: "Implement authentication cho app"
    AI: viết đầy đủ code với JWT, bcrypt, etc
    User: apply toàn bộ code

    Không verify security implications, không check có vulnerabilities không
```

**Cách tránh:**

1. Luôn luôn đọc verify AI code trước khi dùng

- Đọc code, hiểu code làm gì.
- Test kỹ với unit tests.
- Check edge cases.

2. Dùng AI như asistant, không phải replacement

- AI giúp viết code nhanh hơn.
- Người vẫn phải review và approve.
- AI không biết business context của bạn.

3. Static analysic là bắt buộc

- Check ESLint, type checker.
- Security scan cho senstive code.
- AI code cần extra scrutiny.

4. Understand before applying

- Trước khi apply AI suggestions, hỏi AI giải thích.
- Nếu AI không giải thích được = red flag.
- verify login với requirements.

```typescript
// [x] Good practice: verify trước khi dùng
// Khi AI viết code, mình nên:
// 1. Đọc và hiểu code
// 2. Trace through logic bằng tay
// 3. Viết tests để verify
// 4. Check edge cases
// 5. Review với team nếu cần

it("AI viết function này đúng không?", () => {
  // Test với known inputs để verify
  const result = aiSuggestedFunction(5);
  expect(result).toBe(120); // 5! = 120

  // Test edge cases
  expect(aiSuggestedFunction(0)).toBe(1);
  expect(aiSuggestedFunction(1)).toBe(1);

  // Verify với inputs khác
  expect(aiSuggestedFunction(10)).toBe(3628800);
});
```

## 6. Evidence: 3 Workflows Applied

Ghi lại quá trình nghiên cứu testing với sự hỗ trợ của AI theo 3 workflows đã học.

### 6.1 Layered Questioning

Hỏi AI theo từng lớp để hiểu sâu hơn về TDD.

**Research - Tìm hiểu định nghĩa:**

Hỏi AI: "TDD là gì?"
AI trả lời: Test-Driven Development là viết test trước khi viết code. Cycle: RED → GREEN → REFACTOR

Mình thắc mắc: viết test trước thì test cái gì, code chưa có? Đọc kỹ lại hiểu là viết test mô tả behavior mình muốn code có.

**Brief - Hỏi chi tiết hơn:**

Hỏi AI: "Red-Green-Refactor hoạt động như thế nào?"
AI giải thích và cho ví dụ:

```javascript
// RED - viết test trước, test sẽ fail
test("add(1,2) equals 3", () => {
  expect(add(1,2)).toBe(3);
});

// GREEN - viết code nhanh nhất để pass
function add(a,b) { return 3; }

// REFACTOR - cải thiện code mà vẫn pass test
function add(a,b) { return a + b; }
```

Hiểu rồi: RED = test fail, GREEN = test pass, REFACTOR = clean up code.

**Example - Hỏi ví dụ thực tế:**

Hỏi AI: "Viết ví dụ TDD cho function validateEmail"
AI viết:

```javascript
test("valid email returns true", () => {
  expect(validateEmail('test@test.com')).toBe(true);
});

function validateEmail(email) {
  return email.includes('@');
}
```

Mình thấy code này đơn giản quá. Email như "a@b", "@b.com" cũng pass?

**Validation - Xác nhận lại:**

Hỏi AI: "Còn edge cases nào cần test?"
AI trả lời:
- Empty string
- Không có @
- @ đầu tiên
- @ cuối cùng
- Không có domain

Từ đây hiểu: TDD giúp nghĩ về edge cases TRƯỚC.

### 6.2 Solution Exploration

So sánh các options trước khi chọn testing framework.

**Testing Levels:**

Khi nghiên cứu, mình hỏi AI về sự khác nhau giữa các testing levels:

Hỏi AI: "Unit test, integration test, và E2E test khác nhau thế nào?"
AI trả lời và mình ghi nhận:

| Level | Scope | Speed | Use case |
|-------|-------|-------|----------|
| Unit Test | Một function đơn lẻ | Rất nhanh (ms) | Test logic riêng lẻ |
| Integration Test | Nhiều modules tương tác | Trung bình (giây) | Test giao tiếp giữa các module |
| E2E Test | Toàn bộ hệ thống | Chậm (phút) | Test critical user flows |

Quyết định của mình:
- Unit tests chiếm 70% - verify từng function nhỏ
- Integration tests chiếm 20% - verify interactions
- E2E tests chiếm 10% - chỉ critical flows

**Testing framework:**

| Framework | Ưu điểm | Nhược điểm | Chọn? |
|-----------|---------|------------|-------|
| Jest | Setup nhanh, có mocking, document tốt | Không test browser trực tiếp | [x] |
| Mocha + Chai | Linh hoạt | Phải cài thêm assertion library | [ ] |
| Vitest | Nhanh hơn Jest | Community nhỏ hơn | [ ] |

Chọn Jest vì: TypeScript support tốt, không cần setup nhiều, team đã quen.

**Mocking strategy:**

| Cách mock | Ưu điểm | Nhược điểm | Chọn? |
|-----------|---------|------------|-------|
| Jest built-in | Không cần thêm dependency | Syntax khó hiểu | [x] |
| Sinon.js | Nhiều features | Extra dependency | [x] (khi cần) |

### 6.3 Iterative Refinement

Quá trình hỏi → review → sửa → hỏi lại.

**Ví dụ 1: calculateDiscount**

Vòng 1:
- Hỏi AI: "Viết test cho function calculateDiscount(price, percent)"
- AI trả lời:

```javascript
test("10% discount on 100 equals 10", () => {
  expect(calculateDiscount(100, 10)).toBe(10);
});

function calculateDiscount(price, percent) {
  return price * percent / 100;
}
```

Vòng 2:
- Mình hỏi: "Còn edge cases nào?"
- AI trả lời:
  - price = 0 → 0 (được)
  - percent = 0 → 0 (được)
  - percent = 150 → discount lớn hơn price (lạ)
  - price = -100 → discount âm (bug!)

Vòng 3:
- Hỏi AI: "price âm cho discount âm là bug phải không?"
- AI: Đúng, nên validate price > 0

Vòng 4:
- Hỏi AI: "Nên throw error hay return 0?"
- AI: Đây là business decision, không phải technical

Mình hiểu: phải define business requirements TRƯỚC.

**Ví dụ 2: Assertion methods**

Hỏi AI: "toBe() vs toEqual() khác nhau thế nào?"

```javascript
// toBe() - so sánh ===
expect(5).toBe(5);        // true
expect("hello").toBe("hello"); // true

// toEqual() - so sánh deep equal
expect({a:1}).toEqual({a:1}); // true
expect({a:1}).toBe({a:1});   // false (different object)

// toMatchObject() - partial match
expect({a:1, b:2}).toMatchObject({a:1}); // true
```

Quy tắc mình ghi nhận:
- Dùng toEqual() mặc định cho objects
- Dùng toMatchObject() khi cố ý check partial
- Dùng toBe() cho primitive values

### 6.4 Key Learnings

**Điều đã học được:**

1. **Hỏi theo lớp** - bắt đầu từ định nghĩa, rồi chi tiết, rồi ví dụ. Cách này giúp hiểu sâu hơn.

2. **Không accept answer quá nhanh** - phải question AI, tìm edge cases, verify lại.

3. **Define requirements trước** - AI không biết business context. Mình phải nói rõ requirement, AI mới implement đúng.

4. **Iterative refinement** - code đầu tiên hiếm khi hoàn hảo. Cứ hỏi → review → sửa → hỏi lại.

**Quy trình sẽ áp dụng:**

1. Define requirements rõ ràng trước
2. Hỏi AI với context cụ thể
3. Review kỹ câu trả lời
4. Test cả happy path lẫn edge cases
5. Refine nếu cần

---

## 7. Key Takeaways

1. **AI là công cụ hợp tác, không phải người thay thế** - AI giúp nhanh hơn nhưng mình vẫn phải là người kiến trúc sư. AI không biết business context, requirements phải do mình define.

2. **Hỏi theo lớp thay vì hỏi tất cả một lúc** - Bắt đầu từ Research (định nghĩa), rồi Brief (chi tiết), Example (ví dụ), cuối cùng Validation (xác nhận). Cách này giúp hiểu sâu hơn thay vì accept answer ngay.

3. **Không bao giờ accept AI answer đầu tiên** - Code đầu tiên hiếm khi hoàn hảo. Phải question, tìm edge cases, verify lại. Nhiều khi AI viết pass hết tests nhưng logic sai.

4. **TDD giúp kiểm soát AI-generated code** - Viết test trước giúp define requirements rõ ràng. AI code pass tests = đúng spec. Tests cũ là regression suite khi AI sửa bug.

5. **Testing levels có tỷ lệ 70/20/10** - 70% unit tests (nhanh, ổn định), 20% integration tests (verify interactions), 10% E2E tests (chỉ critical flows). Không nên over-test hay under-test.

6. **Common mistakes cần tránh** - Over-testing (test quá chi tiết, brittle), weak assertions (toBeTruthy() thay vì verify cụ thể), testing implementation details (break khi refactor).

7. **Guardrails cho AI code** - Static analysis, code review bắt buộc, security scanning, mutation testing. AI có tỷ lệ security issues cao hơn, cần scan kỹ.

---

## 8. References

### 8.1 Tài liệu chính về TDD

| # | Tiêu đề | Link | Ghi chú |
|---|---------|------|---------|
| 1 | Test-Driven Development (TDD) - Comprehensive Guide | [testdriven.io](https://testdriven.io/test-driven-development/) | Tài liệu tổng hợp về TDD từ cơ bản đến nâng cao |
| 2 | TDD là gì? - Viblo | [Viblo](https://viblo.asia/p/test-driven-development-tdd-la-gi-XqaGEBwbeWK) | Giải thích TDD bằng tiếng Việt, dễ hiểu |
| 3 | Khi AI viết code, tại sao tôi vẫn viết test trước - Viblo | [Viblo](https://viblo.asia/p/khi-ai-viet-code-tai-sao-toi-van-viet-test-truoc-pPLkN19dJRZ) | Kết hợp AI + TDD, rất phù hợp với context tuần này |
| 4 | Levels of Software Testing - GeeksforGeeks | [GeeksforGeeks](https://www.geeksforgeeks.org/software-testing/levels-of-software-testing/) | Tổng quan về các cấp độ testing |

### 8.2 Tài liệu về Testing AI-Generated Code

| # | Tiêu đề | Link | Ghi chú |
|---|---------|------|---------|
| 1 | How to Test AI Generated Code: A QA Checklist for 2026 | [ContextQA](https://contextqa.com/blog/what-is-ai-generated-code-testing-checklist/) | Checklist toàn diện để test AI code |
| 2 | How to Review AI-Generated Code: 6 Failure Modes | [Appxlab](https://blog.appxlab.io/2026/04/06/review-ai-generated-code-checklist/) | 6 failure modes phổ biến của AI code |
| 3 | How to Test AI-Generated Code the Right Way | [TwoCents Software](https://www.twocents.software/blog/how-to-test-ai-generated-code-the-right-way/) | Best practices để test AI code |
| 4 | AI Generated Code Quality Gates in CI/CD | [Appxlab](https://blog.appxlab.io/2026/04/07/ai-generated-code-quality-gates-cicd/) | Tích hợp AI code validation vào CI/CD |

### 8.3 Tài liệu về Common Testing Mistakes

| # | Tiêu đề | Link | Ghi chú |
|---|---------|------|---------|
| 1 | The Most Common Unit Testing Mistakes - Filip Danić | [danicfilip.com](https://danicfilip.com/thesoftwarelounge/the-most-common-unit-testing-mistakes/) | Phân tích sâu về over-testing, weak assertions, testing implementation details |
| 2 | Unit Testing Pitfalls - Bastian Isensee | [bastian-isensee.com](https://bastian-isensee.com/post/21-unit-testing-issues/) | Các pitfalls phổ biến khi viết unit tests |
| 3 | Common JUnit Testing Mistakes and How to Avoid Them | [ankurm.com](https://ankurm.com/common-junit-testing-mistakes/) | Tập trung vào Java/JUnit nhưng concepts áp dụng được cho mọi framework |
| 4 | The #1 Mistake in Unit Testing (and How to Fix It) | [Craft Better Software](https://craftbettersoftware.com/p/the-1-mistake-in-unit-testing-and) | Về việc test behavior chứ không test implementation |
| 5 | Avoiding False Positives in Node.js Tests | [AppSignal](https://blog.appsignal.com/2024/11/20/avoiding-false-positives-in-nodejs-tests.html) | Focus vào JavaScript/Node.js ecosystem |

### 8.4 Tools & Frameworks Documentation

| # | Tool | Link | Ghi chú |
|---|------|------|---------|
| 1 | Jest Documentation | [jestjs.io](https://jestjs.io/docs/getting-started) | Official docs - nơi tốt nhất để học Jest |
| 2 | Vitest | [vitest.dev](https://vitest.dev/) | Modern alternative to Jest, nhanh hơn |
| 3 | Playwright | [playwright.dev](https://playwright.dev/) | E2E testing framework được recommend |
| 4 | Mocha | [mochajs.org](https://mochajs.org/) | Alternative testing framework |
| 5 | Chai Assertion Library | [chaijs.com](https://www.chaijs.com/) | Assertion library thường dùng với Mocha |

### 8.5 Blogs & Communities

| # | Nguồn | Link | Ghi chú |
|---|-------|------|---------|
| 1 | Google Testing Blog | [testing.googleblog.com](https://testing.googleblog.com/) | Best practices từ Google |
| 2 | Martin Fowler's Bliki | [martinfowler.com/bliki](https://martinfowler.com/bliki/) | Coverage, Testing, Refactoring articles |
| 3 | JUnit 5 User Guide | [junit.org](https://junit.org/junit5/docs/current/user-guide/) | Java testing framework phổ biến nhất |

### 8.6 AI Tools đã sử dụng

| # | Tool | Purpose | Notes |
|---|------|---------|-------|
| 1 | Cursor AI | Tương tác chính trong tuần | Sử dụng để hỏi về TDD, test examples, best practices |
| 2 | Claude AI | Backup research | Khi cần second opinion hoặc giải thích khác |
| 3 | ChatGPT | Quick examples | Cho nhanh các code snippets |

### 8.7 Notes về việc sử dụng References

**Cách mình đã dùng các references:**

1. **Trước khi hỏi AI**: Đọc qua docs chính (Jest docs, TDD guide) để có context
2. **Khi hỏi AI**: Dùng AI để giải thích concepts theo cách dễ hiểu hơn
3. **Sau khi nhận answer**: Verify với official docs nếu không chắc chắn
4. **Khi viết document**: Trích dẫn sources để mentor có thể verify
