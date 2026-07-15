# Slider

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 1090 across 222 files in 17 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-draw-3d, kol-editor, kol-editor-radar, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-media-admin, kol-mirror, kol-modulator, kol-monitor, kol-radial, kol-svg-distress, kol-website

## Import

```jsx
import { Slider } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/editor/compose/inspectors/CanvasInspector.jsx`:

```jsx
<Slider
          min={0}
          max={100}
          value={Math.round((canvasFillOpacity ?? 1) * 100)}
          onChange={(v) => setCanvasFillOpacity(v / 100)}
        />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/compose/inspectors/LayerInspector.jsx`:

```jsx
<Slider
            min={3} max={12} step={1}
            value={layer.sides ?? 5}
            formatValue={(v) => `${v}`}
            onChange={(v) => setProp('sides', v)}
          />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/foundry/FontControlsPanel.jsx`:

```jsx
<Slider
            label="Size"
            min={sizeMin}
            max={sizeMax}
            value={size}
            onChange={onSizeChange}
            displayWidth={12}
            className="w-full"
            variant="minimal"
          />
```

From `kol-apps/kol-draw-3d/src/components/studio/InspectorPanel.jsx`:

```jsx
<Slider
          min={0.05}
          max={1}
          step={0.05}
          value={cuboid.style?.opacity ?? 1}
          onChange={(v) => setStyle('opacity', v)}
        />
```

From `kol-apps/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/compose/LayerStack.jsx`:

```jsx
<Slider
              min={0} max={100} step={1}
              value={Math.round(layer.opacity * 100)}
              onChange={(v) => onUpdate({ opacity: v / 100 })}
              variant="minimal"
            />
```
