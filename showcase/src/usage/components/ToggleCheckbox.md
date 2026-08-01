# ToggleCheckbox

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 69 across 19 files in 10 apps
- **Weighted inbound:** 62★ across 19 edges — 5×4★ · 14×3★
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-labs-monorepo, kol-labs-single, kol-mirror, kol-modulator, kol-monitor, kol-radial, kol-svg-distress, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 12 | `kol-apps/kol-labs-monorepo/apps/radial/src/radial/apparatus/WavyCircleControls.jsx` |
| 4 | 12 | `kol-apps/kol-radial/src/radial/apparatus/WavyCircleControls.jsx` |
| 4 | 12 | `kol-apps/kol-svg-distress/a-ref/kolkrabbi-radial/src/radial/apparatus/WavyCircleControls.jsx` |
| 4 | 6 | `kol-apps/kol-svg-distress/src/pages/RefinePage.jsx` |
| 4 | 3 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/apparatus/WavyCircleControls.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/src/pages/Components.jsx` |
| 3 | 2 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/Components.jsx` |
| 3 | 2 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/atoms/TogglesPreview.jsx` |
| 3 | 2 | `kol-apps/kol-mirror/src/components/styleguide/Components.jsx` |
| 3 | 2 | `kol-apps/kol-mirror/src/components/styleguide/preview/atoms/TogglesPreview.jsx` |
| 3 | 2 | `kol-apps/kol-modulator/src/components/styleguide/Components.jsx` |
| 3 | 2 | `kol-apps/kol-modulator/src/components/styleguide/preview/atoms/TogglesPreview.jsx` |
| … | | _7 more_ |

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
