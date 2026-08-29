# CatalogPageCardFit — `CatalogPage` hardcodes `fit="cover"`; a rack preview needs `natural`

**Staged:** 2026-08-27 · from **kol-monitor** (seen rendering on `/` — the user's screenshot)
**Change:** kol-shell — `toCard` may return `fit`, handed to `ContentCard` (default stays `cover`)

## The problem, in one case

`CatalogPage.jsx:97` renders every card `<ContentCard variant="catalog" fit="cover" …>`.
Monitor's presets are rack screenshots, wider than the card: `cover` crops them
and the Empty 7U card shows three rails and no modules — the POWER / PERF / PATCH
row on the left is gone. The retired `GridCard` drew the same image whole
(`previewFit="compact"`: the image at 30 %, top-left), which `ContentMedia
fit="natural"` reproduces. `ContentMedia` already has the three fits; the page
just never lets a consumer pick one.

Monitor carries `.home-catalog .kol-card img { object-fit: contain }` in its
override sheet meanwhile — a layout decision in a consumer stylesheet.

## The fix

`toCard` may return `fit` (`cover | natural | compact`); `CatalogPage` passes
`fit={c.fit ?? 'cover'}` — same shape as `expanded` / `expandedContent` (0.9.0).
Per-card because one catalog can mix photographs (cover) and diagrams (natural).

## Rejected alternative

A page-level `fit` prop — cheaper, but monitor's own Library mixes module
previews and patch previews in one organism, and a page prop would force one
fit on both.

## Definition of done

kol-shell published; monitor's `toCard` returns `fit: 'natural'` and the
override rule is deleted on the bump.

## ✅ RESOLUTION — 2026-08-27 · kol-shell 0.9.2

toCard may return fit (cover default | natural | compact), handed to ContentCard per card — same shape as expanded / expandedContent. Verified in source only (no server run, by your rule).

**Remainder here:** none — kol-monitor bump kol-shell 0.9.2; return fit: 'natural' from toCard for the rack previews; drop the .home-catalog .kol-card img override.

## Correction — 2026-08-27, same day (the user's screenshots)

`natural` is NOT the fix. The retired `GridCard`'s `previewFit` was never
contain/cover — kol-theme still ships the rules: `.kol-shell-card-preview--natural img
{ transform: scale(0.5); transform-origin: top left; max-width: none }` and
`--compact` at `scale(0.3)`. The image at **50 % / 30 % of its own pixels,
anchored top-left, clipped by the box** — a rack preview reads its modules
(POWER · PERF · PATCH) at the top-left and the rest runs off the card.
`ContentMedia`'s `natural` (contain) draws the whole rack small in the middle,
which the user rejected on sight. The retirement map's line "`previewFit`
(natural/compact/cover) → `fit`" is wrong: two of the three fits do not exist
in the family.

**The ask, corrected:** (1) `ContentMedia fit` gains the two GridCard fits —
call them `scale-50` / `scale-30` or keep `natural` / `compact` and make them
mean what GridCard's did; (2) `CatalogPage` `toCard` may return `fit`. Monitor
reproduces both rules in `monitor-overrides.css` meanwhile (`.preview-natural` /
`.preview-compact` hooks on `ContentCard className`, `.home-catalog` for Home).
