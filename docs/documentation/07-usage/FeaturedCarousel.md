# FeaturedCarousel

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 2 across 2 files in 1 apps
- **Used in:** kol-website

## Import

```jsx
import { FeaturedCarousel } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-website/apps/web/src/routes/Studio.jsx`:

```jsx
<FeaturedCarousel
            items={featuredItems}
            sectionLabel="Featured"
            showHeader={false}
            fullWidth
            rounded={false}
            autoPlay
            autoPlayInterval={10000}
            height="h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)]"
          >
            <StudioAboutCard />
```

From `kol-website/apps/web/src/routes/foundry/FoundryTypefaces.jsx`:

```jsx
<FeaturedCarousel
          items={featuredTypefaces}
          sectionLabel="Featured Typefaces"
          buttonLabel="Explore Typeface"
          showHeader={false}
          fullWidth
          rounded={false}
          autoPlay
          autoPlayInterval={10000}
        />
```
