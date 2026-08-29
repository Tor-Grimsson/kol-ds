---
component: SectionSplitMediaBounded
source: kol-website/apps/web/src/components/sections/studio/StudioProcessCard.jsx#L1-L36 + components/ui/ProfileCard.jsx#L84-L120
staged: 2026-08-27
status: draft
deps: [SectionSplit, SectionHero, SectionCards]
---

# SectionSplitMediaBounded — the media half must take its size from the section, not give it

## Purpose

Studio process split, `height="40"` (0.84.0): renders identically to `60` —
and to nothing at all. The media item is a square as wide as its half
(~850px → ~850px tall), taller than any rung, so the section's `min-height`
never bites. User: *"you don't think that's a problem?"* — it is: a ladder
that only floors means every card with an image is sized by the image, not
the rung. The ladder is decorative for the one section that always carries
media.

## Ask

In `SectionSplit` (and the split hero, same anatomy) the **media half is
bounded by the section's height**, not the other way round:

- the section's `height` rung is the card's height (min-height stays for
  content-heavy text, but the media frame never exceeds it);
- the media frame gets `max-height` = the rung / the section's box, and its
  width follows (`ratio` inside that box — an `auto` ratio node like a square
  item takes the height and derives its width; a `4/5` image is letter-boxed
  into the bound, cover-fit);
- the text column stays centred beside it as today.

Result: `40` · `60` · `80` · `full` produce four different card heights with
the same media, which is what a size prop is for.

## Consumer state

Studio process split passes `height="40"` with a square `ProfileCard` item —
the reference case. Nothing changes here on return.

## ✅ RESOLUTION — 2026-08-27 · kol-component@0.85.0

The media frame takes its size from the section: every rung publishes `--kol-section-h`, the split publishes its vertical padding as `--kol-section-py`, and the frame's height is `calc(rung − 2 × padding)` with its width following `ratio` (`w-auto`, capped at the column, centred). The section's min-height stays for text-heavy columns. Measured on the Section Set at 1000 tall (4/5 media, lg padding 128): `full` → section 1000, frame 595×744 · `80` → 800, 435×544 · `60` → 600, 275×344 · `40` → frame 115×144 (the section stood at 483 because the text column is taller than 400). Four rungs, four card heights. Note the lg padding is 128 each side, so at `40` the frame is 144 tall — the rung minus the padding is what you asked for; if a low rung wants less air, that is the padding's ticket. The split hero already bounds its half by the row; nothing changed there.

**Remainder here:** none — kol-website bump kol-component 0.85.0; Studio process split at `height="40"` now renders a 40vh card with the ProfileCard sized to it.

