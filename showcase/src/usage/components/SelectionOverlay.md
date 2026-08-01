# SelectionOverlay

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 6 across 6 files in 6 apps
- **Weighted inbound:** 18★ across 6 edges — 6×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-editor, kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/compose/CanvasArea.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/compose/CanvasArea.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/editor/compose/CanvasArea.jsx` |
| 3 | 1 | `kol-apps/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/compose/CanvasArea.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/generator/src/editor/compose/CanvasArea.jsx` |
| 3 | 1 | `kol-website/_tmp/brand-triage-elder/editor/compose/CanvasArea.jsx` |

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
