# Icon

- **Package:** `@kolkrabbi/kol-icons`
- **Category:** loaders
- **Real-world usages found:** 1003 across 438 files in 21 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-aftra, kol-client-canalix, kol-client-hrafn, kol-client-kolkrabbi, kol-distress, kol-divs, kol-docs, kol-draw-3d, kol-editor, kol-labs-single, kol-lightroom, kol-media-admin, kol-mirror, kol-modulator, kol-monitor, kol-noter, kol-radar, kol-radial

## Import

```jsx
import { Icon } from '@kolkrabbi/kol-icons'
```

## Real usage

From `kol-apparat/kol-docs/kol-divs/src/components/atoms/Button.jsx`:

```jsx
<Icon
          name={iconName}
          size={iconSize}
          className="kol-icon-default"
          style={{ position: 'absolute' }}
        />
```

From `kol-apparat/kol-editors/kol-draw-3d/src/components/atoms/Button.jsx`:

```jsx
<Icon
          name={iconHoverName}
          size={iconSize}
          className="kol-icon-hover"
          style={{ position: 'absolute' }}
        />
```

From `kol-apparat/kol-editors/kol-editor/_a-torg/_kol-packages-reference/kol-component/src/molecules/SectionLabel.jsx`:

```jsx
<Icon
          name="arrow-downright"
          size={config.iconSize}
          className="icon-default"
          style={{ position: 'absolute' }}
        />
```

From `kol-apparat/kol-editors/kol-radar/src/components/molecules/SectionLabel.jsx`:

```jsx
<Icon
          name="arrow-downright"
          size={config.iconSize}
          className="icon-hover"
          style={{ position: 'absolute' }}
        />
```

From `kol-apparat/kol-docs/kol-docs/src/components/WikiSidebar.jsx`:

```jsx
<Icon name={node.icon || ICON_MAP.default} size={16} />
```
