# Telegram Service

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Maqsad

Telegram Service quyidagi vazifalarni bajaradi:
- Telegram kanalga yangiliklar yuborish
- Mini App integratsiyasi
- Bot buyruqlarini boshqarish

---

## Fayl Joylashuvi

\\\
apps/web/src/lib/news/services/telegram.service.ts
apps/web/src/lib/news/telegram-templates.ts
\\\

---

## Asosiy Funksiyalar

### 1. sendArticleToChannel

Maqolani Telegram kanalga yuboradi.

\\\	ypescript
interface TelegramMessage {
  chatId: string;
  text: string;
  parseMode: 'HTML' | 'MarkdownV2';
  replyMarkup?: InlineKeyboardMarkup;
}

async function sendArticleToChannel(
  article: Article
): Promise<TelegramResponse>
\\\

### 2. formatArticleMessage

Maqolani Telegram formatiga o'zgartiradi.

\\\	ypescript
function formatArticleMessage(article: Article): string {
  return \
<b>\</b>

\

📂 \
🏷 \

<a href="\">📖 To'liq o'qish</a>
  \;
}
\\\

### 3. sendBulkMessages

Ko'p maqolalarni ketma-ket yuboradi.

\\\	ypescript
async function sendBulkMessages(
  articles: Article[],
  options: {
    delay: number;      // ms between messages
    maxPerBatch: number;
  }
): Promise<BulkResult>
\\\

---

## Message Templates

### Yangilik xabari

\\\html
<b>🤖 Sun'iy Intellekt yangiliklari</b>

<b>{title}</b>

{summary}

📂 #{category}
🏷 {tags}

<a href="{mini_app_url}">📱 Mini App'da o'qish</a>
<a href="{source_url}">🔗 Asl manba</a>
\\\

### Kunlik digest

\\\html
<b>📰 Bugungi texnologiya yangiliklari</b>

1️⃣ {article_1_title}
2️⃣ {article_2_title}
3️⃣ {article_3_title}
...

<a href="{mini_app_url}">Barchasini ko'rish →</a>
\\\

---

## Inline Keyboard

\\\	ypescript
const keyboard: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      { text: "📖 O'qish", url: miniAppUrl },
      { text: "🔗 Manba", url: sourceUrl }
    ],
    [
      { text: "❤️", callback_data: \like_\\ },
      { text: "💾", callback_data: \save_\\ },
      { text: "📤", callback_data: \share_\\ }
    ]
  ]
};
\\\

---

## Bot Commands

| Buyruq | Tavsif |
|--------|--------|
| \/start\ | Botni boshlash |
| \/help\ | Yordam |
| \/latest\ | Oxirgi yangiliklar |
| \/categories\ | Kategoriyalar |
| \/settings\ | Sozlamalar |
| \/subscribe\ | Obuna bo'lish |
| \/unsubscribe\ | Obunani bekor qilish |

---

## Rate Limits

Telegram API cheklovlari:

| Cheklov | Qiymat |
|---------|--------|
| Xabarlar/sekund | 30 |
| Xabarlar/daqiqa (kanalga) | 20 |
| Bulk xabarlar oralig'i | 3 sekund |

---

## Error Handling

\\\	ypescript
try {
  await sendArticleToChannel(article);
} catch (error) {
  if (error.code === 429) {
    // Too Many Requests
    const retryAfter = error.parameters?.retry_after || 60;
    await sleep(retryAfter * 1000);
    return retry();
  }
  if (error.code === 400) {
    // Bad Request - message too long
    return sendArticleToChannel({
      ...article,
      summary: truncate(article.summary, 500)
    });
  }
  throw error;
}
\\\

---

## Environment Variables

\\\env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_CHANNEL_ID=@aishunos
TELEGRAM_ADMIN_CHAT_ID=123456789
TELEGRAM_MINI_APP_URL=https://t.me/aishunos_bot/app
\\\

---

## Webhook Setup

\\\ash
# Set webhook
curl -X POST "https://api.telegram.org/bot{TOKEN}/setWebhook" \
  -d "url=https://aishunos.uz/api/telegram/webhook"

# Get webhook info
curl "https://api.telegram.org/bot{TOKEN}/getWebhookInfo"
\\\

---

## Mini App Integration

\\\	ypescript
// Mini App URL generator
function getMiniAppUrl(articleSlug: string): string {
  const baseUrl = process.env.TELEGRAM_MINI_APP_URL;
  return \\?startapp=article_\\;
}
\\\

---

## Bog'liq Hujjatlar

- [Telegram Mini App](../TELEGRAM_MINI_APP.md) - Mini App hujjati
- [News Pipeline](./NEWS_PIPELINE.md) - Xabar yuborish integratsiyasi
- [CRON Jobs](../api/CRON_JOBS.md) - Avtomatik yuborish
