---
title: Hardware system
type: reference
status: canonical
created: 2026-09-01
updated: 2026-09-27
verified: 2026-09-27
description: Hardware panel controls and the signal engine
aliases:
  - hardware
  - kol-hardware
  - controls
  - kol-controls
  - signal engine
  - hardware controls
  - rack controls
sources:
  - packages/hardware/src/index.js
  - packages/hardware/src/signal/index.js
  - packages/hardware/README.md
  - packages/theme/kol-components-controls.css
tags:
  - domain/compositions
  - audience/consumer
related:
  - "[[../00-overview/01-package-topology|package topology]]"
  - "[[09-dashboards-system|dashboards system]]"
  - "[[11-shell-system|shell system]]"
---

# Hardware system — `@kolkrabbi/kol-hardware`

Hardware panel controls for instruments — mixers, synths, racks, decks: everything drawn as hardware. Lifted out of kol-monitor's rack on 2026-09-01 as `@kolkrabbi/kol-controls` (`KolControlsPackage`; user: *"make a controls package in the ds … it's mainly about mixer strips, knobs and stuff specific to modules, mixers and synth hardware"*). **Renamed `kol-hardware` on 2026-09-27** (user: *"I like package hardware, its more descript anyway"*) — `controls` also meant the app atoms. `kol-controls` 0.4.0 is a deprecated re-export of it, so the old import keeps resolving until each consumer moves.

## Tier

A `kol-component` `Slider` is app chrome. A `Fader` is a 2px track on a 24px-tall eurorack panel. The two coexist; the rack never swaps its controls for app atoms (user ruling 2026-08-30: churn for a checker's benefit). Two exports are renamed only where the name already lives in kol-component: `Fader` (the rack `Slider`) and `PanelLabel` (was `LabeledControl`). The panel's text field, select and ‹ value › stepper are NOT here: they are `Input size="xs" onCommit`, `Dropdown size="xs"` and `Stepper size="xs" options` — the `xs` rung (ControlsXsRung, 2026-09-01) is what let them collapse onto the app atoms; `IconButton` stays because its lit border and momentary pulse are hardware semantics.

## Groups

The package is grouped (user ruling 2026-09-27), one folder per group under `src/`:

| Group | Exports |
|---|---|
| **value** — things you turn, slide or shape | `Knob` · `Fader` · `ParamSheet` · `armLongPress` · `EnvelopeGenerator` |
| **switches** — hardware switches and buttons | `Toggle` · `FlipToggle` · `RockerSwitch` · `IconButton` |
| **indicators** — lights, patching, traces | `LED` · `JackSocket` · `LabeledJack` · `SignalScope` |
| **panel** — panel furniture | `PanelLabel` · `ModuleHeader` · `SignalReference` |
| **frames** — the shells a module is built in | `ModuleFrame` · `ChannelStrip` · `FlipCard` |

| Export | What |
|---|---|
| `Knob` | SVG rotary — sm 24 · md 32 · lg 40 · xl 64, 270° sweep, drag ns, ⌥-click resets, touch long-press → `ParamSheet` |
| `Fader` | 2px track + 8px thumb, horizontal with readout or vertical |
| `ParamSheet` · `armLongPress` | touch: hold 500ms → a full-width bottom sheet with the DS `Slider` |
| `EnvelopeGenerator` | a value over time — an equation or an ADSR envelope — filling its parent, mirror's /expressions layout: the scope box (zoom, BPM transport; ADSR with four handles, hold, one-shot + Trigger) and the reference panel. `useEnvelopeGenerator()` + `EnvelopeModeToggle` for a host that arranges the parts (apps/curves) |
| `Toggle` | LED-dot toggle — momentary, blink, long-press, `forceLit` |
| `FlipToggle` | 2/3-position flip switch, either axis |
| `RockerSwitch` | I/O rocker, backlit paddle |
| `IconButton` | 1px-bordered icon key, momentary pulse |
| `LED` | 6 / 8px lamp — red · yellow · green · white · blue |
| `JackSocket` · `LabeledJack` | the 3.5mm jack — presentational, glows with `signalRef` |
| `SignalScope` | the oscilloscope — a trace of any `sample(t)`, the knob range dashed, a live playhead; zoom · pan · clock `rate` · `loop` / one-shot `trigger` · `height="fill"` |
| `PanelLabel` | label wrapper, four positions |
| `ModuleHeader` | enable dot + name + remove / bypass dot |
| `SignalReference` | the reference for an expression or envelope tool — `variant` panel (mirror's box) · tabs · popover (monitor's EX / REF) · sheet (labs' shortcuts) |
| `ModuleFrame` | a module's front panel — header pinned, body below (kol-monitor's `Module.jsx`) |
| `ChannelStrip` | a mixer channel's face — power, control grid, action column, faders, footer, as slots (kol-mirror's strip) |
| `FlipCard` | a face that turns over in place to its back (kol-mirror's channel flip) |

## Frames

ARCHITECTURE §3 kept module composition in the consumers. On 2026-09-27 the user ruled the **frames** in as the fifth group: the module frame, the channel strip and the flip are what kol-monitor and kol-mirror copied from each other. What stays out is unchanged — **routing, the rack, the registry and the render loop stay in the consumer**; a frame is slots and a shape, nothing wired.

## Signal engine

`@kolkrabbi/kol-hardware/signal`.

Plain JS, no React. One expression compiler and one ADSR for every scope, envelope and animated value in the estate — before it there were four compilers (kol-monitor's and kol-mirror's `useExpressionValue`, the design editor's Oscilloscope and its modulation DSL), already drifted, two of them handing user text straight to `new Function`.

- `compileExpression(expr, { bus })` → `{ ok, fn(t, f, min, max, busValues) }` — every helper spans `[min, max]` (monitor's semantics; `min = 0` is mirror's and the editor's). Two gates in front of the Function sink (math-only characters, an identifier allowlist), browser globals shadowed, never throws, never non-finite.
- `fitRange` · `isExpression` · `EXPRESSION_HELPERS`
- `envelopeAt(t, params, { hold, cycle })` (pure, for scopes) · `createEnvelope()` (the per-frame stage machine, monitor's) · `stageSeconds` (0 → 5 ms, 100 → 2 s) · `toRange`
- the reference as data — `EXPRESSION_SECTIONS` · `EXPRESSION_TABS` (kol-mirror's, verbatim) · `ADSR_PRESETS` · `ADSR_SECTIONS` · `ADSR_TABS`

`node src/signal/signal.test.mjs` is its check. The reviewable tool is `apps/curves`.

## Consumer

Modules, the rack, the registry, routing (drag-to-patch, pending cable), the render loop. The package is presentational with seams: `ModuleHeader powered`, `JackSocket`'s `active · pending · dimPending · cablesHidden · color · onPointerDown`, and `iconComponent` on the icon-bearing controls. Consumers pick up its utilities through `kol-sources.css`, which lists kol-hardware since kol-theme 0.152.0 (the manifest never listed kol-controls).

## Tokens

`kol-components-controls.css`, in the theme umbrella; a `core` consumer imports it as a domain pack. Hardware is theme-invariant (a knob cap is black on a white panel too), so caps derive from `--kol-color-ab-black` / `-white`. LEDs are the set's own emitters, deliberately not `--kol-palette-*`.

```text
--kol-ctl-hw-cap · -well · -shade · -cap-edge · -on-cap · -rail · -case · -cable
--kol-ctl-led-red · -green · -yellow · -blue
--kol-ctl-signal-input · --kol-ctl-cv-attenuate     ← HEX: JackSocket appends a hex alpha
```
