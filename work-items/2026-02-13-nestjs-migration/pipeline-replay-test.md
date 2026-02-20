# Pipeline Replay Test

Date: 2026-02-13

## Goal
Validate replay/idempotency behavior for internal queue triggers.

## Coverage
1. Dry-run fallback without Redis:
- `apps/api/test/integration/internal-jobs.integration.spec.ts`

2. Idempotency key propagation to BullMQ `jobId`:
- `apps/api/test/integration/internal-jobs-idempotency.integration.spec.ts`

3. Queue trigger contract:
- `InternalJobsService.trigger(job, payload)` returns queue metadata and `jobId`.

## Result
- Replay safety behavior verified in integration tests:
  - same `idempotencyKey` is forwarded as BullMQ `jobId`.
  - without Redis, system degrades to safe dry-run mode.

## Conclusion
- Pipeline replay gate is satisfied for this migration phase.
