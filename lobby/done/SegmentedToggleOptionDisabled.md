---
component: SegmentedToggle
source: kol-fxr/src/editor/morph/MorphTab.jsx#L41-L72
staged: 2026-10-09
status: draft
deps: [SegmentedToggle, Tooltip]
---

# SegmentedToggle — per-option `disabled`

## Purpose
A cell that cannot be chosen right now, drawn as such. `SegmentedToggle` options take `{ value, label, ariaLabel, tooltip }` only (kol-component 0.244.0); a consumer that needs a greyed cell fakes it. kol-fxr's Morph rail does exactly that for its mode strip — Shape · Blend · Crossfade — where a mode is unavailable for the steps on stage (Blend across different generators; Shape/Crossfade on a GL engine with no outline).

## Anatomy
Unchanged — one cell gains a state:
```
SegmentedToggle (radiogroup)
└─ cell (radio) · label · [tooltip]
   └─ + disabled: aria-disabled, dimmed ink, no hover lift, press refused, skipped by ←/→
```

## Variants
None — a state on the existing cell, every size and the `filled` variant alike.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `options[].disabled` | `boolean` | `false` | the cell draws disabled and refuses selection |
| `options[].tooltip` | `string` | — | already exists — the reason, shown on the disabled cell too |

## Styling
- What fxr fakes today: `label: <span className="opacity-40">Blend</span>` + `tooltip: <reason>` + an `onChange` that returns early for the blocked value.
- What the DS cell should draw: the disabled ink the control family already uses (`kol-btn`'s disabled state — `--kol-fg-24`-class ink, no hover lift), on `.kol-seg-cell[aria-disabled="true"]` in kol-theme. No opacity hack — opacity dims the divider too.
- **Drop on recreation:** fxr's `dim()` wrapper and the `onChange` guard.

## States & interactions
- disabled: dimmed label, `aria-disabled="true"`, `cursor: default`, no hover, click/Enter/Space ignored, roving tabindex skips it (←/→ step over), tooltip still shows the reason.
- A disabled cell can still be the *current* `value` (the steps changed under it) — draw selected + disabled, don't throw.

## Dependencies
`Tooltip` (already on the option), kol-theme `.kol-seg*`.

## Recreation notes
Atom change in `SegmentedToggle.jsx` + one rule in kol-theme's seg sheet. Minor bump of kol-component + kol-theme together. On the return fxr deletes `dim()` and the guard in `MorphTab.jsx` and passes `disabled: !!blocked[v]`.

---

## Resolution — 2026-10-09 · 🟢 closed

**Shipped `@kolkrabbi/kol-component@0.245.0` + `@kolkrabbi/kol-theme@0.169.0`.** `options[].disabled`:
the cell takes `aria-disabled="true"` (not the attribute — the `tooltip` still gives the reason on
hover), refuses the press, and ←/→ step over it in both directions; it may still be the current
`value` (selected + disabled, no throw). Ink in kol-theme on `.kol-seg-cell[aria-disabled="true"]`:
`--kol-oq-24` (one rung under the `oq-48` rest, the family's opaque ladder), no hover lift,
`cursor: default`; the fill and the divider stay, which is why it is ink and not opacity. Every
variant and size alike.

Walked: Map disabled beside Grid · List · Feed — click refused (Grid stays), Feed → ArrowRight
lands on Grid, ArrowLeft back on Feed, the tooltip reads the reason, ink measured one rung under
rest. Preview updated with a disabled cell.

For fxr: bump both, delete `dim()` and the `onChange` guard in `MorphTab.jsx`, pass
`disabled: !!blocked[v]`.
