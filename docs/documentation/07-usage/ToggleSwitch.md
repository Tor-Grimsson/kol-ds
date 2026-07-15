# ToggleSwitch

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 136 across 66 files in 11 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-editor-radar, kol-labs-monorepo, kol-labs-single, kol-mirror, kol-modulator, kol-monitor, kol-video-editor, kol-website

## Import

```jsx
import { ToggleSwitch } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/components/styleguide/LogoCard.jsx`:

```jsx
<ToggleSwitch
            variant="plain"
            label="Clearspace"
            checked={showFramework}
            onToggle={setShowFramework}
          />
```

From `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/atoms/TogglesPreview.jsx`:

```jsx
<ToggleSwitch
            label="Dark mode"
            checked={switchState}
            onChange={setSwitchState}
          />
```

From `kol-apps/kol-labs-single/src/pages/Home.jsx`:

```jsx
<ToggleSwitch
              variant="plain"
              checked={!!autoplay}
              onChange={(v) => setAppSetting('autoplay', v)}
            />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/atoms/TogglesPreview.jsx`:

```jsx
<ToggleSwitch label="Dark mode" checked={switchState} onChange={setSwitchState} />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/workshop/WorkshopSidebarContent.jsx`:

```jsx
<ToggleSwitch label="Expand all" checked={allExpanded} onChange={onToggleAll} style={{ border: 'none', padding: 0 }} />
```
