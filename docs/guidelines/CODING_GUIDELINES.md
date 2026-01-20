# Coding Guidelines

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Umumiy Qoidalar

### 1. TypeScript

- **Strict mode** har doim yoqilgan
- **any** ishlatmang - \unknown\ yoki aniq type
- **Interface** vs **Type**: Object shapes uchun interface, unions uchun type
- **Enum** o'rniga \s const\ objects

\\\	ypescript
// ❌ Yomon
const data: any = fetchData();

// ✅ Yaxshi
const data: unknown = fetchData();
if (isArticle(data)) {
  // data is Article
}
\\\

### 2. Naming Conventions

| Element | Convention | Misol |
|---------|------------|-------|
| Files (components) | PascalCase | \ArticleCard.tsx\ |
| Files (utilities) | kebab-case | \ormat-date.ts\ |
| Variables | camelCase | \rticleCount\ |
| Constants | SCREAMING_SNAKE | \MAX_ARTICLES\ |
| Types/Interfaces | PascalCase | \ArticleResponse\ |
| React Components | PascalCase | \ArticleList\ |
| Hooks | camelCase + use | \useArticles\ |

### 3. File Structure

\\\	ypescript
// 1. Imports (external)
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Imports (internal)
import { ArticleCard } from '@/components';
import { formatDate } from '@/lib/utils';

// 3. Types
interface Props {
  articleId: string;
}

// 4. Constants
const MAX_ITEMS = 10;

// 5. Component
export function ArticleList({ articleId }: Props) {
  // ...
}

// 6. Helpers (if small, otherwise separate file)
function formatArticle(article: Article) {
  // ...
}
\\\

---

## React / Next.js

### 1. Components

\\\	ypescript
// ✅ Function components with explicit return type
export function ArticleCard({ article }: Props): JSX.Element {
  return <div>...</div>;
}

// ✅ Use 'use client' only when needed
'use client';

export function InteractiveButton() {
  const [count, setCount] = useState(0);
  // ...
}
\\\

### 2. Server vs Client

| Server Component | Client Component |
|-----------------|------------------|
| Data fetching | Interactivity (onClick) |
| Database access | useState, useEffect |
| Sensitive operations | Browser APIs |
| Large dependencies | Real-time updates |

### 3. Data Fetching

\\\	ypescript
// Server Component - Direct DB access
async function ArticlePage({ slug }: Props) {
  const article = await prisma.article.findUnique({
    where: { slug }
  });
  return <Article data={article} />;
}

// Client Component - API call
function ArticleList() {
  const { data } = useQuery({
    queryKey: ['articles'],
    queryFn: () => fetch('/api/articles').then(r => r.json())
  });
}
\\\

---

## API Routes

### 1. Structure

\\\	ypescript
// app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const articles = await getArticles();
    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
\\\

### 2. Error Handling

\\\	ypescript
// Consistent error response
interface ErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
}

// Always return proper status codes
// 200 - Success
// 201 - Created
// 400 - Bad Request
// 401 - Unauthorized
// 404 - Not Found
// 500 - Server Error
\\\

---

## Database (Prisma)

### 1. Queries

\\\	ypescript
// ✅ Select only needed fields
const articles = await prisma.article.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    // Don't select content if not needed
  }
});

// ✅ Use pagination
const articles = await prisma.article.findMany({
  take: 20,
  skip: page * 20,
  orderBy: { publishedAt: 'desc' }
});
\\\

### 2. Transactions

\\\	ypescript
// ✅ Use transactions for multiple operations
await prisma.\([
  prisma.rawArticle.update({
    where: { id },
    data: { status: 'processed' }
  }),
  prisma.article.create({
    data: articleData
  })
]);
\\\

---

## Imports

### Path Aliases

\\\	ypescript
// tsconfig.json paths
{
  "@/*": ["./src/*"],
  "@/components": ["./src/components"],
  "@/lib": ["./src/lib"]
}

// Usage
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
\\\

### Import Order

1. React / Next.js
2. External packages
3. Internal packages (@aishunos/*)
4. Internal modules (@/*)
5. Relative imports
6. Types

---

## Comments

\\\	ypescript
// ✅ Explain WHY, not WHAT
// Rate limit to 60 requests/min to avoid API throttling
const rateLimiter = new RateLimiter({ max: 60 });

// ✅ JSDoc for public APIs
/**
 * Fetches articles from the database with pagination.
 * @param page - Page number (0-indexed)
 * @param limit - Items per page (default: 20)
 * @returns Paginated articles with total count
 */
export async function getArticles(page = 0, limit = 20) {
  // ...
}

// ❌ Avoid obvious comments
// Set count to 0
const count = 0;
\\\

---

## ESLint Rules

Asosiy qoidalar \.eslintrc\ da:

\\\json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["warn", { "allow": ["error", "warn"] }]
  }
}
\\\

---

## Bog'liq Hujjatlar

- [Architecture](../architecture/CODING_STANDARDS.md) - Arxitektura standartlari
- [Git Workflow](./GIT_WORKFLOW.md) - Git qoidalari
