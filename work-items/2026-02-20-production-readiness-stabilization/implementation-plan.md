# Implementation Plan

## Work Item
- ID: WI-2026-02-20-PROD-READINESS-STABILIZATION
- Date: 2026-02-20
- Status: Completed
- Scope: `apps/api`, `apps/web`, `apps/mobile`, `packages/*`, `docs/*`, `work-items/*`

## Objective
Loyihani production-release darajasiga olib chiqish: quality gatelarni yashil holatga qaytarish, xavfsizlikdagi kritik zaifliklarni yopish, hamda hujjatlar va amaldagi kod holatini bir-biriga to'liq moslash.

## Success Definition
1. Monorepo `type-check`, `lint`, `build` gate'lari to'liq yashil.
2. Admin auth modeli browser-origin xavflariga bardoshli.
3. XSS riskli render pathlar sanitizatsiya bilan himoyalangan.
4. Pipeline bo'yicha kod va hujjatlar orasida ziddiyat qolmagan.
5. Release qarori gate dalillari bilan isbotlanadigan holatga kelgan.

## Execution Strategy

### Stage A - Baseline and Guardrails
1. Joriy holat snapshoti olinadi (`type-check`, `lint`, `build`, testlar).
2. P0/P1/P2 risklar severity bo'yicha tasniflanadi.
3. Har faza uchun exit criteria aniq yoziladi.

### Stage B - Technical Stabilization
1. `apps/api` strict TypeScript xatolari bartaraf etiladi.
2. ESLint v9 konfiguratsiyasi barcha applar uchun deterministik holatga keltiriladi.
3. `apps/web` lintdagi blocking errorlar tozalanadi.

### Stage C - Security Hardening
1. Secret-in-cookie anti-patterndan voz kechilib, token/session boundary kuchaytiriladi.
2. Internal token bypass faqat trusted server-to-server oqimiga cheklanadi.
3. HTML sanitization barcha user-visible rich content pathlarda standartlashtiriladi.
4. Security regression testlari qo'shiladi.

### Stage D - Functional and Operational Correctness
1. Telegram va web route uyg'unligi tuzatiladi.
2. Admin manual triggerlar productionga mos siyosat bilan ishlaydi.
3. Pipeline worker implementatsiyasi va hujjati bir xil haqiqatni aks ettiradi.

### Stage E - Documentation and Release Readiness
1. Arxitektura hujjatlari kodning joriy topologiyasiga yangilanadi.
2. Work-item statuslar amaldagi gate natijalari bilan sinxronlanadi.
3. Final release checklist yaratiladi va imzolanadi.

## Workstreams

### WS1 - Quality Gates
- Owner: Platform/Core
- Deliverables:
  - `apps/api` compile-ready holat
  - monorepo lint/build green
  - gate evidence loglari

### WS2 - Security
- Owner: Backend + Web
- Deliverables:
  - harden qilingan admin auth boundary
  - XSS-safe rendering paths
  - security regression tests

### WS3 - Pipeline Integrity
- Owner: Backend/Operations
- Deliverables:
  - queue producer-consumer parity
  - dry-run va queue mode observability
  - integration coverage kengaytmasi

### WS4 - Documentation/Governance
- Owner: Architecture/Tech Lead
- Deliverables:
  - docs sync
  - truthful status tracking
  - release-readiness signoff checklist

## Technical Rules
1. Har o'zgarish minimal blast-radius bilan kichik PR/commitlarga bo'linadi.
2. P0 xavfsizlik topilmasi mavjud bo'lsa, feature ishlari to'xtatiladi.
3. Har fazada oldin avtomatlashtirilgan test/gate, keyin manual verification qilinadi.
4. No destructive git operations.

## Quality Gates

### Mandatory Core
```bash
pnpm type-check
pnpm lint
pnpm build
```

### API Stability
```bash
pnpm --filter @news-app/api type-check
pnpm --filter @news-app/api lint
pnpm --filter @news-app/api build
pnpm --filter @news-app/api test
```

### Web/Mobile Stability
```bash
pnpm --filter @news-app/web type-check
pnpm --filter @news-app/web lint
pnpm --filter @news-app/web test
pnpm --filter @news-app/mobile type-check
pnpm --filter @news-app/mobile test:smoke
```

## Risk Register
1. Hidden auth regressions after admin boundary refactor.
2. Lint error volume sababli stabilization muddati cho'zilishi.
3. Pipeline implementation-document mismatchlardan noto'g'ri release signal.
4. Dependency advisory/audit endpoint beqarorligi.

## Mitigation
1. High-risk o'zgarishlarga regression tests majburiy.
2. Severity-based lint backlog: blocking -> warning -> cleanup.
3. Har phase yakunida docs + code parity check.
4. Audit endpoint ishonchsiz bo'lsa manual advisory review fallback.

## Rollback Strategy
1. Har phase alohida branch bilan yuritiladi.
2. Security regressions aniqlansa oldingi stabil commitga qaytiladi.
3. Pipeline o'zgarishlari uchun dual-mode (queue/dry-run) fallback saqlanadi.

## Definition of Done
1. `tasks.md` dagi acceptance criteria bandlari to'liq bajarilgan.
2. Barcha kritik va yuqori severity topilmalar yopilgan yoki rasmiy ravishda risk-accepted.
3. Release owner tomonidan final readiness tasdiqlangan.
