# FeaturesCardSection

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 8 across 8 files in 1 apps
- **Used in:** kol-website

## Import

```jsx
import { FeaturesCardSection } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-website/apps/web/src/routes/Studio.jsx`:

```jsx
<FeaturesCardSection
            headerLabel="Services"
            headerDescription="Type design, visual identity, and design systems for brands."
            actions={[{ label: 'View Work', variant: 'primary', href: '/work' }]}
            headerClassName="w-full pt-16"
            headerTextWidthClass="w-full md:w-[40%]"
            buttonGroupClassName="pt-10 pb-16"
            showActions={false}
            sectionClassName="pb-16"
          />
```

From `kol-website/apps/web/src/routes/collections/CollectionsOverview.jsx`:

```jsx
<FeaturesCardSection
        sectionClassName="w-full py-16"
        wrapperClassName="max-w-[1400px] mx-auto flex flex-col gap-8"
        headerClassName="w-full"
        headerTextWidthClass="w-full md:w-[50%]"
        headerLabel="Explore Collections"
        headerDescription="Jump into each collection"
        cardsWrapperClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        features={quickLinkFeatures}
        showActions={false}
      />
```

From `kol-website/apps/web/src/routes/foundry/components/InDevelopmentSection.jsx`:

```jsx
<FeaturesCardSection
      features={features}
      showHeader={true}
      headerLabel={title}
      headerDescription={description}
      showActions={false}
      sectionClassName="py-16"
      headerClassName="w-full mb-12"
      headerTextWidthClass="w-full"
      cardsWrapperClassName="self-stretch inline-flex flex-col md:flex-row md:h-72 justify-start items-center gap-6"
    />
```

From `kol-website/apps/web/src/routes/collections/Grids.jsx`:

```jsx
<FeaturesCardSection
                  showHeader={true}
                  headerClassName="w-full"
                  headerTextWidthClass="w-full md:w-[50%]"
                  headerLabel="Explore Collections"
                  headerDescription="Jump into each collection"
                  cardsWrapperClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  features={quickLinkFeatures}
                  showActions={false}
                  sectionClassName="w-full"
                  wrapperClassName="w-full flex flex-col gap-8"
                />
```

From `kol-website/apps/web/src/routes/collections/Illustrations.jsx`:

```jsx
<FeaturesCardSection
                showHeader={true}
                headerClassName="w-full"
                headerTextWidthClass="w-full md:w-[50%]"
                headerLabel="Explore Collections"
                headerDescription="Jump into each collection"
                cardsWrapperClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                features={quickLinkFeatures}
                showActions={false}
                sectionClassName="w-full"
                wrapperClassName="w-full flex flex-col gap-8"
              />
```
