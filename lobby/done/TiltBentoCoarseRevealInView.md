# TiltBentoCoarseRevealInView — on touch, reveal the card in view instead of revealing everything

**Filed:** 2026-08-31 ← **kol-website**
**Package:** `@kolkrabbi/kol-component` — `src/molecules/TiltBento.jsx`

## Today's behaviour, which is deliberate

From the component's own docs (`:69-70`):

> fine pointer, hover reveals a darkening scrim plus subtitle / description /
> CTA over an always-visible title. No-hover (coarse-pointer) devices show
> everything statically.

So on a phone every card renders fully open — title, subtitle, description and
CTA all stacked over the media at once. On kol-website's `/` that is three
full-width cards in a column, each showing its whole text block over artwork the
text then competes with.

## The ask (user, 2026-08-31)

> "these should only show title as a state, so on mobile it could just be
> whatever is in main view like featurecarditem border?"

The rest state on coarse pointers should match the fine-pointer rest state —
**title only** — and the reveal should be driven by *being the card in view*
rather than by pointer hover. One card open at a time, the way hover gives one
card open at a time.

That keeps the component's own vocabulary: the title is always visible, the scrim
and the rest reveal on "attention", and only the definition of attention changes
per input type. It also stops the artwork being permanently obscured on the
device where the artwork is largest relative to the text.

## The open choice — the DS's to make

What counts as "in view" on a coarse pointer. The obvious candidates are an
IntersectionObserver at a centred root margin (the card whose middle is nearest
the viewport centre wins) or a simple threshold with only the most-visible card
active. The consumer has no opinion; it just needs one card open at a time and
the others at title-only.

Worth confirming whether this should be the coarse-pointer default or an opt-in
prop — a wall of small bento tiles may well want today's static-open behaviour,
while a column of full-width cards clearly does not.

## Not in scope

The fine-pointer hover path is correct and should not move.

## Remainder here once it ships

bump kol-component; re-check `/` highlights on a phone — one card open, the rest
title-only.

---

## Resolution — 2026-08-31 · 🟢 closed

**Shipped: `@kolkrabbi/kol-component` 0.145.0.**

**The open choice, decided:** an IntersectionObserver with the root squeezed to
the viewport's middle band — `rootMargin: '-45% 0px -45% 0px'`. It intersects only
the element crossing the centre line, so at most one full-width card in a column
is ever active, with **no cross-card coordination and no shared store** — each
card answers for itself. A "most-visible card wins" rule needs the cards to know
about each other, which this component has no way to arrange.

**Default or opt-in: both.** `in-view` is the coarse-pointer default because that
is the reported defect; `coarseReveal="static"` restores today's behaviour for the
wall-of-small-tiles case you flagged. The fine-pointer path is untouched.

### Measured on `/components/tilt-bento`, real touch emulation at 390×844
| | |
|---|---|
| card 0 scrolled to centre | open `[0]`, crossing-centre `[0]` |
| card 1 scrolled to centre | open `[1]`, crossing-centre `[1]` |
| card 2 scrolled to centre | open `[2]`, crossing-centre `[2]` |
| fine pointer at rest | `[0,0,0,0]` — all closed, unchanged |
| fine pointer hovered | `1` — opens, unchanged |

Exactly one card open at a time, and it is always the centred one.

### Definition of done
- [x] Coarse rest state is title-only
- [x] One card open at a time, driven by being in view
- [x] The fine-pointer hover path does not move
