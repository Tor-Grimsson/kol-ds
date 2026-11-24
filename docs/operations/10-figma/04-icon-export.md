---
title: Icon export
type: reference
status: active
created: 2026-11-21
updated: 2026-11-21
description: How the icons built on bases in the iconset Figma file are written out as flat files in packages/icons
aliases:
  - icon export
  - flat icon export
tags:
  - domain/figma
  - domain/icons
  - audience/agency-internal
related:
  - "[[INDEX|Figma]]"
  - "[[03-icon-work|Icon work]]"
  - "[[05-icon-forms|Icon forms]]"
---

# Icon export

Bases live in the Figma file `iconset--kol-ds-ui` only. Code gets one flat file per icon. This is the step between them.

| Step | What | Where |
|---|---|---|
| 1 | Export every built icon on the `Icons` page as SVG text, one line per icon, `name=<svg body>` | a plugin call: `exportAsync({ format: 'SVG_STRING' })` on each icon component whose children are all base instances |
| 2 | Save that text to a file | `_tmp/<date>-icons-flat-export/figma-export.txt` |
| 3 | Write the files | `node scripts/import-figma-icons.mjs _tmp/<date>-icons-flat-export/figma-export.txt` |
| 4 | Run the checks | `pnpm validate:icon-tags`, `pnpm validate:icon-fills`, `pnpm validate:icon-duplicates` |

## What the script does

- Finds each name's file in the interface and signal sets and replaces it. The old file is copied first to `_tmp/<date>-icons-flat-export/before/`.
- Writes the ink as `currentColor`. Strokes stay live strokes at 1.5.
- A name with no file is reported and skipped. `--new name=set/folder` places a new icon, `--skip a,b` holds names back, `--dry` writes nothing.

## What to settle after a run

- **A new icon** needs its tags in `packages/icons/src/tags.json` and its row in the [[../../documentation/02-icons/01-inventory|inventory]].
- **Turned or mirrored icons from one base** go in `allowed` in `scripts/icon-duplicates-baseline.json` with the reason.
- **Two names that came out as one drawing** go in `pairs` in the same file until he picks the name that keeps it; the other becomes an alias.
- **Filled dots** from the dots base go in `allowed` in `scripts/icon-fills-baseline.json`.

## The line format

The body is Figma's own export with five repeated runs shortened, so a full set fits in one call: `~P` opens a path, `~C` a circle, `~R` a rect, `~A` closes a round-capped 1.5 stroke, `~B` a 1.5 stroke without the cap, `~D` a bare 1.5 stroke, `~F` a fill. The script expands them.
