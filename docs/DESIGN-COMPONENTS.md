# FormBuddy Design Components

TNG-inspired fintech theme. Copy-paste ready TSX + Tailwind.

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#0066FF` | Buttons, links, nav, accents |
| Primary Dark | `#0052CC` | Hover states, gradients |
| Background | `#F8FAFC` | Page background |
| Surface | `#FFFFFF` | Cards, tables |
| Border | `#E2E8F0` | Card borders, dividers |
| Text Primary | `#1E293B` | Headings, body text |
| Text Secondary | `#64748B` | Labels, captions |
| Text Muted | `#94A3B8` | Placeholders, hints |
| Success | `#10B981` / `emerald-500` | Completed states |
| Warning | `#F59E0B` / `amber-500` | Active/pending states |
| Danger | `#EF4444` / `red-500` | Errors, destructive |

## Utility CSS (add to index.css)

```css
.hover-lift {
  transition: transform 0.2s, box-shadow 0.2s;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@keyframes mic-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 102, 255, 0.5); }
  50% { box-shadow: 0 0 0 20px rgba(0, 102, 255, 0); }
}
.mic-pulse {
  animation: mic-pulse 2s ease-in-out infinite;
}
```

---

## 1. Nav Bar

```tsx
<nav className="bg-[#0066FF] px-6 py-3 flex items-center gap-6 sticky top-0 z-50 shadow-md">
  {/* Brand */}
  <button className="text-lg font-bold text-white">🎙️ FormBuddy</button>

  {/* Nav links */}
  <button className="text-sm text-white font-semibold">Dashboard</button>
  <button className="text-sm text-blue-100 hover:text-white transition-colors">Templates</button>

  {/* Language selector — pushed right */}
  <select className="ml-auto bg-white/20 text-white border border-white/30 rounded-lg px-2 py-1 text-sm backdrop-blur-sm">
    <option className="text-gray-900" value="all">🌐 All Languages</option>
    <option className="text-gray-900" value="en">🇬🇧 English</option>
    <option className="text-gray-900" value="ms">🇲🇾 Bahasa Melayu</option>
    <option className="text-gray-900" value="zh">🇨🇳 中文</option>
    <option className="text-gray-900" value="ta">🇮🇳 தமிழ்</option>
  </select>
</nav>
```

Active link: `text-white font-semibold`
Inactive link: `text-blue-100 hover:text-white transition-colors`

---

## 2. Hero Section

```tsx
<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#0052CC] p-8 sm:p-12 mb-8 shadow-xl">
  {/* Decorative blurs */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-4 right-4 w-64 h-64 bg-white rounded-full blur-3xl" />
    <div className="absolute bottom-4 left-4 w-48 h-48 bg-blue-300 rounded-full blur-3xl" />
  </div>

  <div className="relative z-10 text-center">
    <p className="text-blue-100 text-sm font-medium mb-2 tracking-wide uppercase">
      Subtitle Text
    </p>
    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
      Main Heading<br />
      <span className="text-blue-200">Secondary line</span>
    </h1>
    <p className="text-blue-100/80 mb-6 max-w-lg mx-auto">
      Description paragraph with supporting text.
    </p>
    <button className="inline-flex items-center gap-2 bg-white text-[#0066FF] font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg text-lg hover:shadow-xl hover:scale-105">
      🎙️ Call to Action
    </button>
  </div>
</div>
```

---

## 3. Stat Card

Single card with colored left border accent:

```tsx
<div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-[#0066FF] hover-lift">
  <div className="flex items-center gap-2 mb-1">
    <span>📊</span>
    <span className="text-sm text-[#64748B]">Sessions</span>
  </div>
  <p className="text-3xl font-bold text-[#1E293B]">142</p>
</div>
```

Grid layout for multiple stat cards:

```tsx
<div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
  {/* Repeat stat cards here */}
</div>
```

Border color variants:
- Primary: `border-[#0066FF]`
- Success: `border-emerald-500`
- Warning: `border-amber-500`
- Purple: `border-purple-500`
- Cyan: `border-cyan-500`

---

## 4. Template Card

```tsx
<div className="bg-white border border-[#E2E8F0] rounded-xl p-6 hover-lift hover:border-[#0066FF]/30">
  <div className="flex items-center justify-between mb-3">
    <h3 className="font-semibold text-lg text-[#1E293B]">Card Title</h3>
    {/* Badge goes here */}
    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium border text-[#0066FF] bg-blue-50 border-blue-200">
      English
    </span>
  </div>
  <p className="text-[#64748B] text-sm mb-1">Category</p>
  <p className="text-xs text-[#94A3B8] mb-4">5 fields</p>
  <button className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg py-2.5 text-sm font-medium transition-colors">
    🎙️ Start Voice Fill
  </button>
</div>
```

Grid layout:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```

---

## 5. Data Table

```tsx
<div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
  {/* Header */}
  <div className="px-6 py-4 border-b border-[#E2E8F0]">
    <h2 className="text-lg font-semibold text-[#1E293B]">Table Title</h2>
  </div>

  <table className="w-full text-sm">
    <thead className="bg-[#F8FAFC] text-[#64748B]">
      <tr>
        <th className="p-3 text-left font-medium">Column</th>
        <th className="p-3 text-center font-medium">Status</th>
        <th className="p-3 text-left font-medium">Date</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC]">
        <td className="p-3 font-medium">#1</td>
        <td className="p-3 text-center">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
            completed
          </span>
        </td>
        <td className="p-3 text-[#64748B]">25 Apr 2026</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 6. Buttons

### Primary
```tsx
<button className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
  Primary Action
</button>
```

### Primary Large (CTA)
```tsx
<button className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 text-lg">
  Call to Action
</button>
```

### Secondary
```tsx
<button className="bg-[#F8FAFC] hover:bg-gray-100 text-[#1E293B] font-medium px-6 py-2.5 rounded-lg border border-[#E2E8F0] transition-colors">
  Secondary
</button>
```

### Outline
```tsx
<button className="bg-transparent hover:bg-blue-50 text-[#0066FF] font-medium px-6 py-2.5 rounded-lg border border-[#0066FF] transition-colors">
  Outline
</button>
```

### Ghost
```tsx
<button className="bg-transparent hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#1E293B] font-medium px-6 py-2.5 rounded-lg transition-colors">
  Ghost
</button>
```

### Danger
```tsx
<button className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
  Delete
</button>
```

### Disabled (add to any variant)
```tsx
<button className="... opacity-50 cursor-not-allowed" disabled>
  Disabled
</button>
```

### Icon Button
```tsx
<button className="p-2.5 rounded-lg bg-[#F8FAFC] hover:bg-gray-100 border border-[#E2E8F0] transition-colors">
  <svg className="w-5 h-5 text-[#64748B]" /* ... */ />
</button>
```

---

## 7. Badges / Pills

### Language Badge
```tsx
<span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium border text-[#0066FF] bg-blue-50 border-blue-200">
  English
</span>
```

Color map:
| Language | Classes |
|----------|---------|
| en | `text-[#0066FF] bg-blue-50 border-blue-200` |
| ms | `text-emerald-700 bg-emerald-50 border-emerald-200` |
| zh | `text-amber-700 bg-amber-50 border-amber-200` |
| ta | `text-purple-700 bg-purple-50 border-purple-200` |

### Status Badge
```tsx
{/* Completed */}
<span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
  completed
</span>

{/* Active */}
<span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-[#0066FF]">
  active
</span>

{/* Pending */}
<span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
  pending
</span>

{/* Error */}
<span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
  failed
</span>

{/* Default */}
<span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
  unknown
</span>
```

---

## 8. Alerts

### Success
```tsx
<div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
  <span className="text-emerald-500 mt-0.5">✓</span>
  <div>
    <p className="font-medium text-emerald-800 text-sm">Success</p>
    <p className="text-emerald-700 text-sm mt-1">Form submitted successfully.</p>
  </div>
</div>
```

### Error
```tsx
<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
  <span className="text-red-500 mt-0.5">✕</span>
  <div>
    <p className="font-medium text-red-800 text-sm">Error</p>
    <p className="text-red-700 text-sm mt-1">Failed to extract fields. Please try again.</p>
  </div>
</div>
```

### Info
```tsx
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
  <span className="text-[#0066FF] mt-0.5">ℹ</span>
  <div>
    <p className="font-medium text-blue-800 text-sm">Info</p>
    <p className="text-blue-700 text-sm mt-1">Speak clearly into your microphone.</p>
  </div>
</div>
```

### Warning
```tsx
<div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
  <span className="text-amber-500 mt-0.5">⚠</span>
  <div>
    <p className="font-medium text-amber-800 text-sm">Warning</p>
    <p className="text-amber-700 text-sm mt-1">Some required fields are missing.</p>
  </div>
</div>
```

---

## 9. Input Field

### Text Input with Label
```tsx
<div>
  <label htmlFor="name" className="block text-sm font-medium text-[#1E293B] mb-1.5">
    Full Name <span className="text-red-500">*</span>
  </label>
  <input
    id="name"
    type="text"
    placeholder="Enter your name"
    className="w-full px-4 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-colors text-sm"
  />
</div>
```

### Input with Error
```tsx
<div>
  <label htmlFor="email" className="block text-sm font-medium text-[#1E293B] mb-1.5">
    Email
  </label>
  <input
    id="email"
    type="email"
    className="w-full px-4 py-2.5 rounded-lg border border-red-300 bg-red-50 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-colors text-sm"
  />
  <p className="text-red-600 text-xs mt-1.5">Please enter a valid email address.</p>
</div>
```

### Select
```tsx
<select className="w-full px-4 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-colors text-sm">
  <option value="">Select an option</option>
  <option value="a">Option A</option>
</select>
```

---

## 10. Loading Spinner

### Small (inline)
```tsx
<div className="w-5 h-5 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
```

### Medium (section loading)
```tsx
<div className="flex flex-col items-center gap-3 py-12">
  <div className="w-10 h-10 border-3 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
  <p className="text-sm text-[#64748B]">Loading...</p>
</div>
```

### Full page
```tsx
<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
  <div className="w-12 h-12 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
  <p className="text-[#64748B]">Extracting fields with AI...</p>
</div>
```

### Button with spinner
```tsx
<button disabled className="bg-[#0066FF] text-white font-medium px-6 py-2.5 rounded-lg opacity-80 cursor-not-allowed inline-flex items-center gap-2">
  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  Processing...
</button>
```

---

## 11. Empty State

```tsx
<div className="text-center py-16 bg-white rounded-xl border border-[#E2E8F0]">
  <div className="text-5xl mb-4">📋</div>
  <h3 className="text-lg font-semibold text-[#1E293B] mb-2">No templates found</h3>
  <p className="text-[#64748B] text-sm mb-6 max-w-sm mx-auto">
    Try switching language in the nav bar or create a new template.
  </p>
  <button className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
    Browse All Templates
  </button>
</div>
```

---

## 12. Mobile Responsive Patterns

### Card Grid Stacking
```tsx
{/* 1 col mobile → 2 col tablet → 3 col desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

{/* Stat cards: 2 col mobile → 5 col desktop */}
<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
```

### Page Container
```tsx
{/* Responsive padding + max width */}
<div className="px-4 py-6 sm:px-8 max-w-6xl mx-auto">
```

### Touch-Friendly Buttons
```tsx
{/* Minimum 44px touch target (py-2.5 + text = ~44px) */}
<button className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-medium min-h-[44px]">

{/* Full-width on mobile, auto on desktop */}
<button className="w-full sm:w-auto ...">

{/* Large CTA — always comfortable to tap */}
<button className="px-8 py-3 rounded-xl text-lg ...">
```

### Responsive Text
```tsx
<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
<p className="text-sm sm:text-base">
```

### Table Overflow on Mobile
```tsx
<div className="overflow-x-auto -mx-4 sm:mx-0">
  <table className="w-full text-sm min-w-[600px]">
    {/* Table content */}
  </table>
</div>
```

### Hero Responsive Padding
```tsx
<div className="p-6 sm:p-8 md:p-12 rounded-xl sm:rounded-2xl">
```

---

## Quick Reference: className Strings

Copy these directly into components:

```
// Page background
min-h-screen bg-[#F8FAFC] text-[#1E293B]

// Card
bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 hover-lift

// Section heading
text-lg font-semibold text-[#1E293B]

// Body text
text-sm text-[#64748B]

// Muted text
text-xs text-[#94A3B8]

// Divider
border-t border-[#E2E8F0]

// Primary button
bg-[#0066FF] hover:bg-[#0052CC] text-white font-medium px-6 py-2.5 rounded-lg transition-colors

// Card with hover
bg-white border border-[#E2E8F0] rounded-xl p-6 hover-lift hover:border-[#0066FF]/30
```
