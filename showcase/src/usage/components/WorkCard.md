# WorkCard

- **Package:** `@kolkrabbi/kol-content`
- **Category:** flat
- **Real-world usages found:** 1 across 1 files in 1 apps
- **Weighted inbound:** 3★ across 1 edges — 1×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/web/src/routes/WorkDetail.jsx` |

## Import

```jsx
import { WorkCard } from '@kolkrabbi/kol-content'
```

## Real usage

From `kol-website/apps/web/src/routes/WorkDetail.jsx`:

```jsx
<WorkCard
              key={`${p._id}-${i}`}
              title={p.title}
              titleClassName="work-display-title text-4xl lg:text-5xl"
              metaClassName="kol-mono-10 uppercase"
              thumbnail={p.thumbnail?.url}
              href={`/work/${p.slug.current}`}
              client={p.client}
              type={p.type}
              year={p.year}
              index={i}
              onNavigate={(href, e) => { e.preventDefault(); navigate(href) }}
            />
```
