# ScatterPlot

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** charts
- **Real-world usages found:** 7 across 5 files in 2 apps
- **Used in:** kol-labs-monorepo, kol-website

## Import

```jsx
import { ScatterPlot } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<ScatterPlot data={f.scatterPoints.filter((p) => p.x <= 720)}
        maxX={720} maxY={f.scatterScale.maxY}
        xLabels={[60, 180, 300, 600]} yLabels={[1000, 1500, 2000, 2500]} />
```

From `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx`:

```jsx
<ScatterPlot
              data={sampleScatterData}
              maxX={120}
              maxY={2000}
              xLabels={[20, 40, 60, 80, 100]}
              yLabels={[500, 1000, 1500, 2000]}
              pointColor="var(--kol-palette-blue)"
            />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx`:

```jsx
<ScatterPlot
                  data={sampleScatterData}
                  maxX={120}
                  maxY={2000}
                  xLabels={[20, 40, 60, 80, 100]}
                  yLabels={[500, 1000, 1500, 2000]}
                  pointColor="var(--kol-palette-blue)"
                />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardPerformance.jsx`:

```jsx
<ScatterPlot
              data={scatterPoints.filter(p => p.x <= 720)}
              maxX={720}
              maxY={scatterScale.maxY}
              xLabels={[60, 180, 300, 600]}
              yLabels={[1000, 1500, 2000, 2500]}
            />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx`:

```jsx
<ScatterPlot data[] maxX maxY xLabels[] yLabels[] pointColor? />
```
