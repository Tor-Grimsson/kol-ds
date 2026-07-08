---
title: Blocks & sets — composed layers above components
type: reference
status: active
updated: 2026-07-03
description: The two composition layers on the showcase — blocks (copy-pasteable UI compositions with the shadcn-style viewer stage) and sets (full-apparatus compositions like the chess board) — and the contracts they follow.
aliases:
  - blocks
  - sets
sources:
  - showcase/src/lib/blocks-registry.js
  - showcase/src/lib/BlockViewer.jsx
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

## The blocks model (shadcn `/blocks`, faithfully)

- **One file = one block** (`showcase/src/blocks/<Name>.jsx`) exporting `meta = { title, description, category, featured? }` — it renders live AND ships its own `?raw` source. Drop a file in, it appears everywhere.
- **The viewer stage** (`lib/BlockViewer.jsx`): Preview/Code · device breakpoints (desktop flush full-width, tablet/mobile anchored **left** over a dot-grid with a **drag handle**) · open-standalone · refresh · copy-source. One persistent iframe — device switches never reboot the app inside.
- **Three routes per block**: the landing stage (`/blocks`, category tabs + browse-all list/grid), a dedicated page (`/blocks/:slug`), and the bare **product view** (`/blocks/preview/:slug` — full-bleed, no chrome; also the iframe src).

## Contracts

1. **Blocks never self-frame** — no fixed height, border, or rounding on the block root (`h-full w-full`; the container owns the frame). This is what makes the same file work in the stage, the thumbnail, and full-bleed standalone.
2. **Category** from the block's meta drives the tab strip (`sidenav` · `panel` · `form` · `toolbar` · …). Naming: **sidenav**, never "sidebar".
3. **Framework `SideNav` is router-coupled** — a block can't nest a `<Router>`; sidenav blocks are presentational recreations on the real `.kol-sidenav*` / `shell-*` chrome.

## Sets

Same one-file mechanics (`showcase/src/sets/*.jsx`, `lib/sets-registry.js`), listed on `/sets` with the docs-shell treatment. A set may carry its own deps (chess uses `chess.js`) — sets are showcase-local compositions, not package material.
