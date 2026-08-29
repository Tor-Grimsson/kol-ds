# RotaryDial

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 68 across 17 files in 4 apps
- **Weighted inbound:** 59★ across 17 edges — 8×4★ · 9×3★
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 12 | `kol-apps/kol-editor-radar/src-grab/components/hall-of-mirrors/RoutingMatrix.jsx` |
| 4 | 12 | `kol-apps/kol-labs-monorepo/apps/mirror/src/components/hall-of-mirrors/RoutingMatrix.jsx` |
| 4 | 8 | `kol-apps/kol-editor-radar/src-grab/components/hall-of-mirrors/generators/VisualGeneratorModule.jsx` |
| 4 | 6 | `kol-apps/kol-editor-radar/src-grab/components/hall-of-mirrors/SymphonyMixer.jsx` |
| 4 | 6 | `kol-apps/kol-labs-monorepo/apps/mirror/src/components/hall-of-mirrors/SymphonyMixer.jsx` |
| 4 | 4 | `kol-apps/kol-editor-radar/src-grab/components/hall-of-mirrors/generators/EnvelopeModule.jsx` |
| 4 | 4 | `kol-apps/kol-editor-radar/src-grab/components/hall-of-mirrors/generators/RandomSHModule.jsx` |
| 4 | 3 | `kol-apps/kol-editor-radar/src-grab/components/hall-of-mirrors/generators/LFOModule.jsx` |
| 3 | 2 | `kol-apps/kol-editor-radar/src-grab/components/hall-of-mirrors/MasterModule.jsx` |
| 3 | 2 | `kol-apps/kol-editor-radar/src-grab/components/hall-of-mirrors/generators/LogicGateModule.jsx` |
| 3 | 2 | `kol-apps/kol-editor-radar/src-grab/components/hall-of-mirrors/generators/MultiplesModule.jsx` |
| 3 | 2 | `kol-apps/kol-labs-monorepo/apps/mirror/src/components/hall-of-mirrors/MasterModule.jsx` |
| … | | _5 more_ |

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

From `kol-apps/kol-editor-radar/src-grab/components/hall-of-mirrors/generators/MultiplesModule.jsx`:

```jsx
<RotaryDial
                label="Offset"
                value={Math.round((out.offset + 100) / 200 * 100)}
                onChange={(v) => updateOutput(i, 'offset', Math.round(v / 100 * 200 - 100))}
                size={36}
                defaultValue={50}
              />
```

From `kol-apps/kol-editor-radar/src-grab/components/hall-of-mirrors/generators/SequencerModule.jsx`:

```jsx
<RotaryDial
            label="Rate"
            value={Math.round(rate / 20 * 100)}
            onChange={(v) => update('rate', Math.round(v / 100 * 20 * 10) / 10)}
            size={36}
            defaultValue={10}
          />
```
