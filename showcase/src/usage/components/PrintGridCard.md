# PrintGridCard

- **Package:** `@kolkrabbi/kol-store`
- **Category:** flat
- **Real-world usages found:** 3 across 3 files in 2 apps
- **Weighted inbound:** 9★ across 3 edges — 3×3★
- **Used in:** kol-monitor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-monitor/a_torg/archive/jsx/PrintsGrid.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/prints/PrintsGrid.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/prints/PrintsGridGsap.jsx` |

## Import

```jsx
import { PrintGridCard } from '@kolkrabbi/kol-store'
```

## Real usage

From `kol-website/apps/web/src/routes/prints/PrintsGridGsap.jsx`:

```jsx
<PrintGridCard
                key={print.id}
                print={print}
                onCardClick={onCardClick}
              />
```

From `kol-apps/kol-monitor/a_torg/archive/jsx/PrintsGrid.jsx`:

```jsx
<PrintGridCard print={print} onCardClick={onCardClick} isFlipped={print.slug === activeSlug} />
```
