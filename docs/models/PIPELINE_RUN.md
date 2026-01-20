# Pipeline Run Model

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Maqsad

PipelineRun modeli yangiliklar pipeline'ining har bir ishga tushirilishini kuzatadi. Bu monitoring, debugging va statistika uchun ishlatiladi.

---

## Prisma Schema

\\\prisma
model PipelineRun {
  id              String    @id @default(cuid())
  type            String    // "fetch" | "process" | "full" | "telegram"
  status          String    @default("running") // running, completed, failed
  
  // Timing
  startedAt       DateTime  @default(now())
  completedAt     DateTime?
  duration        Int?      // milliseconds
  
  // Statistics
  sourcesProcessed Int      @default(0)
  articlesFetched  Int      @default(0)
  articlesCreated  Int      @default(0)
  articlesFiltered Int      @default(0)
  articlesFailed   Int      @default(0)
  
  // Telegram specific
  messagesSent     Int      @default(0)
  
  // Error handling
  error           String?   @db.Text
  errorStack      String?   @db.Text
  
  // Metadata
  triggeredBy     String    @default("cron") // cron, manual, api
  metadata        Json?
  createdAt       DateTime  @default(now())
  
  @@index([type])
  @@index([status])
  @@index([startedAt])
}
\\\

---

## Maydonlar

| Maydon | Turi | Tavsif | Majburiy |
|--------|------|--------|----------|
| \id\ | String | Unique ID | ✅ Auto |
| \	ype\ | String | Pipeline turi | ✅ |
| \status\ | String | Holat | ✅ Default: "running" |
| \startedAt\ | DateTime | Boshlangan vaqt | ✅ Auto |
| \completedAt\ | DateTime? | Tugallangan vaqt | ❌ |
| \duration\ | Int? | Davomiyligi (ms) | ❌ |
| \sourcesProcessed\ | Int | Qayta ishlangan manbalar | ✅ Default: 0 |
| \rticlesFetched\ | Int | Olingan maqolalar | ✅ Default: 0 |
| \rticlesCreated\ | Int | Yaratilgan maqolalar | ✅ Default: 0 |
| \rticlesFiltered\ | Int | Filtrlangan maqolalar | ✅ Default: 0 |
| \rticlesFailed\ | Int | Xatolik bilan | ✅ Default: 0 |
| \messagesSent\ | Int | Telegram xabarlar | ✅ Default: 0 |
| \error\ | String? | Xatolik xabari | ❌ |
| \errorStack\ | String? | Stack trace | ❌ |
| \	riggeredBy\ | String | Kim ishga tushirdi | ✅ Default: "cron" |
| \metadata\ | Json? | Qo'shimcha ma'lumot | ❌ |

---

## Pipeline Turlari

| Type | Tavsif | Cron |
|------|--------|------|
| \etch\ | Faqat maqolalarni olish | Har 30 daqiqa |
| \process\ | Faqat AI qayta ishlash | Har 15 daqiqa |
| \ull\ | Fetch + Process | Har soatda |
| \	elegram\ | Telegram xabarlarini yuborish | Har 6 soatda |

---

## Status Qiymatlari

| Status | Tavsif | Rang |
|--------|--------|------|
| \unning\ | Hozirda ishlayapti | 🟡 Yellow |
| \completed\ | Muvaffaqiyatli tugadi | 🟢 Green |
| \ailed\ | Xatolik bilan tugadi | 🔴 Red |

---

## Trigger Turlari

| Trigger | Tavsif |
|---------|--------|
| \cron\ | Avtomatik cron job |
| \manual\ | Admin paneldan qo'lda |
| \pi\ | API orqali |
| \webhook\ | Tashqi webhook |

---

## Statistika Hisoblash

\\\	ypescript
// Success rate
const successRate = (articlesCreated / articlesFetched) * 100;

// Filter rate
const filterRate = (articlesFiltered / articlesFetched) * 100;

// Average duration
const avgDuration = totalDuration / totalRuns;
\\\

---

## TypeScript Interface

\\\	ypescript
type PipelineType = 'fetch' | 'process' | 'full' | 'telegram';
type PipelineStatus = 'running' | 'completed' | 'failed';
type TriggerType = 'cron' | 'manual' | 'api' | 'webhook';

interface PipelineRun {
  id: string;
  type: PipelineType;
  status: PipelineStatus;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  sourcesProcessed: number;
  articlesFetched: number;
  articlesCreated: number;
  articlesFiltered: number;
  articlesFailed: number;
  messagesSent: number;
  error?: string;
  errorStack?: string;
  triggeredBy: TriggerType;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

interface PipelineStats {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  avgDuration: number;
  totalArticlesCreated: number;
  successRate: number;
}
\\\

---

## Admin Dashboard Widget

\\\
┌─────────────────────────────────────┐
│ Pipeline Status                      │
├─────────────────────────────────────┤
│ Last Run: 5 minutes ago    🟢       │
│ Articles Created: 12                 │
│ Success Rate: 94.5%                  │
│                                      │
│ [View History] [Run Now]            │
└─────────────────────────────────────┘
\\\

---

## Bog'liq Hujjatlar

- [Pipeline Architecture](../pipeline-architecture.md) - Umumiy arxitektura
- [CRON Jobs](../api/CRON_JOBS.md) - Avtomatik ishga tushirish
- [Admin Panel](../platforms/ADMIN_PANEL.md) - Monitoring
