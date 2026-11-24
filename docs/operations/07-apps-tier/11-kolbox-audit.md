---
title: Kolbox audit
type: audit
status: active
created: 2026-11-20
updated: 2026-11-20
description: Every control of the kolbox style of the editor driven once, with what it should do, where that comes from and its state; the effects by seven steps, the tools by six, the behaviour set
aliases:
  - kolbox audit
  - T2.1 audit
tags:
  - domain/editor
  - domain/workflow
  - audience/agency-internal
sources:
  - packages/design-editor/src/editor/kolbox
  - apps/editor/src/kolbox
  - .kol/llm-context/plan-2026-11-19-kolbox-whats-left.md
covers:
  - pnpm editor, Settings, Style Kolbox
related:
  - "[[INDEX|Apps tier]]"
  - "[[../../documentation/04-compositions/26-kolbox-system|Kolbox system]]"
---

# Kolbox audit

Driven 2026-11-19 and 20 in installed Chrome (Playwright, headless, 1440 by 900, dark), `pnpm editor` with the kolbox style.
Plan phase T2.1 of `plan-2026-11-19-kolbox-whats-left`; T3 to T6 there are rewritten from it.
2026-11-20 later: the crawl script was updated for the new shell (RailSwitcher, no top rail; runs for Chrome, Firefox, light, touch and phone) in `_tmp/2026-11-20-w13/crawl.mjs`, with partial results beside it; the tables below are still the morning's.

## Counts

| Screen | Rows (= controls in the DOM, every menu and window opened once) | Works | Dead | Disabled, reason shown | Disabled, no reason | Wrong | Not on the screen |
|---|---|---|---|---|---|---|---|
| Home | 87 | 81 | 0 | 6 | 0 | 0 | 0 |
| Library | 57 | 48 | 0 | 9 | 0 | 0 | 0 |
| Editor | 505 | 425 | 0 | 14 | 63 | 0 | 3 |
| Editor, a rectangle selected | 789 | 780 | 0 | 4 | 5 | 0 | 0 |
| Editor, a text layer selected | 609 | 596 | 0 | 7 | 6 | 0 | 0 |
| Editor, a frame selected | 54 | 37 | 0 | 15 | 0 | 0 | 2 |
| Editor, two selected | 67 | 62 | 0 | 4 | 1 | 0 | 0 |
| Labs | 287 | 281 | 0 | 5 | 0 | 0 | 1 |
| Morph | 497 | 491 | 0 | 5 | 0 | 0 | 1 |
| Randomiser | 62 | 62 | 0 | 0 | 0 | 0 | 0 |
| Settings window | 61 | 61 | 0 | 0 | 0 | 0 | 0 |
| Search modal | 95 | 94 | 0 | 0 | 0 | 0 | 1 |
| Media window | 46 | 42 | 0 | 3 | 0 | 0 | 1 |
| **All** | **3216** | **3060** | **0** | **72** | **75** | **0** | **9** |


Rows: 3216, 0 without a state. Every row carries exactly one of the five states.
2026-11-20: the rows plan T4.1 to T5.5 fixed were re-marked in place; then every row the first run read dead (54), wrong (8) or disabled with no reason outside a greyed menu row (18 by the rows; the plan's 22) was driven again by the same crawler, 80 rows: the counts above are now current. The first run read 3016 works, 54 dead, 46 disabled with a reason, 92 disabled with no reason (70 of them greyed menu rows) and 8 wrong. "Not on the screen" is a control no longer drawn or no longer reachable (a frame's rotation, the zoom on Labs and Morph, Edit, Color with nothing selected).
How a row was read: a fresh profile per control, the control pressed once (a field: one click, a new value, Enter), and
the page compared before and after (its markup, the address, the browser's storage, a download, a file picker, a page
error). A press that changed none of them is **dead**. A disabled control is read by hovering it: a tooltip is a
**reason shown**. **Wrong** is a press that does something other than the label says, read by eye or measured (each says
what). A control already on its current choice (the tab you are on, the current view) counts as working. Rows whose
names change on every load (the random palette in Color Modes, the files' edited times) take the state of the same
control where it was reached.

## The ten worst findings

1. **The frame's inspector is a picture.** With a frame selected, 27 of its 54 controls do nothing: Create component,
   Use as mask, Boolean, Edit object, the six aligns, rotation, rotate, both flips, constrain proportions, Hide layer,
   blend, opacity, corner radius, both Styles, Add stroke and Add effect (the plus lights, no menu opens).
   `editor/properties/Canvas.jsx` hands `HeaderActions`, `PositionSection`, `LayoutSection`'s lock and
   `AppearanceSection` no writes, so every one falls to its `noop` default.
2. **The rail's fields are half fields.** One click selects (S5.1 holds), Enter commits, but the arrows step by 0 and
   Shift and an arrow by 0, and Escape keeps what was typed, in all six measured (X, W, the fill's hex and opacity, the
   corner radius, the text size). Figma steps 1 and 10 and Escape restores. Labs' number fields step 0.25 with and
   without Shift and place a caret on the first click.
3. **Most icon buttons have no tooltip.** Without a tooltip, by screen: home 5 of 9; library 5 of 35; editor, rectangle selected 38 of 54; editor, text selected 48 of 65; labs 7 of 18; morph 11 of 11; randomiser 1 of 1. The dock's tools show name and key; the
   fold chevrons ("Rectangle variants"), the inspector's actions and Morph's timeline show nothing.
4. **Menus light the current row.** Blend, Sort, Labs' preset and the other dropdown menus open with the current row in
   the accent and a check (S2.2: the accent is the pointer's, the check the selection's). In none of the eight menus
   measured does typing a letter move to a row.
5. **Windows beside the rail close on a canvas press, and the generator's is not beside the rail.** Color, Type settings,
   Stroke settings and the Line Swell picker close when the canvas is pressed (S7.1: a press on the canvas does not
   close a window). The generator families (Line Screen, Stripe Array, Repeat) open their settings 880 wide, centred
   over the canvas, where every other effect's settings dock at the rail.
6. **Home draws ten controls it cannot do.** Community, All folders, Resources, Trash, Admin, Starred, the cards' Star,
   Share, Adjust, notifications and the place's title menu are disabled with the tooltip "Not wired". Trash, Starred,
   Star and All folders are local and can work today.
7. **Tools.** Escape leaves Hand, Zoom and Orbit armed; Text takes two undos to remove what it made; Kinetic type adds a
   page-size rectangle that six undos did not remove; Alt and a click zooms in; Orbit does nothing on a 2D page; Crop
   never enables, because an inserted image is a rectangle with an image fill; Triangle, Polygon and Star show the fold's
   key, R, in the dock's tooltip, and R arms Rectangle.
8. **Controls that take a press and do nothing on every screen.** Share in the top rail (no action), the zoom on Labs and
   Morph (reads 100 percent, its field and rows drive nothing), the page's opacity field and its eye
   (`Canvas.jsx`: no `onOpacity`, a `noop` eye), Add style.
9. **Code names as labels.** The Motion effect's settings window reads `randomSpread`, `filterAmount`, `pianoWidth`,
   `dashLength`, `dashSpeed`, `warpScale`, `warpSpeed` (S11.3: plain words, never the code's names).
10. **Right-click and the colour window.** The canvas's menu on a shape lacks Use as mask, which the Layers row's has;
   the Pages menu has Rename, Duplicate and Delete, where Figma's adds Copy link, Move down and Move to bottom.
   Edit, Color with nothing selected opens a picker that moves nothing; the Eyedropper arms with no cursor or sign;
   the Randomiser's Camera says nothing when the camera is refused.

## Effects (T6)

Each effect in the Effects menu, added to a rectangle (Morph to a text layer), through the seven steps. Reopen is the
draft reloaded. The export is the Export window on the selection, as SVG, compared with the same export before the
effect. Cells passing: 633 of 637 on 2026-11-19; 637 of 637 after T6.1 and T6.2 (2026-11-20). Greyed in the menu, as they should be on that layer (each passes on the layer it is for): Morph on a rectangle, Vector effects on a text.

| Effect | On | Adds a row | Settings beside the rail, plain labels | Eye hides it | Minus removes it | One undo step | Survives reopen | In the export |
|---|---|---|---|---|---|---|---|---|
| Generate › Arrays | rectangle | pass | pass (2026-11-20): docked, right edge 8 from the rail | pass | pass | pass | pass | pass |
| Generate › Motion | rectangle | pass | pass (2026-11-20): docked, plain words | pass | pass | pass | pass | pass |
| Generate › Repeat | rectangle | pass | pass (2026-11-20): docked, right edge 8 from the rail | pass | pass | pass | pass | pass |
| Generate › Screens | rectangle | pass | pass (2026-11-20): docked, right edge 8 from the rail | pass | pass | pass | pass | pass |
| Layer effects › 3D | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Layer effects › Bevel / Emboss | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Layer effects › Color Overlay | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Layer effects › Gaussian Blur | rectangle | pass | pass | pass (draws nothing at its defaults; the eye flips) | pass | pass | pass | pass |
| Layer effects › Gradient Overlay | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Layer effects › Inner Glow | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Layer effects › Inner Shadow | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Layer effects › Kinetic type | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Layer effects › Motion | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Layer effects › Outer Glow | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Layer effects › Outer Shadow | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Layer effects › Outline | rectangle | pass | pass | pass (draws nothing at its defaults; the eye flips) | pass | pass | pass | pass |
| Layer effects › Pattern | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Line Swell | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Morph | text | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Adjustment | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Advanced Bloom | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › ASCII | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Backdrop Blur | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Bevel | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Bitmap | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Blocks | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Bloom | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Blur | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Brightness | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Bulge/Pinch | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Color Gradient | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Color Map | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Color Overlay | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Color Replace | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Contrast | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Convolution | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Cross Hatch | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › CRT | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Displacement Map | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Dither | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Dot Screen | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Drop Shadow | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Edge Detect | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Emboss | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Enhance | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Glass | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Glitch | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Glow | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › God Ray | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Grayscale | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Growing line | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › HSL | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › HSL Adjustment | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › HSV | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Invert | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Kaleidoscope | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Kawase Blur | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Media motion | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Mirror | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Motion Blur | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Multi Color Replace | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Noise | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Old Film | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Outline | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Pixel Sort | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Pixelate | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Posterize | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Radial Blur | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Reflection | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › RGB | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › RGB Split | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Riso | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Scanline | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Sepia | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Shockwave | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Simple Lightmap | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Simplex Noise | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Slice wave | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Solarize | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Threshold | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Tilt Shift | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Twist | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Shader effects › Zoom Blur | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Tune | rectangle | pass | pass: a mode, its settings are the mode's rail (R9) | pass | pass | pass | pass | pass |
| Vector effects › Distress | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Vector effects › Offset path | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Vector effects › Pucker & bloat | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Vector effects › Smooth | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Vector effects › Twist | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Vector effects › Warp | rectangle | pass | pass | pass | pass | pass | pass | pass |
| Vector effects › Zigzag | rectangle | pass | pass | pass | pass | pass | pass | pass |


## Tools (T6)

Each tool in the dock and its folds through the six steps, drawn on a file with two rectangles, a frame and a text.
Cells passing: 82 of 102 on 2026-11-19; 102 of 102 after T6.3 and T6.4 (re-run 2026-11-20).

| Tool | Key | Its key arms it | It draws or acts | The cursor shows it | Escape returns to Select | What it made is selected | One undo removes it |
|---|---|---|---|---|---|---|---|
| Select | V | pass | pass: selects and moves | pass: arrow | pass: is Select | pass: nothing made | pass: nothing made |
| Node select (Select fold) | A | pass: A edits the nodes of a selected path | pass: node handles on the path | pass | pass | pass: nothing made | pass: nothing made |
| Frame | F | pass | pass: draws a frame | pass: crosshair | pass | pass | pass |
| Pen | P | pass | pass: draws a path | pass: pen cursor | pass | pass | pass |
| Line (Pen fold) | L | pass (2026-11-20) | pass | pass: crosshair | pass | pass | pass |
| Rectangle | R | pass | pass | pass: crosshair | pass | pass | pass |
| Ellipse (Rectangle fold) | O | pass | pass | pass: crosshair | pass | pass | pass |
| Triangle (Rectangle fold) | none | pass (2026-11-20): no key in Figma's fold; the tooltip shows none | pass | pass: crosshair | pass | pass | pass |
| Polygon (Rectangle fold) | none | pass (2026-11-20): no key in Figma either; the tooltip shows none | pass | pass: crosshair | pass | pass | pass |
| Star (Rectangle fold) | none | pass (2026-11-20): no key in Figma either; the tooltip shows none | pass | pass: crosshair | pass | pass | pass |
| Text | T | pass | pass: a caret, typing writes | pass: text cursor | pass | pass | pass (2026-11-20): one undo takes the layer and its typing |
| Kinetic type (Text fold) | none | pass: armed from the fold, no key in Figma either | pass (2026-11-20): a press lands it 640 by 360, centred on the pointer | pass: crosshair | pass | pass | pass (2026-11-20): one undo |
| Hand (Hand fold) | H | pass (2026-11-20): H, as Figma; hide moved to ⇧⌘H, lock to ⇧⌘L (Figma's) | pass: pans | pass: grab | pass (2026-11-20) | pass: nothing made | pass: nothing made |
| Zoom (Hand fold) | Z | pass | pass (2026-11-20): a click 59 to 118 percent, Alt and a click back to 59 | pass: zoom-in, zoom-out with Alt | pass (2026-11-20) | pass: nothing made | pass: nothing made |
| Orbit (Hand fold) | C | pass: on a file with a 3D layer | pass (2026-11-20): greyed in the fold with no 3D layer, its reason in a tooltip; C does nothing there | pass: orbit cursor | pass (2026-11-20) | pass: nothing made | pass: nothing made |
| Insert image | ⇧⌘K | pass (2026-11-20): opens the file picker | pass: opens the file picker, the image lands as a rectangle with its image fill | pass: not a tool | pass | pass | pass |
| Crop image | none | pass: no key in Figma either | pass (2026-11-20): on an image fill, the crop handles and pan | pass: the handles' resize cursors, grab inside | pass: Escape leaves the crop | pass: the image stays selected | pass: one undo takes the crop back |


Keys: 53 printed editor shortcuts pressed once, a rectangle selected: 53 did their action.

## The behaviour set (T5)

One set, each line with its source; where a place breaks it, the place is named. Written to be carried into
[[../../documentation/04-compositions/26-kolbox-system|Kolbox system]] by T5.

| Area | The behaviour | Source | Places that break it |
|---|---|---|---|
| Window | Opens beside what called it: a window that edits the selection docks at the rail's left edge, its top on the calling row | S11.1, S11.3 | Export, the generator families and Color Modes (880 wide, centred); Settings, Media and the search modal are dialogs, centred as Figma's |
| Window | Closes by its close and by Escape | Figma, S7.1 | none: every window measured has a close (the search modal's is "Esc Close") and closes on Escape |
| Window | A press on the canvas does not close it; the canvas stays live under it | S7.1 | none since 2026-11-20 (a press on the empty canvas is spent, a press on a layer selects it); Settings, Media and the search modal close on an outside press as Figma's dialogs (decided for review: dialogs keep it) |
| Field | One click selects the whole value | S5.1 | none since 2026-11-20 |
| Field | Enter commits | Figma | none measured |
| Field | Escape restores the value from before the edit | Figma | none since 2026-11-20 (7 of 7 measured) |
| Field | Arrow steps 1, Shift and an arrow 10 | Figma | none since 2026-11-20 (6 of 6 numbers step 1 and 10; the hex does not step) |
| Field | Differing values read "Mixed"; an edit applies to all | S10.3 | none measured |
| Menu | Opens with no row lit; the accent follows the pointer or the keys; the current choice carries a check, no fill | S2.2 | none since 2026-11-20 |
| Menu | Typing a letter moves to the first row starting with it | plan T5, Figma | none on 2026-11-20 (the main menu's E lights Edit) |
| Menu | Escape closes | Figma | none |
| Menu | A row that does not apply is greyed, no tooltip, as Figma's menu rows | Figma (decided for review) | holds; it is why most "disabled, no reason" rows are menu rows |
| Tooltip | Every icon-only button shows its name, and its key where it has one | Figma (read 2026-11-19: "Rectangle R", "Hide") | 6 of 212 on 2026-11-20, all in other files: Home's Account and Main menu, Library's and the Randomiser's Main menu, Morph's ? and Sync loop |
| Right-click | On the canvas and on a Layers row, the same rows; the Layers row adds Rename | Figma (read 2026-11-19) | none since 2026-11-20 (18 and 19 rows, the one apart Rename) |
| Right-click | On a page: Copy link, Rename, Duplicate, Move down, Move to bottom, Delete | Figma (read 2026-11-19) | ours has Copy link to page, Rename, Duplicate, Move up, Move down, Delete since 2026-11-20; the two moves greyed (no page order write in the engine yet) |
| Undo | Every edit is one undo step | plan T5 | the Text tool (2), Kinetic type (more than 6); every effect passes |

## What the code says that the screen cannot

| Mark | Count | Where |
|---|---|---|
| `noop` presses in the inspector | 22 | `editor/Properties.jsx` (Fill and Stroke Styles, Add stroke once stroked, Stroke position, Individual sides, and the conditional mask, nodes, lock and radius writes), `properties/Sections.jsx` (Create component, and every section's defaults, which the frame inherits: finding 1), `properties/Canvas.jsx` (Hide page color, Add style, Fill and Stroke Styles, Add stroke, Add effect), `properties/Typography.jsx` (Styles) |
| "Not wired" marks | 19 in 9 files | `ui/HomeRail.jsx` 4, `pages/Home.jsx` 2 (both apps/editor), `labs/Kinetic.jsx` 3, `ui/PopoverStroke.jsx` 2, `editor/properties/Typography.jsx` 2, `editor/windows/WindowMediaPicker.jsx` 2, `ui/PopoverEffect.jsx` 1, `ui/PopoverEffects.jsx` 1, `search/ModalSearchHost.jsx` 1 (Insert image and Eyedropper, both of which the editor has) |
| Controls disabled outright | 13 | Home: Community, All folders, Resources, Trash, Admin (the `PLACES` rows), Share, Adjust, Star, the title's menu; the stroke window's width profile, flip and miter; the media picker's Display settings and Filter (13 sites; some draw more than once) |

The plan's first count (about 40 marks in 10 files, 17 empty actions, 24 disabled) was read loosely; these are the
counts in the source on 2026-11-19.

## Recommendations

The fixes are phases T3 to T6 of `plan-2026-11-19-kolbox-whats-left`, one per cause, in three file groups that share no file:

| Group | Phases |
|---|---|
| (a) Home, Library and search | T3.1 Home's places from the local library; T3.2 the search modal's two rows |
| (b) the Editor's inspector, the windows' fields, menus and the behaviour set | T4.1 the frame's inspector; T4.2 the empty actions; T4.3 Share and the zoom off the editor; T4.4 the colour window and the eyedropper; T5.1 fields; T5.2 menus; T5.3 windows on a canvas press; T5.4 tooltips; T5.5 right-click |
| (c) effects, tools, the generator, the stroke and media windows, Labs, Morph, Randomiser | T4.5 the windows' own marks; T6.1 the generator's window; T6.2 Motion's labels; T6.3 the tools; T6.4 Crop; T6.5 the Camera |

## Scope

All eight screens of `pnpm editor` with Settings, Display, Style set to Kolbox: Home, Library, Editor (nothing
selected, a rectangle, a text layer, a frame, two rectangles), Labs, Morph, Randomiser, the Settings window, the
search modal, and the Media window they all share. Every menu, submenu and window was opened once, to four levels
deep (the frame and two-selected states to two). The selected states count the right rail and what it opens; the
rest of the editor counts once, under Editor. A window reached from several screens is counted once.

Not covered: touch and the phone layout; Firefox (his browser); light mode; drag and drop beyond the tools; the
outline export's type features (T1.1) and the many-selected Effects section (T1.2), which another agent was building
during this run.

## How the expectation was set

His rulings first (plan sections R and S, [[../../documentation/04-compositions/26-kolbox-system|Kolbox system]]),
then Figma's own editor, read in Chrome on 2026-11-19 in his kolbox file (look only: a layer selected, the canvas,
Layers and Pages right-click menus, the main and file menus, a field's first click, a tool's and an icon's tooltip)
and his file browser. A menu row's expectation is its own label, as Figma's same row.

Scripts and shots: `_tmp/2026-11-19-audit/` (`crawl.mjs`, `fx.mjs`, `beh.mjs`, `tips.mjs`, `keys.mjs`, the raw rows
as `rows-*.jsonl`).

## Every control, by screen


### Home

| Control | Where | Should do | Source | State | Note |
|---|---|---|---|---|---|
| Notifications | left rail | needs a server: dimmed with its reason | T3, decided for his review | disabled, reason shown | tooltip: Needs an account server |
| Search | left rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Recents | left rail | lists those files | Figma (file browser) | works | already the current choice |
| Drafts | left rail | lists those files | Figma (file browser) | works |  |
| Trash | left rail | lists deleted files to restore | Figma (file browser), T3 | works | fixed 2026-11-20 (T3.1) |
| All folders | left rail | needs a server: dimmed with its reason | T3, decided for his review | works | fixed 2026-11-20 (T3.1) |
| Resources | left rail | needs a server: dimmed with its reason | T3, decided for his review | disabled, reason shown | tooltip: Needs an account server |
| Admin | left rail | needs a server: dimmed with its reason | T3, decided for his review | disabled, reason shown | tooltip: Needs an account server |
| Starred | left rail | stars the file; Starred lists it | Figma (file browser), T3 | works | fixed 2026-11-20 (T3.1) |
| Folders | left rail | does what its label says | Figma's same control | works |  |
| New folder | left rail | does what its label says | Figma's same control | works | opens New folder |
| Account | left rail | opens its menu | Figma | works | opens Account |
| Not signed in | left rail | does what its label says | Figma's same control | works | opens Account |
| Share | right rail | shares the file (invite or link) | Figma (Share) | disabled, reason shown | tooltip: Needs an account server |
| Main menu | top | opens the one menu on the mark | his rulings (C3, kolbox system) | works | opens Main menu |
| Create | right rail | opens New file and Open file | C8 | works | opens Create |
| Adjust | right rail | does what its label says | Figma's same control | disabled, reason shown | tooltip: Needs an account server |
| Star | right rail | stars the file; Starred lists it | Figma (file browser), T3 | works | fixed 2026-11-20 (T3.1) |
| Recents menu | stage | does what its label says | Figma's same control | works | fixed 2026-11-20 (T3.1) |
| Type | right rail | opens its filter or sort menu | Figma (file browser) | works | opens Type |
| Sort | right rail | opens its filter or sort menu | Figma (file browser) | works | opens Sort |
| Grid view | right rail | switches the view | Figma (file browser) | works | already the current choice |
| List view | right rail | switches the view | Figma (file browser) | works |  |
| Download | stage | downloads the file | C8 | works |  |
| Star | stage | stars the file; Starred lists it | Figma (file browser), T3 | works | fixed 2026-11-20 (T3.1) |
| Settings | stage | opens the file details rail | C8 | works |  |
| Delete | stage | deletes after a confirm | Figma | works | opens Delete “Poster draft”? |
| Download | stage | downloads the file | C8 | works |  |
| Star | stage | stars the file; Starred lists it | Figma (file browser), T3 | works | fixed 2026-11-20 (T3.1) |
| Settings | stage | opens the file details rail | C8 | works |  |
| Delete | stage | deletes after a confirm | Figma | works | opens Delete “Flow study”? |
| Download | right rail | downloads the file | C8 | works |  |
| Star | right rail | stars the file; Starred lists it | Figma (file browser), T3 | works | fixed 2026-11-20 (T3.1) |
| Settings | right rail | opens the file details rail | C8 | works |  |
| Delete | right rail | deletes after a confirm | Figma | works | opens Delete “Type specimen”? |
| Star | stage | stars the file; Starred lists it | Figma (file browser), T3 | works | fixed 2026-11-20 (T3.1) |
| Download | stage | downloads the file | C8 | works |  |
| Settings | stage | opens the file details rail | C8 | works |  |
| Delete | stage | deletes after a confirm | Figma | works | opens Delete “Pattern tile”? |
| Download | stage | downloads the file | C8 | works |  |
| Star | stage | stars the file; Starred lists it | Figma (file browser), T3 | works | fixed 2026-11-20 (T3.1) |
| Settings | stage | opens the file details rail | C8 | works |  |
| Delete | stage | deletes after a confirm | Figma | works | opens Delete “Morph study”? |
| Download | right rail | downloads the file | C8 | works |  |
| Star | right rail | stars the file; Starred lists it | Figma (file browser), T3 | works | fixed 2026-11-20 (T3.1) |
| Settings | right rail | opens the file details rail | C8 | works |  |
| Delete | right rail | deletes after a confirm | Figma | works | opens Delete “Launch card”? |
| Star | stage | stars the file; Starred lists it | Figma (file browser), T3 | works | fixed 2026-11-20 (T3.1) |
| Download | stage | downloads the file | C8 | works |  |
| Download | stage | downloads the file | C8 | works |  |
| Star | stage | stars the file; Starred lists it | Figma (file browser), T3 | works | fixed 2026-11-20 (T3.1) |
| Star | right rail | stars the file; Starred lists it | Figma (file browser), T3 | works | fixed 2026-11-20 (T3.1) |
| Download | right rail | downloads the file | C8 | works |  |
| Close | dialog New folder | closes the window | Figma, T5 | works |  |
| New folder | dialog New folder | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Cancel | dialog New folder | closes the window | Figma, T5 | works |  |
| Create | dialog New folder | opens New file and Open file | C8 | works |  |
| Not signed in | menu Account | runs “Not signed in” | the row label; Figma's same row | works | fixed 2026-11-20 (T3.1) |
| Sign in… | menu Account | runs “Sign in…” | the row label; Figma's same row | works | opens Sign in |
| Actions… K | menu Main menu | runs “Actions…” | the row label; Figma's same row | works | opens Search |
| Chromes | menu Main menu | opens its submenu | Figma (menus) | works | opens Chromes |
| Home | menu Main menu | runs “Home” | the row label; Figma's same row | works |  |
| Dev | menu Main menu | runs “Dev” | the row label; Figma's same row | works |  |
| Media | menu Main menu | runs “Media” | the row label; Figma's same row | works | opens Media |
| Sign in | menu Main menu | runs “Sign in” | the row label; Figma's same row | works | opens Sign in |
| Settings… , | menu Main menu | runs “Settings…” | the row label; Figma's same row | works | opens Settings |
| New file | menu Create | runs “New file” | the row label; Figma's same row | works |  |
| Open file… | menu Create | runs “Open file…” | the row label; Figma's same row | works |  |
| All types | menu Type | runs “All types” | the row label; Figma's same row | works |  |
| Editor | menu Type | runs “Editor” | the row label; Figma's same row | works |  |
| Labs | menu Type | runs “Labs” | the row label; Figma's same row | works |  |
| Morph | menu Type | runs “Morph” | the row label; Figma's same row | works |  |
| Last modified | menu Sort | runs “Last modified” | the row label; Figma's same row | works |  |
| Created | menu Sort | runs “Created” | the row label; Figma's same row | works |  |
| Name | menu Sort | runs “Name” | the row label; Figma's same row | works |  |
| Close | dialog Delete “Poster draft”? | closes the window | Figma, T5 | works |  |
| Cancel | dialog Delete “Poster draft”? | closes the window | Figma, T5 | works |  |
| Delete | dialog Delete “Poster draft”? | deletes after a confirm | Figma | works |  |
| Close | dialog Sign in | closes the window | Figma, T5 | works |  |
| OK | dialog Sign in | does what its label says | Figma's same control | works |  |
| Home | menu Chromes | runs “Home” | the row label; Figma's same row | works |  |
| Library | menu Chromes | runs “Library” | the row label; Figma's same row | works |  |
| Editor | menu Chromes | runs “Editor” | the row label; Figma's same row | works |  |
| Labs | menu Chromes | runs “Labs” | the row label; Figma's same row | works |  |
| Randomiser | menu Chromes | runs “Randomiser” | the row label; Figma's same row | works |  |
| Morph | menu Chromes | runs “Morph” | the row label; Figma's same row | works |  |
| Community | left rail | needs a server: dimmed with its reason | T3, decided for his review | disabled, reason shown | tooltip: Needs an account server |

### Library

| Control | Where | Should do | Source | State | Note |
|---|---|---|---|---|---|
| MORPH | right rail | shows MORPH | Figma (tabs) | works |  |
| Toggle filters | left rail | does what its label says | Figma's same control | works |  |
| Search | left rail | filters as typed | Figma | works |  |
| Grid view | right rail | switches the view | Figma (file browser) | works | already the current choice |
| Star | stage | stars the file; Starred lists it | Figma (file browser), T3 | disabled, reason shown | tooltip: Not wired |
| Download | stage | downloads the file | C8 | works |  |
| List view | right rail | switches the view | Figma (file browser) | works |  |
| Settings | stage | opens the file details rail | C8 | works |  |
| Delete | stage | deletes after a confirm | Figma | works | opens Delete “Circle morph”? |
| Download | stage | downloads the file | C8 | works |  |
| Settings | stage | opens the file details rail | C8 | works |  |
| Delete | stage | deletes after a confirm | Figma | works | opens Delete “Circle morph ember”? |
| Star | right rail | stars the file; Starred lists it | Figma (file browser), T3 | disabled, reason shown | tooltip: Not wired |
| Download | right rail | downloads the file | C8 | works |  |
| Settings | right rail | opens the file details rail | C8 | works |  |
| Delete | right rail | deletes after a confirm | Figma | works | opens Delete “Square ↔ circle”? |
| Star | stage | stars the file; Starred lists it | Figma (file browser), T3 | disabled, reason shown | tooltip: Not wired |
| Delete | stage | deletes after a confirm | Figma | works | opens Delete “Star morph”? |
| Download | stage | downloads the file | C8 | works |  |
| Star | stage | stars the file; Starred lists it | Figma (file browser), T3 | disabled, reason shown | tooltip: Not wired |
| Settings | stage | opens the file details rail | C8 | works |  |
| Star | right rail | stars the file; Starred lists it | Figma (file browser), T3 | disabled, reason shown | tooltip: Not wired |
| Download | right rail | downloads the file | C8 | works |  |
| Delete | stage | deletes after a confirm | Figma | works | opens Delete “Heptagram”? |
| Download | bottom | downloads the file | C8 | works |  |
| Star | bottom | stars the file; Starred lists it | Figma (file browser), T3 | disabled, reason shown | tooltip: Not wired |
| Delete | right rail | deletes after a confirm | Figma | works | opens Delete “Blob”? |
| Download | bottom | downloads the file | C8 | works |  |
| Star | bottom | stars the file; Starred lists it | Figma (file browser), T3 | disabled, reason shown | tooltip: Not wired |
| Star | right rail | stars the file; Starred lists it | Figma (file browser), T3 | disabled, reason shown | tooltip: Not wired |
| Download | right rail | downloads the file | C8 | works |  |
| Actions… K | menu Main menu | runs “Actions…” | the row label; Figma's same row | works | opens Search |
| Chromes | menu Main menu | opens its submenu | Figma (menus) | works | opens Chromes |
| Home | menu Main menu | runs “Home” | the row label; Figma's same row | works |  |
| Dev | menu Main menu | runs “Dev” | the row label; Figma's same row | works |  |
| Sign in | menu Main menu | runs “Sign in” | the row label; Figma's same row | works | opens Sign in |
| Settings… , | menu Main menu | runs “Settings…” | the row label; Figma's same row | works | opens Settings |
| Close | dialog Delete “Circle morph”? | closes the window | Figma, T5 | works |  |
| Cancel | dialog Delete “Circle morph”? | closes the window | Figma, T5 | works |  |
| Delete | dialog Delete “Circle morph ember”? | deletes after a confirm | Figma | works |  |
| Home | menu Chromes | runs “Home” | the row label; Figma's same row | works |  |
| Library | menu Chromes | runs “Library” | the row label; Figma's same row | works |  |
| Editor | menu Chromes | runs “Editor” | the row label; Figma's same row | works |  |
| Randomiser | menu Chromes | runs “Randomiser” | the row label; Figma's same row | works |  |
| Morph | menu Chromes | runs “Morph” | the row label; Figma's same row | works |  |
| OK | dialog Sign in | does what its label says | Figma's same control | works |  |
| EDITOR | stage | shows EDITOR | Figma (tabs) | works |  |
| Main menu | left rail | opens the one menu on the mark | his rulings (C3, kolbox system) | works |  |
| LABS | right rail | shows LABS | Figma (tabs) | works |  |
| RANDOMISER | right rail | shows RANDOMISER | Figma (tabs) | works |  |
| Star | stage | stars the file; Starred lists it | Figma (file browser), T3 | disabled, reason shown | tooltip: Not wired |
| Download | stage | downloads the file | C8 | works |  |
| Settings | stage | opens the file details rail | C8 | works |  |
| Settings | right rail | opens the file details rail | C8 | works |  |
| Media | menu Main menu | runs “Media” | the row label; Figma's same row | works |  |
| Labs | menu Chromes | runs “Labs” | the row label; Figma's same row | works |  |
| Close | dialog Sign in | closes the window | Figma, T5 | works |  |

### Editor

| Control | Where | Should do | Source | State | Note |
|---|---|---|---|---|---|
| Editor | top rail | shows Editor | Figma (tabs) | works | already the current choice |
| Main menu | top rail | opens the one menu on the mark | his rulings (C3, kolbox system) | works | opens Main menu |
| Labs | top rail | shows Labs | Figma (tabs) | works |  |
| Untitled | top rail | opens its menu | Figma | works | opens File |
| Morph | top rail | shows Morph | Figma (tabs) | works |  |
| Preview | top rail | shows the work without chrome | Figma (Present) | works |  |
| Share | top rail | shares the file (invite or link) | Figma (Share) | disabled, reason shown | tooltip: Needs an account server; re-checked 2026-11-20 |
| Export | top rail | opens the Export window | C8 | works | opens Export |
| Zoom | top rail | opens the zoom menu | Figma (zoom menu) | works | opens Zoom |
| Untitled | left rail | does what its label says | Figma's same control | works | opens File |
| File menu | left rail | does what its label says | Figma's same control | works | opens File |
| Collapse | left rail | hides or shows the rail | Figma (UI toggle) | works | opens float |
| Add page | left rail | adds a page | kolbox system (Pages) | works |  |
| Collapse all | left rail | collapses every open layer group | Figma (Layers) | works | no layer groups open on a new file |
| Select | dock | arms the tool or opens its fold | S2, Figma (dock) | works | already the current choice |
| Select variants | dock | arms the tool or opens its fold | S2, Figma (dock) | works | opens Tool variants |
| Frame | dock | arms the tool or opens its fold | S2, Figma (dock) | works |  |
| Pen | dock | arms the tool or opens its fold | S2, Figma (dock) | works |  |
| Pen variants | dock | arms the tool or opens its fold | S2, Figma (dock) | works | opens Tool variants |
| Rectangle | dock | arms the tool or opens its fold | S2, Figma (dock) | works |  |
| Rectangle variants | dock | arms the tool or opens its fold | S2, Figma (dock) | works | opens Tool variants |
| Text | dock | arms the tool or opens its fold | S2, Figma (dock) | works |  |
| Text variants | dock | arms the tool or opens its fold | S2, Figma (dock) | works | opens Tool variants |
| Hand | dock | arms the tool or opens its fold | S2, Figma (dock) | works |  |
| Hand variants | dock | arms the tool or opens its fold | S2, Figma (dock) | works | opens Tool variants |
| Insert image | dock | arms the tool or opens its fold | S2, Figma (dock) | works |  |
| Crop image | dock | arms the tool or opens its fold | S2, Figma (dock) | disabled, reason shown | tooltip: Crop image |
| Page: #393939 | right rail | does what its label says | Figma's same control | works | opens Color |
| Page hex | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Hide page color | right rail | hides the page color | Figma (page fill eye) | works | re-checked 2026-11-20 |
| Add style | right rail | opens the styles of that kind to apply one | Figma (Styles) | disabled, reason shown | tooltip: No styles yet; re-checked 2026-11-20 |
| Add export | right rail | adds an export setting row | Figma (Export +) | works |  |
| Actions… K | menu Main menu | runs “Actions…” | the row label; Figma's same row | works | opens Search |
| File | menu Main menu | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Edit | menu Main menu | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Layer | menu Main menu | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Text | menu Main menu | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Vector | menu Main menu | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Tools | menu Main menu | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| View | menu Main menu | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Help | menu Main menu | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Window | menu Main menu | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Home | menu Main menu | runs “Home” | the row label; Figma's same row | works |  |
| Chromes | menu Main menu | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Dev | menu Main menu | runs “Dev” | the row label; Figma's same row | works |  |
| Media | menu Main menu | runs “Media” | the row label; Figma's same row | works | opens Media |
| Sign in | menu Main menu | runs “Sign in” | the row label; Figma's same row | works | opens Sign in |
| Settings… , | menu Main menu | runs “Settings…” | the row label; Figma's same row | works | opens Display settings |
| Save… S | menu File | runs “Save…” | the row label; Figma's same row | works | opens Save as |
| Save as… ⇧ | menu File | runs “Save as…” | the row label; Figma's same row | works | opens Save as |
| Rename… | menu File | runs “Rename…” | the row label; Figma's same row | disabled, no reason |  |
| Duplicate | menu File | runs “Duplicate” | the row label; Figma's same row | disabled, no reason |  |
| Open file… | menu File | runs “Open file…” | the row label; Figma's same row | works |  |
| Export as file… | menu File | runs “Export as file…” | the row label; Figma's same row | works |  |
| Files… O | menu File | runs “Files…” | the row label; Figma's same row | works | opens dialog |
| Close | dialog Export | closes the window | Figma, T5 | works |  |
| Content | dialog Export | opens its menu | Figma | works | opens Content |
| File name | dialog Export | one click selects the value, Enter commits | S5.1, Figma | works |  |
| PNG | dialog Export | shows PNG | Figma (tabs) | works | already the current choice |
| SVG | dialog Export | shows SVG | Figma (tabs) | works |  |
| Scale | dialog Export | opens its menu | Figma | works | opens Scale |
| Reset | dialog Export | does what its label says | Figma's same control | works | nothing changed yet: nothing to reset |
| Export | dialog Export | opens the Export window | C8 | disabled, reason shown | tooltip: Nothing to export: draw a frame or add a layer first.; re-checked 2026-11-20 |
| Cancel | dialog Export | closes the window | Figma, T5 | works |  |
| Zoom | menu Zoom | runs “Zoom” | the row label; Figma's same row | works |  |
| Zoom in + | menu Zoom | runs “Zoom in” | the row label; Figma's same row | works |  |
| Zoom out − | menu Zoom | runs “Zoom out” | the row label; Figma's same row | works |  |
| Zoom to fit 0 | menu Zoom | runs “Zoom to fit” | the row label; Figma's same row | works |  |
| Zoom to 50% | menu Zoom | runs “Zoom to 50%” | the row label; Figma's same row | works |  |
| Zoom to 100% 1 | menu Zoom | runs “Zoom to 100%” | the row label; Figma's same row | works |  |
| Expand | dock | arms the tool or opens its fold | S2, Figma (dock) | works |  |
| Select V | menu Tool variants | runs “Select” | the row label; Figma's same row | works |  |
| Node select A | menu Tool variants | runs “Node select” | the row label; Figma's same row | works |  |
| Pen P | menu Tool variants | runs “Pen” | the row label; Figma's same row | works |  |
| Line | menu Tool variants | runs “Line” | the row label; Figma's same row | works | opens float |
| Rectangle R | menu Tool variants | runs “Rectangle” | the row label; Figma's same row | works |  |
| Ellipse O | menu Tool variants | runs “Ellipse” | the row label; Figma's same row | works | opens float |
| Triangle | menu Tool variants | runs “Triangle” | the row label; Figma's same row | works | opens float |
| Polygon | menu Tool variants | runs “Polygon” | the row label; Figma's same row | works | opens float |
| Star | menu Tool variants | runs “Star” | the row label; Figma's same row | works | opens float |
| Text T | menu Tool variants | runs “Text” | the row label; Figma's same row | works |  |
| Kinetic type | menu Tool variants | runs “Kinetic type” | the row label; Figma's same row | works |  |
| Hand | menu Tool variants | runs “Hand” | the row label; Figma's same row | works |  |
| Zoom Z | menu Tool variants | runs “Zoom” | the row label; Figma's same row | works | opens float |
| Orbit C | menu Tool variants | runs “Orbit” | the row label; Figma's same row | works | opens float |
| Custom | dialog Color | shows Custom | Figma (tabs) | works | already the current choice |
| Libraries | dialog Color | shows Libraries | Figma (tabs) | works |  |
| Close | dialog Color | closes the window | Figma, T5 | works |  |
| Solid | dialog Color | does what its label says | Figma's same control | works |  |
| Gradient | dialog Color | does what its label says | Figma's same control | works |  |
| Pattern | dialog Color | does what its label says | Figma's same control | works |  |
| Video | dialog Color | does what its label says | Figma's same control | works |  |
| Saturation and brightness | dialog Color | does what its label says | Figma's same control | works |  |
| Eyedropper | dialog Color | does what its label says | Figma's same control | works | the stage takes the pipette cursor while the pick is armed and drops it on Escape (read on the stage's style); re-checked 2026-11-20 |
| Hue | dialog Color | does what its label says | Figma's same control | works | re-checked 2026-11-20 |
| Opacity | dialog Color | does what its label says | Figma's same control | works |  |
| Hex | dialog Color | opens its menu | Figma | works | opens menu |
| Hex | dialog Color | one click selects the value, Enter commits | S5.1, Figma | works |  |
| #1D2021 | listbox Swatches | runs or opens what the row names | C5 (search modal) | works |  |
| #282828 | listbox Swatches | runs or opens what the row names | C5 (search modal) | works |  |
| #393939 | listbox Swatches | runs or opens what the row names | C5 (search modal) | works |  |
| #4A4A4A | listbox Swatches | runs or opens what the row names | C5 (search modal) | works |  |
| #5C5C5C | listbox Swatches | runs or opens what the row names | C5 (search modal) | works |  |
| #FFFFFF | listbox Swatches | runs or opens what the row names | C5 (search modal) | works |  |
| #B2B2B2 | listbox Swatches | runs or opens what the row names | C5 (search modal) | works |  |
| #FABD2F | listbox Swatches | runs or opens what the row names | C5 (search modal) | works |  |
| #83A598 | listbox Swatches | runs or opens what the row names | C5 (search modal) | works |  |
| #B8BB26 | listbox Swatches | runs or opens what the row names | C5 (search modal) | works |  |
| #FB4934 | listbox Swatches | runs or opens what the row names | C5 (search modal) | works |  |
| kol-swatch-grid-cell | listbox Swatches | runs or opens what the row names | C5 (search modal) | works |  |
| New | menu File | runs “New” | the row label; Figma's same row | works |  |
| Files… O | menu File | runs “Files…” | the row label; Figma's same row | works | opens dialog |
| Starters | menu File | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Save… S | menu File | runs “Save…” | the row label; Figma's same row | works | opens Save as |
| Save as… ⇧ | menu File | runs “Save as…” | the row label; Figma's same row | works | opens Save as |
| Open file… | menu File | runs “Open file…” | the row label; Figma's same row | works |  |
| Export as file… | menu File | runs “Export as file…” | the row label; Figma's same row | works |  |
| Aspect | menu File | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Clear | menu File | runs “Clear” | the row label; Figma's same row | disabled, no reason |  |
| Library | menu File | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Export… | menu File | runs “Export…” | the row label; Figma's same row | works | opens Export |
| Batch export… | menu File | runs “Batch export…” | the row label; Figma's same row | works | opens Batch export |
| Open output window | menu File | runs “Open output window” | the row label; Figma's same row | works |  |
| Undo Z | menu Edit | runs “Undo” | the row label; Figma's same row | disabled, no reason |  |
| Redo ⇧ | menu Edit | runs “Redo” | the row label; Figma's same row | disabled, no reason |  |
| Duplicate selection D | menu Edit | runs “Duplicate selection” | the row label; Figma's same row | disabled, no reason |  |
| Delete selection ⌫ | menu Edit | runs “Delete selection” | the row label; Figma's same row | disabled, no reason |  |
| Select all layers A | menu Edit | runs “Select all layers” | the row label; Figma's same row | disabled, no reason |  |
| Deselect Esc | menu Edit | runs “Deselect Esc” | the row label; Figma's same row | disabled, no reason |  |
| Eyedropper I | menu Edit | runs “Eyedropper” | the row label; Figma's same row | works |  |
| Color | menu Edit | runs “Color” | the row label; Figma's same row | works | opens Color |
| Color Modes | menu Edit | runs “Color Modes” | the row label; Figma's same row | works | opens Color Modes |
| Insert | menu Layer | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Duplicate | menu Layer | runs “Duplicate” | the row label; Figma's same row | disabled, no reason |  |
| Delete | menu Layer | runs “Delete” | the row label; Figma's same row | disabled, no reason |  |
| Group selection G | menu Layer | runs “Group selection” | the row label; Figma's same row | disabled, no reason |  |
| Ungroup ⇧ | menu Layer | runs “Ungroup” | the row label; Figma's same row | disabled, no reason |  |
| Align | menu Layer | opens its submenu | Figma (menus) | disabled, no reason |  |
| Flip horizontal ⇧ | menu Layer | runs “Flip horizontal” | the row label; Figma's same row | disabled, no reason |  |
| Flip vertical ⇧ | menu Layer | runs “Flip vertical” | the row label; Figma's same row | disabled, no reason |  |
| Rotate | menu Layer | opens its submenu | Figma (menus) | disabled, no reason |  |
| Skew horizontal… | menu Layer | runs “Skew horizontal…” | the row label; Figma's same row | disabled, no reason |  |
| Skew vertical… | menu Layer | runs “Skew vertical…” | the row label; Figma's same row | disabled, no reason |  |
| Corner radius… | menu Layer | runs “Corner radius…” | the row label; Figma's same row | disabled, no reason |  |
| Transform origin | menu Layer | opens its submenu | Figma (menus) | disabled, no reason |  |
| Constrain proportions | menu Layer | runs “Constrain proportions” | the row label; Figma's same row | disabled, no reason |  |
| Adjustment | menu Layer | opens its submenu | Figma (menus) | disabled, no reason |  |
| Live Filters | menu Layer | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Layer Effects… | menu Layer | runs “Layer Effects…” | the row label; Figma's same row | disabled, no reason |  |
| Use as mask | menu Layer | runs “Use as mask” | the row label; Figma's same row | disabled, no reason |  |
| Mask layer | menu Layer | runs “Mask layer” | the row label; Figma's same row | disabled, no reason |  |
| Toggle lock L | menu Layer | runs “Toggle lock” | the row label; Figma's same row | disabled, no reason |  |
| Toggle visibility H | menu Layer | runs “Toggle visibility” | the row label; Figma's same row | disabled, no reason |  |
| Alignment | menu Text | opens its submenu | Figma (menus) | disabled, no reason |  |
| Vertical alignment | menu Text | opens its submenu | Figma (menus) | disabled, no reason |  |
| Case | menu Text | opens its submenu | Figma (menus) | disabled, no reason |  |
| Italic | menu Text | runs “Italic” | the row label; Figma's same row | disabled, no reason |  |
| Convert to path | menu Text | runs “Convert to path” | the row label; Figma's same row | disabled, no reason |  |
| Unite | menu Vector | runs “Unite” | the row label; Figma's same row | disabled, no reason |  |
| Subtract | menu Vector | runs “Subtract” | the row label; Figma's same row | disabled, no reason |  |
| Exclude | menu Vector | runs “Exclude” | the row label; Figma's same row | disabled, no reason |  |
| Intersect | menu Vector | runs “Intersect” | the row label; Figma's same row | disabled, no reason |  |
| Edit nodes A | menu Vector | runs “Edit nodes” | the row label; Figma's same row | disabled, no reason |  |
| Release boolean | menu Vector | runs “Release boolean” | the row label; Figma's same row | disabled, no reason |  |
| Shape parameters… | menu Vector | runs “Shape parameters…” | the row label; Figma's same row | disabled, no reason |  |
| Convert to path ⇧ | menu Vector | runs “Convert to path” | the row label; Figma's same row | disabled, no reason |  |
| Blend… | menu Vector | runs “Blend…” | the row label; Figma's same row | disabled, no reason |  |
| Generate… | menu Tools | runs “Generate…” | the row label; Figma's same row | works | opens Stripe Array |
| Repeat… | menu Tools | runs “Repeat…” | the row label; Figma's same row | works | opens Repeat |
| Paratype letter… | menu Tools | runs “Paratype letter…” | the row label; Figma's same row | works | opens Paratype letter |
| Pattern | menu Tools | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Generative | menu Tools | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Color Modes | menu Tools | runs “Color Modes” | the row label; Figma's same row | works | opens Color Modes |
| Type | menu Tools | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Insert image | menu Tools | runs “Insert image” | the row label; Figma's same row | works |  |
| Search… K | menu Tools | runs “Search…” | the row label; Figma's same row | works | opens Search |
| Swap fill and stroke | menu Tools | runs “Swap fill and stroke” | the row label; Figma's same row | works |  |
| Set paint to none | menu Tools | runs “Set paint to none” | the row label; Figma's same row | works |  |
| Fill and stroke color… | menu Tools | runs “Fill and stroke color…” | the row label; Figma's same row | works | opens Color |
| Zoom | menu View | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Preview mode W | menu View | runs “Preview mode” | the row label; Figma's same row | works |  |
| Show / hide rulers ⇧ | menu View | runs “Show / hide rulers” | the row label; Figma's same row | works |  |
| Show/hide grid G | menu View | runs “Show/hide grid” | the row label; Figma's same row | works |  |
| Show / hide modulation dots M | menu View | runs “Show / hide modulation dots” | the row label; Figma's same row | works |  |
| Snap to objects, guides and canvas | menu View | runs “Snap to objects, guides and canvas” | the row label; Figma's same row | works |  |
| Layout | menu View | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Show / hide shortcuts S | menu Help | runs “Show / hide shortcuts” | the row label; Figma's same row | works | opens listbox |
| Left rail | menu Window | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Right rail | menu Window | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Timeline | menu Window | runs “Timeline” | the row label; Figma's same row | works |  |
| Workspace | menu Window | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Show / hide rail \ | menu Window | runs “Show / hide rail” | the row label; Figma's same row | works | opens float |
| Show / hide settings , | menu Window | runs “Show / hide settings” | the row label; Figma's same row | works | opens Display settings |
| Home | menu Chromes | runs “Home” | the row label; Figma's same row | works |  |
| Library | menu Chromes | runs “Library” | the row label; Figma's same row | works |  |
| Editor | menu Chromes | runs “Editor” | the row label; Figma's same row | works |  |
| Labs | menu Chromes | runs “Labs” | the row label; Figma's same row | works |  |
| Randomiser | menu Chromes | runs “Randomiser” | the row label; Figma's same row | works |  |
| Morph | menu Chromes | runs “Morph” | the row label; Figma's same row | works |  |
| Close | dialog Sign in | closes the window | Figma, T5 | works |  |
| OK | dialog Sign in | does what its label says | Figma's same control | works |  |
| Close | dialog Save as | closes the window | Figma, T5 | works |  |
| Name | dialog Save as | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Location | dialog Save as | opens its menu | Figma | works | opens Location |
| Theme | dialog Save as | turns the setting on or off | Figma | works |  |
| Media | dialog Save as | turns the setting on or off | Figma | works |  |
| Cancel | dialog Save as | closes the window | Figma, T5 | works |  |
| Save | dialog Save as | does what its label says | Figma's same control | works |  |
| Close | dialog dialog | closes the window | Figma, T5 | works |  |
| Files — back to the top | dialog dialog | does what its label says | Figma's same control | works |  |
| Files | dialog dialog | does what its label says | Figma's same control | works |  |
| Display settings | dialog dialog | does what its label says | Figma's same control | works | opens dialog |
| LIBRARY | dialog dialog | does what its label says | Figma's same control | works |  |
| PRESET | dialog dialog | does what its label says | Figma's same control | works | Copy path writes the clipboard, which the driver cannot read |
| Filter | dialog dialog | does what its label says | Figma's same control | works | opens Files |
| Search | dialog dialog | filters as typed | Figma | works | opens dialog |
| Columns | dialog dialog | does what its label says | Figma's same control | works | already the current choice |
| Rows | dialog dialog | does what its label says | Figma's same control | works |  |
| Grid | dialog dialog | does what its label says | Figma's same control | works | opens dialog |
| Import | dialog dialog | does what its label says | Figma's same control | works |  |
| Save current | dialog dialog | does what its label says | Figma's same control | disabled, reason shown | tooltip: Name it first; re-checked 2026-11-20 |
| Name | dialog dialog | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Open | dialog dialog | does what its label says | Figma's same control | disabled, reason shown | tooltip: Select a file first; re-checked 2026-11-20 |
| Page | menu Content | runs “Page” | the row label; Figma's same row | works |  |
| @0.5x | menu Scale | runs “@0.5x” | the row label; Figma's same row | works |  |
| @1x | menu Scale | runs “@1x” | the row label; Figma's same row | works |  |
| @2x | menu Scale | runs “@2x” | the row label; Figma's same row | works |  |
| @3x | menu Scale | runs “@3x” | the row label; Figma's same row | works |  |
| Line | dock | arms the tool or opens its fold | S2, Figma (dock) | works | already the current choice |
| @4x | menu Scale | runs “@4x” | the row label; Figma's same row | works |  |
| Ellipse | dock | arms the tool or opens its fold | S2, Figma (dock) | works | already the current choice |
| Triangle | dock | arms the tool or opens its fold | S2, Figma (dock) | works | already the current choice |
| Polygon | dock | arms the tool or opens its fold | S2, Figma (dock) | works | already the current choice |
| Star | dock | stars the file; Starred lists it | Figma (file browser), T3 | works | already the current choice |
| Zoom | dock | opens the zoom menu | Figma (zoom menu) | works | already the current choice |
| Orbit | dock | arms the tool or opens its fold | S2, Figma (dock) | works | already the current choice |
| Hex | menu menu | runs “Hex” | the row label; Figma's same row | works |  |
| RGB | menu menu | runs “RGB” | the row label; Figma's same row | works | opens Color |
| HSL | menu menu | runs “HSL” | the row label; Figma's same row | works | opens Color |
| HSB | menu menu | runs “HSB” | the row label; Figma's same row | works | opens Color |
| Close | dialog dialog | closes the window | Figma, T5 | works |  |
| Files — back to the top | dialog dialog | does what its label says | Figma's same control | works |  |
| Display settings | dialog dialog | does what its label says | Figma's same control | works |  |
| Files | dialog dialog | does what its label says | Figma's same control | works |  |
| PRESET | dialog dialog | does what its label says | Figma's same control | works | Copy path writes the clipboard, which the driver cannot read |
| LIBRARY | dialog dialog | does what its label says | Figma's same control | works |  |
| Filter | dialog dialog | does what its label says | Figma's same control | works |  |
| Search | dialog dialog | filters as typed | Figma | works |  |
| Columns | dialog dialog | does what its label says | Figma's same control | works | already the current choice |
| Rows | dialog dialog | does what its label says | Figma's same control | works |  |
| Grid | dialog dialog | does what its label says | Figma's same control | works |  |
| Import | dialog dialog | does what its label says | Figma's same control | works |  |
| Save current | dialog dialog | does what its label says | Figma's same control | disabled, reason shown | tooltip: Name it first; re-checked 2026-11-20 |
| Open | dialog dialog | does what its label says | Figma's same control | disabled, reason shown | tooltip: Select a file first; re-checked 2026-11-20 |
| Social square (1:1) | menu Starters | runs “Social square (1:1)” | the row label; Figma's same row | works |  |
| Social portrait (4:5) | menu Starters | runs “Social portrait (4:5)” | the row label; Figma's same row | works |  |
| Social story (9:16) | menu Starters | runs “Social story (9:16)” | the row label; Figma's same row | works |  |
| Compositor base | menu Starters | runs “Compositor base” | the row label; Figma's same row | works |  |
| Hero lockup | menu Starters | runs “Hero lockup” | the row label; Figma's same row | works |  |
| Close | dialog Save as | closes the window | Figma, T5 | works |  |
| Name | dialog Save as | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Location | dialog Save as | opens its menu | Figma | works |  |
| Media | dialog Save as | turns the setting on or off | Figma | works |  |
| Theme | dialog Save as | turns the setting on or off | Figma | works |  |
| Cancel | dialog Save as | closes the window | Figma, T5 | works |  |
| Save | dialog Save as | does what its label says | Figma's same control | works |  |
| 1:1 | menu Aspect | runs “1:1” | the row label; Figma's same row | works |  |
| 4:5 | menu Aspect | runs “4:5” | the row label; Figma's same row | works |  |
| 9:16 | menu Aspect | runs “9:16” | the row label; Figma's same row | works |  |
| 3:5 | menu Aspect | runs “3:5” | the row label; Figma's same row | works |  |
| 5:4 | menu Aspect | runs “5:4” | the row label; Figma's same row | works |  |
| 5:3 | menu Aspect | runs “5:3” | the row label; Figma's same row | works |  |
| Custom | menu Aspect | runs “Custom” | the row label; Figma's same row | works |  |
| 16:9 | menu Aspect | runs “16:9” | the row label; Figma's same row | works |  |
| Palettes 0 | menu Library | opens its submenu | Figma (menus) | disabled, no reason |  |
| Patterns 0 | menu Library | opens its submenu | Figma (menus) | disabled, no reason |  |
| Types 0 | menu Library | opens its submenu | Figma (menus) | disabled, no reason |  |
| Presets 0 | menu Library | opens its submenu | Figma (menus) | disabled, no reason |  |
| Close | dialog Export | closes the window | Figma, T5 | works |  |
| Content | dialog Export | opens its menu | Figma | works |  |
| File name | dialog Export | one click selects the value, Enter commits | S5.1, Figma | works |  |
| PNG | dialog Export | shows PNG | Figma (tabs) | works | already the current choice |
| SVG | dialog Export | shows SVG | Figma (tabs) | works |  |
| Scale | dialog Export | opens its menu | Figma | works |  |
| Export | dialog Export | opens the Export window | C8 | disabled, reason shown | tooltip: Nothing to export: draw a frame or add a layer first.; re-checked 2026-11-20 |
| Reset | dialog Export | does what its label says | Figma's same control | works | nothing changed yet: nothing to reset |
| Cancel | dialog Export | closes the window | Figma, T5 | works |  |
| Close | dialog Batch export | closes the window | Figma, T5 | works |  |
| 1:1 | dialog Batch export | turns the setting on or off | Figma | works |  |
| 4:5 | dialog Batch export | turns the setting on or off | Figma | works |  |
| 3:5 | dialog Batch export | turns the setting on or off | Figma | works |  |
| 9:16 | dialog Batch export | turns the setting on or off | Figma | works |  |
| 5:4 | dialog Batch export | turns the setting on or off | Figma | works |  |
| 5:3 | dialog Batch export | turns the setting on or off | Figma | works |  |
| 16:9 | dialog Batch export | turns the setting on or off | Figma | works |  |
| @1x | dialog Batch export | turns the setting on or off | Figma | works |  |
| @2x | dialog Batch export | turns the setting on or off | Figma | works |  |
| Export all | dialog Batch export | does what its label says | Figma's same control | works |  |
| @3x | dialog Batch export | turns the setting on or off | Figma | works |  |
| Close | dialog Color | closes the window | Figma, T5 | works |  |
| Fill | dialog Color | does what its label says | Figma's same control | works | already the current choice |
| Swap fill and stroke | dialog Color | does what its label says | Figma's same control | works |  |
| None | dialog Color | does what its label says | Figma's same control | works |  |
| Eyedropper | dialog Color | does what its label says | Figma's same control | not on the screen | Edit, Color is greyed with nothing selected (T4.4), so this door to the window is gone; re-checked 2026-11-20 |
| Color view | dialog Color | opens its menu | Figma | works |  |
| Hue | dialog Color | does what its label says | Figma's same control | not on the screen | Edit, Color is greyed with nothing selected (T4.4), so this door to the window is gone; re-checked 2026-11-20 |
| Saturation and brightness | dialog Color | does what its label says | Figma's same control | works |  |
| Close | dialog Color Modes | closes the window | Figma, T5 | works |  |
| Base Analogous, 5 colors | dialog Color Modes | shows Base Analogous, 5 colors | Figma (tabs) | works | already the current choice |
| Colors 5 colors | dialog Color Modes | shows Colors 5 colors | Figma (tabs) | works |  |
| Palettes 9 saved | dialog Color Modes | shows Palettes 9 saved | Figma (tabs) | works |  |
| Relationship | dialog Color Modes | opens its menu | Figma | works |  |
| Reset | dialog Color Modes | does what its label says | Figma's same control | works | nothing changed yet: nothing to reset |
| Roll | dialog Color Modes | does what its label says | Figma's same control | works |  |
| Cancel | dialog Color Modes | closes the window | Figma, T5 | works |  |
| None | menu Live Filters | runs “None” | the row label; Figma's same row | disabled, no reason |  |
| Apply to document | dialog Color Modes | does what its label says | Figma's same control | works |  |
| Misc | menu Insert | runs “Misc” | the row label; Figma's same row | works |  |
| Blur | menu Live Filters | opens its submenu | Figma (menus) | disabled, no reason |  |
| Sharpen | menu Live Filters | opens its submenu | Figma (menus) | disabled, no reason |  |
| Noise | menu Live Filters | opens its submenu | Figma (menus) | disabled, no reason |  |
| Distort | menu Live Filters | opens its submenu | Figma (menus) | disabled, no reason |  |
| Lighting | menu Live Filters | opens its submenu | Figma (menus) | disabled, no reason |  |
| Colors | menu Live Filters | opens its submenu | Figma (menus) | disabled, no reason |  |
| Halftone | menu Live Filters | opens its submenu | Figma (menus) | disabled, no reason |  |
| Scanline | menu Live Filters | opens its submenu | Figma (menus) | disabled, no reason |  |
| CRT | menu Live Filters | opens its submenu | Figma (menus) | disabled, no reason |  |
| Refraction | menu Live Filters | opens its submenu | Figma (menus) | disabled, no reason |  |
| Dither | menu Live Filters | opens its submenu | Figma (menus) | disabled, no reason |  |
| Stylize | menu Live Filters | opens its submenu | Figma (menus) | disabled, no reason |  |
| Post-processing | menu Live Filters | opens its submenu | Figma (menus) | disabled, no reason |  |
| Expand | dialog Stripe Array | does what its label says | Figma's same control | works |  |
| Style | dialog Stripe Array | opens its menu | Figma | works |  |
| Preset | dialog Stripe Array | opens its menu | Figma | works |  |
| Close | dialog Stripe Array | closes the window | Figma, T5 | works |  |
| Stripe Array 11 rows | dialog Stripe Array | shows Stripe Array 11 rows | Figma (tabs) | works | already the current choice |
| Randomness Off | dialog Stripe Array | shows Randomness Off | Figma (tabs) | works |  |
| Frame 128 px inset | dialog Stripe Array | shows Frame 128 px inset | Figma (tabs) | works |  |
| Rows | dialog Stripe Array | shows Rows | Figma (tabs) | works |  |
| Columns | dialog Stripe Array | shows Columns | Figma (tabs) | works |  |
| Count | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Count | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Angle | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Width value A | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Width curve | dialog Stripe Array | opens its menu | Figma | works |  |
| Width value B | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Gap value A | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Gap curve | dialog Stripe Array | opens its menu | Figma | works |  |
| Gap value B | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| End value A | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| End curve | dialog Stripe Array | opens its menu | Figma | works |  |
| End value B | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Advanced 8 more | dialog Stripe Array | does what its label says | Figma's same control | works |  |
| Live preview | dialog Stripe Array | turns the setting on or off | Figma | works |  |
| Reset | dialog Stripe Array | does what its label says | Figma's same control | works | nothing changed yet: nothing to reset |
| Randomise | dialog Stripe Array | does what its label says | Figma's same control | works |  |
| Expand | dialog Repeat | does what its label says | Figma's same control | disabled, reason shown | tooltip: Expand to editable paths |
| Cancel | dialog Stripe Array | closes the window | Figma, T5 | works |  |
| Apply | dialog Stripe Array | does what its label says | Figma's same control | works |  |
| Close | dialog Repeat | closes the window | Figma, T5 | works |  |
| Radial 8 copies | dialog Repeat | shows Radial 8 copies | Figma (tabs) | works |  |
| Radial | dialog Repeat | shows Radial | Figma (tabs) | works | already the current choice |
| Grid | dialog Repeat | shows Grid | Figma (tabs) | works |  |
| Mirror | dialog Repeat | shows Mirror | Figma (tabs) | works |  |
| Source | dialog Repeat | opens its menu | Figma | works |  |
| Reverse overlap | dialog Repeat | turns the setting on or off | Figma | works |  |
| Live preview | dialog Repeat | turns the setting on or off | Figma | works |  |
| Reset | dialog Repeat | does what its label says | Figma's same control | works | nothing changed yet: nothing to reset |
| Randomise | dialog Repeat | does what its label says | Figma's same control | works |  |
| Cancel | dialog Repeat | closes the window | Figma, T5 | works |  |
| Apply | dialog Repeat | does what its label says | Figma's same control | disabled, reason shown | tooltip: Select a layer to repeat; re-checked 2026-11-20 |
| Expand | dialog Paratype letter | does what its label says | Figma's same control | works |  |
| Close | dialog Paratype letter | closes the window | Figma, T5 | works |  |
| Glyph “o” , classic | dialog Paratype letter | shows Glyph “o” , classic | Figma (tabs) | works | already the current choice |
| Metrics x 100 | dialog Paratype letter | shows Metrics x 100 | Figma (tabs) | works |  |
| Weights stem 18 | dialog Paratype letter | shows Weights stem 18 | Figma (tabs) | works |  |
| Expressive Sans | dialog Paratype letter | shows Expressive Sans | Figma (tabs) | works |  |
| Glyph | dialog Paratype letter | opens its menu | Figma | works |  |
| Classic | dialog Paratype letter | shows Classic | Figma (tabs) | works | already the current choice |
| Single | dialog Paratype letter | shows Single | Figma (tabs) | works | already the current choice |
| Live preview | dialog Paratype letter | turns the setting on or off | Figma | works |  |
| Reset | dialog Paratype letter | does what its label says | Figma's same control | works | nothing changed yet: nothing to reset |
| Specimen | dialog Paratype letter | shows Specimen | Figma (tabs) | works |  |
| Randomise | dialog Paratype letter | does what its label says | Figma's same control | works |  |
| Cancel | dialog Paratype letter | closes the window | Figma, T5 | works |  |
| Moiré | menu Pattern | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Apply | dialog Paratype letter | does what its label says | Figma's same control | works |  |
| Mesh Gradient | menu Pattern | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Reaction | menu Pattern | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Halftone | menu Pattern | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Scanline | menu Generative | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Pattern | menu Generative | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Loops | menu Generative | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Math | menu Generative | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Penrose | menu Generative | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Flow | menu Generative | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Letter Gap | menu Generative | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Line Swell | menu Generative | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Drift | menu Generative | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Gradients | menu Generative | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Soft Forms | menu Generative | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| 3D Scene | menu Generative | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Text tool T | menu Type | runs “Text tool” | the row label; Figma's same row | works |  |
| Kinetic type | menu Type | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Para Type | menu Type | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Home Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Library Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Editor Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Labs Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Randomiser Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Morph Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Dev Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Media Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Sign in Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Settings Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Edit | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Undo Z | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Redo ⇧ | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| In = | menu Zoom | runs “In” | the row label; Figma's same row | works |  |
| Out - | menu Zoom | runs “Out” | the row label; Figma's same row | works |  |
| To Fit 0 | menu Zoom | runs “To Fit” | the row label; Figma's same row | works |  |
| To Width ⌥ | menu Zoom | runs “To Width” | the row label; Figma's same row | works |  |
| To Selection ⇧ | menu Zoom | runs “To Selection” | the row label; Figma's same row | disabled, no reason |  |
| 100% 1 | menu Zoom | runs “100%” | the row label; Figma's same row | works |  |
| 200% 2 | menu Zoom | runs “200%” | the row label; Figma's same row | works |  |
| 400% 3 | menu Zoom | runs “400%” | the row label; Figma's same row | works |  |
| 800% 4 | menu Zoom | runs “800%” | the row label; Figma's same row | works |  |
| Single | menu Layout | runs “Single” | the row label; Figma's same row | works |  |
| Social | menu Layout | runs “Social” | the row label; Figma's same row | works |  |
| Duplicate selection D | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Select all layers A | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Delete selection ⌫ | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Esc Close | dialog Shortcuts | closes the window | Figma, T5 | works |  |
| ↵ Collapse all | dialog Shortcuts | does what its label says | Figma's same control | works |  |
| Layers | menu Left rail | runs “Layers” | the row label; Figma's same row | works |  |
| Assets | menu Left rail | runs “Assets” | the row label; Figma's same row | works |  |
| History | menu Left rail | runs “History” | the row label; Figma's same row | works |  |
| Navigator | menu Left rail | runs “Navigator” | the row label; Figma's same row | works |  |
| Stroke | menu Left rail | runs “Stroke” | the row label; Figma's same row | works |  |
| Color | menu Left rail | runs “Color” | the row label; Figma's same row | works |  |
| Swatches | menu Left rail | runs “Swatches” | the row label; Figma's same row | works |  |
| Color Modes | menu Left rail | runs “Color Modes” | the row label; Figma's same row | works |  |
| Transport | menu Left rail | runs “Transport” | the row label; Figma's same row | works |  |
| Output | menu Left rail | runs “Output” | the row label; Figma's same row | works |  |
| File | menu Left rail | runs “File” | the row label; Figma's same row | works |  |
| Inspector | menu Right rail | runs “Inspector” | the row label; Figma's same row | works |  |
| Effects | menu Right rail | runs “Effects” | the row label; Figma's same row | works |  |
| Save workspace… | menu Workspace | runs “Save workspace…” | the row label; Figma's same row | works |  |
| Reset workspace | menu Workspace | runs “Reset workspace” | the row label; Figma's same row | works |  |
| Expand | dock | arms the tool or opens its fold | S2, Figma (dock) | works |  |
| Drafts | menu Location | runs “Drafts” | the row label; Figma's same row | works |  |
| New folder… | menu Location | runs “New folder…” | the row label; Figma's same row | works |  |
| Columns | dialog dialog | does what its label says | Figma's same control | works |  |
| Close | dialog dialog | closes the window | Figma, T5 | works |  |
| Preview | dialog dialog | shows the work without chrome | Figma (Present) | works |  |
| Group resolutions | dialog dialog | does what its label says | Figma's same control | disabled, reason shown | tooltip: nothing to group here |
| Flat | dialog dialog | does what its label says | Figma's same control | works |  |
| Fold HLS segments | dialog dialog | does what its label says | Figma's same control | disabled, reason shown | tooltip: nothing to fold here |
| 8 of 15 kinds | dialog dialog | one click selects the value, Enter commits | S5.1, Figma | works |  |
| 200 | dialog dialog | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Poster | dialog dialog | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Off | dialog dialog | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Name | dialog dialog | one click selects the value, Enter commits | S5.1, Figma | works |  |
| ↓ Asc | dialog dialog | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Auto | dialog dialog | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Reset preferences | dialog dialog | does what its label says | Figma's same control | works |  |
| Close | dialog Files | closes the window | Figma, T5 | works |  |
| Files — back to the top | dialog Files | does what its label says | Figma's same control | works |  |
| Display settings | dialog Files | does what its label says | Figma's same control | works |  |
| Files | dialog Files | does what its label says | Figma's same control | works |  |
| LIBRARY | dialog Files | does what its label says | Figma's same control | works |  |
| PRESET | dialog Files | does what its label says | Figma's same control | works | Copy path writes the clipboard, which the driver cannot read |
| Filter | dialog Files | does what its label says | Figma's same control | works |  |
| Search | dialog Files | filters as typed | Figma | works |  |
| Columns | dialog Files | does what its label says | Figma's same control | works | already the current choice |
| Rows | dialog Files | does what its label says | Figma's same control | works |  |
| Grid | dialog Files | does what its label says | Figma's same control | works |  |
| Toggle filters | dialog Files | does what its label says | Figma's same control | works |  |
| Search | dialog Files | filters as typed | Figma | works |  |
| Import | dialog Files | does what its label says | Figma's same control | works |  |
| Name | dialog Files | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Save current | dialog Files | does what its label says | Figma's same control | disabled, no reason | with the Filter pressed the hover lands on the filter, not the button; on the window's own path the same buttons read "Name it first" and "Select a file first"; re-checked 2026-11-20 |
| Open | dialog Files | does what its label says | Figma's same control | disabled, no reason | with the Filter pressed the hover lands on the filter, not the button; on the window's own path the same buttons read "Name it first" and "Select a file first"; re-checked 2026-11-20 |
| Close search | dialog dialog | closes the window | Figma, T5 | works |  |
| RGB | dialog Color | opens its menu | Figma | works |  |
| HSL | dialog Color | opens its menu | Figma | works |  |
| HSB | dialog Color | opens its menu | Figma | works |  |
| Add style | dialog Color | opens the styles of that kind to apply one | Figma (Styles) | disabled, reason shown | tooltip: No styles yet; re-checked 2026-11-20 |
| Image | dialog Color | does what its label says | Figma's same control | works |  |
| Opacity | dialog Color | one click selects the value, Enter commits | S5.1, Figma | works |  |
| On this page | dialog Color | opens its menu | Figma | works |  |
| Name | dialog dialog | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Stroke | dialog Color | does what its label says | Figma's same control | not on the screen | Edit, Color is greyed with nothing selected (T4.4), so this door to the window is gone; re-checked 2026-11-20 |
| Opacity | dialog Color | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Base hex | dialog Color Modes | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Angle | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Common Radial | dialog Repeat | shows Common Radial | Figma (tabs) | works | already the current choice |
| Skeleton | dialog Paratype letter | shows Skeleton | Figma (tabs) | works |  |
| Parameters | menu Right rail | runs “Parameters” | the row label; Figma's same row | works |  |
| Fields | dialog dialog | does what its label says | Figma's same control | works |  |
| Tile size | dialog dialog | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Base: #A0 | dialog Color Modes | does what its label says | Figma's same control | works | its name changes every load; the swatches beside it open the picker |
| Base: #0A0 | dialog Color Modes | does what its label says | Figma's same control | works | its name changes every load; the swatches beside it open the picker |
| Page opacity | right rail | sets the page color's opacity | Figma (page fill) | works | re-checked 2026-11-20 |
| Colors | dialog Color Modes | one click selects the value, Enter commits | S5.1, Figma | works |  |

### Editor, a rectangle selected

| Control | Where | Should do | Source | State | Note |
|---|---|---|---|---|---|
| Create component | right rail | makes the selection a component | Figma (header) | disabled, reason shown | tooltip: No components yet; re-checked 2026-11-20 |
| Use as mask | right rail | uses the layer as a mask | Figma (header) | works |  |
| Boolean operation | right rail | opens the boolean menu with every row | S10.2 | works | opens Boolean |
| Boolean operations | right rail | opens the boolean menu with every row | S10.2 | works | opens Boolean |
| Edit object | right rail | does what its label says | Figma's same control | works |  |
| Align left | right rail | does what its label says | Figma's same control | works |  |
| Align right | right rail | does what its label says | Figma's same control | works |  |
| Align horizontal centers | right rail | does what its label says | Figma's same control | works |  |
| Align top | right rail | does what its label says | Figma's same control | works |  |
| Align vertical centers | right rail | does what its label says | Figma's same control | works |  |
| Align bottom | right rail | does what its label says | Figma's same control | works |  |
| X position | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Y position | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Rotation | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Rotate 90° left | right rail | does what its label says | Figma's same control | works |  |
| Flip horizontal | right rail | does what its label says | Figma's same control | works |  |
| Flip vertical | right rail | does what its label says | Figma's same control | works |  |
| Width | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Height | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Constrain proportions | right rail | does what its label says | Figma's same control | works |  |
| Hide layer | right rail | does what its label says | Figma's same control | works |  |
| Blend mode | right rail | does what its label says | Figma's same control | works | opens Blend mode |
| Independent corners | right rail | opens one field per corner | S10.1 | works |  |
| Styles | right rail | opens the styles of that kind to apply one | Figma (Styles) | disabled, reason shown | tooltip: No styles yet; re-checked 2026-11-20 |
| Add fill | right rail | adds a fill | Figma (Fill +) | works | opens Add fill |
| Fill: #d9d9d9 | right rail | does what its label says | Figma's same control | works | opens Color |
| Fill opacity | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Hide fill | right rail | does what its label says | Figma's same control | works |  |
| Remove fill | right rail | does what its label says | Figma's same control | works |  |
| Styles | right rail | opens the styles of that kind to apply one | Figma (Styles) | disabled, reason shown | tooltip: No styles yet; re-checked 2026-11-20 |
| Add stroke | right rail | adds a stroke | Figma (Stroke +) | works |  |
| Add effect | right rail | opens the Effects menu | R4.2, R8.1, Figma | works | opens Add effect |
| Unite | menu Boolean | runs “Unite” | the row label; Figma's same row | disabled, no reason |  |
| Add export | right rail | adds an export setting row | Figma (Export +) | works |  |
| Subtract | menu Boolean | runs “Subtract” | the row label; Figma's same row | disabled, no reason |  |
| Exclude | menu Boolean | runs “Exclude” | the row label; Figma's same row | disabled, no reason |  |
| Intersect | menu Boolean | runs “Intersect” | the row label; Figma's same row | disabled, no reason |  |
| Normal | menu Blend mode | runs “Normal” | the row label; Figma's same row | works |  |
| Multiply | menu Blend mode | runs “Multiply” | the row label; Figma's same row | works |  |
| Screen | menu Blend mode | runs “Screen” | the row label; Figma's same row | works |  |
| Overlay | menu Blend mode | runs “Overlay” | the row label; Figma's same row | works |  |
| Soft light | menu Blend mode | runs “Soft light” | the row label; Figma's same row | works |  |
| Difference | menu Blend mode | runs “Difference” | the row label; Figma's same row | works |  |
| Solid | menu Add fill | runs “Solid” | the row label; Figma's same row | works |  |
| Image | menu Add fill | runs “Image” | the row label; Figma's same row | works | opens Media |
| Custom | dialog Color | shows Custom | Figma (tabs) | works | already the current choice |
| Libraries | dialog Color | shows Libraries | Figma (tabs) | works |  |
| Add style | dialog Color | opens the styles of that kind to apply one | Figma (Styles) | disabled, reason shown | tooltip: No styles yet; re-checked 2026-11-20 |
| Close | dialog Color | closes the window | Figma, T5 | works |  |
| Solid | dialog Color | does what its label says | Figma's same control | works | already the current choice |
| Gradient | dialog Color | does what its label says | Figma's same control | works |  |
| Pattern | dialog Color | does what its label says | Figma's same control | works |  |
| Image | dialog Color | does what its label says | Figma's same control | works |  |
| Video | dialog Color | does what its label says | Figma's same control | works |  |
| Saturation and brightness | dialog Color | does what its label says | Figma's same control | works |  |
| Eyedropper | dialog Color | does what its label says | Figma's same control | works | the stage takes the pipette cursor while the pick is armed and drops it on Escape (read on the stage's style); re-checked 2026-11-20 |
| Hue | dialog Color | does what its label says | Figma's same control | works |  |
| Opacity | dialog Color | does what its label says | Figma's same control | works |  |
| Hex | dialog Color | opens its menu | Figma | works | opens menu |
| Opacity | dialog Color | one click selects the value, Enter commits | S5.1, Figma | works |  |
| On this page | dialog Color | opens its menu | Figma | works | opens menu |
| #1D2021 | listbox Swatches | runs or opens what the row names | C5 (search modal) | works | opens Swatches |
| #282828 | listbox Swatches | runs or opens what the row names | C5 (search modal) | works | opens Swatches |
| #393939 | listbox Swatches | runs or opens what the row names | C5 (search modal) | works | opens Swatches |
| #4A4A4A | listbox Swatches | runs or opens what the row names | C5 (search modal) | works | opens Swatches |
| #5C5C5C | listbox Swatches | runs or opens what the row names | C5 (search modal) | works | opens Swatches |
| #FFFFFF | listbox Swatches | runs or opens what the row names | C5 (search modal) | works | opens Swatches |
| #B2B2B2 | listbox Swatches | runs or opens what the row names | C5 (search modal) | works | opens Swatches |
| #FABD2F | listbox Swatches | runs or opens what the row names | C5 (search modal) | works | opens Swatches |
| Layer effects | menu Add effect | opens its submenu | Figma (menus) | works | opens Layer effects |
| Shader effects | menu Add effect | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Vector effects | menu Add effect | opens its submenu | Figma (menus) | works | opens Vector effects |
| Generate | menu Add effect | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Morph | menu Add effect | runs “Morph” | the row label; Figma's same row | disabled, no reason |  |
| Tune | menu Add effect | runs “Tune” | the row label; Figma's same row | works |  |
| Line Swell | menu Add effect | runs “Line Swell” | the row label; Figma's same row | works | opens Line Swell |
| Hex | menu menu | runs “Hex” | the row label; Figma's same row | works |  |
| RGB | menu menu | runs “RGB” | the row label; Figma's same row | works | opens Color |
| HSL | menu menu | runs “HSL” | the row label; Figma's same row | works | opens Color |
| HSB | menu menu | runs “HSB” | the row label; Figma's same row | works | opens Color |
| On this page | menu menu | runs “On this page” | the row label; Figma's same row | works |  |
| #83A598 | listbox Swatches | runs or opens what the row names | C5 (search modal) | works |  |
| #B8BB26 | listbox Swatches | runs or opens what the row names | C5 (search modal) | works |  |
| #FB4934 | listbox Swatches | runs or opens what the row names | C5 (search modal) | works |  |
| kol-swatch-grid-cell | listbox Swatches | runs or opens what the row names | C5 (search modal) | works |  |
| Bevel / Emboss | menu Layer effects | runs “Bevel / Emboss” | the row label; Figma's same row | works |  |
| Outline | menu Layer effects | runs “Outline” | the row label; Figma's same row | works |  |
| Inner Shadow | menu Layer effects | runs “Inner Shadow” | the row label; Figma's same row | works |  |
| 3D | menu Layer effects | runs “3D” | the row label; Figma's same row | works |  |
| Inner Glow | menu Layer effects | runs “Inner Glow” | the row label; Figma's same row | works |  |
| Color Overlay | menu Layer effects | runs “Color Overlay” | the row label; Figma's same row | works |  |
| Outer Glow | menu Layer effects | runs “Outer Glow” | the row label; Figma's same row | works |  |
| Gradient Overlay | menu Layer effects | runs “Gradient Overlay” | the row label; Figma's same row | works |  |
| Gaussian Blur | menu Layer effects | runs “Gaussian Blur” | the row label; Figma's same row | works |  |
| Outer Shadow | menu Layer effects | runs “Outer Shadow” | the row label; Figma's same row | works |  |
| Pattern | menu Layer effects | runs “Pattern” | the row label; Figma's same row | works | opens Pattern |
| Kinetic type | menu Layer effects | runs “Kinetic type” | the row label; Figma's same row | works | opens Kinetic type |
| Motion | menu Layer effects | runs “Motion” | the row label; Figma's same row | works | opens Motion |
| Dither | menu Shader effects | runs “Dither” | the row label; Figma's same row | works | opens Dither |
| ASCII | menu Shader effects | runs “ASCII” | the row label; Figma's same row | works | opens ASCII |
| Bitmap | menu Shader effects | runs “Bitmap” | the row label; Figma's same row | works | opens Bitmap |
| Riso | menu Shader effects | runs “Riso” | the row label; Figma's same row | works | opens Riso |
| Growing line | menu Shader effects | runs “Growing line” | the row label; Figma's same row | works | opens Growing line |
| Scanline | menu Shader effects | runs “Scanline” | the row label; Figma's same row | works | opens Scanline |
| RGB Split | menu Shader effects | runs “RGB Split” | the row label; Figma's same row | works | opens RGB Split |
| Glass | menu Shader effects | runs “Glass” | the row label; Figma's same row | works | opens Glass |
| HSL | menu Shader effects | runs “HSL” | the row label; Figma's same row | works | opens HSL |
| HSV | menu Shader effects | runs “HSV” | the row label; Figma's same row | works | opens HSV |
| Brightness | menu Shader effects | runs “Brightness” | the row label; Figma's same row | works | opens Brightness |
| Contrast | menu Shader effects | runs “Contrast” | the row label; Figma's same row | works | opens Contrast |
| RGB | menu Shader effects | runs “RGB” | the row label; Figma's same row | works | opens RGB |
| Invert | menu Shader effects | runs “Invert” | the row label; Figma's same row | works | opens Invert |
| Sepia | menu Shader effects | runs “Sepia” | the row label; Figma's same row | works | opens Sepia |
| Grayscale | menu Shader effects | runs “Grayscale” | the row label; Figma's same row | works | opens Grayscale |
| Enhance | menu Shader effects | runs “Enhance” | the row label; Figma's same row | works | opens Enhance |
| Adjustment | menu Shader effects | runs “Adjustment” | the row label; Figma's same row | works | opens Adjustment |
| HSL Adjustment | menu Shader effects | runs “HSL Adjustment” | the row label; Figma's same row | works | opens HSL Adjustment |
| Color Gradient | menu Shader effects | runs “Color Gradient” | the row label; Figma's same row | works | opens Color Gradient |
| Color Map | menu Shader effects | runs “Color Map” | the row label; Figma's same row | works | opens Color Map |
| Color Overlay | menu Shader effects | runs “Color Overlay” | the row label; Figma's same row | works | opens Color Overlay |
| Color Replace | menu Shader effects | runs “Color Replace” | the row label; Figma's same row | works | opens Color Replace |
| Multi Color Replace | menu Shader effects | runs “Multi Color Replace” | the row label; Figma's same row | works | opens Multi Color Replace |
| Blur | menu Shader effects | runs “Blur” | the row label; Figma's same row | works | opens Blur |
| Radial Blur | menu Shader effects | runs “Radial Blur” | the row label; Figma's same row | works | opens Radial Blur |
| Zoom Blur | menu Shader effects | runs “Zoom Blur” | the row label; Figma's same row | works | opens Zoom Blur |
| Motion Blur | menu Shader effects | runs “Motion Blur” | the row label; Figma's same row | works | opens Motion Blur |
| Kawase Blur | menu Shader effects | runs “Kawase Blur” | the row label; Figma's same row | works | opens Kawase Blur |
| Tilt Shift | menu Shader effects | runs “Tilt Shift” | the row label; Figma's same row | works | opens Tilt Shift |
| Backdrop Blur | menu Shader effects | runs “Backdrop Blur” | the row label; Figma's same row | works | opens Backdrop Blur |
| Offset path | menu Vector effects | runs “Offset path” | the row label; Figma's same row | works | opens Offset path |
| Smooth | menu Vector effects | runs “Smooth” | the row label; Figma's same row | works | opens Smooth |
| Pucker & bloat | menu Vector effects | runs “Pucker & bloat” | the row label; Figma's same row | works | opens Pucker & bloat |
| Twist | menu Vector effects | runs “Twist” | the row label; Figma's same row | works | opens Twist |
| Warp | menu Vector effects | runs “Warp” | the row label; Figma's same row | works | opens Warp |
| Zigzag | menu Vector effects | runs “Zigzag” | the row label; Figma's same row | works | opens Zigzag |
| Distress | menu Vector effects | runs “Distress” | the row label; Figma's same row | works | opens Distress |
| Screens | menu Generate | runs “Screens” | the row label; Figma's same row | works | opens Line Screen |
| Arrays | menu Generate | runs “Arrays” | the row label; Figma's same row | works | opens Stripe Array |
| Repeat | menu Generate | runs “Repeat” | the row label; Figma's same row | works | opens Repeat |
| Motion | menu Generate | runs “Motion” | the row label; Figma's same row | works | opens Wave loop |
| Close | dialog Line Swell | closes the window | Figma, T5 | works |  |
| Search Line Swell | dialog Line Swell | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Piano | dialog Line Swell | does what its label says | Figma's same control | works | opens Piano |
| Piano hexagon | dialog Line Swell | does what its label says | Figma's same control | works | opens Piano |
| Piano letter | dialog Line Swell | does what its label says | Figma's same control | works | opens Piano |
| Blinds | dialog Line Swell | does what its label says | Figma's same control | works | opens Blinds |
| Half 2 | dialog Line Swell | does what its label says | Figma's same control | works | opens Half |
| Half 9 | dialog Line Swell | does what its label says | Figma's same control | works | opens Half |
| RGB | dialog Color | opens its menu | Figma | works |  |
| HSL | dialog Color | opens its menu | Figma | works |  |
| HSB | dialog Color | opens its menu | Figma | works |  |
| Pattern, change effect | dialog Pattern | opens its menu | Figma | works | 2026-11-20: not drawn where the effect has no others; the name stands alone |
| More | dialog Pattern | does what its label says | Figma's same control | works |  |
| Close | dialog Pattern | closes the window | Figma, T5 | works |  |
| Flatten the pattern to static SVG shapes (one-way) | dialog Pattern | does what its label says | Figma's same control | works | re-checked 2026-11-20 |
| Randomize all | dialog Pattern | does what its label says | Figma's same control | works |  |
| Seed | dialog Pattern | one click selects the value, Enter commits | S5.1, Figma | works |  |
| abstract-01 | dialog Pattern | opens its menu | Figma | works |  |
| Kinetic type, change effect | dialog Kinetic type | opens its menu | Figma | works | 2026-11-20: not drawn where the effect has no others; the name stands alone |
| More | dialog Kinetic type | does what its label says | Figma's same control | works |  |
| Close | dialog Kinetic type | closes the window | Figma, T5 | works |  |
| Generate | dialog Kinetic type | shows Generate | Figma (tabs) | works | already the current choice |
| Style | dialog Kinetic type | shows Style | Figma (tabs) | works |  |
| Animation | dialog Kinetic type | shows Animation | Figma (tabs) | works |  |
| Type | dialog Kinetic type | opens its filter or sort menu | Figma (file browser) | works |  |
| Radial | dialog Kinetic type | opens its menu | Figma | works |  |
| Sunburst | dialog Kinetic type | opens its menu | Figma | works |  |
| Mark element 1 | dialog Kinetic type | turns the setting on or off | Figma | works |  |
| Motion, change effect | dialog Motion | opens its menu | Figma | works | 2026-11-20: not drawn where the effect has no others; the name stands alone |
| Duplicate element | dialog Kinetic type | does what its label says | Figma's same control | works |  |
| More | dialog Motion | does what its label says | Figma's same control | works |  |
| Close | dialog Motion | closes the window | Figma, T5 | works |  |
| Generate | dialog Motion | shows Generate | Figma (tabs) | works | already the current choice |
| Style | dialog Motion | shows Style | Figma (tabs) | works |  |
| Animation | dialog Motion | shows Animation | Figma (tabs) | works |  |
| Loops | dialog Motion | opens its menu | Figma | works |  |
| Discs | dialog Motion | opens its menu | Figma | works |  |
| Previous preset (H) | dialog Motion | does what its label says | Figma's same control | works |  |
| Circle morph | dialog Motion | opens its menu | Figma | works |  |
| Next preset (L) | dialog Motion | does what its label says | Figma's same control | works |  |
| About this preset | dialog Motion | does what its label says | Figma's same control | works | a hover card, as in Labs |
| KOL | dialog Motion | opens its menu | Figma | works |  |
| Off | dialog Motion | shows Off | Figma (tabs) | works |  |
| On | dialog Motion | shows On | Figma (tabs) | works |  |
| Dither, change effect | dialog Dither | opens its menu | Figma | works |  |
| More | dialog Dither | does what its label says | Figma's same control | works |  |
| Close | dialog Dither | closes the window | Figma, T5 | works |  |
| Preset | dialog Dither | opens its menu | Figma | works |  |
| Effect | dialog Dither | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Dither | shows Animation | Figma (tabs) | works |  |
| Amount | dialog Dither | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Shape | dialog Dither | opens its menu | Figma | works |  |
| Cell size | dialog Dither | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Cell size | dialog Dither | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Scale | dialog Dither | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Scale | dialog Dither | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Gap | dialog Dither | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Gap | dialog Dither | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Contrast | dialog Dither | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Contrast | dialog Dither | one click selects the value, Enter commits | S5.1, Figma | works |  |
| ASCII, change effect | dialog ASCII | opens its menu | Figma | works |  |
| More | dialog ASCII | does what its label says | Figma's same control | works |  |
| Close | dialog ASCII | closes the window | Figma, T5 | works |  |
| Preset | dialog ASCII | opens its menu | Figma | works |  |
| Effect | dialog ASCII | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog ASCII | shows Animation | Figma (tabs) | works |  |
| Amount | dialog ASCII | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Charset | dialog ASCII | opens its menu | Figma | works |  |
| Glyph scale | dialog ASCII | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Glyph scale | dialog ASCII | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Cell size | dialog ASCII | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Cell size | dialog ASCII | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Contrast | dialog ASCII | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Bitmap, change effect | dialog Bitmap | opens its menu | Figma | works |  |
| Contrast | dialog ASCII | one click selects the value, Enter commits | S5.1, Figma | works |  |
| More | dialog Bitmap | does what its label says | Figma's same control | works |  |
| Close | dialog Bitmap | closes the window | Figma, T5 | works |  |
| Preset | dialog Bitmap | opens its menu | Figma | works |  |
| Effect | dialog Bitmap | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Bitmap | shows Animation | Figma (tabs) | works |  |
| Amount | dialog Bitmap | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Field | dialog Bitmap | opens its menu | Figma | works |  |
| Contrast | dialog Bitmap | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Contrast | dialog Bitmap | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Rotate | dialog Bitmap | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Rotate | dialog Bitmap | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Layout | dialog Bitmap | opens its menu | Figma | works |  |
| Density | dialog Bitmap | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Riso, change effect | dialog Riso | opens its menu | Figma | works |  |
| More | dialog Riso | does what its label says | Figma's same control | works |  |
| Close | dialog Riso | closes the window | Figma, T5 | works |  |
| Animation | dialog Riso | shows Animation | Figma (tabs) | works |  |
| Effect | dialog Riso | shows Effect | Figma (tabs) | works | the tab already shown |
| Paper: #F1ECE0 | dialog Riso | does what its label says | Figma's same control | works |  |
| Ink A hex | dialog Riso | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Ink A: #1D3FBB | dialog Riso | does what its label says | Figma's same control | works |  |
| Ink B: #FF4F6D | dialog Riso | does what its label says | Figma's same control | works |  |
| Screen | dialog Riso | opens its menu | Figma | works |  |
| Cell | dialog Riso | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Cell | dialog Riso | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Split | dialog Riso | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Split | dialog Riso | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Misregister | dialog Riso | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Misregister | dialog Riso | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Growing line, change effect | dialog Growing line | opens its menu | Figma | works |  |
| More | dialog Growing line | does what its label says | Figma's same control | works |  |
| Close | dialog Growing line | closes the window | Figma, T5 | works |  |
| Effect | dialog Growing line | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Growing line | shows Animation | Figma (tabs) | works |  |
| Background: #F4F1EA | dialog Growing line | does what its label says | Figma's same control | works |  |
| Line color: #141414 | dialog Growing line | does what its label says | Figma's same control | works |  |
| Line color hex | dialog Growing line | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Invert | dialog Growing line | turns the setting on or off | Figma | works |  |
| Variation | dialog Growing line | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Variation | dialog Growing line | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Dark spacing | dialog Growing line | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Dark spacing | dialog Growing line | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Light spacing | dialog Growing line | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Light spacing | dialog Growing line | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Contrast | dialog Growing line | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Contrast | dialog Growing line | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Scanline, change effect | dialog Scanline | opens its menu | Figma | works |  |
| More | dialog Scanline | does what its label says | Figma's same control | works |  |
| Close | dialog Scanline | closes the window | Figma, T5 | works |  |
| Effect | dialog Scanline | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Scanline | shows Animation | Figma (tabs) | works |  |
| Geometry | dialog Scanline | opens its menu | Figma | works |  |
| Lines | dialog Scanline | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Lines | dialog Scanline | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Weave | dialog Scanline | turns the setting on or off | Figma | works |  |
| Min gap | dialog Scanline | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Max gap | dialog Scanline | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Min gap | dialog Scanline | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Max gap | dialog Scanline | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Contrast | dialog Scanline | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Displace | dialog Scanline | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Contrast | dialog Scanline | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Displace | dialog Scanline | one click selects the value, Enter commits | S5.1, Figma | works |  |
| RGB Split, change effect | dialog RGB Split | opens its menu | Figma | works |  |
| More | dialog RGB Split | does what its label says | Figma's same control | works |  |
| Close | dialog RGB Split | closes the window | Figma, T5 | works |  |
| Effect | dialog RGB Split | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog RGB Split | shows Animation | Figma (tabs) | works |  |
| Offset X | dialog RGB Split | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Offset Y | dialog RGB Split | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Wobble | dialog RGB Split | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Wobble | dialog RGB Split | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Amount | dialog RGB Split | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog RGB Split | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog RGB Split | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Offset X | dialog RGB Split | does what its label says | Figma's same control | works |  |
| Offset Y | dialog RGB Split | does what its label says | Figma's same control | works |  |
| Wobble | dialog RGB Split | does what its label says | Figma's same control | works |  |
| Amount | dialog RGB Split | does what its label says | Figma's same control | works |  |
| Glass, change effect | dialog Glass | opens its menu | Figma | works |  |
| More | dialog Glass | does what its label says | Figma's same control | works |  |
| Close | dialog Glass | closes the window | Figma, T5 | works |  |
| Preset | dialog Glass | opens its menu | Figma | works |  |
| Effect | dialog Glass | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Glass | shows Animation | Figma (tabs) | works |  |
| X shift | dialog Glass | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Y shift | dialog Glass | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Y shift | dialog Glass | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Scale | dialog Glass | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Scale | dialog Glass | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Angle | dialog Glass | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Angle | dialog Glass | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Mix | dialog Glass | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Chroma | dialog Glass | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Chroma | dialog Glass | one click selects the value, Enter commits | S5.1, Figma | works |  |
| HSL, change effect | dialog HSL | opens its menu | Figma | works |  |
| More | dialog HSL | does what its label says | Figma's same control | works |  |
| Animation | dialog HSL | shows Animation | Figma (tabs) | works |  |
| Hue | dialog HSL | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Hue | dialog HSL | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Saturation | dialog HSL | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Saturation | dialog HSL | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Value | dialog HSL | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Value | dialog HSL | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Amount | dialog HSL | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog HSL | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog HSL | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Hue | dialog HSL | does what its label says | Figma's same control | works |  |
| Saturation | dialog HSL | does what its label says | Figma's same control | works |  |
| Value | dialog HSL | does what its label says | Figma's same control | works |  |
| Amount | dialog HSL | does what its label says | Figma's same control | works |  |
| HSV, change effect | dialog HSV | opens its menu | Figma | works |  |
| More | dialog HSV | does what its label says | Figma's same control | works |  |
| Close | dialog HSV | closes the window | Figma, T5 | works |  |
| Effect | dialog HSV | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog HSV | shows Animation | Figma (tabs) | works |  |
| Hue | dialog HSV | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Hue | dialog HSV | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Saturation | dialog HSV | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Saturation | dialog HSV | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Value | dialog HSV | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Value | dialog HSV | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Amount | dialog HSV | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog HSV | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog HSV | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Hue | dialog HSV | does what its label says | Figma's same control | works |  |
| Saturation | dialog HSV | does what its label says | Figma's same control | works |  |
| Amount | dialog HSV | does what its label says | Figma's same control | works |  |
| Value | dialog HSV | does what its label says | Figma's same control | works |  |
| Brightness, change effect | dialog Brightness | opens its menu | Figma | works |  |
| More | dialog Brightness | does what its label says | Figma's same control | works |  |
| Close | dialog Brightness | closes the window | Figma, T5 | works |  |
| Effect | dialog Brightness | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Brightness | shows Animation | Figma (tabs) | works |  |
| Brightness | dialog Brightness | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Brightness | dialog Brightness | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Amount | dialog Brightness | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog Brightness | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog Brightness | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Brightness | dialog Brightness | does what its label says | Figma's same control | works |  |
| Amount | dialog Brightness | does what its label says | Figma's same control | works |  |
| Contrast, change effect | dialog Contrast | opens its menu | Figma | works |  |
| More | dialog Contrast | does what its label says | Figma's same control | works |  |
| Close | dialog Contrast | closes the window | Figma, T5 | works |  |
| Effect | dialog Contrast | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Contrast | shows Animation | Figma (tabs) | works |  |
| Contrast | dialog Contrast | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Contrast | dialog Contrast | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Amount | dialog Contrast | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog Contrast | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog Contrast | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Contrast | dialog Contrast | does what its label says | Figma's same control | works |  |
| Amount | dialog Contrast | does what its label says | Figma's same control | works |  |
| RGB, change effect | dialog RGB | opens its menu | Figma | works |  |
| More | dialog RGB | does what its label says | Figma's same control | works |  |
| Close | dialog RGB | closes the window | Figma, T5 | works |  |
| Effect | dialog RGB | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog RGB | shows Animation | Figma (tabs) | works |  |
| Red | dialog RGB | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Red | dialog RGB | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Green | dialog RGB | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Green | dialog RGB | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Blue | dialog RGB | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Blue | dialog RGB | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Amount | dialog RGB | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog RGB | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog RGB | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Red | dialog RGB | does what its label says | Figma's same control | works |  |
| Green | dialog RGB | does what its label says | Figma's same control | works |  |
| Blue | dialog RGB | does what its label says | Figma's same control | works |  |
| Amount | dialog RGB | does what its label says | Figma's same control | works |  |
| Invert, change effect | dialog Invert | opens its menu | Figma | works |  |
| More | dialog Invert | does what its label says | Figma's same control | works |  |
| Close | dialog Invert | closes the window | Figma, T5 | works |  |
| Effect | dialog Invert | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Invert | shows Animation | Figma (tabs) | works |  |
| Amount | dialog Invert | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog Invert | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog Invert | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Sepia, change effect | dialog Sepia | opens its menu | Figma | works |  |
| More | dialog Sepia | does what its label says | Figma's same control | works |  |
| Close | dialog Sepia | closes the window | Figma, T5 | works |  |
| Effect | dialog Sepia | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Sepia | shows Animation | Figma (tabs) | works |  |
| Amount | dialog Sepia | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Reset to defaults | dialog Sepia | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Randomize all | dialog Sepia | does what its label says | Figma's same control | works |  |
| Grayscale, change effect | dialog Grayscale | opens its menu | Figma | works |  |
| More | dialog Grayscale | does what its label says | Figma's same control | works |  |
| Close | dialog Grayscale | closes the window | Figma, T5 | works |  |
| Effect | dialog Grayscale | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Grayscale | shows Animation | Figma (tabs) | works |  |
| Amount | dialog Grayscale | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog Grayscale | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog Grayscale | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Enhance, change effect | dialog Enhance | opens its menu | Figma | works |  |
| More | dialog Enhance | does what its label says | Figma's same control | works |  |
| Effect | dialog Enhance | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Enhance | shows Animation | Figma (tabs) | works |  |
| Close | dialog Enhance | closes the window | Figma, T5 | works |  |
| Randomize all | dialog Enhance | does what its label says | Figma's same control | works |  |
| Amount | dialog Enhance | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Reset to defaults | dialog Enhance | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| More | dialog Adjustment | does what its label says | Figma's same control | works |  |
| Adjustment, change effect | dialog Adjustment | opens its menu | Figma | works |  |
| Close | dialog Adjustment | closes the window | Figma, T5 | works |  |
| Effect | dialog Adjustment | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Adjustment | shows Animation | Figma (tabs) | works |  |
| Gamma | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Gamma | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Saturation | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Saturation | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Contrast | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Contrast | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Brightness | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Brightness | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Red | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Red | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Green | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Green | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Blue | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Blue | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| HSL Adjustment, change effect | dialog HSL Adjustment | opens its menu | Figma | works |  |
| More | dialog HSL Adjustment | does what its label says | Figma's same control | works |  |
| Close | dialog HSL Adjustment | closes the window | Figma, T5 | works |  |
| Effect | dialog HSL Adjustment | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog HSL Adjustment | shows Animation | Figma (tabs) | works |  |
| Hue | dialog HSL Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Hue | dialog HSL Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Saturation | dialog HSL Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Saturation | dialog HSL Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Lightness | dialog HSL Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Lightness | dialog HSL Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Alpha | dialog HSL Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Colorize | dialog HSL Adjustment | turns the setting on or off | Figma | works |  |
| Seed | dialog HSL Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Reset to defaults | dialog HSL Adjustment | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Color Gradient, change effect | dialog Color Gradient | opens its menu | Figma | works |  |
| More | dialog Color Gradient | does what its label says | Figma's same control | works |  |
| Close | dialog Color Gradient | closes the window | Figma, T5 | works |  |
| Effect | dialog Color Gradient | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Color Gradient | shows Animation | Figma (tabs) | works |  |
| Color Map, change effect | dialog Color Map | opens its menu | Figma | works |  |
| More | dialog Color Map | does what its label says | Figma's same control | works |  |
| Close | dialog Color Map | closes the window | Figma, T5 | works |  |
| Effect | dialog Color Map | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Color Map | shows Animation | Figma (tabs) | works |  |
| Color Overlay, change effect | dialog Color Overlay | opens its menu | Figma | works |  |
| More | dialog Color Overlay | does what its label says | Figma's same control | works |  |
| Close | dialog Color Overlay | closes the window | Figma, T5 | works |  |
| Effect | dialog Color Overlay | shows Effect | Figma (tabs) | works | the tab already shown |
| Color: #FF0000 | dialog Color Overlay | does what its label says | Figma's same control | works |  |
| Alpha | dialog Color Overlay | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog Color Overlay | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog Color Overlay | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Color | dialog Color Overlay | does what its label says | Figma's same control | works |  |
| Color Replace, change effect | dialog Color Replace | opens its menu | Figma | works |  |
| More | dialog Color Replace | does what its label says | Figma's same control | works |  |
| Close | dialog Color Replace | closes the window | Figma, T5 | works |  |
| Effect | dialog Color Replace | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Color Replace | shows Animation | Figma (tabs) | works |  |
| Original color: #FF0000 | dialog Color Replace | does what its label says | Figma's same control | works |  |
| Target color: #000000 | dialog Color Replace | does what its label says | Figma's same control | works |  |
| Target color hex | dialog Color Replace | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Tolerance | dialog Color Replace | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Tolerance | dialog Color Replace | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog Color Replace | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog Color Replace | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Color | dialog Color Replace | does what its label says | Figma's same control | works |  |
| Multi Color Replace, change effect | dialog Multi Color Replace | opens its menu | Figma | works |  |
| More | dialog Multi Color Replace | does what its label says | Figma's same control | works |  |
| Close | dialog Multi Color Replace | closes the window | Figma, T5 | works |  |
| Animation | dialog Multi Color Replace | shows Animation | Figma (tabs) | works |  |
| From 1: #FF0000 | dialog Multi Color Replace | does what its label says | Figma's same control | works |  |
| To 1: #FF0000 | dialog Multi Color Replace | does what its label says | Figma's same control | works |  |
| From 2: #00FF00 | dialog Multi Color Replace | does what its label says | Figma's same control | works |  |
| From 2 hex | dialog Multi Color Replace | one click selects the value, Enter commits | S5.1, Figma | works |  |
| To 2: #00FF00 | dialog Multi Color Replace | does what its label says | Figma's same control | works |  |
| To 2 hex | dialog Multi Color Replace | one click selects the value, Enter commits | S5.1, Figma | works |  |
| From 3: #0000FF | dialog Multi Color Replace | does what its label says | Figma's same control | works |  |
| From 3 hex | dialog Multi Color Replace | one click selects the value, Enter commits | S5.1, Figma | works |  |
| To 3: #0000FF | dialog Multi Color Replace | does what its label says | Figma's same control | works |  |
| To 3 hex | dialog Multi Color Replace | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Tolerance | dialog Multi Color Replace | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Tolerance | dialog Multi Color Replace | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Blur, change effect | dialog Blur | opens its menu | Figma | works |  |
| Close | dialog Blur | closes the window | Figma, T5 | works |  |
| Effect | dialog Blur | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Blur | shows Animation | Figma (tabs) | works |  |
| Radius | dialog Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Radius | dialog Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Amount | dialog Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog Blur | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog Blur | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Radius | dialog Blur | does what its label says | Figma's same control | works |  |
| Amount | dialog Blur | does what its label says | Figma's same control | works |  |
| Radial Blur, change effect | dialog Radial Blur | opens its menu | Figma | works |  |
| More | dialog Radial Blur | does what its label says | Figma's same control | works |  |
| Close | dialog Radial Blur | closes the window | Figma, T5 | works |  |
| Effect | dialog Radial Blur | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Radial Blur | shows Animation | Figma (tabs) | works |  |
| Angle | dialog Radial Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Angle | dialog Radial Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Kernel size | dialog Radial Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Kernel size | dialog Radial Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Center X | dialog Radial Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Center Y | dialog Radial Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog Radial Blur | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog Radial Blur | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Angle | dialog Radial Blur | does what its label says | Figma's same control | works |  |
| Kernel size | dialog Radial Blur | does what its label says | Figma's same control | works |  |
| Center X | dialog Radial Blur | does what its label says | Figma's same control | works |  |
| Center Y | dialog Radial Blur | does what its label says | Figma's same control | works |  |
| Zoom Blur, change effect | dialog Zoom Blur | opens its menu | Figma | works |  |
| More | dialog Zoom Blur | does what its label says | Figma's same control | works |  |
| Close | dialog Zoom Blur | closes the window | Figma, T5 | works |  |
| Effect | dialog Zoom Blur | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Zoom Blur | shows Animation | Figma (tabs) | works |  |
| Strength | dialog Zoom Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Strength | dialog Zoom Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Inner radius | dialog Zoom Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Inner radius | dialog Zoom Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Center X | dialog Zoom Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Center Y | dialog Zoom Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog Zoom Blur | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog Zoom Blur | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Strength | dialog Zoom Blur | does what its label says | Figma's same control | works |  |
| Inner radius | dialog Zoom Blur | does what its label says | Figma's same control | works |  |
| Center X | dialog Zoom Blur | does what its label says | Figma's same control | works |  |
| Center Y | dialog Zoom Blur | does what its label says | Figma's same control | works |  |
| Motion Blur, change effect | dialog Motion Blur | opens its menu | Figma | works |  |
| More | dialog Motion Blur | does what its label says | Figma's same control | works |  |
| Close | dialog Motion Blur | closes the window | Figma, T5 | works |  |
| Effect | dialog Motion Blur | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Motion Blur | shows Animation | Figma (tabs) | works |  |
| Velocity X | dialog Motion Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Velocity Y | dialog Motion Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Kernel size | dialog Motion Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Kernel size | dialog Motion Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Offset | dialog Motion Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Offset | dialog Motion Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog Motion Blur | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog Motion Blur | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Velocity X | dialog Motion Blur | does what its label says | Figma's same control | works |  |
| Velocity Y | dialog Motion Blur | does what its label says | Figma's same control | works |  |
| Kernel size | dialog Motion Blur | does what its label says | Figma's same control | works |  |
| Offset | dialog Motion Blur | does what its label says | Figma's same control | works |  |
| Kawase Blur, change effect | dialog Kawase Blur | opens its menu | Figma | works |  |
| More | dialog Kawase Blur | does what its label says | Figma's same control | works |  |
| Close | dialog Kawase Blur | closes the window | Figma, T5 | works |  |
| Effect | dialog Kawase Blur | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Kawase Blur | shows Animation | Figma (tabs) | works |  |
| Blur | dialog Kawase Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Blur | dialog Kawase Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Quality | dialog Kawase Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Quality | dialog Kawase Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog Kawase Blur | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog Kawase Blur | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Blur | dialog Kawase Blur | does what its label says | Figma's same control | works |  |
| Quality | dialog Kawase Blur | does what its label says | Figma's same control | works |  |
| Tilt Shift, change effect | dialog Tilt Shift | opens its menu | Figma | works |  |
| More | dialog Tilt Shift | does what its label says | Figma's same control | works |  |
| Close | dialog Tilt Shift | closes the window | Figma, T5 | works |  |
| Effect | dialog Tilt Shift | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Tilt Shift | shows Animation | Figma (tabs) | works |  |
| Blur | dialog Tilt Shift | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Blur | dialog Tilt Shift | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Gradient blur | dialog Tilt Shift | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Gradient blur | dialog Tilt Shift | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog Tilt Shift | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog Tilt Shift | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Blur | dialog Tilt Shift | does what its label says | Figma's same control | works |  |
| Gradient blur | dialog Tilt Shift | does what its label says | Figma's same control | works |  |
| Backdrop Blur, change effect | dialog Backdrop Blur | opens its menu | Figma | works |  |
| More | dialog Backdrop Blur | does what its label says | Figma's same control | works |  |
| Close | dialog Backdrop Blur | closes the window | Figma, T5 | works |  |
| Effect | dialog Backdrop Blur | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Backdrop Blur | shows Animation | Figma (tabs) | works |  |
| Offset path, change effect | dialog Offset path | opens its menu | Figma | works |  |
| More | dialog Offset path | does what its label says | Figma's same control | works |  |
| Close | dialog Offset path | closes the window | Figma, T5 | works |  |
| Distance | dialog Offset path | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Distance | dialog Offset path | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Smooth, change effect | dialog Smooth | opens its menu | Figma | works |  |
| More | dialog Smooth | does what its label says | Figma's same control | works |  |
| Close | dialog Smooth | closes the window | Figma, T5 | works |  |
| Amount | dialog Smooth | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Pucker & bloat, change effect | dialog Pucker & bloat | opens its menu | Figma | works |  |
| More | dialog Pucker & bloat | does what its label says | Figma's same control | works |  |
| Close | dialog Pucker & bloat | closes the window | Figma, T5 | works |  |
| Amount | dialog Pucker & bloat | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Amount | dialog Pucker & bloat | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Twist, change effect | dialog Twist | opens its menu | Figma | works |  |
| More | dialog Twist | does what its label says | Figma's same control | works |  |
| Close | dialog Twist | closes the window | Figma, T5 | works |  |
| Angle | dialog Twist | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Angle | dialog Twist | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Warp, change effect | dialog Warp | opens its menu | Figma | works |  |
| More | dialog Warp | does what its label says | Figma's same control | works |  |
| Style | dialog Warp | opens its menu | Figma | works |  |
| Close | dialog Warp | closes the window | Figma, T5 | works |  |
| Bend | dialog Warp | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Bend | dialog Warp | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Zigzag, change effect | dialog Zigzag | opens its menu | Figma | works |  |
| More | dialog Zigzag | does what its label says | Figma's same control | works |  |
| Close | dialog Zigzag | closes the window | Figma, T5 | works |  |
| Size | dialog Zigzag | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Ridges | dialog Zigzag | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Size | dialog Zigzag | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Ridges | dialog Zigzag | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Points | dialog Zigzag | opens its menu | Figma | works |  |
| Distress, change effect | dialog Distress | opens its menu | Figma | works |  |
| More | dialog Distress | does what its label says | Figma's same control | works |  |
| Close | dialog Distress | closes the window | Figma, T5 | works |  |
| Mode | dialog Distress | opens its menu | Figma | works |  |
| Amount | dialog Distress | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Amount | dialog Distress | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Frequency | dialog Distress | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Smoothness | dialog Distress | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Smoothness | dialog Distress | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Seed | dialog Distress | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Seed | dialog Distress | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Expand | dialog Line Screen | does what its label says | Figma's same control | works |  |
| Style | dialog Line Screen | opens its menu | Figma | works |  |
| Preset | dialog Line Screen | opens its menu | Figma | works |  |
| Close | dialog Line Screen | closes the window | Figma, T5 | works |  |
| Field Radial | dialog Line Screen | shows Field Radial | Figma (tabs) | works | already the current choice |
| Ramp 9 steps | dialog Line Screen | shows Ramp 9 steps | Figma (tabs) | works |  |
| Line Screen 43 rows | dialog Line Screen | shows Line Screen 43 rows | Figma (tabs) | works |  |
| Mask Circle | dialog Line Screen | shows Mask Circle | Figma (tabs) | works |  |
| Randomness Off | dialog Line Screen | shows Randomness Off | Figma (tabs) | works |  |
| Frame 128 px inset | dialog Line Screen | shows Frame 128 px inset | Figma (tabs) | works |  |
| Type | dialog Line Screen | opens its filter or sort menu | Figma (file browser) | works |  |
| Centre X | dialog Line Screen | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Centre Y | dialog Line Screen | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Radius X | dialog Line Screen | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Radius X | dialog Line Screen | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Live preview | dialog Line Screen | turns the setting on or off | Figma | works |  |
| Reset | dialog Line Screen | does what its label says | Figma's same control | works | nothing changed yet: nothing to reset |
| Randomise | dialog Line Screen | does what its label says | Figma's same control | works |  |
| Cancel | dialog Line Screen | closes the window | Figma, T5 | works |  |
| Apply | dialog Line Screen | does what its label says | Figma's same control | works |  |
| Expand | dialog Stripe Array | does what its label says | Figma's same control | works |  |
| Style | dialog Stripe Array | opens its menu | Figma | works |  |
| Preset | dialog Stripe Array | opens its menu | Figma | works |  |
| Close | dialog Stripe Array | closes the window | Figma, T5 | works |  |
| Stripe Array 11 rows | dialog Stripe Array | shows Stripe Array 11 rows | Figma (tabs) | works | already the current choice |
| Randomness Off | dialog Stripe Array | shows Randomness Off | Figma (tabs) | works |  |
| Frame 128 px inset | dialog Stripe Array | shows Frame 128 px inset | Figma (tabs) | works |  |
| Rows | dialog Stripe Array | shows Rows | Figma (tabs) | works |  |
| Columns | dialog Stripe Array | shows Columns | Figma (tabs) | works |  |
| Count | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Count | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Angle | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Angle | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Width value A | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Width curve | dialog Stripe Array | opens its menu | Figma | works |  |
| Width value B | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Gap value A | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Gap curve | dialog Stripe Array | opens its menu | Figma | works |  |
| Gap value B | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| End value A | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| End curve | dialog Stripe Array | opens its menu | Figma | works |  |
| End value B | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Advanced 8 more | dialog Stripe Array | does what its label says | Figma's same control | works |  |
| Live preview | dialog Stripe Array | turns the setting on or off | Figma | works |  |
| Reset | dialog Stripe Array | does what its label says | Figma's same control | works | nothing changed yet: nothing to reset |
| Randomise | dialog Stripe Array | does what its label says | Figma's same control | works |  |
| Cancel | dialog Stripe Array | closes the window | Figma, T5 | works |  |
| Apply | dialog Stripe Array | does what its label says | Figma's same control | works |  |
| Expand | dialog Repeat | does what its label says | Figma's same control | works |  |
| Close | dialog Repeat | closes the window | Figma, T5 | works |  |
| Common Radial | dialog Repeat | shows Common Radial | Figma (tabs) | works | already the current choice |
| Radial 8 copies | dialog Repeat | shows Radial 8 copies | Figma (tabs) | works |  |
| Radial | dialog Repeat | shows Radial | Figma (tabs) | works | already the current choice |
| Grid | dialog Repeat | shows Grid | Figma (tabs) | works |  |
| Mirror | dialog Repeat | shows Mirror | Figma (tabs) | works |  |
| Source | dialog Repeat | opens its menu | Figma | works |  |
| Reverse overlap | dialog Repeat | turns the setting on or off | Figma | works |  |
| Live preview | dialog Repeat | turns the setting on or off | Figma | works |  |
| Reset | dialog Repeat | does what its label says | Figma's same control | works | nothing changed yet: nothing to reset |
| Randomise | dialog Repeat | does what its label says | Figma's same control | works |  |
| Cancel | dialog Repeat | closes the window | Figma, T5 | works |  |
| Apply | dialog Repeat | does what its label says | Figma's same control | works |  |
| Style | dialog Wave loop | opens its menu | Figma | works |  |
| Preset | dialog Wave loop | opens its menu | Figma | works |  |
| Close | dialog Wave loop | closes the window | Figma, T5 | works |  |
| Randomise | dialog Wave loop | shows Randomise | Figma (tabs) | works | already the current choice |
| Time | dialog Wave loop | shows Time | Figma (tabs) | works |  |
| Oscillator A | dialog Wave loop | shows Oscillator A | Figma (tabs) | works |  |
| Oscillator B | dialog Wave loop | shows Oscillator B | Figma (tabs) | works |  |
| Sync | dialog Wave loop | shows Sync | Figma (tabs) | works |  |
| Overlap | dialog Wave loop | shows Overlap | Figma (tabs) | works |  |
| Lines | dialog Wave loop | shows Lines | Figma (tabs) | works |  |
| Filter | dialog Wave loop | shows Filter | Figma (tabs) | works |  |
| Filter: piano | dialog Wave loop | shows Filter: piano | Figma (tabs) | works |  |
| Filter: dash | dialog Wave loop | shows Filter: dash | Figma (tabs) | works |  |
| Filter: warp | dialog Wave loop | shows Filter: warp | Figma (tabs) | works |  |
| Form | dialog Wave loop | shows Form | Figma (tabs) | works |  |
| Color | dialog Wave loop | shows Color | Figma (tabs) | works |  |
| random | dialog Wave loop | one click selects the value, Enter commits | S5.1, Figma | works |  |
| random | dialog Wave loop | one click selects the value, Enter commits | S5.1, Figma | works |  |
| randomSpread | dialog Wave loop | one click selects the value, Enter commits | S5.1, Figma | works |  |
| randomSpread | dialog Wave loop | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Reset | dialog Wave loop | does what its label says | Figma's same control | works | nothing changed yet: nothing to reset |
| Cancel | dialog Wave loop | closes the window | Figma, T5 | works |  |
| Apply | dialog Wave loop | does what its label says | Figma's same control | works |  |
| Piano, change effect | dialog Piano | opens its menu | Figma | works |  |
| More | dialog Piano | does what its label says | Figma's same control | works |  |
| Close | dialog Piano | closes the window | Figma, T5 | works |  |
| none | dialog Piano | opens its menu | Figma | works |  |
| Random set | dialog Piano | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Variation | dialog Piano | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Variation | dialog Piano | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Source | dialog Piano | opens its menu | Figma | works |  |
| Blinds, change effect | dialog Blinds | opens its menu | Figma | works |  |
| More | dialog Blinds | does what its label says | Figma's same control | works |  |
| Close | dialog Blinds | closes the window | Figma, T5 | works |  |
| none | dialog Blinds | opens its menu | Figma | works |  |
| Shape | dialog Blinds | opens its menu | Figma | works |  |
| Letter | dialog Blinds | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Size | dialog Blinds | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Size | dialog Blinds | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Break up | dialog Blinds | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Break up | dialog Blinds | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Pattern | dialog Blinds | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Half, change effect | dialog Half | opens its menu | Figma | works |  |
| More | dialog Half | does what its label says | Figma's same control | works |  |
| Close | dialog Half | closes the window | Figma, T5 | works |  |
| none | dialog Half | opens its menu | Figma | works |  |
| Random set | dialog Half | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Variation | dialog Half | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Variation | dialog Half | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Source | dialog Half | opens its menu | Figma | works |  |
| Fill hex | right rail | one click selects the value, Enter commits | S5.1, Figma | works | read where the same control was reached: right rail |
| Opacity | right rail | one click selects the value, Enter commits | S5.1, Figma | works | 40 set the layer to 40 percent (re-run by hand) |
| Corner radius | right rail | one click selects the value, Enter commits | S5.1, Figma | works | read where the same control was reached: right rail |
| Hex | dialog Color | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Hex |
| Amount | dialog Dither | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Amount | dialog ASCII | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Invert | dialog ASCII | turns the setting on or off | Figma | works | inverts (re-run by hand) |
| Amount | dialog Bitmap | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Density | dialog Bitmap | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Density |
| Paper hex | dialog Riso | one click selects the value, Enter commits | S5.1, Figma | works | writes the paper colour (re-run by hand) |
| Ink B hex | dialog Riso | one click selects the value, Enter commits | S5.1, Figma | works | writes the ink (re-run by hand) |
| Background hex | dialog Growing line | one click selects the value, Enter commits | S5.1, Figma | works | writes the background (re-run by hand) |
| Amount | dialog RGB Split | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| X shift | dialog Glass | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling X shift |
| Mix | dialog Glass | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Mix |
| Close | dialog HSL | closes the window | Figma, T5 | works | read where the same control was reached: dialog:HSL |
| Effect | dialog HSL | shows Effect | Figma (tabs) | works | the tab already shown |
| Amount | dialog HSL | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Amount | dialog HSV | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Amount | dialog Brightness | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Amount | dialog Contrast | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Amount | dialog RGB | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Amount | dialog Invert | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Amount | dialog Sepia | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Amount | dialog Grayscale | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Amount | dialog Enhance | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Alpha | dialog HSL Adjustment | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Alpha |
| Randomize all | dialog HSL Adjustment | does what its label says | Figma's same control | works | rolls every setting (re-run by hand) |
| Animation | dialog Color Overlay | shows Animation | Figma (tabs) | works | read where the same control was reached: dialog:Color Overlay |
| Color hex | dialog Color Overlay | one click selects the value, Enter commits | S5.1, Figma | works | writes the colour; at the default strength the canvas shows no change (re-run by hand) |
| Alpha | dialog Color Overlay | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Alpha |
| Original color hex | dialog Color Replace | one click selects the value, Enter commits | S5.1, Figma | works | writes the colour (re-run by hand) |
| Effect | dialog Multi Color Replace | shows Effect | Figma (tabs) | works | the tab already shown |
| From 0 hex | dialog Multi Color Replace | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling From 2 hex |
| To 0 hex | dialog Multi Color Replace | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling To 2 hex |
| More | dialog Blur | does what its label says | Figma's same control | works | opens the effect menu (re-run by hand) |
| Amount | dialog Blur | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Amount | dialog Smooth | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Frequency | dialog Distress | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Frequency |
| Advanced 0 more | dialog Line Screen | does what its label says | Figma's same control | works | read where the same control was reached: dialog:Line Screen |

### Editor, a text layer selected

| Control | Where | Should do | Source | State | Note |
|---|---|---|---|---|---|
| Create component | right rail | makes the selection a component | Figma (header) | disabled, reason shown | tooltip: No components yet; re-checked 2026-11-20 |
| Use as mask | right rail | uses the layer as a mask | Figma (header) | disabled, reason shown | tooltip: Needs a layer below to mask; re-checked 2026-11-20 |
| Boolean operation | right rail | opens the boolean menu with every row | S10.2 | works | opens Boolean |
| Boolean operations | right rail | opens the boolean menu with every row | S10.2 | works | opens Boolean |
| Edit object | right rail | does what its label says | Figma's same control | disabled, reason shown | tooltip: Only a shape or a path has nodes; re-checked 2026-11-20 |
| Align left | right rail | does what its label says | Figma's same control | works |  |
| Align horizontal centers | right rail | does what its label says | Figma's same control | works |  |
| Align right | right rail | does what its label says | Figma's same control | works |  |
| Align top | right rail | does what its label says | Figma's same control | works |  |
| Align vertical centers | right rail | does what its label says | Figma's same control | works |  |
| Align bottom | right rail | does what its label says | Figma's same control | works |  |
| X position | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Y position | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Rotation | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Rotate 90° left | right rail | does what its label says | Figma's same control | works |  |
| Flip horizontal | right rail | does what its label says | Figma's same control | works |  |
| Flip vertical | right rail | does what its label says | Figma's same control | works |  |
| Width | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Height | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Constrain proportions | right rail | does what its label says | Figma's same control | works |  |
| Fixed size | right rail | does what its label says | Figma's same control | works |  |
| Auto width | right rail | does what its label says | Figma's same control | works | already the current choice |
| Auto height | right rail | does what its label says | Figma's same control | works |  |
| Styles | right rail | opens the styles of that kind to apply one | Figma (Styles) | disabled, reason shown | tooltip: No styles yet; re-checked 2026-11-20 |
| Font family | right rail | opens its menu | Figma | works | opens Font family |
| Weight | right rail | opens its menu | Figma | works | opens Weight |
| Font size | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Size presets | right rail | does what its label says | Figma's same control | works | opens Size presets |
| Line height | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Letter spacing | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Align text left | right rail | does what its label says | Figma's same control | works | already the current choice |
| Center text | right rail | does what its label says | Figma's same control | works |  |
| Align text right | right rail | does what its label says | Figma's same control | works |  |
| Align top | right rail | does what its label says | Figma's same control | works | already the current choice |
| Align middle | right rail | does what its label says | Figma's same control | works |  |
| Align bottom | right rail | does what its label says | Figma's same control | works |  |
| Hide layer | right rail | does what its label says | Figma's same control | works |  |
| Corner radius | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Independent corners | right rail | opens one field per corner | S10.1 | works |  |
| Add fill | right rail | adds a fill | Figma (Fill +) | works | opens Add fill |
| Fill: #ffffff | right rail | does what its label says | Figma's same control | works | opens Color |
| Fill opacity | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Hide fill | right rail | does what its label says | Figma's same control | works |  |
| Remove fill | right rail | does what its label says | Figma's same control | works |  |
| Styles | right rail | opens the styles of that kind to apply one | Figma (Styles) | disabled, reason shown | tooltip: No styles yet (2026-11-20) |
| Add stroke | right rail | adds a stroke | Figma (Stroke +) | works |  |
| Flatten the text to glyph-outline shapes (one-way) | right rail | does what its label says | Figma's same control | works |  |
| Add effect | right rail | opens the Effects menu | R4.2, R8.1, Figma | works | opens Add effect |
| Unite | menu Boolean | runs “Unite” | the row label; Figma's same row | disabled, no reason |  |
| Subtract | menu Boolean | runs “Subtract” | the row label; Figma's same row | disabled, no reason |  |
| Intersect | menu Boolean | runs “Intersect” | the row label; Figma's same row | disabled, no reason |  |
| Exclude | menu Boolean | runs “Exclude” | the row label; Figma's same row | disabled, no reason |  |
| Inter | menu Font family | runs “Inter” | the row label; Figma's same row | works |  |
| Malromur | menu Font family | runs “Malromur” | the row label; Figma's same row | works |  |
| JetBrains Mono | menu Font family | runs “JetBrains Mono” | the row label; Figma's same row | works |  |
| Roboto | menu Font family | runs “Roboto” | the row label; Figma's same row | works |  |
| Open Sans | menu Font family | runs “Open Sans” | the row label; Figma's same row | works |  |
| Montserrat | menu Font family | runs “Montserrat” | the row label; Figma's same row | works |  |
| Poppins | menu Font family | runs “Poppins” | the row label; Figma's same row | works |  |
| Lato | menu Font family | runs “Lato” | the row label; Figma's same row | works |  |
| Oswald | menu Font family | runs “Oswald” | the row label; Figma's same row | works |  |
| Raleway | menu Font family | runs “Raleway” | the row label; Figma's same row | works |  |
| Playfair Display | menu Font family | runs “Playfair Display” | the row label; Figma's same row | works |  |
| Merriweather | menu Font family | runs “Merriweather” | the row label; Figma's same row | works |  |
| Lora | menu Font family | runs “Lora” | the row label; Figma's same row | works |  |
| EB Garamond | menu Font family | runs “EB Garamond” | the row label; Figma's same row | works |  |
| Libre Baskerville | menu Font family | runs “Libre Baskerville” | the row label; Figma's same row | works |  |
| Cormorant Garamond | menu Font family | runs “Cormorant Garamond” | the row label; Figma's same row | works |  |
| DM Sans | menu Font family | runs “DM Sans” | the row label; Figma's same row | works |  |
| DM Serif Display | menu Font family | runs “DM Serif Display” | the row label; Figma's same row | works |  |
| Space Grotesk | menu Font family | runs “Space Grotesk” | the row label; Figma's same row | works |  |
| Space Mono | menu Font family | runs “Space Mono” | the row label; Figma's same row | works |  |
| Thin | menu Weight | runs “Thin” | the row label; Figma's same row | works |  |
| Thin Italic | menu Weight | runs “Thin Italic” | the row label; Figma's same row | works |  |
| Extra Light | menu Weight | runs “Extra Light” | the row label; Figma's same row | works |  |
| Light | menu Weight | runs “Light” | the row label; Figma's same row | works |  |
| Light Italic | menu Weight | runs “Light Italic” | the row label; Figma's same row | works |  |
| Regular | menu Weight | runs “Regular” | the row label; Figma's same row | works |  |
| Italic | menu Weight | runs “Italic” | the row label; Figma's same row | works |  |
| Medium | menu Weight | runs “Medium” | the row label; Figma's same row | works |  |
| Medium Italic | menu Weight | runs “Medium Italic” | the row label; Figma's same row | works |  |
| Semi Bold | menu Weight | runs “Semi Bold” | the row label; Figma's same row | works |  |
| Semi Bold Italic | menu Weight | runs “Semi Bold Italic” | the row label; Figma's same row | works |  |
| Bold | menu Weight | runs “Bold” | the row label; Figma's same row | works |  |
| Bold Italic | menu Weight | runs “Bold Italic” | the row label; Figma's same row | works |  |
| Extra Bold | menu Weight | runs “Extra Bold” | the row label; Figma's same row | works |  |
| Extra Bold Italic | menu Weight | runs “Extra Bold Italic” | the row label; Figma's same row | works |  |
| Black | menu Weight | runs “Black” | the row label; Figma's same row | works |  |
| 12 | menu Size presets | runs “12” | the row label; Figma's same row | works |  |
| Black Italic | menu Weight | runs “Black Italic” | the row label; Figma's same row | works |  |
| 16 | menu Size presets | runs “16” | the row label; Figma's same row | works |  |
| 24 | menu Size presets | runs “24” | the row label; Figma's same row | works |  |
| 32 | menu Size presets | runs “32” | the row label; Figma's same row | works |  |
| 48 | menu Size presets | runs “48” | the row label; Figma's same row | works |  |
| 64 | menu Size presets | runs “64” | the row label; Figma's same row | works |  |
| 96 | menu Size presets | runs “96” | the row label; Figma's same row | works |  |
| 160 | menu Size presets | runs “160” | the row label; Figma's same row | works |  |
| 128 | menu Size presets | runs “128” | the row label; Figma's same row | works |  |
| 192 | menu Size presets | runs “192” | the row label; Figma's same row | works |  |
| 256 | menu Size presets | runs “256” | the row label; Figma's same row | works |  |
| Solid | menu Add fill | runs “Solid” | the row label; Figma's same row | works |  |
| 320 | menu Size presets | runs “320” | the row label; Figma's same row | works |  |
| Custom | dialog Color | shows Custom | Figma (tabs) | works | already the current choice |
| Image | menu Add fill | runs “Image” | the row label; Figma's same row | works | opens Media |
| Libraries | dialog Color | shows Libraries | Figma (tabs) | works |  |
| Add style | dialog Color | opens the styles of that kind to apply one | Figma (Styles) | disabled, reason shown | tooltip: No styles yet; re-checked 2026-11-20 |
| Close | dialog Color | closes the window | Figma, T5 | works |  |
| Solid | dialog Color | does what its label says | Figma's same control | works |  |
| Pattern | dialog Color | does what its label says | Figma's same control | works |  |
| Image | dialog Color | does what its label says | Figma's same control | works |  |
| Video | dialog Color | does what its label says | Figma's same control | works |  |
| Saturation and brightness | dialog Color | does what its label says | Figma's same control | works |  |
| Vector effects | menu Add effect | opens its submenu | Figma (menus) | disabled, no reason |  |
| Layer effects | menu Add effect | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Shader effects | menu Add effect | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Generate | menu Add effect | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Tune | menu Add effect | runs “Tune” | the row label; Figma's same row | disabled, no reason |  |
| Morph | menu Add effect | runs “Morph” | the row label; Figma's same row | works | opens Morph |
| Line Swell | menu Add effect | runs “Line Swell” | the row label; Figma's same row | works | opens Line Swell |
| Bevel / Emboss | menu Layer effects | runs “Bevel / Emboss” | the row label; Figma's same row | works |  |
| Outline | menu Layer effects | runs “Outline” | the row label; Figma's same row | works |  |
| 3D | menu Layer effects | runs “3D” | the row label; Figma's same row | works |  |
| Inner Shadow | menu Layer effects | runs “Inner Shadow” | the row label; Figma's same row | works |  |
| Inner Glow | menu Layer effects | runs “Inner Glow” | the row label; Figma's same row | works |  |
| Color Overlay | menu Layer effects | runs “Color Overlay” | the row label; Figma's same row | works |  |
| Gradient Overlay | menu Layer effects | runs “Gradient Overlay” | the row label; Figma's same row | works |  |
| Outer Glow | menu Layer effects | runs “Outer Glow” | the row label; Figma's same row | works |  |
| Outer Shadow | menu Layer effects | runs “Outer Shadow” | the row label; Figma's same row | works |  |
| Gaussian Blur | menu Layer effects | runs “Gaussian Blur” | the row label; Figma's same row | works |  |
| Pattern | menu Layer effects | runs “Pattern” | the row label; Figma's same row | works | opens Pattern |
| Kinetic type | menu Layer effects | runs “Kinetic type” | the row label; Figma's same row | works | opens Kinetic type |
| Motion | menu Layer effects | runs “Motion” | the row label; Figma's same row | works | opens Motion |
| Dither | menu Shader effects | runs “Dither” | the row label; Figma's same row | works | opens Dither |
| ASCII | menu Shader effects | runs “ASCII” | the row label; Figma's same row | works | opens ASCII |
| Bitmap | menu Shader effects | runs “Bitmap” | the row label; Figma's same row | works | opens Bitmap |
| Riso | menu Shader effects | runs “Riso” | the row label; Figma's same row | works | opens Riso |
| Growing line | menu Shader effects | runs “Growing line” | the row label; Figma's same row | works | opens Growing line |
| Scanline | menu Shader effects | runs “Scanline” | the row label; Figma's same row | works | opens Scanline |
| RGB Split | menu Shader effects | runs “RGB Split” | the row label; Figma's same row | works | opens RGB Split |
| Glass | menu Shader effects | runs “Glass” | the row label; Figma's same row | works | opens Glass |
| HSL | menu Shader effects | runs “HSL” | the row label; Figma's same row | works | opens HSL |
| HSV | menu Shader effects | runs “HSV” | the row label; Figma's same row | works | opens HSV |
| Brightness | menu Shader effects | runs “Brightness” | the row label; Figma's same row | works | opens Brightness |
| Contrast | menu Shader effects | runs “Contrast” | the row label; Figma's same row | works | opens Contrast |
| RGB | menu Shader effects | runs “RGB” | the row label; Figma's same row | works | opens RGB |
| Invert | menu Shader effects | runs “Invert” | the row label; Figma's same row | works | opens Invert |
| Sepia | menu Shader effects | runs “Sepia” | the row label; Figma's same row | works | opens Sepia |
| Grayscale | menu Shader effects | runs “Grayscale” | the row label; Figma's same row | works | opens Grayscale |
| Enhance | menu Shader effects | runs “Enhance” | the row label; Figma's same row | works | opens Enhance |
| Adjustment | menu Shader effects | runs “Adjustment” | the row label; Figma's same row | works | opens Adjustment |
| HSL Adjustment | menu Shader effects | runs “HSL Adjustment” | the row label; Figma's same row | works | opens HSL Adjustment |
| Color Gradient | menu Shader effects | runs “Color Gradient” | the row label; Figma's same row | works | opens Color Gradient |
| Color Map | menu Shader effects | runs “Color Map” | the row label; Figma's same row | works | opens Color Map |
| Color Overlay | menu Shader effects | runs “Color Overlay” | the row label; Figma's same row | works | opens Color Overlay |
| Color Replace | menu Shader effects | runs “Color Replace” | the row label; Figma's same row | works | opens Color Replace |
| Multi Color Replace | menu Shader effects | runs “Multi Color Replace” | the row label; Figma's same row | works | opens Multi Color Replace |
| Radial Blur | menu Shader effects | runs “Radial Blur” | the row label; Figma's same row | works | opens Radial Blur |
| Zoom Blur | menu Shader effects | runs “Zoom Blur” | the row label; Figma's same row | works | opens Zoom Blur |
| Motion Blur | menu Shader effects | runs “Motion Blur” | the row label; Figma's same row | works | opens Motion Blur |
| Kawase Blur | menu Shader effects | runs “Kawase Blur” | the row label; Figma's same row | works | opens Kawase Blur |
| Backdrop Blur | menu Shader effects | runs “Backdrop Blur” | the row label; Figma's same row | works | opens Backdrop Blur |
| Tilt Shift | menu Shader effects | runs “Tilt Shift” | the row label; Figma's same row | works | opens Tilt Shift |
| Screens | menu Generate | runs “Screens” | the row label; Figma's same row | works | opens Line Screen |
| Arrays | menu Generate | runs “Arrays” | the row label; Figma's same row | works | opens Stripe Array |
| Morph, change effect | dialog Morph | opens its menu | Figma | works | 2026-11-20: not drawn where the effect has no others; the name stands alone |
| Repeat | menu Generate | runs “Repeat” | the row label; Figma's same row | works | opens Repeat |
| Motion | menu Generate | runs “Motion” | the row label; Figma's same row | works | opens Wave loop |
| More | dialog Morph | does what its label says | Figma's same control | works | opens More |
| Close | dialog Morph | closes the window | Figma, T5 | works |  |
| Mode | dialog Morph | opens its menu | Figma | works | opens Mode |
| Weight B | dialog Morph | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Curve | dialog Morph | opens its menu | Figma | works | opens Curve |
| Blend | dialog Morph | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Blend | dialog Morph | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Close | dialog Line Swell | closes the window | Figma, T5 | works |  |
| Search Line Swell | dialog Line Swell | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Piano | dialog Line Swell | does what its label says | Figma's same control | works | opens Piano |
| Piano hexagon | dialog Line Swell | does what its label says | Figma's same control | works | opens Piano |
| Pattern, change effect | dialog Pattern | opens its menu | Figma | works | 2026-11-20: not drawn where the effect has no others; the name stands alone |
| More | dialog Pattern | does what its label says | Figma's same control | works |  |
| Close | dialog Pattern | closes the window | Figma, T5 | works |  |
| Flatten the pattern to static SVG shapes (one-way) | dialog Pattern | does what its label says | Figma's same control | works | re-checked 2026-11-20 |
| Randomize all | dialog Pattern | does what its label says | Figma's same control | works |  |
| Seed | dialog Pattern | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Kinetic type, change effect | dialog Kinetic type | opens its menu | Figma | works | 2026-11-20: not drawn where the effect has no others; the name stands alone |
| More | dialog Kinetic type | does what its label says | Figma's same control | works |  |
| Generate | dialog Kinetic type | shows Generate | Figma (tabs) | works | already the current choice |
| Style | dialog Kinetic type | shows Style | Figma (tabs) | works |  |
| Animation | dialog Kinetic type | shows Animation | Figma (tabs) | works |  |
| Type | dialog Kinetic type | opens its filter or sort menu | Figma (file browser) | works |  |
| Radial | dialog Kinetic type | opens its menu | Figma | works |  |
| Motion, change effect | dialog Motion | opens its menu | Figma | works | 2026-11-20: not drawn where the effect has no others; the name stands alone |
| Sunburst | dialog Kinetic type | opens its menu | Figma | works |  |
| More | dialog Motion | does what its label says | Figma's same control | works |  |
| Close | dialog Motion | closes the window | Figma, T5 | works |  |
| Generate | dialog Motion | shows Generate | Figma (tabs) | works | already the current choice |
| Style | dialog Motion | shows Style | Figma (tabs) | works |  |
| Animation | dialog Motion | shows Animation | Figma (tabs) | works |  |
| Loops | dialog Motion | opens its menu | Figma | works |  |
| Discs | dialog Motion | opens its menu | Figma | works |  |
| Dither, change effect | dialog Dither | opens its menu | Figma | works |  |
| More | dialog Dither | does what its label says | Figma's same control | works |  |
| Close | dialog Dither | closes the window | Figma, T5 | works |  |
| Effect | dialog Dither | shows Effect | Figma (tabs) | works | the tab already shown |
| Preset | dialog Dither | opens its menu | Figma | works |  |
| Animation | dialog Dither | shows Animation | Figma (tabs) | works |  |
| Amount | dialog Dither | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Shape | dialog Dither | opens its menu | Figma | works |  |
| ASCII, change effect | dialog ASCII | opens its menu | Figma | works |  |
| More | dialog ASCII | does what its label says | Figma's same control | works |  |
| Close | dialog ASCII | closes the window | Figma, T5 | works |  |
| Preset | dialog ASCII | opens its menu | Figma | works |  |
| Effect | dialog ASCII | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog ASCII | shows Animation | Figma (tabs) | works |  |
| Amount | dialog ASCII | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Charset | dialog ASCII | opens its menu | Figma | works |  |
| Bitmap, change effect | dialog Bitmap | opens its menu | Figma | works |  |
| More | dialog Bitmap | does what its label says | Figma's same control | works |  |
| Close | dialog Bitmap | closes the window | Figma, T5 | works |  |
| Preset | dialog Bitmap | opens its menu | Figma | works |  |
| Effect | dialog Bitmap | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Bitmap | shows Animation | Figma (tabs) | works |  |
| Amount | dialog Bitmap | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Field | dialog Bitmap | opens its menu | Figma | works |  |
| Riso, change effect | dialog Riso | opens its menu | Figma | works |  |
| More | dialog Riso | does what its label says | Figma's same control | works |  |
| Close | dialog Riso | closes the window | Figma, T5 | works |  |
| Effect | dialog Riso | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Riso | shows Animation | Figma (tabs) | works |  |
| Paper: #F1ECE0 | dialog Riso | does what its label says | Figma's same control | works |  |
| Ink A: #1D3FBB | dialog Riso | does what its label says | Figma's same control | works |  |
| Ink A hex | dialog Riso | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Ink B: #FF4F6D | dialog Riso | does what its label says | Figma's same control | works |  |
| Growing line, change effect | dialog Growing line | opens its menu | Figma | works |  |
| More | dialog Growing line | does what its label says | Figma's same control | works |  |
| Close | dialog Growing line | closes the window | Figma, T5 | works |  |
| Effect | dialog Growing line | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Growing line | shows Animation | Figma (tabs) | works |  |
| Background: #F4F1EA | dialog Growing line | does what its label says | Figma's same control | works |  |
| Line color: #141414 | dialog Growing line | does what its label says | Figma's same control | works |  |
| Line color hex | dialog Growing line | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Invert | dialog Growing line | turns the setting on or off | Figma | works |  |
| More | dialog Scanline | does what its label says | Figma's same control | works |  |
| Scanline, change effect | dialog Scanline | opens its menu | Figma | works |  |
| Close | dialog Scanline | closes the window | Figma, T5 | works |  |
| Effect | dialog Scanline | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Scanline | shows Animation | Figma (tabs) | works |  |
| Geometry | dialog Scanline | opens its menu | Figma | works |  |
| Lines | dialog Scanline | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Lines | dialog Scanline | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Weave | dialog Scanline | turns the setting on or off | Figma | works |  |
| RGB Split, change effect | dialog RGB Split | opens its menu | Figma | works |  |
| More | dialog RGB Split | does what its label says | Figma's same control | works |  |
| Close | dialog RGB Split | closes the window | Figma, T5 | works |  |
| Effect | dialog RGB Split | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog RGB Split | shows Animation | Figma (tabs) | works |  |
| Offset X | dialog RGB Split | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Wobble | dialog RGB Split | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Offset Y | dialog RGB Split | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Wobble | dialog RGB Split | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Amount | dialog RGB Split | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Glass, change effect | dialog Glass | opens its menu | Figma | works |  |
| More | dialog Glass | does what its label says | Figma's same control | works |  |
| Close | dialog Glass | closes the window | Figma, T5 | works |  |
| Preset | dialog Glass | opens its menu | Figma | works |  |
| Effect | dialog Glass | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Glass | shows Animation | Figma (tabs) | works |  |
| X shift | dialog Glass | one click selects the value, Enter commits | S5.1, Figma | works |  |
| X shift | dialog Glass | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Y shift | dialog Glass | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Y shift | dialog Glass | one click selects the value, Enter commits | S5.1, Figma | works |  |
| HSL, change effect | dialog HSL | opens its menu | Figma | works |  |
| More | dialog HSL | does what its label says | Figma's same control | works |  |
| Close | dialog HSL | closes the window | Figma, T5 | works |  |
| Effect | dialog HSL | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog HSL | shows Animation | Figma (tabs) | works |  |
| Hue | dialog HSL | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Hue | dialog HSL | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Saturation | dialog HSL | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Value | dialog HSL | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Saturation | dialog HSL | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Value | dialog HSL | one click selects the value, Enter commits | S5.1, Figma | works |  |
| HSV, change effect | dialog HSV | opens its menu | Figma | works |  |
| More | dialog HSV | does what its label says | Figma's same control | works |  |
| Close | dialog HSV | closes the window | Figma, T5 | works |  |
| Effect | dialog HSV | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog HSV | shows Animation | Figma (tabs) | works |  |
| Hue | dialog HSV | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Hue | dialog HSV | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Saturation | dialog HSV | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Saturation | dialog HSV | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Value | dialog HSV | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Brightness, change effect | dialog Brightness | opens its menu | Figma | works |  |
| More | dialog Brightness | does what its label says | Figma's same control | works |  |
| Close | dialog Brightness | closes the window | Figma, T5 | works |  |
| Effect | dialog Brightness | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Brightness | shows Animation | Figma (tabs) | works |  |
| Brightness | dialog Brightness | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Brightness | dialog Brightness | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Amount | dialog Brightness | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog Brightness | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog Brightness | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Contrast, change effect | dialog Contrast | opens its menu | Figma | works |  |
| More | dialog Contrast | does what its label says | Figma's same control | works |  |
| Close | dialog Contrast | closes the window | Figma, T5 | works |  |
| Effect | dialog Contrast | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Contrast | shows Animation | Figma (tabs) | works |  |
| Contrast | dialog Contrast | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Amount | dialog Contrast | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog Contrast | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog Contrast | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| RGB, change effect | dialog RGB | opens its menu | Figma | works |  |
| More | dialog RGB | does what its label says | Figma's same control | works |  |
| Effect | dialog RGB | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog RGB | shows Animation | Figma (tabs) | works |  |
| Red | dialog RGB | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Red | dialog RGB | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Green | dialog RGB | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Green | dialog RGB | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Blue | dialog RGB | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Blue | dialog RGB | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Invert, change effect | dialog Invert | opens its menu | Figma | works |  |
| More | dialog Invert | does what its label says | Figma's same control | works |  |
| Close | dialog Invert | closes the window | Figma, T5 | works |  |
| Effect | dialog Invert | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Invert | shows Animation | Figma (tabs) | works |  |
| Amount | dialog Invert | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog Invert | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog Invert | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Sepia, change effect | dialog Sepia | opens its menu | Figma | works |  |
| More | dialog Sepia | does what its label says | Figma's same control | works |  |
| Close | dialog Sepia | closes the window | Figma, T5 | works |  |
| Effect | dialog Sepia | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Sepia | shows Animation | Figma (tabs) | works |  |
| Randomize all | dialog Sepia | does what its label says | Figma's same control | works |  |
| Amount | dialog Sepia | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Reset to defaults | dialog Sepia | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Grayscale, change effect | dialog Grayscale | opens its menu | Figma | works |  |
| More | dialog Grayscale | does what its label says | Figma's same control | works |  |
| Close | dialog Grayscale | closes the window | Figma, T5 | works |  |
| Effect | dialog Grayscale | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Grayscale | shows Animation | Figma (tabs) | works |  |
| Amount | dialog Grayscale | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog Grayscale | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog Grayscale | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| More | dialog Enhance | does what its label says | Figma's same control | works |  |
| Enhance, change effect | dialog Enhance | opens its menu | Figma | works |  |
| Close | dialog Enhance | closes the window | Figma, T5 | works |  |
| Effect | dialog Enhance | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Enhance | shows Animation | Figma (tabs) | works |  |
| Amount | dialog Enhance | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog Enhance | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog Enhance | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Adjustment, change effect | dialog Adjustment | opens its menu | Figma | works |  |
| More | dialog Adjustment | does what its label says | Figma's same control | works |  |
| Close | dialog Adjustment | closes the window | Figma, T5 | works |  |
| Effect | dialog Adjustment | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Adjustment | shows Animation | Figma (tabs) | works |  |
| Gamma | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Gamma | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Saturation | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Saturation | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Contrast | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Contrast | dialog Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| HSL Adjustment, change effect | dialog HSL Adjustment | opens its menu | Figma | works |  |
| More | dialog HSL Adjustment | does what its label says | Figma's same control | works |  |
| Close | dialog HSL Adjustment | closes the window | Figma, T5 | works |  |
| Effect | dialog HSL Adjustment | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog HSL Adjustment | shows Animation | Figma (tabs) | works |  |
| Hue | dialog HSL Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Saturation | dialog HSL Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Hue | dialog HSL Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Saturation | dialog HSL Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Lightness | dialog HSL Adjustment | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Color Gradient, change effect | dialog Color Gradient | opens its menu | Figma | works |  |
| Close | dialog Color Gradient | closes the window | Figma, T5 | works |  |
| Effect | dialog Color Gradient | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Color Gradient | shows Animation | Figma (tabs) | works |  |
| Color Map, change effect | dialog Color Map | opens its menu | Figma | works |  |
| More | dialog Color Map | does what its label says | Figma's same control | works |  |
| Close | dialog Color Map | closes the window | Figma, T5 | works |  |
| Effect | dialog Color Map | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Color Map | shows Animation | Figma (tabs) | works |  |
| Color Overlay, change effect | dialog Color Overlay | opens its menu | Figma | works |  |
| More | dialog Color Overlay | does what its label says | Figma's same control | works |  |
| Close | dialog Color Overlay | closes the window | Figma, T5 | works |  |
| Effect | dialog Color Overlay | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Color Overlay | shows Animation | Figma (tabs) | works |  |
| Color: #FF0000 | dialog Color Overlay | does what its label says | Figma's same control | works |  |
| Alpha | dialog Color Overlay | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog Color Overlay | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog Color Overlay | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Color Replace, change effect | dialog Color Replace | opens its menu | Figma | works |  |
| More | dialog Color Replace | does what its label says | Figma's same control | works |  |
| Close | dialog Color Replace | closes the window | Figma, T5 | works |  |
| Effect | dialog Color Replace | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Color Replace | shows Animation | Figma (tabs) | works |  |
| Original color: #FF0000 | dialog Color Replace | does what its label says | Figma's same control | works |  |
| Target color: #000000 | dialog Color Replace | does what its label says | Figma's same control | works |  |
| Target color hex | dialog Color Replace | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Tolerance | dialog Color Replace | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Tolerance | dialog Color Replace | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Multi Color Replace, change effect | dialog Multi Color Replace | opens its menu | Figma | works |  |
| More | dialog Multi Color Replace | does what its label says | Figma's same control | works |  |
| Close | dialog Multi Color Replace | closes the window | Figma, T5 | works |  |
| Effect | dialog Multi Color Replace | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Multi Color Replace | shows Animation | Figma (tabs) | works |  |
| From 1: #FF0000 | dialog Multi Color Replace | does what its label says | Figma's same control | works |  |
| To 1: #FF0000 | dialog Multi Color Replace | does what its label says | Figma's same control | works |  |
| From 2: #00FF00 | dialog Multi Color Replace | does what its label says | Figma's same control | works |  |
| From 2 hex | dialog Multi Color Replace | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Radial Blur, change effect | dialog Radial Blur | opens its menu | Figma | works |  |
| More | dialog Radial Blur | does what its label says | Figma's same control | works |  |
| Close | dialog Radial Blur | closes the window | Figma, T5 | works |  |
| Effect | dialog Radial Blur | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Radial Blur | shows Animation | Figma (tabs) | works |  |
| Angle | dialog Radial Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Angle | dialog Radial Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Kernel size | dialog Radial Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Kernel size | dialog Radial Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Center X | dialog Radial Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Center Y | dialog Radial Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Zoom Blur, change effect | dialog Zoom Blur | opens its menu | Figma | works |  |
| More | dialog Zoom Blur | does what its label says | Figma's same control | works |  |
| Close | dialog Zoom Blur | closes the window | Figma, T5 | works |  |
| Effect | dialog Zoom Blur | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Zoom Blur | shows Animation | Figma (tabs) | works |  |
| Strength | dialog Zoom Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Inner radius | dialog Zoom Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Inner radius | dialog Zoom Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Center X | dialog Zoom Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Motion Blur, change effect | dialog Motion Blur | opens its menu | Figma | works |  |
| More | dialog Motion Blur | does what its label says | Figma's same control | works |  |
| Close | dialog Motion Blur | closes the window | Figma, T5 | works |  |
| Effect | dialog Motion Blur | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Motion Blur | shows Animation | Figma (tabs) | works |  |
| Velocity X | dialog Motion Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Velocity Y | dialog Motion Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Kernel size | dialog Motion Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Offset | dialog Motion Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Offset | dialog Motion Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Kawase Blur, change effect | dialog Kawase Blur | opens its menu | Figma | works |  |
| More | dialog Kawase Blur | does what its label says | Figma's same control | works |  |
| Close | dialog Kawase Blur | closes the window | Figma, T5 | works |  |
| Animation | dialog Kawase Blur | shows Animation | Figma (tabs) | works |  |
| Blur | dialog Kawase Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Blur | dialog Kawase Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Quality | dialog Kawase Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Quality | dialog Kawase Blur | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize all | dialog Kawase Blur | does what its label says | Figma's same control | works |  |
| Reset to defaults | dialog Kawase Blur | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Backdrop Blur, change effect | dialog Backdrop Blur | opens its menu | Figma | works |  |
| More | dialog Backdrop Blur | does what its label says | Figma's same control | works |  |
| Close | dialog Backdrop Blur | closes the window | Figma, T5 | works |  |
| Effect | dialog Backdrop Blur | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Backdrop Blur | shows Animation | Figma (tabs) | works |  |
| Tilt Shift, change effect | dialog Tilt Shift | opens its menu | Figma | works |  |
| More | dialog Tilt Shift | does what its label says | Figma's same control | works |  |
| Close | dialog Tilt Shift | closes the window | Figma, T5 | works |  |
| Effect | dialog Tilt Shift | shows Effect | Figma (tabs) | works | the tab already shown |
| Animation | dialog Tilt Shift | shows Animation | Figma (tabs) | works |  |
| Blur | dialog Tilt Shift | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Blur | dialog Tilt Shift | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Gradient blur | dialog Tilt Shift | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Gradient blur | dialog Tilt Shift | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Reset to defaults | dialog Tilt Shift | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Expand | dialog Line Screen | does what its label says | Figma's same control | works |  |
| Style | dialog Line Screen | opens its menu | Figma | works |  |
| Preset | dialog Line Screen | opens its menu | Figma | works |  |
| Close | dialog Line Screen | closes the window | Figma, T5 | works |  |
| Field Radial | dialog Line Screen | shows Field Radial | Figma (tabs) | works | already the current choice |
| Ramp 9 steps | dialog Line Screen | shows Ramp 9 steps | Figma (tabs) | works |  |
| Line Screen 43 rows | dialog Line Screen | shows Line Screen 43 rows | Figma (tabs) | works |  |
| Mask Circle | dialog Line Screen | shows Mask Circle | Figma (tabs) | works |  |
| Frame 128 px inset | dialog Line Screen | shows Frame 128 px inset | Figma (tabs) | works |  |
| Randomness Off | dialog Line Screen | shows Randomness Off | Figma (tabs) | works |  |
| Type | dialog Line Screen | opens its filter or sort menu | Figma (file browser) | works |  |
| Centre X | dialog Line Screen | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Centre Y | dialog Line Screen | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Radius X | dialog Line Screen | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Radius X | dialog Line Screen | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Advanced 1 more | dialog Line Screen | does what its label says | Figma's same control | works |  |
| Live preview | dialog Line Screen | turns the setting on or off | Figma | works |  |
| Reset | dialog Line Screen | does what its label says | Figma's same control | works | nothing changed yet: nothing to reset |
| Randomise | dialog Line Screen | does what its label says | Figma's same control | works |  |
| Cancel | dialog Line Screen | closes the window | Figma, T5 | works |  |
| Apply | dialog Line Screen | does what its label says | Figma's same control | works |  |
| Expand | dialog Stripe Array | does what its label says | Figma's same control | works |  |
| Style | dialog Stripe Array | opens its menu | Figma | works |  |
| Preset | dialog Stripe Array | opens its menu | Figma | works |  |
| Close | dialog Stripe Array | closes the window | Figma, T5 | works |  |
| Stripe Array 11 rows | dialog Stripe Array | shows Stripe Array 11 rows | Figma (tabs) | works | already the current choice |
| Frame 128 px inset | dialog Stripe Array | shows Frame 128 px inset | Figma (tabs) | works |  |
| Randomness Off | dialog Stripe Array | shows Randomness Off | Figma (tabs) | works |  |
| Rows | dialog Stripe Array | shows Rows | Figma (tabs) | works |  |
| Columns | dialog Stripe Array | shows Columns | Figma (tabs) | works |  |
| Count | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Angle | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Angle | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Width value A | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Width curve | dialog Stripe Array | opens its menu | Figma | works |  |
| Width value B | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Gap value A | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Gap curve | dialog Stripe Array | opens its menu | Figma | works |  |
| Gap value B | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| End value A | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| End curve | dialog Stripe Array | opens its menu | Figma | works |  |
| End value B | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Advanced 8 more | dialog Stripe Array | does what its label says | Figma's same control | works |  |
| Live preview | dialog Stripe Array | turns the setting on or off | Figma | works |  |
| Reset | dialog Stripe Array | does what its label says | Figma's same control | works | nothing changed yet: nothing to reset |
| Randomise | dialog Stripe Array | does what its label says | Figma's same control | works |  |
| Cancel | dialog Stripe Array | closes the window | Figma, T5 | works |  |
| Apply | dialog Stripe Array | does what its label says | Figma's same control | works |  |
| Expand | dialog Repeat | does what its label says | Figma's same control | works |  |
| Close | dialog Repeat | closes the window | Figma, T5 | works |  |
| Common Radial | dialog Repeat | shows Common Radial | Figma (tabs) | works | already the current choice |
| Radial 8 copies | dialog Repeat | shows Radial 8 copies | Figma (tabs) | works |  |
| Radial | dialog Repeat | shows Radial | Figma (tabs) | works | already the current choice |
| Grid | dialog Repeat | shows Grid | Figma (tabs) | works |  |
| Mirror | dialog Repeat | shows Mirror | Figma (tabs) | works |  |
| Source | dialog Repeat | opens its menu | Figma | works |  |
| Reverse overlap | dialog Repeat | turns the setting on or off | Figma | works |  |
| Live preview | dialog Repeat | turns the setting on or off | Figma | works |  |
| Reset | dialog Repeat | does what its label says | Figma's same control | works | nothing changed yet: nothing to reset |
| Randomise | dialog Repeat | does what its label says | Figma's same control | works |  |
| Cancel | dialog Repeat | closes the window | Figma, T5 | works |  |
| Apply | dialog Repeat | does what its label says | Figma's same control | works |  |
| Style | dialog Wave loop | opens its menu | Figma | works |  |
| Preset | dialog Wave loop | opens its menu | Figma | works |  |
| Close | dialog Wave loop | closes the window | Figma, T5 | works |  |
| Randomise | dialog Wave loop | shows Randomise | Figma (tabs) | works | already the current choice |
| Time | dialog Wave loop | shows Time | Figma (tabs) | works |  |
| Oscillator A | dialog Wave loop | shows Oscillator A | Figma (tabs) | works |  |
| Oscillator B | dialog Wave loop | shows Oscillator B | Figma (tabs) | works |  |
| Sync | dialog Wave loop | shows Sync | Figma (tabs) | works |  |
| Overlap | dialog Wave loop | shows Overlap | Figma (tabs) | works |  |
| Lines | dialog Wave loop | shows Lines | Figma (tabs) | works |  |
| Filter | dialog Wave loop | shows Filter | Figma (tabs) | works |  |
| Filter: piano | dialog Wave loop | shows Filter: piano | Figma (tabs) | works |  |
| Filter: warp | dialog Wave loop | shows Filter: warp | Figma (tabs) | works |  |
| Color | dialog Wave loop | shows Color | Figma (tabs) | works |  |
| Form | dialog Wave loop | shows Form | Figma (tabs) | works |  |
| random | dialog Wave loop | one click selects the value, Enter commits | S5.1, Figma | works |  |
| random | dialog Wave loop | one click selects the value, Enter commits | S5.1, Figma | works |  |
| randomSpread | dialog Wave loop | one click selects the value, Enter commits | S5.1, Figma | works |  |
| randomSpread | dialog Wave loop | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Reset | dialog Wave loop | does what its label says | Figma's same control | works | nothing changed yet: nothing to reset |
| Cancel | dialog Wave loop | closes the window | Figma, T5 | works |  |
| Apply | dialog Wave loop | does what its label says | Figma's same control | works |  |
| Disable effect | menu More | runs “Disable effect” | the row label; Figma's same row | works |  |
| Delete effect | menu More | runs “Delete effect” | the row label; Figma's same row | works |  |
| Morph | menu Mode | runs “Morph” | the row label; Figma's same row | works |  |
| Fade | menu Mode | runs “Fade” | the row label; Figma's same row | works |  |
| Random | menu Mode | runs “Random” | the row label; Figma's same row | works |  |
| Flat — uniform blend | menu Curve | runs “Flat — uniform blend” | the row label; Figma's same row | works |  |
| Linear — A → B | menu Curve | runs “Linear — A →” | the row label; Figma's same row | works |  |
| Reverse — B → A | menu Curve | runs “Reverse — B →” | the row label; Figma's same row | works |  |
| Ease in-out (S-curve) | menu Curve | runs “Ease in-out (S-curve)” | the row label; Figma's same row | works |  |
| Expo in (cubic) | menu Curve | runs “Expo in (cubic)” | the row label; Figma's same row | works |  |
| Expo out | menu Curve | runs “Expo out” | the row label; Figma's same row | works |  |
| Logarithmic | menu Curve | runs “Logarithmic” | the row label; Figma's same row | works |  |
| Sine wave | menu Curve | runs “Sine wave” | the row label; Figma's same row | works |  |
| Custom | menu Curve | runs “Custom” | the row label; Figma's same row | works |  |
| Piano, change effect | dialog Piano | opens its menu | Figma | works |  |
| More | dialog Piano | does what its label says | Figma's same control | works |  |
| Close | dialog Piano | closes the window | Figma, T5 | works |  |
| none | dialog Piano | opens its menu | Figma | works |  |
| Random set | dialog Piano | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Type settings | right rail | does what its label says | Figma's same control | works | opens the Type settings window (measured in the behaviour pass) |
| Blend mode | right rail | does what its label says | Figma's same control | works | read where the same control was reached: right rail |
| Opacity | right rail | one click selects the value, Enter commits | S5.1, Figma | works | as on the rectangle |
| Styles | right rail | opens the styles of that kind to apply one | Figma (Styles) | disabled, reason shown | random per load: read from its sibling Styles |
| Fill hex | right rail | one click selects the value, Enter commits | S5.1, Figma | works | read where the same control was reached: right rail |
| Gradient | dialog Color | does what its label says | Figma's same control | works | read where the same control was reached: dialog:Color |
| Extra Light Italic | menu Weight | runs “Extra Light Italic” | the row label; Figma's same row | works | a weight row; its siblings in the same menu set the weight |
| Blur | menu Shader effects | runs “Blur” | the row label; Figma's same row | works | read where the same control was reached: menu:Shader effects |
| Weight B | dialog Morph | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Weight B |
| Amount | dialog ASCII | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Close | dialog Kinetic type | closes the window | Figma, T5 | works | read where the same control was reached: dialog:Kinetic type |
| Amount | dialog Dither | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Amount | dialog Bitmap | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Paper hex | dialog Riso | one click selects the value, Enter commits | S5.1, Figma | works | writes the paper colour (re-run by hand) |
| Ink B hex | dialog Riso | one click selects the value, Enter commits | S5.1, Figma | works | writes the ink (re-run by hand) |
| Background hex | dialog Growing line | one click selects the value, Enter commits | S5.1, Figma | works | writes the background (re-run by hand) |
| Amount | dialog RGB Split | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Value | dialog HSV | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Value |
| Amount | dialog Brightness | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Amount | dialog Contrast | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Contrast | dialog Contrast | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Contrast |
| Close | dialog RGB | closes the window | Figma, T5 | works | read where the same control was reached: dialog:RGB |
| Amount | dialog Invert | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Amount | dialog Sepia | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Amount | dialog Grayscale | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Amount | dialog Enhance | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Amount |
| Lightness | dialog HSL Adjustment | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Lightness |
| More | dialog Color Gradient | does what its label says | Figma's same control | works | read where the same control was reached: dialog:Color Gradient |
| Color hex | dialog Color Overlay | one click selects the value, Enter commits | S5.1, Figma | works | writes the colour; at the default strength the canvas shows no change (re-run by hand) |
| Alpha | dialog Color Overlay | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Alpha |
| Original color hex | dialog Color Replace | one click selects the value, Enter commits | S5.1, Figma | works | writes the colour (re-run by hand) |
| From 0 hex | dialog Multi Color Replace | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling From 2 hex |
| To 0 hex | dialog Multi Color Replace | one click selects the value, Enter commits | S5.1, Figma | works | read where the same control was reached: dialog:Multi Color Replace |
| Strength | dialog Zoom Blur | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Strength |
| Center Y | dialog Zoom Blur | one click selects the value, Enter commits | S5.1, Figma | works | read where the same control was reached: dialog:Zoom Blur |
| Kernel size | dialog Motion Blur | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Kernel size |
| Effect | dialog Kawase Blur | shows Effect | Figma (tabs) | works | the tab already shown |
| Randomize all | dialog Tilt Shift | does what its label says | Figma's same control | works | read where the same control was reached: dialog:Tilt Shift |
| Count | dialog Stripe Array | one click selects the value, Enter commits | S5.1, Figma | works | random per load: read from its sibling Count |
| Filter: dash | dialog Wave loop | shows Filter: dash | Figma (tabs) | works | read where the same control was reached: dialog:Wave loop |

### Editor, a frame selected

| Control | Where | Should do | Source | State | Note |
|---|---|---|---|---|---|
| Frame | right rail | opens its menu | Figma | works | re-checked 2026-11-20 |
| Create component | right rail | makes the selection a component | Figma (header) | disabled, reason shown | tooltip: No components yet; re-checked 2026-11-20 |
| Use as mask | right rail | uses the layer as a mask | Figma (header) | disabled, reason shown | tooltip: A frame cannot be a mask; re-checked 2026-11-20 |
| Boolean operation | right rail | opens the boolean menu with every row | S10.2 | disabled, reason shown | tooltip: A frame cannot be combined; re-checked 2026-11-20 |
| Boolean operations | right rail | opens the boolean menu with every row | S10.2 | disabled, reason shown | tooltip: A frame cannot be combined; re-checked 2026-11-20 |
| Edit object | right rail | does what its label says | Figma's same control | disabled, reason shown | tooltip: A frame has no nodes; re-checked 2026-11-20 |
| Align left | right rail | does what its label says | Figma's same control | disabled, reason shown | tooltip: No other frame on this page to align to; dimmed as a group (a disabled fieldset) the driver presses through; re-checked 2026-11-20 |
| Align right | right rail | does what its label says | Figma's same control | disabled, reason shown | tooltip: No other frame on this page to align to; dimmed as a group (a disabled fieldset) the driver presses through; re-checked 2026-11-20 |
| Align horizontal centers | right rail | does what its label says | Figma's same control | disabled, reason shown | tooltip: No other frame on this page to align to; dimmed as a group (a disabled fieldset) the driver presses through; re-checked 2026-11-20 |
| Align top | right rail | does what its label says | Figma's same control | disabled, reason shown | tooltip: No other frame on this page to align to; dimmed as a group (a disabled fieldset) the driver presses through; re-checked 2026-11-20 |
| Align vertical centers | right rail | does what its label says | Figma's same control | disabled, reason shown | tooltip: No other frame on this page to align to; dimmed as a group (a disabled fieldset) the driver presses through; re-checked 2026-11-20 |
| Align bottom | right rail | does what its label says | Figma's same control | disabled, reason shown | tooltip: No other frame on this page to align to; dimmed as a group (a disabled fieldset) the driver presses through; re-checked 2026-11-20 |
| X position | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Y position | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Rotation | right rail | one click selects the value, Enter commits | S5.1, Figma | not on the screen | a frame does not rotate (R2): not drawn; re-checked 2026-11-20 |
| Rotate 90° left | right rail | does what its label says | Figma's same control | not on the screen | a frame does not rotate (R2): not drawn; re-checked 2026-11-20 |
| Flip horizontal | right rail | does what its label says | Figma's same control | works | re-checked 2026-11-20 |
| Flip vertical | right rail | does what its label says | Figma's same control | works | re-checked 2026-11-20 |
| Width | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Height | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Constrain proportions | right rail | does what its label says | Figma's same control | works | re-checked 2026-11-20 |
| Hide layer | right rail | does what its label says | Figma's same control | works | re-checked 2026-11-20 |
| Blend mode | right rail | does what its label says | Figma's same control | works | re-checked 2026-11-20 |
| Opacity | right rail | one click selects the value, Enter commits | S5.1, Figma | works | re-checked 2026-11-20 |
| Corner radius | right rail | one click selects the value, Enter commits | S5.1, Figma | works | re-checked 2026-11-20 |
| Independent corners | right rail | opens one field per corner | S10.1 | works |  |
| Styles | right rail | opens the styles of that kind to apply one | Figma (Styles) | disabled, reason shown | tooltip: No styles yet; re-checked 2026-11-20 |
| Add fill | right rail | adds a fill | Figma (Fill +) | disabled, reason shown | tooltip: One fill per frame; re-checked 2026-11-20 |
| Fill: #ffffff | right rail | does what its label says | Figma's same control | works | opens Color |
| Fill hex | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Fill opacity | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Hide fill | right rail | does what its label says | Figma's same control | works |  |
| Remove fill | right rail | does what its label says | Figma's same control | works |  |
| Styles | right rail | opens the styles of that kind to apply one | Figma (Styles) | disabled, reason shown | tooltip: No styles yet; re-checked 2026-11-20 |
| Add stroke | right rail | adds a stroke | Figma (Stroke +) | works | re-checked 2026-11-20 |
| Add effect | right rail | opens the Effects menu | R4.2, R8.1, Figma | works | re-checked 2026-11-20 |
| Add export | right rail | adds an export setting row | Figma (Export +) | works |  |
| Custom | dialog Color | shows Custom | Figma (tabs) | works | already the current choice |
| Libraries | dialog Color | shows Libraries | Figma (tabs) | works |  |
| Close | dialog Color | closes the window | Figma, T5 | works |  |
| Add style | dialog Color | opens the styles of that kind to apply one | Figma (Styles) | disabled, reason shown | tooltip: No styles yet; re-checked 2026-11-20 |
| Solid | dialog Color | does what its label says | Figma's same control | works | already the current choice |
| Gradient | dialog Color | does what its label says | Figma's same control | works |  |
| Pattern | dialog Color | does what its label says | Figma's same control | works |  |
| Image | dialog Color | does what its label says | Figma's same control | works |  |
| Video | dialog Color | does what its label says | Figma's same control | works |  |
| Saturation and brightness | dialog Color | does what its label says | Figma's same control | works |  |
| Eyedropper | dialog Color | does what its label says | Figma's same control | works | the stage takes the pipette cursor while the pick is armed and drops it on Escape (read on the stage's style); re-checked 2026-11-20 |
| Hue | dialog Color | does what its label says | Figma's same control | works |  |
| Opacity | dialog Color | does what its label says | Figma's same control | works |  |
| Hex | dialog Color | opens its menu | Figma | works |  |
| Hex | dialog Color | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Opacity | dialog Color | one click selects the value, Enter commits | S5.1, Figma | works |  |
| On this page | dialog Color | opens its menu | Figma | works |  |

### Editor, two selected

| Control | Where | Should do | Source | State | Note |
|---|---|---|---|---|---|
| Use as mask | right rail | uses the layer as a mask | Figma (header) | works |  |
| Boolean operations | right rail | opens the boolean menu with every row | S10.2 | works | opens Boolean |
| Unite | right rail | does what its label says | Figma's same control | works |  |
| More | right rail | does what its label says | Figma's same control | works | opens More |
| Align left | right rail | does what its label says | Figma's same control | works |  |
| Align horizontal centers | right rail | does what its label says | Figma's same control | works |  |
| Align right | right rail | does what its label says | Figma's same control | works |  |
| Align top | right rail | does what its label says | Figma's same control | works | the two share their top and height: nothing to move |
| Align vertical centers | right rail | does what its label says | Figma's same control | works | the two share their top and height: nothing to move |
| Align bottom | right rail | does what its label says | Figma's same control | works | the two share their top and height: nothing to move |
| X position | right rail | one click selects the value, Enter commits | S5.1, Figma | works | reads Mixed; the driver typed text, which is kept out (S10.3 measured W applying to both) |
| Y position | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Rotation | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Distribute horizontal spacing | right rail | does what its label says | Figma's same control | disabled, reason shown | tooltip: Needs three or more layers; dimmed as a group (a disabled fieldset) the driver presses through; re-checked 2026-11-20 |
| Distribute vertical spacing | right rail | does what its label says | Figma's same control | disabled, reason shown | tooltip: Needs three or more layers; dimmed as a group (a disabled fieldset) the driver presses through; re-checked 2026-11-20 |
| Width | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Height | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Gap between | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Hide layer | right rail | does what its label says | Figma's same control | works |  |
| Blend mode | right rail | does what its label says | Figma's same control | works | opens Blend mode |
| Opacity | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Corner radius | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Independent corners | right rail | opens one field per corner | S10.1 | works |  |
| Styles | right rail | opens the styles of that kind to apply one | Figma (Styles) | disabled, reason shown | tooltip: No styles yet; re-checked 2026-11-20 |
| Fill: #d9d9d9 | right rail | does what its label says | Figma's same control | works | opens Color |
| Fill hex | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Fill opacity | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Hide fill | right rail | does what its label says | Figma's same control | works |  |
| Remove fill | right rail | does what its label says | Figma's same control | works |  |
| Styles | right rail | opens the styles of that kind to apply one | Figma (Styles) | works |  |
| Add stroke | right rail | adds a stroke | Figma (Stroke +) | works |  |
| Add effect | right rail | opens the Effects menu | R4.2, R8.1, Figma | works | opens Add effect |
| Add export | right rail | adds an export setting row | Figma (Export +) | works |  |
| Unite | menu Boolean | runs “Unite” | the row label; Figma's same row | works |  |
| Subtract | menu Boolean | runs “Subtract” | the row label; Figma's same row | works |  |
| Intersect | menu Boolean | runs “Intersect” | the row label; Figma's same row | works |  |
| Exclude | menu Boolean | runs “Exclude” | the row label; Figma's same row | works |  |
| Group selection G | menu More | runs “Group selection” | the row label; Figma's same row | works |  |
| Normal | menu Blend mode | runs “Normal” | the row label; Figma's same row | works |  |
| Multiply | menu Blend mode | runs “Multiply” | the row label; Figma's same row | works |  |
| Screen | menu Blend mode | runs “Screen” | the row label; Figma's same row | works |  |
| Overlay | menu Blend mode | runs “Overlay” | the row label; Figma's same row | works |  |
| Soft light | menu Blend mode | runs “Soft light” | the row label; Figma's same row | works |  |
| Difference | menu Blend mode | runs “Difference” | the row label; Figma's same row | works |  |
| Custom | dialog Color | shows Custom | Figma (tabs) | works | already the current choice |
| Libraries | dialog Color | shows Libraries | Figma (tabs) | works |  |
| Add style | dialog Color | opens the styles of that kind to apply one | Figma (Styles) | disabled, reason shown | tooltip: No styles yet; re-checked 2026-11-20 |
| Close | dialog Color | closes the window | Figma, T5 | works |  |
| Solid | dialog Color | does what its label says | Figma's same control | works | already the current choice |
| Gradient | dialog Color | does what its label says | Figma's same control | works |  |
| Pattern | dialog Color | does what its label says | Figma's same control | works |  |
| Image | dialog Color | does what its label says | Figma's same control | works |  |
| Video | dialog Color | does what its label says | Figma's same control | works |  |
| Saturation and brightness | dialog Color | does what its label says | Figma's same control | works |  |
| Eyedropper | dialog Color | does what its label says | Figma's same control | works | the stage takes the pipette cursor while the pick is armed and drops it on Escape (read on the stage's style); re-checked 2026-11-20 |
| Hue | dialog Color | does what its label says | Figma's same control | works |  |
| Opacity | dialog Color | does what its label says | Figma's same control | works |  |
| Hex | dialog Color | opens its menu | Figma | works |  |
| Hex | dialog Color | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Opacity | dialog Color | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Layer effects | menu Add effect | opens its submenu | Figma (menus) | works | T1.2 was rebuilding this menu during the run; read from the one-layer menu |
| Shader effects | menu Add effect | opens its submenu | Figma (menus) | works | T1.2 was rebuilding this menu during the run; read from the one-layer menu |
| Vector effects | menu Add effect | opens its submenu | Figma (menus) | works | T1.2 was rebuilding this menu during the run; read from the one-layer menu |
| Generate | menu Add effect | opens its submenu | Figma (menus) | works | T1.2 was rebuilding this menu during the run; read from the one-layer menu |
| Tune | menu Add effect | runs “Tune” | the row label; Figma's same row | works |  |
| Morph | menu Add effect | runs “Morph” | the row label; Figma's same row | disabled, no reason |  |
| Line Swell | menu Add effect | runs “Line Swell” | the row label; Figma's same row | works |  |

### Labs

| Control | Where | Should do | Source | State | Note |
|---|---|---|---|---|---|
| Main menu | top rail | opens the one menu on the mark | his rulings (C3, kolbox system) | works | opens Main menu |
| Editor | top rail | shows Editor | Figma (tabs) | works |  |
| Labs | top rail | shows Labs | Figma (tabs) | works | already the current choice |
| Morph | top rail | shows Morph | Figma (tabs) | works |  |
| Preview | top rail | shows the work without chrome | Figma (Present) | works |  |
| Share | top rail | shares the file (invite or link) | Figma (Share) | disabled, reason shown | tooltip: Needs an account server; re-checked 2026-11-20 |
| Export | top rail | opens the Export window | C8 | works |  |
| Zoom | top rail | opens the zoom menu | Figma (zoom menu) | works | opens Zoom |
| Color | left rail | does what its label says | Figma's same control | works | opens Color Modes |
| Effects | left rail | does what its label says | Figma's same control | works |  |
| Generative | left rail | does what its label says | Figma's same control | works |  |
| Scanline | left rail | does what its label says | Figma's same control | works |  |
| Pattern | left rail | does what its label says | Figma's same control | works |  |
| Loops | left rail | does what its label says | Figma's same control | works |  |
| Math | left rail | does what its label says | Figma's same control | works |  |
| Penrose | left rail | does what its label says | Figma's same control | works |  |
| Flow | left rail | does what its label says | Figma's same control | works |  |
| Letter Gap | left rail | does what its label says | Figma's same control | works |  |
| Drift | left rail | does what its label says | Figma's same control | works |  |
| Line Swell | left rail | does what its label says | Figma's same control | works |  |
| Gradients | left rail | does what its label says | Figma's same control | works |  |
| Soft Forms | left rail | does what its label says | Figma's same control | works |  |
| 3D Scene | left rail | does what its label says | Figma's same control | works |  |
| Vector | left rail | does what its label says | Figma's same control | works |  |
| Composition | left rail | does what its label says | Figma's same control | works |  |
| Randomiser | left rail | does what its label says | Figma's same control | works |  |
| Play | dock | arms the tool or opens its fold | S2, Figma (dock) | works |  |
| Rewind | dock | arms the tool or opens its fold | S2, Figma (dock) | works | stopped at 0 s on open: nothing to rewind |
| Stop | dock | arms the tool or opens its fold | S2, Figma (dock) | works | stopped at 0 s on open: already stopped |
| Loop | dock | arms the tool or opens its fold | S2, Figma (dock) | works |  |
| Loop length in seconds | dock | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Undo | dock | arms the tool or opens its fold | S2, Figma (dock) | disabled, reason shown | tooltip: Undo Z |
| Redo | dock | arms the tool or opens its fold | S2, Figma (dock) | disabled, reason shown | tooltip: Redo ⇧ Z |
| Output | dock | arms the tool or opens its fold | S2, Figma (dock) | works | opens Output |
| File | dock | arms the tool or opens its fold | S2, Figma (dock) | works | opens File |
| Collapse navigation | dock | arms the tool or opens its fold | S2, Figma (dock) | works | opens float |
| Generate | right rail | shows Generate | Figma (tabs) | works | already the current choice |
| Style | right rail | shows Style | Figma (tabs) | works |  |
| Animation | right rail | shows Animation | Figma (tabs) | works |  |
| Flow | right rail | opens its menu | Figma | works | opens menu |
| Streamlines | right rail | opens its menu | Figma | works | opens menu |
| Previous preset (H) | right rail | does what its label says | Figma's same control | works |  |
| Obstacle flow | right rail | opens its menu | Figma | works | opens menu |
| Next preset (L) | right rail | does what its label says | Figma's same control | works |  |
| About this preset | right rail | does what its label says | Figma's same control | works | a hover card with the preset's note; a press adds nothing, as Figma's info glyphs |
| KOL | right rail | opens its menu | Figma | works | opens menu |
| Off | right rail | shows Off | Figma (tabs) | works |  |
| On | right rail | shows On | Figma (tabs) | works |  |
| Analogous | right rail | opens its menu | Figma | works | opens menu |
| Roll | right rail | does what its label says | Figma's same control | works |  |
| Edit in Color Modes | right rail | does what its label says | Figma's same control | works | opens Color Modes |
| Roll Background | right rail | does what its label says | Figma's same control | works |  |
| Roll Line color | right rail | does what its label says | Figma's same control | works |  |
| Roll Ring color | right rail | does what its label says | Figma's same control | works |  |
| Off | right rail | shows Off | Figma (tabs) | works |  |
| On | right rail | shows On | Figma (tabs) | works |  |
| Line count | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Line count | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Obstacles | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Obstacles | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Radius | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Radius | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Rings | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Rings | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Drift | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Drift | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Weight | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Weight | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Randomize type | right rail | does what its label says | Figma's same control | works |  |
| Randomize category | right rail | does what its label says | Figma's same control | works |  |
| Randomize preset | right rail | does what its label says | Figma's same control | works |  |
| Randomize settings | right rail | does what its label says | Figma's same control | works |  |
| What Settings rolls | right rail | does what its label says | Figma's same control | works | opens Randomize all rolls |
| Reset to defaults | right rail | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| Color | right rail | does what its label says | Figma's same control | works |  |
| Motion Form | right rail | does what its label says | Figma's same control | works |  |
| Actions… K | menu Main menu | runs “Actions…” | the row label; Figma's same row | works | opens Search |
| File | menu Main menu | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Window | menu Main menu | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Home | menu Main menu | runs “Home” | the row label; Figma's same row | works |  |
| Chromes | menu Main menu | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Dev | menu Main menu | runs “Dev” | the row label; Figma's same row | works |  |
| Media | menu Main menu | runs “Media” | the row label; Figma's same row | works | opens Media |
| Sign in | menu Main menu | runs “Sign in” | the row label; Figma's same row | works | opens Sign in |
| Settings… , | menu Main menu | runs “Settings…” | the row label; Figma's same row | works | opens Settings |
| Zoom in + | menu Zoom | runs “Zoom in” | the row label; Figma's same row | works |  |
| Zoom out − | menu Zoom | runs “Zoom out” | the row label; Figma's same row | works |  |
| Zoom to fit 0 | menu Zoom | runs “Zoom to fit” | the row label; Figma's same row | works |  |
| Zoom to 50% | menu Zoom | runs “Zoom to 50%” | the row label; Figma's same row | works |  |
| Zoom to 100% 1 | menu Zoom | runs “Zoom to 100%” | the row label; Figma's same row | works |  |
| Close | dialog Color Modes | closes the window | Figma, T5 | works |  |
| Base Analogous, 5 colors | dialog Color Modes | shows Base Analogous, 5 colors | Figma (tabs) | works | already the current choice |
| Colors 5 colors | dialog Color Modes | shows Colors 5 colors | Figma (tabs) | works | opens Color Modes |
| Palettes 9 saved | dialog Color Modes | shows Palettes 9 saved | Figma (tabs) | works | opens Color Modes |
| Base hex | dialog Color Modes | one click selects the value, Enter commits | S5.1, Figma | works | opens Color Modes |
| Relationship | dialog Color Modes | opens its menu | Figma | works | opens Relationship |
| Reset | dialog Color Modes | does what its label says | Figma's same control | works | nothing changed yet: nothing to reset |
| Roll | dialog Color Modes | does what its label says | Figma's same control | works |  |
| Cancel | dialog Color Modes | closes the window | Figma, T5 | works |  |
| Apply to layer | dialog Color Modes | does what its label says | Figma's same control | works |  |
| Apply to document | dialog Color Modes | does what its label says | Figma's same control | works |  |
| Close | dialog Output | closes the window | Figma, T5 | works |  |
| Aspect | dialog Output | opens its menu | Figma | works | opens Aspect |
| Export scale | dialog Output | opens its menu | Figma | works | opens Export scale |
| Export PNG | dialog Output | does what its label says | Figma's same control | works |  |
| Export options | dialog Output | does what its label says | Figma's same control | works | opens Export |
| Open output window | dialog Output | does what its label says | Figma's same control | works |  |
| Close | dialog File | closes the window | Figma, T5 | works |  |
| Save to file | dialog File | does what its label says | Figma's same control | works |  |
| Load from file | dialog File | does what its label says | Figma's same control | works |  |
| Off | dialog File | shows Off | Figma (tabs) | works | already the current choice |
| Mic | dialog File | shows Mic | Figma (tabs) | works |  |
| File | dialog File | shows File | Figma (tabs) | works |  |
| Expand navigation | dock | arms the tool or opens its fold | S2, Figma (dock) | works | opens float |
| Scanline | menu menu | runs “Scanline” | the row label; Figma's same row | works |  |
| Pattern | menu menu | runs “Pattern” | the row label; Figma's same row | works |  |
| Loops | menu menu | runs “Loops” | the row label; Figma's same row | works |  |
| Math | menu menu | runs “Math” | the row label; Figma's same row | works |  |
| Penrose | menu menu | runs “Penrose” | the row label; Figma's same row | works |  |
| Flow | menu menu | runs “Flow” | the row label; Figma's same row | works |  |
| Letter Gap | menu menu | runs “Letter Gap” | the row label; Figma's same row | works |  |
| Line Swell | menu menu | runs “Line Swell” | the row label; Figma's same row | works |  |
| Drift | menu menu | runs “Drift” | the row label; Figma's same row | works |  |
| Gradients | menu menu | runs “Gradients” | the row label; Figma's same row | works |  |
| 3D Scene | menu menu | runs “3D Scene” | the row label; Figma's same row | works |  |
| Streamlines | menu menu | runs “Streamlines” | the row label; Figma's same row | works |  |
| Glyphs | menu menu | runs “Glyphs” | the row label; Figma's same row | works |  |
| Cells | menu menu | runs “Cells” | the row label; Figma's same row | works |  |
| Growth | menu menu | runs “Growth” | the row label; Figma's same row | works |  |
| Obstacle flow | menu menu | runs “Obstacle flow” | the row label; Figma's same row | works |  |
| Obstacle flow dense | menu menu | runs “Obstacle flow dense” | the row label; Figma's same row | works |  |
| Charge lines | menu menu | runs “Charge lines” | the row label; Figma's same row | works |  |
| Charge lines pair | menu menu | runs “Charge lines pair” | the row label; Figma's same row | works |  |
| Dark | menu menu | runs “Dark” | the row label; Figma's same row | works |  |
| Paper | menu menu | runs “Paper” | the row label; Figma's same row | works |  |
| Mono | menu menu | runs “Mono” | the row label; Figma's same row | works |  |
| Amber | menu menu | runs “Amber” | the row label; Figma's same row | works |  |
| Ink | menu menu | runs “Ink” | the row label; Figma's same row | works |  |
| Slate | menu menu | runs “Slate” | the row label; Figma's same row | works |  |
| Plum | menu menu | runs “Plum” | the row label; Figma's same row | works |  |
| KOL | menu menu | runs “KOL” | the row label; Figma's same row | works |  |
| Analogous | menu menu | runs “Analogous” | the row label; Figma's same row | works |  |
| Split complementary | menu menu | runs “Split complementary” | the row label; Figma's same row | works |  |
| Triadic | menu menu | runs “Triadic” | the row label; Figma's same row | works |  |
| Tetradic | menu menu | runs “Tetradic” | the row label; Figma's same row | works |  |
| Monochromatic | menu menu | runs “Monochromatic” | the row label; Figma's same row | works |  |
| Random | menu menu | runs “Random” | the row label; Figma's same row | works |  |
| Close | dialog Randomize all rolls | closes the window | Figma, T5 | works |  |
| Color | dialog Randomize all rolls | turns the setting on or off | Figma | works |  |
| Motion Form | dialog Randomize all rolls | turns the setting on or off | Figma | works |  |
| Effects | dialog Randomize all rolls | turns the setting on or off | Figma | works |  |
| Done | dialog Randomize all rolls | does what its label says | Figma's same control | works |  |
| Save S | menu File | runs “Save” | the row label; Figma's same row | works | opens dialog |
| Files… O | menu File | runs “Files…” | the row label; Figma's same row | works | opens dialog |
| Export PNG | menu File | runs “Export PNG” | the row label; Figma's same row | works |  |
| Export loop (webm) | menu File | runs “Export loop (webm)” | the row label; Figma's same row | works |  |
| Output | menu Window | runs “Output” | the row label; Figma's same row | works | opens Output |
| File | menu Window | runs “File” | the row label; Figma's same row | works | opens File |
| Shortcuts S | menu Window | runs “Shortcuts” | the row label; Figma's same row | works | opens listbox |
| Settings , | menu Window | runs “Settings” | the row label; Figma's same row | works | opens Settings |
| Media | menu Window | runs “Media” | the row label; Figma's same row | works | opens Media |
| Home | menu Chromes | runs “Home” | the row label; Figma's same row | works |  |
| Editor | menu Chromes | runs “Editor” | the row label; Figma's same row | works |  |
| Library | menu Chromes | runs “Library” | the row label; Figma's same row | works |  |
| Labs | menu Chromes | runs “Labs” | the row label; Figma's same row | works |  |
| Randomiser | menu Chromes | runs “Randomiser” | the row label; Figma's same row | works |  |
| Morph | menu Chromes | runs “Morph” | the row label; Figma's same row | works |  |
| Close | dialog Sign in | closes the window | Figma, T5 | works |  |
| OK | dialog Sign in | does what its label says | Figma's same control | works |  |
| Color 1 hex | dialog Color Modes | one click selects the value, Enter commits | S5.1, Figma | works | opens Color Modes |
| Lock color 1 | dialog Color Modes | does what its label says | Figma's same control | works | opens Color Modes |
| Delete color 1 | dialog Color Modes | does what its label says | Figma's same control | works |  |
| Color 2 hex | dialog Color Modes | one click selects the value, Enter commits | S5.1, Figma | works | opens Color Modes |
| Delete color 2 | dialog Color Modes | does what its label says | Figma's same control | works |  |
| Lock color 2 | dialog Color Modes | does what its label says | Figma's same control | works | opens Color Modes |
| Delete color 3 | dialog Color Modes | does what its label says | Figma's same control | works |  |
| Lock color 3 | dialog Color Modes | does what its label says | Figma's same control | works | opens Color Modes |
| Color 4 hex | dialog Color Modes | one click selects the value, Enter commits | S5.1, Figma | works | opens Color Modes |
| Lock color 4 | dialog Color Modes | does what its label says | Figma's same control | works | opens Color Modes |
| Delete color 4 | dialog Color Modes | does what its label says | Figma's same control | works |  |
| Lock color 5 | dialog Color Modes | does what its label says | Figma's same control | works | opens Color Modes |
| Delete color 5 | dialog Color Modes | does what its label says | Figma's same control | works |  |
| Load palette | dialog Color Modes | opens its menu | Figma | works | opens Load palette |
| Save | dialog Color Modes | does what its label says | Figma's same control | works |  |
| Analogous | menu Relationship | runs “Analogous” | the row label; Figma's same row | works |  |
| Complementary | menu Relationship | runs “Complementary” | the row label; Figma's same row | works | opens Color Modes |
| Split complementary | menu Relationship | runs “Split complementary” | the row label; Figma's same row | works | opens Color Modes |
| Triadic | menu Relationship | runs “Triadic” | the row label; Figma's same row | works | opens Color Modes |
| Tetradic | menu Relationship | runs “Tetradic” | the row label; Figma's same row | works | opens Color Modes |
| Random | menu Relationship | runs “Random” | the row label; Figma's same row | works | opens Color Modes |
| Monochromatic | menu Relationship | runs “Monochromatic” | the row label; Figma's same row | works | opens Color Modes |
| 1:1 | menu Aspect | runs “1:1” | the row label; Figma's same row | works |  |
| 4:5 | menu Aspect | runs “4:5” | the row label; Figma's same row | works |  |
| 9:16 | menu Aspect | runs “9:16” | the row label; Figma's same row | works |  |
| 3:5 | menu Aspect | runs “3:5” | the row label; Figma's same row | works |  |
| 5:4 | menu Aspect | runs “5:4” | the row label; Figma's same row | works |  |
| 5:3 | menu Aspect | runs “5:3” | the row label; Figma's same row | works |  |
| 16:9 | menu Aspect | runs “16:9” | the row label; Figma's same row | works |  |
| @2x / 2160 × 2700 | menu Export scale | runs “@2x / 2160 × 2700” | the row label; Figma's same row | works |  |
| @1x / 1080 × 1350 | menu Export scale | runs “@1x / 1080 × 1350” | the row label; Figma's same row | works |  |
| @3x / 3240 × 4050 | menu Export scale | runs “@3x / 3240 × 4050” | the row label; Figma's same row | works |  |
| Export PNG | menu Export | runs “Export PNG” | the row label; Figma's same row | works |  |
| Record | menu Export | runs “Record” | the row label; Figma's same row | works |  |
| Export loop (webm) | menu Export | runs “Export loop (webm)” | the row label; Figma's same row | works |  |
| Batch export | menu Export | runs “Batch export” | the row label; Figma's same row | works | opens Batch export |
| Collapse navigation | dock | arms the tool or opens its fold | S2, Figma (dock) | works | opens float |
| Close | dialog dialog | closes the window | Figma, T5 | works |  |
| Files — back to the top | dialog dialog | does what its label says | Figma's same control | works |  |
| Display settings | dialog dialog | does what its label says | Figma's same control | works |  |
| Files | dialog dialog | does what its label says | Figma's same control | works |  |
| LIBRARY | dialog dialog | does what its label says | Figma's same control | works |  |
| PRESET | dialog dialog | does what its label says | Figma's same control | works | Copy path writes the clipboard, which the driver cannot read |
| Filter | dialog dialog | does what its label says | Figma's same control | works |  |
| Search | dialog dialog | filters as typed | Figma | works |  |
| Columns | dialog dialog | does what its label says | Figma's same control | works | already the current choice |
| Rows | dialog dialog | does what its label says | Figma's same control | works |  |
| Grid | dialog dialog | does what its label says | Figma's same control | works |  |
| Import | dialog dialog | does what its label says | Figma's same control | works |  |
| Name | dialog dialog | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Save current | dialog dialog | does what its label says | Figma's same control | disabled, reason shown | tooltip: Name it first; re-checked 2026-11-20 |
| Open | dialog dialog | does what its label says | Figma's same control | disabled, reason shown | tooltip: Select a file first; re-checked 2026-11-20 |
| Close | dialog Output | closes the window | Figma, T5 | works |  |
| Aspect | dialog Output | opens its menu | Figma | works |  |
| Export scale | dialog Output | opens its menu | Figma | works |  |
| Export PNG | dialog Output | does what its label says | Figma's same control | works |  |
| Export options | dialog Output | does what its label says | Figma's same control | works |  |
| Open output window | dialog Output | does what its label says | Figma's same control | works |  |
| Close | dialog File | closes the window | Figma, T5 | works |  |
| Save to file | dialog File | does what its label says | Figma's same control | works |  |
| Load from file | dialog File | does what its label says | Figma's same control | works |  |
| Off | dialog File | shows Off | Figma (tabs) | works | already the current choice |
| Mic | dialog File | shows Mic | Figma (tabs) | works |  |
| File | dialog File | shows File | Figma (tabs) | works |  |
| Tools | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Grab / orbit (Settings › Canvas › Grab in Labs) C | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| View | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Esc Close | dialog Shortcuts | closes the window | Figma, T5 | works |  |
| ↵ Collapse all | dialog Shortcuts | does what its label says | Figma's same control | works |  |
| Colors 5 colors, 1 locked | dialog Color Modes | shows Colors 5 colors, 1 locked | Figma (tabs) | works | already the current choice |
| Unlock color 1 | dialog Color Modes | does what its label says | Figma's same control | works |  |
| Color 2: #777777 | dialog Color Modes | does what its label says | Figma's same control | works |  |
| Load palette… | menu Load palette | runs “Load palette…” | the row label; Figma's same row | works |  |
| Dark | menu Load palette | runs “Dark” | the row label; Figma's same row | works |  |
| Paper | menu Load palette | runs “Paper” | the row label; Figma's same row | works |  |
| Blueprint | menu Load palette | runs “Blueprint” | the row label; Figma's same row | works |  |
| Mono | menu Load palette | runs “Mono” | the row label; Figma's same row | works |  |
| Amber | menu Load palette | runs “Amber” | the row label; Figma's same row | works |  |
| Ink | menu Load palette | runs “Ink” | the row label; Figma's same row | works |  |
| Slate | menu Load palette | runs “Slate” | the row label; Figma's same row | works |  |
| Plum | menu Load palette | runs “Plum” | the row label; Figma's same row | works |  |
| KOL | menu Load palette | runs “KOL” | the row label; Figma's same row | works |  |
| Base Complementary, 5 colors | dialog Color Modes | shows Base Complementary, 5 colors | Figma (tabs) | works | already the current choice |
| Base Split complementary, 5 colors | dialog Color Modes | shows Base Split complementary, 5 colors | Figma (tabs) | works | already the current choice |
| Base Triadic, 5 colors | dialog Color Modes | shows Base Triadic, 5 colors | Figma (tabs) | works | already the current choice |
| Base Tetradic, 5 colors | dialog Color Modes | shows Base Tetradic, 5 colors | Figma (tabs) | works | already the current choice |
| Base Random, 5 colors | dialog Color Modes | shows Base Random, 5 colors | Figma (tabs) | works | already the current choice |
| Base Monochromatic, 5 colors | dialog Color Modes | shows Base Monochromatic, 5 colors | Figma (tabs) | works | already the current choice |
| Close | dialog Batch export | closes the window | Figma, T5 | works |  |
| 1:1 | dialog Batch export | turns the setting on or off | Figma | works |  |
| 4:5 | dialog Batch export | turns the setting on or off | Figma | works |  |
| 3:5 | dialog Batch export | turns the setting on or off | Figma | works |  |
| 9:16 | dialog Batch export | turns the setting on or off | Figma | works |  |
| 5:4 | dialog Batch export | turns the setting on or off | Figma | works |  |
| 5:3 | dialog Batch export | turns the setting on or off | Figma | works |  |
| 16:9 | dialog Batch export | turns the setting on or off | Figma | works |  |
| @1x | dialog Batch export | turns the setting on or off | Figma | works |  |
| @2x | dialog Batch export | turns the setting on or off | Figma | works |  |
| @3x | dialog Batch export | turns the setting on or off | Figma | works |  |
| Export all | dialog Batch export | does what its label says | Figma's same control | works |  |
| Expand navigation | dock | arms the tool or opens its fold | S2, Figma (dock) | works |  |
| Pause | dock | arms the tool or opens its fold | S2, Figma (dock) | works | already the current choice |
| Soft Forms | menu menu | runs “Soft Forms” | the row label; Figma's same row | works |  |
| Blueprint | menu menu | runs “Blueprint” | the row label; Figma's same row | works |  |
| Complementary | menu menu | runs “Complementary” | the row label; Figma's same row | works |  |
| Base: #919191 | dialog Color Modes | does what its label says | Figma's same control | works |  |
| Base: #C0E0 | dialog Color Modes | does what its label says | Figma's same control | works | random per load: read from its sibling Base: #919191 |
| Base: #0C0C0 | dialog Color Modes | does what its label says | Figma's same control | works | random per load: read from its sibling Base: #919191 |
| Colors | dialog Color Modes | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Zoom | menu Zoom | runs “Zoom” | the row label; Figma's same row | not on the screen | the zoom is drawn on the editor only (T4.3); re-checked 2026-11-20 |
| Color 0: #CA0D0A | dialog Color Modes | does what its label says | Figma's same control | works | random per load: read from its sibling Color 2: #777777 |
| Color 0: #0D0C0 | dialog Color Modes | does what its label says | Figma's same control | works | random per load: read from its sibling Color 2: #777777 |
| Color 0: #FEEAF0 | dialog Color Modes | does what its label says | Figma's same control | works | random per load: read from its sibling Color 2: #777777 |
| Color 0: #0C0 | dialog Color Modes | does what its label says | Figma's same control | works | random per load: read from its sibling Color 2: #777777 |
| Color 0: #FAB0E | dialog Color Modes | does what its label says | Figma's same control | works | random per load: read from its sibling Color 2: #777777 |
| Color 3 hex | dialog Color Modes | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Color 0: #0 | dialog Color Modes | does what its label says | Figma's same control | works | random per load: read from its sibling Color 2: #777777 |
| Color 5 hex | dialog Color Modes | one click selects the value, Enter commits | S5.1, Figma | works |  |

### Morph

| Control | Where | Should do | Source | State | Note |
|---|---|---|---|---|---|
| Main menu | top rail | opens the one menu on the mark | his rulings (C3, kolbox system) | works | opens Main menu |
| Editor | top rail | shows Editor | Figma (tabs) | works |  |
| Labs | top rail | shows Labs | Figma (tabs) | works |  |
| Morph | top rail | shows Morph | Figma (tabs) | works | already the current choice |
| Preview | top rail | shows the work without chrome | Figma (Present) | works |  |
| Share | top rail | shares the file (invite or link) | Figma (Share) | disabled, reason shown | tooltip: Needs an account server; re-checked 2026-11-20 |
| Export | top rail | opens the Export window | C8 | works |  |
| Zoom | top rail | opens the zoom menu | Figma (zoom menu) | works | opens Zoom |
| Shape | left rail | does what its label says | Figma's same control | works |  |
| Blend | left rail | does what its label says | Figma's same control | works |  |
| Crossfade | left rail | does what its label says | Figma's same control | works |  |
| Play | left rail | does what its label says | Figma's same control | works |  |
| Add a key at the head | stage | does what its label says | Figma's same control | disabled, reason shown | tooltip: Select a layer to key; re-checked 2026-11-20 |
| Milliseconds | stage | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Seconds | stage | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Loop off | stage | does what its label says | Figma's same control | works |  |
| Fit the loop | stage | does what its label says | Figma's same control | disabled, reason shown | tooltip: The whole loop is in view; re-checked 2026-11-20 |
| Zoom the lanes | stage | does what its label says | Figma's same control | works |  |
| Expand the timeline | stage | does what its label says | Figma's same control | works |  |
| Timeline | right rail | does what its label says | Figma's same control | works | opens float |
| Shape | right rail | shows Shape | Figma (tabs) | works | already the current choice |
| Blend | right rail | shows Blend | Figma (tabs) | works |  |
| Crossfade | right rail | shows Crossfade | Figma (tabs) | works |  |
| Shape | right rail | opens its menu | Figma | works | opens menu |
| Loops | right rail | opens its menu | Figma | works | opens menu |
| kol-dd--kolbox | right rail | opens its menu | Figma | works |  |
| Add a step | right rail | does what its label says | Figma's same control | works | opens Add step |
| Ease in-out | right rail | opens its menu | Figma | works | opens menu |
| Loop | right rail | opens its menu | Figma | works | opens menu |
| Sync loop | right rail | turns the setting on or off | Figma | works |  |
| Resolution | right rail | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Actions… K | menu Main menu | runs “Actions…” | the row label; Figma's same row | works | opens Search |
| File | menu Main menu | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Window | menu Main menu | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Home | menu Main menu | runs “Home” | the row label; Figma's same row | works |  |
| Chromes | menu Main menu | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Dev | menu Main menu | runs “Dev” | the row label; Figma's same row | works |  |
| Media | menu Main menu | runs “Media” | the row label; Figma's same row | works | opens Media |
| Sign in | menu Main menu | runs “Sign in” | the row label; Figma's same row | works | opens Sign in |
| Settings… , | menu Main menu | runs “Settings…” | the row label; Figma's same row | works | opens Settings |
| Zoom | menu Zoom | runs “Zoom” | the row label; Figma's same row | not on the screen | the zoom is drawn on the editor only (T4.3); re-checked 2026-11-20 |
| Zoom in + | menu Zoom | runs “Zoom in” | the row label; Figma's same row | works |  |
| Zoom out − | menu Zoom | runs “Zoom out” | the row label; Figma's same row | works |  |
| Zoom to fit 0 | menu Zoom | runs “Zoom to fit” | the row label; Figma's same row | works |  |
| Zoom to 50% | menu Zoom | runs “Zoom to 50%” | the row label; Figma's same row | works |  |
| Zoom to 100% 1 | menu Zoom | runs “Zoom to 100%” | the row label; Figma's same row | works |  |
| Play | dock | arms the tool or opens its fold | S2, Figma (dock) | works |  |
| Pause | dock | arms the tool or opens its fold | S2, Figma (dock) | works | already the current choice |
| Rewind | dock | arms the tool or opens its fold | S2, Figma (dock) | works | stopped at 0 s on open: nothing to rewind |
| Stop | dock | arms the tool or opens its fold | S2, Figma (dock) | works | stopped at 0 s on open: already stopped |
| Loop | dock | arms the tool or opens its fold | S2, Figma (dock) | works |  |
| Loop length in seconds | dock | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Timeline | dock | arms the tool or opens its fold | S2, Figma (dock) | works |  |
| Shape | menu menu | runs “Shape” | the row label; Figma's same row | works |  |
| Blend | menu menu | runs “Blend” | the row label; Figma's same row | works |  |
| Crossfade | menu menu | runs “Crossfade” | the row label; Figma's same row | works |  |
| Loops | menu menu | runs “Loops” | the row label; Figma's same row | works |  |
| Math | menu menu | runs “Math” | the row label; Figma's same row | works |  |
| Field | menu menu | runs “Field” | the row label; Figma's same row | works |  |
| Close | dialog Add step | closes the window | Figma, T5 | works |  |
| Flow | menu menu | runs “Flow” | the row label; Figma's same row | works |  |
| Search presets and files | dialog Add step | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Simple 59 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Pattern 57 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Pattern Loops 30 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Penrose 48 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Field 26 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Scanline 30 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Optic 28 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Abstract 31 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Math 57 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Para-type 22 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Modulator 6 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Distressor 8 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Flow 15 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Letter gap 3 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Drift 18 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Gradients 22 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Soft forms 12 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Soft forms 3D 6 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| 3D scene 6 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Forms 8 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Environment 3 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Ribbon 13 | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Linear | menu menu | runs “Linear” | the row label; Figma's same row | works |  |
| Ease | menu menu | runs “Ease” | the row label; Figma's same row | works |  |
| Ease in | menu menu | runs “Ease in” | the row label; Figma's same row | works |  |
| Ease out | menu menu | runs “Ease out” | the row label; Figma's same row | works |  |
| Ease in-out | menu menu | runs “Ease in-out” | the row label; Figma's same row | works |  |
| Loop | menu menu | runs “Loop” | the row label; Figma's same row | works |  |
| Ping-pong | menu menu | runs “Ping-pong” | the row label; Figma's same row | works |  |
| Once | menu menu | runs “Once” | the row label; Figma's same row | works |  |
| Save S | menu File | runs “Save” | the row label; Figma's same row | works | opens dialog |
| Files… O | menu File | runs “Files…” | the row label; Figma's same row | works | opens dialog |
| Export PNG | menu File | runs “Export PNG” | the row label; Figma's same row | works |  |
| Export loop (webm) | menu File | runs “Export loop (webm)” | the row label; Figma's same row | works |  |
| Output | menu Window | runs “Output” | the row label; Figma's same row | works | opens Output |
| File | menu Window | runs “File” | the row label; Figma's same row | works | opens File |
| Shortcuts S | menu Window | runs “Shortcuts” | the row label; Figma's same row | works | opens listbox |
| Settings , | menu Window | runs “Settings” | the row label; Figma's same row | works | opens Settings |
| Media | menu Window | runs “Media” | the row label; Figma's same row | works | opens Media |
| Timeline | menu Window | runs “Timeline” | the row label; Figma's same row | works | opens float |
| Home | menu Chromes | runs “Home” | the row label; Figma's same row | works |  |
| Library | menu Chromes | runs “Library” | the row label; Figma's same row | works |  |
| Editor | menu Chromes | runs “Editor” | the row label; Figma's same row | works |  |
| Labs | menu Chromes | runs “Labs” | the row label; Figma's same row | works |  |
| Randomiser | menu Chromes | runs “Randomiser” | the row label; Figma's same row | works |  |
| Morph | menu Chromes | runs “Morph” | the row label; Figma's same row | works |  |
| Close | dialog Sign in | closes the window | Figma, T5 | works |  |
| OK | dialog Sign in | does what its label says | Figma's same control | works |  |
| All categories | dialog Add step | does what its label says | Figma's same control | works | opens Add step |
| Circle morph Discs | dialog Add step | does what its label says | Figma's same control | works |  |
| Circle morph ember Discs | dialog Add step | does what its label says | Figma's same control | works |  |
| Square ↔ circle Discs | dialog Add step | does what its label says | Figma's same control | works |  |
| Star morph Discs | dialog Add step | stars the file; Starred lists it | Figma (file browser), T3 | works |  |
| Heptagram Discs | dialog Add step | does what its label says | Figma's same control | works |  |
| Blob Discs | dialog Add step | does what its label says | Figma's same control | works |  |
| Blob spiky Discs | dialog Add step | does what its label says | Figma's same control | works |  |
| Lissajous 3:2 Curves | dialog Add step | does what its label says | Figma's same control | works |  |
| Lissajous 5:4 Curves | dialog Add step | does what its label says | Figma's same control | works |  |
| Spiral Curves | dialog Add step | does what its label says | Figma's same control | works |  |
| Spiral tight Curves | dialog Add step | does what its label says | Figma's same control | works |  |
| Rose 5 Curves | dialog Add step | does what its label says | Figma's same control | works |  |
| Monitor, three waves Curves | dialog Add step | does what its label says | Figma's same control | works |  |
| Monitor, one wave Curves | dialog Add step | does what its label says | Figma's same control | works |  |
| Monitor, dots only Curves | dialog Add step | does what its label says | Figma's same control | works |  |
| Rose 4 Curves | dialog Add step | does what its label says | Figma's same control | works |  |
| Ring, three circles Rings | dialog Add step | does what its label says | Figma's same control | works |  |
| Ring, fine Rings | dialog Add step | does what its label says | Figma's same control | works |  |
| Ring, bold Rings | dialog Add step | does what its label says | Figma's same control | works |  |
| Ring pulse Rings | dialog Add step | does what its label says | Figma's same control | works |  |
| Ring pulse dense Rings | dialog Add step | does what its label says | Figma's same control | works |  |
| Awning Stripes | dialog Add step | does what its label says | Figma's same control | works |  |
| Deckchair Stripes | dialog Add step | does what its label says | Figma's same control | works |  |
| Corduroy Stripes | dialog Add step | does what its label says | Figma's same control | works |  |
| Candy Stripes | dialog Add step | does what its label says | Figma's same control | works |  |
| Gradient bands Stripes | dialog Add step | does what its label says | Figma's same control | works |  |
| Barber Stripes | dialog Add step | does what its label says | Figma's same control | works |  |
| Chevron Stripes | dialog Add step | does what its label says | Figma's same control | works |  |
| Pinstripe Stripes | dialog Add step | does what its label says | Figma's same control | works |  |
| Venetian Stripes | dialog Add step | does what its label says | Figma's same control | works |  |
| Burberry Tartan | dialog Add step | does what its label says | Figma's same control | works |  |
| Gingham Tartan | dialog Add step | does what its label says | Figma's same control | works |  |
| Buffalo check Tartan | dialog Add step | does what its label says | Figma's same control | works |  |
| Madras Tartan | dialog Add step | does what its label says | Figma's same control | works |  |
| Windowpane Tartan | dialog Add step | does what its label says | Figma's same control | works |  |
| Black Watch Tartan | dialog Add step | does what its label says | Figma's same control | works |  |
| Royal Stewart Tartan | dialog Add step | does what its label says | Figma's same control | works |  |
| Glen plaid Tartan | dialog Add step | does what its label says | Figma's same control | works |  |
| Argyle Tartan | dialog Add step | does what its label says | Figma's same control | works |  |
| Houndstooth Tartan | dialog Add step | does what its label says | Figma's same control | works |  |
| Mega quad Blocks | dialog Add step | does what its label says | Figma's same control | works |  |
| Bauhaus Blocks | dialog Add step | does what its label says | Figma's same control | works |  |
| Plus checker Grids | dialog Add step | does what its label says | Figma's same control | works |  |
| Bar weave Grids | dialog Add step | does what its label says | Figma's same control | works |  |
| Diamond fade Grids | dialog Add step | does what its label says | Figma's same control | works |  |
| Circle tunnel Grids | dialog Add step | does what its label says | Figma's same control | works |  |
| Square diagonal Grids | dialog Add step | does what its label says | Figma's same control | works |  |
| Triangle tessellation Tessellations | dialog Add step | does what its label says | Figma's same control | works |  |
| Triangle alternate Tessellations | dialog Add step | does what its label says | Figma's same control | works |  |
| Hex honeycomb Tessellations | dialog Add step | does what its label says | Figma's same control | works |  |
| Brutgrid Tessellations | dialog Add step | does what its label says | Figma's same control | works |  |
| Plus mesh Tessellations | dialog Add step | does what its label says | Figma's same control | works |  |
| Abstract 01 Abstract | dialog Add step | does what its label says | Figma's same control | works |  |
| Abstract 02 Abstract | dialog Add step | does what its label says | Figma's same control | works |  |
| Abstract 03 Abstract | dialog Add step | does what its label says | Figma's same control | works |  |
| Abstract 06 Abstract | dialog Add step | does what its label says | Figma's same control | works |  |
| Abstract spin Abstract | dialog Add step | does what its label says | Figma's same control | works |  |
| Star scatter Flow | dialog Add step | stars the file; Starred lists it | Figma (file browser), T3 | works |  |
| Bar scroll Flow | dialog Add step | does what its label says | Figma's same control | works |  |
| Circle rings Flow | dialog Add step | does what its label says | Figma's same control | works |  |
| Hex flow Flow | dialog Add step | does what its label says | Figma's same control | works |  |
| Diamond zoom Flow | dialog Add step | does what its label says | Figma's same control | works |  |
| Vertical bars Stripes | dialog Add step | does what its label says | Figma's same control | works |  |
| Packing + Lloyd Packing | dialog Add step | does what its label says | Figma's same control | works |  |
| Circle packing (growing) Packing | dialog Add step | does what its label says | Figma's same control | works |  |
| Quadtree subdivision Packing | dialog Add step | does what its label says | Figma's same control | works |  |
| D3-force , SDF container Packing | dialog Add step | does what its label says | Figma's same control | works |  |
| Differential curve growth Growth | dialog Add step | does what its label says | Figma's same control | works |  |
| Space colonization Growth | dialog Add step | does what its label says | Figma's same control | works |  |
| Diffusion-limited aggregation Growth | dialog Add step | does what its label says | Figma's same control | works |  |
| L-system / fractal branch Growth | dialog Add step | does what its label says | Figma's same control | works |  |
| Boids / flocking Fields | dialog Add step | does what its label says | Figma's same control | works |  |
| Flow field Fields | dialog Add step | does what its label says | Figma's same control | works |  |
| Reaction-diffusion (Gray-Scott) Fields | dialog Add step | does what its label says | Figma's same control | works |  |
| Clifford attractor (SDF-clipped) Fields | dialog Add step | does what its label says | Figma's same control | works |  |
| Layered (pack × flow) Layered | dialog Add step | does what its label says | Figma's same control | works |  |
| Layered , predator–prey (A ↔ B) Layered | dialog Add step | does what its label says | Figma's same control | works |  |
| Triggered growth (click) Layered | dialog Add step | does what its label says | Figma's same control | works |  |
| Game of Life Reaction & Life | dialog Add step | does what its label says | Figma's same control | works |  |
| FitzHugh-Nagumo Reaction & Life | dialog Add step | does what its label says | Figma's same control | works |  |
| Seashell growth front Reaction & Life | dialog Add step | does what its label says | Figma's same control | works |  |
| Biomechanical tropism Reaction & Life | dialog Add step | does what its label says | Figma's same control | works |  |
| Phyllotaxis spiral fill Reaction & Life | dialog Add step | does what its label says | Figma's same control | works |  |
| Lenia Reaction & Life | dialog Add step | does what its label says | Figma's same control | works |  |
| Stripes Bands | dialog Add step | does what its label says | Figma's same control | works |  |
| Stripes hard Bands | dialog Add step | does what its label says | Figma's same control | works |  |
| Checker field Bands | dialog Add step | does what its label says | Figma's same control | works |  |
| Checker soft Bands | dialog Add step | does what its label says | Figma's same control | works |  |
| Halftone Bands | dialog Add step | does what its label says | Figma's same control | works |  |
| Gradient field Plasma | dialog Add step | does what its label says | Figma's same control | works |  |
| Halftone warm Bands | dialog Add step | does what its label says | Figma's same control | works |  |
| Gradient sunset Plasma | dialog Add step | does what its label says | Figma's same control | works |  |
| Plasma Plasma | dialog Add step | does what its label says | Figma's same control | works |  |
| Ice Plasma | dialog Add step | does what its label says | Figma's same control | works |  |
| Rings field Rings | dialog Add step | does what its label says | Figma's same control | works |  |
| Mono Rings | dialog Add step | does what its label says | Figma's same control | works |  |
| Interference Rings | dialog Add step | does what its label says | Figma's same control | works |  |
| Interference 5 Rings | dialog Add step | does what its label says | Figma's same control | works |  |
| Swirl Swirl | dialog Add step | does what its label says | Figma's same control | works |  |
| 8 arms Swirl | dialog Add step | does what its label says | Figma's same control | works |  |
| Tight Swirl | dialog Add step | does what its label says | Figma's same control | works |  |
| Mono Swirl | dialog Add step | does what its label says | Figma's same control | works |  |
| Moiré Moiré | dialog Add step | does what its label says | Figma's same control | works |  |
| Warm Moiré | dialog Add step | does what its label says | Figma's same control | works |  |
| Tight Moiré | dialog Add step | does what its label says | Figma's same control | works |  |
| Drift Spaced | dialog Add step | does what its label says | Figma's same control | works |  |
| Fine Spaced | dialog Add step | does what its label says | Figma's same control | works |  |
| Coarse Spaced | dialog Add step | does what its label says | Figma's same control | works |  |
| Waves Spaced | dialog Add step | does what its label says | Figma's same control | works |  |
| Columns Spaced | dialog Add step | does what its label says | Figma's same control | works |  |
| ASCII Glyph | dialog Add step | does what its label says | Figma's same control | works |  |
| Blocks Glyph | dialog Add step | does what its label says | Figma's same control | works |  |
| Binary Glyph | dialog Add step | does what its label says | Figma's same control | works |  |
| Dots Glyph | dialog Add step | does what its label says | Figma's same control | works |  |
| Dense Glyph | dialog Add step | does what its label says | Figma's same control | works |  |
| Mesh Lattice | dialog Add step | does what its label says | Figma's same control | works |  |
| Weave Lattice | dialog Add step | does what its label says | Figma's same control | works |  |
| Terrain Lattice | dialog Add step | does what its label says | Figma's same control | works |  |
| Fine Lattice | dialog Add step | does what its label says | Figma's same control | works |  |
| Bold Lattice | dialog Add step | does what its label says | Figma's same control | works |  |
| Swirl Vortex | dialog Add step | does what its label says | Figma's same control | works |  |
| Straight Vortex | dialog Add step | does what its label says | Figma's same control | works |  |
| Dense Vortex | dialog Add step | does what its label says | Figma's same control | works |  |
| Wide Vortex | dialog Add step | does what its label says | Figma's same control | works |  |
| Dash Vortex | dialog Add step | does what its label says | Figma's same control | works |  |
| Concentric Rings | dialog Add step | does what its label says | Figma's same control | works |  |
| Drekker Halftone | dialog Add step | does what its label says | Figma's same control | works |  |
| Sunset Halftone | dialog Add step | does what its label says | Figma's same control | works |  |
| Ice Halftone | dialog Add step | does what its label says | Figma's same control | works |  |
| Mono Halftone | dialog Add step | does what its label says | Figma's same control | works |  |
| Phyllotaxis Halftone | dialog Add step | does what its label says | Figma's same control | works |  |
| Rings Halftone | dialog Add step | does what its label says | Figma's same control | works |  |
| Dense Halftone | dialog Add step | does what its label says | Figma's same control | works |  |
| Spin Halftone | dialog Add step | does what its label says | Figma's same control | works |  |
| Interference Moiré | dialog Add step | does what its label says | Figma's same control | works |  |
| Concentric Moiré | dialog Add step | does what its label says | Figma's same control | works |  |
| Radial Moiré | dialog Add step | does what its label says | Figma's same control | works |  |
| Blood Moiré | dialog Add step | does what its label says | Figma's same control | works |  |
| Cyan rings Moiré | dialog Add step | does what its label says | Figma's same control | works |  |
| Gold Moiré | dialog Add step | does what its label says | Figma's same control | works |  |
| Soft Moiré | dialog Add step | does what its label says | Figma's same control | works |  |
| Mitosis Reaction | dialog Add step | does what its label says | Figma's same control | works |  |
| Maze Reaction | dialog Add step | does what its label says | Figma's same control | works |  |
| Spots Reaction | dialog Add step | does what its label says | Figma's same control | works |  |
| Coral Reaction | dialog Add step | does what its label says | Figma's same control | works |  |
| Worms Reaction | dialog Add step | does what its label says | Figma's same control | works |  |
| Ink coral Reaction | dialog Add step | does what its label says | Figma's same control | works |  |
| Solitons Reaction | dialog Add step | does what its label says | Figma's same control | works |  |
| Holes Reaction | dialog Add step | does what its label says | Figma's same control | works |  |
| Fingerprint Reaction | dialog Add step | does what its label says | Figma's same control | works |  |
| Pulse Reaction | dialog Add step | does what its label says | Figma's same control | works |  |
| Flow Reaction | dialog Add step | does what its label says | Figma's same control | works |  |
| Cells Reaction | dialog Add step | does what its label says | Figma's same control | works |  |
| Classic , Candy Turing | dialog Add step | does what its label says | Figma's same control | works |  |
| Classic , Spectrum Turing | dialog Add step | does what its label says | Figma's same control | works |  |
| Classic , Gold Turing | dialog Add step | does what its label says | Figma's same control | works |  |
| Classic , Ocean Turing | dialog Add step | does what its label says | Figma's same control | works |  |
| Classic , Mono Turing | dialog Add step | does what its label says | Figma's same control | works |  |
| Fine , Candy Turing | dialog Add step | does what its label says | Figma's same control | works |  |
| Fine , Spectrum Turing | dialog Add step | does what its label says | Figma's same control | works |  |
| Fine , Gold Turing | dialog Add step | does what its label says | Figma's same control | works |  |
| Fine , Ocean Turing | dialog Add step | does what its label says | Figma's same control | works |  |
| Fine , Mono Turing | dialog Add step | does what its label says | Figma's same control | works |  |
| Epicycle Waveforms | dialog Add step | does what its label says | Figma's same control | works |  |
| Harmonic Waveforms | dialog Add step | does what its label says | Figma's same control | works |  |
| Overtone Waveforms | dialog Add step | does what its label says | Figma's same control | works |  |
| Phasor Waveforms | dialog Add step | does what its label says | Figma's same control | works |  |
| Spectrum Waveforms | dialog Add step | does what its label says | Figma's same control | works |  |
| Resonance Waveforms | dialog Add step | does what its label says | Figma's same control | works |  |
| Animate Waveforms | dialog Add step | does what its label says | Figma's same control | works |  |
| Spinner Parametric | dialog Add step | does what its label says | Figma's same control | works |  |
| Weave Parametric | dialog Add step | does what its label says | Figma's same control | works |  |
| Mono Parametric | dialog Add step | does what its label says | Figma's same control | works |  |
| Calm Parametric | dialog Add step | does what its label says | Figma's same control | works |  |
| Bloom Parametric | dialog Add step | does what its label says | Figma's same control | works |  |
| Windmill Parametric | dialog Add step | does what its label says | Figma's same control | works |  |
| Heavy drag Parametric | dialog Add step | does what its label says | Figma's same control | works |  |
| Five-wing Parametric | dialog Add step | does what its label says | Figma's same control | works |  |
| Mono Parametric | dialog Add step | does what its label says | Figma's same control | works |  |
| Swarm Parametric | dialog Add step | does what its label says | Figma's same control | works |  |
| Rings Parametric | dialog Add step | does what its label says | Figma's same control | works |  |
| Ripple Parametric | dialog Add step | does what its label says | Figma's same control | works |  |
| Grid Parametric | dialog Add step | does what its label says | Figma's same control | works |  |
| Mesh Parametric | dialog Add step | does what its label says | Figma's same control | works |  |
| o Glyphs | dialog Add step | does what its label says | Figma's same control | works |  |
| l Glyphs | dialog Add step | does what its label says | Figma's same control | works |  |
| i Glyphs | dialog Add step | does what its label says | Figma's same control | works |  |
| d Glyphs | dialog Add step | does what its label says | Figma's same control | works |  |
| b Glyphs | dialog Add step | does what its label says | Figma's same control | works |  |
| p Glyphs | dialog Add step | does what its label says | Figma's same control | works |  |
| q Glyphs | dialog Add step | does what its label says | Figma's same control | works |  |
| c Glyphs | dialog Add step | does what its label says | Figma's same control | works |  |
| e Glyphs | dialog Add step | does what its label says | Figma's same control | works |  |
| n Glyphs | dialog Add step | does what its label says | Figma's same control | works |  |
| h Glyphs | dialog Add step | does what its label says | Figma's same control | works |  |
| m Glyphs | dialog Add step | does what its label says | Figma's same control | works |  |
| t Glyphs | dialog Add step | does what its label says | Figma's same control | works |  |
| Neutral Styles | dialog Add step | does what its label says | Figma's same control | works |  |
| Didone Styles | dialog Add step | does what its label says | Figma's same control | works |  |
| Geometric Styles | dialog Add step | does what its label says | Figma's same control | works |  |
| Humanist Styles | dialog Add step | does what its label says | Figma's same control | works |  |
| Heavy Styles | dialog Add step | does what its label says | Figma's same control | works |  |
| Spindly Styles | dialog Add step | does what its label says | Figma's same control | works |  |
| Tall Styles | dialog Add step | does what its label says | Figma's same control | works |  |
| Square Styles | dialog Add step | does what its label says | Figma's same control | works |  |
| Pulse Pulse | dialog Add step | does what its label says | Figma's same control | works |  |
| Deep Pulse | dialog Add step | does what its label says | Figma's same control | works |  |
| Soft Pulse | dialog Add step | does what its label says | Figma's same control | works |  |
| Weave Weave | dialog Add step | does what its label says | Figma's same control | works |  |
| Fine Weave | dialog Add step | does what its label says | Figma's same control | works |  |
| Drift Weave | dialog Add step | does what its label says | Figma's same control | works |  |
| Print press Erosion | dialog Add step | does what its label says | Figma's same control | works |  |
| Torn edge Erosion | dialog Add step | does what its label says | Figma's same control | works |  |
| Roughen Erosion | dialog Add step | does what its label says | Figma's same control | works |  |
| Hand-drawn Wobble | dialog Add step | does what its label says | Figma's same control | works |  |
| Noise crawl Wobble | dialog Add step | does what its label says | Figma's same control | works |  |
| Jitter Wobble | dialog Add step | does what its label says | Figma's same control | works |  |
| Ink spread Print | dialog Add step | does what its label says | Figma's same control | works |  |
| Misregister Print | dialog Add step | does what its label says | Figma's same control | works |  |
| Obstacle flow Streamlines | dialog Add step | does what its label says | Figma's same control | works |  |
| Obstacle flow dense Streamlines | dialog Add step | does what its label says | Figma's same control | works |  |
| Charge lines Streamlines | dialog Add step | does what its label says | Figma's same control | works |  |
| Charge lines pair Streamlines | dialog Add step | does what its label says | Figma's same control | works |  |
| Glyph vortex Glyphs | dialog Add step | does what its label says | Figma's same control | works |  |
| Glyph vortex n Glyphs | dialog Add step | does what its label says | Figma's same control | works |  |
| ASCII noise Glyphs | dialog Add step | does what its label says | Figma's same control | works |  |
| ASCII plasma Glyphs | dialog Add step | does what its label says | Figma's same control | works |  |
| ASCII rings Glyphs | dialog Add step | does what its label says | Figma's same control | works |  |
| Katakana vortex Glyphs | dialog Add step | does what its label says | Figma's same control | works |  |
| Voronoi pulse Cells | dialog Add step | does what its label says | Figma's same control | works |  |
| Voronoi pulse fine Cells | dialog Add step | does what its label says | Figma's same control | works |  |
| Growing line Growth | dialog Add step | does what its label says | Figma's same control | works |  |
| Growing orb Growth | dialog Add step | does what its label says | Figma's same control | works |  |
| Growing rings Growth | dialog Add step | does what its label says | Figma's same control | works |  |
| Rule Letter gap | dialog Add step | does what its label says | Figma's same control | works |  |
| Box Letter gap | dialog Add step | does what its label says | Figma's same control | works |  |
| Dot Letter gap | dialog Add step | does what its label says | Figma's same control | works |  |
| Storm Air | dialog Add step | does what its label says | Figma's same control | works |  |
| Clouds Air | dialog Add step | does what its label says | Figma's same control | works |  |
| Cumulus Air | dialog Add step | does what its label says | Figma's same control | works |  |
| Cirrus Air | dialog Add step | does what its label says | Figma's same control | works |  |
| Mist Air | dialog Add step | does what its label says | Figma's same control | works |  |
| Aurora Air | dialog Add step | does what its label says | Figma's same control | works |  |
| Ocean Water | dialog Add step | does what its label says | Figma's same control | works |  |
| Ripples Water | dialog Add step | does what its label says | Figma's same control | works |  |
| Caustics Water | dialog Add step | does what its label says | Figma's same control | works |  |
| Lake Water | dialog Add step | does what its label says | Figma's same control | works |  |
| Tide Water | dialog Add step | does what its label says | Figma's same control | works |  |
| Ink Water | dialog Add step | does what its label says | Figma's same control | works |  |
| Silk Cloth | dialog Add step | does what its label says | Figma's same control | works |  |
| Flag Cloth | dialog Add step | does what its label says | Figma's same control | works |  |
| Drape Cloth | dialog Add step | does what its label says | Figma's same control | works |  |
| Banner Cloth | dialog Add step | does what its label says | Figma's same control | works |  |
| Satin Cloth | dialog Add step | does what its label says | Figma's same control | works |  |
| Linen Cloth | dialog Add step | does what its label says | Figma's same control | works |  |
| Tunnel Tunnel | dialog Add step | does what its label says | Figma's same control | works |  |
| Halo Tunnel | dialog Add step | does what its label says | Figma's same control | works |  |
| Horizon Tunnel | dialog Add step | does what its label says | Figma's same control | works |  |
| Hex tunnel Tunnel | dialog Add step | does what its label says | Figma's same control | works |  |
| Star tunnel Tunnel | dialog Add step | stars the file; Starred lists it | Figma (file browser), T3 | works |  |
| Square tunnel Tunnel | dialog Add step | does what its label says | Figma's same control | works |  |
| Iris Tunnel | dialog Add step | does what its label says | Figma's same control | works |  |
| Triangle Tunnel | dialog Add step | does what its label says | Figma's same control | works |  |
| Star halo Tunnel | dialog Add step | stars the file; Starred lists it | Figma (file browser), T3 | works |  |
| Magma horizon Tunnel | dialog Add step | does what its label says | Figma's same control | works |  |
| Silk field Field | dialog Add step | does what its label says | Figma's same control | works |  |
| Banded Field | dialog Add step | does what its label says | Figma's same control | works |  |
| Radial bloom Field | dialog Add step | does what its label says | Figma's same control | works |  |
| Conic sweep Field | dialog Add step | does what its label says | Figma's same control | works |  |
| Monopole Pole | dialog Add step | does what its label says | Figma's same control | works |  |
| Multipole Pole | dialog Add step | does what its label says | Figma's same control | works |  |
| Mesh blend Pole | dialog Add step | does what its label says | Figma's same control | works |  |
| Aurora Pole | dialog Add step | does what its label says | Figma's same control | works |  |
| Blob Volume | dialog Add step | does what its label says | Figma's same control | works |  |
| Spiral Volume | dialog Add step | does what its label says | Figma's same control | works |  |
| Dome Volume | dialog Add step | does what its label says | Figma's same control | works |  |
| Ripple Volume | dialog Add step | does what its label says | Figma's same control | works |  |
| Trinity Stack | dialog Add step | does what its label says | Figma's same control | works |  |
| Hourglass Stack | dialog Add step | does what its label says | Figma's same control | works |  |
| Pair Stack | dialog Add step | does what its label says | Figma's same control | works |  |
| Kiss Stack | dialog Add step | does what its label says | Figma's same control | works |  |
| Teardrop Solo | dialog Add step | does what its label says | Figma's same control | works |  |
| Orb Solo | dialog Add step | does what its label says | Figma's same control | works |  |
| Pill Solo | dialog Add step | does what its label says | Figma's same control | works |  |
| Lozenge Solo | dialog Add step | does what its label says | Figma's same control | works |  |
| Lava Cluster | dialog Add step | does what its label says | Figma's same control | works |  |
| Bloom Cluster | dialog Add step | does what its label says | Figma's same control | works |  |
| Twins Cluster | dialog Add step | does what its label says | Figma's same control | works |  |
| Eclipse Cluster | dialog Add step | does what its label says | Figma's same control | works |  |
| Trio Forms | dialog Add step | does what its label says | Figma's same control | works |  |
| Stack Forms | dialog Add step | does what its label says | Figma's same control | works |  |
| Gem Forms | dialog Add step | does what its label says | Figma's same control | works |  |
| Binary Metaballs | dialog Add step | does what its label says | Figma's same control | works |  |
| Lava Metaballs | dialog Add step | does what its label says | Figma's same control | works |  |
| Eclipse Metaballs | dialog Add step | does what its label says | Figma's same control | works |  |
| Knot spin | dialog Add step | does what its label says | Figma's same control | works |  |
| Cube tumble | dialog Add step | does what its label says | Figma's same control | works |  |
| Sphere ring | dialog Add step | does what its label says | Figma's same control | works |  |
| Glass icosa | dialog Add step | does what its label says | Figma's same control | works |  |
| Model statue | dialog Add step | does what its label says | Figma's same control | works |  |
| Wire grid | dialog Add step | does what its label says | Figma's same control | works |  |
| Helix | dialog Add step | does what its label says | Figma's same control | works |  |
| Manta | dialog Add step | does what its label says | Figma's same control | works |  |
| Whale | dialog Add step | does what its label says | Figma's same control | works |  |
| Wing | dialog Add step | does what its label says | Figma's same control | works |  |
| Blob | dialog Add step | does what its label says | Figma's same control | works |  |
| Torus | dialog Add step | does what its label says | Figma's same control | works |  |
| Core | dialog Add step | does what its label says | Figma's same control | works |  |
| Squid | dialog Add step | does what its label says | Figma's same control | works |  |
| Mountain Range | dialog Add step | does what its label says | Figma's same control | works |  |
| Ocean | dialog Add step | does what its label says | Figma's same control | works |  |
| Tunnel | dialog Add step | does what its label says | Figma's same control | works |  |
| Puddle | dialog Add step | does what its label says | Figma's same control | works |  |
| Chrome | dialog Add step | does what its label says | Figma's same control | works |  |
| Ember | dialog Add step | does what its label says | Figma's same control | works |  |
| Coil | dialog Add step | does what its label says | Figma's same control | works |  |
| Cascade | dialog Add step | does what its label says | Figma's same control | works |  |
| Tower | dialog Add step | does what its label says | Figma's same control | works |  |
| Plunge | dialog Add step | does what its label says | Figma's same control | works |  |
| Braid | dialog Add step | does what its label says | Figma's same control | works |  |
| Fan | dialog Add step | does what its label says | Figma's same control | works |  |
| Arch | dialog Add step | does what its label says | Figma's same control | works |  |
| Wave | dialog Add step | does what its label says | Figma's same control | works |  |
| Knot | dialog Add step | does what its label says | Figma's same control | works |  |
| Slab | dialog Add step | does what its label says | Figma's same control | works |  |
| Close | dialog dialog | closes the window | Figma, T5 | works |  |
| Files — back to the top | dialog dialog | does what its label says | Figma's same control | works |  |
| Display settings | dialog dialog | does what its label says | Figma's same control | works |  |
| Files | dialog dialog | does what its label says | Figma's same control | works |  |
| LIBRARY | dialog dialog | does what its label says | Figma's same control | works |  |
| PRESET | dialog dialog | does what its label says | Figma's same control | works | Copy path writes the clipboard, which the driver cannot read |
| Filter | dialog dialog | does what its label says | Figma's same control | works |  |
| Search | dialog dialog | filters as typed | Figma | works |  |
| Columns | dialog dialog | does what its label says | Figma's same control | works | already the current choice |
| Rows | dialog dialog | does what its label says | Figma's same control | works |  |
| Grid | dialog dialog | does what its label says | Figma's same control | works |  |
| Import | dialog dialog | does what its label says | Figma's same control | works |  |
| Name | dialog dialog | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Save current | dialog dialog | does what its label says | Figma's same control | disabled, reason shown | tooltip: Name it first; re-checked 2026-11-20 |
| Open | dialog dialog | does what its label says | Figma's same control | disabled, reason shown | tooltip: Select a file first; re-checked 2026-11-20 |
| Close | dialog Output | closes the window | Figma, T5 | works |  |
| Aspect | dialog Output | opens its menu | Figma | works |  |
| Export scale | dialog Output | opens its menu | Figma | works |  |
| Export PNG | dialog Output | does what its label says | Figma's same control | works |  |
| Export options | dialog Output | does what its label says | Figma's same control | works |  |
| Open output window | dialog Output | does what its label says | Figma's same control | works |  |
| Save to file | dialog File | does what its label says | Figma's same control | works |  |
| Close | dialog File | closes the window | Figma, T5 | works |  |
| Load from file | dialog File | does what its label says | Figma's same control | works |  |
| Off | dialog File | shows Off | Figma (tabs) | works | already the current choice |
| Mic | dialog File | shows Mic | Figma (tabs) | works |  |
| File | dialog File | shows File | Figma (tabs) | works |  |
| Tools | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Grab / orbit (Settings › Canvas › Grab in Labs) C | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| View | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Esc Close | dialog Shortcuts | closes the window | Figma, T5 | works |  |
| ↵ Collapse all | dialog Shortcuts | does what its label says | Figma's same control | works |  |
| Play | dock | arms the tool or opens its fold | S2, Figma (dock) | works |  |
| Pause | dock | arms the tool or opens its fold | S2, Figma (dock) | works | already the current choice |
| Rewind | dock | arms the tool or opens its fold | S2, Figma (dock) | works | stopped at 0 s on open: nothing to rewind |
| Stop | dock | arms the tool or opens its fold | S2, Figma (dock) | works | stopped at 0 s on open: already stopped |
| Loop | dock | arms the tool or opens its fold | S2, Figma (dock) | works |  |
| Loop length in seconds | dock | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Timeline | dock | arms the tool or opens its fold | S2, Figma (dock) | works |  |
| Simple 59 | dialog Add step | does what its label says | Figma's same control | works |  |
| Pattern 57 | dialog Add step | does what its label says | Figma's same control | works |  |
| Pattern Loops 30 | dialog Add step | does what its label says | Figma's same control | works |  |
| Penrose 48 | dialog Add step | does what its label says | Figma's same control | works |  |
| Field 26 | dialog Add step | does what its label says | Figma's same control | works |  |
| Scanline 30 | dialog Add step | does what its label says | Figma's same control | works |  |
| Optic 28 | dialog Add step | does what its label says | Figma's same control | works |  |
| Abstract 31 | dialog Add step | does what its label says | Figma's same control | works |  |
| Math 57 | dialog Add step | does what its label says | Figma's same control | works |  |
| Para-type 22 | dialog Add step | does what its label says | Figma's same control | works |  |
| Modulator 6 | dialog Add step | does what its label says | Figma's same control | works |  |
| Distressor 8 | dialog Add step | does what its label says | Figma's same control | works |  |
| Flow 15 | dialog Add step | does what its label says | Figma's same control | works |  |
| Letter gap 3 | dialog Add step | does what its label says | Figma's same control | works |  |
| Drift 18 | dialog Add step | does what its label says | Figma's same control | works |  |
| Gradients 22 | dialog Add step | does what its label says | Figma's same control | works |  |
| Soft forms 12 | dialog Add step | does what its label says | Figma's same control | works |  |
| Soft forms 3D 6 | dialog Add step | does what its label says | Figma's same control | works |  |
| 3D scene 6 | dialog Add step | does what its label says | Figma's same control | works |  |
| Forms 8 | dialog Add step | does what its label says | Figma's same control | works |  |
| Environment 3 | dialog Add step | does what its label says | Figma's same control | works |  |
| Ribbon 13 | dialog Add step | does what its label says | Figma's same control | works |  |

### Randomiser

| Control | Where | Should do | Source | State | Note |
|---|---|---|---|---|---|
| Generate | dialog Randomiser | does what its label says | Figma's same control | works | opens Pick a generator |
| Main menu | left rail | opens the one menu on the mark | his rulings (C3, kolbox system) | works | opens Main menu |
| Effects | dialog Randomiser | does what its label says | Figma's same control | works | opens Randomiser |
| Scanline | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Loops | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Pattern | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Math | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Penrose | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Flow | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Letter Gap | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Line Swell | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Drift | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Gradients | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| 3D Scene | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Soft Forms | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Insert image or video | dialog Pick a generator | does what its label says | Figma's same control | works | opens Randomiser |
| Back | dialog Pick a generator | does what its label says | Figma's same control | works | opens Randomiser |
| Actions… K | menu Main menu | runs “Actions…” | the row label; Figma's same row | works | opens Search |
| Home | menu Main menu | runs “Home” | the row label; Figma's same row | works |  |
| Chromes | menu Main menu | opens its submenu | Figma (menus) | works | opens its submenu on hover |
| Dev | menu Main menu | runs “Dev” | the row label; Figma's same row | works |  |
| Media | menu Main menu | runs “Media” | the row label; Figma's same row | works | opens Media |
| Sign in | menu Main menu | runs “Sign in” | the row label; Figma's same row | works | opens Sign in |
| Settings… , | menu Main menu | runs “Settings…” | the row label; Figma's same row | works | opens Settings |
| From library | dialog Randomiser | does what its label says | Figma's same control | works | opens Media |
| Upload | dialog Randomiser | does what its label says | Figma's same control | works |  |
| Camera | dialog Randomiser | does what its label says | Figma's same control | works | re-checked 2026-11-20 |
| Back | dialog Randomiser | does what its label says | Figma's same control | works | opens Randomiser |
| From library | dialog Randomiser | does what its label says | Figma's same control | works | opens Media |
| Upload | dialog Randomiser | does what its label says | Figma's same control | works |  |
| Camera | dialog Randomiser | does what its label says | Figma's same control | works | re-checked 2026-11-20 |
| Back | dialog Randomiser | does what its label says | Figma's same control | works | opens Randomiser |
| Generate | dialog Randomiser | does what its label says | Figma's same control | works | opens Pick a generator |
| Effects | dialog Randomiser | does what its label says | Figma's same control | works | opens Randomiser |
| Home | menu Chromes | runs “Home” | the row label; Figma's same row | works |  |
| Library | menu Chromes | runs “Library” | the row label; Figma's same row | works |  |
| Editor | menu Chromes | runs “Editor” | the row label; Figma's same row | works |  |
| Labs | menu Chromes | runs “Labs” | the row label; Figma's same row | works |  |
| Randomiser | menu Chromes | runs “Randomiser” | the row label; Figma's same row | works |  |
| Morph | menu Chromes | runs “Morph” | the row label; Figma's same row | works |  |
| Close | dialog Sign in | closes the window | Figma, T5 | works |  |
| OK | dialog Sign in | does what its label says | Figma's same control | works |  |
| Generate | dialog Randomiser | does what its label says | Figma's same control | works |  |
| Effects | dialog Randomiser | does what its label says | Figma's same control | works |  |
| Scanline | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Pattern | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Loops | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Math | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Penrose | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Flow | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Letter Gap | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Line Swell | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Drift | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Gradients | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Soft Forms | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| 3D Scene | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Insert image or video | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| Back | dialog Pick a generator | does what its label says | Figma's same control | works |  |
| From library | dialog Randomiser | does what its label says | Figma's same control | works |  |
| Upload | dialog Randomiser | does what its label says | Figma's same control | works |  |
| Camera | dialog Randomiser | does what its label says | Figma's same control | works | re-checked 2026-11-20 |
| Back | dialog Randomiser | does what its label says | Figma's same control | works |  |

### Settings window

| Control | Where | Should do | Source | State | Note |
|---|---|---|---|---|---|
| Close | dialog Settings | closes the window | Figma, T5 | works |  |
| Settings | dialog Settings | shows Settings | Figma (tabs) | works | already the current choice |
| Shortcuts | dialog Settings | shows Shortcuts | Figma (tabs) | works |  |
| About | dialog Settings | shows About | Figma (tabs) | works | opens Settings |
| Theme | dialog Settings | opens its menu | Figma | works | opens Theme |
| Mode | dialog Settings | opens its menu | Figma | works | opens Mode |
| Style | dialog Settings | opens its menu | Figma | works | opens Style |
| Default aspect | dialog Settings | opens its menu | Figma | works | opens Default aspect |
| Loop theme | dialog Settings | opens its menu | Figma | works | opens Loop theme |
| Clip to frame | dialog Settings | turns the setting on or off | Figma | works |  |
| Modulation dots | dialog Settings | turns the setting on or off | Figma | works |  |
| Autoplay | dialog Settings | turns the setting on or off | Figma | works |  |
| Loop length | dialog Settings | opens its menu | Figma | works | opens Loop length |
| Reset to defaults | dialog Settings | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| https://github.com/Tor-Grimsson/kol-fxr | dialog Settings | does what its label says | Figma's same control | works |  |
| https://fxr.kolkrabbi.io | dialog Settings | does what its label says | Figma's same control | works | opens the page in a new tab |
| https://vercel.com/tor-grimssons-projects/kol-fxr | dialog Settings | does what its label says | Figma's same control | works |  |
| kolcore | menu Theme | runs “kolcore” | the row label; Figma's same row | works |  |
| kolbox | menu Theme | runs “kolbox” | the row label; Figma's same row | works |  |
| minimal | menu Theme | runs “minimal” | the row label; Figma's same row | works |  |
| folio | menu Theme | runs “folio” | the row label; Figma's same row | works |  |
| dark | menu Mode | runs “dark” | the row label; Figma's same row | works |  |
| light | menu Mode | runs “light” | the row label; Figma's same row | works |  |
| system | menu Mode | runs “system” | the row label; Figma's same row | works |  |
| Default | menu Style | runs “Default” | the row label; Figma's same row | works |  |
| Kolbox | menu Style | runs “Kolbox” | the row label; Figma's same row | works |  |
| 1:1 | menu Default aspect | runs “1:1” | the row label; Figma's same row | works |  |
| Dark | menu Loop theme | runs “Dark” | the row label; Figma's same row | works |  |
| Paper | menu Loop theme | runs “Paper” | the row label; Figma's same row | works |  |
| Blueprint | menu Loop theme | runs “Blueprint” | the row label; Figma's same row | works |  |
| Mono | menu Loop theme | runs “Mono” | the row label; Figma's same row | works |  |
| Amber | menu Loop theme | runs “Amber” | the row label; Figma's same row | works |  |
| Ink | menu Loop theme | runs “Ink” | the row label; Figma's same row | works |  |
| Slate | menu Loop theme | runs “Slate” | the row label; Figma's same row | works |  |
| Plum | menu Loop theme | runs “Plum” | the row label; Figma's same row | works |  |
| KOL | menu Loop theme | runs “KOL” | the row label; Figma's same row | works |  |
| 2 s | menu Loop length | runs “2” | the row label; Figma's same row | works |  |
| Close | dialog Display settings | closes the window | Figma, T5 | works |  |
| Settings | dialog Display settings | shows Settings | Figma (tabs) | works | already the current choice |
| Shortcuts | dialog Display settings | shows Shortcuts | Figma (tabs) | works |  |
| About | dialog Display settings | shows About | Figma (tabs) | works | opens Display settings |
| Theme | dialog Display settings | opens its menu | Figma | works | opens Theme |
| Mode | dialog Display settings | opens its menu | Figma | works | opens Mode |
| Style | dialog Display settings | opens its menu | Figma | works | opens Style |
| Preview resolution | dialog Display settings | opens its menu | Figma | works | opens Preview resolution |
| Default aspect | dialog Display settings | opens its menu | Figma | works | opens Default aspect |
| Loop theme | dialog Display settings | opens its menu | Figma | works | opens Loop theme |
| Clip to frame | dialog Display settings | turns the setting on or off | Figma | works |  |
| Modulation dots | dialog Display settings | turns the setting on or off | Figma | works |  |
| Grab (C) | dialog Display settings | turns the setting on or off | Figma | works |  |
| Interactions | dialog Display settings | turns the setting on or off | Figma | works |  |
| Zoom lock (Z) | dialog Display settings | turns the setting on or off | Figma | works |  |
| Autoplay | dialog Display settings | turns the setting on or off | Figma | works |  |
| Loop length | dialog Display settings | opens its menu | Figma | works | opens Loop length |
| Show grid | dialog Display settings | turns the setting on or off | Figma | works |  |
| Reset to defaults | dialog Display settings | does what its label says | Figma's same control | works | at defaults already: nothing to reset |
| https://github.com/Tor-Grimsson/kol-fxr | dialog Display settings | does what its label says | Figma's same control | works | opens the page in a new tab (re-run by hand) |
| https://fxr.kolkrabbi.io | dialog Display settings | does what its label says | Figma's same control | works |  |
| https://vercel.com/tor-grimssons-projects/kol-fxr | dialog Display settings | does what its label says | Figma's same control | works |  |
| Full | menu Preview resolution | runs “Full” | the row label; Figma's same row | works |  |
| Half | menu Preview resolution | runs “Half” | the row label; Figma's same row | works |  |

### Search modal

| Control | Where | Should do | Source | State | Note |
|---|---|---|---|---|---|
| Search | dialog Search | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Overview | dialog Search | shows Overview | Figma (tabs) | works | already the current choice |
| Actions | dialog Search | shows Actions | Figma (tabs) | works | opens listbox |
| Tools | dialog Search | shows Tools | Figma (tabs) | works |  |
| Pages | dialog Search | shows Pages | Figma (tabs) | works | opens listbox |
| Poster draft Edited Nov 19, 09:35 PM | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Flow study Edited Nov 19, 06:35 PM | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Type specimen Edited Nov 18, 09:35 PM | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Pattern tile Edited Nov 17, 09:35 PM | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Morph study Edited Nov 16, 11:35 PM | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Launch card Edited Nov 15, 11:36 PM | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Penrose tiling Edited Nov 14, 01:36 PM | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Shape study Edited Nov 13, 05:36 PM | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Story frame Edited Nov 11, 03:36 PM | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Curve study Edited Nov 9, 03:36 AM | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Leaf form Edited Nov 6, 05:36 AM | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Scanline study Edited Nov 2, 09:36 PM | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Morph loop Edited Oct 29, 07:36 AM | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Header lockup Edited Oct 21, 07:36 PM | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Esc Close | dialog Search | closes the window | Figma, T5 | works |  |
| ↵ Collapse all | dialog Search | does what its label says | Figma's same control | works | opens Search |
| Home FXR | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Home FXR › Chromes | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Library FXR › Chromes | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Editor FXR › Chromes | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Labs FXR › Chromes | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Randomiser FXR › Chromes | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Morph FXR › Chromes | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Dev FXR | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Media FXR | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Sign in FXR | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Settings… , | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Home Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Library Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Editor Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Labs Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Randomiser Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Morph Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Dev Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Media Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Sign in Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Settings Page | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| ↵ Expand all | dialog Search | does what its label says | Figma's same control | works |  |
| View | listbox listbox | runs or opens what the row names | C5 (search modal) | works | opens Search |
| Show/hide grid G | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Show / hide rail \ | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| OK | dialog Sign in | does what its label says | Figma's same control | works |  |
| Close | dialog Sign in | closes the window | Figma, T5 | works |  |
| Edit | listbox listbox | runs or opens what the row names | C5 (search modal) | works | opens listbox |
| Redo ⇧ | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Undo Z | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| New File | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Files… O | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Text T | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Rectangle R | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Pen P | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Select V | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Zoom Z | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Insert image Not wired | listbox listbox | runs or opens what the row names | C5 (search modal) | not on the screen | the row now reads Insert image and opens the file picker (T3.2, group (a)'s check); re-checked 2026-11-20 |
| Ellipse O | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Pattern | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Hand | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Orbit C | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Selection | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Deselect Esc | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Group selection G | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Ungroup ⇧ | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Layer | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Toggle lock L | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Toggle visibility H | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Flip horizontal ⇧ | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Flip vertical ⇧ | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Nudge ← 1px ← | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Search files | dialog Search | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Convert to path ⇧ | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Tools | listbox listbox | runs or opens what the row names | C5 (search modal) | works | opens listbox |
| Grab / orbit (Settings › Canvas › Grab in Labs) C | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Show / hide shortcuts S | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Files O | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Save patch S | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Show / hide settings , | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Show / hide modulation dots M | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Play / pause , hold + drag to pan Space | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Toggle fps readout ⇧ | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Labs | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Reset to defaults R | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Zoom the stage in + | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Zoom the stage out - | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Fit the stage 0 | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Zoom lock (Settings › Canvas) Z | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Previous preset (or ←) H | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Next preset (or →) L | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Previous category (or ↑) K | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Next category (or ↓) J | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |
| Reroll ⇧ | listbox listbox | runs or opens what the row names | C5 (search modal) | works |  |

### Media window

| Control | Where | Should do | Source | State | Note |
|---|---|---|---|---|---|
| Bucket | dialog Media | opens its menu | Figma | works | opens Bucket |
| Display settings | dialog Media | does what its label says | Figma's same control | disabled, reason shown | 2026-11-20: tooltip: Display settings are in the Library |
| Close | dialog Media | closes the window | Figma, T5 | works |  |
| Media | dialog Media | does what its label says | Figma's same control | not on the screen | no longer drawn in the Media window; re-checked 2026-11-20 |
| R2 , kol-media | dialog Media | does what its label says | Figma's same control | works | the current bucket, its menu row is the same |
| Filter | dialog Media | does what its label says | Figma's same control | disabled, reason shown | 2026-11-20: tooltip: Filters are in the Library; Search finds by name here |
| Search | dialog Media | filters as typed | Figma | works | opens Media |
| Columns | dialog Media | does what its label says | Figma's same control | works | already the current choice |
| Rows | dialog Media | does what its label says | Figma's same control | works |  |
| Grid | dialog Media | does what its label says | Figma's same control | works | opens Media |
| audio | dialog Media | does what its label says | Figma's same control | works | opens Media |
| code | dialog Media | does what its label says | Figma's same control | works | opens Media |
| docs | dialog Media | does what its label says | Figma's same control | works | opens Media |
| fonts | dialog Media | does what its label says | Figma's same control | works | opens Media |
| img | dialog Media | does what its label says | Figma's same control | works | opens Media |
| misc | dialog Media | does what its label says | Figma's same control | works | opens Media |
| video | dialog Media | does what its label says | Figma's same control | works | opens Media |
| README.md 5.9 KB | dialog Media | does what its label says | Figma's same control | works |  |
| Row size | dialog Media | one click selects the value, Enter commits | S5.1, Figma | works |  |
| Cancel | dialog Media | closes the window | Figma, T5 | works |  |
| Use | dialog Media | does what its label says | Figma's same control | disabled, reason shown | tooltip: Select a file first; re-checked 2026-11-20 |
| R2 , kol-media | menu Bucket | runs “R2 , kol-media” | the row label; Figma's same row | works |  |
| B2 , website | menu Bucket | runs “B2 , website” | the row label; Figma's same row | works |  |
| R2 , private | menu Bucket | runs “R2 , private” | the row label; Figma's same row | works |  |
| Search this bucket | dialog Media | one click selects the value, Enter commits | S5.1, Figma | works |  |
| README.md | dialog Media | does what its label says | Figma's same control | works |  |
| andvaka.mp3 235.6 KB | dialog Media | does what its label says | Figma's same control | works |  |
| casino.mp3 287.1 KB | dialog Media | does what its label says | Figma's same control | works |  |
| dobani.wav 646.1 KB | dialog Media | does what its label says | Figma's same control | works |  |
| invaders.flac 920.1 KB | dialog Media | does what its label says | Figma's same control | works |  |
| client.js 2.6 KB | dialog Media | does what its label says | Figma's same control | works |  |
| kol-core.css 2.1 KB | dialog Media | does what its label says | Figma's same control | works |  |
| 01-tier-rules.md 5.5 KB | dialog Media | does what its label says | Figma's same control | works |  |
| credits.txt 1.3 KB | dialog Media | does what its label says | Figma's same control | works |  |
| kol-kerner.pdf 480.2 KB | dialog Media | does what its label says | Figma's same control | works |  |
| package.json 920 B | dialog Media | does what its label says | Figma's same control | works |  |
| pnpm-workspace.yaml 101 B | dialog Media | does what its label says | Figma's same control | works |  |
| readme.zip 2.7 KB | dialog Media | does what its label says | Figma's same control | works |  |
| PPRightGrotesk-Fine.woff2 47.5 KB | dialog Media | does what its label says | Figma's same control | works |  |
| TGRotVF.ttf 67.7 KB | dialog Media | does what its label says | Figma's same control | works |  |
| 01-shoots | dialog Media | does what its label says | Figma's same control | works |  |
| 02-products | dialog Media | does what its label says | Figma's same control | works |  |
| .gitignore 232 B | dialog Media | does what its label says | Figma's same control | works |  |
| reels | dialog Media | does what its label says | Figma's same control | works |  |
| softforms-stream | dialog Media | does what its label says | Figma's same control | works |  |
| optic-reaction.mp4 831.6 KB | dialog Media | does what its label says | Figma's same control | works |  |

