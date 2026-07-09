---
component: GlyphMetricsSection
source: kol-monorepo/apps/web/src/routes/foundry/components/GlyphMetricsSection.jsx#L1-L86
date: 2026-07-03
status: draft
deps: [FoundrySection, GlyphMetricsGrid]
---

# GlyphMetricsSection

## Purpose
The specimen-page wrapper that turns `GlyphMetricsGrid` into a **Weight/Width axis playground**. It builds an axis dropdown + a value dropdown from the typeface's authored `weights[]` / `widths[]` stops, maps the chosen stops into a `fontVariationSettings` object, and swaps between the **roman and italic font files** as the style dropdown changes. All of that is composed under a shared `FoundrySection` header and handed down to `GlyphMetricsGrid` — the section owns the axis state, the grid owns the render.

## Anatomy
- `<section className="w-full py-12 lg:py-16">`
  - `<div className="max-w-[1400px] mx-auto flex flex-col gap-8">`
    - `FoundrySection` — `icon="foundation" size="sm"`, `badgeText`; its dropdowns are wired conditionally (style dropdown *or* axis+value dropdowns — see Props/Styling)
    - `GlyphMetricsGrid` — `fontUrl={currentFontUrl}`, `fontFamily`, `fontStyle="normal"` (**always normal** — italic is done by URL swap, not CSS), `variationSettings`

## Variants
No named variants. Behaviour forks on config flags:
- `showDropdown` true → the header shows the **Roman/Italic** style dropdown (and swaps font files).
- `showAxisDropdown` (`= hasWeight || hasWidth`) → the header shows **axis + value** dropdowns instead/also.
- `hasWeight` / `hasWidth` decide which axes appear and which `fontVariationSettings` keys are emitted.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| fontFamily | string | `'TGMalromur'` | passed straight to `GlyphMetricsGrid` |
| fontUrlRoman | string | — | font file used when style = roman |
| fontUrlItalic | string | — | font file used when style = italic |
| fontStyle | `'normal'\|'italic'` | `'normal'` | seeds initial `selectedStyleVariant` (`italic` → `'italic'`) |
| badgeText | string | `'Málrómur'` | `FoundrySection` title |
| showDropdown | bool | `true` | show the Roman/Italic style dropdown (+ enable file swap) |
| hasWeight | bool | `false` | add Weight to `axisOptions`; emit `wght` in `variationSettings` |
| hasWidth | bool | `false` | add Width to `axisOptions`; emit `wdth` in `variationSettings` |
| weights | Array<{label, weight}> | `[]` | value-dropdown options when axis = weight |
| widths | Array<{label, width}> | `[]` | value-dropdown options when axis = width |

## Styling
- No styling of its own beyond the `section`/container: `w-full py-12 lg:py-16` → `max-w-[1400px] mx-auto flex flex-col gap-8`. All visual weight is delegated to `FoundrySection` and `GlyphMetricsGrid`.
- **The axis → `fontVariationSettings` mapping** (the core logic):
  - `axisOptions` = built by pushing `{label:'Weight', value:'weight'}` if `hasWeight`, `{label:'Width', value:'width'}` if `hasWidth`.
  - `valueOptions` = `selectedAxis === 'weight' ? weights.map(w => ({label: w.label, value: w.weight})) : widths.map(w => ({label: w.label, value: w.width}))`.
  - `selectedValue` / `onValueChange` fork on `selectedAxis` between `selectedWeight`/`setSelectedWeight` (init `400`) and `selectedWidth`/`setSelectedWidth` (init `100`).
  - **Output object**: `variationSettings = {}`; if `hasWeight` → `.wght = selectedWeight`; if `hasWidth` → `.wdth = selectedWidth`. This object is the prop `GlyphMetricsGrid` serializes to a CSS string.
- **Roman/italic switch = file swap, not CSS**: `isItalic = selectedStyleVariant === 'italic'`; `currentFontUrl = isItalic ? fontUrlItalic : fontUrlRoman`. The grid is always given `fontStyle="normal"` — the italic look comes from loading a different `.ttf`, not from `font-style: italic`.
- **App-specific bits to DROP:**
  - **`badgeText='Málrómur'` + `icon="foundation"`** — app defaults; the DS wrapper should take a neutral title and let the icon be a prop with no baked default.
  - **The tangled `FoundrySection` prop wiring** — the current JSX overloads the same header slots with two meanings via nested ternaries (`showDropdown ? selectedStyleVariant : showAxisDropdown ? selectedValue : undefined`, and again for `onStyleChange`/`styleOptions`). It ends up passing *both* the style set and the weight set into `FoundrySection` (which already has a dedicated `weightOptions`/`selectedWeight`/`showWeightDropdown` slot). On promotion, split cleanly: **style dropdown → `styleOptions`/`selectedStyle`; axis+value → `weightOptions`/`selectedWeight`** — stop double-driving one slot with ternaries.
  - **`weights`/`widths` shape** (`{label, weight}` / `{label, width}`) is the app's `typefaceConfig.styles.weights[]`/`widths[]`. Keep the shape but document it as the DS contract.

## States & interactions
- **Axis scrub**: discrete, not continuous — value dropdown changes `selectedWeight`/`selectedWidth`, which re-computes `variationSettings` and flows into the grid. (No slider here; the continuous slider lives in `VariableFontSection`.)
- **Roman/italic switch**: the style dropdown sets `selectedStyleVariant` → picks `fontUrlRoman` vs `fontUrlItalic` → `GlyphMetricsGrid` reloads on the new `fontUrl`.
- **Glyph select / metrics overlay**: entirely owned by the child `GlyphMetricsGrid`.
- **Auto-animate**: none.
- State held: `selectedStyleVariant`, `selectedAxis` (init `'weight'`), `selectedWeight`, `selectedWidth`.

## Dependencies
`FoundrySection` (app route header → DS `SpecimenSectionHeader`), `GlyphMetricsGrid`. No direct `@kol/ui/foundry` primitive, no font-parsing dep of its own — parsing is the child's job.

## Recreation notes
- Tier: **organism** (stateful axis/style controller wrapping the `GlyphMetricsGrid` organism).
- Font-parsing dep: **none directly** — it feeds `fontUrl` + `variationSettings` down; `FontLoader`/opentype.js run inside `GlyphMetricsGrid`.
- Reconciliation vs `packages/fontviewer`: this hand-builds axis controls from **static authored stops** (`weights[]`/`widths[]` → dropdown options → object). The package's `VariationAxes.js` builds controls from the font's **live `fvar` axes** (reads `axis.min/max/default`, emits a `"${tag}" ${val}` **string** via `onChange`). Two different sources (authored config vs parsed `fvar`), two different outputs (object vs string), two different widgets (dropdown vs slider). On promotion, unify under a `FontControlsPanel` that can be driven **either** by discrete config stops **or** by `VariationAxes`-read `fvar` ranges, and standardize on one settings shape (object is the friendlier prop; serialize to string at the render boundary as `GlyphMetricsGrid` already does).
- Note the **file-swap italic** decision: unlike `VariableFontSection` (which toggles CSS `font-style`), this section switches the actual roman/italic font file and keeps `font-style: normal`. Preserve that — for families shipped as separate roman/italic files it is the correct behavior; document which strategy applies per typeface in the config.
- Text casing at call site: `badgeText`, axis labels ("Weight"/"Width"), and value labels render verbatim — no `text-transform`.
