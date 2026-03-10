# ai_shunos Roadmap

## Maqsad

Noldan minimal, ishlaydigan AI news pipeline qurish:

- RSS orqali yangilik yig'ish
- oddiy filterdan o'tkazish
- AI bilan Uzbekcha kontent tayyorlash
- bazaga saqlash
- Telegram kanalga yuborish
- web saytga chiqarish

Asosiy tamoyil:

`birinchi versiya = simple, deterministic, debuggable`

Avval minimal ishlaydigan tizim quriladi. Keyin sifat, avtomatlashtirish va murakkab agentlar qo'shiladi.

## 0-bosqich: Arxitektura Qarori

Bu bosqichda loyiha cheklovlari va texnik yo'nalish muzlatiladi.

### Tanlanadigan stack

- `Next.js`
- `PostgreSQL`
- `Prisma`
- `OpenAI` yoki bitta AI provider
- `Telegram Bot API`

### Birinchi release'da bo'ladi

- `RSS`
- `single AI pipeline`
- `manual/admin trigger`
- `Telegram channel posting`
- `website article pages`

### Hozircha bo'lmaydi

- `Twitter/X`
- `Twikit`
- `multi-agent`
- `fact-check agent`
- `reviewer agent`
- `mobile app`
- `multi-language`

### Deploy tavsiya

- web/admin: `Vercel`
- database: `Supabase` yoki `Neon`
- cron/worker: oddiy cron yoki queue worker

## 1-bosqich: Foundation

Maqsad: toza skelet tayyor bo'lsin.

### Vazifalar

- loyiha strukturasi yaratish
- `.env.example`
- env validation
- lint
- typecheck
- minimal README

### Tavsiya etilgan struktura

```text
docs/
prisma/
src/
  app/
  lib/
    db/
    rss/
    ai/
    telegram/
    pipeline/
```

### Done mezoni

- loyiha local'da ko'tariladi
- db ulanish ishlaydi
- environment o'zgaruvchilar validatsiyasi mavjud

## 2-bosqich: Data Model

Maqsad: MVP uchun minimal, lekin kengayadigan schema.

### MVP jadvallari

- `sources`
- `raw_articles`
- `articles`
- `pipeline_runs`

### Minimal fields

#### `sources`

- `id`
- `name`
- `url`
- `type`
- `isActive`
- `lastFetchedAt`

#### `raw_articles`

- `id`
- `sourceId`
- `title`
- `summary`
- `content`
- `url`
- `imageUrl`
- `publishedAt`
- `isProcessed`

#### `articles`

- `id`
- `rawArticleId`
- `slug`
- `title`
- `summary`
- `content`
- `category`
- `tags`
- `telegramPosted`
- `telegramMessageId`
- `createdAt`

#### `pipeline_runs`

- `id`
- `status`
- `startedAt`
- `finishedAt`
- `found`
- `processed`
- `posted`
- `errors`
- `notes`

### Keyin qo'shiladi

- `ai_usage`
- `fact_checks`
- `post_reviews`
- `system_settings`
- `job_logs`

## 3-bosqich: RSS Ingestion MVP

Maqsad: RSS'dan yangiliklarni olib `raw_articles` ga saqlash.

### Vazifalar

- RSS parser yozish
- source list saqlash
- duplicate check qilish
- HTML clean qilish
- published date parse qilish
- fetch log yuritish

### Birinchi source set

- OpenAI Blog
- Anthropic News
- Google AI yoki DeepMind
- TechCrunch AI
- The Verge AI

### Done mezoni

- bitta trigger bilan RSS fetch ishlaydi
- maqolalar `raw_articles` ga yoziladi
- bir xil `url` ikki marta saqlanmaydi

## 4-bosqich: Basic Filtering MVP

Maqsad: spam va irrelevant kontentni kamaytirish.

### Minimal filter qoidalari

- title juda qisqa bo'lmasin
- reklama keyword'lari bo'lsa skip qilinsin
- AI/IT/tech keyword based score bo'lsin
- source whitelist ishlasin

### Hozircha yetadi

- heuristic filter
- oddiy keyword relevance

### Keyin qo'shiladi

- AI relevance scoring
- source trust score
- category confidence

### Done mezoni

- raw item'larning bir qismi avtomatik skip bo'ladi
- filter qoidalari sodda va tushunarli bo'ladi

## 5-bosqich: AI Processing MVP

Maqsad: raw article'dan Uzbekcha tayyor article yaratish.

### AI input

- title
- summary yoki content
- source url

### AI output

- `title`
- `summary`
- `content`
- `slug`
- `category`
- `tags`

### Qoidalar

- clickbait yo'q
- faqat mavjud faktlar
- Uzbekcha ravon uslub
- texnik atamalar kerak bo'lsa inglizcha qoladi

### Hozircha qilinmaydi

- full fact-check
- reviewer loop
- multi-pass rewrite

### Done mezoni

- raw article -> `article` yoziladi
- invalid AI output retry yoki fail bo'ladi
- fallback rejim bo'ladi

## 6-bosqich: Telegram Posting MVP

Maqsad: tayyor maqolani kanalga yuborish.

### Minimal format

- sarlavha
- 2-4 gaplik summary
- 1-3 hashtag
- source link
- website article link

### Vazifalar

- bot token ulash
- channel id ulash
- `sendMessage`
- parse mode sozlash
- `telegramMessageId` saqlash
- duplicate post oldini olish

### Done mezoni

- bitta article Telegram kanalga yuboriladi
- db'da `telegramPosted=true` bo'ladi

## 7-bosqich: Manual Admin MVP

Maqsad: tizimni browser orqali boshqarish.

### Minimal admin funksiyalar

- source list
- sync trigger
- process trigger
- article list
- raw article list
- telegram repost button
- pipeline runs list

### Minimal auth

- simple admin password
- protected route
- internal secret

### Done mezoni

- browser orqali pipeline'ni boshqarish mumkin
- qaysi bosqich ishlamayotgani ko'rinadi

## 8-bosqich: Cron va Automation MVP

Maqsad: tizimni avtomatlashtirish.

### Minimal schedule

- har 30 daqiqada `sync`
- sync'dan keyin `process`
- har 1 soatda `telegram publish`

### Muhim talablar

- idempotency
- duplicate protection
- "already running" lock

### Done mezoni

- tizim qo'lda bosmasdan ishlaydi
- bir xil yangilik 2 marta post bo'lmaydi

## 9-bosqich: Public Website MVP

Maqsad: maqolalar saytga chiqsin.

### Minimal sahifalar

- home
- article detail
- category page
- about
- contact yoki telegram CTA

### Minimal API

- article list
- article by slug
- categories

### SEO minimum

- slug
- metadata
- sitemap
- robots
- open graph

### Done mezoni

- article browser orqali o'qiladi
- Telegram'dan saytga trafik kelsa ochiladi

## 10-bosqich: Stabilization

Maqsad: MVP'ni real ishlaydigan holatga olib chiqish.

### Vazifalar

- structured logging
- error handling
- retry policy
- timeout policy
- AI parse guards
- rate-limit
- env validation mustahkamlash
- pipeline health status

### Test minimum

- RSS parsing test
- AI response parsing test
- telegram formatting test
- repository test

### Done mezoni

- bitta xato butun pipeline'ni yiqitmaydi
- log orqali muammo topish oson bo'ladi

## MVP Yakuni

MVP tayyor deb hisoblash uchun quyidagilar ishlashi kerak:

- RSS source qo'shish mumkin
- source'dan raw news olinadi
- duplicate bo'lmaydi
- relevant news filter'dan o'tadi
- AI Uzbekcha article yaratadi
- article DB'da saqlanadi
- Telegram'ga post ketadi
- admin panel'dan trigger qilish mumkin
- cron bilan avtomatik yuradi
- website'da article ko'rinadi

## MVPdan Keyingi Bosqichlar

## 11-bosqich: Better Content Quality

- promptlarni yaxshilash
- article style guide
- stronger title rules
- category mapping improvement
- better tags
- reading time
- source attribution block

## 12-bosqich: Fact-Check Layer

Maqsad: kontent ishonchliligini oshirish.

### Minimal variant

- AI orqali `confidence` so'rash
- unsupported claims aniqlash
- source trust score
- date consistency check
- number consistency check

### Keyin

- secondary source lookup
- `confirmed / partial / unconfirmed`
- fact-check notes

## 13-bosqich: Reviewer Layer

Maqsad: publish oldidan sifat nazorati.

### Vazifalar

- format qoidalarini tekshirish
- noto'g'ri taassurotlarni topish
- Uzbek grammar sifatini tekshirish
- reject/rewrite cycle

Izoh:
Bu bosqich foydali, lekin MVP uchun shart emas.

## 14-bosqich: Multi-Provider Source Expansion

### Keyingi source'lar

- NewsAPI
- GNews
- TheNewsAPI
- manual RSS input
- source health monitoring

### Keyinroq

- Twitter/X
- Reddit
- Hacker News
- Product Hunt
- GitHub releases

## 15-bosqich: Queue va Worker Arxitekturasi

Maqsad: yuk oshganda pipeline'ni barqaror ishlatish.

### Vazifalar

- `BullMQ`
- alohida worker
- job retries
- dead-letter handling
- concurrency control

## 16-bosqich: Full Admin System

- roles
- login sessions
- audit logs
- source management CRUD
- article edit/publish workflow
- manual approve/reject
- pipeline settings UI
- prompt settings UI

## 17-bosqich: Analytics

- article views
- telegram CTR
- best categories
- best sources
- publish time effectiveness
- AI cost dashboard
- pipeline success rate

## 18-bosqich: Telegram Mini App

- article feed
- saved posts
- categories
- share
- Telegram-native UX
- channel integration

## 19-bosqich: Search va Discovery

- full-text search
- tag filtering
- similar articles
- trending articles
- featured articles

## 20-bosqich: Content Enrichment

- hero image extraction
- og/twitter image parsing
- auto thumbnail
- source logos
- article linking
- glossary blocks
- `why this matters` section

## 21-bosqich: Multi-Language

- Uzbek first
- Russian later
- English mirror later

Tavsiya:
Avval bitta tilni sifatli qilish kerak.

## 22-bosqich: Multi-Agent Upgrade

Faqat oddiy pipeline stabil bo'lgandan keyin.

### Agentlar

- collector
- filter
- fact-checker
- writer
- reviewer

Izoh:
Bu bosqich complexity'ni juda oshiradi. Hozir emas.

## 23-bosqich: Monetization va Productization

- sponsor blocks
- ads
- premium digest
- newsletter
- paid Telegram tier
- API access

## Prioritetlar

### Must-have

- project skeleton
- prisma schema
- RSS ingestion
- duplicate prevention
- basic filter
- AI article generation
- DB save
- Telegram posting
- admin trigger
- cron
- public article pages

### Should-have

- pipeline run logs
- source CRUD
- article edit page
- retry logic
- AI usage tracking
- category va tag improvement
- basic analytics

### Nice-to-have

- fact-check layer
- reviewer layer
- queue workers
- mini app
- multi-language
- multi-agent architecture
- Twitter/X ingestion

### Hozircha qilinmaydi

- Twikit
- deep autonomous agents
- fancy mobile app
- complex auth va roles
- aggressive analytics stack
- recommendation engine

## Realistik Timeline

### 1-hafta

- foundation
- schema
- RSS ingestion
- raw articles save

### 2-hafta

- filtering
- AI processing
- articles save
- telegram posting

### 3-hafta

- admin trigger
- website pages
- cron
- logs va bug fixes

Natija:
working MVP

### 4-6 hafta

- stabilization
- source management
- analytics lite
- content quality improvements

### 6+ hafta

- fact-check
- reviewer
- queue worker
- mini app
- richer ecosystem

## Asosiy Qaror

Birinchi versiya maksimal oddiy bo'lishi kerak:

- kam source
- kam AI step
- kam moving part
- ko'proq kuzatish osonligi

Shunda loyiha tez oyoqqa turadi va keyingi murakkab bosqichlarni qo'shish ancha oson bo'ladi.
