# Plan — the deconstruction roadmap

**Raised:** 2026-09-27 (user — "pool all the work of the last year and a half and get the cream of it")
**Status:** authored. Tracks 1 + 2 open first, together; every other track waits on the user's go.

---

## 0. The one sentence

Take the tools that grew inside single repos (fxr, monitor, mirror, the website's stack, the
text repos) and split them into DS packages, apps in `apps/` linked to the workspace, and a
visual reference that consumers can diff against.

---

## 1. Editor split (fxr → design-editor)

Today `@kolkrabbi/design-editor` ships everything: the editor, labs, mobile, output, `loops/`
(1.5M) and `kinetic/`. A consumer that only wants a canvas pays for motion.

- **Layers, not one package** (user, 2026-09-27): core (canvas, document, layers, export) with
  vector, generators, effects and motion as layers registering into it, and the chrome on top.
  Today motion is wired through the core: 25 files in `editor/` import `loops/`/`kinetic/`,
  including `compose/state`, `LayerRenderer` and `build.js`.
- **Static 2D core** is the package: canvas, layers, geometry, type, export. acyr's old
  editor is a reference for how far the core should reach.
- **Motion** (loops, kinetic, playback) becomes an opt-in layer on top of the core.
- **Public store API.** Labs moved into the package because it reads the editor's stores
  directly (fxr `App.jsx`). The chromes can only move out once those stores are a contract.
- **Labs and randomiser get their own apps** in `apps/`, linked to the workspace, so mobile
  work edits the DS live with no publish between. fxr goes on consuming the published
  packages.

### Action list (approved 2026-09-27)

1. **Coupling map.** Sort every `editor/` import of `loops/`/`kinetic/` into core · vector ·
   generators · effects · motion · chrome, and write the result here. That is the cut line.
2. **apps/editor (:5180).** `<DesignEditor />` from workspace source on `apps/media-fixture`
   (fake bucket + fake D1), the same pattern as brand and notes. The editor's preferences
   and settings go through the fixture client **keyed by tool** (today `d1.js` settings are
   keyed by bucket), so a real D1 later is one seam, not one per tool.
3. **The seam.** Layers register through `loops/registry.js`; the core stops importing them.
   Behaviour is unchanged, checked in apps/editor.
4. **The cut.** The core stays at `@kolkrabbi/design-editor`; layers move to subpaths
   (`/motion` first). They graduate to their own packages only if a consumer needs that.
5. **apps/controls draft (:5181).** See §2.
6. **Stop for review.** After that: the §3 ruling, the labs/randomiser apps, the curve generator.

Steps 1, 2 and 5 are independent and go first; then 3 and 4.

**Done 2026-09-27 (phases 1–5, one session):**
- **Deviation on 4 (the cut).** The ROOT entry stays the full editor, and the core ships at
  `@kolkrabbi/design-editor/core`. Moving the core to the root would break kol-fxr on its next
  bump, and fxr is reference-only on the MBP. Packs are `/generators` · `/effects` · `/motion`.
  The core's static JS is 1.2 MB against 2.2 MB full.
- **Deviation on 3 (the seam).** It is a pack registry (`editor/packs.js`: `registerPack` /
  `pack`), not a per-layer-kind registry. The core reaches the catalogs through three packs with
  null fallbacks. A layerKinds registry is the next rung if a fourth kind of layer arrives.
- `packages/design-editor/scripts/check-core.mjs` (`pnpm check:core`) is the proof: the core's
  import graph reaches no pack.
- **Findings for later tracks:** design-editor carries its own LayerStack · TimelineDock ·
  CurveEditor · KeyframeEditor · ToolPalette · InspectorRail beside kol-component's (the adoption
  gap, track 2); kol-controls `JackSocket`'s default `labelSize='xxs'` names the retired
  `kol-helper-xxs`, so bare jack labels render unsized (a DS bug, monitor too); mirror's
  RotaryDial is a fork (compact, variants, modulation assign).

### Coupling map (T1, 2026-09-27)

**The finding that reframes "motion".** A loop is a pure function of time `u∈[0,1]`
(`loops/contract.js`). Every generator is time-driven, so the **clock**
(`params/transport.js`) and **bindings** (`params/resolve.js`) are core, since the render
loop reads them for every layer. The layer that can come off is the motion **authoring**:
the timeline, the transport UI, keyframes, modulation sources and kinetic type. Without it
the clock simply never runs.

**The core reaches the catalogs through a handful of lookups.** Nearly every symbol is used
once (import + one call site):

| Layer | Catalog | What the core calls | Where |
|---|---|---|---|
| generators | `loops/registry` · `taxonomy` · `contract` | `loopById` `presetById` `presetParams` `presetsInGroup` `presetLayerPatch` `loopDrawParams` `drawLoopFrame` `GENERATIVE_TREE` | state, build, LayerRenderer, MenuTop, rolls, motionPresets, inspectors (LayerInspector, LoopPicker, ParametersPanel, ParatypeTools, ProfileEditor, RulesEditor) |
| effects | `filters/` | `filterById` `FILTERS` `makeSweep` `runChain` | state (×7), filterChain, rasterizeLayer, LayerRenderer, MenuTop, EffectsPanel, effectCategories |
| motion | `kinetic/` · `params/{TimelineDock,TransportBar,ModulationEditor,midi,gamepad,audioBands}` · `loops/gl/{phase,primitiveKeyframes,primitiveEasing}` | `kineticPresetById` `presetComp` `KineticType` fonts; TimelineDock in slot `canvas.footer`, TransportBar in EditorFooter | state, build, LayerRenderer, useComposeFile, KineticPanel, KeyframeEditor, Compose, EditorFooter |
| vector | `compose/{shape-math,path-math,boolean-ops}` · `modes/pattern` · `modes/type` | already in the core | — |
| chrome | labs · mobile · output | read the stores + every catalog | labs/*, mobile/*, OutputView |
| stray | `loops/lib/util` (`TAU`), `loops/lib/themes` (`THEME_OPTIONS`) | utilities parked in `loops/` | curveMath, AppSettings, KineticPanel, ParametersPanel |

**The layer types are the seam.** `state.jsx` `LAYER_TYPES` + `layerDefaults`,
`LayerRenderer`'s switch, `build.js`'s SVG switch, `labels.js` and ParametersPanel's branch
all switch on `layer.type`. Core types: background · photo · shape · path · bool · text ·
group · pattern. Generator types: loop · misc. Motion type: kinetic. Effects ride
photo/loop layers as a filter chain, not a type.

**The chrome already has a seam.** `Compose.jsx` hands `EditorShell` a slot registry
(`canvas.header`, `canvas.footer`, `left.body`, …). TimelineDock is one entry in it, so the
motion chrome can register itself there.

**Cut line:**
1. A `layerKinds` registry in the core: `{ type, label, defaults, Render, svg, inspector }`.
   The core registers its own types. `loop`/`misc`, `kinetic` and the filter chain register
   from their packs.
2. The catalogs are reached only through the kinds a pack registered. No core file imports
   `loops/`, `kinetic/` or `filters/`.
3. The utilities move out of `loops/lib` into `editor/lib`.
4. Motion authoring registers its slots (timeline, transport) and the kinetic kind.

## 2. Controls (kol-controls → apps/controls)

**Done 2026-09-27 (second goal):** kol-controls is **`@kolkrabbi/kol-hardware`** (user ruling),
grouped value · switches · indicators · panel · **frames** — the frames group is the §3 ruling,
recorded in ARCHITECTURE. `kol-controls` 0.4.0 re-exports it. apps/controls renders its
compositions from the shipped frames. Still open: fxr labs' sliders onto kol-hardware, and the
adoption tickets (§6).

"Controls" means every value changer, not just buttons: the parametric set as well as the
app atoms. `LabeledControl` is one of the most-consumed components (website, tools, settings).

- **apps/controls**, a visual reference:
  - **Parametric page:** knobs, faders, LEDs, jacks, rockers, panel dropdowns and inputs, chords.
  - **App controls page:** buttons, toggles, icons, `LabeledControl`, and the section panel
    (`InspectorSection` / `LabeledControlSection`, already used by labs params, the deck
    inspector and Hub settings).
  - **Compositions page:** monitor's module front (header + body + standard options),
    mirror's mixer channel with the front/back flip, screens, racks. Built as reference,
    not wired to anything.
- **⚠️ ARCHITECTURE §3 conflict.** §3 keeps module composition in the consumers. The proposal:
  presentational frames (module frame, channel strip, flip) move into kol-controls, while
  routing and render loops stay in the apps. This needs the user's ruling before §3 is amended.
- **fxr labs' sliders and knobs** move onto kol-controls.
- **The editor is the biggest source** (`packages/design-editor`): layer rows, effect panels,
  curve/keyframe/profile editors, params / `AutoControls`. They go into the reference
  alongside monitor and mirror.

**Overlap with 1:** labs' params panel is built from these controls, so the labs app is
where the two tracks meet.

## 3. Curve generator (the math generator → an app)

**Done 2026-09-27 (second goal):** the math generator and monitor's Env module are one thing — a
value over time — so they got one home: `@kolkrabbi/kol-hardware/signal` (one compiler, replacing
four drifted copies, plus ADSR and the reference as data) and `EnvelopeGenerator` over it.
`apps/curves` (:5182) is the reviewable tool; `SignalReference` renders the reference as tabs
(mirror), EX/REF popovers (monitor) or a sheet (labs).

- Its own app in `apps/`, since it's a tool and not editor chrome.
- One output (a value over time), two input modes behind a toggle: an **equation**, or an
  **ADSR envelope** (attack · decay · sustain · release).

## 4. Text track — parked

- Parked until the user downloads the three text / markdown repos.
- Scope: kol-website blog/stack (partly in sets already), the editor side of it, markdown
  styles, and this repo's doc frontmatter layout and rich-text styles.
- Goal: one parser (workshop's hand-rolled engine is the candidate), one prose stylesheet
  (`.kol-prose`) and one editor (DocumentEditor / kol-notes). Audit first, then decide what
  survives.

## 5. Monitor · mirror

- These stay apps. They lose only their shared UI: shell (done) and controls (track 2).

## 6. Adoption (applies to every track)

Publishing only reaches a consumer that already imports the thing. A layout that a repo
built inline never learns that the DS now has one. So:

- Each reference page in an app carries the reference to diff against, a short note on how
  to adopt it, and where it is currently hand-built.
- When a composition ships, a lobby ticket goes to every repo on that list. The lobby
  already reaches a repo's agent at boot, so no new subscription mechanism is needed.
