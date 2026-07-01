# Section

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 201 across 35 files in 7 apps
- **Used in:** kol-client-ac, kol-client-hrafn, kol-client-kolkrabbi, kol-editor, kol-labs-single, kol-lightroom, kol-resume

## Import

```jsx
import { Section } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/generators/combo-lab/ComboLab.jsx`:

```jsx
<Section label="Aspect">
            <Dropdown
              variant="subtle"
              size="sm"
              className="w-full"
              options={ASPECT_OPTIONS}
              value={aspect}
              onChange={setAspect}
            />
```

From `kol-apparat/kol-lightroom/src/pages/Develop.jsx`:

```jsx
<Section title="Info" defaultOpen={false}>
              <dl className="flex flex-col gap-3 kol-mono-12 text-body">
                <Row k="File" v={info?.fileName} />
```

From `kol-apparat/kol-labs-single/src/pages/distress/components/ControlsPanel.jsx`:

```jsx
<Section label="Source">
        <input
          ref={fileRef}
          type="file"
          accept=".svg"
          onChange={onUpload}
          className="hidden"
        />
```

From `kol-client/kol-client-ac/src/editor/modes/palette/PaletteControls.jsx`:

```jsx
<Section label="Aspect">
              <Dropdown
                variant="subtle" size="sm" className="w-full"
                options={ASPECT_OPTIONS}
                value={aspect}
                onChange={setAspect}
              />
```

From `kol-client/kol-client-kolkrabbi/src/editor/modes/palette/PaletteControls.jsx`:

```jsx
<Section label="Logo">
            <ViewToggle
              variant="single"
              options={[{ value: 'off', label: 'Off' }, { value: 'on', label: 'On' }]}
              viewMode={logoId === 'no-logo' ? 'off' : 'on'}
              onViewChange={(v) => setLogoId(v === 'off' ? 'no-logo' : 'client')}
            />
```
