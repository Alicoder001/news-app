# Phase 5: Admin and Operations

## Maqsad

Bu faza admin dashboard, data fetching, local UI state va operatsion kuzatuvni belgilaydi.

## Admin Dashboard

### Views

- Sources
- Pipeline Runs
- Raw Articles
- Articles
- Failures / Holds

## TanStack Query

Server state uchun ishlatiladi:

- article list
- article detail
- admin sources
- pipeline runs
- raw articles
- failures
- Mini App feed

## Zustand

Local UI state uchun ishlatiladi:

- admin filters
- sidebar state
- Mini App local settings
- local view toggles

## Lucide React

Icons uchun ishlatiladi:

- sidebar
- statuses
- actions
- source types
- publish indicators

## Monitoring

### Kuzatiladigan narsalar

- fetched count
- verified count
- hold count
- web publish success
- telegram publish success
- errors count

## Manual Recovery

Admin orqali:

- manual pipeline trigger
- republish telegram
- hold item ko'rish
- failed item ko'rish

## Phase Done Criteria

- admin pages tayyor
- TanStack Query query keys aniq
- Zustand local stores aniq
- Lucide icon usage aniq
- logs va runs kuzatiladi
