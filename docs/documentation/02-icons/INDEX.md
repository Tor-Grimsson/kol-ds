---
title: Icons
type: reference
status: active
created: 2026-07-08
updated: 2026-08-27
description: The loader, the packaged set, and bring-your-own
aliases:
  - icons
  - iconography
sources:
  - packages/icons/src/Icon.jsx
  - packages/icons/src/index.js
tags:
  - domain/iconography
  - audience/consumer
related:
  - "[[../00-overview/INDEX|overview]]"
  - "[[01-inventory|icon inventory]]"
  - "[[../03-components/01-inventory|components]]"
---

# Icons — the loader, the set, and bring-your-own

`@kolkrabbi/kol-icons` ships one component (`Icon`) plus the inventories and the loader around it. It is its **own architectural tier** (`theme ← icons ← component ← framework`, ARCHITECTURE §3), not part of the component library. Two things live here: the **loader** (how a name resolves and streams) and the **sets** — `kol-icon-set-v1`, the general set for app chrome, and `kol-icon-set-signal` (≥0.25.0), the signal-flow vocabulary for instrument surfaces. `<Icon>` resolves consumer → v1 → signal; the name map is flat across both, so one name is one glyph. Browse live: showcase `/icons` (kol-icon-set-v1, grouped — the legacy gallery and `/icons/v1` were consolidated into it, 2026-07-28).

## The chapter

| Page | What it holds |
|---|---|
| [[01-inventory\|Icon inventory]] | Every name in both sets, by group |
| [[02-loader\|Icon loader]] | The `<Icon>` component and the packaged set |
| [[03-custom\|Custom icons]] | `registerIcons`, the retired legacy trees, the promotion loop |
| [[04-authoring\|Authoring an icon]] | The keyline guide and `<Graphic>` |

**Four pages beside the index** (2026-08-01) — the chapter minimum is three.

## Glyph cut

`KOL_ICON_SET_V1` is the folder index (`{ group: names[] }`); **`KOL_ICON_SET_V1_META`** (kol-icons ≥0.24.0, IconSetCut) is per glyph — `{ name: { group, cut } }`, `cut` being how it is drawn, `stroke` | `solid`, derived from the markup at build (`pnpm extract:icons` → `src/cuts.json`; the `icon-cuts` gate fails when stale). A gallery filters by type from the package; nobody globs the SVG folder to learn what the set already knows.
