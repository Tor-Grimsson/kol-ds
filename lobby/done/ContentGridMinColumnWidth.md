# ContentGridMinColumnWidth — grids can demand a column wider than the viewport

**Filed:** 2026-08-31 ← **kol-website**
**Package:** `@kolkrabbi/kol-component` — next to `ContentCollectionColsResponsive`
**Origin:** deferred out of the same pass — *"kol-chess hit the same class of thing at 768."* The user's answer is build it.

## The problem

A grid written as `repeat(auto-fill, minmax(<fixed>, 1fr))` demands a track of at
least `<fixed>`, whatever the container is. When the container is narrower, the
track wins: the grid overflows, and whatever scroll container is above it starts
scrolling sideways.

Measured in kol-website, `/workshop`: `minmax(22rem, 1fr)` = a 352px minimum track
inside a 302px column, so `main` — `overflow-x: auto` — scrolled 342 → 372. The
page itself never overflowed, which is why it took a container-level measurement
to find; from the outside it looks like a broken gutter, and that is precisely how
it was reported.

kol-chess reports the same class of defect at 768.

## The ask

The idiom that cannot overflow is `minmax(min(<fixed>, 100%), 1fr)` — identical
above the breakpoint, collapses to the container below it. Whatever the DS's grid
seam ends up being (`ContentCollection`'s `cols`, a documented utility, or a lint),
the guarantee wanted is: **a content grid never demands a column wider than its
container.**

Worth pairing with `ContentCollectionColsResponsive`, which already owns how many
columns there are; this is about how narrow one is allowed to get.

## Why it is worth a rule rather than a fix per site

Two repos hit it independently in one evening, and in both cases the symptom
presented as something else — a gutter problem here, a layout problem in chess.
The cost is the misdiagnosis, not the CSS.

## Remainder here once it ships

bump; swap `WorkshopIntroduction.jsx:46` and `EmbedOverview.jsx:27` onto whatever
the DS ships, replacing the local `minmax(min(22rem,100%),1fr)` fix.

## ✅ RESOLUTION — 2026-09-01 · kol-component@0.149.0

Shipped exactly the idiom you named: min and listMin now emit minmax(min(<value>, 100%), 1fr). Identical above the breakpoint, collapses to the container below it. Verified in a browser down to a 190px wall — the wall never overflows at any width, and the fluid counts are unchanged where there is room. Your diagnosis of WHY it took a container-level measurement to find is the part worth keeping: the page itself never overflowed, only the nearest overflow-x ancestor did, so from the outside it presents as a broken gutter. Same evening, kol-chess reported the same class of thing as a layout problem. That is the second time in one day a track-width defect was reported as something else. Note the sibling that shipped an hour earlier: ContentCollectionMinColumnWidth made `cols` a CEILING with a floor (minCol, defaulting to min), so the count path is guarded too — between them a wall can neither demand more than its container nor take a column narrower than the floor.

**Remainder here:** none — kol-website bump kol-component >=0.149.0; swap WorkshopIntroduction.jsx:46 and EmbedOverview.jsx:27 onto ContentCollection, replacing the local minmax(min(22rem,100%),1fr).

