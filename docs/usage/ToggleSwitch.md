# ToggleSwitch

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 122 across 58 files in 7 apps
- **Used in:** kol-client-ac, kol-client-kolkrabbi, kol-labs-single, kol-mirror, kol-modulator, kol-monitor, kol-radar

## Import

```jsx
import { ToggleSwitch } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-radar/src-grab/components/styleguide/preview/atoms/TogglesPreview.jsx`:

```jsx
<ToggleSwitch
            label="Dark mode"
            checked={switchState}
            onChange={setSwitchState}
          />
```

From `kol-apparat/kol-labs-single/src/pages/Home.jsx`:

```jsx
<ToggleSwitch
              variant="plain"
              checked={!!autoplay}
              onChange={(v) => setAppSetting('autoplay', v)}
            />
```

From `kol-client/kol-client-ac/src/components/styleguide/LogoCard.jsx`:

```jsx
<ToggleSwitch
            variant="plain"
            label="Clearspace"
            checked={showFramework}
            onToggle={setShowFramework}
          />
```

From `kol-client/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/atoms/TogglesPreview.jsx`:

```jsx
<ToggleSwitch label="Dark mode" checked={switchState} onChange={setSwitchState} />
```

From `kol-apparat/kol-video/kol-mirror/src/components/styleguide/Components.jsx`:

```jsx
<ToggleSwitch label="Off" />
```
