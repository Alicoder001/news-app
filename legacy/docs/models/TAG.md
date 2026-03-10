# Tag Model

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Maqsad

Tag modeli maqolalarga teglar (kalit sozlar) biriktirish uchun ishlatiladi. Maqolalar bir nechta tegga ega bolishi mumkin.

---

## Prisma Schema

```prisma
model Tag {
  id        String    @id @default(cuid())
  name      String    @unique
  slug      String    @unique
  articles  Article[]
  createdAt DateTime  @default(now())
  
  @@index([slug])
}
```

---

## Maydonlar

| Maydon | Turi | Tavsif | Majburiy |
|--------|------|--------|----------|
| `id` | String | Unique ID (CUID) | ✅ Auto |
| `name` | String | Teg nomi (unique) | ✅ |
| `slug` | String | URL-friendly nom | ✅ |
| `articles` | Article[] | Bogliq maqolalar | Auto |
| `createdAt` | DateTime | Yaratilgan vaqt | ✅ Auto |

---

## Namuna Teglar

| Name | Slug |
|------|------|
| OpenAI | openai |
| ChatGPT | chatgpt |
| React | react |
| Next.js | nextjs |
| TypeScript | typescript |
| Python | python |
| Machine Learning | machine-learning |

---

## TypeScript Interface

```typescript
interface Tag {
  id: string;
  name: string;
  slug: string;
  articles?: Article[];
  createdAt: Date;
}
```

---

## Maqola bilan Boglash

```typescript
// Maqola yaratishda teglar bilan
await prisma.article.create({
  data: {
    title: "...",
    // ... boshqa maydonlar
    tags: {
      connectOrCreate: [
        {
          where: { slug: "openai" },
          create: { name: "OpenAI", slug: "openai" }
        },
        {
          where: { slug: "chatgpt" },
          create: { name: "ChatGPT", slug: "chatgpt" }
        }
      ]
    }
  }
});
```

---

## Bogliq Hujjatlar

- [Article Model](./ARTICLE.md) - Maqola modeli
