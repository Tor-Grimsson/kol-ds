# QuantityStepper

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 12 across 11 files in 6 apps
- **Used in:** kol-client-kolkrabbi, kol-divs, kol-mirror, kol-modulator, kol-monitor, kol-radar

## Import

```jsx
import { QuantityStepper } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-radar/src-grab/components/styleguide/preview/atoms/QuantityStepperPreview.jsx`:

```jsx
<QuantityStepper
            value={values[`${bp.id}-${tone}`]}
            onChange={(v) => handleChange(`${bp.id}-${tone}`, v)}
            min={1}
            max={10}
            size={bp.id}
          />
```

From `kol-apparat/kol-docs/kol-divs/src/pages/Box.jsx`:

```jsx
<QuantityStepper value={count} onChange={setCount} min={1} max={8} size="sm" />
```

From `kol-client/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/atoms/QuantityStepperPreview.jsx`:

```jsx
<QuantityStepper value={stepperValue} onChange={setStepperValue} min={1} max={10} />
```

From `kol-apparat/kol-video/kol-mirror/src/components/styleguide/Components.jsx`:

```jsx
<QuantityStepper value={1} min={0} max={10} />
```

From `kol-apparat/kol-docs/kol-divs/src/pages/Grid.jsx`:

```jsx
<QuantityStepper value={count} onChange={setCount} min={2} max={20} size="sm" />
```
