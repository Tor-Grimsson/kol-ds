# Candlestick

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** charts
- **Real-world usages found:** 7 across 5 files in 2 apps
- **Used in:** kol-labs-monorepo, kol-website

## Import

```jsx
import { Candlestick } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<Candlestick data={f.candlestickData} />
```

From `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx`:

```jsx
<Candlestick data={sampleCandlestickData} />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardPerformance.jsx`:

```jsx
<Candlestick data={candlestickData} />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx`:

```jsx
<Candlestick data[] height? />
```
