# Next Agent Instructions

## Purpose

This is a strict handoff for the next AI agent.

You must operate in the spirit of the local `autonomous-delivery` skill:

- ultra strict end-to-end delivery mode
- minimal interruption
- blocker parameters collected up front
- real `docs/TASKS.md` execution board discipline
- continue implementing until the project is fully complete or a true blocker is reached

Do not treat this as a normal conversational coding session.

## Required Working Mode

You must follow this loop:

`inspect -> normalize task board if needed -> identify blockers -> ask once for all blocker parameters -> write them into the correct files -> implement continuously -> validate -> update docs/TASKS.md -> final report once`

You must not:

- stop after small wins
- ask for confirmation between ordinary implementation steps
- give frequent progress summaries
- leave obvious scaffolds when real implementation is possible now
- delay environment setup until late in the run

You must stop only if:

- a true blocker remains after repository inspection
- the user has not yet provided required secrets/parameters you explicitly requested
- an external dependency cannot be installed or reached even after reasonable remediation

## First Required Action: Upfront Blocker Intake

Before deep implementation, you must inspect the repository and then ask the user once in one compact grouped batch for all truly blocking inputs.

This is mandatory.

Do not start the main implementation pass until you have collected or resolved the blocker inputs.

At minimum, verify whether you have these:

- `DATABASE_URL`
- `APP_URL`
- `INTERNAL_PIPELINE_SECRET`
- `CRON_SECRET`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHANNEL_ID`
- `AGENT_RUNTIME_MODE`
- real CLI runtime command if agent execution should be non-placeholder
- deployment target details if deployment is expected in this pass
- public domain or Vercel URL if publish validation depends on it
- any admin auth choice if admin protection is expected in this pass

Rules for intake:

- ask once, not repeatedly
- group related items together
- propose sensible defaults where possible
- if the user needs to create a token, credential, bot, or URL, explicitly tell them to create it before the pass continues
- once values are provided, write them immediately into the correct `.env`, config, docs, or placeholders

## Source of Truth

Read these first and treat them as the execution contract:

- [docs/TASKS.md](/C:/Users/coder/Desktop/news-app/docs/TASKS.md)
- [docs/MVP_END_TO_END_SPEC.md](/C:/Users/coder/Desktop/news-app/docs/MVP_END_TO_END_SPEC.md)
- [docs/PHASES_OVERVIEW.md](/C:/Users/coder/Desktop/news-app/docs/PHASES_OVERVIEW.md)
- [docs/PHASE_1_FOUNDATION_AND_ARCHITECTURE.md](/C:/Users/coder/Desktop/news-app/docs/PHASE_1_FOUNDATION_AND_ARCHITECTURE.md)
- [docs/PHASE_2_DATA_AND_INGESTION.md](/C:/Users/coder/Desktop/news-app/docs/PHASE_2_DATA_AND_INGESTION.md)
- [docs/PHASE_3_VERIFICATION_AND_AGENTS.md](/C:/Users/coder/Desktop/news-app/docs/PHASE_3_VERIFICATION_AND_AGENTS.md)
- [docs/PHASE_4_PUBLISHING_AND_CLIENT_SURFACES.md](/C:/Users/coder/Desktop/news-app/docs/PHASE_4_PUBLISHING_AND_CLIENT_SURFACES.md)
- [docs/PHASE_5_ADMIN_AND_OPERATIONS.md](/C:/Users/coder/Desktop/news-app/docs/PHASE_5_ADMIN_AND_OPERATIONS.md)
- [docs/PROMPT_ENGINEERING_PIPELINE.md](/C:/Users/coder/Desktop/news-app/docs/PROMPT_ENGINEERING_PIPELINE.md)
- [docs/STARTUP.md](/C:/Users/coder/Desktop/news-app/docs/STARTUP.md)

Also inspect at minimum:

- [package.json](/C:/Users/coder/Desktop/news-app/package.json)
- [prisma/schema.prisma](/C:/Users/coder/Desktop/news-app/prisma/schema.prisma)
- [prisma/migrations](/C:/Users/coder/Desktop/news-app/prisma/migrations)
- [src/lib/validation/env.ts](/C:/Users/coder/Desktop/news-app/src/lib/validation/env.ts)
- [src/lib/pipeline](/C:/Users/coder/Desktop/news-app/src/lib/pipeline)
- [src/lib/verification](/C:/Users/coder/Desktop/news-app/src/lib/verification)
- [src/lib/agents](/C:/Users/coder/Desktop/news-app/src/lib/agents)
- [src/app/api](/C:/Users/coder/Desktop/news-app/src/app/api)
- [src/app/admin](/C:/Users/coder/Desktop/news-app/src/app/admin)
- [src/app/articles](/C:/Users/coder/Desktop/news-app/src/app/articles)
- [src/app/tg](/C:/Users/coder/Desktop/news-app/src/app/tg)

## TASKS Board Discipline

`docs/TASKS.md` is mandatory and must remain a real execution board.

If it is weak, stale, or no longer reflects the repository, repair it before major implementation.

Status rules:

- `[x]` only for truly completed work
- `[~]` for partial, blocked, or environment-limited work
- `[ ]` for pending work
- `[-]` only while actively in progress

Update `docs/TASKS.md` during the pass, not only at the very end.

## Environment and Operations: Non-Negotiable

The project intent is:

- `WSL Ubuntu + Docker Compose`
- `PostgreSQL + Prisma`
- local worker plus app
- public website and mini app reading shared published data

Before claiming the system is blocked, you must actively verify the runtime environment.

### WSL and Docker procedure

You must check these in order:

1. Verify WSL availability from Windows:
   - `wsl.exe -l -v`
   - `wsl.exe --status`
2. If Ubuntu exists, run commands inside Ubuntu explicitly:
   - `wsl.exe -d Ubuntu bash -lc "pwd"`
   - `wsl.exe -d Ubuntu bash -lc "which docker || command -v docker"`
   - `wsl.exe -d Ubuntu bash -lc "docker --version"`
   - `wsl.exe -d Ubuntu bash -lc "docker compose version"`
3. If Docker is missing inside Ubuntu, attempt reasonable remediation:
   - check whether Docker Desktop integration is expected
   - check whether Docker daemon is reachable
   - if the project standard is local Docker in WSL, install or fix Docker access if feasible in this environment
4. If Ubuntu is missing entirely, state that clearly and tell the user exactly what must be installed or enabled

Do not stop at "docker command not found" from Windows if WSL has not yet been checked properly.

If installation or repair is feasible, do it.

If it is not feasible, document the exact failed checks and the smallest required user action.

### Database procedure

You must not leave database validation as a theory-only claim if the environment can support it.

If Docker or PostgreSQL becomes available, you must:

- create or update `.env`
- run Prisma generate
- run Prisma migrate
- seed sources
- validate at least one ingestion cycle
- validate one worker cycle

If DB credentials are invalid, treat that as a blocker to surface early, not late.

## Current Repository Reality

The repo already has meaningful progress. Do not start from zero.

Current notable implemented areas include:

- standardized route helper foundation
- domain errors
- pipeline lock and structured event logging
- worker entrypoint in TypeScript
- cron trigger route
- verification confidence and multi-source matching scaffold
- admin article detail view
- category pages
- SEO metadata on article pages
- source references rendering
- Mini App filters, preferences, and saved items behavior
- Prisma migration SQL checked into repo

You must inspect the current code before deciding what is still missing.

## Main Objective

Finish the remaining MVP work from [docs/TASKS.md](/C:/Users/coder/Desktop/news-app/docs/TASKS.md).

You should behave like the owner of the remaining backlog, not like a partial implementer.

## Execution Priorities

Unless repo reality strongly forces a nearby reorder, proceed in this order:

### 1. Resolve runtime blockers early

- gather missing envs and tokens up front
- verify WSL Ubuntu and Docker from terminal
- install or repair Docker access if possible
- bring up PostgreSQL or otherwise obtain a working DB
- validate Prisma migrate and seed for real

### 2. Complete real end-to-end runtime validation

- run Prisma generate
- run migration on a real database
- run source seed
- validate one real RSS ingestion cycle
- validate one full worker orchestration cycle
- validate website publish path
- validate Telegram publish path if real credentials are provided

### 3. Finish remaining backlog items honestly

- agent runtime improvements that still depend on a real CLI command
- Telegram formatting and failure recovery
- admin loading and empty-state polish
- tests that are still pending
- any remaining docs drift

## Quality Rules

- Keep route handlers thin.
- Put business logic in `src/lib`.
- Keep DTO and response shapes consistent.
- Prefer clean typed boundaries.
- Do not claim validation you did not actually run.
- Do not mark task items done if the environment prevented completion.

## Reporting Rules

Communication must stay low-noise.

You may send only:

- one short blocker-parameter request near the beginning
- one blocker message later only if a true blocker remains
- one final completion report at the end

Do not give step-by-step progress updates after each task.

## Final Report Format

When the pass truly ends, report:

### 1. What Was Completed

### 2. What Was Validated

### 3. What Remains and Why

### 4. Which `docs/TASKS.md` items were updated

If blocked, include:

- the exact blocker
- what you tried
- the smallest user action needed to unblock the next pass

## Final Instruction

First inspect.

Then ask once for all blocker parameters.

Then write those values where they belong.

Then continue implementing and validating without stopping until the project is fully completed or a true blocker remains.
