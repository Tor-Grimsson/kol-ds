# Carousel

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 20 across 20 files in 11 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix, kol-client-kolkrabbi, kol-docs-noter, kol-editor, kol-mirror, kol-modulator, kol-monitor, kol-website

## Import

```jsx
import { Carousel } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client/src/components/framework/brand/AssetCarousel.jsx`:

```jsx
<Carousel className={`kol-asset-carousel ${className}`.trim()} {...(options ? { options } : {})}>
        {items.map((item, i) => (
          <AssetCard key={item.src ?? i} item={item} category={category} onOpen={() => setCurrent(item)} />
```

From `kol-apps/kol-client-ac/src/components/styleguide/LogoCarousel.jsx`:

```jsx
<Carousel>
      {logos.map((l) => (
        <LogoCard
          key={l.name}
          name={l.name}
          caption={l.caption}
          backdrop={l.backdrop ?? backdrop}
          light={light}
        />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/components/styleguide/AssetCarousel.jsx`:

```jsx
<Carousel className={`ac-asset-carousel ${className}`.trim()} {...(options ? { options } : {})}>
        {items.map((item, i) => (
          <AssetCard key={item.src ?? i} item={item} category={category} onOpen={() => setCurrent(item)} />
```

From `kol-apps/kol-client-canalix/src/components/brand/AssetCarousel.jsx`:

```jsx
<Carousel className={`kol-asset-carousel ${className}`.trim()} {...(options ? { options } : {})}>
        {items.map((item, i) => (
          <AssetCard key={item.src ?? i} item={item} onOpen={() => setCurrent(item)} />
```

From `kol-apps/kol-docs-noter/src/components/ui/carousel.tsx`:

```jsx
<Carousel />
```
