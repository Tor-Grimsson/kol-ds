---
title: Shipped packages
type: reference
status: active
created: 2026-08-01
updated: 2026-09-21
description: Every package this repo ships, with its version
aliases:
  - shipped-packages
  - packages
  - package-list
tags:
  - domain/release
  - audience/agency-internal
  - provider/npm
  - pattern/changesets-release
related:
  - "[[INDEX|release pipeline]]"
  - "[[04-retirements|retirements]]"
  - "[[../../documentation/00-overview/01-package-topology|package topology]]"
  - "[[../../INDEX|docs home]]"
---

# Shipped packages

Every package this repo maintains and publishes to npm, in one table. **Versions are updated with every publish** (part of the release ritual — the batch that ships bumps this file). Deps/ownership detail lives in [[../../documentation/00-overview/01-package-topology|the package topology]].

> **These are the versions in `packages/*/package.json`** — what the repo would publish, not necessarily what npm serves. Read as a claim about this tree; confirm against the registry before citing one externally. Regenerated 2026-08-01, when the table had drifted three packages and several majors behind (theme read 0.19.0 against a local 0.30.1).

## UI tier

| Package | Version | Job |
|---|---|---|
| `@kolkrabbi/kol-theme` | **0.146.0** | Foundation CSS — tokens, type classes, all component chrome |
| `@kolkrabbi/kol-icons` | **0.26.0** | `<Icon>` + kol-icon-set-v1 + kol-icon-set-signal, plus `registerIcons` for bring-your-own |
| `@kolkrabbi/kol-component` | **0.216.0** | The components — atoms → molecules → organisms → utilities + `<Graphic>` |
| `@kolkrabbi/kol-framework` | **0.44.0** | Site shell — `PageLayout`, `SideNav`, `ShellHeader`, `ThemeToggle` + `useTheme`, the page kit (`PageHero` · `PageSection`), footer |
| `@kolkrabbi/kol-shell` | **0.51.0** | Application shell — `NavRail` + `AppShell`, page scaffolds, `GridCard`, settings/walkthrough/shortcuts |
| `@kolkrabbi/kol-workshop` | **0.28.0** | Docs/workshop system — markdown engine, search, tag graph, docs shell, exhibit sections |
| `@kolkrabbi/kol-dashboards` | **0.4.1** | Analytics — hand-rolled SVG charts (no d3), card family, `MetricsDashboard` |
| `@kolkrabbi/kol-controls` | **0.3.0** | Hardware panel controls — knob, fader, LED, toggles, jack socket, rocker, `ParamSheet` |
| `@kolkrabbi/kol-chess` | **0.10.0** | Chess apparatus — interactive board, 3 piece sets, playback/notation/sidelines, archive, rail blocks |
| `@kolkrabbi/kol-content` | **0.14.0** | CMS — `/stack` (blog) + `/work` (portfolio) streams |
| `@kolkrabbi/kol-foundry` | **0.10.0** | Type-specimen apparatus — typeface hero, variable-axis playground, glyph metrics |
| `@kolkrabbi/kol-store` | **0.3.0** | Commerce — product-detail layout, price display, marquee river |
| `@kolkrabbi/kol-styleguide` | **0.4.1** | Brand-guide specimens — color anatomy, combo lab, logo construction, type blocks |

## Other tiers

| Package | Version | Job |
|---|---|---|
| `@kolkrabbi/design-editor` | **0.4.2** | **App tier — the one BUILT package** (ARCHITECTURE §4 exception, 2026-09-03). The whole editor as `<DesignEditor />`; moved in from kol-fxr, which had published it unversioned by any gate |
| `@kolkrabbi/kol-media-client` | **0.4.0** | Read-only client for the kol-media CDN |
| `@kolkrabbi/kol-brand-template` | **0.2.0** | Brand-manifest schema + house defaults + CSS generator |
| `@kolkrabbi/kol-brand` | **0.1.3** | Kolkrabbi's own brand manifest (ramps, type, logo SVGs) |
| `@kolkrabbi/kol-scrape` | **0.1.0** | Presence/press scraper CLI |

## Excluded

- `@kolkrabbi/kol-loader` **0.3.0** — **deprecated on the registry 2026-07-30** ("Superseded by @kolkrabbi/kol-icons"); the orphan is closed.
- `@kolkrabbi/kol-specimen` **0.1.0** — subset-twin of `kol-foundry` (the canonical package, ruled 2026-07-15); lives outside this repo, pending `npm deprecate`.
