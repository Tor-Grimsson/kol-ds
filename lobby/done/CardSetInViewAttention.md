# CardSetInViewAttention — the card set needs an in-view attention state on touch

**Filed:** 2026-08-31 ← **kol-website**
**Package:** `@kolkrabbi/kol-component` (+ `kol-theme` for the rules)
**Origin:** deferred out of `CardFeatureZoomScale` — *"an architecture call that binds every card kind… it wants its own ticket and the user's ruling."* This is that ticket; the user's answer is build it.

## The problem

Every card in the set expresses "attention" as `:hover`. A touch device cannot
hold hover, and the cards are anchors — a tap navigates rather than dwelling. So
on a phone the entire hover vocabulary is dead: the feature card's zoom never
fires, borders never step, media never scales.

`TiltBentoCoarseRevealInView` (0.145.0) solved this for **one** component with its
own IntersectionObserver at `rootMargin: '-45% 0px -45% 0px'`. That was right for
that ticket and is now a precedent: the mechanism works, is measured, and ships.

The second component then needed the identical thing and could not have it, so
kol-website is carrying `hooks/useMobileActiveCard.js` — the same observer, the
same root margin — to put `.is-viewing` on `.kol-card-feature`. That is a DS
behaviour living in a consumer, and any other consumer wanting a card to react on
touch will write it a third time.

## The ask

Promote the in-view attention state to the card set, so a card knows it is the one
being read without the consumer arranging it.

- Same mechanism TiltBento already ships: centre-band IntersectionObserver, one
  element active, no cross-card coordination and no shared store.
- Coarse pointers only. The fine-pointer hover path does not move.
- Whatever the state is called, it should be the hook the existing hover rules
  already use, so `:hover` and in-view resolve to one treatment rather than two
  parallel sets of rules that can drift.
- `TiltBento`'s `coarseReveal="static"` escape should have an equivalent — a wall
  of small tiles does not want one tile lighting up as it passes the centre.

## Why it is worth binding every card kind

Because the alternative is already happening: two components solved it two ways in
one evening, and one of them is in a consumer. The variance is the cost, not the
behaviour.

## Remainder here once it ships

bump; delete `hooks/useMobileActiveCard.js`, its call in `Home.jsx`, and the
`.is-viewing` block in `apps/web/src/styles/ui.css` — the last local rule in this
repo touching DS chrome.

## ✅ RESOLUTION — 2026-09-01 · kol-component@0.149.0

Promoted to the set. useInViewAttention is exported from kol-component: the centre-band IntersectionObserver TiltBento shipped in 0.145.0, carried unchanged at rootMargin -45% rather than re-derived, one element active, no cross-card coordination and no shared store. TiltBento now uses the hook instead of its private copy, and SectionCardItem stamps data-attention when it holds the centre on a coarse pointer. On your third point — that it should be the hook the existing hover rules already use — that is exactly how it landed: data-attention was added to the SAME theme rule as :hover rather than given rules of its own, so the two cannot drift. Reduced-motion opts out of both. coarseReveal='static' is the escape on both components, and SectionCards forwards it for a whole wall. Verified: fine pointer unchanged (nothing stamped at rest, hover still scales 1.03), and on touch at 390 each of the three cards is stamped and zoomed alone as it takes the centre. TiltBento re-checked after the refactor — still one card open at a time. DELETE useMobileActiveCard.js and the .is-viewing block; that behaviour is in the package now.

**Remainder here:** none — kol-website bump kol-component >=0.149.0 and kol-theme >=0.116.0; delete hooks/useMobileActiveCard.js, its call in Home.jsx, and the .is-viewing block in ui.css.

