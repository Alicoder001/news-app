# Repositories

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Umumiy Korinish

Repository pattern - database operatsiyalarini abstraksiya qilish uchun ishlatiladi.

---

## Hujjatlar

| Hujjat | Tavsif |
|--------|--------|
| [NEWS_SOURCE_REPO.md](./NEWS_SOURCE_REPO.md) | Manbalar CRUD |
| [RAW_ARTICLE_REPO.md](./RAW_ARTICLE_REPO.md) | Xom maqolalar CRUD |

---

## Fayl Joylashuvi

```
apps/web/src/lib/news/repositories/
├── news-source.repository.ts
└── raw-article.repository.ts
```

---

## Pattern

```typescript
// Base repository interface
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findMany(filter?: Filter): Promise<T[]>;
  create(data: CreateDTO): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T>;
  delete(id: string): Promise<void>;
}
```
