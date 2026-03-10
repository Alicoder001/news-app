# Cron Jobs

> **Versiya:** 1.1  
> **Yangilangan:** 2026-02-20

---

## Maqsad

Cron endpointlar Next adapter (`apps/web`) orqali backend job trigger qiladi. Endpointlar to'g'ridan-to'g'ri pipeline biznes logikasini bajarmaydi.

---

## Joblar

| Job | Endpoint | Method | Trigger backend job |
|-----|----------|--------|---------------------|
| News Sync | `/api/cron/news` | `GET` / `POST` | `sync-news` |
| Telegram Post | `/api/cron/telegram` | `GET` / `POST` | `telegram-post` |

Backend trigger endpoint: `POST /v1/internal/jobs/trigger` (`x-internal-token` talab qilinadi).

---

## Xavfsizlik

Cron route faqat quyidagi holatlarda ruxsat beradi:

1. `x-vercel-cron: 1` header mavjud bo'lsa.
2. `NODE_ENV=development` bo'lsa.
3. `Authorization: Bearer <CRON_SECRET>` mos bo'lsa.

Har ikkala cron route uchun strict rate-limit qo'llanadi.

---

## Request Flow

1. Cron route auth + rate-limit tekshiradi.
2. Backendga `job` va `payload` bilan trigger yuboradi.
3. Backend `InternalJobsService` quyidagidan birini qaytaradi:
   - `mode: "queue"` (`REDIS_URL` mavjud).
   - `mode: "dry-run"` (`REDIS_URL` yo'q).

`payload.idempotencyKey` minute-level pattern bilan yuboriladi:
- `sync-news:${YYYY-MM-DDTHH:mm}`
- `telegram-post:${YYYY-MM-DDTHH:mm}`

---

## Muhim Eslatma

Queue producer qismi (`trigger`) monorepoda mavjud. Queue consumer/worker deployment arxitekturasi alohida operatsion scope sifatida yuritiladi. Shu sababli `mode` qiymati release paytida kuzatib borilishi shart.

---

## Manual Admin Trigger

Admin panel cron endpointlarni ishlatmaydi. Ular:

- `POST /api/news/sync`
- `POST /api/news/process`

Bu route'lar admin session cookie'dan Bearer token olib, backenddagi `POST /v1/admin/pipeline/trigger` endpointiga yuboradi.

