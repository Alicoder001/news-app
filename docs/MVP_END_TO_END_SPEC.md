# ai_shunos MVP End-to-End Specification

## 1. Hujjat Maqsadi

Bu hujjat `ai_shunos` loyihasining `MVP` versiyasi uchun to'liq `end-to-end` texnik spetsifikatsiyasidir.

Hujjat quyidagilarni bir joyda belgilaydi:

- product scope
- texnik stack
- arxitektura
- data flow
- 3 agentli pipeline
- RSS ingestion
- 2-3 source verification
- `web first, telegram second` publish tartibi
- Prisma asosidagi ma'lumot modeli
- frontend data fetching uchun `TanStack Query`
- local UI state uchun `Zustand`
- icon system uchun `Lucide React`
- admin panel
- Telegram Mini App
- deploy va operatsion model

Bu hujjat MVP ni noldan professional va izchil qurish uchun asosiy tayanch hujjat bo'ladi.

## 2. Product Vision

`ai_shunos` bu AI, IT va zamonaviy texnologiyalar bo'yicha yangiliklarni avtomatik yig'adigan, tekshiradigan, Uzbekcha formatga keltiradigan va bir nechta platformada tarqatadigan tizim.

MVP maqsadi:

- RSS orqali yangilik olish
- kamida 2-3 ishonchli source bilan tekshirish
- 3 agent orqali kontentni tayyorlash
- full article'ni avval web'ga yozish
- keyin short post'ni Telegram kanalga yuborish
- Telegram Mini App orqali full article'ni ko'rsatish

MVP `simple but real` bo'lishi kerak.

Ya'ni:

- kam moving part
- debug qilish oson
- deterministic pipeline
- kengaytirishga tayyor arxitektura

## 3. MVP Scope

## In Scope

- `RSS only` ingestion
- `30 minut` scheduler
- `2-3 source verification`
- `3 ta agent`
- `Prisma + PostgreSQL`
- public website
- Telegram Bot va kanal posting
- Telegram Mini App
- admin dashboard
- pipeline logs va statuses

## Out of Scope

- Twitter/X ingestion
- Twikit
- mobile app
- multi-language
- advanced recommendation engine
- monetization
- multi-agent swarm
- deep research mode

## 4. Core Functional Requirements

MVP quyidagi biznes oqimni bajarishi kerak:

1. tizim har 30 minutda ishga tushadi
2. RSS source'lardan yangi article'lar olinadi
3. duplicate item'lar chiqarib tashlanadi
4. article uchun qo'shimcha 1-2 ta ishonchli manba topiladi
5. jami kamida 2 ta, ideal holda 3 ta source bilan tekshiruv qilinadi
6. 3 agent article'ni ketma-ket qayta ishlaydi
7. final approved full article website'ga saqlanadi
8. website URL olingandan keyin short post Telegram kanalga yuboriladi
9. Telegram Mini App full article'ni shu umumiy content source'dan ko'rsatadi

## 5. Publish Order

MVP uchun publish tartibi qat'iy:

1. `full article -> website`
2. `website public url -> generated`
3. `short post + website link -> Telegram`
4. `Mini App -> reads full article from DB/API`

Bu tartibning sabablari:

- Telegram post ichida tayyor link bo'ladi
- web `source of truth` bo'ladi
- Mini App va website bir xil content'dan foydalanadi
- duplicate content generation kamayadi

## 6. Recommended Tech Stack

## Frontend

- `Next.js`
- `React`
- `TypeScript`
- `Tailwind CSS`
- `TanStack Query`
- `Zustand`
- `Lucide React`

## Backend

- `Next.js Route Handlers` yoki bitta backend layer
- `Node.js`
- `TypeScript`
- `Prisma`
- `PostgreSQL`

## Pipeline

- `Node worker / scheduled process`
- RSS parser
- verification service
- agent orchestration service
- Telegram delivery service

## Runtime Environment

- `WSL Ubuntu` development muhiti sifatida
- `Docker Compose` runtime orchestration uchun

Tavsiya etilgan yondashuv:

- development WSL ichida olib boriladi
- Docker ham WSL terminal ichidan boshqariladi
- app, worker va postgres container'larda ishlaydi

## AI / Agent Runtime

Hozirgi sharoitda `OpenAI API token` yo'qligi sabab:

- development assistant sifatida `Codex`
- runtime agent orchestration uchun `CLI-based agent execution`

Asosiy tamoyil:

- app logic Node/TypeScript'da bo'ladi
- agentlar esa aniq prompt kontraktlari bilan chaqiriladi

## Icons

- `Lucide React`

Sababi:

- consistent icon set
- tree-shake friendly
- admin va public UI uchun professional ko'rinish

## 7. Deployment Strategy

## Development Operations Model

MVP uchun tavsiya etilgan operatsion model:

- `WSL Ubuntu + Docker Compose`

Ya'ni:

- kod WSL ichida yoziladi
- terminal komandalar WSL ichida yuradi
- Docker Compose ham WSL ichida ishlatiladi

Bu model development va production orasidagi tafovutni kamaytiradi.

## Local / Persistent Server

Quyidagi qismlar `doimiy server` yoki local/VPS worker tomonda ishlashi kerak:

- RSS fetch
- 30 minut scheduler
- source verification
- 3 agent pipeline
- Telegram posting
- pipeline run orchestration
- retry and lock mechanism

## Local Runtime Containers

Minimal container to'plami:

- `postgres`
- `app`
- `worker`

Keyinroq:

- `redis`

## Vercel

Quyidagi qismlar `Vercel`da ishlashi mumkin:

- public website
- article pages
- category pages
- Telegram Mini App frontend
- public read APIs

## Admin Dashboard Position

MVP uchun admin dashboard ham `local stack` bilan birga yuritilishi tavsiya qilinadi.

Sababi:

- local worker statuslarini bevosita ko'rish oson
- internal logs va retry actions bir joyda bo'ladi
- local service'ni Vercel'dan boshqarish uchun ortiqcha tunnel yoki bridge kerak bo'lmaydi

Shuning uchun MVP bo'yicha tavsiya:

- `Admin dashboard -> local`
- `Public website + Mini App -> Vercel`

## Database

- `PostgreSQL`
- `Prisma ORM`

Deploy variantlari:

- `Supabase`
- `Neon`
- yoki boshqa managed Postgres

## Local to Vercel Signal Model

Local worker bilan Vercel orasidagi asosiy signal `shared PostgreSQL database` bo'ladi.

Oqim:

1. local worker article'ni yakunlaydi
2. final approved article shared DB'ga yoziladi
3. Vercel public app shu DB'dan article'ni o'qiydi
4. article slug asosida public URL tayyor bo'ladi
5. local worker short post'ni shu website link bilan Telegram'ga yuboradi

Qo'shimcha ravishda optional:

- cache revalidation endpoint

Lekin MVP uchun primary integration modeli:

- `Local worker -> Shared DB -> Vercel reads`

## Operational Recommendation

Asosiy tavsiya:

- development va boshqaruv `WSL Ubuntu terminal` ichida bo'ladi
- Docker Compose ham shu yerdan boshqariladi
- local worker uzluksiz ishlash uchun container'da yuradi

Bu MVP uchun terminalda oddiy run qilishdan ko'ra barqarorroq model hisoblanadi.

## 8. High-Level Architecture

```text
RSS Sources
  -> Ingestion Service
  -> RawArticle Store
  -> Verification Service
  -> Agent 1: Collector
  -> Agent 2: Analyzer/Writer
  -> Agent 3: Reviewer
  -> Full Article Saved
  -> Website Publish
  -> Telegram Short Post Publish
  -> Mini App / Website Read API
```

## Arxitektura tamoyillari

- data first
- web as source of truth
- strict JSON contracts between agents
- clear failure states
- auditable pipeline runs

## 9. Application Modules

Loyiha quyidagi modullarga bo'linadi.

## 9.1 Source Ingestion Module

Mas'uliyatlari:

- RSS source config
- fetch
- parse
- normalize
- deduplicate
- raw article save

## 9.2 Verification Module

Mas'uliyatlari:

- primary source ni aniqlash
- qo'shimcha ishonchli source topish
- kamida 2-3 source confirmation
- confidence level chiqarish

## 9.3 Agent Pipeline Module

Mas'uliyatlari:

- 3 agent ketma-ket ishga tushirish
- prompt input tayyorlash
- JSON parse
- retry handling
- final publish decision

## 9.4 Content Publishing Module

Mas'uliyatlari:

- article'ni website uchun save qilish
- public URL olish
- short post'ni Telegram'ga yuborish
- delivery statuses saqlash

## 9.5 Public Content Module

Mas'uliyatlari:

- article list
- article detail
- category pages
- Mini App feed
- SEO

## 9.6 Admin Module

Mas'uliyatlari:

- source list
- pipeline status
- runs history
- failed items
- manual trigger
- approved content review

## 10. Detailed End-to-End Flow

## Step 1: Scheduled Trigger

Pipeline `har 30 minutda` ishga tushadi.

Schedule:

- `*/30 * * * *`

Kerakli guardlar:

- lock
- idempotency key
- active run check

## Step 2: RSS Fetch

Har active source uchun:

- RSS feed olinadi
- item'lar parse qilinadi
- title, summary, url, publishedAt, source metadata ajratiladi
- duplicate URL'lar skip qilinadi

Natija:

- `raw_articles` ga yoziladi

## Step 3: Verification

Har raw article uchun:

- original source saqlanadi
- voqeaga oid 1 yoki 2 ta qo'shimcha manba topiladi
- source'lar ishonch bo'yicha baholanadi
- article `verified`, `partial` yoki `insufficient` bo'ladi

Minimal publish qoidasi:

- `2 ta source`: publish mumkin
- `3 ta source`: yuqori ishonch
- `1 ta source`: hold

## Step 4: Agent 1 - Collector

Vazifasi:

- xom ma'lumotni tozalash
- normalized article tayyorlash
- keyingi bosqich uchun metadata ajratish

Natija:

- normalized JSON payload

## Step 5: Agent 2 - Analyzer / Writer

Vazifasi:

- relevance ni tekshirish
- verification natijasini inobatga olish
- Uzbekcha `full article`
- Uzbekcha `short post`
- category
- tags
- slug

Natija:

- draft article object

## Step 6: Agent 3 - Reviewer

Vazifasi:

- source reference va faktlar mosligini tekshirish
- publish formatni tekshirish
- `APPROVE`, `REJECT`, `HOLD` qarori berish

Natija:

- final decision

## Step 7: Website Publish

Agar article approve bo'lsa:

- `articles` jadvaliga yoziladi
- public slug yaratiladi
- article web'da ochiladigan holatga keladi

Natija:

- public URL

## Step 8: Telegram Publish

Website publish muvaffaqiyatli tugagandan keyin:

- short post tayyor formatda yuboriladi
- short post ichida website link bo'ladi
- Telegram delivery status saqlanadi

## Step 9: Mini App Availability

Mini App:

- alohida kontent generatsiya qilmaydi
- web/API orqali article'ni o'qiydi
- full article'ni ko'rsatadi

## 11. Source Verification Strategy

Bu MVP'dagi eng muhim biznes qoidalardan biri.

## Verification objective

RSS'dan kelgan item faqat bitta source bilan publish qilinmaydi.

Kamida:

- `2 ta source` required
- `3 ta source` preferred

## Ishonchli source kategoriyalari

### Tier 1

- official company blog
- official newsroom
- official research post
- official release note

### Tier 2

- TechCrunch
- The Verge
- Wired
- Ars Technica
- MIT Technology Review

### Tier 3

- boshqa obro'li tech media

## Verification result states

- `VERIFIED`
- `PARTIAL`
- `INSUFFICIENT`

## Publish policy

- `VERIFIED`: proceed
- `PARTIAL`: reviewer qaroriga ko'ra
- `INSUFFICIENT`: hold

## 12. Agent System Design

MVP uchun agentlar soni qat'iy `3 ta`.

## Agent 1: Collector

Responsibility:

- normalize raw article
- clean noisy content
- preserve factual input

Key output:

- normalized article

## Agent 2: Analyzer / Writer

Responsibility:

- determine relevance
- write full article
- write short post
- categorize content

Key output:

- publishable draft

## Agent 3: Reviewer

Responsibility:

- quality gate
- factual guard
- source alignment check
- final approval

Key output:

- decision object

## Agent design principles

- role separation
- strict I/O contract
- no role overlap
- JSON only
- fail-safe decisioning

## 13. Prompt Engineering Standard

Har prompt quyidagilarni o'z ichiga oladi:

- role statement
- clear task
- exact JSON schema
- forbidden behaviors
- failure behavior

## Mandatory guardrails

- do not invent facts
- do not add unsupported claims
- do not output text outside JSON
- do not use sensational language
- do not ignore source verification state

## Prompt versioning

Promptlar versiyalanadi:

- `collector.system.v1`
- `collector.task.v1`
- `writer.system.v1`
- `writer.task.v1`
- `reviewer.system.v1`
- `reviewer.task.v1`

## Retry strategy

- first try: normal prompt
- second try: strict formatting reminder
- third try: mark hold/fail

## 14. Data Model with Prisma

MVP uchun `Prisma` asosiy ORM bo'ladi.

Sabablari:

- type-safe schema
- migration support
- clean TypeScript integration
- admin va API qatlamlari uchun qulay

## Minimal Prisma entities

- `Source`
- `RawArticle`
- `VerificationRecord`
- `Article`
- `Delivery`
- `PipelineRun`
- `PipelineEvent`

## 14.1 Source

Vazifasi:

- RSS source'larni saqlash

Maydonlar:

- `id`
- `name`
- `url`
- `type`
- `isActive`
- `lastFetchedAt`
- `createdAt`
- `updatedAt`

## 14.2 RawArticle

Vazifasi:

- RSS'dan kelgan xom article'ni saqlash

Maydonlar:

- `id`
- `sourceId`
- `title`
- `summary`
- `content`
- `canonicalUrl`
- `imageUrl`
- `publishedAt`
- `ingestedAt`
- `isDuplicate`
- `isProcessed`

## 14.3 VerificationRecord

Vazifasi:

- qaysi article qaysi source'lar bilan tekshirilganini saqlash

Maydonlar:

- `id`
- `rawArticleId`
- `status`
- `confidence`
- `notes`
- `sourceCount`
- `createdAt`

Qo'shimcha child records:

- verification sources

## 14.4 Article

Vazifasi:

- final approved article

Maydonlar:

- `id`
- `rawArticleId`
- `slug`
- `title`
- `shortSummary`
- `shortPost`
- `fullArticle`
- `category`
- `tags`
- `websitePublished`
- `websitePublishedAt`
- `websiteUrl`
- `telegramPublished`
- `telegramPublishedAt`
- `telegramMessageId`
- `status`
- `createdAt`
- `updatedAt`

## 14.5 Delivery

Vazifasi:

- distribution status'larni track qilish

Maydonlar:

- `id`
- `articleId`
- `channel`
- `status`
- `externalId`
- `errorMessage`
- `createdAt`
- `updatedAt`

Channel misollar:

- `WEB`
- `TELEGRAM`
- `MINI_APP`

## 14.6 PipelineRun

Vazifasi:

- har 30 minutlik ishga tushishlarni kuzatish

Maydonlar:

- `id`
- `status`
- `startedAt`
- `finishedAt`
- `articlesFound`
- `articlesVerified`
- `articlesProcessed`
- `articlesPublishedWeb`
- `articlesPublishedTelegram`
- `errorsCount`
- `notes`

## 14.7 PipelineEvent

Vazifasi:

- granular log

Maydonlar:

- `id`
- `pipelineRunId`
- `stage`
- `level`
- `message`
- `meta`
- `createdAt`

## 15. API Design

MVP uchun API ikki turga bo'linadi.

## Public API

- `GET /api/articles`
- `GET /api/articles/:slug`
- `GET /api/categories`
- `GET /api/mini-app/feed`

## Admin API

- `GET /api/admin/sources`
- `POST /api/admin/pipeline/run`
- `GET /api/admin/pipeline/runs`
- `GET /api/admin/raw-articles`
- `GET /api/admin/articles`
- `GET /api/admin/failures`

## Internal Pipeline API

- `POST /api/internal/ingest`
- `POST /api/internal/verify`
- `POST /api/internal/process`
- `POST /api/internal/publish/web`
- `POST /api/internal/publish/telegram`

Izoh:

MVP'da buning barchasi alohida service bo'lishi shart emas. Bir app ichida ichki service layer sifatida ham qurilishi mumkin.

## 16. Frontend Architecture

Frontend `Next.js` asosida quriladi.

Yo'nalishlar:

- public website
- admin dashboard
- Telegram Mini App frontend

## Tavsiya etilgan tuzilma

```text
src/
  app/
    (public)/
    admin/
    tg/
    api/
  components/
  features/
  entities/
  lib/
    api/
    db/
    pipeline/
    rss/
    telegram/
    validation/
  stores/
```

## 17. TanStack Query Usage

`TanStack Query` server state uchun ishlatiladi.

## Nima uchun kerak

- cache
- refetch
- stale state handling
- pagination
- admin table refresh
- Mini App feed sync

## Qayerda ishlatiladi

- article list
- article detail
- category articles
- admin pipeline runs
- admin sources
- raw article list
- failed item list

## Query keys misollari

- `['articles', filters]`
- `['article', slug]`
- `['categories']`
- `['admin', 'pipeline-runs']`
- `['admin', 'sources']`
- `['mini-app', 'feed']`

## Mutation ishlatiladigan joylar

- manual pipeline trigger
- source toggle
- source create/update
- republish telegram

## 18. Zustand Usage

`Zustand` local UI state uchun ishlatiladi.

## Nima uchun kerak

- lightweight
- boilerplate kam
- admin filter state
- Mini App local preferences
- optimistic UI helpers

## Qayerda ishlatiladi

- admin sidebar state
- table filter and sort state
- selected source filters
- Mini App saved local preferences
- theme yoki compact UI toggles

## Zustand ishlatmaydigan joylar

Quyidagilar `server state` bo'lgani uchun `TanStack Query`da qoladi:

- article list
- pipeline runs
- sources from server
- published content

Tamoyil:

- `remote async data -> TanStack Query`
- `local ui/session state -> Zustand`

## 19. Lucide React Usage

`Lucide React` barcha icon'lar uchun standart bo'ladi.

## Ishlatiladigan joylar

- admin navigation
- pipeline statuses
- source types
- publish status
- Mini App controls
- website utility actions

## Foydasi

- professional ko'rinish
- consistent icon language
- modern dashboard UX

## 20. Public Website Requirements

## Core pages

- Home
- Article Detail
- Category Page
- About
- Contact

## Home page

Bo'lishi kerak:

- latest articles
- featured section
- category nav
- telegram CTA

## Article detail

Bo'lishi kerak:

- title
- summary
- full article
- source references
- publish date
- category
- tags
- share actions

## Category page

Bo'lishi kerak:

- category title
- article list
- pagination yoki load more

## SEO

- clean slug
- metadata
- open graph
- sitemap
- robots
- canonical url

## 21. Telegram Mini App Requirements

Mini App alohida content source emas.

U quyidagilarni qiladi:

- article feed ko'rsatadi
- full article ochadi
- category bo'yicha filtrlash beradi
- web bilan bir xil content'dan foydalanadi

## Mini App minimal sahifalar

- feed
- article detail
- category filter
- settings lite

## Mini App state

- active category
- local reading preferences
- optional saved items

## 22. Admin Dashboard Requirements

Admin MVP uchun quyidagilar kerak:

- source management
- pipeline runs list
- manual trigger
- raw articles list
- verification result ko'rish
- approved / hold / failed item list
- article publish statuses

## Admin views

### Sources

- source list
- active/inactive toggle
- add source
- edit source

### Pipeline

- last run
- current status
- metrics
- manual run button

### Raw Articles

- title
- source
- publishedAt
- processed status

### Articles

- title
- category
- web published
- telegram published
- hold/reject reason

## 23. Observability and Logging

MVP ham kuzatish oson bo'lishi kerak.

## Logging talablar

- har pipeline run loglanadi
- har stage bo'yicha event yoziladi
- xatolar structured bo'ladi
- external delivery xatolari saqlanadi

## Monitoring ko'rsatkichlari

- fetched articles count
- verified articles count
- hold count
- rejected count
- web publish success
- telegram publish success
- total errors

## 24. Error Handling Policy

Har bosqichda aniq failure holatlari bo'lishi kerak.

## RSS stage

- source down
- invalid XML
- timeout

Natija:

- source-level error
- pipeline davom etadi

## Verification stage

- enough sources topilmadi
- conflicting sources

Natija:

- article `HOLD`

## Agent stage

- invalid JSON
- empty output
- output schema mismatch

Natija:

- retry
- still fail -> `HOLD`

## Website publish stage

- db write fail
- slug conflict

Natija:

- article not published
- telegram publish boshlanmaydi

## Telegram publish stage

- bot api fail
- rate limit
- invalid chat id

Natija:

- web published state saqlanadi
- telegram delivery `FAILED`

## 25. Security Model

MVP uchun yengil, lekin yetarli security kerak.

## Talablar

- admin routes protected
- internal pipeline endpoints secret bilan himoyalangan
- env secrets exposed bo'lmasin
- Telegram token faqat serverda ishlatiladi
- DB credentials client'ga chiqmaydi

## 26. Testing Strategy

MVP uchun kamida quyidagi test qatlamlari bo'lishi kerak.

## Unit tests

- RSS parsing
- duplicate detection
- verification scoring
- prompt output parsing
- telegram formatter

## Integration tests

- ingest to raw article
- raw article to approved article
- website publish flow
- telegram publish flow

## Contract tests

- agent JSON schema validation
- API response shapes

## Manual test scenarios

- single source insufficient article
- verified multi-source article
- telegram publish failure
- website publish success but telegram fail

## 27. MVP Folder Structure

```text
docs/
prisma/
  schema.prisma
src/
  app/
    (public)/
    admin/
    tg/
    api/
  components/
  entities/
  features/
  lib/
    api/
    db/
    rss/
    verification/
    agents/
    pipeline/
    publish/
    telegram/
    validation/
  stores/
    admin-ui.store.ts
    mini-app.store.ts
prompts/
  collector/
  writer/
  reviewer/
```

## 28. Environment Variables

Minimal env ro'yxati:

- `DATABASE_URL`
- `APP_URL`
- `INTERNAL_PIPELINE_SECRET`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHANNEL_ID`
- `CRON_SECRET`
- `AGENT_RUNTIME_MODE`

Optional:

- `REDIS_URL`
- `ADMIN_PASSWORD`

## 29. MVP Delivery Milestones

## Milestone 1: Foundation

- Next.js app
- Prisma
- PostgreSQL
- env validation
- docs baseline

## Milestone 2: Ingestion

- sources
- RSS fetch
- raw article save
- duplicate prevention

## Milestone 3: Verification

- source verification model
- verified / partial / insufficient states

## Milestone 4: Agents

- 3 prompts
- orchestration
- JSON parsing
- retry rules

## Milestone 5: Publishing

- website publish
- telegram publish
- delivery tracking

## Milestone 6: Frontend

- website pages
- admin pages
- Mini App views
- TanStack Query integration
- Zustand local UI state
- Lucide React icons

## Milestone 7: Stabilization

- logs
- failures
- retries
- manual admin recovery

## 30. Definition of Done for MVP

MVP `done` deb hisoblanadi, agar:

- RSS source'lardan yangilik kelayotgan bo'lsa
- pipeline har 30 minutda ishlayotgan bo'lsa
- har publish article kamida 2 source bilan tekshirilgan bo'lsa
- 3 agent JSON contract bilan ishlayotgan bo'lsa
- approved article avval website'ga yozilsa
- keyin short post Telegram'ga yuborilsa
- Mini App full article'ni ko'rsatsa
- admin panel orqali runs ko'rinsa
- duplicate article publish bo'lmasa
- xatolar log qilinsa

## 31. MVPdan Keyingi Kengayishlar

MVP stabil bo'lgandan keyin:

- stronger fact-check
- queue worker
- analytics dashboard
- article edit flow
- advanced reviewer
- multilingual support
- richer Mini App
- additional sources

## 32. Final Technical Position

Loyiha MVP uchun quyidagi asosda quriladi:

- `Prisma` ma'lumot modeli uchun
- `PostgreSQL` persistent storage uchun
- `TanStack Query` server state uchun
- `Zustand` local UI state uchun
- `Lucide React` icon system uchun
- `RSS + verification + 3 agents` content pipeline uchun
- `Website first, Telegram second` publish policy uchun

Bu hujjatga amal qilinsa, loyiha MVP versiyasi professional, aniq va kengayadigan shaklda quriladi.
