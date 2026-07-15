# WheelTriangle

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 10 across 10 files in 5 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-labs-monorepo, kol-website

## Import

```jsx
import { WheelTriangle } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/editor/color/ColourPanel.jsx`:

```jsx
<WheelTriangle
      hue={hsv.h} sat={hsv.s} val={hsv.v}
      onChangeHue={(h)   => setHex(colord({ h,        s: hsv.s, v: hsv.v }).toHex())}
      onChangeSV={(s, v) => setHex(colord({ h: hsv.h, s,        v        }).toHex())}
    />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/color/SpectrumControls.jsx`:

```jsx
<WheelTriangle hue sat val onChangeHue onChangeSV />
```
