# OneGrabGestureBothRails — two rails, two grab implementations, two feels

**Staged:** 2026-08-30 · from **kol-fxr**
**Nature:** one gesture, built twice in two packages. The user can feel the
difference between the left and right rail of the same screen.

## The report

User, 2026-08-30, on labs: *"why dont we use the grab animation and other
sidenav settings to be consistent?"*

He is right. Two rails on one screen, two different resize gestures:

| | left rail (nav) | right rail (params) |
|---|---|---|
| owner | **kol-shell** `NavRail` | **kol-framework** `useDragResize` |
| grab | gsap pill that wakes on proximity (`GRAB.near` / `sleep`), travels to the cursor along the edge with sticky dwell, snaps on release | plain pill-marked edge, snap-to-default |
| proximity wake | yes | no |
| dwell | yes | no |
| width token | `--kol-shell-rail-width` | `--kol-rail-w` + `-collapsed`/`-snap`/`-step` |

So the left edge comes alive as the cursor nears it and the right edge does not.
Same screen, same gesture, different feel — and neither is consumer code, so
fxr cannot converge them.

## Why it cannot be fixed here

`NavRail`'s grab is internal to it: `useRailDrag` + the `GRAB` constants +
`openWidth()`, all module-private, all bound to a **nav** component. A params
rail is not a nav, so there is nothing to reuse — fxr would have to reimplement
the dwell, the travel and the ladder, which is the duplication this ticket is
about.

## The ask

**Make the grab one thing both rails wear.** The shape we would reach for is the
gesture extracted from `NavRail` into the hook that already exists for this —
`useDragResize` gains the proximity wake, the travel and the dwell, and
`NavRail` consumes it rather than carrying its own copy. One implementation, one
set of tuning constants, and any surface with an edge can have the real gesture.

If the two are meant to differ, say so and we will stop noticing it — but then
the difference should be a documented ruling rather than an artefact of which
package each rail happened to be born in.

## Context

fxr renders both on `/labs`: the shell `NavRail` on the left (with labs'
category sections published into it via `railExtras`) and the params rail on the
right (`useDragResize({ token: 'kol-rail', side: 'right' })` in `LabsView.jsx`).
Both are stock; fxr tunes neither.

Found alongside a horizontal-scroll bug in the same rail, which turned out to be
fxr's own `TransportBar` overflowing a 215px column and is already fixed here —
not part of this ask.

## ✅ RESOLVED — 2026-08-30

**kol-component 0.142.0 · kol-shell 0.30.0 · kol-framework 0.36.0.** One
implementation, exactly the shape you asked for — extracted, not copied.

`useGrabEdge` now lives in **kol-component** and both rails consume it. It had to
go there rather than into `useDragResize`: kol-shell dropped its kol-framework
peer in 0.16.0, so shell cannot import framework's hook and framework cannot
import shell's. kol-component is the only package both reach — and `gsap` plus
the `GRAB` tuning constants were already there.

- **NavRail** deleted its local copy and imports the shared one. Byte-identical
  behaviour; it is the same function.
- **`useDragResize`** creates a `grabRef`, calls the hook, and returns
  `ref` + `className: 'kol-rail-grab'` in `grabProps`. **A consumer already
  spreading `grabProps` gets the wake, the travel and the dwell with no change** —
  fxr's `LabsView` needs no edit, only a bump.

The pill is drawn by `.kol-rail-grab` in `kol-animation.css`, which was never
scoped to the shell rail — so the right rail wears the same drawing, not a
lookalike.

### Not converged, deliberately

The two rails still differ in what they snap to: `NavRail` has one open width
and a closed rung, `useDragResize` has `--kol-rail-w` with
`-collapsed`/`-snap`/`-step`. That is width *policy*, not the gesture, and a
params rail with a continuous range is not the same thing as a nav that is open
or shut. Your ticket asked for the grab; if the ladders should also converge
that is a separate ruling.

⚠️ **Source-and-build verified only.** No surface in this repo renders
`useDragResize`, so the right-hand rail's new wake has not been driven. `/labs`
with both rails on screen is the check — and it is the one screen where a
difference would show.

**Remainder here:** bump all three.
