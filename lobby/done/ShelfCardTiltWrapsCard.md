---
component: ShelfCardTiltWrapsCard
source: kol-content/src/ParallaxShelf.jsx#L164-L188 (the `card()` default branch)
staged: 2026-08-27
status: draft
deps: [ParallaxShelf, ContentCard, TiltCard, useTilt]
---

# ShelfCardTiltWrapsCard — the shelf's tilt is inside the card's own clip box, so it reads as no tilt

`ShelfCardMotion` (kol-content 0.12.0) put `tilt` in the **media slot**. On
kol-website `/work` the shelf reads as **not tilting at all** — the user's own
call: *"it does but is clipped by some mask container"*. He is right, and the
retired `WorkCard` did it the other way round.

## Why the media slot cannot work

`ParallaxShelf.jsx:168` puts `TiltCard grounded` in `ContentCard work`'s `media`.
That node then sits under **two** clip boxes it cannot escape:

| # | element | why it clips |
|---|---|---|
| 1 | `ContentMedia` root | `overflow-hidden`, unconditional — `ContentMedia.jsx:122` |
| 2 | `ContentCard` root | `overflow-hidden` twice over — `drawer` layout **and** `framed` (work's `border: fg-04`) — `ContentCard.jsx:306` |

So the frame, its border and its radius stay **static** while only the artwork
leans inside them. At the grounded ±2.5° the image foreshortens ~1.6% at the top
edge — a couple of px of card ground appearing under a rectangle that never
moves. The retired `WorkCard` put `TiltCard` at the **card root** carrying the
border itself (`kol-content/src/WorkCard.jsx:118-123` — `className="w-full
h-full rounded-[4px] border border-fg-04"`), so the whole card leaned. That is
the motion the ticket meant to preserve and it is the one that got lost.

## Second defect, same cause — `zoom` is dead on the shelf

`MEDIA.work` sets `zoom: true`, and the rule is a **direct-child** selector:
`.kol-media-zoom > img` (kol-theme `kol-components-molecules.css:1112`). With
`TiltCard` in the slot the `<img>` is two levels down, so the work card's hover
zoom has silently done nothing on the shelf since 0.12.0. Put the plain `<img>`
back in the media slot and it works again for free.

## The ask

**`tilt` wraps the card, not the image** — and with the existing hook, not a new
component. `useTilt` is already exported (`kol-component/src/index.js:173`) and
is already "the ONE tilt hook"; `ParallaxShelf` already renders its own
transform wrapper (`ShelfEnter`'s inner div, `ParallaxShelf.jsx:34-46`). So:

- the `media` slot goes back to `<img src alt="" loading="lazy" />` — `zoom` lives again
- the tilt rides the wrapper `ShelfEnter` already owns (or a sibling wrapper when `enter={false}`), so the card's border and radius lean with the artwork

**No new component.** kol-website has just retired its `TiltCard` / `BentoCard`
/ `useTilt` forks onto the 0.110.0 Tilt family (`TiltFamilyForks`); adding a
fourth tilting thing here would re-open exactly what that ruling closed.

The grounded feel is the value to keep — zone-snapped to 3, ±2.5°, lazy spring
250/25/0.6, `transform-origin: center bottom`, `Math.min(0, …)` so it only ever
tilts back (`TiltCard.jsx` `TiltCardInner`). Whether that math is lifted out of
`TiltCardInner` so both callers share it, or `ParallaxShelf` composes `useTilt`
and repeats the ~8 lines, is the DS's call — the constraint is only that no new
public component appears.

## Definition of done

- [ ] a shelf card leans **with its border and radius**, not inside them
- [ ] the work card's hover zoom is measurable on the shelf again
- [ ] `tilt={false}` still renders a plain card; coarse pointer / reduced motion unchanged
- [ ] no new exported component in the Tilt family

## ✅ RESOLUTION — 2026-08-27 · kol-content 0.13.0 · kol-component 0.113.0

The tilt wraps the CARD: `ParallaxShelf` puts the whole `ContentCard work` in a `useTilt({ grounded: true })` motion wrapper (inside `ShelfEnter`, or alone when `enter={false}`), so border and radius lean with the artwork; a plain `<img>` is back in the media slot so `.kol-media-zoom > img` fires again. The grounded math (3 zones, ±2.5°, lazy spring 250/25/0.6, `min(0, …)`, `center bottom`) lifted out of `TiltCardInner` into the one hook — `TiltCard grounded` renders identically. No new component. `tilt={false}`, coarse pointer and reduced motion render the plain card. **kol-content now peers `framer-motion` ^12** (the site has it). 21 gates clean; verified in source only.

**Remainder here:** none — kol-website: bump kol-content 0.13.0 · kol-component 0.113.0; measure the lean (border moves) and the zoom on `/work`'s shelf.
