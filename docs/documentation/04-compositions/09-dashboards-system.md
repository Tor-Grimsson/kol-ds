---
title: Dashboards system
type: reference
status: canonical
created: 2026-07-31
updated: 2026-11-04
verified: 2026-07-09
description: Hand-rolled SVG charts and the dashboard grid
aliases:
  - dashboards
  - kol-dashboards
  - metrics
  - charts
  - analytics
sources:
  - packages/dashboards/src/index.js
  - packages/dashboards/README.md
  - showcase/src/sets/metrics-dashboard.jsx
tags:
  - domain/compositions
  - domain/dashboards
  - domain/layout
related:
  - "[[../00-overview/01-package-topology|package topology]]"
  - "[[08-chess-system|chess system]]"
---

# Dashboards system — `@kolkrabbi/kol-dashboards`

The dashboards / analytics system — hand-rolled SVG visualisations (**no d3**), a card family, a responsive grid, and the composed `MetricsDashboard`. Lifted out of `kol-component` on 2026-07-09 because it's consumed by every repo with a metrics/analytics view and versions on its own cadence.

```js
import { MetricsDashboard } from '@kolkrabbi/kol-dashboards'
```

## Component index

### The card set (0.9.0 — metric's look)

One card system for every dashboard, carried from metric's app code (DashboardCardSet, 2026-11-03). Phone rules are built in, min-width steps only.

| Component | Main props | What it is |
|-----------|-----------|-----------|
| `Card` | `title` · `tabs` + `tab` + `onTab` (a tab with `options` opens a `Menu`, `search` + `empty`) · `controls` · `onExpand` · `footLeft` · `footRight` · `footPad` | the card: the title or tab row ON the header's rule, controls right, a body that fills, a foot. `Card.Head` is the header alone |
| `RankedList` | `rows` (`{ key?, label, value, icon?, display?, prev?, disabled? }`) · `total` · `column` · `valueLabel` · `onPick(row)` · `limit` (9) · `empty` · `loading` · `format` | ranked rows: a share bar behind the label, value right, share % on hover, trend arrow from `prev`; labels 14 under md, wrap to 2 lines |
| `StatTiles` | `items` (`{ key?, label, value, color?, note?, delta? }`) · `size` sm \| lg · `selected` + `onSelect` · `columns` | number tiles, static or selectable, any count — sm inside a card body (2 across under sm), lg as a section's head (2 · 3 · 6) |
| `DetailsOverlay` | `open` · `onClose` · `title` · `columns` (`{ key, label, fmt? }`) · `rows` · `loading` | the expanded view: FullscreenOverlay, search, sortable columns |

### The float cards (0.10.0 — the float style, W7)

The float look on the card set and the card kinds the exploration added (float-everything W7 rows 95–114, 2026-11-04; the gap map in kol-float--style). One recipe, worn inline from kol-theme ≥ 0.211.0: a 20 sheet (`--kol-float-menu-r`) on the secondary surface, no rim, Inter through the `kol-float-*` roles with JetBrains Mono for numbers, a sunken pill or field in `--kol-float-well`, selection at fg-16, hover fg-08, the 2px `--kol-float-focus` ring. Rows a group card holds are `TaskCard size="sm"`; the live dot in `LiveCard` is drawn inline until W2's `LiveDot` lands.

| Component | Main props | What it is |
|-----------|-----------|-----------|
| `Card variant="float"` | `title` · `count` · `meta` · `description` · `value` · `controls` · `onFold` + `folded` · `addLabel` + `onAdd` | the float sheet: a `SectionHead`, the body, the add row (+ label ↵); `folded` keeps the head alone — the collapsed group |
| `StatTiles variant="float"` | items add `spark` (numbers) · `size` lg \| sm · `selected` + `onSelect` | lg: label · value in mono 32 · `delta` + `note` with a `Sparkline` right; sm: label left, value in Inter 24 right, the window in mono under |
| `RankedList variant="float"` | as the default | the rows in Inter, the share bar at the 8 list round, fg-16 on hover |
| `SectionHead` | `title` · `count` · `meta` · `description` · `value` · `controls` · `folded` · `onFold` | a float card's head — Card float draws it; exported for a card with its own body |
| `FoldedHead` | `title` · `count` · `onClick` | a folded card's heading as a 40 pill with ⌄ |
| `FloatCard` | `title` · `support` · `lines` | the glass sheet (`.kol-float-glass-dark`): title, support, a rule, mono lines |
| `TaskCard` | `title` · `group` · `date` · `chip` · `done` + `onToggle` · `selected` · `onClick` · `size` lg \| sm | a task: checkbox, title, group, the date pill; sm is a group's row with a date or a size chip |
| `SourceCard` | `code` · `title` · `meta` · `status` · `message` · `detail` · `action` + `onAction` · `children` | a connected source and its state; a healthy one lists its items (`meta` "4 items", rows as `children`) |
| `CaptureCard` | `image` \| `src` · `title` · `meta` · `onPrev` · `onNext` · `action` + `onAction` · `onOpen` | a captured screen: the image at 5:3, title, age, →; no image = a text capture with ← → and an action ("Archive") in a row under the meta |
| `KanbanColumn` | `title` · `count` · children | a board lane in the well holding cards |
| `ProjectCard` | `eyebrow` · `status` · `title` · `description` · `progress` (`{ label, pct, note }`) · `action` + `onAction` | a project: eyebrow + status, name, line, the 6px completion line, one action |
| `LinkCard` | `title` · `meta` · `href` \| `onClick` | an outbound link as a 66 row with ↗ |
| `CoverTile` | `cover` \| `src` · `title` · `author` · `width` (192) · `onClick` | a book as its 5:7 jacket with the caption under |
| `ContinueCard` | `cover` \| `src` · `eyebrow` · `title` · `author` · `page` · `pct` · `resume` + `onResume` · `lastRead` | pick the book up: cover, chapter, title, progress, resume |
| `AssetRow` | `thumb` \| `src` · `name` · `meta` · `selected` · `onSelect` | an asset as a 54 row: thumbnail, name, meta, ✓ |
| `LiveCard` | `label` · `value` · `unit` · `peak` · `insight` · `note` | right now: live dot, the count, the peak badge, one insight |
| `NoteCard` | `eyebrow` · children · `onClick` | a reading note with its page |
| `PositionBlock` | `eyebrow` · `title` · `page` · `pct` · `onClick` | the saved place: chapter, page, the 4px line |

### Cards (the older family)

| Component | What it is |
|-----------|-----------|
| `DashMetricCard` | single-metric tile (value + delta + optional sparkline) |
| `DashStackedBarCard` | stacked-bar breakdown card |
| `DashChartCard` | chart-hosting card (any chart primitive) |
| `DashListCard` | ranked / itemised list card |
| `DashFeaturedCard` | oversized hero metric card |
| `DashAlertCard` | status / alert card |
| `DashSlotCard` | generic slot card (bring your own body) |
| `DashTableCard` | tabular card |

### Chart primitives (SVG, no d3)

| Component | What it is |
|-----------|-----------|
| `LineChart` | line / area series. `variant="float"` (W10 row 153, 0.10.0): the metric selector (`tabs` + `tab` + `onTab`), a `Legend` from `legend` + `interval`, the y scale with a grid rule per label (or `rules`), a `dashed` series for the previous period, `peak`; the record card form is `Card variant="float"` around it |
| `DonutChart` | donut / ring breakdown |
| `Sparkline` | inline trend line (`strokeWidth`); the stat tile's trend in `StatTiles variant="float"` (row 154) |
| `Legend` | a series key — a 16 × 2 swatch per `items` `{ label, color?, dashed? }`, `interval` at the end (row 157) |
| `WeeklyBars` | a rhythm as bars — `weeks` `{ count, label, current? }`, the current week in the ink (row 155) |
| `ProportionBar` | one 8px bar split into `segments` `{ value, color?, label? }` down the ink ladder (row 156) |
| `Heatmap` | grid heatmap |
| `Histogram` | binned distribution |
| `ScatterPlot` | XY scatter |
| `Candlestick` | OHLC candlestick |

### Layout, shared & compositions

| Export | What |
|--------|------|
| `DashboardGrid`, `GridCard` | responsive grid (container queries) + grid cell |
| `DashTooltip`, `useChartTooltip` | shared hover tooltip + hook |
| `useCountUp` | count-up animation hook |
| `formatMetric`, `formatCompact`, `formatPercent`, `formatDelta` | number formatters |
| `MetricsDashboard` | the full site / project / infra / sessions apparatus |
| `RANGES`, `DEPLOY_STATE_COLORS`, `DEPLOY_STATE_LABELS`, `TYPE_COLORS`, `PALETTE`, `MILESTONE_COLORS`, `formatB2Size`, `timeAgo` | view-level tokens + formatters |

## Injection seam

`MetricsDashboard` is presentation only — **all data is injected**:

```jsx
<MetricsDashboard data={metricsBag} milestones={MILESTONES} mainHost="example.com" />
```

`data` carries `{ siteData, allHosts, host, setHost, projectData, sanityData, deploys, b2Data, error, range, setRange, hostSummaries }`. The consumer owns the fetch/mock adapter; importing `RANGES` keeps the range→ms mapping single-sourced. No favicon writes, no `/api/*` self-fetch — those were severed during the extraction (ARCHITECTURE §3).

## Consumer notes

- **Data is injected** — the apparatus never fetches; the consumer supplies the adapter.
- **Shared primitives stay in `kol-component`** — this package depends on `kol-component` + `kol-icons` + `kol-theme`.
- **No d3** — every chart is hand-rolled SVG; `react` / `react-dom` are the only peers.
- **CSS** ships in `@kolkrabbi/kol-theme` (`kol-components-dashboards.css`) — this package ships JS only. Vite + Tailwind v4 consumer (`@source "…/node_modules/@kolkrabbi/kol-dashboards/src"` — Tailwind skips `node_modules`, or the utilities never generate).
- Live dashboard: `showcase/src/sets/metrics-dashboard.jsx`.
