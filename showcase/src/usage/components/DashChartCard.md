# DashChartCard

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** cards
- **Real-world usages found:** 55 across 9 files in 2 apps
- **Weighted inbound:** 33★ across 9 edges — 6×4★ · 3×3★
- **Used in:** kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 16 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx` |
| 4 | 16 | `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx` |
| 4 | 6 | `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx` |
| 4 | 6 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessMetrics.jsx` |
| 4 | 3 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardMetrics.jsx` |
| 4 | 3 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardPerformance.jsx` |
| 3 | 2 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/MetricsLive.jsx` |
| 3 | 2 | `kol-website/apps/web/src/routes/Metrics.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardAnalysis.jsx` |

## Import

```jsx
import { DashChartCard } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashChartCard className="h-full" title="Rating trend" subtitle="Average player rating by month">
      <LineChart
        data={l.ratingTrend.map(d => ({ y: d.count }))}
        xLabels={l.ratingTrend.filter((_, i, arr) => i === 0 || i === arr.length - 1 || i === Math.floor(arr.length / 2)).map(d => formatMonthLabel(d.range))}
        fill showArea
      />
```

From `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessMetrics.jsx`:

```jsx
<DashChartCard className="h-full" title="Rating distribution" subtitle="Player rating buckets (100-point intervals)">
      <Histogram data={f.ratingHistogram} barColor="var(--kol-palette-teal)" />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashChartCard className="h-full" title="Opponent strength vs time control"
      subtitle="Avg opponent rating per time control" icon="stopwatch">
      <ScatterPlot data={f.scatterPoints.filter((p) => p.x <= 720)}
        maxX={720} maxY={f.scatterScale.maxY}
        xLabels={[60, 180, 300, 600]} yLabels={[1000, 1500, 2000, 2500]} />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashChartCard className="h-full" title="Opponent rating spread" subtitle="Binned by 100 points">
      <Histogram data={f.opponentHistogram} barColor="var(--kol-palette-teal)" />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashChartCard className="h-full" title="Activity heatmap"
      subtitle="Games played by day and hour (UTC)">
      <Heatmap
        data={f.activityHeatmap}
        rows={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
        cols={Array.from({ length: 24 }, (_, i) => i % 6 === 0 ? `${i}h` : '')}
        fill
      />
```
