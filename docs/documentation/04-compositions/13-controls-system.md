---
title: Controls system
type: reference
status: canonical
created: 2026-09-01
updated: 2026-09-01
verified: 2026-09-01
description: Hardware panel controls for instruments
aliases:
  - controls
  - kol-controls
  - hardware controls
  - rack controls
sources:
  - packages/controls/src/index.js
  - packages/controls/README.md
  - packages/theme/kol-components-controls.css
tags:
  - domain/compositions
  - audience/consumer
related:
  - "[[../00-overview/01-package-topology|package topology]]"
  - "[[09-dashboards-system|dashboards system]]"
  - "[[11-shell-system|shell system]]"
---

# Controls system — `@kolkrabbi/kol-controls`

Hardware panel controls for instruments — mixers, synths, racks, decks. Lifted out of kol-monitor's rack on 2026-09-01 (`KolControlsPackage`; user: *"make a controls package in the ds … it's mainly about mixer strips, knobs and stuff specific to modules, mixers and synth hardware"*) because kol-mirror's CRT bezel and transport deck and kol-fxr's editor controls carry the same tier as local forks.

## Tier

A `kol-component` `Slider` is app chrome. A `Fader` is a 2px track on a 24px-tall eurorack panel. The two coexist; the rack never swaps its controls for app atoms (user ruling 2026-08-30: churn for a checker's benefit). Two exports are renamed only where the name already lives in kol-component: `Fader` (the rack `Slider`) and `PanelLabel` (was `LabeledControl`). The panel's text field, select and ‹ value › stepper are NOT here: they are `Input size="xs" onCommit`, `Dropdown size="xs"` and `Stepper size="xs" options` — the `xs` rung (ControlsXsRung, 2026-09-01) is what let them collapse onto the app atoms; `IconButton` stays because its lit border and momentary pulse are hardware semantics.

## Exports

| Export | What |
|---|---|
| `Knob` | SVG rotary — sm 24 · md 32 · lg 40 · xl 64, 270° sweep, drag ns, ⌥-click resets, touch long-press → `ParamSheet` |
| `Fader` | 2px track + 8px thumb, horizontal with readout or vertical |
| `Toggle` | LED-dot toggle — momentary, blink, long-press, `forceLit` |
| `FlipToggle` | 2/3-position flip switch, either axis |
| `LED` | 6 / 8px lamp — red · yellow · green · white · blue |
| `IconButton` | 1px-bordered icon key, momentary pulse |
| `PanelLabel` | label wrapper, four positions |
| `ModuleHeader` | enable dot + name + remove / bypass dot |
| `JackSocket` · `LabeledJack` | the 3.5mm jack — presentational, glows with `signalRef` |
| `RockerSwitch` | I/O rocker, backlit paddle |
| `ParamSheet` · `armLongPress` | touch: hold 500ms → a full-width bottom sheet with the DS `Slider` |

## Consumer

Modules, the rack, the registry, routing (drag-to-patch, pending cable), the render loop. The package is presentational with seams: `ModuleHeader powered`, `JackSocket`'s `active · pending · dimPending · cablesHidden · color · onPointerDown`, and `iconComponent` on the icon-bearing controls.

## Tokens

`kol-components-controls.css`, in the theme umbrella; a `core` consumer imports it as a domain pack. Hardware is theme-invariant (a knob cap is black on a white panel too), so caps derive from `--kol-color-ab-black` / `-white`. LEDs are the set's own emitters, deliberately not `--kol-palette-*`.

```text
--kol-ctl-hw-cap · -well · -shade · -cap-edge · -on-cap · -rail · -case · -cable
--kol-ctl-led-red · -green · -yellow · -blue
--kol-ctl-signal-input · --kol-ctl-cv-attenuate     ← HEX: JackSocket appends a hex alpha
```
