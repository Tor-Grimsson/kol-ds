---
component: ColorPickerPopoverExtras — a footer slot on ColorPickerPopover for swatches and quick states
source: kol-fxr `compose/inspectors/ColorField.jsx` builds its own colour popover from SBSquare + HueStrip because ColorPickerPopover has nowhere for its palette-reference swatches (Primary · Secondary · Light · Dark · Accent · Background) and its Theme / None buttons.
staged: 2026-10-31
status: draft
deps: []
---

# ColorPickerPopoverExtras

## Purpose
The user, 2026-10-31 (kol-fxr plan 51 W4): *"I mainly want to know what is local o do the audit and report what you find"* · *"I would like things to look the same, so if we can do that and swap for DS then Im good."* fxr audited its 28 rail sections against KOL; this is one of the pieces with no KOL part.

Where it lives today: kol-fxr `compose/inspectors/ColorField.jsx` builds its own colour popover from SBSquare + HueStrip because ColorPickerPopover has nowhere for its palette-reference swatches (Primary · Secondary · Light · Dark · Accent · Background) and its Theme / None buttons.

## Asked
- a `footer` (or `extras`) node rendered under the hex row, and a way for it to close the panel (a `close` passed to a render function); the swatch trigger accepts a `trigger` already.

## Recreation notes
- Acceptance (fxr's): ColorField renders ColorPickerPopover with its footer; its hand-built popover retires.

## 🟠 BUILT — 2026-10-31 · awaiting publish

`ColorPickerPopover footer` (kol-component, unreleased): a node or `({ close }) => node` rendered under the hex row (inline: last; `close` a no-op there), so palette swatches and Theme / None can pick and close. The showcase preview's `footer` variant draws swatches + None.

Not published (npm blocked this session); kol-component needs a minor publish, then this closes with the version cited.

**Remainder at kol-fxr:** bump kol-component when published; ColorField renders `ColorPickerPopover` with its palette references and Theme / None in `footer`, its hand-built popover retires.


## ✅ RESOLUTION — 2026-10-31

Published in **@kolkrabbi/kol-component@0.330.0** (live on the registry; checked once in the published tarball): `ColorPickerPopover` `footer` slot. Closed on the build above, purpose served.

**Remainder at kol-fxr:** bump kol-component to ≥0.330.0; ColorField renders `ColorPickerPopover` with its palette references and Theme / None in `footer`, its hand-built popover retires.
