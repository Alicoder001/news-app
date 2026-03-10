# Release Readiness Checklist

## Work Item
- ID: WI-2026-02-20-PROD-READINESS-STABILIZATION
- Date: 2026-02-20
- Owner: Platform/Core
- Decision: `READY WITH TRACKED OPS SCOPE`

## 1) Core Gates
- [x] `pnpm type-check`
- [x] `pnpm lint`
- [x] `pnpm build`

## 2) API Gates
- [x] `pnpm --filter @news-app/api type-check`
- [x] `pnpm --filter @news-app/api lint`
- [x] `pnpm --filter @news-app/api build`
- [x] `pnpm --filter @news-app/api test`
- [x] `pnpm --filter @news-app/api test:e2e`
- [x] `pnpm --filter @news-app/api test:integration`

## 3) Web Gates
- [x] `pnpm --filter @news-app/web type-check`
- [x] `pnpm --filter @news-app/web lint`
- [x] `pnpm --filter @news-app/web test`

## 4) Mobile Gate
- [x] `pnpm --filter @news-app/mobile test:smoke`

## 5) Security
- [x] Admin browser flow now uses backend JWT session cookies (secret no longer stored in cookie).
- [x] Admin adapter routes use `Authorization: Bearer ...` instead of privileged internal-token bypass.
- [x] TG article detail render path uses sanitization (`sanitizeHtml`).
- [x] API key prefix/value logging removed from provider logs.
- [x] Regression tests added for unauthorized admin access and sanitization path.

## 6) Functional Correctness
- [x] TG -> web article links fixed to `/articles/[slug]`.
- [x] Locale-aware TG navigation aligned (`/tg`, `/tg/category/[slug]`, `/tg/article/[slug]`).
- [x] Admin manual trigger strategy migrated to authenticated admin pipeline endpoint.
- [x] Public endpoint query bounds added where missing.

## 7) Pipeline Integrity
- [x] Producer path validated (`/v1/internal/jobs/trigger` + `/v1/admin/pipeline/trigger`).
- [x] Dry-run mode behavior validated and covered in integration tests.
- [x] Queue mode options/idempotency validated in integration tests.
- [x] Scope documented: queue consumer deployment remains operational scope and must be tracked in runbooks.

## 8) Documentation Sync
- [x] Architecture docs updated for `apps/api` topology.
- [x] Version references updated (Next.js/Prisma and related stack deltas).
- [x] Work-item status synchronized with real command evidence.

## Go/No-Go Notes
1. Release is blocked on any new P0 security regression.
2. For production rollout, monitor `mode` from internal job trigger responses (`queue` vs `dry-run`).
3. Queue consumer operations ownership is explicitly tracked outside this monorepo work item.
