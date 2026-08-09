# TagModeProvider

- **Package:** `@kolkrabbi/kol-workshop`
- **Category:** tags
- **Real-world usages found:** 2 across 2 files in 1 apps
- **Weighted inbound:** 6★ across 2 edges — 2×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/_tmp/2026-08-08-workshop-system-elder/workshop-system/tags/index.js` |
| 3 | 1 | `kol-website/apps/web/src/App.jsx` |

## Import

```jsx
import { TagModeProvider } from '@kolkrabbi/kol-workshop'
```

## Real usage

From `kol-website/_tmp/2026-08-08-workshop-system-elder/workshop-system/tags/index.js`:

```jsx
<TagModeProvider inventory={...} docHref={...} tagHref={...}>
```

From `kol-website/apps/web/src/App.jsx`:

```jsx
<TagModeProvider inventory={VAULT} docHref={docHref}><WorkshopChrome />
```
