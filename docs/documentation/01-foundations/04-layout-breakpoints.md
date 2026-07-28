---
title: Foundations — layout & breakpoints
type: reference
status: active
updated: 2026-07-28
description: The one layout law — ONE shell frame (1800) on every page, content left-anchored, two inner caps only (column 768, measure 65ch); one padding rhythm; Tailwind-scale breakpoints.
aliases:
  - breakpoints
  - layout-law
sources:
  - packages/theme/kol-theme.css
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

## Content-width tiers (2026-07-28 — supersedes the two-cap law)

THE page-width system, tokenized in `kol-theme.css` (user-approved, modeled on
the chess app's one-container discipline). No page invents a width number.

| Tier | Token | Value | For |
|---|---|---|---|
| shell | `--kol-content-shell` | 1800px | THE outer page container |
| page | `--kol-content-page` | 1400px | galleries, indexes, Home, styleguide surfaces |
| wide | `--kol-content-wide` | 1024px | specimen/table-heavy doc pages |
| column | `--kol-content-column` | 768px | reading columns — docs, articles, workshop |
| measure | `--kol-content-measure` | 65ch | running-text cap inside any tier |

Usage: `max-w-[var(--kol-content-page)]` in JSX, `max-width: var(--kol-content-*)`
in chrome CSS. `DocLayout` takes `width="column|wide|page"` (the `wide` boolean
is a legacy alias). Full-bleed surfaces (chess stage, block previews) use no
cap. **The padding rhythm is the kol-framework ramp** — `padding: var(--kol-pad-section-y) var(--kol-pad-section-x)` (x: 20 → 32 @768 → 48 @1024 · y: 48 → 64 → 80). No Tailwind padding steps on page containers; the tokens carry the responsive ramp.

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
