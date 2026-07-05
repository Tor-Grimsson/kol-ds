# Session: docs/operations split out of documentation/ + release-pipeline gh commands

**Date:** 2026-07-05
**Agent:** Grim (Claude Opus 4.8)
**Summary:** Walked through merging the "Version Packages" PR via `gh`, wrote those commands into the release-pipeline doc, then split repo machinery (`operations/`) out of the design-system subject tree (`documentation/`) as a sibling folder and fixed the numbering gap it left behind.

## Changes Made

### Files Modified
- `docs/documentation/05-operations/01-release-pipeline.md` — §4 gained the actual `gh pr list` / `gh pr merge <n> --merge --delete-branch` commands (was prose-only); then moved to `docs/operations/01-release-pipeline.md`.
- `docs/documentation/05-operations/02-workbench.md` — moved to `docs/operations/02-workbench.md`.
- `docs/operations/INDEX.md` — new, was missing after the move.
- `docs/documentation/INDEX.md` — dropped the 05-operations row, added a pointer note to the new location.
- `docs/INDEX.md` — registered `operations/` as a sibling sitting alongside `documentation/`.
- `docs/documentation/06-research/` → renamed `05-research/`, `docs/documentation/07-usage/` → renamed `06-usage/` (closes the numbering gap the operations move left at 05).
- `scripts/extract-usage.mjs` — output path updated to match the renumbered `06-usage/`.
- 6 files relinked across the renumber/move (00-overview, 02-components/01-inventory, 06-research→05-research workflows doc, etc.) — verified 0 stale refs, all wikilink targets resolve on disk.

### Features Added/Removed
- None — pure doc reorganization + one doc content addition (the `gh` commands).

## Current State

### Working
- `docs/` is now `documentation/` (00–06, subject matter) + `operations/` (sibling, repo/CI machinery) + `.obsidian/`. Contiguous numbering, verified.

### Known Issues
- **Uncommitted** — nothing here has been staged or committed; sitting as working-tree changes.
- **Session had an unrelated dotfiles detour mid-way** — while this repo's work was paused, a separate multi-step task ran in `~/.dotfiles` (unrelated repo): splitting the `kol-docs` Claude Code skill into a `kol-docs-fm`/`kol-docs-md`/`kol-docs-lib` trio + retiring the old `kol-docs-framework` package. That work is fully logged in dotfiles' own `.kol/llm-context/session-log/2026-07-05-kol-docs-fm-md-lib-split.md` — noted here only because it happened in the same conversation, not because it touches this repo.

## Next Steps
1. Review the diff, then commit (user owns git — not done automatically).
2. No outstanding follow-up specific to this restructure.
