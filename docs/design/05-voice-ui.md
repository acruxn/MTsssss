# 5. Voice UI Patterns

Research sources: Siri (waveform orb), Google Assistant (colored dots), ChatGPT Voice (pulsing ring), Wise (clean white space), SE Asian fintech patterns.

---

## Design Philosophy

The voice UI should feel like a **conversation**, not a form. Each phase is a distinct visual state with clear affordances. The mic button is the hero — everything else supports it.

---

## Phase: Idle (Ready to Listen)

**Visual:** Large centered mic button with pulse animation. Field list shown above as context.

```
┌─────────────────────────────┐
│  Fields needed              │
│  [Name] [IC Number] [Phone] │
│                             │
│         ┌─────┐             │
│         │ 🎤  │  ← pulsing  │
│         └─────┘             │
│   Tap to start — tell us    │
│        everything           │
└─────────────────────────────┘
```

- Mic button: `w-32 h-32 rounded-full bg-[#0066FF]` with `.mic-pulse` animation
- Pulse: concentric ring expanding outward, `rgba(0, 102, 255, 0.4)` fading to transparent
- Prompt text: `text-[#64748B] text-sm`
- TTS auto-speaks field names on load

---

## Phase: Listening (Active Recording)

**Visual:** Waveform bars replace the mic button. Live transcript appears below. Text input fallback available.

```
┌─────────────────────────────┐
│  Fields needed              │
│  [Name] [IC Number] [Phone] │
│                             │
│      ||||| ← waveform bars  │
│                             │
│  ┌─ Live Transcription ───┐ │
│  │ My name is Ahmad and   │ │
│  │ my IC number is...     │ │
│  └────────────────────────┘ │
│  [Or type here instead...]  │
│                             │
│  [✓ Done Speaking] [Cancel] │
└─────────────────────────────┘
```

- Waveform: 5 vertical bars, `w-2 rounded-full bg-[#0066FF] animate-pulse`
- Each bar has random height (20-60px) and staggered `animationDelay`
- Container: `h-12 sm:h-16`
- Transcript box: `bg-white border border-[#E2E8F0] rounded-lg p-4 min-h-[80px]`
- Transcript label: `text-xs text-[#94A3B8] mb-1` → "Live Transcription"
- Transcript text: `text-lg text-[#1E293B]`
- Placeholder when empty: `text-[#94A3B8]` → "Listening..."
- Text input fallback: standard input style, `text-xs text-[#94A3B8]` hint below

---

## Phase: Extracting (AI Processing)

**Visual:** Centered spinner with status text. Clean, minimal.

```
┌─────────────────────────────┐
│                             │
│           ◌  ← spinner      │
│   Extracting fields with AI │
│                             │
└─────────────────────────────┘
```

- Spinner: `w-12 h-12 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin`
- Text: `text-[#64748B]`
- Padding: `py-16` for vertical centering feel

---

## Phase: Confirm (Review Extracted Fields)

**Visual:** Card showing extracted field values as a key-value list. Action buttons below.

```
┌─────────────────────────────┐
│ ℹ️ Matched: Fund Transfer   │  ← only if detect-intent flow
│                             │
│ ┌─ 📋 Extracted Fields ──┐ │
│ │                  85% ◉  │ │  ← confidence badge
│ │ Name ........... Ahmad  │ │
│ │ IC Number .. 900101-14  │ │
│ │ Phone * ........... —   │ │  ← missing = yellow
│ └────────────────────────┘ │
│                             │
│ [✓ Submit]                  │
│ [🔊 Read Back]              │
│ [🎙️ Speak Again]            │
│ [Start Over]                │
└─────────────────────────────┘
```

- Matched banner: `bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-[#0066FF]`
- Card: `bg-white border border-[#E2E8F0] rounded-xl p-6`
- Field row: `flex justify-between items-center border-b pb-2 border-[#E2E8F0]`
- Field label: `text-sm text-[#64748B]`
- Required marker: `text-red-400 ml-1` → "*"
- Field value (filled): `font-medium text-[#1E293B]`
- Field value (missing + required): `text-yellow-500 font-medium` → "—"
- Field value (missing + optional): `text-[#94A3B8]` → "—"
- Buttons stack on mobile: `flex flex-col sm:flex-row gap-3`
- TTS auto-reads extracted values on phase enter

---

## Phase: Done (Success)

**Visual:** Centered success icon with action buttons.

```
┌─────────────────────────────┐
│                             │
│            ✅               │
│  Form submitted             │
│     successfully!           │
│                             │
│  [Fill Another] [Dashboard] │
└─────────────────────────────┘
```

- Icon: `text-5xl` emoji
- Text: `text-xl font-semibold text-[#1E293B]`
- Padding: `py-12`

---

## Home Flow (No Template Pre-selected)

Same phases but starts with a "What would you like to do?" prompt instead of field list. The detect-intent API identifies the template automatically.

- Idle: larger prompt text, no field list, same mic button
- Listening: same waveform + transcript, no field list
- Extracting: "Detecting intent & extracting fields..."
- Confirm: shows matched template name banner + extracted fields

---

## TTS Visual Feedback

When TTS is speaking (readback, prompt):
- No dedicated visual indicator in current implementation
- Future enhancement: subtle pulsing border on the card being read, or a small speaker icon animation
- `stopSpeaking()` is called on any user action (start listening, cancel, reset)

---

## Mobile Considerations

- Mic button stays 128×128 on all sizes — large enough for thumb tap
- Waveform bars shorter on mobile: `h-12 sm:h-16`
- Buttons stack vertically on mobile: `flex-col sm:flex-row`
- Transcript box has `min-h-[80px]` so it doesn't collapse
- Page padding reduces: `px-4 py-6 sm:p-8`
