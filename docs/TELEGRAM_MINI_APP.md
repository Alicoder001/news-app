# Telegram Mini App Setup Guide

## 📱 Telegram Mini App Nima?

Telegram Mini App - bu Telegram ichida ishlaydigan web ilovalar. Foydalanuvchilar Telegram'dan chiqmasdan to'g'ridan-to'g'ri yangiliklarni o'qishlari mumkin.

## 🚀 Setup Qilish

### 1. Telegram Bot Yaratish

1. Telegram'da [@BotFather](https://t.me/botfather) ga o'ting
2. `/newbot` buyrug'ini yuboring
3. Bot nomi va username kiriting (masalan: `IT News Bot` va `@itnews_uz_bot`)
4. Bot tokenini saqlang (`.env` fayliga qo'shish kerak)

### 2. Mini App Sozlash

BotFather'da:

```
/newapp
```

Keyin:
- Botingizni tanlang
- App nomi: `IT News`
- Description: `AI-powered IT news platform`
- Photo: App logotipi (640x360 yoki 1280x720)
- GIF/Video: Demo video (ixtiyoriy)
- Short name: `itnews` (URL uchun: `https://t.me/your_bot/itnews`)

### 3. Web App URL Sozlash

Development uchun:
```
https://your-ngrok-url.ngrok.io
```

Production uchun:
```
https://your-domain.com
```

**Muhim:** Telegram faqat HTTPS URLlarni qabul qiladi!

## 🔧 Local Development

### ngrok bilan test qilish:

1. ngrok o'rnating: https://ngrok.com/download
2. Ishga tushiring:
```bash
ngrok http 3000
```
3. HTTPS URLni BotFather'ga kiriting
4. Telegram'da botni oching va Mini App'ni sinab ko'ring

## 📝 Environment Variables

`.env` fayliga qo'shing:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN="your_bot_token_here"
TELEGRAM_CHAT_ID="@your_channel_username"

# Mini App URL (production)
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## 🎨 Telegram Mini App Xususiyatlari

### ✅ Hozirda Qo'shilgan:

- ✅ Telegram WebApp SDK integratsiyasi
- ✅ Telegram theme avtomatik qo'llaniladi
- ✅ Back Button (native Telegram navigation)
- ✅ Haptic Feedback (vibration)
- ✅ User ma'lumotlarini olish
- ✅ Platform detection (iOS/Android/Desktop)

### 🔜 Qo'shish Mumkin:

- Main Button (asosiy action button)
- Share button (maqolalarni ulashish)
- QR code scanner
- Location access
- Payments (Telegram Stars)

## 🧪 Test Qilish

1. Development server ishga tushiring:
```bash
pnpm dev
```

2. ngrok ishga tushiring:
```bash
ngrok http 3000
```

3. BotFather'da Web App URL'ni yangilang

4. Telegram'da botni oching:
```
/start
```

5. Mini App tugmasini bosing

## 📱 Telegram'da Ko'rinishi

Foydalanuvchilar:
1. Botni ochadi
2. "Open App" tugmasini bosadi
3. Telegram ichida to'liq news feed ko'rinadi
4. Maqolalarni o'qiydi
5. Native back button bilan navigatsiya qiladi

## 🎯 Keyingi Qadamlar

1. **Production Deployment:**
   - Vercel/Railway'ga deploy qiling
   - HTTPS domain oling
   - BotFather'da production URL'ni sozlang

2. **Telegram Channel Integration:**
   - Kanal yarating
   - Bot'ni admin qiling
   - Avtomatik post qilishni yoqing

3. **Analytics:**
   - User tracking
   - Popular articles
   - Engagement metrics

## 🔗 Foydali Linklar

- [Telegram Mini Apps Docs](https://core.telegram.org/bots/webapps)
- [BotFather](https://t.me/botfather)
- [ngrok](https://ngrok.com)
- [Vercel Deployment](https://vercel.com)

## 💡 Tips

- Mini App'da har doim HTTPS kerak
- Telegram theme'ga mos dizayn qiling
- Mobile-first approach
- Tez yuklash muhim (Telegram users impatient 😄)
- Native Telegram UI elementlaridan foydalaning
