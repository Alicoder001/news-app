# Shared Packages

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Umumiy Korinish

Monorepo ichida apps orasida umumiy kod ulashish uchun paketlar.

---

## Paketlar

| Paket | Tavsif | Hujjat |
|-------|--------|--------|
| `@aishunos/shared` | Umumiy utilities | [SHARED.md](./SHARED.md) |
| `@aishunos/api-types` | API type definitions | [API_TYPES.md](./API_TYPES.md) |
| `@aishunos/i18n` | Tarjimalar | [I18N.md](./I18N.md) |

---

## Fayl Joylashuvi

```
packages/
├── shared/
│   ├── package.json
│   └── src/
│       ├── index.ts
│       ├── constants/
│       └── utils/
├── api-types/
│   ├── package.json
│   └── src/
│       ├── index.ts
│       ├── article.ts
│       └── responses.ts
└── i18n/
    ├── package.json
    ├── locales/
    │   ├── en.json
    │   ├── ru.json
    │   └── uz.json
    └── src/
        └── index.ts
```

---

## Foydalanish

```typescript
// apps/web yoki apps/mobile da
import { SITE_NAME } from '@aishunos/shared';
import type { Article } from '@aishunos/api-types';
import { translations } from '@aishunos/i18n';
```

---

## Package.json Example

```json
{
  "name": "@aishunos/shared",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {}
}
```
