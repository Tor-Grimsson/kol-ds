---
title: Blocks & sets — composed layers above components
type: reference
status: active
updated: 2026-07-30
description: The two composition layers on the showcase — blocks (copy-pasteable UI compositions with the shadcn-style viewer stage) and sets (full-apparatus compositions like the chess board) — and the contracts they follow.
aliases:
  - blocks
  - sets
sources:
  - showcase/src/lib/blocks-registry.js
  - showcase/src/lib/BlockViewer.jsx
  - showcase/src/lib/PreviewCard.jsx
tags:
  - domain/design-system
  - pattern/blocks
related:
  - "[[../03-components/01-inventory|components]]"
  - "[[02-shells|reference shells]]"
  - "[[03-slug-composition-gallery|slug pages & the composition gallery]]"
---

# Blocks & sets — composed layers above components

Two layers sit between raw components and full apps, both on the showcase:

| Layer | What | Examples | Route |
|---|---|---|---|
| **Blocks** | UI compositions — bigger than a component, smaller than a page. Copy the source, keep the wiring. | sidenavs (docs / KOL / workshop), inspector panel, settings form, filter bar | `/blocks` |
| **Sets** | Full-apparatus compositions — an app-like thing you drop in whole. | chess board (metrics dashboards later) | `/sets` |

## Blocks model

- **One file = one block** (`showcase/src/blocks/<Name>.jsx`) exporting `meta = { title, description, category, featured? }` — it renders live AND ships its own `?raw` source. Drop a file in, it appears everywhere.
- **The viewer stage** (`lib/BlockViewer.jsx`) is a **body, not a card** (2026-07-30). The frame, seam, radius, tab bar and Code tab all come from `lib/PreviewCard.jsx` — THE card for every preview surface in the showcase. BlockViewer keeps only what is genuinely different: the iframe, the device presets and the drag handle.

  Until this sweep there were two cards for one job, disagreeing on seven axes — 960 vs 1574px wide, radius 4 vs 8, `--kol-oq-08` vs `border-fg-12`, authored `Preview`/`Code` labels vs lowercase strings CSS-capitalised, `CodeBlock` vs a hand-rolled `<pre>`. **The width cap is now a prop, not a fork:** component pages pass `cap="panel"`, blocks and sets pass `cap="shell"`, both reading `--kol-content-*`. Page-level compositions are shell-wide by nature; that is the distinction, and neither side improvises a pixel.

  What the stage still owns: Preview/Code · device breakpoints (desktop flush full-width, tablet/mobile anchored **left** over a dot-grid with a **drag handle**) · open-standalone · refresh · copy-source. One persistent iframe — device switches never reboot the app inside. The frame is **800px tall** (a real device height — dvh-budgeted layouts like the chess board need it) and presets **scale-to-fit, never lie**: each renders at its true device width (desktop = 1280 when the card sits under the lg breakpoint) and shrinks visually via transform, so the iframe's media queries always fire at the width the chip claims.
- **Three routes per block**: the landing stage (`/blocks`, category tabs + browse-all list/grid), a dedicated page (`/blocks/:slug`), and the bare **product view** (`/blocks/preview/:slug` — full-bleed, no chrome; also the iframe src).

## Contracts

1. **Blocks never self-frame** — no fixed height, border, or rounding on the block root (`h-full w-full`; the container owns the frame). This is what makes the same file work in the stage, the thumbnail, and full-bleed standalone.
2. **Category** from the block's meta drives the tab strip (`sidenav` · `panel` · `form` · `toolbar` · …). Naming: **sidenav**, never "sidebar".
3. **Framework `SideNav` is router-coupled** — a block can't nest a `<Router>`; sidenav blocks are presentational recreations on the real `.kol-sidenav*` / `shell-*` chrome.

## Sets

Same one-file mechanics (`showcase/src/sets/*.jsx`, `lib/sets-registry.js`), listed on `/sets` with the docs-shell treatment. A set may carry its own deps (chess uses `chess.js`) — sets are showcase-local compositions, not package material.
