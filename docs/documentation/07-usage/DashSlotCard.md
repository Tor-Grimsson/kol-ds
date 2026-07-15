# DashSlotCard

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** cards
- **Real-world usages found:** 8 across 6 files in 2 apps
- **Used in:** kol-labs-monorepo, kol-website

## Import

```jsx
import { DashSlotCard } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashSlotCard className="h-full" title="Top openings" subtitle="Ranked by usage"
      icon="dashboard-bookmark"
      chart={f.ratingHistogram.length > 0
        ? <Histogram data={f.ratingHistogram.slice(0, 6)} barColor="var(--kol-palette-blue)" />
```

From `kol-website/apps/web/src/routes/workshop/ChessMetrics.jsx`:

```jsx
<DashSlotCard className="h-full" title="Monthly momentum" subtitle="Latest 12 months"
      icon="trending"
      chart={<LineChart
        data={f.monthListItems.map(m => ({ y: parseFloat(m.value) || 0 }))}
        height={100} showArea
      />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardAnalysis.jsx`:

```jsx
<DashSlotCard
              className="h-full"
              title="Top openings"
              subtitle="Ranked by usage"
              icon="dashboard-bookmark"
              chart={<Histogram data={ratingBuckets.slice(0, 5)} barColor="var(--kol-palette-blue)" />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx`:

```jsx
<DashSlotCard
                title="TOP OPENINGS"
                subtitle="Ranked by usage"
                icon="dashboard-bookmark"
                chart={<Histogram data={sampleHistogramData.slice(0, 5)} />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardPerformance.jsx`:

```jsx
<DashSlotCard
            className="h-full"
            title="Monthly momentum"
            subtitle="Latest 12 months"
            icon="trending"
            chart={<LineChart
              data={monthListItems.map(m => ({ y: parseFloat(m.winRate) || 0 }))}
              height={100} showArea
            />
```
