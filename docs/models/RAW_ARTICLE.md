# Raw Article Model

> **Versiya:** 1.1  
> **Yangilangan:** 2026-01-20

---

## Maqsad

RawArticle modeli manbalardan olingan xom (qayta ishlanmagan) maqolalarni saqlaydi. Bu maqolalar keyinchalik AI tomonidan qayta ishlanib, Article modeliga aylantiriladi.

---

## Prisma Schema

```prisma
model RawArticle {
  id              String      @id @default(cuid())
  externalId      String?     @unique // ID from original source
  title           String
  description     String?     @db.Text
  content         String?     @db.Text
  url             String      @unique
  imageUrl        String?
  publishedAt     DateTime?
  sourceId        String
  source          NewsSource  @relation(fields: [sourceId], references: [id])
  isProcessed     Boolean     @default(false)
  processedAt     DateTime?
  Article         Article?
  createdAt       DateTime    @default(now())
}
```

---

## Maydonlar

| Maydon | Turi | Tavsif | Majburiy |
|--------|------|--------|----------|
| `id` | String | Unique ID | ✅ Auto |
| `externalId` | String? | Tashqi maqola ID (unique) | ❌ |
| `title` | String | Sarlavha | ✅ |
| `description` | String? | Qisqa tavsif | ❌ |
| `content` | String? | Toliq kontent | ❌ |
| `url` | String | Maqola URL (unique) | ✅ |
| `imageUrl` | String? | Rasm URL | ❌ |
| `publishedAt` | DateTime? | Nashr vaqti | ❌ |
| `sourceId` | String | Manba ID | ✅ |
| `source` | NewsSource | Manba modeli | Auto |
| `isProcessed` | Boolean | Qayta ishlandimi | ✅ Default: false |
| `processedAt` | DateTime? | Qayta ishlangan vaqt | ❌ |
| `Article` | Article? | Yaratilgan maqola | Auto |
| `createdAt` | DateTime | Yaratilgan vaqt | ✅ Auto |

---

## Processing Status

RawArticle oddiy boolean flag ishlatadi:

| isProcessed | Tavsif |
|-------------|--------|
| `false` | Yangi olingan, qayta ishlanmagan (pending) |
| `true` | AI tomonidan qayta ishlangan (processed) |

**Eslatma:** Filtrlangan yoki xatolikli maqolalar ham `isProcessed: true` boladi, lekin `Article` boglangani yoq boladi.

---

## Pipeline Flow

```
[NewsSource] → [Fetch] → [RawArticle (isProcessed: false)]
                              ↓
                    [FilteringService.shouldProcess()]
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
              [AI Process]         [Skip - filtered]
                    ↓
            [Article created]
                    ↓
        [RawArticle.isProcessed = true]
```

---

## Repository Methods

```typescript
// RawArticleRepository

// URL boyicha mavjudligini tekshirish
static async exists(url: string): Promise<boolean>

// Koplab maqola yaratish (dublikatlarni otkazib yuboradi)
static async createMany(articles: RawArticleData[]): Promise<number>

// Qayta ishlanmagan maqolalarni olish (FIFO queue)
static async getUnprocessed(limit: number = 10): Promise<RawArticle[]>

// Qayta ishlangan deb belgilash
static async markAsProcessed(id: string): Promise<void>
```

---

## TypeScript Interfaces

```typescript
// Input DTO
interface RawArticleData {
  externalId?: string;
  title: string;
  description?: string;
  content?: string;
  url: string;
  imageUrl?: string;
  publishedAt?: Date;
  sourceId: string;
}

// Database model
interface RawArticle {
  id: string;
  externalId: string | null;
  title: string;
  description: string | null;
  content: string | null;
  url: string;
  imageUrl: string | null;
  publishedAt: Date | null;
  sourceId: string;
  source?: NewsSource;
  isProcessed: boolean;
  processedAt: Date | null;
  Article?: Article;
  createdAt: Date;
}
```

---

## Dublikat Prevention

Repository avtomatik dublikatlarni tekshiradi:

```typescript
// createMany() ichida
const existingUrls = await prisma.rawArticle.findMany({
  where: {
    url: { in: articles.map(a => a.url) }
  },
  select: { url: true }
});

const existingUrlSet = new Set(existingUrls.map(e => e.url));
const newArticles = articles.filter(a => !existingUrlSet.has(a.url));
```

---

## Bogliq Hujjatlar

- [NewsSource Model](./NEWS_SOURCE.md) - Manbalar
- [Article Model](./ARTICLE.md) - Qayta ishlangan maqolalar
- [RawArticle Repository](../repositories/RAW_ARTICLE_REPO.md) - CRUD operatsiyalar
- [News Pipeline](../services/NEWS_PIPELINE.md) - Processing flow
