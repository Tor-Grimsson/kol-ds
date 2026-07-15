# ColorSwatch

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 59 across 39 files in 11 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-editor, kol-editor-radar, kol-labs-monorepo, kol-labs-single, kol-mirror, kol-modulator, kol-monitor, kol-website

## Import

```jsx
import { ColorSwatch } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/editor/color/SwatchesPanel.jsx`:

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

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/components/TypeBlockToolbar.jsx`:

```jsx
<ColorSwatch
        hex={value}
        size={20}
        onClick={() => inputRef.current?.click()}
        title="Frame color"
      />
```

From `kol-apps/kol-client-kolkrabbi/src/editor/compose/SwatchRow.jsx`:

```jsx
<ColorSwatch
          hex={unused ? null : hex}
          showTransparent={unused}
          size="stretch"
          onClick={onToggleLock}
          aria-pressed={locked}
          title={locked ? 'Unlock' : 'Lock'}
        />
```

From `kol-apps/kol-labs-monorepo/apps/generator/src/editor/compose/inspectors/LayerInspector.jsx`:

```jsx
<ColorSwatch
            hex={resolved}
            size={32}
            showTransparent={isNone}
            transparentTone={isStroke ? 'error' : 'warning'}
            hoverable={false}
          />
```

From `kol-apps/kol-labs-single/src/components/color/ColorPicker.jsx`:

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
