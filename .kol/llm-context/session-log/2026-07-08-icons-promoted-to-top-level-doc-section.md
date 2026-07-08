# Session: Icons promoted to its own top-level docs section + resequence

**Date:** 2026-07-08
**Agent:** Grim (Opus 4.8 1M)
**Summary:** Continuation of the icon session. Moved icons out of `02-components/` (they're a loader-delivered asset tier, not components) into a new top-level `02-icons/` section, split the model from a generated inventory list, and resequenced the numbered documentation folders. Also moved the Figma export into `_tmp/`.

## Changes Made

### New section
- `docs/documentation/02-icons/INDEX.md` — the loader model (was `02-components/03-icons.md`), stale count fixed **~890→881**, reframed as its own architectural tier, related-links repointed.
- `docs/documentation/02-icons/01-inventory.md` — **generated** per-category roster of all 881 stroke names (21 categories) + stroke/solid counts + mirror-gap column. Marked "regenerate after any cull". Source of the numbers is disk (`packages/loader/src/{stroke,solid}`).

### Resequence (each folder shifted +1)
- `02-components → 03-components` (and its `04-taxonomy-audit-and-plan.md → 03-…`, closing the gap icons left; components back to 00–03)
- `03-compositions → 04-compositions` · `04-brand → 05-brand` · `05-research → 06-research` · `06-usage → 07-usage`

### Repointed (live tree + scripts only — history left intact)
- 13 live docs re-linked (single-pass regex), incl. `documentation/INDEX.md` table (new Icons row, labels renumbered), `docs/INDEX.md` prose (+"icons"), the components inventory's stale `[[03-icons]]` → `[[../02-icons/INDEX]]`.
- `scripts/extract-usage.mjs` output path `06-usage → 07-usage` (functional, lines 162/216) + `scripts/validate-taxonomy.mjs` comment `02→03-components`.

### Housekeeping
- `icon-core-export/` (144-core Figma hand-off, prior arc) moved to gitignored `_tmp/icon-core-export/` (151 stroke / 148 solid, path-encoded filenames).

## Current State

### Working
- 8 top-level sections: `00-overview · 01-foundations · 02-icons · 03-components · 04-compositions · 05-brand · 06-research · 07-usage`.
- All wikilinks resolve except **2 pre-existing** broken ones (unrelated to this move): `03-components/02-placement.md → ../backlog/2026-07-02-review-backlog` (cross-tree ref) and `06-research/workflows/06-versioning-testing.md → 01-release-pipeline` (stale since the 07-05 operations split).

### Known Issues
- Icon inventory doc is hand-regenerated, not scripted — after the pending core cull it must be re-run (the block was built ad-hoc this session; no committed generator script).
- `kol-loader` package-name question (why "loader"? should it be renamed now it's icons-only) is **parked** for a separate session — user flagged it, no decision.
- Everything uncommitted.

## Next Steps
1. `kol-loader` naming review (parked) — separate session.
2. When the icon core (144) is finalized in Figma: archive the ~614 unused + extract rack (109) to a kol-video set, then **regenerate `02-icons/01-inventory.md`**.
3. Optional: script the icon-inventory generation so the doc stays in sync (mirror `01-inventory.md`'s generated model).
4. Optional hygiene: the 2 pre-existing broken wikilinks.
