# Week 3 - Days 1-2: Knowledge Base CLI

## Tổng quan

Tuần 3 tích hợp CLI với Knowledge Base API. Ngày 1-2 triển khai MockKBClient với 4 commands cơ bản.

## Cài đặt

```bash
# Build project
npm run build

# Link CLI toàn cục (chỉ cần làm 1 lần)
npm link

# Hoặc dùng npx
npx tsx src/index.ts <command>
```

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
         ▼
MockKBClient (hiện tại) / HTTPKBClient (Days 3-4)
```

## Chạy Tests

```bash
# Chạy tất cả unit tests
npm run test:unit

# Chạy tests cho KB client
npm run test:unit -- tests/unit/clients

# Chạy với watch mode
npm run test:watch
```

## Các bước tiếp theo

- **Ngày 3-4**: Triển khai HTTPKBClient để kết nối real KB API
- **Ngày 5**: Tài liệu và final validation
