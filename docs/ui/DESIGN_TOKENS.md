# Design Tokens

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Ranglar

### Brand Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| \--primary\ | #8B5CF6 | #A78BFA | Primary actions, links |
| \--primary-foreground\ | #FFFFFF | #FFFFFF | Text on primary |
| \--secondary\ | #F3F4F6 | #374151 | Secondary actions |
| \--accent\ | #10B981 | #34D399 | Success, highlights |

### Semantic Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| \--background\ | #FFFFFF | #0F172A | Page background |
| \--foreground\ | #0F172A | #F8FAFC | Primary text |
| \--muted\ | #F1F5F9 | #1E293B | Muted backgrounds |
| \--muted-foreground\ | #64748B | #94A3B8 | Secondary text |
| \--border\ | #E2E8F0 | #334155 | Borders |
| \--destructive\ | #EF4444 | #F87171 | Errors, delete |

### Category Colors

| Category | Color | Hex |
|----------|-------|-----|
| AI | Purple | #8B5CF6 |
| Web | Blue | #3B82F6 |
| Mobile | Green | #10B981 |
| Cloud | Indigo | #6366F1 |
| Security | Red | #EF4444 |
| Data | Orange | #F59E0B |

---

## CSS Variables

\\\css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 262.1 83.3% 57.8%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 263.4 70% 50.4%;
  --primary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --border: 217.2 32.6% 17.5%;
}
\\\

---

## Typography

### Font Family

\\\css
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
\\\

### Font Sizes

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| \	ext-xs\ | 12px | 16px | Captions |
| \	ext-sm\ | 14px | 20px | Secondary text |
| \	ext-base\ | 16px | 24px | Body text |
| \	ext-lg\ | 18px | 28px | Lead text |
| \	ext-xl\ | 20px | 28px | Subheadings |
| \	ext-2xl\ | 24px | 32px | Section titles |
| \	ext-3xl\ | 30px | 36px | Page titles |
| \	ext-4xl\ | 36px | 40px | Hero titles |

### Font Weights

| Token | Weight | Usage |
|-------|--------|-------|
| \ont-normal\ | 400 | Body text |
| \ont-medium\ | 500 | Labels, buttons |
| \ont-semibold\ | 600 | Subheadings |
| \ont-bold\ | 700 | Headings |

---

## Spacing

Tailwind default spacing scale (4px base):

| Token | Value | Usage |
|-------|-------|-------|
| \space-1\ | 4px | Tight spacing |
| \space-2\ | 8px | Icon gaps |
| \space-3\ | 12px | Compact padding |
| \space-4\ | 16px | Default padding |
| \space-6\ | 24px | Section gaps |
| \space-8\ | 32px | Large gaps |
| \space-12\ | 48px | Section padding |
| \space-16\ | 64px | Page sections |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| \ounded-sm\ | 2px | Subtle rounding |
| \ounded\ | 4px | Inputs, small cards |
| \ounded-md\ | 6px | Buttons |
| \ounded-lg\ | 8px | Cards |
| \ounded-xl\ | 12px | Large cards |
| \ounded-full\ | 9999px | Avatars, badges |

---

## Shadows

| Token | Usage |
|-------|-------|
| \shadow-sm\ | Subtle elevation |
| \shadow\ | Cards |
| \shadow-md\ | Dropdowns |
| \shadow-lg\ | Modals |
| \shadow-xl\ | Popovers |

---

## Breakpoints

| Token | Width | Usage |
|-------|-------|-------|
| \sm\ | 640px | Mobile landscape |
| \md\ | 768px | Tablet |
| \lg\ | 1024px | Desktop |
| \xl\ | 1280px | Large desktop |
| \2xl\ | 1536px | Extra large |

---

## Z-Index

| Token | Value | Usage |
|-------|-------|-------|
| \z-0\ | 0 | Base |
| \z-10\ | 10 | Dropdown |
| \z-20\ | 20 | Sticky header |
| \z-30\ | 30 | Fixed elements |
| \z-40\ | 40 | Modal backdrop |
| \z-50\ | 50 | Modal content |

---

## Animation

### Durations

| Token | Value | Usage |
|-------|-------|-------|
| \duration-75\ | 75ms | Instant feedback |
| \duration-150\ | 150ms | Quick transitions |
| \duration-300\ | 300ms | Default transitions |
| \duration-500\ | 500ms | Slower animations |

### Easing

| Token | Value |
|-------|-------|
| \ease-in\ | cubic-bezier(0.4, 0, 1, 1) |
| \ease-out\ | cubic-bezier(0, 0, 0.2, 1) |
| \ease-in-out\ | cubic-bezier(0.4, 0, 0.2, 1) |

---

## Bog'liq Hujjatlar

- [Component Library](./COMPONENT_LIBRARY.md) - Komponentlar
- [Tailwind Config](../../apps/web/tailwind.config.ts) - Konfiguratsiya
