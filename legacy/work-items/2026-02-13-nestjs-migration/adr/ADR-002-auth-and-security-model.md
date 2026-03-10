# ADR-002: Auth and Security Model for Migration

- Status: Accepted
- Date: 2026-02-13
- Work Item: WI-2026-02-13-NESTJS-FULL-MIGRATION

## Context
Admin authentication in current state is cookie-secret based and not consistently enforced across all admin mutation APIs. Internal job endpoints need stronger controls and auditable access.

## Decision
Use JWT + RBAC as target security model in `apps/api`.

Details:
1. Access token (short-lived) + refresh token (rotating) for admin sessions.
2. RBAC guards for admin endpoints.
3. Audit log for sensitive admin actions.
4. Internal job endpoints protected by service token and strict throttling.
5. Security logs must mask secrets.

## Consequences
### Positive
1. Uniform auth policy across admin API surface.
2. Better least-privilege enforcement.
3. Better incident investigation with audit logs.

### Negative
1. More complexity than static secret cookie flow.
2. Requires token lifecycle handling on clients/adapters.

## Migration Notes
1. Existing Next admin flows remain temporarily via compatibility adapters.
2. Admin write APIs are migrated early to remove current unauthorized mutation risk.
