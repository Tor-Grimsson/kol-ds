# SegmentedToggle

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 105 across 65 files in 9 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-media-admin, kol-website

## Import

```jsx
import { SegmentedToggle } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/components/molecules/SegmentedToggle.jsx`:

```jsx
<SegmentedToggle
 *     value={current}
 *     onChange={setCurrent}
 *     options={[{ value, label }]}
 *   />
```

From `kol-apps/kol-labs-single/src/components/framework/MediaPicker.jsx`:

```jsx
<SegmentedToggle
            className="w-56 shrink-0"
            value={source}
            onChange={setSource}
            options={[{ value: 'library', label: 'Library' }, { value: 'gallery', label: 'Gallery' }]}
          />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/color/ColourPanel.jsx`:

```jsx
<SegmentedToggle value={model} onChange={setModel} options={MODEL_OPTIONS} />
```

From `kol-apps/kol-client-kolkrabbi/src/editor/color/StrokePanel.jsx`:

```jsx
<SegmentedToggle size="sm" value={style} onChange={onStyle} options={STYLE_OPTIONS} />
```

From `kol-apps/kol-labs-monorepo/apps/generator/src/editor/color/StrokePanel.jsx`:

```jsx
<SegmentedToggle value={cap}   onChange={(v) => setProp('strokeLinecap',  v)} options={CAP_OPTIONS}   />
```
