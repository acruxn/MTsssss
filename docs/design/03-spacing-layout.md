# 3. Spacing & Layout

## Page Container

```
className="px-4 py-6 sm:px-8 max-w-6xl mx-auto"
```

- Mobile: 16px horizontal padding
- Desktop (sm+): 32px horizontal padding
- Max width: 1152px (max-w-6xl), centered
- Voice Assistant uses `max-w-2xl` (672px) for focused single-column

## Breakpoints

| Name | Min-width | Columns | Usage |
|------|-----------|---------|-------|
| default | 0px | 1 | Mobile — single column, stacked |
| sm | 640px | 1-2 | Tablet — hero padding increases |
| md | 768px | 2-3 | Tablet landscape — stat grid, template grid |
| lg | 1024px | 3 | Desktop — 3-column template grid |

## Spacing Tokens

| Token | Tailwind | Pixels | Usage |
|-------|----------|--------|-------|
| section-gap | `mb-8` | 32px | Between major page sections |
| card-gap | `gap-4` | 16px | Between cards in a grid |
| card-padding | `p-5` or `p-6` | 20/24px | Inside cards |
| card-padding-compact | `p-4` | 16px | Smaller cards, badges area |
| inner-gap | `gap-2` or `space-y-3` | 8/12px | Between elements inside a card |
| button-row-gap | `gap-3` | 12px | Between buttons in a row |

## Grid Patterns

### Stat Cards (Dashboard)
```
className="grid grid-cols-2 md:grid-cols-5 gap-4"
```

### Template Cards
```
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
```

### Button Row (stacks on mobile)
```
className="flex flex-col sm:flex-row gap-3"
```

## Card Base

```
className="bg-white border border-[#E2E8F0] rounded-xl"
```

- Border radius: `rounded-xl` (12px)
- Shadow: `shadow-sm` for default, `shadow-md` for elevated
- No shadow on mobile to reduce visual noise (optional)

## Dividers

- Between table rows: `border-t border-[#E2E8F0]`
- Inside cards: `border-b border-[#E2E8F0]` on each item except last
- Section divider: `border-b border-[#F1F5F9]` (lighter)
