# Session: showcase audit — dev icon blackout root-caused, dashboards 0.2.1

**Date:** 2026-07-28
**Agent:** Grim (Fable 5)
**Summary:** Full mechanical sweep of the showcase (223 routes: 185 component pages, blocks, sets, fixed pages) via Playwright against the user's running dev server — **zero real console errors, zero error-boundary trips, zero dead renders** (all flags were vite re-optimize reload transients). The entire warning wall (~5,000+ `Icon "x" not found in icon set`) is ONE defect: **every icon in the dev app renders null** (`svgCount: 0` page-wide).

**Root cause:** dashboards 0.2.0 declared its kol deps as peer ranges (`>=0.7.0`) with no workspace devDeps → pnpm auto-install-peers pulled **registry copies** (kol-icons@0.7.0, kol-component@0.12.0, stale kol-theme@0.11.0) into `.pnpm` → Vite dep-optimized kol-icons from the store copy → `import.meta.glob` is a Vite-transform macro the dep optimizer doesn't process → all icon maps `{}` → bare-specifier rewriting routed EVERY `@kolkrabbi/kol-icons` import (workspace source included) through the empty bundle. Dev-only; production build globs from source.

**Fix:** `packages/dashboards/package.json` → 0.2.1: `workspace:*` devDependencies added beside the (kept, consumer-correct) peer ranges. SHIPPED-PACKAGES bumped.

**Handed to the user (classifier-blocked / provisioning):**
- `pnpm install` at root (relinks, drops the three registry copies)
- `cd packages/dashboards && pnpm publish --no-git-checks` (0.2.1)
- restart the dev server (his, PID 62204) — then icons re-verify live

- `packages/dashboards/package.json` — version + devDeps block
- `docs/operations/SHIPPED-PACKAGES.md` — 0.2.1 row + updated date
