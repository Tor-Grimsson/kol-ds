# CardFeatureItem

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 7 across 7 files in 4 apps
- **Weighted inbound:** 21★ across 7 edges — 7×3★
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-modulator, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/sections/home/WorkshopFeatures.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/sections/shared/FeaturesCardSection.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/organisms/CardFeatures.jsx` |
| 3 | 1 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/organisms/CardFeatures.jsx` |
| 3 | 1 | `kol-apps/kol-modulator/src/components/styleguide/preview/organisms/CardFeatures.jsx` |
| 3 | 1 | `kol-website/_tmp/2026-08-12-chrome-fork-retirement/FeaturesCardSection-local-fork.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/components/workshop/organisms/CardFeatures.jsx` |

## Import

```jsx
import { CardFeatureItem } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/sections/home/WorkshopFeatures.jsx`:

```jsx
<CardFeatureItem
                     title={feature.title}
                     icon={feature.icon}
                     visual={feature.visual}
                     description={feature.description}
                     href={feature.href}
                     imagePosition="top"
                   />
```

From `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/organisms/CardFeatures.jsx`:

```jsx
<CardFeatureItem
              key={index}
              title={feature.title}
              icon={feature.icon}
              visual={feature.visual}
              description={feature.description}
            />
```

From `kol-website/_tmp/2026-08-12-chrome-fork-retirement/FeaturesCardSection-local-fork.jsx`:

```jsx
<CardFeatureItem
                title={feature.title}
                icon={feature.icon}
                visual={feature.visual}
                description={feature.description}
                href={feature.href}
                backgroundColor={feature.backgroundColor}
                imageAspectRatio={feature.imageAspectRatio}
              />
```
