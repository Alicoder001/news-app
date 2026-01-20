# News Source Model

> **Versiya:** 1.1  
> **Yangilangan:** 2026-01-20

---

## Maqsad

NewsSource modeli yangiliklar manbalarini saqlash uchun ishlatiladi. Bu RSS feedlar, News API providerlari va boshqa manbalarni o'z ichiga oladi.

---

## Prisma Schema

```prisma
model NewsSource {
  id          String     @id @default(cuid())
  name        String
  url         String     @unique
  type        SourceType @default(NEWS_API)
  isActive    Boolean    @default(true)
  lastFetched DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  RawArticle  RawArticle[]
}

enum SourceType {
  NEWS_API    // NewsAPI.org va boshqa API lar
  RSS         // RSS/Atom feedlar
  SCRAPER     // Web scraping
}
```

---

## Maydonlar

| Maydon | Turi | Tavsif | Majburiy |
|--------|------|--------|----------|
| `id` | String | Unique ID (CUID) | ✅ Auto |
| `name` | String | Manba nomi | ✅ |
| `url` | String | Asosiy URL (unique) | ✅ |
| `type` | SourceType | Manba turi (enum) | ✅ Default: NEWS_API |
| `isActive` | Boolean | Faolmi | ✅ Default: true |
| `lastFetched` | DateTime? | Oxirgi yangilash vaqti | ❌ |
| `createdAt` | DateTime | Yaratilgan vaqt | ✅ Auto |
| `updatedAt` | DateTime | Yangilangan vaqt | ✅ Auto |
| `RawArticle` | RawArticle[] | Olingan maqolalar | Auto |

---

## SourceType Enum

| Turi | Tavsif | Misol |
|------|--------|-------|
| `NEWS_API` | REST API orqali | NewsAPI.org, GNews.io |
| `RSS` | RSS/Atom feed | TechCrunch RSS |
| `SCRAPER` | Web scraping | Custom scrapers |

---

## Repository Methods

```typescript
// NewsSourceRepository

// Manba olish yoki yaratish
static async getOrCreate(
  name: string,
  url: string,
  type: SourceType = 'NEWS_API'
): Promise<{ id: string; isNew: boolean }>

// Faol manbalarni olish
static async getActive(): Promise<NewsSource[]>

// Tur boyicha olish
static async getByType(type: SourceType): Promise<NewsSource[]>

// lastFetched yangilash
static async updateLastFetched(id: string): Promise<void>

// Deaktiv qilish (soft delete)
static async deactivate(id: string): Promise<void>

// Statistika
static async getStats(): Promise<{
  total: number;
  active: number;
  byType: Record<string, number>;
}>
```

---

## Namuna Manbalar

```typescript
// NewsAPI.org
await NewsSourceRepository.getOrCreate(
  'NewsAPI.org',
  'https://newsapi.org',
  'NEWS_API'
);

// TechCrunch RSS
await NewsSourceRepository.getOrCreate(
  'TechCrunch',
  'https://techcrunch.com/feed/',
  'RSS'
);
```

---

## TypeScript Interface

```typescript
import type { SourceType } from '@prisma/client';

interface NewsSource {
  id: string;
  name: string;
  url: string;
  type: SourceType; // 'NEWS_API' | 'RSS' | 'SCRAPER'
  isActive: boolean;
  lastFetched: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Bogliq Hujjatlar

- [RawArticle Model](./RAW_ARTICLE.md) - Olingan maqolalar
- [NewsSource Repository](../repositories/NEWS_SOURCE_REPO.md) - CRUD operatsiyalar
- [News Providers](../services/NEWS_PROVIDERS.md) - Provider implementatsiyalari
