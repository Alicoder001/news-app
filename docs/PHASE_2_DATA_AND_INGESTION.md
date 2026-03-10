# Phase 2: Data and Ingestion

## Maqsad

Bu fazada Prisma modeli va RSS ingestion qatlami belgilanadi.

## Prisma Core Entities

- `Source`
- `RawArticle`
- `VerificationRecord`
- `Article`
- `Delivery`
- `PipelineRun`
- `PipelineEvent`

## Asosiy qoidalar

- source config saqlanadi
- raw article unique URL bilan saqlanadi
- verification natijasi alohida saqlanadi
- full article va short post article modelida saqlanadi
- publish statuses tracking qilinadi

## RSS Ingestion

### Vazifalar

- RSS fetch
- parse
- normalize
- duplicate skip
- `raw_articles` ga yozish

### Source set

- OpenAI Blog
- Anthropic News
- Google DeepMind yoki Google AI
- TechCrunch AI
- The Verge AI

## Duplicate Protection

- canonical URL unique
- publishedAt + title fallback comparison
- duplicate item'lar skip qilinadi

## Phase Done Criteria

- Prisma schema tayyor
- migrations tayyor
- RSS fetch ishlaydi
- raw articles DB'ga yoziladi
- duplicate protection ishlaydi
