# MediaRow

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 1 across 1 files in 1 apps
- **Weighted inbound:** 3★ across 1 edges — 1×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/brand/src/pages/SlideDeckManager.jsx` |

## Import

```jsx
import { MediaRow } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-website/apps/brand/src/pages/SlideDeckManager.jsx`:

```jsx
<MediaRow
            key={deck.slug}
            thumb={
              <div className="w-full h-full bg-surface-inverse flex items-center justify-center">
                <Icon name="maximize" size={16} className="text-fg-inverse-64" />
```
