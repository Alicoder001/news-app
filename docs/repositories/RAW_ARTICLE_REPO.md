# RawArticle Repository

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Maqsad

RawArticle Repository xom maqolalar bilan ishlash uchun CRUD va qoshimcha operatsiyalarni taqdim etadi.

---

## Fayl Joylashuvi

```
apps/web/src/lib/news/repositories/raw-article.repository.ts
```

---

## Asosiy Funksiyalar

### findPending

Qayta ishlanmagan maqolalarni olish.

```typescript
interface FindPendingOptions {
  limit?: number;
  sourceId?: string;
}

async function findPending(options?: FindPendingOptions): Promise<RawArticle[]>
```

### findByUrl

URL boyicha maqola topish (dublikat tekshirish).

```typescript
async function findByUrl(url: string): Promise<RawArticle | null>
```

### create

Yangi xom maqola yaratish.

```typescript
interface CreateRawArticleDTO {
  sourceId: string;
  url: string;
  title: string;
  description?: string;
  content?: string;
  author?: string;
  imageUrl?: string;
  publishedAt?: Date;
  externalId?: string;
  metadata?: Record<string, unknown>;
}

async function create(data: CreateRawArticleDTO): Promise<RawArticle>
```

### createMany

Bir nechta maqola yaratish.

```typescript
async function createMany(data: CreateRawArticleDTO[]): Promise<number>
```

### updateStatus

Maqola statusini yangilash.

```typescript
type RawArticleStatus = 'pending' | 'processing' | 'processed' | 'failed' | 'duplicate' | 'filtered';

async function updateStatus(
  id: string, 
  status: RawArticleStatus,
  extra?: {
    articleId?: string;
    filterReason?: string;
    relevanceScore?: number;
  }
): Promise<RawArticle>
```

### markAsProcessed

Muvaffaqiyatli qayta ishlangan.

```typescript
async function markAsProcessed(id: string, articleId: string): Promise<void>
```

### markAsFailed

Xatolik bilan tugagan.

```typescript
async function markAsFailed(id: string, error: string): Promise<void>
```

### markAsFiltered

Filtrlangan.

```typescript
async function markAsFiltered(id: string, reason: string): Promise<void>
```

---

## Foydalanish

```typescript
import { rawArticleRepository } from '@/lib/news/repositories';

// Pending maqolalarni olish
const pending = await rawArticleRepository.findPending({ limit: 10 });

// Dublikat tekshirish
const existing = await rawArticleRepository.findByUrl(article.url);
if (existing) {
  console.log('Duplicate found');
  return;
}

// Yangi maqola saqlash
const raw = await rawArticleRepository.create({
  sourceId: source.id,
  url: article.url,
  title: article.title,
  content: article.content,
});

// Status yangilash
await rawArticleRepository.markAsProcessed(raw.id, newArticle.id);
```

---

## Statistika

```typescript
interface RawArticleStats {
  total: number;
  byStatus: Record<RawArticleStatus, number>;
  todayFetched: number;
  todayProcessed: number;
}

async function getStats(): Promise<RawArticleStats>
```

---

## Bogliq Hujjatlar

- [RawArticle Model](../models/RAW_ARTICLE.md) - Data model
- [News Pipeline](../services/NEWS_PIPELINE.md) - Pipeline flow
- [Filtering Service](../services/FILTERING_SERVICE.md) - Status updates
