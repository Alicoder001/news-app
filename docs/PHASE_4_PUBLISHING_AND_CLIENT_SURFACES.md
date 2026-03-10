# Phase 4: Publishing and Client Surfaces

## Maqsad

Bu faza `web first, telegram second` publish modelini va user-facing surface'larni belgilaydi.

## Publish Flow

1. approved article DB'ga yoziladi
2. website URL tayyor bo'ladi
3. short post Telegram'ga yuboriladi
4. Mini App full article'ni umumiy source'dan o'qiydi

## Website

### Pages

- Home
- Article Detail
- Category
- About
- Contact

### Talablar

- SEO
- source references
- category pages
- clean slug

## Telegram

### Qisqa post

- title yoki asosiy gap
- 3-5 gap
- source block
- hashtag
- website link

## Mini App

### Minimal views

- feed
- article detail
- category filter
- settings lite

## Delivery Tracking

Har publish action uchun:

- `WEB`
- `TELEGRAM`
- `MINI_APP`

delivery state saqlanadi.

## Phase Done Criteria

- website article ko'rsatadi
- telegram short post website link bilan ketadi
- Mini App full article'ni ko'rsatadi
- delivery statuses DB'da saqlanadi
