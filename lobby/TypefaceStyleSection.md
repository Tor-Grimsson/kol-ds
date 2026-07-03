---
component: TypefaceStyleSection
source: kol-monorepo/apps/web/src/routes/foundry/components/TypefaceStyleSection.jsx#L1-L133
date: 2026-07-03
status: draft
deps: [StylesGrid, FoundrySection]
---

# TypefaceStyleSection

## Purpose
The weight / width / italic **style showcase** section: a two-column block with a live specimen preview panel on the left (renders `AaBbCc / 01234567 / {(!@#$?&)}` in the currently hovered/selected style) beside a `StylesGrid` of all available styles on the right. Handles every axis permutation generically from the `typeface.styles` config — weight-only, weight+width, italic variants, or fully static — deciding on its own whether a dropdown is needed and which axis it toggles. One data-driven component replacing the former per-font `FoundryStyleSection*.jsx`.

## Anatomy
- `<section>` — `w-full py-12 lg:py-16`
  - inner — `max-w-[1400px] mx-auto flex flex-col gap-8`
    - `FoundrySection` header — `badgeText`, `icon="foundation"`, `size="sm"`, controlled style/axis dropdown
    - two-column row — `flex flex-row gap-4 md:gap-6 lg:gap-8 items-start w-full`
      - left preview panel — `w-1/2 aspect-[4/3] p-6 md:p-12 sticky top-24 bg-fg-80 rounded`
        - inner centered stack (`text-auto-inverse`, `previewStyle` inline) — three lines: `AaBbCc`, `01234567`, `{(!@#$?&)}`
      - right — `w-1/2` → `StylesGrid`

## Variants
No named variants; behavior is derived from `typeface.styles` flags:
- **Italic present** (`hasItalic`) → Roman/Italic dropdown; default variant `italic`.
- **Weight + Width** (`hasWeight && hasWidth`) → Weight/Width axis dropdown; default variant = `styles.defaultStyle` (`'weight'`).
- **Single axis / static** → no dropdown (`showDropdown = false`); grid shows `weights`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| typeface | object | — | single config object; fields destructured below |
| typeface.fontFamily | string | — | inline `font-family` on the preview + passed to `StylesGrid` |
| typeface.badgeText | string | — | section header title |
| typeface.styles.hasWeight | bool | — | weight axis present |
| typeface.styles.hasWidth | bool | — | width axis present |
| typeface.styles.hasItalic | bool | — | italic axis present → Roman/Italic dropdown |
| typeface.styles.defaultStyle | string | `'weight'` | initial axis when weight+width |
| typeface.styles.weights | Array<{weight,…}> | `[]` | weight styles for grid + preview |
| typeface.styles.widths | Array<{width,…}> | `[]` | width styles for grid + preview |

## Styling
- Section: `w-full py-12 lg:py-16`; inner `max-w-[1400px] mx-auto flex flex-col gap-8`.
- Row: `flex flex-row gap-4 md:gap-6 lg:gap-8 items-start w-full`.
- Preview panel: `w-1/2 aspect-[4/3] p-6 md:p-12 transition-colors duration-300 sticky top-24 bg-fg-80 rounded` (sticky so it holds while the grid scrolls).
- Preview inner: `text-center transition-colors duration-300 w-full h-full flex flex-col justify-center items-center gap-2 text-auto-inverse`; three lines each `text-3xl md:text-5xl lg:text-6xl leading-none`.
- `previewStyle` inline (the live font-family render): `{ fontFamily, fontWeight: currentStyle.weight || 400, fontStyle: italic?'italic':'normal' }`; when `currentStyle.width` set, adds `fontVariationSettings: 'wdth' {width}` (variable-font width axis).
- Tokens: `bg-fg-80`, `text-auto-inverse` (panel is an inverted surface).
- **App-specific bits to DROP:** none hardcoded to a brand — `fontFamily`/`badgeText` come from the `typeface` prop. Two things to note, not drop:
  - The specimen strings `AaBbCc / 01234567 / {(!@#$?&)}` are generic literals; keep as the default specimen text but consider exposing as a `sampleLines` prop.
  - The default-selection **magic indices** (`weights[3]` = "Regular", `widths[2]` = "Normal") assume a fixed ordering of the styles arrays; in the DS, pick the default by a flag on the style object (e.g. `isDefault`) rather than by index, so it survives reordering.

## States & interactions
- `selectedStyleVariant` — which axis/style the dropdown shows (`italic` when `hasItalic`, else `defaultStyle`); `handleStyleVariantChange` resets `currentStyle` to that axis's default (weight[3]/width[2] fallback [0]).
- `currentStyle` — the hovered/selected style driving the preview; `StylesGrid` sets it via **both** `onStyleHover` and `onStyleClick` (hover previews, click pins).
- `isItalic` derived from `selectedStyleVariant === 'italic'` and flows into `previewStyle` + `StylesGrid`.

## Dependencies
`StylesGrid` from `@kol/ui` (the `@kol/ui/foundry` primitive it composes). `FoundrySection` (local sibling — the shared specimen header, see its own spec).

## Recreation notes
- Tier: **organism / section** (composes the `StylesGrid` foundry primitive + the shared section header + preview panel; owns axis/selection state).
- Composes the **`StylesGrid`** `@kol/ui/foundry` primitive (right column) and mounts under the shared `FoundrySection`/`SpecimenSectionHeader`.
- Part of the **Type Specimen sections** set — keep the sticky inverted preview panel + the three specimen lines consistent with the family's other sections.
- Keep all preview typography inline from the selected style (`fontFamily`, `fontWeight`, `fontStyle`, `fontVariationSettings 'wdth'`) — arbitrary loaded fonts + variable axes can't be expressed as fixed KOL type classes.
- Replace index-based default selection with a data flag when recreating (see Styling).
- Text casing at call site: `badgeText`, style labels, and specimen strings render verbatim — no `text-transform`.
