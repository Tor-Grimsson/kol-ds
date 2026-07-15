# Sparkline

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** charts
- **Real-world usages found:** 26 across 6 files in 2 apps
- **Used in:** kol-labs-monorepo, kol-website

## Import

```jsx
import { Sparkline } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<Sparkline data={l.ratingTrend.map(d => d.count)} height={28} fill color="var(--kol-palette-purple)" />
```

From `kol-website/apps/web/src/routes/Metrics.jsx`:

```jsx
<Sparkline data={data.trend} height={24} fill color={borderColor} />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx`:

```jsx
<Sparkline data={sampleSparklineData} height={32} fill color="var(--kol-palette-green)" />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx`:

```jsx
<Sparkline data={sampleSparklineData} height={40} color="var(--kol-palette-yellow)" />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx`:

```jsx
<Sparkline data={sampleSparklineData} fill color="var(--kol-palette-yellow)" />
```
