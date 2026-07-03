---
component: FontPreviewSection
source: kol-monorepo/apps/web/src/routes/foundry/components/FontPreviewSection.jsx#L1-L65
date: 2026-07-03
status: draft
deps: [FontPreviewItemAlt, FoundrySection]
---

# FontPreviewSection

## Purpose
A stacked **multi-size preview** section: the shared specimen header (with a weight dropdown + a Roman/Italic style dropdown) above a ladder of four `FontPreviewItemAlt` blocks at 96 / 64 / 48 / 24 px, each pre-seeded with the section's currently selected weight and italic state. Lets a visitor read a family across display-to-body sizes at a chosen weight/style.

## Anatomy
- `<section>` — `w-full py-12 lg:py-16`
  - inner — `max-w-[1400px] mx-auto flex flex-col gap-8`
    - `FoundrySection` header — `badgeText`, `icon="foundation"`, `size="sm"`, weight dropdown + style dropdown
    - four `FontPreviewItemAlt` — mapped over the size ladder:
      - `{ size: 96, lines: 1 }`
      - `{ size: 64, lines: 3 }`
      - `{ size: 48, lines: 4 }`
      - `{ size: 24, lines: 5, leading: 50 }`

## Variants
No named variants. Structural fork: `showDropdown` toggles the style dropdown *and* seeds the initial style (`showDropdown ? 'italic' : 'roman'`). The weight dropdown appears only when `availableWeights.length > 0`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| fontFamily | string | `'TGMalromur'` | family rendered in every preview item (**drop brand default**) |
| badgeText | string | `'Málrómur'` | section header title (**drop brand default**) |
| showDropdown | bool | `true` | render style dropdown; also sets initial style to `italic` |
| availableWeights | string[] | `['Thin'…'Black']` (9) | weight dropdown options + each item's weight range |
| initialWeight | string | `'Regular'` | initially selected weight |

## Styling
- Section: `w-full py-12 lg:py-16`; inner `max-w-[1400px] mx-auto flex flex-col gap-8`.
- Header via `FoundrySection` (`icon="foundation"`, `size="sm"`); `weightOptions` derived as `availableWeights.map(l => ({ label: l, value: l }))`.
- Each preview via `FontPreviewItemAlt` with `fontFamily`, `fontStyle` (`italic|normal`), `initialWeight={selectedWeight}`, `availableWeights`, `initialSize`, `initialLeading`, `lineClamp` — the live font-family render lives inside that primitive.
- No raw CSS or tokens at this level; all styling is Tailwind layout + delegated to the primitives.
- **App-specific bits to DROP:**
  - **`fontFamily = 'TGMalromur'`** and **`badgeText = 'Málrómur'`** — hardcoded brand-font defaults. Make both **required / prop-driven** with no brand default; the section must not assume a specific typeface.
  - **`availableWeights` default** is the Málrómur 9-weight ramp — reasonable as a generic fallback, but ideally the caller passes the family's real weights; do not treat it as canonical.
  - The 96/64/48/24 size ladder (+ 24px `leading: 50`) is a hardcoded specimen scale; keep as a sensible default but consider a `sizes` prop.

## States & interactions
- `selectedStyleVariant` — Roman/Italic, initialized from `showDropdown`; controlled by the header style dropdown; derives `isItalic`.
- `selectedWeight` — initialized from `initialWeight`; controlled by the header weight dropdown; passed as `initialWeight` into every `FontPreviewItemAlt`.
- Changing either dropdown re-seeds all four preview items.

## Dependencies
`FontPreviewItemAlt` from `@kol/ui` (the `@kol/ui/foundry` primitive it composes). `FoundrySection` (local sibling header).

## Recreation notes
- Tier: **organism / section**.
- Composes the **`FontPreviewItemAlt`** `@kol/ui/foundry` primitive (×4, one per size) under the shared `FoundrySection`/`SpecimenSectionHeader`.
- Part of the **Type Specimen sections** set — the size-ladder member; keep the header idiom identical to the other sections.
- Priority drop: strip the `TGMalromur`/`Málrómur` defaults so the component is font-agnostic (this is the main "hardcoded font map to make prop-driven" flag for this component).
- Text casing at call site: `badgeText`, weight labels, and style labels render verbatim — no `text-transform`.
