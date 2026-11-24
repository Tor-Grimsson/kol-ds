# Plan — kolbox round 4: everything the side-by-side look found missing

**Raised:** 2026-11-18, him. Points verbatim: "im genuenly so supprised. you are miles off. almost every feature is missing."; "you mentioned before doing some run through to see/look at editor labs and that?"; "you know this is more for you then me right?"
**Status:** 2026-11-18, stopped on his word ("the things that are wrong, are wrong because you dont have the figma frames"). Built, each closed by its own agent's side-by-side retake (frames and `pairs.json` under `_tmp/2026-11-18-kolbox/r4-*/`): W1 layers, W2 inspector, W3 tools and the action band, W6 the Labs dock with 7.3 and the Labs keys, W7 the Labs parts, W8 Morph with the timeline's parts, W9 state that survives (per-screen drafts, as the real app), W10 Library `#/library`, W11 Randomiser `#/randomiser`, W13 Home file actions, W14 search with Settings, W15 phone with the seams. I looked at the inspector's retaken frames only. W5 editor keys: stopped before its retake: the cause of the dead keys is fixed (the engine read the screen from the URL path; kolbox keeps it in the hash), 29 of 54 keys measured same, the rest unmeasured; built and not looked at: the editor's timeline feed and lane gestures (add, drag, alt-click delete; no value graph or key editor), File › New no longer re-seeding the sample, Chromes › Randomiser in the editor's menu. Open: the editor's Chromes › Library row still goes to Home; under 768 the timeline keeps its width and slides inside its box; M draws no dots on kolbox's sliders. No final look was run, on his word.
**Shape:** W › phase › list.
**Source:** the side-by-side look of 2026-11-18: the real apps (`apps/editor`, `apps/labs`, `apps/editor-hub`) and kolbox driven through the same states, 370 frame pairs (127 same, 65 different by design, 88 partial, 90 missing), 267 distinct missing things. The frames are in `_tmp/2026-11-18-sidebyside/{editor,labs,shell}/` with a `pairs.json` each, and on one page: https://claude.ai/artifact/Y9k7Jrj5UD5uFrwSNaGb29. Every missing thing is listed verbatim at the end of this file with its frame number; the phases below group them by cause.
**Laws carried:** all of the three earlier kolbox plans: the style is local to `apps/kolbox`; his names; `variant`; family word first; one shell carries the look; Tailwind first; overlays in a body layer; a window is a `Modal`; rails, never panels; a control that cannot work shows "Not wired", and "Not wired" is only allowed where the engine has nothing behind it, never where a part was simply not built. Find the shipped part first: before building anything, look for it in the real editor, kol-component and the other style apps, and carry it. His design rulings stay: no menu bar (the mark opens the one menu), no search or Create in the left rail, the timeline is an overlay, groovebox lists have rows touching.
**Ruled 2026-11-18, after W9 and W11:** the app opens on Home ("kolbox should load you in 'home'"); the Labs start picker is "only a quick select for mobile, not a standard labs greeting": it shows under 768 wide only, a desktop Labs opens on Flow. And: "the things that are wrong, are wrong because you dont have the figma frames": what is left is finished, then the work goes back to Figma; no further look passes.
**What changed in how a phase closes:** every earlier round was closed on scripts that proved a thing existed. From now on a phase closes on the look: the real app and kolbox driven through the same steps for that phase's area, the frame pairs retaken, and every item of the phase's gap list read `same` or `different by design, every part present`. An item still missing keeps the phase open. I look at the retaken pairs myself.

## The job in one line
The canvas and the settings rails carry over because they run on the real engine; nearly everything around them is thin or absent. This plan builds what is around them.

## W1 — Layers (editor)
### 1.1 — The layers list works like the real one
- Cause: the left rail's Layers section was built as a display tree with select only.
- Row actions: right-click menu with the real rows; double click renames in place (keys go to the field, not the canvas); drag to reorder and into groups; shift and cmd click add to the selection; eye and lock on each row with their marks; the Canvas root row.
- The footer: Add layer menu (Pattern, Photo, Shape, Loop, Kinetic type, Misc, Empty layer, Generate), Group, Layer Effects, Mask Layer, Adjustment, Live Filter, Duplicate, Delete.
- Acceptance: every item under Editor › Layers and the layers items under Editor › Chrome and Left rail in the gap list reads same in the retaken pairs.

## W2 — Inspector (editor)
### 2.1 — Several layers selected
- The multi-selection inspector as the real one shows it ("3 layers selected", shared blend and opacity, Group selection).
### 2.2 — Transform: skew and origin
- Skew horizontal and Skew vertical fields and the nine-anchor origin picker, for every layer type.
### 2.3 — Effects in the rail
- An added effect shows its parameters in the rail with Move up, Move down, Disable and Reset to defaults; the Effects tab's content is reachable as the real one has it; the shader effects list is one level up, not behind a second step.
### 2.4 — Per type
- Para Type (Explore pad, X-height, Overshoot, Superness, Speed, Phase, Spin, Zoom, Pulse, Wobble, Rate), the photo layer's Motion tab, a path's Animation tab, and the rest listed under Editor › Inspector and Right rail.
- Acceptance (W2): every item under Editor › Inspector and Right rail reads same in the retaken pairs.

## W3 — Tools and the action band (editor)
### 3.1 — The tools the dock lacks
- The Fill / Stroke swatch pair; the tool folds (Select with Node select, Text with Kinetic type and its presets, and the others the real folds list); kinetic type can be added; image crop and crop mode.
### 3.2 — The action band
- Rotate fold, Boolean fold, Insert image, Crop image, Duplicate, Rotate 90° right: in kolbox's chrome where his design has room for them (TALK only on where; they are built).
- Acceptance (W3): every item under Editor › Tools and the action band items under Chrome reads same.

## W4 — Timeline (editor and Morph)
### 4.1 — The real timeline's parts
- Each row's duration bar, eye and lock; the header's Keyframes button, timeline zoom, add button, fit, expand; the selected layer highlighted; Space plays; rows in the Layers order.
- Morph gets the same timeline with its layers and keyframes; the Timeline button shows and hides it.
- Acceptance: every item under Editor › Timeline and the timeline items under Labs › Morph reads same.

## W5 — Keys and view
### 5.1 — Every key the real Shortcuts lists
- Editor: ⇧H, ⇧V, Space, M, X; View › Zoom › In from the menu; View › Show / hide rulers and grid as live rows.
- Labs: zoom (wheel, plus and minus, 0 to 4), zoom lock Z, Grab C with its canvas hints, F fps, S Shortcuts sheet, backslash hide rails, M modulation dots, ⌘O, ⌘S, comma.
- Acceptance: for every shortcut the real Shortcuts list names, the key does in kolbox what it does in the real app (a table: key, real, kolbox); every item under Keyboard and Canvas in both gap lists reads same.

## W6 — Labs: the dock's Output and File, and the stage
### 6.1 — Output
- Aspect, Export size, Export PNG with its menu, Export loop with baking, Record, Batch export, Open output window; the top rail's Export and Preview work in Labs and in Morph.
### 6.2 — File
- Save to file, Load from file, Audio source (Off, Mic, File); Files with ⌘O and Save with ⌘S in Labs.
### 6.3 — The stage
- Zoom and Grab on the Labs stage, with the readouts the real one shows (zoom, fps).
- The output window opened from the editor shows the editor's output, not Labs.
- Acceptance (W6): every item under Labs › Dock and Canvas reads same; Export in Labs downloads a file.

## W7 — Labs: the parts of labs that are missing
### 7.1 — Modulation and rolls
- The modulation card under Add input (Range, Invert, Smooth, Curve, Rate, Phase); roll chips show on and off; the scope chips fit the rail on every lab; Math's Wild scope; "What Settings rolls" opens its real window.
### 7.2 — Per lab
- Soft Forms' Forms list (add, duplicate, delete, reorder, edit on canvas, randomize); Penrose's Layers list; 3D Scene's Orbit and camera poses; Para Type's Flatten to vector and Explore pad; Math's Fit and Reset; the effect labs' Motion tab (Add motion, Add custom sweep); Drag (C) where the real lab has it; Edit on canvas for Type and Kinetic.
### 7.3 — Around Labs
- Undo and Redo; Settings, Shortcuts and Media reachable from Labs and Morph; the media picker lists every bucket.
- Acceptance (W7): every item under Labs › Lab params, Windows and Chrome reads same.

## W8 — Morph faults
### 8.1 — What breaks
- The stage draws a dark disc while playing, not the morph; Blend says why it will not switch; Crossfade changes Type and Category; the dock under the Morph rail.
- Acceptance: every item under Labs › Morph reads same; closed on a recording of a morph playing beside the real one.

## W9 — State that survives
### 9.1 — Nothing is lost on a move or a reload
- Cause: each kolbox screen mounts its own engine state and throws it away on leaving.
- The open document stays open going Editor → Labs → Editor and across a reload, with the real "Restore your last canvas?" prompt; the Labs pick is kept and is in the address; the Labs start picker on first open; an unknown address goes to a real page and fixes the address.
- Acceptance: every item under Shell › Start-up and the survive items under Shell reads same.

## W10 — Library
### 10.1 — The Library, whole
- Every shipped Labs, Randomiser, Editor and Morph file; the tabs, the group filter, search, grid and list; the detail rail; each file's own page with Open and Duplicate; opening an item into the right mode; its address.
- Where it lives in his design (Home is a file browser on Figma's model; the Library row goes to Home today): TALK on placement only. Built as its own screen `#/library` until he rules.
- Acceptance: every item under Shell › Library reads same.

## W11 — Randomiser
### 11.1 — The Randomiser, whole
- Generate and Effects: the opening screen, the generator picker, Randomize all, Effects from library, upload or camera, the Output tab (aspects, Save…, Download, Hide UI, Start over).
- His ruling 2026-11-17: the randomiser is a simplified Labs, mainly for mobile, reached from the Labs rail, not a mode on the track. Built as that: reached from Labs, and the phone screen (W15).
- Acceptance: every item under Shell › Randomiser reads same.

## W12 — Getting around
### 12.1 — What the nav rail did, in his design
- His design has no nav rail; its jobs still need homes: a way out of Home (the mark's menu and the mode track on Home), Media (the media library), Sign in (the library sync prompt), Dev, the page keys (Option + digit).
- Settings whole: the Shortcuts and About tabs, reachable from every screen (the mark's menu, comma), its own address.
- Acceptance: every item under Shell › Shell and Settings reads same or different by design with every part present.

## W13 — Home: files you can act on
### 13.1 — File actions and real saves
- On each card and row: the settings cog and its FILE rail (Rename, Tags, Note, cover upload), Duplicate, Delete with confirm, Download; the card's size and mode mark; the user's own saves listed first, samples only in an empty library.
- Trash, Starred and the stars work if the library can hold them (find it in the engine first); what the library truly cannot hold stays "Not wired".
- Acceptance: every item under Shell › Home reads same.

## W14 — Search
### 14.1 — The real search's groups
- The FILES group, the SHORTCUTS group, and every page (Library, Randomiser, Dev, Media, Sign in, Settings); a shortcut row runs.
- Acceptance: every item under Shell › Search reads same.

## W15 — Phone
### 15.1 — The phone layout
- At 390 wide: the bottom tab bar and More menu, the Editor's narrow-screen gate, the Randomiser as the phone screen (his words: "in mobile it would default to labs"), each page laid out for the width.
- The mobile views drawn in Figma on 2026-11-18 are the look, once they can be read; until then the real app's phone layout is carried in kolbox's tokens.
- Acceptance: every item under Shell › Phone reads same; no page scrolls sideways at 390.

## Order
W9 first (it changes how screens hold state, and everything else sits on it). Then side by side, separate files: W1, W2, W3 (editor); W6, W7, W8 (Labs and Morph); W10, W11, W13 (new screens and Home). Then W4, W5, W12, W14. W15 last. After each W: the look for that area is retaken and I read the pairs.

## Every missing thing, verbatim from the look (267)
Each line: [which look, frame number] what the real app shows or does there that kolbox does not.

### Editor


**Chrome**
- [editor 01] no action band under the menu (Rotate fold, Boolean fold, Insert image, Crop image, Duplicate)
- [editor 01] no Fill / Stroke swatch pair at the foot of the tools
- [editor 01] the Stroke, Color and Swatches pane is not docked; it opens only from Window > Left rail as a popover
- [editor 01] the Assets, History and Navigator tabs are not on the rail; they open only from Window > Left rail
- [editor 01] no Transport, Output and File dock at the bottom of the left rail
- [editor 01] no layers footer (Add layer, Group, Layer Effects, Mask Layer, Adjustment, Live Filter, Duplicate, Delete)
- [editor 01] no canvas title readout ("Untitled @ 56%") above the rulers
- [editor 01] no Canvas root row in the Layers list
- [editor 02] no Rotate fold; Rotate 90° right exists nowhere (the rail has Rotate 90° left and the two flips only)
- [editor 03] no Boolean fold in a toolbar; Unite and the boolean menu appear only in the rail header once a layer is selected

**Tools**
- [editor 04] Select has no fold: no Node select (A) row
- [editor 07] Text has no fold: no Kinetic type row
- [editor 09] no Fill / Stroke pair (fill colour, stroke colour, swap, clear) anywhere in the window
- [editor 09] nothing opens the paint's tab from the tools
- [editor 59] no Skew horizontal and Skew vertical fields (SX, SY)
- [editor 59] no origin picker (the nine anchor dots beside X and Y)
- [editor 162] Tools > Type > Kinetic type adds no layer
- [editor 162] no Kinetic type row in the Text tool fold
- [editor 162] the Kinetic type presets (Radial, Rings, Path, Scenes ... Composite) are not offered

**Left rail**
- [editor 10] not a rail tab: only reachable through the mark menu, Window > Left rail > Stroke
- [editor 11] not a rail tab: only reachable through Window > Left rail > Color
- [editor 12] not a rail tab: only through Window > Left rail > Swatches
- [editor 12] AC palette chip count not recounted here; the round 3 plan reports 22 of 36
- [editor 15] not a rail tab: a popover from Window > Left rail > Assets
- [editor 16] not a rail tab: a popover from Window > Left rail > History
- [editor 17] not a rail tab: a popover from Window > Left rail > Navigator
- [editor 19] not a dock tab: a popover from Window > Left rail > Output
- [editor 20] not a dock tab: a popover from Window > Left rail > File

**Layers**
- [editor 14] no Canvas root row with its collapse chevron
- [editor 14] no layers footer (Add layer, Group, FX, Mask Layer, Adjustment, Live Filter, Duplicate, Delete)
- [editor 14] no Layers / Assets / History / Navigator tab track
- [editor 70] no Canvas root row
- [editor 70] no eye and lock on the selected row
- [editor 71] no eye and lock on rows
- [editor 111] no eye (hide) and lock buttons on the row
- [editor 112] right click on a layer row shows no menu (real: Convert to path, Use as mask, Add effect, Duplicate, Hide, Lock, Delete)
- [editor 113] double click on a layer row does not start a rename; the typed letters went to the canvas as tool shortcuts and drew a path
- [editor 114] dragging a row does not move it; no drop line; order unchanged after release
- [editor 115] a locked layer shows no lock in its row
- [editor 115] a hidden layer shows no closed eye in its row
- [editor 116] Shift-click on a layer row does not add it to the selection
- [editor 117] nothing groups, because the row selection held one layer (⌘A then ⌘G does group, pair 152)
- [editor 120] no Add layer button and menu (Pattern, Photo, Shape, Loop, Kinetic type, Misc, Empty layer, Generate)
- [editor 120] no Group, Layer Effects, Mask Layer, Adjustment, Live Filter, Duplicate, Delete buttons under the list

**Timeline**
- [editor 18] no separate Pause button
- [editor 18] no Loop length field labelled Loop (a 4 s field sits in the floating bar instead)
- [editor 139] no duration bar per layer (4.00 s)
- [editor 139] no eye and lock per timeline row
- [editor 139] no Keyframes button
- [editor 139] no timeline zoom (minus and 100%)
- [editor 139] no + (add) and no document name with layer count in its header
- [editor 139] no layer type icons in its rows
- [editor 140] the selected layer is not highlighted in the timeline
- [editor 141] Space does not start playback

**Right rail**
- [editor 22] Window > Right rail > Parameters is disabled with nothing selected; no "Select a layer to edit its parameters." message
- [editor 23] Window > Right rail > Effects is disabled with nothing selected; no "Select a layer to edit its effect." message
- [editor 85] no Effects tab: the shader effects list (Dither, ASCII, Bitmap, Riso, Scanline, RGB Split, Glass, the colour adjustments, the blurs, CRT, Old Film, Glitch, Bloom, Pixel Sort, Kaleidoscope and the rest) is one step deeper, behind Add effect > Shader effects…
- [editor 88] no Effects tab; the shader effects list is behind Add effect > Shader effects…
- [editor 156] the list shows 10 layer effects and a Shader effects… row; the real list shows the shader effects themselves in groups (Halftone, Dither, ASCII, Bitmap, Riso, Growing line, Scanline, Refraction, RGB Split, Glass, Color adjustments and more)
- [editor 157] the added effect has no controls in the rail: no parameters, no Move up, Move down, Disable or Reset to defaults (only Hide and Remove)

**Menus**
- [editor 25] no Randomiser chrome
- [editor 26] Clear is enabled on an untouched document where the real one greys it (kolbox opens on a sample)
- [editor 48] Show / hide rulers and Show/hide grid rows are disabled (their keys ⇧R and G still work)
- [editor 53] Parameters and Effects rows disabled when nothing is selected

**Inspector**
- [editor 58] no Skew horizontal and Skew vertical fields (SX, SY)
- [editor 58] no origin picker (the nine anchor dots beside X and Y)
- [editor 72] the tabs are Generate, Style, Animation, not Inspector, Parameters, Effects
- [editor 78] no Animation tab for a path (only Generate and Style)
- [editor 90] no Explore pad with its X axis and Y axis
- [editor 90] no X-height, Overshoot or Superness controls
- [editor 90] no Speed, Phase, Spin, Zoom, Pulse, Wobble, Rate controls
- [editor 92] the Motion tab is empty
- [editor 92] Fit shows as one dropdown; Cover, Contain and Fill are not laid out as in the real Parameters
- [editor 150] no multi-selection inspector ("3 layers selected", shared blend and opacity, Group selection); the rail shows only the first layer as if it were alone

**Windows**
- [editor 101] no Theme row
- [editor 174] no bucket switch (R2 kol-media, B2 website, R2 private)

**Files**
- [editor 109] the new window opens kolbox's Labs screen (?view=output#/labs), not the editor's output

**Navigation**
- [editor 126] the menu's Zoom > In row does not zoom (⌘= does)
- [editor 131] the menu row is disabled; rulers stay
- [editor 132] the menu row is disabled; no grid

**Canvas**
- [editor 173] no Crop image control; no crop mode (the real crop mode with drag to pan, scroll to zoom and crop handles)

**Keyboard**
- [editor 180] ⇧H does nothing (⇧V too)
- [editor 181] Space does nothing

### Labs and Morph


**Chrome**
- [labs 01] The start picker: a "Labs" card listing Color, Effects, Generative, Morph, Vector and Composition, shown before any lab is chosen.
- [labs 02] The "Restore your last canvas?" dialog with New file and Restore.
- [labs 03] The picker's second level: the category's labs as large rows plus a Back row.
- [labs 04] Undo and Redo buttons at the top right of the params rail.
- [labs 04] The dock at the foot of the params rail with Transport, Output and File tabs (only the transport has a kolbox home).
- [labs 04] The fps readout on the stage (F).
- [labs 05] Randomiser chrome.
- [labs 05] Dev page.
- [labs 05] Media window (rail button).
- [labs 05] Sign in.
- [labs 05] Settings window (rail button).
- [labs 07] "Collapse navigation" on the rail edge, which hides both rails and leaves the stage with a floating Play button.
- [labs 07] Expand navigation to bring them back.
- [labs 08] Undo and Redo buttons (top right of the params rail). Cmd+Z works in both.

**Lab params**
- [labs 21] The sibling effects as a tab track across the top (Dither, ASCII, Bitmap, Riso, Growing line); kolbox has them in a dropdown, all five there.
- [labs 21] Motion tab: the Motion section with the "Add motion…" picker and "Add custom sweep" (see 155).
- [labs 27] Roll scope chips past the first three (Mark, Color, Motion Frame, Motion Form) run off the right edge of the rail and cannot be reached.
- [labs 28] The canvas hint under the Rolls ("Press C, then drag to rotate and scroll to zoom.").
- [labs 28] Animation tab, Interaction section: the Drag (C) Off / On switch.
- [labs 29] The canvas hint under the Rolls ("Press C, then scroll to zoom.").
- [labs 30] Style tab: the Fit and Reset view buttons.
- [labs 30] The "Wild" roll scope chip.
- [labs 31] Style tab: the Layers list (Foreground, Accent, Dim, Warm), each with its colour, a hide toggle and an opacity slider.
- [labs 31] Roll scope chips run off the rail edge (Motion Frame, Motion Form cut).
- [labs 35] Roll scope chips past Position (Look, Finish, Motion, Interaction, Motion Form) run off the rail edge.
- [labs 36] The Forms list (Teardrop, Pill, Teardrop) with reorder handles, Duplicate form and Delete form on each row.
- [labs 36] "Add form".
- [labs 36] "Edit forms on canvas" (click to select, drag to move, corners to scale, knob to rotate).
- [labs 36] "Randomize forms" with Color, Transform, Scale, Animation and Rearrange.
- [labs 37] The canvas hint under the Rolls ("Press C, then drag to orbit the camera and scroll to zoom.").
- [labs 37] Animation tab: the Orbit (C) Off / On switch.
- [labs 37] Animation tab, Camera: the keyframe row Save pose 1, 2, 3 and Reset.
- [labs 37] Roll scope chips run off the rail edge.
- [labs 40] "Edit on canvas" works (selection handles on the canvas); in kolbox it is drawn but "Not wired".
- [labs 41] "Edit on canvas" works; in kolbox it is "Not wired" (see 166).
- [labs 42] "Flatten to vector" (flatten the glyphs to vector shape layers).
- [labs 42] Style tab: the Explore pad (X axis and Y axis bound to Stem width and Round width).
- [labs 110] A visible on/off state on the Rolls chips (real: dark = rolls, light = held). Kolbox chips toggle but look the same either way.
- [labs 119] The Modulation card that appears for the new input: Range from and to, Invert Off / On, Smooth, Curve (and Rate and Phase for an LFO).
- [labs 121] The Modulation card for the selected input (Range, Invert, Smooth, Curve, Rate, Phase). Sources (Off, Mouse X, Mouse Y, Mic, Beat, LFO) and Drives are the same.
- [labs 123] The bound value shown live in the field (real shows the moving number); kolbox keeps the typed text and hides the slider, and I could not tell from the screen whether it binds.
- [labs 130] Roll scope chips Mark, Color, Motion Frame, Motion Form run off the rail edge.
- [labs 140] Roll scope chips run off the rail edge (Motion Frame cut).
- [labs 141] The Layers list (Foreground, Accent, Dim, Warm) with colour, hide toggle and opacity slider per row.
- [labs 142] The Layers list.
- [labs 143] Interaction section: Drag (C) Off / On.
- [labs 155] The Motion section: "Add motion…" picker and "+ Add custom sweep".

**Dock**
- [labs 61] The Output tab: Aspect picker, Export size picker, Export PNG, the export menu, Open output window.
- [labs 61] Kolbox's Export button in Labs does nothing (no download, no window, no dialog).
- [labs 62] Save to file.
- [labs 62] Load from file.
- [labs 62] Audio source: Off, Mic, File.
- [labs 63] Export size: @1x (1080 × 1350), @2x (2160 × 2700), @3x (3240 × 4050).
- [labs 64] Aspect: 1:1, 4:5, 3:5, 9:16, 5:4, 5:3, 16:9.
- [labs 65] Export PNG (downloads compose-1080x1350.png in the real one).
- [labs 65] Export loop (webm).
- [labs 65] Record.
- [labs 65] Batch export.
- [labs 66] Open output window: a second window with the live output full screen. Kolbox's Preview button in Labs does nothing.

**Canvas**
- [labs 93] Wheel zoom of the stage (with Grab off).
- [labs 94] Hold Space and drag to pan, listed in the real shortcuts sheet. My scripted drag did not move the real stage either, so this one is unconfirmed.
- [labs 95] Changing the stage aspect (Output tab, Aspect).

**Keyboard**
- [labs 79] The fps readout toggled by F.
- [labs 80] + and - zoom the stage.
- [labs 81] Number keys 0 to 4 set the stage zoom (fit, 50%, 100%, 150%, 200%).
- [labs 82] 0 fits the stage.
- [labs 83] C flips Grab (orbit and in-piece zoom) and the canvas hint refers to it. Nothing changes in kolbox; I confirmed the real effect through the wheel, not on a still.
- [labs 84] Z toggles zoom lock.
- [labs 86] The Shortcuts sheet (Tools, View, Labs sections, 22 keys).
- [labs 88] \ hides and shows the rails.
- [labs 89] Cmd+O opens the Files window in Labs (kolbox only does this in Morph).
- [labs 90] Cmd+S saves the patch through the Files window.
- [labs 92] M shows a modulation dot beside every slider.

**Morph**
- [labs 200] The floating timeline panel: document name, layer count, + add layer, Keyframes, Fit the loop, Loop off, zoom 100%, Expand the timeline, and a Layers list with eye and lock per layer.
- [labs 200] The dock (Transport, Output, File) under the Morph rail.
- [labs 207] The Blend tab is disabled with its reason: "Blend tweens one generator, these steps are different generators". In kolbox Blend can be pressed, nothing happens and no reason shows.
- [labs 208] Type and Category follow the mode (real: Type Crossfade, Category Scanline); kolbox keeps Shape and Loops.
- [labs 213] The stage drawing the morph while it plays (real: the shape morphing); kolbox shows a dark disc with a thin sliver at 1 to 2 s.
- [labs 214] "Expand the timeline" grows the panel; kolbox's Timeline button made no visible change.
- [labs 214] Keyframes, Fit the loop, Loop off and Add a key at the head.

**Windows**
- [labs 67] Batch export: Aspects (1:1, 4:5, 3:5, 9:16, 5:4, 5:3, 16:9 with sizes), Scale @1x @2x @3x, file count, Export all. Kolbox's search finds nothing for "export" in Labs.
- [labs 68] The "Baking loop…" progress window (n / 120 frames), then a webm download.
- [labs 113] The "Randomize all rolls" window: Color, Motion Form and Effects switches, the note "A scope switched off still rolls from its own button.", Done. Kolbox draws the button disabled, "Not wired".
- [labs 151] The bucket list: R2 kol-media, B2 website, R2 private (kolbox shows R2 kol-media only).
- [labs 166] Edit on canvas: selection handles on the canvas and the hint "Edit elements on the canvas (click to select, drag to move, corners to scale)". Kolbox: "Not wired".
- [labs 300] Settings: Defaults (Default aspect, Loop theme, Clip to frame, Modulation dots), Transport (Autoplay, Loop length), the Shortcuts and About tabs, the theme and reset buttons. Search for "settings" in kolbox Labs finds nothing.
- [labs 301] The Media window with its three buckets (R2 kol-media, B2 website, R2 private).

### Home, Library, Settings and the shell


**Shell**
- [shell 01] The nav rail on every page, with Library, Editor, Labs, Randomiser, Morph and Dev as icon rows and Media, Sign in and Settings at the foot.
- [shell 01] The brand mark at the top of the rail that goes Home.
- [shell 01] The page header "FXR" with the line "Pick a chrome. All three run the same engine."
- [shell 01] From Home, a one-click way to Labs, Morph or Settings: kolbox Home has no mode track and no KOL mark menu, so only opening a file, Create or the search modal leave Home.
- [shell 02] Expand and collapse of the rail (real: one button toggles labels; kolbox has no rail to expand).
- [shell 02] Dev, Media and Sign in rows.
- [shell 02] Randomiser as a destination.
- [shell 03] A back row "Labs" that exits the sub list to the main rail.
- [shell 03] Morph as a Labs category (real Labs lists Color, Effects, Generative, Morph, Vector, Composition; kolbox Labs has no Morph category, Morph is its own mode).
- [shell 04] An active mark on the current page in a persistent nav; kolbox shows the active tab only for Editor, Labs and Morph, and nothing on Home.
- [shell 04] Library as a page of its own (kolbox Chromes > Library opens Home).
- [shell 04] Randomiser in the Chromes list.
- [shell 05] The Dev row on the rail (empty on this app, but present on every dev server).
- [shell 05] Settings… in the mark menu on Labs and Morph: kolbox shows only Actions…, Home and Chromes there.
- [shell 06] The Media window over the media fixture: buckets R2 kol-media, B2 website, R2 private, a column browser, filter, search, columns, rows and grid views, a row size slider, Cancel and Use.
- [shell 06] Any shell-level way to browse media: kolbox only has Insert image inside the editor.
- [shell 07] The Sign in row and its prompt "Password for the library sync:" with Cancel and OK; in kolbox "Not signed in" does nothing.
- [shell 08] Settings reachable from Home and from the rail on every page; kolbox reaches it only from the mark menu in the Editor.
- [shell 09] The theme toggle (light, dark, following the system) in the Settings footer.
- [shell 10] Walkthrough in the Actions menu.
- [shell 10] Actions as a menu: kolbox Create goes straight to a new Untitled file in the Editor.
- [shell 11] The Walkthrough: a stepped overlay with back and next arrows and a page count (1 / 2).
- [shell 12] S opening the shortcuts sheet from Home and the other shell pages; kolbox answers S only inside the Editor (Help > Show / hide shortcuts).
- [shell 12] Collapsible shortcut sections with Navigate, Collapse and Collapse all keys.
- [shell 13] Option 1 to 6 jump to Home, Library, Editor, Labs, Randomiser, Morph and Settings.
- [shell 14] Shift + backslash to hide and show the rail, and backslash to expand and collapse it.
- [shell 15] Randomiser in the Chromes list (real: Library, Editor, Labs, Randomiser, Morph; kolbox: Library, Editor, Labs, Morph).
- [shell 15] A check mark on the current chrome.
- [shell 16] On arrival, the rail and page header of Home (kolbox Home has neither).
- [shell 17] The "Restore your last canvas?" prompt with New file and Restore when coming back: real brings the drawing back (as Untitled*), kolbox silently shows its default Untitled canvas and the opened file is gone.
- [shell 18] Labs keeps its pick across a trip to the Editor (real comes back on Penrose, kolbox comes back on Flow).
- [shell 18] The pick in the address (real /labs?preset=...&cat=penrose).
- [shell 19] Randomiser as a destination: no row, no route, no menu entry anywhere in kolbox.

**Home**
- [shell 21] Card fields: the date and the size (kolbox shows "Edited N ago" only, no size).
- [shell 21] Per-card Download button on the cover.
- [shell 21] Per-card settings cog and trash.
- [shell 21] The chrome mark on the cover (Editor, Labs, Randomiser or Morph glyph).
- [shell 21] Real files only: kolbox lists 14 sample files instead of the files saved in it (the real Home lists exactly what was saved).
- [shell 22] Size and the settings cog and trash on each row.
- [shell 24] Filter by tags and the "N of N" count.
- [shell 27] The FILE rail for a file: Name, Tags, Details (Date, Size, Chrome, Layers, Aspect) and the footer Edit, Download, Duplicate, Delete.
- [shell 27] Any per-file menu or panel on a kolbox card (right click and click do nothing visible).
- [shell 28] Rename from Home without opening the file.
- [shell 28] Tags (Add a tag), Note (Add a note) and Done editing.
- [shell 29] Duplicate from Home without opening the file.
- [shell 30] Delete a file: card trash with "Delete \"Launch card\"?" Cancel and Delete. kolbox has no delete anywhere on Home, and its Trash row is not wired.
- [shell 31] Download a file from Home.
- [shell 32] Set a file's cover with Upload image.
- [shell 35] Download, cog and trash on the card.

**Library**
- [shell 36] The Library page: "Everything the app ships with, by chrome." with every shipped Labs, Randomiser, Editor and Morph file (hundreds of presets with covers).
- [shell 36] The page header "Library" with its subtitle.
- [shell 37] The ten shipped Editor files (Preset 1a, Type 1b, Logo, Vector form ...).
- [shell 38] The shipped Randomiser files, and Randomiser as a file type.
- [shell 39] The ten shipped Morph files (Circle morph → Blob and the rest).
- [shell 40] Filter shipped files by group.
- [shell 41] Searching the shipped presets.
- [shell 42] A list of the shipped files.
- [shell 43] The detail rail of a shipped file with its tags, group and category.
- [shell 44] The file page with Back, Description, Specifications, Tags, preview, Open and Duplicate.
- [shell 44] A deep link to a shipped file (/library/labs/square-circle).

**Settings**
- [shell 45] The Shortcuts and About tabs.
- [shell 45] The theme toggle.
- [shell 46] The shortcuts list as a tab of Settings, reachable from Home.
- [shell 47] About: what FXR is, Links to GitHub, Kolkrabbi and Vercel, and the Kolkrabbi Vinnustofa 2026 line.
- [shell 49] Settings from Labs: comma does nothing in kolbox Labs, and its mark menu there has no Settings row.

**Randomiser**
- [shell 52] The Randomiser chrome itself.
- [shell 53] The generator picker, with Insert image or video and Back.
- [shell 54] The Randomiser panel: Generate, Effects, Transport and Output tabs, Preset, Generator, Randomize all, What Randomize all rolls, Reset, Color, Motion Form, Re-trigger, Start over.
- [shell 55] Randomize all across preset, generator and colour, with its settings for what it rolls; kolbox Roll changes the palette only.
- [shell 56] Effects on a picture from the library, an upload or the camera.
- [shell 57] Output: aspects 9:16, 3:5, 4:5, 1:1, 5:4, 5:3, 16:9, Fill, and Save…, Download, Hide UI, Start over. kolbox Labs Export shows nothing.
- [shell 58] The Randomiser as its own app.

**Around the editor**
- [shell 63] The nav rail beside Labs, with Library, Randomiser, Dev, Media, Sign in and Settings.

**Search**
- [shell 65] FILES group listing the saved files.
- [shell 65] Pages: Home, Library, Randomiser, Dev, Media, Sign in, Settings (kolbox lists only Editor, Labs, Morph).
- [shell 65] SHORTCUTS group.
- [shell 66] FILES group.
- [shell 66] Pages Library, Randomiser, Dev, Media, Sign in, Settings.
- [shell 66] The full shortcuts list.
- [shell 67] Pages Home is there but Library, Randomiser, Dev, Media, Sign in, Settings are not.
- [shell 67] Labs shortcuts.
- [shell 68] Library as a search target.
- [shell 70] Show/hide grid as a search row in kolbox: typing "grid" runs the first match, which inserts the Grid rotor preset instead.
- [shell 71] Saved files as their own FILES group; kolbox finds "Pattern tile" only under Actions as File › Library › Presets, mixed with tools.

**Phone**
- [shell 72] A phone layout: real shows Home in one column with a bottom tab bar; kolbox shows the desktop Labs squeezed to 390.
- [shell 73] A usable Home: kolbox shows its left list and the cards fall off the screen.
- [shell 73] The bottom tab bar Home, Library, Editor, Labs, More.
- [shell 74] Library in one column.
- [shell 75] Reaching Settings from a bottom tab; kolbox needs the Editor's mark menu. The kolbox window itself fits.
- [shell 76] The phone gate "Needs a window at least 1024 wide" with Randomiser and Open the editor anyway; kolbox draws the desktop editor cut off.
- [shell 77] Labs chooser sized for a phone; kolbox Labs is the desktop layout cut off.
- [shell 78] The Randomiser as the phone chrome with its bottom panel.
- [shell 79] Home, Library, Randomiser, Dev, Media, Sign in, Settings in one phone menu.

**Start-up**
- [shell 81] After reload real still holds the drawing (restore prompt on entry); kolbox returns to Untitled after reload of an opened file.
- [shell 82] Labs coming back on the same pick after reload (real keeps Penrose from the address; kolbox comes back on Flow).
- [shell 83] Neither shows Settings; kolbox has no settings route at all.
- [shell 84] A Library address.