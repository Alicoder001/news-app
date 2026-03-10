# @ai_shunos — Avtonom AI Yangiliklar Pipeline
## To'liq Loyiha Hujjati (End-to-End)

> **Maqsad:** AI, IT va zamonaviy texnologiyalar bo'yicha yangiliklarni avtomatik yig'ib, tekshirib, Uzbekcha post yozib, Telegram kanalga va veb saytga yuboruvchi to'liq avtonom tizim.

---

## Tizim Arxitekturasi (Umumiy Ko'rinish)

```
┌─────────────────────────────────────────────────────────┐
│                    MANBALAR                             │
│  RSS Feeds + Twitter/X (Twikit)                         │
└──────────────────┬──────────────────────────────────────┘
                   │ har 30 daqiqada (cron)
                   ▼
┌─────────────────────────────────────────────────────────┐
│              QWEN CODE CLI (Headless)                   │
│                                                         │
│  Agent 1: Collector   → yangilik yig'adi                │
│  Agent 2: Filter      → AI/IT ga oidmi?                 │
│  Agent 3: Fact-Check  → tekshiradi                      │
│  Agent 4: Writer      → Uzbekcha post yozadi            │
│  Agent 5: Reviewer    → sifat tekshiradi                │
└──────────────────┬──────────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
┌─────────────────┐  ┌──────────────────────┐
│  TELEGRAM       │  │  WEB SAYT            │
│  - Kanal        │  │  - To'liq maqola     │
│  - Bot (shaxsiy)│  │  - Next.js + Vercel  │
│  - Mini App     │  │  - PostgreSQL        │
└─────────────────┘  └──────────────────────┘
```

---

## 1. TEXNIK TALABLAR

### Local muhit (WSL Ubuntu)
```
- WSL 2 + Ubuntu 22.04
- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- Git
```

### O'rnatilishi kerak bo'lgan toollar
```bash
# Node.js (20+)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Qwen Code CLI
npm install -g @qwen-code/qwen-code

# Python kutubxonalar
pip install feedparser twikit psycopg2-binary python-dotenv aiohttp

# PostgreSQL
sudo apt install -y postgresql postgresql-contrib
```

---

## 2. QWEN CODE CLI — SOZLASH

### O'rnatish
```bash
npm install -g @qwen-code/qwen-code
qwen --version
```

### Autentifikatsiya (2 usul)

**Usul A — Bepul (OAuth, kuniga 1000 so'rov):**
```bash
qwen  # birinchi ishga tushirganda browser ochiladi
# qwen.ai accountingiz bilan login qiling
# credentials ~/.qwen/ papkasiga saqlanadi
```

**Usul B — API Key (ko'proq so'rov uchun):**
```bash
# ~/.qwen/settings.json
{
  "modelProviders": {
    "openai": [
      {
        "id": "qwen3-coder-plus",
        "name": "qwen3-coder-plus",
        "baseUrl": "https://dashscope.aliyuncs.com/compatible-mode/v1",
        "envKey": "DASHSCOPE_API_KEY"
      }
    ]
  },
  "model": { "name": "qwen3-coder-plus" },
  "security": { "auth": { "selectedType": "api-key" } }
}
```

### Headless (Non-interactive) rejim — cron uchun asosiy
```bash
# -p flag bilan headless rejimda ishlaydi
qwen -p "Vazifangiz bu yerda" --yolo

# JSON chiqarish uchun
qwen -p "Vazifangiz" --output-format json --yolo

# Fayl ichidan o'qib ishlash
qwen -p "$(cat prompt.txt)" --yolo
```

> **Muhim:** `--yolo` — barcha amallarni tasdiqlarsiz avtomatik bajaradi. Cron uchun shart.

---

## 3. RSS MANBALAR RO'YXATI

### Birinchi daraja (Rasmiy manbalar)
| Manba | RSS URL |
|-------|---------|
| OpenAI Blog | `https://openai.com/blog/rss/` |
| Anthropic Blog | `https://www.anthropic.com/news/rss` |
| Google DeepMind | `https://deepmind.google/blog/rss.xml` |
| Google AI Blog | `https://blog.google/technology/ai/rss/` |
| Meta AI | `https://ai.meta.com/blog/feed/` |
| Microsoft AI | `https://news.microsoft.com/source/topics/ai/feed/` |
| NVIDIA Blog | `https://blogs.nvidia.com/feed/` |
| Stability AI | `https://stability.ai/news/rss.xml` |
| Mistral AI | `https://mistral.ai/news/rss` |

### Ikkinchi daraja (Ilmiy manbalar)
| Manba | RSS URL |
|-------|---------|
| arXiv CS.AI | `https://rss.arxiv.org/rss/cs.AI` |
| arXiv CS.LG | `https://rss.arxiv.org/rss/cs.LG` |
| arXiv CS.CL | `https://rss.arxiv.org/rss/cs.CL` |
| Papers With Code | `https://paperswithcode.com/latest/rss` |

### Uchinchi daraja (Tech jurnalistika)
| Manba | RSS URL |
|-------|---------|
| The Verge (AI) | `https://www.theverge.com/rss/ai-artificial-intelligence/index.xml` |
| TechCrunch (AI) | `https://techcrunch.com/category/artificial-intelligence/feed/` |
| Wired (AI) | `https://www.wired.com/feed/category/artificial-intelligence/latest/rss` |
| Ars Technica (AI) | `https://feeds.arstechnica.com/arstechnica/technology-lab` |
| MIT Tech Review | `https://www.technologyreview.com/feed/` |
| Bloomberg Tech | `https://feeds.bloomberg.com/technology/news.rss` |
| The Verge | `https://www.theverge.com/rss/index.xml` |
| TechCrunch | `https://techcrunch.com/feed/` |
| Wired | `https://www.wired.com/feed/rss` |
| 404 Media | `https://www.404media.co/rss` |
| Chip Huyen Blog | `https://huyenchip.com/feed` |
| O'Reilly AI | `https://www.oreilly.com/radar/topics/ai-ml/feed/index.xml` |

---

## 4. TWITTER/X — TWIKIT SOZLASH

### O'rnatish
```bash
pip install twikit
```

### Login va cookie saqlash
```python
# setup_twitter.py — bir marta ishga tushiriladi
import asyncio
from twikit import Client

async def setup():
    client = Client('en-US')
    await client.login(
        auth_info_1='TWITTER_USERNAME',
        auth_info_2='TWITTER_EMAIL',
        password='TWITTER_PASSWORD',
        cookies_file='twitter_cookies.json'
    )
    print("Login muvaffaqiyatli. Cookie saqlandi.")

asyncio.run(setup())
```

### Kuzatiladigan AI/IT akkauntlar
```python
TWITTER_ACCOUNTS = [
    'sama',          # Sam Altman (OpenAI)
    'elonmusk',      # Elon Musk
    'karpathy',      # Andrej Karpathy
    'ylecun',        # Yann LeCun (Meta AI)
    'demishassabis', # Demis Hassabis (DeepMind)
    'GaryMarcus',    # Gary Marcus (AI skeptic)
    'fchollet',      # François Chollet
    'reach_vb',      # Vipra Bhatt
    'ilyasut',       # Ilya Sutskever
    'DrJimFan',      # Jim Fan (NVIDIA)
    'OpenAI',        # OpenAI rasmiy
    'AnthropicAI',   # Anthropic rasmiy
    'GoogleDeepMind',# DeepMind rasmiy
]

TWITTER_KEYWORDS = [
    '#AI', '#MachineLearning', '#LLM', '#GPT',
    '#ArtificialIntelligence', '#DeepLearning',
    '#OpenAI', '#Claude', '#Gemini', '#ChatGPT'
]
```

---

## 5. DATABASE — POSTGRESQL SCHEMA

```sql
-- Bazani yaratish
CREATE DATABASE ai_shunos;

-- Xom yangiliklar jadvali
CREATE TABLE raw_articles (
    id SERIAL PRIMARY KEY,
    source VARCHAR(100) NOT NULL,
    title TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    summary TEXT,
    content TEXT,
    published_at TIMESTAMP,
    fetched_at TIMESTAMP DEFAULT NOW(),
    is_processed BOOLEAN DEFAULT FALSE
);

-- Filtrlangan va tekshirilgan yangiliklar
CREATE TABLE processed_articles (
    id SERIAL PRIMARY KEY,
    raw_id INTEGER REFERENCES raw_articles(id),
    relevance_score FLOAT,      -- 0.0-1.0 (AI/IT ga qanchalik oid)
    fact_check_status VARCHAR(20), -- confirmed/unconfirmed/partial/false
    fact_check_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tayyor postlar
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    processed_id INTEGER REFERENCES processed_articles(id),
    short_post TEXT NOT NULL,   -- Telegram uchun (3-6 jumla)
    full_article TEXT,          -- Sayt uchun (to'liq)
    hashtags TEXT[],
    sources JSONB,              -- [{name, url}, ...]
    status VARCHAR(20) DEFAULT 'pending', -- pending/published/failed
    telegram_message_id BIGINT,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Dublikatlarni oldini olish uchun index
CREATE UNIQUE INDEX idx_raw_url ON raw_articles(url);
CREATE INDEX idx_raw_processed ON raw_articles(is_processed);
CREATE INDEX idx_posts_status ON posts(status);
```

---

## 6. MULTI-AGENT PIPELINE — QWEN CODE

### Loyiha strukturasi
```
ai_shunos/
├── .env
├── .qwen/
│   └── settings.json
├── agents/
│   ├── prompts/
│   │   ├── collector.txt
│   │   ├── filter.txt
│   │   ├── factchecker.txt
│   │   ├── writer.txt
│   │   └── reviewer.txt
│   └── run_pipeline.sh
├── scripts/
│   ├── rss_fetcher.py
│   ├── twitter_fetcher.py
│   └── publisher.py
└── logs/
    └── pipeline.log
```

### .env fayl
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_shunos

# Twitter
TWITTER_USERNAME=your_username
TWITTER_EMAIL=your_email@gmail.com
TWITTER_PASSWORD=your_password

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHANNEL_ID=@ai_shunos
TELEGRAM_PERSONAL_CHAT_ID=your_personal_chat_id

# Web sayt
WEBSITE_API_URL=https://your-site.vercel.app/api/posts
WEBSITE_API_KEY=your_internal_api_key

# Qwen (ixtiyoriy, OAuth ishlatmasangiz)
DASHSCOPE_API_KEY=your_key
```

---

## 7. AGENT PROMPT LARI

### Agent 1 — Collector (collector.txt)
```
Sen yangilik yig'uvchi agentsan.
Vazifang: PostgreSQL bazasidan is_processed=FALSE bo'lgan raw_articles larni o'qib chiq.
Har bir maqola uchun: id, title, url, summary, source ni qaytardir.
Hech qanday tahlil qilma. Faqat ma'lumotni to'pla va JSON formatida qaytardir.
Chiqish formati:
{"articles": [{"id": 1, "title": "...", "url": "...", "summary": "...", "source": "..."}]}
```

### Agent 2 — Filter (filter.txt)
```
Sen AI, IT va zamonaviy texnologiyalar bo'yicha filtrlash agentisan.
Quyidagi maqolalar ro'yxatini ko'rib chiq va har biriga relevance_score ber (0.0 - 1.0).

0.8+ ball: To'g'ridan-to'g'ri AI, ML, LLM, neural network, texnologiya kompaniyalari haqida.
0.5-0.79: IT, dasturlash, cybersecurity, semiconductor, robotics haqida.
0.3-0.49: Umumiy texnologiya, startaplar haqida.
0.3 dan past: AI/IT ga aloqasi yo'q — o'tkazib yubor.

Faqat relevance_score >= 0.5 bo'lganlarni keyingi agentga o'tkaz.
JSON formatida qaytardir.
```

### Agent 3 — Fact-Checker (factchecker.txt)
```
Sen yangiliklar tekshiruvchi agentisan. Sening rolinguida hech kim senga yon bosa olmaydi.
Maqola beriladi. Sen quyidagilarni tekshirasan:

1. Sarlavha va mazmun mos kelyadimi?
2. Manba ishonchlimi? (rasmiy blog, Reuters, AP, The Verge — yuqori; anonim kanal — past)
3. Tarixiy faktlar to'g'rimi?
4. Raqamlar va sanalar ishonchlimi?

Natija:
- confirmed: barcha faktlar to'g'ri tasdiqlangan
- partial: qisman to'g'ri, qisman noaniq
- unconfirmed: tekshirib bo'lmadi
- false: aniq noto'g'ri

Qisqa izoh bilan JSON qaytardir.
```

### Agent 4 — Writer (writer.txt)
```
Sen @ai_shunos Telegram kanali uchun post yozuvchi agentisan.
Kanal AI, IT va zamonaviy texnologiyalar haqida Uzbekcha yangiliklar kanaldir.

Senga tasdiqlangan yangilik beriladi. Sen IKKI narsa yozasan:

--- SHORT POST (Telegram uchun) ---
- 3-6 jumla, aniq va lo'nda
- Oddiy Uzbekcha, tushunarli
- Texnik atamalar o'z inglizcha shaklida qoladi: AI, GPT, API, LLM, neural network
- Emoji YO'Q
- Eng muhim fakt birinchi keladi
- Oxirida: Manba: [Manba nomi](URL)
- Hashtag: #ai #tech #texnologiya + voqeaga oid taglar (hammasi kichik harf)
- Eng oxirida: @ai_shunos

--- FULL ARTICLE (Sayt uchun) ---
- To'liq maqola, 300-600 so'z
- Sarlavha, kirish, asosiy qism, xulosa
- Barcha manbalar ko'rsatiladi
- SEO uchun qulay tuzilma

JSON formatida qaytardir: {"short_post": "...", "full_article": "...", "hashtags": [...], "sources": [...]}
```

### Agent 5 — Reviewer (reviewer.txt)
```
Sen qat'iy sifat nazoratchi agentisan. Writer yozgan postni tekshirasan.
Sening vazifang kamchilik topish — yon bosma, maqtov yo'q.

Tekshiruv mezonlari:
1. Har bir fakt manbada bormi?
2. Post noto'g'ri taassurot uyg'otadimi?
3. Uzbekcha to'g'ri va ravonmi?
4. Format qoidalari bajarilganmi? (emoji yo'q, manba bor, hashtag bor, @ai_shunos bor)
5. Qisqa post 3-6 jumladan oshib ketganmi?
6. Texnik atamalar to'g'ri ishlatilganmi?

Agar kamchilik topsang: "REJECT" + izoh qaytardir → Writer qayta yozadi
Agar hammasi to'g'ri: "APPROVE" qaytardir → Publisher ishlaydi

JSON: {"decision": "APPROVE"/"REJECT", "reason": "..."}
```

---

## 8. PIPELINE SKRIPTI

### run_pipeline.sh
```bash
#!/bin/bash
# @ai_shunos pipeline — cron tomonidan ishga tushiriladi

LOG="/home/user/ai_shunos/logs/pipeline.log"
DIR="/home/user/ai_shunos"

echo "=== Pipeline boshlandi: $(date) ===" >> $LOG

# 1. RSS yangiliklar yig'ish
echo "[1/6] RSS fetching..." >> $LOG
python3 $DIR/scripts/rss_fetcher.py >> $LOG 2>&1

# 2. Twitter yangiliklar yig'ish
echo "[2/6] Twitter fetching..." >> $LOG
python3 $DIR/scripts/twitter_fetcher.py >> $LOG 2>&1

# 3. Agent 1: Collect
echo "[3/6] Agent 1: Collecting..." >> $LOG
ARTICLES=$(qwen -p "$(cat $DIR/agents/prompts/collector.txt)" --yolo --output-format json 2>/dev/null | jq -r '.response')

# 4. Agent 2: Filter
echo "[4/6] Agent 2: Filtering..." >> $LOG
FILTERED=$(echo "$ARTICLES" | qwen -p "$(cat $DIR/agents/prompts/filter.txt)
Maqolalar: $ARTICLES" --yolo --output-format json 2>/dev/null | jq -r '.response')

# 5. Agent 3: Fact-check
echo "[5/6] Agent 3: Fact-checking..." >> $LOG
CHECKED=$(echo "$FILTERED" | qwen -p "$(cat $DIR/agents/prompts/factchecker.txt)
Maqolalar: $FILTERED" --yolo --output-format json 2>/dev/null | jq -r '.response')

# 6. Agent 4: Write
echo "[6/6] Agent 4: Writing posts..." >> $LOG
POSTS=$(echo "$CHECKED" | qwen -p "$(cat $DIR/agents/prompts/writer.txt)
Maqolalar: $CHECKED" --yolo --output-format json 2>/dev/null | jq -r '.response')

# 7. Agent 5: Review
FINAL=$(echo "$POSTS" | qwen -p "$(cat $DIR/agents/prompts/reviewer.txt)
Postlar: $POSTS" --yolo --output-format json 2>/dev/null | jq -r '.response')

# 8. Publish
python3 $DIR/scripts/publisher.py "$FINAL" >> $LOG 2>&1

echo "=== Pipeline tugadi: $(date) ===" >> $LOG
```

---

## 9. PUBLISHER SKRIPTI

### scripts/publisher.py
```python
import asyncio
import json
import os
import aiohttp
import psycopg2
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHANNEL_ID = os.getenv("TELEGRAM_CHANNEL_ID")
WEBSITE_API = os.getenv("WEBSITE_API_URL")
WEBSITE_KEY = os.getenv("WEBSITE_API_KEY")
DB_URL = os.getenv("DATABASE_URL")

async def send_telegram(post_text: str):
    """Telegram kanalga yuborish"""
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": CHANNEL_ID,
        "text": post_text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload) as resp:
            return await resp.json()

async def send_to_website(article: dict):
    """Saytga to'liq maqola yuborish"""
    headers = {
        "Authorization": f"Bearer {WEBSITE_KEY}",
        "Content-Type": "application/json"
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(WEBSITE_API, json=article, headers=headers) as resp:
            return await resp.json()

def save_to_db(post_data: dict, telegram_id: int):
    """Bazaga saqlash"""
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    cur.execute("""
        UPDATE posts SET status='published', telegram_message_id=%s, published_at=NOW()
        WHERE id=%s
    """, (telegram_id, post_data['id']))
    conn.commit()
    cur.close()
    conn.close()

async def main(final_data: str):
    posts = json.loads(final_data)
    
    for post in posts.get('approved', []):
        # Telegram ga yuborish
        tg_result = await send_telegram(post['short_post'])
        tg_id = tg_result.get('result', {}).get('message_id')
        
        # Saytga yuborish
        await send_to_website({
            "title": post['title'],
            "content": post['full_article'],
            "short": post['short_post'],
            "sources": post['sources']
        })
        
        # Bazaga saqlash
        save_to_db(post, tg_id)
        
        print(f"✓ Published: {post['title'][:50]}...")

if __name__ == "__main__":
    import sys
    asyncio.run(main(sys.argv[1] if len(sys.argv) > 1 else '{}'))
```

---

## 10. CRON SOZLASH

```bash
# crontab -e
# Har 30 daqiqada ishga tushirish
*/30 * * * * /bin/bash /home/user/ai_shunos/agents/run_pipeline.sh

# Log fayl hajmini nazorat qilish (har kuni)
0 0 * * * truncate -s 0 /home/user/ai_shunos/logs/pipeline.log
```

---

## 11. WEB SAYT — NEXT.JS INTEGRATSIYA

### API Endpoint (pages/api/posts.ts)
```typescript
// pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // API key tekshirish
    const apiKey = req.headers.authorization?.replace('Bearer ', '')
    if (apiKey !== process.env.WEBSITE_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    if (req.method === 'POST') {
        const { title, content, short, sources } = req.body
        
        const result = await pool.query(`
            INSERT INTO posts (title, full_article, short_post, sources, status, published_at)
            VALUES ($1, $2, $3, $4, 'published', NOW())
            RETURNING id
        `, [title, content, short, JSON.stringify(sources)])
        
        return res.status(200).json({ id: result.rows[0].id })
    }

    if (req.method === 'GET') {
        const result = await pool.query(`
            SELECT * FROM posts WHERE status='published'
            ORDER BY published_at DESC LIMIT 20
        `)
        return res.status(200).json(result.rows)
    }
}
```

### Vercel muhit o'zgaruvchilari
```
DATABASE_URL=postgresql://...
WEBSITE_API_KEY=your_secret_internal_key
```

> **Muhim:** PostgreSQL ni Vercel bilan ishlatish uchun Vercel Postgres yoki Supabase ishlatish tavsiya etiladi — chunki Vercel serverless environment da lokal PostgreSQL ga ulana olmaydi.

---

## 12. TELEGRAM BOT SOZLASH

```bash
# 1. @BotFather ga boring
# 2. /newbot buyrug'ini yuboring
# 3. Bot nomini bering: ai_shunos_bot
# 4. Bot username ni bering: ai_shunos_publisher_bot
# 5. Token oling va .env ga qo'ying

# Botni kanalga admin sifatida qo'shing:
# Kanal settings → Administrators → Add Admin → @ai_shunos_publisher_bot
# Ruxsatlar: "Post Messages" yoqing
```

---

## 13. POST FORMATI (YAKUNIY)

```
[Asosiy matn — 3-6 jumla, aniq va lo'nda Uzbekcha]

Manba: [Manba nomi](https://full-url.com/article)
yoki
Manbalar: [The Verge](https://url1.com) | [Reuters](https://url2.com)

#ai #tech #texnologiya #openai #gpt5

@ai_shunos
```

**Namuna:**
```
OpenAI o'zining yangi GPT-5 modelini rasman taqdim etdi. 
Model avvalgi versiyaga nisbatan murakkab mantiqiy masalalarni 
ancha yaxshiroq hal qiladi va ko'p tilli qo'llab-quvvatlash 
sezilarli darajada kuchaytirilgan. Hozircha model faqat 
ChatGPT Plus va Pro foydalanuvchilari uchun ochiq.

Manbalar: [OpenAI](https://openai.com/blog/gpt-5) | [The Verge](https://theverge.com/gpt-5)

#ai #tech #texnologiya #openai #gpt5 #llm

@ai_shunos
```

---

## 14. KEYINCHALIK API ULASH (UPGRADE YO'LI)

Tizim ishlayotganda, zarur bo'lsa quyidagicha upgrade qilish mumkin:

```
Hozir:    Qwen Code (bepul, barcha agentlar)
          ↓
Upgrade:  Agent 3 (Fact-check) → DeepSeek R1 API (~$2/oy)
          Agent 4 (Writer)     → Claude Haiku API (~$2/oy)
          Jami qo'shimcha:     ~$4-5/oy, sifat oshadi
```

---

## 15. MUHIM ESLATMALAR

1. **Headless rejim:** Cron bilan ishlaganda `--yolo` flagi shart, aks holda Qwen Code tasdiqlash so'raydi va to'xtab qoladi.

2. **Rate limit:** Bepul OAuth — kuniga 1000 so'rov. Har 30 daqiqada pipeline ishlaganda (~48 marta/kun), har run 5-10 so'rov qiladi. Jami ~240-480 so'rov — yetarli.

3. **Twitter cookie:** Twikit cookie 7-14 kun saqlانади. `setup_twitter.py` ni oyda bir-ikki marta qayta ishlatish kerak.

4. **Dublikat oldini olish:** `raw_articles.url` UNIQUE index qo'yilgan — bir xil yangilik ikki marta kirmaydi.

5. **VPS ga ko'chirish:** Hamma narsa bir xil ishlaydi. Faqat cron va `.env` faylni ko'chirish kifoya. WSL da qilgan hamma narsa VPS Ubuntu da ham ishlaydi.

6. **Vercel + PostgreSQL:** Vercel da serverless function lokal DB ga ulay olmaydi. Supabase (bepul tier bor) yoki Vercel Postgres ishlatish tavsiya etiladi.

---

*Hujjat versiyasi: 1.0 | @ai_shunos loyihasi*
