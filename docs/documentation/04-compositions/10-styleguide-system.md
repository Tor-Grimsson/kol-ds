---
title: Style-guide system
type: reference
status: canonical
created: 2026-07-31
updated: 2026-11-14
verified: 2026-07-10
description: Brand-guide specimens for color, logo and type
aliases:
  - styleguide
  - kol-styleguide
  - brand guide
  - style guide
sources:
  - packages/styleguide/src/index.js
  - packages/styleguide/README.md
  - packages/styleguide/src/specimenRamp.js
  - showcase/src/sets/specimen.jsx
tags:
  - domain/compositions
  - domain/brand
  - domain/typography
  - domain/color
related:
  - "[[21-print|Print]]"
  - "[[../00-overview/01-package-topology|package topology]]"
  - "[[05-foundry-system|foundry system]]"
  - "[[../01-foundations/02-color|color]]"
---

# Style-guide system — `@kolkrabbi/kol-styleguide`

The brand/style-guide component set — the visual specimens a brand manual is built from. Assembled 2026-07-10 (bucket A of the external brand raid) by porting the studio's styleguide components read-only from their scattered homes (apps/brand · kol-client-kolkrabbi · kol-labs-monorepo) and decoupling every one to consumer-injected props.

```js
import { ComboLab, MoodTile, CardLogo, BlockType } from '@kolkrabbi/kol-styleguide'
```

## Component index

### Color
| Component | What it is |
|-----------|-----------|
| `ColorAnatomy` | token-composition specimen — a color sample + figcaption + inline `<code>` token readout (composes `ColorSwatch`) |
| `ComboLab` | the **60/30/10 combination playground** — palette × layout × logo, with randomize + live readout; `onChange(palette)` reports the palette (2026-10-29) |
| `comboLab` · `comboLabCss` · `DEFAULT_COMBO_LAB` · `COMBO_ROLES` | ComboLab's math in the lab family's shape (`comboLab.js`, over `generatePalette`) — a palette from a pool or a seed, and a palette as `--brand-combo-*` CSS; `DEFAULT_PALETTE` is `DEFAULT_COMBO_LAB`'s old name |
| `RatioBar` · `Tower` · `QuadSplit` · `CardRow` · `StripeRow` · **`AppliedCard`** | the stage layout primitives (`LAYOUT_COMPONENTS` / `COMBO_LAYOUTS`); AppliedCard is the applied-brand / **business-card mockup** |
| `generatePalette` · `fgOn` · `hexToHsl` · `hslToHex` · `GENERATION_MODES` | the palette engine (`comboMath.js`) |
| `ColorLab` | a brand's **colour definition** from one base color — harmony wheel, roles, four brand slots, ten-hue palette + blue-grey and grey ramps, five-step blend ramps, 60/30/10 composition, and (2026-10-29) every swatch's WCAG contrast against the brand's ink, the brand's own ink levels on its light and dark grounds, and the dark theme; controlled by one value (carried from kol-atlas, 2026-10-20) |
| `colorLab` · `colorLabCss` · `DEFAULT_COLOR_LAB` · `contrastRatio` · `contrastGrade` · `inkOn` · `INK_LEVELS` · `blendRamp` · `neutralRamp` · `COLOR_ROLES` · `COLOR_SLOTS` · `COLOR_MIX` | ColorLab's math (`colorLab.js`) — the value → the palette, its ink (emphasis · strong · lede · body · meta) and its dark theme (slots swapped, each role moved along its ramp to AA), and all of it as `--brand-*` CSS with the dark block under `[data-theme="dark"]`; `deriveColorLab` is `colorLab`'s old name |

### The lab — `@kolkrabbi/kol-styleguide/lab`

The generators a brand is made with ship together under one name system (2026-10-29, the user: *"the group of those tools
that generate should ship together with combolab and logo lockup generator, and have unified name system"*). Each is
`<X>Lab` (the UI, one controlled value) · `<x>Lab(value)` (everything it draws) · `<x>LabCss(…)` (the result as CSS) ·
`DEFAULT_<X>_LAB`: **TypeLab** · **ColorLab** · **ComboLab** · **LockupLab**. The subpath carries exactly those names; the
main barrel exports them too. apps/brand-lab is the reference.

**One window** (BrandLabToolWindow, 2026-10-29): every lab draws in **`ModalLab`** (was `LabWindow`, deprecated alias since 2026-11-12) — kol-component's QuickLookFrame (the
established window, resizable by its corner, never taller than the viewport), a left rail of text tabs whose controls are
`LabeledControl`s in one tone (`kol-tone-sunken` on the rail), the status line at the rail's foot and no footer, the stage
beside it, and **`LabOutput`** under the window — a table, then the CSS, the same shape for every lab. `useLabValue` holds
a lab's value with undo and redo. One padding (`--kol-lab-pad`, 16) for header, rail and stage.

**One colour engine** (`colorLab.js`, kol-fxr's): OKLCH, colour 1 is the base, a count of 2–8, every colour given its job by
look (Background the darkest, Ink the lightest, Accent the most saturated, then Dim and Warm), seeded roll keeping locked
colours, a contrast ratio and grade for every colour on the ground. Color Lab owns the palette; Combo Lab combines it.

| Lab | Rail | Stage | Output |
|---|---|---|---|
| TypeLab | Scale (base, ratio) · Steps (line height per step) · Roles (one role at a time: step, face, weight, tracking, case, ink) | a step per line, or the roles; every sample one line, truncated | the roles table · `typeLabCss` |
| ColorLab | Generate (base, relation, 2–8 colours, the wheel) · Ink (the text levels on the ground, graded) | the colours as equal columns: job, hex, contrast; lock · edit tint (the lightness ladder) · edit · copy · delete; undo · redo · roll in the header | the palette and ink table · `colorLabCss` |
| ComboLab | Layout (layout, mark slot) · Parts (which colour plays primary · secondary · light · dark · accent) | the layout, unbranded unless a `logo` is passed | the parts with their contrast on light and dark · `comboLabCss` |
| LockupLab | Lockup (type, logo shape, grid, clip to baseline) · Text (each part, presets) · Ratio (company and sub-category to product, weights, case) | the lockup, drawn by **`BrandLockup`** | the parts table · every lockup type by the same `BrandLockup` |

The math: `typeLab` · `typeLabCss` · `TYPE_*`; `colorLab` · `colorLabCss` · `rollColorLab` · `generateColors` · `assignRoles` ·
`tintLadder` · `seededRng` · `oklchToHex` · `hexToOklch` · `contrastRatio` · `contrastGrade` · `inkOn` · `blendRamp` ·
`COLOR_ROLES` · `COLOR_RELATIONS` · `INK_LEVELS`; `comboLab` · `comboLabCss` · `COMBO_ROLES`; `lockupLab` · `LOCKUP_TYPES` ·
`LOCKUP_PARTS` · `LOCKUP_SHAPES` · `LOCKUP_CASES` · `LOCKUP_GRID` · `LOCKUP_SUB_PRESETS`. Old names on the retirement
ledger: `TypeScaleLab`, `typeScale`, `typeScaleCss`, `DEFAULT_TYPE_SCALE`, `deriveColorLab`, `DEFAULT_PALETTE`,
`LockupBuilder`, `generatePalette`.

### Logo
| Component | What it is |
|-----------|-----------|
| `CardLogo` (was `LogoCard`, an alias) | framed logo tile + caption + clearspace toggle; `variant="plate"` — the mark on its ground, LayoutLogo's card |
| `ClearspaceDiagram` (+ `hasFramework`) | clearspace/keyline overlay (grid → keyline → logo), all layers injected nodes |
| `LogoScaling` | 4-variant × 10-step (128→8px) responsive scale matrix |
| `Lockup` (+ `LOCKUP_SCALES`) | the branded-house lockup — mark beside a parent name, a product name and descriptors; horizontal · hero · wordmark at sm → xl |
| `LockupLab` | the lockup generator — name, descriptors, variant and scale beside a Lockup, a brand's naming levels as preset rows (`LockupBuilder` before 2026-10-29) |

### Type
| Component | What it is |
|-----------|-----------|
| `BlockType` (was `TypeBlock`, an alias) | typography specimen primitive — family/cut/weight/size/tracking/`case` (explicit prop, default `none` — no auto-casing) |
| `WEIGHTS` · `CUTS` · `CASES` · `familyFor` | cut/weight/case data (`typographyCuts.js`) |
| `TypeLab` | a brand's **type** — base size × musical ratio, a spec row + live sample per step with its line-height factor, and (2026-10-29) sixteen roles on the steps, each with face (display · heading · text · mono), weight, tracking, case and ink, in the brand's own faces (`TypeScaleLab` before) |
| `typeLab` · `typeLabCss` · `DEFAULT_TYPE_LAB` · `TYPE_RATIOS` · `TYPE_STEPS` · `TYPE_ROLES` · `TYPE_FACES` · `TYPE_CASES` · `TYPE_INKS` | the type math (`typeLab.js`) — steps and roles from `{ base, ratio, leading, roles }`, and the type as `--type-*` variables plus a `.type-<role>` class each reading the colour lab's ink; `typeScale` · `typeScaleCss` · `DEFAULT_TYPE_SCALE` are the old names |

### Specimen — the type-specimen kit (type-ramp plan 7.5, 2026-11-14)
One code home for the library's Specimen family (Styleguide page of the KOL library: sections Sheet, Display and cards, Ramp, Weights, Samples), names and props equal to the Figma masters. A sheet's font is a prop, `font = { family, weights: [{ name, value }], link, role, tracking? }` (`tracking` per step, em), passed down; no component names a font. The six views of the Figma Previews section render at showcase `/sets/specimen`.

| Component | What it is |
|-----------|-----------|
| `SpecimenSample` (was kol-foundry's `TypeSample`, an alias) | one caption and one sample, typography by props; `horizontal` puts the caption beside the sample, in its type; `label` omitted hides the caption |
| `SpecimenSampleGroup` | a stack of `SpecimenSample`, the fg-08 hairline between them |
| `SpecimenSpec` (was `TypeSpecCard`) | font metrics beside a live sample slot (a `SpecimenSample`) |
| `SpecimenLive` (was `TypeSpecimenLive`) | the self-measuring specimen; ships `readMeta`, and its measuring (`useMeasuredType`) is what `SpecimenRampRow` uses |
| `SpecimenHeader` (was `SpecimenSectionHeader`) | the section head on kol-component's `SectionHeader`: icon in the leading slot, `controls` (bool) puts the weight and style dropdowns in the trailing slot; defaults on when dropdown props are given |
| `SpecimenSheet` | the one layout: the dark frame (1600, `content` slot on a light sheet, `footer` slot) and the `aside` slot beside it; `showContent`, `showFooter`, `showAside`. Dark is set on the frame, Light on the content and the aside |
| `SpecimenFooterGroup` | a footer group: `title` (mono 12, uppercase; `showTitle`) over its content (a library `Table`, `SpecimenNote`s) |
| `SpecimenNote` | a label cell (320) and a text cell behind an oq-08 rule |
| `SpecimenDisplay` | the "Aa" card: `ramp` false shows the font's name, link and a `Chip` per weight (the grid clips at 408 × 328, as the master does); `ramp` true the plain "Ramp" card |
| `SpecimenFontCard` | a font's card for any font, 1280 × 800: `ramp` false is the alphabet card; `ramp` true is the mark, cuts and alphabet beside the font's own ramp |
| `SpecimenFontSheet`, `SpecimenFontFace` | the word, the pair (`faces`, `showFaces`) and every weight as a `SpecimenSample horizontal`; one face described |
| `SpecimenRamp` → `SpecimenRampSection` (`row`) → `SpecimenRampRow` | the 48 steps from `RAMP` (Display d1 to d6, Heading h1 to h6, Text, Utility and Label 1 to 12), each row at `--kol-ramp-size-*` / `--kol-ramp-line-height-*`, its size, line height and tracking measured off the rendered sample; `case`, `italic`, `underline` |
| `SpecimenWeights` → `SpecimenWeightsSection` → `SpecimenWeightsRow` | the same steps in every weight of the font, each row the height of its ramp row, so the panel in a sheet's `aside` meets the ramp row for row |
| `RAMP` | the rows and steps the ramp and weights read |

Figma values with no KOL token, written as Tailwind spacing: frame side padding and aside gap 120 (`px-30`, `gap-30`), card padding 96 (`py-24`), font sheet title 100 down (`pt-25`), content gap 128 (`gap-32`), ramp sections 96 apart (`gap-24`), heads to sections 88 (`gap-22`), display radius 24 (`rounded-3xl`), the aside 800 down (`pt-200`: the master's 768 plus the frame's 32 top padding, so the rows meet).

### Assets
| Component | What it is |
|-----------|-----------|
| `MoodTile` | image tile with a centred logo overlay (both injected) |
| `AssetTable` | mark/asset spec + download table (composes DS `Table`; per-row `href`/`onDownload`) |

### Guide
| Component | What it is |
|-----------|-----------|
| `LayoutGuide` (was `BrandGuide`, an alias) | a brand guide, one scrolling page: `PageHero`, then one chapter per row of the `sections` it is handed (eyebrow · title · lede · prose · rules · the `kind`'s specimen · spec table · do / don't · words · closing prose), the chapters on a rail. kol-branding's renderer, carried. The outline is `kol-brand-template`'s `GUIDE_SECTIONS`; blank copy `GUIDE_TEMPLATE`; a client passes its own manifest with a `book` keyed the same. Live: apps/brand-hub `/guide/blank` · `/guide/voyager` |
| `guideSections` · `guideToc` | the chapter list merged with `brand.book`, empty chapters dropped; the rail's entries (`guideBook.js`) — the one chapter model: `BrandBook` and `BrandAssets` are `BrandGuide`'s chapters over `BOOK_SECTIONS` and `ASSET_SECTIONS` since 0.11.0 (one renderer, user 2026-10-28) |

### Layouts — `@kolkrabbi/kol-styleguide/layout`
The identity lab's views as KOL layouts (LayoutGroup, kol-atlas 2026-10-31): carried class for class from kol-atlas `apps/lab`, a brand passes only data. Each takes a `view`. Run on the Kolkrabbi draft in `apps/brand-lab` at `/layout/type|color|logo|text|guide`.

| Component | What it is |
|-----------|-----------|
| `LayoutType` (+ `LAYOUT_TYPE_VIEWS`, `LAYOUT_TYPE_FACES`) | a type exploration over a TypeLab value and its faces — `scale` (every role on a styleholder, the rail) · `styles` (rich text) · `article` · `sheet` (the specimen sheet) · `faces` (the UI font options sheet: one scale, D1 80/88 … H6 32/40 at 800 and the body steps, with a face switch over `faceOptions`) |
| `LayoutColor` (+ `LAYOUT_COLOR_VIEWS`) | a colour exploration over a ColorLab value — `palette` · `ramps` · `layouts` (the roles as ink on ground) · `sheet` (cells are `BlockSwatch variant="cell"`) |
| `LayoutLogo` (+ `LAYOUT_LOGO_VIEWS`) | every mark on its ground (`marks`), and each with the wordmark (`lockups`); cards are `CardLogo variant="plate"` |
| `LayoutText` (+ `LAYOUT_TEXT_VIEWS`) | voice and copy in the type roles — `lines` (chapters, each line with its source) · `source` (a markdown document on the rail) |
| `LayoutGuide` | the brand guide (above) |
| `BlockSwatch` (was `Swatch`, an alias) | the documented swatch — chip over name and hex; `variant="cell"` is the colour sheet's cell |
| `IconBrowser` | the showcase's icon gallery as a component — filter row, size · ground · guide · LIST / GRID, IconPlate tiles; items are kol-icons names or raw SVG; search reads `name` and the item's `tags` (2026-11-05, kol-icons `getTags`); opt-in (0.20.0): `filters="dropdown"` (a multi-select menu a group, one row: every value starts ticked, `All` ticks or clears them, a row toggles and keeps the panel open, the trigger reads All · the value · `N of M` · None), `labels` (default true) and `labelToggle` (bare plates, name on a Tooltip) `perRowControl` (a Per row Slider, 2–32, sets the grid's count) and `actions` (a node after LIST / GRID, e.g. a ThemeToggle); `selectable` (a Select toggle: each plate shows the media library's `ToggleCheckbox variant="media"` top-left in `.kol-frame-control--top-left`; click the box or plate toggles, shift-click a range in the shown order, cmd/ctrl-click toggles, Escape clears, `N selected` and an All shown ToggleCheckbox in the row; grid only), item `meta` (`[[key, value], …]`, listed under the name in the plate's Tooltip), `selected` / `onSelect(names)` (controlled selection, optional) and `onContextMenu(selectedItems, event)` (right-click a plate, an unselected one becomes the selection; the page draws its own ContextMenu); `persistKey` (the controls — ticked facet values, per row, size, ground, guide, labels, layout, select mode, facets open — kept in sessionStorage under `kol-icon-browser:<key>`, so a reload comes back as it was; the selection stays the page's); `searchValue` / `onSearchChange(text)` (the search text, controlled: the showcase's icon pages hand in `?q=`) |

`DocumentIndex` moved to kol-framework (2026-10-31); the name here is an alias.

### Re-exported primitives (live in the core packages, surfaced here)
`AssetGrid` · `FeatureSplit` · `ProsePreview` · `SpectrumGrid` (from `kol-component`). **Not duplicated** — the same modules, re-exported so a brand guide imports from one place.

## Consumer notes

- **Data is injected** — palettes, type scales, logo/image assets are consumer-supplied nodes/props; nothing is baked in (the editor-store/Canvas/router coupling of the sources was stripped).
- **CSS** ships in `@kolkrabbi/kol-theme` (`kol-components-styleguide.css` — the `.kol-combo-*` / `.kol-mood-tile-*` / `.kol-anatomy-*` clusters, relocated from `kol-framework.css`). This package ships JS only.
- **Deps**: `kol-component` + `kol-icons` + `kol-theme` (+ `kol-framework`, `kol-print`); never `kol-foundry` (foundry depends on this package since 2026-11-14). No breaking moves — the shared primitives stay in their home packages.
- **No auto text-transform** — casing is a `case` prop or authored at the call site (KOL rule).
- Vite + Tailwind v4 consumer (`@source "…/node_modules/@kolkrabbi/kol-styleguide/src"`).
- **Pending the next raid**: the type-foundry engines (para-type, VF morph) and colour-tool engines (eyedropper, harmony wheel) are separate buckets — see the scan backlog.
