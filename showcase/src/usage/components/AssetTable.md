# AssetTable

- **Package:** `@kolkrabbi/kol-styleguide`
- **Category:** flat
- **Real-world usages found:** 18 across 5 files in 5 apps
- **Weighted inbound:** 20★ across 5 edges — 5×4★
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 6 | `kol-apps/kol-client/src/pages/foundations/GraphicsAssets.jsx` |
| 4 | 3 | `kol-apps/kol-client-ac/src/pages/Reference.jsx` |
| 4 | 3 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/pages/Reference.jsx` |
| 4 | 3 | `kol-apps/kol-client-kolkrabbi/src/pages/Reference.jsx` |
| 4 | 3 | `kol-website/apps/brand/src/pages/Assets.jsx` |

## Import

```jsx
import { AssetTable } from '@kolkrabbi/kol-styleguide'
```

## Real usage

From `kol-apps/kol-client/src/pages/foundations/GraphicsAssets.jsx`:

```jsx
<AssetTable
          caption="Marks"
          rows={markRows()}
          previewWidthFor={markWidthFor}
        />
```

From `kol-apps/kol-client-ac/src/pages/Reference.jsx`:

```jsx
<AssetTable caption="Logos" rows={markRows()} previewWidthFor={markWidthFor} />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/pages/Reference.jsx`:

```jsx
<AssetTable caption="Graphics" rows={graphicRows('abstract')} previewWidthFor={graphicWidthFor} />
```

From `kol-apps/kol-client-kolkrabbi/src/pages/Reference.jsx`:

```jsx
<AssetTable caption="Patterns" rows={graphicRows('patterns')} previewWidthFor={graphicWidthFor} />
```

From `kol-apps/kol-client/src/pages/foundations/GraphicsAssets.jsx`:

```jsx
<AssetTable
          caption="Diagrams"
          rows={graphicRows('diagrams')}
          previewWidthFor={graphicWidthFor}
        />
```
