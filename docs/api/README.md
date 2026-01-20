# API Hujjatlari

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-19

---

## Maqsad

Aishunos platformasi REST API orqali ma'lumot almashadi. Ushbu hujjat API arxitekturasi va endpointlarni tavsiflaydi.

---

## Hujjatlar

| Hujjat | Tavsif |
|--------|--------|
| [ENDPOINTS.md](./ENDPOINTS.md) | Barcha API endpointlari |
| [CRON_JOBS.md](./CRON_JOBS.md) | Avtomatik vazifalar |
| [AUTHENTICATION.md](./AUTHENTICATION.md) | Autentifikatsiya tizimi |

---

## API Umumiy Ma'lumot

### Base URL

| Muhit | URL |
|-------|-----|
| **Production** | `https://aishunos.uz/api` |
| **Development** | `http://localhost:3000/api` |

### Response Format

Barcha API javoblari quyidagi formatda:

```typescript
// Muvaffaqiyatli javob
interface SuccessResponse<T> {
  success: true;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Xato javob
interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}
```

### HTTP Status Kodlari

| Kod | Ma'no | Qachon |
|-----|-------|--------|
| `200` | OK | Muvaffaqiyatli GET/PUT |
| `201` | Created | Muvaffaqiyatli POST |
| `400` | Bad Request | Noto'g'ri parametrlar |
| `401` | Unauthorized | Autentifikatsiya kerak |
| `403` | Forbidden | Ruxsat yo'q |
| `404` | Not Found | Resurs topilmadi |
| `429` | Too Many Requests | Rate limit |
| `500` | Internal Server Error | Server xatosi |

---

## Endpointlar Umumiy Ko'rinish

### Public Endpoints

| Method | Endpoint | Vazifasi |
|--------|----------|----------|
| `GET` | `/api/articles` | Maqolalar ro'yxati |
| `GET` | `/api/articles/[slug]` | Bitta maqola |
| `GET` | `/api/articles/featured` | Featured maqolalar |
| `POST` | `/api/articles/view` | View count oshirish |
| `GET` | `/api/categories` | Kategoriyalar |

### Cron Endpoints (Protected)

| Method | Endpoint | Vazifasi |
|--------|----------|----------|
| `GET` | `/api/cron/news` | Yangiliklar sync |
| `GET` | `/api/cron/telegram` | Telegram posting |

### Admin Endpoints (Protected)

| Method | Endpoint | Vazifasi |
|--------|----------|----------|
| `POST` | `/api/admin/login` | Admin kirish |
| `POST` | `/api/admin/logout` | Admin chiqish |

---

## Rate Limiting

| Endpoint turi | Limit | Window |
|---------------|-------|--------|
| Public API | 100 requests | 1 daqiqa |
| Cron Jobs | Token bilan | - |
| Admin | 50 requests | 1 daqiqa |

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642521600
```

---

## CORS

```typescript
// next.config.ts
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

---

## Xatolarni Qayta Ishlash

### Client-side

```typescript
async function fetchArticles(): Promise<Article[]> {
  const response = await fetch('/api/articles');
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error);
  }
  
  return data.data;
}
```

### Server-side

```typescript
// API route'da
export async function GET(request: NextRequest) {
  try {
    const articles = await prisma.article.findMany();
    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Database connection failed' },
      { status: 500 }
    );
  }
}
```

---

## Bog'liq Hujjatlar

- [Endpoints](./ENDPOINTS.md) - Batafsil endpoint hujjati
- [Cron Jobs](./CRON_JOBS.md) - Avtomatik vazifalar
- [Models](../models/README.md) - Ma'lumot modellari

