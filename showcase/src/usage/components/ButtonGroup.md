# ButtonGroup

- **Package:** `@kolkrabbi/kol-component`
- **Category:** utilities
- **Real-world usages found:** 30 across 24 files in 5 apps
- **Weighted inbound:** 76★ across 24 edges — 2×5★ · 22×3★
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-labs-single, kol-modulator, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 5 | 3 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/molecules/ButtonsPreview.jsx` |
| 5 | 3 | `kol-apps/kol-modulator/src/components/styleguide/preview/molecules/ButtonsPreview.jsx` |
| 3 | 2 | `kol-apps/kol-labs-single/src/components/molecules/ButtonGroup.jsx` |
| 3 | 2 | `kol-apps/kol-labs-single/src/pages/radar/refract/LensShell.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/OverviewHero.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/sections/home/WorkshopFeatures.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/sections/shared/FeaturesCardSection.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/molecules/ButtonsPreview.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/components/framework/EditorFooter.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/effects/EffectsEditor.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/interfaces/InterfacesPage.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/kinetic/KineticPage.jsx` |
| … | | _12 more_ |

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

From `kol-website/_tmp/2026-08-12-chrome-fork-retirement/FeaturesCardSection-local-fork.jsx`:

```jsx
<ButtonGroup align={buttonAlign}>
              {actions.map((a, i) => (
                <Button key={i} variant={a.variant} href={a.href} onClick={a.onClick} className={a.className}>
                  {a.label}
                </Button>
              ))}
            </ButtonGroup>
```

From `kol-apps/kol-modulator/src/components/styleguide/preview/molecules/ButtonsPreview.jsx`:

```jsx
<ButtonGroup buttons={[{ label: "Primary", variant: "primary" }, { label: "Secondary", variant: "outline" }]} align="center" />
```
