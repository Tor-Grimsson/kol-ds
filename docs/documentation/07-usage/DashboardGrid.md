# DashboardGrid

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** layout
- **Real-world usages found:** 12 across 7 files in 2 apps
- **Weighted inbound:** 22★ across 7 edges — 1×4★ · 6×3★
- **Used in:** kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 4 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardMetrics.jsx` |
| 3 | 2 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx` |
| 3 | 2 | `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardAnalysis.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardPerformance.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessMetrics.jsx` |

## Import

```jsx
import { DashboardGrid } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

```jsx
<DashboardGrid layout="4-col">
            {layoutSlots.map((slot, idx) => renderSlot(slot, idx))}
          </DashboardGrid>
        )}
      </div>
    </>
```

From `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessMetrics.jsx`:

```jsx
<DashboardGrid layout="4-col">
            {layoutSlots.map((slot, idx) => renderSlot(slot, idx))}
          </DashboardGrid>
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx`:

```jsx
<DashboardGrid layout='4-col'><GridCard span='2x1' asCard>...</GridCard></DashboardGrid>"
              />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardComponents.jsx`:

```jsx
<DashboardGrid layout="4-col">
                <GridCard span="2x1" asCard>
                  <span className="dash-detail text-fg-64">2x1 span</span>
                  <Sparkline data={sampleSparklineData} fill color="var(--kol-palette-yellow)" />
```

From `kol-apps/kol-labs-monorepo/apps/metrics/src/pages/DashboardMetrics.jsx`:

```jsx
<DashboardGrid layout="4-col">
            <GridCard span="1x1"><DashMetricCard label="Visitors today" value={visitors.today} delta={visitors.delta} borderColor="var(--kol-palette-blue)" />
```
