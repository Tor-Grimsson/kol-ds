# @kolkrabbi/kol-hardware

The KOL **hardware** — panel controls for instruments: mixers, synths, racks, decks. Lifted out of kol-monitor's rack on 2026-09-01 as `@kolkrabbi/kol-controls` (user: *"make a controls package in the ds … it's mainly about mixer strips, knobs and stuff specific to modules, mixers and synth hardware"*); renamed `kol-hardware` on 2026-09-27. `@kolkrabbi/kol-controls` 0.4.0 is a deprecated re-export of this package.

A different TIER from `kol-component`'s app atoms: a `kol-component` Slider is app chrome, a `Fader` is a 2px track on a 24px-tall eurorack panel. They coexist on purpose.

## What's in the box — five groups

| Group | Import | What |
| --- | --- | --- |
| value | `Knob` | SVG rotary — sizes sm 24 · md 32 · lg 40 · xl 64, 270° sweep, drag ns (200px = range), ⌥-click resets, touch long-press → `ParamSheet` |
| | `Fader` | the rack slider — 2px track + 8px thumb, horizontal (flex-1 + readout) or vertical; long-press → `ParamSheet` |
| | `ParamSheet`, `armLongPress` | touch: hold a control 500ms → a full-width bottom sheet with the DS `Slider` |
| | `EnvelopeGenerator` | a value over time — an equation or an ADSR envelope — filling its parent: the scope box, its controls and transport (BPM), and the reference panel. `useEnvelopeGenerator()` + `EnvelopeModeToggle` let a host arrange the parts |
| switches | `Toggle` | LED-dot toggle, sm 8 · md 12 — momentary, blink, long-press, `forceLit` |
| | `FlipToggle` | 2/3-position rocker, horizontal or vertical |
| | `RockerSwitch` | I/O rocker, backlit paddle |
| | `IconButton` | 1px-bordered icon key, momentary pulse |
| indicators | `LED` | 6 / 8px lamp — red · yellow · green · white · blue, optional hit pad |
| | `JackSocket`, `LabeledJack` | the 3.5mm jack, presentational: ring, hole, label, a rim that glows with `signalRef`. **Routing stays in the consumer** |
| | `SignalScope` | the oscilloscope — a trace of any `sample(t)`, the knob range dashed, a live playhead; zoom X/Y, drag to pan, a clock `rate`, `loop` or one-shot on `trigger`, `height="fill"` |
| panel | `PanelLabel` | label wrapper, four positions |
| | `ModuleHeader` | Toggle + module name + edit-mode remove dot / bypass dot |
| | `SignalReference` | an expression / envelope reference — `variant` `panel` (mirror's box) · `tabs` · `popover` (EX / REF) · `sheet` |
| frames | `ModuleFrame` | a module's front panel — header pinned, body below |
| | `ChannelStrip` | a mixer channel's face — power · control grid · action column · faders · footer, as slots |
| | `FlipCard` | a face that turns over in place to its back |

```js
import { Knob, Fader, LED, ModuleFrame, EnvelopeGenerator } from '@kolkrabbi/kol-hardware'
import { compileExpression, envelopeAt } from '@kolkrabbi/kol-hardware/signal'
```

**Not here, on purpose:** the panel's text field, select and ‹ value › stepper are `kol-component`'s `Input size="xs" onCommit`, `Dropdown size="xs"` and `Stepper size="xs" options` — the `xs` rung is what let them collapse (ControlsXsRung, kol-controls 0.3.0). `IconButton` stays: the lit border + momentary pulse are hardware semantics. **Frames are shapes, not modules** — routing, the rack and the render loop stay in the consumer.

## The signal engine — `./signal`

Plain JS, no React: one expression compiler (`compileExpression` — every helper spans `[min, max]`, two gates in front of the Function sink, never throws) and one ADSR (`envelopeAt` for drawing, `createEnvelope` for a per-frame module), plus the reference as data (`EXPRESSION_SECTIONS` / `_TABS`, `ADSR_PRESETS` / `_SECTIONS` / `_TABS`). `pnpm test` runs its check.

## Tokens — `kol-components-controls.css` (ships in kol-theme)

Hardware is theme-INVARIANT — a knob cap is black on a white panel too — so the caps derive from `--kol-color-ab-black` / `-white`, not the flipping `oq-ab` tiers. LEDs are the set's own emitters, deliberately not `--kol-palette-*` (user ruling).

```
--kol-ctl-hw-cap · -well · -shade · -cap-edge · -on-cap · -rail · -case · -cable
--kol-ctl-led-red · -green · -yellow · -blue
--kol-ctl-signal-input · --kol-ctl-cv-attenuate
```

`JackSocket` reads its colour role as a HEX off `:root` (it appends a hex alpha for the glow), so a consumer overriding a role binds a hex, never a `var()`.

## Seams

- **Icons** through `iconComponent` (`IconButton`, `LabeledJack`) — the seam the DS Button uses; default is kol-icons' `Icon`.
- **Power** — `ModuleHeader powered` (default true); the consumer's case-power context decides.
- **Routing** — `JackSocket` takes `active` · `pending` · `dimPending` · `cablesHidden` · `color` · `onPointerDown`; drag-to-patch, the registry and the pending cable are the consumer's.

## Consumer requirements

- **CSS** ships in `@kolkrabbi/kol-theme` (`kol-components-controls.css`, in the theme umbrella; a `core` consumer imports it as a domain pack) — this package ships JS only.
- Tailwind v4 `@source "…/node_modules/@kolkrabbi/kol-hardware/src"` for the utility classes inside — or `@import "@kolkrabbi/kol-theme/kol-sources.css"`, which lists it since kol-theme 0.152.0.
