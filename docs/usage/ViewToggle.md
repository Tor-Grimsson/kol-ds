# ViewToggle

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 106 across 41 files in 12 apps
- **Used in:** kol-client, kol-client-ac, kol-client-canalix, kol-client-kolkrabbi, kol-divs, kol-draw-3d, kol-editor, kol-media-admin, kol-mirror, kol-modulator, kol-monitor, kol-radar

## Import

```jsx
import { ViewToggle } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/generators/type-lab/TypeControls.jsx`:

```jsx
<ViewToggle
              options={CASE_OPTIONS}
              viewMode={frame.case}
              onViewChange={v => update({ case: v })}
            />
```

From `kol-apparat/kol-editors/kol-radar/src-grab/components/styleguide/preview/atoms/TogglesPreview.jsx`:

```jsx
<ViewToggle
            variant="icon"
            viewMode={gridMode}
            onViewChange={setGridMode}
            options={gridOptions}
            className="w-fit"
          />
```

From `kol-apparat/kol-video/kol-mirror/src/components/styleguide/preview/atoms/TogglesPreview.jsx`:

```jsx
<ViewToggle
            variant="icon"
            viewMode={gridModeInverse}
            onViewChange={setGridModeInverse}
            options={gridOptions}
            className="w-fit"
          />
```

From `kol-client/kol-client/src/pages/foundations/TypographySections.jsx`:

```jsx
<ViewToggle
            viewMode={familyId}
            onViewChange={setFamilyId}
            options={Object.values(FAMILIES).map((f) => ({ value: f.id, label: f.label }))}
          />
```

From `kol-client/kol-client-ac/src/editor/compose/AssetsBody.jsx`:

```jsx
<ViewToggle
          variant="icon"
          viewMode={view}
          onViewChange={setView}
          options={VIEW_OPTIONS}
        />
```
