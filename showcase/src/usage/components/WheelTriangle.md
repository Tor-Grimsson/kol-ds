# WheelTriangle

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 10 across 10 files in 5 apps
- **Weighted inbound:** 30★ across 10 edges — 10×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/color/ColourPanel.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/color/SpectrumControls.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/color/ColourPanel.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/color/SpectrumControls.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/editor/color/ColourPanel.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/editor/color/SpectrumControls.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/generator/src/editor/color/ColourPanel.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/generator/src/editor/color/SpectrumControls.jsx` |
| 3 | 1 | `kol-website/_tmp/brand-triage-elder/editor/color/ColourPanel.jsx` |
| 3 | 1 | `kol-website/_tmp/brand-triage-elder/editor/color/SpectrumControls.jsx` |

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
