# Dropdown

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 244 across 82 files in 8 apps
- **Used in:** kol-client-ac, kol-client-kolkrabbi, kol-editor, kol-labs-single, kol-mirror, kol-modulator, kol-monitor, kol-radar

## Import

```jsx
import { Dropdown } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/compose/LayerStack.jsx`:

```jsx
<Dropdown
            variant="subtle" size="sm"
            options={BLEND_MODES}
            value={layer.blend ?? 'normal'}
            onChange={(v) => onUpdate({ blend: v })}
          />
```

From `kol-apparat/kol-editors/kol-radar/src/App.jsx`:

```jsx
<Dropdown
          options={[{ value: '', label: 'Add FX...' }, ...CANVAS_FX_DEFS.map(d => ({ value: d.id, label: d.label }))]}
          value=""
          onChange={(v) => addFx(v)}
          variant="minimal"
          className="w-full"
        />
```

From `kol-apparat/kol-video/kol-mirror/src/components/hall-of-mirrors/MasterModule.jsx`:

```jsx
<Dropdown
                  options={BLEND_OPTIONS}
                  value={ch.blendMode || 'normal'}
                  onChange={(v) => onChannelUpdate(i, { blendMode: v })}
                  variant="minimal"
                  size="md"
                />
```

From `kol-apparat/kol-video/kol-modulator/src/components/styleguide/preview/molecules/ComponentPreview.jsx`:

```jsx
<Dropdown
            {...props}
            value={dropdownValue}
            onChange={setDropdownValue}
          />
```

From `kol-apparat/kol-video/kol-monitor/a_torg/archive/2026-04-17-src-cleanup/src/components/mirror/MirrorSidebar.jsx`:

```jsx
<Dropdown
              options={[
                { value: 'contain', label: 'Contain' },
                { value: 'fit-width', label: 'Fit Width' },
                { value: 'fit-height', label: 'Fit Height' },
                { value: 'manual', label: 'Manual' },
              ]}
              value={state.imageFitMode}
              onChange={(v) => state.setImageFitMode(v)}
              variant="minimal"
              size="md"
            />
```
