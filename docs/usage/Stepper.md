# Stepper

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 16 across 12 files in 8 apps
- **Used in:** kol-client-ac, kol-client-hrafn, kol-client-kolkrabbi, kol-draw-3d, kol-editor, kol-labs-single, kol-lightroom, kol-media-admin

## Import

```jsx
import { Stepper } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-editor/src/pages/KolEditor.jsx`:

```jsx
<Stepper
              value={canvasDialog.width}
              min={200}
              onChange={(e) => setCanvasDialog((prev) => ({ ...prev, width: Number(e.target.value) }))}
            />
```

From `kol-client/kol-client-ac/src/editor/modes/pattern/RuleRow.jsx`:

```jsx
<Stepper
      size="sm"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
    />
```

From `kol-apparat/kol-editors/kol-draw-3d/src/components/molecules/PropertyInput.jsx`:

```jsx
<Stepper value={value} onChange={onChange} min={min} max={max} step={step} />
```

From `kol-client/kol-client-kolkrabbi/src/pages/Components.jsx`:

```jsx
<Stepper size="sm" value={stepSm} onChange={(e) => setStepSm(Number(e.target.value))} min={0} max={100} style={{ width: 120 }} />
```

From `kol-apparat/kol-editors/kol-editor/src/pages/KolEditor.jsx`:

```jsx
<Stepper
              value={canvasDialog.height}
              min={200}
              onChange={(e) => setCanvasDialog((prev) => ({ ...prev, height: Number(e.target.value) }))}
            />
```
