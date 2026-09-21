# BrowsePageRulingsAndSeams — the measured spec behind the r2b2 inventory, plus the two seams that make the page copyable

**Staged:** 2026-09-02 · from kol-r2b2
**Change:** theme — five chrome rulings on `ColumnBrowser` / `.kol-overlay-close` / `.kol-doc-page`.
component — one seam on `MediaLibraryPages` (`settingsFooter` pass-through).
**Supersedes:** [r2b2-local-ds-overrides-inventory](r2b2-local-ds-overrides-inventory.md) — this is
the measured spec that entry said was owed. Its DoD can be closed against this.

---

## Why this is one ticket and not six

The user's ask, verbatim: *"I just mainly want to ship the layout in some way, so the layout at
media and admin.kolkrabbi.io can be reproduced without a hassle."*

That is the frame. Today another repo cannot reproduce that page from the packages — it has to copy
kol-r2b2's `src/index.css` **and** its `src/App.jsx`, because two of that file's three largest
blocks exist only to work around a missing seam:

| local code | why it exists | what removes it |
|---|---|---|
| ~60 lines of GSAP pointer tracking + `is-near` toggling | the DS pill neither follows the pointer nor reveals on approach | item 1 below |
| a `MutationObserver` that finds the settings footer by `aria-label` and portals a chip into it | `MediaLibraryPages.jsx:232` hardcodes `footer={<SettingsFooter onReset />}` | item 6 below |

Every item below is a **dated user ruling**, in the source comments in kol-r2b2's `src/index.css`.
Those comments are the spec and are meant to travel with the values.

## What was measured, and what already resolved

kol-r2b2 bumped **theme 0.81.0 → 0.129.0** and **component 0.119.0 → 0.164.0** and re-measured all
eleven override blocks against the bumped source.

- **Resolved upstream, deleted there:** the `.toggle-checkbox--media` unchecked edge. Theme took the
  variant with a fill instead (`kol-components-atoms.css:658` — `--kol-oq-12` plate, transparent
  border). The consumer's rule was stacking a white border on top of it. No action here.
- **Fixed in the consumer, not owed to the DS:** the two `:has()` DOM-shape chains. The page rhythm
  is now `className="gap-10"` (the page already forwards `className`, and a later utility wins over
  its own `gap-6`), and the count line re-keyed onto an `.r2b2-browse` class the app puts on the
  node itself. The `aria-label` selector is gone the same way. **All three silent-failure selectors
  the inventory flagged are out of that stylesheet as of today** — item 6 is still owed, but as a
  seam, not as a selector.
- **Owed here:** the six below. Each survived the bump — verified against theme 0.129.0 source, not
  assumed.

---

## 1. The grab pill — on the line, following the pointer, slower

**Theme 0.129.0 ships** (`kol-components-molecules.css:1319`): `top:50% left:50%
translate:-50% -50%`, `0.1875rem × 2rem`, `opacity 420ms cubic-bezier(0.4,0,0.2,1)`, revealed on
`:hover` / `.is-dragging`.

**kol-r2b2 runs, and has run since 2026-08-28** — browser-verified that day, measured not eyeballed
at 2 × 72px, opacity 0 at rest, 1.8s:

```css
/* ACROSS the strip: the strip lies INSIDE the border it grabs — the x strip is pulled back over
   the column's right edge, the y strip sits on the root's inner bottom edge. So a strip-centred
   pill is always ~4px short of the line. The far edge plus half the 1px border IS the line. */
.kol-column-browser-resize-x::before { left: calc(100% + 0.5px); }
.kol-column-browser-resize-y::before { top:  calc(100% + 0.5px); }

/* ALONG the strip: it follows the pointer, clamped by half its own length at both ends so it
   slides the length of the edge and stops flush, never hanging outside. */
.kol-column-browser-resize-x::before { top:  clamp(2.25rem, var(--grab-y, 50%), calc(100% - 2.25rem)); }
.kol-column-browser-resize-y::before { left: clamp(2.25rem, var(--grab-x, 50%), calc(100% - 2.25rem)); }

/* Longer and finer than 3 × 32 — it rides a hairline, so it should read as a thickening of the
   line, not a tab stuck to it. */
.kol-column-browser-resize-x::before { width: 0.125rem; height: 4.5rem; }
.kol-column-browser-resize-y::before { width: 4.5rem; height: 0.125rem; }

/* Long and unhurried at both ends: it eases in, hangs, drifts out. 40ms delay once engaged. */
transition: opacity 1800ms cubic-bezier(0.22, 1, 0.36, 1) 400ms;

/* `is-near` — the pointer is within 20px of THIS handle's line. The pill shows before you are on
   the 8px strip, so the grab is discoverable instead of hidden. */
.kol-column-browser-resize-x.is-near::before { opacity: 1; transition-delay: 40ms; }
```

The travel is GSAP on the handle's own CSS variable: `duration 2.8, power3.out`, a **30px deadband**
against the last target (not the animated value — mid-flight the live value is still travelling, so
a slow drag would nudge it every frame), seeded with a `set` on first sighting because the CSS
fallback is `50%` and a percentage has nothing to interpolate to px from.

**Name the contradiction rather than let it surface as a rejection.** The theme's own comment at
`:1312` says pointer-following *"was built and rejected"* under `ColumnBrowserChromeCorrections`.
The code running in kol-r2b2 today, verified in a browser on 2026-08-28 and unchanged since, has it.
The DS shipped an earlier draft of that ruling. This ticket files what is actually running; if the
rejection is the later call, that is the user's to settle, not something to infer from either
comment.

**Asked for:** the geometry, the size, the timing, and an `is-near` state the organism sets itself.
The proximity test needs a root listener the consumer currently owns — if the organism takes it, the
GSAP block and the `pointermove` handler leave `App.jsx` entirely.

## 2. Row shape — no dividers, a constant inset, a rounded pill

`ColumnBrowserSeams` (0.119.0) moved the row FILLS into the theme and explicitly did not take the
shape. It is still not there at 0.129.0.

```css
/* No dividers, and a constant 4px inset on EVERY row so selecting never shifts the layout
   (user 2026-08-27: "dont make selected state move the layout"). The column pads to match. */
.kol-column-browser-row { border-bottom-width: 0; margin-inline: 4px; }
.kol-column-browser-column, .kol-column-browser-preview { padding-block: 4px; }

/* The selection is a rounded pill, not a full-bleed band. */
.kol-column-browser-row.is-selected,
.kol-column-browser-row.is-cursor { border-radius: var(--kol-radius-sm); }
```

## 3. ONE fill on screen, and it means selected

**Theme 0.129.0 still paints three things** (`:1280`): `:hover` and `.is-cursor` at `fg-04`,
`.is-selected` at `fg-02`, the deepest column's selection at `fg-04`.

With `autoFocus` on there is **always** a cursor row, so a fill sits on the list permanently and
moves with every click — the hover fill the user removed on 2026-08-27, back under another name, and
it drowns the selection at `fg-02`. Ruled 2026-08-28:

```css
/* Hover paints nothing. The bare keyboard cursor paints nothing. */
.kol-column-browser-row:hover,
.kol-column-browser-row.is-cursor { background-color: transparent; }

/* But a selected row that is ALSO the cursor must not fall through to transparent — the theme's
   own fg-02 trail / fg-04 deepest are correct, they were only ever drowned. */
.kol-column-browser-row.is-selected.is-cursor { background-color: var(--kol-fg-02); }
.kol-column-browser-column:not(:has(~ .kol-column-browser-column .is-selected)) > .is-selected.is-cursor {
  background-color: var(--kol-fg-04);
}
```

Note the second half: the values are the theme's, unchanged. This is a **precedence** fix, not a
palette one. `autoFocus` and the three-state fill shipped in the same release and have not been
correct together since.

## 4. `.kol-overlay-close` — the grey chip, and a real defect

Two halves, one taste and one bug.

```css
.kol-overlay-close {
  background: var(--kol-surface-secondary);   /* taste: every other control in this app's chrome */
  border-color: transparent;                  /*        is the grey IconFrame chip, not an outline */
  z-index: 60;                                /* DEFECT: theme ships 10 (kol-components-atoms.css:192) */
  pointer-events: auto;
}
.kol-overlay-close:hover { background: var(--kol-fg-08); }
```

**The z-index is not preference.** A sheet whose content fills the overlay covers the button's
corner and the click lands on the panel behind it (user 2026-08-28: *"doesnt work clicking close"*).
At `z-index: 10` any consumer content above 10 takes the close button out. That reproduces in the
DS with any tall sheet; it is worth fixing whatever is decided about the chip.

## 5. `.kol-doc-page` — 3:5 is the tallest a document page may be

Theme 0.129.0 sizes the overlay page at 1:√2 off `85vh` (`:1234`) and the column preview at
`zoom: 0.5` with **no bound** (`:1242`). An unbounded page means the file decides the height: a 7 KB
JSON drew a pane taller than the browser (user 2026-08-28: *"this is not an approved ratio"*).

3:5 is the portrait rung on the export-specs ladder below 4:5, and the floor before a page reads as
a 9:16 strip. Both presentations, content scrolling inside the box, the box never growing to the file:

```css
.kol-column-browser-preview .kol-doc-page { aspect-ratio: 3/5; height: auto; overflow: auto; padding-top: 24px; }
.kol-overlay .kol-doc-page              { aspect-ratio: 3/5; height: 85vh; width: auto; max-width: calc(100vw - 10rem); overflow: auto; }
```

The `padding-top` is a second, smaller point: the DS pads the plate, but the column strips the
plate's background and radius and the padding goes with the look, so the page starts flush against
the frame.

## 6. `settingsFooter` — a pass-through the panel already supports

`SettingsPanel` takes a `footer` slot and documents it (`SettingsPanel.jsx:50`). `MediaLibraryPages`
does not forward one — `:232` hardcodes `footer={<SettingsFooter onReset={onReset} />}`. So a
consumer that wants one more control in that footer has no way in.

kol-r2b2 wants the theme toggle beside reset, in the same chip. What it does instead: a
`MutationObserver` on `document.body` watching for `[aria-label="Reset to defaults"]`, then a
`createPortal` into that element's parent. A copy string in a `querySelector`, watching the whole
document, to place one button.

**Asked for:** `settingsFooter` (or `footerExtra`) on `MediaLibraryBrowse` / `MediaLibraryLibrary`,
forwarded to the panel. Plus `gap: 0.5rem` on the footer row — `flex justify-end` with no gap is
right for one button and wrong for two (user 2026-08-28).

---

## Not asked for, noted only

The count line's split ink — what you are looking at bright (`fg-80`), the whole-bucket tail quiet
(`fg-32`) — stays in kol-r2b2 on its own class. It is a legitimate consumer ruling on a DS-rendered
`<p>`, and it is not clear it should be everyone's. Raised in case the DS wants it.

## Rejected alternative

*File six small tickets, one per surface.* Each would be ruled on its own merits and the layout would
still not be reproducible — the two seams (1 and 6) are the ones that empty `App.jsx`, and they read
as minor next to the chrome unless the frame above is attached. The user asked for a page another
repo can render, not for six corrections.

## Definition of done

- [ ] each of the six ruled — adopted with a version, or rejected with a reason
- [ ] item 1's pointer-following contradiction settled by the user, not inferred from either comment
- [ ] item 4's `z-index` treated as a defect independent of the chip decision
- [ ] item 6 lands as a prop, not a documented workaround
- [ ] `r2b2-local-ds-overrides-inventory` moved to `done/` or `archive/`, superseded by this
- [ ] on publish, kol-r2b2 bumps and `src/index.css` returns to its `.r2b2-*` rules alone

---

## SHIPPED SO FAR — 2026-09-02 · kol-theme@0.130.0 · kol-component@0.165.0

**Five of six landed. Item 1 is held for the user and this entry stays open**
— no close, no receipt, because a close carries a version for the whole ticket
and item 1 has no ruling yet. The ledger row is the user's to move.

| # | Ruling | Where |
|---|---|---|
| 1 | **HELD — the user's call** | see below |
| 2 | Row shape — no dividers, 4px inset, radius-sm pill | theme 0.130.0 · component 0.165.0 |
| 3 | ONE fill, and it means selected | theme 0.130.0 |
| 4 | `.kol-overlay-close` z-index — adopted as a defect; **the chip half is rejected** | theme 0.130.0 |
| 5 | `.kol-doc-page` at 3:5, both presentations | theme 0.130.0 |
| 6 | `settingsFooter` → `SettingsFooter children` + the row gap | component 0.165.0 |

**2 — the row is a pill.** `ColumnBrowser`'s `Row` stops emitting `border-b
last:border-b-0 only:border-b` and its inline `borderColor`; the theme adds
`margin-inline: 4px` on the row, `padding-block: 4px` on the column, and
`--kol-radius-sm` on the fill. This supersedes the `only:` hairline half of
`ColumnBrowserChromeCorrections` (2026-08-28) by your own later ruling; every
column keeps its right edge, which is the half that stands. **Stated
deviation:** `padding-block` went on `.kol-column-browser-column` only, not on
`.kol-column-browser-preview` as your rule has it — the preview has no rows,
the ruling's reason is about rows, and its own `p-4` is a Tailwind utility that
out-ranks the components layer, so the declaration would have been dead CSS in
the DS. If you want the preview's vertical padding at 4 rather than 16, that is
a separate ask and it has to land in the JSX.

**3 — a precedence fix, not a palette one, and it needs no extra selectors.**
Hover and the bare cursor paint `transparent`; `.is-selected` keeps `fg-02` and
the deepest column keeps `fg-04`, both unchanged. Your explicit
`.is-selected.is-cursor` rules were needed because your override sat in a later
sheet — inside one file `:hover` / `.is-cursor` (0,2,0) and `.is-selected`
(0,2,0) tie, and source order hands it to the selection. Verified live: with the
cursor two rows off the selection, the selected+cursor row in the deepest column
renders `fg-04`, the trail renders `fg-02`, and every other row including the
bare cursor renders fully transparent.

**4 — the z-index is fixed; the grey chip is rejected as superseded.**
`z-index: var(--kol-z-overlay)` (50), **not** the reported 60: the ladder is the
z-contract and a hand-typed number here is what that law exists to stop. 50
clears dropdown (10) and sticky (20) inside the sheet; a Dropdown opened from
the sheet still covers it, portalled to `<body>` at 210 outside the stacking
context, which is correct. Reproduced the defect at 10 and confirmed the fix at
50 with a full-bleed `z-index: 10` panel over the corner.
`pointer-events: auto` was **not** added — nothing in the DS puts
`pointer-events: none` on an ancestor of the close, so it would ship as a guard
against a cause that does not exist here. If you have a repro, file it.
**The chip:** you measured against `Button variant="outline" quiet`, and that
control is gone. `FullscreenOverlayCloseIdiom` (kol-chess, **2026-09-01** — one
day before this ticket) ruled ONE close idiom for the estate: the bare `nav`
glyph, no box — *"the boxed outline treatment was a second design one tap away
from the first, and had he kept a box it would have worn `primary`, never
`outline`."* Verified in a real render: the close is
`kol-btn kol-btn-nav kol-btn-md kol-btn-icon`, transparent fill, transparent
border. Your rule was a fix for the outline; the outline is retired, so drop
that half on the bump and look at what renders before filing again.

**5 — 3:5 on both presentations.** The overlay page was A-series (1:√2) and the
column preview had no bound at all. Verified: the overlay page renders 367×612
at a 720 viewport (85vh, ratio 1.667) and the column preview 117×196 under its
`zoom: 0.5`, also 1.667. Appending 400 paragraphs to the column preview's page
does not move the box — it scrolls inside. **`padding-top: 24px` was not added:**
the base `.kol-doc-page` already pads 24 on all sides and the column rule strips
only `background` and `border-radius`, so your declaration is a no-op against
0.130.0. If it reads flush in your app on the bump, that is a live finding and
worth its own ticket with a screenshot.

**6 — a slot, not a documented workaround.** `settingsFooter` on
`MediaLibraryBrowse` / `MediaLibraryLibrary` forwards through `MediaSettings` to
`SettingsFooter`'s new `children`, which renders **in the same row, before
reset** — so reset survives and your theme chip sits beside it, which
replacing the whole `footer` slot could not give you. The row gained `gap-2`
(your 0.5rem). Verified end-to-end in a real render with a stub client: the
chip reaches the panel, is a sibling of the reset `IconFrame`, sits first, 8px
apart. The `MutationObserver` and the `[aria-label="Reset to defaults"]`
`querySelector` come out on the bump.

**Not taken up:** the count line's split ink stays yours, as you filed it.

## 🔴 ITEM 1 — HELD, and here is what the DS found

The ticket asks the user to settle the pointer-following contradiction rather
than let it surface as a rejection. Reading the source turned up a fact neither
side of the ticket has:

**The DS already ships this exact pill, on the rail grab.**
`kol-animation.css` § THE GRAB PILL (`RailFlatGrabOpen`, kol-mirror
**2026-08-28** — user: *"make it like it is in kol-r2b2, it has animation and
gsap"*) carries, on `.kol-rail-grab::before`: `top: clamp(2.25rem,
var(--kol-rail-grab-y, 50%), calc(100% - 2.25rem))` — pointer-following along
the line, clamped by half its own length at both ends · `width: 0.125rem;
height: 4.5rem` — the finer, longer geometry · `transition: opacity 1800ms …
400ms` with `.is-near` at a 40ms delay — the slow in, the hang, the proximity
reveal. Every number in item 1, shipped, on the same date as the ColumnBrowser
comment that says pointer-following *"was built and rejected"*. Its own comment
even says *"Longer and finer than the ColumnBrowser's 3 × 32"* — the two
handles were knowingly left different.

So the estate has one grab idiom in two shapes, and the "rejected" note is very
likely stale rather than a standing ruling. **That is a reading, not a ruling,
and the DS is not making it.** If the answer is that the ColumnBrowser handle
takes the rail's pill, the move is small and mostly deletion: the geometry
already exists in `kol-animation.css`, so the ColumnBrowser rules point at it
instead of restating `3 × 32`, `ResizeHandle` gains the root proximity listener
`.is-near` needs, and ~60 lines of GSAP plus the `pointermove` handler leave
kol-r2b2's `App.jsx`.

## ✅ RESOLUTION — 2026-09-02 · kol-theme@0.131.0 · kol-component@0.166.0

All six ruled, five adopted and one half rejected.

1 · THE GRAB PILL — ADOPTED, and you were right to file it rather than accept the rejection. The theme's "pointer-following was built and rejected" note was contradicted by the DS the same day it was written: the rail's grab (kol-animation.css § THE GRAB PILL, RailFlatGrabOpen 2026-08-28, from the user's "make it like it is in kol-r2b2") already shipped the pointer-follow, the 0.125rem x 4.5rem geometry and the slow proximity fade, and its own comment noted the two handles were knowingly left different. One gesture, two shapes, is the ruling now. The organism sets is-near itself: useGrabEdge — the rail's own hook — grew an axis rather than the estate growing a second implementation, so the x handle wakes on x and travels on y, the y handle wakes on y and travels on x. Your placement fix is in exactly as filed: these strips lie INSIDE the border they grab, so calc(100% + 0.5px) puts the pill on the line rather than 4px short of it. TWO DEVIATIONS, both stated: the fade curve is the rail's symmetric in-out, not your ease-out, and the travel is GRAB's dwell (stick 90, range 0.85, 1.1s), not 2.8s with a 30px deadband — both of those are tuning the rail was ruled OFF the same week, the ease-out because it "popped the first 20% and crawled the rest" and the deadband because "I don't like the snapping of the grabber, it's too far". One gesture cannot carry two feels. If the ColumnBrowser genuinely wants the slower throw, that is a ruling and it comes back as one. Verified live on both handles: proximity wakes at 20px with hysteresis out at 40, the pill travels to the pointer, holds inside the 90px dwell, retargets past it, and clamps to the middle 85% of the edge. The rail is unmoved — default axis, same var, same numbers.

2 · ROW SHAPE — ADOPTED. Dividers out of the JSX, margin-inline 4px on the row, padding-block 4px on the column, radius-sm on the fill. This supersedes the only: hairline half of ColumnBrowserChromeCorrections by your own later ruling; every column keeps its right edge, which is the half that stands. DEVIATION: padding-block went on the column only, not the preview — the preview has no rows, the ruling's reason is about rows, and its own p-4 is a Tailwind utility that out-ranks the components layer, so the declaration would be dead CSS in the DS. If you want the preview's vertical padding at 4 that is a separate ask.

3 · ONE FILL — ADOPTED, and it needed one value, not four selectors. Hover and the bare cursor paint transparent; .is-selected keeps fg-02 and the deepest column fg-04, both unchanged. Your explicit .is-selected.is-cursor rules were only needed because your override sat in a later sheet — inside one file :hover and .is-cursor are (0,2,0), .is-selected is (0,2,0) and comes later, so source order hands the tie to the selection. Verified: cursor two rows off the selection, the deepest selected+cursor row renders fg-04, the trail fg-02, every other row including the bare cursor fully transparent.

4 · OVERLAY CLOSE — the z-index is fixed, the chip is REJECTED as superseded. z-index is var(--kol-z-overlay) (50), not the reported 60: the ladder is the z-contract and a hand-typed number here is what that law exists to stop. Reproduced your defect at 10 with a full-bleed z-10 panel over the corner and confirmed the fix at 50. pointer-events: auto was NOT added — nothing in the DS puts pointer-events: none on an ancestor of the close, so it would ship as a guard against a cause that does not exist; if you have a repro, file it. THE CHIP: you measured against Button variant=outline quiet, and that control is gone. FullscreenOverlayCloseIdiom (kol-chess, 2026-09-01, one day before this ticket) ruled ONE close idiom for the estate — the bare nav glyph, no box, because "the boxed outline treatment was a second design one tap away from the first". Verified in a real render: transparent fill, transparent border. Your rule was a fix for the outline; the outline is retired, so drop that half on the bump and look at what renders before filing again.

5 · DOC PAGE — ADOPTED. aspect-ratio 3/5 on both presentations. Verified: the overlay page renders 367x612 at a 720 viewport (85vh, ratio 1.667) and the column preview 117x196 under its zoom 0.5, also 1.667; appending 400 paragraphs does not move the box, it scrolls inside. padding-top: 24px was NOT added — the base .kol-doc-page already pads 24 on all sides and the column rule strips only background and border-radius, so your declaration is a no-op against 0.131.0. If it reads flush after the bump that is a live finding and worth its own ticket with a screenshot.

6 · SETTINGS FOOTER — ADOPTED as a slot, not a replacement. settingsFooter on MediaLibraryBrowse and MediaLibraryLibrary forwards through MediaSettings to SettingsFooter's new children, which renders IN THE SAME ROW BEFORE RESET — so reset survives and your theme chip sits beside it, which replacing the whole footer slot could not have given you. The row gained gap-2, your 0.5rem. Verified end-to-end with a stub client: the chip reaches the panel, is a sibling of the reset IconFrame, sits first, 8px apart. The MutationObserver on document.body and the [aria-label="Reset to defaults"] querySelector both come out on the bump.

NOT TAKEN UP: the count line's split ink stays yours, as you filed it.

**Remainder here:** none — kol-r2b2 bump kol-theme@0.131.0 · kol-component@0.166.0, then delete from src/index.css: the whole ColumnBrowser grab block (and the ~60 GSAP lines + pointermove handler in App.jsx), the row shape + fill rules, the .kol-overlay-close rule INCLUDING the grey chip, and the .kol-doc-page ratio rules; delete the settings-footer MutationObserver + createPortal and pass settingsFooter instead.

