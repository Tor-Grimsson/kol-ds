# ParallaxShelf

- **Package:** `@kolkrabbi/kol-content`
- **Category:** flat
- **Real-world usages found:** 1 across 1 files in 1 apps
- **Weighted inbound:** 3★ across 1 edges — 1×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/web/src/routes/Work.jsx` |

## Import

```jsx
import { ParallaxShelf } from '@kolkrabbi/kol-content'
```

## Real usage

From `kol-website/apps/web/src/routes/Work.jsx`:

```jsx
<ParallaxShelf
                      key={type.key}
                      type={type}
                      items={typeProjects.map(toCardItem)}
                      fromLeft={typeIndex % 2 === 1}
                      plugins={[WheelGesturesPlugin()]}
                      onNavigate={(href, e) => { e.preventDefault(); navigate(href) }}
                    />
```
