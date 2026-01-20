# Image Utilities

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Maqsad

Rasm bilan ishlash uchun yordamchi funksiyalar - maqolalardan rasm olish, OG images, va validatsiya.

---

## Fayl Joylashuvi

```
apps/web/src/lib/news/utils/
├── image-extractor.ts  # Maqoladan rasm olish
└── meta-image.ts       # OG/meta images
```

---

## Image Extractor

Maqola kontentidan rasmlarni ajratib olish.

### extractImages

```typescript
interface ExtractedImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  source: 'content' | 'meta' | 'enclosure';
}

function extractImages(
  content: string,
  metadata?: Record<string, unknown>
): ExtractedImage[]
```

### getBestImage

Eng yaxshi rasmni tanlash.

```typescript
function getBestImage(images: ExtractedImage[]): ExtractedImage | null
```

---

## Meta Image

OG va Twitter card rasmlarini olish.

### getMetaImage

```typescript
interface MetaImageOptions {
  url: string;
  timeout?: number;
}

async function getMetaImage(options: MetaImageOptions): Promise<string | null>
```

---

## Foydalanish

```typescript
import { extractImages, getBestImage } from '@/lib/news/utils/image-extractor';
import { getMetaImage } from '@/lib/news/utils/meta-image';

// Kontentdan rasmlar
const images = extractImages(article.content, article.metadata);
const mainImage = getBestImage(images);

// OG image olish
const ogImage = await getMetaImage({ url: article.url });

// Final image
const imageUrl = mainImage?.url || ogImage || '/default-article.jpg';
```

---

## Image Validation

```typescript
function isValidImageUrl(url: string): boolean {
  // Check extension
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  
  // Check domain (block known bad sources)
  const blockedDomains = ['tracking.com', 'pixel.gif'];
  
  // Check size (if available)
  // Minimum 200x200 recommended
}
```

---

## Image Priority

1. `og:image` meta tag
2. `twitter:image` meta tag
3. First content image > 400px
4. RSS enclosure image
5. Default placeholder

---

## Bogliq Hujjatlar

- [News Pipeline](../services/NEWS_PIPELINE.md) - Image processing
- [Article Model](../models/ARTICLE.md) - imageUrl field
