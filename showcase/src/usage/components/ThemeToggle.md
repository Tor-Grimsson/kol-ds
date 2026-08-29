# ThemeToggle

- **Package:** `@kolkrabbi/kol-framework`
- **Category:** framework
- **Real-world usages found:** 44 across 35 files in 14 apps
- **Weighted inbound:** 106★ across 35 edges — 1×4★ · 34×3★
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix-contract, kol-client-kolkrabbi, kol-divs, kol-draw-3d, kol-editor, kol-editor-radar, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-modulator, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 3 | `kol-website/_tmp/workshop-museum-elder/data/workshop/tokens.js` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/molecules/ComponentPreview.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/src/pages/Components.jsx` |
| 3 | 2 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/molecules/ComponentPreview.jsx` |
| 3 | 2 | `kol-apps/kol-modulator/src/components/styleguide/preview/molecules/ComponentPreview.jsx` |
| 3 | 2 | `kol-website/_tmp/2026-08-08-workshop-system-elder/workshop-system/shell/WorkshopHeader.jsx` |
| 3 | 2 | `kol-website/_tmp/workshop-museum-elder/components/workshop/molecules/ComponentPreview.jsx` |
| 3 | 2 | `kol-website/apps/brand/src/pages/Components.jsx` |
| 3 | 1 | `kol-apps/kol-client/src/components/framework/chrome/TopNav.jsx` |
| 3 | 1 | `kol-apps/kol-client/src/pages/client-site/SiteNav.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/components/framework/SideNav.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/components/site/SiteLayout.jsx` |
| … | | _23 more_ |

## Import

```jsx
import { ThemeToggle } from '@kolkrabbi/kol-framework'
```

## Real usage

From `kol-website/_tmp/2026-08-09-brand-sidenav-fork-elder/SideNav.jsx`:

```jsx
<ThemeToggle variant={collapsed ? 'icon' : 'hop-bare'} size="md" />
```

From `kol-apps/kol-client-ac/src/components/framework/SideNav.jsx`:

```jsx
<ThemeToggle variant="hop-bare" />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/atoms/ThemeToggle.jsx`:

```jsx
<ThemeToggle variant="default" />
```

From `kol-apps/kol-divs/src/components/navigation/SideNav.jsx`:

```jsx
<ThemeToggle variant="hop" />
```

From `kol-apps/kol-editor/src/components/organisms/TopNav.jsx`:

```jsx
<ThemeToggle variant="icon" />
```
