# ToggleCheckbox

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 54 across 16 files in 8 apps
- **Used in:** kol-client-kolkrabbi, kol-distress, kol-labs-single, kol-mirror, kol-modulator, kol-monitor, kol-radar, kol-radial

## Import

```jsx
import { ToggleCheckbox } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-radar/src-grab/components/styleguide/preview/atoms/TogglesPreview.jsx`:

```jsx
<ToggleCheckbox
                label="Enable"
                checked={checkboxState}
                onChange={setCheckboxState}
              />
```

From `kol-apparat/kol-video/kol-distress/a-ref/kolkrabbi-radial/src/radial/apparatus/WavyCircleControls.jsx`:

```jsx
<ToggleCheckbox
            label={<span className="kol-mono-xs tracking-[0.08em]">Sync</span>}
            checked={params.lfoSync}
            onChange={(next) => onParamChange('lfoSync', next)}
          />
```

From `kol-apparat/kol-video/kol-radial/src/radial/apparatus/WavyCircleControls.jsx`:

```jsx
<ToggleCheckbox
              label={<span className="kol-mono-xs tracking-[0.08em]">Sym X</span>}
              checked={params.lfoSymmetryX}
              onChange={(next) => onParamChange('lfoSymmetryX', next)}
            />
```

From `kol-client/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/apparatus/WavyCircleControls.jsx`:

```jsx
<ToggleCheckbox
            label={<span className="kol-mono-text-xs uppercase tracking-[0.08em]">Grid</span>}
            checked={ui.showGrid}
            onChange={(next) => onUiToggle('showGrid', next)}
          />
```

From `kol-apparat/kol-labs-single/src/pages/interfaces/ParamControls.jsx`:

```jsx
<ToggleCheckbox key={p.key} label={p.label} checked={!!opts[p.key]} onChange={(v) => onChange(p.key, v)} />
```
