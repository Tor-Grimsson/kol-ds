# SegmentedToggle

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 95 across 59 files in 7 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-labs-single, kol-lightroom, kol-media-admin

## Import

```jsx
import { SegmentedToggle } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-plugin/kol-media-admin/src/components/molecules/SegmentedToggle.jsx`:

```jsx
<SegmentedToggle
 *     value={current}
 *     onChange={setCurrent}
 *     options={[{ value, label }]}
 *   />
```

From `kol-apparat/kol-labs-single/src/components/framework/MediaPicker.jsx`:

```jsx
<SegmentedToggle
            className="w-56 shrink-0"
            value={source}
            onChange={setSource}
            options={[{ value: 'library', label: 'Library' }, { value: 'gallery', label: 'Gallery' }]}
          />
```

From `kol-client/kol-client-ac/src/editor/color/ColourPanel.jsx`:

```jsx
<SegmentedToggle value={model} onChange={setModel} options={MODEL_OPTIONS} />
```

From `kol-client/kol-client-acyr-website/apps/styleguide/src/editor/color/StrokePanel.jsx`:

```jsx
<SegmentedToggle size="sm" value={style} onChange={onStyle} options={STYLE_OPTIONS} />
```

From `kol-client/kol-client-kolkrabbi/src/editor/color/StrokePanel.jsx`:

```jsx
<SegmentedToggle value={cap}   onChange={(v) => setProp('strokeLinecap',  v)} options={CAP_OPTIONS}   />
```
