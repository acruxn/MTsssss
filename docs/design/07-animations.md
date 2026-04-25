# 7. Animations & Micro-interactions

All animations are defined in `index.css` and applied via Tailwind utility classes or inline styles.

---

## CSS Keyframes (in index.css)

### mic-pulse
```css
@keyframes mic-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 102, 255, 0.4); }
  50% { box-shadow: 0 0 0 24px rgba(0, 102, 255, 0); }
}
.mic-pulse { animation: mic-pulse 2s ease-in-out infinite; }
```
Usage: idle mic button. Concentric blue ring expanding and fading.

### fadeIn
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
```
Usage: phase transitions in VoiceAssistant. Each phase block fades in from below.

### slideUp
```css
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slideUp { animation: slideUp 0.4s ease-out; }
```
Usage: available for cards or sections that need a more pronounced entrance.

---

## Transition Defaults (in index.css)

```css
button, a, select, input {
  transition: all 0.15s ease;
}
```

All interactive elements have a 150ms base transition. This covers color changes, opacity, and transforms.

---

## Card Hover Lift (in index.css)

```css
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
}
```
Usage: stat cards, template cards. Subtle lift on hover.

---

## Component-Specific Animations

### Mic Button States
| State | Animation |
|-------|-----------|
| Idle | `.mic-pulse` — continuous blue ring pulse |
| Hover | `hover:bg-[#0052CC]` — color darken (150ms) |
| Pressed | `active:scale-95` (add if desired) |
| Listening | Button replaced by waveform — no button animation |

### Waveform Bars (Listening)
- 5 bars with `animate-pulse` (Tailwind built-in, 2s)
- Each bar has staggered `animationDelay: ${i * 0.15}s`
- Random heights between 20-60px for organic feel
- Color: `bg-[#0066FF]`

### Spinner (Extracting/Processing)
- `animate-spin` (Tailwind built-in, 1s linear infinite)
- `border-4 border-[#0066FF] border-t-transparent rounded-full`

### Phase Transitions
- Every phase block wrapped in: `style={{ animation: "fadeIn 0.3s ease-in" }}`
- Content fades in and slides up 8px
- Previous phase content unmounts (React conditional rendering)

### Hero CTA Button
```
hover:shadow-xl hover:scale-105
```
Grows slightly and deepens shadow on hover. 150ms transition.

### Table Row Hover
```
hover:bg-[#F8FAFC]
```
Subtle background tint. Instant via base transition.

### Template Card Hover
```
hover-lift hover:border-[#0066FF]/30
```
Lifts 2px + border tints blue at 30% opacity.

---

## Future Enhancements (not yet implemented)

- **Field fill animation**: extracted fields could animate in one-by-one with staggered fadeIn
- **Success celebration**: confetti or checkmark animation on form submit
- **Skeleton screens**: pulsing gray blocks while data loads (Dashboard stats, template list)
- **TTS visual indicator**: pulsing speaker icon or card border glow during readback
- **Page transitions**: cross-fade between pages using React transition group
