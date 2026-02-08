# To'liq Audit va Amalga Oshirish Rejasi

## 1) Loyiha maqsadi va arxitekturasi (Phase 1)
Loyiha AI yordamida IT yangiliklarni yig'ish, qayta ishlash, publish qilish va Telegram ekotizimida tarqatish uchun qurilgan monorepo.

Asosiy qatlamlar:
1. Web + API (`apps/web`) - Next.js App Router, public sayt, Telegram Mini App, admin panel.
2. Mobile (`apps/mobile`) - Expo/React Native mijoz.
3. Shared paketlar (`packages/*`) - tiplar, i18n, util'lar.
4. Data layer (`prisma`) - PostgreSQL + Prisma.

Asosiy oqim:
1. Providerlar yangiliklarni oladi.
2. `RawArticle` ga saqlanadi.
3. AI orqali qayta ishlanadi va `Article` yaratiladi.
4. Telegramga post qilinadi.

---

## 2) Frontend chuqur audit (Phase 2)

### Kritik topilmalar
1. Telegram article sahifasida sanitize yo'q, to'g'ridan-to'g'ri HTML render qilinadi.
   Manba: `apps/web/src/app/[locale]/tg/article/[slug]/page.tsx:142`
2. Web va TG linklarida route nomuvofiqligi bor (broken navigation xavfi).
   Manbalar:
   `apps/web/src/components/category-nav.tsx:35`,
   `apps/web/src/app/[locale]/tg/article/[slug]/page.tsx:92`,
   `apps/web/src/app/[locale]/tg/article/[slug]/page.tsx:182`
3. Mobile app ErrorBoundary ichida React Nativega mos bo'lmagan DOM elementlar ishlatilgan (`div/h2/pre`).
   Manba: `apps/mobile/App.tsx:45`

### Yuqori prioritet topilmalar
1. Mobile API contract mismatch:
   `useQueries` `lastPage.total` kutadi, API esa boshqa strukturada qaytaradi.
   Manbalar:
   `apps/mobile/src/hooks/useQueries.ts:21`,
   `apps/mobile/src/api/client.ts:49`
2. Category screen kategoriyani filterga uzatmaydi, faqat `Home`ga qaytadi.
   Manba: `apps/mobile/src/screens/CategoriesScreen.tsx:33`
3. TG settings sahifasida placeholder/hardcoded ma'lumotlar bor.
   Manba: `apps/web/src/app/[locale]/tg/settings/page.tsx:56`
4. Dublikat util/config qatlamlari mavjud (DRY buzilgan).
   Manbalar:
   `apps/web/src/lib/utils.ts`,
   `packages/shared/src/utils/index.ts`,
   `apps/web/src/lib/news/utils/meta-image.ts`,
   `apps/web/src/lib/news/utils/image-extractor.ts`

### FSD/SOLID bo'yicha holat
1. Hozirgi tuzilma FSD emas (`app/components/lib` markazida yassi joylashuv).
2. UI, data access, orchestration qatlamlari aniq boundarysiz aralashgan.
3. Route handlerlarda domain logika ko'p, bu testlash va kengaytirishni qiyinlashtiradi.

### File size talabi (>400 qator)
Audit natijasi: 400 qatordan oshgan fayl topilmadi.
Eng yiriklar:
1. `apps/mobile/src/screens/ArticleScreen.tsx` (325 qator)
2. `apps/mobile/src/screens/HomeScreen.tsx` (314 qator)
3. `apps/mobile/src/screens/SettingsScreen.tsx` (304 qator)
4. `prisma/seed.ts` (303 qator)
5. `apps/web/src/lib/news/services/ai.service.ts` (298 qator)

---

## 3) Backend chuqur audit (Phase 3)

### Kritik xavfsizlik topilmalari
1. Admin API endpointlarida auth tekshiruvi yo'q (UI auth bor, API auth yo'q).
   Manbalar:
   `apps/web/src/app/api/admin/sources/route.ts:5`,
   `apps/web/src/app/api/admin/sources/[id]/route.ts:5`,
   `apps/web/src/app/api/admin/articles/[id]/route.ts:5`
2. Admin secret cookie ichida plain saqlanadi.
   Manbalar:
   `apps/web/src/lib/admin/auth.ts:49`,
   `apps/web/src/lib/admin/auth.ts:40`
3. Qimmat endpointlar public ochiq:
   `api/news/sync` va `api/news/process` authsiz trigger bo'ladi.
   Manbalar:
   `apps/web/src/app/api/news/sync/route.ts:24`,
   `apps/web/src/app/api/news/process/route.ts:31`
4. API key holati loglarda qisman chiqariladi.
   Manbalar:
   `apps/web/src/app/api/cron/news/route.ts:70`,
   `apps/web/src/lib/news/providers/thenewsapi.provider.ts:73`

### Arxitektura va maintainability topilmalari
1. `PipelineRun` modeli o'qiladi, lekin create/update path yo'q (monitoring noto'liq).
   Manbalar:
   `prisma/schema.prisma:130`,
   searchda `pipelineRun.create/update` topilmadi.
2. Telegram posting ikki joyda yuritiladi (pipeline ichida ham, alohida cron ham).
   Manbalar:
   `apps/web/src/lib/news/services/news-pipeline.service.ts:184`,
   `apps/web/src/app/api/cron/telegram/route.ts:93`
3. In-memory rate limiter ko'p instansli productionda ishlamaydi.
   Manba: `apps/web/src/lib/rate-limit.ts:16`
4. Input validatsiya bir xil emas; ko'p endpointlarda body/query bevosita ishlatiladi.

### Ishlash samaradorligi topilmalari
1. `limit/page` qiymatlari bound qilinmagan (abuse xavfi).
   Manba: `apps/web/src/app/api/articles/route.ts:7`
2. Usage agregatsiyalari JS loopda hisoblanadi (katta hajmda sekin).
   Manba: `apps/web/src/lib/admin/usage-tracker.ts:95`
3. `newsManager` import vaqtida provider instantiate qiladi (build/runtime side-effect).
   Manba: `apps/web/src/lib/news/news-manager.ts:159`

---

## 4) Database va scalability audit (Phase 4)

### Schema holati
1. Asosiy bog'lanishlar to'g'ri (`NewsSource -> RawArticle -> Article`, category/tag M:N).
2. Unique constraintlar bor (`slug`, `url`, `rawArticleId`).

### Indeks bo'shliqlari
1. `RawArticle` uchun `isProcessed + createdAt` kompozit indeks yo'q.
   Manbalar:
   `apps/web/src/lib/news/repositories/raw-article.repository.ts:43`,
   `prisma/schema.prisma:39`
2. Telegram cron query pattern uchun indeks yo'q (`telegramPosted`, `createdAt`, `importance`).
   Manbalar:
   `apps/web/src/app/api/cron/telegram/route.ts:66`,
   `prisma/schema.prisma:97`
3. `NewsSource.isActive` bo'yicha tez-tez filter bo'ladi, indeks tavsiya etiladi.

### N+1 va nooptimal patternlar
1. `usage-tracker`da katta oralik uchun barcha satrlarni yuklab memoryda group qilinadi.
2. Pipeline har maqolada category lookup qiladi; batch cache bilan kamaytirish mumkin.

### O(1) yaqinlashuv tavsiyalari
1. Hot read endpointlar uchun key-based cache (`article:slug`, `category:list`) joriy etish.
2. Idempotent update va aggregate counterlar uchun Redis/in-memory emas, shared store.
3. Prerender + cache invalidation siyosatini aniq belgilash.

---

## 5) DevOps va deployment readiness (Phase 5)

### Hozirgi holat
1. Repo ichida Docker/Nginx infra fayllari yo'q.
2. Cron schedule juda agressiv (`*/1`).
   Manba: `vercel.json:6`
3. Versiya hujjatlari kod bilan mos emas (drift).
   Manbalar:
   `docs/platforms/WEB_APP.md:18`,
   `apps/web/package.json`
4. CI workflow mavjud emas (`.github` papkasi yo'q).

### Production-ready bo'lishi uchun zarur ishlar
1. CI gate (`type-check`, `lint`, `test`, `build`, migration check).
2. Secret rotation va env governance.
3. Monitoring/alerting (error rate, cron success rate, latency, DB saturation).
4. Agar self-host bo'lsa:
   Nginx reverse proxy, TLS redirect, gzip/brotli, rate-limit, cache-control.

---

## 6) Tavsiya etilgan implementatsiya tartibi (Phase 6)
1. P0 Security fixlar.
2. API contract + backend boundary refactor.
3. Frontend routing va sanitize fixlari.
4. DB indeks/migration + cache.
5. DevOps hardening + CI.
6. Final regression va production cutover.

Har bosqichdan keyin majburiy:
1. `pnpm type-check`
2. `pnpm lint`
3. `pnpm --filter @news-app/web build`
4. Smoke/integration test

---

## Amaldagi Bajarilish Holati (2026-02-07)

### Phase 1 (Security First) - Bajarildi
1. Admin API route'lar auth guard bilan himoyalandi.
2. Signed session cookie modeli joriy qilindi (`admin_auth` HMAC).
3. `api/news/sync` va `api/news/process` auth + rate limit bilan yopildi.
4. Maxfiy key fragment loglari olib tashlandi.
5. Wildcard CORS allowlist helper bilan almashtirildi.

### Phase 2 (Backend Contract) - Qisman bajarildi
1. Admin login/source/article update endpointlariga Zod validatsiya qo'shildi.
2. Invalid JSON/invalid body holatlari uchun 400 javoblar standartlashtirildi.
3. `PipelineRun` modeliga real write-path qo'shildi (`RUNNING/COMPLETED/FAILED`, duration, AI usage metrikalari).
4. Public API contract `data/pagination` formatiga o'tkazildi va mobile client moslashtirildi.

### Phase 3 (Frontend/Mobile) - Kritik bandlar bajarildi
1. TG article sahifasida `sanitizeHtml` joriy qilindi.
2. TG route'lar locale-safe linklarga o'tkazildi.
3. Mobile `useQueries` pagination contract backend javobiga moslashtirildi.
4. Categories -> Home filter oqimi `categorySlug` param bilan ishlaydi.

### Phase 4 (DB/Scale) - Qisman bajarildi
1. `usage-tracker` agregatsiyalari `groupBy` va SQL aggregate bilan optimizatsiya qilindi.
2. Schema'ga indekslar qo'shildi:
   `NewsSource(isActive)`, `RawArticle(isProcessed, createdAt)`, `Article(telegramPosted, createdAt, importance)`.
3. Migration fayli yaratildi: `prisma/migrations/20260208_add_prod_indexes_and_cleanup/migration.sql`.
4. Rate limiting distributed rejimga tayyorlandi (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` bilan).

### Phase 5 (DevOps) - Bajarildi
1. `Dockerfile` (multi-stage, Next standalone).
2. `docker-compose.yml` (web + nginx).
3. `infra/nginx/default.conf` (reverse proxy, gzip, cache, rate limit, security headers).
4. `.github/workflows/ci.yml` qo'shildi.
5. `GET /api/health` endpoint qo'shildi.
6. `vercel.json` cron jadvali production budgetga moslashtirildi (`*/15` va soatlik post).

### Verifikatsiya holati
1. Har fazadan keyin `pnpm type-check` muvaffaqiyatli.
2. Har fazadan keyin `pnpm lint` muvaffaqiyatli (error/warning yo'q).
3. Har fazadan keyin `pnpm --filter @news-app/web build` muvaffaqiyatli.
4. Prisma migration deploy tekshirildi: `pnpm prisma migrate deploy --schema prisma/schema.prisma` muvaffaqiyatli.
