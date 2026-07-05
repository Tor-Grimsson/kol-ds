# SideNav

- **Package:** `@kolkrabbi/kol-framework`
- **Category:** framework
- **Real-world usages found:** 10 across 10 files in 10 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix, kol-client-hrafn, kol-client-kolkrabbi, kol-divs, kol-editor, kol-labs-single, kol-lightroom

## Import

```jsx
import { SideNav } from '@kolkrabbi/kol-framework'
```

## Real usage

From `kol-apparat/kol-lightroom/src/components/framework/AppShell.jsx`:

```jsx
<SideNav navTree={navTree} getActivePage={getActivePage} drawerOpen={drawerOpen} onCloseDrawer={() => setDrawerOpen(false)} />
```

From `kol-client/kol-client-ac/src/components/framework/BrandLayout.jsx`:

```jsx
<SideNav drawerOpen={drawerOpen} onCloseDrawer={() => setDrawerOpen(false)} />
```

From `kol-apparat/kol-editors/kol-editor/_a-torg/_kol-packages-reference/kol-framework/src/chrome/BrandLayout.jsx`:

```jsx
<SideNav config={sidebar} />
```

From `kol-apparat/kol-docs/kol-divs/src/components/layouts/BrandLayout.jsx`:

```jsx
<SideNav />
```
