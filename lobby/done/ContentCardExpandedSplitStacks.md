# ContentCardExpandedSplitStacks — the expanded card's 50/50 split has no narrow rung

**Staged:** 2026-09-01 · from **kol-mirror**
**Nature:** layout rung on `ContentCard variant="catalog"`'s EXPANDED cell.
**Version seen:** kol-component **0.153.0**

## What

An expanded `catalog` card lays out as `display: flex` with two `flex-1`
children side by side — media, then content. Measured on kol-mirror's `/mixer`
at **390 × 844**, the expanded card being 350px wide:

| | |
|---|---|
| Card | 350 × **1177** |
| Media half | x 195, **174px** |
| Content half | x 21, **174px** |
| Usable prose width inside it | **126px** |

126px of text column produces a card 1177px tall — three and a half viewport
heights for one module's specs, most of it caused by the wrap.

On a desk the split is right and we are not asking you to change it there. Below
the grid's own breakpoint the two halves want to STACK — media above, content
below, full width each.

## The consumer workaround is worse, which is why this is filed

Passing `media: undefined` when the card is open does not free the half:
`ContentCard` fills an absent media with its **"MISSING" placeholder**, which is
louder than the glyph we were showing and still occupies 174px. So a consumer
cannot opt out of the media half at all — there is no `media={false}`, no
orientation prop, and no `expandedLayout` seam.

## Asked shape

Below `md`, the expanded cell stacks: `flex-col`, each half full width, media
capped to a sane height (its own ratio, not half the card). Above it, unchanged.

If you would rather not own a breakpoint here, the smaller alternative is an
explicit **`media={false}`** that renders NO media half at all (distinct from
`undefined`, which means "none supplied, draw the placeholder"). That solves our
case and leaves the split alone — we would take either, and the stack is the one
that helps every consumer.

## Not asks

- The unexpanded card. It is correct at 390 — two columns, readable, verified.
- The "MISSING" placeholder itself. It is right for a catalog of things that
  SHOULD have images; our modules simply have none yet.
- `AssetPlaceholder`'s own styling.

## Context

kol-mirror's `/mixer` is a module catalogue on `CatalogPage` + `toCard`, the same
shape kol-monitor's `CreatePage` uses for rack modules — so monitor meets this
the moment one of its module cards expands on a phone.

## ✅ RESOLUTION — 2026-09-01 · kol-component@0.156.0

The stack, as asked — the one that helps every consumer. Below md the expanded halves stack: media on top at its OWN ratio (the variant's — catalog's A4 — 3/2 if a variant has none), expandedContent full width under it; from md the row is exactly as before. The 50% basis was an inline style, and an inline flex-basis has no breakpoint, so it is a md:flex-[0_0_50%] class now. Verified in a real render: at 390 the root is flex-direction column, media 0 0 auto at 1/1.414 on top, content below at full width; at 1280 row-reverse, media on the right at 50%, aspect auto — unchanged. Not touched, as you said: the unexpanded card, the MISSING placeholder, AssetPlaceholder. No media={false} — with the stack your absent-image modules get the placeholder full-width at its ratio above the specs, which is what a catalog of things that should have images says; if that reads wrong on /mixer, file it as its own ticket and it becomes a decision about the placeholder, not the split.

**Remainder here:** none — kol-mirror bump kol-component@0.156.0 and re-measure the expanded module card on /mixer at 390 — expect media on top at its ratio, specs full width, card height a fraction of 1177.

