# Setup & Deployment Guide

## Yêu cầu

- Node.js >= 18
- npm >= 9

## Cài đặt

```bash
# Clone project
git clone <repo-url>
cd <project-dir>

# Cài dependencies
npm install

# Build
npm run build
```

## Cấu hình

Tạo file `.env` từ template:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Linux/macOS
cp .env.example .env
```

Chỉnh sửa `.env` theo môi trường:

```env
# Development (mock data, không cần server)
KB_CLIENT_TYPE=mock

# Production (real KB API)
KB_CLIENT_TYPE=http
KB_API_URL=https://your-kb-api.example.com/api/kb
KB_API_KEY=your-api-key-here
KB_TIMEOUT=30000
```

## Chạy CLI

### Development (Mock Mode)

Không cần server. Dùng mock data sẵn có.

```bash
# Tìm kiếm documents
npx tsx src/index.ts kb search "customer response"

# Liệt kê documents
npx tsx src/index.ts kb list

# Xem chi tiết document
npx tsx src/index.ts kb retrieve doc-001

# Thêm document mới
npx tsx src/index.ts kb add --content "Hello" --title "Test" --path /test
```

### Production (HTTP Mode)

Cần KB API server đang chạy.

```bash
# Windows PowerShell
$env:KB_CLIENT_TYPE="http"
$env:KB_API_URL="https://your-kb-api.example.com/api/kb"
$env:KB_API_KEY="your-api-key"

# Linux/macOS
export KB_CLIENT_TYPE=http
export KB_API_URL=https://your-kb-api.example.com/api/kb
export KB_API_KEY=your-api-key

# Chạy command
npx tsx src/index.ts kb search "customer response"
```

### Dùng npm link (global CLI)

```bash
# Link CLI toàn cục (chỉ cần 1 lần)
npm link

# Sau đó dùng trực tiếp
tickets kb search "team"
tickets kb list --node /templates/email
tickets kb retrieve doc-001
tickets kb add --file template.md --path /templates/sms
```

## Chạy Tests

```bash
# Unit tests
npm run test:unit

# Watch mode (development)
npm run test:watch

# Tất cả tests
npm test
```

## Kiểm tra kết nối HTTP

Trước khi dùng HTTP mode, kiểm tra server bằng curl:

```bash
# Test /search endpoint
curl -X POST https://your-kb-api.example.com/api/kb/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{"query": "test", "topK": 3}'

# Test /list endpoint
curl -X POST https://your-kb-api.example.com/api/kb/list \
  -H "Content-Type: application/json" \
  -d '{"limit": 5}'
```

## Troubleshooting

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| `Network error: fetch failed` | Server không chạy | Kiểm tra `KB_API_URL` và server status |
| `Request timeout after 30000ms` | Server phản hồi chậm | Tăng `KB_TIMEOUT` |
| `API Error: 401` | Sai API key | Kiểm tra `KB_API_KEY` |
| `API Error: 404` | Document không tồn tại | Kiểm tra doc ID |
| `Error: --path must start with "/"` | Sai format path | Dùng `/templates/email` thay vì `templates/email` |
| `No documents found` | Không có kết quả | Thử query khác hoặc kiểm tra mock data |
