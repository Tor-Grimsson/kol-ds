---
component: colorMath
source: kol-ds-fxr/src/editor/modes/palette/colorMath.js#L1-L242
date: 2026-07-10
status: shipped
deps: []
shipped_to: packages/component/src/hooks/colorMath.js
---

# colorMath

Bucket C port — the color ENGINE the DS lacked. Shipped into `@kolkrabbi/kol-component`, barrel-exported. Plain functions (not a hook); lives in `src/hooks/` because that is the taxonomy's only non-component folder — same rationale as the existing `hooks/cssVar.js`.

## Purpose
HSL/hex conversion + harmony generation for the KOL color pickers (SpectrumControls, PaletteHarmonyWheel).

## Exports
| export | signature | notes |
|--------|-----------|-------|
| `hexToHsl` | `(hex) → {h,s,l}` | h 0–360, s/l 0–100 |
| `hslToHex` | `(h,s,l) → '#RRGGBB'` | normalizes hue first (fixes the source's h=360 edge) |
| `rgbToHex` | `(r,g,b) → '#RRGGBB'` | clamped 0–255; shared with useEyedropper |
| `normHue` | `(h) → [0,360)` | |
| `HARMONIES` | `[{id,label,roleOffsets}]` | 5 schemes: analogous / complementary / split / triadic / tetradic |
| `harmonyById` | `(id\|obj) → obj` | accepts an id string or a harmony object |
| `harmonyColors` | `(hue, harmony, {saturation,lightness}) → hex[]` | **deterministic** role colors from a hue — drives the wheel |
| `generateHarmony` | `(baseHex, harmony) → hex[]` | deterministic, S/L taken from the hex |
| `SEED_MODE_IDS` | `string[]` | random / monochromatic / analogous / complementary / triadic / doubleComplementary |
| `seedHarmony` | `(baseHex, mode) → hex[6]` | **jittered** seed variants — slot 0 = base, 1–5 derived |

## What changed vs source (the DIFF / scope)
- **Ported:** the HSL engine (`hexToHsl`/`hslToHex`), the deterministic harmony math, and the `SEED_MODES` (renamed to `seedHarmony` + `SEED_MODE_IDS`). Added `rgbToHex` (was in the source's `cssVar.js`) so this module is the single source of the hex formatter, `normHue`, and the deterministic `harmonyColors`/`generateHarmony` split (the source only had jittered seeds + the wheel's inline offsets).
- **HARMONIES + `norm` pulled up** from the wheel's inline definition so the wheel and the generators share one scheme table.
- **Dropped (editor-only, not requested):** the pool-based `MODES` and `generatePalette` / `pickBgColor` / `pickBgFromSeed`. Those depend on the editor's pool + per-slot lock + background-slot concepts, which don't belong in a DS support module. The task scoped this to "generateHarmony, seed modes" — both shipped.
- **Not duplicated:** the DS already has `hooks/cssVar.js` (`resolveCssVar`/`resolveCssColor`/`isLight`) — the source's `cssVar.js` resolvers were NOT re-ported; only its `rgbToHex` moved here.

## Dependencies
None. Pure functions.
