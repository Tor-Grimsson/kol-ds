# Plan — icons: the chess set, the list sheet, Figma drift

**Raised:** 2026-11-05, the user, after today's icon work (search, tags, 22 re-files, lab-* renames, 7 duplicates retired; kol-icons 0.65.0). Points verbatim: *"but was this imported already?"* (library 437:5529) — *"really?? but that is not the same set AT ALL"* — *"I had at some point asked that the icons be set up with this system"* (library 437:4847, "Core Icons Needed") — *"sure add to /plan-shape"*.
**Status:** DRAFT — 2026-11-05. Open: everything.
**Shape:** W › phase › list.
**Laws carried:** the code is the source; Figma mirrors it. Icons take `oq-*`. Family prefix leads a name. Every icon carries tags (the `icon-tags` gate). A removed name stays alive in `RENAMED_ICONS`. Never name the outside icon library. Dark first in Figma. Never publish the Figma library (his click).
**How a phase closes:** measurable acceptance line first, gates green (icon-tags, icon-cuts, imports, syntax), then Playwright in the showcase against his words; Figma closes on audit.js 0 errors plus one legible screenshot per touched group.

## W1 — The chess set

### 1.1 — Import his twelve pieces — ✅ built 2026-11-05
- His frame 437:5529: solid black and outlined white pieces (pawn, rook, bishop, knight, king, queen). It is not in the code. The six outline `chess-*` icons are a different design, and the chess package's board pieces are a third.
- Pull the twelve SVGs from 437:5529 and clean them to the icon spec (24 grid, currentColor). Name them `chess-pawn-black`, `chess-pawn-white`, and so on for rook, bishop, knight, king and queen. Tag them (chess, game, board, piece, strategy).
- Acceptance: 12 new SVGs in the set; the icon-tags gate passes; ⌘K "chess" finds all 18 (Playwright).

### 1.2 — A games group — ✅ built 2026-11-05
- New interface group `games`: the twelve plus the six outline `chess-*` moved out of people. Add it to the gallery ORDER and the icon catalog doc.
- Acceptance: `kol-icon-set-interface/games/` holds 18; people holds no chess-*; the gallery's games page renders 18.

### 1.3 — Publish and mirror — ✅ Figma half built 2026-11-05
- Publish kol-icons (minor). Mirror to Figma: the masters into a games frame on ↳ Icon masters, the cells on ↳ Icons.
- Acceptance: the registry shows the new version; the Figma games frame holds 18 masters; audit 0 errors.

## W2 — The list sheet

### 2.1 — ↳ Icons in his list system — ✅ built 2026-11-06
- His sheet 437:4847: each category is a column of rows (icon, name) under a heading with its count, an accent rule beside each list, four columns across.
- Rebuild ↳ Icons in that layout, in dark, one column per interface folder (19, with games 20), with every row an instance of its master. Generate it from the folders so it can't drift.
- Acceptance: row count per category = file count per folder (script); 0 rows that aren't instances; audit 0 errors; screenshots legible at row level.

### 2.2 — The showcase list view — TALK
- Whether the showcase icon gallery gets the same list view beside its grid is his call.

## W3 — Figma drift found today

### 3.1 — Five fixes — ✅ built 2026-11-05
- Retire the robot outline master (the code has only `robot-solid`).
- Fill each identity frame from its folder (app-icon, favicon, tile, wordmark and the rest, 8–11 each).
- Add the `workshop` identity frame.
- Add the missing `bold` cell on ↳ Icons (typography 42 → 43); absorbed by 2.1 if that runs first.
- ↳ Icons to dark (absorbed by 2.1).
- Acceptance: every Icon masters frame's master count = its folder's file count (script); audit 0 errors.
