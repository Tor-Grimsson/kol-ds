# SectionSplit's media frame keeps its ratio at desktop

**Staged:** 2026-10-02 · from a kol-website session
**Change:** one component — the bounded frame's classes in `SectionSplit.jsx`

---

## The problem, in one case

kolkrabbi.io's home Foundry band passes `ratio="5/4"` to `SectionSplit` with a
1200×960 image (exactly 5:4). At ≥901px the frame is not 5:4 and the image is
cropped by `object-fit: cover`. The user, 2026-10-02: *"why is this no longer
its original ratio? its squished?"*

Measured on kol-component 0.237.0 / 0.238.0 (the frame's class string is
identical in 0.162.0):

| viewport | frame as shipped | ratio | the image |
|---|---|---|---|
| 1600×950 | 696×314 | 2.22 | 1200×960 (1.25), cropped |
| 1280×800 | 546×224 | 2.44 | cropped |
| 390×844 | 350×280 | 1.25 | whole — below 901px it is correct |

The cause is in the bounded frame (`SectionSplit.jsx`, the `kol-section-split-visual`
div): it carries `w-full` **and** `min-[901px]:h-[calc(var(--kol-section-h) - 2*var(--kol-section-py))]`,
with `aspect-ratio` inline. With both dimensions fixed, `aspect-ratio` has
nothing left to decide. It was `w-auto` until `SectionSplitVisualWidth`
(kol-website 2026-08-31, ~component 0.150), which switched it to `w-full` to
fix the phone; `SectionSplitVisualHeightRemainder` (2026-09-01) then scoped the
height to ≥901px and noted "≥901 nothing moves" — but ≥901 is where the pair
now collide.

## The fix

Make `ratio` hold at ≥901px. Two measured candidates — which dimension gives is
yours to rule:

| at ≥901px | 1600×950 | 1280×800 | effect |
|---|---|---|---|
| width follows (`w-auto`, the 08-27 `SectionSplitMediaBounded` rule) | 393×314 | 280×224 | ratio holds, section height unchanged, but the media is small in a 696 / 546 column |
| height follows (`h-auto`) | 696×557 | 546×436 | ratio holds, media fills its column, the section grows past the rung (570 → 813 at 1600) |

## Rejected alternative

Leaving it to the consumer. kol-website's stopgap is
`className="min-[901px]:[&_.kol-section-split-visual]:h-auto"` on the
`SectionSplit` in `apps/web/src/components/sections/home/HomeFoundry.jsx` (the
second candidate) — a descendant selector reaching into the component, and
every other caller passing `ratio` gets the cropped frame without knowing.

## Definition of done

- [ ] at ≥901px a `SectionSplit` with `ratio` renders its frame at that ratio
- [ ] which dimension yields (rung height or column width) is ruled and written on the prop
- [ ] below 901px unchanged: `w-full` + ratio, 350×280 at 390 for `5/4`
- [ ] measured at two desktop viewport heights, not one — the rung is viewport-relative

## ADDRESSED — 2026-10-02 · kol-component@0.239.0

The width follows again from 901px: the frame is `w-full min-[901px]:w-auto`, so beside the text the rung sets the height, `ratio` sets the width and the column caps it — the first candidate. Not a new ruling: it is the 2026-08-27 `SectionSplitMediaBounded` rule already written on the `ratio` prop ("its width follows the ratio (capped at the column)"), which the 08-31 `w-full` overrode at every width when it was only meant for the stack. The prop's doc now says which dimension yields in each layout, and that a taller rung is how the media gets bigger.

Measured in the showcase's `SectionSplit` preview (`ratio="4/5"`): 251×314 at 1600×950 and 179×224 at 1280×800 — 0.80 at both, where it was 696×314 (2.22); 350×438 at 390, `w-full` + ratio, unchanged. kol-website's `h-auto` stopgap on `HomeFoundry` can go; its `5/4` frame will read 393×314 at 1600 — if that is too small in the column, the section wants a taller rung. Closes on kol-website measuring it.

## CONFIRMED from kol-website — 2026-10-03 · kol-component@0.239.0

Stopgap deleted from `HomeFoundry.jsx`; the section took `height="80"` (393×314 on the default rung was too small in the column). Measured on the built app, `ratio="5/4"`, 1200×960 image:

| viewport | frame | ratio | section |
|---|---|---|---|
| 1600×950 | 630×504 | 1.25 | 760 |
| 1440×900 | 580×464 | 1.25 | 720 |
| 1280×800 | 480×384 | 1.25 | 640 |
| 390×844 | 350×280 | 1.25 | unchanged |

Three desktop viewport heights, the ratio holds at each; nothing cropped. State left for this repo to close.

