# TransportFromHardware → kol-fxr

**Filed:** 2026-10-28 → **kol-fxr**
**Entry:** `/Users/kolkrabbi/dev/projects/kol-fxr/lobby/inbox/TransportFromHardware.md`
**Ledger:** `/Users/kolkrabbi/dev/projects/kol-fxr/lobby/INDEX.md` — **the truth about this ticket**
**Last known:** 🔵 `filed` · 2026-10-28

## Why it went there
kol-mirror's TransportAndTimeline put one transport and timeline in kol-hardware, built to fxr's semantics too; fxr still carries its own.

**Remainder here:** none.


## 🟠 ADDRESSED in kol-fxr — 2026-10-28

The clock is on `createTransport()` (kol-hardware 0.8.0), its API unchanged for fxr's callers; a loop-length change re-seeks the phase so the head keeps its place. The strip is not taken: `TimeStrip` is absolute-positioned, spans at least 4 s and has no label gutter — filed back as `TimeStripInADock`.

**Remainder here:** `TimeStripInADock`.


## ✅ RETURNED — 2026-10-29

🟢 `closed` in **kol-fxr**: the clock on `createTransport()`, the dock's strip from `TimeStrip` (kol-hardware 0.9.1, `framed={false} span="loop" gutter={132}`).

**Remainder here:** none.
