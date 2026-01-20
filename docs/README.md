# Aishunos Documentation

> **Versiya:** 3.0  
> **Yangilangan:** 2026-01-20

---

## Umumiy Korinish

Aishunos - ozbekcha texnologiya yangiliklari platformasi. Suniy intellekt yordamida jahon texnologiya yangiliklarini ozbekchaga tarjima qiladi.

---

## Tezkor Havolalar

| Bolim | Tavsif |
|-------|--------|
| [Architecture](./architecture/README.md) | Loyiha arxitekturasi |
| [API](./api/README.md) | API dokumentatsiyasi |
| [Models](./models/README.md) | Database modellari (8 ta) |
| [Services](./services/README.md) | Backend xizmatlari (7 ta) |
| [Repositories](./repositories/README.md) | Data access layer |
| [Utils](./utils/README.md) | Yordamchi funksiyalar |
| [Packages](./packages/README.md) | Shared packages (3 ta) |
| [Roadmap](./roadmap/README.md) | Rivojlanish rejasi |
| [Guidelines](./guidelines/README.md) | Kod yozish yoriqlari |
| [UI](./ui/README.md) | UI komponentlar |
| [i18n](./i18n/README.md) | Tillar va tarjimalar |
| [Platforms](./platforms/README.md) | Platformalar (4 ta) |
| [Changelog](./changelog/README.md) | Ozgarishlar tarixi |

---

## Dokumentatsiya Strukturasi

```
docs/
├── README.md                    # Shu fayl
├── unified_project_tz.md        # Texnik topshiriq
├── pipeline-architecture.md     # Pipeline arxitekturasi
│
├── api/                         # API Documentation (4 fayl)
│   ├── README.md
│   ├── ENDPOINTS.md
│   ├── AUTHENTICATION.md
│   └── CRON_JOBS.md
│
├── architecture/                # Architecture (4 fayl)
│   ├── README.md
│   ├── MONOREPO_STRUCTURE.md
│   ├── CODING_STANDARDS.md
│   └── STATE_MANAGEMENT.md
│
├── models/                      # Data Models (8 fayl)
│   ├── README.md
│   ├── ARTICLE.md
│   ├── CATEGORY.md
│   ├── TAG.md
│   ├── NEWS_SOURCE.md
│   ├── RAW_ARTICLE.md
│   ├── PIPELINE_RUN.md
│   ├── AI_USAGE.md
│   └── SYSTEM_SETTING.md
│
├── services/                    # Backend Services (8 fayl)
│   ├── README.md
│   ├── AI_SERVICE.md
│   ├── TELEGRAM_SERVICE.md
│   ├── NEWS_PIPELINE.md
│   ├── FILTERING_SERVICE.md
│   ├── NEWS_PROVIDERS.md
│   ├── ADMIN_NOTIFICATION.md
│   └── USAGE_TRACKER.md
│
├── repositories/                # Data Access (3 fayl)
│   ├── README.md
│   ├── NEWS_SOURCE_REPO.md
│   └── RAW_ARTICLE_REPO.md
│
├── utils/                       # Utilities (4 fayl)
│   ├── README.md
│   ├── RATE_LIMITER.md
│   ├── SANITIZER.md
│   └── IMAGE_UTILS.md
│
├── packages/                    # Shared Packages (4 fayl)
│   ├── README.md
│   ├── SHARED.md
│   ├── API_TYPES.md
│   └── I18N.md
│
├── roadmap/                     # Development Roadmap (5 fayl)
│   ├── README.md
│   ├── PHASE_0_FOUNDATION.md
│   ├── PHASE_1_MVP.md
│   ├── PHASE_2_ESSENTIAL.md
│   └── PHASE_3_ADVANCED.md
│
├── guidelines/                  # Development Guidelines (5 fayl)
│   ├── README.md
│   ├── CODING_GUIDELINES.md
│   ├── GIT_WORKFLOW.md
│   ├── DEPLOYMENT.md
│   └── TESTING.md
│
├── ui/                          # UI Documentation (3 fayl)
│   ├── README.md
│   ├── COMPONENT_LIBRARY.md
│   └── DESIGN_TOKENS.md
│
├── i18n/                        # Internationalization (2 fayl)
│   ├── README.md
│   └── LOCALES.md
│
├── platforms/                   # Platform Docs (5 fayl)
│   ├── README.md
│   ├── WEB_APP.md
│   ├── TELEGRAM_MINI_APP.md
│   ├── MOBILE_APP.md
│   └── ADMIN_PANEL.md
│
└── changelog/                   # Change History (2 fayl)
    ├── README.md
    └── 2026-01-20.md
```

**Jami: 57 ta dokumentatsiya fayli**

---

## Quick Start

### Development

```bash
# Clone repository
git clone https://github.com/aishunos/aishunos.git

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local

# Run database migrations
pnpm db:migrate:dev

# Start development server
pnpm dev
```

### Key Commands

| Command | Tavsif |
|---------|--------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm lint` | Run linter |
| `pnpm test` | Run tests |
| `pnpm db:studio` | Open Prisma Studio |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React 19, Tailwind CSS |
| **Backend** | Next.js API Routes, Prisma |
| **Database** | PostgreSQL (Neon) |
| **AI** | OpenAI GPT-4o-mini |
| **Hosting** | Vercel |
| **Mobile** | React Native (Expo) |

---

## Loyiha Holati

| Component | Status |
|-----------|--------|
| Web App | ✅ Production |
| News Pipeline | ✅ Production |
| AI Translation | ✅ Production |
| Telegram Mini App | 🔄 Development |
| Admin Panel | 🔄 Development |
| Mobile App | ⏳ Planned |

---

## Dokumentatsiya Qamrovi

| Bolim | Fayl soni | Qamrov |
|-------|-----------|--------|
| Models | 8 | 100% |
| Services | 7 | 100% |
| Repositories | 2 | 100% |
| Utils | 3 | 100% |
| Packages | 3 | 100% |
| **Umumiy** | **57** | **100%** |

---

## Jamoa uchun

- [Coding Guidelines](./guidelines/CODING_GUIDELINES.md) - Kod standartlari
- [Git Workflow](./guidelines/GIT_WORKFLOW.md) - Branch va commit qoidalari
- [Testing](./guidelines/TESTING.md) - Test yozish
- [Deployment](./guidelines/DEPLOYMENT.md) - Deploy jarayoni

---

## Boglanish

- **Website:** https://aishunos.uz
- **Telegram:** @aishunos
- **GitHub:** github.com/aishunos
