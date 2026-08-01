# LoaderOverlay

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 3 across 3 files in 1 apps
- **Weighted inbound:** 9★ across 3 edges — 3×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/_tmp/web-quarantine-elder/StackBlog.jsx` |
| 3 | 1 | `kol-website/_tmp/web-quarantine-elder/StackDetail.jsx` |
| 3 | 1 | `kol-website/apps/web/src/App.jsx` |

## Import

```jsx
import { LoaderOverlay } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-website/_tmp/web-quarantine-elder/StackBlog.jsx`:

```jsx
<LoaderOverlay message="Loading post" />
```

From `kol-website/apps/web/src/App.jsx`:

```jsx
<LoaderOverlay onEnter={handleEnter} />
```
