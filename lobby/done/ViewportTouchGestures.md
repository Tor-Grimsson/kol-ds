# `PanZoomViewport` — touch: two-finger pinch + pan, and a one-finger tap is the Space tap

**Staged:** 2026-10-14 · from a kol-fxr session (plan 35, the user: *"in mobile I still cant pinch zoom move with 2 fingers. and I think one tap should start stop transport play/pause"*)
**Change:** `organisms/Canvas.jsx` — `PanZoomViewport` (wheel, ⌘-keys, `kol:zoom-at` / `-to` / `-fit`; `onSpaceTap`); kol-component 0.258.0

---

## The problem

On a phone or tablet the viewport has **no touch gesture at all**: zoom is the wheel or ⌘ keys, pan is Space + drag or a trackpad scroll. kol-fxr's Labs (touch drawers) and its editor on a tablet render this viewport, so a finger cannot zoom or move the stage. And the consumer's play / pause lives on `onSpaceTap`, which a finger can never press.

## Ask

- **Two touch pointers** (`pointerType === 'touch'`) on the container: pinch zooms at the fingers' midpoint (the wheel's `zoomAt`, the real clamps), and the midpoint's travel pans — both in the same gesture, live, no transition. While two fingers are down the transform layer gets `pointer-events: none` (as Space-held does) so a consumer's tool never sees the second finger.
- **One touch pointer** stays the consumer's (tools, a sim's pointer) — except a **tap** (released under ~350 ms and ~12 px, no second finger joined) calls `onSpaceTap`, the same callback Space's tap fires.
- `touch-action: none` on the container so the browser's own page pinch never takes the gesture.

Defaults: mouse, trackpad, keys unchanged.

## Verify

Showcase canvas under touch emulation (two CDP touch points): pinch out over a corner → that corner grows under the fingers; two fingers drag → the frame moves; one tap → `onSpaceTap` fires once; a one-finger drag does not fire it.

For fxr on the return: bump only.
