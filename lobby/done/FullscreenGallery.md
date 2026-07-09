---
component: FullscreenGallery
source: kol-monorepo/apps/brand/src/components/styleguide/FullscreenGallery.jsx#L1-L32
date: 2026-07-03
status: draft
deps: [FullscreenOverlay, Carousel, Image, AssetPlaceholder]
---

# FullscreenGallery

## Purpose
A grid (or stacked) set of image tiles that each open into a fullscreen lightbox on click/keypress. It is the "gallery" half — the tiles and the tile→open behavior — that pairs with the fullscreen viewer (`ImageLightbox`). Already composes DS `FullscreenOverlay` for the open state; the reusable behavior is keyboard-accessible tiles that promote a clicked item into the overlay.

## Anatomy
- Tile list — either a grid (`layout === 'grid'`, `cols` tracks) or a plain stacked `<div>`.
  - Tile (`role="button"`, `tabIndex={0}`, `cursor-zoom-in`) — one per item; sets `current` on click / Enter.
    - Figure: framed thumbnail `<img loading="lazy">` + optional caption (`<figcaption>`).
- `FullscreenOverlay` (open when an item is `current`) — renders the selected item's full image.

## Variants
- **layout="stack"** (default) — tiles in a plain vertical `<div>`.
- **layout="grid"** — tiles in a grid with `cols` columns.
- **With / without caption** — figcaption renders only when the item has a caption.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| items | array | — | tile items: `{ src, caption? }` |
| layout | `'stack' \| 'grid'` | `'stack'` | grid vs stacked tile layout |
| cols | number | 4 | grid column count (grid layout only) |
| tileClassName | string | `''` | extra classes merged onto each tile |

## Styling
- Tile: `kol-fs-tile cursor-zoom-in` (+ `tileClassName`).
- Grid layout comes from `AssetGrid`: `kol-asset-grid kol-asset-grid-{cols}col grid gap-4 mt-8`.
- Tile figure (from `AssetFigure`, to be inlined — see notes): frame `kol-asset-figure-frame rounded-[4px] overflow-hidden`; default frame `bg-fg-04 border border-fg-08`; caption `kol-helper-12 uppercase tracking-wider text-meta mt-2`; `<img loading="lazy">`.
- Tokens: `bg-fg-04`, `border-fg-08`, `text-meta`; radius `rounded-[4px]`; typography `kol-helper-12`.
- **App-specific bits to DROP:**
  - Hard dependency on `AssetFigure` and `AssetGrid` (brand-app styleguide components). Recreate the tile inline — do NOT require `AssetFigure`. The grid can use plain Tailwind grid utilities (`grid gap-4` + a `cols` track) instead of importing `AssetGrid`.
  - The styleguide-flavored caption styling (`uppercase tracking-wider text-meta`, `mt-8` grid offset) is brand-styleguide chrome; keep captions but drop the styleguide-specific casing/spacing defaults — the caption string is authored by the consumer (no auto-uppercase in the DS tile).
  - Keying tiles by `item.src` — fine as a fallback, but the DS should accept a stable `id`/`key` since `src` collisions and re-order are real.

## States & interactions
- **Open**: tile click OR Enter → `setCurrent(item)` → overlay opens.
- **Close**: `FullscreenOverlay` handles Escape / backdrop / close button → `setCurrent(null)`.
- **Keyboard on tiles**: `role="button"` + `tabIndex={0}`; `onKeyDown` fires on Enter only. **Gap to fix:** Space should also activate a `role="button"` (native button behavior); the recreation should handle Space + Enter and `preventDefault` on Space.
- No prev/next inside the overlay today — it shows a single static `<img>`. This is the missing piece the shared viewer supplies (see notes).

## Dependencies
- `FullscreenOverlay` (DS) — already composed for the open state; keep.
- `AssetFigure` / `AssetGrid` (brand styleguide) — DROP as deps; inline the tile + grid.
- Overlaps `ImageLightbox`: both are "open a fullscreen image with nav." This gallery currently opens a nav-less single image.

## Recreation notes
- Tier: **organism** — a gallery of tiles that drives the shared fullscreen viewer.
- **Compose, don't fork:** keep using `FullscreenOverlay` for the shell (it already is). For the overlay CONTENT, mount the SAME viewer that `ImageLightbox` recreates (FullscreenOverlay + Carousel) so opening a tile lands in a paged viewer with prev/next/swipe/arrows across all `items` — starting at the clicked index — instead of the current static single `<img>`. That collapses the two specs onto one viewer; do not build a second overlay here.
- **Inline the tile:** recreate the framed thumbnail directly (frame div + `<img>`/`Image` + optional `<figcaption>`); do not import `AssetFigure`. Route the thumbnail through DS `Image` + `AssetPlaceholder` for lazy-load/placeholder behavior.
- **Grid inline:** replace `AssetGrid` with a Tailwind grid on the wrapper (`grid gap-4` + `cols` → a `grid-cols-*` or inline `gridTemplateColumns`); `layout="stack"` stays a plain flow container.
- **Accessibility:** the tile is a click target — prefer a real `<button>` (or keep `role="button"` but handle Space + Enter and `preventDefault` Space). Caption text is authored by the consumer verbatim — no auto-uppercase in the tile.
- Public surface stays `{ items, layout, cols }` (+ optional `tileClassName`); `items` normalize to `{ src, caption?, alt? }`, aligned with the viewer's `media[]` shape.
