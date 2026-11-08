# Plan — the float editor (fxr's editor in float style)

**Raised:** 2026-11-05, the user, his design in Figma file `7K5v68l4tblHPFuiLdokRu`, section 20:12208 (frame "02 · File menu open" 19:6066 + menu sheet 20:13601). Points verbatim: *"it shouldnt be exactly Float but similar"* — *"everything is modular in the ui anyway, nothing should be fixed"* — *"this is A DESIGN"* — menu bar: *"ITS INSIDE BROWSER before the editor. like a APP"* — *"we start with this, and work our way through labs, randomiser and morph"*.
**References (same file, page 0:1):** Section 4 "editor — float (proposal)" 16:3249 (01–06 states); Section 4 17:7596 — the frames he composed: 01 overview 19:4829, 03 text tool + options 19:6699, 04 object inspector 19:7332, 05 timeline 19:7965, 06 phone 19:8598, plus part details (Layers, Typography, Colour, Transform, Appearance float cards 19:9799–19:10243; File dropdown 19:10245; Context toolbar 19:10406; Object inspector 19:10408; Floating tool rail 19:10541; Destination navigation 19:10573; Document capsule 19:10608; Menu capsule 19:10617; Timeline 19:10667); Section 5 20:12208 (the reworked menu bar, the lead frame); Section 6 20:14060; Sections 1–3 (1:3895, 10:2143, 10:2704) — the Labs windows (Generate, Repeat, Paratype Letter, Stripe Array settings) and his control spec text 1:2.
**How the sections relate (read 2026-11-05):** Section 5 is his latest rework and sets placement (app bar top; transport top-centre; undo, redo, Export, account top-right; document capsule + breadcrumb top-left; tool rail left; all cards right; mode switch bottom-left). Section 4's frames 01–06 give the part designs (Colour card with picker, Transform, Appearance, Layers, text context toolbar, More tools popover, object inspector with Design/Motion/Effects, floating timeline, phone), laid out per Section 5; its floating menu capsule is superseded by the app bar. Section 6 holds the menu explorations (the app-bar dropdown is the one), the collapsed card state and the context toolbar. Sections 1–3 are Labs: the KOL LABS rail, the Stripe Array settings modal, the control spec.
**Status:** DRAFT — 2026-11-05. Open: everything.
**Shape:** W › phase › list.
**Laws carried:** two owners (2026-11-04: fxr owns its editor; the KOL copy in `packages/design-editor` is the float base; fxr never consumes it, and `EditorShell` stays as is). Find the shipped component first. Rail words (Rail, Overlay; enter/exit, expand/collapse). Dark first. Icons `oq-*`. No borders without his say. Family-prefix names. A look change goes to the Figma library the same turn. The design is the source: the code answers to his frame, closed on a side-by-side (frame · live · Figma).
**How a phase closes:** measurable acceptance line first, gates green, then Playwright against his frame at 1600 × 1120 (menu bar 40 + editor 1080) and his words; motion on a recording.

## W1 — The chrome parts (kol-shell)

### 1.1 — App menu bar — ✅ built 2026-11-05
- A new `MenuBar` part: an in-browser app bar, 40 high, above the editor. App name left (FXR), menus (File, Edit, Layer, Text, Vector, Tools, View), Help right; each menu opens a dropdown with shortcuts and submenus (File › Export: Export SVG, Export PNG, Batch export…, Open output window).
- Built on kol-component's existing menu parts (the ones MenuTop and FloatActionMenu use). Its items come in as data, so Labs, Randomiser and Morph pass their own.
- Acceptance: his frame 20:13601 vs live, the bar and both open menus, boxes ±4 px. Keyboard: ←/→ move between open menus, Esc closes (Playwright).

### 1.2 — Float card (collapsible, tabbed) — ✅ built 2026-11-05
- The right-hand cards: a header with tabs (Typography; Colour · Swatches; Layers · Assets · History; Transform; Appearance), a chevron to expand/collapse, a rows slot and a foot slot (the Layers actions).
- Check first: dashboards `FloatCard`/`SectionHead` and kol-shell `PropertyRail`. Extend the closest one; never a third card.
- Acceptance: the card stack vs his frame 20:14470, ±4 px; expand/collapse and tab switch work (Playwright); the cards render in any order from data.

### 1.3 — Top cluster, tool rail, mode switch — ✅ built 2026-11-05
- Check his frame against the shipped `DocumentCapsule` (back, name ⌄, Saved), the transport (play, pause, loop, stop, back, timecode), `GlobalActions` (undo, redo, Export, account), `SceneBreadcrumb`, `ToolRail` with its ⋮ overflow, and `AppFloatNav` (Editor, Labs, Randomiser, Morph, •••). Fix only what differs.
- Acceptance: each part ±4 px of his frame; a list of the deltas fixed.
- Built: kol-shell 0.109.0 + kol-dashboards 0.13.0; side-by-side in apps/float `/views/float-editor` (_tmp/2026-11-05-float-editor/). Every box within 2 px of 20:12207 (capsule 232×48 · transport 378×48 · actions 201×36 · rail 52×360 · ⋮ 36 · modes 418×66 · cards 298/68/308/66/66); File list 250×258 at 65,38, Export 250×106 at 305,200 (his 306,199, the list lifted to fit the 314 artboard); ←/→ and Esc pass. Deltas fixed: ToolRail `more` (the ⋮ + list); ToolRail slots, undo · redo and the capsule's ← at oq-96 (were oq-48); Breadcrumb in the hint role, root crumb emphasis, rest oq-48; the editor card's chevron oq-64. Held: his stack draws Appearance twice — the view draws it once; the Editor mode tab is lit (the current path), his frame draws none lit.

## W2 — The editor, working, in apps/float

### 2.1 — FloatEditorShell — ✅ built 2026-11-05
- A second shell beside `EditorShell` in `packages/design-editor` (the KOL copy): same state (workspace, tools, panels registry, compose), float chrome from W1. `EditorShell` untouched. apps/float's `/editor` mounts it in place of today's layout-only VisualEditor.
- Acceptance: apps/float `/editor` loads the default scene; the select, rectangle, ellipse, text and pen tools each create or select a layer (Playwright); 0 console errors.
- Built: `packages/design-editor/src/editor/float/` (FloatEditorShell · FloatCompose · useFloatMenus · FloatTextToolbar · chrome), `FloatDesignEditor` export (design-editor 0.28.0); apps/float `/views/float-editor` mounts it (the W1 layout view in `_tmp/2026-11-05-float-editor-layout/`). Rectangle 0→1, Ellipse 1→2, Text 2→3, Pen 3→4, Select shows the handles; 0 console errors.

### 2.2 — Every command has a home — ✅ built 2026-11-05
- Every command in today's editor (MenuTop, shortcuts, rail footers) sits in the menu bar, the top cluster or a card.
- Acceptance: a script lists MenuTop's commands and the shortcut keymap against the menu bar data; 0 missing.
- Built: `pnpm check:float` (design-editor `scripts/check-float-commands.mjs`): MenuTop rows 96 · shortcuts 54 · rail 25 · registry panels 11 — missing 0. MenuTop's Window rows live in View › Cards / Workspace; the key-only verbs got rows (Layer › Nudge, Layer › Opacity, View › Toggle fps readout); the action band's verbs are Layer rows.

### 2.3 — Panels as cards — ✅ built 2026-11-05
- Every panel in the panels registry renders as a float card, grouped by tabs per his frame; the stack scrolls when taller than the canvas.
- Acceptance: registry panels vs rendered cards, 0 missing; a text layer selected shows Typography expanded (his frame).
- Built: 11 registry tabs in 5 cards (Typography · Color/Swatches/Stroke · Layers/Assets/History/Navigator · Design/Parameters/Effects/Pattern · Output), 0 missing; text selected → Typography open at 1256,148,320. Held: his Transform and Appearance cards are the Design tab (the inspector's own panes); the card bodies are the editor's controls, not his float fields.

### 2.4 — Text tool options and object inspector — ✅ built 2026-11-05
- The context toolbar under a selection when the text tool is active (his 19:10406, frame 03 19:6699), and the object inspector (19:10408, frame 04 19:7332).
- Acceptance: frames 03 and 04 side by side with live, ±4 px.
- Built: the toolbar 590,282,420,68 = his; More tools the ⋮ list (W1); the inspector card 320 at x 1256. `_tmp/2026-11-05-float-editor/w2/sbs-03-text-toolbar.png`, `sbs-04-object-inspector.png`. Held: the inspector's tabs read Design · Parameters · Effects (his Motion — the generator's Parameters hold a Motion tab, not the whole of it); the stack keeps Section 5's order, so the inspector is fourth, not first as in 04.

### 2.5 — Timeline — ✅ built 2026-11-05
- The floating timeline (19:10667, frame 05 19:7965) on the shipped TimelineRail.
- Acceptance: frame 05 side by side with live, ±4 px; scrub and play captured on a recording.
- Built: the motion pack's Timeline (TimelineRail) floats at 64,·,1472 to 24 off the bottom = his 64…1536; the cards and the mode switch stand above it. `_tmp/2026-11-05-float-editor/w2/timeline-play-scrub.mp4` (30 fps, 13.7 s): play 00:00:00 → 00:02:17, scrub to 00:01:29, play on to 00:03:17.

### 2.6 — Canvas — ✅ built 2026-11-05
- Selection shows its label above and the size badge below (his "New text" · "600 × 160"); zoom and pan as today.
- Acceptance: side-by-side with his frame 19:6066, the selection box ±4 px.
- Built: kol-component 0.342.0 `SelectionOverlay variant="float"` + `name`; the box 480,438,600,160 (his 480,440,600,160), the name above, the size cap under. Rulers start off under the float chrome (View brings them back).

### 2.7 — Phone — ✅ built 2026-11-05
- His frame 06 (19:8598, 390 × 844). The menu bar folds into the document capsule's menu on the phone (decided for review).
- Acceptance: frame 06 side by side with live at 390 × 844, ±4 px.
- Built: capsule 16,20 · actions 185,82 · tool row 16,304,358,80 (kol-shell 0.110.0 `ToolRail orientation`) · card 36,412,318 · the glyph pill; the menus fold into the capsule's ▾ (FXR … Help as levels). `_tmp/2026-11-05-float-editor/w2/sbs-06-phone.png`. Held: his ⋮ top-right and the FILE · EDIT · VIEW · MORE capsule are not drawn (the fold replaces them).

### 2.8 — The W2 gaps, closed to his frames — ✅ built 2026-11-05
- Transform and Appearance are their own cards (19:10125 · 19:10192) on the inspector's own fields in his float look; the inspector's tabs are Design · Motion · Effects (19:10408); the open inspector leads the stack (frame 04); the phone draws his ⋮ and the menu capsule (frame 06, 19:8598).
- Acceptance: each side by side with his frame, dark, ±4 px; `pnpm check:float` 0 missing.
- Built: design-editor 0.29.0 + kol-shell 0.111.0 (`MenuBar variant="capsule"`). Transform card 320×194 = his, Appearance 320×204 = his, fields 136×32, blend 280×36, stroke 184×32; the inspector at 1256,148 with X at +112, blend at +256, stroke at +346 = his. Phone: ⋮ 338,26,36 and capsule 16,130,358,66 = his; File → ← / → walks the capsule. `check:float` 96 · 54 · 25 · 11 — missing 0. `_tmp/2026-11-05-float-editor/w2b/` (sbs-cards, sbs-04-object-inspector, sbs-06-phone). Decided for review: Parameters' Generate · Style sit in Design and its Animation is Motion; what his Design tab has no field for (align, origin, skew, flips, corners, the lock, text resizing) keeps its controls in a Geometry pane under it; Transform and Appearance step out while the inspector is open (frame 04 draws neither); Scale is a one-shot factor about the anchor (reads 100 again); the phone's ⋮ holds the FXR menu and Help.

## W7 — Generator windows (Generate · Repeat · Type)

Raised 2026-11-05: his frame 12:2282 ("Stripe Array · Generate", 912 × 688) and the window spec he wrote for fxr's plan 53 (Generate: header, Field, Ramp, Mask, Warp, Randomness, Frame, per-style sections; Repeat: radial, grid, mirror; Type: Paratype letter), kept in `_tmp/2026-11-05-generator-windows/spec.md`. *"this has to be built, its for FXR EDITOR and the style generator tool"*. Two owners holds: the window and its controls are KOL parts fxr can take from the packages; the plan-53 engine additions (ASCII, lights, conic, image, flow, stipple, the Repeat engine) are fxr's code.

### 7.1 — The settings window — ✅ built 2026-11-05
- His frame 12:2282: a header (title, kind, preset select, close), a section list on the left (name plus a one-line state: "Radial", "48 rows", "Off"), the body, a preview column (live preview, size, field map strip), and a footer (Live preview toggle, Reset, Cancel, Apply).
- Find the shipped window first (the float Windows parts, kol-component's modal and window parts); extend it, never a second window.
- Acceptance: side by side with 12:2282 at 912 × 688, boxes ±4 px, dark; the section list switches the body (Playwright).
- Built: kol-component 0.343.0 `Dialog variant="settings"` (the shipped Dialog, a new variant). 880×656; header 60, preset 650,17,158,28 (his 650,16), nav items 9,107,139,45 every 51 (his 8,106,140,45), body at 181,115 (his 180,114), cells 197 two-up 12 apart, aside 607,85 (his 608,84), footer 60. Click and ↓ switch the body (field → style → mask). `_tmp/2026-11-05-float-editor/w7/sbs-7.1-generate.png`. Decided for review: the Style select and Expand sit left of his preset select; the one-line description sits in the preview column.

### 7.2 — The controls the spec needs — ✅ built 2026-11-05
- The A→B ramp row (value A, curve select, value B), the range slider (two handles), the XY point pair, the lights list (rows: position, radius, intensity, delete), and the field-map strip. Slider, segmented, select, toggle, colour and text come from what ships.
- Acceptance: each control on its parts page in apps/float plus a showcase preview; keyboard works on each (Playwright).
- Built: kol-component 0.343.0 `Settings*` (molecules/SettingsControls.jsx), each a shipped control dressed: SettingsRamp (+ RampHead), SettingsRange (the dual Slider), SettingsPoint, SettingsLights, SettingsFieldMap, plus Group · Grid · Cell · Slider · Select · Segmented · Toggle · Text · Disclosure. apps/float Windows › "Dialog settings" and "Settings controls"; showcase previews SettingsRamp · SettingsRange · SettingsPoint · SettingsLights · SettingsFieldMap and Dialog's `settings` variant. Keyboard (Playwright, `w7/keys.mjs`): slider → 50, range → 0.21, point ↑ → 0.51, text, toggle Space, ramp A ↑, curve Enter, Add / Delete light Enter, section ↓, segmented →, disclosure Enter.

### 7.3 — Generate, wired — ✅ built 2026-11-05
- Every section and per-style group from the spec, wired to the design-editor generator params that exist today in the KOL copy. A control whose engine param doesn't exist yet renders disabled and is listed as fxr's.
- Acceptance: a script lists the spec's controls against the rendered window, 0 missing; changing Count on Stripe Array changes the live preview (Playwright, before and after pixels differ).
- Built: design-editor 0.29.0 `editor/generate/` — `windows.js` (the spec as data, his names) + `GeneratorWindow.jsx`, Tools › Generate…. `w7/check-spec.mjs`: Generate spec 109 names · data 109 · rendered 109 — missing 0. Count 48 → 28: preview pixels differ. Wired on the KOL copy's engine (the pattern loop's stripes): Direction, Count, Angle, Offset, Width A, Wave height A, Ink, Ground, Style, Preset (the stripe presets); 122 rows disabled, fxr's.

### 7.4 — Repeat and Type windows — ✅ built 2026-11-05
- Repeat (mode tabs radial, grid, mirror; source picker; the per-mode controls) and Type (Glyph, Metrics, Weights, Expressive), on 7.1's window.
- Acceptance: both windows open from the float editor's menus; spec controls 0 missing.
- Built: Tools › Repeat… and Tools › Paratype letter… open both; Repeat spec 20 · rendered 20, Type 18 · rendered 19 (Expand) — missing 0. Type is wired whole (the Paratype glyph loop, live preview); Repeat has no engine in the copy — the mode tabs switch, its rows are fxr's and Apply stays off. `w7/live-7.4-repeat-type.png`.

### 7.5 — To fxr — ✅ filed 2026-11-05
- One lobby ticket to kol-fxr: the window and controls are published (versions, names), and here is the list of plan-53 params the UI already shows disabled.
- Acceptance: ticket filed; the lobby lint is clean.
- Filed: `GeneratorWindowsFromDS` in kol-fxr's lobby (kol-component 0.343.0, the parts by name, the disabled params by section); receipt in `lobby/outbox/`; `lobby --lint` clean.

### 7.6 — fxr's engines in the KOL copy (go 2026-11-05)
- His word: *"its not just repeat they did both style generator tool and this repeat tool. Im ok with you napping it over"*. fxr's `src/generate/` copied verbatim into design-editor; Generate and Repeat wired to it.
- Acceptance: the spec's controls 0 disabled; each of the 8 styles changes the preview; Repeat mirror and radial draw copies (Playwright).

### 7.7 — Bottom dock, anchored search, one search style — ✅ built 2026-11-05
- His frame `float-more` 30:914: a horizontal tool dock with a ⌘K pill, and the search panel anchored above it (All · Actions · Tools · Pages; Recent; Pages; ↑↓ Navigate · ↵ Run · Esc Close). His words: *"bottom dock and anchored search (along with same style regular search)"*.
- The dock is the horizontal ToolRail (real tools, each with its ▾ for more, then hand, undo, the ⌘K pill), placed by a rail-or-dock option on the float editor, with the dock as the phone default. The anchored search is CommandOverlay attached to the dock, on one surface with it (his darker version); the footer rule runs full width.
- The regular centred ⌘K search modal takes the same look (tabs, groups, key hints), so there is one search style everywhere.
- Acceptance: side by side with 30:914 within ±4 px, dark; ⌘K opens the anchored form when the dock is on and the centred form otherwise, with the same rows; ↑↓, ↵ and Esc work (Playwright).
- Built: kol-component `CommandOverlay` is the float card everywhere (`surface` defaults solid; new `tabs`, `anchor`, `shortcutHint`, row `tab`/`tabOnly`; the foot ↑↓ Navigate · ↵ <verb> · Esc Close · ⌘↵ under a full-width rule; the field ringless) — the showcase ⌘K and AppHub take it unchanged. kol-shell `ToolRail` horizontal gets a tool's `more` (its ▾, the list above, the slot shows the armed member), `end` and `search` (the ⌘K pill). design-editor `FloatCommandSearch` (Actions = every menu-bar leaf, Tools, Pages; Recent) + View › Tools › Rail / Dock; the dock is the phone default. Live (1600 dark): dock 466,1032,668,64; card 466,553,668,463 = the dock's left and width, 16 over it; Rail → centred 512,224,576; Tab steps the tabs, Enter runs, Esc closes; 390: dock 16,636,358,72, card 16,140,358. `_tmp/2026-11-05-overnight/7.7/` (his frame `frames/user-5067-2.png`, from the chat — Figma was shut). Held: rows and slots are the float tokens (40, 48 on touch) — his 48 / 52 are the touch tier, so desk reads 8 smaller than his frame; the tabs' lit pill is the float selection (fg-16), his is darker; the phone dock holds his row's first five (Pattern is in ⌘K's Tools); the mode switch moves to left 24 while the dock is up.

## W3 — Labs in float style

Source today: apps/labs mounts design-editor's `LabsView` (LabsNav, LabsParams, LabsSourcePicker, catalog) in AppShell. His Labs reference is section 1:3895: the KOL LABS rail (Color, Effects, Generative, Morph, Vector, Composition, each opening its list) and the settings Rail on the right. No float frame for Labs exists, so it takes the float editor's chrome: the same rule as W1–W2 (the design is the source; decide small things).

### 3.1 — Labs, two ways, side by side — ✅ built 2026-11-05
- His words: *"we might also want floating nav for labs. we have to see both to know"*. Build both on the same Labs state, switchable live on one route:
  - **A, editor chrome:** the menu bar, the document capsule, and the Labs categories as a float Rail on the left.
  - **B, floating nav:** no menu bar; the Labs categories (Color, Effects, Generative, Morph, Vector, Composition) live in a floating nav (the float layout's nav with flyouts, his earlier mode menu: Effects ›, Generative › …); commands move into the capsule's menu.
- Both share the params Rail (7.6's float-styled shell) on the right, the transport, and the mode switch. LabsView stays untouched.
- Acceptance: one Labs route in apps/float with an A/B switch; in both, every LabsNav category and every LabsParams control renders (script, 0 missing); picking an effect changes the canvas (Playwright, pixels differ); screenshots of A and B at the same state, desk and 390, dark.
- Built: design-editor `FloatLabsView` (`editor/labs/FloatLabs.jsx`, `variant` editor | float) over one EditorProviders, so the switch keeps the patch; apps/float `/views/float-labs` with the A · B switch (float TabsRow, bottom-centre). A: MenuBar (FXR · File · Edit · View · Help), capsule + breadcrumb, the catalog as a NavRail float with every section open. B: NavRail float collapsed, each section's groups in a RailFlyout on hover, the commands in the capsule's ▾. Both: PropertyRail (352) holding LabsParams and the Transport · Output · File foot, the transport, GlobalActions, the mode switch. `3.1/accept.mjs` → `accept.json`: categories 31 (LabsNav's catalog stream) — missing A 0, B 0, desk and 390; LabsParams controls A 50 = B 50, 0 missing either way; Flow picked in A and Drift in B each change the canvas. `_tmp/2026-11-05-overnight/3.1/` (A-desk, B-desk, A-390, B-390, sbs-A-B-desk, sbs-A-B-390, B-desk-flyout). No float frame for Labs exists — built from this plan's description. Held: the phone drops the transport float (378 over a 358 column; the Rail's foot has Transport); B's phone params sit beside the 72 nav at 274; the Labs draft key is LabsView's, so both chromes open the same patch.

### 3.2 — His pick — ✅ ruled 2026-11-06
- He looks at A and B and rules; the other goes to `_tmp/`. Randomiser and Morph follow the pick.
- Ruling: *"neither is using float correctly"* — both hand-placed a NavRail; A and B were FloatLayout's own expanded and collapsed Rail. Agreed fix: Labs on kol-shell `FloatLayout`.
- Built: `FloatLabsView` on FloatLayout (push Rail) — catalog as nav Rail (expanded with every section open · collapsed with flyouts · hidden), bar start capsule (commands in ▾) · centre Transport (desk only) · end GlobalActions, LabsParams PropertyRail 352 in the inspector slot (⇥ hides, Panels ▾ restores), AppFloatNav in `bottom`. `variant` prop and the A · B switch dropped. Checked live at 1600: expanded, `\` collapsed, an effect picked fills the params. W4 Randomiser and W5 Morph build on this frame.

### 3.3 — The mode switch moves between them
- The bottom-left mode switch (Editor · Labs · Randomiser · Morph) switches views inside apps/float, keeping the open document.
- Acceptance: Editor → Labs → Editor keeps the layer count and the selection (Playwright).

## W4 — Randomiser in float style

His words: *"randomiser literally is the same as labs, just simpler chrome"*. It is the phone view.

### 4.1 — Randomiser on Labs' float chrome, simpler
- The float Labs view with the reduced chrome Randomiser has today: shuffle and keep, no category Rail, the dock from 7.7 at the bottom, phone first (390 × 844) and desk second.
- Acceptance: every control apps/randomiser has today exists here (script, 0 missing); shuffle changes the canvas; side by side at 390 with today's randomiser shows the same functions.

## W5 — Morph in float style

His words: *"the odd one out is morph as it morphs randomiser or labs patches"*. Source: design-editor's `morph/` (MorphTab, StepPicker, morphStore); his frame in 1:3895 shows Morph as a settings Rail (Shape · Blend · Crossfade tabs; type, category, preset; steps; curve, cycle, sync loop; resolution) and a timeline with its steps.

### 5.1 — Morph on the float chrome
- The morph settings become a float Rail (7.6's shell) with his tabs; its steps sit on the float TimelineRail; the source patches come from Labs or Randomiser saves.
- Acceptance: two steps from saved patches play as a loop (recorded at 30fps, watched); every MorphTab control renders (script, 0 missing).

## W6 — Figma (library n48kE2bJtrFjl7wxst30xH)

### 6.1 — Masters for what W1, W2 and W7 shipped — ✅ built 2026-11-06
- On Components, measured from the built code, dark, with Code Connect: MenuBar (closed and open-menu states), the float card (tabs, folded, foot, window radius), ToolRail `more` and horizontal, the settings Dialog variant, the 15 Settings* controls, the float-styled tool Rail (PropertyRail extension), the text context toolbar, and the object inspector tabs.
- Acceptance: audit.js 0 errors; `figma connect publish` succeeds (fix the two stale mappings first: Rail node 14:9 missing, LayerStackRow pointing at a variant).
- Built: section `float-editor masters` 1032:26011 on Components — MenuBar set 1032:26160 (state closed · open with File › Export), FloatTextToolbar 1032:26012, CardInspector 1040:26166, the 15 Settings* 1035:26021–26232; extended in place: Card 563:19118 (+radius=window, open + folded), ToolRail 569:19820 (+orientation, more), PropertyRail 571:20146 (+density=compact, the generator Rail), CommandOverlay 744:24387 (+tabs, anchor: centred + anchored), Dialog now a set 1043:26465 (float · settings 880×656). Measured live on /views/float-editor and /parts/windows, dark, colours all bound but layer swatches. Code Connect: Rail → 54:301, LayerStackRow → 824:68319, 21 new files, 5 updated; publish exit 0. Audit 0 errors (473 instances, 0 unlinked). Side by sides `_tmp/2026-11-06-float-masters/sbs-*.png`. Held: inner controls are drawn, not instances of Button/Dropdown/Slider; the inspector's corner-radius slider and the align group's dividers are missing; /parts/windows' Dialog settings preview squeezes its body (code).

### 6.2 — The float editor screens in the library — ✅ built 2026-11-06
- A ↳ Float editor section on the ↳ Float page: frames 01–06 as built (default, menu open, text tool, inspector, timeline, phone) plus Generate/Repeat/Paratype as dialog and as Rail, all from instances.
- Acceptance: each frame side by side with his 7K5v68l4tblHPFuiLdokRu frame within ±4 px; 0 loose nodes; audit 0 errors.
- Built: section ↳ Float editor 1056:45186 on ↳ Float (dark), 12 screens, each an instance of the new slotted layout master FloatEditorShell 1055:26466 (desktop · desktop+timeline · phone; slots `cards` and `stage`), slots holding only instances (Card window, CardTypography, CardInspector, FloatTextToolbar, SelectionMeasure, Dialog settings, PropertyRail compact, GeneratorWindow). New masters measured live: CardTypography 1051:26229, GeneratorWindow 1055:26279 (Repeat · Paratype letter × dialog · rail), MenuBar +variant=capsule 1051:26341. Audit 0 errors, 0 loose, 0 unlinked. Chrome and cards match the live route to the pixel; against his frames only 01 (Section 5) and Generate share the layout, his 03–06 are the older Section 4 placement. `_tmp/2026-11-06-float-screens/sbs-*.png`. Held: the breadcrumb master draws mono, live is sans (~30 px wider); the Timeline master is the expanded 220 one, live shows it collapsed (79); CardInspector is 6.1's 1196 tall with rectangle-layer rows (live text layer 818); the Layers card shows Canvas only (live adds the New text row); the canvas artwork and the dialog scrim are not drawn; the Paratype preview glyph is a placeholder.

### 6.3 — Dock, search and Labs A/B — ✅ built 2026-11-06
- The dock, the anchored and the centred search, and Labs A and B as library frames, so he can compare them in Figma too.
- Acceptance: as 6.2.
- Built: section ↳ Float search + Labs 1066:13484 on ↳ Float (dark, below 1056:45186): 01 Dock 1066:13485, 02 Search anchored 1066:13862, 03 Search centred 1066:14398, 04 Labs A 1066:14893, 05 Labs B 1066:15292, each one layout instance with CommandOverlay / TabsRow in its stage slot. FloatEditorShell gets `tools` rail · dock (new variant 1063:26952, the horizontal ToolRail at 466,1032, modes at 24); new slotted master FloatLabsShell 1065:27997 (variant editor · float, slot `stage`; NavRail float expanded with the 31 catalog rows / collapsed with the 6 glyphs, the params Rail with SegmentedToggle + TransportBar), Code Connect `figma/FloatLabsShell.figma.js` → FloatLabsView, publish exit 0. Boxes vs live (dark, 1600): every part within 2 px except the A breadcrumb (+10 wide, the mono master). Audit 0 errors, 0 loose, 0 unlinked. `_tmp/2026-11-06-float-labs-ab/sbs-*.png`. Held: Labs shown at its empty state (no effect picked, LabsParams empty); the CommandOverlay master's lit row is 564 wide (live full width); the transport capsule and TransportBar masters light play, live lights pause and loop; the centred screen's rail is 6.2's 412 master (live 360); no phone frames; the params Rail is drawn inside the layout master (PropertyRail's compact variant is the Generate rail with no slot).

## Overnight queue (2026-11-05, his word: "put figma work in the plan so I can set you on and go to bed")
1. Code, now: 7.7 → 3.1 (A and B) → the two showcase bugs found today (⌘K quick list shows one icon row; the icon gallery leaves its first slot empty). — ✅ 2026-11-05: 7.7 and 3.1 above; the bugs — ⌘K: the engine breaks a tied score alphabetically, so the flat cut of 12 gave `Chess …` rows every slot the chess icons tied with; inside one score the groups now take turns (kol-workshop 0.45.0 `quickList`; "chess" shows 3 Games rows, "arrow" unchanged). Gallery: IconBrowser put its null-rendering `ShownRows` reporter inside ContentCollection, which wraps every child in a grid `<li>` — moved beside the wall (kol-styleguide 0.22.2). Published: kol-theme 0.214.0, kol-component 0.344.0, kol-shell 0.113.0, kol-workshop 0.45.0, kol-styleguide 0.22.2, design-editor 0.31.0.
2. Figma, from the reset at 00:00: plan-2026-11-04 12.8 rest (run `_tmp/2026-11-05-w12-8b/calls/PENDING-1-media-08-09-overlay-repair.js` first, then `_tmp/2026-11-05-w12-8b/NEXT.md`) → plan-2026-11-05-icons 2.1 close (audit + screenshots) and the wordmark duplicate (retire `wordmark/kolkrabbi`, file `wordmark/voyager` in its identity frame) → 6.1 → 6.2 → 6.3.
3. Stops at: 3.2 (his A/B pick); W4 and W5 wait on it.

## Decided for review
- 1.1: the menu bar is Section 5's reworked one (FXR · File, Edit, Layer, Text, Vector, Tools, View · Help right).
- 2.7: on the phone the menu bar folds into the document capsule's menu.
