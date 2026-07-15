# TypeBlock

- **Package:** `@kolkrabbi/kol-styleguide`
- **Category:** flat
- **Real-world usages found:** 10 across 10 files in 5 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-labs-monorepo, kol-website

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
