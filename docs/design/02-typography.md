# 2. Typography

## Font Family

**Inter** — already loaded in `index.html` via Google Fonts.

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

Defined in `index.css` on `body`. No Tailwind config change needed.

## Type Scale

| Level | Tailwind Classes | Size | Weight | Usage |
|-------|-----------------|------|--------|-------|
| Page title | `text-3xl sm:text-4xl font-bold leading-tight` | 30/36px | 700 | Dashboard hero heading |
| Section title | `text-2xl font-bold` | 24px | 700 | Page headings (h1) |
| Card title | `text-lg font-semibold` | 18px | 600 | Card headings, table section titles |
| Subtitle | `text-base font-medium` | 16px | 500 | Sub-headings, nav items active |
| Body | `text-sm` | 14px | 400 | Default body text, table cells, descriptions |
| Small | `text-xs` | 12px | 400 | Timestamps, field counts, captions |
| Caption | `text-xs font-medium uppercase tracking-wide` | 12px | 500 | Section labels ("Fields needed", table headers) |
| Stat number | `text-3xl font-bold` | 30px | 700 | Dashboard stat cards |

## Font Weights

| Weight | Tailwind | Usage |
|--------|----------|-------|
| 400 (Regular) | `font-normal` | Body text, descriptions |
| 500 (Medium) | `font-medium` | Buttons, nav items, badges, sub-headings |
| 600 (Semibold) | `font-semibold` | Card titles, table headers |
| 700 (Bold) | `font-bold` | Page titles, stat numbers, hero text |

## Line Heights

| Context | Tailwind | Value |
|---------|----------|-------|
| Headings | `leading-tight` | 1.25 |
| Body text | `leading-normal` | 1.5 (default) |
| Single-line labels | `leading-none` | 1.0 |

## Text Color Pairing Rules

- Page/section titles: `text-[#1E293B]` (always)
- Body/descriptions: `text-[#64748B]`
- Metadata/timestamps: `text-[#94A3B8]`
- On primary bg (nav, hero, buttons): `text-white`
- On hero subtitle: `text-blue-200` or `text-blue-100/80`
- Links: `text-[#0066FF] hover:underline`
