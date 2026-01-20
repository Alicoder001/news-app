# Cron Jobs

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-19

---

## Maqsad

Aishunos platformasida avtomatik vazifalar Vercel Cron orqali bajariladi. Ushbu hujjat barcha cron job'larni tavsiflaydi.

---

## Cron Jobs Ro'yxati

| Job | Endpoint | Schedule | Vazifasi |
|-----|----------|----------|----------|
| News Sync | `/api/cron/news` | Har 1 daqiqa | Yangiliklar sync + AI process |
| Telegram Post | `/api/cron/telegram` | Har 1 daqiqa | Telegram kanalga posting |

---

## 1. News Sync Job

### Endpoint
```
GET /api/cron/news
```

### Schedule
```
*/1 * * * *  (Har 1 daqiqada)
```

### Vazifasi

1. **Sync bosqichi:** News API'lardan yangi maqolalarni olish
2. **Filter bosqichi:** Dublikatlarni aniqlash
3. **Process bosqichi:** AI orqali tarjima va tahlil
4. **Publish bosqichi:** Article yaratish

### Oqim Diagrammasi

```
┌─────────────┐
│  Cron Trigger│
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│ NewsManager │────▶│ NewsAPI.ai  │
│   .sync()   │     │ TheNewsAPI  │
└──────┬──────┘     └─────────────┘
       │
       ▼
┌─────────────┐
│ RawArticle  │  (Xom maqolalar saqlanadi)
│  Database   │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│ AIService   │────▶│   OpenAI    │
│  .process() │     │ GPT-4o-mini │
└──────┬──────┘     └─────────────┘
       │
       ▼
┌─────────────┐
│  Article    │  (Tayyor maqolalar)
│  Database   │
└─────────────┘
```

### Konfiguratsiya

```typescript
// apps/web/src/app/api/cron/news/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { NewsPipeline } from '@/lib/news/services/news-pipeline.service';

export async function GET(request: NextRequest) {
  // Cron secret tekshiruvi
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const pipeline = new NewsPipeline();
    const result = await pipeline.run({
      syncLimit: 20,
      processLimit: 5,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json(
      { success: false, error: 'Pipeline failed' },
      { status: 500 }
    );
  }
}
```

### Response

```json
{
  "success": true,
  "data": {
    "pipelineRunId": "run_123",
    "sync": {
      "total": 20,
      "new": 15,
      "duplicates": 5
    },
    "process": {
      "total": 5,
      "success": 4,
      "filtered": 1
    },
    "ai": {
      "tokensUsed": 12500,
      "cost": "$0.0125"
    },
    "duration": "45s"
  }
}
```

---

## 2. Telegram Post Job

### Endpoint
```
GET /api/cron/telegram
```

### Schedule
```
*/1 * * * *  (Har 1 daqiqada)
```

### Vazifasi

1. Telegram kanalga yuborilmagan maqolalarni topish
2. Importance bo'yicha tartiblash (CRITICAL > HIGH > MEDIUM)
3. Telegram Bot API orqali yuborish
4. `telegramSentAt` maydonini yangilash

### Oqim Diagrammasi

```
┌─────────────┐
│  Cron Trigger│
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│ SELECT * FROM Article       │
│ WHERE telegramSentAt IS NULL│
│ ORDER BY importance DESC    │
│ LIMIT 3                     │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│ Telegram    │────▶│ Telegram    │
│  Service    │     │  Bot API    │
└──────┬──────┘     └─────────────┘
       │
       ▼
┌─────────────────────────────┐
│ UPDATE Article              │
│ SET telegramSentAt = NOW()  │
└─────────────────────────────┘
```

### Konfiguratsiya

```typescript
// apps/web/src/app/api/cron/telegram/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { TelegramService } from '@/lib/news/services/telegram.service';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const telegram = new TelegramService();
    const result = await telegram.sendPendingArticles({
      limit: 3,
      delayBetween: 2000, // 2 soniya oraliq
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Telegram cron failed:', error);
    return NextResponse.json(
      { success: false, error: 'Telegram posting failed' },
      { status: 500 }
    );
  }
}
```

### Response

```json
{
  "success": true,
  "data": {
    "sent": 3,
    "failed": 0,
    "articles": [
      { "slug": "article-1", "telegramMessageId": 12345 },
      { "slug": "article-2", "telegramMessageId": 12346 },
      { "slug": "article-3", "telegramMessageId": 12347 }
    ]
  }
}
```

---

## Vercel Cron Konfiguratsiya

### `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/news",
      "schedule": "*/1 * * * *"
    },
    {
      "path": "/api/cron/telegram",
      "schedule": "*/1 * * * *"
    }
  ]
}
```

### Environment Variables

| Variable | Tavsif |
|----------|--------|
| `CRON_SECRET` | Cron authorization token |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot API token |
| `TELEGRAM_CHANNEL_ID` | Kanal ID (@channel yoki -100xxx) |
| `OPENAI_API_KEY` | OpenAI API key |

---

## Monitoring

### Pipeline Run Table

Har bir cron run `PipelineRun` jadvaliga yoziladi:

```sql
SELECT 
  id,
  status,
  articlesProcessed,
  articlesFailed,
  tokensUsed,
  totalCost,
  duration,
  startedAt,
  completedAt
FROM PipelineRun
ORDER BY startedAt DESC
LIMIT 10;
```

### Status Values

| Status | Tavsif |
|--------|--------|
| `RUNNING` | Jarayonda |
| `COMPLETED` | Muvaffaqiyatli |
| `FAILED` | Xato bilan tugadi |
| `CANCELLED` | Bekor qilindi |

---

## Error Handling

### Retry Logic

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${i + 1} failed:`, error);
      await sleep(1000 * Math.pow(2, i)); // Exponential backoff
    }
  }
  
  throw lastError!;
}
```

### Alert System

```typescript
// Xato bo'lganda admin'ga xabar
async function notifyError(error: Error, context: string) {
  await telegramService.sendToAdmin({
    text: `🚨 Cron Error: ${context}\n\n${error.message}`,
  });
}
```

---

## Local Development

### Manual Trigger

```bash
# News sync
curl -X GET http://localhost:3000/api/cron/news \
  -H "Authorization: Bearer your_cron_secret"

# Telegram post
curl -X GET http://localhost:3000/api/cron/telegram \
  -H "Authorization: Bearer your_cron_secret"
```

### Dev Cron Emulator

```typescript
// apps/web/src/lib/dev-cron.ts
import cron from 'node-cron';

if (process.env.NODE_ENV === 'development') {
  // Har 5 daqiqada (dev uchun)
  cron.schedule('*/5 * * * *', async () => {
    await fetch('http://localhost:3000/api/cron/news', {
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
    });
  });
}
```

---

## Bog'liq Hujjatlar

- [API Overview](./README.md) - API umumiy
- [News Pipeline](../services/NEWS_PIPELINE.md) - Pipeline tafsilotlari
- [Telegram Service](../services/TELEGRAM_SERVICE.md) - Telegram integratsiya

