# Icon

- **Package:** `@kolkrabbi/kol-icons`
- **Category:** flat
- **Real-world usages found:** 1345 across 577 files in 25 apps
- **Weighted inbound:** 1941★ across 577 edges — 74×5★ · 62×4★ · 441×3★
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-aftra, kol-client-canalix, kol-client-hrafn, kol-client-kolkrabbi, kol-divs, kol-docs, kol-docs-md, kol-docs-noter, kol-draw-3d, kol-editor, kol-editor-radar, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-media-admin, kol-mirror, kol-modulator, kol-monitor, kol-radial, kol-svg-distress, kol-video-editor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 5 | 8 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/atoms/ThemeToggleButton.jsx` |
| 5 | 8 | `kol-apps/kol-client-kolkrabbi/_tmp/icons/app.jsx` |
| 5 | 8 | `kol-apps/kol-editor/src/components/atoms/ThemeToggleButton.jsx` |
| 5 | 8 | `kol-apps/kol-labs-monorepo/apps/editor/src/components/atoms/ThemeToggleButton.jsx` |
| 5 | 8 | `kol-apps/kol-monitor/a_torg/archive/jsx/ThemeToggleButton.jsx` |
| 5 | 8 | `kol-apps/kol-radial/src/components/atoms/ThemeToggleButton.jsx` |
| 5 | 8 | `kol-apps/kol-svg-distress/a-ref/kolkrabbi-radial/src/components/atoms/ThemeToggleButton.jsx` |
| 5 | 8 | `kol-apps/kol-svg-distress/src/components/atoms/ThemeToggleButton.jsx` |
| 5 | 8 | `kol-website/_tmp/packages-elder-flush/ui/src/atoms/ThemeToggleButton.jsx` |
| 5 | 6 | `kol-apps/kol-labs-single/src/pages/library/LibraryPage.jsx` |
| 5 | 5 | `kol-apps/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/compose/ComposeTopbar.jsx` |
| 5 | 5 | `kol-apps/kol-editor/src/components/molecules/ToolButton.jsx` |
| … | | _565 more_ |

## Import

```jsx
import { Icon } from '@kolkrabbi/kol-icons'
```

## Real usage

From `kol-apps/kol-client/src/components/atoms/Button.jsx`:

```jsx
<Icon
          name={iconName}
          size={iconSize}
          className="kol-icon-default"
          style={{ position: 'absolute' }}
        />
```

From `kol-apps/kol-client-ac/src/components/atoms/Button.jsx`:

```jsx
<Icon
          name={iconHoverName}
          size={iconSize}
          className="kol-icon-hover"
          style={{ position: 'absolute' }}
        />
```

From `kol-apps/kol-client-acyr-website/apps/website/src/components/atoms/Button.jsx`:

```jsx
<Icon
          name={iconName}
          size={iconSize}
          className="ac-icon-default"
          style={{ position: 'absolute' }}
        />
```

From `kol-apps/kol-client-canalix/src/components/ui/SectionLabel.jsx`:

```jsx
<Icon
          name="arrow-downright"
          size={config.iconSize}
          className="icon-default"
          style={{ position: 'absolute' }}
        />
```

From `kol-apps/kol-client-hrafn/src/components/atoms/Button.jsx`:

```jsx
<Icon
          name={iconName}
          size={resolvedIconSize}
          className="kol-icon-default"
          style={{ position: 'absolute' }}
        />
```
