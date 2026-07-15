---
title: Shipped packages
type: reference
status: active
updated: 2026-07-15
description: THE package list — every @kolkrabbi package this repo ships, with current version and one-line job. The single canonical table; update versions with every publish.
aliases:
  - shipped-packages
  - packages
  - package-list
tags:
  - domain/workflow
  - domain/design-system
related:
  - "[[01-release-pipeline|release pipeline]]"
  - "[[../documentation/00-overview/01-package-topology|package topology]]"
  - "[[../INDEX|docs home]]"
---

# Shipped packages

Every package this repo maintains and publishes to npm, in one table. **Versions are updated with every publish** (part of the release ritual — the batch that ships bumps this file). Deps/ownership detail lives in [[../documentation/00-overview/01-package-topology|the package topology]].

> Versions below = the **staged 2026-07-15 brief-3.0 batch** (theme 0.9.0 + chess 0.4.0 on top of the shipped evening batch; push == publish). Verify against npm after CI runs.

## UI tier

| Package | Version | Job |
|---|---|---|
| `@kolkrabbi/kol-theme` | **0.9.3** | Foundation CSS — tokens, type classes, all component chrome (`.kol-btn*`, `.kol-prose`, per-domain sheets) |
| `@kolkrabbi/kol-icons` | **0.7.0** | `<Icon>` + the curated `kol-icon-set-v1` + `registerIcons` (BYO) |
| `@kolkrabbi/kol-component` | **0.12.0** | The components — atoms → molecules → organisms + `<Graphic>` |
| `@kolkrabbi/kol-framework` | **0.5.0** | App shell — `AppShell`, `SideNav`, `ShellHeader`, `ThemeToggle` + `useTheme`, heroes, footer |
| `@kolkrabbi/kol-workshop` | **0.1.6** | Docs/workshop system — markdown engine, search, tag graph, docs shell |
| `@kolkrabbi/kol-dashboards` | **0.1.0** | Analytics — hand-rolled SVG charts (no d3), card family, `MetricsDashboard` |
| `@kolkrabbi/kol-chess` | **0.4.1** | Chess apparatus — interactive board (click-to-move), 3 piece sets, playback/notation/sidelines, `./data` adapter |
| `@kolkrabbi/kol-content` | **0.4.0** | CMS — `/stack` (blog) + `/work` (portfolio) streams |
| `@kolkrabbi/kol-foundry` | **0.4.2** | Type-specimen apparatus — typeface hero, variable-axis playground, glyph metrics |
| `@kolkrabbi/kol-store` | **0.1.1** | Commerce — product-detail layout, price display, marquee river |
| `@kolkrabbi/kol-styleguide` | **0.1.0** | Brand-guide specimens — color anatomy, combo lab, logo construction, type blocks |

## Clients / brand / tools

| Package | Version | Job |
|---|---|---|
| `@kolkrabbi/kol-media-client` | **0.1.0** | Read-only client for the kol-media CDN |
| `@kolkrabbi/kol-brand-template` | **0.2.0** | Brand-manifest schema + house defaults + CSS generator |
| `@kolkrabbi/kol-brand` | **0.1.2** | Kolkrabbi's own brand manifest (ramps, type, logo SVGs) |
| `@kolkrabbi/kol-scrape` | **0.1.0** | Presence/press scraper CLI |

## Not in this table (deliberately)

- `@kolkrabbi/kol-loader` **0.3.0** — orphaned on npm, superseded by `kol-icons`; deprecate when ready.
- `@kolkrabbi/kol-specimen` **0.1.0** — subset-twin of `kol-foundry` (the canonical package, ruled 2026-07-15); lives outside this repo, pending `npm deprecate`.
