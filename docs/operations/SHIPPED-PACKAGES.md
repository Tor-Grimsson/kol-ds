---
title: Shipped packages
type: reference
status: active
updated: 2026-07-28
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
| `@kolkrabbi/kol-theme` | **0.11.22** | Foundation CSS — tokens, type classes, all component chrome; 0.11.9/0.11.10 the `kol-doc-*` (11) + `kol-card-*` (6) type-role sets (footer mono 10/14; 0.11.11 radius law 4px; 0.11.14-19 CodeBlock chrome verbatim from the live reference + doc-body tracking 0.04em + table scroll edge = surface fade only (no shadow); 0.11.20-22 `--kol-content-*` = ONE frame + two caps (shell 1800 · column 768 · measure 65ch; page/wide tiers killed same day — width is content, not page identity)) (`kol-type-roles.css`, prose-twinned furniture, opt-in); 0.11.7 nav opacity ladder | 
| `@kolkrabbi/kol-icons` | **0.8.4** | `<Icon>` + kol-icon-set-v1 (144 icons / 23 groups; diagonals in their own arrow-diagonal group; 0.8.4 v1 `copy` = the elder glyph, old one retired to the shelf) + `registerIcons` (BYO); 0.8.0 v1-ONLY — legacy stroke/solid/svg/svg-web trees removed (local shelf `_tmp/legacy-icons/`), `variant` prop dropped, 17 promotions in; 0.8.1 keyline conformance — chevrons+carets fit 18×18, expanded redrawn stroke-1.5, arrow family complete: 4 diagonals baked from the downright master; chevron-expanded killed (twin of chevron-up) |
| `@kolkrabbi/kol-component` | **0.12.5** | The components — atoms → molecules → organisms + `<Graphic>`; 0.12.5 CodeBlock REPLICATED from the elder reference (react-syntax-highlighter + oneDark, filename-or-language chip, 32×32 icon copy w/ `copy`→check) |
| `@kolkrabbi/kol-framework` | **0.5.8** | App shell — `AppShell`, `SideNav`, `ShellHeader`, `ThemeToggle` + `useTheme`, heroes, footer; 0.5.5 icon names → v1 (`hamburger`/`x`); 0.5.4 theme state = explicit > system > light; 0.5.8 codeblock chrome moved OUT (home = kol-theme) |
| `@kolkrabbi/kol-workshop` | **0.1.11** | Docs/workshop system — markdown engine, search, tag graph, docs shell; 0.1.8/0.1.9 the `Doc*` kit over the kol-doc-* roles — DocTable = PRESET over the kol-component Table, unframed flush minimal (0.1.10) |
| `@kolkrabbi/kol-dashboards` | **0.2.2** | Analytics — hand-rolled SVG charts (no d3), card family, `MetricsDashboard`; kol deps = peerDeps + workspace:* devDeps (0.2.1); 0.2.2 icon names → v1 (`book-open`/`bookmark`/`roadmap`/`trending-up`) |
| `@kolkrabbi/kol-chess` | **0.5.3** | Chess apparatus — interactive board, 3 piece sets, playback/notation/sidelines, archive, rail blocks (0.5.2), `./data` adapter; 0.5.3 ChessHero emoji-as-icon-name → v1 names |
| `@kolkrabbi/kol-content` | **0.4.1** | CMS — `/stack` (blog) + `/work` (portfolio) streams; 0.4.1 icon names → v1 (`x`) |
| `@kolkrabbi/kol-foundry` | **0.5.0** | Type-specimen apparatus — typeface hero, variable-axis playground, glyph metrics |
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
