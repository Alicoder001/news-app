# ADR-001: Backend Split Strategy with DDD

- Status: Accepted
- Date: 2026-02-13
- Work Item: WI-2026-02-13-NESTJS-FULL-MIGRATION

## Context
Current architecture keeps frontend and backend logic in `apps/web`, including direct database access from pages/components and API routes. This increases coupling, weakens security boundaries, and makes backend scaling/operations harder.

## Decision
Introduce a dedicated backend service `apps/api` using NestJS 11.x and Domain-Driven Design boundaries.

Bounded contexts:
1. identity-access
2. content-catalog
3. source-ingestion
4. content-processing
5. distribution-telegram
6. operations

Each context follows four layers:
1. domain
2. application
3. infrastructure
4. presentation

## Consequences
### Positive
1. Stronger separation of concerns.
2. Better security and authorization boundaries.
3. Better path for queue/worker and operational reliability.
4. Clear API contracts for web/mobile clients.

### Negative
1. Migration complexity and temporary dual-path maintenance.
2. Additional infrastructure (backend runtime + Redis).
3. Need for strict compatibility testing during transition.

## Compatibility Policy
1. Legacy `/api/*` endpoints stay available as temporary adapters.
2. Canonical API lives at `/v1/*` in `apps/api`.
3. Adapters must not contain business logic.

## Final Cutover Condition
`apps/web` must not contain direct Prisma usage after migration completion.
