# BentoCard

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 14 across 2 files in 2 apps
- **Used in:** kol-client-kolkrabbi, kol-website

## Import

```jsx
import { BentoCard } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/sections/home/HomeHighlights.jsx`:

```jsx
<BentoCard
               useMotion={useMotion}
               className="flex-1 self-stretch rounded flex border border-fg-08 justify-start items-end gap-2 overflow-hidden"
               src="/img/home-highlight/monitor.mp4"
               poster="/img/home-highlight/monitor.png"
               imageClassName="object-cover object-center"
               title={<>Monitor</>
```

From `kol-website/apps/web/src/components/sections/home/HomeHighlights.jsx`:

```jsx
<BentoCard
               useMotion={useMotion}
               className="flex-1 self-stretch rounded flex border border-fg-08 justify-end items-start gap-2 overflow-hidden"
               src={`${hlsBase}/hl-malmromur/hls/master.m3u8`}
               poster={`${hlsBase}/hl-malmromur/hl-malromur-still.jpg`}
               title={<>Málrómur</>
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/sections/home/HomeHighlights.jsx`:

```jsx
<BentoCard
               useMotion={useMotion}
               className="flex-1 self-stretch rounded flex border border-fg-08 justify-start items-end gap-2 overflow-hidden"
               src={`${hlsBase}/hl-radial/hls/master.m3u8`}
               poster={`${hlsBase}/hl-radial/radial-dial-still.png`}
               title={<>Radial Dial</>
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/sections/home/HomeHighlights.jsx`:

```jsx
<BentoCard
                  useMotion={useMotion}
                  className="w-full h-[264px] md:h-[640px] rounded flex border border-fg-08 justify-start items-end gap-2 overflow-hidden"
                  src={`${imgBase}/hl-chess/hl-chess-1200.jpg`}
                  imageClassName="object-cover object-center"
                  title={<>Chess Analysis</>
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/sections/home/HomeHighlights.jsx`:

```jsx
<BentoCard
                     useMotion={useMotion}
                     className="w-full h-full rounded inline-flex border border-fg-08 justify-start items-start gap-2 overflow-hidden"
                     src={`${hlsBase}/hl-trollatunga/hls/master.m3u8`}
                     poster={`${hlsBase}/hl-trollatunga/trollatunga-still-wide.jpg`}
                     title={<>Visuals</>
```
