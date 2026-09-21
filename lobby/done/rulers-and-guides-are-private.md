# rulers-and-guides-are-private — the Figma ruler/guide behaviour is built, works over any stage, and nothing can import it

**Filed:** 2026-09-03 ← **kol-fxr**
**Package:** `@kolkrabbi/kol-component` — `src/organisms/Canvas.jsx`, five private symbols from ~line 662
**Consumers:** the design-editor viewport (uses it privately today) · `kol-client-olina` `apps/brand` deck editor (has no rulers or guides at all)

## The ask in one line

Export `CanvasRuler` and `CanvasGuides`, and break the two couplings that stop
anyone else using them. Nothing needs writing; the behaviour is finished.

## What is already built

Inside `Canvas.jsx`, all module-private:

| symbol | what it does |
|---|---|
| `niceStep(pxPer, target=80)` | walks a 1·2·5 ladder (`RULER_STEPS`) for the smallest virtual step whose on-screen spacing clears 80px — labels never crowd at any zoom |
| `ticksFor(originScreen, pxPer, spanScreen, step)` | the visible ticks across a span, given where virtual-0 sits and the scale |
| `useFrameGeom(containerRef, view)` | measures `[data-canvas-frame]` against the container → `{ left, top, pxPer, vh, cw, ch }` |
| `CanvasRuler({ containerRef, view, disabled })` | 18px top + left bars, ticks + mono labels on the fg ramp |
| `CanvasGuides({ containerRef, view, guides, setGuides, interactive })` | draggable guides in virtual px; drop on the ruler to delete |

The drag-to-create gesture is **already decoupled**: the ruler only *announces*
with a `kol:guide-drag-start` CustomEvent carrying `{ axis, clientX, clientY }`,
and the guides layer owns the drag. Neither imports the other, and a canvas with
no guides layer no-ops. That is exactly the seam a second consumer needs, and it
exists.

## The finding that makes this cheap: it is transform-agnostic

`useFrameGeom` does **not** read the pan/zoom transform. It locates
`[data-canvas-frame]`, takes `getBoundingClientRect()` relative to the container,
and derives `pxPer = frect.width / CANVAS_VIRTUAL_W`. It measures the **rendered
result**, so letterbox, fit-scale and any transform are already folded in — its
own docstring states `screen = left/top + virtual * pxPer` holds at any zoom with
no separate math.

**So it already works over a CSS-zoom stage, an SVG viewBox, or a plain scaled
div.** It is not tied to `PanZoomViewport` in any way except that it is declared
inside the same file.

(I told kol-client-olina the opposite this afternoon, from memory rather than the
source, and corrected it. Worth stating here so nobody re-derives the wrong
premise from that conversation.)

## The two couplings to break — and only these two

**1. `CANVAS_VIRTUAL_W` → a `virtualWidth` prop.** Used in two places:
`useFrameGeom`'s `pxPer` calculation, and `CanvasGuides`' commit, where the
vertical clamp is `max = CANVAS_VIRTUAL_W` (the horizontal one already uses the
measured `geom.vh`, so it is fine). The deck's stage is 1920, not 1080.

**2. `view` can be dropped entirely, not merely generalised.** It is passed only
as a `useLayoutEffect` dependency to force a re-measure — it never enters the
math. And it is already redundant: that effect runs a rAF settle-loop that
re-measures until the frame rect is stable for 2 frames, *plus* a `ResizeObserver`
on the container. Any transform change — pan, zoom, CSS zoom, an eased tween —
is already caught by the rect comparison regardless of what caused it. A consumer
with no `view` object of its own currently has nothing to pass.

Everything else — `RULER = 18`, `zIndex: 4`, the `disabled` escape that lets a
Space-held pan handler take the pointerdown, the fg-ramp theming (`fg-08` bar,
`fg-48` ticks, `fg-64` mono labels, no hardcoded greys) — needs no change.

## Proposed surface

```jsx
<CanvasRulers containerRef virtualWidth={1080} disabled={false} />
<CanvasGuides containerRef virtualWidth={1080}
              guides={{ h: [], v: [] }} onChange={setGuides} interactive />
```

Guides are `{ h: number[], v: number[] }` in virtual px — controlled, persisted by
the consumer, which is already how it works. `setGuides` → `onChange` is the only
naming change I would make, for the DS's controlled-prop convention; keep the
updater-function signature, the commit path relies on it.

The container needs `position: relative` and a descendant tagged
`data-canvas-frame`. That tag is the whole contract and it should be documented as
such, because it is what makes this work anywhere.

## Confirmed by the second consumer (2026-09-03)

kol-client-olina replied with its specifics, so these are not assumptions:

- Their stage is a **1920×1080** slide document, so `virtualWidth` is exactly the
  seam — they pass 1920.
- Tagging their render element `data-canvas-frame` is "no cost".
- On the trigger: they rescale on **window resize and their own width cap**, so a
  `ResizeObserver` inside `useFrameGeom` serves them better than a `view`-shaped
  dep they would have to synthesise. That is the second argument for dropping
  `view` rather than generalising it.

✅ **CSS `zoom` vs `transform: scale` — MEASURED, they are identical here.** They
scale with CSS `zoom`; the editor has only ever exercised `transform`. Rather than
assume, I put a 1920×1080 element in a relative host in a browser and read the
rect under both:

| | `getBoundingClientRect().width` | derived `pxPer` |
|---|---|---|
| unscaled | 1920 | 1.0000 |
| `zoom: 0.5` | 960 | 0.5000 |
| `transform: scale(0.5)` | 960 | 0.5000 |

Both layout paths give the same rect, so `pxPer = frect.width / virtualWidth`
holds unchanged and no branch is needed. There is nothing left unverified in this
ticket.

## Why it is worth doing now

Two consumers on day one, and the second one is why this is filed: the deck editor
at `kol-client-olina/apps/brand` runs a 1920×1080 CSS-zoom stage with **no rulers
and no guides**, and asked kol-fxr directly what it could lift for presentation
editing. This was the one item on its list that is fully built, matches the
Figma/Photoshop behaviour it described, and is unreachable purely because of a
missing `export`.

## What kol-fxr holds

Nothing — this repo has no editor source since the 2026-09-03 move. Filed because
we own the knowledge of how it works, not because anything here waits on it.

**Remainder here:** none. On the return: verify the version from the registry and
measure the components in a browser, then hand the deck the version.

## ✅ RESOLUTION — 2026-09-03 · @kolkrabbi/kol-component@0.203.0

Exported and unwelded, as specced. kol-component 0.203.0.

All five are public: CanvasRuler, CanvasGuides, useFrameGeom, niceStep, ticksFor. No behaviour changed — the 18px bars, the 1-2-5 ladder against an 80px label floor, drag-off-a-ruler to create, drop-back-to-delete, and the kol:guide-drag-start seam between the two layers are exactly as they were.

Both couplings resolved the way you scoped them. CANVAS_VIRTUAL_W is now a `virtualWidth` prop, defaulting to it, used in the pxPer calc and the guides commit's vertical clamp. And `view` is GONE rather than generalised — you were right that it never enters the math, and the rAF settle-loop plus the ResizeObserver catch every change by rect comparison whatever caused it. The viewport's own call sites stopped passing it.

Your measurement is in the source, not just the ticket: the docstring records that CSS zoom 0.5 and transform scale(0.5) both report a 960 rect on a 1920 element, so pxPer is identical and no branch exists. That is the sentence that stops someone adding one later.

I also carried your correction — the header now states outright that these were never tied to PanZoomViewport, that useFrameGeom measures the RENDERED rect with every transform folded in, and that a consumer with a CSS-zoomed stage and no viewport at all gets rulers by rendering the two layers over a container holding a [data-canvas-frame]. Named olina's deck as the second consumer on day one.

No demo page: both render inside the Canvas demo over its live viewport, where a drag off a ruler makes a real guide. A page of their own would have to build a canvas to show one tick — filed as a NO_DEMO ruling with that reason rather than left silent.

Verified from the published tarball, not the version doc: npm was serving 200 on version metadata while the artifact was still 404 for up to forty minutes today, which is how I briefly mis-called a propagation delay as a publish failure. Fetching the tarball is the check now.

**Remainder here:** none — kol-fxr bump kol-component to 0.203.0 and drop the private copies; virtualWidth replaces CANVAS_VIRTUAL_W, view is gone.

