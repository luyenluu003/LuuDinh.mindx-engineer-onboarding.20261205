# Ticket Manager CLI

Công cụ CLI để quản lý ticket, lưu trữ dữ liệu cục bộ dưới dạng file JSON. Được xây dựng với TypeScript và phương pháp TDD (Test-Driven Development).

## Tính năng

- Tạo ticket với tiêu đề, mô tả, trạng thái, mức độ ưu tiên và nhãn
- Liệt kê ticket với bộ lọc (theo trạng thái, mức độ ưu tiên, nhãn)
- Xem chi tiết ticket
- Cập nhật trạng thái và mức độ ưu tiên của ticket
- Dữ liệu được lưu trữ dưới dạng JSON

## Yêu cầu hệ thống

- Node.js phiên bản 18 trở lên
- npm hoặc yarn package manager

## Cài đặt

1. Clone repository:

```bash
git clone <repository-url>
cd ticket-manager-cli
```

2. Cài đặt các dependency:

```bash
npm install
```

3. Build project:

```bash
npm run build
```

4. Liên kết CLI (tùy chọn, dùng toàn cục):

```bash
npm link
```

## Cách sử dụng

### Tạo Ticket

```bash
# Ticket cơ bản
npm run dev -- create --title "Sửa lỗi đăng nhập"

# Ticket đầy đủ các tùy chọn
npm run dev -- create --title "Sửa lỗi đăng nhập" --description "Người dùng không thể đăng nhập" --priority high --tags bug,urgent
```

### Liệt kê Tickets

```bash
# Liệt kê tất cả tickets
npm run dev -- list

# Lọc theo trạng thái
npm run dev -- list --status open

# Lọc theo mức độ ưu tiên
npm run dev -- list --priority high

# Lọc theo nhãn
npm run dev -- list --tag bug

# Kết hợp nhiều bộ lọc
npm run dev -- list --status open --priority high
```

### Xem chi tiết Ticket

```bash
npm run dev -- show <ticket-id>
```

### Cập nhật Ticket

```bash
# Cập nhật trạng thái
npm run dev -- update <ticket-id> --status closed

# Cập nhật mức độ ưu tiên
npm run dev -- update <ticket-id> --priority critical

# Cập nhật cả hai
npm run dev -- update <ticket-id> --status resolved --priority low
```

### Xem trợ giúp

```bash
npm run dev -- --help
```

## Các tùy chọn

### Tùy chọn khi tạo Ticket

| Tùy chọn | Bắt buộc | Mô tả |
|----------|----------|-------|
| `--title` | Có | Tiêu đề ticket |
| `--description` | Không | Mô tả ticket |
| `--priority` | Không | Mức độ ưu tiên (low, medium, high, critical) |
| `--tags` | Không | Danh sách nhãn, phân cách bằng dấu phẩy |

### Bộ lọc khi liệt kê

| Tùy chọn | Mô tả |
|----------|-------|
| `--status` | Lọc theo trạng thái (open, in_progress, resolved, closed) |
| `--priority` | Lọc theo mức độ ưu tiên (low, medium, high, critical) |
| `--tag` | Lọc theo nhãn |

### Tùy chọn khi cập nhật

| Tùy chọn | Bắt buộc | Mô tả |
|----------|----------|-------|
| `<id>` | Có | ID của ticket |
| `--status` | Không | Trạng thái mới |
| `--priority` | Không | Mức độ ưu tiên mới |

## Lưu trữ dữ liệu

Tickets được lưu trữ trong file JSON tại `./data/tickets.json` (có thể thay đổi cấu hình).

## Chạy Tests

```bash
# Chạy tất cả tests
npm test

# Chạy tests ở chế độ watch (tự động chạy lại khi có thay đổi)
npm run test:watch

# Chạy tests với báo cáo coverage
npm run test:coverage

# Chạy unit tests
npm run test:unit
```

## Cấu trúc dự án

```
src/
├── commands/          # Các xử lý lệnh CLI
│   ├── create.command.ts
│   ├── list.command.ts
│   ├── show.command.ts
│   └── update.command.ts
├── models/            # Data models và Zod schemas
│   └── ticket.ts
├── services/          # Logic nghiệp vụ
│   └── ticket.service.ts
├── storage/           # Lưu trữ file JSON
│   └── json-storage.service.ts
├── types/             # Các TypeScript types
│   └── config.ts
└── index.ts           # Điểm khởi đầu CLI

tests/
└── unit/              # Unit tests
    ├── models/
    ├── services/
    └── storage/
```

## Phát triển

### Build

```bash
npm run build
```

### Kiểm tra lỗi code (Lint)

```bash
npm run lint
```

## Giấy phép

MIT
