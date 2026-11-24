# Plan — ebook web style, round 2: record only, every surface, the missing views

**Raised:** 2026-11-13, user. Points verbatim: *"w12 leave them tall"*; *"yes the quicklook! right"*; *"we just need the style, not the entire content of every dropdown"*; *"why did you keep the float modals? I just included them to show that these are elements in the system … I just needed this in the style it is in kol-website/apps/record"*; *"I would like those modals"* (menu bar options, dropdowns, document header, export, tabs, footer, rails); *"ok add those and make [455:336247] better, dont need the float here"*.
**Status:** BUILT 2026-11-13 — all of W1–W4 on 455:336247; audit 0 errors, 0 float instances. Quick Look scan is a grey stand-in (original on the private server).
**Shape:** W › phase › list.
**Laws carried:** kol-figma LAW 4 (clip on), 10 (named layers, 0 empty frames), 11 (a set means every member), 19 (no loose text in sections), 20 (1440×900, clipped); no components on this page (his word: the system is not ready); light; no middot in names; content to `_trash` (`_` prefix), empty frames removed, never trashed.
**Source:** kol-website `apps/record/src/folio/` (read-only), light theme, live render where it renders. Three surface styles, each kept as code draws it:
- Reader overlays (Search, Shortcuts): radius 3, 1px rule border, paper, shadow 0 24 64 / 18%.
- Reader dropdowns (`Choice`, Settings popover): radius 3, border, paper, shadow 0 16 48 / 14%.
- Editor (menu bar menus, right-click, New document, Commands): radius 4, border, paper, shadow 0 2 6 −2 / 30% + 0 8 24 −8 / 40%.
**Home:** page `↳ ebook-web-style` (455:336247), sections `Website style` (475:975) and `Website style editor` (475:981).
**How a phase closes:** acceptance line first, audit 0, one look-check of the page at the end.

## W1 — Record style only (P: "dont need the float here")

### 1.1 — Float frames off the page
- Section `Writer float rails` (edit, new document, find, rail) leaves: its screens are content, so `_trash`.
- Acceptance: 0 float instances (RailFloat, RailTrigger, any float part) and 0 float screens on the page.

### 1.2 — Writer preview to a real screen (P: "just make it like its supposed to be")
- The tall website pages stay tall (his ruling). `Writer preview` (397 wide) is redrawn as the full editor in Preview mode, 1440×900, as record renders it.
- Acceptance: Writer preview 1440×900 clipped; bands and text equal the live render.

## W2 — The surfaces, one sheet per view (P: "just make an extra frame of the writer for all the dropdowns? and other view that have modals?")

### 2.1 — Writer surfaces
- One extra Writer frame with its menus and dropdowns drawn open side by side (File menu, right-click menu, Commands, Save to bucket, Shelf, Format, status bar Text/Wrap, rich toolbar dropdowns): the style shown, not every item of every list.
- Acceptance: 1 frame; editor-style menus at radius 4 + editor shadow, `Choice` dropdowns at radius 3 + dropdown shadow, equal to the code.

### 2.2 — Library and reader surfaces
- One extra Library frame (Call number sort, Settings popover) and one extra reader frame (Settings popover, Contents). Search and Shortcuts already drawn; their surface checked, fixed only if wrong.
- Acceptance: 2 frames; overlay style radius 3 + 0 24 64 / 18%, dropdown style radius 3 + 0 16 48 / 14%.

## W3 — Missing views (P: "is there other things im not seeing")

### 3.1 — Originals Quick Look
- `FileQuickLook` open on the reader over a book's original scan.
- Acceptance: 1 screen; file name, counter and controls equal the live render.

### 3.2 — Editor states
- Find & replace bar open; a second document open beside (split); writing mode (W: tabs, header, menu and rails hidden); View → Canvas dark (writing surface dark, chrome light).
- Acceptance: 4 screens, each equal to the live render's bands.

## W4 — Page order (P: "make it better")

### 4.1 — One section per view
- Sections: Library, Folio reader, Folio article, Folio styles, Writer, Writer text, Writer code, Writer surfaces, Library surfaces, Reader surfaces, Writer states. Base screen top-left, its states under it, no overlaps, plain names.
- Acceptance: every screen in a view section; 0 overlaps; 0 names with `·`, `-d`/`-l` or `Frame`; audit 0.

## Order
W1.1 → W2 → W3 → W4, one kol-figma-agent in the background. Add document is `/demo-4/new` (New document picker), already drawn; the file tree is the LibraryTree rail, already on every editor and reader screen. Nothing published.
