---
title: Docs front-door, workbench polish, and the git/publish gameplan
type: log
status: archived
updated: 2026-06-26
description: Built the docs front-door (root INDEX + usage playbook + workflows landscape), polished the workbench (centred, dark-default), and surfaced the consumer-contract root cause + a phased git→publish gameplan. Found the repo is not under version control.
tags:
  - domain/design-system
  - domain/workflow
  - pattern/component-workbench
repo: kol-design-system
related:
  - "[[workbench/01-using-the-workbench|using the workbench]]"
  - "[[session-log/2026-06-26-workbench-stories-backfill|stories backfill]]"
---

# Session: Docs front-door, workbench polish, and the git/publish gameplan

**Date:** 2026-06-26
**Agent:** Grim (Opus 4.8)
**Summary:** Made the docs navigable (root INDEX + usage playbook + workflows landscape), polished the workbench (centred stage, dark default, real-UI fixes), and — answering "why is consuming the DS hard?" — surfaced the consumer-contract root cause and a phased git→publish→showcase gameplan. Discovered the repo is not git-initialised.

## Changes Made

### Files Modified / Added — docs (the accessibility layer)
- **`docs/INDEX.md`** (new) — front door; routes by task, sends users straight to the workbench walkthrough.
- **`docs/workbench/01-using-the-workbench.md`** (new) — zero-knowledge usage playbook (18 steps); corrected to the real Ladle UI (sidebar right / toolbar bottom-left), dark-default + Dark Reader notes.
- **`docs/workflows/`** (new, INDEX + 6) — design-system landscape: workbench, tools, composition layer, tokens, distribution, versioning.
- **`migration/2026-06-26-workbench-adoption.md`** — marked `superseded` (executed).

### Files Modified — workbench
- **`.ladle/components.jsx`** — centred stage (components no longer stranded top-left).
- **`.ladle/config.mjs`** — `addons.theme.defaultState: 'dark'` (matches KOL's `data-theme="dark"`).
- (Earlier this session: full 50-component / 125-story coverage — see the backfill log.)

## Current State

### Working
- Docs navigable from `docs/INDEX.md`; usage playbook accurate to the live UI.
- Workbench: all 50 components, dark default, centred. `pnpm workbench` → localhost:61000.

### Known Issues / Findings
- **The repo is NOT under version control** — no `.git`. AGENT-CONTEXT's prior "git init done" claim was false. The #1 hole; corrected in AGENT-CONTEXT.
- **Root cause of past "linking pain" identified:** KOL has an unwritten **4-point consumer contract** — cascade order → `@source` at package `src` → React dedupe → fonts at `/fonts/`. The workbench now satisfies all four (it's the proof KOL is consumable). Documented in the workbench README but still NOT in the package READMEs.
- `ladle build` already emits a static site of all 50 components — a viable "showcase with all components" today.
- **Controls not yet added** — stories are static functions, so Ladle shows no args/knobs panel. Next step.

## Next Steps (the gameplan — pick up here)
1. **Workbench prep:** add `args` controls (live prop knobs) to the configurable components. (Centre already done.)
2. **Git foundation (#1):** `git init`, extend `.gitignore` (`build/`, `.playwright-mcp/`, decide on the ~17 MB fonts), first commit, create GitHub remote, push. **Needs human:** the GitHub remote.
3. **Prove external install (no creds):** `npm pack` the packages → install the tarballs into a throwaway fresh Vite app → render a component. The definitive "can a stranger use KOL" test.
4. **Publish:** real `changeset publish`. **Needs human:** `@kolkrabbi` npm-scope auth.
5. **Open fork:** showcase = `ladle build` (free, done) vs a separate polished catalog. Recommendation: start with the Ladle build.
6. **Harden:** write the 4-point consumer contract into every package README; add a boundary lint + token map.
