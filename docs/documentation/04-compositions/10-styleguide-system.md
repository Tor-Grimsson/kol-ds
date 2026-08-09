---
title: Style-guide system
type: reference
status: canonical
created: 2026-07-31
updated: 2026-08-01
verified: 2026-07-10
description: Brand-guide specimens for colour, logo and type
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
  - audience/consumer
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

### Colour
| Component | What it is |
|-----------|-----------|
| `ColorAnatomy` | token-composition specimen — a colour sample + figcaption + inline `<code>` token readout (composes `ColorSwatch`) |
| `ComboLab` (+ `DEFAULT_PALETTE`) | the **60/30/10 combination playground** — palette × layout × logo, with randomize + live readout |
| `RatioBar` · `Tower` · `QuadSplit` · `CardRow` · `StripeRow` · **`AppliedCard`** | the stage layout primitives (`LAYOUT_COMPONENTS` / `COMBO_LAYOUTS`); AppliedCard is the applied-brand / **business-card mockup** |
| `generatePalette` · `fgOn` · `hexToHsl` · `hslToHex` · `GENERATION_MODES` | the palette engine (`comboMath.js`) |

### Logo
| Component | What it is |
|-----------|-----------|
| `LogoCard` | framed logo tile + caption + clearspace toggle |
| `ClearspaceDiagram` (+ `hasFramework`) | clearspace/keyline overlay (grid → keyline → logo), all layers injected nodes |
| `LogoScaling` | 4-variant × 10-step (128→8px) responsive scale matrix |

### Type
| Component | What it is |
|-----------|-----------|
| `TypeBlock` | typography specimen primitive — family/cut/weight/size/tracking/`case` (explicit prop, default `none` — no auto-casing) |
| `WEIGHTS` · `CUTS` · `CASES` · `familyFor` | cut/weight/case data (`typographyCuts.js`) |

### Assets
| Component | What it is |
|-----------|-----------|
| `MoodTile` | image tile with a centred logo overlay (both injected) |
| `AssetTable` | mark/asset spec + download table (composes DS `Table`; per-row `href`/`onDownload`) |

### Re-exported primitives (live in the core packages, surfaced here)
`AssetGrid` · `FeatureSplit` · `ProsePreview` · `SpectrumGrid` (from `kol-component`) · `TypeSample` · `TypeSpecCard` (from `kol-foundry`). **Not duplicated** — the same modules, re-exported so a brand guide imports from one place.

## Consumer notes

- **Data is injected** — palettes, type scales, logo/image assets are consumer-supplied nodes/props; nothing is baked in (the editor-store/Canvas/router coupling of the sources was stripped).
- **CSS** ships in `@kolkrabbi/kol-theme` (`kol-components-styleguide.css` — the `.kol-combo-*` / `.kol-mood-tile-*` / `.kol-anatomy-*` clusters, relocated from `kol-framework.css`). This package ships JS only.
- **Deps**: `kol-component` + `kol-foundry` + `kol-icons` + `kol-theme`. No breaking moves — the shared primitives stay in their home packages.
- **No auto text-transform** — casing is a `case` prop or authored at the call site (KOL rule).
- Vite + Tailwind v4 consumer (`@source "…/node_modules/@kolkrabbi/kol-styleguide/src"`).
- **Pending the next raid**: the type-foundry engines (para-type, VF morph) and colour-tool engines (eyedropper, harmony wheel) are separate buckets — see the scan backlog.
