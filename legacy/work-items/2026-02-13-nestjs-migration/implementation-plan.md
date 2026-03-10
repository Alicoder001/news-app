# Implementation Plan

## Work Item
- ID: WI-2026-02-13-NESTJS-FULL-MIGRATION
- Date: 2026-02-13
- Scope: `apps/api`, `apps/web`, `apps/mobile`, `packages/api-types`, `packages/api-client`, `docs/*`

## Objective
Monorepo ichida DDD tamoyillariga asoslangan alohida `NestJS` backendni ishga tushirish va barcha backend use-case larni bosqichma-bosqich unga ko'chirish.

## Target Architecture Contract

### Service Topology
1. `apps/api` - canonical backend (`NestJS 11.x`)
2. `apps/web` - UI + compatibility adapters (temporary)
3. `apps/mobile` - typed API client orqali canonical APIga ulanish
4. `packages/api-types` - shared request/response contracts
5. `packages/api-client` - shared typed API client (web/mobile)

### Bounded Contexts
1. `identity-access`
2. `content-catalog`
3. `source-ingestion`
4. `content-processing`
5. `distribution-telegram`
6. `operations`

### Layering Rules (DDD)
Har context quyidagi qatlamlarga bo'linadi:
1. `domain`
2. `application`
3. `infrastructure`
4. `presentation`

Dependency qoidasi:
1. `domain` tashqi frameworkga bog'lanmaydi.
2. `application` faqat domain contractlarga tayanadi.
3. `infrastructure` repository/client implementatsiyalarini beradi.
4. `presentation` controller/DTO orqali use-case larni expose qiladi.

### SOLID / DRY / KISS Rules
1. SRP: controller faqat transport layer bo'ladi.
2. DIP: repository interface `domain/application`da, implementatsiya `infrastructure`da.
3. ISP: har use-case uchun minimal service contract.
4. DRY: shared mapping/validation `packages/api-types` va `packages/api-client`da.
5. KISS: compat adapter route larda faqat proxy/mapping, business logic yo'q.

## Public API Contract Policy

### Canonical API (`apps/api`)
Base URL: `/v1`

Required endpoints:
1. `GET /v1/articles`
2. `GET /v1/articles/:slug`
3. `GET /v1/articles/featured`
4. `POST /v1/articles/view`
5. `GET /v1/categories`
6. `POST /v1/admin/auth/login`
7. `POST /v1/admin/auth/refresh`
8. `POST /v1/admin/auth/logout`
9. `GET /v1/admin/articles/:id`
10. `PUT /v1/admin/articles/:id`
11. `DELETE /v1/admin/articles/:id`
12. `POST /v1/admin/articles/:id/telegram`
13. `POST /v1/admin/sources`
14. `PUT /v1/admin/sources/:id`
15. `PATCH /v1/admin/sources/:id`
16. `DELETE /v1/admin/sources/:id`
17. `/v1/internal/jobs/*`

### Compatibility API (`apps/web/src/app/api/*`)
1. Legacy shape saqlanadi.
2. Adapter/proxy only.
3. Auth/cookie bridge allowed.
4. Direct DB writes/read forbidden after related phase completed.

## Security Plan
1. Admin APIs -> JWT + RBAC.
2. Internal job APIs -> service token + rate limit + source allowlist.
3. Refresh token rotation + revoke strategy.
4. Security audit log (admin mutations and internal triggers).
5. Secret masking policy in logs.

## Queue and Scheduling Plan
1. BullMQ + Redis queue.
2. Separate processors for `sync-news`, `process-raw`, `telegram-post`.
3. Retry/backoff policies per job type.
4. Dead-letter queue for repeated failures.
5. Idempotency lock to prevent duplicate concurrent runs.

## Data and Schema Plan
1. Existing Prisma schema remains source of truth in early phases.
2. Prisma 7 upgrade deferred to Phase 9.
3. Migration scripts reviewed before production apply.

## Delivery Plan
1. P0: Work item and ADR baseline.
2. P1: `apps/api` scaffold and global technical baseline.
3. P2-P5: Security + API + pipeline migration.
4. P6-P8: Full cutover, decouple web from Prisma, cleanup.
5. P9: Prisma 7 upgrade and final regression.

## Quality Gates

### Mandatory After Each Phase
```bash
pnpm --filter @news-app/api type-check
pnpm --filter @news-app/api build
pnpm -r type-check
pnpm -r build
```

Note: Phase 0 da `@news-app/api` mavjud bo'lmagani uchun faqat root gate ishlatiladi.

### Additional Gates by Phase
1. Auth phases: JWT/RBAC e2e tests
2. API migration phases: contract parity tests
3. Queue phase: worker integration tests
4. Cutover phase: no-prisma-import static check

## Observability and Operations
1. `/v1/health` and `/v1/readiness`
2. Structured logging with request correlation id
3. Queue metrics (active, failed, delayed, completed)
4. Error alerting policy for internal jobs

## Definition of Done
1. `apps/web` da `Prisma` importlari yo'q.
2. Barcha backend use-case lar `apps/api` da ishlaydi.
3. Admin/internal endpointlar auth + RBAC bilan himoyalangan.
4. Queue pipeline production-level retry/idempotency bilan ishlaydi.
5. Full monorepo gates yashil.
6. Docs va work-item holati real implementatsiya bilan sync.

## Finalization Update (2026-02-13)
1. DoD bandlari kod va gate'lar orqali yopildi.
2. Auth/RBAC, contract parity, worker integration, mobile smoke testlar qo'shildi va o'tdi.
3. Prisma 7 konfiguratsiya migratsiyasi (`prisma.config.ts`) yakunlandi.
