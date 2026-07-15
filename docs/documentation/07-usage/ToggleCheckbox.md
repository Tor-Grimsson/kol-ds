# ToggleCheckbox

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 69 across 19 files in 10 apps
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-labs-monorepo, kol-labs-single, kol-mirror, kol-modulator, kol-monitor, kol-radial, kol-svg-distress, kol-website

## Import

```jsx
import { ToggleCheckbox } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/apparatus/WavyCircleControls.jsx`:

```jsx
<ToggleCheckbox
            label={<span className="kol-mono-text-xs uppercase tracking-[0.08em]">Grid</span>}
            checked={ui.showGrid}
            onChange={(next) => onUiToggle('showGrid', next)}
          />
```

From `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/atoms/TogglesPreview.jsx`:

```jsx
<ToggleCheckbox
                label="Enable"
                checked={checkboxState}
                onChange={setCheckboxState}
              />
```

From `kol-apps/kol-labs-monorepo/apps/radial/src/radial/apparatus/WavyCircleControls.jsx`:

```jsx
<ToggleCheckbox
            label={<span className="kol-mono-12 tracking-[0.08em]">Sync</span>}
            checked={params.lfoSync}
            onChange={(next) => onParamChange('lfoSync', next)}
          />
```

From `kol-apps/kol-radial/src/radial/apparatus/WavyCircleControls.jsx`:

```jsx
<ToggleCheckbox
            label={<span className="kol-mono-xs tracking-[0.08em]">Sync</span>}
            checked={params.lfoSync}
            onChange={(next) => onParamChange('lfoSync', next)}
          />
```

From `kol-apps/kol-svg-distress/a-ref/kolkrabbi-radial/src/radial/apparatus/WavyCircleControls.jsx`:

```jsx
<ToggleCheckbox
              label={<span className="kol-mono-xs tracking-[0.08em]">Sym X</span>}
              checked={params.lfoSymmetryX}
              onChange={(next) => onParamChange('lfoSymmetryX', next)}
            />
```
