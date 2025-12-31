# 🗺️ Loyiha Roadmap

> **Yaratilgan:** 2025-12-31  
> **Oxirgi yangilanish:** 2025-12-31  
> **Loyiha:** AI-Powered IT News Platform

---

## 📊 Loyiha Holati

```
████████████░░░░░░░░ 40% — Foundation Complete
```

| Bosqich | Holat | Tugash sanasi |
|---------|-------|---------------|
| Foundation | ✅ Tugallangan | 2024-12 |
| MVP | 🔄 Jarayonda | 2025-Q1 |
| V2 | ⏳ Rejalashtirilgan | 2025-Q2 |
| V3 | 💡 Istiqbol | 2025-Q3+ |

---

## 🎯 MVP (4-6 hafta)

### 1️⃣ AI Integration (1-hafta)

| Vazifa | Priority | Status |
|--------|----------|--------|
| OpenAI API integratsiyasi | 🔴 Critical | ⬜ |
| Gemini API fallback | 🟡 Medium | ⬜ |
| AI prompt engineering (O'zbek kontekst) | 🔴 Critical | ⬜ |
| Rate limiting va error handling | 🔴 Critical | ⬜ |
| AI response caching | 🟡 Medium | ⬜ |

**Texnik detallar:**
- `src/lib/news/services/ai.service.ts` ni qayta yozish
- OpenAI GPT-4o-mini yoki Gemini 2.0 Flash
- Structured output (JSON mode)
- Retry logic bilan resilient integration

---

### 2️⃣ News API Integration (1-hafta)

| Vazifa | Priority | Status |
|--------|----------|--------|
| NewsAPI.org real API | 🔴 Critical | ⬜ |
| TechCrunch RSS parser | 🟡 Medium | ⬜ |
| Hacker News API | 🟢 Low | ⬜ |
| Duplicate detection algorithm | 🔴 Critical | ⬜ |
| Source quality scoring | 🟡 Medium | ⬜ |

**Texnik detallar:**
- `src/lib/news/providers/` yangi provider'lar
- Zod schema validation
- Idempotent fetching

---

### 3️⃣ Telegram Bot Integration (1-hafta)

| Vazifa | Priority | Status |
|--------|----------|--------|
| Telegram Bot API setup | 🔴 Critical | ⬜ |
| Kanal avtomatik posting | 🔴 Critical | ⬜ |
| Webhook endpoint | 🔴 Critical | ⬜ |
| Message formatting (Markdown) | 🟡 Medium | ⬜ |
| Inline buttons (Read more) | 🟡 Medium | ⬜ |

**Texnik detallar:**
- `src/lib/news/services/telegram.service.ts` ni qayta yozish
- Grammy yoki node-telegram-bot-api
- `/api/telegram/webhook` endpoint

---

### 4️⃣ Cron & Pipeline (3-kun)

| Vazifa | Priority | Status |
|--------|----------|--------|
| Vercel Cron Jobs setup | 🔴 Critical | ⬜ |
| Hourly news fetch | 🔴 Critical | ⬜ |
| Pipeline monitoring/logging | 🟡 Medium | ⬜ |
| Failure alerting (Telegram) | 🟢 Low | ⬜ |

**Texnik detallar:**
- `vercel.json` cron configuration
- `/api/cron/fetch-news` endpoint
- Upstash QStash alternative

---

### 5️⃣ SEO & Meta Tags (3-kun)

| Vazifa | Priority | Status |
|--------|----------|--------|
| Dynamic OG images | 🟡 Medium | ⬜ |
| hreflang tags | 🔴 Critical | ⬜ |
| Canonical URLs | 🔴 Critical | ⬜ |
| Sitemap.xml generation | 🟡 Medium | ⬜ |
| robots.txt | 🟡 Medium | ⬜ |
| JSON-LD structured data | 🟢 Low | ⬜ |

---

### 6️⃣ Code Quality (2-kun)

| Vazifa | Priority | Status |
|--------|----------|--------|
| Constants file (magic numbers) | 🟡 Medium | ⬜ |
| Environment validation (Zod) | 🔴 Critical | ⬜ |
| Error boundaries | 🔴 Critical | ⬜ |
| CategoryNav DRY refactor | 🟡 Medium | ⬜ |
| TypeScript strict mode | 🟢 Low | ⬜ |

---

## 🚀 V2 (6-10 hafta)

### 7️⃣ Admin Dashboard

| Vazifa | Priority | Status |
|--------|----------|--------|
| Admin authentication | 🔴 Critical | ⬜ |
| Article moderation (approve/reject) | 🔴 Critical | ⬜ |
| Source management UI | 🟡 Medium | ⬜ |
| Analytics dashboard | 🟡 Medium | ⬜ |
| AI prompt configuration | 🟢 Low | ⬜ |

---

### 8️⃣ Audio Digest

| Vazifa | Priority | Status |
|--------|----------|--------|
| TTS API integration (ElevenLabs/OpenAI) | 🟡 Medium | ⬜ |
| Daily digest audio generation | 🟡 Medium | ⬜ |
| Audio player component | 🟡 Medium | ⬜ |
| Podcast RSS feed | 🟢 Low | ⬜ |

**Eslatma:** TZ bo'yicha audio matn sifatidan past bo'lsa - feature bekor qilinadi.

---

### 9️⃣ Enhanced Filtering

| Vazifa | Priority | Status |
|--------|----------|--------|
| ML-based clickbait detection | 🟡 Medium | ⬜ |
| Sentiment analysis | 🟢 Low | ⬜ |
| Topic clustering | 🟢 Low | ⬜ |
| Relevance scoring | 🟡 Medium | ⬜ |

---

### 🔟 User Features

| Vazifa | Priority | Status |
|--------|----------|--------|
| Saved articles (localStorage) | 🟡 Medium | ⬜ |
| Reading history | 🟢 Low | ⬜ |
| Push notifications | 🟢 Low | ⬜ |
| Newsletter subscription | 🟡 Medium | ⬜ |

---

## 🔮 V3+ (Istiqbol)

### 1️⃣1️⃣ Multi-Platform Expansion

| Vazifa | Priority | Status |
|--------|----------|--------|
| Kazakhstan (kk) localization | 🟢 Low | ⬜ |
| Tajik (tg) localization | 🟢 Low | ⬜ |
| Regional news sources | 🟢 Low | ⬜ |

---

### 1️⃣2️⃣ Monetization (Etarli auditoriya keyin)

| Vazifa | Priority | Status |
|--------|----------|--------|
| Sponsored content (etiketlangan) | ⚪ Future | ⬜ |
| Premium subscription | ⚪ Future | ⬜ |
| Job board | ⚪ Future | ⬜ |
| Startap showcase | ⚪ Future | ⬜ |

> [!CAUTION]
> TZ bo'yicha erta monetizatsiya, reklama va sifatdan voz kechish **qat'iyan tavsiya etilmaydi**.

---

### 1️⃣3️⃣ Advanced Analytics

| Vazifa | Priority | Status |
|--------|----------|--------|
| PostHog/Plausible integration | 🟢 Low | ⬜ |
| A/B testing framework | ⚪ Future | ⬜ |
| User engagement metrics | 🟢 Low | ⬜ |
| Content performance analysis | 🟢 Low | ⬜ |

---

### 1️⃣4️⃣ Mobile App (React Native)

| Vazifa | Priority | Status |
|--------|----------|--------|
| React Native app setup | ⚪ Future | ⬜ |
| Shared component library | ⚪ Future | ⬜ |
| Push notifications | ⚪ Future | ⬜ |
| Offline reading | ⚪ Future | ⬜ |

---

## 📈 Success Metrics

### MVP
- ✅ Kuniga 3-5 post barqaror chiqishi
- ✅ 0 semantik xato
- ✅ Pipeline 99% uptime

### V2
- ✅ 1000+ Telegram subscribers
- ✅ 50+ daily active readers
- ✅ <2s page load time

### V3+
- ✅ 10,000+ auditoriya
- ✅ O'z startap/mahsulot integratsiyasi

---

## 🛠️ Texnik Qarzdorlik (Tech Debt)

| Muammo | Fayl | Ustuvorlik |
|--------|------|------------|
| Hardcoded Telegram URL | `tg/page.tsx` | 🔴 High |
| Magic number `take: 20` | `tg/page.tsx` | 🟡 Medium |
| Locale hardcode `uz-UZ` | `hero-carousel.tsx` | 🟡 Medium |
| No API rate limiting | `api/` | 🔴 High |
| Missing error boundaries | Components | 🔴 High |
| Duplicate CategoryNav | Components | 🟢 Low |

---

## 📅 Sprint Calendar

```
2025-Q1
├── Yanvar (1-2 hafta): AI + News API Integration
├── Yanvar (3-4 hafta): Telegram Bot + Cron
├── Fevral (1-2 hafta): SEO + Code Quality + Testing
└── Fevral (3-4 hafta): MVP Launch 🚀

2025-Q2
├── Mart: Admin Dashboard
├── Aprel: Audio Digest + Filtering
└── May: User Features + V2 Launch 🚀

2025-Q3+
├── Iyun+: Multi-platform expansion
└── TBD: Monetization (auditoriya keyin)
```

---

## 📝 Qayd

- ✅ = Tugallangan
- 🔄 = Jarayonda
- ⬜ = Boshlanmagan
- 🔴 = Critical priority
- 🟡 = Medium priority
- 🟢 = Low priority
- ⚪ = Future/TBD

---

*Oxirgi yangilanish: 2025-12-31*
