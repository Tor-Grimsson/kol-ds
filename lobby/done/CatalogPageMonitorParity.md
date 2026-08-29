# CatalogPageMonitorParity — GridCard's real preview fits, and the 2×2 hides its neighbours

**Staged:** 2026-08-27 · from **kol-monitor** (the user's screenshots; supersedes `CatalogPageCardFit`'s `natural` answer)
**Change:** kol-component `ContentMedia` — two fits; kol-shell `CatalogPage` — neighbour hiding on expand

## The problem, in two cases

**1. `natural` was the wrong answer to `CatalogPageCardFit`.** The retired
`GridCard`'s fits were never contain/cover — kol-theme still ships the rules:
`.kol-shell-card-preview--natural img { max-width: none; transform: scale(0.5);
transform-origin: top left }` and `--compact` at `scale(0.3)`. The image at
**50 % / 30 % of its own pixels, anchored top-left, clipped by the box** — a
rack preview reads its modules (POWER · PERF · PATCH) at the top-left and the
rest of the rack runs off the card. `ContentMedia natural` (contain) draws the
whole rack small in the middle; the user rejected it on sight against the
original. The retirement map's line "`previewFit` (natural/compact/cover) →
`fit`" is false — two of the three fits do not exist in the family. Monitor
reproduces both rules in `monitor-overrides.css` meanwhile.

**2. A 2×2 expanded card must hide its three neighbours.** `ContentCard
expanded` spans 2×2 (0.72.0); `CatalogPage` (0.9.0) passes it through — but
renders every row, so the grid REFLOWS around the expanded card and every card
after it moves. The shipped behaviour (monitor's `computeHiddenSet`: the cell
to the right, the two beneath, skipped) keeps the grid still. The DS note
"neighbour-hiding stays consumer-side" cannot hold on `CatalogPage`: the
consumer never sees the filtered row order the organism renders, so it cannot
compute which neighbours to hide. Monitor's Library stays off `CatalogPage`
for this alone.

## The fix

1. `ContentMedia fit` gains the two fits as GridCard drew them (`scale-50` /
   `scale-30`, or make `natural` / `compact` mean that — the family has no
   consumer on today's contain meaning yet). `CatalogPage` passes them through
   `toCard` as it already does.
2. `CatalogPage`: when a row's card is `expanded`, skip the three neighbours
   in its own render — index `i`: `i+1`, `i+cols`, `i+cols+1` within the same
   2×2 block (monitor's `computeHiddenSet` for the 6-column grid, verbatim).

## Rejected alternative

`toCard` returning `hidden` — the consumer cannot know the filtered index.

## Definition of done

Both published; monitor deletes the `.preview-*` / `.home-catalog` override
rules and moves Library onto `CatalogPage`.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.108.0 · kol-shell 0.10.0

(1) ContentMedia fit natural / compact ARE GridCard's fits now — the image at 50 % / 30 % of its pixels, top-left, clipped (the theme rules verbatim); contain is gone, no consumer was on it. (2) CatalogPage skips the expanded card's three neighbours in its own render — your computeHiddenSet for the 6-column grid, verbatim. Verified in source only (no server run, by your rule).

**Remainder here:** none — kol-monitor bump kol-component 0.108.0 · kol-shell 0.10.0; toCard returns fit: 'natural' (or 'compact') + expanded / expandedContent; delete the .preview-* / .home-catalog override rules and computeHiddenSet; move Library onto CatalogPage.

