# SegmentedToggle

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 23 across 18 files in 7 apps
- **Used in:** kol-client-ac, kol-client-hrafn, kol-client-kolkrabbi, kol-labs-single, kol-lightroom, kol-media-admin, kol-resume

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

From `kol-apparat/kol-labs-single/src/pages/distress/pages/MainPage.jsx`:

```jsx
<SegmentedToggle
          value={railTab}
          onChange={setRailTab}
          options={[
            { value: 'modes', label: 'Modes' },
            { value: 'controls', label: 'Controls' },
          ]}
        />
```

From `kol-resume/app/src/pages/CoverLetter.jsx`:

```jsx
<SegmentedToggle
          value={id}
          onChange={setId}
          options={LETTERS.map((l) => ({ value: l.id, label: l.label }))}
          className="mb-8 max-w-md print:hidden"
        />
```

From `kol-client/kol-client-ac/src/editor/color/ColourPanel.jsx`:

```jsx
<SegmentedToggle value={model} onChange={setModel} options={MODEL_OPTIONS} />
```

From `kol-client/kol-client-kolkrabbi/src/editor/color/StrokePanel.jsx`:

```jsx
<SegmentedToggle size="sm" value={style} onChange={onStyle} options={STYLE_OPTIONS} />
```
