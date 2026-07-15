# HlsVideo

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 8 across 8 files in 2 apps
- **Used in:** kol-client-kolkrabbi, kol-website

## Import

```jsx
import { HlsVideo } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/cards/BentoCard.jsx`:

```jsx
<HlsVideo
          src={src}
          poster={poster}
          className={`absolute left-0 top-0 size-full rounded overflow-hidden ${imageClassName} ${isTouchDevice ? 'pointer-events-none' : ''}`}
        />
```

From `kol-website/apps/web/src/components/sections/home/HomeHero.jsx`:

```jsx
<HlsVideo
          src={videoSrc}
          poster={posterSrc}
          className={`absolute left-0 top-0 size-full object-cover object-center ${isTouchDevice ? 'pointer-events-none' : ''}`}
          onCanPlay={handleVideoLoad}
        />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/sections/shared/FeaturedCarousel.jsx`:

```jsx
<HlsVideo
            src={item.video}
            poster={item.image}
            className="absolute left-0 top-0 size-full object-cover object-center"
            onEnded={autoPlay && items.length > 1 ? advanceSlide : undefined}
          />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/sections/studio/StudioHero.jsx`:

```jsx
<HlsVideo
        src={`${cdnBase}/hls-library/video-library/studio/hls/master.m3u8`}
        poster={`${cdnBase}/asset-library/studio/studio-video-still/video-still-1200.jpg`}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
```
