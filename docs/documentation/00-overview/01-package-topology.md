---
title: Package topology — the ten UI packages + clients tier
type: reference
status: canonical
updated: 2026-07-09
verified: 2026-07-09
description: The full KOL package map after the 2026-07-09 domain-extraction pass — the two foundation packages, the two core packages, the six standalone domain packages (workshop, dashboards, chess, content, specimen, store), and the clients tier. What each owns, what stays shared, and which component lives where.
aliases:
  - package map
  - topology
  - which package
sources:
  - packages/component/src/index.js
  - packages/specimen/src/index.js
  - packages/store/src/index.js
  - .kol/llm-context/ARCHITECTURE.md
tags:
  - domain/design-system
  - domain/architecture
related:
  - "[[04-workshop-system|workshop system]]"
  - "[[05-specimen-system|specimen component index]]"
  - "[[06-store-system|store component index]]"
  - "[[07-content-system|content system]]"
  - "[[08-chess-system|chess system]]"
  - "[[09-dashboards-system|dashboards system]]"
---

# Package topology

Ten UI packages plus a clients tier. Every content/domain system that was drifting, faked, or crammed into `kol-component` is now its own published package. The rule (ARCHITECTURE §3): a package earns standalone status when it's **reused across consumers** and **versions on its own cadence**; general primitives stay in `kol-component` and domain packages depend on them.

## The map

| Tier | Package | Owns |
|------|---------|------|
| **Foundation** | `@kolkrabbi/kol-theme` | all CSS — tokens, `.kol-prose`, per-component sheets (chess/dashboards/workshop/etc.) |
| | `@kolkrabbi/kol-icons` | `Icon` loader + `kol-icon-set-v1` |
| **Core** | `@kolkrabbi/kol-component` | general atoms → organisms + hooks (see below) |
| | `@kolkrabbi/kol-framework` | app shell — `AppShell`, `SideNav`, `ShellHeader`, `ThemeToggle`, `Layout`, `ScrollToTop` |
| **Domain** (standalone) | `@kolkrabbi/kol-workshop` | docs system — markdown engine, docs viewer, tag graph, shell |
| | `@kolkrabbi/kol-dashboards` | analytics — cards, SVG charts, `MetricsDashboard` |
| | `@kolkrabbi/kol-chess` | chess apparatus + pieces + `./data` adapter |
| | `@kolkrabbi/kol-content` | CMS — `/stack` (blog) + `/work` (portfolio) |
| | `@kolkrabbi/kol-specimen` | type-specimen apparatus — see [[05-specimen-system]] |
| | `@kolkrabbi/kol-store` | commerce — see [[06-store-system]] |
| **Clients** | `@kolkrabbi/kol-*-client` | headless service SDKs (one per contract) |

## What stays in `kol-component` (shared by the domain packages)

The domain packages import these — they are **not** duplicated:

- **Form/atoms:** `Button`, `Input`, `Dropdown`, `Slider`, `Tag`, `Pill`, `Divider`, `Avatar`, `QuantityInput`, `SegmentedToggle`, `ToggleSwitch`, `CopyButton` _(`PriceDisplay` moved to store)_
- **Molecules/organisms:** `Table`, `Image`, `CodeBlock`, `ImageBlock`, `VideoBlock`, `SpecList`, `TabsRow`, `ContentFilters`, `DropdownTagFilter`, `ShellSearchOverlay`, `GalleryCarousel`, `DocsToc`
- **Hooks:** `usePrefersReducedMotion`, `useAxisAnimation`, `useScrollSpy`

Filtering (`ContentFilters`/`DropdownTagFilter`), search (`ShellSearchOverlay`), and the embla wrapper (`GalleryCarousel`) are **core** — used by 7–10 consumers — and stay here on purpose.

## Domain-package component index

Per-package READMEs carry the authoritative tables; the dedicated docs are linked above.

| Package | Components |
|---------|-----------|
| **chess** | `ChessAnalysisLayout`, `ChessBoard`(+WithControls/WithSidebar/Fullscreen), `ChessSidebar`, `GameSelector`, `NotationPanel`, `PlaybackControls`, `VariationTree`, `ChessPiece`, `ChessHero`, `ChessControlsProvider`, `buildMoveTree`; data adapter at `@kolkrabbi/kol-chess/data` |
| **dashboards** | `DashMetricCard`/`DashChartCard`/`DashListCard`/`DashFeaturedCard`/`DashTableCard`/`DashStackedBarCard`/`DashAlertCard`/`DashSlotCard`, `LineChart`/`DonutChart`/`Sparkline`/`Heatmap`/`Histogram`/`ScatterPlot`/`Candlestick`, `DashboardGrid`, `MetricsDashboard` |
| **content** | Stack: `StackHero`, `ArticleHeader`, `AuthorLine`, `ArticleCard`, `PortableTextRenderer`, `ShareButtons`, `SourcesReferences`. Work: `WorkCard`, `WorkListItem`, `WorkViewToggle`, `ParallaxShelf`, `ScrollDriftGallery` |
| **specimen** | see [[05-specimen-system]] — specimen tools (hero, axes, glyph metrics, character sets, preview) + typeface-catalog grid + `TypefaceSpecimenPage` composition + glyph data & `typefaceConfig` fixture |
| **store** | see [[06-store-system]] — `ProductDetailLayout`, `PriceDisplay`, `DiagonalMarqueeRiver`, `PrintsGrid`, `PrintGridCard`, `PrintGridCardGsap`, `PrintBuyButton`; `./data` demo catalog subpath. (The "Drift" gallery reuses content's `ScrollDriftGallery` — not duplicated here.) |

## Deps at a glance

- `d3` → workshop (tag graph). `chess.js` → chess. `embla-carousel-react` → content. `gsap` (peer) → content + store. `opentype.js` (optional peer) → specimen.
- Every domain package depends on `kol-component` + `kol-theme` (+ `kol-icons` where it renders icons). CSS always lives in `kol-theme`; packages ship JS (+ SVG assets for chess).
