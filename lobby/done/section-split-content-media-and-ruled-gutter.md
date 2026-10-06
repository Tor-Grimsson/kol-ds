# SectionSplit: content media sizes its own frame, and the section takes the ruled gutter

**Staged:** 2026-10-06 · from a kol-website session
**Change:** one component — `SectionSplit.jsx`: the bounded frame's height rule, and the section's horizontal padding

---

## The problem, in one case

kolkrabbi.io `/studio`, the Process band: `SectionSplit height="40" ratio="auto"` with a
`ProfileCard` (a 1:1 card with a shelf) as `media`. Measured on the built app, kol-component
0.239.1, and the same on the live site. Two defects, one component.

**1 · A content card is cut to the rung.** From 901px the bounded frame's height is the rung
minus the vertical padding (`min-[901px]:h-[calc(var(--kol-section-h) - 2*var(--kol-section-py))]`,
`overflow-hidden`). That rule is right for an image with a ratio — the width follows. For
`ratio="auto"` there is no ratio to follow, so the frame is a fixed-height window over content
that has its own height:

| viewport | frame | the card inside | what shows |
|---|---|---|---|
| 1440×900 | 621×104 | 621×621 | a 104px strip |
| 1024×768 | 425×51 | 425×425 | a 51px strip |
| 390×844 | 350×350 | 350×350 | whole (stacked: width decides) |

It has looked like this on the live site since the height rule was scoped to ≥901 (early
September); the user found it on `/studio`.

**2 · The section pads itself off the ruled gutter.** SectionSplit carries
`px-5 md:px-8 lg:px-14` on the section and the 1800 cap on an inner wrapper. Every other band on
the page sits in `.kol-page` (the ruled owner: 1800 cap, `--kol-pad-section-x` inside it), so the
Process text does not line up with the bands below it:

| viewport | Process (SectionSplit) | Services · Connect (`.kol-page`) |
|---|---|---|
| 1920 | 60 | 108 |
| 1440 | 56 | 48 |
| 1024 | 56 | 48 |
| 390 | 20 | 20 |

At 1920 the cap is outside the padding, so the padding does nothing and the text starts at the
cap's edge.

## The fix

1. **`ratio="auto"` means the media is content:** no rung-minus-padding height and no clip
   height from 901 — the frame is as tall as what it holds, still capped at the column's width.
   A ratio value keeps today's bounded rule exactly.
2. **The ruled gutter:** the section's horizontal padding is `--kol-pad-section-x` inside the
   1800 cap — the measure `.kol-page` draws (1704 of content at 1920) — so a SectionSplit lines
   up with the bands around it. `fill` keeps its edge-to-edge half.

## Rejected alternative

- A taller rung for the card (`height="full"`): fits at 1440 (644 for 621) and clips at 1920
  (824 for ~850). A rung is a height, and the card has one of its own.
- Wrapping the band in `.kol-page` and zeroing SectionSplit's padding from outside: a descendant
  override reaching into the component, at every call site.

## Definition of done

- [ ] `ratio="auto"` media renders whole at 1440×900 and 1024×768 (the `/studio` ProfileCard: 621 and 425 square)
- [ ] a frame with a ratio renders as today (home Foundry `5/4` on `height="80"`: 630×504 at 1600×950)
- [ ] a SectionSplit's text starts where `.kol-page` content starts — 108 at 1920, 48 at 1440 and 1024, 20 at 390
- [ ] `fill` unchanged

## Addressed — 2026-10-06

`ratio="auto"` media takes its own height from 901 (629×629 at 1440, 433 at 1024, 350 at 390); the gutter is `--kol-pad-section-x` inside the cap — text at 108 · 48 · 48 · 20, equal to `.kol-page` at 1920 · 1440 · 1024 · 390; 5/4 on `height="80"` still 630×504 at 1600×950; `fill` unchanged.

**Shipped 2026-10-06 in kol-component 0.240.0**, confirmed on the registry. Remainder for kol-website: bump and drop any stopgap.
