# API Endpoints

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-19

---

## Maqsad

Ushbu hujjat barcha API endpointlarni batafsil tavsiflaydi.

---

## 1. Articles API

### `GET /api/articles`

Maqolalar ro'yxatini qaytaradi (pagination bilan).

**Query Parameters:**

| Parametr | Tur | Default | Tavsif |
|----------|-----|---------|--------|
| `page` | number | 1 | Sahifa raqami |
| `limit` | number | 10 | Sahifadagi maqolalar soni (max: 50) |
| `category` | string | - | Kategoriya slug bo'yicha filter |
| `difficulty` | string | - | Qiyinlik darajasi filter |
| `search` | string | - | Qidiruv so'zi |

**Request:**
```bash
GET /api/articles?page=1&limit=10&category=ai
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123...",
      "slug": "openai-gpt-5-chiqarildi",
      "title": "OpenAI GPT-5 Chiqarildi",
      "summary": "OpenAI kompaniyasi yangi...",
      "imageUrl": "https://...",
      "difficulty": "INTERMEDIATE",
      "importance": "HIGH",
      "viewCount": 1234,
      "publishedAt": "2026-01-19T10:00:00Z",
      "category": {
        "slug": "ai",
        "name": "Sun'iy Intellekt",
        "color": "#8B5CF6"
      },
      "tags": [
        { "name": "OpenAI", "slug": "openai" },
        { "name": "GPT", "slug": "gpt" }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 156,
    "totalPages": 16,
    "hasMore": true
  }
}
```

---

### `GET /api/articles/[slug]`

Bitta maqolani slug bo'yicha qaytaradi.

**Path Parameters:**

| Parametr | Tur | Tavsif |
|----------|-----|--------|
| `slug` | string | Maqola slug |

**Request:**
```bash
GET /api/articles/openai-gpt-5-chiqarildi
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx123...",
    "slug": "openai-gpt-5-chiqarildi",
    "title": "OpenAI GPT-5 Chiqarildi",
    "summary": "OpenAI kompaniyasi yangi avlod...",
    "content": "## Kirish\n\nOpenAI kompaniyasi...",
    "imageUrl": "https://...",
    "sourceUrl": "https://techcrunch.com/...",
    "difficulty": "INTERMEDIATE",
    "importance": "HIGH",
    "viewCount": 1234,
    "publishedAt": "2026-01-19T10:00:00Z",
    "createdAt": "2026-01-19T09:30:00Z",
    "category": {
      "id": "cat1",
      "slug": "ai",
      "name": "Sun'iy Intellekt",
      "color": "#8B5CF6",
      "icon": "brain"
    },
    "tags": [
      { "id": "tag1", "name": "OpenAI", "slug": "openai" },
      { "id": "tag2", "name": "GPT", "slug": "gpt" }
    ]
  }
}
```

**Errors:**

| Status | Error | Sabab |
|--------|-------|-------|
| 404 | Article not found | Slug topilmadi |

---

### `GET /api/articles/featured`

Featured (tanlangan) maqolalarni qaytaradi.

**Query Parameters:**

| Parametr | Tur | Default | Tavsif |
|----------|-----|---------|--------|
| `limit` | number | 5 | Maqolalar soni |

**Request:**
```bash
GET /api/articles/featured?limit=5
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123...",
      "slug": "...",
      "title": "...",
      "summary": "...",
      "imageUrl": "...",
      "importance": "CRITICAL",
      "publishedAt": "...",
      "category": { "slug": "ai", "name": "AI", "color": "#..." }
    }
  ]
}
```

---

### `POST /api/articles/view`

Maqola view count'ini oshiradi.

**Request Body:**

| Field | Tur | Required | Tavsif |
|-------|-----|----------|--------|
| `slug` | string | ✅ | Maqola slug |

**Request:**
```bash
POST /api/articles/view
Content-Type: application/json

{
  "slug": "openai-gpt-5-chiqarildi"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "viewCount": 1235
  }
}
```

---

## 2. Categories API

### `GET /api/categories`

Barcha kategoriyalarni qaytaradi.

**Request:**
```bash
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat1",
      "slug": "ai",
      "name": "Sun'iy Intellekt",
      "description": "AI va ML yangiliklari",
      "color": "#8B5CF6",
      "icon": "brain",
      "_count": {
        "articles": 45
      }
    },
    {
      "id": "cat2",
      "slug": "programming",
      "name": "Dasturlash",
      "description": "Dasturlash tillari va frameworklar",
      "color": "#10B981",
      "icon": "code",
      "_count": {
        "articles": 67
      }
    }
  ]
}
```

---

## 3. Admin API

### `POST /api/admin/login`

Admin autentifikatsiyasi.

**Request Body:**

| Field | Tur | Required | Tavsif |
|-------|-----|----------|--------|
| `username` | string | ✅ | Admin username |
| `password` | string | ✅ | Admin password |

**Request:**
```bash
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "secure_password"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "message": "Login successful"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

**Cookies Set:**
- `admin_token` - HTTP-only session token

---

### `POST /api/admin/logout`

Admin chiqish.

**Request:**
```bash
POST /api/admin/logout
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## 4. News Processing API

### `POST /api/news/sync`

Yangilik manbalaridan sync qilish (manual trigger).

**Headers:**

| Header | Value | Tavsif |
|--------|-------|--------|
| `Authorization` | `Bearer {CRON_SECRET}` | Auth token |

**Request:**
```bash
POST /api/news/sync
Authorization: Bearer your_cron_secret
```

**Response:**
```json
{
  "success": true,
  "data": {
    "synced": 15,
    "sources": ["newsapi-ai", "thenewsapi"],
    "duration": "2.3s"
  }
}
```

---

### `POST /api/news/process`

RawArticle'larni AI bilan qayta ishlash.

**Headers:**

| Header | Value | Tavsif |
|--------|-------|--------|
| `Authorization` | `Bearer {CRON_SECRET}` | Auth token |

**Request Body:**

| Field | Tur | Required | Tavsif |
|-------|-----|----------|--------|
| `limit` | number | ❌ | Qayta ishlanadigan maqolalar soni (default: 5) |

**Request:**
```bash
POST /api/news/process
Authorization: Bearer your_cron_secret
Content-Type: application/json

{
  "limit": 10
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "processed": 10,
    "published": 8,
    "filtered": 2,
    "tokensUsed": 15000,
    "cost": "$0.015"
  }
}
```

---

## TypeScript Types

```typescript
// packages/api-types/src/article.ts

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string | null;
  sourceUrl: string;
  difficulty: Difficulty;
  importance: Importance;
  viewCount: number;
  publishedAt: string;
  createdAt: string;
  category: Category;
  tags: Tag[];
}

export interface ArticleListItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  imageUrl: string | null;
  difficulty: Difficulty;
  importance: Importance;
  viewCount: number;
  publishedAt: string;
  category: CategoryBadge;
  tags: Tag[];
}

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type Importance = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}
```

---

## Bog'liq Hujjatlar

- [API Overview](./README.md) - API umumiy ma'lumot
- [Cron Jobs](./CRON_JOBS.md) - Avtomatik vazifalar
- [Models](../models/README.md) - Ma'lumot modellari

