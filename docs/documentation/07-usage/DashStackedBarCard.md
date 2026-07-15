# DashStackedBarCard

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** cards
- **Real-world usages found:** 10 across 7 files in 2 apps
- **Used in:** kol-labs-monorepo, kol-website

## Import

```jsx
import { DashStackedBarCard } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashStackedBarCard className="h-full" title="Mode focus" icon="chess-rook"
        value={`${top?.percent ?? 0}%`} label={top?.label ?? 'Mode'} trend="up"
        data={l.compactStackedData}
        footerLeft={`${l.monthsTracked} months`} footerRight="Game history" />
```

From `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx`:

```jsx
<DashStackedBarCard
                title="WIN RATE"
                value="47.1%"
                data={sampleStackedBarData}
              />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardAnalysis.jsx`:

```jsx
<DashStackedBarCard
              className="h-full"
              title="Last 12 months"
              value={`${metrics.winRate.toFixed(1)}% win rate`}
              data={stackedBarData}
            />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardAnalysis.jsx`:

```jsx
<DashStackedBarCard
              className="h-full"
              title="Mode focus"
              icon="chess-rook"
              value={`${shareWithDisplay[0]?.percent ?? 0}%`}
              label={shareWithDisplay[0]?.label ?? 'Mode'}
              trend="up"
              data={compactStackedData}
              footerLeft={`${analyticsSnapshot.monthlySummary.length} months`}
              footerRight="Game history"
            />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx`:

```jsx
<DashStackedBarCard
                    title="WIN RATE"
                    value="47.1%"
                    data={sampleStackedBarData}
                  />
```
