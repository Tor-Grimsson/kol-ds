# ViewToggle

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 185 across 74 files in 15 apps
- **Weighted inbound:** 257★ across 74 edges — 3×5★ · 29×4★ · 42×3★
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix, kol-client-kolkrabbi, kol-divs, kol-draw-3d, kol-editor, kol-editor-radar, kol-labs-monorepo, kol-media-admin, kol-mirror, kol-modulator, kol-monitor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 5 | 4 | `kol-apps/kol-client-canalix/src/pages/branded-house/LockupControls.jsx` |
| 5 | 3 | `kol-apps/kol-client/src/pages/foundations/ComboLab.jsx` |
| 5 | 3 | `kol-apps/kol-client-canalix/src/pages/foundations/ComboLab.jsx` |
| 4 | 6 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/atoms/TogglesPreview.jsx` |
| 4 | 6 | `kol-apps/kol-mirror/src/components/styleguide/preview/atoms/TogglesPreview.jsx` |
| 4 | 6 | `kol-apps/kol-modulator/src/components/styleguide/preview/atoms/TogglesPreview.jsx` |
| 4 | 6 | `kol-apps/kol-monitor/a_torg/archive/2026-04-17-src-cleanup/src/components-mirrors/styleguide/preview/atoms/TogglesPreview.jsx` |
| 4 | 5 | `kol-apps/kol-client-ac/src/editor/compose/inspectors/LayerInspector.jsx` |
| 4 | 5 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/compose/inspectors/LayerInspector.jsx` |
| 4 | 5 | `kol-apps/kol-client-kolkrabbi/src/editor/compose/inspectors/LayerInspector.jsx` |
| 4 | 5 | `kol-apps/kol-divs/src/pages/Flex.jsx` |
| 4 | 5 | `kol-apps/kol-divs/src/pages/Grid.jsx` |
| … | | _62 more_ |

## Import

```jsx
import { ViewToggle } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client/src/pages/foundations/TypographySections.jsx`:

```jsx
<ViewToggle
            viewMode={familyId}
            onViewChange={setFamilyId}
            options={Object.values(FAMILIES).map((f) => ({ value: f.id, label: f.label }))}
          />
```

From `kol-apps/kol-client-ac/src/editor/compose/AssetsBody.jsx`:

```jsx
<ViewToggle
          variant="icon"
          viewMode={view}
          onViewChange={setView}
          options={VIEW_OPTIONS}
        />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/compose/inspectors/LayerInspector.jsx`:

```jsx
<ViewToggle
            options={SHAPE_FIT_OPTIONS}
            viewMode={layer.fit ?? 'fill'}
            onViewChange={(v) => setProp('fit', v)}
          />
```

From `kol-apps/kol-client-canalix/src/pages/branded-house/LockupControls.jsx`:

```jsx
<ViewToggle
          viewMode={parent}
          onViewChange={(v) => onChange({ parent: v })}
          options={toOptions(PARENTS)}
        />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/organisms/filters/ContentFilters.jsx`:

```jsx
<ViewToggle
              viewMode={viewMode}
              onViewChange={handleViewModeChange}
              options={viewModeOptions}
            />
```
