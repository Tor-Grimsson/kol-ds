# AssetTable

- **Package:** `@kolkrabbi/kol-styleguide`
- **Category:** flat
- **Real-world usages found:** 18 across 5 files in 5 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-website

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
