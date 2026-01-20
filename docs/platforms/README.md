# Platforms

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Umumiy Korinish

Aishunos bir nechta platformalarda mavjud.

---

## Platformalar

| Platform | Status | Hujjat |
|----------|--------|--------|
| **Web App** | ✅ Production | [WEB_APP.md](./WEB_APP.md) |
| **Telegram Mini App** | 🔄 Development | [TELEGRAM_MINI_APP.md](./TELEGRAM_MINI_APP.md) |
| **Mobile App** | ⏳ Planned | [MOBILE_APP.md](./MOBILE_APP.md) |
| **Admin Panel** | 🔄 Development | [ADMIN_PANEL.md](./ADMIN_PANEL.md) |

---

## Tech Stack

| Platform | Technology |
|----------|------------|
| Web | Next.js 15, React 19 |
| Telegram | Next.js + Telegram WebApp API |
| Mobile | React Native (Expo) |
| Admin | Next.js (same codebase) |

---

## Shared Code

```
packages/
├── shared/      # Shared utilities
├── api-types/   # API type definitions
└── i18n/        # Translations
```
