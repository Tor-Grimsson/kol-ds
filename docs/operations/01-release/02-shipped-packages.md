---
title: Shipped packages
type: reference
status: active
created: 2026-08-01
updated: 2026-10-24
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
| `@kolkrabbi/kol-theme` | **0.196.0** | Foundation CSS — tokens, type classes, all component chrome |
| `@kolkrabbi/kol-icons` | **0.52.0** | `<Icon>` + kol-icon-set-interface + kol-icon-set-signal + kol-icon-set-identity, plus `registerIcons` for bring-your-own |
| `@kolkrabbi/kol-component` | **0.311.0** | The components — atoms → molecules → organisms → utilities + `<Graphic>`, and `NavRail` (app · site) |
| `@kolkrabbi/kol-framework` | **0.61.0** | Site shell — `SiteLayout` (the site frame; `PageLayout` · `AppShell` alias it), `CategoryPage`, `SideNav` (alias of `NavRail variant="site"`), `ShellHeader`, `ThemeToggle` + `useTheme`, the page kit (`PageHero` · `PageSection`), footer |
| `@kolkrabbi/kol-shell` | **0.87.0** | Application shell — `AppShell` (renders kol-component's `NavRail`, re-exported) (the phone bar, the app's one masthead), `AppHub` (Home and Settings opt-in), `AppStudio` (the workstation page set), page scaffolds, `GridCard`, settings/walkthrough/shortcuts |
| `@kolkrabbi/kol-workshop` | **0.41.0** | Docs/workshop system — the docs shell (per-space rails, one scroll region, settings, the S sheet), the reader, `SearchPage`, the tag graph, exhibit sections; the engines moved to the engine tier (0.30.0), still re-exported |
| `@kolkrabbi/kol-dashboards` | **0.5.0** | Analytics — hand-rolled SVG charts (no d3), card family, `MetricsDashboard` |
| `@kolkrabbi/kol-hardware` | **0.9.0** | Hardware panel controls in five groups — value · switches · indicators · panel · frames — plus the signal engine (`./signal`: one expression compiler + ADSR) and `EnvelopeGenerator`. Renamed from kol-controls 2026-09-27 |
| `@kolkrabbi/kol-controls` | **0.4.0** | **Deprecated** — a re-export of `kol-hardware`, so existing imports resolve until consumers move |
| `@kolkrabbi/kol-chess` | **0.10.0** | Chess apparatus — interactive board, 3 piece sets, playback/notation/sidelines, archive, rail blocks |
| `@kolkrabbi/kol-content` | **0.15.0** | CMS — `/stack` (blog) + `/work` (portfolio) streams |
| `@kolkrabbi/kol-foundry` | **0.13.0** | Type-specimen apparatus — typeface hero, variable-axis playground, glyph metrics |
| `@kolkrabbi/kol-store` | **0.3.1** | Commerce — product-detail layout, price display, marquee river |
| `@kolkrabbi/kol-styleguide` | **0.14.0** | Brand-guide specimens — color anatomy, combo lab, logo construction, type blocks — the brand tool (`Brand`: the brand book over one manifest) and `BrandGuide` (the guide outline over a manifest) |
| `@kolkrabbi/kol-resume` | **0.1.1** | The resume kit — the resume in three treatments, cover · letter · portfolio · back, the A4 and continuous kit, its options and PDF export (`kitExportPlugin` from `/vite`, the `kol-resume-pdf` bin); carried from kol-website apps/record. The person comes through `ResumeProvider` — nobody's details ship |
| `@kolkrabbi/kol-notes` | **0.2.0** | Notes — a note is a database row with a markdown body: the catalog, the editor in the page, the whole tool over a consumer-injected client. Opens on a blank note (`NEW_NOTE`) |
| `@kolkrabbi/kol-deck` | **0.2.1** | Decks — the shelf, the deck editor, present and export (PDF · PNG · PPTX) over a consumer-injected client. Opens on a blank deck (`NEW_DECK`) |

## Engine tier

Plain JS — no React, no DOM, no UI dependencies (ARCHITECTURE §3, 2026-09-28). kol-markdown depends on kol-search since 0.1.1 (the tag graph is the index's).

| Package | Version | Job |
|---|---|---|
| `@kolkrabbi/kol-markdown` | **0.2.0** | The markdown engine — parser, frontmatter read + lossless round-trip, inventory, tag counts (co-occurrence moved to kol-search, adapter kept). One copy of what kol-workshop, kol-component and kol-notes each carried |
| `@kolkrabbi/kol-search` | **0.3.0** | The search engine — query language (filters, aliases, negation, phrases, dates, smart terms), ranking with reasons, disjunctive facets, the tag graph (`tagGraph`) |
| `@kolkrabbi/kol-print` | **0.1.0** | The print engine — markdown → the Kolkrabbi A4 sheets → PDF (Chrome or the browser's print) · DOCX · MD; the `kol-print` CLI. The studio's details are the caller's |

## Other tiers

| Package | Version | Job |
|---|---|---|
| `@kolkrabbi/design-editor` | **0.23.0** | **App tier — the one BUILT package** (ARCHITECTURE §4 exception, 2026-09-03). The whole editor as `<DesignEditor />`; moved in from kol-fxr, which had published it unversioned by any gate. Since 0.14.0 also `/core` (no layer packs) and one subpath per pack — `/generators` · `/effects` · `/motion` |
| `@kolkrabbi/kol-media-client` | **0.7.0** | Client for the kol-media CDN — read, plus `prepareUpload` |
| `@kolkrabbi/kol-brand-template` | **0.4.0** | Brand-manifest schema + house defaults + CSS generator + the brand guide outline |
| `@kolkrabbi/kol-brand` | **0.2.0** | Kolkrabbi's brand manifest (ramps, type) — a mirror of kol-website apps/brand; the marks moved to kol-icons `identity/` |
| `@kolkrabbi/kol-scrape` | **0.1.0** | Presence/press scraper CLI |

## Excluded

- `@kolkrabbi/kol-loader` **0.3.0** — **deprecated on the registry 2026-07-30** ("Superseded by @kolkrabbi/kol-icons"); the orphan is closed.
- `@kolkrabbi/kol-specimen` **0.1.0** — subset-twin of `kol-foundry` (the canonical package, ruled 2026-07-15); lives outside this repo, pending `npm deprecate`.
