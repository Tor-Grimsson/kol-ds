# SelectionOverlay

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 6 across 6 files in 6 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-editor, kol-labs-monorepo, kol-website

## Import

```jsx
import { SelectionOverlay } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/editor/compose/CanvasArea.jsx`:

```jsx
<SelectionOverlay
              key={l.id}
              layer={l}
              showHandles={!isMultiSel}
              showLabel={!isMultiSel}
            />
```

From `kol-apps/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/compose/CanvasArea.jsx`:

```jsx
<SelectionOverlay layer={selectedLayer} />
```
