# `SelectionOverlay` — the size label clears the rotate handle when the box points down

**Staged:** 2026-10-13 · from a kol-fxr session (adopting `SelectionOverlayLabelUpright`, kol-component 0.253.0)
**Change:** the `W × H` label's placement in `SelectionOverlay` (`utilities/SelectionOverlay.jsx`), kol-component 0.253.0

---

## The problem, in one screenshot

0.253.0's upright label hangs 6px under the rotated box's axis-aligned bounds, centred. The rotate
handle floats above the box's own top edge (`ROTATE_OFFSET`, 22) and turns with the chrome. At 180° that
top edge is the bottom, so the handle lands centred under the box — exactly where the label hangs:
kol-fxr walked a rectangle at 180° and the handle's circle sits on the label's `×` (`397 ● 317`).
Any angle where the handle points into the label's band (≈ 135°–225°) collides the same way.

## Ask

When the rotate handle's screen position falls inside the label's band, the label drops below the
handle (handle offset + its radius + 6/zoom) — or flips above the bounds. Upright, centred,
screen-constant, as 0.253.0 made it.

## Verify

A box at 0°, 90°, 180° and 225°: the label never overlaps the handle; at 0° and 90° it sits where
0.253.0 put it.

For fxr on the return: bump only.

---

## Resolution — 2026-10-13 · 🟢 closed

**Shipped `@kolkrabbi/kol-component@0.255.0`.** The handle's centre is computed from the box centre after
the chrome's rotation. When it falls in the label's column (the label's estimated half-width plus the
handle's radius) below the box, the label hangs `handle bottom + 6/zoom` instead of `bounds + 6/zoom`.

Verified on the showcase (`/components/selection-overlay`, 220 × 150, angles now 0° · 45° · −90° · 180° ·
225°): no overlap at any angle; 180° — handle 985–995, label top 1001; 0°, 45°, −90°, 225° unchanged,
6px under the bounds. Upright 81 × 22 at each. 0 console errors.

For fxr: bump only.
