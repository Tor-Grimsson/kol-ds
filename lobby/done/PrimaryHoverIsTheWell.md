---
component: Button (tone="primary") — hover / press
source: kol-theme/kol-components-molecules.css — the primary tone block (`ButtonPrimaryHoverDeeper`, ~line 2008)
staged: 2026-10-10
status: draft
deps: [Button, ControlToneSunken]
---

# PrimaryHoverIsTheWell — primary hover lands on the rail's own colour

## Purpose
kol-fxr, the user's walk 2026-10-09. The labs entry card's rows: *"hover state here should be sunken no?"* The rail's **Randomize all** (`Button tone="primary"`): *"hover state is same color as background??? what is that? ghost?"*

## What happens (measured, dark)
`--kol-tone-hover-bg: rgb(from var(--kol-surface-secondary) calc(r - 8) …)` — rest `--kol-surface-secondary` `#19191d` → hover `#111115`. The rail and the card are `--kol-surface-primary` `#121215`. The hover is one step off the ground it sits on, so the button vanishes on hover. Light has the same shape (rest 242 → 234, next to the page's 250).

## Ask
- Primary hover = `--kol-surface-sunken` (the dark well the sunken control tone already uses). Press = one step past the well.
- Both themes; the rule reads off a token, not arithmetic on the rest fill, so it cannot collide with whichever surface the button sits on.

## Not asked
No prop, no variant. The bump is the adoption on kol-fxr's side.

---

## Resolution — 2026-10-10 · 🟢 closed

**Shipped `@kolkrabbi/kol-theme@0.173.0`.** Measured both themes first: the bug is **dark only**.
Dark rest 25 → hover 17 on an 18 rail — gone on hover, as reported. Light rest 242 → hover 234 on a
250 page — 16 off, visible; and light's well is the white pole (255), so "hover = sunken" there would
have gone LIGHTER, the exact bug ButtonPrimaryHoverDeeper closed.

So: two new per-theme surface tokens in `kol-base-tokens.css` (the sunken token's own precedent —
the themes want different depths), `--kol-surface-secondary-hover` / `-press`. Dark: the well (10)
and one past it (2). Light: unchanged, 234 / 226. The primary tone block reads them — a token, not
arithmetic on the rest fill, in both themes. Measured: light 242 · 234 · 226, dark 25 · 10 · 2.

For fxr: bump kol-theme ^0.173.0; Randomize all on the rail, hovered, in dark.
