# ai_shunos MVP Execution Board

## Maqsad

Bu hujjat MVP'ni `end-to-end` qurish uchun yagona task board hisoblanadi.

Tamoyil:

- har bir yirik qism alohida blokka bo'linadi
- har blokdagi tasklar status bilan yuritiladi
- implementatsiya tugagach shu faylda belgilab boriladi

## Status Legend

- `[ ]` pending
- `[-]` in progress
- `[x]` done
- `[~]` partial / scaffold ready, real integration pending

## Current Focus

- `Phase 3 -> Phase 5 transition`
- data flow is scaffolded
- next focus is admin completeness, verification visibility, route standardization, and runtime hardening

## 1. Foundation and Architecture

- [x] Archive old project into `/legacy`
- [x] Add new root project structure
- [x] Add root project config files
- [x] Add WSL Ubuntu + Docker Compose foundation
- [x] Add initial Next.js app skeleton
- [x] Add initial Prisma schema
- [x] Add environment validation
- [x] Add Prisma client bootstrap
- [x] Add startup documentation
- [~] Add Prisma generate/migrate execution validation

## 2. Data Layer and Prisma

- [x] Define core entities: `Source`
- [x] Define core entities: `RawArticle`
- [x] Define core entities: `VerificationRecord`
- [x] Define core entities: `Article`
- [x] Define core entities: `Delivery`
- [x] Define core entities: `PipelineRun`
- [x] Define core entities: `PipelineEvent`
- [~] Validate schema through actual migration run
- [x] Add Prisma seed workflow to documented bootstrap path

## 3. RSS Ingestion

- [x] Add RSS source types
- [x] Add default trusted RSS source list
- [x] Add RSS parser client
- [x] Add source service
- [x] Add raw article service
- [x] Add ingestion service scaffold
- [x] Add duplicate prevention by canonical URL
- [x] Add source fetched metadata update
- [x] Add source seed script
- [x] Validate real RSS fetch against live feeds
- [x] Add ingestion retry and timeout policy hardening

## 4. Verification

- [x] Add verification service scaffold
- [x] Add trusted source list structure
- [x] Add verification record writes
- [x] MVP placeholder verification result in orchestration exists
- [x] Implement real `2-3 source` verification lookup logic
- [x] Add verification confidence strategy
- [x] Add verification detail admin UI

## 5. Agent Pipeline

- [x] Add prompt folder structure
- [x] Add collector v1 prompts
- [x] Add writer v1 prompts
- [x] Add reviewer v1 prompts
- [x] Add collector placeholder agent
- [x] Add writer placeholder agent
- [x] Add reviewer placeholder agent
- [x] Add worker orchestration service
- [~] Agent flow works with placeholder business logic
- [~] Replace placeholder agent logic with real CLI runtime execution
- [x] Add JSON schema validation and retry enforcement around agent outputs
- [x] Add hold/reject persistence reasons on article records

## 6. Publishing Flow

- [x] Add article publish service scaffold
- [x] Add delivery service scaffold
- [x] Add website-first publish flow in orchestration
- [x] Add Telegram publish service
- [x] Add real Telegram Bot API `sendMessage` integration
- [x] Add website URL generation for Telegram post
- [~] Publish flow is wired in orchestration
- [ ] Add better Telegram formatting template
- [ ] Add publish failure recovery workflow

## 7. Public Website

- [x] Add root landing page
- [x] Add public article list page
- [x] Add public article detail page
- [x] Add categories API
- [x] Add not found page
- [~] Public website reads published content
- [x] Add better home page sections
- [x] Add category pages
- [x] Add SEO metadata per article
- [x] Add source references block on article page

## 8. Telegram Mini App

- [x] Add Mini App feed page
- [x] Add Mini App article detail page
- [x] Mini App reads same published article source
- [x] Add category filter for Mini App
- [x] Add Mini App settings/preferences UI
- [x] Add saved items behavior

## 9. Admin Dashboard

- [x] Add admin layout
- [x] Add Lucide-based sidebar
- [x] Add admin overview page
- [x] Add sources page
- [x] Add articles page
- [x] Add raw articles page
- [x] Add pipeline page
- [x] Add failures page
- [x] Bind admin pages to live DB reads
- [x] Add manual pipeline trigger UI
- [x] Add source toggle UI
- [x] Add source create UI
- [x] Add verification detail UI
- [x] Add article detail admin view
- [x] Add better table UX and actions

## 10. API Layer

- [x] Add public article list API
- [x] Add public article detail API
- [x] Add categories API
- [x] Add admin sources API
- [x] Add admin source toggle API
- [x] Add admin raw articles API
- [x] Add admin verification API
- [x] Add admin pipeline runs API
- [x] Add admin pipeline trigger API
- [x] Add typed response helper foundation
- [x] Response helper exists but not all routes use it yet
- [x] Standardize all route responses
- [x] Add route-level error handling consistency

## 11. State and UI Infrastructure

- [x] Add TanStack Query provider
- [x] Add Zustand admin store
- [x] Add Zustand Mini App store
- [x] Add Lucide React icon usage foundation
- [x] Use TanStack Query on interactive admin data views
- [x] Add mutation invalidation flow

## 12. Worker and Operations

- [x] Add worker scaffold
- [x] Add pipeline run service
- [x] Add pipeline event writer
- [x] Add orchestration trigger endpoint
- [~] Worker orchestration flow exists in-process
- [x] Connect worker entrypoint to orchestration
- [x] Add cron scheduling entry
- [x] Add lock/idempotency protection
- [x] Add structured operational logs

## 13. Testing and Validation

- [x] Run Prisma generate successfully
- [~] Run Prisma migration successfully
- [~] Seed sources successfully
- [~] Validate one RSS ingestion cycle
- [ ] Validate one full local pipeline cycle
- [ ] Validate website publish path
- [ ] Validate Telegram publish path
- [ ] Add initial unit tests
- [ ] Add initial integration tests

## 14. Professionalization Tasks

- [x] Add shared API response wrappers everywhere
- [x] Add domain-level error classes
- [x] Add safer HTML/content sanitization strategy
- [x] Add article/source DTO typing cleanup
- [ ] Add admin loading and empty states polish
- [ ] Add code comments only where complexity justifies them

## Immediate Next Tasks

- [x] Standardize route responses using shared helper
- [x] Connect worker entrypoint to orchestration
- [x] Add cron trigger strategy
- [x] Add article detail admin view
- [x] Add verification-to-article traceability in UI

## Reference Docs

- [PHASES_OVERVIEW.md](/Users/coder/Desktop/news-app/docs/PHASES_OVERVIEW.md)
- [MVP_END_TO_END_SPEC.md](/Users/coder/Desktop/news-app/docs/MVP_END_TO_END_SPEC.md)
- [PHASE_1_FOUNDATION_AND_ARCHITECTURE.md](/Users/coder/Desktop/news-app/docs/PHASE_1_FOUNDATION_AND_ARCHITECTURE.md)
- [PHASE_2_DATA_AND_INGESTION.md](/Users/coder/Desktop/news-app/docs/PHASE_2_DATA_AND_INGESTION.md)
- [PHASE_3_VERIFICATION_AND_AGENTS.md](/Users/coder/Desktop/news-app/docs/PHASE_3_VERIFICATION_AND_AGENTS.md)
- [PHASE_4_PUBLISHING_AND_CLIENT_SURFACES.md](/Users/coder/Desktop/news-app/docs/PHASE_4_PUBLISHING_AND_CLIENT_SURFACES.md)
- [PHASE_5_ADMIN_AND_OPERATIONS.md](/Users/coder/Desktop/news-app/docs/PHASE_5_ADMIN_AND_OPERATIONS.md)
