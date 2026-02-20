# Roadmap

## Work Item
- ID: WI-2026-02-13-NESTJS-FULL-MIGRATION
- Name: NestJS Full Migration (DDD)
- Status: Completed
- Start Date: 2026-02-13

## Goal
`apps/web` ichidagi backend business logikani bosqichma-bosqich `apps/api` (`NestJS`) ga ko'chirish va yakunda `apps/web` ichida `Prisma` ishlatilmasligini ta'minlash.

## Guiding Decisions
1. Backward compatibility saqlanadi (`/api/*` route lar vaqtincha adapter/proxy bo'ladi).
2. Canonical backend API `apps/api` da `/v1/*` prefiks bilan bo'ladi.
3. Admin va internal endpointlar `JWT + RBAC` bilan himoyalanadi.
4. Pipeline `Queue + Worker` modeli (`BullMQ + Redis`) ga o'tadi.
5. Final cutover mezoni: `apps/web` ichida `import prisma` bo'lmasligi.

## Branch Strategy
1. Epic branch: `feature/nestjs-full-migration`
2. Phase branch pattern: `feature/nestjs-migration-p{N}-{short-name}`
3. Har phase yakunida phase branch -> epic branch PR
4. Epic yakunida epic branch -> `master` release PR

## Milestones
1. M0: Phase 0 - Work item, ADR, quality gate
2. M1: Phase 1 - `apps/api` DDD skeleton + health/readiness + Swagger
3. M2: Phase 2 - Identity, JWT, RBAC, audit
4. M3: Phase 3 - Content read APIs (`articles/categories/view`) + compatibility adapters
5. M4: Phase 4 - Admin write APIs migration
6. M5: Phase 5 - Queue/worker pipeline va scheduler migration
7. M6: Phase 6 - Web Prisma decoupling complete
8. M7: Phase 7 - Mobile API contract cutover
9. M8: Phase 8 - Cleanup va full cutover
10. M9: Phase 9 - Prisma 7 controlled upgrade

## Phase-by-Phase Plan

### Phase 0 - Foundation
- Work-item hujjatlarini yaratish.
- ADR larni hujjatlashtirish.
- Branch strategiyasini ishga tushirish.
- Gate:
```bash
pnpm -r type-check
pnpm -r build
```

### Phase 1 - API Bootstrap
- `apps/api` NestJS 11.x ilovasini yaratish.
- DDD qatlam skeletonlari (`domain`, `application`, `infrastructure`, `presentation`) ni contextlar bo'yicha kiritish.
- Global `ValidationPipe`, `HttpExceptionFilter`, env validation.
- `/v1/health`, `/v1/readiness`, `/v1/docs` endpointlari.
- Gate:
```bash
pnpm --filter @news-app/api type-check
pnpm --filter @news-app/api build
pnpm -r type-check
pnpm -r build
```

### Phase 2 - Identity & Security
- JWT access/refresh, token rotation.
- RBAC guard va admin authorization boundary.
- Audit log stream (admin actions).
- Next admin API unauthorized access risklarini yopish.

### Phase 3 - Content Read APIs
- `GET /v1/articles`
- `GET /v1/articles/:slug`
- `GET /v1/articles/featured`
- `POST /v1/articles/view`
- `GET /v1/categories`
- `packages/api-types` ni canonical DTO lar bilan kengaytirish.
- Next API route larni business logicdan tozalab adapterga o'tkazish.

### Phase 4 - Admin Write APIs
- Source CRUD va article admin mutations Nestga o'tkazish.
- Manual Telegram posting endpoint migration.
- Admin UI fetch oqimini Nestga yo'naltirish.

### Phase 5 - Ingestion, Processing, Distribution
- Queue jobs: `sync-news`, `process-raw`, `telegram-post`.
- Retry, backoff, dead-letter, idempotency lock.
- Vercel cron -> backend trigger/scheduler oqimi.
- Prod schedule default:
  - News: `*/15 * * * *`
  - Telegram: `0 * * * *`

### Phase 6 - Web Prisma Decoupling
- `apps/web` dagi barcha direct DB access o'chiriladi.
- Server components data fetch uchun typed API clientga o'tkaziladi.
- Lint rule: `apps/web` ichida `@/lib/prisma` import taqiqi.

### Phase 7 - Mobile Cutover
- Mobile API client canonical API contractga o'tadi.
- Pagination/shape mismatchlar yakuniy fix qilinadi.
- API URL strategiyasi production uchun standartlashtiriladi.

### Phase 8 - Cleanup
- Next API business logicni nolga tushirish.
- Docs va architecture hujjatlarini code bilan sinxronlash.
- Performance va security yakuniy hardening.

### Phase 9 - Prisma 7 Upgrade
- `prisma` va `@prisma/client` ni `7.4.0` ga controlled upgrade.
- Migration, generate, regression tekshiruvlar.

## Risks
1. API contract drift (legacy vs canonical mismatch)
2. Auth migration regressions
3. Queue operational complexity (Redis dependency)
4. SEO/SSR performance regressions after Prisma decoupling
5. Large-bang changesni parallel branchlarda conflictlar

## Mitigation
1. Contract tests (`/api/*` va `/v1/*` parity snapshots)
2. Har phase yakunida mandatory type/build gates
3. Auth e2e va unauthorized access regression tests
4. Queue uchun retry/dead-letter va observability baseline
5. Small phase PR strategy, branch discipline

## Rollback Strategy
1. Har phase mustaqil branch bo'lganligi uchun selective rollback qilinadi.
2. Compatibility adapterlar saqlanadi: canonical API issue bo'lsa legacy oqimga qaytish mumkin.
3. Scheduler migrationda dual-run window qo'llanadi (short period).
4. Cutover oldidan tag/release checkpoint olinadi.

## Execution Status (2026-02-13)
1. Phase 0-9 implementatsiyasi yakunlandi.
2. Mandatory gatelar yakuniy holatda yashil:
   - `pnpm --filter @news-app/api type-check`
   - `pnpm --filter @news-app/api build`
   - `pnpm -r type-check`
   - `pnpm -r build`
3. Qo'shimcha verifikatsiya testlari:
   - API auth e2e va RBAC e2e.
   - Legacy adapter contract snapshot testi.
   - Worker integration testlari (dry-run + idempotency).
   - Mobile API smoke testi.
