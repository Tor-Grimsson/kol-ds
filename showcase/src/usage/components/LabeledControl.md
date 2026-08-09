# LabeledControl

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 371 across 87 files in 11 apps
- **Weighted inbound:** 286★ across 87 edges — 25×4★ · 62×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-draw-3d, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-media-admin, kol-monitor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 34 | `kol-apps/kol-client-ac/src/editor/compose/inspectors/LayerInspector.jsx` |
| 4 | 34 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/compose/inspectors/LayerInspector.jsx` |
| 4 | 34 | `kol-apps/kol-client-kolkrabbi/src/editor/compose/inspectors/LayerInspector.jsx` |
| 4 | 34 | `kol-apps/kol-labs-monorepo/apps/generator/src/editor/compose/inspectors/LayerInspector.jsx` |
| 4 | 34 | `kol-website/_tmp/brand-triage-elder/editor/compose/inspectors/LayerInspector.jsx` |
| 4 | 11 | `kol-apps/kol-draw-3d/src/components/studio/ControlsPanel.jsx` |
| 4 | 11 | `kol-apps/kol-labs-monorepo/apps/draw-3d/src/components/studio/ControlsPanel.jsx` |
| 4 | 11 | `kol-apps/kol-labs-single/src/pages/loops/PatternControls.jsx` |
| 4 | 9 | `kol-apps/kol-labs-single/src/pages/interfaces/InterfacesPage.jsx` |
| 4 | 7 | `kol-apps/kol-labs-single/src/pages/penrose/PenrosePage.jsx` |
| 4 | 5 | `kol-apps/kol-labs-single/src/pages/math/fields/FieldsEditor.jsx` |
| 4 | 4 | `kol-apps/kol-client-ac/src/editor/color/StrokePanel.jsx` |
| … | | _75 more_ |

## Import

```jsx
import { LabeledControl } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/editor/color/ColourPanel.jsx`:

```jsx
<LabeledControl inline label={label} hint={hint}>
      <Slider min={0} max={max} value={value} onChange={onChange} />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/color/ColourPanel.jsx`:

```jsx
<LabeledControl inline label="Opacity">
      <Slider min={0} max={100} value={value} onChange={onChange} />
```

From `kol-apps/kol-client-kolkrabbi/src/editor/color/StrokePanel.jsx`:

```jsx
<LabeledControl inline label="Weight">
        <Input
          variant="filled"
          size="sm"
          suffix="pt"
          chars={4}
          value={weight}
          onChange={(e) => onWeight(e.target.value)}
        />
```

From `kol-apps/kol-draw-3d/src/components/studio/ControlsPanel.jsx`:

```jsx
<LabeledControl label="Distance" hint={knobs.distance.toFixed(1)}>
        <Slider min={-60} max={60} step={0.1} value={knobs.distance} onChange={(v) => setKnobs({ distance: v })} />
```

From `kol-apps/kol-labs-monorepo/apps/draw-3d/src/components/studio/ControlsPanel.jsx`:

```jsx
<LabeledControl label="Focal" hint={knobs.focal.toFixed(2)}>
        <Slider min={-8} max={8} step={0.05} value={knobs.focal} onChange={(v) => setKnobs({ focal: v })} />
```
