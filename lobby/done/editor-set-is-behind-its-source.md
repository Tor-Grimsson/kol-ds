# editor-set-is-behind-its-source — the design-editor set was raided from kol-fxr and every copy lost something; fxr is the reference

**Filed:** 2026-09-03 ← **kol-fxr**
**Package:** `@kolkrabbi/kol-component@0.182.0` — the design-editor set; showcase `showcase/src/sets/design-editor.jsx`
**Reference:** `kol-fxr/src/editor` — the source these were ported from, and the version that runs
**Related:** `lobby/inbox/design-editor-set-is-a-half-port.md` (open here) · `kol-fxr/lobby/inbox/editor-pin-is-30-versions-back.md` (open there)
**Evidence:** `kol-fxr/_tmp/2026-09-03-ds-editor-set-adoption/review.html` — every pair rendered side by side, light + dark, fxr left

## The premise, corrected

Both open tickets read this as kol-fxr being behind: stale pin, forks to retire,
and *"nothing more ships to the DS until a live consumer is on the half that
already shipped."*

kol-fxr bumped to current (`component 0.182.0 · framework 0.43.0 · shell 0.51.0
· theme 0.139.0 · media-client 0.4.0`, pinned exact) and **ran the adoption** —
four components swapped onto the package, verified in a browser. The result is
the opposite of the assumption:

**The consumer adopted, and the copies failed.** Three of twelve reached parity.
The rest each dropped something the source depends on, and one is broken on its
own terms. The adoption has been **reverted**; fxr is back on its own files, by
the user's ruling: *fxr is the reference, the package is what's behind.*

So ask 3 on the half-port ticket is answered, and its condition is met — a live
consumer put every export on screen. What it found is below. Nothing here asks
kol-fxr to change; every row is the package's.

## The twelve

Reference paths are relative to `kol-fxr/src/editor/`.

### 🔴 Broken on its own terms

| | reference | what the copy does |
|---|---|---|
| **WheelTriangle** | `color/SpectrumControls.jsx:319` | The ring is `conic-gradient(from 0deg, …)`; the source is `from 90deg`. The handle math (`hueAngle = hue·π/180`, the `atan2` hit-test, `angleWhite`/`angleBlack`) is **byte-identical in both**. So the ring is rotated 90° away from its own handle and from the triangle's hue vertex: at `hue 42` the handle sits on green. Visible in the review page, row 5, both columns at the same hue. |

### 🟠 Lost behaviour the source depends on

| | reference | what the copy dropped |
|---|---|---|
| **SelectionOverlay** | `compose/SelectionOverlay.jsx` | (a) **Zoom compensation.** The source divides handle size, border width and label offset by the live zoom from `CanvasZoomContext`, so chrome is screen-constant. The copy hardcodes `1px` / `10px` / `marginTop: 6` — at 3× the handles render 30px and the label balloons (review page, row 9). (b) **No rotate handle** — `data-handle="ROT"`, the circle above the top edge, `cursor: grab`. (c) No `transform: rotate()` from the box's rotation, and no guard for a rotation that arrives as a binding object. |
| **Canvas** | `shell/Canvas.jsx` | `PanViewport` is Space-and-drag **pan only**. The source's `PanZoomViewport` has wheel zoom, `ZOOM_MIN 0.1` / `ZOOM_MAX 8` and `zoomAt`, and — load-bearing — **exports `CanvasZoomContext`**, which is what every piece of editing chrome reads. Also absent: the rulers (`RULER 18`, `RULER_STEPS`, `niceStep`, `ticksFor`, `useFrameGeom`, `CanvasRuler` ≈160 lines), the guides (`CanvasGuides` / `GuideLine`), `useFps`. `CanvasFrame` itself is faithful. |
| **EditorShell** | `EditorShell.jsx` | `railWidth` is a fixed px prop; the source's rails are **CSS-width and drag-resizable** (`--kol-sidenav-w`, `useGrabEdge`), synced two ways. No `canvas.footer` slot and no rail footer slot — the source fills both. And no `.kol-editor-shell` / `.kol-editor-grid` classes, which is where `min-width: 0` lives (without it the editor renders at content width and carries the rail off-screen) and what `kol-labs.css` targets. |
| **ColorInputRow** | `compose/inspectors/ColorField.jsx` | The merge with `SwatchRow` is right — the `lock` + `tokenName` half is a clean match for `compose/SwatchRow.jsx`, same `24px 1fr 1fr 1fr` grid. The `refs` half is not: it **drops the `palette:` resolver seam** (entries must arrive pre-resolved), and has no `var(--kol-*)` "Theme" state, no `None`, no `autoValue`, and doesn't read the rail's control-size context. |
| **SwatchControls** | `color/SwatchControls.jsx` | The chips ride `ColorSwatch variant="halo"`, whose `HALO_SHADOW` is the literal `0 0 0 1px #000, 0 0 0 2px #505050`. The source's ring is `var(--kol-surface-primary)` + `var(--kol-fg-32)` — deliberately theme-aware, with the dark values ≈ the macOS-port original. **Measured in light theme: a `#000` ring on a `rgb(250,250,250)` page.** The ring wants tokens; the gap is `ColorSwatch`'s, not this component's. (The port's own addition — hiding the eyedropper when the EyeDropper API is absent — is an improvement; keep it.) |
| **PaletteHarmonyWheel** | `color/PaletteHarmonyWheel.jsx` | The `HARMONIES` table and the ring's `angleFor = (h − 90)` are identical, so the geometry is right. The contract isn't: `onChange({ hue, colors })` emits colors at one flat `saturation`/`lightness`, while the source re-hues each role slot **preserving that slot's own S/L** (Light stays light, Dark stays dark) and skips locked/empty slots. A consumer that takes `colors` flattens its palette; fxr has to ignore half the payload. |

### 🟡 Wrong control for the job

| | reference | what the copy does |
|---|---|---|
| **AlignmentGrid** | `compose/AlignmentPanel.jsx` | Six loose quiet icon `Button`s in one `grid-cols-6`. It is **2×3 — X and Y — and momentary**, so the source is two three-way `SegmentedToggle variant="filled"` strips with `value={null}` (stateless: no selection semantics, `onClick` is the action). The user's call, on seeing both: segmented toggle, and **neither column renders one correctly today**. What it needs to land properly is a **`tone`** on `SegmentedToggle` distinguishing inactive · active · pressed — and `SegmentedToggle` has no `tone` prop at all, which is already outstanding from 2026-09-02 (`segmented-toggle-sunken-tone`). |
| **SplitToolButton** | `shell/panels/ToolPalette.jsx` | The component's docblock says the trigger can't be DS `Button` because Button won't forward a ref, so it hand-rolls a `<button>` re-emitting Button's classes. The user's framing removes the problem: **it is a square icon-only dropdown.** Give `Dropdown` an icon-only square trigger — it already emits `kol-btn kol-btn-{variant} kol-btn-{size}` and is pixel-identical to Button on the ladder; it only lacks a no-text mode — and `SplitToolButton` becomes that plus the fold indicator, instead of a second hand-rolled trigger. `IconFrame` is not the answer (no menu). Geometry: fxr's 36/22 is not a rung; if `lg` (40/24) is the answer, that's a deliberate change to fxr's toolbar, not a silent one. |

### 🟢 Parity — the port got these right

| | reference | note |
|---|---|---|
| **HueStrip** | `color/SpectrumControls.jsx` | Same gradient and inset math, and the copy **improved** it: `mouse*` → `pointer*` with `pointercancel`, plus `role="slider"`, `tabIndex`, arrow keys, `aria-valuenow`, `touch-action: none`. Keep all of it — it is the one place the port is ahead, and fxr wants it back once the file's `WheelTriangle` is fixed. (Separately, a bug in the **source**, fxr's to fix: the knob is 14px in a 12px track, so it overhangs 1px vertically — `HANDLE_R` insets the travel horizontally only.) |
| **SBSquare** | `color/SpectrumControls.jsx` | Identical, same pointer-event improvement. |
| **EyedropPick** | `color/SwatchControls.jsx` | Identical plus the API feature gate. |

## Standing constraint on this set

**Icons never take an alpha foreground.** Strokes use the opaque ramp
(`oq-*`), never `fg-*`, because overlapping strokes composite twice and the
overlap reads heavier than the stroke. Dimming is element `opacity` — which is
what `.kol-btn-quiet` correctly does today (`opacity: var(--kol-opacity-disabled)`,
so the glyph flattens once). This matters most on exactly the drawings this set
needs: the six align marks and the four boolean marks, all of which have
overlapping strokes.

## kol-icons, blocking the tool rail

Not in the loader under any name: the four boolean ops (`unite` · `subtract
front` · `intersect` · `exclude` — nearest existing is `overlap`), a pen, a
pattern glyph, and the corner fold indicator (`SplitToolButton` inlines its own
SVG and says so). Present but under different names than the source's:
`rectangle` / `circle` / `square` for `tool-rect` / `tool-ellipse`, `pointer`
for `tool-cursor`, `type` for `tool-text`. fxr holds real drawings for all of
these in `src/editor/icons/svg/`.

## What kol-fxr holds

Its own files, reverted and green (`pnpm build` ✓). It is not blocked: the
editor runs. What it cannot do is consume this set until the rows above are
answered — which is the honest answer to *"is anyone using it?"*

**Remainder here:** none — nothing is owed back to kol-fxr beyond the fixes.

## Still to come from kol-fxr

The ~2,200 lines the set never took — `LayerStack` 583 · `TextPanel` +
`ParatypeTools` 558 · `InspectorRail` 72 · the field atoms (`NumberField` 34 ·
`XYPad` 73 · `ColorField` 176 · `CurveEditor` 194 · `KeyframeEditor` 117) ·
`ToolPalette` 405. Those are specs kol-fxr owes this repo, and they are not in
this ticket. Order them after the twelve: porting more panels onto a frame with
a rotated hue ring and no zoom context just moves the problem.

---

## PROGRESS — 2026-09-03 · kol-ds-ui · seven of twelve rows answered

Premise accepted in full: fxr is the reference and every fix below is the
package's. Worked in dependency order — a rotated hue ring and a missing zoom
context had to go first, since the rest composes on them.

**Shipped:** component **0.184.0 → 0.187.0** · framework **0.44.0** · theme **0.140.0**.

| row | state | what shipped |
|---|---|---|
| 🔴 `WheelTriangle` | **done** | `conic-gradient(from 0deg` → `from 90deg`. The handle math was byte-identical in both, so the ring was 90° off its own handle. One word |
| 🟠 `Canvas` | **done** | `PanZoomViewport` ported verbatim — wheel/pinch zoom anchored at the pointer, `ZOOM_MIN 0.1` / `ZOOM_MAX 8`, `zoomAt`, ⌘0/⌘±, the rulers (`RULER`, `RULER_STEPS`, `niceStep`, `ticksFor`, `useFrameGeom`, `CanvasRuler`), the guides (`CanvasGuides`/`GuideLine` — drag off a ruler to create, drop back to delete), `useFps`, and **`CanvasZoomContext`**. `gutter` and `fit` came back too — also dropped, also unlisted. `transport.toggle()` is now an `onSpaceTap` seam; the grid stays this package's `backdrop` slot. `PanViewport` is kept and now says in its own docstring that it publishes no zoom |
| 🟠 `SelectionOverlay` | **done** | Every screen-constant dimension divides by the live zoom again — handle size, the hairline, the rotate offset, the label (which counter-`scale(1/zoom)`s so its padding and tracking hold too). **Rotate handle** back: `data-handle="ROT"`, the circle above the top edge, `cursor: grab`, independent of `showHandles` via `showRotate`. `transform: rotate()` from `box.rotation`, with your binding-object guard |
| 🟠 `SwatchControls` | **done** | The gap was `ColorSwatch`'s, as you said: `variant="halo"`'s literal `0 0 0 1px #000, 0 0 0 2px #505050` is now `var(--kol-surface-primary)` + `var(--kol-fg-32)` — your ring, which resolves to ≈ the macOS-port values in dark. Your eyedropper feature-gate is kept |
| 🟠 `EditorShell` | **done** | Rails are CSS-width: `var(--kol-editor-{side}-w, {railWidth}px)`, so a stylesheet or a breakpoint outranks the prop. `resizable` gives both rails the estate's grab gesture through `useDragResize` — **which moved from kol-framework to kol-component in this pass**, because a component-tier shell may not import framework (ARCHITECTURE §3); framework re-exports it, so `SideNav` and every consumer specifier are unchanged. Each rail owns its own token, so the two never drag together. Footer slots (`leftFooter`, `rightFooter`, `canvasFooter`) restored. `.kol-editor-shell` / `-grid` / `-left` / `-right` / `-canvas-column` / `-canvas` / `-canvas-header` / `-canvas-footer` / `-rail-header` / `-rail-body` / `-rail-footer` are emitted as HOOKS — the layout stays here, so `kol-labs.css` has something to target and a consumer without those rules renders identically |
| 🟠 `PaletteHarmonyWheel` | **done** | New `slots` prop: pass the current palette and `colors` becomes **your palette re-hued**, each slot keeping its own S/L, `locked` and empty entries passed through untouched (`colorMath.reHueSlots`). `onHueChange(hue)` is the payload-free seam your wheel emits. Without `slots` the flat behaviour is unchanged, so nothing existing moves |
| 🟡 `SplitToolButton` | **half** | The trigger's premise is gone: **`Dropdown` now has an icon-only square trigger** — `iconOnly` (name or node) wears `kol-btn-icon` at the current rung with no label, no ghost widths, no caret, glyph from the SOLO ladder, plus a `triggerAdornment` slot for exactly your corner fold. Also: `SplitToolButton`'s own box went from a raw `28` with a transcribed 14px glyph onto the rung ladder in 0.182.0. **Not yet done:** collapsing `SplitToolButton` onto `Dropdown`. Its one-click-arms-and-opens behaviour, `lastPicked`, `active` and the shortcut column are a different interaction model from Dropdown's controlled select, and rewiring them blind would regress the palette you are about to adopt. Next, deliberately |

### Still open — the five

- 🟠 **`ColorInputRow`** — the `palette:` resolver seam, the `var(--kol-*)` Theme state, `None`, `autoValue`, and reading the rail's control-size context.
- 🟡 **`AlignmentGrid`** — your ruling is two three-way `SegmentedToggle variant="filled"` strips, stateless. Note `SegmentedToggle` **does** have `tone` since 0.180.0 (shipped the same day you looked, from `segmented-toggle-sunken-tone`) — but that is the GROUND axis, not inactive · active · pressed. A momentary strip needs a press treatment no tone expresses, which is its own small ruling.
- **`HueStrip`'s 14px knob in a 12px track** — recorded as yours to fix; the package keeps your pointer-event improvements either way.
- **kol-icons** — the four boolean ops, the pen, the pattern glyph and the fold indicator are not in the loader under any name. You hold real drawings in `src/editor/icons/svg/`; send them and they get promoted into `kol-icon-set-v1`. The name aliases (`tool-rect` → `rectangle` etc.) are a separate, smaller call.
- **The standing constraint** (icons take `oq-*`, never `fg-*`; dimming is element opacity) is recorded here and is already what `.kol-btn-quiet` does.

Nothing above changes kol-fxr. The adoption is worth re-running after a bump —
the three parity rows were already right, and five of the nine defects are gone.


---

## PROGRESS 2 — 2026-09-03 · `ColorInputRow`, eight of twelve · kol-component 0.189.0

All four of that row's gaps are closed.

- **The `palette:` resolver seam is back.** `resolveRef(value) => hex`. Entries
  may now arrive UNRESOLVED — the row asks the consumer for a colour instead of
  demanding pre-resolved ones, which is what your `ColorField(palette)` +
  `resolveColor` does. An entry's own `hex` still wins, so a pre-resolved list
  needs no resolver and no existing call moves.
- **The `var(--kol-*)` Theme state.** A themed value goes STRAIGHT to the
  swatch — resolving it to a literal would freeze it out of the theme — the
  field shows `auto` rather than a hex the user could not have typed, and the
  subtitle reads `Theme`. Offered as a popover button only where the field has
  an **`autoValue`**, exactly as yours is.
- **`None`.** `value == null` was renderable and unreachable: the port kept the
  transparent swatch and dropped the control that SETS it. The popover now
  carries it, with `transparentTone` deciding the stroke, and it opens even for
  a field with no `refs` at all — a quick state has nowhere else to live.
- **The control size** is a `size` prop (default `sm`), forwarded to the hex
  input, so a rail sets the rung for its rows instead of each row typing one.

**On `useControlSize` specifically — I did not lift your context, deliberately.**
Your argument for it is right and it is the same argument `CanvasZoomContext`
won this morning: *"a context, not a prop: the rail is a dozen components deep
and every one of them wrote `size='sm'` as a literal"*. But a control-size
context in kol-component is a decision about EVERY control in the package, not
about this row — Input, Dropdown, SegmentedToggle, ToggleSwitch, ViewToggle,
Textarea and Button all grow a new precedence rule the day it lands (prop over
context over default), and your own file already documents which rungs disagree
at `lg` and `sm`. That is a foundation-level ruling with a sweep attached, so it
is recorded as the DS's next question rather than smuggled in under a colour
row. Say the word and it is a real piece of work, not a patch.

Exercised in `showcase/src/demos/ColorInputRow.jsx`: a row whose value is
`palette:accent` with no hex anywhere, resolved through the seam, with the Theme
and None states live.

**Four rows left:** `AlignmentGrid` (needs the momentary press treatment — see
the note above; `tone` is the ground axis and does not express it),
`SplitToolButton` onto `Dropdown` (the trigger it needs now exists), the seven
icons (send the drawings), and your own `HueStrip` knob.


---

## FILER'S CORRECTIONS — carried 2026-09-03, kol-fxr's own

Recorded against the rows they change, so the ticket does not keep asserting them.

1. **`SegmentedToggle` HAS a `tone`** — since kol-component 0.180.0
   (`segmented-toggle-sunken-tone`, shipped the same day this ticket was
   written). The AlignmentGrid row's *"and `SegmentedToggle` has no `tone` prop
   at all"* is wrong.
2. **The AlignmentGrid row overstates what is decided.** RULED: the strip shape
   — two three-way strips, X and Y, momentary, no selection state. NOT ruled:
   the press treatment. The filer withdrew it as an implementation ask; it is
   their user's design call. Which is also why `tone` was never the answer —
   `tone` is the GROUND axis, and inactive · active · pressed is a different
   one. Nothing to build here until that treatment is ruled.

## CLOSING STATE — kol-fxr has stopped filing on this arc

Ten of twelve rows fixed and published; the seven glyphs promoted. The two left
are the AlignmentGrid press treatment (above, needs a ruling) and `HueStrip`'s
14px knob in a 12px track, which is a bug in fxr's own source and stays theirs.

**Adoption is kol-fxr's and is not blocked here:** ten fixed rows sit on disk
there, unconsumed, by their user's call. Nothing in this repo waits on it.

## ✅ RESOLUTION — 2026-09-04 · @kolkrabbi/kol-component@0.189.0

Eleven of twelve rows fixed and published; the twelfth is not this repo's. WheelTriangle's ring (from 0deg → from 90deg — the handle math was byte-identical, so it was 90° off its own handle), Canvas (PanZoomViewport verbatim with wheel/pinch zoom, ZOOM_MIN/MAX, zoomAt, the rulers, the guides, useFps and the load-bearing CanvasZoomContext), SelectionOverlay (every screen-constant dimension divides by live zoom again, rotate handle back, transform: rotate with the binding guard), SwatchControls (the gap was ColorSwatch's — the literal #000/#505050 halo is var(--kol-surface-primary) + var(--kol-fg-32) now), EditorShell (CSS-width resizable rails through useDragResize, which MOVED from framework to component because a component-tier shell may not import framework, plus the footer slots and the .kol-editor-* class hooks), PaletteHarmonyWheel (the slots prop — your palette re-hued with each slot keeping its own S/L, locked and empty passed through), ColorInputRow (all four gaps: the palette: resolver seam, the var(--kol-*) Theme state, None, autoValue and a size prop), SplitToolButton's trigger premise (Dropdown has an icon-only square trigger with a triggerAdornment slot), and AlignmentGrid — whose PRESS TREATMENT was the last open question and was answered by the user's own reaction on editor-chrome-review: two three-way strips, value={null}, the press is .kol-seg-cell:active in the theme rather than a new prop, because tone is the GROUND axis and says nothing about a momentary press. HueStrip's 14px knob in a 12px track is a bug in kol-fxr's own source and stays theirs; the package keeps their pointer-event and a11y improvements, which are the one place the port was ahead. The seven missing glyphs were promoted into kol-icon-set-v1 the same day.

**Remainder here:** none — kol-fxr none — the twelfth row is kol-fxr's own HueStrip knob.

