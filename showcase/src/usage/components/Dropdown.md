# Dropdown

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 487 across 163 files in 9 apps
- **Weighted inbound:** 557★ across 163 edges — 2×5★ · 64×4★ · 97×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-editor, kol-editor-radar, kol-labs-monorepo, kol-labs-single, kol-modulator, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 5 | 3 | `kol-apps/kol-editor/src/components/organisms/ColorLabPanel.jsx` |
| 5 | 3 | `kol-apps/kol-labs-monorepo/apps/editor/src/components/organisms/ColorLabPanel.jsx` |
| 4 | 12 | `kol-apps/kol-labs-single/src/pages/loops/PatternControls.jsx` |
| 4 | 12 | `kol-apps/kol-labs-single/src/pages/math/fields/FieldsEditor.jsx` |
| 4 | 11 | `kol-apps/kol-client-ac/src/editor/compose/inspectors/LayerInspector.jsx` |
| 4 | 11 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/compose/inspectors/LayerInspector.jsx` |
| 4 | 11 | `kol-apps/kol-client-kolkrabbi/src/editor/compose/inspectors/LayerInspector.jsx` |
| 4 | 11 | `kol-apps/kol-editor-radar/src-grab/components/hall-of-mirrors/SymphonyMixer.jsx` |
| 4 | 11 | `kol-apps/kol-labs-monorepo/apps/generator/src/editor/compose/inspectors/LayerInspector.jsx` |
| 4 | 11 | `kol-apps/kol-labs-monorepo/apps/mirror/src/components/hall-of-mirrors/SymphonyMixer.jsx` |
| 4 | 11 | `kol-website/_tmp/brand-triage-elder/editor/compose/inspectors/LayerInspector.jsx` |
| 4 | 9 | `kol-apps/kol-labs-single/src/pages/math/surfaces/SurfacesEditor.jsx` |
| … | | _151 more_ |

## Import

```jsx
import { Dropdown } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/editor/color/ColourPanel.jsx`:

```jsx
<Dropdown
          variant="subtle"
          size="sm"
          options={MODE_OPTIONS}
          value={mode}
          onChange={setMode}
          className="w-[110px]"
        />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/color/SwatchesPanel.jsx`:

```jsx
<Dropdown
        variant="subtle"
        size="sm"
        options={PALETTES}
        value={palette}
        onChange={setPalette}
        className="w-full"
      />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/foundry/FontControlsPanel.jsx`:

```jsx
<Dropdown
            options={weightOptions}
            value={selectedWeight}
            onChange={onWeightChange}
            className="min-w-[140px]"
          />
```

From `kol-apps/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/compose/LayerStack.jsx`:

```jsx
<Dropdown
            variant="subtle" size="sm"
            options={BLEND_MODES}
            value={layer.blend ?? 'normal'}
            onChange={(v) => onUpdate({ blend: v })}
          />
```

From `kol-apps/kol-editor-radar/src/App.jsx`:

```jsx
<Dropdown
          options={[{ value: '', label: 'Add FX...' }, ...CANVAS_FX_DEFS.map(d => ({ value: d.id, label: d.label }))]}
          value=""
          onChange={(v) => addFx(v)}
          variant="minimal"
          className="w-full"
        />
```
