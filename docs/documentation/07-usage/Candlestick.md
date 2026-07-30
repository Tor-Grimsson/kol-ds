# Candlestick

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** charts
- **Real-world usages found:** 7 across 5 files in 2 apps
- **Weighted inbound:** 15★ across 5 edges — 5×3★
- **Used in:** kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 2 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx` |
| 3 | 2 | `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardPerformance.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessMetrics.jsx` |

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
