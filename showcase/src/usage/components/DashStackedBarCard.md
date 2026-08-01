# DashStackedBarCard

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** cards
- **Real-world usages found:** 10 across 7 files in 2 apps
- **Weighted inbound:** 21★ across 7 edges — 7×3★
- **Used in:** kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 2 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardAnalysis.jsx` |
| 3 | 2 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx` |
| 3 | 2 | `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/MetricsLive.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessMetrics.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/Metrics.jsx` |

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
