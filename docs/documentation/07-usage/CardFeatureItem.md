# CardFeatureItem

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 10 across 10 files in 6 apps
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-mirror, kol-modulator, kol-monitor, kol-website

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

From `kol-website/apps/web/src/components/sections/shared/FeaturesCardSection.jsx`:

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
