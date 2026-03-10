# Tasks

## Work Item
- ID: WI-2026-02-13-NESTJS-FULL-MIGRATION
- Status: Completed

## Phase 0 - Foundation
- [x] Create `work-items/2026-02-13-nestjs-migration/roadmap.md`
- [x] Create `work-items/2026-02-13-nestjs-migration/implementation-plan.md`
- [x] Create `work-items/2026-02-13-nestjs-migration/tasks.md`
- [x] Create ADR documents for architecture and security baselines
- [x] Create epic branch `feature/nestjs-full-migration`
- [x] Create phase branch `feature/nestjs-migration-p0-foundation`
- [x] Run phase gate:
  - [x] `pnpm -r type-check`
  - [x] `pnpm -r build`

## Phase 1 - API Bootstrap
- [x] Create `apps/api` with NestJS 11.x baseline
- [x] Add DDD context skeleton:
  - [x] `identity-access`
  - [x] `content-catalog`
  - [x] `source-ingestion`
  - [x] `content-processing`
  - [x] `distribution-telegram`
  - [x] `operations`
- [x] Add global validation pipe
- [x] Add global exception filter
- [x] Add environment validation
- [x] Add `/v1/health` and `/v1/readiness`
- [x] Add Swagger at `/v1/docs`
- [x] Wire workspace scripts and dependencies
- [x] Run phase gate:
  - [x] `pnpm --filter @news-app/api type-check`
  - [x] `pnpm --filter @news-app/api build`
  - [x] `pnpm -r type-check`
  - [x] `pnpm -r build`

## Phase 2 - Identity & Security
- [x] Implement JWT access/refresh
- [x] Implement token rotation and revoke strategy
- [x] Implement RBAC guard and decorators
- [x] Protect admin endpoints fully
- [x] Add admin action audit logging
- [x] Add auth e2e tests
- [x] Run phase gate

## Phase 3 - Content Read API
- [x] Implement `GET /v1/articles`
- [x] Implement `GET /v1/articles/:slug`
- [x] Implement `GET /v1/articles/featured`
- [x] Implement `POST /v1/articles/view`
- [x] Implement `GET /v1/categories`
- [x] Extend `packages/api-types` for canonical DTOs
- [x] Add compatibility adapter for `/api/articles*` and `/api/categories`
- [x] Add contract tests (`legacy` vs `v1`)
- [x] Run phase gate

## Phase 4 - Admin Write API
- [x] Implement source CRUD in Nest
- [x] Implement admin article update/delete in Nest
- [x] Implement telegram manual post endpoint in Nest
- [x] Move admin UI fetches to compatibility adapter over canonical API
- [x] Remove direct business logic from old Next admin APIs
- [x] Add RBAC e2e tests
- [x] Run phase gate

## Phase 5 - Pipeline Worker
- [x] Add BullMQ + Redis
- [x] Create queues for `sync-news`, `process-raw`, `telegram-post`
- [x] Implement retry/backoff and dead-letter queues
- [x] Implement idempotency lock for job concurrency
- [x] Move cron trigger flow to backend jobs
- [x] Set default production schedules
- [x] Add worker integration tests
- [x] Run phase gate

## Phase 6 - Web Prisma Decoupling
- [x] Replace all `apps/web` Prisma direct calls with API client usage
- [x] Introduce `packages/api-client` and migrate server/client fetches
- [x] Add lint/import rule to block Prisma usage in `apps/web`
- [x] Add static check for `no prisma import in apps/web`
- [x] Run phase gate

## Phase 7 - Mobile Cutover
- [x] Migrate mobile to canonical API contracts
- [x] Fix pagination/response shape issues
- [x] Standardize production API URL strategy
- [x] Add mobile integration smoke tests
- [x] Run phase gate

## Phase 8 - Cutover & Cleanup
- [x] Remove remaining Next API business logic
- [x] Keep or remove compatibility adapters based on release window policy
- [x] Sync docs with implemented architecture
- [x] Apply final security/performance hardening
- [x] Run full regression suite and phase gate

## Phase 9 - Prisma 7 Upgrade
- [x] Upgrade `prisma` and `@prisma/client` to `7.4.0`
- [x] Execute migration/generate/regression flow
- [x] Complete DB migration safety review
- [x] Run full monorepo gates and pipeline replay test

## Ongoing Governance
- [ ] Stop phase progress on P0 regressions
- [ ] Fix architecture drift immediately (SRP, DIP, contract stability, coupling)
- [ ] Keep work-item docs updated after each merged phase
