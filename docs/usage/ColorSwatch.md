# ColorSwatch

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 29 across 20 files in 8 apps
- **Used in:** kol-client-ac, kol-client-kolkrabbi, kol-editor, kol-labs-single, kol-mirror, kol-modulator, kol-monitor, kol-radar

## Import

```jsx
import { ColorSwatch } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-labs-single/src/components/color/ColorPicker.jsx`:

```jsx
<ColorSwatch
              key={`${p}-${i}`}
              hex={p}
              size={18}
              radius="tight"
              frame={false}
              selected={clampHex(p) === hex}
              onClick={() => set(p)}
              title={clampHex(p)}
            />
```

From `kol-client/kol-client-ac/src/editor/color/SwatchesPanel.jsx`:

```jsx
<ColorSwatch
            key={`${hex}-${i}`}
            hex={hex}
            size="stretch"
            radius="tight"
            frame={false}
            onClick={onPick ? () => onPick(hex) : undefined}
          />
```

From `kol-client/kol-client-kolkrabbi/src/components/molecules/TypeBlockToolbar.jsx`:

```jsx
<ColorSwatch
        hex={value}
        size={20}
        onClick={() => inputRef.current?.click()}
        title="Frame color"
      />
```

From `kol-apparat/kol-editors/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/generators/type-lab/FloatingToolbar.jsx`:

```jsx
<ColorSwatch value={frame.color} onChange={(hex) => onUpdate({ color: hex })} />
```

From `kol-apparat/kol-editors/kol-radar/src-grab/components/styleguide/ColorPalette.jsx`:

```jsx
<ColorSwatch key={token} token={token} />
```
