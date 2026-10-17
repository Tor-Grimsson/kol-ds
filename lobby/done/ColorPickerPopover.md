---
component: ColorPickerPopover
source: kol-monitor/src/components/atoms/ColorPicker.jsx#L28-L154
staged: 2026-10-17
status: draft
deps: [Input]
---

# ColorPickerPopover

## Purpose
A 16 px colour swatch that opens a portalled picker (saturation field, hue, alpha) with a hex field under it.
kol-component has swatches, ramps and a harmony wheel, but no picker you click a colour into. Monitor's copy
is the only one in the estate; its review page is monitor's Dev tab → Color picker (`pnpm dev`, `/dev`).

## Anatomy
- wrapper `relative`
  - swatch 16×16 (radius 4, 1px `--kol-border-default`, the colour as its ground; none → a red 45° slash)
  - popover (portal to `body`, `position: fixed`, right-aligned to the swatch, 4px gap)
    - `RgbaColorPicker` (react-colorful) 180×180
    - `Input size="sm" width="180px"` — the hex, 6 or 8 digits

## Variants
None (single form). The popover flips up when under 260 px is free below the swatch.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| color | string | — | `#rrggbb`, `#rrggbbaa`, `transparent` (none) or `currentColor` (resolved against the theme) |
| onChange | (hex) => void | — | every drag and every valid hex entry |
| defaultValue | string | — | ⌥-click on the swatch resets to it |
| className | string | '' | wrapper |

## Styling
- Inline swatch styles (16px, radius 4px, `var(--kol-border-default)` border), `#e74c3c` slash for none.
- Injected `<style>` sizing react-colorful: `.react-colorful` 180×180 radius 4; pointer 14 px, border 2 px.
- **Drop on recreation:** the hardcoded `#e74c3c` (a KOL danger token), the inline `<style>` (a theme rule),
  `zIndex: 9999` (the KOL's overlay layer), and the MutationObserver on `data-theme` (the KOL has a theme hook).

## States & interactions
- click swatch: open/close · outside mousedown: close · ⌥-click: reset to `defaultValue`
- none (`transparent`/empty): slashed swatch · alpha < 1: swatch shows the rgba
- No keyboard path today (no focus, no Esc) — the recreation should add both.

## Dependencies
`react-colorful` (`RgbaColorPicker`), kol-component `atoms/Input`. Local hex/rgba helpers (lines 8–26) the KOL
may already have in its colour utilities.

## Recreation notes
A molecule. Popover placement belongs to whatever the KOL's Dropdown/Tooltip already use, not hand-rolled
`fixed` maths. Swatch size as a prop (`size="xs|sm"`). Once it ships, monitor retires its atom and the Dev tab
row swaps to the KOL's.

## ✅ RESOLUTION — 2026-10-17 · kol-component@0.264.0

`ColorPickerPopover` (organisms/ — it composes the `SpectrumControls` organism): swatch `size` xs 16 · sm 24 with the 1px `--kol-border-default` ring; click opens saturation square 180×140, hue strip, the new `AlphaStrip`, hex `Input`. Uppercase hex out, 8 digits only under 100% opacity; the hex field emits at 6 or 8 digits. Placement is `usePopover` (`bottom-end`, flips up) — no fixed maths, no z-index 9999; Esc / outside press close, Enter opens from the keyboard; ⌥-click resets to `defaultValue` without opening. None is `ColorSwatch showTransparent` in `--ui-error` (no #e74c3c); `currentColor` / tokens paint live and resolve once on open via `resolveCssColor` — no MutationObserver, no injected `<style>`, no react-colorful. Verified in a harness, dark and light: 16px swatch, panel 4px under and right-aligned, drag / alpha / hex 6 + 8 emit, Esc + outside close, ⌥-click reset, flip up at the viewport foot, currentColor → FAFAFA / 121215.

**Remainder here:** none — kol-monitor bump kol-component@0.264.0; retire src/components/atoms/ColorPicker.jsx for `ColorPickerPopover` (same color / onChange / defaultValue; uppercase hex) and swap the Dev tab row.

