---
title: Port-hijack fix, plan relocation, release forensics
type: log
status: archived
updated: 2026-07-03
description: Removed the vite host:true port hijack, moved the execution plan to docs/plan.md (+improvements 6-7), explained the 0.1.2/0.2.0 release (user-merged Version PR) and the rejected push (stale remote, fixed via pull --rebase).
tags:
  - domain/design-system
  - domain/workflow
repo: kol-design-system
related:
  - "[[../../plan|execution plan]]"
  - "[[2026-07-02-backlog-execution-phases-0-6|backlog execution log]]"
---

# Session: Port-hijack fix, plan relocation, release forensics

**Date:** 2026-07-03
**Agent:** Grim (Fable 5)
**Summary:** Cleanup + forensics session; user is resetting context after this. No package code changed.

## Changes Made

- `showcase/vite.config.js` — **deleted `server: { host: true }`** (left by a prior session). It wildcard-binds all interfaces, which the OS allows to coexist with other repos' localhost-bound dev servers — so the showcase answered on ports already occupied by neighbouring apps (the "forced itself into 5174" bug). Back to default localhost binding; no port pinning needed.
- `docs/plan.md` — execution plan moved here from `docs/backlog/2026-07-02-execution-plan.md` (user's explicit location). All 5 referencing docs repointed (INDEX, review backlog, brand-extraction scan, taxonomy placement, execution session log); grep clean.
- Plan expanded with **improvement 6** (a11y ride-along: Stepper spinbutton/arrows, SegmentedToggle radiogroup/arrows, focus-visible) and **improvement 7** (type-conformance sweep, report-then-fix) — added before discovering the autonomous run had already executed them.

## Release forensics (no repo change)

- The 0.1.2/0.2.0 tags: **Version Packages PR #2 was merged from the user's own account** 2026-07-01 23:33 UTC, 38s after the icon-inventory push → `kol-loader@0.2.0` (the escaped changeset) + `kol-component`/`kol-framework@0.1.2` as dependent bumps. No bot, no agent.
- The rejected `git push`: origin/main had carried the 2 release-machinery commits since that merge; local never pulled. Resolved with `git pull --rebase && git push`.

## Current State

- Showcase binds localhost like every sibling repo; live npm versions are theme 0.1.1, loader 0.2.0, component/framework 0.1.2; **8 changesets queued** for one batched publish.
- **Rule:** the "Version Packages" PR *is* the publish button — leave the next one unmerged until a release is wanted, and `git pull` right after any merge of it.

## Next Steps

1. User review pass of the executed phases 0–6 (see `docs/plan.md` banner).
2. E3 tier-1 port approvals (LabeledSection first) + type-conformance fix approval.
3. Batched publish of the 8 changesets when the user unparks it.
