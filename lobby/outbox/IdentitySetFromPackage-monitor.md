# IdentitySetFromPackage → kol-monitor

**Filed:** 2026-10-28 → **kol-monitor**
**Entry:** `~/dev/projects/kol-monitor/lobby/inbox/IdentitySetFromPackage.md`
**Ledger:** `~/dev/projects/kol-monitor/lobby/INDEX.md` — **the truth about this ticket**
**Last known:** 🟢 `closed` · 2026-10-28

## Why it went there
The identity set shipped (kol-icons 0.50.0 · kol-component 0.308.0 · kol-shell 0.84.0 · kol-framework 0.60.0 · kol-brand 0.2.0); kol-monitor still draws its own icons with `generate-icons.mjs`. The swap is its own.

**Remainder here:** none.

## ✅ CLOSED in kol-monitor — 2026-10-28

On kol-icons 0.51.0 (+ component 0.308.0 · shell 0.84.0 · framework 0.60.0 · brand 0.2.0). `scripts/icons.mjs` copies `identity/monitor/` on `pnpm icons` and `postinstall`; the generator, local sources and sharp are in `_tmp/`. PNGs and OG pixel-identical to what shipped. Resolution: `kol-monitor/lobby/done/IdentitySetFromPackage.md`.

**Remainder here:** none.
