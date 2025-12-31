# 🚀 Aishunos - AI-Powered IT News Platform

AI yordamida IT yangiliklarini avtomatik yig'uvchi, tahlil qiluvchi va o'zbek tiliga tarjima qiluvchi platforma.

## ✨ Xususiyatlar

- 🤖 **AI-Powered**: OpenAI/Gemini yordamida maqolalarni tahlil qilish va tarjima qilish
- 📱 **Telegram Mini App**: Telegram ichida to'g'ridan-to'g'ri ishlaydi
- 🎨 **Premium UI**: Glassmorphism va dark mode
- 🔄 **Auto Pipeline**: Yangiliklarni avtomatik yig'ish, filtrlash va post qilish
- 🌐 **Multi-Source**: NewsAPI, RSS, va boshqa manbalar
- 📊 **Database**: PostgreSQL + Prisma ORM

## 🛠 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes, Prisma
- **Database**: PostgreSQL
- **AI**: OpenAI GPT / Google Gemini
- **Telegram**: Bot API + Mini App SDK
- **Deployment**: Vercel/Railway

## 📦 Installation

1. **Clone repository:**
```bash
git clone <repo-url>
cd news-app
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Setup environment variables:**
```bash
cp env.example .env
```

`.env` fayliga quyidagilarni kiriting:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/news_db"
NEWS_API_KEY="your_newsapi_key"
OPENAI_API_KEY="your_openai_key"
TELEGRAM_BOT_TOKEN="your_bot_token"
TELEGRAM_CHAT_ID="@your_channel"
```

4. **Setup database:**
```bash
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma db seed
```

5. **Run development server:**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📱 Telegram Mini App

Telegram Mini App sozlash uchun: [TELEGRAM_MINI_APP.md](./docs/TELEGRAM_MINI_APP.md)

## 🏗 Project Structure

```
news-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── articles/[slug]/   # Article detail page
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── telegram-provider.tsx
│   │   └── telegram-back-button.tsx
│   └── lib/
│       ├── prisma.ts          # Prisma client
│       ├── telegram/          # Telegram utilities
│       └── news/              # News services
│           ├── providers/     # News providers (NewsAPI, RSS)
│           ├── services/      # Business logic
│           │   ├── ai.service.ts
│           │   ├── telegram.service.ts
│           │   ├── filtering.service.ts
│           │   └── news-pipeline.service.ts
│           └── repositories/  # Database operations
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed data
│   └── migrations/            # Database migrations
└── docs/                      # Documentation
```

## 🔄 News Pipeline

```
1. Fetch     → NewsAPI/RSS'dan yangiliklarni olish
2. Filter    → Clickbait/spam'ni filtrlash
3. AI        → Tahlil qilish va o'zbek tiliga tarjima
4. Save      → Database'ga saqlash
5. Telegram  → Kanalga avtomatik post qilish
```

## 🎯 API Endpoints

- `GET /api/news/sync` - Yangiliklarni fetch qilish
- `POST /api/news/process` - Pipeline'ni ishga tushirish

## 🧪 Testing

```bash
# Type checking
pnpm tsc --noEmit

# Linting
pnpm lint

# Database studio
pnpm prisma studio
```

## 📊 Database Schema

- **NewsSource**: Yangilik manbalari (NewsAPI, TechCrunch, etc.)
- **RawArticle**: Xom maqolalar (original)
- **Article**: AI tomonidan qayta ishlangan maqolalar

## 🚀 Deployment

### Vercel

```bash
vercel deploy
```

### Railway

```bash
railway up
```

Environment variables'ni production'da ham sozlang!

## 📝 TODO

- [ ] Real AI integration (OpenAI/Gemini)
- [ ] Real Telegram Bot API
- [ ] Admin Dashboard
- [ ] RSS Provider
- [ ] Cron job for auto-sync
- [ ] Analytics
- [ ] User authentication

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

## 📄 License

MIT License - see [LICENSE](./LICENSE)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Telegram](https://telegram.org)
- [NewsAPI](https://newsapi.org)

---

Made with ❤️ by Aishunos
