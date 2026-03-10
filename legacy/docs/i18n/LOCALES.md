# Locales

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Tarjima Fayllari

### Struktura

```json
{
  "Common": {
    "loading": "Yuklanmoqda...",
    "error": "Xatolik yuz berdi",
    "retry": "Qayta urinish",
    "search": "Qidirish",
    "categories": "Kategoriyalar",
    "readMore": "Batafsil"
  },
  "HomePage": {
    "title": "Texnologiya Yangiliklari",
    "subtitle": "Suniy intellekt va dasturlash haqida",
    "featured": "Tanlangan maqolalar",
    "latest": "Soʻnggi yangiliklar"
  },
  "Article": {
    "publishedAt": "Nashr qilingan",
    "author": "Muallif",
    "share": "Ulashish",
    "save": "Saqlash",
    "related": "Aloqador maqolalar"
  },
  "Categories": {
    "ai": "Suniy Intellekt",
    "web": "Web Dasturlash",
    "mobile": "Mobil Ilovalar",
    "cloud": "Cloud va DevOps",
    "security": "Xavfsizlik",
    "data": "Data Science"
  },
  "Footer": {
    "about": "Biz haqimizda",
    "contact": "Aloqa",
    "privacy": "Maxfiylik",
    "terms": "Foydalanish shartlari"
  }
}
```

---

## Til Qoshish

### 1. Locale fayl yaratish

```bash
# messages/kr.json yaratish (Korean misol)
cp apps/web/messages/en.json apps/web/messages/kr.json
```

### 2. Routing yangilash

```typescript
// src/i18n/routing.ts
export const locales = ['uz', 'ru', 'en', 'kr'] as const;
```

### 3. Tarjima qilish

Barcha kalit-qiymatlarni tarjima qiling.

---

## Pluralization

```json
{
  "articles": {
    "count": "{count, plural, =0 {Maqola yoq} =1 {1 ta maqola} other {# ta maqola}}"
  }
}
```

```tsx
t('articles.count', { count: 5 }) // "5 ta maqola"
```

---

## Sana Formatlash

```tsx
import { useFormatter } from 'next-intl';

function DateDisplay({ date }) {
  const format = useFormatter();
  return <time>{format.dateTime(date, { dateStyle: 'long' })}</time>;
}

// uz: "20-yanvar 2026-yil"
// ru: "20 января 2026 г."
// en: "January 20, 2026"
```

---

## Boglanish

- [next-intl docs](https://next-intl-docs.vercel.app/)
