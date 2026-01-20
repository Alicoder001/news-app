# Services

> **Versiya:** 2.0  
> **Yangilangan:** 2026-01-20

---

## Umumiy Korinish

Aishunos loyihasining backend xizmatlari modular arxitekturada tashkil etilgan.

---

## Xizmatlar Royxati

### Core Services

| Xizmat | Tavsif | Hujjat |
|--------|--------|--------|
| **AI Service** | OpenAI integratsiyasi | [AI_SERVICE.md](./AI_SERVICE.md) |
| **Telegram Service** | Telegram bot va kanal | [TELEGRAM_SERVICE.md](./TELEGRAM_SERVICE.md) |
| **News Pipeline** | Yangiliklar pipeline | [NEWS_PIPELINE.md](./NEWS_PIPELINE.md) |
| **Filtering Service** | Dublikat/sifat filtrlash | [FILTERING_SERVICE.md](./FILTERING_SERVICE.md) |
| **News Providers** | Tashqi API providerlar | [NEWS_PROVIDERS.md](./NEWS_PROVIDERS.md) |

### Admin Services

| Xizmat | Tavsif | Hujjat |
|--------|--------|--------|
| **Admin Notification** | Admin xabarnomalar | [ADMIN_NOTIFICATION.md](./ADMIN_NOTIFICATION.md) |
| **Usage Tracker** | AI xarajat tracking | [USAGE_TRACKER.md](./USAGE_TRACKER.md) |

---

## Arxitektura

```
┌─────────────────────────────────────────────────────────────┐
│                    API Routes                                │
├─────────────────────────────────────────────────────────────┤
│  /api/cron/news  │  /api/news/process  │  /api/articles     │
└────────┬─────────┴──────────┬──────────┴────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  News Pipeline  │──│   AI Service    │──│  Usage Tracker  │
└────────┬────────┘  └─────────────────┘  └─────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌──────────┐
│Provider│ │Filtering │
└────────┘ └──────────┘
    │
    ▼
┌─────────────────┐  ┌─────────────────┐
│    Telegram     │──│ Admin Notify    │
└─────────────────┘  └─────────────────┘
```

---

## Fayl Joylashuvi

```
apps/web/src/lib/
├── news/
│   ├── services/
│   │   ├── ai.service.ts
│   │   ├── telegram.service.ts
│   │   ├── news-pipeline.service.ts
│   │   ├── filtering.service.ts
│   │   └── admin-notification.service.ts
│   ├── providers/
│   │   ├── base.provider.ts
│   │   ├── rss.provider.ts
│   │   ├── gnews.provider.ts
│   │   └── ...
│   └── repositories/
│       ├── news-source.repository.ts
│       └── raw-article.repository.ts
└── admin/
    └── usage-tracker.ts
```

---

## Bogliq Hujjatlar

- [Pipeline Architecture](../pipeline-architecture.md)
- [Repositories](../repositories/README.md)
- [Utils](../utils/README.md)
