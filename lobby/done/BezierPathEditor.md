---
component: BezierPathEditor — a 2D bezier node editor: nodes with in/out handles, drag, add (double-click), delete; a value of points
source: kol-fxr `compose/inspectors/ProfileEditor.jsx` (the organic band's edge profile) and `KineticPanel.jsx` `CustomPathPoints` (a kinetic layer's custom path)
staged: 2026-10-31
status: draft
deps: []
---

# BezierPathEditor

## Purpose
The user, 2026-10-31 (kol-fxr plan 51 W4): *"I mainly want to know what is local o do the audit and report what you find"* · *"I would like things to look the same, so if we can do that and swap for DS then Im good."* fxr audited its 28 rail sections against KOL; this is one of the pieces with no KOL part.

Where it lives today: kol-fxr `compose/inspectors/ProfileEditor.jsx` (the organic band's edge profile) and `KineticPanel.jsx` `CustomPathPoints` (a kinetic layer's custom path) — two hand-built SVG editors for one job. KOL's `CurveEditor` is a 1D easing curve, not a 2D path.

## Asked
- `value: [{ x, y, hl?, hr? }]` normalised 0–1, `onChange(points)`; closed or open path; an `aspect` for the box; nodes draggable, handles draggable, double-click adds, alt-click deletes; a `size` on the control ramp.

## Recreation notes
- Acceptance (fxr's): both fxr editors render it with 0 local SVG editor code left.

## 🟠 BUILT — 2026-10-31 · awaiting publish

`BezierPathEditor`, a new atom (kol-component, unreleased): `value: [{ x, y, hl?, hr? }]` normalised 0–1, handles as offsets from the anchor (a missing one is a corner), `onChange(points)`, `closed`, `aspect`, `size` xs · sm · md, `minPoints`. Drag anchors and handles; double-click splits the nearest segment shape-preserving (`pathMath` `splitSegment`); alt-click deletes. Ground the control's, path oq-80, leashes oq-24, handles oq-48, anchors the accent; no border. Constraints like fxr ProfileEditor's locked, y-sharing ends are the consumer's, applied in `onChange`.

Not published (npm blocked this session); kol-component needs a minor publish, then this closes with the version cited.

**Remainder at kol-fxr:** bump kol-component when published; ProfileEditor and CustomPathPoints render `BezierPathEditor` (ProfileEditor maps its y −1…1 / `hlx`… to the 0–1 value and keeps its end rule in `onChange`; CustomPathPoints maps `[x, y]` pairs to `{ x, y }` nodes), retire the local SVG to `_tmp/`.


## ✅ RESOLUTION — 2026-10-31

Published in **@kolkrabbi/kol-component@0.330.0** (live on the registry; checked once in the published tarball): `BezierPathEditor` (atom) exported. Closed on the build above, purpose served.

**Remainder at kol-fxr:** bump kol-component to ≥0.330.0; ProfileEditor and CustomPathPoints render `BezierPathEditor` (ProfileEditor maps its y −1…1 / `hlx`… to the 0–1 value and keeps its end rule in `onChange`; CustomPathPoints maps `[x, y]` pairs to `{ x, y }` nodes), retire the local SVG to `_tmp/`.
