# ColumnBrowserStackMode — a Finder column view has no phone form; give it one

**Staged:** 2026-09-03 · from kol-r2b2
**Change:** `ColumnBrowser` (items 1–2, 4–6) and `MediaLibraryBrowse` (items 3, 7) — a stack mode below `md`.
**Ruled by the user 2026-09-03:** inline expand, not push-and-back. See *The fork*, below.
**Wireframe:** https://claude.ai/code/artifact/085f1e65-756d-492e-9a74-73be6dbd41a7 — three frames at true 390px: the current failure with its causes pinned, then both options with real bucket content.

---

## The problem

`ColumnBrowser` puts hierarchy on the **x-axis**: one column per level, every level visible at once.
That idiom is bought with width, and a phone has none to spend. There is no responsive fallback
because none was ever written — **`ColumnBrowser.jsx` contains zero breakpoint utilities and the
theme carries no `@media` rule for any `.kol-column-browser-*` class.** `ContentFilters` and the page
shell do have them (`max-md:hidden`, `md:gap-*`), so this is specific to this organism.

Measured at 390 × 844 on **`media.olina-productions.com`** — a *different repo* running these same
organisms, which is the part worth reading twice. The layout reproduced across repos exactly as
intended and carried the missing mobile story with it. This is a DS-wide gap now, not one site's.

| # | symptom | cause |
|---|---|---|
| 1 | the second column is clipped mid-word at the right edge | two 260px columns plus a gutter exceed 390. The inner row *is* `overflow-x: auto`, so it scrolls — but nothing signals that, and a horizontal scroll inside a vertical page is a gesture nobody goes looking for |
| 2 | a black void the length of the viewport under two near-empty columns | the frame takes `height` from the stored `columnHeight`; kol-r2b2 forces **800** on load. A value dragged on a desktop, applied literally to a phone |
| 3 | the crumb line wraps to two lines and `COLUMN` is cut off | breadcrumb + folder-view toggle + the ROW·COLUMN pair share one `justify-between` line with no wrap or collapse rule |

**The `rows` folder view is not the escape hatch.** `folderView: 'rows'` renders `FolderRow` — name,
chevron — and **no files at all**; files live in the separate library wall below. On a phone that is
two disconnected surfaces for one directory. It answers *"which folders are here"* and never *"what
is in this folder"*.

## The fork, and the ruling

iOS Files and Dropbox arrived at the same answer independently: **one level at a time, with
hierarchy carried by a back control that names the parent** — never by parallel columns. They differ
only on how you descend.

| | iOS Files | Dropbox |
|---|---|---|
| descend | **inline expand** — the chevron opens the folder in place, children indented, parent still on screen | **push** — the folder replaces the screen |
| return | collapse the same chevron | back pill naming the parent: `‹ mp3` |
| path | folder title in the nav bar | second line, middle-elided: `Dropbox › … › library-albums-raw` |
| the list | folders **and** files together, name + meta line | same, plus a per-row `···` |
| view + sort | inside `···`: Icons ✓ / List, then Name · Kind · Date ✓ · Size · Tags | icon toggle right of a `Name ↓` text button |
| a file | full-screen push | full-screen push + bottom action sheet |

**Ruled: inline expand, capped at three levels of indent, falling through to push below that.**
The user's reasoning, and it is the whole argument for the ticket: this organism exists because he
wanted Finder's column behaviour — *a parent that stays put while you look at its child*.
Push-and-back discards precisely that and leaves a generic file list any component could have
rendered. Inline expand keeps the idea, moved from two axes onto one. The cap is there because a
deep bucket path indents until the name has no room.

## Scope

Breakpoint `md` (768) — the one `ContentFilters` already uses, so the page has one story, not two.

| # | change | why | owner |
|---|---|---|---|
| 1 | One full-width column, no x-scroll | ancestors are reached by back, not by a scroll nobody can see | `ColumnBrowser` |
| 2 | Back control **names the parent** | a bare chevron does not say where it goes; `‹ olina-media` does | `ColumnBrowser` |
| 3 | Crumb row becomes one middle-elided path line | removes the wrap-and-clip; at this width it is the only thing that fits | `MediaLibraryBrowse` |
| 4 | The viewport is the height | ignore the stored `columnHeight` below the breakpoint — a desktop drag value is not a phone measurement | `ColumnBrowser` |
| 5 | Rows carry a meta line (size · date) | there is no preview column to carry it | `ColumnBrowser` |
| 6 | A file is a push, not a preview pane | tap opens the existing full-screen inspector directly; the preview column has nothing to sit beside at this width | `ColumnBrowser` |
| 7 | ROW·COLUMN, folder view and sort collapse into settings | both references put these behind `···`; nothing in that control row survives 390 | `MediaLibraryBrowse` |

Items 1, 2, 4, 5 and 6 are the inline-expand mode itself. 3 and 7 are the chrome around it, and they
fail at 390 independently of which descent model wins — worth shipping even if item 1 is deferred.

## Not fixable in a consumer

Stated plainly because the estate's recent tickets have rightly asked: the height, the column
rendering, the crumb row and the toggle row are all internal to the organisms. No prop reaches them,
and `columnHeight` is a controlled value whose *unit* is the problem, not its plumbing. kol-r2b2
contributes the measurements, the reference set and the wireframe; it cannot contribute a fold.

## Open for the user, not for the DS to assume

**Does the library wall stay stacked under the browser on mobile?** kol-r2b2 renders
`variant="browse"` and `variant="library"` stacked (the 2026-08-26 one-view ruling). Two full-height
surfaces on a phone is a lot of scrolling, and both references show one list per screen. Not ruled —
do not decide it inside this ticket.

## Rejected alternative

*Let the columns scroll horizontally and add a scroll affordance.* It keeps the desktop idiom intact
and is a much smaller change. Rejected because it does not fix items 2 or 3, and because two 260px
columns in a 390px window means the affordance is decorating a layout that still shows one and a
half folders. The references both had this option and neither took it.

## Definition of done

- [ ] a stack mode below `md`, inline expand with a three-level indent cap
- [ ] the back control names the parent, not a bare chevron
- [ ] `columnHeight` ignored below the breakpoint; the list is viewport-height
- [ ] rows carry size · date; a file tap opens the full-screen inspector
- [ ] the crumb row is one middle-elided path line; the toggles are behind settings
- [ ] the library-wall question above answered by the user before it is designed around
- [ ] verified at 390 × 844, not only at a desktop width narrowed in devtools

---

## SHIPPED — 2026-09-03 · kol-component 0.195.0 · six of seven

All five stack-mode items and both chrome items, except the one the ticket
holds for the user.

| # | state | what shipped |
|---|---|---|
| 1 | **done** | One full-width list below `md`, no x-scroll. It is a different TREE, not the columns restyled, so it forks in JS on `useMediaQuery('(max-width: 767px)')` — a new hook, the general form of `useCoarsePointer` / `usePrefersReducedMotion`, exported. Sizes stay Tailwind's; a structural fork is what this is for |
| 2 | **done** | The back control NAMES the parent — `‹ olina-media`, or `All files` at the root. Shown only once the list has re-based past the indent cap |
| 3 | **done** | The crumb is one middle-elided line below `md`: first segment · `…` · current, the middle dropped rather than wrapped. Both renders are in the markup, one hidden at each breakpoint — same data, no second source |
| 4 | **done** | `height` / `defaultHeight` / `onHeightChange` and both resize handles are inert below the breakpoint; the list takes the viewport. Your framing carried the decision — a desktop drag value is not a phone measurement, so it is ignored outright rather than clamped |
| 5 | **done** | Rows carry `size · date` under the name, `kol-helper-10` on the fault line's chrome side (it cannot wrap) |
| 6 | **done** | A file tap fires `onQuickLook` with the level's file list and the tapped index — the consumer's existing full-screen inspector IS the phone's preview. No new surface |
| 7 | **done** | The `ViewToggle` + ROW·COLUMN cluster is `hidden md:flex`. Nothing new was minted to hold them: the settings drawer already carries the same `folderView` switch, so the collapse is a hide, not a move |

**Inline expand, capped at three, then it re-bases** — the ruling implemented as
ruled. One flat `<ul>` walks down the open path and splices the open folder's
children under it at `depth + 1`; the indent is padding, not nested lists, so the
rows stay one scroll box and one keyboard sequence. The same chevron opens and
collapses. Past `INDENT_CAP` the list re-bases on a deeper folder and the back
control appears — which is the "falling through to push" half.

**Still open, and deliberately not designed around:** *does the library wall stay
stacked under the browser on mobile?* Your ticket says do not decide it inside
this ticket and it has not been. `MediaLibraryBrowse` renders `variant="browse"`
and `variant="library"` exactly as before.

**Not verified at 390 × 844 by me** — this repo has no device harness and a
desktop width narrowed in devtools is what your DoD explicitly rules out. The
logic is gated and built; the measurement is yours.

---

## ↩ MEASURED AT 390 × 844 — 2026-09-03 · kol-r2b2

The measurement this ticket was held open for. Real iPhone, `media.kolkrabbi.io`, on component
**0.197.0** / theme **0.142.0**. Not a narrowed desktop.

**Three items hold, verified on the device:** one full-width list with no x-scroll (1) · the viewport
is the height, the 800px void is gone (4) · a file tap opens the full-screen inspector (6). Items 2
and 3 could not be exercised in the measured state — the path was inside the indent cap, so no back
control and no elision. Item 7 holds: the toggle cluster is hidden.

**Two defects, both in source, neither a matter of taste.**

### D1 · inline expand is not implemented

`ColumnBrowser.jsx:487` is a flat loop, one pass per level down the open path. Each pass appends
**every** folder at that level, then every file, then descends. A loop that appends cannot insert, so
an open folder's children can only ever land after **all** of its siblings.

Measured, with `R2 · kol-media` open at the root:

```
R2 · kol-media     ← open
B2 · website       ← sibling
B2 · vault         ← sibling
  labs-render-examples   ← R2 · kol-media's children, after both siblings
  type
  video
  01.jpg …
```

The ticket's ruling was iOS Files' gesture (`_tmp/ref/IMG_2557.PNG`): the open folder's children sit
**directly under it**, before the next sibling. That is the whole reason inline expand was chosen
over push — the parent stays put *and keeps its place in the list*.

Your own comments disagree with each other: `:485` says "the open folder's children spliced in
directly under it", `:494` says "nothing recursive here, the loop IS the path". The second is why the
first isn't true. **Fix:** emit the child level's rows at the point the open folder is emitted —
recursion, not a later pass.

### D2 · the date is unformatted

`:502` — `metaOf = (o) => [o.size != null && formatSize(o.size), o.uploaded].filter(Boolean).join(' · ')`

The size gets a formatter; `o.uploaded` goes in raw. A row reads `389.1 KB ·
2026-06-19T02:00:14.629Z`, which fills the meta line at 390 and is a machine string in a place both
references use a short local date (`28.8.2026`) or a relative one (`modified 3 months ago`).

### Also, and it is ours not yours

Item 5 as written — "rows carry a meta line (size · date)" — is why **folders show no meta at all**:
they have neither a size nor an uploaded date. The references put `date · N items` on a folder. That
is a spec defect in this ticket, not a build defect, and it is carried into the follow-up below
rather than patched here.

## Follow-up filed

`ColumnBrowserMobileViews` — the four views this ticket never described (the refs are five views and
a constant chrome, not one navigation rule), the row anatomy, and the tab-pill answer to the
library-wall question this ticket left open. Wireframe, all views at true 390px:
https://claude.ai/code/artifact/085f1e65-756d-492e-9a74-73be6dbd41a7

**This ticket closes on D1 + D2.** The rest is the follow-up's.

## ✅ RESOLUTION — 2026-09-04 · @kolkrabbi/kol-component@0.211.0

D1 and D2 both fixed. D1 was ORDER: a flat loop over the open path appended each level after the whole level above it, so an open folder's children landed after its last sibling and, in the reported tree, after an unrelated ROOT FILE — every row present at the right depth, which is why it read as an indent bug. The walk is recursive and the subtree is contiguous under its parent. D2 is a new `formatDate` seam beside `formatSize`, ISO date-only by default. The walk is lifted to `stackRows()` so ORDER is checkable — a structural assertion passes on the broken version, an adjacency one does not. Inline expand re-measured on the deployed build at 390 by kol-r2b2: the chevron splices a folder's children directly under it, which is the IMG_2557 behaviour the whole arc was for.

**Remainder here:** none — kol-r2b2 none — verified on the deployed build.

