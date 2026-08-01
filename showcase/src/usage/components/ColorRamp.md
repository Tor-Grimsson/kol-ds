# ColorRamp

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 15 across 5 files in 5 apps
- **Weighted inbound:** 25★ across 5 edges — 5×5★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 5 | 3 | `kol-apps/kol-client-ac/src/components/sections/ColorRamp.jsx` |
| 5 | 3 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/components/sections/ColorRamp.jsx` |
| 5 | 3 | `kol-apps/kol-client-kolkrabbi/src/components/sections/ColorRamp.jsx` |
| 5 | 3 | `kol-apps/kol-labs-monorepo/apps/generator/src/components/sections/ColorRamp.jsx` |
| 5 | 3 | `kol-website/apps/brand/src/components/sections/ColorRamp.jsx` |

## Import

```jsx
import { ColorRamp } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/components/sections/ColorRamp.jsx`:

```jsx
<ColorRamp ramp="brand-yellow" anchor={300} note="Pure yellow lock." />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/components/sections/ColorRamp.jsx`:

```jsx
<ColorRamp ramp="grey" stops={[50,100,200,300,400,500,600,700,800,900]} />
```

From `kol-apps/kol-client-kolkrabbi/src/components/sections/ColorRamp.jsx`:

```jsx
<ColorRamp ramp="cream" />
```
