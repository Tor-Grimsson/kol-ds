---
component: SegmentedToggle (filled variant + stateless mode)
source: kol-fxr — inspector alignment strips, transform cluster, resizing toggle
staged: 2026-08-12
status: draft
deps: [SegmentedToggle]
---

# SegmentedFilledVariant — filled tiles; outline ring = selected only; stateless mode

## Purpose
The user's segmented state law (2026-08-12): every cell is a **filled tile** (the input's surface tone, hairline gaps) — never an outline shell around the group; the **outlined treatment marks ONLY the selected cell**; and one-shot ACTION strips (canvas alignment, transform cluster) are stateless — no cell ever reads selected. The shipped `.kol-seg` chrome is the inverse (outer stroke shell, filled-active) and has no variant.

## Current behaviour
- `SegmentedToggle` renders one chrome: `.kol-seg` shared outer border + dividers, active cell fills.
- No stateless mode — `value` always implies one active cell semantics (radiogroup).

## Ask
- `variant="filled"`: cells `--kol-surface-secondary` tiles, 1px transparent gaps, group rounded; selected = inset 1px ring (`--kol-fg-24`-ish) + text-emphasis; unselected text-meta.
- Stateless mode (`value={null}` or an `actions` flag): role `group`, no aria-checked, no selected styling — pure action strip.
- Icon labels already work (labels take nodes) — keep.

## Recreation notes
kol-fxr ships a DECLARED STOPGAP twin (`src/editor/components/SegBar.jsx`) matching this spec exactly — it exists only because the variant doesn't, and it is deleted the day this ships (the anti-drift law is why this ticket exists).

---

## Resolution (2026-08-12) — 🟢 closed

Shipped in **@kolkrabbi/kol-component@0.36.0 + @kolkrabbi/kol-theme@0.36.0**
(registry-verified). `variant="filled"` — `.kol-seg--filled` in kol-theme:
every cell a `--kol-surface-secondary` tile, 1px transparent gaps, no outer
shell, group radius clips the corners; the SELECTED cell alone takes the inset
1px `--kol-fg-24` ring + text-emphasis. Stateless mode ships as `value={null |
undefined}`: role `group`, plain buttons (no aria-checked, no is-active),
arrows inert, onClick = the action dispatch. Adoption is kol-fxr's: delete
`SegBar.jsx` (the declared stopgap twin) and swap the inspector strips.
