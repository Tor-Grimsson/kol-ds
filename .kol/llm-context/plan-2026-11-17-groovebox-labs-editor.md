# Plan — groovebox: one docked shell for Labs and the editor, in Figma first

**Raised:** 2026-11-17, him. Points verbatim: "take a look at this style, specifially this stylessheet … and this sidebar … I want to work this style, should we work it in figma before code?"; "ok then make a new page and lay it out so it accounts for labs and editor, its designed to account for both."
**Status:** 2026-11-17, evening. Built: the `↳ shell` page (foundations, kit, shell), the rail system in section `rails` (`LeftRail`, `RightRail`, `HomeRail` on one `Rail`), the ten overlay states beside his screenshots with five review fixes, the rails in the `editor` screen, the motion timeline and transport toolbar with screens `editor motion` and `labs morph`. 16.1 the Labs rails built. Decided, not built: W17 the mode track is Editor, Labs, Morph; W18 each overlay a component; W19 ToolDock on Figma's dock, a brighter text test, the one-page Pages section. W20 built 2026-11-18: all six fixes in, measured by script and looked at in `editor`, `labs`, `editor motion`, `labs morph`, States and the Overlays rows (three stale `RightRail` instances replaced). 14.1 built: page `↳ groovebox reference` 149:26341, 38 sheets marked (20 to build, 18 reference for later); checklist `_tmp/2026-11-17-groovebox/reference-sheets.md`. 14.2 first pass built 2026-11-18: design view docked, Surfaces, Controls and Menus filled and marked built (4 built, 16 to build, 18 reference for later), their labelled gaps are the next build list; the Stroke title offset in `editor` fixed. 14.2 second pass built 2026-11-18: the Controls and Menus gaps closed in the components (Dropdown zoom measures, MenuItem icon ink, SplitButton and ToolButton hover, ToolButton menu chevron, arrow and scale glyphs, MenuField, MenuHeading); four Surfaces gaps wait on his call. 14.2 third pass built 2026-11-18: file browser grid, file browser list, design view floating and Modals filled and marked built (8 built, 12 to build, 18 reference for later); new groups File browser, Floating and Modal parts in the rails Components frame; three list-gap calls and the Surfaces gaps wait on his ruling. 14.2 fourth and fifth passes 2026-11-18: group Mobile built, all 12 mobile sheets built, looked at beside his and measured, audit clean (20 built, 0 to build, 18 reference for later). Stopped partway: the audit of every part against his reference sheets (13.5 follow-up). Decided, not built: W14 the page structure is his reference page duplicated and filled with our components, each sheet marked built, to build or reference for later. Parked: 4.3 phone, W5 code.
**Shape:** W › phase › list.
**Laws carried:** the design leads and the code follows; the real Labs and editor are a parts list only, never a layout. Nothing made up, nothing dropped: a real part with no home is listed. His stylesheet `14:12065` and sidebar `17:9160` are not touched; all new work is on a new page (LAW 22). A system, not frames: every named part is a component, shell regions are slots, instances keep their names, every row a LabeledControl, clip on, sizes bound to variables (LAW 1 to 5, 10, 14, 17, 18). Screens are 1440×900, fixed and clipped (LAW 20). No code in this plan. Ruled 2026-11-18: groovebox lists copy his reference, rows touch with no gap (the file list, the modal lists, the mobile lists); LAW 16's row gap does not apply here.
**How a phase closes:** the acceptance line read by script from the file, then the screenshot looked at beside his stylesheet.

## The job in one line
His stylesheet's docked shell, built as a real system on a new page, with one Labs screen and one editor screen on it that differ only in what the slots hold.

## What the stylesheet already rules (file `SgfHBi22F7tYO7GHIorUbv`, read off `14:12065`)

| Thing | Value |
|---|---|
| Shell | top rail 56 high; left rail 236; right rail 300; timeline 128 high; canvas takes the rest |
| Mode track | Editor, Labs, Output, centred in the top rail, 290 × 36 |
| Edges | 0 gutters, 1px shared dividers, square inner corners, 12 radius on the outer shell only |
| Colors | ground #1D2021, panel #282828, canvas #32302F, field #3C3836, border #504945, text #EBDBB2, muted #A89984, accent #FABD2F, on-accent #1D2021, info #83A598, success #B8BB26, error #FB4934, link #8EC07C |
| Type | Inter 16/22 title, 12/17 section, 12/16 label, 11/15 help; JetBrains Mono 10/14 metadata, 12/16 values |
| Spacing | 4, 8, 12, 16, 24, 32; control gap 8, rail inset 16 |
| Radius | 4 fields and buttons, 5 tab tracks, 8 wells, 12 search, 14 modal |
| Controls | 28 high, 1px border, 8 to 12 side padding |
| Resizing | rails fixed first, the canvas flexes; a rail collapses in place, never detaches |

The sheet draws the shell at 1504 × 850; the screens here are 1440 × 900 by its own resizing rule (rails fixed, canvas 904 wide). The sidebar `17:9160` is the reference for how a right rail's rows look, not for its width.

## W1 — The page and its foundations

### 1.1 — New page, variables, text styles — ✅ built 2026-11-17 (page `↳ shell` 19:9247; sections foundations 19:9360, parts 19:9361, shell 19:9362, screens 19:9363; his existing color collection `Groovebox · UI set` reused, not duplicated; new collections space, radius, size; 6 text styles, Inter Medium for title, section and label; his page unchanged at 11879 nodes)
- A new page `↳ shell` in the groovebox file, with sections `foundations`, `parts`, `shell`, `screens`.
- Variable collections from the table above: color (13 roles), space (6), radius (5), size (control 28, top rail 56, left rail 236, right rail 300, timeline 128). Text styles: the 4 Inter and 2 mono steps.
- Acceptance: 13 color, 6 space, 5 radius and 5 size variables exist; 6 text styles exist; 0 nodes changed on his page `groovebox`.

## W2 — The parts

### 2.1 — The parts lists, from the real apps — ✅ built 2026-11-17 (`_tmp/2026-11-17-groovebox/editor-parts.md` 234 entries, `map.md`; editor 226 mapped, 79 not drawn of which 62 are the menu bar, 8 no home; Labs 93 mapped, 8 not drawn, 2 no home; 35 parts shared, the editor's Parameters tab is the Labs panel)
- Labs: reuse `_tmp/2026-11-17-minimal-labs-round-3/parts.md` (95 entries). Editor: read the real editor's regions and controls into the same kind of list, as a file beside it.
- A map: each real part, its home in the shell (top rail, left rail, canvas, right rail, timeline) and the stylesheet part that draws it; parts with no home listed apart.
- Acceptance: both lists exist as files; every entry is on the map or on "no home yet".

### 2.2 — The kit, as components — ✅ built 2026-11-17 (39 components in `parts` 19:9361; audit 0 raw values, 0 `Frame`, 0 detached, 0 renamed; Slider, Toggle, Checkbox and Tooltip are on his sheet and were built; not drawn and left out: menu bar and menus, split button, swatch grid and picker, timeline toolbar and graph, rulers and overlays, Labs nav chevron and edge grab; ExportButton kept apart from Button for his ruling, 32 high and Semi Bold on the sheet)
- Every part the stylesheet draws in sections 02, 03, 05 and 06 and the sidebar `17:9160` shows, built once as a component in `parts`: Button (primary, secondary, ghost; default, hover, focus, disabled, pending), Input, Dropdown, Tabs track, LabeledControl, rail section, list row, tool dock, timeline track and transport, search, modal.
- Looks come from his sheet only; where the sheet has no drawing for a part on the map, it goes on a "not drawn" list for him, never invented.
- Acceptance: 0 raw fills, radii or sizes on any component (all bound to 1.1); 0 layers named `Frame`; every part on the 2.1 map has a component or is on "not drawn".

## W3 — The shell

### 3.1 — One Shell component with slots — ✅ built 2026-11-17 (Shell 36:9581, five slots, booleans left rail, right rail, timeline; TopRail 36:9458, Rail 36:9454, Timeline 36:9495; at 1440×900: 56, 236, 904, 300, 128)
- `Shell`: top rail, left rail, canvas, right rail, timeline as slots, at the stylesheet's sizes, dividers shared, outer radius 12, clip on.
- A rail's collapsed state is the same tree with the body hidden; the canvas takes the width.
- Acceptance: at 1440 × 900 the regions read 56, 236, 904, 300 and 128; 5 slots; 0 gaps between regions; 0 doubled borders.

## W4 — The two screens

### 4.1 — Editor — ✅ built 2026-11-17 (frame `editor` 39:9644; 155 instances, 0 detached, 0 renamed; matches his section 04 drawing; two differences from his drawing fixed with 4.2: rail dividers inset 16, origin picker before its label)
- A 1440 × 900 Shell instance with the mode track on Editor: left rail search, create, layers, history; canvas with the tool dock; right rail the selection's title, tabs and sections; timeline with tracks.
- Acceptance: every editor entry from 2.1 is on the screen or on "no home yet"; 0 parts the real editor lacks; 0 detached instances; 0 layers past a rail's edge.

### 4.2 — Labs — ✅ built 2026-11-17 (frame `labs` 45:10928; same Shell, TopRail, Rail and Timeline components as `editor`; 149 instances, 0 detached, 0 renamed; real Flow values; decided for his review: left rail is search, Labs categories in place of Create, then Layers and Undo / Redo; no tool dock; left off for lack of a drawing: preset steps, roll chips, scope buttons, category chevrons, icons for Effects, Morph and the labs. Open: the left rail's list runs past the fold, so Morph, Vector, Composition and Layers are cut)
- A second Shell instance with the mode track on Labs: left rail the six categories and their labs; right rail the open lab's tabs and sections; timeline the transport and output.
- Acceptance: every Labs entry from 2.1 is on the screen or on "no home yet"; 0 parts the real Labs lacks; the top rail, both rail frames and the timeline frame are the same components as 4.1, with 0 overrides to size or fill.

### 4.3 — Phone: Labs only (P: "where it would disconnect is in mobile it would default to labs") — TALK: his sheet has no phone drawing, so there is nothing to build from yet
- A phone screen, 390 wide, that is Labs alone: no mode track, no editor; the rails collapse in place per the sheet's resizing rule.
- Acceptance: 0 mode track instances on the screen; every part on it is a component from 2.2; 0 layers past the screen's edge.

## W6 — Rails follow his sidebar (P: "why is right rail slot 300? shouldnt they both be the same width?"; "I did also send you [17:9160] which is tighter did you not see that")

Cause: I took the sidebar `17:9160` as a reference for the look of rows only and the rail widths and spacing from the stylesheet's anatomy table (236 and 300). The sidebar is the rail: 240 wide and tighter.

### 6.1 — Both rails 240, rows as tight as the sidebar — ✅ built 2026-11-17 (both rails 240, canvas 960 on both screens; controls two-up at 100 with gap 8, title to body 15, folded section 48, rail title 14/20, dividers full bleed as the sidebar has them; label column 76; Palette row stacked on `labs`; for his review: sidebar dividers are full bleed where his stylesheet insets them 16, and the Input lead letter stays 10/14 against the sidebar's 12/16. Open: `labs` left rail still runs 329 past its body)
- `size/left-rail` and `size/right-rail` become 240; the canvas takes the rest (960 at 1440).
- Everything inside a rail takes the sidebar's measures, read off `17:9160`: section padding, title to body, row gap, control height, label and value type sizes, icon size, divider placement. Done in the components and variables, so `editor` and `labs` both follow.
- Rail content refitted to 240 in both screens, nothing past an edge, nothing wrapped that the sidebar keeps on one line.
- Acceptance: both rails 240 and canvas 960 in both screens; each of the measures above within 1px of `17:9160`; 0 layers past a rail's side edge; 0 raw values; 0 detached or renamed instances; his page unchanged.

## W7 — Left rail, Figma's model (P: "we dont need search because search will be command k, we dont need create because that will be in tooldock and shortcuts"; "we dont need assets to tab in same windo as layers, assets can be in top menubar or its own window"; "building only the left siderail and showing me for approval")

Cause: I filled the left rail from his stylesheet's drawing (search, Create, Layers and Assets tabs). His model is Figma's left rail. References, his frames on the `↳ shell` page: the set 37:13017; collapsed 37:12907; expanded 37:12918; home library 37:12820; layers expanded 37:13018. Mine, to be replaced: 37:12654. The references are in Figma's own greys; the build is in groovebox variables and text styles.

### 7.1 — The left rail, three states, shown for approval — built 2026-11-17, waiting on his approval (section `left rail` 61:11313, frame `left rail states` 62:12147; LeftRail 61:11908 with `collapsed`, HomeRail 62:11574, RailHeader, AccountRow, Avatar; ListRow gained `tree` with a variable indent of 24 per level; collapsed strip 49 wide; row 24 high at a 32 pitch. Gaps: no layer-type icons (section, frame, component, instance, slot), no lock glyph, no Layers heading action; the collapsed strip does not carry the hidden layer rows; rows are 12/17 where his references are 11/16)
- Out of the rail: search, the Create section, the Assets tab. Undo / Redo and the note leave with them unless his references show them.
- In: a header (file name, the line under it, the collapse button); Pages (title, search and plus actions, page rows, one selected); Layers (title, its action, a tree of rows with chevrons and indented children, one selected).
- Collapsed: the same rail as a narrow strip of page icons; same tree, the rest hidden.
- Home library: the rail outside a document: account row and bell, search, the fixed items, a foldable Starred group of folder rows, one selected.
- Built as components in a new section `left rail` on the `↳ shell` page, three rails side by side at 900 high; `editor` and `labs` are not touched until he approves.
- Acceptance: rail 240 wide expanded, the collapsed strip the width of 37:12907; row height, indent step, icon size and section spacing within 1px of his references; 0 search fields in the document rail, 0 Create rows, 0 Assets tabs; 0 raw values, 0 layers named `Frame`, 0 detached or renamed instances; 0 nodes changed in his reference frames.

### 7.2 — Into the screens — replaced by 11.2

## W8 — Editor right rail, his sidebar's model (P: "MY FUCKING REFERENCE is based on figma, where you add effect to a layer, add stroke or fill to a shape, appearance is in appearance etc."; "did we forget the right rail?")

Cause: I filled the right rail with always-open sections of labelled rows (a 76 label column, mixed full-width and two-up rows). His model is Figma's property rail, drawn in his sidebar 37:10811 (the same panel as 17:9160): the rail is a stack of property sections for the selected thing, and a section that holds nothing is a title and a plus until one is added.

When unsure, in this W and the next: the `↳ figma reference` page (65:14608) decides, never me. His references are in Figma's greys; the build is in groovebox variables and text styles.

### 8.1 — The right rail as property sections, shown for approval — built 2026-11-17, waiting on his approval (section `right rail` 70:12099, frame `right rail states` 70:12429: one rail with Stroke, Effects and Export empty, one with a stroke added; new PropertyRow 70:12121 and FillRow 70:12141, RailTitle gained an `actions` slot; every listed measure equals 37:10811; 5 glyphs added from his vectors. Differences for his call: header icons evenly spaced where his are grouped, input icons 16 where his are 14, ratio-lock icon muted where his is accent, swatch radius 3 where his is 2, no stroke-weight glyph)
- Header: the selection's name with its icon actions, as the sidebar's "Selected image" row. No Design / Motion / Effects tab track unless his sidebar shows one for the selection.
- Sections in his sidebar's order and build: Position (two alignment groups, X and Y, rotation, rotate and flip), Layout (W, H, the ratio lock), Appearance (opacity, corner radius, with its eye and blend actions in the title), Fill (one fill row: swatch, value, opacity, eye, minus; style and plus in the title), then Stroke, Effects and Export collapsed to a title and a plus.
- Controls two-up at 100 with the 8 gap, the letter or icon inside the control, small icon actions at the right edge; no label column. A row that needs a third thing takes the sidebar's 88, 88 and a 16 icon.
- A section's two states are one component: empty (title and plus, 48 high) and holding items; an added item is a row with eye and minus.
- Built in a new section `right rail` on the `↳ shell` page as components plus one rail at 900 high; `editor` and `labs` are not touched until he approves.
- Acceptance: rail 240; every section's height, the control widths (100 and 88), the gaps and the title positions within 1px of 37:10811; 0 LabeledControl rows with a label column in the rail; Stroke, Effects and Export each 48 high with a plus; 0 raw values, 0 layers named `Frame`, 0 detached or renamed instances; 0 nodes changed in his frames.

### 8.2 — Into the editor screen — replaced by 11.2

## W11 — Rails as one system, in one frame (P: "why is left rail wrapping 'Rail' as components but right rail just instances? you should work rails as a system. this is INCONSISTENT. exactly how we misalign design and code"; "I want a rail system and I want overlays for them next"; "rail system goes to the same frame")

Cause: each rail was built as its own job in its own section. The left rail got components of its own (`LeftRail`, `HomeRail`) on the `Rail` shell; the right rail is two hand-filled `Rail` instances with no component. Two ways of making a rail is how design and code drift apart. Built before the overlays (W9), which open from these rails.

### 11.1 — One rail family, one frame — ✅ built 2026-11-17 (section `rails` 76:12529 with `rail parts` 61:11314 and `rail states` 62:12147, five instances; RailLayers 61:11908, RailHome 62:11574, RailProperties 76:12530, each one Rail; one RailHeader 61:11315 for layers and properties, AccountRow kept for home; the seven property sections are exposed with their `collapsed` toggle and slots; `left rail` and `right rail` sections gone; looks unchanged; RailTitle still serves the old `editor` and `labs` until 11.2; the hand-filled stroke rail is on page `_trash`)
- One family on the one shell `Rail` (header, body and footer slots): `RailLayers` (today's `LeftRail`: file header, Pages, Layers, with `collapsed`), `RailHome` (today's `HomeRail`) and `RailProperties` (new: the 8.1 right rail as a component, its sections in slots, so a section can be empty or hold items). Every rail is a component made the same way; a screen only ever places one of these three.
- Shared parts are the same components in every rail: the header (`RailHeader` and `RailTitle` become one header part with a leading, a title and an actions slot), `RailSection`, and the rows (`ListRow`, `PropertyRow`, `FillRow`).
- One section `rails` on the `↳ shell` page holds everything: a frame `rail parts` with the family's components, and a frame `rail states` with every rail side by side at 900 high: layers expanded, layers collapsed, home, properties with empty sections, properties with a stroke added. The sections `left rail` and `right rail` empty into it and are removed; nothing is built twice.
- `editor` and `labs` are not touched in this phase.
- Acceptance: 3 rail components, each containing exactly 1 `Rail` instance; 0 `Rail` instances placed directly in `rail states` (5 instances there, all of the 3 components); 1 header component used by all three; 1 section `rails`, 0 sections named `left rail` or `right rail`; every measure of 7.1 and 8.1 unchanged (same tables); 0 raw values, 0 layers named `Frame`, 0 detached or renamed instances; his frames unchanged.

### 11.2 — Into the editor screen — ✅ built 2026-11-17 (`editor` 39:9644 holds one `LeftRail` and one `RightRail`; the rails fill their slot, the rail-height component edit approved by him; old rails on `_trash`)

## W9 — Overlays for the rails: menus and modals (after 11.1; built into the same `rails` section) (P: "my idea was to stop nesting all the effect settings in the rail, and rather, like figma, have them as modals"; "we havent shown any modalmenu overlays")

Cause: every effect and lab setting was stacked inside the rail, and no menu or modal was ever drawn open. In the editor an effect is one row in the rail; choosing it and setting it happen in overlays beside the rail.

References: his three screenshots (the Effects plus menu; the "Shader effects" picker; Halftone selected with its settings); on the `↳ figma reference` page the Menus and Modals sheets 65:18222 (panel radius 13, rows 24 high, highlight inset 8 with radius 5, 1px separators; modal 480 wide, radius 13, backdrop black at 50%) and the column 65:19149 (File menu, Device list, Present bar popover, Play menu, Page theme select, Frame type list, Left tool rail and the modal sheets); his loose placement frame 65:14254 for where overlays open against the rails.

### 9.1 — The overlay parts — built 2026-11-17, waiting on his review (frame `rail overlay parts` 82:19403: MenuGroup, MenuSeparator, Popover 84:12756, PopoverHeader, EffectTile, SliderInput; MenuItem, Menu and FillRow extended in place, the effect row is FillRow; menu rows 24 with 0 gap as the Menus sheet rules; panel radius 14 from his stylesheet where the sheet says 13)
- Menu: the kit's Menu and MenuItem brought to the reference's measures: icon, label, trailing shortcut or submenu chevron or tag, groups with separators, one highlighted row.
- Picker modal: title with plus and close, search, group titles, a two-column grid of preview tiles with names, one selected.
- Effect row for the rail: icon, name, eye, minus; selected while its settings are open.
- Settings modal: title with the effect's icon and a chevron, more and close; rows of label, control and value (dropdown, slider with number, paired X and Y, switch). The label column lives here, not in the rail.
- Acceptance: each part's panel radius, row height, padding, highlight inset and widths within 1px of the reference sheets; 0 raw values; 0 layers named `Frame`; 0 detached or renamed instances.

### 9.2 — Shown open, against their rail (P: "I dont need rails in the editor yet") — built 2026-11-17, waiting on his review (frame `rail overlays` 85:12770: effects menu, effects picker, effect settings, file menu, each 600 × 900; content is groovebox's real names; picker tiles are empty squares, no artwork made up; no glyphs for the ten layer effects, Halftone or more; the pressed plus has no look)
- In the `rails` section, a frame `rail overlays`: each overlay open beside the rail it opens from, no editor screen around it. The add menu dropping from the Effects plus of `RailProperties`; the picker beside it; Halftone as a row in Effects with its settings modal beside the rail; the file menu off the `RailLayers` file name, as 65:14254 places it.
- Acceptance: 4 compositions; in each, the overlay's edge sits against the rail or its trigger as in his screenshots (state the offsets); 0 effect settings inside the rail; 0 detached or renamed instances.

## W12 — The rails made one system for real (P: "why is RailLayers and RailHome with grey background? then 2 RailProperties with no background.. did I not literally say to MAKE A FUCKING SYSTEM"; "do you think Right rail should be called RailProperties? OR FOLLOW THE FUCKING SYSTEM AND be called RightRail"; "just a frame with random components here and there with no rhyme or reaason … why arent components together LABELED AS COMPONENTS")

Cause: 11.1 moved the rails into one section and wrapped the right rail in a component, but did not make them the same thing. The look (panel fill, size, clip) still lives on each rail instead of on the one shell, so two rails came out with no background; I renamed his rails on a naming idea of my own; and the section is whatever landed where it was moved, unlabelled.

### 12.1 — One shell carries the look; his names; a labelled section — built 2026-11-17, waiting on his review (cause found: the `Rail` shell drew nothing, the left and home rails each carried the fill as an override, the right rail none; now the fill, clip, height and width mode sit on the Rail master only, proved by turning the master red and back; `LeftRail`, `RightRail`, `HomeRail`; section `rails` 76:12529 is three titled areas: Components 98:13865 in six labelled groups with a name label over each of the 20 components, States 98:13892, Overlays 98:13910; all five rails sample #282828)
- The panel fill, the edge line, the width and height bindings and the clip sit on the one `Rail` shell and nowhere else. `LeftRail`, `RightRail` and `HomeRail` are that shell with content in its slots and draw nothing of their own, so no rail can differ from another.
- Names: `RailLayers` → `LeftRail`, `RailProperties` → `RightRail`, `RailHome` → `HomeRail`. No other component is renamed.
- The `rails` section is rebuilt as three labelled areas, top to bottom, each with a title and each group inside it with its own label:
  1. Components: the shell (`Rail`); the rails (`LeftRail`, `RightRail`, `HomeRail`); header parts (`RailHeader`, `AccountRow`, `Avatar`); section and rows (`RailSection`, `ListRow`, `PropertyRow`, `FillRow`); overlay parts (`Menu`, `MenuGroup`, `MenuItem`, `MenuSeparator`, `Popover`, `PopoverHeader`, `EffectTile`, `SliderInput`). A component lives in exactly one place.
  2. States: the five rails side by side.
  3. Overlays: the four open examples.
- Components that today sit in `parts` or `shell parts` but belong to the rails (`Rail`, `RailSection`, `ListRow`, `Menu`, `MenuItem`) move here, so the rail system is in one place; the old `RailTitle` stays with the old screens until 11.2.
- Acceptance: the 5 rails in States all show the same background: the fill of each is the `Rail` shell's, bound to the panel color, and 0 of the three rail components carry a fill, stroke, clip or size binding of their own; 3 rail components named `LeftRail`, `RightRail`, `HomeRail` and 0 named `RailLayers`, `RailProperties`, `RailHome`; 3 titled areas, every component in the section inside a labelled group, 0 components or instances loose in the section or outside a group; every component listed above appears exactly once; looks of the layers, home and overlay examples unchanged, the two right rails changed only by gaining the background; 0 raw values, 0 layers named `Frame`, 0 detached or renamed instances; `editor`, `labs` and his frames unchanged.

## W13 — The right rail and its overlays, copied from his screenshots (P: "you need to account for all of these. Pay special attention to the darker menu-list-modal"; "what do you need to get this through your fucing FACE?! how many more rounds do we have to take")

Cause: in W9 I reinterpreted his reference instead of copying it. I swapped in content of my own choosing, dropped parts he had shown (the effect type label under the Effects title, the picker's plus), and drew the menu in the same tone as the panels when his is a darker surface of its own. This W rebuilds from his screenshots one to one: structure, order, parts and proportions as shown, in groovebox colors and type; nothing removed, renamed or added unless he says so.

References, his: the screenshot frame 73:11588 on the `↳ shell` page holds all of them; effect selected 73:11583; the effects menu 73:11595; the effect settings 73:11586; the effects picker 102:11667. Measures the screenshots cannot give come from the `↳ figma reference` page, never from me.

The ten states, each one a checklist line:
1. Shape selected with fill and stroke: the rail with the selection header (name, component, mask, boolean with its chevron, edit), Position, Layout, Appearance (opacity, corner radius, the split-corners button; eye and blend in the title), Fill (row, style and plus in the title), Stroke (color row, then position dropdown, weight, the settings button, the sides button), Effects and Export empty.
2. Corner radius split: the split button lit, a second and third row with the four corner inputs, and the settings button at the right.
3. Blend mode menu: dropped from the blend button, a darker surface, a check on the current row, groups divided by separators (Pass through, Normal; Darken to Color burn; Lighten to Color dodge; Overlay to Hard light; Difference, Exclusion; Hue to Luminosity).
4. Color panel: beside the rail, tabs Custom and Libraries with plus and close; the paint type row; the color field with its handle; eyedropper, hue and opacity sliders; the Hex dropdown with value and opacity; "On this page" dropdown and the swatch grid. The fill or stroke row it belongs to shows lit in the rail.
5. Stroke settings: a panel beside the rail from the settings button, titled, with close; tabs Basic, Dynamic, Brush; Style, Width profile with its flip button, Join (three options), Miter angle.
6. Boolean menu: dropped from the header's chevron, the darker surface, icon, label and shortcut per row (Union, Subtract, Intersect, Exclude, Flatten), one highlighted.
7. Effect selected: Effects with style and plus in its title, the effect type label with its rule ("Shader effects"), then the effect row (icon, name, eye, minus).
8. Effects add menu: dropped from the plus, the darker surface, icon and label per row, separators, tags at the right, a disabled row.
9. Effect settings: the panel beside the rail: icon, name and chevron, more and close; label and control rows (dropdown, slider with number, the paired X and Y, switch); the effect's row lit in the rail.
10. Effects picker (his reference 102:11667, added 2026-11-17; my W9 version is 98:13916): the panel beside the rail, titled, with plus and close; search; the group titles ("Created by you", "In this file", "By Figma"); preview tiles two across with the name under each, images in the tiles, one tile selected with its tinted ground; the list scrolls inside the panel.

### 13.1 — The darker menu surface — built 2026-11-17, waiting on his review (Menu 26:9431 fill menu/surface, overlay mode = color/ground; kit Menu unchanged; Tag 109:13900; menu #1D2021, rail and panels #282828)
- One menu component for every dropped list (blend, boolean, effects add, file, dropdown lists): its own darker fill, the border and shadow of the Menus sheet, radius, row height and insets from that sheet; rows with a leading check or icon, label, trailing shortcut, tag or submenu chevron; highlighted, disabled; separators between groups.
- Acceptance: the menu's fill is darker than the rail's and the panels' (three sampled colors stated, menu the darkest); one Menu component serves all four menus in this W; measures within 1px of the Menus sheet.

### 13.2 — The rail parts his screenshots add — built 2026-11-17, waiting on his review (IconButton 112:14111, SplitButton 112:14112, GroupLabel 112:14121; FillRow outlined, eye, minus, lit; Dropdown outlined; RightRail 76:12530 is state 1)
- The split-corner rows; the stroke row's second line (position, weight, settings, sides); the effect type label with its rule; lit rows (the row whose panel is open); lit icon buttons (split corners, blend, stroke settings, the plus while its menu is open); the header's boolean button with its chevron.
- Acceptance: each part is a component or a property of an existing one, 0 one-off frames; `RightRail` shows state 1 with no overrides beyond slot content.

### 13.3 — The panels — built 2026-11-17, waiting on his review (four panels, each one Popover 84:12756; PanelSection, ColorPicker, ColorField, HueSlider, OpacitySlider, Swatch, SwatchGrid, PaintTypeRow; Tab icon option for Join)
- The color panel, the stroke settings panel, the effect settings panel and the effects picker, each the one `Popover` shell with content in its slots; the color field, hue and opacity sliders and swatch grid as parts.
- Acceptance: 4 panels, each exactly 1 `Popover` instance; 0 raw values, 0 detached or renamed instances.

### 13.4 — Ten states beside ten screenshots — built 2026-11-17, waiting on his review (ten rows in Overlays 98:13910; W9 examples on _trash; remaining differences listed in the report)
- In the `rails` section's Overlays area: each state as a composition next to a copy of his screenshot for it, labelled with the state's name, in the order above. W9's four examples are replaced by these and go to `_trash`.
- I compare each pair myself before he sees them and write down every difference that remains.
- Acceptance: 10 pairs; for each, every part visible in the screenshot is present in the build (a parts count per pair, screenshot against build, equal); 0 parts in a build that its screenshot lacks; the list of remaining differences is written under this phase.

### 13.5 — Five fixes from his review of the ten states (P: "these icon groups need dividers, same color as background, or a gap"; "look how they align to left in figma while you center everything?"; "color border is way too harsh"; "the accent is wayy off … there is the FUCKING RECIPE") — built 2026-11-17, waiting on his review
- IconGroup: each icon in its own cell (`IconGroupCell`), 1px gap showing the panel; all 45 instances.
- Input: letter or glyph at the left, value straight after it, left-aligned; unit part of the value ("100%", "0°"); no centred option; 116 inputs checked.
- Menu edge: no solid outline; the Menus sheet's recipe (two drop shadows, two inset hairlines), radius 13; Popover likewise from the Modals sheet.
- Highlighted menu row: solid accent with on-accent ink, through `menu/highlight` and `menu/highlight-ink`.
- Lit icon buttons: read off his specimen 123:13919 (32, radius 5, #394360, glyph #7cc4f8): `color/accent-tint` (accent at 0.25) with the glyph in accent; rail cell 24 with radius 4. Selected picker tile: `color/accent-tint-soft` (accent at 0.15).
- Still differs: the lit tint reads warmer and darker than Figma's; the effects menu is 167 wide against his 202; the active tab in Stroke settings has accent text where his is white; sliders have no filled run.

## W14 — The page structure: his reference page, duplicated and filled with our components (P: "Look how easy it is to read this, how easy it is to navigate … everything is clearly defined in a way you can both read and look"; "rails? you JUST wanna use it for RAILS??! not just adopt the fucking SYSTEM FOR THE UI we are fuckiing doing here"; "it accounts for everything no by accident, because when i built it i picked these views because they are what we need. so you might as well wholesale duplicate the page and paste into it our components … im not stressed about the table or description bein gaccurate, I care about us ticking the right boxes"; "alot we dont have and them we have to build or leave as reference for later")

Rewritten 2026-11-17 on his rulings; nothing built. Was parked as "we will organise later"; this is that organising.

Cause: I used his `↳ figma reference` page 65:14608 as a source of numbers and never as the model for the work's structure. That page is the list of views the product needs, chosen by him on purpose: Desktop views (file browser grid 65:14760, file browser list 65:15132, design view docked 65:15487, design view floating 65:15741), Breakpoints, Mobile views, Desktop atoms, Menus and modals, Mobile parts and comparison, Contents, Captures matched. I do not design a structure of my own: his page is duplicated whole and our components go into the copy.

### 14.1 — Duplicate the page — ✅ built 2026-11-17 (page 149:26341; 38 sheets in 8 sections, same as his; `SheetMark` 149:38774 on every sheet; his page unchanged)
- `↳ figma reference` is duplicated as a new page (named for groovebox; his original is not touched). Every sheet arrives as it is: header, specimen, table, footer.
- Acceptance: the copy has the same sections and the same number of sheets as his page; his page's node count is unchanged.

### 14.2 — Our components into the copy, sheet by sheet; every sheet marked
- On each sheet the Figma specimen is replaced by the same view or part built from our groovebox components, where we have them. Tables and descriptions may stay rough: what counts is that the right boxes get ticked, not that the notes are exact.
- Every sheet carries one of three marks, readable at a glance:
  - built: our components are in it;
  - to build: we need it and do not have it yet;
  - reference for later: Figma's specimen stays in place, untouched.
- The components themselves keep living once, in their home; a sheet holds instances.
- What exists today goes in first: the editor and Labs screens into the design view sheets, the rails, the controls, the menus and panels, the timeline, the tool dock. His answer 2026-11-17 on what is restyled now beyond the design view: file browser grid, file browser list, design view floating, mobile views. Everything else on the page stays Figma's capture, marked reference for later.
- Acceptance: every sheet in the copy has exactly one mark; a count of sheets per mark is written under this phase; every "built" sheet holds only instances of our components in its specimen (0 Figma captures left in it); every "reference for later" sheet is pixel-identical to his original; 0 detached or renamed instances.
- First pass built 2026-11-18 (what exists today): design view docked (one `Shell` instance cloned from `editor` 39:9645), Surfaces (10 `Swatch` instances bound to groovebox variables, 4 labelled gaps: accent hover, text disabled, backdrop, disabled button), Controls (23 kit instances, 3 labelled gaps: SplitButton hover, ToolButton hover and menu chevron, segmented arrow glyphs), Menus (3 `Menu` instances: file, right-click, toolbar tool; 3 labelled gaps: Scale glyph, zoom menu field row, select list heading row). Each sheet's SheetMark is built; 0 renamed, 0 unlinked; his page 8557 nodes before and after; captures on `_trash` in `_14.2 captures (2026-11-18)` 168:35313. Marks now: 4 built, 16 to build, 18 reference for later.
- Second pass built 2026-11-18 (the Controls and Menus gaps closed in the components on `↳ shell`): Dropdown unbordered variants padding 4 4 4 12 and gap 4 (his zoom), the zoom instance 57 wide showing 82% whole; MenuItem leading icon ink per state (default and disabled color/muted, hover menu/highlight-ink); SplitButton set 177:20206 `hover` true/false; ToolButton 28:9325 `state` default/hover/active (hover color/field, his 56,56,56) and boolean `menu` (chevron 12 bound size/chevron, overlap -3); glyphs arrow-down 177:20190, arrow-right 177:20192, scale 177:20194 redrawn from his vectors; new MenuField 178:20019 and MenuHeading 178:20027 in the Menu family. Controls and Menus sheets now hold every one of his specimens as our instances (zoom menu and select list built on Menu). Left as labelled gaps for his call: accent hover, text disabled, backdrop, disabled button (Surfaces). Audit 0 errors; editor rails unchanged.
- Third pass built 2026-11-18 (file browser grid 149:26343, file browser list 149:26561, design view floating 149:27037, Modals 149:29102; each SheetMark built, captures on `_trash` in 168:35313 with `_` prefix, his page 8557 nodes before and after). New on `↳ shell`, rails Components 98:13865: group File browser 189:21362 (`Browser` 189:21033 with slots sidebar and main, `BrowserTopBar` 188:20912, `BrowserTitleRow` 188:20946, `FileGrid` 188:20554, `FileCard` 188:20541, `FileList` 188:20689, `FileListHeader` 188:20663, `FileListRow` 188:20675), group Floating 189:21390 (`FilePill` 188:20988), group Modal parts 189:21397 (`Link` 188:20997, `ModalSearch` 189:20892, `ModalTabs` 189:20895, `ModalFolderList` 189:20925, `ModalFolderRow` 189:20917, `ModalInviteRow` 189:20974, `ModalAccess` 189:20994, `ModalAccessRow` 189:20985). Changed: HomeRail right edge color/border and his search (fill color/field, radius 8, padding 4, gap 8); Button boolean `menu` (chevron 12) and clip on; Shell boolean `top rail`; RightRail `floating` true/false (radius/float 13, shadow/float, 876 high); IconButton icon fills the button (row/icon mode icon 24 gives his 24 icons); glyphs star, adjust-sliders, view-list, pen-tool, user from his vectors; 29 variables (space, size, radius) and effect style shadow/float. Sheets: grid and list are one `Browser` instance each (list swaps FileGrid for FileList and lights the list tab); floating is one `Shell` (top rail, rails, timeline off) with FilePill, RightRail floating and ToolDock in the canvas slot; Modals are two `Popover` instances 480 wide with the modal parts in the body slot. Open for his ruling: his lists have 0 gap between rows (FileList, ModalFolderList, ModalAccess), LAW 16 wants a gap; the floating toolbar stays ToolDock until W19; the search icon in HomeRail stays 16 (his 18, the override will not take on a slot instance four levels deep).
- Fourth pass 2026-11-18, stopped by the Figma MCP call limit before the last five sheets. New on `↳ shell`, rails Components 98:13865: group Mobile 200:21313 with `MobileScreen` 200:21457 (428 × 926, clip, body slot, `tab bar` boolean, status bar and exposed `MobileTabBar`), `MobileStatusBar`, `MobileTab`, `MobileTabBar` (tab recents/search/activity/mirror), `MobileLargeTitle`, `IconButtonMobile` (sizes as modes of the `mobile button` collection), `ButtonMobile`, `MobileThumbnail` (folder true/false), `MobileFileRow`, `MobileFileCard` (meta true/false), `MobileSectionHeader` (large true/false), `SearchFieldMobile`, `MobileFilter`, `MobileDivider`, `MobileNotification`, `MobileProfileRow`, `MobilePlanRow`, `MobileSettingsRow`, `MobileNavBar`, `TooltipMobile`, `MobileEmptyState` (compact true/false), `MobileAnnouncementCard`, `MobileTitlePill`, `MobileActionsPill`, `MenuMobile` (items slot), `MenuItemMobile`, `MenuSeparatorMobile`, `MenuPagePicker`, `MenuPageRow`, `RailGrabber`, `BottomRail` 202:21554 (one `Rail` instance, Comments title and empty state in its slots), `MobileDim`, `MobileCanvasContent`, `MobileIllustration`, `MobileCaption`. Glyphs chevron-left, chevron-right, globe, cursor-click, message, mobile, link, share, eye-off, star-solid from his vectors. `Avatar` now sized by the `avatar` collection (rail 24, header 32, profile 40, plan 41) with a `letter` boolean. 15 `mobile/*` text styles, `color/dim`, size, space and radius variables. Input fix: `type=text` value text is `inter/value` (Inter Regular 12/16, his fields are Inter Regular), number and color fields stay mono.
- Sheets built and marked: Log in, Recents with the Got it card, Recents empty, Recents list, Search, Activity, Mirror; each one `MobileScreen` instance with his capture images as fills (illustration, card image, thumbnails, avatar), both columns on `_trash` in 168:35313 with `_` prefix. Still to build: Settings, File view, File view with menu, Comments sheet, Page picker (`_tmp/2026-11-18-sheets/14.2-p4-resume-call.js`). Open for his ruling: the menu rows have 0 gap (MenuMobile), LAW 16 wants a gap; the other mobile lists have his gaps (16, 31, 34).
- Fifth pass built 2026-11-18: Settings 213:19888, File view 213:20007, File view with menu 213:20071, Comments sheet 213:20168 and Page picker 213:20263 built from the saved call, each SheetMark built, captures on `_trash` in 168:35313. All twelve mobile screens looked at beside his drawn column (`_tmp/2026-11-18-sheets/14.2-p5-<name>-built.png`). Fixed: the four file views' ground `color/canvas` → `color/ground` (his #1e1e1e); `MobileEmptyState` icon-to-text space moved from the text frame's top padding to the set's gap (space/15, space/22), so the Comments empty text sits at his 451 instead of 466; Recents list avatar `color/error` → `color/border` (his olive). Changed before the stop on icon work: the `search` glyph redrawn as a 1.25 stroke in the 11 box like clock and bell (one fill override moved to stroke), and the four back chevrons inked `color/text`. Measures: every part within 1px of his frames except text frames that hug where his are fixed (Log in caption 337 vs 350, Link 155 vs 350, empty states 212/247 vs 300 wide and 161/154 vs 155/149 high), with the drawn text on the same lines. Audit: 0 renamed, 0 missing, 0 `Frame`, 0 empty frames, 0 raw fill, stroke, padding, gap or radius in the 35 Mobile components; 12 screens 428 × 926, clipped, slot children all instances; his page 8557 nodes. Open: one 400 × 390 canvas crop stands in for the canvas in all four file views and shows its edge on `color/ground`; accent for his blue and the avatar colors are mapped guesses for his call. Marks now: 20 built, 0 to build, 18 reference for later.

## W15 — The motion timeline, an overlay (P: "lets just make motion overlay ? like figma does"; "labs should have timeline switched off with transport toolbar 'on' then in morph it gets switched on. but labs dont need it by default"; "but you didnt make the timeline overlay, it pushes the layout, the content moves up. I dont care if it does in figma but in code you have to follow my FUCKING INSTRUCTIONS")

Reference: Figma's own Motion mode, captured from his Chrome 2026-11-17, in `_tmp/2026-11-17-groovebox/figma-motion/` (the file had none). Its look is copied; its behaviour is not: Figma docks the panel and shortens the rails and canvas. His rule, for Figma and for code: the timeline is an OVERLAY. It floats over the bottom of the window; the rails and the canvas keep their full height and nothing under it moves.

### 15.1 — The timeline panel and the switches — built 2026-11-17
- `MotionTimeline` 141:17606: header (play, add keyframe, time field, loop, ruler to 12s, panel toggle) and body (left column, lanes), 200 high. Shell switches `timeline` and `transport toolbar`, both true/false.
- Screens: `editor` (timeline off), `editor motion` 142:18499 (timeline on, Obstacle flow track), `labs` (timeline off, transport toolbar on), `labs morph` 142:18697 (timeline on, toolbar off).
- Differs from the capture: the time field is two 28-high cells where Figma's is one joined 22-high box; the playhead is accent where Figma's is a faint grey line; no hairline under the tick strip. The toolbar has no stop (no glyph).

### 15.2 — Make it float — to build
- Cause: I told the agent the rails and canvas end at the panel's top, which is Figma's docking. In the Shell the timeline leaves the layout flow and sits on top of it, at the bottom, full width.
- Acceptance: in `editor motion` and `labs morph` the left rail, canvas and right rail measure the same as in `editor` and `labs` (rails 240 × 844 at y 56, canvas 960 × 844); the tool dock's position is identical with the timeline on and off; the panel covers the bottom 200 and is above the rails and canvas in layer order; 0 regions resized by the `timeline` switch.

## W16 — The Labs rails (P: "do we need search? since search is already on command k?"; the footer; "there are 2 sliders … they should be same componnet with variants?"; "lets just decide labs rails left and right, do they get components?")

Talked through 2026-11-17; nothing built.

### 16.1 — The Labs rails as variants of the two rails — ✅ built 2026-11-17, for his review (LeftRail 61:11908 `variant` editor / labs; RightRail set 147:21543; Slider 54:10822 `variant` plain / field, SliderInput on `_trash`; `labs` and `labs morph` on the new rails, old ones on `_trash`; States has seven rails, all #282828. In `labs morph` the docked timeline cuts the right rail's randomise buttons until 15.2)
- `LeftRail` and `RightRail` each get a `variant`: editor and labs. One component per side, named for its side, on the one `Rail` shell, so the Labs rails cannot drift from the editor's.
- `LeftRail` labs: the lab picker alone: the six categories with their labs. Out: the search ("WORKSPACE", the field; search is Command K) and the footer (Undo, Redo, the "EDITABLE. ALWAYS." note). The Layers / Assets block is out too (his ruling 2026-11-17: "yes drop layers assets block from labs left rail").
- `RightRail` labs: the lab's settings (title, the Generate / Style / Animation tabs, the settings rows), today's content of the old Labs rail, rebuilt on the shell.
- `Slider` and `SliderInput` become one `Slider` with a `variant`: plain (bare track, value beside it) and field (track in a field with a number box), same track and thumb.
- The randomise buttons (Type, Category, Preset, Settings) stay as they are for now: "lets not get fixed on that now".
- Acceptance: 2 rail components each with `variant` editor and labs, each variant exactly 1 `Rail`; `labs` and `labs morph` hold one `LeftRail` and one `RightRail` with variant labs; 0 SearchField, 0 Undo / Redo, 0 note in the Labs left rail; 1 Slider component, 0 SliderInput; 0 detached or renamed instances.

## W17 — The mode track: Editor, Labs, Morph (P: "shouldnt one of these be morph? and randomiser, and do we need output, with export button on the right?"; "randomiser is mainly just a mobile variant, a simplified labs. not sure if its a whole chrome, since we can access randomiser in labs rail. so lets not put randomiser there")

Decided 2026-11-17; nothing built.

### 17.1 — Three modes on the track — to build on his go
- The top rail's mode track reads Editor, Labs, Morph.
- Output leaves the track: Export and Preview already sit at the right of the top rail, and the output window is opened, not worked in.
- Randomiser is not a mode: it is a simplified Labs, mainly for mobile, and is reached from the Labs rail.
- Morph is its own mode: the screen `labs morph` becomes the Morph mode's screen, with Morph lit on the track. Morph leaves the Labs picker's category list (his answer 2026-11-17): the picker lists Color, Effects, Generative, Vector, Composition.
- Acceptance: the track in every screen has exactly 3 tabs with the labels Editor, Labs, Morph in that order; 0 tabs labelled Output or Randomiser; `editor` and `editor motion` have Editor lit, `labs` has Labs lit, the Morph screen has Morph lit; the track is the same Tabs component in all screens, 0 detached or renamed instances.

## W18 — Each overlay a component (P: "should the modals … be on toggle on the component?"; "but it doesn exist yet?")

Decided 2026-11-17; nothing built.

Cause: only the generic shells exist, `Menu` and `Popover`. Every actual overlay in the ten builds is one of those shells filled by hand and left loose in a build frame (his example: the boolean menu in 119:15176 is a `Menu` instance with five rows typed in). The rails are components built on `Rail`; the overlays were never given the same treatment.

Ruling on the toggle: an overlay is NOT a toggle inside the rail or its trigger. The rail clips its content, so an overlay living inside it is cut at the rail's edge; and in code an overlay is drawn in a layer above the page and anchored to its trigger. What the trigger carries as a toggle is its own lit state while its overlay is open, which exists.

### 18.1 — The overlays as components — to build on his go
- Menus, each exactly one `Menu` with its rows: `MenuBoolean`, `MenuBlendMode`, `MenuEffects`, `MenuFile`.
- Panels, each exactly one `Popover` with its content: `PopoverColor`, `PopoverStroke`, `PopoverEffect` (the effect's settings), `PopoverEffects` (the picker).
- They live in the `rails` section's Components area in labelled groups ("Menus", "Panels"), each in its spec frame under its name, like every other component.
- The ten builds place these components above the rail in place of the hand-filled copies; the looks do not change.
- Acceptance: 8 components with those names, each containing exactly 1 `Menu` or 1 `Popover` and drawing nothing of its own; in the ten builds, 0 `Menu` or `Popover` instances placed directly (every overlay is an instance of one of the 8); each build pixel-identical to before; 0 overlays inside a rail's layer tree; 0 detached or renamed instances, 0 raw values.

## W19 — ToolDock, text color, the one-page Pages section (P: "ToolDock needs work here are a bunch"; "I feel like we could work it more like [125:27095]"; "I also feel like we could test a text color that is a little brighter ?"; "if there is only 1 page the the pages panel should look like any other panel without custom settings")

Talked through 2026-11-17; nothing built.

### 19.1 — ToolDock on Figma's dock — to build on his go
- Reference: his collection of docks 125:27253 (ours are the two at the bottom) and the one to follow, Figma's, 125:27095.
- Ours is small, hard-outlined and tight. Rebuilt on his reference: 32 cells, the soft shadow and hairline edge in place of the outline, the active tool a rounded accent cell, a chevron on a tool that has variants, a second group in its own inset well after a divider.
- The transport toolbar is the same shell, so it follows.
- Acceptance: cell size, dock height, padding, gap, radius, divider and the inset well's measures within 1px of 125:27095 (a table: measure, reference, built); 0 solid outline on the dock; one ToolDock component serves the tool dock and the transport toolbar; 0 raw values.

### 19.2 — A brighter text color, as a test — to build on his go
- Not argued in prose: shown. One rail and one menu side by side, in today's text color (#EBDBB2) and one step brighter (Gruvbox's lightest, #FBF1C7), the muted color lifted in step, each labelled with its values. A variable mode, so nothing in the components changes until he picks.
- Acceptance: 2 labelled specimens differing only in the text and muted colors; the test lives in a mode of the color collection, 0 components edited.

### 19.3 — Pages with one page — to build on his go
- With a single page the Pages section is a plain section like Effects: the title and a plus, collapsed, no search icon, no list. The list and the search appear from the second page.
- Acceptance: `LeftRail` with one page shows Pages 48 high with exactly a title and a plus; with two or more pages it shows the list; the same RailSection as every other section, 0 parts special to Pages in the one-page state.

## W20 — The known bugs, first (his answer 2026-11-17 to "what do I build first": bugs first, then the page)

Six faults, each written up under "Left for later" and 15.2; fixed in the components so every rail and screen follows. Building.

### 20.1 — Six fixes — ✅ built 2026-11-17 and 2026-11-18, measured and looked at 2026-11-18
- 2026-11-17: equal cells (`PropertyRow` is a two-column grid with slots `first` and `second`); Input left padding 8; the copied stroke second line; the timeline floats. ColorPicker's Hex row is its own frame since it is not an equal-halves row.
- 2026-11-18, selected row width: cause was `LeftRail`'s RailSection padding, right 6 on Pages and 0 on Layers against left 10; right now binds the same variable as left in both `LeftRail` variants and in the screen rails' own slot content (`editor`, `editor motion`). Every selected row in every rail measures equal insets (10/10, HomeRail 12/12, RightRail 8/8); 0 rows cut by a rail edge.
- 2026-11-18, Layers tree: ten `layer-*` glyphs in `Icon` 24:9344 (autolayout, image, instance, slot, absolute, text, section drawn off his capture 144:32635; frame, component, rectangle copied from the set's `tool-frame`, `create-component`, `rectangle`); `ListRow` tree lead is 30×16 (bound `size/tree-lead`, `row/icon`) with the chevrons absolute at its left and the type icon held at its right, so the icon column never moves; every Layers row in `LeftRail` editor shows its type icon (17 rows, 17 icons). Measured against his capture: chevron to icon 16 (capture 16.25), icon to name 16 (16), indent step 24 (24), row pitch 32 (32). Pages and the Labs picker keep their label column (label 38 after the row padding everywhere).
- 2026-11-18, the check: 83 two-cell rows in `rails`, 6 each in `editor` and `editor motion`; rows without a trailing button read 100, 8, 100, rows with one read 88, 8, 88 and the Stroke line 76, 8, 76, as his sheet 37:10811 draws them; 0 empty cells, 0 overflow; every Input left padding 8. Found broken: three `RightRail` instances (States, Overlays rows 1 and 6) held a stale layout from before the grid change, second-cell content shifted 45 to 60 and cut at the rail edge; replaced by fresh instances of 76:12530 (they had no overrides), the old ones on `_trash`. Nothing else changed that was not meant to.
- Uneven cells: `PropertyRow`'s two cells fill equally (100 and 100, gap 8) in every row.
- Input left padding 8.
- Selected row width: the same left and right inset for a selected row in Pages and in Layers; nothing cut by the rail's edge.
- The stroke section's second line: the copied row (outlined position dropdown, weight with glyph, settings button, sides button) in `editor`, `editor motion` and the States rail.
- Layers: a type icon on every row; chevron, icon and name packed as in his capture 144:32635; the indent step from the capture.
- The timeline floats (15.2): rails and canvas keep their full height with it open; nothing moves.
- Acceptance: each fix's own acceptance line as written where it was first recorded; plus `editor`, `editor motion`, `labs`, `labs morph` and the States row looked at after, and the list of anything that changed that was not meant to.

## Left for later (2026-11-17)

Things seen and set aside, in the order they came up. None is being built.

- **Layer rows against his older rail** (144:32321 beside the new one). The new rows use Figma's tree measures: a wide chevron column, 24 indent per level, the eye on hover only. His older rows sit 16 in from both edges with the icon right before the name and an eye on every row. He has not ruled which ("im not saying that neccessarily").
- **The timeline must float** (15.2): it pushes the layout today.
- **The randomise buttons** in the Labs right rail: no title, no icons, two icon buttons and the Color / Motion row missing ("lets not get fixed on that now").
- **The audit of every part against his reference sheets**: stopped partway on his word; `_tmp/2026-11-17-groovebox/reference-measures.md` and `reference-audit.md` may be incomplete; the menu row's 4 gap may or may not be in.
- **Small differences already reported**: the lit tint is warmer than Figma's; the effects menu is 167 wide against his 202; the active tab in Stroke settings has accent text where his is white; sliders have no filled run; the time field in the timeline is two cells where Figma's is one; no stop glyph.

## W5 — Code — PARKED: after he accepts the two screens; its own plan

## Order
1.1 → 2.1 → 2.2 → 3.1 → 4.1 → 4.2, then W6, 7.1, 8.1, 11.1, 9.1, 9.2; W10 after his approval. One Figma agent in the background, one phase at a time; I look at each result before the next starts.
