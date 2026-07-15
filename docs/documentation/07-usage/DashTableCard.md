# DashTableCard

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** cards
- **Real-world usages found:** 13 across 5 files in 2 apps
- **Used in:** kol-labs-monorepo, kol-website

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
