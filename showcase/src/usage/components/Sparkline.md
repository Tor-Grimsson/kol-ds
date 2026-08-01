# Sparkline

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** charts
- **Real-world usages found:** 26 across 6 files in 2 apps
- **Weighted inbound:** 22★ across 6 edges — 4×4★ · 2×3★
- **Used in:** kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 6 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx` |
| 4 | 6 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/MetricsLive.jsx` |
| 4 | 6 | `kol-website/apps/web/src/routes/Metrics.jsx` |
| 4 | 6 | `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessMetrics.jsx` |

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
