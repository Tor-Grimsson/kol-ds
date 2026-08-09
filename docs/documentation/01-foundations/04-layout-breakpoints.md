---
title: Layout & breakpoints
type: reference
status: active
created: 2026-07-31
updated: 2026-08-01
description: One shell frame, three inner caps, one rhythm
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
  - domain/layout
  - audience/consumer
related:
  - "[[01-tokens|tokens]]"
  - "[[03-typography|typography]]"
  - "[[05-layout-systems|layout systems registry]]"
  - "[[../08-breakpoints/INDEX|breakpoints lookup]]"
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

## Content widths

THE page-width system, tokenized in `kol-theme.css` (user-approved, modeled on
the chess app's one-container discipline). No page invents a width number.

| Tier | Token | Value | For |
|---|---|---|---|
| canvas | `--kol-content-canvas` | 87.5rem | the page BODY inside the shell's main column — item fields (swatch grids, icon walls, galleries). Added 2026-07-31 |
| shell | `--kol-content-shell` | 1800px | THE outer page container |
| panel | `--kol-content-panel` | 960px | tables, code blocks, framed panels (added 2026-07-30 — the ~900–1200 band consumers were improvising) |
| column | `--kol-content-column` | 768px | reading columns — docs, articles, workshop |
| measure | `--kol-content-measure` | 65ch | running-text cap inside any tier |

*(The `page` 1400 and `wide` 1024 tiers were killed the same day at theme
0.11.22 — width is content, not page identity. This table was stale until
2026-07-29; the lookup home is now [[../08-breakpoints/INDEX|08-breakpoints]].)*

Usage: `max-w-[var(--kol-content-page)]` in JSX, `max-width: var(--kol-content-*)`
in chrome CSS. `DocLayout` takes `width="column|wide|page"` (the `wide` boolean
is a legacy alias). Full-bleed surfaces (chess stage, block previews) use no
cap. **The padding rhythm is the kol-framework ramp** — `padding: var(--kol-pad-section-y) var(--kol-pad-section-x)` (x: 20 → 32 @768 → 48 @1024 · y: 48 → 64 → 80). No Tailwind padding steps on page containers; the tokens carry the responsive ramp.

## Embed mode

`?embed=1` on any URL renders main content only (no TopBar, no sidebar, no TOC)
— rails **unmounted**, content padding kept. Layout-level, read by the chrome
hosts via `showcase/src/lib/useEmbed.js`. Full contract:
[[../04-compositions/02-shells|shells → embed mode]].

## Chrome reveal

Navigation lives in the **NavDrawer below `lg`**, in the chrome at `lg+`
(TopBar links `lg:flex`, DocLayout sidebar `lg:block`). The TOC rail is a
progressive enhancement and may stay `xl:block`. Nothing chrome-critical may
reveal at `sm` or `md`.

## Grid collapse

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

## Exemptions

`showcase/src/workshop/**` (shell, chess, dashboards) are ported reference
apparatus and keep their internal geometry (1800px shell cap, chess
`max-width:1024` queries, `@container` steps). They are specimens, not
showcase chrome — do not conform them, and do not copy their patterns into
showcase-owned code.
