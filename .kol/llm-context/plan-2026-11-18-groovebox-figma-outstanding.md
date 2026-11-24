# Plan — groovebox in Figma: what is outstanding

**Raised:** 2026-11-18, him. Points verbatim: "ok next is figma"; "whats missing is [149:26341] this page becoming the main library of components and views. basically the only relevant page. was that not added?"; "can you just write a new plan with outstanding issues now and list Ws?"
**Status:** W1 to W6 built 2026-11-18. Taken over by `plan-2026-11-18-kolbox-figma-three-pages.md`, which carries the open calls.
**Shape:** W › phase › list.
**Laws carried:** the design leads and the code follows. His reference is copied one to one, its real values read first. A system, not frames: every named part is a component in a labelled group, shell regions are slots, his names are kept. Content leaves a page by moving to the file's last page `_trash`, never deleted. Clip on for every screen frame. No Figma write without his explicit go, one agent at a time, one look at the end of a batch.
**How a phase closes:** the acceptance line read by script from the file, then one screenshot looked at beside his reference. Nothing here moves, so no recording.

File `SgfHBi22F7tYO7GHIorUbv`. This plan takes over the open pieces of `plan-2026-11-17-groovebox-labs-editor.md`; that plan stays as the record of what was built. Its numbers are given in brackets.

## W1 — The reference page becomes the library

Cause: W14 of the old plan filled the page `↳ groovebox reference` 149:26341 with instances and left every master and screen on `↳ shell` 19:9247 ("the components themselves keep living once, in their home; a sheet holds instances"). So the page he reads is a showcase and the real work sits on a page he does not want.

### 1.1 — Masters move onto their sheets — ✅ built 2026-11-18 (128 masters moved, 0 left on `↳ shell`, 137 on 149:26341 = 9 + 128; each sheet got a `Components` frame of labelled groups before its footer: Controls 222:21094, design view docked 222:21185, file browser grid 222:22045, design view floating 222:22055, Menus 222:22058, Modals 222:22133, Mobile app 222:22238; sheets widened where a group is wider than 1600, sections restacked 200 apart; 6389 instances on the page, 0 missing, 0 renamed)
- Every component master on `↳ shell` moves to the sheet on 149:26341 that shows it, in a labelled group under its name. A master with no sheet gets one in the section it belongs to, built like his sheets.
- Variables, text styles and effect styles are file-wide and do not move.
- Acceptance: 0 component masters on `↳ shell`; the count of masters on 149:26341 equals the count on `↳ shell` before the move; 0 detached, 0 renamed, 0 missing instances in the file; every master sits inside a named sheet.

### 1.2 — Screens move onto the view sheets — ✅ built 2026-11-18 (Desktop views: editor 222:22275, labs 222:22295, editor motion 222:22315, morph 222:22335; Menus and modals: Rail states 222:22355 and one sheet per overlay build, 222:22375 to 222:22555; each sheet built like his, SheetMark built; the four screens 1440 × 900, clip on; 0 screens on `↳ shell`)
- `editor` 39:9644, `labs` 45:10928, `editor motion` 142:18499 and `labs morph` 142:18697 move to the Desktop views section, each on its own sheet. The States row and the ten overlay builds move to their sheets under Menus and modals.
- Acceptance: the four screens and the overlay builds are on 149:26341, each 1440 × 900 where it is a screen, clip on; 0 screens left on `↳ shell`.

### 1.3 — `↳ shell` is retired — ✅ built 2026-11-18 (15 leftovers moved to `_trash` 76:13765 with `_` prefix, foundations specimen and his reference frames included, ids kept; `↳ shell` holds 0 nodes, page left for him to remove; his pages `groovebox` 11888 and `↳ figma reference` 8557 before and after)
- What is left on `↳ shell` moves to `_trash`; the empty page is removed by him in the GUI. His own pages `groovebox` and `↳ figma reference` are not touched.
- Acceptance: `↳ shell` holds 0 nodes; his two pages have the same node count before and after.

## W2 — The timeline floats (old 15.2)

### 2.1 — Measure first, then fix — ✅ built 2026-11-18, no edit (timeline slot absolute at y 700, 1440 × 200, last in layer order; rails 240 × 844 at y 56 and canvas 960 in all four screens; ToolDock 580,842 in `editor` and `editor motion`; 0 regions resized by `timeline`)
- The old plan says both "to build" (15.2) and "built 2026-11-17" (20.1). The phase starts by measuring; if the lines below already hold, it closes with no edit.
- In the Shell the timeline is out of the layout flow, at the bottom, full width, above the rails and canvas in layer order.
- Acceptance: in `editor motion` and `labs morph` both rails measure 240 × 844 at y 56 and the canvas 960 × 844, the same as in `editor` and `labs`; the tool dock's position is identical with the timeline on and off; the panel covers the bottom 200; 0 regions resized by the `timeline` switch.

## W3 — The mode track: Editor, Labs, Morph (old W17)

### 3.1 — Three modes on the track — ✅ built 2026-11-18 (TopRail 36:9458 third tab Output → Morph; tracks read editor Editor*, labs Labs*, editor motion Editor*, morph Morph*, and the docked sheet's Shell Editor*; 0 Output or Randomiser tabs; one Tabs 26:9490 everywhere; `labs morph` 142:18697 renamed `morph`; the Morph ListRow left LeftRail labs 147:20969, kept on `_trash` 223:32726)
- The track reads Editor, Labs, Morph. Output leaves it; Randomiser is not a mode. `labs morph` becomes the Morph screen with Morph lit; Morph leaves the Labs picker's category list.
- Acceptance: every screen's track has exactly 3 tabs labelled Editor, Labs, Morph in that order; 0 tabs labelled Output or Randomiser; the lit tab matches the screen; one Tabs component in all screens, 0 detached or renamed.

## W4 — Each overlay a component (old W18)

### 4.1 — Eight overlays as components — ✅ built 2026-11-18 (sheet `Overlays` 220:20089 in Menus and modals 149:28929, groups Menus and Panels; MenuBlendMode 220:20408, MenuBoolean 220:21115, MenuEffects 220:21653, MenuFile 220:22261, PopoverColor 220:22712, PopoverStroke 220:23459, PopoverEffect 220:24082, PopoverEffects 220:24704, each exactly 1 Menu or 1 Popover, own frame draws nothing; swapped into the 7 builds that hold an overlay with 0 dx, dy, dw, dh, and MenuFile in place of his file menu on the Menus sheet row 149:28937 (no build holds a file menu); 0 Menu or Popover placed directly in the ten builds, 0 overlays inside a rail; the 8 replaced copies on `_trash` 76:13765 with `_` prefix)
- Menus on one `Menu` each: `MenuBoolean`, `MenuBlendMode`, `MenuEffects`, `MenuFile`. Panels on one `Popover` each: `PopoverColor`, `PopoverStroke`, `PopoverEffect`, `PopoverEffects`.
- The ten builds place these in place of the hand-filled copies; the looks do not change.
- Acceptance: 8 components with those names, each holding exactly 1 `Menu` or 1 `Popover`; in the ten builds 0 `Menu` or `Popover` placed directly; 0 overlays inside a rail's layer tree; each build pixel-identical to before; 0 raw values.

## W5 — Tool dock, text color, Pages (old W19)

### 5.1 — ToolDock on Figma's dock — ✅ built 2026-11-18 (ToolDock 28:9326; measure: 125:27095 / built: cell 32 / 32; dock height 48 / 48; padding 8 / 8; tools gap 4 / 4; radius 13 / 13 (radius/float); tools to well 17 / 17 (gap 8, divider 1 × 24 color/border, gap 8; his draws no line); well 32 high, inset 2, pitch 30, radius 5 / same; well cell 28, radius 3 / same, through new collection `dock` (tools 32 and 5, well 28 and 3) bound on ToolButton; 0 strokes, effect style shadow/dock from his four effects, clip on; boolean `show well` and slot `well`; Transport 28:9433 now three ToolButtons (play active, rewind, loop) inside the same ToolDock; the variant chevron stays 12 by LAW where his is 24)
- Rebuilt on his reference 125:27095: 32 cells, soft shadow and hairline edge, the active tool a rounded accent cell, a chevron on a tool with variants, a second group in an inset well after a divider. The transport toolbar is the same shell and follows.
- Acceptance: cell size, dock height, padding, gap, radius, divider and well within 1px of 125:27095, as a table; 0 solid outline on the dock; one ToolDock component serves both; 0 raw values.

### 5.2 — A brighter text color, as a test — ✅ built 2026-11-18 (mode `Brighter text` 223:3 in `Groovebox · UI set`: color/text #FBF1C7, color/muted #BDAE93, the other 19 equal; sheet `Text color test` 223:42338 in Desktop atoms 149:28649, specimens 223:42575 (Gruvbox dark) and 223:42935 (Brighter text), each one LeftRail and one MenuBlendMode; 0 components edited)
- One rail and one menu side by side in today's text (#EBDBB2) and one step brighter (#FBF1C7), muted lifted in step, values labelled. A mode of the color collection.
- Acceptance: 2 labelled specimens differing only in text and muted; 0 components edited.

### 5.3 — Pages with one page — ✅ built 2026-11-18 (LeftRail 61:11908 gains `one page` true/false; variant 223:42059: Pages is a stock RailSection collapsed, 240 × 48, heading shows exactly the title and a plus, list hidden; `one page=false` keeps the list, 165 high with 2 rows; 0 parts special to Pages)
- With one page the Pages section is a plain collapsed section: title and a plus. The list and search appear from the second page.
- Acceptance: `LeftRail` with one page shows Pages 48 high with exactly a title and a plus; with two or more it shows the list; 0 parts special to Pages.

## W6 — The generator window

### 6.1 — Drawn on its own sheet — ✅ built 2026-11-18 (sheet `Generator window` 225:31400 in Menus and modals 149:28929, group Modals; GeneratorWindow 225:30450, 880 × 820, one Popover at size/modal-generator 880 (the code's window width); header Stripe Array with Expand, Style and Preset; body the code's grid: Settings nav of 7 ListRows (Field lit), the Field section's Source, Lights and Image groups as PanelSections, Preview aside with PreviewWell and two RailNotes; footer Live preview LabeledControl with Toggle, Reset, then Cancel and Apply in a ButtonGroup; 0 `Frame` layers, 0 loose text, every control a kit instance: 16 LabeledControl, 18 Input, 10 Slider, 4 Dropdown, 6 Button, 7 ListRow, 4 GroupLabel, 3 PanelSection, 1 IconButton, 1 Toggle, 1 PreviewWell, 2 RailNote, 1 ButtonGroup)
- The generator window was built in code (`apps/kolbox/src/editor/generate/`) and never drawn. It gets a sheet under Menus and modals, built from the kit, read off the real editor's window as the parts list.
- Acceptance: 1 `GeneratorWindow` component on its sheet; every control in it is a kit instance, 0 raw values, 0 `Frame` layers; each control in the real window is on the sheet or on a written "not drawn" list.
- Not drawn (no kit part): the kind beside the title ("Generate", muted); the state line under each Settings row ("Radial", "Continuous"); the accent bar on the lit row; the note at the right of each group title ("The gradient the style reads"); the Lights table headers X, Y, Radius, Intensity; the closed "Second source" fold (chevron, title, note) with its Type, Combine and Weight; the field map strip and its two labels; the "512 × 512 px" size beside the caption; the Not wired dimming (a Tooltip over disabled controls). The other sections' bodies (Ramp, Style, Mask, Warp, Randomness, Frame) and the Repeat and Paratype letter windows use the same parts and are not drawn.

## W7 — His calls — TALK

Nothing here is built before he rules.

### 7.1 — The four Surfaces colors — TALK
- Accent hover, disabled text, backdrop, disabled button: labelled gaps on the Surfaces sheet.

### 7.2 — The mobile sheets' mapped colors — TALK
- Accent standing in for his blue and the avatar colors are guesses. One 400 × 390 canvas crop stands in for the canvas in all four file views and shows its edge.

### 7.3 — The mobile menu rows have no gap — TALK
- `MenuMobile` rows touch, as in his reference; the gap law wants a gap.

### 7.4 — The two icon changes made without his go — TALK
- The search glyph redrawn and the four back chevrons inked `color/text`: keep or undo.

### 7.5 — Phone layout for Labs (old 4.3) — TALK
- His sheet has no phone drawing of the design view, so there is nothing to build from.

### 7.6 — Built and waiting on his review — TALK
- Left rail states (old W7), right rail sections (old W8), overlay parts and states (old W9, W13), the one rail system (old W12), the Labs rails (old 16.1).

## W8 — Set aside — PARKED: seen 2026-11-17, he has not asked for them

- Layer rows against his older rail 144:32321: he has not ruled which.
- The randomise buttons in the Labs right rail: no title, no icons, two buttons and the Color / Motion row missing.
- The audit of every part against his reference sheets: stopped partway on his word.
- Small differences: lit tint warmer than Figma's; effects menu 167 wide against his 202; active tab in Stroke settings accent where his is white; sliders have no filled run; the time field is two cells where Figma's is one; no stop glyph.

## W9 — Code — PARKED: kolbox is brought into line with the file only after the frames exist (W6 of `plan-2026-11-17-kolbox-app.md`)

## Order
W1 first, so everything after it is built on the one page. Then W2, W3, W4, W5, W6. W7 whenever he rules.
