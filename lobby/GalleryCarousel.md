---
component: GalleryCarousel
source: kol-monorepo/apps/web/src/routes/WorkDetail.jsx#L18-L101
date: 2026-07-03
status: draft
deps: [Carousel, ImageLightbox, FullscreenOverlay, Image]
---

# GalleryCarousel

## Purpose
The project-detail media gallery: a horizontal, drag-scrollable Embla track of mixed image/video tiles at varying widths (wide vs portrait), where clicking a tile opens a **paged fullscreen viewer** starting at that tile. Currently an inline function component inside `WorkDetail.jsx`. Two responsibilities: (1) the drag-free media shelf, (2) opening the shared lightbox. Both should be recomposed from existing DS pieces rather than kept bespoke.

## Anatomy
- Embla viewport `<div className="overflow-visible" ref={emblaRef}>` — `useEmblaCarousel({ dragFree: true, align: 'start', containScroll: 'trimSnaps' }, [WheelGesturesPlugin()])`.
  - Track `<div className="flex gap-4 items-end">` with drag-vs-click guard handlers (`onPointerDown`/`onPointerMove`/`onClickCapture`).
    - Per item, tile `<div className="flex-none overflow-hidden rounded-[2px] cursor-pointer">`, inline `style={{ width: isWide ? 'min(80%, 700px)' : 'min(50%, 400px)', aspectRatio: ar }}`, `onClick` → open viewer at `i` (unless a drag just happened).
      - **Video** → `<video autoPlay muted playsInline loop className="w-full h-full object-cover">`.
      - **Image** → `<img className="w-full h-full object-cover" alt={item.alt || `${title} ${i+1}`}>`.
- **Fullscreen viewer** (mounts when a tile is clicked) — the staged `ImageLightbox` (`media`, `index`, `onClose`, `onPrev` = `(i-1+len)%len`, `onNext` = `(i+1)%len`).

## Variants
- **Tile width by aspect** — `isWide = ar >= 1` → wide tile `min(80%, 700px)`; portrait → `min(50%, 400px)`. `ar` = authored aspect (see DROP) → `item.dimensions?.aspectRatio` → `0.8` fallback.
- **Image vs video tile** — video autoplays muted/looped inline in the track; both share `object-cover`.
- **Empty** — `if (!media?.length) return null`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| media | array | — | Normalized items: `{ url, kind, aspect?, alt? }` where `kind` is `'image' \| 'video'` |
| title | string | — | Alt-text fallback (`${title} ${i+1}`) |

## Styling
- Tailwind throughout; minimal tokens (this is layout, not chrome): radius `rounded-[2px]`, gaps `gap-4`. Viewport `overflow-visible` (tiles bleed past the edge); track `items-end` (tiles bottom-align, so ragged heights hang from a baseline).
- Tile sizing is inline (`width` clamp + `aspectRatio`) driven by each item's aspect — keep as a computed style, but source the number from a normalized `aspect`, not Sanity.
- **App-specific bits to DROP:**
  - **Sanity media coupling.** `item._type === 'galleryVideo'` (content-type sniff) → normalized `kind: 'image' | 'video'`. Authored `item.aspectRatio === '5:3' ? 5/3 : '4:5' ? 4/5 : null`, then `item.dimensions?.aspectRatio`, then `0.8` → collapse to a single normalized `aspect` number on each item (fallback `0.8` stays as the viewer/tile default). `item._key` keying → stable `id`/`key`.
  - `title`-based alt fallback is fine, but `alt` should ride on the normalized item.

## States & interactions
- **Drag-scroll:** Embla `dragFree` + `WheelGesturesPlugin` (trackpad/wheel pans horizontally). No snap points beyond `trimSnaps`.
- **Drag-vs-click guard:** `hasDragged` ref set on pointer-move-while-down; `onClickCapture` `preventDefault`s and the tile's `onClick` no-ops if a drag occurred — so a drag never opens the lightbox. (Same guard used by `MoreWorkShelf` / the WorkCard shelf recipe.)
- **Open viewer:** click a tile → `setLightboxIndex(i)` → `ImageLightbox` mounts at that index.
- **Paged navigation / close:** owned by the viewer (prev/next wrap modulo `media.length`, Escape, backdrop, swipe, arrows).
- Inline videos autoplay muted/looped in the track regardless of viewer state.

## Dependencies
- **`Carousel`** (DS, Embla) — the drag shelf. The raw `useEmblaCarousel({ dragFree, align:'start', containScroll:'trimSnaps' }, [WheelGesturesPlugin()])` + the hand-rolled drag-vs-click guard should be replaced by DS `Carousel` (which already owns Embla, wheel gestures, and the drag/click distinction).
- **`ImageLightbox`** (staged, `lobby/ImageLightbox.md`) — the fullscreen viewer opened on tile click. Do not re-spec.
- **`FullscreenOverlay`** (DS) — the overlay shell the shared viewer composes.
- Tile image → DS `Image` (+ `AssetPlaceholder`); inline `<video>` stays.

## Recreation notes
- **Tier:** organism — a media shelf (`Carousel`) that drives the shared fullscreen viewer.
- **Compose, don't fork.** The shelf is DS `Carousel` in `dragFree` mode; drop the bespoke Embla wiring and the `hasDragged`/`onClickCapture` guard (Carousel handles drag-vs-click). The lightbox is the SAME shared viewer that `ImageLightbox` and `FullscreenGallery` were staged to collapse onto — one viewer = `FullscreenOverlay` + `Carousel`, opened at the clicked index. Do NOT mount a parallel overlay here; hand the normalized `media[]` + start index to that one viewer.
- **Normalized `media[]`:** each item `{ url, kind: 'image'|'video', aspect?, alt? }`. `kind` replaces the `_type === 'galleryVideo'` sniff; `aspect` replaces the `aspectRatio` string ladder + `dimensions.aspectRatio` (fallback `0.8`). Tile width rule (`aspect >= 1` → wide `min(80%,700px)`, else `min(50%,400px)`) becomes the presentational core — expose the breakpoints/clamps if the DS wants tunable tile sizing.
- **Values → props:** `media`, `title` (alt fallback). Tile clamps (`700px`/`400px`), the `items-end` baseline, and the `0.8` default aspect are candidates for props/config.
- **Text casing at call site:** no user-facing copy here except `alt` — author it on the item; the `${title} ${i+1}` fallback stays internal.
- Ties to the WorkCard "More Work" shelf recipe: identical Embla config (`dragFree`, `align:'start'`, `trimSnaps`, `WheelGesturesPlugin`) + identical drag guard — both should land on the one DS `Carousel` drag-shelf pattern.
