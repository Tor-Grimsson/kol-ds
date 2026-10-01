---
title: Membership + previews
type: log
status: archived
created: 2026-08-09
updated: 2026-09-30
description: Tiers re-ruled and Utilities minted
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
  - "[[_files/plan-2026-08-09-membership-and-preview-contract|The plan]]"
---

# Membership + previews

**Run:** 2026-08-09 · **Plan:** [[_files/plan-2026-08-09-membership-and-preview-contract|plan-2026-08-09-membership-and-preview-contract]] · **State:** Wave E built and published (component 0.34.0); Waves A–D partly open

## Phases

| Phase | Docs | What was done |
|---|---|---|
| Tier re-rule | [[../../documentation/03-components/00-taxonomy\|taxonomy]] · [[../../documentation/03-components/02-placement\|placement § Re-sort map]] | *"atoms molecules etc. ARE FUCKING INCORRECT"* — the mechanical import test repealed; tiers judged by anatomy and role; 20 files moved |
| Homepage review | — | ten fixes: radius to the 4px law, Badge on StatusChip's ladder, menus content-sized, demos to one instance + a size picker |
| Wave E | [[../../documentation/03-components/00-taxonomy\|taxonomy § An atom paints]] · [[../../documentation/03-components/02-placement\|placement § The utilities re-file]] | **atoms paint and stand alone**; 13 files with no face → `utilities/`, one sidebar group; `validate:taxonomy` check 4 |
| Review burst | [[../../documentation/03-components/02-placement\|placement]] | EmptyState + PaletteHarmonyWheel → molecules, AsciiCursor → utilities, InteractiveImage retired; header glyphs `md` at full ink |
| Publish | [[../01-release/02-shipped-packages\|shipped packages]] | theme 0.34.0 · component 0.34.0 · framework 0.18.0 · workshop 0.21.0 |

## Decisions

| Decision | By |
|---|---|
| Tier is what a thing IS, not who consumes it | user |
| *"Atomic design is a design principle, NOT an invisible-helper principle"* — make a utility category | user |
| *"GROUP THIS TOGETHER"* — one Utilities folder and one sidebar group, not eight destinations | user |
| MenuPopover stays a molecule (it renders a MenuItem); Section and LabeledControl both stay (group header vs field label) | user |
| **Section Label, two words** — the display-name rule from 2026-08-01 applies to component titles | user |

## Open

- **Wave D — display names.** `labelFromSlug` exists (`showcase/src/nav/labels.js`) and is correct; component titles never read it. Still open on 2026-09-30.
- Wave C — card backfill + `validate:demos`; Wave B — Badge box, helper-mono sweep; Wave A — rails-hidden home, KOL-DS wordmark.
