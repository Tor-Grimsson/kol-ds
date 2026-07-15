# SideNav

- **Package:** `@kolkrabbi/kol-framework`
- **Category:** framework
- **Real-world usages found:** 12 across 12 files in 12 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix, kol-client-hrafn, kol-client-kolkrabbi, kol-divs, kol-editor, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-website

## Import

```jsx
import { SideNav } from '@kolkrabbi/kol-framework'
```

## Real usage

From `kol-apps/kol-client-ac/src/components/framework/BrandLayout.jsx`:

```jsx
<SideNav drawerOpen={drawerOpen} onCloseDrawer={() => setDrawerOpen(false)} />
```

From `kol-apps/kol-client-hrafn/src/components/framework/AppShell.jsx`:

```jsx
<SideNav navTree={navTree} getActivePage={getActivePage} drawerOpen={drawerOpen} onCloseDrawer={() => setDrawerOpen(false)} />
```

From `kol-apps/kol-client/src/components/framework/chrome/BrandLayout.jsx`:

```jsx
<SideNav config={sidebar} />
```

From `kol-apps/kol-divs/src/components/layouts/BrandLayout.jsx`:

```jsx
<SideNav />
```
