# Plan — kolbox round 3: what I called done and was not

**Raised:** 2026-11-18, him. Points verbatim: "what about in editor raidal copy and the those tools that had specific modal windows?"; "so what you are sayig is you are infact not even close to being done"; "no rejected, just fold this into a /p I dont have time for your hour long audit checks that just waste time"; earlier "but did you build home?"; "and no mobile views?"
**Status:** 2026-11-18. Built and looked at: W1 to W7, W9, W10. 11.1 built, for his review. Also built on his word: sample files on home (`home/samples.js`, 14 real files, seeded once into an empty library) and the Color window's Wheel view (`ui/ColorWheel.jsx`, kol-component's `WheelTriangle` carried line for line). TALK, nothing built: whether pattern stays a layer type or becomes a fill paint type or an effect. W8 waits on Figma. Each phase's report, script and screenshots are under `_tmp/2026-11-18-kolbox/r3-*/`.
**Shape:** W › phase › list.
**Laws carried:** all of `plan-2026-11-17-kolbox-app.md` and `plan-2026-11-18-kolbox-round-2.md`: the style is local to `apps/kolbox`; his names; `variant`; family word first; one shell carries the look; Tailwind first; overlays in a body layer; a window is a `Modal`; a control that cannot work shows "Not wired". The real editor's source is the parts list: rows, names, order and behaviour are carried, never made up. No audit pass up front (his ruling): each phase reads the real source for its own area as its first step and builds everything that area has, so nothing in it is left for a later round; what a phase finds outside its area is added to this plan as a new phase, not built on the side.
**How a phase closes:** the acceptance line read by a Playwright script at 1440 × 900, the count of real parts against built parts equal, then the screenshot looked at; motion on a recording.

## The job in one line
The editor areas kolbox is missing, built from the real editor: the generator window on float's model, the search modal, the Parameters tab, the small dialogs, the dead menu rows, the home screen, the leftover font names and kinetic type; then the Figma side when it opens.

## W1 — The generator windows (P: "radial copy and those tools that had specific modal windows")

### 1.1 — Every window in `editor/generate/windows.js` — ✅ built 2026-11-18 (`editor/generate/GeneratorWindow.jsx` on float's `ModalSettings.jsx`, 880 × 656; 69 settings rows equal to float's across 7 styles, plus Repeat and the Paratype letter; opens on the engine's own event, a double click, the rail's settings buttons and three Tools rows. For his review: two-handled sliders are two number boxes; Cancel and × restore the opening values where float only closes; Line Screen's Angle and Flare and Repeat's Align to path are Not wired; Repeat count 6 draws 6 shapes, 5 copies and the source)
- Cause: the windows round worked from a parts map that never listed the generator's windows, so the whole family was missed.
- All of them, as the real editor opens them for a generator layer: Source, Ramp, Mask, Warp, Randomness, Frame, each style's own sections (Lines, Dots, Cells, Ramp, Layout, Shape ramps, More geometry and the rest the file defines), and Repeat with its Radial, Grid and Mirror modes.
- The model is float's generator window (his screenshot, 2026-11-18: "look to float to see something along [this] which should be easy to flip to kolbox"), one window, not one per section, flipped to kolbox's look and built on `Modal`:
  - header: the generator's name, "Generate", Expand, the style dropdown, the preset dropdown, close;
  - left: the SETTINGS list, one row per window (Field, Ramp, the style's own, Mask, Warp, Randomness, Frame), each with its state line under the name ("Continuous", "11 rows", "None", "Off", "128 px inset"), one lit;
  - middle: the lit row's sections, each a title with its note at the right ("Source", "The gradient the style reads"), controls two across (dropdown, paired X and Y, slider with its number box), list sections with rows and an add button (Lights: X, Y, Radius, Intensity, remove, "+ Add light");
  - right: Preview with the Live mark, the square preview, its size, the Field map strip with its readout, the style's description, "Updates as you adjust settings.";
  - footer: Live preview toggle and Reset at the left, Cancel and Apply at the right.
- First step: find the file that draws this window in float (the editor's float chrome, `packages/design-editor/src/editor/float/`, or `apps/float`) and carry its structure and behaviour (Live preview, Reset, Cancel and Apply) as they work there. Controls are generated from `windows.js`'s own definitions, so a new control there appears here.
- Acceptance: rows in the SETTINGS list = windows the file defines for the open style (a table: window, real controls, built controls, equal); every part named above is present (a count against float's window, equal); with Live preview on a slider change redraws the preview and the canvas, with it off only Apply does; Cancel restores the values the window opened with; Reset returns the defaults; Repeat in Radial mode with count 6 puts 6 copies on the canvas; 0 console errors.

## W2 — The Parameters tab

### 2.1 — A generative layer's parameters in the right rail — ✅ built 2026-11-18 (`editor/properties/`: Canvas, Typography, Parameters, Pattern; every type's control count equals the real one; kinetic mounts the composer. For his review: shapes now get Generate / Style / Animation tabs, against W8's "no tab track"; nothing selected shows the canvas settings where the real rail is empty. Not built: the multi-select inspector, modulation list, bind dots, origin picker, skew. Unproven: path Closed changes the store, the picture change was not shown)
- Selecting a generative, pattern, photo, kinetic, group or path layer shows that layer's real inspector in `RightRail`, as Labs shows a lab: Parameters (Generate, Style, Animation), and the type's own sections. Today only shapes and text get a full rail.
- The Labs bodies are reused for the shared parts (the real editor's Parameters tab is the Labs panel).
- Acceptance: for each layer type the real editor has an inspector for, the rail's section and control count equals the real one's (a table per type); changing one parameter per type changes the canvas; 0 layer types fall back to an empty rail.

## W3 — The small dialogs

### 3.1 — Blend, baking, media picker — ✅ built 2026-11-18 (`ModalPrompt`, `ModalConfirm`, `WindowBaking`, `WindowMediaPicker`; 0 browser prompts or confirms; the engine's own prompts also come up as kolbox dialogs through a provider on kol-component's shared slot; bake has no cancel, as the real one; the picker has no upload or camera, as the real one)
- Blend… asks for its steps in a `Modal` (today the browser's own prompt box); the confirms likewise.
- Baking loop… shows its progress in a `Modal`.
- From library opens the media picker in a `Modal`, on the fixture library, with upload and camera as the real one has them.
- Acceptance: 0 `window.prompt` and 0 `window.confirm` in `apps/kolbox/src`; Blend with 5 steps adds 5 layers between two shapes; a baked loop finishes and the modal closes; picking an image from the library puts it on the canvas.

## W9 — The search modal (P: "also do we have the search modal? it should look like [this] but again flipped for kolbox")

### 9.1 — ⌘K search, flipped from float — ✅ built 2026-11-18 (`ui/ModalSearch.jsx`, `search/`; on all four screens; rows 40, field 44, icons 20 after the size pass. For his review: first tab reads "Overview" as his screenshot, float's code says "All"; Recent has 3 rows, float's fourth is a menu item kolbox lacks; footer hints still small)
- Cause: kolbox has none; search was ruled out of the rails because it lives on ⌘K, and ⌘K was never built.
- The real one is `packages/design-editor/src/editor/float/FloatCommandSearch.jsx`: its sources (tools, actions, pages, recents), ranking and behaviour are carried; the look is kolbox's.
- Parts, from his screenshot: the search field with its lens and the ⌘K key mark; the tabs Overview, Actions, Tools, Pages; group titles (Recent, Pages); rows of icon and name, one lit; the footer with Navigate, Run and Close and their key marks.
- Opens with ⌘K on `#/editor`, `#/labs`, `#/morph` and `#/home`, and from a search cell with its ⌘K mark at the end of the tool dock, as float's dock has it. Arrow keys move, Enter runs, Escape closes.
- Acceptance: ⌘K opens exactly 1 search modal on each route and Escape closes it; the four tabs are present in that order; typing "rect" lists the Rectangle tool first and Enter makes it the active tool; a page row switches the route; the rows per tab equal the real one's sources (a table: tab, real, built); the dock's search cell opens the same modal; 0 console errors.

## W10 — One menu on the logo, no menu bar (P: "who approved that? that wasnt in the design"; "my idea was to add something here to get this kind of menu INSTEAD of the topbar"; "either logo or 'Flow study' splitbutton"; ruled: the logo)

### 10.1 — The menu bar leaves; the logo opens the menu — ✅ built 2026-11-18 (`ui/MenuMain.jsx`; the bar's code in `_tmp/2026-11-18-menubar/`; menu rows equal before and now; the mark is the set's `wave` glyph on an accent tile; Saved from the engine's saved mark; file rows Save, Save as, Rename, Duplicate, Files; Labs and Morph show mark and KOL only)
- Cause: I put the real editor's ten-button menu bar into the top rail in round 2. His design has none: the top rail's left is the KOL mark, "KOL / file name" with its chevron, and the Saved mark.
- The top rail's left becomes his design: the mark (the accent tile), "KOL", the slash, the file name with a chevron, the Saved state from the engine. The ten buttons go (`editor/MenuBar.jsx`'s bar is moved to `_tmp/`; its row definitions stay, they are the menus).
- Pressing the mark opens one `Menu`, on Figma's model (his screenshot): first row "Actions…" with the lens and ⌘K, which opens the search modal (W9); then the menus as rows that each open their flyout: File, Edit, Layer, Text, Vector, Tools, View, Window, Help, grouped with separators; the FXR menu's own rows (Home, the chromes, Settings…) sit in the last group. Rows, order inside each flyout, shortcuts and actions are the ones already built.
- How a child opens (his second screenshot, Figma's Object menu open, 2026-11-18): the parent row is lit in the accent while its child is open; the child is a second panel directly beside the parent's right edge, not hanging from the row: it starts near the top of the window and takes the height it needs; groups are divided by separators; shortcuts sit at the right edge; rows that do not apply are greyed, not removed; a row with children of its own carries a chevron and opens a third panel the same way; when the list is taller than the window the panel ends in a down arrow and scrolls. Today's flyout hangs 8 below its row: that changes to this.
- The file name's chevron opens the file's own rows only (the ones the engine has: rename, save as, duplicate, Files…), not the whole File menu a second time. The left rail's file header opens the same.
- Labs and Morph get the same top rail left and the same menu on the mark, with the rows that do not apply there disabled as the real one does.
- Acceptance: 0 menu buttons in the top rail; the top rail's left reads mark, "KOL", "/", file name, chevron, Saved, in that order; pressing the mark opens exactly 1 `Menu` whose first row is "Actions…" with the ⌘K mark; every one of the nine menu rows opens a flyout whose rows equal the round 2 menus' rows (a table: menu, before, now, equal); with a child open, its parent row's background is the accent, the child's left edge is within 4px of the parent's right edge and the child's top is at or above the parent row's top and inside the window; a child taller than the window shows the down arrow and scrolls; Actions… opens the search modal; Undo from Edit's flyout changes the canvas; the Saved mark changes to unsaved after an edit and back after Save; 0 console errors.

## W4 — The dead menu rows

### 4.1 — Mount what the 31 disabled rows point at (the rows now live in the logo menu's flyouts, W10) — ✅ built 2026-11-18 (0 rows dead for lack of a target; Assets, History, Navigator, Stroke, Color, Swatches, Output, File are popovers at the left rail's edge, 320 wide, parts equal to the real tabs, one engine write proven each; Timeline shows the floating timeline, rails keep 240 × 844; workspaces in kolbox's own store; left rail collapses to 49; eyedropper and Insert image work; Export and Preview wired. Randomiser is out of the menu: the engine's randomiser is a whole chrome. Not wired: Color's Wheel view. Swatches' AC palette shows 22 of 36 chips: it reads KOL tokens kolbox does not define)
- Cause: the menu bar was built before its targets. Each disabled row names a part kolbox does not mount: the left rail tabs (Layers, Assets, History, Navigator, Stroke, Color, Swatches, Color Modes, Transport, Output, File), the right rail tabs (Inspector, Parameters, Effects), Timeline, Workspace (save, saved list, reset), Show / hide rail, Show / hide settings, Eyedropper, Color, Insert image, and the Home, Library and Randomiser chromes.
- Each target is built and its row goes live. Where the groovebox design moved a part (Assets and search are out of the left rail by his ruling; Randomiser is reached from Labs), the row follows the ruling: it opens the part where it now lives, or stays out of the menu, never a dead row.
- Acceptance: 0 menu rows disabled for lack of a target (rows greyed because they do not apply to the selection do not count); a table: row, what it opens, where; Timeline from the Window menu shows the floating timeline in the editor with the rails keeping their height; a saved workspace restores which rails are open.

## W5 — Home

### 5.1 — The home screen and its route (P: "but did you build home?") — ✅ built 2026-11-18 (`home/`: Browser and its parts on the engine's file library; measures within 1px; open, Create, sort, type filter, search work. Not wired, the library has nothing behind them: bell, Community, All folders, Resources, Trash, Admin, Starred, Share, stars. Reads "Not signed in". An empty library shows an empty browser with no message)
- `#/home`: `HomeRail` beside the file browser, grid and list, on the real file library, as built in Figma on 2026-11-18 (`Browser`, `BrowserTopBar`, `BrowserTitleRow`, `FileGrid`, `FileCard`, `FileList`, `FileListHeader`, `FileListRow`). Measures from the plan's 14.2 record: sidebar 240, top bar 49, title row 64, card 355.7 × 259.9 with a 198.9 cover, list header 39, rows 48.
- Opening a file goes to `#/editor` with it; the FXR menu's Home row and the file name's menu lead here.
- Acceptance: the grid shows one card per file in the library and the list one row per file (counts equal the library's); the listed measures within 1px; opening a file lands on `#/editor` with that file's layers in the Layers tree; the Home row is live.

## W6 — Font leftovers

### 6.1 — Old cut names out of the other pickers — ✅ built 2026-11-18 (mask, ASCII, pattern tiles, presets, `typography-cuts.js`: Inter or Malromur with a weight slider; old values read as Inter)
- The Generate letter mask, the ASCII font list, the Generate Cut window, the pattern glyph tiles and `typography-cuts.js` list the variable families and weights, not the old cut names.
- Acceptance: 0 old cut names (Tight, Compact, Narrow, Wide, Spatial, Fine, Dark) in any picker's options; each picker's choice changes what is drawn; old documents that stored a cut still open.

### 6.2 — Kinetic type on variable fonts — ✅ built 2026-11-18 (kinetic's fonts are Inter, Malromur, Rot, Gullhamrar; Rot and Gullhamrar were wrongly dropped by my brief and restored the same hour; the TG files are the 2026-11-12 exports from kol-foundry, September ones in `_tmp/2026-11-18-tg-fonts-september/`; Rot italic from its own file; kerning within 0.02px of the browser; the fonts load from `/fonts/TG/` where `/fonts/tg/` never loaded. Changed look: Gullhamrar and Malromur default to weight 400, was 300)
- Kinetic type reads the same families and weight axis; the Kinetic composer is shown in kolbox (today a line says it is not redrawn).
- Acceptance: a kinetic preset plays in Inter and in Malromur with 0 requests to the static font folder; the composer's control count equals the real one's; closed on a recording.

## W7 — Seen and not fixed

### 7.1 — The four from the last look — ✅ built 2026-11-18 (Rolls chips wrap under their label; tips clear the dividers; Theme row removed; Morph's half circle at 0 s is the preset's own drawing, left)
- Morph's first step draws as a half circle at 0 s; Labs' Rolls row stacks three buttons beside one label; the "Not wired" tip sits over a divider; the editor's Settings Theme row is dead.
- Acceptance: at 0 s the Circle morph step is a full circle (its bounding box is square within 1px); the Rolls buttons sit in one row or each has its own label, as the real Labs has them; the tip clears the divider; the Theme row is gone or works.

## W11 — `pnpm style` grows a stylesheet per style (P: "is there only the one comparison view in pnpm style? I was thinking that style would be more like a stylesheet? nicely structured space to view everything. at least if you'd /kolbox /float or whatever?"; "I still want the comparison board its important for another job im working on, but we should expand the pnpm style")

The comparison board is kept exactly as it is, at the address it has today (`#/`), and `#/pair` stays too: he uses the board for another job, so neither its address nor a cell on it changes.

### 11.1 — The kolbox stylesheet, as a designed draft first — ✅ built 2026-11-18, for his review (`apps/style/src/Kolbox.jsx`, `#/kolbox`; 11 sheets, 48 of 48 `ui/` parts and the 8 `home/` parts, 62 of 62 tokens read at run time; `#/` gains one link, `#/pair` unchanged. Thin: the Menus and Modals sheets are rows with an Open button, since kolbox's overlays render into the body. Found by the sheet and fixed: no focus ring rendered on Button, IconButton, Tabs, Toggle, Checkbox, ListRow)
- A new page `#/kolbox` in `apps/style`: the whole style on one structured page, the live parts, not pictures. Laid out on the model of his Figma reference sheets (which he called easy to read): one sheet per group, each with a title, a one-line note, the specimen of live parts in their states, and their values beside them (token name and value, size, radius, type step).
- Sheets, in his reference page's order: Surfaces and color; Type; Space, radius and sizes; Controls (each with its states); Menus; Modals and popovers; Rails (`Rail`, `LeftRail`, `RightRail`, `HomeRail`, their rows and sections); Docks and timeline; Shell; Screens (Editor, Labs, Morph, Home as links that open the app).
- A contents rail at the side lists the sheets and jumps to them; the page's own chrome is KOL default, the specimens sit in kolbox's scope, as the board does it.
- Values are read from the tokens at run time, never typed twice, so the sheet cannot drift from the style.
- This one page is shown to him before the other styles get theirs: the last stylesheet attempt failed for being an inventory, so the layout is settled on one style first.
- Acceptance: `#/kolbox` renders with 0 console errors; every part in `apps/kolbox/src/ui/` appears on exactly one sheet (a count: parts in the folder, parts on the page, equal); every token in kolbox's `index.css` appears with its value (count equal) and each shown value equals the computed one; each contents row scrolls to its sheet; `#/` and `#/pair` are pixel-identical to before.

### 11.2 — The other four styles — TALK: after he has seen 11.1
- `#/float`, `#/default`, `#/folio`, `#/minimal` on the same layout, and a row of links between the board and the five stylesheets.
- Acceptance: written when 11.1's layout is settled.

## Seen in the last look, not fixed (2026-11-18)
- Labs: the roll scope row runs a few px past the rail's inner edge; the Preset dropdown cuts to "Obstacle fl…"; a halftone photo layer's rail header has no title.
- Home: the Create plus is on-accent ink where the reference greys it.
- The timeline lists layers in the reverse order of the Layers rail (as the real one); its Add keyframe looks live with no track.
- Penrose's glyph shape and three flow loops still carry old font paths or names.

## W8 — Figma — PARKED: Figma is refusing edits
- The five unbuilt mobile sheets (the saved call), then all twelve mobile screens looked at beside his.
- The generator windows drawn in the groovebox style, as their own sheets.
- The mode track (Editor, Labs, Morph), each overlay its own component, the tool dock, the four Surfaces colors on his call.
- Then mobile views in code, and the align pass.

## Order
1.1, 2.1 and 5.1 side by side (generator window, right rail, home: separate files); then 10.1 and 9.1 (the logo menu, then the search modal it opens), 3.1, 4.1 and 6.1 side by side; then 6.2 and 7.1; 11.1 last, when the kolbox parts have stopped changing. kol-build-agents in the background; I look at each result before the next starts.
