---
title: Workbench stand-up — Ladle, all phases
type: log
status: archived
updated: 2026-06-26
description: Stood up the Ladle component workbench end-to-end (5-phase plan). Toolchain gate passed; 10 stories across Button/Icon/Table render on-brand, verified live.
tags:
  - domain/design-system
  - domain/workflow
  - pattern/component-workbench
repo: kol-design-system
related:
  - "[[migration/2026-06-26-workbench-adoption|workbench adoption plan]]"
  - "[[workflows/02-workbench-tools|workbench tools]]"
---

# Session: Workbench stand-up — Ladle, all phases

**Date:** 2026-06-26
**Agent:** Grim (Opus 4.8)
**Summary:** Executed the [[migration/2026-06-26-workbench-adoption|workbench adoption plan]] start to finish — all 5 phases. The toolchain gate passed and the workbench is live; 10 stories render on-brand, verified in a real browser via Playwright (0 console errors).

## Changes Made

- **New `workbench/` app** (consumer tier, never published):
  - `package.json` — `@kolkrabbi/kol-*` as `workspace:*`, `@ladle/react`, scripts.
  - `vite.config.js` — Tailwind v4 plugin, `resolve.dedupe: ['react','react-dom']` (null-dispatcher fix), `publicDir: '../showcase/public'` (brand fonts, no copy).
  - `.ladle/config.mjs` (stories glob) + `.ladle/components.jsx` (Provider imports the cascade CSS once).
  - `src/index.css` — the KOL cascade (`tailwind → @source → theme → brand-color → framework`).
  - `src/{Button,Icon,Table}.stories.jsx` — 10 stories, imported by package name.
  - `README.md` — story convention + gotchas.
- `pnpm-workspace.yaml` — added `workbench`.
- root `package.json` — added `workbench` script.

## Current State

### Working — verified live (Playwright on the running dev server)
- Phase 0 gate **passed**: Ladle's bundled **Vite 6 hosts KOL's Vite-8 stack** — Tailwind v4 (`168 KB` CSS generated), React 19 (0 dispatcher errors), the loader's `import.meta.glob('?raw')` (icons inject with real geometry).
- Button variants render distinct theme styles (accent = KOL yellow `rgb(255,207,51)`); Icon sampler = 8 icons; Table = 3 rows. Brand fonts (`Right Grotesk`, `JetBrains Mono`) load (woff2 → 200).
- `pnpm workbench` serves from repo root.

### Gotchas found
- **New story _files_ need a dev-server restart** — `meta.json` updates but the client story list doesn't hot-add; "Story not found" until restart. Editing existing stories HMRs fine.
- **React dedupe is mandatory** (copied from showcase) or the app crashes with a null dispatcher.
- `react-inspector` (Ladle's Controls inspector) warns on React 19 peer — harmless, not in the render path.

### Decisions confirmed against the code
- **Ladle, not Storybook** — gate passed, no fallback needed.
- **Stories live in `workbench/src`, imported by package name** — packages use `files: ["src"]`, so colocated stories would ship to consumers. Packages untouched.
- **Decoupled from the open showcase Path A/B decision** — depends only on `@kolkrabbi/*` specifiers.

## Next Steps
1. Backfill stories for the remaining ~22 components that already have showcase demos.
2. Only if a real need shows up: graduate to Storybook for a11y/axe + visual regression (stories port over).
