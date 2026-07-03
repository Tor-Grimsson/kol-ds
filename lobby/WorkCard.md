---
component: WorkCard
source: kol-monorepo/apps/web/src/components/work/ShelfCard.jsx#L1-L67
date: 2026-07-03
status: draft
deps: [TiltCard]
---

# WorkCard

## Purpose
The grid/shelf project card for the `/work` listing: a fixed-size media card (thumbnail via the staged **TiltCard**, `grounded` variant) with a hover-revealed bottom overlay carrying the project title + a meta line (client-or-type · year). It preloads its own thumbnail and plays a staggered rise-and-untilt entrance keyed off its `index` in the shelf. The whole card is a link to the project detail. Zero rendered children beyond title + meta — it's a media tile with a caption drawer.

## Anatomy
- Root link (`<Link>` in-app → **DROP to `href`**, render a plain `<a>` / DS link): `flex-none w-[280px] md:w-[400px] {stagger-height} group`, `style={{ perspective: 800 }}` on fine-pointer only (module-level `IS_MOBILE` guard omits perspective on touch).
- **Entrance wrapper** `<div className="w-full h-full">` with inline style:
  - `transformOrigin: 'bottom center'`
  - initial (not ready): `opacity: 0`, `transform: rotateX({20 + (index%3)*8}deg) translateY({30 + (index%4)*10}px)`
  - ready: `opacity: 1`, `transform: rotateX(0deg) translateY(0px)`
  - `transition: opacity {0.7 + (index%3)*0.15}s {EASE} {index*0.07}s, transform … (same timing)`; `EASE = cubic-bezier(0.16, 1, 0.3, 1)`.
  - `ready` flips true after the thumbnail preloads (`new Image()` `onload`/`onerror`), or immediately if no thumbnail.
- **TiltCard** (staged) `src={thumbnail} alt={title} variant="grounded" className="w-full h-full rounded-[4px] border border-fg-04"`:
  - children = hover overlay drawer `absolute inset-x-0 bottom-0 z-10 p-4 md:p-6 bg-surface-inverse opacity-0 group-hover:opacity-100 transition-opacity duration-300`
    - Title `<p className="text-auto-inverse text-4xl lg:text-5xl leading-tight">`, inline `fontFamily: 'TGDylgjur', fontWeight: 400`.
    - Meta `<p className="kol-mono-xs text-auto-inverse opacity-60 uppercase tracking-widest mt-2">` = `[client || TYPE_LABELS[type], year].filter(Boolean).join(' · ')`.

## Variants
- **Stagger height** — `HEIGHTS = ['h-[408px] md:h-[560px]', 'h-[372px] md:h-[520px]', 'h-[336px] md:h-[480px]']`, chosen by `index % 3`. A shelf of these reads as a ragged skyline. Expose as an `index` (or explicit `height`) prop.
- **Fine vs coarse pointer** — `perspective: 800` applied only when not touch (`IS_MOBILE` = `matchMedia('(max-width: 767px)')`, evaluated once at module load); TiltCard itself already no-ops tilt on coarse pointers.
- **No thumbnail** — `ready` flips immediately; card still renders (TiltCard shows empty image wrapper — route through DS `Image`/`AssetPlaceholder` in recreation).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| title | string | — | Overlay heading |
| thumbnail | string | — | Image URL (preloaded, passed to TiltCard `src`) |
| href | string | — | Link target (**replaces** `/work/${slug.current}`) |
| client | string | — | First segment of meta line (falls back to type label) |
| type | `'client' \| 'collection' \| 'typeface' \| 'tool' \| 'system'` | — | Maps via `TYPE_LABELS` when no `client` |
| year | string \| number | — | Second segment of meta line |
| index | number | `0` | Drives stagger height + entrance timing (delay/rotation/translate) |

`TYPE_LABELS = { client:'Client', collection:'Collection', typeface:'Typeface', tool:'Tool', system:'System' }`.

## Styling
- Tailwind throughout; KOL tokens: `border-fg-04` (card border), `bg-surface-inverse` (overlay drawer), `text-auto-inverse` (title + meta on inverse surface), typography `kol-mono-xs`. Radius `rounded-[4px]`.
- Title font is an inline `fontFamily: 'TGDylgjur'` display face — map to a KOL display type token/utility, don't hardcode the family string.
- **App-specific bits to DROP:**
  - Sanity project doc → flat props. Currently reads `project.thumbnail?.url`, `project.title`, `project.slug.current`, `project.client`, `project.type`, `project.year`. Replace with the flat bag above (`{title, thumbnail, href, client, type, year, index}`). (Note: the caller-suggested `{title, thumbnail, href, tags, aspect}` doesn't match usage — this card renders no tags and derives no aspect; heights come from `index`. Spec'd to actual consumption.)
  - Hardcoded `/work/${project.slug.current}` route + `react-router` `Link` → generic `href` on a DS link (`as`/link-component), no router import.
  - `TYPE_LABELS` map + `HEIGHTS`/`EASE`/`IS_MOBILE` module constants — keep as internal config, but `HEIGHTS` and `perspective` should be overridable.

## States & interactions
- **Entrance:** on mount, preload thumbnail → set `ready` → card fades in and untilts (rotateX→0, translateY→0) with an `index`-staggered delay. On coarse pointer the perspective is dropped so the rotateX reads flatter.
- **Hover (`group`):** overlay drawer fades `opacity-0 → group-hover:opacity-100` (300ms). TiltCard supplies the 3D pointer tilt (grounded/planted, pivots at bottom edge).
- **Click:** navigates to `href`.
- Coarse pointer: no perspective, TiltCard static.

## Dependencies
- **TiltCard** (staged, `lobby/TiltCard.md`) — `variant="grounded"`; owns the `<img>` and the tilt. Do not re-spec; compose it.
- `Link` (`react-router-dom`) — **drop**, replace with `href`.
- Browser `Image` constructor for preload (not DS `Image`) — could be replaced by DS `Image`'s own load/placeholder handling.

## Recreation notes
- **Tier:** organism (TiltCard media molecule + entrance choreography + caption drawer + link).
- **Flat props:** `title`, `thumbnail` (URL string), `href`, `client`, `type`, `year`, `index`. Meta line is composed inside: `[client || TYPE_LABELS[type], year].filter(Boolean).join(' · ')` — keep that composition internal so callers pass raw fields.
- **Text casing at call site:** the meta line uses `uppercase` presentationally (mono caption style) — acceptable as a presentational default, but author `title`, `client`, `year` strings verbatim; do not uppercase content in JS. `TYPE_LABELS` values are authored capitalized as label copy.
- **The "More Work" shelf is a RECIPE, not a component.** In `WorkDetail.jsx` the inline `MoreWorkShelf` (#L103-L143) is just an Embla `dragFree` horizontal track (`flex gap-4 items-end`, `WheelGesturesPlugin`, drag-vs-click guard) rendering `WorkCard` per project. Don't stage it separately — document it as "lay WorkCards in a flex/grid (or DS `Carousel` for the drag-scroll shelf); the ragged heights come from passing sequential `index`." Same Embla setup as `GalleryCarousel` (see that spec).
- Route the thumbnail through DS `Image` + `AssetPlaceholder` for load/placeholder behavior (TiltCard currently renders a bare `<img>` inside).
