# Architecture: CLI ↔ KB API Integration

## Data Flow

```
User Input (terminal)
        │
        ▼
┌───────────────────────────────────────────────────────┐
│  src/index.ts - Entry Point                           │
│  • Parse arguments                                    │
│  • Route to command handler                           │
│  • Validate numeric inputs (--top-k, --limit)         │
│  • Sanitize tags                                      │
└───────────────────────┬───────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────┐
│  src/commands/kb/*.command.ts - Command Handlers      │
│  • Validate inputs (empty query, path format, etc.)   │
│  • Call createKBClient() factory                      │
│  • Format and print results                           │
└───────────────────────┬───────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────┐
│  src/clients/kb-client-factory.ts - Factory           │
│  • Read KB_CLIENT_TYPE env variable                   │
│  • Return MockKBClient or HTTPKBClient                │
└──────────────┬────────────────────┬───────────────────┘
               │                    │
               ▼                    ▼
┌──────────────────────┐  ┌─────────────────────────────┐
│  MockKBClient        │  │  HTTPKBClient               │
│  (KB_CLIENT_TYPE=    │  │  (KB_CLIENT_TYPE=http)      │
│   mock, default)     │  │                             │
│  • In-memory data    │  │  • POST /search             │
│  • 3 mock documents  │  │  • POST /list               │
│  • Exact/partial/    │  │  • POST /retrieve           │
│    fuzzy matching    │  │  • POST /add                │
└──────────────────────┘  │  • Timeout handling         │
                          │  • API key auth             │
                          └──────────────┬──────────────┘
                                         │
                                         ▼
                               ┌─────────────────┐
                               │  KB API Server  │
                               │  (external)     │
                               └─────────────────┘
```

## Layer Responsibilities

| Layer | File | Trách nhiệm |
|-------|------|-------------|
| Entry Point | `src/index.ts` | Parse args, routing, numeric validation |
| Commands | `src/commands/kb/*.ts` | Input validation, output formatting |
| Factory | `src/clients/kb-client-factory.ts` | Client selection via env |
| Interface | `src/clients/kb-client.interface.ts` | Contract giữa commands và clients |
| Mock Client | `src/clients/mock-kb-client.ts` | In-memory implementation |
| HTTP Client | `src/clients/http-kb-client.ts` | Real API calls |
| Config | `src/config/kb-api.config.ts` | Environment variable management |
| Models | `src/models/kb-document.ts` | Type definitions |

## API Contract

### POST /search

```
Request:
{
  "query": "customer response",
  "topK": 5,
  "tags": ["template"]          // optional
}

Response:
{
  "results": [
    {
      "id": "doc-001",
      "title": "Customer Response Template",
      "content": "# Customer Response...",
      "nodePath": "/templates/email",
      "tags": ["template", "email"],
      "matchType": "exact"       // "exact" | "partial" | "fuzzy"
    }
  ]
}
```

### POST /list

```
Request:
{
  "nodePath": "/templates/email",  // optional
  "limit": 10,
  "tags": ["template"]             // optional
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

```
Request:
{
  "docId": "doc-001"
}

Response:
{
  "document": {
    "id": "doc-001",
    "title": "Customer Response Template",
    "content": "# Customer Response...",
    "nodePath": "/templates/email",
    "tags": ["template", "email"]
  }
}

// Document not found:
{
  "document": null
}
```

### POST /add

```
Request:
{
  "title": "New Template",
  "content": "# New Template\n...",
  "nodePath": "/templates/sms",
  "tags": ["template", "sms"]   // optional
}

Response:
{
  "document": {
    "id": "doc-xxx",
    "title": "New Template",
    "content": "# New Template\n...",
    "nodePath": "/templates/sms",
    "tags": ["template", "sms"]
  }
}
```

## Environment Variables

| Variable | Default | Mô tả |
|----------|---------|--------|
| `KB_CLIENT_TYPE` | `mock` | `mock` hoặc `http` |
| `KB_API_URL` | `http://localhost:3000/api/kb` | Base URL của KB API |
| `KB_API_KEY` | - | Bearer token (nếu server yêu cầu) |
| `KB_TIMEOUT` | `30000` | Request timeout (milliseconds) |

## Search Algorithm (MockKBClient)

```
Query: "customer response"
         │
         ▼
1. Exact match: query nằm trong title hoặc tags?
   → matchType = "exact"
         │
         ▼
2. Partial match: query nằm trong content?
   → matchType = "partial"
         │
         ▼
3. Fuzzy match: tất cả words trong query là prefix
   của words trong title/content?
   → matchType = "fuzzy"
         │
         ▼
4. Không match → bỏ qua document
```

## Error Handling

| Lỗi | Xử lý |
|-----|-------|
| Query rỗng | `Error: Query cannot be empty` |
| `--limit` âm | Warning + dùng default 10 |
| `--top-k` không phải số | `Error: must be a valid integer` |
| `--node` không bắt đầu `/` | `Error: must start with "/"` |
| Doc ID không tồn tại | `Document not found: <id>` |
| Network error (HTTP mode) | `Error: Network error: fetch failed` |
| Timeout (HTTP mode) | `Error: Request timeout after 30000ms` |
| API error 4xx/5xx | `Error: API Error: <status> - <message>` |
