# LabeledControl

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 371 across 87 files in 11 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-draw-3d, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-media-admin, kol-monitor, kol-website

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
