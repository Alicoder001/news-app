# Phase 1: Foundation and Architecture

## Maqsad

Bu fazaning maqsadi MVP uchun asosiy texnik poydevorni belgilash.

## Stack

- `Next.js`
- `TypeScript`
- `PostgreSQL`
- `Prisma`
- `TanStack Query`
- `Zustand`
- `Lucide React`

## Development va Runtime Environment

MVP uchun tavsiya etilgan operatsion model:

- `WSL Ubuntu` ichida development
- `Docker Compose` ni ham `WSL terminal` ichidan boshqarish

Bu degani:

- git va coding workflow WSL ichida bo'ladi
- app runtime container'larda bo'ladi
- database container'larda bo'ladi
- worker ham container'da ishlaydi

## Nega shu model tanlanadi

- Linuxga yaqin real muhit beradi
- Docker bilan integratsiya silliqroq bo'ladi
- file permission va path muammolari kamayadi
- keyin VPS Ubuntu ga ko'chirish oson bo'ladi
- uzluksiz va boshqariladigan runtime beradi

## Tavsiya etilgan ishlash modeli

### WSL ichida qilinadi

- kod yozish
- git
- package manager komandalar
- docker compose boshqaruvi
- local debugging

### Docker ichida ishlaydi

- `postgres`
- `app`
- `worker`
- keyin kerak bo'lsa `redis`

## Local va Vercel bo'linishi

### Local / persistent worker

Bu yerda ishlaydi:

- RSS fetch
- cron `*/30 * * * *`
- source verification
- 3 agent orchestration
- website publish uchun DB write
- Telegram publish
- pipeline logs

### Vercel

Bu yerda ishlaydi:

- public website
- article pages
- category pages
- Telegram Mini App frontend
- public read API

## Signal Model

Local va Vercel orasidagi asosiy signal:

- `shared PostgreSQL database`

Asosiy oqim:

1. local worker final article'ni DB'ga yozadi
2. article slug va website URL deterministik bo'ladi
3. Vercel shu DB'dan article'ni o'qiydi
4. Telegram short post website link bilan yuboriladi

Qo'shimcha signal:

- optional revalidate endpoint

Lekin MVP uchun asosiy signal `DB write` bo'ladi.

## Docker Compose Runtime Model

MVP uchun minimal container stack:

- `postgres`
- `app`
- `worker`

Keyinroq qo'shilishi mumkin:

- `redis`

## Tavsiya etilgan repo joylashuvi

Imkon bo'lsa loyiha WSL filesystem ichida saqlanadi.

Masalan:

- `~/projects/ai-shunos`

Sababi:

- file I/O tezroq
- Docker bind mounts barqarorroq
- watch mode yaxshiroq ishlaydi

## Folder Structure

```text
docs/
prisma/
src/
  app/
    (public)/
    admin/
    tg/
    api/
  components/
  features/
  entities/
  lib/
    api/
    db/
    rss/
    verification/
    agents/
    pipeline/
    publish/
    telegram/
    validation/
  stores/
prompts/
```

## Environment Variables

- `DATABASE_URL`
- `APP_URL`
- `INTERNAL_PIPELINE_SECRET`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHANNEL_ID`
- `CRON_SECRET`
- `AGENT_RUNTIME_MODE`

## Phase Done Criteria

- stack muzlatilgan
- WSL + Docker Compose operatsion modeli aniq
- local/vercel boundary aniq
- signal modeli aniq
- folder structure aniq
- env ro'yxati aniq
