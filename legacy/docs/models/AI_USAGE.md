# AI Usage Model

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Maqsad

AIUsage modeli OpenAI API ishlatilishini kuzatadi - tokenlar, xarajatlar va operatsiyalar.

---

## Prisma Schema

```prisma
model AIUsage {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  
  // Model info
  model       String   // gpt-4o-mini, gpt-4o, etc.
  operation   String   // article_process, summary, categorize
  
  // Token counts
  promptTokens     Int
  completionTokens Int
  totalTokens      Int
  
  // Cost in USD
  cost        Float
  
  // Reference to processed article (optional)
  articleId   String?
  
  @@index([createdAt])
  @@index([model])
}
```

---

## Maydonlar

| Maydon | Turi | Tavsif | Majburiy |
|--------|------|--------|----------|
| `id` | String | Unique ID | ✅ Auto |
| `createdAt` | DateTime | Yaratilgan vaqt | ✅ Auto |
| `model` | String | AI model nomi | ✅ |
| `operation` | String | Operatsiya turi | ✅ |
| `promptTokens` | Int | Kiritish tokenlari | ✅ |
| `completionTokens` | Int | Chiqish tokenlari | ✅ |
| `totalTokens` | Int | Jami tokenlar | ✅ |
| `cost` | Float | Xarajat (USD) | ✅ |
| `articleId` | String? | Bogliq maqola ID | ❌ |

---

## Operation Turlari

| Operation | Tavsif |
|-----------|--------|
| `article_process` | Toliq maqola qayta ishlash |
| `translate` | Tarjima |
| `summarize` | Xulosa yaratish |
| `categorize` | Kategoriya aniqlash |
| `tag_extract` | Teg ajratish |

---

## Model Narxlari (2024)

| Model | Input (1M) | Output (1M) |
|-------|------------|-------------|
| gpt-4o-mini | $0.15 | $0.60 |
| gpt-4o | $2.50 | $10.00 |
| gpt-4-turbo | $10.00 | $30.00 |
| gpt-3.5-turbo | $0.50 | $1.50 |

---

## Xarajat Hisoblash

```typescript
function calculateCost(model: string, usage: UsageData): number {
  const pricing = MODEL_PRICING[model];
  
  const inputCost = (usage.promptTokens * pricing.input) / 1_000_000;
  const outputCost = (usage.completionTokens * pricing.output) / 1_000_000;
  
  return inputCost + outputCost;
}
```

---

## TypeScript Interface

```typescript
interface AIUsage {
  id: string;
  createdAt: Date;
  model: string;
  operation: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  articleId?: string;
}
```

---

## Bogliq Hujjatlar

- [AI Service](../services/AI_SERVICE.md) - AI integratsiya
- [Usage Tracker](../services/USAGE_TRACKER.md) - Tracking service
