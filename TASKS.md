# Refactor Tasks Backlog

## P0 (Darhol bajariladi)
- [x] `apps/web/src/app/api/admin/*` endpointlariga majburiy auth guard qo'shish.
- [x] `apps/web/src/lib/admin/auth.ts` plain secret cookie modelini imzolangan sessionga almashtirish.
- [x] `apps/web/src/app/api/news/sync/route.ts` va `apps/web/src/app/api/news/process/route.ts` endpointlarini yopish (auth + rate limit).
- [x] `apps/web/src/app/[locale]/tg/article/[slug]/page.tsx` da sanitize qo'llash.
- [x] `apps/mobile/App.tsx` dagi `div/h2/pre` elementlarini RN komponentlariga almashtirish.
- [x] `pnpm lint` errorlarini nolga tushirish.

## P1 (Muhim arxitektura ishlari)
- [x] API contractni standartlash va `packages/api-types` bilan to'liq moslashtirish.
- [x] `PipelineRun` modeliga write path qo'shish (`create/update`).
- [x] `apps/web/src/lib/news/services/news-pipeline.service.ts` va cron posting mantiqini birlashtirish.
- [x] `apps/web/src/components/category-nav.tsx` va web route'lar mosligini tiklash.
- [x] Locale-safe link policy joriy etish (`next-intl` navigation orqali).
- [x] Dublikat util va configlarni konsolidatsiya qilish.

## P2 (Scale va operatsion yaxshilash)
- [x] Prisma indekslarini qo'shish va migration yozish.
- [x] `apps/web/src/lib/admin/usage-tracker.ts` agregatsiyalarini DB darajasiga o'tkazish.
- [x] In-memory rate limitdan distributed yechimga o'tish (Redis).
- [x] Cron schedule va retry strategiyasini production budgetga moslash.
- [x] Docker/Nginx production shablonlarini qo'shish.
- [x] CI pipeline (`type-check`, `lint`, `test`, `build`, migration gate) qo'shish.

## Har Sprint Oxiri Majburiy Tekshiruv
1. `pnpm type-check`
2. `pnpm lint`
3. `pnpm --filter @news-app/web build`
4. Smoke testlar
