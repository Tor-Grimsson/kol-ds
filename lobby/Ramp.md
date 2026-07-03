---
component: Ramp
source: kol-monorepo/apps/brand/src/components/styleguide/Ramp.jsx#L1-L16
date: 2026-07-03
status: draft
deps: [ColorSwatch]
---

# Ramp

## Purpose
A single color-ramp row for the styleguide: a stop-name label above a horizontal
run of swatch chips, driven by **explicit `[stopName, hex]` pairs** (the static
counterpart to `ColorRamp`, which reads live CSS vars). Part of the color-specimen kit.

## Anatomy
```
div.mb-8
├─ h4               (ramp name label)
└─ div.kol-ramp-chips
   └─ Swatch × N     (chip + name/hex meta)   ← local Swatch, drop for DS ColorSwatch
```

## Variants
None (single form).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| name | string | — | ramp label text |
| stops | Array<[stopName: string, hex: string]> | — | the chips; each entry = one swatch |

## Styling
- Label: `kol-helper-12 uppercase tracking-widest text-body m-0 mb-2`.
- Chip row: `.kol-ramp-chips` (app CSS `kol-framework.css:278`) = `display:grid; grid-template-columns:repeat(auto-fit,minmax(100px,1fr)); gap:4px`.
- Swatch chip (local `Swatch.jsx`): `.kol-swatch-chip` with `border border-fg-08`, `background:{hex}` inline; anchor dot = 10×10 white circle, `mix-blend-mode:difference`.
- Swatch meta: `.kol-swatch-meta kol-helper-10` → name `text-meta`, hex `text-strong font-semibold` (hex upppercased in JS).
- **DROP:** the `uppercase` utility on the label (author casing at the call site — no auto text-transform); the local `Swatch` component (a `ColorSwatch` dup — recreate composing the DS atom).

## States & interactions
Static — no hover/active/focus.

## Dependencies
- Local `Swatch` (styleguide) → **replace with DS `ColorSwatch`** + a small name/hex meta line.

## Recreation notes
Tier: **molecule** (`RampRow` / keep `Ramp`). Compose DS `ColorSwatch` for each chip rather than the forked `Swatch`. This is the *static-hex* input variant; `ColorRamp` is the *live-CSS-var* variant and `SpectrumGrid` the *matrix* — at recreation, all three should sit on one shared swatch-chip primitive. Label casing authored at the call site (drop `uppercase`).
