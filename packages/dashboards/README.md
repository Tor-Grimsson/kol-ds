# @kolkrabbi/kol-dashboards

The KOL **dashboards / analytics system** — lifted out of `@kolkrabbi/kol-component` into its own package because it's a shared capability consumed by multiple apps (every repo with a metrics/analytics view), and it versions on its own cadence.

Hand-rolled SVG visualisations (**no d3**), a card family, a responsive dashboard grid, and the composed `MetricsDashboard` apparatus.

## What's in the box

| Import | What |
| --- | --- |
| `DashMetricCard`, `DashListCard`, `DashTableCard`, `DashChartCard`, `DashFeaturedCard`, `DashStackedBarCard`, `DashAlertCard`, `DashSlotCard` | the card family |
| `LineChart`, `DonutChart`, `Sparkline`, `Heatmap`, `Histogram`, `ScatterPlot`, `Candlestick` | SVG chart primitives |
| `DashboardGrid`, `GridCard` | responsive grid (container queries) |
| `MetricsDashboard` | the full site/project/infra/sessions apparatus |
| `RANGES`, `DEPLOY_STATE_COLORS`, `PALETTE`, `formatB2Size`, `timeAgo`, … | view-level tokens + formatters |

```js
import { MetricsDashboard } from '@kolkrabbi/kol-dashboards'
```

## The content-injection seam

`MetricsDashboard` is presentation only — **all data is injected** by the consumer:

```jsx
<MetricsDashboard data={metricsBag} milestones={MILESTONES} mainHost="example.com" />
```

`data` carries `{ siteData, allHosts, host, setHost, projectData, sanityData, deploys, b2Data, error, range, setRange, hostSummaries }`. The consumer owns the fetch/mock adapter; a `RANGES` import keeps the range→ms mapping single-sourced.

## Consumer requirements

- **CSS** ships in `@kolkrabbi/kol-theme` (`kol-components-dashboards.css`, in the theme aggregate) — this package ships JS only.
- Tailwind v4 `@source "…/node_modules/@kolkrabbi/kol-dashboards/src"` so utility classes used inside the components are generated — Tailwind skips `node_modules` when scanning, so without this line the grid/card layouts collapse.
