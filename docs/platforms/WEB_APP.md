# Web Application

> **Versiya:** 1.0  
> **Yangilangan:** 2026-02-20

---

## Umumiy Korinish

Aishunos web ilovasi Next.js 16 asosida qurilgan va canonical backend sifatida `apps/api` (NestJS) bilan ishlaydi.

---

## Tech Stack

| Technology | Version | Maqsad |
|------------|---------|--------|
| Next.js | 16.1.1 | Framework |
| React | 19.x | UI Library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| next-intl | 4.x | i18n |
| Backend API | NestJS 11.x | REST endpoints |
| Prisma | 7.4.0 | ORM (backend) |

---

## Features

### Implemented ✅

- [x] Server-side rendering (SSR)
- [x] Static generation (SSG) 
- [x] Responsive design
- [x] Dark/Light mode
- [x] Multi-language (uz, ru, en)
- [x] SEO optimization
- [x] Article listing
- [x] Article detail page
- [x] Category filtering
- [x] Basic search

### In Progress 🔄

- [ ] Advanced search
- [ ] User bookmarks
- [ ] Social sharing
- [ ] Comments

---

## Pages

| Route | Tavsif |
|-------|--------|
| `/` | Home - Featured articles |
| `/articles/[slug]` | Article detail |
| `/about` | About page |
| `/contact` | Contact page |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

---

## Performance

### Core Web Vitals Targets

| Metric | Target | Current |
|--------|--------|---------|
| LCP | < 2.5s | ~2.2s |
| FID | < 100ms | ~50ms |
| CLS | < 0.1 | ~0.05 |

### Optimizations

- Image optimization (next/image)
- Font optimization (next/font)
- Code splitting
- Edge caching

---

## Deployment

- **Platform:** Vercel
- **URL:** https://aishunos.uz
- **Auto-deploy:** main branch

---

## Local Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

---

## Environment Variables

```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=https://aishunos.uz
```
