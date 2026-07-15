---
component: ParallaxShelf
source: kol-monorepo/apps/web/src/routes/Work.jsx#L26-L120
date: 2026-07-03
status: draft
deps: [Carousel, WorkCard]
---

# ParallaxShelf

## Purpose
One horizontal shelf row on the `/work` shelf view: a **drag-free Embla carousel** of project cards with **scroll-driven parallax** — as the page scrolls, the carousel is nudged horizontally in proportion to the scroll delta, with strength easing in the further down the page you are. Alternating rows scroll in opposite directions (`fromLeft`), producing a woven, parallaxing wall of shelves. Includes a drag-vs-click guard (so a drag doesn't fire a card link) and an edge-aligned category label. Parallax is disabled on mobile; touch users get a plain wheel/drag carousel.

## Anatomy
- `<section ref={sectionRef} className="py-6 md:py-16">` — `sectionRef` is used only to measure in-view (`getBoundingClientRect`) for the parallax gate.
- **Embla viewport** `<div className="overflow-visible select-none" ref={emblaRef}>` with edge padding that pulls the aligned end inward:
  - `paddingLeft: fromLeft ? undefined : 'max(4rem, calc((100vw - 1400px) / 2 + 16rem))'`
  - `paddingRight: fromLeft ? 'max(4rem, calc((100vw - 1400px) / 2 + 16rem))' : undefined`
  - (i.e. the *aligned* edge gets the big gutter so the first/last card lands under the 1400px content column.)
- **Track** `<div className="flex gap-8 items-end">` carrying the drag-guard pointer handlers (`onPointerDown`/`onPointerMove`/`onClickCapture`), mapping cards:
  - `{items.map((project, i) => <ShelfCard key={`${project._id}-${i}`} project={project} index={i} />)}` — **ShelfCard is the staged `WorkCard`; reference it, don't re-spec.** `items = projects.map((p,i) => ({...p, _repeatIndex:i}))` (the `_repeatIndex` is vestigial — unused downstream).
- **Label** `<div className="max-w-[1400px] mx-auto mt-4 md:mt-6 {fromLeft ? 'pr-4 md:pr-64 text-right' : 'pl-4 md:pl-64'}">` → `<p className="kol-helper-xs text-auto uppercase">{type.label}</p>`. The label hugs the same edge the row is aligned to.

Module consts: `IS_MOBILE = matchMedia('(max-width: 767px)').matches` (evaluated once); `SCROLL_PARALLAX_MIN = 0.1`; `SCROLL_PARALLAX_MAX = 0.4`.

## Variants
- **Direction** (`fromLeft` bool) — flips Embla `align` (`'end'` vs `'start'`), the `startIndex` (`items.length - 1` when `fromLeft`, else default 0), the padding side, the parallax sign (`fromLeft ? +1 : -1`), and the label alignment. Parent alternates it per row (`typeIndex % 2 === 1`).
- **Mobile** — parallax effect entirely skipped (`if (IS_MOBILE) return`); still a functional wheel/drag carousel.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| type | `{ key, label }` | — | Category; `label` renders in the edge caption (**drop `key`** — it was only used by the parent to filter) |
| projects / items | `Project[]` | — | Cards to render; passed to `WorkCard` |
| fromLeft | boolean | `false` | Direction of alignment, start index, parallax sign, padding + label side |

Parent also passes `rowDelay={0}` — **unused in `ShelfRow`, drop it.** Consider a `renderCard`/`children` seam so the shelf is card-agnostic rather than hardcoding `WorkCard`.

## Styling
- Tailwind for layout; the parallax is imperative JS on the Embla engine (no CSS transition).
- KOL utilities: `kol-helper-xs`, `text-auto`, spacing `py-6 md:py-16`, `gap-8`, `mt-4 md:mt-6`, `md:pl-64`/`md:pr-64`. Radius/tone live in the card, not here.
- **Embla config (exact):**
  ```js
  useEmblaCarousel({
    dragFree: true,
    align: fromLeft ? 'end' : 'start',
    containScroll: 'trimSnaps',
    ...(fromLeft && { startIndex: items.length - 1 }),
  }, [WheelGesturesPlugin()])
  ```
- **Scroll-parallax formula (exact):** in a `passive` `window` scroll listener, gated to run only while `sectionRef` is in view (`rect.bottom > 0 && rect.top < window.innerHeight`; out-of-view just resyncs `lastScrollY` and bails):
  ```js
  const delta = window.scrollY - lastScrollY.current
  lastScrollY.current = window.scrollY
  const scrollProgress = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1)
  const parallax = SCROLL_PARALLAX_MIN + (SCROLL_PARALLAX_MAX - SCROLL_PARALLAX_MIN) * (scrollProgress * scrollProgress)
  const engine = emblaApi.internalEngine()
  const offset = delta * parallax * (fromLeft ? 1 : -1)
  engine.scrollBody.useDuration(0)
  engine.scrollTo.distance(offset, false)
  ```
  Strength eases in quadratically with page-scroll progress (`0.1 → 0.4`, `scrollProgress²`); each scroll-delta is applied instantly (`useDuration(0)`) to the Embla body via `internalEngine()`. Effect `useEffect` deps `[emblaApi, fromLeft]`; cleanup removes the listener.
- **Drag-suppressed click guard:** `pointerStart` ref records pointer down; `onPointerMove` flags `hasDragged` once movement exceeds `dx² + dy² > 25` (5px); `onClickCapture` calls `e.preventDefault()` when `hasDragged` — so a drag never triggers the card's link.
- **App-specific bits to DROP:**
  - The `ShelfCard` import — recreate as composing the staged **`WorkCard`** (see `lobby/WorkCard.md`), or better a `renderCard`/`children` slot.
  - Sanity `project._id` / `project.type` keying and the parent's `projectsByType` filtering — pass a plain `items` array; the `_repeatIndex` spread and `rowDelay` prop are dead, drop both.
  - The `getBoundingClientRect` in-view gate + `document.body.scrollHeight`/`window.scrollY` math are **behavior to keep** (global-scroll driven), not app coupling — just no router/context.

## States & interactions
- **Scroll (desktop):** page scroll → carousel nudged by `delta × parallax × direction`; parallax strength grows with page depth; only active while the row is on screen.
- **Wheel:** `WheelGesturesPlugin` maps vertical/horizontal wheel to carousel scroll.
- **Drag:** `dragFree` free-scroll; a drag past 5px suppresses the ensuing click so cards don't navigate mid-drag.
- **Mobile:** no parallax; wheel/drag only.

## Dependencies
- **Carousel** (DS, Embla) — see reconciliation below.
- **WorkCard** (staged, `lobby/WorkCard.md`) — the rendered card (source `ShelfCard`); pass `index={i}` for its ragged-height stagger.
- `embla-carousel-react` + `embla-carousel-wheel-gestures` (`WheelGesturesPlugin`) — same stack as DS `Carousel`.

## Recreation notes
- **Tier:** organism — an Embla track + a scroll-parallax engine binding + drag guard + edge label, composing card molecules.
- **No context/router coupling to remove here** (that lives in the parent `Work.jsx`, which reads `useWorkView()` for `viewMode`/`searchQuery`). `ShelfRow` itself is already presentational — the seam is just: replace the `ShelfCard` import with a `renderCard`/`children` slot and pass a plain `items` array + `fromLeft`.
- **Reconcile vs DS `Carousel`:** DS `Carousel` is the *same* Embla stack and default options (`align:'start', loop:false, dragFree:true, containScroll:'trimSnaps'`) but ships fixed prev/next controls, **no** parallax, **no** alternating direction, **no** drag-click guard, and — critically — it does **not** forward `emblaApi`/`internalEngine()`, which the parallax nudge requires. Recommendation: **extend `Carousel` with a `parallax` (bool/`{min,max}`) prop and a `direction`/`fromLeft` prop, hide-controls, and expose the embla api** (ref-forward or `onApi` callback) so the scroll-nudge can reach `internalEngine()`. If exposing the engine is unwanted, keep `ParallaxShelf` as its own organism that composes an Embla track directly (as source does) rather than DS `Carousel`. Either way the parallax formula + in-view gate + drag guard belong to *this* component, not to base `Carousel`.
- **Text casing at call site:** the label uses `uppercase` presentationally on a `kol-helper-xs` caption — acceptable as a presentational default; author `type.label` verbatim (e.g. `Client Work`, `Typefaces`), don't uppercase content in JS.
