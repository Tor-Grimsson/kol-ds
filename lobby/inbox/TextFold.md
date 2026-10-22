---
component: TextFold
source: kol-branding/src/hub/Fold.jsx#L1-L29
staged: 2026-10-22
status: draft
deps: [Button]
---

# TextFold

## Purpose
Long prose folds to a few lines on phones, with a More / Less toggle; md and up shows it whole. User (2026-10-22): *"more text folding, on mobile text heavy blocks are not always relevant but good to know more information is there if you want it, just a general point."* Used in kol-branding on research answers, findings and summaries.

## Anatomy
```
div (flex col, items-start, gap-1)
├── text element (as=p|div) — line-clamped below md while closed
└── Button "More" / "Less" — only when the text is actually cut, hidden md+
```

## Variants
- `lines`: 2 · 3 · 4 · 6.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `lines` | 2\|3\|4\|6 | 4 | lines shown while folded |
| `as` | element | `div` | the text element |
| `className` | string | — | the text's own type classes |
| `children` | node | — | the text |

## Styling
- Clamp: `max-md:line-clamp-{n}` (literal class map — runtime-built classes are never emitted).
- Toggle: `Button tone="ghost" size="sm" className="md:hidden"`.
- Measured with a ResizeObserver: `scrollHeight > clientHeight + 1` decides whether the toggle shows.

## States & interactions
- Folded (phone, cut) → More. Open → Less. Text that fits shows no toggle. md+ never folds.

## Dependencies
`Button`.

## Recreation notes
- Atom/molecule. The breakpoint could be a prop (`below="md"`). Labels authored at the call site if the DS prefers (`moreLabel`, `lessLabel`), no auto-casing.
