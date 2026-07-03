# LabeledControl

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 257 across 68 files in 9 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-draw-3d, kol-labs-single, kol-lightroom, kol-media-admin, kol-monitor

## Import

```jsx
import { LabeledControl } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-draw-3d/src/components/studio/ControlsPanel.jsx`:

```jsx
<LabeledControl label="Distance" hint={knobs.distance.toFixed(1)}>
        <Slider min={-60} max={60} step={0.1} value={knobs.distance} onChange={(v) => setKnobs({ distance: v })} />
```

From `kol-apparat/kol-video/kol-monitor/src/modules/generators/DitherModule.jsx`:

```jsx
<LabeledControl key={item.value} label={item.text}>
                <IconButton icon={item.icon} title={item.value} active={mode === item.value} onClick={() => onModeChange(item.value)} />
```

From `kol-apparat/kol-lightroom/src/pages/Develop.jsx`:

```jsx
<LabeledControl key={s.key} label={s.label}>
                    <Slider
                      variant="minimal"
                      min={s.min}
                      max={s.max}
                      step={s.step}
                      value={adj[s.key]}
                      onChange={set(s.key)}
                    />
```

From `kol-apparat/kol-labs-single/src/components/framework/SettingsPanel.jsx`:

```jsx
<LabeledControl inline label="Theme">
            <Dropdown size="sm" variant="subtle" className="w-full" options={themeOptions} value={theme} onChange={onTheme} />
```

From `kol-client/kol-client-ac/src/editor/color/ColourPanel.jsx`:

```jsx
<LabeledControl inline label={label} hint={hint}>
      <Slider min={0} max={max} value={value} onChange={onChange} />
```
