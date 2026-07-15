# LineChart

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** charts
- **Real-world usages found:** 22 across 10 files in 2 apps
- **Used in:** kol-labs-monorepo, kol-website

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

From `kol-website/apps/web/src/routes/workshop/ChessMetrics.jsx`:

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
