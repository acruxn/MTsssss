# FormBuddy — Voice UI Design Spec

> Design reference for the VoiceAssistant component. Every animation includes copy-pasteable Tailwind classes and CSS keyframes.

---

## Design Philosophy

Inspired by three industry leaders:
- **ChatGPT Voice**: Inline transcript + voice in one unified view (no mode-switching)
- **Apple Siri (iOS 27)**: Glowing orb/edge glow that pulses with voice activity
- **Google Gemini**: Rounded, bouncy overlay with gradient border glow

Our approach: **Siri-style glowing orb** for the mic button, **ChatGPT-style inline transcript**, and **Gemini-style gradient accents**. Mobile-first, one-handed, dark theme.

---

## 1. Mic Button States

### Resting / Idle
Large, inviting, centered. Soft pulsing glow invites interaction.

```
Size: w-28 h-28 (mobile) / w-32 h-32 (desktop)
Background: bg-[#0066FF]
Shadow: shadow-lg shadow-[#0066FF]/30
Border-radius: rounded-full
Icon: white mic SVG, w-12 h-12
```

**Pulse animation (idle invitation):**
```css
@keyframes mic-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 102, 255, 0.4); }
  50% { box-shadow: 0 0 0 24px rgba(0, 102, 255, 0); }
}
.mic-pulse {
  animation: mic-pulse 2s ease-in-out infinite;
}
```

### Listening (Active)
Button shrinks slightly, glow intensifies, ring animation radiates outward.

```
Size: w-20 h-20 (shrinks to show "active" state)
Background: bg-red-500 (red = recording)
Shadow: shadow-xl shadow-red-500/40
```

**Ripple rings (I'm hearing you):**
```css
@keyframes ripple {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2.5); opacity: 0; }
}
.mic-ripple::before,
.mic-ripple::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 2px solid rgba(239, 68, 68, 0.5);
  animation: ripple 2s ease-out infinite;
}
.mic-ripple::after {
  animation-delay: 1s;
}
```

Tailwind wrapper:
```html
<div class="relative">
  <div class="mic-ripple absolute inset-0" />
  <button class="relative z-10 w-20 h-20 rounded-full bg-red-500 ...">
    <!-- mic icon -->
  </button>
</div>
```

### Processing (AI Thinking)
Mic button replaced by a thinking indicator. Two options:

**Option A — Morphing spinner (recommended):**
```css
@keyframes think-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes think-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
```
```html
<div class="w-16 h-16 rounded-full border-4 border-[#0066FF] border-t-transparent animate-spin" />
<p class="text-sm text-gray-400 animate-pulse mt-3">Extracting fields...</p>
```

**Option B — Bouncing dots (chat-style):**
```css
@keyframes bounce-dot {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
}
.thinking-dots span {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: #0066FF;
  animation: bounce-dot 1.4s ease-in-out infinite;
}
.thinking-dots span:nth-child(2) { animation-delay: 0.16s; }
.thinking-dots span:nth-child(3) { animation-delay: 0.32s; }
```
```html
<div class="thinking-dots flex gap-2 justify-center py-8">
  <span></span><span></span><span></span>
</div>
```

### Error
Brief red flash, then return to idle with error message.

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}
.animate-shake {
  animation: shake 0.4s ease-in-out;
}
```
```html
<div class="animate-shake bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
  Failed to extract fields. Please try again.
</div>
```

---

## 2. Transcript Display

### Live Text Appearance
Text appears instantly (no typing animation — Web Speech API delivers chunks, typing animation would lag behind). Interim text is lighter, final text is solid.

```html
<div class="bg-white border border-gray-200 rounded-xl p-5 min-h-[100px] shadow-sm">
  <p class="text-xs text-gray-400 mb-2 uppercase tracking-wide">Live Transcription</p>
  <p class="text-lg leading-relaxed text-gray-900">
    <!-- final text: solid -->
    <span>Saya nak hantar duit kepada Ahmad </span>
    <!-- interim text: lighter, italic -->
    <span class="text-gray-400 italic">seratus ring...</span>
  </p>
</div>
```

### Styling
| Property | Value |
|----------|-------|
| Font size | `text-lg` (18px) |
| Final text color | `text-gray-900` |
| Interim text color | `text-gray-400 italic` |
| Container | `bg-white border border-gray-200 rounded-xl p-5` |
| Min height | `min-h-[100px]` |
| Empty state | `text-gray-400` "Listening..." with pulse |

### Empty State Animation
```css
@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```
```html
<span class="text-gray-400">Listening</span>
<span class="inline-block w-0.5 h-5 bg-[#0066FF] ml-1" style="animation: blink-cursor 1s step-end infinite"></span>
```

---

## 3. Waveform / Audio Visualization

### Recommended: Equalizer Bars
5-7 vertical bars that animate at different speeds. Simple, performant, universally understood as "audio active."

```css
@keyframes eq-bar {
  0%, 100% { height: 8px; }
  50% { height: var(--max-h, 32px); }
}
```
```html
<div class="flex items-end justify-center gap-1.5 h-16">
  <div class="w-1.5 rounded-full bg-[#0066FF]" style="--max-h: 28px; animation: eq-bar 0.8s ease-in-out infinite" />
  <div class="w-1.5 rounded-full bg-[#0066FF]" style="--max-h: 40px; animation: eq-bar 0.6s ease-in-out infinite 0.1s" />
  <div class="w-1.5 rounded-full bg-[#0066FF]" style="--max-h: 52px; animation: eq-bar 0.7s ease-in-out infinite 0.2s" />
  <div class="w-1.5 rounded-full bg-[#0066FF]" style="--max-h: 60px; animation: eq-bar 0.5s ease-in-out infinite 0.15s" />
  <div class="w-1.5 rounded-full bg-[#0066FF]" style="--max-h: 44px; animation: eq-bar 0.65s ease-in-out infinite 0.25s" />
  <div class="w-1.5 rounded-full bg-[#0066FF]" style="--max-h: 36px; animation: eq-bar 0.75s ease-in-out infinite 0.05s" />
  <div class="w-1.5 rounded-full bg-[#0066FF]" style="--max-h: 24px; animation: eq-bar 0.85s ease-in-out infinite 0.3s" />
</div>
```

### Alternative: Glowing Orb (Siri-style)
A single circle that morphs and glows with voice activity. More premium feel but harder to implement with CSS alone.

```css
@keyframes orb-breathe {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(0, 102, 255, 0.3), 0 0 60px rgba(0, 102, 255, 0.1);
  }
  50% {
    transform: scale(1.08);
    box-shadow: 0 0 30px rgba(0, 102, 255, 0.5), 0 0 80px rgba(0, 102, 255, 0.2);
  }
}
.orb-listening {
  width: 120px;
  height: 120px;
  border-radius: 9999px;
  background: radial-gradient(circle at 40% 40%, #3b82f6, #0066FF, #1e40af);
  animation: orb-breathe 1.5s ease-in-out infinite;
}
```

### Recommendation
Use **equalizer bars** for the listening state (clear, lightweight, universally understood). Reserve the orb for the idle mic button only.

---

## 4. Field Extraction Animation

When AI returns extracted fields, they should appear with a staggered slide-up animation. Each field row animates in sequence with a 60ms delay.

### Staggered Fade-In
```css
@keyframes field-appear {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
```html
<!-- Each field row gets an increasing delay -->
<div style="animation: field-appear 0.3s ease-out forwards; animation-delay: 0ms; opacity: 0">
  <span class="text-gray-500">Full Name</span>
  <span class="font-semibold text-gray-900">Ahmad bin Hassan</span>
</div>
<div style="animation: field-appear 0.3s ease-out forwards; animation-delay: 60ms; opacity: 0">
  <span class="text-gray-500">Amount</span>
  <span class="font-semibold text-gray-900">RM 100.00</span>
</div>
<div style="animation: field-appear 0.3s ease-out forwards; animation-delay: 120ms; opacity: 0">
  <span class="text-gray-500">Purpose</span>
  <span class="font-semibold text-gray-900">Rent</span>
</div>
```

React implementation with Tailwind:
```tsx
{template?.fields.map((f, i) => (
  <div
    key={f.name}
    className="flex justify-between items-center border-b border-gray-100 pb-3"
    style={{
      animation: "field-appear 0.3s ease-out forwards",
      animationDelay: `${i * 60}ms`,
      opacity: 0,
    }}
  >
    ...
  </div>
))}
```

### Confidence Indicators
| Confidence | Visual |
|-----------|--------|
| ≥ 0.8 | Green check: `text-emerald-500` + `✓` prefix |
| 0.5–0.79 | Yellow warning: `text-amber-500` + `⚠` prefix |
| < 0.5 | Red missing: `text-red-400` + dashed border |
| null | Gray dash: `text-gray-300` "—" |

```html
<!-- High confidence -->
<span class="text-emerald-600 font-semibold">✓ Ahmad bin Hassan</span>

<!-- Low confidence -->
<span class="text-amber-500 font-medium">⚠ Ahmad (uncertain)</span>

<!-- Missing required field -->
<div class="border-b-2 border-dashed border-red-300 pb-3">
  <span class="text-red-400">— Required</span>
</div>
```

---

## 5. Confirm / Review Screen

### Layout
Card-based, clear visual hierarchy. Field labels left-aligned in gray, values right-aligned in bold.

```html
<div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
  <!-- Header -->
  <div class="flex items-center justify-between mb-5">
    <h2 class="text-lg font-bold text-gray-900">📋 Review Your Details</h2>
    <span class="text-xs bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 font-medium">
      92% confidence
    </span>
  </div>

  <!-- Field rows -->
  <div class="divide-y divide-gray-100">
    <div class="flex justify-between items-center py-3">
      <div>
        <span class="text-sm text-gray-500">Full Name</span>
        <span class="text-red-400 text-xs ml-1">*</span>
      </div>
      <span class="font-semibold text-gray-900">Ahmad bin Hassan</span>
    </div>
    <!-- ... more fields ... -->
  </div>
</div>
```

### Edit Capability
Tap any field value to re-speak just that field. Show a small mic icon on hover/tap:

```html
<button class="group flex items-center gap-2 hover:bg-blue-50 rounded-lg px-2 py-1 -mr-2 transition-colors">
  <span class="font-semibold text-gray-900">Ahmad bin Hassan</span>
  <svg class="w-4 h-4 text-gray-300 group-hover:text-[#0066FF] transition-colors">
    <!-- small mic icon -->
  </svg>
</button>
```

### Action Buttons
Three-button layout, primary action most prominent:

```html
<div class="flex flex-col sm:flex-row gap-3 mt-6">
  <button class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3.5 font-semibold text-base shadow-sm shadow-emerald-500/20 transition-all">
    ✓ Submit
  </button>
  <button class="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl py-3.5 font-semibold text-base transition-all">
    🎙️ Speak Again
  </button>
  <button class="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl py-3.5 px-5 font-medium text-base transition-all">
    Start Over
  </button>
</div>
```

---

## 6. Success State

### Animated Checkmark (recommended)
SVG checkmark that draws itself, then a subtle scale bounce.

```css
@keyframes check-draw {
  0% { stroke-dashoffset: 50; }
  100% { stroke-dashoffset: 0; }
}
@keyframes check-circle {
  0% { stroke-dashoffset: 166; }
  100% { stroke-dashoffset: 0; }
}
@keyframes check-bounce {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
```
```html
<div class="flex flex-col items-center py-12" style="animation: check-bounce 0.5s ease-out">
  <svg class="w-20 h-20 text-emerald-500" viewBox="0 0 52 52">
    <circle cx="26" cy="26" r="25" fill="none" stroke="currentColor" stroke-width="2"
      style="stroke-dasharray: 166; animation: check-circle 0.6s ease-out forwards" />
    <path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"
      d="M14 27l7 7 16-16"
      style="stroke-dasharray: 50; animation: check-draw 0.3s ease-out 0.4s forwards; stroke-dashoffset: 50" />
  </svg>
  <p class="text-xl font-bold text-gray-900 mt-4">Form submitted!</p>
  <p class="text-sm text-gray-500 mt-1">Your details have been saved</p>
</div>
```

### No Confetti
Confetti is fun but inappropriate for a financial inclusion app targeting underserved users. Keep it clean and reassuring. The animated checkmark provides enough delight.

---

## 7. Mobile-First Voice UX

### Mic Button Placement
- **Idle/Home**: Centered vertically, large (w-28 h-28)
- **Listening**: Shrink to bottom-center as a floating action button so transcript has room above

```html
<!-- Floating mic during listening (mobile) -->
<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 sm:relative sm:bottom-auto sm:left-auto sm:translate-x-0">
  <button class="w-16 h-16 rounded-full bg-red-500 shadow-xl shadow-red-500/30 flex items-center justify-center">
    <!-- stop icon -->
  </button>
</div>
```

### One-Handed Operation
- All primary actions reachable in the bottom 40% of screen
- "Done Speaking" button is full-width, large tap target: `py-4 text-base`
- No small buttons or links in the top corners during voice flow
- Minimum tap target: 44×44px (WCAG)

### Layout Priorities by Viewport

| Element | Mobile (< 640px) | Desktop (≥ 640px) |
|---------|-------------------|---------------------|
| Mic button | Bottom-center floating | Inline centered |
| Field list | Horizontal scroll chips | Flex wrap |
| Transcript | Full width, min-h-[120px] | max-w-2xl centered |
| Action buttons | Stacked vertical | Horizontal row |
| Waveform | h-12 | h-16 |

### Responsive Button Stack
```html
<div class="flex flex-col sm:flex-row gap-3">
  <button class="w-full sm:flex-1 py-4 sm:py-3 text-base font-semibold rounded-xl ...">
    ✓ Done Speaking
  </button>
  <button class="w-full sm:w-auto py-4 sm:py-3 px-6 text-base font-semibold rounded-xl ...">
    Cancel
  </button>
</div>
```

---

## All CSS Keyframes (copy to index.css)

```css
/* Mic idle pulse */
@keyframes mic-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 102, 255, 0.4); }
  50% { box-shadow: 0 0 0 24px rgba(0, 102, 255, 0); }
}

/* Ripple rings for listening */
@keyframes ripple {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2.5); opacity: 0; }
}

/* Equalizer bars */
@keyframes eq-bar {
  0%, 100% { height: 8px; }
  50% { height: var(--max-h, 32px); }
}

/* Orb breathing (alternative) */
@keyframes orb-breathe {
  0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(0,102,255,0.3); }
  50% { transform: scale(1.08); box-shadow: 0 0 30px rgba(0,102,255,0.5); }
}

/* Content fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Content slide up */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Field row staggered appear */
@keyframes field-appear {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Error shake */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

/* Thinking dots */
@keyframes bounce-dot {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
}

/* Success checkmark */
@keyframes check-draw {
  0% { stroke-dashoffset: 50; }
  100% { stroke-dashoffset: 0; }
}
@keyframes check-circle {
  0% { stroke-dashoffset: 166; }
  100% { stroke-dashoffset: 0; }
}
@keyframes check-bounce {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

/* Blinking cursor */
@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Utility classes */
.mic-pulse { animation: mic-pulse 2s ease-in-out infinite; }
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
.animate-slideUp { animation: slideUp 0.4s ease-out; }
.animate-shake { animation: shake 0.4s ease-in-out; }
```

---

## Color Palette Reference

| Role | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| Primary | #0066FF | `bg-[#0066FF]` | Mic button, links, focus rings |
| Primary hover | #0052CC | `bg-[#0052CC]` | Button hover states |
| Success | emerald-500 | `bg-emerald-500` | Submit, checkmarks, high confidence |
| Danger | red-500 | `bg-red-500` | Recording indicator, errors, cancel |
| Warning | amber-500 | `text-amber-500` | Low confidence fields |
| Text primary | gray-900 | `text-gray-900` | Headings, field values |
| Text secondary | gray-500 | `text-gray-500` | Labels, descriptions |
| Text muted | gray-400 | `text-gray-400` | Placeholders, hints |
| Surface | white | `bg-white` | Cards, inputs |
| Border | gray-200 | `border-gray-200` | Card borders, dividers |

---

*Research sources: ChatGPT voice mode unified interface design, Apple Siri iOS 27 Dynamic Island glow, Google Gemini rounded overlay with gradient border, voice banking UX patterns for financial inclusion, CSS audio wave visualizer techniques, staggered animation patterns.*
