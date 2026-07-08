---
"@kolkrabbi/kol-component": minor
"@kolkrabbi/kol-theme": minor
---

`SegmentedToggle` sizes now mirror `Button` exactly. Each size shares the matching `.kol-btn-{sm,md,lg}` cell padding and mono type, so a segmented strip lines up with a Button of the same size:

- `sm` — 26px, mono-12 (was 16px with no type — the old icon-only variant)
- `md` — 32px, mono-14 (was 26px, mono-12 — the wrong-looking text)
- `lg` — 40px, mono-16 (new)

The fixed-height model is replaced by padding-driven height in kol-theme (`.kol-seg` hugs content; `.kol-seg--sm/--lg` set cell padding). Existing `sm`/`md` consumers will see the taller, correctly-typed sizes.
