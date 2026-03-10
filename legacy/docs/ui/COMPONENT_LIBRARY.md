# Component Library

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Asosiy Komponentlar

### Layout Components

#### Header
\\\	sx
import { Header } from '@/components/header';

<Header />
\\\

**Props:** Yo'q (global state dan oladi)

**Tarkibi:**
- Logo
- Navigation links
- Language switcher
- Theme toggle

---

#### Footer
\\\	sx
import { Footer } from '@/components/footer';

<Footer />
\\\

---

### Article Components

#### ArticleCard
Maqola kartasi - ro'yxat ko'rinishida.

\\\	sx
import { ArticleCard } from '@/components/article-card';

<ArticleCard 
  article={{
    id: '1',
    title: "Sun'iy Intellekt",
    slug: 'suniy-intellekt',
    summary: 'Qisqa mazmun...',
    imageUrl: '/images/ai.jpg',
    publishedAt: new Date(),
    category: { name: 'AI', slug: 'ai' }
  }}
/>
\\\

**Props:**
| Prop | Type | Required |
|------|------|----------|
| \rticle\ | Article | ✅ |
| \ariant\ | 'default' \| 'compact' | ❌ |

---

#### CategoryBadge
Kategoriya belgisi.

\\\	sx
import { CategoryBadge } from '@/components/category-badge';

<CategoryBadge category={{ name: 'AI', slug: 'ai', color: '#8B5CF6' }} />
\\\

---

#### ShareButtons
Ijtimoiy tarmoqlarga ulashish tugmalari.

\\\	sx
import { ShareButtons } from '@/components/share-buttons';

<ShareButtons 
  url="https://aishunos.uz/articles/test"
  title="Maqola sarlavhasi"
/>
\\\

---

### Navigation Components

#### CategoryNav
Kategoriya navigatsiyasi.

\\\	sx
import { CategoryNav } from '@/components/category-nav';

<CategoryNav 
  categories={categories}
  activeCategory="ai"
/>
\\\

---

#### Pagination
Sahifalash komponenti.

\\\	sx
import { Pagination } from '@/components/pagination';

<Pagination 
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => setPage(page)}
/>
\\\

---

### UI Components (shadcn)

#### Button
\\\	sx
import { Button } from '@/components/ui/button';

<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
\\\

---

#### Card
\\\	sx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
\\\

---

#### Badge
\\\	sx
import { Badge } from '@/components/ui/badge';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
\\\

---

### Telegram Mini App Components

#### TgCategoryNav
Telegram uchun optimallashtirilgan kategoriya nav.

\\\	sx
import { TgCategoryNav } from '@/components/tg-category-nav';

<TgCategoryNav categories={categories} />
\\\

---

#### TgLanguageSelector
Telegram ichida til tanlash.

\\\	sx
import { TgLanguageSelector } from '@/components/tg-language-selector';

<TgLanguageSelector />
\\\

---

## Component Guidelines

### Naming
- PascalCase: \ArticleCard\, \CategoryBadge\
- File: kebab-case: \rticle-card.tsx\

### Props
- TypeScript interfaces
- Default values where sensible
- JSDoc comments for complex props

### Styling
- Tailwind classes
- \cn()\ utility for conditional classes
- CSS variables for theming

\\\	sx
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  className
)}>
\\\

---

## Bog'liq Hujjatlar

- [Design Tokens](./DESIGN_TOKENS.md) - Ranglar, spacing
- [Coding Guidelines](../guidelines/CODING_GUIDELINES.md) - Kod standartlari
