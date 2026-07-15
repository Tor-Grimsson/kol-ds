# DashAlertCard

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** cards
- **Real-world usages found:** 5 across 5 files in 2 apps
- **Used in:** kol-labs-monorepo, kol-website

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
