---
component: SignalScope
source: kol-mirror/src/components/hall-of-mirrors/ExpressionReference.jsx#L191-L218
staged: 2026-10-22
status: draft
deps: [SignalScope, EnvelopeGenerator, useEnvelopeGenerator]
---

# SignalScope — played-trace accent + external clock

## Purpose
kol-mirror's studio Expressions tab moved from its local scope (`ExpressionReference` → `Oscilloscope`) onto kol-hardware's `EnvelopeGenerator` (2026-10-22). Two things the local scope had are lost. The user wants both back.

## Ask 1 — the played trace in the accent
The local scope drew the trace **up to the playhead** in an accent, over a faint full curve, with the playhead and its dot in the same accent. You could see where the position was in the expression at a glance. `SignalScope` (kol-hardware 0.5.0, `src/indicators/SignalScope.jsx` L104–L126) draws trace, playhead and dot all in `--kol-surface-on-primary`.

Local, for reference (mirror `ExpressionReference.jsx` L176–L218):
- full curve: 1px, faint (`rgba(255,255,255,0.15)` — a raw literal, drop it)
- playhead line: 1px, accent at 0.4 alpha
- trace `0 → playhead`: 2px, accent, solid
- current-value dot: r 3, accent

The accent was a hardcoded `#2dd4bf` — **drop the literal.** Precedent: `--kol-slider-playhead` (kol-theme `kol-components-atoms.css`, "defaults to the accent and is overridable per instance") — the scope should read the same token, or its own defaulting to it.

## Ask 2 — an external clock
`SignalScope` keeps its own clock (`clock.current.t += dt * rate`); `useEnvelopeGenerator` owns `playing` (default `true`) and `bpm`. Mirror's scope followed the desk's **transport**: `t = transport.now()` — paused until Space, resetting to 0 on stop, the same position the desk's knobs read.

Mirror currently mirrors only play/pause into `g.setPlaying` (`kol-mirror/src/components/hall-of-mirrors/ExpressionBench.jsx`), so `t` drifts from the desk and stop does not reset.

Wanted: a time source, e.g. `now?: () => seconds` on `SignalScope`, forwarded through `useEnvelopeGenerator` / `EnvelopeGenerator`. When given, the scope reads `t` from it each frame and ignores its own clock and `playing`. Absent → today's behaviour.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `now` | `() => number` | — | external clock in seconds; overrides the internal one |
| (colour) | token | accent | played trace + playhead + dot — a token, not a prop, unless per-instance is cheap |

## Definition of done
- [x] Played portion of the trace, playhead and dot in the accent token; unplayed curve faint
- [x] `now` accepted and forwarded; without it nothing changes
- [x] Mirror can drop its `setPlaying` sync and pass `now: transport.now`

## Resolution — 2026-10-22 · kol-hardware 0.6.0

- `SignalScope` (live): the curve at 0.15 ink 1px, the trace up to the playhead 2px, the playhead 1px at 0.4 and the r3 dot — all in `--kol-slider-playhead` (falls back to `--kol-accent-primary`). No literal. A static scope draws as before.
- `now?: () => t` on `SignalScope`: read every frame, `rate` / `playing` ignored; `loop` still wraps it over `sec`. `useEnvelopeGenerator({ now })` returns it and `EnvelopeGenerator` passes it to its scope.
- Verified in the showcase SignalScope preview: played part and dot in the accent, the rest faint.
- Mirror sets `--kol-slider-playhead` (or its accent) if it wants teal; the KOL default accent is near-black.
