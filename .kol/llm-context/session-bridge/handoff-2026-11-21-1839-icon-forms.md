# Handoff — 2026-11-21 18:39

## Goal of the current arc
Build the icon set in the Figma file `iconset--kol-ds-ui` (`Lud0oSRKPTyHvT9MDVIczN`) so every icon comes out of shared components: part, form, base, build output, category. The system is written down in `docs/operations/10-figma/05-icon-forms.md`. Live plan: `.kol/llm-context/plan-2026-11-21-icon-forms.md` (W › phase › list). The older `plan-2026-11-21-iconset.md` is closed and is only a record.

## Last actions taken (causal trail, newest first)
- W10: read 21 new rows, 73 parts, 121 category icons. 0 drawn layers outside a part. Listed the parts that draw the same thing as another (in the plan under 10.1). Nothing changed.
- W9.2: the four raw marks from the old chevron-12 base removed from the new chevron-12 row.
- W9.1: arrows rebuilt on shared parts. New `Base/arrow` (181:10431) is keyline, `Line`, and `Chevron` twice as the head (switches `head`, `head-bar`). New `Base/arrow-turn` (182:10966) is keyline, new form `Arrow-turn` (parts `bend`, `corner`) and `Chevron` as head. 13 arrow outputs, undo, redo, corner-down-left and the four corner icons point at them. Clip is on for the arrow base and outputs because the head layer box reaches past 24.
- W8: the chevron layout base (165:7284) holds four centring frames `al-frame / above|below|left|right`, his construction, each on a switch. The 12 stroke weight was moved off `Base/line-12` and `Base/chevron-12` onto the cells and sets that show them, so marks inside a 24 icon draw at 1.5 on their own.
- W6, W7: his review fixed (closed file page, cube centred on the cube with a true hexagon, larger axis heads), polygon row takes the cube parts and five new polygon drawings, toggle row, shape-rectangle inner parts, line and ascii additions. 117+ icon components in the `Categories` section; built icons dimmed to 20 percent and locked on the Icons and Review pages (113 of 1,059 and 109 of 952 at that point).

## Current state / open decision points
- **9.3 is open and is his to do with me:** the old rows that have a new twin, the old cube row, and 16 superseded components marked with an underscore (`_Arrow/*`, `_Arrow`, `_Base/arrow`, `_Arrow-turn/*`, `_Arrow-turn`, `_Base/arrow-turn`) are still in the flow. A plugin call that moved a row to the `_trash` page was refused by the permission classifier once. Calls that only add, rename or swap have gone through; one call that removed four small cells I had made also went through. Do not work around a refusal: stop and tell him.
- **Code and the library are behind Figma.** Only `rectangle` and `diamond` were written to `packages/icons` and redrawn in the library. Every output redrawn since (file, 3d-cube, 3d-axes, the polygon shapes, toggles, the new line and ascii ones, all 20 arrow and corner outputs) still has its old drawing in code and in the library. Export step: `docs/operations/10-figma/04-icon-export.md`, script `scripts/import-figma-icons.mjs`. The arrow exports now carry a clip group because clip is on; check what the import script does with it.
- `arrow-circle` still has its own head part (`ring-head`); not rebuilt on the chevron.
- The duplicate parts found in W10 are a list, not a fix. Fixes wait for his word.
- About 35 icons are listed in the plan (6.5 to 6.10) with what each lacks; twelve marked host and circle icons (shield-check, heart-pulse, seven file ones, search-circle, more-circle, check-circle) are not built.
- The green arrows from the flow to the category cells were last re-aimed before W8 and W9; rows have changed height since. He adjusts arrow ends by hand; only the starts are mine to move.
- Icons built after W7 (the corners, the new line and ascii ones) may not be dimmed on Icons and Review yet. W7 says each later row is dimmed in the same step.
- W4 (his deletes on the Review page) still waits for his "done".
- Lobby inbox holds two tickets (FigmaDocFrameRule, LogoShapes) that were not touched this session.

## Next intended action
- Ask nothing; wait for his word on the trash move (9.3), then do it with him. After that the natural next phases are re-exporting code and the library from the new outputs, and the W10 fixes if he wants them.

## Working memory not yet in AGENT-CONTEXT
- Row naming: rows built this session are `Lane / Form/<name>` or the first six `Lane / Base/<name>`; old rows are `Lane / Base/<name>` and `Lane / Icon/<Name>/base`. New and old share titles until the trash move.
- Key ids: flow frame 111:17280 in section 111:17279; Categories layout 134:5068 in section 131:5068; `Line` 120:10976; `Line/output` 124:5688; `Line-12/output` 140:5341; `Shape-rectangle` 142:5334 and its output 142:5383; `Container-square-line/output` 157:6708; `Container-square-line-12/output` 145:10099; chevron layout output 165:8627; `Chevron-12/output` 165:7229; `Polygon/output` 164:8006; `Arrow/output` 164:7140; `Arrow-turn/output` 164:7407; toggle row 175:13540.
- Plugin lessons: setting `vectorPaths` drops the round caps and moves the vector, so set x, y and `strokeCap` after; a rotated instance keeps its place only if clip is on or its layer box stays inside the frame, otherwise the SVG export shifts; an override set on a nested instance is lost when its variant is swapped, so put modes on the context, not the layer; `cellOf(row,'Raw').findOne(TEXT)` returns the Annotation's text, not a name label.
- His rules restated this session: a row is planned from the drawings, never from its name; a part another form draws is that form; a cube icon is centred by the cube; a polygon is shortened by moving top nodes, never squashed; one frame per category; nothing is removed that he placed; `/r` means answer only; replies short.
- Screenshots for him are in `_screenshots/07-bases-flow/` (01 to 32).
