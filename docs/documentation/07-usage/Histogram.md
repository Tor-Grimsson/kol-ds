# Histogram

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** charts
- **Real-world usages found:** 19 across 7 files in 2 apps
- **Weighted inbound:** 26★ across 7 edges — 5×4★ · 2×3★
- **Used in:** kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 4 | `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx` |
| 4 | 4 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessMetrics.jsx` |
| 4 | 3 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardAnalysis.jsx` |
| 4 | 3 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx` |
| 4 | 3 | `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardMetrics.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardPerformance.jsx` |

## Import

```jsx
import { Histogram } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<Histogram data={f.ratingHistogram} barColor="var(--kol-palette-teal)" />
```

From `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessMetrics.jsx`:

```jsx
<Histogram data={f.opponentHistogram} barColor="var(--kol-palette-teal)" />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<Histogram data={f.ratingHistogram.slice(0, 6)} barColor="var(--kol-palette-blue)" />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardAnalysis.jsx`:

```jsx
<Histogram data={ratingBuckets.slice(0, 5)} barColor="var(--kol-palette-blue)" />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardAnalysis.jsx`:

```jsx
<Histogram data={ratingBuckets} barColor="var(--kol-palette-teal)" />
```
