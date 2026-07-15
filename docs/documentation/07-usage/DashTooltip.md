# DashTooltip

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** shared
- **Real-world usages found:** 10 across 10 files in 2 apps
- **Used in:** kol-client-kolkrabbi, kol-labs-monorepo

## Import

```jsx
import { DashTooltip } from '@kolkrabbi/kol-dashboards'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/dashboards/charts/Heatmap.jsx`:

```jsx
<DashTooltip visible={activeIndex !== null}>
          {activeIndex !== null && cells[activeIndex] && (
            <span className="dash-caption">
              {rows[cells[activeIndex].row] ?? `R${cells[activeIndex].row}`},{' '}
              {cols[cells[activeIndex].col] ?? `C${cells[activeIndex].col}`}:{' '}
              {cells[activeIndex].value}
            </span>
          )}
        </DashTooltip>
```

From `kol-apps/kol-labs-monorepo/packages/dashboards/src/charts/Histogram.jsx`:

```jsx
<DashTooltip visible={activeIndex !== null}>
            {activeIndex !== null && data[activeIndex] && (
              <span className="dash-caption">{data[activeIndex].range}: {data[activeIndex].count}</span>
            )}
          </DashTooltip>
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/dashboards/charts/DonutChart.jsx`:

```jsx
<DashTooltip visible={activeIndex !== null}>
          {activeIndex !== null && arcs[activeIndex] && (
            <span className="dash-caption">
              {arcs[activeIndex].label ? `${arcs[activeIndex].label}: ` : ''}{arcs[activeIndex].value} ({(arcs[activeIndex].pct * 100).toFixed(1)}%)
            </span>
          )}
        </DashTooltip>
      </div>

      {showLegend && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 justify-center">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/dashboards/charts/LineChart.jsx`:

```jsx
<DashTooltip visible={activeIndex !== null}>
            {activeIndex !== null && (
              <div className="flex flex-col gap-0.5">
                {normalizedSeries.map((s, si) => {
                  const pt = s.points[activeIndex]
                  if (!pt) return null
                  return (
                    <span key={si} className="dash-caption">
                      {pt.raw.x != null ? `${pt.raw.x}: ` : ''}{pt.raw.y}
                    </span>
                  )
                })}
              </div>
            )}
          </DashTooltip>
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/dashboards/charts/ScatterPlot.jsx`:

```jsx
<DashTooltip visible={activeIndex !== null}>
            {activeIndex !== null && (() => {
              const point = data.find(p => p.id === activeIndex)
              if (!point) return null
              return (
                <div className="flex flex-col gap-0.5">
                  {point.id != null && <span className="dash-caption text-fg-64">{point.id}</span>}
                  <span className="dash-caption">x: {point.x}</span>
                  <span className="dash-caption">y: {point.y}</span>
                </div>
              )
            })()}
          </DashTooltip>
```
