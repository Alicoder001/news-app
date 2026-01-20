# Telegram Mini App

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Umumiy Korinish

Telegram Mini App - Telegram ichida ishlaydigan web ilova.

---

## Tech Stack

| Technology | Maqsad |
|------------|--------|
| Next.js | Framework |
| Telegram WebApp API | Telegram integration |
| @telegram-apps/sdk | SDK wrapper |

---

## Features

### Implemented ✅

- [x] Theme integration (Telegram colors)
- [x] Back button handling
- [x] Main button
- [x] Haptic feedback
- [x] Article list
- [x] Category navigation

### In Progress 🔄

- [ ] Article detail page
- [ ] Saved articles
- [ ] Settings page
- [ ] Share functionality
- [ ] Notifications

---

## Pages

| Route | Tavsif |
|-------|--------|
| `/tg` | Home - Article list |
| `/tg/article/[slug]` | Article detail |
| `/tg/category/[slug]` | Category articles |
| `/tg/saved` | Saved articles |
| `/tg/settings` | User settings |

---

## Telegram WebApp API

### Initialization

```typescript
import { init, backButton, mainButton } from '@telegram-apps/sdk';

// Initialize SDK
init();

// Back button
backButton.show();
backButton.on('click', () => router.back());

// Main button
mainButton.setParams({
  text: 'Share',
  color: '#8B5CF6',
});
mainButton.show();
mainButton.on('click', handleShare);
```

### Theme Integration

```typescript
import { useThemeParams } from '@telegram-apps/sdk-react';

function Component() {
  const theme = useThemeParams();
  
  return (
    <div style={{ 
      backgroundColor: theme.bgColor,
      color: theme.textColor 
    }}>
      Content
    </div>
  );
}
```

### Haptic Feedback

```typescript
import { hapticFeedback } from '@telegram-apps/sdk';

// On button click
hapticFeedback.impactOccurred('medium');

// On success
hapticFeedback.notificationOccurred('success');
```

---

## Bot Setup

### Commands

```
/start - Ilovani ochish
/help - Yordam
/latest - Oxirgi yangiliklar
```

### Menu Button

Bot Settings > Menu Button > Configure:
- URL: `https://t.me/aishunos_bot/app`
- Text: "Ochish"

---

## Testing

### In Telegram

1. Open @BotFather
2. /mybots > Select bot > Bot Settings > Menu Button
3. Set Mini App URL

### Development

```bash
# Use ngrok for local testing
ngrok http 3000

# Set webhook to ngrok URL
```

---

## Deployment

Same as web app (Vercel), different routes:
- Web: `/`
- Telegram: `/tg`
