# ColorLoader

- **Package:** `@kolkrabbi/kol-foundry`
- **Category:** flat
- **Real-world usages found:** 4 across 4 files in 2 apps
- **Weighted inbound:** 12★ across 4 edges — 4×3★
- **Used in:** kol-client-kolkrabbi, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/layout/LoaderOverlay.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/animations/LoadersPreview.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/components/workshop/animations/LoadersPreview.jsx` |
| 3 | 1 | `kol-website/apps/web/src/components/layout/LoaderOverlay.jsx` |

## Import

```jsx
import { ColorLoader } from '@kolkrabbi/kol-foundry'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/animations/LoadersPreview.jsx`:

```jsx
<ColorLoader\n  message="Loading"\n  onEnter={() => {}}\n/>
```

From `kol-website/apps/web/src/components/layout/LoaderOverlay.jsx`:

```jsx
<ColorLoader onEnter={onEnter} />
```
