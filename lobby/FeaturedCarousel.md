---
component: FeaturedCarousel
source: kol-monorepo/apps/web/src/components/sections/shared/FeaturedCarousel.jsx#L27-L228
date: 2026-07-03
status: draft
deps: [FeaturedItemsCarousel, HlsVideo, OverlayGlassPanel, CarouselNavigation, Button]
---

# FeaturedCarousel

# ⚠ Reconciliation headline
**Do NOT stage a second carousel. This is a feature-superset of the in-DS `@kol/ui` `FeaturedItemsCarousel` (organisms/FeaturedItemsCarousel.jsx).** The convergence job: fold FeaturedCarousel's three unique capabilities — **(1) HLS-video slides, (2) the `OverlayGlassPanel` glass overlay, (3) video-driven autoplay (advance on `ended`, not a fixed timer)** — INTO `FeaturedItemsCarousel`. The two already share the exact same header/counter/nav chrome and the same framer-motion slide machinery; they diverged into two files. One carousel, one convergence.

## Purpose
A full-width media carousel of featured typefaces/specimens: each slide is a fixed-height frame with an HLS-video or image background and a centered `OverlayGlassPanel` card (title in the typeface's own font, subtitle, description, CTA). Header shows a section label + `n / total` counter + prev/next nav; slides cross-fade/slide via framer-motion; autoplay advances image slides on a timer and video slides on their `ended` event. A `children` slot renders a static overlay pinned over the whole track (does not slide with the media).

## Anatomy
- `<section className="w-full{ py-16 unless fullWidth}">`
  - hidden `<img>` **preload** block for all slide images
  - `<div className="{max-w-[1400px] mx-auto unless fullWidth}">`
    - **header** (when `showHeader`) `flex items-center justify-between mb-8`:
      - `<span className="kol-label-mono-xs text-auto">{sectionLabel}</span>` + `<span className="kol-mono-xs text-fg-64">{currentSlide+1} / {items.length}</span>`
      - `<CarouselNavigation onPrevious onNext iconSize={16}>`
    - **track** `relative overflow-hidden`:
      - `<AnimatePresence mode="wait" custom={direction}>` → `<motion.div>` (slideVariants: enter x±60/opacity0 → center → exit; `transition duration 0.4, ease [0.25,0.1,0.25,1]`)
        - **slide frame** `relative w-full {height} overflow-hidden bg-surface-secondary{ rounded border border-fg-08 if rounded}`:
          - `HlsVideo` (if `item.video`) `absolute left-0 top-0 size-full object-cover object-center`, `onEnded`→advance when autoplay
          - else `<img>` (if `item.image`) same positioning
          - **content overlay** `relative z-10 flex items-center justify-center w-full h-full p-6`:
            - **glass card** (= `OverlayGlassPanel`) `flex flex-col items-center text-center gap-6 px-6 py-8 rounded-[2px]` + `color-mix … 80%` / `blur(1px)`:
              - title `<span>` in `item.fontFamily` at font-specific size ramp (see Variants), `block text-auto leading-none`
              - subtitle `kol-mono-xs text-fg-64`
              - description `kol-mono-xs text-auto max-w-[600px]`
              - CTA `<Link to={item.href}><Button variant="primary" size="sm">{buttonLabel}</Button></Link>`
      - **static `children` overlay** (if `children`) `absolute inset-0 z-20 pointer-events-none overflow-hidden` → inner `h-full flex items-start justify-center pt-[280px]` → `pointer-events-auto w-full`

## Variants
- **Media per slide:** `item.video` → `HlsVideo` (advances on `ended`); else `item.image` → `<img>` (advances on timer). Fallback bg `bg-surface-secondary`.
- **Title size ramp (app-specific):** `displayName === 'Málrómur' || 'Tröllatunga'` → `text-[48px] sm:text-[64px] md:text-[88px] lg:text-[120px]`, else `text-[56px] sm:text-[80px] md:text-[110px] lg:text-[144px]`. Overridable via `renderTitle` / `titleClassName`.
- **Visibility flags:** `showTitle`/`showDescription`/`showButton` — global with per-item override (`item.showTitle ?? showTitle`).
- **Chrome flags:** `showHeader`, `fullWidth` (drops `py-16` + `max-w-[1400px]`), `rounded` (slide frame border/radius).
- **Empty:** `if (items.length === 0) return null`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| items | array | `[]` | Slides: `{ title/displayText, subtitle, subtitleSecondary, description, image, video, href, fontFamily, fontStyle, displayName, buttonLabel, titleClassName, descriptionClassName, showTitle, showDescription, showButton }` |
| sectionLabel | string | `'Featured'` | Header label |
| buttonLabel | string | `'Explore Typeface'` | Default CTA label |
| height | string | `'h-[440px] md:h-[640px]'` | Slide frame height |
| renderTitle | function | — | Custom title renderer `(item) => ReactNode` |
| showTitle / showDescription / showButton | boolean | `true` | Global element visibility |
| showHeader | boolean | `true` | Show label/counter/nav bar |
| fullWidth | boolean | `false` | Drop max-width + `py-16` |
| rounded | boolean | `true` | Slide frame border + radius |
| autoPlay | boolean | `false` | Enable auto-advance |
| autoPlayInterval | number | `5000` | Timer interval (image slides only) |
| titleClassName / descriptionClassName | string | `''` | Default per-element class |
| children | ReactNode | — | Static overlay pinned over the track (`pt-[280px]`) |

## States & interactions
- **`currentSlide` / `direction`** state drive the framer-motion enter/exit (x±60, opacity, 0.4s custom-ease).
- **Nav:** `CarouselNavigation` prev/next → wrap modulo `items.length`, set direction.
- **Autoplay:** `setInterval(advanceSlide, autoPlayInterval)` **only** for image slides and `items.length > 1`; when the current slide has a video, the timer is skipped and the slide advances on the video's `onEnded` instead. Effect re-subscribes on `currentSlide`/`currentHasVideo`.
- **Preload:** hidden `<img>` block eager-loads all slide images on mount.
- **Static `children` overlay:** `pointer-events-none` wrapper with a `pointer-events-auto` inner, pinned `pt-[280px]` from top — deliberately does NOT ride the slide animation.

## Styling
- Tailwind + KOL tokens: `bg-surface-secondary`, `border-fg-08`, type `kol-label-mono-xs` / `kol-mono-xs` / `text-fg-64` / `text-auto`; glass card = `OverlayGlassPanel` values.
- **App-specific bits to DROP:**
  - **Foundry/typeface coupling:** the `'Málrómur'/'Tröllatunga'` name check driving the title size ramp, and per-typeface `fontFamily`/`fontStyle` inline styling → generic `renderTitle`/`titleClassName` seam (no hardcoded specimen names). Default CTA copy `'Explore Typeface'` → neutral.
  - **Router `Link`** around the CTA → DS `Button href`.
  - **`item.video`/`item.image` shape** is fine, but the video path assumes HLS `.m3u8` → keep via `HlsVideo`.
  - The magic `pt-[280px]` on the static `children` overlay is a call-site layout constant → expose as a prop or drop with the `children` seam.
- **Reconcile, don't restyle:** the header (`kol-label-mono-xs` + `n / total` + `CarouselNavigation iconSize={16}`) is **byte-identical** to `FeaturedItemsCarousel`'s header — do not re-implement it, it's the same chrome.

## Dependencies
- **`FeaturedItemsCarousel`** (DS, `@kol/ui` organisms) — **the convergence target.** Already owns: items array, framer-motion `AnimatePresence` slide machine, the identical header/counter/`CarouselNavigation` bar, autoRotate timer, `renderContent(item)` slot, multiple card layouts. Missing vs FeaturedCarousel: HLS video, glass overlay, and video-`ended` autoplay.
- **`HlsVideo`** (staged) — video slide background; brings the `onEnded` hook that video-driven autoplay needs.
- **`OverlayGlassPanel`** (staged) — the per-slide glass card.
- **`CarouselNavigation`** (DS, `@kol/ui` molecules) — prev/next; already used by both carousels.
- **`Button`** (DS) — slide CTA.

## Recreation notes
- **Headline (repeat): converge into `FeaturedItemsCarousel`, do not build a rival carousel.** The DS already has the carousel organism; FeaturedCarousel is the same thing plus HLS/glass/video-autoplay. Port those three features onto `FeaturedItemsCarousel`:
  1. **HLS video slides** — in the media/`renderContent` layer, accept `item.video` and render `HlsVideo`; keep image as fallback. `FeaturedItemsCarousel`'s `videoFill` layout already renders a raw `<video>` — upgrade that path to `HlsVideo`.
  2. **Glass overlay** — offer an overlay/`textOverlay`-style variant whose content box is `OverlayGlassPanel` (centered card over media), matching FeaturedCarousel's slide.
  3. **Video-driven autoplay** — when the active slide is a video, suppress the fixed `interval` and advance on `HlsVideo` `onEnded` (FeaturedCarousel's exact rule: timer for images, `ended` for video).
- Also fold in the `showTitle/showDescription/showButton` per-item-override visibility flags and the static-`children`-over-track slot if the DS wants them; both are cheap additions to the existing renderer.
- Tier: **organism** (media carousel) — but the deliverable is a **diff to an existing organism**, not a new file.
- Drop the foundry specimen coupling (name-based size ramp, per-typeface fonts, `'Explore Typeface'` default) — those belong to the foundry call site via `renderTitle`/props, not the DS component.
- Text casing at call site: `sectionLabel`, titles, descriptions, CTA labels authored as-is; no `text-transform` in the component.
