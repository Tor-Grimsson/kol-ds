# ShellLayout

- **Package:** `@kolkrabbi/kol-workshop`
- **Category:** shell
- **Real-world usages found:** 3 across 3 files in 2 apps
- **Used in:** kol-labs-monorepo, kol-website

## Import

```jsx
import { ShellLayout } from '@kolkrabbi/kol-workshop'
```

## Real usage

From `kol-website/apps/web/src/App.jsx`:

```jsx
<ShellLayout routes={WORKSHOP_ROUTES} basePath="/workshop" renderSidebar={({ onNavigate }) => <WorkshopSidebar routes={WORKSHOP_ROUTES} inventory={documentationInventory} basePath="/workshop" onNavigate={onNavigate} />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/App.jsx`:

```jsx
<ShellLayout />
```
