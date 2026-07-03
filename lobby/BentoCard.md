---
component: BentoCard
source: kol-monorepo/apps/web/src/components/cards/BentoCard.jsx#L1-L122
date: 2026-07-03
status: draft
deps: [HlsVideo, TiltCard, Button]
---

# BentoCard

## Purpose
A media hover-card for grid/bento layouts. It auto-detects the media type from `src` (HLS `.m3u8` → `HlsVideo`, `.mov/.mp4/.webm` → autoplay `<video>`, otherwise `<img>`, else a placeholder), lays it full-bleed behind a content stack, and on hover (fine-pointer) reveals a darkening scrim plus subtitle / description / CTA over an always-visible title. Optional pointer-following 3D tilt. CTA is a DS `Button` that routes internally (react-router `Link`) or externally (anchor) based on `href`. Zero Sanity/CMS coupling — fully flat props.

## Anatomy
- Root `<Component>` — `div`, or `motion.div` when `useMotion` — `relative group {alignRight ? 'ms-auto' : 'size-full'} {className}`; spreads tilt handlers + `style={{ ...tiltStyle, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden' }}`.
- **Media layer** (mutually exclusive, all `absolute left-0 top-0 size-full rounded overflow-hidden {imageClassName}` + `pointer-events-none` on touch):
  - `.m3u8` → `<HlsVideo src poster>`
  - `.mov|.mp4|.webm` → `<video autoPlay muted loop playsInline preload="auto">`
  - other `src` → `<img>`
  - no `src` → `<div className="... bg-surface-secondary">` placeholder
- **Content wrapper** `relative z-10 flex size-full h-full flex-col justify-start items-start text-auto`
  - inner `relative z-10 {contentClassName} w-full h-full self-stretch`
    - **Overlay** (when `overlayOpacity > 0`) `absolute -inset-1 rounded` + `opacity-0 group-hover:opacity-100` (touch: `opacity-60`) `transition-opacity duration-300 pointer-events-none`, inline `backgroundColor: rgba(0,0,0, overlayOpacity/100)`
    - **Content stack** `{contentStackClassName}` (default `relative z-20 h-full flex flex-col justify-start items-start gap-4 p-6 md:p-8`)
      - `<h1 className={titleClassName}>` — **always visible** (default class `kol-heading-xl text-light-fixed uppercase`)
      - subtitle `<p className="kol-mono-text text-light-fixed [hover-reveal]">`
      - description `<p className="kol-mono-xs text-light-fixed pb-6 [hover-reveal]">`
      - `{bodyContent}` — free slot
      - CTA (when `href`, hover-reveal wrapper): `http`/`mailto` → `<Button href variant="primary" size="sm">`; otherwise `<Link to={href}><Button variant="primary" size="sm">`, label `{buttonLabel}`

## Variants
- **Media type** — auto: hls / video / image / placeholder.
- **Tilt** — CSS (`useBentoTilt`) by default; framer-motion (`useBentoTiltMotion`) when `useMotion`; disabled when `enableTilt=false` or on touch.
- **Alignment** — `alignRight` → `ms-auto` vs `size-full`.
- **Pointer** — hover-reveal (fine pointer) vs everything-shown-static (touch, via `useIsTouchDevice`).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| src | string | — | Media source; type auto-detected by extension |
| poster | string | — | Poster for HLS/video |
| title | string | — | Always-visible heading |
| subtitle | string | — | Hover-revealed line |
| description | string | — | Hover-revealed paragraph |
| href | string | — | CTA target; `http`/`mailto` → anchor, else router `Link` |
| buttonLabel | string | `'View Project'` | CTA label |
| bodyContent | ReactNode | `null` | Extra content injected into the stack |
| titleClassName | string | `'kol-heading-xl text-light-fixed uppercase'` | Title classes |
| contentClassName | string | `'max-w-[384px]'` | Inner content-box classes |
| imageClassName | string | `'object-cover object-center'` | Media fit classes |
| contentStackClassName | string | `'relative z-20 h-full flex flex-col justify-start items-start gap-4 p-6 md:p-8'` | Stack layout classes |
| overlayOpacity | number | `60` | Scrim darkness % (0 disables) |
| alignRight | boolean | `false` | Right-align the card |
| useMotion | boolean | `false` | framer-motion tilt vs CSS tilt |
| enableTilt | boolean | `true` | Master tilt switch |
| className | string | `''` | Root classes |
| ...rest | — | — | Spread onto root |

## Styling
- Type: `kol-heading-xl` (title), `kol-mono-text` (subtitle), `kol-mono-xs` (description).
- Tokens: `text-light-fixed` (theme-fixed light foreground for text over media — key for legibility on any image), `bg-surface-secondary` (placeholder). `rounded`, `transition-opacity duration-300`.
- **App-specific bits to DROP:**
  - `buttonLabel` default `'View Project'` is app copy → neutral default or make required.
  - Default `titleClassName` bakes in `uppercase` (presentational — see casing note).
  - The scrim is an inline `rgba(0,0,0,α)` not a token → map to a KOL scrim/overlay token.
  - Internal-vs-external routing branches on `Link` from `react-router-dom` — the DS `Button` should own link routing (an `as`/link-component prop) rather than BentoCard importing the router.

## States & interactions
- **Hover (fine pointer):** overlay + subtitle + description + CTA fade in (`group-hover:opacity-100`); title stays visible.
- **Touch (`useIsTouchDevice`):** everything shown statically (opacity 100, overlay 60), media gets `pointer-events-none`, tilt disabled.
- **Tilt:** pointer-following via `useBentoTilt` (CSS) or `useBentoTiltMotion` (framer-motion); `backfaceVisibility:hidden` on root.
- **Video:** autoplay, muted, loop, `playsInline`.

## Dependencies
- **`HlsVideo`** — staged separately (`lobby/HlsVideo.md`); used for `.m3u8` sources.
- **Tilt hooks** — `useBentoTilt` (CSS, the default here) + `useBentoTiltMotion` (framer-motion, when `useMotion`) + `useIsTouchDevice`. The motion hook is captured with `lobby/TiltCard.md`; **note BentoCard's default path uses the CSS `useBentoTilt`, which TiltCard did not stage** — that CSS variant must promote too.
- `Button` (`@kol/ui`), `Link` (`react-router-dom`), `motion` (`framer-motion`).

## Recreation notes
- Tier: **organism** (media primitive + hover choreography + CTA + tilt).
- Recreate by **composing the staged pieces**: DS `HlsVideo` + the promoted tilt hook(s) + DS `Button`. Fold `useIsTouchDevice` in as an internal. The extension-sniffing (`/\.(mov|mp4|webm)$/i`, `/\.m3u8$/i`) is the reusable core — consider a small `<Media src>` primitive that owns the hls/video/image branch and share it with other cards.
- Values that become props / drop: the `'View Project'` default (drop), the inline scrim color (→ token), router coupling (→ Button `as`).
- Text casing at call site: the title's `uppercase` comes from the default class — keep it as a presentational default, but author the title string as-is; do not uppercase content in JS (KOL rule).
