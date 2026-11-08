---
component: TypeTester
source: kol-website/apps/web/src/components/foundry/FontPreviewSection.jsx#L32-L123
staged: 2026-11-08
status: draft
deps: [Dropdown, Slider]
---

# TypeTester

## Purpose
One live type-testing block: a style dropdown and Size / Leading / Spacing sliders over an editable sample set in the
font under test. kol-website draws it on its foundry pages (`FontPreviewItem` inside `FontPreviewSection`, four rungs
96 / 64 / 48 / 24). kol-foundry's `tools/kol-kerner` wants the same block for a Tester page fed by the
`tg-collection/` fonts. The user, seeing it: *"can we play with this a bit"*.

## Anatomy
```
card  (border, padded, flex-col gap-6)
├─ controls row (flex-wrap, justify-between)
│  ├─ Dropdown — style / weight
│  └─ sliders (flex-wrap)
│     ├─ Slider "Size"     12–200, px
│     ├─ Slider "Leading"  0–50 → 90–140% line-height   (md+)
│     └─ Slider "Spacing"  −50–50, px letter-spacing      (md+)
└─ sample  contentEditable, the font's family/style/weight, optional line clamp
```

## Variants
None in the source (single form). The section around it stacks it as a size ladder; that ladder is the caller's.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| fontFamily | string | — | family of the sample |
| fontStyle | 'normal' \| 'italic' | 'normal' | style of the sample |
| text | string | the caller's sample | the editable text (re-seeded when it changes) |
| styles | `{label, value}[]` | — | the dropdown's options (source: weight labels → numeric weight) |
| initialStyle | string | 'Regular' | the dropdown's starting value |
| initialSize | number | 64 | Size slider start (px) |
| initialLeading | number | 10 | Leading slider start (0–50 → 90–140%) |
| lineClamp | number \| null | null | clamp the sample to n lines with ellipsis |

## Styling
- Card: `self-stretch min-h-40 p-4 md:p-6 rounded border border-fg-08 hover:border-fg-24 transition-colors duration-300 flex flex-col justify-start items-start gap-6 bg-surface-primary`
- Controls row: `self-stretch flex flex-wrap justify-between items-start gap-4 md:gap-8`. Sliders: `flex flex-wrap justify-start items-start gap-4 md:gap-8`. Each Slider has `readoutPreset="rail" displayWidth={4}` and `className="w-56"`. Leading and Spacing are `hidden md:flex w-56`.
- Sample: `flex-1 bg-transparent outline-none border-none text-auto`, with inline `fontFamily`, `fontStyle`, `fontWeight`, `fontSize: {size}px`, `lineHeight: {90+leading}%` and `letterSpacing: {spacing}px`, plus `wordWrap/overflowWrap: break-word`, `whiteSpace: normal`, `hyphens: none` and `maxWidth: 100%`.
- **Side bearings:** `paddingInline: 0.15em; marginInline: -0.15em` so overhangs (italic s, ð, f) survive the clamp's `overflow: hidden` (FontPreviewClampAndBearings, 2026-08-27). The wrapper must NOT clip.
- Clamp: `display: -webkit-box; -webkit-line-clamp: n; -webkit-box-orient: vertical; overflow: hidden`.
- **Drop on recreation:**
  - the `WEIGHT_VALUES` label→number map (pass values as options)
  - `FOUNDRY_SAMPLE_TEXT` (the website's Icelandic passage, which is the caller's)
  - the `SpecimenSectionHeader` and the ladder (`FontPreviewSection`), both site composition

## States & interactions
- Card border fg-08 → fg-24 on hover (300ms).
- The sample is edited in place. A change to `text` from the parent re-seeds it only if the content differs.
- Below md only Size shows.

## Dependencies
kol-component `Dropdown` and `Slider`. Nothing consumer-only once the sample text and weight map are props.

## Recreation notes
- Molecule, `TypeTester`. Every value above becomes a prop, and text casing stays with the caller.
- Leave the ladder to callers (kol-website renders four, kol-kerner one per font).
- Figma: one master with the controls row and the sample, in light and dark.
