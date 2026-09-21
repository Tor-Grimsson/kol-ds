# ColumnBrowserMobileViews — the mobile browser is five views and a chrome, not one navigation rule

**Staged:** 2026-09-03 · from kol-r2b2
**Change:** `ColumnBrowser` (row anatomy · thumbnails · disclosure · grid) and `MediaLibraryPages` (pinned search · a tab bar below `md`).
**Follows:** [ColumnBrowserStackMode](ColumnBrowserStackMode.md) — measured at 390 today; three items hold, two defects filed there. This is the part that ticket **should have contained and didn't**.
**Wireframe — read this first:** https://claude.ai/code/artifact/085f1e65-756d-492e-9a74-73be6dbd41a7 · all five views drawn at true 390px, the row dissected proposed-vs-shipped, revised scope 1–14.
**References:** `kol-r2b2/_tmp/ref/IMG_2553` · `2554` · `2556` · `2557` · `2558` · `2559` · `2560` — iOS Files and Dropbox at 390pt.

---

## Why there is a second ticket

`ColumnBrowserStackMode` extracted **one rule** from eight reference screenshots — *one level at a
time, the back control names the parent* — and 0.195.0 built exactly that rule. It works and it
reads thin, because the rule was never what the references were.

They are **five views and a chrome that is constant across all of them.** The user's words on seeing
the result: *"kinda underwhelming… did you even look at the refs?"* He was right, and the fault is in
the spec, not the build. This ticket is the rest of what was in those screenshots.

Nothing here contradicts the first ticket. It is additive.

## 1 · The row is four zones

This is the single biggest cause of the thinness, and every list view depends on it.

| zone | width | what | shipped |
|---|---|---|---|
| 1 · disclosure | 14px | **Folders only, and its own tap target.** Tapping it expands in place; tapping the row opens. Accent-coloured in both refs. | absent — one chevron on the right does both, so there is no way to peek into a folder without leaving the one you are in |
| 2 · icon | 44 × 44, radius 5 | Folder glyph, or a **real thumbnail** for image and video | a 14px glyph in a 20px slot. `COL_ICON` maps kinds to glyphs and has no thumbnail path at all. `audio` maps to `'file'` |
| 3 · text | flex | name, then meta beneath | present, but see §2 |
| 4 · trailing | 20px | per-row overflow (Dropbox) or a status glyph (Files) | the disclosure chevron sits here instead |

Row height follows zone 2: **60px**, not the DS Table's `12px 16px` padding the build inherited —
that padding is correct for a 14px glyph and three times too airy for a 44px thumbnail. The divider
starts at zone 3's left edge, not the row edge (both refs).

## 2 · Meta is per-view, and folders have their own

`ColumnBrowserStackMode` item 5 said "rows carry a meta line (size · date)". Folders have neither,
which is why they render bare. What the references actually do:

| | folder | file |
|---|---|---|
| **list** | `date · N items` (Files 2557: `28.8.2026 - 26 items`) | `date · size` |
| **grid** | `N items` (2554: `26 items`) | `size` |

The count is the open question — see *Still to rule*.

## 3 · The five views

Drawn at 390 in the wireframe; this is the index.

| view | ref | what it is |
|---|---|---|
| **Browse · list** | 2553 | the default. Search pinned above, rows per §1, tab pill below |
| **Browse · list, expanded** | 2557 | the ruled gesture. Children directly under the open row — see D1 on the other ticket, it is currently broken |
| **Browse · grid** | 2554 | 3-up. Counts not dates; for a media bucket the thumbnail **is** the tile |
| **Viewer · media player** | 2559 | back names the parent folder, title carries `File 1 of 5` — position in the set, which the column view used to give for free. Scrubber, transport (speed · ∓15 · play · loop), bottom action sheet |
| **Viewer · image** | 2556 | full-bleed on black, chrome split left/right, filename with a disclosure for facts |

The two viewers are what a consumer currently supplies through `onQuickLook`. Worth deciding whether
they stay the consumer's or become the DS's — kol-r2b2 has no opinion, but "every repo using this set
hand-rolls its own phone viewer" is the outcome to avoid.

## 4 · The chrome, constant across every view

- **Search pinned at the top.** In every reference browse view, below the nav bar and above the list. Today it is a control inside the `ContentFilters` wall, which is a different surface.
- **`···` carries view mode and sort.** Files 2555: `Icons ✓ / List`, then `Name · Kind · Date ✓ · Size · Tags`. `ColumnBrowserStackMode` item 7 hid these below `md` and put nothing in their place; the drawer has the folder-view switch but sort is unreachable.
- **A floating tab pill at the bottom.** See below.

## 5 · The tab pill — and it answers the question the last ticket left open

`ColumnBrowserStackMode` asked, and deliberately left to the user, *"does the library wall stay
stacked under the browser on mobile?"* **Both references answer it without being asked: neither
stacks two full-height surfaces.** Each puts a floating tab pill at the bottom and gives every
surface a tab — Files: `Recents · Shared · Browse`. Dropbox: `Home · Files · Photos · Account`.

kol-r2b2 already has exactly three surfaces: the folder tree (`variant="browse"`), the
ContentFilters wall (`variant="library"`), and the kind overview. Below `md` those become
**Browse · Files · Kinds**, one at a time.

This is not cosmetic. Today the wall renders as an empty filter bar with a layout toggle under a
folder list — two surfaces sharing one scroll, and the second one has nothing in it because the
first one is what you are looking at. **User-ruled 2026-09-03.**

Above `md` the stack is untouched — the 2026-08-26 one-view ruling stands.

## Scope

| # | change | owner |
|---|---|---|
| 10 | Thumbnails at 44 × 44 for image and video | `ColumnBrowser` |
| 11 | Disclosure as its own zone and its own tap target | `ColumnBrowser` |
| 12 | Row anatomy per §1 — four zones, 60px, divider from zone 3 | `ColumnBrowser` |
| 13 | Folder meta `date · N items`; grid meta `N items` | `ColumnBrowser` |
| 14 | Grid view below `md` | `ColumnBrowser` |
| 15 | Search pinned above the list; `···` carrying view mode + sort | `MediaLibraryBrowse` |
| 16 | Tab pill `Browse · Files · Kinds` below `md` | `MediaLibraryPages` |

## Still to rule — do not assume these

1. **Where thumbnails come from.** R2 and B2 serve **originals**; there is no variant set on R2, and in-browser transforms are a kol-r2b2 `ARCHITECTURE §N` non-goal. A 44px thumbnail that downloads a 2 MB JPEG is a different problem than a missing `<img>`. kol-r2b2's current mitigation for its grids is `loading="lazy"` on the original, and for the B2 website bucket a resolution-set grouping that picks the smallest variant (718 KB → 27 KB). Cloudflare Image Resizing is paid and parked with a trigger — **this may be that trigger**, and it is the user's call, not the DS's.
2. **Item counts — computed or passed?** Counting `objects` by prefix is O(n) per folder, and kol-r2b2 runs 3443 objects in one bucket. That repo already passes a baked `folderTree` carrying files and bytes per folder (it is how the root line reads `3443 files · 5.02 GB`). This looks like a **seam**, not a computation. Decide before building one.
3. **Do the two viewers become the DS's?** They are the consumer's today via `onQuickLook`.

## Rejected alternative

*Fold all of this into `ColumnBrowserStackMode` as a revision.* Rejected: that ticket has a build
against it and two live defects, and the fix for those should not wait behind a seven-item design
scope. It closes on its defects; this one carries the views.

## Definition of done

- [ ] the four-zone row at 60px, with thumbnails and a separate disclosure target
- [ ] folder meta and grid meta per §2
- [ ] grid view below `md`
- [ ] search pinned; `···` carrying view mode and sort
- [ ] the tab pill, with the desktop stack untouched
- [ ] the three rulings above answered by the user before anything is designed around them
- [ ] verified at 390 × 844 on a device — kol-r2b2 will measure, as it did for the first ticket

---

## PROGRESS — 2026-09-03 · the five items that needed no ruling · kol-component 0.204.0 · kol-theme 0.143.0

Your three "still to rule" items are the user's and are NOT assumed. Two of
them turn into seams rather than decisions, which is what the ticket itself
argues for — so the build does not wait on them and does not presume them.

| # | state | what shipped |
|---|---|---|
| **12 · the four-zone row** | **done** | disclosure 14 · icon 44×44 r5 · text · trailing 20, at **60px** — the height follows zone 2, and the DS Table's `12px 16px` is gone from this row (right for a 14px glyph, three times too airy for a thumbnail). The divider starts at **zone 3's left edge, 74px in**, as both references draw it — a pseudo-element on the sibling boundary, which is why it is theme CSS |
| **11 · disclosure as its own target** | **done** | the chevron expands in place, the ROW opens the folder, accent-coloured. One control doing both is exactly what left no way to peek into a folder without leaving the one you are in |
| **10 · thumbnails** | **seam, not a decision** | `thumbnailFor(o) => node` fills the 44px box; null falls back to the kind glyph. WHERE it comes from is yours and it is not free — R2 and B2 serve originals, so a 44px tile can mean a 2 MB download. Your lazy-original and resolution-set mitigations, and whether image resizing gets bought, stay your calls |
| **13 · folder + grid meta** | **seam, not a computation** | `folderMeta(prefix, view) => string`. You are right that counting by prefix is O(n) per folder against 3443 objects and that you already hold a baked tree with files and bytes. The DS does not count; it asks |
| **14 · grid below `md`** | **done** | `stackView="grid"` — 3-up tiles, square boxes, the thumbnail IS the tile. **Flat, no inline expand**: a grid has nowhere to put a child list, which is why both references drop disclosure there and navigate by tap. Counts and sizes, never dates |

**Not built, and why:** items 15 and 16 are `MediaLibraryBrowse` / `MediaLibraryPages`
work. 16 (the tab pill) is user-ruled in your §5 and it also answers the
library-wall question the first ticket held — but it re-shapes a page's whole
navigation below `md`, and I would rather land it against the row work you have
measured than stack two unmeasured changes. Say the word and it is next; nothing
about it is unclear.

**Still yours to rule, untouched:** where thumbnails come from · counts computed
or passed · whether the two viewers become the DS's.

Verified from the published tarballs, not the version docs — npm served 200 on
version metadata today while the artifact was still 404 for up to forty minutes,
which is worth knowing before you trust a publish.

---

## ↩ THE SEAMS DO NOT REACH THE PAGE — 2026-09-04 · found on 0.207.0

Bumped to component **0.207.0** / theme **0.145.0** / icons **0.27.0** here. Items 11, 12 and 14 are
in the source and the build is green. **But neither seam is reachable from a consumer**, so items 10
and 13 render as if they had never shipped.

`thumbnailFor` and `folderMeta` are props of `ColumnBrowser` (`:369–370`, documented at `:74–75`).
`MediaLibraryBrowse` neither accepts them nor passes them on:

```
MediaLibraryPages.jsx — MediaLibraryBrowse({ client, title, bucket, onBucketChange, prefix,
  onPrefix, defaults, settings, onSettingsChange, folderTree, headerActions, refreshKey,
  onOpen, autoFocus, settingsFooter, className })          ← no thumbnailFor, no folderMeta

  <ColumnBrowser autoFocus className height onHeightChange columnWidths onColumnResize
                 objects prefix onPrefix … />                ← neither is forwarded
```

The only way in is to render `ColumnBrowser` directly. kol-r2b2 renders `MediaLibrary
variant="browse"` (the 2026-08-27 `MediaLibraryPages` adoption), as does every consumer of the page,
so in practice **there is nowhere to hand you a thumbnail or a folder count.** Folders show no meta
and files show no thumbnail on the deployed build right now.

**This is the same shape as `settingsFooter` in `BrowsePageRulingsAndSeams`** — `SettingsPanel`
documented a `footer` slot and `MediaLibraryPages:232` hardcoded past it. Worth a sweep of the page's
prop list rather than a third one-off: a seam a consumer cannot reach is not a seam.

**Asked for:** `thumbnailFor` and `folderMeta` in `MediaLibraryBrowse`'s signature, forwarded to
`<ColumnBrowser>`. Two words in each place. Nothing else about the seams needs to change — their
shape is right, and the reasoning for making them seams rather than computations still holds.

Not blocking items 15 and 16; this is separate from the tab pill.

## ✅ RESOLUTION — 2026-09-04 · @kolkrabbi/kol-component@0.213.0

All seven items. 10-14 shipped in 0.204.0/0.207.0 (four-zone row, thumbnails, disclosure as its own target, folder + grid meta, grid view) — with items 10 and 13 shipped-but-UNREACHABLE until 0.209.0, because MediaLibraryBrowse never forwarded thumbnailFor or folderMeta and the props gate stayed green while the deployed build rendered as if neither existed. Item 15: search pinned above the list below md, filtering the KEY SPACE so the tree still navigates and no flat results view had to be minted; a ··· carrying the stack view and the sort keys, tapping the active key flipping direction. Sort was unreachable on a phone since item 7 hid the desktop cluster. Item 16: MobileTabBar, the floating bottom pill — what a tab MEANS is the consumer's, so it ships the shape and takes a list rather than the DS deciding a media library has three surfaces; TABBAR_H is published so a list does not hardcode the room it owes. Both pages take tabs/activeTab/onTabChange, and above md nothing renders. Two seams it forced: MenuItem caret (an icon trigger is complete without one) and sortObjects as a pure module function, where name is the tiebreak in every mode so equal sizes do not reshuffle between renders. The three 'still to rule' items were never assumed — two became seams (thumbnailFor, folderMeta) and the viewers stayed the consumer's.

**Remainder here:** none — kol-r2b2 bump and measure at 390 — wire tabs to your three surfaces.

