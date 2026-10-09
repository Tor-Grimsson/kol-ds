# The title-root count line draws the row-size slider on a phone, where it does nothing

**Staged:** 2026-10-09 · from a kol-website session (user's iPhone, screenshot)
**Change:** one condition in `MediaLibraryPages.jsx`

---

## The problem, in one case

media.kolkrabbi.io on an iPhone, at the multi-bucket root (`KOL-R2B2 · all`): under the three bucket
rows sits a bare slider. Dragging it changes nothing.

- `MediaLibraryPages.jsx` ~2596, the `atTitleRoot && !single` branch: the count `<p>` carries
  `hidden={!showCount}` (off on a phone — `countLine: 'auto'`, `:1820`), but
  `{isWall ? sizeSlider : rowSlider}` beside it renders unconditionally.
- On a phone the browser is the stack, and `rowSize` is **desktop-only** — `ColumnBrowser.jsx:553`
  ("the desktop rows' step on the control ramp"), passed only at `:1049` / `:1068`. So the row slider
  has nothing to scale.
- Inside a bucket the tree branch draws no slider (`showCount && <p>` only), so only the title root
  shows it. Measured: iPhone 13 emulation at the bucket level shows none.

## The fix

Draw the row slider only where `rowSize` reaches something: not on a phone (`phone` / `!md`). The
tile-size slider in the wall is a separate question — it does scale the grid on a phone, so leave
it, unless you judge the phone grid should not offer it either.

## Done when

At the title root on a phone no slider renders; on a desk it still does and still steps the rows.
kol-website has nothing to change — it consumes on the next bump.

---

## Resolution — 2026-10-09 · 🟢 closed

**Shipped `@kolkrabbi/kol-component@0.250.0`.** `MediaLibraryPages.jsx` title-root branch: `{isWall ? sizeSlider : !phone && rowSlider}` — the row
slider draws only where `rowSize` reaches the desktop rows. The grid's tile slider stays on a phone
(it does scale the grid). Syntax gate clean.

For kol-website: bump kol-component to ^0.250.0, redeploy media, check the title root on a phone.
