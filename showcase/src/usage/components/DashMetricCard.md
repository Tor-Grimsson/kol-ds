# DashMetricCard

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** cards
- **Real-world usages found:** 133 across 10 files in 2 apps
- **Weighted inbound:** 39★ across 10 edges — 9×4★ · 1×3★
- **Used in:** kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 30 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/MetricsLive.jsx` |
| 4 | 30 | `kol-website/apps/web/src/routes/Metrics.jsx` |
| 4 | 28 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardMetrics.jsx` |
| 4 | 12 | `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx` |
| 4 | 12 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessMetrics.jsx` |
| 4 | 6 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardAnalysis.jsx` |
| 4 | 6 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardPerformance.jsx` |
| 4 | 4 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx` |
| 4 | 4 | `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/workshop/DashboardMetricsSetup.jsx` |

## Import

```jsx
import { DashMetricCard } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashMetricCard className="h-full" label="Win rate" value={`${l.winRate.toFixed(1)}%`}
      delta={`${l.wins.toLocaleString()} wins`} borderColor="var(--kol-palette-green)" />
```

From `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessMetrics.jsx`:

```jsx
<DashMetricCard className="h-full" label="Draw rate" value={`${l.drawRate.toFixed(1)}%`}
      delta={`${l.draws.toLocaleString()} draws`} borderColor="var(--kol-palette-blue)" />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashMetricCard className="h-full" label="Avg rating" value={l.avgRating.toLocaleString()}
      delta={`Opp avg ${l.avgOpponentRating.toLocaleString()}`} borderColor="var(--kol-palette-purple)"
      sparkline={l.ratingTrend.length > 2
        ? <Sparkline data={l.ratingTrend.map(d => d.count)} height={28} fill color="var(--kol-palette-purple)" />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashMetricCard className="h-full" label="Total games" value={formatCompactNumber(l.totalGames)}
      delta={`${l.uniqueOpponents.toLocaleString()} opponents`} borderColor="var(--kol-palette-orange)" />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashMetricCard className="h-full" label="Months tracked" value={l.monthsTracked.toLocaleString()}
      delta="Continuous record" />
```
