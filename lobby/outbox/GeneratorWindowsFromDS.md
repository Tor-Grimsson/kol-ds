# GeneratorWindowsFromDS → kol-fxr

**Filed:** 2026-11-05 → **kol-fxr**
**Entry:** `~/dev/projects/kol-fxr/lobby/inbox/GeneratorWindowsFromDS.md`
**Ledger:** `~/dev/projects/kol-fxr/lobby/INDEX.md` — **the truth about this ticket**
**Last known:** 🔵 `filed` · synced 2026-11-05 (receipt updated: disabled list empty)

## Why it went there
The generator settings window (`Dialog variant="settings"`) and the `Settings*` controls shipped in kol-component 0.343.0 (plan-2026-11-05-float-editor W7); fxr builds plan 53's Generate · Repeat · Type on them and supplies the engine params the KOL copy shows disabled.

## What stays here
nothing

## Update 2026-11-05 — the disabled list is empty
The KOL copy now carries **fxr's engines as of 2026-11-05**: `src/generate/` copied verbatim into design-editor 0.30.0 (two owners — fxr keeps its own, the copy never feeds back), with fxr's editor side (the `generate` and `repeat` layers, Expand, export as `<g>`). Every Generate and Repeat control is bound to them, so **the list of plan-53 params this ticket handed over is now empty** — nothing waits on fxr. Three controls stay off because neither engine has the param: Line Screen's Angle and Flare, Repeat's Align to path. New alongside: the tools' Rail form (kol-shell 0.112.0 PropertyRail) beside the dialog, one state. Nothing owed back.
