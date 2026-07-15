# DashMetricCard

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** cards
- **Real-world usages found:** 133 across 10 files in 2 apps
- **Used in:** kol-labs-monorepo, kol-website

## Import

```jsx
import { DashMetricCard } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashMetricCard className="h-full" label="Win rate" value={`${l.winRate.toFixed(1)}%`}
      delta={`${l.wins.toLocaleString()} wins`} borderColor="var(--kol-palette-green)" />
```

From `kol-website/apps/web/src/routes/Metrics.jsx`:

```jsx
<DashMetricCard
      className="h-full"
      label={`${label} — ${host}`}
      value={visitors}
      delta={delta}
      borderColor={borderColor}
      sparkline={data?.trend?.length > 2 ? <Sparkline data={data.trend} height={24} fill color={borderColor} />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashMetricCard className="h-full" label="Draw rate" value={`${l.drawRate.toFixed(1)}%`}
      delta={`${l.draws.toLocaleString()} draws`} borderColor="var(--kol-palette-blue)" />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashMetricCard className="h-full" label="Avg rating" value={l.avgRating.toLocaleString()}
      delta={`Opp avg ${l.avgOpponentRating.toLocaleString()}`} borderColor="var(--kol-palette-purple)"
      sparkline={l.ratingTrend.length > 2
        ? <Sparkline data={l.ratingTrend.map(d => d.count)} height={28} fill color="var(--kol-palette-purple)" />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashMetricCard className="h-full" label="Total games" value={formatCompactNumber(l.totalGames)}
      delta={`${l.uniqueOpponents.toLocaleString()} opponents`} borderColor="var(--kol-palette-orange)" />
```
