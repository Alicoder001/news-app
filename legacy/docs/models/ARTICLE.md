# Article Model

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-19

---

## Maqsad

`Article` modeli AI orqali qayta ishlangan va nashr qilingan maqolalarni saqlaydi. Bu asosiy kontent modeli hisoblanadi.

---

## Schema

```prisma
model Article {
  id              String      @id @default(cuid())
  slug            String      @unique
  title           String
  summary         String      @db.Text
  content         String      @db.Text
  imageUrl        String?
  sourceUrl       String
  
  // Classification
  difficulty      Difficulty  @default(INTERMEDIATE)
  importance      Importance  @default(MEDIUM)
  
  // Stats
  viewCount       Int         @default(0)
  
  // Relations
  categoryId      String
  category        Category    @relation(fields: [categoryId], references: [id])
  tags            Tag[]
  
  // Source tracking
  rawArticleId    String?     @unique
  rawArticle      RawArticle? @relation(fields: [rawArticleId], references: [id])
  
  // Telegram
  telegramSentAt  DateTime?
  telegramMsgId   String?
  
  // Timestamps
  publishedAt     DateTime    @default(now())
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@index([categoryId])
  @@index([publishedAt])
  @@index([importance])
  @@map("articles")
}
```

---

## Maydonlar

| Maydon | Tur | Required | Default | Tavsif |
|--------|-----|----------|---------|--------|
| `id` | String | ✅ | cuid() | Unique identifier |
| `slug` | String | ✅ | - | URL-friendly identifikator |
| `title` | String | ✅ | - | Maqola sarlavhasi (O'zbekcha) |
| `summary` | String | ✅ | - | Qisqa tavsif (150-200 so'z) |
| `content` | String | ✅ | - | To'liq kontent (Markdown) |
| `imageUrl` | String | ❌ | null | Asosiy rasm URL |
| `sourceUrl` | String | ✅ | - | Asl maqola havolasi |
| `difficulty` | Difficulty | ✅ | INTERMEDIATE | Qiyinlik darajasi |
| `importance` | Importance | ✅ | MEDIUM | Muhimlik darajasi |
| `viewCount` | Int | ✅ | 0 | Ko'rishlar soni |
| `categoryId` | String | ✅ | - | Kategoriya FK |
| `rawArticleId` | String | ❌ | null | Xom maqola FK |
| `telegramSentAt` | DateTime | ❌ | null | Telegram'ga yuborilgan vaqt |
| `telegramMsgId` | String | ❌ | null | Telegram message ID |
| `publishedAt` | DateTime | ✅ | now() | Nashr vaqti |
| `createdAt` | DateTime | ✅ | now() | Yaratilgan vaqt |
| `updatedAt` | DateTime | ✅ | auto | Yangilangan vaqt |

---

## Relations

### Category (Many-to-One)

```typescript
// Maqola bitta kategoriyaga tegishli
const article = await prisma.article.findUnique({
  where: { slug: 'example' },
  include: { category: true },
});

// article.category = { id, name, slug, color, icon }
```

### Tags (Many-to-Many)

```typescript
// Maqolaning teglari
const article = await prisma.article.findUnique({
  where: { slug: 'example' },
  include: { tags: true },
});

// article.tags = [{ id, name, slug }, ...]
```

### RawArticle (One-to-One)

```typescript
// Asl xom maqola
const article = await prisma.article.findUnique({
  where: { slug: 'example' },
  include: { rawArticle: true },
});
```

---

## Queries

### Barcha Maqolalar (Pagination)

```typescript
const articles = await prisma.article.findMany({
  where: {
    publishedAt: { lte: new Date() },
  },
  include: {
    category: {
      select: { id: true, name: true, slug: true, color: true },
    },
    tags: {
      select: { id: true, name: true, slug: true },
    },
  },
  orderBy: { publishedAt: 'desc' },
  skip: (page - 1) * limit,
  take: limit,
});
```

### Kategoriya bo'yicha

```typescript
const articles = await prisma.article.findMany({
  where: {
    category: { slug: 'ai' },
  },
  orderBy: { publishedAt: 'desc' },
});
```

### Featured Maqolalar

```typescript
const featured = await prisma.article.findMany({
  where: {
    importance: { in: ['CRITICAL', 'HIGH'] },
  },
  orderBy: [
    { importance: 'desc' },
    { publishedAt: 'desc' },
  ],
  take: 5,
});
```

### Telegram'ga Yuborilmaganlar

```typescript
const pending = await prisma.article.findMany({
  where: {
    telegramSentAt: null,
  },
  orderBy: [
    { importance: 'desc' },
    { publishedAt: 'asc' },
  ],
  take: 3,
});
```

---

## Mutations

### Maqola Yaratish

```typescript
const article = await prisma.article.create({
  data: {
    slug: 'openai-gpt-5',
    title: 'OpenAI GPT-5 Chiqarildi',
    summary: 'OpenAI kompaniyasi...',
    content: '## Kirish\n\nOpenAI...',
    sourceUrl: 'https://...',
    difficulty: 'INTERMEDIATE',
    importance: 'HIGH',
    category: { connect: { slug: 'ai' } },
    tags: {
      connectOrCreate: [
        {
          where: { slug: 'openai' },
          create: { name: 'OpenAI', slug: 'openai' },
        },
      ],
    },
    rawArticle: { connect: { id: rawArticleId } },
  },
});
```

### View Count Oshirish

```typescript
await prisma.article.update({
  where: { slug: 'example' },
  data: { viewCount: { increment: 1 } },
});
```

### Telegram Sent Yangilash

```typescript
await prisma.article.update({
  where: { id: articleId },
  data: {
    telegramSentAt: new Date(),
    telegramMsgId: '12345',
  },
});
```

---

## Indexes

| Index | Maydonlar | Maqsad |
|-------|-----------|--------|
| Primary | `id` | Unique lookup |
| Unique | `slug` | URL lookup |
| Index | `categoryId` | Category filter |
| Index | `publishedAt` | Date sorting |
| Index | `importance` | Featured queries |

---

## Validation

```typescript
import { z } from 'zod';

const articleSchema = z.object({
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/),
  title: z.string().min(10).max(200),
  summary: z.string().min(50).max(500),
  content: z.string().min(100),
  sourceUrl: z.string().url(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  importance: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
});
```

---

## Bog'liq Hujjatlar

- [Category Model](./CATEGORY.md) - Kategoriya
- [RawArticle Model](./RAW_ARTICLE.md) - Xom maqola
- [API Endpoints](../api/ENDPOINTS.md) - Article API

