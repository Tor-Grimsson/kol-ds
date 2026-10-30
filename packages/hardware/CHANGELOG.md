# @kolkrabbi/kol-hardware

## 0.10.0 — 2026-10-29

- `FlipCard` is kol-component's now (DocumentLibraryAndBoardParts); this path re-exports it, same props plus `height`, `defaultFlipped` and faces as functions. Needs kol-component ≥0.315.0.

## 0.9.1 — 2026-10-29

- **Contexts are made once** (WebsiteFrameContextStillSplit, kol-website): every `createContext` is created on a global key, `globalThis[Symbol.for('@kolkrabbi/<pkg>/<Name>')] ??= createContext(…)`. On Vite 5 a barrel's re-exports carry `?v=` and the package's inner imports do not, so a context module loaded twice and a provider and its hook held two contexts (kolkrabbi.io's `/work`). A second copy now hands back the first one's context. `validate-relative-imports` refuses a bare `createContext(`. No behaviour change.

## 0.9.0 — 2026-10-28

- **`TimeStrip` docks** (TimeStripInADock, kol-fxr): `framed={false}` renders in flow (no absolute position, border, padding, background or z; the host frames it); `span="loop"` makes the loop window the full width, so a lane's `t` 0..1 spans it (or `span={seconds}`); `gutter={px}` puts the readout in a left column that wide, starts the ruler and bar after it, and renders `children` full width beneath, so lanes with their own labels line up. Function children also get `origin`. Defaults are unchanged, so mirror's floating strip draws as before. Walked in the showcase at a 2 s and an 8 s loop: lanes and bar share their left edge and width, the head tracks the clock.

## 0.8.0 — 2026-10-28

kol-mirror's plan 19, three tickets (walked in the showcase and on rack-hub's stage):
- **The transport** (TransportAndTimeline — user: *"fxr uses the loop from transport controls. so its two components together … this should live in DS"*). `createTransport()` in `./signal`, plain JS: kol-mirror's clock (`now()` shaped seconds — rate, forward · reverse · ping-pong over the loop window, swing, ease, hold; play · pause · stop · home · end · seek · reset) as a factory, with kol-fxr's `phase()` (0..1), `epoch` (stop and home only) and `setLoopSeconds`; `seekToSeconds` for a scrubber. Checked in `signal.test.mjs`. Its face: **`TimeStrip`** and **`Scrubber`** (mirror's, now taking the `transport`; `children` under the bar for fxr's keyframe lanes) and **`useTransport`** · **`useTransportPlaying`** · **`useTransportNow`**.
- **`Modulatable`** (ModulatableControls — *"expression generator engine lives in DS, rotary dial lives in DS. nothing here is unique to mirror except that it homes modulation source"*): wraps a value control — kol-component's panel `Knob` or `Slider` — with mirror's expression readout (type `wave(t)`, it runs on the `clock`; ⌥-click clears) and its right-click modulation source (None · Expression A–D from the `bus`, the LED dot). **`useExpressionValue`** is the hook under it. A wrapper rather than props on the knob: kol-component cannot import kol-hardware's compiler, and `Knob` / `Fader` here are ledger aliases that may not gain behaviour.
- **`useFloating`** (UseFloatingHook — *"seems like DS should tho?"*): kol-monitor's floating-panel hook in frames, with mirror's one-line difference (`nwse-resize` passes, for a corner grip); `FLOATING_MIN_SCALE` 0.35 · `FLOATING_MAX_SCALE` 2.5. apps/rack-hub's stage runs on it.

## 0.7.0 — 2026-10-24

- **`FlipCard` swaps faces by backface, not by a clock** (FlipCardFaceSwap, kol-monitor 2026-10-24 — *"the card flipps, but the image snaps in once its landed. not believable."*). The timed `visibility` swap at duration / 2 left a blank card from edge-on (~a third of an `ease` turn) to the swap, and the back popped in near the end. Both faces hide their backface (`-webkit-` too), the back is pre-rotated in the preserve-3d turner, so the back shows exactly as the card passes edge-on at any `duration`; the face that is away is `inert` and aria-hidden — out of tab order, which is what the visibility had been for.

- **No `kol-helper-*` on a sentence** (kol-ds-ui `validate:helper-text`, 2026-10-23 — the helper scale is single-line chrome, 01-foundations/03-typography.md:29). Empty states and notes that are sentences wear `kol-mono-*` at the same size; labels are untouched.

## 0.6.1 — 2026-10-22

- **`EnvelopeGenerator` hides the clock controls under a host clock** (EnvelopeGeneratorHostClockControls, kol-mirror). With `now`, the transport row draws no Play/Pause, BPM or Trigger — the host's transport plays, sets the pace and restarts. Cycle stays: it still decides whether the host's time wraps over the pass or holds at the end. Without `now`, nothing changes.

## 0.6.0 — 2026-10-22

- **`SignalScope` draws the played part in the accent** (SignalScopePlayedTraceAndClock, kol-mirror). While live, the curve is faint and the trace up to the playhead, the playhead and its dot read `--kol-slider-playhead` — the accent unless a host overrides it, the slider's token. A static scope draws as before.
- **`now` — an external clock.** `SignalScope now={() => t}` reads its time from the host every frame (a desk transport); `rate` and `playing` stop applying. `useEnvelopeGenerator({ now })` forwards it to `EnvelopeGenerator`'s scope. Without it nothing changes.

## 0.5.0 — 2026-10-16

- **No native `title` anywhere** (HardwareNativeTitle, kol-monitor). `IconButton`, `JackSocket` and `ModuleHeader`'s remove / bypass dots show the DS `Tooltip`, attached to the element itself (`asChild`) — no wrapper, so grid geometry (`IconSelect`) does not move. A jack's tooltip is silent while a cable is pending (`pending` or `dimPending`), so patching never flashes tooltips. `IconButton` takes its `title` as `aria-label` too. The `title` prop keeps its name; no call-site change. Needs kol-component ≥0.262.0 (`Tooltip disabled`).

## 0.4.1 — 2026-10-02

- **`ModuleFrame` carries `kol-hw-panel`** — the marker the theme's touch rung skips, so a module's controls keep their desk sizes on touch. Needs the kol-theme of this release; a consumer with its own module frame adds the class to its root.

## 0.4.0 — 2026-10-02

- **Changed:** `Knob` wraps kol-component's `Knob` (was `RotaryDial`); still the deprecated alias. Needs the kol-component that ships `Knob`.

**The question round** (2026-10-01). Needs the kol-component that ships the `panel` variants.

- **New: the rack** — `RackCase` · `RackRow` · `RackSlot`, and the grid constants `HP_PX · TOTAL_HP · MIN_HP · ROW_HEIGHT · RAIL_HEIGHT · hpToPx`. The case, its 1U / 3U rows with their rails, and the HP-wide slot, lifted from kol-monitor. What mounts where, routing and edit mode stay in the consumer.
- **⚠ `Fader` · `Knob` · `PanelLabel` are deprecated aliases** — they are kol-component's `Slider` · `RotaryDial` · `LabeledControl` at `variant="panel"`. Same props, with two renames on the replacements: `Knob`'s `variant` (the label placement) is `labelPlacement`; `PanelLabel`'s `horizontal` is `labelPosition="right"`.
- **⚠ BREAKING — `Knob` and `Fader` no longer open `ParamSheet`.** A 500ms touch hold calls `onHold({ label, value, min, max, … })`; render `ParamSheet` from whatever holds the control. Without `onHold` a held touch is a drag. `EnvelopeGenerator` does this for its own knobs.
- `armLongPress` moved to kol-component; still exported from here.

## 0.3.2 — 2026-09-30

- Comments and README only: one spelling, `color`.

## 0.3.1 — 2026-09-29

- `EnvelopeGenerator` — the zoom rows no longer pin `h-6`, which held the coarse-pointer 44px slider row at 24 and overlapped the X and Y touch targets.

## 0.3.0 — 2026-09-27

**Curves done properly** (plan-2026-09-27-app-frame-and-curves) — mirror's /expressions page, class
for class, and an ADSR that behaves.

- **`EnvelopeGenerator` fills its parent** — the OSCILLOSCOPE box takes every pixel the 320px
  REFERENCE panel leaves, the scope every pixel its controls leave. Give it a height. Boxes are
  mirror's (eyebrow over `bg-surface-secondary border-oq-08 rounded-4`); the scope box is
  `kol-tone-sunken`. **Collapse** narrows the scope to 320px and spreads the reference as the desk.
- **The parts are exposed** — `useEnvelopeGenerator()` holds the state, `EnvelopeModeToggle` is the
  Equation | ADSR switch, `generator.reference` spreads into `SignalReference` in any shape, and
  `<EnvelopeGenerator generator={g}>` draws the rest. Without `generator` it keeps its own, as before.
- **Zoom** — X · Y · Scale sliders (dropped last time) and drag-to-pan on the trace.
- **Time** — a transport row: play / pause and **BPM** (60 = one unit a second, so every expression
  reads as before).
- **ADSR** — four handles: A, D, **S at the end of the hold** (sideways = hold, up/down = level), R.
  One pass, never wraps; the window holds while dragging and refits on release. **Cycle off = one
  shot** — the playhead runs once and stops, **Trigger** fires it again. The reference follows the
  mode in every shape. One control height (`sm`) across the toggle, the expression and the fields.
- **`SignalScope`** — `zoomX` · `zoomY` · `panY` · `onPan`, a clock (`rate`, `playing`), `loop`
  and `trigger` (one-shot), `height="fill"`.
- **`SignalReference`** — `variant="panel"`, mirror's box; the popover buttons are DS Buttons at
  `size` (default sm); the sheet lays out in 280px columns; grid rows keep the code and truncate
  the label.
- **Signal engine** — ADSR `hold` (seconds at sustain, default 1 — the gate the engine always
  assumed) and `gateSeconds()`; an envelope's code carries it (`a10 d30 s70 r50 h1`, old codes
  still load).
- `reference={false}` still means no panel; the prop's values are now `'panel' | 'none'`.

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

