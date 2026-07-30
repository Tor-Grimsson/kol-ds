# TabsRow

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 30 across 30 files in 7 apps
- **Weighted inbound:** 90★ across 30 edges — 30×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-draw-3d, kol-labs-monorepo, kol-labs-single, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/color/ColorModal.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/color/PanelTabs.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/shell/panels/LayersAssetsPanel.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/shell/panels/SelectionPalettePanel.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/color/ColorModal.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/color/PanelTabs.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/shell/panels/LayersAssetsPanel.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/shell/panels/SelectionPalettePanel.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/editor/color/ColorModal.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/editor/color/PanelTabs.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/editor/shell/panels/LayersAssetsPanel.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/editor/shell/panels/SelectionPalettePanel.jsx` |
| … | | _18 more_ |

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

From `kol-website/apps/web/src/routes/prints/PrintDetailOverlay.jsx`:

```jsx
<TabsRow tabs={tabs} value={activeTab} onChange={setActiveTab} />
```
