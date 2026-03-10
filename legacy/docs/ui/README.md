# UI Documentation

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Umumiy Korinish

Aishunos UI tizimi Tailwind CSS va shadcn/ui asosida qurilgan.

---

## Hujjatlar

| Hujjat | Tavsif |
|--------|--------|
| [COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md) | UI komponentlar |
| [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | Ranglar, shriftlar, spacing |

---

## Tech Stack

| Tool | Maqsad |
|------|--------|
| **Tailwind CSS** | Utility-first CSS |
| **shadcn/ui** | UI component library |
| **Radix UI** | Headless components |
| **Lucide Icons** | Icon library |
| **Framer Motion** | Animations |

---

## Quick Start

```bash
# Yangi komponent qoshish (shadcn)
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
```

---

## File Structure

```
apps/web/src/
├── components/
│   ├── ui/              # shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── article-card.tsx # Custom components
│   ├── header.tsx
│   └── footer.tsx
└── app/
    └── globals.css      # Global styles
```
