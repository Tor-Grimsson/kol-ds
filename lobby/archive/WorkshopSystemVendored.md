# WorkshopSystemVendored — kol-website now owns the whole workshop system

**Staged:** 2026-07-28 · **Source:** kol-website (user ruling, nav ownership)
**Type:** architecture note, not a component spec — the DS-side follow-up for a consumer restructure that already shipped.

## What happened consumer-side

kol-website vendored the ENTIRE `@kolkrabbi/kol-workshop` 0.1.7 source (shell, sidebars, compositions, tags, docs render layer, **and the engine**) into `apps/web/src/workshop-system/` and dropped the npm dependency. It also vendored kol-framework's `ShellHeader` as a local `WorkshopHeader`. Building blocks still come from the DS (`Button`, `Icon`, `ShellDrawer`, `ShellSearchOverlay`, wordmark assets, theme CSS incl. the `.kol-shell-*`/`.shell-*` chrome).

**Why (user ruling):** consumers own navigation — all navigation, all sidebars, all shells. The DS ships structure, not restrictions. The engine went too because it fails the multiple-consumers test: its only real consumer was the website's docs, so every parser tweak was a two-repo round-trip.

**Original intent, restated by the user:** the 07-09 lift of the workshop system into a package was meant as a **redundant snapshot for the DS side, not as a parent** the website consumes from. The dependency direction that grew out of it was the mistake.

## To deal with here, later

1. **Decide kol-workshop's fate.** Its remaining consumer is this repo's own dogfood (`/workshop-docs` in the showcase). Options: keep as the DS-side snapshot (per the original intent) and stop publishing, or npm-deprecate like kol-specimen. Nothing external depends on it after website 0.1.7-vendor.
2. **Divergence is expected, not a bug.** The website's copy will evolve (wordmark links fixed, `kol-mono-14` tabs, DS Button chrome, v1 icons). The docs-format contract lives in the docs-framework spec, not in either parser copy.
3. **ShellHeader** stays a kol-framework export (the DS's own shells use it), but note the website no longer consumes it — same snapshot-not-parent posture.
4. **If a third repo ever needs the docs engine**, that's the day it earns a package again — re-lift from whichever copy is healthier, as its own small package (engine only, no shell).

## Status

Consumer side is DONE and build-verified (website builds 5/5 with zero `@kolkrabbi/kol-workshop` imports). Everything above is DS-side housekeeping, user's call, no urgency.

---
## 📌 ARCHIVED 2026-07-30 — fate question answered by events
The 2026-07-30 shell-adoption arc folded the website fork's improvements back into the package (0.3.0) and the SHOWCASE now wears the packaged shell as its one chrome — kol-workshop has a load-bearing consumer again, so it stays published. The website keeps owning its vendored copy (snapshot-not-parent, per the original ruling); divergence remains expected, the docs-format contract lives in the docs-framework spec.
