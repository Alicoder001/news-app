# AI Service

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Maqsad

AI Service OpenAI API yordamida quyidagi vazifalarni bajaradi:
- Maqolalarni o'zbek tiliga tarjima qilish
- Qisqa xulosalar yaratish (summarization)
- Kategoriya aniqlash
- Kontent sifatini baholash

---

## Fayl Joylashuvi

\\\
apps/web/src/lib/news/services/ai.service.ts
\\\

---

## Asosiy Funksiyalar

### 1. translateAndSummarize

Maqolani tarjima qiladi va xulosa yaratadi.

\\\	ypescript
interface TranslateResult {
  title: string;        // Tarjima qilingan sarlavha
  summary: string;      // Qisqa xulosa (150-200 so'z)
  content: string;      // To'liq tarjima
  category: string;     // Aniqlangan kategoriya
  tags: string[];       // Teglar
  relevanceScore: number; // 0-1 relevanlik bali
}

async function translateAndSummarize(
  article: RawArticle
): Promise<TranslateResult>
\\\

### 2. detectCategory

Maqola kategoriyasini aniqlaydi.

\\\	ypescript
async function detectCategory(
  title: string,
  content: string
): Promise<string>
\\\

### 3. checkQuality

Kontent sifatini tekshiradi.

\\\	ypescript
interface QualityCheck {
  isQuality: boolean;
  score: number;        // 0-100
  issues: string[];     // Topilgan muammolar
}

async function checkQuality(
  content: string
): Promise<QualityCheck>
\\\

---

## OpenAI Konfiguratsiya

\\\	ypescript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Model
const MODEL = "gpt-4o-mini"; // Cost-effective

// Parameters
const config = {
  temperature: 0.3,     // Deterministic
  max_tokens: 2000,
  top_p: 0.9,
};
\\\

---

## Prompt Templates

### Tarjima Prompt

\\\
Siz professional texnologiya tarjimoni va tahririysiz.

Vazifa:
1. Quyidagi maqolani o'zbek tiliga tarjima qiling
2. 150-200 so'zlik qisqa xulosa yarating
3. Kategoriyani aniqlang: ai, web, mobile, cloud, security, data
4. 3-5 ta teglar tanlang

Maqola:
{article_content}

JSON formatida javob bering:
{
  "title": "...",
  "summary": "...",
  "content": "...",
  "category": "...",
  "tags": ["...", "..."]
}
\\\

---

## Rate Limiting

\\\	ypescript
const rateLimiter = {
  requestsPerMinute: 60,
  tokensPerMinute: 90000,
  retryDelay: 1000,     // ms
  maxRetries: 3,
};
\\\

---

## Error Handling

\\\	ypescript
try {
  const result = await translateAndSummarize(article);
} catch (error) {
  if (error.code === 'rate_limit_exceeded') {
    // Wait and retry
    await sleep(60000);
    return retry();
  }
  if (error.code === 'context_length_exceeded') {
    // Truncate content
    return translateAndSummarize({
      ...article,
      content: truncate(article.content, 4000)
    });
  }
  throw error;
}
\\\

---

## Usage Tracking

Har bir API chaqiruv kuzatiladi:

\\\	ypescript
interface UsageRecord {
  timestamp: Date;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;          // USD
  articleId?: string;
}
\\\

---

## Environment Variables

\\\env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=2000
\\\

---

## Bog'liq Hujjatlar

- [News Pipeline](./NEWS_PIPELINE.md) - AI integratsiyasi
- [Prompts](../pipeline-architecture.md#prompts) - Prompt templates
- [Usage Tracking](./USAGE_TRACKER.md) - API usage monitoring
