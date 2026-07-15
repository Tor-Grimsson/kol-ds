# SectionLabel

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 40 across 23 files in 7 apps
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-mirror, kol-modulator, kol-monitor, kol-website, kol-years

## Import

```jsx
import { SectionLabel } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-years/src/App.jsx`:

```jsx
<SectionLabel>{col.name || "Work"}</SectionLabel>
                <ImageGrid images={col.images} onOpen={setLightboxImage} />
```

From `kol-website/apps/web/src/routes/foundry/components/FoundryFeatureSection.jsx`:

```jsx
<SectionLabel className="inline-flex w-auto whitespace-nowrap" text={label} size={labelSize} />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/molecules/SectionLabelPreview.jsx`:

```jsx
<SectionLabel text="Featured Work" size="md" />
```

From `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/molecules/SectionLabelPreview.jsx`:

```jsx
<SectionLabel text="Featured Work" size={size} />
```

From `kol-apps/kol-mirror/src/components/styleguide/preview/organisms/CardFeatures.jsx`:

```jsx
<SectionLabel text={title} />
```
