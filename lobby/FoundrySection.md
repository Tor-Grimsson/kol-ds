---
component: FoundrySection
source: kol-monorepo/apps/web/src/routes/foundry/components/FoundrySection.jsx#L1-L57
date: 2026-07-03
status: draft
deps: [Dropdown, Divider, Icon]
---

# FoundrySection

## Purpose
The shared **section header** for the Type Specimen sections set — the connective tissue every foundry specimen block sits under. Renders a title (with optional inline icon) on the left, up to two dropdowns (weight + style/axis) on the right, and a horizontal divider beneath. Fully generic: it holds no font data, only label/badge text, icon name, and controlled dropdown state passed down from the parent section. Six sections consume it (TypefaceStyleSection, FontPreviewSection, FoundryCharacterSets, and siblings), so it is what makes the set read as one coherent system.

## Anatomy
- Wrapper — `flex flex-col gap-[13px]`
  - Header row — `w-full flex flex-row justify-between items-end gap-4`
    - Left group — `flex items-center gap-3 md:gap-4`
      - Title `<span>` — text = `label || badgeText`; class forks on `size` (see Styling)
      - optional `Icon` — `name={icon} size={20}`, rendered only when `icon` set
    - Right group — `flex items-center gap-4`
      - optional weight `Dropdown` — rendered when `showWeightDropdown && weightOptions.length > 0`
      - optional style `Dropdown` — rendered when `showDropdown`
  - `Divider variant="horizontal"`

## Variants
No discrete named variants. Two structural forks: `size` (`'sm'` vs default `'lg'`, swapping the title type class) and the independent visibility of each dropdown / the icon. Title source is itself a fork — `label` wins, else `badgeText`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| label | string | — | title text (takes precedence over `badgeText`) |
| badgeText | string | — | fallback title when `label` unset |
| icon | string | — | KOL `Icon` name shown after the title; omit to hide |
| size | `'sm' \| 'lg'` | `'lg'` | title type class: `sm` → `kol-mono-sm-regular`, else `kol-mono-text-lg` |
| selectedStyle | string | — | controlled value of the style/axis dropdown |
| onStyleChange | fn(value) | — | style dropdown change handler |
| showDropdown | bool | `true` | render the style/axis dropdown |
| styleOptions | Array<{label,value}> | `[{Roman,roman},{Italic,italic}]` | style dropdown options |
| selectedWeight | string | — | controlled value of the weight dropdown |
| onWeightChange | fn(value) | — | weight dropdown change handler |
| showWeightDropdown | bool | `true` | gate the weight dropdown (also requires `weightOptions.length > 0`) |
| weightOptions | Array<{label,value}> | `[]` | weight dropdown options |

## Styling
- Wrapper: `flex flex-col gap-[13px]` (the `13px` is an intentional optical gap to the divider — keep as arbitrary value).
- Header row: `w-full flex flex-row justify-between items-end gap-4`; left `flex items-center gap-3 md:gap-4`; right `flex items-center gap-4`.
- Title type class: `kol-mono-sm-regular` at `size='sm'`, else `kol-mono-text-lg` — both are KOL mono type stops.
- Icon: KOL `Icon` at `size={20}`.
- Divider: KOL `Divider variant="horizontal"`.
- All Tailwind + KOL type classes + KOL components; no raw CSS, no tokens beyond what the child components carry.
- **App-specific bits to DROP:** none. The default `styleOptions` (Roman/Italic) is a sensible generic default, not a font map — keep it. No hardcoded fonts, colors, or copy.

## States & interactions
Stateless / fully controlled. Both dropdowns are controlled (`value` + `onChange`) by the parent section; this component owns no state and does no navigation. Interaction is entirely delegated to the two `Dropdown`s.

## Dependencies
`Dropdown`, `Divider`, `Icon` — all from `@kol/ui`.

## Recreation notes
- Tier: **molecule** (pure controlled composition — a title + two dropdowns + a divider, no data, no state).
- **Rename on promotion to `SpecimenSectionHeader`** — it does not compose an `@kol/ui/foundry` primitive; it *is* the glue header the other foundry sections mount above their primitive. The `Foundry*` name is an app-route artifact; the DS name should describe the role.
- Part of the **Type Specimen sections** set — this is the shared header every other section in that set renders first, so recreate it before the sections that depend on it.
- Consider making `size` an enum with a third scale if the DS needs it, but keep the two-stop `sm`/`lg` fork as the baseline.
- Text casing at call site: title strings (`label`/`badgeText`) and dropdown option labels render verbatim as authored — no `text-transform`, author "Roman"/"Italic"/"Character Set" etc. in their intended case.
