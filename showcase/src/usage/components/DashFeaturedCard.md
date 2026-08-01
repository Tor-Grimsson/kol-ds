# DashFeaturedCard

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** cards
- **Real-world usages found:** 8 across 8 files in 2 apps
- **Weighted inbound:** 24★ across 8 edges — 8×3★
- **Used in:** kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardAnalysis.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardMetrics.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/MetricsLive.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessMetrics.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/Metrics.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx` |

## Import

```jsx
import { DashFeaturedCard } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashFeaturedCard className="h-full" badge="Metrics dataset"
        title={overview?.topModeLabel || 'Chess Insights'}
        icon="dashboard-book-open"
        description={`Covering ${l.totalGames.toLocaleString()} games with live data.`}
        metricLabel="Rated games"
        metricValue={overview ? overview.ratedGames.toLocaleString() : formatCompactNumber(l.totalGames)}
        chart={histogram.length > 0 ? <Histogram data={histogram} />
```

From `kol-website/apps/web/src/routes/Metrics.jsx`:

```jsx
<DashFeaturedCard
          className="h-full"
          badge={`Last ${rangeLabel}`}
          title="Site Traffic"
          icon="trending"
          description="New visitors, returning visitors, and bounces."
          metricLabel="Total visits"
          metricValue={totalVisitsMonth}
          chart={dailyVisits.length > 0 ? <LineChart series={dailyToSeries(dailyVisits)} height={200} showArea />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardAnalysis.jsx`:

```jsx
<DashFeaturedCard
              className="h-full"
              badge="Lifetime dataset"
              title={topMode?.label || 'Chess Insights'}
              icon="dashboard-book-open"
              description={`Covering ${metrics.totalGames.toLocaleString()} games with live apparatus and dashboards.`}
              metricLabel="Rated games"
              metricValue={metrics.ratedGames.toLocaleString()}
              chart={<Histogram data={ratingBuckets} />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardMetrics.jsx`:

```jsx
<DashFeaturedCard
                className="h-full"
                badge="Last 30 days"
                title="Daily Traffic"
                icon="trending"
                description="New visitors, returning visitors, and bounces."
                metricLabel="Total visits"
                metricValue={totalVisitsMonth}
                chart={dailyVisits.length > 0
                  ? <LineChart series={dailyToSeries(dailyVisits)} height={200} showArea />
```

From `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx`:

```jsx
<DashFeaturedCard
            badge="TOP OPENING"
            title="King's Gambit"
            icon="book-open"
            description="Your most successful opening with 58% win rate across 234 games."
            metricLabel="Games tracked"
            metricValue="234"
            legends={[
              { label: 'Win rate', color: 'var(--kol-palette-green)' },
              { label: 'Usage volume', color: 'var(--kol-palette-orange)' },
            ]}
          />
```
