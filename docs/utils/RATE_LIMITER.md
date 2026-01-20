# Rate Limiter

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Maqsad

Rate Limiter API endpointlarini haddan tashqari yuklanishdan himoya qiladi.

---

## Fayl Joylashuvi

```
apps/web/src/lib/rate-limit.ts
```

---

## Asosiy Funksiyalar

### rateLimit

```typescript
interface RateLimitConfig {
  interval: number;      // Vaqt oralig'i (ms)
  uniqueTokenPerInterval: number;  // Max unique tokens
}

function rateLimit(config: RateLimitConfig): RateLimiter
```

### check

```typescript
interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}

async function check(
  request: Request,
  limit: number
): Promise<RateLimitResult>
```

---

## Foydalanish

```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
});

// API route
export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return new Response("Too Many Requests", {
      status: 429,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      },
    });
  }

  // ... normal response
}
```

---

## Endpoint Limitleri

| Endpoint | Limit | Interval |
|----------|-------|----------|
| `/api/articles` | 60 | 1 daqiqa |
| `/api/articles/[slug]` | 120 | 1 daqiqa |
| `/api/categories` | 60 | 1 daqiqa |
| `/api/search` | 30 | 1 daqiqa |
| `/api/admin/*` | 30 | 1 daqiqa |

---

## Response Headers

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1706011200
```

---

## Error Response

```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Try again in 30 seconds.",
  "retryAfter": 30
}
```

---

## Bogliq Hujjatlar

- [API Endpoints](../api/ENDPOINTS.md) - API documentation
