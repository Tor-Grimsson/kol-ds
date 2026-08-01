# DashListCard

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** cards
- **Real-world usages found:** 46 across 9 files in 2 apps
- **Weighted inbound:** 35★ across 9 edges — 8×4★ · 1×3★
- **Used in:** kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 9 | `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx` |
| 4 | 9 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessMetrics.jsx` |
| 4 | 6 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/MetricsLive.jsx` |
| 4 | 6 | `kol-website/apps/web/src/routes/Metrics.jsx` |
| 4 | 5 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardMetrics.jsx` |
| 4 | 3 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardAnalysis.jsx` |
| 4 | 3 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx` |
| 4 | 3 | `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx` |
| 3 | 2 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardPerformance.jsx` |

## Import

```jsx
import { DashListCard } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashListCard className="h-full" variant="meter" title="Results ledger"
      subtitle="Outcome mix" icon="stat-winner" items={l.resultsLedger}
      barColor="var(--kol-palette-green)" footer="Win/draw/loss percentages across all games" />
```

From `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessMetrics.jsx`:

```jsx
<DashListCard className="h-full" variant="meter" title="Time class share"
      subtitle="Distribution by mode" icon="stopwatch"
      items={l.timeClassItems.map((item) => ({
        label: item.label, value: item.value, percent: item.percent,
        color: TIME_CLASS_COLORS[item.key]
      }))}
      footer="Percentages from total recorded games" />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashListCard className="h-full" variant="meter" title="Termination mix"
      subtitle="Most common endings" icon="dashboard-roadmap"
      items={f.terminationItems} barColor="var(--kol-palette-orange)"
      footer={`${fg.length.toLocaleString()} games analysed`} />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashListCard className="h-full" variant="text" title="Rivals list"
      subtitle="Most frequent opponents" icon="dashboard-dual-opponent"
      badge={f.rivalItems[0]?.label ? `vs ${f.rivalItems[0].label}` : null}
      items={f.rivalItems} />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashListCard className="h-full" variant="ratings" title="Peak rating by mode"
      icon="stat-crown" items={f.peakRatingItems} />
```
