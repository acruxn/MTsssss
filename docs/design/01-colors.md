# 1. Color System

## Primary Palette

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| primary | `#0066FF` | `text-[#0066FF]` / `bg-[#0066FF]` | CTAs, nav bar, active states, links |
| primary-hover | `#0052CC` | `bg-[#0052CC]` | Button hover, pressed states |
| primary-light | `#EBF5FF` | `bg-[#EBF5FF]` | Active badges, selected row bg, info alerts |
| primary-50 | `#F0F7FF` | `bg-[#F0F7FF]` | Subtle highlight, hover on white cards |

## Neutral Palette

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| bg-page | `#F8FAFC` | `bg-[#F8FAFC]` | Page background (from Layout) |
| bg-surface | `#FFFFFF` | `bg-white` | Cards, modals, inputs |
| bg-surface-hover | `#F8FAFC` | `hover:bg-[#F8FAFC]` | Table row hover, card hover |
| bg-muted | `#F1F5F9` | `bg-[#F1F5F9]` | Table headers, disabled inputs, skeleton |
| border | `#E2E8F0` | `border-[#E2E8F0]` | Card borders, dividers, input borders |
| border-light | `#F1F5F9` | `border-[#F1F5F9]` | Subtle separators inside cards |

## Text Colors

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| text-primary | `#1E293B` | `text-[#1E293B]` | Headings, body text, primary content |
| text-secondary | `#64748B` | `text-[#64748B]` | Labels, descriptions, metadata |
| text-tertiary | `#94A3B8` | `text-[#94A3B8]` | Placeholders, captions, timestamps |
| text-inverse | `#FFFFFF` | `text-white` | Text on primary bg (nav, hero, buttons) |
| text-inverse-muted | `#BFDBFE` | `text-blue-200` | Subtitle on hero gradient |

## Semantic Colors

| Token | Hex | Tailwind (text) | Tailwind (bg) | Tailwind (border) |
|-------|-----|-----------------|---------------|-------------------|
| success | `#059669` | `text-emerald-700` | `bg-emerald-50` | `border-emerald-200` |
| success-solid | `#10B981` | `text-white` | `bg-emerald-500` | — |
| warning | `#D97706` | `text-amber-700` | `bg-amber-50` | `border-amber-200` |
| error | `#DC2626` | `text-red-700` | `bg-red-50` | `border-red-200` |
| error-solid | `#EF4444` | `text-white` | `bg-red-500` | — |
| info | `#0066FF` | `text-[#0066FF]` | `bg-[#EBF5FF]` | `border-blue-200` |

## Language Badge Colors

Already defined in LanguageBadge.tsx — keep as-is:

| Language | Text | Background | Border |
|----------|------|------------|--------|
| en | `text-[#0066FF]` | `bg-blue-50` | `border-blue-200` |
| ms | `text-emerald-700` | `bg-emerald-50` | `border-emerald-200` |
| zh | `text-amber-700` | `bg-amber-50` | `border-amber-200` |
| ta | `text-purple-700` | `bg-purple-50` | `border-purple-200` |

## Gradients

Hero gradient (Dashboard):
```
bg-gradient-to-br from-[#0066FF] to-[#0052CC]
```

Mic button glow (idle pulse):
```css
@keyframes mic-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 102, 255, 0.4); }
  50% { box-shadow: 0 0 0 24px rgba(0, 102, 255, 0); }
}
```

## Color Proportions (following Wise's guidance)

1. **White** (~60%) — card backgrounds, page areas, breathing room
2. **#F8FAFC muted** (~20%) — page bg, table headers, badge fills
3. **#1E293B / #64748B text grays** (~15%) — content hierarchy
4. **#0066FF primary** (~5%) — nav bar, CTAs, active indicators, mic button
