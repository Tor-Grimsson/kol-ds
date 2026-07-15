# Session: Batch publish + ThemeToggle icons + DS dark-imposition fix

**Date:** 2026-07-15
**Agent:** Grim (Fable 5)
**Summary:** Unblocked the repo (pnpm relink), published the 6-package raid batch, then fixed three user-verified bugs: ThemeToggle's icon pair, the TopBar search layout, and the DS forcing dark mode on consumers (in ThemeToggle since framework 0.1.0).

## Changes Made

### Files Modified
- `showcase/package.json` — added missing `@kolkrabbi/kol-styleguide: workspace:*` (raid wired 8 demos but never declared the dep; build failed without it)
- `packages/framework/src/ThemeToggle.jsx` — (a) icon pair `theme-toggle`×2 (legacy set, console-warned) → `mode-toggle-01`/`mode-toggle-02` (v1); (b) **dark-imposition fix**: init is now attribute → saved `kol-theme` → `prefers-color-scheme` (SSR fallback light); `data-theme`+localStorage written **only on user toggle**, never on mount; guarded matchMedia listener keeps the icon following the OS while no explicit choice exists
- `packages/framework/package.json` — 0.3.5 → **0.4.0** (behavior change; bump re-pointed from an interim 0.3.6 that never published)
- `showcase/src/lib/TopBar.jsx` — search Input `hidden sm:block` → `hidden sm:inline-flex` (`sm:block` overrode the `.kol-control` inline-flex shell → icon/placeholder stacked)

### Published (user-authorized, local `pnpm publish`, verified 15/15 local==npm after)
styleguide **0.1.0** (new; registry read-path lagged ~4 min — write-path confirmed via republish-refusal) · component **0.9.0** · foundry **0.4.0** · brand-template **0.2.0** · theme **0.7.4** · framework **0.3.5**. Framework **0.4.0** rides the user's final push (push==publish CI).

## Forensics worth keeping
- **The DS never "defaulted dark" in CSS** — base tokens are light, dark is explicit `[data-theme="dark"]` or `@media (prefers-color-scheme: dark)`. The imposition was JS: ThemeToggle stamped `data-theme='dark'` + localStorage on every mount when no attribute was set. Present since framework **0.1.0 (2026-07-01)** — ported verbatim from the single-app source at the 06-15 standup, never a reviewed decision (07-02 log says the opposite: "dark-default is a per-repo preference, not a rule"). Bisected via 7 npm tarballs, no git needed.
- Theme 0.7.4 vs 0.7.3 diff = exactly 1 line (styleguide CSS import) — tarball-diffing beats guessing.

## Current State

### Working
- All 16 packages published and version-synced (framework 0.4.0 pending CI on the last push — **unverified**)
- Showcase builds green; validators clean; search row + toggle icons render-verified by the user; light default confirmed after clearing his stale `kol-theme` localStorage value

### Known Issues
- `lobby/INDEX.md` queue table stale — lists ~54 rows that physically moved to `done/`; real queue = 4 (ParaType · InteractiveImage · TailwindContentSource · TypeScaleSection). Rewrite proposed, not yet user-approved.
- ComboLab `text-transform` conformance, provisional green/purple ramps, SplitToolButton⇄ShapeDropdown — still open from the raid.

## Next Steps
1. Verify `kol-framework@0.4.0` landed on npm (CI publish from the user's last push).
2. Lobby INDEX queue-table rewrite (awaiting user OK).
3. User has moved to the website project — first consumer of the corrected theme behavior.
