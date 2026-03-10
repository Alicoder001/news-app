# Internationalization (i18n)

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Umumiy Korinish

Aishunos 3 tilda mavjud: Ozbekcha, Ruscha, Inglizcha.

---

## Hujjatlar

| Hujjat | Tavsif |
|--------|--------|
| [LOCALES.md](./LOCALES.md) | Tarjimalar va tillar |

---

## Tech Stack

| Tool | Maqsad |
|------|--------|
| **next-intl** | Next.js i18n |
| **packages/i18n** | Shared translations |

---

## Qollab-quvvatlanadigan Tillar

| Kod | Til | Status |
|-----|-----|--------|
| `uz` | Ozbekcha | ✅ Asosiy |
| `ru` | Ruscha | ✅ Toliq |
| `en` | Inglizcha | ✅ Toliq |

---

## Fayl Tuzilishi

```
apps/web/
├── messages/
│   ├── en.json
│   ├── ru.json
│   └── uz.json
└── src/i18n/
    ├── navigation.ts
    ├── request.ts
    └── routing.ts

packages/i18n/
├── locales/
│   ├── en.json
│   ├── ru.json
│   └── uz.json
└── src/
    └── index.ts
```

---

## Foydalanish

### Server Component

```tsx
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}
```

### Client Component

```tsx
'use client';
import { useTranslations } from 'next-intl';

export function Button() {
  const t = useTranslations('Common');
  return <button>{t('submit')}</button>;
}
```

---

## URL Struktura

```
/uz/articles/...    # Ozbekcha
/ru/articles/...    # Ruscha  
/en/articles/...    # Inglizcha
```
