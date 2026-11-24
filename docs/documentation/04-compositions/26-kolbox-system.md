---
title: Kolbox system
type: reference
status: active
created: 2026-11-18
updated: 2026-11-20
description: The kolbox look — docked rails on a warm ground, a solid accent, one floating surface — every part of it by family, where each lives and the props it maps
aliases:
  - kolbox
  - kolbox look
  - groovebox
sources:
  - packages/theme/kol-design-tokens.css
  - packages/theme/kol-type-kolbox-classes.css
  - packages/theme/kol-components-atoms.css
  - packages/theme/kol-components-molecules.css
  - packages/theme/kol-components-organisms.css
  - packages/theme/kol-components-shell.css
  - packages/design-editor/src/editor/kolbox
  - apps/kolbox/src
  - apps/editor/src/kolbox
  - .kol/llm-context/plan-2026-11-18-kolbox-system.md
tags:
  - domain/compositions
  - domain/editor
related:
  - "[[24-float-system|float system]]"
  - "[[14-design-editor-system|design-editor system]]"
  - "[[../01-foundations/09-sizes|sizes]]"
  - "[[../01-foundations/03-typography|typography]]"
  - "[[11-shell-system|shell system]]"
---

# Kolbox system

| Look | Word | Theme | Widths | Type | App |
|---|---|---|---|---|---|
| kolbox | `variant="kolbox"` | `data-theme-variant="kolbox"` (colors only) | [[../01-foundations/09-sizes\|sizes § Kolbox widths]] | `kol-kolbox-*` roles, [[../01-foundations/03-typography\|typography § Kolbox roles]] | `pnpm editor` with Settings › Style Kolbox |

**Kolbox** is KOL's third look, after the default and [[24-float-system|float]]: the editor, Labs and Morph chrome in the
groovebox style (Figma `SgfHBi22F7tYO7GHIorUbv`; his editor design is node 149:26890). Docked rails 240 wide on a
warm ground, 24 controls (`--kol-kolbox-ctl`, one token), Inter 12 labels, a solid accent for the armed tool and the lit menu row, and one floating
surface for everything that floats (`.kol-kolbox-surface`, the dock's shadow). It moved from `apps/kolbox/src/ui` into
the packages in five batches (plan-2026-11-18-kolbox-system W31.2, 2026-11-18); the map of all 97 parts the sizing
read is `_tmp/2026-11-18-kolbox-migration/batch-5.md`.

**The word.** `variant="kolbox"` on the component whose twin it is, never a second component. A theme sets colors and
the two families; the look carries what a theme cannot (heights, widths, structure). A part with no look of its own
takes no variant (Avatar, ButtonGroup's layouts, OriginPicker, useMediaQuery). Each part joins the package its KOL twin
already lives in: kol-component for most, kol-shell for the dock, the transport, the phone nav, the file browser frame
and the document title.

**Its sub-looks are KOL's words.** kolbox's own `variant` values moved to the props KOL already has: heights to
`size`, a button's role to `tone`, lit to `pressed`, a readout to `readout`, a section's title and actions to
`label` and `end`, selected to `active`. The tables head each batch file in `_tmp/2026-11-18-kolbox-migration/`.

## The parts, by family

| Family | Parts (kolbox's name → KOL's) | Where | Batch |
|---|---|---|---|
| Type | kolbox's eleven steps → `kol-kolbox-title` … `kol-kolbox-meta` | kol-theme | 0 |
| Controls | Toggle → `ToggleSwitch`, Checkbox → `ToggleCheckbox`, Button and IconButton → `Button` (`iconOnly`), SplitButton → `ButtonSplit`, IconGroup → `ButtonGroup layout="joined"`, Kbd and Keys → `Kbd`, `KbdKeys`, Link → `Link` (new), XYPad → `XYPad`, OriginPicker → `OriginPicker` (no variant) | kol-component | 1 to 3 |
| Fields | Input → `Input`, Textarea → `Textarea`, Slider → `Slider`, LabeledControl → `LabeledControl`, PropertyRow → `FieldPair`, Tabs → `TabsRow`, AlignmentRow → `AlignmentGrid`, GroupLabel → `DividerLabel` (new) | kol-component | 2, 3 |
| Floating | Menu → `Menu` (+ `MenuScroll`, new), Dropdown → `Dropdown`, DropdownStepper (new), Tooltip → `Tooltip`, Popover → `PopoverPanel` (its shell `ModalShell`, its layer `PopoverLayer`), Modal → `ModalDialog`, the confirm and the prompt → `ModalProvider`, Toast (new), AccountChip → `AccountMenu` | kol-component | 4 |
| Color | ColorField → `SBSquare`, HueSlider → `HueStrip`, OpacitySlider → `AlphaStrip`, ColorWheel → `WheelTriangle`, SwatchGrid (new), SwatchStack → `SwatchStack`, FillRow → `ColorInputRow`, PopoverColor → `ColorPickerPopover` | kol-component | 2, 4, 5 |
| Rails | Rail → `Rail`, RailHeader → `RailHeader` (`size` md, sm), RailSection → `LabeledControlSection`, ListRow → `TreeRow` (`size` xs, sm, md, lg) | kol-component | 5 |
| Editor chrome | Shell → `EditorShell`, ToolDock → `ToolRail` (its cell `ToolRailSlot`, new), ToolbarTransport → `AppFloatNav transport`, MotionTimeline → `TimelineDock`, RailPhone → `AppFloatNav`, the top rail's document title → `DocumentCapsule`, ModalSearch → `CommandOverlay`, BindDot → `ParamBindDot` | kol-component, kol-shell | 5 |
| Home | Browser → `CatalogPage`, BrowserTitleRow → `SectionText`, FileGrid → `CatalogGrid`, FileCard → `ContentCard`, FileList with its head and rows → `Table` | kol-component, kol-shell | 5 |

What is kolbox's own, in the editor engine since C3 (plan-2026-11-19-kolbox-whats-left, 2026-11-19):
`packages/design-editor/src/editor/kolbox/`. `ui/`: the rails' contents (`LeftRail`, `RightRail`), the menus
that hold one app's rows (`MenuMain`, `MenuFile`, `MenuEffects`, `MenuVector`, `MenuBoolean`, `MenuBlendMode`,
`MenuZoom`), the engine's popovers (`PopoverEffect`, `PopoverEffects`, `PopoverStroke`), the glyph glue (`Icon`, `Tag`)
and the confirm bridge (`ask.js`); beside it `search/`, `app/` (Settings, the narrow gate, the providers, the phone's
bottom bar `PhoneNav`, the shell's states `chrome.js`, the rails' drag `RailResize.jsx`), `files/`, `editor/` (the inspector, layers, windows, export, the generator, Tune), `labs/`,
`morph/`, `randomiser/`, `pages/` (Editor, Labs, Morph, Randomiser), the screens' host `KolboxView.jsx` and the sheet
`kolbox.css`. `<DesignEditor variant="kolbox">` mounts them ([[14-design-editor-system|design-editor system]]).
Home and Library are host pages, not the engine's: their one copy is in `apps/editor/src/kolbox/` (`pages/Home.jsx`,
`pages/Library.jsx`, `home/`, `library/`, `ui/HomeRail.jsx`), handed to the editor as its `pages` prop. `apps/kolbox`
imports the engine's screens and apps/editor's host pages back and keeps only its router and the Dev pages, until it
retires. Each is built from the package parts above.

## Rules carried

- **Rails dock.** A kolbox `Rail` is a frame at the edge: the panel fill, its edge line drawn over its own edge, 240
  (49 collapsed). No role, scrim or resize: those are the default look's.
- **One floating surface.** Every part that floats (menu, popover, window, toast, tooltip, the dock, the search modal)
  takes `.kol-kolbox-surface`; where it draws a line, the line is the quiet strong line (`--kol-kolbox-line-strong`).
- **One control height, 24** (`--kol-kolbox-ctl`, [[../01-foundations/09-sizes|sizes § Kolbox widths]]; 28 until 2026-11-19, his ruling "they should all be 24 not 28"). Every control reads it: buttons of every tone and the icon button, the top rail's mode tabs (in a 32 track), the split button, the joined group and its cells, inputs, dropdowns, the tab track, sliders and their value fields, toggles, checkboxes, the color row, the labelled row. Not controls, and kept: menu and tree rows (24), the Home rail's rows and the tooltip (28), the dock's cells (36, for 20 glyphs).
- **The rail's one grid** (plan-2026-11-19-kolbox-whats-left R3.1, his "right rail is misaligned"). Every row of a
  rail section sits on one set of tracks, set once by `LabeledControlSection variant="kolbox"` inside a `Rail` as
  `--kol-kolbox-row-cols` and read by `FieldPair variant="kolbox"` (and `ColorInputRow variant="kolbox"` with
  `actions`, which lays out through it):

  | Track | Width (240 rail, 16 in) | x from the rail's left | Holds |
  |---|---|---|---|
  | field 1 | 76 | 16 to 92 | `first`; a `LabeledControl` label (76) |
  | gap | 8 | | |
  | field 2 | 76 | 100 to 176 | `second`; `span` puts `first` over both (a fill, an effect row, a font) |
  | gap | 8 | | |
  | icon A | 16 | 184 to 200, centre 192 | the second-last trailing icon |
  | gap | 8 | | |
  | icon B | 16 | 208 to 224, centre 216 | the last trailing icon |

  `trailing` fills the icon columns from the right, so a lone icon is on B and a pair on A and B; the section head's
  actions, right-aligned 8 apart, land on the same two. A field ends on 92 or 176 whatever icons follow it; a
  `LabeledControl` row's control runs from 100 to the outer edge, 224, and a full-width button to 224. The tracks are
  his design's Stroke row (149:26890: 76, 8, 76, then icons at 168 and 192 in the 208 body), taken for every row; its
  Position (100 and 100) and Layout (88 and 88) widths went, and Appearance's 28 band under its row. Outside a rail
  `FieldPair` keeps two equal columns and the trailing's own width.
- **The icon button lights a 24 frame** (the control height) on a 16 or 24 layout box; chevrons are 12 everywhere.
- **The dock's glyphs are 20, in the full ink** (R3.4, his "bigger icons"), in Figma's 32 tiles (W16.3, 2026-11-20): the
  armed tool a rounded accent tile on its own, its chevron a separate 16 by 32 button 1 beside it, plain at rest and on
  the field fill when hovered or open, 8 to the next tool, the dock 48 high. The right rail's top is two rows as Figma's
  (W16.6): the account at the left, Preview and Export (the kit's primary, 32 high in Share's place) at the right; under
  them the zoom at the right (the editor only), plain text and chevron, the field fill on hover. No tabs.
- **Tones are Figma's contrasts, drawn with the fg wash** (W16.4 and W16.7, measured 2026-11-20). Fills, hovers and
  lines are fg stops over the ground; the oq ladder is ink only. Against the rail ground:

  | Token | Holds | Dark | Light |
  |---|---|---|---|
  | `--kol-kolbox-field` | field, hover, selected row, the chevron open, zoom hover | `fg-06`, 1.20 (Figma 1.19) | `fg-08`, 1.14 |
  | `--kol-kolbox-line` | the rails' edge, section rules, the switcher's divider | `fg-12`, 1.47 (Figma 1.43) | `fg-08`, 1.14 |
  | `--kol-kolbox-field-strong` | current tab, toggle track, secondary hover, slider track | `fg-24`, 2.17 | `fg-16`, 1.32 |
  | `--kol-kolbox-line-strong` | control outlines, menu and dock rules, the floating surface's line | `fg-24`, 2.17 | `fg-16`, 1.32 |

  The lit tile is the accent at 16 (1.44, Figma 1.43); the canvas grey is its own surface, `--kol-kolbox-canvas`
  (#393939, light #eeebe2). The editor's `field` and `border` roles read the field and the strong line. The shell is
  square at every junction (W16.2).
- **Effects are rows.** Morph, a text layer's weight axis morph, is added from Effects and listed there with its eye,
  minus and card (R4.2), a `morph` row in `layer.content` whose eye is the body's `axisOn`; its settings stay the text
  layer's axis fields. A file from before it (axisOn on, no row) shows the row and writes it on its first eye.
- **The armed tool is solid accent** on the accent's ink; a lit toggle is the accent tint; a lit menu row is solid
  accent.
- **A rail section with no rows is its head alone**: padding 16 all round a 16 head, 48 high (the title sits on a 16
  line, not the scale's 17, so every section's height is even). Closed is not empty: its title and the head's action
  glyphs keep the full ink, as every section head's do (R3.2, his "I thought text were white"). Its rule and the rail's edge line are
  `--kol-kolbox-line`.
- **Pages opens closed.** With the one page a file starts with, the left rail's Pages section is its title and a plus, 48 high; the plus adds a page, and from then on the list and the search are there.
- **A chevron is a 12 box holding a 6 x 3 glyph at 1.25px.** The set's chevron spans 18 of its 24 grid, so it is drawn
  at 8 inside the 12 box (`.kol-kolbox-chevron`).
- **The rail's document header** (`RailHeader variant="kolbox" size="sm"`) is 56 high: 8 above and below, 16 left, 12
  right, an 18 title row, 8, then a quiet 11 / 14 line (`subtitle`). Its title is `ButtonSplit variant="kolbox"
  tone="ghost"`: no fill at rest, both halves on the field while hovered or open, the hovered half a step lighter.
- **Text weight follows the mode.** Dark's UI text is white, so rows and controls draw at 300 and titles at 400
  (`--kol-kolbox-row-weight`, `--kol-kolbox-label-weight`, `--kol-kolbox-title-weight`, set in kolbox's dark block);
  light keeps 400 and 500. The document title stays 500 in both.
- **Light is near neutral with a rust accent** (`#9c4a1e`); dark keeps the yellow. In light the top rail's mode track
  takes oq-08 and its current tab the ground (`--kol-kolbox-track`, `--kol-kolbox-track-active`).
- **The color row** (`ColorInputRow variant="kolbox"`): a 14 swatch at radius 2, 6 in from the field's edge; no accent
  line on the field while typing or picking; `hidden` (the paint's eye is off) dims the opacity value.
- **On the canvas** (the engine, so every app that mounts it): a frame's name is plain words, in the accent while the
  frame is selected, never a pill; a frame with no fill draws no edge line; a new frame's fill is `#ffffff`; the rulers
  and guides follow pan and zoom. Kolbox's own ruler look: no ticks, each number centred on its position, the text ink
  at 32 percent, weight 300, 2 percent tracking.
- **Seams still open**: `ColorInputRow`'s `picker` (a molecule cannot import the color popover organism), and kolbox's data shapes
  kept under the look (Menu's `groups`, the timeline's tracks in seconds). The batch file lists each. Kolbox's glyph names went 2026-11-19 (C9.2): its data carries the set's names and the kolbox parts take no `iconComponent`.

## The shell: RailSwitcher and the three states

From plan-2026-11-20-kolbox-everything-left W1 and W2, after Figma's shell (measured in Chrome 2026-11-20). There is no
top rail: its file is in `_tmp/2026-11-20-top-rail-retired/`.

| Part | What it is | Where |
|---|---|---|
| `RailSwitcher variant="kolbox"` | The narrow rail at the far left on every screen, Home included, the only mark (Home's and the Library's top bars carry none): the mark (opens the screen's main menu), a divider, the spaces Home, File, Media, Labs, Morph, Randomiser, and Settings at the foot. 49 wide (48 and its edge line), each space a 32 tile 8 apart by a gap, 18 glyphs drawing 14 tall as Figma's (the 24 set fills 18 of its box, so 18 is what draws 14), the lit space on the accent tint with the accent glyph; each row has its tooltip. Under 768 it steps aside for the phone's bottom bar | kol-component `organisms/RailSwitcher.jsx`; mounted by `KolboxView.jsx` |
| The left rail's top | The file name (its split button and menu) and the Minimize UI toggle | `ui/LeftRail.jsx`, `pages/Editor.jsx` |
| The right rail's top | Row one the account, Preview and Export; row two the zoom at the right | `ui/RightRail.jsx` (`RightRailTop`, through `RailTop`) |
| Docked | RailSwitcher, both rails at the edges, the dock | `app/chrome.js` `ui: 'docked'` |
| Undocked (Minimize UI, ⇧⌘§) | Two pills over the canvas, the canvas edge to edge, the dock stays: left `RailPill` (the mark opens the main menu, the file name, the toggle that docks again), right `RailPillRight` (account, zoom, Preview). Under them the parts chosen in View › Panels float (Pages, Layers, Properties); docking shows everything, undocking brings the same choice back | `ui/LeftRail.jsx`, `ui/RightRail.jsx` |
| Hidden (Show/Hide UI, §) | The canvas alone; the key returns to the state it was pressed in | `app/chrome.js` |
| Minimize left navigation bar (`\`) | RailSwitcher goes on every screen, the left rail moves to the edge; on the editor the mark then stands before the file name. In kolbox the rails' own key is ⇧\ (the editor's left rail, Labs' rails, Home's rail) | View menu, `app/chrome.js` `useSwitcherKey` |
| Media | The switcher's Media opens the Library on its MEDIA tab: the host's media client, or the editor's sample library with its one line | `apps/editor/src/kolbox/pages/Library.jsx`, `app/sampleMedia.js` |
| Home's files | Several select (press, ⇧ range, ⌘ add, a band over the ground); the menu's verbs act on all; they drag onto a rail folder or Trash, lit while over it | `apps/editor/src/kolbox/pages/Home.jsx`, `ui/HomeRail.jsx` |
| Rail sizes | Each rail resizes by a drag on its canvas-side edge (`col-resize`), the Pages and Layers line by a drag (`row-resize`); floor 240 for the rails, 96 for Pages, the kit's ceiling three times the default; a double press puts it back; remembered | `app/RailResize.jsx` on the kit's `useDragResize`, the sizes in `kolbox.css` |

The state, the floating choice and the sizes are kept in this browser profile's storage, as the rulers are. The View
menu's rows are Figma's [35]: Minimize left navigation bar, Minimize UI, Show/Hide UI, Panels.

## The behaviour set

One set for every kolbox screen, carried by the shared parts so a fix reaches every place at once (plan
2026-11-19-kolbox-whats-left T5; the audit's rows in [[../../operations/07-apps-tier/11-kolbox-audit|Kolbox audit]]).
Where nothing was ruled, Figma's own editor was read.

| Area | The behaviour | Where it lives |
|---|---|---|
| Control | Works, or is dimmed with its reason in a tooltip, or is not drawn. Never live and dead | the inspector's `Act` (`reason`) and `Dim` (`editor/properties/parts.jsx`) |
| Field | One click selects the whole value; a second places the caret | `Input variant="kolbox"`, `selectOnFirstPress` |
| Field | Enter or leaving commits a changed value | `useKolboxField` (Input's `onCommit`) |
| Field | Escape puts back the value from before the edit and leaves the field; the next Escape reaches the window or the editor | `useKolboxField` |
| Field | ArrowUp and ArrowDown step a number by 1, with Shift by 10, and commit; a hex does not step | `useKolboxField`, `stepText`; `ColorInputRow variant="kolbox"`'s hex and opacity |
| Field | Differing values read "Mixed"; an edit applies to all | the many-selected inspector |
| Mixed content | Several layers selected (15.5, Figma): Effects whose layers do not carry the same rows in the same order, and Fill or Stroke whose lists differ (a layer with none is left out; a styled row matches by its style), list nothing and read "Click + to replace mixed content"; the plus replaces every layer's rows with the new one in one undo step. The same rows draw once; an effect setting, a stroke weight or position the layers do not share reads "Mixed" in its field | `editor/Properties.jsx` (`MultiProperties`, `paintsOf`, `fxSigOf`), `ui/PopoverEffect.jsx` (`mixed`) |
| Effect | With several layers selected every effect opens on the selection: each layer carries its own copy with the same settings (never one combined shape), one undo step. Generate and Repeat's window shows the first layer's row, reads Mixed beside a control the rows disagree on, and its Apply, Live preview, Cancel and Expand act on every row (a Repeat of its own layer stays its own). Tune's stage shows the first shape; Done writes each tunable layer its own Tune row, fitted to its box (Modify on the layer's outline reads each layer's own). Pattern, kinetic type and loop open their card on the first row and write the same patch to every row | `editor/generate/GeneratorWindow.jsx` (`editContentAll`), `editor/generate/ContentScopeAll.jsx`, `editor/tune/TuneMode.jsx` (`openTune`'s `more`) |
| Menu | Opens with no row lit; the accent follows the pointer or the keys; the current choice carries a check, no fill | `Menu variant="kolbox"` (`highlighted` marks the chosen row only), `Dropdown variant="kolbox"` |
| Menu | A letter moves to the next row starting with it; Escape closes | `Menu variant="kolbox"` |
| Menu | A row that does not apply is greyed, no tooltip, as Figma's menu rows | `Menu variant="kolbox"` |
| Window | A window beside the rail holds through a press on the empty canvas (the press is spent, so the selection it edits stays); a press on a layer selects that layer; it closes by its close, Escape or its caller's toggle | `PopoverPanel variant="kolbox"` (`PopoverLayer` kind `popover`) |
| Window | A dialog (Settings, Media, the search modal, a confirm) closes on a press outside, as Figma's | `ModalDialog variant="kolbox"`, `CommandOverlay` |
| Tooltip | Every icon-only button shows its name; one already inside a tooltip keeps that one | `Button variant="kolbox"` `iconOnly` (its `aria-label`), `Tooltip variant="kolbox"` `asChild` |
| Right-click | The canvas and a Layers row list the same rows; the row's adds Rename | `editor/layers/LayerMenu.jsx` |
| Right-click | A page: Copy link to page, Rename, Duplicate, Move up, Move down, Delete | `pages/Editor.jsx` |
| Layers keys | Figma's arrange keys on the selected row, one undo step a press: ⌘] (⌘Ä) one row up, ⌘[ (⌘Ö) one row down, ] (Ä) to the top of its siblings, [ (Ö) to the bottom. One row is a row as drawn: past a frame's first or last layer the row leaves the frame, and a page row that meets a frame goes in at its near end. A group's child moves among the group's children | `ui/listMoves.js` (`rowStep`, `rowEnd`, on the engine's `placeLayer`) |
| Touch drag | A finger held still 250 ms on a Layers or Pages row lifts it and the list stops scrolling under it; a finger that moves sooner scrolls | `ui/listMoves.js` (`useTouchHold`) |
| Pages drag | A page row drags to a new place by mouse or touch, with the drop line Layers draws; one undo step through the engine's `movePage`; Escape cancels | `ui/LeftRail.jsx` (`Pages`) |
| Find | ⌘F (or the Pages search icon) opens find in the place of Pages and Layers, as Figma's: the field, the options (Find or Replace; All, Text, Frame / Group, Image, Shape, Other with counts; Match case; Whole words) and the close; in Replace, "Replace with…" and Replace and Replace all; then "N results · This page" (or All pages, grouped under each page with its count) with the previous and next arrows, each hit its type icon and its name with the match in bold accent, and on This page "See results on other pages". Layer names and the words in text layers match. Enter selects the next hit (the first press the lit one), ⇧Enter the one before, opening its page and zooming to it. Replace and Replace all change the words in text layers only, each one undo step across pages; names are not touched. Escape or the close puts Pages and Layers back; the browser's find bar does not open | `ui/Find.jsx`, the engine's `replaceTexts` (`compose/state.jsx`) |
| Export | The Export window writes the frame, the selection or every frame as PNG, JPG, SVG, PDF or Video; video bakes one loop per picture, several in one .zip, its progress at the window's foot | `editor/export/WindowExport.jsx`, `render.js` (`regionVideos`) |
| Export | A rail export row is Figma's: scale (none for SVG), format PNG, JPG, SVG or PDF, a minus, and a suffix under them (empty, a scale over 1 writes `@2x`). JPG is the PNG on white; PDF is one page the picture's size in points holding that JPG, written by `pdfOf` with no library | `editor/properties/Export.jsx`, `render.js` |
| Export | With nothing selected the section is the page's: its plus adds a row and Export writes one picture of the whole page, every frame and layer in their bounds | `editor/properties/Export.jsx` (`page`), `render.js` (`page`) |
| File | Media kept writes photos and video clips into the file as data: the portable `.kol.json` any clip, the browser's library clips up to 1.5 MB (bigger ones keep their address, so a save never overruns the storage) | `files/portable.js` (`keep`, `LIBRARY_CLIP_BYTES`), `render.js` (`inlineMedia`) |
| Frame | A frame turns: the Rotation field, Rotate 90° right (Figma's direction, the same button as a shape's: 45 to 135) and the selection's corner zones; its layers turn with it about its centre, on the canvas and in export (a turned frame exports in the box that holds it turned) | the engine's `turnMembers` (`compose/frame.js`), `editor/properties/Canvas.jsx` |
| Frame | Clip content (Layout, under W and H; on for a new frame): its layers are cut to its outline on the canvas, the cut part neither drawn nor pressed, and in export; its own stroke is not cut; a layer being dragged is drawn whole until it is let go | `compose/CanvasArea.jsx` (`layerStack`), `compose/build.js` |
| Frame | A drop in Layers moves a layer into, out of and between frames; a layer dragged off its frame on the canvas leaves it; ⌘D on a frame copies its layers into the copy; Use as mask is in its menu (Figma's), masking the layer under it | `compose/frame.js` (`placeInList`), `compose/state.jsx` (`duplicateLayer`), `compose/masks.js` |
| Frame | Its header has no actions (no mask, boolean or nodes, as Figma's); alone on its page it draws no alignment row. Create component is drawn nowhere: components are parked | `editor/properties/Sections.jsx` (`HeaderActions`, `PositionSection alignable`) |
| Styles | A color style or a text style is a name and a value kept with the file (`styles` in the file, the draft and the portable `.kol.json`). Fill, Stroke, the Page row and Typography each have a Styles button: it lists the file's styles (a swatch or "Ag" in the style's font with its size and line height, the one in use checked); a press applies it, the plus saves the current value as a new style and opens its settings (name, value, Delete style). With several rows the button works on the top row; a row that uses a style shows its swatch and name, a press on it opens the list for that row, its link icon detaches it. The Color window's Add style and the Page's Styles list (text styles, then color styles, each opening its settings) save and edit them too | `compose/styles.js`, `editor/properties/Styles.jsx` |
| Styles | A style's change reaches every layer that uses it on every page, and a page that follows it, in one undo step; a removed style leaves each layer its value; a direct edit (a type value, the Color window, the page row) detaches the style, keeping the value | `compose/state.jsx` (`updateStyle`, `removeStyle`), `editor/properties/Typography.jsx`, `color/useColorTarget.js` |
| Stroke | Position Inside, Center or Outside on a rectangle, an ellipse and a frame; Individual sides opens top, right, bottom and left weights on a rectangle and a frame; unset reads Inside on every side, as before | `compose/stroke.js`, `editor/properties/Sections.jsx` (`StrokeLine`) |
| Fill, Stroke | Several of each on shapes, paths and frames: the plus adds a row on top (a fill `#d9d9d9`, a stroke black), each row with its color, opacity, eye and minus; listed top first, drawn bottom first, strokes over fills; the own row's minus brings the next row down. Kept as `fills` and `strokes` over the layer's own fill and stroke, so an old file opens as it was | `compose/layerModel.js` (`paintStack`), `editor/properties/Sections.jsx` (`PaintRows`) |
| Colour | Edit, Color is greyed with nothing selected; the eyedropper shows its cursor until a press or Escape | `editor/MenuBar.jsx`, the engine's `pickFromCanvas` |
