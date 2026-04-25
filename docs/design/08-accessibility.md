# 8. Accessibility

---

## Color Contrast

All text/background combinations meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text).

| Combination | Ratio | Grade |
|-------------|-------|-------|
| `#1E293B` on `#FFFFFF` (text-primary on white) | 13.5:1 | AAA |
| `#64748B` on `#FFFFFF` (text-secondary on white) | 5.0:1 | AA |
| `#94A3B8` on `#FFFFFF` (text-tertiary on white) | 3.3:1 | AA Large only |
| `#FFFFFF` on `#0066FF` (white on primary) | 5.1:1 | AA |
| `#FFFFFF` on `#0052CC` (white on primary-hover) | 6.3:1 | AA |
| `#DC2626` on `#FEF2F2` (error text on error bg) | 5.7:1 | AA |
| `#059669` on `#ECFDF5` (success text on success bg) | 4.6:1 | AA |

### Tertiary Text Caveat

`#94A3B8` on white is 3.3:1 — passes for large text (18px+) but not normal text. Use only for:
- Captions and timestamps (supplementary info)
- Placeholders (not the only way to convey info)
- Always pair with a higher-contrast label nearby

---

## Focus Indicators

Defined globally in `index.css`:

```css
button:focus-visible, select:focus-visible, input:focus-visible {
  outline: 2px solid #0066FF;
  outline-offset: 2px;
}
```

- Uses `:focus-visible` (not `:focus`) so mouse clicks don't show the ring
- Blue outline matches the primary brand color
- 2px offset prevents the outline from overlapping content
- Applies to all interactive elements: buttons, selects, inputs

---

## Touch Targets

| Element | Size | Meets 44×44px? |
|---------|------|----------------|
| Mic button | 128×128px | ✅ Yes |
| Nav links | ~48px height (py-3 + text) | ✅ Yes |
| Action buttons | py-3 = 12px padding + ~20px text = ~44px | ✅ Yes |
| Table rows | p-3 = 12px padding per cell | ⚠️ Rows are not tappable (no click handler) |
| Language select | py-1 = 4px + text ≈ 28px | ⚠️ Small — browser native select handles this |
| Badge links | Not interactive | N/A |

### Recommendations
- All tappable buttons should have minimum `py-3` (44px total height)
- On mobile, button rows stack vertically (`flex-col`) giving each button full width
- The mic button at 128px is intentionally oversized for easy thumb targeting

---

## Screen Reader Considerations

### Current State
- Semantic HTML: `<nav>`, `<main>`, `<button>`, `<table>`, `<thead>`, `<tbody>`
- Buttons have visible text labels (emoji + text)
- Form inputs have placeholder text (not ideal — should use `<label>`)
- Table has `<th>` headers

### Recommendations for Enhancement
- Add `aria-label` to the mic button: `aria-label="Start voice recording"`
- Add `aria-live="polite"` to the transcript area so screen readers announce new text
- Add `aria-live="assertive"` to error alerts
- Add `role="status"` to the spinner with `aria-label="Processing"`
- Add `<label>` elements for the text input fallback (currently placeholder-only)
- Add `aria-current="page"` to the active nav link
- The language select should have an `aria-label="Select language"`

### Voice UI Accessibility
- TTS readback serves as an audio accessibility feature — users who can't read the screen hear their data
- The text input fallback in listening mode serves users who can't use speech recognition
- All extracted fields are displayed as text (not just spoken) for visual confirmation

---

## Reduced Motion

Add to `index.css` for users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  .mic-pulse { animation: none; }
  .animate-fadeIn { animation: none; }
  .animate-slideUp { animation: none; }
  .hover-lift:hover { transform: none; }
  button, a, select, input { transition: none; }
}
```

This disables all custom animations while keeping the UI fully functional.

---

## Keyboard Navigation

- Tab order follows DOM order (nav → content → buttons)
- All interactive elements are `<button>` or `<select>` (natively focusable)
- No keyboard traps — all modals/sheets should have escape-to-close (none currently exist)
- The voice recording can only be started via button click (no keyboard shortcut yet)

### Recommended Keyboard Shortcuts (future)
- `Space` or `Enter` on mic button to start/stop recording
- `Escape` to cancel recording
- `Enter` on confirm to submit
