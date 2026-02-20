# Roadmap

## Work Item
- ID: WI-2026-02-20-PROD-READINESS-STABILIZATION
- Name: Production Readiness Stabilization
- Status: Completed
- Start Date: 2026-02-20
- End Date: 2026-02-20

## Goal
Loyihani release-ready holatga olib chiqish: texnik qarzdan kelgan blocking xatolarni yopish, xavfsizlikni kuchaytirish, hamda kod-hujjat holatini bir-biriga mos qilish.

## Guiding Decisions
1. Avval P0 xavfsizlik va build-breaker muammolar, keyin qolgan optimizatsiya ishlari.
2. "Green gate" faqat real command evidence bilan tasdiqlanadi.
3. Browser-origin admin oqimi privileged internal bypassdan ajratiladi.
4. Pipeline bo'yicha "implemented vs documented" ziddiyati qolmasligi kerak.
5. Documentation updates release oldi majburiy deliverable hisoblanadi.

## Milestones
1. M0: Work-item foundation va baseline snapshot
2. M1: `apps/api` type/build stabilization
3. M2: Monorepo lint stabilization (`apps/api` + `apps/web`)
4. M3: Security hardening completion (auth + XSS + secret logging)
5. M4: Routing/functional correctness and admin trigger reliability
6. M5: Pipeline integrity verified (or re-scoped with matching docs)
7. M6: Documentation sync + final release gates

## Phase Plan

### Phase 0 - Foundation
- Scope:
  - Work-item artifacts yaratish
  - Baseline gate natijalarini yozib olish
- Exit Criteria:
  - Clear risk map va phase exits belgilangan

### Phase 1 - API Compile Recovery
- Scope:
  - `apps/api` strict type xatolarini yopish
  - Prisma transaction typingni standartlashtirish
- Exit Criteria:
  - `pnpm --filter @news-app/api type-check` yashil
  - `pnpm --filter @news-app/api build` yashil

### Phase 2 - Lint Recovery
- Scope:
  - `apps/api` ESLint v9 config qo'shish
  - `apps/web` blocking lint errorlarni yopish
- Exit Criteria:
  - `pnpm --filter @news-app/api lint` yashil
  - `pnpm --filter @news-app/web lint` yashil

### Phase 3 - Security Remediation
- Scope:
  - Admin auth boundary refactor
  - Telegram article render sanitization
  - Secret loggingni tozalash
  - Unauthorized/XSS regression testlar
- Exit Criteria:
  - Security P0 bandlar yopilgan
  - E2E/contract testlarda regressiya yo'q

### Phase 4 - Functional Correctness
- Scope:
  - TG->web route to'g'riligi
  - Locale-aware navigation barqarorligi
  - Admin manual triggerlar prod-compatible oqimi
- Exit Criteria:
  - Asosiy user/admin flowlar ishonchli ishlaydi

### Phase 5 - Pipeline Integrity
- Scope:
  - Queue producer-consumer parity
  - Missing worker pieces yoki explicit re-scope
  - Integration verification kengaytmasi
- Exit Criteria:
  - Pipeline behavior hujjat bilan mos
  - Queue dry-run/real mode semantics aniq

### Phase 6 - Docs and Final Gates
- Scope:
  - Arxitektura va platform hujjatlarini yangilash
  - Final release checklist
  - Full monorepo verification
- Exit Criteria:
  - `pnpm type-check`, `pnpm lint`, `pnpm build` yashil
  - Relevant app testlar yashil
  - Release readiness signoff tayyor

## Risks
1. Lint/type xatolar soni kutilganidan ko'p chiqishi.
2. Admin auth refactor paytida regressiya ehtimoli.
3. Pipeline doirasini noto'g'ri talqin qilish va vaqt yo'qotish.
4. External audit servis beqarorligi sababli security review kechikishi.

## Mitigation
1. Severity-based task slicing va kichik iteratsiyalar.
2. Har muhim refactordan oldin/so'ng regression test.
3. Har phase yakunida objective exit criteria tekshiruvi.
4. Audit endpoint fallback sifatida manual advisory review yuritish.

## Rollback Strategy
1. Har faza alohida branch va checkpoint bilan yuritiladi.
2. Xavfsizlik regressiyasi aniqlansa so'nggi stabil checkpointga qaytish.
3. Pipeline o'zgarishlarida dry-run fallback saqlanadi.

## Timeline Baseline
1. Week 1: M0-M2 (compile/lint stabilization)
2. Week 2: M3-M4 (security + functional correctness)
3. Week 3: M5-M6 (pipeline integrity + docs + final gates)

## Completion Signal
1. `tasks.md` acceptance criteria to'liq bajarilgan.
2. Gate logs bilan tasdiqlangan release-ready holat.
3. Stakeholder signoff uchun yakuniy summary tayyor.
