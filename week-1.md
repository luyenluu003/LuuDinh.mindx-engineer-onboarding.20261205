# TDD Research Document

## MindX Engineer Onboarding - Week 1

**Author:** Lưu Đình Luyện
**Date:** 19-05-2026  
**Mentor:** [Tên mentor]

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

    Sau đó mới cải thiện dần sang 

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
