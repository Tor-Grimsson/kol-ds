# ExhibitLinkCard

- **Package:** `@kolkrabbi/kol-workshop`
- **Category:** exhibit
- **Real-world usages found:** 3 across 3 files in 1 apps
- **Weighted inbound:** 9★ across 3 edges — 3×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/web/src/routes/workshop/EmbedOverview.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/workshop/HomeApparat.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/workshop/WorkshopIntroduction.jsx` |

## Import

```jsx
import { ExhibitLinkCard } from '@kolkrabbi/kol-workshop'
```

## Real usage

From `kol-website/apps/web/src/routes/workshop/EmbedOverview.jsx`:

```jsx
<ExhibitLinkCard
            key={p.path}
            label={p.label}
            subtitle={p.desc}
            icon={p.icon || group.icon}
            href={`/workshop/${p.path}`}
            description={`Open ${p.label} in the workshop`}
           
          />
```

From `kol-website/apps/web/src/routes/workshop/HomeApparat.jsx`:

```jsx
<ExhibitLinkCard
                  label={tool.label}
                  subtitle={tool.subtitle}
                  icon={tool.icon}
                  href={`/workshop/apparat/${tool.id}`}
                  description={`About ${tool.label}`}
                 
                />
```

From `kol-website/apps/web/src/routes/workshop/WorkshopIntroduction.jsx`:

```jsx
<ExhibitLinkCard key={card.id} {...card} />
```
