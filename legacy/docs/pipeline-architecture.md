# News Pipeline - Avtomatlashtirish Arxitekturasi

## Umumiy Ko'rinish

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEWS PIPELINE FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐               │
│  │ GNews.io │     │   RSS    │     │ NewsAPI  │               │
│  └────┬─────┘     └────┬─────┘     └────┬─────┘               │
│       │                │                │                      │
│       └────────────────┼────────────────┘                      │
│                        ▼                                        │
│              ┌─────────────────┐                               │
│              │   RawArticle    │  (bazada saqlanadi)           │
│              └────────┬────────┘                               │
│                       ▼                                        │
│              ┌─────────────────┐                               │
│              │   AI Process    │  (importance beradi)          │
│              └────────┬────────┘                               │
│                       ▼                                        │
│              ┌─────────────────┐                               │
│              │    Article      │  (saytda ko'rinadi)           │
│              └────────┬────────┘                               │
│                       ▼                                        │
│              ┌─────────────────┐                               │
│              │  Telegram Post  │  (sayt linki bilan)           │
│              └─────────────────┘                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Cron Joblari

### 1. Sync + Process Cron
- **Endpoint:** `/api/cron/news`
- **Jadval:** Har 15 daqiqada (`*/15 * * * *`)
- **Vazifasi:**
  1. GNews va RSS'dan yangiliklar olish
  2. AI orqali qayta ishlash
  3. Tasdiqlanganlarni `Article` sifatida saqlash

### 2. Telegram Cron
- **Endpoint:** `/api/cron/telegram`
- **Jadval:** Har soatda (`0 * * * *`)
- **Vazifasi:**
  1. So'nggi 1 soatdagi maqolalarni olish
  2. `importance` bo'yicha eng muhimini tanlash
  3. Sayt linki bilan Telegram'ga post qilish

## Importance Darajalari

| Daraja | Emoji | Telegram Formati |
|--------|-------|------------------|
| CRITICAL | 🚨 | Tezkor xabar shablon |
| HIGH | 🔥 | Oddiy shablon |
| MEDIUM | 📌 | Oddiy shablon |
| LOW | ℹ️ | Oddiy shablon |

## Maqola Sahifalari

| Platforma | URL Strukturasi |
|-----------|-----------------|
| Sayt | `/articles/{slug}` |
| TG Mini App | `/tg/article/{slug}` |

## Telegram Post Linki

Telegram'ga post qilinayotganda link:
```
{NEXT_PUBLIC_APP_URL}/uz/articles/{slug}
```

**Muhim:** Link tashqi manbaga emas, o'z saytga ketadi!

## Fayl Joylashuvi

```
apps/web/src/app/api/cron/
├── news/
│   └── route.ts      # Sync + AI Process
└── telegram/
    └── route.ts      # Telegram posting
```

## Environment Variables

```env
# Cron xavfsizligi
CRON_SECRET=your-secret-here

# Telegram
TELEGRAM_BOT_TOKEN=bot-token
TELEGRAM_CHAT_ID=channel-id

# Sayt URL (telegram link uchun)
NEXT_PUBLIC_APP_URL=https://aishunos.uz
```

## Vercel Cron Konfiguratsiyasi

```json
{
  "crons": [
    { "path": "/api/cron/news", "schedule": "*/15 * * * *" },
    { "path": "/api/cron/telegram", "schedule": "0 * * * *" }
  ]
}
```

---

*Oxirgi yangilangan: 2025-12-31*
