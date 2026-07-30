# DashAlertCard

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** cards
- **Real-world usages found:** 5 across 5 files in 2 apps
- **Weighted inbound:** 15★ across 5 edges — 5×3★
- **Used in:** kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardMetrics.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessMetrics.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx` |

## Import

```jsx
import { DashAlertCard } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx`:

```jsx
<DashAlertCard
                label="Win Rate"
                value="52.1%"
                trend="up"
                trendValue="+4.3%"
                alerts={sampleAlerts}
                footer="Month-over-month comparison"
              />
```

From `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx`:

```jsx
<DashAlertCard
            label="Win Rate"
            value="52.1%"
            trend="up"
            trendValue="+4.3%"
            alerts={sampleAlerts}
            footer="Month-over-month comparison"
          />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardMetrics.jsx`:

```jsx
<DashAlertCard className="h-full" label="Weekly traffic" value={weeklyTraffic.delta} trend={weeklyTraffic.delta.startsWith?.('-') ? 'down' : 'up'} trendValue={weeklyTraffic.diff} alerts={[]} footer="This week vs previous" />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashAlertCard className="h-full" label="Recent win rate"
        value={`${rp.currentWinRate.toFixed(1)}%`} trend={trend} trendValue={deltaLabel}
        alerts={[
          { title: `Strongest: ${f.bestTimeClass.label}`,
            description: `${f.bestTimeClass.winRate}% wins across ${f.bestTimeClass.games.toLocaleString()} games` },
          { title: `Needs work: ${f.weakestTimeClass.label}`,
            description: `${f.weakestTimeClass.winRate}% wins • ${f.weakestTimeClass.games.toLocaleString()} games` }
        ]}
        footer="Comparing last 90 days vs prior quarter" />
```
