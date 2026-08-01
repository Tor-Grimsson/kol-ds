# Heatmap

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** charts
- **Real-world usages found:** 8 across 6 files in 2 apps
- **Weighted inbound:** 18★ across 6 edges — 6×3★
- **Used in:** kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 2 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx` |
| 3 | 2 | `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/MetricsLive.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessMetrics.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/Metrics.jsx` |

## Import

```jsx
import { Heatmap } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<Heatmap
        data={f.activityHeatmap}
        rows={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
        cols={Array.from({ length: 24 }, (_, i) => i % 6 === 0 ? `${i}h` : '')}
        fill
      />
```

From `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx`:

```jsx
<Heatmap
              data={sampleHeatmapData}
              rows={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
              cols={['Morning', 'Midday', 'Afternoon', 'Evening', 'Night', 'Late']}
            />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx`:

```jsx
<Heatmap
                  data={sampleHeatmapData}
                  rows={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                  cols={['Morning', 'Midday', 'Afternoon', 'Evening', 'Night', 'Late']}
                />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/MetricsLive.jsx`:

```jsx
<Heatmap data={deployHeatmap} rows={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']} cols={Array.from({ length: 24 }, (_, i) => i % 6 === 0 ? `${i}h` : '')} fill />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx`:

```jsx
<Heatmap data rows[] cols[] colorScale? />
```
