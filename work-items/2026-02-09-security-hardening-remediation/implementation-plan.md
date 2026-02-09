# Implementation Plan

## Work Item
- Name: Security and Production Hardening Remediation
- Date: 2026-02-09
- Scope: `apps/web`, `apps/mobile`, `packages/*`, runtime/deploy config

## Objective
Close critical security gaps, stabilize API behavior, and bring the project to production-ready quality gates (auth, sanitization, validation, lint/test baseline).

## Success Criteria
1. All admin mutation APIs require authenticated admin access.
2. No unsanitized user/AI HTML is rendered.
3. Costly pipeline endpoints are protected (auth + rate limit).
4. Secret values are never partially logged.
5. API contracts between web and mobile are consistent.
6. `pnpm -r lint` passes with zero errors.
7. Critical path tests exist for security and API behavior.

## Non-Goals
1. Full redesign of admin UI.
2. Major architecture rewrite.
3. New product features unrelated to remediation.

## Workstreams

### WS1: Security Hotfix (P0)
1. Add auth guard for all `/api/admin/*` write/read routes.
2. Sanitize Telegram article HTML rendering.
3. Protect `/api/news/sync` and `/api/news/process` behind secure trigger policy.
4. Remove all sensitive logging patterns (key prefix/partial leaks).

### WS2: API and Runtime Stability (P1)
1. Fix mobile pagination contract mismatch.
2. Fix broken route links (`/article/*` -> `/articles/*` where needed).
3. Improve pipeline error handling to avoid data loss on transient failures.
4. Enforce runtime env validation at startup.
5. Harden public API query validation (page/limit bounds).

### WS3: Dependency and Platform Hardening (P1)
1. Upgrade vulnerable dependencies (`next`, transitive tar/undici paths where possible).
2. Re-run `pnpm audit --prod` and document residual risks.

### WS4: Quality Gates and Verification (P2)
1. Resolve current ESLint errors to zero.
2. Add focused tests:
   - admin API auth enforcement
   - sanitization behavior
   - protected pipeline endpoint behavior
   - article list pagination contract
3. Final full validation:
   - `pnpm -r type-check`
   - `pnpm -r lint`
   - `pnpm -r build`

## Dependency Order
1. WS1 -> WS2 -> WS3 -> WS4
2. WS4 starts partially in parallel once WS1 core protections land.

## Execution Strategy
1. Implement smallest secure patch for P0 first.
2. Add tests immediately after each P0 item.
3. Stabilize API/runtime compatibility (WS2).
4. Upgrade dependencies with changelog review and compatibility checks.
5. Finish with lint cleanup and full CI-like verification.

## Risks and Mitigation
1. Breaking auth flow in admin pages.
   - Mitigation: add route-level tests + manual smoke test `/admin/login` -> `/admin`.
2. Dependency upgrades cause framework regressions.
   - Mitigation: incremental upgrades + build/type/lint after each step.
3. Sanitization strips needed formatting.
   - Mitigation: define allowlist and snapshot expected HTML cases.

## Exit Criteria (Definition of Done)
1. Critical and high security findings from audit are closed.
2. No open lint errors.
3. Security and API tests pass.
4. Build and runtime smoke checks pass in web and mobile targets.
5. Work item docs are updated with implemented changes and verification logs.

