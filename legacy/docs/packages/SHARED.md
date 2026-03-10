# @aishunos/shared

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Maqsad

Barcha apps uchun umumiy konstantalar va utility funksiyalar.

---

## Fayl Joylashuvi

```
packages/shared/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── constants/
    │   ├── index.ts
    │   └── site.ts
    └── utils/
        └── index.ts
```

---

## Constants

### Site Constants

```typescript
// constants/site.ts
export const SITE_NAME = 'Aishunos';
export const SITE_URL = 'https://aishunos.uz';
export const SITE_DESCRIPTION = "O'zbekcha texnologiya yangiliklari";

export const SOCIAL_LINKS = {
  telegram: 'https://t.me/aishunos',
  github: 'https://github.com/aishunos',
  twitter: 'https://twitter.com/aishunos',
};

export const CATEGORIES = [
  { slug: 'ai', name: "Sun'iy Intellekt", icon: '🤖', color: '#8B5CF6' },
  { slug: 'web', name: 'Web Dasturlash', icon: '🌐', color: '#3B82F6' },
  { slug: 'mobile', name: 'Mobil Ilovalar', icon: '📱', color: '#10B981' },
  { slug: 'cloud', name: 'Cloud & DevOps', icon: '☁️', color: '#6366F1' },
  { slug: 'security', name: 'Xavfsizlik', icon: '🔒', color: '#EF4444' },
  { slug: 'data', name: 'Data Science', icon: '📊', color: '#F59E0B' },
] as const;
```

---

## Utilities

### formatDate

```typescript
function formatDate(date: Date | string, locale?: string): string
```

### slugify

```typescript
function slugify(text: string): string
```

### truncate

```typescript
function truncate(text: string, length: number): string
```

---

## Foydalanish

```typescript
import { 
  SITE_NAME, 
  CATEGORIES,
  formatDate,
  slugify 
} from '@aishunos/shared';

// Constants
console.log(SITE_NAME); // "Aishunos"

// Get category
const ai = CATEGORIES.find(c => c.slug === 'ai');

// Format date
const formatted = formatDate(new Date()); // "20 Yanvar, 2026"

// Slugify
const slug = slugify("Sun'iy Intellekt"); // "suniy-intellekt"
```

---

## Bogliq Hujjatlar

- [Monorepo Structure](../architecture/MONOREPO_STRUCTURE.md)
