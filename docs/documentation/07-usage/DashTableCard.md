# DashTableCard

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** cards
- **Real-world usages found:** 13 across 5 files in 2 apps
- **Weighted inbound:** 18★ across 5 edges — 3×4★ · 2×3★
- **Used in:** kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 3 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardMetrics.jsx` |
| 4 | 3 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/MetricsLive.jsx` |
| 4 | 3 | `kol-website/apps/web/src/routes/Metrics.jsx` |
| 3 | 2 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx` |
| 3 | 2 | `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx` |

## Import

```jsx
import { DashTableCard } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx`:

```jsx
<DashTableCard
                title="OPENING STATISTICS"
                subtitle="Performance by opening"
                columns={sampleTableColumns}
                rows={sampleTableRows}
                footer="Showing top 5 openings by game count"
              />
```

From `kol-website/apps/web/src/routes/Metrics.jsx`:

```jsx
<DashTableCard
          className="h-full"
          title="Recent CMS edits"
          subtitle="Sanity dataset"
          columns={EDIT_COLUMNS}
          rows={editsToRows(sanity.recentEdits)}
          footer="Live from Sanity API"
        />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardMetrics.jsx`:

```jsx
<DashTableCard
                className="h-full"
                title="Recent CMS edits"
                subtitle="Sanity dataset"
                icon="dashboard-book-open"
                columns={EDIT_COLUMNS}
                rows={editsToRows(sanityData.recentEdits)}
                footer="Live from Sanity API"
              />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardMetrics.jsx`:

```jsx
<DashTableCard
                className="h-full"
                title="Recent deploys"
                subtitle="Vercel deployment history"
                icon="trending"
                columns={DEPLOY_COLUMNS}
                rows={deploysToRows(deploys)}
                footer={`${totalDeploys} total deploys`}
              />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardMetrics.jsx`:

```jsx
<DashTableCard
                className="h-full"
                title="Recent uploads"
                subtitle="Across all buckets"
                icon="dashboard-bookmark"
                columns={UPLOAD_COLUMNS}
                rows={recentUploadsToRows(b2Data.buckets)}
                footer="Sorted by upload date"
              />
```
