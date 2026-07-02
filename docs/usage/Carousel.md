# Carousel

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 15 across 15 files in 9 apps
- **Used in:** kol-client, kol-client-ac, kol-client-canalix, kol-client-kolkrabbi, kol-editor, kol-mirror, kol-modulator, kol-monitor, kol-noter

## Import

```jsx
import { Carousel } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-editor/_a-torg/_kol-packages-reference/kol-framework/src/brand/AssetCarousel.jsx`:

```jsx
<Carousel className={`kol-asset-carousel ${className}`.trim()} {...(options ? { options } : {})}>
        {items.map((item, i) => (
          <AssetCard key={item.src ?? i} item={item} category={category} onOpen={() => setCurrent(item)} />
```

From `kol-client/kol-client/src/components/framework/sections/LogoCarousel.jsx`:

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

From `kol-client/kol-client-canalix/src/components/brand/AssetCarousel.jsx`:

```jsx
<Carousel className={`kol-asset-carousel ${className}`.trim()} {...(options ? { options } : {})}>
        {items.map((item, i) => (
          <AssetCard key={item.src ?? i} item={item} onOpen={() => setCurrent(item)} />
```

From `kol-client/kol-client-ac/src/pages/site/About.jsx`:

```jsx
<Carousel
          className="[&_.kol-embla-container]:!gap-0 [&_.kol-embla-slide]:!w-[clamp(200px,70vw,300px)] [&_.kol-embla-slide]:!h-[clamp(280px,90vw,400px)]"
          options={{ align: 'start', loop: false, dragFree: true, containScroll: 'trimSnaps' }}
        >
          {STORY_GALLERY.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              className="block w-full h-full object-cover"
              loading="lazy"
            />
```

From `kol-apparat/kol-docs/kol-noter/src/components/ui/carousel.tsx`:

```jsx
<Carousel />
```
