# Slider

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 1026 across 196 files in 13 apps
- **Weighted inbound:** 713★ across 196 edges — 11×5★ · 103×4★ · 82×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-draw-3d, kol-editor, kol-editor-radar, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-modulator, kol-radial, kol-svg-distress, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 5 | 8 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/molecules/WorkControlsPanel.jsx` |
| 5 | 8 | `kol-website/_tmp/workshop-museum-elder/components/workshop/molecules/WorkControlsPanel.jsx` |
| 5 | 4 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/fontviewer/FontPreviewCard.jsx` |
| 5 | 4 | `kol-website/_tmp/2026-08-27-dev-demo-retired/FontPreviewCard.jsx` |
| 5 | 3 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/molecules/DistortionControlsPanel.jsx` |
| 5 | 3 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/molecules/MovementControlsPanel.jsx` |
| 5 | 3 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/molecules/DistortionControlsPanel.jsx` |
| 5 | 3 | `kol-apps/kol-modulator/src/components/styleguide/preview/molecules/DistortionControlsPanel.jsx` |
| 5 | 3 | `kol-website/_tmp/2026-08-27-foundry-reconcile/TypefaceVariablePreview.jsx` |
| 5 | 3 | `kol-website/_tmp/workshop-museum-elder/components/workshop/molecules/DistortionControlsPanel.jsx` |
| 5 | 3 | `kol-website/_tmp/workshop-museum-elder/components/workshop/molecules/MovementControlsPanel.jsx` |
| 4 | 40 | `kol-apps/kol-editor/src/components/organisms/FilterPanel.jsx` |
| … | | _184 more_ |

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
