# FormBuddy Design System

Comprehensive design specification for the FormBuddy frontend rewrite.
Every value is an exact Tailwind class or CSS value — no ambiguity.

## Design Files

| File | Contents |
|------|----------|
| [design/01-colors.md](design/01-colors.md) | Color system — hex codes, Tailwind mappings, gradients |
| [design/02-typography.md](design/02-typography.md) | Font family, scale, weights, line heights |
| [design/03-spacing-layout.md](design/03-spacing-layout.md) | Page layout, grid, breakpoints, spacing tokens |
| [design/04-components.md](design/04-components.md) | Every component with exact Tailwind className strings |
| [design/05-voice-ui.md](design/05-voice-ui.md) | Voice interaction visual patterns |
| [design/06-pages.md](design/06-pages.md) | Page-by-page wireframes (text-based) |
| [design/07-animations.md](design/07-animations.md) | Animations, transitions, micro-interactions |
| [design/08-accessibility.md](design/08-accessibility.md) | Contrast, focus, touch targets, screen readers |

## Design Principles

Inspired by Wise's design system, TNG eWallet's brand, and SE Asian fintech patterns (GrabPay, GCash):

1. **White space is a feature** — white is the dominant color. Let screens breathe.
2. **Blue means trust** — TNG's #0066FF is the primary. Use sparingly for CTAs and active states.
3. **One action per screen** — the mic button is always the hero. Don't compete with it.
4. **Mobile-first** — 80% of Malaysian eWallet users are on mobile. Design for 375px, scale up.
5. **Multilingual-ready** — Tamil and Chinese text can be wider/taller. Don't hardcode widths.

## Current State

The app already uses this system partially (Layout, Dashboard, FormTemplates are styled). VoiceAssistant was restyled to match. This spec codifies and extends what exists.

## Font

Inter (already loaded via Google Fonts in index.html).
