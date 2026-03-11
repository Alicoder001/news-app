# Next Agent Instructions

## Purpose

This file is a direct handoff instruction for the next AI agent that will continue the `ai_shunos` MVP implementation.

Your job is to take the current repository state and finish the remaining MVP work in one continuous execution pass.

You must **not** stop after each small task to report progress.

You must continue working until:

- all realistically completable pending tasks are implemented, or
- you hit a real blocker that cannot be resolved from repository context, or
- you finish the full MVP task board.

Only after that, produce one final report.

## Absolute Working Mode

You must work in this mode:

- start work immediately
- do not pause for incremental summaries
- do not ask for confirmation between normal implementation steps
- do not stop at analysis only
- do not leave obvious next-step scaffolding when you can implement it now
- do not return partial progress updates unless a real blocker appears

The expected behavior is:

`analyze -> implement -> wire together -> validate -> continue -> finalize report once`

## Primary Source of Truth

Read these files first and use them as the implementation contract:

- [docs/TASKS.md](/Users/coder/Desktop/news-app/docs/TASKS.md)
- [docs/MVP_END_TO_END_SPEC.md](/Users/coder/Desktop/news-app/docs/MVP_END_TO_END_SPEC.md)
- [docs/PHASES_OVERVIEW.md](/Users/coder/Desktop/news-app/docs/PHASES_OVERVIEW.md)
- [docs/PHASE_1_FOUNDATION_AND_ARCHITECTURE.md](/Users/coder/Desktop/news-app/docs/PHASE_1_FOUNDATION_AND_ARCHITECTURE.md)
- [docs/PHASE_2_DATA_AND_INGESTION.md](/Users/coder/Desktop/news-app/docs/PHASE_2_DATA_AND_INGESTION.md)
- [docs/PHASE_3_VERIFICATION_AND_AGENTS.md](/Users/coder/Desktop/news-app/docs/PHASE_3_VERIFICATION_AND_AGENTS.md)
- [docs/PHASE_4_PUBLISHING_AND_CLIENT_SURFACES.md](/Users/coder/Desktop/news-app/docs/PHASE_4_PUBLISHING_AND_CLIENT_SURFACES.md)
- [docs/PHASE_5_ADMIN_AND_OPERATIONS.md](/Users/coder/Desktop/news-app/docs/PHASE_5_ADMIN_AND_OPERATIONS.md)
- [docs/PROMPT_ENGINEERING_PIPELINE.md](/Users/coder/Desktop/news-app/docs/PROMPT_ENGINEERING_PIPELINE.md)
- [docs/STARTUP.md](/Users/coder/Desktop/news-app/docs/STARTUP.md)

## Current Project Intent

This repository is a fresh MVP rebuild.

The old project has already been archived into:

- [legacy](/Users/coder/Desktop/news-app/legacy)

Do not move legacy back into active root.

The new MVP must follow these architectural decisions:

- `WSL Ubuntu + Docker Compose` as operational development model
- `Prisma + PostgreSQL` for persistence
- `TanStack Query` for server state
- `Zustand` for local UI state
- `Lucide React` for icon system
- `RSS only` ingestion for MVP
- `2-3 source verification`
- `3-agent pipeline`
- `website first, telegram second`
- `Mini App reads the same published content source`
- `local worker -> shared PostgreSQL -> Vercel reads`
- `admin dashboard local`
- `public website + mini app on Vercel`

## Your Main Objective

Finish the remaining MVP tasks from the execution board in [docs/TASKS.md](/Users/coder/Desktop/news-app/docs/TASKS.md).

You should treat the board as the execution backlog.

Whenever you complete a task, update `docs/TASKS.md`.

When you implement a major part, reflect that in the relevant docs if needed.

## Execution Priority

You must complete work in this order unless repository context strongly requires a nearby reordering:

### 1. Runtime and Validation

Finish the pieces required to make the project runnable:

- standardize API responses using the shared response helper
- improve route-level error handling consistency
- validate Prisma generate/migrate workflow
- make sure the worker entrypoint is connected to orchestration
- add cron trigger strategy
- add lock/idempotency protection
- add structured operational logs

### 2. Data and Verification Hardening

Then finish the real MVP data path:

- implement real `2-3 source` verification lookup logic
- add verification confidence strategy
- improve ingestion retry and timeout policy
- add hold/reject persistence reasons on article records
- validate real RSS fetch against live feeds if environment allows

### 3. Agent Runtime Completion

Then replace placeholder behavior where possible:

- replace placeholder agent logic with real CLI runtime execution if feasible in this environment
- otherwise build a robust abstraction so agent execution can be swapped in cleanly
- add JSON schema validation and retry enforcement around agent outputs

If true CLI execution cannot be reliably completed in this environment, do the best complete implementation possible short of the external dependency, and document exactly what remains.

### 4. Admin Dashboard Completion

Then make admin genuinely usable:

- add article detail admin view
- add verification-to-article traceability in UI
- improve table UX and actions
- add loading and empty states polish
- add source create/toggle flow polish

### 5. Public and Mini App Completion

Then improve the user-facing surfaces:

- add better home page sections
- add category pages
- add SEO metadata per article
- add source references block on article page
- add Mini App category filter
- add Mini App settings/preferences UI
- add saved items behavior

### 6. Professionalization

Then finish quality and architecture cleanup:

- add shared API response wrappers everywhere
- add domain-level error classes
- add safer HTML/content sanitization strategy
- add article/source DTO typing cleanup
- add code comments only where genuinely useful

### 7. Testing

Then verify the system:

- run Prisma generate
- run migration
- seed sources
- validate one RSS ingestion cycle
- validate one full local pipeline cycle
- validate website publish path
- validate Telegram publish path if env allows
- add initial unit tests
- add initial integration tests

## Non-Negotiable Implementation Rules

Follow these rules strictly.

### Completion Discipline

- Do not stop after creating scaffolds if you can implement the actual behavior.
- Do not leave obvious placeholders if they can be completed in this pass.
- Do not leave the worker disconnected if you can wire it now.
- Do not leave APIs inconsistent if you can normalize them now.

### Reporting Discipline

- Do not give step-by-step progress reports.
- Do not stop to summarize after each completed subtask.
- Only provide one final response when the pass is complete.

### Task Tracking Discipline

- Update [docs/TASKS.md](/Users/coder/Desktop/news-app/docs/TASKS.md) continuously as you complete work.
- Mark tasks honestly:
  - `[x]` only if really implemented
  - `[~]` if partial/scaffold only
  - `[ ]` if still pending
- Add new tasks only if they are truly needed.

### Documentation Discipline

- Keep docs aligned with actual implementation.
- If architecture changes, update the corresponding docs.
- Do not let docs drift from code.

### Quality Discipline

- Prefer clean, typed service boundaries.
- Keep route handlers thin.
- Put real logic into `src/lib`.
- Use Prisma cleanly and consistently.
- Keep public content read paths separate from admin mutations.

## Files and Areas You Must Inspect Before Implementing

At minimum, inspect these areas before large changes:

- [package.json](/Users/coder/Desktop/news-app/package.json)
- [prisma/schema.prisma](/Users/coder/Desktop/news-app/prisma/schema.prisma)
- [src/lib/db/prisma.ts](/Users/coder/Desktop/news-app/src/lib/db/prisma.ts)
- [src/lib/validation/env.ts](/Users/coder/Desktop/news-app/src/lib/validation/env.ts)
- [src/lib/rss](/Users/coder/Desktop/news-app/src/lib/rss)
- [src/lib/verification](/Users/coder/Desktop/news-app/src/lib/verification)
- [src/lib/agents](/Users/coder/Desktop/news-app/src/lib/agents)
- [src/lib/pipeline](/Users/coder/Desktop/news-app/src/lib/pipeline)
- [src/lib/publish](/Users/coder/Desktop/news-app/src/lib/publish)
- [src/lib/telegram](/Users/coder/Desktop/news-app/src/lib/telegram)
- [src/app/api](/Users/coder/Desktop/news-app/src/app/api)
- [src/app/admin](/Users/coder/Desktop/news-app/src/app/admin)
- [src/app/articles](/Users/coder/Desktop/news-app/src/app/articles)
- [src/app/tg](/Users/coder/Desktop/news-app/src/app/tg)
- [prompts](/Users/coder/Desktop/news-app/prompts)

## Expected End State

At the end of your pass, the repository should be significantly closer to a real runnable MVP, not just a scaffold set.

The expected minimum end state is:

- Prisma workflow is executable
- source seeding is executable
- worker can run orchestration
- APIs are more consistent
- admin can trigger and inspect pipeline
- verification visibility is improved
- public and Mini App surfaces are usable
- tasks board reflects real current state

## Final Report Format

Only when all work for this pass is finished, give one final report.

The report must contain:

### 1. What Was Completed

Summarize the major completed areas.

### 2. What Was Updated

Reference the most important files changed.

### 3. Validation

State what was run and what was verified.

### 4. Remaining Work

List only genuine remaining blockers or deferred items.

### 5. Task Board Status

Mention that `docs/TASKS.md` was updated and reflects the current repo state.

## Final Instruction

Do the work in one continuous pass.

Do not stop after each subtask.

Do not behave like an interactive progress reporter.

Behave like an autonomous implementation agent that owns the remaining MVP work until the pass is fully complete.
