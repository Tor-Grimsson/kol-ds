# Section

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 585 across 105 files in 9 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-editor, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-website

## Import

```jsx
import { Section } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/editor/modes/palette/PaletteControls.jsx`:

```jsx
<Section label="Aspect">
              <Dropdown
                variant="subtle" size="sm" className="w-full"
                options={ASPECT_OPTIONS}
                value={aspect}
                onChange={setAspect}
              />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/modes/palette/PaletteControls.jsx`:

```jsx
<Section label="Logo">
            <ViewToggle
              variant="single"
              options={[{ value: 'off', label: 'Off' }, { value: 'on', label: 'On' }]}
              viewMode={logoId === 'no-logo' ? 'off' : 'on'}
              onViewChange={(v) => setLogoId(v === 'off' ? 'no-logo' : 'client')}
            />
```

From `kol-apps/kol-client-kolkrabbi/src/editor/modes/palette/PaletteControls.jsx`:

```jsx
<Section label="Layout">
              <Dropdown variant="subtle" size="sm" className="w-full" options={LAYOUT_OPTIONS} value={layoutId} onChange={setLayoutId} />
```

From `kol-apps/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/generators/combo-lab/ComboLab.jsx`:

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

From `kol-apps/kol-labs-monorepo/apps/generator/src/editor/modes/palette/PaletteControls.jsx`:

```jsx
<Section label="BG">
            <ViewToggle
              variant="single"
              options={[{ value: 'off', label: 'Off' }, { value: 'on', label: 'On' }]}
              viewMode={bgOn ? 'on' : 'off'}
              onViewChange={(v) => { if ((v === 'on') !== bgOn) toggleBg() }}
            />
```
