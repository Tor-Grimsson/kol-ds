# ViewToggle

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 184 across 73 files in 15 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix, kol-client-kolkrabbi, kol-divs, kol-draw-3d, kol-editor, kol-editor-radar, kol-labs-monorepo, kol-media-admin, kol-mirror, kol-modulator, kol-monitor, kol-website

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
