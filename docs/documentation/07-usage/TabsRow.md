# TabsRow

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 29 across 29 files in 7 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-draw-3d, kol-labs-monorepo, kol-labs-single, kol-website

## Import

```jsx
import { TabsRow } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/editor/color/ColorModal.jsx`:

```jsx
<TabsRow active={tab} onChange={setTab} onClose={onClose} onMinimise={onMinimise} />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/shell/panels/LayersAssetsPanel.jsx`:

```jsx
<TabsRow tabs={TABS} active={tab} onChange={setTab} />
```

From `kol-apps/kol-draw-3d/src/components/studio/ControlsPanel.jsx`:

```jsx
<TabsRow tabs={tabs} active={tab} onChange={setTab} />
```

From `kol-apps/kol-labs-monorepo/apps/draw-3d/src/components/studio/InspectorPanel.jsx`:

```jsx
<TabsRow tabs={['Inspector', 'Variables', 'Overlay']} active={tab} onChange={setTab} />
```

From `kol-apps/kol-client-kolkrabbi/src/editor/color/PanelTabs.jsx`:

```jsx
<TabsRow {...props} />
```
