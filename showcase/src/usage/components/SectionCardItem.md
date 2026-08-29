# SectionCardItem

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 1 across 1 files in 1 apps
- **Weighted inbound:** 3★ across 1 edges — 1×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/web/src/components/sections/home/HomeWorkshop.jsx` |

## Import

```jsx
import { SectionCardItem } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-website/apps/web/src/components/sections/home/HomeWorkshop.jsx`:

```jsx
<SectionCardItem
                     title={feature.title}
                     icon={feature.icon}
                     visual={feature.visual}
                     description={feature.description}
                     href={feature.href}
                     imagePosition="top"
                   />
```
