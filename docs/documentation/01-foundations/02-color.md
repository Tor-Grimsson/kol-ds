---
title: Color — anchors and ramps
type: reference
status: active
updated: 2026-07-03
description: The brand color system — four semantic identity anchors and seven ramps (five hues + cream + grey) with literal hex per stop. Values are verbatim from kol-brand-color.css; the same data ships portably in @kolkrabbi/kol-brand.
aliases:
  - color
  - ramps
sources:
  - packages/framework/kol-brand-color.css
  - packages/brand/src/index.js
tags:
  - domain/design-system
  - domain/color
related:
  - "[[01-tokens|foundations]]"
  - "[[../05-brand/INDEX|brand kit]]"
---

# Color — anchors and ramps

Two layers: **brand identity** (the anchors + hue ramps below) and **UI chrome** (surfaces, fg-opacity, state colors — see [[01-tokens|foundations]]). The CSS (`kol-brand-color.css`) is the runtime source of truth; `@kolkrabbi/kol-brand` carries the same values as portable data. The showcase renders all of this live at `/foundations/color`.

## The four anchors

Semantic identity tokens — consume these, not raw stops, for brand-tinted UI:

| Token | Resolves to | Value | Use |
|---|---|---|---|
| `--kol-accent-primary` | `yellow-300` | `#FFCF33` | Dominant identity color (kicker, link, accents) |
| `--kol-accent-on-primary` | `blue-400` | `#222D3D` | Ink on top of accent-primary |
| `--kol-accent-secondary` | `red-200` | `#AD5038` | Secondary identity color |
| `--kol-accent-on-secondary` | `cream-100` | `#FAF7F0` | Ink on top of accent-secondary |

## The ramps

Five hue families × 5 stops (100–500) + cream + a 10-stop grey. **Anchor positions vary per ramp** (yellow at 300, red at 200, blue at 400 — marked •). Tokens: `--kol-color-<ramp>-<stop>` (grey: `--grey-<stop>`).

| Stop | Yellow | Orange | Red | Blue | Teal | Cream |
|---|---|---|---|---|---|---|
| 100 | `#FFEA57` | `#F5CF81` | `#CC7762` | `#497DA2` | `#9BCCCD` | `#FAF7F0` • |
| 200 | `#FFDF43` | `#E3A054` | `#AD5038` • | `#3F6485` | `#6FB6B7` | `#F5F0E6` |
| 300 | `#FFCF33` • | `#DF760B` • | `#913F2B` | `#314152` | `#49A0A2` • | `#F5EBD8` |
| 400 | `#FFBC1F` | `#A54209` | `#662C1E` | `#222D3D` • | `#387E7F` | `#F0E0C0` |
| 500 | `#FFA113` | `#7C2900` | `#522418` | `#181F29` | `#275A5B` | `#EBD5A9` |

Ramp notes: yellow is a **pure-yellow lock** (`#FF` red channel through all stops, no orange contamination); blue is a **hybrid hue lock** (light tints + deep stops, no yellow lean at saturated mid).

### Grey (10 stops)

| 50 | 100 | 200 | 300 | 400 | 500 • | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|
| `#FCFBFB` | `#EBEBEB` | `#DBDBDB` | `#A3A3A4` | `#5B5B5D` | `#363639` | `#2E2E30` | `#242427` | `#1B1B1E` | `#131316` |

## Known gap

KOL is **sRGB, not OKLCH** — flagged in the shadcn benchmark ([[../06-research/benchmark/INDEX|benchmark]], gap 4). A future ramp regeneration in OKLCH would keep perceptual lightness even across stops.
