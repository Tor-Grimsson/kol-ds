# LineChart

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** charts
- **Real-world usages found:** 22 across 10 files in 2 apps
- **Weighted inbound:** 32★ across 10 edges — 2×4★ · 8×3★
- **Used in:** kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 6 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx` |
| 4 | 6 | `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx` |
| 3 | 2 | `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx` |
| 3 | 2 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessMetrics.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/assets/chess/dashboard/dashboard -chess.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardMetrics.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardPerformance.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/MetricsLive.jsx` |
| 3 | 1 | `kol-website/_tmp/packages-elder-flush/ui/assets/chess/dashboard/dashboard -chess.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/Metrics.jsx` |

## Import

```jsx
import { LineChart } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/chess/src/assets/chess/dashboard/dashboard -chess.jsx`:

```jsx
<LineChart data={analytics.ratingProgression}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
```

From `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessMetrics.jsx`:

```jsx
<LineChart
        data={l.ratingTrend.map(d => ({ y: d.count }))}
        xLabels={l.ratingTrend.filter((_, i, arr) => i === 0 || i === arr.length - 1 || i === Math.floor(arr.length / 2)).map(d => formatMonthLabel(d.range))}
        fill showArea
      />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<LineChart
        data={f.monthListItems.map(m => ({ y: parseFloat(m.value) || 0 }))}
        height={100} showArea
      />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx`:

```jsx
<LineChart
                  data={sampleLineData}
                  showArea
                  height={200}
                  xLabels={['Jan', 'Apr', 'Jul', 'Oct', 'Dec']}
                  yLabels={[1400, 1500, 1600]}
                />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx`:

```jsx
<LineChart
                  data={sampleLineData}
                  showArea
                  showDots
                  height={200}
                  xLabels={['Jan', 'Apr', 'Jul', 'Oct', 'Dec']}
                  yLabels={[1400, 1450, 1500, 1550]}
                />
```
