# Tasks

## Work Item
- ID: WI-2026-02-20-PROD-READINESS-STABILIZATION
- Name: Production Readiness Stabilization
- Status: Completed
- Start Date: 2026-02-20
- End Date: 2026-02-20

## Phase 0 - Work Item Foundation
- [x] Create `work-items/2026-02-20-production-readiness-stabilization/roadmap.md`
- [x] Create `work-items/2026-02-20-production-readiness-stabilization/implementation-plan.md`
- [x] Create `work-items/2026-02-20-production-readiness-stabilization/tasks.md`
- [x] Confirm scope and non-goals with current release target
- [x] Run baseline gate snapshot:
  - [x] `pnpm --filter @news-app/web type-check`
  - [x] `pnpm --filter @news-app/mobile type-check`
  - [x] `pnpm --filter @news-app/api type-check`
  - [x] `pnpm lint`
  - [x] `pnpm build`

## Phase 1 - Build and Type Recovery
- [x] Fix `apps/api` TypeScript strict errors (implicit any and Prisma transaction typing)
- [x] Align Prisma transactional typing strategy for service layer
- [x] Verify `apps/api` compile path with `nest build`
- [x] Run phase gate:
  - [x] `pnpm --filter @news-app/api type-check`
  - [x] `pnpm --filter @news-app/api build`

## Phase 2 - Lint Stabilization
- [x] Add ESLint flat config for `apps/api` (ESLint v9 compatible)
- [x] Resolve blocking lint errors in `apps/web` (react/no-unescaped-entities, purity, invalid links)
- [x] Keep warnings documented, but reduce production-risk lint errors to zero
- [x] Run phase gate:
  - [x] `pnpm --filter @news-app/api lint`
  - [x] `pnpm --filter @news-app/web lint`
  - [x] `pnpm lint`

## Phase 3 - Security Hardening (P0)
- [x] Replace admin secret-in-cookie model with token/session-based auth model
- [x] Remove privileged internal-token bypass from browser-origin admin flow
- [x] Sanitize Telegram article detail HTML render path
- [x] Remove API key prefix/value logging in providers/services
- [x] Add tests for unauthorized admin access and XSS sanitization
- [x] Run phase gate:
  - [x] `pnpm --filter @news-app/api test:e2e`
  - [x] `pnpm --filter @news-app/web test`

## Phase 4 - Functional Correctness and Routing
- [x] Fix Telegram-to-web article route links
- [x] Fix locale-aware TG category/article navigation consistency
- [x] Stabilize admin manual pipeline trigger strategy for production
- [x] Add query parameter bounds for public endpoints where missing
- [x] Run phase gate:
  - [x] `pnpm --filter @news-app/web type-check`
  - [x] `pnpm --filter @news-app/web test`

## Phase 5 - Pipeline and Operations Integrity
- [x] Validate queue worker architecture against implemented code (producer + consumer parity)
- [x] Implement missing worker/processor pieces or update scope/docs accordingly
- [x] Confirm dry-run mode behavior and observability signals
- [x] Add integration tests for queue processing path beyond idempotency trigger
- [x] Run phase gate:
  - [x] `pnpm --filter @news-app/api test:integration`
  - [x] `pnpm --filter @news-app/api build`

## Phase 6 - Documentation and Governance Sync
- [x] Update architecture docs to include `apps/api` and current backend topology
- [x] Update version references (Prisma/Next and related stack deltas)
- [x] Align work-item status with real gate outcomes (remove false green claims)
- [x] Publish final release-readiness checklist
- [x] Run final monorepo gate:
  - [x] `pnpm type-check`
  - [x] `pnpm lint`
  - [x] `pnpm build`
  - [x] `pnpm --filter @news-app/api test`
  - [x] `pnpm --filter @news-app/mobile test:smoke`
  - [x] `pnpm --filter @news-app/web test`

## Acceptance Criteria
1. Monorepo `type-check`, `lint`, `build` gates pass.
2. Admin surface is protected with production-safe auth model.
3. TG article HTML path is sanitized and covered with regression test.
4. Pipeline behavior is either fully implemented or explicitly re-scoped with matching docs.
5. Documentation reflects real code state and current architecture.

## Ongoing Governance
- [x] Block release on any P0 security regression.
- [x] Keep work-item status synced with gate evidence (no assumed green).
- [x] Update checklist after each merged phase.
