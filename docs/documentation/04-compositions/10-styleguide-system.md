---
title: Style-guide system
type: reference
status: canonical
created: 2026-07-31
updated: 2026-10-28
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
import { ComboLab, MoodTile, LogoCard, TypeBlock } from '@kolkrabbi/kol-styleguide'
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

**One window** (BrandLabToolWindow, 2026-10-29): every lab draws in **`LabWindow`** — kol-component's QuickLookFrame (the
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
| `LogoCard` | framed logo tile + caption + clearspace toggle |
| `ClearspaceDiagram` (+ `hasFramework`) | clearspace/keyline overlay (grid → keyline → logo), all layers injected nodes |
| `LogoScaling` | 4-variant × 10-step (128→8px) responsive scale matrix |
| `Lockup` (+ `LOCKUP_SCALES`) | the branded-house lockup — mark beside a parent name, a product name and descriptors; horizontal · hero · wordmark at sm → xl |
| `LockupLab` | the lockup generator — name, descriptors, variant and scale beside a Lockup, a brand's naming levels as preset rows (`LockupBuilder` before 2026-10-29) |

### Type
| Component | What it is |
|-----------|-----------|
| `TypeBlock` | typography specimen primitive — family/cut/weight/size/tracking/`case` (explicit prop, default `none` — no auto-casing) |
| `WEIGHTS` · `CUTS` · `CASES` · `familyFor` | cut/weight/case data (`typographyCuts.js`) |
| `TypeLab` | a brand's **type** — base size × musical ratio, a spec row + live sample per step with its line-height factor, and (2026-10-29) sixteen roles on the steps, each with face (display · heading · text · mono), weight, tracking, case and ink, in the brand's own faces (`TypeScaleLab` before) |
| `typeLab` · `typeLabCss` · `DEFAULT_TYPE_LAB` · `TYPE_RATIOS` · `TYPE_STEPS` · `TYPE_ROLES` · `TYPE_FACES` · `TYPE_CASES` · `TYPE_INKS` | the type math (`typeLab.js`) — steps and roles from `{ base, ratio, leading, roles }`, and the type as `--type-*` variables plus a `.type-<role>` class each reading the colour lab's ink; `typeScale` · `typeScaleCss` · `DEFAULT_TYPE_SCALE` are the old names |

### Assets
| Component | What it is |
|-----------|-----------|
| `MoodTile` | image tile with a centred logo overlay (both injected) |
| `AssetTable` | mark/asset spec + download table (composes DS `Table`; per-row `href`/`onDownload`) |

### Guide
| Component | What it is |
|-----------|-----------|
| `BrandGuide` | a brand guide, one scrolling page: `PageHero`, then one chapter per row of the `sections` it is handed (eyebrow · title · lede · prose · rules · the `kind`'s specimen · spec table · do / don't · words · closing prose), the chapters on a rail. kol-branding's renderer, carried. The outline is `kol-brand-template`'s `GUIDE_SECTIONS`; blank copy `GUIDE_TEMPLATE`; a client passes its own manifest with a `book` keyed the same. Live: apps/brand-hub `/guide/blank` · `/guide/voyager` |
| `guideSections` · `guideToc` | the chapter list merged with `brand.book`, empty chapters dropped; the rail's entries (`guideBook.js`) — the one chapter model: `BrandBook` and `BrandAssets` are `BrandGuide`'s chapters over `BOOK_SECTIONS` and `ASSET_SECTIONS` since 0.11.0 (one renderer, user 2026-10-28) |

### Re-exported primitives (live in the core packages, surfaced here)
`AssetGrid` · `FeatureSplit` · `ProsePreview` · `SpectrumGrid` (from `kol-component`) · `TypeSample` · `TypeSpecCard` (from `kol-foundry`). **Not duplicated** — the same modules, re-exported so a brand guide imports from one place.

## Consumer notes

- **Data is injected** — palettes, type scales, logo/image assets are consumer-supplied nodes/props; nothing is baked in (the editor-store/Canvas/router coupling of the sources was stripped).
- **CSS** ships in `@kolkrabbi/kol-theme` (`kol-components-styleguide.css` — the `.kol-combo-*` / `.kol-mood-tile-*` / `.kol-anatomy-*` clusters, relocated from `kol-framework.css`). This package ships JS only.
- **Deps**: `kol-component` + `kol-foundry` + `kol-icons` + `kol-theme`. No breaking moves — the shared primitives stay in their home packages.
- **No auto text-transform** — casing is a `case` prop or authored at the call site (KOL rule).
- Vite + Tailwind v4 consumer (`@source "…/node_modules/@kolkrabbi/kol-styleguide/src"`).
- **Pending the next raid**: the type-foundry engines (para-type, VF morph) and colour-tool engines (eyedropper, harmony wheel) are separate buckets — see the scan backlog.
