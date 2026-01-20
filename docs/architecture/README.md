# Arxitektura

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-19

---

## Maqsad

Ushbu hujjat Aishunos platformasining texnik arxitekturasi haqida umumiy ma'lumot beradi.

---

## Hujjatlar

| Hujjat | Tavsif |
|--------|--------|
| [MONOREPO_STRUCTURE.md](./MONOREPO_STRUCTURE.md) | pnpm workspace, apps, packages |
| [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) | Holat boshqaruvi strategiyasi |
| [CODING_STANDARDS.md](./CODING_STANDARDS.md) | Kod yozish standartlari |

---

## Texnologiyalar

### Core Stack

| Qatlam | Texnologiya | Versiya | Vazifasi |
|--------|-------------|---------|----------|
| **Framework** | Next.js | 16.1.1 | App Router, SSR, API Routes |
| **UI Library** | React | 19.2.3 | Komponent asosidagi UI |
| **Til** | TypeScript | 5.x | Tip xavfsizligi |
| **Stillar** | Tailwind CSS | 4.x | Utility-first CSS |
| **Database** | PostgreSQL | - | Asosiy ma'lumotlar bazasi |
| **ORM** | Prisma | 6.19.1 | Database access layer |

### State Management

| Qatlam | Texnologiya | Vazifasi |
|--------|-------------|----------|
| **Server State** | TanStack Query | API data fetching, caching |
| **Client State** | Zustand | Local UI state (mobile) |
| **Form State** | React Hook Form | Form validation |

### AI & Integrations

| Xizmat | Texnologiya | Vazifasi |
|--------|-------------|----------|
| **AI Processing** | OpenAI GPT-4o-mini | Tarjima, tahlil |
| **Telegram** | Bot API + Mini App SDK | Kanal posting, WebApp |
| **News APIs** | NewsAPI.ai, TheNewsAPI | Yangilik manbalari |

### Mobile

| Texnologiya | Versiya | Vazifasi |
|-------------|---------|----------|
| Expo | 54.0.30 | Development platform |
| React Native | 0.81.5 | Mobile framework |
| React Navigation | 7.x | Navigation |

---

## Arxitektura Diagrammasi

```
┌─────────────────────────────────────────────────────────────────┐
│                        AISHUNOS PLATFORM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Web App   │  │ Mobile App  │  │  TG Mini App │            │
│  │  (Next.js)  │  │   (Expo)    │  │  (WebApp SDK)│            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         │                │                │                    │
│         └────────────────┼────────────────┘                    │
│                          ▼                                      │
│                  ┌───────────────┐                             │
│                  │   REST API    │                             │
│                  │  (Next.js)    │                             │
│                  └───────┬───────┘                             │
│                          │                                      │
│         ┌────────────────┼────────────────┐                    │
│         ▼                ▼                ▼                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  PostgreSQL │  │   OpenAI    │  │  Telegram   │            │
│  │   (Prisma)  │  │  GPT-4o-mini│  │   Bot API   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## News Pipeline Arxitekturasi

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ News APIs│────▶│RawArticle│────▶│AI Process│────▶│ Article  │
│(NewsAPI.ai)    │ (storage)│     │ (OpenAI) │     │(published)│
└──────────┘     └──────────┘     └──────────┘     └────┬─────┘
                                                        │
                                                        ▼
                                                  ┌──────────┐
                                                  │ Telegram │
                                                  │ Channel  │
                                                  └──────────┘
```

---

## Bog'liq Hujjatlar

- [Monorepo Strukturasi](./MONOREPO_STRUCTURE.md) - Loyiha tuzilishi
- [API Endpoints](../api/ENDPOINTS.md) - Backend API
- [Services](../services/README.md) - Biznes logika

