# RotaryDial

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 213 across 57 files in 6 apps
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-labs-monorepo, kol-mirror, kol-monitor, kol-website

## Import

```jsx
import { RotaryDial } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/molecules/SymphonyMixer.jsx`:

```jsx
<RotaryDial
          label=""
          value={value}
          onChange={onChange}
        />
```

From `kol-apps/kol-editor-radar/src-grab/components/hall-of-mirrors/generators/MultiplesModule.jsx`:

```jsx
<RotaryDial
                label="Scale"
                value={Math.round((out.scale + 2) / 4 * 100)}
                onChange={(v) => updateOutput(i, 'scale', Math.round((v / 100 * 4 - 2) * 100) / 100)}
                size={36}
                defaultValue={75}
              />
```

From `kol-apps/kol-labs-monorepo/apps/mirror/src/components/mixer/ChannelMaster.jsx`:

```jsx
<RotaryDial
            key={knob.label || i}
            label={knob.label}
            value={knob.value}
            onChange={knob.onChange}
            size={22}
            compact
            variant="dense"
          />
```

From `kol-apps/kol-monitor/a_torg/archive/2026-04-17-src-cleanup/src/components-mirrors/hall-of-mirrors/generators/ClockModule.jsx`:

```jsx
<RotaryDial
          label="BPM"
          value={Math.round((bpm - 20) / 280 * 100)}
          onChange={(v) => update('bpm', Math.round(v / 100 * 280 + 20))}
          size={48} defaultValue={36} busRef={busRef}
        />
```

From `kol-apps/kol-mirror/src/components/hall-of-mirrors/MasterModule.jsx`:

```jsx
<RotaryDial label={SEND_LABELS[key]} value={sends[key] || 0} onChange={(v) => onChannelUpdate(ci, { sends: { ...sends, [key]: v } })} size={22} compact variant="dense" />
```
