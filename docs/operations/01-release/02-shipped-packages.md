---
title: Shipped packages
type: reference
status: active
created: 2026-08-01
updated: 2026-11-08
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
| `@kolkrabbi/kol-theme` | **0.216.1** | Foundation CSS — tokens, type classes, all component chrome |
| `@kolkrabbi/kol-icons` | **0.66.0** | `<Icon>` + kol-icon-set-interface + kol-icon-set-signal + kol-icon-set-identity + kol-icon-set-external, plus `registerIcons` for bring-your-own; `KOL_ICON_TAGS` search tags |
| `@kolkrabbi/kol-component` | **0.351.0** | The components — atoms → molecules → organisms → utilities + `<Graphic>`, `SwatchCaption` (0.351.0: the name · value · meta block under a swatch), `SwatchTile` (0.350.0: a ColorSwatch with its name and value — tile · grid · fixed), `ModalHeader` (0.349.0: the top row of a float sheet or modal — MoreRows' account row, PanelsMenu's title), `MenuList` (0.348.0: the rows of every menu — Menu, Dropdown, ContextMenu render it), and `NavRail` (app · site · top · float), `useRailKeys` (the rail keys); `CommandOverlay` (0.344.0: one search style — the float card everywhere, `tabs`, `anchor`, the key-hint foot); the float windows, rows and tables; the generator settings window (`Dialog variant="settings"` + the `Settings*` controls); the float calendar (Calendar…) and reader (Reading…) |
| `@kolkrabbi/kol-framework` | **0.70.0** | Site shell — `SiteLayout` (the site frame; `PageLayout` · `AppShell` alias it), `CategoryPage`, `SideNav` (alias of `NavRail variant="site"`), `ShellHeader`, `ThemeToggle` + `useTheme`, the page kit (`PageHero` · `PageSection`), footer; `WebsiteLayout` (kolkrabbi.io's frame, 0.62.0); the document kit (`MarkdownPage` · `DocumentIndex` · `DocumentHeader`, 0.68.0) |
| `@kolkrabbi/kol-shell` | **0.116.0** | Application shell — `MenuBar` (the app's menu bar inside the browser, menus as data; `variant="capsule"` the phone's menu capsule), `AppShell` (renders kol-component's `NavRail`, re-exported) (the phone bar, the app's one masthead), `AppHub` (Home and Settings opt-in), `AppStudio` (the workstation page set), page scaffolds, `GridCard`, settings/walkthrough/shortcuts; the float chrome (ToolRail (+ its ⋮ `more`, `orientation` horizontal for a phone; 0.113.0 the dock — a tool's ▾ `more`, `end`, the ⌘K `search` pill), PropertyRail (0.112.0: the tool Rail — ↗ `onExpand`, collapsible sections, labeled rows, `footer`, `density="compact"`), the transport's Timecode, DocumentCapsule, TopControlsBar, ReaderBar, ProgressDock, RailTrigger, RailFlyout, the workspace strips); `FloatLayout`, the float workspace frame (bottom Rail + eyebrow slots, `railMode` push · overlay, `railKeys`, `panels`, `search` on the float CommandOverlay, `bar.menu` = FloatActionMenu) |
| `@kolkrabbi/kol-workshop` | **0.45.0** | Docs/workshop system — the docs shell (per-space rails, one scroll region, the hub's settings rail, the S modal, hideable bars), the reader, `SearchPage`, the tag graph, exhibit sections; the engines moved to the engine tier (0.30.0), still re-exported |
| `@kolkrabbi/kol-dashboards` | **0.13.0** | Analytics — hand-rolled SVG charts (no d3), the card set (`Card` · `RankedList` · `StatTiles` · `DetailsOverlay`), the metric page's parts (`TopStats` · `Behaviours` · `TrendChart` · `WorldMap` and their pieces) and its float look (`variant="float"`, the float cards — the editor card: `tabs` · `foot` · `defaultFolded` · `radius` · `Legend` · `WeeklyBars` · `ProportionBar`), the older card family, `MetricsDashboard` |
| `@kolkrabbi/kol-hardware` | **0.10.0** | Hardware panel controls in five groups — value · switches · indicators · panel · frames — plus the signal engine (`./signal`: one expression compiler + ADSR) and `EnvelopeGenerator`. Renamed from kol-controls 2026-09-27 |
| `@kolkrabbi/kol-controls` | **0.4.0** | **Deprecated** — a re-export of `kol-hardware`, so existing imports resolve until consumers move |
| `@kolkrabbi/kol-chess` | **0.10.2** | Chess apparatus — interactive board, 3 piece sets, playback/notation/sidelines, archive, rail blocks |
| `@kolkrabbi/kol-content` | **0.15.0** | CMS — `/stack` (blog) + `/work` (portfolio) streams |
| `@kolkrabbi/kol-foundry` | **0.14.0** | Type-specimen apparatus — typeface hero, variable-axis playground, glyph metrics |
| `@kolkrabbi/kol-store` | **0.3.1** | Commerce — product-detail layout, price display, marquee river |
| `@kolkrabbi/kol-styleguide` | **0.24.0** | Brand-guide specimens — color anatomy, combo lab, logo construction, type blocks — the brand tool (`Brand`: the brand book over one manifest) and `BrandGuide` (the guide outline over a manifest) |
| `@kolkrabbi/kol-resume` | **0.2.0** | The resume kit — the resume in three treatments, cover · letter · portfolio · back, the A4 and continuous kit, its options and PDF export (`kitExportPlugin` from `/vite`, the `kol-resume-pdf` bin); carried from kol-website apps/record. The person comes through `ResumeProvider` — nobody's details ship |
| `@kolkrabbi/kol-notes` | **0.2.0** | Notes — a note is a database row with a markdown body: the catalog, the editor in the page, the whole tool over a consumer-injected client. Opens on a blank note (`NEW_NOTE`) |
| `@kolkrabbi/kol-deck` | **0.2.3** | Decks — the shelf, the deck editor, present and export (PDF · PNG · PPTX) over a consumer-injected client. Opens on a blank deck (`NEW_DECK`) |

## Engine tier

Plain JS — no React, no DOM, no UI dependencies (ARCHITECTURE §3, 2026-09-28). kol-markdown depends on kol-search since 0.1.1 (the tag graph is the index's).

| Package | Version | Job |
|---|---|---|
| `@kolkrabbi/kol-markdown` | **0.2.0** | The markdown engine — parser, frontmatter read + lossless round-trip, inventory, tag counts (co-occurrence moved to kol-search, adapter kept). One copy of what kol-workshop, kol-component and kol-notes each carried |
| `@kolkrabbi/kol-search` | **0.3.0** | The search engine — query language (filters, aliases, negation, phrases, dates, smart terms), ranking with reasons, disjunctive facets, the tag graph (`tagGraph`) |
| `@kolkrabbi/kol-growth` | **0.5.0** | The growing line — differential growth into a density field (`Growth`, `densityFrom`; `seed` takes a ring, `outline` / `pathRing` trace a shape's edge; the line cools by heat, `draw({ wave })`), `mulberry32`, the orb and SVG-path shape sources; kol-component's `GrowthLineStage` draws it, kol-fxr runs it in its loops |
| `@kolkrabbi/kol-print` | **0.1.1** | The print engine — markdown → the Kolkrabbi A4 sheets → PDF (Chrome or the browser's print) · DOCX · MD; the `kol-print` CLI. The studio's details are the caller's |

## Other tiers

| Package | Version | Job |
|---|---|---|
| `@kolkrabbi/design-editor` | **0.32.0** | **App tier — the one BUILT package** (ARCHITECTURE §4 exception, 2026-09-03). The whole editor as `<DesignEditor />`; moved in from kol-fxr, which had published it unversioned by any gate. Since 0.14.0 also `/core` (no layer packs) and one subpath per pack — `/generators` · `/effects` · `/motion`. 0.25.0 mirrors fxr's 2026-11-04 source; 0.26.0 carries the float `Timeline` (float-everything W12) and names `kol-hardware` a peer; 0.27.0 adds `TimelineRail` (the sheet from data, float-views W3.1); 0.27.1 closes the core → pack seam (`check:core` 0); 0.28.0 adds `FloatDesignEditor` — the editor in the float chrome (FloatEditorShell, `check:float` 0), kol-dashboards a peer; 0.29.0 the float Transform and Appearance cards, the inspector's Design · Motion · Effects, the phone's menu capsule and the generator windows (Generate · Repeat · Paratype letter); 0.30.0 carries fxr's generator and repeat engines verbatim (`src/generate/`, the `generate` · `repeat` layers) with every window control bound, and the tools' Rail form; 0.31.0 the float editor's bottom dock (View › Tools › Rail / Dock, the phone's default) and ⌘K (`FloatCommandSearch`, anchored on the dock), and `FloatLabsView` (Labs in the float chrome, A editor chrome · B floating nav); 0.32.0 `FloatLabsView` on kol-shell `FloatLayout` (the A · B switch gone) and the save state's check as an Icon |
| `@kolkrabbi/kol-media-client` | **0.7.0** | Client for the kol-media CDN — read, plus `prepareUpload` |
| `@kolkrabbi/kol-brand-template` | **0.4.0** | Brand-manifest schema + house defaults + CSS generator + the brand guide outline |
| `@kolkrabbi/kol-brand` | **0.2.0** | Kolkrabbi's brand manifest (ramps, type) — a mirror of kol-website apps/brand; the marks moved to kol-icons `identity/` |
| `@kolkrabbi/kol-scrape` | **0.1.0** | Presence/press scraper CLI |

## Excluded

- `@kolkrabbi/kol-loader` **0.3.0** — **deprecated on the registry 2026-07-30** ("Superseded by @kolkrabbi/kol-icons"); the orphan is closed.
- `@kolkrabbi/kol-specimen` **0.1.0** — subset-twin of `kol-foundry` (the canonical package, ruled 2026-07-15); lives outside this repo, pending `npm deprecate`.
