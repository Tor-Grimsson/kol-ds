# CurveOverlay

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 6 across 6 files in 6 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-editor, kol-labs-monorepo, kol-website

## Import

```jsx
import { CurveOverlay } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/editor/modes/type/TypeFrame.jsx`:

```jsx
<CurveOverlay
          width={frame.w}
          height={frame.size * 1.2}
          curve={frame.axisCurve ?? 'flat'}
          blend={frame.blend}
          cp1={frame.curveCp1 ?? { x: 0.33, y: 0.33 }}
          cp2={frame.curveCp2 ?? { x: 0.66, y: 0.66 }}
        />
```
