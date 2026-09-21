# @kolkrabbi/design-editor

## 0.13.0 — 2026-09-04

`editor-chrome-review` findings 8 + 9.

- **The tool row is on the ladder.** It was 36px buttons with 22px glyphs, and
  22 is not a glyph size — it is the smallest PINNED SQUARE (22 · 26 · 32 · 40),
  used as one. The SOLO glyph ladder is 12 · 16 · 20 · 24. Now `md`: a 32px
  square with a 20px glyph read FROM the ladder rather than typed, so box and
  glyph cannot drift apart again. The old comment said the numbers were matched
  to a reference screenshot, which is how a toolbar ends up at a size that exists
  nowhere else in the estate. **A deliberate geometry change**, in the direction
  the user's *"seems a bit big"* points.
- **The frame name is an input at rest.** It rendered as a plain `<span>` and
  only became an `Input` on click, so there was no affordance until you had
  already guessed it was editable — his *"illegal input, not ds I dont think"*
  was the wrong diagnosis (it WAS the DS Input) and the right finding. One
  control now, with `onCommit` carrying the whole contract: commit on blur or
  Enter, restore on Escape, and the draft re-snaps to `value` afterwards so a
  rejected rename falls back to the last good name. Two pieces of state and the
  span/input dance are gone.

## 0.12.0 — 2026-09-04

- **Strokes moved to the opaque ladder** (`editor-chrome-review` finding 2, the
  user's own pass: *"oq-* NOT fg-*"*). 79 `border-fg-*` across 35 files became
  `border-oq-*`, step for step — an alpha border composites twice wherever two
  of them overlap, and the overlap reads heavier than the stroke it is made of.
  `oq` is the same ink at the same stop, flattened onto the surface instead of
  laid over it, so on a plain ground the sweep is invisible and at every panel
  seam it is correct. **Text is untouched** — the rule is about strokes, and ink
  does not overlap itself.
  This became ours when the editor moved into this repo; it was filed as
  "editor-side" when that meant another repo.
- **A stale comment corrected while in there.** `EditorFooter`'s `TOGGLE_FIX`
  claimed `border-fg-04` "never gets generated" because Tailwind does not scan
  node_modules, and named it in app source to force it out. That was never true:
  `.border-fg-*` and `.border-oq-*` are both STATIC rules in kol-theme, not
  Tailwind utilities, so nothing generates them and nothing can fail to. Only
  the arbitrary bracket value (`h-[26px]`) genuinely needs naming, and the
  comment now says so — the old one would have taught the next reader to name
  every ladder class they touched.

## 0.11.0 — 2026-09-04

- **Save As focuses the name field** (kol-fxr, measured on 0.10.0). It routed
  into the dialog and `modal.prompt` was gone — the important half — but focus
  landed on `.kol-overlay-sheet`: `FullscreenOverlay` moves focus on mount, and
  a child's `autoFocus` runs BEFORE the parent effect that robs it, so nothing
  in either file looked wrong. Fixed through the overlay's new `initialFocus`
  (kol-component 0.214.0) rather than a timing hack. The ref rides a wrapper
  around the field, so this file does not depend on whether `Input` forwards a
  ref.
- **Documented, not changed: a duplicate appears at the TOP of the list, not
  beside its original.** `applyDuplicate` inserts it directly after the item it
  copied, which is true of the store and — under the dialog's newest-first sort
  — not of the view. The sort stays: a fresh copy IS the newest thing and is
  selected on creation, so it is never lost, and reordering around a duplicate
  would move every other row to keep one promise about adjacency.

Requires `@kolkrabbi/kol-component` **>=0.214.0**.

## 0.10.0 — 2026-09-04

- **Save As opens the files dialog, not `modal.prompt`** — the half of the
  `FilesDialog` spec 0.9.0 left undone. A prompt asks for a name with no sight
  of the names already taken, which is how three files end up called `test`.
  The dialog grows a "Save current frame" row (`onSaveCurrent`), focused when
  opened that way, and both File surfaces route Save As to it. `buildSpec` is
  returned from `useComposeFile` so the dialog never has to know what a frame is
  made of.

## 0.9.0 — 2026-09-04

**`FilesDialog`** (kol-fxr, `FilesDialog`) — the editor could save, load,
import, export and delete as five unrelated surfaces, none of which was a files
dialog, and could not rename or duplicate at all. Asked for by the user
directly: *"a proper save load import export delete files dialog"*.

- **One list over all four library slots**, `kind` as a filter rather than four
  tabs — the ask was a files dialog, not a slot browser. Newest first.
- **MediaLibrary's twin, composed not built**: `FullscreenOverlay` ·
  `ContentFilters` (search, kind chips, view toggle, N-of-M) · `ContentRow` and
  `ContentCard` at `variant="default"` · `EmptyState`. Both views carry
  `media={false}` — a palette or a type spec has no thumbnail and never will, and
  the dashed MISSING plate is for an asset that FAILED.
- **The write verbs live here**, where MediaLibrary's do not: that organism is
  read-only because a remote bucket write needs credentials a browser-shipped
  package must not carry. This store is `localStorage`, owned by this package
  and already mutated by it on every save.
- **Rename is inline in the row**, not a `modal.prompt` — Enter commits, Esc
  cancels, blur commits. **Duplicate** copies the STORED item, so duplicating
  something you have not loaded copies what is saved rather than what is on
  screen, and the copy lands directly after its original. **Delete** goes
  through the existing `useModal` confirm.
- **`renameItem` / `duplicateItem` on `LibraryProvider`**, where they belong.
  Rename does not route through the slot validator — a rename must not be able to
  fail validation, and must not move `savedAt`. Both transforms are pure and
  exported (`applyRename` / `applyDuplicate`) so they are reachable by a check.
- **`onSaveSettings(name, spec)` — the export filename is no longer hardcoded.**
  Every export anyone ever made was `kol-design-editor.json`, so each one
  overwrote the last in their downloads folder and none said what it was. The
  name is sanitised for the filesystem; an existing caller passing nothing keeps
  the old filename. `spec` exports a STORED item rather than the live frame.
- **Opening a file adopts its identity** — without it the next plain Save wrote
  a second copy instead of overwriting what had just been opened.
- Wired to both File surfaces (topbar menu, rail footer tab) through a small
  external store in `railExtras`' idiom, so neither owns the dialog.

Requires `@kolkrabbi/kol-component` **>=0.212.0** (`ContentFilters
initialFilters`, `media={false}`).
