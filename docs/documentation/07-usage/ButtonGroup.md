# ButtonGroup

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 36 across 26 files in 7 apps
- **Weighted inbound:** 86★ across 26 edges — 4×5★ · 22×3★
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-labs-single, kol-mirror, kol-modulator, kol-monitor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 5 | 3 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/molecules/ButtonsPreview.jsx` |
| 5 | 3 | `kol-apps/kol-mirror/src/components/styleguide/preview/molecules/ButtonsPreview.jsx` |
| 5 | 3 | `kol-apps/kol-modulator/src/components/styleguide/preview/molecules/ButtonsPreview.jsx` |
| 5 | 3 | `kol-apps/kol-monitor/a_torg/archive/2026-04-17-src-cleanup/src/components-mirrors/styleguide/preview/molecules/ButtonsPreview.jsx` |
| 3 | 2 | `kol-apps/kol-labs-single/src/components/molecules/ButtonGroup.jsx` |
| 3 | 2 | `kol-apps/kol-labs-single/src/pages/radar/refract/LensShell.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/OverviewHero.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/sections/home/WorkshopFeatures.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/sections/shared/FeaturesCardSection.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/molecules/ButtonsPreview.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/components/framework/EditorFooter.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/effects/EffectsEditor.jsx` |
| … | | _14 more_ |

## Import

```jsx
import { ButtonGroup } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/sections/shared/FeaturesCardSection.jsx`:

```jsx
<ButtonGroup
              buttons={actions}
              align={buttonAlign}
            />
```

From `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/molecules/ButtonsPreview.jsx`:

```jsx
<ButtonGroup
                      buttons={sampleButtonsThree.map(btn => ({
                        ...btn,
                        size: buttonBreakpointConfig[bp.id].size,
                        style: {
                          padding: buttonBreakpointConfig[bp.id].padding,
                          fontSize: buttonBreakpointConfig[bp.id].fontSize
                        }
                      }))}
                      align="center"
                    />
```

From `kol-apps/kol-labs-single/src/components/framework/EditorFooter.jsx`:

```jsx
<ButtonGroup orientation="vertical" className="w-full">
        <Button variant="primary" size="sm" iconLeft="download" onClick={save} className="w-full">Save settings</Button>
        <Button variant="primary" size="sm" iconLeft="upload" onClick={() => fileRef.current?.click()} className="w-full">Load settings</Button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={load} />
```

From `kol-website/_tmp/web-quarantine-elder/TypefaceHero.jsx`:

```jsx
<ButtonGroup
            buttons={[
              { label: 'Download font', variant: 'primary' },
              {
                label: 'View Specimen',
                variant: 'outline',
                href: specimenLink,
                onClick: handleSpecimenClick
              }
            ]}
            align="center"
          />
```

From `kol-apps/kol-mirror/src/components/styleguide/preview/molecules/ButtonsPreview.jsx`:

```jsx
<ButtonGroup buttons={[{ label: "Primary", variant: "primary" }, { label: "Secondary", variant: "outline" }]} align="center" />
```
