# ai_shunos MVP Phases Overview

## Maqsad

Bu hujjat MVP hujjatlarini fazalarga bo'lib o'qish va implementatsiya qilish uchun index vazifasini bajaradi.

Asosiy prinsip:

- katta hujjat referens sifatida qoladi
- amaliy ishlar esa fazalar bo'yicha yuritiladi

## Asosiy Hujjat

- [MVP End-to-End Spec](/Users/coder/Desktop/news-app/docs/MVP_END_TO_END_SPEC.md)

## Fazalar

### 1-faza: Foundation va Architecture

- loyiha stack
- local va vercel bo'linishi
- WSL Ubuntu + Docker Compose operatsion modeli
- shared database modeli
- folder structure
- environment variables

Hujjat:
- [PHASE_1_FOUNDATION_AND_ARCHITECTURE.md](/Users/coder/Desktop/news-app/docs/PHASE_1_FOUNDATION_AND_ARCHITECTURE.md)

### 2-faza: Data, Prisma va Ingestion

- Prisma entities
- RSS ingestion
- duplicate prevention
- source management
- verification records

Hujjat:
- [PHASE_2_DATA_AND_INGESTION.md](/Users/coder/Desktop/news-app/docs/PHASE_2_DATA_AND_INGESTION.md)

### 3-faza: Verification va 3 Agent Pipeline

- 2-3 source verification
- Collector
- Analyzer/Writer
- Reviewer
- retry va hold/reject flow

Hujjat:
- [PHASE_3_VERIFICATION_AND_AGENTS.md](/Users/coder/Desktop/news-app/docs/PHASE_3_VERIFICATION_AND_AGENTS.md)

### 4-faza: Publishing, Website, Telegram, Mini App

- web first publish
- telegram second publish
- Mini App data source
- public pages
- delivery tracking

Hujjat:
- [PHASE_4_PUBLISHING_AND_CLIENT_SURFACES.md](/Users/coder/Desktop/news-app/docs/PHASE_4_PUBLISHING_AND_CLIENT_SURFACES.md)

### 5-faza: Admin, Query State, Monitoring

- admin dashboard
- TanStack Query
- Zustand
- Lucide React
- logs
- pipeline runs
- manual recovery

Hujjat:
- [PHASE_5_ADMIN_AND_OPERATIONS.md](/Users/coder/Desktop/news-app/docs/PHASE_5_ADMIN_AND_OPERATIONS.md)

## Qanday Ishlaymiz

Implementatsiya tartibi:

1. 1-faza
2. 2-faza
3. 3-faza
4. 4-faza
5. 5-faza

## Muhim Qaror

`Local worker -> Shared PostgreSQL -> Vercel public app`

Bu MVP uchun asosiy signal modeli bo'ladi.

Ya'ni:

- local worker RSS va agent pipeline'ni ishlatadi
- final article shared database'ga yoziladi
- Vercel public site va Mini App shu database'dan o'qiydi
- Telegram post website URL tayyor bo'lgandan keyin yuboriladi

## Operatsion Muhit Qarori

Tavsiya etilgan operatsion model:

- `WSL Ubuntu` ichida development
- `Docker Compose` ham `WSL terminal` ichidan boshqariladi

Ya'ni:

- kod yozish WSL ichida
- container'larni boshqarish WSL ichida
- Postgres, app va worker Docker orqali ishlaydi
