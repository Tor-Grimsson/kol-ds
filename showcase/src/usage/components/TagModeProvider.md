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
| 3 | 1 | `kol-website/apps/web/src/App.jsx` |
| 3 | 1 | `kol-website/apps/web/src/workshop-system/tags/index.js` |

## Import

```jsx
import { TagModeProvider } from '@kolkrabbi/kol-workshop'
```

## Real usage

From `kol-website/apps/web/src/App.jsx`:

```jsx
<TagModeProvider inventory={documentationInventory} docHref={docHref} tagHref={tagHref}><ShellLayout routes={WORKSHOP_ROUTES} basePath="/workshop" renderSidebar={({ onNavigate }) => <WorkshopSidebar routes={WORKSHOP_ROUTES} inventory={documentationInventory} basePath="/workshop" onNavigate={onNavigate} />
```

From `kol-website/apps/web/src/workshop-system/tags/index.js`:

```jsx
<TagModeProvider inventory={...} docHref={...} tagHref={...}>
```
