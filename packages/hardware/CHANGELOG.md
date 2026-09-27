# @kolkrabbi/kol-hardware

## 0.2.0 — 2026-09-27

- **Retired type classes gone.** `JackSocket`'s default label size named `kol-helper-xxs` and
  `RockerSwitch`'s housing letters `kol-helper-xxxxs` — both retired with the t-shirt scale, so
  those labels rendered unsized (kol-monitor's jacks too). Both are `kol-helper-8` now, and a
  consumer still passing a t-shirt `labelSize` gets 8 instead of nothing.
- **`EnvelopeGenerator` saves** — `onSave({ mode, code })` shows a Save button in both modes; an
  envelope's code is `a10 d30 s70 r50`, and picking it from Saved loads it back.
- **ADSR corners drag on the scope** — attack peak, decay → sustain, release end; the knobs follow
  and the window holds still while you drag.

## 0.1.0 — 2026-09-27

**Renamed from `@kolkrabbi/kol-controls`** (user: *"I like package hardware, its more descript
anyway"*). `kol-controls` 0.4.0 re-exports this package, so existing imports keep working; the
history below is kol-controls' up to 0.3.1.

- **Grouped: value · switches · indicators · panel · frames** — one folder per group under `src/`.
  Root imports are unchanged; deep paths (`@kolkrabbi/kol-hardware/*`) now include the group.
- **Frames, the fifth group** (ARCHITECTURE §3 amended the same day): `ModuleFrame` (kol-monitor's
  module front panel), `ChannelStrip` (kol-mirror's channel face, as slots), `FlipCard` (mirror's
  front/back flip). Presentational — routing, the rack and the render loop stay in the consumer.
- **The signal engine — `@kolkrabbi/kol-hardware/signal`**, plain JS: `compileExpression` (one
  compiler for the four drifted copies; helpers span `[min, max]`; two gates in front of the
  Function sink), `fitRange`, `isExpression`, `envelopeAt` / `createEnvelope` (kol-monitor's ADSR),
  and the reference as data (kol-mirror's sections, ADSR presets and usage). `pnpm test` checks it.
- **`EnvelopeGenerator`** — equation | ADSR over one `SignalScope`, with `SignalReference` beside it;
  `SignalReference` also renders as EX / REF popovers and as a sheet.

## 0.3.1 — 2026-09-25

- **Source matches npm again.** A comment on `ParamSheet`'s untinted backdrop (the 2026-09-03
  overlay-scrim sweep) sat in the tree unpublished; no behaviour change.

## 0.3.0 — 2026-09-01

- **`TextInput` · `PanelDropdown` · `Selector` retired** (ControlsXsRung,
  kol-monitor 2026-09-01). They were kol-component's `Input` · `Dropdown` ·
  `Stepper` at the panel rung, and that rung now exists — kol-theme 0.126.0 /
  kol-component 0.159.0 ship `size="xs"`, `Input onCommit` and `Stepper
  options`. No aliases: the user asked for a full swap, and a 0.x package with
  the twin one import away has nothing to alias. Sources kept in
  `_tmp/2026-09-01-controls-retired/`. `IconButton` stays — the lit border and
  the momentary pulse are hardware semantics the app button should not grow.
  The package is now exactly the set with no app twin: Knob · Fader · Toggle ·
  FlipToggle · LED · IconButton · PanelLabel · ModuleHeader · JackSocket ·
  LabeledJack · RockerSwitch · ParamSheet.

## 0.2.0 — 2026-09-01

- **Two seams for a wired jack** (ControlsJackSeams, kol-monitor 2026-09-01, found
  adopting 0.1.0 the same sitting). `JackSocket ringRef` — the RING element, a
  ref object or a callback, so drag-to-patch can register it for hit-testing
  instead of querying `[style*="border-radius: 50%"]` through the wrapper.
  `LabeledJack jackComponent` — the same shape as `iconComponent`, default the
  package's `JackSocket` — so a consumer whose jack is wired from its own context
  can still use the label layout and delete its local copy.

## 0.1.0 — 2026-09-01

- **First publish** (KolControlsPackage, kol-monitor 2026-09-01; user: *"make a
  controls package in the ds … it's mainly about mixer strips, knobs and stuff
  specific to modules, mixers and synth hardware"*). Fifteen exports lifted
  class-for-class from kol-monitor's `src/modules/parametric/` + the jack, the
  rocker and the long-press: `Knob` · `Fader` (was the rack `Slider`) · `Toggle`
  · `FlipToggle` · `LED` · `IconButton` · `Selector` · `PanelDropdown` (was the
  panel `Dropdown`) · `TextInput` · `PanelLabel` (was `LabeledControl`) ·
  `ModuleHeader` · `JackSocket` · `LabeledJack` · `RockerSwitch` · `ParamSheet`
  + `armLongPress`. Three renamed only where the name already lives in
  kol-component. Tokens renamed `--monitor-*` → `--kol-ctl-*`, values as ruled,
  in kol-theme 0.124.0's `kol-components-controls.css`. Consumer contexts became
  seams: `ModuleHeader powered`, `JackSocket`'s routing props, `iconComponent`.
  Modules, rack, routing and render loops stay in the consumers.

