# PrintGridCard

- **Package:** `@kolkrabbi/kol-store`
- **Category:** flat
- **Real-world usages found:** 3 across 3 files in 2 apps
- **Used in:** kol-monitor, kol-website

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
