# GridCard

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** layout
- **Real-world usages found:** 93 across 13 files in 3 apps
- **Used in:** kol-labs-monorepo, kol-monitor, kol-website

## Import

```jsx
import { GridCard } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<GridCard key={`slot-${idx}`} span={span}>
        {contents[0].jsx}
      </GridCard>
    )
  }

  return (
    <>
      <DesPage
        title="Chess Metrics"
        subtitle="Explore chess performance data with period-based filtering."
        meta="Metrics • Dashboard • Interactive data"
      />
```

From `kol-apps/kol-monitor/src/pages/CreatePage.jsx`:

```jsx
<GridCard
                        title={m.label}
                        detail={`${m.hp}HP ${m.u}U — ${m.category}`}
                        preview={<img src={`/previews/modules/${m.type}.png`} alt={m.label} />
```

From `kol-website/apps/web/src/routes/workshop/ChessMetrics.jsx`:

```jsx
<GridCard key={`slot-${idx}`} span={span}>
        {contents[0].jsx}
      </GridCard>
    )
  }

  return (
    <div>
      <PageSection
        id="chess-metrics"
        label="Metrics • Dashboard • Interactive data"
        title="Chess Metrics"
        body="Explore chess performance data with period-based filtering."
      />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardAnalysis.jsx`:

```jsx
<GridCard span="1x2">
            <DashStackedBarCard
              className="h-full"
              title="Last 12 months"
              value={`${metrics.winRate.toFixed(1)}% win rate`}
              data={stackedBarData}
            />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardAnalysis.jsx`:

```jsx
<GridCard span="2x1">
            <div className="grid grid-cols-2 gap-4 h-full">
              <DashMetricCard
                className="h-full"
                label="Win rate"
                value={`${metrics.winRate.toFixed(1)}%`}
                delta={`${metrics.wins.toLocaleString()} wins`}
                borderColor="var(--kol-palette-green)"
              />
```
