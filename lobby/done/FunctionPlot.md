---
component: FunctionPlot — a plot of y = f(u) over one loop with a cursor at the current u
source: kol-fxr `params/ModulationEditor.jsx`
staged: 2026-10-31
status: draft
deps: []
---

# FunctionPlot

## Purpose
The user, 2026-10-31 (kol-fxr plan 51 W4): *"I mainly want to know what is local o do the audit and report what you find"* · *"I would like things to look the same, so if we can do that and swap for DS then Im good."* fxr audited its 28 rail sections against KOL; this is one of the pieces with no KOL part.

Where it lives today: kol-fxr `params/ModulationEditor.jsx` — a hand-drawn `<canvas>` plotting the bound expression over a loop.

## Asked
- `fn(u) → number` or `samples: number[]`, `min` / `max` (auto when unset), `cursor` (0–1), a height; axes and zero line on the KOL inks; light and dark.

## Recreation notes
- Acceptance (fxr's): ModulationEditor draws the plot through it.

## 🟠 BUILT — 2026-10-31 · awaiting publish

`FunctionPlot`, a new atom (kol-component, unreleased): SVG, one sample per pixel of its width; `fn(u)` or `samples`, `min` / `max` (auto from the samples), `cursor` (line + dot; the curve solid behind it, faint ahead), `height` (64), `labels` (max / min at the left). Ground oq-04, zero line oq-24 when 0 is in range, labels oq-48, curve the accent — light and dark by CSS.

Not published (npm blocked this session); kol-component needs a minor publish, then this closes with the version cited.

**Remainder at kol-fxr:** bump kol-component when published; ModulationEditor's ExprPlot draws through `FunctionPlot` (pass `fn={(u) => c.fn(u * secs)}`, `min={Math.min(lo, 0)}` / `max={Math.max(hi, 1)}` to keep the 0–1 rails' range, `cursor` the loop phase on each frame).


## ✅ RESOLUTION — 2026-10-31

Published in **@kolkrabbi/kol-component@0.330.0** (live on the registry; checked once in the published tarball): `FunctionPlot` (atom) exported. Closed on the build above, purpose served.

**Remainder at kol-fxr:** bump kol-component to ≥0.330.0; ModulationEditor's ExprPlot draws through `FunctionPlot` (pass `fn={(u) => c.fn(u * secs)}`, `min={Math.min(lo, 0)}` / `max={Math.max(hi, 1)}` to keep the 0–1 rails' range, `cursor` the loop phase on each frame).
