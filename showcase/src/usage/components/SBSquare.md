# SBSquare

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 12 across 12 files in 6 apps
- **Weighted inbound:** 36★ across 12 edges — 12×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-labs-monorepo, kol-labs-single, kol-website

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
| 3 | 1 | `kol-apps/kol-labs-single/src/components/color/ColorPicker.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/components/color/SpectrumControls.jsx` |
| 3 | 1 | `kol-website/_tmp/brand-triage-elder/editor/color/ColourPanel.jsx` |
| 3 | 1 | `kol-website/_tmp/brand-triage-elder/editor/color/SpectrumControls.jsx` |

## Import

```jsx
import { SBSquare } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/editor/color/ColourPanel.jsx`:

```jsx
<SBSquare hue={hsv.h} sat={hsv.s} val={hsv.v} onChange={onSV} />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/color/SpectrumControls.jsx`:

```jsx
<SBSquare hue sat val onChange />
```
