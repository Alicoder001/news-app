# Admin Notification Service

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Maqsad

Admin Notification Service muhim hodisalar haqida adminlarga xabar yuboradi - xatolar, pipeline holati, va tizim ogohlantirishlari.

---

## Fayl Joylashuvi

```
apps/web/src/lib/news/services/admin-notification.service.ts
```

---

## Asosiy Funksiyalar

### 1. notifyPipelineError

Pipeline xatosi haqida xabar.

```typescript
async function notifyPipelineError(
  error: Error,
  context: {
    runId: string;
    step: string;
    articleId?: string;
  }
): Promise<void>
```

### 2. notifyDailySummary

Kunlik statistika xulosasi.

```typescript
interface DailySummary {
  date: Date;
  articlesCreated: number;
  articlesFailed: number;
  totalCost: number;
  topCategories: { name: string; count: number }[];
}

async function notifyDailySummary(summary: DailySummary): Promise<void>
```

### 3. notifyHighCost

AI xarajat chegarasi oshganda.

```typescript
async function notifyHighCost(
  currentCost: number,
  threshold: number,
  period: 'day' | 'month'
): Promise<void>
```

---

## Notification Kanallari

| Kanal | Holat | Sozlama |
|-------|-------|---------|
| Telegram | ✅ Faol | `TELEGRAM_ADMIN_CHAT_ID` |
| Email | ⏳ Reja | - |
| Slack | ⏳ Reja | - |

---

## Telegram Xabar Formatlari

### Pipeline Error

```
🔴 Pipeline Error

Run ID: clx123...
Step: article_process
Error: Rate limit exceeded

Time: 2026-01-20 15:30:45

[View Logs]
```

### Daily Summary

```
📊 Kunlik Hisobot - 2026-01-20

✅ Yaratilgan: 45 ta maqola
❌ Xatolar: 3 ta
💰 Xarajat: $0.85

Top kategoriyalar:
1. AI - 15 ta
2. Web - 12 ta
3. Mobile - 8 ta
```

---

## Konfiguratsiya

```env
TELEGRAM_ADMIN_CHAT_ID=123456789
NOTIFICATION_ENABLED=true
DAILY_COST_THRESHOLD=10.00
MONTHLY_COST_THRESHOLD=100.00
```

---

## Bogliq Hujjatlar

- [News Pipeline](./NEWS_PIPELINE.md) - Pipeline integration
- [Telegram Service](./TELEGRAM_SERVICE.md) - Xabar yuborish
- [Usage Tracker](./USAGE_TRACKER.md) - Cost tracking
