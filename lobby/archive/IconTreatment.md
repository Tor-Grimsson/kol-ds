# IconTreatment — three icon batches as one treatment project

**Staged:** 2026-10-31 · from this repo (the 0.55.0 mis-ship cleanup)
**State:** ⚪ `parked` — plan, not for the set until the user approves.

## What it is

Three batches of icons, gathered out of the shipped set into one project so they can be worked on together:

| Batch | From | Icons |
|---|---|--:|
| A | kol-atlas `_tmp/icons/2026-10-31-more-icons-refs/` (Figma 174:25332) — shipped by mistake in kol-icons 0.55.0 | 164 |
| B | kol-website `_tmp/icons/2026-10-31-super-icon-kol24/` (Figma 160:20415) — shipped by mistake in kol-icons 0.55.0 | 143 |
| C | kol-hq `_tmp/icons/2026-10-28-claude-list/drawn/` — the Claude list, ticket [ClaudeListIconSet](../inbox/ClaudeListIconSet.md) | 252 |

A and B were moved out of `packages/icons` in kol-icons 0.56.0 (see its CHANGELOG). `calendar` (A) stayed in the set, because `MenuDatePicker` names it as its default icon; the copy here is the treatment copy.

## Where it is

All under `_assets/IconTreatment/`:

| what | where |
|---|---|
| source, never edited | `source/A-atlas/<first-group>/` · `source/B-website/<first-group>/` · `source/C-claude-list/NNN-<name>.svg` |
| every icon after treatment | `treated/<batch>-<name>.svg` (C keeps its `NNN`) |
| clusters, categories, bugs, styles, changes per icon | `report.md` |
| review page (source vs treated, by category and cluster, light and dark) | `review/preview.html` · `review/artifact.html`, built by `app-icon/bin/propose.cjs` from `review-spec.json` |
| kol-icons-diff-set (559 components in 15 category frames, current set beside as reference) | Figma `library--kol-icon` (91RgXQdroY01wN96lAiOv1), page `↳ diff` 200:23737; ids in `diff-set-figma.json` |

39 A/B source files carry the earlier sort's `clip-rule` strip; the 0.55.0 tarball holds the bytes as dropped.

## The treatment, done on the copies

1. 111 clusters of similar names or near-identical drawings, ★ strongest per cut — every icon kept.
2. One category list, 27 categories: the set's groups where they fit, eight new (`chart` · `commerce` · `control` · `data` · `flow` · `place` · `time` · `transport`).
3. Bugs found and listed per icon.
4. Styles per batch.
5. Mechanical normalisation: stroke 1.5, viewBox and width/height 24, keyline fit and centring, `currentColor`, junk stripped. Nothing redrawn; what needs a redraw is flagged.

Every name and every category is a proposal for the user.

## Done when

- [ ] The user has reviewed the page and picked per cluster
- [ ] Names and categories agreed
- [ ] Flagged redraws done in Figma
- [ ] The picks land in the set in one release, logged
