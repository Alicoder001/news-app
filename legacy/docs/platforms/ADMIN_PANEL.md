# Admin Panel

> **Versiya:** 1.0  
> **Yangilangan:** 2026-02-20  
> **Status:** 🔄 Development

---

## Umumiy Korinish

Admin panel maqolalar, manbalar va pipeline ni boshqarish uchun.

---

## Features

### Implemented ✅

- [x] Login page
- [x] Dashboard layout
- [x] Sidebar navigation
- [x] Basic stats cards

### In Progress 🔄

- [ ] Articles management (CRUD)
- [ ] Sources management
- [ ] Pipeline monitoring
- [ ] Usage statistics
- [ ] User management

---

## Pages

| Route | Tavsif | Status |
|-------|--------|--------|
| `/admin/login` | Admin login | ✅ |
| `/admin` | Dashboard | 🔄 |
| `/admin/articles` | Articles list | 🔄 |
| `/admin/sources` | News sources | 🔄 |
| `/admin/pipeline` | Pipeline runs | 🔄 |
| `/admin/usage` | API usage | 🔄 |
| `/admin/settings` | Settings | ⏳ |

---

## Authentication

```typescript
// Session boundary:
// - Browser -> Next admin route: httpOnly admin token cookies
// - Next admin route -> Nest API: Authorization Bearer <accessToken>
// - Refresh handled through backend /v1/admin/auth/refresh

POST /api/admin/login
{
  "secret": "ADMIN_SECRET"
}

// Response: set access+refresh httpOnly cookies (no secret in cookies)
```

---

## Dashboard Widgets

### Stats Cards

- Total Articles
- Articles Today
- Active Sources
- Pipeline Status

### Recent Activity

- Latest articles
- Recent pipeline runs
- Error logs

### Charts

- Articles per day
- Category distribution
- Source performance

---

## Article Management

### List View

| Column | Sortable | Filterable |
|--------|----------|------------|
| Title | ✅ | ✅ Search |
| Category | ✅ | ✅ Select |
| Status | ✅ | ✅ Select |
| Published | ✅ | ✅ Date range |
| Views | ✅ | ❌ |

### Actions

- View article
- Edit article
- Delete article
- Feature/Unfeature

---

## Source Management

### Source Form

```typescript
interface SourceForm {
  name: string;
  url: string;
  feedUrl?: string;
  provider: 'rss' | 'gnews' | 'newsapi';
  apiKey?: string;
  category: string;
  language: string;
  isActive: boolean;
  priority: number;
}
```

### Actions

- Add source
- Edit source
- Toggle active
- Test connection
- View articles from source

---

## Pipeline Monitoring

### Run History

| Column | Info |
|--------|------|
| Type | fetch / process / full |
| Status | running / completed / failed |
| Duration | Time taken |
| Stats | Articles fetched/created |
| Errors | Error message if failed |

### Actions

- View run details
- Trigger manual run
- View error logs
