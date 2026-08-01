# FeaturedCarousel

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 2 across 2 files in 1 apps
- **Weighted inbound:** 6★ across 2 edges — 2×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/web/src/routes/Studio.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/foundry/FoundryTypefaces.jsx` |

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
