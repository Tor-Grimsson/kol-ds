# SideNav

- **Package:** `@kolkrabbi/kol-framework`
- **Category:** framework
- **Real-world usages found:** 12 across 12 files in 12 apps
- **Weighted inbound:** 36★ across 12 edges — 12×3★
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix, kol-client-hrafn, kol-client-kolkrabbi, kol-divs, kol-editor, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client/src/components/framework/chrome/BrandLayout.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/components/framework/BrandLayout.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/components/framework/BrandLayout.jsx` |
| 3 | 1 | `kol-apps/kol-client-canalix/src/layout/BrandLayout.jsx` |
| 3 | 1 | `kol-apps/kol-client-hrafn/src/components/framework/AppShell.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/components/framework/BrandLayout.jsx` |
| 3 | 1 | `kol-apps/kol-divs/src/components/layouts/BrandLayout.jsx` |
| 3 | 1 | `kol-apps/kol-editor/_a-torg/_kol-packages-reference/kol-framework/src/chrome/BrandLayout.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/packages/framework/src/AppShell.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/components/framework/AppShell.jsx` |
| 3 | 1 | `kol-apps/kol-lightroom/src/components/framework/AppShell.jsx` |
| 3 | 1 | `kol-website/apps/brand/src/components/framework/BrandLayout.jsx` |

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
