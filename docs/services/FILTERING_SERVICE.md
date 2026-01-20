# Filtering Service

> **Versiya:** 1.1  
> **Yangilangan:** 2026-01-20

---

## Maqsad

Filtering Service maqolalarni qayta ishlashdan oldin filtrlaydi - clickbait, reklama va past sifatli kontentni olib tashlaydi.

---

## Fayl Joylashuvi

```
apps/web/src/lib/news/services/filtering.service.ts
```

---

## Asosiy Funksiya

### shouldProcess

Maqola qayta ishlanishi kerakmi - tekshiradi.

```typescript
static shouldProcess(article: { 
  title: string; 
  description: string | null 
}): boolean
```

**Qaytaradi:** `true` - qayta ishlash kerak, `false` - otkazib yuborish

---

## Filtrlash Qoidalari

### 1. Noise Keywords (Shovqin sozlar)

Quyidagi sozlar mavjud bolsa - REJECT:

```typescript
private static noiseKeywords = [
  'deal',      // Chegirma
  'price',     // Narx
  'discount',  // Skidka
  'buy',       // Sotib olish
  'offer',     // Taklif
  'sale',      // Sotuv
  'cheap',     // Arzon
  'vouchers',  // Kuponlar
  'gift',      // Sovga
  'coupon',    // Kupon
  'giveaway'   // Bepul tarqatish
];
```

### 2. Minimal Title Length

Sarlavha 20 belgidan kam bolsa - REJECT:

```typescript
if (article.title.length < 20) return false;
```

---

## Foydalanish

```typescript
import { FilteringService } from '@/lib/news/services/filtering.service';

// Pipeline ichida
const rawArticles = await RawArticleRepository.getUnprocessed(10);

for (const raw of rawArticles) {
  // Filtrlash tekshiruvi
  if (!FilteringService.shouldProcess({
    title: raw.title,
    description: raw.description
  })) {
    console.log(`⏭️ Skipped: "${raw.title}" (filtered)`);
    await RawArticleRepository.markAsProcessed(raw.id);
    continue;
  }
  
  // AI qayta ishlash
  const result = await AIService.processArticle(raw);
  // ...
}
```

---

## Filter Statistics

Pipeline run da filtrlangan maqolalar soni saqlanadi:

```typescript
// PipelineRun model
{
  articlesFound: 50,      // Jami topilgan
  articlesProcessed: 35,  // AI qayta ishlagan
  articlesSkipped: 15,    // Filtrlangan
}
```

---

## Kengaytirish Imkoniyatlari

Hozirgi implementatsiya oddiy, kelajakda qoshilishi mumkin:

```typescript
// TODO: Kengaytirilgan filtrlash
class FilteringService {
  // Til tekshirish
  static isEnglish(text: string): boolean { }
  
  // Dublikat tekshirish (similarity)
  static isDuplicate(title: string, existingTitles: string[]): boolean { }
  
  // Spam detection
  static isSpam(content: string): boolean { }
  
  // Relevance scoring
  static getRelevanceScore(article: RawArticle): number { }
}
```

---

## Bogliq Hujjatlar

- [News Pipeline](./NEWS_PIPELINE.md) - Pipeline integratsiyasi
- [RawArticle Model](../models/RAW_ARTICLE.md) - Filtrlangan maqolalar
