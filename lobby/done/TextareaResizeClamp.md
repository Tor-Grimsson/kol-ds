---
component: Textarea (resize grip)
source: kol-fxr/src/editor/params/AutoControls.jsx#L247 (any rail-mounted Textarea)
staged: 2026-08-12
status: draft
deps: [Textarea]
---

# TextareaResizeClamp

## Purpose
The Textarea's resize grip drags BOTH axes and writes an unclamped inline width onto the shell. Inside a fixed-width container (the design editor's right rail) an X-drag pushes the shell past its parent and the whole sidebar grows a horizontal scrollbar. The grip must be container-aware.

## Current behaviour
- `Textarea.jsx`'s grip `onPointerDown` sets `shell.style.width = max(startW + dx, 120)` and `ta.style.height = max(startH + dy, 40)` — a floor, no ceiling.
- The shell class stack carries `w-full`, but the inline width from the drag outranks it, so the clamp the markup implies is silently lost after the first X-drag.

## Ask
Clamp the drag to the container: cap `shell.style.width` at the parent's available content width (`maxWidth: 100%` semantics), so an X-drag can never overflow the box the Textarea sits in. Y-drag stays as-is.
Optional (your call): an `axis` prop (`'both'` default · `'y'`) — a rail-mounted Textarea has nowhere meaningful to grow on X, and a consumer that IS width-flexible keeps today's behaviour.

## States & interactions
Min 120×40 stays. Keyboard/native behaviour unchanged — the grip is the only resize surface.

## Dependencies
None — the drag handler already owns both writes.

## Recreation notes
Consumers can pass `className="max-w-full"` through the public API as a stopgap (kol-fxr has, on its rail textareas — legit prop use, not a shim), but that only caps growth; the X-axis drag itself remains meaningless-but-live in fixed-width rails. The real fix is the atom's.

---

## Resolution (2026-08-12) — 🟢 closed

Shipped in **@kolkrabbi/kol-component@0.35.0** (registry-verified). The grip's
width write clamps to the parent's content width at drag start (120 floor wins
below that); new `axis` prop — `'both'` (default) | `'y'` for rail consumers.
Adoption (bump + optionally `axis="y"` on rail textareas, drop the
`max-w-full` stopgap) is kol-fxr's.
