# Plan — Kolbox: what is left, Figma and code

**Raised:** 2026-11-19, his words: "lets load a plan figma and code work, so what is left?". Everything here is carried from `plan-2026-11-18-kolbox-system.md` (the full record, with his words per item) and from the live pass logged in `session-log/2026-11-19-kolbox-kit-into-the-ds-and-live-tuning.md`. This file is the short working list; the old plan stays as history.
**SUPERSEDED for building 2026-11-20:** everything still open is in `plan-2026-11-20-kolbox-everything-left.md` (W1 to W14, one numbering). This file is the record.
**Status:** F1 to F4 and C1 to C9.2 built 2026-11-19 (each driven once by its agent, none seen by him before his review). His review that evening found 18 faults: section R below, built the same night except R4.1 (text settings, waits for his reference). His second look in `pnpm editor` found more: section S, built 2026-11-19 on his go with R4.1 and C3 batch 8 (`apps/kolbox` is in `_tmp/2026-11-19-kolbox-app-retired/`). The Figma pass is done (values, dock, re-point, the day's new parts); his publish and accept are owed. Section T (gaps, bugs, the audit) is DRAFT, on his go. C9.3 publish on his word. Built before this plan: the kit in the DS packages, the glyphs in `kol-icons`, all 154 masters in the library with atoms and molecules folded, the tuner package and app, the `lineSwell` styles and loops, the generator window, the layer model (built, unseen), controls at 24, and the live look pass.
**Shape:** W › phase › list. F = Figma, C = code.
**Laws carried:** one Figma agent at a time; Figma publishing is his click; nothing is deleted (`_trash` with `_` in Figma, `_tmp/` in the repo); the fold never changes kolbox's look; copy the code, never choose; `variant` is the only word for a look; kolbox is a style and `pnpm editor` is the editor; no git, no publish to npm without his word.
**How a phase closes:** ONE check at the end, the one that covers the change: the thing is driven once in the running app (or read once in the file) against its acceptance line, and looked at. No before and after censuses, no pixel diffs of other looks, no repo-wide validate, no second app or theme unless the change is about that. His words: "how many final validations can there be".

---

## F1 — Finish moving the masters

Cause: Figma's call limit stopped two passes on 2026-11-18. The recipe, maps and scripts are in `_tmp/2026-11-18-kolbox-migration/` (`figma-paste-recipe.md`, `fold-map.json`, `figma-repoint-kolbox.js`, `fold-org-unsent.js`).

### 1.1 — Re-point the kolbox file
- `↳ Layout UI` in `SgfHBi22F7tYO7GHIorUbv` still shows old cached masters for the folded molecules (Rail 77, RailSection 315, ListRow 432, Tabs 41, SplitButton 34, PropertyRow 191, IconGroup 98, FillRow 67, Menu 17, Tab 128, Avatar 19). He accepted the update since; first read which are still old, then swap only those.
- Acceptance: 0 instances on `↳ Layout UI` resolving to a retired `_` variant or a missing master (the file's own `_` helpers and the utility library's doc parts excepted).

### 1.2 — Fold organisms, modules and utilities
- Mapped, not built (the recipe's last section). Each joins its KOL master as `variant=kolbox` or sits beside it as `X kolbox`, as float is carried. The 15 nested old instances inside ModalTabs, ModalCheckRow, LabeledControl and Popover are re-nested here; `skip-back` is added to kolbox's Icon set.
- Acceptance: the six "Kolbox" sections in the library hold only what F3 lists; the dry run against `↳ Layout UI` maps every instance, 0 unmapped.

### 1.3 — His publish, then the last re-point
- He publishes the library and accepts the update in the kolbox file; the script runs once more.
- Acceptance: as 1.1, for every folded part.
- ✅ 2026-11-19, read again in kolbox `↳ Layout UI`: 9168 instances, 0 on a missing master, 0 on a retired `_` variant (only the excepted helpers: utility library `_Header` 47, `_Footer` 47, `_Annotation` 8; the file's own `_Toolbar`, `_Button`, `_Icon`, `_Divider`). Today's library edits (the ladder, ButtonSplit kolbox icon form, ToolRail kolbox) reach the file after his next publish and accept; the 22 editor docks keep the master's slot content, so they follow.

## F2 — The library catches up with the live look

Cause: the look changed in code on 2026-11-19 and nothing in Figma followed (nothing syncs by itself).

### 2.1 — Values
- Kolbox light: the near-neutral grounds and the rust accent `#9c4a1e` (table in `_tmp/2026-11-18-kolbox-light/values.md`). Kolbox dark: UI text `#ffffff`. The control height 24 (`kolbox` size set; list in `_tmp/2026-11-19-kolbox-24/notes.md`). The section title on a 16 line. The kolbox text styles' weights: rows and controls 300, titles 400 in dark.
- Acceptance: each variable and text style in the library equals the code's value; one screenshot of the editor screen in kolbox dark and light, looked at.
- ✅ 2026-11-19 (ladder only): library `theme` mode kolbox dark `oq/08, 16, 24, 32, 48, 64` = `#393939, #4a4a4a, #5c5c5c, #6d6d6d, #8f8f8f, #b2b2b2`, copied from `kol-color.css`; `surface/secondary` was already `#282828`. The other steps derive from the grounds and already follow white.

### 2.2 — Masters
- The chevron (a 12 box, a 6 by 3 glyph). The rail's document header: 56 high, the title as the split button in its ghost tone, 24 high, a quiet line under it. Pages closed: title and plus, 48. A closed section 48. The color row: a 14 swatch at radius 2, no accent outline, the dimmed opacity when hidden. Every control master at 24. The frame's name as plain accent text; a frame with no fill has no edge.
- Acceptance: each of these masters measures as the code does; the editor screen on `↳ Layout UI` matches the running app, looked at once.

### 2.3 — Today's new kolbox parts (library, measured in `pnpm editor` kolbox dark; new section `Kolbox inspector and windows` 2447:21079 on ↳ Organisms)
- 2026-11-19 22:57 — FieldPair kolbox is a set 2441:10860, `full` and `span` true/false: full=true two 100 fields over the row, span=true one field over both columns, all four cuts.
- 2026-11-19 22:57 — Typography 2447:21103 (240×180, = live): font (full, span), weight and size with its 12 chevron (full), line height and letter spacing in % (full), both aligns and Type settings; Button kolbox joined gains `pressed` true/false (accent tint, accent glyph; its hover now the code's oq-16 and white glyph).
- 2026-11-19 22:57 — PopoverTypeSettings 2450:21520 (tab Basics 401 = live, Details 480 clipped with all 35 rows, Variable) and TypePreview 2450:21215; LabeledControl kolbox label now 12/16 as the code, label width bound to `kolbox/label-w` (modes 76, 88, 116); Slider kolbox gains `stops` (9) and stands 24; TabsRow kolbox sm takes the code's oq-16 track and oq-24 white active tab (the TopRail mode tabs pinned to their old look).
- 2026-11-19 22:57 — PopoverEffect Line Swell 2453:22413, Vortex: glyph, name, chevron, more, close; Randomise, Vortex, Sheet, Color at labelWidth 88, 320×480 clipped. Thumbs sit at the nearest of Slider kolbox's quarter positions.
- 2026-11-19 22:57 — WindowLineSwell 2461:24014, LineSwellTile 2461:24008 (hover true/false), LineSwellPicture 2460:22302 (all 14 forms, paths from the live picker, white ink on the field); Input kolbox text variants gain the leading slot (`show leading`).
- 2026-11-19 22:57 — MultiProperties 2463:23466 (`corners` true/false): 2 selected with mask, Unite and its menu, more; Position, Layout with the gap between, Appearance, Fill Mixed, Stroke, Effects, Export.
- 2026-11-19 22:57 — Hover: SelectionBox state=hover (2423:199) gains the frame name in the accent; TreeRow kolbox hover was already oq-16. All of this reaches the kolbox file after his publish.
- 2026-11-20 02:57 — FrameProperties 2469:41570 (T4.1, measured on 5291): header Frame with its chevron, Create component, mask, boolean and Edit object dimmed; aligns dimmed (alone on the page), X Y, both flips (no rotation); W H with Constrain proportions; Appearance; Fill FFFFFF with Styles and Add fill dimmed; Stroke Styles dimmed; Effects, Export; section heights 148, 84, 84, 84, 48, 48, 48 = live. Title menu MenuFrame 2469:42857: Section and Group dimmed, Frame checked, the 7 size presets with their sizes, 160 by 265 = live.
- 2026-11-20 02:57 — PageProperties 2469:43137 (T4.2): no header (hidden, same tree), Page 393939 100 % with its eye, Styles with the plus dimmed, Export; 84, 48, 48 = live.
- 2026-11-20 02:57 — PopoverTypeSettings gains tab=Underline 2469:44975 (T1.4): back arrow, Basics / Underline, Decoration, then Thickness, Offset, Skip ink, Color dimmed while not underlined, 240 by 334 = live; Basics' more button left its NotWired wrapper.
- 2026-11-20 02:57 — MultiProperties 2463:23466 (T1.2): Effects lists the shared rows under Layer Effects, Outer Shadow reads Mixed, Gaussian Blur not, each with eye and minus; 139 high = live, both corners variants.
- 2026-11-20 02:57 — GeneratorWindow 2323:13957 (T6.1) redrawn to the live Stripe Array window on its Frame step, 880 by 656: Style and Preset as labelled dropdowns, Steps (Stripe Array, Randomness, Frame), Inset slider 128 px, Ink FFFFFF and an empty Ground as ColorInputRow kolbox, Fit dropdown, Reset and Randomise; specimen 2470:23668 shows it docked 8 from the right rail.
- 2026-11-20 02:57 — Right-click menus (T5.5): MenuLayer set 2470:25854 (rename=false the canvas, 18 rows; rename=true the Layers row, 19 with Rename), MenuPage 2470:25860 (6 rows, Move up dimmed); 493, 517, 178 high = live.
- 2026-11-20 02:57 — Dock (T6.3): beside ToolRail kolbox, MenuTool set 2473:24768 (the five folds, each row its own key; Kinetic type in the text fold; Orbit dimmed) and the dock's tooltips 2473:24769 (Select V, Frame F, Pen P, Rectangle R, Text T, Hand H, Insert image ⌘⇧K, Crop's reason), widths = live. The dock master itself is unchanged: it already matched.

### 2.4 — T3 and T5 in the library, small parts (Atoms, Molecules, Utilities; measured in `pnpm editor` kolbox dark)
- 2026-11-20 02:45 — T5.4 Tooltip kolbox 2323:14305 (Utilities): the ground is surface/primary, 8 in, 28 high; name-plus-key form: a `keys` slot of Kbd kolbox after the name, 8 apart, shown by `shortcut` (specimen "Frame F" 2469:203, 73 wide as the code's 72.5).
- 2026-11-20 02:45 — T5.2 MenuRow kolbox 2323:12407 states rest, hover (accent), checked 2469:11363 (12 check in the 16 lead column, no fill), disabled (oq-64, 50%); the old `checked` boolean is gone. The kolbox-menu `kit` mode now holds the code's values (row 24, panel 8 in, radius 12, rows radius 6, ground surface/primary, the pointed row accent with its ink, disabled 50). Menu kolbox 2323:12387 opens with no lit row: Last modified checked, Created, Name.
- 2026-11-20 02:45 — T5.1 Input kolbox `type=number, state=mixed` 2469:41153 ("Mixed" at half ink, the code's placeholder); ColorInputRow kolbox `empty=true` 2469:41159 (the cleared color: no swatch fill, empty hex). The one-click selected-text state is NOT built: the code leaves the highlight to the browser, there is no token to copy.
- 2026-11-20 02:45 — T3.1 ContentCard kolbox is a set 2469:42208: `starred` true/false (the star Button kolbox iconOnly lit: accent glyph on the accent tint), `star` shows it only where starring is possible, `icon glyph` swaps the foot's file glyph (folder for a folder card). Table kolbox rows and HomeRail live on ↳ Organisms: not touched here.
- 2026-11-20 03:40 — T3.1 on ↳ Organisms, new section Kolbox home 2479:45510: TableRow kolbox 2479:45511 (starred and hover true/false; `star`, `actions`, `settings`, `remove`, `icon glyph`; 48 high, 33 star, the name with its file glyph, three 183.5 columns, 96 size, 64 actions, 32 in). HomeRail 2323:13529 refilled as the code draws it: RailHeader Home with the bell dimmed, Search, Recents (lit), Drafts, All folders and Trash, with Community, Resources and Admin dimmed, the Folders and Starred groups (new HomeRailGroup 2482:24553) listing a folder and a starred file, the account foot; its old slot content is in `_trash` as `_HomeRail old slot content 2026-11-20`. TreeRow kolbox gains size=sm (the rail's 28 row). BrowserTopBar 2323:14150: the mark, one crumb (`trail` for more), Create, Share and Adjust dimmed, the star (folder only). Specimens: the folder title menu (Rename, Delete), the Trash row menu (Restore, Permanently delete), a folder card, a Trash row.
- 2026-11-20 03:40 — The four gaps: the window header (ModalShell kolbox header 2323:12477) gains its kind beside the title (`show kind`, GeneratorWindow shows "Arrays"); the inspector headers (RightRail, MultiProperties, FrameProperties) now draw the code's two 24 Button kolbox iconOnly, boolean and its 12 chevron, in place of the 36 ButtonSplit; kolbox's Icon set gains arrow-left, settings-01, edit and grid-2x2 (the code draws all four through the kolbox glyphs) and the Underline back button takes the kolbox arrow-left. Not built: the steps' second line. TreeRow kolbox has none in code either; the generator's steps are WindowFrame's own `Steps` rows, which the library does not have yet.

## F3 — The masters left in the Kolbox sections — TALK

- Left by the folds, for his ruling: app-content masters (ExportButton, Tag, Brand, MenuField, AccountRow, PaintTypeRow, MenuGroup, PanelSection, EffectTile, FilePill, the Modal* window parts), masters no code draws (SectionLabel, RailTitle, RailNote, Metadata, Hint, Feedback, CanvasReadout, PreviewWell, Dim, SelectionBox, SheetMark), and the mobile masters.
- My recommendation: app content goes back to the kolbox file by his cut and paste; the ones no code draws go to `_trash`; the mobile ones stay until mobile is built in code.

## F4 — Code Connect

- The 53 files in `figma/kolbox/` already point at the package components. Publish them against the library once F1 is done (the plan allows Code Connect on one library, this one).
- Acceptance: every folded kolbox variant in the library shows its code in Dev Mode; the count published equals the count of files.
- **Built 2026-11-19, met.** 53 mappings published against the library (11 folded sets extended in their own files, 42 new `figma/*Kolbox*.figma.js` and the new parts), 53 of 53 in the publish log; read back on ToggleSwitch `variant=kolbox`, Button kolbox and Rail kolbox. The old `figma/kolbox/` (69 files on the kolbox file's nodes) is in `_tmp/2026-11-19-code-connect/`. Record: `figma-paste-recipe.md`, "Code Connect, 2026-11-19".

---

## C1 — A frame exists only when it is drawn (was W33; he asked three times why Delete does nothing on the frame)

Cause: the engine has one built-in frame that every layer lives in. It cannot be absent, so it cannot be deleted, and a page cannot open empty.

### 1.1 — Frames as objects
- A new file opens on an empty page: no frame, the Layers list empty, the inspector showing Page. The frame tool draws a frame by drag: white, no stroke. A frame is selected, moved, resized, renamed, filled, hidden and deleted like any layer. Layers can sit on the page or in a frame. Rulers, guides, zoom fit, export and the size controls read the selected or first frame and cope with none. Old files open with their one frame, unchanged.
- Acceptance: a fresh file has 0 frames; one drag with the frame tool makes one frame of the dragged size with a `#ffffff` fill; Delete on a selected frame removes it and Undo brings it back; a file saved before this opens with its frame, fill and layers looking the same.
- **Built 2026-11-19, met.** A frame is a top-level layer `type: 'frame'` (x, y, w, h, color, fillOpacity, name, density); a layer in it carries `frameId` and stays a top-level layer, so the canvas edits it as before. The engine's stage is the page (no fill, edge or name). On where `ComposeStateProvider frames` is set (kolbox's Editor only; Labs, Morph and apps/editor keep their one stage). Old files and drafts convert in one place, `compose/frame.js` `toFramesDoc` (one frame at the old stage's place, size, fill and export px, every layer in it), marked `frameModel: 2`. Frame tool in the dock (no key: F is the fps chip). Delete takes the frame's layers, Undo names it ("Undo Delete Poster and its 1 layer"). Rulers, guides and zoom fit read the selected or first frame (FrameChrome's `data-ruler-origin`), else the stage; export is that frame at its px, else the page's layers' bounds, else "Nothing to export". The first-visit seed of three shapes is off (decided for review). Driven once in kolbox (`_tmp/2026-11-19-frames/drive.mjs`): 0 frames and Page on a new file, a 508.8 × 339.2 drag made a 508.8 × 339.2 white frame, move with its layer, corner resize, rename, eye, Delete and Undo, export 605 × 402 = the frame, an old 4:5 file's frame on the old stage's box to the pixel. Self-check: `pnpm --filter @kolkrabbi/design-editor check:frames`.
- Not built: a drop in Layers does not move a layer into or out of a frame, and a layer moved off its frame stays in it; a frame does not clip its layers on the canvas (export clips); duplicating a frame copies the frame alone.

## C2 — Look at the layer model once (W22, built, unseen)

- Built on 2026-11-19 and never driven by me: photo is a fill, pattern, kinetic type and generate are effect rows, a loop is a layer with motion.
- Acceptance: in the running app, a photo set as a fill on a rectangle shows; Effects › Generate adds a row that can be turned off, on and removed; an old file opens looking the same. Whatever fails becomes its own phase here.
- **Looked at 2026-11-19, met.** Fill › Image through the media picker put `img/02-products/radar-ascii.png` on a drawn rectangle and it shows; Effects › Generate › Screens added a row, its eye turned it off and on, its minus removed it; an old file (two shapes on a colored frame) opened as its frame, fill and layers, on the same box. Nothing failed, no phase added. One fix carried in: `layerModel.js` HOST_KEYS keeps `frameId`, so an old type converting on add stays in its frame.

## C3 — The editor takes the kolbox style (was W32) — batches 1 to 8 built 2026-11-19, met

- Sized: `_tmp/2026-11-18-editor-kolbox/w32-sizing.md`. The look becomes one `variant` setting on the editor with a Style row in its Settings, separate from the theme; kolbox's layout moves from `apps/kolbox` into the engine in batches.
- His calls, my recommendation first: the editor is developed in this repo for this (it breaks the mirror rule); the style is a `variant` setting; Morph is its own mode under the kolbox style only; Home and Library are host pages in `apps/editor`; `apps/kolbox` retires to `_tmp` after the last batch.
- Acceptance, set: with the style on, `pnpm editor` shows the same Editor, Labs and Morph screens as `pnpm kolbox`; with it off the editor is as it is today.
- **Built 2026-11-19, batches 1 to 5 in; his five calls taken as recommended ("I dont care u figure it out"), for his review.** (1) The setting: `editor/variant.js` (`VariantContext`, `useVariant`, `STYLE_OPTIONS`); float's `ChromeContext` is that context under its old name; the app setting `style`; the Style row in the engine's Settings (Display) and, under the style only, in kolbox's Settings window; `<DesignEditor variant>` on the root entry (`index.jsx`, the core entry stays default: `check:core`). (2) The move: kolbox's `ui` (but HomeRail), `search`, `app`, `files`, `editor`, `labs`, `morph`, pages Editor, Labs, Morph and its sheet (`kolbox.css`) moved whole into `packages/design-editor/src/editor/kolbox/`, imports made relative; `apps/kolbox` imports them back (`@design-editor-src/editor/kolbox/...`) and hands its fixture over through `editor/kolbox/host.js` (`setKolboxHost`, `apps/kolbox/src/host.js`); one implementation. The six empty folders left behind: `_tmp/2026-11-19-editor-kolbox/apps/kolbox/src/`. (3) Editor, (4) Labs, (5) Morph: `editor/kolbox/KolboxView.jsx` routes them on the hash under the style; `apps/editor` with Style Kolbox loads `src/kolbox.css`, drops its nav rail and mounts `<DesignEditor variant="kolbox">` on `/`, `/editor` and `/labs` (`/randomiser` and `/core` keep the default). Each batch checked once in Chrome on 5291 and 5292 (`_tmp/2026-11-19-editor-kolbox/check.mjs`): kolbox's Editor 0 page errors and as before, apps/editor style off as before, style on Editor, Labs and Morph each 0 page errors and looked at (`b3-`, `b4-`, `b5-*.png`). `check:frames` and `check:core` ok.
- Decided for review: the editor is developed in this repo for this work (ARCHITECTURE §3's mirror rule set aside); one physical move for the shell, Editor, Labs and Morph (the kit imports the editor and Labs, so a shell-only move would have the package import the app); the old `engine.js` seams kept as relative shims rather than retired; a Style change reloads the page (the kolbox sheet stays once loaded); under kolbox every settings row a screen names is the editor's one row; apps/editor's boot restores the theme variant kolbox's Theme row picks (`kolbox-theme-variant`); kol-tuner reaches the moved Tune mode by a vite alias in both apps (design-editor's manifest does not carry it yet: a `workspace:*` line and an install, and a peer before any publish).
- **Batches 6 and 7 built 2026-11-19, met.** (6) The Randomiser (`pages/Randomiser.jsx`, `randomiser/` with its engine seam, imports made relative, the fixture swapped for `hostClient()` and `hostStore('kolbox-randomiser')`) and the phone's bottom bar (`app/PhoneNav.jsx`, the rows and `NO_BAR` moved whole from apps/kolbox's App.jsx; `dev` adds the Dev row) moved into `editor/kolbox/`; KolboxView routes `#/randomiser` and mounts the bar; apps/editor's `/randomiser` opens it under the style. (7) Home and Library are host pages: their one copy moved whole from apps/kolbox to `apps/editor/src/kolbox/` (`pages/Home.jsx`, `pages/Library.jsx`, `home/`, `library/`, `ui/HomeRail.jsx`; `home/engine.js`'s relative reach into kol-component one level deeper); apps/kolbox imports them from there (`../../editor/src/kolbox/pages/...`); apps/editor hands them lazily to `<DesignEditor variant="kolbox" pages>`, which KolboxView draws on `#/home` and `#/library[/...]`, opening on Home (a phone: the Randomiser) when '/home' is given; apps/editor gained the `@design-editor-src` alias the pages use. kol-tuner: a peer (`>=0.1.0 <1`) and a `workspace:*` dev dependency of design-editor, as its other KOL packages are carried; both vite aliases gone; `pnpm install --offline` once, `packages/design-editor/node_modules/@kolkrabbi/kol-tuner` links to `packages/tuner`, apps/tuner still serves. The default Settings opened by FXR › Settings…: Display › Style row there (Default), set to Kolbox it reloads into the kolbox screens on Home; the kolbox Settings window's Style row set to Default reloads into the default editor. One check (`_tmp/2026-11-19-editor-kolbox/check-b67.mjs`, Chrome, 5291 and 5292): kolbox Home, Editor, Labs, Morph, Randomiser 0 page errors; apps/editor style off as before; style on Home, Poster draft double-clicked into the Editor, the Randomiser, each 0 page errors and looked at (`b67-*.png`). `check:frames` and `check:core` ok.
- Decided for review: Home and Library's one copy sits in apps/editor (its end state) and apps/kolbox reaches across by a relative path until it retires; the engine takes host pages as a `pages` prop on the kolbox DesignEditor rather than knowing them; kol-tuner joins as a dev dependency plus peer, the house form for design-editor's KOL packages, not a runtime `dependencies` entry; KolboxView does not carry apps/kolbox's address fixes (the `?view=` redirect, dropping Labs' pick off other screens, the ⌥ digit keys).
- Batch 8 built 2026-11-19: `apps/kolbox` moved to `_tmp/2026-11-19-kolbox-app-retired/`, the root `kolbox` script dropped, apps/style re-pointed at the engine's kolbox folder and apps/editor's host parts.

## C4 — The rest of his second look at the editor (was W28)

### 4.1 — Find in Pages
- Once a file has more than one page, the search icon opens a find field in the rail that finds layers.
- Acceptance: typing a layer's name lists it and Enter selects it.
- **Built 2026-11-19, met.** `apps/kolbox/src/ui/LeftRail.jsx` `Pages`: with two pages or more the search icon turns the header into the kit's rail field (`Input variant="kolbox" size="md"`, a close), typing lists the layers whose Layers name holds the text (every layer, the page's and each frame's), arrows move, Enter selects on the canvas and in Layers, Escape or the close puts the header back. Read of the engine: a page is a name in kolbox's local list and nothing more; the engine holds one document, and the file, the draft and undo know no pages. Selecting a page is NOT built: it needs pages in the engine's state, its file and its history, past this phase's "touch only what a find needs" (4.4).

### 4.2 — Right-click menus
- A right click on a layer on the canvas, on a row in Layers and on a page opens kolbox's menu at the pointer, never the browser's.
- Acceptance: each of the three opens the menu; every connected row does its action once.
- **Built 2026-11-19, met.** `editor/layers/LayerMenu.jsx` (the `LayerMenuHost`) keeps its type rows and adds his list: Bring to front, Send to back, Group, Flatten, Use as mask, Hide or Show, Lock or Unlock, Flip horizontal, Flip vertical, Rename…, Duplicate, Delete, each the engine's write (`moveLayer`, `groupLayers`, `flattenSelected`, `flipLayer`, `updateLayer`, `duplicateLayer`, `removeLayer`). Left out: Copy and Paste here (the engine has no clipboard). A frame answers on its name too and takes no order or flip rows; a framed layer's Send to back stops just above its frame (decided for review). A page row's menu (`pages/Editor.jsx`): Rename…, Duplicate, Delete on the page list. No design-editor file changed.

### 4.3 — The collapsed left rail
- Collapsed, the rail goes and a small floating pill at the top left holds the mark, the file name and the same panel icon.
- Acceptance: collapsed, 0 rail strip and one pill; the icon brings the rail back.
- **Built 2026-11-19, met.** Collapsed, `LeftRail` draws nothing and `RailPill` sits over the canvas at 12,12 on `.kol-kolbox-surface`: the accent mark at 24, the file name, the header's `panel-left` (same glyph, read from both). The canvas takes the freed width (read wider collapsed). Driven once with 4.1 and 4.2 in Chrome dark on 5293 (`_tmp/2026-11-19-second-look/drive.mjs`, all pass, 0 page errors; shots there).

### 4.4 — The page model (from 4.1's read)
- Cause: a page is a name in kolbox's list; the engine has one `layers` array, and the file (`useComposeFile` buildSpec, `loadPreset`), the draft and undo carry no pages.
- Build: the engine's state holds `pages [{ id, name, layers }]` and the open page; `layers` stays the open page's, so the canvas, Layers and every write are unchanged. Switching swaps the set; the file and the draft write every page (`pages`, with an old file opening as one page); undo is per page. Kolbox's list reads the engine's pages.
- Acceptance: a fresh file has one page; after the plus there are two, and a frame drawn on page 2 is absent on page 1 and back on page 2; a file saved with two pages reopens with both; an old file opens as one page looking the same.
- **Built 2026-11-19, met.** The engine holds `pages [{ id, name, color, layers }]` and `pageId`; the open page's layers are the live `layers`. In the file and the draft every layer carries `pageId` beside `pages [{ id, name, color }]`, `frameModel: 3`; an older file opens as one page through `compose/frame.js` (`toPages` after `toFramesDoc`). Undo snapshots carry the pages and the open page: add, rename, duplicate (with content, new ids) and delete (with content, "Undo Delete Page 2 and its 1 layer") are steps, switching is not. Page color is the page's own (`infiniteFill`). Kolbox's Pages list, plus, rows and their menu are the engine's; find reaches every page and Enter opens the layer's page. Export: `everyFrame(pageId?)` on the state lists every frame on every page, or one page's. The clipboard (`compose/clipboard.js`): Copy, Cut, Paste, Paste here in `LayerMenu.jsx` and on the browser's copy, cut and paste events; pasted layers get new ids and land in the frame under them or on the page; a paste of outside text makes a text layer. Fix carried in: the library's `validatePreset` dropped `frameModel` and `layerModel` (and would have dropped `pages`); it keeps them now. Driven once in Chrome on 5294 (`_tmp/2026-11-19-pages/drive.mjs`): 13 of 13, 0 page errors; `check:frames` (pages added) and `check:core` ok. Shots `page-1.png`, `page-2.png`, `page-2-pasted.png`.
- Decided for review: Paste keeps the place (paste in place), Paste here is the menu's only, no key of its own; a paste of a layer whose frame was not copied goes into the frame under its centre; the page color is not an undo step; undoing an edit made on another page opens that page.

## C5 — The windows still to do — ✅ built 2026-11-19 (one frame, `apps/kolbox/src/editor/windows/WindowFrame.jsx`, under the generator, Color Modes and Motion windows; Color Modes replaces the engine's on every kolbox door (Labs' "Edit in Color Modes", the menus); the search modal: tabs span, an empty state, Layers found and selected, a file's edited time; Motion lists the moving Line Swell loops through the registry and Apply adds a loop layer; each opened, moved 200,100 by its header and did its job once in Chrome, dark, Color Modes also light; screenshots `_tmp/2026-11-19-windows/`)

### 5.1 — The color window (was W25) and the search window (was W26)
- Both on the shared window frame, as the generator's.
- Acceptance: each opens, moves by its header, and does its job (pick a color; find and open a result).

### 5.2 — The generator's leftovers
- The Motion family's window. Images from the real media bucket: PARKED, the media worker is not connected in this repo.
- Acceptance: Motion opens its own window with only its styles.

## C6 — The tuner inside the DS and the editor (was W27.4, 27.5b)

### 6.1 — The components
- `LogoSystem` and `LogoTuner` as organisms in `kol-component` over `@kolkrabbi/kol-tuner`; `apps/tuner` renders them from the package.
- Acceptance: both on the showcase; `apps/tuner` holds no local copy.
- **Built 2026-11-19.** `LogoSystem` and `LogoTuner` in `packages/component/src/organisms/` (shared board in `logoBoard.jsx`) over `@kolkrabbi/kol-tuner`, inks as `.kol-logo-*` in `kol-components-organisms.css`, previews `showcase/src/previews/LogoSystem.jsx` and `LogoTuner.jsx`, classification, inventory and `27-tuner.md` updated. `apps/tuner` renders both from the package with its own rail; the old local views are in `_tmp/2026-11-19-tuner-components/apps/tuner/src/`. Chrome on 5291: System draws, 6 handles, a drag on y changes the mark; Tuner tunes a dropped SVG (read as vectors); 0 page errors; looked at dark and light. Taxonomy: only `atoms/Delta.jsx` (not this work); roster clean.

### 6.2 — The mode in the editor
- Entered on one shape, with Generate and Modify; it leaves a live Tune effect, 0 to 100.
- Acceptance: entering and leaving without a change leaves the document the same; Modify on a vector layer gives a tuned form; the layer carries a Tune row afterwards.
- **Built 2026-11-19.** The mode in `apps/kolbox/src/editor/tune/` (`TuneMode.jsx`, `store.js`): Effects › Tune (its own row after Generate, shapes and closed paths) or a Tune row's settings button enters it; the canvas is LogoSystem (Generate) or LogoTuner (Modify) over the editor's canvas, the rail is kolbox's kit with Generate and Modify tabs, Amount on top, Show (construction, measures, keylines, grid, handles or comb and original line) and an Advanced fold. Done or Escape leaves; nothing is written inside, so only a changed visit writes the row. The row in the engine: `packages/design-editor/src/editor/compose/tune.js` (type `tune`, `params: amount, mode, settings, source, rings`), applied to the body in `layerModel.js` `expandLayer`, so canvas and export draw the same path; the tuned form is node rings stored as shares of the layer's box, at 0 the original body, at 100 the rings, between them a morph. Driven once in Chrome on 5292 (`_tmp/2026-11-19-tune-mode/drive.mjs`): 14 of 14 (no-change visit leaves the document byte-equal; Modify gives one Tune row, 1 ring, 15 nodes, drawn as a path; amount 0 draws the rectangle, 100 the path again; eye off and on; Generate: shapes 6 to 3 and a drag on the y handle change the mark, the row keeps circles 3 and y 0.466; 0 page errors). Shots `mode-modify-dark.png`, `mode-generate-dark.png`, `canvas-*.png`.
- Decided for review: Escape keeps the work like Done (no Cancel); Amount lives in the mode's rail, not on the inspector row; a fresh visit opens on Generate; Modify reads as an outline with the golden preset, the comb and the auto grid on; Generate's mark fills the layer's box as its square frame, Modify's takes the original's box; the System's slices are united by paper into one outline; kol-tuner reaches kolbox by a vite alias, not a manifest line, so the lockfile is untouched; the engine's own `effect` slider is left out (Amount does that job); the tool dock stays over the board.
- Not built or not checked: a dropped SVG and a black and white PNG in the editor (the code path is apps/tuner's, not driven here); the SVG export read back (it goes through the same `expandLayer` seam); the morph between 0 and 100 looked at; on a plain rectangle the golden preset only eases the corners, so 0 against 100 is a small change to the eye; a form read as strokes is drawn even-odd.

## C7 — The style generators that need a rebuild (was W29.3, the rest) — ✅ built 2026-11-19 (13 of 16 rows: white-01 as Cube grow, slow on `cube-lattice`; blue-01 pulse and sweep were already its presets; the signal set as `signal-spikes`, `signal-bars`, `signal-ring`, `signal-monitor`, `signal-steps` and `dot-warp`; the record card as `record-tape`; the three relief boards as `math-relief` with views Turn, Globe, Fly. Shapes and images read through `loops/lib/source.js`. Each preset plays in Labs, u 0 against u 1: 0.000 percent of pixels, all 27 presets checked. Not built: Line, Lines and Locator, a hand-traced path or a placed marker over a photo, which in the editor is a photo layer and a path. Shots in `_tmp/2026-11-19-loops/shots/`)

- The signal set, the record animations and the relief: each a Labs loop with settings, reading the user's own image or shape. The table of what must become a setting: `_tmp/2026-11-18-style-generators/pieces.md`.
- Acceptance, per piece: it plays in Labs and its loop closes.

## C8 — Export, Save as, Home and the user (was W30) — ✅ built 2026-11-19, local, shaped for a backend (his go: "I dont care u figure it out")

- Built. Export: one window on the shared frame (`editor/export/WindowExport.jsx`, `render.js`), opened by the top rail's Export and File › Export…: Content (the frame, the selection, every frame), Name, Format (PNG, SVG, Video when something moves and the browser encodes WebM), Scale with the px it gives, Frame fill, a live preview of the very SVG written; several files go in one .zip. The inspector's Export section (`editor/properties/Export.jsx`) keeps settings per layer or frame in the document (`layer.exports`), plus and minus, and "Export <name>" writes that item. Save as: a small window (`editor/windows/WindowSaveAs.jsx`): Name, Location (Drafts by default, or a new folder), keep Media and Theme, a Fonts line; ⌘S and ⇧⌘S go through it. A file has one folder (`files/places.js`), shown under the title in the left rail ("Not saved" before a first save); Save, Duplicate and the portable file follow it (`files/useFileVerbs.js`). Portable file: `<name>.kol.json`, the engine's own envelope with media as data (`files/portable.js`), File › Export as file… and Open file…, Home's Create › Open file… and a card's download. Home: Drafts and folders are real (Folders group with its plus, Move to on a file's menu, a new file lands in the folder on screen); the account chip at the rail's foot with its menu; signed out it says so and Sign in opens a window that says accounts are not connected in this build (`app/WindowSignIn.jsx`, `files/account.js`; the dummy password prompt is gone).
- Checked once in Chrome on 5291, dark: PNG 1080 × 1080 with the rectangle's red inside and the frame's white at the corner; SVG with both fills; Save as into "Check folder", the rail line read "Check folder" and Home's folder listed the file; the portable file reopened from Home with the same layers (only ids renewed); the account menu read "Not signed in" and "Sign in…", and Sign in opened its window; 0 page errors. Screenshots `_tmp/2026-11-19-export-save-home/`.
- Decided for review: video only for "the frame" (the engine's bake reads its active frame) and its file name is put on the download as it leaves; the inspector's rows are PNG and SVG, no video; scales 0.5 to 4 (video 1 to 3); "Export SVG" and "Export PNG" in the File menu became one "Export…"; Media keep inlines still photos only (a video clip is not carried); Theme off saves no palette; Fonts is a line, not a choice (every face ships with KOL); Home's rail header reads "Home" now that the account sits at its foot; Create opens a small menu (New file, Open file…); the account menu's Profile and Plan are info lines when a session exists (none can here); folders cannot be renamed or removed yet; "All folders" stays not wired.
- Left: the page's own Export section (nothing selected) is still the plus that does nothing, in `editor/properties/Canvas.jsx`, which C1's agent holds: the line `<LabeledControlSection variant="kolbox" label="Export" end={…noop} />` becomes `<TailSections />`'s `ExportSection` once a page export target exists. `pages/Editor.jsx` still passes `fileMeta="Drafts"`, which the rail no longer reads. Desktop rendering: PARKED until the web app is accepted.

## C9 — Out the door

### 9.1 — The small calls from the live pass — ✅ 2026-11-19, his calls applied: the mode tabs 24 in a 32 track (`TabsRow` kolbox md `h-8`, read 24 in 32), the brand tile stays 28, the hex stays 11, the hidden eye stays the slashed eye. "Drafts" not ruled.
- The top rail's three mode tabs are 28 inside their 36 track: 24 or stay. The brand tile is 28: 24 or stay. "Drafts" under the file title is my word. The color row's hex text: 11 as built or 12 as his frame. The hidden eye: the slashed eye from his icons, or a closed eye drawn new.

### 9.2 — Kolbox's glyph names — ✅ 2026-11-19
- 49 call sites still pass kolbox's own icon component because the data holds kolbox's glyph names. Rename the data to the set's names and the seam goes.
- Acceptance: 0 `iconComponent` props left in `apps/kolbox` and in the kolbox branches of the packages.
- **Built 2026-11-19, met.** The data carries the set's names (the content and effect rows, the Styles act, Create component and mask, the tool dock's glyphs, the fill's Image row); the name table and `glyphName` are gone; `apps/kolbox/src/ui/Icon.jsx` is one line re-exporting kol-component's `KolboxGlyph` (`utilities/kolboxGlyph`) for kolbox's loose glyphs, so the stroke lift and the 12 chevron have one source. 0 `iconComponent` in `apps/kolbox`; the kolbox branches of Button, Input, TreeRow, ButtonGroup, ButtonSplit, AlignmentGrid, Menu, CommandOverlay and TimelineDock draw KolboxGlyph and take no seam (apps/style's kolbox sheets lost the prop too). Loose ends with it: Export's every frame reads `everyFrame` with a This page / All pages choice; the page's Export plus is the inspector's section for the open page (settings kept for the session: the engine's page holds only id, name, color); `fileMeta` gone from Editor; the dead Color Modes rule out of `index.css`; kol-tuner a `workspace:*` dependency, the alias gone. Driven once in Chrome on 5295 (`_tmp/2026-11-19-loose-ends/drive.mjs`): Home, Editor (frame, rectangle, text, each selected), Labs, Morph, the main menu, five dock menus: 0 glyphs missing, 0 empty glyph boxes, 0 console errors; every frame on two pages wrote a .zip of 2 files.

### 9.3 — Publish — on his word
- Everything is in this repo only: `kol-theme`, `kol-component`, `kol-shell`, `kol-icons` (30 new glyphs, `component-01` now the outline), `design-editor`, and the new `kol-tuner`. Versions, the changelogs and the registry are his go; the consumer scan runs on the iMac. The LogoShapes ticket closes on the registry showing `kol-tuner`.

---

# R — His review, 2026-11-19 (18 notes, verbatim at the foot of this file; nothing here is built)

**Status:** DRAFT, on his go. Each phase names a cause; the notes it answers are in brackets. One check at the end of each: the thing driven once in HIS setup (`pnpm kolbox` and `pnpm editor`, a Firefox-based browser) and looked at.
**What went wrong, so it is not repeated:** every piece of the last run was driven once by the agent that built it, in Chrome, on a fresh profile, and nobody opened the app as he does. Notes 1, 3 and 18 are things that would have shown in the first minute.

## R1 — The editor does not work as shipped [1, 3, 18]

Cause, to be found before anything is fixed: the last run moved kolbox's shell into the engine, changed the document model twice (frames, pages) and renamed every glyph, and three basic things broke that no check covered.

### 1.1 — Reproduce, then fix: the three faults
- [1] "editors dont load with frames": find what he means by opening both apps as he has them (his own saved files and draft, not a fresh profile): a file or draft with frames that does not open, or the editor not starting once a frame exists. Write down what is seen first.
- [3] "no shortcuts work": every key, in both apps. The tools, Delete, Undo and Redo, copy and paste, the zoom keys, Settings, search, the mode keys.
- [18] `pnpm editor` with the kolbox style: every glyph on Home is missing; the colors are the default theme's, not kolbox's; the Page color field shows "COLOR-MIX(IN SR…" where a hex belongs; the line under the title reads "Not saved"; "0 of 0" files.
- Acceptance: with his own files, both apps open a file that has frames and show them; every shortcut in the menus' shortcut column does its action; in `pnpm editor` with the style on, 0 missing glyphs, the kolbox theme's grounds and accent, a hex in the Page field, and the same files as `pnpm kolbox`.
- **Worked 2026-11-19 (R1 agent), the causes.** His Firefox profile could not be read, so his state was rebuilt as files and drafts in every model the app has written (pre-frames, `frameModel: 2`, `frameModel: 3` with two pages) and driven in installed Chrome and in Playwright's Firefox (`_tmp/2026-11-19-r1/`: `docs.mjs`, `keys.mjs`, `five.mjs`).
  - [1] The default editor (`pnpm editor`, Style Default) shares the draft and the library with its kolbox style, and read a frames document as one stage: frames drawn as plain rectangles, the old white stage under them, every page stacked on it. The model was the chrome's choice (`ComposeStateProvider frames`), never the document's. Fixed in `compose/state.jsx` (`adoptDoc`): a file or draft with `frameModel >= 2` or a frame opens as frames and pages in any chrome; a stage file or a cleared canvas goes back to the stage. Both kolbox hosts already opened all nine cases.
  - [3] Not reproduced: in both apps, both engines, four focus places (canvas, a Layers row, the right rail, after a menu closed), after Restore, New file, an open from Home and a visit to Labs, Morph or the Randomiser, after typing in a field and in a text layer, every printed shortcut did its action: the editor's 57 in four focus places, 228 of 228 in each app, plus Labs' 9 and the app keys on Labs, Morph and Home. Nothing removed from a menu.
  - [18] Colors: apps/editor's boot stamped the theme variant only when kolbox's Theme row had stored one; it now boots the kolbox style as apps/kolbox does (variant kolbox, dark unless chosen). Its page also loaded KOL's whole theme and the framework chrome under kolbox's sheet; under the style it now loads kolbox's sheet alone (`main.jsx`). The Page field: the theme variable was shown raw (a `color-mix()` under the default theme); `shown` resolves it through `cssColorHex` (`color/cssVar.js`). "Saved" under "Not saved": the save toast's consumed flag was spent by React's development double effect, so every editor mount raised "Saved"; the toast now compares marks by identity (`MenuBar.jsx useSaved`). Glyphs and "0 of 0": not reproduced (108 of 108 glyphs, 14 of 14 files in both apps); an empty glyph box is IconLoader waiting on a chunk that never landed, and a failed chunk was kept forever, so kol-icons now drops a failed set import, logs it and asks again.
  - Found on the way: apps/kolbox never generated its host pages' utilities (Home's top bar drew 32 for 49): `@source` for `apps/editor/src/kolbox` added to its sheet. Home's Create made an unmarked empty file, which opened as an old file with a frame: it is marked in today's models.

## R2 — One selection drawing on the canvas [5, 8, 9]

Cause: three drawings grew separately: the frame's (solid line, corner squares, plain name), the shape's (dotted line, eight handles, a rotate handle, a dark size chip) and the text layer's (the shape's, plus a name pill, plus blue blocks over the letters).

### 2.1 — His reference, for everything
- A selected shape, text layer or frame: ONE solid accent line; four white square handles with an accent edge, at the corners only; no dotted line, no side handles, no rotate handle drawn; no name on a pill ("shapes dont use container on label text"); the size on an accent chip with white text, centred under it. A frame keeps its name as plain accent text above its top left. A text layer shows no blue blocks unless its text is being edited.
- Acceptance: the same line, handles and chip on a rectangle, an ellipse, a text layer and a frame, measured equal; 0 pills; rotate and side-resize still work by pointer near the edge and corner.
- **Built 2026-11-19, met.** One drawing: `SelectionOverlay variant="kolbox"` (kol-component, with `scale` = fit × zoom so 1 px is 1 screen px) draws every selected shape, text layer and frame (FrameChrome under the kolbox style draws it on its box and keeps only its plain name above). Solid 1 px accent line, four white 6 squares with a 1 px accent edge, the size on an accent chip 8 px under the bounds (the design's label: medium 10 / 14, 8 by 2 in, radius 4); sides (8 px bands) and rotate (16 px zones outside each corner, the rotate cursor) answer the pointer undrawn. Hover: the line alone. Multi-selection: one line and four handles on the bounds (a drag on them scales every member, one undo), each member a line. kolbox's name pill (`pages/Editor.jsx` FrameLabel) retired to `_tmp/2026-11-19-r2-r5/Editor-FrameLabel.jsx`; the canvas sits in `VariantContext "kolbox"` there so apps/kolbox gets it too. Text: leaving an edit clears the document selection (`TypeBlock.jsx`), so no blue blocks unless editing. Driven once in Chrome, dark and light (`_tmp/2026-11-19-r2-r5/drive.mjs`, 27 of 27 each, 0 page errors): line, handles and chip read equal on rectangle, ellipse, text and frame; chip 8 below, centred; 0 pills, 0 dotted; side resize w only (ew-resize), corner both, rotate 37 degrees from outside a corner; shots `dark-r2-*.png`, `light-r2-*.png`.
- Decided for review: the chip's text is the accent's own ink (`--kol-accent-on-primary`: near-white on light's rust, dark on dark's yellow, where white would not read); handles 6 per SelectionBox 28:9356; a frame does not rotate; the default and float looks are unchanged; multi-selection has no rotate.

## R3 — The rails do not sit on the design's grid [2, 4, 10, 16]

Cause: rows were corrected one at a time in the live pass and the kit went to 24, so the grid the design set (149:26890) no longer holds across a rail.

### 3.1 — The right rail on one grid [16]
- One column grid and one icon column for every row: the fields' right edges in Position, Layout, Appearance and Fill fall on one line; the trailing icons on one x; no empty band under Appearance; the header's title and glyphs not cut.
- Acceptance: for every row in the frame, shape and text inspectors, field edges and icon positions equal the design's within 1px.
- **Built 2026-11-19, met (decided for review: the grid).** One grid for every rail row, set once: `LabeledControlSection variant="kolbox"` inside a Rail sets `--kol-kolbox-row-cols` (two field columns and two 16 icon columns, 8 apart: 76, 76, 16, 16, his design's own Stroke row) and `FieldPair variant="kolbox"` lays out on it (`first`, `second`, `span` for one field over both, `trailing` filling the icon columns from the right); `ColorInputRow variant="kolbox"` with actions is that FieldPair; the effect rows, the image fill row, Export's rows, the font and Flatten moved onto it; the size presets chevron and Type settings are 16 icons on the icon columns. Gone: the fill eye's `ml-1`, Appearance's `pb-7!` band, the header's negative margins (the header row is 24, 14 above and 12 below, so the title dropdown and the glyphs' 24 frames sit inside the 50). One design value set aside on purpose: the design's Position (100, 100) and Layout (88, 88) widths are his "four lines"; one icon column cannot hold the fill row's eye and minus, so the grid has two. Measured in Chrome on 5296 (`_tmp/2026-11-19-r3/measure.mjs`), frame, rectangle, text and the page, dark and light: 127 edges and icon centres each, 0 off the lines (fields 16, 92, 100, 176 or the outer 224; icons 192 or 216), Appearance 84 like every one-row section, 0 page errors; looked at (`final-*.png`). The Typography tracking field now shows "-0.01e" in its 76 (R4.1 redraws that section).

### 3.2 — Closed sections keep the ink [4]
- Every closed section's title and its plus are in the full ink, as Pages already is; "closed" is not "disabled".
- Acceptance: Styles, Export, Stroke and Effects closed: title and plus the same color as an open section's title.
- **Built 2026-11-19, met.** `is-empty` is gone from LabeledControlSection kolbox and its muted rule from kol-theme; every kolbox section head's action glyphs take the full ink (`.kol-section--kolbox > header .kol-icon-btn--kolbox`, a lit one keeps its accent); the Pages override in `kolbox.css` went. Read: Pages, Layers, Page, Styles, Export, title and actions equal the open title's color.

### 3.3 — The top rail's right side [2]
- Preview, the share icon, Export and the zoom on one height (24) with even gaps; Export loses its own 32 and wide padding.
- Acceptance: the four are 24 high, their gaps equal.
- **Built 2026-11-19, met.** Export is the kit's primary button (its `h-8! rounded-track! px-6! text-row! font-semibold!` gone) and the zoom joins the one row (`data-top-rail-right`, gap 12). Read: 24, 24, 24, 24; gaps 12, 12, 12; one centre line.

### 3.4 — The dock's glyphs [10]
- "bigger icons": the dock's glyphs at his reference's size (about 20, against 16) and in the full ink; the dock grows only as much as they need.
- Acceptance: each dock glyph's box equals the reference's within 1px; the dock still sits centred on the canvas.
- **Built 2026-11-19, met.** `ToolRailSlot` kolbox: the glyph 20 in a 36 cell, the full ink (kol-theme `.kol-tool-slot--kolbox`), the armed tool still solid accent, the chevron cell 36 high with the kit's 12 chevron. Read: 9 glyphs 20, all in the ink, the dock 487 by 52, centred on the canvas to 0. The Labs transport rides the same cell and grew with it.

## R4 — The inspector's content [6, 7]

### 4.1 — Text settings [6] — ✅ built 2026-11-19 (Typography in four rows, 1, 2, 2 and 7 controls, no slider: font; named weights and their italics beside size with its chevron; line height and letter spacing in percent; both aligns and Type settings; the window is `PopoverPanel variant="kolbox"` beside the rail with Basics, Details and Variable tabs, each under a Preview; Weight 600 there reads Semi Bold in the rail; 21 controls drawn and marked Not wired; shots in `_tmp/2026-11-19-text/`) — leftovers built 2026-11-19: 19 of the 21 connected on the canvas and in the outline export (`modes/type/textSettings.js`), 2 still Not wired: Styles (no text styles in the engine) and Decoration's more (its underline settings are not built); a control whose feature the font lacks is dimmed (Inter: small caps, number Style). Basics 8 and Details 35 rows, all label beside control at 11 px in the 240 window; Details groups Indentation, Letter case, Numbers, Letterforms, Stylistic sets, Horizontal spacing, More features; Slant writes the slnt axis (-5 reads oblique 5deg); Weight 9 stops (Slider kolbox `stops`). Export carries the font's one-to-one substitutions only: calt, dlig, Inter's frac and ss03 and cpsp show on the canvas only. Shots `_tmp/2026-11-19-leftovers/`
- "text settings is bullshit". What is there: an outlined font dropdown, a weight slider with a number, a size, a stray chevron, line height, tracking, two align groups.
- His reference, four captures of Figma's text inspector: "this is how text looks in figma this is how it should look for us … it has extra settings button".
- **Typography in the rail**, title with the styles action. Row 1: the font, one full-width dropdown. Row 2: the weight as a dropdown of named weights (Regular), and the size as a field with its own chevron of sizes (12). Row 3: line height (Auto) and letter spacing (0%), each a field with its glyph. Row 4: horizontal align (left, centre, right), vertical align (top, middle, bottom), and the extra settings button, lit while its window is open. No weight slider in the rail.
- **The extra settings window**, floating beside the rail, three tabs and a close, a Preview box at the top of each tab.
  - Basics: Alignment (left, centre, right, justified); Decoration (none, underline, strikethrough, and more); Case (as typed, upper, lower, title, small caps); a rule; Vertical trim (two choices); List style (none, bullets, numbers); Paragraph spacing (a field); Truncate text (off, on); Wrap style (a dropdown, Auto).
  - Details: Indentation (Hanging punctuation, Hanging lists, each off or on; Paragraph indent, a field); Letter case (Case; Case-sensitive forms; Capital spacing, each off or on); Numbers and whatever follows in his file. A row the font cannot do is shown dimmed, as in his capture.
  - Variable: one slider with its field per axis the font has (Inter: Slant, Weight 400 with its stops).
- A row the engine cannot do yet is shown and marked not connected, never left out; the count is reported.
- Acceptance: a text layer's Typography section has 4 rows holding, in order, 1, 2, 2 and 7 controls; 0 sliders in the rail; the settings button opens a window with 3 tabs, each with a Preview box; Variable lists one slider per axis of the layer's font; changing Weight to 600 there changes the layer's weight and the rail's weight dropdown reads Semi Bold.

### 4.2 — Morph is an effect [7]
- The Morph row with its Off and On pair goes; Morph is added and listed in the Effects section as an effect row, with its eye, minus and settings.
- Acceptance: no Morph row outside Effects; adding Morph from the Effects menu gives a row that turns off, on and is removed.
- **Built 2026-11-19, met (decided for review: where the settings live).** Morph is a `morph` row in `layer.content` (`compose/layerModel.js` `MORPH`, `morphRowOf`): like Tune it draws nothing itself, its eye is the body's `axisOn` in `expandLayer`, and its settings stay the text layer's own axis fields, edited in the effect card (`MorphSettings`, Parameters.jsx) the row opens. Effects › Morph (a text layer, once) adds it on and opens its card; the Style section with Off and On is gone. A file from before (axisOn on, no row) lists the row and writes it on its first eye; its minus turns axisOn off. Driven (`_tmp/2026-11-19-r3/drive.mjs`, dark and light): no Morph section, one row added on, eye off, eye on, minus removed (axisOn false), the old-file row listed and its eye wrote a row off; the canvas text changes drawing with the row on and back off; 0 page errors.

## R5 — Layers nest by drag [15]

Cause: the Layers list does not move a row into or out of a frame; the frames work left it out.

### 5.1 — Drag in the list
- A row dragged onto a frame goes into it; dragged out, it leaves; dragged between rows, it reorders; the drop place is shown while dragging.
- Acceptance: a rectangle on the page dragged onto a frame's row moves with that frame afterwards and exports inside it; dragged back out, it does not.
- **Built 2026-11-19, met.** The Layers list drags on pointer events with capture (`editor/layers/LayersList.jsx`): 4 px lifts a row; a frame row's middle half (or under an open frame's row) is "into" and the row is outlined; elsewhere a line between rows; Escape cancels; one undo step. The engine's `placeLayer` (`compose/frame.js` `placeInList`): into a frame, out to the page, reorder by z, a frame carrying its members; coordinates are the page's, so nothing moves. Groups keep reparentLayer. On the canvas a moved layer whose centre lands in a frame joins it, one whose centre leaves goes to the page above that frame, inside the move's undo step. Driven with R2: dropped on the frame's row it is listed under it, moves with the frame and its red is in the frame's PNG; dragged out it leaves and is not; reorder puts it under on the canvas; Escape cancels; the frame row moves its block; canvas in and out; each one Undo. `check:frames` has the cases.
- Not built: keyboard reordering in the list (the row menu's Bring to front and Send to back stay the keyboard path); a touch drag in the list.

## R6 — Pinch zoom strength [14] — ✅ built 2026-11-19, his browser to settle

**Built.** The cause was the strength, the same in every browser: Chrome and Firefox on macOS both send a pinch as ctrl+wheel in pixels with deltaY summing to about -100 x ln(the pinch's scale) (measured in Chrome: a real synthesized pinch of 2x sums -69.3, 4x sums -138.6, deltaMode 0; Firefox read from Gecko's `PinchGestureInput::ComputeDeltaY`, written to match Chrome, pixel mode, not driven by a real pinch here). So 0.00225 turned a 4x pinch into 1.37x. Now `PINCH_STRENGTH = 0.01` in `design-editor/src/editor/shell/CanvasView.jsx`: the canvas follows the fingers, 2x pinch 2.000x and 4x pinch 4.000x in Chrome, the same deltas sent to the Firefox engine 4.000x. Safari's gesturechange scale is followed too; deltas are read in px whatever the deltaMode; one event zooms at most 25 px of delta, so Ctrl and a mouse notch is 1.28x. Tuning: `localStorage.setItem('kol.editor.pinchStrength', '1.5')` in his browser's console (a multiplier, default 1; 2 measured as a 2x pinch giving 4x), read on every event, no reload.

Cause: the strength was guessed (0.0015, then 0.00225) and measured in Chrome; he is in a Firefox-based browser, where the same pinch sends different wheel values.

### 6.1 — Measure against his reference, in his browser
- Record what a pinch sends in his browser and how far the same pinch zooms in his reference; set the strength per browser so they match.
- Acceptance: the same recorded pinch changes the zoom by the same factor as the reference's, within 10 percent, in his browser and in Chrome.

## R7 — The tuner [12, 13, 17] — ✅ 7.1, 7.2, 7.4 built 2026-11-19 (7.3 answered by R9.2)

**Built.** Done always writes what the stage shows as the layer's Tune row, one undo step; Cancel (new, beside Done) and Escape write nothing; re-entering reads the row's settings. Cause found: Done wrote only after a setting had changed (a visit that only looked wrote nothing) and Escape did what Done did; a changed visit did write, reload and undo in Chrome, so his loss was not reproduced beyond that. H in the Tune mode's stage handler and in `apps/tuner` hides every overlay (the boards' `peek`), the hint is the last line of the rail. `apps/tuner` is kolbox's look: theme variant kolbox, the board and kolbox's `RightRail` with the Tune mode's panels; the float pages and Rolls page are in `_tmp/2026-11-19-tuner-system/retired/`. Pass: `_tmp/2026-11-19-tuner-system/pass.mjs`, 22 of 22.

### 7.1 — Done keeps the work [12]
- Leaving the Tune mode loses what was made. Done and Escape write the result to the layer.
- Acceptance: Generate, change two measures, Done: the layer shows that mark; re-entering shows the same measures.

### 7.2 — A key for the shape alone [12]
- One key hides every overlay and shows only the shape, and brings them back.
- Acceptance: the key toggles all overlays off and on; it is listed in the mode's rail.

### 7.3 — Modify is unreadable [13]
- "modify is just a mess here": the curvature comb as big red wedges over the form, paragraphs of readout text on the canvas, every overlay on by default. Modify opens showing the form and its tuned outline only; each overlay is opt-in; the readout moves off the canvas into the rail.
- Acceptance: on entering Modify, 0 text on the canvas and at most two overlays on; each overlay still reachable from Show.

### 7.4 — The standalone tuner is in the float look [17]
- "tuner set in float for some reason": `apps/tuner` takes the kolbox style (or the default), never float.
- Acceptance: 0 float components in `apps/tuner`.

## R8 — Line Swell in the editor, as his canvas has it [11, 19]

Cause: the port carried the board ENGINE into the generator window (steps, presets, Roll, Spread) and nobody on the main thread opened his canvas. His canvas already is the tool: a board per form, and one Tweaks panel of plain controls, a word, a number and a slider each, where moving "size" from 0.48 to 0.99 visibly grows the S. His words: "what you made was not for humans."

The canvas: `https://claude.ai/artifact/4Npm9zbKAg753Cz4TMPSKw` (Line Swell). Its pages: Presets (page 1), Line Effects, Motion (page 9, `#page-e9ca4c8d8587`), Construct, System, Tuner.

### 8.0 — Read first, and write down why — before anything is built
- His instruction: "dont just copy, look at what the fuck is happening and why.. read the logs. figure out WHY I made these tools.. and why I want them in the repo.. also look at how clean this is set up in the artifact, and question yourself, if its sloppy when you do it.. if anyone will be happy about it."
- I open the canvas myself (not an agent's summary): every page, every board, its Tweaks panel, the yellow notes on each page, and the process logs in `kol-branding/docs/documentation/05-logo-shapes/` (the process and limits pages). Written to `_tmp/2026-11-19-line-swell/why.md`: what each tool is for, what problem he was solving when he made it, why it belongs in the editor, and what makes the canvas clean (one panel, sections of four to seven controls, plain names, a live picture, presets as pictures).
- Acceptance: for each of Swell, the seven line effects, Motion, System and Tuner: one paragraph of why, and its Tweaks panel written out section by section, control by control with its range and default, from the canvas itself.

### 8.1 — How it opens: a picture picker, like his reference
- His reference (two captures of Figma): the Effects plus opens a menu; "Shader" in it opens a small window, "Shader effects", with a search field and a grid of picture tiles, each a preview of the effect with its name. He wants the same: Effects, then Line Swell, then a grid of pictures. "VISUAL INDICATOR to the form."
- The tiles, in his grouping:
  - **Swell on shapes**: "mainly its piano style on shapes": the piano sheet's forms, a few of them ("not all, this is actually maybe just 3 or 4"), not all eight preset boards.
  - **Half**: "its also a form divider so you can set fx on half or part of shapes": the half sheet (a shape split by a line, the effect on one side).
  - **The line effects that make forms**: Warp, Radial, Moire, Pinch, Flow, Rotor, Vortex. "EACH has unique settings."
- Picking a tile adds the effect to the layer as an effect row and opens its settings.
- Acceptance: Effects shows one Line Swell row; it opens a window with a search field and a tile per form in those three groups; each tile is a real render of that form, not an icon; picking one adds one effect row.
- **Built 2026-11-19, met.** Effects › Line Swell (one row; out of Generate and the generator window) opens a movable kolbox window (`editor/kolbox/editor/lineSwell/WindowLineSwell.jsx`): search, then Swell 4 (Piano on a circle, a hexagon, a letter; Blinds), Half 3 (variants 2, 9, 22, three of his roll starting points) and Line effects 7, each tile drawn by the engine. A pick adds one `lineSwell` row, with the layer as the source (a shape or path: shape `layer`, a port addition; a text layer: its first letter). Driven in Chrome dark and light (`_tmp/2026-11-19-line-swell/drive.mjs`): 14 of 14 tiles drawn, "vor" leaves Vortex, the window moves 100, 60 by its header, one row, eye off and on, minus back to the plain rectangle, 0 page errors.
- Decided for review: the window has no plus (nothing for it to add here); the panel shows in the rail under Effects (closest to his panel at the right of the picture), not in a window; the three Piano tiles all become the layer's own shape when picked on a shape layer, as the source rule says.

### 8.2 — The settings are his Tweaks panel, one to one
- Swell's panel, as on the canvas: **Shape** (shape, letter, size, breakUp, pattern, thickPart inside or outside), **Lines** (count, angle, thin, thick, length frame or shape, overhang, ends square or round), **Transition** (transition, curve bevel or swell, shift, growFrom center or base), **Color** (ink, ground). The same words, the same order, the same ranges, a number box and a slider for every number, a two-way choice where his has one. Each line effect gets ITS panel from its own board, not Swell's.
- No Steps list, no Field map, no Advanced fold, no Roll, no Spread, unless his panel for that form has it under that name.
- Acceptance: for every form, the settings in the editor equal its board's Tweaks panel: same sections, same controls, same names, same defaults; moving each control changes the picture the way it does on the canvas (checked by me, side by side, before he is asked to look).
- **Built 2026-11-19, met.** `generate/lineSwell/spec/build.mjs` reads every live board's `data-props` into `spec.json` (9 forms); `LineSwellSettings.jsx` draws it in the kit. Rendered labels against the spec: 0 differences in all 9 forms. Side by side, the live engine's board at its defaults against the editor's layer: the same picture in all 9 (`shots/dark-sheet.png`). Three forms, three controls each moved in the panel (`drive-controls.mjs`): the letter one grows with size 0.48 to 0.99 and inverts with thin and thick swapped; Piano and Vortex each change with every control. Left out, said in the spec: Motion (the layer does not animate; 8.4), `handles` and `view`. The engine checked against live `line-swell.js`: the port's functions are his, `vals` and the studies carried in.
- Not matched: a letter is drawn in the editor's Inter; the board's canvas falls back to Arial Black, so the S differs a little in cut.

### 8.3 — Presets are the proven ones
- "these can be presets since they are proved to work": the refs sheet (`refs-01-sheet`, 28 named references: Swell blinds broken up, keys, steps, steps on a peak, glyph, hex, taper, sun, sun full width, Warp wave with swell, Pinch, blinds, telescope on a diamond, ridge with soft bumps, Warp wave, ridge, sun reversed, telescope on a peak, steps two bars, ridge in a circle, blinds with a shifted core, bars with hairlines, telescope upright, telescope on a diamond dark on light, and the rest). Each is a preset of its form, shown as its picture.
- Acceptance: every reference on the sheet is a preset that reproduces its picture; the invented presets ("<board> roll N", the twelve named for Tiling, Stipple and Mosaic) go.
- **Built 2026-11-19, met.** The sheet's 24 marks are presets (master 18, Blinds 3, Warp 2, Pinch 1), each its form's panel values, each drawing its reference's exact path (`node src/generate/lineSwell.check.mjs`: 24 of 24); the panel's `preset` opens them as pictures. The port's invented presets (the 16 Swell bases, the board copies, the roll presets) are gone. Labs lists the same forms with the same panels and presets.

### 8.4 — Motion is Labs'
- "Motion on 9 for labs": the canvas's Motion page, and "also on 'wave shapes'". These are Labs loops, each with its board's own controls.
- Acceptance: each board on the Motion page is a Labs entry whose settings equal its Tweaks panel.
- **Built 2026-11-19, met.** The five Motion boards and the three Wave shapes boards are loops in Labs' Line Swell group (`generate/lineSwell/labs.js`; `spec.json` `loops`, read by `spec/build.mjs` from the live canvas; Band, Capsules and the landing on `waveOrganism.js`, his `wave-organism.js` verbatim). Labs' categories are his pages (Presets, Master, Line Effects, References, Motion, Wave shapes); the rail (`editor/kolbox/labs/LineSwellLabs.jsx`, no tabs) shows the page's boards as picture tiles drawn by their loops, then `LineSwellSettings` on the board's spec (new optional `spec` prop). Time as each board's renderVals: `loop` sets the transport, `play` off holds `frame`; the seven line effects (and Swell) show their Motion section and move by it. The invented `lineSwell/motion.js` (capitalised labels, Ink and Ground roles, no Time section, the references as presets of Wave) and the old motion check are in `_tmp/2026-11-19-line-swell/retired-motion/`. One pass in Chrome on 5297 (`_tmp/2026-11-19-line-swell/drive-motion.mjs`): 17 boards opened, labels against the spec 0 differences, 0 page errors; contact sheet `shots-motion/sheet.png` (board from his live files beside Labs' stage, defaults): the same picture on all eight but Keys' letter; Wave and Spikes recorded at 30 fps over one loop (`rec-wave.mp4` 90 frames, `rec-spikes.mp4` 180, every frame distinct, the seam strips continuous). `node src/generate/lineSwell.motion.check.mjs`: 7 boards draw his live engines' path at three times, all 8 move and close, 7 line effects move by their Motion; `lineSwell.check.mjs` unchanged, 24 of 24.
- Decided for review: most boards open frozen, as his do (`play` defaults off; Capsules plays); Capsules and the landing (speeds 0.9 and 1.05) close only after 20 cycles, a 240 s loop, kept rather than rounding his speeds; a board is drawn whole and centred in Labs' canvas (contain), its ground filling the rest; the landing's page words (Atlas, Brand manual, Menu) are not drawn, the wave is; Labs' Line Swell rail drops the Type, Category and Preset pickers and the R and Shift+R keys (the left rail and the tiles pick); Swell's Motion section shows in Labs too; vortex's `x` and `y` are stored as `lsX`, `lsY` (a layer's own fields; they were silently dropped before); the Motion window lists the eight boards.
- Not matched: Keys' letter is the pixel font in Labs (his board's canvas draws a system sans).

## R9 — System and Tuner, as his canvas has them [12, 13, 17, 19] — ✅ built 2026-11-19

**Built.** The four boards' `data-props` copied from the live canvas into `packages/tuner/src/specs.js`; `RailTweaks` (`design-editor/src/editor/kolbox/ui/`) draws a spec in the kit; `tune/TunePanel.jsx` holds System (system-01-arcs, 8 sections, random with his note, then the 24 rolls as pictures, a pick sets random) and Tuner (tuner-01-form; `advanced` swaps in tuner-02-advanced). Labels against the specs: 0 differences on all three, editor and app. Boards draw their palette (`logoInks`). Construct not brought in. Decided for review: Show and Color are in System's panel (the file has them); the advanced board's tuning settings stay unset until moved so the preset governs them; Modify opens as tuner-01-form draws at its defaults, readout text included; the Amount section left the panel (the row keeps its amount); Modify's Source section left (a file is picked or dropped on the board).

Cause: the Tune mode was built from the engine's settings, with every overlay on and the readout on the canvas. His canvas has it clean. "its system and tuner, construct was the trial error": Construct is NOT brought in.

### 9.1 — System (Generate)
- His panel: **Randomise** (random), **Measures** (harmony, y, x, steps, angle), **Arcs** (circles, axisAt, join union or flip, invert), **Parts** (bar, foot, footAt, footSize), **Layout** (mirror, flip, size), **Grid**. The board shows the mark with its construction; the sheet of 24 under it are rolls.
- Acceptance: the mode's Generate rail equals that panel, section by section; the 24 rolls are shown as pictures to pick from.

### 9.2 — Tuner (Modify)
- His panel, the simple board: **Start here** (preset, effect 0 to 100 percent, read as outline, strokes or auto, view, reset), **Guides** (keylines, grid, comb, all three OFF or minimal by default as on his board). The advanced board is a second panel, opened on purpose.
- This answers R7.3: Modify opens as his `tuner-01-form` board does, not with every overlay on.
- Acceptance: Modify's rail equals the simple panel; the advanced settings are one step away; on entering, the canvas shows what his board shows at its defaults.

(R7.1 Done keeps the work, R7.2 the shape-only key, and R7.4 the standalone app out of the float look stand as written above.)

---

# S — His second look, `pnpm editor` in the kolbox style (2026-11-19, after R; nothing here is built)

**Status:** built 2026-11-19 on his go. Points verbatim, with his captures (Home on 5180; Figma's dock and tool menu above kolbox's):
1. "the color is still light yellow that we decided should be white right?"
2. "shouldnt we be using split button and accent is only on hover, not selected"
3. "the icons are also still wrong, wrong pen wrong node, and why is pattern in the dock?"
4. "and f is for frame and fps can be something else in shortcuts"
5. "text is still wrong [his capture: "New text" at display size, the selection box and the text highlight out of line] it should just open a blinking text line [his capture of Figma: an empty box with a caret] set at 12pt size"
6. "pressing input like [his capture: the Fill row, the 100 selected] one time shoud highlight the string AND in color pressing f enter should repeat ffffff and pressing 1e should repeat 1e1e1e"
7. "editor should open with rulers shown"
8. "if modal is open you should still be able to move focus on canvas (with trackpad) currently its ignored" [his capture: the Stripe Array window over the editor]
9. "we need some scale to fit option, its weird that its fixed in size rather then fit to content" [his capture: the stripes as a small patch in the middle of a 317 by 317 rectangle]
10. "why are the input rules different in the modal? and are these buttons same as kolbox defines?" [his captures: the window's Ink and Ground fields; the rail's Fill row; the window's foot with Reset, Randomise, Cancel, Apply]
11. "if I zoom in that should only zoom content NOT the frame" [his capture: a selected rectangle zoomed in, the line, handles and size chip grown with it]
12. "also the vector adds black background, but background is already on the shape, the tool should open with background unset"
13. "look at all the yellow text still, this is where we want to use FFF and rather use ink roles opacity for hiearchy ? that way we dont get this disconnect from some text and icons yellow vs ffff" [his capture: the editor, the rail labels, field icons and muted glyphs in the warm tone beside white titles]
14. "default objects on canvas [Figma: a grey rectangle and a darker grey frame, its name in muted grey above] hover shape [an accent line round the shape, its Layers row lit] hover frame [an accent line round the frame, its name in the accent, its Layers row lit]"
15. "split corner radius per corner button doesnt work"
16. "boolean doesnt show unless two objects are selected, figma doesnt do this and if two is selected [Figma: "2 selected" with mask, boolean and more; Position with X Mixed, Y, rotation; Layout with W, H and the gap; Appearance; Fill; Stroke; Effects; Export] vs ours [no title, the boolean alone; "2 layers selected." and the align row; opacity, an outlined blend dropdown, a Group selection button]"
17. "line swell shouldnt open like this [ours: a window in the middle of the canvas] but like shader effects [Figma: the Shader effects panel docked at the right rail's left edge: title, plus, close, search, groups, two columns of pictures]"
18. "why is blinds black bg? other blue"
19. "why are settings in the rail ? figma uses [Figma: a floating window beside the rail, "Halftone" with a dropdown, more and close; rows of label, dropdown or slider with its field; the effect's row lit in Effects under "Shader effects"]"

**Law added by him this session:** "dont make tickets without my permission". Nothing goes to another repo's lobby without his word; kol-fxr has not been told the engine here is ahead.

## S1 — The white ruling stopped at the text [1]

Cause: dark kolbox's text is `#ffffff` (`--kol-surface-on-primary`), but the ink ladder under it was never touched: `--kol-oq-08` to `--kol-oq-64` in `packages/theme/kol-color.css` (the kolbox dark block and its system-follow mirror) are still the warm browns `#32302f` to `#a89984`. Icons, muted labels, rules and chevrons draw from that ladder, so the screen still reads yellowish.

### 1.1 — The ladder follows the white — ✅ built 2026-11-19 (read in the running editor: the six steps are #393939 to #b2b2b2, 0 warm inks left but the accent)
- His ruling, point 13: text is `#FFFFFF` and hierarchy comes from the ink roles' opacity, never from a second hue. Muted text takes white at its role's opacity step.
- The six `--kol-oq-*` steps in kolbox dark become white at the step's share over the ground, in both blocks, so icons (solid by law, never translucent) land on the same greys as the text. Light kolbox is not touched.
- Acceptance: on Home, Editor and Labs in dark, the computed color of every rail icon, muted label and chevron has its red, green and blue within 3 of each other; 0 uses of the six old hexes left in the kolbox dark blocks.

### 1.2 — The accent — answered by his point 13: the ruling is about text and icons; the accent stays
- The yellow accent (`#fabd2f`: Create, the lit row, the armed tool) was not part of the white ruling. Whether his point 1 means the accent too is his to say.

## S2 — The dock was drawn by hand, not from the kit and his reference [2, 3]

Cause: `ToolRail variant="kolbox"` (`packages/shell/src/ToolRail.jsx`) draws its own button with a loose chevron beside it; its glyphs were picked by name (`GLYPH` in `editor/kolbox/editor/tools/ToolDockEditor.jsx`) and never read against his dock; its slots were copied from the design frame's count, so the frame's grid tool became the engine's pattern tool.

### 2.1 — A tool with more is the split button [2] — ✅ built 2026-11-19
- Built: ButtonSplit kolbox gained an icon-only form (`iconOnly`, `pressed`, `tooltip`); the dock's five fold slots draw it, the loose chevron and its CSS retired to `_tmp/2026-11-19-dock/`.
- Every dock slot that has a fold is `ButtonSplit variant="kolbox"`: the tool on the left half, the chevron on its own half with its own hover fill, as his capture. A slot with no fold stays a plain button.
- Acceptance: in the kolbox dock, slots with a fold = `ButtonSplit` count; 0 `kol-tool-chevron` left; hovering the chevron half fills that half alone.

### 2.2 — Accent is the pointer's, the check is the selection's [2] — ✅ built 2026-11-19
- Built: the tool menu's rows carry `check` instead of `highlighted`, so it opens unlit and the current tool takes the lead-column check; other kolbox menus unchanged.
- In the tool menu the row in the accent is only the one under the pointer or the keys. The current tool carries a check in the lead column and no fill of its own. The menu opens with no row lit until the pointer or a key moves.
- Acceptance: menu open, pointer on a row that is not the current tool: exactly 1 row has the accent fill and it is the pointed one; the current tool's row has `aria-checked="true"`, a check glyph and no accent fill.
- His word needed on one thing: the armed tool's own button in the dock is solid accent today, as Figma's is in his capture. Left as is unless he says "not selected" covers it too.

### 2.3 — The pen and the node glyphs [3] — ✅ built 2026-11-19
- Built: pen draws `pen-nib`, Node select draws `vector-nodes`, both from the set, picked by eye against his description (28:9326 not read).
- Pen draws the set's `pen`; Node select draws `arrow-upleft`, a plain arrow standing in. Both are replaced by the glyphs his reference dock shows, read from the kolbox file's ToolDock (28:9326), not chosen by name. A glyph the set lacks is drawn to the icon spec and added to kolbox's Icon set.
- Acceptance: a name-by-name read of the dock's glyphs against 28:9326: 0 differences, every tool and every fold row.

### 2.4 — Pattern leaves the dock [3] — ✅ built 2026-11-19
- Built: the pattern slot is gone from the dock; Effects › Layer effects › Pattern adds the row; the pattern tool has no key in the keymap.
- Pattern is an effect under the layer model (W22). The slot goes; pattern is reached through Effects, where it already is. Its key, if it has one, is reported, not reassigned.
- Acceptance: the dock has 0 pattern slot; Effects › Pattern adds a pattern row to the selected layer.
- Figma ✅ 2026-11-19 (S2.1 to S2.4): library `ToolRail kolbox` 2323:12910 = the code, 467 by 52: select (`ButtonSplit kolbox` icon form, pressed, `pointer`), frame (`ToolRailSlot`, `add-frame`), pen (`pen-nib`), rectangle (`square`), text (`font-01`), rule, hand (`hand`), rule, image, crop; 0 pattern slot. `ButtonSplit kolbox` `iconOnly=true` redrawn to the code's dock form (36 main, 24 menu, 1 apart, 20 glyph, 12 chevron) with `rest`, `hover`, `hover menu`, `pressed` and an `icon glyph` swap; `ToolRailSlot` glyph in the ink. The tool menu's check is `MenuRow kolbox` `checked`, already there. Waits on his publish.

### 2.5 — F is the frame tool [4] — ✅ built 2026-11-19 (F arms Frame; the fps readout is Shift+F; 0 duplicate combos)
- His point 4, verbatim: "and f is for frame and fps can be something else in shortcuts". Today the frame tool has no key and F toggles the fps readout (`editor/state/keymap.js`, `fps`). F becomes `tool-frame`; the fps readout moves to another combo, mine to pick from what is free, reported.
- Acceptance: F in the editor arms the frame tool and the dock's frame slot shows F in its tooltip; the fps readout still toggles on its new combo; 0 duplicate combos in the keymap for the editor view.

## S4 — A new text layer is born full, not empty [5]

Cause: the text tool adds a finished layer instead of opening a caret: `compose/state.jsx` places a 600 by 120 box with `TEXT_DEFAULTS` (size 96) and the words "New text", then selects those words, and the selection box and the highlight are measured apart. This is the creation, not the Typography section (R4.1, still waiting for his reference).

### 4.1 — The text tool opens a caret — ✅ built 2026-11-19 (a click opens an empty 12 text at the pointer that hugs what is typed, a drag a fixed box of the dragged size; an edit that ends empty removes the layer, `TypeBlock` `onExit`; selection and text box 0 px apart)
- A click with the text tool opens an empty text layer at the pointer, in edit, with only the blinking caret; a drag opens it as a box of the dragged size, as his capture. No placeholder words. The default size is 12. Leaving it empty removes the layer.
- Acceptance: after one click with the text tool the new layer's text is "" and its size 12, the caret is in it and typing "a" gives "a"; Escape with nothing typed leaves 0 new layers; with text typed, the selection box and the text's own box differ by at most 1 px on each side.

## S5 — The rail's fields do not behave as fields [6]

Cause: kolbox's `Input` places a caret on click instead of selecting, and the color field takes only a whole hex.

### 5.1 — One click selects the value — ✅ built 2026-11-19 (`selectOnFirstPress` in kolbox's `Input`, also on ColorInputRow kolbox's hex and opacity: Fill hex, opacity and X each selected whole, one key replaced it)
- In kolbox's `Input` (the atom, so every rail field gets it): the click that focuses a field selects its whole value; a second click places the caret.
- Acceptance: one click on the Fill hex, the opacity and a Position field: the selection is the whole value in each; typing one character replaces it.

### 5.2 — Short hex repeats — ✅ built 2026-11-19 (`expandHex` in ColorInputRow kolbox: f, 1e, f80 read FFFFFF, 1E1E1E, FF8800; zz kept the old value)
- On Enter or blur in a color field: one character repeats six times, two repeat three times, three double each character; six is taken as written. Anything else restores the old value.
- Acceptance: "f" then Enter gives FFFFFF; "1e" gives 1E1E1E; "f80" gives FF8800; "zz" leaves the field as it was.

## S6 — Rulers open hidden [7] — ✅ built 2026-11-19 (a fresh profile opens with both rulers)

Cause: an earlier phase (W19.3) set the kolbox editor's rulers off by default (`editor/kolbox/pages/Editor.jsx`, `RULERS_KEY`); his ruling reverses it.
- The default is on; a stored choice still wins; Shift+R still toggles.
- Acceptance: on a profile with no `kolbox.editor.rulers` stored, the editor opens with both rulers drawn; after Shift+R and a reload they stay hidden.

## S7 — The generator window was built as a dialog with its own parts [8, 9, 10]

Cause: `WindowFrame.jsx` sits on `ModalDialog variant="kolbox"`, a blocking dialog with a full-screen layer, and the window's body draws its own fields (`Box` in the generator window) instead of the rail's. It also writes its output at the generator's own 512 by 512, whatever the layer's box.

### 7.1 — The canvas stays live under a window [8] — ✅ built 2026-11-19 (`ModalDialog variant="kolbox" blocking={false}`, on the one WindowFrame: no dim, scroll moved the view 120 px and a pinch took zoom 66 to 85 percent over the canvas, 0 change over the window, a canvas press left it open)
- Scroll, pinch and pan outside the window reach the canvas while a window is open (the generator, Color Modes, Motion, Export: the one frame). What lands on the window stays the window's. A press on the canvas does not close it.
- Acceptance: with the Stripe Array window open, a two-finger scroll over the canvas moves the view and a pinch changes the zoom percent; the same gestures over the window change neither.

### 7.2 — The window's fields are the rail's fields [10] — ✅ built 2026-11-19 (colors are ColorInputRow kolbox, numbers kolbox's Input through CommitInput; Ink, Ground and the rail's Fill all 24 high, rgb(74,74,74), 11 px, 400, a swatch each; `Box` in `_tmp/2026-11-19-windows-2/`)
- A color in a window is the rail's color field: swatch, hex without the hash, the same height, fill and type as the Fill row; S5's rules (one click selects, short hex repeats) come with it. Number and text fields likewise: kolbox's `Input` at the rail's height.
- Acceptance: the window's Ink and Ground fields and the rail's Fill field read the same height, fill color, font size and weight; each shows a swatch; 0 uses of the window's own `Box` left.

### 7.3 — Fit to the layer [9] — ✅ built 2026-11-19 (a Fit dropdown in Frame, Fit, Fill, Actual size; `generateMarks` scales the picture drawn at the canvas's 1080 into the box; 317 square with the 128 inset: art 241.9 square under Fit, 61 under Actual size as before; a layer from before reads Actual size)
- The Frame step gains a Fit choice: Fit (the default), Fill, Actual size. Fit scales the output to the layer's box, keeping its proportions.
- Acceptance: Stripe Array applied to a 317 by 317 rectangle with Fit: the output's box is 317 by 317 less the inset; with Actual size it is as today.

### 7.4 — The window's buttons — TALK [10]
- Answered, not changed: they are kolbox's own `Button`. Apply is the primary tone; Reset, Randomise and Cancel are the secondary tone, which the kit defines with a fill and an edge (`oq-16`, `oq-24`). Whether the secondary keeps its edge is his call.

### 7.5 — The ground opens unset [12] — ✅ built 2026-11-19 (Ground has no default in the engine's Frame rows or the presets; between two stripes the pixel reads #222D3D, the Ground field is empty)
- A generator's Ground is empty by default: only the ink is drawn and the shape's own fill shows. Setting a ground on purpose still works.
- Acceptance: Stripe Array applied with its defaults to a rectangle filled `#222D3D`: the pixel between two stripes reads `#222D3D`; the Ground field is empty.

## S8 — The selection is drawn inside the zoom [11] — ✅ built 2026-11-19 (the selection's screen scale reads the published zoom, so the canvas's own selection no longer froze at the first fit; handle edges are an inset shadow, not a border that rounded up: at 23, 100 and 400 percent the line 1 px, a handle 6, the chip 18)

Cause: the selection line, its four handles and the size chip are drawn in the canvas's own space, so they scale with the view.
- They are drawn at a constant screen size at every zoom: the line 1 px, the handles and the chip the size they have at 100 percent. The same for the frame's name and its selection.
- Acceptance: at 25, 100 and 400 percent, the selection line's drawn width, a handle's side and the chip's height on screen are the same three numbers.

## S9 — Objects on the canvas: how they are born and how they answer the pointer [14]

Cause: new layers take the engine's own defaults (a navy rectangle, `palette:dark`), and the canvas has no hover state at all; only selection is drawn.

### 9.1 — Defaults — ✅ built 2026-11-19 (kolbox's shape tools draw `#d9d9d9` at fill opacity 20, no stroke; the frame stays white, its name muted)
- A new shape is filled `#D9D9D9` at 20 percent, as the Fill row in his capture reads; no stroke. A frame's name sits above it in the muted ink.
- The frame stays white, as C1 built it (the grey frame in his capture was his own change).
- Acceptance: a rectangle drawn on a fresh file has fill `D9D9D9`, opacity 20, 0 strokes.

### 9.2 — Hover — ✅ built 2026-11-19 (one hover store, `compose/hoverStore.js`, shared by the canvas and the Layers rows: pointer on a shape 1 outline and its row lit, on the row the same outline, away 0; a frame's name turns accent on hover)
- The pointer over a shape or a frame draws one accent line round it, no handles; a frame's name turns accent. Its row in Layers lights at the same time, and hovering the row lights the object. Hover never shows on the selected object.
- Acceptance: pointer over an unselected rectangle: 1 hover outline on the canvas and its Layers row carries the hover state; pointer over its Layers row: the same outline on the canvas; pointer away: 0 outlines.

## S10 — The inspector's header and its many-selected state were left as stubs [15, 16]

Cause: parts were drawn from the design and not connected (`Sections.jsx`: "Independent corners" has an empty action), and a selection of two or more gets its own short panel instead of the inspector.

### 10.1 — Corners, one by one [15] — ✅ built 2026-11-19 (the corners button opens four fields under the radius row: 12 top left gave radii 12, 0, 0, 0; pressed again, one field reading Mixed)
- The corners button opens four fields under the radius row, one per corner, and folds back to the single field when pressed again; a mixed set reads "Mixed" in the single field.
- Acceptance: pressed, 4 corner fields show; 12 in the top-left alone gives the layer a top-left radius of 12 and 0 on the other three; pressed again, 1 field reading "Mixed".

### 10.2 — Boolean with one object [16] — ✅ built 2026-11-19 (the button and its chevron open the menu with one layer: 4 rows, all disabled until a second object)
- The boolean button and its chevron open their menu with one layer selected, as in Figma; rows that need a second object are shown disabled, not hidden.
- Acceptance: one rectangle selected: the chevron opens the menu listing every boolean row.

### 10.3 — Two or more selected is the inspector [16] — ✅ built 2026-11-19 (header "2 selected" with mask, boolean and more holding Group selection; the 7 sections; X Mixed, Y 331; W 40 set both widths to 40; the count line, the blend dropdown and the Group selection button are gone)
- The header reads "2 selected" (the count) with mask, boolean and more. Under it the same sections as one layer: Position (align, X, Y, rotation, the distribute action), Layout (W, H, the gap between), Appearance, Fill, Stroke, Effects, Export. A field whose values differ reads "Mixed"; an edit applies to every selected layer. The "2 layers selected." line, the outlined blend dropdown and the Group selection button go; Group is in the more menu and on its key.
- Acceptance: two rectangles with different X selected: the header reads "2 selected"; 7 sections show; X reads "Mixed" and Y its number; typing 40 in W sets both layers' width to 40.

## S11 — Line Swell was put in a window and in the rail; his reference is Figma's shader effects [17, 18, 19]

Cause: R8.1 opened the picker as a window on the canvas and R8.2 put the settings in the rail one to one with his Tweaks panel. Figma's shader effects are the reference for both, and that reading was missed. This replaces where R8.1 and R8.2 put things; the controls and presets they built stay.

### 11.1 — The picker opens at the rail [17] — ✅ built 2026-11-19 (`WindowLineSwell` on `PopoverPanel variant="kolbox"` at the Effects row: right edge 8 px off the rail, 0 overlap with the shape, closed on a pick with the row added; its top moves up to stay on screen)
- Effects › Line Swell opens the picker docked at the right rail's left edge, its top on the Effects row: title, close, search, a rule per group, two columns of pictures with their names. The canvas stays clear and live (S7.1).
- Acceptance: the picker's right edge is within 8 px of the rail's left edge; 0 px of it overlaps the frame at the default view; picking a tile adds the effect row and closes it.

### 11.2 — Every tile on one ground [18] — ✅ built 2026-11-19 (`LineSwellPicture` draws the text ink on the field for every tile; 7 tile corners read one color, #4A4A4A)
- Answered: each tile draws its board's declared colors; Blinds declares white on `#000000` and is drawn as written, the others declare dark on light and are swapped to the picker's tile. Every tile is drawn the same way: white ink on the picker's one tile ground.
- Acceptance: all tiles' corner pixels read the same color.

### 11.3 — The settings are a floating window [19] — ✅ built 2026-11-19 (the row opens `PopoverEffect` beside the rail at 320: the name switches the form, more holds Disable and Delete; Vortex: rail keeps its 7 sections, 19 of 19 controls, 0 camelCase labels, no help line)
- Pressing an effect's row opens its settings in a window beside the rail, as his capture: the effect's name with a dropdown to switch form, more, close; rows of a label and a dropdown, or a slider with its field. The rail keeps the layer's own sections, the row lit. Labels are plain words, never the code's names (`randomSpread`, `well`); the help paragraph goes.
- Acceptance: with the Vortex row pressed, the rail still shows Position, Layout, Appearance, Fill, Stroke, Effects and Export; the window lists every control the rail panel had; 0 labels in camelCase.

## S3 — Figma's rail ground [asked this session]

Cause: the code's dark kolbox rail went to `#282828` in the live pass; the kolbox file still draws `#19191d`. Part of F2.1 (values), named here because he asked. Figma, one agent, on his go.
- Acceptance: on `↳ Layout UI`, 0 rail fills resolving to `#19191d`.
- ✅ 2026-11-19, met: the cause was the page's sections pinned to Dark on a stale copy of the `theme` collection (Light and Dark only), so kolbox dark never applied. The 10 sections of `↳ Layout UI` now pin the library `theme` to kolbox dark; 0 fills resolve to `#19191d` (308 before), rail fills read `#282828`. Two old `#a89984` inks remain until his publish brings the new ladder.

---

# T — Gaps, bugs and an audit of the whole app (2026-11-19, late; nothing here is built)

**Raised:** 2026-11-19, his words: "still short add to /plan-shape , fix gaps and bugs, home view and incomplete features and disabled buttons, audit app features, beahaviour consistency and effects and tools".
**Status:** built 2026-11-20 on his go. T1 built; T2's audit read 3216 controls (54 dead, 8 wrong) and is at `docs/operations/07-apps-tier/11-kolbox-audit.md`; T3 to T6 built from it in three file groups, and the re-check reads 0 dead, 0 wrong. Figma mirrored on Atoms, Molecules and Organisms. Open: his publish and accept; what T dimmed or left out is section U.
**Where it runs:** `pnpm editor` with the Kolbox style: Home, Library, Editor, Labs, Morph, Randomiser, Settings, the search modal.
**Law for all of T, his words:** "and compare against figma when you dont know". Wherever the right look or behaviour is not already ruled or written, the answer is Figma's: open the same thing in Figma in Chrome, read it, and build that. Never guess, never ask him, never park an item for his reference.
**How a phase closes:** its acceptance line, read once in the running app, and looked at.

## T1 — Still short from today's build

### 1.1 — Export drops the type features that are not a one-for-one swap — ✅ built 2026-11-19 (`modes/type/shape.js` shapes the export through the canvas's feature set; "1/2 fi AV" with frac, dlig, cpsp: same ink blobs canvas and export, left and right edges within 1 px, checked in Chrome outside the app)
- Cause: the outline export applies only features that replace one glyph with another. Contextual alternates, rare ligatures, fractions, Inter's ss03 and capital spacing show on the canvas and are lost in exported outlines.
- The export shapes text through the same feature set the canvas uses (many-to-one, one-to-many and spacing features included).
- Acceptance: a text layer "1/2 fi AV" with fractions, rare ligatures and capital spacing on: the exported SVG's outline, drawn over the canvas at the same size, differs by 0 glyphs and at most 1 px in advance per glyph.

### 1.2 — Effects with several layers selected — ✅ built 2026-11-19 (two rectangles, Line Swell Vortex added through the menu: 1 row, its eye hides it on both, its minus removes it from both; the menu lists the same 7 groups as the one-layer menu)
- Cause: the many-selected inspector adds an effect to every layer but its Effects section lists nothing, and Generate, Tune, Morph and Line Swell are left out of its menu because each opens a window on one layer.
- The section lists the rows the selected layers share (a row some lack reads "Mixed"); eye and minus act on all of them. The four window effects are in the menu and open their window on the selection, applying to each layer.
- Acceptance: two rectangles selected, Vortex added: 1 row shows in Effects, its eye hides the effect on both, its minus removes it from both; the menu lists every effect the single-layer menu lists.

### 1.3 — Hanging punctuation — ✅ built 2026-11-19 (every line, both edges: quote 14.83 px outside the left edge, full stop 10.63 px outside the right, its own width each; export overlays the canvas)
- Cause: only a paragraph's first line is hung.
- Every line that starts or ends with a hanging mark is hung, on both edges.
- Acceptance: a three-line paragraph with a quote opening line 2 and a full stop closing line 1: both sit outside the text box's edge by their own width.

### 1.4 — The two text controls still dead — ✅ built 2026-11-19 (Decoration more opens Basics / Underline: thickness, offset, skip ink, color; 2 and 4 read back 2px and 4px on the canvas, a 2 px band 4 px down in export; Styles stays dimmed)
- Cause: the engine has no text styles, and underline has no settings (offset, thickness, color, skip ink).
- Decoration's "more" opens those four underline settings and they draw. The Styles action waits on text styles: TALK, it is a feature of its own (saved styles, a picker, applying and detaching), not a control.
- Acceptance: underline thickness 2 and offset 4 on a layer read back as 2 and 4 on the canvas and in export; 1 control in the Typography section is left dimmed (Styles).

### 1.5 — Long feature names are cut — ✅ built 2026-11-19 (a feature row over 20 characters shows its whole name in a tooltip; the three names hovered in the app, each tooltip whole)
- Cause: three stylistic set names from the font are longer than the label column ("r curves into round neighbors", "Disambiguation without slashed zero", "Alternate German double s").
- The full name shows in a tooltip on the row.
- Acceptance: hovering each of the three shows its whole name.

## T2 — The audit, before any fix

Cause it answers: every piece so far was checked on its own acceptance line; nobody has gone through the whole app control by control. The count in the source (2026-11-19, it replaces the first loose count): 22 `noop` presses in the inspector (`Properties.jsx`, `Sections.jsx`, `Typography.jsx`, `Canvas.jsx`), 19 "Not wired" marks in 9 files, 13 controls disabled outright.

### 2.1 — Every control, on every screen, once — ✅ 2026-11-19 (`docs/operations/07-apps-tier/11-kolbox-audit.md`: 3216 rows on 13 screens and states, Home 87, Library 57, Editor 505, a rectangle 789, a text layer 609, a frame 54, two selected 67, Labs 287, Morph 497, Randomiser 62, Settings 61, the search modal 95, Media 46; works 3016, dead 54, disabled with a reason 46, disabled with no reason 92 (70 of them greyed menu rows, as Figma's), wrong 8, 0 blank; effects 633 of 637 cells pass over 91 effects, tools 82 of 102 over 17 tools, 53 of 53 printed editor shortcuts act; driven in installed Chrome on a task server at 5291; Figma read in Chrome, look only)
- Each of the eight screens is driven control by control: every button, field, menu row, tab, key and right-click. One table per screen: the control, what it should do, where that comes from (a ruling of his, or Figma's own control read in Chrome when there is none), and one state: works, dead, disabled with a reason shown, disabled with no reason, wrong.
- The tables go in `docs/operations/` as an audit page he can read, and T3 to T6 below are rewritten from them: one phase per cause, with its own acceptance line.
- Acceptance: the number of rows per screen equals the number of interactive elements counted in the DOM with every menu and window opened once; every row has one of the five states; 0 rows blank.

## T3 — Home

His words for all of T stand above: "fix gaps and bugs, home view and incomplete features and disabled buttons". From the audit (`docs/operations/07-apps-tier/11-kolbox-audit.md`, Home 87 rows, Library 57, the search modal 117): Library and the search modal's own controls work; Home's rail and top bar carry ten controls drawn from the design with "Not wired" behind them, and the search modal lists two rows it could run.

**Group (a): Home, Library and search.** Its files: `apps/editor/src/kolbox/` (all of it), `packages/design-editor/src/editor/kolbox/search/`, `packages/design-editor/src/editor/kolbox/files/`. It imports from other groups' files but edits none.

### 3.1 — Home draws the places a file browser has, not the ones the local library has — group (a) — ✅ built 2026-11-20 (0 of 6 disabled controls' tooltips read Not wired, all six "Needs an account server"; a deleted file left Recents 14 to 13 and Trash listed it, Restore took Trash to 0 and Drafts listed it; a starred file appeared in Starred, unstarred it left; All folders listed 2 of 2 folders; a folder's title menu reads Rename, Delete and its top-bar star lit; shots `_tmp/2026-11-20-group-a/`)
- Cause: `pages/Home.jsx` `PLACES` and the top bar were copied from the design frame; five places, the Starred group, Share, Adjust, Star, the title's menu and the notifications bell are `disabled` with "Not wired", although Trash, Starred, Star and All folders need nothing but the local library.
- Do: Trash (Delete moves a file there; Trash lists it with Restore and Delete for good, as Figma's), Star on the cards and the top bar with the Starred group listing what is starred, All folders listing the folders; the title's menu holds the place's own rows (a folder: Rename, Delete; a place: none, so not drawn). What needs a server (Community, Resources, Admin, Share, Adjust, notifications) stays drawn and dimmed, its tooltip saying why ("Needs an account server"), never "Not wired". The account menu's "Not signed in" becomes the menu's title line, not a greyed row. Decided for his review: the server rows stay visible.
- Acceptance: on Home, 0 tooltips reading "Not wired"; delete a file, Trash lists it, Restore returns it to Drafts; Star a file, Starred lists it, unstar removes it; All folders lists every folder; 0 presses on Home with no effect (the audit's crawl re-run on Home reads 0 dead).

### 3.2 — The search modal lists rows it can run as "Not wired" — group (a) — ✅ built 2026-11-20 (Tools › Insert image opened the file picker, Eyedropper fired the pick once; 0 "Not wired" in `search/`)
- Cause: `search/ModalSearchHost.jsx` marks Insert image and Eyedropper `NOT_WIRED`, though the editor has both (`insertImage`, `eyedrop`).
- Do: both rows run them (import, do not edit, the editor's functions).
- Acceptance: from the search modal, Insert image opens the file picker and Eyedropper arms the pick; 0 "Not wired" in `search/`.

## T4 — Incomplete features and disabled buttons

His words: "incomplete features and disabled buttons". One rule for all of them, unchanged: a control works, or it is dimmed with its reason in a tooltip, or it is not on the screen. Never live and dead. The counts in the source on 2026-11-19 (they replace the first count): 22 `noop` presses in the inspector, 19 "Not wired" marks in 9 files, 13 controls disabled outright. The audit adds what the code count missed: the frame's inspector, 27 dead controls.

**Group (b): the Editor's inspector, the windows' fields, menus and the behaviour set.** Its files: `packages/design-editor/src/editor/kolbox/editor/Properties.jsx`, `editor/properties/` (all), `editor/MenuBar.jsx`, `editor/layers/`, `editor/windows/WindowColor.jsx`, `editor/windows/eyedrop.jsx`, `pages/Editor.jsx`, `ui/TopRail.jsx`, `ui/MenuZoom.jsx`, `ui/MenuMain.jsx`, `ui/MenuFile.jsx`, `ui/MenuEffects.jsx`, `ui/MenuBoolean.jsx`, `ui/MenuBlendMode.jsx`, `labs/Params.jsx`; in kol-component the kolbox looks of `Input`, `Button`, `Menu`, `MenuItem`, `Dropdown`, `PopoverPanel`, `Tooltip`; `docs/documentation/04-compositions/26-kolbox-system.md`.

**Group (c): effects, tools, the generator, the stroke and media windows, Labs, Morph, Randomiser.** Its files: `editor/tools/`, `editor/generate/`, `editor/lineSwell/`, `editor/tune/`, `editor/windows/` except `WindowColor.jsx` and `eyedrop.jsx`, `ui/PopoverStroke.jsx`, `ui/PopoverEffect.jsx`, `ui/PopoverEffects.jsx`, `labs/` except `Params.jsx`, `morph/`, `randomiser/`, `pages/Labs.jsx`, `pages/Morph.jsx`, `pages/Randomiser.jsx`, and in the engine `compose/CanvasArea.jsx`, `compose/state.jsx`, `compose/TypeBlock.jsx`.

- 2026-11-20, leftovers closed: the frame's 14 dimmed controls read against Figma's frame inspector (Chrome, look only): Create component, styles, a second fill, mask, boolean and edit object (Figma draws none of the last three on a frame) and the aligns with no other frame have no engine form, so 14 before and 14 after; the frame's corner radius and stroke are in the export (`compose/build.js` `frameBoxSvg`: radius 12 and a 2 px stroke read rx 12, stroke-width 2, inset as the rect shape exports); the Export window's Export and the Repeat window's Apply say why they are greyed.
### 4.1 — The frame's inspector hands its sections no writes — group (b) — ✅ built 2026-11-20 (frame selected: 27 rail controls, 13 work, 14 dimmed each with a tooltip, 0 dead; opacity 50, radius 12, flip and hide each change the frame on the canvas, 1 undo step each; the title opens Section, Frame, Group and the size presets, as Figma's)
- Cause: `properties/Canvas.jsx` renders `HeaderActions`, `PositionSection`, `LayoutSection` and `AppearanceSection` for a frame without their `on*` props, so each falls to `Sections.jsx`'s `noop` default; Stroke's plus and Effects' plus are `noop` (Effects lights and opens nothing).
- Do: the frame's writes through `updateLayer` and `moveFrame` as the shape's are in `Properties.jsx`: hide, opacity, blend, corner radius and corners, both flips, constrain proportions, the aligns (to the page), Add stroke, Add effect (the same Effects menu, the rows a frame can host; the rest greyed); rotation and Rotate 90 are not drawn on a frame (R2: a frame does not rotate); Create component, Use as mask, Boolean and Edit object dimmed with their reason where the engine has no frame form.
- Acceptance: a frame selected, the crawl over the right rail reads 0 dead of its controls; hide, opacity 50, a 12 radius and a flip each change the frame on the canvas and are one undo step.

### 4.2 — The inspector's empty actions — group (b) — ✅ built 2026-11-20 (0 `noop` in `editor/Properties.jsx` and `editor/properties/`; Styles, Create component, Stroke position, Individual sides, a second stroke dimmed with their reason; page opacity 50 writes the page color's alpha 80 hex, its eye hides and brings it back)
- Cause: sections drawn from the design with `noop` where the engine has no feature (the 22 in the source).
- Do: Styles everywhere (Fill, Stroke, Typography, the page's Add style, the Color window's Add style): dimmed, tooltip "No styles yet" (text styles are a TALK in T1.4). Create component: dimmed with its reason. Stroke position (Inside, Center, Outside) and Individual sides: connected if the engine draws them, else dimmed with the reason. Add stroke on a stroked layer: dimmed, "One stroke per layer". The page row: the eye hides the page color and brings it back, the opacity field writes it (today it takes a value and nothing changes). The conditional writes (mask, nodes, lock, radius) become disabled with their reason instead of a `noop`.
- Acceptance: `grep -c noop` over `editor/Properties.jsx` and `editor/properties/` reads 0 presses; each control the audit read dead in the four selected states is now works or dimmed with a tooltip; the page's opacity 50 halves the page color.

### 4.3 — The top rail's Share and the zoom off the editor — group (b) — ✅ built 2026-11-20 (Share dimmed, "Needs an account server", on Editor, Labs and Morph; zoom field 1 on the editor, 0 on Labs and Morph)
- Cause: `ui/TopRail.jsx` gives Share no action, and draws the zoom on Labs and Morph, where it reads 100 percent and drives nothing.
- Do: Share dimmed, tooltip "Needs an account server" (the same reason as Home's). The zoom is drawn on the editor only; Labs' stage keeps its own zoom keys. Decided for his review.
- Acceptance: on Editor, Labs and Morph, Share has a tooltip and 0 effect presses; Labs and Morph draw no zoom field.

### 4.4 — The colour window with no target, and an eyedropper with no sign — group (b) — ✅ built 2026-11-20 (nothing selected, Edit, Color greyed; the canvas cursor is the eyedropper's while armed and cleared on Escape: it already was, the audit read it before the pick armed)
- Cause: Edit, Color opens `WindowColor` with nothing selected, so the picker moves nothing; `eyedrop.jsx` arms the pick with no cursor.
- Do: Edit, Color greyed with nothing selected (as Figma, which has no colour window without a selection); while the pick is armed the canvas shows the eyedropper cursor, Escape disarms it.
- Acceptance: nothing selected, Edit, Color is greyed; after Eyedropper, the canvas cursor is the eyedropper's until a press or Escape.

### 4.5 — The windows' own "Not wired" and disabled-without-reason controls — group (c) — ✅ built 2026-11-20 (0 "Not wired" in group (c)'s files; every dimmed control in the stroke, media, generator, Files and Morph windows reads its reason; an effect window with no type switch or more draws neither; Kinetic's points drag in a box; Flatten on a Pattern effect makes a Group and its shapes in Layers, 4 rows to 5)
- Cause: the stroke window, the media picker, the generator window and the effect windows were drawn whole and the parts the engine lacks left disabled or "Not wired".
- Do, by the one rule: the stroke window's Dynamic and Brush tabs, width profile, flip and miter angle (`ui/PopoverStroke.jsx`, `windows/WindowStroke.jsx`); the media picker's Display settings and Filter, and its Use button that is greyed with no word until a file is picked (`windows/WindowMediaPicker.jsx`); the generator window's five marks (`generate/GeneratorWindow.jsx`); the effect window's type switch and more when absent (`ui/PopoverEffect.jsx`, `ui/PopoverEffects.jsx`); Kinetic's point editor (`labs/Kinetic.jsx`); the Files window's Save current and Open (greyed, no word); Morph's Add a key at the head and Fit the loop (greyed, no word); the Pattern window's Flatten (takes a press, changes nothing).
- Acceptance: 0 "Not wired" in group (c)'s files (19 in the source before, of which group (c) holds 9); every disabled control in those windows has a tooltip; Flatten turns the pattern into shapes in Layers.

## T5 — Behaviour is not the same from one place to the next

His words: "beahaviour consistency". The set is in the audit page, each line with its source and the places that break it; group (b) carries it into `docs/documentation/04-compositions/26-kolbox-system.md` and fixes it at the shared parts, so each fix reaches every screen at once.

- 2026-11-20, leftovers closed: the page menu's Move up and Move down move the page (`movePage` in `compose/state.jsx`, one undo step): pages 1, 2, 3, Move down on page 1 read 2, 1, 3, undo 1, 2, 3, kept after a reload; the last six icon buttons name themselves (Home's Account and Main menu, Library's and the Randomiser's Main menu, Morph's Preset field and Sync loop): 0 of 212 without a tooltip.
### 5.1 — The fields: kolbox's `Input` has no arrow steps and no Escape — group (b) — ✅ built 2026-11-20 (`useKolboxField` in Input, ColorInputRow's hex and opacity, Slider kolbox's number: X, W, the hex, opacity, radius, text size and Labs' Line count each select on one click, step 1 and 10, the hex does not step, Escape restores; 0 of 7 break)
- Cause: kolbox's `Input` (kol-component) selects on the first press (S5.1) but steps nothing on the arrows and keeps a typed value on Escape; Labs' `CommitInput` (`labs/Params.jsx`) places a caret on the first press and steps 0.25 with or without Shift.
- Do: in the atom, ArrowUp and ArrowDown step 1, with Shift 10, and commit; Escape restores the value from before the edit and leaves the field; `CommitInput` rides the same atom.
- Acceptance: on the rail's X, W, the fill's hex (no step) and opacity, the radius, a text size and a Labs number field: one click selects all, ArrowUp adds 1, Shift and ArrowUp adds 10, Escape after typing restores the old value; 0 of the seven break any of the four.

### 5.2 — Menus: the current row is lit, typing goes nowhere — group (b) — ✅ built 2026-11-20 (Blend, Weight, Home's Sort, the Labs preset and the zoom menu open with 0 lit rows, 1 checked each but the zoom (it has no current row); the main menu's E lights Edit)
- Cause: kolbox's `Dropdown` hands its menu the current row as `highlighted`, and `Menu` has no type-ahead.
- Do: a dropdown's menu opens with no row lit, the current row carries the check (S2.2, as the tool menu since S2.2); a letter moves the keys' row to the first row starting with it.
- Acceptance: Blend, Sort, the Labs preset menu and the zoom menu open with 0 lit rows and 1 checked; in the main menu, E moves to Edit.

### 5.3 — Windows beside the rail close on a canvas press — group (b) — ✅ built 2026-11-20 (Color, Type settings, Stroke settings and the Line Swell picker each stay open after a press on the empty canvas and close on Escape; the press on the empty canvas is spent, a press on a layer selects it: decided for review)
- Cause: `PopoverPanel variant="kolbox"` closes on an outside press; S7.1 put `blocking={false}` on the one WindowFrame only.
- Do: a kolbox `PopoverPanel` holds through a canvas press; it closes by its close, Escape or its caller's toggle. Dialogs (Settings, Media, the search modal, confirms) keep closing on an outside press, as Figma's. Decided for his review.
- Acceptance: Color, Type settings, Stroke settings and the Line Swell picker each stay open after a press on the empty canvas; each closes on Escape.

### 5.4 — Icon buttons with no tooltip — group (b) — ✅ built 2026-11-20 (an icon-only kolbox Button names itself through `Tooltip variant="kolbox" asChild`; 6 of 212 left, all in group (a) and (c) files: Home's Account and Main menu, Library's and the Randomiser's Main menu, Morph's ? and Sync loop)
- Cause: kolbox's icon-only `Button` and the inspector's `Act` carry an `aria-label` and no `Tooltip`.
- Do: an icon-only kolbox `Button` shows its label as its tooltip, and its key where the keymap has one (Figma: "Rectangle R", "Hide"); a control that already has one keeps it.
- Acceptance: hovering every icon-only button on Home, Library, Editor (a rectangle and a text layer selected), Labs, Morph and Randomiser shows a tooltip: 0 without (115 without before). Any left in group (c)'s own files after the atom are fixed there.

### 5.5 — Right-click menus — group (b) — ✅ built 2026-11-20 (rectangle: canvas 18 rows, Layers row 19, the one apart Rename; the page menu has 6 rows, Move up and Move down greyed: the engine has no page order write, `compose/state.jsx` is group (c)'s)
- Cause: `editor/layers/LayerMenu.jsx` builds the canvas's and the Layers row's menus from different lists; the page menu in `pages/Editor.jsx` has three rows.
- Do: one list for the canvas and the Layers row, the Layers row adding Rename (Figma read 2026-11-19); the page menu as Figma's: Copy link to page, Rename, Duplicate, Move up and Move down (Move to bottom), Delete.
- Acceptance: on one rectangle, the canvas's and the Layers row's menus list the same rows but Rename; the page menu has 6 rows and Move down moves the page.

## T6 — Effects and tools

His words: "effects and tools". The audit's two tables: the effects pass every step but these cells (the rest of the 91 effects pass all seven), the tools fail where listed.

- 2026-11-20, leftovers closed: a shared effect row with several layers selected opens its settings (Line Swell, Morph, a Layer effect, a shader stage, a vector effect) and an edit writes every layer that has the row, one undo step: two rectangles with Vortex, Line weight stepped, both 0.19 to 0.21; Generate, Repeat, Tune, pattern, kinetic type and a loop keep their one-layer window and their row's reason.
### 6.1 — The generator families open a centred window, not beside the rail — group (c) — ✅ built 2026-11-20 (Screens, Arrays, Repeat and Motion open with their right edge 8 px from the rail, top on the Effects row or as high as fits; `ModalDialog` kolbox `place`)
- Cause: the generator window rides `WindowFrame`, centred and 880 wide, while the effect windows dock at the rail (S11.1, S11.3).
- Do: the generator families (Screens, Arrays, Repeat) open their settings docked at the rail's left edge, its top on the Effects row, as every other effect; Export and Color Modes stay centred (they do not edit the selection).
- Acceptance: for Screens, Arrays and Repeat the window's right edge is within 8 px of the rail's left edge.

### 6.2 — Motion's settings use the code's names — group (c) — ✅ built 2026-11-20 (41 labels over every step, 0 camelCase, through Line Swell's plain-words map)
- Cause: the Motion effect's window labels its fields with their keys.
- Do: plain words for every field (S11.3), from his canvas where it names them.
- Acceptance: the Motion window reads 0 camelCase labels.

### 6.3 — The tools that do not hand back to Select, and the undo of what they make — group (c) — ✅ built 2026-11-20 (tools table re-run: 20 of 20 failing cells pass; Figma read: Escape gives back Move and keeps the selection, Hand H, Line L, Image ⇧⌘K, hide ⇧⌘H, lock ⇧⌘L, which moved off H and L)
- Cause: in `compose/CanvasArea.jsx` Escape clears the selection but leaves Hand, Zoom and Orbit armed; the Text tool's typing is its own undo step after the layer's; Kinetic type is added by `compose/state.jsx` as a page-size host outside one undo step; Alt reverses nothing for Zoom; Orbit has no meaning on a 2D page; the fold members without a key show their fold's key.
- Do: Escape returns to Select from every tool; a new text layer and what is typed into it before leaving it is one step (an empty one is removed, S4.1); Kinetic type lands at the pointer at a set size, selected, one undo step; Alt and a click with Zoom zooms out; Orbit is greyed off the 3D layers with its reason; a fold member shows its own key or none; Line takes L (Figma), Insert image Shift Cmd K (Figma).
- Acceptance: the audit's tools table re-run: every cell passes.

### 6.4 — Crop never opens on an inserted image — group (c) — ✅ built 2026-11-20 (Insert image, Crop: handles and the pan surface show, Escape leaves, a crop to 474 by 652 undoes in one step to 576 by 720)
- Cause: Crop waits for a `photo` layer, and Insert image now lands a rectangle with an image fill.
- Do: Crop enables on a layer with an image fill and crops that fill, as Figma's crop on an image fill.
- Acceptance: Insert image, then Crop: the crop handles show; Escape leaves them; one undo takes the crop back.

### 6.5 — The Randomiser's Camera fails in silence — group (c) — ✅ built 2026-11-20 (refused: "Camera: Permission denied" under the three rows, which stay)
- Cause: `randomiser/Screens.jsx` catches a refused or missing camera and drops it.
- Do: a refused camera says so on the step (the browser's reason).
- Acceptance: with the camera refused, the step shows the reason and stays on From library, Upload, Camera.

---

# U — What T dimmed or left out instead of building (2026-11-20; nothing here is built)

**Raised:** 2026-11-20, his words: "ok but thats a gap, what other gaps did you skip? I said to idenity gaps so we can fix them", then on the list of ten: "2. we are not making components, at least its not in any of my plans, we can park that for later. 6. we wont have community resources share or notifications. admin and adjust just sounds like settings. but lets fold into /p to account for this list".
**Status:** DRAFT, waits for his go. Open: all of it.
**Where it runs:** `pnpm editor` with the Kolbox style.
**Law carried from T, his words:** "and compare against figma when you dont know". A dimmed control with a reason is not a closed gap: in U a control works or it is off the screen.
**How a phase closes:** its acceptance line, read once in the running app, and looked at.

## U1 — The engine has no saved styles [1]

Cause: a layer holds its own color and type values and nothing else; there is no named style a layer can point at, so T dimmed every Styles button ("No styles yet").

### 1.1 — Color styles
- A style is a named color kept with the file. Fill, Stroke, the page and the Color window's Add style save one; the Styles button lists them and applies one; a layer that uses a style follows it when the style changes. Look and rows as Figma's (read in Chrome).
- Acceptance: a style saved from one rectangle's fill and applied to a second: changing the style's color changes 2 layers in 1 undo step, on the canvas and in export; it is still there after save and reopen.

### 1.2 — Text styles
- The same for type: font, weight, size, line height, letter spacing and the Type settings values, saved and applied from Typography's Styles button.
- Acceptance: a text style applied to 2 text layers, its size changed from 12 to 24: both layers read 24; Styles buttons left dimmed in the app: 0.

## U2 — Components — PARKED: his words, "we are not making components, at least its not in any of my plans, we can park that for later"

- Create component comes off the screen wherever it is drawn dimmed (the shape's, the frame's and the many-selected headers), so nothing on screen promises it.
- Acceptance: `Create component` controls drawn in the app: 0.

## U3 — A layer holds one fill and one centered stroke [3, and the frame's second fill in 4]

Cause: the engine's layer has a single `fill` and a single `stroke` drawn centered on all sides, so T dimmed Stroke position, Individual sides and Add on a layer that already has one.

### 3.1 — Stroke position and sides
- Inside, Center and Outside, and a width per side on rectangles and frames, drawn on the canvas and in export.
- Acceptance: a 100 by 100 rectangle with an 8 px stroke: its drawn bounds read 100 (Inside), 108 (Center), 116 (Outside) on the canvas and in the exported SVG; top side alone at 8 gives 3 sides with no stroke.

### 3.2 — Several fills and strokes
- Fill and Stroke take more than one row, stacked in list order, each with its own eye, opacity and minus, on shapes and frames. As Figma's.
- Acceptance: a rectangle with 2 fills (the top one at 50 percent) and 2 strokes: 2 rows in each section, the export holds 2 fills and 2 strokes in the same order; "One stroke per layer" tooltips left: 0.

## U4 — A frame is a box, not a container [4]

Cause: the engine draws a frame and its layers side by side; the frame does not own them, so it cannot clip them, take them by a drop, carry them when duplicated, turn them with it or mask them.
Corrected 2026-11-20: "a frame does not rotate" was R2's build call, marked for review, never his ruling. His words with a capture of Figma's Position section on a frame (Rotation field, Rotate 90, both flips): "when did I rule no rotation on frame? figma has rotation on frame". A frame rotates.
Boolean and Edit object are not in Figma's right rail for a frame, so they come off ours for a frame, not dimmed.

- A frame rotates: the Rotation field and Rotate 90 in the right rail's Position section, and by pointer near a corner, as a shape does; its layers turn with it, on the canvas and in export.

- A frame clips its layers on the canvas as it does in export, with Clip content as its toggle.
- A drop in Layers moves a layer into a frame, out of one, and from one frame to another; a layer dragged off its frame on the canvas leaves it (carries R5 and C1's "not built" lines).
- Duplicating a frame copies its layers with it.
- Use as mask works on a frame, or comes off it if Figma's frame has none (read in Chrome).
- Acceptance: a layer half outside its frame shows half on the canvas; dropped onto another frame in Layers it lists under that frame and moves with it; a frame with 3 layers duplicated gives 2 frames and 6 layers; a frame set to 45 reads 45 in the Rotation field, its layers' drawn corners turned 45 about the frame's centre on the canvas and in the exported SVG, and Rotate 90 takes it to 135; the right rail with a frame selected reads 0 dimmed controls.

## U5 — The window effects open on one layer [5]

Cause: Generate, Repeat, Tune, pattern, kinetic type and loop each open a window bound to a single layer id, so with several selected their rows read "Select one layer".

- Each window opens on the selection and applies to every layer in it, one undo step; a value the layers do not share reads "Mixed". Tune is the exception if its drawing surface cannot hold two forms: then it is off the many-selected menu, not dimmed.
- Acceptance: 2 rectangles selected, each of the six opened and applied: both layers carry the effect, 1 undo removes it from both; "Select one layer" rows left: 0.

## U6 — Home and the top rail draw rows for an account server that will not exist [6]

Cause: T kept every server row drawn and dimmed "Needs an account server". His ruling: "we wont have community resources share or notifications. admin and adjust just sounds like settings".

### 6.1 — The server rows
- Community, Resources, Share (Home, and the top rail on Editor, Labs and Morph) and the notifications bell come off the screen. Their code moves to `_tmp/`, nothing is deleted.
- Admin and Adjust open Settings. My reading, decided for his review: Admin is the account's page of Settings and Adjust is its Display page; if Settings already holds both, the two rows fold into the one Settings row.
- Acceptance: "Needs an account server" tooltips in the app: 0; Community, Resources, Share and the bell drawn: 0; each of Admin and Adjust, if still drawn, opens Settings.

### 6.2 — Home handles one file at a time, by menu only (added 2026-11-20, his "what about home? was that fully built?")
- Cause: a file's verbs (Rename, Duplicate, Move to, Delete) were built on its menu for a single file; cards and rows take no drag and no selection.
- Several files select at once (press, ⇧ press for a range, ⌘ press to add, a drag over the empty ground), in the grid and the list; the menu's Move to, Duplicate, Delete, Star and, in Trash, Restore act on all of them. A file or the selection drags onto a folder in the rail or in All folders, and onto Trash, with the folder lit while it is over it. As Figma's file browser (read in Chrome).
- Acceptance: 3 files selected and dragged onto a folder: the folder lists 3 more and Drafts 3 fewer; 3 selected then Delete: Trash lists 3; ⇧ press from the first to the fourth card selects 4.

### 6.3 — Sign in is kol-fxr's to connect
- Ruled 2026-11-20, his words: "sign in will resolve in fxr so we just need to account for it, but it will be connected there." Sign in…, Sign out and the account menu stay on screen. No account server is built in this repo, and kol-fxr is not told without his word.
- Cause: the Sign in window was built against a local stand-in, so a host app has no one place to hand its own sign-in to.
- The account is a prop of the editor: the host passes its session (name, mail, picture) and its sign-in and sign-out functions; the window and the account menu call those and nothing else. With none passed, the menu reads "Not signed in" and Sign in… says what is missing instead of failing in silence. The prop is written up in the editor's docs page so kol-fxr can read it there.
- Acceptance: with a test session and two test functions passed, the menu reads the session's name, Sign in… calls the sign-in function 1 time and Sign out the sign-out function 1 time; with none passed the menu reads "Not signed in" and 0 requests leave the page.

## U7 — Underline was built in px and without its style row [7]

Cause: thickness and offset were stored as px because the canvas draws px; Figma's are a percent of the font size, and its style row (solid, dotted, wavy: read in Chrome which it has) was left out.

- Thickness and offset in percent of the size, Auto as the default; the style row as Figma's, drawn on the canvas and in export.
- Acceptance: thickness 10 percent on a 40 px layer draws a 4 px line, and 8 px after the size goes to 80; each style in the row reads back in the export.

## U8 — The Layers list moves rows by mouse drag only, and the Pages list by its menu only [8]

Cause: reordering was written on pointer events for a mouse; there is no key path and a touch drag scrolls the list. The Pages list has no drag at all: a page moves only by its menu's Move up and Move down (added 2026-11-20 after his "ok what about pages, do they work?").

- Keys move the selected row up, down, into and out of a frame (Figma's keys, read in Chrome); a touch drag on a row reorders it.
- A page row drags to a new place in the Pages list, by mouse and by touch, with the same drop line the Layers list draws; Move up and Move down stay in the menu. As Figma's.
- Acceptance: a row moved 2 places with keys alone reads 2 places lower in the list and on the canvas; the same by a touch drag in a touch emulation; the third of 3 pages dragged above the first reads first in the list, 1 undo puts it back, and the order holds after save and reopen (U9).

## U9 — The audit ran in one browser, one theme, one pointer [9]

Cause: T2's crawl drove Chrome, dark, mouse, desktop width. His own browser is Firefox-based, and light, touch and the phone width were never opened; page order was never read after a save.

- The same crawl (`_tmp/2026-11-19-audit/crawl.mjs`) in Firefox, in light, with touch, and at the phone width; what it finds is fixed here and the table in `docs/operations/07-apps-tier/11-kolbox-audit.md` gains the four columns.
- Pages moved, saved with ⌘S and reopened keep their order.
- Acceptance: dead 0 and wrong 0 in each of the four runs; 3 pages reordered read the same order after reopen.

## U11 — Export was closed on the frame and two formats (added 2026-11-20, his "what about export is that accounted for?")

Cause: C8 built export around the active frame and the two formats the engine already wrote, and marked the rest "decided for review" instead of building it.

### 11.1 — Video beyond the current frame
- Video is offered for the selection and for every frame, as PNG and SVG are; several videos go in the one .zip.
- Acceptance: a file with 2 moving frames, Content set to every frame, Format Video: the .zip holds 2 video files, each with its frame's size and more than 1 distinct picture.

### 11.2 — The right rail's export rows
- A row's format lists PNG, JPG, SVG and PDF, as Figma's Export section (read in Chrome for its scale and suffix fields); the Export window lists the same.
- Acceptance: one rectangle with 4 rows, one per format: "Export" writes 4 files, each opening as its type at the row's scale.

### 11.3 — The page's own Export section
- First read it: with nothing selected, the section's plus adds a row and its Export writes the page. If it is dimmed or does nothing today, it is built here (C8's "Left" line).
- Acceptance: nothing selected, a PNG row added: Export writes 1 file holding every frame on the page; dimmed or dead controls in the section: 0.

### 11.4 — A saved file drops its video clips
- Save as with Media kept, and the portable `.kol.json`, carry video clips as they carry still photos.
- Acceptance: a file with 1 video clip saved as a portable file and reopened in a fresh profile plays the clip; missing media: 0.

## U12 — There is no find on the canvas (added 2026-11-20, his "what about search and find are those accounted for?")

Cause: search was built per place (the search modal, Home, the left rail's layer names, the Files and Line Swell windows) and each of those works; nothing searches what is ON the canvas, and nothing replaces text. Figma has both under ⌘F.

### 12.1 — Find
- ⌘F opens find in the left rail, on the layer search that is already there (not a second search): it matches layer names and the words inside text layers, on this page or every page, lists the hits with their page and frame, and steps through them with Enter and ⇧Enter, selecting each and bringing it into view. Rows, filters and keys as Figma's (read in Chrome).
- Acceptance: 3 text layers holding "kol" on 2 pages: ⌘F then "kol" lists 3 hits; Enter 3 times selects each in turn, the page changing for the third, each hit inside the viewport; Escape closes it and gives the canvas its keys back; the browser's own find bar opens 0 times.

### 12.2 — Replace
- Find's second field replaces the words in text layers: Replace for the current hit, Replace all for every hit, each 1 undo step; layer names are not touched.
- Acceptance: the same 3 layers, "kol" replaced with "KOL" by Replace all: 3 layers read "KOL" on the canvas and in export, 1 undo puts all 3 back.

## U10 — Figma [10]

- The field's selected-text state (Input kolbox) and the generator's steps list as a master, then everything U changes mirrored: the Styles menu and rows, several fills and strokes, the stroke's position and sides, the frame's inspector, Home and the top rail without the server rows, the underline rows, the export rows' formats, find and replace in the left rail.
- Acceptance: each part U changes in code has its master in `n48kE2bJtrFjl7wxst30xH` with the same states; his publish and accept after.

---

# V — The editor's shell: the `RailSwitcher`, no top rail, and rails that undock and hide (2026-11-20; nothing here is built)

**Raised:** 2026-11-20, his words, with nine captures of Figma kept in `_tmp/2026-11-20-shell-references/` (33 to 41):
- "what im thinking is we add a sidebar to left of the left rail [which figma has [33] there we can switch between states, one of which can be the home of media. maybe settings icon in the bottom? And my plan was to add more tools there like doc editor and tools that are fundimentally different like the tuner and such."
- "right doesnt that replace the top rail then?" and, to yes: "agreed, what about dock undock rails? was that done"
- "ok weird I had sent reference images of it and mentioned it but it must have slipped. here is figma docked: [34], here is figma view options: [35] and here is figma undocked: [36] [37] and § hides UI [38] what I want that figma doesnt do is to undock ui then show only what you want, like the layers panel would show here [39] but everything else would be hidden, and those settings would be toggle options for that view specifically."
- "and [40] gives [41] which in other tools Ive set as \ shortcut, we could do that"
- On media: "what about the connection to media? was that done?"
**Status:** DRAFT, waits for his go. Open: all of it.
**Where it runs:** `pnpm editor` with the Kolbox style.
**Law carried, his words:** "and compare against figma when you dont know". Sizes, gaps and menus are measured in Figma in Chrome, not taken from the captures by eye. **Names, ruled 2026-11-20:** the narrow rail is `RailSwitcher` ("the switcher" in speech). His words: "Id call it RailSwitch or RailSwitcher?", then "agreed" to `RailSwitcher` (`RailSwitch` reads as a rail holding an on/off switch). It is its own small part, not `NavRail variant="kolbox"`: "that one has many state, this one doesnt". The rail with Pages and Layers stays the left rail.
**How a phase closes:** its acceptance line, read once in the running app, and looked at.

## V1 — Spaces are switched in a top rail that costs the canvas a row [33, 34]

Cause: the editor's spaces (Editor, Labs, Morph, Randomiser) are tabs in a top rail, beside the file name, Preview, Export and zoom. Figma has no top rail: a narrow rail of icons at the far left switches spaces, and the rest sits on the two rails.

### 1.1 — `RailSwitcher`
- A narrow rail left of the left rail, full height: the mark on top (it opens the main menu, as Figma's does in [35]), then one icon per space, then Settings at the foot. A new part, `RailSwitcher`, in the kit beside the other rail parts, with `variant="kolbox"`.
- Its look follows Figma's own narrow rail [33], confirmed by him 2026-11-20 ("to confirm railswitcher should follow figma reference ?"): width, icon size, spacing, the dividers, the lit state of the current space and the foot icon are measured in Figma in Chrome and matched, in the kolbox look (kolbox's ground, accent and icons, not Figma's blue). It has not been designed here before; the collapsed left rail's pill (C4.3) is a different part.
- The spaces today: the editor, Media (the Library), Labs, Morph, Randomiser. The rail takes its list from the app that hosts it, so a space is added by adding a row. Decided for his review: Home is the first icon; Settings is the foot icon ("maybe settings icon in the bottom?").
- Each icon has its tooltip and its lit state; an icon is 1 press to its space.
- Acceptance: `RailSwitcher`'s width and icon size equal Figma's measured ones within 1 px; 5 space icons plus the mark and Settings; each icon changes the address to its space and lights; 0 icons without a tooltip.

### 1.2 — The top rail goes
- The file name and its menu move to the top of the left rail, with the Minimize UI toggle beside it [36]. Preview, Export and zoom move to the top of the right rail. The mode tabs are `RailSwitcher`'s. The top rail's file moves to `_tmp/`.
- Acceptance: the top rail's drawn height reads 0 on Editor, Labs, Morph and Randomiser; the canvas's height equals the window's; file name, Preview, Export and zoom each still work from their new place.

### 1.3 — `\` hides `RailSwitcher` [40, 41]
- View › Minimize left navigation bar, on `\` (his key from other tools): `RailSwitcher` goes, the left rail moves to the edge, everything else stays. The same key brings it back. Home's ⇧\ is untouched.
- Acceptance: `\` takes the left rail's left edge to 0 and the canvas grows by `RailSwitcher`'s width; `\` again restores both; typing `\` in a field types it.

### 1.4 — Tools that are their own space — PARKED: later, his plan
- The doc editor and the tuner as spaces in `RailSwitcher` ("tools that are fundimentally different"). Not built now; 1.1's list is what makes them a row each when they come.

## V2 — Only the left rail collapses: no undocked state for the whole shell, no hidden state [34 to 38]

Cause: C4.3 (built 2026-11-19 from his reference) collapses the left rail alone to `RailPill`: the mark, the file name and the panel icon over the canvas. It is one rail's toggle, not a state of the shell: the right rail has no pill, nothing hides everything, and no View row or key drives it.
Corrected 2026-11-20: I first told him the rails could not collapse at all and that it was in no plan. Both wrong; his "I had sent reference images of it and mentioned it" is C4.3 and the earlier plan's 28.9. V2 builds on `RailPill`, it does not redraw it.

### 2.1 — Docked, undocked, hidden
- Docked [34]: `RailSwitcher`, the left rail, the right rail at the edges, the dock at the bottom. Today's layout.
- Undocked, Minimize UI [36, 37, 39]: the rails collapse to two floating pills over the canvas: left, the existing `RailPill` (the mark, the file name and the toggle), its look already designed; right, a second pill in the same look holding the account, zoom and Preview. The dock stays. The canvas runs under them, edge to edge.
- Hidden, Show/Hide UI [38]: pills, rails and dock all go; the canvas alone.
- The View menu holds the rows as Figma's [35]: Minimize left navigation bar, Minimize UI, Show/Hide UI. Keys as Figma's where the keymap has them free (§ and ⇧⌘§ on his keyboard); read `state/keymap.js` first and report a clash rather than move a key.
- The state is remembered per file profile, as the rulers are.
- Acceptance: Minimize UI leaves 2 pills and the dock, with the canvas's width equal to the window's; Show/Hide UI leaves 0 pieces of UI; each key returns to the state before it; after a reload the state is the one left.

### 2.2 — Undocked shows only what he chooses (his, not Figma's)
- In the undocked state each part of the rails can be shown as a floating piece under its pill: Pages, Layers under the left one; each of the right rail's sections under the right one. His example: Layers alone under the left pill, everything else hidden.
- The toggles are rows in View › Panels, checked when on (Figma's Panels submenu is the model for the rows and keys, [35]). They belong to the undocked state only: docking shows everything, and undocking again brings back the same choice.
- Acceptance: undocked with Layers alone on: 1 floating piece under the left pill, 0 under the right; a layer picked in it selects on the canvas; dock, then undock: Layers alone again; the choice survives a reload.

## V3 — Media reads a sample library, and has no space of its own

Cause: the Media window and the Library read the fixture library that ships with the app; the real media service is not reachable from this repo (C5 parked it). As with sign-in (U6.3), the connection is the host's to make, in kol-fxr.

- Media is a space in `RailSwitcher` (V1.1), the Library as it is today.
- The media source is a prop of the editor: the host passes its client (buckets, list, address of a file); the window and the Library call that and nothing else. With none passed they read the sample library and say so in one line. The prop is written up in the editor's docs page. kol-fxr is not told without his word.
- Acceptance: with a test client of 2 buckets and 3 files passed, the Media space lists 2 buckets and 3 files and an image picked from it fills a rectangle; with none passed the sample library shows with its line; 0 requests leave the page for media in either case beyond the client's own.

## V4 — Figma

- `RailSwitcher`, the two pills, the undocked floating pieces and the View menu's rows as masters in `n48kE2bJtrFjl7wxst30xH`; the screens without a top rail, in the three states.
- Acceptance: each part V adds in code has its master with the same states; his publish and accept after.

---

## To talk about when R is done

**Read and talked through 2026-11-20.** Both links, what they say, what was settled and the phases for a session of its own (after `apps/*` is reduced) are in `docs/operations/11-development-rules/`. The two lines below are the record of when he sent them.

- **A no-comments rule for code** (his link, 2026-11-19): `https://github.com/cursor/plugins/blob/main/pstack/skills/no-comments/SKILL.md`. "when done lets add this to talk about". Not read yet; nothing changed. Bears on how every file in this repo is written: the agents and I have been leaving long comments citing plan phases and his words in the code.
- **A video he sent with it, for later** (2026-11-19): `https://vm.tiktok.com/ZN8agM4Ly/` (its title: "You correct your coding agent, and a week later it makes the same mis..."). Not watched yet: read its captions when this is talked about.

---

## His review notes (2026-11-19, logged verbatim as he gives them; nothing here is built or answered yet)

1. "editors dont load with frames."
2. Top rail, right side (his capture: Preview, the share icon, Export, the zoom): "what is this ? layout off". Read: Export is still drawn at its own 32 height with wide padding and semibold text, beside a 24 zoom dropdown and a bare share icon, so the row has three heights and uneven gaps since controls went to 24.
3. "no shortcuts work"
4. Right rail, the closed Styles and Export sections (his capture: titles and plus in the muted grey): "I thought text were white". Read: a section with no rows draws its title muted (`is-empty`), and the plus beside it too; he ruled the same for Pages earlier ("dont make Pages title lose opacity just because its collapsed"), so every closed section's title and plus take the full ink.
5. Selection on the canvas (three captures): "so many differnt unsynced selection frames??". Read: three different drawings for one idea. The frame: a solid accent line, four solid accent corner squares, its name as plain accent text. A rectangle: a dotted line, eight white handles with an accent edge, a round rotate handle, a dark size chip in mono accent text. A text layer: the same dotted box and handles, plus its name on a filled accent PILL (the pill he ruled out for the frame), plus blue text-selection blocks over the letters, plus the size chip overlapping the text.
6. The text layer's inspector (his capture of Typography: the font dropdown outlined, a weight slider with 600, size 96 and a stray chevron, line height 1.05, tracking -0.01em, two align groups): "text settings is bullshit".
7. The inspector's Morph row (his capture: "Morph" with an Off / On pair): "morph? isnt this an FX should it not b under effect?" Logged as a note, not a question: Morph is an effect and belongs in the Effects section as an effect row, not as its own row with an Off / On pair.
8. A selected shape's name (his capture: "Rectangle" on a filled accent pill above the shape): "shapes dont use container on label text". The name is plain text, no pill, as he already ruled for the frame.
9. His reference for a selected shape (a capture of Figma): "this is how shape looks like in figma". What it shows: one SOLID accent line around the shape; four white square handles with an accent edge, at the corners only (no side handles, no rotate handle, no dotted line); no name above it; the size on an accent chip, white text, centred under the shape. This is the one selection drawing: notes 5 and 8 resolve to it.
10. The tool dock (his capture: kolbox's dock above Figma's): "bigger icons". Read: Figma's dock glyphs are about a quarter larger than kolbox's in the same size of dock (roughly 20 against 16), drawn in white, not the muted grey; the dock itself is a little taller and wider to hold them.
11. The Line Swell styles' controls: "what is roll? what is spread? this makes no sense.... I think you didnt even look at the artifact to ... you are just pluging bullshit.." Read: the port carried the boards' own words (Roll, Spread) as control labels with no explanation, and nobody on the main thread looked at the result against his canvas. Every control needs a name that says what it does, or it goes.
12. The Tune mode (his capture: Generate, with construction, measures, keylines, grid and handles all on): "tuner is fine but need shortcut to trigger view only shape . and pressing 'done;' deletes all work you did in tuner". Two things: a key that shows the shape alone (every overlay off while it is held or toggled); and Done loses the work: leaving the mode must keep what was made, on the layer.
13. The Tune mode's Modify (his capture: a traced image `_bingo.png`, the golden preset, with construction, measures, keylines, comb and original line all on): "modify is just a mess here". What the capture shows: the curvature comb as big red wedges covering the form; angle labels, a ladder table and several paragraphs of white mono readout text ("preset golden: detail 0.5, corners 40…", "12 corners rounded on the ladder", "straight edges along a grid…", "12 arcs, 2 lines, 12 corners, fit strays 0.6%…") laid straight over the canvas; every overlay on at once by default.
14. "pinch to zoom still take half as long or more to zoom in out then f..e figma... its suuuuper slow". Read: after the strength went from 0.0015 to 0.00225 per wheel unit, the same pinch still zooms much less than Figma's. It is the strength, not smoothness: the number must be set by measuring against Figma (the same finger travel, the same zoom change), in his browser (Firefox-based), not guessed.
15. "impossible to put layers in frames from layer menu , nothing pushes inside layer". Read: in the Layers list a row cannot be dragged into a frame (or out of one, or into another layer's group); the list does not nest by drag. The frames agent left this out on purpose ("a drag in Layers does not move a layer into or out of a frame"): it is not acceptable.
16. The right rail with the frame selected (his capture): "right rail is misaligned, doesnt follow design". What the capture shows: the fields do not share one grid. Position's two columns are 200 and 200 wide; Layout's and Appearance's are 176 and 176 with a trailing icon; the Fill field is a third width again and ends short of the column edge; so the right edges of the fields in Position, Layout, Appearance and Fill fall on four different lines. The trailing icons (resize, corners, eye, minus, plus) sit on different x positions from row to row; Appearance has a tall empty band under its row; the header's "Frame" dropdown and its four glyphs are cut by the rail's top. The design (149:26890) is the authority: one column grid, one icon column, every row on it.
17. "tuner set in float for some reason"; "no reason to review this bullshit". Read: the standalone tuner (`pnpm tuner`, `apps/tuner`) is drawn in the float look, which nobody asked for; he stopped reviewing it there.
18. `pnpm editor` with the kolbox style (two captures, port 5180): "editor is broken partly in kolbox on pnpm editor matter of fact". What the captures show. Home: every glyph is missing (the mark is a blank yellow tile, the search field has no glyph, the rail's rows have no icons, the Create button has no plus and chevron, the sort and type dropdowns have no chevrons, the view switch is two blank squares, the avatar is a blank disc); the colors are not kolbox's (a cold blue-black ground, a lemon accent: the default theme, not the kolbox theme); "0 of 0", no files. Editor: the same cold colors; the Page color field reads "COLOR-MIX(IN SR…" instead of a hex; the line under the title reads "Not saved"; the canvas is empty with a "Saved, Show in Files" toast.
19. Line Swell, System and Tuner, with fourteen captures of his canvas and of Figma's Effects menu and Shader effects window: "so when I open the toool I jsut want a dropdown like effect/shader and get a preview like this for each one? that makes sense? VISUAL INDICATOR to the form? so it would be EFFECT >> LINE-SWELL >> images of these [not all this is actually maybe just 3 or 4, mainly its piano style on shapes, but then its also a form dividr so you can set fx on half or part of shapes - right side is pure piano style on shapes. here these make forms, [warp, radial, moire, pinch, flow, rotator, vortex]. EACH has unique settings. these can be presets since they are proved to work. Motion on 9 for labs, https://claude.ai/artifact/4Npm9zbKAg753Cz4TMPSKw#page-e9ca4c8d8587 also on 'wave shapes'. contruct 1, system, tuner: its system and tuner, contruct was the trial error. BUt dont just copy, look at what the fuck is happening and why.. read the logs. figure out WHY I made these tools.. and why I want them in the repo.. also look at how clean this is set up in the artifact, and question yourself, if its slopppy when you do it.. if anyone will be happy about it." Earlier in the same exchange, on the canvas's Tweaks panel: "you see how good the controls are .. SIZE + slider. what you made was not for humans."
