# @kolkrabbi/design-editor

## 0.16.0 — 2026-09-27

**The inspector, as panes** (plan-2026-09-27-editor-inspector-rebuild — the user's second review,
Affinity as the guide).

- **Three named panes.** Transform (alignment · X/Y · W/H + lock · rotation + rotate/flip ·
  resizing — was Position + Layout with five sub-labels), Appearance, Typography; Canvas's Frame /
  Background and the type panes (Image · Path · Preset · Parameters · Group) are panes too. Full-width
  rules; no sub-labels — the glyphs and their tooltips name the fields.
- **No "TEXT" row.** The header that repeated the selected layer's type is gone; its ⋯ and delete
  moved onto the Inspector / Parameters / Effects row.
- **Typography:** type settings ride the pane header; size is ONE field with its preset chevron
  inside (`Input slotRight`); line height and letter spacing fill their cells; the text-box vertical
  row has text glyphs (kol-icons 0.29.0); inspector glyphs on the ladder's 16.
- **Transport back to fxr's shape:** play | pause and stop | rewind as two strips, the loop field
  filling between; the Transport / Output / File strip is the default segmented look, full width
  (the sync had set it `filled`, which read as bare tabs).
- **Every icon-only control has a tooltip** — the native-title gate's new T2 enforces it here;
  `data-kol-tip` (read by nothing) is gone.
- **Grounds on the opaque ladder** (review #11): `bg-fg-04/08` and `--kol-fg-04/08` grounds, borders
  and dividers are `oq`, step for step.
- **Thin vectors select.** Path and line layers carry an invisible 12-screen-px hit band.
- Peers: kol-component ≥0.227.0 · kol-icons ≥0.29.0 · kol-theme ≥0.154.0.

## 0.15.0 — 2026-09-27

**Back on the design system** (plan-2026-09-27-editor-ds-sync; the editor review's 13 findings).

- **Its copies are gone.** PathNodeOverlay · CropOverlay · XYPad · KeyframeEditor · CurveEditor ·
  InspectorRail · ToolPalette · LayerStack (+ AddLayerButton) · TimelineDock · Canvas · the tab row ·
  the inspector Section are kol-component's now; the editor keeps its store and wiring. The old
  files are in `_tmp/2026-09-27-editor-copies/`.
- **One icon system.** `EditorIcon` and its 59 SVGs are retired; everything is `kol-icons`, with the
  editor-only glyphs folded into v1. Buttons that asked the old loader for names it didn't have
  (`view-list`, `grid`, `arrow-left` …) render again.
- **Transport is the motion pack's.** The Transport tab, the touch ▶ sheet, the collapsed dock's ▶ and
  Space-to-play exist only with the motion pack; `/core` shows no time controls. `TransportBar` is
  rebuilt from KOL parts (rewind · play/pause · stop · loop length).
- **Inspector:** browser tooltips → KOL `Tooltip` (40); constrain proportions is a lock `Button`; the
  line-height / tracking glyphs come off the ladder; text alignment has text-align glyphs and no
  label; type settings moved to the font row; Fill and Stroke sections removed (the colour window
  edits paint); labels that named the obvious (Size, Dimensions, Position, Alignment, Rotation)
  dropped; every segmented toggle is `filled`.
- **Fixed:** the canvas Background now writes through the colour target, so the colour window shows
  the canvas colour (a red canvas read white); the settings drawer closes on its X (kol-icons).


## 0.14.0 — 2026-09-27

The editor split into a core and three layer packs (deconstruction roadmap, kol-ds-ui
`.kol/llm-context/plan-2026-09-27-deconstruction-roadmap.md`). **The root entry is unchanged** —
`import { DesignEditor } from '@kolkrabbi/design-editor'` is still the whole editor, same exports.

- **`@kolkrabbi/design-editor/core`** — the editor with no packs: canvas, document, the vector
  layer types (shape · path · bool · text · group · photo · pattern), the clock, bindings,
  export. About half the full editor's static weight (1.2 MB against 2.2 MB of JS).
- **`/generators` · `/effects` · `/motion`** — each registers one pack through the seam
  (`registerPack`, also exported from `/core`). Import the ones you want before rendering:
  generators = the loop catalog and the `loop`/`misc` layer types; effects = the filter chain
  and the Effects tab; motion = kinetic type and the timeline dock.
- **An absent pack degrades, it does not throw.** Its layer types are not offered, its menu and
  tab are hidden, and a document that already holds its layers renders and exports them as
  nothing.
- **Motion is authoring, not time.** The clock and the bindings stay in the core — every
  generator is a function of time — so `/motion` is kinetic type and the timeline, not playback.
- **`<DesignEditor mediaClient settingsStore>`** — browse a client in kol-media-client's shape
  instead of the Kolkrabbi CDN, and persist the editor's preferences to a host store
  (`{ load() → Promise, save(settings) }`, e.g. a database row keyed by tool). localStorage
  stays the instant boot cache.
- **Kinetic fonts contract, unchanged but now written down:** the host serves
  `/fonts/TG/TGRotVF.ttf`, `TGMalromurRomanVF.ttf`, `TGGullhamrarVF.ttf`.
- `pnpm check:core` walks the core's import graph and fails if it reaches a pack.

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
