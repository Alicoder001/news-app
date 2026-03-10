# Category Model
> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Maqsad

Category modeli maqolalarni turkumlash uchun ishlatiladi. Har bir maqola bitta kategoriyaga tegishli bo'lishi mumkin.

---

## Prisma Schema

\\\prisma
model Category {
  id          String    @id @default(cuid())
  slug        String    @unique
  name        String    // "Sun'iy Intellekt"
  nameEn      String?   // For future i18n
  description String?   @db.Text
  icon        String?   // Emoji or icon name
  color       String?   // Hex color
  articles    Article[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([slug])
}
\\\

---

## Maydonlar

| Maydon | Turi | Tavsif | Majburiy |
|--------|------|--------|----------|
| \id\ | String | Unique ID (CUID) | ✅ Auto |
| \slug\ | String | URL-friendly nom | ✅ |
| \
ame\ | String | Ko'rsatiladigan nom | ✅ |
| \
ameEn\ | String? | Inglizcha nom (i18n) | ❌ |
| \description\ | String? | Kategoriya tavsifi | ❌ |
| \icon\ | String? | Emoji yoki icon nomi | ❌ |
| \color\ | String? | Hex rang kodi | ❌ |
| \rticles\ | Article[] | Bog'liq maqolalar | Auto |
| \createdAt\ | DateTime | Yaratilgan vaqt | ✅ Auto |
| \updatedAt\ | DateTime | Yangilangan vaqt | ✅ Auto |

---

## Mavjud Kategoriyalar

| Slug | Nom | Icon | Rang |
|------|-----|------|------|
| \i\ | Sun'iy Intellekt | 🤖 | #8B5CF6 |
| \web\ | Web Dasturlash | 🌐 | #3B82F6 |
| \mobile\ | Mobil Ilovalar | 📱 | #10B981 |
| \cloud\ | Cloud & DevOps | ☁️ | #6366F1 |
| \security\ | Xavfsizlik | 🔒 | #EF4444 |
| \data\ | Data Science | 📊 | #F59E0B |

---

## API Endpoints

### Kategoriyalar ro'yxati
\\\
GET /api/categories
\\\

**Response:**
\\\json
{
  "categories": [
    {
      "id": "clx123...",
      "slug": "ai",
      "name": "Sun'iy Intellekt",
      "icon": "🤖",
      "color": "#8B5CF6",
      "articleCount": 45
    }
  ]
}
\\\

---

## TypeScript Interface

\\\	ypescript
interface Category {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  description?: string;
  icon?: string;
  color?: string;
  articleCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
\\\

---

## Bog'liq Hujjatlar

- [Article Model](./ARTICLE.md) - Maqola modeli
- [API Endpoints](../api/ENDPOINTS.md) - Kategoriya API
