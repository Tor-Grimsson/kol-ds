# SectionLabel

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 30 across 17 files in 5 apps
- **Weighted inbound:** 58★ across 17 edges — 3×5★ · 1×4★ · 13×3★
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-modulator, kol-website, kol-years

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 5 | 4 | `kol-apps/kol-years/src/App.jsx` |
| 5 | 3 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/molecules/SectionLabelPreview.jsx` |
| 5 | 3 | `kol-apps/kol-modulator/src/components/styleguide/preview/molecules/SectionLabelPreview.jsx` |
| 4 | 4 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/Animations.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/molecules/SectionLabelPreview.jsx` |
| 3 | 2 | `kol-apps/kol-years/timeline-app.jsx` |
| 3 | 2 | `kol-website/_tmp/workshop-museum-elder/components/workshop/molecules/SectionLabelPreview.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/molecules/ComponentPreview.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/organisms/CardFeatures.jsx` |
| 3 | 1 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/molecules/ComponentPreview.jsx` |
| 3 | 1 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/organisms/CardFeatures.jsx` |
| 3 | 1 | `kol-apps/kol-modulator/src/components/styleguide/preview/molecules/ComponentPreview.jsx` |
| … | | _5 more_ |

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

From `kol-website/_tmp/2026-08-15-anatomy-adoption/FoundryFeatureSection.jsx`:

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

From `kol-apps/kol-modulator/src/components/styleguide/preview/organisms/CardFeatures.jsx`:

```jsx
<SectionLabel text={title} />
```
