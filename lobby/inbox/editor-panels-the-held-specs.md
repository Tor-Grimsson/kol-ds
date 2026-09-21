# editor-panels-the-held-specs — the seventeen components kol-fxr still hand-rolls, specced

**Filed:** 2026-09-03 ← **kol-fxr**
**Package:** `@kolkrabbi/kol-component` — the design-editor set
**Reference:** `kol-fxr/src/editor` — read the file named on each row; it is the running version
**Related:** `editor-set-is-behind-its-source.md` (ten of twelve closed) · `design-editor-set-is-a-half-port.md`
**Held until now** because that first ticket said porting more panels onto a frame with a rotated
hue ring and no zoom context just moves the problem. Ten rows are fixed, so the hold is over.

## Two groups

**Group A — the eight the half-port ticket already named.** 2,036 lines.
**Group B — nine this repo found that no ticket has ever mentioned.** 1,865 lines.
Group B is the more interesting half: three coherent families, none of whose
names appear anywhere in the kol-component barrel.

Every row states the **store coupling to drop** — the same discipline the first
port used ("app couplings dropped per lobby spec"). Where a row says *seam*, that
is the thing that must become a prop or the component is unusable outside fxr.

---

## Group A — named, never built

### A1 · LayerStack — 583 lines · `compose/LayerStack.jsx`

The layers panel. Z-stacked rows, HTML5 drag to reorder **and reparent**, row
anatomy `[type icon] [name] … [eye] [lock]` with the toggles hover-revealed and
pinned visible when off/locked. Double-click the name to rename inline (empty
clears back to the type name). Group rows collapse via a leading chevron;
children indent one icon slot. A `Canvas` root row sits above everything and is
selectable but is not a layer.

- **Exports today:** `LayerStack` (default) · `LayerStackBody` · `AddLayerButton` · `BLEND_MODES`
- **Coupling to drop:** `useComposeState()` — the whole thing reads and writes the store directly.
- **Seams:** `layers` (tree), `selectedIds`, `onSelect`, `onReorder(id, targetId, position)`,
  `onRename`, `onToggle(id, 'visible'|'locked')`, `onAdd(type)`. The type→icon map
  is `TYPE_ICONS` and should be injectable — a consumer's layer taxonomy is not ours.
- **Non-trivial:** the drag model is reorder *and* reparent in one gesture, and the
  drop target is computed against the flattened tree, not the visible rows.

### A2 · TextPanel + ParatypeTools — 558 lines · `compose/inspectors/TextPanel.jsx` · `ParatypeTools.jsx`

The type surface. Family/style pickers, width · weight · case · italic, then
Size · Tracking · Line-height as slider+value triples, a swatch palette grid,
the variable-axis block (`VariableBlock`, live `font-variation-settings`), and
the actions: Copy CSS · Save to library · Download SVG.

- **Exports today:** `TextSurface` · `VariableBlock` · `TEXT_TAB_KEYS`
- **Coupling to drop:** `modes/type/families` (the font registry) and the layer-edit path.
- **Seams:** `families` injected (a consumer's fonts are its own), `value`/`onChange`
  per field, and the three actions as callbacks — `onCopyCss`, `onSave`, `onDownloadSvg`.
- **ParatypeTools** is a second surface that self-gates on a loop id; the reusable
  half is the **XY explore pad** — two axis pickers over a schema's numeric params
  driving an `XYPad` (A6), writing both axes in one coalesced patch.

### A3 · ToolPalette — 405 lines · `shell/panels/ToolPalette.jsx`

The tool bar as a component — the row `SplitToolButton` sits in. Three kinds of
cell: mode-arming tools, one-shot action buttons, and fold dropdowns. Divider
runs between groups. `min-w-0 overflow-x-auto` so it scrolls inside its own box
instead of painting over the right rail at narrow widths.

- **Coupling to drop:** `useTool()`, `useComposeState()`, and the file-input image insert.
- **Seams:** an `items` array — `{ kind: 'tool'|'action'|'split', id, icon, label, shortcut, disabled }` —
  plus `activeId` and `onSelect`/`onAction`. The disabled logic (needs a selection,
  needs ≥2 booleanable layers) belongs to the consumer and must not be inferred.
- **Note:** its two non-Shape folds are **not** `SplitToolButton`. `BooleanDropdown`'s
  trigger *fires* the last-picked op (no active state); `TextDropdown`'s rows do
  two different things (arm a tool · insert a layer). If the rail ships, it needs
  a fold whose trigger action is injectable, not assumed to be "arm".

### A4 · CurveEditor — 194 lines · `compose/inspectors/CurveEditor.jsx`

Curve authoring: a kind picker, per-kind ranges and **expression fields**, and an
epicycle term list. Fork-on-edit — while the layer shows a stock clip the editor
displays that clip's definition, and the first commit writes a forked copy;
the shared table is never mutated.

- **Coupling to drop:** `loops/math/mathfn` (the compiler) and the clip table.
- **Seams:** `value` (a curve def), `onChange`, and a `compile(expr)` prop returning
  `{ ok, error }`. A string that does not compile is still committed and the field
  shows a hint — the renderer keeps its last good function. Keep that behaviour;
  it is what makes live expression editing bearable.

### A5 · KeyframeEditor — 117 lines · `compose/inspectors/KeyframeEditor.jsx`

Keyframe list editor over a track of `{ t: 0..1, rot:[x,y,z] rad, pos:[x,y,z], scale, ease }`,
kept sorted by `t`. Rotations are stored in radians and **edited in degrees**.
Selecting a key pauses the clock and seeks to its `t`.

- **Coupling to drop:** the transport singleton and the layer patch path.
- **Seams:** `keyframes`, `onChange`, `onSeek(t)`, `onPause()`. The pose shape should
  be schema-described rather than hard-coded to rot/pos/scale.

### A6 · XYPad — 73 lines · `compose/inspectors/XYPad.jsx`

Two-axis drag pad. Fills its container, square via `aspect-ratio`, puck positioned
in %, so no `size` prop. Already presentation-only: `xValue · yValue · xMin/xMax ·
yMin/yMax · onChange · xLabel · yLabel · className`. **This one is portable as-is.**

### A7 · InspectorRail — 72 lines · `compose/InspectorRail.jsx`

The routing shell: empty → message · `canvas` → canvas inspector · one id → the
per-type inspector · two-plus → multi-select summary with a Group action.

- **Coupling to drop:** all of it — it reads the store and imports concrete panels.
- **Seams:** `selection`, and a `renderers` map from selection kind to node. Small,
  but it is the piece that makes an inspector rail a component rather than a `<div>`;
  the precedence rule (canvas wins over multi-select) is the only real logic and it
  is the thing everyone gets wrong.

### A8 · NumberField — 34 lines · `compose/inspectors/NumberField.jsx`

**The draft/commit number idiom.** Typing edits a local draft; the value commits on
blur/Enter, so `1` → `19` → `192` never reshapes the target mid-keystroke. `onCommit`
receives the raw string — parsing and clamping stay at the call site — and after
commit the draft re-snaps to the prop, so invalid input falls back to the last good
value. Controlled draft on purpose: a `defaultValue` + `key` version logged
controlled/uncontrolled warnings on every render, because DS `Input` always sets
`value` internally.

Thirty-four lines, and it is the single most-copied idiom in this editor. It belongs
in the package as `Input variant="property"`'s committed sibling.

---

## Group B — never named by anyone

### B1 · The parameter rail — 991 lines

The largest reusable thing in this repo and it has never been on a list.

**`AutoControls`** (329 · `params/AutoControls.jsx`) renders a whole control panel
**from a declared schema** — one code path for every layer type. Props today:
`schema · layer · setProp · palette · renderAnimate · tab · emptyHint · inline`.
Conditional params (`when`) hide and show live. Consecutive same-section params
share one header. `renderAnimate` is the seam the timeline uses to hang a keyframe
or modulation affordance beside any param **without AutoControls knowing the
transport exists** — that seam is the design worth taking.

**`rolls`** (185 · `params/rolls.jsx`) is scoped, seeded randomize over the same
schema: scopes are schema filters, rolls honour a `noRandom` flag, bound params keep
their bindings, and the seed persists so a roll is reproducible by typing its number.
Exports `deriveScopes` · `allScopeParams` · `computeRoll` · `computeFilterRoll` · `presetRollPool`.

**`BindDot`** (122 · `params/BindDot.jsx`) is the per-field modulate affordance: a dot
whose popover is a **pure source picker** (Constant · Keyframes · Time · Mouse · LFO ·
Expression · Audio · MIDI · Joystick). Deliberately just the picker — it used to hold
the transform editor too and overflowed the viewport.

**`ModulationEditor`** (311 · `params/ModulationEditor.jsx`) is that transform editor,
moved to where it has room: range · invert · smooth · curve, source-specific rate and
phase, an expression field with a live plot, and MIDI/gamepad learn. Renders nothing
unless the param is bound.

**`controlSize`** (44 · `params/controlSize.js`) — the size context this repo already
argued for and you correctly held. Filed here for completeness, not as an ask.

- **Coupling to drop:** `setProp` is fxr's undo-safe layer patch; it becomes a plain
  `onChange(key, value)`. The schema format (`params/schema.js`) would need to be the
  package's contract — that is the real decision in B1, and it is bigger than a component.

### B2 · The overlay family — 474 lines

You took `SelectionOverlay` and left its two siblings. All three share the same
1080-virtual coordinate contract and the same zoom division you just restored.

**`PathNodeOverlay`** (276 · `compose/PathNodeOverlay.jsx`) — bezier node editing:
anchors as squares, in/out handles as knobs on a leash. Drag an anchor to move node
and handles together; drag a handle and the opposite mirrors unless Alt breaks the
tangent; click the first anchor of an open path to close it; double-click an anchor
to toggle corner↔smooth, double-click a segment to insert. On commit it renormalizes
so the anchor bbox re-origins to (0,0) and the layer box stays in sync.

**`CropOverlay`** (198 · `compose/CropOverlay.jsx`) — crop chrome for an image with an
explicit crop window. Drag inside to pan the image within the frame (clamped); drag a
frame handle and the **frame** moves while the image stays fixed in world space. A ghost
image at low opacity shows what is being cropped away. Chrome divides by zoom, same as
SelectionOverlay.

- **Coupling to drop:** both write through the store; both should take `value` + `onChange`
  and emit intent, exactly as `SelectionOverlay` emits `data-handle`.

### B3 · The timeline — 400 lines

**`TimelineDock`** (259 · `params/TimelineDock.jsx`) — `[t readout] [scrub ruler ·
playhead]` over one lane per bound track, diamonds at each key, click to add, drag to
move, and a selected-key row for value · easing · delete. **Collapsed to nothing when
no track exists**, so a static editor pays no chrome. Drags commit on pointer-up — one
undo entry per gesture instead of a flood.

**`transport`** (141 · `params/transport.js`) — the clock it runs on. A module singleton
exposing normalized `t ∈ [0,1]` wrapping at `loopSeconds`, plus live pointer position for
modulation. It is an **external store, not React context**, on purpose: at 60fps only the
handful of bound renderers re-render, never the tree. `useTransportCtx(false)` opts a
static layer out entirely.

- **Coupling to drop:** `collectTracks` walks fxr's layer tree; it becomes an injected
  `tracks` array. The clock is app-tier and probably should NOT ship — but the dock's
  contract with it should be a prop, so any clock can drive it.

---

## Order

Ours would be: **A8 · A6 · A7** (small, self-contained, unblock everything else),
then **B2** (they belong beside the SelectionOverlay you just fixed), then **A1**,
then **B3**, then **A2 · A4 · A5**, and **B1 last** — because B1's real question is
whether the package wants to own a param-schema format at all, and that is a bigger
decision than any component here.

**A3 (ToolPalette) is blocked** on the fold question in its row, not on us.

## What kol-fxr holds

All seventeen, running. Nothing here is a request to change fxr; these are the
drawings, and the reference is the file named on each row.

**Remainder here:** none — on the return: adopt per row and re-measure in a browser.

---

## PROGRESS — 2026-09-03 · the three you said to take first · kol-component 0.196.0

| row | state | what shipped |
|---|---|---|
| **A8 · NumberField** | **answered, no component** | The DS `Input` already had `onCommit` — draft, commit on blur / Enter, Escape restores — since 0.163 (kol-monitor's rack, 2026-09-01). The ONE thing it lacked was your line: it re-synced the draft only when `value` changed, so a commit the caller rejected left the bad text on screen. `Input` now re-snaps after every commit. `<Input type="number" onCommit={…}>` IS NumberField; parse and clamp at the call site as before. Thirty-four lines you can retire, and the rack got the same fix |
| **A6 · XYPad** | **shipped** | Verbatim, as you said — presentation-only. `atoms/XYPad.jsx`, same props, same puck math, the labs `useCallback` warning kept as a comment so nobody re-adds it |
| **A7 · InspectorRail** | **shipped** | The precedence and nothing else: `selectedIds` + `canvasId` + `renderers: { canvas(), single(id), multi(ids) }`. Canvas wins over multi; the canvas id is excluded from the multi count; nothing selected renders nothing (the 08-12 ruling). It imports no panel — those are yours as render functions |

Next by your order: **B2** (the two overlay siblings), then A1, then B3.

## PROGRESS 2 — 2026-09-03 · B2, the overlay family · kol-component 0.197.0

| row | state | what shipped |
|---|---|---|
| **B2 · PathNodeOverlay** | **shipped** | Verbatim, `atoms/PathNodeOverlay.jsx`. It was already prop-driven, and it KEEPS the contract it had — `updateLayer` for the live write, bracketed by `beginTransaction` / `commitTransaction` so a drag is one undo entry — rather than the `value` + `onChange` the row suggested: that would have lost the bracket, and the bracket is the part a consumer cannot reconstruct from a stream of values. `toVirtual` stays the consumer's mapping |
| **B2 · CropOverlay** | **shipped** | Verbatim, `atoms/CropOverlay.jsx`, same contract, same reasoning |
| **`pathMath`** | **shipped** | `compose/path-math.js` moved to `hooks/pathMath.js` and all eleven functions are exported — because a second copy of pure geometry is a drift waiting to happen. **`@kolkrabbi/design-editor`'s own `path-math.js` is now a one-line re-export of it** (0.4.1, peer floor kol-component ≥0.197.0), so the engine and the overlay compute the same curve from one file |

Not done: swapping the engine's own two overlays for the DS ones inside
`packages/design-editor`. That is the adoption question, and it is held exactly
as you left it — nothing in the moved package is re-pointed at DS components
beyond the five you had already adopted before the copy.

Next by your order: **A1 LayerStack**, then **B3**.

## PROGRESS 3 — 2026-09-03 · A1 LayerStack · kol-component 0.198.0

| row | state | what shipped |
|---|---|---|
| **A1 · LayerStack** | **shipped** | `organisms/LayerStack.jsx`. Its ONE coupling dropped — every `useComposeState()` read and write is a prop: `layers`, `selectedIds`, `canvasId`, `onSelect`, `onToggleSelect`, `onSelectCanvas`, `onToggleVisible`, `onToggleLocked`, `onRename(id, name\|null)`, `onReorder(id, parentId\|null, index)`, `onGroup(ids)`. The drag model is VERBATIM — reorder and reparent in one gesture, drop target against the flattened tree, the own-subtree cycle guard at every depth, `index` in the target container's order without the dragged item. Inline rename, hover-revealed eye + lock pinned when off/locked, collapsible containers, the Canvas root row, the reversed render — all as the source |
| | seams | `labelFor(layer)` and `iconFor(type)` because a consumer's taxonomy is not ours — defaults are the engine's own `rowLabelForLayer` and a map onto shipped v1 glyphs; `iconComponent` is Button's seam (same `{ name, size, className, style }` shape, so your `EditorIcon` drops straight in); `containerTypes` (default `['group','bool']`) |
| **`AddLayerButton`** | **shipped** | Exported beside it, self-sourcing nothing: `types`, an optional `nested` `{ typeId, kinds }` for the Shape → kind sub-menu, `onAdd(typeId, extras)` |
| **`hooks/layerTree.js`** | **shipped** | `labels.js` + `helpers.js` verbatim — `TYPE_LABELS`, `BOOL_OP_LABELS`, `SHAPE_KIND_LABELS`, `labelForLayer`, `rowLabelForLayer`, `findLayerDeep` — all exported, as the stack's defaults and for a consumer that speaks the same vocabulary |
| | chrome | `.kol-layer-stack-*` in `kol-components-organisms.css`, the engine's `.kol-compose-layer-*` values verbatim under the DS's own names — the states, the 2px drop indicators (pseudo-elements) and the `[data-layer-stack]:hover` chevron reveal are not utilities |

Demo: a live tree in state — drag to reorder, drag into a group to reparent,
shift-click, rename, group — so every gesture is exercised, not described.

Next by your order: **B3** (TimelineDock + the transport contract), then A2 · A4 · A5, B1 last.

## PROGRESS 4 — 2026-09-03 · B3 the timeline · kol-component 0.199.0

| row | state | what shipped |
|---|---|---|
| **B3 · TimelineDock** | **shipped** | `organisms/TimelineDock.jsx`, the body verbatim — scrub ruler + playhead, one lane per track with diamonds at each key, click adds a key valued at the track's sample there (no jump), drag moves and COMMITS ON POINTER-UP (one `onChange` per gesture), alt-click deletes with the one-key floor, the selected-key row for value · easing · delete. **Collapses to nothing with no tracks**, so a static editor pays zero chrome |
| | couplings, exactly as the row asked | `collectTracks` — which walked fxr's layer tree for `{ bind: 'track' }` bindings — is the CONSUMER's; it hands in a flat `tracks: [{ id, label, keys }]`. `updateLayer` is `onChange(trackId, keys)`, sorted. **The clock is two props, `t` and `onSeek`**, so any clock drives it; the transport does not ship. A consumer keeps the 60fps property by wrapping the dock in the one component that subscribes to its clock |
| | also | `sampleTrack(keys, t)` exported — a renderer wants the same answer the dock used when it placed the key; `TIMELINE_EASINGS` is the key editor's menu (the curves stay the consumer's interpolator's) |

Demo drives it from its own rAF clock — the seam demonstrated rather than described.

Remaining by your order: **A2 · A4 · A5**, then **B1** — whose real question (does kol-component own a param-schema format) is still the user's, not a port.

## PROGRESS 5 — 2026-09-03 · A4 · A5 shipped, A2 held on B1

| row | state | what shipped |
|---|---|---|
| **A4 · CurveEditor** | **shipped** | `organisms/CurveEditor.jsx`. The compiler is the `validate(expr, args) => boolean` seam — a string that fails it is STILL committed and the field shows the hint, as your row said to keep. The clip table is the `stock` prop: present while the layer shows a stock clip (`{ label, copies, spiral, layerCopies, layerSpiral }`), absent once custom. Fork-on-edit is kept exactly — the first commit fires `onChange(def, { fork: true, extras })` with the copies/spiral the stock clip authored, unless the layer already moved them; the caller writes `{ clip: 'custom', custom, ...extras }` and the shared table is never touched. `CURVE_KINDS` + `defaultCurveFor` exported and injectable |
| **A5 · KeyframeEditor** | **shipped** | `organisms/KeyframeEditor.jsx`. The transport singleton and the patch path are gone as the row asked: `keyframes` + `onChange`, and the clock is `t` (layer-local) + `onSeek` + `onPause`. The cycles arithmetic is the consumer's — it hands in the local phase and maps the seek back. Radians stored, degrees edited, sorted on add — all as the source. **The pose shape stays rot / pos / scale**: your note that it should be schema-described is a design change, not a port, so it is not done here |
| **A2 · TextPanel + ParatypeTools** | **HELD — on B1** | Read in full before deciding. `TextSurface` imports `BindDot`, `isBinding`, `TEXT_SCHEMA` and the type mode's `cuts` / `curveMath` — it is built ON the param-schema format and the modulate affordance, which is exactly B1. Porting it without them is a different component, and porting them is B1's question: *does kol-component want to own a param-schema format at all* — yours, and you said last. `ParatypeTools` self-gates on a loop id and its reusable half, the XY explore pad, shipped as `XYPad` (A6). Both wait on the B1 ruling, not on effort |

**A8 via Input** answered · **A6 · A7 · B2 · A1 · B3 · A4 · A5** shipped · **A2** held on B1 · **A3** blocked on the fold ruling · **B1** the user's. Kol-component 0.200.0 when the gates pass.
