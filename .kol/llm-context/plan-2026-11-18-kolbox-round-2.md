# Plan — kolbox round 2: close my own list before his review

**Raised:** 2026-11-18, him. Points verbatim: "so where did we end up in the code?"; "ok so then you should finish that? isnt pointless to get points from me?"; "new /p ?"
**Status:** 2026-11-18. Built and looked at: W1 to W5. W7 built: text runs on variable fonts (his ruling, built in `packages/design-editor/src` here; kol-fxr to be told by him). W6 waits on Figma. For his review, the calls made along the way are listed under each phase's report in `_tmp/2026-11-18-kolbox/`.
**Shape:** W › phase › list.
**Laws carried:** everything in `plan-2026-11-17-kolbox-app.md` still holds: the style is local to `apps/kolbox`; his names; `variant`; family word first; one shell carries the look; Tailwind first; overlays live in a body layer, never in a rail; the timeline is an overlay. The real editor and Labs are the parts list: a menu, window or control is built with the real one's rows, names and order (`_tmp/2026-11-17-groovebox/editor-parts.md`, `map.md`), never made-up ones. Nothing here reads Figma: looks come from parts kolbox already has. A control that cannot work is shown as not wired, never left looking live.
**How a phase closes:** the acceptance line read by a Playwright script from the running page at 1440 × 900, then the screenshot looked at; motion on a recording.

## The job in one line
Everything I listed as short in kolbox that can be closed without Figma, closed, so his first review is of a working app and not of my to-do list.

## W1 — The kit's missing pieces

### 1.1 — `Dropdown` opens `Menu` — ✅ built 2026-11-18 (0 selects; keyboard was dead in every Menu and is fixed; nested overlays: a later layer never closes its parent)
- Cause: `Dropdown` is a styled native select, built before `Menu` existed. It becomes a button that opens `Menu` with a check on the current option; menu rows carry their value.
- Acceptance: 0 `<select>` elements in `apps/kolbox/src`; opening any Dropdown on `#/labs`, `#/editor` and `#/morph` shows exactly 1 `Menu` whose parent is the body layer; picking a row changes the value (the Labs Type dropdown changes the lab); arrow keys and Enter work; 0 console errors.

### 1.2 — `Modal`, on `Popover` — ✅ built 2026-11-18 (`PopoverShell` shared by both; tokens dim, modal 480, modal-wide 820)
- One centred dialog shell with a dim behind it: the `Popover` look (radius 14, header with title and close, body, a footer slot for buttons), 480 wide, closing on Escape and on the dim. Not a second look: it renders `Popover`'s shell.
- Acceptance: `Modal` renders exactly 1 `Popover` shell; centred within 1px in the window; 480 wide; Escape and a press on the dim both close it; focus returns to the trigger.

### 1.3 — Small faults — ✅ built 2026-11-18, one extra item open (decimals: the number box was a browser number field drawn in the Mac's region format; Layers tree 16, 16, 24, 32; hover token; Tooltip stays in the window; Layer Effects labels on the wide column. OPEN: Export PNG fails with a text layer: the text font's TTFs are missing from the root `public/fonts/right-grotesk-ttf/` (2 of 98), the dev server answers with index.html, the font never warms, the export falls back to foreignObject and taints the canvas; `apps/minimal` and `apps/editor` share the fault; fix is copying the 98 TTFs from kol-fxr's `public/`, his call)
- Decimals read with a point, not a comma, in every Slider and Input ("0.08").
- The Layers tree gets a type icon on every row with the chevron, icon and name packed as built in Figma on 2026-11-18 (chevron to icon 16, icon to name 16, indent 24, row pitch 32).
- `SplitButton` and the tool dock's cells get a hover fill (the `hover` color at 0.05 of text, as Figma's `color/hover`).
- Acceptance: 0 commas in any numeric value on `#/labs`; rows = icons in the Layers tree, the three gaps within 1px of 16, 16 and 24; hovering a SplitButton half and a dock cell changes its computed background.

## W2 — The editor's menu bar and windows

### 2.1 — The menu bar — ✅ built 2026-11-18 (10 menus, rows equal to the real editor's, 17 flyouts, 31 rows disabled because their target is not mounted in kolbox: rail tab switches, workspaces, eyedropper, insert image, Home, Library and Randomiser chromes; File menu is one list for the bar and the file name)
- The ten real menus in the top rail, left of the mode track: FXR, File, Edit, Layer, Text, Vector, Tools, View, Window, Help, each a `Menu` with the real rows, groups, shortcuts, checks and flyouts from the parts list (E001 to E062). Flyouts are a `Menu` opened beside the row, the File menu's Starters, Aspect and Library included.
- Every row runs the engine's own action where the engine has one; a row with none is drawn disabled.
- The file name in the left rail keeps opening `MenuFile`, which becomes the same File menu, not a second list.
- Acceptance: 10 menu buttons in that order; each menu's row count and labels equal the parts list (a table per menu: listed, built); every flyout row opens a second `Menu`; rows that do nothing = rows drawn disabled (counted); Undo and Redo from the Edit menu change the canvas; 0 console errors.

### 2.2 — The windows — ✅ built 2026-11-18 (parts real / built: Shortcuts 7/7, Settings 14/14, Color Modes 9/9, Layer Effects 26/26, Batch export 12/12; one engine write proven each; Settings' Theme row not wired, kolbox has one look)
- On `Modal`: Batch export, Color Modes, Shortcuts, Settings, Layer Effects, each with the real window's parts and wired to the engine's own state and actions. Files stays the package's own window.
- Acceptance: each of the 5 opens from its real menu row and closes; its parts count equals the parts list; one write per window proven on the engine (a shortcut list read from the engine, a setting that persists after reload, a layer effect that changes the canvas, a color mode that changes the palette, an export that produces a file).

## W3 — The editor's controls on the engine

### 3.1 — Wire what the engine has; mark what it lacks — ✅ built 2026-11-18 (39 of 49 rail controls wired; not wired: Create component, the two Styles buttons, stroke position, individual sides, Add export, and in Stroke settings width profile, miter angle, Dynamic and Brush; Effects plus lists the engine's 10 layer effects, the picker its 67 stages; blend the engine's 6; boolean the engine's 4; canvas on the canvas color)
- Cause: several right rail controls were built from the Figma drawing's names (Drop shadow, Inner shadow, Layer blur, Noise, Texture, Glass; stroke position, sides, style, width profile; Figma's blend list) where the real editor has its own set. Each is matched against the engine: the Effects plus menu lists the engine's real layer effects and shader stages; `PopoverEffect` shows the picked effect's real parameters from the engine's schema, not four fixed rows; blend lists the engine's modes.
- A control the engine has no field for stays on screen as drawn but disabled, with a tooltip that reads "Not wired". Pages stay one page.
- The editor's canvas sits on the canvas color, like Labs and Morph.
- Acceptance: a table of every right rail control: wired or not wired; every wired control's change is read back from the engine's store by script; 0 controls that look live and write nowhere; every effect in the plus menu, once added, changes the canvas (screenshots differ); `PopoverEffect`'s row count equals the effect's parameter count in the engine; the canvas region's computed background is the canvas token.

## W4 — Morph, complete

### 4.1 — Steps and Save — ✅ built 2026-11-18 (add, edit, drag and Alt+Arrow reorder, Save and reopen from Files; real rules and hint texts carried; recording `_tmp/2026-11-18-kolbox/m41/morph-3-step.mp4`)
- Add a step (the real search modal's content in `Modal`: search, the catalog, pick), edit a step (its Generate, Style and Animation fields in the right rail, as Labs shows a lab), reorder by drag, and Save (name prompt in `Modal`, into the file library through the engine).
- The timeline shows each step's name at its diamond; pressing it opens that step for editing.
- Acceptance: adding a step raises the step count and the timeline's diamonds by one; editing a step's slider changes the canvas at that step; dragging step 2 above step 1 swaps their order in the engine; a saved morph appears in the Files window and reopens with the same steps; closed on a recording of a three-step morph playing.

## W5 — The styles board follows

### 5.1 — New parts on `apps/style` — ✅ built 2026-11-18 (26 of 29; 57 tokens in sync; other columns unchanged)
- `Modal` fills kolbox's Modal cell (today a gap); Dropdown's cell shows it opening `Menu`. The board's copy of kolbox's CSS rules is checked against the app's.
- Acceptance: kolbox reads 26 of 29 parts; 0 console errors; the other four columns' cells unchanged.

## W7 — Text on variable fonts (P: "we should instead just use a variable font? this text feature was made to morph static fonts, and it never really worked"; "malromur also has italic variable"; "build it here, we are working here … we will just tell fxr when we get to it, how it works")

Ruled 2026-11-18, deliberately against ARCHITECTURE §3's mirror rule for this one piece: the editor's text engine is changed HERE, in `packages/design-editor/src`; kol-fxr is told how it works afterwards, by him.

Cause: the text engine reads one static TTF per cut and weight (98 files, of which this repo has 2), so a text layer whose file is missing never gets outlines, and export falls back to foreignObject, which taints the canvas. One variable file per family carries every weight.

### 7.1 — The engine reads variable fonts — ✅ built 2026-11-18 (no dependency added: opentype.js 2.0.0 reads gvar; three gaps closed inside `fontLoader.js`: a shaping crash on Inter Tight, advances per weight, kerning re-read from the file; each font has a weight axis only, Inter Tight 100 to 900, Malromur 300 to 900; 12 of 12 cases export as paths, 0 foreignObject, 0 requests to the static folder; old cut layers read as Inter at their weight. Kerning and advances now match the browser's drawing of the same files (0.00px per pair at 100px for Inter, Malromur likewise). Left: the Generate letter mask, ASCII font list, Generate Cut window, pattern glyph tiles, `typography-cuts.js` and the styleguide `TypeBlock` still show the old cut names though every option draws as Inter; kinetic type untouched; the two static TTFs stay, `showcase/` uses them. Old versions of 11 files in `_tmp/2026-11-18-static-cuts/`)
- Families with outlines become the variable ones on disk: Inter (`public/fonts/inter/Inter-VariableFont_slnt,wght.ttf`, his file: weight 100 to 900 and slant -10 to 0 in one, italic is the slant axis; corrected 2026-11-18 from Inter Tight, "why inter tight? we are just using inter") and Malromur (`public/fonts/TG/TGMalromurRomanVF.ttf`, italic `TGMalromurItalicVF.ttf`, copied in from kol-foundry `tg-collection/desktop/tg-malromur/`). A text layer's weight is a value on the font's own weight axis, any value in its range, plus italic on or off.
- Outlines for a weight come from the one variable file at that axis value, so draw, morph between weights and vector export all run on outlines. The default family for new text is Inter.
- Old documents keep opening: a layer on the old static cut system is read as Inter at its nearest weight (so is a layer saved as Inter Tight or on the old Google Inter row) (read-time, no data sweep), the way the font model already migrates.
- The static cut system and its 98-file list leave the engine (moved to `_tmp/`, not deleted). JetBrains Mono and the Google list stay as they are, draw-only.
- Acceptance: with 0 files in `public/fonts/right-grotesk-ttf/` requested (network log), a text layer in each of the two families at weights 300, 500 and 800, roman and italic, renders as outlines (path elements, 0 foreignObject in the built SVG); the outline's width differs between 300 and 800 (measured); Export PNG and Export SVG with a text layer present each produce a file; the text morph between two weights plays, closed on a recording; a saved draft that used the old cut system opens with its text visible; `apps/editor` and `apps/minimal` still render a text layer with 0 console errors.

### 7.2 — kolbox follows — ✅ built 2026-11-18 (Typography section in the right rail: Family, Weight, Italic; the seed exports a PNG)
- The seed's Title is Inter; the editor's text controls in the right rail (family, weight as a Slider over the axis range, italic toggle) write to the engine.
- Acceptance: `#/editor` with the seed untouched exports a PNG; dragging the weight slider changes the canvas; 0 console errors.

## W6 — Still waiting — PARKED: needs Figma open
- The corner split's settings button and the images in the effects picker's tiles: nothing on disk says what they are.
- The file browser, the modals' real content (Move file, Share) and the mobile views in code: built in Figma on 2026-11-18, to be read from the file.
- The align pass of `plan-2026-11-17-kolbox-app.md` W6.
- Seen in the last look, not fixed: Morph at 0 s draws the Circle morph step as a half circle; Morph's artboard runs under the timeline (by the overlay rule); Labs' Rolls row stacks three buttons beside one label; the "Not wired" tip on Effects sits over the Effects and Export divider.

## Order
1.1 and 1.2 first (everything else stands on them), then 2.1, 3.1 and 4.1 side by side (top rail, right rail, Morph: separate files), then 2.2, 1.3, 5.1. kol-build-agents in the background; I look at each result before the next starts.
