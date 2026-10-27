# RailRolesOnMonitor — the modules out of the nav rail; the rails on their roles

**Filed:** 2026-10-25 → **kol-monitor**
**Entry:** `~/dev/projects/kol-monitor/lobby/inbox/RailRolesOnMonitor.md`
**Ledger:** `~/dev/projects/kol-monitor/lobby/INDEX.md` — **the truth about this ticket**
**Last known:** 🟢 `closed` · 2026-10-25

## Why it went there
His review of monitor's rack (2026-10-25): the MODULES list in the nav rail is monitor's `RackRailPanel` portalled through the rail slot — *"no one asked for this modules should not be there overlaid in the rail … its fucked. not correct."* — and the bottom rail runs over the nav rail. The DS side (`Rail role`, the bottom rail measuring the shell rail, 380, no edge) is in kol-component's Unreleased; the rest is monitor's.

## What stays here
Nothing — the DS side shipped 2026-10-25: kol-component 0.302.0 · kol-theme 0.190.0 (`Rail role`, `RailNav`, the standard header and foot, 380 · 16, the DS grab).

**Remainder here:** none.

## ✅ CLOSED in kol-monitor — 2026-10-25

On kol-component 0.302.0 · kol-theme 0.190.0. `RackRailPanel` is out of the nav rail (and `RailSlotProvider` out of the app); the patch table is `Rail role="patch"`, the Rack and Stage rails `Rail role="page"`, the Workbench `Rail role="bottom"` with `RailNav` and `RailHeader`; H · P · E through `useRailKey`. Walked in Playwright on /rack and /stage. Resolution: `kol-monitor/lobby/done/RailRolesOnMonitor.md`.

**Remainder here:** none.
