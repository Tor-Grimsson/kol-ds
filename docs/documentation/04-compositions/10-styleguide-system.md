---
title: Style-guide system
type: reference
status: canonical
created: 2026-07-31
updated: 2026-10-27
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
| `ComboLab` (+ `DEFAULT_PALETTE`) | the **60/30/10 combination playground** — palette × layout × logo, with randomize + live readout |
| `RatioBar` · `Tower` · `QuadSplit` · `CardRow` · `StripeRow` · **`AppliedCard`** | the stage layout primitives (`LAYOUT_COMPONENTS` / `COMBO_LAYOUTS`); AppliedCard is the applied-brand / **business-card mockup** |
| `generatePalette` · `fgOn` · `hexToHsl` · `hslToHex` · `GENERATION_MODES` | the palette engine (`comboMath.js`) |
| `ColorLab` | the **palette builder** from one base color — harmony wheel, roles, four brand slots, ten-hue palette + blue-grey and grey ramps, five-step blend ramps, 60/30/10 composition; controlled by one value (carried from kol-atlas, 2026-10-20) |
| `deriveColorLab` · `colorLabCss` · `blendRamp` · `neutralRamp` · `DEFAULT_COLOR_LAB` · `COLOR_ROLES` · `COLOR_SLOTS` · `COLOR_MIX` | ColorLab's math (`colorLab.js`) — the value → the palette, and the palette as `--brand-*` CSS |

### Logo
| Component | What it is |
|-----------|-----------|
| `LogoCard` | framed logo tile + caption + clearspace toggle |
| `ClearspaceDiagram` (+ `hasFramework`) | clearspace/keyline overlay (grid → keyline → logo), all layers injected nodes |
| `LogoScaling` | 4-variant × 10-step (128→8px) responsive scale matrix |
| `Lockup` (+ `LOCKUP_SCALES`) | the branded-house lockup — mark beside a parent name, a product name and descriptors; horizontal · hero · wordmark at sm → xl |
| `LockupBuilder` | the live lockup builder — name, descriptors, variant and scale beside a Lockup, a brand's naming levels as preset rows |

### Type
| Component | What it is |
|-----------|-----------|
| `TypeBlock` | typography specimen primitive — family/cut/weight/size/tracking/`case` (explicit prop, default `none` — no auto-casing) |
| `WEIGHTS` · `CUTS` · `CASES` · `familyFor` | cut/weight/case data (`typographyCuts.js`) |
| `TypeScaleLab` | the **modular type scale** — base size × musical ratio, a spec row + live sample per step, in the brand's own faces |
| `typeScale` · `typeScaleCss` · `TYPE_RATIOS` · `TYPE_STEPS` · `DEFAULT_TYPE_SCALE` | the scale math (`typeScale.js`) — steps with size and 4px-grid line height, and the scale as `--type-*` CSS |

### Assets
| Component | What it is |
|-----------|-----------|
| `MoodTile` | image tile with a centred logo overlay (both injected) |
| `AssetTable` | mark/asset spec + download table (composes DS `Table`; per-row `href`/`onDownload`) |

### Guide
| Component | What it is |
|-----------|-----------|
| `BrandGuide` | a brand guide, one scrolling page: `PageHero`, then one chapter per row of the `sections` it is handed (eyebrow · title · lede · prose · rules · the `kind`'s specimen · spec table · do / don't · words · closing prose), the chapters on a rail. kol-branding's renderer, carried. The outline is `kol-brand-template`'s `GUIDE_SECTIONS`; blank copy `GUIDE_TEMPLATE`; a client passes its own manifest with a `book` keyed the same. Live: apps/brand-hub `/guide/blank` · `/guide/voyager` |
| `guideSections` · `guideToc` | the chapter list merged with `brand.book`, empty chapters dropped; the rail's entries (`guideBook.js`) |

### Re-exported primitives (live in the core packages, surfaced here)
`AssetGrid` · `FeatureSplit` · `ProsePreview` · `SpectrumGrid` (from `kol-component`) · `TypeSample` · `TypeSpecCard` (from `kol-foundry`). **Not duplicated** — the same modules, re-exported so a brand guide imports from one place.

## Consumer notes

- **Data is injected** — palettes, type scales, logo/image assets are consumer-supplied nodes/props; nothing is baked in (the editor-store/Canvas/router coupling of the sources was stripped).
- **CSS** ships in `@kolkrabbi/kol-theme` (`kol-components-styleguide.css` — the `.kol-combo-*` / `.kol-mood-tile-*` / `.kol-anatomy-*` clusters, relocated from `kol-framework.css`). This package ships JS only.
- **Deps**: `kol-component` + `kol-foundry` + `kol-icons` + `kol-theme`. No breaking moves — the shared primitives stay in their home packages.
- **No auto text-transform** — casing is a `case` prop or authored at the call site (KOL rule).
- Vite + Tailwind v4 consumer (`@source "…/node_modules/@kolkrabbi/kol-styleguide/src"`).
- **Pending the next raid**: the type-foundry engines (para-type, VF morph) and colour-tool engines (eyedropper, harmony wheel) are separate buckets — see the scan backlog.
