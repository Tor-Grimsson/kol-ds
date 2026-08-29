# QuantityInput

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 12 across 6 files in 5 apps
- **Weighted inbound:** 20★ across 6 edges — 2×4★ · 4×3★
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-labs-monorepo, kol-modulator, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 4 | `kol-apps/kol-editor-radar/src-grab/components/mirror/MirrorSidebar.jsx` |
| 4 | 4 | `kol-apps/kol-labs-monorepo/apps/mirror/src/components/mirror/MirrorSidebar.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/atoms/QuantityStepperPreview.jsx` |
| 3 | 1 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/Components.jsx` |
| 3 | 1 | `kol-apps/kol-modulator/src/components/styleguide/Components.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/components/workshop/atoms/QuantityStepperPreview.jsx` |

## Import

```jsx
import { QuantityInput } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/atoms/QuantityStepperPreview.jsx`:

```jsx
<QuantityInput value={inputValue} onChange={setInputValue} min={1} max={10} />
```

From `kol-apps/kol-editor-radar/src-grab/components/mirror/MirrorSidebar.jsx`:

```jsx
<QuantityInput value={state.hallCustomWidth} onChange={state.setHallCustomWidth} min={100} max={4096} />
```

From `kol-apps/kol-labs-monorepo/apps/mirror/src/components/mirror/MirrorSidebar.jsx`:

```jsx
<QuantityInput value={state.hallCustomHeight} onChange={state.setHallCustomHeight} min={100} max={4096} />
```

From `kol-apps/kol-modulator/src/components/styleguide/Components.jsx`:

```jsx
<QuantityInput value={1} min={0} max={10} />
```

From `kol-apps/kol-editor-radar/src-grab/components/mirror/MirrorSidebar.jsx`:

```jsx
<QuantityInput value={state.symphonyCustomWidth} onChange={state.setSymphonyCustomWidth} min={100} max={4096} />
```
