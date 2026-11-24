# Plan — kolbox: the groovebox style in code, Editor, Labs and Morph

**Raised:** 2026-11-17, him. Points verbatim: "since figma has told us 'limit hit' lets build with the style?"; "not groovebox, apps/coalbox or kolbox" (ruled: kolbox); "I know its not finished, but since figma has shut us out we have to use the time for something else, so you can set up the styles, colors and that, then we just fix and align when we get back in figma?"; "and editor labs and morph right?"
**Status:** 2026-11-17, night. Built and looked at: W1 to W4 (`pnpm kolbox`, port 5219; `#/labs`, `#/editor`, `#/morph`, and the kit on `#/dev/controls`, `#/dev/overlays`, `#/dev/timeline`). 7.1 built: kolbox is the fifth column on `apps/style` (`pnpm style`), 25 of 29 parts, 8 new rows. Open: W5 his call; W6 the align pass when Figma opens, which now also lists everything built on a guess.
**Shape:** W › phase › list.
**Laws carried:** the design leads and the code follows: the values are the ones written in `plan-2026-11-17-groovebox-labs-editor.md` (the Figma plan, still active, not touched by this one), never new ones. The real Labs and editor are a parts list, never a layout. The style is local to `apps/kolbox`, nothing goes into a package or kol-theme. His names stay: `Rail`, `LeftRail`, `RightRail`, `HomeRail`, `variant` for every variant, family word first (`MenuBoolean`, `PopoverColor`). One shell carries the look. Tailwind first, CSS only where Tailwind cannot say it. It is a Rail, never a panel or drawer. The timeline is an overlay and never pushes the layout. Anything guessed because Figma is closed is written in W6, never passed off as his design.
**How a phase closes:** the acceptance line read by a Playwright script from the running page, then the screenshot looked at beside his captures in `_tmp/2026-11-17-groovebox/`; motion on a recording.

## The job in one line
`apps/kolbox`: the groovebox shell, rails and overlays as local React on the real engine, with three modes on the track, Editor, Labs and Morph, built from the values already written down while Figma is closed.

## Sources (all on disk, no Figma needed)

| What | Where |
|---|---|
| Colors, type, spacing, radius, sizes | the Figma plan's table "What the stylesheet already rules", with W6 (rails 240), 13.1 and 13.5 (menu surface, tints) |
| The parts and their homes | `_tmp/2026-11-17-groovebox/map.md`, `editor-parts.md`; Labs parts in `_tmp/2026-11-17-minimal-labs-round-3/parts.md` |
| The ten overlay states | the Figma plan W13, his screenshots as described there |
| Figma's Motion mode | `_tmp/2026-11-17-groovebox/figma-motion/` |
| How an app takes the real engine | `apps/minimal` (`vite.config.js` aliases, `src/labs/engine.js`, `src/editor/engine.js`) |

## W1 — The app and its foundations

### 1.1 — `apps/kolbox`, wired like `apps/minimal` — ✅ built 2026-11-17
- A private Vite workspace, port 5219, `server.host: true`, the root `public/`, the design-editor source aliases copied from `apps/minimal/vite.config.js`.
- Routes `#/editor`, `#/labs`, `#/morph`; the app opens on `#/labs`.
- Registered where `docs/operations/07-apps-tier/01-tier-rules.md` asks an app to be.
- Acceptance: `pnpm --filter kolbox dev` serves on 5219; the three routes each return a page with 0 console errors.

### 1.2 — The tokens — ✅ built 2026-11-17
- In the app's `index.css` as a Tailwind theme: 13 colors (ground #1D2021, panel #282828, canvas #32302F, field #3C3836, border #504945, text #EBDBB2, muted #A89984, accent #FABD2F, on-accent #1D2021, info #83A598, success #B8BB26, error #FB4934, link #8EC07C), plus menu surface (ground), accent tint (accent at 0.25) and accent tint soft (accent at 0.15).
- Space 4, 8, 12, 16, 24, 32. Radius 4, 5, 8, 12, 14. Sizes: control 28, top rail 56, rail 240, timeline 200.
- Type: Inter 16/22 title, 12/17 section, 12/16 label, 11/15 help, Medium for title, section and label; JetBrains Mono 10/14 metadata, 12/16 values.
- Acceptance: a script reads the computed custom properties and finds all 16 colors, 6 space, 5 radius, 4 size and 6 type steps with those values; 0 hex colors in any `.jsx` file in the app.

## W2 — The kit

### 2.1 — Controls — ✅ built 2026-11-17
- `Button` (primary, secondary, ghost), `Input` (letter or glyph at the left, padding 8, value left-aligned, unit in the value), `Dropdown`, `Tabs`, `Slider` (`variant` plain, field), `Toggle`, `Checkbox`, `Tooltip`, `IconButton` (lit state), `SplitButton`, `IconGroup` with cells and a 1px gap.
- Acceptance: every control 28 high with radius 4; Input left padding 8; lit IconButton background is the accent tint token; 0 raw values.

### 2.2 — The rail system — ✅ built 2026-11-17
- `Rail` is the one shell: it alone carries the panel fill, the edge line, the 240 width and the clip. `LeftRail` and `RightRail` (each `variant` editor, labs) and `HomeRail` are that shell with content in its slots.
- Parts: `RailHeader`, `RailSection` (empty is a title and a plus, 48 high), `ListRow` (with `tree`), `PropertyRow` (a two-column grid, cells 100 and 100, gap 8), `FillRow`.
- Acceptance: all three rails measure 240 wide and share one computed background (#282828); only `Rail` sets a background, border or overflow (0 in the three rail files); every two-cell row measures 100, 8, 100; an empty section measures 48.

### 2.3 — Overlays — ✅ built 2026-11-17
- `Menu` on the darker surface (rows 24, radius 13, highlighted row solid accent with on-accent ink, check, shortcut, tag, separator, disabled) and `Popover` (radius 14), drawn in a layer above the page and anchored to their trigger, never inside a rail.
- Each real overlay is its own component on one of those two: `MenuBoolean`, `MenuBlendMode`, `MenuEffects`, `MenuFile`, `PopoverColor`, `PopoverStroke`, `PopoverEffect`, `PopoverEffects`. Color parts: `ColorField`, `HueSlider`, `OpacitySlider`, `SwatchGrid`.
- The trigger is lit while its overlay is open.
- Acceptance: 8 overlay components, each rendering exactly 1 `Menu` or 1 `Popover`; an open overlay's DOM parent is outside every rail (0 overlays inside a rail's subtree); menu background #1D2021 against the rail's #282828; menu row 24 high.

## W3 — The shell

### 3.1 — `Shell` with slots — ✅ built 2026-11-17
- Slots: top rail, left rail, canvas, right rail; switches `timeline` and `transport toolbar`. 0 gutters, 1px shared dividers, radius 12 on the outer shell only. Rails fixed, the canvas flexes.
- The mode track in the top rail reads Editor, Labs, Morph and switches the route; Export and Preview sit at the right.
- Acceptance: at 1440 × 900 the regions read top rail 56, left rail 240, canvas 960, right rail 240; the track has exactly 3 tabs with those labels in that order, 0 labelled Output or Randomiser; the lit tab matches the route on all three routes.

### 3.2 — `MotionTimeline`, floating — ✅ built 2026-11-17
- The panel from the motion captures, 200 high, over the bottom of the window. `ToolDock` and the transport toolbar are one shell.
- Acceptance: with `timeline` on and off, both rails measure 240 × 844 at y 56 and the canvas 960 × 844; the tool dock's position is identical in both; closed on a recording of the switch, watched.

## W4 — The three screens, on the real engine

### 4.1 — Labs — ✅ built 2026-11-17
- `LeftRail` labs: the lab picker alone, categories Color, Effects, Generative, Vector, Composition (Morph is its own mode). No search, no Undo / Redo, no Layers / Assets block.
- `RightRail` labs: the open lab's title, the Generate, Style and Animation tabs and its real settings rows. Canvas: the real generator, Flow by default. Timeline off, transport toolbar on.
- Acceptance: every Labs entry on the map is on the screen or listed under W6; picking each lab in the picker renders it on the canvas with 0 console errors; changing a slider changes the canvas (two screenshots differ); 0 search fields in the left rail.

### 4.2 — Editor — ✅ built 2026-11-17
- `LeftRail` editor: file header, Pages (one page is a plain section, a title and a plus, 48 high), Layers tree. `RightRail` editor: the selection header, then Position, Layout, Appearance, Fill, Stroke, Effects, Export as property sections; Stroke, Effects and Export empty until something is added.
- The canvas is the real editor engine with the tool dock; the ten overlay states of the Figma plan's W13 open from their triggers. Effect settings live in `PopoverEffect`, never in the rail.
- Acceptance: selecting a layer fills the right rail with its real values; editing X in the rail moves the layer on the canvas; each of the 10 states can be opened by a script and its parts counted against the W13 list (equal); 0 effect settings inside the rail.

### 4.3 — Morph — ✅ built 2026-11-17
- Its own screen with Morph lit: the real morph (the engine's `useMorph`, as `apps/minimal` Labs uses it), the timeline on, the transport toolbar off.
- Acceptance: `#/morph` runs a morph between two shapes with 0 console errors; the timeline is visible and the rails keep 844; closed on a recording of the morph playing.

## W5 — The engine seams — TALK
- `apps/minimal/src/editor/engine.js` reaches into the editor's source because the package has no host exports. kolbox copies that seam for now. Whether design-editor gets real host exports is his call and touches the fxr mirror rule, so nothing is decided here.

## W6 — Align with Figma — PARKED: Figma is refusing edits and reads
Built from my reading while it is closed, each to be checked against the file when it opens:
- The selected row's width in `LeftRail` (same inset left and right, nothing cut).
- The Layers tree: type icons, chevron to icon and icon to name gaps, the indent step (his capture 144:32635).
- `ToolDock` on Figma's dock (125:27095): 32 cells, soft shadow, no outline.
- The parts the map marks "not drawn": the menu bar and its menus, rulers, the Labs randomise buttons, preset steps, roll chips, scope buttons.
- The small differences already listed in the Figma plan under "Left for later".
- Guessed in the build, 2026-11-17: the Slider's filled run and 12 thumb; Toggle 28 × 16; Checkbox 16; the Tabs' current fill; the rail header at 48 with 12/17 type where Figma has 14/20; the mode track at 28 high where Figma has 36; the menu and popover edge shadows' numbers; popover width 240; every row of the effects add menu and of each blend group; the dock's padding, gap, radii and fill (panel, darker than the canvas, where Figma's dock is lighter); the timeline's playhead handle, keyframe diamonds and 2 s ticks; the seed shapes in the editor; the icons picked for style, weight, sides, stroke settings and split corners.
- Not built, for lack of a drawing or a modal: the corner split's settings button; the images in the effects picker's tiles; the File menu's flyouts (Starters, Aspect, Library); Morph's add step, edit step, reorder and Save; the Kinetic type composer in Labs; most of the editor's menu bar and its windows (Batch export, Color Modes, Shortcuts, Settings, Layer Effects).
- Local state only, no engine behind it: stroke position, sides, style and width profile; the six plain effects (Drop shadow to Glass); the effect settings popover's rows; blend modes beyond the engine's six; pages.
- The editor's canvas ground is the engine's own near-black, not the canvas color (#32302F) that Labs and Morph sit on.
- `Dropdown` still opens the browser's own list, not `Menu`.
- Decimals read with a comma ("0,08") in the Labs sliders; the unit sits in the value ("0 s", "0 ms") where Figma shows a bare number.
- Every measure in W2 to W4, once more against the Figma components, in one pass; code changes to match the file, never the file to match code.

## W7 — kolbox on the styles board (P: "and after we add it to apps/style")

### 7.1 — A fifth style in `apps/style` — ✅ built 2026-11-17 (25 of 29 parts; gaps: number input, modal, find bar, language toggle; new rows: split button, icon group, fill row, color picker, color popover, property row, transport, timeline; with five columns some older cells crop at a 1600 window: minimal's Section, float's Field row and Property row; the board keeps a copy of three kolbox CSS rules)
- After the three screens. `STYLES` in `apps/style/src/rows.jsx` gains `kolbox` beside default, float, folio and minimal; `Board.jsx` gets its scope (kolbox's ground, ink and tokens, carried by the wrapper so nothing crosses columns) and a fifth column.
- Each row's kolbox cell is the app's real part, imported from `apps/kolbox/src/ui` through an alias the way minimal's are (`@minimal/ui`); where kolbox has no such part the cell is a labelled gap, never a part borrowed from another style.
- Parts kolbox has that the board has no row for (the property row, the fill row, the split button, the color popover) become new rows, with gaps in the styles that lack them.
- Acceptance: the board renders 5 columns; every row has a kolbox cell that is a part or a labelled gap (0 empty cells); the kolbox card's "n of m parts" count equals the number of rows with a kolbox part; a kolbox cell's computed background is #1D2021 or #282828 and the other four styles' cells are pixel-identical to before; 0 console errors.

## Order
1.1 → 1.2 → 2.1 → 2.2 → 3.1 → 4.1 (first thing he can look at) → 2.3 → 4.2 → 3.2 → 4.3 → 7.1. One kol-build-agent in the background, one phase at a time; I look at each result before the next starts.
