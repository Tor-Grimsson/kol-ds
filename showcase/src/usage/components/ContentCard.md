# ContentCard

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 3 across 3 files in 1 apps
- **Weighted inbound:** 9★ across 3 edges — 3×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/web/src/routes/Stack.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/Work.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/prints/PrintsGrid.jsx` |

## Import

```jsx
import { ContentCard } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-website/apps/web/src/routes/Stack.jsx`:

```jsx
<ContentCard
                    variant="article"
                    hero
                    label="Featured"
                    meta={latestArticle.meta}
                    kicker={latestArticle.kicker}
                    title={latestArticle.title}
                    body={latestArticle.summary}
                    media={latestArticle.image ? <img src={latestArticle.image} alt="" className="w-full h-full object-cover" />
```

From `kol-website/apps/web/src/routes/Work.jsx`:

```jsx
<ContentCard
      variant="work"
      className={className}
      title={item.title}
      titleClass={WORK_TITLE_FACE}
      meta={`${item.client || TYPE_LABELS[item.type] || item.type} · ${item.year}`}
      media={item.thumbnail ? <img src={item.thumbnail} alt="" />
```

From `kol-website/apps/web/src/routes/prints/PrintsGrid.jsx`:

```jsx
<ContentCard
            key={print.id}
            variant="print"
            media={<img src={print.image} alt={print.name} loading="lazy" className="w-full h-full object-cover" />
```
