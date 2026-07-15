# DonutChart

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** charts
- **Real-world usages found:** 21 across 9 files in 2 apps
- **Used in:** kol-labs-monorepo, kol-website

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
