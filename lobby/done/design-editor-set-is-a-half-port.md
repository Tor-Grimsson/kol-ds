# design-editor-set-is-a-half-port — the set took the editor's frame and stopped before every panel the editor actually is

**Filed:** 2026-09-03 ← **kol-client-olina**
**Package:** `@kolkrabbi/kol-component` — the design-editor components; showcase `showcase/src/sets/design-editor.jsx`
**Source:** `kol-fxr/src/editor` — the editor these were raided from (every ported file's docstring says so: *"Ported from the brand editor with the app couplings dropped (per lobby spec)"*)
**Origin:** the user, reading `/sets/design-editor` against the running editor: *"you only half finished the editor."*

## What shipped

`EditorShell` · `Canvas` / `CanvasFrame` / `PanViewport` · `SelectionOverlay` ·
`AlignmentGrid` · `TabsRow` · `ColorInputRow` · `SwatchControls` ·
`SpectrumControls` · `PaletteHarmonyWheel` · `InspectorSection` ·
`PropertyInput` · `SplitToolButton`.

That is the **frame** — the layout, the stage, the selection chrome, and a
handful of loose atoms. It is everything an editor has except the editor.

## What did not

Measured against `kol-fxr/src/editor`:

| Not in the DS | Source | Lines |
|---|---|---|
| Layers panel — Canvas root row, drag-reorder, group collapse, inline rename, hover-revealed eye + lock, Layers/Assets tabs | `compose/LayerStack.jsx` | 583 |
| Type controls — width/weight/case/italic, Size · Tracking · Line-height as slider+value triples, swatch palette grid, variable axis, Copy CSS / Save to library / Download SVG | `compose/inspectors/TextPanel.jsx` + `ParatypeTools.jsx` | 558 |
| The inspector rail itself — routes by selection: empty · canvas · one layer · multi-select | `compose/InspectorRail.jsx` | 72 |
| Field atoms the panels are built from | `NumberField` 34 · `XYPad` 73 · `ColorField` 176 · `CurveEditor` 194 · `KeyframeEditor` 117 | 594 |
| The tool rail as a component — the DS shipped `SplitToolButton`, the *button*; the rail around it is still app code | `shell/panels/ToolPalette.jsx` | 405 |

~2,200 lines, and it is the half a person actually touches. `AlignmentGrid`,
the one panel that did make it, is 28 lines in the source — the smallest thing
in the list.

## The tell

`kol-fxr/src/editor/shell/panels/ToolPalette.jsx` does **not** import
`SplitToolButton`. It hand-rolls the same trigger out of `PopoverPanel` +
`usePopover`, at `BTN = 36 / ICON = 22` against the DS component's 28. So the
source of the port is not running the port. That is worth knowing before more
is ported: something shipped that the one consumer who needed it did not take.

## The ask

Same shape as `styleguide-barrel-is-unimportable`, filed the same day, and the
user's ruling there applies here too — *"ask ds which repo use if any, and if
none, then we shold just change them to WORK."*

1. **Who consumes the design-editor components today?** If the answer is
   nobody — and `ToolPalette` suggests not even kol-fxr — then the set is
   decoration, and finishing the port is the wrong next move until that is
   fixed.
2. **Why didn't kol-fxr adopt `SplitToolButton`?** 36 vs 28 px is a sizing
   argument that a prop settles. If there is a real reason, it belongs in the
   component's docs; if there isn't, kol-fxr should be on it and the answer
   tells you how much of the rest of this port would actually land.
3. **Then port the panels**, in the order they carry weight: the inspector rail
   and its field atoms first (everything else composes from them), then Layers,
   then Type controls, then the tool rail.

## Consumer status

Nothing local. `kol-client-olina` does not run this editor — the request came
from the user looking at `/sets/design-editor` beside the real thing. This repo
has no fork to retire and nothing blocked; it is filed because the gap is the
DS's to see, not because anything here waits on it.

---

## FINDINGS — 2026-09-03 · kol-ds-ui · asks 1 + 2 answered, ask 3 held

**Ask 1 — who consumes the design-editor set? Nobody consumes the editor half.**
Swept every repo under `~/dev/projects` for imports of these names *from the
package* (local forks named `src/editor/EditorShell.jsx` etc. are the ancestors,
not consumers):

| | External importers |
|---|---|
| `EditorShell` · `Canvas` / `CanvasFrame` / `PanViewport` · `AlignmentGrid` · `SplitToolButton` · `InspectorSection` · `PaletteHarmonyWheel` · `SwatchControls` · `SpectrumControls` | **none** — showcase + workbench only |
| `ColorInputRow` | kol-client-olina `apps/brand` → `decks/SlideInspector.jsx` |
| `PropertyInput` | kol-website `apps/brand` → `pages/Components.jsx` |
| `SelectionOverlay` | **none.** olina's `decks/SlideStage.jsx` hand-rolls kol-fxr's `CanvasArea` pointer router instead |

So the two loose atoms with real consumers are the two that were already
general-purpose. Every genuinely editor-shaped export has zero.

**Ask 2 — why didn't kol-fxr adopt `SplitToolButton`? Not a sizing argument, a
stale pin.** kol-fxr is on `@kolkrabbi/kol-component@0.152.0`; the editor set
shipped later, so the component was never on its disk. Its editor imports only
generic atoms (`LabeledControlSection`, `Dropdown`, `Slider`, `Stepper`,
`PopoverPanel`, `usePopover`) — it is not declining the port, it cannot see it.
Worth noting the ticket's premise was already half-answered: `SplitToolButton`
has had a `size` prop since it shipped.

**Shipped anyway, because the sizing half was a real defect — kol-component
0.182.0.** `size` took a raw px number defaulting to **28**, with the glyph
hard-typed at **14**: off the 22 · 26 · 32 · 40 ladder, in a set whose whole
point is that one row is one box, and a transcribed glyph where
`glyphLadders.SOLO` should decide. It now takes a rung (`xs|sm|md|lg`, default
`md`), wears `kol-btn-icon kol-btn-{size}` like every other pinned square, and
reads its glyph from SOLO. kol-fxr's bespoke 36/22 is **not** reproduced — 36 is
not a rung; the DS answer is `size="lg"` (40/24). The showcase demo was doing
the same thing three times over (`style={{ width: 28, height: 28, padding: 6 }}`
+ `iconSize={14}` on two DS Buttons), which is what a consumer copies — now
`size="md"` throughout, no call site naming a glyph.

**Ask 3 — the ~2,200-line port is NOT started, by this ticket's own condition:**
*"If the answer is nobody … then the set is decoration, and finishing the port is
the wrong next move until that is fixed."* The answer is nobody. Held for the
user's ruling. The adoption fix that would come first is kol-fxr's pin — it is
30 versions back, and every question this ticket asks about kol-fxr's behaviour
is downstream of that.

---

## RECONCILED — 2026-09-03 · superseded in substance by two later tickets

- **Asks 1 + 2** were answered on this ticket the day it landed (see FINDINGS above).
- **Ask 3's condition was met by `editor-set-is-behind-its-source`**: kol-fxr
  bumped, adopted, and put every export on screen — a live consumer, which is
  what this ticket required before more porting. That ticket then found the
  copies behind the source; ten of its twelve rows are fixed.
- **The ~2,200-line panel port this ask named now lives in
  `editor-panels-the-held-specs`** — fxr's own spec for all seventeen, with
  the order to take them in. Work continues there, not here.
- **And the editor itself moved into this repo** as `@kolkrabbi/design-editor`
  (`packages/design-editor`, 0.3.1, user ruling 2026-09-03) — the assembled
  app, distinct from the component-tier parts the specs ticket covers.

Nothing on this ticket is still uniquely open. State is the user's.

## ✅ RESOLUTION — 2026-09-04 · @kolkrabbi/design-editor@0.11.0

Nothing on this ticket is still uniquely open, by its own reconciliation. Asks 1 + 2 were answered the day it landed. Ask 3's condition — a live consumer with every export on screen — was met by editor-set-is-behind-its-source, which is now closed at eleven of twelve rows. The ~2,200-line panel port this ask named moved to editor-panels-the-held-specs, where the work continues. And the editor itself moved INTO this repo as @kolkrabbi/design-editor by the user's ruling, so the half that was never ported is no longer a handoff between two repos — it is one package's own backlog. Closed as superseded in substance rather than as done: the porting continues on the specs ticket, and this entry no longer carries anything that is not tracked better elsewhere.

**Remainder here:** none — kol-client-olina none — superseded by editor-panels-the-held-specs.

