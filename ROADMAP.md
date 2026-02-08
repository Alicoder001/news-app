# Production Refactor Roadmap

## Maqsad
Ushbu roadmap tizimni xavfsiz, kengayuvchan va production-ready holatga olib chiqish uchun bosqichma-bosqich ish rejasini beradi.

## Branch Strategiyasi
1. Yangi branch yarating: `refactor/production-audit`
2. Har bir bosqich alohida commitlar bilan yakunlansin.
3. Har bosqichdan keyin barqarorlik gate majburiy.

## Boshlang'ich Holat (Audit Snapshot)
- `pnpm type-check`: muvaffaqiyatli.
- `pnpm lint`: muvaffaqiyatli (error/warning yo'q).
- `pnpm --filter @news-app/web build`: muvaffaqiyatli.
- 400 qatordan uzun fayl yo'q.

## Joriy Progress (2026-02-07)
### Yakunlangan fazalar
1. Phase 0: Bazaviy stabilizatsiya (`type-check` va lint errorlar nolga tushirildi).
2. Phase 1: Security hardening:
   admin auth signed-session, admin API guard, cron/news endpoint auth+rate limit, CSRF origin check, wildcard CORS olib tashlandi.
3. Phase 2: Backend validatsiya bosqichi:
   admin login/source/article update endpointlariga Zod validatsiya qo'shildi, `PipelineRun` write-path joriy qilindi, public API contract standartlashtirildi.
4. Phase 3: Frontend/mobil kritik fixlar:
   TG article sanitize, locale-safe linklar, mobile category filter oqimi va pagination contract mosligi.
5. Phase 4: DB/performance:
   usage agregatsiyalari DB darajasiga ko'chirildi, indekslar schema'ga qo'shildi va migration fayli yaratildi.
6. Phase 5: DevOps tayyorlov:
   `Dockerfile`, `docker-compose.yml`, `infra/nginx/default.conf`, `CI workflow`, `GET /api/health` qo'shildi, cron schedule/retry productionga moslashtirildi.
7. P2 operatsion hardening:
   distributed rate-limit (Upstash Redis) fallback modeli joriy qilindi.

### Qolgan asosiy ishlar
1. Staging/prod muhitda migration deploy rehearsal.
2. Upstash Redis env'larini productionga ulab distributed rate-limitni aktiv qilish.

---

## Phase 0: Stabilizatsiya va Bazaviy Gate
### Vazifalar
1. Toolchain versiyalarini qat'iylashtirish (`node`, `pnpm`, `typescript`) va CI uchun lock.
2. `lint`, `type-check`, `build` skriptlarini har workspace uchun bir xil standartga keltirish.
3. Minimal test skeletini qo'shish (web API smoke test + mobile unit smoke).

### Barqarorlik Gate
1. `pnpm type-check`
2. `pnpm lint`
3. `pnpm --filter @news-app/web build`
4. Testlar (`pnpm test` yoki belgilangan smoke script)

---

## Phase 1: Security First (P0)
### Vazifalar
1. Admin API'larni to'liq himoyalash:
   `apps/web/src/app/api/admin/*` endpointlarida server-side auth middleware/guard joriy etish.
2. Admin auth modelini qayta qurish:
   plain secret cookie o'rniga imzolangan session (HMAC/JWT) va rotate qilinadigan token.
3. `api/news/sync` va `api/news/process` endpointlarini autentifikatsiya va rate-limit bilan yopish.
4. Maxfiy ma'lumot loglarini tozalash:
   API key prefikslarini chiqarishni to'xtatish.
5. CORS siyosatini qat'iylashtirish (`*` o'rniga allowlist originlar).
6. CSRF himoyasi (cookie bilan ishlaydigan admin mutatsiya endpointlari uchun).

### Barqarorlik Gate
1. `pnpm type-check`
2. `pnpm lint`
3. Security smoke test (unauthorized admin call -> 401)
4. `pnpm --filter @news-app/web build`

---

## Phase 2: Backend Refactor va API Contract
### Vazifalar
1. Route handlerlardan biznes logikani servis qatlamiga ajratish.
2. Barcha request/response uchun Zod validatsiya qo'shish.
3. API response formatini yagona contractga o'tkazish (`success/data/error` yoki RFC7807).
4. `PipelineRun` modelini real yozuv bilan ishlatish (start, complete, fail).
5. Telegram posting strategiyasini birlashtirish:
   `news-pipeline.service.ts` va `cron/telegram` o'rtasidagi dublikat oqimni bitta manbaga keltirish.
6. Error handling va observability:
   correlation-id, structured log, retry policy.

### Barqarorlik Gate
1. `pnpm type-check`
2. `pnpm lint`
3. API integration testlar
4. `pnpm --filter @news-app/web build`

---

## Phase 3: Frontend Arxitektura (FSD + Code Quality)
### Vazifalar
1. Web frontendni FSD bo'yicha qayta joylash:
   `features`, `entities`, `widgets`, `shared`, `pages`.
2. Router-link mosligini to'g'rilash:
   yo'q route'larga (`/category/*`, noto'g'ri `/article/*`) ketuvchi linklarni tuzatish.
3. Telegram article renderingda sanitize majburiy qilish.
4. Dublikat util/configlarni konsolidatsiya:
   `lib/utils.ts` vs `packages/shared`,
   `meta-image.ts` vs `image-extractor.ts`,
   branding (`Aishunos` vs `Antigravity`) birxillashtirish.
5. Mobile:
   - `App.tsx` dagi web elementlarni RN komponentlariga almashtirish.
   - API pagination contract mismatchni tuzatish.
   - Category screendan real filter oqimini ishlatish.
6. Lint errorlarni nolga tushirish.

### Barqarorlik Gate
1. `pnpm type-check`
2. `pnpm lint`
3. `pnpm --filter @news-app/web build`
4. Mobile smoke run

---

## Phase 4: Database va Scale
### Vazifalar
1. Indeks optimizatsiyasi:
   - `RawArticle(isProcessed, createdAt)`
   - `Article(telegramPosted, createdAt, importance)`
   - `NewsSource(isActive)`
2. Katta agregatsiyalarni DB darajasiga ko'chirish:
   `usage-tracker` ichidagi JS looplarni SQL aggregate/groupBy bilan almashtirish.
3. Retention va arxivlash siyosati:
   `RawArticle`, `AIUsage`, `PipelineRun` uchun TTL/archiving.
4. Hot endpointlar uchun cache (Redis yoki platform cache) va invalidation.
5. Query performance observability (`EXPLAIN ANALYZE` asosida tuning).

### Barqarorlik Gate
1. `pnpm type-check`
2. `pnpm lint`
3. Migration test (`prisma migrate deploy --dry-run` muqobili)
4. Load test (read-heavy + cron burst)

---

## Phase 5: DevOps va Deployment Hardening
### Vazifalar
1. Production infra fayllarini qo'shish:
   `Dockerfile`, `docker-compose.yml` (agar self-host kerak bo'lsa).
2. Nginx konfiguratsiya shabloni:
   reverse proxy, gzip/brotli, cache-control, rate limiting, SSL redirect.
3. CI/CD pipeline:
   PR gate (`type-check`, `lint`, `test`, `build`), migration safety, deploy gates.
4. Secrets management:
   env scanning, rotatsiya, non-prod/prod ajratish.
5. Monitoring:
   health endpoint, uptime alert, structured logs, error tracking.
6. Cron strategiyasini qayta ko'rib chiqish:
   `*/1` schedule ni xarajat va API limitga moslash.

### Barqarorlik Gate
1. `pnpm type-check`
2. `pnpm lint`
3. `pnpm --filter @news-app/web build`
4. Deploy rehearsal (staging)

---

## Phase 6: Release Readiness
### Vazifalar
1. End-to-end regression testlar.
2. Security checklist (OWASP top risklar bo'yicha).
3. Performance SLO tasdiqlash (LCP, API latency, cron success rate).
4. Operatsion runbook:
   incident, rollback, key rotation, migration rollback.
5. Final UAT va production cutover.

### Yakuniy Gate
1. Barcha quality gate'lar yashil.
2. Staging 72 soat incidentsiz ishlashi.
3. Production release sign-off.
