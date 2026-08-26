---
title: Visual reference
type: index
status: active
created: 2026-08-12
updated: 2026-08-14
description: Live HTML reference pages for shipped components
tags:
  - domain/components
  - audience/consumer
related:
  - "[[../documentation/INDEX|KOL documentation]]"
---

# Visual reference

Live HTML pages that render **every shipped variation** of a component against
the real `packages/theme/kol-theme.css` cascade — light and dark panes side by
side, each pane its own `:root` stamped `data-theme`, so the full token chain
(surfaces → fg/oq derivations) computes honestly per theme.

These are the promoted survivors of `_tmp/*-proposals/` review pages: once the
chrome ships, the proposal page graduates here as the reference, updated to the
shipped class strings verbatim.

Open them in a browser — `file://` works (the theme's JetBrains `@font-face`
falls back to system mono; everything else is self-contained + the one relative
stylesheet link).

| Page | Covers | Source of truth |
|---|---|---|
| `theme-toggle.html` | ThemeToggle, framework 0.18.0 — button (fill × size × label × iconRight × fullWidth), flush, the roll mechanics, alt-click reset | `packages/framework/src/ThemeToggle.jsx` |
| `inspector-icon-proposals.html` | **Shipped 2026-08-12** in icons 0.15.0 (approved frame-by-frame on this page) — the ten inspector glyphs, then-current stand-in vs proposed, 16–48 ramp, set refs, keyline guides | `packages/icons/src/kol-icon-set-v1/{layout,tools,typography}/` |
| `content-card-unification.html` | The six card variants (`default` · `catalog` · `print` · `article` · `work` · `typeface`) in both forms on the ruled ramp, the value gutters, and the open-rulings table. ONE pane with a theme toggle; media slots use the real `AssetPlaceholder` | [[../documentation/03-components/06-content-card-system\|the ContentCard system]] |
| `content-item-live.html` | **The real components, not mockups** — kol-component 0.46.0 `ContentItem` (all six variants, both forms) and `ContentCollection` (live grid⇄list switch, stagger on `--kol-ease-house`), esbuild-bundled React inline. Rebuild after component edits: `esbuild content-item-live.entry.jsx --bundle --format=iife --jsx=automatic --minify` and re-inline | `packages/component/src/molecules/ContentItem.jsx` |
| `dashboard-icon-proposals.html` | **Shipped 2026-08-14** in icons 0.16.0 (approved on this page) — the four dashboard glyphs promoted from the retired shelves under plain names (`stat-crown`→`crown` · `stat-winner`→`trophy` · `stopwatch` · `dashboard-dual-opponent`→`users`), retired cut vs proposed, 16–48 ramp, set refs, keyline guides; plus the three mapped-not-minted names | `packages/icons/src/kol-icon-set-v1/{misc,nav}/` |

## Conventions

- One entry page (`<component>.html`) framing two `<component>-pane.html`
  iframes (`?theme=light|dark`); panes relay state via `postMessage`.
- Chrome class strings **verbatim from the shipped component** — a reference
  page that paraphrases the render is a second implementation that drifts.
- Stylesheet by relative link (`../../packages/theme/kol-theme.css`), never a
  copy.
- Row per prop family, `tag` per cell, guides chip outlining every real box.
