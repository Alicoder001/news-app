# Testing Guidelines

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Test Stack

| Tool | Maqsad |
|------|--------|
| **Vitest** | Unit tests |
| **React Testing Library** | Component tests |
| **Playwright** | E2E tests |
| **MSW** | API mocking |

---

## Test Turlari

### 1. Unit Tests

Alohida funksiyalar va utility'larni test qilish.

\\\	ypescript
// lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate, slugify } from './utils';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2026-01-20');
    expect(formatDate(date)).toBe('20 Yanvar, 2026');
  });

  it('should handle invalid date', () => {
    expect(formatDate(null)).toBe('');
  });
});

describe('slugify', () => {
  it('should convert title to slug', () => {
    expect(slugify("Sun'iy Intellekt")).toBe('suniy-intellekt');
  });
});
\\\

### 2. Component Tests

React komponentlarini test qilish.

\\\	ypescript
// components/ArticleCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ArticleCard } from './ArticleCard';

const mockArticle = {
  id: '1',
  title: 'Test Article',
  slug: 'test-article',
  summary: 'Test summary',
  imageUrl: '/test.jpg',
  publishedAt: new Date(),
  category: { name: 'AI', slug: 'ai' }
};

describe('ArticleCard', () => {
  it('renders article title', () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText('Test Article')).toBeInTheDocument();
  });

  it('renders category badge', () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText('AI')).toBeInTheDocument();
  });

  it('links to article page', () => {
    render(<ArticleCard article={mockArticle} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/articles/test-article');
  });
});
\\\

### 3. API Tests

API route'larni test qilish.

\\\	ypescript
// app/api/articles/route.test.ts
import { describe, it, expect, vi } from 'vitest';
import { GET } from './route';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    article: {
      findMany: vi.fn(),
    },
  },
}));

describe('GET /api/articles', () => {
  it('returns articles list', async () => {
    vi.mocked(prisma.article.findMany).mockResolvedValue([
      { id: '1', title: 'Test', slug: 'test' }
    ]);

    const request = new Request('http://localhost/api/articles');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.articles).toHaveLength(1);
  });
});
\\\

### 4. E2E Tests

Butun user flow'ni test qilish.

\\\	ypescript
// e2e/articles.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Articles', () => {
  test('should display articles list', async ({ page }) => {
    await page.goto('/');
    
    // Wait for articles to load
    await expect(page.getByTestId('articles-list')).toBeVisible();
    
    // Check at least one article exists
    const articles = page.getByTestId('article-card');
    await expect(articles.first()).toBeVisible();
  });

  test('should navigate to article detail', async ({ page }) => {
    await page.goto('/');
    
    // Click first article
    await page.getByTestId('article-card').first().click();
    
    // Check we're on article page
    await expect(page).toHaveURL(/\/articles\/.+/);
    await expect(page.getByTestId('article-title')).toBeVisible();
  });

  test('should filter by category', async ({ page }) => {
    await page.goto('/');
    
    // Click category filter
    await page.getByRole('button', { name: 'AI' }).click();
    
    // Check URL updated
    await expect(page).toHaveURL(/category=ai/);
  });
});
\\\

---

## Test Commands

\\\ash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui
\\\

---

## Mocking

### API Mocking (MSW)

\\\	ypescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/articles', () => {
    return HttpResponse.json({
      articles: [
        { id: '1', title: 'Mock Article', slug: 'mock' }
      ]
    });
  }),
];

// mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
\\\

### Database Mocking

\\\	ypescript
// Use vi.mock for Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    article: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));
\\\

---

## Test Organization

\\\
src/
├── components/
│   ├── ArticleCard.tsx
│   └── ArticleCard.test.tsx      # Co-located
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
└── app/
    └── api/
        └── articles/
            ├── route.ts
            └── route.test.ts

e2e/                              # E2E tests separate
├── articles.spec.ts
├── search.spec.ts
└── fixtures/
    └── articles.json
\\\

---

## Coverage Goals

| Type | Minimum | Target |
|------|---------|--------|
| Unit | 60% | 80% |
| Component | 50% | 70% |
| E2E | Critical paths | All user flows |

---

## Best Practices

### DO ✅

\\\	ypescript
// Test behavior, not implementation
it('should show error message when API fails', async () => {
  server.use(
    http.get('/api/articles', () => HttpResponse.error())
  );
  render(<ArticleList />);
  await expect(screen.findByText(/error/i)).resolves.toBeInTheDocument();
});

// Use descriptive test names
describe('ArticleCard', () => {
  it('displays formatted publish date', () => {});
  it('truncates long titles with ellipsis', () => {});
});

// Test edge cases
it('handles empty article list', () => {});
it('handles missing image', () => {});
\\\

### DON'T ❌

\\\	ypescript
// Don't test implementation details
it('should call useState', () => {}); // ❌

// Don't use vague names
it('works', () => {}); // ❌

// Don't skip tests without reason
it.skip('should work', () => {}); // ❌
\\\

---

## Bog'liq Hujjatlar

- [Coding Guidelines](./CODING_GUIDELINES.md) - Kod standartlari
- [Deployment](./DEPLOYMENT.md) - CI/CD pipeline
