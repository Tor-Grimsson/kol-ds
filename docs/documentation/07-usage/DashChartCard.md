# DashChartCard

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** cards
- **Real-world usages found:** 55 across 9 files in 2 apps
- **Used in:** kol-labs-monorepo, kol-website

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

From `kol-website/apps/web/src/routes/Metrics.jsx`:

```jsx
<DashChartCard className="h-full" title="Devices" subtitle="Breakdown">
          <div className="flex justify-center py-2">
            <DonutChart
              segments={devices.length > 0 ? devicesToSegments(devices) : [{ value: 1, label: 'No data', color: 'var(--kol-palette-blue)' }]}
              size={120}
              thickness={20}
              centerLabel={totalSessions}
              showLegend
            />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

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
