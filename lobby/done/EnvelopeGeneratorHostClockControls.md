---
component: EnvelopeGenerator
source: kol-hardware/src/value/EnvelopeGenerator.jsx#L228-L239
staged: 2026-10-22
status: draft
deps: [EnvelopeGenerator, useEnvelopeGenerator, SignalScope, Button, Field, Toggle]
---

# EnvelopeGenerator — hide the clock controls when the host owns the clock

## Purpose
Follow-up to `SignalScopePlayedTraceAndClock` (kol-hardware 0.6.0). kol-mirror passes `now: transport.now` to `useEnvelopeGenerator`; the scope reads it and ignores `playing` / `rate`. But the transport row under the scope still draws Play/Pause and BPM — two controls that now do nothing.

## Anatomy
The `transport` row (L228–L239): Play/Pause `Button` · `Field` BPM · (ADSR) `Toggle` cycle + `Button` Trigger · pass length on the right.

## Ask
When `g.now` is set, don't render Play/Pause and BPM — the host's transport is the clock. Check the ADSR half too: `trigger` resets the internal clock (`SignalScope` `clock.current.t = 0`), which `now` bypasses, so Trigger / cycle are likely dead under `now` as well — hide them or make them work, whichever is honest.

## Props
None new — keyed off the existing `now`.

## States & interactions
- `now` absent → unchanged.
- `now` present → the row shows only what still acts (the ADSR pass length at least).

## Definition of done
- [x] With `now`, no Play/Pause or BPM in the row
- [x] ADSR Trigger / cycle either work under `now` or are hidden
- [x] Without `now`, nothing changes

## Resolution — 2026-10-22 · kol-hardware 0.6.1

- The transport row reads `ownClock = !g.now`: Play/Pause, BPM and Trigger render only without `now`. Trigger only reset the internal clock, which `now` bypasses — hidden.
- Cycle stays: under `now` it still decides wrap (`t % sec`) vs hold at the end (`min(t, sec)`), so it acts.
- Without `now` the row is unchanged (the three controls are only wrapped in the condition).
