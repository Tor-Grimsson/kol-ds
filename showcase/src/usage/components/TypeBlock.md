# TypeBlock

- **Package:** `@kolkrabbi/kol-styleguide`
- **Category:** flat
- **Real-world usages found:** 10 across 10 files in 5 apps
- **Weighted inbound:** 30★ across 10 edges — 10×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/compose/LayerRenderer.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/modes/type/TypeFrame.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/compose/LayerRenderer.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/modes/type/TypeFrame.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/editor/compose/LayerRenderer.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/editor/modes/type/TypeFrame.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/generator/src/editor/compose/LayerRenderer.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/generator/src/editor/modes/type/TypeFrame.jsx` |
| 3 | 1 | `kol-website/_tmp/brand-triage-elder/editor/compose/LayerRenderer.jsx` |
| 3 | 1 | `kol-website/_tmp/brand-triage-elder/editor/modes/type/TypeFrame.jsx` |

## Import

```jsx
import { TypeBlock } from '@kolkrabbi/kol-styleguide'
```

## Real usage

From `kol-apps/kol-client-ac/src/editor/compose/LayerRenderer.jsx`:

```jsx
<TypeBlock
        value={{ ...layer, color, strokeColor: sw > 0 ? strokeColor : null, strokeWidth: sw }}
        selected={selectedId === layer.id}
        onChange={(patch) => updateLayer(layer.id, patch)}
        className="w-full"
      />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/modes/type/TypeFrame.jsx`:

```jsx
<TypeBlock
          value={frame}
          selected={selected}
          onChange={onUpdate}
        />
```
