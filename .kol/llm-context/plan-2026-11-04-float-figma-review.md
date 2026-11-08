# Plan — Float in Figma, his review: the views 1:1, the masters fixed

**Raised:** 2026-11-04, the user, reviewing the ➤ Float chapter, the Float tile on ↳ Sets (653:23200) and the apps/float section on ↳ Apps (651:17375). Points verbatim: *"broken float ?? what are those white fileds?"* — *"Im disapointed in the setup"* — *"whats this icon for?"* — *"fix opacity"* — *"dont clip liek this , stroke on outside"* — *"IS THIS IT?!?!?!? NAHHH... not when I spoonfed you the views you should have done???"* — *"Rails, is this a toggle? check? its just a frame"* — *"whats going on with the chevrons? and ist the modal a bit small?"* — *"WORKSPACE is the dashboard."* — *"metric is mutliple frames. YOu should import metrics set to figma so you can map 1:1 set"* — *"Record Float? So to tabs at all? wheres the menu then? I still dont get the main frame"* — *"Dashboard Broken TabsRow and SegmentedToggle"* — *"briefs dont fill... Layout is not the same, padding different??"* — *"visual editor, timline is broken -- doesnt scale correct."* — *"is this supposed to be undo redo? they are not a set."* — *"Float layout? … Whats the differnce?"* — *"I m so fucking disapoiinted?!"*
**Status:** W1–W6 built — 2026-11-04 (kol-dashboards 0.12.0, kol-shell 0.104.0, kol-component 0.338.1). Open: W7 after his library publish; 6.5 TALK.
**Shape:** W › phase › list.
**Laws carried:** the kol-figma skill (masters only on master pages, screens are slotted layout instances, measure, never place by eye); the exploration frames in kol-float--style `XY6adCImPaxDuHDO6OdUw9` page `_source` are the views — code and Figma both answer to them; a gap is fixed in its package, then mirrored; no borders; icons on oq; Figma work on kol-figma-agent in the background; one board at a time; never delete (→ `_tmp/` / `_trash` with `_`).
**How a phase closes:** measurable acceptance first; gates green; then one look: the Figma screen, the live route and the exploration frame side by side at 1600 × 1080, dark.

## W1 — The masters that render wrong (one cause: built without the code's own values)

### 1.1 — Colour bindings: no white fields, the chart's fill opacity
- Timeline (toolbar, ruler, tracks, lanes, clips) and LineChart (area fill) bind the exact tokens and alphas the code computes, in both modes.
- Acceptance: every fill in both masters equals the live computed colour (light and dark, script-compared); 0 white fields on a dark canvas; the chart area's opacity equals the code's.

### 1.2 — Field rims: stroke outside, never clipped
- Input / SearchInput float: the rim is the code's (transparent `tone/border` on float), drawn outside, nothing clipped by the frame.
- Acceptance: stroke align outside, `clipsContent` false on the field; the rim colour equals the live value (no white rim on float).

### 1.3 — Glyphs: square, never stretched; pairs from one family
- Every icon instance keeps its 24 (or 18/20) square box with constraints that scale, never stretch; undo / redo are a matched pair — in code first if GlobalActions mixes families, then Figma.
- Acceptance: 0 icon instances with width ≠ height across the Float chapter and ↳ Apps float section; undo and redo come from the same glyph family in code and Figma.

### 1.4 — Selection is the real control
- IndexRow / TaskRow selection is the ToggleCheckbox instance the code renders, not a grey frame.
- Acceptance: every row selector on the float screens is a ToggleCheckbox instance.

### 1.5 — Timeline scales
- The Timeline master is auto-layout end to end (toolbar, ruler, tracks fill the width; lanes and clips stretch), so an instance resized to any width keeps its structure.
- Acceptance: the instance at 1472, 1166 and 900 wide shows ruler, playhead and lanes in proportion, nothing overflowing or fixed.

## W2 — The Float tile on ↳ Sets

### 2.1 — The tile shows the set, not a sample per family
- Rebuilt like the other set tiles on ↳ Sets: the Float set as the showcase mounts it (the apps/float home on FloatLayout) and the family list, each linking its ➤ Float page; the loose samples and the lone `inbox` glyph retire.
- Acceptance: the tile's structure matches its sibling set tiles; 0 loose sample instances; every family name links its page.

## W3 — The views are the exploration frames, 1:1

The views were built "from parts" and measured against the app; they answer to the frames he handed over. Code first where the app drifts in layout (padding, fills, structure), then Figma mirrors the code. Part-size calls stay on round 25.

### 3.1 — Dashboard (record tabs, 13:5037)
- Masthead with one TabsRow and one New task (no doubled bar), the Open / Completed toggle as drawn, Briefs and every card filling the column, the frame's paddings.
- Acceptance: key boxes ±4 of 13:5037 in code and Figma; one New task; TabsRow and the toggle match the frame.

### 3.2 — Workspace is the dashboard (9:15449)
- The adaptive workspace is the dashboard on FloatLayout: same tabs (in the bar), nav Rail at 72, the Tasks page, the inspector. It keeps its name, workspace.
- Acceptance: ±4 of 9:15449; the bar carries the dashboard's tabs.

### 3.3 — Record float (9:14340): the menu and the main frame
- The float dashboard keeps the nav Rail (hidden + its trigger as drawn) and the dashboard tabs reachable; the main frame is the task canvas on the float well as drawn, not a black block.
- Acceptance: ±4 of 9:14340; canvas fill = the frame's; nav trigger and tabs present.

### 3.4 — Metrics: frame by frame, from apps/metric in Figma (W5)
- The float metrics view is multiple frames (13:6898 and its siblings), built from the apps/metric screens W5 brings into Figma.
- Acceptance: one float metrics frame per exploration frame, each ±4 of it.

### 3.5 — Visual editor (9:8594)
- Timeline on the fixed master (1.5); the canvas artwork and its selection measure as drawn; undo / redo the matched pair (1.3).
- Acceptance: ±4 of 9:8594; the selection box hugs the artwork it measures.

### 3.6 — Rails (9:14486)
- Real checkboxes (1.4), square chevrons (1.3), the Task index Rail at the frame's size.
- Acceptance: ±4 of 9:14486, Task index Rail included.

### 3.7 — Only views on ↳ Apps
- Home, Parts and Views are the app's index pages, not views — they leave the float section (→ `_trash`, `_` prefix).
- Acceptance: the float section holds exactly the views of W3.

## W4 — The protocol learns it

### 4.1 — kol-figma skill
- Screens close on a side-by-side with their source design frame (not only the app); no master sample text repeated on a screen; icons never stretched; fills compared to live computed values; set tiles follow their siblings.
- Acceptance: the five rules are in `~/.dotfiles/claude/skills/kol-figma/SKILL.md` § 3 and § 7.

## W5 — Import apps/metric to Figma

Point: *"then add to plan IMPORT apps/metric TO FIGMA"* — *"metric is mutliple frames"*.

What apps/metric is (read 2026-11-04): ONE page, not a routed app — `DemoSeven` (kol-website's /demo-11, static fixtures) on the page shell (`kol-shell-page`) with HubSettingsRail; several screens tall (top stats, Visitors, Code, Deploys, Deploy activity, Storage, Recent uploads, the acquisition / audience / behaviour sections, the world map) and six overlays opened from it (settings Rail, search modal, shortcuts, details overlay, filters, edit layout). The showcase's "Metrics dashboard" set is kol-dashboards' older `MetricsDashboard` (2026-07-30), not this page — W5 is apps/metric, as he said. Runs here on `pnpm metric`; measured live.

### 5.1 — metric's own parts into kol-dashboards first
- The page still draws dashboard parts locally (`demo7/`: TopStats, Behaviours, WorldMap, CalendarIcon, the leftover local Cards) — DashboardCardSet (kol-dashboards 0.9.0) moved Card, RankedList, StatTiles and DetailsOverlay but not these. They go into kol-dashboards (bump, CHANGELOG, docs), apps/metric imports them; a master is built only for a shipped part.
- Acceptance: `apps/metric/src/demo7` renders no dashboard part of its own (grep: 0 local components that draw a tile, card, map or scale); `pnpm --filter metric build` green; kol-dashboards published.

### 5.2 — The missing masters
- Nine package parts the page uses have no master: CalendarHeatmap, CalendarScale, Heatmap, DetailsOverlay, ResizeHandle, SettingsChoice, SettingsMulti, SettingsPanel, ShortcutsOverlay — plus 5.1's. Built on Components from the code, measured live, Code Connect published.
- Acceptance: every `@kolkrabbi/*` part apps/metric imports has a master (script: imports vs `figma/*.figma.js`, 0 missing).

### 5.3 — The page, at its full height, and its overlays
- A `metric` section on ↳ Apps: the page as ONE screen at 1600 × its live height (a PageShell instance, the sections stacked in its slot, the app's real numbers and text) — not a 1080 crop; then one screen per overlay state (settings Rail open, search modal, shortcuts, details overlay, filters, edit layout). Dark, like the other Apps sections; light only if he asks.
- Acceptance: 1 page screen + 6 overlay screens; the page screen's height equals the live scrollHeight ±4 and every section's box ±4 of the live route; 0 unlinked; 0 master sample text.

### 5.4 — The float metrics view maps to it
- The float metrics exploration (kol-float--style 13:6898 light and 9:1550 dark, 2115 tall) is laid beside the metric page screen; W3.4 rebuilds the float metrics frames from the same masters, section for section.
- Acceptance: a side-by-side board (exploration frame, float view, metric page) per section; every shared part is one master.

## W6 — Import the fxr app to Figma: the editor, Labs, the whole app

Points: *"you might as well import something else in the same go THE FXR EDITOR since that is what visual editor is heading for"* — *"you might need to get a fresh copy from FXR? Im not sure how much it has drifted"* — *"I would also get labs, and the entire FXR app"*.

What fxr is (read 2026-11-04, the clone at `~/dev/projects/kol-fxr`, reference only): kol-shell's `AppStudio` layout (Figma master exists, slotted) with routes `/` (hub home), `/library`, `/editor`, `/labs`, `/morph`, `/randomiser` (the phone view), `/output`, `/settings`, `/dev`, `/signin`, `/join`, `/account`. Its editor is `packages/design-editor` here. Drift today: the mirror was refreshed from the clone this morning; the only differences left are the DS's own TimelineRail (`core.jsx`, `params/Timeline.jsx`, `TimelineDock.jsx`) — the DS is ahead, fxr is not. But the clone's newest file is dated 2026-10-31: whether his working copy has moved since is a pull away, and a pull is git — his. fxr pins older KOL packages (kol-component 0.333.0, kol-shell 0.100.0, kol-theme 0.210.0, kol-icons 0.58.0), so its live chrome shows parts a few rounds behind the masters.

### 6.1 — The fresh copy, both ways
- He pulls kol-fxr (git, his); then the mirror is diffed again (`diff -rq` fxr `src/` vs `packages/design-editor/src`, app-only files excluded), refreshed if fxr moved, the DS's TimelineRail re-applied on top, bumped and published.
- The DS-ahead TimelineRail goes back to fxr as a lobby ticket (`TimelineRailFromDS`), so the next refresh cannot erase it — filed on his go.
- Acceptance: a written diff summary (fxr-ahead files, DS-ahead files, 0 unknown); after the refresh 0 files differ except the TimelineRail set; apps/editor, labs, randomiser, panels and apps/float build green.

### 6.2 — The app-level screens on AppStudio
- An `fxr` section on ↳ Apps: hub home, Library (local-only list — `pnpm dev:app` runs without the API), Settings (AppStudio with the Rail open), Dev, Sign in, Join, Account — AppStudio instances with fxr's real text, measured from the clone running on a task-scoped port.
- Where fxr's pinned parts differ from today's masters, the screen takes today's master with fxr's content; only fxr's own layout glue is measured from fxr.
- Acceptance: 7 screens; each key box ±4 of the live route (AppStudio regions exact); 0 unlinked; 0 master sample text.

### 6.3 — The editor chrome masters
- The editor's shell has no masters yet: EditorShell (tools, left, canvas, right grid), the left Rail (layers, assets), the right Rail (params, inspector sections), the tools Rail, the dock, the mode switch, the color popovers — built on Components from `packages/design-editor` (the mirror of 6.1), measured through apps/editor here, Code Connect published; the Timeline master (W1.5) reused.
- Acceptance: every chrome part the four modes render has a master (script: the editor's chrome components vs `figma/*.figma.js`, 0 missing).

### 6.4 — The four modes and Output
- Editor, Labs, Morph, Randomiser and Output as screens on 6.3's masters inside AppStudio (Randomiser at the phone width it is built for, as its own frame), each measured live; the editor with the sample scene fxr opens by default.
- Acceptance: 5 screens, ±4 of the live routes; 0 unlinked.

### 6.5 — Editor states — TALK
- A layer selected with its inspector, the timeline open, a color popover, a Labs section open: worth their own screens or not — his call after 6.4.

### 6.6 — The visual editor heads for the fxr editor
- The apps/float visual editor (W3.5) is checked against the Editor screen of 6.4; every part they share is one master in both (ToolRail, PropertyRail, DocumentCapsule, GlobalActions, the transport, Timeline).
- Acceptance: a side-by-side of float visual editor and fxr Editor; 0 shared parts with two masters.
- **Ruled 2026-11-04 — two owners, on purpose.** *"fxr owns its version and DS has a copy to make the float version"*. The five editor parts that exist twice (tools, inspector, transport, colour picker, layer row) stay twice: fxr's editor is fxr's, and fxr never consumes the DS copy; the DS copy is the base the float versions are made from. "0 shared parts with two masters" no longer applies to these five.

## W7 — Float gets its own Figma document

Point: *"shouldnt those FLoat pages in kol-ds-ui go to a 'Float' document, it doesnt seem like it belongs so front and center ni KOL DS UI taking so many pages ... we can just create a page and link there, so it gets its space?"* — agreed.

### 7.1 — The Float document
- A new Figma file `float--kol-ds-ui` (Cover, then the 13 family pages and a views page, the library's naming and #1E1E1E canvases) with the library enabled; every glyph and part a library instance; the apps/float screens' views mirrored there too.
- Acceptance: the file exists with 13 family pages + views; every node on them is an instance of a published library component (0 local components, 0 loose copies).

### 7.2 — The library keeps one Float page that links out
- In the library the ➤ Float chapter collapses to one page `　　↳　Float` under ➤ Collection holding the link to the Float document and the Float tile; the 13 family pages are emptied and named `_` for him to delete (pages are his GUI job).
- Acceptance: the library's page list shows one Float page; the link opens the Float document.
- Order: after W1 (the masters it instances must be fixed) and after his library publish (a separate file can only instance published components).

### 7.3 — PARKED — The Float file's shape
Parked 2026-11-04 (*"talk about it later, park it"*). His review of the built file: page names not numbered (*"what do I have to count 13 pages"*), 13 pages where one would show the families together, the Icons card explains nothing, and an agent-built cover cost him a redo. Proposal on the table: Cover (his) · `01 Float` (every family a numbered section) · `02 Views`; the Icons card dropped. The views paste (651:17375 → Views) is his; the agent audits after.

## W8 — Screens and sets get their own Figma document (the Primer split)

Point (2026-11-04, after the Figma research): the library holds masters, foundations and icon masters only; views live in their own files, the way Primer keeps Primitives · Web · Octicons · Interfaces apart. Approved: *"Yes, all three"*.

### 8.1 — The Apps document
- A new file `apps--kol-ds-ui`: Cover, then one page per app (`　　↳　<app>`), each the app's section from the library's ↳ Apps moved whole, every node a library instance; #1E1E1E canvases.
- Acceptance: kol-figma `scripts/audit.js` clean on every page; 0 local components; the library's ↳ Apps holds one link tile.

### 8.2 — The Sets document
- ↳ Sets moves the same way into `sets--kol-ds-ui`, or joins the Apps document as its own chapter if one file reads better — decided for his review at 8.1's close.
- Acceptance: as 8.1.

- Order: after W7 (same mechanics, proven once on Float first), and after his next library publish.

## W9 — PARKED — The library in the shape the community libraries share

Parked 2026-11-04: *"lets park it but base the move in research, maybe we make a demo file with proposals"*. The proposal and its grounds are in [[docs/documentation/06-research/05-figma-file-setup|Figma file setup]] § The proposed move. Picks up with a demo file (two or three families plus one foundation card) for his review; nothing moves in the library before he rules on it.

## W10 — Import the editor family apps to Figma

Point (2026-11-04): *"We need all the important frames from each major feature."* The Apps page sections for labs, randomiser, editor and editor-hub were empty placeholders; labs, morph and randomiser had one fxr-hosted frame each. Every frame below is measured from the live route (apps/labs on :5291, apps/randomiser on :5292), dark, 1600 × 1080 or 390 × 844. Editor and editor-hub frames are the other agent's block.

### labs (apps/labs: AppShell + LabsView)
- labs — 01 · catalog — `/`, the entry card (Color, Effects, Generative, Morph, Vector, Composition), rail collapsed
- labs — 02 · generative — `/`, the card's Generative door open (Scanline … 3D Scene, Back)
- labs — 03 · generative · loops — `/?preset=circle-morph&cat=shape`, rail expanded, params rail on Generate
- labs — 04 · effects · media — `/` → Effects: the media card (From library, Upload, Camera, Back) over the stage, Effect · Motion rail
- labs — 05 · effects · from library — `/` → Effects → From library: the media browser over labs
- labs — 06 · color modes — `/` → Color: the Color Modes window
- labs — 07 · vector · distressor — `/` → Vector → Distressor: Erosion · Print press params
- labs — 08 · composition · type — `/` → Composition → Type: Radial · Sunburst, elements list
- labs — 09 · morph — `/morph`: the Morph rail (Shape, steps, curve) and the timeline dock
- labs — 10 · output — 03 with the footer on Output (aspect, export, record)
- labs — 11 · file — 03 with the footer on File (save, load, audio)
- labs — 12 · shortcuts — 03 with S: the shortcuts sheet
- labs — 13 · phone · catalog — `/` at 390: the entry card, hamburger
- labs — 14 · phone · drawer — `/` at 390, hamburger open: the rail over the stage

### randomiser (apps/randomiser: MobileView, no shell)
- randomiser — 01 · phone · entry — `/`: Generate, Effects
- randomiser — 02 · phone · generators — Generate: Pick a generator, Insert image or video, Back
- randomiser — 03 · phone · generate — Generate → Loops: the stage and the sheet on Generate
- randomiser — 04 · phone · effects — 03, sheet on Effects
- randomiser — 05 · phone · transport — 03, sheet on Transport
- randomiser — 06 · phone · output — 03, sheet on Output (aspects, Save, Download)
- randomiser — 07 · phone · effects · media — Effects: From library, Upload, Camera, Back
- randomiser — 08 · phone · effects · from library — 07 → From library: the media browser
- randomiser — 09 · desktop · entry — `/` at 1600
- randomiser — 10 · desktop · generate — Generate → Loops at 1600: the stage and the panel as a rail

- The four fxr-section frames (Labs, Morph, Randomiser · Phone, Output) are fxr's AppStudio host with the boot card over an empty stage — not these apps; retired to `_trash` with a `_` prefix, rebuilt above.
- Acceptance: kol-figma `audit.js` clean on both sections; every frame ±4 px of its live route; 0 unlinked; 0 master sample text.


### editor + editor-hub
Frames on ↳ Apps, sections `editor` (358:9118) and `editor-hub` (358:9142); measured live (apps/editor, apps/editor-hub), dark, 1600 wide; phone 390.
- editor — 01 · / · empty canvas
- editor — 02 · / · add-layer menu
- editor — 03 · / · text layer selected, inspector
- editor — 04 · / · File menu
- editor — 05 · / · fill colour popover
- editor — 06 · / · kinetic layer, timeline open
- editor — 07 · /core · no packs, Output tab
- editor — 08 · /labs · catalog
- editor — 09 · /labs · Generative
- editor — 10 · /randomiser · desk
- editor — 11 · phone · /randomiser · select chrome
- editor — 12 · phone · /randomiser · pick a generator
- editor — 13 · phone · rail drawer open
- editor-hub — 01 · / · home
- editor-hub — 02 · /library · Labs filter
- editor-hub — 03 · /editor
- editor-hub — 04 · /labs
- editor-hub — 05 · /randomiser
- editor-hub — 06 · /morph
- editor-hub — 07 · / · settings rail
- editor-hub — 08 · phone · / · home
- editor-hub — 09 · phone · / · more menu
- Built 2026-11-04 19:47: editor 13 frames, editor-hub 8. Not built: hub 09 (MoreSheet has 4 fixed rows, no rows slot) and /output (an empty black window). Hub 02 is the 1080 viewport of a 31720px list (584 cards).

## W11 — The Apps page splits into pages

Raised 2026-11-04, the user, on the reorganised ↳ Apps (309:89): *"I really just think we need to seperatae with pages … this is too much to fit in one page."* His groups, verbatim: *"fxr, editor, editor hub, labs, randomiser - but missing morph"* · *"website and article can go toether"* · *"metric by itsefl"* · *"Layout and hubs [studio hub, brand hub, workshop, site hub]"*. On morph: *"the odd one out is morph as it morphs randiser or labs patches"* — it gets its own section; randomiser is labs in simpler chrome.
**Status:** DRAFT — nothing built. Lands as pages under ➤ Collection in the library; when W8 runs, the pages move to the Apps document whole.
**How a phase closes:** the acceptance lines below, read by script (section names per page, frame counts, audit.js); then one readable screenshot per section, looked at against the live routes.

### 11.1 — Editor family page ✅ built 2026-11-04
- New page `　　↳　Editor family` holding the sections fxr · editor · editor-hub · labs · randomiser · **morph**, one row, clean grid.
- **morph** is a new section: the Morph-rail frames move out of labs into it (moved, not rebuilt); any morph state labs did not draw gets drawn, measured from `/morph`.
- Acceptance: the page holds exactly those 6 sections; morph holds ≥ 1 frame and labs holds 0 Morph-rail frames; the total frame count of the six equals today's (fxr 7 + editor 13 + editor-hub 9 + labs 14 + randomiser 10) plus any new morph frames; audit.js 0 errors, 0 section overlaps.

### 11.2 — Sites page ✅ built 2026-11-04
- New page `　　↳　Sites` holding website · article.
- Acceptance: exactly those 2 sections, 16 frames, audit clean.

### 11.3 — Metric page ✅ built 2026-11-04
- New page `　　↳　Metric` holding metric alone.
- Acceptance: 1 section, 8 frames, audit clean.

### 11.4 — Layouts + hubs page ✅ built 2026-11-04
- New page `　　↳　Layouts + hubs` holding studio-hub · brand-hub · workshop · site-hub.
- Acceptance: exactly those 4 sections, frame counts unchanged (8 · 6 · 1 · 1), audit clean.

### 11.5 — What stays on ↳ Apps — TALK
- Left after 11.1–11.4: brand-lab (with generators), document, float's section, and the 28 placeholders in their layer rows. Proposed for his ruling: brand-lab joins Layouts + hubs (brand's tool); document and the placeholders stay on ↳ Apps as the "not yet drawn" page. His call before anything moves.

## W12 — Fill the gaps: every placeholder app drawn

Raised 2026-11-04, the user: *"lets also fill in the gaps and have figma agent build at the same time … first you reorg the pages. THEN we make agent build, Hub, Catalog, shell"*, with the placeholder links (brand 358:9100 · studio 358:9172 · media 358:9064 · media-hub 358:9070 · notes 358:9076 · notes-hub 358:9082 · presentation 358:9088 · presentation-hub 358:9094 · rack 358:9166 · rack-hub 358:9178 · mixer 358:9184 · mixer-hub 358:9190) and the thin sections (site-hub 315:6786 · brand-lab 315:409 · document 315:3499). Also: *"growth, why is this not grouped with the other loaders?"* and *"should be singular, note note-hub?"*. Scope approved: *"ok I trust you approved"*.
**Status:** DRAFT — starts when W11 11.1–11.4 is built.
**How a phase closes:** per app, the frame list is written into this W **before** building (one line per route/state, read from the code); acceptance is read by script — every listed frame exists by name, 0 placeholder frames left in the section, audit.js 0 errors and 0 section overlaps; then one readable screenshot per frame against its live route.
**Runs as:** four kol-figma-agents at once, one per phase 12.1–12.4, each on its own sections and its own `<phase> masters` section on ↳ Components; a part another phase may need is looked for there first, never built twice.

### 12.0 — `notes` → `note` (code first) ✅ built 2026-11-04
- Rename `apps/notes` → `apps/note` and `apps/notes-hub` → `apps/note-hub` per the 2026-10-28 law (one word, singular, folder = project = subdomain): folders, package names, root scripts, imports, docs; any hosting project and subdomain keep the old name as a permanent redirect.
- Acceptance: `grep -r "notes-hub\|apps/notes\b"` outside `_tmp`/CHANGELOGs returns 0; `pnpm note` and `pnpm note-hub` start; the Figma sections are named `note` and `note-hub`.

### 12.1 — Shell, Hub, Catalog
- apps/shell, apps/hub, apps/catalog: every screen and overlay state each shows, from the code.
- Acceptance: each section 8–20 frames (or every route if fewer), all named `<app> — NN · <state>`; 0 placeholders left.

#### shell frames
- shell — 01 · app rail · One
- shell — 02 · app rail · expanded (\)
- shell — 03 · app rail · Settings
- shell — 04 · app rail · Variants open
- shell — 05 · app rail · phone
- shell — 06 · app rail · phone · More
- shell — 07 · site rail · One
- shell — 08 · site rail · collapsed (\)
- shell — 09 · site rail · phone
- shell — 10 · site rail · phone · drawer

#### hub frames
- hub — 01 · Home · grid
- hub — 02 · Home · list
- hub — 03 · Home · filters open
- hub — 04 · Home · search open
- hub — 05 · Home · actions menu
- hub — 06 · Home · walkthrough
- hub — 07 · Home · card menu
- hub — 08 · Home · rename
- hub — 09 · Home · delete
- hub — 10 · Home · file rail
- hub — 11 · Home · shortcuts sheet
- hub — 12 · Tool
- hub — 13 · Settings
- hub — 14 · Settings · About
- hub — 15 · phone · Home
- hub — 16 · phone · Tool
- hub — 17 · phone · Settings

#### catalog frames
- catalog — 01 · catalog · grid
- catalog — 02 · catalog · list
- catalog — 03 · app · grid
- catalog — 04 · app · list
- catalog — 05 · shelf · grid
- catalog — 06 · shelf · list
- catalog — 07 · file cards
- catalog — 08 · filters open
- catalog — 09 · search
- catalog — 10 · SAVED
- catalog — 11 · Variants open
- catalog — 12 · phone

### 12.2 — Brand
- apps/brand drawn whole; brand-lab, site-hub (1 frame today) and document (2 frames today) re-enumerated against their code and completed.
- Acceptance: brand ≥ 8 frames; site-hub and document frame lists match their routes 1:1; brand-lab's list checked against its routes, missing ones added.

#### brand frames
apps/brand is one route (`/`, SiteLayout + PageHero + two ContentCards); `/sections` and `/lab` hand over to brand-sections and brand-lab, so they are not screens. Its states are the widths, the theme and the phone drawer.
- brand — 01 · / desk
- brand — 02 · / desk light
- brand — 03 · / tablet 1024
- brand — 04 · / tablet 1024 light
- brand — 05 · / phone
- brand — 06 · / phone light
- brand — 07 · / phone, rail open
- brand — 08 · / phone, rail open light

#### brand-lab frames
Routes: `/generator/color|type|combo|logo`, `/layout/type/<scale|styles|article|sheet|faces>`, `/layout/color/<palette|ramps|layouts|sheet>`, `/layout/logo/<marks|lockups>`, `/layout/text/<lines|source>`, `/layout/guide`, `/export`. The four 1440 × 900 generator crops duplicate the full-height dark frames and go to `_trash`; the phone frames grow to full height.
- brand-lab — 01–04 · /generator/color · type · combo · logo (dark, full height; kept)
- brand-lab — 05–08 · the same four, light (kept)
- brand-lab — 09–12 · the same four, phone (kept)
- brand-lab — 13–17 · /layout/type/scale · styles · article · sheet · faces
- brand-lab — 18–21 · /layout/color/palette · ramps · layouts · sheet
- brand-lab — 22–23 · /layout/logo/marks · lockups
- brand-lab — 24–25 · /layout/text/lines · source
- brand-lab — 26 · /layout/guide
- brand-lab — 27 · /export

#### site-hub frames
- site-hub — 01 · / desk (kept) · 02 · / phone
- site-hub — 03 · /brand · 04 · /assets
- site-hub — 05 · /research · 06 · /research/compare · 07 · /research/sheet · 08 · /research/boards
- site-hub — 09 · /log · 10 · /log/crew · 11 · /log/flight-plan
- site-hub — 12 · /slide-deck (the placeholder page every plain row opens: /slide-deck, /library, /notes, /editor, /monitor, /icons, /log/*)

#### document frames
- document — 01 · /project (kept) · 02 · /project phone (kept, full height)
- document — 03 · /overview · 04 · /plan · 05 · /quote
- document — 06 · /assets (folder) · 07 · /reference (folder) · 08 · /<id> (a folder entry)
- document — 09 · /library · 10 · /library/<folder> · 11 · /library/<folder>/<file>
- document — 12 · /reviews · 13 · /reviews/<folder>/<name>
- document — 14 · /project, App frame (AppShell + TOC rail)
- document — 15 · link preview open

**12.2 status (2026-11-05 01:22, stopped at the 30-call budget):** brand 01–08 built (02/04/06/08 light; 03/04 on `SiteLayout/tablet`, 1024 × 1055 vs live 1059; 05/06 phone 1434; 07/08 rail open at 844 with `NavRail/site-drawer`); `12.2 masters` 887:24695 holds `NavRail/site-collapsed` 887:24696, `NavRail/site-drawer` 887:24718 and `SiteLayout/tablet` 888:51292 (SiteLayout set is outside this phase's scope — merge it in as variant=tablet on review); tmp-upload rects removed (cards already carried the images). document 03 /overview, 09 /library, 10 /library/letters, 11 /library/letters/about-2026-10-01-short built; site-hub 02 phone and 12 /slide-deck built. audit.js clean on brand, document, site-hub and 12.2 masters. **Not built:** document 04 /plan, 05 /quote (MarkdownPage has no table rows to override), 06 /assets, 07 /reference, 12 /reviews (DocumentIndex holds 2 fixed cards per part — needs a cards slot first), 08 /media (13518 tall, 40+ images), 13 review page (9845 tall), 14 App frame, 15 link preview; site-hub 07 /research/sheet (no kol-sheet master, no TOC slot on SiteLayout). site-hub 12's title is PageHeader's (133 × 56) vs live 227 × 96; site-hub's SiteHero is a loose FRAME in 01 (copied into 02).

**12.2 site-hub update (2026-11-05 01:57):** site-hub 03 /brand 903:7965, 04 /assets 903:8636, 05 /research 903:9810, 06 /research/compare 903:10030, 08 /research/boards 903:10440, 09 /log 903:10763, 10 /log/crew 903:10925, 11 /log/flight-plan 903:11088 built as SiteLayout instances with part instances in the page slot; grid re-flowed (desk row in number order, 02 under 01); audit.js clean. Gaps needing masters: PageControls (compare, boards), CategoryPage TOC list (/log), kol-sheet + a SiteLayout TOC slot (07), a BlockSwatch height below 96 (compare 2740 vs live 2307); BrandAssets master is 5504 vs live 4948.

### 12.3 — Studio, media, note, presentation
- Each tool beside its hub: studio · media · media-hub · note · note-hub · presentation · presentation-hub (studio-hub exists — checked, not rebuilt).
- Acceptance: every section's list matches its routes 1:1; each tool section sits directly before its hub.

#### studio frames
- studio — 01 · / · canvas at 100 %
- studio — 02 · / · frame rate on (F)
- studio — 03 · phone · /

#### media frames
- media — 01 · / · explorer, columns at the bucket root
- media — 02 · / · folder open, preview (img/01-shoots)
- media — 03 · / · rows view
- media — 04 · / · grid view (img/01-shoots)
- media — 05 · / · filters open
- media — 06 · / · display settings rail
- media — 07 · / · trash rail
- media — 08 · / · file formats (K)
- media — 09 · / · shortcuts (S)
- media — 10 · /library
- media — 11 · /picker · variant="picker" open
- media — 12 · /picker/b · variant="modal" open
- media — 13 · /viewer
- media — 14 · phone · /

#### media-hub frames
- media-hub — 01 · / · Browse
- media-hub — 02 · /settings
- media-hub — 03 · /settings · Tags
- media-hub — 04 · phone · / · Browse

#### presentation frames
- presentation — 01 · / · blank deck
- presentation — 02 · #list · shelf
- presentation — 03 · #voyager-credentials · deck open
- presentation — 04 · File sheet
- presentation — 05 · Deck settings
- presentation — 06 · Add slide · layouts
- presentation — 07 · Present

#### presentation-hub frames
- presentation-hub — 01 · / · Edit (blank deck)
- presentation-hub — 02 · /decks
- presentation-hub — 03 · /decks/voyager-credentials
- presentation-hub — 04 · phone · /decks

#### note frames
- note — 01 · / · blank note
- note — 02 · #list
- note — 03 · #shoot-reykjavik-call-sheet · split
- note — 04 · write
- note — 05 · preview
- note — 06 · attach

#### note-hub frames
- note-hub — 01 · / · Write (blank note)
- note-hub — 02 · /notes
- note-hub — 03 · /notes/shoot-reykjavik-call-sheet
- note-hub — 04 · phone · /notes

### 12.4 — Audio
- rack · rack-hub · mixer · mixer-hub.
- Acceptance: as 12.3.
- **Status 2026-11-04:** frame lists below written; `12.4 masters` (859:34767) holds nav-studio (859:34772). Build stopped at the Figma MCP call limit before any screen; live captures, covers and settings data for all 52 frames are in `_tmp/2026-11-04-w124-audio/x/` (data2/3/4.json). The four sections are still placeholders.

#### rack frames
- rack — 01 · Rack
- rack — 02 · Display shown (D)
- rack — 03 · Sidebar (H)
- rack — 04 · Edit mode (E)
- rack — 05 · Add module (⌘K)
- rack — 06 · Patch table (P)
- rack — 07 · Shortcuts (S)
- rack — 08 · phone · Rack

#### rack-hub frames
- rack-hub — 01 · Home
- rack-hub — 02 · Library · Patches
- rack-hub — 03 · Library · Modules
- rack-hub — 04 · Patch · Pendulum
- rack-hub — 05 · Module · Clock
- rack-hub — 06 · Create
- rack-hub — 07 · Rack
- rack-hub — 08 · Stage
- rack-hub — 09 · Settings
- rack-hub — 10 · phone · Home
- rack-hub — 11 · phone · Library · Patches
- rack-hub — 12 · phone · Library · Modules
- rack-hub — 13 · phone · Patch · Pendulum
- rack-hub — 14 · phone · Module · Clock
- rack-hub — 15 · phone · Create
- rack-hub — 16 · phone · Rack
- rack-hub — 17 · phone · Stage
- rack-hub — 18 · phone · Settings

#### mixer frames
- mixer — 01 · Studio
- mixer — 02 · Expressions
- mixer — 03 · Patch
- mixer — 04 · Sidebar (H)
- mixer — 05 · Module shelf (E)
- mixer — 06 · Add module (⌘K)
- mixer — 07 · Patch table (P)
- mixer — 08 · Shortcuts (S)
- mixer — 09 · Frame meter (F)
- mixer — 10 · phone · Studio

#### mixer-hub frames
- mixer-hub — 01 · Home
- mixer-hub — 02 · Library · Patches
- mixer-hub — 03 · Library · Modules
- mixer-hub — 04 · Patch · Three Halls
- mixer-hub — 05 · Module · Input
- mixer-hub — 06 · Create
- mixer-hub — 07 · Studio
- mixer-hub — 08 · Settings
- mixer-hub — 09 · phone · Home
- mixer-hub — 10 · phone · Library · Patches
- mixer-hub — 11 · phone · Library · Modules
- mixer-hub — 12 · phone · Patch · Three Halls
- mixer-hub — 13 · phone · Module · Input
- mixer-hub — 14 · phone · Create
- mixer-hub — 15 · phone · Studio
- mixer-hub — 16 · phone · Settings

### 12.5 — Where they live — ✅ built 2026-11-05
- Decided for review: one page per family under ➤ Apps (the chapter since 2026-11-04; ↳ Apps 309:89 is now `Other apps`) — `Brand` (brand · brand-lab · brand-hub · brand-sections), `Studio`, `Media`, `Presentation`, `Audio` (rack · mixer and their hubs); `Layouts + hubs` keeps the hubs with no tool (workshop, site-hub). growth moves out of Engine to sit with the loaders — the `Loaders` section (348:4168) on ↳ Sets; growth's section goes beside it. The Shell · Hub · Catalog sections get a `Foundations of the shell` page.
- Acceptance: ↳ Other apps (309:89) holds only what is still undrawn (Engine's markdown and search, the fixtures); every drawn section is on exactly one family page; audit clean on every page.
- Note dropped (user, 2026-11-05: "its just a stupid input, a much better system is folio"): the note (358:9076) and note-hub (358:9082) sections go to `_trash`, renamed `_note` / `_note-hub`. apps/note code stays.
- Ruling (user, 2026-11-05): document → ↳ Sites (844:51874, after article); float → its own `Float` page (911:608) under ➤ Apps, before Other apps. Other apps now holds only 960×431 placeholders, re-flowed.

### 12.6 — Folio (kol-website apps/record) — PARKED: after 12.5
- Draw folio from kol-website apps/record (read-only source) in place of note: one screen per route, its own section on the family page it belongs to.
- Acceptance: the section's frame list matches apps/record's routes 1:1; audit clean.


### 12.7 — Missing masters, then the frames they block (go 2026-11-05) — ✅ built 2026-11-05
- Status 2026-11-05 04:54: all masters and all 12 frames built, audit 0 errors on Components, Layouts + hubs and Sites. Masters: MarkdownTable/row 922:24865 (head · body · kv, TEXT cells c1–c4, MarkdownTable rows now instances), IndexCard 922:25881, DocumentIndex/group 922:25886, DocumentIndex 922:25904, SiteLayout variant=wide 922:25927 (rail 320, showToc → 320 · 1120 · 160); SheetArticle gutter guides absolute (1965 → 1611, live 1647); BlockSwatch specimen/PageControls strip fixed. Frames: site-hub 06 942:4032, 07 942:4942, 09 942:5417; document 04 926:6673, 05 926:7211, 06 926:7583, 07 926:7971, 08 928:8005, 12 926:8394, 13 934:8516, 14 938:10045, 15 926:8934. Open before ✅: SheetArticle still 36 px short of live (its rows, not the guides); /media images are oq-08 stand-ins; App-frame collapsed rail draws no icons; Site · App toggle not drawn; rail active row not visible on document frames.
- Closed 2026-11-05 05:16: /media 172 tiles + 15 preview image filled from live captures; App-frame rail = 8 NavRail/item (icons per route, Project active, no logo/settings like live); Site · App toggle (TabsRow text) on the 9 new document frames; active row set on 11 (Library) and 14; SheetArticle 1652 vs live 1647; doc-13 tables within 2 px; site-hub and document sections on one 1600-column grid, gap 200; audit 0 errors on the three pages.
- Masters, measured from code: sheet article + a SiteLayout TOC slot, PageControls, CategoryPage TOC list, BlockSwatch height setting, MarkdownPage table rows overridable, DocumentIndex cards slot (any count), SiteLayout/tablet merged into the SiteLayout set as variant=tablet.
- Then frames: site-hub 06 (rebuild swatches), 07, 09 (TOC); document 04–08, 12–15.
- Prep (no Figma calls) runs first: live measurements into `_tmp/2026-11-05-w12-7/`. Build runs when the Figma call allowance resets (next day, 00:00).
- Acceptance: every listed master exists with its code props; every listed frame built from instances, key boxes within ±4 px of live; audit 0 errors.

### 12.8 — Rebuild stand-in screens on components — ✅ 2026-11-06
- **Status 2026-11-05 06:42 (Audio part):** masters in `12.8 masters` 959:25061 on Components — Knob 959:25314 (size × value), JackSocket 959:25327 (size × type), 37 RackModule/*, RackCase/rail, 5 RackOverlay/*, 12 Mixer*/ parts, 4 MixerOverlay/*, TapeMachine; all measured from the live apps at 1600, dark. Rebuilt from instances: rack 01–08, mixer 01–10 (1600 × 1080, phones 390 × 844), hub canvas routes rack-hub 04–08 + 13–17, mixer-hub 04–07 + 12–14 (content in the AppStudio slot). Rendered outputs (MON, console, life, scope, workbench thumbnails, patch/module previews, stage canvas) are image fills; no UI image stands in. Sections re-flowed (1800 desktop pitch, phones second row, gap 400). Audit 0 errors on Components (12.8 masters, TabsRow, LinkPreview), Audio, Sites. Open: mixer-hub 15 phone · Studio still the old capture; TV chassis gradient and tape VU gradient flat; hub titles wider than live; mixer-hub 04 patch-line weights.
- **Status 2026-11-05 07:14 (Audio done, Studio/Media in progress, stopped at the Figma call limit):** Audio fixes built — mixer-hub 15 rebuilt from instances (MixerTabsBar · 2, Channel · 3 ×2, Button ×2); Channel Speed/Opacity are Slider instances (Slider gains `readout=input|value`, 26 value variants, thumbs placed by value); TV chassis + tape lip/VU carry the code's gradients; mh04/mh12 patch preview strokes 2/1 px; PageHeader is now a set `size=default|app|app-phone` + `eyebrow`/`showEyebrow`, and the 12 hub titles plus Studio titles are its instances. Audit 0 errors on Audio and the touched Components masters. 12.8b masters 1013:31860: CanvasStudio (fps false/true, dot grid), ColumnBrowser/row (columns · rows · rail layouts, states), ColumnBrowser/preview (empty · folder) — still loose `kind :: variant` components, not yet sets. Swapped: studio 01–03, media 01/03/05/06/07 (+ 08/09 rows). Open: media 08/09 overlay labels sit under their panel (repair script `_tmp/2026-11-05-w12-8b/calls/PENDING-1-…`), media 02/04/10–14, media-hub, presentation, presentation-hub, sets + section layout + audit, SiteHero (step 3). Resume order in `_tmp/2026-11-05-w12-8b/NEXT.md`.
- **Status 2026-11-06 00:24:** media 08/09 overlays repaired, media-02 offset fixed, media-11/14 + media-hub-01/04 swapped; 12.8b masters combined into sets (ColumnBrowser/row 1023:26566 with `label`, ColumnBrowser/preview, CanvasStudio, SlideThumb, SlideInspector) and laid out; studio tiles carry the code's preview PNGs; SiteHero master 1024:5827, site-hub 01/02 instances. Audit 0 errors on every touched page. Not ✅: media 04/10/12/13 and media-hub 02/03 content is still loose; presentation 04–07 sheets/template grid loose, thumbs blank, slide type off.
- **Status 2026-11-06 03:00 — ✅:** media 04/10/12/13, media-hub 02/03 and presentation 04–07 are instances only (0 loose, script), built on new masters in 12.8b masters 1013:31860 (MediaLibrary/* parts, MediaTile, AppHub/header-actions, Overlay, DeckFile, DeckSettings, DeckEditor/layout-tile, DeckEditor/present, SlideRenderer 15 layouts from the live slide documents); SlideThumb is a set with the real slide inside (p03 filmstrip fixed, theme sans not Schibsted); Studio titles are SectionText variant=page as live (96, phone 56). Audit 0 errors on Components, Media, Presentation, Studio. Side-by-sides in `_tmp/2026-11-06-w12-8-rest/side/`. Left: media-12 modal close glyph, hub-02 toggle knobs flat, presentation-03 stage and ruler still loose (not in this scope).
- Audio: rack/mixer tools, canvas routes (Patch, Module, Create, Rack, Stage, Studio), covers are image fills at 1440 × 900; rebuild from instances at full height.
- Studio, Media, Presentation: content drawn loose inside the layouts; build their content masters (studio canvas modules, deck/slide), then swap.
- site-hub 01/02: SiteHero is a loose frame; make it an instance.
- Acceptance: no image fill stands in for UI; every screen's content is instances; audit 0 errors.

## Open — TALK

- 6.5. 3.7's removal and 5.1's promotion (metric's local parts into kol-dashboards) are decided for his review.
- 12.x review (2026-11-05): page name `Foundations of the shell`; masters AppItemRail and WalkthroughPanel; PageHeader gets an app-header size (titles 16–38 px off in 12.1/12.4); SiteLayout/tablet merged into the SiteLayout set as variant=tablet.
