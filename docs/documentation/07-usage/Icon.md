# Icon

- **Package:** `@kolkrabbi/kol-icons`
- **Category:** flat
- **Real-world usages found:** 1350 across 576 files in 25 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-aftra, kol-client-canalix, kol-client-hrafn, kol-client-kolkrabbi, kol-divs, kol-docs, kol-docs-md, kol-docs-noter, kol-draw-3d, kol-editor, kol-editor-radar, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-media-admin, kol-mirror, kol-modulator, kol-monitor, kol-radial, kol-svg-distress, kol-video-editor, kol-website

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
