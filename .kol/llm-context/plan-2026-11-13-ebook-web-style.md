# Plan — ebook web style, finished, light

**Raised:** 2026-11-13, user. Points verbatim: *"finish the website style, thats' to add the remaining views of the editor [text and code], the overlays [shortcuts and search] … make a new page specifially for that in LIGHT mode … dont use components, as there are none, just reference kol-website/apps/record while you make the frames."*
**Status:** BUILT 2026-11-13 — W1.1, W2.1–2.3, W3.1 on 455:336247; audit 0 errors. Editor rail kept at code's 300 (website style carries record verbatim; LAW 6 is float only).
**Shape:** W › phase › list.
**Laws carried:** kol-figma LAW 4 (clip on), 10 (named layers, no `Frame`, no empty/spacer frames), 19 (no loose text in sections), 20 (screens 1440×900 fixed, clipped); never delete (anything replaced goes to `_trash` with a `_` name). LAW 2/14 (components only) is lifted for this page on his word: plain named frames.
**Source:** kol-website `apps/record` — `src/folio/FolioWrite.jsx`, `EditorChrome.jsx`, `Chrome.jsx` (`SearchOverlay`), routes `/demo-4`, `/demo-4/new`, `/demo-4/edit/…`; light theme. Overlay reference: 455:336246.
**Home:** page `↳ ebook-web-style` (455:336247) — sections `website style` (455:336248) and `website style editor [partly]` (455:337790).
**How a phase closes:** acceptance line first, audit 0, then one look-check of the page at the end.

## W1 — Editor in light (P: "LIGHT mode")

### 1.1 — Existing editor frames to light
- The 5 frames in 455:337790 are dark; redraw their fills and inks to record's light theme, same layout. `Frame 6` and `Frame 14` get real names.
- Acceptance: 0 dark-ground screens on the page; 0 layers named `Frame…`; audit 0.

## W2 — Editor views: Text and Code (P: "remaining views of the editor [text and code]")

### 2.1 — Text format
- Rich text (with the ruler band) and Plain text, each as record renders `/demo-4/new` in that format: menu bar, tabs, writing surface, status bar showing the format.
- Acceptance: 2 screens, 1440×900 clipped; every label equals record's source strings (script diff 0).

### 2.2 — Code format
- The CodeMirror view with a JS starter, the status bar's language and view, and the settings Rail open at Shortcuts for Code.
- Acceptance: 2 screens (editor, editor + Rail), 1440×900 clipped; labels script-diff 0 against `shortcutsFor('Code')` and EditorChrome.

### 2.3 — The writer's right Rail (P: "there also is in writer a right rail … make it also")
- `EditorRail` (FolioWrite.jsx), toggled by the toolbar's Rail button: Document (Shelf, Format, File, Length), Details (Date, Language is·en·de, Description, Markdown only), Shortcuts by group. On the Markdown editor; full rail height, its scroll cut by the frame.
- Acceptance: 1 screen, 1440×900 clipped; the rail's three heads and every row equal the source (script diff 0).

## W3 — Overlays (P: "the overlays [shortcuts and search]")

### 3.1 — Shortcuts and Search
- Over the library (`My library`, 455:336248's light library frame as the page behind with its scrim): the Shortcuts panel (6 rows, as 455:336246 top) and the Search modal with results (as 455:336246 bottom).
- Acceptance: 2 screens, 1440×900 clipped; Shortcuts rows equal record's list (6/6); Search shows query, result rows with section tag, path and highlighted snippet; audit 0.

## Order
W1 → W2 → W3, one kol-figma-agent in the background. Nothing published.
