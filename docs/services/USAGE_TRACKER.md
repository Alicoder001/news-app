# Usage Tracker Service

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Maqsad

Usage Tracker OpenAI API ishlatilishini kuzatadi va xarajatlarni hisoblaydi.

---

## Fayl Joylashuvi

```
apps/web/src/lib/admin/usage-tracker.ts
```

---

## Asosiy Funksiyalar

### 1. trackUsage

AI ishlatilishini qayd qilish.

```typescript
interface UsageData {
  model: string;
  operation: string;
  promptTokens: number;
  completionTokens: number;
  articleId?: string;
}

async function trackUsage(data: UsageData): Promise<AIUsage>
```

### 2. getDailyUsage

Kunlik statistika.

```typescript
interface DailyStats {
  date: Date;
  totalTokens: number;
  totalCost: number;
  operationBreakdown: {
    operation: string;
    count: number;
    tokens: number;
    cost: number;
  }[];
}

async function getDailyUsage(date?: Date): Promise<DailyStats>
```

### 3. getMonthlyUsage

Oylik statistika.

```typescript
interface MonthlyStats {
  month: string; // "2026-01"
  totalTokens: number;
  totalCost: number;
  dailyBreakdown: {
    date: Date;
    tokens: number;
    cost: number;
  }[];
}

async function getMonthlyUsage(month?: string): Promise<MonthlyStats>
```

### 4. checkBudget

Budjet chegarasini tekshirish.

```typescript
interface BudgetStatus {
  dailyLimit: number;
  dailyUsed: number;
  dailyRemaining: number;
  monthlyLimit: number;
  monthlyUsed: number;
  monthlyRemaining: number;
  isOverDailyLimit: boolean;
  isOverMonthlyLimit: boolean;
}

async function checkBudget(): Promise<BudgetStatus>
```

---

## Model Narxlari

```typescript
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'gpt-4o-mini': { input: 0.15, output: 0.60 },    // per 1M tokens
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gpt-4-turbo': { input: 10.00, output: 30.00 },
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
};
```

---

## Budget Alerts

```typescript
// Kunlik limit
const DAILY_BUDGET = 10.00; // USD

// Oylik limit  
const MONTHLY_BUDGET = 100.00; // USD

// Ogohlantirish chegarasi (80%)
const ALERT_THRESHOLD = 0.8;
```

---

## Admin Dashboard Integration

```typescript
// API endpoint
GET /api/admin/usage

// Response
{
  "daily": {
    "tokens": 125000,
    "cost": 0.85,
    "articles": 45
  },
  "monthly": {
    "tokens": 2500000,
    "cost": 18.50,
    "articles": 890
  },
  "budget": {
    "dailyRemaining": 9.15,
    "monthlyRemaining": 81.50
  }
}
```

---

## Bogliq Hujjatlar

- [AI Service](./AI_SERVICE.md) - AI integration
- [AI Usage Model](../models/AI_USAGE.md) - Data model
- [Admin Panel](../platforms/ADMIN_PANEL.md) - Usage dashboard
