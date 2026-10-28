---
component: TimeStripInADock
source: kol-fxr, adopting TransportFromHardware on kol-hardware 0.8.0
staged: 2026-10-28
status: draft
---

# TimeStripInADock

**Raised:** fxr's adoption of `TransportFromHardware` (user, 2026-10-28: *"do the ticket"*). The clock half is in; the strip half cannot be taken without a local fork.

## The problem
1. `TimeStrip` is `absolute left-0 right-0 bottom-0` with its own padding, border and `z-overlay` — mirror's floating bottom strip. fxr's `TimelineDock` is an in-flow panel in the canvas footer (a grab on its top edge, a label column, lanes that scroll), so the strip cannot sit inside it.
2. Its span is `max(loopIn, loopOut, 4)`. fxr's keyframe lanes span exactly ONE loop (keys at `t` 0..1). With a 2 s loop the strip draws 0..4 s and the head sits at half the lanes' width.
3. fxr's lanes carry a label column (track name) left of the lane; `children` render inside the strip's bar column, so a lane's label and the ruler would not share a left edge.

## The ask
- `TimeStrip` (or a `TimeRuler` part) that renders IN FLOW: no absolute position, no own border / padding / z — the host frames it.
- `span="loop"` (or `span={seconds}`): the visible span is the loop window exactly, so `t` 0..1 maps to the full width.
- A `gutter` (px) for a host label column, applied to the ruler and the bar, so lanes with labels line up under them.

## Done when
fxr's `TimelineDock` draws its readout, ruler, loop window and head from the DS part, its lanes under it on the same span, at a 2 s and an 8 s loop.


---

## ✅ RESOLVED — 2026-10-28

Shipped **kol-hardware 0.9.0** — all three asks as `TimeStrip` props, the defaults unchanged so mirror's strip draws as before.
- `framed={false}` — in flow: no absolute position, border, padding, background or z; the host frames it.
- `span="loop"` — the loop window exactly, so `t` 0..1 is the full width (`span={seconds}` for a fixed span). Function children get `origin` beside `now`, `span`, `state`.
- `gutter={px}` — the readout sits in a left column that wide, the ruler and bar start after it, `children` render full width beneath, so a lane's label column lines up.
- Walked in the showcase's TimeStrip preview (a docked example with two labelled lanes): at 2 s the ruler reads 0–2, at 8 s 0–8; lanes and bar share their left edge and width; the head sits at 18 % at 1.46 / 8 s.
