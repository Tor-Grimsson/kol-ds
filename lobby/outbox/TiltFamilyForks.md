# TiltFamilyForks — home + work run local tilt forks; swap onto the DS Tilt family

**Filed:** 2026-08-27 → **kol-website**
**Entry:** `~/dev/projects/kol-website/lobby/inbox/TiltFamilyForks.md`
**Ledger:** `~/dev/projects/kol-website/lobby/INDEX.md` — **the truth about this ticket**
**Last known:** 🟢 `closed` · synced 2026-10-02 — executed at kol-website 2026-08-27 on kol-component `^0.110.0`; the three forks retired there

## Why it went there

The fix lives in `apps/web` — three local forks (`ui/TiltCard`, `ui/BentoCard`, `hooks/useTilt`) swap onto the package exports the DS shipped as one family in kol-component 0.110.0 (`TiltCard` · `TiltBento` · `useTilt`; `BentoCard` aliased on the retirement ledger).

## What stays here

Nothing — the DS side shipped. If the seven highlight tiles need a prop `TiltBento` lacks, that comes back as its own ticket.

**Remainder here:** none.
