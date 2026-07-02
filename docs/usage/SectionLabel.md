# SectionLabel

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 30 across 17 files in 6 apps
- **Used in:** kol-client-kolkrabbi, kol-mirror, kol-modulator, kol-monitor, kol-radar, kol-years

## Import

```jsx
import { SectionLabel } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-docs/kol-years/src/App.jsx`:

```jsx
<SectionLabel>{col.name || "Work"}</SectionLabel>
                <ImageGrid images={col.images} onOpen={setLightboxImage} />
```

From `kol-apparat/kol-editors/kol-radar/src-grab/components/styleguide/preview/molecules/SectionLabelPreview.jsx`:

```jsx
<SectionLabel text="Featured Work" size="md" />
```

From `kol-apparat/kol-video/kol-mirror/src/components/styleguide/preview/molecules/SectionLabelPreview.jsx`:

```jsx
<SectionLabel text="Featured Work" size={size} />
```

From `kol-apparat/kol-video/kol-modulator/src/components/styleguide/preview/organisms/CardFeatures.jsx`:

```jsx
<SectionLabel text={title} />
```

From `kol-apparat/kol-video/kol-monitor/a_torg/archive/2026-04-17-src-cleanup/src/components-mirrors/styleguide/preview/molecules/ComponentPreview.jsx`:

```jsx
<SectionLabel {...props} />
```
