# QuantityInput

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 21 across 9 files in 5 apps
- **Used in:** kol-client-kolkrabbi, kol-mirror, kol-modulator, kol-monitor, kol-radar

## Import

```jsx
import { QuantityInput } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-radar/src-grab/components/mirror/MirrorSidebar.jsx`:

```jsx
<QuantityInput value={state.hallCustomWidth} onChange={state.setHallCustomWidth} min={100} max={4096} />
```

From `kol-apparat/kol-video/kol-mirror/src/components/mirror/MirrorSidebar.jsx`:

```jsx
<QuantityInput value={state.hallCustomHeight} onChange={state.setHallCustomHeight} min={100} max={4096} />
```

From `kol-apparat/kol-video/kol-monitor/a_torg/archive/2026-04-17-src-cleanup/src/components/mirror/MirrorSidebar.jsx`:

```jsx
<QuantityInput value={state.symphonyCustomWidth} onChange={state.setSymphonyCustomWidth} min={100} max={4096} />
```

From `kol-client/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/atoms/QuantityStepperPreview.jsx`:

```jsx
<QuantityInput value={inputValue} onChange={setInputValue} min={1} max={10} />
```

From `kol-apparat/kol-video/kol-modulator/src/components/styleguide/Components.jsx`:

```jsx
<QuantityInput value={1} min={0} max={10} />
```
