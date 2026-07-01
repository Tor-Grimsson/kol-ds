# ColorSwatch

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 29 across 19 files in 8 apps
- **Used in:** kol-client-ac, kol-client-kolkrabbi, kol-editor, kol-labs-single, kol-mirror, kol-modulator, kol-monitor, kol-radar

## Import

```jsx
import { ColorSwatch } from '@kolkrabbi/kol-component'
```

## Real usage

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

From `kol-apparat/kol-labs-single/src/pages/distress/pages/RefinePage.jsx`:

```jsx
<ColorSwatch
                          hex={strokeColor}
                          size={32}
                          radius="full"
                          showTransparent={!strokeEnabled}
                          transparentTone="error"
                          aria-haspopup="dialog"
                          aria-expanded={showStrokePicker}
                          onClick={(event) => {
                            if (event.altKey) {
                              setStrokeEnabled((prev) => !prev)
                            } else {
                              setShowStrokePicker((prev) => !prev)
                            }
                          }}
                        />
```

From `kol-apparat/kol-editors/kol-radar/src-grab/components/styleguide/ColorPalette.jsx`:

```jsx
<ColorSwatch key={token} token={token} />
```
