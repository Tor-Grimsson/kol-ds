---
component: ColorSwatch
source: kol-fxr — inspector Fill/Stroke paint rows (Figma model)
staged: 2026-08-12
status: draft
deps: [ColorSwatch, Input]
---

# ColorSwatchFieldSizing — the paint-row swatch: 4px radius, input-height, corner prop

## Purpose
The Figma paint bar is ONE container: [swatch][hex][%]. The swatch inside it needs to sit flush with the input chrome — same height as the sm input row (26px), **4px corner radius by default**, and a `corner` prop so square-corner contexts can opt out.

## Current behaviour
- `ColorSwatch` renders at its own sizes (24/32/…) with `rounded-[2px]`-ish chrome; no radius prop.
- Consumers (kol-fxr's inspector paint rows) place it BESIDE the hex input — two boxes where Figma has one.

## Ask
- `radius` (or `corner`) prop: default 4px, `0`/`none` accepted.
- A size that matches `kol-control-sm` row height exactly (26) so swatch + hex read as one bar.
- Stretch (your call): an `Input`-side affordance slot that accepts the swatch INSIDE the shell — that's the actual Figma anatomy ([swatch] FFFFFF · one container). If that ships, kol-fxr adopts it for every paint row.

## Recreation notes
kol-fxr currently renders swatch + hex adjacent with a 2px-radius swatch — close, not the anatomy. No shim possible (swatch chrome is the DS's).

---

## Resolution (2026-08-12) — 🟢 closed

Shipped in **@kolkrabbi/kol-component@0.35.0** (registry-verified). Radius
default flipped `tight` → `sm` (4px — the system radius law; opt-out via the
existing `radius` prop's `tight`/`none`); named size `'control-sm'` (26px, the
kol-control-sm row height); and the stretch shipped: `slotLeft` on Input —
arbitrary leading node inside the shell, so [swatch][hex] is ONE container.
Adoption is kol-fxr's: paint rows go `<Input slotLeft={<ColorSwatch
size="control-sm" …/>} chars={6}/>`.
