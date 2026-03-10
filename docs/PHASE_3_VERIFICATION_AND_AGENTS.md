# Phase 3: Verification and Agents

## Maqsad

Bu fazada 2-3 source verification va 3 agentli pipeline implementatsiya qilinadi.

## Verification

### Policy

- minimum `2` trusted source
- preferred `3` trusted source
- `1` source bo'lsa hold

### States

- `VERIFIED`
- `PARTIAL`
- `INSUFFICIENT`

## 3 ta Agent

### Agent 1: Collector

- raw article'ni normalize qiladi
- noisy content'ni tozalaydi
- metadata tayyorlaydi

### Agent 2: Analyzer / Writer

- relevance tekshiradi
- Uzbekcha short post yozadi
- Uzbekcha full article yozadi
- category, tags, slug yaratadi

### Agent 3: Reviewer

- source alignment'ni tekshiradi
- formatni tekshiradi
- `APPROVE`, `REJECT`, `HOLD` qaytaradi

## Prompt qoidalari

- strict JSON
- role separation
- no fabricated facts
- hold/reject fail-safe

## Retry

- 1-urinish normal
- 2-urinish strict reminder
- 3-urinish fail/hold

## Phase Done Criteria

- verification service ishlaydi
- 3 agent input/output kontrakti tayyor
- promptlar versiyalangan
- retry logikasi aniq
