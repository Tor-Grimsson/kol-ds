---
title: Brand-app extraction scan — promotion candidates
type: audit
status: active
updated: 2026-07-02
description: E3 sweep of kol-monorepo/apps/brand styleguide components — every reusable piece categorized per the placement rules, with PORT-AS-IS / PORT-WITH-ADAPTATION / LEAVE verdicts. Ports land on approval only.
sources:
  - kol-monorepo/apps/brand/src/components/styleguide/
tags:
  - domain/design-system
  - domain/workflow
related:
  - "[[2026-07-02-review-backlog|review backlog]]"
  - "[[../plan|execution plan]]"
  - "[[../taxonomy/01-component-placement|component placement]]"
---

# Brand-app extraction scan — promotion candidates

E3 deliverable: full sweep of `apps/brand`'s styleguide components (24 pieces read). Categories follow [[../taxonomy/01-component-placement|component placement]]. **Nothing here ports without approval** — except the Swatch, which the backlog itself ordered (E2, already ported to `showcase/src/lib/Swatch.jsx`).

## Tier 1 — port as-is (pure, zero/low deps)

| Piece | What | Category | Target |
|---|---|---|---|
| **Swatch** ✅ ported (E2) | Color chip + token bottom-left / hex bottom-right + anchor dot | atom | `showcase/lib` now; kol-component candidate |
| **TypeSample** | Typography specimen row (family/weight/size/LH props + sibling-border CSS) | atom | kol-component |
| **SpectrumGrid** | 11-col token matrix (ramps × stops), reads hex live from CSS tokens, responsive | organism | kol-component |
| **Ramp** | Named color-ramp row composing Swatch | molecule | after Swatch |
| **TypeSpecCard** | **The "labeled container"**: positioned label + top divider + 2-col meta/content slots | molecule | generalize → `LabeledSection` |

## Tier 2 — port with adaptation (decouple brand/context first)

| Piece | Adaptation needed | Category |
|---|---|---|
| LogoCard | Extract the aspect-ratio figure + backdrop; drop KolLogo/ClearspaceDiagram coupling → `AspectCard` + slot | molecule |
| AssetTable | Extract overlay + color-toggle + column builders; make rows format-agnostic | organism |
| ProsePreview | Generalize the `.kol-prose` specimen shell; slots instead of brand copy | docs-infra |
| TypeBlock | Contenteditable type editor; decouple `typography-cuts` utils → `EditableText` | molecule |
| FullscreenGallery | Extract overlay state + keyboard handling; decouple AssetFigure | organism |
| MoodTile | Image + overlay-logo → `ImageWithOverlay` with generic slot | molecule |
| FeatureSplit / PortalIndex | Editorial split + card-grid; decouple `.site-*` CSS | organisms (framework tier) |
| TypeScaleSection | Column-builder extraction → generic `TokenTable` | organism |

## Leave (context-entangled or trivial)

AssetCard, AssetFigure, AssetGrid, LogoCarousel (trivial wrappers) · StationeryMocks, SocialMocks, ClearspaceDiagram, LogoScaling (brand-specific) · SigTicker, PortalFooter (site chrome).

## Recommended approval order

1. **TypeSpecCard → LabeledSection** — the piece the user explicitly asked for; reusable far beyond type specs.
2. **TypeSample + SpectrumGrid** — pure, finish the Foundations/typography story.
3. **Ramp** — one-liner once Swatch is promoted into kol-component.
4. Tier 2 case-by-case, one PR each.

Naming note: kol-component already exports a `ColorSwatch` atom (selectable color chip for pickers) — the brand Swatch is a *specimen* swatch; if promoted, name it `TokenSwatch` to avoid the collision.
