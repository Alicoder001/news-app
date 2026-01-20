# System Setting Model

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Maqsad

SystemSetting modeli tizim sozlamalarini key-value formatida saqlaydi.

---

## Prisma Schema

```prisma
model SystemSetting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String   @db.Text
  type      SettingType @default(STRING)
  updatedAt DateTime @updatedAt
  
  @@index([key])
}

enum SettingType {
  STRING
  NUMBER
  BOOLEAN
  JSON
}
```

---

## Maydonlar

| Maydon | Turi | Tavsif | Majburiy |
|--------|------|--------|----------|
| `id` | String | Unique ID | ✅ Auto |
| `key` | String | Sozlama kaliti (unique) | ✅ |
| `value` | String | Qiymat (text) | ✅ |
| `type` | SettingType | Qiymat turi | ✅ Default: STRING |
| `updatedAt` | DateTime | Yangilangan vaqt | ✅ Auto |

---

## Standart Sozlamalar

| Key | Type | Default | Tavsif |
|-----|------|---------|--------|
| `pipeline.enabled` | BOOLEAN | true | Pipeline faolmi |
| `pipeline.interval` | NUMBER | 30 | Interval (daqiqa) |
| `telegram.enabled` | BOOLEAN | true | Telegram posting |
| `telegram.channel_id` | STRING | - | Kanal ID |
| `ai.model` | STRING | gpt-4o-mini | AI model |
| `ai.max_tokens` | NUMBER | 2000 | Max tokens |
| `site.maintenance` | BOOLEAN | false | Maintenance mode |

---

## TypeScript Interface

```typescript
interface SystemSetting {
  id: string;
  key: string;
  value: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  updatedAt: Date;
}

// Helper functions
function getSetting(key: string): Promise<string | null>;
function getSettingTyped<T>(key: string, defaultValue: T): Promise<T>;
function setSetting(key: string, value: any, type?: SettingType): Promise<void>;
```

---

## Foydalanish

```typescript
// String
const channelId = await getSetting('telegram.channel_id');

// Boolean
const isEnabled = await getSettingTyped('pipeline.enabled', true);

// Number
const interval = await getSettingTyped('pipeline.interval', 30);

// JSON
const config = await getSettingTyped('pipeline.config', {});
```

---

## Bogliq Hujjatlar

- [Admin Panel](../platforms/ADMIN_PANEL.md) - Settings UI
