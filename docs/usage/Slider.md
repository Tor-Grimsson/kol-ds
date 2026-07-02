# Slider

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 866 across 166 files in 14 apps
- **Used in:** kol-client-ac, kol-client-hrafn, kol-client-kolkrabbi, kol-distress, kol-draw-3d, kol-editor, kol-labs-single, kol-lightroom, kol-media-admin, kol-mirror, kol-modulator, kol-monitor, kol-radar, kol-radial

## Import

```jsx
import { Slider } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-draw-3d/src/components/studio/InspectorPanel.jsx`:

```jsx
<Slider
          min={0.05}
          max={1}
          step={0.05}
          value={cuboid.style?.opacity ?? 1}
          onChange={(v) => setStyle('opacity', v)}
        />
```

From `kol-apparat/kol-editors/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/compose/LayerStack.jsx`:

```jsx
<Slider
              min={0} max={100} step={1}
              value={Math.round(layer.opacity * 100)}
              onChange={(v) => onUpdate({ opacity: v / 100 })}
              variant="minimal"
            />
```

From `kol-apparat/kol-editors/kol-radar/src/App.jsx`:

```jsx
<Slider
                  key={key}
                  label={key}
                  min={spec.min}
                  max={spec.max}
                  step={spec.step}
                  value={fx.params[key]}
                  onChange={(v) => updateFxParam(i, key, v)}
                  variant="minimal"
                  fontSize="10px"
                />
```

From `kol-apparat/kol-video/kol-distress/a-ref/kolkrabbi-radial/src/radial/apparatus/WavyCircleControls.jsx`:

```jsx
<Slider
            label="Speed"
            min={0.1}
            max={5}
            step={0.1}
            value={ui.animateSpeed}
            onChange={(value) => onUiToggle('animateSpeed', value)}
            variant="minimal"
            className="flex-1"
            formatValue={(value) => `${value.toFixed(1)}×`}
          />
```

From `kol-apparat/kol-video/kol-mirror/src/components/hall-of-mirrors/MasterModule.jsx`:

```jsx
<Slider
            label="Opacity"
            min={0} max={100} step={1}
            value={opacity}
            onChange={(v) => onMasterChange({ opacity: v })}
            formatValue={(v) => `${Math.round(v)}%`}
            variant="minimal"
          />
```
