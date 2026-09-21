# StackModeChromeAndAncestors — three things measured on the live page at 390

**Staged:** 2026-09-04 · from kol-r2b2
**Change:** `ColumnBrowser` stack mode — drop the frame, stop rendering the ancestor chain, fill the icon box.
**Follows:** `ColumnBrowserStackMode` · `ColumnBrowserMobileViews`. **Item 1 below is a defect in MY spec, not in your build** — read that section first.
**Measured:** Playwright, deployed `media.kolkrabbi.io`, 390 × 844, component 0.209.0. Numbers are `getComputedStyle` / `getBoundingClientRect`, not eyeballed.

---

## What is right, so it does not get touched

Verified before anything else, because three of these came out of the last two tickets and they hold:

```
row height          60px           (spec: 60)          ✓
zones               disclose 14 · thumb 44 · text 174 · trailing 20   ✓
divider             left: 74px     (spec: from zone 3) ✓
indent              16 / 36 / 56px per depth           ✓
grid                3 cols @ 102.7px, tiles 103×137, thumbs fill the box   ✓
meta                folders "415 items" · files "389.1 KB · 19.6.2026"     ✓
horizontal scroll   none                               ✓
```

The four-zone row and the grid are correct. What follows is chrome around them.

## 1 · The ancestor chain is rendered as rows — and that is my spec's fault

At `#` (bucket root, one level deep) the list is **14 rows, and the first two are `KOL-R2B2` and
`R2 · kol-media`** — the path, repeated as content. Both carry `is-selected`, so both paint
`fg-04`. That is 120px of an 844px viewport spent restating the breadcrumb directly above them,
which already reads `KOL-R2B2 / R2 · KOL-MEDIA`. Same in grid: tiles 1 and 2 are the ancestors.

**Neither reference does this.** iOS Files 2557 — the case the inline-expand ruling came from — is
*inside* a folder: the nav bar names it, the list is its children, and there is no ancestor row and
no parent-of-parent row. Expansion happens **within the current level's list**: sibling,
sibling ▾ + its children indented, next sibling. The chain never appears.

**Why you built it this way is on me.** `ColumnBrowserStackMode` said, in the same table:

- item 1 — *"One full-width column, no x-scroll. Ancestors are reached by back, not by a scroll nobody can see."*
- the ruling — *"inline expand, capped at three levels of indent, falling through to push below that."*

Those two fight. Reaching ancestors by back means they are **not** on screen; a three-level indent
cap implies they are. You resolved it by rendering the chain, which is a defensible reading of a
spec that contradicted itself. My wireframe drew it the other way and I never checked the build
against my own drawing — View 2 shows a back pill, a path line, then straight into contents.

**The ruling, corrected and singular:** the list renders **the current level's contents only**.
Expanding a folder splices its children under it, indented, still inside that list. Ancestors are
reached by the back control and named there. Nothing above the current level is ever a row.

That also fixes the indent: with the chain gone, depth restarts at the current level and rows sit at
`padding-left: 16` instead of 56, which is where the references put them.

## 2 · The stack root still wears the desktop frame

```
.kol-column-browser  border: 1px solid  ·  border-radius: 4px  ·  width 358
```

The column browser is a bordered box on desktop because it is a *pane* — a thing with edges, sitting
in a page. The stack view is not a pane, it is the page's content. Neither reference has a frame:
rows run to the padding and the only line is the divider between them.

The 358 width is ours (our own page padding at this breakpoint) and matches the references, so leave
that alone — it is the **border and the radius** that should not be there below `md`.

## 3 · The folder glyph is 12px inside a correct 44px box

```
folder row:  .kol-column-browser-thumb = 44px   ·   <svg> inside = 12px
file row:    .kol-column-browser-thumb = 44px   ·   <img> inside = 44px
```

The box is right; the glyph is a quarter of it. So a list of folders and files has a ragged icon
column — thumbnails filling their square, folder marks floating in the middle of theirs. In both
references the folder icon **fills its box** at the same size as a file's thumbnail, which is what
makes the column read as one rail.

Grid is already correct here (`tile-box` 103, thumb 103), so this is the list only.

## Definition of done

- [ ] the stack list renders the current level's contents only — no ancestor rows, no ancestor tiles
- [ ] no border and no radius on `.kol-column-browser` below `md`
- [ ] the folder glyph fills its 44px box in the list, as it already does in the grid
- [ ] re-measured at 390 × 844 by kol-r2b2 — I have Playwright on the deployed site now and will do this myself rather than shipping and asking

## 4 · The wordmark wraps at 390 — added after re-measuring

```
LibraryHeader title  "KOL-R2B2"
  font-size 36px · line-height 36px · white-space: normal
  box 48px wide · 72px tall  →  TWO LINES ("KOL-" / "R2B2")
```

The title's box is squeezed to 48px by the bucket dropdown and the action icons beside it, and at
36px the word cannot fit, so it breaks mid-token. Neither reference wraps its title: Files centres a
short one in the nav bar, Dropbox drops it entirely and puts the folder name in the page body.

Related, and the reason this surfaced: **the header has no give at 390.** I added one control to
`headerActions` and it pushed the gear off the right edge entirely. That is fixed on my side by
swapping the kind-overview button for the view toggle below `md` rather than showing both — but a
row that breaks when a consumer adds a single icon to the slot built for consumer icons is worth a
look. The references solve it by putting almost nothing in the bar: a back control, a title, and one
`···`.

**Asked for:** below `md`, the title takes the width it needs and does not wrap — shrink it, truncate
it, or drop it as Dropbox does. And a note on `headerActions` about what the slot can actually hold
at 390, so the next consumer does not find out the way I did.

## Measured after my own fixes — 2026-09-04, deployed

```
grid          3 × 102.7px, tiles 103 × 137, thumbs fill the box    ✓
list          14 rows, 60px, zones 14/44/174/20                     ✓
toggle        LIST | GRID present, icon renders, switches modes     ✓
header        no control overflows 390, no empty icon frames        ✓
document      scrollWidth 390 = viewport, no horizontal scroll      ✓
```

Everything above is the consumer half working. Items 1–4 are what remains, all yours.

## ✅ RESOLUTION — 2026-09-04 · @kolkrabbi/kol-component@0.211.0

All four. The ancestor chain was structural, not a spec contradiction: NAVIGATING and EXPANDING were both `onPrefix`, so the walk began at the true root and every ancestor became a row. They come apart — the ROW re-bases the list, the CHEVRON expands from local state that clears on level change, which is what item 11 always said the two tap targets were for. Depth restarts at the current level, so rows sit at 16. Border and radius dropped below md. Glyph and box now share one ZONE_BOX constant. The header's fixed w-48 dropdown was the real cost of the title wrap — it is md: now and the title truncates; `headerActions` documents that it holds about one consumer icon at 390, naming the swap-below-md pattern. Correction recorded: the 12px glyph reported was the disclosure chevron, 12 by spec — the zone-2 glyph was 20 in a 44 box, so the ragged rail was real and the number was not. Re-measured at 390 by kol-r2b2 on the deployed build: ancestor rows gone, 10 rows, indent 16, 0 fills, border 0, glyph 44, wordmark one line, no horizontal scroll.

**Remainder here:** none — kol-r2b2 none — re-measured on the deployed build.

