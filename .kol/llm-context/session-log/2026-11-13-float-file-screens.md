# Session: Float file screens — Labs, Randomiser, Record, Metric, Ebook

**Date:** 2026-11-13
**Agent:** Claude (Opus 5.5) + kol-figma-agent runs
**Summary:** `plan-2026-11-13-float-file-screens.md` built and closed in three rounds in the float Figma file; Figma LAW 18–20 and two audit checks added.

## Changes Made

### Files Modified
- `.kol/llm-context/plan-2026-11-13-float-file-screens.md` — the plan (W1–W9), closed.
- `~/.claude/skills/kol-figma/LAW.md` — rule 18 (instance keeps its component name), 19 (no loose text in sections), 20 (screens 1440×900 fixed, clipped).
- `~/.claude/skills/kol-figma/scripts/audit.js` — fails `instance-renamed` and `loose-text-in-section`.
- `docs/operations/09-phase-log/2026-11-13-float-file-screens.md` + INDEX row + `_files/` copy of the plan.

### Features Added/Removed
- Float file (879P1yBsBPqpdGI5a5v2Y5): ↳ Float labs rebuilt (179:3235); ↳ Randomiser (190:2326); ↳ Record dashboard (40:8927) tabs + float; ↳ Metric dashboard (40:8931) standard + float; new ↳ Ebook (272:7754) — library, Folio, writer in record and float styles. Float = one view, a main view behind, windows toggled. Every screen has a phone twin. Old screens on `_trash`.

## Current State

### Working
- Every page audits 0 errors; 0 renamed instances, 0 loose section text across the file. Nothing published.

### Known Issues
- Plain-frame stand-ins where library masters differ from code: CalendarHeatmap, CalendarScale, StatTiles, card header, LineChart, RankedListRow share bar, RailFloat collapse-v body/footer, ReaderBar phone.
- Record phone screens follow the website's breakpoints, not a live render (float app breaks at 390; website needs login). Phone float windows 342 wide (Labs), outside 264/360.
- Ebook agent deleted 54 empty frames from its own captures instead of moving them to `_trash`.

## Next Steps
1. Fix the library masters above, his publish, then swap the stand-ins back to instances.
2. His ruling on the 320 randomiser rail and 342 phone windows vs LAW 6.
