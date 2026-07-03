---
component: ImageLightbox
source: kol-monorepo/apps/web/src/components/work/ImageLightbox.jsx#L1-L106
date: 2026-07-03
status: draft
deps: [FullscreenOverlay, Carousel, Icon]
---

# ImageLightbox

## Purpose
Fullscreen media viewer for a set of images/videos. Given a normalized `media[]` and the active `index`, it renders the current item centered on a dimmed backdrop with prev/next controls, arrow-key navigation, touch-swipe, and close. In the app it backs the work-detail gallery; the reusable core is "a paged fullscreen media viewer" — a viewer, NOT its own overlay shell.

## Anatomy
- Backdrop layer (`fixed inset-0`, dimmed) — clicking it closes.
  - Close button (top-right, round chip) — `Icon name="cross"`.
  - Prev button (left, vertically centered, round chip) — `Icon name="chevron-left"`; only when `media.length > 1`; hidden below `md`.
  - Next button (right, vertically centered, round chip) — `Icon name="chevron-right"`; only when `media.length > 1`; hidden below `md`.
  - Media stage (`max-w-[90vw] max-h-[90vh]`, click does NOT close) — `<img>` or autoplay/muted/loop/playsInline `<video>`, `object-contain`.

## Variants
- **Single item** — prev/next chips omitted (`media.length > 1` gate); still closable + swipeable.
- **Multi item** — prev/next chips shown on `md+`; swipe/arrows on all sizes.
- **Image vs video** — same stage; `<video>` when the item is a video, else `<img>`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| media | array | — | normalized items: `{ url, alt?, kind }` where `kind` is `'image' \| 'video'` |
| index | number | — | active item index into `media` |
| onClose | fn | — | close request (Escape, backdrop click, close button) |
| onPrev | fn | — | previous request (ArrowLeft, swipe right, prev button) |
| onNext | fn | — | next request (ArrowRight, swipe left, next button) |

## Styling
- Backdrop: `fixed inset-0 z-[90] flex items-center justify-center bg-black/90`.
- Close chip: `absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-fg-04 transition-colors hover:bg-fg-08 cursor-pointer`; `Icon` @20.
- Prev/next chips: `absolute {left|right}-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-fg-04 hover:bg-fg-08 transition-colors cursor-pointer`; `Icon` @20. Both `stopPropagation` so the click doesn't bubble to the closing backdrop.
- Stage: `max-w-[90vw] max-h-[90vh]`; media `max-w-full max-h-[90vh] object-contain`.
- Tokens: `bg-fg-04` / `hover:bg-fg-08` (chip surfaces). `bg-black/90` is a hard black scrim, not a token.
- **App-specific bits to DROP:**
  - `item._type === 'galleryVideo'` — a Sanity content-type sniff. Drop it; the video/image decision must come from a normalized `kind` field on each item, not by inspecting Sanity `_type` or extension-guessing. The `isVideo(src)` extension helper (`.mp4/.mov/.webm`) is a convenience fallback at the app's normalize step, not viewer logic.
  - `z-[90]` and the hardcoded scrim — the DS overlay shell owns stacking + scrim; drop these when composing `FullscreenOverlay`.
  - `capture: true` keydown + `stopImmediatePropagation()` on Escape — a workaround to fire before the consumer's (`WorkDetail`) own Escape handler. That's app-coupling; the DS viewer should own Escape cleanly without capture-phase games.
  - `document.body.style.overflow = 'hidden'` scroll-lock — already provided by `FullscreenOverlay`; drop.

## States & interactions
- **Keyboard** (`document` listener): Escape → `onClose`; ArrowLeft → `onPrev`; ArrowRight → `onNext`.
- **Swipe** (touch): horizontal delta > 50px → `onPrev`; < -50px → `onNext`; tracked via `touchStart` ref on the backdrop.
- **Close**: Escape, backdrop click, or close button. Media stage and control chips `stopPropagation` to avoid closing.
- No focus-trap today — the recreation should add one (inherit it from `FullscreenOverlay`).
- Guard: renders `null` when `media[index]` is missing.

## Dependencies
- `Icon` (cross / chevron-left / chevron-right) → DS `Icon`.
- Reinvents overlay behavior that DS `FullscreenOverlay` already provides (scrim, scroll-lock, Escape, backdrop-close, close button).
- Reinvents paging (prev/next + swipe) that DS `Carousel` (embla) already provides.

## Recreation notes
- Tier: **organism** — a paged media viewer composed from existing primitives; do NOT build a 4th parallel overlay.
- **Compose, don't reinvent:** the shell (backdrop scrim, scroll-lock, Escape, backdrop-click close, close affordance, focus-trap) is `FullscreenOverlay`. Mount the viewer as its `children`. Delete the local `fixed inset-0`, `z-[90]`, `bg-black/90`, body-overflow lock, and the capture-phase Escape hack.
- **Paging is `Carousel`:** feed the `media[]` as slides; embla already gives touch-swipe + prev/next + `dragFree`. Replace the hand-rolled `touchStart`/50px-delta logic and the two chevron chips with Carousel's controls (restyled to the round-chip look via `kol-embla-btn`), and bind ArrowLeft/ArrowRight to `emblaApi.scrollPrev()/scrollNext()`. Sync `index` ↔ embla's selected snap so the parent stays authoritative.
- Keep the public surface `{ media, index, onClose, onPrev/onNext }` OR let the composed viewer own its own index internally and emit `onIndexChange` — pick one; the current split-brain (parent owns index, viewer owns swipe) is the coupling to remove.
- Each media item is `{ url, alt, kind }`; video is `autoPlay muted playsInline loop object-contain`. Consider routing the image case through DS `Image` for loading/`AssetPlaceholder` behavior; leave `<video>` inline.
- Net: this spec + `FullscreenGallery` should collapse into ONE shared viewer (FullscreenOverlay + Carousel), consumed by both.
