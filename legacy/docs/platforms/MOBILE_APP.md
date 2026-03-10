# Mobile Application

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20  
> **Status:** ⏳ Planned (Phase 2)

---

## Umumiy Korinish

React Native (Expo) asosida mobil ilova.

---

## Tech Stack

| Technology | Maqsad |
|------------|--------|
| React Native | Framework |
| Expo | Development platform |
| Expo Router | Navigation |
| Zustand | State management |
| React Query | Data fetching |

---

## Planned Features

- [ ] Article reading
- [ ] Category browsing
- [ ] Search
- [ ] Bookmarks (offline)
- [ ] Push notifications
- [ ] Dark/Light theme
- [ ] Multi-language

---

## File Structure

```
apps/mobile/
├── app/                 # Expo Router pages
│   ├── (tabs)/
│   │   ├── index.tsx    # Home
│   │   ├── search.tsx   # Search
│   │   └── saved.tsx    # Bookmarks
│   └── article/
│       └── [slug].tsx   # Article detail
├── src/
│   ├── api/             # API client
│   ├── components/      # UI components
│   ├── hooks/           # Custom hooks
│   ├── store/           # Zustand stores
│   └── theme/           # Theme config
└── assets/              # Images, fonts
```

---

## Development

```bash
# Install dependencies
cd apps/mobile
pnpm install

# Start Expo
pnpm start

# Run on iOS
pnpm ios

# Run on Android
pnpm android
```

---

## API Integration

```typescript
// src/api/client.ts
import { API_URL } from '@/config';

export const api = {
  articles: {
    list: (params) => fetch(`${API_URL}/articles?${params}`),
    get: (slug) => fetch(`${API_URL}/articles/${slug}`),
  },
  categories: {
    list: () => fetch(`${API_URL}/categories`),
  },
};
```

---

## Distribution

| Platform | Status |
|----------|--------|
| App Store | ⏳ Planned |
| Play Store | ⏳ Planned |
| APK Direct | ⏳ Planned |
