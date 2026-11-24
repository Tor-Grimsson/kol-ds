# Plan — Folio: web-style fixes, then the float element list

**Raised:** 2026-11-14, user. Points verbatim: *"quicklook … only shows quicklook like it would display an image, doesnt account for media type. there are audio, video, code, text, markdown, pdf and pdf also shows sidebar thumbnail"*; *"its not enough to write _trash, you have to MOVE TO TRASH PAGE, the _trash last page in the page list"*; *"wrong writer split, its just about showing two documents/tabs in the same view, not two loads of the website"*; *"writer text has view modes? like layout? wrap to page?"*; *"we are gonna make a float variation and i need to know what elements to design for so that the tranition to code is simple and quick"*.
**Status:** BUILT 2026-11-14 — W1.1, 1.2, 1.3, 1.5 on 455:336247 (Parts 504:1663), audit 0; W2.1 table aligned to the Parts names. W1.4 parked.
**Shape:** W › phase › list.
**Laws carried:** kol-figma LAW 4, 10, 19, 20; content leaves the page to the `_trash` PAGE (last in the list), never a `_trash` frame on the page; empty frames removed; no middot in names; web-style page is record's look in plain frames.
**Home:** float file 879P1yBsBPqpdGI5a5v2Y5, page `↳ ebook-web-style` (455:336247).
**How a phase closes:** acceptance line first, audit 0, one look-check at the end.

## W1 — Web-style fixes

### 1.1 — Trash to the trash page (P: "MOVE TO TRASH PAGE")
- Every `_trash` frame/section on 455:336247 (488:975 and any other) moves to the last page, `_trash`; the emptied holders are removed.
- Acceptance: 0 nodes named `_trash*` on 455:336247; their contents found on the `_trash` page.

### 1.2 — Writer split is one view (P: "two documents/tabs in the same view")
- One tab strip with both tabs, one document header, menu bar and toolbar; the body splits into two document panes. Record draws it as an iframe that repeats the whole editor; the design follows the intent, not the iframe.
- Acceptance: 1 chrome, 2 panes; 0 repeated header/menu/toolbar in the frame.

### 1.3 — Rich text page views (P: "view modes? like layout? wrap to page?")
- Record's `Page view` (Rich.jsx): Wrap (fills the window, drawn), One up (a page on the grey desk), Two up (a spread, text running on). Add One up and Two up.
- Acceptance: 2 screens added beside Writer text rich; page width and desk ground equal the live render.

### 1.4 — Quick Look by kind (P: "audio, video, code, text, markdown, pdf … sidebar thumbnail") — PARKED: kol-ds-ui library file work, folded in with the next library round (his word 2026-11-14)
- `FileQuickLook` (kol-component) draws each kind through `KindPreview`: image, video (player), audio (player), PDF (every page + thumbnail rail), markdown (rendered), text, code (highlighted). One Quick Look screen per kind, measured from a live render of the DS component.
- Acceptance: 7 screens in the reader section, one per kind; PDF shows its thumbnail rail.

### 1.5 — A Parts section (P: "a seperate section with componetn parts would be helpful as reference … currently everything only lives in those views")
- New section `Parts` on the page: every element drawn once, on its own, cut from the existing screens (no redraw), named by its name in record's code: Masthead, LibraryTree, EditorRail, Tabs, DocumentHeader, MenuBar, Items (menu), ContextMenu, Choice (dropdown), SettingsMenu, ToolRow (markdown, rich, code), Ruler, FindBar, StatusBar, NewOverlay, CommandPalette, SearchOverlay, KeysPanel (Shortcuts), reader Contents, reader bar. Plain frames, not components; one row per family (chrome, rails, surfaces, toolbars).
- Acceptance: every row of the W2.1 table has its part in the section, named the same; 0 overlaps; audit 0.

## W2 — The float element list (P: "what elements to design for")

### 2.1 — Folio elements mapped to KOL float parts
- One table: every Folio element → the KOL float part that takes its place, or NEW where none exists. Draft below; the review closes it.

| Part (Parts section, record's name) | KOL float part | |
|---|---|---|
| Masthead | `Header` + `GlobalActions` | exists |
| Tabs | `TabsRow` | exists |
| DocumentHeader | `DocumentCapsule` + `ButtonSplit` | exists |
| MenuBar | `MenuFloat` per menu | exists |
| StatusBar | — | NEW |
| Reader bar | `ReaderBar` | exists |
| LibraryTree | `RailFloat` + `TreeRow` | exists |
| EditorRail | `RailFloat` + `LabeledControl` rows (RailSettings) | exists |
| ContentsRail | `ReadingContents` | exists |
| Items (menu) | `MenuFloat` | exists |
| ContextMenu | `ContextMenu` | exists |
| Choice (dropdown) | `Dropdown` | exists |
| SettingsMenu | `ModalShell` + `LabeledControl` rows (ModalSettings) | exists |
| NewOverlay | `ModalDialog` | exists |
| CommandPalette | — | NEW |
| SearchOverlay | `ShellSearchOverlay` (the search modal) | exists |
| KeysPanel | `ShortcutsOverlay` | exists |
| ToolRow markdown / rich / code | — | NEW (one float toolbar, three sets of tools) |
| Ruler | — | NEW |
| FindBar | — | NEW |
| Quick Look | `FileQuickLook` | exists (kinds parked, W1.4) |
| Page bodies: library (intro, controls, shelf, catalogue), reader chapter + margin, article, writing surfaces | — | content: stays Folio's |

- Acceptance: every element on the web-style page has a row; each NEW row is a part to design in the float round.

## W3 — Every part, the table on the page, the layout — ✅ built 2026-11-14 (Parts 504:1663, table 516:542, layout 516:833) (P: "should the parts not include all the parts? … so that when we design for float, or for any style, we know what to account for, and can reference both a table list and a visual section")

### 3.1 — Parts at every level
- The Parts section (504:1663) grows to the full set, each cut once from the screens, named as in record's code, one row per level:
  - Atoms: Button, Tool (icon + label), Done (primary), Field (input), Choice trigger, Write/Split/Preview switch, tab, tree row, menu row, tag, icon.
  - Molecules: ToolRow markdown / rich / code, Ruler, FindBar, StatusBar, book card, chapter row.
  - Organisms: Masthead, Tabs, DocumentHeader, MenuBar, the rail (one part) with its contents: LibraryTree, EditorRail, ContentsRail (left), Margin (right); the surfaces (Items, ContextMenu, Choice list, SettingsMenu, NewOverlay, CommandPalette, SearchOverlay, KeysPanel).
  - Main content: editor source pane, preview pane, rich page (wrap, one up, two up), code view, reader chapter, article, library intro, controls, shelf, catalogue.
- Acceptance: every element visible on the page's screens has a part; each part appears once; names equal the code's; 0 overlaps; audit 0.

### 3.2 — The table on the page
- The W2.1 table drawn as a frame beside Parts: part · level · KOL float part · exists / NEW / content. Plain text frames, no components.
- Acceptance: one table row per part in 3.1 (counts equal); every NEW row named.

### 3.3 — The Folio layout
- One `Folio layout` frame: slots for masthead, tabs, document header, left rail, main, right rail, status bar; the slots labelled by their part. A frame now, the layout component later (screens become its instances when the float round builds it).
- Acceptance: 1 frame, 1440×900, every slot named after the part that fills it.

## Order
W1.1 → W1.2 → W1.3 → W1.5 → W2.1 (built 2026-11-14). Then W3.1 → W3.2 → W3.3, one kol-figma-agent. Nothing published.
