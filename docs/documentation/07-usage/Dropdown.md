# Dropdown

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 544 across 182 files in 11 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-editor, kol-editor-radar, kol-labs-monorepo, kol-labs-single, kol-mirror, kol-modulator, kol-monitor, kol-website

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
