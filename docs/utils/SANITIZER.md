# HTML Sanitizer

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Maqsad

Sanitizer foydalanuvchi kiritgan yoki tashqi manbalardan kelgan HTML kontentni XSS hujumlardan himoya qiladi.

---

## Fayl Joylashuvi

```
apps/web/src/lib/sanitize.ts
```

---

## Asosiy Funksiyalar

### sanitizeHtml

```typescript
interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  stripEmpty?: boolean;
}

function sanitizeHtml(
  html: string,
  options?: SanitizeOptions
): string
```

### sanitizeText

```typescript
// Barcha HTML teglarini olib tashlash
function sanitizeText(html: string): string
```

---

## Default Konfiguratsiya

```typescript
const defaultOptions: SanitizeOptions = {
  allowedTags: [
    'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'code', 'pre',
    'img', 'figure', 'figcaption',
  ],
  allowedAttributes: {
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'width', 'height'],
  },
  stripEmpty: true,
};
```

---

## Foydalanish

```typescript
import { sanitizeHtml, sanitizeText } from '@/lib/sanitize';

// HTML kontentni tozalash
const cleanHtml = sanitizeHtml(rawHtml);

// Faqat text olish
const plainText = sanitizeText(rawHtml);

// Custom options
const strictClean = sanitizeHtml(rawHtml, {
  allowedTags: ['p', 'br', 'b', 'i'],
  allowedAttributes: {},
});
```

---

## XSS Himoya

Quyidagilar avtomatik tozalanadi:

```html
<!-- Input -->
<script>alert('xss')</script>
<img src="x" onerror="alert('xss')">
<a href="javascript:alert('xss')">Click</a>

<!-- Output -->
(completely removed)
<img src="x">
<a>Click</a>
```

---

## Bogliq Hujjatlar

- [Article Model](../models/ARTICLE.md) - Content storage
