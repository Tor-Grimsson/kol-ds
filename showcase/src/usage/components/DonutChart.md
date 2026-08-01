# DonutChart

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** charts
- **Real-world usages found:** 21 across 9 files in 2 apps
- **Weighted inbound:** 29★ across 9 edges — 2×4★ · 7×3★
- **Used in:** kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 5 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx` |
| 4 | 5 | `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx` |
| 3 | 2 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardAnalysis.jsx` |
| 3 | 2 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardMetrics.jsx` |
| 3 | 2 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/MetricsLive.jsx` |
| 3 | 2 | `kol-website/apps/web/src/routes/Metrics.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardPerformance.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessMetrics.jsx` |

## Import

```jsx
import { DonutChart } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DonutChart segments={wdlSegments} size={240} thickness={32}
            centerLabel={`${l.winRate.toFixed(1)}%`} />
```

From `kol-website/apps/web/src/routes/Metrics.jsx`:

```jsx
<DonutChart
              segments={devices.length > 0 ? devicesToSegments(devices) : [{ value: 1, label: 'No data', color: 'var(--kol-palette-blue)' }]}
              size={120}
              thickness={20}
              centerLabel={totalSessions}
              showLegend
            />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardAnalysis.jsx`:

```jsx
<DonutChart segments={segments} size={200} thickness={28}
                      centerLabel={`${metrics.winRate.toFixed(1)}%`} />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardMetrics.jsx`:

```jsx
<DonutChart
                    segments={devices.length > 0 ? devicesToSegments(devices) : [{ value: 1, label: 'No data', color: 'var(--kol-palette-blue)' }]}
                    size={140}
                    thickness={24}
                    centerLabel={totalSessions}
                    showLegend
                  />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardMetrics.jsx`:

```jsx
<DonutChart
                    segments={sanityTypesToSegments(t)}
                    size={140}
                    thickness={24}
                    centerLabel={String(sanityData.totalDocuments)}
                    showLegend
                  />
```
