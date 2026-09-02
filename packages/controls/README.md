# @kolkrabbi/kol-controls

The KOL **controls** — hardware panel controls for instruments: mixers, synths, racks, decks. Lifted out of kol-monitor's rack on 2026-09-01 (user: *"make a controls package in the ds … it's mainly about mixer strips, knobs and stuff specific to modules, mixers and synth hardware"*) because kol-mirror's CRT bezel and transport deck and kol-fxr's editor controls carry the same tier as local forks.

A different TIER from `kol-component`'s app atoms: a `kol-component` Slider is app chrome, a `Fader` is a 2px track on a 24px-tall eurorack panel. They coexist on purpose.

## What's in the box

| Import | What |
| --- | --- |
| `Knob` | SVG rotary — sizes sm 24 · md 32 · lg 40 · xl 64, 270° sweep, drag ns (200px = range), ⌥-click resets, touch long-press → `ParamSheet` |
| `Fader` | the rack slider — 2px track + 8px thumb, horizontal (flex-1 + readout) or vertical; long-press → `ParamSheet` |
| `Toggle` | LED-dot toggle, sm 8 · md 12 — momentary, blink, long-press, `forceLit` |
| `FlipToggle` | 2/3-position rocker, horizontal or vertical |
| `LED` | 6 / 8px lamp — red · yellow · green · white · blue, optional hit pad |
| `IconButton` | 1px-bordered icon key, momentary pulse |
| `PanelLabel` | label wrapper, four positions |
| `ModuleHeader` | Toggle + module name + edit-mode remove dot / bypass dot |
| `JackSocket`, `LabeledJack` | the 3.5mm jack, presentational: ring, hole, label, a rim that glows with `signalRef`. **Routing stays in the consumer** |
| `RockerSwitch` | I/O rocker, backlit paddle |
| `ParamSheet`, `armLongPress` | touch: hold a control 500ms → a full-width bottom sheet with the DS `Slider` |

```js
import { Knob, Fader, LED } from '@kolkrabbi/kol-controls'
```

**Not here, on purpose:** the panel's text field, select and ‹ value › stepper are `kol-component`'s `Input size="xs" onCommit`, `Dropdown size="xs"` and `Stepper size="xs" options` — the `xs` rung is what let them collapse (ControlsXsRung, 0.3.0). `IconButton` stays: the lit border + momentary pulse are hardware semantics.

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
- Tailwind v4 `@source "…/node_modules/@kolkrabbi/kol-controls/src"` for the few utility classes inside.
