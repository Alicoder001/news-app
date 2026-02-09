# Task List

## Work Item
- ID: WI-2026-02-09-SEC-HARDENING
- Name: Security and Production Hardening Remediation
- Status: Planned

## P0 - Must Fix First
- [ ] Add `requireAuth`/equivalent guard to all `/api/admin/*` endpoints.
- [ ] Add auth/rate-limit policy to `/api/news/sync` and `/api/news/process`.
- [ ] Apply HTML sanitization in Telegram article detail render path.
- [ ] Remove secret prefix/value logging from cron/provider/services.
- [ ] Add regression tests for:
  - admin API unauthorized access returns 401/redirect
  - unsafe HTML payload is sanitized
  - unauthorized sync/process triggers are blocked

## P1 - Stability and Correctness
- [ ] Fix mobile `articles.list` response typing to match API pagination shape.
- [ ] Fix Telegram-to-web article links to correct route.
- [ ] Update pipeline error handling so failed items are retryable (no silent data loss).
- [ ] Wire runtime env validation so invalid config fails fast.
- [ ] Add query param bounds and validation for public list endpoints.

## P1 - Dependency Security
- [ ] Upgrade `next` to patched secure version (>=16.1.5).
- [ ] Upgrade vulnerable transitive paths where possible (tar/undici via expo/cheerio chain).
- [ ] Re-run `pnpm audit --prod` and capture remaining accepted risks.

## P2 - Quality Gate
- [ ] Resolve ESLint errors to zero.
- [ ] Add/adjust tests for API contract and security critical flows.
- [ ] Verify all gates:
  - [ ] `pnpm -r type-check`
  - [ ] `pnpm -r lint`
  - [ ] `pnpm -r build`

## Acceptance Criteria
1. Admin mutation/read endpoints are not reachable without auth.
2. Unsanitized content cannot execute in article render paths.
3. Pipeline trigger endpoints are protected from anonymous abuse.
4. Mobile pagination works with correct API contract.
5. Security vulnerabilities are reduced and documented after upgrades.
6. Lint/type/build checks pass.

## Notes
- Keep changes incremental and test after each P0 item.
- Do not merge P1/P2 before P0 protections are verified.

