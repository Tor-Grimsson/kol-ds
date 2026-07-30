# CurveOverlay

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 6 across 6 files in 6 apps
- **Weighted inbound:** 18★ across 6 edges — 6×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-editor, kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/modes/type/TypeFrame.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/modes/type/TypeFrame.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/editor/modes/type/TypeFrame.jsx` |
| 3 | 1 | `kol-apps/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/generators/type-lab/TypeFrame.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/generator/src/editor/modes/type/TypeFrame.jsx` |
| 3 | 1 | `kol-website/_tmp/brand-triage-elder/editor/modes/type/TypeFrame.jsx` |

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
