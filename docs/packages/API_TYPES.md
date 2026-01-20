# @aishunos/api-types

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Maqsad

API request va response uchun TypeScript type definitions. Frontend va Backend orasida type safety.

---

## Fayl Joylashuvi

```
packages/api-types/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── article.ts
    └── responses.ts
```

---

## Article Types

```typescript
// article.ts

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string | null;
  sourceUrl: string;
  sourceName: string;
  author: string | null;
  publishedAt: string;  // ISO date string
  createdAt: string;
  category: Category;
  tags: Tag[];
  viewCount: number;
  isFeatured: boolean;
}

export interface ArticleListItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  imageUrl: string | null;
  publishedAt: string;
  category: Category;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
}
```

---

## Response Types

```typescript
// responses.ts

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Specific responses
export type ArticlesResponse = PaginatedResponse<ArticleListItem>;

export interface ArticleResponse {
  article: Article;
  related: ArticleListItem[];
}

export interface CategoriesResponse {
  categories: Category[];
}
```

---

## Request Types

```typescript
// requests.ts

export interface ArticlesQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
}

export interface CreateArticleDTO {
  title: string;
  summary: string;
  content: string;
  categoryId: string;
  imageUrl?: string;
  sourceUrl: string;
  sourceName: string;
  tags?: string[];
}
```

---

## Foydalanish

### Web App

```typescript
import type { Article, ArticlesResponse } from '@aishunos/api-types';

async function getArticles(): Promise<ArticlesResponse> {
  const res = await fetch('/api/articles');
  return res.json();
}

function ArticleCard({ article }: { article: Article }) {
  return <div>{article.title}</div>;
}
```

### Mobile App

```typescript
import type { ArticleListItem } from '@aishunos/api-types';

const { data } = useQuery<ArticleListItem[]>({
  queryKey: ['articles'],
  queryFn: fetchArticles,
});
```

---

## Bogliq Hujjatlar

- [API Endpoints](../api/ENDPOINTS.md) - API documentation
- [Article Model](../models/ARTICLE.md) - Database model
