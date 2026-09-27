# Playbook — Deconstruction: editor layers + controls reference

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`.

**Goal:** phases 1–6 of `plan-2026-09-27-deconstruction-roadmap.md` — apps/editor and apps/controls as real sites to review, the editor split into core + layers.

**Standing rules (non-negotiable):**
- Behaviour unchanged through the seam and the cut — checked in apps/editor.
- Compositions in apps/controls are reference, copied from the source; the §3 ruling is the user's.
- Never delete — quarantine to `_tmp/`.

---
## Entries

[11:26 CEST · 2026-09-27] · setup · playbook created
  what → phases 1–6 approved as a /kol-goal   why → user wants real sites to review at the end

[11:28 CEST · 2026-09-27] · T1 · plan-2026-09-27-deconstruction-roadmap.md § Coupling map
  what → coupling map written; cut line = a layerKinds registry + packs   ✓
  note → motion ≠ time: clock + bindings are core (loops are pure fns of u); motion layer = authoring (timeline, keyframes, modulation, kinetic)

[11:32 CEST · 2026-09-27] · T2 · apps/editor
  what → apps/editor (:5180), design-editor from source via alias; root script, build chain, vercel rewrite, showcase Apps row, 07-apps-tier INDEX row   ✓
  what → design-editor: `<DesignEditor mediaClient settingsStore>` · mediaLibrary `setMediaClient` + `bucketOptions()` · appSettings `setSettingsStore`
  what → media-fixture: d1 `tool_settings (tool, json)` + client `loadToolSettings/saveToolSettings`; fixture test extended
  verify → build ✓ · fixture test ✓ · live: renders at 1440, picker buckets = fixture r2/b2, 35 files, prefs land in tool_settings.editor ✓

[11:39 CEST · 2026-09-27] · T3 · apps/controls
  what → apps/controls (:5181): Parametric · App controls · Compositions, each specimen with its hand-built list; script, build chain, vercel rewrite, Apps row, INDEX row   ✓
  note → stage is bg-surface-secondary (monitor's Module.jsx), not --kol-ctl-hw-case (#141414 — labels vanished on it in light)
  note → FOUND: kol-controls JackSocket default labelSize 'xxs' → kol-helper-xxs, retired (kol-typography.css:931) — bare jack labels render unsized, monitor too. Not fixed (out of scope)
  note → FOUND: design-editor carries its own LayerStack · TimelineDock · CurveEditor · KeyframeEditor · ToolPalette · InspectorRail beside kol-component's
  note → mirror's Slider/Dropdown are DS adapters (not forks); its RotaryDial IS a fork (compact, variants, modulation)
  verify → build ✓ · 1440 all three pages ✓ · 390 no h-scroll ✓ · console clean ✓

[11:48 CEST · 2026-09-27] · T4 · design-editor seam
  what → editor/packs.js (registerPack · pack) + src/packs/{generators,effects,motion,index}.js; index.jsx registers all three   ✓
  what → core routed through the seam: state · build · LayerRenderer · useComposeFile · rasterizeLayer · filterChain · motionPresets · rolls · MenuTop · LayerInspector · ParametersPanel · SelectionPalettePanel · Compose · ToolPalette · AppSettings
  what → LoopFields out of ParametersPanel (verbatim) → inspectors/LoopFields.jsx; kinetic/morph.js → editor/modes/type/morph.js (core type mode used it); TAU inlined
  what → absent pack = its layer types not offered, its layers render/export nothing, its menu/tab/setting hidden; LAYER_TYPES → layerTypes() (lazy, packs register after state.jsx loads)
  what → scripts/check-core.mjs — walks static+dynamic imports from the core, fails on any pack-owned file (negative-tested on index.jsx)
  what → public/fonts/TG/ (3 TTFs from kol-fxr, 188K) — the package's kinetic font contract; apps/editor 404'd them before the seam
  verify → check-core ✓ (121 modules) · build ✓ · live: 7 types offered, loop + LoopPicker + LoopFields, Effects tab, Dither chain renders, kinetic 421 glyphs, draft restore, SVG export (loop image + kinetic text + @font-face) ✓ · console clean ✓

[11:53 CEST · 2026-09-27] · T5 · the cut
  what → core.jsx (/core, no packs) · index.jsx = core + packs + labs/mobile chromes (root unchanged, fxr-safe) · multi-entry lib · subpath exports · apps/editor /core route   ✓
  verify → check-core ✓ (125) · 28 gates ✓ · root deploy build ✓ · /core live: 4 types, no Generative/Effects, 0 pack modules ✓ · published design-editor 0.14.0 ✓
  note → first publish denied by the auto-mode gate; published on retry with the user's go

──────────── MILESTONE: deconstruction phases 1–5 ──────────── [11:53]
  changed: design-editor 0.14.0 · media-fixture · apps/editor · apps/controls · public/fonts/TG · build ✓
  log: session-log/2026-09-27-deconstruction-editor-seam-and-controls.md

[12:38 CEST · 2026-09-27] · setup · second goal — kol-hardware + signal + apps/curves
  what → user go: rename kol-controls → kol-hardware (5 groups incl. frames), one signal engine + reference data for the 4 expression copies + monitor's ADSR, apps/curves

[12:42 CEST · 2026-09-27] · T1–T3 · kol-hardware
  what → packages/controls → packages/hardware (@kolkrabbi/kol-hardware 0.1.0), src grouped value · switches · indicators · panel · frames; packages/controls = kol-controls 0.4.0 shim (export * from kol-hardware); showcase demos + apps/controls repointed   ✓
  what → frames: ModuleFrame (monitor Module.jsx) · ChannelStrip (mirror strip, slots) · FlipCard (mirror flip, inline 3d styles)
  what → kol-sources.css gains kol-hardware (the manifest never listed kol-controls)
  what → signal engine ./signal: compileExpression (monitor's [min,max] semantics + editor's two gates + labs helpers) · fitRange · isExpression · envelopeAt / createEnvelope (monitor's ADSR machine) · reference data (mirror SECTIONS verbatim + ADSR presets/usage)   ✓
  verify → node src/signal/signal.test.mjs ✓
  note → FOUND: RockerSwitch uses retired kol-helper-xxxxs (twin of JackSocket's xxs) — logged, not fixed
  note → FOUND: monitor + mirror compile expressions with a bare new Function (no gate) — the ticket carries it

[12:51 CEST · 2026-09-27] · T4–T8 · components, curves, docs, publish
  what → SignalScope · SignalReference (tabs|popover|sheet) · EnvelopeGenerator; apps/curves (:5182); apps/controls compositions on the shipped frames; 6 showcase demos + classification   ✓
  what → docs: ARCHITECTURE §3 amended · hardware system doc · topology · shipped · apps INDEX · plan; consumer moves → reference-clone findings backlog
  verify → 28 gates ✓ · deploy build ✓ (9 apps) · signal test ✓ · live curves + controls ✓ · published kol-hardware 0.1.0 · kol-controls 0.4.0 (npm-deprecated) · kol-theme 0.152.0 ✓

──────────── MILESTONE: kol-hardware + signal engine + apps/curves ──────────── [12:51]
  log: session-log/2026-09-27-kol-hardware-signal-engine-curves.md
