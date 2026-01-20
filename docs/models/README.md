# Data Models

> **Versiya:** 2.0  
> **Yangilangan:** 2026-01-20

---

## Umumiy Korinish

Aishunos loyihasining malumotlar modellari Prisma ORM yordamida PostgreSQL bazasida saqlanadi.

---

## Modellar

### Asosiy Modellar

| Model | Tavsif | Hujjat |
|-------|--------|--------|
| **Article** | Qayta ishlangan maqolalar | [ARTICLE.md](./ARTICLE.md) |
| **Category** | Maqola kategoriyalari | [CATEGORY.md](./CATEGORY.md) |
| **Tag** | Maqola teglari | [TAG.md](./TAG.md) |

### Pipeline Modellari

| Model | Tavsif | Hujjat |
|-------|--------|--------|
| **NewsSource** | Yangilik manbalari | [NEWS_SOURCE.md](./NEWS_SOURCE.md) |
| **RawArticle** | Xom maqolalar | [RAW_ARTICLE.md](./RAW_ARTICLE.md) |
| **PipelineRun** | Pipeline monitoring | [PIPELINE_RUN.md](./PIPELINE_RUN.md) |

### Tizim Modellari

| Model | Tavsif | Hujjat |
|-------|--------|--------|
| **AIUsage** | AI xarajat tracking | [AI_USAGE.md](./AI_USAGE.md) |
| **SystemSetting** | Tizim sozlamalari | [SYSTEM_SETTING.md](./SYSTEM_SETTING.md) |

---

## ER Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ NewsSource  │──────<│ RawArticle  │──────>│   Article   │
└─────────────┘       └─────────────┘       └──────┬──────┘
                                                   │
                                            ┌──────┼──────┐
                                            │      │      │
                                      ┌─────┴─┐ ┌──┴──┐ ┌─┴────┐
                                      │Category│ │ Tag │ │AIUsage│
                                      └───────┘ └─────┘ └──────┘

┌─────────────┐     ┌───────────────┐
│ PipelineRun │     │ SystemSetting │
└─────────────┘     └───────────────┘
```

---

## Malumot Oqimi

```
1. NewsSource → Fetch → RawArticle (pending)
2. RawArticle → AI Processing → Article + AIUsage
3. Article → Category + Tags (turkumlash)
4. PipelineRun → Monitoring (har bir qadam)
5. SystemSetting → Global config
```

---

## Prisma Schema

Toliq schema: [`prisma/schema.prisma`](../../prisma/schema.prisma)

---

## Bogliq Hujjatlar

- [Pipeline Architecture](../pipeline-architecture.md)
- [API Endpoints](../api/ENDPOINTS.md)
- [Repositories](../repositories/README.md)
