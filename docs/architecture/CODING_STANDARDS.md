# Kod Standartlari

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-19

---

## Maqsad

Ushbu hujjat jamoa bo'ylab bir xil kod sifatini ta'minlash uchun standartlar va qoidalarni belgilaydi.

---

## Umumiy Qoidalar

### Fayl Nomlash

| Tur | Pattern | Misol |
|-----|---------|-------|
| **Komponentlar** | PascalCase | `ArticleCard.tsx` |
| **Hooks** | camelCase, use- prefix | `useArticles.ts` |
| **Utilities** | kebab-case | `format-date.ts` |
| **Constants** | kebab-case | `site-config.ts` |
| **Types** | PascalCase | `Article.ts` |
| **Services** | kebab-case, .service suffix | `ai.service.ts` |
| **API Routes** | kebab-case, route.ts | `route.ts` |

### O'zgaruvchi Nomlash

```typescript
// ✅ To'g'ri
const articleList: Article[] = [];
const isLoading = true;
const hasMorePages = false;
const handleClick = () => {};
const MAX_ARTICLES_PER_PAGE = 10;

// ❌ Noto'g'ri
const artList: Article[] = [];      // Qisqartirma
const loading = true;               // Boolean uchun is/has prefix yo'q
const morePages = false;
const click = () => {};             // handle prefix yo'q
const maxArticles = 10;             // SCREAMING_CASE emas
```

---

## TypeScript Qoidalari

### Type vs Interface

```typescript
// ✅ Object shapes uchun interface
interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
}

// ✅ Union types, primitives uchun type
type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
type ArticleId = string;

// ✅ Function types uchun type
type FormatDateFn = (date: Date, locale?: string) => string;
```

### Strict Types

```typescript
// ✅ Explicit return types
function formatDate(date: Date): string {
  return date.toLocaleDateString('uz-UZ');
}

// ✅ Explicit parameter types
async function getArticle(slug: string): Promise<Article> {
  const response = await fetch(`/api/articles/${slug}`);
  return response.json();
}

// ❌ any ishlatmang
function processData(data: any) {}  // XATO!

// ✅ O'rniga unknown yoki aniq tip
function processData(data: unknown) {
  if (isArticle(data)) {
    // ...
  }
}
```

### Null Handling

```typescript
// ✅ Optional chaining
const title = article?.title ?? 'Untitled';

// ✅ Nullish coalescing
const page = searchParams.page ?? 1;

// ❌ OR operator (falsy values bilan muammo)
const page = searchParams.page || 1;  // 0 bo'lsa 1 qaytaradi!
```

---

## React Qoidalari

### Komponent Strukturasi

```typescript
// Tartib: imports → types → component → exports

// 1. Imports (guruhlab)
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { cn } from '@news-app/shared';
import type { Article } from '@news-app/api-types';

import { ArticleCard } from './ArticleCard';
import styles from './ArticleList.module.css';

// 2. Types
interface ArticleListProps {
  articles: Article[];
  className?: string;
  onArticleClick?: (slug: string) => void;
}

// 3. Component
export function ArticleList({
  articles,
  className,
  onArticleClick,
}: ArticleListProps) {
  const t = useTranslations('articles');
  
  if (articles.length === 0) {
    return <p>{t('empty')}</p>;
  }
  
  return (
    <div className={cn('grid gap-4', className)}>
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onClick={() => onArticleClick?.(article.slug)}
        />
      ))}
    </div>
  );
}

// 4. Default export (optional)
export default ArticleList;
```

### Hooks Qoidalari

```typescript
// ✅ Custom hook'lar use- prefix bilan boshlanadi
export function useArticles(category?: string) {
  return useQuery({
    queryKey: ['articles', category],
    queryFn: () => fetchArticles(category),
  });
}

// ✅ Hook'lar komponent ichida, top-level'da chaqiriladi
function ArticlePage() {
  const { data, isLoading } = useArticles();  // ✅ Top-level
  
  // ❌ Shart ichida hook - XATO!
  // if (condition) {
  //   const data = useArticles();
  // }
  
  return <div>{/* ... */}</div>;
}
```

### Event Handlers

```typescript
// ✅ handle prefix
function ArticleCard({ article }: { article: Article }) {
  const handleClick = () => {
    // ...
  };
  
  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    // ...
  };
  
  return (
    <div onClick={handleClick}>
      <button onClick={handleBookmark}>Save</button>
    </div>
  );
}
```

---

## Next.js Qoidalari

### Server vs Client Components

```typescript
// Server Component (default) - async mumkin
// app/articles/page.tsx
export default async function ArticlesPage() {
  const articles = await getArticles();  // Direct DB/API call
  
  return <ArticleList articles={articles} />;
}

// Client Component - interactivity uchun
// components/ArticleActions.tsx
'use client';

import { useState } from 'react';

export function ArticleActions({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);
  
  return (
    <button onClick={() => setSaved(!saved)}>
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
```

### API Routes

```typescript
// app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    
    const articles = await prisma.article.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { publishedAt: 'desc' },
    });
    
    return NextResponse.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error('Articles fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Error Handling

### Try-Catch Pattern

```typescript
// ✅ Service layer'da
async function processArticle(rawId: string): Promise<Article | null> {
  try {
    const raw = await prisma.rawArticle.findUnique({ where: { id: rawId } });
    
    if (!raw) {
      console.warn(`RawArticle not found: ${rawId}`);
      return null;
    }
    
    const processed = await aiService.process(raw);
    return processed;
  } catch (error) {
    console.error(`Failed to process article ${rawId}:`, error);
    throw error;  // Yoki qayta ishlash
  }
}

// ✅ API route'da
export async function GET(request: NextRequest) {
  try {
    const data = await getData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    // Log for debugging
    console.error('API Error:', error);
    
    // User-friendly message
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
```

---

## Import Tartibi

```typescript
// 1. React/Next.js
import { useState, useEffect } from 'react';
import { NextRequest, NextResponse } from 'next/server';
import Link from 'next/link';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 3. Workspace packages
import { formatDate, cn } from '@news-app/shared';
import type { Article } from '@news-app/api-types';

// 4. Local aliases (@/)
import { prisma } from '@/lib/prisma';
import { ArticleCard } from '@/components/ArticleCard';

// 5. Relative imports
import { helper } from './helper';
import styles from './styles.module.css';
```

---

## Comments

```typescript
// ✅ Nima uchun ekanini tushuntirish
// Skip first article because it's shown in hero section
const restArticles = articles.slice(1);

// ✅ TODO format
// TODO(username): Implement caching - Issue #123

// ✅ JSDoc for exported functions
/**
 * Formats a date to localized string
 * @param date - Date object to format
 * @param locale - Locale code (default: 'uz-UZ')
 * @returns Formatted date string
 */
export function formatDate(date: Date, locale = 'uz-UZ'): string {
  return date.toLocaleDateString(locale);
}

// ❌ Nima qilishini aytuvchi comment - keraksiz
// Loop through articles
articles.forEach((article) => {});
```

---

## Bog'liq Hujjatlar

- [Monorepo Structure](./MONOREPO_STRUCTURE.md) - Import qoidalari
- [Git Workflow](../guidelines/GIT_WORKFLOW.md) - Commit standartlari
- [API Endpoints](../api/ENDPOINTS.md) - API qoidalari

