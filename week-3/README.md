# Week 3: Knowledge Base CLI

## Tổng quan

Tuần 3 tích hợp CLI với Knowledge Base API với 2 implementations:
- **Days 1-2**: MockKBClient - test local với mock data
- **Days 3-4**: HTTPKBClient - kết nối real KB API

## Cài đặt

```bash
# Build project
npm run build

# Link CLI toàn cục (chỉ cần làm 1 lần)
npm link

# Hoặc dùng npx
npx tsx src/index.ts <command>
```

## Chế độ hoạt động

### Mock Mode (mặc định)

```bash
# Không cần server, dùng mock data sẵn có
npx tsx src/index.ts kb search "team"
```

### HTTP Mode (Real API)

```bash
# Cần set environment variables
$env:KB_CLIENT_TYPE="http"
$env:KB_API_URL="http://localhost:3000/api/kb"

# Với API key (nếu cần)
$env:KB_API_KEY="your-api-key"

# Chạy command
npx tsx src/index.ts kb search "team"
```

### Environment Variables

| Variable | Default | Mô tả |
|----------|---------|--------|
| `KB_CLIENT_TYPE` | `mock` | `mock` hoặc `http` |
| `KB_API_URL` | `http://localhost:3000/api/kb` | Base URL của KB API |
| `KB_API_KEY` | - | API key (nếu server yêu cầu) |
| `KB_TIMEOUT` | `30000` | Timeout in milliseconds |

## KB Commands

### 1. kb search - Tìm kiếm documents

```bash
# Tìm kiếm cơ bản
tickets kb search "customer response"

# Giới hạn số kết quả
tickets kb search "template" --top-k 3

# Lọc theo tags
tickets kb search "team" --tags devops
```

**Output mẫu:**
```
Found 2 document(s):

[EXACT] Customer Response Template
  ID: doc-001
  Path: /templates/email
  Tags: template, email, response
  Preview: # Customer Response Template...

[FUZZY] DevOps Team Documentation
  ID: doc-002
  Path: /team/devops
  Tags: team, devops, oncall
  Preview: # DevOps Team...
```

### 2. kb list - Liệt kê documents

```bash
# Liệt kê tất cả
tickets kb list

# Lọc theo node path
tickets kb list --node /templates/email

# Giới hạn số kết quả
tickets kb list --limit 5

# Lọc theo tags
tickets kb list --tags team
```

**Output mẫu:**
```
Found 1 document(s):

- Customer Response Template
  ID: doc-001
  Path: /templates/email
  Tags: template, email, response
```

### 3. kb retrieve - Lấy chi tiết document

```bash
# Lấy document theo ID
tickets kb retrieve doc-001
```

**Output mẫu:**
```
# Customer Response Template

**ID:** doc-001
**Path:** /templates/email
**Tags:** template, email, response

---
# Customer Response Template

Dear {{customer_name}},

Thank you for contacting us regarding {{issue}}...
```

### 4. kb add - Thêm document mới

```bash
# Thêm từ file
tickets kb add --file template.md --path /templates/sms --tags sms

# Thêm với nội dung trực tiếp
tickets kb add --content "Hello World" --title "Test Doc" --path /test

# Thêm với tags
tickets kb add --file readme.md --path /docs --tags documentation,guide
```

**Options:**
- `--file <path>` - Đường dẫn file cần thêm
- `--content <text>` - Nội dung trực tiếp (thay thế cho --file)
- `--title <text>` - Tiêu đề document
- `--path <path>` - Node path (bắt buộc)
- `--tags <tag1,tag2>` - Tags (comma-separated)

**Output mẫu:**
```
Document added successfully!
ID: 1748841234567
Title: Test Doc
Path: /test
```

## API Contract (HTTP Mode)

Server phải implement các endpoints sau:

### POST /search

```json
Request:
{
  "query": "response",
  "topK": 5,
  "tags": ["template"]
}

Response:
{
  "results": [
    {
      "id": "doc-001",
      "title": "Customer Response Template",
      "content": "...",
      "nodePath": "/templates/email",
      "tags": ["template", "email"],
      "matchType": "exact"
    }
  ]
}
```

### POST /list

```json
Request:
{
  "nodePath": "/templates/email",
  "limit": 10,
  "tags": ["template"]
}

Response:
{
  "documents": [
    {
      "id": "doc-001",
      "title": "Customer Response Template",
      "content": "...",
      "nodePath": "/templates/email",
      "tags": ["template", "email"]
    }
  ]
}
```

### POST /retrieve

```json
Request:
{ "docId": "doc-001" }

Response:
{
  "document": {
    "id": "doc-001",
    "title": "...",
    "content": "...",
    "nodePath": "/templates/email",
    "tags": ["template"]
  }
}
```

### POST /add

```json
Request:
{
  "title": "New Template",
  "content": "...",
  "nodePath": "/templates/email",
  "tags": ["template"]
}

Response:
{
  "document": {
    "id": "doc-xxx",
    "title": "New Template",
    "content": "...",
    "nodePath": "/templates/email",
    "tags": ["template"]
  }
}
```

## Mock Data

MockKBClient có sẵn 3 documents:

| ID | Title | Path | Tags |
|----|-------|------|------|
| doc-001 | Customer Response Template | /templates/email | template, email, response |
| doc-002 | DevOps Team Documentation | /team/devops | team, devops, oncall |
| doc-003 | Welcome Guide | /docs/onboarding | welcome, onboarding, guide |

## Architecture

```
CLI Commands (kb search/list/retrieve/add)
         │
         ▼
KBClient Interface
         │
    ┌────┴────┐
    │         │
    ▼         ▼
MockKBClient  HTTPKBClient
(mock data)   (real API)
              │
              ▼
         KB API Server
```

## Error Handling

### HTTP Mode Errors

| Error | Nguyên nhân | Giải pháp |
|-------|-------------|------------|
| `Network error` | Server không chạy | Start KB API server |
| `408 Request timeout` | Server phản hồi chậm | Tăng `KB_TIMEOUT` |
| `API Error: 404` | Document không tồn tại | Kiểm tra doc ID |
| `API Error: 401` | Sai API key | Kiểm tra `KB_API_KEY` |

## Chạy Tests

```bash
# Chạy tất cả unit tests
npm run test:unit

# Chạy tests cho KB client
npm run test:unit -- tests/unit/clients

# Chạy với watch mode
npm run test:watch

# Chạy integration tests
npm run test:integration
```

## Cấu trúc code

```
src/
├── index.ts                 # CLI entry point
├── commands/
│   └── kb/
│       ├── search.command.ts
│       ├── list.command.ts
│       ├── retrieve.command.ts
│       └── add.command.ts
├── clients/
│   ├── kb-client.interface.ts   # Interface
│   ├── mock-kb-client.ts       # Mock implementation
│   ├── http-kb-client.ts        # HTTP implementation
│   └── kb-client-factory.ts     # Client factory
├── models/
│   └── kb-document.ts          # Types & interfaces
└── config/
    └── kb-api.config.ts        # Environment config
```

## Ngày 5: Final

- Tài liệu hoàn chỉnh
- Final validation
- Integration testing với real server
