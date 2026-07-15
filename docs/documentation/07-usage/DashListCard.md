# DashListCard

- **Package:** `@kolkrabbi/kol-dashboards`
- **Category:** cards
- **Real-world usages found:** 46 across 9 files in 2 apps
- **Used in:** kol-labs-monorepo, kol-website

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

From `kol-website/apps/web/src/routes/Metrics.jsx`:

```jsx
<DashListCard
            className="h-full"
            variant="meter"
            title="Top hosts"
            subtitle="By pageviews"
            icon="dashboard-roadmap"
            items={(topHosts || []).length > 0
              ? topHosts.map(h => ({ ...h, detail: h.delta }))
              : [{ label: 'No data yet', value: '—', percent: 0, color: 'var(--kol-palette-blue)' }]}
            footer={`Subdomains — last ${rangeLabel}`}
          />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessMetrics.jsx`:

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
