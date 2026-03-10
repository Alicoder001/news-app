# Phase 2: Essential Features

> **Status:** ⏳ Kutilmoqda  
> **Muddat:** 2026 Q2

---

## Maqsad

MVP dan keyin zarur bo'lgan qo'shimcha funksiyalar.

---

## Vazifalar

### 1. Mobile Application ⏳

- [ ] React Native setup (Expo)
- [ ] Navigation structure
- [ ] Article screens
- [ ] Category filtering
- [ ] Offline support
- [ ] Push notifications
- [ ] App Store submission
- [ ] Play Store submission

**Tech Stack:**
- Expo SDK 50+
- React Navigation
- Zustand (state)
- React Query
- Expo Notifications

### 2. Advanced Search ⏳

- [ ] Full-text search (PostgreSQL)
- [ ] Search suggestions
- [ ] Search history
- [ ] Filters (date, category, source)
- [ ] Search analytics

**Implementation:**
\\\sql
-- PostgreSQL full-text search
CREATE INDEX articles_search_idx ON "Article" 
USING GIN (to_tsvector('russian', title || ' ' || content));
\\\

### 3. User Accounts ⏳

- [ ] Authentication (NextAuth.js)
- [ ] Social login (Google, GitHub, Telegram)
- [ ] User profile
- [ ] Reading history
- [ ] Bookmarks sync
- [ ] Preferences

**Models:**
\\\prisma
model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  telegramId    String?   @unique
  name          String?
  image         String?
  bookmarks     Bookmark[]
  readHistory   ReadHistory[]
  preferences   Json?
  createdAt     DateTime  @default(now())
}
\\\

### 4. Notifications ⏳

- [ ] Push notifications (Web)
- [ ] Push notifications (Mobile)
- [ ] Email digest
- [ ] Telegram notifications
- [ ] Notification preferences

### 5. Comments System ⏳

- [ ] Article comments
- [ ] Replies
- [ ] Likes
- [ ] Moderation
- [ ] Spam detection

---

## Dependencies

| Feature | Depends On |
|---------|-----------|
| Mobile App | Phase 1 API |
| User Accounts | - |
| Notifications | User Accounts |
| Comments | User Accounts |

---

## Estimated Effort

| Task | Dev Days |
|------|----------|
| Mobile App | 20 |
| Advanced Search | 5 |
| User Accounts | 10 |
| Notifications | 8 |
| Comments | 7 |
| **Total** | **50 days** |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Mobile downloads | 500+ |
| Registered users | 200+ |
| DAU | 100+ |
| Search usage | 30% of users |

---

## Keyingi Qadam

[Phase 3: Advanced](./PHASE_3_ADVANCED.md)
