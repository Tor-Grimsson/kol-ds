# ExhibitCard

- **Package:** `@kolkrabbi/kol-workshop`
- **Category:** exhibit
- **Real-world usages found:** 23 across 2 files in 1 apps
- **Weighted inbound:** 7★ across 2 edges — 1×4★ · 1×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 22 | `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/workshop/DocsComponents.jsx` |

## Import

```jsx
import { ExhibitCard } from '@kolkrabbi/kol-workshop'
```

## Real usage

From `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx`:

```jsx
<ExhibitCard
                name="KPI variant"
                description="Left border accent highlights key performance indicators."
                details="Variant: borderColor present • Classes: kol-sans-heading-01, kol-mono-12, kol-mono-14"
                code="label value delta borderColor className?"
              />
```

From `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx`:

```jsx
<ExhibitCard
                name="Default variant"
                description="Plain metric card without accent border."
                details="Variant: no borderColor • Classes: kol-sans-heading-01, kol-mono-12, kol-mono-14"
                code="label value delta className?"
              />
```

From `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx`:

```jsx
<ExhibitCard
                name="Mini variant"
                description="Title, value, and stacked bars."
                details="Variant: no icon • Classes: kol-sans-heading-05 uppercase, kol-sans-heading-01, bg-fg-32/24/16"
                code="title value data[] className?"
              />
```

From `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx`:

```jsx
<ExhibitCard
                name="Compact variant"
                description="Icon header, metric with trend indicator, bars, and footer."
                details="Variant: icon present • Classes: kol-sans-heading-02, kol-sans-heading-01, kol-mono-12"
                code="title value data[] icon label? trend? footerLeft? footerRight? className?"
              />
```

From `kol-website/apps/web/src/routes/workshop/DashboardComponents.jsx`:

```jsx
<ExhibitCard
            name="Histogram"
            description="Bar distribution chart showing frequency across buckets."
            details="Chart: Histogram • Classes: kol-sans-heading-05 uppercase, kol-mono-12, kol-mono-10"
            code="<DashChartCard title subtitle?><Histogram data[] height? barColor? />
```
