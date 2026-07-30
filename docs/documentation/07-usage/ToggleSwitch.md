# ToggleSwitch

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 138 across 67 files in 11 apps
- **Weighted inbound:** 214★ across 67 edges — 13×4★ · 54×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-editor-radar, kol-labs-monorepo, kol-labs-single, kol-mirror, kol-modulator, kol-monitor, kol-video-editor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 7 | `kol-apps/kol-labs-single/src/pages/gradient/primitive/PrimitiveScenePage.jsx` |
| 4 | 6 | `kol-apps/kol-labs-single/src/pages/math/parametric/ParametricEditor.jsx` |
| 4 | 6 | `kol-apps/kol-labs-single/src/pages/radar/refract/LensShell.jsx` |
| 4 | 5 | `kol-apps/kol-labs-single/src/pages/penrose/PenrosePage.jsx` |
| 4 | 4 | `kol-apps/kol-client-kolkrabbi/src/pages/Components.jsx` |
| 4 | 4 | `kol-apps/kol-labs-single/src/pages/math/fields/FieldsEditor.jsx` |
| 4 | 4 | `kol-apps/kol-labs-single/src/pages/math/uzumaki/components/ClipForm.jsx` |
| 4 | 4 | `kol-website/apps/brand/src/pages/Components.jsx` |
| 4 | 3 | `kol-apps/kol-labs-single/src/pages/Home.jsx` |
| 4 | 3 | `kol-apps/kol-labs-single/src/pages/gradient/ribbon/RibbonPage.jsx` |
| 4 | 3 | `kol-apps/kol-labs-single/src/pages/kinetic/EditControls.jsx` |
| 4 | 3 | `kol-apps/kol-labs-single/src/pages/live/LiveEditor.jsx` |
| … | | _55 more_ |

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
