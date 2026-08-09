---
title: Package topology
type: reference
status: canonical
created: 2026-07-31
updated: 2026-08-01
verified: 2026-07-09
description: The eleven UI packages and the clients tier
aliases:
  - package map
  - topology
  - which package
sources:
  - packages/component/src/index.js
  - packages/foundry/src/index.js
  - packages/store/src/index.js
  - .kol/llm-context/ARCHITECTURE.md
tags:
  - domain/architecture
  - audience/consumer
related:
  - "[[../04-compositions/04-workshop-system|workshop system]]"
  - "[[../04-compositions/05-foundry-system|foundry component index]]"
  - "[[../04-compositions/06-store-system|store component index]]"
  - "[[../04-compositions/07-content-system|content system]]"
  - "[[../04-compositions/08-chess-system|chess system]]"
  - "[[../04-compositions/09-dashboards-system|dashboards system]]"
  - "[[../04-compositions/10-styleguide-system|styleguide system]]"
---

# Package topology

Eleven UI packages plus a clients tier. Every content/domain system that was drifting, faked, or crammed into `kol-component` is now its own published package. The rule (ARCHITECTURE §3): a package earns standalone status when it's **reused across consumers** and **versions on its own cadence**; general primitives stay in `kol-component` and domain packages depend on them.

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
| | `@kolkrabbi/kol-foundry` | type-specimen apparatus — see [[05-foundry-system]] |
| | `@kolkrabbi/kol-store` | commerce — see [[06-store-system]] |
| | `@kolkrabbi/kol-styleguide` | brand guide — colour anatomy + combo lab, logo construction, mood tiles, type blocks — see [[10-styleguide-system]] |
| **Clients** | `@kolkrabbi/kol-*-client` | headless service SDKs (one per contract) |

**Static assets (ARCHITECTURE §7, 2026-07-15):** ONE `public/` at the repo root (fonts, images, favicons) — every app points at it via Vite `publicDir: '../public'`; symlink only for tools that can't be configured. Never a second per-app `public/`.

## Shared core

The domain packages import these — they are **not** duplicated:

- **Form/atoms:** `Button`, `Input`, `Dropdown`, `Slider`, `Tag`, `Pill`, `Divider`, `Avatar`, `QuantityInput`, `SegmentedToggle`, `ToggleSwitch`, `CopyButton` _(`PriceDisplay` moved to store)_
- **Molecules/organisms:** `Table`, `Image`, `CodeBlock`, `ImageBlock`, `VideoBlock`, `SpecList`, `TabsRow`, `ContentFilters`, `DropdownTagFilter`, `ShellSearchOverlay`, `GalleryCarousel`, `DocsToc`
- **Hooks:** `usePrefersReducedMotion`, `useAxisAnimation`, `useScrollSpy`

Filtering (`ContentFilters`/`DropdownTagFilter`), search (`ShellSearchOverlay`), and the embla wrapper (`GalleryCarousel`) are **core** — used by 7–10 consumers — and stay here on purpose.

## Domain index

Per-package READMEs carry the authoritative tables; the dedicated docs are linked above.

| Package | Components |
|---------|-----------|
| **chess** | `ChessAnalysisLayout`, `ChessBoard`(+WithControls/WithSidebar/Fullscreen), `ChessSidebar`, `GameSelector`, `NotationPanel`, `PlaybackControls`, `VariationTree`, `ChessPiece`, `ChessHero`, `ChessControlsProvider`, `buildMoveTree`; data adapter at `@kolkrabbi/kol-chess/data` |
| **dashboards** | `DashMetricCard`/`DashChartCard`/`DashListCard`/`DashFeaturedCard`/`DashTableCard`/`DashStackedBarCard`/`DashAlertCard`/`DashSlotCard`, `LineChart`/`DonutChart`/`Sparkline`/`Heatmap`/`Histogram`/`ScatterPlot`/`Candlestick`, `DashboardGrid`, `MetricsDashboard` |
| **content** | Stack: `StackHero`, `ArticleHeader`, `AuthorLine`, `ArticleCard`, `PortableTextRenderer`, `ShareButtons`, `SourcesReferences`. Work: `WorkCard`, `WorkListItem`, `WorkViewToggle`, `ParallaxShelf`, `ScrollDriftGallery` |
| **foundry** | see [[05-foundry-system]] — specimen tools (hero, axes, glyph metrics, character sets, preview) + typeface-catalog grid + `TypefaceSpecimenPage` composition + glyph data & `typefaceConfig` fixture. Moved in from `kol-component` 2026-07-09 (they pass the live-font membership test): `TypeSample`, `TypeSpecCard`, `TextPressure`, `ColorLoader` |
| **store** | see [[06-store-system]] — `ProductDetailLayout`, `PriceDisplay`, `DiagonalMarqueeRiver`, `PrintsGrid`, `PrintGridCard`, `PrintGridCardGsap`, `PrintBuyButton`; `./data` demo catalog subpath. (The "Drift" gallery reuses content's `ScrollDriftGallery` — not duplicated here.) |

## Dependencies

- `d3` → workshop (tag graph). `chess.js` → chess. `embla-carousel-react` → content. `gsap` (peer) → content + store. `framer-motion` (peer) → foundry (ColorLoader). `opentype.js` (optional peer) → specimen.
- Every domain package depends on `kol-component` + `kol-theme` (+ `kol-icons` where it renders icons). CSS always lives in `kol-theme`; packages ship JS (+ SVG assets for chess).

## Cascade contract

Consumer import order is `tailwindcss` → `kol-theme` → `kol-brand-color.css` → `kol-framework.css`, and the framework import **must** carry `layer(components)`:

```css
@import "@kolkrabbi/kol-framework/kol-framework.css" layer(components);
```

Unlayered rules outrank every layered rule regardless of specificity or source order, so a bare import promotes framework chrome above the theme's type layer — two consumers then render the same package version differently (2026-07-30: shell header tabs came out 16px in the showcase, 14px on kol-website, identical CSS). Corollary: **a component's type belongs in its own CSS rule, never as a `kol-mono-*` utility class on the element** — equal specificity means load order picks the winner. See [[../../../.kol/llm-context/ARCHITECTURE|ARCHITECTURE §5]].
