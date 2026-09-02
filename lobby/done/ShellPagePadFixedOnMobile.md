# `--kol-shell-page-pad` is a fixed 48px — a quarter of a phone spent on gutters

**Filed:** 2026-09-01 · from **kol-chess** · kol-shell 0.31.0 · kol-theme 0.115.0

## The finding

`kol-components-shell.css:21` — `--kol-shell-page-pad: 48px`, no breakpoint
rung, no responsive value. `PageShell` (and through it `SettingsScaffold`)
wears it at every width, so at 390 the two gutters take **96px of the
viewport — 24.6%**.

Measured on kol-chess `/settings` (iPhone, 01/09 field review): the Settings
h1 sits ~35pt from the screen edge while every `.kol-page` sibling page sits
~15pt — the page reads as a different app from the rest of the shell. The
user's report: *"settings page has weird padding? much larger then other
mobile views"*.

## The ask

A responsive value on the token — `clamp(20px, 5vw, 48px)` is the shape, the
numbers are yours. Desktop should not move; 48 is right there.

Per estate law kol-chess carries **no consumer override** — the token is the
shell's, and every consumer with a SettingsScaffold has this on a phone right
now.

## ✅ RESOLUTION — 2026-09-01 · kol-theme@0.118.0

--kol-shell-page-pad is clamp(20px, 5vw, 48px) — your shape, floor 20 (the estate's px-5 mobile floor, which is the ~15pt your .kol-page siblings sit at), 5vw reaching 48 at 960 so desktop does not move. PageShell's padding and PageBleed's negative margin read the same token, so the pair scales together.

**Remainder here:** none — kol-chess bump kol-theme@0.118.0; re-check /settings on the phone — the h1 should sit level with the .kol-page siblings.

