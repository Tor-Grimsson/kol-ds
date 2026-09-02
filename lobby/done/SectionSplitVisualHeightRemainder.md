# SectionSplitVisualHeightRemainder — the stacked split gives its media whatever the text leaves

**Filed:** 2026-09-01 ← **kol-website**
**Package:** `@kolkrabbi/kol-component` — `SectionSplit`
**Origin:** user's mobile review of `/studio`, reported as *"the about card crops its graphic — the portrait renders as a letterbox strip, cutting the face."* The card is innocent.

## The problem

Measured on production `/studio`, iPhone 13 emulation, **390×700**:

```
.kol-section-split-visual        height 117px   overflow: hidden
  … five ancestors …            each  350×350
  ProfileCard's square           350×350   (img 350×350, object-fit: cover, source 1200×720)

parent (the split's own grid)
  display              grid
  height               555px          ← FIXED
  grid-template-rows   390px 117px    ← text row, then the REMAINDER
  align-items          center
```

The stacked split is a fixed-height grid. The text row sizes to its content and takes **390 of
the 555**; the visual row receives the **117 that is left** and clips a 350px card inside it.

So the media column's height is a function of how much text sits above it. A longer paragraph
crushes the image further, and `overflow: hidden` means the loss is silent — the card is fully
laid out at its correct 350×350, it is simply not visible below 117px. The user sees a letterbox
strip through the eyes of the portrait and reports it as a crop, which is why it reads as a
`ProfileCard` bug and is not one.

Nothing in the consumer's chain sets a height: five ancestors are all 350×350 and the clip
happens at the DS boundary.

## Why it is the same class as `SectionSplitVisualWidth`

That ticket (component 0.145.0) fixed the WIDTH of this element and reproduced only at short
viewports — 700 and 667, never 844. This is the height counterpart and it reproduces at 700 for
the same reason: browser chrome puts a real phone in that band, and the fixed rung is what makes
the remainder small enough to bite.

## The ask

On the stacked (single-column) layout the media should not be the remainder of a fixed rung.
Either the rung stops applying once the split stacks and the section grows to its content, or the
media row gets a floor of its own so the text takes the remainder instead. Which way is yours —
the guarantee wanted is: **stacking a split never silently clips its media.**

If the fixed rung is deliberate on mobile, then the media row needs `min-height` and the text row
the flexible one; `overflow: hidden` on a row that can be starved is what makes this invisible in
review.

## Remainder here once it ships

bump; re-check `/studio` at 390×700 — the about card visible at its full square, face not cut.

## ✅ RESOLUTION — 2026-09-01 · kol-component@0.150.0

The rung stops at the stack. The bounded-frame height (rung − 2×py) is a two-column ruling and now applies at min-[901px] only; stacked, the frame is w-full + ratio — width decides, height follows, media never clips. The 117 was not a grid remainder but the calc itself: rung 40 at a 700-tall phone = 35svh − 8rem = 117, which is also why 844-tall tests passed. overflow-hidden stays — it can no longer starve.

**Remainder here:** none — kol-website bump kol-component@0.150.0; re-check /studio at 390×700 — the about card at its full square, face not cut.

