# Deployment Guide

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Platformalar

| Platform | Maqsad | URL |
|----------|--------|-----|
| **Vercel** | Web App, API | aishunos.uz |
| **Neon** | PostgreSQL Database | - |
| **Cloudflare** | DNS, CDN | - |

---

## Environments

| Environment | Branch | URL | Auto-deploy |
|-------------|--------|-----|-------------|
| Production | \main\ | aishunos.uz | ✅ |
| Staging | \develop\ | staging.aishunos.uz | ✅ |
| Preview | PR branches | *.vercel.app | ✅ |

---

## Vercel Deployment

### Auto-deploy

\\\
Push to main → Vercel builds → Deploy to production
Push to develop → Vercel builds → Deploy to staging
Open PR → Vercel builds → Preview URL
\\\

### Manual Deploy

\\\ash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod
\\\

### Build Settings

\\\json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
\\\

---

## Environment Variables

### Required Variables

\\\env
# Database
DATABASE_URL=postgresql://...

# OpenAI
OPENAI_API_KEY=sk-...

# Telegram
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHANNEL_ID=...

# News APIs
GNEWS_API_KEY=...
NEWSAPI_KEY=...

# App
NEXT_PUBLIC_APP_URL=https://aishunos.uz
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=aishunos_bot
\\\

### Vercel da O'rnatish

1. Project Settings → Environment Variables
2. Har bir variable uchun:
   - Name: \DATABASE_URL\
   - Value: \postgresql://...\
   - Environment: Production / Preview / Development

---

## Database (Neon)

### Connection

\\\env
# Pooled connection (for serverless)
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require

# Direct connection (for migrations)
DIRECT_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require
\\\

### Migrations

\\\ash
# Development
pnpm db:migrate:dev

# Production (in CI/CD)
pnpm db:migrate:deploy

# Generate client
pnpm db:generate
\\\

---

## CI/CD Pipeline

### GitHub Actions

\\\yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test
\\\

---

## Deploy Checklist

### Pre-deploy

- [ ] All tests passing
- [ ] Type check passing
- [ ] Lint passing
- [ ] PR approved
- [ ] Database migrations ready

### Post-deploy

- [ ] Verify deployment URL
- [ ] Check error logs
- [ ] Test critical paths
- [ ] Monitor performance

---

## Rollback

### Vercel

\\\ash
# Vercel Dashboard → Deployments
# Find previous deployment → Promote to Production

# Or via CLI
vercel rollback
\\\

### Database

\\\ash
# Revert last migration (development only)
pnpm prisma migrate reset

# Production: Manual SQL scripts
\\\

---

## Monitoring

### Vercel Analytics

- Real-time traffic
- Core Web Vitals
- Error tracking

### Logs

\\\ash
# View logs
vercel logs

# View logs for specific deployment
vercel logs <deployment-url>
\\\

---

## Domain Setup

### DNS (Cloudflare)

\\\
Type: CNAME
Name: @
Target: cname.vercel-dns.com

Type: CNAME
Name: www
Target: cname.vercel-dns.com
\\\

### SSL

- Vercel provides automatic SSL
- Cloudflare: SSL/TLS → Full (strict)

---

## Bog'liq Hujjatlar

- [Git Workflow](./GIT_WORKFLOW.md) - Branch strategiyasi
- [Testing](./TESTING.md) - Test strategiyasi
