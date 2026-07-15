# Histogram

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** charts
- **Real-world usages found:** 19 across 7 files in 2 apps
- **Used in:** kol-labs-monorepo, kol-website

## Import

```jsx
import { Histogram } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<Histogram data={f.ratingHistogram} barColor="var(--kol-palette-teal)" />
```

From `kol-website/apps/web/src/routes/workshop/ChessMetrics.jsx`:

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
