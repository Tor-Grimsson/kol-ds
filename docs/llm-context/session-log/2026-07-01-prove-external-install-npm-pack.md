---
title: Prove external install — npm pack into a throwaway Vite app
type: log
status: archived
updated: 2026-07-01
description: Packed all four KOL packages and installed them into a fresh Vite + Tailwind v4 app from tarballs — build + runtime both clean. The last no-credentials gate before publish is green.
tags:
  - domain/design-system
  - domain/distribution
  - domain/workflow
repo: kol-design-system
related:
  - "[[session-log/2026-07-01-git-prep-security-scan-gitignore|git prep]]"
  - "[[session-log/2026-06-26-docs-front-door-and-gameplan|git/publish gameplan]]"
---

# Session: Prove external install — npm pack into a throwaway Vite app

**Date:** 2026-07-01
**Agent:** Grim (Opus 4.8)
**Summary:** Gameplan step 3 — proved a stranger can consume KOL. `pnpm pack`'d all four packages, installed the tarballs into a throwaway Vite + Tailwind v4 app (no workspace, no symlinks), and confirmed both `vite build` and runtime render clean. Green — nothing blocks the real publish except `@kolkrabbi` npm auth.

## What was done
- Built a disposable consumer in scratchpad (`kol-install-test/`): Vite 6 + React 19 + `@tailwindcss/vite`, the four KOL tarballs as `file:` deps, the full 4-point contract in `index.css`.
- `pnpm pack` ×4 → tarballs with `workspace:*` rewritten to `0.1.0` (same as `changeset publish`).
- Fresh `npm install` → `vite build` → `vite preview` + headless browser render.

## Result — clean
- **Install:** 94 pkgs, 0 errors; third-party transitive deps (`@floating-ui/react`, `embla-carousel-react`) resolved from the registry.
- **Build:** ✓ 2407 modules, exit 0. `@source` generated 156 KB real CSS; loader's `import.meta.glob` globbed all 341 icons.
- **Runtime:** Button, Tag, 3 Icons all rendered; only console error was a missing favicon. Button carried `cursor:pointer` → theme CSS live.
- **4-point contract verified:** cascade order ✓, `@source` at installed pkg `src` ✓, React dedupe ✓, fonts-at-`/fonts/` ✓ (Vite's "resolve at runtime" warnings = designed system-font fallback).

## Findings
- **pnpm 9.15 silently ignores `pnpm.overrides` in a non-workspace `package.json`** (moved to `pnpm-workspace.yaml`) → transitive `@kolkrabbi/*@0.1.0` 404'd. Switched the sandbox to **npm** with top-level `overrides`. Test-harness artifact only — real consumers install *published* packages, so the transitive deps resolve from the registry. Not a packaging bug.
- Packages with an `exports` field correctly block `require('.../package.json')` (`ERR_PACKAGE_PATH_NOT_EXPORTED`) — expected; only theme (with `"./*"`) allows it. No action needed.

## Next steps
- **Step 4 — publish** (needs human): `@kolkrabbi` npm-scope auth, then real `changeset publish`. Everything upstream of auth is now proven.
- Step 5 — showcase fork (`ladle build` vs polished catalog). Step 6 — write the 4-point contract into every package README.
