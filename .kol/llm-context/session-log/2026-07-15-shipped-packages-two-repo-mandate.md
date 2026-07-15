# Session: SHIPPED-PACKAGES canonical table + two-repo mandate

**Date:** 2026-07-15 (night, closing leg)
**Agent:** Grim (Opus 4.8)
**Summary:** The package list was scattered/buried across the docs vault (one index still said "8 packages") — a canonical SHIPPED-PACKAGES.md now lives in operations with versions, wired one-click from every entry point. User mandated two-repo operation: agent juggles kol-ds-ui + kol-website directly, no more human-mediated ledger shuffling.

## Changes Made

### SHIPPED-PACKAGES (docs)
- **NEW `docs/operations/SHIPPED-PACKAGES.md`** — THE package table: 15 packages (UI 11 / clients-brand-tools 4), staged versions, one-line jobs; kol-loader orphan + kol-specimen (pending deprecate) footnoted. **Release ritual: every publish bumps this file** (now step 6.0 in the pipeline doc).
- Wired one-click from every entry point: docs/INDEX front door (first body line), operations/INDEX (first table row), documentation/INDEX (stale "8 packages" → 15 + link), 00-overview ("The packages" leads with the pointer + related).

### Two-repo mandate (user ruling)
- Agent works kol-ds-ui + kol-website (`~/dev/projects/kol-website`) in the same session — DS change lands here, consumer side applied there directly (bumps, shim deletions, fork removals). No more `_tmp/DS-CHANGES*.md` human mediation.
- Constraints stated: (1) website's npm bumps still gate on the user pushing this repo (no linking, per ARCHITECTURE §1) — website work stages until publish lands; (2) each repo keeps its own agent context/logs — boot the website's context before touching it.

## Current State

### Working
- Batch cleared + gated (push == publish): component 0.11.0 · chess 0.3.0 · framework 0.5.0 · content 0.4.0 · theme 0.8.0 (⚠ removes kol-label-*) · icons 0.7.0 · foundry 0.4.2 · workshop 0.1.6.

### Known Issues
- Sidenav epic parked (user scoping doc pending) · casing-arc remainder parked · showcase visual audit due 2026-07-16 (Todoist).

## Next Steps
1. **User pushes → CI publishes**, then the NEXT SESSION goes two-repo: boot the website's agent context, bump it onto the batch, apply its consumer notes (ledger-2.0 outcomes, 2 JetBrains italic woff2s, kol-sources.css import, optimizeDeps.exclude, kol-label-* check, elder CodeBlock swap), delete retired shims.
2. Chess app consumer side (brief-2.0 resolution) when its turn comes.
3. Live handoff detail: `playbook/2026-07-15-two-repo-handoff.md`.
