# SwatchStack

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 20 across 16 files in 5 apps
- **Weighted inbound:** 50★ across 16 edges — 2×4★ · 14×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 3 | `kol-apps/kol-client-kolkrabbi/src/pages/Demo.jsx` |
| 4 | 3 | `kol-website/_tmp/brand-triage-elder/pages/Demo.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/color/ColourPanel.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/color/ColourPanelRef.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/color/SwatchControls.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/color/ColourPanel.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/color/ColourPanelRef.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/color/SwatchControls.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/editor/color/ColourPanel.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/editor/color/ColourPanelRef.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/editor/color/SwatchControls.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/generator/src/editor/color/ColourPanel.jsx` |
| … | | _4 more_ |

## Import

```jsx
import { SwatchStack } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/editor/color/ColourPanel.jsx`:

```jsx
<SwatchStack
        fillColor={fillColor}
        strokeColor={strokeColor}
        activePaint={activePaint}
        onSwap={swap}
        onClear={onClear}
      />
```

From `kol-apps/kol-client-kolkrabbi/src/pages/Demo.jsx`:

```jsx
<SwatchStack
            fillColor="#FFFFFF"
            strokeColor="#000000"
            activePaint={variant === 'a' ? 'fill' : 'stroke'}
            onSwap={() => setVariant(v => v === 'a' ? 'b' : 'a')}
            onClear={() => {}}
          />
```

From `kol-website/_tmp/brand-triage-elder/pages/Demo.jsx`:

```jsx
<SwatchStack fillColor="#FFFFFF" strokeColor="#000000" activePaint="fill"   onSwap={() => {}} onClear={() => {}} />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/color/SwatchControls.jsx`:

```jsx
<SwatchStack fillColor strokeColor activePaint onSwap onClear />
```

From `kol-apps/kol-client-kolkrabbi/src/pages/Demo.jsx`:

```jsx
<SwatchStack fillColor="#FFFFFF" strokeColor="#000000" activePaint="stroke" onSwap={() => {}} onClear={() => {}} />
```
