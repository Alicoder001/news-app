# NewsSource Repository

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Maqsad

NewsSource Repository yangilik manbalarini boshqarish uchun CRUD operatsiyalarini taqdim etadi.

---

## Fayl Joylashuvi

```
apps/web/src/lib/news/repositories/news-source.repository.ts
```

---

## Asosiy Funksiyalar

### findAll

Barcha manbalarni olish.

```typescript
interface FindAllOptions {
  isActive?: boolean;
  provider?: string;
  orderBy?: 'priority' | 'name' | 'lastFetchAt';
}

async function findAll(options?: FindAllOptions): Promise<NewsSource[]>
```

### findById

ID boyicha manba olish.

```typescript
async function findById(id: string): Promise<NewsSource | null>
```

### findBySlug

Slug boyicha manba olish.

```typescript
async function findBySlug(slug: string): Promise<NewsSource | null>
```

### create

Yangi manba yaratish.

```typescript
interface CreateNewsSourceDTO {
  name: string;
  slug: string;
  url: string;
  feedUrl?: string;
  provider: string;
  apiKey?: string;
  category?: string;
  language?: string;
  isActive?: boolean;
  priority?: number;
}

async function create(data: CreateNewsSourceDTO): Promise<NewsSource>
```

### update

Manbani yangilash.

```typescript
interface UpdateNewsSourceDTO {
  name?: string;
  url?: string;
  feedUrl?: string;
  apiKey?: string;
  category?: string;
  isActive?: boolean;
  priority?: number;
}

async function update(id: string, data: UpdateNewsSourceDTO): Promise<NewsSource>
```

### delete

Manbani ochirish.

```typescript
async function delete(id: string): Promise<void>
```

### updateLastFetch

Oxirgi fetch vaqtini yangilash.

```typescript
async function updateLastFetch(id: string): Promise<void>
```

---

## Foydalanish

```typescript
import { newsSourceRepository } from '@/lib/news/repositories';

// Faol manbalarni olish
const activeSources = await newsSourceRepository.findAll({ 
  isActive: true,
  orderBy: 'priority'
});

// Yangi manba qoshish
const source = await newsSourceRepository.create({
  name: 'TechCrunch',
  slug: 'techcrunch',
  url: 'https://techcrunch.com',
  feedUrl: 'https://techcrunch.com/feed/',
  provider: 'rss',
  category: 'tech',
});
```

---

## Bogliq Hujjatlar

- [NewsSource Model](../models/NEWS_SOURCE.md) - Data model
- [News Pipeline](../services/NEWS_PIPELINE.md) - Pipeline integration
