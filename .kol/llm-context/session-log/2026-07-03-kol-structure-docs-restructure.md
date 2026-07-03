---
title: .kol convention + docs restructure
type: log
status: archived
updated: 2026-07-03
description: Established the .kol/ structure convention (this repo = reference implementation) — machinery out of docs/, documentation/ rebuilt as numbered sections, LLM_RULES.md backfilled — plus the dotfiles skill updates that propagate the convention ecosystem-wide.
tags:
  - domain/design-system
  - domain/workflow
repo: kol-design-system
---

# Session: .kol convention + docs restructure

**Date:** 2026-07-03
**Agent:** Grim (Fable 5)
**Summary:** docs/ was a mess (9 scattered folders, agent state mixed with documentation, no front door). Established the `.kol/` convention with this repo as reference implementation, rebuilt `docs/documentation/` as numbered sections (monorepo `documentation/` model), and updated the dotfiles protocol skills so every kol repo converges.

## Changes Made

- **`.kol/` at repo root** — `llm-context/` (ARCHITECTURE, AGENT-CONTEXT, plan, backlog/, migration/, session-log/) + `docs-framework/` (was `docs/_framework`). `docs/` is now a pure documentation vault.
- **`LLM_RULES.md` backfilled** at root (was missing — protocol violation): boot steps → `.kol/llm-context/`, where-things-live table, house rules (log only on ask, user owns git, junk → gitignored `_tmp/`).
- **`docs/documentation/` = numbered sections**: `00-overview/` · `01-foundations/` (tokens·color·typography) · `02-components/` (inventory·placement·icons) · `03-compositions/` (blocks-and-sets·shells) · `04-brand/` · `05-operations/` (release·workbench) · `06-research/` (benchmark+workflows moved in) · `07-usage/` (generated; miner output repointed + re-run, 57 files). 7 docs authored new, 5 moved from dissolved single-file folders (`typography/ taxonomy/ shells/ release/ workbench/` — gone).
- **All live refs repointed** (wikilinks, `validate-taxonomy.mjs` → green, `extract-usage.mjs`, code comments, README, lobby INDEX); cross-boundary docs→`.kol` links converted to standard markdown links (wikilinks can't leave the Obsidian vault). Historical session-log bodies untouched. Framework conventions gained a **generated-folders exception** (unprefixed files, generator owns the folder).
- **Dotfiles (documented in `16-claude-agents/`):** new **`kol-migrate-structure`** skill (converge any legacy repo: moves, LLM_RULES backfill, repoints, optional docs-system proposal); `init-docs`/`log-work` search `.kol/` first + nag on legacy; `init-agent-context` + templates scaffold `.kol/`; **`init-scaffold` rewritten for npm** (installs `@kolkrabbi/kol-*` + the 4-point consumer contract — it was copying source from a nonexistent path). Protocol doc = `.kol/` canonical; skills 23→24.
- Global CLAUDE.md: never log unprompted · never drop artifacts at repo root · `_tmp/` must be gitignored on creation.

## Current State

- Repo root: `LLM_RULES.md` + `.kol/` + `docs/{INDEX, documentation/}` + packages/showcase/workbench/lobby/scripts. Taxonomy validator green, usage miner green at the new path.
- 12 changesets still held; publish ritual unchanged (Version PR = the button, `workbench` added to changeset ignore).

## Next Steps

1. **Sets = same treatment as blocks** (user-flagged): landing structure, `/sets/:slug` + `/sets/preview/:slug`, viewer stage — mirror the blocks pipeline.
2. Run `/kol-migrate-structure` across the other kol repos as they're touched.
3. User: git add/commit both repos; unpark the publish when ready.
4. Parked: `/components` nested-`<a>` bug; kolkrabbi.io `__TITLE__` meta (monorepo apps/web).
