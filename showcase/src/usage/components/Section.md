# Section

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 585 across 105 files in 9 apps
- **Weighted inbound:** 388★ across 105 edges — 73×4★ · 32×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-editor, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 16 | `kol-apps/kol-labs-single/src/pages/math/parametric/ParametricEditor.jsx` |
| 4 | 15 | `kol-apps/kol-labs-single/src/pages/loops/PatternControls.jsx` |
| 4 | 14 | `kol-apps/kol-client-ac/src/editor/modes/type/TypeControls.jsx` |
| 4 | 14 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/modes/type/TypeControls.jsx` |
| 4 | 14 | `kol-apps/kol-client-kolkrabbi/src/editor/modes/type/TypeControls.jsx` |
| 4 | 14 | `kol-apps/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/generators/compositor/Compositor.jsx` |
| 4 | 14 | `kol-apps/kol-labs-monorepo/apps/generator/src/editor/modes/type/TypeControls.jsx` |
| 4 | 14 | `kol-website/_tmp/brand-triage-elder/editor/modes/type/TypeControls.jsx` |
| 4 | 13 | `kol-apps/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/generators/type-lab/TypeControls.jsx` |
| 4 | 13 | `kol-apps/kol-labs-single/src/pages/radar/refract/LensShell.jsx` |
| 4 | 11 | `kol-apps/kol-client-ac/src/editor/modes/pattern/PatternControls.jsx` |
| 4 | 11 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/modes/pattern/PatternControls.jsx` |
| … | | _93 more_ |

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
