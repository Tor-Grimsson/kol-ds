# QuantityInput

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 26 across 11 files in 7 apps
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-labs-monorepo, kol-mirror, kol-modulator, kol-monitor, kol-website

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

From `kol-apps/kol-mirror/src/components/mirror/MirrorSidebar.jsx`:

```jsx
<QuantityInput value={state.symphonyCustomWidth} onChange={state.setSymphonyCustomWidth} min={100} max={4096} />
```

From `kol-apps/kol-monitor/a_torg/archive/2026-04-17-src-cleanup/src/components/mirror/MirrorSidebar.jsx`:

```jsx
<QuantityInput value={state.symphonyCustomHeight} onChange={state.setSymphonyCustomHeight} min={100} max={4096} />
```
