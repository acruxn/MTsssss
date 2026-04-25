# 4. Component Specifications

Every component below includes the exact Tailwind `className` string.

---

## Nav Bar

```
<nav className="bg-[#0066FF] px-6 py-3 flex items-center gap-6 sticky top-0 z-50 shadow-md">
```

| Element | className |
|---------|-----------|
| Brand logo | `text-lg font-bold text-white` |
| Nav link (active) | `text-sm text-white font-semibold` |
| Nav link (inactive) | `text-sm text-blue-100 hover:text-white transition-colors` |
| Language select | `ml-auto bg-white/20 text-white border border-white/30 rounded-lg px-2 py-1 text-sm backdrop-blur-sm` |

Height: auto (~48px from py-3 + content). Sticky top.

---

## Hero Section (Dashboard)

```
<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#0052CC] p-8 sm:p-12 mb-8 shadow-xl">
```

| Element | className |
|---------|-----------|
| Eyebrow text | `text-blue-100 text-sm font-medium mb-2 tracking-wide uppercase` |
| Heading | `text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight` |
| Heading accent | `text-blue-200` |
| Description | `text-blue-100/80 mb-6 max-w-lg mx-auto` |
| CTA button | `inline-flex items-center gap-2 bg-white text-[#0066FF] font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg text-lg hover:shadow-xl hover:scale-105` |

Decorative blurs inside (absolute positioned, opacity-10):
- Top-right: `w-64 h-64 bg-white rounded-full blur-3xl`
- Bottom-left: `w-48 h-48 bg-blue-300 rounded-full blur-3xl`

---

## Stat Cards

```
<div className="bg-white rounded-xl p-5 shadow-sm border-l-4 ${accentColor} hover-lift">
```

| Element | className |
|---------|-----------|
| Icon + label row | `flex items-center gap-2 mb-1` |
| Label | `text-sm text-[#64748B]` |
| Number | `text-3xl font-bold text-[#1E293B]` |

Accent border colors by type:
- Sessions: `border-[#0066FF]`
- Completed: `border-emerald-500`
- Active: `border-amber-500`
- Templates: `border-purple-500`
- Languages: `border-cyan-500`

---

## Template Cards

```
<div className="bg-white border border-[#E2E8F0] rounded-xl p-6 hover-lift hover:border-[#0066FF]/30">
```

| Element | className |
|---------|-----------|
| Title row | `flex items-center justify-between mb-3` |
| Title | `font-semibold text-lg text-[#1E293B]` |
| Category | `text-[#64748B] text-sm mb-1 capitalize` |
| Field count | `text-xs text-[#94A3B8] mb-4` |
| CTA button | `w-full bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg py-2.5 text-sm font-medium transition-colors` |

---

## Mic Button

### Idle State
```
<button className="mic-pulse w-32 h-32 rounded-full bg-[#0066FF] hover:bg-[#0052CC] transition-all flex items-center justify-center shadow-lg shadow-[#0066FF]/30">
```
- Size: 128×128px
- Pulse animation via `.mic-pulse` CSS class
- Icon: white SVG mic, `w-14 h-14`

### Listening State
No standalone mic button — replaced by waveform bars + "Done Speaking" button.

### Processing State
```
<div className="w-12 h-12 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
```

---

## Buttons

### Primary
```
className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg py-3 px-6 font-medium transition-colors"
```
Disabled: add `disabled:opacity-40`

### Success
```
className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg py-3 px-6 font-medium transition-colors"
```

### Danger
```
className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 px-6 font-medium transition-colors"
```

### Secondary (muted)
```
className="bg-[#64748B] hover:bg-[#475569] text-white rounded-lg py-3 px-4 font-medium transition-colors"
```

### Accent (purple — Read Back)
```
className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg py-3 px-4 font-medium transition-colors"
```

### Ghost (text-only)
```
className="text-[#0066FF] hover:underline text-sm"
```

### Outline
```
className="border border-[#E2E8F0] text-[#1E293B] hover:bg-[#F8FAFC] rounded-lg py-2.5 px-4 text-sm font-medium transition-colors"
```

### Focus (all buttons)
```css
button:focus-visible {
  outline: 2px solid #0066FF;
  outline-offset: 2px;
}
```

---

## Badges

### Language Badge (LanguageBadge.tsx)
```
className="inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${langColor}"
```

### Status Badge
```
/* completed */ className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"
/* active */    className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-[#0066FF]"
/* pending */   className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
```

### Confidence Badge
```
className="text-xs bg-[#F8FAFC] rounded-full px-3 py-1 text-[#64748B] border border-[#E2E8F0]"
```

### Field Badge (FieldList)
```
className="inline-flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-sm"
```

---

## Tables

### Container
```
<div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
```

### Header Row
```
<div className="px-6 py-4 border-b border-[#E2E8F0]">
  <h2 className="text-lg font-semibold text-[#1E293B]">Title</h2>
</div>
```

### Table Header
```
<thead className="bg-[#F8FAFC] text-[#64748B]">
  <th className="p-3 text-left font-medium">
```

### Table Row
```
<tr className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC]">
  <td className="p-3">
```

---

## Alerts

### Error
```
className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700"
```

### Success
```
className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 text-sm text-emerald-700"
```

### Info / Matched
```
className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-[#0066FF]"
```

### Warning
```
className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700"
```

---

## Inputs

### Text Input
```
className="w-full bg-white border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#0066FF]"
```

### Select (in nav)
```
className="bg-white/20 text-white border border-white/30 rounded-lg px-2 py-1 text-sm backdrop-blur-sm"
```

---

## Empty States

```
<div className="text-center py-12 bg-white rounded-xl border border-[#E2E8F0]">
  <p className="text-[#64748B]">Main message</p>
  <p className="text-sm text-[#94A3B8] mt-1">Helpful hint</p>
</div>
```
