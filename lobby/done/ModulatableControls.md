# ModulatableControls

**Staged:** 2026-10-28 · from a kol-mirror session (plan 19 W1)
**Change:** the KOL's controls take modulation as props, so an app passes its sources and stops wrapping the knob

---

## The problem, in one case
kol-mirror wraps the KOL `Knob variant="panel"` in `RotaryDial` (`src/components/hall-of-mirrors/RotaryDial.jsx`, 32 call sites) only to add two behaviours. Neither is Mirror's own: the compiler is already the KOL's (`compileExpression` / `isExpression`, `@kolkrabbi/kol-hardware/signal`).
1. **Expression value.** Click the readout, type an expression (`wave(t)`, `A * 0.5`), Enter commits and the knob runs it every frame; alt-click the readout clears it; the readout shows the expression and goes accent while it animates. Mirror runs it in `src/hooks/useExpressionValue.js` (rAF, clamped to min/max, clocked by Mirror's `hooks/transport.js`).
2. **Modulation source.** Right-click the knob → a menu of sources (`None`, `Expression A`–`D`, read from a bus ref the app owns) → picking one sets the expression to that source's name and shows a 5px `--kol-ctl-led-red` dot on the knob (`ModulationAssign.jsx`).

The user's ruling (2026-10-28): *"expression generator engine lives in DS, rotary dial lives in DS. nothing here is unique to mirror except that it homes modulation source"* — so the control should ship the behaviour, and the app pass only its sources and clock.

## The ask
- Modulation as a prop seam on `Knob` and on every control that takes a modulation input (`Slider`, the panel slider at least): an expression value in the readout, compiled by `kol-hardware/signal`; a source list + assign gesture + indicator.
- What stays the app's: the sources (a bus ref or a list) and the clock. Whether the clock is a prop or the shared transport from `TransportAndTimeline` (filed the same day) is the KOL's call.
- The KOL names the props.

## Definition of done
- [ ] `Knob` (and the sliders) take expression + modulation-source props
- [ ] Typing `wave(t)` into a knob's readout animates it; right-click assigns a source and shows the indicator
- [ ] Published; kol-mirror's receipt names the version


---

## ✅ RESOLVED — 2026-10-28

Shipped **kol-hardware 0.8.0**. `Modulatable` (kol-hardware, value) wraps a value control — kol-component's panel `Knob` or `Slider` — with your readout expression (runs on `clock`, ⌥-click clears, accent while it runs) and your right-click source menu (None · Expression A–D from `bus`, the LED dot); `useExpressionValue` under it. Props: `value` · `onChange` · `min` · `max` · `label` · `bus` (your bus ref) · `sources` · `clock` (the transport) · `source` / `onSourceChange` · `density`. A wrapper, not knob props: kol-component cannot import the compiler, and `Knob` / `Fader` in kol-hardware are ledger aliases. Walked in the showcase: `wave(t)` animates the knob, the menu lists the bus, picking A lights the dot.
