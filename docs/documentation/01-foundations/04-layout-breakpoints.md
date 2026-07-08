---
title: Foundations — layout & breakpoints
type: reference
status: active
updated: 2026-07-07
description: The one breakpoint law for showcase-owned surfaces — Tailwind scale only, two content caps, one chrome reveal, canonical grid collapse points, one prose measure.
aliases:
  - breakpoints
  - layout-law
sources:
  - showcase/src/lib/DocLayout.jsx
  - showcase/src/lib/TopBar.jsx
  - showcase/src/lib/CollectionLanding.jsx
  - showcase/src/pages/Home.jsx
tags:
  - domain/design-system
  - domain/layout
related:
  - "[[01-tokens|tokens]]"
  - "[[03-typography|typography]]"
---

# Foundations — layout & breakpoints

One system for every showcase-owned surface. Born from the 2026-07-07 audit
(`.kol/llm-context/backlog/2026-07-07-showcase-audit.md`), which found six
competing page caps, four staggered chrome reveals, and three parallel
breakpoint systems.

## Breakpoints

**Tailwind's scale only, min-width only**: `sm` 640 · `md` 768 · `lg` 1024 ·
`xl` 1280 · `2xl` 1536. No custom pixel media queries, no desktop-first
`max-width` queries in showcase-owned code.

## Content caps — exactly two

| Cap | Class | Used by |
| --- | --- | --- |
| Reading column | `max-w-3xl` (`max-w-5xl` when `wide`) | `DocLayout` — every docs page |
| Gallery frame | `max-w-[1400px]` | Landing walls (Home, Blocks, Sets), collection galleries |

No other page-level max-width. `1600`, `1800`, `1232` are retired.

## Chrome reveal — one breakpoint

Navigation lives in the **NavDrawer below `lg`**, in the chrome at `lg+`
(TopBar links `lg:flex`, DocLayout sidebar `lg:block`). The TOC rail is a
progressive enhancement and may stay `xl:block`. Nothing chrome-critical may
reveal at `sm` or `md`.

## Grid collapse — canonical points

- Card grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`. First break is
  always `sm`, never `md`.
- Masonry walls: `columns-1 sm:columns-2 lg:columns-3 xl:columns-4`.
- Fixed `grid-cols-N` without a mobile step is allowed only for intrinsically
  tiny cells (icon tiles, numeric steppers).
- Container queries (`@container`) are for embedded product UI (dashboard
  cards) — every consumer of such a grid must provide the
  `container-type: inline-size` ancestor.

## Prose measure

`65ch`, everywhere. No 52/58/60ch forks.

## Rails

Nav rails are **256px** (`w-64` / `lg:grid-cols-[256px_…]`).

## Exemptions — verbatim ports

`showcase/src/workshop/**` (shell, chess, dashboards) are ported reference
apparatus and keep their internal geometry (1800px shell cap, chess
`max-width:1024` queries, `@container` steps). They are specimens, not
showcase chrome — do not conform them, and do not copy their patterns into
showcase-owned code.
