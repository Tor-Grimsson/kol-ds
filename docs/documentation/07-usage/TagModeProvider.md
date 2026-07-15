# TagModeProvider

- **Package:** `@kolkrabbi/kol-workshop`
- **Category:** tags
- **Real-world usages found:** 2 across 2 files in 1 apps
- **Used in:** kol-website

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
