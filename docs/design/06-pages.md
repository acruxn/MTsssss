# 6. Page-by-Page Wireframes

Text-based wireframes with exact layout descriptions.

---

## Dashboard (`/`)

### Desktop Layout (md+)

```
┌──────────────────────────────────────────────────────┐
│ 🎙️ FormBuddy  Dashboard  Templates  Voice  [🌐 EN ▾]│  ← nav bar
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │  gradient hero (rounded-2xl)                   │  │
│  │  FORMBUDDY — VOICE FORM ASSISTANT              │  │
│  │  Can't read the form?                          │  │
│  │  Just tell us what you need.                   │  │
│  │  [🎙️ Start Speaking]                           │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                │
│  │ 📊 │ │ ✅ │ │ 🔄 │ │ 📋 │ │ 🌏 │  ← 5 stat cards│
│  │ 10 │ │  7 │ │  3 │ │  9 │ │  4 │                │
│  │Sess│ │Comp│ │Actv│ │Tmpl│ │Lang│                │
│  └────┘ └────┘ └────┘ └────┘ └────┘                │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ Recent Sessions                                │  │
│  ├────────────────────────────────────────────────┤  │
│  │ ID │ Language │ Status    │ Fields │ Date       │  │
│  │ #1 │ MS       │ completed │ 5      │ Apr 25...  │  │
│  │ #2 │ EN       │ active    │ 2      │ Apr 25...  │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Mobile Layout

- Hero: `p-8` (no sm:p-12), text centered
- Stats: `grid-cols-2` (2×3 grid, last card spans or wraps)
- Table: horizontal scroll or card-based list (future enhancement)

### Key Classes

- Container: `px-4 py-6 sm:px-8 max-w-6xl mx-auto`
- Hero: `rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#0052CC] p-8 sm:p-12 mb-8 shadow-xl`
- Stats grid: `grid grid-cols-2 md:grid-cols-5 gap-4 mb-8`
- Table container: `bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden`

---

## Form Templates (`/templates`)

### Desktop Layout (lg)

```
┌──────────────────────────────────────────────────────┐
│ nav bar                                              │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Form Templates                    [6 of 9 templates]│
│  Choose a form to fill by voice                      │
│                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ Bank Acct │ │ Insurance│ │ Fund     │            │
│  │ Opening   │ │ Claim    │ │ Transfer │            │
│  │ EN        │ │ EN       │ │ EN       │            │
│  │ banking   │ │ insurance│ │ transfer │            │
│  │ 6 fields  │ │ 5 fields │ │ 3 fields │            │
│  │[🎙️ Start]│ │[🎙️ Start]│ │[🎙️ Start]│            │
│  └──────────┘ └──────────┘ └──────────┘            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ Bill Pay  │ │ Prepaid  │ │ Pembukaan│            │
│  │           │ │ Reload   │ │ Akaun    │            │
│  │ ...       │ │ ...      │ │ MS       │            │
│  └──────────┘ └──────────┘ └──────────┘            │
└──────────────────────────────────────────────────────┘
```

### Card Content Hierarchy

1. **Title** (font-semibold text-lg) + **LanguageBadge** (top-right)
2. **Category** (text-sm text-secondary, capitalize)
3. **Field count** (text-xs text-tertiary)
4. **CTA button** (full-width primary)

### Empty State (language filter yields 0)

```
┌────────────────────────────────────┐
│                                    │
│   No templates for this language.  │
│   Try switching language in the    │
│   nav bar.                         │
│                                    │
└────────────────────────────────────┘
```

### Key Classes

- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- Card: `bg-white border border-[#E2E8F0] rounded-xl p-6 hover-lift hover:border-[#0066FF]/30`
- Header row: `flex items-center justify-between mb-6`
- Counter badge: `text-sm text-[#64748B] bg-white px-3 py-1 rounded-full border border-[#E2E8F0]`

---

## Voice Assistant — Home Flow (`/voice`, no template param)

### Idle
```
┌─────────────────────────────┐
│ 🎙️ Voice Assistant          │
│                             │
│  🎙️ What would you like    │
│     to do?                  │
│                             │
│  Speak naturally — I'll     │
│  find the right form        │
│                             │
│       ┌─────┐               │
│       │ 🎤  │  ← pulsing    │
│       └─────┘               │
│                             │
│  Or browse templates        │
└─────────────────────────────┘
```

### Listening → Processing → Confirm → Done

Same as template flow (see 05-voice-ui.md) but:
- No FieldList shown (template unknown yet)
- Processing text: "Detecting intent & extracting fields..."
- Confirm shows matched template banner

---

## Voice Assistant — Template Flow (`/voice?template=1`)

### Idle
```
┌─────────────────────────────┐
│ 🎙️ Voice Assistant          │
│ Filling: Bank Account       │
│                             │
│ ┌─ Fields needed ─────────┐│
│ │[Name][IC][Phone][Address]││
│ └─────────────────────────┘│
│                             │
│       ┌─────┐               │
│       │ 🎤  │               │
│       └─────┘               │
│  Tap to start               │
└─────────────────────────────┘
```

### Listening → Extracting → Confirm → Done

See 05-voice-ui.md for detailed phase layouts.

### Key Classes

- Container: `px-4 py-6 sm:p-8 max-w-2xl mx-auto`
- All phase blocks wrapped in `<div style={{ animation: "fadeIn 0.3s ease-in" }}>`
