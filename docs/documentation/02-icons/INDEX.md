---
title: Icons
type: reference
status: active
created: 2026-07-08
updated: 2026-08-01
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

`@kolkrabbi/kol-icons` ships one component (`Icon`) plus the inventories and the loader around it. It is its **own architectural tier** (`theme ← icons ← component ← framework`, ARCHITECTURE §3), not part of the component library. Two things live here: the **loader** (how a name resolves and streams) and **kol-icon-set-v1** (the curated set the system is converging on). Browse live: showcase `/icons` (kol-icon-set-v1, grouped — the legacy gallery and `/icons/v1` were consolidated into it, 2026-07-28).

## The chapter

| Page | What it holds |
|---|---|
| [[01-inventory\|Icon inventory]] | Every name in kol-icon-set-v1, by group |
| [[02-loader\|Icon loader]] | The `<Icon>` component and the packaged set |
| [[03-custom\|Custom icons]] | `registerIcons`, the retired legacy trees, the promotion loop |
| [[04-authoring\|Authoring an icon]] | The keyline guide and `<Graphic>` |

**Four pages beside the index** (2026-08-01) — the chapter minimum is three.
