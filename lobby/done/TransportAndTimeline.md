# TransportAndTimeline

**Staged:** 2026-10-28 · from a kol-mirror session (plan 19 W2)
**Change:** upstream one transport (the clock) and the timeline drawn from it, so kol-fxr and kol-mirror stop carrying their own

---

## The problem, in one case
Two apps carry the same pair:
- **kol-fxr** — `src/editor/params/transport.js` (the clock, loop length) + `src/editor/params/TimelineDock.jsx` (scrub ruler, playhead, keyframe lanes). The KOL shipped the dock once as `organisms/TimelineDock` (2026-09-27); fxr took it back 2026-10-08 (its plan 14) because every change was a round trip. The user (2026-10-28): *"fxr uses the loop from transport controls. so its two components together … this should live in DS and we should upstream the FXR timeline"*.
- **kol-mirror** — `src/hooks/transport.js` (one clock: play/pause on Space, rate, forward/reverse/ping-pong, loop in/out, ease on the turnarounds; `now()` is the shaped time) + `src/components/mirror/TimeStrip.jsx` (the bottom strip on `B`: readout, a second ruler, the head; the loop window shaded, IN marked in the accent with a "1"; and `Scrubber`, the same bar on the Transport panel). Drag moves the head; it never starts or stops the clock.

## The ask
- One KOL transport (the clock) and a timeline that reads it: scrub, playhead, loop window (in/out). FXR's keyframe lanes ride on it as the editor's part.
- Both apps' needs are above; the KOL decides the split (hook vs component, which package) and the names. The knob clock in `ModulatableControls` (filed the same day) should be able to read this transport.

## Definition of done
- [ ] A KOL transport + timeline with scrub, playhead and loop window
- [ ] kol-fxr's timeline and kol-mirror's strip and scrubber can both be built from it
- [ ] Published; kol-mirror's receipt names the version (kol-fxr gets its own adoption ticket)


---

## ✅ RESOLVED — 2026-10-28

Shipped **kol-hardware 0.8.0**. `createTransport()` in `@kolkrabbi/kol-hardware/signal` — your clock, verbatim, as a factory, with fxr's `phase()` · `epoch` · `setLoopSeconds` and `seekToSeconds` for a scrubber (checked in `signal.test.mjs`); `TimeStrip` and `Scrubber` (your strip, taking the `transport`; `children` under the bar for fxr's lanes) and `useTransport` · `useTransportPlaying` · `useTransportNow`. Walked in the showcase: play moves the head, a scrub moves it and leaves the clock paused.
