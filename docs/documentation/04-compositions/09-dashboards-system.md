---
title: Dashboards system — the analytics package
type: reference
status: canonical
updated: 2026-07-09
verified: 2026-07-09
description: Component index and consumer guide for @kolkrabbi/kol-dashboards — hand-rolled SVG charts (no d3), the card family, a responsive dashboard grid, and the composed MetricsDashboard apparatus, lifted out of kol-component on 2026-07-09. Presentation only; all data is consumer-injected.
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
  - domain/design-system
  - domain/dashboards
related:
  - "[[01-package-topology|package topology]]"
  - "[[08-chess-system|chess system]]"
---

# Dashboards system — `@kolkrabbi/kol-dashboards`

The dashboards / analytics system — hand-rolled SVG visualisations (**no d3**), a card family, a responsive grid, and the composed `MetricsDashboard`. Lifted out of `kol-component` on 2026-07-09 because it's consumed by every repo with a metrics/analytics view and versions on its own cadence.

```js
import { MetricsDashboard } from '@kolkrabbi/kol-dashboards'
```

## Component index

### Cards

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
| `LineChart` | line / area series |
| `DonutChart` | donut / ring breakdown |
| `Sparkline` | inline trend line |
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

## The content-injection seam

`MetricsDashboard` is presentation only — **all data is injected**:

```jsx
<MetricsDashboard data={metricsBag} milestones={MILESTONES} mainHost="example.com" />
```

`data` carries `{ siteData, allHosts, host, setHost, projectData, sanityData, deploys, b2Data, error, range, setRange, hostSummaries }`. The consumer owns the fetch/mock adapter; importing `RANGES` keeps the range→ms mapping single-sourced. No favicon writes, no `/api/*` self-fetch — those were severed during the extraction (ARCHITECTURE §3).

## Consumer notes

- **Data is injected** — the apparatus never fetches; the consumer supplies the adapter.
- **Shared primitives stay in `kol-component`** — this package depends on `kol-component` + `kol-icons` + `kol-theme`.
- **No d3** — every chart is hand-rolled SVG; `react` / `react-dom` are the only peers.
- **CSS** ships in `@kolkrabbi/kol-theme` (`kol-components-dashboards.css`) — this package ships JS only. Vite + Tailwind v4 consumer (`@source "…/node_modules/@kolkrabbi/kol-dashboards/src"`).
- Live dashboard: `showcase/src/sets/metrics-dashboard.jsx`.
