# SwatchStack

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 20 across 16 files in 5 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-labs-monorepo, kol-website

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

From `kol-website/apps/brand/src/pages/Demo.jsx`:

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
