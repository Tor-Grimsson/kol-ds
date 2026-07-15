# Heatmap

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** charts
- **Real-world usages found:** 8 across 6 files in 2 apps
- **Used in:** kol-labs-monorepo, kol-website

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
